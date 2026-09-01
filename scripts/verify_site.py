#!/usr/bin/env python3
"""Validate the static data and optionally compare it with tbench.ai live data."""

from __future__ import annotations

import argparse
import importlib.util
import json
import sys
from datetime import date
from pathlib import Path
from types import ModuleType
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
PUBLISHED = ROOT / "site" / "data" / "benchmarks.json"
EXPECTED_IDS = (
    "terminal-bench-2.1",
    "terminal-bench-3.0",
    "terminal-bench-4.0",
)


def load_importer() -> ModuleType:
    sys.dont_write_bytecode = True
    path = ROOT / "scripts" / "import_terminal_bench.py"
    spec = importlib.util.spec_from_file_location("import_terminal_bench", path)
    if spec is None or spec.loader is None:
        raise SystemExit(f"Could not load {path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def valid_date(value: Any) -> bool:
    try:
        date.fromisoformat(value)
    except (TypeError, ValueError):
        return False
    return True


def verify_link(value: Any, field: str, row_id: str) -> None:
    assert isinstance(value, dict), f"{row_id}: {field} must be an object"
    assert value.get("label"), f"{row_id}: {field} label is empty"
    url = value.get("url")
    assert url is None or url.startswith("https://"), f"{row_id}: invalid {field} URL"


def expected_competition_ranks(rows: list[dict[str, Any]]) -> list[int]:
    result = []
    previous: float | None = None
    rank = 0
    for position, row in enumerate(rows, start=1):
        if row["accuracy"] != previous:
            rank = position
            previous = row["accuracy"]
        result.append(rank)
    return result


def verify_benchmark(bench: dict[str, Any]) -> None:
    rows = bench["results"]
    assert rows, f"{bench['id']}: no rows"
    assert bench["official_url"] == f"https://www.tbench.ai/?version={bench['version']}"
    assert bench["snapshot_updated_at"], f"{bench['id']}: missing upstream timestamp"
    assert bench["result_count"] == len(rows)
    assert bench["model_count"] == len({row["model"]["label"] for row in rows})
    assert bench["harness_count"] == len({row["harness"]["label"] for row in rows})
    assert bench["best_accuracy"] == max(row["accuracy"] for row in rows)

    actual_ranks = [row["rank"] for row in rows]
    assert actual_ranks == expected_competition_ranks(rows), (
        f"{bench['id']}: official rank sequence does not match score order"
    )

    for row in rows:
        row_id = row["id"]
        assert row["benchmark_id"] == bench["id"], row_id
        assert 0 <= row["accuracy"] <= 100, row_id
        ci95 = row["accuracy_ci95_half_width"]
        assert ci95 is None or 0 <= ci95 <= 100, row_id
        assert valid_date(row["release_date"]), row_id
        assert row["display_release_date"], row_id
        assert row["total_tokens"] is None or row["total_tokens"] >= 0, row_id
        assert row["total_cost_usd"] is None or row["total_cost_usd"] >= 0, row_id
        assert row["trial_count"] is None or row["trial_count"] > 0, row_id
        assert row["thinking_level"] is None or isinstance(row["thinking_level"], str), row_id
        verify_link(row["harness"], "harness", row_id)
        verify_link(row["harness_org"], "harness_org", row_id)
        verify_link(row["model"], "model", row_id)
        verify_link(row["model_org"], "model_org", row_id)


def verify_frontend_contract() -> None:
    html = (ROOT / "site" / "index.html").read_text(encoding="utf-8")
    script = (ROOT / "site" / "script.js").read_text(encoding="utf-8")
    assert "<dialog" not in html, "The removed details dialog is still present"
    assert "details-dialog" not in script, "The removed details logic is still present"
    assert 'class="bench-switcher"' in html, "Top navigation benchmark switcher missing"
    assert 'class="locale-control"' in html, "Language control missing"
    assert "accuracy_ci95_half_width" in script, "Confidence-interval comparison is missing"
    column_contract = (
        '["rank", "rank"]',
        '["harness", "harness"]',
        '["model", "model"]',
        '["accuracy", "resolutionRate"]',
        '["release_date", "releaseDate"]',
        '["total_tokens", "tokens"]',
        '["total_cost_usd", "cost"]',
    )
    positions = [script.find(column) for column in column_contract]
    assert all(position >= 0 for position in positions), "A required table column is missing"
    assert positions == sorted(positions), "The table column order changed"


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--check-live",
        action="store_true",
        help="Fetch all three official leaderboards and require an exact normalized match",
    )
    args = parser.parse_args()

    actual = json.loads(PUBLISHED.read_text(encoding="utf-8"))
    assert actual["schema_version"] == 3
    assert actual["default_benchmark"] == "terminal-bench-4.0"
    assert tuple(bench["id"] for bench in actual["benchmarks"]) == EXPECTED_IDS

    ids = [row["id"] for bench in actual["benchmarks"] for row in bench["results"]]
    assert len(ids) == len(set(ids)), "Duplicate official row IDs"
    for bench in actual["benchmarks"]:
        verify_benchmark(bench)
    verify_frontend_contract()

    if args.check_live:
        importer = load_importer()
        expected = importer.build_payload()
        assert actual == expected, (
            "The committed snapshot differs from tbench.ai; "
            "run scripts/import_terminal_bench.py and review the diff"
        )

    summary = ", ".join(
        f"TB {bench['version']}: {bench['result_count']} official rows"
        for bench in actual["benchmarks"]
    )
    suffix = " + live API match" if args.check_live else ""
    print(f"Verified schema, ranks, metrics, dates and frontend contract{suffix}: {summary}.")


if __name__ == "__main__":
    main()
