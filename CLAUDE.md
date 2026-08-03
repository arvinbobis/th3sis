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
  backfill. TSM migrated 2026-07-11 as the pilot; ASML migrated 2026-07-16 (its own next
  `/update-thesis`, prompted by the user noticing it didn't match TSM's format); MU migrated
  2026-07-19 (its own mid-quarter touch); MRVL migrated 2026-07-19 (same day, separate touch);
  GOOGL migrated 2026-07-25 (a full rebuild, not a reformat — its pre-migration build predated
  the PAST/CURRENT/FUTURE tab convention entirely; see the Legacy stocks note below for what
  that meant in practice); ALAB migrated 2026-08-01 (structural migration, not a numbers
  refresh — see the Legacy stocks note below for the palette fix and the copy-paste-residue
  cleanup it also required); AVGO migrated 2026-08-01, same day, separate touch (structural
  migration, not a numbers refresh — its custom `FIN_METRICS` "Explorer" dataset, unused by
  the shared engine, was dropped rather than ported, the same call TSM's own migration made;
  see the Legacy stocks note below for the palette fix); NVDA migrated 2026-08-01, same day,
  a separate touch — also a genuinely uppercase legacy folder (`stocks/NVDA/`), fixed to
  lowercase `stocks/nvda/` as part of the same migration (see the "What we build" section's
  lowercase-paths rule); its pre-migration build also predated the PAST/CURRENT/FUTURE tab
  convention, the same larger GOOGL-style scope (see the note below); AMZN migrated
  2026-07-31, a structural migration only — it was updated for Q2 2026 earnings the same
  session just before the migration (bands bear $195–225 / base $280–320 / bull $390–450,
  most-probable case BASE tilting toward BULL), and this migration ported that content
  losslessly into `thesis-data.js` rather than re-deriving it (see the Legacy stocks note
  below — AMZN's pre-migration palette was already compliant, no fix needed); the remaining
  stocks migrate at their own next `/update-thesis`, keeping their existing inline-JSX build
  valid until then.
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
  correctly until each is refactored): FICO, META, MSFT, MU,
  TSM. AVGO was added to this list 2026-07-18 (a straight oversight — it was built in
  the same pre-June-2026 batch and carries the identical `#dd817a`/`#c59542`/`#66b278`
  palette as TSM/others, just never got listed; found because `verify-thesis` doesn't
  exempt undocumented stocks and a mid-cycle AVGO touch that day surfaced the gap). This
  list is about the **hex-color debt**, independent of engine-split status —
  TSM migrated to the engine split 2026-07-11 but *inherited* this exemption rather than
  fixing it (its `#dd817a`/`#c59542`/`#66b278` palette is pre-existing, not new debt). ASML
  migrated 2026-07-16 and came off this list the same day — its pre-migration build already
  used the four permitted semantic colors, so nothing needed fixing (verified: `grep -oE
  '#[0-9a-fA-F]{3,6}' stocks/asml/thesis-data.js` returns only the four permitted hex codes).
  MRVL migrated 2026-07-19 and came off this list the same day for the identical reason —
  its pre-migration build already only used `#f1564b`/`#e0a83b`/`#3fd07a`/`#2f6dff` (verified:
  `grep -oE '#[0-9a-fA-F]{6}\b' stocks/mrvl/thesis-data.js` returns only those four hex codes).
  GOOGL migrated 2026-07-25 (a full rebuild, not a reformat — see below) and came off this
  list the same day after one fix: its pre-migration build used the four permitted case-accent
  colors but ALSO one extra tooltip-accent blue (`#46aad9`) outside the permitted set, swapped
  to the permitted `#2f6dff` during the rebuild (verified: `grep -oE '#[0-9a-fA-F]{6}\b'
  stocks/googl/thesis-data.js` returns only the four permitted hex codes). ALAB migrated
  2026-08-01 and came off this list the same day after a fix: its pre-migration build used
  `#dd817a`/`#c59542`/`#66b278`/`#46aad9` (the same non-permitted variant palette TSM carries)
  throughout `CASES` accents, signal-bar colors, and chips — swapped to the permitted
  `#f1564b`/`#e0a83b`/`#3fd07a`/`#2f6dff` during the migration (verified: `grep -oE
  '#[0-9a-fA-F]{6}\b' stocks/alab/thesis-data.js` returns only the four permitted hex codes).
  AVGO migrated 2026-08-01, same day as ALAB, and came off this list the same day after an
  explicit user decision to conform AVGO to the standard four rather than the reverse: its
  pre-migration build used the identical `#dd817a`/`#c59542`/`#66b278`/`#46aad9` variant
  palette, swapped to `#f1564b`/`#e0a83b`/`#3fd07a`/`#2f6dff` throughout `CASES` accents,
  `PRICE_ZONES`, and `TEXT.future.chips` during the migration (verified: `grep -oE
  '#[0-9a-fA-F]{6}\b' stocks/avgo/thesis-data.js` returns only the four permitted hex codes).
  Its custom `FIN_METRICS`/`FIN_LABELS` "Explorer" dataset — unused by the shared engine, same
  as every other migrated stock — was dropped rather than ported; the real capex/revenue data
  it contained was preserved in `PAST_CAPEX_REV`, computed from the same filed figures.
  Fix the palette at the stock's next quarterly touch after migration, not before — same
  per-touch discipline as everything else here.
  NVDA migrated 2026-08-01 (separate touch, same day) and came off this list the same day
  for the identical already-compliant reason as ASML/MRVL — its pre-migration build already
  used only `#f1564b`/`#e0a83b`/`#3fd07a`/`#2f6dff` throughout `CASES` accents and the
  reversion-clock marker, with no non-permitted variant palette to fix (verified: `grep -oE
  '#[0-9a-fA-F]{6}\b' stocks/nvda/thesis-data.js` returns only the four permitted hex codes —
  the pre-migration file's extensive hex usage was all engine-chrome background/text color
  that the migration itself removes, not semantic accents that needed a swap).
  AMZN migrated 2026-07-31 and came off this list the same day for the identical
  already-compliant reason as ASML/MRVL/NVDA — its pre-migration build already used only
  `#f1564b`/`#e0a83b`/`#3fd07a`/`var(--blue-soft)` throughout `CASES` accents, with no
  non-permitted variant palette to fix (verified: `grep -oE '#[0-9a-fA-F]{6}\b'
  stocks/amzn/thesis-data.js` returns only the four permitted hex codes). Like GOOGL, AMZN's
  pre-migration build (original May 2026 batch) predated the PAST/CURRENT/FUTURE tab
  convention entirely — a single-panel dashboard with no `VAL_CONFIG`, no historical
  financials, no `PRICE_ZONES` — so this migration also required the larger GOOGL-style
  scope: 4 fiscal years (2022–2025, the same Wisesheets free-tier cap as GOOGL) of
  revenue/gross-margin/FCF/ROIC/EV-EBITDA sourced fresh via Wisesheets (SEC-cited), 47
  months of price history for the PAST tab chart and drawdown series, DCF/valuation inputs,
  and named peer comps (MSFT, GOOGL, META, WMT) — all newly written, not ported, since the
  pre-migration file had none of it. The CASES/SIGNALS/MARGIN/TRACK_ALL/HISTORY content that
  DID already exist (from the same-day Q2 2026 `/update-thesis` touch just before this
  migration) was ported losslessly, per the explicit instruction for this migration not to
  be a numbers refresh.
- **AMZN's migration also shipped with one real bug, caught by `verify-thesis` rather than
  by inspection:** `thesis-data.js` had an extra `const NOW_PRICE = FALLBACK_PRICE;` line —
  every other migrated stock only ever defines `FALLBACK_PRICE` and lets the engine's own
  `let NOW_PRICE = FALLBACK_PRICE` (in `thesis-engine.jsx`) own that name. Because both files
  load as classic (non-module) scripts sharing one global lexical scope, the second `const`
  declaration collided with the engine's `let` and threw `Identifier 'NOW_PRICE' has already
  been declared` on page load — the fan chart never rendered in either theme. Fixed by
  deleting the redundant declaration and pointing `HISTORY`'s `NOW` entry straight at
  `FALLBACK_PRICE`, matching TSM/NVDA/GOOGL's convention; `verify-thesis AMZN` passes clean
  after the fix. Worth checking for in any future migration that hand-adapts an older file's
  `NOW_PRICE`-style local variable instead of starting from the `FALLBACK_PRICE` convention.
- **ALAB's migration (2026-08-01) also fixed real copy-paste residue**, distinct from the
  known-and-already-fixed `AvgoThesis()` function-name bug found by the 2026-07-03 machine
  audit. Line-by-line review of the pre-migration `alab-thesis.html` found several hardcoded
  prose blocks — the `ReversionClock` narrative, the `TrackRecord` read-out, and three spots
  in `THE FUTURE` tab (the downside kill-switch, the mood-panel banner, the capital-panel
  regret trigger, and the bottom summary chips) — that still described a different company's
  AI-semiconductor-revenue story (a "$16B AI revenue guide," a "$100B FY2027 AI revenue
  target," "6 XPU partners," a "10:1 split," "Q2 FY2026 earnings on June 3") at a dollar scale
  ALAB (quarterly revenue ~$300M) could never produce — almost certainly the same AVGO-batch
  residue the 2026-07-03 audit warned might exist elsewhere in the file, just never re-audited
  at the line level until this migration. All of `CASES`, `SIGNALS`, `VAL_CONFIG`,
  `THESIS_ITEMS`, `PRICE_ZONES`, and the entire `THE PAST` tab's real financial data (Wisesheets
  export, cross-checked against SEC filings) were independently verified clean — the residue was
  isolated to prose the audit hadn't reached. Rewritten from real ALAB facts (Q1 FY2026 print,
  Q2 FY2026 guide, the Mar 2025 AI-sector-selloff dislocation) rather than ported forward. The
  separate FIN_METRICS "Explorer" dataset flagged by the same 2026-07-03 audit (35 metrics,
  since re-populated with real ALAB financials by 2026-07-07, ahead of this migration) is now
  moot for the migrated build: the shared engine has no Explorer tab at all (TSM's own
  migration already dropped it), so that dataset simply isn't part of `thesis-data.js`.
- **GOOGL's migration was a full rebuild, not a mechanical reformat** — worth noting because
  it's a different case from TSM/ASML/MRVL/MU. Those four already had the PAST/CURRENT/FUTURE
  tab structure (10-year financials, DCF `VAL_CONFIG`, `PRICE_ZONES`) before their migrations;
  GOOGL's pre-migration build (from the original May 2026 batch) predated that convention
  entirely — a single-panel dashboard with no tabs, no `VAL_CONFIG`, no historical financials.
  Since the shared engine requires all 21 globals from every stock's `thesis-data.js`
  regardless of migration history, migrating GOOGL meant researching and writing that missing
  content fresh (Wisesheets 10-Q/10-K facts for 4 years of revenue/margin/FCF/ROIC — capped at
  4 fiscal years, not TSM's 10, by Wisesheets' free-tier 5-year history limit plus one missing
  aligned price point; DCF inputs; named peer comps) rather than just moving existing prose
  into the new file shape. A future not-yet-migrated stock with a similarly old, tab-less build
  should expect the same larger scope, not the lighter TSM-style port.
- **thesis-engine.jsx bugfix alongside the GOOGL migration (2026-07-25):** the PAST tab's
  capex-verdict text assumed a stock's latest capex/revenue ratio is always below its own
  historical peak (hardcoding "DOWN FROM X% PEAK") — true for TSM/ASML/MRVL/MU's data but false
  for GOOGL, whose capex intensity is still climbing and was AT its window-high in the latest
  year. Fixed to branch on `latestCapex < peakCapex` and recompiled
  (`npx esbuild stocks/engine/thesis-engine.jsx --outfile=stocks/engine/thesis-engine.js
  --target=es2019`); re-verified all six migrated stocks (TSM, ASML, MU, MRVL, SPGI, GOOGL)
  since an engine change requires the full pass, not just the touched stock.
- **NVDA's migration (2026-08-01) swapped its hero KPI metric, not just its file shape.**
  The pre-migration build used non-GAAP gross margin (%) as the big KPI bar chart; the
  shared engine's "price-implied full-year revenue" card on THE CURRENT tab (`fyRevBase =
  KPI_HIST + KPI_PROJ.base[0..2]`, checked against `VAL_CONFIG.prior_fy_rev_b`) only produces
  a meaningful number if `KPI_HIST`/`KPI_PROJ` are quarterly revenue in $B — the same
  convention every other migrated stock uses (TSM/ASML/MU/MRVL total revenue, GOOGL Cloud
  growth %). Summing gross-margin percentages through that formula would have produced a
  nonsensical "revenue" figure. Fixed by making Total Revenue the hero KPI (Q1 FY2027 actual
  $81.6B, scenario-projected forward) — gross margin itself wasn't dropped, it's still fully
  tracked as a `MARGIN` signal row exactly as before, and this also better matches the
  pre-migration checklist's own stated #1-priority KPI ("data center revenue run rate ... if
  this plateaus, everything stalls") than gross margin did. A future not-yet-migrated stock
  whose legacy build chose a non-revenue hero KPI should expect the same swap.
- **NVDA also surfaced a `THESIS_HISTORY` / `lint-thesis-data.js` mismatch worth knowing
  before the next migration hits it:** this file's own line above says "a new stock starts
  with `THESIS_HISTORY = []`", but `lint-thesis-data.js`'s `checkThesisHistory` treats a
  present-but-empty array as malformed (fails) and only accepts `undefined` (soft warning) or
  a non-empty, well-formed array. Every stock migrated before NVDA happened to pair its
  migration with an in-flight CASES rewrite, so `THESIS_HISTORY` always shipped with a real
  first entry (the outgoing vintage) and never hit this edge. NVDA's migration was a pure
  structural port with no CASES rewrite, so there was no outgoing vintage to archive — the
  lint's actual behavior is followed here: `THESIS_HISTORY` is left undefined (commented,
  not declared) until NVDA's own next `/update-thesis` gives it a real first entry. Treat the
  lint as authoritative over the `= []` wording above for this exact situation; the wording
  should probably be reconciled at some point, but that's a documentation fix, not urgent.

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
