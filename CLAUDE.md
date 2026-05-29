# Investment Thesis Builder — Project Memory

This project builds structured, three-scenario investment theses for individual stocks,
each rendered as an interactive single-file HTML dashboard ("TH3SIS" style) plus a
quarterly-update checklist. This file is the **methodology**. It applies to every stock.

> ⚠️ **Nothing here is financial advice.** Every band, KPI, and probability produced is an
> *estimate* to be held loosely and revised often. The polish of the output can make a guess
> feel like a fact — never let it. When uncertain, widen the bands and lower confidence.

---

## What we build for each stock

1. **An interactive HTML dashboard** (single self-contained file, opens in any browser):
   - Bear / Base / Bull toggle that re-skins the whole view
   - A price "fan chart": real history line + projected forecast cone per scenario
   - KPI signal bars (three-zone: bear→base→bull) with BEAT/MATCH/MISS tags
   - A backtest panel: the last 6 quarters with reconstructed bands vs. actual price
   - A reversion/timing element if the stock has a clear dislocation pattern
   - Plain-language hover tooltips on every data point ("explain for dummies")
2. **A QUARTERLY-UPDATE-CHECKLIST.md** tailored to that stock.

Reference implementation to match for quality/structure: the META build in
`reference/meta-thesis.html` and `reference/meta-QUARTERLY-CHECKLIST.md`. Open and
pattern-match against these real files — they are the quality floor to meet or exceed.

**Where outputs go:** put each stock's files in its own folder, `stocks/<TICKER>/`
(e.g. `stocks/NVDA/NVDA-thesis.html`). Create the folder if it doesn't exist.

---

## The method — three questions that MUST be answered fresh per stock

The structure travels between stocks; the *content* does not. Never copy one stock's
answers onto another. Before building, always resolve these three:

### 1. What is the right valuation ruler for THIS business?
P/E is the default but is wrong for many companies:
- Unprofitable growth → price-to-**sales**
- Banks → price-to-**book value**
- REITs → **funds from operations (FFO)**
- Commodity/cyclical (oil, autos, chips) → normalized earnings / commodity deck
- Biotech/single-asset → risk-adjusted pipeline value
State the chosen ruler explicitly in the thesis and in tooltips.

### 2. What are the 5–6 KPIs that actually move THIS story?
Each business has its own. Examples:
- Ad/platform → ad pricing, impressions, engagement, monetization of new bets
- Retail → same-store sales, inventory, foot traffic
- SaaS → net revenue retention, churn, CAC payback
- Pharma → trial readouts, regulatory decisions, patent cliffs
- Airline → cost-per-seat-mile, load factor, fuel hedges
If a major capex/AI build-out is underway, **frame it by whether it MONETIZES, not just
what it costs** — the cost framing is what makes markets panic; the payoff framing is the
real question. This was central to the META build and should generalize.

### 3. Is the bear/base/bull gap driven by EARNINGS or by the MULTIPLE?
- Mood-driven (e.g. big-cap tech): EPS barely moves across cases; the **multiple** swings.
- Earnings-driven (cyclicals): the **earnings** boom/bust; multiple may be steadier.
Knowing which tells you what the scenarios are really arguing about.

---

## How price bands are derived (be transparent about this)

Always: **Price = (earnings or chosen metric) × (multiple)**.
- The metric (e.g. consensus EPS) is the firmer input — source it from analyst consensus.
- The multiple is a **judgment call** anchored to: the stock's own history, where it trades
  now, and the high/low extremes markets have paid. Bear = below-normal multiple ("scared"),
  Base = normal, Bull = above-normal ("excited").
- Because the multiple reflects crowd psychology, **bands should be wide and held loosely.**
  Do not imply dollar precision.

---

## Thesis quality bar (every case must have)

- **Narrative** (3–4 sentences) — the core story
- **Price range** — from the explicit metric × multiple math
- **KPI triggers** — specific, measurable, with a clear next-check date
- **A kill-switch** — the single piece of evidence that would prove the case wrong
- **Observable-now vs. requires-earnings** split for every KPI
- **A stated most-probable case** with reasoning

Pressure-test reasoning rather than affirming it. In particular, watch for the
"existential threat justifies the spending" trap: a threat *explains* capex, only
*results* justify it. Flag motivated reasoning honestly.

---

## Data freshness rules (critical)

- **Always pull current data before building or updating.** Prices, estimates, leadership,
  regulatory status, and capex guidance all drift. Never rely on memory for these.
- Anchor every backtest quarter to the estimate/multiple regime that existed *at that date*,
  not hindsight. Mark older/fuzzier quarters as lower-confidence.
- Note the as-of date prominently. Re-verify anything time-sensitive each session.

---

## Technical conventions for the HTML build

- Single self-contained `.html` file. React + Babel via CDN is acceptable
  (note it needs internet on first load); offer an offline-bundled version if asked.
- **No browser storage** (localStorage/sessionStorage) — keep state in React state only.
- Put ALL per-quarter editable values in ONE clearly-marked config block at the top
  ("EDIT EVERYTHING IN THIS BLOCK EACH QUARTER") so updates never require hunting through code.
- Backtest uses a **fixed rolling window** (default 6 quarters): keep an append-only
  `TRACK_ALL` array and `.slice(-N)` it, so the oldest quarter auto-drops.
- Aesthetic: dark "terminal" theme, monospace + a display serif, restrained animation.
  Match or exceed the META reference; avoid generic AI styling.
- After writing, verify the JSX compiles before delivering.

---

## Workflow when asked to build or update

1. Confirm the ticker and pull fresh data (price, consensus estimates, recent earnings,
   guidance, regulatory/competitive status).
2. Resolve the three questions (ruler, KPIs, earnings-vs-multiple).
3. Draft the three cases to the quality bar above; share reasoning in chat first if useful.
4. Build the HTML to the technical conventions.
5. Generate the tailored QUARTERLY-UPDATE-CHECKLIST.md (Layer 1 numbers + Layer 2 thesis
   audit + the two habits: "what would prove me wrong?" and "what surprised me?").
6. State the most-probable case and the single most important KPI to watch.

See `.claude/commands/thesis.md` for the per-stock trigger.
