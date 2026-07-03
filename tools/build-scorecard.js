#!/usr/bin/env node
/*
 * build-scorecard.js — aggregate every thesis's TRACK_ALL into one scorecard.
 *
 * Run:  node tools/build-scorecard.js
 *
 * Writes stocks/portfolio/scorecard-data.js directly (not via stdout redirection — shell
 * redirection truncates the target file before Node runs, which would destroy PF_GRADED
 * before this script gets a chance to read it back). PF_SCORECARD and PF_PREDICTIONS are
 * fully regenerated from source each run (same pattern as theme.css /
 * apply-config-to-th3sis.js — edit this script, don't hand-edit those two). PF_GRADED is
 * the one field that's preserved across runs — see the comment near the bottom.
 *
 * Two things this can honestly compute from data that already exists:
 *   - BAND COVERAGE: for every historical quarter in every thesis's TRACK_ALL, did the
 *     price land inside some band (bear/base/bull, including a stated transition like
 *     "bear→base"), or was it a clean miss? This needs no new prediction — `landed` is
 *     already the human-curated record the backtest panel itself renders.
 *   - THE CURRENT STANDING PREDICTION per ticker: whatever the most-recent populated
 *     quarterly-log entry states as "Most-likely case" — this is real, already-recorded
 *     judgment, not something this script invents.
 *
 * What it deliberately does NOT compute: a most-probable-case HIT RATE. Grading a
 * prediction against an outcome needs the prediction to have been made BEFORE that
 * outcome existed — reconstructing that retroactively from hindsight-adjusted TRACK_ALL
 * entries would be exactly the bias CLAUDE.md's data-freshness rules warn against. That
 * number starts at zero and grows for real only once /scorecard runs after a stock's
 * NEXT /update-thesis, comparing the standing prediction captured here against what
 * actually lands.
 */

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const OUTPUT_PATH = path.join(ROOT, "stocks", "portfolio", "scorecard-data.js");

// PF_GRADED is hand-maintained by the /scorecard skill (it records a real prospective
// grading decision that this script has no way to derive on its own) — preserve whatever
// is already in the output file across regenerations instead of silently wiping it.
function loadExistingGraded() {
  if (!fs.existsSync(OUTPUT_PATH)) return [];
  try {
    const src = fs.readFileSync(OUTPUT_PATH, "utf8");
    const context = vm.createContext({});
    vm.runInContext(src, context);
    return vm.runInContext("typeof PF_GRADED !== 'undefined' ? PF_GRADED : []", context);
  } catch (_) {
    return [];
  }
}

function loadRegistry() {
  const indexSrc = fs.readFileSync(path.join(ROOT, "stocks", "index.html"), "utf8");
  const m = indexSrc.match(/const REGISTRY = \{([\s\S]*?)\n\};/);
  const entries = {};
  const re = /(\w+):\s*\{\s*path:\s*"([^"]+)"/g;
  let mm;
  while ((mm = re.exec(m[1]))) entries[mm[1]] = mm[2];
  return entries;
}

function extractTrackAll(src) {
  const m = src.match(/const TRACK_ALL\s*=\s*\[([\s\S]*?)\n\];/);
  if (!m) return [];
  const rows = [];
  const rowRe = /\{\s*q:\s*"([^"]+)",\s*date:\s*"([^"]+)",\s*post:\s*([\d.]+)[^}]*?landed:\s*"([^"]+)",\s*conf:\s*"([^"]+)"\s*\}/g;
  let rm;
  while ((rm = rowRe.exec(m[1]))) {
    rows.push({ quarter: rm[1], date: rm[2], post: Number(rm[3]), landed: rm[4], conf: rm[5] });
  }
  return rows;
}

function extractStandingPrediction(ticker, registryPath) {
  const folder = registryPath.split("/")[0];
  const checklistGuess = path.join(ROOT, "stocks", folder, `${ticker.toLowerCase()}-QUARTERLY-CHECKLIST.md`);
  const altCase = path.join(ROOT, "stocks", folder, `${ticker}-QUARTERLY-CHECKLIST.md`);
  const file = fs.existsSync(checklistGuess) ? checklistGuess : (fs.existsSync(altCase) ? altCase : null);
  if (!file) return null;
  const src = fs.readFileSync(file, "utf8");
  // Only match populated log entries (a real date after "UPDATED ON:"), not the blank template.
  const entries = [...src.matchAll(/QUARTER:\s*(\S+\s+\S+)\s+UPDATED ON:\s*(\d{4}-\d{2}-\d{2})[\s\S]*?Most-likely case:\s*([^\n(]+)(?:\(([^)]*)\))?/g)];
  if (!entries.length) return null;
  const last = entries[entries.length - 1];
  return { quarter: last[1].trim().replace(/\s+/g, " "), asOf: last[2], case: last[3].trim(), note: (last[4] || "").trim() };
}

function main() {
  const graded = loadExistingGraded(); // read BEFORE writing anything
  const registry = loadRegistry();
  const scorecard = [];
  const predictions = {};

  for (const [ticker, registryPath] of Object.entries(registry)) {
    const absPath = path.join(ROOT, "stocks", registryPath);
    if (!fs.existsSync(absPath)) continue;
    const src = fs.readFileSync(absPath, "utf8");
    const rows = extractTrackAll(src);
    for (const r of rows) {
      const bandHit = !/miss|outside/i.test(r.landed);
      scorecard.push({ t: ticker, quarter: r.quarter, date: r.date, post: r.post, landed: r.landed, conf: r.conf, bandHit });
    }
    const pred = extractStandingPrediction(ticker, registryPath);
    if (pred) predictions[ticker] = pred;
  }

  const out = `/* ───────────────────────────────────────────────────────────────────────────
 * scorecard-data.js — GENERATED by tools/build-scorecard.js. Do not hand-edit
 * PF_SCORECARD or PF_PREDICTIONS (PF_GRADED is the one exception — see below).
 * Regenerate:  node tools/build-scorecard.js
 *
 * PF_SCORECARD: every historical quarter across every thesis's TRACK_ALL, with whether
 * price landed inside some band ("bandHit"). These are backtest-reconstructed quarters
 * (see CLAUDE.md data-freshness rules) — high band-hit rates here mostly reflect bands
 * chosen to explain what already happened, not a forward-looking track record.
 *
 * PF_PREDICTIONS: the CURRENT standing "most-likely case" per ticker, taken verbatim from
 * that stock's own QUARTERLY-UPDATE-CHECKLIST.md log (real, already-recorded judgment).
 * This is what /scorecard grades against once each stock's NEXT /update-thesis appends a
 * new TRACK_ALL entry — that comparison is the only honest, non-hindsight-biased number
 * this system can produce, and it starts at zero rows until that happens for real.
 * ─────────────────────────────────────────────────────────────────────────── */

const PF_SCORECARD = ${JSON.stringify(scorecard, null, 2)};

const PF_PREDICTIONS = ${JSON.stringify(predictions, null, 2)};

// Graded transitions: rows where a PRIOR standing prediction has been checked against a
// LATER landed outcome. Hand-appended by the /scorecard skill, then PRESERVED by this
// script on every regeneration (it has no way to derive a grading decision on its own —
// see .claude/commands/scorecard.md). Each entry: { t, predictedAt, predictedCase,
// gradedQuarter, landed, matched }.
const PF_GRADED = ${JSON.stringify(graded, null, 2)};
`;
  fs.writeFileSync(OUTPUT_PATH, out);
  console.log(`Wrote ${OUTPUT_PATH.replace(ROOT + "/", "")} — ${scorecard.length} scorecard rows, ${Object.keys(predictions).length} standing prediction(s), ${graded.length} graded transition(s) preserved.`);
}

main();
