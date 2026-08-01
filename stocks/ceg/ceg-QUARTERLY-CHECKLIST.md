# CEG Thesis — Quarterly Update Checklist

*A pre-flight checklist for your TH3SIS dashboard. Run it every quarter, right after Constellation Energy's earnings report — even when nothing looks wrong. The whole point is to catch the quarter where the world quietly moved and your thesis didn't.*

**Earnings calendar:** CEG reports roughly early-May / early-August / early-November / late-February (Q4/FY).
Next scheduled: **Q2 2026 — August 6, 2026**. Run this within a week of each print, while details are fresh.

---

## How this works

There are **two layers** to every update. Most people only do Layer 1 and slowly drift into being wrong. You decided to do both — that's the entire value of this exercise.

- **Layer 1 — Refresh the numbers.** Mechanical. ~15 minutes. Plug in what happened.
- **Layer 2 — Audit the thesis.** Judgment. ~30 minutes. Ask whether the three cases themselves still make sense, or whether reality has overtaken them.

**CEG was built directly to the engine-split convention (2026-08-01, no legacy build to migrate from).** Everything you edit each quarter lives in **`thesis-data.js`**, not `ceg-thesis.html` — the HTML file is a thin shell that just loads `thesis-data.js` + the shared `../engine/thesis-engine.js`. All the item references below (`AS_OF_DATE`, `CASES`, `SIGNALS`, `TRACK_ALL`, etc.) refer to `thesis-data.js`'s top-of-file "EDIT EVERYTHING IN THIS FILE EACH QUARTER" block.

---

## LAYER 1 — Refresh the numbers

Work top to bottom through the edit block. Tick each one.

- [ ] **1. `AS_OF_DATE`** — set to today (format `"YYYY-MM-DD"`).
- [ ] **2. `FALLBACK_PRICE`** — CEG's current share price.
- [ ] **3. `HISTORY`** — Roll the price line forward. Replace the old `NOW` entry with the just-finished quarter's actual end price, then add a fresh `{ q: "NOW", p: FALLBACK_PRICE }` at the end. Keep the list to 6–7 entries; drop the oldest if it gets crowded.
- [ ] **4. `FUTURE_Q`** — Roll the four forward-quarter labels one step. E.g. after the Q2 2026 report: `["Q3 2026", "Q4 2026", "Q1 2027", "Q2 2027"]`.
- [ ] **5. `PROJ_END` + each case's `target12`** — The bear/base/bull 12-month price targets. `PROJ_END` is where each forecast line ends on the chart; `target12` is the text label. *(Revisit properly in Layer 2 — for now just note they exist.)*
- [ ] **6. `SIGNALS` and `MARGIN`** — For each row, update the `tag` (`BEAT` / `MATCH` / `MISS` / `WATCH`) based on what the earnings report showed, update the `next` field to the next earnings date, and nudge `pos` (0 = far bear/left, 1 = far bull/right) to reflect where reality landed.
  - Key signals to refresh: **quarterly adjusted operating EPS vs. implied guide pace**, **full-year adjusted operating EPS guidance** (watch for a raise, affirm, or cut), **any new PJM capacity-auction result** (only happens ~annually, but check every call for commentary), **Calpine integration / FCF trajectory**, **PJM/FERC policy-risk headlines**.
- [ ] **7. `KPI_HIST`** — Update to the latest actual quarterly **adjusted operating EPS** (NOT GAAP EPS — see THE CURRENT tab notes on why). The Q1 2026 starting value was $2.74.
- [ ] **8. `KPI_PROJ`** — Revise the 4-quarter forward adjusted-operating-EPS projections per case to reflect new guidance and trends.
- [ ] **9. `TRACK_ALL`** — Append ONE new entry for the quarter that just reported. Fill in:
  - `q`: quarter label (e.g. `"Q2 2026"`)
  - `date`: reporting date in `"YYYY-MM"` format
  - `post`: where the stock traded after earnings
  - `reaction`: `"+"` / `"++"` / `"-"` / `"--"` (how the stock reacted)
  - `bear`, `base`, `bull`: the three price bands **as they stood at that report date** (not hindsight — use the bands from the prior quarter's dashboard)
  - `landed`: which zone price ended in (`"bear"`, `"base"`, `"bull"`, `"bear→base"`, etc.)
  - `conf`: `"high"` (recent data, reliable)

  **The oldest quarter drops off automatically** — the dashboard always shows the most recent 6. The first five entries in this build (Q4 2024 – Q4 2025) are *reconstructed*, not archived live — mark them `"low"`/`"med"` confidence until they roll off.

- [ ] **10. `DISLOCATION_DATE` / `REVERSION_TROUGH` / `REVERSION_BASEFLOOR`** — ONLY touch these if a *new* geopolitical, regulatory, or earnings shock happened this quarter that drove a large dislocation (>15% sudden move) **and** it fully resolved. The current values track the April 2025 broad-market tariff panic (trough $171, base floor $315) — already fully recovered. **Important: the CURRENT (Jul 2026) drawdown is a SEPARATE, still-open dislocation** driven by PJM/FERC policy-risk fear, not the one tracked here — don't conflate the two. If the current drawdown resolves this quarter, that's a strong candidate to become the new tracked dislocation.
- [ ] **11. `VAL_CONFIG.ntm_eps` / `peers`** — Refresh consensus NTM adjusted operating EPS and the peer comp table (CEG, VST, TLN, NRG, DUK forward P/E, EV/EBITDA, FCF yield). Also re-check `VAL_CONFIG.risk_free_pct` (10Y Treasury) — it feeds the reverse-DCF.
- [ ] **12. `THESIS_HISTORY`** — Before rewriting any of `CASES.{bear,base,bull}.{target12,op,breaks,requires01,requires02}` below, add `const THESIS_HISTORY = [{ asOf: "...", quarter: "...", cases: { ...current CASES content... } }]` (or append a new entry if it already exists) so the outgoing narrative is archived, not silently lost. This is CEG's FIRST update since the initial 2026-08-01 build — this is the touch that creates `THESIS_HISTORY` for the first time.

> **Tip:** After saving, run `node tools/lint-thesis-data.js CEG` (instant), then open the file in your browser and hover over a few things to confirm nothing reads "undefined" or looks broken.

---

## LAYER 2 — Audit the thesis *(the part that actually matters)*

This is **step 3 in the edit block: `CASES`.** Do not skip it. For *each* of the three cases, answer four questions out loud (or in writing). One honest sentence each is enough.

### For BEAR, then BASE, then BULL, ask:

**A. Is the narrative still true?**
Read the `op` text for this case. Has the world overtaken it?

*CEG-specific things to check:*
- **Bear:** Has a PJM Base Residual Auction actually cleared below $325/MW-day, or has FERC adopted (not just discussed) a reform that discounts nuclear capacity payments? Has the Calpine integration missed FCF/synergy guidance for two straight quarters? Has a hyperscaler PPA actually been renegotiated or cancelled?
- **Base:** Did adjusted operating EPS land inside the $11.00–12.00 guide? Is the Calpine integration tracking its FCF plan (watch for FCF to inflect positive again after Q1 2026's −$850M)? Any new commentary on the 2029/30 PJM auction (expected ~mid-2027)?
- **Bull:** Did the quarter beat guide? Was a new hyperscaler PPA or uprate milestone announced? Is the market starting to close the gap between CEG's ~21x current multiple and the ~35x it touched near its October 2025 high?

→ If the story is stale, rewrite the `op` and `breaks` text.

**B. Did the price bands move?**
Are the `target12` ranges and `PROJ_END` still right? The two levers for CEG:
1. **Adjusted operating EPS estimate**: Has consensus 2027 EPS (currently modeled ~$13.75 base case) moved up or down on new guidance or PPA signings?
2. **Multiple**: Has PJM/FERC policy-risk fear intensified or faded? Calm/confident periods have seen CEG trade at 23–28× NTM P/E; the current policy-risk selloff has it near ~21x; euphoria (like Oct 2025) pushed it toward 35x+.

→ Update `PROJ_END` and `target12` if your EPS × multiple math changed.

**C. Did the triggers move?**
Are the KPIs in `SIGNALS` / `MARGIN` still the *right things to watch*, or has the real risk relocated?

*Risks that could change the KPI priorities:*
- If the Calpine integration completes cleanly and FCF stabilizes positive → shift focus from "integration risk" to "capital-return pace" (buybacks/dividend growth off a de-levered balance sheet)
- If a PJM/FERC reform proposal actually becomes a rule (not just a "reliability meeting") → it immediately becomes the #1 signal, ahead of any quarterly print
- If a second/third hyperscaler signs a direct bilateral PPA with CEG (beyond Microsoft/Meta) → upgrade "data-center PPA book" from a background factor to a primary tracked KPI
- If nuclear uprates (Braidwood/Byron/Clinton) slip their 2029 completion targets → that becomes a bear-case KPI in its own right

→ Swap out any signal that's become an answered question for the one that now matters.

**D. Did the probability shift?**
Which case is most likely *now*? Be willing to say it changed.

**Starting assessment (2026-08-01, initial build): Base ~55%, Bull ~25%, Bear ~20%.** Base is the highest-conviction case because both the fundamentals (Q1 beat, reaffirmed guide, two PJM auctions already cleared) and the price (a genuine gap below the base floor, not inside a broken thesis) point the same direction. Bear gets a meaningfully higher starting weight than TSM or MU got at their own initial builds specifically because the risk here — FERC/PJM market-design reform — is a real, live, exogenous policy process that management does not control, unlike a demand-cycle or execution risk. Bull requires the market to re-discover conviction in the capacity-scarcity story on top of fundamentals already being fine, which is a real but secondary path.

→ Note any shift in the log below.

**E. What's the four-call tone trend?**
Line up management's commentary on the thesis-critical topics (capacity-auction outlook, Calpine integration, PPA pipeline, PJM/FERC policy posture) across the **last 3–4 earnings calls** and ask: more or less confident? Watch especially for how management characterizes PJM/FERC reform risk on the call — hedging language here ("we're monitoring," "too early to say") vs. specific pushback ("we believe X reform is unlikely because Y") is a real tell. This is CEG's first checklist cycle, so there's no trend yet to compare — start logging it from the Q2 2026 call (Aug 6, 2026) forward.

→ Note the trend (improving / stable / eroding / not yet established) in the log below.

---

## THE TWO HABITS THAT MAKE THIS WORTH DOING

### Habit 1 — "What would prove me wrong?"
For whichever case you currently believe most, write down the **single piece of evidence that would force you to abandon it.**

*For the base case (2026-08-01 build):* The kill-switch is two straight quarters of adjusted operating EPS missing the $11.00–12.00 guide, **or** a future PJM capacity auction clearing well below the $325/MW-day cap, **or** FERC/PJM actually adopting (not just discussing) a reform that structurally discounts nuclear capacity payments. Any one alone is enough — this isn't an "all must happen" test. A single EPS miss is noise; a real auction-clear deterioration or an adopted policy reform is signal that the chokepoint economics themselves are breaking, not just the quarter.

### Habit 2 — "What surprised me?"
Write the one thing this quarter you *didn't* see coming. Over a year these four notes become a map of where your model is consistently blind.

> **2026-08-01 (initial build):** The most notable thing building this thesis was how CLEANLY the fundamentals and the price have diverged — Q1 2026 beat, guidance reaffirmed, both the 2026/27 AND 2028/29 PJM auctions already cleared at/near cap, and the stock is still down ~36% from its October 2025 high, with a Wall Street price-target cut explicitly citing a *meeting* about future policy risk rather than any confirmed rule change. That's an unusually clean setup for a "priced-in fear vs. realized fact" framing — but it's also exactly the kind of setup that can look cheap right up until the policy risk actually materializes, which is why the bear case here starts at a meaningfully higher weight (20%) than a typical earnings-driven bear case would.
>
> A caution worth re-reading every time: **this dashboard looks authoritative, and that can fool its own author.** The colored bands are estimates, not forecasts with real precision. CEG has under 5 years of public trading history (spun off from Exelon Feb 2022) — there is no full-cycle precedent to lean on the way a longer-listed peer would offer, and the "10-year" chart conventions used elsewhere in this dashboard series are genuinely shorter here by necessity, not choice. The GAAP-vs-adjusted-EPS gap is real and structural (mark-to-market hedge accounting), not a one-off — always check which number a headline is quoting. Let the tool organize your thinking — never let it replace it. When in doubt, widen your bands and lower your confidence.

---

## QUARTERLY LOG

*Keep a running record. Future-you will learn more from this than from any single chart. Copy the block for each new quarter.*

```
────────────────────────────────────────────
QUARTER: Q_  20__          UPDATED ON: ________
CEG price at update: $______   Most-likely case: ______
Consensus NTM adj. op. EPS at update: $______   Forward P/E: ______x

THESIS AUDIT (one line each):
  Bear  — narrative still true? ___  bands moved? ___  why: __________
  Base  — narrative still true? ___  bands moved? ___  why: __________
  Bull  — narrative still true? ___  bands moved? ___  why: __________

PROBABILITY shift this quarter: ____________________________

TONE TREND (last 3–4 calls): improving / stable / eroding / not yet established
  Evidence: _______________________________________________

KEY NUMBERS REFRESHED:
  Q_ adjusted operating EPS: $___  vs. implied guide pace     →  [BEAT / MATCH / MISS]
  Full-year guidance: $___–$___  →  [RAISED / AFFIRMED / CUT]
  PJM auction news (if any): ____________________________
  Calpine integration / FCF: ____________________________
  PJM/FERC policy-risk headlines: ____________________________

WHAT WOULD PROVE ME WRONG (for my favored case):
  ________________________________________________________

WHAT SURPRISED ME THIS QUARTER:
  ________________________________________________________
────────────────────────────────────────────
```

### Q1 2026 build — 2026-08-01 (initial thesis, not a quarterly update)
```
────────────────────────────────────────────
QUARTER: Q1 2026 (initial build)      UPDATED ON: 2026-08-01
CEG price at update: $262.75          Most-likely case: BASE (55%), Bull 25%, Bear 20%
Consensus NTM adj. op. EPS at update: $12.25   Forward P/E: ~21.5x

THESIS AUDIT: n/a — first build, no prior vintage to audit.

PROBABILITY shift this quarter: n/a — baseline set this build.

TONE TREND: not yet established — start tracking from the Aug 6, 2026 call.

KEY NUMBERS REFRESHED (at build time):
  Q1 2026 adjusted operating EPS: $2.74  vs. ~$2.40 est.        →  BEAT (+28% YoY)
  Full-year 2026 guidance: $11.00–$12.00  (reaffirmed on Q1 call, vs. 2025 actual $9.39)
  PJM auction news: 2028/29 auction cleared $325/MW-day cap, CEG 18,875 MW (~$2.2B revenue)
  Calpine integration / FCF: closed Jan 7, 2026 (~$22B, +23GW); Q1 2026 FCF −$850M;
    2026–27 combined FCF guide $8.4B
  PJM/FERC policy-risk headlines: Citi cut target to $297 (from $348) Jul 1, 2026, citing a
    PJM reliability-reform meeting; stock hit a fresh 52-week low of $228.63 same day

WHAT WOULD PROVE ME WRONG (for my favored case):
  Two straight quarters of adjusted operating EPS missing the $11.00–12.00 guide, or a
  future PJM auction clearing well below $325/MW-day, or an ADOPTED (not just discussed)
  FERC/PJM reform discounting nuclear capacity payments.

WHAT SURPRISED ME THIS QUARTER:
  How cleanly fundamentals (beat, reaffirmed guide, two auctions already cleared at/near
  cap) and price (down ~36% from ATH) have diverged, on a policy-risk worry that hasn't
  actually been adopted as a rule yet.
────────────────────────────────────────────
```

---

## CEG-specific signals reference

These are the signals that most move the CEG story, in priority order:

| # | KPI | Why it matters | Where to find it |
|---|-----|---------------|-----------------|
| 1 | **PJM capacity-auction clearing price / MW cleared** | The direct chokepoint mechanism — CEG gets paid for owning already-built, already-licensed nuclear capacity years before delivery. Both the 2026/27 and 2028/29 auctions have cleared at/near the $325/MW-day cap; CEG cleared 18,875 MW in 2028/29 (~$2.2B locked-in revenue). The next auction (2029/30) is expected ~mid-2027 and is the single biggest scheduled catalyst/risk in this thesis. | PJM Inside Lines, 8-K filings, earnings release |
| 2 | **Adjusted operating EPS vs. guide** | The metric management and the Street actually underwrite — NOT GAAP EPS, which is distorted by mark-to-market hedge accounting (GAAP diluted EPS swung from $11.89 in 2024 to $7.40 in 2025 with no change in the operating business). Full-year 2026 guide: $11.00–12.00, reaffirmed after a $2.74 Q1 beat. | Earnings release |
| 3 | **PJM/FERC policy-risk headlines** | The non-financial variable that can compress the multiple regardless of fundamentals — doesn't show up in any quarterly number until an actual rule changes. This is what drove the July 2026 Citi target cut and the current drawdown. Watch continuously, not just quarterly. | FERC dockets, PJM stakeholder process news, analyst notes |
| 4 | **Calpine integration / FCF trajectory** | The ~$22B acquisition (closed Jan 7, 2026) is a real near-term FCF drag (Q1 2026: −$850M) against a 2026–27 combined FCF guide of $8.4B. Whether FCF re-inflects positive through 2026 as promised is a direct test of whether the deal is being monetized on schedule. | Earnings release, cash flow statement |
| 5 | **Data-center / hyperscaler bilateral PPA signings** | The growth leg separate from the capacity auction — fixed-price, often above-market long-term deals (Microsoft's 20-year $16B TMI/Crane restart; Meta's Clinton uprate deal) that add revenue independent of auction outcomes. Watch for new signings AND for any regulatory pushback on deal structure (see the Nov 2024 FERC/Amazon-Talen co-location precedent). | Company press releases, FERC filings |
| 6 | **Nuclear uprate / relicensing progress** | Incremental megawatts (Braidwood/Byron +135MW, Clinton +30MW) at near-zero marginal capex vs. new-build, plus 20-year license renewals extending the fleet's runway. Both substantially complete by 2029 per current guidance — a schedule slip would be a real, trackable bear-case KPI. | NRC filings, company investor updates |

---

*Not financial advice. This is a personal reasoning tool. Every band and probability in it is your own estimate, to be revised freely as the world changes.*
