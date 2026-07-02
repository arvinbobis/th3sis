/* ───────────────────────────────────────────────────────────────────────────
 * portfolio-data.js — single source of truth for the FOLIO + ACTIONS pages.
 *
 * LIVE SNAPSHOT pulled from Interactive Brokers, as of 2026-07-02. Account-level
 * numbers come from the IBKR account summary; per-position rows are the open
 * positions. Strategy config encodes the "$1,000 generator" (see STRATEGY.md).
 * Re-pull updates THIS ONE FILE and both pages follow. Prices drift daily.
 * Exposed as plain globals (loaded before the Babel script on each page).
 *
 * 2026-07-01: SPGI spun off its Mobility segment as MBGL (Mobility Global Inc),
 * distributed 1:1 — hence the matching 5.8357 share count. No thesis built yet.
 * 2026-07-02: MBGL share count trimmed 5.8357 → 5 — likely an odd-lot/fractional
 * cleanup on the spinoff distribution, not a manual trade. Watch next snapshot.
 * ─────────────────────────────────────────────────────────────────────────── */

const PF_ASOF = "2026-07-02";
const PF_ACCT = { netLiq: 35152.71, cash: 2124.82, dividends: 2.09, buyingPower: 2124.82 };

const PF_THEMES = {
  semis:        { label: "AI Semis & Hardware",        short: "Semis",      blurb: "The picks-and-shovels of the AI build-out — chips, fab tools, networking silicon." },
  platforms:    { label: "Mega-Cap Platforms",         short: "Platforms",  blurb: "The compounding cash machines — cloud, ads, software distribution at global scale." },
  findata:      { label: "Financial Data & Exchanges", short: "Fin Data",   blurb: "Toll-booth businesses: ratings, indices, credit scores, exchange order flow. High moats, but priced rich." },
  payments:     { label: "Payment Networks",           short: "Payments",   blurb: "Card rails that clip a fee on global spending — secular volume growth, light capital." },
  power:        { label: "Power, Grid & Data Centers",  short: "Power/DC",   blurb: "The electricity and physical plumbing the AI era runs on — grid, turbines, colos." },
  index:        { label: "Core Index Funds",           short: "Index",      blurb: "Broad market ballast — diversification you don't have to underwrite stock by stock." },
  diversifiers: { label: "Diversifiers",               short: "Diversify",  blurb: "Holdings that march to their own drum — capital allocators, travel demand." },
};

// ticker, name, qty, avgCost, lastPx, mktVal, unrealPnl, dayPnl, theme, hasThesis
const PF_RAW = [
  ["ALAB","Astera Labs",          0.3484, 289.87,  405.00,  141.10,   40.11,  -9.01, "semis",        true ],
  ["AMZN","Amazon.com",           8.1653, 202.74,  242.72, 1981.88,  326.48,   8.33, "platforms",    true ],
  ["ANET","Arista Networks",      0.6839, 147.66,  159.98,  109.41,    8.42,  -4.54, "semis",        false],
  ["ARM","Arm Holdings",          0.2558, 283.82,  316.02,   80.84,    8.24,  -5.49, "semis",        false],
  ["ASML","ASML Holding",         0.5986, 730.61, 1779.78, 1065.38,  628.04, -37.87, "semis",        true ],
  ["AVGO","Broadcom",             1.1432, 351.63,  360.97,  412.66,   10.68,  -9.57, "semis",        true ],
  ["AXP","American Express",      1.5881, 315.47,  351.95,  558.94,   57.95,   7.79, "payments",     false],
  ["BKNG","Booking Holdings",    10.7000, 188.61,  184.20, 1970.94,  -47.13,  16.69, "diversifiers", false],
  ["BN","Brookfield",            11.0450,  45.36,   43.50,  480.46,  -20.54,   8.06, "diversifiers", false],
  ["CBOE","Cboe Global Markets",  1.0489, 286.95,  248.70,  260.86,  -40.12,   1.03, "findata",      false],
  ["CME","CME Group",             0.9659, 311.60,  236.00,  227.95,  -73.02,   4.83, "findata",      false],
  ["EFX","Equifax",               4.9299, 253.60,  168.70,  831.67, -418.57,  32.19, "findata",      false],
  ["EQIX","Equinix",              0.0936,1078.41, 1002.02,   93.79,   -7.15,  -1.09, "power",        false],
  ["ETN","Eaton",                 0.2627, 384.38,  399.98,  105.07,    4.10,  -3.24, "power",        false],
  ["FICO","Fair Isaac",           1.8783,1407.84, 1270.29, 2385.99, -258.36, 119.54, "findata",      true ],
  ["GE","GE Aerospace",           2.7332, 295.44,  377.89, 1032.85,  225.35,   8.06, "power",        false],
  ["GEV","GE Vernova",            0.2719,1106.68, 1114.00,  302.90,    1.99,  -5.53, "power",        false],
  ["GOOG","Alphabet",             3.0338, 227.50,  355.30, 1077.91,  387.72,  -7.86, "platforms",    true ],
  ["INTU","Intuit",               2.3960, 642.94,  275.97,  661.22, -879.25,  21.30, "platforms",    false],
  ["IUSG","iShares S&P US Growth",11.0836,163.04,  185.39, 2054.79,  247.69, -21.39, "index",        false],
  ["LRCX","Lam Research",         0.3395, 297.47,  352.92,  119.82,   18.83, -13.02, "semis",        false],
  ["MA","Mastercard",             5.2499, 532.50,  538.42, 2826.65,   31.05,  83.89, "payments",     false],
  ["MBGL","Mobility Global",      5.0000,  22.05,   19.80,   99.00,  -11.25,  -7.64, "findata",      false],
  ["MCO","Moody's",               5.1545, 484.90,  490.51, 2528.33,   28.90, 114.07, "findata",      false],
  ["META","Meta Platforms",       2.9644, 610.47,  584.45, 1732.54,  -77.14, -84.37, "platforms",    true ],
  ["MRVL","Marvell Technology",   0.3694, 194.44,  247.20,   91.32,   19.49,  -9.18, "semis",        true ],
  ["MSCI","MSCI",                 1.7176, 567.03,  602.82, 1035.40,   61.47,  35.71, "findata",      false],
  ["MSFT","Microsoft",            5.8559, 434.43,  390.33, 2285.73, -258.24,  35.43, "platforms",    true ],
  ["MU","Micron Technology",      0.1323, 762.87,  986.95,  130.57,   29.65,  -6.00, "semis",        true ],
  ["NVDA","NVIDIA",               2.1852, 183.96,  194.60,  425.24,   23.25,  -6.51, "semis",        true ],
  ["PWR","Quanta Services",       0.4109, 732.43,  668.90,  274.85,  -26.11,  -9.25, "power",        false],
  ["QQQ","Invesco QQQ",           0.9735, 722.02,  714.01,  695.09,   -7.80, -10.86, "index",        false],
  ["SPGI","S&P Global",           5.8357, 504.01,  432.99, 2526.80, -414.42, 105.16, "findata",      false],
  ["TSM","Taiwan Semiconductor",  0.7182, 419.10,  436.98,  313.84,   12.84,  -5.21, "semis",        true ],
  ["V","Visa",                    5.6834, 306.90,  361.71, 2055.74,  311.49,  60.41, "payments",     false],
];
const PF_POS = PF_RAW.map(r => ({
  t:r[0], name:r[1], qty:r[2], avg:r[3], px:r[4], mv:r[5], up:r[6], day:r[7], theme:r[8], thesis:r[9],
  ret: r[6] / (r[5] - r[6]) * 100,                       // unrealized return on cost
}));
const PF_LIVE = Object.fromEntries(PF_POS.map(p => [p.t, p]));

// ── Capital-allocation strategy ("$1,000 generator" — see STRATEGY.md) ────────
const PF_STRAT = {
  CORE_TICKERS:    ["IUSG", "QQQ"],   // broad-market core, weekly DCA
  TARGET_CORE_PCT: 70,                // simplify/focus target
  GEN_MULTIPLE:    2,                 // double = trim trigger (thesis-gated)
  GEN_MIN_PROG:    15,                // hide deep laggards far from trigger
  MUSK_BUCKET_CAP: 1000,              // SPCX + TSLA sized as ONE correlated ~$1,000 bet

  // Executed generator trims — original capital already recovered; the remainder
  // rides free as "house money". These are NO LONGER trim candidates: never
  // re-trim on price alone (the remaining shares can stay >2× cost indefinitely).
  // realized = banked gain on the sold slice; freeMV = remainder riding at trim time.
  TRIMMED: {
    ASML: { date:"2026-06-29", soldQty:0.46, soldPx:1851.77, proceeds:851.81, realized:514.72, freeMV:1142.13 },
  },

  // Active manual GTC limit ladder — all below market, speculative slices.
  // cap = planned new dollars (0 = no fresh capital / watchlist only).
  LIMITS: [
    { t:"GE",   limit:null, cap:0,   size:"ride → 2×",     musk:false, watch:false,
      anchor:"Own it cheap ($295 basis). Let ride to ~$1,600 position value (≈2× on $808), then trim ~$600–800 and let the rest ride. Don't add at record highs." },
    { t:"MU",   limit:900,  cap:850, size:"~$850 → $1k",   musk:false, watch:false,
      anchor:"Add to the $150 nibble toward ~$1,000 total. ~7–8× fwd earnings at $900 = real cushion vs a near-high entry." },
    { t:"TSLA", limit:250,  cap:500, size:"$500",          musk:true,  watch:false,
      anchor:"Re-entry at a 'buy real fear' level. No valuation floor (312× earnings) — sentiment/support anchor only. Size accordingly." },
    { t:"SPCX", limit:100,  cap:500, size:"$500",          musk:true,  watch:false,
      anchor:"Starter anchored to ~$63 DCF floor (Damodaran/Morningstar). Capped here — NOT a 2nd tranche." },
    { t:"TDG",  limit:1150, cap:0,   size:"small",         musk:false, watch:true,
      anchor:"Watchlist only. Better-valued than GE but 5.9× leverage + rate risk. GE is likely enough for aerospace." },
  ],

  // Per-stock thesis kill-switch review dates (next earnings = the real re-test).
  REVIEW_GATES: [
    { t:"AVGO", date:"2026-09-04", note:"VMware ARR = WATCH (software missed Q2). Gates any AVGO add AND the generator math." },
    { t:"TSM",  date:"2026-07-16", note:"Next print; thesis intact, holding small." },
    { t:"ALAB", date:"2026-08-11", note:"Leo CXL ramp is the key variable." },
  ],

  RULES: [
    "Buy chokepoints with a cushion — both must be true.",
    "A fill is not a gift — check WHY the price dropped first.",
    "Don't chase a bounce above your limit. Patience is the position.",
    "Don't add fresh capital just to round a number.",
    "Size correlated bets as one bucket (SPCX + TSLA = one Musk bet).",
    "Beware X / social selection bias — the boring 'fairly valued' note is often the honest one.",
    "Winners win because bought early/cheap — the cushion lives in the cost basis.",
    "Manual execution always — stay deliberate at the one moment that matters.",
  ],
};
