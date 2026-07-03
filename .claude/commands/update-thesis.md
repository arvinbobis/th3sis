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
In `stocks/$ARGUMENTS/$ARGUMENTS-thesis.html`, update the top config block: as-of date,
current price, history, forward-quarter labels, KPI tags/positions, KPI values, and APPEND
the just-reported quarter to TRACK_ALL (the oldest auto-drops via the fixed window). Update
the dislocation settings only if a new shock occurred.

Write the inputs you just pulled to `stocks/$ARGUMENTS/data/inputs-YYYY-QQ.json` per the
provenance format in CLAUDE.md's data freshness rules (one new file per update, never edit a
past quarter's snapshot).

## Step 3 — Layer 2: AUDIT THE THESIS (do not skip)
For EACH of bear/base/bull, answer honestly:
- **A. Narrative still true?** Has the world overtaken the story? (e.g. a pending ruling that
  resolved, a risk that migrated.) Rewrite if stale.
- **B. Bands moved?** Are the metric × multiple ranges still right? Multiples expand/compress
  with market mood — don't anchor out of habit.
- **C. Triggers moved?** Are these still the right KPIs, or has the real risk relocated?
- **D. Probability shifted?** Which case is most likely NOW? Be willing to say it changed.

## Step 4 — The two habits
- **What would prove me wrong?** Name the kill-switch for the currently-favored case.
- **What surprised me this quarter?** The one thing not seen coming.
Add both to the quarterly log in the checklist file.

## Step 5 — Verify (REQUIRED, not optional)
Run `/verify-thesis $ARGUMENTS`. Fix anything it fails on before closing out — this also
catches the case where refreshing PF_ALERTS in `portfolio-data.js` (if this stock's buy floor
or thesisIntact flag changed) fell out of sync with the local fallback ALERT block.

## Step 6 — Close
Summarize what changed, the new most-probable case, and the key KPI to watch next. Remind:
estimates, not advice; widen bands when uncertain.
