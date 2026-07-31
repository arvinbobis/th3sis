# MSFT (Microsoft) Thesis — Quarterly Update Checklist

*A pre-flight checklist for your TH3SIS dashboard. Run it every quarter, right after Microsoft's earnings report. Microsoft's fiscal year ends June 30.*

**Earnings calendar:**
- **Q4 FY2026:** reported July 29, 2026 (after close) — DONE, audited below
- **Q1 FY2027:** ~late October 2026 ← next catalyst
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
- **The FY2027 $255–260B capex narrative** (raised from $190B FY2026 as of the Q4 FY2026 print): Is management still defending it? Any sign of capex moderation would shift the multiple from "infrastructure" back toward "platform." Conversely, any further increase would deepen the bear case. Watch free cash flow as a share of revenue as the tiebreaker — Q4 FY2026 FCF fell to $19.6B on the ramp.
- **AI ARR growth rate:** $37B at 123% YoY in Q3. Is the percentage growth decelerating (expected) or accelerating (bull)? A rate below 80% YoY would signal that AI monetization is not scaling as fast as the investment.
- **Open source / competitive pressure:** Did Google Cloud or AWS announce a major Azure win-back? Did any major enterprise publicly credit open-source models for reducing Azure AI spend? These are early-warning observables.

→ If narratives have changed, rewrite the `op` and `breaks` text.

**B. Did the price bands move?**
*MSFT-specific anchors (updated 2026-07-31 after Q4 FY2026):*
- Bear multiple: 18–20× (infrastructure-company framing, now hinging on FCF compression more than growth deceleration)
- Base multiple: 23–25× (nudged down from 24-26x — peer median forward P/E, GOOGL/META/AMZN, sits at ~22x and hasn't moved, so don't expand the base multiple on an MSFT-specific beat alone)
- Bull multiple: 27–29× (dominant AI stack, re-rating to platform premium)

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
*Current assessment (2026-07-31, post Q4 FY2026):* BASE-to-BULL. Azure and Copilot both individually cleared the OLD bull-case thresholds this quarter (43% actual / ~45% guided vs. the old "beats 41%+" bull bar; 30M+ seats vs. the old "≥32M" bull bar). The kill-switch this thesis was tracking since April — "Azure decelerates below 35% in any quarter" — did not just fail to trigger, Azure *accelerated* for two consecutive quarters. That is a real, not cosmetic, shift toward bull. It is not a full bull flip because the FY2027 capex guide jumped to $255–260B (from $190B) in the same release — a materially larger bet than the one this thesis was auditing in June — and free cash flow already compressed to $19.6B in Q4 on the ramp. The base case is validated; the bull case is live and requires the next print to keep confirming.

→ Note any change in the log below.

---

## THE TWO HABITS THAT MAKE THIS WORTH DOING

### Habit 1 — "What would prove me wrong?"
For the current base-to-bull bias (updated 2026-07-31): **Azure decelerating below 36% YoY in Q1 FY2027, OR free cash flow continuing to compress as a share of revenue with no stabilization by Q2 FY2027.** The growth-deceleration kill-switch that anchored this thesis through the April selloff is retired — it was tested twice (Q3 and Q4 FY2026) and failed to trigger both times. The kill-switch that replaces it is about cash conversion, not growth optics: the FY2027 capex guide ($255–260B) is large enough that even continued strong Azure/Copilot growth doesn't matter if FCF keeps falling.

### Habit 2 — "What surprised me?"
Write the one thing this quarter you didn't see coming. For MSFT, surprises tend to be:
- Copilot adoption speed (faster or slower than modeled) — Q4's seat count more than doubling sequentially (20M→30M+) was faster than the base case's own 25-30M expectation
- Azure capacity constraints (never expected — a bull signal)
- A major enterprise publicly citing Copilot productivity data (bull)
- Open-source model replacing Azure AI workloads at a named company (bear)
- Margin better/worse than modeled given the capex
- The FY2027 capex guide jumping to $255–260B (vs. the $190B already treated as extreme) — a genuine surprise in scale, landing in the same release as the growth beat

---

> **A caution worth re-reading every time:** Microsoft's quality can make the bear case feel unrealistic. But FY2027 capex guided to $255–260B — an estimated ~65% of FY2027 revenue, up from ~56% in FY2026 — is historically extreme for any tech company, including Microsoft at its own cloud buildout peak. The bear case is not "Microsoft fails" or even "Azure decelerates" (that already happened in reverse — it accelerated). It's "the cash-conversion timeline disappoints investor expectations while the market re-rates the multiple down for capex intensity." Even a 15% margin compression alone is worth a 20–25% stock decline at the current multiple. Quality companies are not immune to multiple compression on unexpected capex cycles.

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

### Q4 FY2026 — reported July 29, 2026
```
────────────────────────────────────────────
QUARTER: Q4  FY2026          UPDATED ON: 2026-07-31
Price at update: $451.10   Most-likely case: BASE-to-BULL

Azure growth: 43%   vs guide 39-40%: (BEAT)
Copilot paid seats: 30M+   AI ARR: $37B (+123% YoY, last disclosed Q3 -- NOT re-stated this call)
Operating margin: 45.1%   Q1 FY27 Azure guidance: ~45% cc
Management language on capex ROI: (CONFIDENT -- raised FY2027 capex to $255-260B in the same release as the beat,
  framed as demand-driven not cost-driven; also extended DC/office useful life 15yr->25yr, a real accounting tailwind)
Capex for next quarter: >$50B (Q1 FY2027 guide, includes lease-reclassification effect)

THESIS AUDIT (one line each):
  Bear  — narrative still true? NO (deceleration thesis broke; replaced with FCF/capex-intensity risk)  bands moved? YES ($310-395 -> $325-400)  why: Azure accelerated 2 quarters straight instead of decelerating; new risk is cash conversion vs. the $255-260B FY27 capex, not growth
  Base  — narrative still true? YES, validated  bands moved? YES ($460-560 -> $475-565)  why: Azure/Copilot both beat base assumptions; band shifted up on stronger EPS base, multiple held flat vs. peer median (~22x) rather than expanded
  Bull  — narrative still true? YES, now live  bands moved? YES ($620-720 -> $650-760)  why: actual Q4 print + Q1 FY27 guide both individually clear the OLD bull thresholds (Azure >=42%, Copilot >=32M) -- bull case requires this to keep confirming, not a one-quarter read

PROBABILITY shift this quarter: BASE -> BASE-to-BULL. Azure decelerating below 35% was the standing kill-switch since April; it was tested and failed to trigger twice (Q3: accel to 40%, Q4: accel to 43%, guided 45%). Retired that kill-switch, replaced with an FCF/capex-intensity trigger given the FY2027 capex guide jumped to $255-260B in the same release.

WHAT WOULD PROVE ME WRONG (for the base-to-bull case):
  Azure decelerating below 36% in Q1 FY2027, OR free cash flow continuing to compress as a share of revenue with no stabilization by Q2 FY2027 -- the capex bet ($255-260B) is now large enough that growth beats alone don't settle the bear case.

WHAT SURPRISED ME THIS QUARTER:
  Two things, pulling in opposite directions: (1) Copilot seat net-adds more than doubling sequentially (20M->30M+) was faster than even the base case's own 25-30M expectation. (2) The FY2027 capex guide jumping to $255-260B -- roughly 35% higher than the $190B already treated as an extreme commitment in April -- landed in the SAME release as the beat, which is why the stock, even after a 15.5% single-day pop, still sits below the pre-print base-band floor ($460).
────────────────────────────────────────────
```

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

*Not financial advice. This is a personal reasoning tool. Every band and probability is your own estimate. The FY2027 $255–260B capex commitment is even larger than the $190B FY2026 figure this thesis was originally built around — watch every quarter to see if the Azure, Copilot, and free-cash-flow data vindicates it. Update immediately if the data changes direction.*
