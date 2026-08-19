# SNDK Thesis — Quarterly Update Checklist

*A pre-flight checklist for your TH3SIS dashboard. Run it every quarter, right after SanDisk's earnings report — even when nothing looks wrong. The whole point is to catch the quarter where the world quietly moved and your thesis didn't.*

**Earnings calendar reminder:** SanDisk's fiscal year ends late June/early July, so it reports roughly early Nov / early Feb / early May / early Aug (FQ1/FQ2/FQ3/FQ4). Next print: **FQ1 FY2027, Nov 5, 2026.** Do this within a week of each print, while the details are fresh.

**Extra caution for this stock specifically:** SNDK has been independently public only since Feb 2025, moved 43x in its first 18 months, and has already round-tripped 56% in a single 5-week window (Jun 25 → Jul 29, 2026) on a fear narrative that hasn't been confirmed or denied by an actual guide miss. Treat every band in this file as wider than it looks, and don't let one good or bad quarter overwrite the pattern — this business has a real history of NAND-price boom-bust (a $2.14B loss on 7.1% gross margin as recently as FY2023).

---

## How this works

There are **two layers** to every update. Most people only do Layer 1 and slowly drift into being wrong. You decided to do both — that's the entire value of this exercise.

- **Layer 1 — Refresh the numbers.** Mechanical. ~15 minutes. Plug in what happened.
- **Layer 2 — Audit the thesis.** Judgment. ~30 minutes. Ask whether the three cases themselves still make sense, or whether reality has overtaken them.

Everything you edit lives in `stocks/sndk/thesis-data.js`. After editing, run `node tools/lint-thesis-data.js SNDK` (instant schema check), then `node tools/verify-thesis.js SNDK` (full render check in both themes) before calling the update done.

---

## LAYER 1 — Refresh the numbers

Work top to bottom through `thesis-data.js`. Tick each one.

- [ ] **1. `AS_OF_DATE`** — set to today (`"YYYY-MM-DD"`).
- [ ] **2. `FALLBACK_PRICE`** — SNDK's current share price (Wisesheets `get_prices_eod`, `latest`).
- [ ] **3. `HISTORY`** — replace `NOW` with the just-finished fiscal quarter's actual end price (fiscal-quarter labels, e.g. `"FQ1 FY27"`), then add a fresh `NOW` entry. If the earliest quarter starts flattening the chart (linear axis, extreme range), drop it — a shorter, legible chart beats a complete but unreadable one.
- [ ] **4. `FUTURE_Q`** — roll the four forward fiscal-quarter labels one step.
- [ ] **5. `PROJ_END` + each case's `target12`** — bear/base/bull 12-month price targets. *(Revisit properly in Layer 2 — for now just note they exist.)*
- [ ] **6. `SIGNALS` and `MARGIN`** — update each row's `tag` (`BEAT`/`MATCH`/`MISS`/`WATCH`) against what the report actually showed: revenue vs guide, gross margin vs guide, supply-backlog integrity (any cancellations?), Flash Ventures fab utilization. Update `next` and nudge `pos`.
- [ ] **7. `KPI_HIST` and `KPI_PROJ`** — `KPI_HIST` becomes the latest actual quarterly revenue ($B); `KPI_PROJ` are forward guesses per case for the next four fiscal quarters.
- [ ] **8. `TRACK_ALL`** — append ONE new entry for the quarter that just reported (`post` price, `reaction`, the three bands as they stood going into that report, `landed`, `conf`). Oldest drops automatically past `TRACK_WINDOW` (6).
- [ ] **9. `DISLOCATION_DATE` etc.** — ONLY touch if a *new* dislocation happened this quarter (a fresh sharp selloff or spike distinct from the Jul 2026 glut-fear one already tracked). If the Jul 2026 dislocation has now fully reversed (price back above the $1,850 base floor) or a new one has started, update `REVERSION_TROUGH`/`REVERSION_BASEFLOOR`/`REVERSION_PRECEDENT_DAYS` accordingly.
- [ ] **10. Provenance snapshot** — write a fresh `stocks/sndk/data/inputs-YYYY-QQ.json` (the quarter being built, per CLAUDE.md's data-freshness rules) with the price, consensus NTM EPS, the three chosen multiples, and the peer-median multiple, each tagged with its source.

> **Tip:** after saving, run `node tools/verify-thesis.js SNDK` and actually look at the screenshots — a blank frame with zero console errors is still a failure to render anything.

---

## LAYER 2 — Audit the thesis *(the part that actually matters)*

This is **`CASES`** in `thesis-data.js`. Do not skip it. For *each* of the three cases, answer these out loud (or in writing — see the log at the bottom).

### For BEAR, then BASE, then BULL, ask:

**A. Is the narrative still true?**
Read the `op` text for this case. Has the world overtaken it? *(The specific thing to watch for this stock: has the Jul 2026 "supply-glut fear" narrative been confirmed by an actual NAND ASP decline, or denied by pricing holding/accelerating again?)*
→ If stale, rewrite `op` and `breaks`.

**B. Did the price bands move?**
Are `target12` and `PROJ_END` still right? This stock's multiple has stayed structurally low (single-digit to low-teens forward P/E) throughout a 43x price move — don't assume multiple expansion is coming just because the stock is "up a lot"; this thesis has always been earnings-driven, not multiple-driven.
→ Update if the fair-value math changed.

**C. Did the triggers move?**
Look at `SIGNALS`/`MARGIN`. Specifically: **is the $93.9B supply-backlog cancellation/deferral KPI still the right pull-forward tell, or has a cleaner metric emerged** (order-to-shipment gap, customer inventory-days — neither existed as a trackable public metric at initial build)? Is Flash Ventures fab utilization still worth watching, or has BiCS10 ramped enough to make it stale?
→ Swap out any signal that's become irrelevant.

**D. Did the probability shift?**
Which case is most likely *now*? At initial build (Aug 2026): BASE tilting BULL. Be willing to say it changed — a confirmed ASP rollover or a disclosed backlog cancellation should move this to BEAR immediately, not gradually.
→ Note it in the log below.

**E. What's the four-call tone trend?**
Line up management's commentary on NAND pricing durability, backlog visibility, and capacity plans across the **last 3–4 calls**. Watch for hedging creep on the "4+ year visibility" backlog language specifically — if that phrase quietly disappears or gets qualified, that's a tell before the numbers move.
→ Note the trend (improving / stable / eroding) in the log below.

---

## THE TWO HABITS THAT MAKE THIS WORTH DOING

### Habit 1 — "What would prove me wrong?"
For whichever case you currently believe most (BASE tilting BULL at initial build), write down the single piece of evidence that would force you to abandon it. At initial build, that's: **a disclosed cancellation or volume deferral against the $93.9B supply backlog.** If you can't name one each quarter, you don't have a thesis — you have a hope.

### Habit 2 — "What surprised me?"
Write the one thing this quarter you *didn't* see coming. Over a year these notes become a map of where your model is consistently blind.

> A caution worth re-reading every time — **doubly so for this stock**: this dashboard looks authoritative, and that can fool its own author. SNDK's colored bands rest on 18 months of trading history and 4 years of fundamentals, the shortest and most volatile of any stock in this project's coverage. The reversion pattern this thesis leans on has exactly ONE prior precedent (the Apr 2025 tariff panic). Let the tool organize your thinking — never let it replace it. When in doubt, widen your bands and lower your confidence.

---

## QUARTERLY LOG

*Keep a running record. Future-you will learn more from this than from any single chart. Copy the block for each new quarter.*

```
────────────────────────────────────────────
QUARTER: FQ_ FY20__          UPDATED ON: ________
Price at update: $______   Most-likely case: ______

THESIS AUDIT (one line each):
  Bear  — narrative still true? ___  bands moved? ___  why: __________
  Base  — narrative still true? ___  bands moved? ___  why: __________
  Bull  — narrative still true? ___  bands moved? ___  why: __________

PROBABILITY shift this quarter: ____________________________

TONE TREND (last 3–4 calls): improving / stable / eroding
  Evidence: _______________________________________________

WHAT WOULD PROVE ME WRONG (for my favored case):
  ________________________________________________________

WHAT SURPRISED ME THIS QUARTER:
  ________________________________________________________
────────────────────────────────────────────
```

### FQ4 FY2026 — build entry (2026-08-20)
Price at build: $1,568.87 (down from a $2,273.73 Jun 30 peak; the Jul 2026 glut-fear selloff is unresolved — price has not yet reclaimed the $1,850 base floor). Most-likely case: BASE tilting BULL. Thesis built fresh this session — see `data/inputs-2026-Q4.json` for full provenance. First real audit entry lands after the Nov 5, 2026 (FQ1 FY2027) print.

---

## If you ever outgrow the manual version

The moment updating-by-hand feels like a chore you skip, that's the signal to graduate to an automated version. Given how fast this specific stock moves, that graduation point may come sooner here than for a steadier holding — but manual is still better for you until then, because typing the numbers in by hand is what forces Layer 2 to actually happen.

---

*Not financial advice. This is a personal reasoning tool. Every band and probability in it is your own estimate, to be revised freely as the world changes — especially for a stock this volatile.*
