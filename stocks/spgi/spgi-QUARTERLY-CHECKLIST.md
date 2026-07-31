# SPGI Thesis — Quarterly Update Checklist

*A pre-flight checklist for your TH3SIS dashboard. Run it every quarter, right after S&P Global's earnings report — even when nothing looks wrong. The whole point is to catch the quarter where the world quietly moved and your thesis didn't.*

**Earnings calendar:** SPGI reports roughly early-Feb / late-Apr / late-Jul / late-Oct.
Next scheduled: **Jul 28, 2026** (Q2 FY2026) — the first full quarter reported as a standalone company since the Jul 1, 2026 Mobility (MBGL) spinoff, and the first call issuing formal GAAP + adjusted guidance on an ex-Mobility basis. Treat this specific print as more consequential than a normal quarterly touch: it resolves the single biggest open question this thesis has (is Q1 2026's Ratings strength durable or pulled forward?).

---

## How this works

There are **two layers** to every update. Most people only do Layer 1 and slowly drift into being wrong. You decided to do both — that's the entire value of this exercise.

- **Layer 1 — Refresh the numbers.** Mechanical. ~15 minutes. Plug in what happened.
- **Layer 2 — Audit the thesis.** Judgment. ~30 minutes. Ask whether the three cases themselves still make sense, or whether reality has overtaken them.

**This thesis was built engine-split from day one (2026-07-18).** Everything you edit each
quarter lives in **`thesis-data.js`**, not `spgi-thesis.html` — the HTML file is a thin
shell that just loads `thesis-data.js` + the shared `../engine/thesis-engine.js`. All the
item references below (`AS_OF_DATE`, `CASES`, `SIGNALS`, `TRACK_ALL`, etc.) refer to
`thesis-data.js`'s top-of-file "EDIT EVERYTHING IN THIS FILE EACH QUARTER" block.

---

## LAYER 1 — Refresh the numbers

Work top to bottom through the edit block. Tick each one.

- [ ] **1. `AS_OF_DATE`** — set to today (format `"YYYY-MM-DD"`).
- [ ] **2. `FALLBACK_PRICE`** — SPGI's current price.
- [ ] **3. `HISTORY`** — Roll the price line forward. Replace the old `NOW` entry with the just-finished quarter's actual end price, then add a fresh `{ q: "NOW", p: FALLBACK_PRICE }` at the end. Keep the list to 6–7 entries; drop the oldest if it gets crowded.
- [ ] **4. `FUTURE_Q`** — Roll the four forward-quarter labels one step. E.g. after the Q2 2026 report: `["Q3 2026", "Q4 2026", "Q1 2027", "Q2 2027"]`.
- [ ] **5. `PROJ_END` + each case's `target12`** — The bear/base/bull 12-month price targets. *(Revisit properly in Layer 2 — for now just note they exist.)*
- [ ] **6. `SIGNALS` and `MARGIN`** — For each row, update the `tag` (`BEAT` / `MATCH` / `MISS` / `WATCH`) based on what the earnings report showed, update the `next` field to the next earnings date, and nudge `pos` (0 = far bear/left, 1 = far bull/right) to reflect where reality landed.
  - Key signals to refresh: **continuing-ops revenue YoY vs. the 6-8% organic cc guide**, **Ratings billed issuance growth (vs. the guided deceleration path)**, **Indices division growth**, **the formal ex-Mobility guide once it exists**.
- [ ] **7. `KPI_HIST`** — Update to the latest actual quarterly continuing-ops revenue ($B). The Q1 2026 starting value was $3.717B (pro forma, ex-Mobility).
- [ ] **8. `KPI_PROJ`** — Revise the 4-quarter forward revenue projections per case to reflect the new guidance and trends — especially once the Jul 28, 2026 call gives a real dollar guide ex-Mobility instead of the estimated split this build used.
- [ ] **9. `TRACK_ALL`** — Append ONE new entry for the quarter that just reported. Fill in:
  - `q`: quarter label (e.g. `"Q2 2026"`)
  - `date`: reporting date in `"YYYY-MM"` format
  - `post`: where the stock traded after earnings
  - `reaction`: `"+"` / `"++"` / `"-"` / `"--"` (how the stock reacted)
  - `bear`, `base`, `bull`: the three price bands **as they stood at that report date** (not hindsight — use the bands from the prior quarter's dashboard)
  - `landed`: which zone price ended in (`"bear"`, `"base"`, `"bull"`, `"base→bull"`, etc.)
  - `conf`: `"high"` (recent data, reliable)

  **The oldest quarter drops off automatically** — the dashboard always shows the most recent 6.

- [ ] **10. `DISLOCATION_DATE` / `REVERSION_TROUGH` / `REVERSION_BASEFLOOR`** — ONLY touch these if a *new* shock happened this quarter that drove a large dislocation (>15% sudden move). If no new shock: leave as-is. The current values track the Feb 10-11, 2026 guidance-miss crash (trough $390.76, base floor $425) — durably reclaimed as of Jul 2, 2026.
- [ ] **11. `VAL_CONFIG.ntm_eps` / `peers`** — Refresh consensus NTM EPS (continuing-ops, ex-Mobility basis — this build used $18.46) and the peer comp table (SPGI, MCO, MSCI, VRSK forward P/E, EV/EBITDA, FCF yield).
- [ ] **12. Provenance snapshot** — Write a fresh `stocks/spgi/data/inputs-YYYY-QQ.json` per CLAUDE.md's schema, dated the day of this touch, capturing the price/EPS/multiples you just used — do NOT edit `inputs-2026-Q3.json`, append a new file.

> **Tip:** After saving, open the file in your browser and hover over a few things to confirm nothing reads "undefined" or looks broken. Then run `node tools/verify-thesis.js SPGI`.

---

## LAYER 2 — Audit the thesis *(the part that actually matters)*

This is **step 3 in the edit block: `CASES`.** Do not skip it. For *each* of the three cases, answer four questions out loud (or in writing). One honest sentence each is enough.

### For BEAR, then BASE, then BULL, ask:

**A. Is the narrative still true?**
Read the `op` text for this case. Has the world overtaken it?

*SPGI-specific things to check:*
- **Bear:** Did Ratings billed issuance growth decelerate faster than guided, or turn negative before Q4 2026? Did refinancing/new-issue bond activity visibly slow? Any credible NRSRO reform or new-entrant threat?
- **Base:** Did continuing-ops revenue land within the 6-8% organic cc guide? Is Ratings decelerating roughly on the schedule management gave (not faster, not slower)? Is Indices still growing double-digit?
- **Bull:** Did Ratings issuance BEAT its own guided deceleration path — i.e., stay strong into Q3/Q4, not just Q1-Q2? Is the market starting to re-rate the multiple back toward 30x+ on confirmation the post-spinoff story is cleaner?

**Multi-quarter management-tone check (do this every touch, not just once):** Compare how management talks about Ratings-issuance durability across the last 3-4 calls — Q4 2025 (Feb 2026, the guidance-miss call), Q1 2026 (Apr 2026, where they explicitly flagged hyperscaler "front-end loading"), and this quarter. Is their confidence in the Ratings deceleration path being ON schedule rising, or are they quietly pushing the "turns negative" quarter further out (a tell that reality is worse than the original guide) or pulling it earlier (a tell that reality is better)? A guide that keeps getting pushed out without being formally revised is itself a signal.

→ If the story is stale, rewrite the `op` and `breaks` text.

**B. Did the price bands move?**
Are the `target12` ranges and `PROJ_END` still right? The two levers for SPGI:
1. **EPS estimate**: Has consensus continuing-ops NTM EPS (currently ~$18.46) moved up or down? The Jul 28, 2026 call is expected to reissue this formally ex-Mobility — this could be a real, mechanical repricing input even absent any operating surprise.
2. **Multiple**: Has confidence in the ratings-duopoly/toll-booth story firmed or weakened? This build used: trough ~18x (Feb 2026 panic), normal 23-28x, peak ~34x (mid-2025 highs).

→ Update `PROJ_END` and `target12` if your EPS × multiple math changed.

**C. Did the triggers move?**
Are the KPIs in `SIGNALS` / `MARGIN` still the *right things to watch*, or has the real risk relocated?

*Risks that could change the KPI priorities:*
- If the Jul 28, 2026 call gives a clean, well-received ex-Mobility guide → the "guide uncertainty" watch item resolves; shift focus fully to Ratings issuance durability
- If Ratings issuance decelerates exactly on schedule for 2-3 straight quarters → the pull-forward question resolves in the bull/base direction; shift focus to Indices growth as the new swing factor
- If a credible NRSRO reform or new-entrant threat emerges (unlikely but not impossible given periodic regulatory scrutiny of the ratings duopoly) → it immediately becomes the #1 signal, ahead of any quarterly print
- If MBGL (Mobility Global) trades in a way that reveals the market's real view of what was "given away" in the spinoff → useful cross-check on whether SPGI's own re-rating is proceeding as expected

→ Swap out any signal that's become an answered question for the one that now matters.

**D. Did the probability shift?**
Which case is most likely *now*? Be willing to say it changed.

**Starting assessment (2026-07-18, first build):** Base ~55%, Bull ~20%, Bear ~25%. Base is the default because it requires nothing more than what management has already guided to. Bear is weighted higher than a typical "base case" thesis because the pull-forward flag is real, company-sourced, and testable within days (Jul 28) rather than theoretical. Bull is weighted lower because it requires Ratings to beat an already-optimistic-sounding Q1 print, not just meet it.

→ Note any shift in the log below.

---

## THE TWO HABITS THAT MAKE THIS WORTH DOING

### Habit 1 — "What would prove me wrong?"
For whichever case you currently believe most, write down the **single piece of evidence that would force you to abandon it.**

*For the base case (2026-07-18 build):* The kill-switch is Ratings billed issuance growth turning negative BEFORE the guided Q4 2026 deceleration, **or** two straight quarters of continuing-ops organic cc revenue missing the 6-8% guide, **or** a credible NRSRO reform/new-entrant threat. Any one alone is enough. A single soft quarter within the guided deceleration is not a break — it's the plan working. An EARLY negative print, or a guide miss repeated twice, is the signal that Q1's issuance strength really was pulled forward rather than a new run-rate.

### Habit 2 — "What surprised me?"
Write the one thing this quarter you *didn't* see coming. Over a year these notes become a map of where your model is consistently blind.

> **2026-07-18 (first build):** The most surprising thing in the research wasn't the Feb 2026 crash itself (a guidance-miss sell-off is a familiar pattern) — it was how explicit management was, on the very next call (Q1 2026, Apr 28), about the pull-forward risk in their own words: "front-end loading of hyperscaler issuance relative to initial expectations." Companies don't usually volunteer that kind of caveat about their own good numbers. It's either genuine candor (a positive signal about management credibility) or a pre-emptive expectations-reset ahead of a Q4 2026 deceleration they already know is coming either way — this thesis leans toward reading it as candor, but that's a judgment call worth re-examining each quarter, not a settled fact.
>
> Also worth flagging: SPGI's ROIC (28.9% in 2021, pre-IHS-Markit-merger) has never recovered — it sat at just 8.6% in 2025, five years after the ~$44B deal closed. That's a genuinely mixed track record on capital allocation that a purely "ratings duopoly = wonderful business" framing would gloss over. The chokepoint is real; the acquisition that was supposed to extend it has not (yet) earned an adequate return on the capital it consumed.
>
> A caution worth re-reading every time: **this dashboard looks authoritative, and that can fool its own author.** The colored bands are estimates, not forecasts with real precision. This is a brand-new build on a company mid-transition (first quarter as a standalone entity, first ex-Mobility guide not yet issued) — treat every number here as more provisional than a mature, multi-quarter-tracked thesis would be. Let the tool organize your thinking — never let it replace it. When in doubt, widen your bands and lower your confidence.

---

## QUARTERLY LOG

*Keep a running record. Future-you will learn more from this than from any single chart. Copy the block for each new quarter.*

```
────────────────────────────────────────────
QUARTER: Q_  20__          UPDATED ON: ________
SPGI price at update: $______   Most-likely case: ______
Consensus NTM EPS at update (continuing ops): $______   Forward P/E: ______x

THESIS AUDIT (one line each):
  Bear  — narrative still true? ___  bands moved? ___  why: __________
  Base  — narrative still true? ___  bands moved? ___  why: __________
  Bull  — narrative still true? ___  bands moved? ___  why: __________

PROBABILITY shift this quarter: ____________________________

KEY NUMBERS REFRESHED:
  Q_ continuing-ops revenue: $___B vs. 6-8% organic cc guide  →  [BEAT / MATCH / MISS]
  Ratings billed issuance growth: ____%  →  [ON SCHEDULE / FASTER-THAN-GUIDED DECEL / SLOWER]
  Indices division growth: ____%
  Next quarter guide: ____________________________
  NRSRO / regulatory status: [Unchanged / Under review / Threatened]

WHAT WOULD PROVE ME WRONG (for my favored case):
  ________________________________________________________

WHAT SURPRISED ME THIS QUARTER:
  ________________________________________________________
────────────────────────────────────────────
```

### Build — 2026-07-18 (first thesis, prescreen refresh + full build)
```
────────────────────────────────────────────
QUARTER: Q3 2026 (build touch)          UPDATED ON: 2026-07-18
SPGI price at update: $450.84   Most-likely case: BASE (55%), Bear 25%, Bull 20%
Consensus NTM EPS at update (continuing ops): $18.46   Forward P/E: ~24.4x

THESIS AUDIT (one line each):
  Bear  — new thesis, first vintage. Centers on the disclosed Ratings-issuance
          pull-forward flag ("front-end loading of hyperscaler issuance") and the
          guided Q4 2026 negative-growth turn. Bands: $330-390.
  Base  — new thesis, first vintage. Assumes the 6-8% organic cc guide holds and
          Ratings decelerates exactly on the schedule already given. Bands: $425-515.
  Bull  — new thesis, first vintage. Requires Ratings to beat its own guided
          deceleration and the multiple to re-rate back toward pre-Feb-2026-crash
          levels (~30-34x). Bands: $555-630.

PROBABILITY shift this quarter: n/a (first build).

KEY NUMBERS REFRESHED:
  Q1 2026 continuing-ops revenue: $3.717B (pro forma ex-Mobility, +~11% YoY est.)
  Ratings billed issuance growth: +14% YoY (Q1 2026) — guided to decelerate, negative Q4 2026
  Indices division growth: +17% YoY (Q1 2026), double-digit across every business line
  Next quarter guide: TO REPORT Jul 28, 2026 — first formal guide ex-Mobility
  NRSRO / regulatory status: Unchanged — same duopoly with MCO, no new reform signal found

WHAT WOULD PROVE ME WRONG (for my favored case, BASE):
  Ratings billed issuance growth turning negative before Q4 2026, or two straight quarters
  of continuing-ops cc revenue missing the 6-8% guide — either confirms the Q1 strength was
  pulled forward rather than durable.

WHAT SURPRISED ME THIS QUARTER:
  Management volunteering the "front-end loading" language about their own good Q1 numbers,
  and the fact that ROIC (28.9% in 2021) still has not recovered to pre-IHS-Markit-merger
  levels five years later (8.6% in 2025) — a real, honest soft spot in an otherwise clean
  chokepoint story.
────────────────────────────────────────────
```

### Update — 2026-08-01 (Q2 FY2026, reported 2026-07-28)
```
────────────────────────────────────────────
QUARTER: Q2 2026                          UPDATED ON: 2026-08-01
SPGI price at update: $411.93   Most-likely case: BASE (55%), Bear 25%, Bull 20%
Consensus NTM EPS at update (continuing ops): $17.63 (FY26 guide midpoint)   Forward P/E: ~23.4x

THESIS AUDIT (one line each):
  Bear  — narrative REWRITTEN. The original Ratings-pull-forward risk did NOT
          confirm (issuance accelerated +14%→+25%); real drag is Energy/Iran-conflict
          and Market Intelligence AI-contract sales-cycle delays — new KPIs. Bands
          rebased to $315-370 on the lower EPS anchor.
  Base  — narrative REWRITTEN. Revenue beat, Ratings/Indices guides RAISED, but
          FY26 adjusted EPS guide ($17.63 mid) landed below prior Street. Reads as
          contained, not a broken thesis. Bands: $425-515 -> $405-495.
  Bull  — narrative REWRITTEN. Ratings acceleration + raised guides argue the core
          story strengthened; bull now hinges on Energy/MI stabilizing, not on
          Ratings avoiding pull-forward (that's already looking like a non-issue).
          Bands: $555-630 -> $530-600.

PROBABILITY shift this quarter: unchanged (Base 55% / Bear 25% / Bull 20%) — the
mix of risks shifted (pull-forward risk down, Energy/MI risk up) more than the
net probability did.

KEY NUMBERS REFRESHED:
  Q2 2026 continuing-ops revenue: $3.678B (pro forma ex-Mobility, +11% YoY) → BEAT
  Ratings billed issuance growth: +25% YoY (Q2 2026, up from +14% Q1) → BEAT, guide raised 4-7%→5-8%
  Indices division growth: +20% YoY (Q2 2026), 13th straight record quarter → BEAT, guide raised 10-12%→12-14%
  FY2026 adjusted EPS guide: $17.50-17.75 (mid $17.63) vs prior Street ~$18.37-18.98 → MISS
  Energy segment growth: +2-3% YoY, pressured by Iran-conflict sanctions/GTS renewals → WATCH (new KPI)
  Market Intelligence growth: +6% YoY, elongated AI-contract sales cycles → WATCH (new KPI)
  Next quarter guide: Q3 2026 earnings ~Oct 29, 2026
  NRSRO / regulatory status: Unchanged — no new reform signal found

WHAT WOULD PROVE ME WRONG (for my favored case, BASE):
  The Energy/Market Intelligence weakness spreading into Ratings or Indices margins
  (not staying contained to those two segments), or Ratings issuance decelerating
  sharply from its current +25% pace, or two straight quarters missing the 6-8%
  organic cc revenue guide.

WHAT SURPRISED ME THIS QUARTER:
  That the stock sold off on an "EPS miss" while the metric this thesis was actually
  built to watch (Ratings issuance / pull-forward) went the OPPOSITE direction —
  accelerating, with both Ratings and Indices guides raised the same day. The real
  story was two segments (Energy, Market Intelligence) this thesis hadn't previously
  tracked as KPIs. A reminder that a kill-switch aimed at last quarter's risk can miss
  this quarter's actual one — worth re-asking "what's the real risk NOW" every touch,
  not just re-checking the same named risk.
────────────────────────────────────────────
```

---

## SPGI-specific signals reference

These are the signals that most move the SPGI story, in priority order:

| # | KPI | Why it matters | Where to find it |
|---|-----|---------------|-----------------|
| 1 | **Energy & Market Intelligence stabilization** *(new priority as of 2026-08-01)* | The actual source of the Q2 2026 EPS-guide miss — Iran-conflict/sanctions pressure on Energy's Global Trading Services renewals, and elongated AI-contract sales cycles in Market Intelligence. Whether these stabilize (base/bull) or spread into Ratings/Indices (bear) is now the central open question. | Earnings release, segment detail, management commentary |
| 2 | **Ratings billed issuance growth vs. the guided path** | Accelerated to +25% in Q2 2026 (from +14% Q1) — the original pull-forward risk has NOT materialized; guide raised to 5-8% FY26. Still worth watching for the eventual guided deceleration. | Earnings release, management commentary |
| 3 | **Continuing-ops (ex-Mobility) revenue vs. the 6-8% organic cc guide** | The headline growth number — reaffirmed at the company level Jul 28, 2026 despite the EPS-guide miss. | Earnings release |
| 4 | **Indices division growth** | The highest-margin, most durable-moat segment — 13th consecutive record quarter, +20% YoY in Q2 2026, guide raised to 12-14%. | Earnings release, segment detail |
| 5 | **NRSRO / ratings-duopoly regulatory status** | The chokepoint itself. No acute threat as of this touch, but a genuine regulatory reform or credible new entrant would be the single fastest way this thesis breaks, independent of any quarterly number. | Regulatory filings, financial media |
| 6 | **Buyback pace** | 2026 target raised to $7B+ — funds EPS growth independent of revenue and is a tell on management's own confidence in forward cash generation even as Energy/MI soften. | Earnings release, cash flow statement |

---

*Not financial advice. This is a personal reasoning tool. Every band and probability in it is your own estimate, to be revised freely as the world changes.*
