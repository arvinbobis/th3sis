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
 * 2026-07-28: full resync from live IBKR (net liq 34,364.74 → 34,687.95, cash 4,284.59 →
 * 4,285.49). No new fills, no live orders — pure price/PnL drift over the weekend gap
 * (07-25 was Friday). Sharpest move: ASML -6.4% today to $1,644.00 (was $1,755.39 on
 * 07-25) — now -13.5% below its $1,900 floor, its worst read yet, no fresh thesis-breaking
 * news identified. MRVL (not held) fell further to $186.94, extending below its $195
 * re-entry floor (was $192.29 on 07-25). TSLA (not held) drifted to $307.69, still far
 * above the $250 limit, FAIL verdict unchanged. AVGO essentially flat at $381.50 (was
 * $381.43), still below its $390 floor. MU down another -4.9% to $878.66, still below both
 * its $1,100 thesis floor and its own $883.91 avg cost. TSM held steady at $396.30, still
 * comfortably above its $375 floor. SPGI at $439.05, up from $426.40 on 07-25 — this is the
 * PRE-earnings price; SPGI reports after close today (2026-07-28), the nearest REVIEW_GATES
 * catalyst in the book, so this print is not yet the post-earnings re-test. Verified with a
 * headless render pass across all 6 portfolio pages, no errors.
 * 2026-07-30/31: THE ROTATION — user is deliberately building toward the 70% core target
 * (TARGET_CORE_PCT below) by trimming the small legacy findata/power satellites, not by
 * adding fresh capital. Per live IBKR trades (DAYS_7): 2026-07-28 bought SOXX (2.0122 sh,
 * $999.96, avg $497.45 — a new semis-satellite ETF, not core); 2026-07-30 fully exited CBOE
 * (1.0489 sh @ ~$305, +$18.26 realized), ETN (0.2627 sh @ $384.21, -$1.05 realized), EQIX
 * (0.0936 sh @ $1,064.05, -$2.34 realized), MBGL (5 sh @ $21.03, -$1.80 realized), and MCO
 * (5.1545 sh @ ~$480.80, -$21.60 realized net across both fills) — all five dropped from
 * PF_RAW — then rotated the proceeds into more QQQM (+2.8644 sh @ ~$279.27, $799.97) and
 * SPMO (+5.639 sh @ ~$141.86, $799.99). CORE_TICKERS unchanged (QQQ/QQQM/SPMO); SOXX is a
 * satellite (semis theme), not core, despite being an ETF. Flipped CBOE and MCO to
 * held:false in PF_PRESCREEN (both keep their FAIL verdicts, now historical); pulled CBOE
 * out of the kalshi PF_RADAR holdings (CME remains, still held) and EQIX out of the
 * ny-dc-moratorium holdings (now holdings:[], nothing left in that row's book). Full
 * resync from live IBKR: net liq 34,687.95 → 35,145.46, cash 4,285.49 → 4,782.30 (the
 * ETF buys were smaller than the five combined sells, hence cash went up net). This
 * snapshot pulled live 2026-07-31 reflects Friday 07-30/Thursday 07-28 fills plus the
 * intervening price drift — dated to the pull, not the trade date.
 * 2026-08-03: price-only resync from live IBKR (no new trades — every position's
 * quantity and average cost is unchanged from 07-31, cash unchanged at 4,782.30).
 * Net liq drifted 35,145.46 → 35,255.16 on market movement alone over the 3 days.
 * ─────────────────────────────────────────────────────────────────────────── */

const PF_ASOF = "2026-08-03";
const PF_ACCT = { netLiq: 35255.16, cash: 4782.30, dividends: 5.35, buyingPower: 4782.30 };

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
  SPGI: { buyFloor: 405, thesisIntact: true, asOf: "2026-08-01", nextEarnings: "~2026-10-29" },
  MSFT: { buyFloor: 475, thesisIntact: true, asOf: "2026-07-31", nextEarnings: "~2026-10-28" },
  META: { buyFloor: 600, thesisIntact: true, asOf: "2026-07-31", nextEarnings: "~2026-10-28" },
  FICO: { buyFloor: 950, thesisIntact: true, asOf: "2026-07-31", nextEarnings: "~2026-10-late" },
  AMZN: { buyFloor: 280, thesisIntact: true, asOf: "2026-07-31", nextEarnings: "~2026-10-29" },
  CEG:  { buyFloor: 315, thesisIntact: true, asOf: "2026-08-01", nextEarnings: "2026-08-06", held: false },
  NOW:  { buyFloor: 102, thesisIntact: true, asOf: "2026-08-01", nextEarnings: "~2026-10-28", held: false },
  NVDA: { buyFloor: 200, thesisIntact: true, asOf: "2026-05-29", nextEarnings: "2026-08-26" },
};
// CEG added 2026-08-01: first /thesis build for Constellation Energy (buyFloor 315 = its
// own base-case floor). Scout-originated (UtilityDive, PJM capacity-scarcity theme paired
// with VST, ~10 reports 07-15 through 07-24); prescreen PASSED same day. Not yet held.
// NOW added 2026-08-01: first /thesis build for ServiceNow (buyFloor 102 = its own
// base-case floor). Prescreen PASSED same day on an independently-derived case that
// directly CONTRADICTS Scout's bearish "AI agents eat SaaS seats" framing for this name
// (Q2 FY26 beat-and-raise: subscription rev +24.5% YoY, AI ACV past $1B, 98% renewal) —
// no Scout credit given, see stocks/now/now-QUARTERLY-CHECKLIST.md and the prescreen note
// above. Not yet held.
// MSFT/META/FICO/AMZN added 2026-08-01: all four got fresh price bands via /update-thesis
// 2026-07-31 (post Q4 FY26/Q2 2026/Q3 FY26/Q2 2026 earnings respectively) but PF_ALERTS —
// the documented single source of truth for buy-alert floors — never got a matching entry.
// buyFloor = each thesis's own new base-case floor, same convention as every other row.
// NVDA added 2026-08-01: engine-split migration (stocks/NVDA/ -> stocks/nvda/), not a
// numbers refresh — CASES/price bands are unchanged from the pre-migration 2026-05-29 build,
// so buyFloor uses that build's own base-case floor ($200) and asOf stays 2026-05-29 to
// match. HELD (see PF_RAW). Next earnings 2026-08-26 is NVDA's own /update-thesis trigger,
// where AS_OF_DATE/CASES/this row's asOf all move forward together for the first time.

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
// pull, see header note. ALAB and MRVL both had full built theses. CBOE, ETN, EQIX,
// MBGL, and MCO dropped 2026-07-30 — rotated into QQQM/SPMO (and SOXX added 2026-07-28)
// per THE ROTATION, see header note.
const PF_RAW = [
  ["AMZN","Amazon.com",           8.1653, 202.74,  276.73, 2259.62,  604.22,  42.09, "platforms",    true ],
  ["ASML","ASML Holding",         0.5986, 730.61, 1612.30,  965.12,  527.78, -10.00, "semis",        true ],
  ["AVGO","Broadcom",             1.1432, 351.63,  386.32,  441.64,   39.66,  -3.38, "semis",        true ],
  ["BKNG","Booking Holdings",    10.7000, 188.61,  196.20, 2099.34,   81.27,  35.31, "diversifiers", false],
  ["BN","Brookfield",            11.0450,  45.36,   42.69,  471.51,  -29.48,   1.77, "diversifiers", false],
  ["CME","CME Group",             0.9659, 311.60,  269.39,  260.20,  -40.77,   1.55, "findata",      false],
  ["DRAM","Roundhill Memory ETF",16.9247,  59.14,   49.26,  833.71, -167.29, -18.79, "semis",        false],
  ["EFX","Equifax",               4.9299, 253.60,  172.62,  851.00, -399.24,   0.00, "findata",      false],
  ["FICO","Fair Isaac",           1.8783,1407.84, 1100.00, 2066.13, -578.22, -43.14, "findata",      true ],
  ["GE","GE Aerospace",           2.7332, 295.44,  364.87,  997.26,  189.76,  13.12, "power",        false],
  ["GEV","GE Vernova",            0.9451,1060.05,  980.02,  926.22,  -75.63,  -9.71, "power",        false],
  ["GOOG","Alphabet",             3.0338, 227.50,  361.01, 1095.23,  405.04,  13.23, "platforms",    true ],
  ["INTU","Intuit",               2.3960, 642.94,  326.22,  781.62, -758.85,  24.32, "platforms",    false],
  ["MA","Mastercard",             5.2499, 532.50,  580.00, 3044.94,  249.34,  36.22, "payments",     false],
  ["META","Meta Platforms",       2.9644, 610.47,  563.75, 1671.18, -138.51,  20.86, "platforms",    true ],
  ["MSFT","Microsoft",            5.8559, 434.43,  473.49, 2772.71,  228.73,  51.36, "platforms",    true ],
  ["MU","Micron Technology",      1.0769, 883.91,  796.30,  857.54,  -94.34, -28.79, "semis",        true ],
  ["NVDA","NVIDIA",               2.1852, 183.96,  199.05,  434.96,   32.98,  -3.71, "semis",        true ],
  ["PWR","Quanta Services",       0.4109, 732.43,  663.49,  272.63,  -28.33,  -1.59, "power",        false],
  ["QQQ","Invesco QQQ",           0.9735, 722.02,  689.53,  671.26,  -31.63,   1.50, "index",        false],
  ["QQQM","Invesco Nasdaq 100",   3.5512, 282.15,  283.92, 1008.26,    6.30,   2.24, "index",        false],
  ["SOXX","iShares Semiconductor ETF", 2.0122, 497.45,  492.90,  991.81,   -9.15, -24.13, "semis",        false],
  ["SPCX","SpaceX (Space Exploration Technologies)", 9.0000, 120.11, 106.54,  958.86, -122.14, -16.47, "diversifiers", false],
  ["SPGI","S&P Global",           5.8357, 504.01,  419.99, 2450.94, -490.29,  47.04, "findata",      true ],
  ["SPMO","Invesco S&P 500 Momentum", 6.9982, 143.18,  142.98, 1000.60,   -1.39,  -5.95, "index",        false],
  ["TSM","Taiwan Semiconductor",  0.7182, 419.10,  400.80,  287.85,  -13.14,  -2.48, "semis",        true ],
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
      anchor:"HELD. Buy floor ($390, base-case floor) still breached: $381.50 as of 2026-07-28, essentially flat vs $381.43 on 07-25. VMware ARR REVIEW_GATE (2026-09-04) explicitly conditions any add — thesisIntact is still true, but that earnings print is the real re-test before sizing anything here. The Amazon RNG custom-networking WATCH item (added 2026-07-18) is still just a watch, not yet a kill-switch." },
    { t:"ASML", limit:1900, cap:0,   size:"TBD — held/trimmed, size not decided", musk:false, watch:false,
      anchor:"HELD (post-harvest, remainder rides as house money — see TRIMMED). Buy floor ($1,900, set 2026-07-16) still breached, and worse: $1,644.00 as of 2026-07-28 (-13.5%, down from -7.6%/$1,755.39 on 07-25 — the sharpest single-day move in the book this sync). This would be a fresh-capital add, not a re-buy of already-trimmed shares. No new thesis-breaking news identified this session — flagged as a data gap, not evaluated for whether the drop is warranted." },
    { t:"MRVL", limit:195,  cap:0,   size:"TBD — NOT held, re-entry, size not decided", musk:false, watch:false,
      anchor:"NOT HELD (sold 2026-07-09). Re-entry floor ($195) still breached as of 2026-07-28: $186.94, extending below the line (was $192.29 on 07-25). Full re-underwrite gate is still the ~2026-08-28 earnings (see REVIEW_GATES) — this row exists so the floor-touch itself isn't silently missed, not to imply the re-entry case has been re-verified either way." },
    { t:"TSLA", limit:250,  cap:500, size:"$500",          musk:true,  watch:false,
      anchor:"Not yet placed (SPCX filled 2026-07-20; this one still waits). /prescreen FAILED on cushion 2026-07-12 (~182–396× earnings depending on metric) — no valuation floor, sentiment/support anchor only. $250 = a real ~16% break below the observed 52wk low, not an arbitrary guess. Reported earnings 2026-07-22, dropped -7.7% the next session; continued drifting lower, $307.69 as of 2026-07-28. Still far above the $250 limit and the FAIL verdict is unchanged; informational only, no action." },
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
    { t:"SPGI",  date:"~2026-10-29", note:"HELD legacy position (pre-existing, not a generator seed). Q2 FY2026 (reported 2026-07-28, first full ex-Mobility guide) AUDITED 2026-08-01: continuing-ops revenue beat ($3.678B, +11% YoY) and Ratings (+17%, issuance ACCELERATED to +25% from Q1's +14%) / Indices (+20%, 13th straight record quarter) guides were RAISED — the pull-forward risk this thesis was built to watch has NOT materialized. But FY2026 adjusted EPS guidance ($17.50-17.75, mid $17.63) landed below prior Street (~$18.37-18.98), dragged by Energy (Iran-conflict sanctions pressuring Global Trading Services renewals) and Market Intelligence (elongated AI-contract sales cycles) — two segments not previously on this thesis's KPI list. Stock fell from $439.83 (07-27) to $411.93 (07-31), now sitting near the recalibrated base floor. Bands rebased on the new $17.63 EPS anchor: bear $330-390->$315-370, base $425-515->$405-495, bull $555-630->$530-600. buyFloor $400->$405. Most-probable case stays BASE. New kill-switch: Ratings issuance decelerates sharply, OR the Energy/Market Intelligence drag spreads into Ratings/Indices, OR two straight quarters missing the 6-8% organic cc guide. Old Ratings-pull-forward-only kill-switch retired as the wrong risk — see stocks/spgi/thesis-data.js THESIS_HISTORY for the prior vintage." },
    { t:"GOOGL", date:"~2026-10-27", note:"HELD (as GOOG, Class C — thesis built against GOOGL Class A, same company). Q2 2026 already reported 2026-07-22 and fully rolled into the thesis 2026-07-25: Cloud individually beat every bull-case threshold (82% growth, 35.5% margin, $514B backlog), but Search decelerated to 17% (base-band, not bull) so the base case's own AND-condition for a bull shift didn't fire. Stock dropped ~7-8% on the print anyway, on a capex-guidance raise ($180-190B→$195-205B), landing at $319 — in the gap between the bear ($280-315) and base ($370-415) bands. Most-probable case stays BASE (45%, was 55%; Bull rose to 35% on the Cloud beat per the thesis's own pre-committed probability rule). Kill-switch for BASE: Cloud decelerates below 55% for two consecutive quarters." },
    // Five rows added 2026-07-25 alongside the GOOGL update-thesis touch: none of these had a
    // REVIEW_GATES entry before, on a page whose whole point is "the real thesis re-tests" —
    // a real gap, found while checking GOOGL's earnings. These are date/kill-switch registrations
    // only (confirmed real dates via web search this session), NOT post-earnings audits like
    // GOOGL's row above — each gets its own real /update-thesis touch once it actually reports.
    { t:"MSFT",  date:"~2026-10-28 (Q1 FY2027)", note:"HELD. Q4 FY2026 (reported 2026-07-29) AUDITED 2026-07-31: Azure accelerated to 43% (vs 39-40% guide, vs 40% the prior quarter) — the old kill-switch (Azure decelerating below 35%) has now failed to trigger twice running and was retired. Copilot paid seats jumped 20M->30M+, operating margin 45.1%. But FY2027 capex guide raised to $255-260B (from ~$190B) in the same release, and DC/office useful life was extended 15yr->25yr (an accounting tailwind, not new cash). Bands raised: bear $310-395->$325-400, base $460-560->$475-565, bull $620-720->$650-760. Most-probable case moved BASE -> BASE-to-BULL. New kill-switch: Azure decelerating below 36% in Q1 FY2027, OR free cash flow continuing to compress as a share of revenue with no stabilization by Q2 FY2027 — the capex bet is now large enough that growth beats alone don't settle the bear case." },
    { t:"META",  date:"2026-07-29", note:"HELD. AUDITED against the Q2 2026 print (2026-07-31): revenue beat ($60.8B, +28% YoY, vs $60.29B consensus, ad price +12% YoY, impressions +14% YoY — demand did NOT degrade) but GAAP EPS missed badly ($6.18 vs $7.22, −14.4%, snapping a 6-quarter beat streak) almost entirely on $2.4B legal charges + $1.18B severance (CFO: op income ex-charges was +9% YoY). Neither kill-switch leg technically fired (demand held up, AI monetization stayed unquantified — Zuckerberg's ROI answers remain directional), but the FY26 capex floor was raised to $130–145B (low end up, a locked-in commitment) while quarterly FCF collapsed to ~$0.8B — a real, not sentiment-only, tension the original kill-switch didn't fully anticipate. Stock fell ~9% over two sessions despite the beat; thesis updated to BASE (bear-leaning), bands lowered across all three cases (base now $600–700 vs $700–800) reflecting a genuine multiple de-rating, though Street 12-mo targets (avg ~$733 post-cut, still Buy/Outperform) cluster above the new base band. Next earnings ~2026-10-28 (Q3 FY2026, unconfirmed date)." },
    { t:"FICO",  date:"~2026-10-late (Q4 FY2026)", note:"HELD. Q3 FY2026 (reported 2026-07-29) AUDITED 2026-07-31: Scores revenue decelerated 60%->41% YoY — the first real deceleration data point, but only one quarter against the two-consecutive-quarter kill-switch threshold. Total revenue $674M and the raised ~$2.53B FY2026 guide both landed a shade below Street, and the stock fell -17% post-print even though Scores growth (41%) technically cleared the old BULL >40% KPI bar — the multiple compressed further (29x->24-27x, now at the SPGI/MCO/VRSK/EFX peer median ~24x) instead of expanding, which is why BASE stays the call. Bands: bear $450-750->$650-850, base $1,100-1,700->$950-1,300, bull $1,900-2,600->$1,400-1,650 (all shifted by the multiple-compression effect, not an EPS breakdown). Kill-switch unchanged in substance (Scores <15% YoY for 2 quarters = bear; Scores >40% YoY AND multiple re-expands above 32x = bull, both legs required — this quarter cleared only the first)." },
    { t:"AMZN",  date:"2026-07-30", note:"HELD. AUDITED against the Q2 2026 print (2026-07-31): a broad beat — AWS +37% YoY (fastest in 18 quarters, vs 31% consensus), ad revenue +26%, consolidated operating margin a new record 13.7% — blows through the old bull-case AWS ceiling (32%). But the kill-switch's OTHER leg moved the wrong way: free cash flow (TTM) swung to −$7.6B from +$18.2B a year ago, and full-year capex guide was raised again to $220B (from $200B, cited higher memory costs). Net: AWS-reacceleration leg of the bull case confirmed; FCF-inflection leg did not — thesis updated to BASE tilting toward BULL (was BASE), bands raised across all three cases (base now $280–320 vs $260–295). FTC ad-suit still unresolved, not yet filed. Next earnings ~2026-10-29 (Q3 FY2026, estimated)." },
    { t:"NVDA",  date:"2026-08-26", note:"HELD. Reports Q2 FY2027 2026-08-26 (per multiple earnings-calendar sources; not yet an official NVIDIA-confirmed date at time of this sync). Kill-switch per the existing thesis: either competitive erosion materializes and margins crack (bear), or China demand recovers AND Rubin beats EPS by 20%+ AND the multiple re-rates above 32x (bull). Not yet audited against this print." },
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
  { t:"MCO",   verdict:"FAIL",  date:"2026-07-03", held:false, bucket:null,
    chokepoint:"Same NRSRO ratings duopoly as SPGI.",
    cushion:"Fwd P/E ~26.8, ~63% above the Capital Markets industry median — no margin of safety.",
    note:"Redundant with SPGI — don't add fresh capital here. Fully sold 2026-07-30 as part of the rotation into core ETFs (THE ROTATION, see header note) — this FAIL verdict is now historical, not an active hold." },
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
  { t:"CBOE",  verdict:"FAIL",  date:"2026-07-03", held:false, bucket:null,
    chokepoint:"SPX/VIX options ecosystem — real, but narrower and analysts flag it as most exposed to Kalshi.",
    cushion:"Still ~7% above one fair-value estimate even after a 25% drawdown.",
    note:"Redundant with CME — same risk bucket, weaker/more concentrated moat. Fully sold 2026-07-30 as part of the rotation into core ETFs (THE ROTATION, see header note) — this FAIL verdict is now historical, not an active hold." },
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
  { t:"EQIX",  verdict:"WATCH", date:"2026-08-01", held:false, bucket:null,
    chokepoint:"Interconnection density — once an enterprise's network architecture lives inside an Equinix campus, ripping it out is expensive/risky; the moat compounds as more counterparties colocate and cross-connect. Clean pass.",
    cushion:"~24x FY2026 AFFO/share on the just-raised guide ($42.69–43.29, +11–13%), vs Digital Realty's 18–21x — a real premium, but price still sits below the average analyst target (~$1,190 vs $1,019.28 close) so it doesn't require the most optimistic scenario. Thin, not absent — 3 days post 'the largest single guidance raise in company history' (07-29), the market has almost certainly already repriced the good quarter.",
    note:"Sourced from Scout's ticker_scores (reward 6.38, highest of any un-prescreened name) — was a small satellite (~$98 notional) sold outright 2026-07-30 as part of the deliberate rotation toward 70% core (THE ROTATION, see header note). PASS-WATCH, not PASS: chokepoint/cushion clear, but already-priced-in (heavy fresh sell-side coverage days after the beat) and portfolio-fit (re-adding now would directly reverse a strategic call made one day earlier) both say 'not yet.' Real offsetting signal: Scout's EDGAR money-vs-mouth channel caught Coatue building a SILENT $1.07B EQIX 13F position — recurring 07-25/07-31/08-01, never touted on X — genuine institutional conviction the loud sell-side coverage doesn't capture. Kill-switch: a second hyperscaler discloses meaningful direct-lease/self-built colocation bypassing the interconnection model, or AFFO/share growth decelerates for two straight quarters off this quarter's peak. Revisit on a pullback from this print, or if Coatue's conviction keeps building. Per /prescreen's own rule, PASS-WATCH doesn't trigger the Scout mark-conversion credit — only a clean PASS does." },
  { t:"SKHY",  verdict:"WATCH", date:"2026-08-01", held:false, bucket:null,
    chokepoint:"Current #1 HBM producer — deep NVDA co-development (the $500B+/2GW Vera Rubin DSX initiative), ~10 signed LTAs (Anthropic among them) locking in demand visibility. UBS projects Samsung overtakes SK Hynix's HBM bit share by 2027 (41% vs 39%) — real, but not yet lost. Clean pass.",
    cushion:"~4.9x forward P/E, ~14.6x EV/EBITDA, average analyst target ~$259 (+80% from the $143.73 close) — genuinely cheap, not priced for perfection. Caveat: brand-new ADR (listed 2026-07-10, ~3 weeks of trading history), no SEC-filed US quarterlies to sanity-check against (Wisesheets returns nothing), and the stock has been extremely volatile (-9.6% on the 07-29 Q2 miss, then +20-25% on 07-31 on a Korea sovereign-wealth-fund liquidity injection unrelated to the fundamentals) — treat any multiple here with real caution per CLAUDE.md's foreign-filer caveat.",
    note:"Sourced from Scout's ticker_scores (reward 5.90) — the single most heavily-covered, most-consensus name in Scout's entire tracked universe right now (NVDA partnership, Anthropic LTAs, near-daily coverage since mid-July). FAILS already-priced-in cleanly — zero contrarian edge. The real reason this isn't a fresh add: checked DRAM ETF's actual holdings (already held, 16.9247 sh) — SK Hynix is ~20.27% of it, Micron 29.16%. Combined with the direct MU position (a SEEDED generator thread whose bull case IS the HBM/AI-memory supercycle), adding SKHY outright would be a THIRD layer of the identical chokepoint bet, not a new idea — Scout's own reports treat MU and SKHY as interchangeable comps of one trade throughout ('MU-relative + SKHY structure'). Chokepoint and cushion both genuinely clear (this is a real idea, not a weak one) but there's no incremental portfolio room per Q4/Q5. Worth reconsidering only as a REBALANCING question (concentrate the memory bet into the actual #1 HBM producer instead of the DRAM basket) — not as fresh capital. Kill-switch: Samsung's HBM bit-share overtake per UBS's 2027 projection. No Scout credit fired — PASS-WATCH doesn't qualify per /prescreen's own rule." },
  { t:"CEG",   verdict:"PASS", date:"2026-08-01", held:false, bucket:null,
    chokepoint:"Owns the largest nuclear fleet in the US — existing, already-licensed, already-built baseload capacity that cannot be replicated on any relevant timescale (new nuclear takes a decade-plus to permit/build). Cleared PJM capacity auctions for BOTH 2026-27 AND 2028-29 (18,875 MW) — multi-year scarcity-pricing cash flow already locked in, not a forecast. One of the cleanest chokepoints in the book.",
    cushion:"~22-25x forward P/E against management's own >20%/yr EPS CAGR guide through 2029 (2026 adjusted operating EPS guide $11-12) — a reasonable growth-adjusted multiple. Price ($262.75) sits well below the average analyst target (~$358-380, 17-40%+ upside). Real, not thin: sell-side cut its price target even after a recent beat, suggesting live debate rather than momentum-chasing consensus.",
    note:"Sourced from Scout's persistent Watch List — paired constantly with VST as the lead 'PJM capacity scarcity' names across ~10 reports from 07-15 through 07-24, a multi-week structural theme, not a one-off. Origin traces to @UtilityDive (named seed account), first clear primary quote 07-15/07-16 on CEG's PJM capacity clear (~$2.2B narrative). Correlation check: GE/GEV/PWR (held) SELL equipment into the power buildout; CEG OWNS/OPERATES the generation asset and collects recurring capacity-auction revenue directly — a genuinely different economic mechanism, not a duplicate bucket (same reasoning that cleared EQIX's correlation test). Portfolio-fit is a live judgment call, not resolved here — satellites capped 1-3, depends how the post-rotation sleeve is counted. Kill-switch: PJM capacity auction clearing prices for CEG's fleet reverting toward historical norms in a future auction, or a nuclear uprate/relicensing setback pulling capacity offline. Recommend /thesis CEG next." },
  { t:"AMAT",  verdict:"FAIL", date:"2026-08-01", held:false, bucket:"wfe-capex-cycle",
    chokepoint:"Broadest deposition (CVD/PVD) portfolio in WFE, qualified into essentially every leading-edge fab flow — real but the weakest of the AMAT/LRCX/KLAC trio: China's NAURA/AMEC have grown deposition/etch share from 2% to 7% (2019-2024) and AMAT itself guides $600-710M of FY2026 revenue lost to export restrictions (China fell from 45% of revenue in Q2'24 to 25% in Q2'25). Real friend-shoring offset (India/SE Asia fabs need full WFE procurement) but this is an eroding oligopoly seat, not an unbreakable bottleneck.",
    cushion:"Fwd P/E ~47-52x (GuruFocus/Morningstar) vs. semis-industry median ~38x — trading 30%+ above peer group even before comparing to its own history; price $507.67 near highs despite the China revenue hit already guided. Avg analyst target ~$606 (+19%) is real upside but doesn't offset a multiple this rich after a 450%+ AI-capex-driven run. Fails cleanly — no margin of safety.",
    note:"Scout flags AMAT 10 report-days (07-03 to 07-24), always bundled with LRCX/KLAC under 'China semis 60+ A-share risk warnings' (bearish) and 'ASML/WFE upcycle' + 'packaging step-count explosion' (bullish) — no ticker_scores entry (never individually scored). Correlation test: AMAT/LRCX/KLAC are three genuinely distinct chokepoints (deposition/etch/inspection are different technical moats, not the same product) but all three ride the identical macro driver — the semiconductor fab-capex supercycle — that ASML (litho monopoly, held) and TSM (foundry, held) already fully capture; STRATEGY.md §2 already flags AI Semis & Hardware as ~15% of the book before adding any of these. Unconditional FAIL on cushion alone (Q2) regardless of the correlation read. No /thesis warranted; revisit only on a real derate toward the ~30-35x range that would put it back near peer median." },
  { t:"LRCX",  verdict:"FAIL", date:"2026-08-01", held:false, bucket:"wfe-capex-cycle",
    chokepoint:"Etch/deposition leader with particular dominance in memory-critical steps (3D NAND, HBM-adjacent processes) — a real, qualified-in bottleneck, stronger niche than AMAT's more diversified but eroding position, though still one of several oligopoly seats (LRCX/AMAT/KLAC/TEL) rather than a singular monopoly like ASML's EUV.",
    cushion:"Fwd P/E ~50x vs. ~33x semiconductor-industry average (post a 21%+ recent run) — priced meaningfully above peers. Avg analyst target ~$368 (+26% from $293.02) is genuine upside, but the multiple itself already assumes the AI/WFE upcycle holds without interruption. Fails cleanly — same 'priced for perfection' pattern as AMAT/KLAC.",
    note:"Scout flags LRCX 9 report-days (07-07 to 07-24), same 'China semis A-share warnings' (bear) / 'WFE upcycle' (bull) bundle as AMAT/KLAC — no ticker_scores entry. Notable: LRCX was previously HELD as one of the small semi satellites closed out 2026-07-09 (with ANET/ARM/ALAB/MRVL, see STRATEGY.md §2) as part of the core-consolidation move — this prescreen is its first-ever formal gate run, and the honest read is that a name just exited for portfolio-simplification reasons doesn't clear the bar to re-enter days later at a richer multiple. Correlation: same WFE-capex-cycle overlap with held ASML/TSM as AMAT (see that entry) — real distinct technical moat, but not a distinct macro bet. Unconditional FAIL on cushion (Q2)." },
  { t:"KLAC",  verdict:"FAIL", date:"2026-08-01", held:false, bucket:"wfe-capex-cycle",
    chokepoint:"Process control/inspection near-monopoly (~50%+ share) — the cleanest chokepoint of the AMAT/LRCX/KLAC trio and arguably the closest analog in this group to ASML's moat character: inspection tools are calibrated into a fab's specific process flow, making switching costs extremely high and rework risk (re-qualifying a new vendor mid-node) a real deterrent competitors don't easily route around.",
    cushion:"Fwd P/E ~51x vs. KLAC's own 5-year average of ~22.69x (GuruFocus) — trading at ~2.25x its own historical multiple, the most explicit, sourced overvaluation flag of the three. Post 10-for-1 split ($182.82 close); even the cleanest chokepoint in the group doesn't survive a multiple this disconnected from its own history. Fails hardest of the trio on cushion despite having the best moat.",
    note:"Scout flags KLAC 10 report-days (07-03 to 07-24), identical China-semis/WFE-upcycle bundle as AMAT/LRCX — no ticker_scores entry. The irony worth recording: KLAC clears the chokepoint test most cleanly of the three yet fails cushion worst — a direct illustration of CLAUDE.md's own warning that the multiple, not the story, is where AI-capex names are currently getting ahead of themselves. Same WFE-capex correlation with held ASML/TSM as AMAT/LRCX. Unconditional FAIL on cushion (Q2). Group verdict: all three genuinely distinct businesses, uniformly too expensive right now — revisit as a basket on a real semicap-cycle correction, not one at a time." },
  { t:"NBIS",  verdict:"FAIL", date:"2026-08-01", held:false, bucket:"merchant-neocloud",
    chokepoint:"No hard bottleneck: NBIS leases/builds GPU clusters using purchased NVIDIA hardware and sells compute under long-term contracts (cornerstone: $17.4B/5yr Microsoft take-or-pay). The 'moat' is contract duration and speed-to-market, not something a well-capitalized competitor can't replicate — and Scout's own 2026-07-07 report ('META neocloud — Bloomberg cloud resale confirms Zuck Plan B') flags NBIS/CRWV explicitly as the BEAR side of the neocloud trade: hyperscalers building their OWN excess-capacity resale business (META/MSFT/AMZN/GOOGL, already held, already tracked in PF_RADAR's 'neocloud' theme row) directly compresses merchant neocloud margins. NBIS stock fell ~-12% on that exact news. Fails cleanly — no chokepoint.",
    cushion:"~13x 2026 revenue guide ($3.4B, +550% y/y) sounds cheap for the growth rate, but FCF is deeply negative (-$3.68B TTM per Wisesheets) and the reported $0.33 diluted EPS is an outlier against that cash burn (plausibly non-operating items, e.g. the NVIDIA 9.3% stake's fair-value marks) — not a clean earnings cushion. Analyst target range is genuinely wide ($120-$410, avg ~$258 vs $190.41 close) — the kind of dispersion that signals no real consensus floor, not a defensible middle. NBIS also files 20-F as a foreign private issuer (Netherlands N.V.) with only annual, not quarterly, US-filed fundamentals — Wisesheets caveat noted per CLAUDE.md.",
    note:"Scout flags NBIS 10 report-days (07-07 to 07-23, lead account @SemiAnalysis_/Bloomberg-sourced), reward not in ticker_scores (dynamic-tickers only). Chokepoint fails unconditionally (Q1) — automatic FAIL regardless of the cushion read. Correlation: this IS what PF_RADAR's 'neocloud' theme tripwire firing would look like from the other side — the theme already tracks hyperscalers (held) becoming neoclouds as an 'enables' row for META/MSFT/AMZN/GOOGL; NBIS/CRWV are the pure-play bet on the opposite side of that exact trend, and Scout's own reporting shows the market already pricing that conflict against them. Also 100% dependent on NVIDIA GPU allocation (chokepoint owned by NVDA, already held) — buying NBIS for NVDA-adjacent exposure is strictly worse than buying more NVDA directly. No Scout credit — FAIL doesn't qualify." },
  { t:"CRWV",  verdict:"FAIL", date:"2026-08-01", held:false, bucket:"merchant-neocloud",
    chokepoint:"Identical structural problem to NBIS, more acute: Microsoft alone was ~62% of CRWV's 2024 revenue (diversified somewhat since via Meta/OpenAI/Anthropic/Jane Street, but concentration remains real), 100% GPU-dependent on NVIDIA, and the same Scout 2026-07-07 report ('CRWV/NBIS repriced ~-12%') flags hyperscaler in-housing (the very holdings already in this portfolio: META/MSFT/AMZN/GOOGL) as the structural threat — 'CoreWeave's customers are becoming its competitors' per independent coverage. No bottleneck a well-funded rival (or CRWV's own customers) can't replicate. Fails cleanly.",
    cushion:"GAAP diluted EPS -2.81 (FY2025), FCF -7.25B, EV/revenue ~10x on $6.23B TTM revenue, and a genuinely levered balance sheet ($35.15B debt vs. $2.27B cash — net debt ~$32.9B) funding the capex. Price $71.77 is already well off its highs and analyst targets are wide and growth-dependent (avg ~$145.76, range $67-$250) — the kind of spread that signals the stock only works if the AI-compute buildout narrative holds without a wobble, the exact 'no valuation floor, buying belief not value' pattern STRATEGY.md already flagged for TSLA. Fails outright — this is a leveraged bet on sustained hyperscaler GPU demand with negative cushion in every direction.",
    note:"Scout flags CRWV 10 report-days (07-04 to 07-16, same META-neocloud cluster as NBIS), reward not in ticker_scores. Chokepoint fails unconditionally (Q1) — automatic FAIL. Correlation: same read as NBIS — this is the bear side of the already-tracked PF_RADAR neocloud theme, and Scout's own reporting shows it live (both names sold off ~-12% on the exact hyperscaler-in-housing news that benefits the four held mega-caps). Weaker cushion than NBIS (heavier leverage, deeper negative FCF, no offsetting positive EPS figure at all) — if this pair is ever revisited, NBIS is the marginally less broken of the two, not CRWV. No Scout credit — FAIL doesn't qualify." },
  { t:"VST",   verdict:"WATCH", date:"2026-08-01", held:false, bucket:null,
    chokepoint:"Owns/operates ~41GW of nuclear (Comanche Peak), gas, coal, and battery generation already interconnected and cleared into supply-constrained ERCOT and PJM capacity auctions (10,924 MW cleared in the 2028/29 PJM auction alone) — new entrants face 3-7yr interconnection queues, so already-cleared capacity is a real, currently-scarce asset. Clean pass, but most of the fleet is gas (replicable given years and capital), not the licensed-nuclear scarcity that makes CEG's chokepoint harder.",
    cushion:"Fwd P/E ~15.75-16.26x (GuruFocus: 'modestly undervalued'), well below CEG's ~22-25x, vs an average analyst target ~$223-225 against the $148.19 close — ~50% upside, the strongest cushion of this whole batch. Doesn't require the optimistic case to work.",
    note:"Sourced from Scout's ticker_scores (reward 3.506) and the UNIVERSE_SUMMARY 'watch' row (7 report-days, 07-14 to 07-25) — paired with CEG constantly as the 'PJM capacity scarcity' duo (e.g. 07-16: 'VST ~10.9k MW cleared -> ~$1.3B capacity revenue narrative; CEG plants cleared (~$2.2B narrative)'; 07-18/07-24: 'CAT-GEV-VST-CEG' bundled as one merged-book line). Correlation test (pushed hard per instructions): this is NOT the GE/GEV/PWR equipment-seller mechanism — it's the identical CEG mechanism (own/operate generation, collect capacity-auction revenue directly), just a second name Scout treats as interchangeable with CEG throughout its own reports. Chokepoint and cushion both genuinely clear (better cushion than CEG, in fact) but there is no incremental idea here, only a redundant second leg of the trade CEG (PASSed 2026-08-01, same day) already covers — same pattern as SKHY vs MU/DRAM. Kill-switch: PJM/ERCOT capacity clearing prices reverting toward historical norms, or a nuclear/gas outage denting the cleared-capacity revenue base. Worth reconsidering only as a REBALANCING question (VST's cheaper multiple vs CEG's cleaner nuclear moat) once CEG's own /thesis is built, not as a second fresh add today. No Scout credit — PASS-WATCH doesn't qualify per /prescreen's own rule." },
  { t:"CAT",   verdict:"FAIL",  date:"2026-08-01", held:false, bucket:null,
    chokepoint:"Power Generation (large reciprocating engines + turbines for data-center backup/prime power) is real and growing (+41% y/y in Q1'26, Power & Energy segment 42% of FY2025 revenue) but sits inside a hugely diversified $76B/yr industrial conglomerate (Construction Industries, Resource Industries, Oil & Gas, Financial Products) where AI-driven power demand is one growth driver among several, and large gensets/turbines aren't a hard bottleneck — Cummins, MTU/Rolls-Royce, Wärtsilä, and GE Vernova all compete for the same backup/prime-power orders. Can't be stated as a clean, unbreakable bottleneck the way CEG's licensed nuclear fleet or a litho monopoly can — fails Q1.",
    cushion:"Fwd P/E ~37-41x vs. the Farm & Heavy Construction Machinery industry median of ~14.17x (158% premium) — GuruFocus rates it 'Significantly Overvalued,' GF Value ~$404 vs. the $814.81 close (~102% above fair value). Stock is up ~100%+ in 2026 on the AI-power reframing alone. Fails cleanly and independently of Q1 — no margin of safety at any multiple this disconnected from the company's own industrial-cyclical history.",
    note:"Scout flags CAT 9 report-days (07-07 to 07-25, reward 3.457), bundled constantly with GEV/VST/CEG under 'firm power hole' / 'BTM engines' — never scored as a standalone power name, always the diversified-industrial adjacent to the pure-plays. Double FAIL (Q1 chokepoint diffuse, Q2 cushion unconditional) — the clearest FAIL of this batch. Also duplicates the GE/GEV/PWR equipment-seller bucket already held (CAT sells gensets/turbines into the buildout, same mechanism as GE's LEAP aftermarket or GEV's turbine backlog) rather than adding anything new, on top of failing its own two unconditional gates. Revisit only on a genuine derate toward the ~15-20x range that would put it back near its own industrial-cyclical history, with the Power & Energy segment mix still climbing." },
  { t:"AEP",   verdict:"PASS",  date:"2026-08-01", held:false, bucket:null,
    chokepoint:"Regulated transmission-and-distribution monopoly in its franchise territories (largest US transmission network) plus 69GW of contracted large-load demand (~90% data centers) already tied to a FERC/state-approved rate base growing $64.6B->$87.4B by 2029 — a legally exclusive service territory nobody can build a competing wires network inside, monetized via regulated ROE on expanding capex, not commodity or capacity-auction pricing. A genuinely third economic mechanism: distinct from CEG/VST's merchant capacity-auction revenue AND from GE/GEV/PWR's equipment sales (same reasoning that cleared CEG's and EQIX's correlation tests).",
    cushion:"Fwd P/E ~20.22x — a real premium to the utility sector's ~16-18x norm (one Simply Wall St DCF read flags AEP as up to 30% above fair value), but price ($127.85) still sits ~13% below the average analyst target (~$145) so it doesn't require the most optimistic scenario to work. Thin, not absent — same 'real but not deep' character as CEG's own cushion (22-25x vs >20%/yr EPS CAGR guide).",
    note:"Sourced from Scout's ticker_scores (reward 3.949) and UNIVERSE_SUMMARY 'watch' row (8 report-days, 07-10 to 07-31, e.g. 'DOE closes up to $3.26B loan to AEP Texas... agreements supporting up to 41 GW of potential new load'). Origin traces to @UtilityDive (07-09 primary, amplified in the 07-10 report) — first clear AEP-specific flag distinct from the broader power-chokepoint bundle. Correlation check (pushed hard per instructions): clears both the CEG/VST merchant-generation bucket AND the GE/GEV/PWR equipment-seller bucket — regulated rate-base ROE growth is a mechanism none of the five already-covered power names capture. Real, not hand-wavy, risk worth flagging: AEP's own CEO warned about PJM/SPP interconnection speed and floated exiting those RTOs if reform doesn't come — the same interconnection-queue bottleneck that makes VST/CEG's cleared capacity valuable is a genuine execution risk to AEP's own contracted-load buildout. Portfolio-fit (Q5) is a live, unresolved judgment call — CEG (PASSed same day) is the stronger/cleaner power-satellite candidate if only one can be built — but per CEG's own precedent, an open portfolio-fit question doesn't block a PASS when chokepoint/cushion/correlation all genuinely clear. Kill-switch: a rate case materially cutting AEP's allowed ROE below the current ~9.3-9.5% band, or contracted load unwinding (TSAs cancelled) the way EXC's just did. Recommend /thesis AEP as a follow-up to CEG, not instead of it." },
  { t:"EXC",   verdict:"WATCH", date:"2026-08-01", held:false, bucket:null,
    chokepoint:"Six fully regulated T&D utilities (ComEd, PECO, BGE, Pepco, ACE, DPL) — the same legally exclusive franchise-territory monopoly mechanism as AEP, spun clean of merchant generation when Constellation (CEG) split off in 2022. Real, clean chokepoint on its own terms.",
    cushion:"Fwd P/E ~15.3x, in-line with typical utility multiples (cheaper than AEP's 20.22x) — but consensus rating is 'Hold' and average analyst target (~$49.39) sits only ~7.8% above the $45.82 close, versus AEP's ~13% upside on a stronger buy tilt. Doesn't require heroics, but doesn't offer much either.",
    note:"Sourced from Scout's ticker_scores (reward 4.444) and UNIVERSE_SUMMARY 'watch' row (7 report-days, 07-18 to 08-01) — most recent and notable: Scout's 08-01 report flags 'Exelon high-prob DC load -40% -> ~11 GW (from ~18 GW) via TSAs,' framed by Scout itself as a 'quality upgrade, not demand destruction,' but still a real downward revision to the headline number, not a positive catalyst. Correlation test (pushed hard per instructions): EXC is the SAME regulated-rate-base mechanism AEP is, just the weaker sibling — smaller data-center-load tailwind (11GW post-cut vs AEP's 69GW contracted), Hold consensus vs AEP's stronger buy tilt, thinner upside (7.8% vs 13%), and a fresh negative GW revision AEP hasn't had. If only one regulated-utility name gets a fresh look, it's AEP (PASSed same day), not this one. Kill-switch: a second consecutive TSA-driven load cut, or a rate case outcome below the current authorized ROE band. Revisit only if EXC's own DC-load pipeline reaccelerates past the pre-cut ~18GW figure, or on a further pullback that widens the cushion meaningfully past AEP's. No Scout credit — PASS-WATCH doesn't qualify per /prescreen's own rule." },
  { t:"VRT",   verdict:"FAIL",  date:"2026-08-01", held:false, bucket:null,
    chokepoint:"Dominant liquid-cooling and power-infrastructure vendor already embedded as the qualified incumbent across major hyperscaler data-center designs, with a $15B backlog converting to $5B+ of 2026-27 revenue — ripping out an already-engineered cooling architecture mid-deployment is real switching cost. Genuine chokepoint, though not absolute (Schneider Electric is a credible second source competitors can and do route to).",
    cushion:"Fwd P/E ~46-49x — multiple sell-side desks (JPMorgan, Morgan Stanley, Oppenheimer) have raised targets into the $330-350 range even as the stock already trades near those levels; one source frames the multiple as 'demanding flawless execution.' Rich against its own history and against Schneider Electric's more typical 24-28x. Fails cleanly and unconditionally — the same 'priced for perfection' pattern that failed AMAT/LRCX/KLAC on cushion alone despite real chokepoints.",
    note:"Sourced from Scout's UNIVERSE_SUMMARY 'bull' row (7 report-days, 07-08 to 07-25) — bundled constantly with GEV/ETN/CAT/PWR under 'firm power hole' and 'GEV GT backlog' bundles, no standalone ticker_scores entry. Chokepoint genuinely clears (real, if not absolute) but Q2 cushion fails unconditionally per the gate's own rule — automatic FAIL regardless of the chokepoint read, identical structure to the WFE trio (AMAT/LRCX/KLAC, all FAILed 2026-08-01 same session on cushion despite real moats). Also worth flagging for a future revisit: VRT's economics ride the same AI-datacenter-buildout macro driver as ASML/TSM (held) even though the technical moat (liquid cooling vs. litho vs. foundry) is genuinely distinct — a second reason to want a real derate, not just a pullback, before reconsidering. Revisit only on a multiple correction toward the low-to-mid 30s, in line with its own pre-AI-cycle history." },
  { t:"SNDK",  verdict:"FAIL",  date:"2026-08-01", held:false, bucket:null,
    chokepoint:"Pure-play NAND flash producer (spun from Western Digital, Feb 2025) inside a genuinely tight global oligopoly (Samsung, SK Hynix/Solidigm, Kioxia, SanDisk, Micron) amid a reported multi-year NAND shortage — years of capex lead time to add fab capacity is a real bottleneck. Distinct sub-technology from MU/SK Hynix's DRAM/HBM story (NAND is storage, not compute-adjacent memory), so this clears the correlation test better than SKHY did — worth stating plainly since it's not the reason this fails.",
    cushion:"Fwd P/E ~57x after the stock has run +142% to as much as +574-600% YTD depending on the measurement window (source-to-source variance itself signals how extended the move is) — Susquehanna/Bernstein have chased with $3,000-3,250 targets after already-huge prior moves. This is the RKLB/MSCI 'priced for perfection' pattern in its purest form: a real chokepoint with zero margin of safety left in the price. Fails unconditionally.",
    note:"Sourced from Scout's ticker_scores (reward 4.352) and UNIVERSE_SUMMARY 'bull' row (7 report-days, 07-14 to 08-01, present in 5/5 of the last 5 report-days — one of the hottest names in Scout's entire universe alongside SKHY). Checked the specific redundancy question CLAUDE.md flagged for SanDisk against the SKHY finding: DRAM ETF's actual SanDisk weight is small (~2-5% per Yahoo/other sources, not a dominant holding like SK Hynix's ~20% or Micron's ~29%), and NAND (SanDisk) is a technologically distinct memory segment from DRAM/HBM (MU, SK Hynix) — so unlike SKHY, this is NOT primarily a correlation failure. It fails on cushion alone (Q2, unconditional), the same clean-chokepoint-but-nowhere-near-cheap-enough pattern as VRT and RKLB. Revisit only on a real NAND-price/multiple correction, not on continued shortage headlines — the shortage narrative is already fully in the price several times over." },
  { t:"AAPL",  verdict:"WATCH", date:"2026-08-01", held:false, bucket:null,
    chokepoint:"iOS distribution lock-in (1B+ devices, App Store/ecosystem switching costs) PLUS a second, newer chokepoint: Apple controls the AI-routing surface on-device (Siri/Apple Intelligence defaults, invocation, UI hooks) — the Jan 2026 Gemini-Siri deal ($1B/yr, custom 1.2T-param model) means Apple picks which AI reaches a billion users, not the other way around. Clean, statable, real.",
    cushion:"Fwd P/E ~31-36x (source-dependent) vs. AAPL's own ~24-25x 10yr average — a real, not heroic, premium (~1.3x own history, nowhere near the WFE trio's 2.25x). Post the 07-31 Q3 FY26 print (worst single-day post-earnings selloff since Jan 2013, -10%, on FY guide of 9-11% rev growth missing 12% consensus and gross margin compression from DRAM/NAND cost inflation), price ($308.91) sits only ~6% below the average analyst target (~$327) — thin but positive, and Tim Cook flagged the memory-cost pressure as still live into the Sept quarter, not yet resolved.",
    note:"Scout flags AAPL 13 report-days (07-10 to 08-01, highest-persistence name in this batch) — but almost entirely on two threads: the AAPL-OpenAI trade-secret suit (a Siri-stack risk, not a buy case) and, more materially, the exact 'AAPL memory flood / 100-year flood pricing' / 'iPhone 18 Pro $250-300 hike risk' story that just showed up in the 07-31 guide-cut. No ticker_scores entry. FAILS already-priced-in cleanly: AAPL is the most-covered stock on earth, the guidance cut and its DRAM/NAND cause are now front-page financial news, and Scout's own coverage called this risk before the print landed — zero informational edge, no contrarian angle. Correlation: notable but not disqualifying — AAPL is a natural partial HEDGE to the held MU/DRAM memory-supercycle bet (rising memory prices are AAPL's margin headwind and MU's tailwind), a genuinely different economic direction than a duplicate bucket. Portfolio-fit not reached. Kill-switch: a second consecutive guide-down tied to memory costs, or gross margin falling through the low end of Apple's own 46.5% guide. Revisit once the Sept-quarter print shows whether the memory-cost hit was one quarter or a trend, and only if the post-selloff price holds a real (not 6%) discount to consensus." },
  { t:"AMD",   verdict:"FAIL",  date:"2026-08-01", held:false, bucket:"ai-semis-capex-cycle",
    chokepoint:"EPYC server CPU share gains vs. Intel are real but not a bottleneck (x86 is a two-horse race, not a monopoly). The actual growth story — MI400/Helios AI accelerators — is explicitly the #2/challenger position behind NVIDIA, not a chokepoint: Scout's own coverage repeatedly frames it as 'AMD hardware ≠ wallet share' and 'NVIDIA mogs AMD' on inference (vLLM/ROCm lagging CUDA), and SemiAnalysis's 07-25 'Production Ramp Hell' piece on Helios/MI455X is a live execution-risk flag, not a moat confirmation. Can't be stated as a hard bottleneck — fails Q1.",
    cushion:"Fwd P/E ~69-80x on ~$6.87 forward EPS at $476.15 — and the mean analyst price target (~$472) sits BELOW the current price, a rare and unambiguous signal: the market has already priced in more than sell-side consensus expects. Requires the MI400/Helios ramp to fully close the NVIDIA gap AND the Anthropic $5B/2GW deal to scale on schedule to make sense — the textbook heroic-TAM pattern this gate exists to catch. Fails independently of Q1.",
    note:"Scout flags AMD 11 report-days (07-10 to 08-01, reward 5.044, bull sentiment tag in UNIVERSE_SUMMARY) — almost entirely about the AMD-Anthropic 2GW/$5B-equity deal and Helios ramp timing, not a chokepoint case. Double FAIL (Q1 contested chokepoint, Q2 cushion unconditional — price above mean target is the cleanest possible cushion failure in this whole batch). Correlation: direct comp to NVDA/AVGO/MRVL (all held) in the same AI-semis bucket STRATEGY.md already flags at ~15% of the book — adding AMD would be a fourth name in an already-concentrated cluster, and a strictly worse one given NVDA already owns the software/CUDA moat AMD is racing to catch. No /thesis warranted; revisit only if the MI400/Helios ramp actually lands AND the multiple derates toward its own pre-AI-cycle range (20-30x)." },
  { t:"NOW",   verdict:"PASS",  date:"2026-08-01", held:false, bucket:"enterprise-saas",
    chokepoint:"ServiceNow is the enterprise system-of-record for IT/HR/CSM workflow — once a Fortune 500 company has built years of custom workflow logic, audit trails, and integrations on the platform, ripping it out is a multi-year compliance-risk project, not a vendor swap. 98% renewal rate (best-in-class) is the clearest empirical confirmation of a real, not narrative, switching-cost moat.",
    cushion:"Fwd P/E ~21-23x, down from a 5yr average near 60x — the stock is -38-40% YTD 2026. Q2 FY26 (reported 07-22) beat and RAISED: subscription revenue +24.5% y/y (150bps above guide high end), FY26 subscription guide raised to $15.77B (+21% y/y), AI ACV crossed $1B with agentic deployments up 9x in nine months. Average analyst target ~$137-147 vs. the $111.23 close is +25-38% upside on a name that just beat and raised, not one hoping to. Real, not thin.",
    note:"Scout flags NOW 7 report-days (07-07 to 07-19, reward 6.434) but almost entirely under a BEARISH 'Software handoff — AI agents vs. SaaS seats' framing (bundled with CRM/WDAY, 'bear/watch seat ARR', monitored via @jasonlk) — the Scout narrative is the opposite direction of this verdict. Deliberately did NOT credit Scout in Step 5: the actual case here is that Q2's beat-and-raise (24% growth, AI ACV +9x, 98% renewal) directly CONTRADICTS the seat-ARR-bear thesis Scout had been carrying, not an extension of it — this is independently-derived, not Scout-sourced. Correlation: CRM and NOW both clear this gate today (CRM as PASS-WATCH below) — flagging per instructions that this is a real correlation concern between two enterprise-SaaS names, not just against holdings; NOW is the stronger, less-correlated-to-INTU case of the two (workflow/ITSM system-of-record vs. INTU's consumer tax software share different mechanisms; CRM's seat-based CRM licensing is closer to INTU's exact 'AI eats software' PF_RADAR tripwire). Kill-switch: subscription revenue growth decelerating back toward high-single-digits, or renewal rate breaking meaningfully below 98%. Recommend /thesis NOW next." },
  { t:"CRM",   verdict:"WATCH", date:"2026-08-01", held:false, bucket:"enterprise-saas",
    chokepoint:"Sales/Service Cloud is deeply embedded as the CRM system-of-record across enterprise sales orgs — real switching costs (data migration, workflow rebuilds, sales-team retraining). Weaker than NOW's claim, though: management has shipped three different Agentforce pricing models in ~18 months (seat -> consumption -> the new flat-fee AELA), which is itself an admission the legacy seat-based moat needs active re-architecting to survive the AI-agent transition, not a bottleneck quietly compounding on its own.",
    cushion:"Wisesheets' own revenue_growth_yoy calc came back near-flat (-0.6%) for the latest quarter, which the actual Q1 FY27 filing contradicts — real reported growth was +13% y/y on record revenue ($11.13B), record 34.8% non-GAAP operating margin, and Agentforce ARR crossing $1B (flagging the Wisesheets discrepancy explicitly, per CLAUDE.md's magnitude-sanity-check rule, rather than trusting the raw pull). Fwd P/E cited as low as ~13x by one source, consensus target ~$245-254 vs. the $184.02 close (down ~33% YTD 2026) is +33-41% upside — a real, INTU-style re-rate-on-fear discount, not a thin one.",
    note:"Scout flags CRM 17 report-days (07-03 to 07-25, the most persistent bear tag of this batch, reward 4.136) — explicitly tagged 'bear' in UNIVERSE_SUMMARY, almost entirely the seat-ARR/AI-agent-disruption theme (bundled with NOW/WDAY, and separately with ADBE as names Coatue/Chamath chart as already 'passed' by AI labs). FAILS already-priced-in the hardest of any name in this batch — this is the single most heavily and consistently bear-narrated name Scout tracks. Correlation (pushed hard per instructions): CRM is the closer duplicate of PF_RADAR's existing 'ai-eats-software' theme, which already tracks HELD INTU on the identical 'AI commoditizing software incumbents' mechanism — adding CRM doesn't diversify that bet, it doubles it with a weaker, actively-repricing-its-own-business-model version of the same wager. Also correlates with NOW (PASS above) as a second enterprise-SaaS name clearing today — flagged per instructions. Real fundamentals (record margins, $1B Agentforce ARR, double-digit growth) argue the derate has overshot, which is why this isn't a FAIL — but the combination of loudest-bear-narrative-in-the-batch plus direct overlap with an already-held 'AI eats software' bet says watch the AELA-adoption data for 1-2 more quarters, not buy today. Kill-switch: Agentforce/AELA ARR failing to reaccelerate CRPO growth back above ~15%, or a fourth pricing-model rewrite inside 24 months signaling the transition still isn't landing. No Scout credit — PASS-WATCH doesn't qualify." },
  { t:"SNOW",  verdict:"FAIL",  date:"2026-08-01", held:false, bucket:"enterprise-saas",
    chokepoint:"Data-gravity lock-in (migrating petabytes out of a warehouse once ETL pipelines, BI dashboards, and governance are built on it is genuinely costly) is real but not absolute — Databricks is demonstrably taking share in Snowflake's core SQL/warehouse market (BNP Paribas, 06-2026 note) and just raised at a $188B valuation (+40% from Dec 2025), evidence the competitive contest is live and Snowflake isn't winning it outright.",
    cushion:"Q1 FY27 (reported 05-27) was genuinely strong — total revenue +33% y/y, product revenue +34% y/y, NRR 126%, raised FY27 product-revenue guide to $5.84B (+31% y/y) — but none of that strength is available at a discount: the $293.28 close sits almost exactly AT the average analyst target (~$296.27), and the stock trades ~13-14.5x forward EV/sales while still GAAP-unprofitable (diluted EPS -$0.86 latest quarter). No margin of safety — the price already assumes the 30%+ growth and margin-expansion path continues without a wobble, precisely as Databricks keeps taking share in the core product. Fails cleanly.",
    note:"Scout flags SNOW 10 report-days (07-13 to 07-31, reward 4.637, 'watch' tag) almost entirely via the Databricks-comp lens (paired with MDB/PLTR/MSFT Fabric as 'data plane' names) rather than a bull case for SNOW itself — Databricks, the private competitor, gets the more bullish framing in Scout's own reports ('Ghodsi CRM stickiness', Unity AI Gateway). Unconditional Q2 FAIL (cushion) — price at consensus with zero discount and a live competitive share-loss risk not yet reflected in any derate. Correlation: third enterprise-SaaS name checked this session (with CRM/NOW) — SNOW is the one where the FAIL is clean and doesn't turn on the priced-in judgment call the other two required. Revisit only if a real pullback opens a genuine discount to target, or Databricks-vs-Snowflake competitive dynamics show Snowflake actually holding/gaining share rather than just growing off a smaller base." },
  { t:"HOOD",  verdict:"FAIL",  date:"2026-08-01", held:false, bucket:null,
    chokepoint:"Robinhood's edge is brand/UX/distribution (retail-first onboarding, zero-commission legacy, first-mover app-partner status on Trump Accounts) — sticky with its existing user base but not a hard bottleneck: Schwab/Fidelity/Coinbase/Kalshi and other exchanges all compete directly for the same order flow, and nothing structurally prevents a well-funded rival from replicating the app/UX. Same 'sticky, not hard' character that failed PLTR's chokepoint test.",
    cushion:"Fwd P/E ~55x vs. a ~14x Capital Markets industry average (roughly 4x the sector norm) at $86.56. Q2 FY26 (reported 07-29) was a genuine beat on record $1.31B revenue, but the mix shift is telling: crypto transaction revenue fell -38% y/y ($160M -> $100M) while prediction-markets revenue ($156M) surpassed crypto for the first time — a business riding whichever retail-trading fad is hottest this quarter, not a durable moat. Consensus target ~$121.86 (+41% upside) exists but requires the newest hot vertical (prediction markets/Trump Accounts) to keep more than offsetting the fading ones (crypto) indefinitely — the heroic-narrative pattern.",
    note:"Scout flags HOOD 8 report-days (07-03 to 07-15, reward n/a — not in ticker_scores) entirely via the Trump Accounts launch/enrollment-velocity angle (paired with BNY as custodian), a real but narrow, single-catalyst thread rather than a broad-based bull case — most Scout coverage predates this session's fresher Q2 crypto-revenue-decline data. Correlation: touches the same PF_RADAR 'kalshi' theme tracking CME's prediction-market exposure, from the retail-distribution side rather than the exchange side — a genuinely different mechanism, not a duplicate, but worth noting the theme is already on file. Double-leaning FAIL: chokepoint isn't a hard bottleneck (Q1 marginal-fail) and cushion is rich against a segment-mix story that just showed real volatility (crypto -38%) even as the headline beat. Revisit only if prediction-markets/tokenization revenue proves durable across a full cycle (not just one hot quarter) alongside a real multiple derate toward the sector average." },
  { t:"PL",    verdict:"FAIL",  date:"2026-08-01", held:false, bucket:null,
    chokepoint:"Owns the largest commercial daily-revisit Earth-imaging satellite constellation (hundreds of small sats) — a genuine, hard-to-replicate operational asset (fleet deployment/maintenance at this cadence takes years and real capital) with growing government/defense traction (Germany €240M multi-year contract, DIU/INDOPACOM expansion, NATO deals). Real chokepoint, and — checking the specific question this batch was asked to check — genuinely distinct from held SPCX: Planet sells Earth-observation IMAGERY/DATA, SpaceX sells LAUNCH + Starlink broadband; different customers, different revenue mechanism, minimal overlap despite both being 'space' names.",
    cushion:"Fwd P/S ~18.5-20x against only +8.4% revenue growth (Q1 FY27, still FCF-negative at -$1.87M) — the multiple is being paid for a backlog story ($734.5M, +216% y/y) that hasn't yet shown up in the top line, not for what's actually landing today. This is the RKLB pattern in miniature: real operational moat, but the price only works if years of backlog convert to revenue growth that's currently running under 10%. Consensus target ~$34.90-40 vs. the $20.48 close (+70-95% upside) looks like a huge cushion on its face, but that gap is explained by a stock priced for a multi-year conversion story to play out, not a genuine present-day discount — fails on the gate's own 'heroic multi-year narrative' test.",
    note:"Scout flags PL 8 report-days (07-07 to 07-23, reward n/a — not in ticker_scores), tagged 'bull' in UNIVERSE_SUMMARY, almost entirely via the 'orbital compute' theme (Google Project Suncatcher pilot, paired with RKLB/GOOG) — the same PF_RADAR 'orbital-compute' row already tracks this exact narrative (direction: watch, tripwire keyed to RKLB re-rating down 30%+, holdings: none). Worth noting explicitly: Cerebras's Feldman (cited in that PF_RADAR row) called orbital production datacenters '>=5 years away' — a direct reality check on the Suncatcher-pilot bull case PL is partly being valued on. Correlation clears (genuinely distinct sub-business from SPCX, confirmed above) but that's moot given the unconditional Q2 cushion fail. Revisit only once quarterly revenue growth actually accelerates into the backlog-implied range (20%+), confirming conversion is real rather than still a pipeline story." },
  { t:"GLW",   verdict:"WATCH", date:"2026-08-03", held:false, bucket:"ai-optics",
    chokepoint:"Top-5 (not top-1) player in global optical fiber/cable (~45% combined 2025 share with Prysmian/Sumitomo/Furukawa/YOFC) — NVDA's up-to-$3.2B and Meta's up-to-$6B capacity-funding commitments buy speed/scale from an incumbent with real yield/know-how, not exclusivity; a well-capitalized rival (Sumitomo, Furukawa, or China's YOFC, already inside the top five) isn't structurally locked out over a multi-year horizon the way a true monopoly would be. Real oligopoly-with-an-edge, same character as AMAT/LRCX in this gate's own history, not a clean singular bottleneck.",
    cushion:"Post 46% July crash (Q3 guide $4.95B, ~1.7% below estimates, not a demand loss) to $138.20: ~43x FY26 / ~33x FY27 consensus EPS — genuinely below GLW's own 5-10yr avg (~50-67x fwd P/E), a real math-checked derate, not just a sentiment reset. But still ~80% above the Hardware-sector median fwd P/E (~24x) and rich vs. optical peer LITE (~18x on trailing multiples cited elsewhere). Analyst targets ($175 Truist, ~$187-204 avg) imply real 27-48% upside without needing the most bullish case — but the bull case still leans on the Springboard Plan's 2028/2030 revenue targets ($30B/$40B) executing cleanly, and the guide miss that just crashed the stock is live proof that leg can wobble.",
    note:"Scout surfaced this via Truist's Buy upgrade + PT $175 (08-03) on the 'customers funding suppliers' framing (NVDA/Meta capacity deals). New, non-duplicative PF_RADAR theme (fiber/optical layer of AI-datacenter buildout) — no held ticker (TSM/AVGO/MU/ASML/NVDA) makes fiber or glass, sits one layer over from compute/packaging/networking/power. Real but thin cushion, closer to EFX's 'only fair' read than SPGI/CME's clean discounts — WATCH not PASS. Kill-switch/re-entry sharpener: a second-tier fiber competitor discloses a comparable hyperscaler capacity-funding deal (would show the NVDA/Meta commitments buy speed, not exclusivity), or Q3 print confirms the Springboard ramp is back on track. Companion prescreens run same session: LITE (WATCH), COHR (FAIL) — see below." },
  { t:"LITE",  verdict:"WATCH", date:"2026-08-03", held:false, bucket:"ai-optics",
    chokepoint:"~50-60% share of the EML (electro-absorption modulated laser) market feeding 800G/1.6T optical transceivers, with reported demand outstripping supply by ~30% — a genuine, capacity-constrained bottleneck today, reinforced by NVIDIA's direct $2B strategic equity investment (customer paying for insurance on scarce supply). But the moat is a manufacturing-yield story, not durable IP: Coherent is ramping 6-inch InP wafers (potentially ~4x LITE's 3-inch-process die yield) specifically to close this exact scarcity gap — a named, funded threat to the pricing power driving LITE's margin expansion, not yet resolved either way. Chokepoint being tested, not settled.",
    cushion:"Fundamentals are real and accelerating (SEC-filed, not just narrative): revenue +65.5% YoY (FQ2 2026, $665.5M) then +90.1% YoY (FQ3 2026, $808.4M); GAAP net income flipped from -$44.1M/-$60.9M a year ago to +$144.2M/+$78.2M; gross margin 34%->44% over three quarters. But at $713.94 (34% off its own 52wk high, yet +602% off its 52wk low and +115% YTD) this prices in a lot of that: ~49.5x fwd P/E, ~56.5x fwd EV/EBITDA, no discount to own history (none exists at this scale of profitability) or to peers (COHR/GLW both far cheaper on conventional multiples). Consensus target ~$985-1,105 implies real upside (+25-55%) but only if the CPO/1.6T ramp keeps accelerating without a digestion quarter — next earnings 2026-08-11 (consensus $3.02 EPS) is a live binary, not a hypothetical one.",
    note:"Scout theme: optics/CPO as the AI-buildout bottleneck migrating from compute silicon into the interconnect layer — LITE is the laser/optics side of the exact CPO mix-shift PF_RADAR's custom-hyperscaler-networking row (AVGO) already flags via Nomura's 43% optical-engine/14% switch-ASIC BOM split. Complementary to, not a duplicate of, AVGO's chip-silicon chokepoint — clears correlation cleanly, no held ticker makes lasers or transceivers. Genuinely better-evidenced than most Scout-sourced ideas (real GAAP profitability inflection, not just a growth story) but fails the gate's own 'rich valuation on a narrative, no wobble allowed' standard — WATCH not PASS. Kill-switch/re-entry: either a 30%+ further pullback without a fundamental miss, or Coherent's 6-inch wafer ramp publicly failing to close the yield gap (would harden rather than erode the chokepoint). Revisit immediately after the 2026-08-11 print, not before. Companion prescreens run same session: GLW (WATCH), COHR (FAIL) — see below." },
  { t:"COHR",  verdict:"FAIL",  date:"2026-08-03", held:false, bucket:"ai-optics",
    chokepoint:"Real InP vertical-integration edge (world-first 6-inch InP wafer line vs. industry-standard 3-inch, claimed ~4x die yield at under half the die cost; 20+yr in-house epitaxy/laser fab) — but shares the field with Lumentum (more vertically integrated, grows its own InP wafers in-house vs. COHR buying external InP substrate) and Fabrinet. NVIDIA's $2B equity stake + multiyear supply deal (Mar 2026, revenue starting CY27) is real demand validation, but NVIDIA making the identical $2B move into LITE the same period is itself proof this is deliberate multi-sourcing by the customer, not lock-in to one vendor. Oligopoly with genuine tech, not a sole-source bottleneck.",
    cushion:"~48x fwd P/E on FY26 non-GAAP EPS (~$5.48) at $262.89, or ~37-38x even on an optimistic FY27 growth read — no discount by any measure, after the stock is already +247% over the trailing year. Analyst targets ($384-396) assume the same CPO/1.6T ramp thesis, not an independent margin-of-safety check. Balance sheet itself is fine today (net debt/EBITDA 0.5x, down from 2.1x a year ago, ~$3B cash post NVIDIA investment) — the II-VI/Coherent-merger leverage risk that would have applied a year ago has been resolved; the live risk is pure multiple risk, not solvency risk.",
    note:"Companion prescreens run same session: GLW (WATCH), LITE (WATCH). Duplicates the portfolio's already-dominant AI-capex/interconnect cluster (TSM/AVGO/MU/NVDA all held) more than it diversifies from it — PF_RADAR's custom-hyperscaler-networking row already tracks optics-content-share as a margin RISK to AVGO's networking segment; COHR would be the other side of a risk already being watched, not new exposure. Unconditional cushion FAIL (richest of the three optics names, and the one with the least differentiated chokepoint vs. LITE specifically). Revisit only on a real derate (normalized-2028-earnings ruler showing genuine cushion) or a wobble in the CPO/1.6T ramp that resets the narrative-driven multiple." },
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
  updated: "2026-08-03",
  THEMES: [
    { id:"stablecoins", label:"Stablecoins vs. card-network fees", direction:"threatens",
      holdings:["MA"], coverage:"prescreen-only",
      evidence:"GATE prescreen (2026-07-03) already names this as live and genuinely two-sided — stablecoin checkout threatens the 2–3% card fee model that is V/MA's entire moat. Reinforced 2026-07-19: Scout flags PYPL's 'AI-native roll-up' framing (@theallinpod) explicitly naming PayPal's ~$53B stack (600–700M accounts + stablecoins + Stripe risk) as a V/MA challenger angle — keeps the theme live in the discourse but doesn't move the tripwire (no retailer discount, no V/MA 10-Q disclosure).",
      tripwire:"A top-10 US retailer offers a stablecoin checkout discount, or V/MA disclose stablecoin volume cannibalization in a 10-Q." },
    { id:"kalshi", label:"Prediction markets vs. regulated exchanges", direction:"threatens",
      holdings:["CME"], coverage:"prescreen-only",
      evidence:"CME's own GATE prescreen note already names this kill-switch. CBOE failed prescreen partly because analysts flag it as 'most at risk' of the group — CBOE itself fully sold 2026-07-30 as part of the rotation into core ETFs, so this row's holding exposure is now CME only; the theme and CBOE's prescreen history stay on file for context. No mentions of CME/CFTC litigation status or a Kalshi institutional-volume disclosure in the 2026-07-19 through 07-31 reports — no new evidence this window.",
      tripwire:"CME's CFTC lawsuit resolves against CME, or Kalshi discloses institutional (not just retail) volume crossing a material share of exchange volume." },
    { id:"ai-eats-software", label:"AI commoditizing software incumbents", direction:"threatens",
      holdings:["INTU"], coverage:"prescreen-only",
      evidence:"GATE prescreen already flags 'AI eats TurboTax' as the loud consensus bear case — already priced into INTU's 38% YTD decline, not a hidden risk. General AI-eats-software discourse kept broadening 2026-07-19 through 07-31 (Chamath's Infosys/T&M thesis, 'lab vertical cannibalization' naming Figma/MSFT-adjacent assets, headless-CRM and Replit-vs-Marketo pricing posts) but none of it names INTU or a filing-share number — tripwire unmet, no INTU-specific evidence.",
      tripwire:"TurboTax discloses an actual filing-share loss (IRS Direct File expansion, or a named competitor's filed share gain) — a real number, not sentiment." },
    { id:"packaging-multivendor", label:"Advanced packaging going multi-vendor (TSMC CoWoS monopoly eroding)", direction:"threatens",
      holdings:["TSM"], coverage:"thesis-covered",
      evidence:"Scout (SemiAnalysis, 2026-07-01) flagged Google's TPU 'Humufish' shifting from TSMC CoWoS to Intel EMIB-T — first hard evidence of a design win outside TSMC. Directional-not-tripping updates 2026-07-25/31: AVGO–Samsung announced a >$200B cooperation through 2030 spanning HBM/2nm/advanced packaging (a chip designer building a non-TSMC packaging relationship, not a hyperscaler design win — doesn't satisfy the tripwire's wording); TrendForce (07-31) reports TSM itself developing an 'EMIB-like' process with Kinsus because its own CoWoS capacity is tight — TSM diversifying its own approach, a tell the pressure is real even without a second hyperscaler defection. CLOSEST YET, 2026-08-03: TrendForce/@jukan05 report MediaTek's Intel EMIB-T packaging collaboration targets '400G SerDes for next-gen ASIC incl. reported Google TPU v10 and Meta custom [ASIC]' — the first time a SECOND hyperscaler (Meta) has been named alongside Google in a non-TSMC packaging context, though this is still trade-press-reported intent via MTK/Intel, not a hyperscaler's own disclosure — doesn't satisfy the tripwire's 'discloses' wording yet, but is the nearest miss so far.",
      tripwire:"A second hyperscaler discloses a non-TSMC advanced-packaging design win (a real allocation, not a pilot).",
      note:"COVERAGE CHANGE: upgraded thesis-gap → thesis-covered. TSM's 2026-07-16 /update-thesis (commit c5a05d8) already added this exact tripwire into the bear case's `breaks`/`requires02` fields ('...or a SECOND hyperscaler discloses a real (non-pilot) advanced-packaging design win outside TSMC's CoWoS — confirming Google's TPU/Intel EMIB-T shift as a trend rather than a one-off'). The prior 2026-07-18 radar note calling this a gap was already stale by two days when written — verified directly against stocks/tsm/thesis-data.js." },
    { id:"neocloud", label:"Hyperscalers becoming neoclouds (selling excess AI compute externally)", direction:"enables",
      holdings:["META","MSFT","AMZN","GOOGL"], coverage:"thesis-gap",
      evidence:"Scout (SemiAnalysis, 2026-07-03): 'Meta Compute: Everyone Wants To Be A Neocloud' — Bedrock 2.0 / Azure Foundry / Vertex all monetizing spare capacity as a routing tollbooth. Corroborated 2026-07-09/10 and strengthened 2026-07-12/13 (META copying xAI's owned-cluster playbook, pricing external/anchor compute at 3–4x peer $/MW). CLOSEST-YET TO TRIPPING, 2026-07-23: GOOGL's Q2 earnings call (per @tengyanAI/@SemiAnalysis_) disclosed it 'began to recognize revenues from TPU system sales' — external TPU system sales, not just internal Cloud consumption — though 'most system rev [is] 2027, not 2026.' This is earnings-call disclosure, one step short of the tripwire's literal bar (a material line-item in a 10-Q). Also reinforcing but not filing-level: Jamin Ball's cloud-reacceleration scorecard (AWS +37%, Azure +43%, GCP +82%, 07-31) and Gavin Baker's 'rising rent on compute' framing (07-29/31).",
      tripwire:"Any of the four discloses a material new external-compute revenue line in a 10-Q (not a press-release pilot).",
      note:"Upside optionality, not a kill-switch. Re-verified 2026-07-31 directly against current files (post GOOGL full-rebuild 07-25/26 and post MSFT/META/FICO/AMZN roll-forward 07-31): all four still zero mentions of neocloud/external-compute/TPU-system-sales framing — remain thesis-gap. GOOGL is now the most worth closing at its own next /update-thesis: check whether the Q2 10-Q (filed after the 07-23 call) gives TPU-system revenue its own disclosed line — that would trip the tripwire outright, not just move the row." },
    { id:"orbital-compute", label:"Orbital / space-based compute", direction:"watch",
      holdings:[], coverage:"n/a",
      evidence:"Scout flagged this across 4 reports with the highest reward score of the cycle (RKLB/Iridium deal, Coatue naming space datacenters in SpaceX's own valuation framework). Contested further 2026-07-11 to 07-15 (Altman vs. Musk narrative fight, Cerebras's Feldman calling orbital production DCs '≥5 years away'). Since then (07-19–07-31): direction moved AWAY from the tripwire, not toward it — RKLB got MORE contract wins this window (NSSL Lane 1 ceiling raised to $17B, a $266M USSF suborbital award, continued iQPS/Electron cadence) and FCC Part 100 passed (a favorable process win), though an ODC-specific NEPA/PEIS challenge remains open. Separately, SpaceX is reportedly turning away dedicated Falcon 9 customers past 2028 (07-23/24) — a manifest-capacity signal relevant to SPCX's own thesis, not previously flagged, but not this row's tripwire either.",
      tripwire:"RKLB (or a pure-play successor) re-rates down 30%+ from current levels without a fundamental deterioration — re-run /prescreen; a real cushion may finally exist.",
      note:"Nothing held — RKLB FAILED /prescreen 2026-07-03 on cushion. Tracked purely as a re-entry watch item, not a current exposure. If anything RKLB's contract book got stronger this window — tripwire further from firing than at the last update, not closer." },
    { id:"ny-dc-moratorium", label:"State-level data-center siting bans (NY 50MW+ pause)", direction:"threatens",
      holdings:[], coverage:"n/a",
      evidence:"Gov. Hochul's EO (reported 2026-07-14/15) imposes a first-of-its-kind statewide moratorium on discretionary permitting for 50MW+ data centers (~1yr GEIS process). Virginia separately denied a 2,000-acre DC campus (2026-07-14) while entitled/zoned land nearby kept trading. STRENGTHENED 2026-07-31: Virginia lawmakers are now pushing for a DC permit pause plus a special legislative session on siting, tied to the Dominion–NextEra merger — the first SECOND-STATE legislative push since NY's EO, though it's a push, not yet an enacted moratorium. Separately, Monroe Twp, NJ enacted a town-wide DC ban now facing a $300M suit — real, but municipal not state-level, so doesn't satisfy the tripwire wording either. STRENGTHENED AGAIN 2026-08-03 (Scout): VA push gained explicit bipartisan heat — state senators calling for a review / potential statewide moratorium on groundwater grounds, an EO request from Sen. Sturtevant, and Sen. Lucas on record that 'status quo cannot continue' (Cardinal News/WRIC/@dcdnews, 08-02/03). Still a legislative push/request, not an enacted pause or EO — tripwire remains unmet, but this is the most concrete VA language yet (named senators, named legal ground, explicit EO ask) versus 07-31's more general 'lawmakers pushing' framing.",
      tripwire:"A second state (beyond NY) enacts a comparable discretionary-permitting pause for large-load data centers, or NY's moratorium is extended/expanded past its ~1yr GEIS window instead of lapsing.",
      note:"EQIX was a small satellite position, fully sold 2026-07-30 as part of the rotation into core ETFs — holdings stays empty. Coverage stays 'n/a'. CLOSEST OF ANY ROW TO A REAL SECOND-STATE EVENT right now given Virginia's escalating legislative push (07-31 → 08-03) — check again at next radar pass; if VA's governor issues an actual EO (not just a request) this row should flip to coverage:'thesis-gap' against AMZN/MSFT/GOOGL's NoVA-heavy footprint, since none of their theses currently name VA siting policy as a kill-switch input." },
    { id:"custom-hyperscaler-networking", label:"Hyperscalers building custom network fabric instead of buying merchant switch silicon", direction:"threatens",
      holdings:["AVGO"], coverage:"thesis-covered",
      evidence:"SemiAnalysis (2026-07-14/15): Amazon's Resilient Network Graphs (RNG) — a random-graph topology + passive optical shuffle boxes + 'Spraypoint' multipath — claims up to 45% cost savings vs. fat-tree topologies. No SECOND hyperscaler has disclosed a comparable custom-topology deployment as of 2026-07-31 — Meta's 'silicon waste' reporting (SemiAnalysis 07-22/23/24 — Rivos, DSF, Grand Teton, Ariel, cut-down MI450X) is custom-CHIP effort, not network-topology substitution, so it doesn't meet this tripwire as written. Separate, not-yet-tracked risk worth flagging for AVGO's next touch: Nomura's CPO switch BOM breakdown (07-31) shows optical engines now ~43% of switch value vs. ~14% for the switch chip itself — a margin/content-mix risk to AVGO's networking segment, independent of the custom-fabric threat.",
      tripwire:"A second hyperscaler (Google, Microsoft, Meta) discloses a comparable custom-topology network deployment at scale, or AVGO's own 10-Q/10-K flags networking-segment growth deceleration tied to hyperscaler in-house fabric.",
      note:"COVERAGE CHANGE: upgraded thesis-gap → thesis-covered. AVGO's 2026-07-18 /update-thesis already added this exact tripwire — the bear/base case `breaks` fields both name it verbatim ('...a second hyperscaler discloses a custom-network deployment comparable to Amazon's RNG'), and the KPI/signal panel carries a 'Hyperscaler Custom Networking' WATCH row — verified directly against stocks/avgo/avgo-thesis.html. AVGO's own REVIEW_GATES entry (2026-09-04, VMware ARR) is the natural next checkpoint to also re-confirm this row and consider folding in the new CPO optical-content-mix risk noted above. 2026-08-03: this same CPO/optical-content-mix shift is the other side of three new PF_PRESCREEN entries (GLW/LITE WATCH, COHR FAIL, bucket 'ai-optics') — the risk this row flags TO AVGO's networking margin is the same trade those prescreens evaluated as a standalone bet on the optics-supplier side. None held; revisit together if any of the three gets re-screened toward PASS." },
    { id:"pjm-bring-your-own-generation", label:"PJM 'bring-your-own-generation' rule for new large loads", direction:"enables",
      holdings:["GE","GEV","PWR"], coverage:"prescreen-only",
      evidence:"PJM's Board adopted a design (reported 2026-07-31, Utility Dive/TD World) making new large loads that don't bring their own generation by June 1, 2027 subject to curtailment ahead of emergency load management, plus a new Large Load Registry. If grid power for new data-center-scale loads becomes conditional on curtailment risk, on-site/turbine generation (GE's LEAP/aftermarket franchise, GEV's turbine and grid-equipment backlog, PWR's grid/interconnection construction work) becomes more valuable, not less — the theme enables rather than threatens this trio.",
      tripwire:"FERC finalizes, materially delays, or reverses PJM's June 1 2027 bring-your-own-generation rule — a real order, not a proposal stage.",
      note:"NEW ROW, added 2026-07-31. GE has a PF_PRESCREEN FAIL entry (2026-07-09, cushion-only fail, moat/kill-switch already defined there); GEV and PWR have neither a prescreen entry nor a built thesis on file, so coverage here is a rough label for GE only — genuinely n/a-adjacent for GEV/PWR until either gets its own GATE pass. Revisit after PJM/FERC's next order, and consider a GEV/PWR prescreen if the rule firms up." },
  ],
};
