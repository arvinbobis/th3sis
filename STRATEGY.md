# Investment Strategy Summary
*Compiled June 2026 — for personal reference / Claude Code project*

---

## 1. Core Philosophy

**The napkin idea ("$1,000 generator"):**
Let a low-cost, high-conviction position compound. Once it roughly doubles
(and *only* if the thesis is still intact), trim to recover most of the original
capital, then let the remainder ride indefinitely as "house money." Repeat the
pattern with the next idea.

**The two anchors of every decision:**
1. **Chokepoint thesis** — own the bottleneck nobody can route around
   (the ASML logic: not the chips, the *only* machine that makes the chips).
2. **Valuation cushion** — a great business is not a great *stock* if the price
   already pays for the thesis working. Margin of safety limits the damage when wrong.

A thesis being real does NOT mean you need to own it, or own *more* of it.

**Origin note:** the "$1,000 generator" and the chokepoint+cushion rigor were formalized
before an AI-assisted `/prescreen`/`/thesis` workflow existed. Positions built earlier
(Visa, Mastercard, and the broader financial-data cluster) came from manual "quality
compounder" judgment — real businesses, but never actually screened against this bar. See
§7 for the retroactive audit and how the portfolio is meant to converge toward this
discipline over time, one prescreen/thesis pass at a time, not a single rebalancing event.

---

## 2. Portfolio Direction

**Simplify and focus.** Moving from ~33 scattered positions toward:
- **Core (~70%):** QQQ + QQQM + SPMO — broad market, weekly DCA, "don't miss the ride."
  (Was IUSG + QQQ at original writing; IUSG fully exited 2026-07-07 and replaced with
  QQQM + SPMO — doctrine unchanged, `PF_STRAT.CORE_TICKERS` updated to match.)
- **Satellite (~30%):** 1–3 high-conviction names only, run through the "$1,000 generator"
  (§1) — this mechanism is unaffected by the core build-out below; it's the dedicated
  vehicle for the satellite sleeve regardless of what % of the total book that sleeve is.

**Where this actually stands (2026-07-11):** Core is currently **3.7%** of the book
(~$1,121) — nowhere near the 70% target. This isn't a new problem or a change in
direction; it's the honest, long-standing gap between the plan and its execution. The
2026-07-09 close-out of the small semi satellites (ANET, ARM, ALAB, LRCX, MRVL — see §7)
is explicitly **part of closing that gap**: proceeds from position closures are now
prioritized toward core DCA rather than automatically recycled into new satellite bets.
ALAB and MRVL remain live re-entry watches (`PF_ALERTS`, buyFloor = each thesis's own
base-case floor) should a high-conviction re-entry open up later — but that re-entry, if
it happens, draws on a *future* recycled seed from the generator/tree (§1), not a reversal
of the core consolidation.

**The tech-correlation caveat (stated explicitly, not just implied):** "moving into the
index" is not the same as diversifying away from the book's dominant risk. QQQ (Nasdaq-100)
is itself >50% tech-weighted; QQQM tracks the same index. Layered on top of AI Semis &
Hardware (~15% of the book, including DRAM — a direct memory-cycle bet) and Mega-Cap
Platforms (~27%), the honest look-through picture is that a large majority of the
portfolio is one correlated AI/tech cycle wearing different labels. The core build-out
genuinely reduces **single-name blowup risk** (no more ALAB-specific news wiping out a
concentrated position) — it does **not** reduce **sector-cycle risk** the same way true
asset-class diversification would. Worth remembering when sizing whatever satellite the
generator/tree seeds next: favor something that actually diverges from the AI/tech cycle,
not another name inside it.

**Existing winners** — let ride, thesis-gated quarter by quarter (e.g. ASML +154%, GE +25%).
**Existing losers** — held with 5–8 year horizon, not touched. Note the cluster is
concentrated in financial-data / ratings names (SPGI, MCO, FICO, EFX, MSCI, INTU,
CME, CBOE) — losses are thematic, not random.

**Reality check:** portfolio is roughly net flat (~$33.7K in, ~$33.5K value).
Spectacular winners offset by the financial-data cluster. This is *why* simplify/focus
is the right move.

**Checked against the machine audit (2026-07-03 through 07-11, Phases 0–8): no
deviation.** The audit's phases are all machine-infrastructure (provenance snapshots,
`/verify-thesis`, scorecard, radar, nav wiring, the engine split) — none prescribe a
portfolio allocation target, so a core-consolidation direction doesn't conflict with any
of it. The 70/30 core/satellite split itself predates the audit entirely (original June
2026 strategy doc) and the audit never touched it. The one genuinely relevant audit
artifact is `PF_ALERTS` (Phase 1's single-source-of-truth fix) — it's exactly what makes
ALAB/MRVL's "sold but tracked" status possible without any new machinery.

---

## 3. Active Plans & Limit Orders

All orders placed **manually** (not via automation), **Good-Til-Cancel**, sized as
speculative slices. All sit **below market** — letting price come to me, not chasing.

The ladder itself (ticker, limit, size, anchor rationale) lives in `PF_STRAT.LIMITS` in
`stocks/portfolio/portfolio-data.js` — rendered live on the ACTIONS page
(`stocks/portfolio/action-items.html`) alongside current cash on hand. Not duplicated here
as a table anymore; this section carries only the reasoning that doesn't fit in a JS config
object. PLTR sits on the watchlist via `PF_PRESCREEN` (§7), not `LIMITS` — it failed
`/prescreen` 2026-07-02 (~80x trailing sales, no cushion; moat is enterprise/govt lock-in,
not a hard chokepoint). Revisit only on real multiple compression, not on headline momentum.

**Musk-empire exposure capped:** SPCX + TSLA treated as ONE bucket, not two independent
bets — they're correlated (shared CEO, narrative, possible 12–18mo merger). Post-merger
they could become a single ticker's worth of risk. Enforced via `MUSK_BUCKET_CAP` in
`PF_STRAT` — **raised from $1,000 to $1,580 on 2026-07-11**, deliberately, after reviewing
real post-IPO SpaceX trading data (see §4) and resizing the SPCX GTC order to 9 sh @ $120
(~$1,080) + the existing $500 TSLA plan. Not scope creep — a conscious re-sizing of the
correlated bet with a real reason (see the SPCX entry in `PF_STRAT.LIMITS` for the full
analyst-data reasoning), not a cap that quietly drifted.

**On chasing:** if a name bounces just above its limit, do NOT bump the limit up — see
§5 rule 3. Patience is the position.

---

## 4. Thesis Checkers (review quarter by quarter)

### GE Aerospace (aging-fleet / MRO chokepoint)
- Installed base growing; services/aftermarket revenue ramping (~70% of revenue)
- LEAP/CFM aftermarket maturation
- Shop-visit volume, fleet utilization
- **Trim trigger:** position ~$1,600 *and* thesis intact → sell ~$600–800, let rest ride

### MU (HBM memory chokepoint — #3 of only 3 suppliers)
- **Hyperscaler capex** (MSFT/GOOG/AMZN/META) — still rising? = intact. Cutting? = exit signal.
- **HBM supply** — still "sold out / fully allocated"? = intact
- **Gross margins** (currently 84–86%) — compressing = SK Hynix/Samsung competition biting
- Locked, non-cancelable, cash-backed contracts ($22B / 16 agreements) de-risk cyclicality
- Bear case: all 3 suppliers expanding capacity simultaneously into 2027–2028

### SPCX (SpaceX — 3 businesses in one ticker)
- **Starlink** = the crown jewel (63% EBITDA margin, the real value)
- Launch = mature/profitable; **xAI = money furnace** (huge burn)
- Watch: Sept 2, 2026 first earnings print; ~Dec 2026 180-day lockup expiry (both could
  crack the artificial price support from 4% float + index-inclusion buying)
- Risk: Starship execution; aggressive $10T-by-2035 TAM narrative = no cushion if it slips
- **Real data as of 2026-07-11** (SpaceX IPO'd 2026-06-12, not "pending" — two Scout-fed
  podcast transcripts said otherwise that day and were wrong, corrected in Scout memory):
  IPO $135, ATH $225.64 (Jun 16), last $152.16. Analyst spread is genuinely wide: Morningstar
  bear case $63 fair value (a real, current figure, not stale) vs. ~$210–242 consensus
  average (30 analysts, Buy) vs. bull cases $200–300+ (Goldman/Citi/BofA/Morgan Stanley).
  The stock has never traded below its own $135 IPO price — that's the only real floor it
  has shown. GTC entry resized 2026-07-11 from $100 (a level below any observed trading,
  set 2026-06-27) to **$120** — a genuine break below the IPO-price floor, still well above
  the Morningstar bear case.
- **`/prescreen` run 2026-07-12 — PASS** (chokepoint: Starlink/reusability cost-cadence
  advantage, materially cleaner than TSLA's contested FSD-vs-Waymo case; cushion: $152.16
  sits in a defensible middle of the real analyst spread, not requiring the bull case).
  Companion TSLA prescreen FAILed the same day — the two Musk-bucket legs are not
  equivalent bets; see `PF_PRESCREEN` for both full records.

### TSLA (physical-AI: data moat → autonomy + robotics)
- Real moat = **FSD/autonomy data** (8.4B+ miles vs Waymo ~200M) — but this is a
  data-*volume* claim, not commercial-*execution*. Waymo runs ~3,000 vehicles /
  11 metros / ~500K paid rides per week TODAY; Tesla's unsupervised robotaxi fleet
  is ~20 vehicles despite the 2026-07-03 Miami launch (first market outside TX/CA).
  Real scale is tied to the FSD v15 rewrite, late 2026/early 2027 — still a forward
  promise, not present reality. One report also flags Tesla winding down unsupervised
  ops in the original Austin/Dallas/Houston cities even as Miami launches — an
  unresolved contradiction, not noise.
- Optimus = call option, NOT a moat yet (crowded: 150+ Chinese humanoid competitors).
  Production TARGET raised 50K→70K annualized, but actual 2026 SHIPMENT forecast is
  only ~25K±10K — a real, wide target-vs-delivery gap.
- The bull case = shared AI brain (AI5 chip) feeds both cars AND robots
- **No valuation floor** — ~182–396x earnings (forward vs trailing, $407.59 as of
  2026-07-11); auto business alone can't support price, and China EV competition is
  compressing its margins further even as Q2 deliveries beat (480,126, +25% YoY).
  Buying belief, not value. Size accordingly.
- **`/prescreen` run 2026-07-12 — FAIL on cushion** (unconditional; see `PF_PRESCREEN`
  for the full six-question record). This wasn't new information — it formalizes what
  this section already said. No `/thesis` build warranted for the same reason: a
  dollar-precise 3-scenario dashboard would overstate precision this name doesn't have.
  Next earnings **2026-07-22** — a real catalyst before the $250 GTC limit (still
  unplaced as of 2026-07-12) could realistically fill.

---

## 5. Discipline Rules (the actual edge)

1. **Buy chokepoints with a cushion.** Both must be true.
2. **A fill is not automatically a gift.** If a limit fills, check *why* the price
   dropped before celebrating — a fill near the limit often means the thesis got rattled.
3. **Don't chase.** If a name bounces just above the limit (TSLA $260, SPCX $130,
   GE $369), do NOT bump the limit up. Patience IS the position. The core index
   funds (QQQ/QQQM/SPMO) do the real work anyway.
4. **Don't add fresh capital just to round a number.** Mechanical top-ups at highs
   violate the cushion rule. Let positions *earn* their way to the next action.
5. **Size correlated bets as one bucket.** (SPCX + TSLA = one Musk bet.)
6. **Beware X / social research.** Selection effect: only the exciting, bullish notes
   get screenshotted and shared (Oppenheimer SPCX bull, the aerospace Substack funnel).
   Verify against the *full* analyst spread and intrinsic work. The boring "fairly
   valued" note never goes viral — but it's often the honest one.
7. **Winners win because they were bought early/cheap.** The cushion lives in the cost
   basis. Adding at highs throws that away.
8. **Manual execution.** Place every trade by hand — stay deliberate at the one moment
   that matters.

---

## 6. Key Lessons Captured This Round

- **MU nibble ($100 → $150):** had the right idea, sized it like a test drive. The lesson
  isn't "MU bad" — it's *size up when YOU see it, not when CNBC does.*
- **Found the thesis after the market did** on MU/RKLB/SPCX/GE/TDG — all real chokepoints,
  all already crowded/priced. Discovering you're late is itself useful: wait for a pullback
  or pass.
- **RKLB:** real chokepoint (launch + optical/Mynaric), but ~65–100x sales, no earnings,
  no cushion, and a SpaceX/Starship overhang. Passed.
- **Decided NOT to compete with SpaceX directly** — preferred picks/shovels and insulated layers.
- **GE is enough for aerospace** — owning a second, leveraged version (TDG) of a thesis
  already held cleanly = false diversification + added risk.

---

---

## 7. Legacy Portfolio Audit — Manual-Era Holdings Re-Screened

Sections 1–6 above were built after the "$1,000 generator" idea existed but before
`/prescreen` and `/thesis` existed as tools. A cluster of holdings — financial-data /
ratings / exchanges (SPGI, MCO, EFX, MSCI, CME, CBOE), INTU, and the payments pair (V, MA)
— were sized using manual "quality compounder" judgment (durable moat + strong brand), not
the chokepoint+cushion rigor applied to ASML, MU, GE, etc. This section tracks what happens
when that judgment gets checked against the same bar now used for new capital.

**2026-07-03 retroactive `/prescreen` run — findata/platforms cluster + payments duopoly:**

Ticker-by-ticker verdicts, chokepoint, and cushion reasoning are **not duplicated here** —
canonical source is `PF_PRESCREEN` in `stocks/portfolio/portfolio-data.js`, rendered live on
the GATE page (`stocks/portfolio/strategy.html`). As of this run: PASS — SPGI, CME, INTU, V,
MA. WATCH — EFX. FAIL — MCO, MSCI, CBOE. This section carries only the reasoning that doesn't
fit in a JS note field.

FICO already cleared this bar via a full thesis (see `stocks/fico/`) — not re-run here.

**The catch:** V and MA individually clear the gate, but together they are the exact
"one bucket" case §5 rule 5 and the GE/TDG lesson in §6 already warn about — same duopoly,
same network moat, same regulatory risk, same stablecoin exposure. Owning both is not
diversification; it's one payments-duopoly bet sized as two. Treat V+MA as a single bucket
going forward (same logic as the SPCX+TSLA Musk bucket) rather than two independent PASSes —
size any *future* incremental capital to the pair as a whole, not per ticker. (Encoded as
`bucket: "payments-duopoly"` on both rows in `PF_PRESCREEN`.)

**What this changes, and what it doesn't:**
- **Doesn't trigger a sell.** Existing losers stay 5–8yr holds per §2 — a FAIL here means
  "wouldn't buy this today at this price," not "must exit now."
- **Does gate new capital.** MCO, MSCI, and CBOE do not get fresh dollars or a `/thesis` slot
  under the current setup — they failed the same cushion test a name like AVGO or PLTR would
  need to clear.
- **PASS names (SPGI, CME, INTU) are the actual "next idea" candidates.** Before reaching for
  a brand-new ticker, these already-owned, already-researched names have cleared the gate and
  would only need a full `/thesis` to formalize sizing and kill-switches.
- This is how the portfolio is meant to rebalance going forward per §1: not a one-time trim,
  but every new dollar and every legacy re-look going through the same prescreen/thesis
  discipline, whether the ticker is already owned or brand new.

**2026-07-03 Scout-sourced `/prescreen` run — RKLB (not held, new candidate):** FAIL on
cushion — see `PF_PRESCREEN` / the GATE page for the full chokepoint + cushion reasoning.
Short version: the Scout (`grok-buy-side-scalper`) flagged the space/orbital-compute theme
across 4 reports with the strongest reward score of the cycle, driven by the $8B Iridium
acquisition — but the price re-rated another +16% on the very deal being evaluated, so the
cushion problem §6 already flagged has gotten worse, not better. Duplicates existing SPCX
space exposure.

This is the first prescreen run sourced directly from the Scout rather than a legacy-holdings
re-look — confirms the Scout → `/prescreen` → gate pipeline works as intended even when the
answer is FAIL: a real, Scout-validated chokepoint still gets gated on cushion like anything
else.

**2026-07-09 `/prescreen` run — GE (held, first of the un-gated legacy queue):** FAIL on
cushion for fresh capital — see `PF_PRESCREEN` / the GATE page. The chokepoint is the
cleanest in the legacy book (CFM/LEAP narrow-body duopoly + >70% locked-in aftermarket),
but at ~50× guided EPS above the consensus target, the cushion lives entirely in the $295
basis. Confirms §3's "don't add at record highs" and — the actual point of the run — gives
the ride→2× trim plan its missing thesis-gate: LEAP duopoly intact AND double-digit
services growth. Remaining un-gated queue: MBGL (spinoff orphan), the power cluster
(ETN/GEV/PWR/EQIX), small semi satellites (ANET/ARM/LRCX), BKNG/BN, and the Musk bucket
(TSLA/SPCX) + TDG.

**2026-07-09 Scout-sourced `/prescreen` run — INTC (not held, new candidate):** FAIL on
cushion — see `PF_PRESCREEN` / the GATE page for the full reasoning. Short version: the
packaging-second-source chokepoint is real (it's the same EMIB-T evidence behind the
`packaging-multivendor` radar row threatening TSM), but at ~$109 after a 450% twelve-month
run with Foundry still losing billions per quarter, the price already assumes the thesis
succeeds — RKLB's pattern again, discovered the week the stock topped. Re-entry condition
logged in the gate entry: a deep derate with the Google/NVIDIA design wins intact.

---

*This document is a personal strategy snapshot, not investment advice. All entries are
thesis-gated and reviewed quarter by quarter. Re-check intrinsic values and analyst
spreads before acting — prices and theses move.*
