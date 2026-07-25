/* ───────────────────────────────────────────────────────────────────────────
 * portfolio-data.js — single source of truth for the FOLIO + ACTIONS + TREE +
 * STRATEGY pages.
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
 * 2026-07-07: AXP, V, and MSCI no longer appear in IBKR positions — closed since the
 * 2026-07-02 snapshot (cash jumped 2,124.82 → 5,694.94, consistent with 3 exits, not
 * a data-fetch gap). Flipped `held:false` on V/MSCI in PF_PRESCREEN below and dropped
 * V from PF_RADAR's "stablecoins" theme holdings (MA is still held, kept). AXP never
 * had a PF_PRESCREEN/PF_RADAR entry, nothing else to update for it. No thesis existed
 * for any of the three. MBGL's avgCost also moved 22.05 → 21.19 per IBKR's cost-basis
 * recalculation — not touched manually, just reflecting the live figure.
 * 2026-07-09 (earlier same day): full resync from live IBKR positions + trades. THE
 * GENERATOR RESEEDED: the MU GTC limit filled 2026-07-07 @ 899.80 (0.9446 sh ≈ $850.95
 * incl. commission — almost exactly the $851.81 ASML trim proceeds). MU moves from
 * LIMITS to the new PF_STRAT.SEEDED ledger and becomes the second station on the TREE.
 * Also in this sync: IUSG fully sold (11.08 sh) and replaced with QQQM + SPMO buys —
 * CORE_TICKERS updated to match reality (doctrine change from "IUSG + QQQ" made by the
 * user's own trades, not by this file); GEV added to ~$1,015 (0.9451 sh, avg now
 * 1,060.05); new DRAM (Roundhill Memory ETF, ~$1,050) — sits in the semis theme, no
 * thesis; MBGL trimmed a 0.8357 fractional 2026-07-02 (matches the earlier odd-lot guess).
 * 2026-07-09 (later same day, caught in this 07-11 resync): ANET, ARM, ALAB, LRCX, and
 * MRVL all FULLY SOLD within one minute of each other (13:35–13:37 UTC) — a deliberate
 * small-semi-satellite cleanup, not a data gap (total realized gain ~$126 across the
 * five: ANET +$26.80, MRVL +$19.38, ARM +$9.82, ALAB +$46.84, LRCX +$22.98). ALAB and
 * MRVL both had full built theses — this is a real exit from named, researched
 * positions, not just closing untracked legacy satellites. Dropped all five from PF_RAW.
 * 2026-07-11 (later same day): user resolved the ALAB/MRVL flag — deliberately NOT held,
 * tracked only via PF_ALERTS as re-entry watches. Existing QQQ/QQQM core already carries
 * passive exposure to both (Marvell is a Nasdaq-100 constituent) in the meantime; the
 * plan is to reseed a direct/concentrated position once valuation turns attractive again,
 * not to hold both a passive stake and a full satellite position at today's prices. Added
 * PF_ALERTS.MRVL (buyFloor 195 = its own base-case floor, matching the ALAB convention);
 * ALAB's existing entry kept as-is, no change needed there.
 * 2026-07-16: price/PnL-only resync from live IBKR (net liq 35,352.24 → 35,509.16, cash
 * unchanged ~5,363.56, dividends 2.99 → 7.19). Same 29 positions as 07-11 — no adds, no
 * exits, no share-count changes. Notable moves since: DRAM -13% ($63.00→$54.80, biggest
 * single-day dollar swing in the book at -$44.00), MU -10% ($982.98→$879.60, unrealized
 * flips positive→negative) despite this same week's thesis rewrite calling it undervalued
 * post-beat, GEV/TSM/EQIX also flip unrealized positive→negative on price alone. AMZN/GOOG/
 * META/MSFT/FICO all had a strong week. Also added PF_ALERTS.ASML (buyFloor 1900, its own
 * new base floor) — ASML never had a PF_ALERTS entry before its engine-split migration
 * today; TSM's buyFloor was already updated to 375 at its own update-thesis touch earlier
 * this session.
 * 2026-07-16 (later same day): added PF_ALERTS.MU (buyFloor $1,100 = its own base-case
 * floor) after /update-thesis MU — price fell ~15% since the 07-11 update in a mid-July
 * memory-sector selloff (SK Hynix's own Q2 profit miss, CXMT China-competition headlines)
 * with no new MU-specific bad news; thesis reaffirmed intact, target12 unchanged. First
 * PF_ALERTS entry MU has ever had.
 * 2026-07-23: full resync from live IBKR (net liq 35,183.20 → 34,774.18, cash 5,365.58 →
 * 4,284.59). THE SPCX GTC LIMIT FILLED 2026-07-20 @ $120 (9 sh, $1,080.00 incl. $1.00
 * commission — cash delta matches almost exactly). Removed from LIMITS (order is done, not
 * pending); it's now just a held position like any other — no SEEDED entry, since this was
 * fresh Musk-bucket capital per its own LIMITS row, not a harvest-funded replant like MU's.
 * SPCX is down since fill (avg $120.11 → now $115.05, -4.2%) with no new thesis-breaking
 * news identified this session — a real fear/dip, not (yet) a reason to act; TSLA (the
 * other Musk-bucket leg, still un-filled at its $250 limit) posted a -7.7% day today,
 * consistent with a 2026-07-22 earnings reaction, but at $345.25 remains far above the
 * limit and the FAILED /prescreen (no valuation cushion) is unchanged — informational only.
 * Live-quoted the two NOT-HELD watch tickers directly (they don't appear in IBKR positions):
 * MRVL now $208.25, back ABOVE its $195 re-entry floor (was $188.68/breached on 07-17) —
 * re-entry case unconfirmed either way, gate is still the ~2026-08-28 earnings. AVGO
 * (held) recovered to $390.50, essentially AT its $390 buy floor (was $369.99/-5.1% on
 * 07-17) — VMware ARR gate (2026-09-04) still the real re-test. ASML (held) at $1,782.99,
 * still BELOW its $1,900 floor (-6.2%), unchanged read from 07-17: no fresh thesis-breaking
 * news identified, flagged as a data gap not a re-underwrite.
 * SPGI's new /thesis (built 2026-07-18, base case $425–515, buyFloor $400) is now wired in:
 * added PF_ALERTS.SPGI and a REVIEW_GATES row for its 2026-07-28 earnings — 5 days out as
 * of this sync, the nearest catalyst of anything in the book. Live price $429.06 sits at the
 * bottom of the base band, well above the $400 floor — not a breach, just the name to watch
 * first. Flipped hasThesis true for SPGI in PF_RAW.
 * 2026-07-25: price/PnL-only resync from live IBKR (net liq 34,774.18 → 34,364.74, cash
 * unchanged at 4,284.59 — no new fills, no live orders). Broad drift, nothing thesis-
 * breaking identified. Sharpest single move: MRVL -8.1% today to $192.29 — back BELOW its
 * $195 re-entry floor again (was $208.25/above floor on 07-23, a ~2-day round trip through
 * the line). Re-entry gate is still the ~2026-08-28 earnings; this is a floor-touch note,
 * not a re-underwrite. AVGO also dipped back below its $390 floor ($381.43, was
 * essentially-at-floor on 07-23). ASML still below its $1,900 floor, slightly worse
 * ($1,755.39 vs $1,782.99). SPGI at $426.40 (was $429.06), still above its $400 floor, now
 * 3 days from its Jul 28 earnings gate. DRAM had the largest single-day dollar swing in the
 * book (-$92.25).
 * ─────────────────────────────────────────────────────────────────────────── */

const PF_ASOF = "2026-07-25";
const PF_ACCT = { netLiq: 34364.74, cash: 4284.59, dividends: 5.16, buyingPower: 4284.59 };

// ── Buy-alert pre-commitment (single source of truth for every armed ticker) ──
// Previously hand-mirrored in three places: each thesis's own `const ALERT`,
// stocks/index.html's REGISTRY[t].alert (drives the chip-dot radar), and
// STRATEGY.md §3's limit ladder. This block is now the ONE write point — the
// thesis's own ALERT const (if present) is a fallback for opening the file
// directly/offline, annotated as such; index.html reads this directly.
// thesisIntact is the one judgement software can't make: flip it to false the
// moment a kill-switch KPI breaches, which disarms the buy alert so you never
// add into a broken thesis. (See each stock's QUARTERLY checklist for the flip step.)
// ALAB and MRVL: NOT currently held (sold 2026-07-09) — these two are re-entry
// watches, not active-position alerts. Passive QQQ/QQQM exposure covers the gap
// until valuation looks attractive again; buyFloor = each thesis's own base-case
// floor (the same convention used for held names).
const PF_ALERTS = {
  ALAB: { buyFloor: 300, thesisIntact: true, asOf: PF_ASOF, nextEarnings: "2026-08-11", held: false },
  MRVL: { buyFloor: 195, thesisIntact: true, asOf: PF_ASOF, nextEarnings: "~2026-08-28", held: false },
  AVGO: { buyFloor: 390, thesisIntact: true, asOf: PF_ASOF, nextEarnings: "2026-09-04" },
  TSM:  { buyFloor: 375, thesisIntact: true, asOf: "2026-07-16", nextEarnings: "2026-10-15" },
  ASML: { buyFloor: 1900, thesisIntact: true, asOf: "2026-07-16", nextEarnings: "2026-10-14" },
  MU:   { buyFloor: 1100, thesisIntact: true, asOf: "2026-07-16", nextEarnings: "~2026-09-24" },
  SPGI: { buyFloor: 400, thesisIntact: true, asOf: "2026-07-18", nextEarnings: "2026-07-28" },
};

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
// AXP, MSCI, and V dropped 2026-07-07; ALAB, ANET, ARM, LRCX, and MRVL dropped
// 2026-07-09 (later same day than that sync) — all closed positions per live IBKR
// pull, see header note. ALAB and MRVL both had full built theses.
const PF_RAW = [
  ["AMZN","Amazon.com",           8.1653, 202.74,  231.55, 1890.68,  235.28, -17.23, "platforms",    true ],
  ["ASML","ASML Holding",         0.5986, 730.61, 1755.39, 1050.78,  613.44, -28.50, "semis",        true ],
  ["AVGO","Broadcom",             1.1432, 351.63,  381.43,  436.05,   34.07, -12.62, "semis",        true ],
  ["BKNG","Booking Holdings",    10.7000, 188.61,  177.26, 1896.68, -121.39,  47.40, "diversifiers", false],
  ["BN","Brookfield",            11.0450,  45.36,   41.67,  460.25,  -40.75,   5.08, "diversifiers", false],
  ["CBOE","Cboe Global Markets",  1.0489, 286.95,  285.07,  299.01,   -1.97,   0.22, "findata",      false],
  ["CME","CME Group",             0.9659, 311.60,  255.37,  246.66,  -54.31,   1.01, "findata",      false],
  ["DRAM","Roundhill Memory ETF",16.9247,  59.14,   52.85,  894.46, -106.54, -92.25, "semis",        false],
  ["EFX","Equifax",               4.9299, 253.60,  172.54,  850.60, -399.64,  28.69, "findata",      false],
  ["EQIX","Equinix",              0.0936,1078.41, 1084.24,  101.48,    0.55,   4.74, "power",        false],
  ["ETN","Eaton",                 0.2627, 384.38,  404.07,  106.15,    5.17,  -2.91, "power",        false],
  ["FICO","Fair Isaac",           1.8783,1407.84, 1237.37, 2324.15, -320.20,  58.57, "findata",      true ],
  ["GE","GE Aerospace",           2.7332, 295.44,  354.30,  968.37,  160.87,  14.49, "power",        false],
  ["GEV","GE Vernova",            0.9451,1060.05, 1014.75,  959.04,  -42.81, -15.54, "power",        false],
  ["GOOG","Alphabet",             3.0338, 227.50,  318.60,  966.57,  276.37,   0.79, "platforms",    true ],
  ["INTU","Intuit",               2.3960, 642.94,  295.25,  707.42, -833.06,  32.87, "platforms",    false],
  ["MA","Mastercard",             5.2499, 532.50,  537.27, 2820.61,   25.02,  36.64, "payments",     false],
  ["MBGL","Mobility Global",      5.0000,  21.19,   20.55,  102.75,   -3.20,  -0.75, "findata",      false],
  ["MCO","Moody's",               5.1545, 484.90,  471.50, 2430.35,  -69.08,  -3.81, "findata",      false],
  ["META","Meta Platforms",       2.9644, 610.47,  594.10, 1761.15,  -48.53, -35.57, "platforms",    true ],
  ["MSFT","Microsoft",            5.8559, 434.43,  381.40, 2233.44, -310.54,  -1.05, "platforms",    true ],
  ["MU","Micron Technology",      1.0769, 883.91,  910.77,  980.81,   28.93, -85.55, "semis",        true ],
  ["NVDA","NVIDIA",               2.1852, 183.96,  206.80,  451.90,   49.91,  -4.28, "semis",        true ],
  ["PWR","Quanta Services",       0.4109, 732.43,  625.84,  257.16,  -43.80, -11.49, "power",        false],
  ["QQQ","Invesco QQQ",           0.9735, 722.02,  683.90,  665.78,  -37.11,  -7.85, "index",        false],
  ["QQQM","Invesco Nasdaq 100",   0.6868, 292.65,  281.60,  193.41,   -7.58,  -2.32, "index",        false],
  ["SPCX","SpaceX (Space Exploration Technologies)", 9.0000, 120.11, 113.45, 1021.01, -59.99, -43.15, "diversifiers", false],
  ["SPGI","S&P Global",           5.8357, 504.01,  426.40, 2488.34, -452.88,  37.35, "findata",      true ],
  ["SPMO","Invesco S&P 500 Momentum", 1.3592, 147.87, 146.53, 199.16,  -1.83,  -4.49, "index",        false],
  ["TSM","Taiwan Semiconductor",  0.7182, 419.10,  402.20,  288.86,  -12.14,  -9.61, "semis",        true ],
];
const PF_POS = PF_RAW.map(r => ({
  t:r[0], name:r[1], qty:r[2], avg:r[3], px:r[4], mv:r[5], up:r[6], day:r[7], theme:r[8], thesis:r[9],
  ret: r[6] / (r[5] - r[6]) * 100,                       // unrealized return on cost
}));
const PF_LIVE = Object.fromEntries(PF_POS.map(p => [p.t, p]));

// ── Capital-allocation strategy ("$1,000 generator" — see STRATEGY.md) ────────
const PF_STRAT = {
  // 2026-07-07: user sold IUSG entirely and bought QQQM + SPMO — core is now these
  // three (doctrine drift from "IUSG + QQQ" in STRATEGY.md §2; reflected here so the
  // core-% math stays honest, flagged for the next STRATEGY.md review).
  CORE_TICKERS:    ["QQQ", "QQQM", "SPMO"],
  TARGET_CORE_PCT: 70,                // simplify/focus target
  GEN_MULTIPLE:    2,                 // double = trim trigger (thesis-gated)
  GEN_MIN_PROG:    15,                // hide deep laggards far from trigger
  MUSK_BUCKET_CAP: 1580,              // SPCX + TSLA sized as ONE correlated bet — raised
                                       // 2026-07-11 from $1,000 (deliberate, not a drift:
                                       // user resized the live SPCX GTC order to 9 sh @
                                       // $120 = $1,080 after reviewing real post-IPO
                                       // analyst data; $500 TSLA plan unchanged; see LIMITS)

  // Executed generator trims — original capital already recovered; the remainder
  // rides free as "house money". These are NO LONGER trim candidates: never
  // re-trim on price alone (the remaining shares can stay >2× cost indefinitely).
  // realized = banked gain on the sold slice; freeMV = remainder riding at trim time.
  TRIMMED: {
    ASML: { date:"2026-06-29", soldQty:0.46, soldPx:1851.77, proceeds:851.81, realized:514.72, freeMV:1142.13 },
  },

  // Seeds DEPLOYED but not yet harvested — the recycled ~$1,000 living in its next
  // idea. A ticker graduates from here to TRIMMED on its own thesis-gated 2× harvest.
  // planted = actual fill cost incl. commission; from = which harvest funded it (omit
  // for a seed that's fresh capital, not a recycled harvest — see THREAD_META/SPCX).
  // thread ties an entry to its own independent trunk on the GENERATOR tree — default
  // (unset) = "core", the single ASML→MU→… recycled-seed chain. A different thread is
  // its own separate stake, sized once, not fed by nor feeding the core chain.
  SEEDED: {
    MU: { date:"2026-07-07", from:"ASML", planted:850.95, fillPx:899.80, fillQty:0.9446,
          note:"GTC limit @900 filled — the ASML trim proceeds ($851.81) replanted almost to the dollar. Prior $101 nibble (0.1323 sh @762.87) folds into the same position: 1.0769 sh @ avg 883.91. 2× trigger ≈ $1,768 (thesis-gated: AI/HBM supercycle per stocks/MU thesis; kill-switch = cycle turn, see checklist)." },
    SPCX: { date:"2026-07-20", thread:"musk", planted:1080.00, fillPx:120, fillQty:9,
          note:"GTC limit @120 filled — fresh Musk-bucket capital (see LIMITS/MUSK_BUCKET_CAP), NOT a recycled harvest like the ASML→MU seed. A second, independent generator thread: same mechanic (plant → let it double → thesis-gated harvest → reseed), its own separate ~$1,080 stake sized to the correlated SPCX+TSLA bet — doesn't feed from, or into, the core chain. TSLA (the bucket's other leg, still resting at its $250 limit) would be a second station on this SAME thread once/if it fills, not its own third thread." },
  },

  // Per-thread metadata for the GENERATOR tree (stocks/portfolio/generator.html) — each
  // thread gets its own seed pill + trunk, rendered independently so a second seed never
  // visually implies it was fed by the first thread's harvest.
  THREAD_META: {
    core: { label: "$1,000 generator", seedAmount: 1000 },
    musk: { label: "Musk-bucket seed",  seedAmount: 1080 },
  },

  // Active manual GTC limit ladder — all below market, speculative slices.
  // cap = planned new dollars (0 = no fresh capital / watchlist only).
  LIMITS: [
    { t:"GE",   limit:null, cap:0,   size:"ride → 2×",     musk:false, watch:false,
      anchor:"Own it cheap ($295 basis). Let ride to ~$1,600 position value (≈2× on $808), then trim ~$600–800 and let the rest ride. Don't add at record highs." },
    // MU removed 2026-07-09: the 900 GTC limit FILLED 2026-07-07 → see SEEDED above.
    // Three rows added 2026-07-19: PF_ALERTS buy floors breached (Wisesheets 07-17 close)
    // with no order mechanism tracking any of them on this page — found while auditing
    // "action needed but no order yet." Sizes deliberately left TBD/$0 cap: no capital
    // amount was decided this session (data/documentation update only, per instruction —
    // manual execution always, this is not a placed order).
    { t:"AVGO", limit:390,  cap:0,   size:"TBD — held, size not decided", musk:false, watch:false,
      anchor:"HELD. Buy floor ($390, base-case floor) breached again: $381.43 as of 2026-07-25 (was essentially flat vs floor on 07-23, -2.2% now). VMware ARR REVIEW_GATE (2026-09-04) explicitly conditions any add — thesisIntact is still true, but that earnings print is the real re-test before sizing anything here. The Amazon RNG custom-networking WATCH item (added 2026-07-18) is still just a watch, not yet a kill-switch." },
    { t:"ASML", limit:1900, cap:0,   size:"TBD — held/trimmed, size not decided", musk:false, watch:false,
      anchor:"HELD (post-harvest, remainder rides as house money — see TRIMMED). Buy floor ($1,900, set 2026-07-16) still breached: $1,755.39 as of 2026-07-25 (-7.6%, slightly worse than -6.2% on 07-23). This would be a fresh-capital add, not a re-buy of already-trimmed shares. No new thesis-breaking news identified this session — flagged as a data gap, not evaluated for whether the drop is warranted." },
    { t:"MRVL", limit:195,  cap:0,   size:"TBD — NOT held, re-entry, size not decided", musk:false, watch:false,
      anchor:"NOT HELD (sold 2026-07-09). Re-entry floor ($195) breached again as of 2026-07-25: $192.29, down -8.1% in a single session (was $208.25/above floor on 07-23 — a ~2-day round trip through the line). Full re-underwrite gate is still the ~2026-08-28 earnings (see REVIEW_GATES) — this row exists so the floor-touch itself isn't silently missed, not to imply the re-entry case has been re-verified either way." },
    { t:"TSLA", limit:250,  cap:500, size:"$500",          musk:true,  watch:false,
      anchor:"Not yet placed (SPCX filled 2026-07-20; this one still waits). /prescreen FAILED on cushion 2026-07-12 (~182–396× earnings depending on metric) — no valuation floor, sentiment/support anchor only. $250 = a real ~16% break below the observed 52wk low, not an arbitrary guess. Reported earnings 2026-07-22, dropped -7.7% the next session; continued drifting lower, $311.30 as of 2026-07-25 (-2.6% that day). Still far above the $250 limit and the FAIL verdict is unchanged; informational only, no action." },
    { t:"TDG",  limit:1150, cap:0,   size:"small",         musk:false, watch:true,
      anchor:"Watchlist only. Better-valued than GE but 5.9× leverage + rate risk. GE is likely enough for aerospace." },
  ],

  // Per-stock thesis kill-switch review dates (next earnings = the real re-test).
  REVIEW_GATES: [
    { t:"AVGO", date:"2026-09-04", note:"VMware ARR = WATCH (software missed Q2). Gates any AVGO add AND the generator math. Update 2026-07-25: five EU cloud-industry groups (CISPE + Belgium's Beltug, France's Cigref, Germany's VOICE, CIO Platform Nederland) sent a joint letter dated 2026-07-10 asking EU antitrust regulators for interim measures against Broadcom's VMware licensing changes, with a 3-year transition period ask while the investigation continues. No ruling yet — Broadcom disputes the allegations and calls CISPE hyperscaler-funded. A real escalation of the same underlying VMware-ARR risk, not a new thread; still a WATCH, not a kill-switch, until a regulatory action actually lands." },
    { t:"TSM",  date:"2026-10-15", note:"Q2 2026 beat-and-raise (rev/GM/OM/EPS all beat, capex+growth guide raised) but ADR pulled back on 'sell the news'; buyFloor lowered to $375 (new base floor). Thesis intact." },
    { t:"ALAB", date:"2026-08-11", note:"NOT HELD (sold 2026-07-09) — this now gates the re-entry buyFloor ($300 in PF_ALERTS), not an add to an existing position. Leo CXL ramp is still the key variable to re-check before re-underwriting." },
    { t:"MRVL", date:"~2026-08-28", note:"NOT HELD (sold 2026-07-09) — gates the re-entry buyFloor ($195 in PF_ALERTS, its own base-case floor). Passive QQQ/QQQM exposure covers the gap until then. Update 2026-07-25: multiple reports (unconfirmed by either company) say Amazon moved Trainium3/Trainium4 design work to Taiwan's Alchip Technologies after Marvell lost the design bakeoff on execution/timeline — Marvell likely keeps the interconnect/switching/storage work regardless. This is real evidence of exactly the shape of MRVL's own stated kill-switch (\"a competitor winning 3+ of the 18 XPU design sockets before production ramp\") — one data point toward that threshold, not the threshold itself. Also today's -8.1% MRVL move (see FOLIO 07-25 sync) is mostly a broad memory/semis-sector selloff (SK Hynix -7.1%, Samsung -8%, SanDisk -8.6%, Kioxia/Tokyo Electron/Advantest all down on AI-capex + memory-cost spillover fears), not isolated to this news — hard to cleanly separate the two in one day's move. Raises the bar for the re-entry re-underwrite at the ~08-28 earnings: confirm whether this is 1-of-18 or the start of a real erosion pattern." },
    { t:"MU",   date:"~2026-09-24", note:"Price fell ~15% since the 07-11 update ($979→~$880) in a mid-July memory-sector selloff (SK Hynix's own Q2 miss, CXMT headlines) — no new MU-specific bad news, thesis intact, base floor unchanged at $1,100. First PF_ALERTS entry for MU. Update 2026-07-19: price has drifted further to $844 (07-17 close) — now BELOW the $883.91 avg cost of the existing SEEDED position, not just below the $1,100 thesis floor. Already fully seeded (see PF_STRAT.SEEDED) — not added to LIMITS as a fresh-capital row; whether to add MORE below the existing seed's own cost basis is a judgment call, not a mechanical trigger (rule 4: don't add just because it dropped). Update 2026-07-23: price recovered to $964.80, unrealized flipped back positive. Update 2026-07-25: price back down to $910.77 in a broad two-day AI-memory/semis selloff (SK Hynix -7.1%, Samsung -8%, SanDisk -8.6%, Kioxia/Tokyo Electron/Advantest also down; South Korea's Kospi -5.7%) — but the proximate trigger this time is reported RISING memory prices squeezing OEM margins (Apple reportedly raised product prices to offset memory costs), not the oversupply/competition fear from the 07-16 selloff. Worth flagging as genuinely two-sided for a producer like MU: tight supply and pricing power are normally the bull case, not the bear case — this reads more like profit-taking on a strong pricing backdrop than new negative information. No thesis-breaking evidence identified; still a data point to watch, not a re-underwrite trigger." },
    { t:"SPGI",  date:"2026-07-28", note:"HELD legacy position (pre-existing, not a generator seed), thesis built 2026-07-18 with base case $425–515 and buyFloor $400. Live at $426.40 as of 2026-07-25 (was $429.06 on 07-23) — sits at the bottom of its own base band, well above the $400 floor, not breached. Nearest earnings catalyst of anything in the book (3 days out as of this sync) — this is also the reissued first ex-Mobility guide. Kill-switch: Ratings billed issuance growth turns negative before the guided Q4 2026 deceleration (confirming Q1's strength was pulled forward, not durable), or two straight quarters of continuing-ops organic cc revenue missing the 6-8% FY2026 guide." },
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

// ── The /prescreen gate (see STRATEGY.md §7 and .claude/commands/prescreen.md) ─
// Six questions run before any full /thesis build. Q1–Q2 are unconditional: fail
// either one → automatic FAIL, no exceptions. Q3–Q6 are judgment calls that can
// offset each other.
const PF_GATE = {
  updated: "2026-07-03",
  QUESTIONS: [
    { n:1, key:"chokepoint",   label:"Chokepoint",       unconditional:true,
      q:"State the bottleneck this company owns that competitors can't route around, in one sentence.",
      fail:"No clean answer beyond “good company” or “growing market.”" },
    { n:2, key:"cushion",      label:"Cushion",          unconditional:true,
      q:"Does the price hold up under the right valuation ruler without a heroic multi-year narrative?",
      fail:"Price only works if the bull case plays out perfectly." },
    { n:3, key:"priced-in",    label:"Already priced-in?", unconditional:false,
      q:"Is this still contrarian, or already found by the market / sell-side / media?",
      fail:"Late discovery with no edge and no pullback." },
    { n:4, key:"correlation",  label:"Correlation",      unconditional:false,
      q:"Does this duplicate a risk cluster already in the portfolio?",
      fail:"Adds nothing the existing position doesn't already cover." },
    { n:5, key:"portfolio-fit", label:"Portfolio fit",   unconditional:false,
      q:"Is there actual room under the core/satellite caps?",
      fail:"A real thesis doesn't automatically earn a slot." },
    { n:6, key:"kill-switch",  label:"Kill-switch",      unconditional:false,
      q:"Name the one piece of evidence that would prove this wrong, right now.",
      fail:"Nothing comes to mind — the thesis isn't sharp enough yet." },
  ],
};

// Every ticker that has actually been run through /prescreen (not the full portfolio —
// only add a row here once the six-question gate has really been applied to that name).
// held = currently a live position; bucket = correlated-bet grouping (never re-add fresh
// capital to two names in the same bucket as if they were independent ideas).
const PF_PRESCREEN = [
  { t:"PLTR", verdict:"FAIL",  date:"2026-07-02", held:false, bucket:null,
    chokepoint:"Enterprise/govt workflow lock-in — sticky, not a hard bottleneck (Microsoft/Google gov-cloud AI stacks can route around it, just slower).",
    cushion:"~80x trailing sales — each blowout quarter just maintains existing expectations, doesn't create upside.",
    note:"Revisit only on real multiple compression, not on Nvidia/Army headline momentum." },
  { t:"SPGI",  verdict:"PASS",  date:"2026-07-03", held:true, bucket:null,
    chokepoint:"Ratings duopoly (NRSRO status) — a genuine regulatory bottleneck.",
    cushion:"Fwd P/E ~20.8 vs its own 5-yr avg ~29.3 — a real discount to its own history.",
    note:"Mobility spinoff (7/1/26) simplifies the story further. Full /thesis built 2026-07-18 — see PF_ALERTS.SPGI and stocks/spgi/." },
  { t:"MCO",   verdict:"FAIL",  date:"2026-07-03", held:true, bucket:null,
    chokepoint:"Same NRSRO ratings duopoly as SPGI.",
    cushion:"Fwd P/E ~26.8, ~63% above the Capital Markets industry median — no margin of safety.",
    note:"Redundant with SPGI — don't add fresh capital here." },
  { t:"EFX",   verdict:"WATCH", date:"2026-07-03", held:true, bucket:null,
    chokepoint:"The Work Number — a genuinely hard-to-replicate scale asset.",
    cushion:"Fwd P/E ~19–20x — only fair.",
    note:"Morningstar downgraded the moat to narrow from wide — a real erosion signal, not noise. Revisit on a further price drop or once the moat debate resolves either way." },
  { t:"MSCI",  verdict:"FAIL",  date:"2026-07-03", held:false, bucket:null,
    chokepoint:"Index-embeddedness moat — real, but narrower than SPGI/MCO's.",
    cushion:"Fwd P/E ~30.5–31, ~90% above the industry median — no cushion at all.",
    note:"Priced as a flawless compounder." },
  { t:"CME",   verdict:"PASS",  date:"2026-07-03", held:true, bucket:null,
    chokepoint:"Deepest liquidity/clearing network of the exchange group — a genuine network-effect moat.",
    cushion:"Fwd P/E ~22–25 (“fairly valued”); the ~9% Kalshi/perpetual-futures selloff adds real cushion.",
    note:"Kill-switch is trackable: outcome of CME's CFTC lawsuit and whether Kalshi captures institutional (not just retail) volume." },
  { t:"CBOE",  verdict:"FAIL",  date:"2026-07-03", held:true, bucket:null,
    chokepoint:"SPX/VIX options ecosystem — real, but narrower and analysts flag it as most exposed to Kalshi.",
    cushion:"Still ~7% above one fair-value estimate even after a 25% drawdown.",
    note:"Redundant with CME — same risk bucket, weaker/more concentrated moat." },
  { t:"INTU",  verdict:"PASS",  date:"2026-07-03", held:true, bucket:null,
    chokepoint:"TurboTax/QuickBooks data depth + tax-code complexity + switching costs.",
    cushion:"Down 38% YTD — a real re-rating already happened (fwd P/E ~20x vs ~16x sector avg).",
    note:"“AI eats TurboTax” fear is now the loud consensus view — priced in, not hidden. The most interesting name in the legacy cluster." },
  { t:"V",     verdict:"PASS",  date:"2026-07-03", held:false, bucket:"payments-duopoly",
    chokepoint:"Two-sided network, 4B+ cards — near-unbreakable without a government mandate.",
    cushion:"Fwd P/E ~21.5–24.4 — fair, not deep.",
    note:"Stablecoin threat to the 2–3% fee model is live and genuinely two-sided right now, not settled." },
  { t:"MA",    verdict:"PASS",  date:"2026-07-03", held:true, bucket:"payments-duopoly",
    chokepoint:"Identical moat character to Visa.",
    cushion:"Current P/E ~23% below its own historical average — a real discount-to-history signal.",
    note:"Same stablecoin/Credit Card Competition Act risk as Visa — treat V+MA as ONE bucket, not two independent bets." },
  { t:"RKLB",  verdict:"FAIL",  date:"2026-07-03", held:false, bucket:null,
    chokepoint:"Launch cadence (Electron/Neutron) +, post-Iridium, exclusive L-band spectrum licensing and a 66-satellite LEO network — real, but a second-tier bottleneck behind SpaceX.",
    cushion:"~89x trailing sales, still -27% margin, re-rated another +16% on the very $8B Iridium deal being evaluated — no margin of safety if the space-datacenter narrative slips.",
    note:"Scout (grok-buy-side-scalper) flagged the space/orbital-compute theme across 4 reports (reward 7.8), but the valuation problem STRATEGY.md §6 already noted (~65–100x sales, no cushion) has gotten worse, not better. Duplicates existing SPCX space exposure. Re-confirms the prior pass, not a reversal." },
  { t:"GE",    verdict:"FAIL",  date:"2026-07-09", held:true, bucket:null,
    chokepoint:"Half the narrow-body engine duopoly (CFM/LEAP with Safran): every 737 MAX + ~60% of A320neos, engines certified with the airframe (no supplier switch on an existing fleet), >70% of commercial engine revenue is locked-in aftermarket on a decades-long installed base.",
    cushion:"~$379 = ~50x 2026 guided EPS ($7.10–7.40), ~2x the industry avg multiple, ABOVE the consensus target ($358–363) at record highs — the cushion lives entirely in the $295 cost basis, none in today's price.",
    note:"MCO pattern: genuine moat, held, no margin of safety for fresh capital — confirms the ladder's 'don't add at record highs'. This prescreen also defines the previously-undefined gate for the ride→2× trim plan: thesis-intact = LEAP duopoly holding AND aftermarket services growth staying double-digit (kill-switch: services deceleration below ~10%, or a LEAP durability directive / airline aftermarket-pricing revolt denting margins)." },
  { t:"INTC",  verdict:"FAIL",  date:"2026-07-09", held:false, bucket:null,
    chokepoint:"Only leading-edge logic + advanced packaging (EMIB-T ~90% yields, 18A) outside Taiwan, and hyperscalers now demonstrably want a second source (Google 3M-TPU order, NVIDIA evaluating 18A/14A for Feynman) — real, but conditional on yields holding at scale: a chokepoint being built, not owned yet.",
    cushion:"~$109 after a 450% 12-month run (52wk $18.97–$142.35), ~$0.80/yr run-rate EPS, Foundry still losing ~$2.5–3.2B PER QUARTER, avg analyst target ($101) below the price — the market pre-paid the bull case; the cushion was spent by whoever bought at $20–40.",
    note:"The flip side of PF_RADAR's packaging-multivendor row (same EMIB-T evidence that threatens TSM, viewed from the disruptor). Scout surfaced it Jul 1 — the week the stock printed $142; sell-side already split HSBC $200 vs BofA 'bubble'. Also duplicates the dominant semi/AI-capex cluster. Re-run /prescreen on a deep derate (normalized-2028-earnings ruler showing real cushion) WITH the Google/NVIDIA wins still intact — the RKLB-style re-entry condition." },
  { t:"TSLA",  verdict:"FAIL",  date:"2026-07-12", held:false, bucket:"musk",
    chokepoint:"The FSD data-flywheel (8.4B+ training miles vs Waymo's ~200M) is a real, specific mechanism, not hand-waving — but it's a data-VOLUME claim, not a commercial-EXECUTION one. Waymo runs ~3,000 vehicles across 11 metros at ~500K paid rides/week TODAY; Tesla's unsupervised robotaxi fleet is ~20 vehicles despite the Jul 3 Miami launch. Contested, not clean.",
    cushion:"~182–396x earnings depending on the metric (forward vs trailing) at $407.59 — requires robotaxi AND Optimus to both fully materialize to make any sense. Not new information: STRATEGY.md's own pre-existing language already said 'no valuation floor... buying belief, not value' — this prescreen just makes that verdict formal. Unconditional fail per the gate's own rule.",
    note:"First formal prescreen of the Musk bucket's second leg (SPCX resized 2026-07-11, see its own note). Real gap flagged, not glossed over: Optimus production TARGET raised 50K→70K annualized, but actual 2026 SHIPMENT forecast is only ~25K±10K — a wide target-vs-delivery gap, with 150+ Chinese humanoid competitors already commoditizing the category. Kill-switch: robotaxi fleet still in the hundreds (not thousands) AND Optimus lands meaningfully below even the lowered range by the FSD v15 rewrite window (late 2026/early 2027) — both call-option legs failing to convert hype into commercial reality. No /thesis build warranted — a dollar-precise 3-scenario dashboard would be LESS honest here than the existing qualitative, sentiment-anchor-only STRATEGY.md checker. Existing $250 LIMITS entry is not a data error like SPCX's old $100 was — it already sits ~16% below the real 52wk low ($297.82), a defensible 'real fear' trigger; kept as-is." },
  { t:"SPCX",  verdict:"PASS",  date:"2026-07-12", held:false, bucket:"musk",
    chokepoint:"Starlink's launch-cost-driven constellation economics + Falcon/Starship reusability — a genuine, structural cost/cadence advantage nobody has matched at scale. Materially cleaner than TSLA's contested FSD-vs-Waymo chokepoint.",
    cushion:"At $152.16 vs a real (not stale) analyst spread — Morningstar bear $63, a moderate estimate ~$135, consensus avg ~$210–242, bull cases $200–300+ — current price sits in a defensible middle zone, below consensus and bull cases, not requiring the most optimistic scenario to make sense. Real qualifier: xAI ('money furnace,' per STRATEGY.md) is bundled into the same ticker as profitable Launch + crown-jewel Starlink, muddying a clean read.",
    note:"Companion to TSLA's FAIL above — the two Musk-bucket legs are NOT equivalent bets: SPCX clears both unconditional questions with real (if wide) analyst grounding, TSLA doesn't. Same correlated-CEO/narrative risk still applies per MUSK_BUCKET_CAP (§3), but SPCX is the disciplined half of the pair, TSLA is the explicit sentiment bet. GTC entry already resized 2026-07-11 to $120 (see LIMITS) — this prescreen is the formal record that resize was directionally sound, not just a technical-level fix." },
];

// ── The frontier radar (see .claude/commands/radar.md) ─────────────────────────
// Cross-cutting themes that can disrupt (or accelerate) MULTIPLE holdings at once —
// distinct from PF_PRESCREEN, which gates NEW ideas one ticker at a time. The lesson
// this exists to fix: being late to semis wasn't picking bad companies, it was discovery
// latency. Durable long-horizon holdings create the mirror-image risk — they give
// frontiers time to come to THEM. Every row needs a falsifiable tripwire with a
// condition an actual filing/disclosure can trip, not a mood ("watch stablecoins" doesn't
// count; "first top-10 retailer offers stablecoin checkout" does).
// coverage: "thesis-covered" (already a named kill-switch in a built dashboard) ·
//   "thesis-gap" (a thesis exists but doesn't mention this risk yet — the actionable ones) ·
//   "prescreen-only" (no full thesis built; tracked only at the GATE level) · "n/a" (not held).
const PF_RADAR = {
  updated: "2026-07-18",
  THEMES: [
    { id:"stablecoins", label:"Stablecoins vs. card-network fees", direction:"threatens",
      holdings:["MA"], coverage:"prescreen-only",
      evidence:"GATE prescreen (2026-07-03) already names this as live and genuinely two-sided — stablecoin checkout threatens the 2–3% card fee model that is V/MA's entire moat.",
      tripwire:"A top-10 US retailer offers a stablecoin checkout discount, or V/MA disclose stablecoin volume cannibalization in a 10-Q." },
    { id:"kalshi", label:"Prediction markets vs. regulated exchanges", direction:"threatens",
      holdings:["CME","CBOE"], coverage:"prescreen-only",
      evidence:"CME's own GATE prescreen note already names this kill-switch. CBOE failed prescreen partly because analysts flag it as 'most at risk' of the group.",
      tripwire:"CME's CFTC lawsuit resolves against CME, or Kalshi discloses institutional (not just retail) volume crossing a material share of exchange volume." },
    { id:"ai-eats-software", label:"AI commoditizing software incumbents", direction:"threatens",
      holdings:["INTU"], coverage:"prescreen-only",
      evidence:"GATE prescreen already flags 'AI eats TurboTax' as the loud consensus bear case — already priced into INTU's 38% YTD decline, not a hidden risk.",
      tripwire:"TurboTax discloses an actual filing-share loss (IRS Direct File expansion, or a named competitor's filed share gain) — a real number, not sentiment." },
    { id:"packaging-multivendor", label:"Advanced packaging going multi-vendor (TSMC CoWoS monopoly eroding)", direction:"threatens",
      holdings:["TSM"], coverage:"thesis-gap",
      evidence:"Scout (SemiAnalysis, 2026-07-01) flagged Google's TPU 'Humufish' shifting from TSMC CoWoS to Intel EMIB-T — first hard evidence of a design win outside TSMC.",
      tripwire:"A second hyperscaler discloses a non-TSMC advanced-packaging design win (a real allocation, not a pilot).",
      note:"GAP: TSM's thesis currently frames CoWoS capacity as an expanding bottleneck/moat (bullish framing) with no kill-switch for multi-vendor erosion. Add at TSM's next /update-thesis." },
    { id:"neocloud", label:"Hyperscalers becoming neoclouds (selling excess AI compute externally)", direction:"enables",
      holdings:["META","MSFT","AMZN","GOOGL"], coverage:"thesis-gap",
      evidence:"Scout (SemiAnalysis, 2026-07-03): 'Meta Compute: Everyone Wants To Be A Neocloud' — Bedrock 2.0 / Azure Foundry / Vertex all monetizing spare capacity as a routing tollbooth. Corroborated 2026-07-09/10: SemiAnalysis's Meta Superintelligence 1-year update (~670k views) adds concrete infra specificity — 2000km+ scale-across networking, RL-environment-layer scarcity as a new private-market tollbooth — moving this from narrative to infrastructure detail. Third Point's Q1 13F shows a new (silent) META position. Strengthened 2026-07-12/13: SemiAnalysis reports META directly copying xAI's owned-cluster playbook, pricing external/anchor compute at 3–4x peer $/MW (Elon's Anthropic and Google deals as the comp) — this upgrades the row from 'hyperscalers monetize spare capacity' to a stated unit-economics claim (profit-per-MW gap even wider than the revenue-per-MW gap), specifically for META.",
      tripwire:"Any of the four discloses a material new external-compute revenue line in a 10-Q (not a press-release pilot).",
      note:"Upside optionality, not a kill-switch. META was added to holdings 2026-07-11 — it's the row's own namesake example ('Meta Compute') and had a real, larger gap than the other three: its thesis doesn't mention this angle AT ALL, not even as background. Re-confirmed 2026-07-15: META, MSFT, and GOOGL theses still have zero mentions of neocloud/external-compute framing; AMZN's thesis mentions Bedrock/Trainium only as an AWS-customer AI-services growth driver, not the sell-excess-compute-externally angle — all four remain thesis-gap. Consider adding at each stock's next /update-thesis, META's especially given the new $/MW unit-economics evidence." },
    { id:"orbital-compute", label:"Orbital / space-based compute", direction:"watch",
      holdings:[], coverage:"n/a",
      evidence:"Scout flagged this across 4 reports with the highest reward score of the cycle (RKLB/Iridium deal, Coatue naming space datacenters in SpaceX's own valuation framework). Contested further 2026-07-11 to 07-15: Altman publicly accused Musk of selling public investors 'short-term space data centers' (narrative risk into a SpaceX IPO), and Cerebras's Feldman put orbital production DCs at '≥5 years away' — both push the other direction from the Laffont/Cyan Banister platform-bull briefs already on file. RKLB itself only delivered an execution milestone (Archimedes AVac full-duration burn, 2026-07-14) toward Neutron's first flight — real progress, but explicitly not a revenue event, and not the re-rate-down this row's tripwire is watching for.",
      tripwire:"RKLB (or a pure-play successor) re-rates down 30%+ from current levels without a fundamental deterioration — re-run /prescreen; a real cushion may finally exist.",
      note:"Nothing held — RKLB FAILED /prescreen 2026-07-03 on cushion. Tracked purely as a re-entry watch item, not a current exposure. Narrative got louder (both bull and skeptic) this window without RKLB's price actually re-rating down — tripwire not close to firing." },
    { id:"ny-dc-moratorium", label:"State-level data-center siting bans (NY 50MW+ pause)", direction:"threatens",
      holdings:["EQIX"], coverage:"n/a",
      evidence:"Gov. Hochul's EO (reported 2026-07-14/15) imposes a first-of-its-kind statewide moratorium on discretionary permitting for 50MW+ data centers (~1yr GEIS process); street digests cite ~$10B of NY-pipeline projects paused, though existing/already-approved sites are largely excluded. Same window, Virginia separately denied a 2,000-acre DC campus (2026-07-14) while entitled/zoned land nearby kept trading (TA Realty, Sterling) — the pattern is capital redirecting to already-entitled, non-coastal sites (Ohio/Utah/Texas — the same geography Blackstone just backed with a $5.34B BTM-gas JV, 2026-07-15) rather than a demand kill. Loeb (2026-07-15) called the NY move the 'stupidest since AOC/Amazon Queens.'",
      tripwire:"A second state (beyond NY) enacts a comparable discretionary-permitting pause for large-load data centers, or NY's moratorium is extended/expanded past its ~1yr GEIS window instead of lapsing.",
      note:"EQIX is a small existing satellite position (~$98 notional) with no thesis and no PF_PRESCREEN entry on file — coverage is 'n/a' because there's no thesis to audit for a gap, not because the theme doesn't apply. This row exists to watch entitled-vs-coastal siting bifurcation generally; META/MSFT/AMZN/GOOGL have diffuse secondary exposure (they lease/site DCs too) but at their scale a single state's pause is immaterial — not added as holdings here to avoid diluting the row's actual point." },
    { id:"custom-hyperscaler-networking", label:"Hyperscalers building custom network fabric instead of buying merchant switch silicon", direction:"threatens",
      holdings:["AVGO"], coverage:"thesis-gap",
      evidence:"SemiAnalysis (2026-07-14/15): Amazon's Resilient Network Graphs (RNG) — a random-graph topology + passive optical shuffle boxes + 'Spraypoint' multipath — is 'the first network based on random graphs concept deployed at scale' and claims up to 45% cost savings vs. fat-tree topologies at similar oversubscription. This is AWS substituting owned network-engineering IP for merchant switch silicon at the topology level, not just a chip-design-win story (c.f. the already-tracked packaging-multivendor row, which is about advanced packaging, not networking).",
      tripwire:"A second hyperscaler (Google, Microsoft, Meta) discloses a comparable custom-topology network deployment at scale, or AVGO's own 10-Q/10-K flags networking-segment growth deceleration tied to hyperscaler in-house fabric.",
      note:"AVGO's networking segment (Jericho/Tomahawk merchant switches sold into hyperscaler AI clusters) is a named pillar of its own bull case, and its thesis currently has zero mention of hyperscaler-custom-fabric risk as a kill-switch. Genuinely new evidence, not previously on file (first surfaced in the 2026-07-14/15 scalper reports, reviewed 2026-07-18). Add at AVGO's next /update-thesis — AVGO's own REVIEW_GATES entry (2026-09-04) already exists for the VMware ARR watch; this is a second, distinct thread worth folding into the same touch." },
  ],
};
