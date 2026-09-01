"use strict";

const page = {
  benchSwitcher: document.querySelector(".bench-switcher"),
  benchDescription: document.querySelector(".current-bench-description"),
  sourceLink: document.querySelector(".benchmark-source-link"),
  statTasks: document.querySelector(".stat-tasks"),
  statSubmissions: document.querySelector(".stat-submissions"),
  statModels: document.querySelector(".stat-models"),
  statBest: document.querySelector(".stat-best"),
  statBestLabel: document.querySelector(".stat-best-label"),
  resultsTitle: document.querySelector(".results-title"),
  resultsDescription: document.querySelector(".results-description"),
  search: document.querySelector(".result-search"),
  harnessFilter: document.querySelector(".harness-filter"),
  thinkingFilter: document.querySelector(".thinking-filter"),
  bestOnly: document.querySelector(".best-only-filter"),
  resultCount: document.querySelector(".result-count"),
  tableHead: document.querySelector(".results-head"),
  tableBody: document.querySelector(".results-body"),
  scoreNote: document.querySelector(".score-note"),
  submissionNote: document.querySelector(".submission-note"),
  localeToggle: document.querySelector(".locale-toggle"),
  localeLabel: document.querySelector(".locale-label"),
  localeMenu: document.querySelector(".locale-menu"),
  localeSystemLabel: document.querySelector(".locale-system-label"),
  themeToggle: document.querySelector(".theme-toggle"),
  themeIcon: document.querySelector(".theme-icon"),
  dialog: document.querySelector(".details-dialog"),
  dialogTitle: document.querySelector("#details-dialog-title"),
  dialogBody: document.querySelector(".dialog-body"),
  dialogClose: document.querySelector(".dialog-close")
};

const copy = {
  en: {
    skipToResults: "Skip to results",
    selectBenchmark: "Select benchmark",
    heroTitle: "Compare the whole setup,<br /><span>not just the model.</span>",
    viewResults: "View results",
    viewSource: "View source",
    tasks: "Tasks",
    tasksDescription: "Tasks in the selected benchmark.",
    submissions: "Submissions",
    submissionsDescription: "Merged, auditable result configurations.",
    models: "Models",
    modelsDescription: "Unique model names in published results.",
    bestAccuracy: "Best Accuracy",
    resultsEyebrow: "Official results",
    searchLabel: "Search results",
    searchPlaceholder: "Search harness or model…",
    bestOnly: "Best per model",
    tableHelp: "Sort with column headers · open Details for the full configuration",
    tableHint: "Swipe to view the full table →",
    loadingResults: "Loading published results…",
    scoreProtocol: "Score protocol",
    submissionProtocol: "Submission protocol",
    methodologyEyebrow: "How to read the table",
    methodologyTitle: "Configuration is part of the result.",
    methodologyDescription: "Harness, model, thinking level, and run policy can all change the score.",
    harnessTitle: "Harness",
    harnessDescription: "The agent runtime and exact version that operated the terminal.",
    thinkingTitle: "Thinking Level",
    thinkingDescription: "Reasoning effort such as high, xhigh, or max is shown explicitly.",
    detailsTitle: "Run details",
    detailsDescription: "Trials, pass@k, cost, tokens, duration, review adjustments, and source evidence.",
    footerText: "Auditable model × harness benchmark results",
    configurationEyebrow: "Submission configuration",
    allHarnesses: "All harnesses",
    allThinking: "All thinking levels",
    resultSingular: "result",
    resultPlural: "results",
    noResults: "No results match the current filters.",
    loadError: "Could not load the leaderboard data. Serve the site over HTTP and try again.",
    rank: "Rank",
    model: "Model",
    thinkingLevel: "Thinking Level",
    accuracy: "Accuracy",
    runConfig: "Run config",
    source: "Source",
    details: "Details",
    version: "version",
    official: "Official",
    trials: "trials",
    minRuns: "minimum runs per task",
    rewardHacks: "reward hacks",
    disqualified: "disqualified",
    submissionDate: "Submission date",
    scoreAndTrials: "Score and trials",
    resources: "Resources",
    reviewAndEvidence: "Review and evidence",
    standardError: "Standard error",
    minimumTrials: "Minimum trials / task",
    totalTrials: "Total trials",
    totalTokens: "Total tokens",
    uncachedInput: "Uncached input",
    cachedInput: "Cached input",
    outputTokens: "Output",
    totalCost: "Total cost",
    averageDuration: "Average trial duration",
    disqualifiedTrials: "Disqualified trials",
    sourceFile: "Source file",
    sourceSnapshot: "Source snapshot",
    pullRequest: "Official pull request",
    harborJob: "Harbor job",
    harborJobs: "Harbor jobs",
    close: "Close",
    unavailable: "Coming soon",
    followSystem: "Follow system",
    light: "Light",
    dark: "Dark",
    systemTheme: "System theme"
  },
  zh: {
    skipToResults: "跳到榜单",
    selectBenchmark: "选择 Benchmark",
    heroTitle: "比较完整配置，<br /><span>不只比较模型。</span>",
    viewResults: "查看榜单",
    viewSource: "查看数据源",
    tasks: "任务数",
    tasksDescription: "当前 Benchmark 包含的任务。",
    submissions: "提交数",
    submissionsDescription: "已合并、可核验的结果配置。",
    models: "模型数",
    modelsDescription: "公开结果中的不同模型。",
    bestAccuracy: "最高 Accuracy",
    resultsEyebrow: "官方结果",
    searchLabel: "搜索结果",
    searchPlaceholder: "搜索 Harness 或模型…",
    bestOnly: "每个模型仅看最佳",
    tableHelp: "点击表头排序 · 点击详情查看完整配置",
    tableHint: "左右滑动查看完整表格 →",
    loadingResults: "正在加载公开结果…",
    scoreProtocol: "计分说明",
    submissionProtocol: "提交规范",
    methodologyEyebrow: "如何阅读榜单",
    methodologyTitle: "配置本身也是结果的一部分。",
    methodologyDescription: "Harness、模型、Thinking Level 和运行策略都可能改变分数。",
    harnessTitle: "Harness",
    harnessDescription: "执行终端任务的 Agent Runtime 及其准确版本。",
    thinkingTitle: "Thinking Level",
    thinkingDescription: "明确展示 high、xhigh、max 等推理强度。",
    detailsTitle: "运行详情",
    detailsDescription: "展示 trials、pass@k、成本、Token、耗时、审核调整和来源证据。",
    footerText: "可核验的模型 × Harness Benchmark 结果",
    configurationEyebrow: "Submission 配置",
    allHarnesses: "全部 Harness",
    allThinking: "全部 Thinking Level",
    resultSingular: "条结果",
    resultPlural: "条结果",
    noResults: "没有符合当前筛选条件的结果。",
    loadError: "无法加载榜单数据。请通过 HTTP 启动网站后重试。",
    rank: "排名",
    model: "模型",
    thinkingLevel: "Thinking Level",
    accuracy: "Accuracy",
    runConfig: "运行配置",
    source: "来源",
    details: "详情",
    version: "版本",
    official: "官方",
    trials: "次 trials",
    minRuns: "每任务最少运行次数",
    rewardHacks: "reward hacks",
    disqualified: "次取消资格",
    submissionDate: "提交日期",
    scoreAndTrials: "分数与 Trials",
    resources: "资源消耗",
    reviewAndEvidence: "审核与来源证据",
    standardError: "标准误",
    minimumTrials: "每任务最少 Trials",
    totalTrials: "总 Trials",
    totalTokens: "总 Tokens",
    uncachedInput: "未缓存输入",
    cachedInput: "缓存输入",
    outputTokens: "输出",
    totalCost: "总成本",
    averageDuration: "平均单次耗时",
    disqualifiedTrials: "取消资格 Trials",
    sourceFile: "来源文件",
    sourceSnapshot: "数据快照",
    pullRequest: "官方 Pull Request",
    harborJob: "Harbor 任务",
    harborJobs: "Harbor 任务",
    close: "关闭",
    unavailable: "即将支持",
    followSystem: "跟随系统",
    light: "浅色",
    dark: "深色",
    systemTheme: "跟随系统"
  }
};

const state = {
  data: null,
  benchmarkId: null,
  query: "",
  harness: "",
  thinking: "",
  bestOnly: false,
  sortKey: "accuracy_rank",
  sortDirection: "asc",
  locale: document.documentElement.dataset.locale || "en"
};

function t(key) {
  return copy[state.locale][key] || copy.en[key] || key;
}

function localized(value) {
  if (!value || typeof value !== "object") return value || "";
  return value[state.locale] || value.en || Object.values(value)[0] || "";
}

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatNumber(value) {
  if (value == null) return "—";
  return new Intl.NumberFormat(state.locale === "zh" ? "zh-CN" : "en-US").format(value);
}

function formatMoney(value) {
  if (value == null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2
  }).format(value);
}

function formatDuration(seconds) {
  if (seconds == null) return "—";
  const minutes = Math.floor(seconds / 60);
  const rest = Math.round(seconds % 60);
  return minutes + "m " + String(rest).padStart(2, "0") + "s";
}

function activeBenchmark() {
  if (!state.data) return null;
  return state.data.benchmarks.find(function (bench) {
    return bench.id === state.benchmarkId;
  }) || null;
}

function applyTranslations() {
  document.documentElement.lang = state.locale === "zh" ? "zh-CN" : "en";
  document.documentElement.dataset.locale = state.locale;

  document.querySelectorAll("[data-i18n]").forEach(function (element) {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-html]").forEach(function (element) {
    element.innerHTML = t(element.dataset.i18nHtml);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(function (element) {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });

  page.localeSystemLabel.textContent = t("followSystem");
  const preference = document.documentElement.dataset.localePref || "system";
  page.localeLabel.textContent = preference === "system"
    ? t("followSystem")
    : (preference === "zh" ? "中文" : "English");
  page.dialogClose.setAttribute("aria-label", t("close"));
}

function renderBenchmarkTabs() {
  page.benchSwitcher.innerHTML = state.data.benchmarks.map(function (bench) {
    const available = bench.status === "available";
    const active = bench.id === state.benchmarkId;
    const label = available ? (bench.short_name || bench.name) : bench.name;
    return [
      '<button type="button" role="tab"',
      ' class="bench-tab',
      active ? " is-active" : "",
      '" data-benchmark="', escapeHtml(bench.id), '"',
      ' aria-selected="', active ? "true" : "false", '"',
      available ? "" : " disabled",
      ">",
      escapeHtml(label),
      available ? "" : '<span class="bench-status">' + escapeHtml(t("unavailable")) + "</span>",
      "</button>"
    ].join("");
  }).join("");

  page.benchSwitcher.querySelectorAll("[data-benchmark]").forEach(function (button) {
    button.addEventListener("click", function () {
      state.benchmarkId = button.dataset.benchmark;
      state.query = "";
      state.harness = "";
      state.thinking = "";
      state.bestOnly = false;
      page.search.value = "";
      page.bestOnly.checked = false;
      render();
    });
  });
}

function renderSummary(bench) {
  page.benchDescription.textContent = localized(bench.description);
  page.sourceLink.href = bench.repository_url;
  page.statTasks.textContent = formatNumber(bench.task_count);
  page.statSubmissions.textContent = formatNumber(bench.submission_count);
  page.statModels.textContent = formatNumber(bench.model_count);
  page.statBest.textContent = Number(bench.best_accuracy).toFixed(2) + "%";
  page.statBestLabel.textContent = bench.best_result_label;
  page.resultsTitle.textContent = bench.name + " Leaderboard";
  page.resultsDescription.textContent = localized(bench.description);
  page.scoreNote.textContent = localized(bench.score_note);
  page.submissionNote.textContent = localized(bench.protocol_note);
}

function renderFilterOptions(bench) {
  const harnesses = Array.from(new Set(bench.results.map(function (row) {
    return row.harness;
  }))).sort();
  const thinkingLevels = Array.from(new Set(bench.results.map(function (row) {
    return row.thinking_level || "none";
  }))).sort();

  page.harnessFilter.innerHTML = '<option value="">' + escapeHtml(t("allHarnesses")) + "</option>" +
    harnesses.map(function (name) {
      return '<option value="' + escapeHtml(name) + '">' + escapeHtml(name) + "</option>";
    }).join("");
  page.thinkingFilter.innerHTML = '<option value="">' + escapeHtml(t("allThinking")) + "</option>" +
    thinkingLevels.map(function (level) {
      return '<option value="' + escapeHtml(level) + '">' + escapeHtml(level) + "</option>";
    }).join("");

  page.harnessFilter.value = state.harness;
  page.thinkingFilter.value = state.thinking;
}

const columns = [
  { key: "accuracy_rank", label: "rank", className: "rank-column", numeric: true },
  { key: "harness", label: "harnessTitle", className: "harness-column" },
  { key: "model", label: "model", className: "model-column" },
  { key: "thinking_level", label: "thinkingLevel", className: "thinking-column" },
  { key: "accuracy", label: "accuracy", className: "accuracy-column", numeric: true },
  { key: "trial_count", label: "runConfig", className: "config-column" },
  { key: "source_tier", label: "source", className: "source-column" }
];

function renderTableHead() {
  page.tableHead.innerHTML = "<tr>" + columns.map(function (column) {
    const active = column.key === state.sortKey;
    const arrow = active ? (state.sortDirection === "asc" ? "↑" : "↓") : "↕";
    return [
      '<th scope="col" aria-sort="',
      active ? (state.sortDirection === "asc" ? "ascending" : "descending") : "none",
      '" class="sortable ', column.className,
      column.numeric ? " numeric" : "",
      active ? " is-active" : "",
      '"><button type="button" data-sort="', column.key,
      '" aria-label="', escapeHtml(t(column.label)), '">',
      "<span>", escapeHtml(t(column.label)), '</span><span class="sort-arrow" aria-hidden="true">',
      arrow, "</span></button></th>"
    ].join("");
  }).join("") + '<th scope="col">' + escapeHtml(t("details")) + "</th></tr>";

  page.tableHead.querySelectorAll("[data-sort]").forEach(function (button) {
    button.addEventListener("click", function () {
      const nextKey = button.dataset.sort;
      if (state.sortKey === nextKey) {
        state.sortDirection = state.sortDirection === "asc" ? "desc" : "asc";
      } else {
        state.sortKey = nextKey;
        state.sortDirection = nextKey === "accuracy" ? "desc" : "asc";
      }
      renderTable();
    });
  });
}

function filteredResults(bench) {
  const query = state.query.trim().toLowerCase();
  const filtered = bench.results.filter(function (row) {
    const searchable = [
      row.harness,
      row.harness_version,
      row.harness_org,
      row.model,
      row.model_id,
      row.model_org,
      row.thinking_level
    ].join(" ").toLowerCase();
    return (!query || searchable.includes(query)) &&
      (!state.harness || row.harness === state.harness) &&
      (!state.thinking || (row.thinking_level || "none") === state.thinking) &&
      (!state.bestOnly || row.best_for_model);
  });

  return filtered.sort(function (left, right) {
    let a = left[state.sortKey];
    let b = right[state.sortKey];
    if (typeof a === "string") a = a.toLowerCase();
    if (typeof b === "string") b = b.toLowerCase();
    if (a == null) return 1;
    if (b == null) return -1;
    if (a < b) return state.sortDirection === "asc" ? -1 : 1;
    if (a > b) return state.sortDirection === "asc" ? 1 : -1;
    return left.accuracy_rank - right.accuracy_rank;
  });
}

function accuracyCell(row) {
  return [
    '<div class="accuracy-measure"><div class="accuracy-value"><strong>',
    row.accuracy.toFixed(2), '%</strong><small>± ', row.accuracy_stderr.toFixed(2),
    '%</small></div><div class="accuracy-track"><span class="accuracy-fill" style="--accuracy:',
    Math.min(row.accuracy, 100), '%"></span></div></div>'
  ].join("");
}

function configCell(row) {
  const reviewClass = row.disqualified_trials > 0 ? " config-danger" :
    (row.reward_hacks > 0 ? " config-warning" : "");
  return [
    '<div class="config-summary"><strong>k ≥ ', row.minimum_trials_per_task,
    " · ", formatNumber(row.trial_count), " ", escapeHtml(t("trials")), "</strong>",
    "<span>", formatDuration(row.average_trial_duration_seconds), " avg · ",
    formatMoney(row.total_cost_usd), "</span>",
    '<span class="', reviewClass.trim(), '">',
    row.reward_hacks.toFixed(2), "% ", escapeHtml(t("rewardHacks")),
    row.disqualified_trials ? " · " + row.disqualified_trials + " " + escapeHtml(t("disqualified")) : "",
    "</span></div>"
  ].join("");
}

function renderTable() {
  const bench = activeBenchmark();
  if (!bench) return;
  renderTableHead();
  const results = filteredResults(bench);
  page.resultCount.textContent = formatNumber(results.length) + " " +
    (results.length === 1 ? t("resultSingular") : t("resultPlural"));

  if (!results.length) {
    page.tableBody.innerHTML = '<tr><td class="loading-cell" colspan="8">' +
      escapeHtml(t("noResults")) + "</td></tr>";
    return;
  }

  page.tableBody.innerHTML = results.map(function (row) {
    return [
      '<tr data-result-id="', escapeHtml(row.id), '">',
      '<td class="rank-cell"><span class="rank-badge rank-', row.accuracy_rank, '">#',
      row.accuracy_rank, "</span></td>",
      '<td><span class="primary-cell">', escapeHtml(row.harness),
      '</span><span class="secondary-cell">v', escapeHtml(row.harness_version), " · ",
      escapeHtml(row.harness_org), "</span></td>",
      '<td><span class="primary-cell">', escapeHtml(row.model),
      '</span><span class="secondary-cell">', escapeHtml(row.model_org), "</span></td>",
      '<td><span class="thinking-pill">', escapeHtml(row.thinking_level || "none"), "</span></td>",
      "<td>", accuracyCell(row), "</td>",
      "<td>", configCell(row), "</td>",
      '<td class="source-column"><a class="source-pill" href="', escapeHtml(row.source_pr),
      '" target="_blank" rel="noreferrer">', escapeHtml(t("official")), " ↗</a></td>",
      '<td><button class="details-button" type="button" data-details="',
      escapeHtml(row.id), '">', escapeHtml(t("details")), "</button></td></tr>"
    ].join("");
  }).join("");

  page.tableBody.querySelectorAll("[data-details]").forEach(function (button) {
    button.addEventListener("click", function () {
      const row = bench.results.find(function (item) {
        return item.id === button.dataset.details;
      });
      if (row) openDetails(row, bench);
    });
  });
}

function detailItem(label, value) {
  return "<div><dt>" + escapeHtml(label) + "</dt><dd>" + escapeHtml(value) + "</dd></div>";
}

function detailGroup(title, items, wide) {
  return '<section class="detail-group' + (wide ? " wide" : "") + '"><h3>' +
    escapeHtml(title) + '</h3><dl class="detail-list">' + items.join("") + "</dl></section>";
}

function openDetails(row, bench) {
  page.dialogTitle.textContent = row.model + " × " + row.harness;
  const passItems = [
    detailItem(t("accuracy"), row.accuracy.toFixed(2) + "%"),
    detailItem(t("standardError"), "± " + row.accuracy_stderr.toFixed(2) + "%"),
    detailItem("pass@2", row.pass_at_2.toFixed(2) + "%"),
    detailItem("pass@3", row.pass_at_3.toFixed(2) + "%"),
    detailItem("pass@4", row.pass_at_4.toFixed(2) + "%"),
    detailItem("pass@5", row.pass_at_5.toFixed(2) + "%"),
    detailItem(t("minimumTrials"), String(row.minimum_trials_per_task)),
    detailItem(t("totalTrials"), formatNumber(row.trial_count))
  ];
  const resourceItems = [
    detailItem(t("totalTokens"), formatNumber(row.total_tokens)),
    detailItem(t("uncachedInput"), formatNumber(row.uncached_input_tokens)),
    detailItem(t("cachedInput"), formatNumber(row.cached_input_tokens)),
    detailItem(t("outputTokens"), formatNumber(row.output_tokens)),
    detailItem(t("totalCost"), formatMoney(row.total_cost_usd)),
    detailItem(t("averageDuration"), formatDuration(row.average_trial_duration_seconds))
  ];
  const reviewItems = [
    detailItem(t("submissionDate"), row.date),
    detailItem(t("rewardHacks"), row.reward_hacks.toFixed(2) + "%"),
    detailItem(t("disqualifiedTrials"), formatNumber(row.disqualified_trials)),
    detailItem(t("sourceFile"), row.source_file),
    detailItem(t("sourceSnapshot"), bench.snapshot_commit)
  ];
  const links = [
    '<a class="detail-link" href="' + escapeHtml(row.source_pr) +
      '" target="_blank" rel="noreferrer">' + escapeHtml(t("pullRequest")) + " ↗</a>"
  ].concat(row.source_jobs.map(function (url, index) {
    const label = row.source_jobs.length === 1 ? t("harborJob") : t("harborJobs") + " " + (index + 1);
    return '<a class="detail-link" href="' + escapeHtml(url) +
      '" target="_blank" rel="noreferrer">' + escapeHtml(label) + " ↗</a>";
  }));

  page.dialogBody.innerHTML = [
    '<p class="detail-intro">', escapeHtml(row.harness), " v", escapeHtml(row.harness_version),
    " · ", escapeHtml(row.model_id), " · ", escapeHtml(t("thinkingLevel")), ": ",
    escapeHtml(row.thinking_level || "none"), "</p>",
    '<div class="detail-grid">',
    detailGroup(t("scoreAndTrials"), passItems, false),
    detailGroup(t("resources"), resourceItems, false),
    detailGroup(t("reviewAndEvidence"), reviewItems, true),
    '<section class="detail-group wide"><h3>', escapeHtml(t("source")),
    '</h3><div class="detail-links">', links.join(""), "</div></section></div>"
  ].join("");
  page.dialog.showModal();
}

function render() {
  const bench = activeBenchmark();
  applyTranslations();
  renderBenchmarkTabs();
  updateLocaleMenu();
  updateThemeButton();
  if (!bench) return;
  renderSummary(bench);
  renderFilterOptions(bench);
  renderTable();
}

function resolveSystemLocale() {
  return navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
}

function updateLocaleMenu() {
  const preference = document.documentElement.dataset.localePref || "system";
  page.localeMenu.querySelectorAll("[data-locale-pref]").forEach(function (button) {
    button.setAttribute("aria-checked", String(button.dataset.localePref === preference));
  });
}

function setLocalePreference(preference) {
  localStorage.setItem("penguin-leaderboard.locale", preference);
  document.documentElement.dataset.localePref = preference;
  state.locale = preference === "system" ? resolveSystemLocale() : preference;
  page.localeMenu.hidden = true;
  page.localeToggle.setAttribute("aria-expanded", "false");
  render();
}

function resolvedTheme(mode) {
  if (mode !== "system") return mode;
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function updateThemeButton() {
  const mode = document.documentElement.dataset.themeMode || "system";
  const theme = resolvedTheme(mode);
  page.themeIcon.textContent = theme === "dark" ? "☾" : "☀";
  page.themeToggle.title = mode === "system" ? t("systemTheme") :
    (mode === "dark" ? t("dark") : t("light"));
  page.themeToggle.setAttribute("aria-label", page.themeToggle.title);
}

function cycleTheme() {
  const mode = document.documentElement.dataset.themeMode || "system";
  const next = mode === "system" ? "light" : (mode === "light" ? "dark" : "system");
  localStorage.setItem("penguin-leaderboard.theme", next);
  document.documentElement.dataset.themeMode = next;
  document.documentElement.dataset.theme = resolvedTheme(next);
  updateThemeButton();
}

page.search.addEventListener("input", function () {
  state.query = page.search.value;
  renderTable();
});
page.harnessFilter.addEventListener("change", function () {
  state.harness = page.harnessFilter.value;
  renderTable();
});
page.thinkingFilter.addEventListener("change", function () {
  state.thinking = page.thinkingFilter.value;
  renderTable();
});
page.bestOnly.addEventListener("change", function () {
  state.bestOnly = page.bestOnly.checked;
  renderTable();
});

page.localeToggle.addEventListener("click", function () {
  const willOpen = page.localeMenu.hidden;
  page.localeMenu.hidden = !willOpen;
  page.localeToggle.setAttribute("aria-expanded", String(willOpen));
});
page.localeMenu.querySelectorAll("[data-locale-pref]").forEach(function (button) {
  button.addEventListener("click", function () {
    setLocalePreference(button.dataset.localePref);
  });
});
document.addEventListener("click", function (event) {
  if (!event.target.closest(".locale-control")) {
    page.localeMenu.hidden = true;
    page.localeToggle.setAttribute("aria-expanded", "false");
  }
});

page.themeToggle.addEventListener("click", cycleTheme);
page.dialogClose.addEventListener("click", function () {
  page.dialog.close();
});
page.dialog.addEventListener("click", function (event) {
  if (event.target === page.dialog) page.dialog.close();
});

matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
  if (document.documentElement.dataset.themeMode === "system") {
    document.documentElement.dataset.theme = resolvedTheme("system");
    updateThemeButton();
  }
});

fetch("data/benchmarks.json")
  .then(function (response) {
    if (!response.ok) throw new Error("HTTP " + response.status);
    return response.json();
  })
  .then(function (data) {
    state.data = data;
    state.benchmarkId = data.default_benchmark;
    render();
  })
  .catch(function (error) {
    console.error(error);
    applyTranslations();
    page.tableBody.innerHTML = '<tr><td class="loading-cell" colspan="8">' +
      escapeHtml(t("loadError")) + "</td></tr>";
    page.resultCount.textContent = t("loadError");
  });
