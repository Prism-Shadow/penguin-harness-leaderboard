#!/usr/bin/env python3
"""Verify the published site data against the checked-out official source."""

from __future__ import annotations

import importlib.util
import json
import sys
from pathlib import Path
from types import ModuleType
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT.parent / "terminal-bench-2-1"
PUBLISHED = ROOT / "site" / "data" / "benchmarks.json"


def load_importer() -> ModuleType:
    sys.dont_write_bytecode = True
    importer_path = ROOT / "scripts" / "import_terminal_bench.py"
    spec = importlib.util.spec_from_file_location(
        "import_terminal_bench", importer_path
    )
    if spec is None or spec.loader is None:
        raise SystemExit(f"Could not load {importer_path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def find_available(payload: dict[str, Any]) -> dict[str, Any]:
    matches = [
        item
        for item in payload.get("benchmarks", [])
        if item.get("status") == "available"
    ]
    if len(matches) != 1:
        raise AssertionError(
            f"Expected exactly one available benchmark, found {len(matches)}"
        )
    return matches[0]


def main() -> None:
    if not SOURCE.is_dir():
        raise SystemExit(
            "Official Terminal-Bench checkout not found at "
            f"{SOURCE}. Pass validation from the documented workspace layout."
        )
    if not PUBLISHED.is_file():
        raise SystemExit(f"Published data not found at {PUBLISHED}")

    importer = load_importer()
    expected = importer.build_payload(SOURCE)
    actual = json.loads(PUBLISHED.read_text(encoding="utf-8"))

    if actual != expected:
        raise AssertionError(
            "Published data differs from official submissions. Run "
            "python3 scripts/import_terminal_bench.py and inspect the diff."
        )

    bench = find_available(actual)
    results = bench["results"]
    expected_ranks: list[int] = []
    previous_accuracy: float | None = None
    competition_rank = 0
    for position, row in enumerate(results, start=1):
        if row["accuracy"] != previous_accuracy:
            competition_rank = position
            previous_accuracy = row["accuracy"]
        expected_ranks.append(competition_rank)
    ranks = [row["accuracy_rank"] for row in results]
    assert ranks == expected_ranks, "Ranks do not use official score order with ties"
    assert len({row["id"] for row in results}) == len(results), "Duplicate IDs"
    assert all(row["source_tier"] == "official" for row in results)
    assert all(row["source_pr"].startswith("https://github.com/") for row in results)
    assert bench["submission_count"] == len(results)
    assert bench["model_count"] == len({row["model"] for row in results})
    assert bench["harness_count"] == len({row["harness"] for row in results})
    assert bench["best_accuracy"] == max(row["accuracy"] for row in results)

    print(
        "Verified "
        f"{bench['submission_count']} official submissions, "
        f"{bench['model_count']} models, "
        f"{bench['harness_count']} harnesses, "
        f"best Accuracy {bench['best_accuracy']:.2f}%."
    )


if __name__ == "__main__":
    main()
