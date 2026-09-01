#!/usr/bin/env python3
"""Verify generated site data, source tiers, ranks, and evidence metadata."""

from __future__ import annotations

import argparse
import hashlib
import importlib.util
import json
import sys
import urllib.error
import urllib.request
from datetime import date
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
EVIDENCE_SOURCE_PREFIXES = {
    **VENDOR_SOURCE_PREFIXES,
    "Z.ai": VENDOR_SOURCE_PREFIXES["Z.ai"] + (
        "https://raw.githubusercontent.com/zai-org/",
    ),
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


def valid_date(value: Any) -> bool:
    try:
        date.fromisoformat(value)
    except (TypeError, ValueError):
        return False
    return True


def fetch(url: str, cache: dict[str, bytes]) -> bytes:
    if url not in cache:
        request = urllib.request.Request(
            url,
            headers={"User-Agent": "penguin-harness-leaderboard-audit/1.0"},
        )
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                cache[url] = response.read()
        except (urllib.error.URLError, TimeoutError) as error:
            raise AssertionError(f"Could not retrieve evidence URL {url}: {error}") from error
    return cache[url]


def verify_curated_evidence(check_remote: bool) -> None:
    curated = json.loads((ROOT / "data" / "curated-results.json").read_text(encoding="utf-8"))
    cache: dict[str, bytes] = {}
    for row in curated["results"]:
        evidence = row.get("evidence")
        assert isinstance(evidence, dict), f"Missing evidence metadata: {row['id']}"
        kind = evidence.get("kind")
        assert kind in {"text", "reviewed_image"}, f"Unknown evidence kind: {row['id']}"

        evidence_url = evidence.get("url", "")
        assert row["publisher"] in EVIDENCE_SOURCE_PREFIXES, row["id"]
        allowed = EVIDENCE_SOURCE_PREFIXES[row["publisher"]]
        assert evidence_url.startswith(allowed), evidence_url
        evidence_text = " ".join(
            str(value)
            for value in evidence.get("markers", evidence.get("context_markers", []))
        ) + " " + str(evidence.get("note", "")) + " " + evidence_url
        assert row["model"].casefold() in evidence_text.casefold(), row["id"]
        assert row["benchmark_id"].removeprefix("terminal-bench-") in evidence_text, row["id"]
        assert str(row["accuracy"]) in evidence_text, row["id"]

        if kind == "text":
            markers = evidence.get("markers")
            assert isinstance(markers, list) and markers, row["id"]
            if check_remote:
                body = fetch(evidence_url, cache).decode("utf-8", errors="replace").casefold()
                for marker in markers:
                    assert marker.casefold() in body, f"Evidence marker missing for {row['id']}: {marker}"
            continue

        digest = evidence.get("sha256", "")
        context_url = evidence.get("context_url", "")
        context_markers = evidence.get("context_markers")
        assert len(digest) == 64 and all(char in "0123456789abcdef" for char in digest), row["id"]
        assert context_url.startswith(allowed), context_url
        assert isinstance(context_markers, list) and context_markers, row["id"]
        assert evidence.get("note"), row["id"]
        if check_remote:
            actual_digest = hashlib.sha256(fetch(evidence_url, cache)).hexdigest()
            assert actual_digest == digest, f"Evidence image changed for {row['id']}"
            context = fetch(context_url, cache).decode("utf-8", errors="replace").casefold()
            for marker in context_markers:
                assert marker.casefold() in context, (
                    f"Evidence context marker missing for {row['id']}: {marker}"
                )


def verify_benchmark(bench: dict[str, Any], source_types: frozenset[str]) -> None:
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
    assert all(row["source_type"] in source_types for row in rows)
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
        assert valid_date(row["retrieved_at"]), row["id"]
        assert row["published_at"] is None or valid_date(row["published_at"]), row["id"]
        if row["source_type"] == "vendor_reported":
            assert row["publisher"] in VENDOR_SOURCE_PREFIXES, row["id"]
            allowed = VENDOR_SOURCE_PREFIXES[row["publisher"]]
            assert row["source_url"].startswith(allowed), row["source_url"]
            assert row["protocol_note"], row["id"]


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, default=DEFAULT_SOURCE)
    parser.add_argument(
        "--check-remote-sources",
        action="store_true",
        help="Fetch pinned first-party evidence and verify its markers or digest",
    )
    args = parser.parse_args()
    source = args.source.resolve()
    if not source.is_dir():
        raise SystemExit(f"Official Terminal-Bench 2.1 checkout not found at {source}")

    importer = load_importer()
    expected = importer.build_payload(source)
    verify_curated_evidence(args.check_remote_sources)
    actual = json.loads(PUBLISHED.read_text(encoding="utf-8"))
    assert actual == expected, "Published JSON is stale; run scripts/import_terminal_bench.py"
    assert actual["schema_version"] == 2
    assert [bench["id"] for bench in actual["benchmarks"]] == list(importer.BENCHMARK_IDS)

    ids = [row["id"] for bench in actual["benchmarks"] for row in bench["results"]]
    assert len(ids) == len(set(ids)), "Duplicate result IDs"
    for bench in actual["benchmarks"]:
        verify_benchmark(bench, importer.SOURCE_TYPES)

    summary = ", ".join(
        f"{bench['short_name']} {bench['official_result_count']} official + "
        f"{bench['result_count'] - bench['official_result_count']} vendor"
        for bench in actual["benchmarks"]
    )
    checks = ["schema", "ranks", "dates", "source enums", "first-party domains"]
    if args.check_remote_sources:
        checks.append("remote evidence")
    print(f"Verified {', '.join(checks)}: {summary}.")


if __name__ == "__main__":
    main()
