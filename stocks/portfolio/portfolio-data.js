/* ───────────────────────────────────────────────────────────────────────────
 * portfolio-data.js — single source of truth for the FOLIO + ACTIONS pages.
 *
 * LIVE SNAPSHOT pulled from Interactive Brokers, as of 2026-06-30. Account-level
 * numbers come from the IBKR account summary; per-position rows are the open
 * positions. Strategy config encodes the "$1,000 generator" (see STRATEGY.md).
 * Re-pull updates THIS ONE FILE and both pages follow. Prices drift daily.
 * Exposed as plain globals (loaded before the Babel script on each page).
 * ─────────────────────────────────────────────────────────────────────────── */

const PF_ASOF = "2026-06-30";
const PF_ACCT = { netLiq: 33969.58, cash: 2103.48, dividends: 5.32, buyingPower: 2103.48 };

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
  ["ALAB","Astera Labs",          0.3484, 289.87,  458.64,  159.79,   58.80,   0.93, "semis",        true ],
  ["AMZN","Amazon.com",           8.1653, 202.74,  240.87, 1966.78,  311.37,   5.96, "platforms",    true ],
  ["ANET","Arista Networks",      0.6839, 147.66,  165.50,  113.19,   12.20,   0.96, "semis",        false],
  ["ARM","Arm Holdings",          0.2558, 283.82,  349.29,   89.35,   16.75,   1.46, "semis",        false],
  ["ASML","ASML Holding",         0.5986, 730.61, 1908.00, 1142.13,  704.79,  14.90, "semis",        true ],
  ["AVGO","Broadcom",             1.1432, 351.63,  375.84,  429.66,   27.68,   3.88, "semis",        true ],
  ["AXP","American Express",      1.5881, 315.47,  340.89,  541.37,   40.38,   0.02, "payments",     false],
  ["BKNG","Booking Holdings",    10.7000, 188.61,  182.60, 1953.82,  -64.25,   2.03, "diversifiers", false],
  ["BN","Brookfield",            11.0450,  45.36,   41.99,  463.78,  -37.22,  -1.66, "diversifiers", false],
  ["CBOE","Cboe Global Markets",  1.0489, 286.95,  231.51,  242.83,  -58.15,   0.00, "findata",      false],
  ["CME","CME Group",             0.9659, 311.60,  218.58,  211.13,  -89.84,   0.00, "findata",      false],
  ["EFX","Equifax",               4.9299, 253.60,  158.57,  781.73, -468.51,   0.00, "findata",      false],
  ["EQIX","Equinix",              0.0936,1078.41, 1085.17,  101.57,    0.63,   0.00, "power",        false],
  ["ETN","Eaton",                 0.2627, 384.38,  409.36,  107.54,    6.56,   0.29, "power",        false],
  ["FICO","Fair Isaac",           1.8783,1407.84, 1177.52, 2211.74, -432.62,   0.00, "findata",      true ],
  ["GE","GE Aerospace",           2.7332, 295.44,  374.66, 1024.02,  216.52,   2.60, "power",        false],
  ["GEV","GE Vernova",            0.2719,1106.68, 1108.92,  301.52,    0.61,   1.74, "power",        false],
  ["GOOG","Alphabet",             3.0338, 227.50,  351.71, 1067.02,  376.82,   1.30, "platforms",    true ],
  ["INTU","Intuit",               2.3960, 642.94,  267.20,  640.21, -900.26,   1.92, "platforms",    false],
  ["IUSG","iShares S&P US Growth",11.0836,163.04,  185.62, 2057.34,  250.24,   0.00, "index",        false],
  ["LRCX","Lam Research",         0.3395, 297.47,  424.70,  144.19,   43.20,   4.68, "semis",        false],
  ["MA","Mastercard",             5.2499, 532.50,  509.64, 2675.56, -120.04,   0.00, "payments",     false],
  ["MCO","Moody's",               5.1545, 484.90,  452.73, 2333.60, -165.83,   0.00, "findata",      false],
  ["META","Meta Platforms",       2.9644, 610.47,  564.00, 1671.92, -137.76,   4.15, "platforms",    true ],
  ["MRVL","Marvell Technology",   0.3694, 194.44,  282.50,  104.36,   32.53,   1.75, "semis",        true ],
  ["MSCI","MSCI",                 1.7176, 567.03,  558.00,  958.42,  -15.51,   0.00, "findata",      false],
  ["MSFT","Microsoft",            5.8559, 434.43,  371.13, 2173.30, -370.68,  14.99, "platforms",    true ],
  ["MU","Micron Technology",      0.1323, 762.87, 1162.58,  153.81,   52.88,   2.29, "semis",        true ],
  ["NVDA","NVIDIA",               2.1852, 183.96,  195.84,  427.95,   25.96,   1.90, "semis",        true ],
  ["PWR","Quanta Services",       0.4109, 732.43,  714.45,  293.57,   -7.39,   0.00, "power",        false],
  ["QQQ","Invesco QQQ",           0.9735, 722.02,  727.98,  708.69,    5.80,   3.80, "index",        false],
  ["SPGI","S&P Global",           5.8357, 504.01,  408.56, 2384.23, -556.99,   0.00, "findata",      false],
  ["TSM","Taiwan Semiconductor",  0.7182, 419.10,  453.40,  325.63,   24.63,  -1.22, "semis",        true ],
  ["V","Visa",                    5.6834, 306.90,  341.42, 1940.43,  196.17,  -1.30, "payments",     false],
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
