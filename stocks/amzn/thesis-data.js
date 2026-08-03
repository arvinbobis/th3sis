/* ╔══════════════════════════════════════════════════════════════════════════╗
   ║   AMZN · thesis-data.js — ALL per-stock content lives here.              ║
   ║   ███  EDIT EVERYTHING IN THIS FILE EACH QUARTER  ███                    ║
   ║                                                                          ║
   ║   The rendering engine (../engine/thesis-engine.js) contains ZERO        ║
   ║   company-specific strings — every number, narrative, and tooltip        ║
   ║   that mentions AMZN is in this file. Quarterly touch = edit this        ║
   ║   file only, then run: node tools/lint-thesis-data.js AMZN               ║
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

const TICKER_META = { ticker: "AMZN", exchange: "NASDAQ", company: "Amazon.com, Inc." };
const AS_OF_DATE = "2026-07-31";

// Most recent material dislocation — the May-June 2026 capex-fear drift, resolved by
// the 2026-07-30 Q2 print (AWS +37%, fastest in 18 quarters). Left live for the record;
// mechanics re-trigger automatically if a NEW dislocation date is set.
const DISLOCATION_DATE = "2026-05-06";
const REVERSION_TROUGH = 228;
const REVERSION_BASEFLOOR = 262;
const REVERSION_PRECEDENT_DAYS = 80;

const CASES = {
  bear: {
    key: "bear", label: "BEAR", accent: "#f1564b", glow: "rgba(241,86,75,0.45)",
    target12: "$195 — $225",
    op: "Operational state: even after AWS's +37% Q2 print, the bear case rests on the OTHER half of the story — free cash flow already went the wrong way (TTM swung to −$7.6B from +$18.2B a year ago) and full-year capex guide was raised again, to $220B from $200B, on higher memory costs. If AI demand digests from here while that $220B lands as depreciation, AWS decelerates back toward the low-20s, the record margin gives some back, and the FTC ad suit lands and clips the highest-margin profit engine. The market stops paying a premium for 'capacity that sells out' and wants the cash instead.",
    breaks: "AWS holds the 30s with margins intact for another 1-2 quarters, capex visibly keeps converting to revenue, and free cash flow stops deteriorating.",
    requires01: "AWS decelerates hard / Q3 guide miss",
    requires02: "FCF keeps worsening, capex guide raised again",
  },
  base: {
    key: "base", label: "BASE", accent: "#e0a83b", glow: "rgba(224,168,59,0.40)",
    target12: "$280 — $320",
    op: "Operational state: AWS holds the high-20s/low-30s as real AI demand (not just capacity coming online) keeps showing up in the print, while ads and retail-margin expansion keep compounding operating income — Q2's 13.7% consolidated margin was a new record even as capex guide rose. The market tolerates the now-$220B capex as long as the cloud keeps delivering, but the FTC overhang and a free cash flow line that's still moving the wrong way (TTM −$7.6B) cap how far the multiple re-rates near-term. A high-quality compounder that just proved the growth half of the bull case — the cash half hasn't happened yet.",
    breaks: "Either AWS rolls back toward the low-20s with margins rolling over (→ bear), or free cash flow visibly inflects up while AWS holds 30s (→ bull).",
    requires01: "AWS high-20s/30s, in-line-or-better guide",
    requires02: "record margins durable, FCF stops worsening",
  },
  bull: {
    key: "bull", label: "BULL", accent: "#3fd07a", glow: "rgba(63,208,122,0.45)",
    target12: "$390 — $450",
    op: "Operational state: AWS keeps re-accelerating or holds the high-30s as AI services (Bedrock, Trainium) inflect from infrastructure into real software revenue — Q2's +37% (fastest in 18 quarters, blowing past the old bull ceiling) is the first real data point for this case. Retail and ads push margins to new records, and free cash flow FINALLY turns back up as the now-$220B capex cycle starts to digest instead of compound. The market reframes the raised capex guide from a cost shock into proof of a widening cloud + logistics moat and re-rates the multiple. Note: this case still needs its second leg — FCF inflecting positive — which Q2 moved AWAY from, not toward.",
    breaks: "AI services stall, free cash flow stays negative into 2027 while depreciation keeps climbing even as AWS growth is strong, or an FTC remedy structurally hits the ad engine.",
    requires01: "AWS holds high-30s + AI-services proof",
    requires02: "margins to new records, FCF actually inflects positive",
  },
};

// THESIS_HISTORY intentionally omitted on this first migration touch — this rebuild is a
// lossless PORT of the 2026-07-31 /update-thesis content into the engine-split shape, not
// a Layer-2 audit that rewrote CASES. There is no distinct "outgoing" vintage to archive
// yet (incoming === outgoing). The archive starts at AMZN's NEXT /update-thesis touch,
// right before that session's audit overwrites CASES — same discipline as every other
// migrated stock, just starting one touch later here since nothing changed this time.

const FALLBACK_PRICE = 254.00;

const LIVE_PRICE = {
  enabled: true,
  symbol: "AMZN",
  provider: "yahoo",                                  // "yahoo" (keyless, proxied) | "finnhub"
  corsProxy: "https://api.allorigins.win/get?url=",
  finnhubToken: "",
};

// ALERT — buy-trigger pre-commitment. Canonical source is PF_ALERTS.AMZN in
// stocks/portfolio/portfolio-data.js; this copy is a FALLBACK for offline opens.
const ALERT = {
  symbol: "AMZN",
  buyFloor: 280,
  thesisIntact: true,
  asOf: AS_OF_DATE,
  nextEarnings: "~2026-10-29",
};

const HISTORY = [
  { q: "Q2 25", p: 198 }, { q: "Q3 25", p: 222 },
  { q: "Q4 25", p: 240 }, { q: "Q1 26", p: 262 }, { q: "Q2 26", p: 236 }, { q: "NOW", p: FALLBACK_PRICE },
];
const PROJ_END = { bear: 210, base: 300, bull: 420 };
const FUTURE_Q = ["Q3 26", "Q4 26", "Q1 27", "Q2 27"];

const SIGNALS = {
  bear: [
    { name: "Revenue vs $197–202B Guide", unit: "$B", tag: "MISS", next: "Oct 29, 2026", val: "BEAR ≤ $197B", guide: "GUIDE $197–202B", pos: 0.20 },
    { name: "AWS Operating Margin", unit: "%", tag: "MISS", next: "Oct 29, 2026", val: "BEAR ≤ 34%", guide: "Q2 ~39.4%", pos: 0.24 },
    { name: "Advertising Growth", unit: "% YoY", tag: "MISS", next: "Oct 29, 2026", val: "BEAR ≤ 18%", guide: "Q2 +26%", pos: 0.28 },
  ],
  base: [
    { name: "Revenue vs $197–202B Guide", unit: "$B", tag: "MATCH", next: "Oct 29, 2026", val: "BASE $198–200B", guide: "GUIDE $197–202B", pos: 0.56 },
    { name: "AWS Operating Margin", unit: "%", tag: "MATCH", next: "Oct 29, 2026", val: "BASE ~36–38%", guide: "Q2 ~39.4%", pos: 0.55 },
    { name: "Advertising Growth", unit: "% YoY", tag: "MATCH", next: "Oct 29, 2026", val: "BASE +21–25%", guide: "Q2 +26%", pos: 0.58 },
  ],
  bull: [
    { name: "Revenue vs $197–202B Guide", unit: "$B", tag: "BEAT", next: "Oct 29, 2026", val: "BULL ≥ $202B", guide: "GUIDE $197–202B", pos: 0.84 },
    { name: "AWS Operating Margin", unit: "%", tag: "BEAT", next: "Oct 29, 2026", val: "BULL ≥ 39%", guide: "Q2 ~39.4%", pos: 0.82 },
    { name: "Advertising Growth", unit: "% YoY", tag: "BEAT", next: "Oct 29, 2026", val: "BULL ≥ 26%", guide: "Q2 +26%", pos: 0.85 },
  ],
};
const MARGIN = {
  bear: [
    { name: "Consolidated Operating Margin", tag: "MISS", next: "Oct 29, 2026", pos: 0.20 },
    { name: "Capex Monetization Trajectory", tag: "WATCH", next: "Oct 29, 2026", pos: 0.30 },
    { name: "Free Cash Flow Trend", tag: "MISS", next: "Oct 29, 2026", pos: 0.12 },
  ],
  base: [
    { name: "Consolidated Operating Margin", tag: "MATCH", next: "Oct 29, 2026", pos: 0.58 },
    { name: "Capex Monetization Trajectory", tag: "MATCH", next: "Oct 29, 2026", pos: 0.56 },
    { name: "Free Cash Flow Trend", tag: "WATCH", next: "Oct 29, 2026", pos: 0.30 },
  ],
  bull: [
    { name: "Consolidated Operating Margin", tag: "BEAT", next: "Oct 29, 2026", pos: 0.85 },
    { name: "Capex Monetization Trajectory", tag: "BEAT", next: "Oct 29, 2026", pos: 0.82 },
    { name: "Free Cash Flow Trend", tag: "BEAT", next: "Oct 29, 2026", pos: 0.55 },
  ],
};

// HEADLINE GAUGE: AWS revenue growth % — the "is the $220B capex working?" tell.
const KPI_HIST = 37;                 // Q2 2026 AWS YoY growth — fastest in 18 quarters, blew past the old bull ceiling (32%)
const KPI_PROJ = { bear: [33, 29, 25, 22], base: [35, 34, 33, 32], bull: [37, 38, 39, 40] };

// TRACK RECORD — append newest quarter to the END. Window keeps last TRACK_WINDOW.
//       conf: "high" recent/reliable, "med" older/fuzzier. Prices approximate.
const TRACK_ALL = [
  { q: "Q1 2025", date: "2025-05", post: 192, reaction: "−",  bear: [178, 198], base: [212, 240], bull: [255, 282], landed: "bear",      conf: "med"  },
  { q: "Q2 2025", date: "2025-08", post: 222, reaction: "+",  bear: [185, 205], base: [214, 244], bull: [258, 288], landed: "base",      conf: "high" },
  { q: "Q3 2025", date: "2025-10", post: 236, reaction: "+",  bear: [196, 216], base: [226, 256], bull: [270, 300], landed: "base",      conf: "high" },
  { q: "Q4 2025", date: "2026-02", post: 256, reaction: "+",  bear: [208, 232], base: [246, 276], bull: [288, 322], landed: "base→bull", conf: "high" },
  { q: "Q1 2026", date: "2026-04", post: 232, reaction: "−",  bear: [210, 238], base: [256, 292], bull: [330, 382], landed: "bear→base", conf: "high" },
  { q: "Q2 2026", date: "2026-07", post: 254, reaction: "++", bear: [170, 200], base: [260, 295], bull: [360, 420], landed: "base→bull", conf: "high" },
];
const TRACK_WINDOW = 6;

// THE PAST — annual history (Wisesheets 10-Q/10-K facts, SEC-cited). Only 4 fiscal years
// (2022-2025) available, not TSM's 10 — Wisesheets' free-tier plan caps history at 5
// years, and the 5th year (2021) lacked an aligned year-end price point this session, so
// all price-dependent series (EV/EBITDA, FCF yield) use the same 4-year window as
// revenue/margin/FCF for internal consistency. Real, sourced data throughout — a shorter
// honest window beats a longer fabricated one. ROIC/EV computed as NOPAT (21% tax rate)
// / (debt + equity − cash) and EV/EBITDA off year-end close × diluted shares.
const PAST_YEARS       = ["2022","2023","2024","2025"];
const PAST_REV         = [514.0, 574.8, 638.0, 716.9];
const PAST_GM          = [43.8,  47.0,  48.9,  50.3];
const PAST_FCF         = [-16.9, 32.2,  32.9,  7.7];
const PAST_ROIC        = [4.1,   10.7,  16.0,  13.2];
const PAST_EVEBITDA    = [17.4,  19.5,  19.8,  17.6];
const PAST_FCF_YIELD   = [-2.0,  2.0,   1.4,   0.3];
const PAST_CAPEX_REV   = [12.4,  9.2,   13.0,  18.4];
const PRICE_M_LABELS = ["2022-08","2022-09","2022-10","2022-11","2022-12","2023-01","2023-02","2023-03","2023-04","2023-05","2023-06","2023-07","2023-08","2023-09","2023-10","2023-11","2023-12","2024-01","2024-02","2024-03","2024-04","2024-05","2024-06","2024-07","2024-08","2024-09","2024-10","2024-11","2024-12","2025-01","2025-02","2025-03","2025-04","2025-05","2025-06","2025-07","2025-08","2025-09","2025-10","2025-11","2025-12","2026-01","2026-02","2026-03","2026-04","2026-05","2026-06"];
const PRICE_M = [126.77,113.00,102.44,96.54,84.00,103.13,94.23,103.29,105.45,120.58,130.36,133.68,138.01,127.12,133.09,146.09,151.94,155.20,176.76,180.38,175.00,176.44,193.25,186.98,178.50,186.33,186.40,207.89,219.39,237.68,212.28,190.26,184.42,205.01,219.39,234.11,229.00,219.57,244.22,233.22,230.82,239.30,210.00,208.27,265.06,270.64,238.34];
const PRICE_M_DD = [0.0,-10.9,-19.2,-23.8,-33.7,-18.6,-25.7,-18.5,-16.8,-4.9,0.0,0.0,0.0,-7.9,-3.6,0.0,0.0,0.0,0.0,0.0,-3.0,-2.2,0.0,-3.2,-7.6,-3.6,-3.5,0.0,0.0,0.0,-10.7,-20.0,-22.4,-13.7,-7.7,-1.5,-3.7,-7.6,0.0,-4.5,-5.5,-2.0,-14.0,-14.7,0.0,0.0,-11.9];
const PAST_EVENTS = [
  { idx: 4,  label: "2022 Growth-Scare Trough", note: "Dec 2022 — the Fed rate-hike cycle, post-COVID e-commerce demand normalization, and a real operating-margin collapse (FY2022 operating margin fell to ~2.4% from ~5.3% the year before) drove the deepest drawdown in this window (-33.7% from the prior high). Amazon announced its first-ever mass layoffs (18,000+ roles) in this window — a genuine business air-pocket, not just macro fear. This trough is what the 2023-24 AWS/AI re-rating recovered from." },
  { idx: 29, label: "Pre-Tariff High",  note: "Jan 2025 — stock at a cycle high heading into the Apr 2025 'Liberation Day' tariff shock." },
  { idx: 32, label: "Tariff Panic",     note: "Apr 2025 — the broad tariff-driven selloff hit AMZN alongside the rest of mega-cap tech/retail on cross-border supply-chain and consumer-spending fear, no Amazon-specific miss. -22.4% from the Jan 2025 high, fully recovered within the year." },
  { idx: 44, label: "AI/Capex Cycle High", note: "Apr 2026 — fresh multi-year high on continued AWS re-acceleration and AI-infrastructure optimism heading into the Q1 2026 print." },
  { idx: 46, label: "Capex-Fear Pullback", note: "Jun 2026 — the FY26 capex guide raise (to $200B, later $220B) and a deteriorating free-cash-flow trend drove a pullback from the April/May highs. This is the DISLOCATION_DATE episode the Reversion Clock tracks below — resolved by the Jul 30 2026 Q2 beat (AWS +37%, fastest in 18 quarters)." },
];

const VAL_CONFIG = {
  ntm_eps:               8.60,      // web search — analyst consensus, revised up from the pre-Q2-print $7.66-7.75 range after Q2 2026's $5.75 GAAP EPS beat (H1 2026 alone: $2.78+$5.75=$8.53)
  shares_b:              10.85,
  fcf_ntm_b:             -7.6,      // TTM as of Q2 2026 — swung negative from +$18.2B a year ago on the capex ramp
  risk_free_pct:         4.35,
  default_discount_pct:  9.5,
  default_terminal_pe:   25,
  dcf_years:              5,
  capex_fy26_guide_b:    220,       // raised from $200B to $220B on the Q2 2026 call, citing higher memory costs
  prior_fy_rev_b:       716.9,      // last full fiscal year actual revenue (FY2025)
  prior_fy_label:       "2025",
  pe_trough: 20, pe_bear_hi: 26, pe_normal_lo: 30, pe_normal_hi: 37, pe_bull_lo: 42, pe_peak: 52,
  peers: [
    { t: "AMZN", fpe: 29.5, ev_eb: 16.1, fcf_y: -0.3, note: "AWS cloud + retail + ads; the only peer here with a negative TTM FCF yield right now" },
    { t: "MSFT", fpe: 19.8, ev_eb: 15.0, fcf_y: 2.5,  note: "Azure cloud + Copilot — still guided to GROW FCF in 2026, unlike AMZN/GOOGL/META" },
    { t: "GOOGL", fpe: 21.5, ev_eb: 25.4, fcf_y: 1.4, note: "Search + Cloud/TPU dual compounder, also capex-ramping hard in 2026" },
    { t: "META", fpe: 18.0, ev_eb: 14.0, fcf_y: 1.9,  note: "Ads-only (no cloud upside), also FCF-guided-down in 2026" },
    { t: "WMT",  fpe: 36.7, ev_eb: 20.6, fcf_y: 1.5,  note: "The pure-retail comp — commands the richest multiple of this group despite far slower growth, a defensive-compounder premium AMZN doesn't get" },
  ],
};

const SIGNAL_HELP = {
  "AWS Revenue Growth": "How fast Amazon's cloud business (AWS) is growing vs a year ago. This is the engine of the whole thesis — AWS is small in revenue but makes most of the profit. It just grew 37%, its fastest in 18 quarters, because companies are renting AI computing power. If this keeps climbing, the (now $220B) Amazon is spending on data centers is paying off.",
  "Revenue vs $197–202B Guide": "Amazon told investors to expect $197–202 billion in total sales for the July–September quarter. This checks whether they hit it. Beating = strong demand across cloud, retail, and ads; missing = a warning.",
  "AWS Operating Margin": "Out of every dollar AWS makes, how much is profit. It just hit ~39.4% — a new high. The worry: $220B of new data centers turns into 'depreciation' (an accounting cost) that can squeeze this margin before the new revenue shows up. So far it hasn't.",
  "Advertising Growth": "Amazon quietly built a $79B+/year ads business (sponsored products on the site). It's small but extremely profitable and growing ~26%. A regulator (the FTC) is preparing a lawsuit over how Amazon ranks ads — the main risk to this profit engine, still unresolved.",
  "Consolidated Operating Margin": "Profit as a share of ALL Amazon's sales (cloud + retail + ads). It just hit a record 13.7% — even while capex guide was raised. The underappreciated story is the retail side going from roughly break-even to real profit. If this holds while capex ramps, the bull case is alive.",
  "Capex Monetization Trajectory": "'Capex' = how much Amazon spends building data centers — raised again to $220B for 2026 (from $200B), citing higher memory costs. This watches whether that spending shows up as faster AWS growth (good) or just as cost and depreciation (bad). Q2 was a genuine 'good' data point: AWS growth accelerated to 37% alongside the raise. Judge the spend by the payoff, not the size.",
  "Free Cash Flow Trend": "The actual cash left over after running the business AND paying for all those data centers. The capex boom has crushed it further: trailing-12-month free cash flow just swung to −$7.6B from +$18.2B a year ago. The key question: when does free cash flow stop falling and turn back up? That inflection is what re-rates the stock — it hasn't happened yet, even with AWS accelerating.",
};
const TAG_HELP = {
  BEAT: "doing better than expected — a good sign.",
  MATCH: "roughly in line with expectations — steady, no surprises.",
  MISS: "falling short of expectations — a worry.",
  WATCH: "not decided yet — keep an eye on it.",
};

const THESIS_ITEMS = [
  { key: "awsGrowth",    label: "AWS growth holding 28%+",                      note: "37% this quarter — deceleration toward high-20s/30s expected and fine" },
  { key: "marginRecord", label: "Consolidated operating margin holding near record", note: "13.7% this quarter, a new record even as capex guide was raised to $220B" },
  { key: "fcfTrend",     label: "Free cash flow stops deteriorating / inflects up", note: "TTM swung to −$7.6B from +$18.2B a year ago — the still-unmet leg of the bull case" },
  { key: "ftcRisk",      label: "No adverse FTC ad-ranking ruling",             note: "Suit remains unresolved / not yet filed — the main risk to the highest-margin ad engine" },
];
const PRICE_ZONES = [
  { label: "BEAR", lo: 195, hi: 225, mid: 210, color: "#f1564b", action: "Exit / reduce if thesis also breaking" },
  { label: "BASE", lo: 280, hi: 320, mid: 300, color: "#e0a83b", action: "Small add OK if thesis intact" },
  { label: "BULL", lo: 390, hi: 450, mid: 420, color: "#3fd07a", action: "Let it ride — don't chase" },
];

// ── Chart geometry / axis ranges (per-stock: depends on price scale) ─────────
const GEOM = {
  priceMin: 160, priceMax: 480,
  fanGrid: [460, 400, 340, 280, 220],
  fanYears: ["2025", "2026", "2027"],
  trackMin: 160, trackMax: 440,
  trackGrid: [400, 340, 280, 220, 160],
  kpiMin: 15, kpiMax: 45,
  visLo: 150, visHi: 500,
  nowZoneLo: 230, nowZoneHi: 280,   // thresholds for the "NOW" dot zone tooltip on THE FUTURE signal panel
};

/* ── TEXT — every company-specific narrative/tooltip the engine renders. ──────
   Values are strings, HTML strings (rendered with dangerouslySetInnerHTML), or
   template functions the engine calls with computed values. If it mentions the
   company, a quarter, a guide number, or an event, it belongs HERE, not in the
   engine — that rule is what makes the engine safely reusable across stocks. */
const TEXT = {
  // header / footer
  priceTipLive: (px, at, asOf) => `Live quote: $${px} (fetched ${at}). The price is real-time, but the scenario bands and EPS are still as of ${asOf} — only the price-derived figures (scenario returns, P/E, band position) update live.`,
  priceTipStatic: (px, asOf, liveEnabled) => `$${px} as of ${asOf} — ${liveEnabled ? "live fetch unavailable (offline or blocked), using the saved price" : "static price (live fetch disabled)"}. Next earnings: ~Oct 29, 2026 (Q3 2026, unconfirmed date).`,
  footerDisclaimer: (asOf) => `Illustrative scenario framing built on public consensus & estimates as of ${asOf} — not a prediction and not financial advice. Price ranges are scenario mid-bands; KPI markers are positional, not literal. Valuation ruler: AWS revenue growth is the headline gauge, cross-checked against forward GAAP EPS × P/E. Data inputs will move with every print. Next earnings: ~Oct 29, 2026 (Q3 2026, unconfirmed date).`,

  // fan chart
  fanHistory: "The solid line is Amazon's actual share price over the past year-plus — a dip to the ~$196 low, a climb through 2025, a run to a ~$279 high in May 2026, a pullback to ~$232 on capex fears, then a jump back to ~$254 on the July 30 2026 Q2 beat (AWS +37%).",
  fanNow: (px) => `Amazon trades around $${px} right now. This dot is 'today' — everything left of it is history, everything right is forecast. The Jul 30 2026 Q2 print beat on revenue, AWS growth (+37%, fastest in 18 quarters), ads (+26%), and margin (13.7% consolidated, a record), while free cash flow kept deteriorating and full-year capex guide was raised again to $220B.`,
  fanPastDot: (q, p) => `Around the end of ${q}, Amazon was near $${p} (approx).`,

  // scenario selector
  segmentedExplain: {
    bear: ["The pessimistic scenario", "Click to see Amazon if the AI capex doesn't pay off fast: AWS slows back down, free cash flow keeps deteriorating, the FTC bites the ad engine. Price toward $195–225."],
    base: ["The most-likely scenario", "Click for 'the growth story confirmed, the cash story hasn't yet': AWS holds the high-20s/30s, ads and retail margin compound, but free cash flow is still moving the wrong way. A high-quality compounder drifting to $280–320."],
    bull: ["The optimistic scenario", "Click for the upside: AWS keeps re-accelerating, AI services inflect, and free cash flow FINALLY turns up — the market re-rates the now-$220B capex as a moat, not a cost. Price could run to $390–450."],
  },

  // KPI column
  kpiBaseline: (val) => `The most recent real number: AWS grew ${val}% year-over-year last quarter — its fastest in 18 quarters. The bars to the right forecast where that growth rate goes next.`,
  kpiForecast: (label, val) => `In this scenario, AWS revenue is projected to grow about ${val}% year-over-year by ${label}. Taller bar = faster cloud growth, which means the $220B capex is converting into real demand.`,

  // reversion clock
  reversion: {
    header: "REVERSION CLOCK · CAPEX-FEAR PULLBACK — RESOLVED 2026-07-30",
    timeTip: "Amazon ran to a ~$279 all-time high right after the strong Q1 print, then drifted ~17% lower on the $200B capex reveal. The July 30 2026 Q2 beat (AWS +37%) resolved the pullback — this clock is kept as the historical record of that episode, not a live gate anymore.",
    priceTip: (trough, baseFloor, now) => `The pullback bottomed near $${trough} and needed to reach $${baseFloor} to be back in the 'middle' zone as it was drawn back then. It's at $${now} now — well past that old yardstick (the base band itself has since moved up — see the fan chart and 12M target above for the current one).`,
    footerHtml: (baseFloor, precedentDays, now) => `<b>RESOLVED:</b> the capex-fear pullback that started at the May high fully reverted on the <b>2026-07-30</b> Q2 print — AWS re-accelerated to <b>+37%</b> (fastest in 18 quarters, beating consensus of 31%), and the stock jumped double digits after hours on the beat. ⚠ This was still <b>n=1</b> — a mild capex-fear drift, not a crash — and the pattern would look identical for a future genuine AWS deceleration, so don't treat "time healed it" as a standing rule. Watch for a fresh dislocation date if a new shock occurs; the base floor this episode needed to reclaim was <span style="color:#e0a83b;font-weight:700">$${baseFloor}</span>, current price is <span style="color:var(--blue-soft);font-weight:700">$${now}</span>.`,
  },

  // track record
  track: {
    lastDot: (post, nowPx) => `Amazon is ~$${post} now, right after the Q2 2026 beat (AWS +37%, fastest in 18 quarters) closed out the May–July capex-fear pullback. Price is back near the OLD base band and the business itself printed base-to-bull fundamentals — the gap the dashboard was built to track has largely closed, though the FCF side of the bull case still hasn't confirmed. Next dot: Q3 2026 earnings (~Oct 29, 2026).`,
    pastDot: (q, post) => `After ${q} earnings, price traded around $${post}. Compare this dot to the colored bars behind it to see if the bands were right.`,
    readoutHtml: (hits, n, nowPx) => `Current price <span style="color:var(--blue-soft);font-weight:700">$${nowPx}</span> sits back near the <span style="color:#e0a83b;font-weight:700">old BASE floor</span> after the Q2 2026 print landed <span style="color:#3fd07a;font-weight:700">base-to-bull</span> on the growth side (AWS <b>+37%</b> — fastest in 18 quarters, beating the 31% consensus; ads <b>+26%</b>; record <b>13.7%</b> consolidated margin) while <span style="color:#f1564b">free cash flow kept deteriorating</span> (TTM swung to −$7.6B from +$18.2B) and full-year capex guide was raised again to <b>$220B</b>. The May–July capex-fear pullback is resolved; the live question shifts from "does AWS growth confirm" (yes) to "does free cash flow ever inflect" (not yet) — that's what separates BASE from BULL from here, confirmed at the <b>~Oct 29, 2026</b> print. Price has tracked <span style="color:#3fd07a;font-weight:700">base-or-better in ${hits} of ${n} quarters</span> since Q1 2025.`,
    footnote: "⚠ Bands are reconstructed now (anchored to each date's forward-EPS & multiple regime), not archived in real time — and historical quarter-end prices are approximate. Treat levels as directional, especially older quarters. The reversion read rests on n=1 for Amazon specifically; it's a tell, not a strategy. Pattern breaks if a future pullback coincides with genuine AWS deceleration rather than capex fear.",
  },

  // THE CURRENT tab
  current: {
    statusNarrative: {
      broken: "Multiple signals missed. Thesis is under pressure — review the kill-switch criteria.",
      watch:  "AWS beat but margin, FCF, or the FTC risk ticked the wrong way. Core thesis tracking — the ~Oct 29, 2026 print is the next test. Not broken, but watch closely.",
      intact: "All key signals tracking as expected. The AWS-reacceleration leg of the bull case is confirmed — Q2 2026 beat on every disclosed growth line, even though free cash flow hasn't turned yet.",
    },
    panelTipStory: "Checks whether the original reasons to own AMZN are playing out. Counts signals from the Q2 2026 print and Q3 2026 guide — AWS growth, AWS margin, ad growth, consolidated margin, capex monetization, FCF trend. 0–1 miss = thesis intact. 2 misses = watch. 3+ = exit. Click to see KPI bars and kill-switch.",
    watchChipHtml: `🔑 WATCH: Q3 2026 rev vs <span style="color:#e0a83b;font-weight:700">$197–202B</span> guide · ~Oct 29, 2026`,
    exitChipHtml: `⚠ EXIT IF: AWS decelerates hard AND FCF keeps worsening <span style="font-weight:700">into 2027</span>, or FTC lands an adverse ad-ranking remedy`,
    verdictBody: {
      broken:     (px) => `AMZN at $${px}: kill-switch criteria met. Price position is irrelevant — signals say the AWS-reacceleration + FCF-inflection thesis is no longer playing out. The question is not whether to add; it is how much to reduce.`,
      watchBelow: (px) => `AMZN at $${px} sits below the base floor but signals are mixed. Price is attractive, but adding into a weakening thesis is the wrong sequence. Wait for the ~Oct 29, 2026 print to confirm or deny the pattern before deploying capital.`,
      below:      (px) => `AMZN at $${px} sits below the base floor with the thesis intact — Q2 2026 AWS growth, ad growth, and consolidated margin all beat, even as free cash flow kept deteriorating on the raised $220B capex guide. The market is pricing in the cash risk; the growth engine itself hasn't broken.`,
      inBase:     (px, statusWord) => `AMZN at $${px} is inside the base range. Thesis ${statusWord} and price is fair. Watch AWS growth and free cash flow at the ~Oct 29, 2026 print — a genuine FCF inflection alongside AWS holding the 30s opens the bull case; AWS decelerating hard while FCF keeps worsening reopens the bear.`,
      above:      (px) => `AMZN at $${px} is above the base ceiling. The bull case — free cash flow actually inflecting positive while AWS holds the high-30s — needs to play out to justify chasing here. If already in, hold. If adding, wait for a pullback toward the base floor.`,
    },
    kpiTitle: "AWS Revenue Growth",
    kpiSub: "% YoY · HIGHER BETTER",
    kpiMeasures: "AWS year-over-year revenue growth — the cleanest read on whether the now-$220B capex is converting into real, sold-out AI demand. Q2 2026 printed +37%, its fastest pace in 18 quarters and above the 31% consensus.",
    kpiRequires: {
      bull: "AWS holds the high-30s or re-accelerates further as AI services inflect; free cash flow finally turns up alongside it.",
      base: "AWS holds the high-20s/30s; margins stay intact but free cash flow stays negative through the capex ramp.",
      bear: "AWS fades back toward the low-20s as new depreciation lands faster than revenue, and free cash flow keeps worsening.",
    },
    group1Title: "AWS &amp; Demand Trajectory",
    group2Title: "Margin, Capex &amp; Cash",
    killSwitch: "AWS decelerates hard toward the low-20s AND free cash flow keeps deteriorating for another 1-2 quarters, or the FTC lands a structural remedy that clips the ad-ranking engine — exit / reduce. That is demand or policy risk, not noise.",
    priceBanner: {
      below:  (px, baseLo) => `At $${px}, price is $${(baseLo - px).toFixed(0)} below the base floor. Market is pricing in the FCF risk — not a growth problem, given the Q2 beat. A window patient buyers can use if the thesis stays intact.`,
      inBase: (px) => `At $${px}, price is inside the base range. Fair value — not a discount, not expensive.`,
      above:  (px, baseHi) => `At $${px}, price is $${(px - baseHi).toFixed(0)} above the base ceiling. The bull thesis (FCF inflection) needs to play out in full.`,
    },
    moodBanner: (currentPE, loPE, hiPE) => `At ${currentPE}× forward P/E, the market is pricing in AWS holding the high-20s/30s and free cash flow eventually inflecting up — the multiple sits just under the normal band (${loPE}–${hiPE}×), reflecting genuine caution about the FCF side of the story even after a growth beat.`,
    cagrNotes: {
      low:  "Low bar — not priced for perfection. Even moderate AWS execution justifies the price.",
      mid:  "Moderate bar — requires AWS to hold the high-20s/30s and record margins to stay durable.",
      high: "High bar — requires AWS to keep re-accelerating AND free cash flow to inflect positive, both at once.",
    },
    fy26CardTip: (fy26) => `Adding Q1+Q2 2026 actuals ($181.5B + $200.6B = $382.1B) to base-case Q3–Q4 2026 projections (~$199B + ~$215B, holiday-quarter seasonality) gives a full-year run rate of roughly $${fy26}B, up from $716.9B in 2025 — a base-case ~11% YoY growth path. That's what the base case — and roughly today's price — already assumes. The bull case requires AWS/AI services to push meaningfully above this.`,
    fy26CardHtml: (fy26, growthPct) => `Q1+Q2 2026 actuals plus base-case Q3–Q4 projections sum to roughly <span style="color:var(--blue-soft);font-weight:700">$${fy26}B</span> for full-year 2026 — the growth path today's price already assumes. 2025 actual revenue was <span style="color:#3fd07a">$716.9B</span>, so this implies <em>~${growthPct}%</em> YoY growth.`,
    peerCommentary: (currentPE) => `At ${currentPE}× NTM P/E, AMZN trades at a premium to MSFT (~19.8×), GOOGL (~21.5×), and META (~18.0×) — the other mega-cap AI-capex names — but at a discount to WMT (~36.7×), the pure-retail comp that commands the richest multiple of this group despite far slower growth, a defensive-compounder premium AMZN's cloud-growth-but-negative-FCF profile doesn't currently earn. MSFT stands out as the only peer here still guided to GROW free cash flow in 2026 — AMZN, GOOGL, and META are all guided down or already negative on that line, same direction as AMZN's own Q2 FCF deterioration.`,
  },

  // THE FUTURE tab
  future: {
    scenarioTips: {
      bear: "Triggered by: AWS deceleration hard toward the low-20s while free cash flow keeps worsening, or an adverse FTC ad-ranking remedy. Multiple compresses toward the 20–26× trough zone. Note: at current price, bear downside and bull upside are roughly symmetric.",
      base: (loPE, hiPE) => `AWS holds the high-20s/30s each quarter, ads and retail margin keep compounding, but free cash flow stays negative through the capex ramp. P/E holds just under the normal ${loPE}–${hiPE}× band. Modestly positive return from here as the market waits for the FCF leg to confirm.`,
      bull: (currentPE) => `AWS keeps re-accelerating or holds the high-30s, AI services inflect into real revenue, and free cash flow FINALLY turns up. Multiple re-rates from ~${currentPE}× toward the bull zone, closing the gap to the bull target.`,
    },
    downsideChevronTip: "Kill-switch: AWS decelerates hard AND FCF keeps worsening into 2027, or an adverse FTC ad-ranking remedy lands = exit / reduce.",
    dislocEventName: "the May 2026 capex-fear pullback",
    dislocLabel: "SINCE MAY 2026 CAPEX-FEAR HIGH",
    bearPriceTip: (bearMid, bearLo, bearHi, peTrough, peBearHi) => `$${bearMid} is the midpoint of the bear case range ($${bearLo}–$${bearHi}). This assumes AWS decelerates hard toward the low-20s while free cash flow keeps worsening, or the FTC lands an adverse ad-ranking remedy, and the multiple compresses toward the ${peTrough}–${peBearHi}× trough zone. The kill-switch is AWS deceleration AND worsening FCF together — if it triggers, do not average down.`,
    killSwitchTip: "A kill-switch is a pre-committed exit rule you set BEFORE you own the position — when you are thinking clearly. If AWS decelerates hard toward the low-20s AND free cash flow keeps deteriorating for another 1-2 quarters, or the FTC lands a structural remedy against the ad-ranking engine, the thesis is broken: that's demand weakness or policy risk, not timing. Do not average down into a broken thesis — the market is telling you something. No debate, no rationalisation. Exit.",
    killSwitchTipNote: "Both AWS deceleration AND worsening FCF together, or an adverse FTC remedy. No debate.",
    killSwitchHtml: `<strong style="color:var(--title)">AWS decelerates hard toward the low-20s AND free cash flow keeps worsening into 2027, or an adverse FTC ad-ranking remedy lands</strong> → exit or reduce. No debate. Do not average down into a broken thesis.`,
    nextCheck: "Next check: ~Oct 29, 2026 earnings (Q3 2026, unconfirmed date)",
    downsideFootnote: (px, peTrough, peBearHi) => `Bear case scenario: AWS decelerates or FCF keeps worsening. Assumes a multiple compression toward ${peTrough}–${peBearHi}× on roughly flat-to-down EPS growth. Position loss is illustrative at $${px} entry.`,
    multipleSummary: (peNow, loPE, hiPE) => `At ~${peNow}× NTM P/E, AMZN sits just under its historical normal range (${loPE}–${hiPE}×) — the market crediting the AWS beat but still discounting for the free-cash-flow side of the story.`,
    peBarTipSuffix: "Uses GAAP diluted EPS — Q2 2026's $5.75 was a genuine record quarter, not adjusted for one-timers, so the forward estimate blends that strength with a more normal run-rate assumption for the rest of the year.",
    deepValueZoneNote: "Historically cheap for AMZN. Rare — last seen near the 2022-23 growth-scare trough. Exceptional entry if thesis is intact.",
    dislocPrecedent: (baseFloor) => `Historical precedent: the May-July 2026 capex-fear pullback resolved within the ~80-day base-reversion window once AWS reaccelerated. Base floor: $${baseFloor}.`,
    regretHtml: (currentPE) => `Q3 2026 revenue and AWS growth <strong style="color:#3fd07a">materially beat the $197–202B guide / 30%+ AWS growth</strong> AND free cash flow visibly inflects up. That would confirm the Q2 2026 beat was the start of a durable re-rating, not a one-quarter blip, re-rate the stock from ~${currentPE}× toward the bull zone, and close today's entry window.`,
    regretTip: "Charlie Munger's inversion: instead of asking 'why should I buy?', ask 'what would I have to believe happened, in hindsight, to wish I had bought more?' If Q3 2026 beats guide again and free cash flow actually inflects, today's entry window will close fast. You will not get a second chance at this multiple if the bull case materialises. This question is not about FOMO — it is about sizing correctly for your conviction.",
    chips: [
      { label: "KILL-SWITCH: AWS DECEL + WORSENING FCF → EXIT", col: "#f1564b" },
      { label: "REGRET IF: Q3 BEATS + FCF INFLECTS",            col: "#3fd07a" },
      { label: "NEXT CHECK: ~OCT 29, 2026 EARNINGS",            col: "#2f6dff" },
    ],
    signalFootnote: (ntmEps) => `P/E uses GAAP NTM EPS $${ntmEps} — blends Q2 2026's record $5.75 quarter with a more normal run-rate for the remaining quarters, since not every quarter should be expected to repeat that margin.`,
  },

  // THE PAST tab
  past: {
    cardTips: {
      durability: (revCagrPct) => `Looks at 4 years of Revenue, Gross Margin, and Free Cash Flow. We want upward trends that hold through cycles — not spike-and-crash. Amazon has grown revenue at ~${revCagrPct}% CAGR while gross margin expanded from 43.8% to 50.3% — even through a real 2022 operating-margin scare and now a 2025-26 free-cash-flow squeeze from the AI capex ramp.`,
      value: (latestROIC) => `ROIC (Return on Invested Capital) measures how efficiently management deploys capital. Above WACC (~9–10% for a company this size) = value creation. Below = value destruction. Amazon's ROIC collapsed to just 4.1% in the 2022 growth scare, then recovered to 16.0% by 2024 as retail margins normalized — ${latestROIC}% today (2025) reflects the AI capex ramp pulling invested capital up faster than near-term profit.`,
      capex: (peakCapex, latestCapex, latestFCF) => `Capex as a % of revenue shows how much of every dollar gets reinvested before cash reaches shareholders. Capex/revenue has climbed every year since the 2023 trough (9.2%) to a window-high ${latestCapex}% in 2025 — and free cash flow fell to just $${latestFCF}B the same year. Unlike TSM or ASML, where past capex cycles clearly monetized into rising FCF, Amazon's current cycle hasn't shown that inflection yet — the real test the FUTURE tab tracks.`,
      mood: (evNow, evAvg) => `EV/EBITDA vs its own 4-year average tells you whether the market is paying a premium or discount for this business. Not a buy/sell signal on its own — context matters (growth rate, interest rates, sector rotation). Current EV/EBITDA of ${evNow}× sits close to the 4Y average of ~${evAvg}× — the market isn't pricing in obvious euphoria or obvious despair right now.`,
    },
    stats: [
      { html: `Revenue <span style="color:#3fd07a;font-weight:700">$514B → $717B</span> (4Y)`, tipTitle: "Revenue (4-year)", tipBody: "Amazon grew annual revenue from $514.0B (2022) to $716.9B (2025) — a ~12% CAGR through a real 2022 growth scare and a 2025-26 AI capex ramp. Growth is driven by AWS, advertising, and a recovering retail margin, not acquisitions." },
      { html: `Gross Margin <span style="color:#3fd07a;font-weight:700">43.8% → 50.3%</span> (4Y)`, tipTitle: "Gross Margin (4-year)", tipBody: "Gross margin expanded from 43.8% (2022) to 50.3% (2025) — the retail/logistics efficiency story alongside AWS/ad mix shift toward higher-margin revenue. This is the clearest single line showing the 2022 operating-margin scare was a real air-pocket, not a permanent impairment." },
      { html: `FCF <span style="color:#f1564b;font-weight:700">−$16.9B → $7.7B</span> (4Y, both ends stressed)`, tipTitle: "Free Cash Flow (4-year)", tipBody: "FCF went from -$16.9B (2022, the growth-scare trough) to a healthy $32.9B (2024), then fell again to just $7.7B (2025) as the AI capex ramp accelerated — and TTM through Q2 2026 is now -$7.6B. Both ends of this window are stressed for different reasons: 2022 was a demand/margin problem, 2025-26 is a capex-timing problem." },
    ],
    verdictBody: "Amazon has compounded revenue at ~12% annually over 4 years while gross margin expanded 6.5 points (43.8% → 50.3%), a real recovery from the 2022 growth scare (ROIC bottomed at 4.1%, FCF went negative, 18,000+ layoffs). By 2024 the business had fully re-earned its premium — ROIC 16.0%, FCF $32.9B — before the 2025-26 AI capex ramp pushed capex/revenue to a window-high 18.4% and FCF back down to $7.7B (TTM now -$7.6B). The retail/AWS/ads franchise itself has proven durable across two very different stress tests; the open question is whether the current capex cycle repeats the 2022-24 recovery pattern or represents a genuinely longer, structurally heavier spend regime.",
    banners: {
      durability: (revCagrPct, rev0, rev9, gmDelta, latestGM, fcf0, latestFCF) => `Revenue compounded at ~${revCagrPct}% annually from $${rev0}B (2022) to $${rev9}B (2025). Gross margin expanded ${gmDelta} points to ${latestGM}%, recovering fully from the 2022 growth scare. FCF swung from $${fcf0}B (2022 trough) to $${latestFCF}B (2025) — itself down from a healthier $32.9B in 2024 as the AI capex ramp accelerated.`,
      value: (latestROIC) => `ROIC of ${latestROIC}% (2025) is a real recovery from the 2022 trough (4.1%) but down from 2024's 16.0% peak — the AI capex ramp is pulling invested capital up faster than near-term operating income. Unlike a steady compounder, Amazon's ROIC has swung by more than 3x across this 4-year window depending on the margin/capex regime — treat any single year's reading with that volatility in mind.`,
      capex: (latestCapex, peakCapex, latestFCF, fy26Guide) => `Capex/revenue of ${latestCapex}% (2025) is the window-high, not a recovery off a peak — it's climbed every year since the 2023 trough (9.2%) as AWS/AI infrastructure spend accelerated, and FY2026 guide of $${fy26Guide}B on a ~$800B revenue base implies an even higher ratio next year. FCF fell to just $${latestFCF}B the same year the ratio peaked. A threat (losing the AI infrastructure race to Azure/GCP) explains the spend; only results — AWS growth converting into durable margin and FCF eventually inflecting — justify it, and that inflection hasn't shown up yet.`,
      mood: (evNow, evAvg) => `EV/EBITDA of ${evNow}× sits close to the 4-year average of ${evAvg}× — not the euphoric multiple expansion seen in some AI-cycle peers, and not a despair discount either. The market is pricing continued AWS execution without yet paying up for it, which is roughly what the BASE case (not BULL) assumes.`,
    },
    revAnnotationsHtml: `<span>2022: <span style="color:var(--tx3)">$514.0B</span> (growth-scare year)</span><span>2025: <span style="color:var(--tx3)">$716.9B</span> (AWS/AI ramp)</span>`,
    roicNote: "Green >15% · Amber 5–15% · Red <5% — AMZN dipped to red in 2022, recovered to green by 2024",
    fcfYieldNote: "FCF yield compressed from 2.0% (2023) to 0.3% (2025) — this reflects genuinely falling FCF, not just a rising stock price, unlike some AI-cycle peers.",
    capexAnnotationsHtml: `<span>2023: <span style="color:#3fd07a">9.2%</span> (post-growth-scare capex discipline)</span><span>2025: <span style="color:#f1564b">18.4%</span> (AI infrastructure ramp, window high)</span>`,
    footnotes: {
      durability: "2022's margin compression (gross margin briefly stalling near 44%, operating margin collapsing to ~2.4%) reflects genuine over-expansion during COVID plus inflation-driven cost pressure — not an accounting artifact. 2023-2025 mark the recovery: gross margin climbed every year, AWS reaccelerated, and advertising scaled into a real profit center. The 2025-26 capex ramp is a different kind of stress test than 2022's — a deliberate, guided investment cycle rather than an unplanned cost overrun — and its resolution is still open.",
      value: "ROIC swung from 4.1% (2022 trough) to 16.0% (2024 peak) back to 13.2% (2025) — a genuinely volatile 4-year window, unlike TSM's steady 17-25% band over 10 years. That volatility is the honest picture: Amazon's returns on capital are more cyclical than a pure-monopoly chokepoint business, which is consistent with this thesis framing AMZN as a 'steady compounder', not a fast generator seed (see the FOLIO note in the footer).",
      capex: "Capex/revenue bottomed at 9.2% in 2023 right after the growth-scare cost discipline, then climbed every year since to an 18.4% window-high in 2025 as AWS/AI infrastructure spend accelerated — and the FY2026 guide of $220B on a run-rate near $800B implies the ratio keeps climbing, not falling, in 2026. The kill-switch for this panel: if capex/revenue keeps rising with NO matching FCF recovery through 2027, the AI buildout has stopped being a growth investment and started being a structural margin drag.",
      mood: "The scenario bands on the other tabs use forward P/E as a cross-check, but AWS revenue growth is the real headline gauge for AMZN — unlike TSM/ASML, Amazon's GAAP EPS is currently distorted by the capex/depreciation cycle in ways that make a clean multiple-only read less reliable. EV/EBITDA is shown here as a capital-structure-neutral mood check: sitting near its own 4-year average right now, not at either extreme.",
    },
    priceChartTitle: "AMZN PRICE · 4-YEAR MONTHLY · 2022–2026",
    priceChartSub: "$ per share · dashed lines = key events",
    priceNowTip: (px, isATH) => `$${px} — where AMZN traded at the end of this chart's window, ${isATH ? "also the highest monthly close in this 4-year window" : "off the cycle high set a couple months earlier"}. The chart shows a real 2022 growth-scare drawdown (-33.7%), a 2023-25 AWS/AI-driven recovery, an April 2025 tariff-panic dip, and the April-June 2026 capex-fear pullback that the Q2 2026 print (not shown here — see the fan chart above) went on to resolve.`,
    ddTip: (minDD) => `${minDD}% — the deepest drop from a prior high in this 4-year window. This occurred in December 2022, during the growth-scare/rate-hike trough (real operating-margin collapse, first-ever mass layoffs — not just macro fear). Amazon recovered and went on to new highs as AWS reaccelerated. Drawdown charts help you visualize what holding through a bad period actually felt like.`,
    ddAnnotationsHtml: `<span>Max drawdown: <span style="color:#f1564b">−33.7%</span> (Dec 2022, growth-scare trough)</span><span>Window end: <span style="color:#e0a83b">−11.9%</span> from the Apr/May 2026 high (this chart cuts off before the Jul 2026 Q2 print)</span>`,
  },
};
