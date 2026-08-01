/* ╔══════════════════════════════════════════════════════════════════════════╗
   ║   CEG · thesis-data.js — ALL per-stock content lives here.               ║
   ║   ███  EDIT EVERYTHING IN THIS FILE EACH QUARTER  ███                    ║
   ║                                                                          ║
   ║   The rendering engine (../engine/thesis-engine.js) contains ZERO        ║
   ║   company-specific strings — every number, narrative, and tooltip        ║
   ║   that mentions CEG is in this file. Quarterly touch = edit this         ║
   ║   file only, then run: node tools/lint-thesis-data.js CEG                ║
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

const TICKER_META = { ticker: "CEG", exchange: "NASDAQ", company: "Constellation Energy Corp." };
const AS_OF_DATE = "2026-08-01";

// Most recent material dislocation (Apr 2025 "Liberation Day" tariff panic — CEG fell with
// the broader market even though nothing about the nuclear fleet or PJM auction economics
// changed that week).
const DISLOCATION_DATE = "2025-04-04";
const REVERSION_TROUGH = 171;
const REVERSION_BASEFLOOR = 315;
const REVERSION_PRECEDENT_DAYS = 73;

const CASES = {
  bear: {
    key: "bear", label: "BEAR", accent: "#f1564b", glow: "rgba(241,86,75,0.45)",
    target12: "$185 — $220",
    op: "CEG trades around $263, down ~36% from its October 2025 all-time high of $412, even after Q1 2026 beat on adjusted operating EPS ($2.74, +28% YoY) and management reaffirmed the $11.00–12.00 full-year guide — a genuine 'sell the news' pattern. The bear case here is a policy/pricing story, not a demand story: PJM's 2028/29 auction cleared at the FERC-imposed $325/MW-day price cap (CEG cleared 18,875 MW, ~$2.2B of locked-in revenue), and Citi's July 1 target cut to $297 came explicitly after a PJM reliability-reform meeting — the risk is that FERC-mandated market reforms, faster new-generation interconnection, or demand-response expansion pull the NEXT auction's clearing price back toward pre-scarcity norms before today's cleared capacity even rolls off. Layered on top: the $22B Calpine acquisition (closed Jan 7, 2026) adds real integration risk and near-term FCF drag (Q1 2026 FCF was −$850M), and the Nov 2024 FERC pushback on the Amazon/Talen co-location structure is a live reminder that regulators can slow or reshape bilateral hyperscaler-PPA deals specifically, separate from the capacity-auction leg.",
    breaks: "A future PJM Base Residual Auction clears meaningfully below the $325/MW-day cap (capacity scarcity easing), FERC/PJM adopts a reform that structurally caps or discounts nuclear capacity payments, or the Calpine integration misses its FCF/synergy targets for two straight quarters.",
    requires01: "2026 adjusted operating EPS lands below the $11.00 guide floor, or FCF stays negative into H2 2026 on Calpine integration costs",
    requires02: "A future PJM capacity auction clears well below $325/MW-day, or a hyperscaler PPA gets renegotiated/cancelled following regulatory pushback (watch, not yet triggered)",
  },
  base: {
    key: "base", label: "BASE", accent: "#e0a83b", glow: "rgba(224,168,59,0.40)",
    target12: "$315 — $385",
    op: "Constellation owns the largest US nuclear fleet — 15,700 MW of it already cleared PJM's 2028/29 capacity auction at the $325/MW-day cap, locking in roughly $2.2B of 2028/29 capacity revenue years in advance, stacked on top of the 2026/27 auction it also cleared. Q1 2026 adjusted operating EPS of $2.74 beat estimates and management reaffirmed full-year guidance of $11.00–12.00 (2025 actual: $9.39, itself a beat) even as GAAP EPS stays noisy — mark-to-market hedge accounting swung GAAP diluted EPS from $11.89 in 2024 to $7.40 in 2025, which is exactly why the adjusted operating number, not GAAP, is what the company and Street underwrite. The Calpine acquisition (closed Jan 7, 2026, ~$22B, +23GW concentrated in Texas ERCOT and California) extends the platform beyond single-region PJM exposure, but near-term FCF is absorbing the integration cost (Q1 2026 FCF −$850M) — the 2026–27 combined FCF guide is still $8.4B. Base case: capacity-auction economics and adjusted operating EPS both continue on their guided trajectory (>20%/yr), the multiple normalizes from today's compressed ~21x back toward its own 23–28x recent-history range, and the average analyst target ($358–380, Moderate Buy) proves directionally right even if the market takes longer to agree than it did after Q1.",
    breaks: "2026 adjusted operating EPS misses the $11.00–12.00 guide, or the Calpine integration produces a sustained FCF or synergy miss beyond one quarter.",
    requires01: "2026 adjusted operating EPS lands within $11.00–12.00; the next PJM Base Residual Auction (2029/30, expected ~mid-2027) clears at scarcity pricing again",
    requires02: "Calpine integration synergies track plan; no hyperscaler PPA renegotiation or cancellation",
  },
  bull: {
    key: "bull", label: "BULL", accent: "#3fd07a", glow: "rgba(63,208,122,0.45)",
    target12: "$460 — $520",
    op: "If the AI/data-center power-demand story keeps outrunning new supply — PJM's own 2028/29 auction came in 6,831 MW short of its reliability target even at the $325 cap — Constellation's next capacity auction (2029/30, expected ~mid-2027) could clear at or near the cap again, its data-center PPA book (Microsoft's 20-year, $16B Three Mile Island/Crane restart deal; the Meta Clinton uprate deal) keeps adding bilateral megawatts at fixed, often above-market prices, and Calpine's 23GW starts contributing synergies ahead of schedule rather than just closing costs. Nuclear uprates (Braidwood/Byron +135MW, Clinton +30MW, both substantially complete by 2029) add incremental megawatts to an already-sold-out fleet at near-zero marginal capex versus new-build. In this world, 2027 adjusted operating EPS pushes toward $15+ (>30% growth off the 2026 midpoint), the market re-rates the stock from today's discount back toward the 30x+ multiple it briefly touched near its October 2025 high, and today's post-selloff entry point looks, in hindsight, like the market pricing in a policy risk that never actually materialized.",
    breaks: "The next PJM capacity auction clears meaningfully below cap, signaling demand growth was overestimated, or 2027 EPS growth decelerates below the low-20s% guided range.",
    requires01: "2027 adjusted operating EPS beats a $14.50+ pace; Calpine synergies land ahead of the original plan",
    requires02: "A future PJM auction clears at or near cap again; nuclear uprates complete on or ahead of the 2029 schedule",
  },
};

// THESIS_HISTORY — append-only archive of the full CASES set as it stood at each
// touch, captured BEFORE that touch's Layer-2 audit rewrites it. NEVER edit a past
// entry after the fact. Brand-new build (2026-08-01) — nothing to archive yet, so the
// global is intentionally omitted rather than declared as an empty array; the first
// /update-thesis touch on CEG should add `const THESIS_HISTORY = [...]` and push the
// outgoing CASES vintage there before rewriting them.

const FALLBACK_PRICE = 262.75;

const LIVE_PRICE = {
  enabled: true,
  symbol: "CEG",
  provider: "yahoo",
  corsProxy: "https://api.allorigins.win/get?url=",
  finnhubToken: "",
};

// ALERT — buy-trigger pre-commitment. Canonical source is PF_ALERTS.CEG in
// stocks/portfolio/portfolio-data.js; this copy is a FALLBACK for offline opens.
const ALERT = {
  symbol: "CEG",
  buyFloor: 315,
  thesisIntact: true,
  asOf: AS_OF_DATE,
  nextEarnings: "2026-08-06",
};

const HISTORY = [
  { q: "Q1 2025", p: 201.63 },
  { q: "Q2 2025", p: 322.76 },
  { q: "Q3 2025", p: 329.07 },
  { q: "Q4 2025", p: 353.27 },
  { q: "Q1 2026", p: 279.25 },
  { q: "Q2 2026", p: 248.37 },
  { q: "NOW",     p: FALLBACK_PRICE },
];

const PROJ_END = { bear: 203, base: 350, bull: 490 };
const FUTURE_Q = ["Q3 2026", "Q4 2026", "Q1 2027", "Q2 2027"];

const SIGNALS = {
  bear: [
    { name: "Q1 2026 Adj. Operating EPS", unit: "$",       tag: "BEAT",  next: "Aug 6, 2026",  val: "ACTUAL $2.74 (+28% YoY)", guide: "beat ~$2.40 est.", pos: 0.68 },
    { name: "2026 Full-Year EPS Guidance", unit: "$",      tag: "WATCH", next: "Aug 6, 2026",  val: "TO REPORT", guide: "GUIDE $11.00–$12.00 (affirmed)", pos: 0.55 },
    { name: "PJM 2028/29 Capacity Auction", unit: "$/MW-day", tag: "BEAT", next: "~mid-2027 (2029/30 auction)", val: "CLEARED $325 (cap) · 18,875 MW", guide: "vs. lower clears in prior cycles", pos: 0.72 },
  ],
  base: [
    { name: "Q1 2026 Adj. Operating EPS", unit: "$",       tag: "BEAT",  next: "Aug 6, 2026",  val: "ACTUAL $2.74 (+28% YoY)", guide: "beat ~$2.40 est.", pos: 0.68 },
    { name: "2026 Full-Year EPS Guidance", unit: "$",      tag: "WATCH", next: "Aug 6, 2026",  val: "TO REPORT", guide: "GUIDE $11.00–$12.00 (affirmed)", pos: 0.55 },
    { name: "PJM 2028/29 Capacity Auction", unit: "$/MW-day", tag: "BEAT", next: "~mid-2027 (2029/30 auction)", val: "CLEARED $325 (cap) · 18,875 MW", guide: "vs. lower clears in prior cycles", pos: 0.72 },
  ],
  bull: [
    { name: "Q1 2026 Adj. Operating EPS", unit: "$",       tag: "BEAT",  next: "Aug 6, 2026",  val: "ACTUAL $2.74 (+28% YoY)", guide: "beat ~$2.40 est.", pos: 0.68 },
    { name: "2026 Full-Year EPS Guidance", unit: "$",      tag: "WATCH", next: "Aug 6, 2026",  val: "TO REPORT", guide: "GUIDE $11.00–$12.00 (affirmed)", pos: 0.55 },
    { name: "PJM 2028/29 Capacity Auction", unit: "$/MW-day", tag: "BEAT", next: "~mid-2027 (2029/30 auction)", val: "CLEARED $325 (cap) · 18,875 MW", guide: "vs. lower clears in prior cycles", pos: 0.72 },
  ],
};
const MARGIN = {
  bear: [
    { name: "Calpine Integration / FCF Trajectory", tag: "WATCH", next: "Aug 6, 2026", pos: 0.42 },
    { name: "PJM / FERC Policy Risk",                tag: "WATCH", next: "Ongoing",     pos: 0.38 },
  ],
  base: [
    { name: "Calpine Integration / FCF Trajectory", tag: "WATCH", next: "Aug 6, 2026", pos: 0.42 },
    { name: "PJM / FERC Policy Risk",                tag: "WATCH", next: "Ongoing",     pos: 0.38 },
  ],
  bull: [
    { name: "Calpine Integration / FCF Trajectory", tag: "WATCH", next: "Aug 6, 2026", pos: 0.42 },
    { name: "PJM / FERC Policy Risk",                tag: "WATCH", next: "Ongoing",     pos: 0.38 },
  ],
};

// KPI tracked here is quarterly ADJUSTED OPERATING EPS ($/share) — the metric management
// guides on and the Street underwrites (NOT the noisy GAAP EPS; see TEXT.current notes).
const KPI_HIST = 2.74;  // Q1 2026 actual (+28% YoY)
const KPI_PROJ = {
  bear:  [2.90, 2.86, 2.70, 3.05],
  base:  [3.20, 3.32, 3.05, 3.55],
  bull:  [3.45, 3.61, 3.35, 3.95],
};

// TRACK RECORD — append newest to end; dashboard keeps last TRACK_WINDOW.
// First-time build: bands are RECONSTRUCTED now from each date's contemporary NTM-EPS ×
// multiple regime, not archived live — older quarters marked lower-confidence per CLAUDE.md.
const TRACK_ALL = [
  { q: "Q4 2024", date: "2025-02", post: 264, reaction: "-",  bear: [225,265], base: [265,315], bull: [315,365], landed: "bear→base", conf: "low"  },
  { q: "Q1 2025", date: "2025-05", post: 274, reaction: "+",  bear: [225,265], base: [265,315], bull: [315,365], landed: "base",      conf: "low"  },
  { q: "Q2 2025", date: "2025-08", post: 336, reaction: "++", bear: [245,285], base: [285,335], bull: [335,385], landed: "base→bull", conf: "low"  },
  { q: "Q3 2025", date: "2025-11", post: 358, reaction: "+",  bear: [265,305], base: [305,360], bull: [360,415], landed: "base",      conf: "med"  },
  { q: "Q4 2025", date: "2026-02", post: 313, reaction: "--", bear: [275,315], base: [315,370], bull: [370,425], landed: "bear→base", conf: "med"  },
  { q: "Q1 2026", date: "2026-05", post: 300, reaction: "+",  bear: [185,220], base: [315,385], bull: [460,520], landed: "bear→base", conf: "high" },
];
const TRACK_WINDOW = 6;

// THE PAST — annual history. CEG spun off from Exelon Feb 2022, so there is no
// standalone public price/financial history before 2022 — the window here is capped
// at 4 fiscal years by the company's own age, not by a Wisesheets data limit (a
// different reason for the same shape of cap GOOGL hit for its own migration).
const PAST_YEARS       = ["2022","2023","2024","2025"];
const PAST_REV         = [24.4,  24.9,  23.6,  25.5];
// CEG does not report a GAAP "gross profit" line item (utilities/IPPs present operating
// revenues then fuel/purchased-power and O&M expenses without a gross-margin subtotal) —
// GAAP OPERATING MARGIN is substituted here as the closest available pricing-power/mix
// proxy. See TEXT.past.footnotes.durability for the full explanation.
const PAST_GM          = [2.0,   6.5,   18.5,  12.1];
const PAST_FCF          = [-4.042, -7.723, -5.029, 1.288];
const PAST_ROIC        = [-0.7,  6.4,   14.3,  8.4];
const PAST_EVEBITDA    = [16.0,  8.6,   10.1,  17.8];
const PAST_FCF_YIELD   = [-14.6, -21.0, -7.3,  1.2];
const PAST_CAPEX_REV   = [6.9,   9.7,   10.9,  11.6];
const PRICE_M_LABELS = ["2022-02","2022-03","2022-04","2022-05","2022-06","2022-07","2022-08","2022-09","2022-10","2022-11","2022-12","2023-01","2023-02","2023-03","2023-04","2023-05","2023-06","2023-07","2023-08","2023-09","2023-10","2023-11","2023-12","2024-01","2024-02","2024-03","2024-04","2024-05","2024-06","2024-07","2024-08","2024-09","2024-10","2024-11","2024-12","2025-01","2025-02","2025-03","2025-04","2025-05","2025-06","2025-07","2025-08","2025-09","2025-10","2025-11","2025-12","2026-01","2026-02","2026-03","2026-04","2026-05","2026-06","2026-07"];
const PRICE_M = [45.98,56.25,59.21,62.08,57.26,66.1,81.59,83.19,94.54,96.12,86.21,85.36,74.89,78.5,77.4,84.02,91.55,96.65,104.16,109.08,112.92,121.04,116.89,122.0,168.45,184.85,185.94,217.25,200.27,189.8,196.7,260.02,262.96,256.56,223.71,299.98,250.55,201.63,223.44,306.15,322.76,347.84,307.98,329.07,377.0,364.36,353.27,280.68,329.88,279.25,313.0,287.75,248.37,262.75];
const PRICE_M_DD = [0.0,0.0,0.0,0.0,-7.8,0.0,0.0,0.0,0.0,0.0,-10.3,-11.2,-22.1,-18.3,-19.5,-12.6,-4.8,0.0,0.0,0.0,0.0,0.0,-3.4,0.0,0.0,0.0,0.0,0.0,-7.8,-12.6,-9.5,0.0,0.0,-2.4,-14.9,0.0,-16.5,-32.8,-25.5,0.0,0.0,0.0,-11.5,-5.4,0.0,-3.4,-6.3,-25.5,-12.5,-25.9,-17.0,-23.7,-34.1,-30.3];
const PAST_EVENTS = [
  { idx: 24, label: "AI-Power Narrative Ignites", note: "Feb 27-28, 2024 — a two-day +17% move as Big Tech capex guides and the first wave of \"AI needs baseload power\" coverage put nuclear-fleet owners like CEG on the map as structural beneficiaries, well before any specific deal was announced." },
  { idx: 31, label: "Microsoft TMI Restart Deal", note: "Sep 20, 2024 — Constellation announced a 20-year, $16B PPA with Microsoft to restart Three Mile Island Unit 1 (835 MW), rebranded the Crane Clean Energy Center, targeting mid-2027 return to service. The stock jumped +22% in a single day — the clearest single data point that a hyperscaler would pay up directly for dedicated nuclear baseload." },
  { idx: 33, label: "FERC Co-Location Pushback", note: "Nov 1, 2024 — FERC rejected/remanded the Amazon-Talen Susquehanna co-location interconnection structure, spooking the whole \"behind-the-meter nuclear-to-data-center\" deal architecture across CEG/VST/TLN alike. A reminder that regulators can slow or reshape these bilateral deals even when the underlying demand story is intact." },
  { idx: 35, label: "DeepSeek AI-Efficiency Panic", note: "Jan 27, 2025 — the DeepSeek model-efficiency shock hit AI-capex-linked names broadly (Nvidia -17%) on fears that cheaper AI training/inference would need less power. CEG fell -21% in a day. In hindsight, hyperscaler capex and PPA signings both kept accelerating through the rest of 2025." },
  { idx: 38, label: "Tariff Panic", note: "Apr 2025 — Trump's \"Liberation Day\" tariffs triggered a broad market selloff; CEG fell to a monthly-close trough of $201.63 (intraday low $170.96 on Apr 4) alongside the wider market, not on any CEG-specific news. Fundamentals (auction clears, PPA book) were untouched." },
  { idx: 53, label: "PJM Reform-Risk Repricing", note: "Jul 2026 — Citi cut its price target to $297 (from $348) explicitly citing a PJM reliability-reform meeting, and the stock fell to a fresh 52-week low of $228.63 on Jul 1 despite a Q1 2026 beat and reaffirmed guidance three months earlier. This is the live dislocation this thesis is underwriting today." },
];

const VAL_CONFIG = {
  ntm_eps:               12.25,
  shares_b:               0.357,
  fcf_ntm_b:              3.0,
  risk_free_pct:          4.69,
  default_discount_pct:   8.5,
  default_terminal_pe:    22,
  dcf_years:               5,
  capex_fy26_guide_b:      5.5,     // ~$3.9B disclosed 2026 "growth capex" plus base maintenance capex run-rate (Q1 2026 total capex $1.27B annualized)
  prior_fy_rev_b:        25.5,      // 2025 actual revenue
  prior_fy_label:       "2025",
  pe_trough: 16, pe_bear_hi: 20, pe_normal_lo: 21, pe_normal_hi: 28, pe_bull_lo: 30, pe_peak: 38,
  peers: [
    { t: "CEG", fpe: 21.5, ev_eb: 17.8, fcf_y: 1.2, note: "Largest US nuclear fleet + PJM capacity scarcity" },
    { t: "VST", fpe: 15.9, ev_eb: 10.0, fcf_y: 4.5, note: "Deregulated gas/nuclear/solar generator, ERCOT-heavy" },
    { t: "TLN", fpe: 14.8, ev_eb: 10.7, fcf_y: 3.0, note: "Susquehanna nuclear, direct Amazon co-location deal" },
    { t: "NRG", fpe: 17.2, ev_eb: 15.9, fcf_y: 3.0, note: "Retail + gas generation, smaller nuclear exposure" },
    { t: "DUK", fpe: 19.1, ev_eb: 10.8, fcf_y: 3.8, note: "Regulated utility comp — broader, lower-beta anchor" },
  ],
};

const SIGNAL_HELP = {
  "Q1 2026 Adj. Operating EPS": "Adjusted operating EPS — the non-GAAP number CEG's own guidance and analyst consensus are built on, since GAAP EPS gets swung around by mark-to-market hedge accounting on the generation book. Q1 2026 came in at $2.74, up 28% YoY from $2.14, beating the roughly $2.40 estimate — a clean start to the year even before Q2 (reporting Aug 6, 2026).",
  "2026 Full-Year EPS Guidance": "Management's full-year adjusted operating EPS guide, reaffirmed on the Q1 2026 call: $11.00–12.00, up from 2025's actual $9.39 — implying >20% growth, in line with the multi-year CAGR target through 2029. Landing inside this range keeps the base case intact; a cut would be the first guidance miss since the Calpine deal closed.",
  "PJM 2028/29 Capacity Auction": "PJM's capacity auctions are the direct mechanism by which CEG gets paid for owning scarce, already-built generation — no new construction required. The 2028/29 auction cleared at the FERC-approved $325/MW-day price cap for the whole PJM footprint, with CEG alone clearing 18,875 MW (15,700 MW nuclear + 3,175 MW fossil/other) for an estimated ~$2.2B of 2028/29 capacity-year revenue. This is locked in years in advance — the single biggest chokepoint metric in this thesis.",
  "Calpine Integration / FCF Trajectory": "CEG closed its ~$22B acquisition of Calpine (Texas/California gas, geothermal, +23GW) on Jan 7, 2026. Integration costs are a real near-term FCF drag (Q1 2026 FCF was −$850M) against a 2026–27 combined FCF guide of $8.4B. Watch whether FCF inflects positive through 2026 as promised, or integration costs run longer than guided.",
  "PJM / FERC Policy Risk": "Shorthand for regulatory/market-design risk: FERC capacity-market reform proposals, demand-response expansion, faster new-generation interconnection, or a repeat of the Nov 2024 co-location pushback that hit the whole sector. This doesn't show up in any single quarterly number until a rule actually changes — it is the single biggest kill-switch risk for the bull case, and the explicit reason Citi cited for its July 2026 target cut.",
};
const TAG_HELP = {
  BEAT: "doing better than expected — a good sign.",
  MATCH: "roughly in line with expectations — steady, no surprises.",
  MISS: "falling short of expectations — a worry.",
  WATCH: "not decided yet — keep an eye on it.",
};

const THESIS_ITEMS = [
  { key: "epsGuide",         label: "2026 adjusted operating EPS landing within $11.00–$12.00 guide", note: "A miss would be the first guidance miss since the Calpine deal closed" },
  { key: "capacityAuction",  label: "PJM capacity auctions continuing to clear at scarcity pricing",   note: "2026/27 AND 2028/29 auctions have both already cleared near/at the price cap" },
  { key: "calpineIntegration", label: "Calpine integration hitting synergy/FCF targets",                note: "2026–27 combined FCF guide is $8.4B; Q1 2026 alone was still −$850M" },
  { key: "pjmPolicyRisk",    label: "No adverse PJM/FERC capacity-market reform",                       note: "July 2026's target cut was driven explicitly by a PJM reliability-reform meeting, not by fundamentals" },
];
const PRICE_ZONES = [
  { label: "BEAR",    lo: 185, hi: 220, mid: 203, color: "#f1564b", action: "Exit / reduce if thesis also breaking" },
  { label: "BASE",    lo: 315, hi: 385, mid: 350, color: "#e0a83b", action: "Small add OK if thesis intact" },
  { label: "BULL",    lo: 460, hi: 520, mid: 490, color: "#3fd07a", action: "Let it ride — don't chase" },
];

// ── Chart geometry / axis ranges (per-stock: depends on price scale) ─────────
const GEOM = {
  priceMin: 140, priceMax: 560,
  fanGrid: [500, 420, 340, 260, 180],
  fanYears: ["2025", "2026", "2027"],
  trackMin: 150, trackMax: 550,
  trackGrid: [500, 400, 300, 200, 100],
  kpiMin: 2.0, kpiMax: 4.2,
  visLo: 180, visHi: 520,
  nowZoneLo: 240, nowZoneHi: 290,
};

/* ── TEXT — every company-specific narrative/tooltip the engine renders. ──────
   Values are strings, HTML strings (rendered with dangerouslySetInnerHTML), or
   template functions the engine calls with computed values. If it mentions the
   company, a quarter, a guide number, or an event, it belongs HERE, not in the
   engine — that rule is what makes the engine safely reusable across stocks. */
const TEXT = {
  // header / footer
  priceTipLive: (px, at, asOf) => `Live quote: $${px} (fetched ${at}). The price is real-time, but the scenario bands and EPS are still as of ${asOf} — only the price-derived figures (scenario returns, P/E, band position) update live.`,
  priceTipStatic: (px, asOf, liveEnabled) => `$${px} as of ${asOf} — ${liveEnabled ? "live fetch unavailable (offline or blocked), using the saved price" : "static price (live fetch disabled)"}. Next earnings: Q2 2026 (Aug 6, 2026).`,
  footerDisclaimer: (asOf) => `Illustrative scenario framing built on public consensus & estimates as of ${asOf} — not a prediction and not financial advice. Price ranges are scenario mid-bands; KPI markers are positional, not literal. Valuation ruler: forward adjusted operating EPS × P/E multiple (NOT GAAP EPS — see THE CURRENT tab for why). Data inputs will move with every print. Next earnings: Q2 2026 (Aug 6, 2026).`,

  // fan chart
  fanHistory: "The solid white line is CEG's actual price since Q1 2025. The run to a $412 all-time high (Oct 2025) was driven by PJM capacity-auction scarcity pricing and a wave of hyperscaler nuclear PPAs; the pullback since reflects a market re-pricing PJM/FERC policy risk, not a change in the underlying fundamentals.",
  fanNow: (px) => `CEG trades around $${px} right now — down from a $412 pre-selloff high despite Q1 2026 beating on adjusted operating EPS ($2.74, +28% YoY) and management reaffirming the $11.00–12.00 full-year guide. Everything left of this dot is history; everything right is forecast.`,
  fanPastDot: (q, p) => `At the end of ${q}, CEG was around $${p}.`,

  // scenario selector
  segmentedExplain: {
    bear: ["The pessimistic scenario", "Click to see what CEG looks like if PJM/FERC policy risk actually bites — a future capacity auction clears well below the $325 cap, or a capacity-market reform discounts nuclear payments, reversing the scarcity-pricing story this thesis depends on. Price would likely fall to the $185–220 range."],
    base: ["The most-likely scenario", "Click for the base view — 2026 adjusted operating EPS lands inside the reaffirmed $11.00–12.00 guide, the Calpine integration tracks its FCF/synergy plan, and the market gradually re-rates the multiple back toward CEG's own 23–28x recent-history range. Price recovers toward the $315–385 range."],
    bull: ["The optimistic scenario", "Click to see the upside — the next PJM auction clears at cap again, hyperscaler PPA signings keep accelerating, Calpine synergies land ahead of plan, and 2027 EPS growth pushes past 30%. Price could reach $460–520."],
  },

  // KPI column
  kpiBaseline: (val) => `This is the most recent real number: CEG reported $${val} in adjusted operating EPS last quarter (Q1 2026, +28% YoY, beating the ~$2.40 estimate). The bars to the right are scenario forecasts for where it goes next.`,
  kpiForecast: (label, val) => `In this scenario, quarterly adjusted operating EPS reaches ~$${val} by ${label}. Full-year 2026 guide is $11.00–12.00 — taller bar = faster growth toward the top of (or above) that range.`,

  // reversion clock
  reversion: {
    header: "REVERSION CLOCK · APR 2025 TARIFF DISLOCATION",
    timeTip: "In April 2025, the 'Liberation Day' tariff announcement triggered a broad market selloff. CEG fell to an intraday low near $171 alongside the wider market — nothing about the PJM auction economics or the nuclear fleet changed that week. This bar shows how far along the recovery cycle was vs. how long it actually took to reclaim the base floor.",
    priceTip: (trough, baseFloor, now) => `Stock bottomed near $${trough} after the April 2025 tariff-panic selloff and needed to reach $${baseFloor} to re-enter the (new) base band. At $${now} today, the stock is itself mid-way through a SECOND, more recent drawdown — this time driven by PJM/FERC policy-risk repricing, not a broad macro shock.`,
    footerHtml: (baseFloor, precedentDays, now) => `The April 2025 tariff panic was a macro/policy shock unrelated to CEG's own fundamentals — the stock reclaimed the $${baseFloor} base floor within ${precedentDays} days once the broad-market fear passed. The CURRENT dislocation (Jul 2026, driven by PJM reliability-reform anxiety after Citi's target cut) is a different animal — a policy-specific worry, not a macro one — so the same clock doesn't automatically apply. At $${now} today: <span style="color:#e0a83b;font-weight:700">has the thesis actually broken, or is this fear pricing in a reform that hasn't happened?</span>`,
  },

  // track record
  track: {
    lastDot: (post, nowPx) => `After Q1 2026 earnings (May 11), CEG traded around $${post} — inside the gap between the OLD bear ceiling and base floor, even though adjusted operating EPS beat and full-year guidance was reaffirmed. Price sits at $${nowPx} today, after a further slide driven by PJM/FERC policy-risk headlines (Citi's July 1 target cut) rather than any new fundamental miss. Next dot: Q2 2026 earnings (Aug 6, 2026).`,
    pastDot: (q, post) => `After ${q} earnings, CEG actually traded around $${post}. Compare this dot to the colored bars behind it to see if the predicted range was right.`,
    readoutHtml: (hits, n, nowPx) => `Price has tracked <span style="color:#3fd07a;font-weight:700">base-or-better in ${hits} of ${n} quarters</span> shown here. Q1 2026 is the most interesting recent case: adjusted operating EPS beat ($2.74 vs. ~$2.40 est.), full-year guidance was reaffirmed at $11.00–12.00 — yet the stock has kept sliding since, landing at $${nowPx} on PJM/FERC policy-risk fear rather than a fundamentals problem. Next directional catalyst: <span style="color:#e0a83b;font-weight:700">Q2 2026 earnings (Aug 6, 2026)</span> — watch adjusted operating EPS vs. the reaffirmed guide and any management commentary on PJM reform risk.`,
    footnote: "⚠ Bands are reconstructed now, anchored to each date's forward-EPS & multiple regime — not archived in real time. Treat levels as directional, especially the older/\"low-conf\" quarters. CEG has only traded publicly since Feb 2022 (Exelon spin-off), so this track record is shorter than a mature stock's; treat all bands as wide given genuine PJM/FERC policy-risk tail exposure.",
  },

  // THE CURRENT tab
  current: {
    statusNarrative: {
      broken: "Multiple signals missed. Thesis is under pressure — review the kill-switch criteria.",
      watch:  "EPS beat but PJM/FERC policy risk or Calpine integration signals are flashing amber. Core thesis tracking — the Aug 6, 2026 print is the next real test. Not broken, but watch closely.",
      intact: "All key signals tracking as expected. The nuclear-fleet-as-chokepoint and PJM capacity-scarcity thesis remains intact — Q1 2026 beat on adjusted operating EPS and guidance was reaffirmed, even though the stock itself has kept sliding on policy-risk fear.",
    },
    panelTipStory: "Checks whether the original reasons to own CEG are playing out. Counts signals from the Q1 2026 print, the reaffirmed full-year guide, and the PJM 2028/29 auction clear. 0–1 miss = thesis intact. 2 misses = watch. 3+ = exit. Click to see KPI bars and kill-switch.",
    watchChipHtml: `🔑 WATCH: 2026 adj. op. EPS vs <span style="color:#e0a83b;font-weight:700">$11.00–$12.00</span> guide · Aug 6, 2026`,
    exitChipHtml: `⚠ EXIT IF: EPS misses guide <span style="font-weight:700">2 straight quarters</span>, or a future PJM auction clears well below cap`,
    verdictBody: {
      broken:     (px) => `CEG at $${px}: kill-switch criteria met. Price position is irrelevant — signals say the PJM capacity-scarcity / nuclear-chokepoint thesis is no longer playing out. The question is not whether to add; it is how much to reduce.`,
      watchBelow: (px) => `CEG at $${px} sits below the base floor but signals are mixed. Price is attractive, but adding into a weakening thesis is the wrong sequence. Wait for the Aug 6, 2026 print to confirm or deny the pattern before deploying capital.`,
      below:      (px) => `CEG at $${px} sits below the base floor with the thesis intact — Q1 2026 adjusted operating EPS beat, full-year guidance was reaffirmed, and both the 2026/27 AND 2028/29 PJM capacity auctions have already cleared near or at the price cap. The market has repriced anyway on PJM/FERC reform anxiety (Citi's July target cut cited a policy meeting, not a number miss); the fundamentals so far say this is a policy-risk discount, not a demand problem.`,
      inBase:     (px, statusWord) => `CEG at $${px} is inside the base range. Thesis ${statusWord} and price is fair. Watch the Aug 6, 2026 print for adjusted operating EPS vs. the reaffirmed guide, and any management commentary on PJM/FERC reform risk — a clean beat with no new policy news reopens the bull case; a guide cut or a confirmed reform reopens the bear case.`,
      above:      (px) => `CEG at $${px} is above the base ceiling. The bull case — the next PJM auction clearing at cap again, plus accelerating hyperscaler PPA signings — needs to play out to justify entry at this level. If already in, hold. If adding, wait for a pullback toward the base floor.`,
    },
    kpiTitle: "Adjusted Operating EPS",
    kpiSub: "$/share quarterly · HIGHER BETTER · NOT GAAP EPS",
    kpiMeasures: "Adjusted (non-GAAP) operating EPS — the metric CEG's own guidance and Street consensus are built on, since GAAP EPS is distorted by mark-to-market hedge accounting on the generation and trading book (GAAP diluted EPS swung from $11.89 in 2024 to $7.40 in 2025 on hedge accounting alone, while adjusted operating EPS grew from $8.something to $9.39 over the same period). Full-year 2026 guide is $11.00–12.00, reaffirmed on the Q1 call.",
    kpiRequires: {
      bull: "Adjusted operating EPS beats guide and 2027 growth accelerates past 30%, confirming Calpine synergies and hyperscaler PPA signings are landing ahead of plan.",
      base: "Adjusted operating EPS lands inside the $11.00–12.00 guide each period and 2027 growth continues near the guided >20%/yr pace.",
      bear: "Adjusted operating EPS misses the guide floor, or a future PJM auction clears well below cap, signaling the capacity-scarcity story was priced too aggressively.",
    },
    group1Title: "Earnings &amp; Capacity-Auction Momentum",
    group2Title: "Integration &amp; Policy Risk",
    killSwitch: "Two straight quarters of adjusted operating EPS missing guide, or a future PJM capacity auction clearing well below the $325/MW-day cap, or a FERC/PJM reform that structurally discounts nuclear capacity payments — exit / reduce. That is demand destruction or policy risk, not noise.",
    priceBanner: {
      below:  (px, baseLo) => `At $${px}, price is $${baseLo - px} below the base floor. Market is pricing in PJM/FERC policy risk that hasn't actually materialized yet — not a fundamentals problem, given the Q1 beat and reaffirmed guide. Historically the window patient buyers use, though the policy risk here is real and worth taking seriously, not dismissed as pure noise.`,
      inBase: (px) => `At $${px}, price is inside the base range. Fair value — not a discount, not expensive.`,
      above:  (px, baseHi) => `At $${px}, price is $${px - baseHi} above the base ceiling. The bull thesis needs to play out in full.`,
    },
    moodBanner: (currentPE, loPE, hiPE) => `At ${currentPE}× forward P/E, the market is pricing in real doubt about whether the PJM capacity-scarcity and hyperscaler-PPA growth story continues on schedule — the multiple sits BELOW its own recent-history fair-value band (${loPE}–${hiPE}×), a real compression from the ~35x it briefly touched near the October 2025 high, even though nothing about the cleared 2026/27 or 2028/29 auctions has changed.`,
    cagrNotes: {
      low:  "Low bar — not priced for perfection. Even a guide-floor outcome roughly justifies the current price.",
      mid:  "Moderate bar — requires the $11.00–12.00 guide to hold and the Calpine integration to track its FCF plan.",
      high: "High bar — requires near-flawless execution: guide beat, Calpine synergies ahead of plan, and no new PJM/FERC policy setback.",
    },
    fy26CardTip: (fy26) => `Q1 2026 actual revenue ($11.1B, +64% YoY on the Calpine consolidation) plus base-case Q2–Q4 2026 projections give a full-year run rate of roughly $${fy26}B, up from $25.5B in 2025. Note this is almost entirely a Calpine step-change, not organic growth — CEG's own standalone revenue was roughly flat 2022–2025 (see THE PAST tab). That step-change is what the base case — and roughly today's price — already assumes.`,
    fy26CardHtml: (fy26, growthPct) => `Q1 2026 actual plus base-case Q2–Q4 2026 projections sum to roughly <span style="color:var(--blue-soft);font-weight:700">$${fy26}B</span> for full-year 2026 — the growth path today's price already assumes. 2025 actual revenue was <span style="color:#3fd07a">$25.5B</span>, so this implies <em>~${growthPct}%</em> YoY growth, almost entirely from the Calpine consolidation rather than organic generation growth.`,
    peerCommentary: (currentPE) => `At ${currentPE}× NTM P/E, CEG trades at a meaningful PREMIUM to the deregulated-IPP peer set it's most often compared against (VST ~16x, TLN ~15x) and even to the regulated-utility anchor DUK (~19x) — the market has historically paid up for CEG's unmatched nuclear scale and the direct capacity-auction/PPA economics that VST and TLN also have, but at smaller scale. NRG (~17x) sits between. The open question this multiple gap is really asking: does CEG's nuclear-fleet chokepoint deserve a structural premium to its deregulated-power peers, the way TSM/ASML's process-node monopolies deserve one over fabless chip peers — or was that premium built on a scarcity-pricing assumption the market is now re-testing?`,
  },

  // THE FUTURE tab
  future: {
    scenarioTips: {
      bear: "Triggered by: a future PJM auction clearing well below the $325 cap, a FERC/PJM reform discounting nuclear capacity payments, or a sustained Calpine integration miss. Multiple compresses toward the 16–20× trough zone.",
      base: (loPE, hiPE) => `2026 adjusted operating EPS lands within the reaffirmed $11.00–12.00 guide; Calpine integration tracks its FCF/synergy plan; PJM capacity economics hold. P/E recovers into the normal ${loPE}–${hiPE}× band from today's compressed level.`,
      bull: (currentPE) => `Adjusted operating EPS beats guide and 2027 growth accelerates past 30%; the next PJM auction clears at cap again; hyperscaler PPA signings keep adding megawatts. Multiple re-rates from ~${currentPE}× toward the bull zone, closing the gap to the bull target.`,
    },
    downsideChevronTip: "Kill-switch: two straight quarters missing guide, or a future PJM auction clearing well below cap = exit / reduce.",
    dislocEventName: "the Apr 2025 tariff-panic low",
    dislocLabel: "SINCE APR 2025 TARIFF LOW",
    bearPriceTip: (bearMid, bearLo, bearHi, peTrough, peBearHi) => `$${bearMid} is the midpoint of the bear case range ($${bearLo}–$${bearHi}). This assumes a guide-miss pattern replaces the Q1 2026 beat, or PJM/FERC reform actually discounts nuclear capacity payments, and the multiple compresses toward the ${peTrough}–${peBearHi}× trough zone. The kill-switch is two straight quarters missing guide, or a materially weak future auction clear — if either triggers, do not average down.`,
    killSwitchTip: "A kill-switch is a pre-committed exit rule you set BEFORE you own the position — when you are thinking clearly. If adjusted operating EPS misses guide for two straight quarters, or a future PJM capacity auction clears well below the $325 cap, or FERC/PJM reform structurally discounts nuclear capacity payments, the thesis is broken: that's demand weakness or policy risk, not timing. Do not average down into a broken thesis — the market is telling you something. No debate, no rationalisation. Exit.",
    killSwitchTipNote: "Two straight EPS misses, a weak future auction clear, or an adverse FERC reform. Any one of these.",
    killSwitchHtml: `<strong style="color:var(--title)">Two consecutive quarters missing the adjusted operating EPS guide, a future PJM auction clearing well below the $325 cap, or a FERC/PJM reform discounting nuclear capacity payments</strong> → exit or reduce. No debate. Do not average down into a broken thesis.`,
    nextCheck: "Next check: Q2 2026 earnings (Aug 6, 2026)",
    downsideFootnote: (px, peTrough, peBearHi) => `Bear case scenario: guide misses, or PJM/FERC policy risk actually materializes. Assumes a multiple compression toward ${peTrough}–${peBearHi}× on roughly flat-to-down EPS growth. Position loss is illustrative at $${px} entry.`,
    multipleSummary: (peNow, loPE, hiPE) => `At ~${peNow}× NTM P/E, CEG sits BELOW its own recent-history normal range (${loPE}–${hiPE}×) — a real compression from the ~35x it briefly touched near the October 2025 high, driven by PJM/FERC reform anxiety rather than any confirmed change to the cleared 2026/27 or 2028/29 auction economics. Earnings beat; the multiple got cheaper on fear of a reform that hasn't happened.`,
    peBarTipSuffix: "CEG's ADJUSTED operating EPS is used here, not GAAP — GAAP EPS is heavily distorted by mark-to-market hedge accounting on the generation and trading book and would make the P/E swing wildly quarter to quarter for reasons unrelated to the business.",
    deepValueZoneNote: "Historically cheap for CEG's own short public history (since Feb 2022). No prior full-cycle precedent exists yet given the company's age — treat this zone as directional, not statistically anchored.",
    dislocPrecedent: (baseFloor) => `Historical precedent: the April 2025 tariff-panic dislocation (a broad macro shock unrelated to CEG) resolved within the ${REVERSION_PRECEDENT_DAYS}-day base-reversion window once the fundamentals stayed intact. Base floor: $${baseFloor}. Note the CURRENT drawdown is a different, policy-specific dislocation — this precedent shows fast reversion CAN happen when fundamentals hold, not that it automatically will this time.`,
    regretHtml: (currentPE) => `2026 adjusted operating EPS <strong style="color:#3fd07a">lands at or above the $12.00 guide ceiling</strong> AND the next PJM capacity auction (2029/30, ~mid-2027) clears at or near the $325 cap again. That would confirm the PJM/FERC reform fear priced in since July 2026 was overdone, re-rate the stock from ~${currentPE}× toward the bull zone, and close today's entry window.`,
    regretTip: "Charlie Munger's inversion: instead of asking 'why should I buy?', ask 'what would I have to believe happened, in hindsight, to wish I had bought more?' If the Aug 6, 2026 print beats guide cleanly with no new PJM/FERC policy news, today's entry window will close fast — CEG re-rated from ~$260 to $412 in under a year once before, on a similar setup. This question is not about FOMO — it is about sizing correctly for your conviction.",
    chips: [
      { label: "KILL-SWITCH: 2 STRAIGHT EPS MISSES OR WEAK AUCTION → EXIT", col: "#f1564b" },
      { label: "REGRET IF: Q2 BEATS + NO NEW PJM/FERC POLICY NEWS",        col: "#3fd07a" },
      { label: "NEXT CHECK: AUG 6, 2026 EARNINGS",                         col: "#2f6dff" },
    ],
    signalFootnote: (ntmEps) => `P/E uses ADJUSTED operating NTM EPS $${ntmEps} — GAAP EPS is heavily distorted by mark-to-market hedge accounting on CEG's generation and trading book, so it is not a usable ruler here (unlike a clean-GAAP peer like TSM).`,
  },

  // THE PAST tab
  past: {
    cardTips: {
      durability: (revCagrPct) => `Looks at CEG's short public history (spun off from Exelon Feb 2022) — Revenue, Operating Margin (substitute for gross margin — see footnote), and Free Cash Flow. Revenue has grown ~${revCagrPct}%/yr, which understates the real story: CEG divested lower-margin retail/home-services lines through 2022–2025 while its core generation fleet was largely flat, so historical revenue is roughly flat-to-up-modestly — the real growth inflection is 2026 forward, when Calpine's ~$22B, +23GW acquisition roughly doubled Q1 2026 revenue YoY.`,
      value: (latestROIC) => `A simplified ROIC proxy (net income ÷ invested capital — CEG doesn't disclose a clean pre-tax operating-income-based ROIC breakout) measures how efficiently management deploys capital. Above WACC (~7-9% for a regulated/merchant power generator) = value creation. CEG swung from a barely-negative return in 2022 (early post-spin, low-margin retail mix still large) to a 14.3% peak in 2024 to ${latestROIC}% in 2025 — noisy because GAAP net income itself is noisy (mark-to-market hedge accounting), not because the underlying generation business got worse.`,
      capex: (peakCapex, latestCapex, latestFCF) => `Capex as a % of revenue shows how much of every dollar gets reinvested before cash reaches shareholders. CEG's capex intensity has been CLIMBING, not falling — from ${peakCapex === latestCapex ? "roughly 7%" : "6.9%"} in 2022 to ${latestCapex}% in 2025 (nuclear uprates at Braidwood/Byron/Clinton, plus early Calpine-related spend) — still, FCF turned positive for the first time in this window in 2025 ($${latestFCF}B), the first real evidence the AI-power buildout is starting to pay for itself even as capex keeps rising.`,
      mood: (evNow, evAvg) => `EV/EBITDA vs. CEG's own short-history average tells you whether the market is paying a premium or discount for this business right now. Current EV/EBITDA of ${evNow}× sits above the 4-year average of ~${evAvg}× — the multiple bottomed near 8.6x in 2023 (before the AI-power narrative existed) and re-rated hard through 2024–2025 as the capacity-scarcity and hyperscaler-PPA story took hold. That re-rating, more than earnings growth itself, is what drove most of the 2023-2025 stock return — a mood-driven, not purely earnings-driven, chapter of this story (see the earnings-vs-multiple resolution on THE CURRENT tab).`,
    },
    stats: [
      { html: `Revenue <span style="color:#3fd07a;font-weight:700">$24.4B → $25.5B</span> (2022–25)`, tipTitle: "Revenue (2022–2025)", tipBody: "CEG's standalone revenue was roughly flat from $24.4B (2022) to $25.5B (2025) — the historical growth story is muted because CEG divested lower-margin retail/home-services businesses over this window even as its core generation fleet grew modestly. The real step-change is 2026: Q1 2026 revenue was $11.1B, +64% YoY, almost entirely the Calpine consolidation." },
      { html: `FCF <span style="color:#3fd07a;font-weight:700">−$4.0B → +$1.3B</span> (2022–25)`, tipTitle: "Free Cash Flow (2022–2025)", tipBody: "FCF went from −$4.0B (2022) to −$7.7B (2023, the deepest negative year) to a first-time positive $1.3B in 2025 — a genuine inflection after several years of heavy nuclear-uprate and pre-Calpine capex. Q1 2026 FCF dipped back to −$850M on Calpine integration costs; whether the positive 2025 trend resumes through 2026 is a real, watchable open question, not a settled trend." },
      { html: `Price <span style="color:#3fd07a;font-weight:700">+472%</span> (Feb 2022 → now)`, tipTitle: "Total price return (since spin-off)", tipBody: "From $45.98 (Feb 2022, first full trading month post-Exelon-spin) to $262.75 today = +472% — almost entirely a re-rating story (multiple expansion) layered on modest underlying earnings growth, driven first by the 2022-23 post-spin standalone re-rating, then the 2024-25 AI-power/PJM-capacity-scarcity narrative. CEG's public trading history is under 5 years, materially shorter than most peers in this dashboard series — treat this return figure as illustrative of a young, volatile stock, not a mature multi-cycle track record." },
    ],
    verdictBody: "CEG's short public history (since the Feb 2022 Exelon spin-off) shows a business that was roughly flat on revenue and FCF-negative through 2022-2024 while it reshaped its portfolio (divesting retail/home-services, investing in nuclear uprates) — then inflected hard in 2025 (first positive FCF) and again in 2026 (Calpine roughly doubling revenue). The multiple did most of the heavy lifting for the stock's return so far, re-rating from ~8.6x EV/EBITDA (2023) to ~17.8x (2025) as the market discovered the PJM capacity-scarcity and hyperscaler-PPA story. The open question is whether 2026-27 earnings growth (Calpine, uprates, PPA book) catches up to justify that re-rated multiple, or the multiple gives some of it back first — which is exactly what's playing out in the July 2026 selloff.",
    banners: {
      durability: (revCagrPct, rev0, rev9, gmDelta, latestGM, fcf0, latestFCF) => `Revenue grew at a modest ~${revCagrPct}%/yr from $${rev0}B (2022) to $${rev9}B (2025) — flat-looking because CEG was actively divesting lower-margin retail/home-services lines over this window, not because the generation business stalled. Operating margin (substitute for gross margin — CEG doesn't report a GAAP gross-margin line) swung from ~2% to a ${latestGM}% 2025 close, though this metric is noisy from mark-to-market hedge accounting, not a clean read on pricing power. FCF went from −$${Math.abs(fcf0)}B to +$${latestFCF}B — the real inflection point.`,
      value: (latestROIC) => `A simplified ROIC proxy of ${latestROIC}% (2025, net income ÷ invested capital) sits above a typical 7-9% WACC for a regulated/merchant power generator — value-creating, though the underlying GAAP net income driving this is noisy (mark-to-market hedge accounting swung GAAP diluted EPS from $11.89 in 2024 to $7.40 in 2025 with no change in the operating business). Adjusted operating EPS — the cleaner number — grew every year in this window (2025 actual $9.39, up from a smaller 2022-23 base).`,
      capex: (latestCapex, peakCapex, latestFCF, fy26Guide) => `Capex/revenue of ${latestCapex}% (2025) is actually the HIGH end of this 4-year window, not the low end — nuclear uprates (Braidwood/Byron, Clinton) and early Calpine-related spend have pushed intensity up, not down, even as FCF turned positive for the first time ($${latestFCF}B). The 2026 capex guide (~$${fy26Guide}B, including ~$3.9B of disclosed "growth capex") stays elevated as Calpine integration continues. The real test: does 2026-27 FCF keep climbing as this spend converts into contracted PPA and capacity-auction revenue, or does intensity stay elevated without a matching FCF payoff?`,
      mood: (evNow, evAvg) => `EV/EBITDA of ${evNow}× sits above the short-history average of ${evAvg}× — the multiple bottomed near 8.6x in 2023, before the AI-power narrative existed, and has roughly doubled since as the market discovered the PJM capacity-scarcity and hyperscaler-PPA story. Price is off its October 2025 all-time high today, not sitting at it — the July 2026 selloff already gave back some of that re-rating on PJM/FERC policy-risk fear, well before any actual reform has been adopted.`,
    },
    revAnnotationsHtml: `<span>2023: <span style="color:var(--tx3)">$24.9B</span> (portfolio reshaping, retail divestitures)</span><span>2025: <span style="color:var(--tx3)">$25.5B</span> (last full year before Calpine)</span>`,
    roicNote: "Green >15% · Amber 5–15% · Red <5% — simplified proxy (net income ÷ invested capital); noisy from GAAP mark-to-market accounting, not a clean operating read",
    fcfYieldNote: "2022-2024 negative yield = heavy nuclear-uprate and pre-Calpine capex, not a broken business. 2025's first-ever positive yield is the real inflection to watch continue.",
    capexAnnotationsHtml: `<span>2022: <span style="color:#3fd07a">6.9%</span> (early post-spin, lean capex)</span><span>2024: <span style="color:#e0a83b">10.9%</span> (uprates ramping)</span><span>2025: <span style="color:#f1564b">11.6%</span> (window high — uprates + pre-Calpine spend)</span>`,
    footnotes: {
      durability: "CEG has no GAAP 'gross profit' line item — utilities and independent power producers present operating revenues, then fuel/purchased-power and O&M costs, without a gross-margin subtotal the way a product company does. GAAP OPERATING MARGIN is substituted in the chart above as the closest available pricing-power/mix-quality proxy; because it's hardcoded to color thresholds tuned for a high-margin technology peer set (>58% green), CEG's operating margin (2-18.5%) will read as consistently red/amber on this panel by construction — read the DIRECTION of travel (2022 low → 2024 peak 18.5% → 2025 12.1%, still noisy from mark-to-market accounting), not the color, for this stock specifically.",
      value: "The ROIC proxy here is net income ÷ invested capital, not a clean pre-tax NOPAT-based calculation — CEG doesn't disclose the operating-income breakout needed for a textbook ROIC, and GAAP net income itself swings on mark-to-market hedge accounting unrelated to the underlying generation business. Adjusted operating EPS (the number management and the Street actually use) grew every year 2022-2025, even in years where this ROIC proxy looked weak.",
      capex: "Unlike a mature company reinvesting less as its buildout matures, CEG's capex/revenue ratio has been CLIMBING through this window (6.9% → 11.6%), and the 2026 guide stays elevated — nuclear uprates plus the Calpine integration are both still ramping, not winding down. The kill-switch for this panel: if capex/revenue keeps climbing without FCF following (2025's first positive FCF year reversing), the buildout has stopped paying for itself.",
      mood: "The scenario bands on the other tabs use forward P/E on ADJUSTED operating EPS, not GAAP EPS or EV/EBITDA — GAAP EPS is too distorted by mark-to-market hedge accounting to be a usable ruler for CEG, the way it would be for a clean-GAAP peer like TSM. EV/EBITDA is shown here purely to track cross-cycle mood, since it's capital-structure-neutral. The multiple bottomed near 8.6x in 2023 — before the AI-power story existed — and sits at 17.8x today even after the July 2026 selloff. That gap is real re-rating on a demand story, and it can compress as fast as it expanded if the story stalls.",
    },
    priceChartTitle: "CEG PRICE · SINCE FEB 2022 SPIN-OFF · MONTHLY",
    priceChartSub: "$ per share · dashed lines = key events",
    priceNowTip: (px, isATH) => `$${px} — where CEG trades today, ${isATH ? "also the highest monthly close in this window" : "off the October 2025 all-time high of $412"}. The chart shows a young, volatile stock: a post-spin re-rating through 2022-23, the 2024 AI-power narrative ignition, the 2024-25 run to an all-time high on PJM capacity scarcity and hyperscaler PPAs, and the ongoing 2026 pullback on PJM/FERC policy-risk fear.`,
    ddTip: (minDD) => `${minDD}% — the deepest drop from a prior all-time high in this window. This is the CURRENT drawdown (Jun 2026), driven by PJM/FERC reliability-reform anxiety rather than any confirmed policy change or fundamentals miss. CEG's public history is short (since Feb 2022) so this drawdown chart has fewer full cycles to compare against than a mature stock's — treat it as directional.`,
    ddAnnotationsHtml: `<span>Max drawdown: <span style="color:#f1564b">−34.1%</span> (Jun 2026, PJM/FERC policy-risk selloff — the CURRENT drawdown)</span><span>Latest: <span style="color:#e0a83b">−30.3%</span> from the Oct 2025 ATH</span>`,
  },
};
