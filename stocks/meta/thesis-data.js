/* ╔══════════════════════════════════════════════════════════════════════════╗
   ║   META · thesis-data.js — ALL per-stock content lives here.              ║
   ║   ███  EDIT EVERYTHING IN THIS FILE EACH QUARTER  ███                    ║
   ║                                                                          ║
   ║   The rendering engine (../engine/thesis-engine.js) contains ZERO        ║
   ║   company-specific strings — every number, narrative, and tooltip        ║
   ║   that mentions META is in this file. Quarterly touch = edit this        ║
   ║   file only, then run: node tools/lint-thesis-data.js META               ║
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

const TICKER_META = { ticker: "META", exchange: "NASDAQ", company: "Meta Platforms, Inc." };
const AS_OF_DATE = "2026-08-04";

// Most recent material dislocation: Q2 2026 earnings (reported 2026-07-29) triggered a
// fresh ~9% two-day drop, distinct in character from prior dislocations — GAAP EPS missed
// by 14% on $2.4B legal charges + $1.18B severance (one-time, and CFO says ex-charges op
// income was +9% YoY), BUT the FY26 capex floor was also raised to $130-145B (from
// $125-145B) while FCF collapsed toward ~$0.8B this quarter — that second piece is a
// genuine, not sentiment-only, shift. Ported unchanged from the pre-migration build.
const DISLOCATION_DATE = "2026-07-29";
const REVERSION_TROUGH = 539;    // the low the stock hit after this shock (2026-07-30 close)
const REVERSION_BASEFLOOR = 600; // bottom of the current BASE band
const REVERSION_PRECEDENT_DAYS = 91; // Q3-2025 recovery precedent, still the best on file

const CASES = {
  bear: {
    key: "bear", label: "BEAR", accent: "#f1564b", glow: "rgba(241,86,75,0.45)",
    target12: "$460 — $560",
    op: "Operational state: ad demand itself is NOT decelerating (Q2 26 rev +28% YoY, ad price +12%, impressions +14%) — the bear case now runs through capital allocation, not demand. Meta just raised the FY26 capex floor to $130-145B while quarterly FCF collapsed to ~$0.8B, and management's answers on AI-spend ROI stay directional rather than quantified. If a future quarter adds genuine ad-side deceleration on top of that capex commitment, this becomes about the core engine, not just spending discipline.",
    breaks: "Ad demand keeps compounding, FCF stabilizes/re-expands as capex growth slows, the DMA compliance review stays benign, and capex ROI starts showing up as a disclosed, quantified number rather than commentary.",
    requires01: "ad / guide quality deteriorates",
    requires02: "capex-to-FCF gap widens further without monetization proof",
  },
  base: {
    key: "base", label: "BASE", accent: "#e0a83b", glow: "rgba(224,168,59,0.40)",
    target12: "$600 — $700",
    op: "Operational state: the Family of Apps is still a cash machine on the top line (28% rev growth, record engagement), AI ad tools keep doing real conversion work (ad price +12% YoY), but GAAP margin compressed to 31% (from 43%) on one-time legal/severance charges and the market's patience for capex-without-quantified-ROI has visibly thinned — the Q2 print beat revenue and still fell ~9%. The multiple regime has re-rated down a turn or two across the board versus six months ago.",
    breaks: "Either ad demand quality genuinely degrades (not just a GAAP-noise quarter), or AI monetization becomes explicit and quantifiable (a disclosed AI-attributed revenue line, not just directional commentary) and forces a re-rating higher.",
    requires01: "solid delivery against guide with intact ADJUSTED margins",
    requires02: "FCF stabilizes even as capex commitment stays elevated",
  },
  bull: {
    key: "bull", label: "BULL", accent: "#3fd07a", glow: "rgba(63,208,122,0.45)",
    target12: "$730 — $870",
    op: "Operational state: AI shifts from cost center to monetization engine with a disclosed, quantified revenue line — not Zuckerberg's 'that's a very technical question' answers — the new subscription stack scales, business-messaging revenue inflects, and the market reframes the raised $130-145B capex floor as proof of a durable ad-ranking moat rather than a risk to free cash flow.",
    breaks: "AI monetization stalls or stays unquantified, subscriptions fail to scale, ad pricing rolls over, or FCF keeps compressing without a visible floor.",
    requires01: "clean ad reacceleration + explicit monetization proof",
    requires02: "margin/FCF recovery as AI leverage compounds despite capex",
  },
};

// THESIS_HISTORY intentionally omitted on this first migration touch — this rebuild is a
// lossless PORT of the 2026-07-31 /update-thesis CASES into the engine-split shape, not a
// Layer-2 audit that rewrote them (incoming === outgoing). The archive starts at META's
// NEXT /update-thesis touch, right before that session's audit overwrites CASES — same
// discipline NVDA's and AMZN's migrations followed, per CLAUDE.md's THESIS_HISTORY note
// and the lint's own treatment of a present-but-empty array as malformed.

const FALLBACK_PRICE = 589.65;

const LIVE_PRICE = {
  enabled: true,
  symbol: "META",
  provider: "yahoo",
  corsProxy: "https://api.allorigins.win/get?url=",
  finnhubToken: "",
};

// ALERT — buy-trigger pre-commitment. Canonical source is PF_ALERTS.META in
// stocks/portfolio/portfolio-data.js (buyFloor 600, unchanged by this migration); this
// copy is a FALLBACK for offline opens only.
const ALERT = {
  symbol: "META",
  buyFloor: 600,
  thesisIntact: true,
  asOf: AS_OF_DATE,
  nextEarnings: "~2026-10-28",
};

const HISTORY = [
  { q: "Q2 25", p: 720 }, { q: "Q3 25", p: 760 }, { q: "Q4 25", p: 700 },
  { q: "Q1 26", p: 520 }, { q: "Q2 26", p: 539 }, { q: "NOW", p: FALLBACK_PRICE },
];
const PROJ_END = { bear: 510, base: 650, bull: 800 };
const FUTURE_Q = ["Q3 2026", "Q4 2026", "Q1 2027", "Q2 2027"];

const SIGNALS = {
  bear: [
    { name: "Ad Price-per-Ad Trend", unit: "% YoY", tag: "MATCH", next: "Oct 28, 2026", val: "BEAR +4% to +7%", guide: "Q2 +12%", pos: 0.22 },
    { name: "Revenue vs $61–64B Guide", unit: "$B", tag: "WATCH", next: "Oct 28, 2026", val: "BEAR ≤ $61B", guide: "GUIDE $61–64B", pos: 0.18 },
    { name: "EU DMA Compliance Risk", unit: "REV", tag: "WATCH", next: "Open 2026", val: "BEAR −EU rev impact", guide: "~25% ad rev", pos: 0.3 },
  ],
  base: [
    { name: "Ad Price-per-Ad Trend", unit: "% YoY", tag: "MATCH", next: "Oct 28, 2026", val: "BASE +9% to +12%", guide: "Q2 +12%", pos: 0.58 },
    { name: "Revenue vs $61–64B Guide", unit: "$B", tag: "WATCH", next: "Oct 28, 2026", val: "BASE $62–63B", guide: "GUIDE $61–64B", pos: 0.55 },
    { name: "Operating Margin", unit: "%", tag: "MISS", next: "Oct 28, 2026", val: "Q2 ACTUAL 31% (GAAP)", guide: "Q1 41% / expected ~41%", pos: 0.22 },
  ],
  bull: [
    { name: "Ad Price-per-Ad Trend", unit: "% YoY", tag: "MATCH", next: "Oct 28, 2026", val: "BULL +13%+", guide: "Q2 +12%", pos: 0.6 },
    { name: "Revenue vs $61–64B Guide", unit: "$B", tag: "WATCH", next: "Oct 28, 2026", val: "BULL ≥ $64B", guide: "GUIDE $61–64B", pos: 0.86 },
    { name: "Subscription Revenue Disclosure", unit: "NEW", tag: "WATCH", next: "Oct 28, 2026", val: "BULL explicit ramp", guide: "still not broken out", pos: 0.55 },
  ],
};
const MARGIN = {
  bear: [
    { name: "Adjusted Operating Margin", tag: "MATCH", next: "Oct 28, 2026", pos: 0.45 },
    { name: "Capex Guidance Trajectory", tag: "MISS", next: "Oct 28, 2026", pos: 0.12 },
  ],
  base: [
    { name: "Adjusted Operating Margin", tag: "BEAT", next: "Oct 28, 2026", pos: 0.62 },
    { name: "Capex Guidance Trajectory", tag: "MISS", next: "Oct 28, 2026", pos: 0.2 },
  ],
  bull: [
    { name: "Adjusted Operating Margin", tag: "BEAT", next: "Oct 28, 2026", pos: 0.7 },
    { name: "Capex Guidance Trajectory", tag: "WATCH", next: "Oct 28, 2026", pos: 0.3 },
  ],
};

// HEADLINE GAUGE: Total Revenue ($B quarterly) — swapped from the pre-migration build's
// "AI-Monetized Share of Incremental Ad Revenue %" hero KPI (a directional, undisclosed
// estimate) to Total Revenue, the same fix NVDA's migration required (see CLAUDE.md):
// the shared engine's "price-implied full-year revenue" card on THE CURRENT tab computes
// fyRevBase = KPI_HIST + KPI_PROJ.base[0..2] and checks it against VAL_CONFIG.prior_fy_rev_b
// — that only produces a meaningful number if KPI_HIST/KPI_PROJ are quarterly revenue in
// $B. AI-monetization itself isn't dropped — it's still fully discussed in CASES.op and the
// SIGNALS panel ("Subscription Revenue Disclosure", ad-price trend) exactly as before.
const KPI_HIST = 60.8; // Q2 2026 actual total revenue ($B), +28% YoY
const KPI_PROJ = {
  bear: [61, 66, 61, 64],
  base: [62.5, 73, 68, 72],
  bull: [65, 78, 72, 77],
};

// TRACK RECORD — append newest to end; dashboard keeps last TRACK_WINDOW. Ported
// unchanged from the pre-migration build (no new earnings since the 2026-07-31 touch).
const TRACK_ALL = [
  { q: "Q4 2024", date: "2025-01", post: 690, reaction: "+", bear: [480, 540], base: [600, 700], bull: [760, 860], landed: "base", conf: "med" },
  { q: "Q1 2025", date: "2025-04", post: 600, reaction: "+", bear: [470, 530], base: [580, 680], bull: [720, 820], landed: "bear→base", conf: "med" },
  { q: "Q2 2025", date: "2025-07", post: 775, reaction: "++", bear: [560, 640], base: [700, 800], bull: [860, 960], landed: "bull", conf: "high" },
  { q: "Q3 2025", date: "2025-10", post: 635, reaction: "−−", bear: [560, 640], base: [720, 820], bull: [880, 980], landed: "bear", conf: "high" },
  { q: "Q4 2025", date: "2026-01", post: 715, reaction: "+", bear: [560, 630], base: [700, 800], bull: [880, 980], landed: "base", conf: "high" },
  { q: "Q1 2026", date: "2026-04", post: 612, reaction: "−", bear: [510, 560], base: [700, 800], bull: [900, 1015], landed: "bear", conf: "high" },
  { q: "Q2 2026", date: "2026-07", post: 539, reaction: "−−", bear: [480, 560], base: [700, 800], bull: [900, 1015], landed: "bear", conf: "high" },
];
const TRACK_WINDOW = 6;

// THE PAST — annual history (Wisesheets 10-Q/10-K facts, SEC-cited). Only 4 fiscal years
// (2022-2025) available, not TSM's 10 — Wisesheets' free-tier plan caps history at 5
// years, and the earliest aligned monthly price point this session was 2022-08, one month
// short of a clean Dec-2021 mark, so FY2021 was dropped rather than paired with a stale or
// missing price point — same call GOOGL's and AMZN's migrations made. Real, sourced data
// throughout. ROIC = NOPAT (operating income × (1 − effective tax rate)) / (total debt +
// equity − cash & short-term investments); EV/EBITDA off year-end close × diluted shares.
const PAST_YEARS       = ["2022","2023","2024","2025"];
const PAST_REV         = [116.6, 134.9, 164.5, 201.0];
const PAST_GM          = [78.3,  80.8,  81.7,  82.0];
const PAST_FCF         = [19.3,  44.1,  54.1,  46.1];
const PAST_ROIC        = [20.9,  30.9,  39.9,  26.7];
const PAST_EVEBITDA    = [8.3,   15.6,  17.7,  16.7];
const PAST_FCF_YIELD   = [5.9,   4.7,   3.5,   2.7];
const PAST_CAPEX_REV   = [26.7,  20.0,  22.6,  34.7];
const PRICE_M_LABELS = ["2022-08","2022-09","2022-10","2022-11","2022-12","2023-01","2023-02","2023-03","2023-04","2023-05","2023-06","2023-07","2023-08","2023-09","2023-10","2023-11","2023-12","2024-01","2024-02","2024-03","2024-04","2024-05","2024-06","2024-07","2024-08","2024-09","2024-10","2024-11","2024-12","2025-01","2025-02","2025-03","2025-04","2025-05","2025-06","2025-07","2025-08","2025-09","2025-10","2025-11","2025-12","2026-01","2026-02","2026-03","2026-04","2026-05","2026-06","2026-07"];
const PRICE_M = [162.93,135.68,93.16,118.10,120.34,148.97,174.94,211.94,240.32,264.72,286.98,318.60,295.89,300.21,301.27,327.15,353.96,390.14,490.13,485.58,430.17,466.83,504.22,474.83,521.31,572.44,567.58,574.32,585.51,689.18,668.20,576.36,549.00,647.49,738.09,773.44,738.70,734.38,648.35,647.95,660.09,716.50,648.18,572.13,611.91,632.51,563.29,556.71];
const PRICE_M_DD = [0.0,-16.7,-42.8,-27.5,-26.1,-8.6,0.0,0.0,0.0,0.0,0.0,0.0,-7.1,-5.8,-5.4,0.0,0.0,0.0,0.0,-0.9,-12.2,-4.8,0.0,-5.8,0.0,0.0,-0.8,0.0,0.0,0.0,-3.0,-16.4,-20.3,-6.0,0.0,0.0,-4.5,-5.1,-16.2,-16.2,-14.7,-7.4,-16.2,-26.0,-20.9,-18.2,-27.2,-28.0];
const PAST_EVENTS = [
  { idx: 2,  label: "Efficiency-Era Trough", note: "Oct 2022 — the ad-recession + 'metaverse capex fear' bottom: iOS ATT ad-targeting headwinds, a weak macro ad market, and investor alarm at Reality Labs' losses drove the deepest drawdown in this window (-42.8% from the Aug 2022 relative high). Meta announced its first mass layoffs (11,000 roles) a few weeks later and declared 2023 the 'Year of Efficiency' — the real business air-pocket this thesis's re-rating recovered from." },
  { idx: 16, label: "Year-of-Efficiency Re-Rating", note: "Dec 2023 onward — cost discipline (headcount cuts, flattened org) combined with Reels/Advantage+ ad-tooling monetizing well started a sustained re-rating that carried into the 2024-25 AI-ad-tools story." },
  { idx: 35, label: "Cycle High", note: "Jul 2025 — an all-time high ($773.44) on continued ad-price/impression growth and early AI-ranking monetization proof, just ahead of the capex-guidance debates that followed." },
  { idx: 39, label: "AI-Capex-Fear Pullback", note: "Nov 2025 — a broad hyperscaler selloff on AI-infrastructure-financing and circular-vendor-deal concerns hit META alongside peers; no Meta-specific miss, but the stock gave back ~16% from the Jul 2025 high." },
  { idx: 47, label: "Q2 2026 Capex/FCF Selloff", note: "Jul 2026 — Q2 2026 beat on revenue (+28% YoY) but posted a GAAP EPS miss on $2.4B legal charges + $1.18B severance, alongside a raised $130-145B FY26 capex floor and free cash flow collapsing to ~$0.8B for the quarter. This is the DISLOCATION_DATE episode the Reversion Clock tracks — the clearest 'cost framing panics markets' example in this window." },
];

const VAL_CONFIG = {
  ntm_eps:              33.50,   // web search — implied from forward P/E 16.13x at $539.03 (financecharts.com) and 2026 consensus EPS $32.81 (simplywall.st), per the 2026-07-31 provenance snapshot
  shares_b:              2.56,   // Q1 2026 diluted shares outstanding (Wisesheets 10-Q)
  fcf_ntm_b:             40.0,   // TTM through Q2 2026 (Q2 25 + Q3 25 + Q4 25 + Q1 26 rolled forward minus Q2 25, plus Q2 26's $0.784B actual) — down from FY2025's $46.1B annual pace as the capex ramp accelerates
  risk_free_pct:         4.35,
  default_discount_pct:  9.5,
  default_terminal_pe:   20,
  dcf_years:              5,
  capex_fy26_guide_b:   138,      // midpoint of the raised $130-145B FY26 guide (low end raised from $125B on the Q2 2026 call)
  prior_fy_rev_b:       201.0,    // last full fiscal year actual revenue (FY2025, $200.966B)
  prior_fy_label:       "2025",
  pe_trough: 12, pe_bear_hi: 16, pe_normal_lo: 17, pe_normal_hi: 21, pe_bull_lo: 22, pe_peak: 28,
  peers: [
    { t: "META",  fpe: 17.6,  ev_eb: 16.7, fcf_y: 2.7,  note: "Ads-only (no cloud upside); currently trades at a discount to GOOGL/AMZN despite comparable-or-better margins — the multiple most directly reflects the market's capex/FCF skepticism, not a demand problem" },
    { t: "GOOGL", fpe: 26.11, ev_eb: 25.4, fcf_y: 1.4,  note: "Search + Cloud dual compounder — the closest mega-cap ad-platform comp; no pure-play ad-tech peer exists at comparable scale" },
    { t: "MSFT",  fpe: 19.53, ev_eb: 15.0, fcf_y: 2.5,  note: "Azure + Copilot — still guided to GROW FCF in 2026, the cleanest capex-monetization story of this peer set" },
    { t: "AMZN",  fpe: 27.61, ev_eb: 16.1, fcf_y: -0.3, note: "AWS + retail + ads; negative FCF yield, the same capex-vs-cash tension META's own Q2 2026 print showed" },
  ],
};

const SIGNAL_HELP = {
  "Ad Price-per-Ad Trend": "How much advertisers pay for each ad, compared to a year ago. If it keeps rising, it means businesses find Meta's ads valuable — a sign the core money-machine is healthy. Q2 2026 actual: +12% YoY, matching Q1's pace — steady, not accelerating or decelerating.",
  "Revenue vs $61–64B Guide": "Meta told investors to expect $61–64 billion in sales for Q3 2026. This checks whether they actually hit that target. Beating it = strong demand; missing it = warning sign. (Q2 2026 came in at $60.8B, near the top of its own $58–61B guide.)",
  "EU DMA Compliance Risk": "Europe has a strict digital law (the DMA). Meta already lost the big fight — it was fined €200m in 2025 and changed its ad model in January 2026. The live risk now: if the EU decides that new model STILL doesn't comply, Meta faces fines of up to 5% of daily global sales. Meta appealed the original decision (filed July 2025) and the Commission is still reviewing the updated model — no new ruling landed this quarter. Europe is about a quarter of Meta's ad money, so it matters.",
  "Operating Margin": "Out of every dollar of sales, how much is left as profit after running costs, on a GAAP (unadjusted) basis. Q2 2026 actual: 31%, down sharply from 43% a year ago — but almost all of that drop was two one-time items ($2.4B in legal charges + $1.18B in severance from May layoffs), not an operating deterioration. See 'Adjusted Operating Margin' for the ex-charges view.",
  "Subscription Revenue Disclosure": "Meta recently started charging for ad-free apps and a paid AI assistant. This watches whether they reveal real money coming in from subscriptions — a brand-new income stream beyond ads. Still not broken out as its own disclosed line as of Q2 2026.",
  "Adjusted Operating Margin": "Same idea as profit margin — how much of each sales dollar becomes profit — adjusted to strip out one-off items. Management said Q2 2026 operating income, excluding the legal and severance charges, was actually about 9% HIGHER than a year ago — the underlying business held up better than the GAAP headline suggests.",
  "Capex Guidance Trajectory": "'Capex' = how much Meta plans to spend building AI data centers. Q2 2026 raised the FY2026 range to $130–145 billion (from $125–145B) — raising the LOW end, which is effectively a promise that spending won't come in light. Quarterly free cash flow has correspondingly collapsed toward ~$0.8B. Investors get nervous when it rises without obvious payoff.",
};
const TAG_HELP = {
  BEAT: "doing better than expected — a good sign.",
  MATCH: "roughly in line with expectations — steady, no surprises.",
  MISS: "falling short of expectations — a worry.",
  WATCH: "not decided yet — keep an eye on it.",
};

const THESIS_ITEMS = [
  { key: "adDemand",    label: "Ad price/impressions holding double-digit growth", note: "Q2 2026: ad price +12% YoY, impressions +14% YoY — demand itself is not the problem" },
  { key: "adjMargin",   label: "Adjusted operating margin holding vs prior year",   note: "Q2 2026 ex-charges op income +9% YoY, per management — GAAP margin (31%) was hit by one-time items" },
  { key: "fcfTrend",    label: "Free cash flow stabilizes / stops compressing",     note: "Collapsed to ~$0.8B this quarter on the capex ramp — the still-unmet leg of the base/bull case" },
  { key: "aiMonetized", label: "AI monetization becomes an explicit, quantified line", note: "Still directional commentary only as of Q2 2026 — the key bull-case unlock" },
];
const PRICE_ZONES = [
  { label: "BEAR", lo: 460, hi: 560, mid: 510, color: "#f1564b", action: "Exit / reduce if thesis also breaking" },
  { label: "BASE", lo: 600, hi: 700, mid: 650, color: "#e0a83b", action: "Small add OK if thesis intact" },
  { label: "BULL", lo: 730, hi: 870, mid: 800, color: "#3fd07a", action: "Let it ride — don't chase" },
];

// ── Chart geometry / axis ranges (per-stock: depends on price scale) ─────────
const GEOM = {
  priceMin: 380, priceMax: 900,
  fanGrid: [900, 800, 700, 600, 500, 400],
  fanYears: ["2025", "2026", "2027"],
  trackMin: 400, trackMax: 1040,
  trackGrid: [1000, 900, 800, 700, 600, 500],
  kpiMin: 55, kpiMax: 82,
  visLo: 400, visHi: 920,
  nowZoneLo: 600, nowZoneHi: 700,
};

/* ── TEXT — every company-specific narrative/tooltip the engine renders. ──────
   Values are strings, HTML strings (rendered with dangerouslySetInnerHTML), or
   template functions the engine calls with computed values. If it mentions the
   company, a quarter, a guide number, or an event, it belongs HERE, not in the
   engine — that rule is what makes the engine safely reusable across stocks. */
const TEXT = {
  priceTipLive: (px, at, asOf) => `Live quote: $${px} (fetched ${at}). The price is real-time, but the scenario bands and EPS are still as of ${asOf} — only the price-derived figures (scenario returns, P/E, band position) update live.`,
  priceTipStatic: (px, asOf, liveEnabled) => `$${px} as of ${asOf} — ${liveEnabled ? "live fetch unavailable (offline or blocked), using the saved price" : "static price (live fetch disabled)"}. Next earnings: ~Oct 28, 2026 (Q3 2026, unconfirmed date).`,
  footerDisclaimer: (asOf) => `Illustrative scenario framing built on public consensus & estimates as of ${asOf} — not a prediction and not financial advice. Price ranges are scenario mid-bands; KPI markers are positional, not literal. Valuation ruler: forward GAAP EPS × P/E multiple. Data inputs will move with every print. Next earnings: ~Oct 28, 2026 (Q3 2026, unconfirmed date).`,

  fanHistory: "The solid white line is Meta's actual share price over the past year and a bit. You can see two big drops — early 2026 (capex-fear selloff) and late July 2026 (Q2 earnings: revenue beat but a GAAP EPS miss on one-time charges, plus a raised capex floor and collapsing free cash flow).",
  fanNow: (px) => `Meta trades around $${px} right now. This dot is 'today' — everything left of it is history, everything right is forecast. Q2 2026 beat on revenue (+28% YoY, ad price +12%, impressions +14%) but GAAP EPS missed on $2.4B legal charges + $1.18B severance, while the FY26 capex floor was raised to $130-145B and quarterly FCF collapsed to ~$0.8B.`,
  fanPastDot: (q, p) => `At the end of ${q}, Meta was around $${p}.`,

  segmentedExplain: {
    bear: ["The pessimistic scenario", "Click to see what META looks like if the capex-vs-cash-flow squeeze keeps tightening without ad demand offsetting it — free cash flow stays near zero, the multiple stays depressed, and regulators in Europe take a bite. The price would likely settle in the $460–560 range."],
    base: ["The most-likely scenario", "Click for the 'steady as she goes' view — ad demand keeps compounding at a healthy pace, GAAP margin recovers now that the one-time legal/severance charges roll off, but the market keeps a lower multiple on the stock until AI capex shows quantified payoff. Price drifts toward $600–700."],
    bull: ["The optimistic scenario", "Click to see the upside — AI monetization becomes an explicit, disclosed revenue line, free cash flow re-expands even with elevated capex, and the market re-rates the multiple back toward peers. Price could run to $730–870."],
  },

  kpiBaseline: (val) => `This is the most recent real number: Meta reported $${val}B in total revenue in Q2 2026, up 28% year-over-year. The bars to the right are scenario forecasts for where it goes next.`,
  kpiForecast: (label, val) => `In this scenario, Meta's total quarterly revenue is projected to reach about $${val}B by ${label}. Taller bar = more sales — but watch the margin and FCF signals alongside this to see if it converts to profit.`,

  reversion: {
    header: "REVERSION CLOCK · vs Q3-2025 PRECEDENT",
    timeTip: "Last time the stock crashed on spending fears (Oct 2025), it took about 3 months to recover to the 'middle' price zone. This bar shows how far along we are this time. The green line is the 3-month mark.",
    priceTip: (trough, baseFloor, now) => `The stock bottomed at $${trough} and needs to reach $${baseFloor} to be back in the 'middle' zone. It's at $${now} now — about ${Math.round(((now - trough) / (baseFloor - trough)) * 100)}% of the way there.`,
    footerHtml: (baseFloor, precedentDays, now) => `The Q3-2025 precedent took ~3 months report-to-base-reversion (a sentiment-only dislocation). Price has retraced toward the $${baseFloor} base floor from the $539 trough — currently $${now}. Caveat: this dislocation has a real capex-vs-FCF component the prior two didn't, so a full reversion is less assured — the Oct 28 2026 (Q3 2026) print is the next real test. <span style="color:#e0a83b;font-weight:700">Has the thesis actually broken, or is this fear?</span>`,
  },

  track: {
    lastDot: (post, nowPx) => `META is at ~$${nowPx} now — up from the $${post} post-Q2-2026-earnings trough, but still inside or near the pessimistic (red) zone even though the business is doing well. That gap is the whole point of this dashboard. Next dot: Q3 2026 earnings (~Oct 28, 2026).`,
    pastDot: (q, post) => `After ${q} earnings, the price actually traded around $${post}. Compare this dot to the colored bars behind it to see if the prediction was right.`,
    readoutHtml: (hits, n, nowPx) => `Current price <span style="color:var(--blue-soft);font-weight:700">$${nowPx}</span> sits <span style="color:#f1564b;font-weight:700">inside or near the BEAR band</span>, while the Q2 2026 business itself printed <span style="color:#e0a83b;font-weight:700">base-to-bull</span> demand (28% rev growth, ad price +12%, impressions +14%) alongside a genuinely <span style="color:#f1564b;font-weight:700">weaker capital-allocation picture</span> (GAAP margin 31% vs 43% a year ago, capex floor raised to $130–145B, FCF ~$0.8B this quarter). Street analysts cut price targets (UBS $715, TD Cowen $750, Evercore $820) but kept Buy/Outperform ratings — their post-print base case still clusters well above where the stock is trading. Price has tracked <span style="color:#3fd07a;font-weight:700">base-or-better in ${hits} of ${n} quarters</span> shown.`,
    footnote: "⚠ Bands are reconstructed now (anchored to each date's forward EPS & multiple regime), not archived in real time — treat levels as directional, especially \"lower-conf\" quarters. Reversion pattern now rests on n=3 dislocations, and unlike the first two this one has a real (not purely sentiment) component — capex commitment vs. FCF, not just capex fear. Don't assume automatic reversion this time; watch Q3 FCF and capex trajectory, not just price action.",
  },

  current: {
    statusNarrative: {
      broken: "Multiple signals missed. Thesis is under pressure — review the kill-switch criteria.",
      watch:  "Revenue/ad beat but margin or FCF disappointed further, or DMA risk escalated. Core thesis tracking — the Oct 28, 2026 print is the next test. Not broken, but watch closely.",
      intact: "Ad demand individually beat every threshold this thesis had set — the core Family-of-Apps engine remains intact even though AI monetization hasn't confirmed the second bull-case leg and FCF took a real, if likely temporary, hit.",
    },
    panelTipStory: "Checks whether the original reasons to own META are playing out. Counts signals from the Q2 2026 print — ad price trend, revenue vs guide, operating margin, adjusted margin, capex trajectory, DMA risk. 0-1 miss = thesis intact. 2 misses = watch. 3+ = exit. Click to see KPI bars and kill-switch.",
    watchChipHtml: `🔑 WATCH: Q3 2026 revenue vs <span style="color:#e0a83b;font-weight:700">$61–64B</span> guide + FCF trend · ~Oct 28, 2026`,
    exitChipHtml: `⚠ EXIT IF: ad demand quality deteriorates, or capex-to-FCF gap widens further without monetization proof`,
    verdictBody: {
      broken:     (px) => `META at $${px}: kill-switch criteria met. Price position is irrelevant — signals say the ad-demand-plus-AI-monetization thesis is no longer playing out. The question is not whether to add; it is how much to reduce.`,
      watchBelow: (px) => `META at $${px} sits below the base floor but signals are mixed. Price is attractive, but adding into a weakening thesis is the wrong sequence. Wait for the Q3 2026 print (~Oct 28) to confirm or deny the pattern before deploying capital.`,
      below:      (px) => `META at $${px} sits below the base floor with the thesis intact — ad price, impressions, and revenue all beat, and the GAAP margin miss was almost entirely one-time legal/severance charges (management says ex-charges op income was +9% YoY). The market gave back the pre-print rally anyway on capex/FCF optics; the fundamentals say it's largely sentiment, not demand destruction — but the FCF trend genuinely needs to stabilize within a quarter or two to keep saying that.`,
      inBase:     (px, statusWord) => `META at $${px} is inside the base range. Thesis ${statusWord} and price is fair. Watch Q3 2026 ad demand and whether free cash flow stabilizes around Oct 28 — continued strength opens the bull case; a genuine ad-demand deterioration or a widening capex-to-FCF gap reopens the bear.`,
      above:      (px) => `META at $${px} is above the base ceiling. The bull case — AI monetization becoming an explicit, quantified revenue line alongside FCF recovery — needs to play out to justify entry. If already in, hold. If adding, wait for a pullback toward the base floor.`,
    },
    kpiTitle: "Total Revenue",
    kpiSub: "$B quarterly · HIGHER BETTER",
    kpiMeasures: "Meta's total quarterly revenue (Family of Apps ads + Reality Labs). Q2 2026 printed $60.8B, +28% YoY — the cleanest read on whether ad demand itself is holding up, independent of the GAAP margin noise from one-time charges.",
    kpiRequires: {
      bull: "Revenue clears the top of the $61–64B guide each quarter and AI monetization becomes an explicit, disclosed revenue line alongside it; FCF recovers.",
      base: "Revenue lands mid-guide each quarter, ad price/impression growth stays double-digit, but AI monetization stays directional-only and FCF stays pressured.",
      bear: "Revenue undershoots guide, ad demand quality genuinely deteriorates (not just GAAP noise), and the capex-to-FCF gap widens without monetization proof.",
    },
    group1Title: "Demand Trajectory &amp; Guide Quality",
    group2Title: "Margin &amp; Earnings Quality",
    killSwitch: "Ad demand quality genuinely deteriorates (not a one-quarter GAAP-noise miss), or the capex-to-FCF gap keeps widening for multiple quarters without any quantified AI-monetization proof — exit / reduce. That is demand destruction or a cash-flow problem, not noise.",
    priceBanner: {
      below:  (px, baseLo) => `At $${px}, price is $${(baseLo - px).toFixed(0)} below the base floor. Market is pricing in capex/FCF fear after a real, if likely temporary, negative-FCF-adjacent quarter — not a demand problem. Historically the window patient buyers use, but confirm the FCF trend before assuming it's pure sentiment.`,
      inBase: (px) => `At $${px}, price is inside the base range. Fair value — not a discount, not expensive.`,
      above:  (px, baseHi) => `At $${px}, price is $${(px - baseHi).toFixed(0)} above the base ceiling. The bull thesis needs to play out in full.`,
    },
    moodBanner: (currentPE, loPE, hiPE) => `At ${currentPE}× forward P/E, the market is pricing in some ad-demand caution and lingering capex/FCF concern — the multiple sits ${currentPE < loPE ? "below" : currentPE > hiPE ? "above" : "inside"} the normal band (${loPE}–${hiPE}×), a real compression versus where the stock traded just before the Q2 print, driven by cost-flow optics more than the underlying ad-demand beat.`,
    cagrNotes: {
      low:  "Low bar — not priced for perfection. Even moderate ad-demand execution justifies the price.",
      mid:  "Moderate bar — requires ad demand to hold double-digit growth and FCF to stabilize.",
      high: "High bar — requires AI monetization to become explicit AND FCF to recover, both at once.",
    },
    fy26CardTip: (fy26) => `Adding Q2 2026's actual $60.8B to base-case Q3 2026 – Q1 2027 projections gives a rolling four-quarter run rate of roughly $${fy26}B, up from $201.0B in full-year 2025 — a real step up even before the bull case's explicit AI-monetization line kicks in. That's what the base case — and roughly today's price — already assumes.`,
    fy26CardHtml: (fy26, growthPct) => `Q2 2026 actual plus base-case forward quarters sum to roughly <span style="color:var(--blue-soft);font-weight:700">$${fy26}B</span> on a rolling four-quarter basis — the growth path today's price already assumes. Full-year 2025 revenue was <span style="color:#3fd07a">$201.0B</span>, so this implies <em>~${growthPct}%</em> growth on that base.`,
    peerCommentary: (currentPE) => `At ${currentPE}× NTM P/E, META trades at a discount to GOOGL (~26.1×) and AMZN (~27.6×) and roughly in line with MSFT (~19.5×) among mega-cap AI-capex peers — all sharing some version of the same capex-vs-FCF tension this quarter. MSFT stands out as the only peer still guided to GROW free cash flow in 2026; GOOGL and AMZN are both facing their own FCF air-pockets, same direction as META's own Q2 collapse to ~$0.8B. META's discount to GOOGL/AMZN is earned by the market's skepticism on AI-spend ROI (still directional commentary, not a quantified revenue line) — that gap is exactly what the bull case needs to close.`,
  },

  future: {
    scenarioTips: {
      bear: "Triggered by: ad demand quality genuinely deteriorating, or the capex-to-FCF gap widening further without monetization proof. Multiple compresses toward the 12-16× trough zone. Note: at current price, bear downside is smaller than it was pre-Q2 given the price has already pulled back.",
      base: (loPE, hiPE) => `Ad demand keeps compounding at a healthy pace, GAAP margin recovers as one-time charges roll off, but the market keeps a lower multiple until AI capex shows quantified payoff. P/E holds in the normal ${loPE}–${hiPE}× band. Modestly positive return from here as the stock re-tests the base band.`,
      bull: (currentPE) => `AI monetization becomes an explicit, disclosed revenue line and FCF re-expands even with elevated capex. Multiple re-rates from ~${currentPE}× toward the bull zone, closing the gap to the bull target.`,
    },
    downsideChevronTip: "Kill-switch: ad demand quality deteriorates, or the capex-to-FCF gap widens further without monetization proof = exit / reduce.",
    dislocEventName: "the Q2 2026 capex/FCF selloff",
    dislocLabel: "SINCE JUL 2026 EARNINGS TROUGH",
    bearPriceTip: (bearMid, bearLo, bearHi, peTrough, peBearHi) => `$${bearMid} is the midpoint of the bear case range ($${bearLo}–$${bearHi}). This assumes ad demand quality deteriorates and the capex-to-FCF gap keeps widening, and the multiple compresses toward the ${peTrough}–${peBearHi}× trough zone. The kill-switch is genuine ad-demand deterioration or a widening capex-to-FCF gap without monetization proof — if it triggers, do not average down.`,
    killSwitchTip: "A kill-switch is a pre-committed exit rule you set BEFORE you own the position — when you are thinking clearly. If ad demand quality genuinely deteriorates, or the capex-to-FCF gap keeps widening for multiple quarters without any quantified AI-monetization proof, the thesis is broken: that's demand weakness or a cash-flow problem, not timing. Do not average down into a broken thesis — the market is telling you something. No debate, no rationalisation. Exit.",
    killSwitchTipNote: "Ad demand quality deteriorates, or capex-to-FCF gap widens further without monetization proof. Either one. No debate.",
    killSwitchHtml: `<strong style="color:var(--title)">Ad demand quality genuinely deteriorates, or the capex-to-FCF gap keeps widening without any quantified AI-monetization proof</strong> → exit or reduce. No debate. Do not average down into a broken thesis.`,
    nextCheck: "Next check: Q3 2026 earnings (~Oct 28, 2026)",
    downsideFootnote: (px, peTrough, peBearHi) => `Bear case scenario: ad demand deteriorates or the capex-to-FCF gap widens further. Assumes a multiple compression toward ${peTrough}–${peBearHi}× on roughly flat EPS. Position loss is illustrative at $${px} entry.`,
    multipleSummary: (peNow, loPE, hiPE) => `At ~${peNow}× NTM P/E, META sits ${peNow < loPE ? "below" : peNow > hiPE ? "above" : "inside"} its normal range (${loPE}–${hiPE}×) — a real compression from where it traded just before the Q2 2026 print, driven by capex/FCF optics rather than the ad-demand beat itself.`,
    peBarTipSuffix: "P/E uses consensus NTM EPS blending Q2 2026's GAAP miss (one-time charges) with a more normal run-rate for the remaining quarters.",
    deepValueZoneNote: "Historically cheap for this business relative to its own re-rated history. A real entry window if the thesis holds.",
    dislocPrecedent: (baseFloor) => `Historical precedent: the Q3-2025 capex-fear dislocation resolved within the 91-day base-reversion window when the fundamentals stayed intact. Base floor: $${baseFloor}.`,
    regretHtml: (currentPE) => `Q3 2026 revenue <strong style="color:#3fd07a">clears the top of the $61–64B guide</strong> AND free cash flow visibly stabilizes or recovers. That would confirm Q2's ad-demand beat and GAAP miss were a temporary air-pocket, not a peak, re-rate the stock from ~${currentPE}× toward the bull zone, and close today's entry window.`,
    regretTip: "Charlie Munger's inversion: instead of asking 'why should I buy?', ask 'what would I have to believe happened, in hindsight, to wish I had bought more?' If Q3 2026 clears guide and FCF stabilizes, today's entry window will close fast. This question is not about FOMO — it is about sizing correctly for your conviction.",
    chips: [
      { label: "KILL-SWITCH: AD DEMAND BREAKS, OR CAPEX/FCF GAP WIDENS → EXIT", col: "#f1564b" },
      { label: "REGRET IF: REVENUE CLEARS GUIDE + FCF STABILIZES",              col: "#3fd07a" },
      { label: "NEXT CHECK: ~OCT 28, 2026 EARNINGS",                           col: "#2f6dff" },
    ],
    signalFootnote: (ntmEps) => `P/E uses consensus NTM EPS $${ntmEps} — blends Q2 2026's GAAP-charge-distorted quarter with a more normal run-rate assumption for the remaining quarters.`,
  },

  past: {
    cardTips: {
      durability: (revCagrPct) => `Looks at Revenue, Gross Margin, and Free Cash Flow over the last 4 fiscal years (Wisesheets' free-tier history cap). We want upward trends that hold through cycles — not spike-and-crash. META grew revenue at ~${revCagrPct}% CAGR while recovering fully from the 2022 ad-recession/metaverse-capex scare, with gross margin expanding from 78.3% to 82.0% even as capex intensity climbed toward the AI buildout.`,
      value: (latestROIC) => `ROIC (Return on Invested Capital) measures how efficiently management deploys capital. Above WACC (~9-10% for a company this size) = value creation. Below = value destruction. META's ROIC swung from 20.9% (2022, still recovering from the efficiency-era trough) to a peak of 39.9% (2024) before dipping to ${latestROIC}% in 2025 as the AI capex ramp expanded invested capital faster than operating income grew.`,
      capex: (peakCapex, latestCapex, latestFCF) => `Capex as a % of revenue shows how much of every dollar gets reinvested before cash reaches shareholders. Capex/revenue climbed from 20.0% (2023, post-efficiency-era trough) to a window-high ${latestCapex}% (2025) as the AI buildout accelerated — and FCF actually fell to $${latestFCF}B the same year even as revenue kept growing, the clearest sign the capex ramp is now outrunning cash generation.`,
      mood: (evNow, evAvg) => `EV/EBITDA vs its own 4-year average tells you whether the market is paying a premium or discount for this business. Current EV/EBITDA of ${evNow}× sits below the 4-year average of ~${evAvg}× — the market has pulled back the AI-ad-tools re-rating premium after the Q2 2026 capex/FCF scare, even though the underlying multiple is still far above the 2022 trough (8.3×).`,
    },
    stats: [
      { html: `Revenue <span style="color:#3fd07a;font-weight:700">$116.6B → $201.0B</span> (4Y)`, tipTitle: "Revenue (4-year)", tipBody: "META grew annual revenue from $116.6B (2022) to $201.0B (2025) — a ~14.8% CAGR, recovering fully from the 2022 ad-recession trough and accelerating as AI ad-ranking tools (Advantage+, Reels monetization) took hold." },
      { html: `FCF <span style="color:#3fd07a;font-weight:700">$19.3B → $46.1B</span> (4Y)`, tipTitle: "Free Cash Flow (4-year)", tipBody: "FCF grew from $19.3B (2022) to $46.1B (2025) — though 2025's figure is DOWN from 2024's $54.1B peak as the AI capex ramp accelerated (capex/revenue jumped from 22.6% to 34.7% in one year). TTM through Q2 2026 has fallen further to ~$40.0B as this trend continues." },
      { html: `Price <span style="color:#3fd07a;font-weight:700">+261.9%</span> (Aug 2022 → Jul 2026)`, tipTitle: "Total price return (Aug 2022 → Jul 2026 window)", tipBody: "From $162.93 (Aug 2022) to $556.71 (Jul 2026, this window's last full month) = +261.9%. This compounding came from a genuine earnings recovery off the 2022 ad-recession trough plus a real multiple re-rating on the AI-ad-tools story — not acquisitions. Past returns are anchored to a re-rating that the Q2 2026 capex/FCF scare has since partly unwound." },
    ],
    verdictBody: "META has compounded revenue at ~14.8% annually over the last 4 fiscal years, fully recovering from the 2022 ad-recession/metaverse-capex trough (ROIC bottomed near 21%, the stock fell -42.8% in this window) to a 2024 peak (ROIC 39.9%, FCF $54.1B). Gross margin expanded steadily to 82.0% even as capex intensity roughly doubled since 2023. FCF fell in 2025 for the first time in this window as the AI buildout accelerated — capex/revenue jumped 12 points in a single year — and Q2 2026 delivered the first quarter where that tension became visible as a near-zero cash quarter, not just a ratio. The business has earned a premium multiple on ad-demand durability — the open question is whether FCF re-normalizes within a few quarters or the capex intensity keeps climbing faster than cash generation.",
    banners: {
      durability: (revCagrPct, rev0, rev9, gmDelta, latestGM, fcf0, latestFCF) => `Revenue compounded at ~${revCagrPct}% annually from $${rev0}B (2022) to $${rev9}B (2025) — a real recovery from the 2022 ad-recession trough. Gross margin expanded ${gmDelta} points to ${latestGM}%, even as capex intensity climbed toward the AI buildout. FCF grew from $${fcf0}B to $${latestFCF}B — though 2025 itself was a step down from 2024's peak.`,
      value: (latestROIC) => `ROIC of ${latestROIC}% (2025) comfortably exceeds a typical WACC of 9-10% for a company this size, meaning each dollar reinvested still creates more than a dollar of value — though the 2025 figure is a real dip from 2024's 39.9% peak as invested capital grew faster than operating income on the capex ramp. This is the first visible sign of the tension between AI-buildout spend and returns.`,
      capex: (latestCapex, peakCapex, latestFCF, fy26Guide) => `Capex/revenue of ${latestCapex}% (2025) is already the highest in this 4-year window, and the FY2026 guide of $${fy26Guide}B (raised mid-year, low end lifted) implies it climbs further. FCF fell to $${latestFCF}B in 2025 from 2024's $54.1B peak, and Q2 2026 alone posted just ~$0.8B — the clearest real-time evidence that capex intensity is now outrunning operating cash flow growth, at least for a quarter. The next few prints are the actual test of whether this reverses.`,
      mood: (evNow, evAvg) => `EV/EBITDA of ${evNow}× sits below the 4-year average of ${evAvg}× — the multiple more than doubled off the 2022 ad-recession trough (~8.3×) as the AI-ad-tools re-rating took hold, then pulled back after Q2 2026's capex/FCF scare. The market is now questioning the premium multiple for the first time in this window, not yet abandoning it.`,
    },
    revAnnotationsHtml: `<span>2022: <span style="color:var(--tx3)">$116.6B</span> (ad-recession-era trough)</span><span>2025: <span style="color:var(--tx3)">$201.0B</span> (AI ad-tools acceleration)</span>`,
    roicNote: "Green >15% · Amber 5-15% · Red <5% — META has stayed green every year in this window",
    fcfYieldNote: "Declining yield = stock re-rating higher AND capex intensity rising — both compress the ratio. FCF itself fell outright in 2025, the first down year in this window.",
    capexAnnotationsHtml: `<span>2023: <span style="color:#3fd07a">20.0%</span> (post-efficiency-era discipline)</span><span>2025: <span style="color:#f1564b">34.7%</span> (AI buildout, window high)</span>`,
    footnotes: {
      durability: "META's growth is organic — no major acquisition playbook to adjust for. The 4-year window available (2022-2025, Wisesheets' free-tier cap) captures the 2022 ad-recession/metaverse-capex trough through the 2024-2025 AI-ad-tools acceleration and Reality Labs losses throughout. Revenue growth itself accelerated through 2024-2025 as AI ranking/conversion tools (Advantage+, GEM) took hold, ahead of Q2 2026's capex/FCF scare specifically.",
      value: "ROIC has stayed comfortably above a 9-10% WACC across this window (20.9%–39.9%), peaking in 2024 and dipping to 26.7% in 2025 as the capex ramp expanded invested capital faster than operating income. FCF yield compression from 5.9% (2022) to 2.7% (2025) reflects both the stock's multiple expanding and capex intensity rising — not weaker underlying cash generation on its own, though Q2 2026's near-zero quarterly FCF is the first sign that relationship needs to be watched closely, not assumed.",
      capex: "Capex/revenue climbed from 20.0% (2023 trough) to 34.7% (2025) as the AI buildout accelerated, and the FY2026 guide (raised mid-year to $130-145B) implies it climbs further still. The kill-switch for this panel: if capex/revenue keeps climbing without a quantified AI-monetization revenue line, or quarterly FCF stays near-zero for multiple consecutive quarters, the AI buildout has stopped paying for itself fast enough to matter.",
      mood: "The scenario bands on the other tabs use forward P/E, not EV/EBITDA — META carries manageable debt and (aside from the Q2 2026 one-time charges) relatively clean GAAP earnings, so P/E is a fair ruler here. EV/EBITDA is shown purely to track cross-cycle mood, since it's capital-structure-neutral. The multiple bottomed near 8.3× at the 2022 ad-recession trough — before the AI-ad-tools re-rating existed — and sits at 16.7x on 2025 actuals today, below its own 4-year average as the market absorbs the Q2 2026 capex/FCF scare.",
    },
    priceChartTitle: "META PRICE · MONTHLY · 2022–2026",
    priceChartSub: "$ per share · dashed lines = key events · window limited to available Wisesheets history",
    priceNowTip: (px, isATH) => `$${px} — where META traded at the end of this chart's window (Jul 2026), ${isATH ? "also the highest monthly close in this window" : "off the window's high (Jul 2025, $773.44)"}. The chart shows a real 2022 ad-recession/metaverse-capex crash (-42.8%), a 2023-25 efficiency-era-driven recovery and AI-ad-tools re-rating to new highs, a Nov 2025 hyperscaler capex-fear pullback, and the Jul 2026 capex/FCF-driven selloff this thesis is built around.`,
    ddTip: (minDD) => `${minDD}% — the deepest drop from a prior high in this window, occurring in October 2022 during the ad-recession/metaverse-capex-fear trough. META recovered from it and went on to make new highs as the efficiency-era cost discipline and AI-ad-tools story took hold. Drawdown charts help you visualize what holding through a bad period actually felt like.`,
    ddAnnotationsHtml: `<span>Max drawdown: <span style="color:#f1564b">−42.8%</span> (Oct 2022, ad-recession/metaverse-capex trough)</span><span>Window end: <span style="color:#e0a83b">−28.0%</span> from the Jul 2025 high (Jul 2026 close — this chart's window ends before the post-Q2-print bounce to today's price)</span>`,
  },
};
