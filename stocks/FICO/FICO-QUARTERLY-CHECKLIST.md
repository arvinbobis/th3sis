# FICO Thesis — Quarterly Update Checklist

*A pre-flight checklist for your TH3SIS dashboard. Run it every quarter, right after FICO's earnings report. The whole point is to catch the quarter where VantageScore adoption data finally shows up — or proves to be a non-event.*

**⚠ FICO fiscal year note:** FICO's FY ends September 30.
- Q3 FY2026 = April–June 2026 calendar → reports **~late July 2026**
- Q4 FY2026 = July–September 2026 → reports ~late October 2026

**⚠ This is a multiple-derating thesis:** Earnings are growing +60-70% YoY. The stock is down 46% from ATH. The bear case does NOT require an earnings miss — only that VantageScore makes future price hikes impossible, eventually eroding the Scores margin. Watch the Scores growth rate deceleration closely; it will tell you before total earnings do.

**Next earnings: Q3 FY2026, ~late July 2026**

---

## How this works

Two layers. Most people only do Layer 1 and slowly drift into being wrong.

- **Layer 1 — Refresh the numbers.** Mechanical. ~15 minutes.
- **Layer 2 — Audit the thesis.** Judgment. ~30 minutes. Especially important for FICO because the competitive threat evolves quarterly.

Open `FICO-thesis.html` in a text editor. Everything you edit lives in the block marked **"EDIT EVERYTHING IN THIS BLOCK EACH QUARTER."**

---

## LAYER 1 — Refresh the numbers

Tick each one.

- [ ] **1. `AS_OF_DATE`** — set to today (`"YYYY-MM-DD"`).
- [ ] **2. `NOW_PRICE`** — FICO's current share price.
- [ ] **3. `HISTORY`** — Roll the price line forward. Replace `NOW` with the just-finished calendar quarter's close, add a fresh `{ q: "NOW", p: NOW_PRICE }`. Note: use calendar quarter labels (Q3 25, Q4 25…) even though FICO reports on fiscal quarters.
- [ ] **4. `FUTURE_Q`** — Roll the four forward fiscal-quarter labels (e.g. after Q3 FY26 reports: `["Q4 FY26", "Q1 FY27", "Q2 FY27", "Q3 FY27"]`).
- [ ] **5. `PROJ_END` + each case's `target12`** — The bear/base/bull 12-month price targets. These are `EPS × multiple`. If consensus EPS has moved, recalculate. *(Revisit properly in Layer 2.)*
- [ ] **6. `SIGNALS` and `MARGIN`** — For each row, update `tag`, `next`, and `pos`:
  - **Scores Revenue Growth:** Tag `BEAT` if above 40%, `MATCH` if 20-40%, `MISS` if below 20%. Update `guide` to the just-reported quarter's actual.
  - **VantageScore Lender Adoption:** Update based on latest MBA/FHFA data on how many lenders have integrated VantageScore. Tag `MISS` if >25% of major lenders are actively substituting FICO with VantageScore.
  - **Mortgage Origination Volume:** Update with latest MBA Mortgage Applications Index trend. Tag based on direction.
  - **Software ARR Growth:** Update with reported figure. Tag `BEAT` if above 15%, `MATCH` if 10-15%, `MISS` if below 10%.
  - **Reg / Pricing Investigation:** `MISS` = FTC charges filed or legislation proposed. `WATCH` = ongoing investigation. `BEAT` = investigation closed/dropped.
- [ ] **7. `KPI_HIST`** — Update to the just-reported Scores segment YoY revenue growth % (the single most important number to get right).
- [ ] **8. `KPI_PROJ`** — Revise the 4-quarter Scores growth projections per case. If VantageScore adoption is tracking slower than expected: raise the base projection. If tracking faster: lower it.
- [ ] **9. `TRACK_ALL`** — Append ONE new entry:
  - `q`: fiscal quarter label (`"Q3 FY26"`, `"Q4 FY26"`, etc.)
  - `date`: reporting month `"YYYY-MM"`
  - `post`: stock price after earnings
  - `reaction`: `"+"` / `"++"` / `"-"` / `"--"`
  - `bear`, `base`, `bull`: the three price bands **as they stood at THAT report date**
  - `landed`: which zone price ended in
  - `conf`: `"high"` for recent data
- [ ] **10. `DISLOCATION_DATE` etc.** — Only update if a *new* major shock occurs. Current values track the July 8, 2025 FHFA/VantageScore dislocation — recovery above base floor confirmed. If a new shock (FTC action, pricing cap legislation) happens: update the date and REVERSION_TROUGH.

> **Tip:** After saving, open in browser and hover a few data points to confirm nothing shows "undefined."

---

## LAYER 2 — Audit the thesis *(even more important for FICO than other stocks)*

FICO's thesis is uniquely sensitive to a slowly-developing competitive threat. Each quarter provides new data on whether VantageScore is real or theoretical. Don't skip this layer.

### For BEAR, then BASE, then BULL, ask:

**A. Is the narrative still true?**

*FICO-specific things to check after each quarter:*
- **Bear:** Did FICO announce a price freeze or rollback on per-score mortgage fees? Did the FTC formally charge FICO, or did Congress introduce a pricing cap bill? Did any major lender (Wells Fargo, JPMorgan, Quicken/Rocket) publicly announce switching to VantageScore? Did Scores YoY growth fall below 20% for the first time?
- **Base:** Did Scores growth moderate (20-35%) without collapsing? Did FICO raise guidance? Is the bi-score requirement increasing FICO's score pull volume (both scores required = 2 pulls per application)? Has the FTC investigation stayed at investigation stage without advancing to charges?
- **Bull:** Did FICO announce a new per-score price increase without material pushback? Did FHFA publish data showing FICO 10T adoption significantly higher than VantageScore in actual GSE loans? Did Steve Eisman file a 13F showing reduced short position? Did Scores growth re-accelerate above 40%?

→ If the story is stale, rewrite `op` and `breaks`.

**B. Did the price bands move?**
FICO's P/E has ranged from ~65x (ATH, Nov 2024) to ~25x (current). The multiple is the argument. Two moving parts:
1. **EPS estimate:** Has consensus FY2026E ($43.88) or FY2027E ($55.45) moved? A 10% EPS revision = 10% change in intrinsic value.
2. **Multiple:** Has the market's confidence in the pricing moat changed? Bear = 15-20x. Base = 25-32x. Bull = 40-52x. Any concrete evidence on VantageScore adoption (positive or negative) should move the multiple you assign.

→ Update `PROJ_END` and `target12` if either input changed.

**C. Did the triggers move?**
*Risks that could shift KPI priorities:*
- If VantageScore adoption has proven near-zero after 2 full quarters of bi-score → shift focus from VantageScore threat to Software ARR acceleration and mortgage volume recovery (bull case confirmation)
- If a pricing cap bill has been introduced → regulatory risk becomes the primary KPI; VantageScore becomes secondary
- If mortgage origination volume has recovered strongly → this boosts Scores volume even at flat prices; could re-rate the base case upward
- If FICO announces it's pivoting to a pure-SaaS model → reconsider the valuation ruler (EV/ARR or NTM P/S might become more appropriate)

**D. Did the probability shift?**
Starting assessment (May 2026): **Base 45%, Bear 35%, Bull 20%**. FICO's bear case is more live than typical — be honest if evidence shifts it.

---

## THE TWO HABITS

### Habit 1 — "What would prove me wrong?"
For the base case (most likely at time of writing): The kill-switch is **two consecutive Scores revenue quarters showing YoY growth below 20% after the bi-score requirement is fully live**. One quarter could be timing noise. Two quarters confirms the deceleration is structural. At that point, the bear repricing narrative becomes the base case.

### Habit 2 — "What surprised me?"
Write the one thing this quarter you *didn't* see coming.

> **A FICO-specific caution:** This is the only thesis in this set where the bear case is genuinely structural rather than cyclical. For NVDA, TSMC, and ASML, the bear case requires a capex cycle turn or geopolitical shock — temporary, recoverable events. For FICO, the bear case requires only that VantageScore is priced near-zero and that FICO can no longer raise per-score prices. That's a one-way door. If FICO's pricing power breaks, it doesn't "recover" — it reprices permanently. This makes the FICO bear case more serious than its 35% probability implies. The bar for reducing that probability should be high: you need actual data showing lenders are not substituting, not just one strong quarter of Scores revenue.

---

## QUARTERLY LOG

*Copy the block for each new quarter.*

```
────────────────────────────────────────────
QUARTER: Q_ FY__          UPDATED ON: ________
FICO price at update: $______   Most-likely case: ______
Consensus FY2026E EPS: $______   FY2027E: $______   Forward P/E: ______x

THESIS AUDIT (one line each):
  Bear  — narrative still true? ___  bands moved? ___  why: __________
  Base  — narrative still true? ___  bands moved? ___  why: __________
  Bull  — narrative still true? ___  bands moved? ___  why: __________

PROBABILITY shift this quarter: ____________________________

KEY NUMBERS REFRESHED:
  Scores revenue YoY growth: ____%  (was ___%)  →  [BEAT / MATCH / MISS]
  Software ARR growth: ____%  (was ___%)
  Total revenue: $___M vs guidance of $___M  →  [BEAT / MATCH / MISS]
  Full-year FY2026 EPS guidance: $______
  VantageScore lender adoption: ____________________________
  MBA Mortgage Applications Index trend: ____________________________
  FTC/Hawley investigation status: ____________________________
  FICO pricing action (any new hike or rollback?): ____________________________

WHAT WOULD PROVE ME WRONG (for my favored case):
  ________________________________________________________

WHAT SURPRISED ME THIS QUARTER:
  ________________________________________________________
────────────────────────────────────────────
```

### Q3 FY2026 — (fill in after the ~late July 2026 report)
*(your first live entry goes here)*

---

## FICO-specific signals reference

The six KPIs that most move the FICO story, in priority order:

| # | KPI | Why it matters | Where to find it |
|---|-----|---------------|-----------------|
| 1 | **Scores segment revenue YoY growth %** | The pricing moat signal. Currently +60% from aggressive price hikes. Decelerating below 20% = VantageScore working. Holding above 30% = moat intact. | FICO earnings press release, Scores segment revenue |
| 2 | **VantageScore actual lender adoption** | FHFA approval ≠ lender adoption. The bear case only materializes if lenders *actually* switch. Observable via MBA surveys, FHFA GSE reporting. | Mortgage Bankers Association data, FHFA usage statistics |
| 3 | **Mortgage origination volume (MBA index)** | FICO earns per score pull; mortgages are the highest-value use case (multiple pulls per application). Rate recovery = volume recovery = revenue upside independent of pricing. | MBA Mortgage Applications Index (weekly) |
| 4 | **Per-score pricing trajectory** | Has gone $0.60 → $10+ over 5 years. Any freeze or rollback = bear signal. Any new hike without pushback = bull signal. | FICO press releases, earnings call commentary |
| 5 | **Software ARR growth %** | The diversification story. Currently 10% YoY. If Scores erodes, software needs to compensate. Target: 18-25% ARR growth to maintain total earnings trajectory. | FICO earnings press release, Software segment ARR |
| 6 | **Regulatory / legislative risk** | FTC investigation and Senator Hawley scrutiny. No bill yet. Any legislation capping per-score pricing is the nuclear bear. | Congressional hearings, FTC filings, FICO 10-K risk factors |

---

*Not financial advice. This is a personal reasoning tool. FICO's situation is unusual: fundamentals are exceptional, but a structural competitive threat is genuinely in play for the first time in the company's modern history. The 29x multiple already prices in significant bear probability. Hold your bands wide and be especially rigorous about Habit 1 — "what would prove me wrong?" — because the bear case here is a one-way door.*
