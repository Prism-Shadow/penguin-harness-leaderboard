#!/usr/bin/env python3
"""Build the published leaderboard data from merged Terminal-Bench submissions."""

from __future__ import annotations

import argparse
import json
import subprocess
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SOURCE = ROOT.parent / "terminal-bench-2-1"
DEFAULT_OUTPUT = ROOT / "site" / "data" / "benchmarks.json"


def display_label(value: Any) -> str:
    if isinstance(value, dict):
        return str(value.get("label") or value.get("url") or "")
    return str(value or "")


def display_url(value: Any) -> str:
    if isinstance(value, dict):
        return str(value.get("url") or "")
    return str(value or "")


def percent(value: Any) -> float | None:
    if value is None:
        return None
    return round(float(value) * 100, 2)


def git_commit(repo: Path) -> str:
    completed = subprocess.run(
        ["git", "-C", str(repo), "rev-parse", "HEAD"],
        check=True,
        capture_output=True,
        text=True,
    )
    return completed.stdout.strip()


def git_commit_date(repo: Path) -> str:
    completed = subprocess.run(
        ["git", "-C", str(repo), "show", "-s", "--format=%cs", "HEAD"],
        check=True,
        capture_output=True,
        text=True,
    )
    return completed.stdout.strip()


def load_submissions(source: Path) -> list[dict[str, Any]]:
    submissions_dir = source / "leaderboard" / "submissions"
    source_files = sorted(submissions_dir.glob("*.json"))
    if not source_files:
        raise SystemExit(f"No submission JSON files found under {submissions_dir}")

    results: list[dict[str, Any]] = []
    for source_file in source_files:
        raw = json.loads(source_file.read_text(encoding="utf-8"))
        metadata = raw["metadata"]
        metrics = raw["metrics"]
        source_filter = raw["source_filter"]
        source_jobs = raw.get("source_jobs") or []
        token_keys = (
            "uncached_input_tokens",
            "cached_input_tokens",
            "output_tokens",
        )

        result = {
            "id": source_file.stem,
            "date": metadata["date"],
            "harness": display_label(metadata["agent_display"]),
            "harness_version": source_filter.get("agent_version") or "",
            "harness_org": display_label(metadata["agent_org"]),
            "model": display_label(metadata["model_display"]),
            "model_id": source_filter["model_name"],
            "model_org": display_label(metadata["model_org"]),
            # Official leaderboard display metadata is canonical. One historical
            # Grok row has a null source_filter value but metadata says "high".
            "thinking_level": metadata.get("reasoning_effort") or "none",
            # The official submission schema does not expose a sandbox field.
            # Keep it nullable so future benchmark/self-run records can report it
            # without inventing a value for historical official submissions.
            "sandbox": None,
            "accuracy": float(metrics["accuracy"]),
            "accuracy_stderr": float(metrics["accuracy_stderr"]),
            "pass_at_2": percent(metrics.get("pass_at_2")),
            "pass_at_3": percent(metrics.get("pass_at_3")),
            "pass_at_4": percent(metrics.get("pass_at_4")),
            "pass_at_5": percent(metrics.get("pass_at_5")),
            "minimum_trials_per_task": 5,
            "trial_count": int(metrics["n_trials"]),
            "disqualified_trials": len(raw.get("disqualified_trials") or []),
            "reward_hacks": float(metrics["reward_hacks"]),
            "uncached_input_tokens": int(
                metrics.get("uncached_input_tokens") or 0
            ),
            "cached_input_tokens": int(metrics.get("cached_input_tokens") or 0),
            "output_tokens": int(metrics.get("output_tokens") or 0),
            "total_tokens": sum(
                int(metrics.get(key) or 0) for key in token_keys
            ),
            "total_cost_usd": float(metrics["total_cost_usd"]),
            "average_trial_duration_seconds": float(
                metrics["avg_trial_duration_sec"]
            ),
            "source_pr": display_url(metadata["pr_url"]),
            "source_jobs": [
                f"https://hub.harborframework.com/jobs/{job_id}"
                for job_id in source_jobs
            ],
            "source_file": str(source_file.relative_to(source)),
        }
        results.append(result)

    results.sort(
        key=lambda row: (
            -row["accuracy"],
            row["model"],
            row["harness"],
            row["date"],
        )
    )
    seen_models: set[str] = set()
    previous_accuracy: float | None = None
    competition_rank = 0
    for position, result in enumerate(results, start=1):
        if result["accuracy"] != previous_accuracy:
            competition_rank = position
            previous_accuracy = result["accuracy"]
        result["accuracy_rank"] = competition_rank
        result["best_for_model"] = result["model"] not in seen_models
        seen_models.add(result["model"])
    return results


def build_payload(source: Path) -> dict[str, Any]:
    results = load_submissions(source)
    commit = git_commit(source)
    commit_date = git_commit_date(source)
    best = results[0]
    return {
        "schema_version": 1,
        "updated": commit_date,
        "default_benchmark": "terminal-bench-2.1",
        "benchmarks": [
            {
                "id": "terminal-bench-2.1",
                "status": "available",
                "name": "Terminal-Bench 2.1",
                "short_name": "TB 2.1",
                "description": {
                    "en": (
                        "89 realistic terminal tasks scored across merged, "
                        "maintainer-reviewed model and harness submissions."
                    ),
                    "zh": (
                        "89 道真实终端任务，汇总已经合并并由维护者审核的"
                        "模型与 Harness submission。"
                    ),
                },
                "task_count": 89,
                "submission_count": len(results),
                "model_count": len({row["model"] for row in results}),
                "best_accuracy": best["accuracy"],
                "best_result_label": f"{best['harness']} · {best['model']}",
                "score_note": {
                    "en": (
                        "Accuracy is successful trials divided by all trials. "
                        "Reward-hack disqualifications are already scored as zero."
                    ),
                    "zh": (
                        "Accuracy 为成功 trials 除以全部 trials；被判定为 "
                        "reward hacking 的试验已经按 0 分计入。"
                    ),
                },
                "protocol_note": {
                    "en": (
                        "Official submissions run every task at least five times. "
                        "pass@k is reported separately from Accuracy."
                    ),
                    "zh": (
                        "官方 submission 对每道任务至少运行 5 次；"
                        "pass@k 与 Accuracy 分开报告。"
                    ),
                },
                "repository_url": (
                    "https://github.com/harbor-framework/terminal-bench-2-1"
                ),
                "snapshot_commit": commit,
                "results": results,
            },
            {
                "id": "coming-soon",
                "status": "coming-soon",
                "name": "More benchmarks",
                "short_name": "Coming soon",
                "description": {
                    "en": "Additional benchmark views can use the same schema.",
                    "zh": "后续 benchmark 可以直接复用同一数据结构。",
                },
                "results": [],
            },
        ],
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--source",
        type=Path,
        default=DEFAULT_SOURCE,
        help="Path to a checkout of harbor-framework/terminal-bench-2-1",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=DEFAULT_OUTPUT,
        help="Destination JSON used by the static site",
    )
    args = parser.parse_args()

    source = args.source.resolve()
    output = args.output.resolve()
    payload = build_payload(source)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    available = next(
        bench
        for bench in payload["benchmarks"]
        if bench["status"] == "available"
    )
    print(
        f"Wrote {available['submission_count']} submissions from "
        f"{available['snapshot_commit'][:12]} to {output}"
    )


if __name__ == "__main__":
    main()
