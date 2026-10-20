#!/usr/bin/env python3
"""Validate the static data and optionally compare it with tbench.ai live data."""

from __future__ import annotations

import argparse
import copy
import importlib.util
import json
import math
import re
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
HARNESS_ICON_ASSETS = {
    "anthropic.svg",
    "cursor.svg",
    "deepseek.svg",
    "devin.svg",
    "google-gemini.svg",
    "mini-swe-agent.svg",
    "moonshot-ai.svg",
    "openai.svg",
    "terminal-bench.svg",
    "xai.svg",
}
VENDOR_SOURCE_PREFIXES = {
    "DeepSeek": (
        "https://api-docs.deepseek.com/",
        "https://huggingface.co/deepseek-ai/",
    ),
    "Z.ai": ("https://huggingface.co/zai-org/",),
    "Qwen": ("https://huggingface.co/Qwen/",),
    "Moonshot AI": ("https://huggingface.co/moonshotai/", "https://www.kimi.com/"),
    "Anthropic": ("https://www.anthropic.com/",),
}
PENGUIN_SOURCE_PREFIXES = (
    "https://github.com/hw3150cu/TB2.1_penguin_dsv4_flash/",
    "http://vps5.dev.qying.site:8002/jobs/",
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


def verify_link(
    value: Any,
    field: str,
    row_id: str,
    *,
    allow_empty: bool = False,
) -> None:
    assert isinstance(value, dict), f"{row_id}: {field} must be an object"
    assert allow_empty or value.get("label"), f"{row_id}: {field} label is empty"
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


def canonical_model_label(value: str) -> str:
    """Compare model labels without punctuation-only display differences."""
    return "".join(character.lower() for character in value if character.isalnum())


def verify_trace_archive(config: dict[str, Any], trial_count: int, row_id: str) -> None:
    status = config["trace_archive_status"]
    assert status in {"not_archived", "local_with_gaps"}, row_id
    archive = config.get("trace_archive")
    if status == "not_archived":
        assert archive is None, row_id
        return
    assert isinstance(archive, dict), row_id
    assert valid_date(archive["archived_on"]), row_id
    assert archive["repository"] == "penguin-rawdata", row_id
    assert archive["manifest_path"] == f"experiment_data/terminal-bench-2.1/{archive['archived_on']}/manifest.json", row_id
    assert re.fullmatch(r"[0-9a-f]{64}", archive["manifest_sha256"]), row_id
    for key in ("trajectory_trials", "missing_trajectory_trials", "native_jsonl_files", "invalid_jsonl_files"):
        assert type(archive[key]) is int and archive[key] >= 0, row_id
    assert archive["trajectory_trials"] + archive["missing_trajectory_trials"] == trial_count, row_id
    assert archive["invalid_jsonl_files"] <= archive["native_jsonl_files"], row_id
    assert archive["missing_trajectory_trials"] or archive["invalid_jsonl_files"], row_id


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
    assert bench["harness_count"] == len(
        {row["harness"]["label"] for row in rows if row["harness"]["label"]}
    )
    assert bench["best_accuracy"] == max(row["accuracy"] for row in rows)
    assert bench["official_best_accuracy"] == max(
        row["accuracy"] for row in official_rows
    )
    official_model_labels = {
        canonical_model_label(row["model"]["label"]) for row in official_rows
    }
    duplicate_vendor_models = sorted(
        row["model"]["label"]
        for row in rows
        if row["source_type"] == "vendor_reported"
        and canonical_model_label(row["model"]["label"]) in official_model_labels
    )
    assert not duplicate_vendor_models, (
        f"{bench['id']}: vendor rows duplicate official models: "
        f"{', '.join(duplicate_vendor_models)}"
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
        average_cost = row.get("average_cost_per_task_usd")
        assert average_cost is None or (
            type(average_cost) in (int, float) and math.isfinite(average_cost) and average_cost >= 0
        ), f"{row_id}: invalid reported mean cost"
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
        allow_missing_harness = row["source_type"] != "benchmark_official"
        verify_link(
            row["harness"],
            "harness",
            row_id,
            allow_empty=allow_missing_harness,
        )
        verify_link(
            row["harness_org"],
            "harness_org",
            row_id,
            allow_empty=allow_missing_harness,
        )
        verify_link(row["model"], "model", row_id)
        verify_link(row["model_org"], "model_org", row_id)
        if row["display_reward_hacks"] is not None:
            verify_link(row["display_reward_hacks"], "display_reward_hacks", row_id)
        if row["submission"] is not None:
            verify_link(row["submission"], "submission", row_id)
        assert row["source_url"].startswith("https://") or (
            row["source_type"] == "penguin_run"
            and row["source_url"].startswith(PENGUIN_SOURCE_PREFIXES[1])
        ), row_id
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
                config_url = row.get("configuration_source_url")
                if config_url is not None:
                    configuration_origins = {
                        "Anthropic": ("https://www-cdn.anthropic.com/",),
                        "Z.ai": ("https://raw.githubusercontent.com/zai-org/GLM-5/",),
                    }
                    allowed = prefixes + configuration_origins.get(row["source_publisher"], ())
                    assert isinstance(config_url, str) and config_url.startswith(allowed), f"{row_id}: invalid configuration source"
            else:
                assert row["source_url"].startswith(PENGUIN_SOURCE_PREFIXES), row_id
        config = row.get("run_config")
        coverage = row.get("cost_coverage")
        timeout = row.get("timeout_multiplier")
        assert timeout is None or (
            type(timeout) in (int, float) and math.isfinite(timeout) and timeout > 0
        ), row_id
        version = row.get("harness_version")
        assert version is None or (
            isinstance(version, str) and version and "mode" not in version.lower()
        ), f"{row_id}: a Harness mode is not a software version"
        mode = row.get("harness_mode")
        assert mode is None or isinstance(mode, str) and mode, row_id
        time_note = row.get("timeout_note")
        hours = row.get("timeout_hours")
        removed = row.get("wall_clock_limit_removed")
        window = row.get("context_window_label")
        if hours is not None or removed is not None or window is not None:
            assert row["source_type"] == "vendor_reported", row_id
        if hours is not None:
            assert type(hours) in (int, float) and math.isfinite(hours) and hours > 0, row_id
            assert timeout is None and removed is None and time_note, row_id
        if removed is not None:
            assert removed is True and hours is None and timeout is None and time_note, row_id
        if window is not None:
            assert isinstance(window, str) and re.fullmatch(r"[0-9]+(?:\.[0-9]+)?[kKmM]?", window), row_id
        if time_note is not None:
            assert row["source_type"] == "vendor_reported", row_id
            assert isinstance(time_note, dict) and time_note.get("en") and time_note.get("zh"), row_id
        if config is not None:
            assert row["source_type"] == "penguin_run", row_id
            assert valid_date(config["run_date"]), row_id
            assert config["experiment_id"] and config["job_name"] and config["model_id"], row_id
            if config.get("model_revision") is not None:
                assert isinstance(config["model_revision"], str) and config["model_revision"], row_id
                assert config.get("model_revision_source") == "user_confirmation", row_id
                assert valid_date(config.get("model_revision_confirmed_at")), row_id
            assert config["sandbox"], row_id
            assert timeout == config["timeout_multiplier"], row_id
            assert config["task_count"] * config["attempts_per_task"] == row["trial_count"], row_id
            assert 0 <= row["successes"] <= row["trial_count"], row_id
            assert abs(row["accuracy"] - row["successes"] / row["trial_count"] * 100) < 1e-8, row_id
            assert config["timeout_multiplier"] > 0 and config["concurrency"] > 0, row_id
            assert config["compression_trigger_source"] in {"job_config", "runner_confirmed_default"}, row_id
            verify_trace_archive(config, row["trial_count"], row_id)
            assert isinstance(coverage, dict), row_id
        if coverage is not None:
            assert row["source_type"] == "penguin_run", row_id
            assert coverage["reported_trial_count"] + coverage["missing_trial_count"] == row["trial_count"], row_id
            assert 0 <= coverage["missing_success_count"] <= coverage["missing_trial_count"], row_id
            assert coverage["missing_success_count"] <= row["successes"], row_id
            assert coverage["reported_trial_count"] >= 0 and coverage["missing_trial_count"] >= 0, row_id
            assert row["total_cost_usd"] is not None, row_id


def verify_frontend_contract() -> None:
    html = (ROOT / "site" / "index.html").read_text(encoding="utf-8")
    script = (ROOT / "site" / "script.js").read_text(encoding="utf-8")
    css = (ROOT / "site" / "styles.css").read_text(encoding="utf-8")
    assert 'class="result-dialog"' in html, "Result details dialog missing"
    assert "showModal()" in script, "Result details dialog is not wired up"
    assert "elements.dialogBody.scrollTop = 0" in script, "New result details must start at the top"
    assert 'class="pareto-panel"' in html, "Pareto panel missing"
    for view, panel in (("table", "table-panel"), ("pareto", "pareto")):
        assert f'data-view="{view}"' in html and f'aria-controls="{panel}"' in html, "Result view tab missing"
    assert 'function setResultView(' in script and 'role="tabpanel"' in html, "Result view switching is missing"
    assert 'data-pareto-source' not in html and 'paretoSource' not in script, "Removed chart source switch is still present"
    assert 'class="filter-toggle"' in html and 'class="filter-categories"' in html, "Categorized filter menu missing"
    assert 'role="menuitemradio"' in script, "Filter options lack selection semantics"
    assert 'filter-reset' not in html and 'filterReset' not in script, "Removed Clear control is still present"
    for field in ("source", "harness", "model", "thinking"):
        assert f'id="{field}-filter"' in html, f"{field} filter missing"
        assert f'<label for="{field}-filter"' not in html, "Removed visible filter label is still present"
        assert f'data-i18n-aria="{field}Filter"' in html, "Filter accessible name is missing"
    assert 'paretoFrontier(rows.filter((row) => row.source_type === source))' in script, (
        "Combined chart must calculate a separate frontier for each source"
    )
    assert "function paretoFrontier(rows)" in script, "Pareto frontier calculation missing"
    assert "Number.isFinite(row.total_cost_usd)" in script, "Missing costs must not plot as zero"
    assert 'class="run-config-summary"' not in script, "Internal experiment IDs must not clutter the table"
    assert '"CI —"' not in script, "Missing confidence intervals must not render a placeholder annotation"
    assert "function paretoConfigLabel(row)" in script, "Chart points need readable configuration labels"
    assert "official_detail_url" in script, "Official result detail link is missing"
    assert 'version-select' not in html and 'versionSelect' not in script, "Single-benchmark page must not have a version selector"
    assert '--results-toolbar-height' in script and '--results-toolbar-height' in css, (
        "Sticky table headers must account for toolbar height"
    )
    assert 'officialUrl.searchParams.set("efforts", "all")' in script, (
        "Official comparison link must open the all-efforts view"
    )
    assert 'class="locale-control"' in html, "Language control missing"
    assert '<option value="system">' in html, "Follow system language option is missing"
    assert 'option[value="system"]' in script, "Follow system option is not translated"
    assert 'class="source-filter"' in html, "Source filter missing"
    assert "accuracy_ci95_half_width" in script, "Confidence-interval comparison is missing"
    assert "configEvidence?.source_url" in script and "row.configuration_source_url" in script, "Configuration evidence links missing"
    assert "harness_version_variants" in script and "configCoverageValue" in script, "Full-run configuration qualifications missing"
    assert 'pareto-range-toggle' not in html and 'paretoZoomed' not in script, "Removed chart range control is still present"
    assert 'data-x-scale="linear"' in script and 'i * step' in script, "Cost axis must use evenly spaced linear ticks"
    assert 'paretoAxisLogCost' not in script, "Obsolete log scale remains"
    assert 'pareto-extreme-ring' not in script and 'pareto-extreme-ring' not in css, "Removed decorative point rings must not return"
    assert 'pareto-envelope' in script, "Frontier reference shading missing"
    assert 'metricsLabel' not in script, "Numeric point labels must remain in tooltips"
    assert 'pareto-label-toggle' not in html and 'paretoAllNames' not in script, "Removed all-names control must not return"
    assert 'if (!onFrontier) return;' in script, "Overview must emphasize each source's frontier"
    assert script.index('markers.unshift(') < script.index('if (!onFrontier)'), (
        "Frontier labeling must not remove non-frontier points"
    )
    assert 'const PARETO_COST_MAX = 1200;' in script and 'const PARETO_COST_STEP = 300;' in script
    assert 'const yMin = 0;' in script and 'const yMax = 100;' in script and 'const yStep = 20;' in script, (
        "Resolution-rate axis must retain the full 0–100% range and 20-point ticks"
    )
    assert 'row.total_cost_usd <= PARETO_COST_MAX' in script, "Out-of-range costs must not be drawn inside the viewport"
    assert 'paretoRangeNote' in script, "Chart range must be explained without removing table records"
    assert 'paretoComparison' in script and 'partialCostNote(row)' in script, "Comparison and cost qualifications must remain accessible"
    assert "function paretoPointAt(event)" in script, "Close chart points need unambiguous hit testing"
    assert "timeoutNote" in script and "harnessMode" in script, "Non-multiplier configuration missing in Details"
    column_contract = (
        '["row_number", "rowNumber"]',
        '["harness", "harness"]',
        '["model", "model"]',
        '["compression_trigger", "compressionColumn"]',
        '["timeout_multiplier", "timeoutColumn"]',
        '["accuracy", "resolutionRate"]',
        '["total_cost_usd", "cost"]',
        '["source_type", "source"]',
    )
    positions = [script.find(column) for column in column_contract]
    assert all(position >= 0 for position in positions), "A required table column is missing"
    assert positions == sorted(positions), "The table column order changed"
    assert 'detailsCell.textContent = t("details")' not in script, (
        "Removed Details column is still rendered"
    )
    assert 'class="details-cell"' not in script, "Removed Details cell is still rendered"
    assert 'class="harness-details-button"' in script, "Harness detail trigger is missing"
    assert "harness-detail-hint" not in html and "harnessDetailsHint" not in script, "Removed Harness hint is still present"
    assert 'class="result-count sr-only"' in html, "Result count must be screen-reader-only"
    assert '<h2 id="pareto-title">Pareto Frontier</h2>' in html, "Minimal Pareto heading is missing"
    assert 'pareto-chart-meta' not in html and 'pareto-subtitle' not in html, "Removed chart annotations are still present"
    assert 'const PUBLISHED_BENCHMARK_IDS = ["terminal-bench-2.1"]' in script, "Only TB 2.1 is ready for publication"
    assert "PUBLISHED_BENCHMARK_IDS.includes(bench.id)" in script, "Unpublished benchmarks must be excluded before routing"
    assert 'event.target.closest(".harness-details-button")' in script, (
        "Harness detail trigger is not wired up"
    )
    assert 'aria-haspopup="dialog"' in script, "Harness detail trigger lacks dialog semantics"
    assert 'colspan="8"' in html, "Loading row does not span the eight table columns"
    assert script.count('colspan="8"') == 2, (
        "Empty and error rows do not span the eight table columns"
    )
    for removed_selector in ("ci-whisker", "rate-track", "rate-fill"):
        assert removed_selector not in script, f"Removed {removed_selector} markup is still rendered"
        assert removed_selector not in css, f"Removed {removed_selector} styling is still present"
    assert 'class="accuracy-track"' in script, "Accuracy bar is missing"
    assert ".accuracy-fill" in css, "Accuracy fill styling is missing"
    assert ".accuracy-ci" in css and ".accuracy-cap" in css, (
        "Confidence interval whisker styling is missing"
    )
    assert "function comparisonRanks(rows)" not in script, "Obsolete comparison rank logic remains"
    assert '<td class="row-number-cell">${index + 1}</td>' in script, "Row numbers must follow display order"
    assert 'if (key === "row_number")' in script, "Row number header must not offer a circular sort"
    assert 'sort: { key: "total_cost_usd", direction: "asc" }' in script, "Default ordering must be ascending total cost"
    assert 'sortInteracted: false' in script and script.count('state.sortInteracted && state.sort.key === key') == 2, "Default sorting must not highlight headers or cells"
    assert 'tbody tr:nth-child(-n + 3) .row-number-cell' in css, "Blue numbering must follow the first three displayed rows"
    assert 'class="source-cell' in script, "Dedicated source column missing"
    assert 'class="harness-meta"' in script, "Harness version must remain visible"
    assert script.count("costIncomplete:") == 2, "Detailed partial-cost disclosure must be bilingual"
    assert 't("runnerDefaultShort")' not in script and 't("partialCostShort")' not in script, "Repeated row annotations remain"
    assert script.count("modelRevisionConfirmed:") == 2, "Human-confirmed revision provenance must be bilingual"
    assert 'row.protocol_note !== null' in script, "Official Details null guard is missing"
    assert "missingValue(true)" in script, "Compact missing metrics are not rendered safely"
    assert "linkedName(row.harness, row.harness_org)" not in script, (
        "Harness organization is still repeated in the main table"
    )
    assert ".column-total-cost-usd .sort-button" in css, "Cost header alignment missing"
    assert ".number-cell" in css and "text-align: right" in css, "Numeric alignment missing"
    icon_dir = ROOT / "site" / "assets" / "harnesses"
    actual_icons = {path.name for path in icon_dir.glob("*.svg")}
    assert actual_icons == HARNESS_ICON_ASSETS, "Harness icon asset set changed"
    for icon_name in HARNESS_ICON_ASSETS:
        assert f'assets/harnesses/{icon_name}' in script, (
            f"Harness icon is not referenced: {icon_name}"
        )


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
    importer = load_importer()
    assert importer.replace_curated_results(copy.deepcopy(actual)) == actual, (
        "Curated source and published rows differ; run import_terminal_bench.py --curated-only"
    )
    assert importer.apply_config_evidence(copy.deepcopy(actual)) == actual, (
        "Official configuration evidence and published rows differ"
    )

    if args.check_live:
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
