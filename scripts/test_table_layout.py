"""Offline regression checks for the content-sized, eight-column table."""

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

    def test_eight_columns_size_to_their_content(self):
        header = self.script[self.script.index("function renderTableHead()"):
                             self.script.index("function accuracyCell(")]
        columns = re.findall(r'\["([^"]+)", "[^"]+"\]', header)
        self.assertEqual(columns, ["row_number", "harness", "model",
                                  "compression_trigger", "timeout_multiplier", "accuracy",
                                  "total_cost_usd", "source_type"])
        table = self.css_rule("table")
        self.assertIn("width: max-content", table)
        self.assertIn("min-width: 100%", table)
        self.assertIn("table-layout: auto", table)
        self.assertNotRegex(self.css, r"\.column-[\w-]+\s*\{[^}]*\bwidth:")

    def test_headers_use_dark_uppercase_left_aligned_text(self):
        self.assertIn('rowNumber: "RANK"', self.script)
        header = self.css_rule("th")
        self.assertIn("color: var(--text)", header)
        self.assertIn("text-transform: uppercase", header)
        self.assertIn("color: var(--text)", self.css_rule("th.is-active .sort-button"))
        button = self.css_rule(".sort-button")
        self.assertIn("text-align: left", button)
        self.assertIn("text-transform: inherit", button)
        self.assertIn("white-space: nowrap", button)
        self.assertIn("justify-content: flex-start", button)
        self.assertIn("flex: 0 0 11px", self.css_rule(".sort-arrow"))

    def test_all_css_boxes_use_square_corners(self):
        radii = re.findall(r"\bborder-(?:[\w-]+-)?radius:\s*([^;]+);", self.css)
        self.assertTrue(radii)
        self.assertTrue(all(value == "0" for value in radii), radii)

    def test_score_track_cannot_flex_shrink(self):
        rule = self.css_rule(".accuracy-track")
        self.assertIn("width: 260px", rule)
        self.assertIn("min-width: 260px", rule)
        self.assertIn("flex: 0 0 260px", rule)
        self.assertIn("overflow: auto", self.css_rule(".table-wrap"))

    def test_loading_empty_and_error_rows_cover_all_columns(self):
        self.assertEqual(self.html.count('colspan="8"'), 1)
        self.assertEqual(self.script.count('colspan="8"'), 2)
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
