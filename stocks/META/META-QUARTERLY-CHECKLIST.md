# META Thesis — Quarterly Update Checklist

*A pre-flight checklist for your TH3SIS dashboard. Run it every quarter, right after Meta's earnings report — even when nothing looks wrong. The whole point is to catch the quarter where the world quietly moved and your thesis didn't.*

**Earnings calendar reminder:** Meta reports roughly late January / late April / late July / late October. Next print: **~Oct 28, 2026 (Q3 FY2026, unconfirmed date)**. Do this within a week of each print, while the details are fresh.

---

## How this works

There are **two layers** to every update. Most people only do Layer 1 and slowly drift into being wrong. You decided to do both — that's the entire value of this exercise.

- **Layer 1 — Refresh the numbers.** Mechanical. ~15 minutes. Plug in what happened.
- **Layer 2 — Audit the thesis.** Judgment. ~30 minutes. Ask whether the three cases themselves still make sense, or whether reality has overtaken them.

Open `META-thesis.html` in a text editor. Everything you edit lives in the block at the top marked **"EDIT EVERYTHING IN THIS BLOCK EACH QUARTER."** The numbers below it redraw themselves.

*(Note: as of 2026-07-31, META is still on the legacy inline-JSX build — not yet migrated to the `thesis-data.js` engine-split format other stocks use. Migration is optional future work, not part of a routine numbers refresh.)*

---

## LAYER 1 — Refresh the numbers

- [x] **1. `AS_OF_DATE`** — set to today (format `"YYYY-MM-DD"`). Shows top-right of the dashboard.
- [x] **2. `NOW_PRICE`** — Meta's current share price.
- [x] **3. `HISTORY`** — the price line on the main chart. Replace the old `NOW` entry with the just-finished quarter's actual end price, then add a fresh `{ q: "NOW", p: NOW_PRICE }` at the end. Keep the list at a sensible length; drop the oldest if it gets crowded.
- [x] **4. `FUTURE_Q`** — roll the four forward-quarter labels one step (drop the nearest, add a new one on the end).
- [x] **6. `PROJ_END` + each case's `target12`** — the bear/base/bull price targets.
- [x] **7. `SIGNALS` and `MARGIN`** — for each row, update the `tag` (`BEAT` / `MATCH` / `MISS` / `WATCH`) based on what the earnings report actually showed, update the `next` field to the next quarter, and nudge `pos` to reflect where reality landed.
- [x] **8. `KPI_HIST` and `KPI_PROJ`** — `KPI_HIST` becomes the latest actual AI-monetization figure; `KPI_PROJ` are your forward guesses for each case.
- [x] **9. `TRACK_ALL`** — append ONE new entry for the quarter that just reported. The oldest quarter drops off automatically — the dashboard always shows the most recent 6.
- [x] **10. `DISLOCATION_DATE` etc.** — a NEW shock happened this quarter (see below). Updated date, trough, and base floor.

> **Tip:** after saving, open the file in your browser and hover over a few things to confirm nothing reads "undefined" or looks broken.

---

## LAYER 2 — Audit the thesis *(the part that actually matters)*

### For BEAR, then BASE, then BULL, ask:

**A. Is the narrative still true?**
**B. Did the price bands move?**
**C. Did the triggers move?**
**D. Did the probability shift?**
**E. What's the four-call tone trend?**

*(See prior entries / the reference doc at `reference/meta-QUARTERLY-CHECKLIST.md` for the full prompt text on each question — unchanged.)*

---

## THE TWO HABITS THAT MAKE THIS WORTH DOING

### Habit 1 — "What would prove me wrong?"
For whichever case you currently believe most, write down the single piece of evidence that would force you to abandon it.

### Habit 2 — "What surprised me?"
Write the one thing this quarter you didn't see coming.

> A caution worth re-reading every time: **this dashboard looks authoritative, and that can fool its own author.** Polish makes a guess feel like a fact. The colored bands are your estimates, not measurements. The reversion pattern rests on a small sample (now n=3, and the third one has a different character than the first two — see below). Let the tool organize your thinking — never let it replace it. When in doubt, widen your bands and lower your confidence.

---

## QUARTERLY LOG

```
────────────────────────────────────────────
QUARTER: Q_  20__          UPDATED ON: ________
Price at update: $______   Most-likely case: ______

THESIS AUDIT (one line each):
  Bear  — narrative still true? ___  bands moved? ___  why: __________
  Base  — narrative still true? ___  bands moved? ___  why: __________
  Bull  — narrative still true? ___  bands moved? ___  why: __________

PROBABILITY shift this quarter: ____________________________

TONE TREND (last 3–4 calls): improving / stable / eroding
  Evidence: _______________________________________________

WHAT WOULD PROVE ME WRONG (for my favored case):
  ________________________________________________________

WHAT SURPRISED ME THIS QUARTER:
  ________________________________________________________
────────────────────────────────────────────
```

### Q2 2026 — updated 2026-07-31 (Q2 print reported 2026-07-29)

```
────────────────────────────────────────────
QUARTER: Q2  2026          UPDATED ON: 2026-07-31
Price at update: $539.03   Most-likely case: BASE (bear-leaning, band structure lowered)

THESIS AUDIT (one line each):
  Bear  — narrative still true? PARTIALLY — ad demand did NOT degrade (rev +28%,
          ad price +12%, impressions +14%), but the capex-floor-raise + FCF-collapse
          angle the old bear text only gestured at is now the live risk. Rewrote `op`
          to center capital allocation, not demand, as the bear driver.
          bands moved? YES — down to $460-560 (was $480-560), still below-normal multiple
          but anchored to a genuinely lower NTM EPS multiple regime (14x vs prior implicit
          ~15-17x), not a fundamentals collapse.
  Base  — narrative still true? MOSTLY — Family of Apps still a cash machine on revenue,
          AI ad tools still doing real work (ad price +12%), but "margins hold near 41%"
          broke on a GAAP basis (31% actual, though adjusted ex-charges ~43%, +9% YoY
          per CFO). Rewrote to distinguish GAAP-noise margin miss from the real
          capex-vs-FCF tension.
          bands moved? YES — down to $600-700 (was $700-800). This is the key finding:
          the WHOLE multiple structure re-rated down a turn or two, not just this
          quarter's print. Street 12-mo targets (avg ~$733 post-cut) still cluster above
          this band, which is itself informative — Street sees more recovery than my own
          band-anchoring supports; noted as an explicit tension, not resolved by fiat.
  Bull  — narrative still true? YES, unchanged in kind — AI monetization proof is still
          the entire ask, and it did NOT arrive this quarter (Zuckerberg's answers stayed
          directional: "AI is accelerating our core business," no quantified line item).
          bands moved? YES — down to $730-870 (was $900-1015), reflecting the same
          multiple de-rating; requires an explicit AI-revenue disclosure to re-rate back up.

PROBABILITY shift this quarter: Base remains most likely, but with real risk of drifting
  bear-ward if Q3 doesn't show FCF stabilizing — this is NOT the same "pure sentiment
  dislocation, buy the dip" setup as Q3 2025 and Q1 2026. The capex-floor raise (low end
  up, not just high end) is a real commitment, and FCF at ~$0.8B this quarter is a genuine
  data point, not noise.

TONE TREND (last 3–4 calls): eroding on the capex-ROI question specifically. Zuckerberg's
  answers have gone from "that's a very technical question" (Q1 26 call, per April 2026
  Fortune coverage) to "the same data centres will eventually pay their own way" (Q2 26
  call) — still no quantified metric, just increasingly confident-sounding deflection.
  Ad-side commentary (impressions, price-per-ad) stayed concrete and consistent — the
  erosion is specifically on the AI-spend-ROI question, not the core business.

WHAT WOULD PROVE ME WRONG (for BASE, the favored case):
  Two quarters running of FCF failing to stabilize/re-expand even as the one-time legal/
  severance charges roll off AND ad price/impression growth decelerating below +8-9% YoY
  at the same time — i.e., the capex/FCF tension proving structural rather than transient,
  compounding with (not offset by) a genuine demand slowdown. A single quarter of low FCF
  alone isn't enough; the ad engine staying healthy is what currently keeps this at BASE
  rather than BEAR.

WHAT SURPRISED ME THIS QUARTER: The market didn't reward the revenue beat at all — Meta
  beat consensus revenue and still fell ~9% over two sessions, purely on a GAAP EPS miss
  that was ~90% one-time items. That's a materially thinner threshold for "market tolerates
  capex" than the original base-case narrative assumed — it wasn't just about whether ad
  ROI shows up (it did), it was about the capex FLOOR being raised and FCF visibly
  cratering in the same print. The kill-switch as originally written ("demand degrades OR
  AI monetization breaks out") didn't anticipate this third pathway and should be treated
  as refined, not just re-confirmed, going forward.
────────────────────────────────────────────
```

---

## If you ever outgrow the manual version

The moment updating-by-hand feels like a chore you skip, that's the signal to graduate to an **automated version** — one that pulls Meta's live price and earnings itself and updates without editing. Until then, manual is honestly *better for you*, because the act of typing the numbers in by hand is what forces Layer 2 to actually happen.

---

*Not financial advice. This is a personal reasoning tool. Every band and probability in it is your own estimate, to be revised freely as the world changes.*
