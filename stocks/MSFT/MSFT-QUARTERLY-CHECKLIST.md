# MSFT (Microsoft) Thesis — Quarterly Update Checklist

*A pre-flight checklist for your TH3SIS dashboard. Run it every quarter, right after Microsoft's earnings report. Microsoft's fiscal year ends June 30.*

**Earnings calendar:**
- **Q4 FY2026:** July 28, 2026 (after close) ← next catalyst, ~55 days away
- **Q1 FY2027:** ~late October 2026
- **Q2 FY2027:** ~late January 2027
- **Q3 FY2027:** ~late April 2027

Do this within a week of each print, while the details are fresh.

---

## How this works

There are **two layers** to every update. Most people only do Layer 1 and slowly drift into being wrong.

- **Layer 1 — Refresh the numbers.** Mechanical. ~15 minutes.
- **Layer 2 — Audit the thesis.** Judgment. ~30 minutes. The capex ROI question is slow-moving but decisive — Layer 2 is where you catch the shift before it's in the stock price.

Open `MSFT-thesis.html` in a text editor. Everything you edit lives in the block marked **"EDIT EVERYTHING IN THIS BLOCK EACH QUARTER."**

---

## LAYER 1 — Refresh the numbers

- [ ] **1. `AS_OF_DATE`** — set to today (`"YYYY-MM-DD"`).

- [ ] **2. `NOW_PRICE`** — MSFT's current share price.

- [ ] **3. `HISTORY`** — Roll `NOW` into the just-completed quarter (e.g., change `{ q: "NOW", p: 441 }` → `{ q: "Q4 FY26", p: <actual Q4 close> }`), then add a fresh `{ q: "NOW", p: NOW_PRICE }` at the end.

- [ ] **4. `FUTURE_Q`** — Roll one step. Drop `"Q4 FY26"` and add `"Q4 FY27"` on the far end.

- [ ] **5. `CASES`** — *(Layer 2 — do not skip)*

- [ ] **6. `PROJ_END` + each case's `target12`** — *(Revisit in Layer 2.)*

- [ ] **7. `SIGNALS` and `MARGIN`** — update after Q4 FY2026 (July 28). Key rows:
  - `Azure Growth vs 39–40% Guide` → did it beat, meet, or miss? **This is the primary signal.**
  - `Copilot Paid Seat Growth` → report actual seat count from the earnings call.
  - `AI Business ARR` → what did management say the new ARR is?
  - `Operating Margin` → is margin trending up or down vs. Q3's ~47%?
  - `CapEx / Revenue Ratio` → is the ratio shrinking (good) or growing (bad)?
  - Update ALL `next` fields to the next earnings date (~late October 2026 for Q1 FY2027).

- [ ] **8. `KPI_HIST` and `KPI_PROJ`** — `KPI_HIST` becomes Q4 actual Azure growth (% YoY). Update `KPI_PROJ` based on Q1 FY2027 Azure guidance given on the call.

- [ ] **9. `TRACK_ALL`** — append ONE new entry for Q4 FY2026:
  ```js
  { q: "Q4 FY26", date: "2026-07", post: <stock price after earnings>,
    reaction: "++" | "+" | "-" | "--",
    bear: [<lo>, <hi>], base: [<lo>, <hi>], bull: [<lo>, <hi>],
    landed: "bear" | "base" | "bull" | ...,
    conf: "high" }
  ```
  The oldest quarter drops automatically — dashboard always shows the most recent 6.

- [ ] **10. `DISLOCATION_DATE` etc.** — Update only if a *new* dislocation happened. The current clock tracks the April 29 capex selloff. If Q4 earings cause another drop, update to that new date, trough, and base floor.

> **Tip:** after saving, open in a browser and hover a few elements to confirm nothing reads "undefined."

---

## LAYER 2 — Audit the thesis *(the part that actually matters)*

### For BEAR, then BASE, then BULL:

**A. Is the narrative still true?**

*MSFT-specific questions to answer every quarter:*
- **Did Azure guidance change direction?** The base case requires 38–40% sustained. If management guides below 35% for Q1 FY2027, update the narrative to bear-leaning immediately.
- **Copilot seat trajectory:** 20M seats in Q3. Are we tracking toward the base case's 40–50M, or is growth stalling? Any enterprise reports of Copilot removal/downgrade are early bear signals to catch here.
- **The $190B capex narrative:** Is management still defending it? Any sign of capex reduction (now vs. next year) would shift the multiple from "infrastructure" back toward "platform." Conversely, any further increase would deepen the bear case.
- **AI ARR growth rate:** $37B at 123% YoY in Q3. Is the percentage growth decelerating (expected) or accelerating (bull)? A rate below 80% YoY would signal that AI monetization is not scaling as fast as the investment.
- **Open source / competitive pressure:** Did Google Cloud or AWS announce a major Azure win-back? Did any major enterprise publicly credit open-source models for reducing Azure AI spend? These are early-warning observables.

→ If narratives have changed, rewrite the `op` and `breaks` text.

**B. Did the price bands move?**
*MSFT-specific anchors:*
- Bear multiple: 18–20× (infrastructure-company framing on margin compression)
- Base multiple: 24–26× (premium software platform, AI monetizing at a measured pace)
- Bull multiple: 28–30× (dominant AI stack, re-rating to platform premium)

At each earnings: recalculate EPS with updated margin trajectory. If Azure decelerates, both the EPS estimate AND the multiple should move down — double-count this, don't single-count.

→ Update `PROJ_END` and `target12` if the multiple or earnings narrative shifted.

**C. Did the triggers move?**
After July 28, the Q4 FY2026 signals are answered. New questions for Q1 FY2027 (October):
- **Copilot agents:** Has Microsoft disclosed revenue from Copilot agent workflows (distinct from per-seat licensing)? This is the new bull monetization vector — if it appears, update the bull signals.
- **Azure capacity constraints:** Are there any reports of customers being unable to get Azure AI capacity? If yes, that's a bull signal (demand exceeds supply). If no, and Q4 beats, it means supply is adequate — good for base.
- **Competitor moves:** Google Cloud announcing major enterprise Azure migrations, or AWS expanding their AI model breadth, would shift the bear narrative.
- **Regulatory:** Any EU AI regulation that specifically disadvantages Copilot (privacy, data sovereignty) would be a bear signal, particularly for Productivity and Business Process segment.

→ Swap any answered question in `SIGNALS` for the live one.

**D. Did the probability shift?**
*Current assessment (June 2026):* BASE with meaningful bull probability. The capex selloff has created a setup where the base case offers genuine upside (+16%), unlike most of the portfolio.

→ Note any change in the log below.

---

## THE TWO HABITS THAT MAKE THIS WORTH DOING

### Habit 1 — "What would prove me wrong?"
For the current base/bull bias: **Azure decelerating below 35% YoY in Q4, or Copilot seat count failing to reach 25M.** Either of those on July 28 would shift the thesis to bear — not "let's wait another quarter," but an immediate reassessment of whether the $190B capex is generating the revenue velocity the base case requires.

### Habit 2 — "What surprised me?"
Write the one thing this quarter you didn't see coming. For MSFT, surprises tend to be:
- Copilot adoption speed (faster or slower than modeled)
- Azure capacity constraints (never expected — a bull signal)
- A major enterprise publicly citing Copilot productivity data (bull)
- Open-source model replacing Azure AI workloads at a named company (bear)
- Margin better/worse than modeled given the capex

---

> **A caution worth re-reading every time:** Microsoft's quality can make the bear case feel unrealistic. But $190B annual capex — roughly 56% of annual revenue — is historically extreme for any tech company, including Microsoft at its own cloud buildout peak. The bear case is not "Microsoft fails." It's "the ROI timeline disappoints investor expectations while the market re-rates the multiple." Even a 15% margin compression alone is worth a 20–25% stock decline at the current multiple. Quality companies are not immune to multiple compression on unexpected capex cycles.

---

## QUARTERLY LOG

```
────────────────────────────────────────────
QUARTER: Q_  FY____          UPDATED ON: ________
Price at update: $______   Most-likely case: ______

Azure growth: _____%   vs guide _____%: (BEAT / MATCH / MISS)
Copilot paid seats: ______M   AI ARR: $______B (+____% YoY)
Operating margin: _____%   Q1 FY27 Azure guidance: _____%
Management language on capex ROI: (CONFIDENT / NEUTRAL / HEDGING)
Capex for next quarter: $______B

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

### Q4 FY2026 — July 28, 2026 (fill in after the report)
*(your first live entry goes here)*

---

## Layer 1 quick-reference: where each number comes from

| What to update | Where to find it |
|---|---|
| Azure + other cloud growth (% YoY) | Earnings press release — "More Personal Computing / Intelligent Cloud" segment breakdown; Azure specifically called out in management commentary |
| Copilot paid seat count | Earnings call transcript — CEO Satya Nadella typically cites this directly |
| AI ARR ($B) | Earnings call — "Microsoft AI" business metric; sometimes press release |
| Operating margin | Earnings press release — consolidated operating income ÷ revenue |
| Q1 FY2027 Azure growth guidance | CFO guidance section of earnings call |
| CapEx for the quarter | Earnings press release — cash flow statement |
| MSFT share price | Any financial data provider |
| Forward EPS consensus (FY2027/28) | Bloomberg, FactSet, Yahoo Finance analysis tab |

---

*Not financial advice. This is a personal reasoning tool. Every band and probability is your own estimate. The $190B capex is an extraordinary commitment — watch every quarter to see if the Azure and AI ARR data vindicates it. Update immediately if the data changes direction.*
