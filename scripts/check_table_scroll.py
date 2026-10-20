#!/usr/bin/env python3
"""Optional Chromium UI regression check (requires Selenium + chromedriver).

Run against an already-running local site, without publishing anything:
    python3 scripts/check_table_scroll.py --url http://127.0.0.1:18765/
"""

import argparse
import json
import tempfile
import time
from pathlib import Path

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--url", default="http://127.0.0.1:18765/")
    parser.add_argument("--browser", default="/usr/bin/chromium")
    parser.add_argument("--driver", default="/usr/bin/chromedriver")
    args = parser.parse_args()
    output = Path(tempfile.mkdtemp(prefix="penguin-table-scroll-"))
    options = Options()
    options.binary_location = args.browser
    for flag in ("--headless=new", "--no-sandbox", "--disable-dev-shm-usage", "--no-proxy-server"):
        options.add_argument(flag)
    options.set_capability("goog:loggingPrefs", {"browser": "ALL"})
    driver = webdriver.Chrome(service=Service(args.driver), options=options)
    wait = WebDriverWait(driver, 15)
    reports = []

    def measure():
        return driver.execute_script("""
            const rect = selector => {
                const r = document.querySelector(selector).getBoundingClientRect();
                return {top:r.top,bottom:r.bottom,left:r.left,right:r.right,height:r.height};
            };
            const wrap = document.querySelector(".table-wrap");
            return {
                title:rect(".results-title"), toolbar:rect(".result-toolbar"),
                card:rect(".leaderboard-card"), wrap:rect(".table-wrap"),
                header:rect(".results-head th"), last:rect(".results-body tr:last-child"),
                pageY:scrollY, pageX:scrollX,
                pageHeight:document.documentElement.scrollHeight,
                pageWidth:document.documentElement.scrollWidth,
                viewport:innerHeight, scrollTop:wrap.scrollTop,
                scrollLeft:wrap.scrollLeft, scrollWidth:wrap.scrollWidth,
                tableWidth:rect("table").right-rect("table").left,
                scrollHeight:wrap.scrollHeight, clientHeight:wrap.clientHeight,
                externalToolbar:!document.querySelector(".leaderboard-card .result-toolbar"),
                titleFontSize:parseFloat(getComputedStyle(document.querySelector(".results-title")).fontSize)
            };
        """)

    def wheel(delta, horizontal=0):
        area = measure()["wrap"]
        driver.execute_cdp_cmd("Input.dispatchMouseEvent", {
            "type": "mouseWheel", "x": area["left"] + 30,
            "y": area["bottom"] - 30, "deltaX": horizontal, "deltaY": delta,
        })
        time.sleep(.25)

    def check_table_styling():
        result = driver.execute_script("""
            const interval = document.querySelector(".rate-copy span");
            const score = interval.previousElementSibling;
            const row = interval.closest("tr");
            const timeout = row.querySelector("td:nth-child(5)");
            const font = getComputedStyle(interval);
            return {
                fontMatches:font.fontSize === getComputedStyle(score).fontSize,
                colorMatches:font.color === getComputedStyle(timeout).color,
                rowLine:getComputedStyle(timeout).borderBottomColor,
                expectedLine:document.documentElement.dataset.theme === "dark"
                    ? "rgb(45, 55, 69)" : "rgb(223, 227, 232)",
                effortStyle:[...document.querySelectorAll(".model-effort")].every(span => {
                    const style = getComputedStyle(span);
                    const rect = span.getBoundingClientRect();
                    const name = span.previousElementSibling.getBoundingClientRect();
                    const cell = span.closest("td").getBoundingClientRect();
                    return style.borderWidth === "0px"
                        && style.backgroundColor === "rgba(0, 0, 0, 0)"
                        && style.fontWeight === "400"
                        && rect.left >= name.right && rect.right <= cell.right
                        && Math.abs(rect.top - name.top) <= 1;
                }),
                noOverlap:[...document.querySelectorAll(".rate-copy span")].every(span => {
                    const bar = span.closest(".rate-cell").querySelector(".accuracy-track");
                    return span.getBoundingClientRect().right + 6 <= bar.getBoundingClientRect().left
                        && bar.getBoundingClientRect().width === 260;
                })
            };
        """)
        assert result["fontMatches"] and result["colorMatches"] and result["noOverlap"], result
        assert result["effortStyle"], result
        assert result["rowLine"] == result["expectedLine"], result

    def check_headers_and_corners():
        result = driver.execute_script("""
            const headers = [...document.querySelectorAll(".results-head th")];
            const cells = [...document.querySelector(".results-body tr").cells];
            const textRect = element => {
                const range = document.createRange();
                range.selectNodeContents(element);
                return range.getBoundingClientRect();
            };
            const bodyColor = getComputedStyle(document.body).color;
            const columns = headers.map((th, index) => {
                const label = th.querySelector("button") || th;
                const td = cells[index];
                const style = getComputedStyle(label);
                const rect = textRect(label);
                return {
                    label:label.innerText, left:textRect(td).left,
                    headerLeft:rect.left, color:style.color,
                    aligned:Math.abs(rect.left-textRect(td).left) < 1,
                    singleLine:rect.height < 28,
                    uppercase:label.innerText === label.innerText.toUpperCase(),
                    fits:rect.right <= th.getBoundingClientRect().right-10,
                    foreground:style.color === bodyColor,
                    width:th.getBoundingClientRect().width
                };
            });
            const rounded = [...document.querySelectorAll("body *")]
                .filter(el => !(el instanceof SVGElement) && el.getClientRects().length)
                .filter(el => {
                    const s = getComputedStyle(el);
                    return [s.borderTopLeftRadius,s.borderTopRightRadius,
                            s.borderBottomLeftRadius,s.borderBottomRightRadius]
                        .some(radius => radius !== "0px");
                }).map(el => el.className || el.tagName);
            return {columns, rounded};
        """)
        assert all(column["aligned"] and column["singleLine"] and column["uppercase"]
                   and column["fits"] and column["foreground"] for column in result["columns"]), result
        assert not result["rounded"], result
        return [column["width"] for column in result["columns"]]

    try:
        for width, height in ((1440, 900), (1280, 720), (1100, 800), (768, 1024),
                              (390, 844), (320, 568), (844, 390)):
            driver.execute_cdp_cmd("Emulation.setDeviceMetricsOverride", {
                "width": width, "height": height, "deviceScaleFactor": 1, "mobile": False,
            })
            driver.get(args.url)
            wait.until(lambda _: len(driver.find_elements(By.CSS_SELECTOR, ".harness-details-button")) == 38)
            driver.execute_script('setLocale("zh");setTheme("light")')
            time.sleep(.1)
            check_table_styling()
            column_widths = check_headers_and_corners()
            initial = measure()
            assert abs(initial["titleFontSize"] - min(40, max(28, width * .03))) < .1, initial
            assert initial["title"]["height"] <= initial["titleFontSize"] * 1.25 + 1, initial
            assert initial["pageWidth"] <= width + 1 and initial["pageX"] == 0, initial
            assert initial["scrollWidth"] > initial["wrap"]["right"] - initial["wrap"]["left"], initial
            assert len(driver.find_elements(By.CSS_SELECTOR, ".results-head th")) == 8
            assert driver.find_element(By.CSS_SELECTOR, ".model-effort").text == "(high)"
            assert not driver.find_elements(By.CSS_SELECTOR, ".effort-pill, .github-stars, .column-thinking-level, .thinking-cell")
            assert not driver.find_elements(By.CSS_SELECTOR, ".table-hint")
            assert not driver.find_element(By.CSS_SELECTOR, ".github-link").text.strip()
            assert initial["externalToolbar"], initial
            assert initial["pageHeight"] <= height + 1 and initial["pageY"] == 0, initial
            assert initial["scrollHeight"] > initial["clientHeight"] >= 120, initial
            assert initial["toolbar"]["bottom"] <= initial["card"]["top"] + 1, initial
            assert initial["title"]["top"] >= 64, initial
            if width in (1440, 390):
                driver.save_screenshot(str(output / f"initial-{width}-zh.png"))
            wheel(500)
            scrolled = measure()
            assert scrolled["scrollTop"] > 100, scrolled
            assert scrolled["pageY"] == 0, scrolled
            for key in ("title", "toolbar", "card", "wrap"):
                assert scrolled[key] == initial[key], (key, initial, scrolled)
            assert abs(scrolled["header"]["top"] - initial["header"]["top"]) <= 1, scrolled
            wheel(0, 350)
            sideways = measure()
            assert sideways["scrollLeft"] > 0 and sideways["pageX"] == 0, sideways
            assert sideways["title"] == initial["title"] and sideways["card"] == initial["card"], sideways
            assert abs(sideways["header"]["left"] - initial["header"]["left"] + sideways["scrollLeft"]) <= 1, sideways
            check_table_styling()
            check_headers_and_corners()
            if width in (1440, 390):
                driver.save_screenshot(str(output / f"scroll-{width}-zh.png"))
            driver.execute_script("document.querySelector('.table-wrap').scrollLeft=0")

            # The final row remains reachable; wheel motion at either end does
            # not propagate to the page and move the benchmark title away.
            driver.execute_script("document.querySelector('.table-wrap').scrollTop=100000")
            wheel(800)
            bottom = measure()
            assert bottom["last"]["bottom"] <= bottom["wrap"]["bottom"] + 1, bottom
            assert bottom["last"]["top"] >= bottom["header"]["bottom"], bottom
            assert bottom["pageY"] == 0 and bottom["title"] == initial["title"], bottom
            driver.execute_script("document.querySelector('.table-wrap').scrollTop=0")
            wheel(-800)
            assert measure()["pageY"] == 0

            # Native keyboard scrolling works for the named region too.
            region = driver.find_element(By.CSS_SELECTOR, ".table-wrap")
            driver.execute_script("arguments[0].focus()", region)
            region.send_keys(Keys.PAGE_DOWN)
            wait.until(lambda _: measure()["scrollTop"] > 0)
            time.sleep(.3)
            assert measure()["pageY"] == 0

            # Sorting stays usable after scrolling and returns to the first row.
            driver.find_element(By.CSS_SELECTOR, ".column-total-cost-usd button").click()
            assert measure()["scrollTop"] == 0, measure()
            assert driver.find_element(By.CSS_SELECTOR, ".column-total-cost-usd").get_attribute("aria-sort") == "descending"
            driver.find_element(By.CSS_SELECTOR, ".column-total-cost-usd button").click()
            assert driver.find_element(By.CSS_SELECTOR, ".column-total-cost-usd").get_attribute("aria-sort") == "ascending"
            assert check_headers_and_corners() == column_widths
            driver.execute_script("document.querySelector('.table-wrap').scrollLeft=0")

            # External filter menu isn't clipped by the scrolling table.
            driver.find_element(By.CSS_SELECTOR, ".filter-toggle").click()
            check_headers_and_corners()
            driver.find_element(By.CSS_SELECTOR, '[data-filter-category="source"]').click()
            driver.find_element(By.CSS_SELECTOR, '[data-filter-value="penguin_run"]').click()
            assert len(driver.find_elements(By.CSS_SELECTOR, ".harness-details-button")) == 6
            assert measure()["wrap"] == initial["wrap"]
            assert measure()["scrollTop"] == 0
            driver.find_element(By.CSS_SELECTOR, ".filter-toggle").click()
            driver.find_element(By.CSS_SELECTOR, '[data-filter-value=""]').click()
            assert len(driver.find_elements(By.CSS_SELECTOR, ".harness-details-button")) == 38
            driver.find_element(By.CSS_SELECTOR, ".filter-toggle").click()
            driver.find_element(By.CSS_SELECTOR, '[data-filter-category="thinking"]').click()
            driver.find_element(By.CSS_SELECTOR, '[data-filter-value="high"]').click()
            efforts = driver.find_elements(By.CSS_SELECTOR, ".model-effort")
            assert all(cell.text == "(high)" for cell in efforts)
            assert 0 < len(efforts) < 38
            assert len(efforts) == len(driver.find_elements(By.CSS_SELECTOR, ".harness-details-button"))
            driver.find_element(By.CSS_SELECTOR, ".filter-toggle").click()
            driver.find_element(By.CSS_SELECTOR, '[data-filter-value=""]').click()
            assert len(driver.find_elements(By.CSS_SELECTOR, ".harness-details-button")) == 38
            driver.execute_script("document.querySelector('.table-wrap').scrollLeft=0")

            # A detail modal can be opened/closed without moving the workspace.
            driver.find_element(By.CSS_SELECTOR, ".harness-details-button").click()
            assert driver.find_element(By.CSS_SELECTOR, ".result-dialog").is_displayed()
            check_headers_and_corners()
            driver.find_element(By.CSS_SELECTOR, ".dialog-close").click()
            assert measure()["pageY"] == 0

            # Pareto is not height-clipped; switching back restores the workspace.
            driver.find_element(By.CSS_SELECTOR, "#pareto-tab").click()
            wait.until(lambda _: len(driver.find_elements(By.CSS_SELECTOR, ".pareto-point")) == 27)
            assert driver.execute_script("return document.documentElement.dataset.resultView") == "pareto"
            driver.find_element(By.CSS_SELECTOR, "#table-tab").click()
            assert measure()["pageHeight"] <= height + 1
            assert measure()["pageY"] == 0

            # Exercise the longer English labels in light/dark themes, before
            # and after sorting the two columns that previously wrapped.
            driver.execute_script('setLocale("en");setTheme("light")')
            check_table_styling()
            english_widths = check_headers_and_corners()
            assert driver.find_element(By.CSS_SELECTOR, ".column-row-number").text == "RANK"
            assert "COMPACT AT" in driver.find_element(By.CSS_SELECTOR, ".column-compression-trigger").text
            assert "TIME BUDGET" in driver.find_element(By.CSS_SELECTOR, ".column-timeout-multiplier").text
            driver.execute_script("document.querySelector('.table-wrap').scrollLeft=0")
            if width in (1440, 390):
                driver.save_screenshot(str(output / f"initial-{width}-en.png"))
            for column in ("compression-trigger", "timeout-multiplier"):
                driver.find_element(By.CSS_SELECTOR, f".column-{column} button").click()
                assert check_headers_and_corners() == english_widths
            if width == 1440:
                driver.execute_script("document.querySelector('.table-wrap').scrollLeft=0")
                driver.save_screenshot(str(output / "sorted-1440-en.png"))
            driver.execute_script('setTheme("dark")')
            check_table_styling()
            check_headers_and_corners()
            wheel(500)
            dark = measure()
            assert dark["pageY"] == 0 and abs(dark["header"]["top"] - dark["wrap"]["top"]) <= 1, dark
            assert not driver.find_elements(By.CSS_SELECTOR, ".results-head [title]")
            if width in (1440, 390):
                driver.save_screenshot(str(output / f"scroll-{width}-en-dark.png"))
            reports.append({"width": width, "height": height, "scrollportHeight": initial["clientHeight"],
                            "tableWidth": initial["tableWidth"], "trackWidth": 260,
                            "columnWidths": column_widths, "englishColumnWidths": english_widths})
        # An empty result must not expand the page.
        driver.execute_script('state.filters.model="nonexistent";renderResults()')
        assert driver.find_element(By.CSS_SELECTOR, ".empty-cell").is_displayed()
        assert driver.find_element(By.CSS_SELECTOR, ".empty-cell").get_attribute("colspan") == "8"
        assert measure()["pageHeight"] <= measure()["viewport"] + 1
        assert not driver.execute_script("""
            return performance.getEntriesByType("resource").some(entry=>entry.name.includes("api.github.com"));
        """)
        errors = [entry for entry in driver.get_log("browser") if entry["level"] == "SEVERE"]
        assert not errors, errors
        print(json.dumps({"passed": True, "screenshots": str(output), "viewports": reports}))
    finally:
        driver.quit()


if __name__ == "__main__":
    main()
