const DATA_URL = "data/benchmarks.json";
const THEME_KEY = "penguin-leaderboard.theme";
const LOCALE_KEY = "penguin-leaderboard.locale";

const translations = {
  en: {
    skipToResults: "Skip to results",
    home: "Penguin Harness Leaderboard home",
    benchmarkSwitcher: "Benchmark selector",
    siteControls: "Site controls",
    language: "Language",
    followSystem: "Follow system",
    theme: "Theme: {mode}",
    system: "system",
    light: "light",
    dark: "dark",
    heroTitle: "Compare the whole setup,<br /><span>not just the model.</span>",
    viewResults: "View results",
    viewOfficial: "Open official leaderboard",
    officialResults: "Official results",
    models: "Models",
    harnesses: "Harnesses",
    officialBest: "Official best",
    officialSnapshot: "Official snapshot",
    snapshotUpdated: "Official snapshot updated {date}.",
    harness: "Harness",
    model: "Model",
    thinkingLevel: "Thinking level",
    harnessFilter: "Filter by harness",
    modelFilter: "Filter by model",
    thinkingFilter: "Filter by thinking level",
    allHarnesses: "All harnesses",
    allModels: "All models",
    allLevels: "All levels",
    showingResults: "Showing {shown} of {total} official results",
    tableHint: "Swipe to view the full table →",
    loadingResults: "Loading official results…",
    confidenceNote: "Resolution rate includes the official 95% confidence interval. Tokens and cost are totals reported by tbench.ai.",
    readMetrics: "Read the metrics",
    metricsTitle: "The comparable result, at a glance.",
    resolutionRate: "Resolution rate",
    resolutionDescription: "Pass rate with the official 95% confidence interval shown on the same scale.",
    tokens: "Tokens",
    tokensDescription: "Total reported token usage across the evaluated trials.",
    cost: "Cost",
    costDescription: "Total reported API cost for the published evaluation.",
    footerText: "Official Terminal-Bench snapshot · ready for future Penguin runs",
    rank: "Rank",
    releaseDate: "Release date",
    notReported: "Not reported",
    noResults: "No results match these filters.",
    officialSource: "Official source",
    details: "Details",
    resultDetails: "Result details",
    closeDetails: "Close details",
    openOfficialDetail: "Open official detail",
    done: "Done",
    officialRank: "Official rank",
    configuration: "Configuration",
    scoreMetrics: "Score metrics",
    usageMetrics: "Usage metrics",
    sourceLinks: "Source links",
    harnessOrganization: "Harness organization",
    modelOrganization: "Model organization",
    trials: "Trials",
    successes: "Successes",
    confidenceInterval: "95% confidence interval",
    standardError: "Standard error",
    totalTokens: "Total tokens",
    uncachedInputTokens: "Uncached input",
    cachedInputTokens: "Cached input",
    outputTokens: "Output tokens",
    totalCost: "Total cost",
    averageTrialDuration: "Average trial duration",
    avgDuration: "Avg. duration",
    confidenceRange: "95% CI {lower}–{upper}",
    rewardHacks: "Reward hacks",
    submission: "Submission",
    benchmarkSnapshot: "Benchmark snapshot",
    officialRow: "Official result row",
    sorting: "Sort by {column}",
    dataError: "Official results could not be loaded. Start a local web server and refresh.",
  },
  zh: {
    skipToResults: "跳到榜单",
    home: "Penguin Harness 榜单首页",
    benchmarkSwitcher: "Benchmark 切换",
    siteControls: "网站控制",
    language: "语言",
    followSystem: "跟随系统",
    theme: "主题：{mode}",
    system: "跟随系统",
    light: "浅色",
    dark: "深色",
    heroTitle: "对比完整配置，<br /><span>而不只是模型。</span>",
    viewResults: "查看榜单",
    viewOfficial: "打开官方榜单",
    officialResults: "官方结果",
    models: "模型",
    harnesses: "Harness",
    officialBest: "官方最高分",
    officialSnapshot: "官方快照",
    snapshotUpdated: "官方快照更新时间：{date}。",
    harness: "Harness",
    model: "模型",
    thinkingLevel: "思考等级",
    harnessFilter: "按 Harness 筛选",
    modelFilter: "按模型筛选",
    thinkingFilter: "按思考等级筛选",
    allHarnesses: "全部 Harness",
    allModels: "全部模型",
    allLevels: "全部等级",
    showingResults: "显示 {shown} / {total} 条官方结果",
    tableHint: "横向滑动查看完整表格 →",
    loadingResults: "正在加载官方结果…",
    confidenceNote: "解决率同时展示官方 95% 置信区间；Token 和成本均为 tbench.ai 公布的评测总量。",
    readMetrics: "指标说明",
    metricsTitle: "一眼看懂可比结果。",
    resolutionRate: "解决率",
    resolutionDescription: "通过率与官方 95% 置信区间在同一刻度上展示。",
    tokens: "Token",
    tokensDescription: "本次公开评测全部 trials 的 Token 总用量。",
    cost: "成本",
    costDescription: "本次公开评测报告的 API 总成本。",
    footerText: "Terminal-Bench 官方快照 · 可继续接入 Penguin 实测结果",
    rank: "排名",
    releaseDate: "发布日期",
    notReported: "未披露",
    noResults: "没有符合当前筛选条件的结果。",
    officialSource: "官方来源",
    details: "详情",
    resultDetails: "结果详情",
    closeDetails: "关闭详情",
    openOfficialDetail: "打开官方详情",
    done: "完成",
    officialRank: "官方排名",
    configuration: "评测配置",
    scoreMetrics: "成绩指标",
    usageMetrics: "用量指标",
    sourceLinks: "来源链接",
    harnessOrganization: "Harness 组织",
    modelOrganization: "模型组织",
    trials: "试验数",
    successes: "成功数",
    confidenceInterval: "95% 置信区间",
    standardError: "标准误差",
    totalTokens: "Token 总量",
    uncachedInputTokens: "非缓存输入",
    cachedInputTokens: "缓存输入",
    outputTokens: "输出 Token",
    totalCost: "总成本",
    averageTrialDuration: "平均试验时长",
    avgDuration: "平均时长",
    confidenceRange: "95% 置信区间 {lower}–{upper}",
    rewardHacks: "Reward hack",
    submission: "提交记录",
    benchmarkSnapshot: "Benchmark 官方快照",
    officialRow: "官方结果详情",
    sorting: "按{column}排序",
    dataError: "无法加载官方结果，请启动本地 Web 服务后刷新。",
  },
};

const state = {
  payload: null,
  benchmark: null,
  locale: document.documentElement.dataset.locale || "en",
  filters: { harness: "", model: "", thinking: "" },
  sort: { key: "rank", direction: "asc" },
};

const elements = {
  benchSwitcher: document.querySelector(".bench-switcher"),
  localeSelect: document.querySelector(".locale-select"),
  themeToggle: document.querySelector(".theme-toggle"),
  harnessFilter: document.querySelector(".harness-filter"),
  modelFilter: document.querySelector(".model-filter"),
  thinkingFilter: document.querySelector(".thinking-filter"),
  resultCount: document.querySelector(".result-count"),
  resultsHead: document.querySelector(".results-head"),
  resultsBody: document.querySelector(".results-body"),
  resultDialog: document.querySelector(".result-dialog"),
  dialogTitle: document.querySelector("#result-dialog-title"),
  dialogSubtitle: document.querySelector(".dialog-subtitle"),
  dialogBody: document.querySelector(".dialog-body"),
  dialogOfficialLink: document.querySelector(".official-detail-link"),
  dialogClose: document.querySelector(".dialog-close"),
  dialogDone: document.querySelector(".dialog-done"),
};

let dialogTrigger = null;

function t(key, values = {}) {
  const template = translations[state.locale]?.[key] ?? translations.en[key] ?? key;
  return Object.entries(values).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
    template,
  );
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function safeUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : "";
  } catch {
    return "";
  }
}

function applyTranslations() {
  document.documentElement.lang = state.locale === "zh" ? "zh-CN" : "en";
  document.documentElement.dataset.locale = state.locale;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-html]").forEach((node) => {
    node.innerHTML = t(node.dataset.i18nHtml);
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((node) => {
    node.setAttribute("aria-label", t(node.dataset.i18nAria));
  });
  elements.localeSelect.options[0].textContent = t("followSystem");
  updateThemeLabel();
}

function resolvedLocale(preference) {
  if (preference === "system") {
    return navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
  }
  return preference;
}

function setLocale(preference) {
  document.documentElement.dataset.localePref = preference;
  state.locale = resolvedLocale(preference);
  localStorage.setItem(LOCALE_KEY, preference);
  if (state.benchmark) renderBenchmark();
  else applyTranslations();
}

function resolvedTheme(mode) {
  if (mode === "system") {
    return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return mode;
}

function setTheme(mode) {
  const theme = resolvedTheme(mode);
  document.documentElement.dataset.themeMode = mode;
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]').content =
    theme === "dark" ? "#000000" : "#ffffff";
  localStorage.setItem(THEME_KEY, mode);
  updateThemeLabel();
}

function updateThemeLabel() {
  const mode = document.documentElement.dataset.themeMode || "system";
  const label = t("theme", { mode: t(mode) });
  elements.themeToggle.setAttribute("aria-label", label);
  elements.themeToggle.title = label;
}

function cycleTheme() {
  const order = ["system", "light", "dark"];
  const current = document.documentElement.dataset.themeMode || "system";
  setTheme(order[(order.indexOf(current) + 1) % order.length]);
}

function formatDate(value) {
  if (!value) return t("notReported");
  const date = new Date(`${value}T00:00:00Z`);
  return new Intl.DateTimeFormat(state.locale === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function formatSnapshot(value) {
  if (!value) return t("notReported");
  const date = new Date(value);
  return new Intl.DateTimeFormat(state.locale === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  }).format(date);
}

function formatTokens(value) {
  return value == null ? t("notReported") : `${(value / 1_000_000_000).toFixed(1)}B`;
}

function formatCost(value) {
  return value == null ? t("notReported") : `$${(value / 1_000).toFixed(1)}k`;
}

function formatNumber(value) {
  if (value == null) return null;
  return new Intl.NumberFormat(state.locale === "zh" ? "zh-CN" : "en-US").format(value);
}

function formatExactCost(value) {
  if (value == null) return null;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatPercent(value, digits = 2) {
  return value == null ? null : `${Number(value).toFixed(digits)}%`;
}

function formatPassRate(value) {
  return value == null ? null : formatPercent(Number(value) * 100);
}

function formatDuration(value) {
  if (value == null) return null;
  const seconds = Math.round(Number(value));
  if (seconds < 60) return `${seconds}s`;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours) return `${hours}h ${minutes}m`;
  return `${minutes}m ${seconds % 60}s`;
}

function linkedName(item) {
  const label = escapeHtml(item.label);
  const href = safeUrl(item.url);
  return href
    ? `<a class="entity-link" href="${escapeHtml(href)}">${label}<span aria-hidden="true">↗</span></a>`
    : `<span class="entity-name">${label}</span>`;
}

function renderBenchSwitcher() {
  elements.benchSwitcher.replaceChildren();
  state.payload.benchmarks.forEach((bench) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "bench-tab";
    button.textContent = `TB ${bench.version}`;
    button.dataset.benchmark = bench.id;
    button.setAttribute("aria-pressed", String(bench.id === state.benchmark.id));
    button.addEventListener("click", () => selectBenchmark(bench.id));
    elements.benchSwitcher.append(button);
  });
}

function updateSelect(select, values, current, emptyLabel) {
  select.replaceChildren();
  const empty = document.createElement("option");
  empty.value = "";
  empty.textContent = emptyLabel;
  select.append(empty);
  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.append(option);
  });
  select.value = values.includes(current) ? current : "";
}

function renderFilters() {
  const rows = state.benchmark.results;
  const unique = (project) => [...new Set(rows.map(project).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b));
  updateSelect(
    elements.harnessFilter,
    unique((row) => row.harness.label),
    state.filters.harness,
    t("allHarnesses"),
  );
  updateSelect(
    elements.modelFilter,
    unique((row) => row.model.label),
    state.filters.model,
    t("allModels"),
  );
  updateSelect(
    elements.thinkingFilter,
    unique((row) => row.thinking_level),
    state.filters.thinking,
    t("allLevels"),
  );
  state.filters.harness = elements.harnessFilter.value;
  state.filters.model = elements.modelFilter.value;
  state.filters.thinking = elements.thinkingFilter.value;
}

function filteredRows() {
  return state.benchmark.results.filter((row) => (
    (!state.filters.harness || row.harness.label === state.filters.harness)
    && (!state.filters.model || row.model.label === state.filters.model)
    && (!state.filters.thinking || row.thinking_level === state.filters.thinking)
  ));
}

function sortedRows(rows) {
  const { key, direction } = state.sort;
  const multiplier = direction === "asc" ? 1 : -1;
  const value = (row) => {
    if (key === "harness") return row.harness.label;
    if (key === "model") return row.model.label;
    return row[key];
  };
  return [...rows].sort((left, right) => {
    const a = value(left);
    const b = value(right);
    if (typeof a === "string" || typeof b === "string") {
      return String(a ?? "").localeCompare(String(b ?? "")) * multiplier;
    }
    return ((a ?? -Infinity) - (b ?? -Infinity)) * multiplier;
  });
}

function setSort(key) {
  if (state.sort.key === key) {
    state.sort.direction = state.sort.direction === "asc" ? "desc" : "asc";
  } else {
    state.sort = { key, direction: key === "rank" ? "asc" : "desc" };
  }
  renderTable();
}

function renderTableHead() {
  const columns = [
    ["rank", "rank"],
    ["harness", "harness"],
    ["model", "model"],
    ["accuracy", "resolutionRate"],
    ["trial_count", "trials"],
    ["average_trial_duration_seconds", "avgDuration"],
    ["release_date", "releaseDate"],
    ["total_tokens", "tokens"],
    ["total_cost_usd", "cost"],
  ];
  const row = document.createElement("tr");
  columns.forEach(([key, labelKey]) => {
    const cell = document.createElement("th");
    cell.scope = "col";
    cell.className = `column-${key.replaceAll("_", "-")}`;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "sort-button";
    button.setAttribute("aria-label", t("sorting", { column: t(labelKey) }));
    button.textContent = t(labelKey);
    if (state.sort.key === key) {
      const arrow = document.createElement("span");
      arrow.className = "sort-arrow";
      arrow.textContent = state.sort.direction === "asc" ? "↑" : "↓";
      button.append(arrow);
      cell.setAttribute("aria-sort", state.sort.direction === "asc" ? "ascending" : "descending");
    }
    button.addEventListener("click", () => setSort(key));
    cell.append(button);
    row.append(cell);
  });
  const detailsCell = document.createElement("th");
  detailsCell.scope = "col";
  detailsCell.className = "column-details";
  detailsCell.textContent = t("details");
  row.append(detailsCell);
  elements.resultsHead.replaceChildren(row);
}

function accuracyCell(row) {
  const ci = row.accuracy_ci95_half_width;
  const lower = Math.max(0, row.accuracy - (ci ?? 0));
  const upper = Math.min(100, row.accuracy + (ci ?? 0));
  const interval = ci == null
    ? t("notReported")
    : t("confidenceRange", {
      lower: `${lower.toFixed(1)}%`,
      upper: `${upper.toFixed(1)}%`,
    });
  return `
    <div class="rate-cell">
      <strong>${row.accuracy.toFixed(1)}%</strong>
      <span>${escapeHtml(interval)}</span>
    </div>`;
}

function renderTable() {
  renderTableHead();
  const rows = sortedRows(filteredRows());
  elements.resultCount.textContent = t("showingResults", {
    shown: rows.length,
    total: state.benchmark.result_count,
  });

  if (!rows.length) {
    elements.resultsBody.innerHTML = `<tr><td class="empty-cell" colspan="10">${escapeHtml(t("noResults"))}</td></tr>`;
    return;
  }

  elements.resultsBody.innerHTML = rows.map((row) => {
    const effort = row.thinking_level
      ? `<span class="effort-pill">${escapeHtml(row.thinking_level)}</span>`
      : `<span class="effort-pill muted">${escapeHtml(t("notReported"))}</span>`;
    return `
      <tr>
        <td class="rank-cell"><span class="rank-badge${row.rank <= 3 ? ` rank-${row.rank}` : ""}">${row.rank}</span></td>
        <td class="entity-cell harness-cell">${linkedName(row.harness)}</td>
        <td class="entity-cell model-cell">
          <div class="model-primary">${linkedName(row.model)}${effort}</div>
        </td>
        <td>${accuracyCell(row)}</td>
        <td class="number-cell">${row.trial_count == null ? escapeHtml(t("notReported")) : escapeHtml(formatNumber(row.trial_count))}</td>
        <td class="number-cell">${row.average_trial_duration_seconds == null ? escapeHtml(t("notReported")) : escapeHtml(formatDuration(row.average_trial_duration_seconds))}</td>
        <td class="date-cell">${escapeHtml(formatDate(row.release_date))}</td>
        <td class="number-cell">${escapeHtml(formatTokens(row.total_tokens))}</td>
        <td class="number-cell">${escapeHtml(formatCost(row.total_cost_usd))}</td>
        <td class="details-cell"><button class="details-button" type="button" data-result-id="${escapeHtml(row.id)}">${escapeHtml(t("details"))}<span aria-hidden="true">→</span></button></td>
      </tr>`;
  }).join("");
}

function detailLink(item, fallbackLabel) {
  const href = safeUrl(item?.url);
  const label = item?.label || fallbackLabel;
  if (!href || !label) return null;
  return `<a href="${escapeHtml(href)}" target="_blank" rel="noreferrer">${escapeHtml(label)} ↗</a>`;
}

function detailItem(label, value) {
  if (value == null || value === "") return "";
  return `<div class="detail-item"><dt>${escapeHtml(label)}</dt><dd>${value}</dd></div>`;
}

function detailGroup(title, items) {
  const content = items.filter(Boolean).join("");
  if (!content) return "";
  return `<section class="detail-group"><h3>${escapeHtml(title)}</h3><dl class="detail-list">${content}</dl></section>`;
}

function openDetails(row, trigger) {
  dialogTrigger = trigger;
  elements.dialogTitle.textContent = `${row.model.label} × ${row.harness.label}`;
  elements.dialogSubtitle.textContent = `${state.benchmark.name} · ${row.thinking_level || t("notReported")}`;

  const confidence = row.accuracy_ci95_half_width == null
    ? null
    : `± ${formatPercent(row.accuracy_ci95_half_width)}`;
  const summary = `
    <div class="detail-summary">
      <div><strong>${escapeHtml(formatPercent(row.accuracy, 1))}</strong><span>${escapeHtml(t("resolutionRate"))}</span></div>
      <div><strong>${escapeHtml(String(row.rank))}</strong><span>${escapeHtml(t("officialRank"))}</span></div>
      <div><strong>${escapeHtml(formatDate(row.release_date))}</strong><span>${escapeHtml(t("releaseDate"))}</span></div>
    </div>`;

  const configuration = detailGroup(t("configuration"), [
    detailItem(t("harness"), detailLink(row.harness, row.harness?.label) || escapeHtml(row.harness?.label)),
    detailItem(t("harnessOrganization"), detailLink(row.harness_org, row.harness_org?.label) || escapeHtml(row.harness_org?.label)),
    detailItem(t("model"), detailLink(row.model, row.model?.label) || escapeHtml(row.model?.label)),
    detailItem(t("modelOrganization"), detailLink(row.model_org, row.model_org?.label) || escapeHtml(row.model_org?.label)),
    detailItem(t("thinkingLevel"), row.thinking_level ? escapeHtml(row.thinking_level) : null),
  ]);

  const scores = detailGroup(t("scoreMetrics"), [
    detailItem(t("resolutionRate"), escapeHtml(formatPercent(row.accuracy, 2))),
    detailItem(t("confidenceInterval"), confidence ? escapeHtml(confidence) : null),
    detailItem(t("standardError"), row.accuracy_stderr == null ? null : escapeHtml(formatPercent(row.accuracy_stderr))),
    detailItem(t("trials"), row.trial_count == null ? null : escapeHtml(formatNumber(row.trial_count))),
    detailItem(t("successes"), row.successes == null ? null : escapeHtml(formatNumber(row.successes))),
    detailItem("pass@2", row.pass_at_2 == null ? null : escapeHtml(formatPassRate(row.pass_at_2))),
    detailItem("pass@3", row.pass_at_3 == null ? null : escapeHtml(formatPassRate(row.pass_at_3))),
    detailItem("pass@4", row.pass_at_4 == null ? null : escapeHtml(formatPassRate(row.pass_at_4))),
    detailItem("pass@5", row.pass_at_5 == null ? null : escapeHtml(formatPassRate(row.pass_at_5))),
    detailItem(t("rewardHacks"), detailLink(row.display_reward_hacks, row.display_reward_hacks?.label)
      || (row.reward_hacks == null ? null : escapeHtml(formatNumber(row.reward_hacks)))),
  ]);

  const usage = detailGroup(t("usageMetrics"), [
    detailItem(t("totalTokens"), row.total_tokens == null ? null : escapeHtml(formatNumber(row.total_tokens))),
    detailItem(t("uncachedInputTokens"), row.uncached_input_tokens == null ? null : escapeHtml(formatNumber(row.uncached_input_tokens))),
    detailItem(t("cachedInputTokens"), row.cached_input_tokens == null ? null : escapeHtml(formatNumber(row.cached_input_tokens))),
    detailItem(t("outputTokens"), row.output_tokens == null ? null : escapeHtml(formatNumber(row.output_tokens))),
    detailItem(t("totalCost"), row.total_cost_usd == null ? null : escapeHtml(formatExactCost(row.total_cost_usd))),
    detailItem(t("averageTrialDuration"), row.average_trial_duration_seconds == null ? null : escapeHtml(formatDuration(row.average_trial_duration_seconds))),
  ]);

  const officialRow = safeUrl(row.official_detail_url);
  const sourceLinks = detailGroup(t("sourceLinks"), [
    detailItem(t("officialRow"), officialRow
      ? `<a href="${escapeHtml(officialRow)}" target="_blank" rel="noreferrer">Harbor ↗</a>`
      : null),
    detailItem(t("submission"), detailLink(row.submission, row.submission?.label)),
    detailItem(t("benchmarkSnapshot"), `<a href="${escapeHtml(safeUrl(state.benchmark.official_url))}" target="_blank" rel="noreferrer">tbench.ai ↗</a>`),
  ]);

  elements.dialogBody.innerHTML = `${summary}<div class="detail-groups">${configuration}${scores}${usage}${sourceLinks}</div>`;
  elements.dialogOfficialLink.href = officialRow || state.benchmark.official_url;
  elements.resultDialog.showModal();
}

function closeDetails() {
  if (elements.resultDialog.open) elements.resultDialog.close();
}

function renderBenchmark() {
  applyTranslations();
  renderBenchSwitcher();
  renderFilters();

  const bench = state.benchmark;
  document.title = `${bench.name} · Penguin Harness Leaderboard`;
  document.querySelector(".current-bench-name").textContent = bench.name;
  document.querySelector(".current-bench-description").textContent = bench.description[state.locale];
  document.querySelector(".results-title").textContent = bench.name;
  document.querySelector(".results-description").textContent = t("snapshotUpdated", {
    date: formatSnapshot(bench.snapshot_updated_at),
  });
  document.querySelector(".stat-results").textContent = bench.result_count;
  document.querySelector(".stat-models").textContent = bench.model_count;
  document.querySelector(".stat-harnesses").textContent = bench.harness_count;
  document.querySelector(".stat-best").textContent = `${bench.best_accuracy.toFixed(1)}%`;
  document.querySelector(".table-caption").textContent = `${bench.name} official results`;
  document.querySelectorAll(".benchmark-source-link").forEach((link) => {
    link.href = bench.official_url;
  });
  document.querySelector(".snapshot-label").textContent = `tbench.ai · ${bench.version}`;
  renderTable();
}

function selectBenchmark(id, updateUrl = true) {
  const bench = state.payload.benchmarks.find((item) => item.id === id);
  if (!bench) return;
  state.benchmark = bench;
  state.filters = { harness: "", model: "", thinking: "" };
  state.sort = { key: "rank", direction: "asc" };
  if (updateUrl) {
    const url = new URL(window.location.href);
    url.searchParams.delete("bench");
    url.searchParams.set("version", bench.version);
    history.replaceState({}, "", url);
  }
  renderBenchmark();
}

function initialBenchmark(payload) {
  const params = new URLSearchParams(window.location.search);
  const version = params.get("version");
  const legacyId = params.get("bench");
  return payload.benchmarks.find((bench) => bench.version === version || bench.id === legacyId)
    || payload.benchmarks.find((bench) => bench.id === payload.default_benchmark)
    || payload.benchmarks[0];
}

async function init() {
  elements.localeSelect.value = document.documentElement.dataset.localePref || "system";
  elements.localeSelect.addEventListener("change", (event) => setLocale(event.target.value));
  elements.themeToggle.addEventListener("click", cycleTheme);
  elements.harnessFilter.addEventListener("change", (event) => {
    state.filters.harness = event.target.value;
    renderTable();
  });
  elements.modelFilter.addEventListener("change", (event) => {
    state.filters.model = event.target.value;
    renderTable();
  });
  elements.thinkingFilter.addEventListener("change", (event) => {
    state.filters.thinking = event.target.value;
    renderTable();
  });
  elements.resultsBody.addEventListener("click", (event) => {
    const button = event.target.closest(".details-button");
    if (!button) return;
    const row = state.benchmark.results.find((item) => item.id === button.dataset.resultId);
    if (row) openDetails(row, button);
  });
  elements.dialogClose.addEventListener("click", closeDetails);
  elements.dialogDone.addEventListener("click", closeDetails);
  elements.resultDialog.addEventListener("click", (event) => {
    if (event.target === elements.resultDialog) closeDetails();
  });
  elements.resultDialog.addEventListener("close", () => {
    dialogTrigger?.focus();
    dialogTrigger = null;
  });

  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (document.documentElement.dataset.themeMode === "system") setTheme("system");
  });

  applyTranslations();
  try {
    const response = await fetch(DATA_URL, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    state.payload = await response.json();
    selectBenchmark(initialBenchmark(state.payload).id, false);
  } catch (error) {
    console.error(error);
    elements.resultsBody.innerHTML = `<tr><td class="empty-cell" colspan="10">${escapeHtml(t("dataError"))}</td></tr>`;
    elements.resultCount.textContent = t("dataError");
  }
}

init();
