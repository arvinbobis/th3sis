---
description: Fast pre-screen gate to decide whether a stock earns a full /thesis deep dive
---

You are running a PRE-SCREEN, not a full thesis, for: **$ARGUMENTS**

Goal: decide in minutes whether this stock deserves a full `/thesis` build, or should be
logged as a pass/watch instead. Do not build price bands, KPIs, or a dashboard here — that
only happens after a PASS. Nothing here is financial advice; this is a triage step.

## Step 1 — Quick data pull (light, not the full /thesis pull)
Search the web for just enough to answer the gate questions below. Do not do the full
`/thesis` data pull (no 6-quarter history, no full analyst consensus spread):
- Current price and the single most relevant valuation multiple (P/E, P/S, P/B, or FFO —
  whichever fits the business)
- One-sentence read on what the bull narrative currently is, and how mainstream/crowded it
  already is (sell-side consensus, recent financial-media coverage)
- Whether this would overlap an existing holding's risk cluster — cross-check against
  `STRATEGY.md` §2 and §3 (the Musk bucket, the findata cluster, existing satellites) and
  `stocks/portfolio/portfolio-data.js` for current positions/themes

## Step 2 — Run the six-question gate
Answer each explicitly, one line of reasoning per question:

1. **Chokepoint test** — state the bottleneck this company owns that competitors can't route
   around, in one sentence. No hand-waving ("good company," "growing market"). If you can't
   state it cleanly, this fails.
2. **Cushion test** — does the current price hold up under the chosen valuation ruler without
   requiring a heroic multi-year TAM narrative to work? If the price only makes sense assuming
   the bull case plays out perfectly (the RKLB pattern — see `STRATEGY.md` §6), this fails.
3. **Already-priced-in test** — is this still contrarian, or already found by the market /
   sell-side / financial media? Late discovery isn't automatically disqualifying, but raises
   the bar — needs a specific edge or a pullback, not just agreement with consensus.
4. **Correlation test** — does this duplicate a risk cluster already in the portfolio? If so,
   does it add something the existing position doesn't already cover?
5. **Portfolio-fit test** — is there actual room for it under the core/satellite caps
   (satellites capped at 1–3, core ~70%, see `STRATEGY.md` §2)? A real thesis does not
   automatically earn a slot.
6. **Kill-switch test** — name the one piece of evidence that would prove this wrong, right
   now, before any deep dive. If nothing comes to mind, the thesis isn't sharp enough yet.

## Step 3 — Verdict
Questions 1 and 2 are unconditional: fail either one → automatic **FAIL**, no exceptions.
Questions 3–6 are judgment calls that can offset each other.

State one of:
- **PASS** — clears the gate. Recommend running `/thesis $ARGUMENTS` next.
- **PASS-WATCH** — real chokepoint and cushion, but 3–6 say "not yet" (priced-in, already
  correlated, or no portfolio room). Recommend logging to the `STRATEGY.md` §3 watchlist
  (same treatment as TDG) instead of a full build — revisit on a pullback or a portfolio-fit
  change. Do not add to `portfolio-data.js` LIMITS unless asked.
- **FAIL** — does not clear 1 or 2. State plainly why, in one or two sentences, and stop.

## Step 4 — Close
One paragraph, no more: the verdict, the single deciding factor, and — if PASS — that the
next step is `/thesis $ARGUMENTS`.
