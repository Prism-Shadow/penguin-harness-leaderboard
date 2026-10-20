const DATA_URL = "data/benchmarks.json";
// Publish only benchmarks with full-suite Penguin results; retain other snapshots in the data.
const PUBLISHED_BENCHMARK_IDS = ["terminal-bench-2.1"];
// Chart viewport only: results outside this range remain in the table and data.
const PARETO_COST_MAX = 1200;
const PARETO_COST_STEP = 300;
const THEME_KEY = "penguin-leaderboard.theme";
const LOCALE_KEY = "penguin-leaderboard.locale";

const translations = {
  en: {
    skipToResults: "Skip to results",
    home: "Penguin Harness Leaderboard home",
    siteControls: "Site controls",
    language: "Language",
    followSystem: "Follow system",
    theme: "Theme: {mode}",
    system: "system",
    light: "light",
    dark: "dark",
    source: "Source",
    sourceFilter: "Filter by source",
    allSources: "All sources",
    benchmarkOfficial: "Terminal-Bench",
    vendorReported: "Vendor",
    penguinRun: "Penguin",
    harness: "Harness",
    model: "Model",
    thinkingLevel: "Thinking effort",
    harnessFilter: "Filter by harness",
    modelFilter: "Filter by model",
    thinkingFilter: "Filter by thinking effort",
    allHarnesses: "All harnesses",
    allModels: "All models",
    allLevels: "All efforts",
    showingResults: "Showing {shown} of {total} public results",
    filters: "Filters",
    clearFilters: "Clear all",
    exportResults: "Copy / export",
    exportHint: "Copy / export results",
    copyLink: "Copy link",
    copyFiltersLink: "Copy filters link",
    copyMarkdown: "Copy Markdown",
    copyPng: "Copy PNG",
    downloadPng: "Download PNG",
    downloadSvg: "Download SVG",
    exportWorking: "Preparing…",
    copied: "Copied",
    downloaded: "Downloaded",
    copyFailed: "Clipboard unavailable or denied. Please use a download option.",
    linkCopyFailed: "Could not copy. Please copy the URL from your address bar.",
    exportFailed: "Export failed. Please try again.",
    loadingResults: "Loading public results…",
    resolutionRate: "Resolution rate",
    tokens: "Tokens",
    cost: "Cost",
    rowNumber: "RANK",
    compressionColumn: "Compact at",
    timeoutColumn: "Time budget",
    releaseDate: "Release date",
    notReported: "Not reported",
    noResults: "No results match these filters.",
    officialSource: "Official source",
    viewHarnessDetails: "View result details for {harness} with {model}",
    resultDetails: "Result details",
    closeDetails: "Close details",
    openOfficialDetail: "Open official detail",
    openSource: "Open source",
    done: "Done",
    officialRank: "Official rank (all efforts)",
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
    confidenceRange: "95% CI {lower}–{upper}",
    rewardHacks: "Reward-hack rate",
    rewardHacksMeaning: "Percentage of trials disqualified for reward hacking, not a count. A source minus sign indicates the score already accounts for them; do not subtract it again.",
    passAtMeaning: "Estimated probability of at least one success in k attempts, averaged over tasks; not the overall successful-attempt rate.",
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
    paretoAxisCost: "Recorded total cost (USD, 0–{max})",
    paretoRangeNote: "The chart shows costs from $0 to ${max}. Higher-cost results remain available in the table.",
    resultView: "Results view",
    tableView: "Table",
    paretoView: "Pareto",
    paretoLowest: "Lowest recorded cost in source",
    paretoHighest: "Highest resolution rate in source",
    paretoShade: "The shaded area is above/left of the observed envelope. It is not a confidence interval or a claim of equal evaluation conditions.",
    paretoFrontierMeaning: "Observed frontier within this source only. Lines are visual guides, not additional experiments or proof of statistical significance.",
    paretoComparison: "Blue circles: Penguin; gray squares: benchmark-official results. Each source has its own frontier. Costs are recorded totals, not an equal-budget comparison; some Penguin trial costs are missing. Hover or select a point for its source, configuration and cost coverage.",
    paretoEmpty: "No results with a reported cost in the $0–${max} chart range. See the table for all results.",
    paretoPoint: "{model}, {harness}: {score}, {cost}. Open result details.",
    viewConfiguration: "View configuration",
    recordedCost: "Recorded cost",
    recordedUsage: "Recorded usage; completeness unconfirmed",
    costIncomplete: "Recorded cost only; {missing} of {trials} trials have no cost. Not a complete bill.",
    compressionTrigger: "Compression trigger",
    timeoutMultiplier: "Global timeout multiplier",
    concurrency: "Concurrency",
    attemptsPerTask: "Attempts per task",
    runDate: "Run date (as reported)",
    configuredVersion: "Harness version (Job Config)",
    modelId: "Model ID",
    paretoTooltipRate: "Resolution rate",
    paretoTooltipCost: "Recorded total",
    paretoTooltipOfficialCost: "Reported total",
    paretoConfigSummary: "Thinking: {thinking} · Compaction: {compression} · Timeout: {timeout}×",
    modelRevision: "Model revision",
    modelRevisionConfirmed: "{revision} · user-confirmed on {date}; not stated in the archived Job Config",
    archiveStatus: "Trace archive",
    traceNotArchived: "Results/configs archived; full traces not archived",
    traceArchivedWithGaps: "{archived}/{trials} standard traces archived locally; {missing} missing at source.",
    traceArchivedOn: "Trace collection date",
    traceFormatIssues: "Native trace format",
    traceInvalidJsonl: "{count} JSONL files have a malformed final line; originals preserved.",
    runnerDefault: "runner-confirmed default",
    harnessMode: "Harness mode",
    timeoutNote: "Reported time limit",
    configVerifiedOn: "Configuration verified on",
    officialSubmission: "Pinned submission JSON",
    officialTimeoutCheck: "Official run configuration check",
    mixedVersions: "Mixed versions",
    partialVersions: "Version partly unknown",
    versionAttempts: "{version} · {count} attempts",
    versionNote: "Version observations",
    configEvidence: "Run configuration evidence",
    viewConfigEvidence: "View source configuration",
    configCoverage: "Configuration audit scope",
    configCoverageValue: "All {count} linked attempts checked; not a sample.",
    rawConfig: "Additional reported configuration",
    configDocumentation: "Parameter documentation",
    meanTaskCost: "Reported mean cost per task",
    contextWindow: "Reported context window",
    perTaskUnit: "/task (mean)",
    perTaskCostMeaning: "Reported mean cost per task, not total cost. Excluded from total-cost sorting and the Pareto plot.",
    ciEvidence: "Interval source",
    reportedCi: "Reported 95% CI; ± is in percentage points, not relative percent.",
    derivedCi: "Approximate 95% CI calculated from archived trials; ± is in percentage points.",
    derivedCiMethod: "{tasks} fixed tasks × {attempts} attempts. Per-task standard error × 1.96; {missing} missing rewards retained as failures. Not pass@5 or an officially certified interval.",
    derivedCiLimit: "With only five attempts per task, all-success/all-failure tasks contribute zero estimated variance. This approximation does not cover different tasks, model versions or systematic environment changes, or establish significant differences between configurations.",
    ciMethod: "Interval method",
    ciLimit: "Interval limitations",
    ciCalculatedOn: "Interval calculated on",
    rowNumberMeaning: "Position in the current filtered and sorted view; not an official rank.",
    harnessMeaning: "Task-running framework and version for this observation. Select its name for evidence.",
    modelMeaning: "Model and source-reported thinking effort; the same effort label across models does not imply an equal compute budget.",
    compressionMeaning: "Verified compaction trigger in tokens. Context windows are not triggers; window information remains in Details.",
    timeoutMeaning: "Multiplier applied to each task's original time limit, not a fixed duration. Unreported multipliers appear as —; other reported time limits remain in Harness details.",
    rateMeaning: "Source-reported success rate. Penguin: successful attempts / all attempts, not pass@k.",
    costMeaning: "Reported USD total; /task explicitly marks a mean instead. Sorting uses totals only, with unavailable totals last. Missing billing entries are not zero.",
    sourceMeaning: "Who reports this observation; source labels do not guarantee matching evaluation protocols.",
    missingMeaning: "No verified value available; not zero, disabled, or a confirmed default.",
  },
  zh: {
    skipToResults: "跳到榜单",
    home: "Penguin Harness 榜单首页",
    siteControls: "网站控制",
    language: "语言",
    followSystem: "跟随系统",
    theme: "主题：{mode}",
    system: "跟随系统",
    light: "浅色",
    dark: "深色",
    source: "来源",
    sourceFilter: "按来源筛选",
    allSources: "全部来源",
    benchmarkOfficial: "Terminal-Bench",
    vendorReported: "Vendor",
    penguinRun: "Penguin",
    harness: "Harness",
    model: "模型",
    thinkingLevel: "思考强度",
    harnessFilter: "按 Harness 筛选",
    modelFilter: "按模型筛选",
    thinkingFilter: "按思考强度筛选",
    allHarnesses: "全部 Harness",
    allModels: "全部模型",
    allLevels: "全部强度",
    showingResults: "显示 {shown} / {total} 条公开结果",
    filters: "筛选",
    clearFilters: "清除全部",
    exportResults: "复制 / 导出",
    exportHint: "复制 / 导出结果",
    copyLink: "复制链接",
    copyFiltersLink: "复制当前筛选链接",
    copyMarkdown: "复制 Markdown",
    copyPng: "复制 PNG",
    downloadPng: "下载 PNG",
    downloadSvg: "下载 SVG",
    exportWorking: "正在准备…",
    copied: "已复制",
    downloaded: "已下载",
    copyFailed: "剪贴板不可用或未获授权，请使用下载选项。",
    linkCopyFailed: "复制失败，请从地址栏复制链接。",
    exportFailed: "导出失败，请重试。",
    loadingResults: "正在加载公开结果…",
    resolutionRate: "通过率",
    tokens: "Token",
    cost: "成本",
    rowNumber: "序号",
    compressionColumn: "压缩阈值",
    timeoutColumn: "超时倍率",
    releaseDate: "发布日期",
    notReported: "未披露",
    noResults: "没有符合当前筛选条件的结果。",
    officialSource: "官方来源",
    viewHarnessDetails: "查看 {harness} 与 {model} 的结果详情",
    resultDetails: "结果详情",
    closeDetails: "关闭详情",
    openOfficialDetail: "打开官方详情",
    openSource: "打开来源",
    done: "完成",
    officialRank: "官方全配置排名",
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
    confidenceRange: "95% 置信区间 {lower}–{upper}",
    rewardHacks: "Reward hack 比例",
    rewardHacksMeaning: "因奖励作弊被判无效的尝试占比，不是个数。来源中的负号表示通过率已计入该处理，不要再次扣分。",
    passAtMeaning: "每个任务 k 次尝试至少成功一次的概率估计，再对任务取平均；不是全部尝试的成功比例。",
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
    paretoAxisCost: "已记录总成本（美元，0–{max}）",
    paretoRangeNote: "图中展示 0–{max} 美元范围内的记录；超出范围的结果仍保留在表格中。",
    resultView: "结果视图",
    tableView: "表格",
    paretoView: "帕累托",
    paretoLowest: "本来源最低已记录成本",
    paretoHighest: "本来源最高通过率",
    paretoShade: "浅灰区域位于当前观测边界上方或左侧，仅辅助阅读，不是置信区间，也不代表运行条件相同。",
    paretoFrontierMeaning: "仅按该来源的观测结果计算前沿。连线仅辅助阅读，不代表额外实验或统计显著性。",
    paretoComparison: "蓝色圆点：Penguin；灰色方点：Benchmark 官方结果。按来源分别绘制前沿。成本为已记录总额，不代表等预算对照；部分 Penguin 尝试的费用缺失。悬停或点击数据点查看来源、配置与费用覆盖情况。",
    paretoEmpty: "当前筛选下没有成本在 0–{max} 美元范围内的记录，完整结果可在表格查看。",
    paretoPoint: "{model}，{harness}：{score}，{cost}。打开结果详情。",
    viewConfiguration: "查看配置",
    recordedCost: "已记录成本",
    recordedUsage: "已记录用量，完整性待确认",
    costIncomplete: "仅为已记录成本；{trials} 条尝试中有 {missing} 条费用缺失，不是完整账单。",
    compressionTrigger: "压缩触发阈值",
    timeoutMultiplier: "全局超时倍率",
    concurrency: "并发数",
    attemptsPerTask: "每任务尝试数",
    runDate: "运行日期（按源记录）",
    configuredVersion: "Harness 版本（配置指定）",
    modelId: "Model ID",
    paretoTooltipRate: "通过率",
    paretoTooltipCost: "已记录总成本",
    paretoTooltipOfficialCost: "来源报告总成本",
    paretoConfigSummary: "思考：{thinking} · 压缩：{compression} · 超时：{timeout}×",
    modelRevision: "模型版本确认",
    modelRevisionConfirmed: "{revision} · 用户于 {date} 确认；留档 Job Config 未注明该后缀",
    archiveStatus: "轨迹留档状态",
    traceNotArchived: "结果/配置已留档，完整 trace 尚未归档",
    traceArchivedWithGaps: "已本地留档 {archived}/{trials} 条标准轨迹；源端缺失 {missing} 条。",
    traceArchivedOn: "轨迹整理日期",
    traceFormatIssues: "原生轨迹格式",
    traceInvalidJsonl: "{count} 个 JSONL 文件末行格式异常，已原样保留。",
    runnerDefault: "提供者确认的默认值",
    harnessMode: "运行模式",
    timeoutNote: "来源报告的时间限制",
    configVerifiedOn: "配置核验日期",
    officialSubmission: "官方提交 JSON",
    officialTimeoutCheck: "官方运行配置检查",
    mixedVersions: "混合版本",
    partialVersions: "版本部分未知",
    versionAttempts: "{version} · {count} 次尝试",
    versionNote: "版本记录说明",
    configEvidence: "运行配置证据",
    viewConfigEvidence: "查看来源配置",
    configCoverage: "配置核验范围",
    configCoverageValue: "核验了该成绩关联的全部 {count} 次尝试，并非抽样。",
    rawConfig: "来源补充配置",
    configDocumentation: "参数官方说明",
    meanTaskCost: "来源报告的每任务平均成本",
    contextWindow: "来源报告的上下文窗口",
    perTaskUnit: "/任务均值",
    perTaskCostMeaning: "来源报告的每任务平均成本，不是总成本；不参与总成本排序及帕累托图绘制。",
    ciEvidence: "置信区间来源",
    reportedCi: "来源报告的 95% 置信区间；± 表示百分点，不是相对百分比。",
    derivedCi: "由归档试验数据计算的近似 95% 置信区间；± 表示百分点。",
    derivedCiMethod: "固定 {tasks} 道任务，每题 {attempts} 次；按任务计算标准误，再乘以 1.96。{missing} 条缺失奖励按未成功计，保留在分母中。这不是 pass@5，也不是官方认证区间。",
    derivedCiLimit: "每题仅 5 次，全成功或全失败任务的估计方差贡献为零，不代表没有真实波动。此近似区间不涵盖任务集、模型版本或系统环境变化，也不能单凭它判断配置差异显著。",
    ciMethod: "区间计算方法",
    ciLimit: "区间局限",
    ciCalculatedOn: "区间补算日期",
    rowNumberMeaning: "当前筛选、排序后的行号，不代表官方排名。",
    harnessMeaning: "本条实验执行任务的框架及版本；点击名称可查看证据。",
    modelMeaning: "模型及来源报告的思考强度；不同模型的同名强度不等于相同计算预算。",
    compressionMeaning: "已核实的压缩触发阈值，单位 tokens。上下文窗口不等于触发阈值，窗口信息保留在详情中。",
    timeoutMeaning: "对各任务原始时限的缩放倍数，不是固定时长。未披露倍率时显示 —；其他时间限制保留在 Harness 详情中。",
    rateMeaning: "来源报告的成功比例；Penguin 为成功尝试数 ÷ 全部尝试数，不是 pass@k。",
    costMeaning: "来源报告的整组美元费用；/任务明确表示平均成本。仅按总成本排序，总成本未知的排在末尾；缺失账单项不是零。",
    sourceMeaning: "这条结果由谁报告；来源标签不保证运行协议相同。",
    missingMeaning: "暂无已核实的数值，不代表零、关闭或已确认的默认值。",
  },
};

const state = {
  payload: null,
  benchmark: null,
  locale: document.documentElement.dataset.locale || "en",
  filters: { source: "", harness: "", model: "", thinking: "" },
  sort: { key: "total_cost_usd", direction: "asc" },
  sortInteracted: false,
  view: "table",
  filterCategory: "source",
  paretoSelectedId: null,
};

const elements = {
  toolbar: document.querySelector(".result-toolbar"),
  exportToggle: document.querySelector(".export-toggle"),
  exportMenu: document.querySelector(".export-menu"),
  copyLink: document.querySelector(".copy-link"),
  actionStatus: document.querySelector(".action-status"),
  filterToggle: document.querySelector(".filter-toggle"),
  filterMenu: document.querySelector(".filter-menu"),
  filterCategories: document.querySelector(".filter-categories"),
  filterOptions: document.querySelector(".filter-options"),
  viewTabs: document.querySelector(".view-tabs"),
  tablePanel: document.querySelector("#table-panel"),
  paretoSection: document.querySelector("#pareto"),
  localeSelect: document.querySelector(".locale-select"),
  themeToggle: document.querySelector(".theme-toggle"),
  sourceFilter: document.querySelector(".source-filter"),
  harnessFilter: document.querySelector(".harness-filter"),
  modelFilter: document.querySelector(".model-filter"),
  thinkingFilter: document.querySelector(".thinking-filter"),
  resultCount: document.querySelector(".result-count"),
  tableWrap: document.querySelector(".table-wrap"),
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
  paretoPanel: document.querySelector(".pareto-panel"),
  paretoChart: document.querySelector(".pareto-chart"),
  paretoCanvas: document.querySelector(".pareto-canvas"),
  paretoTooltip: document.querySelector(".pareto-tooltip"),
  paretoReadout: document.querySelector(".pareto-readout"),
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
    const experimentSource = url.origin === "http://vps5.dev.qying.site:8002"
      && url.pathname.startsWith("/jobs/");
    return url.protocol === "https:" || experimentSource ? url.href : "";
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
    menu.setAttribute("aria-label", label || value.textContent);
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
  enhanceCustomSelect(elements.localeSelect);
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
  elements.themeToggle.querySelectorAll("[data-theme-icon]").forEach((icon) => {
    icon.toggleAttribute("hidden", icon.dataset.themeIcon !== mode);
  });
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

function formatCost(value) {
  if (value == null) return t("notReported");
  return value < 1000 ? formatExactCost(value) : `$${(value / 1_000).toFixed(1)}k`;
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
    ? `<span class="entity-name" title="${escapeHtml(item.label)}">${escapeHtml(item.label)}</span>`
    : missingValue();
}

function modelEffort(row) {
  return row.thinking_level
    ? `<span class="model-effort">(${escapeHtml(row.thinking_level)})</span>`
    : "";
}

const HARNESS_LOGOS = Object.freeze({
  "Claude Code": ["assets/harnesses/anthropic.svg", true],
  Codex: ["assets/harnesses/openai.svg", true],
  "Cursor CLI": ["assets/harnesses/cursor.svg", true],
  "DeepSeek Harness": ["assets/harnesses/deepseek.svg", true],
  "Gemini CLI": ["assets/harnesses/google-gemini.svg", true],
  "Kimi Code": ["assets/harnesses/moonshot-ai.svg", true],
  Penguin: ["favicon.svg", false],
  Terminus: ["assets/harnesses/terminal-bench.svg", false],
  "Terminus 2": ["assets/harnesses/terminal-bench.svg", false],
  "mini-SWE-agent": ["assets/harnesses/mini-swe-agent.svg", false],
  Devin: ["assets/harnesses/devin.svg", false],
  "Grok Build": ["assets/harnesses/xai.svg", true],
});

function harnessLogo(label) {
  const logo = HARNESS_LOGOS[label];
  if (!logo) return "";
  const [src, monochrome] = logo;
  const className = monochrome ? "harness-logo harness-logo-monochrome" : "harness-logo";
  return `<img class="${className}" src="${escapeHtml(src)}" alt="" decoding="async" />`;
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
    .filter((value) => values.includes(value) || value === state.filters.source)
    .forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = sourceTypeLabel(value);
      elements.sourceFilter.append(option);
    });
  elements.sourceFilter.value = state.filters.source;
  if (elements.sourceFilter.selectedIndex < 0) elements.sourceFilter.value = "";
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
  renderFilterMenu();
}

function setFilterMenu(open, focus = false) {
  elements.filterMenu.hidden = !open;
  elements.filterToggle.setAttribute("aria-expanded", String(open));
  if (open) {
    setExportMenu(false);
    closeCustomSelects();
    renderFilterMenu();
    if (focus) elements.filterCategories.querySelector("button").focus();
  } else if (focus) elements.filterToggle.focus();
}

function renderFilterMenu() {
  const fields = { source: "source", harness: "harness", model: "model", thinking: "thinkingLevel" };
  const active = state.filterCategory;
  const count = Object.values(state.filters).filter(Boolean).length;
  const badge = elements.filterToggle.querySelector(".filter-count");
  badge.hidden = !count;
  badge.textContent = count;
  elements.filterToggle.classList.toggle("has-filters", count > 0);
  elements.filterToggle.title = Object.entries(fields).map(([key, label]) => {
    const select = document.querySelector(`#${key}-filter`);
    return `${t(label)}: ${select.selectedOptions[0]?.textContent || ""}`;
  }).join("\n");
  elements.filterCategories.innerHTML = Object.entries(fields).map(([key, label]) =>
    `<button type="button" role="menuitem" data-filter-category="${key}" aria-haspopup="menu" aria-expanded="${key === active}" class="filter-category${key === active ? " is-active" : ""}"><span>${escapeHtml(t(label))}</span><span aria-hidden="true">${state.filters[key] ? "• " : ""}›</span></button>`).join("")
    + (count ? `<button type="button" role="menuitem" class="filter-clear">${escapeHtml(t("clearFilters"))}</button>` : "");
  const select = document.querySelector(`#${active}-filter`);
  elements.filterOptions.setAttribute("aria-label", t(fields[active]));
  elements.filterOptions.innerHTML = [...select.options].map((option) =>
    `<button type="button" role="menuitemradio" aria-checked="${option.selected}" data-filter-value="${escapeHtml(option.value)}"><span>${escapeHtml(option.textContent)}</span><span aria-hidden="true">${option.selected ? "✓" : ""}</span></button>`).join("");
}

function clearFilters() {
  for (const key of Object.keys(state.filters)) state.filters[key] = "";
  renderFilters();
  renderResults();
  elements.tableWrap.scrollTop = 0;
  setFilterMenu(false, true);
}

function setResultView(view, focus = false) {
  state.view = view === "pareto" ? "pareto" : "table";
  document.documentElement.dataset.resultView = state.view;
  setFilterMenu(false);
  setExportMenu(false);
  elements.viewTabs.querySelectorAll("[data-view]").forEach((tab) => {
    const selected = tab.dataset.view === state.view;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    if (selected && focus) tab.focus();
  });
  elements.tablePanel.hidden = state.view !== "table";
  elements.paretoSection.hidden = state.view !== "pareto";
  if (state.benchmark) renderResults();
}

function filteredRows() {
  return rowsMatchingFilters(state.benchmark.results, state.filters);
}

function sortedRows(rows) {
  const { key, direction } = state.sort;
  const multiplier = direction === "asc" ? 1 : -1;
  const value = (row) => {
    if (key === "harness") return row.harness.label;
    if (key === "model") return row.model.label;
    if (key === "source_type") return sourceTypeLabel(row.source_type);
    if (key === "compression_trigger") return row.run_config?.compression_trigger_label;
    return row[key];
  };
  return [...rows].sort((left, right) => {
    const a = value(left);
    const b = value(right);
    if (a == null && b == null) return 0;
    if (a == null) return 1;
    if (b == null) return -1;
    if (typeof a === "string" || typeof b === "string") {
      return String(a ?? "").localeCompare(String(b ?? ""), state.locale, { numeric: true }) * multiplier;
    }
    return ((a ?? -Infinity) - (b ?? -Infinity)) * multiplier;
  });
}

function setSort(key) {
  state.sortInteracted = true;
  if (state.sort.key === key) {
    state.sort.direction = state.sort.direction === "asc" ? "desc" : "asc";
  } else {
    state.sort = { key, direction: ["harness", "model", "source_type", "compression_trigger", "timeout_multiplier", "total_cost_usd"].includes(key) ? "asc" : "desc" };
  }
  renderTable();
  elements.tableWrap.scrollTop = 0;
  syncResultUrl();
}

function renderTableHead() {
  const columns = [
    ["row_number", "rowNumber"],
    ["harness", "harness"],
    ["model", "model"],
    ["compression_trigger", "compressionColumn"],
    ["timeout_multiplier", "timeoutColumn"],
    ["accuracy", "resolutionRate"],
    ["total_cost_usd", "cost"],
    ["source_type", "source"],
  ];
  const meanings = {
    row_number: "rowNumberMeaning", harness: "harnessMeaning", model: "modelMeaning",
    compression_trigger: "compressionMeaning", timeout_multiplier: "timeoutMeaning",
    accuracy: "rateMeaning", total_cost_usd: "costMeaning", source_type: "sourceMeaning",
  };
  const row = document.createElement("tr");
  columns.forEach(([key, labelKey]) => {
    const cell = document.createElement("th");
    cell.scope = "col";
    cell.className = `column-${key.replaceAll("_", "-")}${state.sortInteracted && state.sort.key === key ? " is-active" : ""}`;
    if (key === "row_number") {
      cell.textContent = t("rowNumber");
      row.append(cell);
      return;
    }
    const button = document.createElement("button");
    button.type = "button";
    button.className = "sort-button";
    button.setAttribute("aria-label", `${t("sorting", { column: t(labelKey) })}. ${t(meanings[key])}`);
    button.textContent = t(labelKey);
    // Reserve the arrow slot on every sortable column so sorting never shifts widths.
    const arrow = document.createElement("span");
    arrow.className = "sort-arrow";
    arrow.setAttribute("aria-hidden", "true");
    if (state.sort.key === key) {
      arrow.textContent = state.sort.direction === "asc" ? "↑" : "↓";
      cell.setAttribute("aria-sort", state.sort.direction === "asc" ? "ascending" : "descending");
    }
    button.append(arrow);
    button.addEventListener("click", () => setSort(key));
    cell.append(button);
    row.append(cell);
  });
  elements.resultsHead.replaceChildren(row);
}

function confidenceDescription(row) {
  return t(row.accuracy_ci95_provenance?.kind === "derived_from_archived_trials" ? "derivedCi" : "reportedCi");
}

function accuracyCell(row) {
  const ci = row.accuracy_ci95_half_width;
  const lower = Math.max(0, row.accuracy - (ci ?? 0));
  const upper = Math.min(100, row.accuracy + (ci ?? 0));
  const interval = ci == null ? "" : `± ${ci.toFixed(1)}%`;
  return `
    <div class="rate-cell">
      <div class="rate-copy">
        <strong>${row.accuracy.toFixed(1)}%</strong>
        ${interval ? `<span title="${escapeHtml(confidenceDescription(row))}" aria-label="${escapeHtml(interval + '. ' + confidenceDescription(row))}">${escapeHtml(interval)}</span>` : ""}
      </div>
      <span class="accuracy-track" aria-hidden="true">
        <i class="accuracy-fill" data-model-series="${modelSeries(row)}" style="width:${Math.min(100, Math.max(0, row.accuracy))}%"></i>
        ${ci == null ? "" : `
          <i class="accuracy-ci" style="left:${lower}%;width:${upper - lower}%"></i>
          <i class="accuracy-cap accuracy-cap-lower" style="left:${lower}%"></i>
          <i class="accuracy-cap accuracy-cap-upper" style="left:${upper}%"></i>
        `}
      </span>
    </div>`;
}

function sourceLabel(row) {
  return `<span class="source-label">${escapeHtml(sourceTypeLabel(row.source_type))}</span>`;
}

function modelSeries(row) {
  // Use model identity, never the harness, source, rank, or filtered row index.
  const org = String(row.model_org?.label || "").trim().toLowerCase();
  const organizations = {
    openai: "gpt", deepseek: "deepseek", anthropic: "claude",
    google: "gemini", qwen: "qwen", alibaba: "qwen",
    "moonshot ai": "kimi", "z.ai": "glm", xai: "grok", meta: "muse",
  };
  if (Object.hasOwn(organizations, org)) return organizations[org];
  // Older/partial records may omit the organization.
  const model = String(row.model?.label || "").trim().toLowerCase();
  if (/^(gpt(?:[-\s]|$)|o[134](?:[-\s]|$))/.test(model)) return "gpt";
  if (/^deepseek(?:[-\s]|$)/.test(model)) return "deepseek";
  if (/^(claude|opus|sonnet|haiku|fable)(?:[-\s]|$)/.test(model)) return "claude";
  if (/^gemini(?:[-\s]|$)/.test(model)) return "gemini";
  if (/^qwen(?:\d|[-\s]|$)/.test(model)) return "qwen";
  if (/^kimi(?:[-\s]|$)/.test(model)) return "kimi";
  if (/^glm(?:[-\s]|$)/.test(model)) return "glm";
  if (/^grok(?:[-\s]|$)/.test(model)) return "grok";
  if (/^muse(?:[-\s]|$)/.test(model)) return "muse";
  return "unknown";
}

function harnessDetailsButton(row) {
  const harness = row.harness?.label || t("notReported");
  const model = row.model?.label || t("notReported");
  const label = escapeHtml(t("viewHarnessDetails", { harness, model }));
  return `<button class="harness-details-button" type="button" data-result-id="${escapeHtml(row.id)}" aria-haspopup="dialog" aria-label="${label}">${harnessLogo(row.harness?.label)}${entityName(row.harness)}</button>`;
}

function missingValue(compact = false) {
  const label = escapeHtml(t("notReported"));
  const meaning = escapeHtml(t("missingMeaning"));
  return compact
    ? `<span class="missing-value" aria-label="${meaning}" title="${meaning}">—</span>`
    : `<span class="missing-value" title="${meaning}">${label}</span>`;
}

function partialCostNote(row) {
  const missing = row.cost_coverage?.missing_trial_count;
  return missing > 0 ? t("costIncomplete", { missing, trials: row.trial_count }) : "";
}

function harnessVersionLabel(row) {
  if (row.harness_version) return row.harness_version;
  const known = (row.harness_version_variants || []).filter((item) => item.version !== "unknown");
  if (known.length > 1) return t("mixedVersions");
  return known.length ? t("partialVersions") : "";
}

function compressionCell(row) {
  if (row.run_config) return escapeHtml(row.run_config.compression_trigger_label);
  return missingValue(true);
}

function timeoutCell(row) {
  return row.timeout_multiplier != null ? `${row.timeout_multiplier}×` : missingValue(true);
}

function costCell(row) {
  if (row.total_cost_usd != null) {
    const note = partialCostNote(row);
    return `<span${note ? ` title="${escapeHtml(note)}" aria-label="${escapeHtml(formatExactCost(row.total_cost_usd) + '. ' + note)}"` : ""}>${escapeHtml(formatCost(row.total_cost_usd))}</span>`;
  }
  if (row.average_cost_per_task_usd != null) {
    return `<span title="${escapeHtml(t("perTaskCostMeaning"))}">${escapeHtml(formatExactCost(row.average_cost_per_task_usd))}<small class="cell-context">${escapeHtml(t("perTaskUnit"))}</small></span>`;
  }
  return missingValue(true);
}

function renderTable() {
  renderTableHead();
  const filtered = filteredRows();
  const rows = sortedRows(filtered);
  elements.resultCount.textContent = t("showingResults", {
    shown: rows.length,
    total: state.benchmark.result_count,
  });

  if (!rows.length) {
    elements.resultsBody.innerHTML = `<tr><td class="empty-cell" colspan="8">${escapeHtml(t("noResults"))}</td></tr>`;
    return;
  }

  elements.resultsBody.innerHTML = rows.map((row, index) => {
    const config = row.run_config;
    const active = (key) => state.sortInteracted && state.sort.key === key ? " is-active" : "";
    return `
      <tr>
        <td class="row-number-cell">${index + 1}</td>
        <td class="entity-cell harness-cell${active("harness")}">
          ${harnessDetailsButton(row)}
          ${harnessVersionLabel(row) ? `<div class="harness-meta"><span title="${escapeHtml(t(config ? "configuredVersion" : "harnessVersion"))}">${escapeHtml(harnessVersionLabel(row))}</span></div>` : ""}
        </td>
        <td class="entity-cell model-cell${active("model")}">
          <div class="model-primary">${entityName(row.model)}${modelEffort(row)}</div>
        </td>
        <td class="config-cell${active("compression_trigger")}">${compressionCell(row)}</td>
        <td class="config-cell${active("timeout_multiplier")}">${timeoutCell(row)}</td>
        <td class="${active("accuracy").trim()}">${accuracyCell(row)}</td>
        <td class="number-cell${active("total_cost_usd")}">${costCell(row)}</td>
        <td class="source-cell${active("source_type")}">${sourceLabel(row)}</td>
      </tr>`;
  }).join("");
  elements.resultsBody.querySelectorAll(".harness-logo").forEach((image) => {
    image.addEventListener("error", () => { image.hidden = true; }, { once: true });
  });
}

function detailLink(item, fallbackLabel) {
  const href = safeUrl(item?.url);
  const label = item?.label || fallbackLabel;
  if (!href || !label) return null;
  return `<a href="${escapeHtml(href)}" target="_blank" rel="noreferrer">${escapeHtml(label)} ↗</a>`;
}

function detailItem(label, value, meaning = null) {
  if (value == null || value === "") return "";
  return `<div class="detail-item"><dt${meaning ? ` title="${escapeHtml(meaning)}"` : ""}>${escapeHtml(label)}</dt><dd>${value}</dd></div>`;
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

function localizedNote(note) {
  if (note == null) return null;
  return typeof note === "object" ? note[state.locale] || note.en : note;
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

  const config = row.run_config;
  const configEvidence = row.config_evidence;
  const officialUrl = new URL(state.benchmark.official_url);
  officialUrl.searchParams.set("efforts", "all");
  const traceArchive = config?.trace_archive;
  const versionDetails = row.harness_version ? escapeHtml(row.harness_version)
    : (row.harness_version_variants || []).map((item) => detailLink({url: item.source_url}, t("versionAttempts", {
      version: item.version === "unknown" ? t("notReported") : item.version,
      count: formatNumber(item.count),
    }))).join("<br>");
  const configuration = detailGroup(t("configuration"), [
    detailItem(t("harness"), detailLink(row.harness, row.harness?.label) || escapeHtml(row.harness?.label)),
    detailItem(t(config ? "configuredVersion" : "harnessVersion"), versionDetails),
    detailItem(t("versionNote"), configEvidence?.version_note ? escapeHtml(localizedNote(configEvidence.version_note)) : null),
    detailItem(t("harnessMode"), row.harness_mode ? escapeHtml(row.harness_mode) : null),
    detailItem(t("harnessOrganization"), detailLink(row.harness_org, row.harness_org?.label) || escapeHtml(row.harness_org?.label)),
    detailItem(t("model"), detailLink(row.model, row.model?.label) || escapeHtml(row.model?.label)),
    detailItem(t("modelOrganization"), detailLink(row.model_org, row.model_org?.label) || escapeHtml(row.model_org?.label)),
    detailItem(t("thinkingLevel"), row.thinking_level ? escapeHtml(row.thinking_level) : null),
    detailItem(t("releaseDate"), row.release_date ? escapeHtml(formatDate(row.release_date)) : null),
    detailItem(t("modelId"), config?.model_id ? escapeHtml(config.model_id) : null),
    detailItem(t("modelRevision"), config?.model_revision ? escapeHtml(t("modelRevisionConfirmed", { revision: config.model_revision, date: formatDate(config.model_revision_confirmed_at) })) : null),
    detailItem(t("compressionTrigger"), config ? escapeHtml(`${config.compression_trigger_label}${config.compression_trigger_source === "runner_confirmed_default" ? ` (${t("runnerDefault")})` : ""}`) : null),
    detailItem(t("contextWindow"), row.context_window_label ? escapeHtml(row.context_window_label) : null),
    detailItem(t("timeoutMultiplier"), row.timeout_multiplier == null ? null : `${row.timeout_multiplier}×`),
    detailItem(t("timeoutNote"), row.timeout_note ? escapeHtml(localizedNote(row.timeout_note)) : null),
    detailItem("Sandbox", config?.sandbox ? escapeHtml(config.sandbox) : null),
    detailItem(t("concurrency"), config ? escapeHtml(formatNumber(config.concurrency)) : null),
    detailItem(t("attemptsPerTask"), config ? escapeHtml(formatNumber(config.attempts_per_task)) : null),
    detailItem(t("runDate"), config ? escapeHtml(formatDate(config.run_date)) : null),
    detailItem(t("archiveStatus"), config ? escapeHtml(traceArchive ? t("traceArchivedWithGaps", {
      archived: formatNumber(traceArchive.trajectory_trials), trials: formatNumber(row.trial_count),
      missing: formatNumber(traceArchive.missing_trajectory_trials),
    }) : t("traceNotArchived")) : null),
    detailItem(t("traceArchivedOn"), traceArchive ? escapeHtml(formatDate(traceArchive.archived_on)) : null),
    detailItem(t("traceFormatIssues"), traceArchive?.invalid_jsonl_files
      ? escapeHtml(t("traceInvalidJsonl", { count: formatNumber(traceArchive.invalid_jsonl_files) })) : null),
  ]);

  const ciProvenance = row.accuracy_ci95_provenance;
  const derivedCi = ciProvenance?.kind === "derived_from_archived_trials";
  const scores = detailGroup(t("scoreMetrics"), [
    detailItem(t("resolutionRate"), escapeHtml(formatPercent(row.accuracy, 2))),
    detailItem(t("confidenceInterval"), confidence ? escapeHtml(confidence) : null),
    detailItem(t("ciEvidence"), confidence ? escapeHtml(confidenceDescription(row)) : null),
    detailItem(t("ciMethod"), derivedCi ? `${escapeHtml(t("derivedCiMethod", {
      tasks: ciProvenance.task_count, attempts: ciProvenance.attempts_per_task,
      missing: ciProvenance.missing_reward_count,
    }))} ${detailLink({url: ciProvenance.method_url}, "Terminal-Bench metrics.py")}` : null),
    detailItem(t("ciCalculatedOn"), derivedCi ? escapeHtml(formatDate(ciProvenance.derived_at)) : null),
    detailItem(t("ciLimit"), derivedCi ? escapeHtml(t("derivedCiLimit")) : null),
    detailItem(t("standardError"), row.accuracy_stderr == null ? null : escapeHtml(formatPercent(row.accuracy_stderr))),
    detailItem(t("trials"), row.trial_count == null ? null : escapeHtml(formatNumber(row.trial_count))),
    detailItem(t("successes"), row.successes == null ? null : escapeHtml(formatNumber(row.successes))),
    detailItem("pass@2", row.pass_at_2 == null ? null : escapeHtml(formatPassRate(row.pass_at_2)), t("passAtMeaning")),
    detailItem("pass@3", row.pass_at_3 == null ? null : escapeHtml(formatPassRate(row.pass_at_3)), t("passAtMeaning")),
    detailItem("pass@4", row.pass_at_4 == null ? null : escapeHtml(formatPassRate(row.pass_at_4)), t("passAtMeaning")),
    detailItem("pass@5", row.pass_at_5 == null ? null : escapeHtml(formatPassRate(row.pass_at_5)), t("passAtMeaning")),
    detailItem(t("rewardHacks"), detailLink(row.display_reward_hacks, row.display_reward_hacks?.label)
      || (row.reward_hacks == null ? null : escapeHtml(formatPercent(row.reward_hacks))), t("rewardHacksMeaning")),
  ]);

  const usage = detailGroup(t("usageMetrics"), [
    detailItem(t("totalTokens"), row.total_tokens == null ? null : escapeHtml(formatNumber(row.total_tokens))),
    detailItem(t("uncachedInputTokens"), row.uncached_input_tokens == null ? null : escapeHtml(formatNumber(row.uncached_input_tokens))),
    detailItem(t("cachedInputTokens"), row.cached_input_tokens == null ? null : escapeHtml(formatNumber(row.cached_input_tokens))),
    detailItem(t("outputTokens"), row.output_tokens == null ? null : escapeHtml(formatNumber(row.output_tokens))),
    detailItem(t(partialCostNote(row) ? "recordedCost" : "totalCost"), row.total_cost_usd == null ? null : escapeHtml(formatExactCost(row.total_cost_usd))),
    detailItem(t("meanTaskCost"), row.average_cost_per_task_usd == null ? null : escapeHtml(formatExactCost(row.average_cost_per_task_usd))),
    detailItem(t("recordedUsage"), partialCostNote(row) ? escapeHtml(partialCostNote(row)) : null),
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
    detailItem(t("configEvidence"), detailLink({url: configEvidence?.source_url || row.configuration_source_url}, t("viewConfigEvidence"))),
    detailItem(t("configCoverage"), configEvidence?.trial_count ? escapeHtml(t("configCoverageValue", {count: formatNumber(configEvidence.trial_count)})) : null),
    ...(configEvidence?.supplemental_sources || []).map((source) => detailItem(
      t(source.kind === "official_submission" ? "officialSubmission" : "officialTimeoutCheck"),
      detailLink({url: source.url}, String(source.reported_value)) + (source.note ? ` — ${escapeHtml(localizedNote(source.note))}` : ""),
    )),
    detailItem(t("configVerifiedOn"), configEvidence?.verified_at ? escapeHtml(formatDate(configEvidence.verified_at)) : null),
    detailItem(t("sourcePublished"), row.published_at ? escapeHtml(formatDate(row.published_at)) : null),
    detailItem(t("protocolNote"), protocolNote ? escapeHtml(protocolNote) : null),
    detailItem(t("officialRow"), officialRow
      ? `<a href="${escapeHtml(officialRow)}" target="_blank" rel="noreferrer">Harbor ↗</a>`
      : null),
    detailItem(t("submission"), detailLink(row.submission, row.submission?.label)),
    detailItem(t("benchmarkSnapshot"), `<a href="${escapeHtml(officialUrl.href)}" title="${escapeHtml(formatSnapshot(state.benchmark.snapshot_updated_at))}" target="_blank" rel="noreferrer">tbench.ai ↗</a>`),
  ]);

  const rawConfiguration = detailGroup(t("rawConfig"), (configEvidence?.raw_config || []).map((item) => detailItem(
    item.name,
    `${escapeHtml(item.value)} — ${escapeHtml(localizedNote(item.note))}<br>${detailLink({url: item.documentation_url}, t("configDocumentation"))}`,
  )));
  elements.dialogBody.innerHTML = `${summary}<div class="detail-groups">${sourceLinks}${configuration}${rawConfiguration}${scores}${usage}</div>`;
  elements.dialogOfficialLink.href = officialRow || evidenceUrl || state.benchmark.official_url;
  elements.dialogOfficialLinkLabel.textContent = officialRow ? t("openOfficialDetail") : t("openSource");
  elements.resultDialog.showModal();
  elements.dialogBody.scrollTop = 0;
}

function closeDetails() {
  if (elements.resultDialog.open) elements.resultDialog.close();
}

function paretoFrontier(rows) {
  const sorted = [...rows].sort((a, b) => a.total_cost_usd - b.total_cost_usd || b.accuracy - a.accuracy);
  let best = -Infinity;
  let bestCost = null;
  return sorted.filter((row) => {
    if (row.accuracy === best && row.total_cost_usd === bestCost) return true;
    if (row.accuracy <= best) return false;
    best = row.accuracy;
    bestCost = row.total_cost_usd;
    return true;
  });
}

function paretoRows() {
  return filteredRows().filter((row) => ["penguin_run", "benchmark_official"].includes(row.source_type)
    && Number.isFinite(row.total_cost_usd) && row.total_cost_usd >= 0
    && row.total_cost_usd <= PARETO_COST_MAX);
}

function paretoConfigLabel(row) {
  const config = row.run_config;
  return config
    ? `${row.thinking_level || t("notReported")} · ${config.compression_trigger_label} · ${config.timeout_multiplier}×`
    : row.thinking_level || t("notReported");
}

function selectParetoPoint(id, showTooltip = false, pointer = null) {
  const row = paretoRows().find((item) => item.id === id);
  if (!row) return;
  state.paretoSelectedId = id;
  elements.paretoChart.querySelectorAll(".pareto-point").forEach((point) => {
    point.classList.toggle("is-selected", showTooltip && point.dataset.resultId === id);
  });
  elements.paretoChart.querySelectorAll(".pareto-point-label, .pareto-label-leader").forEach((node) => {
    node.classList.toggle("is-selected", showTooltip && node.dataset.resultId === id);
  });
  elements.paretoReadout.textContent = t("paretoPoint", {
    model: row.model.label, harness: `${row.harness.label} · ${paretoConfigLabel(row)}`,
    score: formatPercent(row.accuracy, 2), cost: formatExactCost(row.total_cost_usd),
  });
  if (!showTooltip) return;
  const point = [...elements.paretoChart.querySelectorAll(".pareto-point")].find((node) => node.dataset.resultId === id);
  if (!point) return;
  const leader = [...elements.paretoChart.querySelectorAll(".pareto-label-leader")].find((node) => node.dataset.resultId === id);
  if (leader && !leader.hasAttribute("d")) {
    const label = [...elements.paretoChart.querySelectorAll(".pareto-point-label")].find((node) => node.dataset.resultId === id);
    const dot = point.querySelector(".pareto-point-dot").getBBox();
    const box = label.getBBox();
    const start = { x: dot.x + dot.width / 2, y: dot.y + dot.height / 2 };
    const nearest = {
      x: Math.max(box.x - 4, Math.min(start.x, box.x + box.width + 4)),
      y: Math.max(box.y - 4, Math.min(start.y, box.y + box.height + 4)),
    };
    const obstacles = [...elements.paretoChart.querySelectorAll(".pareto-point-label")]
      .map((node) => {
        const b = node.getBBox();
        // Match the 3px text halo (1.5px per side). A larger artificial box can
        // seal the real gap between adjacent labels and trap a nearby point.
        return { x: b.x - 1.5, y: b.y - 1.5, width: b.width + 3, height: b.height + 3 };
      });
    // The nearest side may be blocked by a neighboring label. Try exposed edges
    // instead of silently losing a connector or cutting through that neighbor.
    const ends = [nearest,
      { x: box.x - 4, y: box.y + box.height / 2 },
      { x: box.x + box.width + 4, y: box.y + box.height / 2 },
      { x: box.x + box.width / 2, y: box.y - 4 },
      { x: box.x + box.width / 2, y: box.y + box.height + 4 },
    ].sort((a, b) => Math.hypot(a.x - start.x, a.y - start.y) - Math.hypot(b.x - start.x, b.y - start.y));
    let route = [];
    for (const end of ends) {
      if (obstacles.some((b) => segmentCrossesBox(end, end, b))) continue;
      route = routeParetoLeader(start, end, obstacles);
      if (route.length) break;
    }
    leader.setAttribute("d", route.map((p, i) => `${i ? "L" : "M"}${p.x},${p.y}`).join(" "));
  }
  const tooltip = elements.paretoTooltip;
  const ci = row.accuracy_ci95_half_width;
  const version = harnessVersionLabel(row);
  const configSummary = row.run_config ? t("paretoConfigSummary", {
    thinking: row.thinking_level || t("notReported"),
    compression: row.run_config.compression_trigger_label,
    timeout: row.run_config.timeout_multiplier,
  }) : `${t("thinkingLevel")}: ${row.thinking_level || t("notReported")}`;
  tooltip.innerHTML = `<strong>${escapeHtml(row.model.label)}</strong>
    <span title="${escapeHtml(t(row.run_config ? "configuredVersion" : "harnessVersion"))}">${escapeHtml(`${row.harness.label}${version ? ` ${version}` : ""}`)}</span>
    <span>${escapeHtml(configSummary)}</span>
    <span>${escapeHtml(sourceTypeLabel(row.source_type))}</span>
    <div class="pareto-tooltip-metrics">
      <div><span>${escapeHtml(t("paretoTooltipRate"))}</span><b>${escapeHtml(formatPercent(row.accuracy, 2))}</b>${ci == null ? "" : `<small title="${escapeHtml(confidenceDescription(row))}">± ${escapeHtml(formatPercent(ci))} · 95% CI</small>`}</div>
      <div><span>${escapeHtml(t(row.source_type === "penguin_run" ? "paretoTooltipCost" : "paretoTooltipOfficialCost"))}</span><b>${escapeHtml(formatExactCost(row.total_cost_usd))}</b></div>
    </div>
    ${row.accuracy_ci95_provenance ? `<small>${escapeHtml(confidenceDescription(row))}</small>` : ""}
    ${partialCostNote(row) ? `<small>${escapeHtml(partialCostNote(row))}</small>` : ""}`;
  tooltip.hidden = false;
  const anchor = point.querySelector(".pareto-point-dot").getBoundingClientRect();
  // A viewport-level tooltip also follows a displaced label, not its distant dot.
  const viewport = window.visualViewport;
  const viewportLeft = viewport?.offsetLeft || 0;
  const viewportTop = viewport?.offsetTop || 0;
  const viewportWidth = viewport?.width || document.documentElement.clientWidth;
  const viewportHeight = viewport?.height || window.innerHeight;
  const minLeft = viewportLeft + 8;
  const minTop = viewportTop + 8;
  tooltip.style.maxWidth = `${Math.max(0, viewportWidth - 16)}px`;
  tooltip.style.maxHeight = `${Math.max(0, viewportHeight - 16)}px`;
  const px = pointer?.x ?? anchor.left + anchor.width / 2;
  const py = pointer?.y ?? anchor.top + anchor.height / 2;
  const maxLeft = viewportLeft + viewportWidth - tooltip.offsetWidth - 8;
  const maxTop = viewportTop + viewportHeight - tooltip.offsetHeight - 8;
  const preferredLeft = px + 16 <= maxLeft ? px + 16 : px - tooltip.offsetWidth - 16;
  const preferredTop = py + 16 <= maxTop ? py + 16 : py - tooltip.offsetHeight - 16;
  tooltip.style.left = `${Math.max(minLeft, Math.min(preferredLeft, maxLeft))}px`;
  tooltip.style.top = `${Math.max(minTop, Math.min(preferredTop, maxTop))}px`;
}

function clearParetoSelection() {
  elements.paretoTooltip.hidden = true;
  elements.paretoChart.classList.remove("has-hover-point");
  elements.paretoChart.querySelectorAll(".is-selected").forEach((node) => node.classList.remove("is-selected"));
}

// Clip a segment to a label's padded box; labels must not cross frontier/CI lines.
function segmentCrossesBox(start, end, box) {
  let from = 0;
  let to = 1;
  for (const [axis, size] of [["x", "width"], ["y", "height"]]) {
    const delta = end[axis] - start[axis];
    if (delta === 0) {
      if (start[axis] < box[axis] || start[axis] > box[axis] + box[size]) return false;
    } else {
      const a = (box[axis] - start[axis]) / delta;
      const b = (box[axis] + box[size] - start[axis]) / delta;
      from = Math.max(from, Math.min(a, b));
      to = Math.min(to, Math.max(a, b));
      if (from > to) return false;
    }
  }
  return true;
}

// A shortest visible route around text boxes. Only the active connector is drawn;
// displaying every connector at once turns a dense scatter plot into a web.
function routeParetoLeader(start, end, boxes) {
  const clear = (a, b) => !boxes.some((box) => segmentCrossesBox(a, b, box));
  if (clear(start, end)) return [start, end];
  const corners = boxes.flatMap((box) => [
    { x: box.x - 1, y: box.y - 1 },
    { x: box.x + box.width + 1, y: box.y - 1 },
    { x: box.x - 1, y: box.y + box.height + 1 },
    { x: box.x + box.width + 1, y: box.y + box.height + 1 },
  ]).filter((p) => clear(p, p));
  const nodes = [start, end, ...corners];
  const distance = nodes.map(() => Infinity);
  const previous = nodes.map(() => -1);
  const visited = new Set();
  distance[0] = 0;
  for (let step = 0; step < nodes.length; step += 1) {
    let current = -1;
    for (let i = 0; i < nodes.length; i += 1) {
      if (!visited.has(i) && (current < 0 || distance[i] < distance[current])) current = i;
    }
    if (current < 0 || !Number.isFinite(distance[current])) break;
    if (current === 1) {
      const route = [];
      for (let at = 1; at !== -1; at = previous[at]) route.unshift(nodes[at]);
      return route;
    }
    visited.add(current);
    for (let next = 0; next < nodes.length; next += 1) {
      if (visited.has(next)) continue;
      const cost = distance[current] + Math.hypot(nodes[next].x - nodes[current].x, nodes[next].y - nodes[current].y);
      if (cost < distance[next] && clear(nodes[current], nodes[next])) {
        distance[next] = cost;
        previous[next] = current;
      }
    }
  }
  // Never draw through text if a future font/layout makes the target unreachable.
  return [];
}

// Resolve neighboring annotations together: moving one label a little can free
// the only nearby space for another, without scattering names across the plot.
function layoutParetoLabels(jobs) {
  const overlaps = (p, b) => p.x < b.x + b.width + 3 && p.x + p.width + 3 > b.x
    && p.y - p.top < b.y + b.bottom + 3 && p.y + p.bottom + 3 > b.y - b.top;
  let positions = [];
  for (const job of jobs) {
    positions.push(job.choices.find((p) => !positions.some((b) => overlaps(p, b))) || job.fallback);
  }
  for (let pass = 0; pass < 4; pass += 1) {
    let changed = false;
    const order = positions.map((p, i) => i).sort((a, b) => positions[b].cost - positions[a].cost);
    for (const i of order) {
      for (const choice of jobs[i].choices.slice(0, 128)) {
        if (choice.cost >= positions[i].cost) break;
        const blocked = positions.map((p, j) => j).filter((j) => j !== i && overlaps(choice, positions[j]));
        if (blocked.length > 2) continue;
        const trial = [...positions];
        trial[i] = choice;
        let valid = true;
        for (const j of blocked) {
          const replacement = jobs[j].choices.find((p) => (!jobs[j].preserveProximity || p.cost <= positions[j].cost)
            && !trial.some((b, k) => k !== j && overlaps(p, b)));
          if (!replacement) { valid = false; break; }
          trial[j] = replacement;
        }
        if (!valid) continue;
        const oldCost = positions[i].cost + blocked.reduce((sum, j) => sum + positions[j].cost, 0);
        const newCost = trial[i].cost + blocked.reduce((sum, j) => sum + trial[j].cost, 0);
        if (newCost + 1 < oldCost) { positions = trial; changed = true; break; }
      }
    }
    if (!changed) break;
  }
  return positions;
}

// Resolve close points by distance, rather than whichever hit box was drawn last.
// Keyboard activation still targets its focused point directly.
function paretoPointAt(event) {
  const label = event.target.closest(".pareto-point-label");
  if (label) return [...elements.paretoChart.querySelectorAll(".pareto-point")].find((point) => point.dataset.resultId === label.dataset.resultId);
  const svg = event.target.closest(".pareto-svg");
  if (!svg) return null;
  if (event.type === "click" && event.detail === 0) return event.target.closest(".pareto-point");
  let nearest = null;
  let distance = 16;
  svg.querySelectorAll(".pareto-point").forEach((point) => {
    const box = point.querySelector(".pareto-point-dot").getBoundingClientRect();
    const value = Math.hypot(event.clientX - box.x - box.width / 2, event.clientY - box.y - box.height / 2);
    if (value < distance) { nearest = point; distance = value; }
  });
  return nearest;
}

function renderPareto() {
  if (state.view !== "pareto") return;
  clearParetoSelection();
  const rows = paretoRows();
  // Shared axes, separate observed frontiers: protocols and cost coverage differ.
  // Both views share the same filters; missing costs never become zero-cost dots.
  const groups = ["benchmark_official", "penguin_run"].map((source) => ({
    source, frontier: paretoFrontier(rows.filter((row) => row.source_type === source)),
  }));
  const frontierIds = new Set(groups.flatMap((group) => group.frontier.map((row) => row.id)));
  const extremes = new Map();
  for (const { source } of groups) {
    const sourceRows = rows.filter((row) => row.source_type === source);
    const cheapest = Math.min(...sourceRows.map((row) => row.total_cost_usd));
    const highest = Math.max(...sourceRows.map((row) => row.accuracy));
    for (const row of sourceRows) {
      const flags = [];
      if (row.total_cost_usd === cheapest) flags.push(t("paretoLowest"));
      if (row.accuracy === highest) flags.push(t("paretoHighest"));
      if (flags.length) extremes.set(row.id, flags.join(" · "));
    }
  }

  if (!rows.length) {
    elements.paretoCanvas.innerHTML = `<p class="pareto-empty">${escapeHtml(t("paretoEmpty", { max: formatNumber(PARETO_COST_MAX) }))}</p>`;
    elements.paretoReadout.replaceChildren();
    return;
  }

  const width = Math.max(640, Math.floor(elements.paretoChart.clientWidth));
  const height = Math.max(480, rows.length * 16 + 160);
  const left = 72;
  const right = 32;
  const top = 24;
  const bottom = 58;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const step = PARETO_COST_STEP;
  const xMax = PARETO_COST_MAX;
  const xTicks = Array.from({ length: Math.round(xMax / step) + 1 }, (_, i) => i * step);
  // Keep the complete percentage scale, including when filters change.
  const yMin = 0;
  const yMax = 100;
  const x = (value) => left + value / xMax * plotWidth;
  const y = (value) => top + (yMax - value) / (yMax - yMin) * plotHeight;
  const moneyTick = (value) => value >= 1000 ? `$${Number((value / 1000).toFixed(1))}k` : `$${Number(value.toFixed(2))}`;
  const parts = [];
  const envelope = paretoFrontier(rows);
  const boundary = [...envelope].reverse().map((row) => `L ${x(row.total_cost_usd)} ${y(row.accuracy)}`).join(" ");
  parts.push(`<path class="pareto-envelope" d="M ${left} ${height - bottom} V ${top} H ${width - right} V ${y(envelope.at(-1).accuracy)} ${boundary} V ${height - bottom} Z"><title>${escapeHtml(t("paretoShade"))}</title></path>`);
  for (const tick of xTicks) {
    parts.push(`<line class="pareto-grid pareto-grid-vertical" x1="${x(tick)}" x2="${x(tick)}" y1="${top}" y2="${height - bottom}" />
      <text class="pareto-tick" x="${x(tick)}" y="${height - bottom + 24}" text-anchor="middle">${moneyTick(tick)}</text>`);
  }
  const yStep = 20;
  for (let tick = yMin; tick <= yMax; tick += yStep) {
    parts.push(`<line class="pareto-grid" x1="${left}" x2="${width - right}" y1="${y(tick)}" y2="${y(tick)}" />
      <text class="pareto-tick" x="${left - 12}" y="${y(tick) + 5}" text-anchor="end">${tick}%</text>`);
  }
  for (const { source, frontier } of groups) {
    if (frontier.length > 1) {
      const points = frontier.map((row) => `${x(row.total_cost_usd)},${y(row.accuracy)}`).join(" ");
      parts.push(`<polyline class="pareto-frontier" data-source="${source}" points="${points}"><title>${escapeHtml(sourceTypeLabel(source) + ": " + t("paretoFrontierMeaning"))}</title></polyline>`);
    }
  }
  parts.push(`<path class="pareto-axis" d="M ${left} ${top} V ${height - bottom} H ${width - right}" />`);
  const labelJobs = [];
  const labels = [];
  const intervals = [];
  const markers = [];
  const leaders = [];
  const textMeasure = document.createElement("canvas").getContext("2d");
  const chartFont = getComputedStyle(elements.paretoChart).fontFamily;
  const pointPositions = rows.map((row) => ({
    x: x(row.total_cost_usd), y: y(row.accuracy),
    // Avoid the visible marker, not its much larger invisible pointer target.
    radius: (row.source_type === "penguin_run" ? (frontierIds.has(row.id) ? 7 : 6)
      : (frontierIds.has(row.id) ? 5 : 4)) + 1,
  }));
  const labelObstacles = groups.flatMap(({ frontier }) => {
    const positions = frontier.map((row) => ({ x: x(row.total_cost_usd), y: y(row.accuracy) }));
    return positions.slice(1).map((point, i) => [positions[i], point]);
  });
  const intervalObstacles = [];
  rows.forEach((row) => {
    if (row.accuracy_ci95_half_width == null) return;
    const px = x(row.total_cost_usd);
    const low = y(Math.max(yMin, row.accuracy - row.accuracy_ci95_half_width));
    const high = y(Math.min(yMax, row.accuracy + row.accuracy_ci95_half_width));
    intervalObstacles.push([{ x: px, y: low }, { x: px, y: high }],
      [{ x: px - 3, y: low }, { x: px + 3, y: low }],
      [{ x: px - 3, y: high }, { x: px + 3, y: high }]);
  });
  const prioritized = [...rows].sort((a, b) => Number(b.source_type === "penguin_run") - Number(a.source_type === "penguin_run")
    || (a.source_type === "penguin_run" && b.source_type === "penguin_run"
      ? b.accuracy - a.accuracy : 0)
    || Number(extremes.has(b.id)) - Number(extremes.has(a.id))
    || Number(frontierIds.has(b.id)) - Number(frontierIds.has(a.id)) || b.accuracy - a.accuracy);
  const baseLabel = (row) => `${row.harness.label} · ${row.model.label}${row.thinking_level ? ` (${row.thinking_level})` : ""}`;
  prioritized.forEach((row) => {
    const isPenguin = row.source_type === "penguin_run";
    const px = x(row.total_cost_usd);
    const py = y(row.accuracy);
    const onFrontier = frontierIds.has(row.id);
    const extreme = extremes.get(row.id);
    const label = baseLabel(row);
    const ci = row.accuracy_ci95_half_width;
    const pointTitle = t("paretoPoint", { model: row.model.label, harness: `${row.harness.label} · ${paretoConfigLabel(row)}`, score: formatPercent(row.accuracy, 2), cost: formatExactCost(row.total_cost_usd) });
    if (ci != null) {
      const lower = y(Math.max(yMin, row.accuracy - ci));
      const upper = y(Math.min(yMax, row.accuracy + ci));
      intervals.push(`<path class="pareto-interval${onFrontier ? " is-frontier" : ""}" d="M${px},${lower}V${upper}M${px - 3},${lower}h6M${px - 3},${upper}h6" />`);
    }
    const half = onFrontier ? 5 : 4;
    const marker = isPenguin
      ? `<circle class="pareto-point-hit" cx="${px}" cy="${py}" r="14"/><circle class="pareto-point-dot" cx="${px}" cy="${py}" r="${onFrontier ? 7 : 6}"/>`
      : `<rect class="pareto-point-hit" x="${px - 12}" y="${py - 12}" width="24" height="24" rx="3"/><rect class="pareto-point-dot" x="${px - half}" y="${py - half}" width="${half * 2}" height="${half * 2}"/>`;
    // Render ordinary points first and extreme points last, so overlapping dots
    // cannot obscure the most important markers. Label placement stays priority-first.
    markers.unshift(`<g class="pareto-point${onFrontier ? " is-frontier" : ""}${extreme ? " is-extreme" : ""}" data-result-id="${escapeHtml(row.id)}" data-source="${escapeHtml(row.source_type)}" tabindex="0" role="button" aria-haspopup="dialog" aria-label="${escapeHtml(pointTitle + (extreme ? ` ${extreme}` : ""))}">${marker}</g>`);
    // The overview emphasizes each source's observed frontier. Every observation
    // within this viewport remains hoverable/focusable, without filling the
    // point cloud with competing long annotations.
    if (!onFrontier) return;
    textMeasure.font = `500 13px ${chartFont}`;
    // A semantic wrap keeps model IDs intact. Full identity remains available
    // in the tooltip and accessible name.
    const modelLine = `${row.model.label}${row.thinking_level ? ` (${row.thinking_level})` : ""}`;
    const formats = [[label], [row.harness.label, modelLine]].map((lines) => {
      const ink = lines.map((line) => {
        const metrics = textMeasure.measureText(line);
        return { width: metrics.width,
          top: Math.ceil(metrics.actualBoundingBoxAscent) + 1.5,
          bottom: Math.ceil(metrics.actualBoundingBoxDescent) + 1.5 };
      });
      return { lines, ink, width: Math.min(Math.max(...ink.map((b) => b.width)) + 4, plotWidth - 16),
        // SVG text uses a full font box even when one line has no descenders.
        // Reserve that box between labels; use ink only against plotted marks.
        top: 14, bottom: 4 + (lines.length - 1) * 16 };
    });
    const inkBoxes = (p) => p.ink.map((b, i) => ({
      x: p.x - 1.5, y: p.y + i * 16 - b.top, width: b.width + 3, height: b.top + b.bottom,
    }));
    const candidates = [];
    for (const format of formats) {
      const xs = [px + 14, px - format.width - 14, px - format.width / 2, px, left + 6];
      for (let dx = 30; dx <= 150; dx += 24) xs.push(px + dx, px - format.width - dx);
      for (let dy = -144; dy <= 144; dy += 4) {
        for (const lx of xs) candidates.push({ x: lx, y: py + dy, ...format });
      }
      // Finite fallback search; dense data must not silently lose a label.
      for (let ly = top + format.top + 4; ly <= height - bottom - format.bottom - 4; ly += 24) {
        for (let lx = left + 6; lx + format.width <= width - right - 4; lx += 24) candidates.push({ x: lx, y: ly, ...format });
      }
    }
    const labelDistance = (p) => Math.hypot(
      Math.max(p.x - px, 0, px - p.x - p.width),
      (isPenguin ? 1 : 2) * Math.max(p.y - p.top - py, 0, py - p.y - p.bottom),
    ) + (p.lines.length - 1) * 6;
    const available = candidates.filter((p) => p.x >= left + 2 && p.x + p.width <= width - right
      && p.y - p.top >= top && p.y + p.bottom <= height - bottom
      && inkBoxes(p).every((box) => !pointPositions.some((point) =>
        point.x + point.radius > box.x && point.x - point.radius < box.x + box.width
        && point.y + point.radius > box.y && point.y - point.radius < box.y + box.height)
        && !labelObstacles.some(([start, end]) => segmentCrossesBox(start, end, box))));
    for (const p of available) {
      const intervalCrossings = intervalObstacles.filter(([start, end]) => segmentCrossesBox(start, end, {
        x: p.x, y: p.y - p.top, width: p.width, height: p.top + p.bottom,
      })).length;
      p.cost = (labelDistance(p) + intervalCrossings * 3) ** 2 * (isPenguin ? 3 : 1);
    }
    available.sort((a, b) => a.cost - b.cost);
    const choices = [];
    const occupiedCells = new Set();
    for (const p of available) {
      const cell = `${p.lines.length}:${Math.round(p.x / 12)}:${Math.round(p.y / 12)}`;
      if (occupiedCells.has(cell)) continue;
      occupiedCells.add(cell);
      choices.push(p);
      if (choices.length >= 1200) break;
    }
    labelJobs.push({ row, label, choices, preserveProximity: isPenguin,
      fallback: { x: left + 6, y: height + 24 + labelJobs.length * 24, ...formats[0], overflow: true, cost: 1e8 },
    });
  });
  const placements = layoutParetoLabels(labelJobs);
  let canvasHeight = height;
  labelJobs.forEach(({ row, label }, i) => {
    const position = placements[i];
    if (position.overflow) canvasHeight = Math.max(canvasHeight, position.y + 16);
    const onFrontier = frontierIds.has(row.id);
    leaders.push(`<path class="pareto-label-leader" data-result-id="${escapeHtml(row.id)}" />`);
    const content = position.lines.map((line, i) => {
      const fitText = textMeasure.measureText(line).width > position.width - 4
        ? ` textLength="${position.width - 4}" lengthAdjust="spacingAndGlyphs"` : "";
      return `<tspan x="${position.x}" dy="${i ? 16 : 0}"${fitText}>${escapeHtml(line)}</tspan>`;
    }).join("");
    labels.push(`<text class="pareto-point-label${onFrontier ? " is-frontier" : ""}" aria-label="${escapeHtml(label)}" data-label="${escapeHtml(label)}" data-source="${row.source_type}" data-result-id="${escapeHtml(row.id)}" x="${position.x}" y="${position.y}">${content}</text>`);
  });
  const xLabel = t("paretoAxisCost", { max: formatNumber(PARETO_COST_MAX) });
  const rangeNote = t("paretoRangeNote", { max: formatNumber(PARETO_COST_MAX) });
  elements.paretoCanvas.innerHTML = `<svg class="pareto-svg" viewBox="0 0 ${width} ${canvasHeight}" data-x-scale="linear" data-x-max="${xMax}" data-x-step="${step}" data-y-min="${yMin}" data-y-max="${yMax}" role="group" aria-label="${escapeHtml(t("resolutionRate") + ' × ' + xLabel)}" aria-describedby="pareto-description">
    <desc id="pareto-description">${escapeHtml(rangeNote + " " + t("paretoComparison") + " " + t("paretoShade"))}</desc>
    <rect class="pareto-plot-background" x="${left}" y="${top}" width="${plotWidth}" height="${plotHeight}" rx="0" />
    ${parts.join("")}${intervals.join("")}${leaders.join("")}${markers.join("")}${labels.join("")}
    <text class="pareto-axis-label" x="${left + plotWidth / 2}" y="${height - 8}" text-anchor="middle"><title>${escapeHtml(rangeNote)}</title>${escapeHtml(xLabel)}</text>
    <text class="pareto-axis-label" transform="translate(17 ${top + plotHeight / 2}) rotate(-90)" text-anchor="middle">${escapeHtml(t("resolutionRate"))}</text>
  </svg>`;
  if (rows.some((row) => row.id === state.paretoSelectedId)) selectParetoPoint(state.paretoSelectedId);
}

function syncResultUrl() {
  const url = new URL(location.href);
  url.searchParams.delete("bench");
  url.searchParams.set("version", state.benchmark.version);
  url.searchParams.set("view", state.view);
  if (state.sortInteracted) {
    url.searchParams.set("sort", state.sort.key);
    url.searchParams.set("direction", state.sort.direction);
  } else {
    url.searchParams.delete("sort");
    url.searchParams.delete("direction");
  }
  url.searchParams.delete("pareto_source");
  if (url.hash === "#pareto" && state.view !== "pareto") url.hash = "results";
  for (const [key, value] of Object.entries(state.filters)) {
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
  }
  history.replaceState({}, "", url);
}

function renderResults() {
  renderTable();
  renderPareto();
  syncResultUrl();
}

function renderBenchmark() {
  applyTranslations();
  renderFilters();
  document.querySelector(".results-title").textContent = state.benchmark.name;
  document.querySelector(".table-caption").textContent = state.benchmark.name;
  renderResults();
}

let actionStatusTimer;
let exportBusy = false;

function showActionStatus(key) {
  clearTimeout(actionStatusTimer);
  elements.actionStatus.textContent = t(key);
  elements.actionStatus.hidden = false;
  const duration = key === "copied" || key === "downloaded" ? 1000 : 6000;
  actionStatusTimer = setTimeout(() => { elements.actionStatus.hidden = true; }, duration);
}

function setExportMenu(open, focus = false) {
  elements.exportMenu.hidden = !open;
  elements.exportToggle.setAttribute("aria-expanded", String(open));
  if (open) {
    setFilterMenu(false);
    closeCustomSelects();
    if (focus) elements.exportMenu.querySelector("button").focus();
  } else if (focus) elements.exportToggle.focus();
}

function currentExportSvg() {
  const title = `${state.benchmark.name}${state.view === "pareto" ? " — Pareto Frontier" : ""}`;
  return state.view === "pareto"
    ? LeaderboardExport.chartSvg(elements.paretoCanvas, title)
    : LeaderboardExport.tableSvg(elements.tableWrap.querySelector("table"), title);
}

async function exportResults(action) {
  if (!state.benchmark || exportBusy) return;
  exportBusy = true;
  elements.exportToggle.setAttribute("aria-busy", "true");
  setExportMenu(false, true);
  const filename = `terminal-bench-${state.benchmark.version}-${state.view}`;
  showActionStatus("exportWorking");
  try {
    if (action === "markdown") {
      await navigator.clipboard.writeText(LeaderboardExport.markdown(
        elements.tableWrap.querySelector("table"), state.benchmark.name));
    } else if (action === "copy-png") {
      if (!navigator.clipboard?.write || !window.ClipboardItem) throw new Error("Clipboard unavailable");
      // Pass the promise immediately to preserve Safari's user activation.
      const png = Promise.resolve(currentExportSvg()).then(LeaderboardExport.png);
      png.catch(() => {}); // Permission rejection can precede rasterization.
      await navigator.clipboard.write([new ClipboardItem({ "image/png": png })]);
    } else {
      const svg = await currentExportSvg();
      const blob = action === "svg" ? new Blob([svg], { type: "image/svg+xml" })
        : await LeaderboardExport.png(svg);
      LeaderboardExport.download(blob, `${filename}.${action === "svg" ? "svg" : "png"}`);
    }
    showActionStatus(action === "markdown" || action === "copy-png" ? "copied" : "downloaded");
  } catch {
    showActionStatus(action === "markdown" || action === "copy-png" ? "copyFailed" : "exportFailed");
  } finally {
    exportBusy = false;
    elements.exportToggle.removeAttribute("aria-busy");
  }
}

async function copyResultLink() {
  if (!state.benchmark) return;
  syncResultUrl();
  const url = new URL(location.href);
  url.searchParams.delete("v"); // Local preview cache tags aren't part of the result.
  url.searchParams.set("sort", state.sort.key);
  url.searchParams.set("direction", state.sort.direction);
  try {
    await navigator.clipboard.writeText(url.href);
    showActionStatus("copied");
  } catch {
    showActionStatus("linkCopyFailed");
  }
}

function selectBenchmark(id) {
  const bench = state.payload.benchmarks.find((item) => item.id === id);
  if (!bench) return;
  state.benchmark = bench;
  state.paretoSelectedId = null;
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
  // Escape the chart's scrolling/clipping container without changing the plot.
  document.body.append(elements.paretoTooltip);
  const localePreference = document.documentElement.dataset.localePref || "system";
  elements.localeSelect.value = ["system", "en", "zh"].includes(localePreference)
    ? localePreference
    : state.locale;
  enhanceCustomSelects();
  elements.localeSelect.addEventListener("change", (event) => setLocale(event.target.value));
  elements.themeToggle.addEventListener("click", cycleTheme);
  document.querySelectorAll(".action-tooltip-wrap").forEach((wrapper) => {
    const button = wrapper.querySelector(".action-button");
    button.addEventListener("click", () => { wrapper.dataset.tooltipDismissed = ""; });
    button.addEventListener("focus", () => { delete wrapper.dataset.tooltipDismissed; });
    button.addEventListener("blur", () => { delete wrapper.dataset.tooltipDismissed; });
    wrapper.addEventListener("pointerleave", () => { delete wrapper.dataset.tooltipDismissed; });
  });
  elements.exportToggle.addEventListener("click", () => {
    if (state.benchmark) setExportMenu(elements.exportMenu.hidden);
  });
  elements.exportToggle.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown" && state.benchmark) {
      event.preventDefault();
      setExportMenu(true, true);
    }
    if (event.key === "Escape") setExportMenu(false, true);
  });
  elements.copyLink.addEventListener("click", copyResultLink);
  elements.exportMenu.addEventListener("click", (event) => {
    const button = event.target.closest("[data-export]");
    if (button) exportResults(button.dataset.export);
  });
  elements.exportMenu.addEventListener("keydown", (event) => {
    if (event.key === "Escape") { event.preventDefault(); setExportMenu(false, true); return; }
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      const buttons = [...elements.exportMenu.querySelectorAll("button")];
      let index = buttons.indexOf(document.activeElement) + (event.key === "ArrowUp" ? -1 : 1);
      if (event.key === "Home") index = 0;
      if (event.key === "End") index = buttons.length - 1;
      buttons[(index + buttons.length) % buttons.length].focus();
    }
  });
  elements.filterToggle.addEventListener("click", () => {
    if (state.benchmark) setFilterMenu(elements.filterMenu.hidden);
  });
  elements.filterToggle.addEventListener("keydown", (event) => {
    if (event.key === "Escape") { setFilterMenu(false, true); return; }
    if (event.key === "ArrowDown" && state.benchmark) {
      event.preventDefault();
      setFilterMenu(true, true);
    }
  });
  const activateCategory = (button, focus = false) => {
    if (!button) return;
    state.filterCategory = button.dataset.filterCategory;
    renderFilterMenu();
    if (focus) elements.filterOptions.querySelector("button")?.focus();
  };
  elements.filterCategories.addEventListener("pointermove", (event) => {
    const button = event.target.closest("[data-filter-category]");
    if (button && button.dataset.filterCategory !== state.filterCategory) activateCategory(button);
  });
  elements.filterCategories.addEventListener("click", (event) => {
    if (event.target.closest(".filter-clear")) clearFilters();
    else activateCategory(event.target.closest("[data-filter-category]"), true);
  });
  elements.filterOptions.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter-value]");
    if (!button) return;
    const select = document.querySelector(`#${state.filterCategory}-filter`);
    select.value = button.dataset.filterValue;
    select.dispatchEvent(new Event("change", { bubbles: true }));
    setFilterMenu(false, true);
  });
  elements.filterMenu.addEventListener("keydown", (event) => {
    if (event.key === "Escape") { event.preventDefault(); setFilterMenu(false, true); return; }
    const button = event.target.closest("button");
    if (!button) return;
    if (event.key === "ArrowRight" && button.dataset.filterCategory) {
      event.preventDefault(); activateCategory(button, true); return;
    }
    if (event.key === "ArrowLeft" && elements.filterOptions.contains(button)) {
      event.preventDefault(); elements.filterCategories.querySelector(`[data-filter-category="${state.filterCategory}"]`).focus(); return;
    }
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      const buttons = [...button.parentElement.querySelectorAll("button")];
      let index = buttons.indexOf(button) + (event.key === "ArrowUp" ? -1 : 1);
      if (event.key === "Home") index = 0;
      if (event.key === "End") index = buttons.length - 1;
      buttons[(index + buttons.length) % buttons.length].focus();
    }
  });
  document.addEventListener("pointerdown", (event) => {
    if (!event.target.closest(".filter-menu-wrap")) setFilterMenu(false);
    if (!event.target.closest(".export-menu-wrap")) setExportMenu(false);
  });
  document.addEventListener("focusin", (event) => {
    if (!event.target.closest(".filter-menu-wrap")) setFilterMenu(false);
    if (!event.target.closest(".export-menu-wrap")) setExportMenu(false);
  });
  elements.viewTabs.addEventListener("click", (event) => {
    const tab = event.target.closest("[data-view]");
    if (tab) setResultView(tab.dataset.view);
  });
  elements.viewTabs.addEventListener("keydown", (event) => {
    if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      const next = event.key === "Home" ? "table" : event.key === "End" ? "pareto" : state.view === "table" ? "pareto" : "table";
      setResultView(next, true);
    }
  });
  elements.paretoPanel.addEventListener("click", (event) => {
    const trigger = paretoPointAt(event);
    if (!trigger) return;
    const id = trigger.dataset.resultId;
    const row = state.benchmark.results.find((item) => item.id === id);
    if (row) openDetails(row, trigger);
  });
  elements.paretoChart.addEventListener("pointermove", (event) => {
    const point = paretoPointAt(event);
    elements.paretoChart.classList.toggle("has-hover-point", !!point);
    if (point) selectParetoPoint(point.dataset.resultId, true, { x: event.clientX, y: event.clientY });
    else clearParetoSelection();
  });
  elements.paretoChart.addEventListener("focusin", (event) => {
    const point = event.target.closest(".pareto-point");
    if (point) selectParetoPoint(point.dataset.resultId, true);
  });
  elements.paretoChart.addEventListener("pointerleave", (event) => {
    if (elements.paretoTooltip.contains(event.relatedTarget)) return;
    if (!elements.paretoChart.contains(document.activeElement)) clearParetoSelection();
  });
  elements.paretoTooltip.addEventListener("pointerleave", (event) => {
    if (!elements.paretoChart.contains(event.relatedTarget)) clearParetoSelection();
  });
  const hideParetoTooltip = (event) => {
    if (!(event?.target instanceof Node) || !elements.paretoTooltip.contains(event.target)) clearParetoSelection();
  };
  window.addEventListener("scroll", hideParetoTooltip, { capture: true, passive: true });
  window.addEventListener("resize", hideParetoTooltip);
  window.visualViewport?.addEventListener("resize", hideParetoTooltip);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      clearParetoSelection();
      document.querySelectorAll(".action-tooltip-wrap").forEach((wrapper) => {
        wrapper.dataset.tooltipDismissed = "";
      });
    }
  });
  elements.paretoChart.addEventListener("focusout", clearParetoSelection);
  elements.paretoChart.addEventListener("keydown", (event) => {
    const point = event.target.closest(".pareto-point");
    if (point && ["Enter", " "].includes(event.key)) {
      event.preventDefault();
      point.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    }
  });
  let plotWidth = 0;
  const plotObserver = new ResizeObserver(() => {
    const width = Math.floor(elements.paretoChart.clientWidth);
    if (state.benchmark && width > 0 && width !== plotWidth) {
      plotWidth = width;
      renderPareto();
    }
  });
  plotObserver.observe(elements.paretoChart);
  for (const [key, select] of Object.entries({
    source: elements.sourceFilter, harness: elements.harnessFilter,
    model: elements.modelFilter, thinking: elements.thinkingFilter,
  })) {
    select.addEventListener("change", (event) => {
      state.filters[key] = event.target.value;
      renderFilters();
      renderResults();
      elements.tableWrap.scrollTop = 0;
    });
  }

  elements.resultsBody.addEventListener("click", (event) => {
    const button = event.target.closest(".harness-details-button");
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
    // Restoring chart focus must not resurrect the old tooltip over its
    // neighbor; the next pointer move or keyboard focus opens the right one.
    clearParetoSelection();
  });

  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (document.documentElement.dataset.themeMode === "system") setTheme("system");
  });

  applyTranslations();
  try {
    const response = await fetch(DATA_URL, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    state.payload = await response.json();
    state.payload.benchmarks = state.payload.benchmarks.filter((bench) =>
      PUBLISHED_BENCHMARK_IDS.includes(bench.id));
    if (!state.payload.benchmarks.length) throw new Error("No published benchmarks available");
    const params = new URLSearchParams(location.search);
    const sortKeys = ["harness", "model", "compression_trigger", "timeout_multiplier", "accuracy", "total_cost_usd", "source_type"];
    if (sortKeys.includes(params.get("sort")) && ["asc", "desc"].includes(params.get("direction"))) {
      state.sort = { key: params.get("sort"), direction: params.get("direction") };
      state.sortInteracted = true;
    }
    const chartRequested = params.get("view") === "pareto" || location.hash === "#pareto";
    for (const key of Object.keys(state.filters)) state.filters[key] = params.get(key) || "";
    selectBenchmark(initialBenchmark(state.payload).id);
    setResultView(chartRequested ? "pareto" : "table");
    if (chartRequested) {
      await document.fonts.ready;
      requestAnimationFrame(() => document.querySelector("#results").scrollIntoView({ block: "start", behavior: "instant" }));
    }

  } catch (error) {
    console.error(error);
    elements.resultsBody.innerHTML = `<tr><td class="empty-cell" colspan="8">${escapeHtml(t("dataError"))}</td></tr>`;
    elements.resultCount.textContent = t("dataError");
  }
}

init();
