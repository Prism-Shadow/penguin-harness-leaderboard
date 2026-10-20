"""Offline regression checks for the fixed-width, nine-column table."""

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

    def test_nine_fixed_columns_add_up_to_table_width(self):
        header = self.script[self.script.index("function renderTableHead()"):
                             self.script.index("function accuracyCell(")]
        columns = re.findall(r'\["([^"]+)", "[^"]+"\]', header)
        self.assertEqual(columns, ["row_number", "harness", "model", "thinking_level",
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
        self.assertEqual(self.html.count('colspan="9"'), 1)
        self.assertEqual(self.script.count('colspan="9"'), 2)
        self.assertNotIn('colspan="8"', self.html + self.script)

    def test_effort_is_plain_text_in_its_own_cell(self):
        self.assertNotIn("effort-pill", self.script + self.css)
        self.assertIn('class="thinking-cell${active("thinking_level")}"', self.script)
        self.assertIn('row.thinking_level ? escapeHtml(row.thinking_level) : missingValue(true)', self.script)
        self.assertIn('thinkingLevel: "思考强度"', self.script)

    def sorted_efforts(self, direction):
        source = self.script[self.script.index("function sortedRows("):
                             self.script.index("function setSort(")]
        probe = """
const state={sort:{key:"thinking_level",direction:%s},locale:"en"};
const rows=[null,"max","high","low","xhigh","medium"].map(thinking_level=>({thinking_level}));
const before=JSON.stringify(rows);
console.log(JSON.stringify({efforts:sortedRows(rows).map(row=>row.thinking_level),
                           unchanged:before===JSON.stringify(rows)}));
""" % json.dumps(direction)
        result = subprocess.run(["node", "-e", source + probe], capture_output=True,
                                text=True, check=True, timeout=10)
        return json.loads(result.stdout)

    def test_effort_sort_keeps_missing_values_last_and_preserves_data(self):
        for direction, values in (
            ("asc", ["high", "low", "max", "medium", "xhigh", None]),
            ("desc", ["xhigh", "medium", "max", "low", "high", None]),
        ):
            with self.subTest(direction=direction):
                self.assertEqual(self.sorted_efforts(direction),
                                 {"efforts": values, "unchanged": True})

    def test_icon_only_github_has_no_count_request(self):
        self.assertNotIn("github-stars", self.html + self.css)
        self.assertNotIn("api.github.com", self.script)
        self.assertNotIn("GitHubStars", self.script)
        self.assertIn('aria-label="GitHub"', self.html)


if __name__ == "__main__":
    unittest.main()
