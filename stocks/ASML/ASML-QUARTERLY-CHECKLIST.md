# ASML Thesis — Quarterly Update Checklist

*A pre-flight checklist for your TH3SIS dashboard. Run it every quarter, right after ASML's earnings report — even when nothing looks wrong. The whole point is to catch the quarter where the world quietly moved and your thesis didn't.*

**⚠ Currency note:** ASML reports in EUR. The dashboard prices are USD (NASDAQ ADR, 1:1 ratio with Amsterdam shares). When refreshing: update the EUR/USD rate in the config comment, and recalculate any EUR EPS × multiple price targets accordingly. At build date, EUR/USD ≈ 1.133.

**⚠ Revenue lumpiness warning:** ASML's quarterly revenue is driven by individual machine shipments at €150M–€380M each. A one-machine timing slip can move a quarterly print by €200M+. Don't over-react to a single miss if it's shipping-timing noise; watch the bookings trend instead.

**Earnings calendar:** ASML reports roughly mid-January / mid-April / mid-July / mid-October.
Next scheduled: **Q2 2026, mid-July 2026**. Run this within a week of the print, while details are fresh.

---

## How this works

Two layers. Most people only do Layer 1 and slowly drift into being wrong.

- **Layer 1 — Refresh the numbers.** Mechanical. ~15 minutes. Plug in what happened.
- **Layer 2 — Audit the thesis.** Judgment. ~30 minutes. Ask whether the three cases themselves still make sense.

Open `ASML-thesis.html` in a text editor. Everything you edit lives in the block at the top marked **"EDIT EVERYTHING IN THIS BLOCK EACH QUARTER."**

---

## LAYER 1 — Refresh the numbers

Work top to bottom through the edit block. Tick each one.

- [ ] **1. `AS_OF_DATE`** — set to today (`"YYYY-MM-DD"`).
- [ ] **2. `NOW_PRICE`** — ASML's current NASDAQ ADR price (USD). Check NASDAQ:ASML, not Amsterdam ASML.AS (different currency).
- [ ] **3. `HISTORY`** — Roll the price line forward. Replace the old `NOW` entry with the just-finished quarter's actual USD close (e.g. `{ q: "Q2 26", p: <price> }`), then add a fresh `{ q: "NOW", p: NOW_PRICE }` at the end.
- [ ] **4. `FUTURE_Q`** — Roll the four forward labels one step (e.g. after Q2 2026 reports: `["Q3 26", "Q4 26", "Q1 27", "Q2 27"]`).
- [ ] **5. `PROJ_END` + each case's `target12`** — The bear/base/bull 12-month USD price targets. These are `EUR EPS × multiple × EUR/USD`. If EUR/USD has moved, recalculate. *(Revisit properly in Layer 2.)*
- [ ] **6. `SIGNALS` and `MARGIN`** — Update `tag`, `next`, and `pos` for each row:
  - **Net Bookings:** Update `val` with actual bookings (€B). Tag `BEAT` if above €9B, `MATCH` if €6-9B, `MISS` if below €6B.
  - **Q2 Revenue vs. Guide:** Update the guide number each quarter, then tag based on where revenue landed.
  - **China Revenue %:** Update with the new China system sales %. Tag `MISS` if below 15% or if a service restriction was announced.
  - **Gross Margin %:** Update with reported GM. Tag `BEAT` if above 54%, `MATCH` if 51-54%, `MISS` if below 51%.
  - **High-NA EUV Unit Deliveries:** Update count of units shipped. Even 1-2 units/quarter matters at €380M+ each.
- [ ] **7. `KPI_HIST`** — Update to the just-reported quarter's actual net bookings (€B). This is the most important number to get right.
- [ ] **8. `KPI_PROJ`** — Revise the 4-quarter forward bookings forecasts per case to reflect the new demand environment. If bookings came in above €10B: consider raising the base projection. If below €6B: consider lowering.
- [ ] **9. `TRACK_ALL`** — Append ONE new entry:
  - `q`: quarter label (`"Q2 2026"`, `"Q3 2026"`, etc.)
  - `date`: reporting month in `"YYYY-MM"` format
  - `post`: USD ADR price where it traded after earnings
  - `reaction`: `"+"` / `"++"` / `"-"` / `"--"` (stock reaction)
  - `bear`, `base`, `bull`: the three USD price bands **as they stood at THAT report date** (use the prior dashboard's PROJ_END and bands — no hindsight)
  - `landed`: which zone price ended in
  - `conf`: `"high"` for recent data
  
  **Oldest quarter drops automatically** — always the last 6.

- [ ] **10. `DISLOCATION_DATE` etc.** — Only update if a *new* major shock (>15% sudden move) occurs. The current values track the August 2025 dislocation ($683 low) — fully recovered. If a new shock happens: update date, trough price, and new base floor.

> **EUR/USD reminder:** if EUR/USD has moved more than ~5% since last update, recalculate all USD price targets in CASES and PROJ_END. Every 10-cent move in EUR/USD changes EPS-in-USD and thus fair-value-in-USD by ~9%.

> **Tip:** After saving, open the file in your browser and hover a few data points to confirm nothing shows "undefined."

---

## LAYER 2 — Audit the thesis *(the part that actually matters)*

This is **step 5 in the edit block: `CASES`.** Do not skip it. For *each* of the three cases, answer four questions. One honest sentence each is enough.

### For BEAR, then BASE, then BULL, ask:

**A. Is the narrative still true?**

*ASML-specific things to check after each quarter:*
- **Bear:** Did bookings come in below €6B? Did the US or Netherlands announce a DUV service/maintenance ban for China? Did any major customer (TSMC, Intel, Samsung, SK Hynix) publicly announce a multi-quarter capex deferral? These are the three bear triggers.
- **Base:** Did bookings land in the €7–10B range? Did China stabilize around 15–18% of system sales without a new restriction? Did High-NA deliver 2–4 units? Is the gross margin holding 51–54% despite DUV/China mix headwinds?
- **Bull:** Did bookings exceed €10B for a second consecutive quarter? Did TSMC reverse its stated High-NA delay? Did Intel confirm successful 14A yield, pulling forward demand? Did IBM revenue exceed €3B/quarter?

→ Rewrite `op` and `breaks` text for any case where the world has overtaken the narrative.

**B. Did the price bands move?**
ASML's price math has three moving parts:
1. **EUR EPS estimate:** Has consensus 2026E (currently €31.88) or 2027E (€42.20) moved? A 10% EPS revision = 10% change in intrinsic value before any multiple movement.
2. **EUR/USD rate:** Has the exchange rate shifted? This changes USD price targets even if EUR EPS is unchanged.
3. **Multiple:** Has the market's confidence in the cycle changed? ASML has traded between ~28x (trough fear, 2024) and ~50x (peak excitement). The current ~44x implies moderate confidence — neither trough nor peak.

→ Update `PROJ_END` and `target12` if any of these three inputs changed materially.

**C. Did the triggers move?**
Are the KPIs in `SIGNALS` / `MARGIN` still the right things to watch?

*Risks that could shift KPI priorities:*
- If China has fully normalized at 10-12% → the China % KPI becomes less urgent; shift focus to whether Europe/US can fully replace lost demand
- If High-NA has ramped to 10+ units/quarter → shift focus to High-NA ASP trajectory and whether volumes hold
- If Intel 14A fails to yield → Intel drops out of High-NA, and the question becomes whether TSMC/Samsung fill the gap
- If the semiconductor cycle turns → bookings become less predictable; shift focus to backlog drawdown rate vs. cancellations

→ Swap out answered questions for the risks that now matter.

**D. Did the probability shift?**
Which case is most likely *now*? Starting assessment (May 2026): **Base 55%, Bull 35%, Bear 10%**.

→ Note any shift in the log below.

---

## THE TWO HABITS THAT MAKE THIS WORTH DOING

### Habit 1 — "What would prove me wrong?"
For whichever case you currently believe most, name the **single piece of evidence that would force you to abandon it.**

*For the base case (most likely at time of writing):* The kill-switch is two consecutive bookings prints below €6B. One quarter of €5B could be timing noise. Two quarters below €6B means customers are genuinely deferring, and the Q4 2025 record gets reframed as a pull-forward, not a trend. At that point the 44x multiple becomes unjustifiable and the stock re-rates toward 28-32x on flat-to-declining EPS expectations.

### Habit 2 — "What surprised me?"
Write the one thing this quarter you *didn't* see coming.

> A caution specific to ASML: **the monopoly narrative is seductive precisely because it's largely true.** No one else makes EUV. No one else makes High-NA. The installed base really does generate recurring revenue. The temptation is to conclude that the monopoly makes the stock "safe" — it doesn't. Q3 2024's €2.6B bookings happened despite the monopoly being intact. Cyclicality is real. At 44x forward P/E, you are paying a monopoly premium plus a growth premium, and both need to be right simultaneously. Hold the bands wide.

---

## QUARTERLY LOG

*Keep a running record. Copy the block for each new quarter.*

```
────────────────────────────────────────────
QUARTER: Q_  20__          UPDATED ON: ________
ASML ADR price at update: $______   EUR/USD at update: ______
Most-likely case: ______

Consensus 2026E EPS at update: €______  ($______ USD)  Forward P/E: ______x

THESIS AUDIT (one line each):
  Bear  — narrative still true? ___  bands moved? ___  why: __________
  Base  — narrative still true? ___  bands moved? ___  why: __________
  Bull  — narrative still true? ___  bands moved? ___  why: __________

PROBABILITY shift this quarter: ____________________________

KEY NUMBERS REFRESHED:
  Net bookings: €___B  (was €___B last quarter)   →  [BEAT / MATCH / MISS]
  Q_ revenue: €___B vs. guide of €___B             →  [BEAT / MATCH / MISS]
  Gross margin: ____%  (was ___%)
  China system sales %: ____%  (was ___%)
  High-NA EUV units delivered this quarter: ____
  Full-year 2026 guidance: €___B to €___B
  DUV service restriction status: ____________________________
  TSMC High-NA timeline: ____________________________
  Intel 14A status: ____________________________

WHAT WOULD PROVE ME WRONG (for my favored case):
  ________________________________________________________

WHAT SURPRISED ME THIS QUARTER:
  ________________________________________________________
────────────────────────────────────────────
```

### Q2 2026 — (fill in after the mid-July report)
*(your first live entry goes here)*

---

## ASML-specific signals reference

The six KPIs that most move the ASML story, in priority order:

| # | KPI | Why it matters | Where to find it |
|---|-----|---------------|-----------------|
| 1 | **Net bookings (€B/quarter)** | Most predictive metric — drives revenue 12-24 months out. Ranges wildly: €2.6B (Q3 2024 crash) to €13.2B (Q4 2025 record). Everything else is a lagging indicator. | ASML earnings press release, first bullet |
| 2 | **EUV unit shipments (vs. 60+ 2026 target)** | Annual EUV unit count directly drives revenue. Each Low-NA unit ≈ €200M+; each High-NA ≈ €380M+. Ramp from ~50 (2025) to 60+ (2026) is the earnings engine. | ASML earnings presentation, technology section |
| 3 | **High-NA EUV deliveries per quarter** | At €380M+, each High-NA unit is nearly 2× a standard EUV. ASML is the world's only supplier. 2 units in Q1 2026; tracking toward 10-15+ by 2027. | ASML earnings press release |
| 4 | **China revenue % / DUV service restriction risk** | China fell from 36% → 19% of system sales in one quarter. If DUV service bans land, another €1-2B/yr of IBM revenue disappears. The policy line between "no new sales" and "no servicing either" is the key risk. | ASML geographic breakdown, trade policy news |
| 5 | **Installed Base Management revenue (€B/quarter)** | Currently €2.5B/quarter; grows as the installed base (500+ machines) ages and requires upgrades. The long-term compounding engine — mostly independent of new machine orders. | ASML earnings, IBM segment line |
| 6 | **Gross margin % trend toward 55%** | At 53% now. Path to 55%+ requires more High-NA (higher ASP), more IBM, less DUV/China. Gross margin is the proof point that the product cycle is shifting toward higher-value tools. | ASML earnings press release |

---

*Not financial advice. This is a personal reasoning tool. ASML's monopoly is real and durable — but cyclicality is also real and has already bit once (2024). Every band and probability here is your own estimate, to be revised freely as the world changes.*
