# NOW Thesis — Quarterly Update Checklist

*A pre-flight checklist for your TH3SIS dashboard. Run it every quarter, right after ServiceNow's earnings report — even when nothing looks wrong. The whole point is to catch the quarter where the world quietly moved and your thesis didn't.*

**Earnings calendar:** NOW reports roughly late-Jan / late-Apr / late-Jul / late-Oct.
Next scheduled: **~Oct 28, 2026** (Q3 FY2026) — the report that most directly tests this
thesis' central open question: does subscription revenue keep compounding in the low-20s%
while AI ACV scales, or does cRPO growth start decelerating alongside AI ACV growth (the
cannibalization tell)?

---

## How this works

There are **two layers** to every update. Most people only do Layer 1 and slowly drift into being wrong. You decided to do both — that's the entire value of this exercise.

- **Layer 1 — Refresh the numbers.** Mechanical. ~15 minutes. Plug in what happened.
- **Layer 2 — Audit the thesis.** Judgment. ~30 minutes. Ask whether the three cases themselves still make sense, or whether reality has overtaken them.

**This thesis was built engine-split from day one (2026-08-01).** Everything you edit each
quarter lives in **`thesis-data.js`**, not `now-thesis.html` — the HTML file is a thin
shell that just loads `thesis-data.js` + the shared `../engine/thesis-engine.js`. All the
item references below (`AS_OF_DATE`, `CASES`, `SIGNALS`, `TRACK_ALL`, etc.) refer to
`thesis-data.js`'s top-of-file "EDIT EVERYTHING IN THIS FILE EACH QUARTER" block.

---

## LAYER 1 — Refresh the numbers

Work top to bottom through the edit block. Tick each one.

- [ ] **1. `AS_OF_DATE`** — set to today (format `"YYYY-MM-DD"`).
- [ ] **2. `FALLBACK_PRICE`** — NOW's current price.
- [ ] **3. `HISTORY`** — Roll the price line forward. Replace the old `NOW` entry with the just-finished quarter's actual end price, then add a fresh `{ q: "NOW", p: FALLBACK_PRICE }` at the end. Keep the list to 6–7 entries; drop the oldest if it gets crowded.
- [ ] **4. `FUTURE_Q`** — Roll the four forward-quarter labels one step. E.g. after the Q3 2026 report: `["Q4 2026", "Q1 2027", "Q2 2027", "Q3 2027"]`.
- [ ] **5. `PROJ_END` + each case's `target12`** — The bear/base/bull 12-month price targets. *(Revisit properly in Layer 2 — for now just note they exist.)*
- [ ] **6. `SIGNALS` and `MARGIN`** — For each row, update the `tag` (`BEAT` / `MATCH` / `MISS` / `WATCH`) based on what the earnings report showed, update the `next` field to the next earnings date, and nudge `pos` (0 = far bear/left, 1 = far bull/right) to reflect where reality landed.
  - Key signals to refresh: **subscription revenue YoY vs. the guide**, **cRPO growth (currently +21% YoY — the cannibalization tell)**, **AI ACV level and growth rate**, **renewal rate (98% floor)**, **non-GAAP operating margin vs. the 31.5% FY26 guide**.
- [ ] **7. `KPI_HIST`** — Update to the latest actual quarterly subscription revenue ($B). The Q2 2026 starting value was $3.877B.
- [ ] **8. `KPI_PROJ`** — Revise the 4-quarter forward subscription-revenue projections per case to reflect the new guidance — especially the Q3/Q4 2026 split once Q3 actually reports (Q4 is seasonally NOW's strongest quarter).
- [ ] **9. `TRACK_ALL`** — Append ONE new entry for the quarter that just reported. Fill in:
  - `q`: quarter label (e.g. `"Q3 2026"`)
  - `date`: reporting date in `"YYYY-MM"` format
  - `post`: where the stock traded after earnings (note: Q2 2026 had a same-day round-trip — $95.46 intraday low then $115.76 within a week — pick the settled post-earnings level, not the intraday extreme)
  - `reaction`: `"+"` / `"++"` / `"-"` / `"--"` (how the stock reacted)
  - `bear`, `base`, `bull`: the three price bands **as they stood at that report date** (not hindsight — use the bands from the prior quarter's dashboard)
  - `landed`: which zone price ended in (`"bear"`, `"base"`, `"bull"`, `"bear→base"`, etc.)
  - `conf`: `"high"` (recent data, reliable) — this build's 2025 quarters are `"low"`/`"med"` since they were reconstructed retroactively (brand-new thesis, no real-time archive), so the first genuinely real-time entry (Q3 2026) will be the first `"high"`-confidence one that wasn't reconstructed.

  **The oldest quarter drops off automatically** — the dashboard always shows the most recent 6.

- [ ] **10. `DISLOCATION_DATE` / `REVERSION_TROUGH` / `REVERSION_BASEFLOOR`** — ONLY touch these if a *new* shock happened this quarter that drove a large dislocation (>15% sudden move). If no new shock: leave as-is. The current values track the Apr 10, 2026 "AI eats SaaS seats" trough ($83.00, base floor $102) — a choppy, twice-tested reclaim, not yet fully durable as of this build.
- [ ] **11. `VAL_CONFIG.ntm_eps` / `peers`** — Refresh blended NTM non-GAAP EPS consensus (this build used $4.45, blended from FY26 $4.07 + FY27 $5.01) and the peer comp table (NOW, CRM, WDAY, SNOW forward P/E, EV/EBITDA, FCF yield).
- [ ] **12. Provenance snapshot** — Write a fresh `stocks/now/data/inputs-YYYY-QQ.json` per CLAUDE.md's schema, dated the day of this touch, capturing the price/EPS/multiples you just used — do NOT edit `inputs-2026-Q3.json`, append a new file.

> **Tip:** After saving, open the file in your browser and hover over a few things to confirm nothing reads "undefined" or looks broken. Then run `node tools/verify-thesis.js NOW`.

---

## LAYER 2 — Audit the thesis *(the part that actually matters)*

This is **step 3 in the edit block: `CASES`.** Do not skip it. For *each* of the three cases, answer four questions out loud (or in writing). One honest sentence each is enough.

### For BEAR, then BASE, then BULL, ask:

**A. Is the narrative still true?**
Read the `op` text for this case. Has the world overtaken it?

*NOW-specific things to check:*
- **Bear:** Did subscription revenue growth decelerate toward high-single-digits? Did cRPO growth slip below ~15% while AI ACV kept growing (the cannibalization signature)? Did renewal rate crack below 98%? Any credible evidence of a large customer replacing core ServiceNow workflows with an in-house agentic stack?
- **Base:** Did subscription revenue land within guide? Is AI ACV scaling WITHOUT a corresponding cRPO deceleration? Did the non-GAAP operating margin track toward the 31.5% FY26 guide?
- **Bull:** Did cRPO reaccelerate above 22%? Was FY26 guidance raised a second time? Is the market visibly starting to re-rate the multiple back above 30x on confirmation the AI-monetization story is real and additive?

**Multi-quarter management-tone check (do this every touch, not just once):** Compare how management talks about AI ACV / agentic monetization across the last 3-4 calls — Q4 2025 (Jan 2026, the call right as the "AI eats SaaS seats" selloff began), Q1 2026 (Apr 2026, near the derate trough), Q2 2026 (Jul 2026, the beat-and-raise), and this quarter. Is their confidence that AI Agents/Now Assist are ADDING to subscription revenue (not substituting for it) getting more specific and metric-backed over time, or vaguer? A management team that keeps citing the SAME headline number (e.g. "$1B ACV") without a fresh cRPO/net-new-ACV breakdown each quarter is a tell worth noting — specificity fading is itself a signal.

→ If the story is stale, rewrite the `op` and `breaks` text.

**B. Did the price bands move?**
Are the `target12` ranges and `PROJ_END` still right? The two levers for NOW:
1. **EPS estimate**: Has blended NTM non-GAAP consensus (currently ~$4.45) moved up or down? Watch for ServiceNow's historically back-half-weighted EPS pattern (H1 2026 actual was $1.71 of a $4.07 FY26 consensus) — a Q3/Q4 guide surprise is a real, mechanical repricing input even absent any operating surprise.
2. **Multiple**: Has confidence in the AI-monetization-not-cannibalization story firmed or weakened? This build used: trough 18-21x (deep "AI eats SaaS seats" fear), normal 23-30x (today's regime), bull 33-42x (partial re-rating back toward 2023-2024 levels, still well short of the 60-90x EV/EBITDA-implied peak of that era).

→ Update `PROJ_END` and `target12` if your EPS × multiple math changed.

**C. Did the triggers move?**
Are the KPIs in `SIGNALS` / `MARGIN` still the *right things to watch*, or has the real risk relocated?

*Risks that could change the KPI priorities:*
- If Q3/Q4 2026 show cRPO reaccelerating alongside AI ACV growth for two straight quarters → the cannibalization question substantially resolves in the bull/base direction; shift focus to whether the multiple actually re-rates
- If a large, named enterprise customer publicly discloses replacing ServiceNow workflows with an in-house agentic build or a competitor stack → that becomes the #1 signal immediately, ahead of any quarterly aggregate number
- If CRM's or WDAY's own AI-monetization metrics (Agentforce ARR, Workday AI agent adoption) diverge sharply from NOW's — either much better or much worse — that's a useful cross-check on whether this is a NOW-specific moat story or a sector-wide repricing that will move together regardless of any one company's execution
- If the Fed cuts rates meaningfully, the multiple could re-rate on macro grounds independent of any fundamental change here — don't mistake a rate-driven re-rating for thesis vindication

→ Swap out any signal that's become an answered question for the one that now matters.

**D. Did the probability shift?**
Which case is most likely *now*? Be willing to say it changed.

**Starting assessment (2026-08-01, first build):** Base ~55%, Bull ~20%, Bear ~25%. Base is
the default because it requires nothing more than what management already guided to on the
Q2 2026 call. Bear is weighted meaningfully (not a token 10-15%) because the "AI eats SaaS
seats" mechanism is genuinely plausible and untested over a full cycle — Q2's cRPO number is
one good data point, not a resolved question. Bull is weighted lowest because it requires
BOTH a beat AND a second guide raise AND visible multiple re-rating — three things needing
to go right, not one.

→ Note any shift in the log below.

---

## THE TWO HABITS THAT MAKE THIS WORTH DOING

### Habit 1 — "What would prove me wrong?"
For whichever case you currently believe most, write down the **single piece of evidence that would force you to abandon it.**

*For the base case (2026-08-01 build):* The kill-switch is subscription revenue growth
decelerating back toward high-single-digits YoY, **or** renewal rate breaking meaningfully
below 98%, **or** AI ACV growth pairing with a cRPO deceleration in the same quarter (the
specific combination that would confirm cannibalization rather than incremental monetization).
Any one alone is enough. A single soft quarter within a still-healthy growth range is not a
break. The AI-ACV/cRPO divergence specifically is the sharpest test this thesis has, because
it's the one metric pairing that distinguishes "AI is a new revenue layer" from "AI is
relabeled/discounted seat revenue" — watch it every quarter, not just when something looks wrong.

### Habit 2 — "What surprised me?"
Write the one thing this quarter you *didn't* see coming. Over a year these notes become a map of where your model is consistently blind.

> **2026-08-01 (first build):** The most surprising thing in the research was how directly
> this verdict CONTRADICTS Scout's own bearish framing on this exact name. Scout tracked NOW
> under a "Software handoff — AI agents vs. SaaS seats" bear tag (bundled with CRM/WDAY,
> monitored via @jasonlk) for 7 report-days in July, and the prescreen that led to this build
> deliberately did NOT credit Scout for that reason — the actual case here (Q2's beat-and-raise
> directly undercutting the seat-ARR-bear thesis) runs the opposite direction. That's a genuinely
> useful data point about Scout's own calibration on this specific narrative, worth revisiting
> if NOW's numbers keep contradicting the bear framing over the next few quarters — either
> Scout was early on a real risk that hasn't shown up yet, or this particular narrative was
> overweighted in Scout's sourcing (a lot of the coverage traced to one commentator, @jasonlk).
>
> Also worth flagging: the Q4 2025 → Q1 2026 stretch is the cleanest illustration in this
> whole build of "multiple compression, not demand break" — subscription revenue kept growing
> in the low-20s% YoY through both quarters while the stock fell from ~$153 to ~$88 (-42%).
> The business never missed a beat; the market just stopped believing the growth would keep
> mattering. Worth remembering the next time a stock falls hard on no bad numbers.
>
> A caution worth re-reading every time: **this dashboard looks authoritative, and that can
> fool its own author.** The colored bands are estimates, not forecasts with real precision.
> This is a brand-new build (first `/thesis` touch, TRACK_ALL bands for 2025 quarters are
> reconstructed retroactively, not archived in real time) — treat every number here as more
> provisional than a mature, multi-quarter-tracked thesis would be. Let the tool organize your
> thinking — never let it replace it. When in doubt, widen your bands and lower your confidence.

---

## QUARTERLY LOG

*Keep a running record. Future-you will learn more from this than from any single chart. Copy the block for each new quarter.*

```
────────────────────────────────────────────
QUARTER: Q_  20__          UPDATED ON: ________
NOW price at update: $______   Most-likely case: ______
Blended NTM non-GAAP EPS at update: $______   Forward P/E: ______x

THESIS AUDIT (one line each):
  Bear  — narrative still true? ___  bands moved? ___  why: __________
  Base  — narrative still true? ___  bands moved? ___  why: __________
  Bull  — narrative still true? ___  bands moved? ___  why: __________

PROBABILITY shift this quarter: ____________________________

KEY NUMBERS REFRESHED:
  Q_ subscription revenue: $___B vs. guide  →  [BEAT / MATCH / MISS]
  cRPO growth: ____%  →  [REACCELERATING / STEADY / DECELERATING]
  AI ACV level / growth: $___B  →  [cRPO paired healthy / DIVERGENCE WARNING]
  Renewal rate: ____%  →  [AT/ABOVE 98% / BELOW 98%]
  Non-GAAP operating margin: ____%  vs. guide
  Next quarter guide: ____________________________

WHAT WOULD PROVE ME WRONG (for my favored case):
  ________________________________________________________

WHAT SURPRISED ME THIS QUARTER:
  ________________________________________________________
────────────────────────────────────────────
```

### Build — 2026-08-01 (first thesis, prescreen-to-build same day)
```
────────────────────────────────────────────
QUARTER: Q3 2026 (build touch)          UPDATED ON: 2026-08-01
NOW price at update: $111.23   Most-likely case: BASE (55%), Bear 25%, Bull 20%
Blended NTM non-GAAP EPS at update: $4.45   Forward P/E: ~25.0x

THESIS AUDIT (one line each):
  Bear  — new thesis, first vintage. Centers on the disclosure-friendly-relabeling
          risk in AI ACV and the possibility cRPO decelerates once the current
          large-deal cohort anniversaries. Bands: $80-93.
  Base  — new thesis, first vintage. Assumes subscription revenue keeps compounding
          in the guided low-20s% and AI ACV keeps scaling without a cRPO hit.
          Bands: $102-134.
  Bull  — new thesis, first vintage. Requires cRPO to reaccelerate above 22% and a
          second guide raise, re-rating the multiple back toward 33-42x. Bands: $147-187.

PROBABILITY shift this quarter: n/a (first build).

KEY NUMBERS REFRESHED:
  Q2 2026 subscription revenue: $3.877B (+24.5% YoY) → BEAT
  cRPO growth: +21% YoY (Q2 2026) → not decelerating, argues against pure cannibalization so far
  AI ACV: crossed $1B, agentic deployments up 9x in nine months → paired healthy with cRPO this quarter
  Renewal rate: 98% (best-in-class, held) → AT guide
  Non-GAAP operating margin: 29.5% actual Q2 (FY26 guide 31.5%) → tracking, not yet at full guide
  Next quarter guide: Q3 2026 subscription revenue $3,975-3,980M (+20.5% YoY); earnings ~Oct 28, 2026

WHAT WOULD PROVE ME WRONG (for my favored case, BASE):
  Subscription revenue decelerating toward high-single-digits, renewal rate breaking
  below 98%, or AI ACV growth pairing with a cRPO deceleration in the same quarter —
  the specific combination that would confirm the Scout-flagged "AI eats SaaS seats"
  bear case over this thesis' contradicting read of the Q2 print.

WHAT SURPRISED ME THIS QUARTER:
  How directly this verdict contradicts Scout's own bearish framing on this exact
  name (7 report-days tagged bear via @jasonlk, bundled with CRM/WDAY) — deliberately
  not credited per the prescreen's own reasoning. Also: the Q4 2025→Q1 2026 stretch,
  where the stock fell -42% while subscription revenue kept growing in the low-20s%,
  is the cleanest "multiple compression, not demand break" case study in this build.
────────────────────────────────────────────
```

---

## NOW-specific signals reference

These are the signals that most move the NOW story, in priority order:

| # | KPI | Why it matters | Where to find it |
|---|-----|---------------|-----------------|
| 1 | **AI ACV growth PAIRED with cRPO growth** | The single sharpest test of whether AI Agents/Now Assist are genuinely incremental monetization or relabeled/cannibalized seat ARR. AI ACV growing while cRPO decelerates is the cannibalization tell; both growing together (as in Q2 2026: AI ACV past $1B, cRPO +21%) argues for incremental. | Earnings release, investor presentation |
| 2 | **Subscription revenue growth vs. guide** | The headline recurring-revenue line — +24.5% YoY in Q2 2026, guided to +20.5% YoY for Q3. This is the number a real "AI eats SaaS seats" break would eventually show up in, even if cRPO holds up for a while first. | Earnings release |
| 3 | **Renewal rate (98% floor)** | The direct read on the switching-cost moat — once a Fortune 500 customer has years of custom workflow logic built on the platform, ripping it out is a multi-year compliance-risk project. A break below 98% would be the earliest, most direct evidence the moat is cracking. | Earnings release, investor presentation |
| 4 | **Non-GAAP operating margin vs. the 31.5% FY26 guide** | The "monetizes, not just costs" test for the AI build-out — margin holding/expanding while AI ACV scales is the difference between AI as a paid feature and AI as a discount weapon customers use to negotiate down. | Earnings release |
| 5 | **Net-new $1M+ ACV deal count growth (currently +40% YoY)** | A read on whether the largest, stickiest enterprise accounts are expanding their footprint (bull signal) or just renewing flat (base) or shrinking (bear) — a more granular tell than the aggregate revenue number. | Earnings release, investor presentation |
| 6 | **CRM / WDAY AI-monetization metrics (cross-check)** | Both carry the identical "AI eats SaaS seats" bear framing. If NOW's metrics diverge sharply from CRM's/WDAY's — either much better or much worse — that tells you whether this is a NOW-specific moat story or a sector-wide repricing likely to move together regardless of any one company's execution. | Peer earnings releases |

---

*Not financial advice. This is a personal reasoning tool. Every band and probability in it is your own estimate, to be revised freely as the world changes.*
