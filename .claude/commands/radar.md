---
description: Cross-check frontier themes against every holding's kill-switches
---

Run the frontier radar. This is NOT a gate for new tickers — that's `/prescreen`. This is a
periodic sweep for **cross-cutting themes that can disrupt (or accelerate) multiple holdings
at once**, run against the portfolio you already own, not a single candidate. Recommended
cadence: weekly, and always before running `/prescreen` on a new idea (so a candidate gets
checked against known frontiers, not just its own chokepoint/cushion).

## Step 1 — Read what the Scout has surfaced since the last run

Read the daily reports in `~/Programs/grok-buy-side-scalper/reports/` since
`PF_RADAR.updated` in `stocks/portfolio/portfolio-data.js`. Look specifically for: persistent
themes (anything the scalper's `learn` pass flags as multi-day), and any post naming a
listed company already in `PF_LIVE` or `PF_PRESCREEN`.

## Step 2 — Diff against PF_RADAR

For each theme already tracked in `PF_RADAR.THEMES`:
- Has new evidence appeared? Update `evidence` if so (keep it to what's actually been
  reported, not speculation).
- Has the tripwire condition fired? If yes, this stops being a radar item and becomes a
  real event — say so explicitly and recommend the next step (re-audit the affected
  thesis via `/update-thesis`, or a fresh `/prescreen` if it's a new opportunity).

For anything NOT yet tracked: does it meet the bar for a new radar row? It needs (a) a
plausible link to an actual holding or prescreen candidate, and (b) a tripwire you can state
as a fact an actual filing/disclosure could trip — not a mood. "Watch stablecoins" is not
a row; "first top-10 retailer offers stablecoin checkout" is.

## Step 3 — Coverage check (the actual point of this exercise)

For every `PF_RADAR` row with `coverage: "thesis-gap"` or `"thesis-covered"`, open the
affected stock's thesis and confirm: is this theme actually named as a KPI trigger or
kill-switch (or bull-case accelerant, if `direction: "enables"`) in that dashboard's config
block? If a `"thesis-covered"` row's thesis has since been rebuilt without mentioning it
anymore, downgrade it to `"thesis-gap"` and say so. If a `"thesis-gap"` row got closed by a
recent `/update-thesis`, upgrade it to `"thesis-covered"`.

## Step 4 — Report and update

State plainly, per row: still watching / evidence strengthened / tripwire fired / coverage
changed. Then update `PF_RADAR` in `portfolio-data.js` directly (it's hand-maintained, not
generated — there's no mechanical way to extract "is Company X aware of Theme Y" from a
dashboard, that's a judgment call this step exists to make). Bump `PF_RADAR.updated`.

## Step 5 — Close

One paragraph: which row is closest to a real tripwire firing, and which `thesis-gap` row is
most worth closing at that stock's next `/update-thesis`. Nothing here is financial advice —
a "threatens" row is a reason to watch a kill-switch more closely, not a reason to sell.
