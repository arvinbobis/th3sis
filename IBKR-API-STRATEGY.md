# IBKR API — Maximisation Strategy

Companion to `IBKR-API-TOOLS.md` (which is the raw inventory). This file is the **plan**:
what IBKR uniquely gives us, where its boundary is, and the ranked catalogue of "plays" —
concrete ways to convert an API call into a manual step this project no longer has to do
by hand.

Written 2026-08-15. Nothing here is built yet — this is the strategy pass.

> Intended to become a rendered page later (`stocks/portfolio/ibkr-plays.html` or similar).
> Each play below is written as a self-contained card — name, what it replaces, tools, effort,
> risk — so the page is a straight render of this file, not a rewrite of it.

---

## 1. The core insight

This project is an elaborate machine for making **good decisions**. It is very good at that.

What it has no mechanism for is **noticing when a decision is due**. Every trigger in the
system today — the generator's 2× trim, `PF_ALERTS` buy levels, a thesis kill-switch —
is a number sitting in a data file, waiting for a human to remember to look at it.
A pre-commitment device whose firing mechanism is "if I remember to check" is the weakest
possible version of itself.

**IBKR alerts are the only always-on, server-side component available anywhere in this
stack.** They fire when no Claude session is running, when the laptop is closed, at 2am.
Nothing else here — not Wisesheets, not web search, not the Scout, not a launchd job that
only runs when the machine is awake — has that property.

That reframes the whole exercise. The highest-value use of the IBKR API is not "display
nicer numbers." It is **making the discipline self-enforcing**. Everything else is
secondary, and most of it is convenience.

Second-order, still significant: this project's one documented data-integrity failure
(the ALAB build shipping with Broadcom's data inside it) was a **hand-transcription** bug.
`CLAUDE.md` fixed the structure that made it likely (the engine split), but the data still
arrives by hand. Account numbers — price, cost basis, position size — are exactly the class
of data IBKR can deliver mechanically. Removing hands from that path is a structural fix,
not a convenience.

---

## 2. The three-layer fact stack

`CLAUDE.md` currently documents two sources with an explicit boundary between them
(Wisesheets = filed actuals; web = estimates). IBKR is a **third layer**, and keeping the
boundaries sharp is what stops a future session from reaching for the wrong tool.

| Layer | Source | Owns | Never provides |
|---|---|---|---|
| **Account & live market** | **IBKR** | What I own, at what cost, worth what now. Live quotes, official TWR, allocation weights, trade history, thematic/peer graph, server-side alerts | Analyst estimates, forward multiples, filed financial statements, segment breakouts, guidance |
| **Filed facts** | Wisesheets | Quarterly/annual filed actuals for US filers with SEC citation; EOD price history | Estimates, forward multiples, segments, guidance |
| **Estimates & narrative** | Web search | Consensus EPS NTM, peer-median forward multiples, guidance, regulatory/competitive status | — |

**The boundary that matters most:** the metric driving every price band (consensus EPS NTM)
and the peer-median multiple anchor are **not in IBKR**, exactly as they are not in
Wisesheets. IBKR can tell you *who* the peers are (`get_company_themes`) but not what
multiple they trade at. Do not let the thematic tooling create the illusion of a valuation
source.

**Proposed `CLAUDE.md` amendment** (not yet made): add IBKR as a third documented layer
alongside the existing Wisesheets section, with the boundary stated in the same voice.

---

## 3. Constraints & caveats (verify before relying on any of this)

- **Quote freshness is not guaranteed real-time.** `get_price_snapshot` returns a
  `top_status` field: `REALTIME` / `DELAYED` / `FROZEN` / `FROZEN_DELAYED` / `REJECT`,
  driven by the account's market-data subscription level. A delayed quote silently written
  into a provenance snapshot as "IBKR snapshot" would be a quiet data-integrity bug of
  exactly the kind `CLAUDE.md` already warns about with TSM's currency mislabel.
  **Rule: any play that records a price must read and record `top_status` alongside it.**
- **`get_account_trades` cannot reach back to inception.** Its furthest period is
  `FOUR_QUARTERS_AGO` — as of today that is ~Q3 2025. The account's first investment was
  2024-08-14, so **roughly Aug 2024 → Jun 2025 is unreachable** through this tool. Any
  play depending on full trade history (including resolving the $2,809.50 cost-basis gap)
  can only be partially satisfied; the rest needs a Flex/Activity statement export from the
  IBKR web UI, same as the transaction CSV we already have.
- **`get_pa_performance_all_periods` caps at 1Y.** Since-inception TWR (+46.28%) is
  dashboard-only, confirmed manually on 2026-08-15. Do not expect the API to produce it.
- **`get_pa_allocation` denominators differ by dimension** — netted of shorts for
  `ASSET_CLASS`/`FINANCIAL_INSTRUMENT`, gross for `SECTOR`/`REGION`/`COUNTRY`. Weights sum
  to 1.0 *within* a bucket, so never compare percentages across dimensions as if they share
  a base.
- **No published rate/quota limit observed.** Unlike Wisesheets' known 5,000/month, IBKR's
  limits here are unknown. Treat as unknown rather than unlimited: batch where the API
  allows it (`get_pa_allocation type=ALL` over five separate calls), and never poll in a
  loop.
- **Alerts and order instructions are user-visible side effects.** They appear in the user's
  real brokerage account. See Guardrails (§6).

---

## 4. The plays

Ranked into tiers by strategic value. Effort is relative (L/M/H); risk is about consequence
of getting it wrong, not likelihood.

### Tier 1 — Make the discipline self-enforcing
*The unique unlock. Nothing else in the stack can do this.*

**P1 · Generator trigger watch** — effort M, risk L
The generator's rule is trim at **price ≥ 2× avg cost, thesis-gated**. IBKR knows
`average_price` per position live. Compute `market_price ÷ average_price` for all 26
holdings, rank by proximity to 2×, and surface anything above ~1.7× as "approaching harvest."
Today `generator.html` renders a static ladder that only updates when someone edits
`portfolio-data.js` by hand.
*Tools:* `get_account_positions`
*Replaces:* remembering to check whether anything is near a double.
*Note:* the 2× is the **price** half of the trigger only — the thesis-intact half stays a
human judgment, per `STRATEGY.md`. This play must never present "2× reached" as "trim now."

**P2 · `PF_ALERTS` → real server-side alerts** — effort M, risk M
Mirror each buy-alert price in `PF_ALERTS` into an actual IBKR alert with email
notification. This is the play that converts the buy-alert discipline from a static number
into something that pings. Preserves the existing semantics exactly: an alert firing means
**"go look, not go buy"** — the thesis-intact gate is unchanged and still human.
*Tools:* `create_alert`, `get_alerts`, `update_alert`, `delete_alert`
*Replaces:* manual price-watching; the gap between "I set a level" and "I noticed it hit."
*Caveat:* `create_alert` without an `email` notifies **only** in IBKR Desktop — effectively
invisible. Always set email, or the play does nothing.

**P3 · Kill-switch price alerts** — effort M, risk L
Every thesis carries a kill-switch. A subset are price-expressible (multiple-derating
theses especially — FICO's is close to this shape). Register those as alerts so a thesis
breaking gets pushed to the user rather than waiting for the next `/radar` sweep.
*Tools:* `create_alert`
*Replaces:* the latency between a thesis breaking and the weekly `/radar` noticing.
*Boundary:* only for kill-switches that are genuinely a price level. Most are not
(they're KPI/event-driven) — do not force-fit them.

**P4 · Alert reconciliation** — effort L, risk L
A recurring check that live IBKR alerts still match `PF_ALERTS` + kill-switch levels, and
that nothing has silently drifted or been left behind after a thesis update. Same spirit as
`lint-thesis-data.js`'s `ALERT`-matches-`PF_ALERTS` check, extended to the brokerage side.
*Tools:* `get_alerts`, `get_alert`
*Replaces:* stale alerts firing on levels the thesis has since abandoned.

### Tier 2 — Remove hands from the data path
*Structural fix for the transcription-bug class.*

**P5 · Live account snapshot** — effort L, risk L
One repeatable step that pulls NLV, cash, buying power, and all positions (qty, cost basis,
market value, unrealized P&L) and writes them into the portfolio data layer. This is the
three-call pattern already used ad hoc on 2026-08-15 to build FOLIO 2; making it a named,
repeatable procedure is most of the work.
*Tools:* `get_account_summary`, `get_account_positions`, `get_account_balances`
*Replaces:* hand-transcribing position and cash figures into `portfolio-data.js`.

**P6 · Allocation X-ray** — effort L, risk L
Sector / asset-class / region / country weights straight from IBKR. This is the missing
input for the M1-style allocation visual, but more importantly it is the **first real test
of `CLAUDE.md`'s "correlated bets are one bucket" rule** — 26 positions heavy in
semis/AI/infrastructure may be far fewer genuine bets than the count suggests. The strategy
doc asserts the rule; nothing currently measures compliance.
*Tools:* `get_pa_allocation` (`type=ALL`)
*Replaces:* the assumption that position count equals diversification.

**P7 · Performance ledger** — effort L, risk L
TWR series from IBKR + XIRR computed from the deposit CSV, as one repeatable output rather
than the one-off computed today. Includes the honest framing already worked out: XIRR ≈ 9%
(money-weighted, what my dollars did) vs TWR +46.28% (time-weighted, what $1 from day one
did), and why they diverge.
*Tools:* `get_pa_performance_all_periods` + local XIRR over the transaction CSV
*Replaces:* re-deriving return figures by hand each time the question comes up.
*Caveat:* API gives ≤1Y only; since-inception TWR must be read off the dashboard.

**P8 · Trade & dividend ledger** — effort M, risk L
Walk `get_account_trades` back through the available quarters to build a real trade history
(dates, prices, commissions) — something this project has never had. Partially resolves the
**$2,809.50 cost-basis gap** flagged on FOLIO 2 (currently "likely reinvested dividends,
unconfirmed").
*Tools:* `get_account_trades`
*Replaces:* the unconfirmed footnote.
*Caveat:* cannot reach before ~Q3 2025 (§3). If the gap originates earlier, this play
narrows it but cannot close it — finish the job with a Flex statement export.

### Tier 3 — Accelerate research
*Feeds `/prescreen`, `/thesis`, `/scorecard`. Convenience, not unlock.*

**P9 · Prescreen fact pack** — effort L, risk L
A single `get_price_snapshot` with the right field list returns: 13/26/52-week high/low
(`misc_statistics`), cumulative performance across 1d→5y, `avg_90d_usd_volume`,
`dividend_yield`, `implied_volatility_percentile`, `year_to_date_change`. That is most of
`/prescreen`'s "where does this sit in its own range, how liquid, how has it behaved"
opening section, in one call.
*Tools:* `get_price_snapshot`, `search_contracts`
*Replaces:* several web lookups at the top of every prescreen.

**P10 · Peer-set seeding** — effort L, risk M
`CLAUDE.md` requires a peer-median forward multiple built from **3–5 named comparables**.
Choosing those comps is currently unaided judgment. `get_company_themes` returns
relevance-ranked peers; `get_company_connections` returns competitors with supporting
evidence.
*Tools:* `search_contracts` → `get_company_themes` / `get_company_connections`
*Replaces:* the "who are the right comps" step.
*Risk note (the reason this is M not L):* this gives **who**, never **at what multiple**.
The multiple stays web-sourced. A future session must not treat a peer list as a peer
comp — that would quietly hollow out the second anchor of every multiple judgment.

**P11 · Theme sweep** — effort M, risk L
`search_investment_topics` → `get_theme_details` enumerates companies and ETFs in a sector
or trend, relevance-ranked. A **structural** idea source, complementing the Scout's
social/news-driven one — different failure modes, so genuinely additive rather than
duplicative.
*Tools:* `search_investment_topics`, `get_theme_details`
*Feeds:* `/prescreen` candidate generation.
*Query discipline:* short singular nouns ("battery", not "electric vehicle batteries") —
the matcher is keyword-narrow and returns nothing on plurals/phrases.

**P12 · Price history for backtest & scorecard** — effort L, risk L
Up to 5 years of daily OHLCV per contract, with optional corporate actions. Serves
`TRACK_ALL` backtest reconstruction and `/scorecard` prediction grading.
*Tools:* `get_price_history`
*Replaces:* Wisesheets EOD calls for this specific purpose — **but see overlap note below.**
*Overlap:* Wisesheets already owns EOD prices per `CLAUDE.md`. Prefer Wisesheets for
anything price-history-shaped that goes into a thesis, to keep one documented source; use
IBKR here only where the 5Y daily granularity or corporate-action flag genuinely adds
something. Do not create a second competing price source by accident.

### Tier 4 — Low value / deferred

**P13 · Watchlist sync** — effort L, risk L
Mirror the covered universe into an IBKR watchlist so the mobile app shows the same list.
Cosmetic, cheap.
*Tools:* `get_watchlists`, `create_watchlist`, `edit_watchlist`

**P14 · Staged limit ladder** — effort M, risk **H**
`create_order_instruction` drafts an order and returns a deep link; nothing executes until
the user opens it and submits in IBKR themselves. Could pre-stage the generator ladder's
limit levels.
*Deliberately ranked last despite being technically easy.* The safety comes from the
draft-only design, and that safety should not be leaned on. See Guardrails.

**P15 · Feature request to IBKR** — effort L, risk L
`provide_customer_feedback` to ask for a dividend/transaction-type endpoint and
since-inception performance in the API — the two real gaps found on 2026-08-15.

**P16 · Options & futures tooling** — deferred
No options or futures positions exist in this account. Shelve until that changes.

---

## 5. Sequencing

1. **P5 → P6 → P7** first. Read-only, no side effects, immediately useful, and they produce
   the data layer every later play reads from. P5 in particular unblocks the rest.
2. **P1** next — highest value in Tier 1 and still read-only (it computes against positions;
   it creates nothing).
3. **P2 → P3 → P4** after that. First plays with real side effects in the user's brokerage
   account; do them once the read path is proven and only with explicit confirmation.
4. **P9 → P10 → P11** opportunistically, at the next `/prescreen` or `/thesis` that would
   have needed them — same per-touch rollout discipline `CLAUDE.md` uses for provenance
   snapshots and the engine split. No big-bang backfill.
5. **P8** whenever the cost-basis gap next matters. Not urgent; it's a footnote, not an error.
6. **P14** only on explicit request, never as part of a batch.

---

## 6. Guardrails

- **Never create, modify, or delete an alert, watchlist, or order instruction without the
  user explicitly asking in that session.** These are visible changes to a real brokerage
  account. Auto-mode's "bias toward acting" does not extend across this line.
- **Never create an order instruction the user has not named ticker, quantity, and price
  for.** The draft-only design is a backstop, not a licence. It stays unused as a backstop.
- **An alert firing is "go look," never "go buy."** The `PF_ALERTS` semantics
  (`CLAUDE.md`, capital-allocation layer) are unchanged by moving alerts server-side. The
  thesis-intact gate remains human and remains required.
- **Never present a computed 2× as a recommendation to trim.** Price is one half of a
  two-part, thesis-gated trigger.
- **Never source estimates or forward multiples from IBKR.** They aren't there. Peers are
  not multiples (P10).
- **Record `top_status` with any price written to a provenance snapshot.** A delayed quote
  recorded as live is a silent integrity bug.
- **Don't create a second price-history source by accident.** Wisesheets owns EOD per
  `CLAUDE.md`; P12 is a narrow exception, not a replacement.

---

## 7. Open questions to resolve before building

1. What is this account's **market-data subscription level** — do snapshots come back
   `REALTIME` or `DELAYED`? Determines whether P9's fact pack and any provenance price are
   trustworthy as live. *Check: one `get_price_snapshot` with `top_status` requested.*
2. Are there **rate limits**? Unknown today. *Check: `whats_new`, and watch for throttling
   during P5's multi-call pattern.*
3. Does the **$2,809.50 gap** originate before Q3 2025 (i.e. outside `get_account_trades`
   reach)? Determines whether P8 can close it or only narrow it.
4. Should alerts live **only** in IBKR, or stay mirrored in `PF_ALERTS` as the source of
   truth with IBKR as a projection? *Recommendation: `PF_ALERTS` stays the single write
   point per `CLAUDE.md`; IBKR alerts are a downstream projection, reconciled by P4. Do not
   let the brokerage become a second source of truth for buy levels.*
5. Does `get_pa_allocation`'s sector classification match how this project thinks about
   **correlated buckets**? IBKR sectors are GICS-style; `STRATEGY.md`'s "one Musk bet"
   framing is thesis-driven and will not map cleanly. P6 may need a hand-maintained
   correlation grouping on top of the IBKR dimension rather than instead of it.
