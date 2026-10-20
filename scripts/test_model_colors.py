"""Offline regression tests for stable, model-based score-bar colors."""

import json
from pathlib import Path
import re
import subprocess
import unittest


ROOT = Path(__file__).resolve().parents[1]


class ModelColorTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.script = (ROOT / "site/script.js").read_text()
        cls.css = (ROOT / "site/styles.css").read_text()
        cls.function = cls.script[cls.script.index("function modelSeries("):
                                  cls.script.index("function harnessDetailsButton(")]

    def evaluate(self, probe):
        return json.loads(subprocess.run(
            ["node", "-e", self.function + "\n" + probe], check=True,
            capture_output=True, text=True, timeout=10).stdout)

    def test_all_published_models_have_a_stable_series(self):
        rows = json.loads((ROOT / "site/data/benchmarks.json").read_text())["benchmarks"][0]["results"]
        expected = {
            "OpenAI": "gpt", "DeepSeek": "deepseek", "Anthropic": "claude",
            "Google": "gemini", "Qwen": "qwen", "Moonshot AI": "kimi",
            "Z.ai": "glm", "xAI": "grok", "Meta": "muse",
        }
        result = self.evaluate("const rows=" + json.dumps(rows) + """;
const before=JSON.stringify(rows);
console.log(JSON.stringify({
    original:rows.map(modelSeries),
    noOrg:rows.map(row=>modelSeries({...row, model_org:null})),
    changedHarness:rows.map(row=>modelSeries({...row,
        harness:{label:"Claude Code"},source_type:"penguin_run",rank:100})),
    unchanged:before===JSON.stringify(rows),
}));
""")
        series = [expected[row["model_org"]["label"]] for row in rows]
        self.assertEqual(set(series), set(expected.values()))
        self.assertEqual(result["original"], series)
        self.assertEqual(result["noOrg"], series)
        self.assertEqual(result["changedHarness"], series)
        self.assertTrue(result["unchanged"])

    def test_missing_unknown_and_malicious_names_are_neutral(self):
        rows = [{}, {"model": None}, {"model": {"label": "Unknown model"}},
                {"model_org": {"label": "__proto__"}},
                {"model_org": {"label": '"><script>alert(1)</script>'}},
                {"model": {"label": "not-gpt-model"}, "harness": {"label": "Codex"}}]
        self.assertEqual(self.evaluate("console.log(JSON.stringify(" + json.dumps(rows)
                                       + ".map(modelSeries)))"), ["unknown"] * len(rows))

    def test_case_and_all_claude_names_are_supported(self):
        rows = [{"model": {"label": name}} for name in
                ("Opus 4.8", "Sonnet 5", "Fable 5", "Haiku 4.5", "Claude-Opus-5")]
        rows.append({"model_org": {"label": "  ANTHROPIC  "}})
        self.assertEqual(self.evaluate("console.log(JSON.stringify(" + json.dumps(rows)
                                       + ".map(modelSeries)))"), ["claude"] * len(rows))

    def test_only_bar_fills_get_series_colors(self):
        self.assertIn('class="accuracy-fill" data-model-series="${modelSeries(row)}"', self.script)
        selectors = re.findall(r'([^\n{]*\[data-model-series="[^\"]+"\])\s*\{', self.css)
        self.assertEqual(len(selectors), 9)
        self.assertTrue(all(selector.startswith(".accuracy-fill") for selector in selectors))
        light = self.css[:self.css.index(':root[data-theme="dark"]')]
        colors = dict(re.findall(r"--model-([\w-]+):\s*(#[0-9a-f]{6});", light))
        self.assertEqual(len(colors), 10)
        self.assertEqual(len(set(colors.values())), 10)
        self.assertEqual(colors["claude"], "#d97757")
        self.assertEqual(colors["gemini"], "#ac87eb")
        self.assertEqual(colors["qwen"], "#7046d6")


if __name__ == "__main__":
    unittest.main()
