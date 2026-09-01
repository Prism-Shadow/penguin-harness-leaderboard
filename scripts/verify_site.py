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
SOURCE_TYPES = {"benchmark_official", "vendor_reported", "penguin_run"}
VENDOR_SOURCE_PREFIXES = {
    "DeepSeek": (
        "https://api-docs.deepseek.com/",
        "https://huggingface.co/deepseek-ai/",
    ),
    "Z.ai": ("https://huggingface.co/zai-org/",),
    "Qwen": ("https://huggingface.co/Qwen/",),
    "Moonshot AI": ("https://huggingface.co/moonshotai/", "https://www.kimi.com/"),
}
PENGUIN_SOURCE_PREFIX = "https://github.com/hw3150cu/TB2.1_penguin_dsv4_flash"


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
    official_rows = [row for row in rows if row["source_type"] == "benchmark_official"]
    assert rows, f"{bench['id']}: no rows"
    assert bench["official_url"] == f"https://www.tbench.ai/?version={bench['version']}"
    assert bench["snapshot_updated_at"], f"{bench['id']}: missing upstream timestamp"
    assert bench["result_count"] == len(rows)
    assert bench["official_result_count"] == len(official_rows)
    assert bench["vendor_result_count"] == sum(
        row["source_type"] == "vendor_reported" for row in rows
    )
    assert bench["penguin_result_count"] == sum(
        row["source_type"] == "penguin_run" for row in rows
    )
    assert bench["model_count"] == len({row["model"]["label"] for row in rows})
    assert bench["harness_count"] == len({row["harness"]["label"] for row in rows})
    assert bench["best_accuracy"] == max(row["accuracy"] for row in rows)
    assert bench["official_best_accuracy"] == max(
        row["accuracy"] for row in official_rows
    )

    official_rows_by_rank = sorted(official_rows, key=lambda row: row["rank"])
    actual_ranks = [row["rank"] for row in official_rows_by_rank]
    official_rows_by_score = sorted(
        official_rows, key=lambda row: (-row["accuracy"], row["model"]["label"])
    )
    assert actual_ranks == expected_competition_ranks(official_rows_by_score), (
        f"{bench['id']}: official rank sequence does not match score order"
    )

    for row in rows:
        row_id = row["id"]
        assert row["benchmark_id"] == bench["id"], row_id
        assert row["source_type"] in SOURCE_TYPES, row_id
        assert 0 <= row["accuracy"] <= 100, row_id
        ci95 = row["accuracy_ci95_half_width"]
        assert ci95 is None or 0 <= ci95 <= 100, row_id
        stderr = row["accuracy_stderr"]
        assert stderr is None or 0 <= stderr <= 100, row_id
        assert row["release_date"] is None or valid_date(row["release_date"]), row_id
        assert row["published_at"] is None or valid_date(row["published_at"]), row_id
        assert row["verified_at"] is None or valid_date(row["verified_at"]), row_id
        assert row["total_tokens"] is None or row["total_tokens"] >= 0, row_id
        assert row["total_cost_usd"] is None or row["total_cost_usd"] >= 0, row_id
        assert row["trial_count"] is None or row["trial_count"] > 0, row_id
        for field in ("pass_at_2", "pass_at_3", "pass_at_4", "pass_at_5"):
            value = row[field]
            assert value is None or 0 <= value <= 1, f"{row_id}: invalid {field}"
        assert row["successes"] is None or row["successes"] >= 0, row_id
        for field in ("uncached_input_tokens", "cached_input_tokens", "output_tokens"):
            value = row[field]
            assert value is None or value >= 0, f"{row_id}: invalid {field}"
        duration = row["average_trial_duration_seconds"]
        assert duration is None or duration >= 0, row_id
        assert row["reward_hacks"] is None or row["reward_hacks"] >= 0, row_id
        assert row["thinking_level"] is None or isinstance(row["thinking_level"], str), row_id
        verify_link(row["harness"], "harness", row_id)
        verify_link(row["harness_org"], "harness_org", row_id)
        verify_link(row["model"], "model", row_id)
        verify_link(row["model_org"], "model_org", row_id)
        if row["display_reward_hacks"] is not None:
            verify_link(row["display_reward_hacks"], "display_reward_hacks", row_id)
        if row["submission"] is not None:
            verify_link(row["submission"], "submission", row_id)
        assert row["source_url"].startswith("https://"), row_id
        assert row["source_title"], row_id
        assert row["source_publisher"], row_id

        if row["source_type"] == "benchmark_official":
            assert isinstance(row["rank"], int) and row["rank"] > 0, row_id
            assert valid_date(row["release_date"]), row_id
            assert row["display_release_date"], row_id
            detail_url = row["official_detail_url"]
            expected_suffix = f"/leaderboards/{bench['source_api']['leaderboard']}/rows/{row_id}"
            assert detail_url.startswith("https://hub.harborframework.com/datasets/"), row_id
            assert detail_url.endswith(expected_suffix), row_id
            assert row["source_url"] == detail_url, row_id
        else:
            assert row["rank"] is None, f"{row_id}: non-official result has a rank"
            assert row["official_detail_url"] is None, row_id
            assert valid_date(row["verified_at"]), row_id
            assert isinstance(row["protocol_note"], dict), row_id
            assert row["protocol_note"].get("en") and row["protocol_note"].get("zh"), row_id
            if row["source_type"] == "vendor_reported":
                prefixes = VENDOR_SOURCE_PREFIXES.get(row["source_publisher"])
                assert prefixes, f"{row_id}: unrecognized vendor publisher"
                assert row["source_url"].startswith(prefixes), row_id
            else:
                assert row["source_url"].startswith(PENGUIN_SOURCE_PREFIX), row_id


def verify_frontend_contract() -> None:
    html = (ROOT / "site" / "index.html").read_text(encoding="utf-8")
    script = (ROOT / "site" / "script.js").read_text(encoding="utf-8")
    css = (ROOT / "site" / "styles.css").read_text(encoding="utf-8")
    assert 'class="result-dialog"' in html, "Result details dialog missing"
    assert "showModal()" in script, "Result details dialog is not wired up"
    assert "official_detail_url" in script, "Official result detail link is missing"
    assert 'class="bench-switcher"' in html, "Top navigation benchmark switcher missing"
    assert 'class="locale-control"' in html, "Language control missing"
    assert '<option value="system">' in html, "Follow system language option is missing"
    assert 'option[value="system"]' in script, "Follow system option is not translated"
    assert 'class="filter-select source-filter"' in html, "Source filter missing"
    assert "accuracy_ci95_half_width" in script, "Confidence-interval comparison is missing"
    column_contract = (
        '["rank", "rank"]',
        '["harness", "harness"]',
        '["model", "model"]',
        '["accuracy", "resolutionRate"]',
        '["average_trial_duration_seconds", "avgDuration"]',
        '["release_date", "releaseDate"]',
        '["total_tokens", "tokens"]',
        '["total_cost_usd", "cost"]',
        '["source_type", "source"]',
    )
    positions = [script.find(column) for column in column_contract]
    assert all(position >= 0 for position in positions), "A required table column is missing"
    assert positions == sorted(positions), "The table column order changed"
    assert 'detailsCell.textContent = t("details")' in script, "Details column missing"
    for removed_selector in ("ci-whisker", "rate-track", "rate-fill"):
        assert removed_selector not in script, f"Removed {removed_selector} markup is still rendered"
        assert removed_selector not in css, f"Removed {removed_selector} styling is still present"
    assert 'class="accuracy-track"' in script, "Accuracy bar is missing"
    assert ".accuracy-fill" in css, "Accuracy fill styling is missing"
    assert ".accuracy-ci" in css and ".accuracy-cap" in css, (
        "Confidence interval whisker styling is missing"
    )
    assert "function comparisonRanks(rows)" in script, "Adaptive comparison ranking is missing"
    assert "ranks.get(row.id)" in script, "Filtered rows do not use comparison ranks"
    assert 'row.rank ?? "—"' not in script, "Unranked rows still render a dash in the main table"
    assert 'row.protocol_note !== null' in script, "Official Details null guard is missing"
    assert "linkedName(row.harness, row.harness_org)" not in script, (
        "Harness organization is still repeated in the main table"
    )
    assert ".column-total-tokens .sort-button" in css, "Token header alignment missing"
    assert ".number-cell" in css and "text-align: right" in css, "Numeric alignment missing"


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--check-live",
        action="store_true",
        help="Fetch all three official leaderboards and require an exact normalized match",
    )
    args = parser.parse_args()

    actual = json.loads(PUBLISHED.read_text(encoding="utf-8"))
    assert actual["schema_version"] == 4
    assert actual["default_benchmark"] == "terminal-bench-2.1"
    assert tuple(bench["id"] for bench in actual["benchmarks"]) == EXPECTED_IDS

    ids = [row["id"] for bench in actual["benchmarks"] for row in bench["results"]]
    assert len(ids) == len(set(ids)), "Duplicate public row IDs"
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
        f"TB {bench['version']}: {bench['result_count']} public / "
        f"{bench['official_result_count']} official rows"
        for bench in actual["benchmarks"]
    )
    suffix = " + live API match" if args.check_live else ""
    print(f"Verified schema, sources, ranks, metrics, dates and frontend contract{suffix}: {summary}.")


if __name__ == "__main__":
    main()
