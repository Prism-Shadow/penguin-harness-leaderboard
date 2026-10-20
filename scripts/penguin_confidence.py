#!/usr/bin/env python3
"""Reproduce Penguin's derived intervals without changing the original archive.

Print derived JSON: python3 scripts/penguin_confidence.py --archive PATH
Verify it:         python3 scripts/penguin_confidence.py --archive PATH --check
Only aggregate success-count histograms are included in the derived artifact.
"""

from __future__ import annotations

import argparse
from collections import Counter, defaultdict
from datetime import date
import hashlib
import json
import math
from pathlib import Path


EVIDENCE_PATH = Path(__file__).resolve().parents[1] / "data/penguin_confidence_intervals.json"
METHOD = "task_stratified_normal_95"
METHOD_URL = (
    "https://github.com/harbor-framework/terminal-bench/blob/main/"
    "leaderboard/src/leaderboard/core/metrics.py"
)
DERIVED_AT = "2026-10-20"


def metrics_from_histogram(histogram: list[int], attempts: int) -> dict:
    """Task counts indexed by successes (0..k); return percentage-point metrics."""
    if (
        type(attempts) is not int or attempts < 2
        or len(histogram) != attempts + 1
        or any(type(count) is not int or count < 0 for count in histogram)
        or sum(histogram) == 0
    ):
        raise ValueError("A nonempty histogram with at least two attempts per task is required")
    tasks = sum(histogram)
    successes = sum(c * count for c, count in enumerate(histogram))
    variance = sum(
        count * (c / attempts) * (1 - c / attempts) / (attempts - 1)
        for c, count in enumerate(histogram)
    ) / tasks**2
    stderr = 100 * math.sqrt(variance)
    return {
        "task_count": tasks,
        "trial_count": tasks * attempts,
        "successes": successes,
        "accuracy": 100 * successes / (tasks * attempts),
        "accuracy_stderr": stderr,
        "accuracy_ci95_half_width": 1.96 * stderr,
    }


def derive_record(record: dict) -> dict:
    summary = record["summary"]
    columns = record["trial_columns"]
    by_task = defaultdict(list)
    seen = set()
    missing = 0
    for values in record["trial_rows"]:
        trial = dict(zip(columns, values, strict=True))
        name, reward = trial["name"], trial["reward"]
        if name in seen or "__" not in name:
            raise ValueError("Duplicate trial or unrecognized task/trial name")
        if reward is not None and (type(reward) not in (int, float) or reward not in (0, 1)):
            raise ValueError("Expected binary or missing rewards")
        seen.add(name)
        missing += reward is None
        # Reward is authoritative even if the record also has an error_type.
        by_task[name.rsplit("__", 1)[0]].append(reward == 1)
    attempts = summary["attempts_per_task"]
    if not by_task or any(len(rewards) != attempts for rewards in by_task.values()):
        raise ValueError("Incomplete or unequal attempts per task")
    counts = Counter(sum(rewards) for rewards in by_task.values())
    histogram = [counts[c] for c in range(attempts + 1)]
    metrics = metrics_from_histogram(histogram, attempts)
    if (
        metrics["task_count"] != summary["task_count"]
        or metrics["trial_count"] != summary["total_trials"]
        or metrics["successes"] != summary["successes"]
        or missing != summary["missing_rewards"]
        or not math.isclose(metrics["accuracy"], summary["resolution_rate_pct"], abs_tol=1e-10)
    ):
        raise ValueError("Trial-level calculation disagrees with archived summary")
    return {
        "experiment_id": summary["experiment_id"],
        "benchmark_id": "terminal-bench-2.1",
        "job_name": summary["job_name"],
        "thinking_level": summary["thinking_level"],
        "compression_trigger_label": summary["compression_trigger_label"],
        "timeout_multiplier": summary["timeout_multiplier"],
        "attempts_per_task": attempts,
        "missing_reward_count": missing,
        "task_success_histogram": histogram,
        **metrics,
    }


def derive_archive(path: Path) -> dict:
    content = path.read_bytes()
    archive = json.loads(content)
    records = sorted(
        (derive_record(record) for record in archive["records"]),
        key=lambda record: record["experiment_id"],
    )
    return {
        "schema_version": 1,
        "derived_at": DERIVED_AT,
        "method": METHOD,
        "method_url": METHOD_URL,
        "confidence_level": 0.95,
        "z_score": 1.96,
        "units": "percentage_points",
        "missing_reward_policy": "count_as_failure_keep_in_denominator",
        "archive": {
            "filename": path.name,
            "archived_on": archive["archive_date_utc"],
            "sha256": hashlib.sha256(content).hexdigest(),
        },
        "records": records,
    }


def apply_penguin_confidence(rows: list[dict], evidence: dict | None = None) -> list[dict]:
    """Bind derived metrics by experiment AND job/config identity, never ranking."""
    if evidence is None:
        evidence = json.loads(EVIDENCE_PATH.read_text(encoding="utf-8"))
    if (
        evidence["schema_version"] != 1 or evidence["method"] != METHOD
        or evidence["method_url"] != METHOD_URL or evidence["units"] != "percentage_points"
        or evidence["confidence_level"] != 0.95 or evidence["z_score"] != 1.96
        or evidence["missing_reward_policy"] != "count_as_failure_keep_in_denominator"
    ):
        raise ValueError("Unsupported derived confidence-interval method")
    date.fromisoformat(evidence["derived_at"])
    archive = evidence["archive"]
    date.fromisoformat(archive["archived_on"])
    if len(archive["sha256"]) != 64 or any(c not in "0123456789abcdef" for c in archive["sha256"]):
        raise ValueError("Invalid source archive hash")
    records = {record["experiment_id"]: record for record in evidence["records"]}
    if len(records) != len(evidence["records"]):
        raise ValueError("Duplicate experiment in confidence evidence")
    matched = set()
    for row in rows:
        if row["source_type"] != "penguin_run":
            continue
        config = row.get("run_config") or {}
        experiment = config.get("experiment_id")
        if experiment not in records:
            continue  # Future runs without audited evidence must not inherit intervals.
        record = records[experiment]
        if experiment in matched:
            raise ValueError("Duplicate Penguin experiment")
        identity = {
            "benchmark_id": row["benchmark_id"], "job_name": config.get("job_name"),
            "thinking_level": row["thinking_level"],
            "compression_trigger_label": config.get("compression_trigger_label"),
            "timeout_multiplier": config.get("timeout_multiplier"),
            "task_count": config.get("task_count"), "attempts_per_task": config.get("attempts_per_task"),
            "trial_count": row["trial_count"], "successes": row["successes"],
        }
        if any(record[key] != value for key, value in identity.items()):
            raise ValueError(f"Confidence evidence no longer matches {experiment}; re-audit it")
        calculated = metrics_from_histogram(record["task_success_histogram"], record["attempts_per_task"])
        if any(
            type(record[key]) not in (int, float) or not math.isfinite(record[key])
            or not math.isclose(record[key], value, rel_tol=0, abs_tol=1e-10)
            for key, value in calculated.items()
        ) or not math.isclose(row["accuracy"], calculated["accuracy"], rel_tol=0, abs_tol=1e-10):
            raise ValueError(f"Confidence evidence metrics disagree for {experiment}")
        missing = record["missing_reward_count"]
        if type(missing) is not int or not 0 <= missing <= row["trial_count"] - row["successes"]:
            raise ValueError("Invalid missing-reward count")
        row.update({
            "accuracy_stderr": calculated["accuracy_stderr"],
            "accuracy_ci95_half_width": calculated["accuracy_ci95_half_width"],
            "accuracy_ci95_provenance": {
                "kind": "derived_from_archived_trials",
                **{key: evidence[key] for key in (
                    "method", "method_url", "derived_at", "units", "confidence_level",
                    "z_score", "missing_reward_policy",
                )},
                "archive": archive,
                "task_count": record["task_count"],
                "attempts_per_task": record["attempts_per_task"],
                "missing_reward_count": missing,
            },
        })
        matched.add(experiment)
    if set(records) != matched:
        raise ValueError(f"Unmatched Penguin confidence evidence: {sorted(set(records) - matched)}")
    return rows


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--archive", type=Path, required=True)
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    evidence = derive_archive(args.archive)
    if args.check:
        if evidence != json.loads(EVIDENCE_PATH.read_text(encoding="utf-8")):
            raise SystemExit("Derived intervals differ from the archived trials")
        print("All six derived intervals reproduce exactly from the unchanged archive.")
    else:
        print(json.dumps(evidence, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
