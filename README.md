# Penguin Harness Leaderboard

Static leaderboard for comparing the complete benchmark setup: Harness, model,
Thinking Level, disclosed run configuration, and Accuracy.

The site has two real benchmark views:

- Terminal-Bench 2.1: 20 merged benchmark submissions plus 8 first-party
  vendor reports.
- Terminal-Bench 3.0: 12 rows from a dated export of Harbor Hub's public leaderboard
  plus 1 first-party vendor report.

All results share one table, with explicit source labels and a source filter.
Only `benchmark_official` rows receive an official rank. `vendor_reported` rows
are public reference results and may use different protocols.

The layout is visually inspired by
[RAG Bench Essential](https://prism-shadow.github.io/rag-bench-essential/).
See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for the retained MIT notice.

## Repository layout

    data/curated-results.json
                                  Manually verified first-party model reports
    data/terminal-bench-3.0-official.json
                                  Dated export of the official TB 3.0 leaderboard
    site/                         Static GitHub Pages artifact
    site/data/benchmarks.json    Generated data consumed by the page
    scripts/import_terminal_bench.py
                                  Build official + curated site data
    scripts/verify_site.py       Verify data, ranks, nullable fields, and sources
    .github/workflows/pages.yml  Validate and deploy GitHub Pages

## Local preview

From this repository:

    python3 -m http.server 8765 --directory site

Then open:

- http://localhost:8765/?bench=terminal-bench-2.1
- http://localhost:8765/?bench=terminal-bench-3.0

Opening `site/index.html` directly is not supported because browsers block the
JSON request from local files.

## Refresh and verify

The importer expects the official TB 2.1 repository next to this repository:

    Terminal-bench-2.1/
    ├── penguin-harness-leaderboard/
    └── terminal-bench-2-1/

Regenerate and verify:

    python3 scripts/import_terminal_bench.py
    python3 scripts/verify_site.py
    node --check site/script.js

Review both the input evidence and generated JSON diff before committing.
GitHub Actions repeats the data and JavaScript validation before deployment.

## Data policy

- Benchmark-official and vendor-reported results remain distinguishable even
  when sorted in one table.
- Vendor results require a direct first-party HTTPS source: an official vendor
  page or a file in the vendor's official model repository.
- Vendor rows always have `official_rank: null`.
- Missing Harness, Thinking Level, trial, timeout, or Sandbox data remains
  `null`; it is never replaced with a guessed default.
- Multiple reliable observations for one model are preserved as separate rows.
- Terminal-Bench versions never share scores or ranks.
- The TB 3.0 view is a point-in-time Harbor Hub snapshot, not a live mirror.

Source evidence was checked on 2026-09-01. Update `retrieved_at` and review the
primary page whenever a curated record changes.

## Deployment

The Pages workflow runs on pushes to `main` that change the site, data, scripts,
or workflow. Feature branches do not deploy automatically. The repository's
GitHub Pages settings already configure `leaderboard.penguin.ooo` as the custom
domain, so no repository `CNAME` file is required for the current setup.
