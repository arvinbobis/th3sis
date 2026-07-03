# Thesis Builder — for Claude Code

A reusable "shell" for building three-scenario investment theses (bear / base / bull) for
any stock, rendered as an interactive HTML dashboard + a quarterly-update checklist. Built
from the META reference project.

## What's in here

```
thesis-builder/
├── CLAUDE.md                      ← the methodology (loaded automatically every session)
├── README.md                      ← this file
├── bootstrap.sh                   ← scaffolds a fresh workspace in one command
├── package.json                   ← pins playwright, used by tools/verify-thesis.js
├── tools/
│   ├── verify-thesis.js           ← headless render + sync-lint check, see /verify-thesis
│   └── build-scorecard.js         ← aggregates every TRACK_ALL, see /scorecard
├── reference/                     ← the META build, as a quality benchmark to match
│   ├── meta-thesis.html
│   └── meta-QUARTERLY-CHECKLIST.md
└── .claude/
    └── commands/
        ├── thesis.md              ← /thesis TICKER         (build a new one)
        ├── update-thesis.md       ← /update-thesis TICKER  (roll an existing one forward)
        ├── verify-thesis.md       ← /verify-thesis TICKER  (headless render + lint check)
        └── scorecard.md           ← /scorecard TICKER      (grade + regenerate calibration)
```

`tools/verify-thesis.js` and `tools/build-scorecard.js` both assume this repo's own layout —
a `stocks/index.html` REGISTRY and a `stocks/portfolio/portfolio-data.js` — since that's what
they cross-check against. A freshly bootstrapped workspace (below) doesn't have those yet;
these checks are meant for a repo that has grown into having a portfolio layer, not a hard
requirement for using `/thesis` on its own.

## Setup — the easy way (bootstrap)

From inside this `thesis-builder` folder:

```
chmod +x bootstrap.sh        # one time, makes it runnable
./bootstrap.sh ~/my-investing
```

That creates a ready-to-use workspace:

```
my-investing/
├── CLAUDE.md                 (methodology, auto-loaded)
├── README.md
├── .claude/commands/         (/thesis, /update-thesis)
├── reference/                (META build to pattern-match against)
└── stocks/                   (one folder per stock — created as you go)
```

Then:
```
cd ~/my-investing
claude                        # open Claude Code here
/thesis NVDA                  # build your first thesis → lands in stocks/NVDA/
```

## Setup — the manual way

If you'd rather not run the script: create your workspace folder, copy `CLAUDE.md`, the
`.claude/` folder, and the `reference/` folder into it, and make an empty `stocks/` folder.
Open the folder in Claude Code. Same result.

> Note on formats: Anthropic now also supports `.claude/skills/<name>/SKILL.md` as the
> newer equivalent of `.claude/commands/*.md`. The commands here use the widely-supported
> `.claude/commands/` format. If you prefer skills, you can move each command into
> `.claude/skills/thesis/SKILL.md` etc. — same `/name` invocation.

## Usage

**Build a new thesis:**
```
/thesis NVDA
```
Claude pulls fresh data, resolves the three framing questions (right valuation ruler, the
KPIs that actually matter for that business, earnings- vs multiple-driven), drafts the three
cases, builds `NVDA-thesis.html`, and generates a tailored quarterly checklist.

**Roll one forward after earnings:**
```
/update-thesis NVDA
```
Refreshes the numbers AND re-audits whether the three cases themselves still hold.

**Verify one renders clean (both `/thesis` and `/update-thesis` already run this as their
last step):**
```
/verify-thesis NVDA
```
Headless render in both themes + a sync-lint pass (TRACK_ALL dedup, alert data drift,
lowercase paths, stray hex colors, disk-vs-git casing). Screenshots land in
`tools/.verify-output/`.

**Grade the last prediction + refresh the calibration page (also runs automatically inside
`/update-thesis`):**
```
/scorecard NVDA
```
Checks whether the most-likely case stated *before* this quarter matched what actually
landed — the only calibration number in the system that isn't hindsight-biased — then
regenerates `stocks/portfolio/scorecard-data.js` for the CALIBRATION page.

**Tip:** if you just want it to build without pausing for your review of the reasoning,
say "just build it" in the same message.

## The one idea to remember

The *structure* travels between stocks; the *content* does not. Every new stock needs three
answers found fresh: (1) what's the right valuation ruler, (2) what 5–6 KPIs actually move
this story, (3) is the bull/bear gap about earnings or about the multiple. Copying one
stock's answers onto another produces something that looks polished and is quietly wrong.

## Honest caveat

Everything these commands produce is an **estimate**, not financial advice. The dashboards
look authoritative — that's exactly why they can fool you. Hold the bands loosely, keep them
wide when the world is uncertain, and always ask "what would prove me wrong?"
