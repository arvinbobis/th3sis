# TSM Thesis — Quarterly Update Checklist

*A pre-flight checklist for your TH3SIS dashboard. Run it every quarter, right after TSMC's earnings report — even when nothing looks wrong. The whole point is to catch the quarter where the world quietly moved and your thesis didn't.*

**Earnings calendar:** TSMC reports roughly mid-January / mid-April / mid-July / mid-October.
Next scheduled: **~October 15, 2026** (Q3 2026). Run this within a week of each print, while details are fresh.

---

## How this works

There are **two layers** to every update. Most people only do Layer 1 and slowly drift into being wrong. You decided to do both — that's the entire value of this exercise.

- **Layer 1 — Refresh the numbers.** Mechanical. ~15 minutes. Plug in what happened.
- **Layer 2 — Audit the thesis.** Judgment. ~30 minutes. Ask whether the three cases themselves still make sense, or whether reality has overtaken them.

**⚠ TSM migrated to the engine split (2026-06-16).** Everything you edit each quarter now
lives in **`thesis-data.js`**, not `tsm-thesis.html` — the HTML file is a thin shell that
just loads `thesis-data.js` + the shared `../engine/thesis-engine.js`. All the item
references below (`AS_OF_DATE`, `CASES`, `SIGNALS`, `TRACK_ALL`, etc.) refer to
`thesis-data.js`'s top-of-file "EDIT EVERYTHING IN THIS FILE EACH QUARTER" block.

---

## LAYER 1 — Refresh the numbers

Work top to bottom through the edit block. Tick each one.

- [ ] **1. `AS_OF_DATE`** — set to today (format `"YYYY-MM-DD"`).
- [ ] **2. `NOW_PRICE`** — TSM's current ADR price (each ADR = 5 ordinary shares).
- [ ] **3. `HISTORY`** — Roll the price line forward. Replace the old `NOW` entry with the just-finished quarter's actual end price (e.g. change `{ q: "NOW", p: 423.93 }` into `{ q: "Q2 2026", p: <whatever> }`), then add a fresh `{ q: "NOW", p: NOW_PRICE }` at the end. Keep the list to 6–7 entries; drop the oldest if it gets crowded.
- [ ] **4. `FUTURE_Q`** — Roll the four forward-quarter labels one step. E.g. after the Q2 2026 report: `["Q3 2026", "Q4 2026", "Q1 2027", "Q2 2027"]`.
- [ ] **5. `PROJ_END` + each case's `target12`** — The bear/base/bull 12-month price targets. `PROJ_END` is where each forecast line ends on the chart; `target12` is the text label. *(Revisit properly in Layer 2 — for now just note they exist.)*
- [ ] **6. `SIGNALS` and `MARGIN`** — For each row, update the `tag` (`BEAT` / `MATCH` / `MISS` / `WATCH`) based on what the earnings report showed, update the `next` field to the next earnings date, and nudge `pos` (0 = far bear/left, 1 = far bull/right) to reflect where reality landed.
  - Key signals to refresh: **Revenue vs. quarterly guide**, **Gross margin vs. guide**, **Cross-Strait Risk Level**, **N2 (2nm) Node Ramp**.
- [ ] **7. `KPI_HIST`** — Update to the latest actual quarterly total revenue ($B). The Q1 2026 starting value was $35.9B.
- [ ] **8. `KPI_PROJ`** — Revise the 4-quarter forward revenue projections per case to reflect new guidance and trends.
- [ ] **9. `TRACK_ALL`** — Append ONE new entry for the quarter that just reported. Fill in:
  - `q`: quarter label (e.g. `"Q2 2026"`)
  - `date`: reporting date in `"YYYY-MM"` format
  - `post`: where the ADR traded after earnings
  - `reaction`: `"+"` / `"++"` / `"-"` / `"--"` (how the stock reacted)
  - `bear`, `base`, `bull`: the three price bands **as they stood at that report date** (not hindsight — use the bands from the prior quarter's dashboard)
  - `landed`: which zone price ended in (`"bear"`, `"base"`, `"bull"`, `"base→bull"`, etc.)
  - `conf`: `"high"` (recent data, reliable)

  **The oldest quarter drops off automatically** — the dashboard always shows the most recent 6.

- [ ] **10. `DISLOCATION_DATE` / `REVERSION_TROUGH` / `REVERSION_BASEFLOOR`** — ONLY touch these if a *new* geopolitical or earnings shock happened this quarter that drove a large dislocation (>15% sudden move). If no new shock: leave as-is. The current values track the April 2025 "Liberation Day" tariff-panic dislocation (trough $141, base floor $338) — already fully recovered.
- [ ] **11. `VAL_CONFIG.ntm_eps` / `peers`** — Refresh consensus NTM EPS and the peer comp table (TSM, ASML, AVGO, NVDA forward P/E, EV/EBITDA, FCF yield).

> **Tip:** After saving, open the file in your browser and hover over a few things to confirm nothing reads "undefined" or looks broken.

---

## LAYER 2 — Audit the thesis *(the part that actually matters)*

This is **step 5 in the edit block: `CASES`.** Do not skip it. For *each* of the three cases, answer four questions out loud (or in writing). One honest sentence each is enough.

### For BEAR, then BASE, then BULL, ask:

**A. Is the narrative still true?**
Read the `op` text for this case. Has the world overtaken it?

*TSM-specific things to check:*
- **Bear:** Has cross-strait tension or U.S./Taiwan export-control friction escalated since this was written? Has any hyperscaler (Microsoft, Google, Meta, Amazon) signaled an AI capex pause?
- **Base:** Did revenue and gross margin land inside the guided range? Is the N2 (2nm) ramp and CoWoS capacity expansion still on schedule?
- **Bull:** Did the quarter beat the guide high end? Was full-year 2026 guidance raised? Is the market starting to re-rate TSM toward a structural-monopoly multiple (30×+) like it has for NVDA/ASML?

→ If the story is stale, rewrite the `op` and `breaks` text.

**B. Did the price bands move?**
Are the `target12` ranges and `PROJ_END` still right? The two levers for TSM:
1. **EPS estimate**: Has consensus NTM EPS (currently ~$17.20/ADR) moved up or down?
2. **Multiple**: Has the geopolitical risk premium or AI-cycle confidence changed? Calm/confident periods see TSM trade at 20–26× NTM P/E; fear (tariff/export-control shocks) compresses it toward 14–18×; euphoria pushes it toward 30–34×.

→ Update `PROJ_END` and `target12` if your EPS × multiple math changed.

**C. Did the triggers move?**
Are the KPIs in `SIGNALS` / `MARGIN` still the *right things to watch*, or has the real risk relocated?

*Risks that could change the KPI priorities:*
- If N2 ramp has completed cleanly → shift focus from "ramp progress" to "N2 pricing/yield and the N2P/A16 follow-on"
- If AI/HPC demand is proven structurally durable across a full cycle → bear case KPIs shift from "demand" to "margin durability under geographic/capacity diversification"
- If a new export-control or tariff action lands (US or Taiwan-side) → it immediately becomes the #1 signal, ahead of any quarterly print
- If a credible alternative leading-edge foundry emerges (Samsung, Intel Foundry) → check whether TSM's pricing power is actually eroding, not just its market share narrative

→ Swap out any signal that's become an answered question for the one that now matters.

**D. Did the probability shift?**
Which case is most likely *now*? Be willing to say it changed. The starting assessment (June 2026) was: Base ~55%, Bull momentum ~30%, Bear tail ~15%.
**Updated 2026-07-16 (post Q2 2026 beat-and-raise + "sell the news" pullback): Base ~50%, Bull ~35%, Bear ~15%.** Base stays most likely — Q3's raised guide ($44.6–45.8B) is a real step up and needs to actually print before assuming a third guide raise. Bull ticked up (30%→35%) because the multiple compression on a beat is unusual and arguably makes the bull case CHEAPER to own than it was a quarter ago, not more expensive. Bear held flat — the CoWoS multi-vendor watch item (Google TPU → Intel EMIB-T) is a new, real data point but still just one data point.

→ Note any shift in the log below.

---

## THE TWO HABITS THAT MAKE THIS WORTH DOING

### Habit 1 — "What would prove me wrong?"
For whichever case you currently believe most, write down the **single piece of evidence that would force you to abandon it.**

*For the base case (2026-07-16 update):* The kill-switch is two straight quarters of revenue or gross margin missing guide, **or** a new export-control/tariff action that materially restricts advanced-node shipments, **or** a second hyperscaler following Google's Intel-EMIB-T packaging shift. Any one alone would be enough — this isn't a "all must happen" test. A single guide miss is noise; two in a row, a policy shock, or a real CoWoS-alternative trend is signal that the thesis itself is breaking, not just the quarter.

### Habit 2 — "What surprised me?"
Write the one thing this quarter you *didn't* see coming. Over a year these four notes become a map of where your model is consistently blind.

> **2026-07-16:** The surprise wasn't the beat — it was that a genuine beat-and-raise on every disclosed line (revenue, GM, OM, EPS, capex guide, growth guide) still produced a "sell the news" pullback from the pre-print high. Worth remembering: TSM had already run from ~$338 to $477.57 BEFORE the print, so a lot of the good news was arguably priced in ahead of the actual number. The forward multiple compressing on a beat (because EPS estimates rose faster than price) is the kind of divergence that's easy to miss if you only look at the raw price chart.
>
> A caution worth re-reading every time: **this dashboard looks authoritative, and that can fool its own author.** The colored bands are estimates, not forecasts with real precision. The April 2025 tariff-panic discount has fully closed — but the underlying tail risk (cross-strait tension, export controls) hasn't gone away, it's just not being priced right now. CoWoS and N2 capacity expansion rest on execution at a scale TSM has never operated at before, and the Google TPU/Intel EMIB-T packaging shift is the first real evidence CoWoS isn't unchallengeable. Let the tool organize your thinking — never let it replace it. When in doubt, widen your bands and lower your confidence.

---

## QUARTERLY LOG

*Keep a running record. Future-you will learn more from this than from any single chart. Copy the block for each new quarter.*

```
────────────────────────────────────────────
QUARTER: Q_  20__          UPDATED ON: ________
TSM ADR price at update: $______   Most-likely case: ______
Consensus NTM EPS at update: $______ /ADR   Forward P/E: ______x

THESIS AUDIT (one line each):
  Bear  — narrative still true? ___  bands moved? ___  why: __________
  Base  — narrative still true? ___  bands moved? ___  why: __________
  Bull  — narrative still true? ___  bands moved? ___  why: __________

PROBABILITY shift this quarter: ____________________________

KEY NUMBERS REFRESHED:
  Q_ revenue: $___B vs. guide of $___B  →  [BEAT / MATCH / MISS]
  Gross margin: ____%  vs. guide of ____%  →  [BEAT / MATCH / MISS]
  Next quarter guide: $___B rev / ____% GM
  N2 (2nm) ramp status: ____________________________
  Cross-strait / export-control tension level: [Low / Elevated / High / Crisis]

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
TSM ADR price at update: $407 (est.)   Most-likely case: BASE (50%), Bull 35%, Bear 15%
Consensus NTM EPS at update: $18.75/ADR (was $17.20)   Forward P/E: ~22x (was ~28x pre-print)

THESIS AUDIT (one line each):
  Bear  — narrative still true? PARTIALLY — reframed around "priced for perfection after
          two beats" instead of "ramp stalls"; added CoWoS multi-vendor watch (Google
          TPU -> Intel EMIB-T, one data point).
          bands moved? YES ($250-295 -> $265-335). why: EPS estimate rose.
  Base  — narrative still true? YES, rewritten around the beat-and-raise + pullback.
          bands moved? YES ($415-500 -> $375-490). why: base floor actually LOWERED in
          dollar terms even though fundamentals improved, because price fell further
          than EPS rose -- the current price now sits INSIDE base instead of below it.
  Bull  — narrative still true? YES, strengthened -- FY26 capex/growth guide both raised,
          new $100B US pledge, GS/analyst price targets raised post-print.
          bands moved? YES ($555-650 -> $565-640). why: tracks updated NTM EPS x
          unchanged 30-34x bull multiple range.

PROBABILITY shift this quarter: Bull ticked UP (30%->35%) -- multiple compression on a
  genuine beat is unusual and makes the bull case cheaper to own, not more expensive.
  Base ticked down slightly (55%->50%) as some mass shifted to bull. Bear held flat (15%).

KEY NUMBERS REFRESHED:
  Q2 revenue: $40.2B vs. guide of $39.0-40.2B          →  BEAT (guide's own high end)
  Gross margin: 67.7%  vs. guide of 65.5-67.5%          →  BEAT
  Operating margin: 60.3% vs. guide of 56.5-58.5%       →  BEAT
  EPS: $4.31 vs. ~$3.80 consensus                        →  BEAT
  Next quarter guide: $44.6-45.8B rev / 65.0-67.0% GM / 56.0-58.0% OM
  FY26 capex guide: RAISED to $60-64B (was $52-56B)
  FY26 USD revenue growth guide: RAISED to "slightly above 40%" (was ">30%")
  N2 (2nm) ramp status: first real revenue quarter -- 3% of wafer revenue; Intel 18A-class
    competitive pressure not a factor here (TSM's own node), tracking on schedule
  Cross-strait / export-control tension level: Elevated but stable -- new $100B US pledge
    ($265B total) is a goodwill/hedge move, not a response to fresh escalation
  NEW WATCH ITEM: Google TPU ("Humufish") shifting some advanced-packaging work from TSMC
    CoWoS to Intel EMIB-T -- first hard evidence of a non-TSMC design win (RADAR gap,
    flagged 2026-07-01, addressed this update)

WHAT WOULD PROVE ME WRONG (for my favored case):
  Q3 2026 misses the newly-raised $44.6-45.8B guide, or a second hyperscaler follows
  Google's Intel-EMIB-T packaging shift -- either would mean this quarter's beat-and-raise
  was the peak, not a new baseline.

WHAT SURPRISED ME THIS QUARTER:
  A beat-and-raise on every disclosed line still produced a "sell the news" pullback --
  the stock had already run hard pre-print, so a lot of the good news was priced in before
  the actual number landed. The forward multiple actually got CHEAPER on a beat.
────────────────────────────────────────────
```

---

## TSM-specific signals reference

These are the signals that most move the TSM story, in priority order:

| # | KPI | Why it matters | Where to find it |
|---|-----|---------------|-----------------|
| 1 | **Revenue vs. quarterly guide** | Near-term demand litmus test. TSMC guides conservatively — a miss matters more than a beat. Q2 2026: $40.2B actual, +33.7% YoY, beat the $39.0–40.2B guide's own high end. | Earnings release |
| 2 | **Gross margin vs. guide** | At 67.7% in Q2 2026, above its own guided range and long-run target band. Capacity expansion (overseas fabs, N2 ramp costs) is the structural drag risk. Q3 2026 guide: 65.0–67.0%. | Earnings release |
| 3 | **Cross-Strait Risk Level** | The non-financial variable that can compress the multiple regardless of fundamentals — doesn't show up in any quarterly number until it does. Watch continuously, not just quarterly. | News, US/Taiwan trade-policy and export-control announcements |
| 4 | **N2 (2nm) node ramp** | The next pricing/margin lever and the thing the bull case needs to stay ahead of schedule. Now a real (if small, ~3% of wafer revenue) contributor as of Q2 2026. | TSMC management commentary, earnings call |
| 5 | **CoWoS / advanced-packaging capacity — AND multi-vendor risk** | The bottleneck that has constrained AI-accelerator supply for two years. Continued expansion is required for the base case to hold — but also watch whether Google's TPU shift to Intel EMIB-T (first flagged Jul 2026) becomes a trend, not just a data point. | TSMC management commentary, customer (NVIDIA, Google) supply-chain checks |
| 6 | **Full-year 2026 capex/revenue guidance revisions** | The single clearest tell on whether management sees the AI/HPC buildout accelerating or decelerating. Raised twice now (capex to $60–64B, USD revenue growth to "slightly above 40%"). | Earnings release / guidance call |

---

*Not financial advice. This is a personal reasoning tool. Every band and probability in it is your own estimate, to be revised freely as the world changes.*
