# Penguin Harness Leaderboard

Static benchmark leaderboard for comparing the complete evaluation setup:
Harness, model, Thinking Level, score, and detailed run configuration.

The first published view contains Terminal-Bench 2.1 results only. Its data is
generated from the merged submission records in the official
[harbor-framework/terminal-bench-2-1](https://github.com/harbor-framework/terminal-bench-2-1)
repository. The disabled bench tab demonstrates how more benchmarks can be
added without mixing scores from different evaluation protocols.

The layout is visually inspired by
[RAG Bench Essential](https://prism-shadow.github.io/rag-bench-essential/),
and adapts parts of its frontend structure. See
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for the retained MIT notice.
This project's data schema and data-import pipeline are maintained
independently.

## What is included

- Top-level benchmark switcher with a multi-benchmark-ready data model
- Sortable and searchable result table
- Harness and Thinking Level filters
- Best-configuration-per-model view
- Accuracy, standard error, pass@2 through pass@5, cost, token, duration, and
  reward-hack review details
- Links from every row to the merged official pull request and Harbor jobs
- English and Chinese UI, light and dark themes, and responsive mobile layout
- GitHub Actions deployment to GitHub Pages

The current snapshot contains 89 tasks, 20 merged submissions, 13 models, and
6 harnesses. Accuracy already includes official reward-hack disqualifications;
pass@k is shown separately and must not be compared as if it were Accuracy.

## Repository layout

    site/                         Static GitHub Pages artifact
    site/data/benchmarks.json    Published result data
    scripts/import_terminal_bench.py
                                  Import official submissions
    scripts/verify_site.py       Verify published data against the source
    .github/workflows/pages.yml  GitHub Pages deployment

## Local preview

From this repository:

    python3 -m http.server 8765 --directory site

Then open http://localhost:8765/.

Opening site/index.html directly is not supported because browsers block the
JSON request from local files.

## Refresh Terminal-Bench data

The importer expects the official repository next to this repository:

    Terminal-bench-2.1/
    ├── penguin-harness-leaderboard/
    └── terminal-bench-2-1/

Regenerate and verify:

    python3 scripts/import_terminal_bench.py
    python3 scripts/verify_site.py

Review the JSON diff before committing. The generated file records the exact
official source commit in snapshot_commit for traceability. The updated value
is derived from that commit date, so regenerating an unchanged snapshot is
deterministic.

Results with the same official Accuracy share a competition rank; the next
rank skips the corresponding number of positions.

## Deployment

The Pages workflow publishes the site directory after a push to main and can
also be started manually from the Actions tab. Feature branches do not deploy
automatically, which keeps the public leaderboard unchanged until review and
merge.

## Data policy

The main table includes only merged official Terminal-Bench 2.1 submissions.
Community or local experiments, including runs using different k values or
other protocols, should use a clearly separated benchmark or result tier
instead of being mixed into the official ranking.
