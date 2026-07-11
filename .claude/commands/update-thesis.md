---
description: Roll an existing stock thesis forward after a new earnings report
---

You are updating the existing thesis for: **$ARGUMENTS**

Follow the QUARTERLY-UPDATE-CHECKLIST for this stock and the methodology in CLAUDE.md.

## Step 1 — Pull fresh data first (REQUIRED)
Search for the latest on $ARGUMENTS: the just-reported quarter's actual results, current
price, updated consensus estimates and targets, new guidance/capex, and any regulatory or
competitive shifts since last update. Never rely on memory.

## Step 2 — Layer 1: refresh the numbers
**If this stock has `stocks/$ARGUMENTS/thesis-data.js`** (migrated to the engine split —
check first), edit that file: as-of date, current price, history, forward-quarter labels,
KPI tags/positions, KPI values, and APPEND the just-reported quarter to TRACK_ALL (the
oldest auto-drops via the fixed window). Update the dislocation settings only if a new
shock occurred. Do not touch `stocks/engine/thesis-engine.jsx` for a normal numbers refresh.

**If it doesn't have a `thesis-data.js` yet** (not yet migrated), do the numbers refresh in
the existing inline config block as before — a routine quarterly update should stay fast, not
absorb a structural migration by default. Migration is a real, separate piece of work (extract
every narrative/tooltip string losslessly into `thesis-data.js`'s `TEXT` object, per
`stocks/tsm/thesis-data.js` + `stocks/tsm/tsm-thesis.html` as templates); offer it to the user
as an option for this stock rather than doing it automatically, and only proceed if they say
yes. If the stock is on the `LEGACY_HEX_TICKERS` list, migrating doesn't fix the palette —
that stays a separate future touch either way.

Write the inputs you just pulled to `stocks/$ARGUMENTS/data/inputs-YYYY-QQ.json` per the
provenance format in CLAUDE.md's data freshness rules (one new file per update, never edit a
past quarter's snapshot). Include `multiple_peer_median` with the comps named in `src` — the
peer anchor is what catches a whole-group re-rating that own-history anchoring would miss.

## Step 3 — Layer 2: AUDIT THE THESIS (do not skip)

**Before rewriting anything: archive the outgoing version.** If this stock has
`thesis-data.js` with a `THESIS_HISTORY` array, push a new entry with the CURRENT (about to
be superseded) `CASES.{bear,base,bull}.{target12,op,breaks,requires01,requires02}` — tagged
`{ asOf: <today>, quarter: <the quarter that just reported> }` — before Step A below touches
any of that text. If `THESIS_HISTORY` doesn't exist yet on this stock, create it with that
one entry now (see `stocks/tsm/thesis-data.js` for the shape). Never edit a past
`THESIS_HISTORY` entry after the fact — same append-only discipline as `TRACK_ALL` and the
`inputs-YYYY-QQ.json` provenance snapshots. This is what lets "what did I actually believe
last quarter" be answered by reading the file, not by digging through git log.

For EACH of bear/base/bull, answer honestly:
- **A. Narrative still true?** Has the world overtaken the story? (e.g. a pending ruling that
  resolved, a risk that migrated.) Rewrite if stale.
- **B. Bands moved?** Are the metric × multiple ranges still right? Multiples expand/compress
  with market mood — don't anchor out of habit.
- **C. Triggers moved?** Are these still the right KPIs, or has the real risk relocated?
- **D. Probability shifted?** Which case is most likely NOW? Be willing to say it changed.
- **E. Tone trend (multi-quarter, not just this call).** Compare management's commentary on
  the thesis-critical topics across the last 3–4 earnings calls: more or less confident?
  Hedging language creeping in ("we continue to believe…", guidance qualifiers, dropped
  specifics)? A single call can read fine while the four-call trend deteriorates — grade the
  trend, and if it contradicts the KPI tags, say so in the log. For stocks riding a demand
  boom, also apply CLAUDE.md's pull-forward test here: is management describing demand that
  extends the runway, or demand being pulled forward from it?

## Step 4 — The two habits
- **What would prove me wrong?** Name the kill-switch for the currently-favored case.
- **What surprised me this quarter?** The one thing not seen coming.
Add both to the quarterly log in the checklist file.

## Step 5 — Scorecard
Run `/scorecard $ARGUMENTS`. This grades whatever standing prediction existed BEFORE this
update against what just landed (the only non-hindsight-biased calibration number the system
produces), then regenerates the band-coverage data and captures the new most-likely case you
just wrote in Step 3.D as the standing prediction for next time.

## Step 6 — Verify (REQUIRED, not optional)
For a migrated stock, `node tools/lint-thesis-data.js $ARGUMENTS` is a sub-second, no-browser
check worth running after each edit to `thesis-data.js`. Either way, run the full
`/verify-thesis $ARGUMENTS` before closing out — for a migrated stock this runs that lint
automatically plus a Playwright render pass; for a not-yet-migrated stock it's the original
inline-HTML checks. Fix anything it fails on — this also catches the case where refreshing
PF_ALERTS in `portfolio-data.js` (if this stock's buy floor or thesisIntact flag changed)
fell out of sync with the local/data-file fallback ALERT block.

## Step 7 — Close
Summarize what changed, the new most-probable case, and the key KPI to watch next. Remind:
estimates, not advice; widen bands when uncertain.
