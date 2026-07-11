# MU (Micron Technology) Thesis — Quarterly Update Checklist

*A pre-flight checklist for your TH3SIS dashboard. Run it every quarter, right after Micron's earnings report. Micron's fiscal year ends August 31.*

**Earnings calendar:**
- **Q3 FY2026:** June 24, 2026 (after close) ✓ REPORTED — see log below
- **Q4 FY2026:** ~late September 2026 ← NEXT
- **Q1 FY2027:** ~mid-December 2026
- **Q2 FY2027:** ~late March 2027

Do this within 48 hours of each print. Memory thesis can flip direction quickly.

---

## How this works

There are **two layers** to every update. Most people only do Layer 1 and slowly drift into being wrong. The whole value is doing both.

- **Layer 1 — Refresh the numbers.** Mechanical. ~15 minutes.
- **Layer 2 — Audit the thesis.** Judgment. ~45 minutes. Memory cycles move fast — this layer matters more for MU than for any other stock in this library.

Open `MU-thesis.html` in a text editor. Everything you edit lives in the block marked **"EDIT EVERYTHING IN THIS BLOCK EACH QUARTER."**

---

## LAYER 1 — Refresh the numbers

- [ ] **1. `AS_OF_DATE`** — set to today (`"YYYY-MM-DD"`).

- [ ] **2. `NOW_PRICE`** — MU's current share price.

- [ ] **3. `HISTORY`** — Roll `NOW` into the just-completed quarter, then add a fresh `{ q: "NOW", p: NOW_PRICE }` at the end. Note: MU history has only 5 points (Q3 FY25–Q2 FY26) because the price went from $101 to $1,059 in 12 months — the earlier history is visually irrelevant to the current thesis.

- [ ] **4. `FUTURE_Q`** — Roll one step. After Q3 FY2026 reports, drop `"Q3 FY26*"` and add `"Q3 FY27"` on the far end. Remove the `*` from the new nearest future quarter.

- [ ] **5. `CASES`** — *(Layer 2 — don't skip this one)*

- [ ] **6. `PROJ_END` + each case's `target12`** — *(Revisit properly in Layer 2.)*

- [ ] **7. `SIGNALS` and `MARGIN`** — **This is the most important update for MU.** After June 24, convert ALL six WATCH tags to BEAT/MATCH/MISS based on actuals. Key fields:
  - `Q3 Revenue vs $33.5B Guide` → did it beat, meet, or miss? This is the primary signal.
  - `Q4 FY2026 Revenue Guidance` → what did management guide for Q4? This drives the entire thesis direction.
  - `Gross Margin vs 81% Guide` → confirm or deny the pricing power narrative.
  - `HBM Mix % of Revenue` → is HBM growing as a % of total?
  - `NAND Gross Margin Recovery` → any improvement in the drag segment?
  - Update ALL `next` fields to the next earnings date (~late September 2026 for Q4).

- [ ] **8. `KPI_HIST` and `KPI_PROJ`** — `KPI_HIST` becomes Q3 actual revenue ($B). Update `KPI_PROJ` based on Q4 guidance and FY2027 trajectory implied by management's tone.

- [ ] **9. `TRACK_ALL`** — append ONE new entry for Q3 FY2026:
  ```js
  { q: "Q3 FY26", date: "2026-06", post: <stock price after earnings>,
    reaction: "++" | "+" | "-" | "--",
    bear: [<lo>, <hi>], base: [<lo>, <hi>], bull: [<lo>, <hi>],
    landed: "bear" | "base" | "bull" | ...,
    conf: "high" }
  ```
  Note: the current $1,059 is PRE-Q3. The `post` value will be where the stock trades after the June 24 print.

- [ ] **10. `DISLOCATION_DATE` etc.** — Update ONLY if a new dislocation happens (e.g., Q4 guide disappoints severely and stock falls >20% in a day). If so, set the new trough and base floor.

---

## LAYER 2 — Audit the thesis *(especially critical for a cyclical)*

For a memory company like Micron, **Layer 2 is not optional**. The cycle can shift direction in a single earnings call. Each update must answer whether the fundamental thesis has changed.

### For BEAR, then BASE, then BULL:

**A. Is the narrative still true?**

*MU-specific questions to answer every quarter:*
- **Is HBM still sold out?** Micron's entire 2026 HBM production was under binding contracts. Does management still describe supply as constrained, or do they use words like "normalizing" or "we're seeing some customer flexibility"? The latter is the cycle-turn signal.
- **What happened with Samsung HBM3E?** If Samsung qualifies its HBM3E with NVIDIA this quarter, Micron's pricing power erodes. This is the single most important observable-now input.
- **Has the Q4 guide surprised in either direction?** A Q4 guide above $38B pushes toward bull; below $30B collapses the base case.
- **Has management's language changed on FY2027?** "Strong demand visibility" = base+. "We're monitoring capacity additions carefully" = bear signal. "We're revising our outlook for the second half of FY2027" = bear case materializing.

→ If narratives have changed, rewrite the `op` and `breaks` text immediately.

**B. Did the price bands move?**
Memory cycles re-price fast. After each quarterly print:
- Recalculate bear EPS: what does the NEW guidance trajectory imply for trough?
- Recalculate base EPS: does the new FY2027 revenue trajectory imply $65+/year EPS?
- Apply cyclical multiples: bear 10×, base 13–15×, bull 16–18×

*The most dangerous mistake:* keeping bands static while the cycle turns. If Q4 guidance disappoints, drop the base case bands IMMEDIATELY — don't "wait to see another quarter."

**C. Did the triggers move?**
After June 24, the Q3/Q4 signals are answered. New questions for Q4 (September):
- HBM4 volumes — are they ramping? Do customers report faster/slower adoption?
- 2027 supply additions — are Samsung and SK Hynix bringing HBM capacity online faster than expected?
- China HBM — CXMT has been a long-term bear risk. Any signs of qualification progress with domestic customers would be a structural bear signal for 2028+.
- NAND — any sign of NAND oversupply deepening would signal the commodity portion of MU's business is a drag again.

→ Update `SIGNALS` rows to reflect the current live questions, not the answered ones.

**D. Did the probability shift?**
*Current assessment (June 2026):* BASE. Q3 is largely locked in via HBM contracts. The open question is Q4 and FY2027.

**Critical rule for MU:** If Q4 guidance disappoints on June 24, shift immediately to BEAR. Do not average down into a cycle turn. Memory stocks can fall 50–70% from peak in 18 months — the 2022–2023 cycle saw Micron go from $98 to $52 despite analyst "upgrades" at $80. Update the log before the stock reaction sets in.

---

## THE TWO HABITS THAT MAKE THIS WORTH DOING

### Habit 1 — "What would prove me wrong?"
For the current base case (updated 2026-07-11, post-Q3): **Q4 FY2026 actual missing the $50B±$1B guide, or FY2027 initial guidance (given alongside Q4, ~Sept 2026) signaling deceleration on non-SCA volume, would prove me wrong.** Either alone is enough — no hedging, no "let's see another quarter." (The original June-24 trigger is resolved — Q3 answered it decisively bullish.)

### Habit 2 — "What surprised me?"
Write the one thing this quarter you didn't see coming. Memory cycle surprises tend to be:
- Faster demand pull-forward than expected (surprise bull)
- Samsung qualification timeline (surprise bear)
- A new AI architecture that changes memory specifications (could be either direction)
- NAND recovering faster than expected (surprise bull on margins)

---

> **The cyclical trap, restated every quarter:** Micron at $979 trades at a historically compressed ~6.4× forward P/E despite RECORD earnings (84.9% GM, $41.46B Q3 revenue). This is the mirror image of the old warning — instead of "cheap at peak," the risk now is dismissing genuinely structural evidence (the $100B in 5-year contracts) as just another cyclical head-fake because the multiple still looks skeptical. Both traps are real: don't assume the cycle is different just because this quarter was extraordinary, AND don't assume it's the same old cycle just because the market hasn't re-rated yet. The SCAs are the one piece of hard evidence that would have been unavailable in any prior memory downturn — weigh it accordingly, but re-validate every quarter, not once.

---

## QUARTERLY LOG

```
────────────────────────────────────────────
QUARTER: Q_  FY____          UPDATED ON: ________
Price at update: $______   Most-likely case: ______

Q3 revenue: $______B   vs guide $33.5B: (BEAT / MATCH / MISS)
Q4 revenue guide: $______B   Gross margin Q3: _____%
Q4 gross margin guide: _____%   HBM still sold out: Y/N
Samsung HBM3E qualified at NVIDIA: Y/N
Management language on FY2027: (BULLISH / NEUTRAL / CAUTIOUS)

THESIS AUDIT (one line each):
  Bear  — narrative still true? ___  bands moved? ___  why: ____________________
  Base  — narrative still true? ___  bands moved? ___  why: ____________________
  Bull  — narrative still true? ___  bands moved? ___  why: ____________________

PROBABILITY shift this quarter: ________________________________________________
Did cycle direction change? (Y/N) — if YES, update CASES immediately.

WHAT WOULD PROVE ME WRONG (for my favored case):
  _____________________________________________________________________________

WHAT SURPRISED ME THIS QUARTER:
  _____________________________________________________________________________
────────────────────────────────────────────
```

### Q3 FY2026 — June 24, 2026

```
────────────────────────────────────────────
QUARTER: Q3  FY2026          UPDATED ON: 2026-07-11
Price at update: $979   Most-likely case: BASE, tracking toward BULL on fundamentals
  (Note: this update ran 17 days late — Q3 reported June 24, thesis wasn't touched
  until July 11. Caught while reviewing what to do "while waiting on TSM's Jul 16
  print" and finding MU's own catalyst had already passed unaddressed.)

Q3 revenue: $41.46B   vs guide $33.5B: BEAT (+24%, +346% YoY, +74% QoQ — largest
  dollar increase in company history)
Q4 revenue guide: $50.0B ±$1.0B   Gross margin Q3: 84.9% (non-GAAP, record)
Q4 gross margin guide: ~86%   HBM still sold out: Y (HBM4 demand exceeds supply
  through at least CY2028 per management)
Samsung HBM4 (not HBM3E) qualified at NVIDIA + AMD, MASS PRODUCTION FIRST: Y — this
  is a materially bigger deal than the old checklist's "HBM3E qualification" framing
  anticipated; Samsung is ahead of Micron on HBM4 specifically, not just catching up
  on HBM3E.
Management language on FY2027: BULLISH — "no idea when the RAM crisis will end,"
  tight supply-demand expected through 2027, gradual improvement only in 2028.
NEW THIS QUARTER (not in old template): 16 Strategic Customer Agreements signed,
  $100B minimum contracted revenue, 5-year term (2026-2030), ~20% DRAM / ~1/3 NAND
  volume, floor margins "well beyond historical peaks," backed by $22B in customer
  commitments (~$18B cash deposits).

THESIS AUDIT (one line each):
  Bear  — narrative still true? PARTIALLY  bands moved? YES (narrower, $320-520 →
    $550-750)  why: the $100B SCAs floor-protect a real chunk of volume through
    2030, so a classic full-cycle collapse is less plausible than before — but the
    ~70-80% of volume NOT covered by SCAs is still exposed, and Samsung's HBM4
    mass-production lead is a real new competitive risk the old bear case didn't
    have to name.
  Base  — narrative still true? YES, EXCEEDED  bands moved? YES ($900-1,100 →
    $1,100-1,350)  why: Q3 already beat what the OLD base case required; the new
    base case is anchored to Q4 guide + FY2027 visibility from the SCAs, not just
    "does Q3 meet guide" (already answered).
  Bull  — narrative still true? YES, EXCEEDED  bands moved? YES ($1,200-1,500 →
    $1,500-1,800)  why: actual Q3 results + Q4 guide already blew past the OLD
    bull thresholds entirely. New bull case requires FY2027 guidance to be RAISED
    further and Micron to hold HBM4 share despite Samsung, not just "Q3 beats."

PROBABILITY shift this quarter: Fundamentals shifted decisively toward bull (results
  exceeded the old bull case on every metric). But PRICE didn't follow — MU is
  actually below its pre-earnings level three weeks later ($1,059 → $979), so this
  is genuinely a "fundamentals-ahead-of-price" setup, not a straightforward
  probability-shift-to-bull call. Calling it BASE (tracking bull) reflects that the
  market's skepticism (still ~6.4x forward P/E on record earnings) hasn't resolved
  yet, not that the fundamental case weakened.
Did cycle direction change? (Y/N): N — cycle extended per guide, no reversal signal.

WHAT WOULD PROVE ME WRONG (for my favored case):
  Q4 FY26 actual misses the $50B±$1B guide, OR initial FY2027 guidance (given
  alongside Q4, ~Sep 2026) signals deceleration rather than continued tightness on
  the non-SCA-covered volume. Either one alone is enough — no "both must happen."

WHAT SURPRISED ME THIS QUARTER:
  Two things. (1) The magnitude — Q3 beat by 24% on revenue on top of Q4 guide
  another ~20% above THAT, with GM at 84.9%/86% guided — numbers that would have
  seemed absurd even six months ago. (2) More interesting: the stock's reaction.
  A quarter that blew past the OLD bull case entirely did NOT re-rate the stock —
  MU sits below where it traded before the print. The market's skepticism about
  cycle durability is apparently stronger than I'd modeled; the $100B SCAs are
  real, sourced, and structurally different from prior cycles, but the market
  hasn't decided to believe it yet. That gap (fundamentals vs. price) is now the
  actual thesis, more than "will the cycle extend."
────────────────────────────────────────────
```

---

## Layer 1 quick-reference: where each number comes from

| What to update | Where to find it |
|---|---|
| Total revenue ($B) | Earnings press release — first line |
| Q4 revenue guidance | Earnings press release — "Q4 FY2026 Outlook" section |
| Gross margin (GAAP + non-GAAP) | Earnings press release |
| HBM status ("sold out" language) | CEO/CFO prepared remarks on the earnings call |
| Samsung HBM3E qualification | NVIDIA supplier announcements; trade press (Tom's Hardware, AnandTech) |
| 2027 supply data | SK Hynix / Samsung CapEx guidance; Gartner / TrendForce memory reports |
| MU stock price | Any financial data provider |
| Forward EPS consensus | Bloomberg, FactSet, Yahoo Finance analysis tab |

---

*Not financial advice. This is a personal reasoning tool. Memory cycles move faster than any thesis can track in real time — the Layer 2 habit is what prevents being caught holding through a cycle reversal. Every band in this dashboard is an estimate. The most dangerous assumption is that the current earnings trajectory is permanent.*
