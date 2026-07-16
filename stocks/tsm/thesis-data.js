/* ╔══════════════════════════════════════════════════════════════════════════╗
   ║   TSM · thesis-data.js — ALL per-stock content lives here.               ║
   ║   ███  EDIT EVERYTHING IN THIS FILE EACH QUARTER  ███                    ║
   ║                                                                          ║
   ║   The rendering engine (../engine/thesis-engine.js) contains ZERO        ║
   ║   company-specific strings — every number, narrative, and tooltip        ║
   ║   that mentions TSM is in this file. Quarterly touch = edit this         ║
   ║   file only, then run: node tools/lint-thesis-data.js tsm                ║
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
   ╚══════════════════════════════════════════════════════════════════════════╝ */

const TICKER_META = { ticker: "TSM", exchange: "NYSE", company: "Taiwan Semiconductor Manufacturing Co." };
const AS_OF_DATE = "2026-07-16";

// Most recent material dislocation (Apr 2025 "Liberation Day" tariff panic)
const DISLOCATION_DATE = "2025-04-08";
const REVERSION_TROUGH = 141;
const REVERSION_BASEFLOOR = 338;
const REVERSION_PRECEDENT_DAYS = 282;

const CASES = {
  bear: {
    key: "bear", label: "BEAR", accent: "#dd817a", glow: "rgba(241,86,75,0.45)",
    target12: "$265 — $335",
    op: "Q2 2026 was a genuine beat on every disclosed line (revenue $40.2B beat the $39.0–40.2B guide's own high end, GM 67.7% beat 65.5–67.5%, EPS $4.31 beat ~$3.80 consensus) and management raised FY26 capex to $60–64B and USD revenue growth guide to 'slightly above 40%' — yet the stock fell from a $477.57 pre-print high to an estimated ~$407 post-print, a real 'sell the news' round-trip. The bear case is no longer about the AI/HPC ramp stalling — it's about whether Q3's much steeper $44.6–45.8B guide (+11–14% QoQ) is now priced for perfection after two straight beat-and-raise quarters, or whether cross-strait/export-control friction (Taiwan's own proposed review of advanced-chip exports remains a live 2026 wrinkle even as TSM pledges another $100B into US fabs) resurfaces as the real tail risk. A quieter structural risk this thesis has under-covered: Google's TPU ('Humufish') shifting some advanced-packaging work from TSMC's CoWoS to Intel's competing EMIB-T process (first flagged Jul 1) is the first hard evidence a hyperscaler will route AI-accelerator packaging outside TSMC — still a single data point, not a trend, but the CoWoS moat has real competitive testing now that it didn't have a quarter ago.",
    breaks: "A hyperscaler (Microsoft, Google, Meta, Amazon) publicly signals a multi-quarter AI capex pause, a new export-control/tariff action materially restricts TSM's advanced-node shipments, or a SECOND hyperscaler discloses a real (non-pilot) advanced-packaging design win outside TSMC's CoWoS — confirming Google's TPU/Intel EMIB-T shift as a trend rather than a one-off.",
    requires01: "Q3 2026 revenue misses the $44.6–45.8B guide, or gross margin falls below the 65.0% guided floor",
    requires02: "N2 (2nm) volume ramp slips from its current 3% wafer-revenue base, cross-strait/export-control risk escalates materially, or a second hyperscaler follows Google's Intel-EMIB-T packaging shift (watch, not yet triggered)",
  },
  base: {
    key: "base", label: "BASE", accent: "#c59542", glow: "rgba(224,168,59,0.40)",
    target12: "$375 — $490",
    op: "Q2 2026 beat across the board (revenue $40.2B/+33.7% YoY, GM 67.7%, OM 60.3%, EPS $4.31) and management guided Q3 to a steep $44.6–45.8B / 65.0–67.0% GM, raising FY26 capex to $60–64B and USD revenue growth to 'slightly above 40%.' Despite that, the ADR pulled back from its $477.57 pre-print high to an estimated ~$407 — the forward multiple actually COMPRESSED (from ~28x pre-print toward ~22x now) because the consensus EPS estimate rose faster than the price fell. That's a healthier setup than the prior quarter's all-time-high entry point, not a worse one: TSM remains the only foundry shipping leading-edge AI accelerators at scale, N2 is now a real (if small, ~3% of wafer revenue) contributor, and the new $100B US investment pledge (total $265B) extends the political-goodwill moat. Most likely path: Q3 lands in the raised guide and the stock re-tests its prior highs on earnings growth rather than needing further multiple expansion.",
    breaks: "Management cuts full-year 2026 capex or revenue guidance, signaling the AI/HPC buildout is decelerating faster than expected — the opposite of what just happened.",
    requires01: "Q3 2026 revenue lands within the $44.6–45.8B guide; gross margin within 65.0–67.0%",
    requires02: "N2 ramp and CoWoS capacity expansion stay on the disclosed schedule; no new export-control escalation",
  },
  bull: {
    key: "bull", label: "BULL", accent: "#66b278", glow: "rgba(63,208,122,0.45)",
    target12: "$565 — $640",
    op: "The AI/HPC buildout accelerated again this quarter, not decelerated: FY26 capex guide raised to $60–64B (from $52–56B), USD revenue growth guide raised to 'slightly above 40%' (from '>30%'), and TSM committed another $100B to US fabs (total $265B, four more Arizona plants at 2nm-and-below). HPC now makes up 66% of revenue (+20% QoQ) and N2 has crossed into real production (3% of wafer revenue in its first reporting quarter). Sell-side price targets moved decisively higher post-print — Goldman Sachs to $600 ADR (from $550), one analyst to $590 (from $490) — even as the stock itself pulled back, which is exactly the kind of gap between fundamentals and price action that closes fast if Q3 beats its own raised guide. A de-escalation in cross-strait tension would remove the largest tail-risk discount still embedded in the multiple.",
    breaks: "Q3 2026 revenue or margin misses the raised guidance, confirming the beat-and-raise pattern was a peak rather than a trend — or cross-strait/export-control risk escalates instead of resolving.",
    requires01: "Q3 2026 revenue beats $45.8B guide high end; gross margin beats 67.0% guide high end",
    requires02: "Full-year 2026 capex or revenue guidance raised a second time; N2 ramp accelerates past its current ~3% wafer-revenue share",
  },
};

// THESIS_HISTORY — append-only archive of the full CASES set as it stood at each
// touch, captured BEFORE that touch's Layer-2 audit rewrites it. Answers "what did
// I actually believe last quarter" directly from this file, without digging through
// git log. NEVER edit a past entry after the fact — that would defeat the point,
// same discipline as TRACK_ALL and the inputs-YYYY-QQ.json provenance snapshots.
// Workflow (see .claude/commands/update-thesis.md Step 3): right before rewriting
// any of CASES.{bear,base,bull}.{target12,op,breaks,requires01,requires02}, push
// the OUTGOING values here first, tagged with the quarter/asOf that's ending.
const THESIS_HISTORY = [
  { asOf: "2026-06-16", quarter: "Q1 2026", cases: {
    bear: { target12: "$250 — $295", op: "TSM trades near all-time highs at ~$424 heading into Q2 2026 earnings (Jul 16), and the market has priced in close to flawless execution on the AI/HPC ramp. The bear case is mostly a multiple-compression story: a Q2 guide miss, a stalled N2 ramp, or — the bigger tail risk — a fresh escalation in cross-strait tension or U.S./Taiwan export-control friction (Taiwan's own proposed review of advanced-chip exports is a new 2026 wrinkle) could reprice the stock from today's ~25x NTM multiple back toward the 16–19x trough zone seen during the April 2025 tariff panic. A hyperscaler-led pause in AI infrastructure capex, after two years of hyper-growth, is the most plausible near-term trigger even without a geopolitical shock.", breaks: "A hyperscaler (Microsoft, Google, Meta, Amazon) publicly signals a multi-quarter AI capex pause, or a new export-control/tariff action materially restricts TSM's advanced-node shipments.", requires01: "Q2 2026 revenue misses the $39.0–40.2B guide, or gross margin falls below the 65.5% guided floor", requires02: "N2 (2nm) volume ramp slips, or cross-strait/export-control risk escalates materially" },
    base: { target12: "$415 — $500", op: "Q1 2026 delivered a clean beat — revenue $35.9B (+40.6% YoY) and gross margin 66.2%, above the high end of guidance — and management's Q2 guide ($39.0–40.2B revenue, 65.5–67.5% GM) implies the AI/HPC ramp continues uninterrupted. At ~$424 and roughly 25x NTM earnings, the stock is pricing in continued execution but not obvious euphoria. TSM remains the only foundry shipping leading-edge AI accelerators at scale, N2 is ramping on schedule, and CoWoS advanced-packaging capacity — the bottleneck of the last two years — keeps expanding. Most likely path: Q2 prints in line with guidance and the stock grinds higher with EPS growth rather than further multiple expansion.", breaks: "Management cuts full-year 2026 capex or revenue guidance, signaling the AI/HPC buildout is decelerating faster than expected.", requires01: "Q2 2026 revenue lands within the $39.0–40.2B guide; gross margin within 65.5–67.5%", requires02: "N2 ramp and CoWoS capacity expansion stay on the disclosed schedule; no new export-control escalation" },
    bull: { target12: "$555 — $650", op: "The AI/HPC buildout is still in its early-to-middle innings, and TSM's monopoly-like grip on leading-edge nodes (N2 ramping now, N2P/A16 behind it) gives it pricing power that already shows up in gross margin — 66.2% in Q1 2026, above the top of TSM's own long-run target range. If Q2 beats the $40.2B guide high end and management raises full-year guidance on accelerating AI accelerator demand, the market re-rates TSM from a cyclical-foundry multiple (mid-20s P/E) toward a structural-monopoly multiple (30x+), echoing how NVDA and ASML have re-rated on their own AI bottleneck positions. A de-escalation in cross-strait tension would remove the largest tail-risk discount currently embedded in the multiple.", breaks: "Q2 2026 revenue or margin misses guidance, confirming the AI/HPC ramp is decelerating rather than accelerating — or cross-strait/export-control risk escalates instead of resolving.", requires01: "Q2 2026 revenue beats $40.2B guide high end; gross margin beats 67.5% guide high end", requires02: "Full-year 2026 capex or revenue guidance raised; N2 ramp ahead of schedule" },
  } },
];

const FALLBACK_PRICE = 407.00;

const LIVE_PRICE = {
  enabled: true,
  symbol: "TSM",
  provider: "yahoo",                                  // "yahoo" (keyless, proxied) | "finnhub"
  corsProxy: "https://api.allorigins.win/get?url=",
  finnhubToken: "",
};

// ALERT — buy-trigger pre-commitment. Canonical source is PF_ALERTS.TSM in
// stocks/portfolio/portfolio-data.js; this copy is a FALLBACK for offline opens.
const ALERT = {
  symbol: "TSM",
  buyFloor: 375,
  thesisIntact: true,
  asOf: AS_OF_DATE,
  nextEarnings: "2026-10-15",
};

const HISTORY = [
  { q: "Q1 2025", p: 166.00 },
  { q: "Q2 2025", p: 226.49 },
  { q: "Q3 2025", p: 279.29 },
  { q: "Q4 2025", p: 303.89 },
  { q: "Q1 2026", p: 337.95 },
  { q: "Q2 2026", p: 477.57 },
  { q: "NOW",     p: FALLBACK_PRICE },
];

const PROJ_END = { bear: 300, base: 433, bull: 603 };
const FUTURE_Q = ["Q3 2026", "Q4 2026", "Q1 2027", "Q2 2027"];

const SIGNALS = {
  bear: [
    { name: "Q2 2026 Revenue YoY",        unit: "%",  tag: "BEAT",  next: "Oct 15, 2026", val: "ACTUAL +33.7% ($40.2B)", guide: "beat $39.0–40.2B guide hi", pos: 0.70 },
    { name: "Q3 2026 Revenue Guide",      unit: "$B", tag: "WATCH", next: "Oct 15, 2026", val: "TO REPORT",  guide: "GUIDE $44.6–45.8B", pos: 0.62 },
    { name: "Q3 2026 Gross Margin Guide", unit: "%",  tag: "WATCH", next: "Oct 15, 2026", val: "TO REPORT",  guide: "GUIDE 65.0–67.0%", pos: 0.55 },
  ],
  base: [
    { name: "Q2 2026 Revenue YoY",        unit: "%",  tag: "BEAT",  next: "Oct 15, 2026", val: "ACTUAL +33.7% ($40.2B)", guide: "beat $39.0–40.2B guide hi", pos: 0.70 },
    { name: "Q3 2026 Revenue Guide",      unit: "$B", tag: "WATCH", next: "Oct 15, 2026", val: "TO REPORT",  guide: "GUIDE $44.6–45.8B", pos: 0.62 },
    { name: "Q3 2026 Gross Margin Guide", unit: "%",  tag: "WATCH", next: "Oct 15, 2026", val: "TO REPORT",  guide: "GUIDE 65.0–67.0%", pos: 0.55 },
  ],
  bull: [
    { name: "Q2 2026 Revenue YoY",        unit: "%",  tag: "BEAT",  next: "Oct 15, 2026", val: "ACTUAL +33.7% ($40.2B)", guide: "beat $39.0–40.2B guide hi", pos: 0.70 },
    { name: "Q3 2026 Revenue Guide",      unit: "$B", tag: "WATCH", next: "Oct 15, 2026", val: "TO REPORT",  guide: "GUIDE $44.6–45.8B", pos: 0.62 },
    { name: "Q3 2026 Gross Margin Guide", unit: "%",  tag: "WATCH", next: "Oct 15, 2026", val: "TO REPORT",  guide: "GUIDE 65.0–67.0%", pos: 0.55 },
  ],
};
const MARGIN = {
  bear: [
    { name: "Cross-Strait Risk Level", tag: "WATCH", next: "Ongoing", pos: 0.45 },
    { name: "N2 (2nm) Node Ramp",      tag: "BEAT",  next: "Oct 15, 2026", pos: 0.62 },
  ],
  base: [
    { name: "Cross-Strait Risk Level", tag: "WATCH", next: "Ongoing", pos: 0.45 },
    { name: "N2 (2nm) Node Ramp",      tag: "BEAT",  next: "Oct 15, 2026", pos: 0.62 },
  ],
  bull: [
    { name: "Cross-Strait Risk Level", tag: "WATCH", next: "Ongoing", pos: 0.45 },
    { name: "N2 (2nm) Node Ramp",      tag: "BEAT",  next: "Oct 15, 2026", pos: 0.62 },
  ],
};

const KPI_HIST = 40.2;  // Q2 2026 actual (+33.7% YoY, beat $39.0-40.2B guide hi)
const KPI_PROJ = {
  bear:  [44.6, 45.0, 42.0, 43.5],
  base:  [45.2, 49.0, 47.5, 51.0],
  bull:  [47.0, 52.5, 51.5, 56.0],
};

// TRACK RECORD — append newest to end; dashboard keeps last TRACK_WINDOW.
const TRACK_ALL = [
  { q: "Q4 2024", date: "2025-01", post: 197, reaction: "+",  bear: [140,170], base: [175,210], bull: [215,250], landed: "base",      conf: "low" },
  { q: "Q1 2025", date: "2025-04", post: 166, reaction: "--", bear: [150,185], base: [195,235], bull: [240,280], landed: "bear",      conf: "low" },
  { q: "Q2 2025", date: "2025-07", post: 226, reaction: "++", bear: [150,180], base: [190,230], bull: [235,275], landed: "base→bull", conf: "med" },
  { q: "Q3 2025", date: "2025-10", post: 279, reaction: "++", bear: [200,235], base: [245,285], bull: [290,335], landed: "bull",      conf: "med" },
  { q: "Q4 2025", date: "2026-01", post: 304, reaction: "+",  bear: [255,290], base: [295,330], bull: [335,380], landed: "base",      conf: "high" },
  { q: "Q1 2026", date: "2026-04", post: 338, reaction: "+",  bear: [280,315], base: [320,360], bull: [365,410], landed: "base",      conf: "high" },
  { q: "Q2 2026", date: "2026-07", post: 407, reaction: "++", bear: [250,295], base: [415,500], bull: [555,650], landed: "bear→base", conf: "med"  },
];
const TRACK_WINDOW = 6;

// THE PAST — annual history (Wisesheets/FMP export tsm-wise-q1fy26.xlsx; TWD→USD annual-avg FX)
const PAST_YEARS       = ["2016","2017","2018","2019","2020","2021","2022","2023","2024","2025"];
const PAST_REV         = [29.3,  32.1,  34.2,  34.6,  45.3,  56.8,  75.9,  69.4,  90.0,  122.2];
const PAST_GM          = [50.1,  50.6,  48.3,  46.0,  53.1,  51.6,  59.6,  54.4,  56.1,  59.9];
const PAST_FCF         = [6.4,   8.2,   8.3,   4.7,   10.2,  9.4,   17.5,  9.2,   27.1,  34.8];
const PAST_ROIC        = [19.9,  19.4,  18.9,  18.6,  22.3,  18.8,  24.4,  17.1,  20.0,  24.6];
const PAST_EVEBITDA    = [7.2,   8.6,   7.6,   12.2,  14.6,  14.3,  7.0,   9.8,   12.9,  14.1];
const PAST_FCF_YIELD   = [4.4,   4.1,   4.4,   1.7,   2.2,   1.6,   4.5,   1.9,   3.1,   2.7];
const PAST_CAPEX_REV   = [35.1,  34.4,  31.3,  43.9,  38.6,  53.5,  48.1,  44.2,  33.3,  33.4];
const PRICE_M_LABELS = ["2016-07","2016-08","2016-09","2016-10","2016-11","2016-12","2017-01","2017-02","2017-03","2017-04","2017-05","2017-06","2017-07","2017-08","2017-09","2017-10","2017-11","2017-12","2018-01","2018-02","2018-03","2018-04","2018-05","2018-06","2018-07","2018-08","2018-09","2018-10","2018-11","2018-12","2019-01","2019-02","2019-03","2019-04","2019-05","2019-06","2019-07","2019-08","2019-09","2019-10","2019-11","2019-12","2020-01","2020-02","2020-03","2020-04","2020-05","2020-06","2020-07","2020-08","2020-09","2020-10","2020-11","2020-12","2021-01","2021-02","2021-03","2021-04","2021-05","2021-06","2021-07","2021-08","2021-09","2021-10","2021-11","2021-12","2022-01","2022-02","2022-03","2022-04","2022-05","2022-06","2022-07","2022-08","2022-09","2022-10","2022-11","2022-12","2023-01","2023-02","2023-03","2023-04","2023-05","2023-06","2023-07","2023-08","2023-09","2023-10","2023-11","2023-12","2024-01","2024-02","2024-03","2024-04","2024-05","2024-06","2024-07","2024-08","2024-09","2024-10","2024-11","2024-12","2025-01","2025-02","2025-03","2025-04","2025-05","2025-06","2025-07","2025-08","2025-09","2025-10","2025-11","2025-12","2026-01","2026-02","2026-03","2026-04","2026-05","2026-06"];
const PRICE_M = [27.78,28.74,30.59,31.1,29.69,28.75,30.91,31.47,32.84,33.07,35.36,34.96,35.96,36.97,37.55,42.33,39.6,39.65,45.31,43.35,43.76,38.45,38.7,36.56,41.21,43.6,44.16,38.1,37.59,36.91,37.62,39.05,40.96,43.82,38.35,39.17,42.63,42.63,46.48,51.63,53.09,58.1,53.94,53.84,47.79,53.13,50.33,56.77,78.89,79.25,81.07,83.87,97.02,109.04,121.52,125.94,118.28,116.74,117.36,120.16,116.64,119.01,111.65,113.7,117.15,120.31,122.63,107.01,104.26,92.93,95.3,81.75,88.48,83.35,68.56,61.55,82.98,74.49,92.73,87.07,93.02,84.3,98.59,100.92,99.15,93.57,86.9,86.31,97.31,104.0,112.96,128.67,136.05,137.34,151.04,173.81,165.8,171.7,173.67,190.54,184.66,197.49,209.32,180.53,166.0,166.69,193.32,226.49,241.62,230.87,279.29,300.43,291.51,303.89,330.56,374.58,337.95,396.06,418.45,423.93];
const PRICE_M_DD = [0.0,0.0,0.0,0.0,-4.5,-7.6,-0.6,0.0,0.0,0.0,0.0,-1.1,0.0,0.0,0.0,0.0,-6.4,-6.3,0.0,-4.3,-3.4,-15.1,-14.6,-19.3,-9.0,-3.8,-2.5,-15.9,-17.0,-18.5,-17.0,-13.8,-9.6,-3.3,-15.4,-13.6,-5.9,-5.9,0.0,0.0,0.0,0.0,-7.2,-7.3,-17.7,-8.6,-13.4,-2.3,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,-6.1,-7.3,-6.8,-4.6,-7.4,-5.5,-11.3,-9.7,-7.0,-4.5,-2.6,-15.0,-17.2,-26.2,-24.3,-35.1,-29.7,-33.8,-45.6,-51.1,-34.1,-40.9,-26.4,-30.9,-26.1,-33.1,-21.7,-19.9,-21.3,-25.7,-31.0,-31.5,-22.7,-17.4,-10.3,0.0,0.0,0.0,0.0,0.0,-4.6,-1.2,-0.1,0.0,-3.1,0.0,0.0,-13.8,-20.7,-20.4,-7.6,0.0,0.0,-4.4,0.0,0.0,-3.0,0.0,0.0,0.0,-9.8,0.0,0.0,0.0];
const PAST_EVENTS = [
  { idx: 29,  label: "Chip Downturn", note: "Dec 2018 — smartphone/semiconductor inventory correction. Weak iPhone XS-cycle demand drove customers to cut orders; TSM guided Q4 2018 and Q1 2019 down. A classic cyclical air-pocket, not a structural break — growth resumed within two quarters." },
  { idx: 44,  label: "COVID Crash",   note: "Mar 2020 — broad COVID selloff. TSM fell with the market, but the thesis held: remote-work and cloud demand pulled forward semiconductor orders, and price made new highs within a year." },
  { idx: 75,  label: "Chip Cycle Trough", note: "Oct 2022 — peak Fed rate-hiking cycle plus a global semiconductor inventory correction (memory and non-AI logic glut). TSM cut capex guidance for the first time in years. Deepest drawdown in this 10-year window (-51% from the prior high)." },
  { idx: 83,  label: "AI Inflection", note: "Jun 2023 — Nvidia's blowout May 2023 quarter ignited the AI-accelerator capex narrative. TSM was identified as the critical supply bottleneck (CoWoS advanced packaging) for AI GPUs — the start of the current re-rating cycle." },
  { idx: 105, label: "Tariff Panic",  note: "Apr 2025 — Trump's \"Liberation Day\" tariffs plus a Section 232 semiconductor-tariff threat sparked acute cross-strait/trade-war fear. The ADR fell to an intraday/daily trough of $141.37 on Apr 8, 2025 (~-58% from the prior high) before fully reversing within 282 days." },
  { idx: 119, label: "ATH Run",       note: "Jun 2026 — stock at a fresh all-time high heading into Q2 2026 earnings (Jul 16). AI/HPC revenue mix and the N2 ramp are the open questions; Taiwan's own proposed review of advanced-chip export rules is a new, smaller geopolitical wrinkle to watch." },
];

const VAL_CONFIG = {
  ntm_eps:              18.75,
  shares_b:              5.19,
  fcf_ntm_b:            39.0,
  risk_free_pct:         4.35,
  default_discount_pct:  10.0,
  default_terminal_pe:   23,
  dcf_years:              5,
  capex_fy26_guide_b:    62,      // raised from $52-56B to $60-64B on the Q2 2026 call; using midpoint
  prior_fy_rev_b:       122.2,     // last full fiscal year actual revenue
  prior_fy_label:       "2025",
  pe_trough: 14, pe_bear_hi: 18, pe_normal_lo: 20, pe_normal_hi: 26, pe_bull_lo: 30, pe_peak: 34,
  peers: [
    { t: "TSM",  fpe: 21.7, ev_eb: 14.1, fcf_y: 2.7, note: "Leading-edge foundry monopoly" },
    { t: "ASML", fpe: 49.6, ev_eb: 23.0, fcf_y: 2.4, note: "EUV lithography monopoly (re-rated sharply post its own Q2 2026 beat-and-raise)" },
    { t: "AVGO", fpe: 26.7, ev_eb: 22.4, fcf_y: 3.9, note: "AI semi + VMware software" },
    { t: "NVDA", fpe: 37.2, ev_eb: 36.8, fcf_y: 1.8, note: "GPU monopoly" },
  ],
};

const SIGNAL_HELP = {
  "Q1 2026 Revenue YoY": "TSM's Q1 2026 revenue was $35.9B, up 40.6% year-over-year — well above the roughly +35% consensus had modeled. AI/HPC accelerator demand and the early N2 ramp are the main drivers. A strong starting point heading into the Q2 guide.",
  "Q2 2026 Revenue Guide": "Management's own guidance for the current quarter (issued on the Apr 17 Q1 call): $39.0–40.2B. Not yet reported — TSM confirms this number on the Jul 16, 2026 earnings call. Landing inside the range keeps the base case intact; missing it would be the first guide miss of this AI cycle.",
  "Q2 2026 Gross Margin Guide": "Management's gross-margin guidance for the current quarter: 65.5–67.5%. Q1 2026 actually came in at 66.2%, above TSM's own long-run 53–57% target band — leading-edge node pricing power and N2 yield improvements are pushing margin higher than the company's own through-cycle target.",
  "Cross-Strait Risk Level": "Shorthand for geopolitical tail risk around Taiwan: mainland China tension, U.S. export-control actions on advanced chips, and now Taiwan's own proposed review of advanced-chip export rules. No acute escalation right now, but this is the single biggest kill-switch risk for the bull case — it doesn't show up in any quarterly number until it does.",
  "N2 (2nm) Node Ramp": "TSM's next leading-edge process node (2-nanometer), now in volume ramp. Apple, Nvidia and other major customers are expected to be early adopters. On-schedule ramp supports the premium pricing baked into the gross-margin guide; a slip would be an early warning that the foundry monopoly story is weakening.",
};
const TAG_HELP = {
  BEAT: "doing better than expected — a good sign.",
  MATCH: "roughly in line with expectations — steady, no surprises.",
  MISS: "falling short of expectations — a worry.",
  WATCH: "not decided yet — keep an eye on it.",
};

const THESIS_ITEMS = [
  { key: "revenueGuide",     label: "Revenue landing within quarterly guide",    note: "Two consecutive misses would break this" },
  { key: "marginGuide",      label: "Gross margin holding within guided range",  note: "65.0–67.0% band per the Q3 2026 guide" },
  { key: "n2Ramp",           label: "N2 (2nm) node ramp on schedule",            note: "Volume ramp and CoWoS capacity expansion both tracking" },
  { key: "crossStraitRisk",  label: "No new export-control or tariff escalation", note: "Cross-strait and trade-policy risk is the wildcard" },
];
const PRICE_ZONES = [
  { label: "BEAR",    lo: 265, hi: 335, mid: 300, color: "#dd817a", action: "Exit / reduce if thesis also breaking" },
  { label: "BASE",    lo: 375, hi: 490, mid: 433, color: "#c59542", action: "Small add OK if thesis intact" },
  { label: "BULL",    lo: 565, hi: 640, mid: 603, color: "#66b278", action: "Let it ride — don't chase" },
];

// ── Chart geometry / axis ranges (per-stock: depends on price scale) ─────────
const GEOM = {
  priceMin: 150, priceMax: 720,
  fanGrid: [650, 550, 450, 350, 250],
  fanYears: ["2025", "2026", "2027"],
  trackMin: 100, trackMax: 450,
  trackGrid: [500, 400, 300, 200, 100],
  kpiMin: 30, kpiMax: 58,
  visLo: 200, visHi: 700,
  nowZoneLo: 390, nowZoneHi: 460,   // thresholds for the "NOW" dot zone tooltip on THE FUTURE signal panel
};

/* ── TEXT — every company-specific narrative/tooltip the engine renders. ──────
   Values are strings, HTML strings (rendered with dangerouslySetInnerHTML), or
   template functions the engine calls with computed values. If it mentions the
   company, a quarter, a guide number, or an event, it belongs HERE, not in the
   engine — that rule is what makes the engine safely reusable across stocks. */
const TEXT = {
  // header / footer
  priceTipLive: (px, at, asOf) => `Live quote: $${px} (fetched ${at}). The price is real-time, but the scenario bands and EPS are still as of ${asOf} — only the price-derived figures (scenario returns, P/E, band position) update live. Each ADR = 5 ordinary shares.`,
  priceTipStatic: (px, asOf, liveEnabled) => `$${px} as of ${asOf} — ${liveEnabled ? "live fetch unavailable (offline or blocked), using the saved price" : "static price (live fetch disabled)"}. Each ADR = 5 ordinary shares. Next earnings: Q3 2026 (~Oct 15, 2026).`,
  footerDisclaimer: (asOf) => `Illustrative scenario framing built on public consensus & estimates as of ${asOf} — not a prediction and not financial advice. Price ranges are scenario mid-bands; KPI markers are positional, not literal. Valuation ruler: forward GAAP EPS × P/E multiple. Data inputs will move with every print. Next earnings: Q3 2026 (~Oct 15, 2026).`,

  // fan chart
  fanHistory: "The solid white line is TSM's actual ADR price since Q1 2025. The run from ~$166 (Apr 2025 tariff-panic trough) to a $477.57 high (Jun 30, 2026) was driven almost entirely by the AI/HPC accelerator ramp overpowering cross-strait and export-control fear — then gave some back into and after the Q2 2026 print despite a genuine beat-and-raise.",
  fanNow: (px) => `TSM (ADR) trades around $${px} right now — down from a $477.57 pre-print high despite Q2 2026 beating on every disclosed line: $40.2B revenue (+33.7% YoY, above the $39.0–40.2B guide's own high end), 67.7% gross margin, $4.31 EPS. Management guided Q3 to $44.6–45.8B revenue / 65.0–67.0% margin and raised FY26 capex to $60–64B. Everything left of this dot is history; everything right is forecast.`,
  fanPastDot: (q, p) => `At the end of ${q}, TSM (ADR) was around $${p}.`,

  // scenario selector
  segmentedExplain: {
    bear: ["The pessimistic scenario", "Click to see what TSM looks like if the AI/HPC ramp actually stalls — a Q3 2026 guide miss, a slipped N2 ramp, or a fresh cross-strait/export-control shock reprices the stock from today's ~22x multiple back toward the 14–18x trough zone. Price would likely fall to the $265–335 range."],
    base: ["The most-likely scenario", "Click for the base view — Q3 2026 lands inside the newly-raised $44.6–45.8B revenue / 65.0–67.0% margin guide, N2 and CoWoS capacity expand on schedule, and TSM keeps compounding EPS without much further multiple re-rating. Price recovers toward the $375–490 range."],
    bull: ["The optimistic scenario", "Click to see the upside — Q3 2026 beats the $45.8B guide high end, full-year guidance gets raised a SECOND time, and the market re-rates TSM from a cyclical-foundry multiple toward a structural-monopoly multiple like NVDA/ASML. Price could reach $565–640."],
  },

  // KPI column
  kpiBaseline: (val) => `This is the most recent real number: TSM reported $${val}B in total revenue last quarter (+33.7% YoY, beating its own $39.0–40.2B guide's high end). The bars to the right are scenario forecasts for where it goes next.`,
  kpiForecast: (label, val) => `In this scenario, quarterly total revenue reaches ~$${val}B by ${label}. Management's Q3 2026 guide is $44.6–45.8B — taller bar = faster ramp.`,

  // reversion clock
  reversion: {
    header: "REVERSION CLOCK · APR 2025 TARIFF DISLOCATION",
    timeTip: "In April 2025, the 'Liberation Day' tariff announcement triggered a broad market selloff and chip-sector panic over potential semiconductor tariffs and cross-strait risk. TSM (ADR) fell to a multi-year low near $141. This bar shows how far along we are in the recovery cycle vs. the time it took to reclaim the base floor.",
    priceTip: (trough, baseFloor, now) => `Stock bottomed near $${trough} after the April 2025 tariff-panic selloff and needed to reach $${baseFloor} to re-enter the base band. At $${now} it has shot well past the base floor — the AI/HPC ramp overpowered the tariff fear.`,
    footerHtml: (baseFloor, precedentDays, now) => `The April 2025 tariff panic was a macro/policy shock, not a business miss — fundamentals stayed intact through it. Price reclaimed the $${baseFloor} base floor well within the ${precedentDays}-day precedent window and has continued to new all-time highs at $${now} on the AI/HPC ramp. The next dislocation risk to watch is a new tariff/export-control action or a cross-strait escalation — not a repeat of this one, but the same playbook would apply: <span style="color:#c59542;font-weight:700">has the thesis actually broken, or is this fear?</span>`,
  },

  // track record
  track: {
    lastDot: (post, nowPx) => `After Q2 2026 earnings (Jul 16), TSM (ADR) traded around $${post} — landing just under the OLD base band's floor ($415) even though revenue, margin, and EPS all beat guide, because the stock had already pulled back hard from its $477.57 pre-print high. Price sits at $${nowPx} today. Next dot: Q3 2026 earnings (~Oct 15, 2026).`,
    pastDot: (q, post) => `After ${q} earnings, TSM (ADR) actually traded around $${post}. Compare this dot to the colored bars behind it to see if the predicted range was right.`,
    readoutHtml: (hits, n, nowPx) => `Price has tracked <span style="color:#66b278;font-weight:700">base-or-better in ${hits} of ${n} quarters</span> since Q1 2025. Q2 2026 is the most interesting recent case: revenue beat guide's own high end ($40.2B, +33.7% YoY), gross margin beat (67.7%), EPS beat ($4.31) — yet the stock landed just BELOW the old base floor at $${nowPx}, a genuine "sell the news" pullback from a $477.57 pre-print high, not a business miss. FY26 capex guide was raised to $60–64B and revenue growth guide to "slightly above 40%" the same call. Next directional catalyst: <span style="color:#c59542;font-weight:700">Q3 2026 earnings (~Oct 15, 2026)</span> — revenue and gross margin vs. the newly-raised $44.6–45.8B / 65.0–67.0% guide.`,
    footnote: "⚠ Bands are reconstructed now, anchored to each date's forward EPS & multiple regime — not archived in real time. Treat levels as directional, especially \"lower-conf\" quarters. ADR price reflects 5 ordinary shares per ADR. Revenue and fab capacity are concentrated in Taiwan — treat all bands as wider than they appear given cross-strait/export-control tail risk.",
  },

  // THE CURRENT tab
  current: {
    statusNarrative: {
      broken: "Multiple signals missed. Thesis is under pressure — review the kill-switch criteria.",
      watch:  "Revenue beat but margin or guide disappointed, or cross-strait risk ticked up. Core thesis tracking — the Q3 2026 print (~Oct 15) is the next test. Not broken, but watch closely.",
      intact: "All key signals tracking as expected. The AI/HPC ramp and N2 node transition thesis remains intact — Q2 2026 beat on every disclosed line, even though the stock itself pulled back.",
    },
    panelTipStory: "Checks whether the original reasons to own TSM are playing out. Counts signals from the Q2 2026 print and Q3 2026 guide — revenue, gross margin, cross-strait risk, N2 ramp. 0–1 miss = thesis intact. 2 misses = watch. 3+ = exit. Click to see KPI bars and kill-switch.",
    watchChipHtml: `🔑 WATCH: Q3 2026 rev vs <span style="color:#c59542;font-weight:700">$44.6–45.8B</span> guide · ~Oct 15, 2026`,
    exitChipHtml: `⚠ EXIT IF: rev/GM miss guide <span style="font-weight:700">2 straight quarters</span>, or cross-strait risk escalates`,
    verdictBody: {
      broken:     (px) => `TSM at $${px}: kill-switch criteria met. Price position is irrelevant — signals say the AI/HPC ramp thesis is no longer playing out. The question is not whether to add; it is how much to reduce.`,
      watchBelow: (px) => `TSM at $${px} sits below the base floor but signals are mixed. Price is attractive, but adding into a weakening thesis is the wrong sequence. Wait for the Q3 2026 print (~Oct 15) to confirm or deny the pattern before deploying capital.`,
      below:      (px) => `TSM at $${px} sits below the base floor with the thesis intact — Q2 2026 revenue, margin, and EPS all beat guide, capex and revenue-growth guidance were both raised, and N2 crossed into real production. The market gave back the pre-print rally anyway ("sell the news" on already-elevated expectations); the fundamentals say it's sentiment/positioning, not demand destruction.`,
      inBase:     (px, statusWord) => `TSM at $${px} is inside the base range. Thesis ${statusWord} and price is fair — actually cheaper on a forward-P/E basis than before the Q2 print, since the EPS estimate rose faster than the price fell. Watch Q3 2026 revenue and gross margin vs the raised guide around Oct 15 — a beat opens the bull case; a miss reopens the bear.`,
      above:      (px) => `TSM at $${px} is above the base ceiling. The bull case — a second guide raise — needs to play out to justify entry. If already in, hold. If adding, wait for a pullback toward the base floor.`,
    },
    kpiTitle: "Total Revenue",
    kpiSub: "$B quarterly · HIGHER BETTER",
    kpiMeasures: "Total quarterly revenue, driven by N2/N3/N5 leading-edge wafer demand for AI accelerators and HPC, plus the broader smartphone/auto/IoT mix. Guided $44.6–45.8B for Q3 2026 — a steep +11-14% QoQ step-up from Q2's $40.2B.",
    kpiRequires: {
      bull: "Revenue beats guide every quarter and accelerates toward $56B by Q2 2027, confirming N2 ramps faster and broader than modeled.",
      base: "Revenue lands inside guide each quarter and scales toward $51B by Q2 2027, in line with the newly-raised capex and capacity plan.",
      bear: "Revenue misses the raised guide and stalls, signaling the Q2 2026 beat-and-raise was a peak rather than a trend, or a cross-strait/export-control shock hits.",
    },
    group1Title: "Revenue &amp; Margin Momentum",
    group2Title: "Geopolitical &amp; Technology Risk",
    killSwitch: "Two straight quarters of revenue or gross margin missing guide, or a new export-control/tariff action that materially restricts advanced-node shipments — exit / reduce. That is demand destruction or policy risk, not noise.",
    priceBanner: {
      below:  (px, baseLo) => `At $${px}, price is $${baseLo - px} below the base floor. Market is pricing in fear or profit-taking after a big run — not a fundamentals problem, given the Q2 beat-and-raise. Historically the window patient buyers use.`,
      inBase: (px) => `At $${px}, price is inside the base range. Fair value — not a discount, not expensive.`,
      above:  (px, baseHi) => `At $${px}, price is $${px - baseHi} above the base ceiling. The bull thesis needs to play out in full.`,
    },
    moodBanner: (currentPE, loPE, hiPE) => `At ${currentPE}× forward P/E, the market is pricing in continued N2/CoWoS execution and the Q3 2026 guide ($44.6–45.8B) landing roughly as promised — the multiple actually sits mid-band now (${loPE}–${hiPE}×), a real compression from the ~28x the stock traded at right before the Q2 print, because the EPS estimate rose faster than the price fell.`,
    cagrNotes: {
      low:  "Low bar — not priced for perfection. Even moderate execution justifies the price.",
      mid:  "Moderate bar — requires the N2 ramp and CoWoS capacity expansion to stay on schedule.",
      high: "High bar — requires near-perfect execution with no cross-strait or export-control disruption.",
    },
    fy26CardTip: (fy26) => `Adding Q1+Q2 2026 actuals to the base-case Q3–Q4 2026 projections gives a full-year run rate of roughly $${fy26}B, up from $122.2B in 2025 — comfortably inside management's own raised "slightly above 40%" USD revenue growth guide. That's what the base case — and roughly today's price — already assumes. The bull case requires the N2 ramp to push meaningfully above this.`,
    fy26CardHtml: (fy26, growthPct) => `Q1+Q2 2026 actuals plus base-case Q3–Q4 projections sum to roughly <span style="color:var(--blue-soft);font-weight:700">$${fy26}B</span> for full-year 2026 — the growth path today's price already assumes. 2025 actual revenue was <span style="color:#66b278">$122.2B</span>, so this implies <em>~${growthPct}%</em> YoY growth.`,
    peerCommentary: (currentPE) => `At ${currentPE}× NTM P/E, TSM trades at a discount to AVGO and a steep discount to NVDA despite sitting at the center of the same AI buildout — the market still prices foundry manufacturing below fabless design and GPU monopoly. ASML, the other irreplaceable chokepoint in the chain, re-rated sharply on its own Q2 2026 beat-and-raise (now ~50x forward EPS) — a reminder that TSM's own multiple compressing on a beat this quarter is a market-mood divergence between two AI chokepoints, not a shared read on the cycle.`,
  },

  // THE FUTURE tab
  future: {
    scenarioTips: {
      bear: "Triggered by: revenue/margin guide misses or a new export-control/tariff escalation. Multiple compresses toward the 14–18× trough zone. Note: at current price, bear downside is larger than bull upside.",
      base: (loPE, hiPE) => `Revenue and gross margin land within the newly-raised guide each quarter; N2 ramp and CoWoS capacity stay on schedule. P/E holds in the normal ${loPE}–${hiPE}× band. Modestly positive return from here as the stock re-tests its pre-print highs.`,
      bull: (currentPE) => `Revenue and margin beat the raised guide again; N2 ramps ahead of schedule and full-year guidance gets raised a SECOND time. Multiple re-rates from ~${currentPE}× toward the bull zone, closing the gap to the bull target.`,
    },
    downsideChevronTip: "Kill-switch: two straight quarters missing guide, or a new export-control/tariff escalation = exit / reduce.",
    dislocEventName: "the Apr 2025 tariff-panic low",
    dislocLabel: "SINCE APR 2025 TARIFF LOW",
    bearPriceTip: (bearMid, bearLo, bearHi, peTrough, peBearHi) => `$${bearMid} is the midpoint of the bear case range ($${bearLo}–$${bearHi}). This assumes a guide-miss pattern replaces the Q2 2026 beat-and-raise, or a new export-control/tariff action hits, and the multiple compresses toward the ${peTrough}–${peBearHi}× trough zone. The kill-switch is two straight quarters missing guide — if it triggers, do not average down.`,
    killSwitchTip: "A kill-switch is a pre-committed exit rule you set BEFORE you own the position — when you are thinking clearly. If revenue or gross margin misses guide for two straight quarters, or a new export-control/tariff action materially restricts advanced-node shipments, the thesis is broken: that's demand weakness or policy risk, not timing. Do not average down into a broken thesis — the market is telling you something. No debate, no rationalisation. Exit.",
    killSwitchTipNote: "Two straight misses, or a new export-control action. Either one. No debate.",
    killSwitchHtml: `<strong style="color:var(--title)">Two consecutive quarters missing the revenue or gross margin guide, or a new export-control/tariff escalation</strong> → exit or reduce. No debate. Do not average down into a broken thesis.`,
    nextCheck: "Next check: Q3 2026 earnings (~Oct 15, 2026)",
    downsideFootnote: (px, peTrough, peBearHi) => `Bear case scenario: guide misses or a new export-control/tariff escalation. Assumes a multiple compression toward ${peTrough}–${peBearHi}× on roughly flat-to-down EPS. Position loss is illustrative at $${px} entry.`,
    multipleSummary: (peNow, loPE, hiPE) => `At ~${peNow}× NTM P/E, TSM sits mid-way inside its historical normal range (${loPE}–${hiPE}×) — a real compression from the ~28x it traded at just before the Q2 2026 print, because the consensus EPS estimate rose faster than the price pulled back. Earnings beat; the multiple actually got cheaper.`,
    peBarTipSuffix: "TSM has clean GAAP earnings and low debt, so unlike some AI-semi peers there's no amortization distortion to strip out — this P/E is the real number.",
    deepValueZoneNote: "Historically cheap. Rare — last seen at the 2022 rate-shock bottom. Exceptional entry if thesis is intact.",
    dislocPrecedent: (baseFloor) => `Historical precedent: the April 2025 tariff-panic dislocation resolved within the 282-day base-reversion window when the fundamentals stayed intact. Base floor: $${baseFloor}.`,
    regretHtml: (currentPE) => `Q3 2026 revenue and margin <strong style="color:#66b278">materially beat the $44.6–45.8B / 65.0–67.0% guide</strong> AND full-year revenue or capex guidance is raised a SECOND time. That would confirm the Q2 2026 beat-and-raise was the start of a trend, not a peak, re-rate the stock from ~${currentPE}× toward the bull zone, and close today's entry window.`,
    regretTip: "Charlie Munger's inversion: instead of asking 'why should I buy?', ask 'what would I have to believe happened, in hindsight, to wish I had bought more?' If Q3 2026 beats the newly-raised guide and full-year revenue/capex guidance gets raised again, today's entry window will close fast. You will not get a second chance at this multiple if the bull case materialises. This question is not about FOMO — it is about sizing correctly for your conviction.",
    chips: [
      { label: "KILL-SWITCH: 2 STRAIGHT GUIDE MISSES → EXIT", col: "#dd817a" },
      { label: "REGRET IF: Q3 BEATS + FY GUIDE RAISED AGAIN", col: "#66b278" },
      { label: "NEXT CHECK: ~OCT 15, 2026 EARNINGS",          col: "#46aad9" },
    ],
    signalFootnote: (ntmEps) => `P/E uses GAAP NTM EPS $${ntmEps} — TSM has no meaningful intangible amortization to strip out, unlike fabless peers carrying large acquisition goodwill.`,
  },

  // THE PAST tab
  past: {
    cardTips: {
      durability: (revCagrPct) => `Looks at 10 years of Revenue, Gross Margin, and Free Cash Flow. We want upward trends that hold through cycles — not spike-and-crash. TSM has grown revenue at ~${revCagrPct}% CAGR almost entirely organically (no transformative M&A), with gross margin holding a 46–60% band through two real cyclical downturns (2019, 2022) and FCF growing more than 5×.`,
      value: (latestROIC) => `ROIC (Return on Invested Capital) measures how efficiently management deploys capital. Above WACC (~10–12% for a capital-intensive foundry) = value creation. Below = value destruction. TSM has never dropped below ~17% ROIC in 10 years, even at the 2022 cyclical trough — ${latestROIC}% today is healthy. Compressing FCF yield reflects the stock re-rating, not weaker cash generation.`,
      capex: (peakCapex, latestCapex, latestFCF) => `Capex as a % of revenue shows how much of every dollar gets reinvested before cash reaches shareholders. Foundries are capital-hungry by nature — the real test is whether spend converts into earnings. Capex/revenue peaked at ${peakCapex}% (2021, 3nm/5nm buildout) and has eased to ${latestCapex}% even as FCF hit a record $${latestFCF}B — spend is being monetized, not just expanded ahead of demand.`,
      mood: (evNow, evAvg) => `EV/EBITDA vs its own 10-year average tells you whether the market is paying a premium or discount for this business. Not a buy/sell signal on its own — context matters (growth rate, interest rates, sector rotation). Current EV/EBITDA of ${evNow}× sits above the 10Y average of ~${evAvg}× — the market is pricing in the AI buildout continuing on schedule.`,
    },
    stats: [
      { html: `Revenue <span style="color:#66b278;font-weight:700">$29B → $122B</span> (10Y)`, tipTitle: "Revenue (10-year)", tipBody: "TSM grew annual revenue from $29.3B (2016) to $122.2B (2025) — a ~17% CAGR, almost entirely organic with no transformative M&A. Growth tracks the world's compute buildout: smartphones and PCs through 2021, then AI/HPC accelerators from 2023 on." },
      { html: `FCF <span style="color:#66b278;font-weight:700">$6.4B → $34.8B</span> (10Y)`, tipTitle: "Free Cash Flow (10-year)", tipBody: "FCF grew from $6.4B (2016) to a record $34.8B (2025) — more than 5× in 10 years, even after funding the most capital-intensive buildout in the company's history. This is the clearest evidence the AI capex cycle is being monetized, not just spent." },
      { html: `Price <span style="color:#66b278;font-weight:700">+1,426%</span> (Jul 2016 → now)`, tipTitle: "Total price return (10-year)", tipBody: "From $27.78 (Jul 2016, ADR) to $423.93 today = +1,426%. Unlike many AI-cycle winners, this compounding came almost entirely from organic earnings growth and multiple re-rating — not acquisitions. Past returns are anchored to a foundry-leadership position and an AI buildout pace that may not repeat." },
    ],
    verdictBody: "TSM has compounded revenue at ~17% annually for 10 years almost entirely through organic growth — no transformative acquisitions, unlike many semiconductor peers. Gross margins held a 46–60% band through two real cyclical downturns (2019, 2022), FCF grew more than 5×, and ROIC never dropped below ~17% even at the trough. The business has earned the right to a premium multiple — the open question is whether the current AI-cycle multiple survives the next downturn, not whether the foundry franchise itself is durable.",
    banners: {
      durability: (revCagrPct, rev0, rev9, gmDelta, latestGM, fcf0, latestFCF) => `Revenue compounded at ~${revCagrPct}% annually from $${rev0}B (2016) to $${rev9}B (2025) — almost entirely organic, with no transformative M&A. Gross margin expanded ${gmDelta} points to ${latestGM}%, even as the 2023 smartphone/PC correction cut revenue ~9% YoY. FCF grew from $${fcf0}B to $${latestFCF}B.`,
      value: (latestROIC) => `ROIC of ${latestROIC}% (2025) exceeds a typical WACC of 10–12% for a capital-intensive foundry, meaning each dollar reinvested creates more than a dollar of value. Unlike acquisition-driven peers, TSM's ROIC has never dipped below ~17% in 10 years — even through the 2022–2023 cyclical air-pocket — because the spend is reinvested into the same organic franchise, not bolt-on deals that take years to earn through.`,
      capex: (latestCapex, peakCapex, latestFCF, fy26Guide) => `Capex/revenue of ${latestCapex}% (2025) is well off the ${peakCapex}% peak (2021) even as FCF hit a record $${latestFCF}B. The FY2026 guide is $${fy26Guide}B+ — the next test is whether intensity keeps falling against a fast-growing revenue base, or the AI buildout pushes it back up. A threat (losing the AI race) explains the spend; only results — falling intensity, rising FCF — justify it.`,
      mood: (evNow, evAvg) => `EV/EBITDA of ${evNow}× sits above the 10-year average of ${evAvg}× — the multiple has nearly doubled since the 2022 chip-cycle trough (~7×) as the AI buildout re-rated the stock. The price itself is sitting at an all-time high today, not recovering from a drawdown — the kind of setup where the next move depends entirely on whether earnings catch up to the multiple, or the multiple gives some back first.`,
    },
    revAnnotationsHtml: `<span>2023: <span style="color:var(--tx3)">$69.4B</span> (phone/PC correction)</span><span>2025: <span style="color:var(--tx3)">$122.2B</span> (AI/HPC ramp)</span>`,
    roicNote: "Green >15% · Amber 5–15% · Red <5% — TSM has stayed green every year on record",
    fcfYieldNote: "Declining yield = stock re-rating higher (not declining FCF). FCF itself grew ~5.4× over the decade.",
    capexAnnotationsHtml: `<span>2021: <span style="color:#dd817a">53.5%</span> (3nm/5nm buildout)</span><span>2024: <span style="color:#66b278">33.3%</span> (AI revenue catches up)</span><span>2025: <span style="color:#66b278">33.4%</span> (holding, not re-accelerating)</span>`,
    footnotes: {
      durability: "TSM's growth is organic — there is no acquisition playbook to adjust for. The 2018–2019 margin compression (48% → 46%) reflects a 7nm ramp absorbing yield costs alongside a smartphone-cycle slowdown. 2022's revenue peak ($75.9B) was followed by a real ~9% YoY contraction in 2023 as post-COVID PC/smartphone inventory unwound — the closest thing to a bear case realized in this data. 2024–2025 mark the AI/HPC re-acceleration: revenue +36% in 2025 alone, with gross margin recovering to a 10-year high of 59.9%.",
      value: "ROIC has stayed in a 17–25% band for 10 straight years, including the 2022–2023 downturn — there is no acquisition-integration dip to explain away, because there's no acquisition. FCF yield compression from 4.4% (2016) to 2.7% (2025) reflects the stock's multiple expanding faster than its cash flow, not cash flow deteriorating — FCF itself hit a record $34.8B in 2025. The open question for THE FUTURE tab is whether today's multiple is paying for AI demand that's already arrived, or demand still to come.",
      capex: "Capex/revenue peaked at 53.5% in 2021 during the 3nm/5nm buildout, then fell every year through 2024 as that revenue arrived — proof the prior cycle's spend was monetized, not stranded. The FY2026 guide of $52–56B looks large in isolation, but what matters is the ratio: it's been trending down, not up, even as absolute capex rises. The kill-switch for this panel: if capex/revenue climbs back above ~40% without a matching FCF increase, the AI buildout has stopped paying for itself.",
      mood: "The scenario bands on the other tabs use forward P/E, not EV/EBITDA — TSM carries little debt and clean GAAP earnings, so P/E is a fair ruler here (unlike AVGO, where intangible amortization distorts GAAP EPS). EV/EBITDA is shown here purely to track cross-cycle mood, since it's capital-structure-neutral. The multiple bottomed near 7× at the 2022 trough — when the AI story didn't exist yet — and sits at 14.1× today with the AI story fully priced. That gap is real re-rating, not just earnings growth, and it can compress as fast as it expanded.",
    },
    priceChartTitle: "TSM PRICE (ADR) · 10-YEAR MONTHLY · 2016–2026",
    priceChartSub: "$ per ADR (1 ADR = 5 ordinary shares) · dashed lines = key events",
    priceNowTip: (px, isATH) => `$${px} — where TSM (ADR) trades today, ${isATH ? "also the highest monthly close in this 10-year window" : "off the all-time high"}. The chart shows organic compounding with sharp drawdowns during the 2018–19 smartphone-cycle slowdown and the 2022 chip-cycle trough (−51%), then a sustained AI/HPC-driven re-rating from 2023 on.`,
    ddTip: (minDD) => `${minDD}% — the deepest drop from a prior all-time high in the 10-year window. This occurred during the Oct 2022 chip-cycle trough (smartphone/PC inventory correction, pre-AI). TSM recovered and went on to make new highs as the AI/HPC cycle took over. Drawdown charts help you visualize what holding through a bad period actually felt like.`,
    ddAnnotationsHtml: `<span>Max drawdown: <span style="color:#dd817a">−51.1%</span> (Oct 2022, chip-cycle trough)</span><span>Current: <span style="color:#66b278">0.0%</span> from ATH — today IS the high</span>`,
  },
};
