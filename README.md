# Penguin Harness Leaderboard

A static GitHub Pages leaderboard for comparing the complete evaluation setup,
not only the model. The page currently presents Penguin's full-suite Terminal-Bench
2.1 experiments alongside official baselines from [tbench.ai](https://www.tbench.ai/)
and separately labelled vendor reports. TB 3.0 and 4.0 reference snapshots remain
in the repository but are not shown until full-suite Penguin results are available.
The frontend publication list is `PUBLISHED_BENCHMARK_IDS` in `site/script.js`;
links to unpublished versions fall back to TB 2.1. Available outputs for the
six Penguin jobs were archived locally on 2026-09-14; source trace gaps and native
JSONL format issues remain explicitly recorded, not presented as a complete archive.

The main table retains a leading row number and a trailing source column,
with configuration before performance:

| Column | Fixed comparison fields |
| --- | --- |
| Rank | Sequential position in the current filtered and sorted view, not an official rank |
| Harness | Name + reported or configured version |
| Model | Model name followed by source-reported thinking effort in plain parentheses, when available |
| Compact at | Context length that triggers compaction, not maximum context capacity |
| Time budget | Reported scaling factor (e.g. 4×) for each task's original time limit; fixed durations are not converted into multipliers |
| Resolution rate | Percentage + score bar; 95% interval only when available |
| Cost | Recorded USD total; incomplete billing is disclosed on hover and in Details |
| Source | Terminal-Bench, Vendor, or Penguin |

The eight display columns keep thinking effort beside the model, without a badge
or a separate column. The Benchmark's full
name remains above the table, with a responsive 28–40px heading; with only
TB 2.1 published, there is no version selector.
Default ordering is ascending recorded total cost,
with missing totals last (per-task means are not substituted for totals).
The default sort arrow is neutral; column highlighting starts only after a header is selected.
Row numbers always run from 1 to the displayed row count after filtering or sorting.
The row-number header is not sortable. Official ranks remain in Details.
Tokens, average trial duration, release/run dates, attempt counts, Sandbox,
concurrency, and raw evidence remain in the data and Harness-click Details.
This short comparison field set is not a claim that all other parameters are
irrelevant to a fair evaluation. Unreported configuration is not a default value.
Unreported compaction triggers and timeout multipliers appear as **—** in the table.
Reported context windows, fixed time limits, and removed time limits remain in
Harness-click Details; they do not substitute for a trigger or multiplier.
A reported mean cost carries **/task (mean)** and never replaces total cost in
sorting or Pareto calculations. Sources remain in Details.

The navigation brand reads **Penguin Harness Leaderboard**, with no duplicate
hero title. The page starts directly with the Benchmark's full name and results.
GitHub links remain in the navigation and footer. Column headers have no hover
explanations; sorting and screen-reader descriptions remain available. A funnel menu groups
Source, Harness, model and thinking effort into a two-level category/option selector.
Select each filter's **All** option to reset it. A **Clear all** action appears
at the bottom of the filter menu only while any filter is active; it clears
every filter in either view without changing the selected sort or view.
The left toolbar provides a download-tray icon for copy/export and a chain icon
for copying the current filters link. Both have translated hover and keyboard
hints that dismiss on click or Escape. Success feedback disappears after one
second, with repeat actions restarting the timer. Markdown contains
the complete filtered table in its current order; PNG/SVG exports contain the
full table or the current Pareto chart, not just the visible scrollport.
Exports are generated entirely in the browser, with local assets embedded.
Shared links retain the benchmark, view, filters and sort. Clipboard failures
are reported without claiming success; PNG and SVG can also be downloaded.
Filters and view tabs sit outside the card, aligned with its right edge.
In Table mode, the results area fits the available viewport height: the benchmark
title and controls stay visible while rows scroll inside the table. Column
headers stick to the top of that scroll region at every screen width. Headers
use uppercase text and the same foreground color as the body, with left-aligned
labels on one line. Columns fit their longest label or value plus consistent
padding; the score tracks retain their 260px width and use a 14px height. Horizontal scrolling inside
the card exposes the remaining columns without shrinking the bars. Controls,
menus, badges, cards and dialogs use square corners. The region is keyboard focusable.
Sorting or changing filters returns the rows to the top. Pareto retains its
page-scrolling layout. Row dividers use a stronger neutral color in both themes.
Reported ± intervals use the same size as the resolution rate and the same text
color as timeout multipliers; their reserved space keeps score bars aligned.
Error bars use thin black lines with vertical end caps in light mode and light
neutral lines in dark mode, independent of the model-series fill colors.
The score and interval geometry/data are unchanged.
Harness versions align with the name text using the same icon-column spacing,
including when a logo is missing or fails to load.
The navigation controls follow the Penguin homepage styling: compact language
selection, sun/moon/system theme icons, and an outlined, icon-only GitHub link.
The page does not display or fetch GitHub star counts.

Score bars use one stable color per model organization/series, not per Harness,
source, or sorted position. Opus, Sonnet, Haiku, and Fable share Claude's orange.
Missing organizations fall back to the model name; unrecognized models use a
neutral gray. Only the score-bar fill is colored, not the text or row background.
PNG/SVG exports use the same computed colors. The separate Pareto source encoding
remains unchanged.

The palette was reviewed against public official sites on 2026-10-20. These are
chart colors, not a claim that every vendor publishes one canonical brand hex:

| Model series | Light-mode fill | Official reference / chart adaptation |
| --- | --- | --- |
| GPT | `#10a37f` | Green chart accent; [OpenAI's current identity](https://openai.com/brand/) is primarily monochrome, so this is not a prescribed logo color |
| DeepSeek | `#4d6bfe` | [Homepage](https://www.deepseek.com/) CSS `--ds-color-brand` |
| Claude | `#d97757` | [Homepage](https://claude.com/) clay accent, retaining the requested orange |
| Gemini | `#ac87eb` | Purple used in the [official overview site's](https://gemini.google/overview/) gradient styling |
| Qwen | `#7046d6` | Adapted from the [official team site's](https://qwenlm.github.io/about/) `theme-color` (`#615ced`), deepened toward violet to distinguish it from Gemini and DeepSeek |
| Kimi | `#009ac9` | Cyan adaptation of the blues in the [Kimi Brand Book](https://www.kimi.ai/resources/kimi-brand), separated from DeepSeek/Meta |
| GLM | `#4d8a98` | Muted blue-teal adaptation of [Z.ai's](https://chat.z.ai/) blue accent and neutral UI, not an official brand hex |
| Grok | `#7c7c83` | [Grok's](https://grok.com/) neutral identity, lightened to keep black whiskers visible |
| Muse Spark | `#0064e0` | Blue used by the [Meta AI site](https://ai.meta.com/) |

In dark mode Gemini uses `#9466cf` and Kimi `#0085b5` so the light error
whiskers retain contrast. Model names and percentages remain visible; color is
only a supplementary series cue, not the only way to read or compare results.

Table and Pareto tabs share the current filters; both the view and filters are
saved in the URL. The **Pareto Frontier** view plots Penguin and benchmark-official
results together. Blue circles identify Penguin;
gray squares identify official reference results. Each source has its own observed
frontier, not a shared efficiency ranking. The cost axis is linear, from $0 to
$1,200 in $300 steps. This is a chart-only display range: higher-cost records
remain in the table and source data. The axis states its range, with a tooltip
explaining the omission. The resolution-rate axis is fixed at 0–100%, with
20-percentage-point ticks, including after filtering. Points use single markers without decorative outer
rings. The overview labels each source's frontier, with other observations shown
as quieter markers. Long names can wrap between Harness and model, never inside a model
ID; neighboring annotations are arranged without moving the data points.
Every point retains its full accessible identity, tooltip and Details action.
Hovering or focusing a labeled point highlights its label and shows one connector
routed around the other labels; connectors are not all drawn at once. Tooltips stay
inside the viewport and close on Escape, page scrolling, or resizing.
Pale shading above/left of the
combined observed envelope is a visual reference, not a controlled comparison.
Missing total costs remain in the table but are excluded from the chart.
`view=pareto` opens the chart; obsolete `pareto_source`
parameters are removed. Sources, cost coverage and configuration remain available
in point tooltips and Details. Filter names remain accessible to screen readers
without a redundant row of visible labels.
This layout takes inspiration from [tbench](https://www.tbench.ai/?view=pareto).
Versions without full-suite Penguin
results are excluded from URL routing, not presented as empty pages.
A reference point is not a controlled comparison against Penguin.

Penguin uses circular markers and a dotted observed frontier. Labels contain
Harness, model and reported thinking level, with collision avoidance.
Non-frontier observations within the chart range remain accessible on hover/focus.
Run settings, numeric values
and source details are shown on hover/focus, inspired by this
[Artificial Analysis chart](https://x.com/ArtificialAnlys/status/2098504939781906684/photo/1).
Its costs remain recorded job totals, not the reference chart's cost per task.
Official results retain their reported total costs and confidence intervals.

### Penguin experiments collected on 2026-09-09

Six additional TB 2.1 runs come from the runner-provided
[experiment browser](http://vps5.dev.qying.site:8002). Each row links directly to
its Job and preserves the exact model ID, configured Harness version, reasoning
effort, context compression trigger, timeout multiplier, concurrency, run date,
and 89 tasks × 5 attempts. On 2026-09-10 the user confirmed all six runs used
DeepSeek-V4-Flash-0731. This human confirmation is stored separately from the
unchanged Job Config model ID (`deepseek/deepseek-v4-flash`), not presented as
a version disclosed by the archived config. Default 128k compression is a runner
clarification, not an exact token integer recovered from the Job Config.

- Scores are verified successful attempts / 445, not pass@5. The six approximate
  95% confidence intervals were calculated on 2026-10-20 from the archived
  per-task trials, not inferred from an aggregate success rate. Original archive
  records, including null rewards and originally absent intervals, are unchanged.
  Missing rewards count as failures and remain in the denominator; a successful
  reward still counts when an error is also recorded. Average trial durations
  are not fabricated.
- Costs and tokens are recorded totals. Every new run has missing trial costs;
  the cost tooltip and Details show the number of missing entries.
  These amounts are not complete bills. Null cost does not mean a free attempt.
- The chart excludes rows without any reported total cost. At the user's request,
  the earlier Penguin 0.2.2 / 75.2809% observation is no longer included in the
  site's curated dataset. Historical research/archive files are not deleted.
- Table cells omit internal experiment IDs, default-value annotations and partial-cost
  sublabels. Configuration provenance and usage completeness remain in Details.
  Chart labels identify Harness / model / thinking level instead of E01–E06;
  compression and timeout settings remain in the tooltip.
- The dotted Penguin frontier minimizes **recorded** cost and maximizes score among
  the plotted observations. It does not establish true billing efficiency,
  statistical significance, or a fair comparison with Claude Code. Its connecting
  segments are a visual guide, not measured intermediate configurations.
- The chart includes eligible observations within its $0–$1,200 display range
  and their available confidence intervals (reported for official rows, derived
  from archived trials for Penguin). Its Y axis remains fixed at 0–100%;
  its X axis remains zero-based and linear. Official cost totals can cover
  differing numbers of trials.
- Official points use gray squares and thin confidence whiskers; Penguin uses
  blue circles. The overview keeps only key labels, with other configurations
  accessible on hover/focus. Labels avoid points and frontier lines, while
  preferring clear space around confidence whiskers; extreme markers render last
  so that ordinary points cannot cover them.
  The pale upper-left envelope is neither a confidence region nor a claim that
  better results are impossible. A keyboard focus ring is not a frontier marker.
  Hover/focus shows named metrics and available configuration, not unlabelled
  numbers; the card chooses a side that keeps its point visible. Click/Enter opens
  Details, and nearby points resolve by distance rather than hit-box draw order.
- Source JSON, trial summaries and available raw outputs are archived locally in
  the separate `penguin-rawdata` repository. The 2026-09-14 batch contains 2,474
  standard traces; 196 attempts lack traces at source, and 244 native JSONL files
  have malformed final lines. Per-job counts, collection date and manifest SHA-256
  are recorded in `run_config.trace_archive`; Details reports the gaps. Trace
  payloads and private filesystem paths are not embedded in this static site.
  The runner's HTTP Job links are an explicit allowlist
  exception, not a general relaxation for arbitrary HTTP sources.

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
leaderboards, combines their normalized results with the curated rows, and
requires an exact match with the committed snapshot.

### Verified configuration supplements

`data/official_config_evidence.json` binds each supplement to the official row ID,
Benchmark, Harness, model, effort, accuracy and trial count. The 2026-09-10 audit
checked **all 20,170 linked trials across 52 official rows** (22 TB 2.1, 12 TB 3.0,
18 TB 4.0) through Harbor's public read-only metadata endpoints, without downloading
traces. All rows report a global `trial.lock.timeout_multiplier` of 1; the checked
stage-specific multipliers and absolute timeout overrides are unset.

49 rows have one consistently recorded Harness version. Three rows need qualifications:
TB 2.1 GPT-5.6 Terra uses Codex 0.144.0 (299 trials), 0.144.1 (136), and unknown (10);
TB 3.0 Devin has two versions; TB 3.0 Cursor CLI has 363 known and 7 unknown versions.
These rows display mixed/partly unknown versions, with counts and source links in
Details. A submission's requested version is not substituted for mixed runtime
observations. Earlier commit-pinned submissions and review comments remain as
supplemental evidence. Changed/removed observations or mismatched counts fail
validation and require re-auditing; versions are never copied across a whole Harness.

Two GLM-5.3 official rows (TB 3.0 and 4.0) explicitly configure
`CLAUDE_CODE_AUTO_COMPACT_WINDOW=1000000`. This is retained in Details as a raw
window setting, **not** as a verified compaction trigger: the [official parameter
documentation](https://code.claude.com/docs/en/env-vars) distinguishes the window
from the trigger percentage and the model window cap. No additional exact trigger
was verified for the other official/vendor rows in this search.

Vendor absolute time limits (4/5/6 hours, or removed wall-clock limits) appear in
the table and Details, not as inferred multipliers. DeepSeek's `minimal mode` is a `harness_mode`,
not a software version. Neither model context capacity nor `max_tokens` is a
compaction trigger; a recipe from another benchmark or a later release is not
evidence for these runs.

Mythos 5.1's TB 4.0 vendor row is supplemented from Anthropic's System Card §8.6:
Claude Code `--bare`, max effort, 66 tasks × 10 attempts = 660 trials. Its launch
chart's **USD 18 mean cost per task** is stored separately and shown in the table
with its mean-per-task unit and in Details,
not multiplied into a fabricated total or mixed into the total-cost Pareto view.
The cross-model standard-error range is not used as this row's exact CI.

The additional 2026-09-10 vendor audit inspected original chart assets, dynamic
article content, technical reports and selected historical model-card revisions.
One more effort value is supported: GLM-5.2 / Terminus 2 **81.0%** is covered by
the [vendor's maximum-effort declaration](https://raw.githubusercontent.com/zai-org/GLM-5/767691ae11d6d5be20f3ee8c83a2fcb9a434699f/resources/bench_52.png).
It is displayed as `max`, not claimed to be a recovered API argument; the
statement is not applied to its separate Claude Code 82.7% result. Other missing
vendor versions/costs/efforts are still unverified, not proven unpublished.
In particular, a model's recommended API default or another benchmark's price
does not establish the settings or cost of the observation shown here.

The 2026-09-14 follow-up adds GLM-5.3 and GLM-5.3-Flash's **max-effort
reproduction recommendation** to their bilingual protocol notes in Details,
with commit-pinned Model Card links. Their TB 2.1 run-specific effort remains
unconfirmed and is not filled from that recommendation. No new evaluation total
cost was verified. The official snapshot was refreshed from the live API;
its TB 4.0 update timestamp changed, while all result metrics stayed the same.

The 2026-09-17 update adds three separate vendor-reported rows for
[DeepSeek-V4.1-Flash](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash):
90.6% on TB 2.1, 30.0% on TB 3.0, and 31.2% on TB 4.0. The Model Card
explicitly describes DeepSeek Harness Minimal mode, maximum reasoning effort
(`reasoning_effort=100`), and a 1M-token context window for these code-agent
benchmarks. It does not report row-specific cost, token totals, confidence
intervals, compaction triggers, timeout multipliers, or total trial counts;
those fields remain undisclosed. These observations are vendor reports and do
not receive official ranks.

The 2026-09-10 follow-up also checked all 370 Devin config/lock records: no explicit effort
was found, which does not mean "no reasoning." All 17 unknown-version official
Terra/Cursor trials lacked a recorded Agent execution start. Penguin high has
436 reported runtime versions of 0.2.3 and 9 unknown, distinct from its configured
version. The other five Penguin runs were not given a full runtime-version census.
Across the six Penguin runs, all 2,670 summaries, 197 missing-cost results and file
inventories, and one small available structured trajectory yielded no additional
reported fees. Costs remain incomplete; startup failure is not evidence of a zero
bill. This is a bounded source audit, not proof that no other public evidence exists.

Confidence whiskers use the explicit `accuracy_ci95_half_width` field. There is
no automatic standard-error-to-CI fallback for official or vendor rows.
All 52 official rows in the snapshot
checked on 2026-09-10 provide that field, so the audit does not alter their
existing intervals. ± values are percentage points. Missing intervals stay absent.
Offline checks validate structure, observation binding and generated consistency;
they do not automatically read vendor pages or authenticate every source claim.

### Derived Penguin confidence intervals

`data/penguin_confidence_intervals.json` separately records the six derived
intervals, the source archive SHA-256, calculation date, missing-reward policy,
and each run's histogram of task success counts (0–5). It contains no raw trial
payloads or private filesystem paths. `scripts/penguin_confidence.py` reproduces
these aggregates from the unchanged archive:

```bash
python3 scripts/penguin_confidence.py --archive /path/to/证据快照.json --check
```

The [Terminal-Bench per-task implementation](https://github.com/harbor-framework/terminal-bench/blob/main/leaderboard/src/leaderboard/core/metrics.py)
was checked on 2026-10-20. For N = 89 tasks, k = 5 attempts and per-task rate p_i,
SE = 100 × sqrt(sum(p_i × (1 − p_i) / (k − 1)) / N²); the approximate 95% half-width
is 1.96 × SE. Both values are in percentage points. This is not pass@5 or a
pooled binomial estimate. Calculations keep full precision; display rounds to one
decimal place, without changing any existing accuracy.

Both full and curated-only imports bind evidence by experiment ID plus job,
configuration, task/trial counts and successes, verify the histogram calculation,
and preserve `accuracy_ci95_provenance`. Missing or mismatched evidence fails
validation instead of silently attaching an interval to a different result.
Unknown future runs receive no derived interval. Table, Pareto and exports use
the same half-width. Interval hints and bilingual Details distinguish derived
Penguin intervals from source-reported intervals; they are not official certification.

These intervals concern the average success rate on the **fixed 89 tasks**.
With only five attempts per task the normal approximation has limitations:
0/5 and 5/5 tasks contribute zero estimated variance, not proof of no uncertainty.
The intervals do not cover a new task set, model revision or systematic environment
change, predict where the next run will fall, or establish significant differences
between configurations.

### All configurations versus the official default view

The official website defaults to `efforts=best`: for each Model × Harness pair,
it keeps the highest-scoring thinking-level configuration and recalculates ranks.
Its API also returns the other configurations. This site keeps them to support
thinking-level comparisons, so its counts can exceed the official default view.
The `tbench.ai` link in each result's Details opens the matching `efforts=all` view:

- [Terminal-Bench 2.1 — all configurations](https://www.tbench.ai/?version=2.1&efforts=all)
- [Terminal-Bench 3.0 — all configurations](https://www.tbench.ai/?version=3.0&efforts=all)
- [Terminal-Bench 4.0 — all configurations](https://www.tbench.ai/?version=4.0&efforts=all)

The default source filter is **All sources**. Both languages use the same concise
source names in filters, the table, and exports: **Terminal-Bench** (official
leaderboard), **Vendor** (vendor-reported), and **Penguin** (Penguin runs).
The dedicated source column uses plain body-sized text, without badge borders,
backgrounds, or extra padding. Details retains the upstream **Official rank (all efforts)**;
the table's row numbers only indicate display order, not official ranks or
evidence of a controlled comparison across protocols.

## Repository layout

    site/                         Static GitHub Pages site
    site/data/benchmarks.json    Generated public snapshot
    data/curated_results.json    Vendor and Penguin results with primary sources
    data/official_config_evidence.json
                                  Observation-bound official configuration evidence
    scripts/import_terminal_bench.py
                                  Refresh snapshot from tbench.ai
    scripts/verify_site.py       Verify schema, ranks, metrics, and live parity
    scripts/test_config_evidence.py
                                  Offline evidence and no-inference regressions
    .github/workflows/pages.yml  Validate and deploy GitHub Pages

## Local preview

From this repository:

    python3 -m http.server 8765 --directory site

Then open:

- http://localhost:8765/?version=2.1

Opening `site/index.html` directly is not supported because browsers block the
JSON request from local files.

## Refresh and verify

    python3 scripts/import_terminal_bench.py
    python3 scripts/verify_site.py
    python3 scripts/verify_site.py --check-live
    python3 -m unittest discover -s scripts -p 'test_*.py'
    node --check site/script.js
    node --check site/export.js

For browser checks of internal scrolling, sticky headers, external controls,
light/dark styling and narrow viewports (requires Selenium, Chromium and
chromedriver), start the local server above, then run:

    python3 scripts/check_table_scroll.py --url http://127.0.0.1:8765/
    python3 scripts/check_result_actions.py --url http://127.0.0.1:8765/

To update curated records and configuration supplements while retaining official
scores, costs, intervals and upstream snapshot dates:

    python3 scripts/import_terminal_bench.py --curated-only
    python3 scripts/verify_site.py

Each new curated row may carry its own `verified_at`, shown in its Details.
The payload also retains the most recent manual check date; this does not mean
every older source was reverified that day.

Always review the generated JSON diff before committing. The GitHub Actions
workflow repeats the live parity and frontend syntax checks on pull requests and
before a push to `main` is deployed.

## Data policy

- Source type is a strict enum: `benchmark_official`, `vendor_reported`, or
  `penguin_run`.
- Official rows are returned with `status=display` by tbench.ai and retain
  their all-efforts API rank in the data and Details. Main-table row numbers
  follow the current display order and remain distinct from official ranks.
- Vendor rows require a primary page controlled by the model vendor. Secondary
  articles and aggregation sites are not accepted as evidence.
- When the same model already has a result on the official leaderboard for that
  Benchmark version, the official row takes precedence and the vendor-reported
  duplicate is omitted from the public data.
- Missing Harness, reasoning effort, or metrics remain undisclosed rather than guessed.
- Detailed metric groups only render fields present in the selected source;
  the fixed summary explicitly labels missing effort or release date as
  undisclosed. No missing value is filled with an inference.
- Benchmark versions never share scores or ranks.
- Official dates retain the Release Date semantics: TB 3.0 uses its
  `release_date`; other views use the official `date` field. These are model
  release dates, not evaluation run dates. The snapshot timestamp is retained
  in the data and on the official snapshot link's tooltip in Details.
  A vendor page publication date is stored separately
  as `published_at`, not copied into Release Date.
- Penguin results retain their own evaluation protocols and evidence status.
  The earlier public report has two scoreable attempts per TB 2.1 task; the six
  new Job records have five attempts per task and incomplete usage reporting.
  These are separate observations, not replacement scores for the earlier run.

The layout began with visual inspiration from
[RAG Bench Essential](https://prism-shadow.github.io/rag-bench-essential/).
See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for its retained MIT notice.

## Deployment

Pull requests validate the static snapshot against the live official API.
Pushes to `main` run the same checks and deploy `site/` through GitHub Pages.
Feature branches do not deploy.
