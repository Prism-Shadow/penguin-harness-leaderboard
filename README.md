# Penguin Harness Leaderboard

A static GitHub Pages leaderboard for comparing the complete evaluation setup,
not only the model. The current demo combines the official Terminal-Bench 2.1,
3.0, and 4.0 baselines from [tbench.ai](https://www.tbench.ai/) with separately
labelled vendor reports and one trace-backed Penguin run.

The main table intentionally follows the official comparison surface, with one
requested change: Harness appears before Model. It shows official rank,
Harness, Model and reasoning effort, Resolution Rate with a 95% confidence
interval when reported, average Trial duration, Release Date, total Tokens,
total Cost, and source type. Trial count stays in Details for auditing instead
of occupying a main comparison column. Harness and Model organization names stay in Details instead of being
repeated under every result. Each row opens a Details dialog with additional
fields actually disclosed by its source, such as pass@k, token breakdown,
protocol notes, and evidence links.

## Data source

The static JSON is a normalized snapshot of the same official API used by
tbench.ai. Benchmark routing follows the open-source website configuration in
[`lib/leaderboard.ts`](https://github.com/harbor-framework/terminal-bench-website/blob/main/lib/leaderboard.ts):

| View | Package | Official leaderboard |
| --- | --- | --- |
| Terminal-Bench 2.1 | `terminal-bench/terminal-bench-2-1` | `main` |
| Terminal-Bench 3.0 | `terminal-bench/terminal-bench` | `3-0-0` |
| Terminal-Bench 4.0 | `terminal-bench/terminal-bench` | `4-0-0` |

`site/data/benchmarks.json` stores the generated public snapshot and its upstream
`updated_at` timestamps. Evidence-backed manual rows live separately in
`data/curated_results.json`, so refreshing the official API cannot overwrite
them. `scripts/verify_site.py --check-live` fetches all three official
leaderboards and requires an exact normalized match before merging the curated
rows.

## Repository layout

    site/                         Static GitHub Pages site
    site/data/benchmarks.json    Generated public snapshot
    data/curated_results.json    Vendor and Penguin results with primary sources
    scripts/import_terminal_bench.py
                                  Refresh snapshot from tbench.ai
    scripts/verify_site.py       Verify schema, ranks, metrics, and live parity
    .github/workflows/pages.yml  Validate and deploy GitHub Pages

## Local preview

From this repository:

    python3 -m http.server 8765 --directory site

Then open one of:

- http://localhost:8765/?version=2.1
- http://localhost:8765/?version=3.0
- http://localhost:8765/?version=4.0

Opening `site/index.html` directly is not supported because browsers block the
JSON request from local files.

## Refresh and verify

    python3 scripts/import_terminal_bench.py
    python3 scripts/verify_site.py
    python3 scripts/verify_site.py --check-live
    node --check site/script.js

Always review the generated JSON diff before committing. The GitHub Actions
workflow repeats the live parity and frontend syntax checks on pull requests and
before a push to `main` is deployed.

## Data policy

- Source type is a strict enum: `benchmark_official`, `vendor_reported`, or
  `penguin_run`.
- Official rows are returned with `status=display` by tbench.ai and retain
  their official rank in the data and Details. The main table shows a dynamic
  comparison rank across the current filtered view, including vendor and
  Penguin rows, without presenting that number as an official rank.
- Vendor rows require a primary page controlled by the model vendor. Secondary
  articles and aggregation sites are not accepted as evidence.
- Missing reasoning effort or metrics remain undisclosed rather than guessed.
- Detailed metric groups only render fields present in the selected source;
  the fixed summary explicitly labels missing effort or release date as
  undisclosed. No missing value is filled with an inference.
- Benchmark versions never share scores or ranks.
- Official dates retain the Release Date semantics: TB 3.0 uses its
  `release_date`; other views use the official `date` field. These are model
  release dates, not evaluation run dates. The snapshot timestamp remains
  visible above the table. A vendor page publication date is stored separately
  as `published_at`, not copied into Release Date.
- The included Penguin result is backed by a public report with two scoreable
  attempts per TB 2.1 task. Future Penguin runs follow the same separate-source
  policy.

The layout began with visual inspiration from
[RAG Bench Essential](https://prism-shadow.github.io/rag-bench-essential/).
See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for its retained MIT notice.

## Deployment

Pull requests validate the static snapshot against the live official API.
Pushes to `main` run the same checks and deploy `site/` through GitHub Pages.
Feature branches do not deploy.
