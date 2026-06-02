# AVGO (Broadcom) Thesis — Quarterly Update Checklist

*A pre-flight checklist for your TH3SIS dashboard. Run it every quarter, right after Broadcom's earnings report — even when nothing looks wrong. The whole point is to catch the quarter where the world quietly moved and your thesis didn't.*

**Earnings calendar:** Broadcom reports approximately late February / early June / early September / late November. Broadcom fiscal year ends in late October. Do this within a week of each print.

- **Q2 FY2026:** June 3, 2026 (after close)
- **Q3 FY2026:** ~September 2026
- **Q4 FY2026:** ~November/December 2026
- **Q1 FY2027:** ~February 2027

---

## How this works

There are **two layers** to every update. Most people only do Layer 1 and slowly drift into being wrong. You decided to do both.

- **Layer 1 — Refresh the numbers.** Mechanical. ~15 minutes. Plug in what happened.
- **Layer 2 — Audit the thesis.** Judgment. ~30 minutes. Ask whether the three cases themselves still make sense.

Open `avgo-thesis.html` in a text editor. Everything you edit lives in the block marked **"EDIT EVERYTHING IN THIS BLOCK EACH QUARTER."**

---

## LAYER 1 — Refresh the numbers

Work top to bottom through the edit block. Tick each one.

- [ ] **1. `AS_OF_DATE`** — set to today (`"YYYY-MM-DD"`). Shows top-right of the dashboard.

- [ ] **2. `NOW_PRICE`** — AVGO's current share price (post-split, 10:1 split was July 2024).

- [ ] **3. `HISTORY`** — the price line on the main chart. Roll the `NOW` entry into the just-completed quarter (e.g., change `{ q: "NOW", p: 460 }` → `{ q: "Q2 FY26", p: <actual price> }`), then add a fresh `{ q: "NOW", p: NOW_PRICE }` at the end. Drop the oldest entry if the list gets unwieldy.

- [ ] **4. `FUTURE_Q`** — roll the four forward-quarter labels one step. Drop the nearest (`"Q2 FY26"` after Q2 reports), add a new one on the far end (e.g., `"Q2 FY27"`).

- [ ] **6. `PROJ_END` + each case's `target12`** — the bear/base/bull price targets. `PROJ_END` is where each forecast line ends on the chart; `target12` is the text range. *(Revisit properly in Layer 2 — for now just note they exist.)*

- [ ] **7. `SIGNALS` and `MARGIN`** — for each row, update:
  - `tag` → `BEAT` / `MATCH` / `MISS` / `WATCH` based on what the report showed
  - `next` → the next earnings date
  - `pos` → nudge the position (0 = far bear, 1 = far bull) to reflect where the number landed
  - **Key signals to update every quarter:**
    - `AI Revenue vs Q2 Guide` → did it beat, meet, or miss? *(this is the #1 number)*
    - `XPU Customer Count` → any new customer announced?
    - `VMware ARR Growth` → is it accelerating, steady, or decelerating?
    - `Non-GAAP EBITDA Margin` → still 66–68% or has it moved?
    - `AI Revenue Q3 Guidance` → what is the next-quarter AI revenue guide?

- [ ] **8. `KPI_HIST` and `KPI_PROJ`** — `KPI_HIST` becomes the latest actual AI semiconductor revenue ($B); `KPI_PROJ` are your forward estimates for each scenario. Update the dollar values when the trajectory shifts.

- [ ] **9. `TRACK_ALL`** — append ONE new entry for the quarter that just reported:
  ```js
  { q: "Q_ FY__", date: "YYYY-MM", post: <price after earnings>,
    reaction: "++" | "+" | "-" | "--",
    bear: [<low>, <high>], base: [<low>, <high>], bull: [<low>, <high>],
    landed: "bear" | "bear→base" | "base" | "base→bull" | "bull",
    conf: "high" }
  ```
  **The oldest quarter drops off automatically** — the dashboard always shows the most recent 6.

- [ ] **10. `DISLOCATION_DATE` etc.** — ONLY update if a *new* dislocation happened (e.g., AI revenue miss caused a >15% single-day drop). If so, update:
  - `DISLOCATION_DATE` → the date of the shock
  - `REVERSION_TROUGH` → the lowest price reached
  - `REVERSION_BASEFLOOR` → bottom of your updated base band
  - `REVERSION_PRECEDENT_DAYS` → how long you expect recovery to take (based on priors)

> **Tip:** after saving, open the file in a browser and hover over a few things to confirm nothing reads "undefined" or looks broken.

---

## LAYER 2 — Audit the thesis *(the part that actually matters)*

This is `CASES` in the edit block. **Do not skip it.** For each of the three scenarios, answer four questions. One honest sentence each.

### For BEAR, then BASE, then BULL, ask:

**A. Is the narrative still true?**
Read the `op` text for this case. Has the world overtaken it?

*AVGO-specific things that evolve quickly:*
- Did any hyperscaler announce reducing or canceling XPU orders? If yes, the bear narrative becomes live.
- Did a 7th customer materialize? If yes, the bear narrative needs updating.
- Is VMware churn faster or slower than the "mostly sticky" assumption?
- Did Hock Tan adjust the $100B FY2027 AI revenue target?

→ If the story is stale, rewrite the `op` and `breaks` text.

**B. Did the price bands move?**
Are the `target12` range and `PROJ_END` still right? The P/E multiple (currently 33–40x across cases) compresses in a risk-off market and expands when AI spending accelerates.

*AVGO-specific anchors:*
- Bear multiple: 20–24x (where cyclical semis trade in a downcycle)
- Base multiple: 31–34x (where AVGO has traded with stable AI guidance)
- Bull multiple: 38–42x (where the market would price a sticky software platform)

→ Update `PROJ_END` and `target12` if your forward EPS estimate or your assumed multiple changed.

**C. Did the triggers move?**
Are the signal rows still measuring the right things, or has the real risk migrated?

*Watch for:*
- **AI revenue customer mix disclosure** — if Broadcom ever breaks out revenue by customer, concentration risk becomes suddenly quantifiable
- **Marvell winning a Google TPU v7 design** — would directly threaten the bull narrative
- **VMware competitive losses** — if Nutanix or Azure VMware Service start reporting meaningful wins, update the VMware ARR signal direction
- **New capex commitments from hyperscalers** — these are forward signals for AVGO's AI revenue 6–18 months out

→ Swap out any signal that's become an answered question for the one that now matters.

**D. Did the probability shift?**
Which case is most likely *now*? Be willing to say it changed.

*Current assessment (June 2026):* Base with meaningful probability tail toward Bull. The Q2 FY2026 print on June 3 is the first live confirmation of the $10.7B guide.

→ Note any change in the log below.

---

## THE TWO HABITS THAT MAKE THIS WORTH DOING

### Habit 1 — "What would prove me wrong?"
For whichever case you currently believe most, write down the **single piece of evidence that would force you to abandon it.**

*For the current base/bull bias:* Two consecutive AI revenue quarters that are flat or down from the prior quarter — that pattern would confirm a cycle top, not a temporary bump.

### Habit 2 — "What surprised me?"
Write the one thing this quarter you *didn't* see coming. Over a year these four notes become a map of where your model is consistently blind.

*Watch especially for:*
- Customer concentration surprises (a Google or Meta reduction would hurt more than the 1/6 weighting implies)
- VMware churn rate vs. your "mostly sticky" assumption
- The gap between AI revenue guidance and AI revenue actuals (management's visibility is supposedly high — watch if it degrades)

---

> **A caution worth re-reading every time:** this dashboard looks authoritative, and that can fool its own author. The AI revenue trajectory has high forward visibility from multi-year XPU contracts — but "high visibility" is not "certainty." Hyperscalers can renegotiate, pause, or internalize chip design. The $100B FY2027 target has been stated publicly and repeatedly, but it is still a forecast. When in doubt: widen your bands, lower your confidence, and ask what you'd need to see to change your mind.

---

## QUARTERLY LOG

*Keep a running record. Future-you will learn more from this than from any single chart.*

```
────────────────────────────────────────────
QUARTER: Q_  FY____          UPDATED ON: ________
Price at update: $______   Most-likely case: ______

AI Revenue print: $______B   vs guide: $______B   (BEAT / MATCH / MISS)
XPU customer count: ____   VMware ARR growth: ____%   EBITDA margin: ____%
Q3 AI revenue guidance: $______B

THESIS AUDIT (one line each):
  Bear  — narrative still true? ___  bands moved? ___  why: ____________________
  Base  — narrative still true? ___  bands moved? ___  why: ____________________
  Bull  — narrative still true? ___  bands moved? ___  why: ____________________

PROBABILITY shift this quarter: ________________________________________________

WHAT WOULD PROVE ME WRONG (for my favored case):
  _____________________________________________________________________________

WHAT SURPRISED ME THIS QUARTER:
  _____________________________________________________________________________
────────────────────────────────────────────
```

### Q2 FY2026 — June 3, 2026 (fill in after the report)
*(your first live entry goes here)*

---

## Layer 1 quick-reference: where each number comes from

| What to update | Where to find it |
|---|---|
| AI semiconductor revenue ($B) | Broadcom earnings press release — "Semiconductor Solutions: AI revenue" line |
| XPU customer count | CEO commentary on earnings call |
| VMware ARR + growth | Earnings press release — "Infrastructure Software" / "VMware ARR" |
| Non-GAAP EBITDA margin | Earnings press release — non-GAAP adjusted EBITDA ÷ revenue |
| Next-quarter AI guidance | CEO / CFO forward guidance on earnings call |
| AVGO share price | Any financial data provider (post-split; 10:1 split July 2024) |
| Forward EPS consensus | Bloomberg, FactSet, Yahoo Finance analysis tab |

---

*Not financial advice. This is a personal reasoning tool. Every band and probability in it is your own estimate, to be revised freely as the world changes.*
