# ASML Thesis — Quarterly Update Checklist

*A pre-flight checklist for your TH3SIS dashboard. Run it every quarter, right after ASML's earnings report — even when nothing looks wrong. The whole point is to catch the quarter where the world quietly moved and your thesis didn't.*

**⚠ Currency note:** ASML reports in EUR. The dashboard prices are USD (NASDAQ ADR, 1:1 ratio with Amsterdam shares). When refreshing: update the EUR/USD rate in the config comment, and recalculate any EUR EPS × multiple price targets accordingly. At build date (2026-07-16), EUR/USD ≈ 1.147.

**⚠ Bookings disclosure retired (2026-07-16 update):** ASML stopped publishing quarterly net bookings starting Q1 2026 — management said single large orders arrive unevenly and distort the trend. This checklist and the dashboard's core KPI (`SIGNALS` row 1/2, `KPI_HIST`/`KPI_PROJ`) were repurposed from bookings to quarterly-revenue-vs-guide as the best available substitute. If ASML ever resumes bookings disclosure, revert this — it was a genuinely better forward signal when available.

**⚠ Revenue lumpiness warning:** ASML's quarterly revenue is driven by individual machine shipments at €150M–€380M each. A one-machine timing slip can move a quarterly print by €200M+. Don't over-react to a single miss if it's shipping-timing noise.

**Earnings calendar:** ASML reports roughly mid-January / mid-April / mid-July / mid-October.
Next scheduled: **Q3 2026, mid-October 2026**. Run this within a week of the print, while details are fresh.

---

## How this works

Two layers. Most people only do Layer 1 and slowly drift into being wrong.

- **Layer 1 — Refresh the numbers.** Mechanical. ~15 minutes. Plug in what happened.
- **Layer 2 — Audit the thesis.** Judgment. ~30 minutes. Ask whether the three cases themselves still make sense.

**⚠ ASML migrated to the engine split (2026-07-16).** Everything you edit each quarter now
lives in **`thesis-data.js`**, not `asml-thesis.html` — the HTML file is a thin shell that
just loads `thesis-data.js` + the shared `../engine/thesis-engine.js`. All the item
references below (`AS_OF_DATE`, `CASES`, `SIGNALS`, `TRACK_ALL`, etc.) refer to
`thesis-data.js`'s top-of-file "EDIT EVERYTHING IN THIS FILE EACH QUARTER" block.

---

## LAYER 1 — Refresh the numbers

Work top to bottom through the edit block. Tick each one.

- [ ] **1. `AS_OF_DATE`** — set to today (`"YYYY-MM-DD"`).
- [ ] **2. `NOW_PRICE`** — ASML's current NASDAQ ADR price (USD). Check NASDAQ:ASML, not Amsterdam ASML.AS (different currency).
- [ ] **3. `HISTORY`** — Roll the price line forward. Replace the old `NOW` entry with the just-finished quarter's actual USD close (e.g. `{ q: "Q2 26", p: <price> }`), then add a fresh `{ q: "NOW", p: NOW_PRICE }` at the end.
- [ ] **4. `FUTURE_Q`** — Roll the four forward labels one step (e.g. after Q2 2026 reports: `["Q3 26", "Q4 26", "Q1 27", "Q2 27"]`).
- [ ] **5. `PROJ_END` + each case's `target12`** — The bear/base/bull 12-month USD price targets. These are `EUR EPS × multiple × EUR/USD`. If EUR/USD has moved, recalculate. *(Revisit properly in Layer 2.)*
- [ ] **6. `SIGNALS` and `MARGIN`** — Update `tag`, `next`, and `pos` for each row:
  - **Quarterly Revenue vs. Guide:** Update `val` and `guide` with the just-reported quarter's actual and the NEW forward guide. Tag `BEAT` if above the guide range, `MATCH` inside it, `MISS` below.
  - **FY26 Revenue vs. Guide:** Update the full-year guide (currently €43–45B) and whether it moved. Tag `MISS` if walked back, `MATCH` if held, `BEAT` if raised again.
  - **China Revenue %:** Update with the new China sales %. Tag `MISS` if a service restriction was announced.
  - **Gross Margin %:** Update with reported GM. Tag `BEAT` if above guide range, `MATCH` inside it, `MISS` below.
  - **High-NA EUV Unit Deliveries:** Update count of units shipped this quarter against the FY26 guide (currently 4–5 units).
- [ ] **7. `KPI_HIST`** — Update to the just-reported quarter's actual net sales (€B). (Was net bookings — retired starting Q1 2026, see the warning above.)
- [ ] **8. `KPI_PROJ`** — Revise the 4-quarter forward REVENUE forecasts per case, cross-checked against ASML's own quarterly guide + the FY26/FY27 guidance framework. If the FY guide gets raised again: raise the base projection. If walked back: lower it.
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
1. **EUR/USD EPS estimate:** Has consensus 2026E (currently ~$36.62 / ~€32) or 2027E (~$49.46 / ~€43) moved? A 10% EPS revision = 10% change in intrinsic value before any multiple movement.
2. **EUR/USD rate:** Has the exchange rate shifted? This changes USD price targets even if EUR EPS is unchanged.
3. **Multiple:** Has the market's confidence in the cycle changed? ASML has traded between ~28x (trough fear, 2024) and ~50x (peak excitement, current). The 2026-07-16 update re-anchored target12 bands to 2027E EPS (since "12 months forward" from mid-2026 now reaches mid-2027) at bear ~28x / base ~40x / bull ~52x.

→ Update `PROJ_END` and `target12` if any of these three inputs changed materially.

**C. Did the triggers move?**
Are the KPIs in `SIGNALS` / `MARGIN` still the right things to watch?

*Risks that could shift KPI priorities:*
- **Structural (2026-07-16):** ASML retired quarterly net bookings disclosure starting Q1 2026 — the single most-predictive KPI this thesis was built around no longer exists as a hard number. Repurposed to revenue-vs-guide (see warning at top of file). If bookings disclosure ever resumes, that should immediately become the primary KPI again.
- If China has fully normalized at 10-12% → the China % KPI becomes less urgent; shift focus to whether Europe/US can fully replace lost demand
- If High-NA has ramped past its 4-5 unit 2026 guide → shift focus to High-NA ASP trajectory and whether volumes hold into 2027
- If Intel 14A fails to yield → Intel drops out of High-NA, and the question becomes whether TSMC/Samsung fill the gap
- If ASML gives a 2027 revenue framework (flagged as a live possibility per the Q2 2026 "close to fully covered" order commentary) → that becomes the new primary forward KPI, replacing revenue-vs-guide

→ Swap out answered questions for the risks that now matter.

**D. Did the probability shift?**
Which case is most likely *now*? Starting assessment (May 2026): Base 55%, Bull 35%, Bear 10%.
**Updated 2026-07-16 (post Q2 2026 beat-and-raise): Base 50%, Bull 35%, Bear 15%.** Base stays most likely — the ~50x 2026E multiple already prices in a lot of the good news, so a beat alone doesn't automatically mean bull. Bear ticked UP slightly (not down) despite the beat, because the loss of bookings visibility means there's no hard number left to defend the current multiple if Q3/Q4 merely match instead of beat again — multiple-compression risk is real even without a fundamental miss.

→ Note any shift in the log below.

---

## THE TWO HABITS THAT MAKE THIS WORTH DOING

### Habit 1 — "What would prove me wrong?"
For whichever case you currently believe most, name the **single piece of evidence that would force you to abandon it.**

*For the base case (2026-07-16 update):* With bookings disclosure gone, the kill-switch is now the FY26 revenue guide itself getting walked back from €43–45B — that would be the closest available proxy to "customers are genuinely deferring," since there's no bookings print left to catch it earlier. A single Q3 miss against the €11.0–12.0B guide would be a yellow flag; the guide actually being lowered (not just one lumpy quarter) is the real kill-switch. At that point the ~50x multiple becomes unjustifiable and the stock re-rates toward 28-32x.

### Habit 2 — "What surprised me?"
Write the one thing this quarter you *didn't* see coming.

> **2026-07-16:** ASML retiring quarterly bookings disclosure was the real surprise this quarter — not the beat itself (which was well-flagged going in). The thesis was explicitly built around "bookings is the single most market-moving number" and that number is now gone. This is a genuine structural downgrade in visibility even though the fundamentals just got better, and it's worth remembering the next time this thesis feels too confident: the market lost a leading indicator the same quarter it re-rated the stock up.
>
> A caution specific to ASML: **the monopoly narrative is seductive precisely because it's largely true.** No one else makes EUV. No one else makes High-NA. The installed base really does generate recurring revenue. The temptation is to conclude that the monopoly makes the stock "safe" — it doesn't. Q3 2024's €2.6B bookings happened despite the monopoly being intact. Cyclicality is real. At ~50x forward 2026E P/E, you are paying a monopoly premium plus a growth premium, and both need to be right simultaneously — with less visibility than a quarter ago. Hold the bands wide.

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

### Q2 2026 — updated 2026-07-16
```
────────────────────────────────────────────
QUARTER: Q2 2026          UPDATED ON: 2026-07-16
ASML ADR price at update: $1,815.27   EUR/USD at update: 1.147
Most-likely case: BASE (50%), Bull 35%, Bear 15%

Consensus 2026E EPS at update: ~€32  (~$36.62 USD)  Forward P/E: ~50x
Consensus 2027E EPS at update: ~€43  (~$49.46 USD)  Forward P/E: ~37x

THESIS AUDIT (one line each):
  Bear  — narrative still true? PARTIALLY — cyclical/China risks intact, but rewritten around
          multiple-compression-without-a-miss since bookings visibility is gone.
          bands moved? YES ($820-1,100 → $1,300-1,650). why: price re-rated up on the beat;
          bear now has to argue from a higher floor.
  Base  — narrative still true? YES, rewritten to reflect twice-raised FY26 guide.
          bands moved? YES ($1,400-1,850 → $1,900-2,300). why: anchored to 2027E EPS
          (12mo-forward window shifted) + analyst target cluster ($2,100-2,300).
  Bull  — narrative still true? YES, strengthened by TSMC's own Q2 2026 capex raise
          ($60-64B) as corroborating evidence same week.
          bands moved? YES ($1,900-2,500 → $2,400-2,800). why: tracks top of post-print
          analyst target range (Bernstein $2,623, BofA $2,345).

PROBABILITY shift this quarter: Bear ticked UP (10%→15%) despite the beat — loss of
  bookings visibility means no hard number defends the elevated multiple if Q3/Q4 merely
  match guide instead of beating again. Base ticked down slightly (55%→50%) as some
  probability mass shifted to bull given TSMC's corroborating capex raise the same week.

KEY NUMBERS REFRESHED:
  [STRUCTURAL CHANGE] Net bookings: RETIRED by ASML starting Q1 2026 — no longer disclosed.
    Repurposed core KPI to revenue-vs-guide (see warning at top of file).
  Q2 revenue: €9.3B vs. guide of €8.4-9.0B             →  BEAT
  Gross margin: 54.0%  (was ~53% Q1)
  China system sales %: ~20% of FY26 (was ~19% Q1)
  High-NA EUV units delivered this quarter: 1  (FY26 guide: 4-5 units total)
  Full-year 2026 guidance: €43B to €45B  (raised from €36-40B at Q1 — 2nd raise this year)
  DUV service restriction status: no new escalation this quarter
  TSMC capex/High-NA read-through: TSMC's own Q2 2026 print (2026-07-16) raised its capex
    guide to $60-64B and FY revenue growth guide to 40%+ — corroborates ASML's demand read
  Intel 14A status: no update this quarter; 18A now confirmed in High-NA production use

WHAT WOULD PROVE ME WRONG (for my favored case):
  FY26 revenue guide (€43-45B) gets walked back — the closest available proxy to "customers
  are deferring" now that bookings disclosure is gone.

WHAT SURPRISED ME THIS QUARTER:
  ASML retiring quarterly bookings disclosure — a real visibility downgrade in the same
  quarter the stock re-rated up on fundamentals. The thesis loses its best leading indicator
  right when the multiple most needs defending.
────────────────────────────────────────────
```

---

## ASML-specific signals reference

The six KPIs that most move the ASML story, in priority order:

| # | KPI | Why it matters | Where to find it |
|---|-----|---------------|-----------------|
| 1 | **Quarterly revenue vs. guide (€B)** *(was net bookings — retired by ASML starting Q1 2026)* | Now the most predictive metric disclosed. Bookings ranged wildly (€2.6B Q3 2024 crash to €13.2B Q4 2025 record) and was the better signal while it existed; revenue-vs-guide is lumpier but still checkable every quarter. Watch especially whether the FY26 guide (€43-45B) holds or gets revised again. | ASML earnings press release, guidance section |
| 2 | **EUV unit shipments (vs. 60+ 2026 target)** | Annual EUV unit count directly drives revenue. Each Low-NA unit ≈ €200M+; each High-NA ≈ €380M+. Ramp from ~50 (2025) to 60+ (2026) is the earnings engine. | ASML earnings presentation, technology section |
| 3 | **High-NA EUV deliveries per quarter** | At €380M+, each High-NA unit is nearly 2× a standard EUV. ASML is the world's only supplier. 2 units in Q1 2026; tracking toward 10-15+ by 2027. | ASML earnings press release |
| 4 | **China revenue % / DUV service restriction risk** | China fell from 36% → 19% of system sales in one quarter. If DUV service bans land, another €1-2B/yr of IBM revenue disappears. The policy line between "no new sales" and "no servicing either" is the key risk. | ASML geographic breakdown, trade policy news |
| 5 | **Installed Base Management revenue (€B/quarter)** | Currently €2.5B/quarter; grows as the installed base (500+ machines) ages and requires upgrades. The long-term compounding engine — mostly independent of new machine orders. | ASML earnings, IBM segment line |
| 6 | **Gross margin % trend toward 55%** | At 53% now. Path to 55%+ requires more High-NA (higher ASP), more IBM, less DUV/China. Gross margin is the proof point that the product cycle is shifting toward higher-value tools. | ASML earnings press release |

---

*Not financial advice. This is a personal reasoning tool. ASML's monopoly is real and durable — but cyclicality is also real and has already bit once (2024). Every band and probability here is your own estimate, to be revised freely as the world changes.*
