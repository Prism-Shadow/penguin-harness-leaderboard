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
    confidenceNote: "Resolution rate ± 95% confidence interval. Tokens and cost are totals reported by tbench.ai.",
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
    confidenceNote: "解决率 ± 95% 置信区间；Token 和成本均为 tbench.ai 公布的评测总量。",
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
};

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
    theme === "dark" ? "#07090c" : "#f5f7f8";
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

function linkedName(item, org) {
  const label = escapeHtml(item.label);
  const href = safeUrl(item.url);
  const name = href
    ? `<a class="entity-link" href="${escapeHtml(href)}">${label}<span aria-hidden="true">↗</span></a>`
    : `<span class="entity-name">${label}</span>`;
  return `${name}<small>${escapeHtml(org.label)}</small>`;
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
  elements.resultsHead.replaceChildren(row);
}

function accuracyCell(row) {
  const ci = row.accuracy_ci95_half_width;
  const lower = Math.max(0, row.accuracy - (ci ?? 0));
  const upper = Math.min(100, row.accuracy + (ci ?? 0));
  const intervalWidth = Math.max(0, upper - lower);
  const interval = ci == null ? "" : `<span>± ${escapeHtml(ci.toFixed(1))}%</span>`;
  const whisker = ci == null ? "" : `
    <i class="ci-whisker" style="left:${lower.toFixed(2)}%;width:${intervalWidth.toFixed(2)}%">
      <b></b><b></b>
    </i>`;
  return `
    <div class="rate-cell">
      <span class="rate-value"><strong>${row.accuracy.toFixed(1)}%</strong>${interval}</span>
      <span class="rate-track" aria-hidden="true">
        <i class="rate-fill" style="width:${row.accuracy}%"></i>
        ${whisker}
      </span>
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
    elements.resultsBody.innerHTML = `<tr><td class="empty-cell" colspan="7">${escapeHtml(t("noResults"))}</td></tr>`;
    return;
  }

  elements.resultsBody.innerHTML = rows.map((row) => {
    const effort = row.thinking_level
      ? `<span class="effort-pill">${escapeHtml(row.thinking_level)}</span>`
      : `<span class="effort-pill muted">${escapeHtml(t("notReported"))}</span>`;
    return `
      <tr>
        <td class="rank-cell"><span>${row.rank}</span></td>
        <td class="entity-cell harness-cell">${linkedName(row.harness, row.harness_org)}</td>
        <td class="entity-cell model-cell">
          ${linkedName(row.model, row.model_org)}
          ${effort}
        </td>
        <td>${accuracyCell(row)}</td>
        <td class="date-cell">${escapeHtml(formatDate(row.release_date))}</td>
        <td class="number-cell">${escapeHtml(formatTokens(row.total_tokens))}</td>
        <td class="number-cell">${escapeHtml(formatCost(row.total_cost_usd))}</td>
      </tr>`;
  }).join("");
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
    elements.resultsBody.innerHTML = `<tr><td class="empty-cell" colspan="7">${escapeHtml(t("dataError"))}</td></tr>`;
    elements.resultCount.textContent = t("dataError");
  }
}

init();
