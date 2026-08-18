/* ╔══════════════════════════════════════════════════════════════════════════╗
   ║   MSFT · thesis-data.js — ALL per-stock content lives here.              ║
   ║   ███  EDIT EVERYTHING IN THIS FILE EACH QUARTER  ███                    ║
   ║                                                                          ║
   ║   The rendering engine (../engine/thesis-engine.js) contains ZERO        ║
   ║   company-specific strings — every number, narrative, and tooltip        ║
   ║   that mentions MSFT is in this file. Quarterly touch = edit this        ║
   ║   file only, then run: node tools/lint-thesis-data.js MSFT               ║
   ║                                                                          ║
   ║   Microsoft fiscal year ends June 30 (Q1=Jul–Sep, Q2=Oct–Dec, etc).      ║
   ║                                                                          ║
   ║   Quick map — after each earnings report:                                ║
   ║     1. AS_OF_DATE / FALLBACK_PRICE                                       ║
   ║     2. HISTORY (add quarter) / FUTURE_Q (roll labels) / PROJ_END         ║
   ║     3. CASES — re-read each narrative, still true?                       ║
   ║     4. SIGNALS / MARGIN — update BEAT/MATCH/MISS + positions             ║
   ║     5. KPI_HIST / KPI_PROJ (total quarterly revenue, $B — NOT Azure %)   ║
   ║     6. TRACK_ALL — append new quarter (oldest auto-drops)                ║
   ║     7. TEXT.* — re-read every narrative template, refresh stale facts    ║
   ║     8. ALERT — keep in sync with PF_ALERTS (canonical)                   ║
   ╚══════════════════════════════════════════════════════════════════════════╝ */

const TICKER_META = { ticker: "MSFT", exchange: "NASDAQ", company: "Microsoft Corporation" };
const AS_OF_DATE = "2026-08-04";

// Most recent material dislocation — the Apr 29, 2026 FY2027 capex-guide reveal ($190B
// baseline moving to $255-260B territory later confirmed on the Q4 call). Close on
// 2026-04-29 itself was $424.46 (verified via Wisesheets EOD), confirming the ported
// pre-migration figures below. NOTE: the stock actually fell further after this specific
// reaction low, to a deeper $352.83 close on 2026-06-25, before the Jul 29 Q4 FY2026 beat
// (+15.5% single-day pop, $390.54 -> $451.10, also verified) reversed it — this clock
// tracks the immediate post-announcement reaction, not that later, deeper trough.
const DISLOCATION_DATE = "2026-04-29";
const REVERSION_TROUGH = 424;
const REVERSION_BASEFLOOR = 480;
const REVERSION_PRECEDENT_DAYS = 90;

// CASES ported losslessly from the 2026-07-31 /update-thesis touch (pre-migration
// MSFT-thesis.html) — this migration is structural only, not a numbers refresh, per the
// same discipline as AMZN's and NVDA's migrations. Narratives, price bands, kill-switches,
// and KPI triggers are unchanged from that quarterly touch.
const CASES = {
  bear: {
    key: "bear", label: "BEAR", accent: "#f1564b", glow: "rgba(241,86,75,0.45)",
    target12: "$325 — $400",
    op: "The 'Azure decelerates' bear case broke this quarter — growth accelerated to 43% and guided to ~45%. The bear case that survives is different: FY2027 capex more than doubles down at $255–260B (up from $190B), pushing the capex/revenue ratio from ~56% toward ~65%, and free cash flow already fell to $19.6B in Q4 on the ramp. The risk is no longer 'does the growth show up' — it's that growth keeps showing up on paper while cash conversion keeps compressing, and the market eventually re-prices MSFT on FCF rather than headline growth. A slowdown from today's 43–45% Azure growth to the low-30s by mid-FY2027, paired with margin compression beyond the guided 'less than one point,' would validate this case.",
    breaks: "Azure sustains ≥42% AND free cash flow re-accelerates (FCF holding near ~30%+ of revenue) for two consecutive quarters — proof the $255–260B capex is converting to cash, not just to growth optics.",
    requires01: "Azure decelerates below 36% in Q1 FY27; Copilot seat growth stalls below 32M",
    requires02: "FCF/revenue keeps falling; capex/revenue ratio exceeds 65% with no plateau in sight",
  },
  base: {
    key: "base", label: "BASE", accent: "#e0a83b", glow: "rgba(224,168,59,0.40)",
    target12: "$475 — $565",
    op: "Q4 FY2026 validated the base case's central bet: Azure accelerated to 43% (not decelerated), Copilot paid seats more than doubled sequentially to 30M+, and revenue beat consensus by ~$2.4B. Management guided Q1 FY2027 Azure to ~45% and total revenue to $89.85–90.95B (+16–17%). The new central risk is the FY2027 capex step-up to $255–260B — it doesn't disprove the monetization story, but it resets how much revenue growth is needed to keep the capex/revenue ratio from ballooning further. A useful-life accounting change (depreciable life 15→25 years) softens the near-term margin hit. The stock's +15.5% single-day reaction shows the market is willing to fund this for now, but the base case requires Azure and Copilot to keep confirming every quarter, not just this one.",
    breaks: "Azure decelerates below 36% in any of the next two quarters, OR the capex/revenue ratio keeps rising with no FCF stabilization by Q2 FY2027 — either signals the spend is outrunning the payoff again.",
    requires01: "Azure holds 41–46% through Q1–Q2 FY27; Copilot seats reach 34–40M",
    requires02: "Operating margin holds within the guided 'less than one point' decline; FCF stabilizes as a share of revenue",
  },
  bull: {
    key: "bull", label: "BULL", accent: "#3fd07a", glow: "rgba(63,208,122,0.45)",
    target12: "$650 — $760",
    op: "Azure crossed $100B in annualized revenue for the first time and guided to ~45% growth next quarter — already at or above what the prior bull case required (≥42%). Copilot's seat net-adds more than doubled sequentially, the clearest signal yet that AI productivity tools are moving from pilot to default deployment. In this scenario, Copilot agent-workflow monetization becomes visible as a distinct revenue line beyond per-seat pricing, AI ARR reaccelerates well past the last-disclosed $37B, and the market decides the $255–260B FY2027 capex is being deployed into genuine capacity-constrained demand rather than speculative build-out — re-rating MSFT toward 28–30× FY2027 EPS the way AVGO re-rated on its own platform story.",
    breaks: "Enterprise Copilot renewal data shows downgrades or usage plateaus even as headline seat counts grow — proof the seat number is outrunning actual utilization.",
    requires01: "Azure beats 48%+ with capacity-constraint commentary (demand > supply); Copilot seats accelerate past 42M",
    requires02: "AI ARR re-disclosed and tracking toward $55B+; margin expansion despite the capex ramp",
  },
};

// THESIS_HISTORY intentionally omitted on this first migration touch — same discipline as
// AMZN's and NVDA's migrations. This rebuild is a lossless PORT of the 2026-07-31
// /update-thesis CASES into the engine-split shape, not a Layer-2 audit that rewrote them.
// There is no distinct "outgoing" vintage to archive yet (incoming === outgoing). The
// archive starts at MSFT's NEXT /update-thesis touch, right before that session's audit
// overwrites CASES — per lint-thesis-data.js's actual behavior (an empty array fails the
// lint; leave this undefined/commented until there's a real first entry).

const FALLBACK_PRICE = 483.47;

const LIVE_PRICE = {
  enabled: true,
  symbol: "MSFT",
  provider: "yahoo",
  corsProxy: "https://api.allorigins.win/get?url=",
  finnhubToken: "",
};

// ALERT — buy-trigger pre-commitment. Canonical source is PF_ALERTS.MSFT in
// stocks/portfolio/portfolio-data.js (buyFloor 475, thesisIntact true,
// nextEarnings ~2026-10-28); this copy is a FALLBACK for offline opens.
const ALERT = {
  symbol: "MSFT",
  buyFloor: 475,
  thesisIntact: true,
  asOf: AS_OF_DATE,
  nextEarnings: "~2026-10-28",
};

// Historical price line — Q4 FY26 added as its own real data point (post-earnings landing,
// $451.10 close Jul 30) now that AS_OF has moved forward to Aug 4 with price at $483.47;
// NOW points at FALLBACK_PRICE, never a separately-declared price constant (see the engine
// split's NOW_PRICE-collision pitfall — this file must never declare NOW_PRICE itself).
const HISTORY = [
  { q: "Q4 FY25", p: 452 },
  { q: "Q1 FY26", p: 478 },
  { q: "Q2 FY26", p: 513 },
  { q: "Q3 FY26", p: 441 },
  { q: "Q4 FY26", p: 451 },
  { q: "NOW",     p: FALLBACK_PRICE },
];

const PROJ_END = { bear: 362, base: 520, bull: 705 };
const FUTURE_Q = ["Q1 FY27", "Q2 FY27", "Q3 FY27", "Q4 FY27"];

const SIGNALS = {
  bear: [
    { name: "Azure Growth vs 45% Guide", unit: "% YoY", tag: "MISS",  next: "~late Oct 2026 (Q1 FY27)", val: "BEAR ≤34%",      guide: "Q4 43% (accel, guides ~45%)", pos: 0.18 },
    { name: "Copilot Paid Seat Growth",      unit: "M seats", tag: "MISS",  next: "~late Oct 2026 (Q1 FY27)", val: "BEAR <32M",       guide: "Q4 30M+ (2× seq)",  pos: 0.20 },
    { name: "AI Business ARR",               unit: "$B ARR",  tag: "MISS",  next: "~late Oct 2026 (Q1 FY27)", val: "BEAR <$40B ARR", guide: "Q3 $37B (+123%, not updated Q4)", pos: 0.20 },
  ],
  base: [
    { name: "Azure Growth vs 45% Guide", unit: "% YoY", tag: "MATCH", next: "~late Oct 2026 (Q1 FY27)", val: "BASE 41–46%",     guide: "Q4 43% (accel, guides ~45%)", pos: 0.58 },
    { name: "Copilot Paid Seat Growth",      unit: "M seats", tag: "BEAT",  next: "~late Oct 2026 (Q1 FY27)", val: "BASE 34–40M",     guide: "Q4 30M+ (2× seq)",  pos: 0.58 },
    { name: "AI Business ARR",               unit: "$B ARR",  tag: "MATCH", next: "~late Oct 2026 (Q1 FY27)", val: "BASE ~$45B ARR", guide: "Q3 $37B (+123%, not updated Q4)", pos: 0.56 },
  ],
  bull: [
    { name: "Azure Growth vs 45% Guide", unit: "% YoY", tag: "BEAT",  next: "~late Oct 2026 (Q1 FY27)", val: "BULL ≥48%",       guide: "Q4 43% (accel, guides ~45%)", pos: 0.88 },
    { name: "Copilot Paid Seat Growth",      unit: "M seats", tag: "BEAT",  next: "~late Oct 2026 (Q1 FY27)", val: "BULL ≥42M",       guide: "Q4 30M+ (2× seq)",  pos: 0.88 },
    { name: "AI Business ARR",               unit: "$B ARR",  tag: "BEAT",  next: "~late Oct 2026 (Q1 FY27)", val: "BULL >$52B ARR", guide: "Q3 $37B (+123%, not updated Q4)", pos: 0.86 },
  ],
};
const MARGIN = {
  bear: [
    { name: "Operating Margin",      tag: "MISS",  next: "~late Oct 2026 (Q1 FY27)", pos: 0.20 },
    { name: "CapEx / Revenue Ratio", tag: "MISS",  next: "~late Oct 2026 (Q1 FY27)", pos: 0.14 },
  ],
  base: [
    { name: "Operating Margin",      tag: "MATCH", next: "~late Oct 2026 (Q1 FY27)", pos: 0.55 },
    { name: "CapEx / Revenue Ratio", tag: "MATCH", next: "~late Oct 2026 (Q1 FY27)", pos: 0.48 },
  ],
  bull: [
    { name: "Operating Margin",      tag: "BEAT",  next: "~late Oct 2026 (Q1 FY27)", pos: 0.82 },
    { name: "CapEx / Revenue Ratio", tag: "BEAT",  next: "~late Oct 2026 (Q1 FY27)", pos: 0.78 },
  ],
};

// HEADLINE GAUGE: total quarterly revenue, $B — NOT Azure growth %. The shared engine's
// price-implied full-year revenue card (THE CURRENT tab) computes
// fyRevBase = KPI_HIST + KPI_PROJ.base[0..2], which is only meaningful if these are
// dollar revenue figures — the same convention TSM/ASML/MU/MRVL/NVDA use (see CLAUDE.md's
// NVDA migration note: it swapped from non-GAAP gross margin % to Total Revenue $B for the
// identical reason). Azure growth itself is NOT dropped — it's still tracked in full via
// the SIGNALS panel above, exactly as before.
// KPI_HIST = Q4 FY2026 actual total revenue ($90.007B, Wisesheets 10-K/10-Q, SEC-filed).
const KPI_HIST = 90.0;
// KPI_PROJ = quarterly total revenue ($B) forecast for Q1-Q4 FY2027 under each scenario.
// Base case anchors Q1 FY27 to management's own $89.85-90.95B guide (midpoint 90.4),
// then continues at a similar ~16% YoY pace off FY2026's actual quarterly base
// ($77.673B / $81.273B / $82.886B / $90.007B for Q1-Q4 FY26). Bear assumes deceleration
// toward ~10% YoY (consistent with Azure decelerating below 36%); bull assumes
// re-acceleration toward ~20-23% YoY (consistent with Azure beating 48%+).
const KPI_PROJ = {
  bear: [85.4, 89.4, 90.3, 97.2],
  base: [90.4, 94.3, 96.1, 104.4],
  bull: [93.2, 98.3, 101.1, 110.7],
};

// TRACK RECORD — append newest to end; dashboard keeps last 6. Unchanged from the
// pre-migration build — no new earnings print since the 2026-07-31 touch that produced it.
const TRACK_ALL = [
  { q: "Q3 FY25", date: "2025-04", post: 388, reaction: "-",  bear: [295,355], base: [372,452], bull: [472,562], landed: "bear→base", conf: "med"  },
  { q: "Q4 FY25", date: "2025-07", post: 455, reaction: "++", bear: [322,382], base: [412,492], bull: [512,602], landed: "base→bull", conf: "high" },
  { q: "Q1 FY26", date: "2025-10", post: 535, reaction: "++", bear: [348,415], base: [445,525], bull: [548,640], landed: "bull",      conf: "high" },
  { q: "Q2 FY26", date: "2026-01", post: 510, reaction: "+",  bear: [358,428], base: [458,540], bull: [565,660], landed: "base→bull", conf: "high" },
  { q: "Q3 FY26", date: "2026-04", post: 441, reaction: "-",  bear: [342,410], base: [452,532], bull: [558,652], landed: "bear→base", conf: "high" },
  { q: "Q4 FY26", date: "2026-07", post: 451, reaction: "++", bear: [310,395], base: [460,560], bull: [620,720], landed: "bear→base", conf: "high" },
];
const TRACK_WINDOW = 6;

// THE PAST — annual history, Wisesheets 10-Q/10-K facts (SEC-cited). MSFT's fiscal year
// closed 2026-06-30 just days before this migration, so Wisesheets' 5-year free-tier window
// lands cleanly on 5 full fiscal years (FY2022-FY2026) with an aligned year-end price point
// for every one — no 4-year cap needed here, unlike GOOGL/AMZN's migrations. ROIC computed
// as NOPAT (21% flat tax rate, matching the peer-comp convention) / (total debt + equity -
// cash); EV/EBITDA off fiscal year-end close x diluted-ish shares outstanding, net of
// cash + short-term investments.
const PAST_YEARS       = ["2022","2023","2024","2025","2026"];
const PAST_REV         = [198.3, 211.9, 245.1, 281.7, 331.8];
const PAST_GM          = [68.4,  68.9,  69.8,  68.8,  67.9];
const PAST_FCF         = [65.1,  59.5,  74.1,  71.6,  67.0];
const PAST_ROIC        = [30.8,  30.2,  27.8,  27.2,  25.6];
const PAST_EVEBITDA    = [19.5,  24.3,  25.6,  23.4,  14.2];
const PAST_FCF_YIELD   = [3.3,   2.3,   2.2,   1.9,   2.4];
const PAST_CAPEX_REV   = [12.1,  13.3,  18.1,  22.9,  34.9];
const PRICE_M_LABELS = ["2022-07","2022-08","2022-09","2022-10","2022-11","2022-12","2023-01","2023-02","2023-03","2023-04","2023-05","2023-06","2023-07","2023-08","2023-09","2023-10","2023-11","2023-12","2024-01","2024-02","2024-03","2024-04","2024-05","2024-06","2024-07","2024-08","2024-09","2024-10","2024-11","2024-12","2025-01","2025-02","2025-03","2025-04","2025-05","2025-06","2025-07","2025-08","2025-09","2025-10","2025-11","2025-12","2026-01","2026-02","2026-03","2026-04","2026-05","2026-06","2026-07"];
const PRICE_M = [280.74,261.47,232.9,232.13,255.14,239.82,247.81,249.42,288.3,307.26,328.39,340.54,335.92,327.76,315.75,338.11,378.91,376.04,397.58,413.64,420.72,389.33,415.13,446.95,418.35,417.14,430.3,406.35,423.46,421.5,415.06,396.99,375.39,395.26,460.36,497.41,533.5,506.69,517.95,517.81,492.01,483.62,430.29,392.74,370.17,407.78,450.24,373.02,464.72];
const PRICE_M_DD = [0.0,-6.9,-17.0,-17.3,-9.1,-14.6,-11.7,-11.2,0.0,0.0,0.0,0.0,-1.4,-3.8,-7.3,-0.7,0.0,-0.8,0.0,0.0,0.0,-7.5,-1.3,0.0,-6.4,-6.7,-3.7,-9.1,-5.3,-5.7,-7.1,-11.2,-16.0,-11.6,0.0,0.0,0.0,-5.0,-2.9,-2.9,-7.8,-9.3,-19.3,-26.4,-30.6,-23.6,-15.6,-30.1,-12.9];
const PAST_EVENTS = [
  { idx: 3,  label: "Rate-Hike Growth Scare", note: "Oct 2022 — the broad 2022 tech/rate-hike de-rating trough. No Microsoft-specific miss; the whole megacap complex compressed on rising rates and a slowing PC market. Deepest 2022 drawdown in this window (-17.3% from the Jul 2022 starting level)." },
  { idx: 23, label: "Copilot/Azure Momentum High", note: "Jun 2024 — a fresh cycle high as early Copilot adoption data and Azure AI-services growth built momentum, before a mid-2024 AI-capex-digestion pause (not shown as a distinct trough in this monthly window, but visible as the flattening through late 2024)." },
  { idx: 36, label: "Cycle High (window)", note: "Jul 2025 — the highest monthly close in this window ($533.50). The stock's actual intraday/daily-close all-time high was slightly higher still — $542.07 on Oct 28, 2025 (Wisesheets EOD) — which this monthly-sampling chart doesn't capture directly since it only plots month-end values." },
  { idx: 44, label: "AI-Capex-Fear Trough", note: "Mar 2026 — deepest monthly drawdown in this window (-30.6% from the Jul 2025 high) as markets priced in fear that the AI infrastructure buildout was outrunning near-term monetization, ahead of the Apr 29, 2026 FY2027 capex-guide reveal that followed. (The stock fell further still — to a $352.83 close on Jun 25, 2026 — before the Jul 29 earnings beat reversed it; that deeper trough falls between this chart's Jun/Jul monthly points.)" },
  { idx: 48, label: "Q4 FY26 Earnings Beat", note: "Jul 2026 — Q4 FY2026 results (reported Jul 29) beat across the board: Azure accelerated to 43% (guiding ~45%), Copilot seats doubled sequentially to 30M+, revenue beat by ~$2.4B. The stock jumped 15.5% in a single day ($390.54 -> $451.10), continuing to $464.72 by month-end and $483.47 by early August — even as the FY2027 capex guide jumped to $255-260B in the same release." },
];

const VAL_CONFIG = {
  ntm_eps:              21.50,   // web search — analyst consensus non-GAAP FY2027E EPS, carried forward unchanged from the 2026-07-31 CASES valuation-ruler math (ported, not re-derived)
  shares_b:              7.453,  // FY2026 diluted weighted-average shares (Wisesheets 10-K)
  fcf_ntm_b:             67.0,   // FY2026 actual free cash flow (OCF $182.9B - capex $115.9B, Wisesheets 10-K) — effectively TTM as of this Aug 2026 touch since Q1 FY2027 hasn't reported yet
  risk_free_pct:         4.35,
  default_discount_pct:  8.5,    // judgment — MSFT's lower-beta, higher-quality profile vs GOOGL(9.0)/AMZN(9.5)
  default_terminal_pe:   24,
  dcf_years:              5,
  capex_fy26_guide_b:    257,    // FY2027 capex guide midpoint ($255-260B, disclosed on the Q4 FY2026 call) — field name is the generic cross-stock convention (a calendar-year holdover); for MSFT (fiscal year ends June 30) this is the CURRENT/next fiscal year's guide, i.e. FY2027, not a calendar FY26 number
  prior_fy_rev_b:       331.8,   // FY2026 actual full-year revenue (last full fiscal year, Wisesheets 10-K)
  prior_fy_label:       "2026",
  pe_trough: 16, pe_bear_hi: 20, pe_normal_lo: 22, pe_normal_hi: 26, pe_bull_lo: 27, pe_peak: 32,
  peers: [
    { t: "MSFT",  fpe: 22.5, ev_eb: 14.2, fcf_y: 1.9,  note: "Azure cloud + Copilot — the stock itself; FY2027 capex ramp to $255-260B is the single biggest swing factor on the multiple from here" },
    { t: "GOOGL", fpe: 21.5, ev_eb: 25.4, fcf_y: 1.4,  note: "Search + Cloud/TPU dual compounder, also capex-ramping hard in 2026" },
    { t: "META",  fpe: 18.0, ev_eb: 14.0, fcf_y: 1.9,  note: "Ads-only (no cloud upside), also FCF-guided-down in 2026" },
    { t: "AMZN",  fpe: 29.5, ev_eb: 16.1, fcf_y: -0.3, note: "AWS cloud + retail + ads; negative TTM FCF yield amid its own capex ramp — MSFT is the only one of this group still growing FCF" },
  ],
};

const SIGNAL_HELP = {
  "Azure Growth vs 45% Guide": "Azure is Microsoft's cloud business — the data centers, AI compute, and software services it rents to companies and developers. Q4 FY2026 grew 43% year-over-year, accelerating from Q3's 40% and blowing past the 39–40% guide. Azure crossed $100B in full-year revenue for the first time. Management guided Q1 FY2027 to ~45% growth in constant currency. Each percentage point of Azure growth is roughly $1.3–1.5B in additional annual revenue at this scale.",
  "Copilot Paid Seat Growth": "Copilot is Microsoft's AI assistant for Word, Excel, Teams, and other apps. It costs $30/month per user on top of Microsoft 365. Q4 FY2026 had 30 million+ paid seats — net adds more than doubled sequentially from Q3's 20 million. Each additional 10 million seats is roughly $3.6B/year of new revenue. This is the clearest signal of enterprise willingness to pay for AI productivity.",
  "AI Business ARR": "The annualized revenue from all AI-specific products combined — Copilot, Azure AI services, GitHub Copilot, etc. — expressed as an annual run rate. The last disclosed figure was $37 billion (Q3 FY2026, +123% YoY); Microsoft did not re-state an updated AI ARR number on the Q4 call, so this is carried forward as the last known data point pending an update. The bear case: at $255–260B FY2027 capex, can AI ARR scale fast enough to justify the spend?",
  "Operating Margin": "Out of every dollar of revenue, how much Microsoft keeps as operating profit after all costs. Q4 FY2026 came in at approximately 45% (down modestly from Q3's ~47%). Management guided FY2027 operating margin down 'less than one point' — helped by a useful-life accounting change (data center/office depreciable life extended from 15 to 25 years starting FY2027) that reduces near-term depreciation expense.",
  "CapEx / Revenue Ratio": "How much Microsoft spends building AI infrastructure (data centers, Nvidia chips, networking) compared to total revenue. FY2027 capex guidance jumped to $255–260B (up sharply from FY2026's $190B) against a likely ~$390–400B FY2027 revenue — pushing the ratio from ~56% toward ~65%. Amazon peaked at ~25% during its AWS buildout. The key question: is this ratio shrinking over time as revenue grows faster than spending? Shrinking = the investment is paying off; rising = the capex is outrunning the monetization — and this quarter it rose sharply even as the KPIs beat.",
};
const TAG_HELP = {
  BEAT: "doing better than expected — a good sign.",
  MATCH: "roughly in line with expectations — steady, no surprises.",
  MISS: "falling short of expectations — a worry.",
  WATCH: "not decided yet — keep an eye on it.",
};

const THESIS_ITEMS = [
  { key: "azureGrowth",  label: "Azure growth holding 41%+",                note: "43% in Q4 FY26, guided ~45% for Q1 FY27" },
  { key: "copilotSeats", label: "Copilot paid seats growing",               note: "30M+ in Q4 FY26 — net adds more than doubled sequentially from 20M" },
  { key: "opMargin",     label: "Operating margin holding near guide",      note: "~45% in Q4 FY26; FY27 guided down 'less than one point'" },
  { key: "capexRatio",   label: "Capex/revenue ratio not spiraling",        note: "FY27 guide $255-260B (up from $190B) pushes the ratio toward ~65%; FCF already fell to $19.6B in Q4" },
];
const PRICE_ZONES = [
  { label: "BEAR", lo: 325, hi: 400, mid: 362, color: "#f1564b", action: "Exit / reduce if thesis also breaking" },
  { label: "BASE", lo: 475, hi: 565, mid: 520, color: "#e0a83b", action: "Small add OK if thesis intact" },
  { label: "BULL", lo: 650, hi: 760, mid: 705, color: "#3fd07a", action: "Let it ride — don't chase" },
];

// ── Chart geometry / axis ranges (per-stock: depends on price scale) ─────────
const GEOM = {
  priceMin: 280, priceMax: 780,
  fanGrid: [700, 600, 500, 400, 300],
  fanYears: ["2025", "2026", "2027"],
  trackMin: 270, trackMax: 700,
  trackGrid: [650, 550, 450, 350, 250],
  kpiMin: 70, kpiMax: 115,
  visLo: 300, visHi: 780,
  nowZoneLo: 475, nowZoneHi: 565,
};

/* ── TEXT — every company-specific narrative/tooltip the engine renders. ──────
   Values are strings, HTML strings (rendered with dangerouslySetInnerHTML), or
   template functions the engine calls with computed values. If it mentions the
   company, a quarter, a guide number, or an event, it belongs HERE, not in the
   engine — that rule is what makes the engine safely reusable across stocks. */
const TEXT = {
  priceTipLive: (px, at, asOf) => `Live quote: $${px} (fetched ${at}). The price is real-time, but the scenario bands and EPS are still as of ${asOf} — only the price-derived figures (scenario returns, P/E, band position) update live.`,
  priceTipStatic: (px, asOf, liveEnabled) => `$${px} as of ${asOf} — ${liveEnabled ? "live fetch unavailable (offline or blocked), using the saved price" : "static price (live fetch disabled)"}. Next earnings: Q1 FY2027, ~late October 2026.`,
  footerDisclaimer: (asOf) => `Illustrative scenario framing built on public consensus & estimates as of ${asOf} — not a prediction and not financial advice. Price ranges are scenario mid-bands; KPI markers are positional, not literal. Valuation ruler: forward non-GAAP EPS x P/E multiple. Microsoft fiscal year ends June 30. Data inputs will move with every print. Next earnings: Q1 FY2027, ~late October 2026.`,

  fanHistory: "The solid line is Microsoft's actual share price since Q4 FY2025. The stock ran to a $542.07 closing high (Oct 28, 2025, Q1 FY2026) on Copilot/Azure momentum, then sold off through a broad AI-capex-fear correction into 2026 — falling as low as $352.83 (Jun 25, 2026) — before the Jul 29, 2026 Q4 FY2026 beat (Azure 43%, Copilot seats doubled to 30M+) sent it up 15.5% in a single day and it kept climbing into early August.",
  fanNow: (px) => `Microsoft (MSFT) trades around $${px} right now — about ${(((px/542.07)-1)*100).toFixed(0)}% off its $542.07 closing high (Oct 28, 2025), even after jumping 15.5% on the Jul 29 Q4 FY2026 beat (Azure 43%, guiding ~45%; Copilot seats doubled to 30M+). Everything left of this dot is history; everything right is forecast.`,
  fanPastDot: (q, p) => `Around the end of ${q}, MSFT was trading near $${p}.`,

  segmentedExplain: {
    bear: ["The pessimistic scenario", "Click to see MSFT if the FY2027 $255–260B capex outruns its payoff — free cash flow keeps compressing even as Azure/Copilot headline growth looks fine on paper, and the market re-prices toward capex-heavy infrastructure multiples. Price lands in the $325–400 range."],
    base: ["The most-likely scenario", "Click for the base view — Q4 already confirmed Azure at 43% (guiding ~45%) and Copilot seats doubling to 30M+. The base case requires that to keep holding while the FY2027 capex ramp doesn't blow out free cash flow. Fair value $475–565."],
    bull: ["The optimistic scenario", "Click for the upside — Azure sustains 48%+, Copilot agent workflows create a new billable compute category, and the market decides the $255–260B FY2027 capex is capacity-constrained demand, not speculative build. Price reaches $650–760."],
  },

  kpiBaseline: (val) => `This is the most recent real number: Microsoft's total revenue was $${val}B in Q4 FY2026 (Azure alone grew 43% YoY, accelerating from Q3's 40%, guiding ~45% for Q1 FY27). The bars to the right are scenario forecasts for total quarterly revenue going forward.`,
  kpiForecast: (label, val) => `In this scenario, total quarterly revenue reaches roughly $${val}B by ${label}. Taller bar = faster overall growth, driven mainly by how fast Azure and Copilot scale relative to the rest of the business.`,

  reversion: {
    header: "REVERSION CLOCK · APR 29 CAPEX SELLOFF",
    timeTip: "On April 29, 2026, Microsoft revealed a sharply larger FY2027 capex plan, and the stock fell to a $424.46 close that day. This bar shows elapsed days vs. the ~90-day window typical for a macro/sentiment-driven selloff to revert. Prior MSFT dislocations (April 2024 capex concern, Jan 2025 DeepSeek scare) reverted in 60–90 days.",
    priceTip: (trough, baseFloor, now) => `Stock closed at $${trough} on the day of the April 29 capex-guide reveal. The 'base zone' floor is $${baseFloor}. At $${now}, the price is ${now >= baseFloor ? "back above the base floor" : "still below the base floor"} — note the stock actually fell further after this specific reaction, to a $352.83 close on Jun 25, 2026, before the Jul 29 earnings beat reversed it.`,
    footerHtml: (baseFloor, precedentDays, now) => `The April 29 capex-driven reaction low ($424.46 close) sits inside the ~${precedentDays}-day reversion precedent window. The <span style="color:#3fd07a;font-weight:700">July 29</span> Q4 FY2026 print — the confirmation gate this thesis was watching — delivered decisively: Azure hit <span style="color:#fff">43%</span> (guiding ~45%) and Copilot seats doubled to 30M+, both clearing the old bear-vs-base threshold. At $${now}, the stock is <span style="color:#e0a83b;font-weight:700">${now >= baseFloor ? "back above" : "still below"}</span> the $${baseFloor} base-floor anchor — the FY2027 capex guide jumping to <span style="color:#fff">$255–260B</span> in the same release is the likely reason the market hasn't fully re-rated the print into a clean reversion.`,
  },

  track: {
    lastDot: (post, nowPx) => `After Q4 FY2026 earnings (Jul 29), MSFT surged 15.5% to $${post} on an across-the-board beat: Azure accelerated to 43% (guiding ~45% for Q1 FY27), Copilot seats doubled sequentially to 30M+, and revenue beat by ~$2.4B. The catch: FY2027 capex guidance jumped to $255–260B, up from $190B — the market's next test. Price has continued climbing to $${nowPx} today. Next dot: Q1 FY2027 earnings, ~late October 2026.`,
    pastDot: (q, post) => `After ${q} earnings, MSFT actually traded around $${post}.`,
    readoutHtml: (hits, n, nowPx) => `Tracked <span style="color:#3fd07a;font-weight:700">base-or-better in ${hits} of ${n} quarters</span>. The Q1 FY2026 bull landing ($535, near the $542.07 all-time closing high) was driven by Copilot seat momentum and Azure acceleration. The Q3 FY2026 capex shock pulled the price back into the bear-to-base transition zone despite strong fundamentals. The Q4 FY2026 print on July 29 answered the growth question decisively — Azure <span style="color:#3fd07a;font-weight:700">43%</span> (guiding ~45%), Copilot seats doubled to 30M+ — and the stock has kept climbing to <span style="color:var(--blue-soft);font-weight:700">$${nowPx}</span> today. Both the monetization KPIs and the capex risk got bigger this quarter — the bands were revised up on both sides accordingly.`,
    footnote: "⚠ Bands are reconstructed now, anchored to each date's forward EPS and multiple regime — not archived in real time. Older quarters are marked 'lower confidence' as the AI monetization story was less developed then. Microsoft fiscal year ends June 30; quarters labeled by Microsoft's convention.",
  },

  current: {
    statusNarrative: {
      broken: "Multiple signals missed. Thesis is under pressure — review the kill-switch criteria.",
      watch:  "Azure/Copilot beat but margin or capex/FCF ticked the wrong way further than expected. Core thesis tracking — the ~late Oct 2026 print is the next test. Not broken, but watch closely.",
      intact: "Q4 FY2026 confirmed the growth half of the bull case decisively — Azure accelerated, Copilot seats doubled — even though the FY2027 capex guide reset how much monetization is required from here.",
    },
    panelTipStory: "Checks whether the original reasons to own MSFT are playing out. Counts signals from the Q4 FY2026 print — Azure growth, Copilot seats, AI ARR, operating margin, capex/revenue ratio. 0-1 miss = thesis intact. 2 misses = watch. 3+ = exit. Click to see KPI bars and kill-switch.",
    watchChipHtml: `🔑 WATCH: Q1 FY27 Azure growth vs ~45% guide + FCF trend · ~late Oct 2026`,
    exitChipHtml: `⚠ EXIT IF: Azure decelerates below 36%, or capex/revenue ratio exceeds 65% with no FCF stabilization`,
    verdictBody: {
      broken:     (px) => `MSFT at $${px}: kill-switch criteria met. Price position is irrelevant — signals say the Azure/Copilot-monetization thesis is no longer outrunning the FY2027 capex ramp. The question is not whether to add; it is how much to reduce.`,
      watchBelow: (px) => `MSFT at $${px} sits below the base floor but signals are mixed. Price is attractive, but adding into a weakening thesis is the wrong sequence. Wait for the ~late Oct 2026 print to confirm or deny the pattern before deploying capital.`,
      below:      (px) => `MSFT at $${px} sits below the base floor with the thesis intact — Azure, Copilot, and revenue all beat in Q4, and the FY2027 capex jump has a clear, disclosed cause (AI infrastructure demand). The market is pricing in the FCF-compression risk more than a growth problem.`,
      inBase:     (px, statusWord) => `MSFT at $${px} is inside the base range. Thesis ${statusWord} and price is fair. Watch Q1 FY2027 Azure growth against the ~45% guide and whether free cash flow stabilizes around late Oct 2026 — continued strength opens the bull case; Azure decelerating below 36% or FCF/revenue kept falling reopens the bear.`,
      above:      (px) => `MSFT at $${px} is above the base ceiling. The bull case — Azure sustaining 48%+ and the market deciding the $255–260B capex is capacity-constrained demand rather than speculative build — needs to play out to justify entry. If already in, hold. If adding, wait for a pullback toward the base floor.`,
    },
    kpiTitle: "Total Quarterly Revenue",
    kpiSub: "$B · HIGHER BETTER",
    kpiMeasures: "Microsoft's total quarterly revenue — the cleanest all-up read on whether Azure/Copilot growth is showing up in the whole business, not just the cloud segment. Q4 FY2026 printed $90.0B (+17.7% YoY), and management guided Q1 FY2027 to $89.85–90.95B (+16–17%).",
    kpiRequires: {
      bull: "Azure sustains 48%+ with capacity-constraint commentary, pushing total revenue growth toward the low-20s% YoY as Copilot agent workflows add a new billable category.",
      base: "Azure holds 41–46%, keeping total revenue growth in the mid-to-high teens YoY — confirming Q4's acceleration is durable, not a one-quarter pop.",
      bear: "Azure decelerates below 36%, pulling total revenue growth down toward the low double digits YoY even as the FY2027 capex ramp keeps compressing free cash flow.",
    },
    group1Title: "Azure &amp; AI Revenue Momentum",
    group2Title: "Margin &amp; Capital Efficiency",
    killSwitch: "Azure decelerates below 36% in Q1 FY27 AND Copilot seat growth stalls below 32M, or the capex/revenue ratio exceeds 65% with no plateau in sight — exit / reduce. That is demand weakness or a genuine cash-conversion problem, not noise.",
    priceBanner: {
      below:  (px, baseLo) => `At $${px}, price is $${(baseLo - px).toFixed(0)} below the base floor. Market is pricing in FY2027 capex/FCF risk after a real, disclosed step-up in spend — not an Azure or Copilot growth problem given the Q4 beat.`,
      inBase: (px) => `At $${px}, price is inside the base range. Fair value — not a discount, not expensive.`,
      above:  (px, baseHi) => `At $${px}, price is $${(px - baseHi).toFixed(0)} above the base ceiling. The bull thesis (Azure 48%+, capex read as capacity-constrained demand) needs to play out in full.`,
    },
    moodBanner: (currentPE, loPE, hiPE) => `At ${currentPE}× forward P/E, the market is pricing in continued Azure/Copilot strength alongside real caution about the FY2027 capex ramp — the multiple sits ${currentPE < loPE ? "below" : currentPE > hiPE ? "above" : "inside"} the normal band (${loPE}–${hiPE}×), still below MSFT's own 25-32x 'platform premium' peak years even after the Q4 beat and the subsequent run to today's price.`,
    cagrNotes: {
      low:  "Low bar — not priced for perfection. Even moderate Azure/Copilot execution justifies the price.",
      mid:  "Moderate bar — requires Azure to hold in the low-to-mid 40s% and FCF to stop compressing.",
      high: "High bar — requires Azure to keep accelerating past 48% AND the market to re-rate the $255-260B capex as demand-driven, not cost-driven.",
    },
    fy26CardTip: (fy26) => `Adding Q4 FY2026's actual $90.0B to base-case Q1–Q3 FY2027 projections gives a run-rate of roughly $${fy26}B over that four-quarter stretch — up from FY2026's full-year $331.8B. This is a rolling-quarter sum (the engine's fixed convention), not a literal calendar-FY2027 total, but it tracks the same growth path today's price already assumes.`,
    fy26CardHtml: (fy26, growthPct) => `Q4 FY2026 actual plus base-case Q1-Q3 FY2027 projections sum to roughly <span style="color:var(--blue-soft);font-weight:700">$${fy26}B</span> across that four-quarter stretch — the growth path today's price already assumes. FY2026 actual full-year revenue was <span style="color:#3fd07a">$331.8B</span>, so this implies <em>~${growthPct}%</em> growth over the trailing four quarters shown.`,
    peerCommentary: (currentPE) => `At ${currentPE}× NTM P/E, MSFT trades at a discount to AMZN (~29.5×) and a premium to META (~18.0×), roughly in line with GOOGL (~21.5×) — all four mega-cap AI-capex names have moved together on sector-wide capex-fear/monetization-proof cycles this year, not an MSFT-specific issue. MSFT stands out as the only one of this peer set with a positive AND growing free cash flow trend (unlike AMZN's negative TTM FCF yield, or GOOGL/META's own FCF pressure) — the premium the market pays for that quality is exactly what the FY2027 capex jump to $255-260B now puts at risk.`,
  },

  future: {
    scenarioTips: {
      bear: "Triggered by: Azure decelerating below 36%, Copilot seat growth stalling below 32M, or the capex/revenue ratio blowing past 65% with no plateau. Multiple compresses toward the 16-20× trough zone. Note: MSFT's quality floor limits downside even in a disappointment scenario.",
      base: (loPE, hiPE) => `Azure holds 41–46% as it moderates naturally from Q4's 43%; Copilot seats keep growing; operating margin holds within the guided decline. P/E holds in the normal ${loPE}–${hiPE}× band. Modestly positive return from here as the FY2027 capex ramp gets digested.`,
      bull: (currentPE) => `Azure sustains 48%+ with capacity-constraint commentary; Copilot agent workflows add a new billable category; AI ARR re-accelerates. Multiple re-rates from ~${currentPE}× toward the bull zone, closing the gap to the bull target.`,
    },
    downsideChevronTip: "Kill-switch: Azure decelerates below 36% AND Copilot seat growth stalls below 32M, or capex/revenue ratio exceeds 65% with no plateau in sight = exit / reduce.",
    dislocEventName: "the Apr 29 2026 capex-guide reveal",
    dislocLabel: "SINCE APR 29 2026 CAPEX REVEAL",
    bearPriceTip: (bearMid, bearLo, bearHi, peTrough, peBearHi) => `$${bearMid} is the midpoint of the bear case range ($${bearLo}–$${bearHi}). This assumes Azure decelerates below 36%, free cash flow keeps compressing as the FY2027 capex ramp outruns monetization, and the multiple compresses toward the ${peTrough}–${peBearHi}× trough zone. The kill-switch is Azure below 36% AND Copilot seats stalling below 32M — if it triggers, do not average down.`,
    killSwitchTip: "A kill-switch is a pre-committed exit rule you set BEFORE you own the position — when you are thinking clearly. If Azure decelerates below 36% in Q1 FY27 AND Copilot seat growth stalls below 32M, or the capex/revenue ratio exceeds 65% with no plateau in sight, the thesis is broken: that's demand weakness or a genuine cash-conversion problem, not timing. Do not average down into a broken thesis — the market is telling you something. No debate, no rationalisation. Exit.",
    killSwitchTipNote: "Azure below 36% AND Copilot seats below 32M, or capex/revenue past 65% with no plateau. Any one. No debate.",
    killSwitchHtml: `<strong style="color:var(--title)">Azure decelerates below 36% AND Copilot seat growth stalls below 32M, or the capex/revenue ratio exceeds 65% with no plateau in sight</strong> → exit or reduce. No debate. Do not average down into a broken thesis.`,
    nextCheck: "Next check: Q1 FY2027 earnings, ~late October 2026",
    downsideFootnote: (px, peTrough, peBearHi) => `Bear case scenario: Azure deceleration or capex/revenue ratio blowing out with no FCF stabilization. Assumes a multiple compression toward ${peTrough}–${peBearHi}× on roughly flat-to-down EPS growth. Position loss is illustrative at $${px} entry.`,
    multipleSummary: (peNow, loPE, hiPE) => `At ~${peNow}× NTM P/E, MSFT sits ${peNow < loPE ? "below" : peNow > hiPE ? "above" : "inside"} its normal range (${loPE}–${hiPE}×) — still below its own historical 25-32× platform-premium years, even after the Q4 beat and the run to today's price.`,
    peBarTipSuffix: "P/E uses forward non-GAAP EPS — Microsoft's non-GAAP figures exclude a small set of clearly-disclosed one-time items and are the figure analyst consensus estimates are built around.",
    deepValueZoneNote: "Historically cheap for this business. Rare — last seen during the Apr-Jun 2026 capex-fear selloff. A real entry window if the thesis holds.",
    dislocPrecedent: (baseFloor) => `Historical precedent: prior MSFT dislocations (Apr 2024 capex concern, Jan 2025 DeepSeek scare) resolved within a 60-90 day window once fundamentals reconfirmed. Base floor: $${baseFloor}.`,
    regretHtml: (currentPE) => `Q1 FY2027 Azure growth <strong style="color:#3fd07a">sustains 48%+ with capacity-constraint commentary</strong> AND free cash flow stabilizes as a share of revenue. That would confirm the FY2027 capex ramp is capacity-constrained demand, not speculative build, re-rate the stock from ~${currentPE}× toward the bull zone, and close today's entry window.`,
    regretTip: "Charlie Munger's inversion: instead of asking 'why should I buy?', ask 'what would I have to believe happened, in hindsight, to wish I had bought more?' If Q1 FY2027 confirms Azure sustaining 48%+ and FCF stabilizing, today's entry window will close fast. This question is not about FOMO — it is about sizing correctly for your conviction.",
    chips: [
      { label: "KILL-SWITCH: AZURE <36% + COPILOT <32M, OR CAPEX/REV >65% → EXIT", col: "#f1564b" },
      { label: "REGRET IF: AZURE 48%+ + FCF STABILIZES",                          col: "#3fd07a" },
      { label: "NEXT CHECK: ~LATE OCT 2026 EARNINGS",                             col: "#2f6dff" },
    ],
    signalFootnote: (ntmEps) => `P/E uses consensus forward non-GAAP EPS $${ntmEps} — the figure the FY2027 valuation ruler in this thesis is built around.`,
  },

  past: {
    cardTips: {
      durability: (revCagrPct) => `Looks at Revenue, Gross Margin, and Free Cash Flow over the last 5 fiscal years — MSFT's fiscal year just closed (Jun 30, 2026), so Wisesheets' free-tier history cap lands cleanly on 5 full years here, unlike some peers' 4-year windows. We want upward trends that hold through cycles. MSFT grew revenue at ~${revCagrPct}% CAGR, but unlike a classic 'expanding-margin compounder,' gross margin actually dipped slightly (68.4% -> 67.9%) as the AI infrastructure buildout accelerated depreciation.`,
      value: (latestROIC) => `ROIC (Return on Invested Capital) measures how efficiently management deploys capital. Above WACC (~8-9% for a company this size) = value creation. Below = value destruction. MSFT's ROIC has stayed well above that bar throughout this window but has been declining every year — from 30.8% (FY2022) to ${latestROIC}% (FY2026) — as the AI capex ramp expands invested capital faster than operating income has kept pace.`,
      capex: (peakCapex, latestCapex, latestFCF) => `Capex as a % of revenue shows how much of every dollar gets reinvested before cash reaches shareholders. Capex/revenue has nearly tripled across this window — from 12.1% (FY2022) to ${latestCapex}% (FY2026) — as the AI buildout accelerated, yet free cash flow held roughly flat at $${latestFCF}B, meaning the capex increase has so far been funded mostly by operating cash flow growth, not by shrinking free cash flow. The FY2027 guide ($255-260B) implies this ratio keeps climbing — the real test the FUTURE tab tracks.`,
      mood: (evNow, evAvg) => `EV/EBITDA vs its own 5-year average tells you whether the market is paying a premium or discount for this business. Current EV/EBITDA of ${evNow}× sits well BELOW the 5-year average of ~${evAvg}× — but this is a timing artifact: MSFT's fiscal year closed (Jun 30, 2026) right near the pre-earnings trough, before the Jul 29 beat. Using today's live price instead, EV/EBITDA is closer to ~18.4×, still below the 5-year average but a meaningfully less extreme discount than the raw fiscal-year-end snapshot implies.`,
    },
    stats: [
      { html: `Revenue <span style="color:#3fd07a;font-weight:700">$198.3B → $331.8B</span> (5Y)`, tipTitle: "Revenue (5-year)", tipBody: "MSFT grew annual revenue from $198.3B (FY2022) to $331.8B (FY2026) — a ~13.7% CAGR, accelerating in the final two years as Azure/AI demand took off. FY2026 alone grew 17.7% YoY, the fastest pace in this window." },
      { html: `FCF <span style="color:#e0a83b;font-weight:700">$65.1B → $67.0B</span> (5Y, nearly flat)`, tipTitle: "Free Cash Flow (5-year)", tipBody: "FCF was $65.1B in FY2022 and $67.0B in FY2026 — nearly flat over 5 years despite revenue growing ~67% over the same window, because capex/revenue nearly tripled (12.1% -> 34.9%) as the AI infrastructure buildout accelerated. FCF actually peaked mid-window at $74.1B (FY2024) before the capex ramp compressed it back down." },
      { html: `Price <span style="color:#3fd07a;font-weight:700">+72.3%</span> (Jul 2022 → now)`, tipTitle: "Total price return (since Jul 2022)", tipBody: "From $280.74 (Jul 2022) to $483.47 today = +72.3%. This compounding came from a mix of organic earnings growth and Copilot/Azure-driven multiple expansion, cut through by a real Apr-Jun 2026 AI-capex-fear drawdown (as deep as -30.6% from the Jul 2025 high) that the Jul 29 2026 Q4 beat substantially reversed." },
    ],
    verdictBody: "Microsoft has compounded revenue at ~13.7% annually over the last 5 fiscal years, accelerating to +17.7% in FY2026 alone as Azure/AI demand took off. Unlike a classic expanding-margin compounder, gross margin actually dipped slightly (68.4% -> 67.9%) and ROIC declined every year (30.8% -> 25.6%) as the AI infrastructure buildout pulled invested capital up faster than operating income. Free cash flow held roughly flat ($65.1B -> $67.0B) across the full window despite revenue growing ~67%, because capex/revenue nearly tripled (12.1% -> 34.9%) — real, structural evidence of how much heavier this capex cycle is than Microsoft's historical norm. The Azure/Copilot growth re-acceleration in FY2026 is real and durable-looking so far; the open question, which the FY2027 $255-260B capex guide makes sharper, is whether free cash flow starts growing again or keeps compressing as the buildout continues.",
    banners: {
      durability: (revCagrPct, rev0, rev9, gmDelta, latestGM, fcf0, latestFCF) => `Revenue compounded at ~${revCagrPct}% annually from $${rev0}B (FY2022) to $${rev9}B (FY2026), accelerating to +17.7% in the final year. Gross margin actually moved ${gmDelta} points to ${latestGM}% — a slight compression, not expansion, as AI infrastructure depreciation scaled up. FCF was nearly flat, $${fcf0}B to $${latestFCF}B, across the full window.`,
      value: (latestROIC) => `ROIC of ${latestROIC}% (FY2026) comfortably exceeds a typical WACC of 8-9% for a company this size — every dollar reinvested still creates real value — but it has declined every single year in this window from FY2022's 30.8%, as the AI capex ramp expands invested capital faster than operating income has kept pace. This is the clearest single number showing the tension between AI-buildout spend and near-term returns.`,
      capex: (latestCapex, peakCapex, latestFCF, fy26Guide) => `Capex/revenue of ${latestCapex}% (FY2026) is the window-high, nearly triple FY2022's 12.1%, and the FY2027 guide of $${fy26Guide}B implies it keeps climbing toward ~65% of revenue. FCF held at $${latestFCF}B in FY2026 — down from a FY2024 peak of $74.1B — the clearest sign the capex ramp is now outpacing operating cash flow growth, not just riding alongside it. The next few prints are the actual test of whether this stabilizes.`,
      mood: (evNow, evAvg) => `EV/EBITDA of ${evNow}× sits well below the 5-year average of ${evAvg}× at the Jun 30, 2026 fiscal year-end — but that close landed right near the pre-earnings trough, before the Jul 29 beat. On today's live price, EV/EBITDA is closer to ~18.4×, a real but less extreme discount to the 5-year average — the market pricing in genuine caution about the FY2027 capex ramp even after confirming the growth story.`,
    },
    revAnnotationsHtml: `<span>FY2022: <span style="color:var(--tx3)">$198.3B</span> (pre-AI baseline)</span><span>FY2026: <span style="color:var(--tx3)">$331.8B</span> (Azure/Copilot acceleration)</span>`,
    roicNote: "Green >15% · Amber 5-15% · Red <5% — MSFT has stayed green every year in this window, but declining",
    fcfYieldNote: "FCF yield swung between 1.9% and 3.3% across this window — driven mostly by the stock's own multiple moving, since FCF itself stayed roughly flat while capex intensity nearly tripled.",
    capexAnnotationsHtml: `<span>FY2022: <span style="color:#3fd07a">12.1%</span> (pre-AI-buildout baseline)</span><span>FY2026: <span style="color:#f1564b">34.9%</span> (AI buildout, still climbing toward FY2027's ~65% implied ratio)</span>`,
    footnotes: {
      durability: "MSFT's growth is organic — no major acquisition playbook to adjust for. The 5-year window (FY2022-FY2026, cleanly available since Wisesheets' free-tier 5-year cap lines up exactly with MSFT's fiscal year that just closed) captures the pre-AI baseline through the Azure/Copilot acceleration. Revenue growth itself accelerated sharply in FY2026 (+17.7%, the fastest in this window) as Azure crossed $100B in annualized revenue.",
      value: "ROIC declined every year in this window, from 30.8% (FY2022) to 25.6% (FY2026), as the AI capex ramp expanded invested capital faster than operating income grew. Still comfortably above a typical 8-9% WACC throughout — this is a real trend to watch, not yet a value-destruction signal.",
      capex: "Capex/revenue nearly tripled across this window, from 12.1% (FY2022) to 34.9% (FY2026), as the AI buildout accelerated, and the FY2027 guide ($255-260B, up from FY2026's roughly $190B baseline figure this thesis's CASES narrative cites) implies it climbs further still, toward ~65% of revenue. The kill-switch for this panel: if capex/revenue keeps climbing without Azure revenue/margin keeping pace, or free cash flow keeps compressing with no plateau, the AI buildout has stopped paying for itself fast enough to matter.",
      mood: "The scenario bands on the other tabs use forward P/E, not EV/EBITDA — MSFT carries manageable debt and clean non-GAAP earnings, so P/E is a fair ruler here. EV/EBITDA is shown purely to track cross-cycle mood, since it's capital-structure-neutral. Note the FY2026 fiscal-year-end EV/EBITDA (14.2×) landed right at the pre-earnings trough by coincidence of timing (fiscal year closes Jun 30, days before the Jul 29 Q4 print) — the live multiple on today's price (~18.4×) is a more representative current read.",
    },
    priceChartTitle: "MSFT PRICE · MONTHLY · 2022–2026",
    priceChartSub: "$ per share · dashed lines = key events · window limited to available Wisesheets history",
    priceNowTip: (px, isATH) => `$${px} — where MSFT trades today, ${isATH ? "also the highest monthly close in this window" : "below the window's high (Jul 2025 monthly close $533.50; the true daily-close ATH was $542.07 on Oct 28, 2025)"}. The chart shows the Copilot/Azure-driven run to that high, the 2026 AI-capex-fear correction (as deep as -30.6% from the Jul 2025 high), then the Jul 2026 earnings-driven recovery.`,
    ddTip: (minDD) => `${minDD}% — the deepest drop from a prior high in this window, in March 2026, during the AI-capex-fear correction that preceded the Apr 29, 2026 capex-guide reveal. The stock recovered from an even deeper daily trough ($352.83, Jun 25 2026) after the Jul 29 earnings beat. Drawdown charts help you visualize what holding through a bad period actually felt like.`,
    ddAnnotationsHtml: `<span>Max drawdown: <span style="color:#f1564b">−30.6%</span> (Mar 2026, AI-capex-fear correction, monthly-close basis)</span><span>Current: <span style="color:#e0a83b">−12.9%</span> from the Jul 2025 high (this chart's Jul 2026 month-end point, before further August gains to today's $483.47)</span>`,
  },
};
