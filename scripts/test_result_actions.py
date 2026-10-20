"""Offline contracts for clearing filters and local-only result actions."""

import json
from pathlib import Path
import subprocess
import unittest


ROOT = Path(__file__).resolve().parents[1]


class ResultActionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.script = (ROOT / "site/script.js").read_text()
        cls.html = (ROOT / "site/index.html").read_text()
        cls.export = (ROOT / "site/export.js").read_text()

    def test_clear_preserves_view_sort_and_dataset(self):
        function = self.script[self.script.index("function clearFilters()"):
                               self.script.index("function setResultView(")]
        for view in ("table", "pareto"):
            probe = """
const state={filters:{source:"penguin_run",harness:"Penguin",model:"DeepSeek",thinking:"max"},
             view:%s,sort:{key:"accuracy",direction:"desc"},benchmark:{results:[{id:1}]}};
const before=JSON.stringify([state.view,state.sort,state.benchmark]);
const calls=[];
const elements={tableWrap:{scrollTop:400}};
function renderFilters(){calls.push("filters")}
function renderResults(){calls.push("results")}
function setFilterMenu(...args){calls.push(args)}
clearFilters();
console.log(JSON.stringify({filters:state.filters,scroll:elements.tableWrap.scrollTop,calls,
unchanged:before===JSON.stringify([state.view,state.sort,state.benchmark])}));
""" % json.dumps(view)
            result = subprocess.run(["node", "-e", function + probe], check=True,
                                    capture_output=True, text=True, timeout=10)
            self.assertEqual(json.loads(result.stdout), {
                "filters": dict.fromkeys(("source", "harness", "model", "thinking"), ""),
                "scroll": 0, "calls": ["filters", "results", [False, True]], "unchanged": True,
            })

    def test_clear_only_renders_with_active_filters(self):
        self.assertIn('(count ? `<button type="button" role="menuitem" class="filter-clear">', self.script)
        self.assertIn('clearFilters: "Clear all"', self.script)
        self.assertIn('clearFilters: "清除全部"', self.script)
        self.assertIn('event.target.closest(".filter-clear")', self.script)

    def test_success_feedback_lasts_one_second_and_restarts(self):
        function = self.script[self.script.index("function showActionStatus("):
                               self.script.index("function setExportMenu(")]
        probe = """
const assert = require("node:assert/strict");
let actionStatusTimer, nextId=0;
const timers = new Map();
const elements = {actionStatus:{hidden:true,textContent:""}};
const t = key => key;
function setTimeout(callback,duration) {
    const id=++nextId;
    timers.set(id,{callback,duration});
    return id;
}
function clearTimeout(id) {timers.delete(id)}
for (const key of ["copied","copied","downloaded","copyFailed","linkCopyFailed","exportFailed"]) {
    const previous=actionStatusTimer;
    showActionStatus(key);
    assert.equal(timers.has(previous),false);
    assert.equal(timers.size,1);
    assert.equal(elements.actionStatus.hidden,false);
    assert.equal(elements.actionStatus.textContent,key);
    assert.equal(timers.get(actionStatusTimer).duration,
        ["copied","downloaded"].includes(key) ? 1000 : 6000);
}
timers.get(actionStatusTimer).callback();
assert.equal(elements.actionStatus.hidden,true);
"""
        subprocess.run(["node", "-e", function + probe], check=True,
                       capture_output=True, text=True, timeout=10)

    def test_export_menu_and_helper_are_loaded(self):
        for action in ("markdown", "copy-png", "png", "svg"):
            self.assertIn(f'data-export="{action}"', self.html)
        self.assertLess(self.html.index('src="export.js'), self.html.index('src="script.js'))
        subprocess.run(["node", "--check", str(ROOT / "site/export.js")], check=True,
                       capture_output=True, timeout=10)
        self.assertIn("url.origin !== location.origin", self.export)
        self.assertNotIn("foreignObject", self.export)

    def test_clipboard_png_preserves_activation_and_reports_failure(self):
        self.assertIn('new ClipboardItem({ "image/png": png })', self.script)
        self.assertIn('showActionStatus("linkCopyFailed")', self.script)
        self.assertIn('? "copyFailed" : "exportFailed"', self.script)


if __name__ == "__main__":
    unittest.main()
