/* ╔══════════════════════════════════════════════════════════════════════════╗
   ║   AVGO · thesis-data.js — ALL per-stock content lives here.              ║
   ║   ███  EDIT EVERYTHING IN THIS FILE EACH QUARTER  ███                    ║
   ║                                                                          ║
   ║   The rendering engine (../engine/thesis-engine.js) contains ZERO        ║
   ║   company-specific strings — every number, narrative, and tooltip        ║
   ║   that mentions AVGO is in this file. Quarterly touch = edit this        ║
   ║   file only, then run: node tools/lint-thesis-data.js AVGO               ║
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

const TICKER_META = { ticker: "AVGO", exchange: "NASDAQ", company: "Broadcom Inc." };
const AS_OF_DATE = "2026-07-18";

// Most recent material dislocation (Q2 FY26 earnings, Jun 3 2026: AI guide miss -> ~15% drop)
const DISLOCATION_DATE = "2026-06-03";
const REVERSION_TROUGH = 385;
const REVERSION_BASEFLOOR = 420;
const REVERSION_PRECEDENT_DAYS = 45;

const CASES = {
  bear: {
    key: "bear", label: "BEAR", accent: "#f1564b", glow: "rgba(241,86,75,0.45)",
    target12: "$210 — $280",
    op: "The Q2 FY26 print exposed two cracks in the thesis: software revenue missed ($7.18B vs $7.32B expected) and Q3 FY26 AI guidance of $16B came in below analyst whispers of ~$17.2B — enough to erase 15% of market cap in two days. If this guidance pattern recurs (AI beats but next-quarter guide disappoints), Hock Tan's $100B FY2027 AI target starts looking like a ceiling rather than a floor. VMware churn accelerates as enterprises resist renewed price hikes, ARR growth stalls below 10%, and the market re-prices AVGO at 20–23x on cut FY2027 EPS of ~$9–10. A newer, structurally different risk (added 2026-07-18): Amazon disclosed a custom network topology ('Resilient Network Graphs') claiming up to 45% cost savings vs. merchant-switch fat-tree networks — the first hard evidence of a hyperscaler substituting owned network IP for the Jericho/Tomahawk silicon AVGO sells into AI clusters. One data point isn't a trend, but it's a networking-segment threat the bear case didn't previously name at all.",
    breaks: "AI revenue Q3 FY26 prints $16B+ as guided AND Q4 FY26 AI guidance steps up materially; VMware ARR reaccelerates above 15%; no second hyperscaler discloses a comparable custom-network deployment.",
    requires01: "Q3 FY26 AI revenue misses the $16B guide; VMware ARR decelerates below 10%",
    requires02: "Software margin compression or a second consecutive guide miss, OR a second hyperscaler (Google, Microsoft, Meta) discloses a custom-network deployment comparable to Amazon's RNG",
  },
  base: {
    key: "base", label: "BASE", accent: "#e0a83b", glow: "rgba(224,168,59,0.40)",
    target12: "$390 — $460",
    op: "Q2 FY26 delivered: AI revenue beat ($10.8B vs $10.7B guide), non-GAAP EBITDA margin expanded to 69%, and hyperscaler volume commitments are now quantified — Anthropic 5+ GW starting 2027, OpenAI 1.3 GW in 2027, Meta 3 GW through 2028. The $16B Q3 FY26 AI guide looks soft vs. whispers, but reflects real wafer-start timing, not demand destruction. The stock repriced 15% lower to the mid-$380s, which at ~26–28x NTM earnings is a more defensible multiple than pre-earnings. Broadcom executes Q3 near the $16B AI mark, VMware stabilizes, and the $100B FY2027 target remains intact — enabling a re-rate back toward $420–460 over the next two quarters. Added 2026-07-18: Amazon's custom 'Resilient Network Graphs' topology (up to 45% cheaper than merchant-switch fat-tree networks) is a new networking-segment risk to watch, distinct from the already-tracked XPU-design-win risk — one data point, not yet a trend.",
    breaks: "Hock Tan revises the $100B FY2027 AI chip target downward, a hyperscaler announces it is moving XPU design fully in-house, or a second hyperscaler discloses a custom-network deployment comparable to Amazon's RNG.",
    requires01: "Q3 FY26 AI revenue meets ~$16B; VMware ARR holds above 10%",
    requires02: "Non-GAAP EBITDA margin stays at 68–70%; no further guide-miss pattern",
  },
  bull: {
    key: "bull", label: "BULL", accent: "#3fd07a", glow: "rgba(63,208,122,0.45)",
    target12: "$530 — $650",
    op: "The post-earnings 15% dip is a dislocation, not a verdict. Volume commitments disclosed on the Q2 FY26 call — 5+ GW from Anthropic alone starting 2027 — imply an AI revenue ramp so large that $100B FY2027 may prove conservative. If Q3 FY26 AI revenue materially beats the $16B guide and a 7th XPU customer is announced, the market reverses the multiple compression, re-rating AVGO from ~27x back to 35–38x as investors recognize multi-year gigawatt contracts as infrastructure-grade revenue. The stock recovers above $550 within two quarters.",
    breaks: "Q3 FY26 AI revenue misses the $16B guide, confirming the Q2 guide-miss was a demand signal rather than timing. Or: a hyperscaler publicly reduces its custom ASIC commitment.",
    requires01: "Q3 FY26 AI revenue beats $16B guide; a 7th customer or expanded GW commitment is disclosed",
    requires02: "Non-GAAP EBITDA margin holds 69%+, confirming software margin resilience",
  },
};

// THESIS_HISTORY — append-only archive of the full CASES set as it stood at each
// touch, captured BEFORE that touch's Layer-2 audit rewrites it. This is a new
// migration to the engine split — nothing has been rewritten yet, so there is no
// archived vintage. Intentionally left undeclared (not an empty array — the lint
// treats an empty array as malformed) so lint-thesis-data.js reports the expected
// "no archive yet" warning. See TSM's thesis-data.js for the pattern once a future
// /update-thesis touch pushes the outgoing CASES here before overwriting them.

const FALLBACK_PRICE = 370.83;

const LIVE_PRICE = {
  enabled: true,
  symbol: "AVGO",
  provider: "yahoo",                                  // "yahoo" (keyless, proxied) | "finnhub"
  corsProxy: "https://api.allorigins.win/get?url=",
  finnhubToken: "",
};

// ALERT — buy-trigger pre-commitment. Canonical source is PF_ALERTS.AVGO in
// stocks/portfolio/portfolio-data.js; this copy is a FALLBACK for offline opens.
const ALERT = {
  symbol: "AVGO",
  buyFloor: 390,
  thesisIntact: true,
  asOf: AS_OF_DATE,
  nextEarnings: "2026-09-04",
};

// Historical price line (post-split; AVGO did a 10:1 split July 2024)
const HISTORY = [
  { q: "Q4 FY24", p: 185 },
  { q: "Q1 FY25", p: 228 },
  { q: "Q2 FY25", p: 242 },
  { q: "Q3 FY25", p: 298 },
  { q: "Q4 FY25", p: 368 },
  { q: "Q1 FY26", p: 372 },
  { q: "Q2 FY26", p: 460 },
  { q: "NOW",     p: FALLBACK_PRICE },
];

const PROJ_END = { bear: 245, base: 435, bull: 595 };
const FUTURE_Q = ["Q3 FY26", "Q4 FY26", "Q1 FY27", "Q2 FY27"];

// Q2 FY26 actuals: AI rev $10.8B (BEAT $10.7B guide), software $7.18B (MISS $7.32B est),
// non-GAAP EBITDA 69% (BEAT), Q3 FY26 AI guide $16B (MISS analyst whisper ~$17.2B)
const SIGNALS = {
  bear: [
    { name: "Q2 AI Revenue vs Guide",  unit: "$B", tag: "BEAT",  next: "Sep 2026", val: "ACTUAL $10.8B", guide: "GUIDE $10.7B", pos: 0.55 },
    { name: "XPU Customer Count",      unit: "customers", tag: "MATCH", next: "Sep 2026", val: "Still 6; GW volumes disclosed", guide: "CURRENT 6", pos: 0.42 },
    { name: "Software Revenue",        unit: "$B", tag: "MISS",  next: "Sep 2026", val: "ACTUAL $7.18B", guide: "EST $7.32B", pos: 0.30 },
    { name: "Hyperscaler Custom Networking", unit: "", tag: "WATCH", next: "Sep 2026", val: "Amazon RNG disclosed", guide: "No 2nd hyperscaler yet", pos: 0.38 },
  ],
  base: [
    { name: "Q2 AI Revenue vs Guide",  unit: "$B", tag: "BEAT",  next: "Sep 2026", val: "ACTUAL $10.8B", guide: "GUIDE $10.7B", pos: 0.55 },
    { name: "XPU Customer Count",      unit: "customers", tag: "MATCH", next: "Sep 2026", val: "Still 6; GW volumes disclosed", guide: "CURRENT 6", pos: 0.42 },
    { name: "Software Revenue",        unit: "$B", tag: "MISS",  next: "Sep 2026", val: "ACTUAL $7.18B", guide: "EST $7.32B", pos: 0.30 },
    { name: "Hyperscaler Custom Networking", unit: "", tag: "WATCH", next: "Sep 2026", val: "Amazon RNG disclosed", guide: "No 2nd hyperscaler yet", pos: 0.38 },
  ],
  bull: [
    { name: "Q2 AI Revenue vs Guide",  unit: "$B", tag: "BEAT",  next: "Sep 2026", val: "ACTUAL $10.8B", guide: "GUIDE $10.7B", pos: 0.55 },
    { name: "XPU Customer Count",      unit: "customers", tag: "MATCH", next: "Sep 2026", val: "Still 6; GW volumes disclosed", guide: "CURRENT 6", pos: 0.42 },
    { name: "Software Revenue",        unit: "$B", tag: "MISS",  next: "Sep 2026", val: "ACTUAL $7.18B", guide: "EST $7.32B", pos: 0.30 },
    { name: "Hyperscaler Custom Networking", unit: "", tag: "WATCH", next: "Sep 2026", val: "Amazon RNG disclosed", guide: "No 2nd hyperscaler yet", pos: 0.38 },
  ],
};
const MARGIN = {
  bear: [
    { name: "Non-GAAP EBITDA Margin", tag: "BEAT", next: "Sep 2026", pos: 0.65 },
    { name: "Q3 AI Revenue Guidance", tag: "MISS", next: "Sep 2026", pos: 0.22 },
  ],
  base: [
    { name: "Non-GAAP EBITDA Margin", tag: "BEAT", next: "Sep 2026", pos: 0.65 },
    { name: "Q3 AI Revenue Guidance", tag: "MISS", next: "Sep 2026", pos: 0.22 },
  ],
  bull: [
    { name: "Non-GAAP EBITDA Margin", tag: "BEAT", next: "Sep 2026", pos: 0.65 },
    { name: "Q3 AI Revenue Guidance", tag: "MISS", next: "Sep 2026", pos: 0.22 },
  ],
};

// KPI chart: AI Semiconductor Revenue ($B, quarterly actuals -> scenario projections).
// This is the single KPI that actually moves the AVGO story (CLAUDE.md's "5-6 KPIs"
// test) — total company revenue is a blend of AI chips, non-AI semi, and VMware
// software, and would bury the signal this thesis is actually about.
const KPI_HIST = 10.8;  // Q2 FY26 actual (beat $10.7B guide; Q1 FY26 was $8.4B)
const KPI_PROJ = {
  bear:  [13.0, 14.0, 15.5, 17.0],  // bear: guide-miss pattern persists; well short of $100B FY27 pace
  base:  [16.0, 19.0, 23.0, 27.0],  // base: Q3 meets $16B guide; ramp toward $100B FY27
  bull:  [18.5, 23.0, 28.0, 34.0],  // bull: Q3 beats $16B; GW commitments pull in early
};

// TRACK RECORD — append newest to end; dashboard keeps last TRACK_WINDOW.
const TRACK_ALL = [
  { q: "Q4 FY24", date: "2024-11", post: 185, reaction: "++", bear: [100,130], base: [155,195], bull: [210,260], landed: "bull",      conf: "med"  },
  { q: "Q1 FY25", date: "2025-02", post: 228, reaction: "+",  bear: [130,165], base: [195,240], bull: [255,310], landed: "base→bull", conf: "med"  },
  { q: "Q2 FY25", date: "2025-05", post: 242, reaction: "-",  bear: [155,195], base: [220,270], bull: [285,345], landed: "bear",      conf: "high" },
  { q: "Q3 FY25", date: "2025-08", post: 298, reaction: "++", bear: [175,215], base: [245,305], bull: [320,385], landed: "base→bull", conf: "high" },
  { q: "Q4 FY25", date: "2025-11", post: 368, reaction: "++", bear: [225,270], base: [300,365], bull: [385,460], landed: "bull",      conf: "high" },
  { q: "Q1 FY26", date: "2026-02", post: 460, reaction: "+",  bear: [255,305], base: [340,405], bull: [430,510], landed: "bull",      conf: "high" },
  { q: "Q2 FY26", date: "2026-06", post: 387, reaction: "--", bear: [255,310], base: [420,490], bull: [580,700], landed: "bear→base", conf: "high" },
];
const TRACK_WINDOW = 6;

// THE PAST — annual history (FY = Nov-Oct fiscal year; source: filed financials).
// AVGO is capex-light (fabless-leaning chip design + software) — the third quadrant
// tracks capex/revenue like every other migrated stock for engine consistency, but
// the real capital-allocation story here is acquisition-funded leverage (CA
// Technologies FY19, VMware FY24), which the PAST tab's narrative text calls out.
const PAST_YEARS       = ["FY16","FY17","FY18","FY19","FY20","FY21","FY22","FY23","FY24","FY25"];
const PAST_REV         = [13.24, 17.64, 20.85, 22.6,  23.89, 27.45, 33.2,  35.82, 51.57, 63.89];
const PAST_GM          = [44.9,  48.2,  51.5,  55.2,  56.6,  61.4,  66.5,  68.9,  63.0,  67.8];
const PAST_FCF         = [2.69,  5.48,  8.24,  9.27,  11.6,  13.32, 16.31, 17.63, 19.41, 26.91];
const PAST_ROIC        = [-0.9,  4.5,   10.7,  5.4,   5.7,   12.2,  19.7,  22.5,  5.6,   16.4];
const PAST_EVEBITDA    = [28.96, 16.16, 11.39, 15.78, 15.76, 16.65, 11.48, 18.23, 35.08, 50.62];
const PAST_FCF_YIELD   = [4.3,   5.1,   9.0,   7.6,   8.2,   6.2,   8.5,   5.1,   2.5,   1.6];
const PAST_CAPEX_REV   = [5.4,   6.1,   3.1,   1.9,   1.9,   1.6,   1.3,   1.3,   1.1,   1.0];
const PRICE_M_LABELS = ["2016-06","2016-07","2016-08","2016-09","2016-10","2016-11","2016-12","2017-01","2017-02","2017-03","2017-04","2017-05","2017-06","2017-07","2017-08","2017-09","2017-10","2017-11","2017-12","2018-01","2018-02","2018-03","2018-04","2018-05","2018-06","2018-07","2018-08","2018-09","2018-10","2018-11","2018-12","2019-01","2019-02","2019-03","2019-04","2019-05","2019-06","2019-07","2019-08","2019-09","2019-10","2019-11","2019-12","2020-01","2020-02","2020-03","2020-04","2020-05","2020-06","2020-07","2020-08","2020-09","2020-10","2020-11","2020-12","2021-01","2021-02","2021-03","2021-04","2021-05","2021-06","2021-07","2021-08","2021-09","2021-10","2021-11","2021-12","2022-01","2022-02","2022-03","2022-04","2022-05","2022-06","2022-07","2022-08","2022-09","2022-10","2022-11","2022-12","2023-01","2023-02","2023-03","2023-04","2023-05","2023-06","2023-07","2023-08","2023-09","2023-10","2023-11","2023-12","2024-01","2024-02","2024-03","2024-04","2024-05","2024-06","2024-07","2024-08","2024-09","2024-10","2024-11","2024-12","2025-01","2025-02","2025-03","2025-04","2025-05","2025-06","2025-07","2025-08","2025-09","2025-10","2025-11","2025-12","2026-01","2026-02","2026-03","2026-04","2026-05","2026-06"];
const PRICE_M = [15.54,16.2,17.64,17.25,17.03,17.05,17.68,19.95,21.09,21.9,22.08,23.95,23.31,24.67,25.21,24.25,26.39,27.79,25.69,24.8,24.65,23.57,22.94,25.21,24.26,22.18,21.9,24.67,22.35,23.74,25.43,26.83,27.54,30.07,31.84,25.16,28.79,29.0,28.26,27.61,29.29,31.62,31.6,30.52,27.26,23.71,27.16,29.13,31.56,31.68,34.72,36.43,34.96,40.16,43.79,45.05,46.99,46.37,45.62,47.23,47.68,48.54,49.72,48.49,53.17,55.37,66.54,58.59,58.74,62.97,55.44,58.01,48.58,53.55,49.91,44.4,47.01,55.1,55.91,58.5,59.43,64.15,62.65,80.8,86.74,89.87,92.29,83.06,84.14,92.57,111.63,118.0,130.05,132.54,130.03,132.85,160.55,160.68,162.82,172.5,169.77,162.08,231.84,221.27,199.43,167.43,192.47,242.07,275.65,293.7,297.39,329.91,369.63,402.96,346.1,331.3,319.55,309.51,417.43,446.77,382.07];
const PRICE_M_DD = [0.0,0.0,0.0,-2.2,-3.5,-3.3,0.0,0.0,0.0,0.0,0.0,0.0,-2.7,0.0,0.0,-3.8,0.0,0.0,-7.6,-10.8,-11.3,-15.2,-17.5,-9.3,-12.7,-20.2,-21.2,-11.2,-19.6,-14.6,-8.5,-3.5,-0.9,0.0,0.0,-21.0,-9.6,-8.9,-11.2,-13.3,-8.0,-0.7,-0.8,-4.1,-14.4,-25.5,-14.7,-8.5,-0.9,-0.5,0.0,0.0,-4.0,0.0,0.0,0.0,0.0,-1.3,-2.9,0.0,0.0,0.0,0.0,-2.5,0.0,0.0,0.0,-11.9,-11.7,-5.4,-16.7,-12.8,-27.0,-19.5,-25.0,-33.3,-29.4,-17.2,-16.0,-12.1,-10.7,-3.6,-5.8,0.0,0.0,0.0,0.0,-10.0,-8.8,0.0,0.0,0.0,0.0,0.0,-1.9,0.0,0.0,0.0,0.0,0.0,-1.6,-6.0,0.0,-4.6,-14.0,-27.8,-17.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,-14.1,-17.8,-20.7,-23.2,0.0,0.0,-14.5];
const PAST_EVENTS = [
  { idx: 29,  label: "CA Acq",    note: "Nov 2018 — CA Technologies acquisition ($18.9B). Broadcom pivoted from pure-play semiconductors toward enterprise infrastructure software. Revenue jumped; leverage increased. Gross margin declined initially then recovered as integration completed." },
  { idx: 45,  label: "COVID",     note: "Mar 2020 — COVID selloff. AVGO dropped ~30% with the broad market. The thesis held: semiconductor demand accelerated post-reopening as data center and cloud buildout surged. Price recovered to new highs within 12 months." },
  { idx: 72,  label: "Rate Peak", note: "Nov 2022 — Peak Fed rate-hiking cycle. Growth multiples compressed across tech. AVGO held relatively well vs high-growth peers due to FCF generation, stable dividends, and its defensive semiconductor exposure in networking/storage." },
  { idx: 83,  label: "VMware",    note: "Oct 2023 — VMware acquisition close ($61B). Massive leverage-up (Net Debt/EBITDA >2×). Market initially skeptical of software pivot at this price. VMware ARR target set at $8.5B by end of FY25 — achieved ahead of schedule." },
  { idx: 97,  label: "Split",     note: "Jul 2024 — 10:1 stock split. All historical prices in this chart are split-adjusted (divided by 10). No economic effect — purely cosmetic, intended to improve retail accessibility. Pre-split price was ~$1,850 in June 2024." },
  { idx: 120, label: "AI Miss",   note: "Jun 2026 — Q2 FY26 earnings: AI guide ($16B Q3) missed analyst whispers (~$17.2B). Software revenue also missed. Stock dropped ~15% in two days despite strong actuals ($10.8B AI beat). Current dislocation event. Base floor: $420." },
];

const VAL_CONFIG = {
  ntm_eps:              14.50,   // non-GAAP NTM EPS consensus
  shares_b:              1.45,   // shares outstanding (billions)
  fcf_ntm_b:            22.0,    // NTM free cash flow ($B)
  risk_free_pct:         4.35,   // 10Y Treasury yield %
  default_discount_pct:  10.0,   // reverse-DCF default discount rate
  default_terminal_pe:   22,     // reverse-DCF default terminal P/E
  dcf_years:              5,
  ai_rev_fy27_target_b: 100,     // Hock Tan's stated FY2027 AI semiconductor revenue target
  prior_fy_rev_b:        56,     // reaffirmed FY2026 AI semiconductor revenue guide (not a prior-FY actual — see fy26Card TEXT)
  prior_fy_label:       "FY2026 AI revenue guide",
  // P/E history zones (post-split)
  pe_trough: 20, pe_bear_hi: 24, pe_normal_lo: 28, pe_normal_hi: 32, pe_bull_lo: 38, pe_peak: 42,
  peers: [
    { t: "AVGO", fpe: 26.7, ev_eb: 22.4, fcf_y: 3.9, note: "AI semi + VMware software" },
    { t: "NVDA", fpe: 37.2, ev_eb: 36.8, fcf_y: 1.8, note: "GPU monopoly" },
    { t: "MRVL", fpe: 32.1, ev_eb: 31.5, fcf_y: 1.2, note: "AI semi, no software buffer" },
    { t: "MSFT", fpe: 30.4, ev_eb: 22.1, fcf_y: 2.8, note: "Large-cap software" },
  ],
};

const SIGNAL_HELP = {
  "Q2 AI Revenue vs Guide": "Broadcom designs custom AI accelerator chips (XPUs/ASICs) for Google, Meta, Anthropic, OpenAI, and two others. Q2 FY2026 actual: $10.8B — a slight beat vs. the $10.7B guide, and up 143% year-over-year. The beat is real but thin; the real disappointment was the Q3 guide of $16B coming in below analyst whispers of ~$17.2B, which triggered a 15% stock drop.",
  "XPU Customer Count": "The number of major tech companies for which Broadcom designs custom AI accelerator chips. Still 6 (Google, Meta, Anthropic, OpenAI + 2 unnamed). The Q2 call disclosed volumes for the first time: Anthropic 5+ GW starting 2027, OpenAI 1.3 GW in 2027, Meta 3 GW through 2028. No 7th customer announced — this was the bull case trigger that did not fire.",
  "Software Revenue": "Broadcom's infrastructure software segment (primarily VMware). Q2 FY2026: $7.18B, up 9% YoY — a miss vs. the $7.32B analyst estimate. This was the secondary source of disappointment in the Q2 print. At 93% gross margin, the segment is highly profitable, but missing estimates two quarters in a row would signal ARR growth is decelerating faster than the model assumes.",
  "Non-GAAP EBITDA Margin": "Out of every dollar Broadcom brings in, how much is left as cash profit before interest and taxes. 'Non-GAAP' strips out amortization from the VMware acquisition — a financing cost, not an economic one. Q2 FY2026: 69% — a beat vs. the guided ~68%. This is a genuine positive from the quarter and shows operating leverage.",
  "Q3 AI Revenue Guidance": "What management says next quarter's AI chip revenue will be. Q3 FY2026 guide: $16B — over 200% YoY growth, but below analyst whisper expectations of ~$17.2B. This guidance miss was the primary catalyst for the 15% post-earnings selloff. The $100B FY2027 target was reaffirmed but not raised. Watch whether Q3 actuals land at or above $16B.",
  "Hyperscaler Custom Networking": "A new, unresolved risk added 2026-07-18: Amazon disclosed 'Resilient Network Graphs' (RNG) — a custom network topology (random-graph design + passive optical shuffle boxes) that AWS claims saves up to 45% vs. traditional fat-tree networks built on merchant switch silicon (the Jericho/Tomahawk chips Broadcom sells into hyperscaler AI clusters). This is a hyperscaler substituting owned network-engineering IP for Broadcom's silicon at the topology level — not yet a disclosed revenue impact, just the first hard evidence of the pattern. WATCH, not yet BEAR or BULL: it only becomes a real threat if a second hyperscaler (Google, Microsoft, Meta) discloses something comparable, or if AVGO's own networking-segment growth decelerates in a way tied to this.",
};
const TAG_HELP = {
  BEAT: "doing better than expected — a good sign.",
  MATCH: "roughly in line with expectations — steady, no surprises.",
  MISS: "falling short of expectations — a worry.",
  WATCH: "not decided yet — keep an eye on it.",
};

const THESIS_ITEMS = [
  { key: "aiTarget",     label: "$100B FY2027 AI target still standing",   note: "Hock Tan has not revised this down" },
  { key: "xpuCustomers", label: "All 6 XPU relationships active",          note: "No pause, cancellation, or in-house shift announced" },
  { key: "aiGrowth",     label: "AI revenue growing quarter-over-quarter", note: "Sequential growth — not just YoY — matters here" },
  { key: "vmwareArr",    label: "VMware ARR holding above 10% growth",     note: "Churn not accelerating; subscription model intact" },
];
const PRICE_ZONES = [
  { label: "BEAR",    lo: 210, hi: 280, mid: 245, color: "#f1564b", action: "Exit / reduce if thesis also breaking" },
  { label: "BASE",    lo: 390, hi: 460, mid: 425, color: "#e0a83b", action: "Small add OK if thesis intact" },
  { label: "BULL",    lo: 530, hi: 650, mid: 590, color: "#3fd07a", action: "Let it ride — don't chase" },
];

// ── Chart geometry / axis ranges (per-stock: depends on price scale) ─────────
const GEOM = {
  priceMin: 150, priceMax: 720,
  fanGrid: [650, 550, 450, 350, 250],
  fanYears: ["2025", "2026", "2027"],
  trackMin: 80, trackMax: 740,
  trackGrid: [500, 400, 300, 200, 100],
  kpiMin: 5, kpiMax: 26,
  visLo: 150, visHi: 700,
  nowZoneLo: 390, nowZoneHi: 460,   // thresholds for the "NOW" dot zone tooltip on THE FUTURE signal panel — matches the base band
};

/* ── TEXT — every company-specific narrative/tooltip the engine renders. ──────
   Values are strings, HTML strings (rendered with dangerouslySetInnerHTML), or
   template functions the engine calls with computed values. If it mentions the
   company, a quarter, a guide number, or an event, it belongs HERE, not in the
   engine — that rule is what makes the engine safely reusable across stocks. */
const TEXT = {
  // header / footer
  priceTipLive: (px, at, asOf) => `Live quote: $${px} (fetched ${at}). The price is real-time, but the scenario bands and EPS are still as of ${asOf} — only the price-derived figures (scenario returns, P/E, band position) update live. Post 10:1 split (Jul 2024).`,
  priceTipStatic: (px, asOf, liveEnabled) => `$${px} as of ${asOf} — ${liveEnabled ? "live fetch unavailable (offline or blocked), using the saved price" : "static price (live fetch disabled)"}. Post 10:1 split (Jul 2024). Next earnings: Q3 FY2026 (~Sep 2026).`,
  footerDisclaimer: (asOf) => `Illustrative scenario framing built on public consensus & estimates as of ${asOf} — not a prediction and not financial advice. Price ranges are scenario mid-bands; KPI markers are positional, not literal. Valuation ruler: forward non-GAAP EPS × P/E multiple (strips VMware acquisition amortization). Data inputs will move with every print. Next earnings: Q3 FY2026 (~Sep 2026).`,

  // fan chart
  fanHistory: "The solid white line is AVGO's actual share price since Q4 FY2024. Note: Broadcom did a 10-for-1 stock split in July 2024 — all prices here are post-split. The big run from ~$185 to $460+ was driven almost entirely by the AI custom chip story accelerating, before giving some back on the Q2 FY2026 guide miss.",
  fanNow: (px) => `AVGO trades around $${px} right now (post Q2 FY2026 earnings). Q2 printed $10.8B AI revenue (beat), but Q3 FY2026 guidance of $16B missed analyst whispers of ~$17.2B — the stock dropped ~15%. Everything left of this dot is history; everything right is forecast.`,
  fanPastDot: (q, p) => `At the end of ${q}, AVGO was around $${p}. All prices are post-split (10:1 in July 2024).`,

  // scenario selector
  segmentedExplain: {
    bear: ["The pessimistic scenario", "Click to see what AVGO looks like if hyperscaler AI spending pulls back — Q3 AI revenue misses the $16B guide, VMware customers churn faster than expected, and the stock re-rates as a hardware cyclical. Price would likely fall to the $210–280 range."],
    base: ["The most-likely scenario", "Click for the base view — Q3 AI revenue lands near the $16B guide, VMware ARR holds above 10%, and Broadcom keeps compounding non-GAAP EBITDA margin in the high-60s. Price recovers toward the $390–460 range."],
    bull: ["The optimistic scenario", "Click to see the upside — Q3 AI revenue materially beats the $16B guide, a 7th hyperscaler XPU customer is announced, and the market re-rates AVGO from hardware cyclical to durable AI-infrastructure platform. Price could reach $530–650."],
  },

  // KPI column
  kpiBaseline: (val) => `This is the most recent real number: Broadcom reported $${val}B in AI semiconductor revenue last quarter — a beat vs. the $10.7B guide, and up 143% year-over-year. The bars to the right are scenario forecasts for where it goes next.`,
  kpiForecast: (label, val) => `In this scenario, quarterly AI semiconductor revenue reaches ~$${val}B by ${label}. CEO Hock Tan has guided to $100B+ AI chip revenue for all of FY2027 — about $25B/quarter run rate. Taller bar = faster ramp.`,

  // reversion clock
  reversion: {
    header: "REVERSION CLOCK · JUN 2026 AI-GUIDE DISLOCATION",
    timeTip: "Q2 FY2026 earnings (Jun 3, 2026) triggered the current dislocation: AI revenue beat, but the Q3 FY2026 AI guide of $16B missed analyst whispers of ~$17.2B, and software revenue also missed — the stock dropped ~15% in two days. This bar shows how far along we are in the recovery cycle vs. AVGO's own precedent dislocations (2022 rate shock ~60 days, 2023 VMware-close uncertainty ~90 days; ~45 days used here as the blended precedent window).",
    priceTip: (trough, baseFloor, now) => `Stock bottomed near $${trough} after the Jun 3, 2026 AI-guide-miss selloff and needed to reach $${baseFloor} to re-enter the base band. At $${now} it is working back toward that floor.`,
    footerHtml: (baseFloor, precedentDays, now) => `The Jun 2026 AI-guide miss was a guidance/expectations shock, not a demand-destruction event — Q2 actuals themselves beat on AI revenue and EBITDA margin. Historical AVGO dislocations (2022 rate shock, 2023 VMware-close uncertainty) resolved within 45–90 days when the thesis stayed intact. Price is at $${now} today, working back toward the $${baseFloor} base floor within the ~${precedentDays}-day precedent window. The next confirmation is Q3 FY2026 earnings (~Sep 2026) — does AI revenue meet the $16B guide: <span style="color:#e0a83b;font-weight:700">has the thesis actually broken, or is this fear?</span>`,
  },

  // track record
  track: {
    lastDot: (post, nowPx) => `After Q2 FY2026 earnings (Jun 3), AVGO traded around $${post} — a ~15% drop despite AI revenue and EBITDA margin both beating guide, because the Q3 AI guide of $16B missed analyst whispers of ~$17.2B and software revenue also missed. Price sits at $${nowPx} today. Next dot: Q3 FY2026 earnings (~Sep 2026).`,
    pastDot: (q, post) => `After ${q} earnings, AVGO actually traded around $${post}. Compare this dot to the colored bars behind it to see if the predicted range was right.`,
    readoutHtml: (hits, n, nowPx) => `Price has tracked <span style="color:#3fd07a;font-weight:700">base-or-better in ${hits} of ${n} quarters</span> since Q4 FY2024. Q2 FY2026 is the most interesting recent case: AI revenue beat guide ($10.8B vs $10.7B), non-GAAP EBITDA margin beat (69% vs ~68% guide) — yet the stock landed at $${nowPx}, a genuine guidance-driven pullback, not a business miss, because the Q3 AI guide of $16B fell short of ~$17.2B whispers and software revenue also missed. Next directional catalyst: <span style="color:#e0a83b;font-weight:700">Q3 FY2026 earnings (~Sep 2026)</span> — AI revenue vs. the $16B guide.`,
    footnote: "⚠ Bands are reconstructed now, anchored to each date's forward EPS & multiple regime — not archived in real time. Treat levels as directional, especially \"lower-conf\" quarters. All prices are post-split (10:1 stock split, July 2024). Customer concentration within the 6 XPU partners is undisclosed — treat AI revenue bands as wider than they appear.",
  },

  // THE CURRENT tab
  current: {
    statusNarrative: {
      broken: "Multiple signals missed. Thesis is under pressure — review the kill-switch criteria.",
      watch:  "AI revenue beat Q2 guide, but software revenue missed and the Q3 AI guide of $16B disappointed whispers. Core thesis tracking — the Q3 FY2026 print (~Sep 2026) is the next test. Not broken, but watch closely.",
      intact: "All key signals tracking as expected. The AI XPU ramp and VMware stabilization thesis remains intact.",
    },
    panelTipStory: "Checks whether the original reasons to own AVGO are playing out. Counts signals from the Q2 FY2026 print and Q3 FY2026 guide — AI revenue, XPU customer count, software revenue, hyperscaler custom networking. 0–1 miss = thesis intact. 2 misses = watch. 3+ = exit. Click to see KPI bars and kill-switch.",
    watchChipHtml: `🔑 WATCH: Q3 AI rev vs <span style="color:#e0a83b;font-weight:700">$16B</span> guide · ~Sep 2026`,
    exitChipHtml: `⚠ EXIT IF: Q3 AI revenue prints below <span style="font-weight:700">$15B</span>`,
    verdictBody: {
      broken:     (px) => `AVGO at $${px}: kill-switch criteria met. Price position is irrelevant — signals say the AI XPU ramp thesis is no longer playing out. The question is not whether to add; it is how much to reduce.`,
      watchBelow: (px) => `AVGO at $${px} sits below the base floor but signals are mixed (software miss + Q3 guide miss vs. whisper). Price is attractive, but adding into a weakening thesis is the wrong sequence. Wait for the Q3 FY2026 print (~Sep 2026) to confirm or deny the pattern before deploying capital.`,
      below:      (px) => `AVGO at $${px} sits below the base floor with the thesis intact — AI revenue beating guide, XPU commitments now quantified in gigawatts, EBITDA margin expanding. The market is pricing in fear about the Q3 guide missing analyst whispers; the fundamentals say it's a guidance/timing story, not demand destruction.`,
      inBase:     (px, statusWord) => `AVGO at $${px} is inside the base range. Thesis ${statusWord} and price is fair. No urgency to add or reduce. Watch Q3 FY2026 AI revenue vs the $16B guide around Sep 2026 — a beat opens the bull case; a miss reopens the bear.`,
      above:      (px) => `AVGO at $${px} is above the base ceiling. The bull case — a Q3 beat plus a 7th XPU customer — needs to play out to justify entry. If already in, hold. If adding, wait for a pullback toward the base floor.`,
    },
    kpiTitle: "AI Semiconductor Revenue",
    kpiSub: "$B quarterly · HIGHER BETTER",
    kpiMeasures: "Quarterly AI chip revenue from XPU/ASIC design wins at Google, Meta, Anthropic, OpenAI, and two unnamed hyperscalers. Guided $16B for Q3 FY2026 — over 200% YoY growth but below the ~$17.2B analyst whisper. Hock Tan's $100B FY2027 target implies roughly $25B/quarter exiting the ramp.",
    kpiRequires: {
      bull: "AI revenue beats the $16B Q3 guide and accelerates toward $28–34B quarterly by mid-FY2027, confirming a 7th-customer platform re-rating.",
      base: "AI revenue lands near the $16B Q3 guide and scales toward $23–27B quarterly by FY2027, keeping the $100B annual target credible.",
      bear: "AI revenue misses the $16B guide and stalls in the low-to-mid teens for multiple quarters, signaling hyperscaler capex discipline rather than a pure timing gap.",
    },
    group1Title: "AI Revenue &amp; Software Signals",
    group2Title: "Margin &amp; Forward Guidance",
    killSwitch: "Q3 FY2026 AI revenue prints below $15B — exit or reduce. The $16B guide was already a miss vs. whispers; a second consecutive shortfall confirms demand weakness, not timing.",
    priceBanner: {
      below:  (px, baseLo) => `At $${px}, price is $${baseLo - px} below the base floor. Market is pricing in fear over the Q3 guide miss — not a fundamentals problem, given AI revenue and EBITDA margin both beat in Q2. Historically the window patient buyers use.`,
      inBase: (px) => `At $${px}, price is inside the base range. Fair value — not a discount, not expensive.`,
      above:  (px, baseHi) => `At $${px}, price is $${px - baseHi} above the base ceiling. The bull thesis needs to play out in full.`,
    },
    moodBanner: (currentPE, loPE, hiPE) => `At ${currentPE}× forward P/E, the market is pricing in moderate skepticism after the Q3 AI guide missed whispers — the multiple compressed from ~32× pre-print toward the bottom of the ${loPE}–${hiPE}× normal band, not euphoria.`,
    cagrNotes: {
      low:  "Low bar — not priced for perfection. Even moderate AI-ramp execution justifies the price.",
      mid:  "Moderate bar — requires the AI XPU ramp and VMware ARR stabilization to stay on track.",
      high: "High bar — requires near-perfect execution on the $100B FY2027 AI target with no further guide-miss pattern.",
    },
    fy26CardTip: (fy26) => `Adding the Q2 FY2026 AI-revenue actual to the base-case Q3 FY26–Q1 FY27 projections gives a rolling 4-quarter AI-revenue run rate of roughly $${fy26}B — a pace check against management's own reaffirmed $56B FY2026 AI semiconductor revenue guide, not a same-period comparison. That run rate is what the base case — and roughly today's price — already assumes. The bull case requires XPU demand to push meaningfully above this.`,
    fy26CardHtml: (fy26, growthPct) => `Q2 FY2026's AI-revenue actual plus base-case Q3 FY26–Q1 FY27 projections sum to a rolling <span style="color:var(--blue-soft);font-weight:700">$${fy26}B</span> 4-quarter AI-revenue run rate — the pace today's price already assumes. Management's reaffirmed FY2026 AI revenue guide is <span style="color:#3fd07a">$56B</span>, so this rolling window implies running <em>~${growthPct}%</em> above that annual guide's pace.`,
    peerCommentary: (currentPE) => `At ${currentPE}× NTM P/E, AVGO trades below NVDA's GPU-monopoly multiple and roughly in line with MSFT despite AI revenue growing faster than either — the post-Q2 guide-miss selloff left the multiple near the bottom of its own normal range. MRVL, AVGO's closest AI-semi comp, carries a richer multiple (32.1× vs 26.7×) with no software buffer — a reminder that AVGO's VMware software segment (93% gross margin) is a real valuation cushion MRVL doesn't have.`,
  },

  // THE FUTURE tab
  future: {
    scenarioTips: {
      bear: "Triggered by: Q3 AI revenue missing the $16B guide, VMware ARR decelerating below 10%, or a second hyperscaler disclosing a custom-network deployment comparable to Amazon's RNG. Multiple compresses toward the 20–24× trough zone.",
      base: (loPE, hiPE) => `Q3 FY2026 AI revenue lands near the $16B guide; VMware ARR holds above 10%; non-GAAP EBITDA margin stays 68–70%. P/E holds in the normal ${loPE}–${hiPE}× band. Re-rate back toward $420–460 over the next two quarters.`,
      bull: (currentPE) => `Q3 FY2026 AI revenue materially beats the $16B guide and a 7th XPU customer is announced. Multiple re-rates from ~${currentPE}× toward 35–38× as multi-year gigawatt commitments get recognized as infrastructure-grade revenue.`,
    },
    downsideChevronTip: "Kill-switch: Q3 FY2026 AI revenue prints below $15B = exit / reduce.",
    dislocEventName: "the Jun 3, 2026 Q2 FY2026 AI-guide-miss drop",
    dislocLabel: "SINCE JUN 3 DROP",
    bearPriceTip: (bearMid, bearLo, bearHi, peTrough, peBearHi) => `$${bearMid} is the midpoint of the bear case range ($${bearLo}–$${bearHi}). This assumes the Q3 AI guide-miss pattern persists, VMware ARR decelerates below 10%, and the multiple compresses toward the ${peTrough}–${peBearHi}× trough zone on cut EPS (~$9.50). The kill-switch is Q3 AI revenue below $15B — if it triggers, do not average down.`,
    killSwitchTip: "A kill-switch is a pre-committed exit rule you set BEFORE you own the position — when you are thinking clearly. If Q3 FY2026 AI revenue prints below $15B, the thesis is broken: two consecutive AI guide misses confirm this is demand weakness, not timing. Do not average down into a broken thesis — the market is telling you something. No debate, no rationalisation. Exit.",
    killSwitchTipNote: "Memorise this number: $15B. Not $14.9B, not $14B. $15B.",
    killSwitchHtml: `<strong style="color:var(--title)">Q3 FY2026 AI revenue prints below $15B</strong> → exit or reduce. No debate. The $16B guide was already a miss vs. whispers; a second consecutive shortfall confirms a demand signal, not timing. Do not average down into a broken thesis.`,
    nextCheck: "Next check: Q3 FY2026 earnings (~Sep 2026)",
    downsideFootnote: (px, peTrough, peBearHi) => `Bear case scenario: AI guide-miss pattern persists or VMware ARR decelerates. Assumes a multiple compression toward ${peTrough}–${peBearHi}× on cut EPS (~$9.50). Position loss is illustrative at $${px} entry.`,
    multipleSummary: (peNow, loPE, hiPE) => `At ~${peNow}× NTM P/E, the post-earnings selloff compressed AVGO's multiple from ~32× to ~${peNow}× — near the bottom of the ${loPE}–${hiPE}× normal historical range. Not yet deep value, but not expensive either.`,
    peBarTipSuffix: "'Non-GAAP' strips ~$5–8B/yr of VMware acquisition amortization — GAAP P/E would be ~40–50× and misleading for a business this profitable in cash terms.",
    deepValueZoneNote: "Historically cheap. Rare — last seen at the 2022 rate-shock bottom. Exceptional entry if thesis is intact.",
    dislocPrecedent: (baseFloor) => `Historical precedent: AVGO dislocations (2022 rate shock, 2023 VMware close) resolved within 45–90 days when the thesis remained intact. Base floor: $${baseFloor}.`,
    regretHtml: (currentPE) => `Q3 FY2026 AI revenue <strong style="color:#3fd07a">materially beats the $16B guide</strong> AND a 7th hyperscaler XPU customer is announced. That would confirm the Q2 FY2026 guide miss was timing, not demand, re-rate the stock from ~${currentPE}× toward 35–38×, and close today's entry window at $380–420.`,
    regretTip: "Charlie Munger's inversion: instead of asking 'why should I buy?', ask 'what would I have to believe happened, in hindsight, to wish I had bought more?' If Q3 beats the $16B guide and a 7th customer is announced, the entry window at $380–420 will close fast. You will not get a second chance at this multiple if the bull case materialises. This question is not about FOMO — it is about sizing correctly for your conviction.",
    chips: [
      { label: "KILL-SWITCH: Q3 AI REV < $15B → EXIT", col: "#f1564b" },
      { label: "REGRET IF: Q3 BEATS + 7TH CUSTOMER DISCLOSED", col: "#3fd07a" },
      { label: "NEXT CHECK: ~SEP 2026 EARNINGS",          col: "#2f6dff" },
    ],
    signalFootnote: (ntmEps) => `P/E uses non-GAAP NTM EPS $${ntmEps} — GAAP EPS is materially lower due to ~$5–8B/yr of VMware acquisition amortization, a financing cost rather than an economic one.`,
  },

  // THE PAST tab
  past: {
    cardTips: {
      durability: (revCagrPct) => `Looks at 10 years of Revenue, Gross Margin, and Free Cash Flow. We want upward trends that hold through cycles — not spike-and-crash. AVGO has grown revenue at ~${revCagrPct}% CAGR, but unlike a pure organic compounder this includes two transformative acquisitions (CA Technologies FY2019, VMware FY2024) that step revenue up discontinuously — gross margin expansion alongside that growth (45% to 68%) is the tell that the deals were integrated well, not just bought for the top line.`,
      value: (latestROIC) => `ROIC (Return on Invested Capital) measures how efficiently management deploys capital. Above WACC (~8–12% for this business) = value creation. Below = value destruction. AVGO's ROIC dips sharply after each big acquisition (CA Technologies, VMware) as purchase-price accounting depresses the ratio, then recovers as the deal is integrated and de-levered — ${latestROIC}% today (FY2025) confirms the VMware integration is working, not stalling.`,
      capex: (peakCapex, latestCapex, latestFCF) => `Capex as a % of revenue shows how much of every dollar gets reinvested before cash reaches shareholders. AVGO is capex-light by design — most of the "AI capex" story belongs to its hyperscaler customers building datacenters, not to Broadcom itself, which designs chips and licenses software. Capex/revenue peaked at ${peakCapex}% (FY2017) and has fallen to just ${latestCapex}% even as FCF hit a record $${latestFCF}B — the real capital-allocation story here is acquisition-funded leverage (CA, VMware), not capex intensity.`,
      mood: (evNow, evAvg) => `EV/EBITDA vs its own 10-year average tells you whether the market is paying a premium or discount for this business. Not a buy/sell signal on its own — context matters (growth rate, interest rates, sector rotation). Current EV/EBITDA of ${evNow}× sits close to the 10Y average of ~${evAvg}× — roughly fair-value mood, not the euphoria or fear extremes seen at past cycle turns.`,
    },
    stats: [
      { html: `Revenue <span style="color:#3fd07a;font-weight:700">$13B → $64B</span> (10Y)`, tipTitle: "Revenue (10-year)", tipBody: "AVGO grew annual revenue from $13.24B (FY2016) to $63.89B (FY2025) — a ~19% CAGR. This includes two transformative acquisitions: CA Technologies (FY2019, +$18.9B deal) and VMware (FY2024, +$61B deal), so growth is a mix of organic AI/networking demand and acquired software ARR, not pure organic compounding." },
      { html: `FCF <span style="color:#3fd07a;font-weight:700">$2.7B → $26.9B</span> (10Y)`, tipTitle: "Free Cash Flow (10-year)", tipBody: "FCF grew from $2.69B (FY2016) to a record $26.91B (FY2025) — roughly 10× in 10 years, even after funding two large acquisitions and their associated debt. This is the number that funds dividends, buybacks, and the next deal — evidence the acquisitions are being monetized, not just adding leverage." },
      { html: `Price <span style="color:#3fd07a;font-weight:700">+2,359%</span> (Jun 2016 → Jun 2026)`, tipTitle: "Total price return (10-year)", tipBody: "From $15.54 (Jun 2016, split-adjusted) to $382.07 (Jun 2026) = +2,359%. Compounding came from a mix of organic semiconductor demand, disciplined M&A (CA, Symantec, VMware), and — most recently — the AI custom-chip re-rating. Past returns are anchored to a chokepoint position in AI XPU design that may not persist if hyperscalers succeed in building comparable in-house capability." },
    ],
    verdictBody: "AVGO has compounded revenue at ~19% annually for 10 years through disciplined, leverage-funded acquisitions (CA Technologies, VMware), each time deleveraging within 1–2 years. Gross margins expanded from 45% to 68%, FCF grew ~10×, and ROIC recovered to a healthy 16.4% in FY2025 after the VMware integration dip. The business has earned the right to a premium multiple — the open question, per CLAUDE.md's pull-forward test, is whether the current AI-cycle multiple survives a guide-miss quarter like Q2 FY2026, not whether the underlying franchise (custom silicon + high-margin infrastructure software) is durable.",
    banners: {
      durability: (revCagrPct, rev0, rev9, gmDelta, latestGM, fcf0, latestFCF) => `Revenue compounded at ~${revCagrPct}% annually from $${rev0}B (FY2016) to $${rev9}B (FY2025) — a mix of organic AI/networking demand and two large acquisitions (CA Technologies FY2019, VMware FY2024). Gross margin expanded ${gmDelta} points to ${latestGM}%, dipping only briefly around each acquisition's integration costs before recovering to new highs. FCF grew from $${fcf0}B to $${latestFCF}B.`,
      value: (latestROIC) => `ROIC of ${latestROIC}% (FY2025) exceeds a typical WACC of 8–10% for this business, meaning each dollar reinvested — organic or acquired — now creates more than a dollar of value. Unlike an organic-only compounder, AVGO's ROIC visibly dipped in each acquisition year (FY2016 CA lead-up, FY2024 VMware close at 5.6%) before recovering — the FY2025 rebound to 16.4% is the clearest evidence the VMware deal is earning through, not dragging.`,
      capex: (latestCapex, peakCapex, latestFCF, fy26Guide) => `Capex/revenue of ${latestCapex}% (FY2025) is well off the ${peakCapex}% peak (FY2017) even as FCF hit a record $${latestFCF}B. AVGO is structurally capex-light — its "AI buildout" exposure comes through hyperscaler customers' own datacenter capex, not Broadcom's balance sheet. The real capital-allocation test isn't capex intensity, it's whether each acquisition (CA, VMware, and any future deal) keeps de-levering on schedule the way the last two did.`,
      mood: (evNow, evAvg) => `EV/EBITDA of ${evNow}× sits close to the 10-year average of ${evAvg}× — a far less stretched setup than the ~51× peak seen right after the VMware close (FY2024), when the market was still pricing in acquisition-integration risk. The multiple has come back down to earth even as the AI XPU story added a genuine new growth leg, suggesting today's price isn't paying a large premium for either story individually.`,
    },
    revAnnotationsHtml: `<span>FY2024: <span style="color:var(--tx3)">$51.6B</span> (VMware close, +$14B)</span><span>FY2025: <span style="color:var(--tx3)">$63.9B</span> (AI ramp + full-year VMware)</span>`,
    roicNote: "Green >15% · Amber 5–15% · Red <5% — AVGO dips into amber/red in acquisition years (FY16, FY24), then recovers",
    fcfYieldNote: "Declining yield = stock re-rating higher (not declining FCF). FCF itself grew ~10× over the decade.",
    capexAnnotationsHtml: `<span>FY2017: <span style="color:#f1564b">6.1%</span> (peak, pre-VMware)</span><span>FY2024: <span style="color:#3fd07a">1.1%</span> (capex-light even post-VMware)</span><span>FY2025: <span style="color:#3fd07a">1.0%</span> (holding, not re-accelerating)</span>`,
    footnotes: {
      durability: "AVGO's growth is acquisition-assisted, unlike TSM's organic-only compounding — the FY2019 step (CA Technologies, $18.9B) and FY2024 step (VMware, $61B) are discontinuous jumps, not smooth organic growth. Gross margin dipped briefly around each deal's integration (FY2018: 48.2%→51.5% recovering; FY2024: dipped to 63.0% on VMware integration costs) before climbing to new highs — 67.8% in FY2025. That recovery pattern, twice repeated, is the evidence Hock Tan's playbook (acquire, strip costs, delever, repeat) actually works rather than just adding leverage.",
      value: "ROIC dipped to -0.9% (FY2016, pre-CA) and 5.6% (FY2024, VMware close) in acquisition years — both recoveries were faster than the market initially priced. FCF yield compression from 4.3% (FY2016) to 1.6% (FY2025) reflects the stock's multiple expanding faster than its cash flow, not cash flow deteriorating — FCF itself hit a record $26.91B in FY2025. The open question for THE FUTURE tab is whether today's multiple is paying for AI XPU demand that's already arrived, or demand still to come.",
      capex: "Capex/revenue peaked at 6.1% in FY2017 and has fallen every year since, down to 1.0% in FY2025 — proof this is structurally a capex-light chip-design-and-software business, not a capital-intensive foundry like TSM. The real leverage story lives in the acquisitions, not the capex line: CA Technologies (FY2019) and VMware (FY2024) both spiked Net Debt/EBITDA above 2× before rapid deleveraging. The kill-switch for this panel: if Broadcom announces another debt-funded mega-acquisition before VMware's integration fully de-levers, re-examine the balance sheet before extending the multiple further.",
      mood: "The scenario bands on the other tabs use forward P/E (non-GAAP, stripping VMware amortization), not EV/EBITDA — EV/EBITDA is shown here purely to track cross-cycle mood, since it's capital-structure-neutral and comparable across the acquisition-driven leverage swings. The multiple peaked near 51× right after the VMware close (FY2024, market still pricing integration risk) and sits at 22.4× today — a real re-rating down from that peak even as the AI XPU story added a new growth leg, which is why the Q2 FY2026 guide miss could still compress the multiple further from here rather than just pausing its expansion.",
    },
    priceChartTitle: "AVGO PRICE · 10-YEAR MONTHLY · 2016–2026",
    priceChartSub: "$ per share, split-adjusted (10:1 Jul 2024) · dashed lines = key events",
    priceNowTip: (px, isATH) => `$${px} — where AVGO trades today (split-adjusted), ${isATH ? "also the highest monthly close in this 10-year window" : "off the all-time high"}. The chart shows a mix of organic semiconductor compounding and acquisition-driven step-ups (CA Technologies FY2019, VMware FY2024), with the most recent leg — AI custom-chip demand — the one now being tested by the Q2 FY2026 guide miss.`,
    ddTip: (minDD) => `${minDD}% — the deepest drop from a prior all-time high in the 10-year window. This occurred in Sep 2022, during the peak Fed rate-hiking cycle. AVGO recovered and went on to make new highs as the VMware deal closed and the AI XPU story took over. Drawdown charts help you visualize what holding through a bad period actually felt like.`,
    ddAnnotationsHtml: `<span>Max drawdown: <span style="color:#f1564b">−33.3%</span> (Sep 2022, rate-hike cycle)</span><span>Current: <span style="color:#e0a83b">−14.5%</span> from ATH — the Jun 2026 AI-guide-miss pullback</span>`,
  },
};
