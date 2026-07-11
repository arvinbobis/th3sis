---
description: Build a full three-scenario investment thesis + dashboard for a stock ticker
---

You are building a complete investment thesis for: **$ARGUMENTS**

Follow the methodology in CLAUDE.md exactly. Do not skip the data-freshness step.

## Step 1 — Pull fresh data (REQUIRED, do this first)
Search the web for current, real information on $ARGUMENTS before anything else:
- Current share price and recent price history (last ~6 quarters)
- Latest earnings results and the most recent quarter's prints
- Forward analyst consensus (EPS or the relevant metric) and price targets
- Forward multiples for 3–5 named peer comparables (the peer-median anchor for the multiple
  judgment — record it as `multiple_peer_median` in the provenance snapshot)
- Forward guidance, capex plans, and any major spending cycle
- Regulatory, competitive, or macro factors specific to this company
- The next scheduled earnings date
Never rely on memory for any of these — they drift constantly.

Once you've chosen the price/metric/multiples for Step 3, write them to
`stocks/$ARGUMENTS/data/inputs-YYYY-QQ.json` per the provenance format in CLAUDE.md's data
freshness rules — this is what lets a future backtest reconstruct what you actually knew at
this date instead of guessing from memory.

## Step 2 — Resolve the three framing questions
Answer explicitly (state them in your response):
1. **Valuation ruler** — is P/E right for this business, or should it be P/S, P/B, FFO,
   normalized earnings, pipeline value, etc.?
2. **The 5–6 KPIs** that actually move THIS story (not generic ones). If there's a big
   capex/AI build-out, frame it by monetization, not just cost. If demand looks unusually
   strong, apply CLAUDE.md's pull-forward test: does it extend the runway or front-load it?
3. **Earnings-driven or multiple-driven?** — what do the three cases really argue about?

## Step 3 — Draft the three cases
For BEAR, BASE, BULL each provide, to the CLAUDE.md quality bar:
- Narrative (3–4 sentences)
- Price range, shown as explicit `metric × multiple` math
- 3–5 measurable KPI triggers with next-check dates
- A kill-switch (what would prove this case wrong)
Then: mark each KPI observable-now vs. requires-earnings, and state the most-probable
case with reasoning. Pressure-test the logic; flag any motivated reasoning. Keep bands
wide and held loosely.

Pause here and share the reasoning with me in chat before building, unless I've said
"just build it."

## Step 4 — Build the dashboard
Since the engine split (see CLAUDE.md's "Engine split" note), building a new stock does
**not** mean writing JSX — the shared engine (`stocks/engine/thesis-engine.js`) already
renders every chart, tab, and tooltip. You're writing two small files:
1. **`stocks/$ARGUMENTS/thesis-data.js`** — all the content. Use `stocks/tsm/thesis-data.js`
   as the template for the required shape: `TICKER_META`, `CASES` (bear/base/bull, each with
   a real 3–4 sentence narrative + kill-switch), `HISTORY`, `SIGNALS`/`MARGIN`, `KPI_HIST`/
   `KPI_PROJ`, `TRACK_ALL` (append-only, fixed rolling window), `VAL_CONFIG`, `ALERT`,
   `THESIS_ITEMS`, `PRICE_ZONES`, `GEOM` (chart axis ranges), and `TEXT` (every narrative/
   tooltip string the engine renders — this is the file that carries the CLAUDE.md quality
   bar, since the engine itself has zero company-specific content by design).
2. **`stocks/$ARGUMENTS/$ARGUMENTS-thesis.html`** — a thin shell. Copy
   `stocks/tsm/tsm-thesis.html` and swap only the `<title>` and the theme-color literals in
   the loading-state fallback markup; it already wires `thesis-data.js` + the shared engine.
Also open `reference/meta-thesis.html` once to internalize the quality bar the *content*
(narratives, KPIs, kill-switches) needs to hit — that reference predates the engine split
and is a content/structure model, not a JSX template to copy from anymore.
- Add the ticker's `path` to `REGISTRY` in `stocks/index.html` so it's reachable.
- Do not edit `stocks/engine/thesis-engine.jsx` for a normal build — if the story genuinely
  needs a new chart type the engine doesn't have, that's a deliberate, separate decision
  (it affects every stock), not something to reach for mid-build.

## Step 5 — Generate the quarterly checklist
Create `stocks/$ARGUMENTS/$ARGUMENTS-QUARTERLY-CHECKLIST.md` tailored to this stock: Layer 1
(the numbers to refresh) + Layer 2 (the per-case thesis audit, including the multi-quarter
management-tone question: compare commentary on the thesis-critical topics across the last
3–4 calls — is confidence rising or eroding?) + the two habits ("what would prove me wrong?"
and "what surprised me?") + a copy-paste quarterly log. Use
`reference/meta-QUARTERLY-CHECKLIST.md` as the template.

## Step 6 — Verify (REQUIRED, not optional)
While drafting `thesis-data.js`, `node tools/lint-thesis-data.js $ARGUMENTS` is a no-browser,
sub-second schema check you can run after every edit. Before closing out, run the full
`/verify-thesis $ARGUMENTS` — it runs that same lint automatically plus a headless Playwright
render in both themes. Fix anything it fails on before moving to Step 7.

## Step 7 — Close
State plainly: the most-probable case, the single most important KPI to watch next, and
a reminder that everything is an estimate, not advice.
