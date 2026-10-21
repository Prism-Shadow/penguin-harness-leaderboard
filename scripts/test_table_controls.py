"""Offline column schema and routing tests, using the real snapshot."""
import json
from pathlib import Path
import subprocess
import unittest

ROOT = Path(__file__).resolve().parents[1]


class TableControlTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.script = (ROOT / "site/script.js").read_text()
        cls.payload = json.loads((ROOT / "site/data/benchmarks.json").read_text())
        cls.source = cls.script[cls.script.index("const TABLE_COLUMNS ="):cls.script.index("const translations =")]
        cls.source += cls.script[cls.script.index("function availableColumns("):cls.script.index("function saveColumns(")]

    def probe(self, body):
        code = self.source + "\nconst assert = require('node:assert/strict');\n"
        code += "const benchmarks = " + json.dumps(self.payload["benchmarks"]) + ";\n" + body
        subprocess.run(["node", "-"], input=code, check=True, capture_output=True, text=True, timeout=10)

    def test_defaults_and_optional_availability(self):
        self.probe("""
for (const bench of benchmarks) {
  const available = availableColumns(bench).map(c => c.key);
  const defaults = defaultColumnKeys(bench);
  assert.equal(defaults.length, bench.version === '2.1' ? 8 : 7);
  for (const key of ['total_tokens']) {
    assert(available.includes(key)); assert(!defaults.includes(key));
  }
  assert.equal(available.length,defaults.length+1);
  for (const key of ['trial_count','release_date','harness_org','model_org']) assert(!available.includes(key));
  assert.equal(available.includes('compression_trigger'),bench.version === '2.1');
}
""")

    def test_invalid_empty_or_stale_choices_recover_defaults(self):
        self.probe("""
for (const bench of benchmarks) {
  for (const keys of [null,undefined,[],['invalid'],'model',{model:true},['trial_count','release_date','harness_org','model_org']])
    assert.deepEqual(normalizeColumnKeys(keys,bench),defaultColumnKeys(bench));
  assert.deepEqual(normalizeColumnKeys(['model','accuracy','model','<script>'],bench),['model','accuracy']);
  assert.deepEqual(normalizeColumnKeys(['model','accuracy','release_date','harness_org'],bench),['model','accuracy']);
}
""")

    def test_zero_values_are_available_but_missing_values_are_not(self):
        self.probe("""
const bench={results:[{total_tokens:0,trial_count:0,release_date:null,harness_org:{label:''}}]};
const available=availableColumns(bench).map(c=>c.key);
assert(available.includes('total_tokens'));assert(!available.includes('trial_count'));
assert(!available.includes('release_date'));assert(!available.includes('harness_org'));
""")

    def test_removed_columns_remain_available_in_details(self):
        details = self.script[self.script.index("function openDetails("):self.script.index("function paretoFrontier(")]
        for field in ("harnessOrganization", "modelOrganization", "releaseDate", "trials"):
            self.assertIn(f't("{field}")', details)
        self.assertIn('t(config ? "configuredVersion" : "harnessVersion")', details)

    def test_column_queries_do_not_mutate_source_data(self):
        self.probe("""
const before=JSON.stringify(benchmarks);
for (const bench of benchmarks) {
  availableColumns(bench);defaultColumnKeys(bench);normalizeColumnKeys(['model','total_tokens'],bench);
}
assert.equal(JSON.stringify(benchmarks),before);
""")

    def test_canonical_column_order_and_independent_preferences(self):
        self.probe("""
const state={benchmark:benchmarks[0],columnsByBenchmark:{}};
const a=benchmarks[0],b=benchmarks[1];
state.columnsByBenchmark[a.id]=['accuracy','model'];
state.columnsByBenchmark[b.id]=['total_tokens','harness'];
assert.deepEqual(visibleColumns().map(c=>c.key),['model','accuracy']);
state.benchmark=b;
assert.deepEqual(visibleColumns().map(c=>c.key),['harness','total_tokens']);
""")

    def test_last_column_guard_and_stateful_share_contract(self):
        self.assertIn('if (keys.length === 1 && keys[0] === key) return;', self.script)
        self.assertIn('url.searchParams.set("columns", visibleColumns()', self.script)
        self.assertIn('window.addEventListener("popstate", restoreResultUrl)', self.script)
        self.assertIn('localStorage.setItem(COLUMNS_KEY, JSON.stringify(state.columnsByBenchmark))', self.script)

    def test_only_current_benchmark_is_exposed_with_full_name(self):
        self.assertIn('const PUBLISHED_BENCHMARK_IDS = ["terminal-bench-2.1"]', self.script)
        self.assertIn('option.textContent = bench.name', self.script)


if __name__ == "__main__":
    unittest.main()
