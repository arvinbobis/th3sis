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
 * 2026-07-09: full resync from live IBKR positions + trades. THE GENERATOR RESEEDED:
 * the MU GTC limit filled 2026-07-07 @ 899.80 (0.9446 sh ≈ $850.95 incl. commission —
 * almost exactly the $851.81 ASML trim proceeds). MU moves from LIMITS to the new
 * PF_STRAT.SEEDED ledger and becomes the second station on the TREE. Also in this
 * sync: IUSG fully sold (11.08 sh) and replaced with QQQM + SPMO buys — CORE_TICKERS
 * updated to match reality (doctrine change from "IUSG + QQQ" made by the user's own
 * trades, not by this file); GEV added to ~$1,015 (0.9451 sh, avg now 1,060.05);
 * new DRAM (Roundhill Memory ETF, ~$1,050) — sits in the semis theme, no thesis;
 * MBGL trimmed a 0.8357 fractional 2026-07-02 (matches the earlier odd-lot guess).
 * ─────────────────────────────────────────────────────────────────────────── */

const PF_ASOF = "2026-07-09";
const PF_ACCT = { netLiq: 34877.00, cash: 4789.38, dividends: 2.99, buyingPower: 4789.38 };

// ── Buy-alert pre-commitment (single source of truth for every armed ticker) ──
// Previously hand-mirrored in three places: each thesis's own `const ALERT`,
// stocks/index.html's REGISTRY[t].alert (drives the chip-dot radar), and
// STRATEGY.md §3's limit ladder. This block is now the ONE write point — the
// thesis's own ALERT const (if present) is a fallback for opening the file
// directly/offline, annotated as such; index.html reads this directly.
// thesisIntact is the one judgement software can't make: flip it to false the
// moment a kill-switch KPI breaches, which disarms the buy alert so you never
// add into a broken thesis. (See each stock's QUARTERLY checklist for the flip step.)
const PF_ALERTS = {
  ALAB: { buyFloor: 300, thesisIntact: true, asOf: PF_ASOF, nextEarnings: "2026-08-11" },
  AVGO: { buyFloor: 390, thesisIntact: true, asOf: PF_ASOF, nextEarnings: "2026-09-04" },
  TSM:  { buyFloor: 415, thesisIntact: true, asOf: PF_ASOF, nextEarnings: "2026-07-16" },
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
// AXP, MSCI, and V dropped 2026-07-07 — closed positions per live IBKR pull, see header note.
const PF_RAW = [
  ["ALAB","Astera Labs",          0.3484, 289.87,  394.51,  137.45,   36.46,   4.05, "semis",        true ],
  ["AMZN","Amazon.com",           8.1653, 202.74,  243.00, 1984.17,  328.76, -24.33, "platforms",    true ],
  ["ANET","Arista Networks",      0.6839, 147.66,  181.17,  123.90,   22.92,  10.06, "semis",        false],
  ["ARM","Arm Holdings",          0.2558, 283.82,  298.75,   76.42,    3.82,  -0.43, "semis",        false],
  ["ASML","ASML Holding",         0.5986, 730.61, 1774.20, 1062.04,  624.69,  16.11, "semis",        true ],
  ["AVGO","Broadcom",             1.1432, 351.63,  388.70,  444.36,   42.38,  20.49, "semis",        true ],
  ["BKNG","Booking Holdings",    10.7000, 188.61,  174.50, 1867.15, -150.92, -79.72, "diversifiers", false],
  ["BN","Brookfield",            11.0450,  45.36,   42.80,  472.73,  -28.27, -10.93, "diversifiers", false],
  ["CBOE","Cboe Global Markets",  1.0489, 286.95,  266.00,  279.01,  -21.97,   7.72, "findata",      false],
  ["CME","CME Group",             0.9659, 311.60,  245.00,  236.65,  -64.33,   4.11, "findata",      false],
  ["DRAM","Roundhill Memory ETF",16.9247,  59.14,   62.03, 1049.84,   48.84,  24.37, "semis",        false],
  ["EFX","Equifax",               4.9299, 253.60,  167.09,  823.74, -426.51, -36.92, "findata",      false],
  ["EQIX","Equinix",              0.0936,1078.41, 1016.54,   95.15,   -5.79,  -0.60, "power",        false],
  ["ETN","Eaton",                 0.2627, 384.38,  399.56,  104.96,    3.99,   1.02, "power",        false],
  ["FICO","Fair Isaac",           1.8783,1407.84, 1262.00, 2370.41, -273.94, -71.88, "findata",      true ],
  ["GE","GE Aerospace",           2.7332, 295.44,  355.94,  972.86,  165.36, -30.17, "power",        false],
  ["GEV","GE Vernova",            0.9451,1060.05, 1074.00, 1015.04,   13.19,  -2.91, "power",        false],
  ["GOOG","Alphabet",             3.0338, 227.50,  358.83, 1088.62,  398.42, -14.53, "platforms",    true ],
  ["INTU","Intuit",               2.3960, 642.94,  273.47,  655.23, -885.24, -18.45, "platforms",    false],
  ["LRCX","Lam Research",         0.3395, 297.47,  331.50,  112.54,   11.55,   1.82, "semis",        false],
  ["MA","Mastercard",             5.2499, 532.50,  520.00, 2729.95,  -65.65, -61.00, "payments",     false],
  ["MBGL","Mobility Global",      5.0000,  21.19,   21.01,  105.05,   -0.90,  -0.95, "findata",      false],
  ["MCO","Moody's",               5.1545, 484.90,  485.10, 2500.45,    1.02, -79.33, "findata",      false],
  ["META","Meta Platforms",       2.9644, 610.47,  603.86, 1790.08,  -19.61, -34.75, "platforms",    true ],
  ["MRVL","Marvell Technology",   0.3694, 194.44,  233.60,   86.29,   14.47,   1.07, "semis",        true ],
  ["MSFT","Microsoft",            5.8559, 434.43,  383.34, 2244.80, -299.18, -32.21, "platforms",    true ],
  ["MU","Micron Technology",      1.0769, 883.91,  950.87, 1023.99,   72.11,  13.45, "semis",        true ],
  ["NVDA","NVIDIA",               2.1852, 183.96,  203.27,  444.19,   42.20,  13.85, "semis",        true ],
  ["PWR","Quanta Services",       0.4109, 732.43,  665.21,  273.33,  -27.62,   3.46, "power",        false],
  ["QQQ","Invesco QQQ",           0.9735, 722.02,  711.11,  692.27,  -10.62,   1.64, "index",        false],
  ["QQQM","Invesco Nasdaq 100",   0.6868, 292.65,  292.81,  201.10,    0.11,   0.46, "index",        false],
  ["SPGI","S&P Global",           5.8357, 504.01,  431.00, 2515.19, -426.04, -72.71, "findata",      false],
  ["SPMO","Invesco S&P 500 Momentum", 1.3592, 147.87, 150.56, 204.64, 3.65,   1.55, "index",        false],
  ["TSM","Taiwan Semiconductor",  0.7182, 419.10,  436.76,  313.68,   12.68,   3.01, "semis",        true ],
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
  MUSK_BUCKET_CAP: 1000,              // SPCX + TSLA sized as ONE correlated ~$1,000 bet

  // Executed generator trims — original capital already recovered; the remainder
  // rides free as "house money". These are NO LONGER trim candidates: never
  // re-trim on price alone (the remaining shares can stay >2× cost indefinitely).
  // realized = banked gain on the sold slice; freeMV = remainder riding at trim time.
  TRIMMED: {
    ASML: { date:"2026-06-29", soldQty:0.46, soldPx:1851.77, proceeds:851.81, realized:514.72, freeMV:1142.13 },
  },

  // Seeds DEPLOYED but not yet harvested — the recycled ~$1,000 living in its next
  // idea. A ticker graduates from here to TRIMMED on its own thesis-gated 2× harvest.
  // planted = actual fill cost incl. commission; from = which harvest funded it.
  SEEDED: {
    MU: { date:"2026-07-07", from:"ASML", planted:850.95, fillPx:899.80, fillQty:0.9446,
          note:"GTC limit @900 filled — the ASML trim proceeds ($851.81) replanted almost to the dollar. Prior $101 nibble (0.1323 sh @762.87) folds into the same position: 1.0769 sh @ avg 883.91. 2× trigger ≈ $1,768 (thesis-gated: AI/HBM supercycle per stocks/MU thesis; kill-switch = cycle turn, see checklist)." },
  },

  // Active manual GTC limit ladder — all below market, speculative slices.
  // cap = planned new dollars (0 = no fresh capital / watchlist only).
  LIMITS: [
    { t:"GE",   limit:null, cap:0,   size:"ride → 2×",     musk:false, watch:false,
      anchor:"Own it cheap ($295 basis). Let ride to ~$1,600 position value (≈2× on $808), then trim ~$600–800 and let the rest ride. Don't add at record highs." },
    // MU removed 2026-07-09: the 900 GTC limit FILLED 2026-07-07 → see SEEDED above.
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
    note:"Mobility spinoff (7/1/26) simplifies the story further. Candidate for a full /thesis." },
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
  updated: "2026-07-03",
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
      holdings:["MSFT","AMZN","GOOGL"], coverage:"thesis-gap",
      evidence:"Scout (SemiAnalysis, 2026-07-03): 'Meta Compute: Everyone Wants To Be A Neocloud' — Bedrock 2.0 / Azure Foundry / Vertex all monetizing spare capacity as a routing tollbooth.",
      tripwire:"Any of the three discloses a material new external-compute revenue line in a 10-Q (not a press-release pilot).",
      note:"Upside optionality, not a kill-switch — none of MSFT/AMZN/GOOGL's theses currently name this as a bull-case accelerant. Consider adding at each stock's next /update-thesis." },
    { id:"orbital-compute", label:"Orbital / space-based compute", direction:"watch",
      holdings:[], coverage:"n/a",
      evidence:"Scout flagged this across 4 reports with the highest reward score of the cycle (RKLB/Iridium deal, Coatue naming space datacenters in SpaceX's own valuation framework).",
      tripwire:"RKLB (or a pure-play successor) re-rates down 30%+ from current levels without a fundamental deterioration — re-run /prescreen; a real cushion may finally exist.",
      note:"Nothing held — RKLB FAILED /prescreen 2026-07-03 on cushion. Tracked purely as a re-entry watch item, not a current exposure." },
  ],
};
