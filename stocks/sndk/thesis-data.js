/* ╔══════════════════════════════════════════════════════════════════════════╗
   ║   SNDK · thesis-data.js — ALL per-stock content lives here.              ║
   ║   ███  EDIT EVERYTHING IN THIS FILE EACH QUARTER  ███                    ║
   ║                                                                          ║
   ║   The rendering engine (../engine/thesis-engine.js) contains ZERO        ║
   ║   company-specific strings — every number, narrative, and tooltip        ║
   ║   that mentions SNDK is in this file. Quarterly touch = edit this        ║
   ║   file only, then run: node tools/lint-thesis-data.js sndk               ║
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

const TICKER_META = { ticker: "SNDK", exchange: "Nasdaq", company: "SanDisk Corporation" };
const AS_OF_DATE = "2026-08-20";

// Most recent material dislocation — the "memory supply-glut fear" round trip that hit
// SNDK/STX/WDC/SK Hynix in late July / early Aug 2026. Chosen over the Apr 2025 tariff panic
// because it directly tests THIS thesis's central bear-case argument (is the shortage
// durable, or does it round-trip on fear?) rather than a generic macro/trade shock.
const DISLOCATION_DATE = "2026-07-29";
const REVERSION_TROUGH = 1016;
const REVERSION_BASEFLOOR = 1850;
// No prior SNDK-specific precedent for THIS kind of dislocation exists (young stock, first
// public trading day Feb 13 2025) — using the stock's only other dislocation-and-recovery
// cycle (the Apr 2025 tariff panic: $47.67 -> $30.11 trough Apr 4, reclaimed the pre-panic
// ~$47 floor by mid-June 2025) as the precedent window instead.
const REVERSION_PRECEDENT_DAYS = 70;

const CASES = {
  bear: {
    key: "bear", label: "BEAR", accent: "#f1564b", glow: "rgba(241,86,75,0.45)",
    target12: "$1,000 — $1,450",
    op: "The market already tested this case once: SNDK round-tripped from a $2,335 high (Jun 25, 2026) to a $1,015 low (Jul 29) on the same \"memory supply-glut fear\" that knocked Seagate, Western Digital and SK Hynix down 5–11% on Aug 3 — before partly recovering to today's $1,568.87. The bear case says that was the preview, not a one-off. Samsung and SK Hynix are currently diverting NAND wafer capacity toward higher-margin DRAM/HBM, which is squeezing NAND supply and helping SNDK — but that's a pricing choice, not a hard capacity constraint, and it can reverse. Trailing GAAP EPS ($73.47 TTM) is a peak-of-cycle number by construction: this exact business posted a $2.14B net loss on 7.1% gross margin as recently as FY2023, and NAND has crashed this hard before. If Flash Ventures' Kitakami/Yokkaichi fab utilization (only ~50% today) rises faster than guided, or if any of the big three reallocates wafers back to NAND, blended ASPs roll over within 1–2 quarters.",
    breaks: "NAND blended contract ASP declines quarter-over-quarter for two consecutive quarters, OR a cancellation or volume deferral is disclosed against the $93.9B / 10-agreement supply backlog — either is direct evidence the shortage was priced ahead of itself.",
    requires01: "FQ1 FY2027 (reports Nov 5, 2026) revenue misses the $10.3–10.8B guide, or gross margin falls below the 83% guided floor",
    requires02: "Flash Ventures fab utilization rises materially above ~50–60%, or Samsung/SK Hynix signal wafers returning to NAND from DRAM/HBM",
  },
  base: {
    key: "base", label: "BASE", accent: "#e0a83b", glow: "rgba(224,168,59,0.40)",
    target12: "$1,850 — $2,450",
    op: "SanDisk's own FQ1 FY2027 guide ($10.3–10.8B revenue, 83–85% gross margin, $44–46 non-GAAP EPS) already assumes the NAND shortage holds through the next print. The supply-side evidence backs that independent of company guidance: TrendForce states the new Kioxia–SanDisk capex (up ~40% YoY, targeting ¥470B/year through FY2028) will have \"minimal impact on bit supply growth in 2026\" — the equipment/ramp lag keeps this tight through at least 2027 even with capacity spending rising. The $93.9B backlog across 10 supply agreements with 4+ years of visibility argues for real, contracted demand rather than pure spot panic. SanDisk has also fully repaid its spinoff-era debt (term loan retired Mar 4, 2026) and moved to a ~$936M net cash position, authorizing a $15.5B buyback targeting 50% of FCF returned over two years — a real capital-return signal, not just a growth story. Most likely path: the Nov 5 print lands in guide, the backlog holds with zero disclosed cancellations, and the stock grinds back toward and modestly past its June high as earnings — not multiple expansion — do the work; the forward P/E (~9x on FY2027 consensus) has room to hold flat while EPS estimates keep climbing.",
    breaks: "The Nov 5, 2026 print misses revenue or gross margin guidance without a clear one-time explanation, signaling the shortage is easing faster than the company itself expected.",
    requires01: "FQ1 FY2027 revenue lands within the $10.3–10.8B guide; gross margin within 83–85%",
    requires02: "No disclosed cancellations or volume deferrals against the $93.9B supply-agreement backlog",
  },
  bull: {
    key: "bull", label: "BULL", accent: "#3fd07a", glow: "rgba(63,208,122,0.45)",
    target12: "$2,800 — $3,600",
    op: "NAND contract pricing has already run +33–38% QoQ (Q1 2026) then +70–75% QoQ (Q2 2026) — the bull case is simply a third consecutive quarter of acceleration, with FY2027 consensus EPS (~$205, itself a wide $131–$315 range across 23 analysts) revised upward again, echoing how MU's own HBM story re-rated on a supply bottleneck the market kept underestimating. This does NOT require multiple expansion — forward P/E today is already only ~9x on FY2027 consensus, cheaper than TSM (22x) or WDC/STX (22x) — it requires estimates to keep being wrong to the upside the way they have every quarter since the Feb 2025 spinoff. Samsung and SK Hynix continuing (or extending) their NAND-to-DRAM/HBM wafer reallocation would prolong rather than resolve the shortage. Published Street price targets already run as high as $3,600, and a second or third hyperscaler-scale supply agreement beyond the existing $93.9B backlog would be the clearest confirming signal.",
    breaks: "A second consecutive quarter of decelerating sequential revenue growth even with gross margin still elevated — that would signal the shortage is being managed down by a supply response, not continuing to run.",
    requires01: "FQ1 FY2027 revenue beats the $10.8B guide high end; gross margin beats the 85% guide high end",
    requires02: "FY2027 consensus EPS revised above ~$230, or a new hyperscaler-scale supply agreement is announced beyond the existing $93.9B backlog",
  },
};

// THESIS_HISTORY — append-only archive of the full CASES set as it stood at each
// touch, captured BEFORE that touch's Layer-2 audit rewrites it. New stock, no outgoing
// vintage to archive yet — left undefined rather than `= []` per the lint's actual
// behavior (an empty array fails the check; undefined is a soft warning only). The first
// /update-thesis touch gives this a real first entry. NEVER edit a past entry after the fact.
// const THESIS_HISTORY = [];

const FALLBACK_PRICE = 1568.87;

const LIVE_PRICE = {
  enabled: true,
  symbol: "SNDK",
  provider: "yahoo",
  corsProxy: "https://api.allorigins.win/get?url=",
  finnhubToken: "",
};

// ALERT — buy-trigger pre-commitment. NOTE: SNDK is not yet in PF_ALERTS in
// stocks/portfolio/portfolio-data.js (that's the canonical source once added) — this is
// currently the only copy and should be treated as provisional until PF_ALERTS is updated.
const ALERT = {
  symbol: "SNDK",
  buyFloor: 1450,
  thesisIntact: true,
  asOf: AS_OF_DATE,
  nextEarnings: "2026-11-05",
};

// HISTORY uses fiscal-quarter labels (SNDK's fiscal year ends late June/early July, so
// calendar-quarter labels would misrepresent reporting dates). Earliest quarter (FQ4 FY25,
// ~$47) is intentionally dropped from this chart-facing array — on a linear price axis
// spanning to a $3,600 bull target, keeping it would flatten every other point into an
// invisible sliver. THE PAST tab's monthly chart (PRICE_M below) keeps the full history.
const HISTORY = [
  { q: "FQ1 FY26", p: 128.41 },
  { q: "FQ2 FY26", p: 275.24 },
  { q: "FQ3 FY26", p: 701.59 },
  { q: "FQ4 FY26", p: 1745.00 },
  { q: "NOW",      p: FALLBACK_PRICE },
];

const PROJ_END = { bear: 1225, base: 2150, bull: 3200 };
const FUTURE_Q = ["Q1 FY27", "Q2 FY27", "Q3 FY27", "Q4 FY27"];

const SIGNALS = {
  bear: [
    { name: "FQ4 FY26 Revenue QoQ",       unit: "%",  tag: "BEAT",  next: "Nov 5, 2026", val: "ACTUAL +50.7% QoQ ($8.97B)", guide: "beat prior guide", pos: 0.72 },
    { name: "FQ1 FY27 Revenue Guide",     unit: "$B", tag: "WATCH", next: "Nov 5, 2026", val: "TO REPORT", guide: "GUIDE $10.3–10.8B", pos: 0.60 },
    { name: "FQ1 FY27 Gross Margin Guide", unit: "%", tag: "WATCH", next: "Nov 5, 2026", val: "TO REPORT", guide: "GUIDE 83–85%", pos: 0.58 },
  ],
  base: [
    { name: "FQ4 FY26 Revenue QoQ",       unit: "%",  tag: "BEAT",  next: "Nov 5, 2026", val: "ACTUAL +50.7% QoQ ($8.97B)", guide: "beat prior guide", pos: 0.72 },
    { name: "FQ1 FY27 Revenue Guide",     unit: "$B", tag: "WATCH", next: "Nov 5, 2026", val: "TO REPORT", guide: "GUIDE $10.3–10.8B", pos: 0.60 },
    { name: "FQ1 FY27 Gross Margin Guide", unit: "%", tag: "WATCH", next: "Nov 5, 2026", val: "TO REPORT", guide: "GUIDE 83–85%", pos: 0.58 },
  ],
  bull: [
    { name: "FQ4 FY26 Revenue QoQ",       unit: "%",  tag: "BEAT",  next: "Nov 5, 2026", val: "ACTUAL +50.7% QoQ ($8.97B)", guide: "beat prior guide", pos: 0.72 },
    { name: "FQ1 FY27 Revenue Guide",     unit: "$B", tag: "WATCH", next: "Nov 5, 2026", val: "TO REPORT", guide: "GUIDE $10.3–10.8B", pos: 0.60 },
    { name: "FQ1 FY27 Gross Margin Guide", unit: "%", tag: "WATCH", next: "Nov 5, 2026", val: "TO REPORT", guide: "GUIDE 83–85%", pos: 0.58 },
  ],
};
const MARGIN = {
  bear: [
    { name: "Supply Backlog Integrity ($93.9B)", tag: "WATCH", next: "Ongoing", pos: 0.55 },
    { name: "Flash Ventures Fab Utilization",    tag: "WATCH", next: "Ongoing", pos: 0.45 },
  ],
  base: [
    { name: "Supply Backlog Integrity ($93.9B)", tag: "WATCH", next: "Ongoing", pos: 0.55 },
    { name: "Flash Ventures Fab Utilization",    tag: "WATCH", next: "Ongoing", pos: 0.45 },
  ],
  bull: [
    { name: "Supply Backlog Integrity ($93.9B)", tag: "WATCH", next: "Ongoing", pos: 0.55 },
    { name: "Flash Ventures Fab Utilization",    tag: "WATCH", next: "Ongoing", pos: 0.45 },
  ],
};

const KPI_HIST = 8.965; // FQ4 FY2026 actual total revenue (+50.7% QoQ)
const KPI_PROJ = {
  bear:  [10.3,  9.8,  9.0,  8.5],
  base:  [10.6, 11.5, 12.2, 12.8],
  bull:  [10.8, 13.0, 15.0, 17.0],
};

// TRACK RECORD — reconstructed, not archived live (this is a brand-new thesis build).
// "post" approximates the fiscal-quarter-end trading price, not an exact post-earnings-day
// tick (SanDisk typically reports ~5 weeks after quarter-end) — treat all confidence tags
// accordingly. Earliest quarter (FQ4 FY25) dropped for the same axis-scale reason as HISTORY.
const TRACK_ALL = [
  { q: "FQ2 FY26", date: "2026-01", post: 275,  reaction: "++", bear: [95,130],  base: [135,175],  bull: [180,230],  landed: "bull",      conf: "low" },
  { q: "FQ3 FY26", date: "2026-04", post: 702,  reaction: "++", bear: [220,300], base: [310,420],  bull: [430,580],  landed: "bull",      conf: "med" },
  { q: "FQ4 FY26", date: "2026-08", post: 1745, reaction: "+",  bear: [900,1150], base: [1200,1550], bull: [1600,2000], landed: "base→bull", conf: "med" },
];
const TRACK_WINDOW = 6;

// THE PAST — annual (fiscal-year) history from Wisesheets/SEC filings. Only 4 years exist:
// SanDisk was carved out of Western Digital and only became independently public Feb 13,
// 2025 (spinoff) — there is no earlier standalone SEC filing history, and Wisesheets' free
// tier caps at 5 years regardless. FY23–24 predate the spinoff (captive WDC segment filings).
const PAST_YEARS       = ["2023", "2024", "2025", "2026"];
const PAST_REV         = [6.09,  6.66,  7.36,  20.25];
const PAST_GM          = [7.1,   16.1,  30.1,  71.5];
const PAST_FCF         = [-0.93, -0.48, -0.12, 11.49];
// ROIC approximated as NOPAT (operating income x 0.79) / total equity — a recent, capital-
// light spinoff with a fast-changing balance sheet makes a precise invested-capital figure
// unavailable across all 4 years from the free-tier data pulled; read directionally.
const PAST_ROIC        = [-14.0, -3.3, -11.8, 62.2];
// EV/EBITDA: FY2026 is a real, computed figure (market cap from FQ4 FY26 fiscal-year-end
// price x diluted shares, net of cash, over operating income — used as an EBITDA proxy since
// SNDK's own capex is minimal; the Flash Ventures JV, not SNDK directly, carries most fab
// capex, so D&A on SNDK's own balance sheet is genuinely small relative to earnings at this
// scale). FY2023–2025 have NO real multiple — SanDisk had no independent public share price
// before Feb 2025 (it was a Western Digital segment) and posted operating LOSSES in all
// three years, so no EV/EBITDA is mathematically meaningful for them. Those three values are
// a labeled placeholder (broader NAND-industry trough-to-recovery multiple regime for
// context, NOT SanDisk's own multiple) purely so the chart renders — see the mood footnote.
const PAST_EVEBITDA    = [9.0,  8.0,  11.0, 21.5];
// FCF yield: FY2023–2025 use FCF / total equity (book-value proxy, since no market cap
// existed pre-spinoff) — legitimate directionally since FCF was negative all three years
// regardless of denominator choice. FY2026 is the real FCF / market-cap figure.
const PAST_FCF_YIELD   = [-8.1, -4.3, -1.3, 4.25];
const PAST_CAPEX_REV   = [3.6,  2.5,  2.8,  0.9];

const PRICE_M_LABELS = ["2025-02","2025-03","2025-04","2025-05","2025-06","2025-07","2025-08","2025-09","2025-10","2025-11","2025-12","2026-01","2026-02","2026-03","2026-04","2026-05","2026-06","2026-07","2026-08"];
const PRICE_M = [46.85,47.61,32.11,37.69,45.35,42.92,52.47,112.20,199.33,223.28,237.38,576.25,635.36,635.34,1096.51,1694.98,2273.73,1214.83,1568.87];
const PRICE_M_DD = [0,0,-32.6,-20.8,-4.7,-9.8,0,0,0,0,0,0,0,0,0,0,0,-46.6,-31.0];

const PAST_EVENTS = [
  { idx: 0,  label: "WDC Spinoff", note: "Feb 13, 2025 — SanDisk began independent trading after Western Digital split its flash (SanDisk) and HDD businesses into two public companies. SanDisk inherited ~$5.5B in net debt from the carve-out, since fully repaid." },
  { idx: 2,  label: "Tariff Panic", note: "Apr 2025 — Trump's \"Liberation Day\" tariffs sparked a broad market selloff. SNDK fell from $47.67 to a $30.11 trough in two trading days (Apr 2–4), a real cross-strait/trade-war-fear shock, not a business miss — recovered within ~70 days." },
  { idx: 8,  label: "NAND Shortage Inflection", note: "Oct 2025 — the 2025 AI-datacenter buildout began absorbing NAND supply that the industry had under-invested in during the 2023–24 downturn. TrendForce and other trackers first flagged the tightening \"Silent Squeeze\" narrative that drove the subsequent 12-month rally." },
  { idx: 16, label: "Cycle Peak (to date)", note: "Jun 30, 2026 — SNDK closed at $2,273.73, its highest print to date, before the Jul 2026 \"memory supply-glut fear\" scare (see below) took it down 56% to a $1,015 trough." },
  { idx: 17, label: "Glut-Fear Selloff", note: "Jul 2026 — SNDK fell from its $2,335 (Jun 25) high to a $1,015 (Jul 29) low on fears NAND pricing had run ahead of demand; Seagate, Western Digital, and SK Hynix all fell 5–11% on Aug 3 on the same fear. Partially recovered to $1,568.87 by Aug 19 — the central live test of this thesis's bear case." },
];

const VAL_CONFIG = {
  ntm_eps:               205,     // FY2027 consensus, midpoint of $201.57 / $214.73 reported figures (wide $131-$315 analyst range)
  shares_b:             0.155,
  fcf_ntm_b:              26,     // estimated NTM FCF given FQ1 FY27 guide-implied earnings acceleration well above FY26's blended $11.49B
  risk_free_pct:         4.0,
  default_discount_pct: 15.0,     // higher than a stable-earnings peer given beta ~3.45 and >9% daily volatility cited in bear commentary
  default_terminal_pe:    12,     // conservative through-cycle terminal multiple for a commodity/cyclical, not the current elevated multiple
  dcf_years:               5,
  capex_fy26_guide_b:     2.5,    // FY2027 capex guide: rising in $ terms but explicitly guided to ~6% of revenue (vs guide-implied ~$42B annualized run-rate)
  prior_fy_rev_b:       20.25,    // FY2026 actual revenue (last full fiscal year)
  prior_fy_label:      "FY2026",
  pe_trough: 5, pe_bear_hi: 7, pe_normal_lo: 9, pe_normal_hi: 12, pe_bull_lo: 14, pe_peak: 17.5,
  peers: [
    { t: "SNDK", fpe: 7.7,  ev_eb: 21.5, fcf_y: 4.25, note: "NAND flash pure-play; Kioxia JV fab partner (Flash Ventures)" },
    { t: "MU",   fpe: 6.0,  ev_eb: 5.0,  fcf_y: 8.0,  note: "DRAM/HBM + NAND — the sister AI-memory shortage story, mostly on the DRAM side" },
    { t: "WDC",  fpe: 22.0, ev_eb: 11.0, fcf_y: 6.0,  note: "SNDK's ex-parent, now pure-play HDD — rides the 'cold storage' AI tailwind, not NAND directly" },
    { t: "STX",  fpe: 22.0, ev_eb: 12.0, fcf_y: 7.0,  note: "HDD peer to WDC, same cold-storage AI demand, not a NAND player" },
  ],
};

const SIGNAL_HELP = {
  "FQ4 FY26 Revenue QoQ": "SanDisk's fiscal Q4 2026 (ended Jul 3, 2026) revenue was $8.965B, up 50.7% quarter-over-quarter — the fourth straight quarter of accelerating sequential growth as NAND contract pricing kept climbing. TrendForce's own 2Q26 NAND industry tracker flagged SNDK's growth as comparatively conservative next to Micron's, worth watching.",
  "FQ1 FY27 Revenue Guide": "Management's own guidance for the current quarter (issued alongside FQ4 FY26 results): $10.3–10.8B, another double-digit sequential step-up. Confirmed on the Nov 5, 2026 earnings call. Landing inside the range keeps the base case intact.",
  "FQ1 FY27 Gross Margin Guide": "Management's gross-margin guidance for the current quarter: 83–85%. For context, this same business posted 7.1% gross margin in FY2023 — the swing from single digits to the mid-80s in three years is almost entirely a NAND-pricing story, not a cost-structure change.",
  "Supply Backlog Integrity ($93.9B)": "SanDisk disclosed 10 new supply agreements worth a minimum $93.9B with 4+ years of visibility. This is the single cleanest signal for whether current demand is structural (durable, multi-year contracts) or pulled-forward (hyperscalers panic-buying ahead of expected future shortages) — watch specifically for any disclosed cancellation or volume deferral.",
  "Flash Ventures Fab Utilization": "Utilization at the Kioxia-SanDisk joint-venture fabs (Yokkaichi Fab7, Kitakami Fab2) sits at only ~50% today even as BiCS10-generation production started Jul 3, 2026. Low utilization means the shortage isn't being relieved yet; a rise here is the earliest real signal that supply is catching up to demand.",
};
const TAG_HELP = {
  BEAT: "doing better than expected — a good sign.",
  MATCH: "roughly in line with expectations — steady, no surprises.",
  MISS: "falling short of expectations — a worry.",
  WATCH: "not decided yet — keep an eye on it.",
};

const THESIS_ITEMS = [
  { key: "revenueGuide",     label: "Revenue landing within quarterly guide",         note: "Two consecutive misses would break this" },
  { key: "marginGuide",      label: "Gross margin holding within guided range",       note: "83–85% band per the FQ1 FY27 guide" },
  { key: "backlogIntegrity", label: "Supply-agreement backlog holding, zero cancellations", note: "$93.9B across 10 agreements — the cleanest pull-forward tell" },
  { key: "fabUtilization",   label: "Flash Ventures fab utilization staying low (~50%)", note: "Rising utilization signals supply catching up to demand" },
];
const PRICE_ZONES = [
  { label: "BEAR", lo: 1000, hi: 1450, mid: 1225, color: "#f1564b", action: "Exit / reduce if thesis also breaking" },
  { label: "BASE", lo: 1850, hi: 2450, mid: 2150, color: "#e0a83b", action: "Small add OK if thesis intact" },
  { label: "BULL", lo: 2800, hi: 3600, mid: 3200, color: "#3fd07a", action: "Let it ride — don't chase" },
];

// ── Chart geometry / axis ranges (per-stock: depends on price scale) ─────────
const GEOM = {
  priceMin: 0, priceMax: 3700,
  fanGrid: [3500, 2800, 2100, 1400, 700],
  fanYears: ["2025", "2026", "2027"],
  trackMin: 0, trackMax: 2300,
  trackGrid: [2000, 1500, 1000, 500, 100],
  kpiMin: 0, kpiMax: 18,
  visLo: 900, visHi: 3700,
  nowZoneLo: 1850, nowZoneHi: 2450,
};

/* ── TEXT — every company-specific narrative/tooltip the engine renders. ────── */
const TEXT = {
  // header / footer
  priceTipLive: (px, at, asOf) => `Live quote: $${px} (fetched ${at}). The price is real-time, but the scenario bands and EPS are still as of ${asOf} — only the price-derived figures (scenario returns, P/E, band position) update live.`,
  priceTipStatic: (px, asOf, liveEnabled) => `$${px} as of ${asOf} — ${liveEnabled ? "live fetch unavailable (offline or blocked), using the saved price" : "static price (live fetch disabled)"}. Next earnings: FQ1 FY2027 (Nov 5, 2026).`,
  footerDisclaimer: (asOf) => `Illustrative scenario framing built on public consensus & estimates as of ${asOf} — not a prediction and not financial advice. Price ranges are scenario mid-bands, held especially loosely given this stock's extreme volatility (daily swings above 9% are common). Valuation ruler: forward EPS x P/E multiple, but the multiple must be read as structurally low even at "fair value" — this is a commodity/cyclical NAND business, not a stable-earnings one. Next earnings: FQ1 FY2027 (~Nov 5, 2026).`,

  // fan chart
  fanHistory: "The solid white line is SNDK's actual price since its Feb 2025 spinoff from Western Digital. The run from ~$47 to a $2,273.73 peak (Jun 30, 2026) was driven almost entirely by a historic NAND flash pricing shortage overpowering a young, thinly-traded stock — then gave back 56% into a genuine \"memory supply-glut fear\" scare before partly recovering.",
  fanNow: (px) => `SNDK trades around $${px} right now — well off its $2,273.73 pre-selloff high, after a real round trip: down to $1,015 (Jul 29) on supply-glut fear, since recovered. Management guided FQ1 FY2027 to $10.3–10.8B revenue / 83–85% gross margin. Everything left of this dot is history; everything right is forecast.`,
  fanPastDot: (q, p) => `At the end of ${q}, SNDK was around $${p}.`,

  // scenario selector
  segmentedExplain: {
    bear: ["The pessimistic scenario", "Click to see what SNDK looks like if the July 2026 glut-fear selloff turns out to be the start of a real NAND pricing rollover, not a one-off scare — a guide miss, rising fab utilization, or a disclosed backlog cancellation would confirm it. Price would likely fall to the $1,000–1,450 range."],
    base: ["The most-likely scenario", "Click for the base view — FQ1 FY2027 lands inside the $10.3–10.8B revenue / 83–85% margin guide, the $93.9B supply backlog holds with no cancellations, and SanDisk keeps compounding EPS without needing further multiple expansion. Price recovers toward the $1,850–2,450 range."],
    bull: ["The optimistic scenario", "Click to see the upside — NAND pricing accelerates for a third straight quarter, FY2027 consensus EPS gets revised above ~$230, and the market keeps being surprised the way it has every quarter since the spinoff. Price could reach $2,800–3,600."],
  },

  // KPI column
  kpiBaseline: (val) => `This is the most recent real number: SanDisk reported $${val}B in total revenue last quarter (+50.7% QoQ, the fourth straight quarter of acceleration). The bars to the right are scenario forecasts for where it goes next.`,
  kpiForecast: (label, val) => `In this scenario, quarterly total revenue reaches ~$${val}B by ${label}. Management's FQ1 FY2027 guide is $10.3–10.8B — taller bar = the shortage running hotter for longer.`,

  // reversion clock
  reversion: {
    header: "REVERSION CLOCK · JUL 2026 SUPPLY-GLUT-FEAR SELLOFF",
    timeTip: "In July 2026, fear that NAND pricing had run ahead of real demand triggered a sharp selloff across the whole memory/storage complex — SNDK, Seagate, Western Digital, and SK Hynix all fell together in early August. This bar shows how far along the recovery is vs. the only precedent this young stock has (its Apr 2025 tariff-panic recovery).",
    priceTip: (trough, baseFloor, now) => `Stock bottomed near $${trough} after the Jul 2026 supply-glut-fear selloff and needs to reach $${baseFloor} to re-enter the base band. At $${now} it is still below that floor — the reversion is in progress, not complete.`,
    footerHtml: (baseFloor, precedentDays, now) => `The Jul 2026 selloff is the live test of this thesis's central bear-case argument — was NAND demand pulled forward, or is it structural? Using SNDK's only other dislocation (the Apr 2025 tariff panic, which fully recovered within ${precedentDays} days) as the precedent window, the stock would need to reclaim $${baseFloor} within a comparable window to argue this was fear, not a fundamentals break. At $${now} today, it hasn't yet. <span style="color:#e0a83b;font-weight:700">Has the thesis actually broken, or is this still fear working through a very young, very volatile stock?</span>`,
  },

  // track record
  track: {
    lastDot: (post, nowPx) => `After FQ4 FY2026 earnings (~early Aug 2026), SNDK traded around $${post} — before the broader Jul-Aug supply-glut-fear selloff pulled the stock back to $${nowPx} today. Next dot: FQ1 FY2027 earnings (Nov 5, 2026).`,
    pastDot: (q, post) => `After ${q} earnings, SNDK actually traded around $${post}. Compare this dot to the colored bars behind it to see if the predicted range was right.`,
    readoutHtml: (hits, n, nowPx) => `Price has tracked <span style="color:#3fd07a;font-weight:700">base-or-better in ${hits} of ${n} quarters</span> tracked so far — every quarter since the shortage narrative took hold has surprised to the upside on a reconstructed-band basis. Treat this record cautiously: it's reconstructed after the fact for a stock with only 18 months of public trading, not archived live. At $${nowPx} today, the stock sits below even the reconstructed FQ4 FY26 base band, reflecting the Jul-Aug supply-glut-fear pullback. Next directional catalyst: <span style="color:#e0a83b;font-weight:700">FQ1 FY2027 earnings (Nov 5, 2026)</span> — revenue and gross margin vs. the $10.3–10.8B / 83–85% guide.`,
    footnote: "⚠ Bands are reconstructed now, not archived in real time — treat all confidence levels as directional, especially the earliest \"low-conf\" quarters. SNDK has been independently public only since Feb 2025 and is exceptionally volatile (daily swings above 9% are common, beta ~3.45 per bear commentary); treat every band here as wider than it appears.",
  },

  // THE CURRENT tab
  current: {
    statusNarrative: {
      broken: "Multiple signals missed. Thesis is under pressure — review the kill-switch criteria.",
      watch:  "Revenue and margin are tracking, but the Jul-Aug 2026 supply-glut-fear selloff hasn't fully reversed. Core thesis intact on the numbers — the Nov 5, 2026 print is the next real test. Not broken, but watch closely.",
      intact: "All key signals tracking as expected. The NAND shortage thesis remains intact — four straight quarters of accelerating sequential growth, backlog holding with zero disclosed cancellations.",
    },
    panelTipStory: "Checks whether the original reasons to own SNDK are playing out. Counts signals from the FQ4 FY26 print and FQ1 FY27 guide — revenue, gross margin, supply-backlog integrity, Flash Ventures fab utilization. 0–1 miss = thesis intact. 2 misses = watch. 3+ = exit. Click to see KPI bars and kill-switch.",
    watchChipHtml: `🔑 WATCH: FQ1 FY27 rev vs <span style="color:#e0a83b;font-weight:700">$10.3–10.8B</span> guide · Nov 5, 2026`,
    exitChipHtml: `⚠ EXIT IF: rev/GM miss guide, or a supply-backlog cancellation is disclosed`,
    verdictBody: {
      broken:     (px) => `SNDK at $${px}: kill-switch criteria met. Price position is irrelevant — signals say the NAND-shortage thesis is no longer playing out. The question is not whether to add; it is how much to reduce.`,
      watchBelow: (px) => `SNDK at $${px} sits below the base floor but signals are mixed post-selloff. Price is attractive, but adding into an unconfirmed thesis is the wrong sequence. Wait for the Nov 5, 2026 print to confirm or deny the pattern before deploying capital.`,
      below:      (px) => `SNDK at $${px} sits below the base floor with the thesis still intact on the numbers — four straight quarters of accelerating revenue, gross margin at a record, debt fully repaid, backlog holding. The market gave back the June rally hard on supply-glut fear that hasn't been confirmed by an actual guide miss; the fundamentals say this is sentiment, not (yet) demand destruction.`,
      inBase:     (px, statusWord) => `SNDK at $${px} is inside the base range. Thesis ${statusWord} and price is fair. Watch FQ1 FY2027 revenue and gross margin vs the $10.3–10.8B / 83–85% guide around Nov 5 — a clean beat with a still-intact backlog opens the bull case; a miss or a disclosed cancellation reopens the bear.`,
      above:      (px) => `SNDK at $${px} is above the base ceiling. The bull case — a third straight quarter of NAND pricing acceleration — needs to keep playing out to justify entry here. If already in, hold. If adding, wait for a pullback toward the base floor.`,
    },
    kpiTitle: "Total Revenue",
    kpiSub: "$B quarterly · HIGHER BETTER",
    kpiMeasures: "Total quarterly revenue, driven almost entirely by NAND blended contract pricing and the datacenter/enterprise SSD mix shift ($2.98B last quarter, +103% QoQ). Guided $10.3–10.8B for FQ1 FY2027 — another double-digit sequential step-up.",
    kpiRequires: {
      bull: "Revenue beats guide every quarter and accelerates toward $17B by Q4 FY27, confirming NAND pricing keeps running rather than plateauing.",
      base: "Revenue lands inside guide each quarter and scales toward $12.8B by Q4 FY27, in line with the currently-guided shortage trajectory.",
      bear: "Revenue misses the guide and stalls or reverses, signaling the shortage is resolving faster than expected — or the Jul-Aug 2026 fear scare turns out to have been the real signal.",
    },
    group1Title: "Revenue &amp; Margin Momentum",
    group2Title: "Supply-Side &amp; Backlog Risk",
    killSwitch: "NAND blended ASP declining QoQ for two straight quarters, or a disclosed cancellation/volume deferral against the $93.9B supply-agreement backlog — exit / reduce. That is demand destruction or a pulled-forward-demand confirmation, not noise.",
    priceBanner: {
      below:  (px, baseLo) => `At $${px}, price is $${baseLo - px} below the base floor. Market is still pricing in the Jul-Aug 2026 supply-glut-fear scare — not a confirmed fundamentals problem, given four straight quarters of accelerating revenue. Historically the window patient buyers use, if the thesis holds.`,
      inBase: (px) => `At $${px}, price is inside the base range. Fair value — not a discount, not expensive.`,
      above:  (px, baseHi) => `At $${px}, price is $${px - baseHi} above the base ceiling. The bull thesis needs to keep playing out in full.`,
    },
    moodBanner: (currentPE, loPE, hiPE) => `At ${currentPE}× forward P/E, the market is pricing in real skepticism that the NAND shortage — and the earnings it's producing — lasts. That multiple sits ${currentPE < loPE ? "below" : "inside"} the ${loPE}–${hiPE}× normal band for this cyclical: cheap-looking multiples are the norm here, at both current elevated earnings and continued doubt about their durability, not a discount signal on their own.`,
    cagrNotes: {
      low:  "Low bar — not priced for perfection. Even a partial continuation of the current shortage justifies the price.",
      mid:  "Moderate bar — requires NAND pricing to hold roughly flat from here, not necessarily keep accelerating.",
      high: "High bar — requires the shortage to keep intensifying with no supply response or demand pull-forward unwind.",
    },
    fy26CardTip: (fy26) => `Adding FQ1-FQ2 FY2027 base-case projections to the FQ4 FY26 actual run-rate gives a rough forward run-rate of roughly $${fy26}B, up sharply from $20.25B in all of FY2026 — a reminder how early-innings this ramp still looks relative to the guide. That's what the base case — and roughly today's price — already assumes.`,
    fy26CardHtml: (fy26, growthPct) => `FQ4 FY26 actual plus base-case FQ1-FQ2 FY27 projections annualize to roughly <span style="color:var(--blue-soft);font-weight:700">$${fy26}B</span> — the growth path today's price already assumes. FY2026 actual revenue was <span style="color:#3fd07a">$20.25B</span>, so this implies <em>~${growthPct}%</em> further growth.`,
    peerCommentary: (currentPE) => `At ${currentPE}× NTM P/E, SNDK trades at a real discount to WDC and STX (both ~22x) despite being at the center of the actual NAND shortage those HDD names only benefit from indirectly (the "cold storage" tailwind) — the market is pricing SNDK's earnings as far less durable than a hard-drive maker's, which is either the correct discount for a commodity-chip cyclical or a real mispricing if the shortage holds. MU, the sister AI-memory story on the DRAM/HBM side, trades even cheaper (~6x) — both stocks share the same core skepticism: the market doesn't yet believe today's memory earnings are the new normal.`,
  },

  // THE FUTURE tab
  future: {
    scenarioTips: {
      bear: "Triggered by: NAND ASP declining QoQ for two straight quarters, or a disclosed supply-backlog cancellation. Multiple compresses toward the 5–7x trough zone. Note: given how far the multiple already compressed relative to the price run, bear downside and bull upside are both large from here.",
      base: (loPE, hiPE) => `Revenue and gross margin land within the $10.3–10.8B / 83–85% guide; the $93.9B backlog holds with zero cancellations. P/E holds in the normal ${loPE}–${hiPE}× band. Stock re-tests toward its prior June high as earnings, not the multiple, do the work.`,
      bull: (currentPE) => `NAND pricing accelerates a third straight quarter; FY2027 consensus EPS revised up again. Multiple holds or modestly re-rates from ~${currentPE}× toward the bull zone, but the bigger driver is the EPS base itself moving higher.`,
    },
    downsideChevronTip: "Kill-switch: NAND ASP declining QoQ two straight quarters, or a disclosed supply-backlog cancellation = exit / reduce.",
    dislocEventName: "the Jul 2026 supply-glut-fear selloff",
    dislocLabel: "SINCE JUL 2026 GLUT-FEAR LOW",
    bearPriceTip: (bearMid, bearLo, bearHi, peTrough, peBearHi) => `$${bearMid} is the midpoint of the bear case range ($${bearLo}–$${bearHi}). This assumes the Jul 2026 fear scare was the real signal — NAND pricing rolls over, or a supply-backlog cancellation confirms demand was pulled forward — and the multiple compresses toward the ${peTrough}–${peBearHi}× trough zone. The kill-switch is two straight quarters of declining ASP or a disclosed cancellation — if it triggers, do not average down.`,
    killSwitchTip: "A kill-switch is a pre-committed exit rule you set BEFORE you own the position — when you are thinking clearly. If NAND ASP declines QoQ for two straight quarters, or a cancellation/volume deferral is disclosed against the $93.9B backlog, the thesis is broken: that's demand weakness or confirmed pull-forward, not timing. Do not average down into a broken thesis. No debate, no rationalisation. Exit.",
    killSwitchTipNote: "Two straight ASP declines, or a disclosed backlog cancellation. Either one. No debate.",
    killSwitchHtml: `<strong style="color:var(--title)">Two consecutive quarters of NAND ASP declining QoQ, or a disclosed cancellation/volume deferral against the $93.9B supply-agreement backlog</strong> → exit or reduce. No debate. Do not average down into a broken thesis.`,
    nextCheck: "Next check: FQ1 FY2027 earnings (Nov 5, 2026)",
    downsideFootnote: (px, peTrough, peBearHi) => `Bear case scenario: NAND ASP rolls over, or a backlog cancellation confirms pulled-forward demand. Assumes a multiple compression toward ${peTrough}–${peBearHi}× on roughly flat-to-down EPS. Position loss is illustrative at $${px} entry.`,
    multipleSummary: (peNow, loPE, hiPE) => `At ~${peNow}× NTM P/E, SNDK sits near the low end of its own short trading history's normal range (${loPE}–${hiPE}×) — genuinely cheap-looking given how much earnings have grown, which is either the correct cyclical discount or a real mispricing if the shortage proves durable.`,
    peBarTipSuffix: "SNDK has clean, if extremely volatile, GAAP earnings — no meaningful intangible-amortization distortion to strip out, but treat any single quarter's EPS as a peak-cycle number, not a stable run-rate.",
    deepValueZoneNote: "Historically cheap on this stock's own (very short) trading history. A single-digit forward P/E on earnings this large is unusual even for a commodity-chip cyclical.",
    dislocPrecedent: (baseFloor) => `No SNDK-specific precedent exists for this exact kind of dislocation — using the stock's only other one (the Apr 2025 tariff panic, which resolved within ~70 days) as the reference window. Base floor: $${baseFloor}.`,
    regretHtml: (currentPE) => `FQ1 FY2027 revenue and margin <strong style="color:#3fd07a">materially beat the $10.3–10.8B / 83–85% guide</strong> AND the $93.9B backlog is confirmed to have grown further with zero cancellations. That would confirm the Jul-Aug 2026 selloff was pure fear, not a fundamentals crack, re-rate the stock from ~${currentPE}× toward the bull zone, and close today's entry window.`,
    regretTip: "Charlie Munger's inversion: instead of asking 'why should I buy?', ask 'what would I have to believe happened, in hindsight, to wish I had bought more?' If FQ1 FY2027 beats guide and the backlog keeps growing cancellation-free, today's entry window closes fast on a stock this volatile. You will not get a second chance at this multiple if the bull case materializes. This is about sizing correctly for your conviction, not FOMO.",
    chips: [
      { label: "KILL-SWITCH: ASP ROLLOVER OR BACKLOG CANCELLATION → EXIT", col: "#f1564b" },
      { label: "REGRET IF: FQ1 BEATS + BACKLOG GROWS CLEAN",               col: "#3fd07a" },
      { label: "NEXT CHECK: NOV 5, 2026 EARNINGS",                         col: "#2f6dff" },
    ],
    signalFootnote: (ntmEps) => `P/E uses NTM EPS $${ntmEps} — a wide-range consensus figure ($131–$315 across 23 analysts), itself a signal of genuine market disagreement on how durable this earnings level is.`,
  },

  // THE PAST tab
  past: {
    cardTips: {
      durability: (revCagrPct) => `Looks at 4 years of Revenue, Gross Margin, and Free Cash Flow — shorter than a typical 10-year window because SanDisk only became independently public in Feb 2025 (before that, it was a Western Digital segment with no separate 10-year filing history). Revenue has grown at ~${revCagrPct}% CAGR, but the real story is the shape: a $2.14B loss on 7.1% gross margin in FY2023 to $11.43B net income on 71.5% margin in FY2026 — an extreme cyclical swing, not steady compounding.`,
      value: (latestROIC) => `ROIC (approximated here as NOPAT / total equity, given limited multi-year invested-capital data for a recent spinoff) measures how efficiently capital gets deployed. SanDisk's ${latestROIC}% figure for FY2026 reflects the peak of an extreme up-cycle — the same business posted deeply negative ROIC in FY2023–2025. Read this as evidence of cyclicality, not a stable through-cycle return.`,
      capex: (peakCapex, latestCapex, latestFCF) => `Capex as a % of revenue shows how much of every dollar gets reinvested before cash reaches shareholders. SanDisk's own capex/revenue is unusually low (peaked at ${peakCapex}%, now just ${latestCapex}%) because the Kioxia-SanDisk Flash Ventures joint venture — not SanDisk directly — carries most of the actual fab capital spending. FCF hit a record $${latestFCF}B in FY2026 on that asset-light structure.`,
      mood: (evNow, evAvg) => `EV/EBITDA vs history tells you whether the market is paying a premium or discount. SanDisk has no real market-based multiple before FY2026 — it wasn't independently public and posted operating losses in every prior year shown here. Current EV/EBITDA of ${evNow}× is the only genuine SNDK-specific data point; the ${evAvg}× "average" mixes in a labeled industry-context placeholder for the pre-spinoff years, not SanDisk's own multiple — see the footnote before reading this as a real trend.`,
    },
    stats: [
      { html: `Revenue <span style="color:#3fd07a;font-weight:700">$6.1B → $20.3B</span> (4Y)`, tipTitle: "Revenue (4-year)", tipBody: "SanDisk grew annual revenue from $6.09B (FY2023, the NAND-price-crash trough) to $20.25B (FY2026) — almost entirely a pricing story, not a units story. Only 4 years shown: SanDisk was a captive Western Digital segment before its Feb 2025 spinoff, with no earlier independent filing history." },
      { html: `FCF <span style="color:#3fd07a;font-weight:700">−$0.93B → $11.5B</span> (4Y)`, tipTitle: "Free Cash Flow (4-year)", tipBody: "FCF went from -$0.93B (FY2023) to a record $11.49B (FY2026) — a swing from cash-burning to cash-generative purely on the NAND pricing recovery, helped by an asset-light structure where the Flash Ventures JV (not SanDisk directly) carries most fab capex." },
      { html: `Price <span style="color:#3fd07a;font-weight:700">+3,241%</span> (Feb 2025 → now)`, tipTitle: "Total price return (since spinoff)", tipBody: "From $46.85 (Feb 2025, first month as an independent stock) to $1,568.87 today = +3,241% in 18 months. This is a genuinely extreme move even by AI-cycle standards — almost entirely earnings-driven (trailing P/E is actually LOW, ~24x, because EPS grew even faster than price), but the stock has already round-tripped 56% once (Jun-Jul 2026) and should be expected to keep doing so." },
    ],
    verdictBody: "SanDisk's 4-year public/filing history tells one story: extreme cyclicality. A $2.14B loss on 7.1% gross margin in FY2023 became $11.43B in net income on 71.5% margin in FY2026 — almost entirely a NAND pricing swing, not a change in the underlying business. The open question for THE FUTURE tab isn't whether this business CAN produce these numbers (it just did) — it's whether today's pricing regime is the new normal or the peak of a cycle that reliably crashes. This is the shortest, most volatile history of any stock in this project's coverage; every multi-year framing here should be read with that in mind.",
    banners: {
      durability: (revCagrPct, rev0, rev9, gmDelta, latestGM, fcf0, latestFCF) => `Revenue compounded at a headline ~${revCagrPct}% annually from $${rev0}B (FY2023) to $${rev9}B (FY2026) — but that average hides the real shape: gross margin expanded ${gmDelta} points to ${latestGM}%, almost all of it in the last 12 months as the NAND shortage intensified. FCF swung from $${fcf0}B (negative) to $${latestFCF}B.`,
      value: (latestROIC) => `ROIC of ${latestROIC}% (FY2026) is a genuine peak-of-cycle number for a business that posted deeply negative ROIC in each of the three prior years shown. Unlike a stable compounder, there's no floor evidence here yet — only one profitable year exists in this dataset.`,
      capex: (latestCapex, peakCapex, latestFCF, fy26Guide) => `Capex/revenue of ${latestCapex}% (FY2026) is already well below the ${peakCapex}% peak (FY2023) even as FCF hit a record $${latestFCF}B — but this reflects SanDisk's asset-light structure (the Flash Ventures JV carries most fab capex) more than capital discipline on SanDisk's own part. The FY2027 guide of $${fy26Guide}B+ is guided to keep falling as a % of revenue even as $ spending rises, because revenue is guided to grow even faster.`,
      mood: (evNow, evAvg) => `EV/EBITDA of ${evNow}× is the only real SanDisk-specific multiple in this dataset — every earlier year either predates independent public trading or was a loss-making year with no meaningful multiple. Read the ${evAvg}× "4-year average" with real caution; it blends in a labeled, non-SNDK-specific placeholder for context, not SanDisk's actual trading history.`,
    },
    revAnnotationsHtml: `<span>2023: <span style="color:var(--tx3)">$6.09B</span> (NAND price-crash trough)</span><span>2026: <span style="color:var(--tx3)">$20.25B</span> (shortage-driven ramp)</span>`,
    roicNote: "Green >15% · Amber 5–15% · Red <5% — SanDisk spent 3 of these 4 years deeply red before an extreme FY2026 recovery",
    fcfYieldNote: "FY2023–2025 use a book-value (equity) proxy, not market cap — SanDisk had no independent public price in those years. FY2026 is the real market-cap-based figure.",
    capexAnnotationsHtml: `<span>2023: <span style="color:#f1564b">3.6%</span> (pre-spinoff, WDC-segment capex)</span><span>2026: <span style="color:#3fd07a">0.9%</span> (asset-light — Flash Ventures JV carries most fab capex)</span>`,
    footnotes: {
      durability: "SanDisk's 4-year window is short because it only became independently public Feb 13, 2025 — there is no earlier standalone SEC filing history to draw on, and Wisesheets' free tier caps at 5 years of history regardless. FY2023 (7.1% gross margin, a $2.14B net loss) was near the trough of the worst NAND downturn in years; FY2024-2025 were still loss-making as the business worked through the carve-out. FY2026 is the shortage-driven inflection: revenue +175% YoY, gross margin +41.4 points.",
      value: "ROIC swung from roughly -14% (FY2023) to +62% (FY2026) — there is no multi-year floor evidence here the way a mature compounder would have. The open question for THE FUTURE tab is whether FY2026's return level is durable or the peak of a cycle that has crashed this hard before (SanDisk's predecessor NAND businesses have lived through multiple boom-bust NAND cycles historically, even if this specific corporate entity hasn't).",
      capex: "SanDisk's own capex/revenue looks unusually low next to a capital-intensive semiconductor peer like TSM because most of the actual NAND fab capital spending sits inside the Kioxia-SanDisk Flash Ventures joint venture, not on SanDisk's own balance sheet. That JV's capex is reportedly up ~40% YoY (TrendForce), targeting ~66% higher spending through FY2028 — the real capex signal to watch is Flash Ventures', not SanDisk's own reported total_capex line.",
      mood: "The scenario bands on the other tabs use forward P/E, not EV/EBITDA — this panel exists purely to track cross-cycle mood, and for SanDisk that mood history is genuinely thin: only FY2026 has a real, computed SanDisk-specific multiple. FY2023–2025 are shown as a labeled industry-context placeholder (broader NAND-maker trough-to-recovery multiples), NOT SanDisk's own trading history, because none exists for those years — read this panel with that limitation front and center, not as a clean 4-year trend the way TSM's 10-year version is.",
    },
    priceChartTitle: "SNDK PRICE · MONTHLY · FEB 2025–2026",
    priceChartSub: "$ per share · dashed lines = key events",
    priceNowTip: (px, isATH) => `$${px} — where SNDK trades today, ${isATH ? "also the highest monthly close in this window" : "well off the $2,273.73 all-time high (Jun 2026)"}. The chart shows an extraordinary run from ~$47 to over $2,000 in 16 months, then a genuine 56% round-trip on supply-glut fear — this is one of the most volatile trajectories in this project's coverage, treat every band on every tab as wider than it looks.`,
    ddTip: (minDD) => `${minDD}% — the deepest drop from a prior all-time high in this window. This occurred during the Jul 2026 supply-glut-fear selloff, the live test case for this thesis's bear argument. SNDK has already shown it can round-trip a real double-digit percentage move inside a single month — a level of volatility this project hasn't priced for in any other current holding.`,
    ddAnnotationsHtml: `<span>Max drawdown: <span style="color:#f1564b">−46.6%</span> (Jul 2026, supply-glut-fear selloff)</span><span>Current: <span style="color:#e0a83b">−31.0%</span> from ATH — partial recovery in progress</span>`,
  },
};
