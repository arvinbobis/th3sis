/* ╔══════════════════════════════════════════════════════════════════════════╗
   ║   NOW · thesis-data.js — ALL per-stock content lives here.               ║
   ║   ███  EDIT EVERYTHING IN THIS FILE EACH QUARTER  ███                    ║
   ║                                                                          ║
   ║   The rendering engine (../engine/thesis-engine.js) contains ZERO        ║
   ║   company-specific strings — every number, narrative, and tooltip        ║
   ║   that mentions NOW is in this file. Quarterly touch = edit this         ║
   ║   file only, then run: node tools/lint-thesis-data.js now                ║
   ║                                                                          ║
   ║   Quick map — after each earnings report:                                ║
   ║     1. AS_OF_DATE / FALLBACK_PRICE                                       ║
   ║     2. HISTORY (add quarter) / FUTURE_Q (roll labels) / PROJ_END         ║
   ║     3. CASES — re-read each narrative, still true?                       ║
   ║     4. SIGNALS / MARGIN — update BEAT/MATCH/MISS + positions             ║
   ║     5. KPI_HIST / KPI_PROJ                                               ║
   ║     6. TRACK_ALL — append new quarter (oldest auto-drops)                ║
   ║     7. TEXT.* — re-read every narrative template, refresh stale facts    ║
   ║     8. ALERT — keep in sync with PF_ALERTS                               ║
   ╚══════════════════════════════════════════════════════════════════════════╝ */

const TICKER_META = { ticker: "NOW", exchange: "NYSE", company: "ServiceNow, Inc." };
const AS_OF_DATE = "2026-08-01";

// Most recent material dislocation — the 2025-2026 "AI agents eat SaaS seats" derate
const DISLOCATION_DATE = "2026-04-10";
const REVERSION_TROUGH = 83;
const REVERSION_BASEFLOOR = 102;
const REVERSION_PRECEDENT_DAYS = 112;

const CASES = {
  bear: {
    key: "bear", label: "BEAR", accent: "#f1564b", glow: "rgba(241,86,75,0.45)",
    target12: "$80 — $93",
    op: "Even after a genuine Q2 2026 beat-and-raise (subscription revenue $3.877B, +24.5% YoY; AI ACV past $1B; renewal rate 98%), NOW is still down roughly -30% from its Jan 2025 all-time high, and the multiple compression of the last 18 months reflects a real market view that AI agents will let enterprises consolidate seats rather than buy more of them — the exact 'Software handoff' framing Scout carried bearishly on NOW/CRM/WDAY through July. The bear case argues Q2's AI ACV headline is partly disclosure-friendly relabeling of expansion revenue that would have shown up as ordinary seat growth anyway, not fully incremental demand — the crux question this thesis can't yet fully resolve. The tell to watch is cRPO: it grew 21% YoY in Q2, not decelerating, which argues against pure cannibalization for now, but a slip here would be the first hard evidence the bear case is right, not just early.",
    breaks: "Subscription revenue growth decelerates back toward high-single-digits YoY (from today's +24.5%), OR renewal rate breaks meaningfully below 98%, OR AI ACV growth stalls/reverses while cRPO decelerates in the same quarter — the combination that would confirm agentic deployments are substituting for seat ARR rather than adding to it.",
    requires01: "Q3 2026 subscription revenue misses the $3,975–3,980M guide, or cRPO growth decelerates below ~15%",
    requires02: "Renewal rate prints below 97% for a full quarter, or the net-new $1M+ ACV deal count growth (currently +40% YoY) reverses",
  },
  base: {
    key: "base", label: "BASE", accent: "#e0a83b", glow: "rgba(224,168,59,0.40)",
    target12: "$102 — $134",
    op: "Q2 2026 beat across every disclosed line — subscription revenue $3.877B (+24.5% YoY), total revenue $3.987B, AI ACV crossed $1B with agentic deployments up 9x in nine months, cRPO +21% YoY, renewal rate held at a best-in-class 98%, and FY26 subscription guidance was raised to $15.76–15.78B (+21-22.5% YoY). The stock initially sold off to $95.46 the same day — a reflexive 'sell the news' dip on an already-battered name — then rallied to $115.76 within a week, settling at $111.23: a genuine relief rally, not a fade, the first one of this derate cycle. At roughly 25x blended NTM non-GAAP EPS, NOW trades well inside its own multi-year normal band and at a real ~25% discount to the ~$140 average analyst target, even though the underlying growth rate hasn't slowed at all. Most likely path: subscription revenue keeps compounding in the low-to-mid-20s% YoY through FY26 as guided, AI ACV becomes a genuine second growth engine layered on top of — not instead of — the core ITSM/HR/CSM workflow franchise, and the multiple grinds back toward normal without needing sentiment to fully flip.",
    breaks: "Management cuts full-year subscription revenue or margin guidance, signaling the platform-consolidation/AI-monetization story is losing share to point solutions or in-house agent builds faster than the Q2 print suggested.",
    requires01: "Q3 2026 subscription revenue lands within the $3,975–3,980M guide; FY26 non-GAAP operating margin tracks toward the 31.5% guide",
    requires02: "AI ACV continues scaling past $1B without a corresponding deceleration in core subscription cRPO; renewal rate holds at or above 98%",
  },
  bull: {
    key: "bull", label: "BULL", accent: "#3fd07a", glow: "rgba(63,208,122,0.45)",
    target12: "$147 — $187",
    op: "The AI ACV inflection is real and still early: $1B crossed with agentic deployments up 9x in nine months and AI Control Tower adoption past 500 customers in six months signals ServiceNow's platform position — the enterprise system-of-record for IT/HR/CSM workflow, with 98% renewal rates because ripping out years of custom workflow logic is a multi-year compliance-risk project — makes it a natural AI-agent orchestration layer sitting on top of a moat, not a target for disruption. 123 deals over $1M in net new ACV (+40% YoY) and 658 customers now over $5M in ACV show the largest, stickiest accounts are expanding, not shrinking their footprint. If Q3/Q4 2026 show AI ACV re-accelerating cRPO growth back above 22% and full-year guidance gets raised a second time, the market re-rates NOW from today's derated ~25x back toward the 33-42x band it traded at before the 2025-2026 selloff — still well short of the 60-90x EV/EBITDA-implied peak of 2023-2024, i.e. a partial, not euphoric, re-rating — as the 'AI eats SaaS seats' narrative that drove the derate gets falsified by NOW's own numbers, the way Q2's print already partially did.",
    breaks: "Q3 or Q4 2026 revenue or margin misses the raised guide, confirming the Q2 2026 beat-and-raise was a peak rather than a trend — or a large customer publicly replaces core ServiceNow workflows with an in-house or competitor agentic stack.",
    requires01: "Q3 2026 subscription revenue beats the $3,980M guide high end; cRPO growth reaccelerates above 22%",
    requires02: "FY26 guidance raised a second time; AI ACV scales meaningfully past $1.5–2B with disclosed net-new (not relabeled) large deals",
  },
};

// THESIS_HISTORY — append-only archive of the full CASES set as it stood at each
// touch, captured BEFORE that touch's Layer-2 audit rewrites it. NEVER edit a past
// entry after the fact. Not yet declared on this brand-new build (an empty array
// fails the lint's "must be a real log" check) — the first /update-thesis touch
// will create it and push the CASES above into it before rewriting them.

const FALLBACK_PRICE = 111.23;

const LIVE_PRICE = {
  enabled: true,
  symbol: "NOW",
  provider: "yahoo",
  corsProxy: "https://api.allorigins.win/get?url=",
  finnhubToken: "",
};

// ALERT — buy-trigger pre-commitment. Canonical source is PF_ALERTS.NOW in
// stocks/portfolio/portfolio-data.js; this copy is a FALLBACK for offline opens.
const ALERT = {
  symbol: "NOW",
  buyFloor: 102,
  thesisIntact: true,
  asOf: AS_OF_DATE,
  nextEarnings: "~2026-10-28",
};

const HISTORY = [
  { q: "Q1 2025", p: 159.23 },
  { q: "Q2 2025", p: 205.62 },
  { q: "Q3 2025", p: 184.06 },
  { q: "Q4 2025", p: 153.19 },
  { q: "Q1 2026", p: 104.55 },
  { q: "Q2 2026", p: 99.28 },
  { q: "NOW",     p: FALLBACK_PRICE },
];

const PROJ_END = { bear: 87, base: 118, bull: 167 };
const FUTURE_Q = ["Q3 2026", "Q4 2026", "Q1 2027", "Q2 2027"];

const SIGNALS = {
  bear: [
    { name: "Q2 2026 Subscription Rev YoY", unit: "%",  tag: "BEAT",  next: "Oct 28, 2026", val: "ACTUAL +24.5% ($3.877B)", guide: "beat prior guide implied run-rate", pos: 0.72 },
    { name: "Q3 2026 Subscription Rev Guide", unit: "$M", tag: "WATCH", next: "Oct 28, 2026", val: "TO REPORT", guide: "GUIDE $3,975–3,980M (+20.5% YoY)", pos: 0.60 },
    { name: "FY26 Non-GAAP Op Margin Guide", unit: "%",  tag: "WATCH", next: "Oct 28, 2026", val: "TO REPORT", guide: "GUIDE 31.5%", pos: 0.58 },
  ],
  base: [
    { name: "Q2 2026 Subscription Rev YoY", unit: "%",  tag: "BEAT",  next: "Oct 28, 2026", val: "ACTUAL +24.5% ($3.877B)", guide: "beat prior guide implied run-rate", pos: 0.72 },
    { name: "Q3 2026 Subscription Rev Guide", unit: "$M", tag: "WATCH", next: "Oct 28, 2026", val: "TO REPORT", guide: "GUIDE $3,975–3,980M (+20.5% YoY)", pos: 0.60 },
    { name: "FY26 Non-GAAP Op Margin Guide", unit: "%",  tag: "WATCH", next: "Oct 28, 2026", val: "TO REPORT", guide: "GUIDE 31.5%", pos: 0.58 },
  ],
  bull: [
    { name: "Q2 2026 Subscription Rev YoY", unit: "%",  tag: "BEAT",  next: "Oct 28, 2026", val: "ACTUAL +24.5% ($3.877B)", guide: "beat prior guide implied run-rate", pos: 0.72 },
    { name: "Q3 2026 Subscription Rev Guide", unit: "$M", tag: "WATCH", next: "Oct 28, 2026", val: "TO REPORT", guide: "GUIDE $3,975–3,980M (+20.5% YoY)", pos: 0.60 },
    { name: "FY26 Non-GAAP Op Margin Guide", unit: "%",  tag: "WATCH", next: "Oct 28, 2026", val: "TO REPORT", guide: "GUIDE 31.5%", pos: 0.58 },
  ],
};
const MARGIN = {
  bear: [
    { name: "AI ACV / Agentic Adoption", tag: "BEAT",  next: "Oct 28, 2026", pos: 0.68 },
    { name: "Renewal Rate (98% floor)",  tag: "MATCH", next: "Ongoing",      pos: 0.65 },
  ],
  base: [
    { name: "AI ACV / Agentic Adoption", tag: "BEAT",  next: "Oct 28, 2026", pos: 0.68 },
    { name: "Renewal Rate (98% floor)",  tag: "MATCH", next: "Ongoing",      pos: 0.65 },
  ],
  bull: [
    { name: "AI ACV / Agentic Adoption", tag: "BEAT",  next: "Oct 28, 2026", pos: 0.68 },
    { name: "Renewal Rate (98% floor)",  tag: "MATCH", next: "Ongoing",      pos: 0.65 },
  ],
};

const KPI_HIST = 3.877;  // Q2 2026 actual subscription revenue ($B), +24.5% YoY
const KPI_PROJ = {
  bear:  [3.90, 3.95, 4.00, 4.05],
  base:  [3.98, 4.24, 4.46, 4.68],
  bull:  [4.05, 4.45, 4.75, 5.05],
};

// TRACK RECORD — append newest to end; dashboard keeps last TRACK_WINDOW.
// Reconstructed now (new stock, first thesis build) anchored to each date's
// approximate NTM EPS × regime multiple — not archived in real time. Confidence
// rises toward the present as the regime is better known. See CLAUDE.md data-
// freshness rules: treat older quarters as directional, not precise.
const TRACK_ALL = [
  { q: "Q1 2025", date: "2025-04", post: 191, reaction: "+",  bear: [126,170], base: [173,221], bull: [224,284], landed: "base",      conf: "low" },
  { q: "Q2 2025", date: "2025-07", post: 189, reaction: "-",  bear: [124,163], base: [166,208], bull: [211,260], landed: "base",      conf: "low" },
  { q: "Q3 2025", date: "2025-10", post: 184, reaction: "-",  bear: [116,153], base: [156,197], bull: [201,245], landed: "base",      conf: "med" },
  { q: "Q4 2025", date: "2026-01", post: 117, reaction: "--", bear: [92,124],  base: [128,163], bull: [167,206], landed: "bear",      conf: "med" },
  { q: "Q1 2026", date: "2026-04", post: 88,  reaction: "--", bear: [62,82],   base: [86,109],  bull: [113,140], landed: "bear→base", conf: "high" },
  { q: "Q2 2026", date: "2026-07", post: 111, reaction: "++", bear: [80,93],   base: [102,134], bull: [147,187], landed: "base",      conf: "high" },
];
const TRACK_WINDOW = 6;

// THE PAST — annual history (Wisesheets SEC filings; Free-tier plan caps history at
// 5 years, so this window is 2022-2025 — 4 fiscal years, not TSM's 10. ROIC and
// EV/EBITDA are not in Wisesheets' metric catalog for this account, so those two
// series are web-sourced judgment estimates, flagged in the footnotes below.)
const PAST_YEARS       = ["2022","2023","2024","2025"];
const PAST_REV         = [7.245, 8.971, 10.984, 13.278];
const PAST_GM          = [78.3,  78.6,  79.2,   77.5];
const PAST_FCF         = [2.17,  2.70,  3.42,   4.58];
const PAST_ROIC        = [4.8,   7.7,   10.6,   12.2];
const PAST_EVEBITDA    = [90,    91,    94,     52];
const PAST_FCF_YIELD   = [2.8,   1.9,   1.6,    2.9];
const PAST_CAPEX_REV   = [7.6,   7.7,   7.8,    6.5];
const PRICE_M_LABELS = ["2022-08","2022-09","2022-10","2022-11","2022-12","2023-01","2023-02","2023-03","2023-04","2023-05","2023-06","2023-07","2023-08","2023-09","2023-10","2023-11","2023-12","2024-01","2024-02","2024-03","2024-04","2024-05","2024-06","2024-07","2024-08","2024-09","2024-10","2024-11","2024-12","2025-01","2025-02","2025-03","2025-04","2025-05","2025-06","2025-07","2025-08","2025-09","2025-10","2025-11","2025-12","2026-01","2026-02","2026-03","2026-04","2026-05","2026-06","2026-07"];
const PRICE_M = [86.92,75.52,84.15,83.26,77.65,91.03,86.43,92.94,91.88,108.96,112.39,116.60,117.77,111.79,116.37,137.15,141.30,153.08,154.27,152.48,138.67,131.39,157.33,162.88,171.00,178.88,186.60,209.89,212.02,203.68,185.95,159.23,191.00,202.22,205.62,188.62,183.49,184.06,183.86,162.48,153.19,117.01,108.01,104.55,88.31,124.37,99.28,111.23];
const PRICE_M_DD = [0.0,-13.1,-3.2,-4.2,-10.7,0.0,-5.1,0.0,-1.1,0.0,0.0,0.0,0.0,-5.1,-1.2,0.0,0.0,0.0,0.0,-1.2,-10.1,-14.8,0.0,0.0,0.0,0.0,0.0,0.0,0.0,-3.9,-12.3,-24.9,-9.9,-4.6,-3.0,-11.0,-13.5,-13.2,-13.3,-23.4,-27.8,-44.8,-49.1,-50.7,-58.4,-41.3,-53.2,-47.6];
const PAST_EVENTS = [
  { idx: 1,  label: "2022 Rate-Shock Low",  note: "Sep 2022 — the Fed's rate-hiking cycle hit SaaS multiples across the board (discount-rate math punishes long-duration growth stocks hardest). NOW's monthly close bottomed near $75.52, down from prior highs, even as the underlying business kept compounding double-digit revenue growth." },
  { idx: 16, label: "AI Narrative Rally",    note: "Dec 2023 — post-Nvidia AI-capex enthusiasm and NOW's own early Now Assist/GenAI product cycle re-rated growth software broadly. Monthly close crossed $141 for the first time in this window." },
  { idx: 28, label: "ATH Run",               note: "Dec 2024–Jan 2025 — subscription growth stayed in the low-20s% YoY and the Now Assist/AI Pro attach story accelerated. Intramonth ATH of $234.08 hit Jan 28, 2025 — the same day as a beat-and-raise Q4 2024 print, echoing the pattern that would later repeat on Q2 2026's earnings day." },
  { idx: 40, label: "'AI Eats SaaS Seats' Selloff Begins", note: "Jan 2026 — the market narrative shifted hard: agentic AI's ability to automate workflows previously requiring human seats became a bear case for the entire enterprise-SaaS group (NOW/CRM/WDAY), not just a cost story. Monthly close fell to $117.01, already -45% off the January 2025 ATH." },
  { idx: 44, label: "Derate Trough",         note: "Apr 10, 2026 — the deepest point of the selloff, an intraday/daily close of $83.00, down -64.5% from the Jan 2025 ATH. This is the single dislocation this thesis' reversion clock is anchored to — the open question was always whether this was a real demand break or a sentiment overshoot." },
  { idx: 47, label: "Q2 2026 Beat-and-Raise", note: "Jul 22, 2026 — subscription revenue +24.5% YoY, AI ACV past $1B, renewal rate held at 98%, FY26 guide raised. Stock dipped to $95.46 intraday same day, then rallied to $115.76 within a week — the first genuine relief rally of this derate cycle, settling at $111.23 by month-end." },
];

const VAL_CONFIG = {
  ntm_eps:               4.45,
  shares_b:               1.04,
  fcf_ntm_b:               5.68,
  risk_free_pct:           4.65,
  default_discount_pct:   10.0,
  default_terminal_pe:     25,
  dcf_years:                5,
  capex_fy26_guide_b:     1.1,      // ~6.5-7% of ~$16.2B guided total revenue
  prior_fy_rev_b:         13.278,    // last full fiscal year actual revenue
  prior_fy_label:         "2025",
  pe_trough: 18, pe_bear_hi: 21, pe_normal_lo: 23, pe_normal_hi: 30, pe_bull_lo: 33, pe_peak: 45,
  peers: [
    { t: "NOW",  fpe: 27.4,  ev_eb: 34.2, fcf_y: 4.0, note: "System-of-record ITSM/HR/CSM workflow platform" },
    { t: "CRM",  fpe: 13.2,  ev_eb: 12.3, fcf_y: 9.7, note: "CRM system-of-record; deeper multiple derate, actively rewriting Agentforce pricing" },
    { t: "WDAY", fpe: 14.4,  ev_eb: 28.4, fcf_y: 7.5, note: "HR/finance system-of-record; similarly derated on AI-seat-disruption fear" },
    { t: "SNOW", fpe: 138.7, ev_eb: "n/m", fcf_y: 1.2, note: "Data-cloud platform; still priced rich despite negative EBITDA — the group's outlier, not the norm" },
  ],
};

const SIGNAL_HELP = {
  "Q2 2026 Subscription Rev YoY": "ServiceNow's core recurring-revenue line, up 24.5% year-over-year to $3.877B in Q2 2026 — a beat against the prior guide's implied run-rate. This is the single number that most directly tests the bear case: if AI agents were genuinely displacing seat-based demand, this line would be the first to show it. It isn't yet.",
  "Q3 2026 Subscription Rev Guide": "Management's own guidance for the current quarter (issued on the Jul 22, 2026 Q2 call): $3,975–3,980M, implying +20.5% YoY growth. Not yet reported — confirmed on the ~Oct 28, 2026 call. Landing inside the range keeps the base case intact; a miss would be the first guide miss of this cycle.",
  "FY26 Non-GAAP Op Margin Guide": "Management's full-year operating-margin guidance: 31.5% non-GAAP, alongside an 81% non-GAAP subscription gross margin and 35% FCF margin. This is the 'monetizes, not just costs' test for the AI build-out — margin holding or expanding while AI ACV scales is the difference between AI as a paid feature and AI as a discount weapon customers use to negotiate down.",
  "AI ACV / Agentic Adoption": "Annual contract value tied specifically to AI products (Now Assist, AI Agents, AI Control Tower). Crossed $1B in Q2 2026, with agentic deployments up 9x in nine months and AI Control Tower adoption past 500 customers in six months. The crux question this thesis can't fully resolve yet: is this genuinely incremental monetization layered on top of the core platform, or is some of it relabeled/cannibalized seat-based ARR that would have shown up as ordinary expansion anyway? Watch alongside cRPO — if AI ACV grows while cRPO decelerates, that's the tell for cannibalization.",
  "Renewal Rate (98% floor)": "The percentage of existing subscription contract value that renews each year — ServiceNow's best-in-class 98% reflects a real switching-cost moat: once a Fortune 500 customer has built years of custom workflow logic and integrations on the platform, ripping it out is a multi-year compliance-risk project, not a vendor swap. This is the single number a genuine 'AI eats SaaS seats' break would show up in first, before it shows up in revenue growth.",
};
const TAG_HELP = {
  BEAT: "doing better than expected — a good sign.",
  MATCH: "roughly in line with expectations — steady, no surprises.",
  MISS: "falling short of expectations — a worry.",
  WATCH: "not decided yet — keep an eye on it.",
};

const THESIS_ITEMS = [
  { key: "subRevGuide",     label: "Subscription revenue landing within quarterly guide", note: "Two consecutive misses would break this" },
  { key: "marginGuide",     label: "Non-GAAP operating margin holding within guided range", note: "31.5% FY26 guide — tests whether AI ACV monetizes rather than just costs" },
  { key: "renewalRate",     label: "Renewal rate holding at or above 98%",                 note: "The real-time read on whether the switching-cost moat is cracking" },
  { key: "aiCrpoDivergence", label: "AI ACV growth NOT paired with cRPO deceleration",       note: "The cannibalization tell — watch both together, not either alone" },
];
const PRICE_ZONES = [
  { label: "BEAR",    lo: 80,  hi: 93,  mid: 87,  color: "#f1564b", action: "Exit / reduce if thesis also breaking" },
  { label: "BASE",    lo: 102, hi: 134, mid: 118, color: "#e0a83b", action: "Small add OK if thesis intact" },
  { label: "BULL",    lo: 147, hi: 187, mid: 167, color: "#3fd07a", action: "Let it ride — don't chase" },
];

// ── Chart geometry / axis ranges (per-stock: depends on price scale) ─────────
const GEOM = {
  priceMin: 60, priceMax: 260,
  fanGrid: [220, 180, 140, 100, 60],
  fanYears: ["2025", "2026", "2027"],
  trackMin: 60, trackMax: 260,
  trackGrid: [230, 180, 130, 80, 60],
  kpiMin: 3.0, kpiMax: 5.2,
  visLo: 70, visHi: 220,
  nowZoneLo: 100, nowZoneHi: 135,
};

/* ── TEXT — every company-specific narrative/tooltip the engine renders. ──────
   Values are strings, HTML strings (rendered with dangerouslySetInnerHTML), or
   template functions the engine calls with computed values. If it mentions the
   company, a quarter, a guide number, or an event, it belongs HERE, not in the
   engine — that rule is what makes the engine safely reusable across stocks. */
const TEXT = {
  // header / footer
  priceTipLive: (px, at, asOf) => `Live quote: $${px} (fetched ${at}). The price is real-time, but the scenario bands and EPS are still as of ${asOf} — only the price-derived figures (scenario returns, P/E, band position) update live.`,
  priceTipStatic: (px, asOf, liveEnabled) => `$${px} as of ${asOf} — ${liveEnabled ? "live fetch unavailable (offline or blocked), using the saved price" : "static price (live fetch disabled)"}. Next earnings: Q3 2026 (~Oct 28, 2026).`,
  footerDisclaimer: (asOf) => `Illustrative scenario framing built on public consensus & estimates as of ${asOf} — not a prediction and not financial advice. Price ranges are scenario mid-bands; KPI markers are positional, not literal. Valuation ruler: forward non-GAAP EPS × P/E multiple. Data inputs will move with every print. Next earnings: Q3 2026 (~Oct 28, 2026).`,

  // fan chart
  fanHistory: "The solid white line is NOW's actual price since Q1 2025. The run down from a $234.08 all-time high (Jan 28, 2025 — also a beat-and-raise day) to an $83.00 trough (Apr 10, 2026) was driven almost entirely by the market pricing in an 'AI agents eat SaaS seats' derate, not a business slowdown — subscription revenue growth never dropped out of the low-20s% YoY through the entire selloff.",
  fanNow: (px) => `NOW trades around $${px} right now — a genuine relief rally off the $83.00 April 2026 trough after Q2 2026 beat on every disclosed line: $3.877B subscription revenue (+24.5% YoY), AI ACV past $1B, 98% renewal rate. Management guided Q3 2026 to $3,975–3,980M subscription revenue and raised FY26 guidance to $15.76–15.78B. Everything left of this dot is history; everything right is forecast.`,
  fanPastDot: (q, p) => `At the end of ${q}, NOW was around $${p}.`,

  // scenario selector
  segmentedExplain: {
    bear: ["The pessimistic scenario", "Click to see what NOW looks like if the 'AI eats SaaS seats' bear case is actually right — subscription revenue growth decelerates toward high-single-digits, renewal rate cracks below 98%, or AI ACV growth turns out to have been cannibalizing seat ARR all along. Price would likely fall to the $80–93 range."],
    base: ["The most-likely scenario", "Click for the base view — Q3 2026 lands inside the newly-raised $3,975–3,980M subscription guide, AI ACV keeps scaling without cRPO decelerating, and NOW keeps compounding EPS while the multiple grinds back toward normal. Price recovers toward the $102–134 range."],
    bull: ["The optimistic scenario", "Click to see the upside — Q3/Q4 2026 beat the raised guide, cRPO reaccelerates above 22%, and the market re-rates NOW from today's derated ~25x back toward the 33–42x band it traded at before the 2025-2026 selloff. Price could reach $147–187."],
  },

  // KPI column
  kpiBaseline: (val) => `This is the most recent real number: NOW reported $${val}B in subscription revenue last quarter (+24.5% YoY, a beat against the prior guide's implied run-rate). The bars to the right are scenario forecasts for where it goes next.`,
  kpiForecast: (label, val) => `In this scenario, quarterly subscription revenue reaches ~$${val}B by ${label}. Management's Q3 2026 guide is $3,975–3,980M — taller bar = faster growth holding up.`,

  // reversion clock
  reversion: {
    header: "REVERSION CLOCK · APR 2026 'AI EATS SAAS SEATS' DISLOCATION",
    timeTip: "In early 2026, the market broadly repriced enterprise-SaaS names (NOW, CRM, WDAY) on fear that agentic AI would let customers consolidate seats rather than buy more of them. NOW fell to a trough near $83, down -64.5% from its Jan 2025 all-time high. This bar shows how far along the recovery is — and it has been choppy, tested twice, not a clean V.",
    priceTip: (trough, baseFloor, now) => `Stock bottomed near $${trough} on Apr 10, 2026 and needed to reach $${baseFloor} to re-enter the base band. At $${now}, it sits just above that floor — a real recovery, but one that has round-tripped below the floor more than once since the trough.`,
    footerHtml: (baseFloor, precedentDays, now) => `The 2026 'AI eats SaaS seats' selloff was a sentiment/multiple shock, not a business miss — subscription revenue growth never dropped below the low-20s% YoY through the entire decline. Price has spent ${precedentDays} days since the trough testing and re-testing the $${baseFloor} base floor, now sitting at $${now} on the back of Q2's beat-and-raise. The next dislocation risk to watch is a real deceleration in subscription revenue or cRPO — not a repeat of this one, but the same playbook applies: <span style="color:#e0a83b;font-weight:700">has the thesis actually broken, or is this fear?</span>`,
  },

  // track record
  track: {
    lastDot: (post, nowPx) => `After Q2 2026 earnings (Jul 22), NOW initially fell to $95.46 intraday — a reflexive 'sell the news' dip — before rallying to $115.76 within a week and settling around $${post}. Price sits at $${nowPx} today. Next dot: Q3 2026 earnings (~Oct 28, 2026).`,
    pastDot: (q, post) => `After ${q} earnings, NOW actually traded around $${post}. Compare this dot to the colored bars behind it to see if the predicted range was right.`,
    readoutHtml: (hits, n, nowPx) => `Price has tracked <span style="color:#3fd07a;font-weight:700">base-or-better in ${hits} of ${n} quarters</span> in this reconstructed window. The most interesting recent stretch is Q4 2025 into Q1 2026: two straight quarters landing in the BEAR band even as subscription revenue kept growing in the low-20s% — pure multiple compression on 'AI eats SaaS seats' fear, not a demand miss. Q2 2026 is the first quarter to land back in BASE. Next directional catalyst: <span style="color:#e0a83b;font-weight:700">Q3 2026 earnings (~Oct 28, 2026)</span> — subscription revenue and cRPO vs the newly-raised guide.`,
    footnote: "⚠ This is a brand-new thesis build — TRACK_ALL bands are reconstructed now from approximate historical NTM EPS × regime multiples, not archived in real time. Treat older quarters (2025) as directional only; 2026 quarters carry higher confidence since the regime is better known.",
  },

  // THE CURRENT tab
  current: {
    statusNarrative: {
      broken: "Multiple signals missed. Thesis is under pressure — review the kill-switch criteria.",
      watch:  "Revenue beat but margin, renewal rate, or the AI ACV/cRPO pairing disappointed. Core thesis tracking — the Q3 2026 print (~Oct 28) is the next test. Not broken, but watch closely.",
      intact: "All key signals tracking as expected. Subscription revenue growth, renewal rate, and the AI ACV monetization story remain intact — Q2 2026 beat on every disclosed line, and the stock's initial 'sell the news' dip fully reversed.",
    },
    panelTipStory: "Checks whether the original reasons to own NOW are playing out. Counts signals from the Q2 2026 print and Q3 2026 guide — subscription revenue, operating margin, renewal rate, AI ACV vs cRPO. 0–1 miss = thesis intact. 2 misses = watch. 3+ = exit. Click to see KPI bars and kill-switch.",
    watchChipHtml: `🔑 WATCH: Q3 2026 sub rev vs <span style="color:#e0a83b;font-weight:700">$3,975–3,980M</span> guide · ~Oct 28, 2026`,
    exitChipHtml: `⚠ EXIT IF: sub rev decelerates to high-single-digits, or renewal rate breaks below 97%`,
    verdictBody: {
      broken:     (px) => `NOW at $${px}: kill-switch criteria met. Price position is irrelevant — signals say the AI-monetization thesis is no longer playing out. The question is not whether to add; it is how much to reduce.`,
      watchBelow: (px) => `NOW at $${px} sits below the base floor but signals are mixed. Price is attractive, but adding into a weakening thesis is the wrong sequence. Wait for the Q3 2026 print (~Oct 28) to confirm or deny the pattern before deploying capital.`,
      below:      (px) => `NOW at $${px} sits below the base floor with the thesis intact — Q2 2026 subscription revenue, AI ACV, and renewal rate all beat/held, and FY26 guidance was raised. The market spent 18 months pricing in an 'AI eats SaaS seats' story that Q2's numbers directly contradict; the fundamentals say this is sentiment/positioning still working itself out, not demand destruction.`,
      inBase:     (px, statusWord) => `NOW at $${px} is inside the base range. Thesis ${statusWord} and price is fair — a real ~25% discount to the ~$140 average analyst target on a name still growing subscription revenue at +24.5% YoY. Watch Q3 2026 subscription revenue and cRPO vs the raised guide around Oct 28 — a beat with cRPO reaccelerating opens the bull case; a miss or an AI-ACV/cRPO divergence reopens the bear.`,
      above:      (px) => `NOW at $${px} is above the base ceiling. The bull case — a second guide raise with cRPO reaccelerating — needs to play out to justify entry. If already in, hold. If adding, wait for a pullback toward the base floor.`,
    },
    kpiTitle: "Subscription Revenue",
    kpiSub: "$B quarterly · HIGHER BETTER",
    kpiMeasures: "Quarterly subscription revenue — ServiceNow's core recurring-revenue line across IT Service Management, IT Operations, HR, Customer Service Management, and now AI Agents/Now Assist. Guided $3,975–3,980M for Q3 2026, +20.5% YoY.",
    kpiRequires: {
      bull: "Subscription revenue beats guide every quarter and accelerates toward $5.05B by Q2 2027, confirming AI ACV is genuinely incremental and cRPO reaccelerates alongside it.",
      base: "Subscription revenue lands inside guide each quarter and scales toward $4.68B by Q2 2027, in line with the newly-raised FY26 guide and steady mid-20s% YoY growth.",
      bear: "Subscription revenue growth decelerates toward high-single-digits and stalls near $4.05B by Q2 2027, signaling the Q2 2026 beat-and-raise was a peak, or the AI-ACV/cRPO divergence confirms seat cannibalization.",
    },
    group1Title: "Subscription Growth &amp; Margin Momentum",
    group2Title: "AI Monetization &amp; Moat Durability Risk",
    killSwitch: "Subscription revenue growth decelerating back toward high-single-digits YoY, renewal rate breaking meaningfully below 98%, or AI ACV growth pairing with a cRPO deceleration in the same quarter (the cannibalization tell) — exit / reduce. That is demand destruction or moat erosion, not noise.",
    priceBanner: {
      below:  (px, baseLo) => `At $${px}, price is $${baseLo - px} below the base floor. Market is still pricing in residual 'AI eats SaaS seats' fear even after a beat-and-raise — not a fundamentals problem on the evidence so far. Historically the window patient buyers use.`,
      inBase: (px) => `At $${px}, price is inside the base range. Fair value — a real discount to the average analyst target, not a crisis price.`,
      above:  (px, baseHi) => `At $${px}, price is $${px - baseHi} above the base ceiling. The bull thesis needs to play out in full.`,
    },
    moodBanner: (currentPE, loPE, hiPE) => `At ${currentPE}× forward P/E, the market is pricing in continued mid-20s% subscription growth and the Q3 2026 guide ($3,975–3,980M) landing roughly as promised — the multiple sits at the low end of its normal band (${loPE}–${hiPE}×), a real compression from the elevated 2023-2024 regime, because 18 months of 'AI eats SaaS seats' fear derated the stock faster than the business actually slowed.`,
    cagrNotes: {
      low:  "Low bar — not priced for perfection. Even moderate execution on subscription growth justifies the price.",
      mid:  "Moderate bar — requires AI ACV to keep scaling without a cRPO deceleration alongside it.",
      high: "High bar — requires cRPO to reaccelerate above 22% and a second consecutive guide raise.",
    },
    fy26CardTip: (fy26) => `Adding Q1+Q2 2026 actuals to the base-case Q3–Q4 2026 subscription-revenue projections gives a full-year run rate of roughly $${fy26}B, up from $10.9B subscription revenue in 2025 (using the FY26 subscription guide of $15.76–15.78B as the anchor) — comfortably inside management's own raised guide. That's what the base case — and roughly today's price — already assumes. The bull case requires AI ACV to push meaningfully above this.`,
    fy26CardHtml: (fy26, growthPct) => `Q1+Q2 2026 actuals plus base-case Q3–Q4 projections sum to roughly <span style="color:var(--blue-soft);font-weight:700">$${fy26}B</span> for full-year 2026 subscription revenue — the growth path today's price already assumes. 2025 total revenue was <span style="color:#3fd07a">$13.278B</span>, so this implies <em>~${growthPct}%</em> YoY total-revenue growth.`,
    peerCommentary: (currentPE) => `At ${currentPE}× NTM P/E, NOW trades well above CRM (13.2×) and WDAY (14.4×) — both of which have derated even further on the identical 'AI eats SaaS seats' fear — but at a steep discount to SNOW (138.7×), which trades rich despite negative EBITDA. NOW's own 98% renewal rate and Q2 beat-and-raise argue its moat is holding better than CRM's (management has rewritten Agentforce pricing three times in 18 months, itself a tell) or WDAY's — the peer spread here is really a spread in how convincingly each name has rebutted the same bear thesis, not a uniform sector re-rating.`,
  },

  // THE FUTURE tab
  future: {
    scenarioTips: {
      bear: "Triggered by: subscription revenue decelerating toward high-single-digits, renewal rate breaking below 98%, or AI ACV growth pairing with a cRPO slowdown (cannibalization). Multiple compresses toward the 18–21× trough zone. Note: at current price, bear downside and base upside are roughly symmetric — this is a genuine two-sided setup, not a one-way bet.",
      base: (loPE, hiPE) => `Subscription revenue lands within the newly-raised guide each quarter; AI ACV keeps scaling without a cRPO deceleration. P/E holds in the normal ${loPE}–${hiPE}× band. Meaningfully positive return from here as the stock re-tests levels last seen in mid-2025.`,
      bull: (currentPE) => `Subscription revenue and cRPO both beat the raised guide; AI ACV re-accelerates and full-year guidance gets raised a SECOND time. Multiple re-rates from ~${currentPE}× toward the bull zone, closing much of the gap to the pre-selloff regime.`,
    },
    downsideChevronTip: "Kill-switch: subscription revenue deceleration to high-single-digits, renewal rate below 97%, or AI ACV growing while cRPO decelerates = exit / reduce.",
    dislocEventName: "the Apr 2026 'AI eats SaaS seats' trough",
    dislocLabel: "SINCE APR 2026 DERATE TROUGH",
    bearPriceTip: (bearMid, bearLo, bearHi, peTrough, peBearHi) => `$${bearMid} is the midpoint of the bear case range ($${bearLo}–$${bearHi}). This assumes subscription revenue growth decelerates back toward high-single-digits or renewal rate cracks below 98%, and the multiple compresses toward the ${peTrough}–${peBearHi}× trough zone. The kill-switch is a confirmed AI-ACV/cRPO divergence or a guide miss — if it triggers, do not average down.`,
    killSwitchTip: "A kill-switch is a pre-committed exit rule you set BEFORE you own the position — when you are thinking clearly. If subscription revenue growth decelerates to high-single-digits, renewal rate breaks below 97%, or AI ACV growth pairs with a cRPO deceleration in the same quarter, the thesis is broken: that's demand weakness or moat erosion, not timing. Do not average down into a broken thesis — the market is telling you something. No debate, no rationalisation. Exit.",
    killSwitchTipNote: "Deceleration, renewal-rate break, or the AI-ACV/cRPO divergence. Any one. No debate.",
    killSwitchHtml: `<strong style="color:var(--title)">Subscription revenue decelerating to high-single-digits, renewal rate breaking below 97%, or AI ACV growth pairing with a cRPO deceleration in the same quarter</strong> → exit or reduce. No debate. Do not average down into a broken thesis.`,
    nextCheck: "Next check: Q3 2026 earnings (~Oct 28, 2026)",
    downsideFootnote: (px, peTrough, peBearHi) => `Bear case scenario: subscription growth decelerates or renewal rate breaks. Assumes a multiple compression toward ${peTrough}–${peBearHi}× on roughly flat EPS growth. Position loss is illustrative at $${px} entry.`,
    multipleSummary: (peNow, loPE, hiPE) => `At ~${peNow}× NTM P/E, NOW sits at the low end of its historical normal range (${loPE}–${hiPE}×) — a real compression from the elevated 2023-2024 regime, driven by 18 months of 'AI eats SaaS seats' fear rather than any actual deceleration in subscription revenue growth.`,
    peBarTipSuffix: "NOW's GAAP EPS is depressed by heavy stock-based compensation relative to non-GAAP — this P/E uses the blended NTM non-GAAP consensus, the like-for-like number analysts and the company itself both reference.",
    deepValueZoneNote: "Historically cheap for this business. Last seen briefly at the April 2026 trough — a real entry window if the thesis holds, not a permanent discount.",
    dislocPrecedent: (baseFloor) => `Historical precedent: this thesis has no prior full reversion cycle to point to (brand-new build) — the Apr 2026 trough is the dislocation this reversion clock is anchored to. Base floor: $${baseFloor}.`,
    regretHtml: (currentPE) => `Q3 2026 subscription revenue and cRPO <strong style="color:#3fd07a">materially beat the $3,975–3,980M guide and reaccelerate above 22%</strong> AND full-year guidance is raised a SECOND time. That would confirm the Q2 2026 beat-and-raise was the start of a trend, not a one-off relief rally, re-rate the stock from ~${currentPE}× toward the bull zone, and close today's entry window.`,
    regretTip: "Charlie Munger's inversion: instead of asking 'why should I buy?', ask 'what would I have to believe happened, in hindsight, to wish I had bought more?' If Q3 2026 beats the newly-raised guide with cRPO reaccelerating, today's entry window — a real discount on a still-24%-growing business — will close fast. This question is not about FOMO — it is about sizing correctly for your conviction.",
    chips: [
      { label: "KILL-SWITCH: DECEL / RENEWAL BREAK / CANNIBALIZATION → EXIT", col: "#f1564b" },
      { label: "REGRET IF: Q3 BEATS + CRPO REACCELERATES + FY GUIDE RAISED AGAIN", col: "#3fd07a" },
      { label: "NEXT CHECK: ~OCT 28, 2026 EARNINGS",          col: "#2f6dff" },
    ],
    signalFootnote: (ntmEps) => `P/E uses blended NTM non-GAAP EPS $${ntmEps} — NOW's GAAP EPS carries heavy SBC that non-GAAP strips out, the like-for-like basis analysts and the company both use.`,
  },

  // THE PAST tab
  past: {
    cardTips: {
      durability: (revCagrPct) => `Looks at the last 4 years of Revenue, Gross Margin, and Free Cash Flow (Wisesheets' free-tier plan caps history at 5 years). We want upward trends that hold — not spike-and-crash. NOW has grown revenue at ~${revCagrPct}% CAGR almost entirely organically, with gross margin holding a tight 77-79% band and FCF growing more than 2× even through the 2025-2026 stock derate.`,
      value: (latestROIC) => `ROIC (Return on Invested Capital) measures how efficiently management deploys capital. Above WACC (~9-11% for a mature, profitable SaaS platform) = value creation. NOW's ROIC has climbed from a mid-single-digit level in 2022 to ${latestROIC}% in 2025 as operating leverage kicked in — genuine margin expansion, not just top-line growth. (ROIC is not in Wisesheets' metric catalog for this account; this series is a web-sourced estimate, not an SEC-filed figure — treat as directional.)`,
      capex: (peakCapex, latestCapex, latestFCF) => `Capex as a % of revenue shows how much of every dollar gets reinvested before cash reaches shareholders. NOW is a comparatively capital-light SaaS platform — capex/revenue has stayed in a narrow 6.5-7.8% band across this window, easing to ${latestCapex}% in 2025 even as FCF hit a record $${latestFCF}B. The real capex story here is R&D and go-to-market spend on AI products, not physical infrastructure.`,
      mood: (evNow, evAvg) => `EV/EBITDA vs the company's own recent history tells you whether the market is paying a premium or discount for this business. NOW's EV/EBITDA fell from a ~90-94× range in 2022-2024 to ~52× in 2025 and sits at roughly ${evNow}× today — the 2025-2026 derate compressed the multiple faster than EBITDA (which kept growing) could catch up.`,
    },
    stats: [
      { html: `Revenue <span style="color:#3fd07a;font-weight:700">$7.2B → $13.3B</span> (4Y)`, tipTitle: "Revenue (4-year)", tipBody: "NOW grew annual revenue from $7.245B (2022) to $13.278B (2025) — a ~22% CAGR, almost entirely organic. Growth has held in the low-to-mid-20s% range through a rate-shock SaaS bear market (2022), an AI-narrative rally (2023-2024), and an 'AI eats SaaS seats' derate (2025-2026) — the business kept compounding through all three regimes." },
      { html: `FCF <span style="color:#3fd07a;font-weight:700">$2.2B → $4.6B</span> (4Y)`, tipTitle: "Free Cash Flow (4-year)", tipBody: "FCF grew from $2.173B (2022) to a record $4.576B (2025) — more than 2× in 4 years, with FCF margin actually expanding (30% → 34%) even as the stock itself fell -30% over the same window. This is the clearest evidence the stock's derate was a multiple story, not a cash-generation story." },
      { html: `EV/EBITDA <span style="color:#f1564b;font-weight:700">90x → 52x</span> (4Y)`, tipTitle: "EV/EBITDA compression (4-year)", tipBody: "EV/EBITDA compressed from a ~90-94x range in 2022-2024 to ~52x by year-end 2025 (and roughly 34x today) even as EBITDA itself more than tripled over the period ($859M → $2.999B) — the multiple did almost all the work in this derate, not the earnings." },
    ],
    verdictBody: "NOW has compounded revenue at ~22% annually for the last 4 years almost entirely organically, with gross margin holding a tight 77-79% band and FCF more than doubling — through a 2022 rate-shock bear market, a 2023-2024 AI-narrative rally, and a 2025-2026 'AI eats SaaS seats' derate that cut the stock roughly in half. The business itself never missed a beat through any of these three very different market regimes; the open question the CURRENT and FUTURE tabs address is whether the AI ACV growth crossing $1B is genuinely incremental to that organic growth, or partially cannibalizing it — the numbers so far (cRPO not decelerating) argue for incremental, but this is the thing to keep checking.",
    banners: {
      durability: (revCagrPct, rev0, rev9, gmDelta, latestGM, fcf0, latestFCF) => `Revenue compounded at ~${revCagrPct}% annually from $${rev0}B (2022) to $${rev9}B (2025) — almost entirely organic. Gross margin held a tight band around ${latestGM}% (${gmDelta} pts of range across the window), even through the 2025-2026 derate. FCF grew from $${fcf0}B to $${latestFCF}B.`,
      value: (latestROIC) => `ROIC of ${latestROIC}% (2025, web-sourced estimate) exceeds a typical WACC of 9-11% for a mature SaaS platform, meaning each dollar reinvested creates more than a dollar of value — and it's been rising steadily as operating leverage kicks in, not falling.`,
      capex: (latestCapex, peakCapex, latestFCF, fy26Guide) => `Capex/revenue of ${latestCapex}% (2025) sits well below the ${peakCapex}% high of this window even as FCF hit a record $${latestFCF}B. NOW is capital-light relative to the AI-infrastructure names — its 'capex' story is really an R&D/go-to-market spend story on AI products, and the FY26 FCF-margin guide of 35% is the clearest test of whether that spend is monetizing.`,
      mood: (evNow, evAvg) => `EV/EBITDA of ${evNow}× sits well below the ${evAvg}× this window's early-period average — the multiple has compressed by more than half since 2022-2024 even as EBITDA itself more than tripled. The price sits well off its all-time high today, recovering from a real drawdown — the kind of setup where the next move depends on whether the market believes the derate has fully priced the AI-disruption risk, or whether more of it is still to come.`,
    },
    revAnnotationsHtml: `<span>2022: <span style="color:var(--tx3)">$7.2B</span> (rate-shock SaaS bear market)</span><span>2025: <span style="color:var(--tx3)">$13.3B</span> (AI ACV layering on top of core growth)</span>`,
    roicNote: "Green >15% · Amber 5–15% · Red <5% — NOW crossed from amber into a stronger amber/approaching-green band as margins expanded",
    fcfYieldNote: "FCF yield moved with the stock's own re-rating (up in 2022 rate-shock lows, down as the stock re-rated 2023-24, back up in the 2025-2026 derate) — not with FCF itself, which grew every year.",
    capexAnnotationsHtml: `<span>2024: <span style="color:#f1564b">7.8%</span> (AI product build-out peak)</span><span>2025: <span style="color:#3fd07a">6.5%</span> (easing as AI revenue scales)</span>`,
    footnotes: {
      durability: "NOW's growth is organic — no transformative-acquisition playbook to adjust for. Revenue growth held in the low-to-mid-20s% YoY range through three very different market regimes in this window (2022 rate-shock bear market, 2023-2024 AI-narrative rally, 2025-2026 'AI eats SaaS seats' derate), which is the strongest evidence available that the recent stock decline was a sentiment/multiple event, not a demand event.",
      value: "ROIC data is not available from Wisesheets for this account (not in the free-tier metric catalog) — the 4.8%/7.7%/10.6%/12.2% series (2022-2025) is a web-sourced estimate, treated as directional judgment rather than an SEC-filed number. The clear rising trend is consistent with the filed operating-margin expansion (4.9% → 13.7% over the same window), which IS Wisesheets-sourced and corroborates the direction if not the exact ROIC level.",
      capex: "Capex/revenue has stayed in a narrow 6.5-7.8% band across this window — NOW is a capital-light SaaS platform relative to AI-infrastructure names carrying 30-50%+ capex/revenue ratios. The real 'spend' to watch here is R&D and go-to-market investment in AI products (Now Assist, AI Agents, AI Control Tower), which shows up in operating margin, not capex — and operating margin has expanded every year in this window even as that spend ramped, the clearest 'monetizes, not just costs' evidence available.",
      mood: "The scenario bands on the other tabs use forward non-GAAP P/E, not EV/EBITDA — NOW's GAAP EPS is heavily distorted by stock-based compensation, so non-GAAP is the like-for-like basis analysts and the company both use. EV/EBITDA is shown here purely to track cross-cycle mood since it's capital-structure-neutral. The multiple sat in a rich 90-94× range through 2022-2024 when the AI-monetization story was still mostly narrative, then compressed to ~52× by year-end 2025 and roughly 34× today as 2025-2026's derate repriced the stock faster than EBITDA — which kept growing every year — could catch up.",
    },
    priceChartTitle: "NOW PRICE · 4-YEAR MONTHLY · 2022–2026",
    priceChartSub: "$ per share · dashed lines = key events",
    priceNowTip: (px, isATH) => `$${px} — where NOW trades today, ${isATH ? "also the highest monthly close in this window" : "well off the January 2025 all-time high"}. The chart shows organic compounding with a sharp 2022 rate-shock drawdown, a 2023-2024 AI-narrative rally to a fresh ATH, then the deepest drawdown in this window during the 2025-2026 'AI eats SaaS seats' derate (-64.5% intraday from the ATH to the April 2026 trough).`,
    ddTip: (minDD) => `${minDD}% — the deepest drop from a prior all-time high in this window (monthly-close basis; the intraday figure using the exact $83.00 trough and $234.08 ATH is closer to -64.5%). This occurred during the 2025-2026 'AI eats SaaS seats' derate — a sentiment/multiple event, not a demand break, since subscription revenue growth never dropped out of the low-20s% YoY through the decline.`,
    ddAnnotationsHtml: `<span>Max drawdown: <span style="color:#f1564b">−58.4%</span> (Apr 2026, monthly-close basis; −64.5% intraday)</span><span>Current: <span style="color:#e0a83b;font-weight:700">−47.6%</span> from ATH — recovering, not there yet</span>`,
  },
};
