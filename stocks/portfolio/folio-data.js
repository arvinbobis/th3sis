// FOLIO BARE — single write point for folio-bare.html.
// `history` is APPEND-ONLY: the daily scheduled agent pushes one new entry (never edits a
// past one) after pulling IBKR account_summary/account_balances (net_liquidation,
// total_cash_value, gross_position_value, unrealized_pnl). This is what lets the bar chart
// build up a real time series instead of overwriting a single snapshot.
// `deposited` is NOT part of that automated pull (IBKR's account APIs don't expose deposit
// history) — it's a manual figure from the transaction CSV, carried forward flat across every
// history entry until re-pulled by hand; `depositedAsOf` tracks when that last happened.
//
// The 2026-08-12..17 entries are a one-time backfill from get_pa_performance_all_periods'
// 7D window (real daily NAV, TWR-based) — that endpoint only returns nav, not the
// cash/investedValue/unrealizedPnl breakdown, so those four entries carry `nlv` only. Every
// entry from 2026-08-18 onward is the full account_summary/account_balances pull the daily
// cron writes. 2026-08-18 is being treated as portfolio-over-time's real start date for that
// reason — earlier NAV exists in IBKR but with no matching cash/position breakdown to backfill.
const FOLIO_BARE = {
  account: "U***47571",
  deposited: 33063.63,
  depositedAsOf: "2026-08-15",
  history: [
    { date: "2026-08-12", nlv: 36372.99 },
    { date: "2026-08-13", nlv: 36868.80 },
    { date: "2026-08-14", nlv: 36712.41 },
    { date: "2026-08-17", nlv: 36513.36 },
    {
      date: "2026-08-18",
      nlv: 36238.64,
      cash: 5076.98,
      investedValue: 31161.66,
      unrealizedPnl: 355.64,
    },
    {
      date: "2026-08-19",
      nlv: 36501.07,
      cash: 5076.98,
      investedValue: 31424.09,
      unrealizedPnl: 639.56,
    },
    {
      date: "2026-08-20",
      nlv: 36502.94,
      cash: 5076.98,
      investedValue: 31425.96,
      unrealizedPnl: 641.43,
    },
    {
      date: "2026-08-21",
      nlv: 36263.27,
      cash: 5076.98,
      investedValue: 31182.56,
      unrealizedPnl: 398.03,
    },
  ],
};
