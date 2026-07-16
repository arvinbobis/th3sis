/* ╔══════════════════════════════════════════════════════════════════════════╗
   ║   ASML · thesis-data.js — ALL per-stock content lives here.              ║
   ║   ███  EDIT EVERYTHING IN THIS FILE EACH QUARTER  ███                    ║
   ║                                                                          ║
   ║   The rendering engine (../engine/thesis-engine.js) contains ZERO        ║
   ║   company-specific strings — every number, narrative, and tooltip        ║
   ║   that mentions ASML is in this file. Quarterly touch = edit this        ║
   ║   file only, then run: node tools/lint-thesis-data.js asml               ║
   ║                                                                          ║
   ║   NOTE: ASML reports in EUR. Prices here are USD (NASDAQ ADR, 1:1).      ║
   ║   EUR/USD ≈ 1.147 at build date — update this rate when refreshing.      ║
   ║                                                                          ║
   ║   NOTE (2026-07-16): ASML retired quarterly net bookings disclosure     ║
   ║   starting Q1 2026. KPI_HIST/KPI_PROJ and the core SIGNALS row were      ║
   ║   repurposed from bookings to quarterly revenue-vs-guide — see the       ║
   ║   TEXT.current.kpiMeasures / SIGNAL_HELP entries for the full rationale  ║
   ║   before reverting this if bookings disclosure ever resumes.             ║
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

const TICKER_META = { ticker: "ASML", exchange: "NASDAQ", company: "ASML Holding N.V." };
const AS_OF_DATE = "2026-07-16";

// Most recent material dislocation (Aug 2025 China DUV/cyclicality panic)
const DISLOCATION_DATE = "2025-08-01";
const REVERSION_TROUGH = 683;
const REVERSION_BASEFLOOR = 1020;
const REVERSION_PRECEDENT_DAYS = 230;

const CASES = {
  bear: {
    key: "bear", label: "BEAR", accent: "#f1564b", glow: "rgba(241,86,75,0.45)",
    target12: "$1,300 — $1,650",
    op: "Q2 2026 was a genuine beat-and-raise (€9.3B revenue, 54% GM, FY26 guide lifted a second time to €43–45B), so the near-term bear case is no longer 'the cycle turns down' — it's 'this multiple already paid for the beat.' At $1,815, ASML trades near ~50x 2026E EPS ($36.62) and ~37x 2027E EPS ($49.46); if Q3/Q4 merely MATCH the raised guide instead of beating it again, or if 2027 order coverage disappoints once ASML's next real disclosure lands, the stock re-rates toward a more normal 28–34x multiple even with the fundamentals intact. DUV service restrictions from the US or Netherlands remain a live tail risk, eliminating €1.5–2B/year of high-margin China Installed Base Management revenue immediately. High-NA adoption could still stumble if Intel 18A yields disappoint or TSMC delays its own advanced-node timeline.",
    breaks: "FY26 revenue lands at or above the €43–45B guide for two consecutive quarters; China DUV service restrictions do not materialize; High-NA deliveries hit the 4–5 unit guide for the year — any two of these kills the bear.",
    requires01: "China DUV service restriction announced (observable now)",
    requires02: "Q3 revenue misses the €11.0–12.0B guide, or FY26 guide gets walked back",
  },
  base: {
    key: "base", label: "BASE", accent: "#e0a83b", glow: "rgba(224,168,59,0.40)",
    target12: "$1,900 — $2,300",
    op: "ASML keeps executing on its twice-raised 2026 guidance — FY26 revenue lands in the €43–45B range (H1 already delivered €18.1B), Q3 hits the €11–12B guide, and High-NA reaches its 4–5 unit full-year target with Intel's 18A now a live production customer. China holds near ~20% of 2026 sales with no service ban. Gross margin holds in the 54–56% guided band. At $1,815 (~50x 2026E EPS, ~37x 2027E EPS of $49.46), the market has already re-rated for the beat — base fair value tracks the analyst-target cluster ($2,100–$2,300 from JPMorgan/Wells Fargo/BofA) rather than a fresh multiple expansion.",
    breaks: "Either FY26 revenue decelerates back toward the original €36–40B range (bear lane), or 2027 order coverage/High-NA ramp accelerates enough to pull forward the bull case's multiple.",
    requires01: "China DUV service restriction stays off the table (observable now)",
    requires02: "Q3 revenue €11.0–12.0B + FY26 guide holds at €43–45B",
  },
  bull: {
    key: "bull", label: "BULL", accent: "#3fd07a", glow: "rgba(63,208,122,0.45)",
    target12: "$2,400 — $2,800",
    op: "The AI semiconductor supercycle proves structurally durable enough that ASML raises FY26 guidance a THIRD time and gives an explicit 2027 revenue framework confirming the 'close to fully covered' order commentary from the Q2 call. High-NA adoption accelerates past the 4–5 unit 2026 guide, EUV capacity additions (the flagged +30% for 2027, another +30% under evaluation for 2028) sell through immediately, and Taiwan's share of ASML sales (already 30%, up from 23%) keeps climbing as TSMC's own capex guide ($60–64B, per its Q2 2026 print) compounds. 2027 EPS comes in at or above the $49.46 consensus and the market awards a 48–55x multiple on the compound-monopoly thesis — the top of the current analyst price-target range (Bernstein $2,623, BofA $2,345).",
    breaks: "FY26 guidance gets walked back from €43–45B, or a confirmed China DUV service ban eliminating €1.5B+ of annual IBM revenue. A 15%+ capex reduction announcement from TSMC, Samsung, or SK Hynix would also fundamentally alter the demand outlook.",
    requires01: "TSMC publicly extends its capex/High-NA commitments (observable now — TSMC's own Q2 2026 capex guide of $60–64B is corroborating evidence)",
    requires02: "FY26 revenue prints above €45B or 2027 guidance framework beats the implied ~15–18% growth path",
  },
};

// THESIS_HISTORY — append-only archive of the full CASES set as it stood at each
// touch, captured BEFORE that touch's Layer-2 audit rewrites it. First entry seeded
// here at migration time (2026-07-16), reconstructed from ASML's pre-migration legacy
// build's Layer-2 audit the SAME day (Q2 2026 beat-and-raise + bookings-disclosure
// retirement) — this is the vintage the migration is carrying forward, not a fresh
// rewrite. NEVER edit a past entry after the fact — same discipline as TRACK_ALL and
// the inputs-YYYY-QQ.json provenance snapshots.
const THESIS_HISTORY = [
  { asOf: "2026-05-29", quarter: "Q1 2026", cases: {
    bear: { target12: "$820 — $1,100", op: "Operational state: the semiconductor capex cycle turns down faster than expected — AI demand disappoints or the current fab buildout creates 2–3 years of overcapacity, pulling bookings back toward €5–6B/quarter (the 2024 norm). DUV service restrictions are implemented by the US or Netherlands, eliminating €1.5–2B/year of high-margin China Installed Base Management revenue immediately. High-NA adoption stumbles as Intel 18A yields stay challenging and TSMC delays A14 further, limiting High-NA to a niche product through 2027. 2026 revenue comes in at the low end of guidance (€34B), and the market re-rates toward historical trough multiples.", breaks: "Bookings stay above €8B for two consecutive quarters; China DUV service restrictions do not materialize; Intel demonstrates successful 14A yield improvement and TSMC reverses its High-NA delay — any two of these kills the bear.", requires01: "China DUV service restriction announced (observable now)", requires02: "bookings fall below €6B + Q2 revenue misses guide" },
    base: { target12: "$1,400 — $1,850", op: "Operational state: ASML executes on its 2026 guidance — revenue reaches €37–40B, bookings average €8–10B/quarter (normalizing from the Q4 2025 record but remaining healthy), and High-NA starts contributing with 8–12 deliveries across Intel and Samsung. China stabilizes at ~15–18% of system revenue as DUV restrictions hold at current levels with no service ban. Gross margins hold at 52–54%. At 44x 2026E EPS of $36, current price (~$1,587) is roughly base fair value — the backlog provides visibility, the story is priced but not stretched.", breaks: "Either bookings decelerate below €5B for two consecutive quarters (bear lane), or bookings exceed €10B + High-NA ramps faster than expected + TSMC reverses its delay (bull lane).", requires01: "China DUV service restriction stays off the table (observable now)", requires02: "Q2 revenue €8.4–9.5B + bookings €7–10B" },
    bull: { target12: "$1,900 — $2,500", op: "Operational state: the AI semiconductor supercycle proves structurally durable — TSMC, Samsung, and SK Hynix all accelerate spending through 2028, keeping bookings above €10B/quarter. High-NA adoption accelerates: Intel 14A success pulls TSMC forward, and Samsung's sub-2nm requirements demand High-NA for yield improvement, creating a new €5B+ annual revenue stream by 2027. Installed Base Management grows toward €12B/year as the installed base crosses 650 tools and upgrade intensity increases. 2027 EPS comes in at €47+ and the market awards 48–55x on the compound monopoly thesis.", breaks: "Any two consecutive quarters of bookings below €6B, or a confirmed China DUV service ban eliminating €1.5B+ of annual IBM revenue. A 15%+ capex reduction announcement from TSMC, Samsung, or SK Hynix would also fundamentally alter the demand outlook.", requires01: "TSMC publicly accelerates High-NA timeline (observable now)", requires02: "bookings exceed €10B + gross margin guides above 55%" },
  } },
];

const FALLBACK_PRICE = 1815.27;

const LIVE_PRICE = {
  enabled: true,
  symbol: "ASML",
  provider: "yahoo",
  corsProxy: "https://api.allorigins.win/get?url=",
  finnhubToken: "",
};

// ALERT — buy-trigger pre-commitment. Canonical source is PF_ALERTS.ASML in
// stocks/portfolio/portfolio-data.js; this copy is a FALLBACK for offline opens.
const ALERT = {
  symbol: "ASML",
  buyFloor: 1900,
  thesisIntact: true,
  asOf: AS_OF_DATE,
  nextEarnings: "2026-10-14",
};

const HISTORY = [
  { q: "Q2 25", p: 750  },
  { q: "Q3 25", p: 880  },
  { q: "Q4 25", p: 1020 },
  { q: "Q1 26", p: 1310 },
  { q: "Q2 26", p: 1989 },
  { q: "NOW",   p: FALLBACK_PRICE },
];

const PROJ_END = { bear: 1500, base: 2100, bull: 2600 };
const FUTURE_Q = ["Q3 26", "Q4 26", "Q1 27", "Q2 27"];

const SIGNALS = {
  bear: [
    { name: "Q3 Revenue vs. €11.0–12.0B Guide",  unit: "€B",    tag: "MISS",  next: "Oct 2026",   val: "BEAR <€11.0B",        guide: "GUIDE €11.0–12.0B", pos: 0.15 },
    { name: "FY26 Revenue vs. €43–45B Guide",     unit: "€B",    tag: "MISS",  next: "Ongoing",    val: "BEAR guide walked back", guide: "Q2: raised to €43–45B", pos: 0.18 },
    { name: "China Revenue % / DUV Risk",         unit: "EVENT", tag: "MISS",  next: "Ongoing",    val: "BEAR service ban",   guide: "Q2: ~20% FY sales", pos: 0.20 },
  ],
  base: [
    { name: "Q3 Revenue vs. €11.0–12.0B Guide",  unit: "€B",    tag: "MATCH", next: "Oct 2026",   val: "BASE €11.0–12.0B",   guide: "GUIDE €11.0–12.0B", pos: 0.55 },
    { name: "FY26 Revenue vs. €43–45B Guide",     unit: "€B",    tag: "MATCH", next: "Ongoing",    val: "BASE holds €43–45B", guide: "Q2: raised to €43–45B", pos: 0.55 },
    { name: "China Revenue % / DUV Risk",         unit: "EVENT", tag: "WATCH", next: "Ongoing",    val: "BASE stable ~20%",   guide: "Q2: ~20% FY sales", pos: 0.52 },
  ],
  bull: [
    { name: "Q3 Revenue vs. €11.0–12.0B Guide",  unit: "€B",    tag: "BEAT",  next: "Oct 2026",   val: "BULL >€12.0B",       guide: "GUIDE €11.0–12.0B", pos: 0.88 },
    { name: "FY26 Revenue vs. €43–45B Guide",     unit: "€B",    tag: "BEAT",  next: "Ongoing",    val: "BULL >€45B",         guide: "Q2: raised to €43–45B", pos: 0.85 },
    { name: "China Revenue % / DUV Risk",         unit: "EVENT", tag: "WATCH", next: "Ongoing",    val: "BULL no escalation", guide: "Q2: ~20% FY sales", pos: 0.62 },
  ],
};
const MARGIN = {
  bear: [
    { name: "Gross Margin %",             tag: "MISS",  next: "Oct 2026", pos: 0.20 },
    { name: "High-NA EUV Unit Deliveries",tag: "MISS",  next: "Oct 2026", pos: 0.16 },
  ],
  base: [
    { name: "Gross Margin %",             tag: "MATCH", next: "Oct 2026", pos: 0.58 },
    { name: "High-NA EUV Unit Deliveries",tag: "MATCH", next: "Oct 2026", pos: 0.55 },
  ],
  bull: [
    { name: "Gross Margin %",             tag: "BEAT",  next: "Oct 2026", pos: 0.85 },
    { name: "High-NA EUV Unit Deliveries",tag: "BEAT",  next: "Oct 2026", pos: 0.86 },
  ],
};

// Quarterly revenue €B: Q2 2026 actual, then 4-quarter projections per case.
// Repurposed from net bookings 2026-07-16 — ASML retired quarterly bookings disclosure
// starting Q1 2026 (management: large single orders arrive unevenly and distort the
// trend), so revenue-vs-guide is now the cleanest disclosed forward signal.
const KPI_HIST = 9.3;  // Q2 2026 actual net sales (€B) — SEC 6-K, 2026-07-15
const KPI_PROJ = {
  bear: [10.5, 11.5, 9.5, 10.0],
  base: [11.5, 14.4, 11.0, 12.5],
  bull: [12.0, 15.5, 13.0, 14.5],
};

// TRACK RECORD — append newest to end; dashboard keeps last TRACK_WINDOW.
const TRACK_ALL = [
  { q: "Q4 2024", date: "2025-01", post: 770,  reaction: "+",  bear: [560,680],  base: [720,880],   bull: [940,1180],  landed: "base",      conf: "med"  },
  { q: "Q1 2025", date: "2025-04", post: 800,  reaction: "+",  bear: [570,700],  base: [745,900],   bull: [960,1220],  landed: "base",      conf: "med"  },
  { q: "Q2 2025", date: "2025-07", post: 710,  reaction: "-",  bear: [540,680],  base: [710,870],   bull: [935,1185],  landed: "bear→base", conf: "high" },
  { q: "Q3 2025", date: "2025-10", post: 875,  reaction: "++", bear: [580,720],  base: [760,940],   bull: [990,1275],  landed: "base",      conf: "high" },
  { q: "Q4 2025", date: "2026-01", post: 1050, reaction: "++", bear: [620,790],  base: [850,1060],  bull: [1110,1420], landed: "bull",      conf: "high" },
  { q: "Q1 2026", date: "2026-04", post: 1587, reaction: "+",  bear: [820,1000], base: [1100,1450], bull: [1540,1940], landed: "base→bull", conf: "high" },
  { q: "Q2 2026", date: "2026-07", post: 1815, reaction: "++", bear: [820,1100], base: [1400,1850], bull: [1900,2500], landed: "base",      conf: "high" },
];
const TRACK_WINDOW = 6;

// THE PAST — annual history (Wisesheets 2021-2025 SEC-sourced; 2016-2020 estimated
// from public/secondary sources — Wisesheets free tier caps annual history at 5 years
// for a company this size. Revenue/GM/FCF figures converted EUR→USD at annual-average
// EUR/USD rates; ratios like capex/revenue are currency-agnostic. Treat 2016-2020 as
// directional, not audited — see notes below and in data/inputs-2026-Q3.json.)
const PAST_YEARS       = ["2016","2017","2018","2019","2020","2021","2022","2023","2024","2025"];
const PAST_REV         = [7.6,   10.1,  12.9,  13.2,  16.0,  22.0,  22.3,  29.8,  30.6,  35.9];
const PAST_GM          = [45.7,  44.9,  46.0,  44.7,  48.6,  52.7,  49.7,  50.0,  50.5,  51.8];
const PAST_FCF         = [1.5,   1.7,   2.9,   2.7,   4.1,   11.8,  7.6,   3.6,   9.8,   12.2];
const PAST_ROIC        = [18,    19,    22,    20,    21,    24,    22,    18,    24,    30];
const PAST_EVEBITDA    = [20,    22,    17,    19,    38.6,  43.4,  30.4,  28.6,  27,    26];
const PAST_FCF_YIELD   = [3.8,   3.7,   5.2,   3.2,   2.4,   3.3,   3.1,   1.2,   3.1,   3.4];
const PAST_CAPEX_REV   = [5.0,   5.0,   6.0,   6.0,   6.9,   4.8,   6.1,   7.8,   7.3,   4.8];
const PRICE_M_LABELS = ["2016-07","2016-08","2016-09","2016-10","2016-11","2016-12","2017-01","2017-02","2017-03","2017-04","2017-05","2017-06","2017-07","2017-08","2017-09","2017-10","2017-11","2017-12","2018-01","2018-02","2018-03","2018-04","2018-05","2018-06","2018-07","2018-08","2018-09","2018-10","2018-11","2018-12","2019-01","2019-02","2019-03","2019-04","2019-05","2019-06","2019-07","2019-08","2019-09","2019-10","2019-11","2019-12","2020-01","2020-02","2020-03","2020-04","2020-05","2020-06","2020-07","2020-08","2020-09","2020-10","2020-11","2020-12","2021-01","2021-02","2021-03","2021-04","2021-05","2021-06","2021-07","2021-08","2021-09","2021-10","2021-11","2021-12","2022-01","2022-02","2022-03","2022-04","2022-05","2022-06","2022-07","2022-08","2022-09","2022-10","2022-11","2022-12","2023-01","2023-02","2023-03","2023-04","2023-05","2023-06","2023-07","2023-08","2023-09","2023-10","2023-11","2023-12","2024-01","2024-02","2024-03","2024-04","2024-05","2024-06","2024-07","2024-08","2024-09","2024-10","2024-11","2024-12","2025-01","2025-02","2025-03","2025-04","2025-05","2025-06","2025-07","2025-08","2025-09","2025-10","2025-11","2025-12","2026-01","2026-02","2026-03","2026-04","2026-05","2026-06"];
const PRICE_M = [88,89.8,91.6,93.4,95.2,97,103.3,109.7,116,122.3,128.7,135,142.2,149.3,156.5,163.7,170.8,178,177,176,175,174,173,172,169.7,167.3,165,162,158.9,155.9,166.6,177.3,187.9,198.6,209.3,220,232.5,245,257.6,270.1,282.6,295.1,280,260,200,280,300,320,336.7,353.3,370,405.1,440.3,475.4,516.9,558.5,600,626.7,653.3,680,730,780,830,805.6,781.3,756.9,677.2,666.51,667.93,563.77,576.29,475.88,574.44,489.94,415.35,472.42,608.12,546.4,660.84,617.73,680.71,636.86,722.93,724.75,716.41,660.53,588.66,598.81,683.76,756.92,869.82,951.68,970.47,872.47,960.35,1022.73,936.7,903.87,833.25,672.55,686.61,693.08,739.31,709.08,662.63,668.08,736.77,801.39,694.71,742.62,968.09,1059.23,1060,1069.86,1423,1450.56,1320.83,1438.99,1612.76,1989.44];
const PRICE_M_DD = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-0.6,-1.1,-1.7,-2.2,-2.8,-3.4,-4.7,-6,-7.3,-9,-10.7,-12.4,-6.4,-0.4,0,0,0,0,0,0,0,0,0,0,-5.1,-11.9,-32.2,-5.1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-2.9,-5.9,-8.8,-18.4,-19.7,-19.5,-32.1,-30.6,-42.7,-30.8,-41,-50,-43.1,-26.7,-34.2,-20.4,-25.6,-18,-23.3,-12.9,-12.7,-13.7,-20.4,-29.1,-27.9,-17.6,-8.8,0,0,0,-10.1,-1,0,-8.4,-11.6,-18.5,-34.2,-32.9,-32.2,-27.7,-30.7,-35.2,-34.7,-28,-21.6,-32.1,-27.4,-5.3,0,0,0,0,0,-8.9,-0.8,0,0];
const PAST_EVENTS = [
  { idx: 29,  label: "Chip Downturn",       note: "Dec 2018 — smartphone/semiconductor inventory correction hit ASML's DUV/immersion order book alongside the broader chip cycle. A cyclical air-pocket, not a structural break — revenue resumed growing within a year." },
  { idx: 44,  label: "COVID Crash",         note: "Mar 2020 — broad COVID selloff dragged ASML down with the market despite its own fundamentals staying intact. Remote-work/cloud demand pulled forward semiconductor orders, and the stock made new highs within a year." },
  { idx: 74,  label: "Chip Cycle Trough",   note: "Sep–Oct 2022 — peak Fed rate-hiking cycle plus a broad semiconductor inventory correction (memory and non-AI logic glut) hit equipment orders. Deepest drawdown in this 10-year window (−50% from the prior high)." },
  { idx: 89,  label: "AI/HBM Re-rate Begins", note: "Dec 2023 — the AI accelerator buildout (HBM, advanced packaging, EUV intensity per wafer) started showing up directly in ASML's bookings and multiple, the beginning of the current re-rating cycle." },
  { idx: 108, label: "China/Tariff Panic",  note: "Aug 2025 — China DUV export-restriction fears plus a broader tariff-driven selloff pushed the ADR to a 52-week/multi-year low near $683 (Aug 1, 2025 intraday). Recovered within the 230-day precedent window as the Q4 2025 bookings record hit." },
  { idx: 119, label: "ATH Run",             note: "Jun 2026 — stock at a fresh all-time high heading into Q2 2026 earnings (Jul 16). The twice-raised FY26 guide and retired bookings disclosure are the open questions from here." },
];

const VAL_CONFIG = {
  ntm_eps:              42.00,
  shares_b:              0.386,
  fcf_ntm_b:            12.5,
  risk_free_pct:         4.35,
  default_discount_pct:  10.0,
  default_terminal_pe:   32,
  dcf_years:              5,
  capex_fy26_guide_b:    2.0,      // ASML's OWN capex (R&D/cleanroom buildout) — much smaller scale than customer fabs; recent run-rate ~€1.6-2.0B
  prior_fy_rev_b:       35.93,     // last full fiscal year actual revenue (USD-converted)
  prior_fy_label:       "2025",
  pe_trough: 18, pe_bear_hi: 26, pe_normal_lo: 30, pe_normal_hi: 40, pe_bull_lo: 44, pe_peak: 54,
  peers: [
    { t: "ASML", fpe: 49.6, ev_eb: 26.0, fcf_y: 2.4, note: "EUV lithography monopoly (re-rated sharply post Q2 2026 beat-and-raise)" },
    { t: "TSM",  fpe: 21.7, ev_eb: 14.1, fcf_y: 2.7, note: "Leading-edge foundry monopoly" },
    { t: "AMAT", fpe: 27.0, ev_eb: 20.0, fcf_y: 3.8, note: "Deposition/etch — relative value play in WFE peer set" },
    { t: "NVDA", fpe: 37.2, ev_eb: 36.8, fcf_y: 1.8, note: "GPU monopoly" },
  ],
};

const SIGNAL_HELP = {
  "Q3 Revenue vs. €11.0–12.0B Guide": "ASML guided Q3 2026 revenue at €11.0–12.0 billion. This checks whether they hit that target. Revenue is 'lumpy' because each machine costs €150M–€380M and ships individually — one machine early or late can shift the quarterly number by that amount. A miss here is notable; two consecutive misses against guidance is a warning sign.",
  "FY26 Revenue vs. €43–45B Guide": "ASML stopped disclosing quarterly net bookings starting Q1 2026 (management said single large orders arrive unevenly and can distort the trend) — so the cleanest forward signal left is whether the full-year revenue guide keeps getting hit, and whether it keeps getting raised. €43–45B is already the SECOND upward revision this year (from an original ~€30–35B range). H1 2026 delivered €18.1B (€8.8B + €9.3B); H2 needs roughly €25–27B, back-loaded toward a typically strong Q4.",
  "China Revenue % / DUV Risk": "China was historically ~30% of ASML's revenue, mostly from DUV (older lithography machines). Export restrictions have cut that to ~20% of total 2026 sales (management's own full-year framing, Q2 2026 call). The key risk now: if the US or Netherlands also bans ASML from servicing and maintaining existing DUV machines already in China, ASML would lose €1–2B of high-margin recurring revenue immediately. The distinction between 'no new sales' and 'no service either' is the policy line being watched.",
  "Gross Margin %": "Out of every euro of ASML's revenue, how much is left after the cost of building the machines. At 54% in Q2 2026 (guided 55–57% for Q3), it's remarkably high for industrial equipment — reflecting ASML's monopoly pricing power (no competitor can even try to build EUV). Gross margin fluctuates by product mix: High-NA EUV (€380M+/machine) carries higher margin; servicing existing machines also runs above average. ASML guides 54–56% for full-year 2026 as mix shifts toward High-NA.",
  "High-NA EUV Unit Deliveries": "High-NA EUV ('EXE:5200') is ASML's most advanced lithography tool — required for chips below 2nm, and priced at €380M+ each (nearly 2× a standard EUV machine). ASML is the ONLY company in the world that makes these. One shipped in Q2 2026; guidance is 4–5 for the full 2026 year, including Intel's first production use on its 18A process. Tracking how many ship per quarter tells you whether this highest-margin product line is ramping — it will be ASML's next major earnings driver.",
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
  { key: "highNaRamp",       label: "High-NA EUV ramp on schedule",              note: "4–5 units full-year 2026 target" },
  { key: "chinaDuvRisk",     label: "No new China DUV service restriction",      note: "The single biggest kill-switch tail risk" },
];
const PRICE_ZONES = [
  { label: "BEAR",    lo: 1300, hi: 1650, mid: 1475, color: "#f1564b", action: "Exit / reduce if thesis also breaking" },
  { label: "BASE",    lo: 1900, hi: 2300, mid: 2100, color: "#e0a83b", action: "Small add OK if thesis intact" },
  { label: "BULL",    lo: 2400, hi: 2800, mid: 2600, color: "#3fd07a", action: "Let it ride — don't chase" },
];

// ── Chart geometry / axis ranges (per-stock: depends on price scale) ─────────
const GEOM = {
  priceMin: 550, priceMax: 2900,
  fanGrid: [2800, 2400, 2000, 1600, 1200, 800],
  fanYears: ["2025", "2026", "2027"],
  trackMin: 460, trackMax: 2020,
  trackGrid: [1800, 1400, 1000, 600],
  kpiMin: 5, kpiMax: 17,
  visLo: 700, visHi: 2900,
  nowZoneLo: 1900, nowZoneHi: 2300,
};

/* ── TEXT — every company-specific narrative/tooltip the engine renders. ──────
   Values are strings, HTML strings (rendered with dangerouslySetInnerHTML), or
   template functions the engine calls with computed values. If it mentions the
   company, a quarter, a guide number, or an event, it belongs HERE, not in the
   engine — that rule is what makes the engine safely reusable across stocks. */
const TEXT = {
  // header / footer
  priceTipLive: (px, at, asOf) => `Live quote: $${px} (fetched ${at}). The price is real-time, but the scenario bands and EPS are still as of ${asOf} — only the price-derived figures (scenario returns, P/E, band position) update live. Each ADR = 1 Amsterdam ordinary share.`,
  priceTipStatic: (px, asOf, liveEnabled) => `$${px} as of ${asOf} — ${liveEnabled ? "live fetch unavailable (offline or blocked), using the saved price" : "static price (live fetch disabled)"}. Each ADR = 1 Amsterdam ordinary share. Next earnings: Q3 2026 (~Oct 14, 2026).`,
  footerDisclaimer: (asOf) => `Illustrative scenario framing built on public consensus & estimates as of ${asOf} — not a prediction and not financial advice. All USD prices; ASML reports in EUR (EUR/USD ≈ 1.147 at build). Price ranges are scenario mid-bands; KPI markers are positional, not literal. Valuation ruler: forward P/E on EUR/USD-converted EPS (~50x 2026E, ~37x 2027E). Data inputs will move with every print. Next earnings: Q3 2026 (~Oct 14, 2026).`,

  // fan chart
  fanHistory: "The solid white line is ASML's actual ADR price since Q2 2025. The run from the Aug 2025 China/tariff-panic trough (~$683) to a $1,989 pre-print high (Jun 30, 2026) was driven almost entirely by the AI/HPC accelerator ramp overpowering DUV export-control and cyclicality fear — then gave some back into and after the Q2 2026 print despite a genuine beat-and-raise.",
  fanNow: (px) => `ASML (ADR) trades around $${px} right now — down from a $1,989 pre-print high despite Q2 2026 beating on every disclosed line: €9.3B revenue, 54.0% gross margin, FY26 guide raised a SECOND time to €43–45B. Management guided Q3 to €11.0–12.0B revenue / 65.0–67.0% margin. Everything left of this dot is history; everything right is forecast.`,
  fanPastDot: (q, p) => `At the end of ${q}, ASML (ADR) was around $${p}.`,

  // scenario selector
  segmentedExplain: {
    bear: ["The pessimistic scenario", "Click to see what ASML looks like if the Q2 2026 beat-and-raise was the peak — FY26 revenue guide gets walked back from €43-45B, China DUV service restrictions land, or the ~50x multiple simply compresses toward historical norms even with fundamentals intact. Stock falls to the $1,300-1,650 range."],
    base: ["The most-likely scenario", "Click for the steady-execution view — the twice-raised 2026 guidance holds (€43-45B revenue), Q3/Q4 land in-guide, and High-NA hits its 4-5 unit 2026 target. At ~50x 2026E EPS, current price ($1,815) already reflects the beat — base fair value tracks the analyst-target cluster. Price drifts toward $1,900-2,300."],
    bull: ["The optimistic scenario", "Click to see the upside — FY26 revenue prints above €45B, a third guide raise lands, and TSMC/Samsung/SK Hynix keep extending capex as the supercycle continues. Stock could run to $2,400-2,800 as the market prices the compound monopoly thesis at the top of the current analyst target range."],
  },

  // KPI column
  kpiBaseline: (val) => `This is ASML's actual Q2 2026 net sales: €${val}B, a real beat against the prior €8.4–9.0B guide. Quarterly bookings disclosure was retired starting Q1 2026, so revenue-vs-guide is now the baseline instead. The bars to the right are scenario forecasts.`,
  kpiForecast: (label, val) => `In this scenario, ASML's quarterly revenue is projected at €${val}B by ${label}, checked against ASML's own guidance range for that quarter.`,

  // reversion clock
  reversion: {
    header: "REVERSION CLOCK · AUGUST 2025 CHINA/CYCLE DISLOCATION",
    timeTip: "In August 2025, China DUV export-restriction fears and a broader market selloff drove ASML to a 52-week low near $683 (Aug 1, 2025). This bar shows how far along we are in the recovery cycle vs. the time it took to reclaim the base floor.",
    priceTip: (trough, baseFloor, now) => `Stock bottomed near $${trough} after the August 2025 China/cyclicality selloff and needed to reach $${baseFloor} to re-enter base territory. At $${now} it has shot well past the base floor — the Q4 2025 bookings record and the Q2 2026 beat-and-raise overpowered the fear.`,
    footerHtml: (baseFloor, precedentDays, now) => `The August 2025 dislocation was a policy/sentiment shock, not a business miss — fundamentals stayed intact through it. Price reclaimed the $${baseFloor} base floor well within the ${precedentDays}-day precedent window and has continued to new all-time highs at $${now} on the AI/HPC ramp. ASML retired quarterly bookings disclosure this year, so the next dislocation risk (a new export-control action, or the FY26 guide getting walked back) won't show up in a bookings number the way this one eventually reversed — <span style="color:#e0a83b;font-weight:700">has the thesis actually broken, or is this fear?</span>`,
  },

  // track record
  track: {
    lastDot: (post, nowPx) => `After Q2 2026 earnings (Jul 16), ASML (ADR) traded around $${post} — landing inside the base band even though revenue, margin, and guide all beat, because the stock had already pulled back hard from its $1,989 pre-print high. Price sits at $${nowPx} today. Next dot: Q3 2026 earnings (~Oct 14, 2026).`,
    pastDot: (q, post) => `After ${q} earnings, ASML (ADR) actually traded around $${post}. Compare this dot to the colored bars behind it to see if the predicted range was right.`,
    readoutHtml: (hits, n, nowPx) => `Price has tracked <span style="color:#3fd07a;font-weight:700">base-or-better in ${hits} of ${n} quarters</span> since Q4 2024. Q2 2026 beat on every disclosed line (€9.3B revenue, 54.0% GM, FY26 guide raised a SECOND time to €43–45B) — yet the stock landed just inside the base band at $${nowPx}, a real "sell the news" pullback from a $1,989 pre-print high, not a business miss. Next directional catalyst: <span style="color:#e0a83b;font-weight:700">Q3 2026 earnings (~Oct 14, 2026)</span> — revenue and gross margin vs. the newly-raised €11.0–12.0B / 65.0–67.0% guide.`,
    footnote: "⚠ Bands are reconstructed now, anchored to each date's forward EPS & multiple regime — not archived in real time. Treat levels as directional, especially \"lower-conf\" quarters. ASML reports in EUR; all prices here are NASDAQ ADR (USD, 1:1 ratio). EUR/USD used ≈ 1.147 at build date — update when refreshing. Revenue is lumpy (large individual machine shipments) — single-quarter moves can be misleading.",
  },

  // THE CURRENT tab
  current: {
    statusNarrative: {
      broken: "Multiple signals missed. Thesis is under pressure — review the kill-switch criteria.",
      watch:  "Revenue beat but margin or guide disappointed, or China DUV risk ticked up. Core thesis tracking — the Q3 2026 print (~Oct 14) is the next test. Not broken, but watch closely.",
      intact: "All key signals tracking as expected. Q2 2026 beat on every disclosed line, even though the stock itself pulled back.",
    },
    panelTipStory: "Checks whether the original reasons to own ASML are playing out. Counts signals from the Q2 2026 print and Q3 2026 guide — revenue, gross margin, China DUV risk, High-NA ramp. 0–1 miss = thesis intact. 2 misses = watch. 3+ = exit. Click to see KPI bars and kill-switch.",
    watchChipHtml: `🔑 WATCH: Q3 2026 rev vs <span style="color:#e0a83b;font-weight:700">€11.0–12.0B</span> guide · ~Oct 14, 2026`,
    exitChipHtml: `⚠ EXIT IF: rev/GM miss guide <span style="font-weight:700">2 straight quarters</span>, or China DUV service ban lands`,
    verdictBody: {
      broken:     (px) => `ASML at $${px}: kill-switch criteria met. Price position is irrelevant — signals say the thesis is no longer playing out. The question is not whether to add; it is how much to reduce.`,
      watchBelow: (px) => `ASML at $${px} sits below the base floor but signals are mixed. Price is attractive, but adding into a weakening thesis is the wrong sequence. Wait for the Q3 2026 print (~Oct 14) to confirm or deny the pattern before deploying capital.`,
      below:      (px) => `ASML at $${px} sits below the base floor with the thesis intact — Q2 2026 revenue, margin, and guide all beat, and High-NA crossed into real production. The market gave back the pre-print rally anyway ("sell the news" on already-elevated expectations); the fundamentals say it's sentiment/positioning, not demand destruction.`,
      inBase:     (px, statusWord) => `ASML at $${px} is inside the base range. Thesis ${statusWord} and price is fair — actually cheaper on a forward-P/E basis than right before the Q2 print, since the EPS estimate rose alongside a price pullback. Watch Q3 2026 revenue and gross margin vs the raised guide around Oct 14 — a beat opens the bull case; a miss reopens the bear.`,
      above:      (px) => `ASML at $${px} is above the base ceiling. The bull case — a third guide raise — needs to play out to justify entry. If already in, hold. If adding, wait for a pullback toward the base floor.`,
    },
    kpiTitle: "Quarterly Revenue vs. Guide",
    kpiSub: "€B quarterly · HIGHER BETTER",
    kpiMeasures: "Quarterly net sales (€B) against ASML's own guidance range. Bookings disclosure is retired (starting Q1 2026), so this is now the best available forward signal — still lumpy (each machine ships individually), but disclosed every quarter with an explicit guide to check against. Guided €11.0–12.0B for Q3 2026.",
    kpiRequires: {
      bull: "FY26 revenue prints above €45B and Q3/Q4 both beat guide as the supercycle extends — High-NA ramps past its 4–5 unit 2026 target, and TSMC/Samsung/SK Hynix all keep raising capex.",
      base: "FY26 revenue holds in the twice-raised €43–45B range, Q3 lands in the €11–12B guide, High-NA hits its 4–5 unit 2026 target, China stable at ~20% with no service ban.",
      bear: "FY26 revenue guide gets walked back from €43–45B, China service restrictions hit IBM revenue, and High-NA adoption slips below its 4–5 unit 2026 target.",
    },
    group1Title: "Revenue vs. Guide &amp; China Risk",
    group2Title: "Margin &amp; High-NA Ramp",
    killSwitch: "Two straight quarters of revenue or gross margin missing guide, or a new China DUV service restriction that eliminates high-margin recurring revenue — exit / reduce. That is demand destruction or policy risk, not noise.",
    priceBanner: {
      below:  (px, baseLo) => `At $${px}, price is $${baseLo - px} below the base floor. Market is pricing in fear or profit-taking after a big run — not a fundamentals problem, given the Q2 beat-and-raise. Historically the window patient buyers use.`,
      inBase: (px) => `At $${px}, price is inside the base range. Fair value — not a discount, not expensive.`,
      above:  (px, baseHi) => `At $${px}, price is $${px - baseHi} above the base ceiling. The bull thesis needs to play out in full.`,
    },
    moodBanner: (currentPE, loPE, hiPE) => `At ${currentPE}× forward P/E, the market is pricing in continued execution on the Q3 2026 guide (€11.0–12.0B) landing roughly as promised — the multiple sits above the historical normal band (${loPE}–${hiPE}×), reflecting real re-rate risk even with fundamentals intact.`,
    cagrNotes: {
      low:  "Low bar — not priced for perfection. Even moderate execution justifies the price.",
      mid:  "Moderate bar — requires the FY26 guide to hold and High-NA to ramp on schedule.",
      high: "High bar — requires near-perfect execution with no China DUV disruption.",
    },
    fy26CardTip: (fy26) => `Adding H1 2026 actuals (€18.1B) to the base-case Q3–Q4 2026 projections gives a full-year run rate of roughly €${fy26}B, up from €32.7B in 2025 — comfortably inside the twice-raised €43–45B guide. That's what the base case — and roughly today's price — already assumes. The bull case requires High-NA and 2027 order coverage to push meaningfully above this.`,
    fy26CardHtml: (fy26, growthPct) => `H1 2026 actuals plus base-case Q3–Q4 projections sum to roughly <span style="color:var(--blue-soft);font-weight:700">€${fy26}B</span> for full-year 2026 — the growth path today's price already assumes. 2025 actual revenue was <span style="color:#3fd07a">€32.7B</span>, so this implies <em>~${growthPct}%</em> YoY growth.`,
    peerCommentary: (currentPE) => `At ${currentPE}× forward P/E, ASML trades at a premium to the broader WFE peer set (AMAT, LRCX, KLAC) and to TSM's own post-beat multiple (~22x), reflecting its EUV monopoly position — but the premium compressed materially this quarter even as fundamentals improved, since the price pullback outpaced the EPS upgrade. TSM's own Q2 2026 beat-and-raise the same week is corroborating evidence for the shared AI capex cycle, not a competing read.`,
  },

  // THE FUTURE tab
  future: {
    scenarioTips: {
      bear: "Triggered by: revenue/margin guide misses or a new China DUV service restriction. Multiple compresses toward the 18–26× trough zone. Note: at current price, bear downside is larger than bull upside.",
      base: (loPE, hiPE) => `Revenue and gross margin land within the newly-raised guide each quarter; High-NA ramp and China exposure stay on schedule. P/E holds in the normal ${loPE}–${hiPE}× band. Modestly positive return from here as the stock re-tests its pre-print highs.`,
      bull: (currentPE) => `Revenue and margin beat the raised guide again; High-NA ramps ahead of schedule and full-year guidance gets raised a THIRD time. Multiple re-rates from ~${currentPE}× toward the bull zone, closing the gap to the bull target.`,
    },
    downsideChevronTip: "Kill-switch: two straight quarters missing guide, or a new China DUV service restriction = exit / reduce.",
    dislocEventName: "the Aug 2025 China/cyclicality dislocation",
    dislocLabel: "SINCE AUG 2025 CHINA/CYCLE LOW",
    bearPriceTip: (bearMid, bearLo, bearHi, peTrough, peBearHi) => `$${bearMid} is the midpoint of the bear case range ($${bearLo}–$${bearHi}). This assumes a guide-miss pattern replaces the Q2 2026 beat-and-raise, or a China DUV service restriction lands, and the multiple compresses toward the ${peTrough}–${peBearHi}× trough zone. The kill-switch is two straight quarters missing guide — if it triggers, do not average down.`,
    killSwitchTip: "A kill-switch is a pre-committed exit rule you set BEFORE you own the position — when you are thinking clearly. If revenue or gross margin misses guide for two straight quarters, or a new China DUV service restriction materially cuts recurring revenue, the thesis is broken: that's demand weakness or policy risk, not timing. Do not average down into a broken thesis — the market is telling you something. No debate, no rationalisation. Exit.",
    killSwitchTipNote: "Two straight misses, or a new DUV service restriction. Either one. No debate.",
    killSwitchHtml: `<strong style="color:var(--title)">Two consecutive quarters missing the revenue or gross margin guide, or a new China DUV service restriction</strong> → exit or reduce. No debate. Do not average down into a broken thesis.`,
    nextCheck: "Next check: Q3 2026 earnings (~Oct 14, 2026)",
    downsideFootnote: (px, peTrough, peBearHi) => `Bear case scenario: guide misses or a new China DUV service restriction. Assumes a multiple compression toward ${peTrough}–${peBearHi}× on roughly flat-to-down EPS. Position loss is illustrative at $${px} entry.`,
    multipleSummary: (peNow, loPE, hiPE) => `At ~${peNow}× forward P/E, ASML sits above its historical normal range (${loPE}–${hiPE}×) — a real re-rate on the Q2 2026 beat, tempered by the pullback from the pre-print high. Earnings beat; the multiple is elevated but not at its all-time peak.`,
    peBarTipSuffix: "ASML carries relatively low debt and clean earnings, so this P/E is a fair ruler here — no major amortization distortion to strip out.",
    deepValueZoneNote: "Historically cheap. Rare — last seen at the 2022 chip-cycle trough. Exceptional entry if thesis is intact.",
    dislocPrecedent: (baseFloor) => `Historical precedent: the August 2025 China/cyclicality dislocation resolved within the 230-day base-reversion window when the fundamentals stayed intact. Base floor: $${baseFloor}.`,
    regretHtml: (currentPE) => `Q3 2026 revenue and margin <strong style="color:#3fd07a">materially beat the €11.0–12.0B / 65.0–67.0% guide</strong> AND full-year revenue guidance is raised a THIRD time. That would confirm the Q2 2026 beat-and-raise was the start of a trend, not a peak, re-rate the stock from ~${currentPE}× toward the bull zone, and close today's entry window.`,
    regretTip: "Charlie Munger's inversion: instead of asking 'why should I buy?', ask 'what would I have to believe happened, in hindsight, to wish I had bought more?' If Q3 2026 beats the newly-raised guide and full-year guidance gets raised again, today's entry window will close fast. You will not get a second chance at this multiple if the bull case materialises. This question is not about FOMO — it is about sizing correctly for your conviction.",
    chips: [
      { label: "KILL-SWITCH: 2 STRAIGHT GUIDE MISSES → EXIT", col: "#f1564b" },
      { label: "REGRET IF: Q3 BEATS + FY GUIDE RAISED AGAIN", col: "#3fd07a" },
      { label: "NEXT CHECK: ~OCT 14, 2026 EARNINGS",          col: "#2f6dff" },
    ],
    signalFootnote: (ntmEps) => `P/E uses NTM EPS $${ntmEps} (EUR/USD-converted, blended FY26/FY27) — ASML has no meaningful intangible amortization to strip out.`,
  },

  // THE PAST tab
  past: {
    cardTips: {
      durability: (revCagrPct) => `Looks at 10 years of Revenue, Gross Margin, and Free Cash Flow. We want upward trends that hold through cycles — not spike-and-crash. ASML has grown revenue at ~${revCagrPct}% CAGR almost entirely organically (no transformative M&A), with gross margin holding a 44–52% band through two real cyclical downturns (2018, 2022) and FCF growing roughly 8× over the decade.`,
      value: (latestROIC) => `ROIC (Return on Invested Capital) measures how efficiently management deploys capital. Above WACC (~9–11% for a capital-light equipment monopoly) = value creation. Below = value destruction. ASML has stayed comfortably above that band every year in this window — ${latestROIC}% today (estimated) is healthy. Compressing FCF yield reflects the stock re-rating, not weaker cash generation.`,
      capex: (peakCapex, latestCapex, latestFCF) => `Capex as a % of revenue shows how much of every euro gets reinvested before cash reaches shareholders. Unlike a foundry, ASML's own capex (R&D facilities, cleanrooms) is a small fraction of revenue — it doesn't build fabs, its customers do. Capex/revenue peaked at ${peakCapex}% (2023, buildout ahead of demand) and has eased to ${latestCapex}% even as FCF hit a record $${latestFCF}B — spend is being monetized, not just expanded ahead of demand.`,
      mood: (evNow, evAvg) => `EV/EBITDA vs its own 10-year average tells you whether the market is paying a premium or discount for this business. Not a buy/sell signal on its own — context matters (growth rate, interest rates, sector rotation). Current EV/EBITDA of ${evNow}× sits near the 10Y average of ~${evAvg}× at the last full-year close — the live/TTM multiple post-Q2-2026 print is notably higher, reflecting the fresh re-rate.`,
    },
    stats: [
      { html: `Revenue <span style="color:#3fd07a;font-weight:700">$7.6B → $35.9B</span> (10Y)`, tipTitle: "Revenue (10-year)", tipBody: "ASML grew annual revenue from an estimated $7.6B (2016) to $35.9B (2025, USD-converted) — a ~19% CAGR, almost entirely organic with no transformative M&A. Growth tracks the world's leading-edge lithography buildout: mobile/PC nodes through 2021, then AI/HBM-driven EUV intensity from 2023 on." },
      { html: `FCF <span style="color:#3fd07a;font-weight:700">$1.5B → $12.2B</span> (10Y)`, tipTitle: "Free Cash Flow (10-year)", tipBody: "FCF grew from an estimated $1.5B (2016) to $12.2B (2025) — roughly 8× in 10 years. 2023 was a real dip (inventory build ahead of anticipated demand), the closest thing to a bear-case data point in this window — it fully reversed by 2024-2025." },
      { html: `Price <span style="color:#3fd07a;font-weight:700">+2,163%</span> (Jul 2016 → now)`, tipTitle: "Total price return (10-year)", tipBody: "From an estimated $88 (Jul 2016, ADR) to $1,989 at the Jun 2026 pre-print high = roughly +2,163%. Unlike many AI-cycle winners, this compounding came almost entirely from organic earnings growth and multiple re-rating — not acquisitions. Past returns are anchored to a monopoly lithography position and an AI buildout pace that may not repeat." },
    ],
    verdictBody: "ASML has compounded revenue at an estimated ~19% annually for 10 years almost entirely through organic growth — no transformative acquisitions. Gross margins held a 44–52% band through two real cyclical downturns (2018, 2022), FCF grew roughly 8×, and ROIC stayed comfortably above its cost of capital throughout, including the 2023 dip. The business has earned the right to a premium multiple — the open question is whether the current AI-cycle multiple (now with bookings disclosure retired) survives the next downturn, not whether the EUV monopoly itself is durable.",
    banners: {
      durability: (revCagrPct, rev0, rev9, gmDelta, latestGM, fcf0, latestFCF) => `Revenue compounded at an estimated ~${revCagrPct}% annually from $${rev0}B (2016) to $${rev9}B (2025) — almost entirely organic, with no transformative M&A. Gross margin expanded ${gmDelta} points to ${latestGM}%, even through the 2018 and 2022 cyclical downturns. FCF grew from an estimated $${fcf0}B to $${latestFCF}B.`,
      value: (latestROIC) => `Estimated ROIC of ${latestROIC}% (2025) comfortably exceeds a typical WACC of 9–11% for a capital-light equipment monopoly, meaning each dollar reinvested creates well more than a dollar of value. ASML's ROIC has stayed in a healthy band throughout this 10-year window, including the 2023 FCF dip — because the spend is reinvested into the same organic EUV franchise, not bolt-on deals that take years to earn through.`,
      capex: (latestCapex, peakCapex, latestFCF, fy26Guide) => `Capex/revenue of ${latestCapex}% (2025) is well off the ${peakCapex}% peak (2023) even as FCF hit a record $${latestFCF}B. ASML's OWN capex guide for 2026 is roughly $${fy26Guide}B+ — small in absolute terms because ASML doesn't build fabs, its customers (TSMC, Samsung, Intel) do. The real capex story that matters to ASML's demand is on the OTHER side of the table: TSMC alone just raised its own 2026 capex guide to $60–64B.`,
      mood: (evNow, evAvg) => `EV/EBITDA of ${evNow}× at the last full-year close sits near the 10-year average of ${evAvg}× — but the live/TTM multiple post-Q2-2026 print is notably higher, reflecting a fresh re-rate that hasn't fully shown up in year-end figures yet. The price itself is off its all-time high today (pulled back from the pre-print peak), not sitting at a fresh drawdown low — the kind of setup where the next move depends on whether Q3 confirms the re-rate or gives more of it back.`,
    },
    revAnnotationsHtml: `<span>2018: <span style="color:var(--tx3)">$12.9B</span> (chip downturn)</span><span>2025: <span style="color:var(--tx3)">$35.9B</span> (AI/HBM ramp)</span>`,
    roicNote: "Green >15% · Amber 5–15% · Red <5% — ASML has stayed green every year on record (estimated pre-2021)",
    fcfYieldNote: "Declining yield = stock re-rating higher (not declining FCF). FCF itself grew ~8× over the decade.",
    capexAnnotationsHtml: `<span>2023: <span style="color:#f1564b">7.8%</span> (buildout ahead of demand)</span><span>2025: <span style="color:#3fd07a">4.8%</span> (demand catches up)</span>`,
    footnotes: {
      durability: "ASML's growth is organic — there is no acquisition playbook to adjust for. 2016-2020 figures are estimated from public secondary sources (Wisesheets' free tier caps annual history at 5 years); 2021-2025 are SEC-sourced. The 2018 margin compression reflects a broader chip-cycle slowdown; 2022's revenue growth stalled as the post-COVID PC/smartphone inventory unwound — the closest thing to a bear case realized in this data before the 2023-2025 AI/HBM re-acceleration.",
      value: "ROIC has stayed comfortably above cost of capital for 10 straight years on this estimate, including the 2018 and 2022-2023 downturns — there is no acquisition-integration dip to explain away, because there's no acquisition. FCF yield compression reflects the stock's multiple expanding faster than its cash flow, not cash flow deteriorating — FCF itself hit a record $12.2B in 2025. The open question for THE FUTURE tab is whether today's multiple is paying for AI demand that's already arrived, or demand still to come.",
      capex: "ASML's own capex/revenue is structurally low because it is an equipment maker, not a fab operator — the customer capex that actually drives ASML's demand (TSMC, Samsung, Intel building fabs) is disclosed by THOSE companies, not ASML. The kill-switch for this panel: if ASML's own capex/revenue climbs materially without a matching FCF increase, the R&D buildout has stopped paying for itself — worth watching High-NA capacity investment specifically.",
      mood: "The scenario bands on the other tabs use forward P/E, not EV/EBITDA — ASML carries relatively low debt and clean earnings, so P/E is a fair ruler here. EV/EBITDA is shown here purely to track cross-cycle mood, since it's capital-structure-neutral. The multiple bottomed in the high-teens during the 2018/2022 downturns — when the AI story barely existed — and sits meaningfully higher today with the AI story fully priced. That gap is real re-rating, not just earnings growth, and it can compress as fast as it expanded.",
    },
    priceChartTitle: "ASML PRICE (ADR) · 10-YEAR MONTHLY · 2016–2026",
    priceChartSub: "$ per ADR (1 ADR = 1 Amsterdam ordinary share) · dashed lines = key events",
    priceNowTip: (px, isATH) => `$${px} — where ASML (ADR) traded at the last full month-end close, ${isATH ? "also the highest monthly close in this 10-year window" : "off the all-time high"}. The chart shows organic compounding with sharp drawdowns during the 2018 chip downturn, the 2020 COVID crash, and the 2022 chip-cycle trough (−50%), then a sustained AI/HBM-driven re-rating from 2023 on.`,
    ddTip: (minDD) => `${minDD}% — the deepest drop from a prior all-time high in the 10-year window. This occurred during the Sep-Oct 2022 chip-cycle trough (rate-hiking cycle + broad semiconductor inventory correction, pre-AI-supercycle pricing). ASML recovered and went on to make new highs as the AI/HBM cycle took over. Drawdown charts help you visualize what holding through a bad period actually felt like.`,
    ddAnnotationsHtml: `<span>Max drawdown: <span style="color:#f1564b">−50.0%</span> (Sep 2022, chip-cycle trough)</span><span>Latest full month: <span style="color:#3fd07a">0.0%</span> from ATH (Jun 2026 close)</span>`,
  },
};
