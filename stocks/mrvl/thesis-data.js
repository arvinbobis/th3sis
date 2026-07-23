/* ╔══════════════════════════════════════════════════════════════════════════╗
   ║   MRVL · thesis-data.js — ALL per-stock content lives here.              ║
   ║   ███  EDIT EVERYTHING IN THIS FILE EACH QUARTER  ███                    ║
   ║                                                                          ║
   ║   The rendering engine (../engine/thesis-engine.js) contains ZERO        ║
   ║   company-specific strings — every number, narrative, and tooltip        ║
   ║   that mentions MRVL is in this file. Quarterly touch = edit this        ║
   ║   file only, then run: node tools/lint-thesis-data.js MRVL               ║
   ║                                                                          ║
   ║   Marvell fiscal year ends late January (Q1 = Feb–Apr, etc.)             ║
   ║                                                                          ║
   ║   Migrated to the engine-split convention 2026-07-19 (from the old       ║
   ║   standalone bespoke-JSX build). This was a LOSSLESS port of the         ║
   ║   existing CASES/SIGNALS/MARGIN/TRACK_ALL/valuation content — nothing    ║
   ║   in those blocks was re-derived or updated; AS_OF_DATE stays            ║
   ║   2026-06-02 and FALLBACK_PRICE stays $219, matching the pre-migration   ║
   ║   file exactly. THE PAST tab is NEW (the old build had no 10Y-style      ║
   ║   history section) and was built fresh from real data: Wisesheets/SEC    ║
   ║   filings for 5 fiscal years of financials (FY2022–FY2026, the free-     ║
   ║   plan history cap — Marvell does not have TSM/ASML's 10-year window     ║
   ║   here), Wisesheets EOD prices for 5 years of monthly closes (Jul 2021–  ║
   ║   Jul 2026), and web search for the Jun 2026 Jensen Huang "trillion-     ║
   ║   dollar candidate" spike + Jul 2026 semiconductor-selloff pullback      ║
   ║   annotated in PAST_EVENTS. MRVL's own hex palette was already the 4     ║
   ║   permitted semantic colors pre-migration (#f1564b/#e0a83b/#3fd07a/      ║
   ║   #2f6dff) — no stray hex, so MRVL comes OFF the CLAUDE.md legacy-hex    ║
   ║   list the same day, like ASML.                                         ║
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

const TICKER_META = { ticker: "MRVL", exchange: "NASDAQ", company: "Marvell Technology, Inc." };
const AS_OF_DATE = "2026-06-02";

// May 2025 macro/tariff panic dislocation (52-wk low $59.53 intraday, 2025-05-30)
const DISLOCATION_DATE = "2025-05-30";
const REVERSION_TROUGH = 60;
const REVERSION_BASEFLOOR = 140;
const REVERSION_PRECEDENT_DAYS = 270;

const CASES = {
  bear: {
    key: "bear", label: "BEAR", accent: "#f1564b", glow: "rgba(241,86,75,0.45)",
    target12: "$90 — $135",
    op: "Multiple custom XPU design wins among the 18-program pipeline face 6–12 month production delays as hyperscalers iterate on chip specs. The $16.5B FY2028 target gets revised to ~$12–13B, slashing EPS estimates by 20–30%. Broadcom closes the optical DSP gap at 1.6T speeds, pressuring both market share and pricing. At 56× FY2027 EPS, even a modest guidance cut triggers multiple compression back toward 22–25×, and the stock re-rates toward hardware-cyclical levels.",
    breaks: "FY2027 revenue tracking at $11.5B+ with gross margin holding above 58% through Q3 FY2027. If both hold, the design win ramp thesis is intact and the bear case isn't materializing.",
    requires01: "DC revenue misses $2.05B implied guide; FY2028 target qualified",
    requires02: "Gross margin compression below 57%",
  },
  base: {
    key: "base", label: "BASE", accent: "#e0a83b", glow: "rgba(224,168,59,0.40)",
    target12: "$195 — $255",
    op: "Q2 FY2027 data center revenue steps up to ~$2.05B (implied by $2.7B total guide), FY2027 $11.5B tracks on plan, and management reaffirms the $16.5B FY2028 target. A handful of the 18 XPU design wins begin production ramps in H2 FY2027. NVIDIA NVLink Fusion products begin shipping but contribute modestly. Optical DSP market share holds at 65%+ as Marvell transitions from 800G to 1.6T. The market holds 32–34× FY2028 EPS as the target looks credible.",
    breaks: "FY2028 target revised below $15B, or two consecutive data center revenue quarters come in below the implied trajectory.",
    requires01: "DC revenue ≥ $2.05B implied; FY2027 on track; FY2028 reaffirmed",
    requires02: "Gross margin stability 58–60%",
  },
  bull: {
    key: "bull", label: "BULL", accent: "#3fd07a", glow: "rgba(63,208,122,0.45)",
    target12: "$265 — $335",
    op: "FY2028 $16.5B is achieved and management raises guidance at Analyst Day. NVIDIA NVLink Fusion products generate measurable revenue in H1 FY2028, creating a second growth vector. Google's new inference chip design and Amazon Trainium4 both enter production simultaneously, compressing the XPU ramp timeline. The market re-rates MRVL from 'AI infrastructure supplier' (~33×) to 'AI ecosystem platform' (~40×), recognizing the stickiness and scale of 18 custom design relationships.",
    breaks: "Competitors win competing designs at 3+ of the 18 current XPU sockets before production ramp, or NVLink Fusion revenue fails to materialize by Q4 FY2027.",
    requires01: "DC revenue beats $2.2B+; NVLink Fusion or new XPU win disclosed",
    requires02: "Gross margin expansion toward 60%+ as custom ASIC mix grows",
  },
};

// THESIS_HISTORY — append-only archive of the full CASES set as it stood at each
// touch, captured BEFORE that touch's Layer-2 audit rewrites it. This is a new
// migration to the engine split — nothing has been rewritten yet, so there is no
// archived vintage. Intentionally left undeclared (not an empty array — the lint
// treats an empty array as malformed) so lint-thesis-data.js reports the expected
// "no archive yet" warning. See TSM's thesis-data.js for the pattern once a future
// /update-thesis touch pushes the outgoing CASES here before overwriting them.

const FALLBACK_PRICE = 219.00;

const LIVE_PRICE = {
  enabled: true,
  symbol: "MRVL",
  provider: "yahoo",                                  // "yahoo" (keyless, proxied) | "finnhub"
  corsProxy: "https://api.allorigins.win/get?url=",
  finnhubToken: "",
};

// ALERT — buy-trigger pre-commitment. Canonical source is PF_ALERTS.MRVL in
// stocks/portfolio/portfolio-data.js; this copy is a FALLBACK for offline opens.
// MRVL is NOT currently held (sold 2026-07-09) — this is a re-entry watch.
const ALERT = {
  symbol: "MRVL",
  buyFloor: 195,
  thesisIntact: true,
  asOf: AS_OF_DATE,
  nextEarnings: "~2026-08-28",
};

const HISTORY = [
  { q: "Q4 FY25", p: 70  },
  { q: "Q1 FY26", p: 62  },
  { q: "Q2 FY26", p: 82  },
  { q: "Q3 FY26", p: 105 },
  { q: "Q4 FY26", p: 122 },
  { q: "Q1 FY27", p: 205 },
  { q: "NOW",     p: FALLBACK_PRICE },
];

const PROJ_END = { bear: 112, base: 225, bull: 300 };
const FUTURE_Q = ["Q2 FY27", "Q3 FY27", "Q4 FY27", "Q1 FY28"];

const SIGNALS = {
  bear: [
    { name: "Data Center Revenue vs Guide", unit: "$B",      tag: "MISS",  next: "Aug 2026", val: "BEAR ≤ $1.9B",       guide: "IMPLIED $2.05B", pos: 0.20 },
    { name: "FY2028 $16.5B Target",         unit: "guidance", tag: "WATCH", next: "Aug 2026", val: "BEAR revised lower", guide: "GUIDE $16.5B",    pos: 0.18 },
    { name: "XPU Design Win Ramp",           unit: "programs", tag: "MISS",  next: "Aug 2026", val: "BEAR <3 in prod",    guide: "18 wins total",  pos: 0.22 },
  ],
  base: [
    { name: "Data Center Revenue vs Guide", unit: "$B",      tag: "MATCH", next: "Aug 2026", val: "BASE ~$2.05B",       guide: "IMPLIED $2.05B", pos: 0.58 },
    { name: "FY2028 $16.5B Target",         unit: "guidance", tag: "MATCH", next: "Aug 2026", val: "BASE reaffirmed",   guide: "GUIDE $16.5B",    pos: 0.60 },
    { name: "XPU Design Win Ramp",           unit: "programs", tag: "MATCH", next: "Aug 2026", val: "BASE 4–5 ramping",  guide: "18 wins total",  pos: 0.57 },
  ],
  bull: [
    { name: "Data Center Revenue vs Guide", unit: "$B",      tag: "BEAT",  next: "Aug 2026", val: "BULL ≥ $2.2B",       guide: "IMPLIED $2.05B", pos: 0.86 },
    { name: "FY2028 $16.5B Target",         unit: "guidance", tag: "BEAT",  next: "Aug 2026", val: "BULL raised higher", guide: "GUIDE $16.5B",    pos: 0.88 },
    { name: "XPU Design Win Ramp",           unit: "programs", tag: "BEAT",  next: "Aug 2026", val: "BULL 7+ in prod",   guide: "18 wins total",  pos: 0.85 },
  ],
};
const MARGIN = {
  bear: [
    { name: "Non-GAAP Gross Margin", tag: "MISS",  next: "Aug 2026", pos: 0.22 },
    { name: "NVLink Fusion Revenue", tag: "WATCH", next: "Aug 2026", pos: 0.20 },
  ],
  base: [
    { name: "Non-GAAP Gross Margin", tag: "MATCH", next: "Aug 2026", pos: 0.58 },
    { name: "NVLink Fusion Revenue", tag: "WATCH", next: "Aug 2026", pos: 0.52 },
  ],
  bull: [
    { name: "Non-GAAP Gross Margin", tag: "BEAT",  next: "Aug 2026", pos: 0.83 },
    { name: "NVLink Fusion Revenue", tag: "BEAT",  next: "Aug 2026", pos: 0.86 },
  ],
};

// KPI chart: Data Center Revenue ($B, quarterly actuals → scenario projections)
const KPI_HIST = 1.833;  // Q1 FY2027 actual
const KPI_PROJ = {
  bear: [1.90, 2.00, 2.10, 2.20],
  base: [2.05, 2.40, 2.85, 3.50],
  bull: [2.20, 2.70, 3.40, 4.20],
};

// TRACK RECORD — append newest to end; dashboard keeps last TRACK_WINDOW.
const TRACK_ALL = [
  { q: "Q4 FY25", date: "2025-02", post: 70,  reaction: "-",  bear: [42,55],   base: [62,82],   bull: [88,110],  landed: "bear→base", conf: "med"  },
  { q: "Q1 FY26", date: "2025-05", post: 62,  reaction: "--", bear: [35,50],   base: [58,78],   bull: [85,108],  landed: "bear",      conf: "high" },
  { q: "Q2 FY26", date: "2025-08", post: 82,  reaction: "++", bear: [42,58],   base: [72,95],   bull: [105,135], landed: "base→bull", conf: "high" },
  { q: "Q3 FY26", date: "2025-11", post: 105, reaction: "+",  bear: [52,72],   base: [88,118],  bull: [130,165], landed: "base",      conf: "high" },
  { q: "Q4 FY26", date: "2026-02", post: 122, reaction: "++", bear: [65,88],   base: [105,142], bull: [158,202], landed: "base",      conf: "high" },
  { q: "Q1 FY27", date: "2026-05", post: 219, reaction: "++", bear: [90,125],  base: [155,210], bull: [218,285], landed: "bull",      conf: "high" },
];
const TRACK_WINDOW = 6;

// THE PAST — 5 fiscal years of real financials (Wisesheets/SEC filings, FY2022–FY2026;
// Marvell fiscal year ends late January). This is the free-plan Wisesheets history cap
// (5 years), not a 10-year window like TSM/ASML — noted honestly rather than backfilled.
const PAST_YEARS       = ["FY2022", "FY2023", "FY2024", "FY2025", "FY2026"];
const PAST_REV         = [4.46, 5.92, 5.51, 5.77, 8.19];
const PAST_GM          = [46.3, 50.5, 41.6, 41.3, 51.0];
const PAST_FCF         = [0.65, 1.08, 1.03, 1.40, 1.40];
// ROIC = NOPAT (operating income × (1−21%)) ÷ invested capital (debt + equity − cash).
// Negative in 3 of 5 years — GAAP operating income was repeatedly wiped out by
// acquisition amortization (Inphi/Innovium/Celestial AI) and stock comp.
const PAST_ROIC        = [-1.4, 1.0, -2.5, -3.4, 6.4];
// EV/EBITDA uses an adjusted-EBITDA build (operating income + D&A + stock-based
// comp) to normalize the acquisition-heavy years — GAAP EBITDA alone goes negative
// in FY2022, which would break the chart's scale. See TEXT.past.footnotes.mood.
const PAST_EVEBITDA    = [158.9, 38.0, 47.9, 91.2, 22.4];
const PAST_FCF_YIELD   = [1.2, 2.9, 1.8, 1.4, 2.1];
const PAST_CAPEX_REV   = [3.8, 3.5, 6.1, 4.9, 4.3];

// 5-year monthly closes (Wisesheets EOD, Jul 2021–Jul 2026 — the free-plan history cap).
const PRICE_M_LABELS = ["2021-07","2021-08","2021-09","2021-10","2021-11","2021-12","2022-01","2022-02","2022-03","2022-04","2022-05","2022-06","2022-07","2022-08","2022-09","2022-10","2022-11","2022-12","2023-01","2023-02","2023-03","2023-04","2023-05","2023-06","2023-07","2023-08","2023-09","2023-10","2023-11","2023-12","2024-01","2024-02","2024-03","2024-04","2024-05","2024-06","2024-07","2024-08","2024-09","2024-10","2024-11","2024-12","2025-01","2025-02","2025-03","2025-04","2025-05","2025-06","2025-07","2025-08","2025-09","2025-10","2025-11","2025-12","2026-01","2026-02","2026-03","2026-04","2026-05","2026-06","2026-07"];
const PRICE_M = [60.51,61.19,60.31,68.5,71.17,87.49,71.4,68.33,71.71,58.08,59.15,43.53,55.68,46.82,42.91,39.68,46.52,37.04,43.15,45.15,43.3,39.48,58.49,59.78,65.13,58.25,54.13,47.22,55.73,60.31,67.7,71.66,70.88,65.91,68.81,69.9,66.98,76.24,72.12,80.11,92.69,110.45,112.86,91.82,61.57,58.37,60.19,77.4,80.37,62.87,84.07,93.74,89.4,84.98,78.92,81.69,99.05,165.15,205.0,297.89,188.68];
const PRICE_M_DD = [0.0,0.0,-1.4,0.0,0.0,0.0,-18.4,-21.9,-18.0,-33.6,-32.4,-50.2,-36.4,-46.5,-51.0,-54.6,-46.8,-57.7,-50.7,-48.4,-50.5,-54.9,-33.1,-31.7,-25.6,-33.4,-38.1,-46.0,-36.3,-31.1,-22.6,-18.1,-19.0,-24.7,-21.4,-20.1,-23.4,-12.9,-17.6,-8.4,0.0,0.0,0.0,-18.6,-45.4,-48.3,-46.7,-31.4,-28.8,-44.3,-25.5,-16.9,-20.8,-24.7,-30.1,-27.6,-12.2,0.0,0.0,0.0,-36.7];
const PAST_EVENTS = [
  { idx: 17, label: "Chip Cycle Trough",      note: "Dec 2022 — peak Fed rate-hiking cycle plus a broad semiconductor inventory correction. MRVL's monthly close bottomed near $37, the deepest drawdown in this 5-year window (−57.7% from the Dec 2021 high)." },
  { idx: 22, label: "AI Inflection",          note: "May 2023 — Nvidia's blowout May 2023 quarter ignited the AI-accelerator capex narrative. MRVL began being identified as a beneficiary via custom AI silicon and optical interconnect for hyperscalers — the start of the current re-rating cycle." },
  { idx: 46, label: "Tariff Panic",           note: "May 2025 — Trump-era tariff/macro panic. MRVL hit a 52-week low of $59.53 intraday on May 30, 2025 (~-48% from the Jan 2025 high) before fully reversing within the ~270-day precedent window." },
  { idx: 59, label: "Trillion-Dollar Call",   note: "Jun 2026 — at Computex Taipei, NVIDIA CEO Jensen Huang called Marvell a 'next trillion-dollar company' on stage; the stock jumped ~25-30% within days to an intraday high of $329.88 (Jun 4 close $316.43 was the all-time closing high; $297.89 shown here is the June monthly close). S&P 500 inclusion (replacing Pool Corp, effective Jun 22) added further momentum." },
  { idx: 60, label: "AI Semi Selloff",        note: "Jul 2026 — broad semiconductor sell-off as hyperscalers signaled revised capex plans and investors rotated out of high-growth AI names; MRVL gave back most of the June spike, falling back toward $190." },
];

const VAL_CONFIG = {
  ntm_eps:               3.92,
  shares_b:              0.847,
  fcf_ntm_b:             1.9,
  risk_free_pct:         4.35,
  default_discount_pct:  10.0,
  default_terminal_pe:   34,
  dcf_years:              5,
  // MRVL is fabless and doesn't publicly guide capex the way TSM/ASML do. This is a
  // run-rate estimate annualizing Q1 FY2027's $155.7M capex pace (judgment call).
  capex_fy26_guide_b:    0.55,
  prior_fy_rev_b:        6.1,      // FY2026 actual full-year DATA CENTER segment revenue (Marvell IR: "$6.1B, +46% YoY") — this KPI tracks DC revenue, not total company revenue
  prior_fy_label:       "FY2026",
  pe_trough: 18, pe_bear_hi: 23, pe_normal_lo: 28, pe_normal_hi: 38, pe_bull_lo: 40, pe_peak: 60,
  peers: [
    { t: "MRVL", fpe: 56.0, ev_eb: 52.2, fcf_y: 1.0, note: "Custom AI XPU + optical DSP; GAAP depressed by acquisition amortization" },
    { t: "AVGO", fpe: 26.7, ev_eb: 22.4, fcf_y: 3.9, note: "Custom ASIC scale leader + VMware software" },
    { t: "NVDA", fpe: 37.2, ev_eb: 36.8, fcf_y: 1.8, note: "GPU monopoly, NVLink Fusion partner" },
    { t: "ALAB", fpe: 90.0, ev_eb: 70.0, fcf_y: 0.5, note: "Pure-play PCIe/CXL connectivity for AI racks, much smaller scale, wide dispersion in estimates" },
  ],
};

const SIGNAL_HELP = {
  "Data Center Revenue vs Guide": "Marvell earns ~76% of its revenue from data centers — custom AI chips for Amazon, Google, Microsoft, Meta, and networking silicon. Q1 FY2027 was $1.833B; the Q2 total guide of $2.7B implies data center around $2.05B. This checks whether that critical segment is hitting its implied target or running ahead or behind.",
  "FY2028 $16.5B Target": "On May 27, 2026, management guided $11.5B in FY2027 revenue and $16.5B in FY2028. Getting there from $8.2B in FY2026 requires the 18 custom chip design wins to ramp into full production. This signal tracks whether management continues to stand behind that target each quarter or begins to soften it.",
  "XPU Design Win Ramp": "Marvell has 18 signed agreements to design custom AI accelerator chips for hyperscalers — 'design wins.' A win means the customer chose Marvell. Volume ramp means production chips are shipping. The gap between 18 wins and how many are actually shipping at scale is the most important uncertainty in the thesis.",
  "Non-GAAP Gross Margin": "Out of every dollar of revenue, how much is left after chip manufacturing costs. At 58.9%, Marvell's margins are strong. If this expands toward 60%+, it means the higher-margin custom ASIC mix is growing — a bull sign. If it slips below 57%, lower-margin networking products are dominating — a warning that the mix isn't shifting as expected.",
  "NVLink Fusion Revenue": "NVIDIA invested $2 billion in Marvell and they're co-developing products where Marvell's custom chips integrate with NVIDIA's NVLink interconnect architecture. These products start shipping in H2 FY2027. Until Marvell quantifies revenue, this is a 'watch' — it's either a transformative new product category or a headline that adds complexity without proportional revenue.",
};
const TAG_HELP = {
  BEAT: "doing better than expected — a good sign.",
  MATCH: "roughly in line with expectations — steady, no surprises.",
  MISS: "falling short of expectations — a worry.",
  WATCH: "not decided yet — keep an eye on it.",
};

const THESIS_ITEMS = [
  { key: "dcRevenueGuide",     label: "Data center revenue landing within implied guide", note: "Two consecutive misses would break this" },
  { key: "marginStability",    label: "Non-GAAP gross margin holding 58–60%",             note: "per the FY2027 guide range" },
  { key: "xpuRampOnSchedule",  label: "XPU design-win ramp on schedule",                  note: "Volume production for a growing share of the 18 signed design wins" },
  { key: "fy2028TargetIntact", label: "FY2028 $16.5B target reaffirmed",                  note: "Watch for any softening language at each earnings call" },
];
const PRICE_ZONES = [
  { label: "BEAR",    lo: 90,  hi: 135, mid: 112, color: "#f1564b", action: "Exit / reduce if thesis also breaking" },
  { label: "BASE",    lo: 195, hi: 255, mid: 225, color: "#e0a83b", action: "Small add OK if thesis intact" },
  { label: "BULL",    lo: 265, hi: 335, mid: 300, color: "#3fd07a", action: "Let it ride — don't chase" },
];

// ── Chart geometry / axis ranges (per-stock: depends on price scale) ─────────
const GEOM = {
  priceMin: 40, priceMax: 380,
  fanGrid: [300, 250, 200, 150, 100, 50],
  fanYears: ["2025", "2026", "2027"],
  trackMin: 25, trackMax: 310,
  trackGrid: [250, 200, 150, 100, 50],
  kpiMin: 1.0, kpiMax: 4.8,
  visLo: 25, visHi: 395,
  nowZoneLo: 195, nowZoneHi: 255,   // thresholds for the "NOW" dot zone tooltip on THE FUTURE signal panel
};

/* ── TEXT — every company-specific narrative/tooltip the engine renders. ──────
   Values are strings, HTML strings (rendered with dangerouslySetInnerHTML), or
   template functions the engine calls with computed values. If it mentions the
   company, a quarter, a guide number, or an event, it belongs HERE, not in the
   engine — that rule is what makes the engine safely reusable across stocks. */
const TEXT = {
  // header / footer
  priceTipLive: (px, at, asOf) => `Live quote: $${px} (fetched ${at}). The price is real-time, but the scenario bands and EPS are still as of ${asOf} — only the price-derived figures (scenario returns, P/E, band position) update live. Next earnings: Q2 FY2027 (~late Aug 2026).`,
  priceTipStatic: (px, asOf, liveEnabled) => `$${px} as of ${asOf} — ${liveEnabled ? "live fetch unavailable (offline or blocked), using the saved price" : "static price (live fetch disabled)"}. This was an all-time high at the time, up 158% YTD; the stock has since made a fresh all-time high near $300 in June 2026 before pulling back. Next earnings: Q2 FY2027 (~late Aug 2026).`,
  footerDisclaimer: (asOf) => `Illustrative scenario framing built on public consensus & estimates as of ${asOf} — not a prediction and not financial advice. Valuation ruler: forward non-GAAP EPS × P/E (strips acquisition amortization). "18 design wins" means contracts signed, not programs at full production volume — ramp timing is the key uncertainty. Data inputs move with every print. Q2 FY2027 earnings: late August 2026.`,

  // fan chart
  fanHistory: "MRVL's actual share price since Q4 FY2025 (Feb 2025). The stock hit a 52-week low of ~$60 in May 2025 during the tariff/macro panic — a sentiment crisis, not a business miss. Since then it has nearly quadrupled on the AI custom chip story, the NVIDIA partnership, and consecutive earnings beats.",
  fanNow: (px) => `MRVL trades around $${px} — an all-time high (as of Jun 2, 2026). Q1 FY2027 was just reported May 27 (non-GAAP EPS $0.80, beat). Q2 FY2027 earnings due late August. Everything right of this dot is forecast.`,
  fanPastDot: (q, p) => `At the end of ${q}, MRVL was around $${p}.${q === "Q1 FY26" ? " This was near the 52-week low ($59.53) — the May 2025 macro/tariff panic." : ""}`,

  // scenario selector
  segmentedExplain: {
    bear: ["The pessimistic scenario", "Click to see MRVL if design wins take longer to ramp than expected — the $16.5B FY2028 target gets revised, Broadcom takes optical DSP share, and the stock re-rates from 56× FY2027 back toward hardware-cyclical multiples. Price would fall to the $90–135 range."],
    base: ["The most-likely scenario", "Click for the base view — $11.5B FY2027 on track, $16.5B FY2028 credible, and a handful of the 18 XPU design wins begin production. Stock holds 33× FY2028 EPS. Price roughly flat at $195–255."],
    bull: ["The optimistic scenario", "Click to see the upside — FY2028 target beaten, NVIDIA NVLink Fusion generates real revenue, and the market re-rates MRVL from infrastructure supplier to AI platform at 40×. Price could reach $265–335."],
  },

  // KPI column
  kpiBaseline: (val) => `This is the most recent real number: Marvell earned $${val}B from data centers last quarter. The bars to the right are scenario forecasts for where it goes next.`,
  kpiForecast: (label, val) => `In this scenario, quarterly data center revenue reaches ~$${val}B by ${label}. Management's FY2027 total revenue target of $11.5B implies DC averaging $2.1–2.2B per quarter. FY2028's $16.5B target requires $3.1–3.2B per quarter. Taller bar = faster ramp.`,

  // reversion clock
  reversion: {
    header: "DISLOCATION CLOCK · MAY 2025 MACRO PANIC",
    timeTip: "In May 2025, the stock hit a 52-week low of $60 during a tariff/macro panic. This bar shows how many days have elapsed vs. the ~270-day window it took to recover to the 'base zone' ($140). The bar is already maxed — we're well past the recovery window.",
    priceTip: (trough, baseFloor, now) => `Stock bottomed near $${trough} in May 2025. The 'base floor' was $${baseFloor}. At $${now}, the stock had recovered well past the trough-to-base-floor gap — it blew well past the base floor and reached an all-time high. The dislocation narrative is closed.`,
    footerHtml: (baseFloor, precedentDays, now) => `The May 2025 dislocation has <span style="color:#3fd07a;font-weight:700">completely resolved</span> — price reclaimed the $${baseFloor} base floor well within the ${precedentDays}-day precedent window and went on to a new all-time high near $300 in June 2026 on Nvidia CEO Jensen Huang's "trillion-dollar candidate" comment at Computex, before pulling back to $${now} amid a broader semiconductor sell-off. The recovery thesis was validated. The <span style="color:#e0a83b;font-weight:700">open question now</span>: does the $16.5B FY2028 target justify 56× FY2027 EPS? Watch the <span style="color:#e0a83b;font-weight:700">late August</span> Q2 FY2027 print.`,
  },

  // track record
  track: {
    lastDot: (post, nowPx) => `MRVL was at ~$${post} — an all-time high as of Jun 2, 2026. Q1 FY2027 beat consensus EPS ($0.80 vs $0.75). The stock surged ~23% in the two trading days after the May 27 report. Price sits at $${nowPx} today. Next dot: Q2 FY2027 earnings (~late Aug 2026).`,
    pastDot: (q, post) => `After ${q} earnings, MRVL actually traded around $${post}. Compare this dot to the colored bars behind it to see if the predicted range was right.`,
    readoutHtml: (hits, n, nowPx) => `Price has tracked <span style="color:#3fd07a;font-weight:700">base-or-better in ${hits} of ${n} quarters</span> since Q4 FY2025. The only sustained bear period was the May 2025 macro/tariff dislocation (Q1 FY26, ~$62) — a sentiment crisis, not a business miss. Since then every print has beaten estimates. The Q1 FY2027 bull landing ($219) came from back-to-back catalysts: the NVIDIA $2B partnership (March 2026) and a Q1 beat + FY2027/2028 guidance raise (May 27). Current price $${nowPx} sits <span style="color:#e0a83b;font-weight:700">near the BULL band</span> as of this thesis's Jun 2, 2026 snapshot — the Q2 FY2027 print in late August is the next confirmation gate for the $11.5B FY2027 target.`,
    footnote: "⚠ Bands are reconstructed now, anchored to each date's forward EPS and multiple regime — not archived in real time. Treat levels as directional, especially \"lower-conf\" quarters. The Q1 FY26 bear landing was macro-driven (tariff panic), not a business miss — the thesis was intact. Fiscal year ends late January; quarters labeled by Marvell's fiscal convention.",
  },

  // THE CURRENT tab
  current: {
    statusNarrative: {
      broken: "Multiple signals missed. Thesis is under pressure — review the kill-switch criteria.",
      watch:  "Data center revenue beat but margin or the FY2028 target got qualified, or a competitor won a design socket. Core thesis tracking — the Q2 FY2027 print (~late Aug 2026) is the next test. Not broken, but watch closely.",
      intact: "All key signals tracking as expected. The 18 XPU design-win ramp and the NVIDIA NVLink Fusion partnership thesis remains intact — Q1 FY2027 beat on every disclosed line and management reaffirmed the $16.5B FY2028 target.",
    },
    panelTipStory: "Checks whether the original reasons to own MRVL are playing out. Counts signals from the Q1 FY2027 print and Q2 FY2027 guide — data center revenue, FY2028 target, XPU design win ramp, gross margin. 0–1 miss = thesis intact. 2 misses = watch. 3+ = exit. Click to see KPI bars and kill-switch.",
    watchChipHtml: `🔑 WATCH: Q2 FY27 DC rev vs <span style="color:#e0a83b;font-weight:700">$2.05B</span> implied guide · ~late Aug 2026`,
    exitChipHtml: `⚠ EXIT IF: DC rev/margin miss guide <span style="font-weight:700">2 straight quarters</span>, or FY2028 target is qualified`,
    verdictBody: {
      broken:     (px) => `MRVL at $${px}: kill-switch criteria met. Price position is irrelevant — signals say the XPU design-win ramp thesis is no longer playing out. The question is not whether to add; it is how much to reduce.`,
      watchBelow: (px) => `MRVL at $${px} sits below the base floor but signals are mixed. Price is attractive, but adding into a weakening thesis is the wrong sequence. Wait for the Q2 FY2027 print (~late Aug) to confirm or deny the pattern before deploying capital.`,
      below:      (px) => `MRVL at $${px} sits below the base floor with the thesis intact — data center revenue, margin, and the $16.5B FY2028 target were all still on track as of this thesis's snapshot. The pullback from the June 2026 all-time high reflects a broad semiconductor de-rating and profit-taking after the Jensen Huang "trillion-dollar" spike, not a business miss.`,
      inBase:     (px, statusWord) => `MRVL at $${px} is inside the base range. Thesis ${statusWord} and price is fair for the growth on offer — you're still paying up for the $16.5B FY2028 target to deliver. Watch Q2 FY2027 data center revenue and the FY2028 reaffirmation around late August — a beat opens the bull case; a miss reopens the bear.`,
      above:      (px) => `MRVL at $${px} is above the base ceiling. The bull case — FY2028 beaten and NVLink Fusion contributing real revenue — needs to play out to justify entry. If already in, hold. If adding, wait for a pullback toward the base floor.`,
    },
    kpiTitle: "Data Center Revenue",
    kpiSub: "$B quarterly · HIGHER BETTER",
    kpiMeasures: "Quarterly data center revenue from custom AI chips (18 XPU design wins) + optical DSP networking + Ethernet switching. FY2028 $16.5B total target implies DC at ~$3.1B/quarter.",
    kpiRequires: {
      bull: "DC revenue beats $2.2B in Q2 and accelerates toward $4.2B by Q1 FY2028 — requiring fast simultaneous ramp of multiple XPU design wins plus meaningful NVLink Fusion contribution.",
      base: "DC revenue tracks ~$2.05B in Q2, scaling smoothly to ~$3.5B by Q1 FY2028, confirming the $16.5B FY2028 target is on plan.",
      bear: "DC revenue stalls below $2.0B for multiple quarters, signaling XPU design win ramp delays and forcing downward revision of the $16.5B FY2028 target.",
    },
    group1Title: "XPU Ramp &amp; Revenue Trajectory",
    group2Title: "Margin &amp; Forward Guidance Quality",
    killSwitch: "Two straight quarters of data center revenue or gross margin missing guide, a competitor winning 3+ of the 18 XPU design sockets before production ramp, or the $16.5B FY2028 target getting qualified — exit / reduce. That is demand destruction or design-win erosion, not noise.",
    priceBanner: {
      below:  (px, baseLo) => `At $${px}, price is $${baseLo - px} below the base floor. Market is pricing in fear or profit-taking after the June 2026 spike — not a fundamentals problem, given Q1 FY2027's beat. Historically the window patient buyers use.`,
      inBase: (px) => `At $${px}, price is inside the base range. Fair value — not a discount, not expensive.`,
      above:  (px, baseHi) => `At $${px}, price is $${px - baseHi} above the base ceiling. The bull thesis needs to play out in full.`,
    },
    moodBanner: (currentPE, loPE, hiPE) => `At ${currentPE}× forward P/E, the market is pricing in continued XPU design-win execution and the $16.5B FY2028 target landing roughly as promised. MRVL's own history has been far noisier than a typical semi (multiples spanning ${loPE}–${hiPE}× in the normal band) as GAAP earnings were repeatedly distorted by acquisition amortization — today's multiple reflects real AI-driven earnings growth finally catching up to years of M&A spend.`,
    cagrNotes: {
      low:  "Low bar — not priced for perfection. Even moderate execution justifies the price.",
      mid:  "Moderate bar — requires the XPU design-win ramp and FY2028 target to stay on schedule.",
      high: "High bar — requires near-perfect execution with no design-win losses or margin slippage.",
    },
    fy26CardTip: (fy26) => `Adding Q1 FY2027 actuals ($1.833B) to the base-case Q2–Q4 FY2027 projections gives a full-year data-center run rate of roughly $${fy26}B, up from $6.1B in FY2026 — the growth path today's price already assumes on the way to the $16.5B FY2028 total-company target. The bull case requires the XPU ramp to push meaningfully above this.`,
    fy26CardHtml: (fy26, growthPct) => `Q1 FY2027 actuals plus base-case Q2–Q4 projections sum to roughly <span style="color:#2f6dff;font-weight:700">$${fy26}B</span> for full-year FY2027 data center revenue — the growth path today's price already assumes. FY2026 actual data-center revenue was <span style="color:#3fd07a">$6.1B</span>, so this implies <em>~${growthPct}%</em> YoY growth.`,
    peerCommentary: (currentPE) => `At ${currentPE}× NTM P/E, MRVL trades at a steep premium to AVGO (the custom-ASIC scale leader) and roughly in line with the highest-growth AI-semi peers, reflecting the market's bet that the 18 XPU design wins ramp into real production volume. NVIDIA's own public endorsement — Jensen Huang calling MRVL a "trillion-dollar candidate" at Computex — is a rare instance of a chokepoint partner talking its own ecosystem's valuation up, and the market briefly took it literally before the June/July semiconductor de-rating pulled the multiple back down.`,
  },

  // THE FUTURE tab
  future: {
    scenarioTips: {
      bear: "Triggered by: data center revenue/margin guide misses or a competitor winning 3+ of the 18 XPU sockets. Multiple compresses toward the 18–23× trough zone. Note: at current price, bear downside is larger than bull upside.",
      base: (loPE, hiPE) => `Data center revenue lands within the implied guide each quarter; the $16.5B FY2028 target stays reaffirmed. P/E holds in the normal ${loPE}–${hiPE}× band. Roughly flat return from here.`,
      bull: (currentPE) => `Data center revenue beats the implied guide again; NVLink Fusion generates real revenue and the FY2028 target gets raised at Analyst Day. Multiple re-rates from ~${currentPE}× toward the bull zone, closing the gap to the bull target.`,
    },
    downsideChevronTip: "Kill-switch: two straight quarters missing guide, or a competitor winning 3+ of the 18 XPU design sockets = exit / reduce.",
    dislocEventName: "the May 2025 macro/tariff panic low",
    dislocLabel: "SINCE MAY 2025 MACRO LOW",
    bearPriceTip: (bearMid, bearLo, bearHi, peTrough, peBearHi) => `$${bearMid} is the midpoint of the bear case range ($${bearLo}–$${bearHi}). This assumes multiple XPU design wins slip 6–12 months, the $16.5B FY2028 target gets revised down to ~$12–13B, and the multiple compresses toward the ${peTrough}–${peBearHi}× trough zone. The kill-switch is two straight quarters missing guide — if it triggers, do not average down.`,
    killSwitchTip: "A kill-switch is a pre-committed exit rule you set BEFORE you own the position — when you are thinking clearly. If data center revenue or gross margin misses guide for two straight quarters, or a competitor wins 3+ of the 18 XPU design sockets before production ramp, the thesis is broken: that's demand weakness or competitive erosion, not timing. Do not average down into a broken thesis — the market is telling you something. No debate, no rationalisation. Exit.",
    killSwitchTipNote: "Two straight misses, or 3+ lost design sockets. Either one. No debate.",
    killSwitchHtml: `<strong style="color:var(--title)">Two consecutive quarters missing the data center revenue or gross margin guide, or a competitor winning 3+ of the 18 XPU design sockets before production ramp</strong> → exit or reduce. No debate. Do not average down into a broken thesis.`,
    nextCheck: "Next check: Q2 FY2027 earnings (~late Aug 2026)",
    downsideFootnote: (px, peTrough, peBearHi) => `Bear case scenario: XPU ramp delays or a design-win loss. Assumes a multiple compression toward ${peTrough}–${peBearHi}× on roughly flat-to-down EPS. Position loss is illustrative at $${px} entry.`,
    multipleSummary: (peNow, loPE, hiPE) => `At ~${peNow}× NTM P/E, MRVL sits above its own historical normal range (${loPE}–${hiPE}×) — the market is still pricing in the Jensen Huang "trillion-dollar" framing even after the June/July pullback. This is a growth-and-hope multiple, not a mature-compounder multiple like TSM's.`,
    peBarTipSuffix: "Unlike TSM, MRVL's GAAP earnings are depressed by heavy acquisition amortization and stock comp — this P/E uses non-GAAP EPS, the number management and the Street actually price the stock on.",
    deepValueZoneNote: "Historically cheap for MRVL. Rare — last seen near the Oct 2022 chip-cycle trough and the Apr/May 2025 tariff-panic low.",
    dislocPrecedent: (baseFloor) => `Historical precedent: the May 2025 macro/tariff dislocation resolved within the 270-day base-reversion window when the fundamentals stayed intact. Base floor: $${baseFloor}.`,
    regretHtml: (currentPE) => `Q2 FY2027 data center revenue <strong style="color:#3fd07a">materially beats the ~$2.05B implied guide</strong> AND the $16.5B FY2028 target is raised at Analyst Day. That would confirm the XPU ramp is ahead of schedule, re-rate the stock from ~${currentPE}× toward the bull zone, and close today's entry window.`,
    regretTip: "Charlie Munger's inversion: instead of asking 'why should I buy?', ask 'what would I have to believe happened, in hindsight, to wish I had bought more?' If Q2 FY2027 beats the implied guide and the FY2028 target gets raised, today's entry window will close fast. You will not get a second chance at this multiple if the bull case materialises. This question is not about FOMO — it is about sizing correctly for your conviction.",
    chips: [
      { label: "KILL-SWITCH: 2 STRAIGHT GUIDE MISSES → EXIT", col: "#f1564b" },
      { label: "REGRET IF: Q2 BEATS + FY2028 TARGET RAISED",  col: "#3fd07a" },
      { label: "NEXT CHECK: ~LATE AUG 2026 EARNINGS",         col: "#2f6dff" },
    ],
    signalFootnote: (ntmEps) => `P/E uses non-GAAP NTM EPS $${ntmEps} — MRVL's GAAP earnings are depressed by heavy acquisition amortization (Cavium, Inphi, Innovium, Celestial AI) and stock comp, unlike TSM which has clean GAAP.`,
  },

  // THE PAST tab
  past: {
    cardTips: {
      durability: (revCagrPct) => `Looks at 5 years of Revenue, Gross Margin, and Free Cash Flow (Wisesheets/SEC filings, FY2022–FY2026 — Marvell's fiscal year ends late January). We want upward trends that hold through cycles — not spike-and-crash. MRVL has grown revenue at ~${revCagrPct}% CAGR through a string of acquisitions (Inphi, Innovium, Celestial AI), with gross margin swinging 41–51% as acquisition-related amortization moved in and out of COGS, and FCF more than doubling from the FY2022 trough.`,
      value: (latestROIC) => `ROIC (Return on Invested Capital) measures how efficiently management deploys capital. Above WACC (~10–12% for a fabless semiconductor company financing itself partly with acquisition debt) = value creation. Below = value destruction. MRVL's ROIC went negative in 3 of the last 5 fiscal years as GAAP operating income was crushed by acquisition amortization — ${latestROIC}% in FY2026 is the first genuinely healthy print of this window, coinciding with the AI/custom-silicon ramp.`,
      capex: (peakCapex, latestCapex, latestFCF) => `Capex as a % of revenue shows how much of every dollar gets reinvested before cash reaches shareholders. MRVL is fabless — it doesn't own leading-edge wafer fabs — so capex intensity is structurally low next to TSM or ASML. It peaked at ${peakCapex}% (FY2024, Innovium-related build-out) and eased to ${latestCapex}% in FY2026 even as FCF held at $${latestFCF}B — the real test for a fabless model is R&D and acquisition spend, not capex.`,
      mood: (evNow, evAvg) => `EV/EBITDA vs its own 5-year average tells you whether the market is paying a premium or discount for this business — but MRVL's own history is unusually noisy here, because GAAP EBITDA was repeatedly distorted by acquisition amortization and heavy stock comp in years the company barely broke even on a GAAP basis. Current EV/EBITDA of ${evNow}× sits below the 5Y average of ~${evAvg}× — read that as "less extreme than its own noisy history," not "objectively cheap."`,
    },
    stats: [
      { html: `Revenue <span style="color:#3fd07a;font-weight:700">$4.46B → $8.19B</span> (5Y)`, tipTitle: "Revenue (5-year)", tipBody: "MRVL grew annual revenue from $4.46B (FY2022) to $8.19B (FY2026) — a ~16% CAGR, driven by a mix of the Inphi/Innovium/Celestial AI acquisitions and, in the most recent year, organic AI custom-silicon and optical DSP demand." },
      { html: `FCF <span style="color:#3fd07a;font-weight:700">$0.65B → $1.40B</span> (5Y)`, tipTitle: "Free Cash Flow (5-year)", tipBody: "FCF grew from $0.65B (FY2022) to $1.40B (FY2026) — more than double, even while GAAP net income was negative in 3 of those 5 years. FCF held up because acquisition amortization and stock comp are non-cash — this is the clearest evidence the underlying business generates real cash despite a messy GAAP income statement." },
      { html: `Price <span style="color:#3fd07a;font-weight:700">+212%</span> (Jul 2021 → now)`, tipTitle: "Total price return (5-year)", tipBody: "From $60.51 (Jul 2021) to $188.68 today = +212% — but that return came with a ~58% drawdown in the 2022 chip-cycle downturn, a ~48% drawdown in the 2025 tariff panic, and a round trip from $297.89 back to $188.68 in barely six weeks in mid-2026. This is a far more volatile compounding path than TSM's or ASML's." },
    ],
    verdictBody: "MRVL has compounded revenue at ~16% annually over 5 fiscal years, but almost entirely through a string of acquisitions (Inphi, Innovium, Celestial AI) rather than TSM/ASML-style organic compounding — gross margin has swung between 41% and 51% as acquisition-related amortization moved through the P&L, and ROIC was negative in 3 of the last 5 years. FY2026 is the first year the story looks clean: GAAP operating income turned solidly positive, ROIC hit 6.4%, and free cash flow held at a record $1.40B even as the AI ramp accelerated. The open question is whether FY2026 was the start of a durable inflection or a single AI-cycle beat — the answer will show up in whether ROIC keeps climbing or reverts to the pre-FY2026 pattern.",
    banners: {
      durability: (revCagrPct, rev0, rev9, gmDelta, latestGM, fcf0, latestFCF) => `Revenue compounded at ~${revCagrPct}% annually from $${rev0}B (FY2022) to $${rev9}B (FY2026) — driven by the Inphi/Innovium/Celestial AI acquisitions plus, in FY2026, real organic AI-silicon demand. Gross margin moved ${gmDelta} points to ${latestGM}%, swinging through a 41–51% band as acquisition amortization cycled through COGS rather than trending smoothly. FCF grew from $${fcf0}B to $${latestFCF}B.`,
      value: (latestROIC) => `ROIC of ${latestROIC}% (FY2026) is the first year in this 5-year window clearly above a typical WACC of 10–12% for a capital-intensive AI-semi bet financed partly with acquisition debt. Unlike TSM's steady double-digit ROIC, MRVL's ROIC was negative in FY2022, FY2024, and FY2025 — GAAP operating income was repeatedly wiped out by acquisition amortization and heavy stock comp. FY2026's positive print is a real inflection, but it is one data point, not yet a trend.`,
      capex: (latestCapex, peakCapex, latestFCF, fy26Guide) => `Capex/revenue of ${latestCapex}% (FY2026) is down from the ${peakCapex}% peak (FY2024, Innovium-related build-out), and FCF held at $${latestFCF}B. MRVL doesn't publicly guide capex the way TSM/ASML do — fabless companies rarely need to — but the run-rate is trending toward roughly $${fy26Guide}B annualized based on Q1 FY2027's pace, a step up as AI-related infrastructure and IP investment scales. A threat (losing the custom-silicon race to Broadcom) explains the spend; only results — rising DC revenue, stable-or-rising FCF — justify it.`,
      mood: (evNow, evAvg) => `EV/EBITDA of ${evNow}× sits below the 5-year average of ${evAvg}× — but that average is skewed by FY2022's extreme ~159× reading, when GAAP EBITDA was barely positive right after the Inphi deal closed. The price itself round-tripped from a fresh all-time high in June 2026 (Jensen Huang's Computex "trillion-dollar" comment) back down within six weeks — the kind of setup where the next move depends entirely on whether the AI-silicon growth story holds, or whether this was a hype spike unwinding.`,
    },
    revAnnotationsHtml: `<span>FY2024: <span style="color:var(--tx3)">$5.51B</span> (GAAP margin dip, Innovium integration)</span><span>FY2026: <span style="color:var(--tx3)">$8.19B</span> (AI/custom-silicon ramp, +42% YoY)</span>`,
    roicNote: "Green >15% · Amber 5–15% · Red <5% — MRVL spent 3 of the last 5 years in the red before FY2026's turn",
    fcfYieldNote: "FCF yield has stayed low and choppy (1.2–2.9%) even as FCF itself more than doubled — the stock's multiple has expanded faster than its cash flow in most years.",
    capexAnnotationsHtml: `<span>FY2024: <span style="color:#f1564b">6.1%</span> (Innovium-related capex step-up)</span><span>FY2026: <span style="color:#3fd07a">4.3%</span> (capex intensity easing as AI revenue scales)</span>`,
    footnotes: {
      durability: "MRVL's growth is mostly inorganic — Inphi (2021), Innovium (Dec 2023), and Celestial AI licensing deals all show up as step-changes in the revenue and margin data, unlike TSM's organic compounding. The FY2024–FY2025 gross-margin dip (50.5% → 41.6% → 41.3%) reflects acquisition-related intangible amortization flowing through COGS after the Innovium deal closed, not a pricing-power problem. FY2026 marks the AI/custom-silicon re-acceleration: revenue +42% YoY, with gross margin recovering to 51.0% as the AI-driven mix shift began to outrun the amortization drag.",
      value: "ROIC swung from -1.4% (FY2022) to a genuinely healthy 6.4% (FY2026), crossing negative in FY2024 and FY2025 along the way — there is a real acquisition-integration dip to explain here, unlike TSM. FCF yield compression/expansion (1.2% to 2.9% and back) reflects both the stock's multiple swinging wildly and real FCF growth — unlike TSM, MRVL's FCF yield doesn't cleanly separate the two. The open question for THE FUTURE tab is whether FY2026's ROIC turn is durable or a single AI-cycle high point.",
      capex: "Capex/revenue peaked at 6.1% in FY2024 during the Innovium integration, then fell to 4.3% in FY2026 even as absolute capex rose — the ratio falling while revenue outgrows it is the same 'monetized, not stranded' signal TSM shows, just at a much smaller scale since MRVL doesn't own fabs. The kill-switch for this panel: if capex/revenue climbs back above ~8% without a matching DC-revenue and FCF increase, MRVL is spending like a fab owner without the moat of one.",
      mood: "The scenario bands on the other tabs use forward non-GAAP P/E, not EV/EBITDA — MRVL's GAAP earnings are heavily distorted by acquisition amortization and stock comp, so P/E alone would understate real profitability. EV/EBITDA here uses an adjusted-EBITDA build (operating income + D&A + stock-based comp) to normalize across the acquisition-heavy years; even so, the FY2022 reading (~159×) is an outlier from a year GAAP operating income was barely positive right after the Inphi deal closed. Treat the 5Y average as a noisy anchor, not a clean 'normal' level the way TSM's 7–14× range is.",
    },
    priceChartTitle: "MRVL PRICE · 5-YEAR MONTHLY · 2021–2026",
    priceChartSub: "$ per share · dashed lines = key events",
    priceNowTip: (px, isATH) => `$${px} — where MRVL trades today, ${isATH ? "also the highest monthly close in this 5-year window" : "well off the all-time high reached in June 2026"}. The chart shows an acquisition-and-AI-driven path with sharp drawdowns during the 2022 chip-cycle downturn (−58%) and the 2025 tariff panic (−48%), then a spike-and-round-trip in mid-2026 driven by Jensen Huang's Computex comment and a subsequent broad semiconductor sell-off.`,
    ddTip: (minDD) => `${minDD}% — the deepest drop from a prior all-time high in the 5-year window. This occurred in Dec 2022 during the Fed rate-hiking/chip-inventory-correction trough. MRVL recovered and went on to make new highs as the AI/custom-silicon cycle took over. Drawdown charts help you visualize what holding through a bad period actually felt like.`,
    ddAnnotationsHtml: `<span>Max drawdown: <span style="color:#f1564b">−57.7%</span> (Dec 2022, chip-cycle trough)</span><span>Current: <span style="color:#e0a83b">−36.7%</span> from ATH (Jun 2026 Huang-comment spike, since unwound)</span>`,
  },
};
