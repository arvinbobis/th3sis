# NVDA Thesis — Quarterly Update Checklist

*A pre-flight checklist for your TH3SIS dashboard. Run it every quarter, right after NVIDIA's earnings report — even when nothing looks wrong. The whole point is to catch the quarter where the world quietly moved and your thesis didn't.*

**⚠ NVIDIA fiscal year note:** NVIDIA's FY ends in late January. "Q2 FY2027" = the May–July 2026 calendar quarter, reports ~August 2026. Adjust dates accordingly.

**Earnings calendar:** NVIDIA reports roughly late February / late May / late August / late November.
Next scheduled: **Q2 FY2027 ~August 2026**. Run this within a week of each print, while details are fresh.

---

## How this works

Two layers. Most people only do Layer 1 and slowly drift into being wrong.

- **Layer 1 — Refresh the numbers.** Mechanical. ~15 minutes. Plug in what happened.
- **Layer 2 — Audit the thesis.** Judgment. ~30 minutes. Ask whether the three cases themselves still make sense.

Open `NVDA-thesis.html` in a text editor. Everything you edit lives in the block at the top marked **"EDIT EVERYTHING IN THIS BLOCK EACH QUARTER."**

---

## LAYER 1 — Refresh the numbers

Work top to bottom through the edit block. Tick each one.

- [ ] **1. `AS_OF_DATE`** — set to today (format `"YYYY-MM-DD"`).
- [ ] **2. `NOW_PRICE`** — NVDA's current share price.
- [ ] **3. `HISTORY`** — Roll the price line forward. Replace the old `NOW` entry with the just-finished quarter's actual close (e.g. `{ q: "Q1 26", p: <price> }`), then add a fresh `{ q: "NOW", p: NOW_PRICE }` at the end. Note: use calendar quarter labels (Q1 26, Q2 26…) for history even though NVIDIA uses fiscal quarters in earnings.
- [ ] **4. `FUTURE_Q`** — Roll the four forward fiscal-quarter labels one step (e.g. after Q2 FY27 reports: `["Q3 FY27", "Q4 FY27", "Q1 FY28", "Q2 FY28"]`).
- [ ] **5. `PROJ_END` + each case's `target12`** — The bear/base/bull 12-month price targets. `PROJ_END` drives the chart forecast line; `target12` is the text label. *(Revisit properly in Layer 2.)*
- [ ] **6. `SIGNALS` and `MARGIN`** — For each row, update the `tag` (`BEAT` / `MATCH` / `MISS` / `WATCH`) based on the earnings report, update `next` to the next quarter, and nudge `pos` to reflect where reality landed.
  - Key signals to refresh: **Data Center Revenue**, **Revenue vs. Guide**, **China Recovery**, **Gross Margin %**, **CUDA Moat / Competitive Pos**.
- [ ] **7. `KPI_HIST`** — Update to the latest actual non-GAAP gross margin % (starting value: 75%, Q1 FY2027).
- [ ] **8. `KPI_PROJ`** — Revise the 4-quarter forward gross margin projections per case, reflecting new guidance and competitive dynamics.
- [ ] **9. `TRACK_ALL`** — Append ONE new entry for the quarter just reported:
  - `q`: fiscal quarter label (e.g. `"Q2 FY27"`)
  - `date`: reporting date in `"YYYY-MM"` format
  - `post`: where the stock traded after earnings
  - `reaction`: `"+"` / `"++"` / `"-"` / `"--"`
  - `bear`, `base`, `bull`: the three price bands **as they stood at THAT report date** (use the prior quarter's dashboard bands — no hindsight)
  - `landed`: which zone price ended in (`"bear"`, `"base"`, `"bull"`, `"base→bull"`, etc.)
  - `conf`: `"high"` for recent data

  **Oldest quarter drops automatically** — the dashboard always shows the last 6.

- [ ] **10. `DISLOCATION_DATE` etc.** — Only touch if a *new* major shock (>15% sudden drop) happens. Current values track the May 2025 H20 write-off dislocation — already fully recovered. If a new shock happens: update the date, `REVERSION_TROUGH` (new low), `REVERSION_BASEFLOOR` (bottom of new base band).

> **Tip:** After saving, open the file in your browser and hover a few data points to confirm nothing reads "undefined".

---

## LAYER 2 — Audit the thesis *(the part that actually matters)*

This is **step 5 in the edit block: `CASES`.** Do not skip it. For *each* of the three cases, answer four questions. One honest sentence each is enough.

### For BEAR, then BASE, then BULL, ask:

**A. Is the narrative still true?**

*NVDA-specific things to check after each quarter:*
- **Bear:** Did any major hyperscaler (Google, AWS, Azure, Meta) explicitly signal they're shifting inference workloads from NVIDIA to in-house silicon? Did gross margin compress by more than 1 full point without guidance recovery? Did the China situation worsen (new restrictions, broader ban)?
- **Base:** Did Blackwell/Blackwell Ultra ship to guidance? Did gross margins hold above 73%? Did hyperscaler commentary stay "NVIDIA + custom" rather than "mainly custom"? Did TSMC CoWoS supply keep up with demand?
- **Bull:** Did China H200 deliveries begin at any scale? Did NVIDIA announce Rubin customer shipments ahead of schedule? Did gross margin guide above 77%? Did NIM / NeMo software licensing appear as a revenue line?

→ If the story is stale, rewrite the `op` and `breaks` text.

**B. Did the price bands move?**
The two levers for NVDA:
1. **EPS estimate:** Has consensus FY2027E EPS (currently $8.47) or FY2028E ($11.57) moved materially? A 10% EPS revision = 10% change in base-case intrinsic value.
2. **Multiple:** Has the market's willingness to pay changed? NVDA has ranged from ~17x (H20 panic) to ~55x (2024 AI peak). Current ~25x. If AI enthusiasm cools: multiple compresses. If China recovers + Rubin beats: multiple expands.

→ Update `PROJ_END` and `target12` if your EPS × multiple math changed.

**C. Did the triggers move?**
Are the KPIs in `SIGNALS` / `MARGIN` still the right things to watch?

*Risks that could shift the KPI priorities:*
- If Rubin has fully ramped → data center revenue cadence becomes less useful; shift focus to Rubin ASP and yield
- If China fully unlocked → China is no longer a "recovery catalyst" and becomes standard revenue; focus shifts to next restriction risk
- If gross margin has sustainably exceeded 78% → focus shifts to next margin ceiling (NIM licensing? Grace CPU attach rate?)
- If AMD MI400 ships in volume → track hyperscaler adoption rate of MI400 vs. NVIDIA in new cluster buildouts

→ Swap out any KPI that's become an answered question.

**D. Did the probability shift?**
Which case is most likely *now*? Starting assessment (May 2026): **Base 50%, Bull 35%, Bear 15%**.

→ Note any shift in the log below.

---

## THE TWO HABITS THAT MAKE THIS WORTH DOING

### Habit 1 — "What would prove me wrong?"
For whichever case you currently believe most, name the **single piece of evidence that would force you to abandon it.**

*For the base case (most likely at time of writing):* The kill-switch is two consecutive quarters of gross margin contraction below 70% **while** a major hyperscaler explicitly reduces NVIDIA GPU orders in favor of in-house silicon. Gross margin alone could be mix-shift noise. A hyperscaler order reduction alone could be temporary. Both together = the structural erosion thesis is real.

### Habit 2 — "What surprised me?"
Write the one thing this quarter you *didn't* see coming.

> A caution worth re-reading every time: **NVDA is priced at exactly base fair value right now — $213 at 25x forward P/E on $8.47 EPS. That means the stock has already priced in clean execution of a $375B revenue year.** Nothing about a 25x P/E on a company growing 85% YoY is intrinsically scary. But it does mean: every beat is expected, every miss is punished, and the bear case doesn't need a catastrophe — it just needs a few quarters of "only good, not great." Hold the bands loosely. The competitive dynamics here are novel and move fast.

---

## QUARTERLY LOG

*Keep a running record. Copy the block for each new quarter.*

```
────────────────────────────────────────────
QUARTER: Q_ FY__          UPDATED ON: ________
NVDA price at update: $______   Most-likely case: ______
Consensus FY2027E EPS: $______   FY2028E EPS: $______   Forward P/E: ______x

THESIS AUDIT (one line each):
  Bear  — narrative still true? ___  bands moved? ___  why: __________
  Base  — narrative still true? ___  bands moved? ___  why: __________
  Bull  — narrative still true? ___  bands moved? ___  why: __________

PROBABILITY shift this quarter: ____________________________

KEY NUMBERS REFRESHED:
  Data center revenue: $___B  (was $___B)
  Total revenue vs. guide: $___B vs $___B  →  [BEAT / MATCH / MISS]
  Non-GAAP gross margin: ____%  (was ___%)
  FY2027 full-year revenue guidance: $____B
  China status: ____________________________
  Rubin / Blackwell Ultra ramp status: ____________________________
  CUDA moat signal (hyperscaler commentary): ____________________________

WHAT WOULD PROVE ME WRONG (for my favored case):
  ________________________________________________________

WHAT SURPRISED ME THIS QUARTER:
  ________________________________________________________
────────────────────────────────────────────
```

### Q2 FY2027 — (fill in after the ~August 2026 report)
*(your first live entry goes here)*

---

## NVDA-specific signals reference

The six KPIs that most move the NVIDIA story, in priority order:

| # | KPI | Why it matters | Where to find it |
|---|-----|---------------|-----------------|
| 1 | **Data center quarterly revenue run rate** | 92% of all revenue. $75B now, guiding $83–84B next. If this plateaus, everything stalls. | NVIDIA earnings press release |
| 2 | **Non-GAAP gross margin %** | The first signal of competitive pressure — it moves before revenue does. Threshold: ≥73% base, <70% warning. | NVIDIA earnings press release |
| 3 | **China revenue recovery** | Lost ~$15–20B/year from H20 ban. Any restoration = pure upside; any tightening = downside. Binary. | Trade policy news, earnings commentary |
| 4 | **Hyperscaler CapEx mix (NVIDIA vs. custom silicon)** | Google, AWS, Azure, Meta all building in-house chips. Track whether % going to NVIDIA is stable or declining. | Hyperscaler quarterly earnings calls |
| 5 | **Rubin / Blackwell Ultra supply chain** | TSMC CoWoS and HBM4 gate next cycle. Demand clearly exists; supply is the question. | NVIDIA press releases, TSMC commentary |
| 6 | **CUDA / software ecosystem stickiness** | NIM, NeMo, DGX OS. The software moat is what justifies the hardware premium. Observable via developer tooling adoption, NVIDIA AI Enterprise revenue mentions. | Earnings call, developer conference announcements |

---

*Not financial advice. This is a personal reasoning tool. Every band and probability is your own estimate, to be revised freely as the world changes. NVIDIA's competitive position in AI can shift faster than a quarterly checklist can track — stay alert to news between prints.*
