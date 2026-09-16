"""Offline regressions for evidence binding and metric semantics."""

import copy
import json
import unittest
from unittest.mock import patch

import import_terminal_bench as importer


class ConfigurationEvidenceTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.payload = json.loads(importer.DEFAULT_OUTPUT.read_text(encoding="utf-8"))
        cls.evidence = json.loads(importer.CONFIG_EVIDENCE_INPUT.read_text(encoding="utf-8"))

    def load_fixture(self, payload):
        with patch.object(type(importer.CONFIG_EVIDENCE_INPUT), "read_text", return_value=json.dumps(payload)):
            return importer.load_config_evidence()

    def test_evidence_is_bound_to_each_observation(self):
        expected = importer.load_config_evidence()
        actual = importer.apply_config_evidence(copy.deepcopy(self.payload))
        found = set()
        for bench in actual["benchmarks"]:
            for row in bench["results"]:
                if row["source_type"] != "benchmark_official":
                    continue
                if row["id"] not in expected:
                    self.assertIsNone(row["harness_version"])
                    self.assertIsNone(row["timeout_multiplier"])
                    continue
                evidence = expected[row["id"]]
                found.add(row["id"])
                self.assertEqual(row["harness_version"], evidence["harness_version"])
                self.assertEqual(row["harness_version_variants"], evidence["harness_version_variants"])
                self.assertEqual(row["timeout_multiplier"], evidence["timeout_multiplier"])
                self.assertEqual(row["trial_count"], row["config_evidence"]["trial_count"])
                self.assertEqual(row["config_evidence"]["scope"], "all_linked_trials")
                self.assertNotIn("api_requests", row["config_evidence"])
        self.assertEqual(found, set(expected))
        self.assertEqual(len(found), 52)
        self.assertEqual(sum(r["harness_version"] is not None for r in expected.values()), 49)
        self.assertEqual(sum(r["match"]["trial_count"] for r in expected.values()), 20170)
        self.assertEqual(importer.apply_config_evidence(copy.deepcopy(actual)), actual)

    def test_changed_score_model_effort_or_benchmark_rejects_evidence(self):
        evidence_id = next(iter(importer.load_config_evidence()))
        for field in ("accuracy", "model", "harness", "thinking_level", "benchmark", "trial_count"):
            with self.subTest(field=field):
                payload = copy.deepcopy(self.payload)
                bench = next(b for b in payload["benchmarks"] if any(r["id"] == evidence_id for r in b["results"]))
                row = next(r for r in bench["results"] if r["id"] == evidence_id)
                if field in ("model", "harness"):
                    row[field]["label"] += " changed"
                elif field == "benchmark":
                    bench["id"] = "terminal-bench-4.0"
                elif field == "accuracy":
                    row[field] += 0.1
                elif field == "trial_count":
                    row[field] -= 1
                else:
                    row[field] = "changed"
                with self.assertRaisesRegex(ValueError, "no longer matches"):
                    importer.apply_config_evidence(payload)

    def test_absent_row_is_not_silently_ignored(self):
        payload = copy.deepcopy(self.payload)
        evidence_id = next(iter(importer.load_config_evidence()))
        for bench in payload["benchmarks"]:
            bench["results"] = [r for r in bench["results"] if r["id"] != evidence_id]
        with self.assertRaisesRegex(ValueError, "absent official rows"):
            importer.apply_config_evidence(payload)

    def test_duplicate_unknown_benchmark_and_bad_timeout_rejected(self):
        for corruption in ("duplicate", "benchmark", "boolean", "nan", "negative", "mode", "source"):
            with self.subTest(corruption=corruption):
                payload = copy.deepcopy(self.evidence)
                record = payload["records"][0]
                if corruption == "duplicate":
                    payload["records"].append(copy.deepcopy(record))
                elif corruption == "benchmark":
                    record["benchmark_id"] = "typo"
                elif corruption == "mode":
                    record["harness_version"] = "minimal mode"
                elif corruption == "source":
                    record["source_url"] = "https://example.org/config.json"
                else:
                    record["timeout_multiplier"] = {"boolean": True, "nan": float("nan"), "negative": -1}[corruption]
                with self.assertRaises(ValueError):
                    self.load_fixture(payload)

    def test_partial_duplicate_or_inaccessible_trials_reject_audit(self):
        for corruption in ("scope", "count", "unique", "inaccessible", "variant_count", "timeout_count", "boolean_count", "override", "page", "field_path"):
            with self.subTest(corruption=corruption):
                payload = copy.deepcopy(self.evidence)
                record = payload["records"][0]
                audit = record["verification"]
                if corruption == "scope":
                    audit["scope"] = "sample_trial"
                elif corruption in ("count", "unique"):
                    audit[{"count": "trial_count", "unique": "unique_trial_count"}[corruption]] -= 1
                elif corruption == "inaccessible":
                    audit["inaccessible_trial_count"] = 1
                elif corruption == "variant_count":
                    record["harness_version_variants"][0]["count"] -= 1
                elif corruption == "timeout_count":
                    audit["timeout_multiplier_counts"][0]["count"] -= 1
                elif corruption == "boolean_count":
                    audit["timeout_multiplier_counts"][0]["count"] = True
                elif corruption == "override":
                    audit["timeout_overrides_absent"] = False
                elif corruption == "page":
                    audit["api_requests"][0]["query"]["limit"] = "1"
                else:
                    audit["field_paths"]["timeout_multiplier"] = "harbor.default_timeout_multiplier"
                with self.assertRaises(ValueError):
                    self.load_fixture(payload)

    def test_mixed_and_unknown_versions_are_preserved(self):
        evidence = importer.load_config_evidence()
        expected = {
            "23ab6a14-4b2d-461d-9171-f8109f5692f1": {"0.144.0": 299, "0.144.1": 136, "unknown": 10},
            "7ebd2bd7-9a4c-4c62-bccd-843908653c16": {"devin 3000.4.25 (7e8e528a)": 312, "devin 3000.4.16 (355c3c9e)": 58},
            "e660765d-7b96-48f7-97ed-3c2abe17dbb5": {"2026.07.09-a3815c0": 363, "unknown": 7},
        }
        for row_id, counts in expected.items():
            record = evidence[row_id]
            self.assertIsNone(record["harness_version"])
            self.assertEqual({v["version"]: v["count"] for v in record["harness_version_variants"]}, counts)
            self.assertEqual(set(record["version_note"]), {"en", "zh"})
            payload = copy.deepcopy(self.evidence)
            altered = next(r for r in payload["records"] if r["row_id"] == row_id)
            altered["harness_version"] = altered["harness_version_variants"][0]["version"]
            with self.assertRaisesRegex(ValueError, "Mixed or unknown"):
                self.load_fixture(payload)
        terra = evidence["23ab6a14-4b2d-461d-9171-f8109f5692f1"]
        prior = next(s for s in terra["supplemental_sources"] if s["kind"] == "official_submission")
        self.assertEqual(prior["reported_value"], "0.144.1")
        self.assertTrue(prior["note"]["en"])

    def test_sources_are_restricted_to_exact_public_observations(self):
        for corruption in ("row", "trial", "unscoped_trial", "wrong_job", "job", "api", "api_row", "unpinned_submission"):
            with self.subTest(corruption=corruption):
                payload = copy.deepcopy(self.evidence)
                record = payload["records"][0]
                if corruption == "row":
                    record["source_url"] = payload["records"][1]["source_url"]
                elif corruption == "trial":
                    record["harness_version_variants"][0]["source_url"] = "https://example.org/trials/123"
                elif corruption == "unscoped_trial":
                    trial_id = record["harness_version_variants"][0]["source_url"].rsplit("/", 1)[-1]
                    record["harness_version_variants"][0]["source_url"] = "https://hub.harborframework.com/trials/" + trial_id
                elif corruption == "wrong_job":
                    trial_id = record["harness_version_variants"][0]["source_url"].rsplit("/", 1)[-1]
                    wrong_job = next(r["verification"]["job_urls"][0] for r in payload["records"] if r["verification"]["job_urls"][0] not in record["verification"]["job_urls"])
                    record["harness_version_variants"][0]["source_url"] = wrong_job + "/trials/" + trial_id
                elif corruption == "job":
                    record["verification"]["job_urls"] = ["https://hub.harborframework.com.evil.example/jobs/123"]
                elif corruption == "api":
                    next(iter(payload["audit_query_templates"].values()))["endpoint"] = "https://example.org/api"
                elif corruption == "api_row":
                    record["verification"]["api_requests"][0]["query"]["row_id"] = "eq." + payload["records"][1]["row_id"]
                else:
                    source = next(r for r in payload["records"] if r["supplemental_sources"])["supplemental_sources"][0]
                    source["url"] = "https://github.com/harbor-framework/terminal-bench-2-1/blob/main/leaderboard/submissions/example.json"
                with self.assertRaises(ValueError):
                    self.load_fixture(payload)

    def test_compaction_window_is_raw_configuration_not_a_threshold(self):
        evidence = importer.load_config_evidence()
        configured = [r for r in evidence.values() if r["raw_config"]]
        self.assertEqual(len(configured), 2)
        for record in configured:
            raw = record["raw_config"][0]
            self.assertEqual(raw["name"], "CLAUDE_CODE_AUTO_COMPACT_WINDOW")
            self.assertEqual(raw["value"], "1000000")
            self.assertEqual(raw["trial_count"], record["match"]["trial_count"])
            self.assertNotIn("compaction_threshold_tokens", record)
        payload = copy.deepcopy(self.evidence)
        next(r for r in payload["records"] if r["raw_config"])["raw_config"][0]["compaction_threshold_tokens"] = 1000000
        with self.assertRaisesRegex(ValueError, "raw compaction"):
            self.load_fixture(payload)

    def test_curated_cost_and_configuration_source_pass_through_without_totals(self):
        raw = {
            "id": "vendor", "benchmark_id": "terminal-bench-4.0", "harness": "Claude Code",
            "harness_org": "Anthropic", "model": "example", "model_org": "Anthropic", "accuracy": 60,
            "source_type": "vendor_reported", "source_url": "https://www.anthropic.com/",
            "source_title": "Report", "source_publisher": "Anthropic",
            "average_cost_per_task_usd": 104.41, "configuration_source_url": "https://www.anthropic.com/system-card",
        }
        row = importer.normalize_curated_row(raw, "2026-09-10")
        self.assertEqual(row["average_cost_per_task_usd"], 104.41)
        self.assertEqual(row["configuration_source_url"], raw["configuration_source_url"])
        self.assertIsNone(row["total_cost_usd"])
        self.assertIsNone(row["run_config"])

    def test_standard_error_is_not_a_reported_ci(self):
        raw = {"id": "test", "rank": 1, "metrics": {"accuracy": 80, "accuracy_stderr": 2}}
        row = importer.normalize_row(raw, importer.BENCHMARKS[0])
        self.assertEqual(row["accuracy_stderr"], 2)
        self.assertIsNone(row["accuracy_ci95_half_width"])
        raw["metrics"]["accuracy_ci95_half_width"] = 3.75
        self.assertEqual(importer.normalize_row(raw, importer.BENCHMARKS[0])["accuracy_ci95_half_width"], 3.75)

    def test_vendor_maximum_effort_declaration_is_run_specific(self):
        rows, _ = importer.load_curated_rows()
        rows = {row["id"]: row for row in rows}
        terminus = rows["vendor-glm-5-2-tb21-terminus-2"]
        self.assertEqual(terminus["accuracy"], 81.0)
        self.assertEqual(terminus["thinking_level"], "max")
        self.assertEqual(terminus["harness"]["label"], "Terminus 2")
        self.assertEqual(terminus["configuration_source_url"],
            "https://raw.githubusercontent.com/zai-org/GLM-5/767691ae11d6d5be20f3ee8c83a2fcb9a434699f/resources/bench_52.png")
        self.assertIsNone(rows["vendor-glm-5-2-tb21-claude-code"]["thinking_level"])
        self.assertIsNone(terminus["harness_version"])
        self.assertIsNone(terminus["total_cost_usd"])

    def test_reproduction_guidance_does_not_become_observed_effort(self):
        rows, _ = importer.load_curated_rows()
        rows = {row["id"]: row for row in rows}
        for row_id in (
            "vendor-glm-5-3-tb21-claude-code",
            "vendor-glm-5-3-flash-tb21-claude-code",
        ):
            with self.subTest(row_id=row_id):
                row = rows[row_id]
                self.assertIsNone(row["thinking_level"])
                self.assertIsNone(row["total_cost_usd"])
                self.assertIn("max reasoning effort", row["protocol_note"]["en"])
                self.assertIn("reproduction guidance", row["protocol_note"]["en"])
                self.assertIn("复现建议", row["protocol_note"]["zh"])
                self.assertRegex(row["configuration_source_url"],
                    r"^https://huggingface\.co/zai-org/GLM-5\.3(?:-Flash)?/blob/[0-9a-f]{40}/README\.md#note$")

    def test_vendor_modes_hours_and_unknown_compression_are_not_inferred(self):
        rows, _ = importer.load_curated_rows()
        for row in rows:
            if row["source_type"] != "vendor_reported":
                continue
            if row.get("harness_mode"):
                self.assertEqual(row["harness_mode"], "--bare" if row["id"] == "vendor-mythos-5-1-tb40" else "minimal mode")
                self.assertIsNone(row["harness_version"])
            if row.get("timeout_note"):
                self.assertIsNone(row["timeout_multiplier"])
            self.assertIsNone(row["run_config"])
            self.assertIsNone(row["accuracy_ci95_half_width"])

    def test_trace_archive_counts_preserve_source_gaps(self):
        from verify_site import verify_trace_archive

        rows, _ = importer.load_curated_rows()
        rows = [row for row in rows if row["source_type"] == "penguin_run"]
        self.assertEqual(len(rows), 6)
        for row in rows:
            config = row["run_config"]
            verify_trace_archive(config, row["trial_count"], row["id"])
            self.assertEqual(config["trace_archive_status"], "local_with_gaps")
            self.assertEqual(config["trace_archive"]["archived_on"], "2026-09-14")
            self.assertNotIn("Full traces are not archived", row["protocol_note"]["en"])
            self.assertNotIn("完整 trace 尚未归档", row["protocol_note"]["zh"])
        archives = [row["run_config"]["trace_archive"] for row in rows]
        self.assertEqual(sum(a["trajectory_trials"] for a in archives), 2474)
        self.assertEqual(sum(a["missing_trajectory_trials"] for a in archives), 196)
        self.assertEqual(sum(a["invalid_jsonl_files"] for a in archives), 244)

    def test_invalid_or_misleading_trace_archives_are_rejected(self):
        from verify_site import verify_trace_archive

        rows, _ = importer.load_curated_rows()
        row = next(row for row in rows if row["source_type"] == "penguin_run")
        for corruption in ("status", "count", "boolean", "hash", "path", "format_count"):
            with self.subTest(corruption=corruption):
                config = copy.deepcopy(row["run_config"])
                archive = config["trace_archive"]
                if corruption == "status":
                    config["trace_archive_status"] = "complete"
                elif corruption == "count":
                    archive["missing_trajectory_trials"] += 1
                elif corruption == "boolean":
                    archive["invalid_jsonl_files"] = True
                elif corruption == "hash":
                    archive["manifest_sha256"] = "unverified"
                elif corruption == "path":
                    archive["manifest_path"] = "/home/example/private/manifest.json"
                else:
                    archive["invalid_jsonl_files"] = archive["native_jsonl_files"] + 1
                with self.assertRaises(AssertionError):
                    verify_trace_archive(config, row["trial_count"], row["id"])

    def test_reported_windows_hours_and_mean_cost_keep_their_own_units(self):
        rows, _ = importer.load_curated_rows()
        rows = {row["id"]: row for row in rows}
        for row_id, hours in {
            "vendor-glm-5-3-tb21-claude-code": 6,
            "vendor-glm-5-3-flash-tb21-claude-code": 6,
            "vendor-qwen3-8-max-tb21-claude-code": 5,
            "vendor-glm-5-2-tb21-terminus-2": 4,
        }.items():
            self.assertEqual(rows[row_id]["timeout_hours"], hours)
            self.assertIsNone(rows[row_id]["timeout_multiplier"])
        unlimited = rows["vendor-glm-5-2-tb21-claude-code"]
        self.assertIs(unlimited["wall_clock_limit_removed"], True)
        self.assertIsNone(unlimited["timeout_hours"])
        self.assertIsNone(unlimited["timeout_multiplier"])
        terminus = rows["vendor-glm-5-2-tb21-terminus-2"]
        self.assertEqual(terminus["context_window_label"], "256K")
        self.assertIsNone(terminus["run_config"])
        mythos = rows["vendor-mythos-5-1-tb40"]
        self.assertEqual(mythos["average_cost_per_task_usd"], 18)
        self.assertIsNone(mythos["total_cost_usd"])


if __name__ == "__main__":
    unittest.main()
