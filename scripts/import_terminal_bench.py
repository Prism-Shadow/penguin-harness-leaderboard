#!/usr/bin/env python3
"""Build site data from official snapshots and curated first-party reports."""

from __future__ import annotations

import argparse
import json
import subprocess
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SOURCE = ROOT.parent / "terminal-bench-2-1"
DEFAULT_OUTPUT = ROOT / "site" / "data" / "benchmarks.json"
TB3_SOURCE = ROOT / "data" / "terminal-bench-3.0-official.json"
CURATED_SOURCE = ROOT / "data" / "curated-results.json"

OPTIONAL_FIELDS: dict[str, Any] = {
    "official_rank": None,
    "model_id": None,
    "harness": None,
    "harness_version": None,
    "harness_org": None,
    "thinking_level": None,
    "sandbox": None,
    "accuracy_stderr": None,
    "pass_at_2": None,
    "pass_at_3": None,
    "pass_at_4": None,
    "pass_at_5": None,
    "minimum_trials_per_task": None,
    "trial_count": None,
    "disqualified_trials": None,
    "reward_hacks": None,
    "uncached_input_tokens": None,
    "cached_input_tokens": None,
    "output_tokens": None,
    "total_tokens": None,
    "total_cost_usd": None,
    "average_trial_duration_seconds": None,
    "published_at": None,
    "retrieved_at": None,
    "publisher": None,
    "source_title": None,
    "source_url": None,
    "source_file": None,
    "source_jobs": [],
    "protocol_note": None,
}


def read_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def label(value: Any) -> str:
    if isinstance(value, dict):
        return str(value.get("label") or value.get("url") or "")
    return str(value or "")


def url(value: Any) -> str:
    return str(value.get("url") or "") if isinstance(value, dict) else str(value or "")


def percent(value: Any) -> float | None:
    return None if value is None else round(float(value) * 100, 2)


def git_value(repo: Path, *args: str) -> str:
    result = subprocess.run(
        ["git", "-C", str(repo), *args],
        check=True,
        capture_output=True,
        text=True,
    )
    return result.stdout.strip()


def normalize(raw: dict[str, Any]) -> dict[str, Any]:
    row = {
        key: ([] if isinstance(value, list) else value)
        for key, value in OPTIONAL_FIELDS.items()
    }
    row.update(raw)
    return row


def load_tb21(source: Path) -> tuple[list[dict[str, Any]], str, str]:
    files = sorted((source / "leaderboard" / "submissions").glob("*.json"))
    if not files:
        raise SystemExit(f"No official submission files found under {source}")

    rows: list[dict[str, Any]] = []
    for path in files:
        raw = read_json(path)
        meta = raw["metadata"]
        metrics = raw["metrics"]
        source_filter = raw["source_filter"]
        token_keys = ("uncached_input_tokens", "cached_input_tokens", "output_tokens")
        rows.append(normalize({
            "id": path.stem,
            "benchmark_id": "terminal-bench-2.1",
            "source_type": "benchmark_official",
            "model": label(meta["model_display"]),
            "model_id": source_filter["model_name"],
            "model_org": label(meta["model_org"]),
            "harness": label(meta["agent_display"]),
            "harness_version": source_filter.get("agent_version") or None,
            "harness_org": label(meta["agent_org"]),
            "thinking_level": meta.get("reasoning_effort") or "none",
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
            "uncached_input_tokens": int(metrics.get("uncached_input_tokens") or 0),
            "cached_input_tokens": int(metrics.get("cached_input_tokens") or 0),
            "output_tokens": int(metrics.get("output_tokens") or 0),
            "total_tokens": sum(int(metrics.get(key) or 0) for key in token_keys),
            "total_cost_usd": float(metrics["total_cost_usd"]),
            "average_trial_duration_seconds": float(metrics["avg_trial_duration_sec"]),
            "published_at": meta["date"],
            "publisher": "Harbor Framework",
            "source_title": "Merged Terminal-Bench 2.1 submission",
            "source_url": url(meta["pr_url"]),
            "source_file": str(path.relative_to(source)),
            "source_jobs": [
                f"https://hub.harborframework.com/jobs/{job_id}"
                for job_id in raw.get("source_jobs") or []
            ],
        }))

    rows.sort(key=lambda row: (-row["accuracy"], row["model"], row["harness"]))
    previous: float | None = None
    rank = 0
    for position, row in enumerate(rows, start=1):
        if row["accuracy"] != previous:
            rank = position
            previous = row["accuracy"]
        row["official_rank"] = rank

    commit = git_value(source, "rev-parse", "HEAD")
    commit_date = git_value(source, "show", "-s", "--format=%cs", "HEAD")
    for row in rows:
        row["retrieved_at"] = commit_date
    return rows, commit, commit_date


def load_tb30() -> tuple[list[dict[str, Any]], dict[str, Any]]:
    source = read_json(TB3_SOURCE)
    rows = []
    for raw in source["results"]:
        row = normalize(raw)
        row_url = (
            "https://hub.harborframework.com/datasets/terminal-bench/"
            f"terminal-bench/1/leaderboards/3-0-0/rows/{raw['id']}"
        )
        row.update({
            "benchmark_id": source["benchmark_id"],
            "source_type": "benchmark_official",
            "retrieved_at": source["retrieved_at"],
            "publisher": "Harbor Framework",
            "source_title": source["source_title"],
            "source_url": row_url,
        })
        rows.append(row)
    return rows, source


def load_curated() -> tuple[list[dict[str, Any]], str]:
    source = read_json(CURATED_SOURCE)
    rows = []
    for raw in source["results"]:
        row = normalize(raw)
        row["official_rank"] = None
        rows.append(row)
    return rows, source["verified_at"]


def make_benchmark(
    *,
    benchmark_id: str,
    name: str,
    short_name: str,
    task_count: int,
    repository_url: str,
    snapshot_commit: str | None,
    snapshot_updated_at: str,
    verified_at: str,
    description: dict[str, str],
    score_note: dict[str, str],
    protocol_note: dict[str, str],
    results: list[dict[str, Any]],
) -> dict[str, Any]:
    results.sort(key=lambda row: (
        -row["accuracy"],
        0 if row["source_type"] == "benchmark_official" else 1,
        row["model"],
        row["harness"] or "",
    ))
    official = [row for row in results if row["source_type"] == "benchmark_official"]
    best = max(official, key=lambda row: row["accuracy"])
    return {
        "id": benchmark_id,
        "status": "available",
        "name": name,
        "short_name": short_name,
        "description": description,
        "task_count": task_count,
        "result_count": len(results),
        "official_result_count": len(official),
        "model_count": len({row["model"] for row in results}),
        "official_best_accuracy": best["accuracy"],
        "official_best_result_label": f"{best['harness']} · {best['model']}",
        "score_note": score_note,
        "protocol_note": protocol_note,
        "repository_url": repository_url,
        "snapshot_commit": snapshot_commit,
        "snapshot_updated_at": snapshot_updated_at,
        "verified_at": verified_at,
        "results": results,
    }


def build_payload(source: Path) -> dict[str, Any]:
    tb21_rows, tb21_commit, tb21_date = load_tb21(source)
    tb30_rows, tb30_meta = load_tb30()
    curated, verified_at = load_curated()
    by_benchmark = {
        bench: [row for row in curated if row["benchmark_id"] == bench]
        for bench in ("terminal-bench-2.1", "terminal-bench-3.0")
    }

    shared_score_note = {
        "en": "Rows may use different run protocols. Only benchmark-official rows receive an official rank; vendor-reported rows are reference results.",
        "zh": "不同结果可能采用不同运行协议。只有 Benchmark 官方结果拥有正式排名；厂商自报仅作为公开参考。",
    }
    tb21 = make_benchmark(
        benchmark_id="terminal-bench-2.1",
        name="Terminal-Bench 2.1",
        short_name="TB 2.1",
        task_count=89,
        repository_url="https://github.com/harbor-framework/terminal-bench-2-1",
        snapshot_commit=tb21_commit,
        snapshot_updated_at=tb21_date,
        verified_at=verified_at,
        description={
            "en": "89 terminal tasks with benchmark-official submissions and first-party model reports shown together with explicit source labels.",
            "zh": "89 道终端任务；统一展示 Benchmark 官方 submission 与厂商一手报告，并明确标注来源。",
        },
        score_note=shared_score_note,
        protocol_note={
            "en": "The repository snapshot contains 20 merged submissions. Vendor rows include only settings explicitly disclosed by first-party sources.",
            "zh": "官方仓库快照包含 20 条已合并 submission；厂商记录只填写一手来源明确披露的配置。",
        },
        results=tb21_rows + by_benchmark["terminal-bench-2.1"],
    )
    tb30 = make_benchmark(
        benchmark_id="terminal-bench-3.0",
        name=tb30_meta["name"],
        short_name=tb30_meta["short_name"],
        task_count=int(tb30_meta["task_count"]),
        repository_url=tb30_meta["repository_url"],
        snapshot_commit=None,
        snapshot_updated_at=tb30_meta["snapshot_updated_at"],
        verified_at=verified_at,
        description={
            "en": "The 74-task v3.0 benchmark, using a dated export of the public Harbor Hub leaderboard plus separately labeled first-party model reports.",
            "zh": "包含 74 道任务的 v3.0；采用带日期的 Harbor Hub 公开榜单快照，并补充单独标注的厂商一手报告。",
        },
        score_note=shared_score_note,
        protocol_note={
            "en": "This is a 2026-08-29 Harbor Hub snapshot, not a live mirror. All 12 rows returned by the official public leaderboard were marked for display.",
            "zh": "这是 2026-08-29 的 Harbor Hub 快照，并非实时镜像；官方公开榜单返回的 12 条记录均标记为展示。",
        },
        results=tb30_rows + by_benchmark["terminal-bench-3.0"],
    )
    return {
        "schema_version": 2,
        "updated": verified_at,
        "default_benchmark": "terminal-bench-2.1",
        "benchmarks": [tb21, tb30],
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, default=DEFAULT_SOURCE)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    args = parser.parse_args()

    payload = build_payload(args.source.resolve())
    output = args.output.resolve()
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    summary = ", ".join(
        f"{bench['short_name']}: {bench['result_count']} results"
        for bench in payload["benchmarks"]
    )
    print(f"Wrote {summary} to {output}")


if __name__ == "__main__":
    main()
