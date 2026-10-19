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
    snapshotUpdated: "Official snapshot updated {date}; latest curated verification {verified} (see each result for its date).",
    resultsScopeNote: "Includes all reported thinking levels; row numbers follow the current display order, not official ranks. The official default keeps the best score per Model × Harness.",
    source: "Source",
    sourceFilter: "Filter by source",
    allSources: "All sources",
    benchmarkOfficial: "Benchmark official",
    vendorReported: "Vendor-reported",
    penguinRun: "Penguin run",
    benchmarkOfficialShort: "Official",
    vendorReportedShort: "Vendor",
    penguinRunShort: "Penguin",
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
    harnessDetailsHint: "Select a Harness name to view full configuration and sources.",
    tableHint: "Scroll horizontally to view all columns →",
    loadingResults: "Loading public results…",
    confidenceNote: "Every result has a score bar. Confidence whiskers appear only when the source reports a 95% interval; results without interval data show the bar alone.",
    dataCoverage: "Data coverage",
    coverageOfficial: "Official",
    coverageTitle: "From public baselines to Penguin runs.",
    coverageDescription: "See how official baselines, vendor reports, and Penguin runs are represented across every benchmark.",
    officialSnapshot: "Official snapshot",
    verifiedPenguinRun: "Penguin experiment record",
    successSummary: "{successes} successes / {trials} attempts",
    resolutionRate: "Resolution rate",
    tokens: "Tokens",
    cost: "Cost",
    rowNumber: "No.",
    compressionColumn: "Compaction trigger",
    timeoutColumn: "Timeout multiplier",
    experimentTableNote: "Penguin costs include reported amounts only; some trial costs are missing. Run conditions differ. Select a Harness name for the full configuration and evidence.",
    footerText: "Terminal-Bench official baselines · vendor reports · Penguin runs",
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
    paretoEyebrow: "PARETO FRONTIER",
    paretoTitle: "Cost & resolution rate",
    paretoScope: "Chart source",
    paretoPenguin: "Penguin experiments",
    paretoOfficial: "Official reference",
    paretoCount: "{shown} configurations plotted",
    paretoPenguinSubtitle: "Penguin · DeepSeek-V4-Flash-0731 · 89 tasks × 5 attempts per configuration",
    paretoOfficialSubtitle: "Official configurations · compare reported cost and resolution rate",
    paretoAxisCost: "Total recorded cost (USD)",
    paretoAxisOfficialCost: "Reported total cost (USD)",
    paretoLegend: "Observed frontier",
    paretoOther: "Other configurations",
    paretoShade: "Above / left of frontier",
    paretoZoom: "Focus on differences",
    paretoFullRange: "Show 0–100%",
    paretoRange: "Y-axis {min}–{max}%",
    paretoFrontierMeaning: "No other plotted observation has at least this score at no greater recorded cost, with one strictly better. Lines are visual guides, not additional experiments or proof of statistical significance.",
    paretoShadeMeaning: "The gray fill extends above and left of the plotted frontier to the axes. It is a visual reference, not a confidence interval or a claim that better results are impossible.",
    paretoPenguinNote: "",
    paretoOfficialNote: "Reported totals are a reference, not a controlled equal-budget comparison.",
    paretoEmpty: "No results with a reported cost for this view.",
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
    paretoInteraction: "Hover for values · select for details",
    paretoTooltipRate: "Resolution rate",
    paretoTooltipCost: "Recorded total",
    paretoTooltipOfficialCost: "Reported total",
    paretoConfigSummary: "Thinking: {thinking} · Compaction: {compression} · Timeout: {timeout}×",
    paretoDirection: "Higher score, lower cost ↖",
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
    rowNumberMeaning: "Position in the current filtered and sorted view; not an official rank.",
    harnessMeaning: "Task-running framework and version for this observation. Select its name for evidence.",
    modelMeaning: "Model and reported reasoning effort. Identically named effort levels are not equal budgets across models.",
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
    snapshotUpdated: "官方快照更新时间：{date}；最近一次人工核验：{verified}（各条日期见详情）。",
    resultsScopeNote: "本表保留全部思考等级配置，序号按当前筛选和排序后的显示顺序生成，不代表官方排名；官网默认每组 Model × Harness 只显示最高分。",
    source: "来源",
    sourceFilter: "按来源筛选",
    allSources: "全部来源",
    benchmarkOfficial: "Benchmark 官方",
    vendorReported: "厂商自报",
    penguinRun: "Penguin 实测",
    benchmarkOfficialShort: "官方",
    vendorReportedShort: "厂商自报",
    penguinRunShort: "Penguin",
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
    harnessDetailsHint: "点击 Harness 名称查看完整配置与来源。",
    tableHint: "横向滚动查看完整表格 →",
    loadingResults: "正在加载公开结果…",
    confidenceNote: "所有结果都显示分数条；仅当来源披露 95% 置信区间时才显示误差线，未披露区间的数据只显示分数条。",
    dataCoverage: "数据覆盖",
    coverageOfficial: "官方榜单",
    coverageTitle: "从公开基线，到 Penguin 实测。",
    coverageDescription: "清楚展示每个 Benchmark 收录的官方基线、厂商自报与 Penguin 实测。",
    officialSnapshot: "官方快照",
    verifiedPenguinRun: "Penguin 实验记录",
    successSummary: "{successes} 次成功 / {trials} 次尝试",
    resolutionRate: "通过率",
    tokens: "Token",
    cost: "成本",
    rowNumber: "序号",
    compressionColumn: "压缩阈值",
    timeoutColumn: "超时倍率",
    experimentTableNote: "Penguin 成本仅合计已记录费用，存在缺失项；各组运行条件有差异。完整配置与证据可点击 Harness 查看。",
    footerText: "Terminal-Bench 官方基线 · 厂商自报 · Penguin 实测",
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
    paretoEyebrow: "PARETO 前沿",
    paretoTitle: "成本与通过率",
    paretoScope: "图表来源",
    paretoPenguin: "Penguin 配置",
    paretoOfficial: "官方参考",
    paretoCount: "{shown} 组配置入图",
    paretoPenguinSubtitle: "Penguin · DeepSeek-V4-Flash-0731 · 每组 89 个任务 × 5 次尝试",
    paretoOfficialSubtitle: "官方公开配置 · 对照来源报告的成本与通过率",
    paretoAxisCost: "已记录总成本（美元）",
    paretoAxisOfficialCost: "来源报告总成本（美元）",
    paretoLegend: "当前结果前沿",
    paretoOther: "其他配置",
    paretoShade: "前沿上方／左侧",
    paretoZoom: "聚焦差异",
    paretoFullRange: "显示 0–100%",
    paretoRange: "纵轴 {min}–{max}%",
    paretoFrontierMeaning: "当前观测中，没有另一组成本不更高、分数不更低且至少一项更优的配置。连线仅辅助阅读，不代表额外实验或统计显著性。",
    paretoShadeMeaning: "浅灰区域沿当前观测前沿的上方、左侧延伸到坐标边界，仅辅助阅读；不是置信区间，也不表示更优结果不可能出现。",
    paretoPenguinNote: "",
    paretoOfficialNote: "来源报告的总成本仅供参考，不代表控制了其他条件的等预算对照。",
    paretoEmpty: "当前视图没有可用的成本记录。",
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
    paretoInteraction: "悬停读数 · 点击查看配置",
    paretoTooltipRate: "通过率",
    paretoTooltipCost: "已记录总成本",
    paretoTooltipOfficialCost: "来源报告总成本",
    paretoConfigSummary: "思考：{thinking} · 压缩：{compression} · 超时：{timeout}×",
    paretoDirection: "更高通过率，更低成本 ↖",
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
    perTaskCostMeaning: "来源报告的每任务平均成本，不是总成本；不参与总成本排序及 Pareto 绘图。",
    ciEvidence: "置信区间来源",
    reportedCi: "来源报告的 95% 置信区间；± 表示百分点，不是相对百分比。",
    rowNumberMeaning: "当前筛选、排序后的行号，不代表官方排名。",
    harnessMeaning: "本条实验执行任务的框架及版本；点击名称可查看证据。",
    modelMeaning: "模型及来源报告的思考等级；不同模型的同名等级不等于相同计算预算。",
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
  sort: { key: "accuracy", direction: "desc" },
  paretoScope: "penguin_run",
  paretoSelectedId: null,
  paretoZoomed: false,
};

const elements = {
  benchSwitcher: document.querySelector(".bench-switcher"),
  benchRail: document.querySelector(".results-bench-rail"),
  resultsSection: document.querySelector("#results"),
  localeSelect: document.querySelector(".locale-select"),
  themeToggle: document.querySelector(".theme-toggle"),
  sourceFilter: document.querySelector(".source-filter"),
  harnessFilter: document.querySelector(".harness-filter"),
  modelFilter: document.querySelector(".model-filter"),
  thinkingFilter: document.querySelector(".thinking-filter"),
  resultCount: document.querySelector(".result-count"),
  tableWrap: document.querySelector(".table-wrap"),
  tableHint: document.querySelector(".table-hint"),
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
  paretoPanel: document.querySelector(".pareto-panel"),
  paretoChart: document.querySelector(".pareto-chart"),
  paretoCanvas: document.querySelector(".pareto-canvas"),
  paretoTooltip: document.querySelector(".pareto-tooltip"),
  paretoReadout: document.querySelector(".pareto-readout"),
};

let dialogTrigger = null;
const customSelects = new Map();

function updateBenchRailState() {
  const headerHeight = Number.parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue("--header-height"),
  ) || 64;
  const railBounds = elements.benchRail.getBoundingClientRect();
  const resultsBounds = elements.resultsSection.getBoundingClientRect();
  const isStuck = Math.abs(railBounds.top - headerHeight) <= 1
    && resultsBounds.top < headerHeight
    && resultsBounds.bottom > headerHeight + railBounds.height;
  elements.benchRail.classList.toggle("is-stuck", isStuck);
}

function updateTableOverflow() {
  const { tableWrap, tableHint } = elements;
  tableHint.hidden = tableWrap.scrollWidth <= tableWrap.clientWidth + 1;
}

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

function renderBenchSwitcher() {
  const benchmarks = state.payload.benchmarks;
  const activeIndex = Math.max(0, benchmarks.findIndex((bench) => bench.id === state.benchmark.id));
  elements.benchSwitcher.style.setProperty("--bench-count", benchmarks.length);

  let buttons = [...elements.benchSwitcher.querySelectorAll(".bench-tab")];
  if (buttons.length !== benchmarks.length) {
    elements.benchSwitcher.replaceChildren();

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

function sourceBadgeLabel(sourceType) {
  const labels = {
    benchmark_official: t("benchmarkOfficialShort"),
    vendor_reported: t("vendorReportedShort"),
    penguin_run: t("penguinRunShort"),
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
  if (state.sort.key === key) {
    state.sort.direction = state.sort.direction === "asc" ? "desc" : "asc";
  } else {
    state.sort = { key, direction: ["harness", "model", "source_type", "compression_trigger", "timeout_multiplier"].includes(key) ? "asc" : "desc" };
  }
  renderTable();
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
    cell.title = t(meanings[key]);
    cell.className = `column-${key.replaceAll("_", "-")}${state.sort.key === key ? " is-active" : ""}`;
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
  const interval = ci == null ? "" : `± ${ci.toFixed(1)}%`;
  return `
    <div class="rate-cell">
      <div class="rate-copy">
        <strong>${row.accuracy.toFixed(1)}%</strong>
        ${interval ? `<span title="${escapeHtml(t("reportedCi"))}" aria-label="${escapeHtml(interval + '. ' + t("reportedCi"))}">${escapeHtml(interval)}</span>` : ""}
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
  const fullLabel = escapeHtml(sourceTypeLabel(row.source_type));
  const shortLabel = escapeHtml(sourceBadgeLabel(row.source_type));
  return `<span class="source-badge source-${escapeHtml(row.source_type)}" aria-label="${fullLabel}" title="${fullLabel}">${shortLabel}</span>`;
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
  document.querySelector(".experiment-table-note").hidden = !rows.some((row) => row.run_config);
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
    const active = (key) => state.sort.key === key ? " is-active" : "";
    const effort = row.thinking_level
      ? `<span class="effort-pill">${escapeHtml(row.thinking_level)}</span>`
      : `<span class="effort-pill muted">${missingValue(true)}</span>`;
    return `
      <tr>
        <td class="row-number-cell">${index + 1}</td>
        <td class="entity-cell harness-cell${active("harness")}">
          ${harnessDetailsButton(row)}
          ${harnessVersionLabel(row) ? `<div class="harness-meta"><span title="${escapeHtml(t(config ? "configuredVersion" : "harnessVersion"))}">${escapeHtml(harnessVersionLabel(row))}</span></div>` : ""}
        </td>
        <td class="entity-cell model-cell${active("model")}">
          <div class="model-primary">${entityName(row.model)}${effort}</div>
        </td>
        <td class="config-cell${active("compression_trigger")}">${compressionCell(row)}</td>
        <td class="config-cell${active("timeout_multiplier")}">${timeoutCell(row)}</td>
        <td class="${active("accuracy").trim()}">${accuracyCell(row)}</td>
        <td class="number-cell${active("total_cost_usd")}">${costCell(row)}</td>
        <td class="source-cell${active("source_type")}">${sourceBadge(row)}</td>
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

  const scores = detailGroup(t("scoreMetrics"), [
    detailItem(t("resolutionRate"), escapeHtml(formatPercent(row.accuracy, 2))),
    detailItem(t("confidenceInterval"), confidence ? escapeHtml(confidence) : null),
    detailItem(t("ciEvidence"), confidence ? escapeHtml(t("reportedCi")) : null),
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
    detailItem(t("benchmarkSnapshot"), `<a href="${escapeHtml(safeUrl(state.benchmark.official_url))}" target="_blank" rel="noreferrer">tbench.ai ↗</a>`),
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

function paretoRows(source) {
  return state.benchmark.results.filter((row) => row.source_type === source
    && Number.isFinite(row.total_cost_usd) && row.total_cost_usd >= 0);
}

function paretoConfigLabel(row) {
  const config = row.run_config;
  return config
    ? `${row.thinking_level || t("notReported")} · ${config.compression_trigger_label} · ${config.timeout_multiplier}×`
    : row.thinking_level || t("notReported");
}

function selectParetoPoint(id, showTooltip = false) {
  const row = paretoRows(state.paretoScope).find((item) => item.id === id);
  if (!row) return;
  state.paretoSelectedId = id;
  elements.paretoChart.querySelectorAll(".pareto-point").forEach((point) => {
    point.classList.toggle("is-selected", point.dataset.resultId === id);
  });
  elements.paretoReadout.textContent = t("paretoPoint", {
    model: row.model.label, harness: `${row.harness.label} · ${paretoConfigLabel(row)}`,
    score: formatPercent(row.accuracy, 2), cost: formatExactCost(row.total_cost_usd),
  });
  if (!showTooltip) return;
  const point = [...elements.paretoChart.querySelectorAll(".pareto-point")].find((node) => node.dataset.resultId === id);
  if (!point) return;
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
    <div class="pareto-tooltip-metrics">
      <div><span>${escapeHtml(t("paretoTooltipRate"))}</span><b>${escapeHtml(formatPercent(row.accuracy, 2))}</b>${ci == null ? "" : `<small>± ${escapeHtml(formatPercent(ci))} · 95% CI</small>`}</div>
      <div><span>${escapeHtml(t(row.source_type === "penguin_run" ? "paretoTooltipCost" : "paretoTooltipOfficialCost"))}</span><b>${escapeHtml(formatExactCost(row.total_cost_usd))}</b></div>
    </div>
    ${partialCostNote(row) ? `<small>${escapeHtml(partialCostNote(row))}</small>` : ""}`;
  tooltip.hidden = false;
  const anchor = point.querySelector(".pareto-point-dot").getBoundingClientRect();
  const box = elements.paretoChart.getBoundingClientRect();
  const scrollX = elements.paretoChart.scrollLeft;
  const px = anchor.left - box.left + scrollX + anchor.width / 2;
  const py = anchor.top - box.top + anchor.height / 2;
  const maxLeft = scrollX + elements.paretoChart.clientWidth - tooltip.offsetWidth - 8;
  const maxTop = elements.paretoChart.clientHeight - tooltip.offsetHeight - 8;
  const preferredLeft = px + 16 <= maxLeft ? px + 16 : px - tooltip.offsetWidth - 16;
  const preferredTop = py + 16 <= maxTop ? py + 16 : py - tooltip.offsetHeight - 16;
  tooltip.style.left = `${Math.max(scrollX + 8, Math.min(preferredLeft, maxLeft))}px`;
  tooltip.style.top = `${Math.max(8, Math.min(preferredTop, maxTop))}px`;
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
  elements.paretoTooltip.hidden = true;
  const availablePenguin = paretoRows("penguin_run");
  if (!availablePenguin.length) state.paretoScope = "benchmark_official";
  const isPenguin = state.paretoScope === "penguin_run";
  const rows = paretoRows(state.paretoScope);
  const frontier = paretoFrontier(rows);
  const frontierIds = new Set(frontier.map((row) => row.id));
  const rangeToggle = elements.paretoPanel.querySelector(".pareto-range-toggle");
  rangeToggle.textContent = t(state.paretoZoomed ? "paretoFullRange" : "paretoZoom");
  rangeToggle.dataset.zoomed = String(state.paretoZoomed);
  elements.paretoPanel.querySelector(".pareto-legend-frontier").title = t("paretoFrontierMeaning");
  elements.paretoPanel.querySelector(".pareto-legend-shade").title = t("paretoShadeMeaning");
  elements.paretoPanel.classList.toggle("is-penguin-view", isPenguin);
  elements.paretoPanel.querySelectorAll("[data-pareto-scope]").forEach((button) => {
    button.disabled = button.dataset.paretoScope === "penguin_run" && !availablePenguin.length;
    button.setAttribute("aria-pressed", String(button.dataset.paretoScope === state.paretoScope));
  });
  elements.paretoPanel.querySelector(".pareto-count").textContent = t("paretoCount", { shown: rows.length });
  const benchmarkLink = elements.paretoPanel.querySelector(".pareto-benchmark");
  benchmarkLink.textContent = `TB ${state.benchmark.version}`;
  benchmarkLink.setAttribute("aria-label", t("benchmarkSwitcher"));
  elements.paretoPanel.querySelector(".pareto-subtitle").textContent = t(isPenguin ? "paretoPenguinSubtitle" : "paretoOfficialSubtitle");
  if (!rows.length) {
    elements.paretoCanvas.innerHTML = `<p class="pareto-empty">${escapeHtml(t("paretoEmpty"))}</p>`;
    elements.paretoPanel.querySelector(".pareto-note").textContent = "";
    elements.paretoPanel.querySelector(".pareto-range-label").textContent = "";
    elements.paretoReadout.replaceChildren();
    return;
  }

  const width = Math.max(640, Math.floor(elements.paretoChart.clientWidth));
  const height = 520;
  const left = 72;
  const right = 32;
  const top = 32;
  const bottom = 66;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const maximum = Math.max(...rows.map((row) => row.total_cost_usd), 1) * 1.08;
  const tickTarget = isPenguin ? 10 : 5;
  const power = 10 ** Math.floor(Math.log10(maximum / tickTarget));
  const step = [1, 2, 2.5, 5, 10].find((value) => value * power >= maximum / tickTarget) * power;
  const xMax = Math.ceil(maximum / step) * step;
  // The focused Penguin view states its range next to the full-scale control.
  const xMin = state.paretoZoomed ? Math.max(0, Math.floor((Math.min(...rows.map((row) => row.total_cost_usd)) - step / 2) / step) * step) : 0;
  const yMin = state.paretoZoomed ? Math.max(0, Math.floor((Math.min(...rows.map((row) => row.accuracy - (row.accuracy_ci95_half_width ?? 0))) - 5) / 5) * 5) : 0;
  const yMax = state.paretoZoomed ? Math.min(100, Math.ceil((Math.max(...rows.map((row) => row.accuracy + (row.accuracy_ci95_half_width ?? 0))) + 5) / 5) * 5) : 100;
  elements.paretoPanel.querySelector(".pareto-note").textContent = t(isPenguin ? "paretoPenguinNote" : "paretoOfficialNote", { min: yMin, max: yMax });
  elements.paretoPanel.querySelector(".pareto-range-label").textContent = t("paretoRange", { min: yMin, max: yMax });
  const x = (value) => left + (value - xMin) / (xMax - xMin) * plotWidth;
  const y = (value) => top + (yMax - value) / (yMax - yMin) * plotHeight;
  const moneyTick = (value) => value >= 1000 ? `$${Number((value / 1000).toFixed(1))}k` : `$${Number(value.toFixed(2))}`;
  const parts = [];
  if (frontier.length) {
    // Match tbench's continuous upper/left envelope, not independent edge strips.
    // Its boundary follows observed scores, never CI endpoints or estimated costs.
    const boundary = [...frontier].reverse().map((row) => `L ${x(row.total_cost_usd)} ${y(row.accuracy)}`).join(" ");
    const shade = `M ${left} ${height - bottom} V ${top} H ${width - right} V ${y(frontier.at(-1).accuracy)} ${boundary} V ${height - bottom} Z`;
    parts.push(`<path class="pareto-frontier-shade" d="${shade}" aria-hidden="true" />`);
  }
  for (let tick = xMin; tick <= xMax + step / 100; tick += step) {
    parts.push(`<line class="pareto-grid pareto-grid-vertical" x1="${x(tick)}" x2="${x(tick)}" y1="${top}" y2="${height - bottom}" />
      <text class="pareto-tick" x="${x(tick)}" y="${height - bottom + 24}" text-anchor="middle">${moneyTick(tick)}</text>`);
  }
  const yStep = state.paretoZoomed ? (yMax - yMin <= 40 ? 5 : 10) : 20;
  for (let tick = yMin; tick <= yMax; tick += yStep) {
    parts.push(`<line class="pareto-grid" x1="${left}" x2="${width - right}" y1="${y(tick)}" y2="${y(tick)}" />
      <text class="pareto-tick" x="${left - 12}" y="${y(tick) + 5}" text-anchor="end">${tick}%</text>`);
  }
  if (frontier.length) {
    if (frontier.length > 1) {
      const points = frontier.map((row) => `${x(row.total_cost_usd)},${y(row.accuracy)}`).join(" ");
      parts.push(`<polyline class="pareto-frontier${isPenguin ? " is-provisional" : ""}" points="${points}" />`);
    }
  }
  parts.push(`<path class="pareto-axis" d="M ${left} ${top} V ${height - bottom} H ${width - right}" />`);
  const labelBoxes = [];
  const labels = [];
  const textMeasure = document.createElement("canvas").getContext("2d");
  const chartFont = getComputedStyle(elements.paretoChart).fontFamily;
  const pointPositions = rows.map((row) => ({ x: x(row.total_cost_usd), y: y(row.accuracy) }));
  const frontierPositions = frontier.map((row) => ({ x: x(row.total_cost_usd), y: y(row.accuracy) }));
  const labelObstacles = frontierPositions.slice(1).map((point, i) => [frontierPositions[i], point]);
  rows.forEach((row) => {
    if (row.accuracy_ci95_half_width == null) return;
    const px = x(row.total_cost_usd);
    const low = y(Math.max(yMin, row.accuracy - row.accuracy_ci95_half_width));
    const high = y(Math.min(yMax, row.accuracy + row.accuracy_ci95_half_width));
    labelObstacles.push([{ x: px, y: low }, { x: px, y: high }],
      [{ x: px - 3, y: low }, { x: px + 3, y: low }],
      [{ x: px - 3, y: high }, { x: px + 3, y: high }]);
  });
  const prioritized = [...rows].sort((a, b) => Number(frontierIds.has(b.id)) - Number(frontierIds.has(a.id)) || b.accuracy - a.accuracy);
  const baseLabel = (row) => isPenguin ? paretoConfigLabel(row)
    : `${row.model.label}${row.thinking_level ? ` · ${row.thinking_level}` : ""}`;
  const labelCounts = new Map();
  rows.forEach((row) => labelCounts.set(baseLabel(row), (labelCounts.get(baseLabel(row)) || 0) + 1));
  prioritized.forEach((row) => {
    const px = x(row.total_cost_usd);
    const py = y(row.accuracy);
    const onFrontier = frontierIds.has(row.id);
    const label = baseLabel(row) + (!isPenguin && labelCounts.get(baseLabel(row)) > 1 ? ` · ${row.harness.label}` : "");
    const ci = row.accuracy_ci95_half_width;
    const pointTitle = t("paretoPoint", { model: row.model.label, harness: `${row.harness.label} · ${paretoConfigLabel(row)}`, score: formatPercent(row.accuracy, 2), cost: formatExactCost(row.total_cost_usd) });
    if (ci != null) {
      const lower = y(Math.max(yMin, row.accuracy - ci));
      const upper = y(Math.min(yMax, row.accuracy + ci));
      parts.push(`<path class="pareto-interval" d="M${px},${lower}V${upper}M${px - 3},${lower}h6M${px - 3},${upper}h6" />`);
    }
    const half = onFrontier ? 5 : 4;
    const marker = isPenguin
      ? `<circle class="pareto-point-hit" cx="${px}" cy="${py}" r="14"/><circle class="pareto-point-dot" cx="${px}" cy="${py}" r="${onFrontier ? 7 : 6}"/>`
      : `<rect class="pareto-point-hit" x="${px - 12}" y="${py - 12}" width="24" height="24" rx="3"/><rect class="pareto-point-dot" x="${px - half}" y="${py - half}" width="${half * 2}" height="${half * 2}"/>`;
    parts.push(`<g class="pareto-point${onFrontier ? " is-frontier" : ""}" data-result-id="${escapeHtml(row.id)}" tabindex="0" role="button" aria-haspopup="dialog" aria-label="${escapeHtml(pointTitle)}">${marker}</g>`);
    textMeasure.font = `${isPenguin || onFrontier ? 500 : 400} ${isPenguin ? 15 : 14}px ${chartFont}`;
    let labelWidth = textMeasure.measureText(label).width + 8;
    const metricsLabel = isPenguin ? `${formatPercent(row.accuracy, 1)} · ${formatExactCost(row.total_cost_usd)}` : "";
    if (isPenguin) {
      textMeasure.font = `400 13px ${chartFont}`;
      labelWidth = Math.max(labelWidth, textMeasure.measureText(metricsLabel).width + 8);
    }
    const labelTop = isPenguin ? 16 : 14;
    const labelBottom = isPenguin ? 24 : 4;
    const candidates = [
      { x: px + 14, y: py + 4 }, { x: px - labelWidth - 14, y: py + 4 },
      { x: px + 14, y: py - 20 }, { x: px - labelWidth - 14, y: py - 20 },
      { x: px + 14, y: py + 32 }, { x: px - labelWidth - 14, y: py + 32 },
      { x: px + 14, y: py - 44 }, { x: px - labelWidth - 14, y: py + 56 },
      { x: px - labelWidth - 14, y: py - 44 }, { x: px + 14, y: py + 56 },
      { x: px - labelWidth / 2, y: py - 20 }, { x: px - labelWidth / 2, y: py + 32 },
      { x: px + 14, y: py - 68 }, { x: px - labelWidth - 14, y: py - 68 },
      { x: px + 14, y: py + 80 }, { x: px - labelWidth - 14, y: py + 80 },
      { x: px + 38, y: py + 32 },
    ];
    const distanceToLabel = (point, position) => Math.hypot(
      Math.max(position.x - point.x, 0, point.x - position.x - labelWidth),
      Math.max(position.y - labelTop - point.y, 0, point.y - position.y - labelBottom),
    );
    const position = candidates.find((p) => p.x >= left + 2 && p.x + labelWidth <= width - right
      && p.y - labelTop >= top && p.y + labelBottom <= height - bottom
      && !pointPositions.some((point) => point.x + 9 > p.x && point.x - 9 < p.x + labelWidth && point.y + 9 > p.y - labelTop && point.y - 9 < p.y + labelBottom)
      // A nearby Penguin label should belong visually to its own dot, not a neighbour.
      && (!isPenguin || pointPositions.every((point) => distanceToLabel({ x: px, y: py }, p) <= distanceToLabel(point, p) + 0.01))
      && !labelObstacles.some(([start, end]) => segmentCrossesBox(start, end, { x: p.x - 2, y: p.y - labelTop - 1, width: labelWidth + 4, height: labelTop + labelBottom + 3 }))
      && !labelBoxes.some((box) => p.x < box.x + box.width && p.x + labelWidth > box.x && p.y - labelTop - 1 < box.y + labelBottom + 1 && p.y + labelBottom + 1 > box.y - labelTop - 1));
    if (position) {
      labelBoxes.push({ ...position, width: labelWidth });
      if (position.y !== py + 4) {
        const endX = Math.max(position.x - 3, Math.min(px, position.x + labelWidth - 5));
        const endY = position.y < py ? position.y + labelBottom + 1 : position.y - labelTop - 1;
        // Nearby Penguin labels are clear without a tiny diagonal connector.
        if (!isPenguin || Math.hypot(endX - px, endY - py) > 28) {
          labels.unshift(`<line class="pareto-label-leader" x1="${px}" y1="${py}" x2="${endX}" y2="${endY}" />`);
        }
      }
      const content = isPenguin
        ? `<tspan x="${position.x}">${escapeHtml(label)}</tspan><tspan class="pareto-point-values" x="${position.x}" dy="20">${escapeHtml(metricsLabel)}</tspan>`
        : escapeHtml(label);
      labels.push(`<text class="pareto-point-label${onFrontier ? " is-frontier" : ""}" data-result-id="${escapeHtml(row.id)}" x="${position.x}" y="${position.y}">${content}</text>`);
    }
  });
  const xLabel = t(isPenguin ? "paretoAxisCost" : "paretoAxisOfficialCost");
  elements.paretoCanvas.innerHTML = `<svg class="pareto-svg" viewBox="0 0 ${width} ${height}" data-y-min="${yMin}" data-y-max="${yMax}" role="group" aria-label="${escapeHtml(t("resolutionRate") + ' × ' + xLabel)}">
    <desc>${escapeHtml(t("paretoShadeMeaning"))}</desc>
    <rect class="pareto-plot-background" x="${left}" y="${top}" width="${plotWidth}" height="${plotHeight}" rx="0" />
    ${parts.join("")}${labels.join("")}
    <text class="pareto-axis-label" x="${left + plotWidth / 2}" y="${height - 8}" text-anchor="middle">${escapeHtml(xLabel)}</text>
    <text class="pareto-axis-label" transform="translate(17 ${top + plotHeight / 2}) rotate(-90)" text-anchor="middle">${escapeHtml(t("resolutionRate"))}</text>
  </svg>`;
  const selected = rows.find((row) => row.id === state.paretoSelectedId) || frontier.at(-1) || rows[0];
  selectParetoPoint(selected.id);
}

function renderCoverage() {
  const benchmarks = state.payload?.benchmarks || [];
  elements.coverageGrid.innerHTML = benchmarks.map((bench) => {
    const isCurrent = bench.id === state.benchmark.id;
    return `
      <article class="coverage-card${isCurrent ? " is-current" : ""}"${isCurrent ? ' aria-current="true"' : ""}>
        <h3>${escapeHtml(bench.name)}</h3>
        <div class="coverage-total">
          <strong>${escapeHtml(formatNumber(bench.result_count) ?? "0")}</strong>
          <span>${escapeHtml(t("publicResults"))}</span>
        </div>
        <dl class="coverage-source-grid">
          <div><dt title="${escapeHtml(t("benchmarkOfficial"))}">${escapeHtml(t("coverageOfficial"))}</dt><dd>${escapeHtml(formatNumber(bench.official_result_count ?? 0))}</dd></div>
          <div><dt title="${escapeHtml(t("vendorReported"))}">${escapeHtml(t("vendorReportedShort"))}</dt><dd>${escapeHtml(formatNumber(bench.vendor_result_count ?? 0))}</dd></div>
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
  const officialUrl = new URL(bench.official_url);
  officialUrl.searchParams.set("efforts", "all");
  document.querySelectorAll(".benchmark-source-link").forEach((link) => {
    link.href = officialUrl.href;
  });
  document.querySelector(".snapshot-label").textContent = `tbench.ai · ${bench.version}`;
  renderTable();
  renderCoverage();
  renderPareto();
}

function selectBenchmark(id, updateUrl = true) {
  const bench = state.payload.benchmarks.find((item) => item.id === id);
  if (!bench) return;
  state.benchmark = bench;
  state.filters = { source: "", harness: "", model: "", thinking: "" };
  state.sort = { key: "accuracy", direction: "desc" };
  state.paretoScope = "penguin_run";
  state.paretoSelectedId = null;
  state.paretoZoomed = state.benchmark.results.some((row) => row.source_type === "penguin_run" && Number.isFinite(row.total_cost_usd));
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
  elements.paretoPanel.addEventListener("click", (event) => {
    if (event.target.closest(".pareto-range-toggle")) {
      state.paretoZoomed = !state.paretoZoomed;
      renderPareto();
      return;
    }
    const scope = event.target.closest("[data-pareto-scope]");
    if (scope && !scope.disabled) {
      state.paretoScope = scope.dataset.paretoScope;
      state.paretoSelectedId = null;
      state.paretoZoomed = state.paretoScope === "penguin_run";
      renderPareto();
      return;
    }
    const trigger = paretoPointAt(event);
    if (!trigger) return;
    const id = trigger.dataset.resultId;
    const row = state.benchmark.results.find((item) => item.id === id);
    if (row) openDetails(row, trigger);
  });
  elements.paretoChart.addEventListener("pointermove", (event) => {
    const point = paretoPointAt(event);
    elements.paretoChart.classList.toggle("has-hover-point", !!point);
    if (point) selectParetoPoint(point.dataset.resultId, true);
    else elements.paretoTooltip.hidden = true;
  });
  elements.paretoChart.addEventListener("focusin", (event) => {
    const point = event.target.closest(".pareto-point");
    if (point) selectParetoPoint(point.dataset.resultId, true);
  });
  elements.paretoChart.addEventListener("pointerleave", () => {
    if (!elements.paretoChart.contains(document.activeElement)) elements.paretoTooltip.hidden = true;
  });
  elements.paretoChart.addEventListener("focusout", () => { elements.paretoTooltip.hidden = true; });
  elements.paretoChart.addEventListener("keydown", (event) => {
    const point = event.target.closest(".pareto-point");
    if (point && ["Enter", " "].includes(event.key)) {
      event.preventDefault();
      point.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    }
  });
  addEventListener("scroll", updateBenchRailState, { passive: true });
  addEventListener("resize", updateBenchRailState);
  const tableObserver = new ResizeObserver(updateTableOverflow);
  tableObserver.observe(elements.tableWrap);
  tableObserver.observe(elements.tableWrap.querySelector("table"));
  let plotWidth = 0;
  const plotObserver = new ResizeObserver(() => {
    const width = Math.floor(elements.paretoChart.clientWidth);
    if (state.benchmark && width !== plotWidth) {
      plotWidth = width;
      renderPareto();
    }
  });
  plotObserver.observe(elements.paretoChart);
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
    updateBenchRailState();
    // The results table grows after the browser's initial fragment navigation.
    // Restore an explicit chart deep link once data and fonts have settled.
    if (location.hash === "#pareto") {
      await document.fonts.ready;
      requestAnimationFrame(() => {
        if (location.hash === "#pareto") elements.paretoPanel.scrollIntoView({block: "start", behavior: "instant"});
      });
    }
  } catch (error) {
    console.error(error);
    elements.resultsBody.innerHTML = `<tr><td class="empty-cell" colspan="8">${escapeHtml(t("dataError"))}</td></tr>`;
    elements.resultCount.textContent = t("dataError");
  }
}

init();
