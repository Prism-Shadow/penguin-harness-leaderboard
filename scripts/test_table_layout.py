"""Offline regression checks for the viewport-fitting, configurable table."""

import json
from pathlib import Path
import re
import subprocess
import unittest


ROOT = Path(__file__).resolve().parents[1]


class TableLayoutTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.html = (ROOT / "site/index.html").read_text()
        cls.script = (ROOT / "site/script.js").read_text()
        cls.css = (ROOT / "site/styles.css").read_text()

    def css_rule(self, selector):
        return re.search(r"(?:^|\n)" + re.escape(selector) + r"\s*\{([^}]+)\}",
                         self.css).group(1)

    def test_eight_default_columns_share_the_available_width(self):
        registry = self.script[self.script.index("const TABLE_COLUMNS ="):
                               self.script.index("const translations =")]
        columns = re.findall(r'key: "([^"]+)", label: "[^"]+", default: true', registry)
        self.assertEqual(columns, ["row_number", "harness", "model",
                                  "compression_trigger", "timeout_multiplier", "accuracy",
                                  "total_cost_usd", "source_type"])
        table = self.css_rule("table")
        self.assertIn("width: 100%", table)
        self.assertIn("table-layout: fixed", table)
        self.assertIn("elements.tableWrap.clientWidth - totalWidth", self.script)
        self.assertIn("new ResizeObserver(fitTableColumns)", self.script)

    def test_headers_use_dark_uppercase_left_aligned_text(self):
        self.assertIn('rowNumber: "RANK"', self.script)
        header = self.css_rule("th")
        self.assertIn("color: var(--text)", header)
        self.assertIn("text-transform: uppercase", header)
        self.assertIn("color: var(--text)", self.css_rule("th.is-active .sort-button"))
        button = self.css_rule(".sort-button")
        self.assertIn("text-align: left", button)
        self.assertIn("text-transform: inherit", button)
        self.assertIn("white-space: normal", button)
        self.assertIn("justify-content: flex-start", button)
        self.assertIn("flex: 0 0 11px", self.css_rule(".sort-arrow"))

    def test_original_typographic_scale_font_stack_and_colors(self):
        self.assertIn('--sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif;', self.css_rule(":root"))
        self.assertIn("--text: #111827", self.css_rule(":root"))
        self.assertIn("--muted: #6b7280", self.css_rule(":root"))
        for selector in ("table", "th", ".entity-name", ".model-effort", ".rate-cell strong", ".rate-copy span", ".number-cell"):
            self.assertIn("font-size: 14px", self.css_rule(selector))
        self.assertIn("font-weight: 550", self.css_rule(".entity-name"))
        self.assertIn("font-weight: 600", self.css_rule("th"))
        self.assertIn("font-weight: 600", self.css_rule(".rate-cell strong"))
        self.assertIn("font-weight: 400", self.css_rule(".model-effort"))

    def test_all_css_boxes_use_square_corners(self):
        radii = re.findall(r"\bborder-(?:[\w-]+-)?radius:\s*([^;]+);", self.css)
        self.assertTrue(radii)
        self.assertTrue(all(value == "0" for value in radii), radii)

    def test_score_track_fits_column_and_only_rows_scroll(self):
        rule = self.css_rule(".accuracy-track")
        self.assertIn("width: 100%", rule)
        self.assertIn("height: 14px", rule)
        self.assertIn("@container score (max-width: 300px)", self.css)
        self.assertIn("overflow-y: auto", self.css_rule(".table-wrap"))
        self.assertIn("overflow-x: hidden", self.css_rule(".table-wrap"))

    def test_uniform_rows_without_harness_version_subline(self):
        self.assertIn("height: 72px", self.css_rule('.results-body tr[data-row-id]'))
        renderer = self.script[self.script.index("function renderTable()"):
                               self.script.index("function detailLink(")]
        self.assertNotIn("harnessVersionLabel", renderer)
        self.assertNotIn("harness-meta", self.script + self.css)
        self.assertIn('t(config ? "configuredVersion" : "harnessVersion")', self.script)

    def test_shorter_thicker_error_whiskers(self):
        self.assertIn("height: 2px", self.css_rule(".accuracy-ci"))
        cap = self.css_rule(".accuracy-cap")
        self.assertIn("width: 2px", cap)
        self.assertIn("height: 10px", cap)

    def test_loading_empty_and_error_rows_cover_all_columns(self):
        self.assertEqual(self.html.count('colspan="8"'), 1)
        self.assertIn('colspan="${visibleColumns().length}"', self.script)
        self.assertIn('colspan="${state.benchmark ? visibleColumns().length : 8}"', self.script)
        self.assertNotIn('colspan="9"', self.html + self.script)

    def test_effort_is_plain_muted_text_after_model_name(self):
        self.assertNotIn("effort-pill", self.script + self.css)
        self.assertNotIn("thinking-cell", self.script + self.css)
        self.assertIn('${entityName(row.model)}${modelEffort(row)}', self.script)
        self.assertIn("color: var(--muted)", self.css_rule(".model-effort"))
        self.assertIn("font-weight: 400", self.css_rule(".model-effort"))
        self.assertIn('thinkingLevel: "思考强度"', self.script)

    def test_parentheses_are_escaped_and_missing_effort_is_omitted(self):
        source = self.script[self.script.index("function escapeHtml("):
                             self.script.index("function safeUrl(")]
        source += self.script[self.script.index("function modelEffort("):
                              self.script.index("const HARNESS_LOGOS")]
        probe = """
const rows=[null,"max","high","low","xhigh","medium","",'<img src=x onerror="alert(1)">']
    .map(thinking_level=>({thinking_level}));
rows.push({});
const before=JSON.stringify(rows);
console.log(JSON.stringify({efforts:rows.map(modelEffort),
                           unchanged:before===JSON.stringify(rows)}));
"""
        result = subprocess.run(["node", "-e", source + probe], capture_output=True,
                                text=True, check=True, timeout=10)
        expected = [""] + [
            f'<span class="model-effort">({effort})</span>'
            for effort in ("max", "high", "low", "xhigh", "medium")
        ] + ["", '<span class="model-effort">(&lt;img src=x onerror=&quot;alert(1)&quot;&gt;)</span>', ""]
        self.assertEqual(json.loads(result.stdout), {"efforts": expected, "unchanged": True})

    def test_icon_only_github_has_no_count_request(self):
        self.assertNotIn("github-stars", self.html + self.css)
        self.assertNotIn("api.github.com", self.script)
        self.assertNotIn("GitHubStars", self.script)
        self.assertIn('aria-label="GitHub"', self.html)

    def test_source_labels_match_filters_in_both_languages(self):
        source = self.script[self.script.index("const translations ="):
                             self.script.index("const state =")]
        source += self.script[self.script.index("function escapeHtml("):
                              self.script.index("function safeUrl(")]
        source += self.script[self.script.index("function sourceTypeLabel("):
                              self.script.index("function updateSourceSelect(")]
        source += self.script[self.script.index("function sourceLabel("):
                              self.script.index("function harnessDetailsButton(")]
        probe = """
const assert = require("node:assert/strict");
let locale = "en";
const t = key => translations[locale][key];
const expected = {benchmark_official:"Terminal-Bench", vendor_reported:"Vendor", penguin_run:"Penguin"};
for (locale of ["en", "zh"]) {
    for (const [source_type, label] of Object.entries(expected)) {
        const row = {source_type};
        assert.equal(sourceTypeLabel(source_type), label);
        assert.equal(sourceLabel(row), `<span class="source-label">${label}</span>`);
        assert.deepEqual(row, {source_type});
    }
}
assert.equal(sourceLabel({source_type:"<unknown>"}),
    '<span class="source-label">&lt;unknown&gt;</span>');
"""
        subprocess.run(["node", "-e", source + probe], capture_output=True,
                       text=True, check=True, timeout=10)

    def test_source_text_has_no_badge_or_box_including_exports(self):
        export = (ROOT / "site/export.js").read_text()
        self.assertNotIn("source-badge", self.script + self.css + export)
        rule = self.css_rule(".source-label")
        self.assertIn("font-size: inherit", rule)
        self.assertIn("color: var(--text)", rule)
        self.assertNotRegex(rule, r"\b(?:padding|border|background|min-height)\s*:")


if __name__ == "__main__":
    unittest.main()
