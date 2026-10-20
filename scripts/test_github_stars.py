"""Offline checks for the optional public repository star counter."""

import json
from pathlib import Path
import subprocess
import unittest


class GitHubStarsTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        source = (Path(__file__).resolve().parents[1] / "site/script.js").read_text()
        cls.source = source[source.index("function renderGitHubStars()"):
                            source.index("function cycleTheme()")]
        cls.source += "\n" + next(line for line in source.splitlines()
                                 if line.startswith("const GITHUB_REPO ="))

    def run_counter(self, response=None, *, status=True, fail=False, timeout=False):
        payload = json.dumps(response)
        setup = f"""
const state = {{githubStars:null}};
const link = {{setAttribute(key,value){{this[key]=value}}}};
const elements = {{githubStars:{{textContent:"—"}},githubLink:link}};
const t = (key,values)=>`GitHub · ${{values.count}} stars`;
let cleared=false,aborted=false,timeoutMs=null,callback,requestedUrl;
const setTimeout=(fn,ms)=>{{callback=fn;timeoutMs=ms;return 1}};
const clearTimeout=()=>{{cleared=true}};
class AbortController {{
  signal={{}};
  abort(){{aborted=true}}
}}
const fetch=async (url)=>{{
  requestedUrl=url;
  if ({json.dumps(timeout)}) callback();
  if ({json.dumps(fail or timeout)}) throw new Error("Unavailable");
  return {{ok:{json.dumps(status)},json:async()=>({payload})}};
}};
"""
        probe = """
(async()=>{
  renderGitHubStars();
  await loadGitHubStars();
  console.log(JSON.stringify({count:state.githubStars,text:elements.githubStars.textContent,
    label:link["aria-label"],cleared,aborted,timeoutMs,requestedUrl}));
})().catch(error=>{console.error(error);process.exitCode=1});
"""
        result = subprocess.run(["node", "-e", setup + self.source + probe],
                                capture_output=True, text=True, check=True, timeout=10)
        return json.loads(result.stdout)

    def test_zero_is_a_valid_count(self):
        result = self.run_counter({"full_name": "Prism-Shadow/penguin-harness-leaderboard", "stargazers_count": 0})
        self.assertEqual(result["text"], "0")
        self.assertEqual(result["label"], "GitHub · 0 stars")
        self.assertTrue(result["cleared"])

    def test_count_is_grouped_and_queries_the_linked_repository(self):
        result = self.run_counter({"full_name": "Prism-Shadow/penguin-harness-leaderboard", "stargazers_count": 12345})
        self.assertEqual(result["text"], "12,345")
        self.assertEqual(result["requestedUrl"], "https://api.github.com/repos/Prism-Shadow/penguin-harness-leaderboard")

    def test_invalid_counts_remain_unknown(self):
        for count in (None, -1, 1.5, "20", True, 9007199254740992):
            with self.subTest(count=count):
                result = self.run_counter({"full_name": "Prism-Shadow/penguin-harness-leaderboard", "stargazers_count": count})
                self.assertIsNone(result["count"])
                self.assertEqual(result["text"], "—")
                self.assertTrue(result["cleared"])

    def test_other_repository_count_is_not_reused(self):
        result = self.run_counter({"full_name": "Prism-Shadow/penguin-harness", "stargazers_count": 3000})
        self.assertIsNone(result["count"])
        self.assertEqual(result["text"], "—")

    def test_http_failure_does_not_fabricate_zero(self):
        result = self.run_counter(status=False)
        self.assertEqual(result["text"], "—")
        self.assertTrue(result["cleared"])

    def test_network_failure_is_contained(self):
        result = self.run_counter(fail=True)
        self.assertEqual(result["text"], "—")
        self.assertTrue(result["cleared"])

    def test_timeout_aborts_and_cleans_up(self):
        result = self.run_counter(timeout=True)
        self.assertEqual(result["text"], "—")
        self.assertEqual(result["timeoutMs"], 5000)
        self.assertTrue(result["aborted"])
        self.assertTrue(result["cleared"])


if __name__ == "__main__":
    unittest.main()
