---
description: Grade the previous standing prediction and regenerate the calibration scorecard
---

Run this for: **$ARGUMENTS** — as the last step of `/update-thesis $ARGUMENTS`, after
TRACK_ALL has already had this quarter's row appended and the checklist's quarterly log has
already been filled in for this update.

## Step 1 — Grade the standing prediction, if one exists

Open `stocks/portfolio/scorecard-data.js` and check `PF_PREDICTIONS.$ARGUMENTS`. If it's
undefined, skip to Step 2 — there's nothing to grade yet (this is this stock's first tracked
prediction).

If it exists, compare it against the row you just appended to `TRACK_ALL`:
- `PF_PREDICTIONS.$ARGUMENTS.case` (e.g. `"BASE"`) is what was predicted, before this
  quarter's print, for how this quarter would land.
- The new `TRACK_ALL` entry's `landed` field is what actually happened.
- `matched` = the predicted case appears in `landed` (a landed value like `"bear→base"`
  counts as matching a prediction of `"BASE"` — a transition INTO the predicted zone is a
  match; landing in an unrelated zone is not).

Append one entry to `PF_GRADED` in `stocks/portfolio/scorecard-data.js`:
```js
{ t: "$ARGUMENTS", predictedAt: "<PF_PREDICTIONS.$ARGUMENTS.asOf>",
  predictedCase: "<PF_PREDICTIONS.$ARGUMENTS.case>",
  gradedQuarter: "<the new TRACK_ALL quarter label>", landed: "<its landed value>",
  matched: true|false }
```

This is the only calibration number in the whole system that isn't hindsight-biased — the
prediction was locked in before the outcome existed. Don't skip it, and don't reconstruct one
retroactively for a stock that doesn't already have a `PF_PREDICTIONS` entry — that would be
exactly the bias this page exists to avoid.

## Step 2 — Regenerate the mechanical parts

Run:
```
node tools/build-scorecard.js
```
This rebuilds `PF_SCORECARD` (band coverage, from every thesis's `TRACK_ALL`) and refreshes
`PF_PREDICTIONS.$ARGUMENTS` from this stock's checklist log — picking up the NEW "Most-likely
case" you just wrote for the upcoming period. It writes the file directly and **preserves
`PF_GRADED`** automatically (it reads the existing file's `PF_GRADED` before regenerating and
carries it forward) — so Step 1's edit survives this regardless of order, but do Step 1
first anyway since it's clearer to grade the old prediction before looking at the new one.

## Step 3 — Verify

Open `stocks/portfolio/calibration.html` and confirm: the new quarter shows up in the band
coverage table, the standing prediction under "Standing Predictions" reflects the NEW
most-likely case (not the one you just graded), and — if Step 1 applied — the graded
transition appears under "Prospectively Graded" with the right MATCH/MISS call.
