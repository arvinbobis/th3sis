# TH3SIS — Code Review Findings
> Three-chair audit: UX · Engineering · QA  
> Conducted: 2026-06-14 · Scope: `stocks/avgo/avgo-thesis.html`, `stocks/index.html`, `stocks/theme.css`

---

## 🔴 Bugs (fix immediately)

- [x] **[BUG] Price display renders as `$382.07.00`**  
  `stocks/avgo/avgo-thesis.html` line 4936: `` `$${NOW_PRICE}.00` `` should be `` `$${NOW_PRICE}` `` (price already has decimals).  
  _Chair: QA + UX_ · Fixed 2026-06-15

- [x] **[BUG] DCF divide-by-zero when `termPE` slider is dragged to 0**  
  `impliedCAGR` formula divides by `v.ntm_eps * termPE` — if `termPE = 0`, result is `Infinity`. Color logic and label strings don't handle `Infinity` or `NaN`. Add a guard: `if (!termPE || termPE <= 0) return`.  
  _Chair: QA + Engineering_ · Fixed 2026-06-15

---

## 🟠 Risk (fix before next quarterly update)

- [ ] **[RISK] Case sensitivity — `stocks/AVGO/` vs `stocks/avgo/`**  
  Python scripts create files in `stocks/AVGO/` (uppercase). Git tracks them as `stocks/avgo/` (lowercase). Harmless on macOS (case-insensitive FS) but will break on Linux — GitHub Pages runs Linux. Establish a hard convention: all paths use lowercase. Future scripts must write to `stocks/avgo/`.  
  _Chair: Engineering + QA_

- [ ] **[RISK] localStorage schema has `version: 1` but no migration logic**  
  Three keys (`th3sis_pos_AVGO`, `th3sis_fin_AVGO`, `th3sis_portfolio`) carry `{ version: 1, ... }`. If the schema changes during a quarterly update, stale data in a user's browser silently corrupts state with no error or recovery path. Add a version check on load and reset to defaults when version mismatch is detected.  
  _Chair: Engineering + QA_

---

## 🟡 Code Quality (fix in next development session)

- [ ] **[QUALITY] Three near-identical localStorage loaders — extract one util**  
  `loadPos()`, `loadFinState()`, and the dry-powder loader share the same try/catch/parse/fallback pattern. Extract a single generic helper:  
  ```js
  function loadStorage(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; }
    catch { return fallback; }
  }
  ```  
  _Chair: Engineering_

- [ ] **[QUALITY] 69 of 72 `.map()` calls missing `key=` prop**  
  React cannot optimize list reconciliation without keys. Every chevron toggle or slider drag forces full list re-renders. Add stable `key=` props to all mapped JSX lists. Use the item's name/id, not array index where possible.  
  _Chair: Engineering_

- [ ] **[QUALITY] `TICKER_META` — AVGO hardcoded in ~18 places**  
  `"th3sis_pos_AVGO"`, `"th3sis_fin_AVGO"`, `"NASDAQ:AVGO"`, `"Broadcom Inc."`, `"AVGO"` are scattered throughout. Define a single config object at the top of the file so future templates only need one edit:  
  ```js
  const TICKER_META = { ticker: "AVGO", exchange: "NASDAQ", company: "Broadcom Inc." };
  ```  
  _Chair: Engineering_

- [ ] **[QUALITY] `localStorage.getItem()` called on every render in root component**  
  `AvgoThesis()` line 4915: `const dark = localStorage.getItem('th3sis_theme') !== 'light'` runs synchronously on every re-render. Move to a `useState` initialized once, or derive from a CSS class check.  
  _Chair: Engineering_

- [ ] **[QUALITY] `window.confirm()` used for destructive "clear position" action**  
  Synchronous, blocks the UI thread, unstyled, looks like a browser security warning. Replace with an inline confirmation UI (e.g., a "confirm?" button that appears on first click).  
  _Chair: Engineering + UX_

- [ ] **[QUALITY] SBC/Revenue Q2 FY26 = 0.0% with no data-gap indicator**  
  The xlsx source has an unfilled cell for Q2 FY26 SBC/Revenue. Explorer displays `0.0%` with no indication it's missing data vs. a genuine zero. Treat zero/null from this source as `null` and render `"—"` via `fmtFinVal`.  
  _Chair: QA + Engineering_

- [ ] **[QUALITY] `TRACK_ALL` has no deduplication guard**  
  If the same quarter is appended twice during a quarterly update, the backtest renders a duplicate dot and a kinked line. Add a uniqueness check on the `q` field when slicing.  
  _Chair: QA_

---

## 🟡 UX (fix in next development session)

- [ ] **[UX] Zero accessibility — 27 interactive elements with no `aria-label`**  
  18 `<button>` elements and 27 `onClick` handlers have no `aria-label` or `role=`. Screen readers announce "button" with no context. Add descriptive `aria-label` to every button and `role="img"` with `aria-label` to SVG charts.  
  _Chair: UX_

- [ ] **[UX] Theme toggle missing from thesis header**  
  Users who open `avgo/avgo-thesis.html` directly (bookmarked or shared link) have no way to switch between dark and light mode. The toggle only exists in `stocks/index.html`. Add a compact toggle to the thesis header that writes to `th3sis_theme` and re-applies the class.  
  _Chair: UX_

- [ ] **[UX] Color is the only scenario differentiator — colorblind risk**  
  Bear/base/bull are communicated via red/amber/green only. No secondary cue (text label inside the element, icon, or pattern). Users with red-green colorblindness lose the entire scenario framing. Add a short text label (`BEAR` / `BASE` / `BULL`) as a secondary indicator alongside color.  
  _Chair: UX_

- [ ] **[UX] Tooltip engine is mouse-only — no mobile or keyboard support**  
  `ensureTip()` / `showTip()` / `moveTip()` is a global DOM singleton on `mousemove`. Mobile touch users and keyboard-only users get nothing. Consider a `title` attribute fallback for mobile, or convert high-value tooltips to tappable `<details>` / popover elements.  
  _Chair: UX_

- [ ] **[UX] No loading/skeleton state during Babel compilation**  
  Babel compiles 260KB of JSX in the browser on every cold load — 1–3 seconds of blank white page. Add a visible loading indicator inside `<div id="root">` that Babel replaces on mount:  
  ```html
  <div id="root" style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:monospace;color:#3a4252">Loading thesis…</div>
  ```  
  _Chair: UX + QA_

---

## 🟢 Performance (nice-to-have)

- [ ] **[PERF] No memoization on expensive computations**  
  Zero `useMemo` or `useCallback` in the entire file. The Explorer filter/group/sort pipeline (65 metrics), `generateInsight()` for every pinned card, and fan chart geometry all re-run on every state change including unrelated ones (e.g., slider drags). Wrap the filter pipeline and insight generation in `useMemo`.  
  _Chair: Engineering_

- [ ] **[PERF] `generateInsight()` runs on every render per card**  
  Called inside `MetricCard` render with no memoization. For 10+ pinned cards, this is 10+ full insight computations on every keystroke in the search box. Memoize with `useMemo([metric.name, period])`.  
  _Chair: Engineering_

---

## 🟢 Responsive / Mobile (nice-to-have)

- [ ] **[RESPONSIVE] No responsive layout below ~900px**  
  `maxWidth: 1280` container collapses without reflow on small screens. Fan chart SVG, KPI bar grid, and Explorer card grid all need breakpoints. No media queries exist in inline styles or `theme.css`.  
  _Chair: UX_

---

## ⚪ Backlog (future consideration)

- [ ] **[BACKLOG] Pre-compile Babel — eliminate runtime transpilation**  
  `babel-standalone` (300KB) transpiles JSX in the browser on every load. A simple pre-build step (`npx @babel/core` or Vite) would eliminate the compile wait and the CDN dependency. Trade-off: adds a build step to the workflow; acceptable once the file count grows.  
  _Chair: Engineering_

- [ ] **[BACKLOG] Touch/keyboard tooltip fallback**  
  Full replacement of the mouse-hover tooltip system with a hybrid that works on tap and focus. Higher effort but unlocks mobile use.  
  _Chair: UX_

- [ ] **[BACKLOG] `avg_q1fy26/` untracked directory — clean up**  
  Leftover folder never committed. Shows in every `git status`. Either commit or add to `.gitignore`.  
  _Chair: QA_

- [ ] **[BACKLOG] CDN offline fallback**  
  Google Fonts + React + ReactDOM + Babel = 4 external CDN requests. No internet = blank page with no error message. Add a `<noscript>` banner and consider self-hosting or bundling the React/Babel assets.  
  _Chair: QA + Engineering_

---

## Summary

| Priority | Count | Status |
|---|---|---|
| 🔴 Bug | 2 | 2 / 2 fixed ✅ |
| 🟠 Risk | 2 | 0 / 2 fixed |
| 🟡 Quality | 7 | 0 / 7 fixed |
| 🟡 UX | 5 | 0 / 5 fixed |
| 🟢 Performance | 2 | 0 / 2 fixed |
| 🟢 Responsive | 1 | 0 / 1 fixed |
| ⚪ Backlog | 4 | 0 / 4 fixed |
| **Total** | **23** | **0 / 23 fixed** |

---

_Last updated: 2026-06-15_
