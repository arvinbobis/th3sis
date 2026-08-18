# IBKR MCP Tools — Inventory + Strategy

Full list of `mcp__claude_ai_Interactive_Brokers_IBKR__*` tools available in this session,
grouped by purpose, plus a first pass at how this project could put them to use. Written
2026-08-15 during the FOLIO 2 build.

---

## 1. Account & Portfolio (read-only, live)

| Tool | What it returns |
|---|---|
| `get_account_summary` | Net liquidation value, equity with loan value, buying power, margin, leverage |
| `get_account_balances` | Cash + market value broken down by currency |
| `get_account_positions` | Every open position: qty, price, market value, cost basis, unrealized/daily P&L |
| `get_account_orders` | Live/open orders: status, side, qty, price, fill info |
| `get_account_trades` | Executed trades over a period (TODAY / 7/30/60/90D / MTD / YTD / by quarter) |
| `get_pa_performance_all_periods` | Official TWR or MWR performance series (1D/7D/MTD/1M/YTD/1Y) — NAV + cumulative return per day. **Capped at 1Y lookback**, does not expose since-inception (that's dashboard-only, "Performance / All" toggle) |
| `get_pa_allocation` | NAV broken down by ASSET_CLASS / SECTOR / REGION / COUNTRY / FINANCIAL_INSTRUMENT, with weights |

## 2. Watchlists

`get_watchlists`, `get_watchlist`, `create_watchlist`, `edit_watchlist` (full-replace), `delete_watchlist`

## 3. Alerts (price/volume/% change, IBKR-side, not local)

`get_alerts`, `get_alert`, `create_alert`, `update_alert` (full-replace), `set_alert_status` (PAUSE/RESUME), `delete_alert`
— condition types: LAST, BID, ASK, DOUBLE_BID_ASK, LAST_OR_BID_ASK, MID_POINT, VOLUME, PERCENT_CHANGE.
Email notification is opt-in per alert; without it, only IBKR Desktop shows the trigger.

## 4. Orders (draft only — human must confirm in IBKR platform)

`create_order_instruction`, `get_order_instructions`, `delete_order_instruction`, `get_combo_identifier` (for multi-leg option combos)
— **Important:** these create a *draft instruction* with a deep link, not a live order. Nothing executes until the user opens the link and submits it in IBKR themselves.

## 5. Market Data

`get_price_snapshot` (live quote + ~30 optional fields: IV, 52wk range, cumulative perf, dividend yield, etc.), `get_price_history` (OHLCV bars, up to 5Y, any bar size)

## 6. Research / Thematic

`search_contracts` (resolve ticker/name → contract_id — the entry point for almost everything else), `search_investment_topics`, `get_theme_details` (companies + ETFs in a sector/trend), `get_company_themes` (a company's sectors/trends + ranked peers), `get_company_connections` (competitors, products, geography, with evidence)

## 7. Options & Futures

`get_option_parameters`, `get_option_data`, `search_futures` — chain/expiry lookups, no positions currently held in either.

## 8. Misc

`provide_customer_feedback` (submit feature requests / issues to IBKR), `whats_new` (server changelog)

---

## Strategy — where this actually helps *this* project

### High value, low effort
1. **Live-wire FOLIO 2 (and eventually `positions.html`)** instead of copy-pasting numbers each
   session — `get_account_summary` + `get_account_positions` + `get_pa_performance_all_periods`
   are exactly the three calls behind everything we built today. Worth wrapping into a repeatable
   step (or a small script) rather than re-deriving by hand each time.
2. **`get_pa_allocation`** (type=ALL) gives sector/asset-class/region weights directly from IBKR —
   this is the missing piece for the M1-style allocation pie/treemap flagged as the natural next
   addition to FOLIO 2.
3. **Resolve the $2,809.50 cost-basis gap** from earlier — `get_account_trades` with a wide period
   (YEAR_TO_DATE, or walk back by quarter) would show whether it's dividend reinvestment or
   something else, instead of leaving it as "likely dividends, unconfirmed."

### Medium value, matches existing project conventions
4. **Buy-alert automation** — `CLAUDE.md`'s capital-allocation layer already has a manual buy-alert
   discipline (`PF_ALERTS` in `portfolio-data.js`, "go look, not go buy," gated on price AND
   thesis-intact). `create_alert` could mirror each `PF_ALERTS` price trigger as a real IBKR-side
   alert with email notification — turns a static number in a data file into something that
   actually pings when crossed. Still respects the discipline: an alert firing is "go look," not
   an order.
5. **Peer-comp sourcing for the thesis method** — `CLAUDE.md`'s Question 1 (valuation ruler) and
   the peer-median-multiple anchor currently require manual web search per stock. `get_company_themes`
   / `get_company_connections` could surface a ranked peer list and sector exposure automatically
   as a starting point — still needs the actual forward-multiple pulled separately (these tools
   don't return valuation multiples), but cuts the "who are the 3-5 named comps" step down.
6. **Generator-ladder staging** — `create_order_instruction` could pre-stage the trim/reseed limit
   orders the generator ladder (`STRATEGY.md`) already defines at specific price levels, as
   drafts the user still has to open and confirm in IBKR. Never auto-executes; just removes the
   "go find the ticker and type the order" step once a level is hit.

### Lower priority / not a fit right now
7. Options & futures tooling — no options/futures positions exist in this account today; shelve
   until that changes.
8. `provide_customer_feedback` — worth using once, to formally ask IBKR for a dividend/transaction-type
   API endpoint, since the gap in #3 above traces back to the CSV export only covering deposits.

### Not to automate
- Nothing here should ever call `create_order_instruction` unprompted or without the user reviewing
  the exact ticker/qty/price first — it's a draft-and-link tool by design, and that boundary should
  stay as the safety net even though it isn't a live trade.
