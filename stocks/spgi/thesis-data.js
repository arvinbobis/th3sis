/* ╔══════════════════════════════════════════════════════════════════════════╗
   ║   SPGI · thesis-data.js — ALL per-stock content lives here.              ║
   ║   ███  EDIT EVERYTHING IN THIS FILE EACH QUARTER  ███                    ║
   ║                                                                          ║
   ║   The rendering engine (../engine/thesis-engine.js) contains ZERO        ║
   ║   company-specific strings — every number, narrative, and tooltip        ║
   ║   that mentions SPGI is in this file. Quarterly touch = edit this        ║
   ║   file only, then run: node tools/lint-thesis-data.js SPGI               ║
   ║                                                                          ║
   ║   Quick map — after each earnings report:                                ║
   ║     1. AS_OF_DATE / FALLBACK_PRICE                                       ║
   ║     2. HISTORY (add quarter) / FUTURE_Q (roll labels) / PROJ_END         ║
   ║     3. CASES — re-read each narrative, still true?                       ║
   ║     4. SIGNALS / MARGIN — update BEAT/MATCH/MISS + positions             ║
   ║     5. KPI_HIST / KPI_PROJ                                               ║
   ║     6. TRACK_ALL — append new quarter (oldest auto-drops)                ║
   ║     7. TEXT.* — re-read every narrative template, refresh stale facts    ║
   ║     8. ALERT — keep in sync with PF_ALERTS (canonical)                   ║
   ║                                                                          ║
   ║   BUILD NOTE (2026-07-18): brand-new build, first touch since the        ║
   ║   2026-07-01 Mobility (MBGL) spinoff. Next earnings (Q2 FY2026, Jul 28   ║
   ║   2026) is the first call reissuing formal guidance ex-Mobility — treat  ║
   ║   that as this thesis's real "quarter zero" and refresh promptly after. ║
   ╚══════════════════════════════════════════════════════════════════════════╝ */

const TICKER_META = { ticker: "SPGI", exchange: "NYSE", company: "S&P Global Inc." };
const AS_OF_DATE = "2026-07-18";

// Most recent material dislocation — the Feb 10-11, 2026 guidance-miss crash
const DISLOCATION_DATE = "2026-02-10";
const REVERSION_TROUGH = 390.76;      // 2026-02-11 closing trough (real EOD print)
const REVERSION_BASEFLOOR = 425;      // base-case band floor (see PRICE_ZONES)
const REVERSION_PRECEDENT_DAYS = 141; // 2026-02-11 trough to 2026-07-02 durable reclaim of the base floor

const CASES = {
  bear: {
    key: "bear", label: "BEAR", accent: "#f1564b", glow: "rgba(241,86,75,0.45)",
    target12: "$330 — $390",
    op: "SPGI trades at $450.84 heading into its first full quarter as a standalone four-segment company (Ratings, Market Intelligence, Commodity Insights, Indices) after spinning off Mobility on Jul 1, 2026. The bear case starts from something the company itself has already disclosed: Q1 2026's 14% Ratings-issuance growth was partly 'front-end loading of hyperscaler issuance relative to initial expectations' — a real, management-sourced pull-forward signal — and guidance already calls for Ratings growth to decelerate through the year and turn NEGATIVE in Q4 2026 as easy comps roll off. The Feb 10, 2026 crash (stock fell ~17% in a session, continuing to an intraday/closing trough of $390.76 the next day) showed how sharply the multiple can compress on a guide that missed consensus by only a few percent — proof the market prices this as a growth compounder, not a value stock, and will punish any confirmation that Q1's issuance strength was pulled forward rather than a new run-rate. If Q2/Q3 print soft Ratings growth even within the guided deceleration, or refinancing/new-issue activity actually rolls over (management's own stated 'biggest current risk'), the multiple could retest the ~18-21x trough zone seen in February.",
    breaks: "Two straight quarters where continuing-ops organic constant-currency revenue growth misses the low end of the 6-8% FY2026 guide, or Ratings billed issuance goes negative BEFORE the guided Q4 2026 timing — confirming Q1's front-end-loaded hyperscaler issuance was masking a real slowdown, not just pulling a normal quarter forward.",
    requires01: "Q2 2026 print (Jul 28, 2026) shows Ratings growth decelerating faster than guided, or continuing-ops revenue misses the 6-8% organic cc guide",
    requires02: "Refinancing/new-issue bond activity visibly slows (the risk management itself flagged on the Q1 call), or a credible NRSRO reform / new-entrant threat emerges",
  },
  base: {
    key: "base", label: "BASE", accent: "#e0a83b", glow: "rgba(224,168,59,0.40)",
    target12: "$425 — $515",
    op: "SPGI at $450.84 sits mid-band on a forward P/E of ~24.4x (on $18.46 FY2026 continuing-ops consensus EPS) — a real discount to both its own 5-year forward-multiple range (which peaked near 34x in mid-2025) and to peer medians (MCO ~27x, MSCI ~30x, VRSK ~26x). Q1 2026 delivered a genuine beat on a continuing-ops basis (pro forma revenue $3.717B, diluted EPS $4.48, roughly +11% YoY on a like-for-like continuing-ops estimate), management completed the Mobility spinoff cleanly and on schedule Jul 1, and $1.0B of buybacks in a single quarter show real capital-return discipline funding EPS growth independent of revenue. The base case simply assumes the 6-8% organic constant-currency growth guide holds and Ratings decelerates roughly as management has already told the market it will — nothing more optimistic than what's already been disclosed. Most likely path: the Jul 28 print reaffirms guidance on an ex-Mobility basis, the multiple holds in its normal 23-28x band, and the stock re-tests the $500s on earnings growth rather than needing further multiple expansion.",
    breaks: "Management cuts full-year 2026 organic cc revenue or adjusted EPS guidance when it reissues on an ex-Mobility basis (Jul 28, 2026) — the opposite of a clean transition.",
    requires01: "Q2 2026 continuing-ops revenue and EPS land within/near the reissued ex-Mobility guide",
    requires02: "Ratings growth decelerates roughly on the guided schedule (not faster); Indices and Market Intelligence keep growing double-digit / high-single-digit respectively",
  },
  bull: {
    key: "bull", label: "BULL", accent: "#3fd07a", glow: "rgba(63,208,122,0.45)",
    target12: "$555 — $630",
    op: "The bull case is that the Mobility spinoff did what management said it would: leave a cleaner, higher-margin, more toll-booth-like four-segment company — and that the market re-rates SPGI back toward the ~30-34x forward multiple it traded at before the February 2026 guidance-miss panic, not because the growth story changed but because the 'what does SPGI look like without Mobility' uncertainty resolves in the company's favor. Indices grew 17% in Q1 2026 with double-digit growth across every business line inside it — the highest-margin, most durable-moat segment (S&P 500 licensing, a direct toll on passive-investing AUM growth) doing the most convincing work. If Ratings issuance strength proves NOT to be pull-forward — Q2/Q3 hold up better than the guided deceleration, refinancing activity stays robust despite only one expected 2026 rate cut — combined with continued buyback-driven EPS growth, the multiple has real room to re-rate back toward its own recent highs.",
    breaks: "Q2 2026 (Jul 28) or Q3 2026 misses the reissued ex-Mobility guide, confirming the Q1 Ratings strength really was pulled forward rather than a new run-rate — or a new NRSRO/ratings-duopoly regulatory threat emerges.",
    requires01: "Ratings billed issuance growth beats the guided deceleration path (stays positive and strong into Q3/Q4 2026, not just Q1-Q2)",
    requires02: "Indices division sustains double-digit growth and the market re-rates SPGI's multiple back toward 30x+ on confirmation the standalone story is cleaner, not just smaller",
  },
};

// THESIS_HISTORY — append-only archive of the full CASES set as it stood at each
// touch, captured BEFORE that touch's Layer-2 audit rewrites it. Brand-new build:
// nothing to archive yet. Intentionally left undefined rather than an empty array
// (node tools/lint-thesis-data.js treats a present-but-empty array as malformed —
// undefined is the correct "nothing archived yet" state for a first build). The
// FIRST future /update-thesis touch should introduce this as a real array and push
// this build's outgoing CASES vintage into it before rewriting CASES.
// const THESIS_HISTORY = [];

const FALLBACK_PRICE = 450.84;

const LIVE_PRICE = {
  enabled: true,
  symbol: "SPGI",
  provider: "yahoo",
  corsProxy: "https://api.allorigins.win/get?url=",
  finnhubToken: "",
};

// ALERT — buy-trigger pre-commitment. FALLBACK ONLY for offline opens — this build
// is NOT yet mirrored into PF_ALERTS.SPGI in stocks/portfolio/portfolio-data.js
// (deliberately left for human review before it goes live in the portfolio page;
// SPGI is already a small held position, not a fresh satellite candidate).
const ALERT = {
  symbol: "SPGI",
  buyFloor: 400,
  thesisIntact: true,
  asOf: AS_OF_DATE,
  nextEarnings: "2026-07-28",
};

const HISTORY = [
  { q: "Q4 2024", p: 498.03 },
  { q: "Q1 2025", p: 508.10 },
  { q: "Q2 2025", p: 527.29 },
  { q: "Q3 2025", p: 486.71 },
  { q: "Q4 2025", p: 522.59 },
  { q: "Q1 2026", p: 425.34 },
  { q: "NOW",     p: FALLBACK_PRICE },
];

const PROJ_END = { bear: 360, base: 470, bull: 592 };
const FUTURE_Q = ["Q2 2026", "Q3 2026", "Q4 2026", "Q1 2027"];

const SIGNALS = {
  bear: [
    { name: "Q1 2026 Revenue YoY (continuing ops)", unit: "%",  tag: "BEAT",  next: "Jul 28, 2026", val: "ACTUAL ~+11% ($3.72B pro forma)", guide: "vs 6-8% FY26 organic cc guide", pos: 0.68 },
    { name: "Ratings Billed Issuance Growth",       unit: "%",  tag: "WATCH", next: "Jul 28, 2026", val: "ACTUAL +14% (Q1 2026)", guide: "guided to decelerate, negative by Q4 2026", pos: 0.52 },
    { name: "Q2 2026 Revenue Guide (ex-Mobility)",  unit: "$B", tag: "WATCH", next: "Jul 28, 2026", val: "TO REPORT",  guide: "first full guide reissued ex-Mobility", pos: 0.50 },
  ],
  base: [
    { name: "Q1 2026 Revenue YoY (continuing ops)", unit: "%",  tag: "BEAT",  next: "Jul 28, 2026", val: "ACTUAL ~+11% ($3.72B pro forma)", guide: "vs 6-8% FY26 organic cc guide", pos: 0.68 },
    { name: "Ratings Billed Issuance Growth",       unit: "%",  tag: "WATCH", next: "Jul 28, 2026", val: "ACTUAL +14% (Q1 2026)", guide: "guided to decelerate, negative by Q4 2026", pos: 0.52 },
    { name: "Q2 2026 Revenue Guide (ex-Mobility)",  unit: "$B", tag: "WATCH", next: "Jul 28, 2026", val: "TO REPORT",  guide: "first full guide reissued ex-Mobility", pos: 0.50 },
  ],
  bull: [
    { name: "Q1 2026 Revenue YoY (continuing ops)", unit: "%",  tag: "BEAT",  next: "Jul 28, 2026", val: "ACTUAL ~+11% ($3.72B pro forma)", guide: "vs 6-8% FY26 organic cc guide", pos: 0.68 },
    { name: "Ratings Billed Issuance Growth",       unit: "%",  tag: "WATCH", next: "Jul 28, 2026", val: "ACTUAL +14% (Q1 2026)", guide: "guided to decelerate, negative by Q4 2026", pos: 0.52 },
    { name: "Q2 2026 Revenue Guide (ex-Mobility)",  unit: "$B", tag: "WATCH", next: "Jul 28, 2026", val: "TO REPORT",  guide: "first full guide reissued ex-Mobility", pos: 0.50 },
  ],
};
const MARGIN = {
  bear: [
    { name: "Indices Division Growth",              tag: "BEAT",  next: "Jul 28, 2026", pos: 0.75 },
    { name: "Ratings Issuance Pull-Forward Risk",    tag: "WATCH", next: "Ongoing",      pos: 0.40 },
  ],
  base: [
    { name: "Indices Division Growth",              tag: "BEAT",  next: "Jul 28, 2026", pos: 0.75 },
    { name: "Ratings Issuance Pull-Forward Risk",    tag: "WATCH", next: "Ongoing",      pos: 0.40 },
  ],
  bull: [
    { name: "Indices Division Growth",              tag: "BEAT",  next: "Jul 28, 2026", pos: 0.75 },
    { name: "Ratings Issuance Pull-Forward Risk",    tag: "WATCH", next: "Ongoing",      pos: 0.40 },
  ],
};

const KPI_HIST = 3.717; // Q1 2026 pro forma continuing-ops total revenue, $B (ex-Mobility)
const KPI_PROJ = {
  bear:  [3.65, 3.60, 3.40, 3.55],
  base:  [3.75, 3.85, 3.65, 3.95],
  bull:  [3.95, 4.15, 4.10, 4.35],
};

// TRACK RECORD — append newest to end; dashboard keeps last TRACK_WINDOW.
// Bands are RECONSTRUCTED now from each date's real post-earnings price and a
// reasoned forward-P/E regime for that period — not archived in real time.
// Older quarters (pre Feb-2026 crash) carry a richer multiple regime and are
// flagged lower-confidence; the Feb 2026 and Apr 2026 prints are the two most
// documented, highest-confidence entries.
const TRACK_ALL = [
  { q: "Q4 2024", date: "2025-02", post: 540, reaction: "++", bear: [380,425], base: [440,490], bull: [505,555], landed: "bull",      conf: "low" },
  { q: "Q1 2025", date: "2025-04", post: 492, reaction: "+",  bear: [352,400], base: [416,464], bull: [480,528], landed: "base→bull", conf: "low" },
  { q: "Q2 2025", date: "2025-07", post: 551, reaction: "++", bear: [386,437], base: [454,504], bull: [521,571], landed: "bull",      conf: "med" },
  { q: "Q3 2025", date: "2025-10", post: 473, reaction: "-",  bear: [378,430], base: [447,499], bull: [516,568], landed: "base",      conf: "med" },
  { q: "Q4 2025", date: "2026-02", post: 391, reaction: "--", bear: [433,493], base: [512,571], bull: [591,650], landed: "bear",      conf: "high" },
  { q: "Q1 2026", date: "2026-04", post: 433, reaction: "+",  bear: [342,378], base: [396,468], bull: [486,540], landed: "base",      conf: "high" },
];
const TRACK_WINDOW = 6;

// THE PAST — annual fundamentals (Wisesheets: revenue/GM/FCF/EBITDA/net_income/
// invested_capital/total_debt/cash/shares_outstanding, all SEC-sourced, FY2021-2025)
// and ~4.75 years of monthly price history (2021-10 to 2026-07 — the deepest window
// Wisesheets' EOD endpoint returned for SPGI in a single call; shorter than TSM's
// 10-year CSV export, labeled accordingly below, not backfilled from memory).
const PAST_YEARS       = ["2021","2022","2023","2024","2025"];
const PAST_REV         = [8.297, 11.181, 12.497, 14.208, 15.336];
const PAST_GM          = [73.7,  66.4,   66.9,   69.3,   70.2];
const PAST_FCF          = [3.563, 2.514, 3.567, 5.565, 5.456];
const PAST_ROIC         = [28.9,  6.1,    5.1,    7.5,    8.6];
const PAST_EVEBITDA     = [35.6,  20.6,   30.6,   25.8,   24.0];
const PAST_FCF_YIELD    = [2.3,   2.3,    2.6,    3.6,    3.3];
const PAST_CAPEX_REV    = [1.3,   0.9,    1.1,    0.8,    1.3];
const PRICE_M_LABELS = ["2021-10","2021-11","2021-12","2022-01","2022-02","2022-03","2022-04","2022-05","2022-06","2022-07","2022-08","2022-09","2022-10","2022-11","2022-12","2023-01","2023-02","2023-03","2023-04","2023-05","2023-06","2023-07","2023-08","2023-09","2023-10","2023-11","2023-12","2024-01","2024-02","2024-03","2024-04","2024-05","2024-06","2024-07","2024-08","2024-09","2024-10","2024-11","2024-12","2025-01","2025-02","2025-03","2025-04","2025-05","2025-06","2025-07","2025-08","2025-09","2025-10","2025-11","2025-12","2026-01","2026-02","2026-03","2026-04","2026-05","2026-06","2026-07"];
const PRICE_M = [474.16,455.73,471.93,415.22,375.70,410.18,376.50,349.48,337.06,376.93,352.18,305.35,321.25,352.80,334.94,374.94,341.20,344.77,362.58,367.43,400.89,394.51,390.86,365.41,349.31,415.83,440.52,448.35,428.38,425.45,415.83,427.51,446.00,484.73,513.24,516.62,480.36,522.51,498.03,521.41,533.74,508.10,500.05,512.86,527.29,551.10,548.44,486.71,487.21,498.83,522.59,527.79,441.88,425.34,431.23,424.00,407.26,450.84];
const PRICE_M_DD = [0.0,-3.9,-0.5,-12.4,-20.8,-13.5,-20.6,-26.3,-28.9,-20.5,-25.7,-35.6,-32.2,-25.6,-29.4,-20.9,-28.0,-27.3,-23.5,-22.5,-15.5,-16.8,-17.6,-22.9,-26.3,-12.3,-7.1,-5.4,-9.7,-10.3,-12.3,-9.8,-5.9,0.0,0.0,0.0,-7.0,0.0,-4.7,-0.2,0.0,-4.8,-6.3,-3.9,-1.2,0.0,-0.5,-11.7,-11.6,-9.5,-5.2,-4.2,-19.8,-22.8,-21.8,-23.1,-26.1,-18.2];
const PAST_EVENTS = [
  { idx: 4,  label: "IHS Markit Merger Closes", note: "Feb 2022 — the ~$44B all-stock IHS Markit merger closed, nearly doubling annual revenue (FY2021 $8.3B → FY2022 $11.2B) but also diluting gross margin (73.7% → 66.4%) and crushing ROIC (28.9% → 6.1%) as goodwill swamped the invested-capital base. This is genuine inorganic growth, not organic compounding — worth remembering when reading the long-run revenue CAGR on this tab." },
  { idx: 11, label: "Rate-Shock Trough", note: "Sep 2022 — the deepest drawdown in this window (-35.6% from the post-merger high). The Fed's rate-hiking cycle hit debt-issuance volumes directly (Ratings is exposed to bond-issuance activity) at the same time the freshly-merged company was digesting IHS Markit integration and a heavier balance sheet (total debt roughly tripled from FY2021 to FY2022)." },
  { idx: 52, label: "Guidance-Miss Crash", note: "Feb 10-11, 2026 — FY2026 adjusted EPS guidance ($19.40-19.65, then still combined with Mobility) missed the ~$19.96 consensus by a few percent. The stock fell ~17% in a single session and continued to an intraday/closing trough of $390.76 on Feb 11 — a real multiple-compression event, not a revenue miss (Q4 2025 revenue actually beat). The monthly close shown here ($441.88) understates how sharp the actual trough was." },
  { idx: 57, label: "Mobility Spinoff Completes", note: "Jul 1, 2026 — Mobility Global (MBGL) spun off 1:1, leaving SPGI a cleaner four-segment company (Ratings, Market Intelligence, Commodity Insights, Indices). The stock popped from $414.97 (spinoff-day close) toward $450+ as the market began re-rating the simplified remaining business, though it remains well below the ~$540-580 zone the combined entity traded at before the February crash." },
];

const VAL_CONFIG = {
  ntm_eps:              18.46,
  shares_b:              0.2976,
  fcf_ntm_b:              4.85,
  risk_free_pct:          4.55,
  default_discount_pct:  10.0,
  default_terminal_pe:   23,
  dcf_years:              5,
  prior_fy_rev_b:        13.589,   // FY2025 pro forma continuing-ops (ex-Mobility) revenue
  prior_fy_label:       "2025 (pro forma ex-Mobility)",
  pe_trough: 18, pe_bear_hi: 21, pe_normal_lo: 23, pe_normal_hi: 28, pe_bull_lo: 30, pe_peak: 34,
  peers: [
    { t: "SPGI", fpe: 24.4, ev_eb: 24.0, fcf_y: 3.3, note: "Ratings/Indices/data toll-booth, post-Mobility-spinoff" },
    { t: "MCO",  fpe: 27.1, ev_eb: 25.3, fcf_y: 2.9, note: "Same NRSRO ratings duopoly — no cushion, no discount to own history" },
    { t: "MSCI", fpe: 30.4, ev_eb: 26.5, fcf_y: 3.0, note: "Index-embeddedness moat — priced closer to perfection" },
    { t: "VRSK", fpe: 25.8, ev_eb: 19.0, fcf_y: 4.2, note: "Insurance/risk-analytics data moat — the closest 'clean toll-booth' comp" },
  ],
};

const SIGNAL_HELP = {
  "Q1 2026 Revenue YoY (continuing ops)": "Q1 2026 pro forma continuing-operations revenue (excluding Mobility, disclosed in the Jul 6 2026 8-K/A recast) was $3.717B. The ~+11% YoY figure is estimated by applying Mobility's known ~11.4% share of FY2025 combined revenue to Q1 2025's combined total, since the company has not separately disclosed a Q1 2025 continuing-ops figure — treat as a close estimate, not an exact company-reported number.",
  "Ratings Billed Issuance Growth": "Billed issuance is what bond/loan issuers pay S&P Global to rate new debt — the single biggest swing factor in this story. Q1 2026 grew 14% YoY, helped by hyperscaler AI-infrastructure debt and large M&A financing — but management said some of that strength was 'front-end loading of hyperscaler issuance relative to initial expectations' and guided growth to decelerate through the year, turning NEGATIVE in Q4 2026 as easy comps roll off. Whether Q2/Q3 hold up better or worse than that guided path is the whole ballgame.",
  "Q2 2026 Revenue Guide (ex-Mobility)": "Management has not yet issued a formal dollar guide on a continuing-operations (ex-Mobility) basis — that's expected alongside the Jul 28, 2026 Q2 print, the first full quarter reported as a standalone four-segment company. Until then this is the single most important number to watch land.",
  "Indices Division Growth": "S&P Global's highest-margin segment: licensing fees on the S&P 500 and other benchmark indices, paid by every fund and ETF that tracks them — a direct toll on the growth of passive investing AUM, largely decoupled from bond-issuance cycles. Grew 17% YoY in Q1 2026 with double-digit growth across every business line inside it.",
  "Ratings Issuance Pull-Forward Risk": "Shorthand for the single biggest open question in this thesis: was Q1 2026's 14% Ratings-issuance growth a durable new run-rate, or did hyperscaler debt issuance get pulled forward from later quarters (management's own words) — meaning Q2-Q4 borrow against a quarter that already happened rather than adding fresh growth on top of it? No acute red flag yet, but this doesn't show up cleanly in any single quarterly number until the deceleration either matches or beats the guided schedule.",
};
const TAG_HELP = {
  BEAT: "doing better than expected — a good sign.",
  MATCH: "roughly in line with expectations — steady, no surprises.",
  MISS: "falling short of expectations — a worry.",
  WATCH: "not decided yet — keep an eye on it.",
};

const THESIS_ITEMS = [
  { key: "revenueGuide",    label: "Continuing-ops revenue landing within the 6-8% organic cc growth guide", note: "First ex-Mobility guide reissued Jul 28, 2026" },
  { key: "ratingsIssuance", label: "Ratings billed issuance decelerating on schedule, not faster",             note: "Guided negative by Q4 2026 — the pull-forward test" },
  { key: "indicesGrowth",   label: "Indices division holding double-digit growth",                             note: "The highest-margin, most durable-moat segment" },
  { key: "capitalReturn",   label: "Buyback pace continuing to support EPS growth",                            note: "$1.0B repurchased in Q1 2026 alone" },
];
const PRICE_ZONES = [
  { label: "BEAR", lo: 330, hi: 390, mid: 360, color: "#f1564b", action: "Exit / reduce if thesis also breaking" },
  { label: "BASE", lo: 425, hi: 515, mid: 470, color: "#e0a83b", action: "Small add OK if thesis intact" },
  { label: "BULL", lo: 555, hi: 630, mid: 592, color: "#3fd07a", action: "Let it ride — don't chase" },
];

// ── Chart geometry / axis ranges (per-stock: depends on price scale) ─────────
const GEOM = {
  priceMin: 280, priceMax: 680,
  fanGrid: [600, 500, 400, 300],
  fanYears: ["2025", "2026", "2027"],
  trackMin: 280, trackMax: 680,
  trackGrid: [650, 550, 450, 350, 250],
  kpiMin: 3.0, kpiMax: 4.6,
  visLo: 300, visHi: 650,
  nowZoneLo: 425, nowZoneHi: 490,
};

/* ── TEXT — every company-specific narrative/tooltip the engine renders. ──────
   Values are strings, HTML strings (rendered with dangerouslySetInnerHTML), or
   template functions the engine calls with computed values. If it mentions the
   company, a quarter, a guide number, or an event, it belongs HERE, not in the
   engine — that rule is what makes the engine safely reusable across stocks. */
const TEXT = {
  // header / footer
  priceTipLive: (px, at, asOf) => `Live quote: $${px} (fetched ${at}). The price is real-time, but the scenario bands and EPS are still as of ${asOf} — only the price-derived figures (scenario returns, P/E, band position) update live.`,
  priceTipStatic: (px, asOf, liveEnabled) => `$${px} as of ${asOf} — ${liveEnabled ? "live fetch unavailable (offline or blocked), using the saved price" : "static price (live fetch disabled)"}. Next earnings: Q2 FY2026 (Jul 28, 2026) — the first full quarter reported as a standalone company ex-Mobility.`,
  footerDisclaimer: (asOf) => `Illustrative scenario framing built on public consensus & estimates as of ${asOf} — not a prediction and not financial advice. Price ranges are scenario mid-bands; KPI markers are positional, not literal. Valuation ruler: forward continuing-ops adjusted EPS × P/E multiple. Data inputs will move with every print, especially the Jul 28, 2026 first ex-Mobility guide. Next earnings: Q2 FY2026 (~Jul 28, 2026).`,

  // fan chart
  fanHistory: "The solid white line is SPGI's actual price since Q4 2024. The run from ~$540 (post-Q4'24-earnings high) through the choppy 2025 range, the sharp Feb 2026 guidance-miss crash to a $390.76 trough, and the recovery back above $450 following the Jul 1, 2026 Mobility spinoff.",
  fanNow: (px) => `SPGI trades around $${px} right now — recovering from a $390.76 trough (Feb 11, 2026, after FY2026 adjusted EPS guidance missed consensus) and simplified by the Jul 1, 2026 Mobility Global (MBGL) spinoff. Q1 2026 continuing-ops revenue was $3.717B (+~11% YoY est.), and the first full ex-Mobility guide is due Jul 28, 2026. Everything left of this dot is history; everything right is forecast.`,
  fanPastDot: (q, p) => `At the end of ${q}, SPGI was around $${p}.`,

  // scenario selector
  segmentedExplain: {
    bear: ["The pessimistic scenario", "Click to see what SPGI looks like if Q1 2026's Ratings-issuance strength really was pulled forward — Q2/Q3 miss the guided deceleration, or refinancing activity actually rolls over, and the multiple retests the ~18-21x trough zone seen in February 2026. Price would likely fall to the $330–390 range."],
    base: ["The most-likely scenario", "Click for the base view — the Jul 28, 2026 print reaffirms guidance on an ex-Mobility basis, Ratings decelerates roughly on the schedule management already gave, Indices keeps growing double-digit, and the multiple holds its normal 23-28x band. Price recovers toward the $425–515 range."],
    bull: ["The optimistic scenario", "Click to see the upside — Q2/Q3 2026 beat the guided Ratings deceleration, Indices keeps compounding, and the market re-rates SPGI's multiple back toward the ~30-34x it traded at before the February crash on confirmation the post-spinoff story is cleaner, not just smaller. Price could reach $555–630."],
  },

  // KPI column
  kpiBaseline: (val) => `This is the most recent real number: SPGI's Q1 2026 pro forma continuing-operations (ex-Mobility) revenue was $${val}B, roughly +11% YoY. The bars to the right are scenario forecasts for where it goes next.`,
  kpiForecast: (label, val) => `In this scenario, quarterly continuing-ops revenue reaches ~$${val}B by ${label}. Management guides FY2026 organic constant-currency growth of 6-8% — taller bar = faster growth holding up better than the guided Ratings deceleration.`,

  // reversion clock
  reversion: {
    header: "REVERSION CLOCK · FEB 2026 GUIDANCE-MISS CRASH",
    timeTip: "On Feb 10, 2026, FY2026 adjusted EPS guidance ($19.40-19.65, then still combined with Mobility) missed the ~$19.96 consensus by a few percent. The stock fell ~17% that session and continued to a $390.76 closing trough the next day — a real multiple-compression event, since Q4 2025 revenue itself actually beat. This bar shows how far along the recovery is vs. the time it took to durably reclaim the base floor.",
    priceTip: (trough, baseFloor, now) => `Stock bottomed at $${trough} on Feb 11, 2026, and needed to durably reclaim $${baseFloor} to re-enter the base band. It round-tripped below that floor twice more (March and again in late May-June, amid Mobility-spinoff-execution uncertainty) before holding above it from Jul 2, 2026 on. At $${now} it sits solidly inside the base band.`,
    footerHtml: (baseFloor, precedentDays, now) => `The Feb 2026 crash was a guidance/multiple-compression shock, not a revenue miss — Q4 2025 revenue actually beat. Price durably reclaimed the $${baseFloor} base floor within ${precedentDays} days of the trough, coinciding with the Jul 1, 2026 Mobility spinoff completing cleanly. The next dislocation risk to watch is the Jul 28, 2026 first-ex-Mobility guide — not a repeat of February's shock, but the same playbook applies: <span style="color:#e0a83b;font-weight:700">has the thesis actually broken, or is this fear?</span>`,
  },

  // track record
  track: {
    lastDot: (post, nowPx) => `After Q1 2026 earnings (Apr 28, 2026), SPGI traded around $${post} — landing inside the (post-crash-regime) base band on a continuing-ops beat, still well below the pre-February-crash highs. Price sits at $${nowPx} today, boosted by the clean Jul 1, 2026 Mobility spinoff. Next dot: Q2 2026 earnings (Jul 28, 2026) — the first full quarter reported ex-Mobility.`,
    pastDot: (q, post) => `After ${q} earnings, SPGI actually traded around $${post}. Compare this dot to the colored bars behind it to see if the predicted range was right.`,
    readoutHtml: (hits, n, nowPx) => `Price has tracked <span style="color:#3fd07a;font-weight:700">base-or-better in ${hits} of ${n} quarters</span> in this window. The exception is instructive: Q4 2025 (reported Feb 10, 2026) landed well BELOW even the reconstructed bear band — a genuine guidance-miss shock, the deepest breach in this table. Q1 2026 (Apr 2026) recovered to a base-band landing on a continuing-ops beat. Price today sits at $${nowPx}, inside the current base band. Next directional catalyst: <span style="color:#e0a83b;font-weight:700">Q2 2026 earnings (Jul 28, 2026)</span> — the first full guide reissued ex-Mobility.`,
    footnote: "⚠ Bands are reconstructed now, anchored to each date's forward EPS & multiple regime — not archived in real time. Treat levels as directional, especially the \"low-conf\" quarters (2025 and earlier, before the Feb 2026 regime shift and Jul 2026 Mobility spinoff both changed what 'normal' means for this stock).",
  },

  // THE CURRENT tab
  current: {
    statusNarrative: {
      broken: "Multiple signals missed. Thesis is under pressure — review the kill-switch criteria.",
      watch:  "Revenue beat but Ratings issuance growth decelerated faster than guided, or the Jul 28, 2026 ex-Mobility guide disappointed. Core thesis tracking — not broken, but watch closely.",
      intact: "All key signals tracking as expected. Q1 2026 beat on a continuing-ops basis, the Mobility spinoff completed cleanly on schedule, and Ratings issuance growth is decelerating in line with (not faster than) management's own guided path.",
    },
    panelTipStory: "Checks whether the original reasons to own SPGI are playing out. Counts signals from the Q1 2026 print and the Jul 28, 2026 first ex-Mobility guide — continuing-ops revenue growth, Ratings billed issuance, Indices growth. 0-1 miss = thesis intact. 2 misses = watch. 3+ = exit. Click to see KPI bars and kill-switch.",
    watchChipHtml: `🔑 WATCH: Q2 2026 first ex-Mobility guide · <span style="color:#e0a83b;font-weight:700">Jul 28, 2026</span>`,
    exitChipHtml: `⚠ EXIT IF: Ratings issuance turns negative BEFORE guided Q4 2026, or 2 straight cc-revenue misses`,
    verdictBody: {
      broken:     (px) => `SPGI at $${px}: kill-switch criteria met. Price position is irrelevant — signals say the Ratings pull-forward risk has materialized. The question is not whether to add; it is how much to reduce.`,
      watchBelow: (px) => `SPGI at $${px} sits below the base floor but signals are mixed. Price is attractive, but adding into a weakening thesis is the wrong sequence. Wait for the Jul 28, 2026 print to confirm or deny the pattern before deploying capital.`,
      below:      (px) => `SPGI at $${px} sits below the base floor with the thesis intact — Q1 2026 beat on a continuing-ops basis, the Mobility spinoff executed cleanly, and Ratings issuance is decelerating on (not faster than) the guided schedule. The market is still pricing in some residual uncertainty from the February guidance-miss crash and the spinoff transition; the fundamentals say this is sentiment/transition-uncertainty, not demand destruction.`,
      inBase:     (px, statusWord) => `SPGI at $${px} is inside the base range. Thesis ${statusWord} and price is fair — a real discount to both its own 5-year forward-P/E history (~34x peak) and peer medians (MCO ~27x, MSCI ~30x). Watch the Jul 28, 2026 print — the first full guide reissued ex-Mobility, and the real test of whether Q1's Ratings strength was pulled forward.`,
      above:      (px) => `SPGI at $${px} is above the base ceiling. The bull case — Ratings issuance beating the guided deceleration and a multiple re-rate back toward 30x+ — needs to play out to justify entry at this level. If already in, hold. If adding, wait for a pullback toward the base floor.`,
    },
    kpiTitle: "Continuing-Ops Revenue",
    kpiSub: "$B quarterly, ex-Mobility · HIGHER BETTER",
    kpiMeasures: "Total quarterly revenue across the four remaining segments (Ratings, Market Intelligence, Commodity Insights, Indices), driven mostly by bond/loan issuance volume (Ratings), index-licensing AUM growth (Indices), and data/analytics subscriptions (Market Intelligence). Guided to 6-8% organic constant-currency growth for FY2026, with Ratings specifically guided to decelerate through the year.",
    kpiRequires: {
      bull: "Revenue beats the 6-8% organic cc guide every quarter, with Ratings issuance growth beating its own guided deceleration path — confirming Q1's strength was durable, not pulled forward.",
      base: "Revenue lands inside the 6-8% guide each quarter and Ratings decelerates roughly as guided (negative by Q4 2026), in line with what management has already told the market.",
      bear: "Revenue misses the guide, or Ratings issuance goes negative BEFORE the guided Q4 2026 timing — confirming Q1's strength really was pulled forward from later quarters.",
    },
    group1Title: "Revenue &amp; Issuance Momentum",
    group2Title: "Segment Mix &amp; Capital Return",
    killSwitch: "Ratings billed issuance growth turns negative BEFORE the guided Q4 2026 deceleration (confirming pull-forward, not just a normal cyclical slowdown), or two straight quarters of continuing-ops organic cc revenue missing the 6-8% guide, or a credible NRSRO reform / new-entrant threat to the ratings duopoly — exit / reduce. That is demand destruction or policy risk, not noise.",
    priceBanner: {
      below:  (px, baseLo) => `At $${px}, price is $${baseLo - px} below the base floor. Market is pricing in some residual fear from the February crash and spinoff-transition uncertainty — not a fundamentals problem, given the Q1 continuing-ops beat. Historically the window patient buyers use.`,
      inBase: (px) => `At $${px}, price is inside the base range. Fair value — not a discount, not expensive.`,
      above:  (px, baseHi) => `At $${px}, price is $${px - baseHi} above the base ceiling. The bull thesis needs to play out in full.`,
    },
    moodBanner: (currentPE, loPE, hiPE) => `At ${currentPE}× forward P/E, the market is pricing in the 6-8% organic cc growth guide holding and Ratings decelerating roughly as promised — the multiple sits mid-band (${loPE}-${hiPE}×), a real discount to the ~30-34× the stock traded at before the February 2026 guidance-miss crash.`,
    cagrNotes: {
      low:  "Low bar — not priced for perfection. Even the guided Ratings deceleration playing out exactly as management said justifies the price.",
      mid:  "Moderate bar — requires the 6-8% organic cc growth guide to hold and Indices to keep compounding double-digit.",
      high: "High bar — requires Ratings issuance to beat its own guided deceleration, confirming Q1's strength was not pulled forward.",
    },
    fy26CardTip: (fy26) => `Adding Q1 2026's continuing-ops actual to the base-case Q2-Q4 2026 projections gives a full-year run rate of roughly $${fy26}B, up from $13.589B pro forma in 2025 — inside management's own 6-8% organic cc revenue growth guide. That's what the base case — and roughly today's price — already assumes. The bull case requires Ratings to hold up better than its own guided deceleration.`,
    fy26CardHtml: (fy26, growthPct) => `Q1 2026 continuing-ops actual plus base-case Q2-Q4 projections sum to roughly <span style="color:var(--blue-soft);font-weight:700">$${fy26}B</span> for full-year 2026 (ex-Mobility) — the growth path today's price already assumes. 2025 pro forma continuing-ops revenue was <span style="color:#3fd07a">$13.589B</span>, so this implies <em>~${growthPct}%</em> YoY growth.`,
    peerCommentary: (currentPE) => `At ${currentPE}× NTM P/E, SPGI trades at a discount to both MCO (~27x, the same NRSRO ratings duopoly, but with no discount to its own history) and MSCI (~30x, an index-embeddedness moat priced closer to perfection) — despite sharing the same regulatory-bottleneck structure as MCO. VRSK (~26x forward, the closest 'clean toll-booth' comp) trades at a similar multiple with a lower EV/EBITDA, a useful sanity check that SPGI's discount is real and not just an SPGI-specific problem the whole findata/ratings group shares.`,
  },

  // THE FUTURE tab
  future: {
    scenarioTips: {
      bear: "Triggered by: Ratings issuance growth turning negative before the guided Q4 2026 timing, or two straight cc-revenue misses. Multiple compresses toward the 18-21× trough zone seen in February 2026. Note: at current price, bear downside is larger than bull upside.",
      base: (loPE, hiPE) => `Continuing-ops revenue lands within the 6-8% organic cc guide each quarter; Ratings decelerates roughly on the schedule management already gave. P/E holds in the normal ${loPE}-${hiPE}× band. Modestly positive return from here as the stock re-tests the $500s.`,
      bull: (currentPE) => `Revenue beats the guide and Ratings issuance holds up better than its own guided deceleration; Indices keeps compounding double-digit. Multiple re-rates from ~${currentPE}× toward the bull zone, closing the gap to the bull target.`,
    },
    downsideChevronTip: "Kill-switch: Ratings issuance turns negative before the guided Q4 2026 timing, or two straight cc-revenue misses = exit / reduce.",
    dislocEventName: "the Feb 2026 guidance-miss crash",
    dislocLabel: "SINCE FEB 2026 GUIDANCE-MISS LOW",
    bearPriceTip: (bearMid, bearLo, bearHi, peTrough, peBearHi) => `$${bearMid} is the midpoint of the bear case range ($${bearLo}-$${bearHi}). This assumes Ratings issuance growth turns negative ahead of schedule or cc-revenue misses the guide twice running, and the multiple compresses toward the ${peTrough}-${peBearHi}× trough zone seen in February 2026. The kill-switch is Ratings turning negative before the guided Q4 timing — if it triggers, do not average down.`,
    killSwitchTip: "A kill-switch is a pre-committed exit rule you set BEFORE you own the position — when you are thinking clearly. If Ratings billed issuance growth turns negative BEFORE the guided Q4 2026 deceleration, or continuing-ops cc revenue misses the 6-8% guide for two straight quarters, the thesis is broken: that's confirmation the Q1 2026 strength was pulled forward, not durable growth. Do not average down into a broken thesis. No debate, no rationalisation. Exit.",
    killSwitchTipNote: "Ratings turns negative early, or two straight cc-revenue misses. Either one. No debate.",
    killSwitchHtml: `<strong style="color:var(--title)">Ratings billed issuance growth turning negative BEFORE the guided Q4 2026 deceleration, or two consecutive quarters missing the 6-8% organic cc revenue guide</strong> → exit or reduce. No debate. Do not average down into a broken thesis.`,
    nextCheck: "Next check: Q2 2026 earnings (Jul 28, 2026) — first full guide ex-Mobility",
    downsideFootnote: (px, peTrough, peBearHi) => `Bear case scenario: Ratings pull-forward confirmed or cc-revenue guide missed twice. Assumes a multiple compression toward ${peTrough}-${peBearHi}× on roughly flat-to-down EPS growth. Position loss is illustrative at $${px} entry.`,
    multipleSummary: (peNow, loPE, hiPE) => `At ~${peNow}× NTM P/E, SPGI sits mid-way inside its historical normal range (${loPE}-${hiPE}×) — a real discount to the ~30-34× it traded at before the February 2026 guidance-miss crash, and to peer medians (MCO ~27x, MSCI ~30x).`,
    peBarTipSuffix: "Uses continuing-ops (ex-Mobility) adjusted consensus EPS, the same basis management itself guides on — comparable like-for-like once the Jul 28, 2026 call issues formal ex-Mobility guidance.",
    deepValueZoneNote: "Historically cheap for this name. Last seen briefly at the Feb 2026 guidance-miss trough. A real entry opportunity if the thesis is intact.",
    dislocPrecedent: (baseFloor) => `Historical precedent: the Feb 2026 guidance-miss crash resolved within the 141-day window it took to durably reclaim the base floor, once the fundamentals (continuing-ops beat, clean spinoff execution) confirmed the crash was a multiple event, not a demand event. Base floor: $${baseFloor}.`,
    regretHtml: (currentPE) => `Q2 2026 revenue and Ratings issuance <strong style="color:#3fd07a">materially beat the reissued ex-Mobility guide</strong> AND full-year guidance is raised. That would confirm Q1's Ratings strength was a durable new run-rate, not pull-forward, re-rate the stock from ~${currentPE}× toward the bull zone, and close today's entry window.`,
    regretTip: "Charlie Munger's inversion: instead of asking 'why should I buy?', ask 'what would I have to believe happened, in hindsight, to wish I had bought more?' If Q2 2026 beats the reissued guide and full-year guidance gets raised, today's entry window will close fast. This question is not about FOMO — it is about sizing correctly for your conviction.",
    chips: [
      { label: "KILL-SWITCH: RATINGS TURNS NEGATIVE EARLY → EXIT", col: "#f1564b" },
      { label: "REGRET IF: Q2 BEATS + FY GUIDE RAISED",            col: "#3fd07a" },
      { label: "NEXT CHECK: JUL 28, 2026 EARNINGS",                col: "#2f6dff" },
    ],
    signalFootnote: (ntmEps) => `P/E uses continuing-ops (ex-Mobility) adjusted NTM EPS $${ntmEps} — the basis management itself guides and reports on.`,
  },

  // THE PAST tab
  past: {
    cardTips: {
      durability: (revCagrPct) => `Looks at ~5 years of Revenue, Gross Margin, and Free Cash Flow. We want upward trends that hold through cycles — not spike-and-crash. SPGI's revenue compounded at ~${revCagrPct}% CAGR since 2021, but that includes a genuine step-change from the Feb 2022 IHS Markit merger (FY2021 $8.3B → FY2022 $11.2B) — this is NOT purely organic growth the way it would be for a pure compounder, and the merger initially diluted gross margin before it recovered.`,
      value: (latestROIC) => `ROIC (Return on Invested Capital) measures how efficiently management deploys capital. Above WACC (~8-9% for an asset-light data/ratings business) = value creation. Below = value destruction. SPGI's ROIC cratered from 28.9% (2021, pre-merger) to 6.1% (2022) when the IHS Markit deal swamped the invested-capital base with goodwill, and has only slowly recovered to ${latestROIC}% (2025) — still well below the pre-merger level. This is the honest soft spot in the durability story: the merger diluted capital efficiency and it has not fully earned its way back yet.`,
      capex: (peakCapex, latestCapex, latestFCF) => `Capex as a % of revenue shows how much of every dollar gets reinvested before cash reaches shareholders. SPGI is extremely capital-light — capex/revenue has stayed under ${peakCapex}% every year in this window (vs. 30-50%+ for a capital-intensive business like a foundry), because the product is data, ratings, and index licenses, not physical infrastructure. Nearly all of FCF ($${latestFCF}B in 2025) is available for buybacks and dividends rather than reinvestment.`,
      mood: (evNow, evAvg) => `EV/EBITDA vs its own 5-year average tells you whether the market is paying a premium or discount for this business. Current EV/EBITDA of ${evNow}× sits below the 5-year average of ~${evAvg}× — the market is pricing in some residual caution after the February 2026 guidance-miss crash and the Mobility-spinoff transition, not obvious euphoria.`,
    },
    stats: [
      { html: `Revenue <span style="color:#3fd07a;font-weight:700">$8.3B → $15.3B</span> (5Y)`, tipTitle: "Revenue (5-year)", tipBody: "SPGI grew annual revenue from $8.3B (2021) to $15.3B (2025) — but roughly a third of that step-up came from the Feb 2022 IHS Markit merger (FY2021→FY2022 alone was +35%), not organic growth. Post-merger organic growth has been more modest, in the mid-single-digit to low-double-digit range." },
      { html: `FCF <span style="color:#3fd07a;font-weight:700">$3.6B → $5.5B</span> (5Y)`, tipTitle: "Free Cash Flow (5-year)", tipBody: "FCF grew from $3.6B (2021) to $5.5B (2025) — real growth, but not a straight line: FCF actually fell to $2.5B in 2022 as the IHS Markit integration and a heavier, more-indebted balance sheet weighed on cash generation before recovering." },
      { html: `Price <span style="color:#3fd07a;font-weight:700">-4.9%</span> (Oct 2021 → now)`, tipTitle: "Total price return (window shown)", tipBody: "From $474.16 (Oct 2021) to $450.84 today = roughly flat to slightly down over ~4.75 years, despite real fundamental growth — reflecting a genuine multiple de-rating (EV/EBITDA fell from ~35.6x to ~24.0x) as rates rose, the IHS Markit integration diluted returns on capital, and the Feb 2026 guidance miss compressed the multiple again. This is a re-rating story as much as a growth story." },
    ],
    verdictBody: "SPGI's 5-year fundamental story is real but not the clean organic compounding story TSM or a pure-play toll-booth business would tell: the Feb 2022 IHS Markit merger nearly doubled revenue overnight but diluted gross margin and crushed ROIC (28.9% → 6.1%), and capital efficiency has only slowly recovered to 8.6% by 2025 — still well below the pre-merger level. What HAS held up is the capital-light model itself (capex/revenue under 1.5% every year) and steady FCF growth. The multiple has genuinely de-rated over this window (EV/EBITDA ~35.6x → ~24.0x) — price is roughly flat over 4.75 years despite revenue growing 85%, which is the honest tension this thesis has to resolve: is today's lower multiple a real opportunity, or a market correctly pricing in that the merger-era growth premium was never fully earned?",
    banners: {
      durability: (revCagrPct, rev0, rev9, gmDelta, latestGM, fcf0, latestFCF) => `Revenue compounded at ~${revCagrPct}% annually from $${rev0}B (2021) to $${rev9}B (2025) — but roughly a third of the total step-up is the Feb 2022 IHS Markit merger, not organic growth. Gross margin fell ${Math.abs(gmDelta)} points initially on merger dilution before recovering to ${latestGM}%. FCF grew from $${fcf0}B to $${latestFCF}B, but dipped to $2.5B in 2022 during integration.`,
      value: (latestROIC) => `ROIC of ${latestROIC}% (2025) sits above a typical WACC of ~8-9% for this business, meaning capital deployed today creates value — but it is a fraction of the 28.9% SPGI earned pre-merger (2021). The Feb 2022 IHS Markit deal added ~$40B+ of goodwill to the invested-capital base without a matching step-up in earnings, and five years later returns on that capital still have not fully recovered.`,
      capex: (latestCapex, peakCapex, latestFCF, fy26Guide) => `Capex/revenue of ${latestCapex}% (2025) has never exceeded ${peakCapex}% in this window — SPGI is a genuinely capital-light business, unlike a foundry or infrastructure name. FCF hit $${latestFCF}B in 2025 with almost none of it needed for reinvestment, funding the buyback pace ($1.0B in Q1 2026 alone) that's now doing real work for EPS growth.`,
      mood: (evNow, evAvg) => `EV/EBITDA of ${evNow}× sits below the 5-year average of ${evAvg}× — a genuine de-rating, not a re-rating. The multiple peaked near 35.6× in late 2021 (pre-merger, pre-rate-hike-cycle euphoria) and has structurally reset lower since, most recently compressing further on the February 2026 guidance miss. Whether today's lower multiple is a real discount or a correctly-priced-in slower growth/lower-ROIC regime is the open question this thesis has to answer.`,
    },
    revAnnotationsHtml: `<span>2022: <span style="color:var(--tx3)">$11.2B</span> (IHS Markit merger closes)</span><span>2025: <span style="color:var(--tx3)">$15.3B</span> (combined co., pre-Mobility-spinoff)</span>`,
    roicNote: "Green >15% · Amber 5-15% · Red <5% — SPGI dropped out of green in 2022 (merger) and has not fully returned",
    fcfYieldNote: "Rising yield 2021→2024 = FCF growing faster than the multiple; 2025's small dip reflects the multiple firming, not weaker cash generation.",
    capexAnnotationsHtml: `<span>Peak: <span style="color:#e0a83b">1.3%</span> (2021 &amp; 2025)</span><span>Trough: <span style="color:#3fd07a">0.8%</span> (2024)</span>`,
    footnotes: {
      durability: "The 2021→2022 revenue jump (+35%) is the IHS Markit merger closing, not organic acceleration — treat pre/post-2022 growth rates as two different regimes, not one continuous trend. Gross margin dipped from 73.7% (2021) to 66.4% (2022) as the newly-combined lower-margin IHS Markit businesses diluted the mix, then recovered to 70.2% by 2025 as integration synergies and mix shift (more Indices, less legacy Mobility) took hold.",
      value: "ROIC has never returned to its pre-merger 2021 level (28.9%) in the five years since — it bottomed at 5.1% in 2023 and sits at 8.6% in 2025. This is the honest soft spot in the SPGI story: a threat (competitive pressure, the need to build data/analytics scale) explained the IHS Markit acquisition, but results — a full ROIC recovery — have not yet fully justified it, five years on. Whether the Mobility spinoff (shedding a lower-margin, more cyclical unit) accelerates that recovery is worth tracking explicitly at each future touch.",
      capex: "Capex/revenue has stayed in a tight 0.8-1.3% band across this entire window — there is no capex supercycle here the way there is for TSM or an AI-infrastructure name. The kill-switch for this panel would be capex/revenue climbing meaningfully (e.g., a major new data-center or AI-infrastructure buildout for the data/analytics business) without a matching FCF increase — nothing like that is visible yet.",
      mood: "The scenario bands on the other tabs use forward P/E on continuing-ops adjusted EPS (the basis management itself guides on), not EV/EBITDA — EV/EBITDA is shown here purely to track cross-cycle mood, since it's capital-structure-neutral and lets the pre/post-IHS-Markit-merger leverage change be compared apples-to-apples. The multiple's structural de-rating from ~35.6× (2021) to ~24.0× (2025) is real and has two separate causes: the broader 2022 rate-shock repricing of long-duration growth stocks, and SPGI-specific ROIC dilution from the merger — worth distinguishing from the macro-only story the other data/ratings peers (MCO, MSCI) would tell about the same period.",
    },
    priceChartTitle: "SPGI PRICE · MONTHLY · OCT 2021-JUL 2026",
    priceChartSub: "$ per share · dashed lines = key events · ~4.75-year window (deepest single-call Wisesheets EOD history for this ticker)",
    priceNowTip: (px, isATH) => `$${px} — where SPGI trades today, ${isATH ? "also the highest monthly close in this window" : "off the all-time high shown in this window"}. The chart shows the Feb 2022 IHS Markit merger, the 2022 rate-shock drawdown (-35.6%), a long 2023-2025 grind back toward highs, the sharp Feb 2026 guidance-miss crash, and the recovery following the Jul 2026 Mobility spinoff.`,
    ddTip: (minDD) => `${minDD}% — the deepest drop from a prior all-time high in this window. This occurred in Sep 2022, as the Fed's rate-hiking cycle hit debt-issuance-exposed Ratings revenue at the same time the freshly-merged company was carrying a much heavier debt load post-IHS-Markit. Drawdown charts help you visualize what holding through a bad period actually felt like.`,
    ddAnnotationsHtml: `<span>Max drawdown: <span style="color:#f1564b">-35.6%</span> (Sep 2022, rate-shock + merger leverage)</span><span>Current: <span style="color:#e0a83b">-18.2%</span> from window ATH</span>`,
  },
};
