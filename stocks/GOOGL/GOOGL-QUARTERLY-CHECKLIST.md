# GOOGL Thesis — Quarterly Update Checklist

*A pre-flight checklist for your TH3SIS dashboard. Run it every quarter, right after Alphabet's earnings — even when nothing looks wrong. The whole point is to catch the quarter where the world quietly moved and your thesis didn't.*

**Earnings calendar reminder:** Alphabet reports roughly late January / late April / late July / late October.
**Next print: Q3 2026 — ~late October 2026 (after close, exact date not yet announced).**
Do this within a week of each print, while the details are fresh.

---

## How this works

Two layers. Most people only do Layer 1 and slowly drift into being wrong.

- **Layer 1 — Refresh the numbers.** Mechanical. ~15 minutes. Plug in what happened.
- **Layer 2 — Audit the thesis.** Judgment. ~30 minutes. Ask whether the three cases themselves still make sense, or whether reality has overtaken them.

Open `GOOGL-thesis.html` in a text editor. Everything you need to edit lives in the block marked **"EDIT EVERYTHING IN THIS BLOCK EACH QUARTER."**

---

## LAYER 1 — Refresh the numbers

Work top to bottom through the edit block.

- [ ] **1. `AS_OF_DATE`** — set to today (`"YYYY-MM-DD"`).

- [ ] **2. `NOW_PRICE`** — Alphabet's current Class A share price.

- [ ] **3. `HISTORY`** — Replace the current `{ q: "NOW", p: ... }` entry with the just-finished quarter (e.g., `{ q: "Q2 26", p: <actual close> }`), then append `{ q: "NOW", p: NOW_PRICE }` at the end.

- [ ] **4. `FUTURE_Q`** — Roll forward one step (drop `"Q2 26"`, add `"Q2 27"`).

- [ ] **6. `PROJ_END` + each case's `target12`** — Note them; re-evaluate in Layer 2.

- [ ] **7. `SIGNALS` and `MARGIN`** — For each row, update `tag` (BEAT/MATCH/MISS/WATCH), `next` date, and nudge `pos`. Key rows:
  - **Google Cloud Revenue Growth**: What did Cloud actually print? Above 60%? Between 50–60%? Below 40%?
  - **Q2/Q3 Revenue vs. estimate**: Beat, met, or missed the midpoint?
  - **Search Revenue Growth**: Did it hold above 15%? Is it accelerating or softening?
  - **Cloud Operating Margin**: Did the capex ramp compress margins below 30%, or are they holding/expanding?
  - **DOJ Structural Remedy Risk**: Any new appellate ruling or consent decree? Update accordingly.

- [ ] **8. `KPI_HIST` and `KPI_PROJ`** — `KPI_HIST` becomes the latest actual Cloud growth rate. Update `KPI_PROJ` based on:
  - The Q2 Cloud growth print
  - Management commentary on backlog consumption and booking pace
  - Did the $462B backlog grow, hold, or shrink sequentially?

- [ ] **9. `TRACK_ALL`** — Append one new entry:
  ```javascript
  { q: "Q_ 20__", date: "YYYY-MM", post: <price after>, reaction: "<+/++/−/−−>",
    bear: [<lo>, <hi>], base: [<lo>, <hi>], bull: [<lo>, <hi>],
    landed: "<bear|base|bull>", conf: "high" }
  ```
  The oldest entry drops off automatically. Always `conf: "high"` for the most recent quarter.

- [ ] **10. `DISLOCATION_DATE` etc.** — ONLY update if a *new* shock happened (a DOJ structural ruling, a surprise Cloud miss, a major partner defection). If the July 22 report is simply OK or slightly off, leave the summer 2025 dislocation clock running — it's now fully recovered so it tells a historical story rather than tracking an active recovery.

> **Tip:** After saving, open in your browser and hover a few elements. Confirm the Cloud KPI bars make intuitive sense (bear bars short, bull bars tall), and that the Reversion Clock reads coherently.

---

## LAYER 2 — Audit the thesis *(the part that actually matters)*

**Step 5 in the edit block: `CASES`.** For BEAR, then BASE, then BULL, answer four questions.

### For each case, ask:

**A. Is the narrative still true?**
GOOGL-specific things that change the narrative quickly:

- Did **Cloud growth rate** move decisively above 60% (bull confirmation) or below 40% (bear confirmation)?
- Did a **DOJ appellate court** issue a ruling on structural remedies in either the Search or AdTech case?
- Has **Apple dropped Google** as the default search engine — or renewed the deal? (The Apple default is worth an estimated $15–20B annually; a change here is a bear trigger observable in court filings, not just earnings.)
- Did the **Search monetization model change** — e.g., did Google explicitly lower ad coverage in AI Overviews, or report a meaningful decline in revenue per query?
- Has a **competitor** (ChatGPT, Perplexity, or a new entrant) published data showing it has captured meaningful share of commercial-intent search queries?
→ If anything above is materially new, rewrite `op` and `breaks`.

**B. Did the price bands move?**
Alphabet's multiple is highly sensitive to the Cloud growth rate:
- At 60%+ Cloud growth → market may sustain 32–36× multiple
- At 45–55% Cloud growth → fair at 28–31×
- At <40% Cloud growth → expect 22–25× (re-tests the 2025 bear thesis)

Note: the 2027E consensus EPS of ~$13.27 will move as analysts update post-earnings. If Cloud surprises high, expect EPS upgrades — update `PROJ_END` and `target12` accordingly.
→ Always re-derive bands from fresh EPS estimate × multiple, not from old bands + habit.

**C. Did the triggers move?**
- Has the **$462B backlog** grown, held, or shrunk? This is the clearest leading indicator for future Cloud quarters — if it shrinks, the growth deceleration arrives faster than expected.
- Has **AI Overviews ad coverage** crossed 30%+ or stalled below 25%? Stalling is an early warning for Search.
- Has **YouTube** re-accelerated as TV ad budgets shift digital? If YouTube becomes a third growth engine (beyond Search + Cloud), the bull case becomes more plausible.
- Is **Waymo** showing signs of commercial scaling? Currently an Other Bets drag; any revenue signal changes the DCF picture.
→ Swap out answered-question signals for the new live risks.

**D. Did the probability shift?**
Starting: Bear 20%, Base 55%, Bull 25%.

Triggers that shift probability:
- Cloud Q2 > 60% AND backlog grows → base/bull boundary shifts; add 10 pts to Bull
- Cloud Q2 < 45% → subtract 15 pts from Base, add to Bear
- DOJ structural remedy imposed → add 20 pts to Bear
- Apple renews Google default explicitly → subtract 10 pts from Bear
→ Note any shift in the log below.

---

## Alphabet-specific things to check beyond the dashboard

**Cloud competitiveness (quarterly):**
- What did AWS cloud growth print? (Amazon reports ~July 30)
- What did Azure cloud growth print? (Microsoft reports ~July 23)
- Is Google Cloud gaining or losing market share percentage, not just absolute dollars?
- Did management quantify Gemini-on-Cloud enterprise adoption specifically?

**DOJ antitrust calendar:**
- Search case appellate briefing: where are we? Oral arguments expected late 2026 or early 2027.
- AdTech remedies ruling: has Judge Brinkema issued a remedies decision?
- Is the DOJ still pushing Chrome/Android divestiture, or has the scope narrowed?

**Apple default deal:**
- Any public statements about the Google-Apple search deal renewal status?
- Is the DOJ specifically targeting this deal as part of remedies? (The default deal was cited in the original ruling as enabling the monopoly.)

**AI Overviews + Search:**
- Has the percentage of AI Overview queries with ads moved above 30% or below 20%?
- Any advertiser surveys or channel-check data on AI Overview ad effectiveness vs. traditional search?
- Has Google introduced "AI Mode" as a paid tier or continued to bundle it in standard Search?

**Cloud backlog:**
- The $462B figure doubled sequentially in Q1 2026. Did Q2 continue to grow? Backlog growth is the leading indicator of future revenue.
- Any major enterprise AI contract announcements (e.g., a Fortune 500 migrating to Google Cloud specifically for Gemini inference)?

---

## THE TWO HABITS THAT MAKE THIS WORTH DOING

### Habit 1 — "What would prove me wrong?"
For the BASE case (current most-probable), the kill-switch is:

> "Google Cloud decelerates below 40% for two consecutive quarters — exposing 63% Q1 growth as a temporary surge rather than a structural trend, and proving the AI workload consolidation story is going to AWS/Azure instead."

If that happens, the multiple compression is fast and severe.

### Habit 2 — "What surprised me?"
This matters especially for Alphabet because the thesis contains several counterintuitive ideas:
- AI Overviews *helping* rather than *hurting* search monetization (this surprised analysts in Q1 2026 — watch for continuation or reversal)
- Cloud at 63% growth from a company that was at 28% just a year ago (the re-rating speed surprised)
- DOJ structural remedies being rejected despite a clear monopoly finding (this has not happened yet — if courts *do* impose structural remedies, it will be a much bigger surprise than expected)

> **A caution worth re-reading every time:** The dashboard looks authoritative — Q2 2026's 82% Cloud growth makes it look like the bull case has already "worked." But the stock actually DROPPED ~7-8% on that print, on capex-guidance optics, landing at ~$319 — below even the base band. That gap between "the best Cloud quarter this thesis has seen" and "the stock fell anyway" is exactly why the bands stay wide and the case stays BASE, not BULL: one beat quarter doesn't settle whether the market believes the capex converts, and Search hasn't confirmed the second half of the bull case yet. Let the tool organize your thinking; never let it replace it.

---

## QUARTERLY LOG

```
────────────────────────────────────────────
QUARTER: Q_  20__          UPDATED ON: ________
Price at update: $______   Most-likely case: ______

THESIS AUDIT (one line each):
  Bear  — narrative still true? ___  bands moved? ___  why: __________
  Base  — narrative still true? ___  bands moved? ___  why: __________
  Bull  — narrative still true? ___  bands moved? ___  why: __________

PROBABILITY shift this quarter: ____________________________

WHAT WOULD PROVE ME WRONG (for my favored case):
  ________________________________________________________

WHAT SURPRISED ME THIS QUARTER:
  ________________________________________________________
────────────────────────────────────────────
```

### Q2 2026 — reported 2026-07-22, updated 2026-07-25
```
────────────────────────────────────────────
QUARTER: Q2 2026            UPDATED ON: 2026-07-25
Price at update: $319       Most-likely case: BASE (45%, was 55%)

THESIS AUDIT (one line each):
  Bear  — narrative still true? partially  bands moved? yes ($220-265 → $280-315)  why: Cloud/Search fundamentals don't support bear, but the market's capex-fear reaction + still-pending DOJ appeal keep a real bear tail alive; bands raised for the higher EPS base.
  Base  — narrative still true? yes, widened  bands moved? yes ($395-435 → $370-415)  why: Cloud (82% growth, 35.5% margin, $514B backlog) individually cleared every bull threshold, but Search's 17% (down from 19%) keeps the base case's own AND-condition for a bull shift from firing. Bands nudged down modestly on real peer-group de-rating evidence (MSFT ~19.5-20x FY27, META ~18x FY27), not on GOOGL's own numbers.
  Bull  — narrative still true? closer  bands moved? yes ($540-610 → $460-505)  why: needs Search to re-accelerate above 22% AND Cloud to hold 60%+ a second straight quarter — Cloud's leg is now real evidence, Search's leg hasn't fired yet.

PROBABILITY shift this quarter: Cloud>60% AND backlog grew → +10 to Bull per the pre-committed rule (checklist Habit/Step D). No DOJ structural remedy imposed (no bear addition), Apple didn't renew explicitly (no bear subtraction). Net: Bear 20% (unchanged), Base 55%→45%, Bull 25%→35%.

WHAT WOULD PROVE ME WRONG (for my favored case, BASE):
  Cloud decelerates below 55% for two consecutive quarters (after this quarter's 82% high) — that would mean Q2 was one-quarter catch-up, not a structural step-change, and the base case's Cloud assumption breaks.

WHAT SURPRISED ME THIS QUARTER:
  Cloud individually beat EVERY bull-case threshold this thesis had set (growth, margin, backlog) — yet the stock dropped ~7-8% anyway, purely on the capex-guidance raise ($180-190B→$195-205B). The fundamentals said bull-leaning-base; the market's reaction said bear-multiple. That gap between the print and the price reaction is the real story of this quarter, not any single number.
────────────────────────────────────────────
```

*Key numbers captured: Cloud +82% YoY ($24.8B, 35.5% op margin, $514B backlog, +$50B+ QoQ) — crushed the Q1 63% print and every bull threshold. Total revenue $119.8B vs ~$108B estimate (clear beat). Search +17% YoY to $63.3B (deceleration from Q1's +19%, lands in BASE band not BULL). Capex $44.9B in Q2 (up from $35.7B), FY2026 guide raised to $195-205B from $180-190B — the proximate cause of the stock's -7-8% reaction. DOJ US case: still on appeal to the D.C. Circuit, unresolved, oral arguments expected late 2026/early 2027 — no change. EU Android case: Google's final appeal REJECTED 2026-07-02, EUR4.1B fine now final — a real, concluded, but financially modest adverse outcome, separate from the bigger pending US risk. Peer read: MSFT (~19.5-20x FY27) and META (~18x FY27) forward multiples both came in lower than expected this same week — a live, sector-wide capex-fear de-rate that argues for a lower peer-anchored multiple than GOOGL's own recent history alone would suggest, not something specific to Alphabet.*

---

*Not financial advice. This is a personal reasoning tool. Every band and probability is your own estimate, to be revised freely as the world changes.*
