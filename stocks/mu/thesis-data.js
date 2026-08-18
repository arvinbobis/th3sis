/* ╔══════════════════════════════════════════════════════════════════════════╗
   ║   MU · thesis-data.js — ALL per-stock content lives here.                ║
   ║   ███  EDIT EVERYTHING IN THIS FILE EACH QUARTER  ███                    ║
   ║                                                                          ║
   ║   The rendering engine (../engine/thesis-engine.js) contains ZERO        ║
   ║   company-specific strings — every number, narrative, and tooltip        ║
   ║   that mentions MU is in this file. Quarterly touch = edit this          ║
   ║   file only, then run: node tools/lint-thesis-data.js MU                 ║
   ║                                                                          ║
   ║   Micron fiscal year ends Aug 31 (Q1=Sep–Nov, Q2=Dec–Feb, etc.)          ║
   ║   Migrated to the engine split 2026-07-19 (structural migration —        ║
   ║   ports the existing 07-16 CASES/SIGNALS/TRACK content verbatim; no      ║
   ║   new fundamentals this touch). THE PAST tab is NEW — MU's pre-split     ║
   ║   build had no PAST/FUTURE tab-nav at all, so PAST_* below is freshly    ║
   ║   sourced (Wisesheets FY2021-25, SEC-cited; web-search FY2016-20,        ║
   ║   lower-confidence — see notes inline).                                  ║
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

const TICKER_META = { ticker: "MU", exchange: "NASDAQ", company: "Micron Technology, Inc." };
const AS_OF_DATE = "2026-07-16";

// Jun 2025 memory down-cycle / tariff panic (52-wk low ~$102). No new shock since —
// Q3 FY26 was a blowout beat, not a dislocation — so left unchanged from the 07-16 touch.
const DISLOCATION_DATE = "2025-06-01";
const REVERSION_TROUGH = 102;
const REVERSION_BASEFLOOR = 310;
const REVERSION_PRECEDENT_DAYS = 180;

const CASES = {
  bear: {
    key: "bear", label: "BEAR", accent: "#f1564b", glow: "rgba(241,86,75,0.45)",
    target12: "$550 — $750",
    op: "No new MU print since Q3 FY2026 ($41.46B vs $33.5B guide, 84.9% GM, Q4 guided $50B±$1B, $100B in SCAs) — but the stock has fallen ~15% from this update's own $979 starting point (to ~$880) inside a broader memory-sector selloff: SK Hynix's Q2 2026 profit estimate came in ~8% below consensus on delayed HBM4 shipments, triggering a KOSPI trading halt, and CXMT's rapid DRAM share gain (now the #4 global producer, ~$8.5B IPO planned) revived China-competition fears. MU, Samsung, and SK Hynix are all down 20%+ from recent highs. The bear case's own named risk (Samsung/CXMT taking HBM4 share) just got louder in the headlines — but SK Hynix's miss was its OWN execution/shipment-timing problem, not evidence Micron's HBM4 ramp or its $100B in binding SCAs are impaired. If this turns out to be sector-wide HBM4 ramp difficulty rather than a Micron-specific issue, the bear case hasn't actually gotten stronger — the market's 6.4x multiple just got more skeptical of the whole group at once.",
    breaks: "Q4 FY2026 actual results (reports ~late Sept 2026) land within guide AND FY2027 initial guidance confirms the cycle extending — the SCAs alone would need to be shown as fictional or reneged-on to break this case harder than that.",
    requires01: "Q4 FY26 actual misses the $50B±$1B guide, OR FY2027 initial guidance signals deceleration on non-SCA volume",
    requires02: "Samsung/CXMT visibly take HBM4 share from Micron in named design wins (not just SK Hynix's own shipment delay, and not just CXMT's commodity-DRAM share gain)",
  },
  base: {
    key: "base", label: "BASE", accent: "#e0a83b", glow: "rgba(224,168,59,0.40)",
    target12: "$1,100 — $1,350",
    op: "Fundamentals are unchanged since the 07-11 update — this is a price move, not a thesis move. The $100B in SCAs (5-year, binding, take-or-pay, $22B customer cash) still contractually de-risks ~20% of DRAM and ~1/3 of NAND volume regardless of what SK Hynix's shipment timing or CXMT's IPO plans do. Sell-side hasn't blinked: 29-analyst consensus target is $1,316.79 (96%+ Buy/Strong Buy, zero Sells), KeyBanc raised its target to $1,750 on Jul 14 — during the selloff, not before it — and UBS reiterated a positive view calling fundamentals 'solid.' Some of the selling flow is mechanical, not fundamental: SK Hynix's own Jul 10 Nasdaq ADR listing gives investors a direct place to rotate capital into a Korean HBM pure-play, which can pressure MU/Samsung without saying anything about MU's own numbers. Michael Burry's disclosed short is the one named bear voice actually betting against the group, not just a headline risk. Base case reads this as a real, if uncomfortable, buying-fear window rather than a re-rating — target12 is unchanged from the 07-11 update since nothing in the SCA/HBM4 story actually broke.",
    breaks: "Q4 FY2026 actual misses the $50B±$1B guide, or FY2027 initial guidance (given with Q4 results) signals the cycle peaking rather than extending.",
    requires01: "Q4 FY26 actual lands within $50B±$1B guide; GM holds ~85–87%",
    requires02: "FY2027 initial guidance (with Q4 print) signals continued tightness, consistent with the SCA visibility",
  },
  bull: {
    key: "bull", label: "BULL", accent: "#3fd07a", glow: "rgba(63,208,122,0.45)",
    target12: "$1,500 — $1,800",
    op: "Q4 FY2026 beats the $50B guide high end and FY2027 initial guidance gets raised meaningfully above run-rate, confirming the cycle is still accelerating, not just extending. Micron holds or grows HBM4 share despite Samsung's head start — the 'twice as fast as HBM3E' ramp claim proves out in named design wins, not just internal metrics. The market fully re-rates MU from 'cyclical memory company' to 'contractually de-risked AI-infrastructure supplier' — the same re-rating AVGO got for its networking/VMware mix — moving the forward multiple from today's skeptical ~6.4× toward 12–13×. KeyBanc's fresh $1,750 target (set mid-selloff, Jul 14) is already ahead of this case's own $1,800 ceiling on a 12-month view — the bull case here is largely 'the market's own published optimism actually shows up in the price' once the current sector-wide fear (SK Hynix's own miss, CXMT headlines, capital rotation into SK Hynix's new ADR) clears, not a more aggressive forecast than Wall Street's.",
    breaks: "Q4 FY2026 actual misses guide, or Samsung/SK Hynix visibly close the HBM4 gap in named customer wins rather than just certification timing.",
    requires01: "Q4 FY26 beats $50B+$1B (i.e. ≥$51B); FY2027 guidance raised above the implied run-rate",
    requires02: "Micron HBM4 design wins hold vs Samsung's mass-production head start; GM sustains ≥86%",
  },
};

// THESIS_HISTORY — append-only archive of the full CASES set as it stood at each
// touch, captured BEFORE that touch's Layer-2 audit rewrites it. Same discipline
// as TSM's thesis-data.js: never edit a past entry. This is a structural migration
// (2026-07-19), so no new entry is pushed here — the archive carries forward exactly
// as it stood after the 07-16 fundamentals touch.
const THESIS_HISTORY = [
  { asOf: "2026-07-11", quarter: "Q3 FY26", cases: {
    bear: { target12: "$550 — $750", op: "Q3 FY2026 blew past every prior threshold ($41.46B vs $33.5B guide, 84.9% GM, Q4 guided to $50B±$1B), and the $100B in 16 strategic customer agreements (SCAs, 2026–2030, floor margins 'well beyond historical peaks') meaningfully de-risks ~20% of DRAM and ~1/3 of NAND volume. The bear case is narrower than it used to be, but not gone: it now rests on the ~70–80% of volume NOT covered by SCAs. Samsung has already passed NVIDIA/AMD HBM4 certification and started mass production FIRST — ahead of Micron — a real, named competitive threat the old bull thread didn't have to answer. If HBM4 share losses to Samsung compound, or FY2027 guidance (first given with Q4 results, ~Sept 2026) disappoints on non-contracted volume, the market's already-skeptical 6.4× forward multiple compresses further even without an SCA breach.", breaks: "Q4 FY2026 actual results (reports ~late Sept 2026) land within guide AND FY2027 initial guidance confirms the cycle extending — the SCAs alone would need to be shown as fictional or reneged-on to break this case harder than that.", requires01: "Q4 FY26 actual misses the $50B±$1B guide, OR FY2027 initial guidance signals deceleration on non-SCA volume", requires02: "Samsung/CXMT visibly take HBM4 share from Micron in named design wins, not just qualification timing" },
    base: { target12: "$1,100 — $1,350", op: "Q4 FY2026 lands within the $50B±$1B guide and ~86% GM, confirming Q3's blowout wasn't a one-off. The $100B in SCAs — 5-year, binding, take-or-pay, backed by $22B in customer cash/commitments — is real evidence the demand is contracted, not pulled forward: management itself says it has 'no idea when the RAM crisis will end' and expects tight supply-demand through 2027, gradual improvement only in 2028. HBM4 continues ramping twice as fast as HBM3E did. The market's forward P/E, currently a historically compressed ~6.4× despite record earnings, drifts modestly higher (toward 8–9×) as more quarters validate the SCA thesis over cyclical skepticism — but doesn't fully re-rate, since Samsung's HBM4 mass-production lead keeps a real competitive question open.", breaks: "Q4 FY2026 actual misses the $50B±$1B guide, or FY2027 initial guidance (given with Q4 results) signals the cycle peaking rather than extending.", requires01: "Q4 FY26 actual lands within $50B±$1B guide; GM holds ~85–87%", requires02: "FY2027 initial guidance (with Q4 print) signals continued tightness, consistent with the SCA visibility" },
    bull: { target12: "$1,500 — $1,800", op: "Q4 FY2026 beats the $50B guide high end and FY2027 initial guidance gets raised meaningfully above run-rate, confirming the cycle is still accelerating, not just extending. Micron holds or grows HBM4 share despite Samsung's head start — the 'twice as fast as HBM3E' ramp claim proves out in named design wins, not just internal metrics. The market fully re-rates MU from 'cyclical memory company' to 'contractually de-risked AI-infrastructure supplier' — the same re-rating AVGO got for its networking/VMware mix — moving the forward multiple from today's skeptical ~6.4× toward 12–13×. This is close to where 45-analyst consensus already sits (avg 12-month target ~$1,486, high $1,600) — the bull case here is largely 'the market's own published optimism actually shows up in the price,' not a more aggressive forecast than Wall Street's.", breaks: "Q4 FY2026 actual misses guide, or Samsung/SK Hynix visibly close the HBM4 gap in named customer wins rather than just certification timing.", requires01: "Q4 FY26 beats $50B+$1B (i.e. ≥$51B); FY2027 guidance raised above the implied run-rate", requires02: "Micron HBM4 design wins hold vs Samsung's mass-production head start; GM sustains ≥86%" },
  } },
  { asOf: "2026-06-03", quarter: "Q2 FY26", cases: {
    bear: { target12: "$320 — $520", op: "HBM demand peaks as NVIDIA Blackwell deployments complete and Samsung resolves HBM3E qualification with major customers. Q4 FY2026 guidance (given June 24) comes in below $30B, signaling the cycle has peaked. Gross margins guide lower, NAND remains oversupplied, and the market applies a cyclical trough multiple. Every prior memory cycle has seen 50–70% peak-to-trough stock declines — the bear case argues AI HBM is not immune to the economics of semiconductor oversupply.", breaks: "Q3 meets $33.5B AND Q4 is guided at $34B+ on June 24, proving the cycle has at minimum two more strong quarters ahead.", requires01: "Q3 misses $33.5B guide OR Q4 guided below $30B", requires02: "Gross margin fails to hold above 75% for Q4" },
    base: { target12: "$900 — $1,100", op: "Q3 FY2026 meets $33.5B with 81% gross margins. Q4 is guided at $34–37B as HBM4 volumes begin ramping alongside HBM3E production. NAND margins gradually recover. The cycle extends through FY2027 at still-elevated margins of 60–70%, and the market continues to pay 13–15× on exceptionally high earnings. HBM manufacturing complexity (3× wafer consumption vs. DDR5) keeps supply disciplined for another year. Stock trades sideways around current levels with high volatility into each print.", breaks: "Q4 FY2026 guided below $30B on June 24 — that single data point collapses the base case entirely.", requires01: "Q3 meets $33.5B; Q4 guided ≥$34B; cycle extending", requires02: "Gross margin ≥78% in Q3; Q4 guided similarly" },
    bull: { target12: "$1,200 — $1,500", op: "Q3 materially beats ($35B+ on $33.5B guide), Q4 is guided above $38B, and management raises full-year FY2027 outlook. HBM4 ramping 'twice as fast as HBM3E' becomes a competitive wedge against SK Hynix as NVIDIA diversifies HBM sourcing. The market begins re-rating MU from 'cyclical memory company' toward 'AI infrastructure critical supplier' as it did for AVGO — moving from 13× toward 17–18× FY2027 earnings. FY2027 EPS estimates rise to $85–90+.", breaks: "Q3 gross margins fail to hit 81% guidance — that single miss would break the pricing-power narrative the bull case rests on.", requires01: "Q3 beats $35B+; Q4 guided ≥$38B", requires02: "GM 82%+ in Q3; HBM4 share gains vs SK Hynix confirmed" },
  } },
];

const FALLBACK_PRICE = 880.00;

const LIVE_PRICE = {
  enabled: true,
  symbol: "MU",
  provider: "yahoo",                                  // "yahoo" (keyless, proxied) | "finnhub"
  corsProxy: "https://api.allorigins.win/get?url=",
  finnhubToken: "",
};

// ALERT — buy-trigger pre-commitment. Canonical source is PF_ALERTS.MU in
// stocks/portfolio/portfolio-data.js; this copy is a FALLBACK for offline opens.
const ALERT = {
  symbol: "MU",
  buyFloor: 1100,
  thesisIntact: true,
  asOf: "2026-07-16",
  nextEarnings: "~2026-09-24",
};

const HISTORY = [
  { q: "Q4 FY25", p: 135  },
  { q: "Q1 FY26", p: 310  },
  { q: "Q2 FY26", p: 620  },
  { q: "Q3 FY26", p: 1059 },
  { q: "NOW",     p: FALLBACK_PRICE },
];

const PROJ_END = { bear: 650, base: 1225, bull: 1650 };
const FUTURE_Q = ["Q4 FY26", "Q1 FY27", "Q2 FY27", "Q3 FY27"];

const SIGNALS = {
  bear: [
    { name: "Q3 FY26 Revenue (Actual)", unit: "$B", tag: "BEAT",  next: "~Sep 2026 (Q4)", val: "ACTUAL $41.46B (+24% vs guide)", guide: "GUIDE was $33.5B ±$750M", pos: 0.95 },
    { name: "Q4 FY26 Revenue Guide",    unit: "$B", tag: "WATCH", next: "~Sep 2026",       val: "GUIDED $50.0B ±$1.0B",           guide: "actual reports ~late Sep", pos: 0.15 },
    { name: "Gross Margin (Actual + Guide)", unit: "%", tag: "BEAT", next: "~Sep 2026", val: "ACTUAL 84.9% / GUIDE ~86%", guide: "GUIDE was ~81%", pos: 0.90 },
  ],
  base: [
    { name: "Q3 FY26 Revenue (Actual)", unit: "$B", tag: "BEAT",  next: "~Sep 2026 (Q4)", val: "ACTUAL $41.46B (+24% vs guide)", guide: "GUIDE was $33.5B ±$750M", pos: 0.95 },
    { name: "Q4 FY26 Revenue Guide",    unit: "$B", tag: "WATCH", next: "~Sep 2026",       val: "GUIDED $50.0B ±$1.0B",           guide: "actual reports ~late Sep", pos: 0.60 },
    { name: "Gross Margin (Actual + Guide)", unit: "%", tag: "BEAT", next: "~Sep 2026", val: "ACTUAL 84.9% / GUIDE ~86%", guide: "GUIDE was ~81%", pos: 0.90 },
  ],
  bull: [
    { name: "Q3 FY26 Revenue (Actual)", unit: "$B", tag: "BEAT",  next: "~Sep 2026 (Q4)", val: "ACTUAL $41.46B (+24% vs guide)", guide: "GUIDE was $33.5B ±$750M", pos: 0.95 },
    { name: "Q4 FY26 Revenue Guide",    unit: "$B", tag: "WATCH", next: "~Sep 2026",       val: "GUIDED $50.0B ±$1.0B",           guide: "actual reports ~late Sep", pos: 0.88 },
    { name: "Gross Margin (Actual + Guide)", unit: "%", tag: "BEAT", next: "~Sep 2026", val: "ACTUAL 84.9% / GUIDE ~86%", guide: "GUIDE was ~81%", pos: 0.92 },
  ],
};
const MARGIN = {
  bear: [
    { name: "$100B Strategic Customer Agreements", tag: "MATCH", next: "Ongoing / each print", pos: 0.55 },
    { name: "HBM4 Competitive Position",            tag: "WATCH", next: "Ongoing",              pos: 0.30 },
  ],
  base: [
    { name: "$100B Strategic Customer Agreements", tag: "MATCH", next: "Ongoing / each print", pos: 0.60 },
    { name: "HBM4 Competitive Position",            tag: "WATCH", next: "Ongoing",              pos: 0.52 },
  ],
  bull: [
    { name: "$100B Strategic Customer Agreements", tag: "MATCH", next: "Ongoing / each print", pos: 0.65 },
    { name: "HBM4 Competitive Position",            tag: "WATCH", next: "Ongoing",              pos: 0.75 },
  ],
};

const KPI_HIST = 41.46;   // Q3 FY2026 actual (new baseline)
const KPI_PROJ = {
  bear: [49.0, 42.0, 33.0, 26.0],
  base: [50.0, 51.0, 49.0, 52.0],
  bull: [51.0, 56.0, 62.0, 68.0],
};

// TRACK RECORD — append newest to end; dashboard keeps last TRACK_WINDOW.
const TRACK_ALL = [
  { q: "Q2 FY25", date: "2025-03", post: 108, reaction: "+",  bear: [55,72],   base: [85,115],  bull: [126,165], landed: "base",      conf: "med"  },
  { q: "Q3 FY25", date: "2025-06", post: 112, reaction: "+",  bear: [60,82],   base: [90,122],  bull: [136,175], landed: "base",      conf: "high" },
  { q: "Q4 FY25", date: "2025-09", post: 148, reaction: "++", bear: [78,106],  base: [118,158], bull: [172,222], landed: "base→bull", conf: "high" },
  { q: "Q1 FY26", date: "2025-12", post: 340, reaction: "++", bear: [95,130],  base: [155,208], bull: [232,298], landed: "bull",      conf: "high" },
  { q: "Q2 FY26", date: "2026-03", post: 620, reaction: "++", bear: [242,322], base: [382,502], bull: [545,682], landed: "bull",      conf: "high" },
  { q: "Q3 FY26", date: "2026-06", post: 979, reaction: "-",  bear: [320,520], base: [900,1100], bull: [1200,1500], landed: "base",   conf: "high" },
];
const TRACK_WINDOW = 6;

// THE PAST — annual history. FY2021-FY2025 via Wisesheets (SEC-cited, 10-K/10-Q line
// items, filing accession 0000723125-25-000028 for FY2025); FY2016-FY2020 web-sourced
// from Micron's own 8-K earnings-release press tables (GAAP), marked lower-confidence
// per CLAUDE.md convention — pre-2021 is reconstructed from public figures, not a live
// Wisesheets citation. ROIC and EV/EBITDA for FY2016-2020 are further approximated
// (NOPAT/Total-Assets proxy; EV using representative quarter-end price × ~1.15B shares)
// since balance-sheet detail that far back isn't in the free-tier Wisesheets window either.
const PAST_YEARS       = ["2016","2017","2018","2019","2020","2021","2022","2023","2024","2025"];
const PAST_REV         = [12.40, 20.32, 30.39, 23.41, 21.44, 27.71, 30.76, 15.54, 25.11, 37.38];
const PAST_GM          = [20.0,  41.5,  58.9,  45.7,  30.6,  37.6,  45.2,  -9.1,  22.4,  39.8];
const PAST_FCF         = [-2.23, 2.90,  8.32,  4.08,  0.36,  2.44,  3.11,  -6.12, 0.12,  1.67];
const PAST_ROIC        = [0.5,   15.8,  30.1,  12.9,  5.5,   10.0,  13.3,  -9.2,  1.2,   10.4];
const PAST_EVEBITDA    = [6.0,   4.9,   2.5,   3.6,   5.6,   6.6,   3.7,   40.1,  12.5,  7.6];
const PAST_FCF_YIELD   = [-11.2, 6.6,   16.4,  8.5,   0.7,   2.9,   4.9,   -8.0,  0.1,   1.2];
const PAST_CAPEX_REV   = [43.5,  25.8,  29.9,  38.9,  37.1,  36.2,  39.2,  49.4,  33.4,  42.4];

// Price series: quarterly (2016-Q1 through 2021-Q2, web-sourced, lower-confidence)
// then real monthly closes (2021-Jul through 2026-Jul, Wisesheets EOD, order asc).
const PRICE_M_LABELS = ["2016-03","2016-06","2016-09","2016-12","2017-03","2017-06","2017-09","2017-12","2018-03","2018-06","2018-09","2018-12","2019-03","2019-06","2019-09","2019-12","2020-03","2020-06","2020-09","2020-12","2021-03","2021-06","2021-07","2021-08","2021-09","2021-10","2021-11","2021-12","2022-01","2022-02","2022-03","2022-04","2022-05","2022-06","2022-07","2022-08","2022-09","2022-10","2022-11","2022-12","2023-01","2023-02","2023-03","2023-04","2023-05","2023-06","2023-07","2023-08","2023-09","2023-10","2023-11","2023-12","2024-01","2024-02","2024-03","2024-04","2024-05","2024-06","2024-07","2024-08","2024-09","2024-10","2024-11","2024-12","2025-01","2025-02","2025-03","2025-04","2025-05","2025-06","2025-07","2025-08","2025-09","2025-10","2025-11","2025-12","2026-01","2026-02","2026-03","2026-04","2026-05","2026-06","2026-07"];
const PRICE_M = [10.76,13.42,17.34,21.38,23.51,29.12,38.36,40.1,42.64,56.17,44.11,30.95,37.28,37.64,41.79,52.45,51.78,50.25,45.8,73.32,76.34,82.88,77.58,73.7,70.98,69.1,84.0,93.15,82.27,88.86,77.89,68.19,73.84,55.28,61.86,56.53,50.1,54.1,57.65,49.98,60.3,57.82,60.34,64.36,68.2,63.11,71.39,69.94,68.03,66.87,76.12,85.34,85.75,90.61,117.89,112.96,125.0,131.53,109.82,96.24,103.71,99.65,97.95,84.16,91.24,93.63,86.89,76.95,94.46,123.25,109.14,119.01,167.32,223.77,236.48,285.41,414.88,412.37,337.84,517.16,971.0,1154.29,880.0];
const PRICE_M_DD = [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,-21.5,-44.9,-33.6,-33.0,-25.6,-6.6,-7.8,-10.5,-18.5,0.0,0.0,0.0,-6.4,-11.1,-14.4,-16.6,0.0,0.0,-11.7,-4.6,-16.4,-26.8,-20.7,-40.7,-33.6,-39.3,-46.2,-41.9,-38.1,-46.3,-35.3,-37.9,-35.2,-30.9,-26.8,-32.2,-23.4,-24.9,-27.0,-28.2,-18.3,-8.4,-7.9,-2.7,0.0,-4.2,0.0,0.0,-16.5,-26.8,-21.2,-24.2,-25.5,-36.0,-30.6,-28.8,-33.9,-41.5,-28.2,-6.3,-17.0,-9.5,0.0,0.0,0.0,0.0,0.0,-0.6,-18.6,0.0,0.0,0.0,-23.8];
const PAST_EVENTS = [
  { idx: 11, label: "Chip Downturn", note: "Dec 2018 — smartphone/PC inventory correction plus early US-China trade-war fears. Micron's stock fell ~45% from its June 2018 peak as DRAM/NAND pricing rolled over hard after the historic FY2018 supercycle (58.9% GM, $30.4B revenue). A classic memory air-pocket — the deepest part of the 2018-2019 downcycle." },
  { idx: 16, label: "COVID Crash",   note: "Mar 2020 — broad COVID selloff (quarterly resolution here understates the intraday crash and V-shaped recovery). Memory demand held up better than feared as remote-work/cloud pulled forward server and PC demand." },
  { idx: 39, label: "Chip Cycle Trough", note: "Dec 2022 — the deepest drawdown in this 10-year window (-46.3% from the prior high). Fed rate-hiking cycle plus a severe DRAM/NAND inventory glut; Micron posted a rare GAAP net loss for FY2023 (-9.1% gross margin) as pricing collapsed across the industry." },
  { idx: 54, label: "AI/HBM Inflection", note: "Mar 2024 — Micron's stock reclaims its prior all-time high for the first time since the 2018 supercycle, as HBM demand tied to NVIDIA's AI-accelerator ramp became a visible, quantifiable revenue driver rather than a narrative." },
  { idx: 67, label: "Tariff/Memory Panic", note: "Apr 2025 — broad tariff-panic selloff (this quarterly-resolution point shows a -41.5% drawdown; the REVERSION_TROUGH used elsewhere in this file, $102, is the actual intraday/52-week low reached shortly after, around Jun 2025 — DISLOCATION_DATE). Fundamentals stayed intact through it; the AI/HBM supercycle overpowered the fear within months." },
];

const VAL_CONFIG = {
  ntm_eps:              135,
  shares_b:              1.11,
  fcf_ntm_b:            55.0,
  risk_free_pct:         4.3,
  default_discount_pct:  10.0,
  default_terminal_pe:   9,
  dcf_years:              5,
  capex_fy26_guide_b:    28,      // judgment estimate — FY2025 actual was $15.86B; FY2026 capex has not been given as a single full-year guide, but the SCA-backed expansion and Q4 alone guiding to $50B revenue imply a materially higher build-out than FY2025. Held loosely.
  prior_fy_rev_b:       37.38,     // FY2025 actual (last full fiscal year before the supercycle inflection)
  prior_fy_label:       "FY2025",
  pe_trough: 4, pe_bear_hi: 6.5, pe_normal_lo: 7, pe_normal_hi: 11, pe_bull_lo: 12, pe_peak: 16,
  peers: [
    { t: "MU",        fpe: 6.5,  ev_eb: 8.8,  fcf_y: 5.6, note: "HBM/DRAM chokepoint, contractually de-risked via $100B SCAs" },
    { t: "000660.KS",  fpe: 6.8,  ev_eb: 6.5,  fcf_y: 6.0, note: "SK Hynix — HBM share leader; own Jul 10 Nasdaq ADR listing, Q2 2026 shipment-timing miss" },
    { t: "005930.KS",  fpe: 6.8,  ev_eb: 6.9,  fcf_y: 5.2, note: "Samsung Electronics — HBM4 mass-production first-mover, but union/wage-cost risk" },
    { t: "WDC",       fpe: 10.2, ev_eb: 9.1,  fcf_y: 4.0, note: "NAND/HDD storage — memory-cycle beneficiary, less AI/HBM-levered than MU" },
    { t: "SNDK",      fpe: 26.0, ev_eb: 14.0, fcf_y: 2.3, note: "NAND-pure-play spinoff — up 635% YTD as of Jul 2026, richest multiple of the group" },
  ],
};

const SIGNAL_HELP = {
  "Q3 FY26 Revenue (Actual)": "Micron's Q3 FY2026 actual result, reported June 24, 2026: $41.46B — a 24% beat vs the $33.5B guide, +346% YoY, +74% sequentially, the largest dollar increase in company history. This single quarter exceeded even the OLD bull case's ≥$35B threshold by $6.5B. DRAM revenue alone hit a record $31.3B (76% of total).",
  "Q4 FY26 Revenue Guide": "Management's guidance (issued on the June 24 call) for the June–August quarter: $50.0B ±$1.0B — another ~20% sequential jump on top of Q3's already-record print. This guide alone exceeds the OLD bull case's ≥$38B threshold. Reports (actual results) in late September 2026.",
  "Gross Margin (Actual + Guide)": "Q3 FY26 actual non-GAAP gross margin: 84.9%, a company record, beating even the 81% guide. Q4 FY26 is guided to ~86% — margin is still expanding, not just holding. Memory gross margins historically averaged 30–40% in normal cycles; 86% is unprecedented and is the clearest evidence HBM pricing power, not just volume, is driving this cycle.",
  "$100B Strategic Customer Agreements": "16 binding, multi-year take-or-pay contracts signed with major customers, covering ~20% of DRAM and ~1/3 of NAND volume, running 2026–2030 (5-year term), with ceiling prices and floor margins 'well beyond historical peaks.' Backed by $22B in customer commitments (incl. ~$18B cash deposits). This is the single most important new fact this quarter — it's direct, contractual evidence against the pull-forward interpretation: customers are locking in supply and price for FIVE YEARS, not panic-buying into a spot shortage.",
  "HBM4 Competitive Position": "Samsung has already passed NVIDIA and AMD certification for 16-layer HBM4 and started mass production FIRST — ahead of Micron. SK Hynix still leads overall HBM share. Micron's own HBM4 ramp is tracking twice as fast as HBM3E did and has already shipped $1B+ in HBM4 revenue, but the 'Micron wins share on HBM4' bull thread from last quarter now has a real, named competitive challenge, not just a tailwind. Update (mid-Jul 2026): SK Hynix itself missed Q2 profit estimates by ~8% on delayed HBM4 shipments — its OWN execution problem, not a Micron design-win loss — while CXMT's rapid rise (now #4 global DRAM producer, ~$8.5B IPO planned) is a commodity-DRAM story, not an HBM4 one. Neither is the same thing as 'Micron loses a named HBM4 socket,' but both fed a sector-wide selloff (MU/Samsung/SK Hynix all down 20%+ from highs) that this thesis is watching closely without yet treating as resolved either way.",
};
const TAG_HELP = {
  BEAT: "doing better than expected — a good sign.",
  MATCH: "roughly in line with expectations — steady, no surprises.",
  MISS: "falling short of expectations — a worry.",
  WATCH: "not decided yet — keep an eye on it.",
};

const THESIS_ITEMS = [
  { key: "revenueGuide", label: "Revenue landing within quarterly guide",         note: "Two consecutive misses would break this" },
  { key: "marginGuide",  label: "Gross margin holding within guided range",       note: "~85–87% band per the Q4 FY2026 guide" },
  { key: "scaExecution", label: "$100B Strategic Customer Agreements on track",   note: "5-year, binding, take-or-pay — de-risks ~20% DRAM / 1/3 NAND volume" },
  { key: "hbm4Position", label: "HBM4 competitive position holding vs Samsung",   note: "Samsung has the mass-production head start; named design-win losses are the watch item" },
];
const PRICE_ZONES = [
  { label: "BEAR", lo: 550,  hi: 750,  mid: 650,  color: "#f1564b", action: "Exit / reduce if thesis also breaking" },
  { label: "BASE", lo: 1100, hi: 1350, mid: 1225, color: "#e0a83b", action: "Small add OK if thesis intact" },
  { label: "BULL", lo: 1500, hi: 1800, mid: 1650, color: "#3fd07a", action: "Let it ride — don't chase" },
];

// ── Chart geometry / axis ranges (per-stock: depends on price scale) ─────────
const GEOM = {
  priceMin: 50, priceMax: 1900,
  fanGrid: [1600, 1300, 1000, 700, 400, 100],
  fanYears: ["2025", "2026", "2027"],
  trackMin: 40, trackMax: 1850,
  trackGrid: [1800, 1500, 1200, 900, 600, 300],
  kpiMin: 8, kpiMax: 72,
  visLo: 400, visHi: 1900,
  nowZoneLo: 1100, nowZoneHi: 1350,   // = base band; thresholds for the "NOW" dot zone tooltip on THE FUTURE signal panel
};

/* ── TEXT — every company-specific narrative/tooltip the engine renders. ──────
   Values are strings, HTML strings (rendered with dangerouslySetInnerHTML), or
   template functions the engine calls with computed values. If it mentions the
   company, a quarter, a guide number, or an event, it belongs HERE, not in the
   engine — that rule is what makes the engine safely reusable across stocks. */
const TEXT = {
  // header / footer
  priceTipLive: (px, at, asOf) => `Live quote: $${px} (fetched ${at}). The price is real-time, but the scenario bands and EPS are still as of ${asOf} — only the price-derived figures (scenario returns, P/E, band position) update live.`,
  priceTipStatic: (px, asOf, liveEnabled) => `One share of MU costs about $${px} as of ${asOf} — ${liveEnabled ? "live fetch unavailable (offline or blocked), using the saved price" : "static price (live fetch disabled)"}. Q3 FY2026 printed $41.46B revenue (+346% YoY) at 84.9% gross margin, blowing past even the old bull case; Q4 is guided to $50B±$1B at ~86% GM. Next earnings: Q4 FY2026 (~late Sep 2026).`,
  footerDisclaimer: (asOf) => `Illustrative scenario framing built on public consensus & estimates as of ${asOf} — not a prediction and not financial advice. Valuation ruler: cyclical normalized EPS × P/E — using peak-cycle P/E for a memory company is misleading; the bear case uses a lower, non-SCA-covered EPS assumption. Q4 FY2026 results (~late September 2026), alongside initial FY2027 guidance, are the next major catalyst. Memory cycles move fast in both directions — the $100B in 5-year customer contracts is new evidence this one may be structurally different, held loosely until it's proven across more than one quarter.`,

  // fan chart
  fanHistory: "The solid white line is MU's actual share price. The parabolic rise from $101 (May 2025) to $1,059 (pre-Q3-earnings, June 2026) was one of the most dramatic runs for a trillion-dollar company. Then, despite Q3 FY2026 results blowing past even the old bull case ($41.46B vs a $35B+ bull threshold), the stock gave back ground — first ~8% over three weeks to $979, then another ~10% in mid-July inside a broader memory-sector selloff (SK Hynix's own Q2 profit miss, CXMT China-competition headlines) that dragged MU, Samsung, and SK Hynix all down 20%+ from their highs.",
  fanNow: (px) => `MU is at $${px} right now — well below where it traded going INTO the Q3 print ($1,059), even though Q3 actual results ($41.46B revenue, 84.9% GM) blew past every prior scenario band. A mid-July memory-sector selloff (SK Hynix's own Q2 profit miss, CXMT competition headlines) pushed it lower still, with no new MU-specific bad news. Q4 FY2026 (guided to $50B±$1B) reports ~late September 2026. Everything left of this dot is history; everything right is forecast.`,
  fanPastDot: (q, p) => `At the end of ${q}, MU was around $${p}.${q === "Q3 FY26" ? " This is the post-earnings level, after the stock popped ~15% after-hours on the print then gave most of it back over the following three weeks." : ""}`,

  // scenario selector
  segmentedExplain: {
    bear: ["The pessimistic scenario", "Click to see MU if Q4 FY2026 (reports ~Sept) misses the already-issued $50B±$1B guide, or Samsung's HBM4 mass-production lead compounds into real share losses. The $100B in 5-year SCAs floor-protects part of the business now, so this is a narrower drawdown than a classic memory-cycle collapse — a $550–750 range."],
    base: ["The most-likely scenario", "Click for the base view — Q4 lands within the $50B±$1B / ~86% GM guide, FY2027 initial guidance (given alongside Q4) confirms the cycle extending per the $100B SCA visibility, and the market's currently-compressed ~6.4× forward multiple drifts modestly higher. Stock moves toward $1,100–1,350."],
    bull: ["The optimistic scenario", "Click to see the upside — Q4 beats $50B+$1B, FY2027 guidance gets raised, and the market fully re-rates MU toward the multiple Wall Street's own targets already imply (29-analyst consensus $1,316.79; KeyBanc's fresh Jul-14 target $1,750, set mid-selloff). Price reaches $1,500–1,800."],
  },

  // KPI column
  kpiBaseline: (val) => `This is the most recent real number: Micron reported $${val}B in Q3 FY2026 revenue on June 24 — a 24% beat vs the $33.5B guide, +346% YoY. Q4 is already guided to $50B±$1B.`,
  kpiForecast: (label, val) => `In this scenario, quarterly revenue reaches ~$${val}B by ${label}. For context: Micron's entire FY2022 annual revenue was ~$30.8B — a single quarter now guides above that.`,

  // reversion clock
  reversion: {
    header: "REVERSION CLOCK · JUN 2025 MEMORY PANIC",
    timeTip: "In June 2025, MU hit $102 during a tariff/macro panic. This bar shows elapsed days vs. the ~180-day window it took to recover. The bar is maxed — we're more than double past the recovery window. The dislocation is long resolved.",
    priceTip: (trough, baseFloor, now) => `Stock bottomed at $${trough} in June 2025. The base floor (post-Q1 FY2026 recovery zone) was $${baseFloor}. At $${now}, the stock has recovered far beyond the trough-to-base-floor gap — it massively overshot, driven by the AI memory supercycle.`,
    footerHtml: (baseFloor, precedentDays, now) => `The June 2025 dislocation has <span style="color:#3fd07a;font-weight:700">completely resolved</span> — stock at $${now} is well past the ${precedentDays}-day base-reversion window, an unprecedented overshoot (roughly an <span style="color:var(--title);font-weight:700">8–9× return</span> in 13 months, even after giving back ~15% from this update's own starting point in a mid-July memory-sector selloff — SK Hynix's own Q2 miss, CXMT headlines — unrelated to MU's own numbers). Q3 FY2026 already answered "will the cycle extend into FY2027?" with a resounding yes — $41.46B revenue, $100B in 5-year customer contracts. The open question now is whether the <span style="color:#e0a83b;font-weight:700">market's multiple</span> (still a skeptical ~6.5×) catches up to what the SCAs imply. Watch <span style="color:#e0a83b;font-weight:700">Q4 FY26 + initial FY2027 guidance, ~Sep 2026</span>. The new question: is the current price justified by sustainable earnings, or is it cycle-peak pricing? <span style="color:#e0a83b;font-weight:700">Has the thesis actually broken, or is this fear?</span>`,
  },

  // track record
  track: {
    lastDot: (post, nowPx) => `After Q3 FY2026 earnings (June 24, 2026) — a blowout beat ($41.46B vs $33.5B guide) — MU settled around $${post}, actually BELOW the $1,059 it traded at going into the print. The fundamentals landed above the old bull band; the price landed in the base zone. Price sits at $${nowPx} today, further down inside a mid-July memory-sector selloff unrelated to MU's own numbers. Next print (Q4 FY26, ~Sep 2026) is what tells you whether the market's skepticism resolves.`,
    pastDot: (q, post) => `After ${q} earnings, MU actually traded around $${post}. Compare this dot to the colored bars behind it to see if the predicted range was right.`,
    readoutHtml: (hits, n, nowPx) => `Tracked <span style="color:#3fd07a;font-weight:700">base-or-better all ${hits} of ${n} quarters</span>. Q1 FY26 and Q2 FY26 each printed <span style="color:var(--title);font-weight:700">above the bull band on price</span> — the supercycle outran any reasonable forecast. Q3 FY26 broke that pattern: fundamentals ($41.46B revenue, 84.9% GM, $100B in 5-year SCAs) again blew past the old bull case, but price ($979, now $${nowPx}) landed back in the <span style="color:#e0a83b;font-weight:700">base zone</span> and has since drifted lower still on sector-wide fear, not new MU-specific news. Next real test: <span style="color:#e0a83b;font-weight:700">Q4 FY26 + initial FY2027 guidance, ~Sep 2026</span>.`,
    footnote: "⚠ Bands are reconstructed now — not archived in real time. Lower-confidence quarters (Q1/Q2 FY25) are pre-AI-supercycle awareness. The actual magnitude of the revenue ramp exceeded all scenario bands — this is a feature of cyclical companies at turning points, not a modeling error. Micron fiscal year ends August 31.",
  },

  // THE CURRENT tab
  current: {
    statusNarrative: {
      broken: "Multiple signals missed. Thesis is under pressure — review the kill-switch criteria.",
      watch:  "Revenue beat but margin or guide disappointed, or the HBM4 competitive picture deteriorated further. Core thesis tracking — the Q4 FY2026 print (~late Sep) is the next test. Not broken, but watch closely.",
      intact: "All key signals tracking as expected. The $100B SCA de-risking and AI/HBM demand thesis remains intact — Q3 FY2026 beat on every disclosed line, even though the stock itself has pulled back hard on sector-wide (not MU-specific) fear.",
    },
    panelTipStory: "Checks whether the original reasons to own MU are playing out. Counts signals from the Q3 2026 print and Q4 2026 guide — revenue, gross margin, SCA execution, HBM4 competitive position. 0–1 miss = thesis intact. 2 misses = watch. 3+ = exit. Click to see KPI bars and kill-switch.",
    watchChipHtml: `🔑 WATCH: Q4 FY26 rev vs <span style="color:#e0a83b;font-weight:700">$50.0B±$1.0B</span> guide · ~Sep 2026`,
    exitChipHtml: `⚠ EXIT IF: rev/GM miss guide <span style="font-weight:700">2 straight quarters</span>, or a named HBM4 design-win loss to Samsung`,
    verdictBody: {
      broken:     (px) => `MU at $${px}: kill-switch criteria met. Price position is irrelevant — signals say the AI/HBM supercycle thesis is no longer playing out. The question is not whether to add; it is how much to reduce.`,
      watchBelow: (px) => `MU at $${px} sits below the base floor but signals are mixed. Price is attractive, but adding into a weakening thesis is the wrong sequence. Wait for the Q4 FY2026 print (~late Sep) to confirm or deny the pattern before deploying capital.`,
      below:      (px) => `MU at $${px} sits well below the base floor with the thesis intact — Q3 FY2026 revenue, margin, and guide all blew past the old bull case, and the $100B in SCAs is real, binding, 5-year contracted revenue. The market gave back the pre-print rally anyway and then kept selling into a broader memory-sector fear trade (SK Hynix's own Q2 miss, CXMT headlines) with no new MU-specific bad news — the fundamentals say this is sentiment/positioning, not demand destruction.`,
      inBase:     (px, statusWord) => `MU at $${px} is inside the base range. Thesis ${statusWord} and price is fair. Watch Q4 FY2026 revenue and gross margin vs the $50B±$1B / ~86% guide around late Sep — a beat opens the bull case; a miss reopens the bear.`,
      above:      (px) => `MU at $${px} is above the base ceiling. The bull case — a second guide beat plus FY2027 guidance raised above run-rate — needs to play out to justify entry. If already in, hold. If adding, wait for a pullback toward the base floor.`,
    },
    kpiTitle: "Quarterly Revenue",
    kpiSub: "$B quarterly · HIGHER BETTER",
    kpiMeasures: "Total quarterly revenue across DRAM, HBM, and NAND. Q3 FY2026 actual was $41.46B (76% DRAM), already confirming HBM/AI training demand as the dominant driver. Guided $50.0B±$1.0B for Q4 FY2026 — another ~20% sequential step-up on top of Q3's already-record print. Bull case shows continued acceleration toward the SCA-implied run-rate; bear case shows deceleration on the ~70–80% of volume the $100B in contracts doesn't cover.",
    kpiRequires: {
      bull: "Q4 beats $50B+$1B, FY2027 initial guidance (given alongside Q4) gets raised above run-rate, and Micron holds HBM4 share despite Samsung's mass-production head start.",
      base: "Q4 lands within the $50B±$1B guide at ~86% GM; FY2027 initial guidance confirms the cycle extending, consistent with the $100B SCA visibility through 2030.",
      bear: "Q4 misses the $50B±$1B guide, or FY2027 initial guidance signals deceleration on the non-SCA-covered volume; Samsung/CXMT visibly take named HBM4 design wins.",
    },
    group1Title: "Revenue Cycle &amp; Forward Guidance",
    group2Title: "Structural De-risking &amp; Competitive Position",
    killSwitch: "Two straight quarters of revenue or gross margin missing guide, or a named hyperscaler HBM4 design win moving to Samsung/SK Hynix (not just their own shipment-timing headlines) — exit / reduce. That is demand destruction or competitive loss, not noise.",
    priceBanner: {
      below:  (px, baseLo) => `At $${px}, price is $${(baseLo - px).toLocaleString()} below the base floor. Market is pricing in fear and mechanical selling pressure (SK Hynix's own Q2 miss, CXMT headlines, capital rotating into SK Hynix's new Nasdaq ADR) — not a fundamentals problem, given the Q3 beat-and-raise. Historically the window patient buyers use.`,
      inBase: (px) => `At $${px}, price is inside the base range. Fair value — not a discount, not expensive.`,
      above:  (px, baseHi) => `At $${px}, price is $${(px - baseHi).toLocaleString()} above the base ceiling. The bull thesis needs to play out in full.`,
    },
    moodBanner: (currentPE, loPE, hiPE) => `At ${currentPE}× forward P/E, the market is pricing in continued execution but is still discounting mean reversion even after a record-blowout quarter — the multiple sits at the bottom of its normal band (${loPE}–${hiPE}×), effectively a "deep value" read on a company that just printed its best quarter ever. That gap between fundamentals and multiple is exactly what the SCA/HBM4 debate is arguing about.`,
    cagrNotes: {
      low:  "Low bar — not priced for perfection. Even moderate execution justifies the price.",
      mid:  "Moderate bar — requires Q4 FY26 landing within guide and FY2027 initial guidance confirming the cycle extending.",
      high: "High bar — requires near-flawless execution with no HBM4 share loss to Samsung and no SCA slippage.",
    },
    fy26CardTip: (fyRev) => `Adding Q3 FY2026's actual ($41.46B) to the base-case Q4 FY26–Q2 FY27 projections gives a trailing-four-quarter run-rate of roughly $${fyRev}B — a dramatic step up from FY2025's full-year $37.4B, reflecting how sharply the AI/HBM supercycle inflected the business this year. This is not a smooth full-year comparison; it's what the base case (and roughly today's price) already assumes if the next three quarters land in-guide.`,
    fy26CardHtml: (fyRev, growthPct) => `Q3 FY2026's actual plus base-case Q4 FY26–Q2 FY27 projections sum to roughly <span style="color:var(--blue-soft);font-weight:700">$${fyRev}B</span> across the next four quarters — the growth path today's price already assumes. FY2025 full-year actual revenue was <span style="color:#3fd07a">$37.4B</span>, so this implies <em>~${growthPct}%</em> growth versus that base — a measure of how much the supercycle has already changed the scale of the business, not a like-for-like annual comparison.`,
    peerCommentary: (currentPE) => `At ${currentPE}× NTM P/E, MU trades roughly in line with SK Hynix (~6.8×) and Samsung (~6.8×) — the whole memory complex is being priced at a skeptical, cyclical-trough multiple despite record or near-record earnings across the group. Western Digital (~10×) and SanDisk (~26×, up 635% YTD) — the NAND/storage-pure-play names — trade far richer, suggesting the market has already re-rated storage further than it has DRAM/HBM. The $100B in SCAs is Micron's own answer to "is this multiple wrong": five years of contracted, floor-margin-protected revenue that none of these peer multiples are pricing in yet.`,
  },

  // THE FUTURE tab
  future: {
    scenarioTips: {
      bear: "Triggered by: Q4 FY26 revenue/margin guide miss or a named HBM4 design-win loss to Samsung/SK Hynix. Multiple compresses toward the 4–6.5× trough zone. The $100B in SCAs floor-protects part of the business, so this is a narrower drawdown than a classic memory-cycle collapse.",
      base: (loPE, hiPE) => `Q4 FY2026 lands within the $50B±$1B / ~86% GM guide; FY2027 initial guidance confirms the cycle extending per the SCA visibility. P/E drifts modestly higher within the ${loPE}–${hiPE}× band as skepticism fades one quarter at a time.`,
      bull: (currentPE) => `Q4 beats $50B+$1B and FY2027 guidance gets raised above run-rate; Micron holds HBM4 share despite Samsung's head start. Multiple re-rates from ~${currentPE}× toward the bull zone as the market fully prices the $100B SCA de-risking.`,
    },
    downsideChevronTip: "Kill-switch: two straight quarters missing guide, or a named hyperscaler HBM4 design win moving to Samsung/SK Hynix = exit / reduce.",
    dislocEventName: "the Jun 2025 memory-cycle/tariff panic low",
    dislocLabel: "SINCE JUN 2025 MEMORY PANIC",
    bearPriceTip: (bearMid, bearLo, bearHi, peTrough, peBearHi) => `$${bearMid} is the midpoint of the bear case range ($${bearLo}–$${bearHi}). This assumes Q4 FY2026 misses the $50B±$1B guide, or a named hyperscaler HBM4 design win moves to Samsung/SK Hynix, and the multiple compresses toward the ${peTrough}–${peBearHi}× trough zone. The $100B in SCAs floor-protects part of the business, so even the bear case is a narrower drawdown than a classic memory-cycle collapse. The kill-switch is two straight quarters missing guide — if it triggers, do not average down.`,
    killSwitchTip: "A kill-switch is a pre-committed exit rule you set BEFORE you own the position — when you are thinking clearly. If revenue or gross margin misses guide for two straight quarters, or a named hyperscaler HBM4 design win moves to Samsung/SK Hynix (not just their own shipment-timing headlines), the thesis is broken: that's demand weakness or competitive loss, not timing. Do not average down into a broken thesis — the market is telling you something. No debate, no rationalisation. Exit.",
    killSwitchTipNote: "Two straight misses, or a named HBM4 design-win loss. Either one. No debate.",
    killSwitchHtml: `<strong style="color:var(--title)">Two consecutive quarters missing the revenue or gross margin guide, or a named hyperscaler HBM4 design win moving to Samsung/SK Hynix</strong> → exit or reduce. No debate. Do not average down into a broken thesis.`,
    nextCheck: "Next check: Q4 FY2026 earnings (~late Sep 2026)",
    downsideFootnote: (px, peTrough, peBearHi) => `Bear case scenario: Q4 guide miss or a named HBM4 design-win loss. Assumes a multiple compression toward ${peTrough}–${peBearHi}× on the ~70–80% of volume the $100B in SCAs doesn't cover. Position loss is illustrative at $${px} entry.`,
    multipleSummary: (peNow, loPE, hiPE) => `At ~${peNow}× NTM P/E, MU sits near the bottom of its normal range (${loPE}–${hiPE}×) — a historically compressed multiple despite a record-blowout quarter. The market is still discounting mean reversion even after Q3 blew past the old bull case; the $100B in SCAs is the direct evidence the SCA thesis argues this multiple is wrong.`,
    peBarTipSuffix: "This P/E uses a blended NTM EPS estimate — the low end anchored to Q4 FY26 guide annualized, the high end to what the market's own ~6.5× forward multiple implies. Memory-company GAAP EPS swings wildly across the cycle (Micron posted a GAAP net loss as recently as FY2023), so a single trailing P/E is misleading here.",
    deepValueZoneNote: "Historically cheap for a record-earnings quarter. Rare — this is what a market still pricing in mean reversion looks like.",
    dislocPrecedent: (baseFloor) => `Historical precedent: the June 2025 memory-panic dislocation resolved within the 180-day base-reversion window once the fundamentals stayed intact. Base floor: $${baseFloor}.`,
    regretHtml: (currentPE) => `Q4 FY2026 revenue and margin <strong style="color:#3fd07a">materially beat the $50B±$1B / ~86% guide</strong> AND FY2027 initial guidance is raised above the implied run-rate. That would confirm the Q3 FY2026 beat-and-raise was the start of a trend, not a peak, re-rate the stock from ~${currentPE}× toward the bull zone, and close today's entry window.`,
    regretTip: "Charlie Munger's inversion: instead of asking 'why should I buy?', ask 'what would I have to believe happened, in hindsight, to wish I had bought more?' If Q4 FY2026 beats the raised guide and FY2027 guidance confirms the cycle extending, today's entry window will close fast. You will not get a second chance at this multiple if the bull case materialises. This question is not about FOMO — it is about sizing correctly for your conviction.",
    chips: [
      { label: "KILL-SWITCH: 2 STRAIGHT GUIDE MISSES OR NAMED HBM4 LOSS → EXIT", col: "#f1564b" },
      { label: "REGRET IF: Q4 BEATS + FY27 GUIDE RAISED ABOVE RUN-RATE",         col: "#3fd07a" },
      { label: "NEXT CHECK: ~LATE SEP 2026 EARNINGS",                            col: "#2f6dff" },
    ],
    signalFootnote: (ntmEps) => `P/E uses a blended NTM EPS estimate of $${ntmEps} — a judgment blend of Q4 FY26 guide annualized and what the market's own forward multiple implies. Memory-company GAAP EPS is volatile across the cycle (a real GAAP net loss as recently as FY2023), so treat this figure as directional, not precise.`,
  },

  // THE PAST tab
  past: {
    cardTips: {
      durability: (revCagrPct) => `Looks at 10 years of Revenue, Gross Margin, and Free Cash Flow. We want upward trends that hold through cycles — not spike-and-crash. Micron has grown revenue at ~${revCagrPct}% CAGR over FY2016–FY2025, but unlike a steady compounder this is a genuinely cyclical business: gross margin has swung from a GAAP loss (-9.1%, FY2023) to a record 58.9% (FY2018), and that's all BEFORE the FY2026 AI/HBM supercycle that pushed a single quarter's margin to 84.9%.`,
      value: (latestROIC) => `ROIC (Return on Invested Capital) measures how efficiently management deploys capital. Above WACC (~9–11% for a capital-intensive memory maker) = value creation. Below = value destruction. Micron's ROIC has swung from a peak ~30% (FY2018 supercycle) to negative (FY2023 downcycle) — ${latestROIC}% in FY2025 is a recovery, not yet back to peak. This is the clearest evidence memory is a genuinely cyclical business, not a steady compounder.`,
      capex: (peakCapex, latestCapex, latestFCF) => `Capex as a % of revenue shows how much of every dollar gets reinvested before cash reaches shareholders. Memory fabs are extremely capital-hungry — the real test is whether spend converts into earnings once the cycle turns. Capex/revenue peaked at ${peakCapex}% (FY2023, spending through the trough) and sits at ${latestCapex}% in FY2025 even as FCF recovered to $${latestFCF}B — but FY2026's SCA-backed expansion will likely push capex meaningfully higher again.`,
      mood: (evNow, evAvg) => `EV/EBITDA vs its own 10-year average tells you whether the market is paying a premium or discount for this business. Not a buy/sell signal on its own — context matters (growth rate, interest rates, sector rotation, and for a cyclical like Micron, WHERE in the cycle EBITDA currently sits). Current EV/EBITDA of ${evNow}× (a forward-looking estimate, since trailing EBITDA is still catching up to the FY2026 supercycle) sits near the 10Y average of ~${evAvg}× — a genuinely mixed read, unlike a clean "cheap" or "expensive" signal.`,
    },
    stats: [
      { html: `Revenue <span style="color:#3fd07a;font-weight:700">$12.4B → $37.4B</span> (FY16–FY25)`, tipTitle: "Revenue (FY2016–FY2025)", tipBody: "Micron grew annual revenue from $12.40B (FY2016) to $37.38B (FY2025) — a ~13% CAGR, but a genuinely cyclical, not steady, path: it peaked at $30.39B in FY2018, fell to $15.54B in FY2023, then recovered. Q3 FY2026 alone ($41.46B) already exceeds the full FY2025 total — the supercycle inflection this thesis is built around." },
      { html: `FCF <span style="color:#3fd07a;font-weight:700">-$2.2B → $1.7B</span> (FY16–FY25)`, tipTitle: "Free Cash Flow (FY2016–FY2025)", tipBody: "FCF swung from -$2.23B (FY2016 downcycle) to a peak $8.32B (FY2018 supercycle) to -$6.12B (FY2023 downcycle) to $1.67B (FY2025). This volatility is the honest picture of memory economics before the FY2026 AI/HBM inflection — a business that can burn cash for a year or two, not a steady compounder." },
      { html: `Price <span style="color:#3fd07a;font-weight:700">+8,081%</span> (Mar 2016 → now)`, tipTitle: "Total price return (10-year)", tipBody: "From $10.76 (Mar 2016 quarter-end, near the 2016 memory-downcycle trough) to $880 today = +8,081%. Nearly all of that return is concentrated in the last 18 months — the AI/HBM supercycle — after a decade where the stock spent long stretches round-tripping between $10 and $90. Past returns are anchored to a cyclical-upswing timing that may not repeat on the same schedule." },
    ],
    verdictBody: "Micron is a genuinely cyclical business, not a steady compounder — gross margin has ranged from a GAAP loss (FY2023) to a record 58.9% (FY2018) over the last decade, and ROIC has swung from negative to ~30% on the same swings. FY2025's ~13% revenue CAGR, 39.8% gross margin, and 10.4% ROIC represent a mid-cycle recovery, not a peak — the real story is what happened AFTER this data ends: Q3 FY2026's $41.46B quarter and 84.9% gross margin are already multiples of anything in this 10-year window, and the $100B in 5-year Strategic Customer Agreements is the first real evidence this cycle might not fully mean-revert the way FY2018→FY2023 did. The business has earned a cyclical-value multiple historically; whether it has earned a structural re-rating is the entire open question THE FUTURE tab is built around.",
    banners: {
      durability: (revCagrPct, rev0, rev9, gmDelta, latestGM, fcf0, latestFCF) => `Revenue compounded at ~${revCagrPct}% annually from $${rev0}B (FY2016) to $${rev9}B (FY2025) — but through a real cyclical path, not a straight line: FY2018 peaked at $30.39B, FY2023 fell to $15.54B (a GAAP net loss year), then recovered. Gross margin moved ${gmDelta} points net over the decade to ${latestGM}%, swinging through a -9.1% trough (FY2023) and a 58.9% peak (FY2018) along the way. FCF went from $${fcf0}B to $${latestFCF}B, also swinging negative twice (FY2016, FY2023).`,
      value: (latestROIC) => `ROIC of ${latestROIC}% (FY2025) exceeds a typical WACC of 9–11% for a capital-intensive memory maker, meaning capital deployed today is creating value — but this is a recovery number, not a stable one: ROIC hit ~30% at the FY2018 peak and went negative in the FY2023 trough. Unlike a steady compounder, Micron's ROIC tells you where in the memory cycle you are as much as it tells you about capital efficiency.`,
      capex: (latestCapex, peakCapex, latestFCF, fy26Guide) => `Capex/revenue of ${latestCapex}% (FY2025) is off the ${peakCapex}% peak (FY2023, spending through the downcycle trough) as FCF recovered to $${latestFCF}B. Note FY2026's capex intensity will likely run meaningfully higher again — the $100B in SCAs is a direct commitment to expand supply, and a rough estimate for FY2026 full-year capex is ~$${fy26Guide}B (judgment, not yet a single stated full-year guide). A threat (Samsung's HBM4 head start) explains the spend; only results — the SCAs actually converting to revenue at the promised floor margins — justify it.`,
      mood: (evNow, evAvg) => `EV/EBITDA of ${evNow}× (forward-looking estimate) sits near the 10-year average of ${evAvg}× — a genuinely mixed signal for a cyclical stock. The FY2023 data point (40.1×) is a real artifact of near-zero trailing EBITDA at the cycle trough, not a meaningful "expensive" read; excluding that outlier, MU has historically traded in a 2.5–8× range. The open question the market hasn't resolved: does the $100B in SCAs mean this cycle's EBITDA doesn't mean-revert the way FY2018's did, in which case today's multiple is cheap — or is the market right to stay skeptical?`,
    },
    revAnnotationsHtml: `<span>FY2018: <span style="color:var(--tx3)">$30.39B</span> (prior supercycle peak)</span><span>FY2023: <span style="color:var(--tx3)">$15.54B</span> (downcycle trough, GAAP net loss)</span><span>FY2025: <span style="color:var(--tx3)">$37.38B</span> (pre-AI-inflection base)</span>`,
    roicNote: "Green >15% · Amber 5–15% · Red <5% — Micron has touched every band across this cycle, unlike a steady compounder",
    fcfYieldNote: "Negative in FY2016 and FY2023 (cyclical downturns) — this is a genuinely volatile FCF profile, not a smoothly declining yield on a re-rating stock.",
    capexAnnotationsHtml: `<span>FY2018: <span style="color:#f1564b">29.9%</span> (supercycle capex, low relative to revenue)</span><span>FY2023: <span style="color:#f1564b">49.4%</span> (spending through the trough)</span><span>FY2025: <span style="color:#3fd07a">42.4%</span> (elevated, pre-SCA-expansion)</span>`,
    footnotes: {
      durability: "Micron's FY2016–FY2020 figures are sourced from the company's own GAAP earnings-release press tables (8-K exhibits), not a live Wisesheets citation — the free-tier history window only reaches back 5 years (FY2021–FY2025), so pre-2021 figures here are marked lower-confidence per this project's data-freshness convention. FY2018's margin peak (58.9%) and FY2023's trough (-9.1% GAAP) bracket the most recent full memory cycle before the FY2026 AI/HBM inflection — Q3 FY2026's 84.9% margin is already well outside anything in this 10-year window.",
      value: "ROIC here is a NOPAT/Total-Assets proxy (EBIT × (1 − effective tax rate) ÷ total assets), not a full invested-capital calculation — a simplification made necessary by the same 5-year Wisesheets history-window limit noted above. The trend is the point: Micron's capital efficiency swings hard with the cycle (~30% peak, negative trough), which is the central argument for why a memory stock needs scenario bands this wide, and why the $100B SCA's floor margins matter — they're a direct attempt to put a bear-case floor under this specific volatility.",
      capex: "Capex/revenue swung from 25.8% (FY2017, capacity already built) to 49.4% (FY2023, spending straight through the trough — a real test of capital discipline the company mostly passed, since it didn't cut capex to zero even as FCF went negative). The FY2026 capex figure used elsewhere in this file ($28B) is a judgment estimate, not a single stated full-year guide — Micron has not yet given one as of this touch. The kill-switch for this panel: if capex/revenue climbs well above 45% without the SCA-covered revenue showing up on schedule, the AI buildout has stopped paying for itself.",
      mood: "The scenario bands on the other tabs use a blended NTM P/E, not EV/EBITDA — EV/EBITDA is shown here purely to track cross-cycle mood, since it's capital-structure-neutral and less distorted by memory's volatile GAAP EPS. FY2023's 40.1× reading is a real number (EV ÷ near-zero trailing EBITDA at the cycle trough) but is a poor mood signal in isolation — it reflects a temporarily tiny denominator, not investor enthusiasm. The forward-looking evNow figure (8.8×) is a judgment estimate using guided Q4 FY26 economics, since trailing EBITDA hasn't caught up to the supercycle yet.",
    },
    priceChartTitle: "MU PRICE · 10-YEAR (QUARTERLY 2016–2021, MONTHLY 2021–2026)",
    priceChartSub: "$ per share · dashed lines = key events · pre-2021 points are quarterly (web-sourced), 2021+ are monthly (Wisesheets EOD)",
    priceNowTip: (px, isATH) => `$${px} — where MU trades today, ${isATH ? "also the highest point in this 10-year window" : "off the all-time high of $1,154.29 (Jun 2026)"}. The chart shows a decade of real cyclicality — the 2018–2019 memory downcycle, the 2022 rate-hike/chip-glut trough (deepest drawdown, -46.3%), then a sustained AI/HBM-driven re-rating from 2024 on, capped by the FY2026 supercycle spike and a subsequent pullback.`,
    ddTip: (minDD) => `${minDD}% — the deepest drop from a prior all-time high in this window. This occurred in Dec 2022, the rate-hike/chip-cycle trough (severe DRAM/NAND inventory glut, FY2023 GAAP net loss). Micron recovered and went on to make new highs as the AI/HBM cycle took over. Drawdown charts help you visualize what holding through a bad period actually felt like — this is the honest range of outcomes a memory-cycle investor has actually lived through.`,
    ddAnnotationsHtml: `<span>Max drawdown: <span style="color:#f1564b">−46.3%</span> (Dec 2022, chip-cycle trough)</span><span>Current: <span style="color:#e0a83b">−23.8%</span> from ATH (Jun 2026 supercycle peak)</span>`,
  },
};
