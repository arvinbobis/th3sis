# AMZN Thesis — Quarterly Update Checklist

*A pre-flight checklist for your TH3SIS dashboard (`amzn-thesis.html`). Run it every quarter, right after Amazon's earnings — even when nothing looks wrong. The point is to catch the quarter where the world quietly moved and your thesis didn't.*

**Earnings calendar:** Amazon reports roughly late Jan / late Apr / late Jul / late Oct. **Next: ~2026-10-29 (Q3 2026, estimated — not yet confirmed by Amazon IR), after close.** Do this within a week of each print, while it's fresh.

> ⚠️ Everything here is an estimate, not advice. The dashboard's polish can make a guess feel like a fact — it isn't. When in doubt, widen the bands and lower confidence.

---

## How this works

Two layers. Most people only do Layer 1 and slowly drift into being wrong. Do both — that's the whole value.

- **Layer 1 — Refresh the numbers.** Mechanical, ~15 min.
- **Layer 2 — Audit the thesis.** Judgment, ~30 min.

Open `amzn-thesis.html` in a text editor. Everything you edit is in the top block marked **"EDIT EVERYTHING IN THIS BLOCK EACH QUARTER."** Colors come from `../theme.css` — don't add hardcoded hex.

---

## LAYER 1 — Refresh the numbers

- [ ] **1. `AS_OF_DATE`** — today (`"YYYY-MM-DD"`). Also update **`NEXT_EARNINGS`** to the next print date.
- [ ] **2. `NOW_PRICE`** — Amazon's current share price.
- [ ] **3. `HISTORY`** — replace the old `NOW` entry with the just-finished quarter's end price (e.g. `{ q: "NOW", p: 232 }` → `{ q: "Q2 26", p: <actual> }`), then add a fresh `{ q: "NOW", p: NOW_PRICE }`. Keep ~6 points; drop the oldest if crowded.
- [ ] **4. `FUTURE_Q`** — roll the four forward labels one step.
- [ ] **6. `PROJ_END` + each `target12`** — bear/base/bull endpoints + labels. *(Revisit properly in Layer 2.)* Also sanity-check `PRICE_MIN`/`PRICE_MAX` still bracket all bands.
- [ ] **7. `SIGNALS` / `MARGIN`** — update each `tag` (BEAT/MATCH/MISS/WATCH) from the report, roll `next`, nudge `pos` (0 = far bear/left, 1 = far bull/right).
- [ ] **8. `KPI_HIST` / `KPI_PROJ`** — `KPI_HIST` = the **AWS YoY growth %** this quarter printed; `KPI_PROJ` = your forward guesses per case. *(If AWS growth drifts outside ~15–41%, retune `KPI_BASE`/`KPI_SPAN`.)*
- [ ] **9. `TRACK_ALL`** — append ONE entry for the quarter that just reported: `post`, `reaction` (+/++/−/−−), the three bands as they stood, `landed`, `conf:"high"`. Oldest drops automatically (window = 6).
- [ ] **10. `DISLOCATION_DATE` etc.** — ONLY if a *new* capex/earnings shock happened. Update the date, `REVERSION_TROUGH` (the low), `REVERSION_BASEFLOOR` (bottom of the new base band). No new shock → leave it.

> **Tip:** after saving, open it in the browser and hover a few things — confirm nothing reads "undefined" and the fan/backtest still look sane in BOTH light and dark mode.

### The AMZN numbers to grab from the report (Layer-1 source list)
- [ ] **AWS revenue + YoY growth %** and **AWS operating margin** (the engine — most important line).
- [ ] **AWS backlog / RPO** and any "capacity sells out" / supply-constraint commentary.
- [ ] **Total net sales** vs the prior guide, and the **next-quarter guide** (sales + operating income).
- [ ] **Consolidated operating margin** + North America / International retail margins.
- [ ] **Advertising revenue + growth %.**
- [ ] **Capex** (quarterly + full-year guide) — is the $200B 2026 number rising again?
- [ ] **Free cash flow (TTM)** — still compressed, or inflecting up?
- [ ] **AI-services color** (Bedrock, Trainium adoption, AWS AI run-rate) + any **Anthropic** mark distorting GAAP EPS (strip it for "clean" EPS).
- [ ] **FTC advertising suit** status (filed? settled? remedy?) and the older 2023 monopoly case.

---

## LAYER 2 — Audit the thesis *(the part that matters)*

This is **`CASES`** in the edit block. For BEAR, then BASE, then BULL, answer four questions (one honest sentence each):

**A. Is the narrative still true?** Read the `op` text. Has the world overtaken it? *(E.g. once the FTC ad suit actually resolves — filed, settled, or remedy ordered — it stops being a pending risk and the bear `op` must change. Same if free cash flow visibly inflects: the bull `op` is now partly proven.)*
→ Rewrite `op` / `breaks` if stale.

**B. Did the price bands move?** Are `target12` / `PROJ_END` still right? The multiple expands and compresses with mood — strip Anthropic marks and judge on **clean forward EPS**, cross-checked with sum-of-the-parts (AWS + ads carry the value).
→ Update `PROJ_END` / `target12` if fair value changed.

**C. Did the triggers move?** Are these still the *right* things to watch, or has the real risk migrated (capex → FCF → an FTC remedy → a cloud-share shift to Azure/GCP → AI-pricing compression hitting AWS)? 
→ Swap any stale signal for the one that now matters.

**D. Did the probability shift?** Which case is most likely *now*? Say it if it changed.
→ Note in the log.

### Amazon-specific traps to re-read every quarter
- **"AWS sells out instantly" ≠ a cushion.** Strong demand *explains* the $200B capex; only AWS **revenue + margin results** justify it. Judge the spend by monetization, not size. Don't let a great quarter talk you into adding at a rich price.
- **The depreciation lag.** $200B of capex becomes years of depreciation. A demand digestion (à la 2022 cloud optimization) landing on top of all that new D&A is the real bear — watch AWS margin and FCF together, not just the growth rate.
- **GAAP EPS is dirty.** Anthropic mark-to-market gains inflate net income (Q1 2026 had a $16.8B pre-tax gain ≈ $1.23 of the $2.78 EPS; Q2 2026 had a much larger $53.4B pre-tax gain, most of the jump to $5.75 EPS / $62.6B net income). Always back it out — use operating income (+43% YoY in Q2) for the clean read, not GAAP net income.

### Generator check (the capital-allocation layer — see `STRATEGY.md`)
- [ ] **Distance to 2× trim trigger.** Trigger ≈ 2 × your avg cost (~$203 → **~$405**). At ~$254 post-Q2-beat that's still bull-case territory (~1.25× cost). Record current price ÷ avg cost; the dashboard's generator note assumes ~$203 basis — update if you add/trim.
- [ ] **Re-confirm the read:** AMZN is a **steady compounder, not a fast generator seed.** The thesis being real does NOT mean add more — gate any add on **chokepoint (AWS) + valuation cushion**, and never add at highs without a cushion. The next fresh ~$1,000 likely belongs elsewhere unless AMZN dislocates hard.

---

## THE TWO HABITS

### Habit 1 — "What would prove me wrong?"
For your favored case, write the **single piece of evidence that would force you to abandon it.** For BASE today that's likely: *AWS growth drops below ~20% with AWS margin rolling over two quarters running.* If you can't name one, you have a hope, not a thesis.

### Habit 2 — "What surprised me?"
Write the one thing this quarter you didn't see coming. Over a year these notes map where your model is blind — the highest-return sentence you'll write all quarter.

> **The dashboard looks authoritative, and that can fool its own author.** The bands are estimates, not measurements; the reversion read rests on a tiny sample; the historical prices are approximate. Let the tool organize your thinking — never let it replace it.

---

## QUARTERLY LOG

*Copy the block for each new quarter.*

```
────────────────────────────────────────────
QUARTER: Q_  20__          UPDATED ON: ________
Price at update: $______   Most-likely case: ______
AWS growth %: ____   AWS op margin: ____   Consol. margin: ____
Capex (FY guide): $____B   FCF (TTM): $____   Ad growth: ____
Price ÷ avg cost: ____×  (trim trigger 2×)

THESIS AUDIT (one line each):
  Bear  — narrative still true? ___  bands moved? ___  why: __________
  Base  — narrative still true? ___  bands moved? ___  why: __________
  Bull  — narrative still true? ___  bands moved? ___  why: __________

PROBABILITY shift this quarter: ____________________________
FTC ad-suit status: ________________________________________

WHAT WOULD PROVE ME WRONG (favored case):
  ________________________________________________________

WHAT SURPRISED ME THIS QUARTER:
  ________________________________________________________
────────────────────────────────────────────
```

### Q2 2026 — filled in 2026-07-31
```
────────────────────────────────────────────
QUARTER: Q2  2026          UPDATED ON: 2026-07-31
Price at update: $254 (post-beat, ~+8-10% after-hours off $235.50 pre-print close)   Most-likely case: BASE, tilting toward BULL
AWS growth %: +37% (fastest in 18 quarters, vs 31% consensus)   AWS op margin: ~39.4%   Consol. margin: 13.7% (new record)
Capex (FY guide): $220B (raised from $200B, cited higher memory costs)   FCF (TTM): −$7.6B (from +$18.2B a year ago)   Ad growth: +26%
Price ÷ avg cost: ~254/202.74 ≈ 1.25×  (trim trigger 2× ≈ $405, still bull-case territory)

THESIS AUDIT (one line each):
  Bear  — narrative still true? Partially — the FCF/capex-digestion risk is realer than ever (FCF got worse, not better), but the AWS-deceleration half of the bear case took a big hit this quarter.  bands moved? YES, up ($170-200 → $195-225)  why: even a bad AWS quarter now starts from a much higher growth base (37%→low-20s is still a bigger number than 28%→20% was)
  Base  — narrative still true? YES, and partly proven — AWS growth confirmed hard, margins hit new records even as capex guide rose.  bands moved? YES, up ($260-295 → $280-320)  why: growth half of the story de-risked; multiple deserves to sit a bit higher, capped by FCF still not turning
  Bull  — narrative still true? Half-proven — the AWS-reacceleration leg landed emphatically (37% blew past the old 32% bull ceiling), but the FCF-inflection leg moved the WRONG way (more negative, not less). Two-legged case is now one leg confirmed, one leg denied.  bands moved? YES, up ($360-420 → $390-450)  why: the confirmed leg pulls the ceiling up even though the case isn't fully validated yet

PROBABILITY shift this quarter: Shifted UP within the range — from "BASE, watching for either break" toward "BASE, tilting BULL on growth, capped by FCF." Not a full flip to BULL because BULL's own stated requirement (FCF inflects positive) moved further away, not closer, even as the other requirement (AWS growth) was blown through.
FTC ad-suit status: Still unresolved — FTC reportedly preparing a complaint as of mid/late June 2026 but had not filed as of the July 30 print; the broader 2023 e-commerce monopoly case has a trial slated for October 2026. Narrative unchanged from last quarter: a live, pending risk, not a realized one.

WHAT WOULD PROVE ME WRONG (favored case — BASE/tilting-BULL):
  Two quarters running of AWS growth rolling back below ~25% AND free cash flow (TTM) still not showing signs of inflecting despite AWS strength — that combination would mean the capex is a genuine drag, not a delayed payoff, and would flip the read back toward BEAR regardless of how good any single quarter's growth print looks.

WHAT SURPRISED ME THIS QUARTER:
  The two halves of the bull case decoupled instead of moving together. Expected AWS growth and FCF trajectory to broadly correlate (strong demand -> capacity fills -> cash eventually follows); instead AWS growth SURGED (37%, best in 18 quarters) while FCF got WORSE, not better, and management raised capex guidance AGAIN mid-cycle (to $220B, citing memory costs — an input-cost story, not just a demand story). That's a new wrinkle: part of the capex escalation this quarter is COST-driven (memory prices), not just conviction-driven, which is a different risk than the thesis originally framed.
────────────────────────────────────────────
```

---

*Not financial advice. This is a personal reasoning tool. Every band and probability in it is your own estimate, to be revised freely as the world changes.*
