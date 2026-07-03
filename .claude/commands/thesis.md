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
   capex/AI build-out, frame it by monetization, not just cost.
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
First open `reference/meta-thesis.html` and pattern-match against it — it is the quality
floor. Then create `stocks/$ARGUMENTS/$ARGUMENTS-thesis.html` (create the folder if needed),
matching that reference's structure and quality and following all technical conventions in
CLAUDE.md:
- Bear/Base/Bull toggle, price fan chart, KPI signal bars, 6-quarter backtest with
  reconstructed-bands-vs-actual overlay, reversion/timing element if applicable,
  plain-language hover tooltips on every data point.
- ALL editable values in one top config block; append-only TRACK_ALL with fixed window.
- Verify the JSX compiles before delivering.

## Step 5 — Generate the quarterly checklist
Create `stocks/$ARGUMENTS/$ARGUMENTS-QUARTERLY-CHECKLIST.md` tailored to this stock: Layer 1
(the numbers to refresh) + Layer 2 (the per-case thesis audit) + the two habits ("what would
prove me wrong?" and "what surprised me?") + a copy-paste quarterly log. Use
`reference/meta-QUARTERLY-CHECKLIST.md` as the template.

## Step 6 — Close
State plainly: the most-probable case, the single most important KPI to watch next, and
a reminder that everything is an estimate, not advice.
