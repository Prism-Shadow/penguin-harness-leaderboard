# Penguin Harness Leaderboard

A static GitHub Pages leaderboard for comparing the complete evaluation setup,
not only the model. The current demo mirrors the official Terminal-Bench 2.1,
3.0, and 4.0 result tables published by [tbench.ai](https://www.tbench.ai/).

The main table intentionally follows the official comparison surface, with one
requested change: Harness appears before Model. It shows official rank,
Harness, Model and reasoning effort, Resolution Rate with a 95% confidence
interval, Trials, average Trial duration, Release Date, total Tokens, and total
Cost. Harness and Model organization names stay in Details instead of being
repeated under every result. Each row opens a Details dialog with additional
fields actually disclosed by the official API, such as pass@k, token breakdown,
and source links. The dialog links to the corresponding Harbor result page for
a full official record.

## Data source

The static JSON is a normalized snapshot of the same official API used by
tbench.ai. Benchmark routing follows the open-source website configuration in
[`lib/leaderboard.ts`](https://github.com/harbor-framework/terminal-bench-website/blob/main/lib/leaderboard.ts):

| View | Package | Official leaderboard |
| --- | --- | --- |
| Terminal-Bench 2.1 | `terminal-bench/terminal-bench-2-1` | `main` |
| Terminal-Bench 3.0 | `terminal-bench/terminal-bench` | `3-0-0` |
| Terminal-Bench 4.0 | `terminal-bench/terminal-bench` | `4-0-0` |

`site/data/benchmarks.json` stores the current snapshot and its upstream
`updated_at` timestamp. `scripts/verify_site.py --check-live` fetches all three
leaderboards and requires an exact normalized match, so a changed official
leaderboard cannot silently deploy stale rows.

## Repository layout

    site/                         Static GitHub Pages site
    site/data/benchmarks.json    Normalized official snapshot
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

## Data policy and future Penguin results

- The current three tables contain only official rows returned with
  `status=display` by tbench.ai.
- Rank is the official rank; the page never recomputes a different public rank.
- Missing reasoning effort or metrics remain undisclosed rather than guessed.
- Details only render fields present in the official API; missing fields are
  omitted instead of being filled with inferred values.
- Benchmark versions never share scores or ranks.
- Dates retain the official Release Date semantics: TB 3.0 uses its
  `release_date`; other views use the official `date` field. These are model
  release dates, not evaluation run dates. The snapshot timestamp remains
  visible above the table.
- Future Penguin experiments can be added after real runs are available, but
  they must use a separate source type and must not receive an official rank.
  Their Harness, Model, effort, tokens, cost, run date, and evidence should be
  recorded under the same comparable columns.

The layout began with visual inspiration from
[RAG Bench Essential](https://prism-shadow.github.io/rag-bench-essential/).
See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for its retained MIT notice.

## Deployment

Pull requests validate the static snapshot against the live official API.
Pushes to `main` run the same checks and deploy `site/` through GitHub Pages.
Feature branches do not deploy.
