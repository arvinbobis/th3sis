# ALAB (Astera Labs) Thesis — Quarterly Update Checklist

*A pre-flight checklist for your TH3SIS dashboard. Run it every quarter, right after Astera Labs' earnings report — even when nothing looks wrong. The whole point is to catch the quarter where the world quietly moved and your thesis didn't.*

**Earnings calendar:** Astera Labs reports approximately early February / early May / early August / early November.
**Next report: August 11, 2026** (Q2 2026 results).

---

## How this works

There are **two layers** to every update. Most people only do Layer 1 and slowly drift into being wrong. You decided to do both — that's the entire value of this exercise.

- **Layer 1 — Refresh the numbers.** Mechanical. ~15 minutes. Plug in what happened.
- **Layer 2 — Audit the thesis.** Judgment. ~30 minutes. Ask whether the three cases still make sense, or whether reality has overtaken them.

Open `alab-thesis.html` in a text editor. Everything you edit lives in the block at the top marked **"EDIT EVERYTHING IN THIS BLOCK EACH QUARTER."**

---

## LAYER 1 — Refresh the numbers

Work top to bottom through the config block. Tick each one.

- [ ] **1. `AS_OF_DATE`** — set to today (`"YYYY-MM-DD"`). Shows top-right of the dashboard.

- [ ] **2. `NOW_PRICE`** — Astera Labs' current share price.

- [ ] **3. `HISTORY`** — the price line on the main chart. Replace the old `NOW` entry with the just-finished quarter's actual end price (e.g. change `{ q: "NOW", p: 343 }` into `{ q: "Q2 26", p: <whatever> }`), then add a fresh `{ q: "NOW", p: NOW_PRICE }` at the end.

- [ ] **4. `FUTURE_Q`** — roll the four forward-quarter labels one step forward (drop the nearest, add a new one at the far end). e.g. `["Q2 26","Q3 26","Q4 26","Q1 27"]` → `["Q3 26","Q4 26","Q1 27","Q2 27"]`.

- [ ] **6. `PROJ_END` + each case's `target12`** — the bear/base/bull price endpoints and text labels. *(Revisit properly in Layer 2 — for now just note they exist.)*

- [ ] **7. `SIGNALS` and `MARGIN`** — for each row, update `tag` (`BEAT` / `MATCH` / `MISS` / `WATCH`) based on what the earnings report actually showed. Update the `next` date field. Nudge `pos` (0 = far bear/left, 1 = far bull/right) to reflect where the number landed. Key rows to update:
  - `"Revenue vs Q2 $355–365M Guide"` → did actual Q2 revenue beat/meet/miss?
  - `"Scorpio AI Fabric Design Win Velocity"` → any new customer announcements?
  - `"Leo CXL Production Timeline"` → still qualifying, or did production start?
  - `"Gross Margin %"` → was it above/below 76.3%?
  - `"Non-GAAP Operating Margin"` → was it above/below 36.2%?

- [ ] **8. `KPI_HIST` and `KPI_PROJ`** — `KPI_HIST` becomes the latest actual non-GAAP operating margin figure. `KPI_PROJ` are your forward guesses for each case (bear/base/bull).

- [ ] **9. `TRACK_ALL`** — append ONE new entry for the quarter that just reported. Fill in:
  - `q`: quarter name (e.g. `"Q2 2026"`)
  - `date`: roughly when you're adding it (`"YYYY-MM"`)
  - `post`: where the stock traded after earnings (~1 week post-print)
  - `reaction`: `"+"` / `"++"` / `"−"` / `"−−"` (how the stock moved)
  - `bear` / `base` / `bull`: the three reconstructed price bands as they stood at that date
  - `landed`: which zone the actual price fell in (`"bear"`, `"base"`, `"bull"`, `"base→bull"` etc.)
  - `conf`: `"high"` for this quarter, always
  - **The oldest quarter auto-drops** — the dashboard always shows the most recent 6.

- [ ] **10. `DISLOCATION_DATE` etc.** — ONLY touch these if a *new* deep selloff happened this quarter. If so, update the date, `REVERSION_TROUGH` (the new low), and `REVERSION_BASEFLOOR` (bottom of your new base band). If no new shock, leave it — the clock keeps tracking the June 2025 dislocation as a historical reference.

> **Tip:** after saving, open the file in a browser and hover a few signal bars to confirm nothing reads "undefined." Check the fan chart fans out in the right direction for each scenario.

---

## LAYER 2 — Audit the thesis *(the part that actually matters)*

This is **step 5 in the edit block: `CASES`.** Do not skip it. For *each* of the three cases, answer four questions. One honest sentence each is enough.

### For BEAR, then BASE, then BULL, ask:

**A. Is the narrative still true?**
Re-read the `op` text for each case. Has anything been answered or invalidated?

Key staleness checks for ALAB:
- *Bear*: Is the hyperscaler pause thesis still live, or did Q2 confirm continued spending? Did any competitor announce in-house PCIe switch silicon?
- *Base*: Is Leo CXL still on track for H2 2026 production? Is the multiple compression thesis playing out gently or faster than expected?
- *Bull*: Did any new hyperscaler or CSP announce a Scorpio design win? Did Leo CXL produce any material revenue?

→ If the story is stale, rewrite the `op` and `breaks` text.

**B. Did the price bands move?**
The current bear/base/bull math:
- Bear: FY2027 non-GAAP EPS ~$3.10 × 55x = ~$171 mid | range $130–$185
- Base: FY2027 non-GAAP EPS ~$4.50 × 85x = ~$382 mid | range $330–$430
- Bull: FY2027 non-GAAP EPS ~$6.00 × 105x = ~$630 mid | range $530–$680

Has the EPS consensus moved? Has the market's willingness to pay a given multiple changed? Update `PROJ_END` and `target12` accordingly. Do not anchor to last quarter out of habit.

→ Update `PROJ_END` and `target12` if fair-value math changed.

**C. Did the triggers move?**
The current most-important signals to watch:
1. **Leo CXL production ramp** — any commentary from management on first production shipments, customer names, revenue contribution. This is the single biggest uncertainty.
2. **Revenue growth rate** — is it holding above 80% YoY? Any deceleration in the Q3 2026 guide below $380M?
3. **Customer concentration** — did any new hyperscaler name show up in the top-5?

If a new signal matters more than what's in the dashboard, swap it in.

→ Replace any signal that's become an answered question.

**D. Did the probability shift?**
- Currently most-probable: **BASE**, with upside skew.
- The single re-assessment trigger: if Leo CXL achieves production status and a second hyperscaler names Scorpio, flip to bull.
- If Q3 guide is below $370M or Leo is "still qualifying", flip to bear-leaning base.

→ Note the probability shift in the log below.

---

## THE TWO HABITS THAT MAKE THIS WORTH DOING

### Habit 1 — "What would prove me wrong?"
For whichever case you currently believe most, write down the **single piece of evidence that would force you to abandon it.** Right now, for the base case, that evidence would be:

> *A major hyperscaler announces it has qualified in-house PCIe 6 switch silicon, published in a public roadmap — direct evidence the Scorpio TAM is being commoditized.*

If you can't name a kill-switch for your current view, you don't have a thesis — you have a hope.

### Habit 2 — "What surprised me?"
Write the one thing this quarter that you *didn't* see coming. Over a year, these four entries become a map of where your model is consistently blind. This is the highest-return sentence you'll write all quarter.

> A caution worth re-reading every time: **this dashboard looks authoritative, and that can fool its own author.** Polish makes a guess feel like a fact. The colored bands are your estimates, not measurements. The 114× forward P/E makes every miss a potential multiple collapse. Let the tool organize your thinking — never let it replace it. When in doubt, widen the bands and lower your confidence.

---

## SPECIFIC THINGS TO CHECK AT EACH ALAB EARNINGS CALL

Beyond the headline EPS and revenue numbers, listen for these specific disclosures:

**Revenue mix:**
- What fraction of revenue is Aries (retimers) vs. Scorpio (AI fabric) vs. Leo (CXL) vs. Taurus (cables)?
- Is the retimer cycle maturing (Aries share shrinking) while Scorpio is growing?

**Leo CXL status — most important:**
- Exact language matters: "customer qualifications ongoing," "first production shipments," "initial revenue contribution" — each of these is a distinct milestone. A first revenue number, even $5M, is a thesis-confirming data point.

**Customer concentration:**
- The 10-K/10-Q will disclose whether the top-5 concentration is still at 90%. Any improvement is bullish on diversification risk.

**Q-on-Q guide vs. consensus:**
- Compare the Q+1 revenue midpoint guide to the current consensus. Beat + raise is the pattern to maintain; a guide that is in-line but below whisper expectations is the first warning sign.

**Management language on AI capex cycle:**
- Listen for any language about hyperscaler "pausing," "optimizing," or "consolidating" deployments. This is the most direct early-warning signal for the bear case.

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

### Q2 2026 — (fill in after the August 11 report)
*(your first live entry goes here)*

---

## Quick reference: the valuation math

**Ruler used:** NTM non-GAAP EPS × forward P/E, cross-checked against forward EV/Revenue (P/S).

| Scenario | Assumed NTM EPS | Assumed Multiple | Price midpoint |
|----------|----------------|-----------------|----------------|
| Bear     | $3.10 (FY2027) | 55×             | ~$171          |
| Base     | $4.50 (FY2027) | 85×             | ~$382          |
| Bull     | $6.00 (FY2027) | 105×            | ~$630          |

Current (June 2026): ~$3.00 NTM EPS × 114× = $343. The multiple is the volatility driver — a 30% multiple compression on base EPS still gets you to ~$250 even with growing earnings.

**Why non-GAAP EPS?** Stock-based compensation is substantial at Astera (as with most AI semis). GAAP EPS is materially lower. The sell-side universally models and guides on non-GAAP; using GAAP here would misrepresent how the market actually prices the stock.

---

*Not financial advice. This is a personal reasoning tool. Every band and probability in it is your own estimate, to be revised freely as the world changes.*
