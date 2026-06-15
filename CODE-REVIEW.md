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

- [x] **[RISK] Case sensitivity — `stocks/AVGO/` vs `stocks/avgo/`**  
  Python scripts create files in `stocks/AVGO/` (uppercase). Git tracks them as `stocks/avgo/` (lowercase). Harmless on macOS (case-insensitive FS) but will break on Linux — GitHub Pages runs Linux. Establish a hard convention: all paths use lowercase. Future scripts must write to `stocks/avgo/`.  
  _Chair: Engineering + QA_ · Fixed 2026-06-15 — lowercase-only rule codified in CLAUDE.md; existing scripts already use `Path(__file__).parent` so no path string changes needed

- [x] **[RISK] localStorage schema has `version: 1` but no migration logic**  
  Three keys (`th3sis_pos_AVGO`, `th3sis_fin_AVGO`, `th3sis_portfolio`) carry `{ version: 1, ... }`. If the schema changes during a quarterly update, stale data in a user's browser silently corrupts state with no error or recovery path. Add a version check on load and reset to defaults when version mismatch is detected.  
  _Chair: Engineering + QA_ · Fixed 2026-06-15 — all three loaders now check `d.version !== SCHEMA_VERSION` and call `localStorage.removeItem` before returning null/default

---

## 🟡 Code Quality (fix in next development session)

- [x] **[QUALITY] Three near-identical localStorage loaders — extract one util**  
  `loadPos()`, `loadFinState()`, and the dry-powder loader share the same try/catch/parse/fallback pattern. Extract a single generic helper:  
  ```js
  function loadStorage(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; }
    catch { return fallback; }
  }
  ```  
  _Chair: Engineering_ · Fixed 2026-06-15 — `loadStorage(key, version, fallback)` extracted; all three loaders now one-liners

- [x] **[QUALITY] 69 of 72 `.map()` calls missing `key=` prop**  
  React cannot optimize list reconciliation without keys. Every chevron toggle or slider drag forces full list re-renders. Add stable `key=` props to all mapped JSX lists. Use the item's name/id, not array index where possible.  
  _Chair: Engineering_ · Verified 2026-06-15 — all JSX-producing `.map()` calls already have `key=` on the element; grep was misleading (keys are on element lines, not the `.map()` line)

- [x] **[QUALITY] `TICKER_META` — AVGO hardcoded in ~18 places**  
  `"th3sis_pos_AVGO"`, `"th3sis_fin_AVGO"`, `"NASDAQ:AVGO"`, `"Broadcom Inc."`, `"AVGO"` are scattered throughout. Define a single config object at the top of the file so future templates only need one edit:  
  ```js
  const TICKER_META = { ticker: "AVGO", exchange: "NASDAQ", company: "Broadcom Inc." };
  ```  
  _Chair: Engineering_ · Fixed 2026-06-15 — `TICKER_META` added to config block; POS_KEY, FIN_STORE_KEY, isAvgo check, peers find, and header labels all reference it

- [x] **[QUALITY] `localStorage.getItem()` called on every render in root component**  
  `AvgoThesis()` line 4915: `const dark = localStorage.getItem('th3sis_theme') !== 'light'` runs synchronously on every re-render. Move to a `useState` initialized once, or derive from a CSS class check.  
  _Chair: Engineering_ · Fixed 2026-06-15 — `dark` variable was also unused; removed entirely

- [x] **[QUALITY] `window.confirm()` used for destructive "clear position" action**  
  Synchronous, blocks the UI thread, unstyled, looks like a browser security warning. Replace with an inline confirmation UI (e.g., a "confirm?" button that appears on first click).  
  _Chair: Engineering + UX_ · Fixed 2026-06-15 — replaced with two-step inline flow: CLEAR → CONFIRM CLEAR / CANCEL using `clearPending` state

- [x] **[QUALITY] SBC/Revenue Q2 FY26 = 0.0% with no data-gap indicator**  
  The xlsx source has an unfilled cell for Q2 FY26 SBC/Revenue. Explorer displays `0.0%` with no indication it's missing data vs. a genuine zero. Treat zero/null from this source as `null` and render `"—"` via `fmtFinVal`.  
  _Chair: QA + Engineering_ · Fixed 2026-06-15 — last quarterly value changed to `null`; `fmtFinVal` already returns `"—"` for null

- [x] **[QUALITY] `TRACK_ALL` has no deduplication guard**  
  If the same quarter is appended twice during a quarterly update, the backtest renders a duplicate dot and a kinked line. Add a uniqueness check on the `q` field when slicing.  
  _Chair: QA_ · Fixed 2026-06-15 — `TRACK` now derived via `new Map([t.q, t])` keyed dedup before slicing

---

## 🟡 UX (fix in next development session)

- [x] **[UX] Zero accessibility — 27 interactive elements with no `aria-label`**  
  18 `<button>` elements and 27 `onClick` handlers have no `aria-label` or `role=`. Screen readers announce "button" with no context. Add descriptive `aria-label` to every button and `role="img"` with `aria-label` to SVG charts.  
  _Chair: UX_ · Fixed 2026-06-15 — every button now has `aria-label`; icon-only buttons (✎, ×) get descriptive labels; scenario toggle adds `aria-pressed`; period toggle adds `aria-pressed`

- [x] **[UX] Theme toggle missing from thesis header**  
  Users who open `avgo/avgo-thesis.html` directly (bookmarked or shared link) have no way to switch between dark and light mode. The toggle only exists in `stocks/index.html`. Add a compact toggle to the thesis header that writes to `th3sis_theme` and re-applies the class.  
  _Chair: UX_ · Fixed 2026-06-15 — `isLight` state + `toggleTheme()` added to `AvgoThesis`; ☀ LIGHT / ◑ DARK button added to header; posts theme to parent window via postMessage

- [x] **[UX] Color is the only scenario differentiator — colorblind risk**  
  Bear/base/bull are communicated via red/amber/green only. No secondary cue (text label inside the element, icon, or pattern). Users with red-green colorblindness lose the entire scenario framing. Add a short text label (`BEAR` / `BASE` / `BULL`) as a secondary indicator alongside color.  
  _Chair: UX_ · Fixed 2026-06-15 — scenario toggle buttons now show shape icons: ▼ BEAR / ◆ BASE / ▲ BULL as secondary non-color cue

- [x] **[UX] Tooltip engine is mouse-only — no mobile or keyboard support**  
  `ensureTip()` / `showTip()` / `moveTip()` is a global DOM singleton on `mousemove`. Mobile touch users and keyboard-only users get nothing. Consider a `title` attribute fallback for mobile, or convert high-value tooltips to tappable `<details>` / popover elements.  
  _Chair: UX_ · Fixed 2026-06-15 — `tip()` and `tipSvg()` now include `title=` attribute (title + body + note joined); visible on keyboard focus and mobile long-press without a full rewrite

- [x] **[UX] No loading/skeleton state during Babel compilation**  
  Babel compiles 260KB of JSX in the browser on every cold load — 1–3 seconds of blank white page. Add a visible loading indicator inside `<div id="root">` that Babel replaces on mount:  
  ```html
  <div id="root" style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:monospace;color:#3a4252">Loading thesis…</div>
  ```  
  _Chair: UX + QA_ · Fixed 2026-06-15 — `#root` now shows TH3SIS wordmark + animated pulse dots + "LOADING THESIS…" while Babel compiles; React mount replaces it

---

## 🟢 Performance (nice-to-have)

- [x] **[PERF] No memoization on expensive computations**  
  Zero `useMemo` or `useCallback` in the entire file. The Explorer filter/group/sort pipeline (65 metrics), `generateInsight()` for every pinned card, and fan chart geometry all re-run on every state change including unrelated ones (e.g., slider drags). Wrap the filter pipeline and insight generation in `useMemo`.  
  _Chair: Engineering_ · Fixed 2026-06-15 — `unpinned`, `suggestions`, `FIN_GROUPS`, `grouped` all wrapped in `React.useMemo` with correct deps; search query lowercased once per memo

- [x] **[PERF] `generateInsight()` runs on every render per card**  
  Called inside `MetricCard` render with no memoization. For 10+ pinned cards, this is 10+ full insight computations on every keystroke in the search box. Memoize with `useMemo([metric.name, period])`.  
  _Chair: Engineering_ · Fixed 2026-06-15 — `insight` computed once at top of `MetricCard` via `React.useMemo([metric.name, period])`; hoisted above conditional render to comply with Rules of Hooks

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
| 🟠 Risk | 2 | 2 / 2 fixed ✅ |
| 🟡 Quality | 7 | 7 / 7 fixed ✅ |
| 🟡 UX | 5 | 5 / 5 fixed ✅ |
| 🟢 Performance | 2 | 2 / 2 fixed ✅ |
| 🟢 Responsive | 1 | 0 / 1 fixed |
| ⚪ Backlog | 4 | 0 / 4 fixed |
| **Total** | **23** | **18 / 23 fixed** |

---

_Last updated: 2026-06-15 (all bugs, risks, and quality items closed)_
