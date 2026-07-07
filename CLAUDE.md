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

**Where outputs go:** put each stock's files in its own folder, `stocks/<ticker>/`
(e.g. `stocks/nvda/nvda-thesis.html`). Folder names and file names must be **lowercase** —
GitHub Pages runs on Linux (case-sensitive FS) and will 404 on uppercase paths. Python
scripts that reference paths must use `Path(__file__).parent / "filename"` (relative to the
script itself), never hardcoded absolute paths or uppercase strings like `"stocks/NVDA/"`.

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

**The pull-forward test (especially semis/cyclicals):** when demand looks strong, ask
whether it *extends* the growth runway or *front-loads* it — demand pulled forward (sovereign
AI buildouts, pre-tariff ordering, double-ordering in a shortage) looks identical to durable
demand in the current print, but it borrows from future quarters instead of adding to them.
If a case's runway assumption can't distinguish the two, say so and name the KPI that would
(e.g. customer mix shift, order-to-shipment gap, inventory at the buyer).

### 3. Is the bear/base/bull gap driven by EARNINGS or by the MULTIPLE?
- Mood-driven (e.g. big-cap tech): EPS barely moves across cases; the **multiple** swings.
- Earnings-driven (cyclicals): the **earnings** boom/bust; multiple may be steadier.
Knowing which tells you what the scenarios are really arguing about.

---

## How price bands are derived (be transparent about this)

Always: **Price = (earnings or chosen metric) × (multiple)**.
- The metric (e.g. consensus EPS) is the firmer input — source it from analyst consensus.
- The multiple is a **judgment call** anchored to: the stock's own history, where it trades
  now, the high/low extremes markets have paid, **and a peer-group comp** (the median forward
  multiple of 3–5 named comparables). The peer anchor is the check against anchoring on a
  stock's own history when the whole group has re-rated — record it in the provenance
  snapshot alongside the three multiples. Bear = below-normal multiple ("scared"),
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

## Capital-allocation layer — the "$1,000 generator" (see `STRATEGY.md`)

A thesis being *real* does not mean you must own it, or own *more* of it. Sitting **above**
the per-stock thesis is a portfolio engine, documented in full in `STRATEGY.md`. Frame every
capital recommendation through it — never recommend adding at highs without a cushion.

- **The generator:** deploy a low-cost, high-conviction position; once it **roughly doubles
  AND the thesis is still intact**, trim to recover the original capital, let the remainder
  ride as "house money," then redeploy into the next idea. Trim trigger ≈ **price ≥ 2× avg
  cost, thesis-gated** (never trim on price alone; never add just to round a number).
- **Two anchors of every buy (both required):** (1) a **chokepoint** thesis — own the
  bottleneck nobody routes around; (2) a **valuation cushion** — the cushion lives in the
  cost basis, so a great business bought at a price that already pays for the thesis is not a
  great stock.
- **Core / satellite:** ~70% broad-market core (IUSG + QQQ, DCA), ~30% in 1–3 satellites.
- **Correlated bets are one bucket** (e.g. SPCX + TSLA = one ~$1,000 Musk bet, not two).
- This is consistent with the buy-alert discipline (price AND thesis-intact → "go look, not
  go buy"). The FOLIO page (`stocks/portfolio/positions.html`) renders the live generator
  ladder, limit ladder, and these rules, all read from `portfolio-data.js`. **`PF_ALERTS` in
  `portfolio-data.js` is the single write point for buy-alert data** — `stocks/index.html`'s
  chip-dot radar reads it directly. A stock's own `const ALERT` in its thesis config block is
  a fallback only (for opening the file directly/offline) — update it at each quarterly touch
  so it doesn't silently drift, but `PF_ALERTS` is what's actually live.

---

## Data freshness rules (critical)

- **Always pull current data before building or updating.** Prices, estimates, leadership,
  regulatory status, and capex guidance all drift. Never rely on memory for these.
- Anchor every backtest quarter to the estimate/multiple regime that existed *at that date*,
  not hindsight. Mark older/fuzzier quarters as lower-confidence.
- Note the as-of date prominently. Re-verify anything time-sensitive each session.

**Provenance snapshot (write this every time you build or update a thesis):** save the
judgment inputs you just pulled/chose to `stocks/<ticker>/data/inputs-YYYY-QQ.json` — the
quarter being built or refreshed, not the quarter reported. This is what lets a *future*
backtest quarter be reconstructed from what you actually knew then, instead of from memory
or hindsight. Minimal shape, one file per touch, never edited after the fact:

```json
{
  "ticker": "TSM",
  "asOf": "2026-07-16",
  "quarter": "Q2 FY2026",
  "inputs": {
    "price":              { "value": 419.10, "src": "IBKR snapshot",              "pulled": "2026-07-16" },
    "consensus_eps_ntm":  { "value": 12.84,  "src": "web search — analyst consensus", "pulled": "2026-07-16" },
    "multiple_bear":      { "value": 18,     "src": "judgment — below 5yr avg (scared)",   "pulled": "2026-07-16" },
    "multiple_base":      { "value": 24,     "src": "judgment — 5yr avg fwd P/E",          "pulled": "2026-07-16" },
    "multiple_bull":      { "value": 30,     "src": "judgment — above 5yr avg (excited)",  "pulled": "2026-07-16" },
    "multiple_peer_median": { "value": 27,   "src": "web search — fwd P/E median of AVGO, NVDA, ASML (named comps)", "pulled": "2026-07-16" }
  },
  "notes": "anything about the regime this quarter that explains WHY these multiples, not just what they are"
}
```

Include every number that would otherwise need to be re-derived from memory later: the
metric driving the price bands, the three multiples, the peer-group median multiple (with
the comps named in `src` — this is the second anchor for the multiple judgment), and the
price itself. `src` distinguishes
a sourced fact (analyst consensus, a filing, a live quote) from a judgment call (the multiple
band) — both are fine, but say which. This rolls out per-stock at each stock's own next
quarterly touch, not as a one-time backfill — a fabricated snapshot for a past quarter would
defeat the entire point.

---

## Technical conventions for the HTML build

- Each stock lives in `stocks/<TICKER>/`. The file links to `../theme.css` for all color
  variables — **do not embed `:root` / `:root.light` blocks inline**. Theme is centralized.
- React + Babel via CDN is acceptable (needs internet on first load).
- **No hardcoded hex colors in JSX inline styles.** Every color must use `var(--...)` from
  `theme.css`. Semantic chart colors (bear red `#f1564b`, base amber `#e0a83b`, bull green
  `#3fd07a`, accent blue `#2f6dff`) are the only permitted exceptions.
- **`html, body { background: var(--page-bg); }` — never a literal hex.** A hardcoded dark
  literal leaks through repaint/overscroll gaps and outside the centered content column,
  showing as a black bar in light mode.
- **No browser storage** (localStorage/sessionStorage) — keep state in React state only.
  Exception: `th3sis_theme` key (read-only in stock files — `index.html` owns writes).
- Each stock must include the theme bootstrap script (see `theme.css` header comment) BEFORE
  the Babel script tag. It applies the saved theme before first React render and listens for
  postMessage theme changes from `index.html`.
- **The `TabNav` (THE PAST/CURRENT/FUTURE row) must NOT be sticky/fixed** — `display: "flex"`
  only, no `position: "sticky"`/`top`/`zIndex`. Sticky caused overlap/repaint issues when the
  index loads the page in an iframe; let the row scroll with the content.
- **The `#root` mount div must use `align-items: safe center; justify-content: safe center`**, not
  plain `center`. Plain `center` pushes a tall thesis's top above the scroll origin, clipping the
  header/first verdict row unreachably; `safe` centers short content but top-aligns when it overflows.
- Put ALL per-quarter editable values in ONE clearly-marked config block at the top
  ("EDIT EVERYTHING IN THIS BLOCK EACH QUARTER") so updates never require hunting through code.
- Backtest uses a **fixed rolling window** (default 6 quarters): keep an append-only
  `TRACK_ALL` array and `.slice(-N)` it, so the oldest quarter auto-drops.
- Aesthetic: dark "terminal" theme, monospace + a display serif, restrained animation.
  Match or exceed the META reference; avoid generic AI styling.
- After writing, verify the JSX compiles before delivering.
- **⚠ Legacy stocks** (built before June 2026): ALAB, AMZN, ASML, FICO, GOOGL, META, MRVL,
  MSFT, MU, NVDA, TSM use hardcoded hex in JSX — light mode will not render correctly for
  them until each is refactored. Refactor at the stock's next quarterly update, not before.

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
