/* ╔══════════════════════════════════════════════════════════════════════════╗
   ║   TH3SIS SHARED RENDERING ENGINE — thesis-engine.jsx                     ║
   ║                                                                          ║
   ║   ⚠ ZERO company-specific content belongs in this file. Every number,    ║
   ║   narrative, tooltip, or label that mentions a company, a quarter, a     ║
   ║   guide, or an event lives in the stock's thesis-data.js (globals:       ║
   ║   TICKER_META, CASES, TEXT, GEOM, …). This rule is what makes the        ║
   ║   engine safely reusable — the ALAB copy-paste disaster (AVGO's data     ║
   ║   shipping inside ALAB's file) is impossible by construction here.       ║
   ║                                                                          ║
   ║   Source of truth: THIS .jsx file. The .js next to it is compiled:       ║
   ║     npx esbuild stocks/engine/thesis-engine.jsx --loader:.jsx=jsx \      ║
   ║       --outfile=stocks/engine/thesis-engine.js                           ║
   ║   Any engine edit ⇒ recompile + FULL /verify-thesis Playwright pass.     ║
   ║   Data-file edits need only tools/lint-thesis-data.js (no browser).      ║
   ╚══════════════════════════════════════════════════════════════════════════╝ */

const { useState, useEffect } = React;

const FONT_MONO = "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace";
const FONT_DISPLAY = "'Spectral', Georgia, serif";
const TICKER = TICKER_META.ticker;

// ── Engine CSS (injected so per-stock HTML stays a thin shell) ─────────────
const ENGINE_CSS = `
  html, body { margin: 0; padding: 0; background: var(--page-bg); }
  * { box-sizing: border-box; }
  @keyframes fadeUp { from { opacity:0; transform: translateY(10px);} to {opacity:1; transform:none;} }
  @keyframes drawIn { from { stroke-dashoffset: 2000; } to { stroke-dashoffset: 0; } }
  @keyframes pop { 0%{opacity:0; transform:scale(0.4);} 70%{transform:scale(1.15);} 100%{opacity:1; transform:scale(1);} }
  @keyframes pulse { 0%,100%{opacity:0.4;} 50%{opacity:1;} }
  .hist-line { stroke-dasharray: 1400; animation: drawIn 1.6s ease forwards; }
  .track-line { stroke-dasharray: 2000; animation: drawIn 1.8s ease .2s forwards; }
  .fan-mid { stroke-dasharray: 6 5; animation: fadeUp .8s ease .4s both; }
  .fan-band { animation: fadeUp .9s ease .3s both; }
  .diamond { animation: pop .5s cubic-bezier(.2,1.4,.4,1) both; }
  .panel { animation: fadeUp .6s ease both; }
  .seg-btn { transition: all .18s ease; cursor: pointer; }
  .seg-btn:hover { filter: brightness(1.25); }
  .dot-track { animation: pulse 2.2s ease-in-out infinite; }
  .tip-target { cursor: help; }
  .tip-target:hover { filter: brightness(1.18); }
  #tip-box {
    position: fixed; z-index: 9999; max-width: 300px; pointer-events: none;
    background: var(--tip-bg); border: 1px solid var(--tip-bd);
    border-radius: 10px; padding: 12px 14px;
    box-shadow: 0 18px 50px rgba(0,0,0,0.25); opacity: 0; transition: opacity .14s ease;
    font-family: 'JetBrains Mono', monospace;
  }
  #tip-box.on { opacity: 1; }
  #tip-box .tt { font-size: 11px; font-weight: 700; letter-spacing: .08em; margin-bottom: 5px; }
  #tip-box .tb { font-size: 11.5px; line-height: 1.55; color: var(--tx2); }
  #tip-box .tn { font-size: 10px; color: var(--tx5); margin-top: 7px; font-style: italic; }
  input[type="number"] { -moz-appearance:textfield; }
  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button { -webkit-appearance:none; margin:0; }
  input[type="number"]:focus { outline: 1px solid var(--blue-soft); outline-offset: 1px; }
  .ld-dot { width:5px; height:5px; border-radius:50%; background:#46aad9; display:inline-block; animation:pulse 1.2s ease-in-out infinite; }
  .grain::before { content:""; position:absolute; inset:0; pointer-events:none; opacity:var(--grain-op);
    border-radius:inherit;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
  @media (max-width: 768px) {
    .hdr-right      { flex-wrap: wrap !important; gap: 8px !important; }
    .hdr-company    { display: none !important; }
    .resp-2col-main { grid-template-columns: 1fr !important; }
    .resp-3col      { grid-template-columns: 1fr 1fr !important; }
  }
  @media (max-width: 480px) {
    .resp-3col { grid-template-columns: 1fr !important; }
    .resp-2col { grid-template-columns: 1fr !important; }
  }
`;
(function injectEngineCss() {
  const el = document.createElement("style");
  el.textContent = ENGINE_CSS;
  document.head.appendChild(el);
})();

// ── Live price ──────────────────────────────────────────────────────────────
let NOW_PRICE = FALLBACK_PRICE;   // mutated in-place by a successful live fetch

async function fetchLivePrice() {
  if (!LIVE_PRICE.enabled) return null;
  try {
    let price = null;
    if (LIVE_PRICE.provider === "finnhub" && LIVE_PRICE.finnhubToken) {
      const r = await fetch(`https://finnhub.io/api/v1/quote?symbol=${LIVE_PRICE.symbol}&token=${LIVE_PRICE.finnhubToken}`);
      if (!r.ok) return null;
      price = Number((await r.json()).c);
    } else {
      const yahoo = `https://query1.finance.yahoo.com/v8/finance/chart/${LIVE_PRICE.symbol}?interval=1d&range=1d`;
      const r = await fetch(LIVE_PRICE.corsProxy + encodeURIComponent(yahoo));
      if (!r.ok) return null;
      const inner = JSON.parse((await r.json()).contents);
      price = Number(inner.chart.result[0].meta.regularMarketPrice);
    }
    if (!Number.isFinite(price) || price <= 0) return null;
    if (price < FALLBACK_PRICE * 0.2 || price > FALLBACK_PRICE * 5) return null;
    return Math.round(price * 100) / 100;
  } catch (_) {
    return null;
  }
}

// ── Tooltip engine ─────────────────────────────────────────────────────────
let tipEl = null;
function ensureTip() {
  if (!tipEl) { tipEl = document.createElement("div"); tipEl.id = "tip-box"; document.body.appendChild(tipEl); }
  return tipEl;
}
function showTip(e, title, body, note, color) {
  const el = ensureTip();
  el.innerHTML = `<div class="tt" style="color:${color||'var(--blue-soft)'}">${title}</div><div class="tb">${body}</div>${note?`<div class="tn">${note}</div>`:""}`;
  el.classList.add("on"); moveTip(e);
}
function moveTip(e) {
  const el = ensureTip(); const pad = 16;
  let x = e.clientX + pad, y = e.clientY + pad;
  const r = el.getBoundingClientRect();
  if (x + r.width > window.innerWidth - 8) x = e.clientX - r.width - pad;
  if (y + r.height > window.innerHeight - 8) y = e.clientY - r.height - pad;
  el.style.left = x + "px"; el.style.top = y + "px";
}
function hideTip() { if (tipEl) tipEl.classList.remove("on"); }

function tipTitle(title, body, note) {
  return [title, body, note].filter(Boolean).join(' — ');
}
function tip(title, body, note, color) {
  return { className:"tip-target", title:tipTitle(title,body,note), onMouseEnter:(e)=>showTip(e,title,body,note,color), onMouseMove:(e)=>moveTip(e), onMouseLeave:hideTip };
}
function tipSvg(title, body, note, color, extraClass) {
  return { className:(extraClass?extraClass+" ":"")+"tip-target", title:tipTitle(title,body,note), onMouseEnter:(e)=>showTip(e,title,body,note,color), onMouseMove:(e)=>moveTip(e), onMouseLeave:hideTip };
}

// ── Derived from data ──────────────────────────────────────────────────────
const TRACK = Array.from(new Map(TRACK_ALL.map(t => [t.q, t])).values()).slice(-TRACK_WINDOW);

// Chart geometry (axis ranges come from GEOM in thesis-data.js)
const PRICE_MIN = GEOM.priceMin, PRICE_MAX = GEOM.priceMax;
const CH_W = 760, CH_H = 420, PAD_L = 8, PAD_R = 56, PAD_T = 18, PAD_B = 34;
const plotW = CH_W - PAD_L - PAD_R, plotH = CH_H - PAD_T - PAD_B;
const yOf = (p) => PAD_T + (1 - (p - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * plotH;

// ── Fan Chart ──────────────────────────────────────────────────────────────
function FanChart({ c }) {
  const nHist = HISTORY.length;
  const histPts = HISTORY.map((d, i) => [PAD_L + (i / (nHist + FUTURE_Q.length - 1)) * plotW, yOf(d.p)]);
  const nowX = histPts[histPts.length - 1][0];
  const nowY = histPts[histPts.length - 1][1];
  const fwdN = FUTURE_Q.length;
  const fwdX = (i) => nowX + ((i + 1) / fwdN) * (CH_W - PAD_R - nowX);
  const end = PROJ_END[c.key];
  const mid = FUTURE_Q.map((_, i) => {
    const t = (i + 1) / fwdN;
    return [fwdX(i), yOf(NOW_PRICE + (end - NOW_PRICE) * t)];
  });
  const spread = (i) => 28 + i * 28;
  const upper = mid.map(([x, y], i) => [x, y - spread(i)]);
  const lower = mid.map(([x, y], i) => [x, y + spread(i)]);
  const bandPath = `M ${nowX} ${nowY} ` + upper.map(([x, y]) => `L ${x} ${y}`).join(" ") + " " +
    lower.slice().reverse().map(([x, y]) => `L ${x} ${y}`).join(" ") + " Z";
  const midPath = `M ${nowX} ${nowY} ` + mid.map(([x, y]) => `L ${x} ${y}`).join(" ");
  const histPath = "M " + histPts.map(([x, y]) => `${x} ${y}`).join(" L ");
  const gridP = GEOM.fanGrid;

  return (
    <svg viewBox={`0 0 ${CH_W} ${CH_H}`} style={{ width: "100%", height: "auto", display: "block" }}>
      <defs>
        <linearGradient id={`fan-${c.key}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={c.accent} stopOpacity="0.05" />
          <stop offset="100%" stopColor={c.accent} stopOpacity="0.28" />
        </linearGradient>
        <filter id="softglow"><feGaussianBlur stdDeviation="2.2" /></filter>
      </defs>
      {gridP.map((p) => (
        <g key={p}>
          <line x1={PAD_L} y1={yOf(p)} x2={CH_W - PAD_R} y2={yOf(p)} stroke="var(--bd2)" strokeWidth="1" strokeDasharray="1 5" />
          <text x={CH_W - PAD_R + 8} y={yOf(p) + 3} fill="var(--tx5)" fontSize="11" fontFamily={FONT_MONO}>${p}</text>
        </g>
      ))}
      <line x1={nowX} y1={PAD_T} x2={nowX} y2={CH_H - PAD_B} stroke="#46aad9" strokeWidth="1" strokeDasharray="3 4" opacity="0.7" />
      <path d={bandPath} fill={`url(#fan-${c.key})`} {...tipSvg(
        "The forecast 'cone'", "This shaded fan shows the range of where the price could go in this scenario over the next year. It gets wider further out because the future is less certain. The dashed line through the middle is the most-likely path.",
        "Wider = more uncertainty.", c.accent, "fan-band")} />
      <path d={midPath} fill="none" stroke={c.accent} strokeWidth="2" strokeDasharray="6 5" className="fan-mid" style={{ filter: "url(#softglow)" }} />
      <path d={histPath} fill="none" stroke="var(--tx1)" strokeWidth="2" {...tipSvg(
        "Price history", TEXT.fanHistory,
        "This part already happened — it's real, not a forecast.", "var(--tx1)", "hist-line")} />
      {HISTORY.map((d, i) => (
        <g key={i}>
          <circle cx={histPts[i][0]} cy={histPts[i][1]} r={i === nHist - 1 ? 4.5 : 3}
            fill={i === nHist - 1 ? "#46aad9" : "var(--panel-bg)"}
            stroke={i === nHist - 1 ? "var(--title)" : "var(--tx3)"} strokeWidth="1.5"
            {...tipSvg(i === nHist - 1 ? "Where we are today" : d.q,
              i === nHist - 1 ? TEXT.fanNow(NOW_PRICE) : TEXT.fanPastDot(d.q, d.p),
              null, i === nHist - 1 ? "var(--blue-soft)" : "var(--tx1)")} />
          {i === nHist - 1 && <text x={histPts[i][0] - 6} y={histPts[i][1] - 12} fill="var(--blue-soft)" fontSize="11" fontFamily={FONT_MONO} textAnchor="end">NOW ${NOW_PRICE}</text>}
        </g>
      ))}
      {mid.map(([x, y], i) => (
        <g key={i} className="diamond" style={{ animationDelay: `${0.5 + i * 0.12}s` }}>
          <rect x={x - 4} y={y - 4} width="8" height="8" transform={`rotate(45 ${x} ${y})`}
            fill="var(--panel-bg)" stroke={c.accent} strokeWidth="1.6"
            {...tipSvg(`Forecast: ${FUTURE_Q[i]}`,
              `A milestone on the most-likely price path for the ${c.label} scenario. Each diamond is roughly one quarter further into the future.`,
              "Hover the shaded cone around it to see the uncertainty range.", c.accent)} />
          <text x={x} y={y - 12} fill={c.accent} fontSize="10.5" fontFamily={FONT_MONO} textAnchor="middle">{FUTURE_Q[i]}</text>
        </g>
      ))}
      {GEOM.fanYears.map((yr, i) => (
        <text key={yr} x={PAD_L + (i / (GEOM.fanYears.length - 1)) * plotW} y={CH_H - 10} fill="var(--tx5)" fontSize="11" fontFamily={FONT_MONO}>{yr}</text>
      ))}
    </svg>
  );
}

// ── Signal Bar ─────────────────────────────────────────────────────────────
function SignalBar({ pos, accent, tipProps }) {
  return (
    <div {...(tipProps || {})} style={{ position: "relative", height: 22, borderRadius: 3, overflow: "hidden", display: "flex", border: "1px solid #1c2230" }}>
      <div style={{ flex: 1, background: "rgba(241,86,75,0.22)" }} />
      <div style={{ flex: 1, background: "rgba(224,168,59,0.18)" }} />
      <div style={{ flex: 1, background: "rgba(63,208,122,0.22)" }} />
      <div style={{ position: "absolute", top: -2, bottom: -2, left: `calc(${pos * 100}% - 1px)`, width: 2, background: accent, boxShadow: `0 0 8px ${accent}`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "50%", left: `${pos * 100}%`, width: 7, height: 7, borderRadius: "50%", background: accent, transform: "translate(-50%,-50%)", boxShadow: `0 0 10px ${accent}`, pointerEvents: "none" }} />
    </div>
  );
}
function tagColor(tag) {
  if (tag === "BEAT")  return "#66b278";
  if (tag === "MATCH") return "#c59542";
  if (tag === "MISS")  return "#dd817a";
  return "var(--tx4)";
}

// ── Segmented Control ──────────────────────────────────────────────────────
function Segmented({ active, setActive, small }) {
  const explain = TEXT.segmentedExplain;
  return (
    <div style={{ display: "flex", gap: 5 }}>
      {Object.values(CASES).map((cc) => {
        const on = active === cc.key;
        return (
          <div key={cc.key} onClick={() => setActive(cc.key)}
            onMouseEnter={(e) => showTip(e, explain[cc.key][0], explain[cc.key][1], "Tip: click to switch the whole dashboard to this scenario.", cc.accent)}
            onMouseMove={moveTip} onMouseLeave={hideTip}
            style={{
              padding: small ? "3px 12px" : "4px 14px", borderRadius: 4, fontSize: 11,
              fontWeight: 700, letterSpacing: "0.08em", cursor: "pointer",
              border: `1px solid ${on ? cc.accent : "var(--bd)"}`, color: on ? "var(--page-bg)" : cc.accent,
              background: on ? cc.accent : "transparent", boxShadow: on ? `0 0 16px ${cc.glow}` : "none",
              transition: "all .18s ease",
            }}>{cc.label}</div>
        );
      })}
    </div>
  );
}

// ── KPI Column ─────────────────────────────────────────────────────────────
function KpiCol({ label, val, accentColor, baseline, delay = 0 }) {
  const h = Math.max(4, Math.min(92, ((val - GEOM.kpiMin) / (GEOM.kpiMax - GEOM.kpiMin)) * 100));
  const tp = baseline
    ? tip(`Starting point (${HISTORY[HISTORY.length - 2].q})`, TEXT.kpiBaseline(val), "The grey dot = 'where we are now'.", "var(--tx3)")
    : tip(`Forecast: ${label}`, TEXT.kpiForecast(label, val), "Switch BEAR/BASE/BULL up top to see how the forecast changes.", accentColor);
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }} {...tp}>
      <div style={{ fontSize: 11, color: accentColor, fontWeight: 700, marginBottom: 4 }}>${val}B</div>
      {baseline
        ? <div style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--tx8)", border: "1.5px solid #7b86a0", marginBottom: `${h}%` }} />
        : <div style={{ width: "62%", height: `${h}%`, background: `linear-gradient(180deg, ${accentColor}, ${accentColor}44)`, border: `1px solid ${accentColor}`, borderRadius: 2, animation: `fadeUp .5s ease ${delay}s both`, boxShadow: `0 0 12px ${accentColor}55` }} />}
      <div style={{ fontSize: 9.5, color: "var(--tx5)", marginTop: 6 }}>{label}</div>
    </div>
  );
}

// ── Signal Group + Rows ────────────────────────────────────────────────────
function SignalGroup({ id, title, requires, accent, evidence, children }) {
  return (
    <div style={{ border: "1px solid var(--bd)", borderRadius: 8, padding: "10px 12px", marginBottom: 12, background: "var(--panel-bg)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 12.5, color: "var(--tx1)", fontFamily: FONT_DISPLAY, fontWeight: 600 }}>
          <span style={{ background: "var(--bd)", padding: "1px 6px", borderRadius: 3, fontSize: 10, fontFamily: FONT_MONO, color: "var(--tx3)", marginRight: 8, verticalAlign: "middle" }}>{id}</span>
          <span dangerouslySetInnerHTML={{ __html: title }} />
        </div>
        <div style={{ fontSize: 10, color: "var(--tx5)" }}>EVIDENCE {evidence} ›</div>
      </div>
      <div style={{ fontSize: 10.5, color: "var(--tx5)", margin: "4px 0 10px" }}>REQUIRES: <span style={{ color: accent }}>{requires}</span></div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{children}</div>
    </div>
  );
}
function SignalRow({ s, accent }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: 12, alignItems: "center" }}>
      <div style={{ borderLeft: `2px solid ${accent}`, paddingLeft: 8 }} {...tip(
        s.name, SIGNAL_HELP[s.name] || "A measurable indicator used to check whether this scenario is actually happening.",
        `Status "${s.tag}": ${TAG_HELP[s.tag] || ""}`, accent)}>
        <div style={{ fontSize: 11.5, color: "var(--track-line)", lineHeight: 1.25 }}>{s.name}</div>
        <div style={{ fontSize: 10, color: "var(--tx5)", marginTop: 2 }}>{s.unit} · <span style={{ color: tagColor(s.tag) }}>{s.tag}</span></div>
      </div>
      <div>
        <SignalBar pos={s.pos} accent={accent} tipProps={tip(
          "Where this scenario sits",
          "This bar runs from bad (red, left) to good (green, right). The glowing dot shows where THIS scenario expects the number to land.",
          "It's a visual gauge, not an exact measurement.", accent)} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 9.5 }}>
          <span style={{ color: "var(--tx5)" }}>NEXT: {s.next}</span>
          <span style={{ color: accent, fontWeight: 700 }}>{s.val}</span>
          <span style={{ color: "var(--tx5)" }}>{s.guide}</span>
        </div>
      </div>
    </div>
  );
}
function MarginRow({ s, accent }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: 12, alignItems: "center" }}>
      <div style={{ borderLeft: `2px solid ${accent}`, paddingLeft: 8 }} {...tip(
        s.name, SIGNAL_HELP[s.name] || "A measure of how profitable and well-run the business is.",
        `Status "${s.tag}": ${TAG_HELP[s.tag] || ""}`, accent)}>
        <div style={{ fontSize: 11.5, color: "var(--track-line)", lineHeight: 1.25 }}>{s.name}</div>
        <div style={{ fontSize: 10, color: "var(--tx5)", marginTop: 2 }}>% · <span style={{ color: tagColor(s.tag) }}>{s.tag}</span></div>
      </div>
      <div>
        <SignalBar pos={s.pos} accent={accent} tipProps={tip(
          "Where this scenario sits",
          "Red (left) is bad, green (right) is good. The glowing dot marks where this scenario expects this measure to land.", null, accent)} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 9.5 }}>
          <span style={{ color: "var(--tx5)" }}>NEXT: {s.next}</span>
        </div>
      </div>
    </div>
  );
}

// ── Reversion Clock ────────────────────────────────────────────────────────
function ReversionClock() {
  const dislocationDate = new Date(DISLOCATION_DATE);
  const today = new Date();
  const elapsed = Math.round((today - dislocationDate) / 86400000);
  const pct = Math.min(100, (elapsed / REVERSION_PRECEDENT_DAYS) * 100);
  const trough = REVERSION_TROUGH, baseFloor = REVERSION_BASEFLOOR, now = NOW_PRICE;
  const recPct = Math.min(138, Math.max(0, ((now - trough) / (baseFloor - trough)) * 100));
  return (
    <div style={{ marginTop: 12, padding: "12px 14px", background: "var(--panel-bg)", border: "1px solid var(--bd)", borderRadius: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
        <div style={{ fontSize: 10.5, letterSpacing: "0.14em", color: "var(--tx5)" }}>{TEXT.reversion.header}</div>
        <div style={{ fontSize: 11, color: "var(--tx3)" }}><span style={{ color: "#c59542", fontWeight: 700 }}>{elapsed}d</span> elapsed / ~{REVERSION_PRECEDENT_DAYS}d precedent</div>
      </div>
      <div style={{ marginBottom: 4, fontSize: 9.5, color: "var(--tx5)" }}>TIME SINCE DISLOCATION ({new Date(DISLOCATION_DATE).toLocaleDateString("en-US",{month:"short",day:"numeric"})})</div>
      <div {...tip("How much time has passed", TEXT.reversion.timeTip,
        "Filling up = getting closer to when recovery happened last time.", "#c59542")}
        style={{ position: "relative", height: 14, background: "var(--deep-bg)", borderRadius: 7, overflow: "hidden", border: "1px solid #1c2230" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${Math.min(100,pct)}%`, background: "linear-gradient(90deg,#dd817a,#c59542)", borderRadius: 7 }} />
        <div style={{ position: "absolute", right: 0, top: -3, bottom: -3, width: 2, background: "#66b278" }} />
        <div style={{ position: "absolute", left: `${Math.min(100,pct)}%`, top: "50%", width: 8, height: 8, borderRadius: "50%", background: "var(--title)", transform: "translate(-50%,-50%)", boxShadow: "0 0 8px #fff", pointerEvents: "none" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "var(--tx5)", marginTop: 3 }}>
        <span>day 0</span><span style={{ color: "#66b278" }}>base-reversion mark (~{REVERSION_PRECEDENT_DAYS}d) →</span>
      </div>
      <div style={{ marginTop: 12, marginBottom: 4, fontSize: 9.5, color: "var(--tx5)" }}>PRICE RECOVERY · ${REVERSION_TROUGH} trough → ${REVERSION_BASEFLOOR} base floor</div>
      <div {...tip("How far the price has bounced back", TEXT.reversion.priceTip(trough, baseFloor, now),
        "When this bar is fuller than the time bar above, the bounce-back ran faster than the precedent. It did.", "var(--blue-soft)")}
        style={{ position: "relative", height: 14, background: "var(--deep-bg)", borderRadius: 7, overflow: "hidden", border: "1px solid #1c2230" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${Math.min(100, recPct / 1.38)}%`, background: "linear-gradient(90deg,#dd817a,#66b278)", borderRadius: 7 }} />
        <div style={{ position: "absolute", left: `${Math.min(100, recPct / 1.38)}%`, top: "50%", width: 8, height: 8, borderRadius: "50%", background: "var(--blue-soft)", transform: "translate(-50%,-50%)", boxShadow: "0 0 8px var(--blue-soft)", pointerEvents: "none" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "var(--tx5)", marginTop: 3 }}>
        <span>${REVERSION_TROUGH}</span>
        <span style={{ color: "var(--blue-soft)" }}>${now} now · {Math.round(recPct)}% of the way back (base floor cleared)</span>
        <span>${REVERSION_BASEFLOOR}</span>
      </div>
      <div style={{ fontSize: 10.5, color: "var(--tx3)", lineHeight: 1.55, marginTop: 10 }}
        dangerouslySetInnerHTML={{ __html: TEXT.reversion.footerHtml(REVERSION_BASEFLOOR, REVERSION_PRECEDENT_DAYS, now) }} />
    </div>
  );
}

// ── Track Record ───────────────────────────────────────────────────────────
function TrackRecord() {
  const W = 1000, H = 300, pl = 44, pr = 70, pt = 20, pb = 40;
  const pw = W - pl - pr, ph = H - pt - pb;
  const y = (p) => pt + (1 - (p - GEOM.trackMin) / (GEOM.trackMax - GEOM.trackMin)) * ph;
  const x = (i) => pl + (TRACK.length === 1 ? pw / 2 : (i / (TRACK.length - 1)) * pw);
  const grid = GEOM.trackGrid;
  const pathPts = TRACK.map((t, i) => [x(i), y(t.post)]);
  const linePath = "M " + pathPts.map(([px, py]) => `${px} ${py}`).join(" L ");
  const hits = TRACK.filter((t) => t.landed.includes("base") || t.landed.includes("bull")).length;
  return (
    <div style={{ background: "var(--inner-bg)", padding: "16px 18px", borderTop: "1px solid var(--bd)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <div style={{ fontSize: 11.5, letterSpacing: "0.18em", color: "var(--tx4)" }}>
          <span style={{ background: "var(--bd)", padding: "2px 6px", borderRadius: 3, color: "var(--tx1)", marginRight: 8 }}>TR · BACKTEST</span>
          THESIS TRACK RECORD · RECONSTRUCTED BANDS vs ACTUAL PRICE
        </div>
        <div style={{ fontSize: 11, color: "var(--tx4)" }}>BASE-OR-BETTER LANDINGS: <span style={{ color: "#66b278", fontWeight: 700 }}>{hits}/{TRACK.length}</span></div>
      </div>
      <div style={{ fontSize: 10.5, color: "var(--tx5)", marginBottom: 10 }}>
        Each column = one earnings date. Stacked zones are the bear / base / bull bands as they would have been drawn at that time. The line is where price actually traded after. All prices post-split.
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
        {grid.map((p) => (
          <g key={p}>
            <line x1={pl} y1={y(p)} x2={W - pr} y2={y(p)} stroke="var(--bd)" strokeWidth="1" strokeDasharray="1 5" />
            <text x={W - pr + 8} y={y(p) + 3} fill="var(--tx5)" fontSize="11" fontFamily={FONT_MONO}>${p}</text>
          </g>
        ))}
        {TRACK.map((t, i) => {
          const cx = x(i), bw = 46;
          const landWord = t.landed.includes("bull") ? "the optimistic zone" : t.landed.includes("base") ? "the middle zone" : "the pessimistic zone";
          const reactWord = t.reaction.includes("−") || t.reaction.includes("-") ? "the stock FELL after this report" : "the stock ROSE after this report";
          const seg = (range, color) => (
            <rect x={cx - bw / 2} y={y(range[1])} width={bw} height={Math.max(2, y(range[0]) - y(range[1]))}
              fill={color} opacity={t.conf === "med" ? 0.32 : 0.5} rx="2" style={{ animation: `fadeUp .5s ease ${i * 0.08}s both` }}
              {...tipSvg(`${t.q} earnings`,
                `At this earnings date, here's the scenario band (red=bear, yellow=base, green=bull). In reality, ${reactWord} and the price ended up in ${landWord} (~$${t.post}).`,
                t.conf === "med" ? "Marked 'lower-confidence' — bands reconstructed in hindsight." : null,
                color.includes("63,208") ? "#66b278" : color.includes("224,168") ? "#c59542" : "#dd817a")} />
          );
          return (
            <g key={t.q}>
              {seg(t.bull, "rgba(63,208,122,0.55)")}
              {seg(t.base, "rgba(224,168,59,0.5)")}
              {seg(t.bear, "rgba(241,86,75,0.5)")}
              <text x={cx} y={H - 24} fill="var(--tx3)" fontSize="11" fontFamily={FONT_MONO} textAnchor="middle">{t.q}</text>
              <text x={cx} y={H - 11} fill={t.conf === "med" ? "var(--tx5)" : "var(--tx8)"} fontSize="8.5" fontFamily={FONT_MONO} textAnchor="middle">
                {t.conf === "med" ? "lower-conf" : t.reaction.includes("-") ? "↓ dislocation" : ""}
              </text>
            </g>
          );
        })}
        <path d={linePath} fill="none" stroke="var(--track-line)" strokeWidth="2.2" className="track-line" style={{ filter: "drop-shadow(0 0 4px rgba(221,227,238,0.4))" }} />
        {TRACK.map((t, i) => {
          const isLast = i === TRACK.length - 1;
          return (
            <g key={t.q} style={{ animation: `pop .4s cubic-bezier(.2,1.4,.4,1) ${0.3 + i * 0.08}s both` }}>
              <circle cx={x(i)} cy={y(t.post)} r={isLast ? 6 : 4} fill={isLast ? "#46aad9" : "var(--panel-bg)"} stroke="var(--title)" strokeWidth={isLast ? 2 : 1.5}
                {...tipSvg(isLast ? "Most recent quarter" : `${t.q}: actual price`,
                  isLast ? TEXT.track.lastDot(t.post, NOW_PRICE) : TEXT.track.pastDot(t.q, t.post),
                  null, isLast ? "var(--blue-soft)" : "var(--tx1)")} />
              {isLast && <text x={x(i)} y={y(t.post) - 14} fill="var(--blue-soft)" fontSize="11" fontFamily={FONT_MONO} textAnchor="middle" fontWeight="700">NOW ${t.post}</text>}
            </g>
          );
        })}
      </svg>
      <div style={{ marginTop: 12, padding: "10px 12px", background: "var(--panel-bg)", border: "1px solid var(--bd)", borderRadius: 8 }}>
        <div style={{ fontSize: 10.5, letterSpacing: "0.12em", color: "var(--tx5)", marginBottom: 6 }}>READ-OUT</div>
        <div style={{ fontSize: 12, color: "var(--tx2)", lineHeight: 1.6 }}
          dangerouslySetInnerHTML={{ __html: TEXT.track.readoutHtml(hits, TRACK.length, NOW_PRICE) }} />
      </div>
      <ReversionClock />
      <div style={{ fontSize: 9.5, color: "var(--tx7)", marginTop: 8, lineHeight: 1.5 }}>
        {TEXT.track.footnote}
      </div>
    </div>
  );
}

// ── Tab Nav ────────────────────────────────────────────────────────────────
function TabNav({ activeTab, setActiveTab, accentColor }) {
  const legacy = [
  ];
  const fresh = [
    { id: "the-past",    label: "THE PAST",    sub: "durability · mood" },
    { id: "the-current", label: "THE CURRENT", sub: "story · price · signal" },
    { id: "the-future",  label: "THE FUTURE",  sub: "bet · risk · deploy" },
  ];
  const renderTab = ({ id, label, sub, disabled }) => {
    const on = activeTab === id;
    const isNew = fresh.some(t => t.id === id);
    const col = on ? (isNew ? "#66b278" : "var(--blue-soft)") : "var(--tx7)";
    return (
      <div key={id} onClick={() => !disabled && setActiveTab(id)}
        style={{ padding: "11px 24px", cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.35 : 1,
          borderBottom: `2px solid ${on ? col : "transparent"}`, transition: "all .15s ease" }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: on ? col : "var(--tx6)" }}>{label}</div>
        <div style={{ fontSize: 9, color: on ? "var(--tx5)" : "var(--tx9)", marginTop: 2, letterSpacing: "0.08em" }}>{sub}</div>
      </div>
    );
  };
  return (
    <div style={{ display: "flex", background: "var(--nav-bg)", borderBottom: "1px solid var(--bd)", alignItems: "stretch" }}>
      {legacy.map(renderTab)}
      {/* ── separator ── */}
      <div style={{ width: 1, background: "var(--bd2)", margin: "8px 4px", opacity: 0.7 }} />
      {fresh.map(renderTab)}
    </div>
  );
}

// ── Position / price-zone helpers ──────────────────────────────────────────
const VIS_LO = GEOM.visLo, VIS_HI = GEOM.visHi;
const visPct = v => `${((v - VIS_LO) / (VIS_HI - VIS_LO) * 100).toFixed(2)}%`;
const visW   = (lo, hi) => `${((hi - lo) / (VIS_HI - VIS_LO) * 100).toFixed(2)}%`;
const visC   = (lo, hi) => ((lo + hi) / 2 - VIS_LO) / (VIS_HI - VIS_LO) * 100;

// Generic localStorage loader — clears stale data on schema version mismatch
function loadStorage(key, version, fallback) {
  try {
    const d = JSON.parse(localStorage.getItem(key));
    if (!d || d.version !== version) { localStorage.removeItem(key); return fallback; }
    return d;
  } catch { return fallback; }
}

const POS_KEY            = `th3sis_pos_${TICKER_META.ticker}`;
const POS_SCHEMA_VERSION = 1;
const DEFAULT_TRANCHES = [
  { id: 1, label: "STARTER",  price: "", shares: "", date: null, note: "" },
  { id: 2, label: "ADD",      price: "", shares: "", date: null, note: "" },
  { id: 3, label: "CONFIRM",  price: "", shares: "", date: null, note: "" },
];
function loadPos() { return loadStorage(POS_KEY, POS_SCHEMA_VERSION, null); }
const DEFAULT_CHECKS = () => Object.fromEntries(THESIS_ITEMS.map(t => [t.key, false]));

// Parse "$415 — $500"-style target12 strings into [lo, hi]
const parseBand = (t12) => t12.split("—").map(s => parseInt(s.replace(/[$,\s]/g, "")));

// ── THE CURRENT Tab ──────────────────────────────────────────────────────────
function CurrentTab() {
  const [active, setActive] = useState("base");
  const [panel, setPanel] = useState("story");
  const c = CASES[active];
  const v = VAL_CONFIG;

  // ── Derived values ─────────────────────────────────────────────────────────
  const fcfYield = ((v.fcf_ntm_b * 1e9) / (NOW_PRICE * v.shares_b * 1e9) * 100).toFixed(1);
  const bearLo   = parseBand(CASES.bear.target12)[0];
  const bullHi   = parseBand(CASES.bull.target12)[1];
  const baseLo   = parseBand(CASES.base.target12)[0];
  const baseHi   = parseBand(CASES.base.target12)[1];
  const inBase    = NOW_PRICE >= baseLo && NOW_PRICE <= baseHi;
  const belowBase = NOW_PRICE < baseLo;
  const verdictColor = belowBase ? "#66b278" : inBase ? "#c59542" : "#dd817a";

  const allSigs = [...SIGNALS[active], ...MARGIN[active]];
  const beats   = allSigs.filter(s => s.tag === "BEAT").length;
  const misses  = allSigs.filter(s => s.tag === "MISS").length;
  const matches = allSigs.filter(s => s.tag === "MATCH").length;
  const thesisStatus = misses >= 3
    ? { label: "BROKEN",  desc: "ACT ON KILL-SWITCH",       col: "#dd817a" }
    : misses >= 2
    ? { label: "WATCH",   desc: "MIXED SIGNALS",             col: "#c59542" }
    : { label: "INTACT",  desc: "TRACKING AS EXPECTED",      col: "#66b278" };

  const currentPE = (NOW_PRICE / v.ntm_eps).toFixed(1);
  const pePos     = (NOW_PRICE / v.ntm_eps - v.pe_trough) / (v.pe_peak - v.pe_trough);
  const fyRevBase = KPI_HIST + KPI_PROJ.base[0] + KPI_PROJ.base[1] + KPI_PROJ.base[2];

  const bearDown  = (((NOW_PRICE - bearLo) / NOW_PRICE) * 100).toFixed(0);
  const bullUp    = (((bullHi - NOW_PRICE) / NOW_PRICE) * 100).toFixed(0);
  const asymRatio = (bullHi - NOW_PRICE) / (NOW_PRICE - bearLo);
  const asymStatus = asymRatio >= 2
    ? { label: "FAVORABLE",   desc: `${asymRatio.toFixed(1)}× UP PER UNIT DOWN`, col: "#66b278" }
    : asymRatio >= 1
    ? { label: "BALANCED",    desc: `${asymRatio.toFixed(1)}× UP PER UNIT DOWN`, col: "#c59542" }
    : { label: "UNFAVORABLE", desc: `${asymRatio.toFixed(1)}× UP PER UNIT DOWN`, col: "#dd817a" };

  // ── Reverse DCF ─────────────────────────────────────────────────────────
  const [dr, setDr]         = useState(VAL_CONFIG.default_discount_pct);
  const [termPE, setTermPE] = useState(VAL_CONFIG.default_terminal_pe);
  const dcfN        = VAL_CONFIG.dcf_years;
  const impliedCAGR = (termPE > 0 && v.ntm_eps > 0)
    ? (Math.pow(NOW_PRICE * Math.pow(1 + dr / 100, dcfN) / (v.ntm_eps * termPE), 1 / dcfN) - 1) * 100
    : null;
  const cagrRounded = impliedCAGR !== null ? impliedCAGR.toFixed(1) : "—";
  const cagrDisplay = impliedCAGR !== null ? `+${cagrRounded}%` : "—";
  const cagrColor   = impliedCAGR === null ? "var(--tx4)" : impliedCAGR > 25 ? "#dd817a" : impliedCAGR > 15 ? "#c59542" : "#66b278";
  const cagrNote    = impliedCAGR === null
    ? "Adjust sliders to calculate the implied growth rate."
    : impliedCAGR < 15
    ? TEXT.current.cagrNotes.low
    : impliedCAGR < 25
    ? TEXT.current.cagrNotes.mid
    : TEXT.current.cagrNotes.high;

  const marketMood = pePos > 0.67
    ? { label: "ELEVATED OPTIMISM", sub: `market pricing ${cagrDisplay} EPS CAGR (high bar)`,       col: "#dd817a" }
    : pePos > 0.4
    ? { label: "MODERATE OPTIMISM", sub: `market requires ${cagrDisplay} EPS CAGR`,                 col: "#c59542" }
    : { label: "SKEPTICISM / FEAR",  sub: `market requires only ${cagrDisplay} EPS CAGR (low bar)`, col: "#66b278" };

  const overallVerdict = thesisStatus.label === "BROKEN"
    ? { label: "REDUCE / EXIT",       sub: "Kill-switch criteria met — act on signal",                                                                         col: "#dd817a" }
    : thesisStatus.label === "WATCH" && belowBase
    ? { label: "HOLD — WATCH CLOSELY", sub: `Signals mixed · price attractive · market requires only ${cagrDisplay} EPS CAGR — wait for next print`,         col: "#c59542" }
    : belowBase
    ? { label: "CONSIDER ADDING",      sub: `Thesis ${thesisStatus.label.toLowerCase()} · below base floor · market requires only ${cagrDisplay} EPS CAGR`, col: "#66b278" }
    : inBase
    ? { label: "HOLD AND MONITOR",     sub: `Thesis ${thesisStatus.label.toLowerCase()} · price fair · market requires ${cagrDisplay} EPS CAGR`,            col: "#c59542" }
    : { label: "WAIT FOR PULLBACK",    sub: `Thesis ${thesisStatus.label.toLowerCase()} · price stretched · market pricing ${cagrDisplay} EPS CAGR`,        col: "#dd817a" };

  // ── Scorecard card (clickable → switches evidence panel) ──────────────────
  const ScoreCard = ({ question, answer, detail, col, panelKey, tipTitle, tipBody }) => (
    <div onClick={() => setPanel(panelKey)} {...(tipTitle ? tip(tipTitle, tipBody, "Click to view full evidence below", col) : {})} style={{
      background: "var(--inner-bg)", border: `1px solid ${col}44`,
      borderLeft: `3px solid ${col}`, borderRadius: 8, padding: "14px 16px",
      cursor: "pointer", transition: "background .15s",
    }}>
      <div style={{ fontSize: 8, letterSpacing: "0.14em", color: "var(--tx6)", marginBottom: 5 }}>{question}</div>
      <div style={{ fontSize: 11.5, fontWeight: 700, color: col, marginBottom: 5, letterSpacing: "0.06em" }}>{answer}</div>
      <div style={{ fontSize: 10, color: "var(--tx5)", lineHeight: 1.55 }}>{detail}</div>
      <div style={{ marginTop: 6, fontSize: 8, color: col, opacity: 0.7, letterSpacing: "0.1em" }}>VIEW EVIDENCE ›</div>
    </div>
  );

  const PANELS = [
    { key: "story", label: "① STORY",      sub: "thesis · signals", tipTitle: "Story: Is the thesis still true?", tipBody: TEXT.current.panelTipStory },
    { key: "price", label: "② PRICE",       sub: "fair value · P/E", tipTitle: "Price: Is today's price fair?", tipBody: `Compares NOW_PRICE to the base case band ($${baseLo}–$${baseHi}). Below base = potential entry zone (thesis must still be intact). Inside = fair value. Above = stretched. Also shows P/E vs normal range (${VAL_CONFIG.pe_normal_lo}–${VAL_CONFIG.pe_normal_hi}×). Click to see price band visual and case requirements.` },
    { key: "mood",  label: "③ MOOD",        sub: "market assumption", tipTitle: "Mood: What is the market pricing in?", tipBody: "The P/E multiple reveals crowd expectations. Shows where today's multiple sits vs the historical trough/normal/peak zones, plus the reverse DCF: what EPS growth rate the current price requires. Click to see full mood panel." },
    { key: "risk",  label: "④ RISK/REWARD", sub: "backtest · asymmetry", tipTitle: "Risk/Reward: Am I getting paid for the risk?", tipBody: "Asymmetry = bull upside / bear downside from NOW_PRICE. Also shows the rolling-window backtest: how well the bands held vs actual price. Click to see ReversionClock (dislocation timing signal) and TrackRecord." },
  ];

  return (
    <div style={{ padding: "0 22px 40px", fontFamily: FONT_MONO }}>

      {/* ══ VERDICT BLOCK (TOP) ════════════════════════════════════════════ */}
      <div style={{ marginTop: 18, background: "var(--panel-bg)",
        border: `1px solid ${overallVerdict.col}33`, borderRadius: 10,
        padding: "18px 18px 14px" }}>

        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em",
          color: "var(--tx6)", marginBottom: 14 }}>VERDICT — SO WHAT DO I DO?</div>

        {/* 2×2 Scorecard */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
          <ScoreCard
            question="IS THE THESIS STILL INTACT?"
            answer={`${thesisStatus.label} — ${thesisStatus.desc}`}
            detail={`${beats} beat · ${matches} match · ${misses} miss · ${allSigs.length} signals tracked`}
            col={thesisStatus.col} panelKey="story"
            tipTitle="Is the thesis still intact?"
            tipBody={`Tracks ${allSigs.length} KPI signals from the last earnings print. ${beats} beat, ${matches} match, ${misses} miss. WATCH = mixed signals, hold but don't add. BROKEN = kill-switch criteria met, exit. Current status: ${thesisStatus.label}.`} />
          <ScoreCard
            question="IS THE PRICE FAIR?"
            answer={belowBase ? "BELOW BASE — ENTRY ZONE" : inBase ? "INSIDE BASE RANGE" : "ABOVE BASE — STRETCHED"}
            detail={`$${NOW_PRICE} now · base $${baseLo}–$${baseHi} · P/E ${currentPE}×`}
            col={verdictColor} panelKey="price"
            tipTitle="Is the price fair?"
            tipBody={`Base case fair value: $${baseLo}–$${baseHi}. Current price: $${NOW_PRICE}. ${belowBase ? "Below base = potential entry zone — thesis must be intact to add." : inBase ? "Inside base range = fair value, hold and monitor." : "Above base = stretched, wait for pullback."} P/E ${currentPE}× vs normal ${VAL_CONFIG.pe_normal_lo}–${VAL_CONFIG.pe_normal_hi}×.`} />
          <ScoreCard
            question="WHAT IS THE MARKET ASSUMING?"
            answer={marketMood.label}
            detail={`P/E ${currentPE}× · requires ${cagrDisplay} EPS CAGR · FCF yield ${fcfYield}%`}
            col={marketMood.col} panelKey="mood"
            tipTitle="What is the market assuming?"
            tipBody={`At ${currentPE}× NTM P/E, the market requires a ${cagrDisplay} EPS CAGR over ${dcfN} years just to justify today's price (at ${dr}% discount rate, ${termPE}× terminal P/E). ${cagrNote} FCF yield ${fcfYield}% vs 10Y Treasury ${v.risk_free_pct}% — positive spread means equities still offer a risk premium above risk-free.`} />
          <ScoreCard
            question="AM I GETTING PAID FOR THE RISK?"
            answer={`${asymStatus.label} — ${asymStatus.desc}`}
            detail={`Bear −${bearDown}% · Bull +${bullUp}% · FCF yield ${fcfYield}%`}
            col={asymStatus.col} panelKey="risk"
            tipTitle="Am I getting paid for the risk?"
            tipBody={`Asymmetry = bull upside ÷ bear downside from $${NOW_PRICE}. Bull +${bullUp}% vs Bear −${bearDown}% = ${asymRatio.toFixed(1)}× ratio. FAVORABLE (2×+) = you make more being right than you lose being wrong. BALANCED (1–2×) = even odds. UNFAVORABLE (<1×) = downside exceeds upside — size very small or wait.`} />
        </div>

        {/* Full-width final call bar */}
        <div {...tip("THE CURRENT · Final Call", `The verdict combines two signals: (1) thesis health — are the original reasons to own ${TICKER} still playing out? (2) price zone — is the market giving you a sensible entry? Both must be favourable for a 'consider adding' verdict. A broken thesis with a cheap price is still a broken thesis.`, `Current: thesis ${thesisStatus.label} · price ${belowBase ? "below base" : inBase ? "inside base" : "above base"}`, overallVerdict.col)} style={{ padding: "14px 16px", background: overallVerdict.col + "12",
          border: `1px solid ${overallVerdict.col}44`, borderRadius: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
            <div>
              <div style={{ fontSize: 9, letterSpacing: "0.18em", color: overallVerdict.col, fontWeight: 700, marginBottom: 4 }}>
                THE CURRENT · FINAL CALL
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: overallVerdict.col, letterSpacing: "0.06em", marginBottom: 4 }}>
                {overallVerdict.label}
              </div>
              <div style={{ fontSize: 10.5, color: "var(--tx4)" }}>{overallVerdict.sub}</div>
            </div>
            <div style={{ display: "flex", gap: 6, flexDirection: "column", alignItems: "flex-end", flexShrink: 0 }}>
              <div style={{ fontSize: 9.5, color: "var(--tx5)", background: "var(--inner-bg)",
                border: "1px solid var(--bd)", borderRadius: 5, padding: "5px 12px" }}
                dangerouslySetInnerHTML={{ __html: TEXT.current.watchChipHtml }} />
              <div style={{ fontSize: 9.5, color: "#dd817a", background: "var(--inner-bg)",
                border: "1px solid #dd817a44", borderRadius: 5, padding: "5px 12px" }}
                dangerouslySetInnerHTML={{ __html: TEXT.current.exitChipHtml }} />
            </div>
          </div>
          <div style={{ fontSize: 11, color: "var(--tx4)", lineHeight: 1.75, marginTop: 10 }}>
            {thesisStatus.label === "BROKEN"
              ? TEXT.current.verdictBody.broken(NOW_PRICE)
              : thesisStatus.label === "WATCH" && belowBase
              ? TEXT.current.verdictBody.watchBelow(NOW_PRICE)
              : belowBase
              ? TEXT.current.verdictBody.below(NOW_PRICE)
              : inBase
              ? TEXT.current.verdictBody.inBase(NOW_PRICE, thesisStatus.label.toLowerCase())
              : TEXT.current.verdictBody.above(NOW_PRICE)}
          </div>
        </div>
      </div>

      {/* ══ CHEVRON NAV (MIDDLE) ══════════════════════════════════════════ */}
      <div style={{ display: "flex", alignItems: "stretch", gap: 0, margin: "18px 0 0" }}>
        {PANELS.map(({ key, label, sub, tipTitle, tipBody }, i) => {
          const isActive = panel === key;
          const colMap = { story: thesisStatus.col, price: verdictColor, mood: marketMood.col, risk: asymStatus.col };
          const col = colMap[key];
          const isFirst = i === 0;
          const isLast  = i === PANELS.length - 1;
          const clip = isFirst
            ? "polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%)"
            : "polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%, 14px 50%)";
          return (
            <div key={key} onClick={() => setPanel(key)} {...(tipBody ? tip(label, tipBody, null, col) : {})} style={{
              flex: 1, clipPath: clip,
              marginLeft: isFirst ? 0 : "14px",
              background: isActive ? col + "22" : "var(--panel-bg)",
              borderTop:    `2px solid ${isActive ? col : "var(--bd)"}`,
              borderBottom: `2px solid ${isActive ? col : "var(--bd)"}`,
              padding: isFirst ? "12px 26px 12px 18px" : "12px 26px 12px 32px",
              cursor: "pointer", transition: "background .15s", outline: "none",
            }}>
              <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.14em",
                color: isActive ? col : "var(--tx4)", marginBottom: 3, whiteSpace: "nowrap" }}>{label}</div>
              <div style={{ fontSize: 8.5, color: isActive ? col : "var(--tx7)", whiteSpace: "nowrap", opacity: 0.85 }}>{sub}</div>
            </div>
          );
        })}
      </div>

      {/* ══ EVIDENCE PANEL (BOTTOM) ══════════════════════════════════════ */}
      <div style={{ background: "var(--panel-bg)", border: "1px solid var(--bd)",
        borderRadius: 10, padding: "20px 18px", marginTop: 14 }}>

        {/* Scenario selector — only on the panels whose content is case-specific */}
        {(panel === "story" || panel === "price") && (
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 9, marginBottom: 16 }}>
            <span style={{ fontSize: 8.5, letterSpacing: "0.16em", color: "var(--tx5)" }}>SCENARIO</span>
            <Segmented active={active} setActive={setActive} small />
          </div>
        )}

        {/* ─ ① STORY ─────────────────────────────────────────────────── */}
        {panel === "story" && (
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em",
              color: "var(--tx5)", marginBottom: 18, paddingBottom: 8, borderBottom: "1px solid var(--bd)" }}>
              IS THE THESIS STILL INTACT?
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "10px 14px",
              background: thesisStatus.col + "12", border: `1px solid ${thesisStatus.col}44`,
              borderLeft: `3px solid ${thesisStatus.col}`, borderRadius: 7, marginBottom: 18 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.16em",
                  color: thesisStatus.col, marginBottom: 3 }}>{thesisStatus.label} — {thesisStatus.desc}</div>
                <div style={{ fontSize: 9.5, color: "var(--tx5)", marginBottom: 3 }}>
                  {beats} BEAT · {matches} MATCH · {misses} MISS · {allSigs.length} signals tracked · {HISTORY[HISTORY.length - 2].q} actuals
                </div>
                <div style={{ fontSize: 11, color: "var(--tx3)", lineHeight: 1.6 }}>
                  {misses >= 3
                    ? TEXT.current.statusNarrative.broken
                    : misses >= 2
                    ? TEXT.current.statusNarrative.watch
                    : TEXT.current.statusNarrative.intact}
                </div>
              </div>
            </div>

            <div className="resp-2col-main" style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 1,
              background: "var(--bd)", borderRadius: 8, overflow: "hidden" }}>

              {/* Left — fan chart + KPI */}
              <div style={{ background: "var(--inner-bg)", padding: "16px 18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ fontSize: 11.5, letterSpacing: "0.18em", color: "var(--tx4)" }}>
                    <span style={{ background: "var(--bd)", padding: "2px 6px", borderRadius: 3, color: "var(--tx1)", marginRight: 8 }}>NOW</span>
                    {TICKER} · PRICE &amp; RISK-REWARD
                  </div>
                </div>
                <div className="panel" key={"cur-chart-" + active}><FanChart c={c} /></div>
                <div style={{ marginTop: 6, display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "var(--tx5)" }}>
                  <span><span style={{ color: c.accent }}>━━</span> {c.label.toLowerCase()} mid &nbsp;<span style={{ color: "#46aad9" }}>┊</span> now &nbsp;<span style={{ color: "var(--tx1)" }}>━</span> history</span>
                  <span>12M TARGET <span style={{ color: c.accent, fontWeight: 700 }}>{c.target12}</span></span>
                </div>

                <div style={{ marginTop: 18, borderTop: "1px solid var(--bd)", paddingTop: 14 }}>
                  <div style={{ fontSize: 11.5, letterSpacing: "0.16em", color: "var(--tx4)", marginBottom: 4 }}>
                    <span style={{ background: "var(--bd)", padding: "2px 6px", borderRadius: 3, color: "var(--tx1)", marginRight: 8 }}>KPI · K01</span>
                    {TEXT.current.kpiTitle}
                    <span style={{ color: "var(--tx5)", marginLeft: 8 }}>{TEXT.current.kpiSub}</span>
                  </div>
                  <div className="panel" key={"cur-kpi-" + active}
                    style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 120, padding: "12px 4px 0" }}>
                    <KpiCol label={HISTORY[HISTORY.length - 2].q} val={KPI_HIST} baseline accentColor="var(--tx4)" />
                    {KPI_PROJ[active].map((pv, i) => <KpiCol key={i} label={FUTURE_Q[i]} val={pv} accentColor={c.accent} delay={i * 0.08} />)}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 12, fontSize: 11, lineHeight: 1.5 }}>
                    <div>
                      <div style={{ color: "var(--tx5)", letterSpacing: "0.12em", marginBottom: 3 }}>WHAT THIS MEASURES</div>
                      <div style={{ color: "var(--tx3)" }}>{TEXT.current.kpiMeasures}</div>
                    </div>
                    <div>
                      <div style={{ color: "var(--tx5)", letterSpacing: "0.12em", marginBottom: 3 }}>WHAT THE <span style={{ color: c.accent }}>{c.label}</span> CASE REQUIRES</div>
                      <div style={{ color: c.accent }}>{TEXT.current.kpiRequires[active]}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right — narrative + signals + kill-switch */}
              <div style={{ background: "var(--inner-bg)", padding: "16px 18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ fontSize: 11.5, letterSpacing: "0.18em", color: "var(--tx4)" }}>THESIS · ALL SIGNALS</div>
                  <div style={{ fontSize: 12, color: "var(--tx4)" }}>{c.label.toLowerCase()} 12M <span style={{ color: c.accent, fontWeight: 700 }}>{c.target12}</span></div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
                  <span className="dot-track" style={{ fontSize: 10.5, color: c.accent }}>● TRACKING</span>
                </div>
                <div className="panel" key={"cur-op-" + active}
                  style={{ fontSize: 12.5, lineHeight: 1.6, color: "var(--tx2)", marginBottom: 16, minHeight: 72 }}>{c.op}</div>

                <SignalGroup id="SN01" title={TEXT.current.group1Title}
                  requires={c.requires01} accent={c.accent} evidence={3}>
                  {SIGNALS[active].map((s, i) => <SignalRow key={i} s={s} accent={c.accent} />)}
                </SignalGroup>
                <SignalGroup id="SN02" title={TEXT.current.group2Title}
                  requires={c.requires02} accent={c.accent} evidence={3}>
                  {MARGIN[active].map((s, i) => <MarginRow key={i} s={s} accent={c.accent} />)}
                </SignalGroup>

                <div style={{ marginTop: 14, padding: "10px 12px", background: "var(--panel-bg)",
                  border: "1px solid #dd817a44", borderLeft: "3px solid #dd817a", borderRadius: 6 }}>
                  <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: "#dd817a", fontWeight: 700, marginBottom: 4 }}>⚠ KILL-SWITCH</div>
                  <div style={{ fontSize: 11, color: "var(--tx3)", lineHeight: 1.6 }}>
                    {TEXT.current.killSwitch}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─ ② PRICE ─────────────────────────────────────────────────── */}
        {panel === "price" && (
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em",
              color: "var(--tx5)", marginBottom: 18, paddingBottom: 8, borderBottom: "1px solid var(--bd)" }}>
              IS THE PRICE FAIR?
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "10px 14px",
              background: verdictColor + "12", border: `1px solid ${verdictColor}44`,
              borderLeft: `3px solid ${verdictColor}`, borderRadius: 7, marginBottom: 18 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", color: verdictColor, marginBottom: 3 }}>
                  {belowBase ? "PRICE BELOW BASE — POTENTIAL ENTRY ZONE"
                    : inBase ? "PRICE WITHIN BASE RANGE — HOLD / MONITOR"
                    : "PRICE ABOVE BASE — ELEVATED EXPECTATIONS"}
                </div>
                <div style={{ fontSize: 9.5, color: "var(--tx5)", marginBottom: 3 }}>
                  ${NOW_PRICE} now · base range $${baseLo}–$${baseHi} · P/E {currentPE}× on ${v.ntm_eps} NTM EPS
                </div>
                <div style={{ fontSize: 11, color: "var(--tx3)", lineHeight: 1.6 }}>
                  {belowBase
                    ? TEXT.current.priceBanner.below(NOW_PRICE, baseLo)
                    : inBase
                    ? TEXT.current.priceBanner.inBase(NOW_PRICE)
                    : TEXT.current.priceBanner.above(NOW_PRICE, baseHi)}
                </div>
              </div>
            </div>

            {/* Price band visual */}
            <div style={{ background: "var(--inner-bg)", border: "1px solid var(--bd)", borderRadius: 8, padding: "18px 16px", marginBottom: 14 }}>
              <div style={{ fontSize: 9, letterSpacing: "0.14em", color: "var(--tx6)", marginBottom: 14 }}>12-MONTH PRICE TARGETS · BEAR / BASE / BULL</div>
              {["bull", "base", "bear"].map(k => {
                const cc = CASES[k];
                const parts = parseBand(cc.target12);
                const lo = parts[0], hi = parts[1];
                const totalRange = bullHi - bearLo;
                const leftPct  = ((lo - bearLo) / totalRange) * 100;
                const widthPct = ((hi - lo)  / totalRange) * 100;
                const nowPct   = ((NOW_PRICE - bearLo) / totalRange) * 100;
                return (
                  <div key={k} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9.5, marginBottom: 5 }}>
                      <span style={{ color: cc.accent, fontWeight: 700 }}>{cc.label}</span>
                      <span style={{ color: cc.accent }}>{cc.target12}</span>
                    </div>
                    <div style={{ position: "relative", height: 12, background: "var(--bd)", borderRadius: 6 }}>
                      <div style={{ position: "absolute", left: `${leftPct}%`, width: `${widthPct}%`,
                        height: "100%", background: cc.accent + "55", borderRadius: 6 }} />
                      {k === "base" && (
                        <div style={{ position: "absolute", left: `${nowPct}%`, top: -3, width: 3,
                          height: 18, background: "var(--title)", borderRadius: 2,
                          transform: "translateX(-50%)", zIndex: 2 }} />
                      )}
                    </div>
                    {k === "base" && (
                      <div style={{ fontSize: 8.5, color: "var(--tx5)", marginTop: 3 }}>
                        ▲ NOW ${NOW_PRICE} · {NOW_PRICE < lo ? `$${lo - NOW_PRICE} below base floor` : NOW_PRICE > hi ? `$${NOW_PRICE - hi} above base ceiling` : "inside base range"}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* P/E cards */}
            <div className="resp-3col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
              {[
                { label: "CURRENT P/E",   val: (NOW_PRICE / v.ntm_eps).toFixed(1) + "×", sub: `on $${v.ntm_eps} NTM EPS`,        col: "var(--blue-soft)" },
                { label: "NORMAL RANGE",  val: `${v.pe_normal_lo}–${v.pe_normal_hi}×`,    sub: "historical base multiple",        col: "var(--tx3)" },
                { label: "TROUGH / PEAK", val: `${v.pe_trough}× / ${v.pe_peak}×`,         sub: "fear floor · euphoria ceiling",   col: "var(--tx5)" },
              ].map(({ label, val, sub, col }) => (
                <div key={label} style={{ background: "var(--inner-bg)", border: "1px solid var(--bd)", borderRadius: 8, padding: "12px 14px" }}>
                  <div style={{ fontSize: 8.5, letterSpacing: "0.12em", color: "var(--tx6)", marginBottom: 5 }}>{label}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: col }}>{val}</div>
                  <div style={{ fontSize: 9, color: "var(--tx6)", marginTop: 3 }}>{sub}</div>
                </div>
              ))}
            </div>

            {/* Case requirements */}
            <div style={{ background: "var(--inner-bg)", border: `1px solid ${c.accent}44`, borderRadius: 8, padding: "12px 16px" }}>
              <div style={{ fontSize: 8.5, letterSpacing: "0.14em", color: c.accent, fontWeight: 700, marginBottom: 6 }}>
                WHAT THE {c.label} PRICE REQUIRES
              </div>
              <div style={{ fontSize: 11, color: "var(--tx3)", lineHeight: 1.65, marginBottom: 6 }}>{c.requires01}</div>
              <div style={{ fontSize: 11, color: "var(--tx3)", lineHeight: 1.65 }}>{c.requires02}</div>
            </div>
          </div>
        )}

        {/* ─ ③ MOOD ──────────────────────────────────────────────────── */}
        {panel === "mood" && (
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em",
              color: "var(--tx5)", marginBottom: 18, paddingBottom: 8, borderBottom: "1px solid var(--bd)" }}>
              WHAT IS THE MARKET CURRENTLY ASSUMING?
            </div>

            {/* Banner */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "10px 14px",
              background: marketMood.col + "12", border: `1px solid ${marketMood.col}44`,
              borderLeft: `3px solid ${marketMood.col}`, borderRadius: 7, marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", color: marketMood.col, marginBottom: 3 }}>
                  {marketMood.label} — {marketMood.sub}
                </div>
                <div style={{ fontSize: 9.5, color: "var(--tx5)", marginBottom: 4 }}>
                  P/E {currentPE}× · normal {v.pe_normal_lo}–{v.pe_normal_hi}× · trough {v.pe_trough}× · peak {v.pe_peak}×
                </div>
                <div style={{ fontSize: 11, color: "var(--tx3)", lineHeight: 1.6 }}>
                  {TEXT.current.moodBanner(currentPE, v.pe_normal_lo, v.pe_normal_hi)}
                  {" "}The reverse DCF says the crowd is only requiring <span style={{ color: cagrColor, fontWeight: 700 }}>{cagrDisplay} EPS CAGR</span> to justify today's price. {cagrNote}
                </div>
              </div>
            </div>

            {/* Reverse DCF */}
            <div {...tip("Reverse DCF — what is the market pricing in?", `Works backwards from today's price: given a discount rate and terminal multiple, what annual EPS growth rate must the market be embedding? At $${NOW_PRICE}, the required CAGR is ${cagrDisplay}. ${cagrNote} Adjust sliders to stress-test assumptions.`, "Low required CAGR = not priced for perfection. High = very little room for error.", cagrColor)}
              style={{ padding: "14px 16px", background: "var(--inner-bg)", border: `1px solid ${cagrColor}44`, borderRadius: 8, marginBottom: 14 }}>
              <div style={{ fontSize: 8.5, letterSpacing: "0.14em", color: "var(--tx6)", marginBottom: 12 }}>REVERSE DCF · IMPLIED EPS CAGR</div>
              <div className="resp-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                {[
                  { label: "DISCOUNT RATE", val: dr, set: setDr, min: 6, max: 14, step: 0.5, fmt: v2 => `${v2.toFixed(1)}%` },
                  { label: `TERMINAL P/E (${dcfN}YR)`, val: termPE, set: setTermPE, min: 15, max: 35, step: 1, fmt: v2 => `${v2}×` },
                ].map(({ label, val, set, min, max, step, fmt }) => (
                  <div key={label}>
                    <div style={{ fontSize: 9, color: "var(--tx6)", letterSpacing: "0.1em", marginBottom: 5 }}>{label}</div>
                    <input type="range" min={min} max={max} step={step} value={val}
                      onChange={e => set(+e.target.value)}
                      style={{ width: "100%", accentColor: cagrColor, cursor: "pointer" }} />
                    <div style={{ fontSize: 13, color: cagrColor, fontWeight: 700, marginTop: 3 }}>{fmt(val)}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: "10px 14px", background: "var(--panel-bg)", borderRadius: 6, border: `1px solid ${cagrColor}33` }}>
                <div style={{ fontSize: 9, color: "var(--tx6)", marginBottom: 4, letterSpacing: "0.1em" }}>AT ${NOW_PRICE}, MARKET REQUIRES</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: cagrColor, lineHeight: 1 }}>
                  {cagrDisplay} EPS CAGR
                </div>
                <div style={{ fontSize: 9.5, color: "var(--tx7)", margin: "4px 0 8px" }}>over {dcfN}yr · NTM EPS $${v.ntm_eps} · ${dcfN}yr terminal {termPE}× · discount {dr}%</div>
                <div style={{ fontSize: 10.5, color: "var(--tx3)", lineHeight: 1.55 }}>{cagrNote}</div>
              </div>
            </div>

            {/* 2-col: implied FY revenue + FCF yield */}
            <div className="resp-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div {...tip("Price-implied full-year revenue", TEXT.current.fy26CardTip(fyRevBase.toFixed(1)), null, "var(--blue-soft)")}
                style={{ background: "var(--inner-bg)", border: "1px solid var(--bd)", borderRadius: 8, padding: "14px 16px" }}>
                <div style={{ fontSize: 8.5, letterSpacing: "0.14em", color: "var(--tx6)", marginBottom: 10 }}>PRICE-IMPLIED FY REVENUE</div>
                <div style={{ fontSize: 10.5, color: "var(--tx3)", lineHeight: 1.7, marginBottom: 12 }}
                  dangerouslySetInnerHTML={{ __html: TEXT.current.fy26CardHtml(fyRevBase.toFixed(1), (((fyRevBase / v.prior_fy_rev_b) - 1) * 100).toFixed(0)) }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9.5, marginBottom: 3 }}>
                  <span style={{ color: "var(--tx5)" }}>{v.prior_fy_label} actual revenue</span>
                  <span style={{ color: "#66b278", fontWeight: 700 }}>${v.prior_fy_rev_b}B</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9.5 }}>
                  <span style={{ color: "var(--tx5)" }}>Implied FY (base case)</span>
                  <span style={{ color: "var(--blue-soft)", fontWeight: 700 }}>~${fyRevBase.toFixed(1)}B</span>
                </div>
              </div>

              <div {...tip("FCF Yield vs risk-free", `FCF yield = NTM FCF ÷ market cap. At ${fcfYield}%, ${TICKER}'s cash yield is ${(parseFloat(fcfYield) - v.risk_free_pct).toFixed(2)}% above the 10Y Treasury (${v.risk_free_pct}%). Positive spread = some compensation above risk-free. Below Treasury = paying purely for growth.`, null, parseFloat(fcfYield) > 3.5 ? "#66b278" : parseFloat(fcfYield) > 2.5 ? "#c59542" : "#dd817a")}
                style={{ background: "var(--inner-bg)", border: "1px solid var(--bd)", borderRadius: 8, padding: "14px 16px" }}>
                <div style={{ fontSize: 8.5, letterSpacing: "0.14em", color: "var(--tx6)", marginBottom: 10 }}>FCF YIELD — AM I BEING PAID FAIRLY?</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 6 }}>
                  <div style={{ fontSize: 28, fontWeight: 700,
                    color: parseFloat(fcfYield) > 3.5 ? "#66b278" : parseFloat(fcfYield) > 2.5 ? "#c59542" : "#dd817a" }}>
                    {fcfYield}%
                  </div>
                  <div style={{ fontSize: 9.5, color: "var(--tx6)" }}>
                    vs Treasury {v.risk_free_pct}% &nbsp;
                    <span style={{ color: parseFloat(fcfYield) > v.risk_free_pct ? "#66b278" : "#dd817a", fontWeight: 700 }}>
                      ({parseFloat(fcfYield) > v.risk_free_pct ? "+" : ""}{(parseFloat(fcfYield) - v.risk_free_pct).toFixed(2)}%)
                    </span>
                  </div>
                </div>
                <div style={{ fontSize: 9.5, color: "var(--tx5)", marginBottom: 10 }}>
                  ${v.fcf_ntm_b}B NTM FCF ÷ ${(NOW_PRICE * v.shares_b).toFixed(0)}B mkt cap
                </div>
                <div style={{ fontSize: 10.5, color: "var(--tx3)", lineHeight: 1.65 }}>
                  {parseFloat(fcfYield) > 3.5
                    ? "Above 3.5% — reasonable compensation. Market not pricing in runaway growth."
                    : parseFloat(fcfYield) > 2.5
                    ? "2.5–3.5% range — fair but not cheap. Growth must play out."
                    : "Below 2.5% — expensive on cash flow. Growth premium fully baked in."}
                </div>
              </div>
            </div>

            {/* Full peer comps table */}
            <div style={{ background: "var(--inner-bg)", border: "1px solid var(--bd)", borderRadius: 8, padding: "14px 16px" }}>
              <div style={{ fontSize: 8.5, letterSpacing: "0.14em", color: "var(--tx6)", marginBottom: 12 }}>PEER COMPS — FORWARD MULTIPLES</div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--bd2)" }}>
                    {["TICKER", "FWD P/E", "EV/EBITDA", "FCF YIELD", "CONTEXT"].map((h, i) => (
                      <th key={i} style={{ padding: "4px 8px", textAlign: i === 0 ? "left" : i === 4 ? "left" : "right",
                        color: "var(--tx7)", fontSize: 9, letterSpacing: "0.1em", fontWeight: 400 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {v.peers.map((p) => {
                    const isHolding = p.t === TICKER_META.ticker;
                    const col = isHolding ? "var(--blue-soft)" : "var(--tx5)";
                    return (
                      <tr key={p.t} {...tip(p.t, `${p.note}. FWD P/E: ${p.fpe}× · EV/EBITDA: ${p.ev_eb}× · FCF yield: ${p.fcf_y}%`, isHolding ? "Your holding" : null, col)}
                        style={{ borderBottom: "1px solid var(--bd)", background: isHolding ? "var(--row-hl)" : "transparent",
                          transition: "background .1s" }}>
                        <td style={{ padding: "7px 8px", color: isHolding ? "var(--title)" : "var(--tx4)", fontWeight: isHolding ? 700 : 400 }}>{p.t}</td>
                        <td style={{ padding: "7px 8px", textAlign: "right", color: col, fontWeight: isHolding ? 700 : 400 }}>{p.fpe}×</td>
                        <td style={{ padding: "7px 8px", textAlign: "right", color: col, fontWeight: isHolding ? 700 : 400 }}>{p.ev_eb}×</td>
                        <td style={{ padding: "7px 8px", textAlign: "right", color: col, fontWeight: isHolding ? 700 : 400 }}>{p.fcf_y}%</td>
                        <td style={{ padding: "7px 8px", color: "var(--tx7)", fontSize: 9.5 }}>{p.note}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div style={{ marginTop: 10, fontSize: 10.5, color: "var(--tx4)", lineHeight: 1.55 }}>
                {TEXT.current.peerCommentary((NOW_PRICE / v.ntm_eps).toFixed(1))}
              </div>
            </div>
          </div>
        )}

        {/* ─ ④ RISK/REWARD ───────────────────────────────────────────── */}
        {panel === "risk" && (
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em",
              color: "var(--tx5)", marginBottom: 18, paddingBottom: 8, borderBottom: "1px solid var(--bd)" }}>
              AM I GETTING PAID FOR THE RISK?
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "10px 14px",
              background: asymStatus.col + "12", border: `1px solid ${asymStatus.col}44`,
              borderLeft: `3px solid ${asymStatus.col}`, borderRadius: 7, marginBottom: 18 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", color: asymStatus.col, marginBottom: 3 }}>
                  {asymStatus.label} — {asymStatus.desc}
                </div>
                <div style={{ fontSize: 9.5, color: "var(--tx5)", marginBottom: 3 }}>
                  Bear −{bearDown}% · Bull +{bullUp}% · ratio {asymRatio.toFixed(1)}× upside per unit of downside · FCF yield {fcfYield}%
                </div>
                <div style={{ fontSize: 11, color: "var(--tx3)", lineHeight: 1.6 }}>
                  From ${NOW_PRICE}: bear costs ${NOW_PRICE - bearLo} (−{bearDown}%), bull gains ${bullHi - NOW_PRICE} (+{bullUp}%). For every dollar at risk, {asymRatio.toFixed(1)}× potential gain.
                </div>
              </div>
            </div>

            <TrackRecord />
          </div>
        )}

      </div>
    </div>
  );
}

// ── THE FUTURE Tab ───────────────────────────────────────────────────────────
function FutureTab() {
  const [panel, setPanel] = useState("outcomes");

  // ── Dry powder tracker (localStorage key: th3sis_portfolio) ──────────────
  const STORE_KEY                = "th3sis_portfolio";
  const PORTFOLIO_SCHEMA_VERSION = 1;
  const defaultStore = () => ({ version: PORTFOLIO_SCHEMA_VERSION, cycleAmount: 800, cycleDays: 15, cycles: [] });
  const loadStore    = () => loadStorage(STORE_KEY, PORTFOLIO_SCHEMA_VERSION, defaultStore());
  const [store, setStore] = useState(loadStore);
  const saveStore = (s) => { localStorage.setItem(STORE_KEY, JSON.stringify(s)); setStore(s); };

  // Cycle editor state
  const [editingCycle, setEditingCycle] = useState(null); // null = closed
  const [cycleForm, setCycleForm] = useState({ date: "", deployed: "", saved: "", note: "" });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsForm, setSettingsForm] = useState({ cycleAmount: 800, cycleDays: 15 });

  // ── Position state (migrated from PositionTab) ───────────────────────────
  const [clearPending, setClearPending] = useState(false);
  const [checks, setChecks]         = useState(() => loadPos()?.checks    || DEFAULT_CHECKS());
  const [tranches, setTranches]     = useState(() => loadPos()?.tranches  || DEFAULT_TRANCHES);
  const [existing, setExisting]     = useState(() => {
    const sv = loadPos()?.existing;
    if (!sv) return [{ id: 1, price: "", shares: "", date: "" }];
    if (!Array.isArray(sv)) return [{ id: 1, price: sv.price || "", shares: sv.shares || "", date: sv.date || "" }];
    return sv;
  });
  const [portfolioK, setPortfolioK] = useState(() => loadPos()?.portfolioK || 100);
  const [posPct, setPosPct]         = useState(() => loadPos()?.posPct     || 2.0);
  const [flash, setFlash]           = useState(false);

  const toggle        = key => setChecks(c => ({ ...c, [key]: !c[key] }));
  const updateT       = (id, fld, val) => setTranches(ts => ts.map(t => {
    if (t.id !== id) return t;
    const u = { ...t, [fld]: val };
    if (!t.date && u.price && u.shares) u.date = new Date().toISOString().slice(0, 10);
    return u;
  }));
  const addTranche    = () => setTranches(ts => [...ts, { id: Date.now(), label: `TRANCHE ${ts.length + 1}`, price: "", shares: "", date: null, note: "" }]);
  const deleteTranche = id => setTranches(ts => ts.filter(t => t.id !== id));
  const updateEx      = (id, fld, val) => setExisting(exs => exs.map(e => e.id === id ? { ...e, [fld]: val } : e));
  const addExisting   = () => setExisting(exs => [...exs, { id: Date.now(), price: "", shares: "", date: "" }]);
  const delExisting   = id => setExisting(exs => exs.length > 1 ? exs.filter(e => e.id !== id) : exs);
  const clearPos      = () => {
    localStorage.removeItem(POS_KEY);
    setTranches(DEFAULT_TRANCHES);
    setChecks(DEFAULT_CHECKS());
    setExisting([{ id: 1, price: "", shares: "", date: "" }]);
    setPortfolioK(100); setPosPct(2.0);
    setClearPending(false);
  };

  const allGreen    = Object.values(checks).every(Boolean);
  const greenCount  = Object.values(checks).filter(Boolean).length;
  const filled      = tranches.filter(t => +t.price > 0 && +t.shares > 0);
  const totShares   = filled.reduce((s, t) => s + +t.shares, 0);
  const totCost     = filled.reduce((s, t) => s + +t.price * +t.shares, 0);
  const blended     = totShares > 0 ? totCost / totShares : 0;
  const exFilled    = existing.filter(e => +e.price > 0 && +e.shares > 0);
  const exShares    = exFilled.reduce((s, e) => s + +e.shares, 0);
  const exCost      = exFilled.reduce((s, e) => s + +e.price * +e.shares, 0);
  const exBasis     = exShares > 0 ? exCost / exShares : 0;
  const allShares   = totShares + exShares;
  const allCost     = totCost + exCost;
  const blendedAll  = allShares > 0 ? allCost / allShares : 0;
  const posRef      = blendedAll > 0 ? blendedAll : blended > 0 ? blended : NOW_PRICE;
  const [POS_BEAR_LO, POS_BEAR_HI] = parseBand(CASES.bear.target12);
  const [POS_BASE_LO, POS_BASE_HI] = parseBand(CASES.base.target12);
  const [POS_BULL_LO, POS_BULL_HI] = parseBand(CASES.bull.target12);
  const POS_BEAR_MID = Math.round((POS_BEAR_LO + POS_BEAR_HI) / 2);
  const portVal     = portfolioK * 1000;
  const posPosVal   = portVal * posPct / 100;
  const posBearLoss = posPosVal * (POS_BEAR_MID - posRef) / posRef;
  const posBearLossPct = (posBearLoss / portVal * 100).toFixed(2);
  const posAbsLoss  = Math.abs(parseFloat(posBearLossPct));

  const posInputStyle = { width: "100%", textAlign: "right", background: "var(--inner-bg)",
    border: "1px solid var(--bd2)", borderRadius: 4, padding: "5px 8px",
    fontSize: 11, color: "var(--tx1)", fontFamily: FONT_MONO, outline: "none" };

  useEffect(() => {
    localStorage.setItem(POS_KEY, JSON.stringify({ version: 1, existing, checks, tranches, portfolioK, posPct }));
    setFlash(true);
    const ft = setTimeout(() => setFlash(false), 1000);
    return () => clearTimeout(ft);
  }, [existing, checks, tranches, portfolioK, posPct]);

  // ── Derived scenario values ───────────────────────────────────────────────
  const bearLo = POS_BEAR_LO, bearHi = POS_BEAR_HI;
  const baseLo = POS_BASE_LO, baseHi = POS_BASE_HI;
  const bullLo = POS_BULL_LO, bullHi = POS_BULL_HI;
  const bearMid = Math.round((bearLo + bearHi) / 2);
  const baseMid = Math.round((baseLo + baseHi) / 2);
  const bullMid = Math.round((bullLo + bullHi) / 2);
  const bearPct = Math.round(((bearMid - NOW_PRICE) / NOW_PRICE) * 100);
  const basePct = Math.round(((baseMid - NOW_PRICE) / NOW_PRICE) * 100);
  const bullPct = Math.round(((bullMid - NOW_PRICE) / NOW_PRICE) * 100);

  // Dry powder totals
  const totalDeployed  = store.cycles.reduce((s, c) => s + (parseFloat(c.deployed) || 0), 0);
  const totalSaved     = store.cycles.reduce((s, c) => s + (parseFloat(c.saved)    || 0), 0);
  const warChest       = totalSaved;

  // Kill-switch (from SIGNALS/MARGIN — count MISS tags)
  const sigs  = SIGNALS.base.concat(MARGIN.base);
  const misses = sigs.filter(s => s.tag === "MISS").length;

  // Thesis health
  const thesisOk   = misses < 2;
  const thesisBroke = misses >= 3;

  // Price zone
  const belowBase = NOW_PRICE < baseLo;
  const inBase    = NOW_PRICE >= baseLo && NOW_PRICE <= baseHi;
  const aboveBase = NOW_PRICE > baseHi;

  // P/E context
  const currentPE = (NOW_PRICE / VAL_CONFIG.ntm_eps).toFixed(1);
  const fcfYield  = ((VAL_CONFIG.fcf_ntm_b / (NOW_PRICE * VAL_CONFIG.shares_b)) * 100).toFixed(1);

  // Deployment mode
  const deployMode = (() => {
    if (thesisBroke) return { label: "EXIT", sub: "Kill-switch criteria met — close the position", col: "#dd817a", range: "" };
    if (belowBase && thesisOk && warChest >= 600)
      return { label: "DEPLOY", sub: "Thesis intact · price below base floor · war chest ready", col: "#66b278", range: "$600–800+" };
    if (belowBase && warChest >= 200)
      return { label: "NIBBLE", sub: "Price attractive · preserve dry powder for adds", col: "#c59542", range: "$200–400" };
    if (inBase && thesisOk && warChest >= 400)
      return { label: "ADD", sub: "Thesis intact · normal cadence add", col: "#66b278", range: "$400–600" };
    if (aboveBase)
      return { label: "WAIT", sub: "Price stretched — let it come to you", col: "#dd817a", range: "" };
    return { label: "NIBBLE", sub: "Forming conviction · skin in the game only", col: "#c59542", range: "$200–400" };
  })();

  // Asymmetry ratio (bull upside / bear downside from NOW)
  const upside   = bullMid - NOW_PRICE;
  const downside = NOW_PRICE - bearMid;
  const asymRatio = downside > 0 ? (upside / downside).toFixed(1) : "∞";

  // Dislocation signal (reusing same logic as ReversionClock)
  const dislocDays = Math.round((Date.now() - new Date(DISLOCATION_DATE)) / 86400000);
  const dislocSignal = NOW_PRICE <= REVERSION_BASEFLOOR
    ? { label: "DISLOCATION", sub: `${dislocDays}d since event · still below base floor`, col: "#66b278" }
    : { label: "RECOVERING",  sub: `${dislocDays}d since event · $${Math.round(REVERSION_BASEFLOOR - NOW_PRICE) < 0 ? Math.round(NOW_PRICE - REVERSION_BASEFLOOR) : Math.round(REVERSION_BASEFLOOR - NOW_PRICE)} ${NOW_PRICE < REVERSION_BASEFLOOR ? "below" : "above"} base floor`, col: "#c59542" };

  // ── Scorecard cards ───────────────────────────────────────────────────────
  const ScoreCard = ({ question, answer, detail, col, panelKey, tipTitle, tipBody }) => (
    <div onClick={() => setPanel(panelKey)} {...(tipTitle ? tip(tipTitle, tipBody, "Click to view full detail below", col) : {})} style={{
      background: "var(--inner-bg)", border: `1px solid ${col}44`,
      borderLeft: `3px solid ${col}`, borderRadius: 8, padding: "14px 16px",
      cursor: "pointer", transition: "background .15s", flex: 1,
    }}>
      <div style={{ fontSize: 8, letterSpacing: "0.14em", color: "var(--tx6)", marginBottom: 5 }}>{question}</div>
      <div style={{ fontSize: 11.5, fontWeight: 700, color: col, marginBottom: 5, letterSpacing: "0.06em" }}>{answer}</div>
      <div style={{ fontSize: 10, color: "var(--tx5)", lineHeight: 1.55 }}>{detail}</div>
      <div style={{ marginTop: 6, fontSize: 8, color: col, opacity: 0.7, letterSpacing: "0.1em" }}>VIEW DETAIL ›</div>
    </div>
  );

  // ── Chevron nav ───────────────────────────────────────────────────────────
  const chevrons = [
    { key: "outcomes", label: "① OUTCOMES",  col: bullPct > 0 ? "#66b278" : "#dd817a", tipBody: `12-month scenario returns: Bear ${bearPct}%, Base ${basePct >= 0 ? "+" : ""}${basePct}%, Bull +${bullPct}%. Includes a position value calculator — enter your share count to see real dollar P&L per scenario.` },
    { key: "downside", label: "② DOWNSIDE",  col: belowBase ? "#66b278" : "#c59542",   tipBody: `Bear case risk: $${bearMid} target (${bearPct}% from $${NOW_PRICE}). Portfolio loss calculator lets you enter your portfolio size and position % to see exact dollar risk. ${TEXT.future.downsideChevronTip}` },
    { key: "signal",   label: "③ SIGNAL",    col: dislocSignal.col,                     tipBody: `Price attractiveness signals: NTM P/E ${currentPE}× vs 10Y range (${VAL_CONFIG.pe_trough}–${VAL_CONFIG.pe_peak}×), dislocation clock (${dislocDays}d since ${TEXT.future.dislocEventName}), and FCF yield (${fcfYield}%) vs 10Y Treasury (${VAL_CONFIG.risk_free_pct}%). Is today a better or worse entry than historical norms?` },
    { key: "capital",  label: "④ CAPITAL & POSITION", col: warChest >= 400 ? "#66b278" : warChest >= 200 ? "#c59542" : "#dd817a", tipBody: `War chest tracker + your ${TICKER} position ledger. Log each investing cycle (deployed + saved). Track your existing pre-thesis position, thesis-driven adds, and combined blended basis. Sizing check calculates bear-case dollar loss at your position size. Thesis checks gate whether it is time to add.` },
  ];

  // ── Cycle CRUD helpers ────────────────────────────────────────────────────
  const openAdd = () => {
    const today = new Date().toISOString().split("T")[0];
    setCycleForm({ date: today, deployed: "", saved: "", note: "" });
    setEditingCycle("new");
  };
  const openEdit = (c) => {
    setCycleForm({ date: c.date, deployed: c.deployed, saved: c.saved, note: c.note || "" });
    setEditingCycle(c.id);
  };
  const saveForm = () => {
    const newCycle = {
      id: editingCycle === "new" ? Date.now() : editingCycle,
      date:     cycleForm.date,
      deployed: parseFloat(cycleForm.deployed) || 0,
      saved:    parseFloat(cycleForm.saved)    || 0,
      note:     cycleForm.note,
    };
    const cycles = editingCycle === "new"
      ? [...store.cycles, newCycle]
      : store.cycles.map(c => c.id === editingCycle ? newCycle : c);
    saveStore({ ...store, cycles });
    setEditingCycle(null);
  };
  const deleteCycle = (id) => saveStore({ ...store, cycles: store.cycles.filter(c => c.id !== id) });
  const saveSettings = () => {
    saveStore({ ...store, cycleAmount: parseFloat(settingsForm.cycleAmount) || 800,
                           cycleDays:   parseFloat(settingsForm.cycleDays)   || 15 });
    setSettingsOpen(false);
  };

  // Inline panel components
  const Banner = ({ status, desc, col, summary }) => (
    <div style={{ padding: "10px 14px", borderRadius: 6, background: `${col}18`,
      border: `1px solid ${col}44`, marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: summary ? 4 : 0 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: col }}>{status}</div>
        {desc && <div style={{ fontSize: 9, color: "var(--tx6)", letterSpacing: "0.08em" }}>{desc}</div>}
      </div>
      {summary && <div style={{ fontSize: 10.5, color: "var(--tx4)", lineHeight: 1.55 }}>{summary}</div>}
    </div>
  );

  const Footnote = ({ text }) => (
    <div style={{ borderLeft: "2px solid var(--bd2)", paddingLeft: 10, marginTop: 10,
      fontSize: 9.5, color: "var(--tx7)", lineHeight: 1.55 }}>{text}</div>
  );

  // ── OUTCOMES panel ────────────────────────────────────────────────────────
  const OutcomesPanel = () => {
    const [shares, setShares] = useState(10);
    const cost = (shares * NOW_PRICE).toFixed(0);
    const scenarios = [
      { label: "BEAR", lo: bearLo, hi: bearHi, mid: bearMid, pct: bearPct, col: "#dd817a" },
      { label: "BASE", lo: baseLo, hi: baseHi, mid: baseMid, pct: basePct, col: "#c59542" },
      { label: "BULL", lo: bullLo, hi: bullHi, mid: bullMid, pct: bullPct, col: "#66b278" },
    ];
    return (
      <div>
        <Banner
          status={`ASYMMETRY: ${asymRatio}× UP PER UNIT DOWN`}
          desc={`bull +${bullPct}% · base ${basePct >= 0 ? "+" : ""}${basePct}% · bear ${bearPct}%`}
          col={parseFloat(asymRatio) >= 2 ? "#66b278" : parseFloat(asymRatio) >= 1 ? "#c59542" : "#dd817a"}
          summary={`At $${NOW_PRICE}, base case is roughly flat. Meaningful upside only arrives with bull-case execution. Bear downside is real (~${Math.abs(bearPct)}%) — size accordingly.`}
        />
        <div style={{ fontSize: 9, letterSpacing: "0.12em", color: "var(--tx6)", marginBottom: 10 }}>12-MONTH SCENARIO RETURN</div>
        {scenarios.map(({ label, lo, hi, mid, pct, col }) => {
          const pctSign = pct >= 0 ? "+" : "";
          const barW = Math.min(96, Math.max(4, ((mid - GEOM.priceMin) / (GEOM.priceMax - GEOM.priceMin)) * 100));
          return (
            <div key={label} {...tip(`${label} case — 12 months`, `Target range: $${lo}–$${hi} (midpoint $${mid}). Return from $${NOW_PRICE}: ${pctSign}${pct}%. ${label === "BEAR" ? TEXT.future.scenarioTips.bear : label === "BASE" ? TEXT.future.scenarioTips.base(VAL_CONFIG.pe_normal_lo, VAL_CONFIG.pe_normal_hi) : TEXT.future.scenarioTips.bull(currentPE)}`, "Midpoint of price band used. 12-month horizon. These are estimates — hold loosely.", col)} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: 9.5, fontWeight: 700, color: col, letterSpacing: "0.1em" }}>{label}</span>
                <span style={{ fontSize: 9.5, color: "var(--tx5)" }}>
                  ${lo}–${hi} · <span style={{ color: col, fontWeight: 700 }}>{pctSign}{pct}%</span>
                </span>
              </div>
              <div style={{ position: "relative", height: 8, background: "var(--tiny-bg)", borderRadius: 4 }}>
                <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: `${barW}%`,
                  background: col, opacity: 0.35, borderRadius: 4 }} />
                <div style={{ position: "absolute", top: "50%", left: `${barW}%`,
                  transform: "translate(-50%,-50%)", width: 6, height: 6,
                  borderRadius: "50%", background: col, boxShadow: `0 0 6px ${col}` }} />
              </div>
            </div>
          );
        })}

        <div style={{ marginTop: 18, padding: "12px 14px", background: "var(--inner-bg)",
          borderRadius: 6, border: "1px solid var(--bd2)" }}>
          <div style={{ fontSize: 9, letterSpacing: "0.12em", color: "var(--tx6)", marginBottom: 8 }}>POSITION VALUE CALCULATOR</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 10, color: "var(--tx5)" }}>Shares:</span>
            <input type="number" min="1" value={shares} onChange={e => setShares(Math.max(1, parseInt(e.target.value) || 1))}
              style={{ width: 70, padding: "4px 8px", background: "var(--input-bg)",
                border: "1px solid var(--bd2)", borderRadius: 4, color: "var(--title)",
                fontSize: 10.5, outline: "none", fontFamily: "inherit" }} />
            <span style={{ fontSize: 10, color: "var(--tx6)" }}>× ${NOW_PRICE} = <strong style={{ color: "var(--tx3)" }}>${Number(cost).toLocaleString()}</strong> cost</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {scenarios.map(({ label, mid, pct, col }) => {
              const val = Math.round(shares * mid);
              const pl  = val - parseInt(cost);
              const plSign = pl >= 0 ? "+" : "";
              return (
                <div key={label} {...tip(`Position value — ${label} case`, `If ${label.toLowerCase()} case plays out, your ${shares} shares would be worth ~$${val.toLocaleString()} at the $${mid} midpoint. That is a P&L of ${plSign}$${Math.abs(pl).toLocaleString()} on your $${Number(cost).toLocaleString()} cost basis (${Math.round((pl/parseInt(cost))*100) >= 0 ? "+" : ""}${Math.round((pl/parseInt(cost))*100)}%). Adjust the share count above to model different position sizes.`, null, col)} style={{ flex: 1, padding: "8px 10px", borderRadius: 6,
                  background: `${col}12`, border: `1px solid ${col}33`, textAlign: "center" }}>
                  <div style={{ fontSize: 8, color: col, letterSpacing: "0.1em", marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: col }}>${val.toLocaleString()}</div>
                  <div style={{ fontSize: 9, color: "var(--tx6)", marginTop: 2 }}>{plSign}${Math.abs(pl).toLocaleString()}</div>
                </div>
              );
            })}
          </div>
        </div>
        <Footnote text="Midpoint of price band used. 12-month horizon. These are scenario estimates, not targets — hold loosely and widen your mental bands." />
      </div>
    );
  };

  // ── DOWNSIDE panel ────────────────────────────────────────────────────────
  const DownsidePanel = () => {
    const [portK, setPortK]     = useState(100);
    const [calcPct, setCalcPct] = useState(2.0);
    const portV       = portK * 1000;
    const posV        = Math.round(portV * calcPct / 100);
    const shares      = Math.round(posV / NOW_PRICE);
    const bearLoss    = Math.round(shares * (NOW_PRICE - bearMid));
    const bearLossPct = ((bearLoss / portV) * 100).toFixed(1);
    return (
      <div>
        <Banner
          status={`BEAR CASE: ${bearPct}% FROM CURRENT`}
          desc={`$${bearMid} target · $${bearLo}–$${bearHi} range`}
          col="#dd817a"
          summary={CASES.bear.op.slice(0, 200) + "…"}
        />

        <div style={{ padding: "12px 14px", background: "var(--inner-bg)",
          borderRadius: 6, border: "1px solid var(--bd2)", marginBottom: 12 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.12em", color: "var(--tx6)", marginBottom: 10 }}>PORTFOLIO LOSS CALCULATOR</div>

          <div style={{ display: "flex", gap: 16, marginBottom: 12, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 140 }}>
              <div style={{ fontSize: 9, color: "var(--tx6)", marginBottom: 3 }}>PORTFOLIO SIZE ($K)</div>
              <input type="number" min="10" step="10" value={portK} onChange={e => setPortK(Math.max(10, parseInt(e.target.value) || 100))}
                style={{ width: "100%", padding: "5px 8px", background: "var(--input-bg)",
                  border: "1px solid var(--bd2)", borderRadius: 4, color: "var(--title)",
                  fontSize: 11, outline: "none", fontFamily: "inherit" }} />
            </div>
            <div style={{ flex: 1, minWidth: 140 }}>
              <div style={{ fontSize: 9, color: "var(--tx6)", marginBottom: 3 }}>POSITION SIZE (%)</div>
              <input type="number" min="0.5" max="50" step="0.5" value={calcPct} onChange={e => setCalcPct(Math.min(50, Math.max(0.5, parseFloat(e.target.value) || 2)))}
                style={{ width: "100%", padding: "5px 8px", background: "var(--input-bg)",
                  border: "1px solid var(--bd2)", borderRadius: 4, color: "var(--title)",
                  fontSize: 11, outline: "none", fontFamily: "inherit" }} />
            </div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            {[
              { label: "POSITION VALUE", val: `$${posV.toLocaleString()}`, sub: `~${shares} shares @ $${NOW_PRICE}`, col: "var(--tx3)", tipTitle: "Position value", tipBody: `At $${NOW_PRICE} with a ${calcPct}% allocation in a $${portK}K portfolio, you hold ~${shares} shares worth ~$${posV.toLocaleString()}. Adjust portfolio size or position % above to model different scenarios.` },
              { label: "BEAR CASE LOSS", val: `-$${bearLoss.toLocaleString()}`, sub: `${bearLossPct}% of portfolio`, col: "#dd817a", tipTitle: "Bear case dollar loss", tipBody: `If the bear case plays out ($${bearMid} target), your ~${shares} shares would lose ~$${bearLoss.toLocaleString()} — ${bearLossPct}% of your total portfolio. Rule of thumb: if the bear case loss would cause you to lose sleep, the position is too large. Kelly criterion suggests sizing so bear loss ≤ 1–2% of portfolio.` },
              { label: "BEAR PRICE", val: `$${bearMid}`, sub: `$${bearLo}–$${bearHi} range`, col: "#dd817a", tipTitle: "Bear case price target", tipBody: TEXT.future.bearPriceTip(bearMid, bearLo, bearHi, VAL_CONFIG.pe_trough, VAL_CONFIG.pe_bear_hi) },
            ].map(({ label, val, sub, col, tipTitle, tipBody }) => (
              <div key={label} {...tip(tipTitle, tipBody, null, col)} style={{ flex: 1, padding: "8px 10px", borderRadius: 6,
                background: "var(--panel-bg)", border: "1px solid var(--bd2)", textAlign: "center" }}>
                <div style={{ fontSize: 8, color: "var(--tx6)", letterSpacing: "0.1em", marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: col }}>{val}</div>
                <div style={{ fontSize: 9, color: "var(--tx7)", marginTop: 2 }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>

        <div {...tip("Kill-switch", TEXT.future.killSwitchTip, TEXT.future.killSwitchTipNote, "#dd817a")} style={{ padding: "10px 14px", borderRadius: 6, background: "rgba(241,86,75,0.08)",
          border: "1px solid rgba(241,86,75,0.3)" }}>
          <div style={{ fontSize: 9, letterSpacing: "0.12em", color: "#dd817a", marginBottom: 5 }}>KILL-SWITCH — ACT ON THIS</div>
          <div style={{ fontSize: 10.5, color: "var(--tx4)", lineHeight: 1.6 }}
            dangerouslySetInnerHTML={{ __html: TEXT.future.killSwitchHtml }} />
          <div style={{ marginTop: 8, fontSize: 10, color: "#dd817a" }}>{TEXT.future.nextCheck}</div>
        </div>
        {/* MY POSITION — personal bear case impact from saved data */}
        {allShares > 0 && (
          <div style={{ marginTop: 12, padding: "12px 14px", background: "rgba(70,170,217,0.06)",
            border: "1px solid rgba(70,170,217,0.25)", borderRadius: 6 }}>
            <div style={{ fontSize: 9, letterSpacing: "0.12em", color: "#46aad9", marginBottom: 8 }}>MY {TICKER} POSITION — BEAR CASE IMPACT</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              {[
                { label: "TOTAL SHARES",   val: allShares.toFixed(0),    sub: `${exShares > 0 ? exShares.toFixed(0) + " existing" : ""}${exShares > 0 && totShares > 0 ? " + " : ""}${totShares > 0 ? totShares.toFixed(0) + " adds" : ""}`, col: "#46aad9" },
                { label: "BLENDED BASIS",  val: `$${blendedAll.toFixed(2)}`, sub: blendedAll > NOW_PRICE ? `underwater $${(blendedAll - NOW_PRICE).toFixed(2)}` : `up $${(NOW_PRICE - blendedAll).toFixed(2)}`, col: blendedAll <= NOW_PRICE ? "#66b278" : "#c59542" },
                { label: "BEAR CASE LOSS", val: `-$${Math.abs(posBearLoss).toLocaleString(undefined,{maximumFractionDigits:0})}`, sub: `${posBearLossPct}% of $${portfolioK}K portfolio`, col: "#dd817a" },
              ].map(({ label, val, sub, col }) => (
                <div key={label} style={{ flex: 1, padding: "8px 10px", borderRadius: 6,
                  background: "var(--panel-bg)", border: "1px solid var(--bd2)", textAlign: "center" }}>
                  <div style={{ fontSize: 8, color: "var(--tx6)", letterSpacing: "0.1em", marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: col }}>{val}</div>
                  <div style={{ fontSize: 9, color: "var(--tx7)", marginTop: 2 }}>{sub}</div>
                </div>
              ))}
            </div>
            <div style={{ height: 5, background: "var(--deep-bg)", borderRadius: 3, overflow: "hidden", marginBottom: 4 }}>
              <div style={{ height: "100%", width: `${Math.min(100, posAbsLoss / 10 * 100)}%`,
                background: posAbsLoss > 5 ? "#dd817a" : posAbsLoss > 2 ? "#c59542" : "#66b278",
                borderRadius: 3, transition: "width .2s" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 8.5, color: "var(--tx7)", marginBottom: 6 }}>
              <span style={{ color: "#66b278" }}>comfortable &lt;2%</span>
              <span style={{ color: "#c59542" }}>watch 2–5%</span>
              <span style={{ color: "#dd817a" }}>size down &gt;5%</span>
            </div>
            <div style={{ fontSize: 10, color: "var(--tx5)", lineHeight: 1.5 }}>
              {posAbsLoss > 5 ? "Bear case hits hard — consider halving the position size."
                : posAbsLoss > 2 ? "Manageable. Make sure you can sit through this without panic-selling."
                : "Comfortable size. Room to add a second tranche without blowing limits."}
            </div>
          </div>
        )}
        <Footnote text={TEXT.future.downsideFootnote(NOW_PRICE, VAL_CONFIG.pe_trough, VAL_CONFIG.pe_bear_hi)} />
      </div>
    );
  };

  // ── SIGNAL panel ──────────────────────────────────────────────────────────
  const SignalPanel = () => {
    const peNow    = parseFloat(currentPE);
    const peRange  = VAL_CONFIG.pe_peak - VAL_CONFIG.pe_trough;
    const pePct    = (v) => ((v - VAL_CONFIG.pe_trough) / peRange * 100).toFixed(1);
    const peNowPct = pePct(peNow);

    const zones = [
      { label: "DEEP VALUE",  lo: VAL_CONFIG.pe_trough,    hi: VAL_CONFIG.pe_bear_hi,    col: "#66b278", opacity: 0.25 },
      { label: "BEAR ZONE",   lo: VAL_CONFIG.pe_bear_hi,   hi: VAL_CONFIG.pe_normal_lo,  col: "#c59542", opacity: 0.15 },
      { label: "FAIR VALUE",  lo: VAL_CONFIG.pe_normal_lo, hi: VAL_CONFIG.pe_normal_hi,  col: "#c59542", opacity: 0.25 },
      { label: "BULL ZONE",   lo: VAL_CONFIG.pe_normal_hi, hi: VAL_CONFIG.pe_bull_lo,    col: "#c59542", opacity: 0.15 },
      { label: "EXPENSIVE",   lo: VAL_CONFIG.pe_bull_lo,   hi: VAL_CONFIG.pe_peak,       col: "#dd817a", opacity: 0.25 },
    ];

    const priceZone = peNow <= VAL_CONFIG.pe_bear_hi
      ? { label: "DEEP VALUE", col: "#66b278", desc: "Historically cheap multiple — rare entry" }
      : peNow <= VAL_CONFIG.pe_normal_lo
      ? { label: "BELOW FAIR", col: "#66b278", desc: "Below normal historical range" }
      : peNow <= VAL_CONFIG.pe_normal_hi
      ? { label: "FAIR VALUE", col: "#c59542", desc: "Inside normal historical band" }
      : peNow <= VAL_CONFIG.pe_bull_lo
      ? { label: "ABOVE FAIR", col: "#dd817a", desc: "Above normal — priced for good execution" }
      : { label: "EXPENSIVE",  col: "#dd817a", desc: "Premium multiple — high execution bar" };

    return (
      <div>
        <Banner
          status={`MULTIPLE: ${peNow}× NTM P/E — ${priceZone.label}`}
          desc={priceZone.desc}
          col={priceZone.col}
          summary={TEXT.future.multipleSummary(peNow, VAL_CONFIG.pe_normal_lo, VAL_CONFIG.pe_normal_hi)}
        />

        {/* P/E bar */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.12em", color: "var(--tx6)", marginBottom: 6 }}>
            FORWARD P/E vs 10-YEAR RANGE ({VAL_CONFIG.pe_trough}×–{VAL_CONFIG.pe_peak}×)
          </div>
          <div {...tip("NTM P/E vs 10-Year Range", `Forward P/E = stock price ÷ next-12-month EPS. At $${NOW_PRICE} and $${VAL_CONFIG.ntm_eps} NTM EPS, P/E = ${currentPE}×. Historical zones: deep value (${VAL_CONFIG.pe_trough}–${VAL_CONFIG.pe_bear_hi}×), fair value (${VAL_CONFIG.pe_normal_lo}–${VAL_CONFIG.pe_normal_hi}×), expensive (${VAL_CONFIG.pe_bull_lo}–${VAL_CONFIG.pe_peak}×). ${TEXT.future.peBarTipSuffix}`, null, "var(--tx3)")} style={{ position: "relative", height: 24, borderRadius: 4, overflow: "hidden",
            display: "flex", border: "1px solid var(--bd)" }}>
            {zones.map(z => (
              <div key={z.label} {...tip(z.label, `${z.label}: ${z.lo}–${z.hi}× NTM P/E. ${z.label === "DEEP VALUE" ? TEXT.future.deepValueZoneNote : z.label === "FAIR VALUE" ? `Normal historical range (${z.lo}–${z.hi}×). Neither cheap nor expensive. Reasonable entry for long-term holders.` : z.label === "EXPENSIVE" ? "Premium multiple. The stock is pricing in bull-case execution. Limited margin of safety." : "Transitional zone between fair value and adjacent zones."}`, null, z.col)} style={{
                width: `${((z.hi - z.lo) / peRange) * 100}%`,
                background: z.col, opacity: z.opacity,
              }} />
            ))}
            {/* NOW marker */}
            <div style={{ position: "absolute", top: 0, bottom: 0, left: `${peNowPct}%`,
              width: 2, background: "var(--title)", boxShadow: "0 0 6px var(--title)" }} />
            <div style={{ position: "absolute", top: "50%", left: `${peNowPct}%`,
              transform: "translate(-50%,-50%)", width: 8, height: 8, borderRadius: "50%",
              background: priceZone.col, boxShadow: `0 0 8px ${priceZone.col}` }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3,
            fontSize: 8.5, color: "var(--tx7)" }}>
            <span>{VAL_CONFIG.pe_trough}× (TROUGH)</span>
            <span style={{ color: priceZone.col, fontWeight: 700 }}>NOW {peNow}×</span>
            <span>{VAL_CONFIG.pe_peak}× (PEAK)</span>
          </div>
        </div>

        {/* Dislocation signal */}
        <div {...tip("Dislocation Signal", `A dislocation occurs when a short-term event (earnings miss, macro shock, sector rotation) causes a stock to trade materially below its intrinsic value for a temporary window. ${TEXT.future.dislocEventName} is the most recent event. ${dislocDays} days later, the stock is ${NOW_PRICE < REVERSION_BASEFLOOR ? "still below the base floor of $" + REVERSION_BASEFLOOR + " — the dislocation window is open." : "well past the base floor of $" + REVERSION_BASEFLOOR + " and at a new all-time high."}`, `Historical precedent: the dislocation resolved within the ${REVERSION_PRECEDENT_DAYS}-day base-reversion window.`, dislocSignal.col)} style={{ padding: "10px 14px", borderRadius: 6, marginBottom: 12,
          background: `${dislocSignal.col}12`, border: `1px solid ${dislocSignal.col}44` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 9, letterSpacing: "0.12em", color: dislocSignal.col, marginBottom: 3 }}>
                {dislocSignal.label}
              </div>
              <div style={{ fontSize: 10, color: "var(--tx5)" }}>{dislocSignal.sub}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: dislocSignal.col }}>{dislocDays}d</div>
              <div style={{ fontSize: 8.5, color: "var(--tx7)" }}>{TEXT.future.dislocLabel}</div>
            </div>
          </div>
          <div style={{ marginTop: 8, fontSize: 9.5, color: "var(--tx6)", lineHeight: 1.55 }}>
            {TEXT.future.dislocPrecedent(REVERSION_BASEFLOOR)}
          </div>
        </div>

        {/* Price zone with position dots */}
        <div style={{ padding: "10px 14px", background: "var(--inner-bg)", borderRadius: 6,
          border: "1px solid var(--bd2)", marginBottom: 12 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.12em", color: "var(--tx6)", marginBottom: 10 }}>
            PRICE ZONE{allShares > 0 ? " — YOUR POSITION VS BANDS" : ""}
          </div>
          <div style={{ position: "relative", height: 28, marginBottom: 6 }}>
            <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 6,
              transform: "translateY(-50%)", background: "var(--deep-bg)", borderRadius: 3, border: "1px solid var(--bd)" }} />
            {PRICE_ZONES.map(({ label, lo, hi, color, action }) => (
              <div key={label} {...tip(`${label} ($${lo}–$${hi})`, action, null, color)}
                style={{ position: "absolute", top: "50%", left: visPct(lo), width: visW(lo, hi),
                  height: 6, transform: "translateY(-50%)", background: `${color}55`,
                  border: `1px solid ${color}88`, borderRadius: 2 }} />
            ))}
            {exBasis > VIS_LO && exBasis < VIS_HI && (
              <div {...tip("Existing position basis", `Pre-thesis entry at $${exBasis.toFixed(2)} · ${exShares.toFixed(0)} shares · $${exCost.toLocaleString(undefined,{maximumFractionDigits:0})} total`, null, "#46aad9")}
                style={{ position: "absolute", top: "50%", left: visPct(exBasis), transform: "translate(-50%,-50%)",
                  width: 12, height: 12, borderRadius: "50%", background: "#46aad9",
                  border: "2px solid var(--panel-bg)", boxShadow: "0 0 8px #46aad9", zIndex: 4 }} />
            )}
            {blendedAll > VIS_LO && blendedAll < VIS_HI && allShares > exShares && (
              <div {...tip("Combined blended basis", `Avg cost $${blendedAll.toFixed(2)} across all ${allShares.toFixed(0)} shares (existing + thesis adds)`, null, "var(--blue-soft)")}
                style={{ position: "absolute", top: "50%", left: visPct(blendedAll), transform: "translate(-50%,-50%)",
                  width: 14, height: 14, borderRadius: "50%", background: "var(--blue-soft)",
                  border: "2px solid var(--panel-bg)", boxShadow: "0 0 10px var(--blue-soft)", zIndex: 5 }} />
            )}
            <div {...tip(`Current price $${NOW_PRICE}`, NOW_PRICE < GEOM.nowZoneLo ? "Below base floor — dislocation window open" : NOW_PRICE <= GEOM.nowZoneHi ? "Inside base band — fair value territory" : "Above base — price stretched", null, "#46aad9")}
              style={{ position: "absolute", top: "50%", left: visPct(NOW_PRICE), transform: "translate(-50%,-50%)",
                width: 10, height: 10, borderRadius: "50%", background: "#46aad944",
                border: "2px solid #46aad9", boxShadow: "0 0 8px #46aad9", zIndex: 6 }} />
            <div style={{ position: "absolute", top: -16, left: visPct(NOW_PRICE), transform: "translateX(-50%)",
              fontSize: 8.5, color: "#46aad9", fontWeight: 700, whiteSpace: "nowrap" }}>NOW ${NOW_PRICE}</div>
            {exBasis > VIS_LO && exBasis < VIS_HI && Math.abs(exBasis - NOW_PRICE) > 5 && (
              <div style={{ position: "absolute", top: 20, left: visPct(exBasis), transform: "translateX(-50%)",
                fontSize: 8.5, color: "#46aad9", whiteSpace: "nowrap" }}>BASIS ${exBasis.toFixed(0)}</div>
            )}
            {blendedAll > VIS_LO && blendedAll < VIS_HI && allShares > exShares && Math.abs(blendedAll - NOW_PRICE) > 5 && (
              <div style={{ position: "absolute", top: 20, left: visPct(blendedAll), transform: "translateX(-50%)",
                fontSize: 8.5, color: "var(--blue-soft)", fontWeight: 700, whiteSpace: "nowrap" }}>COMBINED ${blendedAll.toFixed(0)}</div>
            )}
          </div>
          <div style={{ position: "relative", height: 22 }}>
            {PRICE_ZONES.map(({ label, lo, hi, color }) => (
              <div key={label} style={{ position: "absolute", left: `${visC(lo, hi).toFixed(1)}%`,
                transform: "translateX(-50%)", textAlign: "center", fontSize: 8.5,
                color, fontWeight: 700, letterSpacing: "0.04em" }}>{label}</div>
            ))}
          </div>
        </div>

        {/* FCF yield */}
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { label: "FCF YIELD", val: `${fcfYield}%`, sub: `$${VAL_CONFIG.fcf_ntm_b}B NTM FCF`, col: "#66b278", tipTitle: "FCF Yield", tipBody: `Free Cash Flow Yield = NTM FCF ÷ Market Cap. At $${fcfYield}%, every $100 invested in ${TICKER} generates $${fcfYield} of real cash per year — before it is deployed into dividends, buybacks, or further capex. A higher yield = cheaper stock relative to cash generation. Current: $${VAL_CONFIG.fcf_ntm_b}B FCF ÷ $${(NOW_PRICE * VAL_CONFIG.shares_b).toFixed(0)}B market cap.` },
            { label: "10Y TREASURY", val: `${VAL_CONFIG.risk_free_pct}%`, sub: "risk-free rate", col: "var(--tx6)", tipTitle: "10-Year Treasury Yield", tipBody: `The risk-free rate: what you earn on US Treasuries — the safest alternative. At ${VAL_CONFIG.risk_free_pct}%, this is the baseline. Any equity investment must clear this hurdle plus a risk premium. When rates are high, equities are relatively less attractive.` },
            { label: "SPREAD", val: `+${(parseFloat(fcfYield) - VAL_CONFIG.risk_free_pct).toFixed(2)}%`, sub: "FCF yield vs risk-free", col: parseFloat(fcfYield) > VAL_CONFIG.risk_free_pct ? "#66b278" : "#dd817a", tipTitle: "Equity Risk Premium (FCF spread)", tipBody: `Spread = FCF Yield − 10Y Treasury. Positive spread means equities offer extra return vs risk-free. At +${(parseFloat(fcfYield) - VAL_CONFIG.risk_free_pct).toFixed(2)}%, ${TICKER}'s FCF yield beats Treasuries by ${(parseFloat(fcfYield) - VAL_CONFIG.risk_free_pct).toFixed(2)} points. A thin spread here reflects reinvestment, not necessarily overvaluation.` },
          ].map(({ label, val, sub, col, tipTitle, tipBody }) => (
            <div key={label} {...tip(tipTitle, tipBody, null, col)} style={{ flex: 1, padding: "8px 10px", borderRadius: 6,
              background: "var(--inner-bg)", border: "1px solid var(--bd2)", textAlign: "center" }}>
              <div style={{ fontSize: 8, color: "var(--tx6)", letterSpacing: "0.1em", marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: col }}>{val}</div>
              <div style={{ fontSize: 9, color: "var(--tx7)", marginTop: 2 }}>{sub}</div>
            </div>
          ))}
        </div>
        <Footnote text={TEXT.future.signalFootnote(VAL_CONFIG.ntm_eps)} />
      </div>
    );
  };

  // ── CAPITAL panel ─────────────────────────────────────────────────────────
  const CapitalPanel = () => {
    const modes = [
      { label: "EXPLORE",  range: "$100–200",  desc: "Skin in the game — pre-conviction scouting" },
      { label: "NIBBLE",   range: "$200–400",  desc: "Thesis forming — preserve dry powder" },
      { label: "ADD",      range: "$400–600",  desc: "Thesis intact — normal cadence" },
      { label: "DEPLOY",   range: "$600–800+", desc: "Dislocation + high conviction — war chest moment" },
    ];
    const activeModeLabel = deployMode.label === "EXIT" ? null : deployMode.label;

    return (
      <div>
        <Banner
          status={`WAR CHEST: $${warChest.toLocaleString()} SAVED`}
          desc={`$${totalDeployed.toLocaleString()} deployed this cycle across tickers`}
          col={warChest >= 400 ? "#66b278" : warChest >= 200 ? "#c59542" : "#dd817a"}
          summary={`Suggested mode: ${deployMode.label}${deployMode.range ? " (" + deployMode.range + ")" : ""}. ${deployMode.sub}.`}
        />

        {/* Deployment mode spectrum */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.12em", color: "var(--tx6)", marginBottom: 7 }}>DEPLOYMENT MODE</div>
          <div style={{ display: "flex", gap: 6 }}>
            {modes.map(m => {
              const isActive = m.label === activeModeLabel;
              const col = m.label === "EXPLORE" ? "#46aad9"
                : m.label === "NIBBLE"  ? "#c59542"
                : m.label === "ADD"     ? "#66b278"
                : "#66b278";
              return (
                <div key={m.label} {...tip(m.label + " mode", `${m.desc}. Range: ${m.range}. ${m.label === "EXPLORE" ? "Stanley Druckenmiller style: put a small stake on before your research is complete. Forces you to pay attention and form a real view." : m.label === "NIBBLE" ? "Thesis is still forming. Keep powder dry for the moment you have high conviction. Small size protects you if you are wrong on the read." : m.label === "ADD" ? "Thesis intact, price fair or below fair. Normal cadence — add without requiring a dislocation discount. Typical routine sizing." : "Rare. Reserved for when thesis is intact AND price has dislocated materially. This is the war chest moment — size up decisively."}`, isActive ? "This is your current recommended mode." : null, col)} style={{ flex: 1, padding: "8px 6px", borderRadius: 6, textAlign: "center",
                  background: isActive ? `${col}22` : "var(--inner-bg)",
                  border: `1px solid ${isActive ? col : "var(--bd2)"}`,
                  boxShadow: isActive ? `0 0 10px ${col}44` : "none" }}>
                  <div style={{ fontSize: 8.5, fontWeight: 700, color: isActive ? col : "var(--tx7)", letterSpacing: "0.08em" }}>{m.label}</div>
                  <div style={{ fontSize: 8, color: isActive ? col : "var(--tx9)", marginTop: 2 }}>{m.range}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cycle tracker table */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <div style={{ fontSize: 9, letterSpacing: "0.12em", color: "var(--tx6)" }}>CYCLE LOG</div>
            <div style={{ display: "flex", gap: 6 }}>
              <button aria-label="Open dry powder cycle settings" onClick={() => { setSettingsForm({ cycleAmount: store.cycleAmount, cycleDays: store.cycleDays }); setSettingsOpen(!settingsOpen); }}
                style={{ fontSize: 8, padding: "3px 8px", borderRadius: 3, border: "1px solid var(--bd2)",
                  background: "var(--btn-bg)", color: "var(--tx5)", cursor: "pointer", letterSpacing: "0.08em" }}>
                ⚙ SETTINGS
              </button>
              <button aria-label="Log a new dry powder cycle" onClick={openAdd}
                style={{ fontSize: 8, padding: "3px 8px", borderRadius: 3, border: "1px solid #66b27855",
                  background: "rgba(63,208,122,0.12)", color: "#66b278", cursor: "pointer", letterSpacing: "0.08em" }}>
                + ADD CYCLE
              </button>
            </div>
          </div>

          {/* Settings popover */}
          {settingsOpen && (
            <div style={{ padding: "10px 12px", borderRadius: 6, background: "var(--inner-bg)",
              border: "1px solid var(--bd2)", marginBottom: 8 }}>
              <div style={{ fontSize: 9, color: "var(--tx6)", marginBottom: 6 }}>CYCLE DEFAULTS</div>
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 8.5, color: "var(--tx7)", marginBottom: 2 }}>Target per cycle ($)</div>
                  <input type="number" value={settingsForm.cycleAmount}
                    onChange={e => setSettingsForm(s => ({ ...s, cycleAmount: e.target.value }))}
                    style={{ width: "100%", padding: "4px 6px", background: "var(--input-bg)",
                      border: "1px solid var(--bd2)", borderRadius: 3, color: "var(--title)",
                      fontSize: 10, outline: "none", fontFamily: "inherit" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 8.5, color: "var(--tx7)", marginBottom: 2 }}>Cycle length (days)</div>
                  <input type="number" value={settingsForm.cycleDays}
                    onChange={e => setSettingsForm(s => ({ ...s, cycleDays: e.target.value }))}
                    style={{ width: "100%", padding: "4px 6px", background: "var(--input-bg)",
                      border: "1px solid var(--bd2)", borderRadius: 3, color: "var(--title)",
                      fontSize: 10, outline: "none", fontFamily: "inherit" }} />
                </div>
              </div>
              <button aria-label="Save cycle settings" onClick={saveSettings}
                style={{ padding: "4px 12px", borderRadius: 3, border: "1px solid #66b27855",
                  background: "rgba(63,208,122,0.12)", color: "#66b278", cursor: "pointer",
                  fontSize: 9, letterSpacing: "0.08em" }}>SAVE</button>
            </div>
          )}

          {/* Add/Edit form */}
          {editingCycle !== null && (
            <div style={{ padding: "10px 12px", borderRadius: 6, background: "var(--inner-bg)",
              border: "1px solid #66b27844", marginBottom: 8 }}>
              <div style={{ fontSize: 9, color: "#66b278", marginBottom: 6, letterSpacing: "0.1em" }}>
                {editingCycle === "new" ? "LOG NEW CYCLE" : "EDIT CYCLE"}
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
                {[
                  { key: "date",     label: "Date",         type: "date",   w: 140 },
                  { key: "deployed", label: "Deployed ($)", type: "number", w: 110 },
                  { key: "saved",    label: "Saved ($)",    type: "number", w: 110 },
                  { key: "note",     label: "Note",         type: "text",   w: 180 },
                ].map(f => (
                  <div key={f.key}>
                    <div style={{ fontSize: 8, color: "var(--tx7)", marginBottom: 2 }}>{f.label}</div>
                    <input type={f.type} value={cycleForm[f.key]}
                      onChange={e => setCycleForm(s => ({ ...s, [f.key]: e.target.value }))}
                      style={{ width: f.w, padding: "4px 6px", background: "var(--input-bg)",
                        border: "1px solid var(--bd2)", borderRadius: 3, color: "var(--title)",
                        fontSize: 10, outline: "none", fontFamily: "inherit" }} />
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button aria-label="Save cycle entry" onClick={saveForm}
                  style={{ padding: "4px 12px", borderRadius: 3, border: "1px solid #66b27855",
                    background: "rgba(63,208,122,0.12)", color: "#66b278", cursor: "pointer",
                    fontSize: 9 }}>SAVE</button>
                <button aria-label="Cancel cycle edit" onClick={() => setEditingCycle(null)}
                  style={{ padding: "4px 12px", borderRadius: 3, border: "1px solid var(--bd2)",
                    background: "var(--btn-bg)", color: "var(--tx6)", cursor: "pointer", fontSize: 9 }}>CANCEL</button>
              </div>
            </div>
          )}

          {/* Cycle rows */}
          {store.cycles.length === 0 ? (
            <div style={{ padding: "14px", textAlign: "center", fontSize: 10, color: "var(--tx7)",
              background: "var(--inner-bg)", borderRadius: 6, border: "1px solid var(--bd2)" }}>
              No cycles logged yet. Click + ADD CYCLE to start tracking.
            </div>
          ) : (
            <div style={{ borderRadius: 6, border: "1px solid var(--bd2)", overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "90px 80px 80px 1fr 52px",
                padding: "5px 10px", background: "var(--th-bg)", fontSize: 8.5,
                letterSpacing: "0.08em", color: "var(--tx7)" }}>
                <span {...tip("Cycle date", "The date of this funding cycle. A cycle is one paycheck, cash transfer, or other regular deployment event.", null, "var(--tx5)")}>DATE</span>
                <span {...tip("Deployed this cycle ($)", "Total capital put to work across ALL tickers this cycle. Future portfolio page will show the ticker breakdown.", null, "#66b278")}>DEPLOYED</span>
                <span {...tip("Saved this cycle ($)", "Capital set aside but NOT yet deployed — your dry powder. Saved amounts accumulate into your war chest and inform the deployment mode recommendation.", null, "#c59542")}>SAVED</span>
                <span {...tip("Cycle note", "Optional note: what was your reasoning? What was market conditions like? Great for review later — 'why did I deploy here vs hold?'", null, "var(--tx5)")}>NOTE</span>
                <span />
              </div>
              {store.cycles.map((c, i) => (
                <div key={c.id} style={{ display: "grid", gridTemplateColumns: "90px 80px 80px 1fr 52px",
                  padding: "6px 10px", fontSize: 10, color: "var(--tx4)",
                  borderTop: i > 0 ? "1px solid var(--bd)" : "none",
                  background: i % 2 === 0 ? "var(--inner-bg)" : "var(--panel-bg)" }}>
                  <span style={{ color: "var(--tx5)" }}>{c.date}</span>
                  <span style={{ color: "#66b278" }}>${(parseFloat(c.deployed) || 0).toLocaleString()}</span>
                  <span style={{ color: "#c59542" }}>${(parseFloat(c.saved) || 0).toLocaleString()}</span>
                  <span style={{ color: "var(--tx6)", fontSize: 9 }}>{c.note || "—"}</span>
                  <span style={{ display: "flex", gap: 4 }}>
                    <button aria-label="Edit this cycle" onClick={() => openEdit(c)}
                      style={{ fontSize: 8, padding: "2px 5px", borderRadius: 2, border: "1px solid var(--bd2)",
                        background: "var(--btn-bg)", color: "var(--tx5)", cursor: "pointer" }}>✎</button>
                    <button aria-label="Delete this cycle" onClick={() => deleteCycle(c.id)}
                      style={{ fontSize: 8, padding: "2px 5px", borderRadius: 2, border: "1px solid rgba(241,86,75,0.3)",
                        background: "rgba(241,86,75,0.08)", color: "#dd817a", cursor: "pointer" }}>×</button>
                  </span>
                </div>
              ))}
              {/* Totals row */}
              <div style={{ display: "grid", gridTemplateColumns: "90px 80px 80px 1fr 52px",
                padding: "6px 10px", borderTop: "1px solid var(--bd2)", fontSize: 10,
                fontWeight: 700, background: "var(--th-bg)" }}>
                <span style={{ color: "var(--tx6)", fontSize: 8.5, letterSpacing: "0.08em" }}>TOTAL</span>
                <span style={{ color: "#66b278" }}>${totalDeployed.toLocaleString()}</span>
                <span style={{ color: "#c59542" }}>${totalSaved.toLocaleString()}</span>
                <span />
                <span />
              </div>
            </div>
          )}
        </div>

        {/* Bull trigger */}
        <div {...tip("Regret minimisation", TEXT.future.regretTip, "If you cannot answer this question, your position is sized correctly at zero until you can.", "#66b278")} style={{ padding: "10px 14px", borderRadius: 6, background: "rgba(63,208,122,0.06)",
          border: "1px solid rgba(63,208,122,0.25)", marginBottom: 8 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.12em", color: "#66b278", marginBottom: 4 }}>WHAT WOULD MAKE ME REGRET NOT DEPLOYING?</div>
          <div style={{ fontSize: 10.5, color: "var(--tx4)", lineHeight: 1.6 }}
            dangerouslySetInnerHTML={{ __html: TEXT.future.regretHtml(currentPE) }} />
        </div>

        {/* ── MY POSITION ─────────────────────────────────────────────── */}
        <div style={{ marginTop: 16, borderTop: "1px solid var(--bd)", paddingTop: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontSize: 9, letterSpacing: "0.12em", color: "var(--tx6)" }}>MY {TICKER} POSITION</div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ fontSize: 9, color: flash ? "#66b278" : "transparent", transition: "color .3s", letterSpacing: "0.1em" }}>✓ SAVED</span>
              {clearPending
                ? <>
                    <button aria-label="Confirm: clear all position data" onClick={clearPos} style={{ fontSize: 8, padding: "3px 8px", borderRadius: 3, border: "1px solid rgba(241,86,75,0.7)", background: "rgba(241,86,75,0.18)", color: "#dd817a", cursor: "pointer", letterSpacing: "0.08em" }}>CONFIRM CLEAR</button>
                    <button aria-label="Cancel clear" onClick={() => setClearPending(false)} style={{ fontSize: 8, padding: "3px 8px", borderRadius: 3, border: "1px solid var(--bd2)", background: "transparent", color: "var(--tx5)", cursor: "pointer", letterSpacing: "0.08em" }}>CANCEL</button>
                  </>
                : <button aria-label="Clear all position data" onClick={() => setClearPending(true)} style={{ fontSize: 8, padding: "3px 8px", borderRadius: 3, border: "1px solid rgba(241,86,75,0.3)", background: "rgba(241,86,75,0.08)", color: "#dd817a", cursor: "pointer", letterSpacing: "0.08em" }}>CLEAR</button>
              }
            </div>
          </div>

          {/* Existing position */}
          <div style={{ padding: "10px 12px", background: "rgba(70,170,217,0.06)",
            border: "1px solid rgba(70,170,217,0.22)", borderRadius: 6, marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: 9.5, letterSpacing: "0.12em", color: "#46aad9", fontWeight: 700 }}>EXISTING · PRE-THESIS</div>
              <button aria-label="Add existing position entry row" onClick={addExisting} style={{ background: "transparent", border: "1px solid rgba(70,170,217,0.35)",
                borderRadius: 4, padding: "3px 10px", cursor: "pointer", fontSize: 9.5,
                color: "#46aad9", fontFamily: FONT_MONO, letterSpacing: "0.08em" }}>+ ADD ROW</button>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(70,170,217,0.22)" }}>
                  {["PRICE ($)", "SHARES", "VALUE", "DATE", ""].map((h, i) => (
                    <th key={i} style={{ padding: "3px 6px",
                      textAlign: i < 3 ? "right" : i === 3 ? "right" : "center",
                      color: "#46aad988", fontSize: 9, letterSpacing: "0.1em",
                      fontWeight: 400, paddingBottom: 6 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {existing.map((e) => {
                  const ev = +e.price * +e.shares;
                  const hasV = +e.price > 0 && +e.shares > 0;
                  return (
                    <tr key={e.id} style={{ borderBottom: "1px solid rgba(70,170,217,0.12)" }}>
                      <td style={{ padding: "4px 6px", width: 80 }}>
                        <input type="number" value={e.price}
                          onChange={ev2 => updateEx(e.id, "price", ev2.target.value)}
                          placeholder="—" style={{ ...posInputStyle, accentColor: "#46aad9" }} />
                      </td>
                      <td style={{ padding: "4px 6px", width: 70 }}>
                        <input type="number" value={e.shares}
                          onChange={ev2 => updateEx(e.id, "shares", ev2.target.value)}
                          placeholder="—" style={{ ...posInputStyle, accentColor: "#46aad9" }} />
                      </td>
                      <td style={{ padding: "6px", textAlign: "right", width: 76,
                        color: hasV ? "#46aad9" : "var(--tx8)", fontWeight: hasV ? 600 : 400 }}>
                        {hasV ? `$${ev.toLocaleString(undefined,{maximumFractionDigits:0})}` : "—"}
                      </td>
                      <td style={{ padding: "4px 6px", width: 110 }}>
                        <input type="date" value={e.date}
                          onChange={ev2 => updateEx(e.id, "date", ev2.target.value)}
                          style={{ ...posInputStyle, textAlign: "left", accentColor: "#46aad9" }} />
                      </td>
                      <td style={{ padding: "4px 6px", textAlign: "center", width: 22 }}>
                        <button aria-label="Remove this existing position entry" onClick={() => delExisting(e.id)}
                          style={{ background: "transparent", border: "none", cursor: "pointer",
                            color: existing.length > 1 ? "rgba(70,170,217,0.4)" : "var(--tx9)",
                            fontSize: 13, lineHeight: 1, padding: "0 2px", fontFamily: FONT_MONO }}>×</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {exBasis > 0 && (
              <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid rgba(70,170,217,0.2)",
                display: "flex", justifyContent: "space-between", fontSize: 10.5 }}>
                <span style={{ color: "#46aad988" }}>{exFilled.length} entr{exFilled.length === 1 ? "y" : "ies"} · {exShares.toFixed(0)} shares</span>
                <span style={{ color: "#46aad9", fontWeight: 700 }}>avg ${exBasis.toFixed(2)} · ${exCost.toLocaleString(undefined,{maximumFractionDigits:0})}</span>
              </div>
            )}
          </div>

          {/* Thesis-driven adds */}
          <div style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: 9.5, letterSpacing: "0.12em", color: "var(--tx5)", fontWeight: 700 }}>THESIS-DRIVEN ADDS</div>
              <button aria-label="Add thesis-driven buy tranche row" onClick={addTranche} style={{ background: "transparent", border: "1px solid var(--bd2)",
                borderRadius: 4, padding: "3px 10px", cursor: "pointer", fontSize: 9.5,
                color: "var(--tx4)", fontFamily: FONT_MONO, letterSpacing: "0.08em" }}>+ ADD ROW</button>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--bd)" }}>
                  {["LABEL", "PRICE ($)", "SHARES", "VALUE", "DATE", ""].map((h, i) => (
                    <th key={i} style={{ padding: "3px 6px",
                      textAlign: i === 0 ? "left" : i === 5 ? "center" : "right",
                      color: "var(--tx6)", fontSize: 9, letterSpacing: "0.1em",
                      fontWeight: 400, paddingBottom: 6 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tranches.map((t) => {
                  const tv = +t.price * +t.shares;
                  const hasV = +t.price > 0 && +t.shares > 0;
                  return (
                    <tr key={t.id} style={{ borderBottom: "1px solid var(--bd)" }}>
                      <td style={{ padding: "4px 6px", minWidth: 76 }}>
                        <input value={t.label}
                          onChange={e => updateT(t.id, "label", e.target.value)}
                          style={{ ...posInputStyle, textAlign: "left", fontSize: 10,
                            fontWeight: 600, color: "var(--tx3)", width: "100%" }} />
                      </td>
                      <td style={{ padding: "4px 6px", width: 80 }}>
                        <input type="number" value={t.price}
                          onChange={e => updateT(t.id, "price", e.target.value)}
                          placeholder="—" style={posInputStyle} />
                      </td>
                      <td style={{ padding: "4px 6px", width: 70 }}>
                        <input type="number" value={t.shares}
                          onChange={e => updateT(t.id, "shares", e.target.value)}
                          placeholder="—" style={posInputStyle} />
                      </td>
                      <td style={{ padding: "6px", textAlign: "right", width: 76,
                        color: hasV ? "var(--tx2)" : "var(--tx8)", fontWeight: hasV ? 600 : 400 }}>
                        {hasV ? `$${tv.toLocaleString(undefined,{maximumFractionDigits:0})}` : "—"}
                      </td>
                      <td style={{ padding: "6px", textAlign: "right", fontSize: 9.5, color: "var(--tx6)", whiteSpace: "nowrap" }}>
                        {t.date || "—"}
                      </td>
                      <td style={{ padding: "4px 6px", textAlign: "center", width: 22 }}>
                        <button aria-label="Remove this buy tranche" onClick={() => deleteTranche(t.id)}
                          style={{ background: "transparent", border: "none", cursor: "pointer",
                            color: "var(--tx8)", fontSize: 13, lineHeight: 1,
                            padding: "0 2px", fontFamily: FONT_MONO }}>×</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Combined summary */}
          <div className="resp-3col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
            {[
              { label: "EXISTING",       shares: exShares,  cost: exCost,  basis: exBasis,   color: "#46aad9" },
              { label: "THESIS ADDS",    shares: totShares, cost: totCost, basis: blended,    color: "var(--tx3)" },
              { label: "COMBINED BASIS", shares: allShares, cost: allCost, basis: blendedAll, color: "var(--blue-soft)", hl: true },
            ].map(({ label, shares, cost, basis, color, hl }) => (
              <div key={label} style={{ padding: "8px 10px",
                background: hl ? "var(--inner-bg)" : "transparent",
                border: hl ? "1px solid var(--bd)" : "none", borderRadius: hl ? 6 : 0 }}>
                <div style={{ fontSize: 9, color: "var(--tx6)", letterSpacing: "0.1em", marginBottom: 3 }}>{label}</div>
                <div style={{ fontSize: hl ? 15 : 13, fontWeight: 700, color, marginBottom: 2 }}>
                  {basis > 0 ? `$${basis.toFixed(2)}` : "—"}
                </div>
                <div style={{ fontSize: 9, color: "var(--tx7)" }}>
                  {shares > 0 ? `${shares.toFixed(0)} sh · $${cost.toLocaleString(undefined,{maximumFractionDigits:0})}` : "no data"}
                </div>
              </div>
            ))}
          </div>

          {/* Sizing sliders + impact */}
          <div style={{ padding: "12px 14px", background: "var(--inner-bg)", border: "1px solid var(--bd)", borderRadius: 6, marginBottom: 10 }}>
            <div style={{ fontSize: 9, letterSpacing: "0.12em", color: "var(--tx6)", marginBottom: 10 }}>SIZING CHECK — CAN YOU SIT THROUGH BEAR?</div>
            <div style={{ display: "flex", gap: 16, marginBottom: 12, flexWrap: "wrap" }}>
              {[
                { label: "PORTFOLIO ($K)", val: portfolioK, set: setPortfolioK, min: 10, max: 5000, step: 10, fmt: v => `$${v.toLocaleString()}K` },
                { label: `${TICKER} POSITION (%)`, val: posPct, set: setPosPct, min: 0.5, max: 20, step: 0.5, fmt: v => `${v.toFixed(1)}%` },
              ].map(({ label, val, set, min, max, step, fmt }) => (
                <div key={label} style={{ flex: 1, minWidth: 140 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <div style={{ fontSize: 9, color: "var(--tx6)", letterSpacing: "0.1em" }}>{label}</div>
                    <div style={{ fontSize: 12, color: "var(--blue-soft)", fontWeight: 700 }}>{fmt(val)}</div>
                  </div>
                  <input type="range" min={min} max={max} step={step} value={val}
                    onChange={e => set(+e.target.value)}
                    style={{ width: "100%", accentColor: "var(--blue-soft)", cursor: "pointer" }} />
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
              <div style={{ padding: "8px 10px", background: "var(--panel-bg)", borderRadius: 5, border: "1px solid var(--bd2)" }}>
                <div style={{ fontSize: 8.5, color: "var(--tx6)", marginBottom: 2 }}>POSITION VALUE</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--tx2)" }}>${posPosVal.toLocaleString(undefined,{maximumFractionDigits:0})}</div>
              </div>
              <div style={{ padding: "8px 10px", background: "rgba(241,86,75,0.06)", borderRadius: 5, border: "1px solid rgba(241,86,75,0.22)" }}>
                <div style={{ fontSize: 8.5, color: "#dd817a99", marginBottom: 2 }}>BEAR CASE LOSS</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#dd817a" }}>-${Math.abs(posBearLoss).toLocaleString(undefined,{maximumFractionDigits:0})}</div>
                <div style={{ fontSize: 9, color: "var(--tx7)" }}>{posBearLossPct}% of portfolio</div>
              </div>
            </div>
            <div style={{ height: 5, background: "var(--deep-bg)", borderRadius: 3, overflow: "hidden", marginBottom: 4 }}>
              <div style={{ height: "100%", width: `${Math.min(100, posAbsLoss / 10 * 100)}%`,
                background: posAbsLoss > 5 ? "#dd817a" : posAbsLoss > 2 ? "#c59542" : "#66b278",
                borderRadius: 3, transition: "width .2s" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 8.5, color: "var(--tx7)", marginBottom: 6 }}>
              <span style={{ color: "#66b278" }}>comfortable &lt;2%</span>
              <span style={{ color: "#c59542" }}>watch 2–5%</span>
              <span style={{ color: "#dd817a" }}>size down &gt;5%</span>
            </div>
            <div style={{ fontSize: 10, color: "var(--tx4)", lineHeight: 1.6 }}>
              {posAbsLoss > 5 ? "Bear case hits hard — consider halving the position size."
                : posAbsLoss > 2 ? "Manageable. Make sure you can sit through this without panic-selling."
                : "Comfortable size. Room to add a second tranche without blowing limits."}
            </div>
          </div>

          {/* Thesis check toggles */}
          <div style={{ padding: "10px 12px", background: "var(--inner-bg)", border: "1px solid var(--bd)", borderRadius: 6 }}>
            <div style={{ fontSize: 9, letterSpacing: "0.12em", color: "var(--tx6)", marginBottom: 8 }}>THESIS CHECK — ALL MUST BE ✓ TO ADD</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {THESIS_ITEMS.map(({ key, label, note }) => {
                const on = checks[key];
                return (
                  <div key={key} onClick={() => toggle(key)}
                    {...tip(label, note, "Click to toggle.", on ? "#66b278" : "var(--tx5)")}
                    style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer",
                      padding: "7px 10px", borderRadius: 5, transition: "all .15s",
                      background: on ? "rgba(63,208,122,0.07)" : "var(--panel-bg)",
                      border: `1px solid ${on ? "rgba(63,208,122,0.28)" : "var(--bd)"}` }}>
                    <div style={{ width: 15, height: 15, borderRadius: 3, flexShrink: 0, marginTop: 2,
                      border: `2px solid ${on ? "#66b278" : "var(--bd2)"}`,
                      background: on ? "#66b278" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {on && <span style={{ color: "var(--page-bg)", fontSize: 9, fontWeight: 900 }}>✓</span>}
                    </div>
                    <div>
                      <div style={{ fontSize: 10.5, color: on ? "#66b278" : "var(--tx3)", fontWeight: on ? 600 : 400 }}>{label}</div>
                      <div style={{ fontSize: 9, color: "var(--tx6)", marginTop: 2 }}>{note}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 8, paddingTop: 6, borderTop: "1px solid var(--bd)",
              display: "flex", justifyContent: "space-between", fontSize: 10.5 }}>
              <span style={{ color: "var(--tx5)" }}>{greenCount} of {THESIS_ITEMS.length} confirmed</span>
              <span style={{ fontWeight: 700, color: allGreen ? "#66b278" : "#dd817a" }}>
                {allGreen ? "✓ THESIS INTACT" : "⚠ INCOMPLETE"}
              </span>
            </div>
          </div>
        </div>

        <Footnote text={`War chest = sum of 'Saved' entries across all logged cycles. Deployed = sum of 'Deployed' entries. Global across all tickers — future portfolio page will read this same key (th3sis_portfolio).`} />
      </div>
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ padding: "0 0 24px" }}>
      {/* ── Top scorecard grid ── */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 22px 0" }}>
        <div style={{ fontSize: 9, letterSpacing: "0.14em", color: "var(--tx7)", marginBottom: 10 }}>
          THE FUTURE · SHOULD I DEPLOY CAPITAL TO {TICKER} THIS CYCLE?
        </div>

        {/* 2×2 scorecards */}
        <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
          <ScoreCard
            tipTitle="If I'm right, what do I make?"
            tipBody={`Bull case: $${bullLo}–$${bullHi} range (+${bullPct}%). Base case: $${baseLo}–$${baseHi} range (${basePct >= 0 ? "+" : ""}${basePct}%). These are 12-month estimates based on EPS × multiple — hold loosely. Use the position calculator below to translate % returns into real dollar amounts based on your share count.`}
            question="IF I'M RIGHT, WHAT DO I MAKE?"
            answer={`BULL +${bullPct}% · BASE ${basePct >= 0 ? "+" : ""}${basePct}%`}
            detail={`Bull $${bullLo}–${bullHi} · Base $${baseLo}–${baseHi} · Bear $${bearLo}–${bearHi}`}
            col="#66b278"
            panelKey="outcomes"
          />
          <ScoreCard
            tipTitle="If I'm wrong, how much do I lose?"
            tipBody={`Bear case: $${bearLo}–$${bearHi} range (${bearPct}% from $${NOW_PRICE}). This assumes multiple compression to ${VAL_CONFIG.pe_trough}–${VAL_CONFIG.pe_bear_hi}× on roughly flat-to-down EPS — triggered by persistent revenue/margin guide misses or a new export-control/tariff escalation. Use the portfolio loss calculator in this panel to see the dollar impact on your specific position size.`}
            question="IF I'M WRONG, HOW MUCH DO I LOSE?"
            answer={`BEAR ${bearPct}% — $${bearLo}–${bearHi}`}
            detail={`Bear case: revenue/margin guide misses persist · Multiple compresses to ${VAL_CONFIG.pe_trough}–${VAL_CONFIG.pe_bear_hi}× · cross-strait risk escalates`}
            col="#dd817a"
            panelKey="downside"
          />
          <ScoreCard
            tipTitle="Is today's price a gift or a trap?"
            tipBody={`At ${currentPE}× NTM P/E, ${TICKER} trades ${parseFloat(currentPE) <= VAL_CONFIG.pe_normal_lo ? `below its historical fair value range (${VAL_CONFIG.pe_normal_lo}–${VAL_CONFIG.pe_normal_hi}×)` : parseFloat(currentPE) <= VAL_CONFIG.pe_normal_hi ? `inside its historical fair value range (${VAL_CONFIG.pe_normal_lo}–${VAL_CONFIG.pe_normal_hi}×)` : `above its historical fair value range (${VAL_CONFIG.pe_normal_lo}–${VAL_CONFIG.pe_normal_hi}×)`}. ${TEXT.future.dislocEventName} created the last real dislocation — ${dislocDays} days ago — and the stock has long since reclaimed the base floor of $${REVERSION_BASEFLOOR}. That dislocation resolved within the ${REVERSION_PRECEDENT_DAYS}-day precedent window once the thesis stayed intact.`}
            question="IS TODAY'S PRICE A GIFT OR A TRAP?"
            answer={`${parseFloat(currentPE)}× NTM P/E — ${parseFloat(currentPE) <= VAL_CONFIG.pe_normal_lo ? "BELOW FAIR" : parseFloat(currentPE) <= VAL_CONFIG.pe_normal_hi ? "FAIR VALUE" : "ABOVE FAIR"}`}
            detail={`${dislocSignal.label}: ${dislocDays}d since ${TEXT.future.dislocEventName} · Base floor $${REVERSION_BASEFLOOR}`}
            col={dislocSignal.col}
            panelKey="signal"
          />
          <ScoreCard
            tipTitle="What is my war chest?"
            tipBody={`War chest = cumulative 'Saved' capital from cycle log entries. Current: $${warChest.toLocaleString()} undeployed. Deployment mode: ${deployMode.label}${deployMode.range ? " (" + deployMode.range + ")" : ""} — ${deployMode.sub}. Modes: EXPLORE ($100–200, pre-conviction), NIBBLE ($200–400, thesis forming), ADD ($400–600, thesis intact), DEPLOY ($600–800+, dislocation + high conviction).`}
            question="WHAT IS MY WAR CHEST?"
            answer={`$${warChest.toLocaleString()} SAVED · MODE: ${deployMode.label}${deployMode.range ? " " + deployMode.range : ""}${blendedAll > 0 ? " · BASIS $" + blendedAll.toFixed(0) : ""}`}
            detail={blendedAll > 0 ? `${allShares.toFixed(0)} shares · avg $${blendedAll.toFixed(2)} · ${deployMode.sub}` : deployMode.sub}
            col={deployMode.col}
            panelKey="capital"
          />
        </div>

        {/* Verdict bar */}
        <div {...tip("THE FUTURE · Final Call", `The deployment verdict is driven by three inputs: (1) thesis health — are the buy reasons still true? (2) price zone — is NOW_PRICE below the base floor? (3) war chest — do you have dry powder to deploy? DEPLOY requires all three favourable. NIBBLE if price is right but thesis is WATCH. WAIT if price is stretched. EXIT if thesis is BROKEN.`, `Current mode: ${deployMode.label}. ${deployMode.sub}.`, deployMode.col)} style={{ padding: "14px 18px", borderRadius: 8, marginBottom: 16,
          background: `${deployMode.col}18`, border: `1px solid ${deployMode.col}55`,
          boxShadow: `0 0 20px ${deployMode.col}22` }}>
          <div style={{ fontSize: 8.5, letterSpacing: "0.14em", color: "var(--tx6)", marginBottom: 5 }}>
            THE FUTURE · FINAL CALL
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: deployMode.col, letterSpacing: "0.08em", marginBottom: 4 }}>
            {deployMode.label}{deployMode.range ? ` — ${deployMode.range}` : ""}
          </div>
          <div style={{ fontSize: 10.5, color: "var(--tx4)", lineHeight: 1.55, marginBottom: 10 }}>
            {deployMode.sub}
          </div>
          {/* Chips */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {TEXT.future.chips.map(({ label, col }) => (
              <div key={label} style={{ padding: "3px 8px", borderRadius: 20, fontSize: 8.5,
                background: `${col}18`, border: `1px solid ${col}44`, color: col,
                letterSpacing: "0.08em", fontWeight: 600 }}>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Chevron nav ── */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 22px", marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 0 }}>
          {chevrons.map(({ key, label, col, tipBody }, i) => {
            const on      = panel === key;
            const isFirst = i === 0;
            const isLast  = i === chevrons.length - 1;
            const clip    = isFirst
              ? "polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%)"
              : isLast
              ? "polygon(0 0, 100% 0, 100% 100%, 0 100%, 14px 50%)"
              : "polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%, 14px 50%)";
            return (
              <div key={key} onClick={() => setPanel(key)}
                {...(tipBody ? tip(label, tipBody, null, col) : {})}
                style={{ flex: 1, clipPath: clip, cursor: "pointer", transition: "background .15s",
                  background: on ? `${col}28` : "var(--inner-bg)",
                  border: on ? `1px solid ${col}66` : "1px solid var(--bd2)",
                  padding: isFirst ? "8px 22px 8px 14px" : isLast ? "8px 14px 8px 26px" : "8px 22px 8px 26px",
                  marginLeft: i > 0 ? -1 : 0 }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em",
                  color: on ? col : "var(--tx7)" }}>{label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Evidence panel ── */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 22px 0" }}>
        <div style={{ background: "var(--panel-bg)", border: "1px solid var(--bd2)",
          borderRadius: 8, padding: "16px 18px", minHeight: 320 }}>
          {panel === "outcomes" && <OutcomesPanel />}
          {panel === "downside" && <DownsidePanel />}
          {panel === "signal"   && <SignalPanel />}
          {panel === "capital"  && <CapitalPanel />}
        </div>
      </div>

      {/* Footer */}
      <div style={{ maxWidth: 1280, margin: "12px auto 0", padding: "0 22px",
        fontSize: 10.5, color: "var(--tx7)", lineHeight: 1.5 }}>
        Scenario returns are estimates based on consensus EPS × multiple. Not financial advice — hold all bands loosely. As of {AS_OF_DATE}.
      </div>
    </div>
  );
}

// ── THE PAST Tab ────────────────────────────────────────────────────────────────
function PastTab() {
  const [panel, setPanel] = useState("durability");
  const v = VAL_CONFIG;

  // ── Derived verdicts ──────────────────────────────────────────────────────
  const nY = PAST_YEARS.length;
  const revCAGR     = Math.pow(PAST_REV[nY - 1] / PAST_REV[0], 1 / (nY - 1)) - 1;
  const latestGM    = PAST_GM[nY - 1];
  const latestFCF   = PAST_FCF[nY - 1];
  const latestROIC  = PAST_ROIC[nY - 1];
  const latestCapex = PAST_CAPEX_REV[nY - 1];
  const peakCapex    = Math.max(...PAST_CAPEX_REV);
  const evAvg      = PAST_EVEBITDA.reduce((a, b) => a + b, 0) / PAST_EVEBITDA.length;
  const evNow      = v.peers.find(p => p.t === TICKER_META.ticker)?.ev_eb ?? PAST_EVEBITDA[nY - 1];

  const durabilityStatus = revCAGR > 0.12 && latestGM > 55
    ? { label: "STRONG",   desc: `${(revCAGR * 100).toFixed(0)}% ${nY - 1}Y REVENUE CAGR · ${latestGM}% GROSS MARGIN`, col: "#66b278" }
    : revCAGR > 0.06
    ? { label: "ADEQUATE", desc: `${(revCAGR * 100).toFixed(0)}% ${nY - 1}Y REVENUE CAGR`,                              col: "#c59542" }
    : { label: "WEAK",     desc: "GROWTH STALLED",                                                                col: "#dd817a" };

  const valueStatus = latestROIC > 15
    ? { label: "STRONG",   desc: `ROIC ${latestROIC}% · FCF $${latestFCF}B`,   col: "#66b278" }
    : latestROIC > 8
    ? { label: "ADEQUATE", desc: `ROIC ${latestROIC}% · ABOVE WACC`,                  col: "#c59542" }
    : { label: "WATCH",    desc: `ROIC ${latestROIC}% · NEAR OR BELOW WACC`,          col: "#dd817a" };

  const capexStatus = latestCapex < 35 && latestFCF > PAST_FCF[nY - 2]
    ? { label: "DISCIPLINED", desc: `${latestCapex}% CAPEX/REVENUE · DOWN FROM ${peakCapex}% PEAK`, col: "#66b278" }
    : latestCapex < 45
    ? { label: "ELEVATED",    desc: `${latestCapex}% CAPEX/REVENUE · WATCH FCF`,                    col: "#c59542" }
    : { label: "AGGRESSIVE",  desc: `${latestCapex}% CAPEX/REVENUE · HIGH SPEND`,                   col: "#dd817a" };

  const moodStatus = evNow < evAvg * 0.85
    ? { label: "DEPRESSED",      desc: `EV/EBITDA ${evNow}× · BELOW 10Y AVG ${evAvg.toFixed(0)}×`, col: "#66b278" }
    : evNow < evAvg * 1.2
    ? { label: "FAIRLY VALUED",  desc: `EV/EBITDA ${evNow}× · NEAR 10Y AVG ${evAvg.toFixed(0)}×`,  col: "#c59542" }
    : { label: "ELEVATED",       desc: `EV/EBITDA ${evNow}× · ABOVE 10Y AVG ${evAvg.toFixed(0)}×`, col: "#dd817a" };

  const scores = [durabilityStatus, valueStatus, capexStatus, moodStatus];
  const reds   = scores.filter(s => s.col === "#dd817a").length;
  const ambers = scores.filter(s => s.col === "#c59542").length;
  const overallBiz = reds > 0
    ? { label: "FUNDAMENTAL CONCERN", sub: "One or more areas need investigation",    col: "#dd817a" }
    : ambers > 1
    ? { label: "GOOD BUSINESS",       sub: "Strong core with concerns to monitor",    col: "#c59542" }
    : { label: "STRONG BUSINESS",     sub: "Track record supports long-term ownership", col: "#66b278" };

  // ── ScoreCard (click → switch panel) ─────────────────────────────────────
  const ScoreCard = ({ question, answer, desc, col, panelKey, tipTitle, tipBody }) => (
    <div onClick={() => setPanel(panelKey)} {...(tipTitle ? tip(tipTitle, tipBody, `Click to view ${nY - 1}-year evidence below`, col) : {})} style={{
      background: "var(--inner-bg)", border: `1px solid ${col}44`,
      borderLeft: `3px solid ${col}`, borderRadius: 8, padding: "14px 16px",
      cursor: "pointer", transition: "background .15s",
    }}>
      <div style={{ fontSize: 8, letterSpacing: "0.14em", color: "var(--tx6)", marginBottom: 5 }}>{question}</div>
      <div style={{ fontSize: 11.5, fontWeight: 700, color: col, marginBottom: 4, letterSpacing: "0.06em" }}>{answer}</div>
      <div style={{ fontSize: 9.5, color: "var(--tx5)", lineHeight: 1.5 }}>{desc}</div>
      <div style={{ marginTop: 6, fontSize: 8, color: col, opacity: 0.7, letterSpacing: "0.1em" }}>VIEW EVIDENCE ›</div>
    </div>
  );

  const PANELS = [
    { key: "durability", label: "① DURABILITY",     sub: "revenue · margin · FCF",     tipBody: "Multi-year Revenue, Gross Margin, and Free Cash Flow. Are the numbers growing consistently through cycles? We want to see durable compounding, not one-time spikes." },
    { key: "value",      label: "② VALUE CREATION", sub: "ROIC · capital returns",     tipBody: "ROIC vs cost of capital and FCF Yield history. Is management creating real economic value — or just growing revenue while destroying shareholder capital?" },
    { key: "leverage",   label: "③ CAPEX INTENSITY", sub: "spend vs payoff · cycle",   tipBody: "Capex as a % of revenue over time, paired with Free Cash Flow. The real question is whether the spend is being monetized faster than it's growing. A threat explains capex; only results justify it." },
    { key: "mood",       label: "④ MOOD HISTORY",   sub: "price · multiple · cycle",   tipBody: "Multi-year price, drawdown from rolling ATH, and EV/EBITDA multiple history. When has the market been too fearful or too greedy — and what happened next?" },
  ];

  // ── Inline SVG bar chart ──────────────────────────────────────────────────
  const BarChart = ({ data, labels, colorFn, unit = "", height = 110, note }) => {
    const valid = data.filter(v => v !== null);
    const maxV  = Math.max(...valid);
    const minV  = Math.min(...valid, 0);
    const range = maxV - minV || 1;
    const W = 560, H = height, pad = 28, barW = Math.floor((W - pad * 2) / data.length) - 2;
    return (
      <svg width="100%" viewBox={`0 0 ${W} ${H + 28}`} preserveAspectRatio="xMidYMid meet"
        style={{ fontFamily: FONT_MONO }}>
        {/* zero line */}
        {minV < 0 && (
          <line x1={pad} x2={W - pad} y1={H - (0 - minV) / range * H} y2={H - (0 - minV) / range * H}
            stroke="var(--tx7)" strokeWidth={0.5} strokeDasharray="2,2" />
        )}
        {data.map((v, i) => {
          if (v === null) return null;
          const col = colorFn ? colorFn(v) : "#66b278";
          const x   = pad + i * ((W - pad * 2) / data.length) + 1;
          const zeroY = H - (0 - minV) / range * H;
          const barH  = Math.abs(v) / range * H;
          const y     = v >= 0 ? zeroY - barH : zeroY;
          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={Math.max(barH, 1)} fill={col + "bb"} rx={1}
                {...tipSvg(labels[i], `Value: ${v}${unit}`, null, col)} />
              <text x={x + barW / 2} y={H + 18} textAnchor="middle" fontSize={7.5}
                fill="var(--tx6)">{labels[i]}</text>
              {i === data.length - 1 && (
                <text x={x + barW / 2} y={y - 3} textAnchor="middle" fontSize={8}
                  fill={col} fontWeight="700">{v}{unit}</text>
              )}
            </g>
          );
        })}
      </svg>
    );
  };

  // ── Price line chart (monthly) ───────────────────────────────────────
  const PriceLineChart = () => {
    const W = 640, H = 160, pad = { l: 40, r: 16, t: 16, b: 24 };
    const iW = W - pad.l - pad.r, iH = H - pad.t - pad.b;
    const maxP = Math.max(...PRICE_M), minP = Math.min(...PRICE_M);
    const rng  = maxP - minP;
    const n    = PRICE_M.length;
    const xOf  = i => pad.l + (i / (n - 1)) * iW;
    const yOf  = p => pad.t + (1 - (p - minP) / rng) * iH;

    const pts = PRICE_M.map((p, i) => `${xOf(i).toFixed(1)},${yOf(p).toFixed(1)}`).join(" ");
    const areaBase = pad.t + iH;
    const areaPts  = `${xOf(0)},${areaBase} ` + pts + ` ${xOf(n - 1)},${areaBase}`;

    const nowIdx = n - 1;

    // Year tick labels (Jan of each year)
    const yearTicks = PRICE_M_LABELS
      .map((l, i) => ({ i, label: l }))
      .filter(({ label }) => label.endsWith("-01") || label === PRICE_M_LABELS[0]);

    return (
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet"
        style={{ fontFamily: FONT_MONO }}>
        <defs>
          <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#66b278" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#66b278" stopOpacity="0.01" />
          </linearGradient>
        </defs>
        <polygon points={areaPts} fill="url(#priceGrad)" />
        <polyline points={pts} fill="none" stroke="#66b278" strokeWidth={1.5} />
        {yearTicks.map(({ i, label }) => (
          <g key={label}>
            <line x1={xOf(i)} x2={xOf(i)} y1={pad.t + iH} y2={pad.t + iH + 4}
              stroke="var(--tx7)" strokeWidth={0.5} />
            <text x={xOf(i)} y={H - 4} textAnchor="middle" fontSize={7.5} fill="var(--tx7)">
              {label.slice(0, 4)}
            </text>
          </g>
        ))}
        {PAST_EVENTS.map(({ idx, label, note }) => {
          const x = xOf(idx);
          const y = yOf(PRICE_M[idx]);
          return (
            <g key={label} {...tipSvg(label, note || label, null, "var(--tx5)")}>
              <line x1={x} x2={x} y1={pad.t} y2={pad.t + iH} stroke="var(--tx6)"
                strokeWidth={0.8} strokeDasharray="3,2" opacity={0.5} />
              <text x={x} y={pad.t - 2} textAnchor="middle" fontSize={7} fill="var(--tx5)">{label}</text>
            </g>
          );
        })}
        {(() => {
          const athIdx = PRICE_M.indexOf(Math.max(...PRICE_M));
          const isATH = athIdx === nowIdx;
          return (
            <>
              <circle cx={xOf(nowIdx)} cy={yOf(PRICE_M[nowIdx])} r={3} fill="#46aad9"
                {...tipSvg("Current price", TEXT.past.priceNowTip(PRICE_M[nowIdx], isATH), null, "#46aad9")} />
              <text x={xOf(nowIdx) - 6} y={yOf(PRICE_M[nowIdx]) - 6} textAnchor="end"
                fontSize={8} fill="#46aad9" fontWeight="700">${PRICE_M[nowIdx]}{isATH ? " (ATH)" : ""}</text>
              {!isATH && (
                <>
                  <circle cx={xOf(athIdx)} cy={yOf(PRICE_M[athIdx])} r={2.5} fill="#c59542"
                    {...tipSvg("All-Time High", `$${PRICE_M[athIdx]} — the highest monthly close in this window.`, null, "#c59542")} />
                  <text x={xOf(athIdx) + 4} y={yOf(PRICE_M[athIdx]) - 4} fontSize={7.5}
                    fill="#c59542">ATH ${PRICE_M[athIdx]}</text>
                </>
              )}
            </>
          );
        })()}
        {[minP, (minP + maxP) / 2, maxP].map(val => (
          <text key={val} x={pad.l - 4} y={yOf(val) + 3} textAnchor="end"
            fontSize={7.5} fill="var(--tx6)">${Math.round(val)}</text>
        ))}
      </svg>
    );
  };

  // ── Drawdown chart ────────────────────────────────────────────────────────
  const DrawdownChart = () => {
    const W = 640, H = 70, pad = { l: 40, r: 16, t: 8, b: 20 };
    const iW = W - pad.l - pad.r, iH = H - pad.t - pad.b;
    const minDD = Math.min(...PRICE_M_DD);
    const n = PRICE_M_DD.length;
    const xOf = i => pad.l + (i / (n - 1)) * iW;
    const yOf = d => pad.t + (d / minDD) * iH;
    const pts = PRICE_M_DD.map((d, i) => `${xOf(i).toFixed(1)},${yOf(d).toFixed(1)}`).join(" ");
    const areaBase = pad.t;
    const areaPts  = `${xOf(0)},${areaBase} ` + pts + ` ${xOf(n - 1)},${areaBase}`;
    return (
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet"
        style={{ fontFamily: FONT_MONO }}>
        <polygon points={areaPts} fill="#dd817a" opacity={0.12} />
        <polyline points={pts} fill="none" stroke="#dd817a" strokeWidth={1} />
        <line x1={pad.l} x2={W - pad.r} y1={pad.t} y2={pad.t} stroke="var(--tx7)" strokeWidth={0.5} />
        {(() => {
          const wIdx = PRICE_M_DD.indexOf(minDD);
          return (
            <text x={xOf(wIdx)} y={yOf(minDD) + 10} textAnchor="middle"
              fontSize={7.5} fill="#dd817a"
              {...tipSvg("Maximum Drawdown", TEXT.past.ddTip(minDD), null, "#dd817a")}>{minDD}%</text>
          );
        })()}
        <text x={pad.l - 4} y={pad.t + 3} textAnchor="end" fontSize={7} fill="var(--tx7)">0%</text>
        <text x={pad.l - 4} y={pad.t + iH} textAnchor="end" fontSize={7} fill="var(--tx6)">{minDD}%</text>
      </svg>
    );
  };

  const Banner = ({ status, desc, col, summary }) => (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "10px 14px",
      background: col + "12", border: `1px solid ${col}44`, borderLeft: `3px solid ${col}`,
      borderRadius: 7, marginBottom: 18 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", color: col, marginBottom: 3 }}>
          {status} — {desc}
        </div>
        <div style={{ fontSize: 11, color: "var(--tx3)", lineHeight: 1.6 }}>{summary}</div>
      </div>
    </div>
  );

  const ChartBox = ({ title, sub, children }) => (
    <div style={{ background: "var(--inner-bg)", border: "1px solid var(--bd)",
      borderRadius: 8, padding: "14px 16px", marginBottom: 12 }}>
      <div style={{ fontSize: 8.5, letterSpacing: "0.14em", color: "var(--tx6)", marginBottom: 2 }}>{title}</div>
      {sub && <div style={{ fontSize: 9, color: "var(--tx7)", marginBottom: 10 }}>{sub}</div>}
      {children}
    </div>
  );

  const Footnote = ({ text }) => (
    <div style={{ fontSize: 9.5, color: "var(--tx6)", lineHeight: 1.65, marginTop: 10,
      padding: "8px 12px", background: "var(--inner-bg)", borderRadius: 6,
      borderLeft: "2px solid var(--bd)" }}>{text}</div>
  );

  return (
    <div style={{ padding: "0 22px 40px", fontFamily: FONT_MONO }}>

      {/* ══ VERDICT BLOCK (TOP) ════════════════════════════════════════════ */}
      <div style={{ marginTop: 18, background: "var(--panel-bg)",
        border: `1px solid ${overallBiz.col}33`, borderRadius: 10, padding: "18px 18px 14px" }}>

        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em",
          color: "var(--tx6)", marginBottom: 14 }}>THE PAST — IS THIS WORTH OWNING?</div>

        <div className="resp-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
          <ScoreCard question="DOES IT GROW CONSISTENTLY?"
            answer={durabilityStatus.label} desc={durabilityStatus.desc}
            col={durabilityStatus.col} panelKey="durability"
            tipTitle="Does it grow consistently?"
            tipBody={TEXT.past.cardTips.durability((revCAGR * 100).toFixed(0))} />
          <ScoreCard question="DOES IT CREATE VALUE (ROIC > WACC)?"
            answer={valueStatus.label} desc={valueStatus.desc}
            col={valueStatus.col} panelKey="value"
            tipTitle="Does it create value?"
            tipBody={TEXT.past.cardTips.value(latestROIC)} />
          <ScoreCard question="IS THE CAPEX PAYING OFF?"
            answer={capexStatus.label} desc={capexStatus.desc}
            col={capexStatus.col} panelKey="leverage"
            tipTitle="Is the capex paying off?"
            tipBody={TEXT.past.cardTips.capex(peakCapex, latestCapex, latestFCF)} />
          <ScoreCard question="DOES THE MARKET OVER/UNDERPRICE IT?"
            answer={moodStatus.label} desc={moodStatus.desc}
            col={moodStatus.col} panelKey="mood"
            tipTitle="Does the market over/underprice it?"
            tipBody={TEXT.past.cardTips.mood(evNow, evAvg.toFixed(0))} />
        </div>

        <div {...tip("THE PAST · Business Quality Verdict", "Synthesises all four dimensions: durability (consistent growth), value creation (ROIC > WACC), capex intensity (spend vs payoff), and market mood (EV/EBITDA vs history). All green = business earns the right to a premium multiple. Any red = investigate before deploying capital. This is about the BUSINESS, not today's price.", "Hover each quadrant above for what it measures.", overallBiz.col)} style={{ padding: "14px 16px", background: overallBiz.col + "12",
          border: `1px solid ${overallBiz.col}44`, borderRadius: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <div>
              <div style={{ fontSize: 9, letterSpacing: "0.18em", color: overallBiz.col, fontWeight: 700, marginBottom: 4 }}>
                THE PAST · BUSINESS QUALITY VERDICT
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: overallBiz.col, letterSpacing: "0.06em" }}>
                {overallBiz.label}
              </div>
              <div style={{ fontSize: 10.5, color: "var(--tx4)", marginTop: 4 }}>{overallBiz.sub}</div>
            </div>
            <div style={{ fontSize: 9.5, color: "var(--tx5)", textAlign: "right", lineHeight: 1.8 }}>
              {TEXT.past.stats.map((s, i) => (
                <div key={i} {...tip(s.tipTitle, s.tipBody, null, "#66b278")} dangerouslySetInnerHTML={{ __html: s.html }} />
              ))}
            </div>
          </div>
          <div style={{ fontSize: 11, color: "var(--tx4)", lineHeight: 1.75, marginTop: 10 }}>
            {TEXT.past.verdictBody}
          </div>
        </div>
      </div>

      {/* ══ CHEVRON NAV ════════════════════════════════════════════════════ */}
      <div style={{ display: "flex", alignItems: "stretch", gap: 0, margin: "18px 0 0" }}>
        {PANELS.map(({ key, label, sub, tipBody }, i) => {
          const isActive = panel === key;
          const colMap = { durability: durabilityStatus.col, value: valueStatus.col,
                           leverage: capexStatus.col, mood: moodStatus.col };
          const col = colMap[key];
          const isFirst = i === 0, isLast = i === PANELS.length - 1;
          const clip = isFirst
            ? "polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%)"
            : "polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%, 14px 50%)";
          const oc = isActive ? col : "var(--bd2)";
          return (
            <div key={key} onClick={() => setPanel(key)} {...(tipBody ? tip(label, tipBody, null, col) : {})} style={{
              flex: 1, clipPath: clip,
              marginLeft: isFirst ? 0 : "7px",
              background: isActive ? col + "22" : "var(--panel-bg)",
              filter: `drop-shadow(1px 0 0 ${oc}) drop-shadow(-1px 0 0 ${oc}) drop-shadow(0 1px 0 ${oc}) drop-shadow(0 -1px 0 ${oc})`,
              padding: isFirst ? "12px 22px 12px 16px" : "12px 22px 12px 28px",
              cursor: "pointer", transition: "background .15s, filter .15s", outline: "none",
            }}>
              <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.14em",
                color: isActive ? col : "var(--tx4)", marginBottom: 3, whiteSpace: "nowrap" }}>{label}</div>
              <div style={{ fontSize: 8.5, color: isActive ? col : "var(--tx7)",
                whiteSpace: "nowrap", opacity: 0.85 }}>{sub}</div>
            </div>
          );
        })}
      </div>

      {/* ══ EVIDENCE PANEL ════════════════════════════════════════════════ */}
      <div style={{ background: "var(--panel-bg)", border: "1px solid var(--bd)",
        borderRadius: 10, padding: "20px 18px", marginTop: 14 }}>

        {/* ─ ① DURABILITY ─ */}
        {panel === "durability" && (
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em",
              color: "var(--tx5)", marginBottom: 18, paddingBottom: 8, borderBottom: "1px solid var(--bd)" }}>
              DOES IT GROW CONSISTENTLY?
            </div>
            <Banner status={durabilityStatus.label} desc={durabilityStatus.desc}
              col={durabilityStatus.col}
              summary={TEXT.past.banners.durability((revCAGR * 100).toFixed(0), PAST_REV[0], PAST_REV[nY-1], (latestGM - PAST_GM[0]).toFixed(0), latestGM, PAST_FCF[0], latestFCF)} />

            <div className="resp-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <ChartBox title={`REVENUE ($B) · ${PAST_YEARS[0]}–${PAST_YEARS[nY-1]}`} sub="Annual total net revenue · cyclical swings annotated">
                <BarChart
                  data={PAST_REV} labels={PAST_YEARS} unit="B"
                  colorFn={v => "#66b278"} height={110} />
                <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 9, color: "var(--tx6)" }}
                  dangerouslySetInnerHTML={{ __html: TEXT.past.revAnnotationsHtml }} />
              </ChartBox>

              <ChartBox title="GROSS MARGIN (%)" sub="Measures pricing power and mix quality">
                <BarChart
                  data={PAST_GM} labels={PAST_YEARS} unit="%"
                  colorFn={v => v > 58 ? "#66b278" : v > 50 ? "#c59542" : "#dd817a"}
                  height={110} />
              </ChartBox>
            </div>

            <ChartBox title="FREE CASH FLOW ($B)" sub="Cash generated after capex — the real earnings">
              <BarChart
                data={PAST_FCF} labels={PAST_YEARS} unit="B"
                colorFn={v => "#66b278"} height={80} />
            </ChartBox>

            <Footnote text={TEXT.past.footnotes.durability} />
          </div>
        )}

        {/* ─ ② VALUE CREATION ─ */}
        {panel === "value" && (
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em",
              color: "var(--tx5)", marginBottom: 18, paddingBottom: 8, borderBottom: "1px solid var(--bd)" }}>
              DOES IT CREATE VALUE (ROIC &gt; WACC)?
            </div>
            <Banner status={valueStatus.label} desc={valueStatus.desc}
              col={valueStatus.col}
              summary={TEXT.past.banners.value(latestROIC)} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <ChartBox title="ROIC (%)" sub="Return on Invested Capital — above WACC = value creation">
                <BarChart
                  data={PAST_ROIC} labels={PAST_YEARS} unit="%"
                  colorFn={v => v > 15 ? "#66b278" : v > 5 ? "#c59542" : "#dd817a"}
                  height={110} />
                <div style={{ fontSize: 9, color: "var(--tx6)", marginTop: 8 }}>{TEXT.past.roicNote}</div>
              </ChartBox>

              <ChartBox title="FCF YIELD (%)" sub="FCF ÷ market cap at year-end price">
                <BarChart
                  data={PAST_FCF_YIELD} labels={PAST_YEARS} unit="%"
                  colorFn={v => v > 5 ? "#66b278" : v > 2.5 ? "#c59542" : "#dd817a"}
                  height={110} />
                <div style={{ fontSize: 9, color: "var(--tx6)", marginTop: 8 }}>{TEXT.past.fcfYieldNote}</div>
              </ChartBox>
            </div>

            <Footnote text={TEXT.past.footnotes.value} />
          </div>
        )}

        {/* ─ ③ CAPEX INTENSITY ─ */}
        {panel === "leverage" && (
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em",
              color: "var(--tx5)", marginBottom: 18, paddingBottom: 8, borderBottom: "1px solid var(--bd)" }}>
              IS THE CAPEX PAYING OFF?
            </div>
            <Banner status={capexStatus.label} desc={capexStatus.desc}
              col={capexStatus.col}
              summary={TEXT.past.banners.capex(latestCapex, peakCapex, latestFCF, v.capex_fy26_guide_b)} />

            <ChartBox title="CAPEX / REVENUE (%)" sub="Share of every revenue dollar reinvested before FCF">
              <BarChart
                data={PAST_CAPEX_REV} labels={PAST_YEARS} unit="%"
                colorFn={v => v < 35 ? "#66b278" : v < 45 ? "#c59542" : "#dd817a"}
                height={130} />
              <div style={{ display: "flex", gap: 20, marginTop: 8, fontSize: 9, color: "var(--tx6)", flexWrap: "wrap" }}
                dangerouslySetInnerHTML={{ __html: TEXT.past.capexAnnotationsHtml }} />
            </ChartBox>

            <ChartBox title="FREE CASH FLOW ($B)" sub="The monetization signal — paired against capex above">
              <BarChart
                data={PAST_FCF} labels={PAST_YEARS} unit="B"
                colorFn={v => "#66b278"} height={80} />
            </ChartBox>

            <Footnote text={TEXT.past.footnotes.capex} />
          </div>
        )}

        {/* ─ ④ MOOD HISTORY ─ */}
        {panel === "mood" && (
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em",
              color: "var(--tx5)", marginBottom: 18, paddingBottom: 8, borderBottom: "1px solid var(--bd)" }}>
              DOES THE MARKET OVER/UNDERPRICE IT CYCLICALLY?
            </div>
            <Banner status={moodStatus.label} desc={moodStatus.desc}
              col={moodStatus.col}
              summary={TEXT.past.banners.mood(evNow, evAvg.toFixed(0))} />

            <ChartBox title={TEXT.past.priceChartTitle}
              sub={TEXT.past.priceChartSub}>
              <PriceLineChart />
            </ChartBox>

            <ChartBox title="DRAWDOWN FROM ROLLING ATH"
              sub="How far below the peak at each point — shows entry windows">
              <DrawdownChart />
              <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 9, color: "var(--tx6)" }}
                dangerouslySetInnerHTML={{ __html: TEXT.past.ddAnnotationsHtml }} />
            </ChartBox>

            <ChartBox title={`EV / EBITDA · ${PAST_YEARS[0]}–${PAST_YEARS[nY-1]}`}
              sub="Year-end multiple — shows market optimism/pessimism cycles">
              <BarChart
                data={PAST_EVEBITDA} labels={PAST_YEARS} unit="×"
                colorFn={v => v > evAvg * 1.3 ? "#dd817a" : v > evAvg * 0.85 ? "#c59542" : "#66b278"}
                height={90} />
              <div style={{ fontSize: 9, color: "var(--tx6)", marginTop: 6 }}>
                {nY - 1}Y average: {evAvg.toFixed(0)}× · Current EV/EBITDA: {evNow}× (at ${NOW_PRICE})
              </div>
            </ChartBox>

            <Footnote text={TEXT.past.footnotes.mood} />
          </div>
        )}

      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
function ThesisApp() {
  const [active, setActive]       = useState("base");
  const [activeTab, setActiveTab] = useState("the-current");
  // Deep-link support: stocks/index.html's hash router sends { type:'th3sis-goto',
  // tab:'the-future' } for a URL like #TSM:future once this iframe finishes loading.
  useEffect(() => {
    const onGoto = (e) => { if (e.data && e.data.type === 'th3sis-goto' && e.data.tab) setActiveTab(e.data.tab); };
    window.addEventListener('message', onGoto);
    return () => window.removeEventListener('message', onGoto);
  }, []);
  const [isLight, setIsLight]     = useState(() => document.documentElement.classList.contains('light'));
  // Live-price prototype: fetch once on mount, upgrade NOW_PRICE in place, force one
  // re-render so every NOW_PRICE reader (returns, P/E, band position, charts) picks up
  // the live value. On any failure we stay on FALLBACK_PRICE — the page never breaks.
  const [live, setLive] = useState({ status: LIVE_PRICE.enabled ? "loading" : "static", at: null });
  useEffect(() => {
    if (!LIVE_PRICE.enabled) return;
    let cancelled = false;
    fetchLivePrice().then(p => {
      if (cancelled) return;
      if (p == null) { setLive({ status: "static", at: null }); return; }
      NOW_PRICE = p;                              // bands/EPS stay as-of AS_OF_DATE on purpose
      HISTORY[HISTORY.length - 1].p = p;          // fan-chart "NOW" point
      PRICE_M[PRICE_M.length - 1]   = p;          // price-history chart's last point
      setLive({ status: "live", at: new Date() });
    });
    return () => { cancelled = true; };
  }, []);
  const toggleTheme = () => {
    const next = !isLight;
    setIsLight(next);
    document.documentElement.classList.toggle('light', next);
    localStorage.setItem('th3sis_theme', next ? 'light' : 'dark');
    try { window.parent.postMessage({ type: 'th3sis-theme', light: next }, '*'); } catch (_) {}
  };
  const c = CASES[active];
  // When loaded inside index.html's iframe, the sidebar already provides the wordmark,
  // the "hover to learn" hint, and the theme toggle — so hide those header duplicates.
  const inFrame = window.self !== window.top;
  return (
    <div style={{ background: "var(--page-bg)", minHeight: "100vh", padding: "20px 16px", fontFamily: FONT_MONO, color: "var(--tx1)" }}>
      <div className="grain" style={{ maxWidth: 1280, margin: "0 auto", position: "relative", border: "1px solid var(--bd)", borderRadius: 12, background: "var(--wrap-bg)", boxShadow: "var(--wrap-shadow)" }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 22px", borderBottom: "1px solid var(--bd)" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
            {!inFrame && (<>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 24, letterSpacing: "0.35em", color: "var(--title)", fontWeight: 600 }}>TH<span style={{ color: c.accent }}>3</span>SIS</div>
              <div {...tip("👋 New here?", "Hover your mouse over anything on this page — charts, bars, dots, labels — and a plain-English explanation will pop up. No finance degree required.", "This little hint is one too.", "#66b278")}
                style={{ fontSize: 10, color: "var(--tx5)", border: "1px solid #222a38", borderRadius: 20, padding: "3px 10px", cursor: "help" }}>
                ⓘ hover anything to learn what it means
              </div>
            </>)}
          </div>
          <div className="hdr-right" style={{ display: "flex", gap: 18, alignItems: "center", fontSize: 12.5, color: "var(--tx4)" }}>
            <span>{AS_OF_DATE}</span>
            <span style={{ color: "var(--tx1)" }}>{TICKER_META.exchange}:{TICKER_META.ticker}</span>
            <span className="hdr-company" style={{ fontFamily: FONT_DISPLAY, fontStyle: "italic", color: "var(--tx3)" }}>{TICKER_META.company}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span {...tip("Today's share price",
                  live.status === "live"
                    ? TEXT.priceTipLive(NOW_PRICE, live.at ? live.at.toLocaleTimeString() : "just now", AS_OF_DATE)
                    : TEXT.priceTipStatic(NOW_PRICE, AS_OF_DATE, LIVE_PRICE.enabled),
                  null, "var(--title)")}
                style={{ color: "var(--title)", fontWeight: 700, fontSize: 15, cursor: "help" }}>${NOW_PRICE}</span>
              <span {...tip(
                  live.status === "live" ? "Live price" : live.status === "loading" ? "Fetching live price…" : "Static price",
                  live.status === "live"
                    ? `Spot is live; scenario bands are as of ${AS_OF_DATE}. Price-derived insights recompute from the live quote.`
                    : live.status === "loading"
                      ? "Attempting a live quote — falls back to the saved price if it cannot reach a feed."
                      : `Showing the saved price as of ${AS_OF_DATE}. The live feed is off or unreachable; everything still renders correctly.`,
                  null, live.status === "live" ? "#66b278" : "var(--tx5)")}
                style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.1em", cursor: "help",
                  color: live.status === "live" ? "#66b278" : "var(--tx5)",
                  border: `1px solid ${live.status === "live" ? "#66b278" : "var(--bd2)"}`,
                  borderRadius: 20, padding: "2px 8px", whiteSpace: "nowrap" }}>
                {live.status === "live" ? "● LIVE" : live.status === "loading" ? "○ SYNC" : "○ AS-OF"}
              </span>
            </span>
            {!inFrame && (
              <button onClick={toggleTheme} aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
                style={{ background: "transparent", border: "1px solid var(--bd2)", borderRadius: 20,
                  padding: "3px 10px", cursor: "pointer", fontFamily: FONT_MONO, fontSize: 9,
                  color: "var(--tx5)", letterSpacing: "0.08em", transition: "all .15s" }}>
                {isLight ? "◑ DARK" : "☀ LIGHT"}
              </button>
            )}
          </div>
        </div>

        <TabNav activeTab={activeTab} setActiveTab={setActiveTab} accentColor={c.accent} />

        {activeTab === "the-past"    && <PastTab />}
        {activeTab === "the-future"  && <FutureTab />}
        {activeTab === "the-current" && <CurrentTab />}

      </div>

      <div style={{ maxWidth: 1280, margin: "12px auto 0", fontSize: 10.5, color: "var(--tx7)", lineHeight: 1.5 }}>
        {TEXT.footerDisclaimer(AS_OF_DATE)}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<ThesisApp />);
