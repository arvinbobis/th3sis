#!/usr/bin/env node
/*
 * lint-thesis-data.js — tier-1 schema lint for a migrated stock's thesis-data.js.
 * No browser, no Chromium — runs in milliseconds. This is what a normal quarterly
 * data-only touch needs; the full Playwright verify-thesis.js pass is only required
 * when stocks/engine/thesis-engine.jsx itself changes (see CLAUDE.md's ENGINE SPLIT
 * note). Exported functions are reused by verify-thesis.js for migrated stocks so
 * there is exactly one implementation of each check, not two that can drift apart.
 *
 * Usage: node tools/lint-thesis-data.js <TICKER>
 * Exit 1 on any FAIL.
 */

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { execSync } = require("child_process");

const ROOT = path.join(__dirname, "..");

// Same legacy exemption list as verify-thesis.js — a migrated stock still inherits
// its pre-migration hex debt until a deliberate palette refactor, tracked separately.
const LEGACY_HEX_TICKERS = new Set([
  "ALAB", "AMZN", "ASML", "FICO", "GOOGL", "META", "MRVL", "MSFT", "MU", "NVDA", "TSM",
]);
const ALLOWED_SEMANTIC_HEX = new Set(["#f1564b", "#e0a83b", "#3fd07a", "#2f6dff"]);

const REQUIRED_GLOBALS = [
  "TICKER_META", "AS_OF_DATE", "CASES", "FALLBACK_PRICE", "ALERT", "HISTORY",
  "PROJ_END", "FUTURE_Q", "SIGNALS", "MARGIN", "KPI_HIST", "KPI_PROJ",
  "TRACK_ALL", "TRACK_WINDOW", "VAL_CONFIG", "SIGNAL_HELP", "TAG_HELP",
  "THESIS_ITEMS", "PRICE_ZONES", "GEOM", "TEXT",
];
const REQUIRED_CASE_FIELDS = ["key", "label", "accent", "glow", "target12", "op", "breaks", "requires01", "requires02"];

function findDataFile(ticker) {
  const registry = loadRegistry();
  const registryPath = registry[ticker];
  if (!registryPath) return null;
  const folder = registryPath.split("/")[0];
  const dataPath = path.join(ROOT, "stocks", folder, "thesis-data.js");
  return fs.existsSync(dataPath) ? { dataPath, folder, registryPath } : null;
}

function loadRegistry() {
  const indexSrc = fs.readFileSync(path.join(ROOT, "stocks", "index.html"), "utf8");
  const m = indexSrc.match(/const REGISTRY = \{([\s\S]*?)\n\};/);
  if (!m) throw new Error("Could not find REGISTRY in stocks/index.html");
  const entries = {};
  const re = /(\w+):\s*\{\s*path:\s*"([^"]+)"/g;
  let mm;
  while ((mm = re.exec(m[1]))) entries[mm[1]] = mm[2];
  return entries;
}

const PF_GLOBALS = ["PF_ALERTS"];
function loadPortfolioAlerts() {
  const src = fs.readFileSync(path.join(ROOT, "stocks", "portfolio", "portfolio-data.js"), "utf8");
  const context = vm.createContext({});
  vm.runInContext(src, context);
  return vm.runInContext(`typeof PF_ALERTS !== "undefined" ? PF_ALERTS : undefined`, context);
}

// Loads thesis-data.js in an isolated vm context and reads back every top-level
// const/let by name (vm doesn't expose them as own properties of the sandbox).
function loadThesisData(dataPath) {
  const src = fs.readFileSync(dataPath, "utf8");
  const context = vm.createContext({});
  vm.runInContext(src, context);
  const out = { __src: src };
  for (const name of REQUIRED_GLOBALS) {
    out[name] = vm.runInContext(`typeof ${name} !== "undefined" ? ${name} : undefined`, context);
  }
  return out;
}

function checkRequiredGlobals(data, ticker, results) {
  const missing = REQUIRED_GLOBALS.filter((g) => data[g] === undefined);
  if (missing.length) results.push({ ok: false, msg: `${ticker}: thesis-data.js is missing required global(s): ${missing.join(", ")}` });
  else results.push({ ok: true, msg: `${ticker}: all ${REQUIRED_GLOBALS.length} required globals present in thesis-data.js` });
}

function checkCaseFields(data, ticker, results) {
  if (!data.CASES) return;
  for (const key of ["bear", "base", "bull"]) {
    const c = data.CASES[key];
    if (!c) { results.push({ ok: false, msg: `${ticker}: CASES.${key} is missing entirely` }); continue; }
    const missing = REQUIRED_CASE_FIELDS.filter((f) => c[f] === undefined || c[f] === "");
    if (missing.length) results.push({ ok: false, msg: `${ticker}: CASES.${key} missing field(s): ${missing.join(", ")}` });
    else if (String(c.op).length < 50) results.push({ ok: false, msg: `${ticker}: CASES.${key}.op looks like a placeholder (${String(c.op).length} chars) — every case needs a real 3-4 sentence narrative per CLAUDE.md's quality bar` });
    else results.push({ ok: true, msg: `${ticker}: CASES.${key} has all required fields with a real narrative` });
  }
}

// Catches the exact ALAB-class bug: a thesis-data.js whose TICKER_META doesn't
// match the folder it lives in (copy-paste residue from another stock's file).
function checkTickerIdentity(data, ticker, folder, results) {
  const t = data.TICKER_META && data.TICKER_META.ticker;
  if (!t) return; // already flagged by checkRequiredGlobals
  if (t.toUpperCase() !== ticker.toUpperCase()) {
    results.push({ ok: false, msg: `${ticker}: TICKER_META.ticker is "${t}" but this file lives in stocks/${folder}/ — copy-paste residue from another stock's data file (the exact class of bug that hit ALAB)` });
  } else {
    results.push({ ok: true, msg: `${ticker}: TICKER_META.ticker matches its own folder` });
  }
}

function checkTrackAllDedup(data, ticker, results) {
  if (!Array.isArray(data.TRACK_ALL)) return;
  const qs = data.TRACK_ALL.map((t) => t.q);
  const dupes = qs.filter((q, i) => qs.indexOf(q) !== i);
  if (dupes.length) results.push({ ok: false, msg: `${ticker}: TRACK_ALL has duplicate quarter(s): ${[...new Set(dupes)].join(", ")}` });
  else results.push({ ok: true, msg: `${ticker}: TRACK_ALL has ${qs.length} quarters, no duplicates` });
}

function checkAlertDrift(data, ticker, results) {
  const local = data.ALERT;
  if (!local) { results.push({ ok: null, msg: `${ticker}: no ALERT block (fine if this stock isn't armed)` }); return; }
  const pfAlerts = loadPortfolioAlerts();
  const canonical = pfAlerts && pfAlerts[ticker];
  if (!canonical) { results.push({ ok: null, msg: `${ticker}: has an ALERT block but no PF_ALERTS row — add one so index.html's radar picks it up` }); return; }
  const compareKeys = ["buyFloor", "thesisIntact", "nextEarnings"];
  const mismatches = compareKeys.filter((k) => local[k] !== canonical[k]);
  if (mismatches.length) {
    results.push({ ok: false, msg: `${ticker}: ALERT has drifted from PF_ALERTS on: ${mismatches.join(", ")} (local=${JSON.stringify(local)} vs canonical=${JSON.stringify(canonical)})` });
  } else {
    results.push({ ok: true, msg: `${ticker}: ALERT matches PF_ALERTS exactly` });
  }
}

function checkStrayHex(data, ticker, results) {
  if (LEGACY_HEX_TICKERS.has(ticker)) {
    results.push({ ok: null, msg: `${ticker}: on the legacy-hex list (CLAUDE.md) — hardcoded hex check skipped until its next quarterly refactor` });
    return;
  }
  const hexes = [...data.__src.matchAll(/#[0-9a-fA-F]{6}\b/g)].map((x) => x[0].toLowerCase());
  const stray = [...new Set(hexes)].filter((h) => !ALLOWED_SEMANTIC_HEX.has(h));
  if (stray.length) results.push({ ok: false, msg: `${ticker}: hardcoded hex color(s) outside the 4 permitted semantic colors: ${stray.join(", ")}` });
  else results.push({ ok: true, msg: `${ticker}: no stray hardcoded hex colors in thesis-data.js` });
}

function checkLowercasePaths(htmlSrc, ticker, results) {
  const hrefs = [...htmlSrc.matchAll(/(?:href|src)="(\.\.?\/[^"]+)"/g)].map((x) => x[1]);
  const bad = hrefs.filter((h) => /\/[A-Z]/.test(h));
  if (bad.length) results.push({ ok: false, msg: `${ticker}: relative path(s) with an uppercase folder segment: ${bad.join(", ")} — will 404 on GitHub Pages' Linux runner` });
  else results.push({ ok: true, msg: `${ticker}: all relative paths are lowercase` });
}

function checkEngineWiring(htmlSrc, ticker, results) {
  const usesEngine = /src="\.\.\/engine\/thesis-engine\.js"/.test(htmlSrc);
  const usesDataFile = /src="thesis-data\.js"/.test(htmlSrc);
  const hasInlineBabel = /<script type="text\/babel">[\s\S]{200,}/.test(htmlSrc);
  if (!usesEngine || !usesDataFile) {
    results.push({ ok: false, msg: `${ticker}: has a thesis-data.js but its HTML shell doesn't reference both thesis-data.js and ../engine/thesis-engine.js — migration is incomplete` });
  } else if (hasInlineBabel) {
    results.push({ ok: false, msg: `${ticker}: HTML shell still has a substantial inline <script type="text/babel"> block alongside the engine reference — looks like a partial/reverted migration` });
  } else {
    results.push({ ok: true, msg: `${ticker}: HTML shell correctly wired to thesis-data.js + the shared engine, no leftover inline JSX` });
  }
}

function checkDiskVsGitCasing(ticker, folder, results) {
  let tracked;
  try {
    tracked = execSync(`git ls-files stocks/`, { cwd: ROOT, encoding: "utf8" })
      .split("\n")
      .filter((f) => f.toLowerCase().startsWith(`stocks/${folder.toLowerCase()}/`));
  } catch (_) { tracked = []; }
  if (!tracked.length) { results.push({ ok: null, msg: `${ticker}: no git-tracked files under stocks/${folder}/ yet (new stock, or not committed)` }); return; }
  const trackedFolder = tracked[0].split("/")[1];
  const diskEntries = fs.readdirSync(path.join(ROOT, "stocks"));
  const diskFolder = diskEntries.find((d) => d.toLowerCase() === folder.toLowerCase());
  if (diskFolder && trackedFolder && diskFolder !== trackedFolder) {
    results.push({ ok: null, msg: `${ticker}: on-disk folder is "${diskFolder}" but git tracks it as "${trackedFolder}" — case-insensitive macOS masking a Linux 404 risk` });
  } else {
    results.push({ ok: true, msg: `${ticker}: disk casing matches git-tracked casing ("${trackedFolder}")` });
  }
}

function runDataLint(ticker) {
  const results = [];
  const found = findDataFile(ticker);
  if (!found) {
    results.push({ ok: null, msg: `${ticker}: no thesis-data.js found — not migrated to the engine-split convention yet, nothing to lint here` });
    return results;
  }
  const { dataPath, folder, registryPath } = found;
  const data = loadThesisData(dataPath);
  const htmlPath = path.join(ROOT, "stocks", registryPath);
  const htmlSrc = fs.existsSync(htmlPath) ? fs.readFileSync(htmlPath, "utf8") : "";

  checkRequiredGlobals(data, ticker, results);
  checkCaseFields(data, ticker, results);
  checkTickerIdentity(data, ticker, folder, results);
  checkTrackAllDedup(data, ticker, results);
  checkAlertDrift(data, ticker, results);
  checkStrayHex(data, ticker, results);
  if (htmlSrc) {
    checkLowercasePaths(htmlSrc, ticker, results);
    checkEngineWiring(htmlSrc, ticker, results);
  }
  checkDiskVsGitCasing(ticker, folder, results);
  return results;
}

module.exports = { runDataLint, findDataFile };

if (require.main === module) {
  const ticker = (process.argv[2] || "").toUpperCase();
  if (!ticker) {
    console.error("Usage: node tools/lint-thesis-data.js <TICKER>");
    process.exit(2);
  }
  const results = runDataLint(ticker);
  console.log(`\n── lint-thesis-data ${ticker} ──────────────────────────────────`);
  for (const r of results) {
    const glyph = r.ok === true ? "✓" : r.ok === false ? "✗" : "⚠";
    console.log(`${glyph} ${r.msg}`);
  }
  const failures = results.filter((r) => r.ok === false).length;
  const warnings = results.filter((r) => r.ok === null).length;
  console.log(`──────────────────────────────────────────────────────────────\n${failures} failed · ${warnings} warned · ${results.length - failures - warnings} passed`);
  process.exit(failures ? 1 : 0);
}
