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
CURATED_INPUT = ROOT / "data" / "curated_results.json"
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
        "source_type": "benchmark_official",
        "source_url": official_detail_url,
        "source_title": "Harbor result detail",
        "source_publisher": "Terminal-Bench / Harbor",
        "published_at": None,
        "verified_at": None,
        "harness_version": None,
        "protocol_note": None,
    }


def normalize_curated_row(raw: dict[str, Any], verified_at: str) -> dict[str, Any]:
    """Expand a sparse, evidence-backed manual record to the public row schema."""
    row = {
        "id": str(raw["id"]),
        "benchmark_id": str(raw["benchmark_id"]),
        "rank": None,
        "harness": linked(raw["harness"]),
        "harness_org": linked(raw["harness_org"]),
        "model": linked(raw["model"]),
        "model_org": linked(raw["model_org"]),
        "thinking_level": raw.get("thinking_level"),
        "accuracy": float(raw["accuracy"]),
        "accuracy_stderr": None,
        "accuracy_ci95_half_width": None,
        "display_accuracy": None,
        "release_date": raw.get("release_date"),
        "display_release_date": None,
        "total_tokens": raw.get("total_tokens"),
        "display_total_tokens": None,
        "total_cost_usd": raw.get("total_cost_usd"),
        "display_cost": None,
        "trial_count": raw.get("trial_count"),
        "pass_at_2": raw.get("pass_at_2"),
        "pass_at_3": raw.get("pass_at_3"),
        "pass_at_4": raw.get("pass_at_4"),
        "pass_at_5": raw.get("pass_at_5"),
        "successes": raw.get("successes"),
        "uncached_input_tokens": raw.get("uncached_input_tokens"),
        "cached_input_tokens": raw.get("cached_input_tokens"),
        "output_tokens": raw.get("output_tokens"),
        "average_trial_duration_seconds": raw.get("average_trial_duration_seconds"),
        "reward_hacks": raw.get("reward_hacks"),
        "display_reward_hacks": None,
        "submission": None,
        "official_detail_url": None,
        "source_type": str(raw["source_type"]),
        "source_url": str(raw["source_url"]),
        "source_title": str(raw["source_title"]),
        "source_publisher": str(raw["source_publisher"]),
        "published_at": raw.get("published_at"),
        "verified_at": verified_at,
        "harness_version": raw.get("harness_version"),
        "protocol_note": raw.get("protocol_note"),
    }
    return row


def load_curated_rows() -> tuple[list[dict[str, Any]], str]:
    try:
        payload = json.loads(CURATED_INPUT.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        raise SystemExit(f"Could not read {CURATED_INPUT}: {error}") from error

    if payload.get("schema_version") != 1:
        raise SystemExit(f"Unsupported curated data schema in {CURATED_INPUT}")
    verified_at = str(payload.get("verified_at") or "")
    raw_rows = payload.get("results")
    if not verified_at or not isinstance(raw_rows, list) or not raw_rows:
        raise SystemExit(f"Curated data in {CURATED_INPUT} is incomplete")

    known_benchmarks = {config["id"] for config in BENCHMARKS}
    rows = [normalize_curated_row(row, verified_at) for row in raw_rows]
    ids = [row["id"] for row in rows]
    if len(ids) != len(set(ids)):
        raise SystemExit(f"Curated data in {CURATED_INPUT} has duplicate IDs")
    unknown = sorted({row["benchmark_id"] for row in rows} - known_benchmarks)
    if unknown:
        raise SystemExit(f"Curated results reference unknown benchmarks: {', '.join(unknown)}")
    return rows, verified_at


def normalize_benchmark(
    config: dict[str, str],
    raw: dict[str, Any],
    curated_rows: list[dict[str, Any]],
) -> dict[str, Any]:
    leaderboard = raw.get("leaderboard") or {}
    visible_rows = [row for row in raw.get("rows", []) if row.get("status") == "display"]
    official_rows = [normalize_row(row, config) for row in visible_rows]
    official_rows.sort(key=lambda row: (row["rank"], -row["accuracy"], row["model"]["label"]))

    expected_total = (raw.get("pagination") or {}).get("total")
    if expected_total is not None and int(expected_total) != len(official_rows):
        raise SystemExit(
            f"Official API pagination for {config['version']} reports {expected_total} rows, "
            f"but {len(official_rows)} display rows were returned"
        )

    rows = official_rows + [
        row for row in curated_rows if row["benchmark_id"] == config["id"]
    ]
    rows.sort(key=lambda row: (-row["accuracy"], row["source_type"], row["model"]["label"]))
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
        "official_result_count": len(official_rows),
        "vendor_result_count": sum(row["source_type"] == "vendor_reported" for row in rows),
        "penguin_result_count": sum(row["source_type"] == "penguin_run" for row in rows),
        "model_count": len({row["model"]["label"] for row in rows}),
        "harness_count": len({row["harness"]["label"] for row in rows}),
        "best_accuracy": max(row["accuracy"] for row in rows),
        "official_best_accuracy": max(row["accuracy"] for row in official_rows),
        "description": {
            "en": f"Public Terminal-Bench {version} results, with official ranks kept separate from reported runs.",
            "zh": f"Terminal-Bench {version} 公开结果；官方排名与厂商、Penguin 报告结果严格区分。",
        },
        "results": rows,
    }


def build_payload() -> dict[str, Any]:
    curated_rows, curated_verified_at = load_curated_rows()
    benchmarks = [
        normalize_benchmark(
            config,
            fetch_leaderboard(config["package"], config["leaderboard"]),
            curated_rows,
        )
        for config in BENCHMARKS
    ]
    return {
        "schema_version": 4,
        "default_benchmark": "terminal-bench-2.1",
        "official_api": API_URL,
        "curated_verified_at": curated_verified_at,
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
