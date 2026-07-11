#!/usr/bin/env node
/*
 * verify-thesis.js — render + lint check for a TH3SIS thesis dashboard.
 *
 * Usage:  node tools/verify-thesis.js <TICKER>
 *
 * Renders the thesis headless in both themes, fails on any console/page error,
 * confirms the fan chart drew, and runs the sync-lint checks from the machine
 * audit (TRACK_ALL dedup, PF_ALERTS match, lowercase paths, no stray hex,
 * #root safe-center). Exit code 1 if any hard check fails; warnings don't fail
 * the run — they're print-only, matching CLAUDE.md's per-stock legacy-migration
 * rhythm (a warning today, not a blocker, on stocks not yet touched).
 */

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { execSync } = require("child_process");
const { runDataLint, findDataFile } = require("./lint-thesis-data");

const ROOT = path.join(__dirname, "..");
const SCREENSHOT_DIR = path.join(ROOT, "tools", ".verify-output");

const LEGACY_HEX_TICKERS = new Set([
  "ALAB", "AMZN", "ASML", "FICO", "GOOGL", "META", "MRVL", "MSFT", "MU", "NVDA", "TSM",
]);
const ALLOWED_SEMANTIC_HEX = new Set(["#f1564b", "#e0a83b", "#3fd07a", "#2f6dff"]);

function fail(msg) { results.push({ ok: false, msg }); }
function warn(msg) { results.push({ ok: null, msg }); }
function pass(msg) { results.push({ ok: true, msg }); }

const results = [];

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

// Node's vm does NOT expose top-level `const`/`let` as own properties of the
// sandbox object — they live in the context's lexical scope instead. So after
// running the script, re-read each name we need by evaluating the bare
// identifier back in that same context.
const PF_GLOBALS = ["PF_ASOF", "PF_ACCT", "PF_ALERTS", "PF_THEMES", "PF_POS", "PF_LIVE", "PF_STRAT", "PF_GATE", "PF_PRESCREEN"];
function loadPortfolioData() {
  const src = fs.readFileSync(path.join(ROOT, "stocks", "portfolio", "portfolio-data.js"), "utf8");
  const context = vm.createContext({});
  vm.runInContext(src, context);
  const out = {};
  for (const name of PF_GLOBALS) {
    out[name] = vm.runInContext(`typeof ${name} !== "undefined" ? ${name} : undefined`, context);
  }
  return out;
}

function checkTrackAllDedup(src, ticker) {
  const m = src.match(/const TRACK_ALL\s*=\s*\[([\s\S]*?)\n\];/);
  if (!m) { warn(`${ticker}: no TRACK_ALL array found (may not use the backtest convention yet)`); return; }
  const qs = [...m[1].matchAll(/q:\s*"([^"]+)"/g)].map((x) => x[1]);
  const dupes = qs.filter((q, i) => qs.indexOf(q) !== i);
  if (dupes.length) fail(`${ticker}: TRACK_ALL has duplicate quarter(s): ${[...new Set(dupes)].join(", ")}`);
  else pass(`${ticker}: TRACK_ALL has ${qs.length} quarters, no duplicates`);
}

function checkAlertMatchesPfAlerts(src, ticker, pf) {
  const m = src.match(/const ALERT = \{([\s\S]*?)\n\};/);
  if (!m) { warn(`${ticker}: no local ALERT fallback block (fine if this stock isn't armed)`); return; }
  const local = {};
  const floorM = m[1].match(/buyFloor:\s*(\d+)/);
  const intactM = m[1].match(/thesisIntact:\s*(true|false)/);
  const earnM = m[1].match(/nextEarnings:\s*"([^"]+)"/);
  if (floorM) local.buyFloor = Number(floorM[1]);
  if (intactM) local.thesisIntact = intactM[1] === "true";
  if (earnM) local.nextEarnings = earnM[1];

  const canonical = pf.PF_ALERTS && pf.PF_ALERTS[ticker];
  if (!canonical) { warn(`${ticker}: has a local ALERT block but no PF_ALERTS row — add one so index.html's radar picks it up`); return; }

  const mismatches = Object.keys(local).filter((k) => local[k] !== canonical[k]);
  if (mismatches.length) {
    fail(`${ticker}: local ALERT fallback has drifted from PF_ALERTS on: ${mismatches.join(", ")} (local=${JSON.stringify(local)} vs canonical=${JSON.stringify(canonical)})`);
  } else {
    pass(`${ticker}: local ALERT fallback matches PF_ALERTS exactly`);
  }
}

function checkLowercasePaths(src, ticker) {
  const hrefs = [...src.matchAll(/(?:href|src)="(\.\.?\/[^"]+)"/g)].map((x) => x[1]);
  const bad = hrefs.filter((h) => /\/[A-Z]/.test(h));
  if (bad.length) fail(`${ticker}: relative path(s) with an uppercase folder segment: ${bad.join(", ")} — will 404 on GitHub Pages' Linux runner`);
  else pass(`${ticker}: all relative paths are lowercase`);
}

function checkDiskVsGitCasing(ticker, registryPath) {
  const folder = registryPath.split("/")[0];
  let tracked;
  try {
    tracked = execSync(`git ls-files stocks/`, { cwd: ROOT, encoding: "utf8" })
      .split("\n")
      .filter((f) => f.toLowerCase().startsWith(`stocks/${folder.toLowerCase()}/`));
  } catch (_) { tracked = []; }
  if (!tracked.length) { warn(`${ticker}: no git-tracked files under a stocks/${folder}/-like path (new stock, or not committed yet)`); return; }
  const trackedFolder = tracked[0].split("/")[1];
  const diskEntries = fs.readdirSync(path.join(ROOT, "stocks"));
  const diskFolder = diskEntries.find((d) => d.toLowerCase() === folder.toLowerCase());
  if (diskFolder && trackedFolder && diskFolder !== trackedFolder) {
    warn(`${ticker}: on-disk folder is "${diskFolder}" but git tracks it as "${trackedFolder}" — case-insensitive macOS is masking a Linux 404 risk (F6). Migrate at this stock's next quarterly touch.`);
  } else {
    pass(`${ticker}: disk casing matches git-tracked casing ("${trackedFolder}")`);
  }
}

function checkStrayHex(src, ticker) {
  if (LEGACY_HEX_TICKERS.has(ticker)) {
    warn(`${ticker}: on the legacy-hex list (CLAUDE.md) — hardcoded hex check skipped until its next quarterly refactor`);
    return;
  }
  const scriptMatch = src.match(/<script type="text\/babel">([\s\S]*?)<\/script>/);
  if (!scriptMatch) { warn(`${ticker}: no Babel script block found to scan for hex colors`); return; }
  const hexes = [...scriptMatch[1].matchAll(/#[0-9a-fA-F]{6}\b/g)].map((x) => x[0].toLowerCase());
  const stray = [...new Set(hexes)].filter((h) => !ALLOWED_SEMANTIC_HEX.has(h));
  if (stray.length) fail(`${ticker}: hardcoded hex color(s) outside the 4 permitted semantic colors: ${stray.join(", ")} — use var(--...) from theme.css instead`);
  else pass(`${ticker}: no stray hardcoded hex colors in the JSX`);
}

function checkRootSafeCenter(src, ticker) {
  const m = src.match(/id="root"\s+style="([^"]*)"/);
  if (!m) { warn(`${ticker}: no #root element with an inline style found`); return; }
  if (/align-items:\s*safe center/.test(m[1]) && /justify-content:\s*safe center/.test(m[1])) {
    pass(`${ticker}: #root uses "safe center" (won't clip an overflowing header)`);
  } else {
    fail(`${ticker}: #root does not use "align-items: safe center; justify-content: safe center" — a tall thesis's header can clip unreachably above the scroll origin`);
  }
}

async function checkRenderBothThemes(absPath, ticker) {
  let chromium;
  try { ({ chromium } = require("playwright")); }
  catch (_) { warn(`${ticker}: playwright not installed — run 'npm install' in thesis-builder first. Skipping render checks.`); return; }

  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  const browser = await chromium.launch();
  for (const theme of ["light", "dark"]) {
    const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
    const errors = [];
    // The live-price fetch (Yahoo via an allorigins.win CORS proxy) is unreliable
    // under file:// + headless conditions for reasons unrelated to the app itself
    // (CORS, rate limits, proxy timeouts) — every thesis already falls back to
    // FALLBACK_PRICE gracefully when it fails, so failures on THAT specific request
    // are excluded rather than matched by fragile error-message text.
    const EXCLUDED_HOSTS = ["allorigins.win", "query1.finance.yahoo.com", "stooq.com"];
    page.on("requestfailed", (r) => { if (!EXCLUDED_HOSTS.some((h) => r.url().includes(h))) errors.push(`REQUESTFAILED: ${r.url()} — ${r.failure()?.errorText}`); });
    page.on("response", (r) => { if (r.status() >= 400 && !EXCLUDED_HOSTS.some((h) => r.url().includes(h))) errors.push(`HTTP ${r.status()}: ${r.url()}`); });
    // Two console shapes to exclude for the same reason: (1) the generic
    // "Failed to load resource" line never includes a URL — the requestfailed/
    // response handlers above already attribute and filter that one by host with
    // real information attached; (2) a CORS-policy console message DOES spell out
    // the full blocked URL inline, so it needs its own host check here too.
    page.on("console", (msg) => {
      if (msg.type() !== "error") return;
      const text = msg.text();
      if (/^Failed to load resource:/.test(text)) return;
      if (EXCLUDED_HOSTS.some((h) => text.includes(h))) return;
      errors.push(text);
    });
    page.on("pageerror", (err) => errors.push(`PAGEERROR: ${err.message}`));
    await page.addInitScript((t) => localStorage.setItem("th3sis_theme", t), theme);
    await page.goto(`file://${absPath}`, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(1200);

    const realErrors = errors;
    if (realErrors.length) fail(`${ticker} [${theme}]: console/page error(s): ${realErrors.slice(0, 3).join(" | ")}`);
    else pass(`${ticker} [${theme}]: renders with no console/page errors (CORS on the live-price fetch under file:// is expected and excluded)`);

    const svgCount = await page.evaluate(() => document.querySelectorAll("svg").length);
    if (svgCount > 0) pass(`${ticker} [${theme}]: ${svgCount} SVG element(s) rendered (fan chart / backtest present)`);
    else fail(`${ticker} [${theme}]: zero SVG elements found — the fan chart likely failed to draw`);

    const titleEl = await page.$("[title]:not([title=''])");
    if (titleEl) {
      await titleEl.hover();
      await page.waitForTimeout(200);
      pass(`${ticker} [${theme}]: hovered a tooltip-bearing element without throwing`);
    } else {
      warn(`${ticker} [${theme}]: no element with a non-empty title attribute found to hover (best-effort check only)`);
    }

    const shot = path.join(SCREENSHOT_DIR, `${ticker.toLowerCase()}-${theme}.png`);
    await page.screenshot({ path: shot, fullPage: false });
    await page.close();
  }
  await browser.close();
}

async function main() {
  const ticker = (process.argv[2] || "").toUpperCase();
  if (!ticker) {
    console.error("Usage: node tools/verify-thesis.js <TICKER>");
    process.exit(2);
  }

  const registry = loadRegistry();
  const registryPath = registry[ticker];
  if (!registryPath) {
    console.error(`"${ticker}" is not in stocks/index.html's REGISTRY.`);
    process.exit(2);
  }
  const absPath = path.join(ROOT, "stocks", registryPath);
  if (!fs.existsSync(absPath)) {
    console.error(`REGISTRY points at ${registryPath} but that file doesn't exist on disk.`);
    process.exit(2);
  }

  const src = fs.readFileSync(absPath, "utf8");
  const pf = loadPortfolioData();

  // Migrated stocks (engine split — see CLAUDE.md's ENGINE SPLIT note) keep all
  // content in thesis-data.js, not inline in the HTML — the regex-based checks
  // below would silently find nothing there. Delegate to the tier-1 data lint
  // instead, which reads the same facts from their real location. Legacy stocks
  // (no thesis-data.js yet) keep the original inline-HTML checks unchanged.
  if (findDataFile(ticker)) {
    for (const r of runDataLint(ticker)) results.push(r);
  } else {
    checkTrackAllDedup(src, ticker);
    checkAlertMatchesPfAlerts(src, ticker, pf);
    checkLowercasePaths(src, ticker);
    checkDiskVsGitCasing(ticker, registryPath);
    checkStrayHex(src, ticker);
  }
  checkRootSafeCenter(src, ticker);
  await checkRenderBothThemes(absPath, ticker);

  console.log(`\n── verify-thesis ${ticker} ──────────────────────────────────────`);
  for (const r of results) {
    const glyph = r.ok === true ? "✓" : r.ok === false ? "✗" : "⚠";
    console.log(`${glyph} ${r.msg}`);
  }
  const failures = results.filter((r) => r.ok === false).length;
  const warnings = results.filter((r) => r.ok === null).length;
  console.log(`──────────────────────────────────────────────────────────────\n${failures} failed · ${warnings} warned · ${results.length - failures - warnings} passed`);
  console.log(`Screenshots: ${SCREENSHOT_DIR}/${ticker.toLowerCase()}-{light,dark}.png`);
  process.exit(failures ? 1 : 0);
}

main().catch((err) => { console.error(err); process.exit(2); });
