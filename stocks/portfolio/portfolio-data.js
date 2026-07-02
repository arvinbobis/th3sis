/* ───────────────────────────────────────────────────────────────────────────
 * portfolio-data.js — single source of truth for the FOLIO + ACTIONS pages.
 *
 * LIVE SNAPSHOT pulled from Interactive Brokers, as of 2026-07-01. Account-level
 * numbers come from the IBKR account summary; per-position rows are the open
 * positions. Strategy config encodes the "$1,000 generator" (see STRATEGY.md).
 * Re-pull updates THIS ONE FILE and both pages follow. Prices drift daily.
 * Exposed as plain globals (loaded before the Babel script on each page).
 *
 * 2026-07-01: SPGI spun off its Mobility segment as MBGL (Mobility Global Inc),
 * distributed 1:1 — hence the matching 5.8357 share count. No thesis built yet.
 * ─────────────────────────────────────────────────────────────────────────── */

const PF_ASOF = "2026-07-01";
const PF_ACCT = { netLiq: 34674.73, cash: 2107.80, dividends: 2.08, buyingPower: 2107.80 };

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
  ["ALAB","Astera Labs",          0.3484, 289.87,  429.00,  149.46,   48.47,  -0.65, "semis",        true ],
  ["AMZN","Amazon.com",           8.1653, 202.74,  243.20, 1985.80,  330.40,  12.25, "platforms",    true ],
  ["ANET","Arista Networks",      0.6839, 147.66,  166.00,  113.53,   12.54,  -0.42, "semis",        false],
  ["ARM","Arm Holdings",          0.2558, 283.82,  329.90,   84.39,   11.79,  -1.94, "semis",        false],
  ["ASML","ASML Holding",         0.5986, 730.61, 1815.96, 1087.03,  649.69, -16.21, "semis",        true ],
  ["AVGO","Broadcom",             1.1432, 351.63,  367.00,  419.55,   17.57,  -2.68, "semis",        true ],
  ["AXP","American Express",      1.5881, 315.47,  347.75,  552.26,   51.27,   1.11, "payments",     false],
  ["BKNG","Booking Holdings",    10.7000, 188.61,  182.61, 1953.92,  -64.15,  -0.32, "diversifiers", false],
  ["BN","Brookfield",            11.0450,  45.36,   42.80,  472.73,  -28.27,   0.33, "diversifiers", false],
  ["CBOE","Cboe Global Markets",  1.0489, 286.95,  247.72,  259.83,  -41.15,   0.00, "findata",      false],
  ["CME","CME Group",             0.9659, 311.60,  230.00,  222.16,  -78.81,  -0.97, "findata",      false],
  ["EFX","Equifax",               4.9299, 253.60,  162.17,  799.48, -450.76,   0.00, "findata",      false],
  ["EQIX","Equinix",              0.0936,1078.41, 1013.62,   94.87,   -6.06,   0.00, "power",        false],
  ["ETN","Eaton",                 0.2627, 384.38,  409.82,  107.66,    6.68,  -0.65, "power",        false],
  ["FICO","Fair Isaac",           1.8783,1407.84, 1198.75, 2251.61, -392.74, -14.84, "findata",      true ],
  ["GE","GE Aerospace",           2.7332, 295.44,  375.51, 1026.34,  218.84,   1.56, "power",        false],
  ["GEV","GE Vernova",            0.2719,1106.68, 1120.00,  304.53,    3.62,  -3.90, "power",        false],
  ["GOOG","Alphabet",             3.0338, 227.50,  355.20, 1077.61,  387.41,  -8.16, "platforms",    true ],
  ["INTU","Intuit",               2.3960, 642.94,  267.21,  640.24, -900.24,   0.31, "platforms",    false],
  ["IUSG","iShares S&P US Growth",11.0836,163.04,  187.32, 2076.18,  269.08,   0.00, "index",        false],
  ["LRCX","Lam Research",         0.3395, 297.47,  388.00,  131.73,   30.74,  -1.11, "semis",        false],
  ["MA","Mastercard",             5.2499, 532.50,  522.44, 2742.76,  -52.84,   0.00, "payments",     false],
  ["MBGL","Mobility Global",      5.8357,  22.05,   21.19,  123.66,   -5.02,   0.00, "findata",      false],
  ["MCO","Moody's",               5.1545, 484.90,  468.38, 2414.26,  -85.17,   0.00, "findata",      false],
  ["META","Meta Platforms",       2.9644, 610.47,  609.00, 1805.32,   -4.36, -11.59, "platforms",    true ],
  ["MRVL","Marvell Technology",   0.3694, 194.44,  264.00,   97.52,   25.70,  -2.97, "semis",        true ],
  ["MSCI","MSCI",                 1.7176, 567.03,  582.03,  999.69,   25.76,   0.00, "findata",      false],
  ["MSFT","Microsoft",            5.8559, 434.43,  385.60, 2258.04, -285.94,   7.73, "platforms",    true ],
  ["MU","Micron Technology",      0.1323, 762.87, 1004.98,  132.96,   32.03,  -3.61, "semis",        true ],
  ["NVDA","NVIDIA",               2.1852, 183.96,  195.94,  428.17,   26.18,  -3.58, "semis",        true ],
  ["PWR","Quanta Services",       0.4109, 732.43,  688.01,  282.70,  -18.25,  -1.39, "power",        false],
  ["QQQ","Invesco QQQ",           0.9735, 722.02,  721.17,  702.06,   -0.83,  -3.89, "index",        false],
  ["SPGI","S&P Global",           5.8357, 504.01,  414.73, 2420.24, -520.98,  -1.40, "findata",      false],
  ["TSM","Taiwan Semiconductor",  0.7182, 419.10,  441.74,  317.26,   16.26,  -1.79, "semis",        true ],
  ["V","Visa",                    5.6834, 306.90,  350.51, 1992.07,  247.82,  -3.26, "payments",     false],
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
