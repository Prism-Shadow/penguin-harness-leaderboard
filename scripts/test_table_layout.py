"""Offline regression checks for the fixed-width, eight-column table."""

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

    def test_eight_fixed_columns_add_up_to_table_width(self):
        header = self.script[self.script.index("function renderTableHead()"):
                             self.script.index("function accuracyCell(")]
        columns = re.findall(r'\["([^"]+)", "[^"]+"\]', header)
        self.assertEqual(columns, ["row_number", "harness", "model",
                                  "compression_trigger", "timeout_multiplier", "accuracy",
                                  "total_cost_usd", "source_type"])
        total = sum(int(re.search(r"width:\s*(\d+)px", self.css_rule(
            ".column-" + column.replace("_", "-"))).group(1)) for column in columns)
        table = self.css_rule("table")
        self.assertIn(f"width: {total}px", table)
        self.assertIn(f"min-width: {total}px", table)
        self.assertEqual(total, 1480)

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


if __name__ == "__main__":
    unittest.main()
