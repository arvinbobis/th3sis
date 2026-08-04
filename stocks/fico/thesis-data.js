/* ╔══════════════════════════════════════════════════════════════════════════╗
   ║   FICO · thesis-data.js — ALL per-stock content lives here.              ║
   ║   ███  EDIT EVERYTHING IN THIS FILE EACH QUARTER  ███                    ║
   ║                                                                          ║
   ║   The rendering engine (../engine/thesis-engine.js) contains ZERO        ║
   ║   company-specific strings — every number, narrative, and tooltip        ║
   ║   that mentions FICO is in this file. Quarterly touch = edit this        ║
   ║   file only, then run: node tools/lint-thesis-data.js FICO               ║
   ║                                                                          ║
   ║   NOTE: FICO's fiscal year ends September 30. "Q3 FY26" = Apr-Jun 2026.  ║
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

const TICKER_META = { ticker: "FICO", exchange: "NYSE", company: "Fair Isaac Corporation" };
const AS_OF_DATE = "2026-08-04";

// Most recent material dislocation: FHFA's Jul 8, 2025 approval of VantageScore 4.0 for
// GSE mortgages, which started the multi-quarter multiple de-rating this thesis tracks.
// REVERSION_TROUGH uses the REAL daily closing low in the window since that shock
// (Wisesheets EOD data, $922.37 on 2026-04-10) rather than the unverified "$870.01
// 52-week low" the pre-migration build cited — same fix GOOGL's migration made for an
// analogous unverifiable intraday figure. The decline was NOT a single sharp crash-and-
// recover: price kept grinding lower for ~9 months past the FHFA event, through the
// Q1 FY26 print (Jan 2026) and into the Q3 FY26 print (Jul 2026), before finding its
// real low in April 2026 — a slow multi-quarter multiple compression, not one shock.
const DISLOCATION_DATE = "2025-07-08";
const REVERSION_TROUGH = 922;
const REVERSION_BASEFLOOR = 1000;
const REVERSION_PRECEDENT_DAYS = 365;

// CASES ported losslessly from the 2026-07-31 /update-thesis touch (stocks/fico/fico-thesis.html)
// — this migration is structural only, per the AMZN/NVDA precedent. Not re-derived.
const CASES = {
  bear: {
    key: "bear", label: "BEAR", accent: "#f1564b", glow: "rgba(241,86,75,0.45)",
    target12: "$650 — $850",
    op: "Operational state: VantageScore's GSE acceptance keeps widening — even though the bi-merge (both-scores) requirement remains postponed, FHFA/Fannie/Freddie keep approving individual lenders for VantageScore-only underwriting, and each approval is a lender FICO no longer gets a guaranteed pull from. Scores growth already decelerated sharply this quarter (60% → 41% YoY) before any real substitution has occurred — if that trend continues into single digits, or if the FTC/Hawley scrutiny turns into an actual pricing rule, FICO's per-score pricing power breaks for good. Software's ~10% ARR growth cannot offset a 91%-margin Scores slowdown, and the market reprices FICO as ordinary data/software rather than a toll booth.",
    breaks: "Two consecutive quarters of Scores revenue growth reaccelerating back above 40% YoY, alongside evidence that the approved-lender VantageScore rollout stays capped at its initial cohort rather than widening — that would show this quarter's deceleration was a pricing-hike comp effect, not the start of real substitution.",
    requires01: "VantageScore lender rollout widens beyond the initial approved-lender cohort (observable now via FHFA/MBA)",
    requires02: "Scores growth falls below 15% YoY for two consecutive quarters",
  },
  base: {
    key: "base", label: "BASE", accent: "#e0a83b", glow: "rgba(224,168,59,0.40)",
    target12: "$950 — $1,300",
    op: "Operational state: the VantageScore transition is still moving slowly by design — FHFA is running a deliberately limited, approved-lenders-only rollout of VantageScore 4.0, and the bi-merge (both-scores) requirement that would force a head-to-head test has been postponed rather than implemented. FICO keeps most of its pricing power but growth normalizes off last year's extreme price-hike comps: Scores revenue decelerated from +60% to +41% YoY this quarter, and total revenue ($674M) plus the raised FY2026 guide (~$2.53B) both landed a shade below Street. The market's brutal -17% post-earnings reaction wasn't an earnings-quality problem — it was the multiple compressing further, to roughly 24–27x, now in line with the SPGI/MCO/VRSK/EFX peer median (~24x) rather than FICO's own richer history.",
    breaks: "Either Scores growth decelerates below 15% YoY for two consecutive quarters (bear), or Scores growth reaccelerates above 40% YoY WITH the multiple actually re-expanding above 32x (bull) — this quarter delivered the first half of that bull condition (Scores hit 41%) but not the second (the multiple compressed instead of expanding), which is exactly why base remains the call.",
    requires01: "VantageScore lender rollout stays limited to the initial approved cohort (FHFA/MBA data)",
    requires02: "Scores growth trending 25–35% YoY + no pricing legislation proposed",
  },
  bull: {
    key: "bull", label: "BULL", accent: "#3fd07a", glow: "rgba(63,208,122,0.45)",
    target12: "$1,400 — $1,650",
    op: "Operational state: VantageScore's approved-lender rollout stalls at a small cohort and never broadens, the postponed bi-merge requirement never forces a real head-to-head substitution test, and FICO 10T's predictive edge keeps risk managers on FICO even where VantageScore is technically available. Scores growth — which just printed 41% YoY even mid-deceleration — reaccelerates as mortgage volumes recover, the FTC investigation is quietly dropped, and the market finally rewards a strong print with multiple re-expansion (32x+) instead of compressing it further. This is the scenario Q3 FY2026 did NOT deliver: the KPI cleared the bull bar, but the multiple moved the wrong way.",
    breaks: "Scores revenue growth decelerates back below 25% YoY in any quarter, OR the multiple keeps compressing even on a strong Scores print (exactly what happened this quarter) — either one says the market isn't buying the pricing-moat-intact story regardless of the headline number.",
    requires01: "FICO 10T outperformance confirmed + VantageScore rollout stays confined to the initial approved-lender cohort",
    requires02: "Scores re-accelerates above 40% YoY AND the multiple re-expands above 32x (both legs required — this quarter only cleared the first)",
  },
};

// THESIS_HISTORY intentionally omitted on this first migration touch — this is a
// lossless PORT of the 2026-07-31 /update-thesis content into the engine-split shape,
// not a Layer-2 audit that rewrote CASES (incoming === outgoing this touch). Same
// discipline as AMZN's and NVDA's own migrations — the archive starts at FICO's NEXT
// /update-thesis touch, right before that session's audit overwrites CASES.

const FALLBACK_PRICE = 1051.50;

const LIVE_PRICE = {
  enabled: true,
  symbol: "FICO",
  provider: "yahoo",
  corsProxy: "https://api.allorigins.win/get?url=",
  finnhubToken: "",
};

// ALERT — buy-trigger pre-commitment. Canonical source is PF_ALERTS.FICO in
// stocks/portfolio/portfolio-data.js (buyFloor 950, thesisIntact true,
// nextEarnings "~2026-10-late"); this copy is a FALLBACK for offline opens.
const ALERT = {
  symbol: "FICO",
  buyFloor: 950,
  thesisIntact: true,
  asOf: AS_OF_DATE,
  nextEarnings: "~2026-10-late",
};

// Real fiscal-quarter-end closing prices (Wisesheets EOD, SEC-fiscal-calendar aligned).
// FY ends Sep 30 — "Q3 FY25" = quarter ended 2025-06-30, just before the Jul 8 2025
// FHFA/VantageScore dislocation began.
const HISTORY = [
  { q: "Q3 FY25", p: 1726.28 },
  { q: "Q4 FY25", p: 1496.53 },
  { q: "Q1 FY26", p: 1690.62 },
  { q: "Q2 FY26", p: 1067.54 },
  { q: "Q3 FY26", p: 1122.97 },
  { q: "NOW",     p: FALLBACK_PRICE },
];
const PROJ_END = { bear: 750, base: 1125, bull: 1525 };
const FUTURE_Q = ["Q4 FY26", "Q1 FY27", "Q2 FY27", "Q3 FY27"];

const SIGNALS = {
  bear: [
    { name: "Scores Revenue Growth (YoY %)", unit: "% YoY",  tag: "MISS",  next: "Nov 2026",  val: "BEAR <15%",             guide: "Q3 FY26: +41%",     pos: 0.17 },
    { name: "VantageScore Lender Adoption",  unit: "EVENT",  tag: "MISS",  next: "Ongoing",   val: "BEAR >30% lenders switch", guide: "rollout widening",  pos: 0.20 },
    { name: "Mortgage Origination Volume",   unit: "INDEX",  tag: "MISS",  next: "Weekly",    val: "BEAR vol. declining",    guide: "MBA index",          pos: 0.22 },
  ],
  base: [
    { name: "Scores Revenue Growth (YoY %)", unit: "% YoY",  tag: "MATCH", next: "Nov 2026",  val: "BASE 25–35%",            guide: "Q3 FY26: +41%",     pos: 0.56 },
    { name: "VantageScore Lender Adoption",  unit: "EVENT",  tag: "WATCH", next: "Ongoing",   val: "BASE <20% switch",       guide: "limited rollout, bi-merge postponed", pos: 0.50 },
    { name: "Mortgage Origination Volume",   unit: "INDEX",  tag: "MATCH", next: "Weekly",    val: "BASE stable/recovering", guide: "MBA index",          pos: 0.55 },
  ],
  bull: [
    { name: "Scores Revenue Growth (YoY %)", unit: "% YoY",  tag: "BEAT",  next: "Nov 2026",  val: "BULL >40%",              guide: "Q3 FY26: +41%",     pos: 0.86 },
    { name: "VantageScore Lender Adoption",  unit: "EVENT",  tag: "BEAT",  next: "Ongoing",   val: "BULL near-zero switch",  guide: "rollout capped",     pos: 0.83 },
    { name: "Mortgage Origination Volume",   unit: "INDEX",  tag: "BEAT",  next: "Weekly",    val: "BULL accelerating",      guide: "MBA index",          pos: 0.84 },
  ],
};
const MARGIN = {
  bear: [
    { name: "Software ARR Growth %",       tag: "MISS",  next: "Nov 2026", pos: 0.20 },
    { name: "Reg / Pricing Investigation", tag: "MISS",  next: "Ongoing",  pos: 0.18 },
  ],
  base: [
    { name: "Software ARR Growth %",       tag: "MATCH", next: "Nov 2026", pos: 0.55 },
    { name: "Reg / Pricing Investigation", tag: "WATCH", next: "Ongoing",  pos: 0.48 },
  ],
  bull: [
    { name: "Software ARR Growth %",       tag: "BEAT",  next: "Nov 2026", pos: 0.83 },
    { name: "Reg / Pricing Investigation", tag: "BEAT",  next: "Ongoing",  pos: 0.80 },
  ],
};

// HEADLINE GAUGE: Scores segment revenue YoY growth % — the pricing-moat tell.
// Q3 FY2026 actual (+41%, down from +60% in Q2), then 4-quarter projections per case.
const KPI_HIST = 41;
const KPI_PROJ = {
  bear: [22, 14, 8, 2],
  base: [32, 28, 26, 24],
  bull: [42, 44, 46, 48],
};

// TRACK RECORD — ported losslessly from the pre-migration build. Append newest to
// the end; window keeps last TRACK_WINDOW. Note these are per-earnings-date reaction
// prices (a different sampling from HISTORY's fiscal-quarter-end closes above — both
// real, just different snapshots, same convention every migrated stock uses).
const TRACK_ALL = [
  { q: "Q1 FY25", date: "2025-01", post: 1950, reaction: "+",  bear: [1400,1800], base: [1900,2200], bull: [2400,2800], landed: "base",      conf: "med"  },
  { q: "Q2 FY25", date: "2025-04", post: 1880, reaction: "-",  bear: [1350,1700], base: [1800,2100], bull: [2300,2700], landed: "base",      conf: "med"  },
  { q: "Q3 FY25", date: "2025-07", post: 1050, reaction: "--", bear: [1100,1500], base: [1700,2100], bull: [2200,2700], landed: "bear",      conf: "high" },
  { q: "Q4 FY25", date: "2025-11", post: 1020, reaction: "-",  bear: [700,950],   base: [1000,1400], bull: [1600,2100], landed: "base",      conf: "high" },
  { q: "Q1 FY26", date: "2026-01", post: 950,  reaction: "-",  bear: [680,920],   base: [980,1380],  bull: [1520,2000], landed: "bear",      conf: "high" },
  { q: "Q2 FY26", date: "2026-04", post: 1278, reaction: "+",  bear: [680,900],   base: [1000,1450], bull: [1600,2100], landed: "base",      conf: "high" },
  { q: "Q3 FY26", date: "2026-07", post: 1140, reaction: "--", bear: [450,750],   base: [1100,1700], bull: [1900,2600], landed: "base",      conf: "high" },
];
const TRACK_WINDOW = 6;

// THE PAST — annual history (Wisesheets 10-K facts, SEC-cited, accession
// 0000814547-25-000030 for FY2023-2025, 0001628280-24-045719 for FY2022). Only 4
// fiscal years (2022-2025) shown, matching every other migrated stock's Wisesheets
// free-tier window. Filed EPS is GAAP — no eps_adjusted line was available from
// Wisesheets for FICO, so ROIC/margin figures below use GAAP operating income
// throughout (consistent within the window, not mixed with non-GAAP).
// ROIC computed as NOPAT (operating income x (1 - effective tax rate)) / (total debt +
// total equity - cash). FICO's equity is NEGATIVE every year in this window (buybacks
// have exceeded cumulative retained earnings) — this mechanically inflates ROIC to
// 45-63%, which is real, not a calculation error: a capital-light royalty business
// funding aggressive buybacks with debt produces exactly this pattern. EV/EBITDA uses
// each fiscal year-end close x shares outstanding at that filing.
const PAST_YEARS       = ["2022","2023","2024","2025"];
const PAST_REV         = [1.377, 1.514, 1.718, 1.991];
const PAST_GM          = [78.1,  79.5,  79.7,  82.2];
const PAST_FCF         = [0.503, 0.465, 0.624, 0.770];
const PAST_ROIC        = [44.9,  47.0,  52.1,  62.7];
const PAST_EVEBITDA    = [21.3,  34.9,  66.3,  41.0];
const PAST_FCF_YIELD   = [4.9,   2.2,   1.3,   2.2];
const PAST_CAPEX_REV   = [0.4,   0.3,   0.5,   0.4];
const PRICE_M_LABELS = ["2022-07","2022-08","2022-09","2022-10","2022-11","2022-12","2023-01","2023-02","2023-03","2023-04","2023-05","2023-06","2023-07","2023-08","2023-09","2023-10","2023-11","2023-12","2024-01","2024-02","2024-03","2024-04","2024-05","2024-06","2024-07","2024-08","2024-09","2024-10","2024-11","2024-12","2025-01","2025-02","2025-03","2025-04","2025-05","2025-06","2025-07","2025-08","2025-09","2025-10","2025-11","2025-12","2026-01","2026-02","2026-03","2026-04","2026-05","2026-06","2026-07"];
const PRICE_M = [462.03, 449.40, 412.01, 478.84, 619.72, 598.58, 665.95, 677.39, 702.69, 727.95, 787.67, 809.21, 837.97, 904.59, 868.53, 845.87, 1087.60, 1164.01, 1198.83, 1269.91, 1249.61, 1133.33, 1289.93, 1488.66, 1600.00, 1730.27, 1943.52, 1993.11, 2375.03, 1990.93, 1873.56, 1886.35, 1844.16, 1989.68, 1726.28, 1827.96, 1436.72, 1521.64, 1496.53, 1659.53, 1805.83, 1690.62, 1463.17, 1409.36, 1067.54, 1025.00, 1250.59, 1194.78, 1122.97];
const PRICE_M_DD = [0.0,-2.7,-10.8,0.0,0.0,-3.4,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,-4.0,-6.5,0.0,0.0,0.0,0.0,-1.6,-10.8,0.0,0.0,0.0,0.0,0.0,0.0,0.0,-16.2,-21.1,-20.6,-22.4,-16.2,-27.3,-23.0,-39.5,-35.9,-37.0,-30.1,-24.0,-28.8,-38.4,-40.7,-55.1,-56.8,-47.3,-49.7,-52.7];
const PAST_EVENTS = [
  { idx: 28, label: "All-Time High", note: "Nov 2024 — the price-hike era peak ($2,375.03 monthly close; real Wisesheets data, not the unverified $2,382 intraday figure the pre-migration build cited). The multiple reached roughly 65x forward earnings on FICO's serial per-score price increases with no visible competitive threat yet." },
  { idx: 36, label: "FHFA / VantageScore Dislocation", note: "Jul 2025 — FHFA approved VantageScore 4.0 for Freddie Mac and Fannie Mae mortgages, and the market began pricing in the end of FICO's pricing monopoly. Already -39.5% from the Nov 2024 high by this month's close, even though Scores revenue kept growing throughout." },
  { idx: 45, label: "Cycle Low", note: "Apr 2026 — the real trough in this window ($1,025.00 monthly close; the actual daily closing low was $922.37 on 2026-04-10). Reached nine months AFTER the FHFA shock, following continued Scores deceleration disclosed at the Q1 FY2026 print (Jan 2026) — this was a slow multi-quarter multiple grind, not a single crash-and-recover." },
  { idx: 48, label: "Q3 FY2026 Post-Earnings Settle", note: "Jul 2026 — Q3 FY2026 earnings (reported Jul 29) showed Scores revenue still +41% YoY but decelerating from +60%, alongside a revenue/guide print a shade below Street. Stock fell ~17% in the immediate reaction and settled near $1,123 by month-end." },
];

const VAL_CONFIG = {
  ntm_eps:              43.15,    // web search — derived from stockanalysis.com's reported NTM P/E of 24.23x on $1,045.46 (2026-08-03 close); consistent with FY2026 non-GAAP guide ($42.43) blending into early FY2027 consensus (~$51.86 FY2027 est. per Zacks/Yahoo-sourced coverage, +30.5% YoY)
  shares_b:              0.0227,  // Q3 FY2026 diluted weighted-avg shares (22.703M), Wisesheets/SEC 10-Q (accession 0000814547-26-000030)
  fcf_ntm_b:             1.00,    // TTM FCF through Q3 FY2026 (OCF - capex, summed Q4 FY25 + Q1-Q3 FY26 = $996.0M), Wisesheets SEC-cited quarterlies
  risk_free_pct:         4.35,
  default_discount_pct:  9.5,
  default_terminal_pe:   24,
  dcf_years:              5,
  capex_fy26_guide_b:    0.01,    // FICO does not issue a headline capex guide — this is de minimis (~0.4-0.5% of revenue every year in this window; see PAST_CAPEX_REV). Shown for schema completeness, not because capex intensity drives this thesis the way it does for AI-capex peers.
  prior_fy_rev_b:        1.991,   // FY2025 actual revenue (fiscal year ended 2025-09-30)
  prior_fy_label:        "FY2025",
  pe_trough: 15, pe_bear_hi: 20, pe_normal_lo: 21, pe_normal_hi: 27, pe_bull_lo: 31, pe_peak: 50,
  peers: [
    { t: "FICO", fpe: 24.3, ev_eb: 19.0, fcf_y: 4.2, note: "Scores royalty + Software; capital-light, negative-equity-from-buybacks model gives the highest ROIC of this peer set, but VantageScore is the live competitive question none of these four peers face" },
    { t: "SPGI",  fpe: 21.0, ev_eb: 15.5, fcf_y: 3.2, note: "Ratings + Market Intelligence + Mobility (comps/CarFax) — the closest business-model peer, similarly capital-light with real pricing power" },
    { t: "MCO",   fpe: 29.5, ev_eb: 22.0, fcf_y: 2.6, note: "Ratings + Moody's Analytics — the richest multiple of this peer set, reflecting a duopoly-with-SPGI structure the market hasn't questioned the way it has FICO's" },
    { t: "VRSK",  fpe: 26.5, ev_eb: 19.0, fcf_y: 2.8, note: "Insurance data/analytics — high-margin recurring-revenue comp, no direct competitive-substitution overhang comparable to VantageScore" },
    { t: "EFX",   fpe: 17.6, ev_eb: 14.5, fcf_y: 2.9, note: "The credit-bureau peer with the most direct read-through — Equifax sells VantageScore alongside FICO scores, so its own multiple already partly reflects how the market is pricing the bi-score world" },
  ],
};

const SIGNAL_HELP = {
  "Scores Revenue Growth (YoY %)": "FICO's Scores segment is the royalty-fee business — every mortgage, auto loan, and credit card application that uses a FICO score generates a fee. FICO raised its per-score mortgage price from $0.60 to $10+ over five years, driving explosive growth that just decelerated from +60% to +41% YoY. VantageScore 4.0 is accepted by Freddie Mac and Fannie Mae, but only through a limited, approved-lenders-only rollout so far. The question: do lenders substitute VantageScore for FICO (threatening pricing) or add it alongside FICO (neutral for volume)?",
  "VantageScore Lender Adoption": "FHFA's approval of VantageScore 4.0 for GSE mortgages doesn't automatically make lenders switch. Mortgage underwriting systems are built around FICO. FHFA's 'bi-score' requirement (lenders must pull BOTH FICO 10T AND VantageScore 4.0) may actually increase FICO's volume short-term. This KPI tracks whether mortgage originators are actively substituting VantageScore for FICO in their decisions — the data comes from MBA surveys and FHFA reporting.",
  "Mortgage Origination Volume": "FICO earns a royalty fee per credit score pull. Mortgages generate the most pulls (typically 3 per application). Higher origination volume = more revenue at flat prices. Observable weekly via the MBA Mortgage Applications Index. Rate cuts or a housing recovery would boost this; a recession would hurt it.",
  "Software ARR Growth %": "FICO's Software segment (FICO Platform, decision management tools sold to banks) is the diversification story. Currently growing 10% Annual Recurring Revenue. If Scores pricing eventually erodes, Software needs to compensate. The bull case for FICO's long-term value requires Software to accelerate toward 20%+ ARR growth.",
  "Reg / Pricing Investigation": "Senator Hawley and the FTC are investigating whether FICO's price increase from $0.60 to $10+ per mortgage score over five years constitutes anticompetitive behavior. FICO has lobbied against new pricing regulations. Any legislation capping FICO's per-score pricing is the nuclear bear scenario. Currently investigation only — no proposed bill. Observable via Congressional hearings and FTC filings.",
};
const TAG_HELP = {
  BEAT: "doing better than expected — a good sign.",
  MATCH: "roughly in line with expectations — steady, no surprises.",
  MISS: "falling short of expectations — a worry.",
  WATCH: "not decided yet — keep an eye on it.",
};

const THESIS_ITEMS = [
  { key: "scoresGrowth",  label: "Scores growth holding 25%+ YoY",             note: "41% this quarter, decelerating from 60% — comp effect so far, not confirmed substitution" },
  { key: "vantageAdoption", label: "VantageScore rollout stays limited to initial cohort", note: "Bi-merge requirement still postponed; no evidence of a widening beyond approved lenders yet" },
  { key: "softwareArr",   label: "Software ARR growth trending toward 15-20%", note: "Currently ~10% — the diversification leg that hasn't yet accelerated" },
  { key: "regRisk",       label: "No FTC/Hawley pricing legislation proposed", note: "Investigation ongoing, no bill introduced as of this touch" },
];
const PRICE_ZONES = [
  { label: "BEAR", lo: 650,  hi: 850,  mid: 750,  color: "#f1564b", action: "Exit / reduce if thesis also breaking" },
  { label: "BASE", lo: 950,  hi: 1300, mid: 1125, color: "#e0a83b", action: "Small add OK if thesis intact" },
  { label: "BULL", lo: 1400, hi: 1650, mid: 1525, color: "#3fd07a", action: "Let it ride — don't chase" },
];

// ── Chart geometry / axis ranges (per-stock: depends on price scale) ─────────
const GEOM = {
  priceMin: 400, priceMax: 2600,
  fanGrid: [2400, 1800, 1200, 800, 400],
  fanYears: ["2025", "2026", "2027"],
  trackMin: 580, trackMax: 2900,
  trackGrid: [2800, 2200, 1600, 1000, 600],
  kpiMin: -5, kpiMax: 65,
  visLo: 400, visHi: 2600,
  nowZoneLo: 950, nowZoneHi: 1300,
};

/* ── TEXT — every company-specific narrative/tooltip the engine renders. ──────
   Values are strings, HTML strings (rendered with dangerouslySetInnerHTML), or
   template functions the engine calls with computed values. If it mentions the
   company, a quarter, a guide number, or an event, it belongs HERE, not in the
   engine — that rule is what makes the engine safely reusable across stocks. */
const TEXT = {
  priceTipLive: (px, at, asOf) => `Live quote: $${px} (fetched ${at}). The price is real-time, but the scenario bands and EPS are still as of ${asOf} — only the price-derived figures (scenario returns, P/E, band position) update live.`,
  priceTipStatic: (px, asOf, liveEnabled) => `$${px} as of ${asOf} — ${liveEnabled ? "live fetch unavailable (offline or blocked), using the saved price" : "static price (live fetch disabled)"}. Next earnings: ~2026-10-late (Q4 FY2026).`,
  footerDisclaimer: (asOf) => `Illustrative scenario framing built on public consensus & estimates as of ${asOf} — not a prediction and not financial advice. FICO's fiscal year ends September 30; Q3 FY2026 = Apr-Jun 2026, reported 2026-07-29. Q3 FY2026: revenue $674.2M (+26% YoY, a slight miss vs. ~$679-692M Street), GAAP EPS $10.45 (+41% YoY), non-GAAP EPS $12.18 (beat $11.97 est.), Scores segment revenue $458.9M (+41% YoY, decelerating from +60% in Q2), Scores gross margin ~91%. Full-year FY2026 guidance raised to revenue ~$2.53B and non-GAAP EPS $42.43. Update 2026-08-04: Wolfe Research downgraded FICO to Peer Perform on "apparent and real" VantageScore competition and Jefferies cut its PT to $1,675 from $1,750 — stock fell ~6.4% same day to $1,051.50. This re-prices the EXACT risk the bear case already names (VantageScore lender substitution); no new lender-adoption data accompanied either call. Valuation ruler: forward P/E on non-GAAP EPS. Bear/bull gap is overwhelmingly multiple-driven — the earnings are real, the argument is what they're worth. Bear 35% / Base 50% / Bull 15%.`,

  fanHistory: "The solid line is FICO's actual share price over the past several fiscal quarters. Earnings kept growing throughout, yet the price cratered as the market re-priced VantageScore competitive risk into the multiple — from ~65x forward earnings at the Nov 2024 high toward the mid-20s today.",
  fanNow: (px) => `FICO trades around $${px} right now — down more than half from its $2,375 (Nov 2024) high despite Scores segment revenue still growing +41% YoY. The entire decline is a multiple de-rating on VantageScore competition fears, not an earnings problem. Everything left of this dot is history; everything right is forecast.`,
  fanPastDot: (q, p) => `Around the end of ${q}, FICO traded near $${p}.`,

  segmentedExplain: {
    bear: ["The pessimistic scenario", "Click to see what FICO looks like if things go wrong — VantageScore's approved-lender rollout widens, forcing a per-score price rollback from $10+ toward $3-5, Scores revenue craters below 15% YoY, and the FTC caps pricing. Stock falls to $650-850 as the market prices FICO as commodity software."],
    base: ["The most-likely scenario", "Click for the steady-execution view — VantageScore's rollout stays limited to its initial approved-lender cohort, FICO retains most pricing power with growth normalizing to 25-35% YoY, Software ARR holds up. At ~24-27x NTM EPS, current price is roughly fair value. Price drifts toward $950-1,300."],
    bull: ["The optimistic scenario", "Click to see the upside — VantageScore's rollout stalls and never broadens, pricing holds or grows, Scores reaccelerates above 40% YoY, and the market finally re-rates the multiple back above 32x instead of compressing it. Price could run to $1,400-1,650."],
  },

  kpiBaseline: (val) => `This is the most recent real number: FICO's Scores segment revenue grew +${val}% year-over-year in the most recent quarter — still strong, but decelerating from +60% last quarter as price-hike comps normalize. The bars to the right show where that growth rate is projected to go under each scenario.`,
  kpiForecast: (label, val) => `In this scenario, FICO's Scores segment revenue is projected to grow about ${val}% year-over-year by ${label}. ${val < 15 ? "Below the 15% line is the bear-case pricing-moat-cracking threshold." : "Higher = pricing power is holding."}`,

  reversion: {
    header: "REVERSION CLOCK · JUL 2025 VANTAGESCORE / FHFA DISLOCATION",
    timeTip: "On July 8, 2025, FHFA approved VantageScore 4.0 for Freddie Mac and Fannie Mae mortgages. The market began pricing in the end of FICO's pricing monopoly, and the stock kept grinding lower for another nine months before finding its real low. This clock tracks how long since that event.",
    priceTip: (trough, baseFloor, now) => `FICO's real closing low in this window was $${trough} (2026-04-10), reached nine months after the FHFA shock. The base band's floor sits near $${baseFloor}. At $${now}, ${now >= baseFloor ? "price is back above the base floor." : "price is still below the base floor — the recovery from the Apr 2026 trough is incomplete."}`,
    footerHtml: (baseFloor, precedentDays, now) => `This dislocation is <b>competitive, not macro/cyclical</b> — unlike a rate-hike or tariff-panic selloff, there's no guarantee it "heals" on any set schedule, because the underlying question (does VantageScore actually displace FICO at lenders) is still unresolved almost 13 months later. Price ground down for nine months past the initial FHFA event before finding its real low ($922 close, Apr 10 2026), then partially recovered before the Q3 FY2026 print and the Aug 2026 analyst downgrades pulled it back toward $${now}. The ${precedentDays}-day precedent window from the original shock has already elapsed without a clean recovery — <span style="color:#e0a83b;font-weight:700">treat this reversion clock as a slower, less reliable signal than for a pure sentiment/macro shock</span>. Base floor: $${baseFloor}.`,
  },

  track: {
    lastDot: (post, nowPx) => `After Q3 FY2026 earnings (Jul 29), FICO traded around $${post} — the stock fell ~17% on a revenue/guide miss even as Scores growth held at +41% YoY. Price sits at $${nowPx} today, after Wolfe Research and Jefferies both cut their ratings/targets on Aug 4, 2026 citing VantageScore competition. Next dot: Q4 FY2026 earnings (~2026-10-late).`,
    pastDot: (q, post) => `After ${q} earnings, FICO actually traded near $${post}. Compare this dot to the colored bands behind it to see if the prediction was right.`,
    readoutHtml: (hits, n, nowPx) => `Price has tracked <span style="color:#3fd07a;font-weight:700">base-or-better in ${hits} of ${n} quarters</span> shown. Current price <span style="color:var(--blue-soft);font-weight:700">$${nowPx}</span> reflects the Q3 FY2026 post-earnings reaction plus a fresh sentiment move: on Aug 4, 2026, Wolfe Research downgraded FICO to Peer Perform and Jefferies cut its price target to $1,675 (from $1,750) on VantageScore competition concerns, and the stock fell another ~6.4% the same day. Both calls re-price a risk this thesis's bear case already names (VantageScore lender substitution) — neither cited new lender-adoption data, so this reads as sentiment/multiple repricing following the Q3 miss, not fresh evidence the bi-merge requirement moved. Next directional catalyst: <span style="color:#e0a83b;font-weight:700">Q4 FY2026 earnings (~2026-10-late)</span> — whether Scores growth stabilizes in the 25-35% base range or keeps decelerating toward the 15% bear floor.`,
    footnote: "⚠ Bands are reconstructed now, anchored to each date's forward-EPS & multiple regime — not archived in real time. Treat levels as directional, especially \"lower-conf\" quarters. This is a multiple-derating thesis, not an earnings-miss thesis — bands are calibrated around P/E scenarios rather than fundamental deterioration to date.",
  },

  current: {
    statusNarrative: {
      broken: "Multiple signals missed. Thesis is under pressure — review the kill-switch criteria.",
      watch:  "Scores growth held up but the multiple kept compressing, or VantageScore adoption data ticked the wrong way. Core thesis tracking — the ~2026-10-late print is the next test. Not broken, but watch closely.",
      intact: "Scores segment revenue growth cleared this thesis's own bull-case threshold this quarter (+41% YoY) — the pricing-moat KPI is intact even though the multiple compressed instead of expanding, and even after the Aug 2026 analyst downgrades.",
    },
    panelTipStory: "Checks whether the original reasons to own FICO are playing out. Counts signals from the Q3 FY2026 print — Scores growth, VantageScore adoption, mortgage volume, Software ARR, the FTC/Hawley investigation. 0-1 miss = thesis intact. 2 misses = watch. 3+ = exit. Click to see KPI bars and kill-switch.",
    watchChipHtml: `🔑 WATCH: Q4 FY2026 Scores growth trend + VantageScore adoption data · ~2026-10-late`,
    exitChipHtml: `⚠ EXIT IF: Scores growth &lt;15% YoY 2 straight quarters, or VantageScore rollout widens beyond the approved cohort`,
    verdictBody: {
      broken:     (px) => `FICO at $${px}: kill-switch criteria met. Price position is irrelevant — signals say the pricing-moat thesis is no longer playing out. The question is not whether to add; it is how much to reduce.`,
      watchBelow: (px) => `FICO at $${px} sits below the base floor but signals are mixed. Price is attractive, but adding into a weakening thesis is the wrong sequence. Wait for the ~2026-10-late print to confirm or deny the pattern before deploying capital.`,
      below:      (px) => `FICO at $${px} sits below the base floor with the thesis intact — Scores growth still cleared 40%+ YoY, and neither of the Aug 2026 analyst downgrades cited new lender-adoption evidence. The market re-priced sentiment on a real risk this thesis already names; the underlying KPI hasn't broken yet, but the multiple has now compressed for several quarters running and needs to stop somewhere.`,
      inBase:     (px, statusWord) => `FICO at $${px} is inside the base range. Thesis ${statusWord} and price is roughly fair value. Watch Scores growth and VantageScore lender-adoption data at the ~2026-10-late print — reacceleration above 40% with the multiple finally re-expanding opens the bull case; growth sliding toward 15% reopens the bear.`,
      above:      (px) => `FICO at $${px} is above the base ceiling. The bull case — Scores reaccelerating AND the multiple actually re-expanding above 32x — needs to play out to justify entry. If already in, hold. If adding, wait for a pullback toward the base floor.`,
    },
    kpiTitle: "Scores Segment Revenue Growth",
    kpiSub: "% YoY quarterly · HIGHER BETTER",
    kpiMeasures: "Year-over-year revenue growth in FICO's Scores segment — the royalty-fee business that generates a payment every time a FICO score is pulled for a mortgage, auto loan, or credit card application. Q3 FY2026 printed +41% YoY, decelerating from +60% the prior quarter as price-hike comps normalize.",
    kpiRequires: {
      bull: "Scores growth holds above 40% YoY as lenders stick with FICO 10T despite VantageScore availability, AND the multiple actually re-expands above 32x — this quarter cleared only the growth leg, not the multiple leg.",
      base: "Scores growth moderates to 20-35% YoY as FICO moderates price hikes but doesn't reverse them — VantageScore is adopted for compliance but not as a substitute.",
      bear: "Scores growth falls below 15% YoY as VantageScore's near-zero price forces FICO to cut fees from $10+ to $3-5 to remain competitive — pricing moat cracking.",
    },
    group1Title: "Scores Pricing &amp; Demand",
    group2Title: "Software Growth &amp; Regulatory Risk",
    killSwitch: "Two consecutive quarters of Scores revenue growth below 15% YoY, or the VantageScore approved-lender rollout visibly widening beyond its initial cohort, or new pricing-cap legislation actually proposed — exit / reduce. That is the pricing moat breaking, not noise.",
    priceBanner: {
      below:  (px, baseLo) => `At $${px}, price is $${(baseLo - px).toFixed(0)} below the base floor. The market is pricing in VantageScore fear on top of the Q3 miss and the Aug 2026 downgrades — not a fresh Scores-growth problem, given the +41% print. A window for patient buyers if the thesis stays intact, but confirm the next print before assuming this is pure sentiment.`,
      inBase: (px) => `At $${px}, price is inside the base range. Fair value — not a discount, not expensive.`,
      above:  (px, baseHi) => `At $${px}, price is $${(px - baseHi).toFixed(0)} above the base ceiling. The bull thesis (Scores reaccelerating AND the multiple re-expanding) needs to play out in full.`,
    },
    moodBanner: (currentPE, loPE, hiPE) => `At ${currentPE}× forward P/E, the market is pricing continued VantageScore uncertainty into the multiple — sitting ${currentPE < loPE ? "below" : "inside"} the normal band (${loPE}-${hiPE}×), now roughly in line with the SPGI/MCO/VRSK/EFX peer median (~24x) rather than FICO's own richer pre-2025 history.`,
    cagrNotes: {
      low:  "Low bar — not priced for perfection. Even a moderate Scores-growth slowdown still justifies the price at this multiple.",
      mid:  "Moderate bar — requires Scores growth to hold in the 25-35% range and the multiple to stay roughly where it is.",
      high: "High bar — requires Scores to reaccelerate AND the multiple to re-expand, both at once, with no new regulatory risk.",
    },
    fy26CardTip: (fy26) => `Adding the first three fiscal quarters' actuals ($511.96M + $691.68M + $674.19M = $1.878B) to a base-case Q4 FY2026 projection (~$0.65B, seasonally FICO's smaller quarter) gives a full-year run rate of roughly $${fy26}B, up from $1.991B in FY2025 — modestly ahead of FY2025, in line with the raised guide (~$2.53B). That's what the base case — and roughly today's price — already assumes.`,
    fy26CardHtml: (fy26, growthPct) => `Q1-Q3 FY2026 actuals plus a base-case Q4 projection sum to roughly <span style="color:var(--blue-soft);font-weight:700">$${fy26}B</span> for full-year FY2026 — the growth path today's price already assumes. FY2025 actual revenue was <span style="color:#3fd07a">$1.991B</span>, so this implies <em>~${growthPct}%</em> YoY growth.`,
    peerCommentary: (currentPE) => `At ${currentPE}× NTM P/E, FICO trades at a premium to EFX (~17.6×) and SPGI (~21.0×), but a discount to VRSK (~26.5×) and MCO (~29.5×) among named ratings/data peers — the group SPGI, MCO, VRSK, and EFX median sits near ~24×, essentially where FICO trades today. EFX stands out as the most direct read-through: it sells VantageScore alongside FICO scores, so its own (cheaper) multiple already partly reflects how the market is pricing a bi-score world. FICO's own ROIC (62.7% in FY2025) is the highest of this peer set by a wide margin — the open question is whether that capital-light royalty economics survives real VantageScore substitution, not whether the business itself is high-quality today.`,
  },

  future: {
    scenarioTips: {
      bear: "Triggered by: Scores growth falling below 15% YoY for two straight quarters, or the VantageScore rollout visibly widening beyond its approved-lender cohort. Multiple compresses toward the 15-20× trough zone. Note: at current price, bear downside is smaller than it was pre-Q3 given the price has already pulled back hard.",
      base: (loPE, hiPE) => `Scores growth normalizes to 20-35% YoY as price-hike comps fade; VantageScore stays confined to its initial approved cohort. P/E holds in the normal ${loPE}-${hiPE}× band, in line with the peer median. Modestly positive return from here as the stock re-tests the base band.`,
      bull: (currentPE) => `Scores growth reaccelerates above 40% YoY AND the multiple actually re-expands (the leg this quarter's print did NOT deliver). Multiple re-rates from ~${currentPE}× toward the bull zone above 31×, closing the gap to the bull target.`,
    },
    downsideChevronTip: "Kill-switch: Scores growth below 15% YoY for two straight quarters, or the VantageScore rollout widening beyond its approved cohort, or new pricing-cap legislation proposed = exit / reduce.",
    dislocEventName: "the Jul 2025 FHFA/VantageScore dislocation",
    dislocLabel: "SINCE JUL 2025 FHFA/VANTAGESCORE SHOCK",
    bearPriceTip: (bearMid, bearLo, bearHi, peTrough, peBearHi) => `$${bearMid} is the midpoint of the bear case range ($${bearLo}-$${bearHi}). This assumes Scores growth falls below 15% YoY as VantageScore substitution becomes real, and the multiple compresses toward the ${peTrough}-${peBearHi}× trough zone. The kill-switch is two consecutive quarters below 15% Scores growth — if it triggers, do not average down.`,
    killSwitchTip: "A kill-switch is a pre-committed exit rule you set BEFORE you own the position — when you are thinking clearly. If Scores revenue growth falls below 15% YoY for two straight quarters, or the VantageScore approved-lender rollout visibly widens beyond its initial cohort, or new pricing-cap legislation is actually proposed, the thesis is broken: the pricing moat is cracking, not just the sentiment around it. Do not average down into a broken thesis — the market is telling you something. No debate, no rationalisation. Exit.",
    killSwitchTipNote: "Scores growth below 15% YoY twice running, or VantageScore rollout widening beyond the approved cohort, or new pricing legislation proposed. Any one. No debate.",
    killSwitchHtml: `<strong style="color:var(--title)">Two consecutive quarters of Scores revenue growth below 15% YoY, or the VantageScore approved-lender rollout visibly widening beyond its initial cohort, or new pricing-cap legislation proposed</strong> → exit or reduce. No debate. Do not average down into a broken thesis.`,
    nextCheck: "Next check: Q4 FY2026 earnings (~2026-10-late)",
    downsideFootnote: (px, peTrough, peBearHi) => `Bear case scenario: Scores growth decelerates below 15% YoY, or VantageScore substitution becomes real. Assumes a multiple compression toward ${peTrough}-${peBearHi}× on roughly flat-to-down earnings growth. Position loss is illustrative at $${px} entry.`,
    multipleSummary: (peNow, loPE, hiPE) => `At ~${peNow}× NTM P/E, FICO sits ${peNow < loPE ? "below" : "inside"} its normal range (${loPE}-${hiPE}×) — a real compression from the ~65× the stock traded at its Nov 2024 high, now roughly at the SPGI/MCO/VRSK/EFX peer median rather than FICO's own richer history.`,
    peBarTipSuffix: "P/E uses non-GAAP consensus NTM EPS. Filed GAAP EPS is lower (FY2026 GAAP guide $35.60 vs non-GAAP guide $42.43) — this thesis compares like-for-like against the consensus figure Street uses to set price targets, per this project's Wisesheets GAAP-vs-adjusted convention.",
    deepValueZoneNote: "Historically cheap for this business. Rare — last seen during the deepest point of the 2026 multiple grind (Apr 2026 trough). A real entry window if the VantageScore substitution fear proves overblown.",
    dislocPrecedent: (baseFloor) => `Historical precedent: the Jul 2025 FHFA/VantageScore dislocation has NOT cleanly resolved within the 365-day base-reversion window the way a pure sentiment shock typically does — price kept grinding lower for nine months past the initial event, then the Q3 FY2026 print and the Aug 2026 downgrades pulled it back down again. Base floor: $${baseFloor}.`,
    regretHtml: (currentPE) => `Q4 FY2026 Scores growth <strong style="color:#3fd07a">holds above 40% YoY</strong> AND the multiple actually re-expands above 31× instead of compressing further. That would confirm this quarter's KPI strength was real pricing-power durability, not a comp effect, re-rate the stock from ~${currentPE}× toward the bull zone, and close today's entry window.`,
    regretTip: "Charlie Munger's inversion: instead of asking 'why should I buy?', ask 'what would I have to believe happened, in hindsight, to wish I had bought more?' If Q4 FY2026 confirms Scores growth holding 40%+ and the multiple finally re-expands, today's entry window will close fast. This question is not about FOMO — it is about sizing correctly for your conviction.",
    chips: [
      { label: "KILL-SWITCH: SCORES &lt;15% YOY 2Q, OR VANTAGESCORE ROLLOUT WIDENS → EXIT", col: "#f1564b" },
      { label: "REGRET IF: SCORES HOLDS 40%+ + MULTIPLE RE-EXPANDS",                        col: "#3fd07a" },
      { label: "NEXT CHECK: ~2026-10-LATE EARNINGS",                                        col: "#2f6dff" },
    ],
    signalFootnote: (ntmEps) => `P/E uses consensus non-GAAP NTM EPS $${ntmEps} — FICO's GAAP EPS runs meaningfully lower due to stock-based compensation and interest expense on debt-funded buybacks; this thesis uses the adjusted figure Street sets price targets against, flagged per this project's Wisesheets GAAP-vs-adjusted convention.`,
  },

  past: {
    cardTips: {
      durability: (revCagrPct) => `Looks at Revenue, Gross Margin, and Free Cash Flow over the last 4 fiscal years (Wisesheets' free-tier history cap). We want upward trends that hold through cycles — not spike-and-crash. FICO grew revenue at ~${revCagrPct}% CAGR almost entirely through Scores segment price increases, with gross margin expanding from 78.1% to 82.2% even as the VantageScore competitive threat emerged mid-window.`,
      value: (latestROIC) => `ROIC (Return on Invested Capital) measures how efficiently management deploys capital. Above WACC (~9-10% for a company this size) = value creation. Below = value destruction. FICO's ROIC climbed from 44.9% (FY2022) to ${latestROIC}% (FY2025) — among the highest of any stock in this project's coverage, a direct result of a capital-light royalty model combined with aggressive buybacks that have pushed shareholders' equity NEGATIVE (a real, disclosed balance-sheet fact, not a calculation artifact).`,
      capex: (peakCapex, latestCapex, latestFCF) => `Capex as a % of revenue shows how much of every dollar gets reinvested before cash reaches shareholders. FICO's capex intensity has stayed under 0.6% of revenue every year in this window (${latestCapex}% in FY2025) — this is structurally NOT a capex story the way TSM, AMZN, or GOOGL are. FCF grew to $${latestFCF}B in FY2025 almost entirely from operating leverage on Scores pricing, not from any capex cycle monetizing.`,
      mood: (evNow, evAvg) => `EV/EBITDA vs its own 4-year average tells you whether the market is paying a premium or discount for this business. FICO's EV/EBITDA swung enormously across this window — from ~21x (FY2022) to a peak ~66x (FY2024, at the ATH-era euphoria) back down to ~${evNow}x today — a far wider swing than any capex-driven peer in this project, because the entire move is sentiment/multiple, not earnings.`,
    },
    stats: [
      { html: `Revenue <span style="color:#3fd07a;font-weight:700">$1.377B → $1.991B</span> (4Y)`, tipTitle: "Revenue (4-year)", tipBody: "FICO grew annual revenue from $1.377B (FY2022) to $1.991B (FY2025) — a ~13.1% CAGR, driven almost entirely by Scores segment price increases (from $0.60 to $10+ per mortgage score) rather than volume growth." },
      { html: `ROIC <span style="color:#3fd07a;font-weight:700">44.9% → 62.7%</span> (4Y)`, tipTitle: "ROIC (4-year)", tipBody: "Return on invested capital climbed from 44.9% (FY2022) to 62.7% (FY2025) — among the highest in this project's coverage. The capital-light royalty model plus buybacks funded partly by debt (equity is negative every year in this window) mechanically produces this result; it's real, not an error." },
      { html: `Price <span style="color:#3fd07a;font-weight:700">+127.6%</span> (Jul 2022 → now)`, tipTitle: "Total price return (since Jul 2022)", tipBody: "From $462.03 (Jul 2022) to $1,051.50 today = +127.6% — still strongly positive despite the stock being down more than half from its Nov 2024 ATH ($2,375.03). The whole round-trip is a multiple story: earnings grew every quarter through both the run-up and the crash." },
    ],
    verdictBody: "FICO has compounded revenue at ~13.1% annually over the last 4 fiscal years, almost entirely through Scores segment price increases rather than volume growth, with gross margin expanding from 78.1% to 82.2%. ROIC climbed to 62.7% (FY2025) — among the highest in this project's coverage, a real consequence of a capital-light royalty model combined with buybacks that have pushed equity negative. Capex intensity has stayed under 0.6% of revenue every year — this is structurally not a capex-cycle story. The entire FY2022-2025 window's EV/EBITDA swing (21x to 66x back to 41x) reflects the market's changing view of whether FICO's pricing power is durable, not any change in the underlying earnings trajectory, which kept growing throughout.",
    banners: {
      durability: (revCagrPct, rev0, rev9, gmDelta, latestGM, fcf0, latestFCF) => `Revenue compounded at ~${revCagrPct}% annually from $${rev0}B (FY2022) to $${rev9}B (FY2025) — almost entirely from Scores segment price increases. Gross margin expanded ${gmDelta} points to ${latestGM}%. FCF grew from $${fcf0}B to $${latestFCF}B over the same window, tracking earnings growth closely since capex is de minimis.`,
      value: (latestROIC) => `ROIC of ${latestROIC}% (FY2025) is among the highest in this project's coverage, comfortably clearing a typical WACC of 9-10% for a company this size by a wide margin. This reflects a genuinely capital-light royalty business, amplified by buybacks aggressive enough to push shareholders' equity negative — a real, disclosed structural feature of FICO's balance sheet, not a red flag on its own.`,
      capex: (latestCapex, peakCapex, latestFCF, fy26Guide) => `Capex/revenue of ${latestCapex}% (FY2025) is essentially unchanged across this entire 4-year window (0.3-0.5% every year) — FICO does not run a capex cycle the way AI-infrastructure peers do. FCF grew to $${latestFCF}B in FY2025 almost entirely from Scores pricing power converting directly to operating cash flow. The kill-switch for this thesis has nothing to do with capex; it's whether VantageScore substitution actually shows up in Scores revenue growth.`,
      mood: (evNow, evAvg) => `EV/EBITDA of ${evNow}× today sits well below the 4-year average of ${evAvg}× — the market has de-rated FICO hard from the FY2024 euphoria peak (~66×) toward something closer to the SPGI/MCO/VRSK/EFX peer median. Unlike a capex-driven peer, this swing has nothing to do with changing fundamentals — Scores revenue kept growing through the entire window.`,
    },
    revAnnotationsHtml: `<span>FY2022: <span style="color:var(--tx3)">$1.377B</span> (pre-VantageScore-fear baseline)</span><span>FY2025: <span style="color:var(--tx3)">$1.991B</span> (post price-hike acceleration, decelerating into VantageScore fear)</span>`,
    roicNote: "Green >15% · Amber 5-15% · Red <5% — FICO has stayed deep green every year in this window, climbing further each year",
    fcfYieldNote: "FCF yield swung from 4.9% (FY2022) down to 1.3% (FY2024, at the multiple peak) back up to 2.2% (FY2025) as the multiple compressed — a mirror image of the EV/EBITDA swing, both driven by price, not by FCF itself (which grew every year).",
    capexAnnotationsHtml: `<span>FY2023: <span style="color:#3fd07a">0.3%</span> (window low, still essentially de minimis)</span><span>FY2025: <span style="color:#e0a83b">0.4%</span> (window high still under 0.6% — no capex cycle exists at FICO)</span>`,
    footnotes: {
      durability: "FICO's growth in this window is almost entirely price-driven (Scores segment per-score fees rose from $0.60 to $10+) rather than volume-driven — a genuinely different growth mechanism from every other stock in this project's coverage. The 4-year window (FY2022-2025, Wisesheets' free-tier cap) captures the full run from pre-VantageScore-fear pricing power through the FHFA shock and into the current deceleration.",
      value: "ROIC climbed every year in this window (44.9% → 47.0% → 52.1% → 62.7%) as buybacks kept shrinking the equity base faster than operating income grew — equity is negative in every one of these four years. This is a real structural feature of FICO's capital-light model, not a data error; it also means a standard WACC-vs-ROIC 'value creation' read is less informative here than for a normal-balance-sheet business.",
      capex: "Capex/revenue has stayed in a tight 0.3-0.5% band across all 4 years — no capex cycle exists at FICO, unlike every AI-infrastructure-adjacent stock in this project. The kill-switch for this panel is not capex monetization; it's whether Scores revenue growth (the pricing-moat KPI) holds up as VantageScore's rollout evolves.",
      mood: "The scenario bands on the other tabs use forward P/E, not EV/EBITDA — FICO carries real debt (funding its buybacks) but has clean, comparable GAAP-vs-non-GAAP earnings. EV/EBITDA is shown purely to track cross-cycle mood, since it's capital-structure-neutral. The multiple peaked near 66x at the FY2024 ATH-era euphoria and sits near 41x on FY2025 year-end figures — both well above where it trades today, since price has fallen faster than trailing EBITDA in the months since.",
    },
    priceChartTitle: "FICO PRICE · MONTHLY · 2022-2026",
    priceChartSub: "$ per share · dashed lines = key events · window limited to available Wisesheets history",
    priceNowTip: (px, isATH) => `$${px} — where FICO trades today, ${isATH ? "also the highest monthly close in this window" : "well off the window's high (Nov 2024, $2,375.03)"}. The chart shows a price-hike-driven run-up through 2024, the Jul 2025 FHFA/VantageScore dislocation, nine more months of grinding decline into the real Apr 2026 trough, then a partial recovery cut short by the Q3 FY2026 miss and the Aug 2026 analyst downgrades.`,
    ddTip: (minDD) => `${minDD}% — the deepest drop from a prior high in this window, reached in Apr 2026 (real closing low $922.37 on 2026-04-10) — nine months after the initial Jul 2025 FHFA/VantageScore shock, not immediately after it. FICO partially recovered from this trough before the Q3 FY2026 print pulled it back down again. Drawdown charts help you visualize what holding through a bad period actually felt like.`,
    ddAnnotationsHtml: `<span>Max drawdown: <span style="color:#f1564b">−56.8%</span> (Apr 2026, nine months into the VantageScore multiple grind)</span><span>Current: <span style="color:#e0a83b">−52.7%</span> from the Nov 2024 high (Jul 2026 month-end close, before the Aug 2026 downgrades)</span>`,
  },
};
