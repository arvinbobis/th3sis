# TSM Thesis — Quarterly Update Checklist

*A pre-flight checklist for your TH3SIS dashboard. Run it every quarter, right after TSMC's earnings report — even when nothing looks wrong. The whole point is to catch the quarter where the world quietly moved and your thesis didn't.*

**Earnings calendar:** TSMC reports roughly mid-January / mid-April / mid-July / mid-October.
Next scheduled: **July 16, 2026**. Run this within a week of each print, while details are fresh.

---

## How this works

There are **two layers** to every update. Most people only do Layer 1 and slowly drift into being wrong. You decided to do both — that's the entire value of this exercise.

- **Layer 1 — Refresh the numbers.** Mechanical. ~15 minutes. Plug in what happened.
- **Layer 2 — Audit the thesis.** Judgment. ~30 minutes. Ask whether the three cases themselves still make sense, or whether reality has overtaken them.

Open `TSM-thesis.html` in a text editor. Everything you edit lives in the block at the top marked **"EDIT EVERYTHING IN THIS BLOCK EACH QUARTER."**

---

## LAYER 1 — Refresh the numbers

Work top to bottom through the edit block. Tick each one.

- [ ] **1. `AS_OF_DATE`** — set to today (format `"YYYY-MM-DD"`).
- [ ] **2. `NOW_PRICE`** — TSM's current ADR price.
- [ ] **3. `HISTORY`** — Roll the price line forward. Replace the old `NOW` entry with the just-finished quarter's actual end price (e.g. change `{ q: "NOW", p: 425 }` into `{ q: "Q2 26", p: <whatever> }`), then add a fresh `{ q: "NOW", p: NOW_PRICE }` at the end. Keep the list to 6–7 entries; drop the oldest if it gets crowded.
- [ ] **4. `FUTURE_Q`** — Roll the four forward-quarter labels one step (drop the nearest, add a new one on the end). E.g. after the Q2 2026 report: `["Q3 26", "Q4 26", "Q1 27", "Q2 27"]`.
- [ ] **5. `PROJ_END` + each case's `target12`** — The bear/base/bull 12-month price targets. `PROJ_END` is where each forecast line ends on the chart; `target12` is the text label. *(Revisit properly in Layer 2 — for now just note they exist.)*
- [ ] **6. `SIGNALS` and `MARGIN`** — For each row, update the `tag` (`BEAT` / `MATCH` / `MISS` / `WATCH`) based on what the earnings report showed, update the `next` field to the next quarter, and nudge `pos` (0 = far bear/left, 1 = far bull/right) to reflect where reality landed.
  - Key signals to refresh: **AI/HPC Revenue Share**, **Revenue vs. Guide**, **Cross-Strait Risk Level**, **Gross Margin %**, **CoWoS Capacity Utilization**, **2nm (N2) Node Ramp News**.
- [ ] **7. `KPI_HIST`** — Update to the latest actual AI/HPC revenue share % (the Q1 2026 starting value was 61%).
- [ ] **8. `KPI_PROJ`** — Revise the 4-quarter forward projections per case to reflect new guidance and trends.
- [ ] **9. `TRACK_ALL`** — Append ONE new entry for the quarter that just reported. Fill in:
  - `q`: quarter label (e.g. `"Q2 2026"`)
  - `date`: reporting date in `"YYYY-MM"` format
  - `post`: where the ADR traded after earnings
  - `reaction`: `"+"` / `"++"` / `"-"` / `"--"` (how the stock reacted)
  - `bear`, `base`, `bull`: the three price bands **as they stood at that report date** (not hindsight — use the bands from the prior quarter's dashboard)
  - `landed`: which zone price ended in (`"bear"`, `"base"`, `"bull"`, `"base→bull"`, etc.)
  - `conf`: `"high"` (recent data, reliable)
  
  **The oldest quarter drops off automatically** — the dashboard always shows the most recent 6.

- [ ] **10. `DISLOCATION_DATE` / `REVERSION_TROUGH` / `REVERSION_BASEFLOOR`** — ONLY touch these if a *new* geopolitical or earnings shock happened this quarter that drove a large dislocation (>15% sudden move). If no new shock: leave as-is. The current values track the May 2025 tariff-panic dislocation — already fully recovered.

> **Tip:** After saving, open the file in your browser and hover over a few things to confirm nothing reads "undefined" or looks broken.

---

## LAYER 2 — Audit the thesis *(the part that actually matters)*

This is **step 5 in the edit block: `CASES`.** Do not skip it. For *each* of the three cases, answer four questions out loud (or in writing). One honest sentence each is enough.

### For BEAR, then BASE, then BULL, ask:

**A. Is the narrative still true?**
Read the `op` text for this case. Has the world overtaken it?

*TSMC-specific things to check:*
- **Bear:** Is the cross-strait tension level higher or lower than when this was written? Has any hyperscaler (Microsoft, Google, Amazon, NVIDIA) cut or paused AI capex guidance?
- **Base:** Is Arizona Phase 1 on schedule? Are gross margins holding in the 65–67% range? Has the US-Taiwan deal framework held together?
- **Bull:** Has N2 (2nm) production been confirmed with volume customers? Has TSMC raised 2026 guidance above 35% growth? Are gross margins expanding above 67%?

→ If the story is stale, rewrite the `op` and `breaks` text.

**B. Did the price bands move?**
Are the `target12` ranges and `PROJ_END` still right? The two levers for TSMC:
1. **EPS estimate**: Has consensus 2026E/2027E EPS (currently ~$15.64 / ~$19.95 per ADR) moved up or down?
2. **Multiple**: Has the geopolitical risk premium changed? At calm times TSMC deserves 25–30x; at fear peaks it compresses to 14–18x. Arizona progress is the structural driver of multiple re-rating.

→ Update `PROJ_END` and `target12` if your EPS × multiple math changed.

**C. Did the triggers move?**
Are the KPIs in `SIGNALS` / `MARGIN` still the *right things to watch*, or has the real risk relocated?

*Risks that could change the KPI priorities:*
- If N2 ramp has completed → node ramp becomes a less useful signal; shift focus to N2 pricing/yield
- If Arizona Phase 1 is fully ramped → shift focus to Phase 2 (N2/N3) cost profile
- If AI demand is proven structurally durable → bear case KPIs become less about demand and more about margin durability
- If a new chip architecture emerges (beyond Blackwell) → check if TSMC still has the leading-edge contract

→ Swap out any signal that's become an answered question for the one that now matters.

**D. Did the probability shift?**
Which case is most likely *now*? Be willing to say it changed. The starting assessment (May 2026) was: **Base 55%, near-term Bull momentum 35%, Bear tail 10%**.

→ Note any shift in the log below.

---

## THE TWO HABITS THAT MAKE THIS WORTH DOING

### Habit 1 — "What would prove me wrong?"
For whichever case you currently believe most, write down the **single piece of evidence that would force you to abandon it.**

*For the base case (most likely at time of writing):* The kill-switch is gross margin guidance dropping below 63% for a future quarter **while** AI/HPC revenue share stalls or falls — that would mean the cost drag of geographic diversification is eating into the very margins that justified the premium. One without the other is noise; both together is signal.

### Habit 2 — "What surprised me?"
Write the one thing this quarter you *didn't* see coming. Over a year these four notes become a map of where your model is consistently blind.

> A caution worth re-reading every time: **this dashboard looks authoritative, and that can fool its own author.** At $425 and 27x forward P/E, TSMC is pricing in considerable success. The colored bands are estimates. The geopolitical risk discount has closed — but the risk hasn't gone away. The CoWoS ramp rests on execution TSMC has never done at this scale before. Let the tool organize your thinking — never let it replace it. When in doubt, widen your bands and lower your confidence.

---

## QUARTERLY LOG

*Keep a running record. Future-you will learn more from this than from any single chart. Copy the block for each new quarter.*

```
────────────────────────────────────────────
QUARTER: Q_  20__          UPDATED ON: ________
TSM ADR price at update: $______   Most-likely case: ______
Consensus 2026E EPS at update: $______ /ADR   Forward P/E: ______x

THESIS AUDIT (one line each):
  Bear  — narrative still true? ___  bands moved? ___  why: __________
  Base  — narrative still true? ___  bands moved? ___  why: __________
  Bull  — narrative still true? ___  bands moved? ___  why: __________

PROBABILITY shift this quarter: ____________________________

KEY NUMBERS REFRESHED:
  AI/HPC revenue share: ____%  (was ___%)
  Q_ revenue: $___B vs. guide of $___B  →  [BEAT / MATCH / MISS]
  Gross margin: ____%  (was ___%)
  Full-year 2026 guidance: ____________________________
  N2 ramp status: ____________________________
  Arizona Phase 1 status: ____________________________
  Cross-strait tension level: [Low / Elevated / High / Crisis]

WHAT WOULD PROVE ME WRONG (for my favored case):
  ________________________________________________________

WHAT SURPRISED ME THIS QUARTER:
  ________________________________________________________
────────────────────────────────────────────
```

### Q2 2026 — (fill in after the July 16 report)
*(your first live entry goes here)*

---

## TSM-specific signals reference

These are the six KPIs that most move the TSM story, in priority order:

| # | KPI | Why it matters | Where to find it |
|---|-----|---------------|-----------------|
| 1 | **AI/HPC revenue share** | At 61%, it's the justification for the whole premium. Rising = thesis tracking. | TSMC earnings call, revenue breakdown |
| 2 | **Revenue vs. quarterly guide** | Near-term demand litmus test. TSMC guides conservatively — a miss matters more than a beat. | Earnings release |
| 3 | **Gross margin trajectory** | At 66.2% now. Arizona scale-up is the structural drag risk. Threshold: ≥65% is fine, <63% is a problem. | Earnings release |
| 4 | **Cross-strait tension level** | The non-financial variable that can compress multiples regardless of fundamentals. Watch daily. | News, Taiwan Strait Threat Monitor, US State Dept. |
| 5 | **N2 (2nm) ramp progress** | The next pricing/margin lever. Apple Q3 iPhone supply = first signal. | TSMC press releases, Apple supply chain news |
| 6 | **CoWoS capacity utilization** | Ramp to 130K wafers/month by end 2026. Bottleneck = NVIDIA delivery risk. | TSMC management commentary, NVIDIA supply chain checks |

---

*Not financial advice. This is a personal reasoning tool. Every band and probability in it is your own estimate, to be revised freely as the world changes.*
