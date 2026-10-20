#!/usr/bin/env python3
"""Local-browser checks for clear-all, share links, Markdown, PNG and SVG."""

import argparse
import json
from pathlib import Path
import struct
import tempfile
import xml.etree.ElementTree as ET
from urllib.parse import urlparse, parse_qs

from selenium import webdriver
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--url", default="http://127.0.0.1:18765/")
    args = parser.parse_args()
    output = Path(tempfile.mkdtemp(prefix="penguin-result-actions-"))
    options = Options()
    options.binary_location = "/usr/bin/chromium"
    for flag in ("--headless=new", "--no-sandbox", "--disable-dev-shm-usage", "--no-proxy-server"):
        options.add_argument(flag)
    options.set_capability("goog:loggingPrefs", {"browser": "ALL"})
    driver = webdriver.Chrome(service=Service("/usr/bin/chromedriver"), options=options)
    wait = WebDriverWait(driver, 20)
    driver.execute_cdp_cmd("Browser.setDownloadBehavior", {"behavior": "allow", "downloadPath": str(output)})
    origin = urlparse(args.url)
    driver.execute_cdp_cmd("Browser.grantPermissions", {
        "origin": f"{origin.scheme}://{origin.netloc}",
        "permissions": ["clipboardReadWrite", "clipboardSanitizedWrite"],
    })

    def find(selector):
        return driver.find_element(By.CSS_SELECTOR, selector)

    def count(selector):
        return len(driver.find_elements(By.CSS_SELECTOR, selector))

    def choose(category, value):
        find(".filter-toggle").click()
        find(f'[data-filter-category="{category}"]').click()
        find(f'[data-filter-value="{value}"]').click()

    def exported(action):
        find(".export-toggle").click()
        find(f'[data-export="{action}"]').click()
        wait.until(lambda _: find(".action-status").text not in ("Preparing…", "正在准备…"))
        return find(".action-status").text

    def clipboard(expression):
        return driver.execute_async_script(f"""
            const done=arguments[0];({expression}).then(done,err=>done({{error:err.message}}));
        """)

    def cleared(view):
        assert count(".harness-details-button") == 38
        assert count(".filter-clear") == 0
        assert not find(".filter-count").is_displayed()
        assert find(".filter-toggle").get_attribute("aria-expanded") == "false"
        assert driver.execute_script("return document.activeElement===elements.filterToggle")
        params = parse_qs(urlparse(driver.current_url).query)
        assert not any(key in params for key in ("source", "harness", "model", "thinking")), params
        assert params["view"] == [view] and params["version"] == ["2.1"], params

    try:
        driver.set_window_size(1440, 900)
        driver.get(args.url)
        wait.until(lambda _: count(".harness-details-button") == 38)
        driver.execute_script('setLocale("en");setTheme("light")')
        # Clearer action icons have translated, dismissible hover/keyboard hints.
        for selector, hint, label in ((".export-toggle", "#export-hint", "Copy / export results"),
                                      (".copy-link", "#copy-link-hint", "Copy filters link")):
            ActionChains(driver).move_to_element(find(selector)).perform()
            assert find(hint).is_displayed() and find(hint).text == label
            assert find(selector).get_attribute("aria-describedby") == hint[1:]
        driver.save_screenshot(str(output / "link-hint-desktop.png"))
        ActionChains(driver).move_to_element(find("#copy-link-hint")).perform()
        assert find("#copy-link-hint").is_displayed()
        driver.switch_to.active_element.send_keys(Keys.ESCAPE)
        assert not find("#copy-link-hint").is_displayed()
        ActionChains(driver).move_to_element(find(".results-title")).perform()
        driver.execute_script("elements.exportToggle.focus()")
        driver.switch_to.active_element.send_keys(Keys.TAB)
        assert driver.execute_script("return document.activeElement===elements.copyLink")
        assert find("#copy-link-hint").is_displayed()
        driver.switch_to.active_element.send_keys(Keys.ESCAPE)
        assert not find("#copy-link-hint").is_displayed()
        find(".filter-toggle").click()
        assert count(".filter-clear") == 0
        find(".filter-toggle").click()
        # Four independent filter keys, clear through the menu's keyboard path.
        for category, value in (("source", "penguin_run"), ("harness", "Penguin"),
                                ("model", "DeepSeek-V4-Flash-0731"), ("thinking", "max")):
            choose(category, value)
        assert count(".harness-details-button") == 5
        assert find(".filter-count").text == "4"
        find(".filter-toggle").send_keys(Keys.ARROW_DOWN)
        driver.switch_to.active_element.send_keys(Keys.END)
        assert driver.switch_to.active_element.get_attribute("class") == "filter-clear"
        driver.save_screenshot(str(output / "clear-all-selected.png"))
        driver.switch_to.active_element.send_keys(Keys.ENTER)
        cleared("table")
        # Manually resetting the final filter also removes the action.
        choose("source", "penguin_run")
        choose("source", "")
        assert count(".filter-clear") == 0

        # Share URL captures selection/view/sort, and opening it restores them.
        choose("source", "penguin_run")
        driver.execute_script('setSort("accuracy")')
        driver.execute_script("""
            window.feedbackDuration=null;
            let started;
            const status=elements.actionStatus;
            const observer=new MutationObserver(()=>{
                if (!status.hidden && status.textContent==="Copied") started=performance.now();
                else if (status.hidden && started!==undefined) {
                    window.feedbackDuration=performance.now()-started;
                    observer.disconnect();
                }
            });
            observer.observe(status,{attributes:true,childList:true,subtree:true});
        """)
        find(".copy-link").click()
        wait.until(lambda _: find(".action-status").text == "Copied")
        assert not find("#copy-link-hint").is_displayed()
        link = clipboard("navigator.clipboard.readText()")
        params = parse_qs(urlparse(link).query)
        assert params["source"] == ["penguin_run"] and params["sort"] == ["accuracy"]
        assert params["direction"] == ["desc"] and "v" not in params
        WebDriverWait(driver, 3, poll_frequency=.05).until(
            lambda _: driver.execute_script("return window.feedbackDuration!==null"))
        duration = driver.execute_script("return window.feedbackDuration")
        assert 900 <= duration <= 1800, duration
        assert not find(".action-status").is_displayed()
        driver.get(link)
        wait.until(lambda _: count(".harness-details-button") == 6)
        assert find(".column-accuracy").get_attribute("aria-sort") == "descending"

        # Real clipboard text; includes exactly the filtered rows, in order.
        assert exported("markdown") == "Copied"
        markdown = clipboard("navigator.clipboard.readText()")
        assert len([line for line in markdown.splitlines() if line.startswith("|")]) == 8, markdown
        assert markdown.index("76.6%") < markdown.index("62.5%")
        assert "(max)" in markdown and "RANK" in markdown and "COST" in markdown

        # Export full width even while the scrollport is scrolled sideways.
        driver.execute_script("elements.tableWrap.scrollLeft=400;elements.tableWrap.scrollTop=200")
        assert exported("svg") == "Downloaded"
        svg_path = output / "terminal-bench-2.1-table.svg"
        wait.until(lambda _: svg_path.exists())
        root = ET.parse(svg_path).getroot()
        assert root.get("width") and root.get("height")
        assert "76.6%" in "".join(root.itertext()) and "62.5%" in "".join(root.itertext())
        assert "COST" in "".join(root.itertext()) and "SOURCE" in "".join(root.itertext())
        assert "data:image/svg+xml;base64," in svg_path.read_text()
        assert exported("png") == "Downloaded"
        png_path = output / "terminal-bench-2.1-table.png"
        wait.until(lambda _: png_path.exists())
        png = png_path.read_bytes()
        assert png[:8] == b"\x89PNG\r\n\x1a\n" and png[12:16] == b"IHDR"
        width, height = struct.unpack(">II", png[16:24])
        assert width >= int(root.get("width")) and height >= int(root.get("height"))
        assert exported("copy-png") == "Copied"
        types = clipboard("navigator.clipboard.read().then(items=>items.flatMap(item=>item.types))")
        assert "image/png" in types, types
        find(".filter-toggle").click()
        find(".filter-clear").click()
        cleared("table")
        assert find(".column-accuracy").get_attribute("aria-sort") == "descending"
        # All 38 rows are in a full export, including rows below the scrollport.
        previous_size = svg_path.stat().st_size
        assert exported("svg") == "Downloaded"
        # CDP's allow-download mode overwrites an existing filename.
        wait.until(lambda _: svg_path.stat().st_size > previous_size)
        full_table = ET.parse(svg_path).getroot()
        assert int(full_table.get("height")) > 2500
        # Export every model-series fill using the actual theme's computed
        # color, including rows that were outside the visible scrollport.
        palette = driver.execute_script("""
            return [...new Set([...document.querySelectorAll(".accuracy-fill")]
                .map(fill => getComputedStyle(fill).backgroundColor))];
        """)
        fills = {rect.get("fill") for rect in full_table.iter("{http://www.w3.org/2000/svg}rect")}
        assert len(palette) == 9 and set(palette) <= fills, (palette, fills)
        assert "rgb(17, 17, 17)" in fills  # Error whiskers remain black.

        # Pareto exports are standalone and clear-all restores all plotted dots.
        find("#pareto-tab").click()
        choose("source", "penguin_run")
        assert count(".pareto-point") == 6
        assert exported("svg") == "Downloaded"
        chart = output / "terminal-bench-2.1-pareto.svg"
        wait.until(lambda _: chart.exists())
        chart_text = chart.read_text()
        assert "Pareto Frontier" in chart_text and "var(--" not in chart_text
        assert chart_text.count('class="pareto-point ') + chart_text.count('class="pareto-point"') == 6
        assert exported("png") == "Downloaded"
        wait.until(lambda _: (output / "terminal-bench-2.1-pareto.png").exists())
        find(".filter-toggle").click()
        find(".filter-clear").click()
        cleared("pareto")
        assert count(".pareto-point") == 27
        find("#table-tab").click()

        # Mobile and Chinese localization, with a four-filter badge.
        driver.execute_cdp_cmd("Emulation.setDeviceMetricsOverride", {
            "width": 320, "height": 568, "deviceScaleFactor": 1, "mobile": False,
        })
        driver.execute_script('setLocale("zh");setTheme("dark")')
        ActionChains(driver).move_to_element(find(".copy-link")).perform()
        assert find("#copy-link-hint").text == "复制当前筛选链接"
        assert find("#copy-link-hint").is_displayed()
        assert driver.execute_script("""
            const r=document.querySelector("#copy-link-hint").getBoundingClientRect();
            return r.left>=0 && r.right<=innerWidth && r.top>=64;
        """)
        driver.save_screenshot(str(output / "link-hint-mobile.png"))
        ActionChains(driver).move_to_element(find(".results-title")).perform()
        for category, value in (("source", "penguin_run"), ("harness", "Penguin"),
                                ("model", "DeepSeek-V4-Flash-0731"), ("thinking", "max")):
            choose(category, value)
        find(".filter-toggle").click()
        assert find(".filter-clear").text == "清除全部"
        assert driver.execute_script("return document.documentElement.scrollWidth <= innerWidth")
        assert find(".filter-clear").rect["y"] + find(".filter-clear").rect["height"] <= 568
        driver.save_screenshot(str(output / "clear-all-mobile.png"))
        find(".filter-clear").click()
        cleared("table")

        # Clipboard denial must show an error, not a false success.
        driver.execute_script("""
            setLocale("en");
            Object.defineProperty(navigator,"clipboard",{configurable:true,value:{
                writeText:()=>Promise.reject(new Error("Denied")),
                write:()=>Promise.reject(new Error("Denied"))
            }});
        """)
        assert "unavailable or denied" in exported("markdown")
        assert "unavailable or denied" in exported("copy-png")
        find(".copy-link").click()
        wait.until(lambda _: "Could not copy" in find(".action-status").text)
        errors = [entry for entry in driver.get_log("browser") if entry["level"] == "SEVERE"]
        assert not errors, errors
        print(json.dumps({"passed": True, "artifacts": str(output)}))
    finally:
        driver.quit()


if __name__ == "__main__":
    main()
