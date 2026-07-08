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
- **Core (~70%):** IUSG + QQQ — broad market, weekly DCA, "don't miss the ride."
  - Note: IUSG and QQQ overlap heavily (both large-cap US growth). Doubling down
    on a theme, not truly diversifying. Intentional, but worth knowing.
- **Satellite (~30%):** 1–3 high-conviction names only.

**Existing winners** — let ride, thesis-gated quarter by quarter (e.g. ASML +154%, GE +25%).
**Existing losers** — held with 5–8 year horizon, not touched. Note the cluster is
concentrated in financial-data / ratings names (SPGI, MCO, FICO, EFX, MSCI, INTU,
CME, CBOE) — losses are thematic, not random.

**Reality check:** portfolio is roughly net flat (~$33.7K in, ~$33.5K value).
Spectacular winners offset by the financial-data cluster. This is *why* simplify/focus
is the right move.

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

**Musk-empire exposure capped:** SPCX + TSLA treated as ONE ~$1,000 bucket, not two
independent bets — they're correlated (shared CEO, narrative, possible 12–18mo merger).
Post-merger they could become a single ticker's worth of risk. Enforced via
`MUSK_BUCKET_CAP` in `PF_STRAT`.

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

### TSLA (physical-AI: data moat → autonomy + robotics)
- Real moat = **FSD/autonomy data** (8.4B+ miles vs Waymo ~200M)
- Optimus = call option, NOT a moat yet (crowded: Figure, OpenAI re-entry)
- The bull case = shared AI brain (AI5 chip) feeds both cars AND robots
- **No valuation floor** — 312x earnings; auto business alone can't support price.
  Buying belief, not value. Size accordingly.

---

## 5. Discipline Rules (the actual edge)

1. **Buy chokepoints with a cushion.** Both must be true.
2. **A fill is not automatically a gift.** If a limit fills, check *why* the price
   dropped before celebrating — a fill near the limit often means the thesis got rattled.
3. **Don't chase.** If a name bounces just above the limit (TSLA $260, SPCX $108,
   GE $369), do NOT bump the limit up. Patience IS the position. The IUSG/QQQ core
   does the real work anyway.
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
