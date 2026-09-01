# Penguin Harness Leaderboard

Static leaderboard for comparing the complete benchmark setup: Harness, model,
Thinking Level, disclosed run configuration, and Accuracy.

The site has two real benchmark views: Terminal-Bench 2.1 and Terminal-Bench
3.0. Counts, snapshot dates, and summary copy are derived from the input data
rather than duplicated as constants in the generated page.

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
    scripts/verify_site.py       Verify schema, ranks, dates, source evidence
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
    python3 scripts/verify_site.py --check-remote-sources
    node --check site/script.js

Review both the input evidence and generated JSON diff before committing.
GitHub Actions repeats the data and JavaScript validation before deployment.

## Data policy

- Benchmark-official and vendor-reported results remain distinguishable even
  when sorted in one table.
- Vendor results require a direct first-party HTTPS source: an official vendor
  page or a file in the vendor's official model repository.
- Every vendor row also carries machine-checkable evidence metadata. Text
  claims use pinned first-party files and exact markers. If a score exists only
  in an official image, the reviewed image and its context are pinned and the
  image SHA-256 is verified; the validator does not pretend to OCR it.
- Vendor rows always have `official_rank: null`.
- `source_type` is a closed enum. Adding a future `penguin_self_run` tier must
  be an explicit schema change with its own evidence policy.
- Missing Harness, Thinking Level, trial, timeout, or Sandbox data remains
  `null`; it is never replaced with a guessed default.
- Multiple reliable observations for one model are preserved as separate rows.
- Terminal-Bench versions never share scores or ranks.
- Unknown curated `benchmark_id` values and duplicate result IDs fail the build
  instead of being silently ignored.
- The TB 3.0 view is a point-in-time Harbor Hub snapshot, not a live mirror.
- `published_at` means the date that result was submitted or published, not the
  model's general release date. `retrieved_at` means the date the cited result
  or snapshot was checked. `snapshot_updated_at` is the upstream snapshot's own
  update time.

The current evidence review date lives in `data/curated-results.json` as
`verified_at`. Update it together with each affected `retrieved_at` value when
reviewing or changing curated records.

## Deployment

Pull requests that change the site, data, scripts, or workflow run schema,
frontend, and remote source-evidence checks before merge. Pushes to `main` run
the same verification and then deploy Pages; feature branches do not deploy.
The repository's GitHub Pages settings already configure
`leaderboard.penguin.ooo` as the custom domain, so no repository `CNAME` file
is required for the current setup.
