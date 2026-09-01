#!/usr/bin/env python3
"""Verify generated site data, source tiers, ranks, and evidence metadata."""

from __future__ import annotations

import argparse
import importlib.util
import json
import sys
from pathlib import Path
from types import ModuleType
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SOURCE = ROOT.parent / "terminal-bench-2-1"
PUBLISHED = ROOT / "site" / "data" / "benchmarks.json"
VENDOR_SOURCE_PREFIXES = {
    "DeepSeek": ("https://api-docs.deepseek.com/", "https://deepseek.com/"),
    "Z.ai": ("https://z.ai/", "https://huggingface.co/zai-org/"),
    "Qwen": ("https://qwen.ai/", "https://huggingface.co/Qwen/"),
    "Moonshot AI": ("https://www.kimi.com/", "https://huggingface.co/moonshotai/"),
}
OPTIONAL_FIELDS = {
    "official_rank",
    "model_id",
    "harness",
    "harness_version",
    "harness_org",
    "thinking_level",
    "sandbox",
    "accuracy_stderr",
    "pass_at_2",
    "pass_at_3",
    "pass_at_4",
    "pass_at_5",
    "minimum_trials_per_task",
    "trial_count",
    "published_at",
    "source_jobs",
    "protocol_note",
}


def load_importer() -> ModuleType:
    sys.dont_write_bytecode = True
    path = ROOT / "scripts" / "import_terminal_bench.py"
    spec = importlib.util.spec_from_file_location("import_terminal_bench", path)
    if spec is None or spec.loader is None:
        raise SystemExit(f"Could not load {path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def official_competition_ranks(rows: list[dict[str, Any]]) -> list[int]:
    rows = sorted(rows, key=lambda row: (-row["accuracy"], row["model"]))
    ranks = []
    previous: float | None = None
    rank = 0
    for position, row in enumerate(rows, start=1):
        if row["accuracy"] != previous:
            rank = position
            previous = row["accuracy"]
        ranks.append(rank)
    return ranks


def verify_benchmark(bench: dict[str, Any]) -> None:
    rows = bench["results"]
    official = [row for row in rows if row["source_type"] == "benchmark_official"]
    external = [row for row in rows if row["source_type"] != "benchmark_official"]

    assert bench["result_count"] == len(rows)
    assert bench["official_result_count"] == len(official)
    assert bench["model_count"] == len({row["model"] for row in rows})
    assert bench["official_best_accuracy"] == max(row["accuracy"] for row in official)
    assert all(row["benchmark_id"] == bench["id"] for row in rows)
    assert all(0 <= row["accuracy"] <= 100 for row in rows)
    assert all(OPTIONAL_FIELDS <= row.keys() for row in rows)
    assert all(row["official_rank"] is None for row in external)

    ordered_official = sorted(official, key=lambda row: (-row["accuracy"], row["model"]))
    if bench["id"] == "terminal-bench-2.1":
        actual = [row["official_rank"] for row in ordered_official]
        assert actual == official_competition_ranks(official)
    else:
        assert [row["official_rank"] for row in ordered_official] == list(
            range(1, len(official) + 1)
        )

    for row in rows:
        assert row["source_url"].startswith("https://")
        assert row["source_title"]
        assert row["publisher"]
        assert row["retrieved_at"]
        if row["source_type"] == "vendor_reported":
            allowed = VENDOR_SOURCE_PREFIXES[row["publisher"]]
            assert row["source_url"].startswith(allowed), row["source_url"]
            assert row["protocol_note"], row["id"]


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, default=DEFAULT_SOURCE)
    args = parser.parse_args()
    source = args.source.resolve()
    if not source.is_dir():
        raise SystemExit(f"Official Terminal-Bench 2.1 checkout not found at {source}")

    importer = load_importer()
    expected = importer.build_payload(source)
    actual = json.loads(PUBLISHED.read_text(encoding="utf-8"))
    assert actual == expected, "Published JSON is stale; run scripts/import_terminal_bench.py"
    assert actual["schema_version"] == 2
    assert [bench["id"] for bench in actual["benchmarks"]] == [
        "terminal-bench-2.1",
        "terminal-bench-3.0",
    ]

    ids = [row["id"] for bench in actual["benchmarks"] for row in bench["results"]]
    assert len(ids) == len(set(ids)), "Duplicate result IDs"
    for bench in actual["benchmarks"]:
        verify_benchmark(bench)

    summary = ", ".join(
        f"{bench['short_name']} {bench['official_result_count']} official + "
        f"{bench['result_count'] - bench['official_result_count']} vendor"
        for bench in actual["benchmarks"]
    )
    print(f"Verified schema, ranks, nullable fields, and first-party source domains: {summary}.")


if __name__ == "__main__":
    main()
