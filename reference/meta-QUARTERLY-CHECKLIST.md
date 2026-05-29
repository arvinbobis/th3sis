# META Thesis — Quarterly Update Checklist

*A pre-flight checklist for your TH3SIS dashboard. Run it every quarter, right after Meta's earnings report — even when nothing looks wrong. The whole point is to catch the quarter where the world quietly moved and your thesis didn't.*

**Earnings calendar reminder:** Meta reports roughly late January / late April / late July / late October. Do this within a week of each print, while the details are fresh.

---

## How this works

There are **two layers** to every update. Most people only do Layer 1 and slowly drift into being wrong. You decided to do both — that's the entire value of this exercise.

- **Layer 1 — Refresh the numbers.** Mechanical. ~15 minutes. Plug in what happened.
- **Layer 2 — Audit the thesis.** Judgment. ~30 minutes. Ask whether the three cases themselves still make sense, or whether reality has overtaken them.

Open `meta-thesis.html` in a text editor. Everything you edit lives in the block at the top marked **"EDIT EVERYTHING IN THIS BLOCK EACH QUARTER."** The numbers below it redraw themselves.

---

## LAYER 1 — Refresh the numbers

Work top to bottom through the edit block. Tick each one.

- [ ] **1. `AS_OF_DATE`** — set to today (format `"YYYY-MM-DD"`). Shows top-right of the dashboard.
- [ ] **2. `NOW_PRICE`** — Meta's current share price.
- [ ] **3. `HISTORY`** — the price line on the main chart. Replace the old `NOW` entry with the just-finished quarter's actual end price (e.g. change `{ q: "NOW", p: 612 }` into `{ q: "Q2 26", p: <whatever> }`), then add a fresh `{ q: "NOW", p: NOW_PRICE }` at the end. Keep the list at a sensible length; drop the oldest if it gets crowded.
- [ ] **4. `FUTURE_Q`** — roll the four forward-quarter labels one step (drop the nearest, add a new one on the end).
- [ ] **6. `PROJ_END` + each case's `target12`** — the bear/base/bull price targets. `PROJ_END` is where each forecast line ends; `target12` is the text label. *(You'll revisit these properly in Layer 2 — for now just note they exist.)*
- [ ] **7. `SIGNALS` and `MARGIN`** — for each row, update the `tag` (`BEAT` / `MATCH` / `MISS` / `WATCH`) based on what the earnings report actually showed, update the `next` field to the next quarter, and nudge `pos` (0 = far bear/left, 1 = far bull/right) to reflect where reality landed.
- [ ] **8. `KPI_HIST` and `KPI_PROJ`** — `KPI_HIST` becomes the latest actual AI-monetization figure; `KPI_PROJ` are your forward guesses for each case.
- [ ] **9. `TRACK_ALL`** — append ONE new entry for the quarter that just reported. Fill in `post` (where price traded after), `reaction` (`+`/`++`/`−`/`−−`), the three bands as they stood at that report date, `landed` (which zone price ended in), and `conf` (`high`). **The oldest quarter drops off automatically** — the dashboard always shows the most recent 6.
- [ ] **10. `DISLOCATION_DATE` etc.** — ONLY touch these if a *new* capex/earnings shock happened this quarter. If so, update the date, the `REVERSION_TROUGH` (the low it hit), and `REVERSION_BASEFLOOR` (bottom of your new base band). If no new shock, leave it — the Reversion Clock keeps tracking the last one.

> **Tip:** after saving, open the file in your browser and hover over a few things to confirm nothing reads "undefined" or looks broken.

---

## LAYER 2 — Audit the thesis *(the part that actually matters)*

This is **step 5 in the edit block: `CASES`.** Do not skip it. For *each* of the three cases, answer four questions out loud (or in writing — see the log at the bottom). One honest sentence each is enough.

### For BEAR, then BASE, then BULL, ask:

**A. Is the narrative still true?**
Read the `op` text for this case. Has the world overtaken it? *(Example that already happened: "a regulatory hit lands in the EU" stopped being a pending event once the ruling actually resolved into a slow compliance review. The narrative had to change.)*
→ If the story is stale, rewrite the `op` and `breaks` text.

**B. Did the price bands move?**
Are the `target12` range and `PROJ_END` still right? Multiples expand and compress with the mood of the market — the same earnings deserve a higher price in a calm market than a panicky one. Don't anchor to last quarter out of habit.
→ Update `PROJ_END` and `target12` if your fair-value math changed.

**C. Did the triggers move?**
Look at this case's `SIGNALS` / `MARGIN` rows. Are these still the *right things to watch*, or has the real risk migrated somewhere new (regulation → capex → a competitor → an AI breakthrough)? The KPIs that mattered a year ago may be answered questions now.
→ Swap out any signal that's become irrelevant for the one that now matters.

**D. Did the probability shift?**
Which case is most likely *now*? Be willing to say it changed. If base was the favorite last quarter but a shock made bear more live, say so.
→ Note it in the log below.

---

## THE TWO HABITS THAT MAKE THIS WORTH DOING

### Habit 1 — "What would prove me wrong?"
For whichever case you currently believe most, write down the **single piece of evidence that would force you to abandon it.** If you can't name one, you don't have a thesis — you have a hope. A real position always has a kill-switch.

### Habit 2 — "What surprised me?"
Write the one thing this quarter you *didn't* see coming. Over a year these four notes become a map of where your model is consistently blind. This is the highest-return sentence you'll write all quarter.

> A caution worth re-reading every time: **this dashboard looks authoritative, and that can fool its own author.** Polish makes a guess feel like a fact. The colored bands are your estimates, not measurements. The reversion pattern rests on a tiny sample. Let the tool organize your thinking — never let it replace it. When in doubt, widen your bands and lower your confidence. An unpredictable world rewards humility, not precision.

---

## QUARTERLY LOG

*Keep a running record. Future-you will learn more from this than from any single chart. Copy the block for each new quarter.*

```
────────────────────────────────────────────
QUARTER: Q_  20__          UPDATED ON: ________
Price at update: $______   Most-likely case: ______

THESIS AUDIT (one line each):
  Bear  — narrative still true? ___  bands moved? ___  why: __________
  Base  — narrative still true? ___  bands moved? ___  why: __________
  Bull  — narrative still true? ___  bands moved? ___  why: __________

PROBABILITY shift this quarter: ____________________________

WHAT WOULD PROVE ME WRONG (for my favored case):
  ________________________________________________________

WHAT SURPRISED ME THIS QUARTER:
  ________________________________________________________
────────────────────────────────────────────
```

### Q2 2026 — (fill in after the July report)
*(your first live entry goes here)*

---

## If you ever outgrow the manual version

The moment updating-by-hand feels like a chore you skip, that's the signal to graduate to an **automated version** — one that pulls Meta's live price and earnings itself and updates without editing. That turns the single HTML file into a small hosted app (needs a data feed/API and somewhere to host it). It's more powerful but more setup. Until then, manual is honestly *better for you*, because the act of typing the numbers in by hand is what forces Layer 2 to actually happen. Automation that skips the thinking would defeat the purpose.

---

*Not financial advice. This is a personal reasoning tool. Every band and probability in it is your own estimate, to be revised freely as the world changes.*
