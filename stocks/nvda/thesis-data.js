/* ╔══════════════════════════════════════════════════════════════════════════╗
   ║   NVDA · thesis-data.js — ALL per-stock content lives here.              ║
   ║   ███  EDIT EVERYTHING IN THIS FILE EACH QUARTER  ███                    ║
   ║                                                                          ║
   ║   The rendering engine (../engine/thesis-engine.js) contains ZERO        ║
   ║   company-specific strings — every number, narrative, and tooltip        ║
   ║   that mentions NVDA is in this file. Quarterly touch = edit this        ║
   ║   file only, then run: node tools/lint-thesis-data.js NVDA               ║
   ║                                                                          ║
   ║   NOTE: NVIDIA's fiscal year ends in late January. "Q2 FY27" = the       ║
   ║   May–Jul 2026 calendar quarter, reports 2026-08-26.                     ║
   ║                                                                          ║
   ║   Quick map — after each earnings report:                                ║
   ║     1. AS_OF_DATE / FALLBACK_PRICE                                       ║
   ║     2. HISTORY (add quarter) / FUTURE_Q (roll fiscal labels) / PROJ_END  ║
   ║     3. CASES — re-read each narrative, still true?                       ║
   ║     4. SIGNALS / MARGIN — update BEAT/MATCH/MISS + positions             ║
   ║     5. KPI_HIST / KPI_PROJ (total quarterly revenue, $B)                 ║
   ║     6. TRACK_ALL — append new quarter (oldest auto-drops)                ║
   ║     7. TEXT.* — re-read every narrative template, refresh stale facts    ║
   ║     8. ALERT — keep in sync with PF_ALERTS (canonical)                   ║
   ╚══════════════════════════════════════════════════════════════════════════╝ */

const TICKER_META = { ticker: "NVDA", exchange: "NASDAQ", company: "NVIDIA Corporation" };
// AS_OF_DATE intentionally NOT bumped to the 2026-08-01 migration date — this is a
// STRUCTURAL migration (port the existing content into the engine-split shape), not a
// numbers refresh. CASES/SIGNALS/HISTORY/target prices below are unchanged from the
// pre-migration build (dated 2026-05-29). The PAST-tab financials and VAL_CONFIG below
// are new content this migration had to research fresh (see the GOOGL-migration note in
// CLAUDE.md for why — this build predates the PAST/CURRENT/FUTURE tab convention) but were
// deliberately sourced using numbers that were ALREADY KNOWN as of 2026-05-29 (FY2026
// actuals reported 2026-02-25, the $8.47 FY2027E consensus EPS the pre-migration build
// itself cites) rather than today's fresher consensus, to keep this file internally
// consistent with one point in time. NVDA reports Q2 FY2027 on 2026-08-26 — its own
// /update-thesis touch, not this migration, is where CASES/AS_OF_DATE next move forward.
const AS_OF_DATE = "2026-05-29";

// H20 export ban / write-off dislocation (Apr–May 2025). Only update if a new shock occurs.
const DISLOCATION_DATE = "2025-05-28";  // Q1 FY2026 earnings: $4.5B H20 write-off disclosed
const REVERSION_TROUGH = 118;           // approximate post-shock price low
const REVERSION_BASEFLOOR = 162;        // bottom of base band at recovery start (Q4 FY26 bottom)
const REVERSION_PRECEDENT_DAYS = 270;   // ~9 months from shock to base-zone recovery

// CASES — ported verbatim from the pre-migration stocks/NVDA/NVDA-thesis.html (2026-05-29).
// Not rewritten as part of this migration; due its own Layer-2 audit at the next /update-thesis.
const CASES = {
  bear: {
    key: "bear", label: "BEAR", accent: "#f1564b", glow: "rgba(241,86,75,0.45)",
    target12: "$120 — $185",
    op: "Operational state: custom silicon substitution accelerates faster than expected — Google, Amazon, Microsoft, and Meta shift meaningful inference workloads to in-house chips, compressing NVIDIA's data center growth toward 20–30% annualized. China's export ban proves permanent as US-China tech relations deteriorate, blocking a key revenue recovery. Gross margins compress toward 65–68% as NVIDIA cuts Blackwell pricing to defend share against AMD MI400 and hyperscaler ASICs. FY2027 EPS disappointments at $6.50–7.00 force a re-rating to 17–22x as the market concludes NVIDIA is a cyclical semiconductor company, not an indefinite monopolist.",
    breaks: "Hyperscaler earnings consistently confirm NVIDIA is irreplaceable for training AND inference with zero intent to reduce orders; gross margins hold above 73% for 2+ consecutive quarters; China H200 deliveries begin at material scale.",
    requires01: "hyperscaler custom silicon substitution signals (observable now)",
    requires02: "Q2 revenue miss below $88B + gross margin guide below 70%",
  },
  base: {
    key: "base", label: "BASE", accent: "#e0a83b", glow: "rgba(224,168,59,0.40)",
    target12: "$200 — $305",
    op: "Operational state: NVIDIA delivers on its FY2027 roadmap — revenue reaches $370–390B, Blackwell demand stays fierce, and gross margins hold in the 73–76% range as Blackwell Ultra commands premium ASPs. Custom silicon grows as a complement to NVIDIA, not a substitute: hyperscalers use in-house chips for narrow inference but continue buying NVIDIA for training and frontier models. China stays restricted but does not worsen. At 25x FY2027E $8.47, current price ($213) is roughly base fair value — further upside requires a bull outcome.",
    breaks: "Either competitive erosion materializes and margins crack (bear lane), or China recovers AND Rubin beats EPS by 20%+ AND the multiple re-rates above 32x (bull lane).",
    requires01: "Blackwell Ultra / Rubin supply chain milestones on schedule",
    requires02: "Q2 revenue $91–94B + gross margin 73–76%",
  },
  bull: {
    key: "bull", label: "BULL", accent: "#3fd07a", glow: "rgba(63,208,122,0.45)",
    target12: "$310 — $460",
    op: "Operational state: AI inference demand grows even larger than the training wave, overwhelming all near-term supply. Rubin (NVL144 rack systems) ships ahead of schedule at ASPs 50%+ above Blackwell, driving FY2027 EPS toward $10–11+. China restrictions ease materially — H200 deliveries begin and a Rubin Lite export variant gets approved — restoring $10–15B/quarter of revenue. NVIDIA's NIM / NeMo software stack begins generating material recurring licensing revenue, pushing gross margins above 78%. Market re-rates from 25x to 35–42x as investors recognize NVIDIA as non-optional AI infrastructure.",
    breaks: "Any quarter where data center revenue growth decelerates below 50% YoY while margins simultaneously compress — that double signal proves the competitive erosion thesis. Or US-China escalation making even H200 approvals impossible.",
    requires01: "China H200 deliveries confirmed at scale OR Rubin Lite export approval",
    requires02: "gross margin ≥78% + full-year guidance raised above $375B",
  },
};

// THESIS_HISTORY intentionally omitted (left undefined) rather than declared as `[]`:
// this migration is a structural port, not a CASES rewrite, so there is no outgoing
// vintage to archive yet — lint-thesis-data.js's checkThesisHistory treats a genuinely
// empty array as malformed (fails) but treats `undefined` as a soft "not yet started"
// recommendation. It gets its first real entry at NVDA's next /update-thesis, right
// before that touch's Layer-2 audit rewrites CASES for the first time post-migration.

const FALLBACK_PRICE = 213.00;

const LIVE_PRICE = {
  enabled: true,
  symbol: "NVDA",
  provider: "yahoo",
  corsProxy: "https://api.allorigins.win/get?url=",
  finnhubToken: "",
};

// ALERT — buy-trigger pre-commitment. Canonical source is PF_ALERTS.NVDA in
// stocks/portfolio/portfolio-data.js; this copy is a FALLBACK for offline opens.
// buyFloor = base-case floor ($200, from CASES.base.target12 above) — NVDA is a held
// position (PF_RAW) with a full thesis, so this is a genuine new PF_ALERTS addition
// added alongside this migration, not just a sync of an existing row.
const ALERT = {
  symbol: "NVDA",
  buyFloor: 200,
  thesisIntact: true,
  asOf: AS_OF_DATE,
  nextEarnings: "2026-08-26",
};

const HISTORY = [
  { q: "Q1 25", p: 118 },
  { q: "Q2 25", p: 133 },
  { q: "Q3 25", p: 140 },
  { q: "Q4 25", p: 146 },
  { q: "Q1 26", p: 183 },
  { q: "NOW",   p: FALLBACK_PRICE },
];
// Note: Q4 2025 close ($146) confirmed. Earlier prices estimated from 52-week data + earnings dates.
// 52-week low: $132.92. Q1 FY2026 H20 write-off (May 2025) drove the dislocation.

const PROJ_END = { bear: 152, base: 258, bull: 388 };
const FUTURE_Q = ["Q2 FY27", "Q3 FY27", "Q4 FY27", "Q1 FY28"];

const SIGNALS = {
  bear: [
    { name: "Data Center Revenue (Q2 Trend)", unit: "$B/qtr", tag: "MISS",  next: "Aug 26, 2026", val: "BEAR <$80B",       guide: "Q1: $75B",       pos: 0.18 },
    { name: "Q2 Revenue vs. $91B Guide",      unit: "$B",     tag: "MISS",  next: "Aug 26, 2026", val: "BEAR <$88B",       guide: "GUIDE $89-93B",  pos: 0.15 },
    { name: "China Revenue Recovery",         unit: "EVENT",  tag: "MISS",  next: "Ongoing",      val: "BEAR ban hardens", guide: "H200 in limbo",  pos: 0.18 },
  ],
  base: [
    { name: "Data Center Revenue (Q2 Trend)", unit: "$B/qtr", tag: "MATCH", next: "Aug 26, 2026", val: "BASE $82–86B",     guide: "Q1: $75B",       pos: 0.57 },
    { name: "Q2 Revenue vs. $91B Guide",      unit: "$B",     tag: "BEAT",  next: "Aug 26, 2026", val: "BASE $91–94B",     guide: "GUIDE $89-93B",  pos: 0.62 },
    { name: "China Revenue Recovery",         unit: "EVENT",  tag: "WATCH", next: "Ongoing",      val: "BASE no change",   guide: "H200 in limbo",  pos: 0.48 },
  ],
  bull: [
    { name: "Data Center Revenue (Q2 Trend)", unit: "$B/qtr", tag: "BEAT",  next: "Aug 26, 2026", val: "BULL $88B+",       guide: "Q1: $75B",       pos: 0.86 },
    { name: "Q2 Revenue vs. $91B Guide",      unit: "$B",     tag: "BEAT",  next: "Aug 26, 2026", val: "BULL ≥$95B",       guide: "GUIDE $89-93B",  pos: 0.91 },
    { name: "China Revenue Recovery",         unit: "EVENT",  tag: "BEAT",  next: "Ongoing",      val: "BULL H200 ships",  guide: "H200 in limbo",  pos: 0.82 },
  ],
};
const MARGIN = {
  bear: [
    { name: "Gross Margin %",              tag: "MISS",  next: "Aug 26, 2026", pos: 0.18 },
    { name: "CUDA Moat / Competitive Pos", tag: "MISS",  next: "Ongoing",      pos: 0.20 },
  ],
  base: [
    { name: "Gross Margin %",              tag: "MATCH", next: "Aug 26, 2026", pos: 0.57 },
    { name: "CUDA Moat / Competitive Pos", tag: "WATCH", next: "Ongoing",      pos: 0.50 },
  ],
  bull: [
    { name: "Gross Margin %",              tag: "BEAT",  next: "Aug 26, 2026", pos: 0.83 },
    { name: "CUDA Moat / Competitive Pos", tag: "BEAT",  next: "Ongoing",      pos: 0.80 },
  ],
};

// KPI panel — TOTAL QUARTERLY REVENUE ($B), not gross margin. The pre-migration build used
// non-GAAP gross margin as its hero KPI, but the shared engine's "price-implied full-year
// revenue" card (THE CURRENT tab) sums KPI_HIST + 3 base-case KPI_PROJ quarters against
// VAL_CONFIG.prior_fy_rev_b — that math only means something if the KPI is revenue, the
// same convention TSM/ASML/MU/MRVL/GOOGL all use. Gross margin itself is NOT dropped — it's
// still fully tracked as a MARGIN signal above (and remains the fastest-moving competitive-
// pressure tell, per SIGNAL_HELP below); this is which single metric drives the big KPI
// bar chart, not a change to what's monitored. This also matches the NVDA checklist's own
// stated #1-priority KPI ("data center quarterly revenue run rate ... if this plateaus,
// everything stalls") more directly than gross margin did.
const KPI_HIST = 81.6;  // Q1 FY2027 actual total revenue ($B), +85% YoY
const KPI_PROJ = {
  bear:  [86, 84, 82, 80],
  base:  [92, 98, 104, 108],
  bull:  [96, 106, 118, 130],
};

// TRACK RECORD — append newest to end; dashboard keeps last TRACK_WINDOW.
const TRACK_ALL = [
  { q: "Q3 FY25", date: "2024-11", post: 145, reaction: "+",  bear: [88,115],  base: [128,168], bull: [188,252], landed: "base",      conf: "med"  },
  { q: "Q4 FY25", date: "2025-02", post: 132, reaction: "-",  bear: [82,108],  base: [120,158], bull: [180,248], landed: "bear→base", conf: "med"  },
  { q: "Q1 FY26", date: "2025-05", post: 120, reaction: "--", bear: [75,98],   base: [112,150], bull: [170,238], landed: "bear",      conf: "high" },
  { q: "Q2 FY26", date: "2025-08", post: 141, reaction: "++", bear: [82,110],  base: [128,172], bull: [198,270], landed: "base",      conf: "high" },
  { q: "Q3 FY26", date: "2025-11", post: 155, reaction: "+",  bear: [90,118],  base: [140,190], bull: [215,292], landed: "base",      conf: "high" },
  { q: "Q4 FY26", date: "2026-02", post: 213, reaction: "++", bear: [106,138], base: [162,220], bull: [252,342], landed: "base→bull", conf: "high" },
];
const TRACK_WINDOW = 6;

// THE PAST — annual history (Wisesheets 10-Q/10-K facts, SEC-cited). NVIDIA's fiscal year
// ends late January, so "FY2026" = the year ended 2026-01-25 (mostly calendar 2025), etc.
// Only 5 fiscal years (FY2022-FY2026) available — Wisesheets' free-tier plan caps history
// at 5 years. Price points used for EV/EBITDA and FCF yield are each fiscal year's own
// month-end close nearest the FY-end date (Jan close), from Wisesheets EOD price history;
// share counts are Wisesheets-reported diluted shares outstanding, with FY2022's figure
// (reported un-split) scaled 10x for NVIDIA's June 2024 10-for-1 split to stay comparable
// across the window — a real data-quality wrinkle worth flagging, not silently smoothed over.
const PAST_YEARS       = ["FY2022","FY2023","FY2024","FY2025","FY2026"];
const PAST_REV         = [26.9,  27.0,  60.9,  130.5, 215.9];
const PAST_GM          = [64.9,  56.9,  72.7,  75.0,  71.1];
const PAST_FCF         = [8.1,   3.8,   27.0,  60.9,  96.7];
const PAST_ROIC        = [27.1,  14.4,  62.4,  87.5,  70.2];
const PAST_EVEBITDA    = [56.2,  86.4,  44.6,  35.8,  35.2];
const PAST_FCF_YIELD   = [1.3,   0.8,   1.8,   2.0,   2.1];
const PAST_CAPEX_REV   = [3.6,   6.8,   1.8,   2.5,   2.8];
const PRICE_M_LABELS = ["2022-01","2022-02","2022-03","2022-04","2022-05","2022-06","2022-07","2022-08","2022-09","2022-10","2022-11","2022-12","2023-01","2023-02","2023-03","2023-04","2023-05","2023-06","2023-07","2023-08","2023-09","2023-10","2023-11","2023-12","2024-01","2024-02","2024-03","2024-04","2024-05","2024-06","2024-07","2024-08","2024-09","2024-10","2024-11","2024-12","2025-01","2025-02","2025-03","2025-04","2025-05","2025-06","2025-07","2025-08","2025-09","2025-10","2025-11","2025-12","2026-01","2026-02","2026-03","2026-04","2026-05","2026-06","2026-07"];
const PRICE_M = [24.49,24.39,27.29,18.55,18.67,15.16,18.16,15.09,12.14,13.5,16.92,14.61,19.54,23.22,27.78,27.75,37.83,42.3,46.73,49.36,43.5,40.78,46.77,49.52,61.53,79.11,90.36,86.4,109.63,123.54,117.02,119.37,121.44,132.76,138.25,134.29,120.07,124.92,108.38,108.92,135.13,157.99,177.87,174.18,186.58,202.49,177.0,186.5,191.13,177.19,174.4,199.57,211.14,200.09,200.75];
const PRICE_M_DD = [0.0,-0.4,0.0,-32.0,-31.6,-44.4,-33.5,-44.7,-55.5,-50.5,-38.0,-46.5,-28.4,-14.9,0.0,-0.1,0.0,0.0,0.0,0.0,-11.9,-17.4,-5.2,0.0,0.0,0.0,0.0,-4.4,0.0,0.0,-5.3,-3.4,-1.7,0.0,0.0,-2.9,-13.2,-9.6,-21.6,-21.2,-2.3,0.0,0.0,-2.1,0.0,0.0,-12.6,-7.9,-5.6,-12.5,-13.9,-1.4,0.0,-5.2,-4.9];
const PAST_EVENTS = [
  { idx: 8,  label: "Crypto/Gaming Crash", note: "Sep 2022 — crypto-mining GPU demand collapsed alongside a gaming-GPU inventory glut and the broad 2022 rate-hike derating. Deepest drawdown in this window (-55.5% from the prior high); the FY2023 fiscal year (ended Jan 2023) was NVIDIA's growth trough, with gross margin compressing to 56.9%." },
  { idx: 16, label: "AI Inflection",       note: "May 2023 — NVIDIA's blowout Q1 FY2024 quarter and guidance ignited the AI-accelerator capex narrative almost overnight. The start of the current re-rating cycle — gross margin recovered to 72.7% that fiscal year as data-center GPU demand overwhelmed supply." },
  { idx: 38, label: "DeepSeek + Export-Curb Shock", note: "Jan–Apr 2025 — the DeepSeek low-cost-model efficiency scare (Jan 27, 2025) compounded by new US export restrictions on China AI-chip sales (Apr 2025) drove a real, if temporary, derating. The $4.5B H20 write-off was disclosed at the following Q1 FY2026 print (May 28, 2025) — the formal dislocation date this thesis tracks." },
  { idx: 52, label: "Fresh ATH",           note: "May 2026 — highest monthly close in this window ($211.14) as the Blackwell ramp ran at full tilt. Current price sits modestly below this high." },
];

const VAL_CONFIG = {
  ntm_eps:              8.47,     // FY2027E consensus (61 analysts) as cited in the pre-migration build, 2026-05-29 — carried forward unchanged, not refreshed to today's newer consensus, to keep this file internally consistent with one point in time. Due for reconciliation at the Aug 26, 2026 /update-thesis.
  shares_b:             24.51,
  fcf_ntm_b:            96.7,     // FY2026 actual FCF (reported 2026-02-25), the most recent full fiscal year known as of AS_OF_DATE
  risk_free_pct:         4.35,
  default_discount_pct: 10.5,     // slightly above TSM/GOOGL — NVDA carries more competitive/custom-silicon-substitution risk than either chokepoint
  default_terminal_pe:   22,
  dcf_years:              5,
  capex_fy26_guide_b:    6.5,     // NVIDIA doesn't guide its own capex the way TSM does; this is a rough next-FY estimate off FY2026 actual ($6.04B)
  prior_fy_rev_b:       215.9,    // FY2026 actual revenue (reported 2026-02-25, known well before AS_OF_DATE)
  prior_fy_label:       "FY2026",
  pe_trough: 15, pe_bear_hi: 19, pe_normal_lo: 21, pe_normal_hi: 27, pe_bull_lo: 31, pe_peak: 50,
  peers: [
    { t: "NVDA", fpe: 21.5, ev_eb: 37.0, fcf_y: 2.0, note: "GPU + CUDA software monopoly — the AI-compute chokepoint the rest of this table is priced against" },
    { t: "AMD",  fpe: 68.8, ev_eb: 90.0, fcf_y: 1.1, note: "Data center GPU #2 (MI400 ramping); far smaller absolute profit pool makes its multiples run hot" },
    { t: "AVGO", fpe: 19.4, ev_eb: 44.2, fcf_y: 1.8, note: "Custom AI ASIC (Google TPU, Meta MTIA) + networking — the main hyperscaler-in-house-silicon exposure here" },
    { t: "TSM",  fpe: 26.6, ev_eb: 14.1, fcf_y: 2.7, note: "Foundry monopoly — manufactures NVIDIA's (and everyone else's) leading-edge chips" },
  ],
};

const SIGNAL_HELP = {
  "Data Center Revenue (Q2 Trend)": "NVIDIA's data center segment — AI GPUs, DGX systems, networking — did $75 billion last quarter alone: 92% of total company revenue. This IS the entire business. If quarterly data center revenue keeps climbing toward $90B, $100B+, the bull case builds. If it plateaus or reverses, the whole growth thesis stalls. Q2 guidance of $91B total implies data center around $83–84B.",
  "Q2 Revenue vs. $91B Guide": "NVIDIA guided Wall Street to $91 billion in sales for Q2 FY2027 (the July 2026 quarter, reports Aug 26, 2026). This is the near-term execution test. NVIDIA typically guides conservatively and beats — a miss here would be the first real crack in the Blackwell demand cycle and a major re-rating event.",
  "China Revenue Recovery": "The US government banned NVIDIA's H20 chip for China in April 2025, costing ~$15–20B per year in revenue and triggering a $4.5B write-off. About 10 Chinese firms are approved to buy H200s (75K units each), but no deliveries have happened — stuck in legal limbo. If exports resume at scale, that's significant upside. If restrictions tighten further, it's a permanent revenue ceiling.",
  "Gross Margin %": "Out of every dollar of chip and system revenue, how much stays after manufacturing costs. At 74.9%, NVIDIA's margins are extraordinary for hardware — reflecting the pricing power of its CUDA software lock-in. The risk: if AMD or hyperscaler custom silicon forces NVIDIA to cut prices to defend share, margins compress first, before revenue does. Gross margin is the leading indicator of competitive pressure.",
  "CUDA Moat / Competitive Pos": "NVIDIA's real moat isn't the GPU hardware — it's CUDA, the software environment every AI researcher has spent years learning. Google runs 75%+ of Gemini inference on its own TPUs, but most frontier AI models are still trained on NVIDIA hardware because switching software stacks is expensive and risky. This KPI tracks whether that dependency is strengthening (NVIDIA irreplaceable for training + inference) or weakening (hyperscalers migrating key workloads to custom silicon).",
};
const TAG_HELP = {
  BEAT: "doing better than expected — a good sign.",
  MATCH: "roughly in line with expectations — steady, no surprises.",
  MISS: "falling short of expectations — a worry.",
  WATCH: "not decided yet — keep an eye on it.",
};

const THESIS_ITEMS = [
  { key: "dataCenterRevenue", label: "Data center revenue trend still expanding",       note: "$75B last quarter (92% of total revenue); Q2 FY27 guide implies ~$83-84B" },
  { key: "q2RevVsGuide",      label: "Q2 FY27 revenue landing within the $91B guide",   note: "Guided ~$89-93B; a miss below $88B is the bear trigger" },
  { key: "chinaRecovery",     label: "China H200 status not deteriorating further",     note: "~10 firms approved to buy H200s but deliveries remain stuck in legal limbo" },
  { key: "grossMarginCuda",   label: "Gross margin holding above 73% (CUDA moat intact)", note: "74.9% in Q1 FY27; a slide below 70% is the first sign of competitive erosion" },
];
const PRICE_ZONES = [
  { label: "BEAR", lo: 120, hi: 185, mid: 152, color: "#f1564b", action: "Exit / reduce if thesis also breaking" },
  { label: "BASE", lo: 200, hi: 305, mid: 258, color: "#e0a83b", action: "Small add OK if thesis intact" },
  { label: "BULL", lo: 310, hi: 460, mid: 388, color: "#3fd07a", action: "Let it ride — don't chase" },
];

// ── Chart geometry / axis ranges (per-stock: depends on price scale) ─────────
const GEOM = {
  priceMin: 70, priceMax: 510,
  fanGrid: [450, 350, 250, 150],
  fanYears: ["2025", "2026", "2027"],
  trackMin: 60, trackMax: 365,
  trackGrid: [300, 250, 200, 150, 100],
  kpiMin: 70, kpiMax: 135,
  visLo: 90, visHi: 480,
  nowZoneLo: 200, nowZoneHi: 305,
};

/* ── TEXT — every company-specific narrative/tooltip the engine renders. ──────
   Values are strings, HTML strings (rendered with dangerouslySetInnerHTML), or
   template functions the engine calls with computed values. If it mentions the
   company, a quarter, a guide number, or an event, it belongs HERE, not in the
   engine — that rule is what makes the engine safely reusable across stocks. */
const TEXT = {
  priceTipLive: (px, at, asOf) => `Live quote: $${px} (fetched ${at}). The price is real-time, but the scenario bands and EPS are still as of ${asOf} — only the price-derived figures (scenario returns, P/E, band position) update live.`,
  priceTipStatic: (px, asOf, liveEnabled) => `$${px} as of ${asOf} — ${liveEnabled ? "live fetch unavailable (offline or blocked), using the saved price" : "static price (live fetch disabled)"}. Next earnings: Q2 FY2027 (~Aug 26, 2026).`,
  footerDisclaimer: (asOf) => `Illustrative scenario framing built on public consensus & estimates as of ${asOf} — not a prediction and not financial advice. Price ranges are scenario mid-bands; KPI markers are positional, not literal. Valuation ruler: NTM forward P/E on non-GAAP EPS. Q1 FY2027 actual: revenue $81.6B (+85% YoY), EPS $1.87, GM 74.9%. FY2026 full year: $215.9B revenue. Consensus FY2027E: $8.47 EPS (61 analysts). NVIDIA fiscal year ends late January. Next earnings: Q2 FY2027 (~Aug 26, 2026).`,

  fanHistory: "The solid white line is NVDA's actual share price over the past several quarters. The dip in mid-2025 was the H20 export ban shock ($4.5B write-off). The big rally from late 2025 onward reflects the Blackwell AI GPU ramp — $81.6B in a single quarter by Q1 FY2027.",
  fanNow: (px) => `NVDA trades around $${px} right now. At roughly a $5T market cap, it's among the world's most valuable companies. Blackwell demand remains fierce and gross margin sits at 74.9% (Q1 FY2027) — the open question is whether custom silicon substitution or a China resolution moves the needle next. Everything left of this dot is history; everything right is forecast.`,
  fanPastDot: (q, p) => `Around the end of ${q}, NVDA traded near $${p}.`,

  segmentedExplain: {
    bear: ["The pessimistic scenario", "Click to see what NVIDIA looks like if things go wrong — custom silicon accelerates, China stays banned, and gross margins compress. EPS disappoints at $6.50–7.00, and the market re-rates to 17–22x. Price falls to $120–185."],
    base: ["The most-likely scenario", "Click for the steady-execution view — Blackwell delivers on the $375B FY2027 revenue consensus, margins hold 73–76%, custom silicon stays supplementary. At 25x FY2027E $8.47, current price ($213) is roughly fair value. Price drifts toward $200–305."],
    bull: ["The optimistic scenario", "Click to see the upside — China restrictions ease, Rubin ships early with a 50%+ ASP premium, NIM software licensing becomes material, and the market re-rates to 35–42x. Price could run to $310–460."],
  },

  kpiBaseline: (val) => `This is the most recent real number: NVIDIA reported $${val}B in total revenue last quarter (Q1 FY2027, +85% YoY). The bars to the right are scenario forecasts for where it goes next.`,
  kpiForecast: (label, val) => `In this scenario, quarterly total revenue reaches ~$${val}B by ${label}. Management's Q2 FY2027 guide is $91B ± 2% — taller bar = faster ramp.`,

  reversion: {
    header: "REVERSION CLOCK · H20 EXPORT BAN DISLOCATION",
    timeTip: "In May 2025, NVIDIA disclosed a $4.5B write-off from the H20 export ban, sending the stock toward the $118 estimated low. It took roughly 9 months to recover to the base zone. This bar shows how far along we are.",
    priceTip: (trough, baseFloor, now) => `Stock bottomed near $${trough} on the H20 shock and needed to reach $${baseFloor} to re-enter the base zone. At $${now}, it's well past the base floor — the Blackwell ramp overpowered the export-ban fear.`,
    footerHtml: (baseFloor, precedentDays, now) => `The H20 export ban dislocation was a policy shock, not a business miss — the Blackwell ramp kept accelerating through it. Price reclaimed the $${baseFloor} base floor well within the ${precedentDays}-day precedent window and pushed on to new highs near $${now}. The next dislocation risk to watch is a new export-control escalation or a competitive-substitution shock — not a repeat of this one, but the same playbook applies: <span style="color:#e0a83b;font-weight:700">has the thesis actually broken, or is this fear?</span>`,
  },

  track: {
    lastDot: (post, nowPx) => `After Q4 FY2026 earnings (Feb 2026), NVDA traded around $${post} — a base-to-bull landing as the Blackwell ramp accelerated. Price sits at $${nowPx} today. Next dot: Q2 FY2027 earnings (~Aug 26, 2026).`,
    pastDot: (q, post) => `After ${q} earnings, NVDA actually traded near $${post}. Compare this dot to the colored bars behind it to see if the predicted range was right.`,
    readoutHtml: (hits, n, nowPx) => `Price has tracked <span style="color:#3fd07a;font-weight:700">base-or-better in ${hits} of ${n} quarters</span> shown. The H20 export-ban dislocation (Q1 FY2026) drove the deepest miss in this window; the Blackwell ramp since has driven a near-2× recovery to $${nowPx}. Next directional catalyst: <span style="color:#e0a83b;font-weight:700">Q2 FY2027 earnings (~Aug 26, 2026)</span> — total revenue vs. the $91B guide and whether gross margin holds above 73%.`,
    footnote: "⚠ Bands are reconstructed now, anchored to each date's forward EPS & multiple regime — not archived in real time. Treat levels as directional, especially \"lower-conf\" quarters. NVIDIA fiscal year ends late January — \"Q2 FY27\" corresponds to the May–Jul 2026 calendar quarter. China export-control risk and custom-silicon substitution are binaries the bands can't fully capture — treat all bands as wider than they appear.",
  },

  current: {
    statusNarrative: {
      broken: "Multiple signals missed. Thesis is under pressure — review the kill-switch criteria.",
      watch:  "Revenue beat but margin or China status disappointed, or a hyperscaler custom-silicon signal ticked up. Core thesis tracking — the Q2 FY2027 print (~Aug 26) is the next test. Not broken, but watch closely.",
      intact: "All key signals tracking as expected. The Blackwell ramp and CUDA-moat thesis remains intact heading into the Q2 FY2027 print.",
    },
    panelTipStory: "Checks whether the original reasons to own NVDA are playing out. Counts signals from the Q1 FY2027 print and Q2 FY2027 guide — data center revenue, total revenue vs. guide, China recovery, gross margin, CUDA competitive position. 0–1 miss = thesis intact. 2 misses = watch. 3+ = exit. Click to see KPI bars and kill-switch.",
    watchChipHtml: `🔑 WATCH: Q2 FY2027 rev vs <span style="color:#e0a83b;font-weight:700">$91B ± 2%</span> guide · Aug 26, 2026`,
    exitChipHtml: `⚠ EXIT IF: rev/GM miss guide, or hyperscaler substitution accelerates`,
    verdictBody: {
      broken:     (px) => `NVDA at $${px}: kill-switch criteria met. Price position is irrelevant — signals say the Blackwell/CUDA-moat thesis is no longer playing out. The question is not whether to add; it is how much to reduce.`,
      watchBelow: (px) => `NVDA at $${px} sits below the base floor but signals are mixed. Price is attractive, but adding into a weakening thesis is the wrong sequence. Wait for the Q2 FY2027 print (~Aug 26) to confirm or deny the pattern before deploying capital.`,
      below:      (px) => `NVDA at $${px} sits below the base floor with the thesis intact — data center revenue, guide execution, and gross margin are all tracking. The gap likely reflects export-policy or competitive-substitution fear, not demand destruction — but confirm the Q2 print before assuming it's pure sentiment.`,
      inBase:     (px, statusWord) => `NVDA at $${px} is inside the base range. Thesis ${statusWord} and price is roughly fair value at ~25x FY2027E EPS. Watch Q2 FY2027 revenue and gross margin vs. the $91B guide around Aug 26 — a beat with margin holding opens the bull case; a miss or margin slide reopens the bear.`,
      above:      (px) => `NVDA at $${px} is above the base ceiling. The bull case — China H200 recovery, Rubin ahead of schedule, margins above 78% — needs to play out to justify entry. If already in, hold. If adding, wait for a pullback toward the base floor.`,
    },
    kpiTitle: "Total Revenue",
    kpiSub: "$B quarterly · HIGHER BETTER",
    kpiMeasures: "Total quarterly revenue, driven overwhelmingly (92% last quarter) by the data-center AI GPU/networking business. Guided $91B ± 2% for Q2 FY2027 — a step-up from Q1's $81.6B.",
    kpiRequires: {
      bull: "Revenue beats guide every quarter and accelerates past $130B by Q1 FY2028 as Rubin ships ahead of schedule and China demand partially returns.",
      base: "Revenue lands inside guide each quarter and scales toward $108B by Q1 FY2028, in line with the FY2027 $370-390B roadmap.",
      bear: "Revenue misses the $91B guide and stalls in the mid-$80Bs, signaling custom-silicon substitution or a China ceiling is biting harder than modeled.",
    },
    group1Title: "Data Center Demand &amp; Guide Quality",
    group2Title: "Margin &amp; Competitive Position",
    killSwitch: "Two straight quarters of revenue or gross margin missing guide, or hyperscaler earnings confirming a real (non-pilot) shift of training/inference workloads to in-house silicon — exit / reduce. That is demand destruction or moat erosion, not noise.",
    priceBanner: {
      below:  (px, baseLo) => `At $${px}, price is $${baseLo - px} below the base floor. Market may be pricing in export-policy or competitive fear ahead of confirmation — not necessarily a fundamentals problem. Historically the window patient buyers use, if the thesis stays intact.`,
      inBase: (px) => `At $${px}, price is inside the base range. Fair value — not a discount, not expensive.`,
      above:  (px, baseHi) => `At $${px}, price is $${px - baseHi} above the base ceiling. The bull thesis needs to play out in full.`,
    },
    moodBanner: (currentPE, loPE, hiPE) => `At ${currentPE}× forward P/E, the market is pricing in continued Blackwell execution and the Q2 FY2027 guide ($91B ± 2%) landing roughly as promised — the multiple sits mid-band (${loPE}–${hiPE}×), well off both the ~17x H20-panic trough and the ~55x 2024 AI-euphoria peak.`,
    cagrNotes: {
      low:  "Low bar — not priced for perfection. Even moderate execution justifies the price.",
      mid:  "Moderate bar — requires the Blackwell ramp and CoWoS/HBM supply chain to stay on schedule.",
      high: "High bar — requires near-perfect execution with China restrictions easing and no competitive substitution.",
    },
    fy26CardTip: (fy26) => `Adding Q1 FY2027's actual $81.6B to base-case Q2–Q4 FY2027 projections gives a full-year run rate of roughly $${fy26}B — comfortably inside the $370–390B FY2027 revenue framing management's own roadmap implies. That's what the base case — and roughly today's price — already assumes. The bull case requires China recovery and Rubin's early ramp to push meaningfully above this.`,
    fy26CardHtml: (fy26, growthPct) => `Q1 FY2027's actual plus base-case Q2–Q4 projections sum to roughly <span style="color:var(--blue-soft);font-weight:700">$${fy26}B</span> for full-year FY2027 — the growth path today's price already assumes. FY2026 actual revenue was <span style="color:#3fd07a">$215.9B</span>, so this implies <em>~${growthPct}%</em> YoY growth.`,
    peerCommentary: (currentPE) => `At ${currentPE}× NTM P/E, NVDA trades at a premium to AVGO (~19.4×) and a discount to TSM (~26.6×) and AMD (~68.8×, though AMD's multiple is inflated by a much smaller absolute profit pool). TSM — the foundry that actually manufactures NVIDIA's chips — is the other irreplaceable chokepoint in this chain; AVGO is the clearest hyperscaler-custom-silicon exposure among these peers. NVDA's own multiple sitting mid-band, not at either historical extreme, is the market pricing continued-but-not-flawless execution.`,
  },

  future: {
    scenarioTips: {
      bear: "Triggered by: revenue/margin guide misses or accelerating hyperscaler custom-silicon substitution. Multiple compresses toward the 15–19× trough zone. Note: at current price, bear downside is larger than bull upside.",
      base: (loPE, hiPE) => `Revenue and gross margin land within guide each quarter; Blackwell Ultra/Rubin supply chain milestones stay on schedule. P/E holds in the normal ${loPE}–${hiPE}× band. Modestly positive return from here as EPS growth does the work.`,
      bull: (currentPE) => `Revenue and margin beat guide again; China H200 deliveries begin at scale and Rubin ships ahead of schedule. Multiple re-rates from ~${currentPE}× toward the bull zone, closing the gap to the bull target.`,
    },
    downsideChevronTip: "Kill-switch: two straight quarters missing guide, or hyperscaler earnings confirming real workload substitution = exit / reduce.",
    dislocEventName: "the May 2025 H20 export-ban low",
    dislocLabel: "SINCE MAY 2025 H20 SHOCK",
    bearPriceTip: (bearMid, bearLo, bearHi, peTrough, peBearHi) => `$${bearMid} is the midpoint of the bear case range ($${bearLo}–$${bearHi}). This assumes custom-silicon substitution accelerates or a new export-control action hits, and the multiple compresses toward the ${peTrough}–${peBearHi}× trough zone. The kill-switch is two straight quarters missing guide — if it triggers, do not average down.`,
    killSwitchTip: "A kill-switch is a pre-committed exit rule you set BEFORE you own the position — when you are thinking clearly. If revenue or gross margin misses guide for two straight quarters, or hyperscaler earnings confirm a real shift of training/inference workloads to in-house silicon, the thesis is broken: that's demand weakness or moat erosion, not timing. Do not average down into a broken thesis — the market is telling you something. No debate, no rationalisation. Exit.",
    killSwitchTipNote: "Two straight misses, or confirmed hyperscaler substitution. Either one. No debate.",
    killSwitchHtml: `<strong style="color:var(--title)">Two consecutive quarters missing the revenue or gross margin guide, or hyperscaler earnings confirming real (non-pilot) workload substitution</strong> → exit or reduce. No debate. Do not average down into a broken thesis.`,
    nextCheck: "Next check: Q2 FY2027 earnings (~Aug 26, 2026)",
    downsideFootnote: (px, peTrough, peBearHi) => `Bear case scenario: guide misses or accelerating custom-silicon substitution. Assumes a multiple compression toward ${peTrough}–${peBearHi}× on disappointing EPS. Position loss is illustrative at $${px} entry.`,
    multipleSummary: (peNow, loPE, hiPE) => `At ~${peNow}× NTM P/E, NVDA sits mid-way inside its historical normal range (${loPE}–${hiPE}×) — well off both the ~17x H20-panic trough and the ~55x 2024 AI-euphoria peak.`,
    peBarTipSuffix: "NVDA has clean GAAP earnings and modest debt, so unlike some AI-semi peers there's little amortization distortion to strip out — this P/E is close to the real number.",
    deepValueZoneNote: "Historically cheap. Rare — last seen at the May 2025 H20-shock low. Exceptional entry if thesis is intact.",
    dislocPrecedent: (baseFloor) => `Historical precedent: the May 2025 H20 export-ban dislocation resolved within the 270-day base-reversion window when fundamentals stayed intact. Base floor: $${baseFloor}.`,
    regretHtml: (currentPE) => `Q2 FY2027 revenue and margin <strong style="color:#3fd07a">materially beat the $91B ± 2% guide</strong> AND China H200 deliveries or a Rubin-ahead-of-schedule signal emerge. That would confirm the Blackwell ramp still has room to accelerate, re-rate the stock from ~${currentPE}× toward the bull zone, and close today's entry window.`,
    regretTip: "Charlie Munger's inversion: instead of asking 'why should I buy?', ask 'what would I have to believe happened, in hindsight, to wish I had bought more?' If Q2 FY2027 beats guide and China or Rubin news breaks favorably, today's entry window will close fast. This question is not about FOMO — it is about sizing correctly for your conviction.",
    chips: [
      { label: "KILL-SWITCH: 2 STRAIGHT GUIDE MISSES → EXIT", col: "#f1564b" },
      { label: "REGRET IF: GUIDE BEAT + CHINA/RUBIN NEWS",     col: "#3fd07a" },
      { label: "NEXT CHECK: AUG 26, 2026 EARNINGS",            col: "#2f6dff" },
    ],
    signalFootnote: (ntmEps) => `P/E uses non-GAAP NTM EPS $${ntmEps} — NVIDIA has minimal intangible amortization to strip out, unlike fabless peers carrying large acquisition goodwill.`,
  },

  past: {
    cardTips: {
      durability: (revCagrPct) => `Looks at 5 fiscal years of Revenue, Gross Margin, and Free Cash Flow. We want upward trends that hold through cycles — not just a straight line up. NVDA compounded revenue at ~${revCagrPct}% CAGR, but the path wasn't smooth: FY2023 (the 2022 crypto/gaming-crash trough) saw gross margin fall to 56.9% before the AI-driven recovery from FY2024 on.`,
      value: (latestROIC) => `ROIC (Return on Invested Capital) measures how efficiently management deploys capital. Above WACC (~10-12% for a capital-light semiconductor design house) = value creation. Below = value destruction. NVDA's ROIC ranged from ~14% at the FY2023 trough to ${latestROIC}% today — extraordinary for a business of this size, reflecting the CUDA software moat's pricing power.`,
      capex: (peakCapex, latestCapex, latestFCF) => `Capex as a % of revenue shows how much of every dollar gets reinvested before cash reaches shareholders. NVIDIA is fabless — it doesn't build its own fabs — so capex intensity is naturally low and volatile: it peaked at ${peakCapex}% in the FY2023 downturn (revenue fell while capex held steady) and has eased to ${latestCapex}% even as FCF hit a record $${latestFCF}B — the AI buildout is being monetized by NVIDIA's own business, not just funded by it.`,
      mood: (evNow, evAvg) => `EV/EBITDA vs its own 5-year average tells you whether the market is paying a premium or discount for this business. Not a buy/sell signal on its own — context matters (growth rate, interest rates, sector rotation). Current EV/EBITDA of ${evNow}× actually sits BELOW the 5-year average of ~${evAvg}× — despite trading near its all-time high, NVDA's earnings have grown faster than its price this cycle.`,
    },
    stats: [
      { html: `Revenue <span style="color:#3fd07a;font-weight:700">$26.9B → $215.9B</span> (5Y)`, tipTitle: "Revenue (5-year)", tipBody: "NVDA grew annual revenue from $26.9B (FY2022) to $215.9B (FY2026) — a ~68% CAGR, though the path wasn't smooth: FY2023 was essentially flat ($27.0B) during the crypto/gaming-crash trough before the AI-driven acceleration took over from FY2024 on." },
      { html: `FCF <span style="color:#3fd07a;font-weight:700">$8.1B → $96.7B</span> (5Y)`, tipTitle: "Free Cash Flow (5-year)", tipBody: "FCF grew from $8.1B (FY2022) to a record $96.7B (FY2026) — nearly 12× over the window, even after a real dip to $3.8B in the FY2023 trough. This is the clearest evidence the AI accelerator cycle is being monetized, not just spent on." },
      { html: `Price <span style="color:#3fd07a;font-weight:700">+719.6%</span> (Jan 2022 → now)`, tipTitle: "Total price return (since Jan 2022)", tipBody: "From $24.49 (Jan 2022) to $200.75 today = +719.6%. This compounding came almost entirely from organic earnings growth and multiple re-rating on the AI buildout — not acquisitions. Past returns are anchored to a demand cycle (Blackwell/Rubin) that may not repeat at the same pace." },
    ],
    verdictBody: "NVDA has compounded revenue at ~68% annually over 5 fiscal years — an extraordinary pace, but not a smooth one: FY2023 (the crypto/gaming-crash trough) saw revenue stall and gross margin fall to 56.9% before the AI-driven recovery took hold. ROIC has ranged from ~14% at that trough to over 70% today, and FCF grew nearly 12× to a record $96.7B. The business has earned its premium multiple through real cash generation, not just narrative — the open question is how much of today's price already assumes the current growth rate continues, and whether custom silicon or a China resolution moves that math before FY2028.",
    banners: {
      durability: (revCagrPct, rev0, rev9, gmDelta, latestGM, fcf0, latestFCF) => `Revenue compounded at ~${revCagrPct}% annually from $${rev0}B (FY2022) to $${rev9}B (FY2026) — but not smoothly: FY2023 was roughly flat as the crypto/gaming-crash trough hit, with gross margin dipping before recovering ${gmDelta} points net to ${latestGM}% by FY2026. FCF grew from $${fcf0}B to $${latestFCF}B over the same window.`,
      value: (latestROIC) => `ROIC of ${latestROIC}% (FY2026) is extraordinary for a business at this scale, well above a typical 10-12% WACC for a capital-light chip designer. Unlike acquisition-driven peers, this reflects organic reinvestment into the same CUDA/GPU franchise — though ROIC dipped to ~14% at the FY2023 trough, a reminder the moat isn't immune to a demand air-pocket.`,
      capex: (latestCapex, peakCapex, latestFCF, fy26Guide) => `Capex/revenue of ${latestCapex}% (FY2026) is well below the ${peakCapex}% seen during the FY2023 downturn (when capex held steady while revenue stalled) even as FCF hit a record $${latestFCF}B. NVIDIA is fabless, so this ratio is naturally lower and more volatile than a foundry's — the real test is whether Blackwell/Rubin-era spend (NVIDIA's own, plus its customers') keeps converting into revenue at this pace.`,
      mood: (evNow, evAvg) => `EV/EBITDA of ${evNow}× actually sits BELOW the 5-year average of ${evAvg}× — despite trading near an all-time high, NVDA's earnings (EBITDA nearly 12× over the window) have outrun its price. The FY2023 trough saw the multiple spike above 85× on depressed earnings, not exuberant pricing — a reminder that a high multiple isn't always a euphoria signal.`,
    },
    revAnnotationsHtml: `<span>FY2023: <span style="color:var(--tx3)">$27.0B</span> (crypto/gaming-crash trough)</span><span>FY2026: <span style="color:var(--tx3)">$215.9B</span> (Blackwell ramp)</span>`,
    roicNote: "Green >15% · Amber 5–15% · Red <5% — NVDA dipped to amber (14.4%) only at the FY2023 trough",
    fcfYieldNote: "Low yield reflects the stock's premium multiple, not weak cash generation — FCF itself grew ~12× over the window.",
    capexAnnotationsHtml: `<span>FY2023: <span style="color:#f1564b">6.8%</span> (crash trough, capex held steady on falling revenue)</span><span>FY2026: <span style="color:#3fd07a">2.8%</span> (fabless model, AI revenue far outpacing capex)</span>`,
    footnotes: {
      durability: "NVDA's growth is organic — no acquisition playbook to adjust for. FY2023's near-flat revenue and gross-margin dip to 56.9% is the closest thing to a bear case realized in this window (crypto-mining demand collapse plus a gaming-GPU inventory glut). FY2024 onward marks the AI/data-center re-acceleration: revenue +115% in FY2025 alone, then +65% again in FY2026, with gross margin recovering to a window-high 75.0% in FY2025 before easing slightly to 71.1% in FY2026 as Blackwell ramped at a lower initial margin than mature Hopper.",
      value: "ROIC ranged from ~14% (FY2023 trough) to 87.5% (FY2025) before easing to 70.2% (FY2026) as invested capital grew alongside the balance sheet. FCF yield staying low (0.8%-2.1%) throughout reflects the stock's premium multiple, not weak cash generation — FCF itself grew from $8.1B to a record $96.7B. The open question for THE FUTURE tab is whether today's multiple is paying for AI demand that's already arrived, or demand still to come.",
      capex: "Capex/revenue peaked at 6.8% during the FY2023 downturn — when capex held roughly steady while revenue stalled, mechanically inflating the ratio — then fell to 1.8% (FY2024) before drifting back up to 2.8% (FY2026) as NVIDIA's own AI-infrastructure investment grew alongside revenue. Because NVDA is fabless, this ratio is structurally lower and more volatile than a foundry's (TSM/GOOGL's own capex-to-revenue tables run far higher) — the more relevant test for NVDA is customer capex (hyperscaler AI spend), which sits outside this company's own financials.",
      mood: "The scenario bands on the other tabs use forward P/E, not EV/EBITDA — NVDA carries clean GAAP earnings and modest debt, so P/E is a fair ruler here. EV/EBITDA is shown here purely to track cross-cycle mood, since it's capital-structure-neutral. The multiple spiked above 85× at the FY2023 trough on depressed earnings (not exuberant pricing), then compressed to the mid-30s-to-40s as earnings caught up — currently below its own 5-year average despite the stock trading near an all-time high.",
    },
    priceChartTitle: "NVDA PRICE · MONTHLY · 2022–2026",
    priceChartSub: "$ per share (split-adjusted) · dashed lines = key events · window limited to available Wisesheets history",
    priceNowTip: (px, isATH) => `$${px} — where NVDA trades today, ${isATH ? "also the highest monthly close in this window" : "off the May 2026 high of $211.14"}. The chart shows a severe 2022 drawdown (crypto/gaming-crash trough, -55.5%), a 2023 AI-driven re-rating, a 2025 H20-shock dip, and a sustained Blackwell-driven climb into 2026.`,
    ddTip: (minDD) => `${minDD}% — the deepest drop from a prior all-time high in this window. This occurred during the Sep 2022 crypto/gaming-crash trough, well before the AI cycle began. NVDA recovered and went on to make repeated new highs as the AI/data-center cycle took over. Drawdown charts help you visualize what holding through a bad period actually felt like.`,
    ddAnnotationsHtml: `<span>Max drawdown: <span style="color:#f1564b">−55.5%</span> (Sep 2022, crypto/gaming-crash trough)</span><span>Current: <span style="color:#e0a83b">−4.9%</span> from the May 2026 high</span>`,
  },
};
