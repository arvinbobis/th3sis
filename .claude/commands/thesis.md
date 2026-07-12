---
description: Build a full three-scenario investment thesis + dashboard for a stock ticker
---

You are building a complete investment thesis for: **$ARGUMENTS**

Follow the methodology in CLAUDE.md exactly. Do not skip the data-freshness step.

## Step 1 — Pull fresh data (REQUIRED, do this first)
**First, pull exact facts from Wisesheets** (`mcp__claude_ai_Wisesheets__*` — see CLAUDE.md's
"Wisesheets (facts layer)"): `get_prices_eod` for the current price and monthly closes across
the last ~6 quarters (feeds `HISTORY` and the backtest exactly, not from memory); `get_financials`
for trailing revenue/EPS/margins (`frequency: quarterly, period: last6q`) to compute the
own-history trailing-P/E anchor (real price ÷ filed trailing EPS) alongside the peer-median
anchor. Skip for foreign 20-F filers with no quarterly coverage (e.g. TSM) — use IR data
instead.

**Then search the web** for what Wisesheets doesn't cover:
- Latest earnings results and the most recent quarter's prints (narrative/segment detail)
- Forward analyst consensus (EPS or the relevant metric) and price targets
- Forward multiples for 3–5 named peer comparables (the peer-median anchor for the multiple
  judgment — record it as `multiple_peer_median` in the provenance snapshot)
- The stock's own trailing 5-year forward-P/E range (rough trough / normal / peak bands) —
  this feeds THE CURRENT tab's mood panel and reverse-DCF, alongside the peer multiples above
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
   bar, since the engine itself has zero company-specific content by design). Also add
   `THESIS_HISTORY = []` — an empty append-only archive of past CASES vintages; nothing to
   archive yet on a brand-new build, but `/update-thesis` needs it to exist so the FIRST
   future rewrite has somewhere to push the outgoing narrative before overwriting it.

   **THE CURRENT tab** — the tab carrying the actual verdict (thesis-intact check, price-fair
   check, reverse-DCF, risk/reward) — needs more than a bare `VAL_CONFIG`/`TEXT` mention.
   `lint-thesis-data.js` only checks these globals *exist*, not their shape, so a shallow
   `VAL_CONFIG = {}` or empty `TEXT.current` passes lint but silently breaks or hollows out
   the tab at render time. Build these in full, using `stocks/tsm/thesis-data.js`'s
   `VAL_CONFIG` and `TEXT.current` as the shape reference:
   - `VAL_CONFIG`: `ntm_eps` (same consensus NTM EPS driving the price bands), `shares_b`,
     `fcf_ntm_b`, `risk_free_pct` (current 10Y Treasury), `default_discount_pct`,
     `default_terminal_pe`, `dcf_years` — these five power the reverse-DCF implied-CAGR that
     must surface inline in the verdict/mood labels, not just in an evidence panel; the
     stock's own forward-P/E range from Step 1 as `pe_trough`/`pe_bear_hi`/`pe_normal_lo`/
     `pe_normal_hi`/`pe_bull_lo`/`pe_peak`; and `peers[]` (the same 3–5 named comps from Step
     1, each with `fpe`/`ev_eb`/`fcf_y`).
   - `SIGNAL_HELP` and `TAG_HELP`: a plain-language explanation for every `SIGNALS`/`MARGIN`
     entry name, plus the four BEAT/MATCH/MISS/WATCH tag definitions.
   - `TEXT.current`: `statusNarrative.{broken,watch,intact}`, `panelTipStory`,
     `verdictBody.{broken,watchBelow,below,inBase,above}` (functions of price),
     `kpiTitle`/`kpiSub`/`kpiMeasures`/`kpiRequires.{bull,base,bear}`, `killSwitch`,
     `priceBanner.{below,inBase,above}`, `moodBanner`, `cagrNotes.{low,mid,high}`, and
     `peerCommentary` — every one a real narrative string, not a placeholder. This is where
     the CLAUDE.md quality bar (narrative, kill-switch, most-probable case) actually reaches
     the reader, so verify by opening the tab in a browser, not just a clean lint run.
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
