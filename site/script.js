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
    heroTitle: "The model isn't everything.<br /><span>The whole setup matters.</span>",
    viewResults: "View results",
    viewGithub: "View GitHub",
    publicResults: "Public results",
    models: "Models",
    harnesses: "Harnesses",
    officialBest: "Official best",
    publicSnapshot: "Public results",
    snapshotUpdated: "Official snapshot updated {date}; curated sources verified {verified}.",
    source: "Source",
    sourceFilter: "Filter by source",
    allSources: "All sources",
    benchmarkOfficial: "Benchmark official",
    vendorReported: "Vendor-reported",
    penguinRun: "Penguin run",
    harness: "Harness",
    model: "Model",
    thinkingLevel: "Thinking level",
    harnessFilter: "Filter by harness",
    modelFilter: "Filter by model",
    thinkingFilter: "Filter by thinking level",
    allHarnesses: "All harnesses",
    allModels: "All models",
    allLevels: "All levels",
    showingResults: "Showing {shown} of {total} public results",
    tableHint: "Swipe to view the full table →",
    loadingResults: "Loading public results…",
    confidenceNote: "Every result has a score bar. Confidence whiskers appear only when the source reports a 95% interval; results without interval data show the bar alone.",
    dataCoverage: "Data coverage",
    coverageTitle: "From public baselines to Penguin runs.",
    coverageDescription: "See how official baselines, vendor reports, and Penguin runs are represented across every benchmark.",
    officialSnapshot: "Official snapshot",
    viewOfficialBenchmark: "View official benchmark",
    verifiedPenguinRun: "Verified Penguin run",
    viewFullReport: "View full report",
    successSummary: "{successes} successes / {trials} valid trials",
    resolutionRate: "Resolution rate",
    tokens: "Tokens",
    cost: "Cost",
    footerText: "Terminal-Bench official baselines · vendor reports · Penguin runs",
    rank: "Rank",
    releaseDate: "Release date",
    notReported: "Not reported",
    noResults: "No results match these filters.",
    officialSource: "Official source",
    details: "Details",
    resultDetails: "Result details",
    closeDetails: "Close details",
    openOfficialDetail: "Open official detail",
    openSource: "Open source",
    done: "Done",
    officialRank: "Official rank",
    notOfficiallyRanked: "Not officially ranked",
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
    sourceType: "Source type",
    publisher: "Publisher",
    sourcePage: "Evidence page",
    sourcePublished: "Source published",
    verifiedOn: "Verified on",
    protocolNote: "Reported protocol",
    harnessVersion: "Harness version",
    sorting: "Sort by {column}",
    dataError: "Public results could not be loaded. Start a local web server and refresh.",
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
    heroTitle: "模型不是全部，<br /><span>整套配置同样重要。</span>",
    viewResults: "查看榜单",
    viewGithub: "查看Github",
    publicResults: "公开结果",
    models: "模型",
    harnesses: "Harness",
    officialBest: "官方最高分",
    publicSnapshot: "公开结果",
    snapshotUpdated: "官方快照更新时间：{date}；人工来源核验于 {verified}。",
    source: "来源",
    sourceFilter: "按来源筛选",
    allSources: "全部来源",
    benchmarkOfficial: "Benchmark 官方",
    vendorReported: "厂商自报",
    penguinRun: "Penguin 实测",
    harness: "Harness",
    model: "模型",
    thinkingLevel: "思考等级",
    harnessFilter: "按 Harness 筛选",
    modelFilter: "按模型筛选",
    thinkingFilter: "按思考等级筛选",
    allHarnesses: "全部 Harness",
    allModels: "全部模型",
    allLevels: "全部等级",
    showingResults: "显示 {shown} / {total} 条公开结果",
    tableHint: "横向滑动查看完整表格 →",
    loadingResults: "正在加载公开结果…",
    confidenceNote: "所有结果都显示分数条；仅当来源披露 95% 置信区间时才显示误差线，未披露区间的数据只显示分数条。",
    dataCoverage: "数据覆盖",
    coverageTitle: "从公开基线，到 Penguin 实测。",
    coverageDescription: "清楚展示每个 Benchmark 收录的官方基线、厂商自报与 Penguin 实测。",
    officialSnapshot: "官方快照",
    viewOfficialBenchmark: "查看官方榜单",
    verifiedPenguinRun: "已验证的 Penguin 实测",
    viewFullReport: "查看完整报告",
    successSummary: "{successes} 次成功 / {trials} 次有效尝试",
    resolutionRate: "解决率",
    tokens: "Token",
    cost: "成本",
    footerText: "Terminal-Bench 官方基线 · 厂商自报 · Penguin 实测",
    rank: "排名",
    releaseDate: "发布日期",
    notReported: "未披露",
    noResults: "没有符合当前筛选条件的结果。",
    officialSource: "官方来源",
    details: "详情",
    resultDetails: "结果详情",
    closeDetails: "关闭详情",
    openOfficialDetail: "打开官方详情",
    openSource: "打开来源",
    done: "完成",
    officialRank: "官方排名",
    notOfficiallyRanked: "未参与官方排名",
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
    sourceType: "来源类型",
    publisher: "发布方",
    sourcePage: "证据页面",
    sourcePublished: "来源发布日期",
    verifiedOn: "核验日期",
    protocolNote: "来源披露的协议",
    harnessVersion: "Harness 版本",
    sorting: "按{column}排序",
    dataError: "无法加载公开结果，请启动本地 Web 服务后刷新。",
  },
};

const state = {
  payload: null,
  benchmark: null,
  locale: document.documentElement.dataset.locale || "en",
  filters: { source: "", harness: "", model: "", thinking: "" },
  sort: { key: "accuracy", direction: "desc" },
};

const elements = {
  benchSwitcher: document.querySelector(".bench-switcher"),
  localeSelect: document.querySelector(".locale-select"),
  themeToggle: document.querySelector(".theme-toggle"),
  sourceFilter: document.querySelector(".source-filter"),
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
  dialogOfficialLinkLabel: document.querySelector(".official-detail-link-label"),
  dialogClose: document.querySelector(".dialog-close"),
  dialogDone: document.querySelector(".dialog-done"),
  coverageGrid: document.querySelector(".coverage-grid"),
  penguinSpotlight: document.querySelector(".penguin-spotlight"),
};

let dialogTrigger = null;
const customSelects = new Map();

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

function closeCustomSelect(widget, restoreFocus = false) {
  if (!widget || widget.menu.hidden) return;
  widget.menu.hidden = true;
  widget.wrapper.classList.remove("is-open");
  widget.trigger.setAttribute("aria-expanded", "false");
  widget.trigger.removeAttribute("aria-activedescendant");
  widget.activeIndex = -1;
  widget.typeaheadBuffer = "";
  clearTimeout(widget.typeaheadTimer);
  if (restoreFocus) widget.trigger.focus();
}

function closeCustomSelects(except = null) {
  customSelects.forEach((widget) => {
    if (widget !== except) closeCustomSelect(widget);
  });
}

function customOptions(widget) {
  return [...widget.menu.querySelectorAll(".custom-select-option:not(:disabled)")];
}

function setCustomActiveOption(widget, position = "selected") {
  const options = customOptions(widget);
  if (!options.length) return;
  let index = options.findIndex((option) => option.getAttribute("aria-selected") === "true");
  if (typeof position === "number") index = (position + options.length) % options.length;
  if (position === "first") index = 0;
  if (position === "last") index = options.length - 1;
  if (index < 0) index = 0;
  widget.activeIndex = index;
  options.forEach((option, optionIndex) => {
    option.dataset.active = String(optionIndex === index);
  });
  const activeOption = options[index];
  widget.trigger.setAttribute("aria-activedescendant", activeOption.id);
  const optionTop = activeOption.offsetTop;
  const optionBottom = optionTop + activeOption.offsetHeight;
  if (optionTop < widget.menu.scrollTop) widget.menu.scrollTop = optionTop;
  if (optionBottom > widget.menu.scrollTop + widget.menu.clientHeight) {
    widget.menu.scrollTop = optionBottom - widget.menu.clientHeight;
  }
}

function setCustomSelectOpen(widget, open, activePosition = "selected") {
  if (!open) {
    closeCustomSelect(widget);
    return;
  }
  closeCustomSelects(widget);
  widget.menu.hidden = false;
  widget.wrapper.classList.add("is-open");
  widget.trigger.setAttribute("aria-expanded", "true");
  setCustomActiveOption(widget, activePosition);
}

function selectCustomOption(widget, option) {
  if (!option || option.disabled) return;
  if (widget.select.value !== option.dataset.value) {
    widget.select.value = option.dataset.value;
    widget.select.dispatchEvent(new Event("change", { bubbles: true }));
  }
  closeCustomSelect(widget, true);
  refreshCustomSelect(widget);
}

function refreshCustomSelect(widget) {
  if (!widget) return;
  const { select, trigger, value, menu } = widget;
  const wasOpen = !menu.hidden;
  const selected = select.selectedOptions[0] || select.options[0];
  value.textContent = selected?.textContent || "";
  if (!trigger.hasAttribute("aria-labelledby")) {
    const label = select.getAttribute("aria-label") || "";
    trigger.setAttribute("aria-label", [label, value.textContent].filter(Boolean).join(": "));
  }
  menu.replaceChildren();

  [...select.options].forEach((sourceOption, index) => {
    const option = document.createElement("button");
    option.type = "button";
    option.className = "custom-select-option";
    option.id = `${select.id}-option-${index}`;
    option.tabIndex = -1;
    option.dataset.value = sourceOption.value;
    option.disabled = sourceOption.disabled;
    option.setAttribute("role", "option");
    option.setAttribute("aria-selected", String(sourceOption.value === select.value));
    const optionLabel = document.createElement("span");
    optionLabel.textContent = sourceOption.textContent;
    option.append(optionLabel);
    option.addEventListener("click", () => {
      selectCustomOption(widget, option);
    });
    menu.append(option);
  });
  if (wasOpen) setCustomActiveOption(widget, "selected");
}

function enhanceCustomSelect(select) {
  if (customSelects.has(select)) return;
  const wrapper = document.createElement("div");
  wrapper.className = select.classList.contains("locale-select")
    ? "custom-select locale-custom-select"
    : "custom-select filter-custom-select";
  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "custom-select-trigger";
  trigger.id = `${select.id}-trigger`;
  trigger.setAttribute("role", "combobox");
  trigger.setAttribute("aria-haspopup", "listbox");
  trigger.setAttribute("aria-expanded", "false");
  trigger.setAttribute("aria-autocomplete", "none");
  const value = document.createElement("span");
  value.className = "custom-select-value";
  value.id = `${select.id}-value`;
  trigger.append(value);
  const menu = document.createElement("div");
  menu.id = `${select.id}-menu`;
  menu.className = "custom-select-menu";
  menu.setAttribute("role", "listbox");
  menu.tabIndex = -1;
  menu.hidden = true;
  trigger.setAttribute("aria-controls", menu.id);

  select.before(wrapper);
  select.classList.add("custom-select-native");
  select.setAttribute("aria-hidden", "true");
  select.tabIndex = -1;
  wrapper.append(select, trigger, menu);

  const associatedLabel = [...document.querySelectorAll("label")]
    .find((label) => label.htmlFor === select.id);
  if (associatedLabel) {
    associatedLabel.id ||= `${select.id}-label`;
    associatedLabel.htmlFor = trigger.id;
    trigger.setAttribute("aria-labelledby", `${associatedLabel.id} ${value.id}`);
    menu.setAttribute("aria-labelledby", associatedLabel.id);
  } else {
    menu.setAttribute("aria-label", select.getAttribute("aria-label") || value.textContent);
  }

  const widget = {
    select,
    wrapper,
    trigger,
    value,
    menu,
    activeIndex: -1,
    typeaheadBuffer: "",
    typeaheadTimer: null,
  };
  customSelects.set(select, widget);
  refreshCustomSelect(widget);

  trigger.addEventListener("click", () => {
    setCustomSelectOpen(widget, menu.hidden);
  });
  trigger.addEventListener("keydown", (event) => {
    const options = customOptions(widget);
    const isOpen = !menu.hidden;
    if (event.key === "Tab") {
      closeCustomSelect(widget);
      return;
    }
    if (event.key === "Escape") {
      if (isOpen) {
        event.preventDefault();
        closeCustomSelect(widget);
      }
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!isOpen) setCustomSelectOpen(widget, true);
      else selectCustomOption(widget, options[widget.activeIndex]);
      return;
    }
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      if (!isOpen) {
        setCustomSelectOpen(widget, true, event.key === "ArrowUp" ? "last" : "selected");
        return;
      }
      if (event.key === "Home") setCustomActiveOption(widget, "first");
      if (event.key === "End") setCustomActiveOption(widget, "last");
      if (event.key === "ArrowDown") setCustomActiveOption(widget, widget.activeIndex + 1);
      if (event.key === "ArrowUp") setCustomActiveOption(widget, widget.activeIndex - 1);
      return;
    }
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const query = `${widget.typeaheadBuffer}${event.key}`.toLocaleLowerCase();
      const matchIndex = options.findIndex((option) => (
        option.textContent.trim().toLocaleLowerCase().startsWith(query)
      ));
      if (matchIndex < 0) return;
      event.preventDefault();
      if (!isOpen) setCustomSelectOpen(widget, true);
      widget.typeaheadBuffer = query;
      clearTimeout(widget.typeaheadTimer);
      widget.typeaheadTimer = setTimeout(() => {
        widget.typeaheadBuffer = "";
      }, 600);
      setCustomActiveOption(widget, matchIndex);
    }
  });
  select.addEventListener("change", () => refreshCustomSelect(widget));
  new MutationObserver(() => refreshCustomSelect(widget)).observe(select, {
    childList: true,
    subtree: true,
    characterData: true,
  });
}

function enhanceCustomSelects() {
  [
    elements.localeSelect,
    elements.sourceFilter,
    elements.harnessFilter,
    elements.modelFilter,
    elements.thinkingFilter,
  ].forEach(enhanceCustomSelect);
  document.addEventListener("pointerdown", (event) => {
    const active = [...customSelects.values()].find((widget) => !widget.menu.hidden);
    if (active && !active.wrapper.contains(event.target)) closeCustomSelect(active);
  });
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
  elements.localeSelect.querySelector('option[value="system"]').textContent = t("followSystem");
  customSelects.forEach(refreshCustomSelect);
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

function entityName(item) {
  return item?.label
    ? `<span class="entity-name">${escapeHtml(item.label)}</span>`
    : missingValue();
}

function renderBenchSwitcher() {
  const benchmarks = state.payload.benchmarks;
  const activeIndex = Math.max(0, benchmarks.findIndex((bench) => bench.id === state.benchmark.id));
  elements.benchSwitcher.style.setProperty("--bench-count", benchmarks.length);

  let buttons = [...elements.benchSwitcher.querySelectorAll(".bench-tab")];
  if (!elements.benchSwitcher.querySelector(".bench-glider") || buttons.length !== benchmarks.length) {
    elements.benchSwitcher.replaceChildren();

    const glider = document.createElement("span");
    glider.className = "bench-glider";
    glider.setAttribute("aria-hidden", "true");
    elements.benchSwitcher.append(glider);

    benchmarks.forEach((bench) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "bench-tab";
      button.innerHTML = `<span class="bench-tab-prefix">TB</span><span class="bench-tab-version">${escapeHtml(bench.version)}</span>`;
      button.dataset.benchmark = bench.id;
      button.addEventListener("click", () => selectBenchmark(bench.id));
      elements.benchSwitcher.append(button);
    });
    buttons = [...elements.benchSwitcher.querySelectorAll(".bench-tab")];
  }

  buttons.forEach((button, index) => {
    button.setAttribute("aria-pressed", String(index === activeIndex));
  });
  elements.benchSwitcher.style.setProperty("--bench-index", activeIndex);
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

function sourceTypeLabel(sourceType) {
  const labels = {
    benchmark_official: t("benchmarkOfficial"),
    vendor_reported: t("vendorReported"),
    penguin_run: t("penguinRun"),
  };
  return labels[sourceType] || sourceType;
}

function updateSourceSelect(rows) {
  const values = [...new Set(rows.map((row) => row.source_type))];
  elements.sourceFilter.replaceChildren();
  const all = document.createElement("option");
  all.value = "";
  all.textContent = t("allSources");
  elements.sourceFilter.append(all);
  ["benchmark_official", "vendor_reported", "penguin_run"]
    .filter((value) => values.includes(value))
    .forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = sourceTypeLabel(value);
      elements.sourceFilter.append(option);
    });
  elements.sourceFilter.value = values.includes(state.filters.source)
    ? state.filters.source
    : "";
}

function rowsMatchingFilters(rows, filters) {
  return rows.filter((row) => (
    (!filters.source || row.source_type === filters.source)
    && (!filters.harness || row.harness.label === filters.harness)
    && (!filters.model || row.model.label === filters.model)
    && (!filters.thinking || row.thinking_level === filters.thinking)
  ));
}

function renderFilters() {
  const rows = state.benchmark.results;
  const unique = (availableRows, project) => [...new Set(availableRows.map(project).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b));

  updateSourceSelect(rows);
  state.filters.source = elements.sourceFilter.value;

  const harnessRows = rowsMatchingFilters(rows, {
    source: state.filters.source,
  });
  updateSelect(
    elements.harnessFilter,
    unique(harnessRows, (row) => row.harness.label),
    state.filters.harness,
    t("allHarnesses"),
  );
  state.filters.harness = elements.harnessFilter.value;

  const modelRows = rowsMatchingFilters(rows, {
    source: state.filters.source,
    harness: state.filters.harness,
  });
  updateSelect(
    elements.modelFilter,
    unique(modelRows, (row) => row.model.label),
    state.filters.model,
    t("allModels"),
  );
  state.filters.model = elements.modelFilter.value;

  const thinkingRows = rowsMatchingFilters(rows, {
    source: state.filters.source,
    harness: state.filters.harness,
    model: state.filters.model,
  });
  updateSelect(
    elements.thinkingFilter,
    unique(thinkingRows, (row) => row.thinking_level),
    state.filters.thinking,
    t("allLevels"),
  );
  state.filters.thinking = elements.thinkingFilter.value;
}

function filteredRows() {
  return rowsMatchingFilters(state.benchmark.results, state.filters);
}

function comparisonRanks(rows) {
  const ranked = [...rows].sort((left, right) => (
    right.accuracy - left.accuracy || left.model.label.localeCompare(right.model.label)
  ));
  const ranks = new Map();
  let previousAccuracy = null;
  let rank = 0;
  ranked.forEach((row, index) => {
    if (row.accuracy !== previousAccuracy) {
      rank = index + 1;
      previousAccuracy = row.accuracy;
    }
    ranks.set(row.id, rank);
  });
  return ranks;
}

function sortedRows(rows, ranks) {
  const { key, direction } = state.sort;
  const multiplier = direction === "asc" ? 1 : -1;
  const value = (row) => {
    if (key === "rank") return ranks.get(row.id);
    if (key === "harness") return row.harness.label;
    if (key === "model") return row.model.label;
    if (key === "source_type") return sourceTypeLabel(row.source_type);
    return row[key];
  };
  return [...rows].sort((left, right) => {
    const a = value(left);
    const b = value(right);
    if (a == null && b == null) return 0;
    if (a == null) return 1;
    if (b == null) return -1;
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
    state.sort = { key, direction: ["rank", "harness", "model", "source_type"].includes(key) ? "asc" : "desc" };
  }
  renderTable();
}

function renderTableHead() {
  const columns = [
    ["rank", "rank"],
    ["harness", "harness"],
    ["model", "model"],
    ["accuracy", "resolutionRate"],
    ["average_trial_duration_seconds", "avgDuration"],
    ["release_date", "releaseDate"],
    ["total_tokens", "tokens"],
    ["total_cost_usd", "cost"],
    ["source_type", "source"],
  ];
  const row = document.createElement("tr");
  columns.forEach(([key, labelKey]) => {
    const cell = document.createElement("th");
    cell.scope = "col";
    cell.className = `column-${key.replaceAll("_", "-")}${state.sort.key === key ? " is-active" : ""}`;
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
  const interval = ci == null ? "CI —" : `± ${ci.toFixed(1)}%`;
  return `
    <div class="rate-cell">
      <div class="rate-copy">
        <strong>${row.accuracy.toFixed(1)}%</strong>
        <span>${escapeHtml(interval)}</span>
      </div>
      <span class="accuracy-track" aria-hidden="true">
        <i class="accuracy-fill" style="width:${Math.min(100, Math.max(0, row.accuracy))}%"></i>
        ${ci == null ? "" : `
          <i class="accuracy-ci" style="left:${lower}%;width:${upper - lower}%"></i>
          <i class="accuracy-cap accuracy-cap-lower" style="left:${lower}%"></i>
          <i class="accuracy-cap accuracy-cap-upper" style="left:${upper}%"></i>
        `}
      </span>
    </div>`;
}

function sourceBadge(row) {
  const label = escapeHtml(sourceTypeLabel(row.source_type));
  return `<span class="source-badge source-${escapeHtml(row.source_type)}">${label}</span>`;
}

function missingValue(compact = false) {
  const label = escapeHtml(t("notReported"));
  return compact
    ? `<span class="missing-value" aria-label="${label}" title="${label}">—</span>`
    : `<span class="missing-value">${label}</span>`;
}

function renderTable() {
  renderTableHead();
  const filtered = filteredRows();
  const ranks = comparisonRanks(filtered);
  const rows = sortedRows(filtered, ranks);
  elements.resultCount.textContent = t("showingResults", {
    shown: rows.length,
    total: state.benchmark.result_count,
  });

  if (!rows.length) {
    elements.resultsBody.innerHTML = `<tr><td class="empty-cell" colspan="10">${escapeHtml(t("noResults"))}</td></tr>`;
    return;
  }

  elements.resultsBody.innerHTML = rows.map((row) => {
    const comparisonRank = ranks.get(row.id);
    const active = (key) => state.sort.key === key ? " is-active" : "";
    const effort = row.thinking_level
      ? `<span class="effort-pill">${escapeHtml(row.thinking_level)}</span>`
      : `<span class="effort-pill muted">${escapeHtml(t("notReported"))}</span>`;
    return `
      <tr>
        <td class="rank-cell${active("rank")}"><span class="rank-badge${comparisonRank <= 3 ? ` rank-${comparisonRank}` : ""}">${comparisonRank}</span></td>
        <td class="entity-cell harness-cell${active("harness")}">${entityName(row.harness)}</td>
        <td class="entity-cell model-cell${active("model")}">
          <div class="model-primary">${entityName(row.model)}${effort}</div>
        </td>
        <td class="${active("accuracy").trim()}">${accuracyCell(row)}</td>
        <td class="number-cell${active("average_trial_duration_seconds")}">${row.average_trial_duration_seconds == null ? missingValue(true) : escapeHtml(formatDuration(row.average_trial_duration_seconds))}</td>
        <td class="date-cell${active("release_date")}">${escapeHtml(formatDate(row.release_date))}</td>
        <td class="number-cell${active("total_tokens")}">${row.total_tokens == null ? missingValue(true) : escapeHtml(formatTokens(row.total_tokens))}</td>
        <td class="number-cell${active("total_cost_usd")}">${row.total_cost_usd == null ? missingValue(true) : escapeHtml(formatCost(row.total_cost_usd))}</td>
        <td class="source-cell${active("source_type")}">${sourceBadge(row)}</td>
        <td class="details-cell"><button class="details-button" type="button" data-result-id="${escapeHtml(row.id)}">${escapeHtml(t("details"))}</button></td>
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

function detailSummaryItem(value, label) {
  if (value == null || value === "") return "";
  return `<div><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span></div>`;
}

function openDetails(row, trigger) {
  dialogTrigger = trigger;
  elements.dialogTitle.textContent = `${row.model.label} × ${row.harness.label || t("notReported")}`;
  elements.dialogSubtitle.textContent = `${state.benchmark.name} · ${row.thinking_level || t("notReported")}`;

  const confidence = row.accuracy_ci95_half_width == null
    ? null
    : `± ${formatPercent(row.accuracy_ci95_half_width)}`;
  const provenanceValue = sourceTypeLabel(row.source_type);
  const provenanceDate = row.rank != null
    ? detailSummaryItem(`#${row.rank}`, t("officialRank"))
    : detailSummaryItem(
      row.verified_at ? formatDate(row.verified_at) : null,
      t("verifiedOn"),
    );
  const summary = `
    <div class="detail-summary">
      ${detailSummaryItem(formatPercent(row.accuracy, 1), t("resolutionRate"))}
      ${detailSummaryItem(provenanceValue, t("sourceType"))}
      ${provenanceDate}
    </div>`;

  const configuration = detailGroup(t("configuration"), [
    detailItem(t("harness"), detailLink(row.harness, row.harness?.label) || escapeHtml(row.harness?.label)),
    detailItem(t("harnessVersion"), row.harness_version ? escapeHtml(row.harness_version) : null),
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
  const evidenceUrl = safeUrl(row.source_url);
  const protocolNote = row.protocol_note !== null && typeof row.protocol_note === "object"
    ? row.protocol_note[state.locale] || row.protocol_note.en
    : row.protocol_note;
  const sourceLinks = detailGroup(t("sourceLinks"), [
    detailItem(t("sourcePage"), evidenceUrl
      ? `<a href="${escapeHtml(evidenceUrl)}" target="_blank" rel="noreferrer">${escapeHtml(row.source_title || row.source_publisher || t("source"))} ↗</a>`
      : null),
    detailItem(t("publisher"), row.source_publisher ? escapeHtml(row.source_publisher) : null),
    detailItem(t("sourceType"), escapeHtml(sourceTypeLabel(row.source_type))),
    detailItem(t("verifiedOn"), row.verified_at ? escapeHtml(formatDate(row.verified_at)) : null),
    detailItem(t("sourcePublished"), row.published_at ? escapeHtml(formatDate(row.published_at)) : null),
    detailItem(t("protocolNote"), protocolNote ? escapeHtml(protocolNote) : null),
    detailItem(t("officialRow"), officialRow
      ? `<a href="${escapeHtml(officialRow)}" target="_blank" rel="noreferrer">Harbor ↗</a>`
      : null),
    detailItem(t("submission"), detailLink(row.submission, row.submission?.label)),
    detailItem(t("benchmarkSnapshot"), `<a href="${escapeHtml(safeUrl(state.benchmark.official_url))}" target="_blank" rel="noreferrer">tbench.ai ↗</a>`),
  ]);

  elements.dialogBody.innerHTML = `${summary}<div class="detail-groups">${sourceLinks}${configuration}${scores}${usage}</div>`;
  elements.dialogOfficialLink.href = officialRow || evidenceUrl || state.benchmark.official_url;
  elements.dialogOfficialLinkLabel.textContent = officialRow ? t("openOfficialDetail") : t("openSource");
  elements.resultDialog.showModal();
}

function closeDetails() {
  if (elements.resultDialog.open) elements.resultDialog.close();
}

function renderCoverage() {
  const benchmarks = state.payload?.benchmarks || [];
  elements.coverageGrid.innerHTML = benchmarks.map((bench) => {
    const isCurrent = bench.id === state.benchmark.id;
    const officialUrl = safeUrl(bench.official_url);
    const officialLink = officialUrl
      ? `<a class="coverage-source-link" href="${escapeHtml(officialUrl)}" target="_blank" rel="noreferrer">${escapeHtml(t("viewOfficialBenchmark"))}</a>`
      : "";
    return `
      <article class="coverage-card${isCurrent ? " is-current" : ""}"${isCurrent ? ' aria-current="true"' : ""}>
        <header class="coverage-card-header">
          <div>
            <span class="coverage-version">TB ${escapeHtml(bench.version)}</span>
            <h3>${escapeHtml(bench.name)}</h3>
          </div>
          ${officialLink}
        </header>
        <div class="coverage-total">
          <strong>${escapeHtml(formatNumber(bench.result_count) ?? "0")}</strong>
          <span>${escapeHtml(t("publicResults"))}</span>
        </div>
        <dl class="coverage-source-grid">
          <div><dt>${escapeHtml(t("benchmarkOfficial"))}</dt><dd>${escapeHtml(formatNumber(bench.official_result_count ?? 0))}</dd></div>
          <div><dt>${escapeHtml(t("vendorReported"))}</dt><dd>${escapeHtml(formatNumber(bench.vendor_result_count ?? 0))}</dd></div>
          <div><dt>${escapeHtml(t("penguinRun"))}</dt><dd>${escapeHtml(formatNumber(bench.penguin_result_count ?? 0))}</dd></div>
        </dl>
        <footer class="coverage-card-footer">
          <span>${escapeHtml(formatNumber(bench.model_count) ?? "0")} ${escapeHtml(t("models"))}</span>
          <span>${escapeHtml(formatNumber(bench.harness_count) ?? "0")} ${escapeHtml(t("harnesses"))}</span>
          <span>${escapeHtml(t("officialSnapshot"))} · ${escapeHtml(formatSnapshot(bench.snapshot_updated_at))}</span>
        </footer>
      </article>
    `;
  }).join("");

  const penguinRuns = benchmarks.flatMap((bench) => bench.results
    .filter((row) => row.source_type === "penguin_run")
    .map((row) => ({ bench, row })));
  penguinRuns.sort((left, right) => {
    const leftDate = Date.parse(left.row.verified_at || left.row.published_at || "") || 0;
    const rightDate = Date.parse(right.row.verified_at || right.row.published_at || "") || 0;
    return rightDate - leftDate;
  });

  const latest = penguinRuns[0];
  if (!latest) {
    elements.penguinSpotlight.hidden = true;
    elements.penguinSpotlight.replaceChildren();
    return;
  }

  const { bench, row } = latest;
  const protocolNote = row.protocol_note !== null && typeof row.protocol_note === "object"
    ? row.protocol_note[state.locale] || row.protocol_note.en
    : row.protocol_note;
  const evidenceUrl = safeUrl(row.source_url || row.official_detail_url);
  const reportLink = evidenceUrl
    ? `<a class="button button-primary penguin-report-link" href="${escapeHtml(evidenceUrl)}" target="_blank" rel="noreferrer">${escapeHtml(t("viewFullReport"))}</a>`
    : "";
  const harnessName = row.harness_version
    ? `${row.harness.label} ${row.harness_version}`
    : row.harness.label;
  const successSummary = row.successes != null && row.trial_count != null
    ? t("successSummary", {
      successes: formatNumber(row.successes),
      trials: formatNumber(row.trial_count),
    })
    : "";

  elements.penguinSpotlight.hidden = false;
  elements.penguinSpotlight.innerHTML = `
    <div class="penguin-spotlight-copy">
      <div class="penguin-spotlight-label">
        <img src="favicon.svg" alt="" />
        <span>${escapeHtml(t("verifiedPenguinRun"))}</span>
      </div>
      <span class="penguin-benchmark-pill">${escapeHtml(bench.name)}</span>
      <h3>${escapeHtml(harnessName)} <span>×</span> ${escapeHtml(row.model.label)}</h3>
      ${protocolNote ? `<p>${escapeHtml(protocolNote)}</p>` : ""}
    </div>
    <div class="penguin-spotlight-result">
      <div class="penguin-score">
        <strong>${escapeHtml(formatPercent(row.accuracy, 1))}</strong>
        <span>${escapeHtml(t("resolutionRate"))}</span>
        ${successSummary ? `<small>${escapeHtml(successSummary)}</small>` : ""}
      </div>
      <dl class="penguin-run-facts">
        <div><dt>${escapeHtml(t("thinkingLevel"))}</dt><dd>${escapeHtml(row.thinking_level || t("notReported"))}</dd></div>
        <div><dt>${escapeHtml(t("verifiedOn"))}</dt><dd>${escapeHtml(formatDate(row.verified_at))}</dd></div>
      </dl>
      ${reportLink}
    </div>
  `;
}

function renderBenchmark() {
  applyTranslations();
  renderBenchSwitcher();
  renderFilters();

  const bench = state.benchmark;
  document.querySelector(".current-bench-name").textContent = bench.name;
  document.querySelector(".current-bench-description").textContent = bench.description[state.locale];
  document.querySelector(".results-title").textContent = bench.name;
  document.querySelector(".results-description").textContent = t("snapshotUpdated", {
    date: formatSnapshot(bench.snapshot_updated_at),
    verified: formatDate(state.payload.curated_verified_at),
  });
  document.querySelector(".stat-results").textContent = bench.result_count;
  document.querySelector(".stat-models").textContent = bench.model_count;
  document.querySelector(".stat-harnesses").textContent = bench.harness_count;
  document.querySelector(".stat-best").textContent = `${bench.official_best_accuracy.toFixed(1)}%`;
  document.querySelector(".table-caption").textContent = `${bench.name} public results`;
  document.querySelectorAll(".benchmark-source-link").forEach((link) => {
    link.href = bench.official_url;
  });
  document.querySelector(".snapshot-label").textContent = `tbench.ai · ${bench.version}`;
  renderTable();
  renderCoverage();
}

function selectBenchmark(id, updateUrl = true) {
  const bench = state.payload.benchmarks.find((item) => item.id === id);
  if (!bench) return;
  state.benchmark = bench;
  state.filters = { source: "", harness: "", model: "", thinking: "" };
  state.sort = { key: "accuracy", direction: "desc" };
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
  const localePreference = document.documentElement.dataset.localePref || "system";
  elements.localeSelect.value = ["system", "en", "zh"].includes(localePreference)
    ? localePreference
    : state.locale;
  enhanceCustomSelects();
  elements.localeSelect.addEventListener("change", (event) => setLocale(event.target.value));
  elements.themeToggle.addEventListener("click", cycleTheme);
  elements.sourceFilter.addEventListener("change", (event) => {
    state.filters.source = event.target.value;
    renderFilters();
    renderTable();
  });
  elements.harnessFilter.addEventListener("change", (event) => {
    state.filters.harness = event.target.value;
    renderFilters();
    renderTable();
  });
  elements.modelFilter.addEventListener("change", (event) => {
    state.filters.model = event.target.value;
    renderFilters();
    renderTable();
  });
  elements.thinkingFilter.addEventListener("change", (event) => {
    state.filters.thinking = event.target.value;
    renderFilters();
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
