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

### Wisesheets (facts layer)

The Wisesheets MCP connector (`mcp__claude_ai_Wisesheets__*`) is the primary source for two
things only: **EOD prices** (any ticker, any date range) and **filed actuals for US filers**
(quarterly financial-statement lines and calculated ratios — revenue, EPS, margins, capex,
FCF, inventory, etc.), each returned with an SEC citation (`accession`, `filingUrl`,
`filingDate`). Use it before web search for these two things.

**The boundary: estimates, forward multiples, segments, and guidance remain web-sourced —
Wisesheets never replaces them.** It has no analyst consensus, no peer forward P/E, no
segment breakouts (AWS revenue, ad impressions, HBM mix, etc.), and no guidance. The metric
that drives every price band (consensus EPS NTM) and the peer-median multiple anchor are
not in this API and must stay web-sourced.

Caveats, confirmed by live testing (2026-07-12):
- **Foreign 20-F filers (e.g. TSM) have no quarterly fundamentals, annual-only, and can
  mislabel currency** — TSM's FY2024 `revenue` came back tagged `"USD"` but was actually
  TWD. Sanity-check magnitude on any foreign-filer value before use; for TSM quarterlies,
  keep using the company's own IR releases. ASML files US-style and is fine through FY2025.
- **Filed EPS is GAAP.** Never tag BEAT/MATCH/MISS against a non-GAAP consensus band without
  checking whether `eps_adjusted` is available for that stock — compare like-for-like.
- Extend the provenance `src` convention with the citation form:
  `"SEC 10-Q via Wisesheets — accession 0000723125-26-000015"`.
- Free-plan quota is 5,000 requests/month, 5-year history; a full quarterly touch costs
  roughly 20–40 units; `whoami` is free to call and checks quota without spending it.

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

### Engine split (2026-07-11 — the current convention; rolls out per-touch)

Before this, every stock's dashboard was its own fork of the entire rendering engine —
~3,000 lines of chart/tab/tooltip JSX with the data braided in. A quarterly update meant
JSX surgery inside that file, and a copy-paste-residue bug (ALAB shipping with Broadcom's
data still inside it) was the direct result of that structure. The fix: one shared engine,
many small data files — the same split `portfolio-data.js` already uses for the FOLIO/TREE/
GATE pages, applied to the stock dashboards.

- **`stocks/engine/thesis-engine.jsx`** is the single shared implementation — every chart,
  tab, tooltip, and verdict calculation. **Zero company-specific content is allowed here**:
  no ticker names, no narrative strings, no guide numbers. Every such value is read from
  globals the data file defines (`TICKER_META`, `CASES`, `TEXT`, `GEOM`, …). This rule is
  what makes the engine safe to share — the ALAB bug class becomes structurally impossible.
- **`stocks/<t>/thesis-data.js`** is the per-stock content file — the promoted, first-class
  version of the old "EDIT EVERYTHING IN THIS BLOCK EACH QUARTER" config block. This is
  where a quarterly touch happens: `CASES`, `HISTORY`, `SIGNALS`, `TRACK_ALL`, `TEXT` (every
  narrative/tooltip string), `VAL_CONFIG`, `ALERT`. Use `stocks/tsm/thesis-data.js` as the
  template for the required shape.
- **`stocks/<t>/<t>-thesis.html`** is a thin shell (~60 lines): theme bootstrap, font/theme
  links, a `<script src="thesis-data.js">` then `<script src="../engine/thesis-engine.js">`.
  No JSX lives here. Use `stocks/tsm/tsm-thesis.html` as the template.
- **The compiled engine is checked in, not built on demand.** `thesis-engine.js` is
  precompiled from the `.jsx` source via `npx esbuild stocks/engine/thesis-engine.jsx
  --outfile=stocks/engine/thesis-engine.js --target=es2019` — plain `React.createElement`
  calls, no runtime Babel. This is deliberate: `<script type="text/babel" src="...">`
  requires an XHR fetch that browsers block under `file://` (origin `null`), which would
  break opening a thesis by double-clicking it. **Any edit to the `.jsx` source must be
  followed by that recompile command before committing** — the `.js` file is the one every
  stock's HTML actually loads.
- **Verify is tiered accordingly.** `node tools/lint-thesis-data.js <TICKER>` is a
  no-browser, millisecond schema lint (required globals present, `CASES` narratives are
  real, `TRACK_ALL` has no dup quarter, `ALERT` matches `PF_ALERTS`, no stray hex, and a
  ticker-identity check that catches the exact ALAB copy-paste bug class). Use it while
  iterating on a data file. `node tools/verify-thesis.js <TICKER>` remains the mandatory
  last step of `/thesis` and `/update-thesis` — for a migrated stock it runs the same lint
  automatically *and* the full Playwright render pass in both themes, so nothing is skipped,
  it's just that the expensive half no longer blocks a data-only edit loop.
- **Rollout is per-touch, like provenance snapshots and the legacy-hex list** — no big-bang
  backfill. TSM migrated 2026-07-11 as the pilot; the other 11 stocks migrate at their own
  next `/update-thesis`, keeping their existing inline-JSX build valid until then.
- **Self-containment loosens from "one file" to "one folder + shared engine + theme.css"** —
  already true in spirit (`theme.css` was always external); this just makes it explicit.

- Each stock lives in `stocks/<TICKER>/`. The file links to `../theme.css` for all color
  variables — **do not embed `:root` / `:root.light` blocks inline**. Theme is centralized.
- React + Babel via CDN is acceptable for **legacy** (not-yet-migrated) stocks; migrated
  stocks load the precompiled engine and need no runtime Babel at all (see above).
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
  ("EDIT EVERYTHING IN THIS BLOCK EACH QUARTER") so updates never require hunting through
  code — for a migrated stock, this block **is** `thesis-data.js` in full; for a not-yet-
  migrated stock it's still the inline block at the top of the JSX.
- Backtest uses a **fixed rolling window** (default 6 quarters): keep an append-only
  `TRACK_ALL` array and `.slice(-N)` it, so the oldest quarter auto-drops. This is
  price/band history, not the narrative — see `THESIS_HISTORY` below for that.
- **`THESIS_HISTORY`** (migrated stocks, rolling out per-touch): an append-only archive, in
  `thesis-data.js`, of each past vintage of `CASES.{bear,base,bull}.{target12,op,breaks,
  requires01,requires02}` — pushed right before `/update-thesis`'s Layer-2 audit rewrites
  that text, tagged `{ asOf, quarter }`. Never edit a past entry. Unlike `TRACK_ALL` this has
  **no rolling window** — the point is that a past narrative is never silently lost the way
  it would be if the only record were git log. A new stock starts with `THESIS_HISTORY = []`.
- Aesthetic: dark "terminal" theme, monospace + a display serif, restrained animation.
  Match or exceed the META reference; avoid generic AI styling.
- After writing, run the tiered verify (see Engine split above) before delivering — for a
  migrated stock that's `node tools/verify-thesis.js <TICKER>`; "the JSX compiles" was never
  the bar.
- **⚠ Legacy stocks** (built before June 2026, hardcoded hex in JSX — light mode won't render
  correctly until each is refactored): ALAB, AMZN, ASML, FICO, GOOGL, META, MRVL, MSFT, MU,
  NVDA, TSM. This list is about the **hex-color debt**, independent of engine-split status —
  TSM migrated to the engine split 2026-07-11 but *inherited* this exemption rather than
  fixing it (its `#dd817a`/`#c59542`/`#66b278` palette is pre-existing, not new debt). Fix the
  palette at the stock's next quarterly touch after migration, not before — same per-touch
  discipline as everything else here.

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
