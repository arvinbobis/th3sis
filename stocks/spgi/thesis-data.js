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
   ║   TOUCH (2026-08-01): Q2 FY2026 (reported Jul 28, 2026) — the first      ║
   ║   full quarter and first formal guide reissued ex-Mobility. Revenue      ║
   ║   beat and organic cc guide was REAFFIRMED/RAISED (Ratings, Indices),    ║
   ║   but adjusted EPS guide ($17.50-17.75) landed below prior consensus —   ║
   ║   driven by Energy (Iran-conflict fallout) and Market Intelligence       ║
   ║   (elongated AI-contract sales cycles), NOT the Ratings pull-forward     ║
   ║   risk this thesis was built to watch (issuance actually ACCELERATED    ║
   ║   to +25% from Q1's +14%). See CASES for the full audit.                ║
   ╚══════════════════════════════════════════════════════════════════════════╝ */

const TICKER_META = { ticker: "SPGI", exchange: "NYSE", company: "S&P Global Inc." };
const AS_OF_DATE = "2026-08-01";

// Most recent material dislocation — the Feb 10-11, 2026 guidance-miss crash
const DISLOCATION_DATE = "2026-02-10";
const REVERSION_TROUGH = 390.76;      // 2026-02-11 closing trough (real EOD print)
const REVERSION_BASEFLOOR = 425;      // base-case band floor (see PRICE_ZONES)
const REVERSION_PRECEDENT_DAYS = 141; // 2026-02-11 trough to 2026-07-02 durable reclaim of the base floor

// THESIS_HISTORY — append-only archive of the full CASES set as it stood at each
// touch, captured BEFORE that touch's Layer-2 audit rewrites it. This is the
// build-time (2026-07-18) vintage, archived here before the 2026-08-01 Q2 FY2026
// audit rewrote CASES below. Never edit a past entry.
const THESIS_HISTORY = [
  {
    asOf: "2026-07-18", quarter: "Q1 FY2026 (pre-Q2 print build touch)",
    cases: {
    bear: {
      target12: "$330 — $390",
      op: "SPGI trades at $450.84 heading into its first full quarter as a standalone four-segment company (Ratings, Market Intelligence, Commodity Insights, Indices) after spinning off Mobility on Jul 1, 2026. The bear case starts from something the company itself has already disclosed: Q1 2026's 14% Ratings-issuance growth was partly 'front-end loading of hyperscaler issuance relative to initial expectations' — a real, management-sourced pull-forward signal — and guidance already calls for Ratings growth to decelerate through the year and turn NEGATIVE in Q4 2026 as easy comps roll off. The Feb 10, 2026 crash (stock fell ~17% in a session, continuing to an intraday/closing trough of $390.76 the next day) showed how sharply the multiple can compress on a guide that missed consensus by only a few percent — proof the market prices this as a growth compounder, not a value stock, and will punish any confirmation that Q1's issuance strength was pulled forward rather than a new run-rate. If Q2/Q3 print soft Ratings growth even within the guided deceleration, or refinancing/new-issue activity actually rolls over (management's own stated 'biggest current risk'), the multiple could retest the ~18-21x trough zone seen in February.",
      breaks: "Two straight quarters where continuing-ops organic constant-currency revenue growth misses the low end of the 6-8% FY2026 guide, or Ratings billed issuance goes negative BEFORE the guided Q4 2026 timing — confirming Q1's front-end-loaded hyperscaler issuance was masking a real slowdown, not just pulling a normal quarter forward.",
      requires01: "Q2 2026 print (Jul 28, 2026) shows Ratings growth decelerating faster than guided, or continuing-ops revenue misses the 6-8% organic cc guide",
      requires02: "Refinancing/new-issue bond activity visibly slows (the risk management itself flagged on the Q1 call), or a credible NRSRO reform / new-entrant threat emerges",
    },
    base: {
      target12: "$425 — $515",
      op: "SPGI at $450.84 sits mid-band on a forward P/E of ~24.4x (on $18.46 FY2026 continuing-ops consensus EPS) — a real discount to both its own 5-year forward-multiple range (which peaked near 34x in mid-2025) and to peer medians (MCO ~27x, MSCI ~30x, VRSK ~26x). Q1 2026 delivered a genuine beat on a continuing-ops basis (pro forma revenue $3.717B, diluted EPS $4.48, roughly +11% YoY on a like-for-like continuing-ops estimate), management completed the Mobility spinoff cleanly and on schedule Jul 1, and $1.0B of buybacks in a single quarter show real capital-return discipline funding EPS growth independent of revenue. The base case simply assumes the 6-8% organic constant-currency growth guide holds and Ratings decelerates roughly as management has already told the market it will — nothing more optimistic than what's already been disclosed. Most likely path: the Jul 28 print reaffirms guidance on an ex-Mobility basis, the multiple holds in its normal 23-28x band, and the stock re-tests the $500s on earnings growth rather than needing further multiple expansion.",
      breaks: "Management cuts full-year 2026 organic cc revenue or adjusted EPS guidance when it reissues on an ex-Mobility basis (Jul 28, 2026) — the opposite of a clean transition.",
      requires01: "Q2 2026 continuing-ops revenue and EPS land within/near the reissued ex-Mobility guide",
      requires02: "Ratings growth decelerates roughly on the guided schedule (not faster); Indices and Market Intelligence keep growing double-digit / high-single-digit respectively",
    },
    bull: {
      target12: "$555 — $630",
      op: "The bull case is that the Mobility spinoff did what management said it would: leave a cleaner, higher-margin, more toll-booth-like four-segment company — and that the market re-rates SPGI back toward the ~30-34x forward multiple it traded at before the February 2026 guidance-miss panic, not because the growth story changed but because the 'what does SPGI look like without Mobility' uncertainty resolves in the company's favor. Indices grew 17% in Q1 2026 with double-digit growth across every business line inside it — the highest-margin, most durable-moat segment (S&P 500 licensing, a direct toll on passive-investing AUM growth) doing the most convincing work. If Ratings issuance strength proves NOT to be pull-forward — Q2/Q3 hold up better than the guided deceleration, refinancing activity stays robust despite only one expected 2026 rate cut — combined with continued buyback-driven EPS growth, the multiple has real room to re-rate back toward its own recent highs.",
      breaks: "Q2 2026 (Jul 28) or Q3 2026 misses the reissued ex-Mobility guide, confirming the Q1 Ratings strength really was pulled forward rather than a new run-rate — or a new NRSRO/ratings-duopoly regulatory threat emerges.",
      requires01: "Ratings billed issuance growth beats the guided deceleration path (stays positive and strong into Q3/Q4 2026, not just Q1-Q2)",
      requires02: "Indices division sustains double-digit growth and the market re-rates SPGI's multiple back toward 30x+ on confirmation the standalone story is cleaner, not just smaller",
    },
    },
  },
];

const CASES = {
  bear: {
    key: "bear", label: "BEAR", accent: "#f1564b", glow: "rgba(241,86,75,0.45)",
    target12: "$315 — $370",
    op: "SPGI trades at $411.93 after Q2 2026 — the first full quarter reported ex-Mobility — delivered a real, if narrower, disappointment: adjusted EPS guidance for FY2026 ($17.50-$17.75, midpoint $17.63) landed below the ~$18.37-18.98 range analysts had penciled in, a genuine guide-vs-Street miss even on a like-for-like continuing-ops basis. The bear case has to be honest about WHY, though — it was not the Ratings pull-forward risk this thesis was built to watch (billed issuance actually ACCELERATED to +25% YoY from Q1's +14%, and management raised the Ratings and Indices organic growth guides). The drag came from Energy (Iran-conflict sanctions and volatility pressuring Global Trading Services renewals) and Market Intelligence (elongated sales cycles on complex AI contract negotiations) — two segments not previously on this thesis's KPI list. The bear case now rests on whether those two drags are transitory (geopolitics resolving, AI deal cycles normalizing) or the first sign of a broader multiple-compression regime returning, on top of a still-live (if so far unconfirmed) Ratings pull-forward risk once the guided H2 deceleration actually arrives.",
    breaks: "Two straight quarters where continuing-ops organic constant-currency revenue growth misses the low end of the 6-8% FY2026 guide, OR Ratings billed issuance goes negative before the guided Q4 2026 deceleration, OR Energy/Market Intelligence weakness spreads into Ratings/Indices margins rather than staying contained to those two segments.",
    requires01: "Q3 2026 print shows Energy revenue still stalled (Iran-conflict/sanctions overhang not clearing) or Market Intelligence bookings/backlog showing the AI-contract sales-cycle drag getting worse, not better",
    requires02: "Ratings issuance growth decelerates FASTER than the newly-raised 5-8% FY2026 guide, or refinancing/new-issue bond activity visibly rolls over",
  },
  base: {
    key: "base", label: "BASE", accent: "#e0a83b", glow: "rgba(224,168,59,0.40)",
    target12: "$405 — $495",
    op: "SPGI at $411.93 trades at ~23.4x the newly-guided FY2026 adjusted EPS ($17.63 midpoint) — squarely mid-band on its own forward-multiple history (18-34x over the past 2 years) and still a discount to peer medians (MCO ~27x, MSCI ~30x, VRSK ~26x, as of the last peer check). Q2 2026 was a genuinely mixed print: pro forma continuing-ops revenue of $3.678B beat estimates (+11% YoY), Ratings grew 17% with issuance ACCELERATING to +25%, Indices posted its 13th consecutive record quarter (+20%), and the FY2026 organic cc revenue guide was reaffirmed at 6-8% with the Ratings and Indices sub-guides both RAISED. The miss was entirely on the earnings line — Energy (Iran-conflict fallout) and Market Intelligence (AI-contract sales-cycle elongation) pulled adjusted EPS guidance to $17.50-17.75, below prior Street expectations — and the stock sold off ~6% over the following two sessions to $411.93. The base case reads this as a real but contained disappointment: the two highest-conviction growth engines (Ratings, Indices) are not just intact but accelerating, funded further by a raised $7B+ 2026 buyback target. Most likely path: Energy/MI stabilize or at least stop deteriorating over the next 1-2 quarters, Ratings/Indices strength continues to do the heavy lifting, and the stock holds its normal 23-28x band on the new, lower EPS base.",
    breaks: "Management cuts (not just misses) full-year 2026 organic cc revenue guidance at a future print, or the Energy/Market Intelligence weakness spreads into Ratings or Indices rather than staying contained — confirming this was the start of a broader slowdown, not two segment-specific drags.",
    requires01: "Q3 2026 continuing-ops revenue and EPS land within/near the reissued guide ($17.50-17.75 FY26 adjusted EPS, 6-8% organic cc revenue)",
    requires02: "Ratings and Indices continue growing at or above their newly-raised guided paces; Energy and Market Intelligence stop deteriorating even if they don't yet re-accelerate",
  },
  bull: {
    key: "bull", label: "BULL", accent: "#3fd07a", glow: "rgba(63,208,122,0.45)",
    target12: "$530 — $600",
    op: "The bull case is that Q2 2026 actually strengthened the core toll-booth story even though the headline EPS miss made it look like the opposite: Ratings issuance accelerated to +25% (not the deceleration this thesis was watching for), management raised both the Ratings (5-8%, from 4-7%) and Indices (12-14%, from 10-12%) organic growth guides, Indices notched its 13th straight record quarter with ETF AUM tied to S&P Dow Jones Indices hitting $6.35T (S&P 500 ETF assets crossing $1T for the first time in June), and the 2026 buyback target was raised to over $7B — an aggressive signal of capital-return confidence, not caution. If Energy stabilizes as the Iran-conflict overhang clears and Market Intelligence's AI-contract sales cycles normalize (rather than compound), the market should recognize the EPS miss as a two-segment, largely geopolitical/mix issue layered on top of an accelerating core — and re-rate the multiple back toward the ~30-34x it traded at before the February 2026 crash.",
    breaks: "Q3 2026 or Q4 2026 shows the Energy/Market Intelligence weakness spreading into Ratings or Indices, or Ratings issuance decelerates faster than the newly-raised guide — confirming the EPS miss was the leading edge of a broader slowdown rather than two contained, largely external drags.",
    requires01: "Ratings billed issuance growth stays strong into Q3/Q4 2026 (not just the Q2 acceleration), confirming the newly-raised 5-8% Ratings guide is itself conservative",
    requires02: "Energy and Market Intelligence visibly stabilize/re-accelerate, and the market re-rates SPGI's multiple back toward 30x+ on confirmation the EPS miss was contained, not the start of a trend",
  },
};

const FALLBACK_PRICE = 411.93;

const LIVE_PRICE = {
  enabled: true,
  symbol: "SPGI",
  provider: "yahoo",
  corsProxy: "https://api.allorigins.win/get?url=",
  finnhubToken: "",
};

// ALERT — buy-trigger pre-commitment. Mirrored into PF_ALERTS.SPGI in
// stocks/portfolio/portfolio-data.js (canonical) as of this touch.
const ALERT = {
  symbol: "SPGI",
  buyFloor: 405,
  thesisIntact: true,
  asOf: AS_OF_DATE,
  nextEarnings: "~2026-10-29",
};

const HISTORY = [
  { q: "Q1 2025", p: 508.10 },
  { q: "Q2 2025", p: 527.29 },
  { q: "Q3 2025", p: 486.71 },
  { q: "Q4 2025", p: 522.59 },
  { q: "Q1 2026", p: 425.34 },
  { q: "Q2 2026", p: 424.36 },
  { q: "NOW",     p: FALLBACK_PRICE },
];

const PROJ_END = { bear: 345, base: 450, bull: 565 };
const FUTURE_Q = ["Q3 2026", "Q4 2026", "Q1 2027", "Q2 2027"];

const SIGNALS = {
  bear: [
    { name: "Q2 2026 Revenue YoY (continuing ops)", unit: "%",  tag: "BEAT",  next: "Oct 29, 2026", val: "ACTUAL +11% ($3.678B pro forma)", guide: "vs 6-8% FY26 organic cc guide", pos: 0.70 },
    { name: "Ratings Billed Issuance Growth",       unit: "%",  tag: "BEAT",  next: "Oct 29, 2026", val: "ACTUAL +25% (Q2 2026, up from +14% Q1)", guide: "guided 5-8% FY26 (raised from 4-7%)", pos: 0.78 },
    { name: "FY2026 Adjusted EPS Guide",            unit: "$",  tag: "MISS",  next: "Oct 29, 2026", val: "ACTUAL $17.50-17.75 (mid $17.63)", guide: "vs prior Street ~$18.37-18.98", pos: 0.30 },
  ],
  base: [
    { name: "Q2 2026 Revenue YoY (continuing ops)", unit: "%",  tag: "BEAT",  next: "Oct 29, 2026", val: "ACTUAL +11% ($3.678B pro forma)", guide: "vs 6-8% FY26 organic cc guide", pos: 0.70 },
    { name: "Ratings Billed Issuance Growth",       unit: "%",  tag: "BEAT",  next: "Oct 29, 2026", val: "ACTUAL +25% (Q2 2026, up from +14% Q1)", guide: "guided 5-8% FY26 (raised from 4-7%)", pos: 0.78 },
    { name: "FY2026 Adjusted EPS Guide",            unit: "$",  tag: "MISS",  next: "Oct 29, 2026", val: "ACTUAL $17.50-17.75 (mid $17.63)", guide: "vs prior Street ~$18.37-18.98", pos: 0.30 },
  ],
  bull: [
    { name: "Q2 2026 Revenue YoY (continuing ops)", unit: "%",  tag: "BEAT",  next: "Oct 29, 2026", val: "ACTUAL +11% ($3.678B pro forma)", guide: "vs 6-8% FY26 organic cc guide", pos: 0.70 },
    { name: "Ratings Billed Issuance Growth",       unit: "%",  tag: "BEAT",  next: "Oct 29, 2026", val: "ACTUAL +25% (Q2 2026, up from +14% Q1)", guide: "guided 5-8% FY26 (raised from 4-7%)", pos: 0.78 },
    { name: "FY2026 Adjusted EPS Guide",            unit: "$",  tag: "MISS",  next: "Oct 29, 2026", val: "ACTUAL $17.50-17.75 (mid $17.63)", guide: "vs prior Street ~$18.37-18.98", pos: 0.30 },
  ],
};
const MARGIN = {
  bear: [
    { name: "Indices Division Growth",              tag: "BEAT",  next: "Oct 29, 2026", pos: 0.85 },
    { name: "Energy / Market Intelligence Drag",     tag: "WATCH", next: "Oct 29, 2026", pos: 0.35 },
  ],
  base: [
    { name: "Indices Division Growth",              tag: "BEAT",  next: "Oct 29, 2026", pos: 0.85 },
    { name: "Energy / Market Intelligence Drag",     tag: "WATCH", next: "Oct 29, 2026", pos: 0.35 },
  ],
  bull: [
    { name: "Indices Division Growth",              tag: "BEAT",  next: "Oct 29, 2026", pos: 0.85 },
    { name: "Energy / Market Intelligence Drag",     tag: "WATCH", next: "Oct 29, 2026", pos: 0.35 },
  ],
};

const KPI_HIST = 3.678; // Q2 2026 pro forma continuing-ops total revenue, $B (ex-Mobility)
const KPI_PROJ = {
  bear:  [3.60, 3.45, 3.65, 3.55],
  base:  [3.78, 3.70, 3.92, 3.85],
  bull:  [3.95, 3.90, 4.20, 4.15],
};

// TRACK RECORD — append newest to end; dashboard keeps last TRACK_WINDOW.
// Bands are RECONSTRUCTED now from each date's real post-earnings price and a
// reasoned forward-P/E regime for that period — not archived in real time.
// Older quarters (pre Feb-2026 crash) carry a richer multiple regime and are
// flagged lower-confidence; the Feb 2026 and Apr 2026 prints are the two most
// documented, highest-confidence entries.
const TRACK_ALL = [
  { q: "Q1 2025", date: "2025-04", post: 492, reaction: "+",  bear: [352,400], base: [416,464], bull: [480,528], landed: "base→bull", conf: "low" },
  { q: "Q2 2025", date: "2025-07", post: 551, reaction: "++", bear: [386,437], base: [454,504], bull: [521,571], landed: "bull",      conf: "med" },
  { q: "Q3 2025", date: "2025-10", post: 473, reaction: "-",  bear: [378,430], base: [447,499], bull: [516,568], landed: "base",      conf: "med" },
  { q: "Q4 2025", date: "2026-02", post: 391, reaction: "--", bear: [433,493], base: [512,571], bull: [591,650], landed: "bear",      conf: "high" },
  { q: "Q1 2026", date: "2026-04", post: 433, reaction: "+",  bear: [342,378], base: [396,468], bull: [486,540], landed: "base",      conf: "high" },
  { q: "Q2 2026", date: "2026-07", post: 424, reaction: "-",  bear: [330,390], base: [425,515], bull: [555,630], landed: "base(low)", conf: "high" },
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
  ntm_eps:              17.63,    // FY2026 adjusted EPS guide midpoint ($17.50-17.75), first formal ex-Mobility guide
  shares_b:              0.290,   // est., trending down on the raised $7B+ 2026 buyback target
  fcf_ntm_b:              4.85,
  risk_free_pct:          4.40,
  default_discount_pct:  10.0,
  default_terminal_pe:   23,
  dcf_years:              5,
  prior_fy_rev_b:        13.589,   // FY2025 pro forma continuing-ops (ex-Mobility) revenue
  prior_fy_label:       "2025 (pro forma ex-Mobility)",
  pe_trough: 18, pe_bear_hi: 21, pe_normal_lo: 23, pe_normal_hi: 28, pe_bull_lo: 30, pe_peak: 34,
  peers: [
    { t: "SPGI", fpe: 23.4, ev_eb: 24.0, fcf_y: 3.3, note: "Ratings/Indices/data toll-booth, post-Mobility-spinoff — now on the newly-guided, lower FY26 EPS base" },
    { t: "MCO",  fpe: 27.1, ev_eb: 25.3, fcf_y: 2.9, note: "Same NRSRO ratings duopoly — no cushion, no discount to own history" },
    { t: "MSCI", fpe: 30.4, ev_eb: 26.5, fcf_y: 3.0, note: "Index-embeddedness moat — priced closer to perfection" },
    { t: "VRSK", fpe: 25.8, ev_eb: 19.0, fcf_y: 4.2, note: "Insurance/risk-analytics data moat — the closest 'clean toll-booth' comp" },
  ],
};

const SIGNAL_HELP = {
  "Q2 2026 Revenue YoY (continuing ops)": "Q2 2026 pro forma continuing-operations (ex-Mobility) revenue was $3.678B, +11% YoY — the first full quarter reported as a standalone four-segment company, and it beat estimates (~$4.09B on a GAAP/pre-recast basis vs the ~$4.15B actually reported). Ratings (+17%) and Indices (+20%) did the heavy lifting; Energy (+2-3%) and Market Intelligence (+6%) lagged.",
  "Ratings Billed Issuance Growth": "Billed issuance is what bond/loan issuers pay S&P Global to rate new debt — the single biggest swing factor in this story. Q1 2026 grew 14% YoY; Q2 2026 ACCELERATED to 25% YoY (transaction revenue +25% to $746M), still helped by hyperscaler AI-infrastructure debt. Management raised the full-year Ratings organic cc guide to 5-8% (from 4-7%) on the back of this — the pull-forward risk this thesis was built to watch has NOT yet shown up; if anything the opposite. Whether Q3/Q4 hold up or the guided H2 deceleration finally arrives is still the key open question.",
  "FY2026 Adjusted EPS Guide": "The first formal full-year adjusted EPS guide reissued on an ex-Mobility basis, given alongside the Jul 28, 2026 Q2 print: $17.50-17.75 (midpoint $17.63) — below the ~$18.37-18.98 range analysts had penciled in pre-print. The gap versus Street is real, but it traces to Energy (Iran-conflict sanctions/volatility pressuring Global Trading Services renewals) and Market Intelligence (elongated AI-contract sales cycles), not to Ratings or Indices, both of which had their own guides raised the same day.",
  "Indices Division Growth": "S&P Global's highest-margin segment: licensing fees on the S&P 500 and other benchmark indices, paid by every fund and ETF that tracks them — a direct toll on the growth of passive investing AUM, largely decoupled from bond-issuance cycles. Grew 20% YoY in Q2 2026, its 13th consecutive record-revenue quarter; ETF AUM tied to S&P Dow Jones Indices hit $6.35T, with S&P 500-tracking ETF assets crossing $1T for the first time in June 2026.",
  "Energy / Market Intelligence Drag": "The two segments actually responsible for the Q2 2026 EPS-guide miss — not Ratings pull-forward, which this thesis was originally built to watch. Energy (Platts/Commodity Insights) grew only ~2-3% as Iran-conflict sanctions and commodity-price volatility pressured Global Trading Services renewals and usage-based revenue. Market Intelligence grew 6% but management flagged elongated sales cycles on complex AI-related contract negotiations slowing bookings. Whether these stabilize (bull case) or spread into Ratings/Indices (bear case) is the new central question.",
};
const TAG_HELP = {
  BEAT: "doing better than expected — a good sign.",
  MATCH: "roughly in line with expectations — steady, no surprises.",
  MISS: "falling short of expectations — a worry.",
  WATCH: "not decided yet — keep an eye on it.",
};

const THESIS_ITEMS = [
  { key: "revenueGuide",    label: "Continuing-ops revenue landing within the 6-8% organic cc growth guide", note: "Reaffirmed Jul 28, 2026; Ratings/Indices sub-guides RAISED" },
  { key: "ratingsIssuance", label: "Ratings billed issuance staying strong, not decelerating faster than guided", note: "Accelerated to +25% in Q2 (from +14% Q1) — pull-forward NOT yet confirmed" },
  { key: "indicesGrowth",   label: "Indices division holding double-digit growth",                             note: "13th consecutive record quarter, +20% YoY in Q2 2026" },
  { key: "energyMiStable",  label: "Energy and Market Intelligence stop deteriorating",                        note: "The actual source of the Q2 2026 EPS-guide miss — new KPI this touch" },
  { key: "capitalReturn",   label: "Buyback pace continuing to support EPS growth",                            note: "2026 target raised to $7B+ (from $1.0B/quarter pace)" },
];
const PRICE_ZONES = [
  { label: "BEAR", lo: 315, hi: 370, mid: 342, color: "#f1564b", action: "Exit / reduce if thesis also breaking" },
  { label: "BASE", lo: 405, hi: 495, mid: 450, color: "#e0a83b", action: "Small add OK if thesis intact" },
  { label: "BULL", lo: 530, hi: 600, mid: 565, color: "#3fd07a", action: "Let it ride — don't chase" },
];

// ── Chart geometry / axis ranges (per-stock: depends on price scale) ─────────
const GEOM = {
  priceMin: 260, priceMax: 650,
  fanGrid: [580, 480, 380, 280],
  fanYears: ["2025", "2026", "2027"],
  trackMin: 260, trackMax: 650,
  trackGrid: [620, 520, 420, 320, 260],
  kpiMin: 3.0, kpiMax: 4.6,
  visLo: 280, visHi: 620,
  nowZoneLo: 405, nowZoneHi: 495,
};

/* ── TEXT — every company-specific narrative/tooltip the engine renders. ──────
   Values are strings, HTML strings (rendered with dangerouslySetInnerHTML), or
   template functions the engine calls with computed values. If it mentions the
   company, a quarter, a guide number, or an event, it belongs HERE, not in the
   engine — that rule is what makes the engine safely reusable across stocks. */
const TEXT = {
  // header / footer
  priceTipLive: (px, at, asOf) => `Live quote: $${px} (fetched ${at}). The price is real-time, but the scenario bands and EPS are still as of ${asOf} — only the price-derived figures (scenario returns, P/E, band position) update live.`,
  priceTipStatic: (px, asOf, liveEnabled) => `$${px} as of ${asOf} — ${liveEnabled ? "live fetch unavailable (offline or blocked), using the saved price" : "static price (live fetch disabled)"}. Next earnings: Q3 FY2026 (~Oct 29, 2026).`,
  footerDisclaimer: (asOf) => `Illustrative scenario framing built on public consensus & estimates as of ${asOf} — not a prediction and not financial advice. Price ranges are scenario mid-bands; KPI markers are positional, not literal. Valuation ruler: forward continuing-ops adjusted EPS × P/E multiple. Data inputs will move with every print, especially confirmation of whether the Energy/Market Intelligence drag stabilizes. Next earnings: Q3 FY2026 (~Oct 29, 2026).`,

  // fan chart
  fanHistory: "The solid white line is SPGI's actual price since Q1 2025. The choppy 2025 range, the sharp Feb 2026 guidance-miss crash to a $390.76 trough, the recovery above $450 following the Jul 1, 2026 Mobility spinoff, and the pullback to ~$412 after the Jul 28, 2026 Q2 print's EPS-guide miss.",
  fanNow: (px) => `SPGI trades around $${px} right now — after the Jul 28, 2026 Q2 print delivered a real EPS-guide miss (FY2026 adjusted EPS guided to $17.50-17.75, below prior Street estimates) even as continuing-ops revenue beat (+11% YoY, $3.678B) and Ratings/Indices growth guides were RAISED. The drag traced to Energy (Iran-conflict fallout) and Market Intelligence (AI-contract sales-cycle delays), not the Ratings pull-forward risk this thesis originally tracked. Next print: Q3 2026 (~Oct 29, 2026). Everything left of this dot is history; everything right is forecast.`,
  fanPastDot: (q, p) => `At the end of ${q}, SPGI was around $${p}.`,

  // scenario selector
  segmentedExplain: {
    bear: ["The pessimistic scenario", "Click to see what SPGI looks like if the Energy/Market Intelligence weakness spreads into Ratings or Indices, or Ratings issuance decelerates faster than the newly-raised guide — and the multiple retests the ~18-21x trough zone seen in February 2026. Price would likely fall to the $315–370 range."],
    base: ["The most-likely scenario", "Click for the base view — Energy and Market Intelligence stop deteriorating (even if they don't yet re-accelerate), Ratings and Indices keep doing the heavy lifting at their newly-raised guided paces, and the multiple holds its normal 23-28x band on the new, lower EPS base. Price holds/recovers toward the $405–495 range."],
    bull: ["The optimistic scenario", "Click to see the upside — Ratings issuance strength continues (it accelerated to +25% in Q2, not decelerated), Energy/Market Intelligence stabilize as the Iran-conflict overhang clears and AI-contract cycles normalize, and the market re-rates SPGI's multiple back toward the ~30-34x it traded at before the February crash. Price could reach $530–600."],
  },

  // KPI column
  kpiBaseline: (val) => `This is the most recent real number: SPGI's Q2 2026 pro forma continuing-operations (ex-Mobility) revenue was $${val}B, +11% YoY. The bars to the right are scenario forecasts for where it goes next.`,
  kpiForecast: (label, val) => `In this scenario, quarterly continuing-ops revenue reaches ~$${val}B by ${label}. Management guides FY2026 organic constant-currency growth of 6-8% (Ratings and Indices sub-guides both raised) — taller bar = faster growth, and Energy/Market Intelligence stabilizing rather than dragging further.`,

  // reversion clock
  reversion: {
    header: "REVERSION CLOCK · FEB 2026 GUIDANCE-MISS CRASH",
    timeTip: "On Feb 10, 2026, FY2026 adjusted EPS guidance ($19.40-19.65, then still combined with Mobility) missed the ~$19.96 consensus by a few percent. The stock fell ~17% that session and continued to a $390.76 closing trough the next day — a real multiple-compression event, since Q4 2025 revenue itself actually beat. This bar shows how far along the recovery is vs. the time it took to durably reclaim the base floor.",
    priceTip: (trough, baseFloor, now) => `Stock bottomed at $${trough} on Feb 11, 2026, and needed to durably reclaim $${baseFloor} to re-enter the base band. It round-tripped below that floor several times (March, late May-June amid spinoff-execution uncertainty, and again after the Jul 28, 2026 Q2 EPS-guide miss) before settling near $${now} — now just inside the RECALIBRATED base floor ($405, down from $425 on the lower FY26 EPS guide base).`,
    footerHtml: (baseFloor, precedentDays, now) => `The Feb 2026 crash was a guidance/multiple-compression shock, not a revenue miss — Q4 2025 revenue actually beat. Price durably reclaimed the (then) $425 base floor within ${precedentDays} days of the trough, coinciding with the Jul 1, 2026 Mobility spinoff completing cleanly. The Jul 28, 2026 Q2 print then delivered a milder, more contained version of the same pattern — an EPS-guide miss (Energy/Market Intelligence, not Ratings) against a revenue beat and raised Ratings/Indices guides — pulling price down to $${now}, just inside the recalibrated $${baseFloor} floor. Same playbook: <span style="color:#e0a83b;font-weight:700">has the thesis actually broken, or is this fear?</span>`,
  },

  // track record
  track: {
    lastDot: (post, nowPx) => `After Q2 2026 earnings (Jul 28, 2026), SPGI traded around $${post} — landing right at the floor of the (recalibrated) base band on a real EPS-guide miss, even as continuing-ops revenue beat and Ratings/Indices guides were raised. Price sits at $${nowPx} today, drifting slightly lower still. Next dot: Q3 2026 earnings (~Oct 29, 2026).`,
    pastDot: (q, post) => `After ${q} earnings, SPGI actually traded around $${post}. Compare this dot to the colored bars behind it to see if the predicted range was right.`,
    readoutHtml: (hits, n, nowPx) => `Price has tracked <span style="color:#3fd07a;font-weight:700">base-or-better in ${hits} of ${n} quarters</span> in this window. The exception is instructive: Q4 2025 (reported Feb 10, 2026) landed well BELOW even the reconstructed bear band — a genuine guidance-miss shock, the deepest breach in this table. Q1 2026 (Apr 2026) recovered to a base-band landing on a continuing-ops beat, then Q2 2026 (Jul 2026) landed right at the (old) base floor on a narrower, more contained EPS-guide miss. Price today sits at $${nowPx}, just inside the recalibrated base band. Next directional catalyst: <span style="color:#e0a83b;font-weight:700">Q3 2026 earnings (~Oct 29, 2026)</span>.`,
    footnote: "⚠ Bands are reconstructed now, anchored to each date's forward EPS & multiple regime — not archived in real time. Treat levels as directional, especially the \"low-conf\" quarters (2025 and earlier, before the Feb 2026 regime shift, the Jul 2026 Mobility spinoff, and the Jul 2026 EPS-guide reset all changed what 'normal' means for this stock).",
  },

  // THE CURRENT tab
  current: {
    statusNarrative: {
      broken: "Multiple signals missed. Thesis is under pressure — review the kill-switch criteria.",
      watch:  "The FY2026 adjusted EPS guide came in below prior Street estimates, and the drag traced to Energy and Market Intelligence, not the originally-tracked Ratings pull-forward risk (which has NOT materialized — issuance accelerated). Watch whether Energy/MI stabilize or spread into the core segments.",
      intact: "Revenue beat and organic cc guide reaffirmed/raised on Ratings and Indices — the two highest-conviction growth engines are accelerating, not decelerating. The EPS-guide miss is real but contained to Energy (Iran-conflict fallout) and Market Intelligence (AI-contract sales-cycle delays).",
    },
    panelTipStory: "Checks whether the original reasons to own SPGI are playing out. Counts signals from the Jul 28, 2026 Q2 print — continuing-ops revenue growth, Ratings billed issuance, and the FY2026 adjusted EPS guide vs prior Street estimates. 0-1 miss = thesis intact. 2 misses = watch. 3+ = exit. Click to see KPI bars and kill-switch.",
    watchChipHtml: `🔑 WATCH: Energy / Market Intelligence stabilization · <span style="color:#e0a83b;font-weight:700">Q3 2026, ~Oct 29</span>`,
    exitChipHtml: `⚠ EXIT IF: Ratings issuance turns negative, or Energy/MI drag spreads into Ratings/Indices, or 2 straight cc-revenue misses`,
    verdictBody: {
      broken:     (px) => `SPGI at $${px}: kill-switch criteria met. Price position is irrelevant — signals say the slowdown has spread beyond Energy/Market Intelligence into the core Ratings/Indices engines. The question is not whether to add; it is how much to reduce.`,
      watchBelow: (px) => `SPGI at $${px} sits below the base floor but signals are mixed. Price is attractive, but adding into a weakening thesis is the wrong sequence. Wait for the Q3 2026 print (~Oct 29) to confirm Energy/Market Intelligence are stabilizing before deploying capital.`,
      below:      (px) => `SPGI at $${px} sits below the base floor with the core thesis intact — Q2 2026 revenue beat, Ratings issuance accelerated to +25%, and both Ratings and Indices organic growth guides were raised. The market is pricing in the EPS-guide miss (Energy/Iran-conflict fallout, Market Intelligence AI-contract sales-cycle delays) more than the underlying demand story; the fundamentals say this is a contained, largely external drag, not demand destruction in the core business.`,
      inBase:     (px, statusWord) => `SPGI at $${px} is inside the base range, near its floor. Thesis ${statusWord} and price is fair-to-cheap — a real discount to both its own 5-year forward-P/E history (~34x peak) and peer medians (MCO ~27x, MSCI ~30x). Watch the Q3 2026 print (~Oct 29, 2026) — the real test of whether Energy/Market Intelligence stabilize or the drag spreads.`,
      above:      (px) => `SPGI at $${px} is above the base ceiling. The bull case — Energy/Market Intelligence stabilizing and a multiple re-rate back toward 30x+ — needs to play out to justify entry at this level. If already in, hold. If adding, wait for a pullback toward the base floor.`,
    },
    kpiTitle: "Continuing-Ops Revenue",
    kpiSub: "$B quarterly, ex-Mobility · HIGHER BETTER",
    kpiMeasures: "Total quarterly revenue across the four remaining segments (Ratings, Market Intelligence, Energy/Commodity Insights, Indices), driven mostly by bond/loan issuance volume (Ratings), index-licensing AUM growth (Indices), data/analytics subscriptions (Market Intelligence), and commodity-price/trading-activity volume (Energy). Guided to 6-8% organic constant-currency growth for FY2026, with Ratings and Indices sub-guides both raised after Q2.",
    kpiRequires: {
      bull: "Revenue beats the 6-8% organic cc guide every quarter, with Ratings issuance growth staying strong into H2 2026 — confirming Q2's acceleration was durable, not a one-quarter spike — and Energy/Market Intelligence re-accelerating.",
      base: "Revenue lands inside the 6-8% guide each quarter, Ratings/Indices keep growing at or above their newly-raised guided paces, and Energy/Market Intelligence at least stop deteriorating.",
      bear: "Revenue misses the guide, or Ratings issuance decelerates sharply, or the Energy/Market Intelligence weakness spreads into Ratings or Indices rather than staying contained.",
    },
    group1Title: "Revenue &amp; Issuance Momentum",
    group2Title: "Segment Mix &amp; Capital Return",
    killSwitch: "Ratings billed issuance growth decelerates sharply or turns negative, or two straight quarters of continuing-ops organic cc revenue missing the 6-8% guide, or the Energy/Market Intelligence weakness spreads into Ratings or Indices margins, or a credible NRSRO reform / new-entrant threat to the ratings duopoly — exit / reduce. That is demand destruction or policy risk, not noise.",
    priceBanner: {
      below:  (px, baseLo) => `At $${px}, price is $${baseLo - px} below the base floor. Market is pricing in the Q2 2026 EPS-guide miss (Energy/Market Intelligence, largely external drags) more than the underlying demand story, given Ratings/Indices strength and raised guides. Historically the window patient buyers use.`,
      inBase: (px) => `At $${px}, price is inside the base range. Fair value — not a discount, not expensive.`,
      above:  (px, baseHi) => `At $${px}, price is $${px - baseHi} above the base ceiling. The bull thesis needs to play out in full.`,
    },
    moodBanner: (currentPE, loPE, hiPE) => `At ${currentPE}× forward P/E (on the newly-guided $17.63 FY2026 adjusted EPS midpoint), the market is pricing in some caution on Energy/Market Intelligence even as Ratings/Indices accelerate — the multiple sits mid-to-low band (${loPE}-${hiPE}×), a real discount to the ~30-34× the stock traded at before the February 2026 guidance-miss crash.`,
    cagrNotes: {
      low:  "Low bar — not priced for perfection. Even Energy/Market Intelligence merely stabilizing (not re-accelerating) justifies the price.",
      mid:  "Moderate bar — requires the 6-8% organic cc growth guide to hold and Ratings/Indices to keep growing at their newly-raised paces.",
      high: "High bar — requires Ratings issuance strength to persist into H2 2026 and Energy/Market Intelligence to visibly re-accelerate.",
    },
    fy26CardTip: (fy26) => `Adding Q1+Q2 2026's continuing-ops actuals to the base-case H2 2026 projections gives a full-year run rate of roughly $${fy26}B, up from $13.589B pro forma in 2025 — inside management's own 6-8% organic cc revenue growth guide. That's what the base case — and roughly today's price — already assumes. The bull case requires Energy/Market Intelligence to re-accelerate on top of that.`,
    fy26CardHtml: (fy26, growthPct) => `Q1+Q2 2026 continuing-ops actuals plus base-case H2 projections sum to roughly <span style="color:var(--blue-soft);font-weight:700">$${fy26}B</span> for full-year 2026 (ex-Mobility) — the growth path today's price already assumes. 2025 pro forma continuing-ops revenue was <span style="color:#3fd07a">$13.589B</span>, so this implies <em>~${growthPct}%</em> YoY growth.`,
    peerCommentary: (currentPE) => `At ${currentPE}× NTM P/E, SPGI trades at a discount to both MCO (~27x, the same NRSRO ratings duopoly, but with no discount to its own history) and MSCI (~30x, an index-embeddedness moat priced closer to perfection) — despite sharing the same regulatory-bottleneck structure as MCO. VRSK (~26x forward, the closest 'clean toll-booth' comp) trades at a similar multiple with a lower EV/EBITDA, a useful sanity check that SPGI's discount is real and not just an SPGI-specific problem the whole findata/ratings group shares. Peer multiples last refreshed 2026-07-18 — not re-pulled this touch given no signal of a group-wide re-rating.`,
  },

  // THE FUTURE tab
  future: {
    scenarioTips: {
      bear: "Triggered by: the Energy/Market Intelligence weakness spreading into Ratings or Indices, or Ratings issuance decelerating sharply, or two straight cc-revenue misses. Multiple compresses toward the 18-21× trough zone seen in February 2026. Note: at current price, bear downside is comparable in magnitude to bull upside.",
      base: (loPE, hiPE) => `Continuing-ops revenue lands within the 6-8% organic cc guide each quarter; Ratings and Indices keep growing at their newly-raised guided paces; Energy/Market Intelligence stop deteriorating. P/E holds in the normal ${loPE}-${hiPE}× band on the new, lower EPS base. Modestly positive return from here as the stock re-tests the $450s-$490s.`,
      bull: (currentPE) => `Revenue beats the guide and Ratings issuance strength persists into H2 2026; Energy and Market Intelligence visibly stabilize/re-accelerate. Multiple re-rates from ~${currentPE}× toward the bull zone, closing the gap to the bull target.`,
    },
    downsideChevronTip: "Kill-switch: the Energy/Market Intelligence drag spreads into Ratings or Indices, Ratings issuance decelerates sharply, or two straight cc-revenue misses = exit / reduce.",
    dislocEventName: "the Feb 2026 guidance-miss crash",
    dislocLabel: "SINCE FEB 2026 GUIDANCE-MISS LOW",
    bearPriceTip: (bearMid, bearLo, bearHi, peTrough, peBearHi) => `$${bearMid} is the midpoint of the bear case range ($${bearLo}-$${bearHi}). This assumes the Energy/Market Intelligence drag spreads into Ratings/Indices, or Ratings issuance growth decelerates sharply, or cc-revenue misses the guide twice running, and the multiple compresses toward the ${peTrough}-${peBearHi}× trough zone seen in February 2026. If it triggers, do not average down.`,
    killSwitchTip: "A kill-switch is a pre-committed exit rule you set BEFORE you own the position — when you are thinking clearly. If Ratings billed issuance growth decelerates sharply (not just the guided pace), or the Energy/Market Intelligence weakness spreads into Ratings or Indices, or continuing-ops cc revenue misses the 6-8% guide for two straight quarters, the thesis is broken. Do not average down into a broken thesis. No debate, no rationalisation. Exit.",
    killSwitchTipNote: "Ratings issuance decelerates sharply, Energy/MI drag spreads into Ratings/Indices, or two straight cc-revenue misses. Any one. No debate.",
    killSwitchHtml: `<strong style="color:var(--title)">Ratings billed issuance growth decelerating sharply, the Energy/Market Intelligence weakness spreading into Ratings or Indices, or two consecutive quarters missing the 6-8% organic cc revenue guide</strong> → exit or reduce. No debate. Do not average down into a broken thesis.`,
    nextCheck: "Next check: Q3 2026 earnings (~Oct 29, 2026)",
    downsideFootnote: (px, peTrough, peBearHi) => `Bear case scenario: Energy/Market Intelligence drag spreads into the core segments, or Ratings issuance decelerates sharply. Assumes a multiple compression toward ${peTrough}-${peBearHi}× on roughly flat-to-down EPS growth. Position loss is illustrative at $${px} entry.`,
    multipleSummary: (peNow, loPE, hiPE) => `At ~${peNow}× NTM P/E (on the newly-guided $17.63 FY2026 adjusted EPS), SPGI sits mid-to-low inside its historical normal range (${loPE}-${hiPE}×) — a real discount to the ~30-34× it traded at before the February 2026 guidance-miss crash, and to peer medians (MCO ~27x, MSCI ~30x).`,
    peBarTipSuffix: "Uses continuing-ops (ex-Mobility) adjusted FY2026 guidance midpoint EPS ($17.63), the basis management itself now guides and reports on since the Jul 28, 2026 first full ex-Mobility guide.",
    deepValueZoneNote: "Historically cheap for this name. Last seen briefly at the Feb 2026 guidance-miss trough, and again (in a milder form) after the Jul 2026 EPS-guide miss. A real entry opportunity if the thesis is intact.",
    dislocPrecedent: (baseFloor) => `Historical precedent: the Feb 2026 guidance-miss crash resolved within the 141-day window it took to durably reclaim the (then) $425 base floor, once the fundamentals confirmed the crash was a multiple event, not a demand event. The Jul 2026 Q2 EPS-guide miss looks like a milder repeat of the same pattern. Recalibrated base floor: $${baseFloor}.`,
    regretHtml: (currentPE) => `Q3 2026 revenue and Ratings issuance <strong style="color:#3fd07a">stay strong</strong> AND Energy/Market Intelligence visibly stabilize. That would confirm the Q2 2026 EPS-guide miss was a contained, largely external drag, re-rate the stock from ~${currentPE}× toward the bull zone, and close today's entry window.`,
    regretTip: "Charlie Munger's inversion: instead of asking 'why should I buy?', ask 'what would I have to believe happened, in hindsight, to wish I had bought more?' If Q3 2026 confirms Energy/Market Intelligence stabilizing while Ratings/Indices keep accelerating, today's entry window will close fast. This question is not about FOMO — it is about sizing correctly for your conviction.",
    chips: [
      { label: "KILL-SWITCH: ENERGY/MI DRAG SPREADS TO CORE → EXIT", col: "#f1564b" },
      { label: "REGRET IF: Q3 CONFIRMS ENERGY/MI STABILIZING",       col: "#3fd07a" },
      { label: "NEXT CHECK: OCT 29, 2026 EARNINGS",                  col: "#2f6dff" },
    ],
    signalFootnote: (ntmEps) => `P/E uses continuing-ops (ex-Mobility) adjusted FY2026 guidance midpoint EPS $${ntmEps} — the basis management itself guides and reports on.`,
  },

  // THE PAST tab
  past: {
    cardTips: {
      durability: (revCagrPct) => `Looks at ~5 years of Revenue, Gross Margin, and Free Cash Flow. We want upward trends that hold through cycles — not spike-and-crash. SPGI's revenue compounded at ~${revCagrPct}% CAGR since 2021, but that includes a genuine step-change from the Feb 2022 IHS Markit merger (FY2021 $8.3B → FY2022 $11.2B) — this is NOT purely organic growth the way it would be for a pure compounder, and the merger initially diluted gross margin before it recovered.`,
      value: (latestROIC) => `ROIC (Return on Invested Capital) measures how efficiently management deploys capital. Above WACC (~8-9% for an asset-light data/ratings business) = value creation. Below = value destruction. SPGI's ROIC cratered from 28.9% (2021, pre-merger) to 6.1% (2022) when the IHS Markit deal swamped the invested-capital base with goodwill, and has only slowly recovered to ${latestROIC}% (2025) — still well below the pre-merger level. This is the honest soft spot in the durability story: the merger diluted capital efficiency and it has not fully earned its way back yet.`,
      capex: (peakCapex, latestCapex, latestFCF) => `Capex as a % of revenue shows how much of every dollar gets reinvested before cash reaches shareholders. SPGI is extremely capital-light — capex/revenue has stayed under ${peakCapex}% every year in this window (vs. 30-50%+ for a capital-intensive business like a foundry), because the product is data, ratings, and index licenses, not physical infrastructure. Nearly all of FCF ($${latestFCF}B in 2025) is available for buybacks and dividends rather than reinvestment.`,
      mood: (evNow, evAvg) => `EV/EBITDA vs its own 5-year average tells you whether the market is paying a premium or discount for this business. Current EV/EBITDA of ${evNow}× sits below the 5-year average of ~${evAvg}× — the market is pricing in residual caution after the February 2026 guidance-miss crash, the Mobility-spinoff transition, and the Jul 2026 Q2 EPS-guide miss, not obvious euphoria.`,
    },
    stats: [
      { html: `Revenue <span style="color:#3fd07a;font-weight:700">$8.3B → $15.3B</span> (5Y)`, tipTitle: "Revenue (5-year)", tipBody: "SPGI grew annual revenue from $8.3B (2021) to $15.3B (2025) — but roughly a third of that step-up came from the Feb 2022 IHS Markit merger (FY2021→FY2022 alone was +35%), not organic growth. Post-merger organic growth has been more modest, in the mid-single-digit to low-double-digit range." },
      { html: `FCF <span style="color:#3fd07a;font-weight:700">$3.6B → $5.5B</span> (5Y)`, tipTitle: "Free Cash Flow (5-year)", tipBody: "FCF grew from $3.6B (2021) to $5.5B (2025) — real growth, but not a straight line: FCF actually fell to $2.5B in 2022 as the IHS Markit integration and a heavier, more-indebted balance sheet weighed on cash generation before recovering." },
      { html: `Price <span style="color:#f1564b;font-weight:700">-13.1%</span> (Oct 2021 → now)`, tipTitle: "Total price return (window shown)", tipBody: "From $474.16 (Oct 2021) to $411.93 today (Jul 31, 2026 close) — down over ~4.8 years, despite real fundamental growth — reflecting a genuine multiple de-rating (EV/EBITDA fell from ~35.6x to ~24.0x) as rates rose, the IHS Markit integration diluted returns on capital, the Feb 2026 guidance miss compressed the multiple sharply, and the Jul 2026 Q2 EPS-guide miss added a further pullback on top of the post-spinoff recovery. This is a re-rating story as much as a growth story." },
    ],
    verdictBody: "SPGI's 5-year fundamental story is real but not the clean organic compounding story TSM or a pure-play toll-booth business would tell: the Feb 2022 IHS Markit merger nearly doubled revenue overnight but diluted gross margin and crushed ROIC (28.9% → 6.1%), and capital efficiency has only slowly recovered to 8.6% by 2025 — still well below the pre-merger level. What HAS held up is the capital-light model itself (capex/revenue under 1.5% every year) and steady FCF growth. The multiple has genuinely de-rated over this window (EV/EBITDA ~35.6x → ~24.0x) — price is roughly flat over 4.75 years despite revenue growing 85%, which is the honest tension this thesis has to resolve: is today's lower multiple a real opportunity, or a market correctly pricing in that the merger-era growth premium was never fully earned?",
    banners: {
      durability: (revCagrPct, rev0, rev9, gmDelta, latestGM, fcf0, latestFCF) => `Revenue compounded at ~${revCagrPct}% annually from $${rev0}B (2021) to $${rev9}B (2025) — but roughly a third of the total step-up is the Feb 2022 IHS Markit merger, not organic growth. Gross margin fell ${Math.abs(gmDelta)} points initially on merger dilution before recovering to ${latestGM}%. FCF grew from $${fcf0}B to $${latestFCF}B, but dipped to $2.5B in 2022 during integration.`,
      value: (latestROIC) => `ROIC of ${latestROIC}% (2025) sits above a typical WACC of ~8-9% for this business, meaning capital deployed today creates value — but it is a fraction of the 28.9% SPGI earned pre-merger (2021). The Feb 2022 IHS Markit deal added ~$40B+ of goodwill to the invested-capital base without a matching step-up in earnings, and five years later returns on that capital still have not fully recovered.`,
      capex: (latestCapex, peakCapex, latestFCF, fy26Guide) => `Capex/revenue of ${latestCapex}% (2025) has never exceeded ${peakCapex}% in this window — SPGI is a genuinely capital-light business, unlike a foundry or infrastructure name. FCF hit $${latestFCF}B in 2025 with almost none of it needed for reinvestment, funding a buyback pace raised to $7B+ for full-year 2026 that's now doing real work for EPS growth even as the earnings mix (Energy, Market Intelligence) softens.`,
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
