#!/usr/bin/env python3
"""Refresh the static leaderboard from the official tbench.ai API."""

from __future__ import annotations

import argparse
import json
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_OUTPUT = ROOT / "site" / "data" / "benchmarks.json"
API_URL = "https://ofhuhcpkvzjlejydnvyd.supabase.co/functions/v1/leaderboard-read"
BENCHMARKS = (
    {
        "id": "terminal-bench-2.1",
        "version": "2.1",
        "package": "terminal-bench/terminal-bench-2-1",
        "leaderboard": "main",
        "dataset_version": "latest",
    },
    {
        "id": "terminal-bench-3.0",
        "version": "3.0",
        "package": "terminal-bench/terminal-bench",
        "leaderboard": "3-0-0",
        "dataset_version": "1",
    },
    {
        "id": "terminal-bench-4.0",
        "version": "4.0",
        "package": "terminal-bench/terminal-bench",
        "leaderboard": "4-0-0",
        "dataset_version": "4",
    },
)


def fetch_leaderboard(package: str, leaderboard: str) -> dict[str, Any]:
    body = json.dumps({"package": package, "name": leaderboard}).encode("utf-8")
    request = urllib.request.Request(
        API_URL,
        data=body,
        headers={
            "Content-Type": "application/json",
            "User-Agent": "penguin-harness-leaderboard/1.0",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            return json.load(response)
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as error:
        raise SystemExit(f"Could not read the official leaderboard API: {error}") from error


def linked(value: Any) -> dict[str, str | None]:
    if not isinstance(value, dict):
        return {"label": str(value or ""), "url": None}
    return {
        "label": str(value.get("label") or ""),
        "url": str(value["url"]) if value.get("url") else None,
    }


def normalize_row(raw: dict[str, Any], config: dict[str, str]) -> dict[str, Any]:
    metadata = raw.get("metadata") or {}
    metrics = raw.get("metrics") or {}
    ci95 = metrics.get("accuracy_ci95_half_width")
    stderr = metrics.get("accuracy_stderr")
    if ci95 is None and stderr is not None:
        ci95 = float(stderr) * 1.96

    release_date = metadata.get("release_date") or metadata.get("date")
    package_org, package_name = config["package"].split("/", maxsplit=1)
    official_detail_url = (
        "https://hub.harborframework.com/datasets/"
        f"{package_org}/{package_name}/{config['dataset_version']}/leaderboards/"
        f"{config['leaderboard']}/rows/{raw['id']}"
    )
    return {
        "id": str(raw["id"]),
        "benchmark_id": config["id"],
        "rank": int(raw["rank"]),
        "harness": linked(metadata.get("agent_display")),
        "harness_org": linked(metadata.get("agent_org")),
        "model": linked(metadata.get("model_display")),
        "model_org": linked(metadata.get("model_org")),
        "thinking_level": metadata.get("reasoning_effort"),
        "accuracy": float(metrics["accuracy"]),
        "accuracy_stderr": metrics.get("accuracy_stderr"),
        "accuracy_ci95_half_width": round(float(ci95), 2) if ci95 is not None else None,
        "display_accuracy": metrics.get("display_accuracy"),
        "release_date": release_date,
        "display_release_date": (
            metadata.get("display_release_date")
            or metadata.get("display_date")
            or release_date
        ),
        "total_tokens": metrics.get("total_tokens"),
        "display_total_tokens": metrics.get("display_total_tokens"),
        "total_cost_usd": metrics.get("total_cost_usd"),
        "display_cost": (
            metrics.get("display_cost")
            or metrics.get("display_total_cost_usd")
        ),
        "trial_count": raw.get("n_trials") or metrics.get("n_trials"),
        "pass_at_2": metrics.get("pass_at_2"),
        "pass_at_3": metrics.get("pass_at_3"),
        "pass_at_4": metrics.get("pass_at_4"),
        "pass_at_5": metrics.get("pass_at_5"),
        "successes": metrics.get("successes"),
        "uncached_input_tokens": metrics.get("uncached_input_tokens"),
        "cached_input_tokens": metrics.get("cached_input_tokens"),
        "output_tokens": metrics.get("output_tokens"),
        "average_trial_duration_seconds": metrics.get("avg_trial_duration_sec"),
        "reward_hacks": metrics.get("reward_hacks"),
        "display_reward_hacks": (
            linked(metrics.get("display_reward_hacks"))
            if metrics.get("display_reward_hacks")
            else None
        ),
        "submission": linked(metadata.get("pr_url")) if metadata.get("pr_url") else None,
        "official_detail_url": official_detail_url,
    }


def normalize_benchmark(config: dict[str, str], raw: dict[str, Any]) -> dict[str, Any]:
    leaderboard = raw.get("leaderboard") or {}
    visible_rows = [row for row in raw.get("rows", []) if row.get("status") == "display"]
    rows = [normalize_row(row, config) for row in visible_rows]
    rows.sort(key=lambda row: (row["rank"], -row["accuracy"], row["model"]["label"]))

    expected_total = (raw.get("pagination") or {}).get("total")
    if expected_total is not None and int(expected_total) != len(rows):
        raise SystemExit(
            f"Official API pagination for {config['version']} reports {expected_total} rows, "
            f"but {len(rows)} display rows were returned"
        )

    version = config["version"]
    return {
        "id": config["id"],
        "version": version,
        "name": str(leaderboard.get("title") or f"Terminal-Bench {version}"),
        "official_url": f"https://www.tbench.ai/?version={version}",
        "source_api": {
            "package": config["package"],
            "leaderboard": config["leaderboard"],
            "dataset_version": config["dataset_version"],
        },
        "snapshot_updated_at": leaderboard.get("updated_at"),
        "result_count": len(rows),
        "model_count": len({row["model"]["label"] for row in rows}),
        "harness_count": len({row["harness"]["label"] for row in rows}),
        "best_accuracy": max(row["accuracy"] for row in rows),
        "description": {
            "en": f"Official Terminal-Bench {version} leaderboard snapshot from tbench.ai.",
            "zh": f"来自 tbench.ai 的 Terminal-Bench {version} 官方榜单快照。",
        },
        "results": rows,
    }


def build_payload() -> dict[str, Any]:
    benchmarks = [
        normalize_benchmark(
            config,
            fetch_leaderboard(config["package"], config["leaderboard"]),
        )
        for config in BENCHMARKS
    ]
    return {
        "schema_version": 3,
        "default_benchmark": "terminal-bench-4.0",
        "official_api": API_URL,
        "benchmarks": benchmarks,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    args = parser.parse_args()

    payload = build_payload()
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    counts = ", ".join(
        f"TB {bench['version']}: {bench['result_count']} rows"
        for bench in payload["benchmarks"]
    )
    print(f"Wrote {args.output} ({counts}).")


if __name__ == "__main__":
    main()
