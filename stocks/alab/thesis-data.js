/* ╔══════════════════════════════════════════════════════════════════════════╗
   ║   ALAB · thesis-data.js — ALL per-stock content lives here.              ║
   ║   ███  EDIT EVERYTHING IN THIS FILE EACH QUARTER  ███                    ║
   ║                                                                          ║
   ║   The rendering engine (../engine/thesis-engine.js) contains ZERO        ║
   ║   company-specific strings — every number, narrative, and tooltip        ║
   ║   that mentions ALAB is in this file. Quarterly touch = edit this        ║
   ║   file only, then run: node tools/lint-thesis-data.js ALAB               ║
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

const TICKER_META = { ticker: "ALAB", exchange: "NASDAQ", company: "Astera Labs, Inc." };
const AS_OF_DATE = "2026-06-25";

// Most recent material dislocation: a sharp Jan 24→27, 2025 AI-infrastructure-sector
// selloff (-28% in one session, $115.55 → $83.16) that kept souring into a Mar 31, 2025
// trough of $59.67 — a -59% drawdown from the Dec 2024 high. Full recovery back above the
// $300 base floor took 417 days (first close ≥$300 was May 22, 2026) — much longer than a
// typical "sharp selloff, quick bounce" pattern; hold that precedent loosely. Real, sourced
// directly from stocks/alab/alab-10-year-history__Sheet1.csv (the real daily price history
// since IPO — misleadingly named, it's ~2.25 years, not 10).
const DISLOCATION_DATE = "2025-03-31";
const REVERSION_TROUGH = 59.67;
const REVERSION_BASEFLOOR = 300;
const REVERSION_PRECEDENT_DAYS = 417;

const CASES = {
  bear: {
    key: "bear", label: "BEAR", accent: "#f1564b", glow: "rgba(241,86,75,0.45)",
    target12: "$160 — $210",
    op: "ALAB trades around 120× forward earnings — a multiple that prices in flawless execution. The risk isn't the business; it's the multiple. If Scorpio's X-Series fabric-switch ramp slips, a hyperscaler standardizes on an in-house or competing connectivity stack, or 2026 growth decelerates from the ~81% pace, the market re-rates a hyper-growth name toward 50–65× fast. On ~$3.20 NTM non-GAAP EPS that compression alone takes the stock to $160–210 even with the business still growing — the classic 'great company, priced for perfection' de-rating.",
    breaks: "Scorpio ramps as guided into ALAB's largest product line AND a second hyperscaler scale-up design win is disclosed; gross margin holds 75%+.",
    requires01: "Q2 FY2026 revenue misses the $355–365M guide, or full-year growth guide is cut below ~70%",
    requires02: "Gross margin compresses below 73%, or a hyperscaler in-sources connectivity",
  },
  base: {
    key: "base", label: "BASE", accent: "#e0a83b", glow: "rgba(224,168,59,0.40)",
    target12: "$300 — $390",
    op: "Q1 FY26 printed records — $308.4M revenue (+93% YoY, beating ~$292M consensus), 76.3% non-GAAP gross margin, $0.61 non-GAAP EPS (beat $0.54 consensus) — and Q2 is guided to $355–365M, above the ~$345M consensus, with Scorpio's 320-lane X-Series fabric switch on track to become the largest product line by year-end and Leo CXL in early ramp on Microsoft Azure M-series VMs. If ALAB keeps landing inside guide and the ~81% 2026 growth holds, a ~90–110× multiple on ~$3.20 NTM EPS frames fair value around $300–390 — modestly below the ~$400 price. The story is intact, but the stock has run ahead of it: base case is flat-to-down absent an estimate raise.",
    breaks: "Two consecutive in-line-or-better prints fail to lift estimates (the growth rate is being fully discounted), or Scorpio/Leo ramp timing slips a quarter.",
    requires01: "Q2 FY2026 lands inside the $355–365M guide; full-year growth held near ~81%",
    requires02: "Gross margin stays 75%+; Scorpio on track as the largest product line by year-end",
  },
  bull: {
    key: "bull", label: "BULL", accent: "#3fd07a", glow: "rgba(63,208,122,0.45)",
    target12: "$450 — $560",
    op: "ALAB's connectivity TAM is widening faster than consensus models: Scorpio scale-up fabric (320-lane X-Series), Aries PCIe-6 retimers, Leo CXL memory on Azure, and custom NVLink Fusion each attack a different layer of the AI rack. If Scorpio beats its ramp and a second or third hyperscaler scale-up win lands while Leo CXL inflects, 2026 growth tops ~81% and 2027 estimates step up — sustaining a 120–140× multiple on a higher EPS base. June 2026 Nasdaq-100 inclusion broadens the buyer base. That combination supports $450–560 within a year.",
    breaks: "A hyperscaler publicly standardizes on an in-house or competing connectivity stack, or Scorpio's X-Series ramp stalls — proving the growth rate (and thus the multiple) unsustainable.",
    requires01: "Scorpio X-Series beats its ramp; a 2nd hyperscaler scale-up win is disclosed",
    requires02: "Leo CXL inflects on Azure; full-year 2026 growth guide raised above ~81%",
  },
};

// THESIS_HISTORY — append-only archive of past CASES vintages, pushed right before a
// future /update-thesis touch rewrites the narrative (see CLAUDE.md). ALAB migrated to
// the engine split 2026-08-01; this is the first touch under the new convention, so
// there is no prior vintage to archive yet. Deliberately left undefined rather than an
// empty array — lint-thesis-data.js treats "undefined" as an optional/not-yet-started
// convention (soft advisory) but an empty array as malformed, so the first real entry
// gets added at ALAB's next /update-thesis touch.

const FALLBACK_PRICE = 399.92;

const LIVE_PRICE = {
  enabled: true,
  symbol: "ALAB",
  provider: "yahoo",                                  // "yahoo" (keyless, proxied) | "finnhub"
  corsProxy: "https://api.allorigins.win/get?url=",
  finnhubToken: "",
};

// ALERT — buy-trigger pre-commitment. Canonical source is PF_ALERTS.ALAB in
// stocks/portfolio/portfolio-data.js; this copy is a FALLBACK for offline opens.
const ALERT = {
  symbol: "ALAB",
  buyFloor: 300,
  thesisIntact: true,
  asOf: AS_OF_DATE,
  nextEarnings: "2026-08-11",
};

const HISTORY = [
  { q: "Q1 25", p: 70 },
  { q: "Q2 25", p: 92 },
  { q: "Q3 25", p: 148 },
  { q: "Q4 25", p: 205 },
  { q: "Q1 26", p: 280 },
  { q: "NOW",   p: FALLBACK_PRICE },
];

const PROJ_END = { bear: 185, base: 345, bull: 505 };
const FUTURE_Q = ["Q2 26", "Q3 26", "Q4 26", "Q1 27"];

const SIGNALS = {
  bear: [
    { name: "Q1 Revenue vs Consensus", unit: "$M", tag: "BEAT", next: "Aug 11, 2026", val: "ACTUAL $308M", guide: "EST $292M", pos: 0.60 },
    { name: "Scorpio Fabric Ramp",     unit: "—",  tag: "BEAT", next: "Aug 11, 2026", val: "X-Series shipping; largest line by yr-end", guide: "ON TRACK", pos: 0.64 },
    { name: "Q2 Revenue Guide",        unit: "$M", tag: "BEAT", next: "Aug 11, 2026", val: "GUIDE $355–365M", guide: "vs cons ~$345M", pos: 0.58 },
  ],
  base: [
    { name: "Q1 Revenue vs Consensus", unit: "$M", tag: "BEAT", next: "Aug 11, 2026", val: "ACTUAL $308M", guide: "EST $292M", pos: 0.60 },
    { name: "Scorpio Fabric Ramp",     unit: "—",  tag: "BEAT", next: "Aug 11, 2026", val: "X-Series shipping; largest line by yr-end", guide: "ON TRACK", pos: 0.64 },
    { name: "Q2 Revenue Guide",        unit: "$M", tag: "BEAT", next: "Aug 11, 2026", val: "GUIDE $355–365M", guide: "vs cons ~$345M", pos: 0.58 },
  ],
  bull: [
    { name: "Q1 Revenue vs Consensus", unit: "$M", tag: "BEAT", next: "Aug 11, 2026", val: "ACTUAL $308M", guide: "EST $292M", pos: 0.60 },
    { name: "Scorpio Fabric Ramp",     unit: "—",  tag: "BEAT", next: "Aug 11, 2026", val: "X-Series shipping; largest line by yr-end", guide: "ON TRACK", pos: 0.64 },
    { name: "Q2 Revenue Guide",        unit: "$M", tag: "BEAT", next: "Aug 11, 2026", val: "GUIDE $355–365M", guide: "vs cons ~$345M", pos: 0.58 },
  ],
};
const MARGIN = {
  bear: [
    { name: "Non-GAAP Gross Margin",   tag: "BEAT",  next: "Aug 11, 2026", pos: 0.72 },
    { name: "Leo CXL Ramp (Azure)",    tag: "MATCH", next: "Aug 11, 2026", pos: 0.50 },
  ],
  base: [
    { name: "Non-GAAP Gross Margin",   tag: "BEAT",  next: "Aug 11, 2026", pos: 0.72 },
    { name: "Leo CXL Ramp (Azure)",    tag: "MATCH", next: "Aug 11, 2026", pos: 0.50 },
  ],
  bull: [
    { name: "Non-GAAP Gross Margin",   tag: "BEAT",  next: "Aug 11, 2026", pos: 0.72 },
    { name: "Leo CXL Ramp (Azure)",    tag: "MATCH", next: "Aug 11, 2026", pos: 0.50 },
  ],
};

const KPI_HIST = 308;  // Q1 FY2026 actual ($308.4M, +93% YoY, beat ~$292M consensus)
const KPI_PROJ = {
  bear:  [355, 380, 400, 420],  // bear: Q2 low end, then growth decelerates
  base:  [360, 410, 460, 510],  // base: Q2 mid-guide, ~81% FY26 growth holds
  bull:  [365, 445, 530, 615],  // bull: Q2 high end, Scorpio + Leo accelerate
};

// TRACK RECORD — append newest to end; dashboard keeps last TRACK_WINDOW.
// APPROXIMATE reconstructed bands for a young stock (IPO Mar 2024) — refine per touch.
const TRACK_ALL = [
  { q: "Q3 24", date: "2024-11", post: 55,  reaction: "+",  bear: [28,38],   base: [45,60],   bull: [70,90],   landed: "base",      conf: "low"  },
  { q: "Q4 24", date: "2025-02", post: 75,  reaction: "+",  bear: [40,55],   base: [62,82],   bull: [95,120],  landed: "base",      conf: "low"  },
  { q: "Q1 25", date: "2025-05", post: 70,  reaction: "-",  bear: [45,62],   base: [70,95],   bull: [110,140], landed: "bear→base", conf: "low"  },
  { q: "Q2 25", date: "2025-08", post: 100, reaction: "++", bear: [55,75],   base: [85,115],  bull: [130,165], landed: "base",      conf: "med"  },
  { q: "Q3 25", date: "2025-11", post: 160, reaction: "++", bear: [80,110],  base: [125,165], bull: [185,235], landed: "base→bull", conf: "med"  },
  { q: "Q4 25", date: "2026-02", post: 215, reaction: "+",  bear: [120,160], base: [180,235], bull: [260,330], landed: "base",      conf: "med"  },
  { q: "Q1 26", date: "2026-05", post: 300, reaction: "++", bear: [150,200], base: [240,320], bull: [380,470], landed: "base→bull", conf: "high" },
];
const TRACK_WINDOW = 6;

// THE PAST — real fiscal-year history (Wisesheets export of the actual SEC-filed income
// statements/balance sheets: stocks/alab/alab-wise-q1fy26__ALAB_-_*.csv, plus the Feb 2024
// S-1's audited FY2022/FY2023 comparatives, pre-IPO). ALAB IPO'd March 20, 2024, so this is
// deliberately 4 real fiscal years, not 10 — no fabricated padding to a longer history.
//
// ⚠ Data-availability limitation, disclosed rather than papered over (see TEXT.past
// footnotes below): PAST_ROIC uses ROE as the best available substitute for FY2024/FY2025
// — true ROIC isn't cleanly computable this early (balance sheet is still mostly unspent
// IPO cash, and FY2022/FY2023 equity was negative, making ROE undefined for those years
// too, hence the leading nulls). PAST_EVEBITDA is real only for FY2025 (150.5×, matching
// the Wisesheets-sourced FIN metric) — EBITDA was negative or near-breakeven in FY2022–
// FY2024, so no meaningful multiple exists for those years; the engine's own multi-year
// "avg" comparison on the MOOD panel is therefore distorted by that gap and should be read
// as directional only, not a true 4-year average (flagged again in TEXT.past.footnotes.mood).
const PAST_YEARS       = ["FY2022","FY2023","FY2024","FY2025"];
const PAST_REV         = [0.08,  0.116, 0.396, 0.853];   // $B, total net revenue
const PAST_GM          = [73.5,  68.9,  76.4,  75.7];    // % gross margin, GAAP
const PAST_FCF         = [-0.04, -0.015, 0.102, 0.282];  // $B free cash flow
const PAST_ROIC        = [null,  null,  -8.6,  16.1];    // % — ROE used as substitute, FY2024 on only
const PAST_EVEBITDA    = [null,  null,  null,  150.5];   // × — only FY2025 EBITDA is meaningfully positive
const PAST_FCF_YIELD   = [null,  null,  0.5,   1.0];     // % — no market cap pre-IPO (FY2022/FY2023)
const PAST_CAPEX_REV   = [5.0,   2.6,   8.6,   4.5];     // % capex/revenue — fabless, naturally low & volatile

// Monthly price history since IPO: last trading day of each month, from the real daily
// series (stocks/alab/alab-10-year-history__Sheet1.csv). Two real facts this monthly grain
// can't show on the chart line itself (both noted in tooltips instead): the actual all-time
// LOW was $36.37 intraday on Aug 7, 2024 (Aug's month-end close recovered to $43.06), and
// the actual all-time HIGH was $439.66 on Jun 22, 2026 (Nasdaq-100 inclusion day) — June's
// month-end close of $399.92 reflects a pullback in the final two trading days of the
// month, not a lower peak.
const PRICE_M_LABELS = ["2024-03","2024-04","2024-05","2024-06","2024-07","2024-08","2024-09","2024-10","2024-11","2024-12","2025-01","2025-02","2025-03","2025-04","2025-05","2025-06","2025-07","2025-08","2025-09","2025-10","2025-11","2025-12","2026-01","2026-02","2026-03","2026-04","2026-05","2026-06"];
const PRICE_M = [74.19,84.76,64.54,60.51,43.84,43.06,52.39,70.16,103.25,132.45,101.42,74.35,59.67,65.31,90.72,90.42,136.73,182.2,195.8,186.68,157.57,166.36,150.62,118.83,109.6,194.74,342.85,399.92];
const PRICE_M_DD = [0.0,0.0,-23.9,-28.6,-48.3,-49.2,-38.2,-17.2,0.0,0.0,-23.4,-43.9,-54.9,-50.7,-31.5,-31.7,0.0,0.0,0.0,-4.7,-19.5,-15.0,-23.1,-39.3,-44.0,-0.5,0.0,0.0];
// Key events for price chart annotations (index into PRICE_M_LABELS)
const PAST_EVENTS = [
  { idx: 0,  label: "IPO",         note: "Mar 20, 2024 — Astera Labs IPO'd on Nasdaq at $62.03 first-day close (offer price was $36.00). No prior public trading history exists before this point." },
  { idx: 5,  label: "ATL",         note: "Aug 7, 2024 — intraday all-time low of $36.37, essentially round-tripping back to the IPO offer price after the initial post-IPO settling period. The stock didn't meaningfully break out until Scorpio/Leo design wins started compounding revenue beats through late 2024." },
  { idx: 10, label: "AI Selloff",  note: "Jan 24→27, 2025 — a sharp single-session -28% crash ($115.55 → $83.16), part of the broader AI-infrastructure selloff that hit the whole sector that week. ALAB kept softening into the Q1 2025 print, bottoming at $59.67 on Mar 31, 2025 — a -59% drawdown from the Dec 2024 high. The most severe real dislocation on record for this stock." },
];

// Valuation tab config (update each quarter alongside the rest)
const VAL_CONFIG = {
  ntm_eps:               3.20,   // non-GAAP NTM EPS consensus (≈125× on ~$400)
  shares_b:              0.175,  // shares outstanding (billions, ~175M)
  fcf_ntm_b:             0.45,   // NTM free cash flow ($B)
  risk_free_pct:         4.35,   // 10Y Treasury yield %
  default_discount_pct:  10.0,   // reverse-DCF default discount rate
  default_terminal_pe:   30,     // reverse-DCF default terminal P/E (hyper-growth)
  dcf_years:              5,
  ai_rev_fy27_target_b:  3.0,    // ~FY27 revenue scale ($B) the bull case implies
  capex_fy26_guide_b:    0.045,  // rough FY26 capex scale — fabless, small vs revenue
  prior_fy_rev_b:        0.853,  // last full fiscal year actual revenue
  prior_fy_label:        "FY2025",
  // Forward-P/E history zones (hyper-growth connectivity name, since IPO)
  pe_trough: 50, pe_bear_hi: 65, pe_normal_lo: 90, pe_normal_hi: 110, pe_bull_lo: 125, pe_peak: 150,
  peers: [
    { t: "ALAB", fpe: 120.0, ev_eb: 95.0, fcf_y: 0.7, note: "AI connectivity: retimers/fabric/CXL" },
    { t: "CRDO", fpe: 85.0,  ev_eb: 70.0, fcf_y: 0.8, note: "AI connectivity: AECs/retimers" },
    { t: "NVDA", fpe: 37.2,  ev_eb: 36.8, fcf_y: 1.8, note: "GPU platform" },
    { t: "MRVL", fpe: 32.1,  ev_eb: 31.5, fcf_y: 1.2, note: "custom AI silicon + optics" },
  ],
};

const SIGNAL_HELP = {
  "Q1 Revenue vs Consensus": "Astera Labs' total revenue from its connectivity chip portfolio (Scorpio fabric switches, Leo CXL controllers, Aries PCIe/CXL retimers, Taurus active cables). Q1 FY2026 actual: $308.4M — a real beat vs. the ~$292M analyst consensus, and up 93% year-over-year. This is the fifth straight quarter of triple-digit-adjacent YoY growth since the March 2024 IPO.",
  "Scorpio Fabric Ramp": "Scorpio is Astera Labs' 320-lane PCIe/Ethernet fabric switch for connecting GPUs inside an AI server rack (the 'scale-up' layer) — the highest-value product in the lineup. Management said on the Q1 call it's on track to become ALAB's largest product line by revenue by year-end 2026, shipping into at least one hyperscaler's next-gen rack architecture. A slip here is the single biggest risk to the bull case.",
  "Q2 Revenue Guide": "What management says next quarter's total revenue will be. Q2 FY2026 guide: $355–365M, above the ~$345M analyst consensus going into the print — a raise, not just an in-line guide. At the midpoint that's roughly 81%+ YoY growth, consistent with the full-year growth rate the base case assumes holds through 2026.",
  "Non-GAAP Gross Margin": "Revenue minus cost of goods, on a non-GAAP basis (strips out stock-based comp and acquisition-related items — ALAB has made no acquisitions, so this adjustment is small and clean, unlike a company amortizing a large M&A deal). Q1 FY2026: 76.3–76.4%, above the ~75% level guided — genuinely high for a semiconductor company and a sign of pricing power in a still-scarce advanced-connectivity market. Q2 guide of ~73% reflects product mix shifting toward higher-volume, lower-margin Scorpio units — watch whether that's temporary mix or a real margin ceiling.",
  "Leo CXL Ramp (Azure)": "Leo is Astera Labs' CXL (Compute Express Link) memory-controller product line, letting servers pool and expand memory beyond what's physically attached to a CPU. Early production ramp is on Microsoft Azure's M-series virtual machines — the first disclosed hyperscaler design win for this specific product line, distinct from Scorpio. Still early revenue contribution; the bull case needs this to inflect meaningfully in 2026, not just stay 'on track.'",
};
const TAG_HELP = {
  BEAT: "doing better than expected — a good sign.",
  MATCH: "roughly in line with expectations — steady, no surprises.",
  MISS: "falling short of expectations — a worry.",
  WATCH: "not decided yet — keep an eye on it.",
};

const THESIS_ITEMS = [
  { key: "revGrowth",   label: "Full-year 2026 growth guide holding ~81%", note: "Two consecutive in-line-or-better prints needed to lift estimates" },
  { key: "scorpioRamp", label: "Scorpio X-Series on track as largest product line by year-end", note: "The single biggest ramp-timing risk to the bull case" },
  { key: "grossMargin", label: "Non-GAAP gross margin holding 75%+", note: "Q2 guide of ~73% reflects mix shift — watch if that's temporary or a new ceiling" },
  { key: "noInsourcing", label: "No hyperscaler in-sources or standardizes on a competing connectivity stack", note: "The chokepoint-breaking event — nothing disclosed as of this writing" },
];
const PRICE_ZONES = [
  { label: "BEAR",    lo: 160, hi: 210, mid: 185, color: "#f1564b", action: "Exit / reduce if thesis also breaking" },
  { label: "BASE",    lo: 300, hi: 390, mid: 345, color: "#e0a83b", action: "Small add OK if thesis intact" },
  { label: "BULL",    lo: 450, hi: 560, mid: 505, color: "#3fd07a", action: "Let it ride — don't chase" },
];

// ── Chart geometry / axis ranges (per-stock: depends on price scale) ─────────
const GEOM = {
  priceMin: 150, priceMax: 720,
  fanGrid: [650, 550, 450, 350, 250],
  fanYears: ["2025", "2026", "2027"],
  trackMin: 20, trackMax: 640,
  trackGrid: [500, 400, 300, 200, 100],
  kpiMin: 250, kpiMax: 650,
  visLo: 150, visHi: 700,
  nowZoneLo: 300, nowZoneHi: 390,   // thresholds for the "NOW" dot zone tooltip on THE FUTURE signal panel
};

/* ── TEXT — every company-specific narrative/tooltip the engine renders. ──────
   Values are strings, HTML strings (rendered with dangerouslySetInnerHTML), or
   template functions the engine calls with computed values. If it mentions the
   company, a quarter, a guide number, or an event, it belongs HERE, not in the
   engine — that rule is what makes the engine safely reusable across stocks. */
const TEXT = {
  // header / footer
  priceTipLive: (px, at, asOf) => `Live quote: $${px} (fetched ${at}). The price is real-time, but the scenario bands and EPS are still as of ${asOf} — only the price-derived figures (scenario returns, P/E, band position) update live.`,
  priceTipStatic: (px, asOf, liveEnabled) => `$${px} as of ${asOf} — ${liveEnabled ? "live fetch unavailable (offline or blocked), using the saved price" : "static price (live fetch disabled)"}. Next earnings: Q2 FY2026 (~Aug 11, 2026).`,
  footerDisclaimer: (asOf) => `Illustrative scenario framing built on public consensus & estimates as of ${asOf} — not a prediction and not financial advice. Price ranges are scenario mid-bands; KPI markers are positional, not literal. Valuation ruler: forward non-GAAP EPS × P/E multiple (ALAB has made no acquisitions, so there's no amortization distortion to strip out). Data inputs will move with every print. Next earnings: Q2 FY2026 (~Aug 11, 2026).`,

  // fan chart
  fanHistory: "The solid white line is ALAB's actual share price since Q1 2025. Astera Labs IPO'd in March 2024 at a $36.00 offer price; no stock split has occurred. The run from ~$70 to $400+ was driven almost entirely by repeated Scorpio/Leo/Aries revenue beats and hyperscaler design-win momentum, interrupted by a severe Jan–Mar 2025 AI-infrastructure-sector selloff.",
  fanNow: (px) => `ALAB trades around $${px} right now. Q1 FY2026 printed $308.4M revenue (+93% YoY, beating the ~$292M consensus), 76.3% non-GAAP gross margin, and $0.61 non-GAAP EPS — and management guided Q2 to $355–365M, above the ~$345M consensus. Everything left of this dot is history; everything right is forecast.`,
  fanPastDot: (q, p) => `At the end of ${q}, ALAB was around $${p}.`,

  // scenario selector
  segmentedExplain: {
    bear: ["The pessimistic scenario", "Click to see what ALAB looks like if the Scorpio X-Series ramp slips, a hyperscaler standardizes on an in-house or competing connectivity stack, or 2026 growth decelerates well below the ~81% guide. The multiple compresses hard on a hyper-growth name repriced as merely growing. Price would likely fall to the $160–210 range."],
    base: ["The most-likely scenario", "Click for the base view — Scorpio's X-Series fabric switch becomes the largest product line on schedule, Leo CXL keeps ramping on Azure, and full-year growth holds near the ~81% guide. Price stays in the $300–390 range — modestly below where the stock trades today."],
    bull: ["The optimistic scenario", "Click to see the upside — Scorpio beats its ramp, a second or third hyperscaler scale-up design win is disclosed, and Leo CXL inflects, pushing 2026 growth above ~81% and lifting 2027 estimates. Price could reach $450–560."],
  },

  // KPI column
  kpiBaseline: (val) => `This is the most recent real number: Astera Labs reported $${val}M in total revenue last quarter (+93% YoY, beating its own ~$292M consensus). The bars to the right are scenario forecasts for where it goes next.`,
  kpiForecast: (label, val) => `In this scenario, quarterly total revenue reaches ~$${val}M by ${label}. Management's Q2 FY2026 guide is $355–365M — taller bar = faster ramp.`,

  // reversion clock
  reversion: {
    header: "REVERSION CLOCK · MAR 2025 AI-SECTOR SELLOFF TROUGH",
    timeTip: "A sharp Jan 24→27, 2025 AI-infrastructure-sector selloff (-28% in one session, $115.55 → $83.16) kept souring into a Mar 31, 2025 trough of $59.67 — a -59% drawdown from the Dec 2024 high. This bar shows how far along the recovery is vs. the ~417-day precedent it took the stock to reclaim the $300 base floor (first close ≥$300 wasn't until May 22, 2026).",
    priceTip: (trough, baseFloor, now) => `Stock bottomed near $${trough} after the Jan–Mar 2025 AI-sector selloff and needed to reach $${baseFloor} to re-enter the base band. At $${now} it has shot well past the base floor — Scorpio/Leo design-win momentum overpowered the selloff.`,
    footerHtml: (baseFloor, precedentDays, now) => `The Jan–Mar 2025 selloff was a sector-wide AI-infrastructure repricing, not an ALAB-specific miss — the company kept beating guide the whole way through it. Price reclaimed the $${baseFloor} base floor only after ${precedentDays} days, much slower than a typical sharp-drop-quick-bounce pattern, before running to a fresh all-time high on Nasdaq-100 inclusion. The next dislocation risk to watch is a Scorpio ramp slip or a hyperscaler in-sourcing its own connectivity stack — not a repeat of this one, but the same playbook applies: <span style="color:#e0a83b;font-weight:700">has the thesis actually broken, or is this fear?</span>`,
  },

  // track record
  track: {
    lastDot: (post, nowPx) => `After Q1 FY2026 earnings (May 5, 2026), ALAB traded around $${post} — a genuine beat-and-raise print (revenue $308.4M, +93% YoY, beating ~$292M consensus; Q2 guide $355–365M above ~$345M consensus). Price sits at $${nowPx} today. Next dot: Q2 FY2026 earnings (~Aug 11, 2026).`,
    pastDot: (q, post) => `After ${q} earnings, ALAB actually traded around $${post}. Compare this dot to the colored bars behind it to see if the predicted range was right.`,
    readoutHtml: (hits, n, nowPx) => `Price has tracked <span style="color:#3fd07a;font-weight:700">base-or-better in ${hits} of ${n} quarters</span> tracked since Q3 FY2024. The only real air pocket was the Jan–Mar 2025 AI-infrastructure-sector selloff (Q1 FY2025 landed near the bear band) — a sector-wide repricing, not an ALAB-specific miss, since the company kept beating guide the whole way through it. Q1 FY2026 printed a clean beat-and-raise ($308.4M revenue +93% YoY, 76.3% gross margin, $0.61 non-GAAP EPS, Q2 guide $355–365M above consensus), and the stock has since run to a fresh all-time high on Jun 22, 2026 Nasdaq-100 inclusion before easing to $${nowPx}. Next directional catalyst: <span style="color:#e0a83b;font-weight:700">Q2 FY2026 earnings (~Aug 11, 2026)</span> — revenue vs. the $355–365M guide and whether Scorpio's X-Series ramp stays on track to become the largest product line by year-end.`,
    footnote: "⚠ Bands are reconstructed now, anchored to each date's forward EPS & multiple regime — not archived in real time, and ALAB has under 2.5 years of public history so early quarters are especially low-confidence. Treat levels as directional. Customer concentration among a small number of hyperscaler design wins is a real risk not fully captured in these bands.",
  },

  // THE CURRENT tab
  current: {
    statusNarrative: {
      broken: "Multiple signals missed. Thesis is under pressure — review the kill-switch criteria.",
      watch:  "Mixed print — watch closely. The next test is whether Scorpio's ramp and the ~81% growth rate hold at the Aug 11, 2026 Q2 report.",
      intact: "All key signals tracking as expected. The Scorpio fabric ramp and Leo CXL connectivity thesis remains intact.",
    },
    panelTipStory: "Checks whether the original reasons to own ALAB are playing out. Counts signals from the Q1 FY2026 print and Q2 FY2026 guide — revenue, Scorpio ramp, gross margin, Leo CXL. 0–1 miss = thesis intact. 2 misses = watch. 3+ = exit. Click to see KPI bars and kill-switch.",
    watchChipHtml: `🔑 WATCH: Q2 rev vs <span style="color:#e0a83b;font-weight:700">$355–365M</span> guide · Aug 11, 2026`,
    exitChipHtml: `⚠ EXIT IF: growth guide cut below <span style="font-weight:700">~70%</span>, or GM &lt; 73%`,
    verdictBody: {
      broken:     (px) => `ALAB at $${px}: kill-switch criteria met. Price position is irrelevant — signals say the Scorpio/connectivity growth thesis is no longer playing out. The question is not whether to add; it is how much to reduce.`,
      watchBelow: (px) => `ALAB at $${px} sits below the base floor but signals are mixed. At ~120× forward earnings the multiple leaves little room for error — adding into a decelerating growth story is the wrong sequence. Wait for the Aug 11, 2026 Q2 print to confirm the Scorpio ramp before deploying capital.`,
      below:      (px) => `ALAB at $${px} sits below the base floor with the thesis intact — Q1 FY2026 beat on revenue, margin, and EPS, and Scorpio remains on track as the largest product line by year-end. A pullback in a ~120× name is rare; if the growth rate holds, this is the entry window.`,
      inBase:     (px, statusWord) => `ALAB at $${px} is inside the base range. Thesis ${statusWord} and the price already reflects much of the growth. Watch Q2 FY2026 revenue vs. the $355–365M guide on Aug 11, 2026 — a beat plus a raised outlook opens the bull case; a deceleration reopens the bear.`,
      above:      (px) => `ALAB at $${px} is above the base ceiling — the bull case (a Scorpio beat plus a second hyperscaler scale-up win) needs to play out to justify entry here. If already in, hold. If adding, wait for a pullback toward the base floor.`,
    },
    kpiTitle: "Total Revenue",
    kpiSub: "$M quarterly · HIGHER BETTER",
    kpiMeasures: "Total quarterly revenue from AI connectivity — Scorpio fabric switches, Aries PCIe/CXL retimers, Leo CXL memory controllers, Taurus active cables — across hyperscaler GPU rack platforms. Guided $355–365M for Q2 FY2026, an ~81%+ YoY growth pace at the midpoint.",
    kpiRequires: {
      bull: "Revenue beats guide and accelerates toward $600M+ quarterly by Q1 2027 as Scorpio scales and a second hyperscaler scale-up win lands.",
      base: "Revenue lands inside guide each quarter and scales toward ~$510M by Q1 2027, holding the ~81% 2026 growth rate.",
      bear: "Revenue growth decelerates and stalls near $400M for multiple quarters, signaling the connectivity ramp is maturing faster than modeled, or a hyperscaler in-sources its own connectivity stack.",
    },
    group1Title: "Revenue &amp; Scorpio Momentum",
    group2Title: "Margin &amp; Forward Guidance Quality",
    killSwitch: "Full-year growth guide cut below ~70%, gross margin below 73%, or a hyperscaler in-sources connectivity — exit / reduce. At ~120× the multiple cannot survive a broken growth story.",
    priceBanner: {
      below:  (px, baseLo) => `At $${px}, price is $${baseLo - px} below the base floor. Market is pricing in fear — not fundamentals, given the Q1 beat-and-raise. Historically the window patient buyers use.`,
      inBase: (px) => `At $${px}, price is inside the base range. Fair value — not a discount, not expensive.`,
      above:  (px, baseHi) => `At $${px}, price is $${px - baseHi} above the base ceiling. The bull thesis needs to play out in full.`,
    },
    moodBanner: (currentPE, loPE, hiPE) => `At ${currentPE}× forward P/E, the market is paying a steep premium that assumes the ~81% 2026 growth rate and the Scorpio ramp largely play out — a level near the ${loPE}–${hiPE}× normal band's low end. Little room for a stumble.`,
    cagrNotes: {
      low:  "Low bar — not priced for perfection. Even moderate execution justifies the price.",
      mid:  "Moderate bar — requires the Scorpio ramp and Leo CXL adoption to stay on schedule.",
      high: "High bar — requires near-perfect execution with no hyperscaler in-sourcing or ramp slip.",
    },
    fy26CardTip: (fy26) => `Adding Q1 FY2026 actual to base-case Q2–Q4 FY2026 projections gives a full-year run rate of roughly $${fy26}M, up from $853M in FY2025 — in line with the ~81% growth guide. That's what the base case — and roughly today's price — already assumes. The bull case requires Scorpio and Leo to push meaningfully above this.`,
    fy26CardHtml: (fy26, growthPct) => `Q1 FY2026 actual plus base-case Q2–Q4 projections sum to roughly <span style="color:var(--blue-soft);font-weight:700">$${fy26}M</span> for full-year FY2026 — the growth path today's price already assumes. FY2025 actual revenue was <span style="color:#3fd07a">$853M</span>, so this implies <em>~${growthPct}%</em> YoY growth.`,
    peerCommentary: (currentPE) => `At ${currentPE}× NTM P/E, ALAB trades far above every named peer — CRDO is the closest comp and still meaningfully cheaper, while NVDA and MRVL trade at a fraction of ALAB's multiple. The premium itself is the risk: it prices in flawless execution on Scorpio's ramp and continued hyperscaler design-win momentum, with little room for a stumble.`,
  },

  // THE FUTURE tab
  future: {
    scenarioTips: {
      bear: "Triggered by: a Scorpio ramp slip, a hyperscaler in-sourcing or standardizing on a competing connectivity stack, or 2026 growth decelerating well below the ~81% guide. The multiple compresses hard on a hyper-growth name repriced as merely growing.",
      base: (loPE, hiPE) => `Q2 lands inside the $355–365M guide, full-year growth holds near the ~81% guide, and Scorpio becomes the largest product line on schedule. P/E holds near the ${loPE}–${hiPE}× normal band's low end. Roughly flat-to-down from today's price — the stock has run ahead of the base case.`,
      bull: (currentPE) => `Scorpio beats its ramp, a second or third hyperscaler scale-up win is disclosed, and Leo CXL inflects on Azure. 2026 growth guide gets raised above ~81%, re-rating the stock from ~${currentPE}× toward the bull zone on a higher EPS base.`,
    },
    downsideChevronTip: "Kill-switch: full-year growth guide cut below ~70%, gross margin below 73%, or a hyperscaler in-sources connectivity = exit / reduce.",
    dislocEventName: "the Mar 2025 AI-sector-selloff trough",
    dislocLabel: "SINCE MAR 2025 TROUGH",
    bearPriceTip: (bearMid, bearLo, bearHi, peTrough, peBearHi) => `$${bearMid} is the midpoint of the bear case range ($${bearLo}–$${bearHi}). This assumes a Scorpio ramp slip or hyperscaler in-sourcing replaces the current beat-and-raise pattern, and the multiple compresses toward the ${peTrough}–${peBearHi}× trough zone on roughly flat-to-down EPS. The kill-switch is a growth guide cut below ~70% or GM below 73% — if it triggers, do not average down.`,
    killSwitchTip: "A kill-switch is a pre-committed exit rule you set BEFORE you own the position — when you are thinking clearly. If the full-year growth guide is cut below ~70%, gross margin compresses below 73%, or a hyperscaler in-sources connectivity, the thesis is broken: that's demand or competitive weakness, not timing. Do not average down into a broken thesis — the market is telling you something. No debate, no rationalisation. Exit.",
    killSwitchTipNote: "Growth guide cut below ~70%, GM below 73%, or hyperscaler in-sourcing. Any one. No debate.",
    killSwitchHtml: `<strong style="color:var(--title)">Full-year growth guide cut below ~70%, gross margin below 73%, or a hyperscaler in-sourcing connectivity</strong> → exit or reduce. No debate. Do not average down into a broken thesis.`,
    nextCheck: "Next check: Q2 FY2026 earnings (~Aug 11, 2026)",
    downsideFootnote: (px, peTrough, peBearHi) => `Bear case scenario: a Scorpio ramp slip or a hyperscaler in-sources connectivity. Assumes multiple compression toward ${peTrough}–${peBearHi}× on roughly flat-to-down EPS. Position loss is illustrative at $${px} entry.`,
    multipleSummary: (peNow, loPE, hiPE) => `At ~${peNow}× NTM P/E, ALAB sits near the low end of its normal range since IPO (${loPE}–${hiPE}×) — a real premium, but not the euphoric top of its own trading history. The market is paying for the Scorpio/Leo growth story to keep compounding.`,
    peBarTipSuffix: "ALAB has made no acquisitions, so unlike a serial-acquirer there's no amortization distortion to strip out of GAAP EPS — non-GAAP mainly adjusts for stock-based compensation, still large this early post-IPO.",
    deepValueZoneNote: "Historically cheap for this name. Rare — last seen briefly after the Mar 2025 AI-sector selloff. Exceptional entry if thesis is intact.",
    dislocPrecedent: (baseFloor) => `Historical precedent: the Jan–Mar 2025 AI-sector-selloff dislocation resolved within the 417-day base-reversion window once the fundamentals stayed intact. Base floor: $${baseFloor}.`,
    regretHtml: (currentPE) => `Q2 FY2026 revenue <strong style="color:#3fd07a">materially beats the $355–365M guide</strong> AND a second hyperscaler scale-up design win is disclosed. That would confirm the beat-and-raise pattern is accelerating, not peaking, re-rate the stock from ~${currentPE}× toward the bull zone, and close today's entry window.`,
    regretTip: "Charlie Munger's inversion: instead of asking 'why should I buy?', ask 'what would I have to believe happened, in hindsight, to wish I had bought more?' If Q2 beats the raised guide and a second hyperscaler scale-up win lands, today's entry window will close fast. You will not get a second chance at this multiple if the bull case materialises. This question is not about FOMO — it is about sizing correctly for your conviction.",
    chips: [
      { label: "KILL-SWITCH: GROWTH GUIDE < ~70% OR GM < 73% → EXIT", col: "#f1564b" },
      { label: "REGRET IF: Q2 BEATS + 2ND HYPERSCALER WIN", col: "#3fd07a" },
      { label: "NEXT CHECK: AUG 11, 2026 EARNINGS", col: "#2f6dff" },
    ],
    signalFootnote: (ntmEps) => `P/E uses non-GAAP NTM EPS $${ntmEps} — ALAB has made no acquisitions, so there's no amortization distortion to strip out, unlike fabless peers carrying large acquisition goodwill. Non-GAAP mainly adjusts for stock-based compensation, still large relative to revenue this early post-IPO.`,
  },

  // THE PAST tab
  past: {
    cardTips: {
      durability: (revCagrPct) => `Looks at Revenue, Gross Margin, and Free Cash Flow across ALAB's real fiscal-year history (FY2022–FY2025, pre-IPO through 2 years public). We want upward trends that hold, not spike-and-crash. Revenue compounded at roughly ${revCagrPct}% annually over this window — almost entirely organic (no acquisitions) — with gross margin holding a 69–76% band and FCF turning solidly positive as the company scaled past its March 2024 IPO.`,
      value: (latestROIC) => `ROIC isn't cleanly computable this early — ALAB's balance sheet is still mostly unspent IPO cash and pre-IPO equity was negative, so this panel uses Return on Equity (ROE) as the closest available substitute. ROE reached ${latestROIC}% in FY2025, up from a negative FY2024 (still absorbing post-IPO stock-based comp against a smaller revenue base) — a real, if young, value-creation signal.`,
      capex: (peakCapex, latestCapex, latestFCF) => `Capex as a % of revenue shows how much of every dollar gets reinvested before cash reaches shareholders. ALAB is a fabless, asset-light connectivity-chip designer — capex has stayed low and volatile (${peakCapex}% at its FY2024 peak, ${latestCapex}% in FY2025) even as FCF hit $${latestFCF}B — there's no foundry-style capex cycle here, spend is a rounding error next to R&D.`,
      mood: (evNow, evAvg) => `EV/EBITDA is only meaningful once EBITDA turns solidly positive — for ALAB that's really just FY2025 (EBITDA was negative or near breakeven in FY2022–FY2024, a young company still absorbing post-IPO costs). Current EV/EBITDA of ${evNow}× reflects that early-profitability stage; the "avg" this panel computes is distorted by three years of undefined multiples and should be read as directional only, not a true multi-year average.`,
    },
    stats: [
      { html: `Revenue <span style="color:#3fd07a;font-weight:700">$80M → $853M</span> (FY22→FY25)`, tipTitle: "Revenue (FY2022–FY2025)", tipBody: "Astera Labs grew annual revenue from $80M (FY2022, pre-IPO) to $853M (FY2025) — entirely organic, no acquisitions, driven by Scorpio/Leo/Aries design wins ramping at hyperscalers. Q1 FY2026 alone printed $308M." },
      { html: `FCF <span style="color:#3fd07a;font-weight:700">-$40M → $282M</span> (FY22→FY25)`, tipTitle: "Free Cash Flow (FY2022–FY2025)", tipBody: "FCF went from -$40M (FY2022, pre-IPO scaling costs) to a real $282M (FY2025) — the clearest evidence the connectivity ramp is converting to cash, not just revenue growth." },
      { html: `Price <span style="color:#3fd07a;font-weight:700">+1,011%</span> (Mar 2024 IPO → now)`, tipTitle: "Total price return since IPO", tipBody: "From the $36.00 IPO offer price (Mar 2024) to ~$400 today = roughly +1,011%. This is a ~2.25-year track record, not a decade — it includes a real -59% peak-to-trough drawdown (Dec 2024 → Mar 2025) that took 417 days to fully recover from." },
    ],
    verdictBody: "ALAB has compounded revenue at a rapid, almost entirely organic pace since well before its March 2024 IPO — no transformative acquisitions — with gross margin holding a 69–76% band and FCF turning solidly positive by FY2025. Capex intensity is genuinely low (fabless, asset-light model), and ROE (used here in place of ROIC, which isn't cleanly computable this early) reached 16% in FY2025 after a negative FY2024. The business has earned real conviction in under 2.5 years of public trading — the open question is whether that short track record has been tested by an actual downturn yet, and whether today's premium multiple already prices in a continuation of this pace.",
    banners: {
      durability: (revCagrPct, rev0, rev9, gmDelta, latestGM, fcf0, latestFCF) => `Revenue compounded at roughly ${revCagrPct}% annually from $${rev0}B (FY2022) to $${rev9}B (FY2025) — almost entirely organic, no acquisitions. Gross margin held a 69–76% band (currently ${latestGM}%), and FCF went from $${fcf0}B to $${latestFCF}B — a young but genuinely durable growth story, not a one-time spike, though it has under 2.5 years of public data behind it.`,
      value: (latestROIC) => `ROE of ${latestROIC}% (FY2025) is used here in place of ROIC, which isn't cleanly computable this early — ALAB's balance sheet is still mostly unspent IPO cash. FY2024's ROE was negative as post-IPO stock-based comp absorbed a smaller revenue base; FY2025's swing to positive double-digit ROE is a real inflection, not yet a multi-year track record.`,
      capex: (latestCapex, peakCapex, latestFCF, fy26Guide) => `Capex/revenue of ${latestCapex}% (FY2025) is well off its ${peakCapex}% FY2024 peak even as FCF hit $${latestFCF}B. ALAB is fabless — it doesn't carry a foundry-style capex cycle, so this ratio is naturally small and volatile quarter to quarter. The real spend to watch is R&D (35.7% of FY2025 revenue), not capex.`,
      mood: (evNow, evAvg) => `EV/EBITDA of ${evNow}× only became a meaningful metric in FY2025 — EBITDA was negative or near breakeven through FY2024. The price itself sits just off an all-time high (Jun 22, 2026, Nasdaq-100 inclusion), not recovering from a drawdown — a setup where the next move depends entirely on whether earnings catch up to the multiple, or the multiple gives some back first.`,
    },
    revAnnotationsHtml: `<span>FY2024: <span style="color:var(--tx3)">$396M</span> (post-IPO ramp)</span><span>FY2025: <span style="color:var(--tx3)">$853M</span> (Scorpio/Leo scale-up)</span>`,
    roicNote: "Green >15% · Amber 5–15% · Red <5% (ROE used in place of ROIC — see footnote)",
    fcfYieldNote: "FCF yield only meaningful post-IPO (FY2024 on) — pre-IPO years had no market cap to divide by.",
    capexAnnotationsHtml: `<span>FY2024: <span style="color:#f1564b">8.6%</span> (capacity build ahead of Scorpio ramp)</span><span>FY2025: <span style="color:#3fd07a">4.5%</span> (fabless — spend stays small as revenue scales)</span>`,
    footnotes: {
      durability: "ALAB's growth is organic — there is no acquisition playbook to adjust for. FY2022–FY2023 are pre-IPO years (from the Feb 2024 S-1's audited comparatives); FY2024 is the IPO year itself, with revenue growth of +115% carrying into FY2025 at a similar pace before Q1 FY2026 showed some deceleration (+93% YoY) off a much larger base. Gross margin dipped from ~77% (FY2022–FY2023) to ~74% (FY2024) as product mix shifted toward higher-volume Scorpio units, then recovered to ~76% in FY2025 and Q1 FY2026 — worth watching as a trend, not yet a concern.",
      value: "ROIC isn't shown here — ALAB's balance sheet is still mostly unspent IPO cash, which would make a true invested-capital return look artificially poor, and pre-IPO equity was negative in FY2022–FY2023 (making ROE undefined for those years too). ROE is used from FY2024 on as the best available substitute, with the limitation disclosed rather than papered over. The open question for THE FUTURE tab is whether today's ~120× multiple is paying for connectivity design wins that have already landed, or wins still to come.",
      capex: "Capex/revenue peaked at 8.6% in FY2024 (capacity investment ahead of the Scorpio ramp) and fell to 4.5% in FY2025 even as absolute revenue nearly doubled — proof the prior year's spend was monetized, not stranded. As a fabless designer, ALAB's real reinvestment shows up in R&D (35.7% of FY2025 revenue), not capex — a different capital-intensity profile than a foundry or hyperscaler.",
      mood: "The scenario bands on the other tabs use forward P/E, not EV/EBITDA — ALAB has no meaningful debt and, until FY2025, no meaningful EBITDA either, so EV/EBITDA is shown here purely for the one year it's a real signal. The multiple sits well above where a mature semiconductor company would trade, reflecting a hyper-growth premium — real re-rating risk if the growth rate decelerates faster than the market currently expects.",
    },
    priceChartTitle: "ALAB PRICE · MONTHLY SINCE IPO · MAR 2024–JUN 2026",
    priceChartSub: "$ per share · dashed lines = key events",
    priceNowTip: (px, isATH) => `$${px} — where ALAB trades today, ${isATH ? "the highest monthly close in this window" : "easing back slightly from the all-time intraday high of $439.66 hit Jun 22, 2026 on Nasdaq-100 inclusion"}. The chart shows rapid organic compounding since the March 2024 IPO, interrupted by one severe drawdown during the Jan–Mar 2025 AI-infrastructure-sector selloff.`,
    ddTip: (minDD) => `${minDD}% — the deepest drop from a prior all-time high since the March 2024 IPO. This occurred at the Mar 31, 2025 trough, after a sharp Jan 2025 AI-sector selloff. ALAB recovered and went on to make new highs, but it took 417 days to reclaim the $300 level. Drawdown charts help you visualize what holding through a bad period actually felt like.`,
    ddAnnotationsHtml: `<span>Max drawdown: <span style="color:#f1564b">−54.9%</span> (Mar 2025, AI-sector selloff)</span><span>Current: <span style="color:#3fd07a">0.0%</span> from this monthly series' high (the real intraday ATH of $439.66, Jun 22, was ~9% above today's close)</span>`,
  },
};
