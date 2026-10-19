#!/usr/bin/env python3
"""Refresh the static leaderboard from the official tbench.ai API."""

from __future__ import annotations

import argparse
import json
import math
import re
import urllib.error
import urllib.request
from datetime import date
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_OUTPUT = ROOT / "site" / "data" / "benchmarks.json"
CURATED_INPUT = ROOT / "data" / "curated_results.json"
CONFIG_EVIDENCE_INPUT = ROOT / "data" / "official_config_evidence.json"
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
    # A standard error is not a reported 95% interval. Never synthesize one.

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
        "timeout_multiplier": None,
        "config_evidence": None,
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
        "average_cost_per_task_usd": raw.get("average_cost_per_task_usd"),
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
        "verified_at": raw.get("verified_at") or verified_at,
        "harness_version": raw.get("harness_version"),
        "protocol_note": raw.get("protocol_note"),
        "run_config": raw.get("run_config"),
        "cost_coverage": raw.get("cost_coverage"),
        "configuration_source_url": raw.get("configuration_source_url"),
        "timeout_multiplier": raw.get("timeout_multiplier", (raw.get("run_config") or {}).get("timeout_multiplier")),
        "timeout_note": raw.get("timeout_note"),
        "timeout_hours": raw.get("timeout_hours"),
        "wall_clock_limit_removed": raw.get("wall_clock_limit_removed"),
        "context_window_label": raw.get("context_window_label"),
        "harness_mode": raw.get("harness_mode"),
    }
    return row


def load_config_evidence() -> dict[str, dict[str, Any]]:
    """Validate complete, row-bound public-trial audits before supplementing rows."""
    payload = json.loads(CONFIG_EVIDENCE_INPUT.read_text(encoding="utf-8"))
    if payload.get("schema_version") != 2:
        raise ValueError("Unsupported official configuration evidence schema")
    verified_at = payload["verified_at"]
    date.fromisoformat(verified_at)
    known_benchmarks = {config["id"]: config for config in BENCHMARKS}
    uuid = r"[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}"
    hub = r"https://hub\.harborframework\.com/"

    def valid_url(value: Any, pattern: str) -> bool:
        return isinstance(value, str) and re.fullmatch(pattern, value) is not None

    def positive_int(value: Any) -> bool:
        return type(value) is int and value > 0

    def valid_note(value: Any) -> bool:
        return value is None or (
            isinstance(value, dict) and set(value) == {"en", "zh"}
            and all(isinstance(text, str) and bool(text.strip()) for text in value.values())
        )

    def valid_version(value: Any) -> bool:
        return isinstance(value, str) and (
            value == "unknown" or (
                re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9 ._+()\-]{0,119}", value) is not None
                and re.search(r"\d", value) is not None and "mode" not in value.lower()
            )
        )

    required_record = {
        "row_id", "benchmark_id", "match", "harness_version", "harness_version_variants",
        "timeout_multiplier", "source_url", "verification", "version_note", "raw_config",
        "supplemental_sources",
    }
    required_verification = {
        "scope", "trial_count", "unique_trial_count", "inaccessible_trial_count", "job_urls",
        "field_paths", "timeout_multiplier_counts", "timeout_overrides_absent", "api_requests",
    }
    field_paths = {
        "harness_version": "trial.agent.version",
        "timeout_multiplier": "trial.lock.timeout_multiplier",
    }
    audit_queries = payload["audit_query_templates"]
    for query in audit_queries.values():
        if (
            set(query) != {"endpoint", "select"}
            or query["endpoint"] != "https://ofhuhcpkvzjlejydnvyd.supabase.co/rest/v1/leaderboard_row_trial"
            or not isinstance(query["select"], str)
            or not query["select"].startswith("trial_id,trial(")
        ):
            raise ValueError("Invalid public trial audit query")
    result = {}
    for record in payload["records"]:
        row_id = record["row_id"]
        if (
            set(record) != required_record or not valid_url(row_id, uuid)
            or row_id in result or record["benchmark_id"] not in known_benchmarks
        ):
            raise ValueError(f"Invalid/duplicate configuration evidence: {row_id}")
        if set(record["match"]) != {"harness", "model", "thinking_level", "accuracy", "trial_count"}:
            raise ValueError(f"Incomplete observation binding: {row_id}")
        match = record["match"]
        if (
            any(not isinstance(match[key], str) or not match[key] for key in ("harness", "model"))
            or (match["thinking_level"] is not None and not isinstance(match["thinking_level"], str))
            or type(match["accuracy"]) not in (int, float)
            or not math.isfinite(match["accuracy"]) or not 0 <= match["accuracy"] <= 100
            or not valid_note(record["version_note"])
        ):
            raise ValueError(f"Invalid observation identity or note: {row_id}")
        count = record["match"]["trial_count"]
        verification = record["verification"]
        if (
            not positive_int(count) or set(verification) != required_verification
            or verification["scope"] != "all_linked_trials"
            or type(verification["trial_count"]) is not int or verification["trial_count"] != count
            or type(verification["unique_trial_count"]) is not int or verification["unique_trial_count"] != count
            or type(verification["inaccessible_trial_count"]) is not int or verification["inaccessible_trial_count"] != 0
            or verification["field_paths"] != field_paths
            or verification["timeout_overrides_absent"] is not True
        ):
            raise ValueError(f"Configuration evidence must cover all linked trials: {row_id}")
        config = known_benchmarks[record["benchmark_id"]]
        expected_url = (
            f"https://hub.harborframework.com/datasets/{config['package']}/"
            f"{config['dataset_version']}/leaderboards/{config['leaderboard']}/rows/{row_id}"
        )
        if record["source_url"] != expected_url:
            raise ValueError(f"Configuration source must identify the exact official row: {row_id}")
        if (
            not verification["job_urls"]
            or len(set(verification["job_urls"])) != len(verification["job_urls"])
            or any(not valid_url(url, hub + r"jobs/" + uuid) for url in verification["job_urls"])
        ):
            raise ValueError(f"Invalid official source job: {row_id}")
        if not verification["api_requests"]:
            raise ValueError(f"Missing full-trial audit requests: {row_id}")
        pages: dict[str, list[tuple[int, int]]] = {}
        for request in verification["api_requests"]:
            args = request.get("query", {})
            if (
                set(request) != {"template", "query"} or request["template"] not in audit_queries
                or not {"row_id", "order", "limit"} <= set(args)
                or set(args) - {"row_id", "order", "limit", "offset"}
                or args["row_id"] != "eq." + row_id or args["order"] != "trial_id"
                or not re.fullmatch(r"[1-9]\d{0,3}", args["limit"])
                or ("offset" in args and not re.fullmatch(r"\d+", args["offset"]))
            ):
                raise ValueError(f"Invalid row-bound audit request: {row_id}")
            pages.setdefault(request["template"], []).append((int(args.get("offset", "0")), int(args["limit"])))
        for ranges in pages.values():
            covered = 0
            for offset, limit in sorted(ranges):
                if offset != covered:
                    raise ValueError(f"Incomplete or overlapping trial audit pages: {row_id}")
                covered += limit
            if covered < count:
                raise ValueError(f"Incomplete trial audit pages: {row_id}")
        selected = [audit_queries[key]["select"] for key in pages]
        if not any("agent(name,version)" in query and "lock->timeout_multiplier" in query for query in selected):
            raise ValueError(f"Trial audit must read reported versions and resolved timeouts: {row_id}")
        variants = record["harness_version_variants"]
        if not variants:
            raise ValueError(f"Missing reported Harness versions: {row_id}")
        for variant in variants:
            if (
                set(variant) != {"version", "count", "source_url"}
                or not valid_version(variant["version"]) or not positive_int(variant["count"])
                or not valid_url(variant["source_url"], hub + r"jobs/" + uuid + r"/trials/" + uuid)
                or variant["source_url"].rsplit("/trials/", 1)[0] not in verification["job_urls"]
            ):
                raise ValueError(f"Invalid Harness version observation: {row_id}")
        if sum(v["count"] for v in variants) != count or len({v["version"] for v in variants}) != len(variants):
            raise ValueError(f"Harness versions must cover all linked trials exactly once: {row_id}")
        version = record["harness_version"]
        uniform_version = variants[0]["version"] if len(variants) == 1 and variants[0]["version"] != "unknown" else None
        if version != uniform_version or (version is None and not record["version_note"]):
            raise ValueError(f"Mixed or unknown Harness versions cannot imply one version: {row_id}")
        timeout = record["timeout_multiplier"]
        timeout_counts = verification["timeout_multiplier_counts"]
        if (
            type(timeout) not in (int, float) or not math.isfinite(timeout) or timeout <= 0
            or not isinstance(timeout_counts, list) or len(timeout_counts) != 1
            or set(timeout_counts[0]) != {"value", "count"}
            or type(timeout_counts[0]["value"]) not in (int, float)
            or type(timeout_counts[0]["count"]) is not int
            or timeout_counts != [{"value": timeout, "count": count}]
        ):
            raise ValueError(f"Invalid timeout value or incomplete observations: {row_id}")
        for raw in record["raw_config"]:
            if (
                set(raw) != {"name", "value", "field_paths", "trial_count", "note", "documentation_url"}
                or raw["name"] != "CLAUDE_CODE_AUTO_COMPACT_WINDOW"
                or not isinstance(raw["value"], str) or not re.fullmatch(r"[1-9]\d*", raw["value"])
                or raw["field_paths"] != ["trial.config.agent.env.CLAUDE_CODE_AUTO_COMPACT_WINDOW", "trial.lock.agent.env.CLAUDE_CODE_AUTO_COMPACT_WINDOW"]
                or type(raw["trial_count"]) is not int or raw["trial_count"] != count
                or not raw["note"] or not valid_note(raw["note"])
                or raw["documentation_url"] != "https://code.claude.com/docs/en/env-vars"
            ):
                raise ValueError(f"Invalid raw compaction configuration: {row_id}")
        for source in record["supplemental_sources"]:
            if set(source) != {"kind", "url", "field_path", "reported_value", "note"} or not valid_note(source["note"]):
                raise ValueError(f"Invalid supplemental source: {row_id}")
            if source["kind"] == "official_submission":
                pattern = r"https://github\.com/harbor-framework/terminal-bench(?:-2-1)?/blob/[0-9a-f]{40}/leaderboard/submissions/[^/]+\.json"
                valid = source["field_path"] == "source_filter.agent_version" and valid_version(source["reported_value"])
            elif source["kind"] == "official_review":
                pattern = r"https://github\.com/harbor-framework/terminal-bench(?:-2-1)?/pull/\d+#issuecomment-\d+"
                valid = (
                    source["field_path"] == "timeout_multiplier"
                    and type(source["reported_value"]) in (int, float)
                    and math.isfinite(source["reported_value"]) and source["reported_value"] > 0
                )
            else:
                valid, pattern = False, ""
            if not valid or not valid_url(source["url"], pattern):
                raise ValueError(f"Supplement must pin an official submission or review: {row_id}")
        result[row_id] = {**record, "verified_at": verified_at}
    return result


def apply_config_evidence(payload: dict[str, Any]) -> dict[str, Any]:
    evidence = load_config_evidence()
    matched = set()
    for bench in payload["benchmarks"]:
        for row in bench["results"]:
            if row["source_type"] != "benchmark_official":
                continue
            row.update(harness_version=None, harness_version_variants=[], timeout_multiplier=None, config_evidence=None)
            record = evidence.get(row["id"])
            if record is None:
                continue
            actual = {
                "harness": row["harness"]["label"], "model": row["model"]["label"],
                "thinking_level": row["thinking_level"], "accuracy": row["accuracy"],
                "trial_count": row["trial_count"],
            }
            if record["benchmark_id"] != bench["id"] or record["match"] != actual:
                raise ValueError(f"Configuration evidence no longer matches result {row['id']}; re-audit it")
            row.update(
                harness_version=record["harness_version"],
                harness_version_variants=record["harness_version_variants"],
                timeout_multiplier=record["timeout_multiplier"],
                config_evidence={
                    **{key: value for key, value in record["verification"].items() if key != "api_requests"},
                    "verified_at": record["verified_at"],
                    "source_url": record["source_url"],
                    "version_note": record["version_note"],
                    "raw_config": record["raw_config"],
                    "supplemental_sources": record["supplemental_sources"],
                },
            )
            matched.add(row["id"])
    if unmatched := set(evidence) - matched:
        raise ValueError(f"Configuration evidence references absent official rows: {sorted(unmatched)}")
    return payload


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
    return rows, max([verified_at, *(row["verified_at"] for row in rows)])


def replace_curated_results(payload: dict[str, Any]) -> dict[str, Any]:
    """Update curated rows without changing any existing official observations."""
    curated_rows, verified_at = load_curated_rows()
    payload["curated_verified_at"] = verified_at
    for bench in payload["benchmarks"]:
        official = [row for row in bench["results"] if row["source_type"] == "benchmark_official"]
        rows = official + [row for row in curated_rows if row["benchmark_id"] == bench["id"]]
        rows.sort(key=lambda row: (-row["accuracy"], row["source_type"], row["model"]["label"]))
        bench.update({
            "results": rows,
            "result_count": len(rows),
            "official_result_count": len(official),
            "vendor_result_count": sum(row["source_type"] == "vendor_reported" for row in rows),
            "penguin_result_count": sum(row["source_type"] == "penguin_run" for row in rows),
            "model_count": len({row["model"]["label"] for row in rows}),
            "harness_count": len({row["harness"]["label"] for row in rows if row["harness"]["label"]}),
            "best_accuracy": max(row["accuracy"] for row in rows),
        })
    return payload


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
        "harness_count": len(
            {row["harness"]["label"] for row in rows if row["harness"]["label"]}
        ),
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
    return apply_config_evidence({
        "schema_version": 4,
        "default_benchmark": "terminal-bench-2.1",
        "official_api": API_URL,
        "curated_verified_at": curated_verified_at,
        "benchmarks": benchmarks,
    })


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--curated-only", action="store_true", help="Keep official metrics; update curated results and verified configuration supplements")
    args = parser.parse_args()

    payload = (
        apply_config_evidence(replace_curated_results(json.loads(args.output.read_text(encoding="utf-8"))))
        if args.curated_only else build_payload()
    )
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
