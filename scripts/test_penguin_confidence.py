"""Offline CI calculation, provenance and import regressions; no private archive needed."""

import copy
import builtins
import json
import math
import unittest
from unittest.mock import patch

import import_terminal_bench as importer
import penguin_confidence as ci


class PenguinConfidenceTests(unittest.TestCase):
    def setUp(self):
        self.evidence = json.loads(ci.EVIDENCE_PATH.read_text())
        curated = json.loads(importer.CURATED_INPUT.read_text())
        self.rows = [
            importer.normalize_curated_row(row, curated["verified_at"])
            for row in curated["results"]
        ]

    def test_six_audited_intervals(self):
        expected = {
            "E01": (282, 1, 1.329456, 2.605734),
            "E02": (299, 10, 1.490618, 2.921611),
            "E03": (327, 8, 1.464989, 2.871379),
            "E04": (278, 2, 1.482124, 2.904964),
            "E05": (341, 2, 1.271203, 2.491558),
            "E06": (340, 4, 1.178437, 2.309736),
        }
        original = copy.deepcopy(self.rows)
        ci.apply_penguin_confidence(self.rows, self.evidence)
        found = set()
        for before, row in zip(original, self.rows):
            if row["source_type"] != "penguin_run":
                self.assertEqual(before, row)
                continue
            experiment = row["run_config"]["experiment_id"]
            successes, missing, stderr, half = expected[experiment]
            found.add(experiment)
            self.assertEqual(row["successes"], successes)
            self.assertEqual(row["accuracy"], before["accuracy"])
            self.assertEqual(row["trial_count"], 445)
            self.assertAlmostEqual(row["accuracy_stderr"], stderr, places=6)
            self.assertAlmostEqual(row["accuracy_ci95_half_width"], half, places=6)
            provenance = row["accuracy_ci95_provenance"]
            self.assertEqual(provenance["kind"], "derived_from_archived_trials")
            self.assertEqual(provenance["missing_reward_count"], missing)
            self.assertEqual(provenance["units"], "percentage_points")
        self.assertEqual(found, set(expected))

    def test_e05_example_uses_task_variation_not_pooled_binomial(self):
        result = ci.metrics_from_histogram([9, 6, 5, 3, 14, 52], 5)
        self.assertEqual(result["successes"], 341)
        self.assertAlmostEqual(result["accuracy_stderr"], 10 * math.sqrt(128) / 89)
        self.assertAlmostEqual(result["accuracy_ci95_half_width"], 2.491558276180913)
        # 0/5 and 5/5 tasks contribute zero estimated variance under this method.
        self.assertEqual(ci.metrics_from_histogram([3, 0, 0, 0, 0, 2], 5)["accuracy_stderr"], 0)

    def test_float_sum_changes_cannot_drift_the_published_snapshot(self):
        def compensated_sum(values):
            values = list(values)
            if any(type(value) is float for value in values):
                return math.fsum(values)
            return builtins.sum(values)

        # Simulate a compensated float sum even on a Python 3.11 developer
        # machine; the same snapshot must pass on newer CI runners.
        with patch.object(ci, "sum", compensated_sum, create=True):
            for record in self.evidence["records"]:
                calculated = ci.metrics_from_histogram(
                    record["task_success_histogram"], record["attempts_per_task"]
                )
                for key, value in calculated.items():
                    self.assertEqual(value, record[key], (record["experiment_id"], key))
            payload = json.loads(importer.DEFAULT_OUTPUT.read_text())
            self.assertEqual(importer.replace_curated_results(copy.deepcopy(payload)), payload)

    def trial_fixture(self):
        return {
            "summary": {
                "experiment_id": "test", "job_name": "fixture",
                "thinking_level": "max", "compression_trigger_label": "128k",
                "timeout_multiplier": 1, "attempts_per_task": 5, "task_count": 2,
                "total_trials": 10, "successes": 6, "missing_rewards": 1,
                "resolution_rate_pct": 60,
            },
            "trial_columns": ["name", "reward", "error_type"],
            "trial_rows": [
                [f"{task}__{i}", reward, "ErrorEvenWithSuccess" if i == 0 else None]
                for task, rewards in (("a", [1, 1, 1, 1, 1]), ("b", [1, 0, 0, 0, None]))
                for i, reward in enumerate(rewards)
            ],
        }

    def test_null_rewards_and_success_despite_error_are_preserved(self):
        fixture = self.trial_fixture()
        original = copy.deepcopy(fixture)
        result = ci.derive_record(fixture)
        self.assertEqual(fixture, original)
        self.assertEqual(result["successes"], 6)
        self.assertEqual(result["trial_count"], 10)
        self.assertEqual(result["missing_reward_count"], 1)
        self.assertEqual(result["task_success_histogram"], [0, 1, 0, 0, 0, 1])

    def test_incomplete_duplicate_or_nonbinary_trials_fail_closed(self):
        for corruption in ("missing", "duplicate", "bad_reward", "bad_summary"):
            with self.subTest(corruption=corruption):
                fixture = self.trial_fixture()
                if corruption == "missing":
                    fixture["trial_rows"].pop()
                elif corruption == "duplicate":
                    fixture["trial_rows"][-1] = fixture["trial_rows"][0]
                elif corruption == "bad_reward":
                    fixture["trial_rows"][0][1] = 0.5
                else:
                    fixture["summary"]["successes"] = 5
                with self.assertRaises(ValueError):
                    ci.derive_record(fixture)

    def test_binding_rejects_stale_job_config_counts_and_accuracy(self):
        for field in ("job_name", "thinking_level", "compression_trigger_label",
                      "timeout_multiplier", "trial_count", "successes", "accuracy"):
            with self.subTest(field=field):
                rows = copy.deepcopy(self.rows)
                row = next(row for row in rows if row["source_type"] == "penguin_run")
                container = row if field in row else row["run_config"]
                # timeout exists on both row and config; binding uses the actual run config.
                if field == "timeout_multiplier":
                    container = row["run_config"]
                container[field] = "changed" if isinstance(container[field], str) else container[field] + 1
                with self.assertRaises(ValueError):
                    ci.apply_penguin_confidence(rows, self.evidence)

    def test_invalid_histogram_or_ci_does_not_get_published(self):
        for field, value in (("accuracy_stderr", float("nan")), ("accuracy_ci95_half_width", 0.01),
                             ("task_success_histogram", [9, 6, 5, 3, 14, -1]),
                             ("missing_reward_count", 446)):
            evidence = copy.deepcopy(self.evidence)
            evidence["records"][0][field] = value
            with self.assertRaises(ValueError):
                ci.apply_penguin_confidence(copy.deepcopy(self.rows), evidence)

    def test_rank_and_input_order_do_not_change_mapping(self):
        expected = ci.apply_penguin_confidence(copy.deepcopy(self.rows), self.evidence)
        rows = list(reversed(copy.deepcopy(self.rows)))
        for row in rows:
            row["rank"] = 999
        actual = ci.apply_penguin_confidence(rows, self.evidence)
        self.assertEqual(
            {row["id"]: row["accuracy_ci95_half_width"] for row in actual},
            {row["id"]: row["accuracy_ci95_half_width"] for row in expected},
        )

    def test_unknown_future_experiment_does_not_inherit_ci(self):
        extra = copy.deepcopy(next(row for row in self.rows if row["source_type"] == "penguin_run"))
        extra["run_config"]["experiment_id"] = "E07"
        self.rows.append(extra)
        ci.apply_penguin_confidence(self.rows, self.evidence)
        self.assertIsNone(extra["accuracy_ci95_half_width"])
        self.assertNotIn("accuracy_ci95_provenance", extra)

    def test_both_import_paths_preserve_derived_ci_and_existing_official_metrics(self):
        payload = json.loads(importer.DEFAULT_OUTPUT.read_text())
        updated = importer.replace_curated_results(copy.deepcopy(payload))
        self.assertEqual(updated, payload)
        # Exercise the full import path offline using the current official snapshot
        # and the real curated loader (the same path used after live API refresh).
        def normalized(config, raw, curated):
            bench = copy.deepcopy(next(b for b in payload["benchmarks"] if b["id"] == config["id"]))
            bench["results"] = [r for r in bench["results"] if r["source_type"] == "benchmark_official"]
            bench["results"] += [r for r in curated if r["benchmark_id"] == config["id"]]
            return bench
        with patch.object(importer, "fetch_leaderboard", return_value={}), \
             patch.object(importer, "normalize_benchmark", side_effect=normalized):
            full = importer.build_payload()
        for previous, bench in zip(payload["benchmarks"], full["benchmarks"]):
            before = {row["id"]: row for row in previous["results"]}
            self.assertEqual({row["id"]: row for row in bench["results"]}, before)


if __name__ == "__main__":
    unittest.main()
