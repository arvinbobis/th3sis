# AMZN Thesis — Quarterly Update Checklist

*A pre-flight checklist for your TH3SIS dashboard. Run it every quarter, right after Amazon's earnings report — even when nothing looks wrong. The whole point is to catch the quarter where the world quietly moved and your thesis didn't.*

**Earnings calendar reminder:** Amazon reports roughly late January / late April / late July / late October.
**Next print: Q2 2026 — July 30, 2026 (after close).**
Do this within a week of each print, while the details are fresh.

---

## How this works

There are **two layers** to every update. Most people only do Layer 1 and slowly drift into being wrong. You decided to do both — that's the entire value of this exercise.

- **Layer 1 — Refresh the numbers.** Mechanical. ~15 minutes. Plug in what happened.
- **Layer 2 — Audit the thesis.** Judgment. ~30 minutes. Ask whether the three cases themselves still make sense, or whether reality has overtaken them.

Open `AMZN-thesis.html` in a text editor. Everything you edit lives in the block at the top marked **"EDIT EVERYTHING IN THIS BLOCK EACH QUARTER."** The numbers below it redraw themselves.

---

## LAYER 1 — Refresh the numbers

Work top to bottom through the edit block. Tick each one.

- [ ] **1. `AS_OF_DATE`** — set to today (format `"YYYY-MM-DD"`). Shows top-right of the dashboard.

- [ ] **2. `NOW_PRICE`** — Amazon's current share price.

- [ ] **3. `HISTORY`** — the price line on the main fan chart. Replace the current `{ q: "NOW", p: ... }` entry with the just-finished quarter (e.g., change it to `{ q: "Q2 26", p: <actual close> }`), then append a fresh `{ q: "NOW", p: NOW_PRICE }` at the end.

- [ ] **4. `FUTURE_Q`** — roll the four forward-quarter labels one step (drop the nearest, add a new one on the right end). E.g., drop `"Q2 26"` and add `"Q2 27"`.

- [ ] **6. `PROJ_END` + each case's `target12`** — the bear/base/bull price targets. `PROJ_END` is where each forecast line ends on the chart; `target12` is the displayed text label. *(Re-examine properly in Layer 2 — for now just note they exist.)*

- [ ] **7. `SIGNALS` and `MARGIN`** — for each row, update the `tag` (`BEAT` / `MATCH` / `MISS` / `WATCH`) based on what the report showed, update `next` to the next quarter date, and nudge `pos` (0 = bear/left, 1 = bull/right) to reflect where reality landed. The key rows to check:
  - AWS Revenue Growth: what did it actually print? Was it above/at/below the scenario threshold?
  - Q2/Q3 Revenue vs. guide: did it beat, hit, or miss the midpoint?
  - Advertising Revenue Growth: is it holding above 20%, or softening?
  - AWS Operating Margin: did the capex ramp compress it, or is Trainium silicon holding it?
  - Free Cash Flow vs Capex: is FCF improving vs. Q1's heavily-invested baseline?

- [ ] **8. `KPI_HIST` and `KPI_PROJ`** — `KPI_HIST` becomes the latest actual AWS growth rate. `KPI_PROJ` are your forward guesses under each scenario. Calibrate against:
  - What did AWS grow this quarter?
  - What is management guiding for next quarter (implicit in revenue guide + AWS guidance)?
  - Is AI workload demand accelerating, flat, or softening per commentary?

- [ ] **9. `TRACK_ALL`** — append ONE new entry for the quarter that just reported:
  ```javascript
  { q: "Q_ 20__", date: "YYYY-MM", post: <price after>, reaction: "<+/++/−/−−>",
    bear: [<low>, <high>], base: [<low>, <high>], bull: [<low>, <high>],
    landed: "<bear|base|bull>", conf: "high" }
  ```
  Use `"high"` conf for recent quarters. The oldest entry drops off automatically — the dashboard always shows the most recent 6.

- [ ] **10. `DISLOCATION_DATE` etc.** — ONLY update if a *new* shock happened this quarter (a surprise capex raise, a major AWS miss, an FTC ruling, etc.). If so, update:
  - `DISLOCATION_DATE` — the date price actually troughed
  - `REVERSION_TROUGH` — the low price
  - `REVERSION_BASEFLOOR` — bottom of your new base band
  - `REVERSION_PRECEDENT_DAYS` — how long the last relevant recovery took
  If no new shock, leave these alone — the Reversion Clock keeps tracking the April 2026 event.

> **Tip:** after saving, open the file in your browser and hover over a few items to confirm nothing reads "undefined" or looks broken. Check the KPI bars — do the heights make visual sense?

---

## LAYER 2 — Audit the thesis *(the part that actually matters)*

This is **step 5 in the edit block: `CASES`.** Do not skip it. For *each* of the three cases, answer four questions out loud (or in writing — use the log at the bottom).

### For BEAR, then BASE, then BULL, ask:

**A. Is the narrative still true?**
Read the `op` text for this case. Has the world overtaken it? Amazon-specific things that change the narrative:
- Did AWS growth move definitively above or below a key threshold (28%, 22%)?
- Did the FTC antitrust trial produce a ruling that changes Amazon's structural position?
- Did Trainium chip availability news (subscription pace, customer wins) change the supply moat story?
- Did tariff policy shift meaningfully for Chinese goods, changing third-party seller economics?
- Did a new competitor (Alibaba Cloud, Oracle, a sovereign cloud) emerge as a meaningful threat to AWS?
→ If the story is stale, rewrite `op` and `breaks`.

**B. Did the price bands move?**
Are `target12` and `PROJ_END` still right? Amazon's multiple is mood-sensitive — the same earnings deserve a higher multiple when the market is pricing AI optimism, and a lower one when it's in "show-me" mode. The spread between $190 (bear) and $470 (bull) is deliberately wide.
→ Update `PROJ_END` and `target12` if your fair-value math changed. Anchor to: forward EPS × multiple, where the multiple reflects the current mood of AI-infrastructure investment.

**C. Did the triggers move?**
Check each row in `SIGNALS` and `MARGIN`. Are these still the *right things to watch*?
- If Trainium supply becomes the dominant story, should a Trainium-specific signal replace one of the generic margin rows?
- If the FTC ruling resolves, does the regulatory overhang disappear from the bear case narrative?
- If AI agent workloads are measurably hitting AWS (management explicitly quantifies them), does the bull signal need updating?
- If advertising peaks, does it move from a tailwind to a neutral?
→ Swap out any signal that's become an answered question for the one that now matters.

**D. Did the probability shift?**
Which case is most likely *now*? Starting probability: Bear 25%, Base 50%, Bull 25%.
Key triggers that would shift probability:
- AWS Q2 growth > 30% → bear probability falls sharply, bull rises
- AWS Q2 growth < 22% → bear rises sharply
- FTC consent decree or break-up order → adds 10–15 pts to bear probability
- Trainium publicly cited as "preferred" by a major AI lab → bull probability rises
→ Note any shift in the log below.

---

## Amazon-specific things to check beyond the dashboard

These are not in the config block but matter for the Layer 2 audit:

**Competitive watch (quarterly):**
- What did Azure's cloud growth print? (MSFT reports ~same week as AMZN)
- What did Google Cloud print? (GOOGL reports ~same week)
- Is AWS losing ground on market share % even while growing in absolute terms?

**Trainium progress (quarterly):**
- Did Amazon provide any Trainium subscriber/reservation data in the earnings call?
- Did any major AI lab (Anthropic, Cohere, AI2) publicly cite Trainium preference?
- Did AWS provide benchmarks vs. H200/B200 in any public forum?

**FTC antitrust trial (October 2026 docket):**
- What is the current trial status? Did a ruling come down?
- If a consent decree was entered, what does it require Amazon to stop doing?
- Does the ruling affect Buy Box, third-party seller terms, or AWS bundling?

**Tariff environment:**
- Are tariffs on Chinese goods still 30–40%? Did the rate change?
- What are third-party seller surveys saying about margin squeeze?
- Is Amazon selectively absorbing costs (protecting price-leadership) or passing through (protecting margin)?

**Prime Video advertising:**
- Did management quantify Prime Video ad revenue separately?
- Is the Prime Video ad inventory growing meaningfully vs. legacy Sponsored Products?
- Any CPM (cost per thousand views) data to assess whether it's premium or discounted?

---

## THE TWO HABITS THAT MAKE THIS WORTH DOING

### Habit 1 — "What would prove me wrong?"
For whichever case you currently believe most (default: BASE), write down the **single piece of evidence that would force you to abandon it.** If you can't name one, you don't have a thesis — you have a hope.

For the BASE case on Amazon, that kill-switch is:
> "AWS growth decelerates below 22% for two consecutive quarters despite unchanged capex, confirming that the AI workload wave is not landing on Amazon's infrastructure."

### Habit 2 — "What surprised me?"
Write the one thing this quarter you *didn't* see coming. Over a year these four notes become a map of where your model is consistently blind. For Amazon specifically, watch for surprises in:
- How quickly management quantifies AI monetization (faster than expected = bull signal)
- Whether Anthropic's model wins create a measurable Bedrock pull-through (currently untracked)
- Whether Prime Video ads cannibalize or add to overall advertising growth (the data isn't clean yet)

> A caution worth re-reading every time: **this dashboard looks authoritative, and that can fool its own author.** Polish makes a guess feel like a fact. The colored bands are your estimates, not measurements. Amazon's band spread — $190 to $470 — is *intentionally wide* because the AI capex payoff timeline is genuinely uncertain. Let the tool organize your thinking — never let it replace it. When in doubt, widen your bands and lower your confidence.

---

## QUARTERLY LOG

*Keep a running record. Future-you will learn more from this than from any single chart. Copy the block for each new quarter.*

```
────────────────────────────────────────────
QUARTER: Q_  20__          UPDATED ON: ________
Price at update: $______   Most-likely case: ______

THESIS AUDIT (one line each):
  Bear  — narrative still true? ___  bands moved? ___  why: __________
  Base  — narrative still true? ___  bands moved? ___  why: __________
  Bull  — narrative still true? ___  bands moved? ___  why: __________

PROBABILITY shift this quarter: ____________________________

WHAT WOULD PROVE ME WRONG (for my favored case):
  ________________________________________________________

WHAT SURPRISED ME THIS QUARTER:
  ________________________________________________________
────────────────────────────────────────────
```

### Q2 2026 — (fill in after the July 30 report)
*(your first live entry goes here — key numbers to capture: AWS growth %, total revenue vs. $194–199B guide, advertising growth %, AWS operating margin, FCF, capex guidance)*

---

## If you ever outgrow the manual version

The moment updating-by-hand feels like a chore you skip, that's the signal to graduate to an **automated version** — one that pulls Amazon's live price and earnings data itself and updates without editing. That turns the single HTML file into a small hosted app (needs a data feed/API and somewhere to host it). Until then, manual is honestly *better for you*, because the act of typing the numbers in by hand is what forces Layer 2 to actually happen. Automation that skips the thinking defeats the purpose.

---

*Not financial advice. This is a personal reasoning tool. Every band and probability in it is your own estimate, to be revised freely as the world changes.*
