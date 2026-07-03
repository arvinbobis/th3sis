---
description: Render + lint a thesis dashboard headlessly before calling it done
---

Run the verification script against: **$ARGUMENTS**

```
npm run verify -- $ARGUMENTS
```

(First time in a fresh checkout: `npm install` once — it needs `playwright` from
`package.json` and downloads a headless Chromium via `npx playwright install chromium` if
the cached browser version doesn't match.)

## What it checks

**Render, in both themes:**
- Zero console/page errors (the live-price fetch failing under `file://` + headless is
  expected and excluded — every thesis already falls back to `FALLBACK_PRICE` gracefully)
- At least one SVG element drew (the fan chart / backtest didn't silently fail)
- A tooltip-bearing element can be hovered without throwing (best-effort — some legacy
  builds don't expose a hoverable `title` attribute yet, that's a warning not a failure)

**Sync-lint, no browser needed:**
- `TRACK_ALL` has no duplicate quarter
- The thesis's own `ALERT` fallback block (if present) still matches `PF_ALERTS` in
  `portfolio-data.js` — catches exactly the kind of silent drift Phase 1 of the machine audit
  eliminated as a *manual* step; this is the automated backstop
- No relative path has an uppercase folder segment (would 404 on GitHub Pages' Linux runner)
- The on-disk folder casing matches what git actually has tracked — macOS being
  case-insensitive can hide a real Linux 404 waiting to happen (this is CLAUDE.md's
  case-sensitivity rule as a check, not just a reminder)
- No hardcoded hex color outside the four permitted semantic colors
  (`#f1564b`/`#e0a83b`/`#3fd07a`/`#2f6dff`) — skipped with a warning for stocks on
  CLAUDE.md's legacy-hex list, since those are already scheduled for their own refactor
- `#root` uses `align-items: safe center; justify-content: safe center`

## Reading the result

Exit code 0 = no hard failures (warnings are fine — they're print-only, matching the
per-stock legacy-migration rhythm elsewhere in CLAUDE.md: a warning on a stock not yet
touched this quarter isn't a blocker). Exit code 1 = something a user would actually notice
is broken. Screenshots land in `tools/.verify-output/<ticker>-{light,dark}.png` — look at
them, don't just trust the exit code; a blank frame with zero console errors is still a
failure to render anything.

## When to run this

Make it the actual last step of `/thesis` and `/update-thesis` — not "verify the JSX
compiles" as a sentence to remember, but a command that either passes or doesn't.
