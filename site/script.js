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
  sourceFilter: document.querySelector(".source-filter"),
  bestOnly: document.querySelector(".best-only-filter"),
  resultCount: document.querySelector(".result-count"),
  tableHead: document.querySelector(".results-head"),
  tableBody: document.querySelector(".results-body"),
  tableCaption: document.querySelector(".table-caption"),
  scoreNote: document.querySelector(".score-note"),
  submissionNote: document.querySelector(".submission-note"),
  localeSelect: document.querySelector(".locale-select"),
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
    home: "Penguin Harness Leaderboard home",
    siteControls: "Site controls",
    language: "Language",
    benchmarkSwitcher: "Benchmark selector",
    benchmarkSummary: "Benchmark summary",
    tableCaption: "Published model and harness results",
    harnessFilter: "Filter by harness",
    thinkingFilter: "Filter by thinking level",
    sourceFilter: "Filter by source type",
    selectBenchmark: "Select benchmark",
    heroTitle: "Compare the whole setup,<br /><span>not just the model.</span>",
    viewResults: "View results",
    viewSource: "View source",
    tasks: "Tasks",
    tasksDescription: "Tasks in the selected benchmark.",
    submissions: "Public results",
    submissionsDescription: "Auditable configurations across source types.",
    models: "Models",
    modelsDescription: "Unique model names in published results.",
    bestAccuracy: "Official best",
    resultsEyebrow: "Public results",
    searchLabel: "Search results",
    searchPlaceholder: "Search harness or model…",
    bestOnly: "Best per model",
    tableHelp: "Only benchmark-official rows receive an official rank · open Details for evidence and configuration",
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
    detailsTitle: "Runs and review",
    detailsDescription: "Run settings are shown only when the cited source reports them; missing fields remain explicitly undisclosed.",
    footerText: "Auditable model × harness benchmark results",
    configurationEyebrow: "Submission configuration",
    allHarnesses: "All harnesses",
    allThinking: "All thinking levels",
    allSources: "All sources",
    benchmarkOfficial: "Benchmark official",
    vendorReported: "Vendor reported",
    resultSingular: "result",
    resultPlural: "results",
    noResults: "No results match the current filters.",
    loadError: "Could not load the leaderboard data. Serve the site over HTTP and try again.",
    rank: "Rank",
    model: "Model",
    thinkingLevel: "Thinking Level",
    accuracy: "Accuracy",
    runConfig: "Run config",
    sourceReported: "Source-reported",
    source: "Source",
    details: "Details",
    trials: "trials",
    averageShort: "Avg.",
    rewardHacks: "Reward-hack rate",
    configuration: "Configuration",
    scoreAndTrials: "Score and trials",
    resources: "Resources",
    reviewAndEvidence: "Review and evidence",
    standardError: "Standard error",
    harnessVersion: "Harness version",
    modelId: "Model ID",
    sandbox: "Sandbox",
    notReported: "Not reported",
    notOfficiallyRanked: "Not in official ranking",
    minimumTrials: "Minimum trials / task",
    totalTrials: "Total trials",
    totalTokens: "Total tokens",
    uncachedInput: "Uncached input",
    cachedInput: "Cached input",
    outputTokens: "Output",
    totalCost: "Total cost",
    averageDuration: "Average trial duration",
    disqualifiedTrials: "Trials scored zero after review",
    sourceFile: "Source file",
    sourceSnapshot: "Source snapshot",
    primarySource: "Primary source",
    sourceType: "Source type",
    publisher: "Publisher",
    publishedAt: "Published",
    sourcesChecked: "Sources checked",
    protocolDetails: "Reported configuration",
    harborJob: "Harbor job",
    harborJobs: "Harbor jobs",
    close: "Close",
    followSystem: "Follow system",
    light: "Light",
    dark: "Dark",
    systemTheme: "System theme"
  },
  zh: {
    skipToResults: "跳到榜单",
    home: "Penguin Harness Leaderboard 首页",
    siteControls: "网站控制",
    language: "语言",
    benchmarkSwitcher: "Benchmark 选择器",
    benchmarkSummary: "Benchmark 摘要",
    tableCaption: "公开的模型与 Harness 结果",
    harnessFilter: "按 Harness 筛选",
    thinkingFilter: "按 Thinking Level 筛选",
    sourceFilter: "按来源类型筛选",
    selectBenchmark: "选择 Benchmark",
    heroTitle: "比较完整配置，<br /><span>不只比较模型。</span>",
    viewResults: "查看榜单",
    viewSource: "查看数据源",
    tasks: "任务数",
    tasksDescription: "当前 Benchmark 包含的任务。",
    submissions: "公开结果数",
    submissionsDescription: "不同来源类别中可核验的结果配置。",
    models: "模型数",
    modelsDescription: "公开结果中的不同模型。",
    bestAccuracy: "官方最高分",
    resultsEyebrow: "公开结果",
    searchLabel: "搜索结果",
    searchPlaceholder: "搜索 Harness 或模型…",
    bestOnly: "每个模型仅看最佳",
    tableHelp: "只有 Benchmark 官方结果拥有正式排名 · 来源证据与详细配置见详情",
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
    detailsTitle: "评测次数与审核",
    detailsDescription: "只展示引用来源明确披露的运行配置；未披露字段会明确保留为空。",
    footerText: "可核验的模型 × Harness Benchmark 结果",
    configurationEyebrow: "Submission 配置",
    allHarnesses: "全部 Harness",
    allThinking: "全部 Thinking Level",
    allSources: "全部来源",
    benchmarkOfficial: "Benchmark 官方",
    vendorReported: "厂商自报",
    resultSingular: "条结果",
    resultPlural: "条结果",
    noResults: "没有符合当前筛选条件的结果。",
    loadError: "无法加载榜单数据。请通过 HTTP 启动网站后重试。",
    rank: "排名",
    model: "模型",
    thinkingLevel: "Thinking Level",
    accuracy: "Accuracy",
    runConfig: "运行配置",
    sourceReported: "来源已披露",
    source: "来源",
    details: "详情",
    trials: "次评测",
    averageShort: "平均",
    rewardHacks: "Reward-hack 比例",
    configuration: "配置",
    scoreAndTrials: "分数与评测",
    resources: "资源消耗",
    reviewAndEvidence: "审核与来源证据",
    standardError: "标准误",
    harnessVersion: "Harness 版本",
    modelId: "模型 ID",
    sandbox: "Sandbox",
    notReported: "未披露",
    notOfficiallyRanked: "未参与官方排名",
    minimumTrials: "每任务最少评测次数",
    totalTrials: "总评测次数",
    totalTokens: "总 Tokens",
    uncachedInput: "未缓存输入",
    cachedInput: "缓存输入",
    outputTokens: "输出",
    totalCost: "总成本",
    averageDuration: "平均单次耗时",
    disqualifiedTrials: "审核后计为 0 分的 Trials",
    sourceFile: "来源文件",
    sourceSnapshot: "数据快照",
    primarySource: "一手来源",
    sourceType: "来源类型",
    publisher: "发布方",
    publishedAt: "发布日期",
    sourcesChecked: "来源核验截至",
    protocolDetails: "来源披露的配置",
    harborJob: "Harbor 任务",
    harborJobs: "Harbor 任务",
    close: "关闭",
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
  sourceType: "",
  bestOnly: false,
  sortKey: "accuracy",
  sortDirection: "desc",
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
  if (state.locale === "zh") return minutes + " 分 " + rest + " 秒";
  return minutes + "m " + String(rest).padStart(2, "0") + "s";
}

function formatPercent(value) {
  return value == null ? "—" : Number(value).toFixed(2) + "%";
}

function reported(value) {
  return value == null || value === "" ? t("notReported") : String(value);
}

function thinkingLabel(value) {
  return value == null || value === "" ? t("notReported") : value;
}

function sourceTypeLabel(value) {
  const labels = {
    benchmark_official: t("benchmarkOfficial"),
    vendor_reported: t("vendorReported")
  };
  return labels[value] || value;
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
  document.querySelectorAll("[data-i18n-aria]").forEach(function (element) {
    element.setAttribute("aria-label", t(element.dataset.i18nAria));
  });

  const preference = document.documentElement.dataset.localePref || "system";
  page.localeSelect.options[0].textContent = t("followSystem");
  page.localeSelect.value = preference;
  page.dialogClose.setAttribute("aria-label", t("close"));
}

function renderBenchmarkTabs() {
  page.benchSwitcher.innerHTML = state.data.benchmarks.map(function (bench) {
    const active = bench.id === state.benchmarkId;
    return [
      '<button type="button" class="bench-tab" data-benchmark="',
      escapeHtml(bench.id), '"',
      ' aria-pressed="', active ? "true" : "false", '"',
      ">",
      escapeHtml(bench.short_name || bench.name),
      "</button>"
    ].join("");
  }).join("");

  page.benchSwitcher.querySelectorAll("[data-benchmark]").forEach(function (button) {
    button.addEventListener("click", function () {
      state.benchmarkId = button.dataset.benchmark;
      state.query = "";
      state.harness = "";
      state.thinking = "";
      state.sourceType = "";
      state.bestOnly = false;
      page.search.value = "";
      page.bestOnly.checked = false;
      const nextUrl = new URL(window.location.href);
      nextUrl.searchParams.set("bench", state.benchmarkId);
      history.replaceState(null, "", nextUrl);
      render();
    });
  });
}

function renderSummary(bench) {
  page.benchDescription.textContent = localized(bench.description);
  page.sourceLink.href = bench.repository_url;
  page.statTasks.textContent = formatNumber(bench.task_count);
  page.statSubmissions.textContent = formatNumber(bench.result_count);
  page.statModels.textContent = formatNumber(bench.model_count);
  page.statBest.textContent = formatPercent(bench.official_best_accuracy);
  page.statBestLabel.textContent = bench.official_best_result_label +
    (state.locale === "zh" ? " · 仅官方" : " · official only");
  page.resultsTitle.textContent = bench.name + " Leaderboard";
  page.resultsDescription.textContent = localized(bench.description);
  page.tableCaption.textContent = bench.name + " · " + t("tableCaption");
  page.scoreNote.textContent = localized(bench.score_note);
  page.submissionNote.textContent = localized(bench.protocol_note);
}

function renderFilterOptions(bench) {
  const harnesses = Array.from(new Set(bench.results.map(function (row) {
    return row.harness;
  }).filter(Boolean))).sort();
  const thinkingLevels = Array.from(new Set(bench.results.map(function (row) {
    return row.thinking_level;
  }).filter(function (value) { return value != null; }))).sort();
  const sourceTypes = Array.from(new Set(bench.results.map(function (row) {
    return row.source_type;
  }))).sort();

  page.harnessFilter.innerHTML = '<option value="">' + escapeHtml(t("allHarnesses")) + "</option>" +
    harnesses.map(function (name) {
      return '<option value="' + escapeHtml(name) + '">' + escapeHtml(name) + "</option>";
    }).join("");
  page.thinkingFilter.innerHTML = '<option value="">' + escapeHtml(t("allThinking")) + "</option>" +
    thinkingLevels.map(function (level) {
      return '<option value="' + escapeHtml(level) + '">' + escapeHtml(level) + "</option>";
    }).join("");
  page.sourceFilter.innerHTML = '<option value="">' + escapeHtml(t("allSources")) + "</option>" +
    sourceTypes.map(function (sourceType) {
      return '<option value="' + escapeHtml(sourceType) + '">' +
        escapeHtml(sourceTypeLabel(sourceType)) + "</option>";
    }).join("");

  page.harnessFilter.value = state.harness;
  page.thinkingFilter.value = state.thinking;
  page.sourceFilter.value = state.sourceType;
}

const columns = [
  { key: "official_rank", label: "rank", className: "rank-column", numeric: true },
  { key: "harness", label: "harnessTitle", className: "harness-column" },
  { key: "model", label: "model", className: "model-column" },
  { key: "thinking_level", label: "thinkingLevel", className: "thinking-column" },
  { key: "trial_count", label: "runConfig", className: "config-column" },
  { key: "accuracy", label: "accuracy", className: "accuracy-column", numeric: true }
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
  }).join("") + '<th scope="col" class="details-column">' +
    escapeHtml(t("details")) + "</th></tr>";

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
  let filtered = bench.results.filter(function (row) {
    const searchable = [
      row.harness,
      row.harness_version,
      row.harness_org,
      row.model,
      row.model_id,
      row.model_org,
      row.thinking_level,
      row.publisher,
      sourceTypeLabel(row.source_type)
    ].join(" ").toLowerCase();
    return (!query || searchable.includes(query)) &&
      (!state.harness || row.harness === state.harness) &&
      (!state.thinking || row.thinking_level === state.thinking) &&
      (!state.sourceType || row.source_type === state.sourceType);
  });

  if (state.bestOnly) {
    const bestByModel = new Map();
    filtered.forEach(function (row) {
      const current = bestByModel.get(row.model);
      if (!current || row.accuracy > current.accuracy) bestByModel.set(row.model, row);
    });
    filtered = filtered.filter(function (row) {
      return bestByModel.get(row.model).id === row.id;
    });
  }

  return filtered.slice().sort(function (left, right) {
    let a = left[state.sortKey];
    let b = right[state.sortKey];
    if (typeof a === "string") a = a.toLowerCase();
    if (typeof b === "string") b = b.toLowerCase();
    if (a == null && b != null) return 1;
    if (b == null && a != null) return -1;
    if (a < b) return state.sortDirection === "asc" ? -1 : 1;
    if (a > b) return state.sortDirection === "asc" ? 1 : -1;
    return right.accuracy - left.accuracy || left.model.localeCompare(right.model);
  });
}

function accuracyCell(row) {
  const stderr = row.accuracy_stderr == null ? "" : [
    '<small><span class="sr-only">', escapeHtml(t("standardError")),
    " </span>± ", Number(row.accuracy_stderr).toFixed(2), "%</small>"
  ].join("");
  return [
    '<div class="accuracy-measure"><div class="accuracy-track"><span class="accuracy-fill" style="--accuracy:',
    Math.min(row.accuracy, 100), '%"></span></div><div class="accuracy-value"><strong>',
    Number(row.accuracy).toFixed(2), "%</strong>", stderr, "</div></div>"
  ].join("");
}

function configCell(row) {
  if (row.trial_count == null && row.minimum_trials_per_task == null &&
      row.average_trial_duration_seconds == null) {
    const note = localized(row.protocol_note);
    if (note) {
      return '<div class="config-summary"><strong>' + escapeHtml(t("sourceReported")) +
        '</strong><span class="reported-config" title="' + escapeHtml(note) + '">' +
        escapeHtml(note) + "</span></div>";
    }
    return '<span class="not-reported">' + escapeHtml(t("notReported")) + "</span>";
  }
  const details = [];
  if (row.minimum_trials_per_task != null) {
    details.push(state.locale === "zh"
      ? "每任务至少 " + row.minimum_trials_per_task + " 次"
      : "Min. " + row.minimum_trials_per_task + " per task");
  }
  if (row.average_trial_duration_seconds != null) {
    details.push(t("averageShort") + " " + formatDuration(row.average_trial_duration_seconds));
  }
  return [
    '<div class="config-summary"><strong>', row.trial_count == null
      ? escapeHtml(t("notReported"))
      : formatNumber(row.trial_count) + " " + escapeHtml(t("trials")),
    "</strong><span>", escapeHtml(details.join(" · ")),
    "</span></div>"
  ].join("");
}

function renderTable() {
  const bench = activeBenchmark();
  if (!bench) return;
  renderTableHead();
  const results = filteredResults(bench);
  page.resultCount.textContent = formatNumber(results.length) + " " +
    (results.length === 1 ? t("resultSingular") : t("resultPlural")) + " · " +
    t("sourcesChecked") + " " + bench.verified_at;

  if (!results.length) {
    page.tableBody.innerHTML = '<tr><td class="loading-cell" colspan="7">' +
      escapeHtml(t("noResults")) + "</td></tr>";
    return;
  }

  page.tableBody.innerHTML = results.map(function (row) {
    const rank = row.official_rank == null ? "—" : row.official_rank;
    const rankTitle = row.official_rank == null ? ' title="' +
      escapeHtml(t("notOfficiallyRanked")) + '"' : "";
    const harnessMeta = [
      row.harness_version ? "v" + row.harness_version : "",
      row.harness_org || ""
    ].filter(Boolean).join(" · ");
    return [
      '<tr class="result-row-', escapeHtml(row.source_type), '" data-result-id="',
      escapeHtml(row.id), '">',
      '<td class="rank-cell"><span class="rank-badge rank-',
      row.official_rank == null ? "external" : row.official_rank, '"', rankTitle, ">",
      rank, "</span></td>",
      '<td><span class="primary-cell">', escapeHtml(reported(row.harness)),
      '</span><span class="secondary-cell">', escapeHtml(harnessMeta || t("notReported")), "</span></td>",
      '<td><span class="primary-cell">', escapeHtml(row.model),
      '</span><span class="secondary-cell model-meta">', escapeHtml(row.model_org),
      '<span class="source-badge source-', escapeHtml(row.source_type), '">',
      escapeHtml(sourceTypeLabel(row.source_type)), "</span></span></td>",
      '<td><span class="thinking-pill">', escapeHtml(thinkingLabel(row.thinking_level)), "</span></td>",
      "<td>", configCell(row), "</td>",
      '<td class="accuracy-cell', state.sortKey === "accuracy" ? " is-active" : "", '">',
      accuracyCell(row), "</td>",
      '<td class="details-column"><button class="details-button" type="button" data-details="',
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

function optionalDetailItem(label, value, formatter) {
  if (value == null || value === "") return "";
  return detailItem(label, formatter ? formatter(value) : value);
}

function detailGroup(title, items) {
  const visibleItems = items.filter(Boolean);
  if (!visibleItems.length) return "";
  return '<section class="detail-group"><h3>' +
    escapeHtml(title) + '</h3><dl class="detail-list">' + visibleItems.join("") + "</dl></section>";
}

function openDetails(row, bench) {
  page.dialogTitle.textContent = row.model + " × " + reported(row.harness);
  const configurationItems = [
    detailItem(t("harnessTitle"), reported(row.harness)),
    detailItem(t("harnessVersion"), reported(row.harness_version)),
    detailItem(t("modelId"), reported(row.model_id)),
    detailItem(t("thinkingLevel"), thinkingLabel(row.thinking_level)),
    detailItem(t("sandbox"), reported(row.sandbox)),
    detailItem(t("sourceType"), sourceTypeLabel(row.source_type))
  ];
  const passItems = [
    detailItem(t("accuracy"), formatPercent(row.accuracy)),
    optionalDetailItem(t("standardError"), row.accuracy_stderr, function (value) {
      return "± " + Number(value).toFixed(2) + "%";
    }),
    optionalDetailItem("pass@2", row.pass_at_2, formatPercent),
    optionalDetailItem("pass@3", row.pass_at_3, formatPercent),
    optionalDetailItem("pass@4", row.pass_at_4, formatPercent),
    optionalDetailItem("pass@5", row.pass_at_5, formatPercent),
    optionalDetailItem(t("minimumTrials"), row.minimum_trials_per_task),
    optionalDetailItem(t("totalTrials"), row.trial_count, formatNumber)
  ];
  const resourceItems = [
    optionalDetailItem(t("totalTokens"), row.total_tokens, formatNumber),
    optionalDetailItem(t("uncachedInput"), row.uncached_input_tokens, formatNumber),
    optionalDetailItem(t("cachedInput"), row.cached_input_tokens, formatNumber),
    optionalDetailItem(t("outputTokens"), row.output_tokens, formatNumber),
    optionalDetailItem(t("totalCost"), row.total_cost_usd, formatMoney),
    optionalDetailItem(t("averageDuration"), row.average_trial_duration_seconds, formatDuration)
  ];
  const reviewItems = [
    optionalDetailItem(t("rewardHacks"), row.reward_hacks, formatPercent),
    optionalDetailItem(t("disqualifiedTrials"), row.disqualified_trials, formatNumber),
    optionalDetailItem(t("publisher"), row.publisher),
    optionalDetailItem(t("publishedAt"), row.published_at),
    optionalDetailItem(t("sourcesChecked"), row.retrieved_at),
    optionalDetailItem(t("sourceFile"), row.source_file),
    optionalDetailItem(t("sourceSnapshot"), bench.snapshot_commit || bench.snapshot_updated_at)
  ];
  const links = [
    '<a class="detail-link" href="' + escapeHtml(row.source_url) +
      '" target="_blank" rel="noreferrer">' + escapeHtml(t("primarySource")) + " ↗</a>"
  ].concat((row.source_jobs || []).map(function (url, index) {
    const label = row.source_jobs.length === 1 ? t("harborJob") : t("harborJobs") + " " + (index + 1);
    return '<a class="detail-link" href="' + escapeHtml(url) +
      '" target="_blank" rel="noreferrer">' + escapeHtml(label) + " ↗</a>";
  }));
  const protocol = localized(row.protocol_note);

  page.dialogBody.innerHTML = [
    '<p class="detail-intro">', escapeHtml(sourceTypeLabel(row.source_type)), " · ",
    escapeHtml(row.source_title), "</p>",
    '<div class="detail-grid">',
    detailGroup(t("configuration"), configurationItems),
    detailGroup(t("scoreAndTrials"), passItems),
    detailGroup(t("resources"), resourceItems),
    detailGroup(t("reviewAndEvidence"), reviewItems),
    protocol ? '<section class="detail-group wide"><h3>' + escapeHtml(t("protocolDetails")) +
      '</h3><p class="detail-protocol">' + escapeHtml(protocol) + "</p></section>" : "",
    '<section class="detail-group wide"><h3>', escapeHtml(t("source")),
    '</h3><div class="detail-links">', links.join(""), "</div></section></div>"
  ].join("");
  page.dialog.showModal();
}

function render() {
  const bench = activeBenchmark();
  applyTranslations();
  renderBenchmarkTabs();
  updateThemeButton();
  if (!bench) return;
  renderSummary(bench);
  renderFilterOptions(bench);
  renderTable();
}

function resolveSystemLocale() {
  return navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
}

function setLocalePreference(preference) {
  localStorage.setItem("penguin-leaderboard.locale", preference);
  document.documentElement.dataset.localePref = preference;
  state.locale = preference === "system" ? resolveSystemLocale() : preference;
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
  document.querySelector('meta[name="theme-color"]').content =
    resolvedTheme(next) === "dark" ? "#000000" : "#ffffff";
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
page.sourceFilter.addEventListener("change", function () {
  state.sourceType = page.sourceFilter.value;
  renderTable();
});
page.bestOnly.addEventListener("change", function () {
  state.bestOnly = page.bestOnly.checked;
  renderTable();
});

page.localeSelect.addEventListener("change", function () {
  setLocalePreference(page.localeSelect.value);
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
    document.querySelector('meta[name="theme-color"]').content =
      resolvedTheme("system") === "dark" ? "#000000" : "#ffffff";
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
    const requested = new URLSearchParams(window.location.search).get("bench");
    const available = data.benchmarks.some(function (bench) {
      return bench.id === requested;
    });
    state.benchmarkId = available ? requested : data.default_benchmark;
    render();
  })
  .catch(function (error) {
    console.error(error);
    applyTranslations();
    page.tableBody.innerHTML = '<tr><td class="loading-cell" colspan="7">' +
      escapeHtml(t("loadError")) + "</td></tr>";
    page.resultCount.textContent = t("loadError");
  });
