/* ───────────────────────────────────────────────────────────────────────────
 * portfolio-data.js — single source of truth for the FOLIO + ACTIONS pages.
 *
 * LIVE SNAPSHOT pulled from Interactive Brokers, as of 2026-06-29. Account-level
 * numbers come from the IBKR account summary; per-position rows are the open
 * positions. Strategy config encodes the "$1,000 generator" (see STRATEGY.md).
 * Re-pull updates THIS ONE FILE and both pages follow. Prices drift daily.
 * Exposed as plain globals (loaded before the Babel script on each page).
 * ─────────────────────────────────────────────────────────────────────────── */

const PF_ASOF = "2026-06-29";
const PF_ACCT = { netLiq: 33896.71, cash: 1252.68, dividends: 5.32, buyingPower: 1252.68 };

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
  ["ALAB","Astera Labs",          0.3484, 289.87,  388.46,  135.34,   34.35,  -1.14, "semis",        true ],
  ["AMZN","Amazon.com",           8.1653, 202.74,  242.99, 1984.07,  328.67,  84.08, "platforms",    true ],
  ["ANET","Arista Networks",      0.6839, 147.66,  156.40,  106.96,    5.97,  -0.82, "semis",        false],
  ["ARM","Arm Holdings",          0.2558, 283.82,  308.84,   79.00,    6.40,  -6.50, "semis",        false],
  ["ASML","ASML Holding",         1.0586, 730.61, 1786.36, 1891.04, 1117.62,  -8.74, "semis",        true ],
  ["AVGO","Broadcom",             1.1432, 351.63,  362.86,  414.83,   12.84,  -2.46, "semis",        true ],
  ["AXP","American Express",      1.5881, 315.47,  341.24,  541.92,   40.93,   1.40, "payments",     false],
  ["BKNG","Booking Holdings",    10.7000, 188.61,  184.35, 1972.55,  -45.53,  30.92, "diversifiers", false],
  ["BN","Brookfield",            11.0450,  45.36,   42.15,  465.55,  -35.45,  -7.95, "diversifiers", false],
  ["CBOE","Cboe Global Markets",  1.0489, 286.95,  235.87,  247.40,  -53.57,  -6.65, "findata",      false],
  ["CME","CME Group",             0.9659, 311.60,  221.85,  214.28,  -86.69,   0.82, "findata",      false],
  ["EFX","Equifax",               4.9299, 253.60,  159.11,  784.40, -465.85,   3.11, "findata",      false],
  ["EQIX","Equinix",              0.0936,1078.41, 1092.99,  102.30,    1.36,   0.16, "power",        false],
  ["ETN","Eaton",                 0.2627, 384.38,  404.84,  106.35,    5.38,   0.57, "power",        false],
  ["FICO","Fair Isaac",           1.8783,1407.84, 1203.83, 2261.15, -383.20,  39.52, "findata",      true ],
  ["GE","GE Aerospace",           2.7332, 295.44,  372.38, 1017.79,  210.29,   9.24, "power",        false],
  ["GEV","GE Vernova",            0.2719,1106.68, 1084.25,  294.81,   -6.10,  10.63, "power",        false],
  ["GOOG","Alphabet",             3.0338, 227.50,  346.38, 1050.85,  360.65,  35.47, "platforms",    true ],
  ["INTU","Intuit",               2.3960, 642.94,  274.45,  657.57, -882.90,  16.11, "platforms",    false],
  ["IUSG","iShares S&P US Growth",11.0836,163.04,  183.04, 2028.74,  221.64,  13.52, "index",        false],
  ["LRCX","Lam Research",         0.3395, 297.47,  384.62,  130.58,   29.59,   1.88, "semis",        false],
  ["MA","Mastercard",             5.2499, 532.50,  510.19, 2678.45, -117.15,  58.64, "payments",     false],
  ["MCO","Moody's",               5.1545, 484.90,  453.27, 2336.35, -163.08,  16.78, "findata",      false],
  ["META","Meta Platforms",       2.9644, 610.47,  564.97, 1674.80, -134.88,  43.64, "platforms",    true ],
  ["MRVL","Marvell Technology",   0.3694, 194.44,  253.28,   93.56,   21.74,  -4.98, "semis",        true ],
  ["MSCI","MSCI",                 1.7176, 567.03,  562.78,  966.63,   -7.30,  13.62, "findata",      false],
  ["MSFT","Microsoft",            5.8559, 434.43,  375.64, 2199.71, -344.27,  15.64, "platforms",    true ],
  ["MU","Micron Technology",      0.1323, 762.87, 1044.75,  138.22,   37.29, -11.59, "semis",        true ],
  ["NVDA","NVIDIA",               2.1852, 183.96,  191.65,  418.78,   16.80,  -1.93, "semis",        true ],
  ["PWR","Quanta Services",       0.4109, 732.43,  692.81,  284.68,  -16.28,   2.03, "power",        false],
  ["QQQ","Invesco QQQ",           0.9735, 722.02,  708.78,  690.00,  -12.89,   2.20, "index",        false],
  ["SPGI","S&P Global",           5.8357, 504.01,  407.66, 2378.98, -562.24,  -2.92, "findata",      false],
  ["TSM","Taiwan Semiconductor",  0.7182, 419.10,  435.12,  312.50,   11.50,   1.99, "semis",        true ],
  ["V","Visa",                    5.6834, 306.90,  343.25, 1950.84,  206.59,  39.91, "payments",     false],
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
