# MRVL (Marvell Technology) Thesis — Quarterly Update Checklist

*A pre-flight checklist for your TH3SIS dashboard. Run it every quarter, right after Marvell's earnings report. Marvell's fiscal year ends in late January.*

**Earnings calendar (Marvell fiscal year convention):**
- **Q2 FY2027:** ~late August 2026
- **Q3 FY2027:** ~late November 2026
- **Q4 FY2027:** ~late February/March 2027
- **Q1 FY2028:** ~late May/June 2027

Do this within a week of each print, while the details are fresh.

---

## How this works

There are **two layers** to every update. Most people only do Layer 1 and slowly drift into being wrong. You decided to do both.

- **Layer 1 — Refresh the numbers.** Mechanical. ~15 minutes. Plug in what happened.
- **Layer 2 — Audit the thesis.** Judgment. ~30 minutes. Ask whether the three cases themselves still make sense.

Open `mrvl-thesis.html` in a text editor. Everything you edit lives in the block marked **"EDIT EVERYTHING IN THIS BLOCK EACH QUARTER."**

---

## LAYER 1 — Refresh the numbers

Work top to bottom through the edit block. Tick each one.

- [ ] **1. `AS_OF_DATE`** — set to today (`"YYYY-MM-DD"`).

- [ ] **2. `NOW_PRICE`** — MRVL's current share price.

- [ ] **3. `HISTORY`** — Roll the `NOW` entry into the just-completed quarter (e.g., `{ q: "NOW", p: 219 }` → `{ q: "Q2 FY27", p: <actual> }`), then add a fresh `{ q: "NOW", p: NOW_PRICE }` at the end.

- [ ] **4. `FUTURE_Q`** — Roll the four forward-quarter labels one step (drop the nearest `"Q2 FY27"` after Q2 reports, add a new one on the far end: `"Q2 FY28"`).

- [ ] **6. `PROJ_END` + each case's `target12`** — the bear/base/bull price targets. *(Revisit properly in Layer 2.)*

- [ ] **7. `SIGNALS` and `MARGIN`** — update `tag`, `next`, `val`, and `pos` for each row based on what the earnings report showed. Key rows to update each quarter:
  - `Data Center Revenue vs Guide` → did it beat, meet, or miss the implied DC target? *(most critical)*
  - `FY2028 $16.5B Target` → did management reaffirm, raise, or soften this target?
  - `XPU Design Win Ramp` → how many of the 18 design wins are now in production vs. design phase?
  - `Non-GAAP Gross Margin` → 58%+, 60%+, or compressing below 57%?
  - `NVLink Fusion Revenue` → any quantification of the NVIDIA partnership revenue?

- [ ] **8. `KPI_HIST` and `KPI_PROJ`** — `KPI_HIST` becomes the latest actual data center revenue ($B); `KPI_PROJ` are your forward estimates for each scenario.

- [ ] **9. `TRACK_ALL`** — append ONE new entry:
  ```js
  { q: "Q_ FY__", date: "YYYY-MM", post: <price after earnings>,
    reaction: "++" | "+" | "-" | "--",
    bear: [<lo>, <hi>], base: [<lo>, <hi>], bull: [<lo>, <hi>],
    landed: "bear" | "bear→base" | "base" | "base→bull" | "bull",
    conf: "high" }
  ```
  The oldest quarter drops automatically — dashboard always shows the most recent 6.

- [ ] **10. `DISLOCATION_DATE` etc.** — Only update if a *new* dislocation happened (e.g., DC revenue miss caused >15% single-day drop). If so: update `DISLOCATION_DATE`, `REVERSION_TROUGH`, `REVERSION_BASEFLOOR`, `REVERSION_PRECEDENT_DAYS`.

> **Tip:** after saving, open in a browser and hover a few elements to confirm nothing reads "undefined."

---

## LAYER 2 — Audit the thesis *(the part that actually matters)*

This is `CASES` in the edit block. For each of the three scenarios, answer four questions.

### For BEAR, then BASE, then BULL:

**A. Is the narrative still true?**
Read the `op` text. Has the world overtaken it?

*MRVL-specific things that shift quickly:*
- How many of the 18 XPU design wins have moved from "won" to "in production"? If 8+ are ramping, the bear case weakens dramatically. If only 2-3 are ramping by Q4 FY2027, the FY2028 $16.5B target is in jeopardy.
- Has the NVIDIA NVLink Fusion relationship generated any quantified revenue? If yes, update the bull narrative.
- Has Broadcom announced a win at a customer previously exclusive to MRVL in optical DSP? If yes, update the bear narrative.
- Did management adjust the $16.5B FY2028 target — in either direction?

→ If the story is stale, rewrite the `op` and `breaks` text.

**B. Did the price bands move?**
At 56× FY2027 EPS, MRVL's multiple is highly sensitive to estimate changes. Consider:
- If FY2027 EPS consensus has moved significantly since June 2026, recalculate the bear/base/bull EPS × multiple math
- Bear multiple anchor: 22–25× (hardware cyclical discount on missed targets)
- Base multiple anchor: 31–34× (premium AI compounder, $16.5B target credible)
- Bull multiple anchor: 38–42× (platform re-rating if NVLink Fusion adds a second growth vector)

→ Update `PROJ_END` and `target12` if the math changed.

**C. Did the triggers move?**
Has the real risk migrated?

*Watch for new risk sources:*
- **Customer concentration disclosure:** if Marvell ever breaks out revenue by customer, single-customer risk becomes quantifiable
- **Google inference chip timeline:** this is a new design (separate from Broadcom TPU work) — when it enters production is a specific bull catalyst to track
- **Celestial AI photonics integration:** the $3.25B acquisition — is the photonics revenue showing up in DC revenue or still in pre-revenue ramp?
- **Competition from in-house:** if Amazon or Google announce they're taking chip design back in-house for a specific workload, that directly threatens the 18-wins pipeline

→ Swap any signal that's become an answered question for the one that now matters.

**D. Did the probability shift?**
*Current assessment (June 2026):* BASE, leaning cautious. The stock has tripled YTD and is priced at 56× FY2027 EPS. The FY2027 $11.5B target has credible support from Q1+Q2 (=$5.1B in first half). The $16.5B FY2028 target is the stretch. No margin of safety.

→ Note any change in the log below.

---

## THE TWO HABITS THAT MAKE THIS WORTH DOING

### Habit 1 — "What would prove me wrong?"
For the current base/cautious stance: **Two consecutive data center revenue quarters that miss the implied trajectory — or one quarter where management explicitly reduces the FY2028 $16.5B target.** Either of those would force a full re-evaluation at a stock price that allows no room for downward revision.

### Habit 2 — "What surprised me?"
Write the one thing this quarter you didn't see coming. Over a year these four notes become a map of where your model is consistently blind.

*Watch especially for:*
- How fast the XPU design wins actually ramp vs. what you expected — custom chip timelines are famously slippery
- Whether NVLink Fusion generates revenue at all in FY2027 — the partnership was announced but revenue is still a "watch"
- Broadcom's response in optical DSP — they're attacking MRVL's 70–80% market share; any share shift is a signal

---

> **A caution worth re-reading every time:** the "18 design wins" narrative sounds impressive but the gap between signed contracts and chips in volume production is where theses die. Custom chip programs routinely slip 6–12 months. This dashboard's bull scenario requires nearly simultaneous production ramps. The polish of the output makes execution feel more certain than it is. Hold the bands loosely and track the XPU ramp count every quarter — not just the total revenue line.

---

## QUARTERLY LOG

```
────────────────────────────────────────────
QUARTER: Q_  FY____          UPDATED ON: ________
Price at update: $______   Most-likely case: ______

DC revenue: $______B    vs implied: $______B    (BEAT / MATCH / MISS)
XPU programs in production: _____ of 18   Gross margin: _____%
FY2028 $16.5B target: REAFFIRMED / RAISED / SOFTENED / REVISED
Q3 guidance total revenue: $______B    NVLink Fusion revenue disclosed: Y/N

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

### Q2 FY2027 — late August 2026 (fill in after the report)
*(your first live entry goes here)*

---

## Layer 1 quick-reference: where each number comes from

| What to update | Where to find it |
|---|---|
| Data center revenue ($B) | Earnings press release — "Data Center" end market revenue |
| XPU programs in production | CEO/CFO commentary on earnings call; press releases |
| FY2028 $16.5B target status | CEO commentary + formal guidance language |
| Non-GAAP gross margin | Earnings press release — non-GAAP gross profit ÷ revenue |
| NVLink Fusion revenue | Earnings call — any quantification of NVIDIA partnership revenue |
| Q3 guidance (total revenue) | Earnings press release — forward guidance section |
| MRVL share price | Any financial data provider |
| Forward EPS consensus (FY2027/28) | Bloomberg, FactSet, Yahoo Finance analysis tab |

---

*Not financial advice. This is a personal reasoning tool. Every band and probability in it is your own estimate, to be revised freely as the world changes. The "18 design wins" are the key variable — track production ramp count quarterly, not just headline revenue.*
