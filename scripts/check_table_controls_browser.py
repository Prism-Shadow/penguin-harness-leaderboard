"""Local Chromium smoke test. Run against a static server; never uploads data.

python3 scripts/check_table_controls_browser.py --url http://127.0.0.1:18765/
Requires Selenium, chromium and chromedriver. Screenshots default to /tmp.
"""
import argparse
import json
from pathlib import Path
from urllib.parse import urlencode

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", default="http://127.0.0.1:18765/")
    parser.add_argument("--screenshots", default="/tmp/leaderboard-table-controls")
    args = parser.parse_args()
    output = Path(args.screenshots)
    output.mkdir(parents=True, exist_ok=True)
    options = webdriver.ChromeOptions()
    options.binary_location = "/usr/bin/chromium"
    for arg in ("--headless=new", "--no-sandbox", "--disable-dev-shm-usage", "--window-size=1600,1100"):
        options.add_argument(arg)
    options.set_capability("goog:loggingPrefs", {"browser": "ALL"})
    driver = webdriver.Chrome(service=Service("/usr/bin/chromedriver"), options=options)
    checks = []
    def js(code, *values):
        return driver.execute_script(code, *values)
    def el(selector):
        return driver.find_element(By.CSS_SELECTOR, selector)
    def check(label, condition):
        assert condition, label
        checks.append(label)
    def ready():
        WebDriverWait(driver, 10).until(lambda d: len(d.find_elements(By.CSS_SELECTOR, ".results-head th")) > 0)
    def load(**query):
        driver.get(args.url + "?" + urlencode({"version": "2.1", **query}))
        ready()
    def headers():
        return js("return [...document.querySelectorAll('.results-head th')].map(e=>e.dataset.column)")
    def toggle(key):
        if not el(".columns-menu").is_displayed():
            el(".columns-toggle").click()
        el(f'.columns-menu [data-column="{key}"]').click()
    def bench(version):
        el("#benchmark-select-trigger").click()
        el(f'#benchmark-select-menu [data-value="terminal-bench-{version}"]').click()
        WebDriverWait(driver, 5).until(lambda d: el("#results-title").text.endswith(version))
    def close_columns():
        if el(".columns-menu").is_displayed():
            el(".columns-menu button").send_keys(Keys.ESCAPE)
    def geometry():
        return js("""const wrap=document.querySelector('.table-wrap'),table=wrap.querySelector('table');
          const head=[...table.tHead.rows[0].cells],body=[...table.tBodies[0].rows[0].cells];
          return {width:table.getBoundingClientRect().width, pageWidth:document.documentElement.scrollWidth,
            viewport:innerWidth, bar:document.querySelector('.accuracy-track')?.getBoundingClientRect().width,
            fits:wrap.scrollWidth<=wrap.clientWidth+1,
            uniform:new Set([...table.tBodies[0].rows].map(r=>Math.round(r.getBoundingClientRect().height))).size===1,
            aligned:head.length===body.length&&head.every((h,i)=>Math.abs(h.getBoundingClientRect().left-body[i].getBoundingClientRect().left)<1),
            allRows:[...table.tBodies[0].rows].every(r=>r.cells.length===head.length)};""")
    try:
        load()
        js("localStorage.clear();localStorage.setItem('penguin-leaderboard.locale','en');localStorage.setItem('penguin-leaderboard.theme','light')")
        load()
        expected = ["row_number", "harness", "model", "compression_trigger", "timeout_multiplier", "accuracy", "total_cost_usd", "source_type"]
        check("initial eight columns", headers() == expected)
        el(".columns-toggle").click()
        check("nine relevant column choices only", len(driver.find_elements(By.CSS_SELECTOR, '.columns-menu [data-column]')) == 9
              and not driver.find_elements(By.CSS_SELECTOR, '.columns-menu [data-column="trial_count"], .columns-menu [data-column="harness_org"], .columns-menu [data-column="model_org"], .columns-menu [data-column="release_date"]'))
        close_columns()
        check("single benchmark option with full name", js("return document.querySelector('#benchmark-select').options.length") == 1
              and el("#benchmark-select-trigger").text == "Terminal-Bench 2.1")
        check("2.1 has 38 real rows", len(driver.find_elements(By.CSS_SELECTOR, ".results-body tr")) == 38)
        check("names, headers and scores retain the remote original typography", js("""
            const names = [...document.querySelectorAll('.results-body .entity-name')];
            return names.length > 0 && names.every(e => {
                const s = getComputedStyle(e);
                return s.fontWeight === '550' && s.fontSize === '14px' && s.color === 'rgb(17, 24, 39)';
            }) && ['.results-head th', '.rate-cell strong'].every(selector =>
                getComputedStyle(document.querySelector(selector)).fontWeight === '600');
        """))
        check("Harness versions removed from table only", not driver.find_elements(By.CSS_SELECTOR, ".harness-meta") and "0.2.3" not in el(".results-body").text)
        el(".harness-details-button").click()
        check("Harness versions still available in Details", "0.2.3" in el(".dialog-body").text)
        el(".dialog-close").click()
        check("error caps are shorter and lines thicker", js("return getComputedStyle(document.querySelector('.accuracy-cap')).height==='10px'&&getComputedStyle(document.querySelector('.accuracy-cap')).width==='2px'&&getComputedStyle(document.querySelector('.accuracy-ci')).height==='2px'"))
        before = geometry()
        toggle("compression_trigger")
        toggle("timeout_multiplier")
        after = geometry()
        check("hide removes headers/cells and gives space back", len(headers()) == 6 and after["allRows"] and after["fits"] and abs(after["width"]-before["width"]) < 1)
        check("bar gains space and headers align", after["bar"] > before["bar"] and after["aligned"])
        check("menu remains open after selection", el(".columns-menu").is_displayed())
        check("URL stores selected columns", "columns=" in driver.current_url and "compression_trigger" not in driver.current_url)
        saved = headers()
        close_columns()
        driver.refresh()
        ready()
        check("reload preserves column choice", headers() == saved)
        load()
        check("bare URL restores local per-benchmark preference", headers() == saved)
        toggle("total_tokens")
        check("optional values render and align", "total_tokens" in headers() and geometry()["allRows"] and geometry()["aligned"])
        close_columns()
        js("document.querySelector('.table-wrap').scrollLeft=9999")
        el('.results-head [data-column="total_tokens"] button').click()
        check("optional token sort applied", el('.results-head [data-column="total_tokens"]').get_attribute("aria-sort") == "descending")
        markdown = js("return LeaderboardExport.markdown(document.querySelector('table'),'Test')")
        check("Markdown uses visible column selection", "TOKENS" in markdown and "COMPACT AT" not in markdown)
        svg = driver.execute_async_script("LeaderboardExport.tableSvg(document.querySelector('table'),'Test').then(arguments[0])")
        check("SVG export uses visible column selection", "TOKENS" in svg and "COMPACT AT" not in svg)
        check("only Tokens is an extra field", len(headers()) == 7 and "trial_count" not in headers() and geometry()["allRows"] and geometry()["aligned"])
        close_columns()
        title_top = el("#results-title").rect["y"]
        header_top = el(".results-head th").rect["y"]
        js("document.querySelector('.table-wrap').scrollTop=600")
        check("title and header remain fixed while rows scroll", el("#results-title").rect["y"] == title_top and abs(el(".results-head th").rect["y"] - header_top) < 1 and js("return scrollY===0"))
        el(".filter-toggle").click()
        el('[data-filter-value="penguin_run"]').click()
        check("filter works with custom columns", len(driver.find_elements(By.CSS_SELECTOR, ".results-body tr")) == 6)
        chosen = headers()
        el(".filter-toggle").click()
        el(".filter-clear").click()
        check("Clear all keeps columns and restores rows", headers() == chosen and len(driver.find_elements(By.CSS_SELECTOR, ".results-body tr")) == 38)
        el(".filter-toggle").click()
        el('[data-filter-value="penguin_run"]').click()
        bench("2.1")
        check("selecting current bench preserves filters and columns", headers() == chosen and len(driver.find_elements(By.CSS_SELECTOR, ".results-body tr")) == 6)
        el("#pareto-tab").click()
        check("column control hidden in Pareto", not el(".columns-menu-wrap").is_displayed())
        bench("2.1")
        check("single bench selector preserves Pareto view", el("#pareto-tab").get_attribute("aria-selected") == "true")
        el("#table-tab").click()
        check("switching views retains column preferences", "total_tokens" in headers() and "compression_trigger" not in headers())
        load(columns="model,accuracy,unknown,accuracy")
        check("URL overrides storage and normalizes columns", headers() == ["model", "accuracy"])
        share_url = driver.current_url
        js("localStorage.removeItem('penguin-leaderboard.columns.v1')")
        driver.get(share_url)
        ready()
        check("shared URL works without stored preferences", headers() == ["model", "accuracy"])
        toggle("accuracy")
        toggle("model")
        check("cannot hide last column", headers() == ["model"] and el('.columns-menu [data-column="model"]').get_attribute("aria-disabled") == "true")
        el(".columns-reset").click()
        check("reset restores eight defaults", headers() == expected)
        close_columns()
        el(".columns-toggle").send_keys(Keys.ARROW_DOWN)
        check("keyboard opens/focuses columns menu", js("return document.activeElement===elements.columnsMenu.querySelector('button')"))
        driver.switch_to.active_element.send_keys(Keys.ARROW_DOWN, Keys.SPACE)
        check("keyboard toggles column", "harness" not in headers())
        driver.switch_to.active_element.send_keys(Keys.ESCAPE)
        check("Escape restores trigger focus", js("return document.activeElement===elements.columnsToggle&&elements.columnsMenu.hidden"))
        load(columns="unknown")
        check("invalid URL columns fall back safely", headers() == expected)
        load(columns="trial_count,release_date,harness_org,model_org", sort="trial_count", direction="desc")
        check("retired columns and sorting in old URLs fall back safely", headers() == expected and "sort=" not in driver.current_url)
        load(columns="model,accuracy,release_date,harness_org")
        check("old URL retains supported selections", headers() == ["model", "accuracy"])
        js("localStorage.setItem('penguin-leaderboard.columns.v1',JSON.stringify({'terminal-bench-2.1':['release_date','harness_org']}))")
        load()
        check("retired saved preferences recover defaults", headers() == expected)
        load(version="unknown")
        check("invalid benchmark falls back", el("#results-title").text == "Terminal-Bench 2.1")
        # Empty-state colspan is based on the selected column set.
        load(columns="model,accuracy")
        js("state.filters.model='no such model';renderTable()")
        check("empty state colspan follows selection", el(".empty-cell").get_attribute("colspan") == "2")
        # The same controls must work for either locale/theme and mobile widths.
        js("localStorage.removeItem('penguin-leaderboard.columns.v1')")
        for version in ("3.0", "4.0"):
            load(version=version)
            check(f"old {version} URL falls back to enabled bench", el("#results-title").text == "Terminal-Bench 2.1")
        all_columns = expected[:6] + ["total_tokens"] + expected[6:]
        for width in (1920, 1600, 1440, 1280, 1024, 768, 390, 320):
            driver.set_window_size(width, 1100 if width > 700 else 900)
            load(columns=",".join(all_columns))
            check(f"{width}px all nine columns fit without horizontal scrolling", geometry()["fits"])
            check(f"{width}px uniform row heights", geometry()["uniform"])
            check(f"{width}px values are not clipped", js("return [...document.querySelectorAll('.results-body td')].every(c=>c.scrollWidth<=c.clientWidth+1)"))
            el(".columns-toggle").click()
            check(f"{width}px menu within viewport", js("const r=elements.columnsMenu.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.bottom<=innerHeight"))
            check(f"{width}px no page overflow", js("return document.documentElement.scrollWidth<=innerWidth+1&&document.documentElement.scrollHeight<=innerHeight+1"))
            toggle("compression_trigger")
            check(f"{width}px changed columns still fit", geometry()["allRows"] and geometry()["fits"] and (width<=980 or geometry()["aligned"]))
            close_columns()
            bench("2.1")
            check(f"{width}px benchmark still operable", el("#results-title").text.endswith("2.1"))
            if width == 390:
                el(".columns-toggle").click()
                driver.save_screenshot(str(output / "mobile-columns.png"))
        driver.set_window_size(1600, 1100)
        js("localStorage.setItem('penguin-leaderboard.locale','zh');localStorage.setItem('penguin-leaderboard.theme','dark')")
        load(columns=",".join(expected))
        el(".columns-toggle").click()
        check("Chinese columns translated", "压缩阈值" in el(".columns-menu").text and "通过率" in el(".columns-menu").text)
        check("dark mode retained", js("return document.documentElement.dataset.theme") == "dark")
        driver.save_screenshot(str(output / "dark-chinese.png"))
        js("localStorage.setItem('penguin-leaderboard.locale','en');localStorage.setItem('penguin-leaderboard.theme','light')")
        load(columns=",".join(expected))
        driver.save_screenshot(str(output / "table-preview.png"))
        toggle("total_tokens")
        driver.save_screenshot(str(output / "columns-preview.png"))
        close_columns()
        el("#benchmark-select-trigger").click()
        WebDriverWait(driver, 2).until(lambda d: js("return !document.querySelector('#benchmark-select-trigger').getAnimations({subtree:true}).some(a=>a.playState==='running')"))
        driver.save_screenshot(str(output / "benchmarks-preview.png"))
        el('#benchmark-select-menu [data-value="terminal-bench-2.1"]').click()
        js("document.querySelector('.table-wrap').scrollTop=600")
        driver.save_screenshot(str(output / "error-bars-preview.png"))
        errors = [entry for entry in driver.get_log("browser") if entry["level"] == "SEVERE"]
        check("no browser errors", not errors)
        (output / "checks.json").write_text(json.dumps(checks, ensure_ascii=False, indent=2))
        print(f"PASS: {len(checks)} browser checks; screenshots: {output}")
    except Exception:
        driver.save_screenshot(str(output / "failure.png"))
        print("Completed checks:", checks)
        print("Browser log:", driver.get_log("browser"))
        raise
    finally:
        driver.quit()


if __name__ == "__main__":
    main()
