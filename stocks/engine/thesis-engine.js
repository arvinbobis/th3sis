const { useState, useEffect } = React;
const FONT_MONO = "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace";
const FONT_DISPLAY = "'Spectral', Georgia, serif";
const TICKER = TICKER_META.ticker;
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
let NOW_PRICE = FALLBACK_PRICE;
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
let tipEl = null;
function ensureTip() {
  if (!tipEl) {
    tipEl = document.createElement("div");
    tipEl.id = "tip-box";
    document.body.appendChild(tipEl);
  }
  return tipEl;
}
function showTip(e, title, body, note, color) {
  const el = ensureTip();
  el.innerHTML = `<div class="tt" style="color:${color || "var(--blue-soft)"}">${title}</div><div class="tb">${body}</div>${note ? `<div class="tn">${note}</div>` : ""}`;
  el.classList.add("on");
  moveTip(e);
}
function moveTip(e) {
  const el = ensureTip();
  const pad = 16;
  let x = e.clientX + pad, y = e.clientY + pad;
  const r = el.getBoundingClientRect();
  if (x + r.width > window.innerWidth - 8) x = e.clientX - r.width - pad;
  if (y + r.height > window.innerHeight - 8) y = e.clientY - r.height - pad;
  el.style.left = x + "px";
  el.style.top = y + "px";
}
function hideTip() {
  if (tipEl) tipEl.classList.remove("on");
}
function tipTitle(title, body, note) {
  return [title, body, note].filter(Boolean).join(" \u2014 ");
}
function tip(title, body, note, color) {
  return { className: "tip-target", title: tipTitle(title, body, note), onMouseEnter: (e) => showTip(e, title, body, note, color), onMouseMove: (e) => moveTip(e), onMouseLeave: hideTip };
}
function tipSvg(title, body, note, color, extraClass) {
  return { className: (extraClass ? extraClass + " " : "") + "tip-target", title: tipTitle(title, body, note), onMouseEnter: (e) => showTip(e, title, body, note, color), onMouseMove: (e) => moveTip(e), onMouseLeave: hideTip };
}
const TRACK = Array.from(new Map(TRACK_ALL.map((t) => [t.q, t])).values()).slice(-TRACK_WINDOW);
const PRICE_MIN = GEOM.priceMin, PRICE_MAX = GEOM.priceMax;
const CH_W = 760, CH_H = 420, PAD_L = 8, PAD_R = 56, PAD_T = 18, PAD_B = 34;
const plotW = CH_W - PAD_L - PAD_R, plotH = CH_H - PAD_T - PAD_B;
const yOf = (p) => PAD_T + (1 - (p - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * plotH;
function FanChart({ c }) {
  const nHist = HISTORY.length;
  const histPts = HISTORY.map((d, i) => [PAD_L + i / (nHist + FUTURE_Q.length - 1) * plotW, yOf(d.p)]);
  const nowX = histPts[histPts.length - 1][0];
  const nowY = histPts[histPts.length - 1][1];
  const fwdN = FUTURE_Q.length;
  const fwdX = (i) => nowX + (i + 1) / fwdN * (CH_W - PAD_R - nowX);
  const end = PROJ_END[c.key];
  const mid = FUTURE_Q.map((_, i) => {
    const t = (i + 1) / fwdN;
    return [fwdX(i), yOf(NOW_PRICE + (end - NOW_PRICE) * t)];
  });
  const spread = (i) => 28 + i * 28;
  const upper = mid.map(([x, y], i) => [x, y - spread(i)]);
  const lower = mid.map(([x, y], i) => [x, y + spread(i)]);
  const bandPath = `M ${nowX} ${nowY} ` + upper.map(([x, y]) => `L ${x} ${y}`).join(" ") + " " + lower.slice().reverse().map(([x, y]) => `L ${x} ${y}`).join(" ") + " Z";
  const midPath = `M ${nowX} ${nowY} ` + mid.map(([x, y]) => `L ${x} ${y}`).join(" ");
  const histPath = "M " + histPts.map(([x, y]) => `${x} ${y}`).join(" L ");
  const gridP = GEOM.fanGrid;
  return /* @__PURE__ */ React.createElement("svg", { viewBox: `0 0 ${CH_W} ${CH_H}`, style: { width: "100%", height: "auto", display: "block" } }, /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("linearGradient", { id: `fan-${c.key}`, x1: "0", y1: "0", x2: "1", y2: "0" }, /* @__PURE__ */ React.createElement("stop", { offset: "0%", stopColor: c.accent, stopOpacity: "0.05" }), /* @__PURE__ */ React.createElement("stop", { offset: "100%", stopColor: c.accent, stopOpacity: "0.28" })), /* @__PURE__ */ React.createElement("filter", { id: "softglow" }, /* @__PURE__ */ React.createElement("feGaussianBlur", { stdDeviation: "2.2" }))), gridP.map((p) => /* @__PURE__ */ React.createElement("g", { key: p }, /* @__PURE__ */ React.createElement("line", { x1: PAD_L, y1: yOf(p), x2: CH_W - PAD_R, y2: yOf(p), stroke: "var(--bd2)", strokeWidth: "1", strokeDasharray: "1 5" }), /* @__PURE__ */ React.createElement("text", { x: CH_W - PAD_R + 8, y: yOf(p) + 3, fill: "var(--tx5)", fontSize: "11", fontFamily: FONT_MONO }, "$", p))), /* @__PURE__ */ React.createElement("line", { x1: nowX, y1: PAD_T, x2: nowX, y2: CH_H - PAD_B, stroke: "#46aad9", strokeWidth: "1", strokeDasharray: "3 4", opacity: "0.7" }), /* @__PURE__ */ React.createElement("path", { d: bandPath, fill: `url(#fan-${c.key})`, ...tipSvg(
    "The forecast 'cone'",
    "This shaded fan shows the range of where the price could go in this scenario over the next year. It gets wider further out because the future is less certain. The dashed line through the middle is the most-likely path.",
    "Wider = more uncertainty.",
    c.accent,
    "fan-band"
  ) }), /* @__PURE__ */ React.createElement("path", { d: midPath, fill: "none", stroke: c.accent, strokeWidth: "2", strokeDasharray: "6 5", className: "fan-mid", style: { filter: "url(#softglow)" } }), /* @__PURE__ */ React.createElement("path", { d: histPath, fill: "none", stroke: "var(--tx1)", strokeWidth: "2", ...tipSvg(
    "Price history",
    TEXT.fanHistory,
    "This part already happened \u2014 it's real, not a forecast.",
    "var(--tx1)",
    "hist-line"
  ) }), HISTORY.map((d, i) => /* @__PURE__ */ React.createElement("g", { key: i }, /* @__PURE__ */ React.createElement(
    "circle",
    {
      cx: histPts[i][0],
      cy: histPts[i][1],
      r: i === nHist - 1 ? 4.5 : 3,
      fill: i === nHist - 1 ? "#46aad9" : "var(--panel-bg)",
      stroke: i === nHist - 1 ? "var(--title)" : "var(--tx3)",
      strokeWidth: "1.5",
      ...tipSvg(
        i === nHist - 1 ? "Where we are today" : d.q,
        i === nHist - 1 ? TEXT.fanNow(NOW_PRICE) : TEXT.fanPastDot(d.q, d.p),
        null,
        i === nHist - 1 ? "var(--blue-soft)" : "var(--tx1)"
      )
    }
  ), i === nHist - 1 && /* @__PURE__ */ React.createElement("text", { x: histPts[i][0] - 6, y: histPts[i][1] - 12, fill: "var(--blue-soft)", fontSize: "11", fontFamily: FONT_MONO, textAnchor: "end" }, "NOW $", NOW_PRICE))), mid.map(([x, y], i) => /* @__PURE__ */ React.createElement("g", { key: i, className: "diamond", style: { animationDelay: `${0.5 + i * 0.12}s` } }, /* @__PURE__ */ React.createElement(
    "rect",
    {
      x: x - 4,
      y: y - 4,
      width: "8",
      height: "8",
      transform: `rotate(45 ${x} ${y})`,
      fill: "var(--panel-bg)",
      stroke: c.accent,
      strokeWidth: "1.6",
      ...tipSvg(
        `Forecast: ${FUTURE_Q[i]}`,
        `A milestone on the most-likely price path for the ${c.label} scenario. Each diamond is roughly one quarter further into the future.`,
        "Hover the shaded cone around it to see the uncertainty range.",
        c.accent
      )
    }
  ), /* @__PURE__ */ React.createElement("text", { x, y: y - 12, fill: c.accent, fontSize: "10.5", fontFamily: FONT_MONO, textAnchor: "middle" }, FUTURE_Q[i]))), GEOM.fanYears.map((yr, i) => /* @__PURE__ */ React.createElement("text", { key: yr, x: PAD_L + i / (GEOM.fanYears.length - 1) * plotW, y: CH_H - 10, fill: "var(--tx5)", fontSize: "11", fontFamily: FONT_MONO }, yr)));
}
function SignalBar({ pos, accent, tipProps }) {
  return /* @__PURE__ */ React.createElement("div", { ...tipProps || {}, style: { position: "relative", height: 22, borderRadius: 3, overflow: "hidden", display: "flex", border: "1px solid #1c2230" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, background: "rgba(241,86,75,0.22)" } }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, background: "rgba(224,168,59,0.18)" } }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, background: "rgba(63,208,122,0.22)" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: -2, bottom: -2, left: `calc(${pos * 100}% - 1px)`, width: 2, background: accent, boxShadow: `0 0 8px ${accent}`, pointerEvents: "none" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: "50%", left: `${pos * 100}%`, width: 7, height: 7, borderRadius: "50%", background: accent, transform: "translate(-50%,-50%)", boxShadow: `0 0 10px ${accent}`, pointerEvents: "none" } }));
}
function tagColor(tag) {
  if (tag === "BEAT") return "#66b278";
  if (tag === "MATCH") return "#c59542";
  if (tag === "MISS") return "#dd817a";
  return "var(--tx4)";
}
function Segmented({ active, setActive, small }) {
  const explain = TEXT.segmentedExplain;
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 5 } }, Object.values(CASES).map((cc) => {
    const on = active === cc.key;
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        key: cc.key,
        onClick: () => setActive(cc.key),
        onMouseEnter: (e) => showTip(e, explain[cc.key][0], explain[cc.key][1], "Tip: click to switch the whole dashboard to this scenario.", cc.accent),
        onMouseMove: moveTip,
        onMouseLeave: hideTip,
        style: {
          padding: small ? "3px 12px" : "4px 14px",
          borderRadius: 4,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.08em",
          cursor: "pointer",
          border: `1px solid ${on ? cc.accent : "var(--bd)"}`,
          color: on ? "var(--page-bg)" : cc.accent,
          background: on ? cc.accent : "transparent",
          boxShadow: on ? `0 0 16px ${cc.glow}` : "none",
          transition: "all .18s ease"
        }
      },
      cc.label
    );
  }));
}
function KpiCol({ label, val, accentColor, baseline, delay = 0 }) {
  const h = Math.max(4, Math.min(92, (val - GEOM.kpiMin) / (GEOM.kpiMax - GEOM.kpiMin) * 100));
  const tp = baseline ? tip(`Starting point (${HISTORY[HISTORY.length - 2].q})`, TEXT.kpiBaseline(val), "The grey dot = 'where we are now'.", "var(--tx3)") : tip(`Forecast: ${label}`, TEXT.kpiForecast(label, val), "Switch BEAR/BASE/BULL up top to see how the forecast changes.", accentColor);
  return /* @__PURE__ */ React.createElement("div", { style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }, ...tp }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: accentColor, fontWeight: 700, marginBottom: 4 } }, "$", val, "B"), baseline ? /* @__PURE__ */ React.createElement("div", { style: { width: 9, height: 9, borderRadius: "50%", background: "var(--tx8)", border: "1.5px solid #7b86a0", marginBottom: `${h}%` } }) : /* @__PURE__ */ React.createElement("div", { style: { width: "62%", height: `${h}%`, background: `linear-gradient(180deg, ${accentColor}, ${accentColor}44)`, border: `1px solid ${accentColor}`, borderRadius: 2, animation: `fadeUp .5s ease ${delay}s both`, boxShadow: `0 0 12px ${accentColor}55` } }), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9.5, color: "var(--tx5)", marginTop: 6 } }, label));
}
function SignalGroup({ id, title, requires, accent, evidence, children }) {
  return /* @__PURE__ */ React.createElement("div", { style: { border: "1px solid var(--bd)", borderRadius: 8, padding: "10px 12px", marginBottom: 12, background: "var(--panel-bg)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12.5, color: "var(--tx1)", fontFamily: FONT_DISPLAY, fontWeight: 600 } }, /* @__PURE__ */ React.createElement("span", { style: { background: "var(--bd)", padding: "1px 6px", borderRadius: 3, fontSize: 10, fontFamily: FONT_MONO, color: "var(--tx3)", marginRight: 8, verticalAlign: "middle" } }, id), /* @__PURE__ */ React.createElement("span", { dangerouslySetInnerHTML: { __html: title } })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--tx5)" } }, "EVIDENCE ", evidence, " \u203A")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10.5, color: "var(--tx5)", margin: "4px 0 10px" } }, "REQUIRES: ", /* @__PURE__ */ React.createElement("span", { style: { color: accent } }, requires)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 12 } }, children));
}
function SignalRow({ s, accent }) {
  return /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: 12, alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { borderLeft: `2px solid ${accent}`, paddingLeft: 8 }, ...tip(
    s.name,
    SIGNAL_HELP[s.name] || "A measurable indicator used to check whether this scenario is actually happening.",
    `Status "${s.tag}": ${TAG_HELP[s.tag] || ""}`,
    accent
  ) }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11.5, color: "var(--track-line)", lineHeight: 1.25 } }, s.name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--tx5)", marginTop: 2 } }, s.unit, " \xB7 ", /* @__PURE__ */ React.createElement("span", { style: { color: tagColor(s.tag) } }, s.tag))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(SignalBar, { pos: s.pos, accent, tipProps: tip(
    "Where this scenario sits",
    "This bar runs from bad (red, left) to good (green, right). The glowing dot shows where THIS scenario expects the number to land.",
    "It's a visual gauge, not an exact measurement.",
    accent
  ) }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 9.5 } }, /* @__PURE__ */ React.createElement("span", { style: { color: "var(--tx5)" } }, "NEXT: ", s.next), /* @__PURE__ */ React.createElement("span", { style: { color: accent, fontWeight: 700 } }, s.val), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--tx5)" } }, s.guide))));
}
function MarginRow({ s, accent }) {
  return /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: 12, alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { borderLeft: `2px solid ${accent}`, paddingLeft: 8 }, ...tip(
    s.name,
    SIGNAL_HELP[s.name] || "A measure of how profitable and well-run the business is.",
    `Status "${s.tag}": ${TAG_HELP[s.tag] || ""}`,
    accent
  ) }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11.5, color: "var(--track-line)", lineHeight: 1.25 } }, s.name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--tx5)", marginTop: 2 } }, "% \xB7 ", /* @__PURE__ */ React.createElement("span", { style: { color: tagColor(s.tag) } }, s.tag))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(SignalBar, { pos: s.pos, accent, tipProps: tip(
    "Where this scenario sits",
    "Red (left) is bad, green (right) is good. The glowing dot marks where this scenario expects this measure to land.",
    null,
    accent
  ) }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 9.5 } }, /* @__PURE__ */ React.createElement("span", { style: { color: "var(--tx5)" } }, "NEXT: ", s.next))));
}
function ReversionClock() {
  const dislocationDate = new Date(DISLOCATION_DATE);
  const today = /* @__PURE__ */ new Date();
  const elapsed = Math.round((today - dislocationDate) / 864e5);
  const pct = Math.min(100, elapsed / REVERSION_PRECEDENT_DAYS * 100);
  const trough = REVERSION_TROUGH, baseFloor = REVERSION_BASEFLOOR, now = NOW_PRICE;
  const recPct = Math.min(138, Math.max(0, (now - trough) / (baseFloor - trough) * 100));
  return /* @__PURE__ */ React.createElement("div", { style: { marginTop: 12, padding: "12px 14px", background: "var(--panel-bg)", border: "1px solid var(--bd)", borderRadius: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10.5, letterSpacing: "0.14em", color: "var(--tx5)" } }, TEXT.reversion.header), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--tx3)" } }, /* @__PURE__ */ React.createElement("span", { style: { color: "#c59542", fontWeight: 700 } }, elapsed, "d"), " elapsed / ~", REVERSION_PRECEDENT_DAYS, "d precedent")), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 4, fontSize: 9.5, color: "var(--tx5)" } }, "TIME SINCE DISLOCATION (", new Date(DISLOCATION_DATE).toLocaleDateString("en-US", { month: "short", day: "numeric" }), ")"), /* @__PURE__ */ React.createElement(
    "div",
    {
      ...tip(
        "How much time has passed",
        TEXT.reversion.timeTip,
        "Filling up = getting closer to when recovery happened last time.",
        "#c59542"
      ),
      style: { position: "relative", height: 14, background: "var(--deep-bg)", borderRadius: 7, overflow: "hidden", border: "1px solid #1c2230" }
    },
    /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", left: 0, top: 0, bottom: 0, width: `${Math.min(100, pct)}%`, background: "linear-gradient(90deg,#dd817a,#c59542)", borderRadius: 7 } }),
    /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", right: 0, top: -3, bottom: -3, width: 2, background: "#66b278" } }),
    /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", left: `${Math.min(100, pct)}%`, top: "50%", width: 8, height: 8, borderRadius: "50%", background: "var(--title)", transform: "translate(-50%,-50%)", boxShadow: "0 0 8px #fff", pointerEvents: "none" } })
  ), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 9, color: "var(--tx5)", marginTop: 3 } }, /* @__PURE__ */ React.createElement("span", null, "day 0"), /* @__PURE__ */ React.createElement("span", { style: { color: "#66b278" } }, "base-reversion mark (~", REVERSION_PRECEDENT_DAYS, "d) \u2192")), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 12, marginBottom: 4, fontSize: 9.5, color: "var(--tx5)" } }, "PRICE RECOVERY \xB7 $", REVERSION_TROUGH, " trough \u2192 $", REVERSION_BASEFLOOR, " base floor"), /* @__PURE__ */ React.createElement(
    "div",
    {
      ...tip(
        "How far the price has bounced back",
        TEXT.reversion.priceTip(trough, baseFloor, now),
        "When this bar is fuller than the time bar above, the bounce-back ran faster than the precedent. It did.",
        "var(--blue-soft)"
      ),
      style: { position: "relative", height: 14, background: "var(--deep-bg)", borderRadius: 7, overflow: "hidden", border: "1px solid #1c2230" }
    },
    /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", left: 0, top: 0, bottom: 0, width: `${Math.min(100, recPct / 1.38)}%`, background: "linear-gradient(90deg,#dd817a,#66b278)", borderRadius: 7 } }),
    /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", left: `${Math.min(100, recPct / 1.38)}%`, top: "50%", width: 8, height: 8, borderRadius: "50%", background: "var(--blue-soft)", transform: "translate(-50%,-50%)", boxShadow: "0 0 8px var(--blue-soft)", pointerEvents: "none" } })
  ), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 9, color: "var(--tx5)", marginTop: 3 } }, /* @__PURE__ */ React.createElement("span", null, "$", REVERSION_TROUGH), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--blue-soft)" } }, "$", now, " now \xB7 ", Math.round(recPct), "% of the way back (base floor cleared)"), /* @__PURE__ */ React.createElement("span", null, "$", REVERSION_BASEFLOOR)), /* @__PURE__ */ React.createElement(
    "div",
    {
      style: { fontSize: 10.5, color: "var(--tx3)", lineHeight: 1.55, marginTop: 10 },
      dangerouslySetInnerHTML: { __html: TEXT.reversion.footerHtml(REVERSION_BASEFLOOR, REVERSION_PRECEDENT_DAYS, now) }
    }
  ));
}
function TrackRecord() {
  const W = 1e3, H = 300, pl = 44, pr = 70, pt = 20, pb = 40;
  const pw = W - pl - pr, ph = H - pt - pb;
  const y = (p) => pt + (1 - (p - GEOM.trackMin) / (GEOM.trackMax - GEOM.trackMin)) * ph;
  const x = (i) => pl + (TRACK.length === 1 ? pw / 2 : i / (TRACK.length - 1) * pw);
  const grid = GEOM.trackGrid;
  const pathPts = TRACK.map((t, i) => [x(i), y(t.post)]);
  const linePath = "M " + pathPts.map(([px, py]) => `${px} ${py}`).join(" L ");
  const hits = TRACK.filter((t) => t.landed.includes("base") || t.landed.includes("bull")).length;
  return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--inner-bg)", padding: "16px 18px", borderTop: "1px solid var(--bd)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11.5, letterSpacing: "0.18em", color: "var(--tx4)" } }, /* @__PURE__ */ React.createElement("span", { style: { background: "var(--bd)", padding: "2px 6px", borderRadius: 3, color: "var(--tx1)", marginRight: 8 } }, "TR \xB7 BACKTEST"), "THESIS TRACK RECORD \xB7 RECONSTRUCTED BANDS vs ACTUAL PRICE"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--tx4)" } }, "BASE-OR-BETTER LANDINGS: ", /* @__PURE__ */ React.createElement("span", { style: { color: "#66b278", fontWeight: 700 } }, hits, "/", TRACK.length))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10.5, color: "var(--tx5)", marginBottom: 10 } }, "Each column = one earnings date. Stacked zones are the bear / base / bull bands as they would have been drawn at that time. The line is where price actually traded after. All prices post-split."), /* @__PURE__ */ React.createElement("svg", { viewBox: `0 0 ${W} ${H}`, style: { width: "100%", height: "auto", display: "block" } }, grid.map((p) => /* @__PURE__ */ React.createElement("g", { key: p }, /* @__PURE__ */ React.createElement("line", { x1: pl, y1: y(p), x2: W - pr, y2: y(p), stroke: "var(--bd)", strokeWidth: "1", strokeDasharray: "1 5" }), /* @__PURE__ */ React.createElement("text", { x: W - pr + 8, y: y(p) + 3, fill: "var(--tx5)", fontSize: "11", fontFamily: FONT_MONO }, "$", p))), TRACK.map((t, i) => {
    const cx = x(i), bw = 46;
    const landWord = t.landed.includes("bull") ? "the optimistic zone" : t.landed.includes("base") ? "the middle zone" : "the pessimistic zone";
    const reactWord = t.reaction.includes("\u2212") || t.reaction.includes("-") ? "the stock FELL after this report" : "the stock ROSE after this report";
    const seg = (range, color) => /* @__PURE__ */ React.createElement(
      "rect",
      {
        x: cx - bw / 2,
        y: y(range[1]),
        width: bw,
        height: Math.max(2, y(range[0]) - y(range[1])),
        fill: color,
        opacity: t.conf === "med" ? 0.32 : 0.5,
        rx: "2",
        style: { animation: `fadeUp .5s ease ${i * 0.08}s both` },
        ...tipSvg(
          `${t.q} earnings`,
          `At this earnings date, here's the scenario band (red=bear, yellow=base, green=bull). In reality, ${reactWord} and the price ended up in ${landWord} (~$${t.post}).`,
          t.conf === "med" ? "Marked 'lower-confidence' \u2014 bands reconstructed in hindsight." : null,
          color.includes("63,208") ? "#66b278" : color.includes("224,168") ? "#c59542" : "#dd817a"
        )
      }
    );
    return /* @__PURE__ */ React.createElement("g", { key: t.q }, seg(t.bull, "rgba(63,208,122,0.55)"), seg(t.base, "rgba(224,168,59,0.5)"), seg(t.bear, "rgba(241,86,75,0.5)"), /* @__PURE__ */ React.createElement("text", { x: cx, y: H - 24, fill: "var(--tx3)", fontSize: "11", fontFamily: FONT_MONO, textAnchor: "middle" }, t.q), /* @__PURE__ */ React.createElement("text", { x: cx, y: H - 11, fill: t.conf === "med" ? "var(--tx5)" : "var(--tx8)", fontSize: "8.5", fontFamily: FONT_MONO, textAnchor: "middle" }, t.conf === "med" ? "lower-conf" : t.reaction.includes("-") ? "\u2193 dislocation" : ""));
  }), /* @__PURE__ */ React.createElement("path", { d: linePath, fill: "none", stroke: "var(--track-line)", strokeWidth: "2.2", className: "track-line", style: { filter: "drop-shadow(0 0 4px rgba(221,227,238,0.4))" } }), TRACK.map((t, i) => {
    const isLast = i === TRACK.length - 1;
    return /* @__PURE__ */ React.createElement("g", { key: t.q, style: { animation: `pop .4s cubic-bezier(.2,1.4,.4,1) ${0.3 + i * 0.08}s both` } }, /* @__PURE__ */ React.createElement(
      "circle",
      {
        cx: x(i),
        cy: y(t.post),
        r: isLast ? 6 : 4,
        fill: isLast ? "#46aad9" : "var(--panel-bg)",
        stroke: "var(--title)",
        strokeWidth: isLast ? 2 : 1.5,
        ...tipSvg(
          isLast ? "Most recent quarter" : `${t.q}: actual price`,
          isLast ? TEXT.track.lastDot(t.post, NOW_PRICE) : TEXT.track.pastDot(t.q, t.post),
          null,
          isLast ? "var(--blue-soft)" : "var(--tx1)"
        )
      }
    ), isLast && /* @__PURE__ */ React.createElement("text", { x: x(i), y: y(t.post) - 14, fill: "var(--blue-soft)", fontSize: "11", fontFamily: FONT_MONO, textAnchor: "middle", fontWeight: "700" }, "NOW $", t.post));
  })), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 12, padding: "10px 12px", background: "var(--panel-bg)", border: "1px solid var(--bd)", borderRadius: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10.5, letterSpacing: "0.12em", color: "var(--tx5)", marginBottom: 6 } }, "READ-OUT"), /* @__PURE__ */ React.createElement(
    "div",
    {
      style: { fontSize: 12, color: "var(--tx2)", lineHeight: 1.6 },
      dangerouslySetInnerHTML: { __html: TEXT.track.readoutHtml(hits, TRACK.length, NOW_PRICE) }
    }
  )), /* @__PURE__ */ React.createElement(ReversionClock, null), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9.5, color: "var(--tx7)", marginTop: 8, lineHeight: 1.5 } }, TEXT.track.footnote));
}
function TabNav({ activeTab, setActiveTab, accentColor }) {
  const legacy = [];
  const fresh = [
    { id: "the-past", label: "THE PAST", sub: "durability \xB7 mood" },
    { id: "the-current", label: "THE CURRENT", sub: "story \xB7 price \xB7 signal" },
    { id: "the-future", label: "THE FUTURE", sub: "bet \xB7 risk \xB7 deploy" }
  ];
  const renderTab = ({ id, label, sub, disabled }) => {
    const on = activeTab === id;
    const isNew = fresh.some((t) => t.id === id);
    const col = on ? isNew ? "#66b278" : "var(--blue-soft)" : "var(--tx7)";
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        key: id,
        onClick: () => !disabled && setActiveTab(id),
        style: {
          padding: "11px 24px",
          cursor: disabled ? "default" : "pointer",
          opacity: disabled ? 0.35 : 1,
          borderBottom: `2px solid ${on ? col : "transparent"}`,
          transition: "all .15s ease"
        }
      },
      /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: on ? col : "var(--tx6)" } }, label),
      /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: on ? "var(--tx5)" : "var(--tx9)", marginTop: 2, letterSpacing: "0.08em" } }, sub)
    );
  };
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", background: "var(--nav-bg)", borderBottom: "1px solid var(--bd)", alignItems: "stretch" } }, legacy.map(renderTab), /* @__PURE__ */ React.createElement("div", { style: { width: 1, background: "var(--bd2)", margin: "8px 4px", opacity: 0.7 } }), fresh.map(renderTab));
}
const VIS_LO = GEOM.visLo, VIS_HI = GEOM.visHi;
const visPct = (v) => `${((v - VIS_LO) / (VIS_HI - VIS_LO) * 100).toFixed(2)}%`;
const visW = (lo, hi) => `${((hi - lo) / (VIS_HI - VIS_LO) * 100).toFixed(2)}%`;
const visC = (lo, hi) => ((lo + hi) / 2 - VIS_LO) / (VIS_HI - VIS_LO) * 100;
function loadStorage(key, version, fallback) {
  try {
    const d = JSON.parse(localStorage.getItem(key));
    if (!d || d.version !== version) {
      localStorage.removeItem(key);
      return fallback;
    }
    return d;
  } catch {
    return fallback;
  }
}
const POS_KEY = `th3sis_pos_${TICKER_META.ticker}`;
const POS_SCHEMA_VERSION = 1;
const DEFAULT_TRANCHES = [
  { id: 1, label: "STARTER", price: "", shares: "", date: null, note: "" },
  { id: 2, label: "ADD", price: "", shares: "", date: null, note: "" },
  { id: 3, label: "CONFIRM", price: "", shares: "", date: null, note: "" }
];
function loadPos() {
  return loadStorage(POS_KEY, POS_SCHEMA_VERSION, null);
}
const DEFAULT_CHECKS = () => Object.fromEntries(THESIS_ITEMS.map((t) => [t.key, false]));
const parseBand = (t12) => t12.split("\u2014").map((s) => parseInt(s.replace(/[$,\s]/g, "")));
function CurrentTab() {
  const [active, setActive] = useState("base");
  const [panel, setPanel] = useState("story");
  const c = CASES[active];
  const v = VAL_CONFIG;
  const fcfYield = (v.fcf_ntm_b * 1e9 / (NOW_PRICE * v.shares_b * 1e9) * 100).toFixed(1);
  const bearLo = parseBand(CASES.bear.target12)[0];
  const bullHi = parseBand(CASES.bull.target12)[1];
  const baseLo = parseBand(CASES.base.target12)[0];
  const baseHi = parseBand(CASES.base.target12)[1];
  const inBase = NOW_PRICE >= baseLo && NOW_PRICE <= baseHi;
  const belowBase = NOW_PRICE < baseLo;
  const verdictColor = belowBase ? "#66b278" : inBase ? "#c59542" : "#dd817a";
  const allSigs = [...SIGNALS[active], ...MARGIN[active]];
  const beats = allSigs.filter((s) => s.tag === "BEAT").length;
  const misses = allSigs.filter((s) => s.tag === "MISS").length;
  const matches = allSigs.filter((s) => s.tag === "MATCH").length;
  const thesisStatus = misses >= 3 ? { label: "BROKEN", desc: "ACT ON KILL-SWITCH", col: "#dd817a" } : misses >= 2 ? { label: "WATCH", desc: "MIXED SIGNALS", col: "#c59542" } : { label: "INTACT", desc: "TRACKING AS EXPECTED", col: "#66b278" };
  const currentPE = (NOW_PRICE / v.ntm_eps).toFixed(1);
  const pePos = (NOW_PRICE / v.ntm_eps - v.pe_trough) / (v.pe_peak - v.pe_trough);
  const fyRevBase = KPI_HIST + KPI_PROJ.base[0] + KPI_PROJ.base[1] + KPI_PROJ.base[2];
  const bearDown = ((NOW_PRICE - bearLo) / NOW_PRICE * 100).toFixed(0);
  const bullUp = ((bullHi - NOW_PRICE) / NOW_PRICE * 100).toFixed(0);
  const asymRatio = (bullHi - NOW_PRICE) / (NOW_PRICE - bearLo);
  const asymStatus = asymRatio >= 2 ? { label: "FAVORABLE", desc: `${asymRatio.toFixed(1)}\xD7 UP PER UNIT DOWN`, col: "#66b278" } : asymRatio >= 1 ? { label: "BALANCED", desc: `${asymRatio.toFixed(1)}\xD7 UP PER UNIT DOWN`, col: "#c59542" } : { label: "UNFAVORABLE", desc: `${asymRatio.toFixed(1)}\xD7 UP PER UNIT DOWN`, col: "#dd817a" };
  const [dr, setDr] = useState(VAL_CONFIG.default_discount_pct);
  const [termPE, setTermPE] = useState(VAL_CONFIG.default_terminal_pe);
  const dcfN = VAL_CONFIG.dcf_years;
  const impliedCAGR = termPE > 0 && v.ntm_eps > 0 ? (Math.pow(NOW_PRICE * Math.pow(1 + dr / 100, dcfN) / (v.ntm_eps * termPE), 1 / dcfN) - 1) * 100 : null;
  const cagrRounded = impliedCAGR !== null ? impliedCAGR.toFixed(1) : "\u2014";
  const cagrDisplay = impliedCAGR !== null ? `+${cagrRounded}%` : "\u2014";
  const cagrColor = impliedCAGR === null ? "var(--tx4)" : impliedCAGR > 25 ? "#dd817a" : impliedCAGR > 15 ? "#c59542" : "#66b278";
  const cagrNote = impliedCAGR === null ? "Adjust sliders to calculate the implied growth rate." : impliedCAGR < 15 ? TEXT.current.cagrNotes.low : impliedCAGR < 25 ? TEXT.current.cagrNotes.mid : TEXT.current.cagrNotes.high;
  const marketMood = pePos > 0.67 ? { label: "ELEVATED OPTIMISM", sub: `market pricing ${cagrDisplay} EPS CAGR (high bar)`, col: "#dd817a" } : pePos > 0.4 ? { label: "MODERATE OPTIMISM", sub: `market requires ${cagrDisplay} EPS CAGR`, col: "#c59542" } : { label: "SKEPTICISM / FEAR", sub: `market requires only ${cagrDisplay} EPS CAGR (low bar)`, col: "#66b278" };
  const overallVerdict = thesisStatus.label === "BROKEN" ? { label: "REDUCE / EXIT", sub: "Kill-switch criteria met \u2014 act on signal", col: "#dd817a" } : thesisStatus.label === "WATCH" && belowBase ? { label: "HOLD \u2014 WATCH CLOSELY", sub: `Signals mixed \xB7 price attractive \xB7 market requires only ${cagrDisplay} EPS CAGR \u2014 wait for next print`, col: "#c59542" } : belowBase ? { label: "CONSIDER ADDING", sub: `Thesis ${thesisStatus.label.toLowerCase()} \xB7 below base floor \xB7 market requires only ${cagrDisplay} EPS CAGR`, col: "#66b278" } : inBase ? { label: "HOLD AND MONITOR", sub: `Thesis ${thesisStatus.label.toLowerCase()} \xB7 price fair \xB7 market requires ${cagrDisplay} EPS CAGR`, col: "#c59542" } : { label: "WAIT FOR PULLBACK", sub: `Thesis ${thesisStatus.label.toLowerCase()} \xB7 price stretched \xB7 market pricing ${cagrDisplay} EPS CAGR`, col: "#dd817a" };
  const ScoreCard = ({ question, answer, detail, col, panelKey, tipTitle: tipTitle2, tipBody }) => /* @__PURE__ */ React.createElement("div", { onClick: () => setPanel(panelKey), ...tipTitle2 ? tip(tipTitle2, tipBody, "Click to view full evidence below", col) : {}, style: {
    background: "var(--inner-bg)",
    border: `1px solid ${col}44`,
    borderLeft: `3px solid ${col}`,
    borderRadius: 8,
    padding: "14px 16px",
    cursor: "pointer",
    transition: "background .15s"
  } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 8, letterSpacing: "0.14em", color: "var(--tx6)", marginBottom: 5 } }, question), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11.5, fontWeight: 700, color: col, marginBottom: 5, letterSpacing: "0.06em" } }, answer), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--tx5)", lineHeight: 1.55 } }, detail), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 6, fontSize: 8, color: col, opacity: 0.7, letterSpacing: "0.1em" } }, "VIEW EVIDENCE \u203A"));
  const PANELS = [
    { key: "story", label: "\u2460 STORY", sub: "thesis \xB7 signals", tipTitle: "Story: Is the thesis still true?", tipBody: TEXT.current.panelTipStory },
    { key: "price", label: "\u2461 PRICE", sub: "fair value \xB7 P/E", tipTitle: "Price: Is today's price fair?", tipBody: `Compares NOW_PRICE to the base case band ($${baseLo}\u2013$${baseHi}). Below base = potential entry zone (thesis must still be intact). Inside = fair value. Above = stretched. Also shows P/E vs normal range (${VAL_CONFIG.pe_normal_lo}\u2013${VAL_CONFIG.pe_normal_hi}\xD7). Click to see price band visual and case requirements.` },
    { key: "mood", label: "\u2462 MOOD", sub: "market assumption", tipTitle: "Mood: What is the market pricing in?", tipBody: "The P/E multiple reveals crowd expectations. Shows where today's multiple sits vs the historical trough/normal/peak zones, plus the reverse DCF: what EPS growth rate the current price requires. Click to see full mood panel." },
    { key: "risk", label: "\u2463 RISK/REWARD", sub: "backtest \xB7 asymmetry", tipTitle: "Risk/Reward: Am I getting paid for the risk?", tipBody: "Asymmetry = bull upside / bear downside from NOW_PRICE. Also shows the rolling-window backtest: how well the bands held vs actual price. Click to see ReversionClock (dislocation timing signal) and TrackRecord." }
  ];
  return /* @__PURE__ */ React.createElement("div", { style: { padding: "0 22px 40px", fontFamily: FONT_MONO } }, /* @__PURE__ */ React.createElement("div", { style: {
    marginTop: 18,
    background: "var(--panel-bg)",
    border: `1px solid ${overallVerdict.col}33`,
    borderRadius: 10,
    padding: "18px 18px 14px"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.22em",
    color: "var(--tx6)",
    marginBottom: 14
  } }, "VERDICT \u2014 SO WHAT DO I DO?"), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 } }, /* @__PURE__ */ React.createElement(
    ScoreCard,
    {
      question: "IS THE THESIS STILL INTACT?",
      answer: `${thesisStatus.label} \u2014 ${thesisStatus.desc}`,
      detail: `${beats} beat \xB7 ${matches} match \xB7 ${misses} miss \xB7 ${allSigs.length} signals tracked`,
      col: thesisStatus.col,
      panelKey: "story",
      tipTitle: "Is the thesis still intact?",
      tipBody: `Tracks ${allSigs.length} KPI signals from the last earnings print. ${beats} beat, ${matches} match, ${misses} miss. WATCH = mixed signals, hold but don't add. BROKEN = kill-switch criteria met, exit. Current status: ${thesisStatus.label}.`
    }
  ), /* @__PURE__ */ React.createElement(
    ScoreCard,
    {
      question: "IS THE PRICE FAIR?",
      answer: belowBase ? "BELOW BASE \u2014 ENTRY ZONE" : inBase ? "INSIDE BASE RANGE" : "ABOVE BASE \u2014 STRETCHED",
      detail: `$${NOW_PRICE} now \xB7 base $${baseLo}\u2013$${baseHi} \xB7 P/E ${currentPE}\xD7`,
      col: verdictColor,
      panelKey: "price",
      tipTitle: "Is the price fair?",
      tipBody: `Base case fair value: $${baseLo}\u2013$${baseHi}. Current price: $${NOW_PRICE}. ${belowBase ? "Below base = potential entry zone \u2014 thesis must be intact to add." : inBase ? "Inside base range = fair value, hold and monitor." : "Above base = stretched, wait for pullback."} P/E ${currentPE}\xD7 vs normal ${VAL_CONFIG.pe_normal_lo}\u2013${VAL_CONFIG.pe_normal_hi}\xD7.`
    }
  ), /* @__PURE__ */ React.createElement(
    ScoreCard,
    {
      question: "WHAT IS THE MARKET ASSUMING?",
      answer: marketMood.label,
      detail: `P/E ${currentPE}\xD7 \xB7 requires ${cagrDisplay} EPS CAGR \xB7 FCF yield ${fcfYield}%`,
      col: marketMood.col,
      panelKey: "mood",
      tipTitle: "What is the market assuming?",
      tipBody: `At ${currentPE}\xD7 NTM P/E, the market requires a ${cagrDisplay} EPS CAGR over ${dcfN} years just to justify today's price (at ${dr}% discount rate, ${termPE}\xD7 terminal P/E). ${cagrNote} FCF yield ${fcfYield}% vs 10Y Treasury ${v.risk_free_pct}% \u2014 positive spread means equities still offer a risk premium above risk-free.`
    }
  ), /* @__PURE__ */ React.createElement(
    ScoreCard,
    {
      question: "AM I GETTING PAID FOR THE RISK?",
      answer: `${asymStatus.label} \u2014 ${asymStatus.desc}`,
      detail: `Bear \u2212${bearDown}% \xB7 Bull +${bullUp}% \xB7 FCF yield ${fcfYield}%`,
      col: asymStatus.col,
      panelKey: "risk",
      tipTitle: "Am I getting paid for the risk?",
      tipBody: `Asymmetry = bull upside \xF7 bear downside from $${NOW_PRICE}. Bull +${bullUp}% vs Bear \u2212${bearDown}% = ${asymRatio.toFixed(1)}\xD7 ratio. FAVORABLE (2\xD7+) = you make more being right than you lose being wrong. BALANCED (1\u20132\xD7) = even odds. UNFAVORABLE (<1\xD7) = downside exceeds upside \u2014 size very small or wait.`
    }
  )), /* @__PURE__ */ React.createElement("div", { ...tip("THE CURRENT \xB7 Final Call", `The verdict combines two signals: (1) thesis health \u2014 are the original reasons to own ${TICKER} still playing out? (2) price zone \u2014 is the market giving you a sensible entry? Both must be favourable for a 'consider adding' verdict. A broken thesis with a cheap price is still a broken thesis.`, `Current: thesis ${thesisStatus.label} \xB7 price ${belowBase ? "below base" : inBase ? "inside base" : "above base"}`, overallVerdict.col), style: {
    padding: "14px 16px",
    background: overallVerdict.col + "12",
    border: `1px solid ${overallVerdict.col}44`,
    borderRadius: 8
  } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, letterSpacing: "0.18em", color: overallVerdict.col, fontWeight: 700, marginBottom: 4 } }, "THE CURRENT \xB7 FINAL CALL"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15, fontWeight: 700, color: overallVerdict.col, letterSpacing: "0.06em", marginBottom: 4 } }, overallVerdict.label), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10.5, color: "var(--tx4)" } }, overallVerdict.sub)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, flexDirection: "column", alignItems: "flex-end", flexShrink: 0 } }, /* @__PURE__ */ React.createElement(
    "div",
    {
      style: {
        fontSize: 9.5,
        color: "var(--tx5)",
        background: "var(--inner-bg)",
        border: "1px solid var(--bd)",
        borderRadius: 5,
        padding: "5px 12px"
      },
      dangerouslySetInnerHTML: { __html: TEXT.current.watchChipHtml }
    }
  ), /* @__PURE__ */ React.createElement(
    "div",
    {
      style: {
        fontSize: 9.5,
        color: "#dd817a",
        background: "var(--inner-bg)",
        border: "1px solid #dd817a44",
        borderRadius: 5,
        padding: "5px 12px"
      },
      dangerouslySetInnerHTML: { __html: TEXT.current.exitChipHtml }
    }
  ))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--tx4)", lineHeight: 1.75, marginTop: 10 } }, thesisStatus.label === "BROKEN" ? TEXT.current.verdictBody.broken(NOW_PRICE) : thesisStatus.label === "WATCH" && belowBase ? TEXT.current.verdictBody.watchBelow(NOW_PRICE) : belowBase ? TEXT.current.verdictBody.below(NOW_PRICE) : inBase ? TEXT.current.verdictBody.inBase(NOW_PRICE, thesisStatus.label.toLowerCase()) : TEXT.current.verdictBody.above(NOW_PRICE)))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "stretch", gap: 0, margin: "18px 0 0" } }, PANELS.map(({ key, label, sub, tipTitle: tipTitle2, tipBody }, i) => {
    const isActive = panel === key;
    const colMap = { story: thesisStatus.col, price: verdictColor, mood: marketMood.col, risk: asymStatus.col };
    const col = colMap[key];
    const isFirst = i === 0;
    const isLast = i === PANELS.length - 1;
    const clip = isFirst ? "polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%)" : "polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%, 14px 50%)";
    return /* @__PURE__ */ React.createElement("div", { key, onClick: () => setPanel(key), ...tipBody ? tip(label, tipBody, null, col) : {}, style: {
      flex: 1,
      clipPath: clip,
      marginLeft: isFirst ? 0 : "14px",
      background: isActive ? col + "22" : "var(--panel-bg)",
      borderTop: `2px solid ${isActive ? col : "var(--bd)"}`,
      borderBottom: `2px solid ${isActive ? col : "var(--bd)"}`,
      padding: isFirst ? "12px 26px 12px 18px" : "12px 26px 12px 32px",
      cursor: "pointer",
      transition: "background .15s",
      outline: "none"
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      fontSize: 9.5,
      fontWeight: 700,
      letterSpacing: "0.14em",
      color: isActive ? col : "var(--tx4)",
      marginBottom: 3,
      whiteSpace: "nowrap"
    } }, label), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 8.5, color: isActive ? col : "var(--tx7)", whiteSpace: "nowrap", opacity: 0.85 } }, sub));
  })), /* @__PURE__ */ React.createElement("div", { style: {
    background: "var(--panel-bg)",
    border: "1px solid var(--bd)",
    borderRadius: 10,
    padding: "20px 18px",
    marginTop: 14
  } }, (panel === "story" || panel === "price") && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 9, marginBottom: 16 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 8.5, letterSpacing: "0.16em", color: "var(--tx5)" } }, "SCENARIO"), /* @__PURE__ */ React.createElement(Segmented, { active, setActive, small: true })), panel === "story" && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.2em",
    color: "var(--tx5)",
    marginBottom: 18,
    paddingBottom: 8,
    borderBottom: "1px solid var(--bd)"
  } }, "IS THE THESIS STILL INTACT?"), /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    alignItems: "flex-start",
    gap: 14,
    padding: "10px 14px",
    background: thesisStatus.col + "12",
    border: `1px solid ${thesisStatus.col}44`,
    borderLeft: `3px solid ${thesisStatus.col}`,
    borderRadius: 7,
    marginBottom: 18
  } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.16em",
    color: thesisStatus.col,
    marginBottom: 3
  } }, thesisStatus.label, " \u2014 ", thesisStatus.desc), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9.5, color: "var(--tx5)", marginBottom: 3 } }, beats, " BEAT \xB7 ", matches, " MATCH \xB7 ", misses, " MISS \xB7 ", allSigs.length, " signals tracked \xB7 ", HISTORY[HISTORY.length - 2].q, " actuals"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--tx3)", lineHeight: 1.6 } }, misses >= 3 ? TEXT.current.statusNarrative.broken : misses >= 2 ? TEXT.current.statusNarrative.watch : TEXT.current.statusNarrative.intact))), /* @__PURE__ */ React.createElement("div", { className: "resp-2col-main", style: {
    display: "grid",
    gridTemplateColumns: "1.05fr 1fr",
    gap: 1,
    background: "var(--bd)",
    borderRadius: 8,
    overflow: "hidden"
  } }, /* @__PURE__ */ React.createElement("div", { style: { background: "var(--inner-bg)", padding: "16px 18px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11.5, letterSpacing: "0.18em", color: "var(--tx4)" } }, /* @__PURE__ */ React.createElement("span", { style: { background: "var(--bd)", padding: "2px 6px", borderRadius: 3, color: "var(--tx1)", marginRight: 8 } }, "NOW"), TICKER, " \xB7 PRICE & RISK-REWARD")), /* @__PURE__ */ React.createElement("div", { className: "panel", key: "cur-chart-" + active }, /* @__PURE__ */ React.createElement(FanChart, { c })), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 6, display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "var(--tx5)" } }, /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("span", { style: { color: c.accent } }, "\u2501\u2501"), " ", c.label.toLowerCase(), " mid \xA0", /* @__PURE__ */ React.createElement("span", { style: { color: "#46aad9" } }, "\u250A"), " now \xA0", /* @__PURE__ */ React.createElement("span", { style: { color: "var(--tx1)" } }, "\u2501"), " history"), /* @__PURE__ */ React.createElement("span", null, "12M TARGET ", /* @__PURE__ */ React.createElement("span", { style: { color: c.accent, fontWeight: 700 } }, c.target12))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 18, borderTop: "1px solid var(--bd)", paddingTop: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11.5, letterSpacing: "0.16em", color: "var(--tx4)", marginBottom: 4 } }, /* @__PURE__ */ React.createElement("span", { style: { background: "var(--bd)", padding: "2px 6px", borderRadius: 3, color: "var(--tx1)", marginRight: 8 } }, "KPI \xB7 K01"), TEXT.current.kpiTitle, /* @__PURE__ */ React.createElement("span", { style: { color: "var(--tx5)", marginLeft: 8 } }, TEXT.current.kpiSub)), /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "panel",
      key: "cur-kpi-" + active,
      style: { display: "flex", alignItems: "flex-end", gap: 10, height: 120, padding: "12px 4px 0" }
    },
    /* @__PURE__ */ React.createElement(KpiCol, { label: HISTORY[HISTORY.length - 2].q, val: KPI_HIST, baseline: true, accentColor: "var(--tx4)" }),
    KPI_PROJ[active].map((pv, i) => /* @__PURE__ */ React.createElement(KpiCol, { key: i, label: FUTURE_Q[i], val: pv, accentColor: c.accent, delay: i * 0.08 }))
  ), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 12, fontSize: 11, lineHeight: 1.5 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { color: "var(--tx5)", letterSpacing: "0.12em", marginBottom: 3 } }, "WHAT THIS MEASURES"), /* @__PURE__ */ React.createElement("div", { style: { color: "var(--tx3)" } }, TEXT.current.kpiMeasures)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { color: "var(--tx5)", letterSpacing: "0.12em", marginBottom: 3 } }, "WHAT THE ", /* @__PURE__ */ React.createElement("span", { style: { color: c.accent } }, c.label), " CASE REQUIRES"), /* @__PURE__ */ React.createElement("div", { style: { color: c.accent } }, TEXT.current.kpiRequires[active]))))), /* @__PURE__ */ React.createElement("div", { style: { background: "var(--inner-bg)", padding: "16px 18px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11.5, letterSpacing: "0.18em", color: "var(--tx4)" } }, "THESIS \xB7 ALL SIGNALS"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--tx4)" } }, c.label.toLowerCase(), " 12M ", /* @__PURE__ */ React.createElement("span", { style: { color: c.accent, fontWeight: 700 } }, c.target12))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "center", marginBottom: 12 } }, /* @__PURE__ */ React.createElement("span", { className: "dot-track", style: { fontSize: 10.5, color: c.accent } }, "\u25CF TRACKING")), /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "panel",
      key: "cur-op-" + active,
      style: { fontSize: 12.5, lineHeight: 1.6, color: "var(--tx2)", marginBottom: 16, minHeight: 72 }
    },
    c.op
  ), /* @__PURE__ */ React.createElement(
    SignalGroup,
    {
      id: "SN01",
      title: TEXT.current.group1Title,
      requires: c.requires01,
      accent: c.accent,
      evidence: 3
    },
    SIGNALS[active].map((s, i) => /* @__PURE__ */ React.createElement(SignalRow, { key: i, s, accent: c.accent }))
  ), /* @__PURE__ */ React.createElement(
    SignalGroup,
    {
      id: "SN02",
      title: TEXT.current.group2Title,
      requires: c.requires02,
      accent: c.accent,
      evidence: 3
    },
    MARGIN[active].map((s, i) => /* @__PURE__ */ React.createElement(MarginRow, { key: i, s, accent: c.accent }))
  ), /* @__PURE__ */ React.createElement("div", { style: {
    marginTop: 14,
    padding: "10px 12px",
    background: "var(--panel-bg)",
    border: "1px solid #dd817a44",
    borderLeft: "3px solid #dd817a",
    borderRadius: 6
  } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 8.5, letterSpacing: "0.18em", color: "#dd817a", fontWeight: 700, marginBottom: 4 } }, "\u26A0 KILL-SWITCH"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--tx3)", lineHeight: 1.6 } }, TEXT.current.killSwitch))))), panel === "price" && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.2em",
    color: "var(--tx5)",
    marginBottom: 18,
    paddingBottom: 8,
    borderBottom: "1px solid var(--bd)"
  } }, "IS THE PRICE FAIR?"), /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    alignItems: "flex-start",
    gap: 14,
    padding: "10px 14px",
    background: verdictColor + "12",
    border: `1px solid ${verdictColor}44`,
    borderLeft: `3px solid ${verdictColor}`,
    borderRadius: 7,
    marginBottom: 18
  } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", color: verdictColor, marginBottom: 3 } }, belowBase ? "PRICE BELOW BASE \u2014 POTENTIAL ENTRY ZONE" : inBase ? "PRICE WITHIN BASE RANGE \u2014 HOLD / MONITOR" : "PRICE ABOVE BASE \u2014 ELEVATED EXPECTATIONS"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9.5, color: "var(--tx5)", marginBottom: 3 } }, "$", NOW_PRICE, " now \xB7 base range $$", baseLo, "\u2013$$", baseHi, " \xB7 P/E ", currentPE, "\xD7 on $", v.ntm_eps, " NTM EPS"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--tx3)", lineHeight: 1.6 } }, belowBase ? TEXT.current.priceBanner.below(NOW_PRICE, baseLo) : inBase ? TEXT.current.priceBanner.inBase(NOW_PRICE) : TEXT.current.priceBanner.above(NOW_PRICE, baseHi)))), /* @__PURE__ */ React.createElement("div", { style: { background: "var(--inner-bg)", border: "1px solid var(--bd)", borderRadius: 8, padding: "18px 16px", marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, letterSpacing: "0.14em", color: "var(--tx6)", marginBottom: 14 } }, "12-MONTH PRICE TARGETS \xB7 BEAR / BASE / BULL"), ["bull", "base", "bear"].map((k) => {
    const cc = CASES[k];
    const parts = parseBand(cc.target12);
    const lo = parts[0], hi = parts[1];
    const totalRange = bullHi - bearLo;
    const leftPct = (lo - bearLo) / totalRange * 100;
    const widthPct = (hi - lo) / totalRange * 100;
    const nowPct = (NOW_PRICE - bearLo) / totalRange * 100;
    return /* @__PURE__ */ React.createElement("div", { key: k, style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 9.5, marginBottom: 5 } }, /* @__PURE__ */ React.createElement("span", { style: { color: cc.accent, fontWeight: 700 } }, cc.label), /* @__PURE__ */ React.createElement("span", { style: { color: cc.accent } }, cc.target12)), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", height: 12, background: "var(--bd)", borderRadius: 6 } }, /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      left: `${leftPct}%`,
      width: `${widthPct}%`,
      height: "100%",
      background: cc.accent + "55",
      borderRadius: 6
    } }), k === "base" && /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      left: `${nowPct}%`,
      top: -3,
      width: 3,
      height: 18,
      background: "var(--title)",
      borderRadius: 2,
      transform: "translateX(-50%)",
      zIndex: 2
    } })), k === "base" && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 8.5, color: "var(--tx5)", marginTop: 3 } }, "\u25B2 NOW $", NOW_PRICE, " \xB7 ", NOW_PRICE < lo ? `$${lo - NOW_PRICE} below base floor` : NOW_PRICE > hi ? `$${NOW_PRICE - hi} above base ceiling` : "inside base range"));
  })), /* @__PURE__ */ React.createElement("div", { className: "resp-3col", style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 } }, [
    { label: "CURRENT P/E", val: (NOW_PRICE / v.ntm_eps).toFixed(1) + "\xD7", sub: `on $${v.ntm_eps} NTM EPS`, col: "var(--blue-soft)" },
    { label: "NORMAL RANGE", val: `${v.pe_normal_lo}\u2013${v.pe_normal_hi}\xD7`, sub: "historical base multiple", col: "var(--tx3)" },
    { label: "TROUGH / PEAK", val: `${v.pe_trough}\xD7 / ${v.pe_peak}\xD7`, sub: "fear floor \xB7 euphoria ceiling", col: "var(--tx5)" }
  ].map(({ label, val, sub, col }) => /* @__PURE__ */ React.createElement("div", { key: label, style: { background: "var(--inner-bg)", border: "1px solid var(--bd)", borderRadius: 8, padding: "12px 14px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 8.5, letterSpacing: "0.12em", color: "var(--tx6)", marginBottom: 5 } }, label), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 18, fontWeight: 700, color: col } }, val), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: "var(--tx6)", marginTop: 3 } }, sub)))), /* @__PURE__ */ React.createElement("div", { style: { background: "var(--inner-bg)", border: `1px solid ${c.accent}44`, borderRadius: 8, padding: "12px 16px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 8.5, letterSpacing: "0.14em", color: c.accent, fontWeight: 700, marginBottom: 6 } }, "WHAT THE ", c.label, " PRICE REQUIRES"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--tx3)", lineHeight: 1.65, marginBottom: 6 } }, c.requires01), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--tx3)", lineHeight: 1.65 } }, c.requires02))), panel === "mood" && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.2em",
    color: "var(--tx5)",
    marginBottom: 18,
    paddingBottom: 8,
    borderBottom: "1px solid var(--bd)"
  } }, "WHAT IS THE MARKET CURRENTLY ASSUMING?"), /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    alignItems: "flex-start",
    gap: 14,
    padding: "10px 14px",
    background: marketMood.col + "12",
    border: `1px solid ${marketMood.col}44`,
    borderLeft: `3px solid ${marketMood.col}`,
    borderRadius: 7,
    marginBottom: 16
  } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", color: marketMood.col, marginBottom: 3 } }, marketMood.label, " \u2014 ", marketMood.sub), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9.5, color: "var(--tx5)", marginBottom: 4 } }, "P/E ", currentPE, "\xD7 \xB7 normal ", v.pe_normal_lo, "\u2013", v.pe_normal_hi, "\xD7 \xB7 trough ", v.pe_trough, "\xD7 \xB7 peak ", v.pe_peak, "\xD7"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--tx3)", lineHeight: 1.6 } }, TEXT.current.moodBanner(currentPE, v.pe_normal_lo, v.pe_normal_hi), " ", "The reverse DCF says the crowd is only requiring ", /* @__PURE__ */ React.createElement("span", { style: { color: cagrColor, fontWeight: 700 } }, cagrDisplay, " EPS CAGR"), " to justify today's price. ", cagrNote))), /* @__PURE__ */ React.createElement(
    "div",
    {
      ...tip("Reverse DCF \u2014 what is the market pricing in?", `Works backwards from today's price: given a discount rate and terminal multiple, what annual EPS growth rate must the market be embedding? At $${NOW_PRICE}, the required CAGR is ${cagrDisplay}. ${cagrNote} Adjust sliders to stress-test assumptions.`, "Low required CAGR = not priced for perfection. High = very little room for error.", cagrColor),
      style: { padding: "14px 16px", background: "var(--inner-bg)", border: `1px solid ${cagrColor}44`, borderRadius: 8, marginBottom: 14 }
    },
    /* @__PURE__ */ React.createElement("div", { style: { fontSize: 8.5, letterSpacing: "0.14em", color: "var(--tx6)", marginBottom: 12 } }, "REVERSE DCF \xB7 IMPLIED EPS CAGR"),
    /* @__PURE__ */ React.createElement("div", { className: "resp-2col", style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 } }, [
      { label: "DISCOUNT RATE", val: dr, set: setDr, min: 6, max: 14, step: 0.5, fmt: (v2) => `${v2.toFixed(1)}%` },
      { label: `TERMINAL P/E (${dcfN}YR)`, val: termPE, set: setTermPE, min: 15, max: 35, step: 1, fmt: (v2) => `${v2}\xD7` }
    ].map(({ label, val, set, min, max, step, fmt }) => /* @__PURE__ */ React.createElement("div", { key: label }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: "var(--tx6)", letterSpacing: "0.1em", marginBottom: 5 } }, label), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "range",
        min,
        max,
        step,
        value: val,
        onChange: (e) => set(+e.target.value),
        style: { width: "100%", accentColor: cagrColor, cursor: "pointer" }
      }
    ), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: cagrColor, fontWeight: 700, marginTop: 3 } }, fmt(val))))),
    /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 14px", background: "var(--panel-bg)", borderRadius: 6, border: `1px solid ${cagrColor}33` } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: "var(--tx6)", marginBottom: 4, letterSpacing: "0.1em" } }, "AT $", NOW_PRICE, ", MARKET REQUIRES"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 28, fontWeight: 700, color: cagrColor, lineHeight: 1 } }, cagrDisplay, " EPS CAGR"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9.5, color: "var(--tx7)", margin: "4px 0 8px" } }, "over ", dcfN, "yr \xB7 NTM EPS $$", v.ntm_eps, " \xB7 $", dcfN, "yr terminal ", termPE, "\xD7 \xB7 discount ", dr, "%"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10.5, color: "var(--tx3)", lineHeight: 1.55 } }, cagrNote))
  ), /* @__PURE__ */ React.createElement("div", { className: "resp-2col", style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 } }, /* @__PURE__ */ React.createElement(
    "div",
    {
      ...tip("Price-implied full-year revenue", TEXT.current.fy26CardTip(fyRevBase.toFixed(1)), null, "var(--blue-soft)"),
      style: { background: "var(--inner-bg)", border: "1px solid var(--bd)", borderRadius: 8, padding: "14px 16px" }
    },
    /* @__PURE__ */ React.createElement("div", { style: { fontSize: 8.5, letterSpacing: "0.14em", color: "var(--tx6)", marginBottom: 10 } }, "PRICE-IMPLIED FY REVENUE"),
    /* @__PURE__ */ React.createElement(
      "div",
      {
        style: { fontSize: 10.5, color: "var(--tx3)", lineHeight: 1.7, marginBottom: 12 },
        dangerouslySetInnerHTML: { __html: TEXT.current.fy26CardHtml(fyRevBase.toFixed(1), ((fyRevBase / v.prior_fy_rev_b - 1) * 100).toFixed(0)) }
      }
    ),
    /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 9.5, marginBottom: 3 } }, /* @__PURE__ */ React.createElement("span", { style: { color: "var(--tx5)" } }, v.prior_fy_label, " actual revenue"), /* @__PURE__ */ React.createElement("span", { style: { color: "#66b278", fontWeight: 700 } }, "$", v.prior_fy_rev_b, "B")),
    /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 9.5 } }, /* @__PURE__ */ React.createElement("span", { style: { color: "var(--tx5)" } }, "Implied FY (base case)"), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--blue-soft)", fontWeight: 700 } }, "~$", fyRevBase.toFixed(1), "B"))
  ), /* @__PURE__ */ React.createElement(
    "div",
    {
      ...tip("FCF Yield vs risk-free", `FCF yield = NTM FCF \xF7 market cap. At ${fcfYield}%, ${TICKER}'s cash yield is ${(parseFloat(fcfYield) - v.risk_free_pct).toFixed(2)}% above the 10Y Treasury (${v.risk_free_pct}%). Positive spread = some compensation above risk-free. Below Treasury = paying purely for growth.`, null, parseFloat(fcfYield) > 3.5 ? "#66b278" : parseFloat(fcfYield) > 2.5 ? "#c59542" : "#dd817a"),
      style: { background: "var(--inner-bg)", border: "1px solid var(--bd)", borderRadius: 8, padding: "14px 16px" }
    },
    /* @__PURE__ */ React.createElement("div", { style: { fontSize: 8.5, letterSpacing: "0.14em", color: "var(--tx6)", marginBottom: 10 } }, "FCF YIELD \u2014 AM I BEING PAID FAIRLY?"),
    /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "baseline", gap: 10, marginBottom: 6 } }, /* @__PURE__ */ React.createElement("div", { style: {
      fontSize: 28,
      fontWeight: 700,
      color: parseFloat(fcfYield) > 3.5 ? "#66b278" : parseFloat(fcfYield) > 2.5 ? "#c59542" : "#dd817a"
    } }, fcfYield, "%"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9.5, color: "var(--tx6)" } }, "vs Treasury ", v.risk_free_pct, "% \xA0", /* @__PURE__ */ React.createElement("span", { style: { color: parseFloat(fcfYield) > v.risk_free_pct ? "#66b278" : "#dd817a", fontWeight: 700 } }, "(", parseFloat(fcfYield) > v.risk_free_pct ? "+" : "", (parseFloat(fcfYield) - v.risk_free_pct).toFixed(2), "%)"))),
    /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9.5, color: "var(--tx5)", marginBottom: 10 } }, "$", v.fcf_ntm_b, "B NTM FCF \xF7 $", (NOW_PRICE * v.shares_b).toFixed(0), "B mkt cap"),
    /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10.5, color: "var(--tx3)", lineHeight: 1.65 } }, parseFloat(fcfYield) > 3.5 ? "Above 3.5% \u2014 reasonable compensation. Market not pricing in runaway growth." : parseFloat(fcfYield) > 2.5 ? "2.5\u20133.5% range \u2014 fair but not cheap. Growth must play out." : "Below 2.5% \u2014 expensive on cash flow. Growth premium fully baked in.")
  )), /* @__PURE__ */ React.createElement("div", { style: { background: "var(--inner-bg)", border: "1px solid var(--bd)", borderRadius: 8, padding: "14px 16px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 8.5, letterSpacing: "0.14em", color: "var(--tx6)", marginBottom: 12 } }, "PEER COMPS \u2014 FORWARD MULTIPLES"), /* @__PURE__ */ React.createElement("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 11 } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { style: { borderBottom: "1px solid var(--bd2)" } }, ["TICKER", "FWD P/E", "EV/EBITDA", "FCF YIELD", "CONTEXT"].map((h, i) => /* @__PURE__ */ React.createElement("th", { key: i, style: {
    padding: "4px 8px",
    textAlign: i === 0 ? "left" : i === 4 ? "left" : "right",
    color: "var(--tx7)",
    fontSize: 9,
    letterSpacing: "0.1em",
    fontWeight: 400
  } }, h)))), /* @__PURE__ */ React.createElement("tbody", null, v.peers.map((p) => {
    const isHolding = p.t === TICKER_META.ticker;
    const col = isHolding ? "var(--blue-soft)" : "var(--tx5)";
    return /* @__PURE__ */ React.createElement(
      "tr",
      {
        key: p.t,
        ...tip(p.t, `${p.note}. FWD P/E: ${p.fpe}\xD7 \xB7 EV/EBITDA: ${p.ev_eb}\xD7 \xB7 FCF yield: ${p.fcf_y}%`, isHolding ? "Your holding" : null, col),
        style: {
          borderBottom: "1px solid var(--bd)",
          background: isHolding ? "var(--row-hl)" : "transparent",
          transition: "background .1s"
        }
      },
      /* @__PURE__ */ React.createElement("td", { style: { padding: "7px 8px", color: isHolding ? "var(--title)" : "var(--tx4)", fontWeight: isHolding ? 700 : 400 } }, p.t),
      /* @__PURE__ */ React.createElement("td", { style: { padding: "7px 8px", textAlign: "right", color: col, fontWeight: isHolding ? 700 : 400 } }, p.fpe, "\xD7"),
      /* @__PURE__ */ React.createElement("td", { style: { padding: "7px 8px", textAlign: "right", color: col, fontWeight: isHolding ? 700 : 400 } }, p.ev_eb, "\xD7"),
      /* @__PURE__ */ React.createElement("td", { style: { padding: "7px 8px", textAlign: "right", color: col, fontWeight: isHolding ? 700 : 400 } }, p.fcf_y, "%"),
      /* @__PURE__ */ React.createElement("td", { style: { padding: "7px 8px", color: "var(--tx7)", fontSize: 9.5 } }, p.note)
    );
  }))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 10, fontSize: 10.5, color: "var(--tx4)", lineHeight: 1.55 } }, TEXT.current.peerCommentary((NOW_PRICE / v.ntm_eps).toFixed(1))))), panel === "risk" && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.2em",
    color: "var(--tx5)",
    marginBottom: 18,
    paddingBottom: 8,
    borderBottom: "1px solid var(--bd)"
  } }, "AM I GETTING PAID FOR THE RISK?"), /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    alignItems: "flex-start",
    gap: 14,
    padding: "10px 14px",
    background: asymStatus.col + "12",
    border: `1px solid ${asymStatus.col}44`,
    borderLeft: `3px solid ${asymStatus.col}`,
    borderRadius: 7,
    marginBottom: 18
  } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", color: asymStatus.col, marginBottom: 3 } }, asymStatus.label, " \u2014 ", asymStatus.desc), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9.5, color: "var(--tx5)", marginBottom: 3 } }, "Bear \u2212", bearDown, "% \xB7 Bull +", bullUp, "% \xB7 ratio ", asymRatio.toFixed(1), "\xD7 upside per unit of downside \xB7 FCF yield ", fcfYield, "%"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--tx3)", lineHeight: 1.6 } }, "From $", NOW_PRICE, ": bear costs $", NOW_PRICE - bearLo, " (\u2212", bearDown, "%), bull gains $", bullHi - NOW_PRICE, " (+", bullUp, "%). For every dollar at risk, ", asymRatio.toFixed(1), "\xD7 potential gain."))), /* @__PURE__ */ React.createElement(TrackRecord, null))));
}
function FutureTab() {
  const [panel, setPanel] = useState("outcomes");
  const STORE_KEY = "th3sis_portfolio";
  const PORTFOLIO_SCHEMA_VERSION = 1;
  const defaultStore = () => ({ version: PORTFOLIO_SCHEMA_VERSION, cycleAmount: 800, cycleDays: 15, cycles: [] });
  const loadStore = () => loadStorage(STORE_KEY, PORTFOLIO_SCHEMA_VERSION, defaultStore());
  const [store, setStore] = useState(loadStore);
  const saveStore = (s) => {
    localStorage.setItem(STORE_KEY, JSON.stringify(s));
    setStore(s);
  };
  const [editingCycle, setEditingCycle] = useState(null);
  const [cycleForm, setCycleForm] = useState({ date: "", deployed: "", saved: "", note: "" });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsForm, setSettingsForm] = useState({ cycleAmount: 800, cycleDays: 15 });
  const [clearPending, setClearPending] = useState(false);
  const [checks, setChecks] = useState(() => {
    var _a;
    return ((_a = loadPos()) == null ? void 0 : _a.checks) || DEFAULT_CHECKS();
  });
  const [tranches, setTranches] = useState(() => {
    var _a;
    return ((_a = loadPos()) == null ? void 0 : _a.tranches) || DEFAULT_TRANCHES;
  });
  const [existing, setExisting] = useState(() => {
    var _a;
    const sv = (_a = loadPos()) == null ? void 0 : _a.existing;
    if (!sv) return [{ id: 1, price: "", shares: "", date: "" }];
    if (!Array.isArray(sv)) return [{ id: 1, price: sv.price || "", shares: sv.shares || "", date: sv.date || "" }];
    return sv;
  });
  const [portfolioK, setPortfolioK] = useState(() => {
    var _a;
    return ((_a = loadPos()) == null ? void 0 : _a.portfolioK) || 100;
  });
  const [posPct, setPosPct] = useState(() => {
    var _a;
    return ((_a = loadPos()) == null ? void 0 : _a.posPct) || 2;
  });
  const [flash, setFlash] = useState(false);
  const toggle = (key) => setChecks((c) => ({ ...c, [key]: !c[key] }));
  const updateT = (id, fld, val) => setTranches((ts) => ts.map((t) => {
    if (t.id !== id) return t;
    const u = { ...t, [fld]: val };
    if (!t.date && u.price && u.shares) u.date = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    return u;
  }));
  const addTranche = () => setTranches((ts) => [...ts, { id: Date.now(), label: `TRANCHE ${ts.length + 1}`, price: "", shares: "", date: null, note: "" }]);
  const deleteTranche = (id) => setTranches((ts) => ts.filter((t) => t.id !== id));
  const updateEx = (id, fld, val) => setExisting((exs) => exs.map((e) => e.id === id ? { ...e, [fld]: val } : e));
  const addExisting = () => setExisting((exs) => [...exs, { id: Date.now(), price: "", shares: "", date: "" }]);
  const delExisting = (id) => setExisting((exs) => exs.length > 1 ? exs.filter((e) => e.id !== id) : exs);
  const clearPos = () => {
    localStorage.removeItem(POS_KEY);
    setTranches(DEFAULT_TRANCHES);
    setChecks(DEFAULT_CHECKS());
    setExisting([{ id: 1, price: "", shares: "", date: "" }]);
    setPortfolioK(100);
    setPosPct(2);
    setClearPending(false);
  };
  const allGreen = Object.values(checks).every(Boolean);
  const greenCount = Object.values(checks).filter(Boolean).length;
  const filled = tranches.filter((t) => +t.price > 0 && +t.shares > 0);
  const totShares = filled.reduce((s, t) => s + +t.shares, 0);
  const totCost = filled.reduce((s, t) => s + +t.price * +t.shares, 0);
  const blended = totShares > 0 ? totCost / totShares : 0;
  const exFilled = existing.filter((e) => +e.price > 0 && +e.shares > 0);
  const exShares = exFilled.reduce((s, e) => s + +e.shares, 0);
  const exCost = exFilled.reduce((s, e) => s + +e.price * +e.shares, 0);
  const exBasis = exShares > 0 ? exCost / exShares : 0;
  const allShares = totShares + exShares;
  const allCost = totCost + exCost;
  const blendedAll = allShares > 0 ? allCost / allShares : 0;
  const posRef = blendedAll > 0 ? blendedAll : blended > 0 ? blended : NOW_PRICE;
  const [POS_BEAR_LO, POS_BEAR_HI] = parseBand(CASES.bear.target12);
  const [POS_BASE_LO, POS_BASE_HI] = parseBand(CASES.base.target12);
  const [POS_BULL_LO, POS_BULL_HI] = parseBand(CASES.bull.target12);
  const POS_BEAR_MID = Math.round((POS_BEAR_LO + POS_BEAR_HI) / 2);
  const portVal = portfolioK * 1e3;
  const posPosVal = portVal * posPct / 100;
  const posBearLoss = posPosVal * (POS_BEAR_MID - posRef) / posRef;
  const posBearLossPct = (posBearLoss / portVal * 100).toFixed(2);
  const posAbsLoss = Math.abs(parseFloat(posBearLossPct));
  const posInputStyle = {
    width: "100%",
    textAlign: "right",
    background: "var(--inner-bg)",
    border: "1px solid var(--bd2)",
    borderRadius: 4,
    padding: "5px 8px",
    fontSize: 11,
    color: "var(--tx1)",
    fontFamily: FONT_MONO,
    outline: "none"
  };
  useEffect(() => {
    localStorage.setItem(POS_KEY, JSON.stringify({ version: 1, existing, checks, tranches, portfolioK, posPct }));
    setFlash(true);
    const ft = setTimeout(() => setFlash(false), 1e3);
    return () => clearTimeout(ft);
  }, [existing, checks, tranches, portfolioK, posPct]);
  const bearLo = POS_BEAR_LO, bearHi = POS_BEAR_HI;
  const baseLo = POS_BASE_LO, baseHi = POS_BASE_HI;
  const bullLo = POS_BULL_LO, bullHi = POS_BULL_HI;
  const bearMid = Math.round((bearLo + bearHi) / 2);
  const baseMid = Math.round((baseLo + baseHi) / 2);
  const bullMid = Math.round((bullLo + bullHi) / 2);
  const bearPct = Math.round((bearMid - NOW_PRICE) / NOW_PRICE * 100);
  const basePct = Math.round((baseMid - NOW_PRICE) / NOW_PRICE * 100);
  const bullPct = Math.round((bullMid - NOW_PRICE) / NOW_PRICE * 100);
  const totalDeployed = store.cycles.reduce((s, c) => s + (parseFloat(c.deployed) || 0), 0);
  const totalSaved = store.cycles.reduce((s, c) => s + (parseFloat(c.saved) || 0), 0);
  const warChest = totalSaved;
  const sigs = SIGNALS.base.concat(MARGIN.base);
  const misses = sigs.filter((s) => s.tag === "MISS").length;
  const thesisOk = misses < 2;
  const thesisBroke = misses >= 3;
  const belowBase = NOW_PRICE < baseLo;
  const inBase = NOW_PRICE >= baseLo && NOW_PRICE <= baseHi;
  const aboveBase = NOW_PRICE > baseHi;
  const currentPE = (NOW_PRICE / VAL_CONFIG.ntm_eps).toFixed(1);
  const fcfYield = (VAL_CONFIG.fcf_ntm_b / (NOW_PRICE * VAL_CONFIG.shares_b) * 100).toFixed(1);
  const deployMode = (() => {
    if (thesisBroke) return { label: "EXIT", sub: "Kill-switch criteria met \u2014 close the position", col: "#dd817a", range: "" };
    if (belowBase && thesisOk && warChest >= 600)
      return { label: "DEPLOY", sub: "Thesis intact \xB7 price below base floor \xB7 war chest ready", col: "#66b278", range: "$600\u2013800+" };
    if (belowBase && warChest >= 200)
      return { label: "NIBBLE", sub: "Price attractive \xB7 preserve dry powder for adds", col: "#c59542", range: "$200\u2013400" };
    if (inBase && thesisOk && warChest >= 400)
      return { label: "ADD", sub: "Thesis intact \xB7 normal cadence add", col: "#66b278", range: "$400\u2013600" };
    if (aboveBase)
      return { label: "WAIT", sub: "Price stretched \u2014 let it come to you", col: "#dd817a", range: "" };
    return { label: "NIBBLE", sub: "Forming conviction \xB7 skin in the game only", col: "#c59542", range: "$200\u2013400" };
  })();
  const upside = bullMid - NOW_PRICE;
  const downside = NOW_PRICE - bearMid;
  const asymRatio = downside > 0 ? (upside / downside).toFixed(1) : "\u221E";
  const dislocDays = Math.round((Date.now() - new Date(DISLOCATION_DATE)) / 864e5);
  const dislocSignal = NOW_PRICE <= REVERSION_BASEFLOOR ? { label: "DISLOCATION", sub: `${dislocDays}d since event \xB7 still below base floor`, col: "#66b278" } : { label: "RECOVERING", sub: `${dislocDays}d since event \xB7 $${Math.round(REVERSION_BASEFLOOR - NOW_PRICE) < 0 ? Math.round(NOW_PRICE - REVERSION_BASEFLOOR) : Math.round(REVERSION_BASEFLOOR - NOW_PRICE)} ${NOW_PRICE < REVERSION_BASEFLOOR ? "below" : "above"} base floor`, col: "#c59542" };
  const ScoreCard = ({ question, answer, detail, col, panelKey, tipTitle: tipTitle2, tipBody }) => /* @__PURE__ */ React.createElement("div", { onClick: () => setPanel(panelKey), ...tipTitle2 ? tip(tipTitle2, tipBody, "Click to view full detail below", col) : {}, style: {
    background: "var(--inner-bg)",
    border: `1px solid ${col}44`,
    borderLeft: `3px solid ${col}`,
    borderRadius: 8,
    padding: "14px 16px",
    cursor: "pointer",
    transition: "background .15s",
    flex: 1
  } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 8, letterSpacing: "0.14em", color: "var(--tx6)", marginBottom: 5 } }, question), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11.5, fontWeight: 700, color: col, marginBottom: 5, letterSpacing: "0.06em" } }, answer), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--tx5)", lineHeight: 1.55 } }, detail), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 6, fontSize: 8, color: col, opacity: 0.7, letterSpacing: "0.1em" } }, "VIEW DETAIL \u203A"));
  const chevrons = [
    { key: "outcomes", label: "\u2460 OUTCOMES", col: bullPct > 0 ? "#66b278" : "#dd817a", tipBody: `12-month scenario returns: Bear ${bearPct}%, Base ${basePct >= 0 ? "+" : ""}${basePct}%, Bull +${bullPct}%. Includes a position value calculator \u2014 enter your share count to see real dollar P&L per scenario.` },
    { key: "downside", label: "\u2461 DOWNSIDE", col: belowBase ? "#66b278" : "#c59542", tipBody: `Bear case risk: $${bearMid} target (${bearPct}% from $${NOW_PRICE}). Portfolio loss calculator lets you enter your portfolio size and position % to see exact dollar risk. ${TEXT.future.downsideChevronTip}` },
    { key: "signal", label: "\u2462 SIGNAL", col: dislocSignal.col, tipBody: `Price attractiveness signals: NTM P/E ${currentPE}\xD7 vs 10Y range (${VAL_CONFIG.pe_trough}\u2013${VAL_CONFIG.pe_peak}\xD7), dislocation clock (${dislocDays}d since ${TEXT.future.dislocEventName}), and FCF yield (${fcfYield}%) vs 10Y Treasury (${VAL_CONFIG.risk_free_pct}%). Is today a better or worse entry than historical norms?` },
    { key: "capital", label: "\u2463 CAPITAL & POSITION", col: warChest >= 400 ? "#66b278" : warChest >= 200 ? "#c59542" : "#dd817a", tipBody: `War chest tracker + your ${TICKER} position ledger. Log each investing cycle (deployed + saved). Track your existing pre-thesis position, thesis-driven adds, and combined blended basis. Sizing check calculates bear-case dollar loss at your position size. Thesis checks gate whether it is time to add.` }
  ];
  const openAdd = () => {
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
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
      date: cycleForm.date,
      deployed: parseFloat(cycleForm.deployed) || 0,
      saved: parseFloat(cycleForm.saved) || 0,
      note: cycleForm.note
    };
    const cycles = editingCycle === "new" ? [...store.cycles, newCycle] : store.cycles.map((c) => c.id === editingCycle ? newCycle : c);
    saveStore({ ...store, cycles });
    setEditingCycle(null);
  };
  const deleteCycle = (id) => saveStore({ ...store, cycles: store.cycles.filter((c) => c.id !== id) });
  const saveSettings = () => {
    saveStore({
      ...store,
      cycleAmount: parseFloat(settingsForm.cycleAmount) || 800,
      cycleDays: parseFloat(settingsForm.cycleDays) || 15
    });
    setSettingsOpen(false);
  };
  const Banner = ({ status, desc, col, summary }) => /* @__PURE__ */ React.createElement("div", { style: {
    padding: "10px 14px",
    borderRadius: 6,
    background: `${col}18`,
    border: `1px solid ${col}44`,
    marginBottom: 14
  } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: summary ? 4 : 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: col } }, status), desc && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: "var(--tx6)", letterSpacing: "0.08em" } }, desc)), summary && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10.5, color: "var(--tx4)", lineHeight: 1.55 } }, summary));
  const Footnote = ({ text }) => /* @__PURE__ */ React.createElement("div", { style: {
    borderLeft: "2px solid var(--bd2)",
    paddingLeft: 10,
    marginTop: 10,
    fontSize: 9.5,
    color: "var(--tx7)",
    lineHeight: 1.55
  } }, text);
  const OutcomesPanel = () => {
    const [shares, setShares] = useState(10);
    const cost = (shares * NOW_PRICE).toFixed(0);
    const scenarios = [
      { label: "BEAR", lo: bearLo, hi: bearHi, mid: bearMid, pct: bearPct, col: "#dd817a" },
      { label: "BASE", lo: baseLo, hi: baseHi, mid: baseMid, pct: basePct, col: "#c59542" },
      { label: "BULL", lo: bullLo, hi: bullHi, mid: bullMid, pct: bullPct, col: "#66b278" }
    ];
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(
      Banner,
      {
        status: `ASYMMETRY: ${asymRatio}\xD7 UP PER UNIT DOWN`,
        desc: `bull +${bullPct}% \xB7 base ${basePct >= 0 ? "+" : ""}${basePct}% \xB7 bear ${bearPct}%`,
        col: parseFloat(asymRatio) >= 2 ? "#66b278" : parseFloat(asymRatio) >= 1 ? "#c59542" : "#dd817a",
        summary: `At $${NOW_PRICE}, base case is roughly flat. Meaningful upside only arrives with bull-case execution. Bear downside is real (~${Math.abs(bearPct)}%) \u2014 size accordingly.`
      }
    ), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, letterSpacing: "0.12em", color: "var(--tx6)", marginBottom: 10 } }, "12-MONTH SCENARIO RETURN"), scenarios.map(({ label, lo, hi, mid, pct, col }) => {
      const pctSign = pct >= 0 ? "+" : "";
      const barW = Math.min(96, Math.max(4, (mid - GEOM.priceMin) / (GEOM.priceMax - GEOM.priceMin) * 100));
      return /* @__PURE__ */ React.createElement("div", { key: label, ...tip(`${label} case \u2014 12 months`, `Target range: $${lo}\u2013$${hi} (midpoint $${mid}). Return from $${NOW_PRICE}: ${pctSign}${pct}%. ${label === "BEAR" ? TEXT.future.scenarioTips.bear : label === "BASE" ? TEXT.future.scenarioTips.base(VAL_CONFIG.pe_normal_lo, VAL_CONFIG.pe_normal_hi) : TEXT.future.scenarioTips.bull(currentPE)}`, "Midpoint of price band used. 12-month horizon. These are estimates \u2014 hold loosely.", col), style: { marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 3 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9.5, fontWeight: 700, color: col, letterSpacing: "0.1em" } }, label), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9.5, color: "var(--tx5)" } }, "$", lo, "\u2013$", hi, " \xB7 ", /* @__PURE__ */ React.createElement("span", { style: { color: col, fontWeight: 700 } }, pctSign, pct, "%"))), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", height: 8, background: "var(--tiny-bg)", borderRadius: 4 } }, /* @__PURE__ */ React.createElement("div", { style: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        width: `${barW}%`,
        background: col,
        opacity: 0.35,
        borderRadius: 4
      } }), /* @__PURE__ */ React.createElement("div", { style: {
        position: "absolute",
        top: "50%",
        left: `${barW}%`,
        transform: "translate(-50%,-50%)",
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: col,
        boxShadow: `0 0 6px ${col}`
      } })));
    }), /* @__PURE__ */ React.createElement("div", { style: {
      marginTop: 18,
      padding: "12px 14px",
      background: "var(--inner-bg)",
      borderRadius: 6,
      border: "1px solid var(--bd2)"
    } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, letterSpacing: "0.12em", color: "var(--tx6)", marginBottom: 8 } }, "POSITION VALUE CALCULATOR"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 10 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: "var(--tx5)" } }, "Shares:"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "number",
        min: "1",
        value: shares,
        onChange: (e) => setShares(Math.max(1, parseInt(e.target.value) || 1)),
        style: {
          width: 70,
          padding: "4px 8px",
          background: "var(--input-bg)",
          border: "1px solid var(--bd2)",
          borderRadius: 4,
          color: "var(--title)",
          fontSize: 10.5,
          outline: "none",
          fontFamily: "inherit"
        }
      }
    ), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: "var(--tx6)" } }, "\xD7 $", NOW_PRICE, " = ", /* @__PURE__ */ React.createElement("strong", { style: { color: "var(--tx3)" } }, "$", Number(cost).toLocaleString()), " cost")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, scenarios.map(({ label, mid, pct, col }) => {
      const val = Math.round(shares * mid);
      const pl = val - parseInt(cost);
      const plSign = pl >= 0 ? "+" : "";
      return /* @__PURE__ */ React.createElement("div", { key: label, ...tip(`Position value \u2014 ${label} case`, `If ${label.toLowerCase()} case plays out, your ${shares} shares would be worth ~$${val.toLocaleString()} at the $${mid} midpoint. That is a P&L of ${plSign}$${Math.abs(pl).toLocaleString()} on your $${Number(cost).toLocaleString()} cost basis (${Math.round(pl / parseInt(cost) * 100) >= 0 ? "+" : ""}${Math.round(pl / parseInt(cost) * 100)}%). Adjust the share count above to model different position sizes.`, null, col), style: {
        flex: 1,
        padding: "8px 10px",
        borderRadius: 6,
        background: `${col}12`,
        border: `1px solid ${col}33`,
        textAlign: "center"
      } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 8, color: col, letterSpacing: "0.1em", marginBottom: 4 } }, label), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: col } }, "$", val.toLocaleString()), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: "var(--tx6)", marginTop: 2 } }, plSign, "$", Math.abs(pl).toLocaleString()));
    }))), /* @__PURE__ */ React.createElement(Footnote, { text: "Midpoint of price band used. 12-month horizon. These are scenario estimates, not targets \u2014 hold loosely and widen your mental bands." }));
  };
  const DownsidePanel = () => {
    const [portK, setPortK] = useState(100);
    const [calcPct, setCalcPct] = useState(2);
    const portV = portK * 1e3;
    const posV = Math.round(portV * calcPct / 100);
    const shares = Math.round(posV / NOW_PRICE);
    const bearLoss = Math.round(shares * (NOW_PRICE - bearMid));
    const bearLossPct = (bearLoss / portV * 100).toFixed(1);
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(
      Banner,
      {
        status: `BEAR CASE: ${bearPct}% FROM CURRENT`,
        desc: `$${bearMid} target \xB7 $${bearLo}\u2013$${bearHi} range`,
        col: "#dd817a",
        summary: CASES.bear.op.slice(0, 200) + "\u2026"
      }
    ), /* @__PURE__ */ React.createElement("div", { style: {
      padding: "12px 14px",
      background: "var(--inner-bg)",
      borderRadius: 6,
      border: "1px solid var(--bd2)",
      marginBottom: 12
    } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, letterSpacing: "0.12em", color: "var(--tx6)", marginBottom: 10 } }, "PORTFOLIO LOSS CALCULATOR"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 16, marginBottom: 12, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 140 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: "var(--tx6)", marginBottom: 3 } }, "PORTFOLIO SIZE ($K)"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "number",
        min: "10",
        step: "10",
        value: portK,
        onChange: (e) => setPortK(Math.max(10, parseInt(e.target.value) || 100)),
        style: {
          width: "100%",
          padding: "5px 8px",
          background: "var(--input-bg)",
          border: "1px solid var(--bd2)",
          borderRadius: 4,
          color: "var(--title)",
          fontSize: 11,
          outline: "none",
          fontFamily: "inherit"
        }
      }
    )), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 140 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: "var(--tx6)", marginBottom: 3 } }, "POSITION SIZE (%)"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "number",
        min: "0.5",
        max: "50",
        step: "0.5",
        value: calcPct,
        onChange: (e) => setCalcPct(Math.min(50, Math.max(0.5, parseFloat(e.target.value) || 2))),
        style: {
          width: "100%",
          padding: "5px 8px",
          background: "var(--input-bg)",
          border: "1px solid var(--bd2)",
          borderRadius: 4,
          color: "var(--title)",
          fontSize: 11,
          outline: "none",
          fontFamily: "inherit"
        }
      }
    ))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, [
      { label: "POSITION VALUE", val: `$${posV.toLocaleString()}`, sub: `~${shares} shares @ $${NOW_PRICE}`, col: "var(--tx3)", tipTitle: "Position value", tipBody: `At $${NOW_PRICE} with a ${calcPct}% allocation in a $${portK}K portfolio, you hold ~${shares} shares worth ~$${posV.toLocaleString()}. Adjust portfolio size or position % above to model different scenarios.` },
      { label: "BEAR CASE LOSS", val: `-$${bearLoss.toLocaleString()}`, sub: `${bearLossPct}% of portfolio`, col: "#dd817a", tipTitle: "Bear case dollar loss", tipBody: `If the bear case plays out ($${bearMid} target), your ~${shares} shares would lose ~$${bearLoss.toLocaleString()} \u2014 ${bearLossPct}% of your total portfolio. Rule of thumb: if the bear case loss would cause you to lose sleep, the position is too large. Kelly criterion suggests sizing so bear loss \u2264 1\u20132% of portfolio.` },
      { label: "BEAR PRICE", val: `$${bearMid}`, sub: `$${bearLo}\u2013$${bearHi} range`, col: "#dd817a", tipTitle: "Bear case price target", tipBody: TEXT.future.bearPriceTip(bearMid, bearLo, bearHi, VAL_CONFIG.pe_trough, VAL_CONFIG.pe_bear_hi) }
    ].map(({ label, val, sub, col, tipTitle: tipTitle2, tipBody }) => /* @__PURE__ */ React.createElement("div", { key: label, ...tip(tipTitle2, tipBody, null, col), style: {
      flex: 1,
      padding: "8px 10px",
      borderRadius: 6,
      background: "var(--panel-bg)",
      border: "1px solid var(--bd2)",
      textAlign: "center"
    } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 8, color: "var(--tx6)", letterSpacing: "0.1em", marginBottom: 4 } }, label), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: col } }, val), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: "var(--tx7)", marginTop: 2 } }, sub))))), /* @__PURE__ */ React.createElement("div", { ...tip("Kill-switch", TEXT.future.killSwitchTip, TEXT.future.killSwitchTipNote, "#dd817a"), style: {
      padding: "10px 14px",
      borderRadius: 6,
      background: "rgba(241,86,75,0.08)",
      border: "1px solid rgba(241,86,75,0.3)"
    } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, letterSpacing: "0.12em", color: "#dd817a", marginBottom: 5 } }, "KILL-SWITCH \u2014 ACT ON THIS"), /* @__PURE__ */ React.createElement(
      "div",
      {
        style: { fontSize: 10.5, color: "var(--tx4)", lineHeight: 1.6 },
        dangerouslySetInnerHTML: { __html: TEXT.future.killSwitchHtml }
      }
    ), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 8, fontSize: 10, color: "#dd817a" } }, TEXT.future.nextCheck)), allShares > 0 && /* @__PURE__ */ React.createElement("div", { style: {
      marginTop: 12,
      padding: "12px 14px",
      background: "rgba(70,170,217,0.06)",
      border: "1px solid rgba(70,170,217,0.25)",
      borderRadius: 6
    } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, letterSpacing: "0.12em", color: "#46aad9", marginBottom: 8 } }, "MY ", TICKER, " POSITION \u2014 BEAR CASE IMPACT"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 10 } }, [
      { label: "TOTAL SHARES", val: allShares.toFixed(0), sub: `${exShares > 0 ? exShares.toFixed(0) + " existing" : ""}${exShares > 0 && totShares > 0 ? " + " : ""}${totShares > 0 ? totShares.toFixed(0) + " adds" : ""}`, col: "#46aad9" },
      { label: "BLENDED BASIS", val: `$${blendedAll.toFixed(2)}`, sub: blendedAll > NOW_PRICE ? `underwater $${(blendedAll - NOW_PRICE).toFixed(2)}` : `up $${(NOW_PRICE - blendedAll).toFixed(2)}`, col: blendedAll <= NOW_PRICE ? "#66b278" : "#c59542" },
      { label: "BEAR CASE LOSS", val: `-$${Math.abs(posBearLoss).toLocaleString(void 0, { maximumFractionDigits: 0 })}`, sub: `${posBearLossPct}% of $${portfolioK}K portfolio`, col: "#dd817a" }
    ].map(({ label, val, sub, col }) => /* @__PURE__ */ React.createElement("div", { key: label, style: {
      flex: 1,
      padding: "8px 10px",
      borderRadius: 6,
      background: "var(--panel-bg)",
      border: "1px solid var(--bd2)",
      textAlign: "center"
    } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 8, color: "var(--tx6)", letterSpacing: "0.1em", marginBottom: 4 } }, label), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: col } }, val), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: "var(--tx7)", marginTop: 2 } }, sub)))), /* @__PURE__ */ React.createElement("div", { style: { height: 5, background: "var(--deep-bg)", borderRadius: 3, overflow: "hidden", marginBottom: 4 } }, /* @__PURE__ */ React.createElement("div", { style: {
      height: "100%",
      width: `${Math.min(100, posAbsLoss / 10 * 100)}%`,
      background: posAbsLoss > 5 ? "#dd817a" : posAbsLoss > 2 ? "#c59542" : "#66b278",
      borderRadius: 3,
      transition: "width .2s"
    } })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 8.5, color: "var(--tx7)", marginBottom: 6 } }, /* @__PURE__ */ React.createElement("span", { style: { color: "#66b278" } }, "comfortable <2%"), /* @__PURE__ */ React.createElement("span", { style: { color: "#c59542" } }, "watch 2\u20135%"), /* @__PURE__ */ React.createElement("span", { style: { color: "#dd817a" } }, "size down >5%")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--tx5)", lineHeight: 1.5 } }, posAbsLoss > 5 ? "Bear case hits hard \u2014 consider halving the position size." : posAbsLoss > 2 ? "Manageable. Make sure you can sit through this without panic-selling." : "Comfortable size. Room to add a second tranche without blowing limits.")), /* @__PURE__ */ React.createElement(Footnote, { text: TEXT.future.downsideFootnote(NOW_PRICE, VAL_CONFIG.pe_trough, VAL_CONFIG.pe_bear_hi) }));
  };
  const SignalPanel = () => {
    const peNow = parseFloat(currentPE);
    const peRange = VAL_CONFIG.pe_peak - VAL_CONFIG.pe_trough;
    const pePct = (v) => ((v - VAL_CONFIG.pe_trough) / peRange * 100).toFixed(1);
    const peNowPct = pePct(peNow);
    const zones = [
      { label: "DEEP VALUE", lo: VAL_CONFIG.pe_trough, hi: VAL_CONFIG.pe_bear_hi, col: "#66b278", opacity: 0.25 },
      { label: "BEAR ZONE", lo: VAL_CONFIG.pe_bear_hi, hi: VAL_CONFIG.pe_normal_lo, col: "#c59542", opacity: 0.15 },
      { label: "FAIR VALUE", lo: VAL_CONFIG.pe_normal_lo, hi: VAL_CONFIG.pe_normal_hi, col: "#c59542", opacity: 0.25 },
      { label: "BULL ZONE", lo: VAL_CONFIG.pe_normal_hi, hi: VAL_CONFIG.pe_bull_lo, col: "#c59542", opacity: 0.15 },
      { label: "EXPENSIVE", lo: VAL_CONFIG.pe_bull_lo, hi: VAL_CONFIG.pe_peak, col: "#dd817a", opacity: 0.25 }
    ];
    const priceZone = peNow <= VAL_CONFIG.pe_bear_hi ? { label: "DEEP VALUE", col: "#66b278", desc: "Historically cheap multiple \u2014 rare entry" } : peNow <= VAL_CONFIG.pe_normal_lo ? { label: "BELOW FAIR", col: "#66b278", desc: "Below normal historical range" } : peNow <= VAL_CONFIG.pe_normal_hi ? { label: "FAIR VALUE", col: "#c59542", desc: "Inside normal historical band" } : peNow <= VAL_CONFIG.pe_bull_lo ? { label: "ABOVE FAIR", col: "#dd817a", desc: "Above normal \u2014 priced for good execution" } : { label: "EXPENSIVE", col: "#dd817a", desc: "Premium multiple \u2014 high execution bar" };
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(
      Banner,
      {
        status: `MULTIPLE: ${peNow}\xD7 NTM P/E \u2014 ${priceZone.label}`,
        desc: priceZone.desc,
        col: priceZone.col,
        summary: TEXT.future.multipleSummary(peNow, VAL_CONFIG.pe_normal_lo, VAL_CONFIG.pe_normal_hi)
      }
    ), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, letterSpacing: "0.12em", color: "var(--tx6)", marginBottom: 6 } }, "FORWARD P/E vs 10-YEAR RANGE (", VAL_CONFIG.pe_trough, "\xD7\u2013", VAL_CONFIG.pe_peak, "\xD7)"), /* @__PURE__ */ React.createElement("div", { ...tip("NTM P/E vs 10-Year Range", `Forward P/E = stock price \xF7 next-12-month EPS. At $${NOW_PRICE} and $${VAL_CONFIG.ntm_eps} NTM EPS, P/E = ${currentPE}\xD7. Historical zones: deep value (${VAL_CONFIG.pe_trough}\u2013${VAL_CONFIG.pe_bear_hi}\xD7), fair value (${VAL_CONFIG.pe_normal_lo}\u2013${VAL_CONFIG.pe_normal_hi}\xD7), expensive (${VAL_CONFIG.pe_bull_lo}\u2013${VAL_CONFIG.pe_peak}\xD7). ${TEXT.future.peBarTipSuffix}`, null, "var(--tx3)"), style: {
      position: "relative",
      height: 24,
      borderRadius: 4,
      overflow: "hidden",
      display: "flex",
      border: "1px solid var(--bd)"
    } }, zones.map((z) => /* @__PURE__ */ React.createElement("div", { key: z.label, ...tip(z.label, `${z.label}: ${z.lo}\u2013${z.hi}\xD7 NTM P/E. ${z.label === "DEEP VALUE" ? TEXT.future.deepValueZoneNote : z.label === "FAIR VALUE" ? `Normal historical range (${z.lo}\u2013${z.hi}\xD7). Neither cheap nor expensive. Reasonable entry for long-term holders.` : z.label === "EXPENSIVE" ? "Premium multiple. The stock is pricing in bull-case execution. Limited margin of safety." : "Transitional zone between fair value and adjacent zones."}`, null, z.col), style: {
      width: `${(z.hi - z.lo) / peRange * 100}%`,
      background: z.col,
      opacity: z.opacity
    } })), /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: `${peNowPct}%`,
      width: 2,
      background: "var(--title)",
      boxShadow: "0 0 6px var(--title)"
    } }), /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      top: "50%",
      left: `${peNowPct}%`,
      transform: "translate(-50%,-50%)",
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: priceZone.col,
      boxShadow: `0 0 8px ${priceZone.col}`
    } })), /* @__PURE__ */ React.createElement("div", { style: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: 3,
      fontSize: 8.5,
      color: "var(--tx7)"
    } }, /* @__PURE__ */ React.createElement("span", null, VAL_CONFIG.pe_trough, "\xD7 (TROUGH)"), /* @__PURE__ */ React.createElement("span", { style: { color: priceZone.col, fontWeight: 700 } }, "NOW ", peNow, "\xD7"), /* @__PURE__ */ React.createElement("span", null, VAL_CONFIG.pe_peak, "\xD7 (PEAK)"))), /* @__PURE__ */ React.createElement("div", { ...tip("Dislocation Signal", `A dislocation occurs when a short-term event (earnings miss, macro shock, sector rotation) causes a stock to trade materially below its intrinsic value for a temporary window. ${TEXT.future.dislocEventName} is the most recent event. ${dislocDays} days later, the stock is ${NOW_PRICE < REVERSION_BASEFLOOR ? "still below the base floor of $" + REVERSION_BASEFLOOR + " \u2014 the dislocation window is open." : "well past the base floor of $" + REVERSION_BASEFLOOR + " and at a new all-time high."}`, `Historical precedent: the dislocation resolved within the ${REVERSION_PRECEDENT_DAYS}-day base-reversion window.`, dislocSignal.col), style: {
      padding: "10px 14px",
      borderRadius: 6,
      marginBottom: 12,
      background: `${dislocSignal.col}12`,
      border: `1px solid ${dislocSignal.col}44`
    } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, letterSpacing: "0.12em", color: dislocSignal.col, marginBottom: 3 } }, dislocSignal.label), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--tx5)" } }, dislocSignal.sub)), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "right" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 18, fontWeight: 700, color: dislocSignal.col } }, dislocDays, "d"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 8.5, color: "var(--tx7)" } }, TEXT.future.dislocLabel))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 8, fontSize: 9.5, color: "var(--tx6)", lineHeight: 1.55 } }, TEXT.future.dislocPrecedent(REVERSION_BASEFLOOR))), /* @__PURE__ */ React.createElement("div", { style: {
      padding: "10px 14px",
      background: "var(--inner-bg)",
      borderRadius: 6,
      border: "1px solid var(--bd2)",
      marginBottom: 12
    } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, letterSpacing: "0.12em", color: "var(--tx6)", marginBottom: 10 } }, "PRICE ZONE", allShares > 0 ? " \u2014 YOUR POSITION VS BANDS" : ""), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", height: 28, marginBottom: 6 } }, /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      top: "50%",
      left: 0,
      right: 0,
      height: 6,
      transform: "translateY(-50%)",
      background: "var(--deep-bg)",
      borderRadius: 3,
      border: "1px solid var(--bd)"
    } }), PRICE_ZONES.map(({ label, lo, hi, color, action }) => /* @__PURE__ */ React.createElement(
      "div",
      {
        key: label,
        ...tip(`${label} ($${lo}\u2013$${hi})`, action, null, color),
        style: {
          position: "absolute",
          top: "50%",
          left: visPct(lo),
          width: visW(lo, hi),
          height: 6,
          transform: "translateY(-50%)",
          background: `${color}55`,
          border: `1px solid ${color}88`,
          borderRadius: 2
        }
      }
    )), exBasis > VIS_LO && exBasis < VIS_HI && /* @__PURE__ */ React.createElement(
      "div",
      {
        ...tip("Existing position basis", `Pre-thesis entry at $${exBasis.toFixed(2)} \xB7 ${exShares.toFixed(0)} shares \xB7 $${exCost.toLocaleString(void 0, { maximumFractionDigits: 0 })} total`, null, "#46aad9"),
        style: {
          position: "absolute",
          top: "50%",
          left: visPct(exBasis),
          transform: "translate(-50%,-50%)",
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: "#46aad9",
          border: "2px solid var(--panel-bg)",
          boxShadow: "0 0 8px #46aad9",
          zIndex: 4
        }
      }
    ), blendedAll > VIS_LO && blendedAll < VIS_HI && allShares > exShares && /* @__PURE__ */ React.createElement(
      "div",
      {
        ...tip("Combined blended basis", `Avg cost $${blendedAll.toFixed(2)} across all ${allShares.toFixed(0)} shares (existing + thesis adds)`, null, "var(--blue-soft)"),
        style: {
          position: "absolute",
          top: "50%",
          left: visPct(blendedAll),
          transform: "translate(-50%,-50%)",
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: "var(--blue-soft)",
          border: "2px solid var(--panel-bg)",
          boxShadow: "0 0 10px var(--blue-soft)",
          zIndex: 5
        }
      }
    ), /* @__PURE__ */ React.createElement(
      "div",
      {
        ...tip(`Current price $${NOW_PRICE}`, NOW_PRICE < GEOM.nowZoneLo ? "Below base floor \u2014 dislocation window open" : NOW_PRICE <= GEOM.nowZoneHi ? "Inside base band \u2014 fair value territory" : "Above base \u2014 price stretched", null, "#46aad9"),
        style: {
          position: "absolute",
          top: "50%",
          left: visPct(NOW_PRICE),
          transform: "translate(-50%,-50%)",
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: "#46aad944",
          border: "2px solid #46aad9",
          boxShadow: "0 0 8px #46aad9",
          zIndex: 6
        }
      }
    ), /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      top: -16,
      left: visPct(NOW_PRICE),
      transform: "translateX(-50%)",
      fontSize: 8.5,
      color: "#46aad9",
      fontWeight: 700,
      whiteSpace: "nowrap"
    } }, "NOW $", NOW_PRICE), exBasis > VIS_LO && exBasis < VIS_HI && Math.abs(exBasis - NOW_PRICE) > 5 && /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      top: 20,
      left: visPct(exBasis),
      transform: "translateX(-50%)",
      fontSize: 8.5,
      color: "#46aad9",
      whiteSpace: "nowrap"
    } }, "BASIS $", exBasis.toFixed(0)), blendedAll > VIS_LO && blendedAll < VIS_HI && allShares > exShares && Math.abs(blendedAll - NOW_PRICE) > 5 && /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      top: 20,
      left: visPct(blendedAll),
      transform: "translateX(-50%)",
      fontSize: 8.5,
      color: "var(--blue-soft)",
      fontWeight: 700,
      whiteSpace: "nowrap"
    } }, "COMBINED $", blendedAll.toFixed(0))), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", height: 22 } }, PRICE_ZONES.map(({ label, lo, hi, color }) => /* @__PURE__ */ React.createElement("div", { key: label, style: {
      position: "absolute",
      left: `${visC(lo, hi).toFixed(1)}%`,
      transform: "translateX(-50%)",
      textAlign: "center",
      fontSize: 8.5,
      color,
      fontWeight: 700,
      letterSpacing: "0.04em"
    } }, label)))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, [
      { label: "FCF YIELD", val: `${fcfYield}%`, sub: `$${VAL_CONFIG.fcf_ntm_b}B NTM FCF`, col: "#66b278", tipTitle: "FCF Yield", tipBody: `Free Cash Flow Yield = NTM FCF \xF7 Market Cap. At $${fcfYield}%, every $100 invested in ${TICKER} generates $${fcfYield} of real cash per year \u2014 before it is deployed into dividends, buybacks, or further capex. A higher yield = cheaper stock relative to cash generation. Current: $${VAL_CONFIG.fcf_ntm_b}B FCF \xF7 $${(NOW_PRICE * VAL_CONFIG.shares_b).toFixed(0)}B market cap.` },
      { label: "10Y TREASURY", val: `${VAL_CONFIG.risk_free_pct}%`, sub: "risk-free rate", col: "var(--tx6)", tipTitle: "10-Year Treasury Yield", tipBody: `The risk-free rate: what you earn on US Treasuries \u2014 the safest alternative. At ${VAL_CONFIG.risk_free_pct}%, this is the baseline. Any equity investment must clear this hurdle plus a risk premium. When rates are high, equities are relatively less attractive.` },
      { label: "SPREAD", val: `+${(parseFloat(fcfYield) - VAL_CONFIG.risk_free_pct).toFixed(2)}%`, sub: "FCF yield vs risk-free", col: parseFloat(fcfYield) > VAL_CONFIG.risk_free_pct ? "#66b278" : "#dd817a", tipTitle: "Equity Risk Premium (FCF spread)", tipBody: `Spread = FCF Yield \u2212 10Y Treasury. Positive spread means equities offer extra return vs risk-free. At +${(parseFloat(fcfYield) - VAL_CONFIG.risk_free_pct).toFixed(2)}%, ${TICKER}'s FCF yield beats Treasuries by ${(parseFloat(fcfYield) - VAL_CONFIG.risk_free_pct).toFixed(2)} points. A thin spread here reflects reinvestment, not necessarily overvaluation.` }
    ].map(({ label, val, sub, col, tipTitle: tipTitle2, tipBody }) => /* @__PURE__ */ React.createElement("div", { key: label, ...tip(tipTitle2, tipBody, null, col), style: {
      flex: 1,
      padding: "8px 10px",
      borderRadius: 6,
      background: "var(--inner-bg)",
      border: "1px solid var(--bd2)",
      textAlign: "center"
    } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 8, color: "var(--tx6)", letterSpacing: "0.1em", marginBottom: 4 } }, label), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: col } }, val), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: "var(--tx7)", marginTop: 2 } }, sub)))), /* @__PURE__ */ React.createElement(Footnote, { text: TEXT.future.signalFootnote(VAL_CONFIG.ntm_eps) }));
  };
  const CapitalPanel = () => {
    const modes = [
      { label: "EXPLORE", range: "$100\u2013200", desc: "Skin in the game \u2014 pre-conviction scouting" },
      { label: "NIBBLE", range: "$200\u2013400", desc: "Thesis forming \u2014 preserve dry powder" },
      { label: "ADD", range: "$400\u2013600", desc: "Thesis intact \u2014 normal cadence" },
      { label: "DEPLOY", range: "$600\u2013800+", desc: "Dislocation + high conviction \u2014 war chest moment" }
    ];
    const activeModeLabel = deployMode.label === "EXIT" ? null : deployMode.label;
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(
      Banner,
      {
        status: `WAR CHEST: $${warChest.toLocaleString()} SAVED`,
        desc: `$${totalDeployed.toLocaleString()} deployed this cycle across tickers`,
        col: warChest >= 400 ? "#66b278" : warChest >= 200 ? "#c59542" : "#dd817a",
        summary: `Suggested mode: ${deployMode.label}${deployMode.range ? " (" + deployMode.range + ")" : ""}. ${deployMode.sub}.`
      }
    ), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, letterSpacing: "0.12em", color: "var(--tx6)", marginBottom: 7 } }, "DEPLOYMENT MODE"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6 } }, modes.map((m) => {
      const isActive = m.label === activeModeLabel;
      const col = m.label === "EXPLORE" ? "#46aad9" : m.label === "NIBBLE" ? "#c59542" : m.label === "ADD" ? "#66b278" : "#66b278";
      return /* @__PURE__ */ React.createElement("div", { key: m.label, ...tip(m.label + " mode", `${m.desc}. Range: ${m.range}. ${m.label === "EXPLORE" ? "Stanley Druckenmiller style: put a small stake on before your research is complete. Forces you to pay attention and form a real view." : m.label === "NIBBLE" ? "Thesis is still forming. Keep powder dry for the moment you have high conviction. Small size protects you if you are wrong on the read." : m.label === "ADD" ? "Thesis intact, price fair or below fair. Normal cadence \u2014 add without requiring a dislocation discount. Typical routine sizing." : "Rare. Reserved for when thesis is intact AND price has dislocated materially. This is the war chest moment \u2014 size up decisively."}`, isActive ? "This is your current recommended mode." : null, col), style: {
        flex: 1,
        padding: "8px 6px",
        borderRadius: 6,
        textAlign: "center",
        background: isActive ? `${col}22` : "var(--inner-bg)",
        border: `1px solid ${isActive ? col : "var(--bd2)"}`,
        boxShadow: isActive ? `0 0 10px ${col}44` : "none"
      } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 8.5, fontWeight: 700, color: isActive ? col : "var(--tx7)", letterSpacing: "0.08em" } }, m.label), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 8, color: isActive ? col : "var(--tx9)", marginTop: 2 } }, m.range));
    }))), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, letterSpacing: "0.12em", color: "var(--tx6)" } }, "CYCLE LOG"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6 } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        "aria-label": "Open dry powder cycle settings",
        onClick: () => {
          setSettingsForm({ cycleAmount: store.cycleAmount, cycleDays: store.cycleDays });
          setSettingsOpen(!settingsOpen);
        },
        style: {
          fontSize: 8,
          padding: "3px 8px",
          borderRadius: 3,
          border: "1px solid var(--bd2)",
          background: "var(--btn-bg)",
          color: "var(--tx5)",
          cursor: "pointer",
          letterSpacing: "0.08em"
        }
      },
      "\u2699 SETTINGS"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        "aria-label": "Log a new dry powder cycle",
        onClick: openAdd,
        style: {
          fontSize: 8,
          padding: "3px 8px",
          borderRadius: 3,
          border: "1px solid #66b27855",
          background: "rgba(63,208,122,0.12)",
          color: "#66b278",
          cursor: "pointer",
          letterSpacing: "0.08em"
        }
      },
      "+ ADD CYCLE"
    ))), settingsOpen && /* @__PURE__ */ React.createElement("div", { style: {
      padding: "10px 12px",
      borderRadius: 6,
      background: "var(--inner-bg)",
      border: "1px solid var(--bd2)",
      marginBottom: 8
    } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: "var(--tx6)", marginBottom: 6 } }, "CYCLE DEFAULTS"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 8.5, color: "var(--tx7)", marginBottom: 2 } }, "Target per cycle ($)"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "number",
        value: settingsForm.cycleAmount,
        onChange: (e) => setSettingsForm((s) => ({ ...s, cycleAmount: e.target.value })),
        style: {
          width: "100%",
          padding: "4px 6px",
          background: "var(--input-bg)",
          border: "1px solid var(--bd2)",
          borderRadius: 3,
          color: "var(--title)",
          fontSize: 10,
          outline: "none",
          fontFamily: "inherit"
        }
      }
    )), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 8.5, color: "var(--tx7)", marginBottom: 2 } }, "Cycle length (days)"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "number",
        value: settingsForm.cycleDays,
        onChange: (e) => setSettingsForm((s) => ({ ...s, cycleDays: e.target.value })),
        style: {
          width: "100%",
          padding: "4px 6px",
          background: "var(--input-bg)",
          border: "1px solid var(--bd2)",
          borderRadius: 3,
          color: "var(--title)",
          fontSize: 10,
          outline: "none",
          fontFamily: "inherit"
        }
      }
    ))), /* @__PURE__ */ React.createElement(
      "button",
      {
        "aria-label": "Save cycle settings",
        onClick: saveSettings,
        style: {
          padding: "4px 12px",
          borderRadius: 3,
          border: "1px solid #66b27855",
          background: "rgba(63,208,122,0.12)",
          color: "#66b278",
          cursor: "pointer",
          fontSize: 9,
          letterSpacing: "0.08em"
        }
      },
      "SAVE"
    )), editingCycle !== null && /* @__PURE__ */ React.createElement("div", { style: {
      padding: "10px 12px",
      borderRadius: 6,
      background: "var(--inner-bg)",
      border: "1px solid #66b27844",
      marginBottom: 8
    } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: "#66b278", marginBottom: 6, letterSpacing: "0.1em" } }, editingCycle === "new" ? "LOG NEW CYCLE" : "EDIT CYCLE"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 6 } }, [
      { key: "date", label: "Date", type: "date", w: 140 },
      { key: "deployed", label: "Deployed ($)", type: "number", w: 110 },
      { key: "saved", label: "Saved ($)", type: "number", w: 110 },
      { key: "note", label: "Note", type: "text", w: 180 }
    ].map((f) => /* @__PURE__ */ React.createElement("div", { key: f.key }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 8, color: "var(--tx7)", marginBottom: 2 } }, f.label), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: f.type,
        value: cycleForm[f.key],
        onChange: (e) => setCycleForm((s) => ({ ...s, [f.key]: e.target.value })),
        style: {
          width: f.w,
          padding: "4px 6px",
          background: "var(--input-bg)",
          border: "1px solid var(--bd2)",
          borderRadius: 3,
          color: "var(--title)",
          fontSize: 10,
          outline: "none",
          fontFamily: "inherit"
        }
      }
    )))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6 } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        "aria-label": "Save cycle entry",
        onClick: saveForm,
        style: {
          padding: "4px 12px",
          borderRadius: 3,
          border: "1px solid #66b27855",
          background: "rgba(63,208,122,0.12)",
          color: "#66b278",
          cursor: "pointer",
          fontSize: 9
        }
      },
      "SAVE"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        "aria-label": "Cancel cycle edit",
        onClick: () => setEditingCycle(null),
        style: {
          padding: "4px 12px",
          borderRadius: 3,
          border: "1px solid var(--bd2)",
          background: "var(--btn-bg)",
          color: "var(--tx6)",
          cursor: "pointer",
          fontSize: 9
        }
      },
      "CANCEL"
    ))), store.cycles.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: {
      padding: "14px",
      textAlign: "center",
      fontSize: 10,
      color: "var(--tx7)",
      background: "var(--inner-bg)",
      borderRadius: 6,
      border: "1px solid var(--bd2)"
    } }, "No cycles logged yet. Click + ADD CYCLE to start tracking.") : /* @__PURE__ */ React.createElement("div", { style: { borderRadius: 6, border: "1px solid var(--bd2)", overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: {
      display: "grid",
      gridTemplateColumns: "90px 80px 80px 1fr 52px",
      padding: "5px 10px",
      background: "var(--th-bg)",
      fontSize: 8.5,
      letterSpacing: "0.08em",
      color: "var(--tx7)"
    } }, /* @__PURE__ */ React.createElement("span", { ...tip("Cycle date", "The date of this funding cycle. A cycle is one paycheck, cash transfer, or other regular deployment event.", null, "var(--tx5)") }, "DATE"), /* @__PURE__ */ React.createElement("span", { ...tip("Deployed this cycle ($)", "Total capital put to work across ALL tickers this cycle. Future portfolio page will show the ticker breakdown.", null, "#66b278") }, "DEPLOYED"), /* @__PURE__ */ React.createElement("span", { ...tip("Saved this cycle ($)", "Capital set aside but NOT yet deployed \u2014 your dry powder. Saved amounts accumulate into your war chest and inform the deployment mode recommendation.", null, "#c59542") }, "SAVED"), /* @__PURE__ */ React.createElement("span", { ...tip("Cycle note", "Optional note: what was your reasoning? What was market conditions like? Great for review later \u2014 'why did I deploy here vs hold?'", null, "var(--tx5)") }, "NOTE"), /* @__PURE__ */ React.createElement("span", null)), store.cycles.map((c, i) => /* @__PURE__ */ React.createElement("div", { key: c.id, style: {
      display: "grid",
      gridTemplateColumns: "90px 80px 80px 1fr 52px",
      padding: "6px 10px",
      fontSize: 10,
      color: "var(--tx4)",
      borderTop: i > 0 ? "1px solid var(--bd)" : "none",
      background: i % 2 === 0 ? "var(--inner-bg)" : "var(--panel-bg)"
    } }, /* @__PURE__ */ React.createElement("span", { style: { color: "var(--tx5)" } }, c.date), /* @__PURE__ */ React.createElement("span", { style: { color: "#66b278" } }, "$", (parseFloat(c.deployed) || 0).toLocaleString()), /* @__PURE__ */ React.createElement("span", { style: { color: "#c59542" } }, "$", (parseFloat(c.saved) || 0).toLocaleString()), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--tx6)", fontSize: 9 } }, c.note || "\u2014"), /* @__PURE__ */ React.createElement("span", { style: { display: "flex", gap: 4 } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        "aria-label": "Edit this cycle",
        onClick: () => openEdit(c),
        style: {
          fontSize: 8,
          padding: "2px 5px",
          borderRadius: 2,
          border: "1px solid var(--bd2)",
          background: "var(--btn-bg)",
          color: "var(--tx5)",
          cursor: "pointer"
        }
      },
      "\u270E"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        "aria-label": "Delete this cycle",
        onClick: () => deleteCycle(c.id),
        style: {
          fontSize: 8,
          padding: "2px 5px",
          borderRadius: 2,
          border: "1px solid rgba(241,86,75,0.3)",
          background: "rgba(241,86,75,0.08)",
          color: "#dd817a",
          cursor: "pointer"
        }
      },
      "\xD7"
    )))), /* @__PURE__ */ React.createElement("div", { style: {
      display: "grid",
      gridTemplateColumns: "90px 80px 80px 1fr 52px",
      padding: "6px 10px",
      borderTop: "1px solid var(--bd2)",
      fontSize: 10,
      fontWeight: 700,
      background: "var(--th-bg)"
    } }, /* @__PURE__ */ React.createElement("span", { style: { color: "var(--tx6)", fontSize: 8.5, letterSpacing: "0.08em" } }, "TOTAL"), /* @__PURE__ */ React.createElement("span", { style: { color: "#66b278" } }, "$", totalDeployed.toLocaleString()), /* @__PURE__ */ React.createElement("span", { style: { color: "#c59542" } }, "$", totalSaved.toLocaleString()), /* @__PURE__ */ React.createElement("span", null), /* @__PURE__ */ React.createElement("span", null)))), /* @__PURE__ */ React.createElement("div", { ...tip("Regret minimisation", TEXT.future.regretTip, "If you cannot answer this question, your position is sized correctly at zero until you can.", "#66b278"), style: {
      padding: "10px 14px",
      borderRadius: 6,
      background: "rgba(63,208,122,0.06)",
      border: "1px solid rgba(63,208,122,0.25)",
      marginBottom: 8
    } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, letterSpacing: "0.12em", color: "#66b278", marginBottom: 4 } }, "WHAT WOULD MAKE ME REGRET NOT DEPLOYING?"), /* @__PURE__ */ React.createElement(
      "div",
      {
        style: { fontSize: 10.5, color: "var(--tx4)", lineHeight: 1.6 },
        dangerouslySetInnerHTML: { __html: TEXT.future.regretHtml(currentPE) }
      }
    )), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 16, borderTop: "1px solid var(--bd)", paddingTop: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, letterSpacing: "0.12em", color: "var(--tx6)" } }, "MY ", TICKER, " POSITION"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, alignItems: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, color: flash ? "#66b278" : "transparent", transition: "color .3s", letterSpacing: "0.1em" } }, "\u2713 SAVED"), clearPending ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("button", { "aria-label": "Confirm: clear all position data", onClick: clearPos, style: { fontSize: 8, padding: "3px 8px", borderRadius: 3, border: "1px solid rgba(241,86,75,0.7)", background: "rgba(241,86,75,0.18)", color: "#dd817a", cursor: "pointer", letterSpacing: "0.08em" } }, "CONFIRM CLEAR"), /* @__PURE__ */ React.createElement("button", { "aria-label": "Cancel clear", onClick: () => setClearPending(false), style: { fontSize: 8, padding: "3px 8px", borderRadius: 3, border: "1px solid var(--bd2)", background: "transparent", color: "var(--tx5)", cursor: "pointer", letterSpacing: "0.08em" } }, "CANCEL")) : /* @__PURE__ */ React.createElement("button", { "aria-label": "Clear all position data", onClick: () => setClearPending(true), style: { fontSize: 8, padding: "3px 8px", borderRadius: 3, border: "1px solid rgba(241,86,75,0.3)", background: "rgba(241,86,75,0.08)", color: "#dd817a", cursor: "pointer", letterSpacing: "0.08em" } }, "CLEAR"))), /* @__PURE__ */ React.createElement("div", { style: {
      padding: "10px 12px",
      background: "rgba(70,170,217,0.06)",
      border: "1px solid rgba(70,170,217,0.22)",
      borderRadius: 6,
      marginBottom: 10
    } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9.5, letterSpacing: "0.12em", color: "#46aad9", fontWeight: 700 } }, "EXISTING \xB7 PRE-THESIS"), /* @__PURE__ */ React.createElement("button", { "aria-label": "Add existing position entry row", onClick: addExisting, style: {
      background: "transparent",
      border: "1px solid rgba(70,170,217,0.35)",
      borderRadius: 4,
      padding: "3px 10px",
      cursor: "pointer",
      fontSize: 9.5,
      color: "#46aad9",
      fontFamily: FONT_MONO,
      letterSpacing: "0.08em"
    } }, "+ ADD ROW")), /* @__PURE__ */ React.createElement("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 11 } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { style: { borderBottom: "1px solid rgba(70,170,217,0.22)" } }, ["PRICE ($)", "SHARES", "VALUE", "DATE", ""].map((h, i) => /* @__PURE__ */ React.createElement("th", { key: i, style: {
      padding: "3px 6px",
      textAlign: i < 3 ? "right" : i === 3 ? "right" : "center",
      color: "#46aad988",
      fontSize: 9,
      letterSpacing: "0.1em",
      fontWeight: 400,
      paddingBottom: 6
    } }, h)))), /* @__PURE__ */ React.createElement("tbody", null, existing.map((e) => {
      const ev = +e.price * +e.shares;
      const hasV = +e.price > 0 && +e.shares > 0;
      return /* @__PURE__ */ React.createElement("tr", { key: e.id, style: { borderBottom: "1px solid rgba(70,170,217,0.12)" } }, /* @__PURE__ */ React.createElement("td", { style: { padding: "4px 6px", width: 80 } }, /* @__PURE__ */ React.createElement(
        "input",
        {
          type: "number",
          value: e.price,
          onChange: (ev2) => updateEx(e.id, "price", ev2.target.value),
          placeholder: "\u2014",
          style: { ...posInputStyle, accentColor: "#46aad9" }
        }
      )), /* @__PURE__ */ React.createElement("td", { style: { padding: "4px 6px", width: 70 } }, /* @__PURE__ */ React.createElement(
        "input",
        {
          type: "number",
          value: e.shares,
          onChange: (ev2) => updateEx(e.id, "shares", ev2.target.value),
          placeholder: "\u2014",
          style: { ...posInputStyle, accentColor: "#46aad9" }
        }
      )), /* @__PURE__ */ React.createElement("td", { style: {
        padding: "6px",
        textAlign: "right",
        width: 76,
        color: hasV ? "#46aad9" : "var(--tx8)",
        fontWeight: hasV ? 600 : 400
      } }, hasV ? `$${ev.toLocaleString(void 0, { maximumFractionDigits: 0 })}` : "\u2014"), /* @__PURE__ */ React.createElement("td", { style: { padding: "4px 6px", width: 110 } }, /* @__PURE__ */ React.createElement(
        "input",
        {
          type: "date",
          value: e.date,
          onChange: (ev2) => updateEx(e.id, "date", ev2.target.value),
          style: { ...posInputStyle, textAlign: "left", accentColor: "#46aad9" }
        }
      )), /* @__PURE__ */ React.createElement("td", { style: { padding: "4px 6px", textAlign: "center", width: 22 } }, /* @__PURE__ */ React.createElement(
        "button",
        {
          "aria-label": "Remove this existing position entry",
          onClick: () => delExisting(e.id),
          style: {
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: existing.length > 1 ? "rgba(70,170,217,0.4)" : "var(--tx9)",
            fontSize: 13,
            lineHeight: 1,
            padding: "0 2px",
            fontFamily: FONT_MONO
          }
        },
        "\xD7"
      )));
    }))), exBasis > 0 && /* @__PURE__ */ React.createElement("div", { style: {
      marginTop: 8,
      paddingTop: 8,
      borderTop: "1px solid rgba(70,170,217,0.2)",
      display: "flex",
      justifyContent: "space-between",
      fontSize: 10.5
    } }, /* @__PURE__ */ React.createElement("span", { style: { color: "#46aad988" } }, exFilled.length, " entr", exFilled.length === 1 ? "y" : "ies", " \xB7 ", exShares.toFixed(0), " shares"), /* @__PURE__ */ React.createElement("span", { style: { color: "#46aad9", fontWeight: 700 } }, "avg $", exBasis.toFixed(2), " \xB7 $", exCost.toLocaleString(void 0, { maximumFractionDigits: 0 })))), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9.5, letterSpacing: "0.12em", color: "var(--tx5)", fontWeight: 700 } }, "THESIS-DRIVEN ADDS"), /* @__PURE__ */ React.createElement("button", { "aria-label": "Add thesis-driven buy tranche row", onClick: addTranche, style: {
      background: "transparent",
      border: "1px solid var(--bd2)",
      borderRadius: 4,
      padding: "3px 10px",
      cursor: "pointer",
      fontSize: 9.5,
      color: "var(--tx4)",
      fontFamily: FONT_MONO,
      letterSpacing: "0.08em"
    } }, "+ ADD ROW")), /* @__PURE__ */ React.createElement("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 11 } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { style: { borderBottom: "1px solid var(--bd)" } }, ["LABEL", "PRICE ($)", "SHARES", "VALUE", "DATE", ""].map((h, i) => /* @__PURE__ */ React.createElement("th", { key: i, style: {
      padding: "3px 6px",
      textAlign: i === 0 ? "left" : i === 5 ? "center" : "right",
      color: "var(--tx6)",
      fontSize: 9,
      letterSpacing: "0.1em",
      fontWeight: 400,
      paddingBottom: 6
    } }, h)))), /* @__PURE__ */ React.createElement("tbody", null, tranches.map((t) => {
      const tv = +t.price * +t.shares;
      const hasV = +t.price > 0 && +t.shares > 0;
      return /* @__PURE__ */ React.createElement("tr", { key: t.id, style: { borderBottom: "1px solid var(--bd)" } }, /* @__PURE__ */ React.createElement("td", { style: { padding: "4px 6px", minWidth: 76 } }, /* @__PURE__ */ React.createElement(
        "input",
        {
          value: t.label,
          onChange: (e) => updateT(t.id, "label", e.target.value),
          style: {
            ...posInputStyle,
            textAlign: "left",
            fontSize: 10,
            fontWeight: 600,
            color: "var(--tx3)",
            width: "100%"
          }
        }
      )), /* @__PURE__ */ React.createElement("td", { style: { padding: "4px 6px", width: 80 } }, /* @__PURE__ */ React.createElement(
        "input",
        {
          type: "number",
          value: t.price,
          onChange: (e) => updateT(t.id, "price", e.target.value),
          placeholder: "\u2014",
          style: posInputStyle
        }
      )), /* @__PURE__ */ React.createElement("td", { style: { padding: "4px 6px", width: 70 } }, /* @__PURE__ */ React.createElement(
        "input",
        {
          type: "number",
          value: t.shares,
          onChange: (e) => updateT(t.id, "shares", e.target.value),
          placeholder: "\u2014",
          style: posInputStyle
        }
      )), /* @__PURE__ */ React.createElement("td", { style: {
        padding: "6px",
        textAlign: "right",
        width: 76,
        color: hasV ? "var(--tx2)" : "var(--tx8)",
        fontWeight: hasV ? 600 : 400
      } }, hasV ? `$${tv.toLocaleString(void 0, { maximumFractionDigits: 0 })}` : "\u2014"), /* @__PURE__ */ React.createElement("td", { style: { padding: "6px", textAlign: "right", fontSize: 9.5, color: "var(--tx6)", whiteSpace: "nowrap" } }, t.date || "\u2014"), /* @__PURE__ */ React.createElement("td", { style: { padding: "4px 6px", textAlign: "center", width: 22 } }, /* @__PURE__ */ React.createElement(
        "button",
        {
          "aria-label": "Remove this buy tranche",
          onClick: () => deleteTranche(t.id),
          style: {
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "var(--tx8)",
            fontSize: 13,
            lineHeight: 1,
            padding: "0 2px",
            fontFamily: FONT_MONO
          }
        },
        "\xD7"
      )));
    })))), /* @__PURE__ */ React.createElement("div", { className: "resp-3col", style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 } }, [
      { label: "EXISTING", shares: exShares, cost: exCost, basis: exBasis, color: "#46aad9" },
      { label: "THESIS ADDS", shares: totShares, cost: totCost, basis: blended, color: "var(--tx3)" },
      { label: "COMBINED BASIS", shares: allShares, cost: allCost, basis: blendedAll, color: "var(--blue-soft)", hl: true }
    ].map(({ label, shares, cost, basis, color, hl }) => /* @__PURE__ */ React.createElement("div", { key: label, style: {
      padding: "8px 10px",
      background: hl ? "var(--inner-bg)" : "transparent",
      border: hl ? "1px solid var(--bd)" : "none",
      borderRadius: hl ? 6 : 0
    } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: "var(--tx6)", letterSpacing: "0.1em", marginBottom: 3 } }, label), /* @__PURE__ */ React.createElement("div", { style: { fontSize: hl ? 15 : 13, fontWeight: 700, color, marginBottom: 2 } }, basis > 0 ? `$${basis.toFixed(2)}` : "\u2014"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: "var(--tx7)" } }, shares > 0 ? `${shares.toFixed(0)} sh \xB7 $${cost.toLocaleString(void 0, { maximumFractionDigits: 0 })}` : "no data")))), /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 14px", background: "var(--inner-bg)", border: "1px solid var(--bd)", borderRadius: 6, marginBottom: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, letterSpacing: "0.12em", color: "var(--tx6)", marginBottom: 10 } }, "SIZING CHECK \u2014 CAN YOU SIT THROUGH BEAR?"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 16, marginBottom: 12, flexWrap: "wrap" } }, [
      { label: "PORTFOLIO ($K)", val: portfolioK, set: setPortfolioK, min: 10, max: 5e3, step: 10, fmt: (v) => `$${v.toLocaleString()}K` },
      { label: `${TICKER} POSITION (%)`, val: posPct, set: setPosPct, min: 0.5, max: 20, step: 0.5, fmt: (v) => `${v.toFixed(1)}%` }
    ].map(({ label, val, set, min, max, step, fmt }) => /* @__PURE__ */ React.createElement("div", { key: label, style: { flex: 1, minWidth: 140 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 4 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: "var(--tx6)", letterSpacing: "0.1em" } }, label), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--blue-soft)", fontWeight: 700 } }, fmt(val))), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "range",
        min,
        max,
        step,
        value: val,
        onChange: (e) => set(+e.target.value),
        style: { width: "100%", accentColor: "var(--blue-soft)", cursor: "pointer" }
      }
    )))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 10px", background: "var(--panel-bg)", borderRadius: 5, border: "1px solid var(--bd2)" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 8.5, color: "var(--tx6)", marginBottom: 2 } }, "POSITION VALUE"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "var(--tx2)" } }, "$", posPosVal.toLocaleString(void 0, { maximumFractionDigits: 0 }))), /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 10px", background: "rgba(241,86,75,0.06)", borderRadius: 5, border: "1px solid rgba(241,86,75,0.22)" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 8.5, color: "#dd817a99", marginBottom: 2 } }, "BEAR CASE LOSS"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "#dd817a" } }, "-$", Math.abs(posBearLoss).toLocaleString(void 0, { maximumFractionDigits: 0 })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: "var(--tx7)" } }, posBearLossPct, "% of portfolio"))), /* @__PURE__ */ React.createElement("div", { style: { height: 5, background: "var(--deep-bg)", borderRadius: 3, overflow: "hidden", marginBottom: 4 } }, /* @__PURE__ */ React.createElement("div", { style: {
      height: "100%",
      width: `${Math.min(100, posAbsLoss / 10 * 100)}%`,
      background: posAbsLoss > 5 ? "#dd817a" : posAbsLoss > 2 ? "#c59542" : "#66b278",
      borderRadius: 3,
      transition: "width .2s"
    } })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 8.5, color: "var(--tx7)", marginBottom: 6 } }, /* @__PURE__ */ React.createElement("span", { style: { color: "#66b278" } }, "comfortable <2%"), /* @__PURE__ */ React.createElement("span", { style: { color: "#c59542" } }, "watch 2\u20135%"), /* @__PURE__ */ React.createElement("span", { style: { color: "#dd817a" } }, "size down >5%")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--tx4)", lineHeight: 1.6 } }, posAbsLoss > 5 ? "Bear case hits hard \u2014 consider halving the position size." : posAbsLoss > 2 ? "Manageable. Make sure you can sit through this without panic-selling." : "Comfortable size. Room to add a second tranche without blowing limits.")), /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 12px", background: "var(--inner-bg)", border: "1px solid var(--bd)", borderRadius: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, letterSpacing: "0.12em", color: "var(--tx6)", marginBottom: 8 } }, "THESIS CHECK \u2014 ALL MUST BE \u2713 TO ADD"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 5 } }, THESIS_ITEMS.map(({ key, label, note }) => {
      const on = checks[key];
      return /* @__PURE__ */ React.createElement(
        "div",
        {
          key,
          onClick: () => toggle(key),
          ...tip(label, note, "Click to toggle.", on ? "#66b278" : "var(--tx5)"),
          style: {
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            cursor: "pointer",
            padding: "7px 10px",
            borderRadius: 5,
            transition: "all .15s",
            background: on ? "rgba(63,208,122,0.07)" : "var(--panel-bg)",
            border: `1px solid ${on ? "rgba(63,208,122,0.28)" : "var(--bd)"}`
          }
        },
        /* @__PURE__ */ React.createElement("div", { style: {
          width: 15,
          height: 15,
          borderRadius: 3,
          flexShrink: 0,
          marginTop: 2,
          border: `2px solid ${on ? "#66b278" : "var(--bd2)"}`,
          background: on ? "#66b278" : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        } }, on && /* @__PURE__ */ React.createElement("span", { style: { color: "var(--page-bg)", fontSize: 9, fontWeight: 900 } }, "\u2713")),
        /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10.5, color: on ? "#66b278" : "var(--tx3)", fontWeight: on ? 600 : 400 } }, label), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: "var(--tx6)", marginTop: 2 } }, note))
      );
    })), /* @__PURE__ */ React.createElement("div", { style: {
      marginTop: 8,
      paddingTop: 6,
      borderTop: "1px solid var(--bd)",
      display: "flex",
      justifyContent: "space-between",
      fontSize: 10.5
    } }, /* @__PURE__ */ React.createElement("span", { style: { color: "var(--tx5)" } }, greenCount, " of ", THESIS_ITEMS.length, " confirmed"), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700, color: allGreen ? "#66b278" : "#dd817a" } }, allGreen ? "\u2713 THESIS INTACT" : "\u26A0 INCOMPLETE")))), /* @__PURE__ */ React.createElement(Footnote, { text: `War chest = sum of 'Saved' entries across all logged cycles. Deployed = sum of 'Deployed' entries. Global across all tickers \u2014 future portfolio page will read this same key (th3sis_portfolio).` }));
  };
  return /* @__PURE__ */ React.createElement("div", { style: { padding: "0 0 24px" } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 1280, margin: "0 auto", padding: "20px 22px 0" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, letterSpacing: "0.14em", color: "var(--tx7)", marginBottom: 10 } }, "THE FUTURE \xB7 SHOULD I DEPLOY CAPITAL TO ", TICKER, " THIS CYCLE?"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(
    ScoreCard,
    {
      tipTitle: "If I'm right, what do I make?",
      tipBody: `Bull case: $${bullLo}\u2013$${bullHi} range (+${bullPct}%). Base case: $${baseLo}\u2013$${baseHi} range (${basePct >= 0 ? "+" : ""}${basePct}%). These are 12-month estimates based on EPS \xD7 multiple \u2014 hold loosely. Use the position calculator below to translate % returns into real dollar amounts based on your share count.`,
      question: "IF I'M RIGHT, WHAT DO I MAKE?",
      answer: `BULL +${bullPct}% \xB7 BASE ${basePct >= 0 ? "+" : ""}${basePct}%`,
      detail: `Bull $${bullLo}\u2013${bullHi} \xB7 Base $${baseLo}\u2013${baseHi} \xB7 Bear $${bearLo}\u2013${bearHi}`,
      col: "#66b278",
      panelKey: "outcomes"
    }
  ), /* @__PURE__ */ React.createElement(
    ScoreCard,
    {
      tipTitle: "If I'm wrong, how much do I lose?",
      tipBody: `Bear case: $${bearLo}\u2013$${bearHi} range (${bearPct}% from $${NOW_PRICE}). This assumes multiple compression to ${VAL_CONFIG.pe_trough}\u2013${VAL_CONFIG.pe_bear_hi}\xD7 on roughly flat-to-down EPS \u2014 triggered by persistent revenue/margin guide misses or a new export-control/tariff escalation. Use the portfolio loss calculator in this panel to see the dollar impact on your specific position size.`,
      question: "IF I'M WRONG, HOW MUCH DO I LOSE?",
      answer: `BEAR ${bearPct}% \u2014 $${bearLo}\u2013${bearHi}`,
      detail: `Bear case: revenue/margin guide misses persist \xB7 Multiple compresses to ${VAL_CONFIG.pe_trough}\u2013${VAL_CONFIG.pe_bear_hi}\xD7 \xB7 cross-strait risk escalates`,
      col: "#dd817a",
      panelKey: "downside"
    }
  ), /* @__PURE__ */ React.createElement(
    ScoreCard,
    {
      tipTitle: "Is today's price a gift or a trap?",
      tipBody: `At ${currentPE}\xD7 NTM P/E, ${TICKER} trades ${parseFloat(currentPE) <= VAL_CONFIG.pe_normal_lo ? `below its historical fair value range (${VAL_CONFIG.pe_normal_lo}\u2013${VAL_CONFIG.pe_normal_hi}\xD7)` : parseFloat(currentPE) <= VAL_CONFIG.pe_normal_hi ? `inside its historical fair value range (${VAL_CONFIG.pe_normal_lo}\u2013${VAL_CONFIG.pe_normal_hi}\xD7)` : `above its historical fair value range (${VAL_CONFIG.pe_normal_lo}\u2013${VAL_CONFIG.pe_normal_hi}\xD7)`}. ${TEXT.future.dislocEventName} created the last real dislocation \u2014 ${dislocDays} days ago \u2014 and the stock has long since reclaimed the base floor of $${REVERSION_BASEFLOOR}. That dislocation resolved within the ${REVERSION_PRECEDENT_DAYS}-day precedent window once the thesis stayed intact.`,
      question: "IS TODAY'S PRICE A GIFT OR A TRAP?",
      answer: `${parseFloat(currentPE)}\xD7 NTM P/E \u2014 ${parseFloat(currentPE) <= VAL_CONFIG.pe_normal_lo ? "BELOW FAIR" : parseFloat(currentPE) <= VAL_CONFIG.pe_normal_hi ? "FAIR VALUE" : "ABOVE FAIR"}`,
      detail: `${dislocSignal.label}: ${dislocDays}d since ${TEXT.future.dislocEventName} \xB7 Base floor $${REVERSION_BASEFLOOR}`,
      col: dislocSignal.col,
      panelKey: "signal"
    }
  ), /* @__PURE__ */ React.createElement(
    ScoreCard,
    {
      tipTitle: "What is my war chest?",
      tipBody: `War chest = cumulative 'Saved' capital from cycle log entries. Current: $${warChest.toLocaleString()} undeployed. Deployment mode: ${deployMode.label}${deployMode.range ? " (" + deployMode.range + ")" : ""} \u2014 ${deployMode.sub}. Modes: EXPLORE ($100\u2013200, pre-conviction), NIBBLE ($200\u2013400, thesis forming), ADD ($400\u2013600, thesis intact), DEPLOY ($600\u2013800+, dislocation + high conviction).`,
      question: "WHAT IS MY WAR CHEST?",
      answer: `$${warChest.toLocaleString()} SAVED \xB7 MODE: ${deployMode.label}${deployMode.range ? " " + deployMode.range : ""}${blendedAll > 0 ? " \xB7 BASIS $" + blendedAll.toFixed(0) : ""}`,
      detail: blendedAll > 0 ? `${allShares.toFixed(0)} shares \xB7 avg $${blendedAll.toFixed(2)} \xB7 ${deployMode.sub}` : deployMode.sub,
      col: deployMode.col,
      panelKey: "capital"
    }
  )), /* @__PURE__ */ React.createElement("div", { ...tip("THE FUTURE \xB7 Final Call", `The deployment verdict is driven by three inputs: (1) thesis health \u2014 are the buy reasons still true? (2) price zone \u2014 is NOW_PRICE below the base floor? (3) war chest \u2014 do you have dry powder to deploy? DEPLOY requires all three favourable. NIBBLE if price is right but thesis is WATCH. WAIT if price is stretched. EXIT if thesis is BROKEN.`, `Current mode: ${deployMode.label}. ${deployMode.sub}.`, deployMode.col), style: {
    padding: "14px 18px",
    borderRadius: 8,
    marginBottom: 16,
    background: `${deployMode.col}18`,
    border: `1px solid ${deployMode.col}55`,
    boxShadow: `0 0 20px ${deployMode.col}22`
  } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 8.5, letterSpacing: "0.14em", color: "var(--tx6)", marginBottom: 5 } }, "THE FUTURE \xB7 FINAL CALL"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 18, fontWeight: 700, color: deployMode.col, letterSpacing: "0.08em", marginBottom: 4 } }, deployMode.label, deployMode.range ? ` \u2014 ${deployMode.range}` : ""), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10.5, color: "var(--tx4)", lineHeight: 1.55, marginBottom: 10 } }, deployMode.sub), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } }, TEXT.future.chips.map(({ label, col }) => /* @__PURE__ */ React.createElement("div", { key: label, style: {
    padding: "3px 8px",
    borderRadius: 20,
    fontSize: 8.5,
    background: `${col}18`,
    border: `1px solid ${col}44`,
    color: col,
    letterSpacing: "0.08em",
    fontWeight: 600
  } }, label))))), /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 1280, margin: "0 auto", padding: "0 22px", marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 0 } }, chevrons.map(({ key, label, col, tipBody }, i) => {
    const on = panel === key;
    const isFirst = i === 0;
    const isLast = i === chevrons.length - 1;
    const clip = isFirst ? "polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%)" : isLast ? "polygon(0 0, 100% 0, 100% 100%, 0 100%, 14px 50%)" : "polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%, 14px 50%)";
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        key,
        onClick: () => setPanel(key),
        ...tipBody ? tip(label, tipBody, null, col) : {},
        style: {
          flex: 1,
          clipPath: clip,
          cursor: "pointer",
          transition: "background .15s",
          background: on ? `${col}28` : "var(--inner-bg)",
          border: on ? `1px solid ${col}66` : "1px solid var(--bd2)",
          padding: isFirst ? "8px 22px 8px 14px" : isLast ? "8px 14px 8px 26px" : "8px 22px 8px 26px",
          marginLeft: i > 0 ? -1 : 0
        }
      },
      /* @__PURE__ */ React.createElement("div", { style: {
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: "0.1em",
        color: on ? col : "var(--tx7)"
      } }, label)
    );
  }))), /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 1280, margin: "0 auto", padding: "0 22px 0" } }, /* @__PURE__ */ React.createElement("div", { style: {
    background: "var(--panel-bg)",
    border: "1px solid var(--bd2)",
    borderRadius: 8,
    padding: "16px 18px",
    minHeight: 320
  } }, panel === "outcomes" && /* @__PURE__ */ React.createElement(OutcomesPanel, null), panel === "downside" && /* @__PURE__ */ React.createElement(DownsidePanel, null), panel === "signal" && /* @__PURE__ */ React.createElement(SignalPanel, null), panel === "capital" && /* @__PURE__ */ React.createElement(CapitalPanel, null))), /* @__PURE__ */ React.createElement("div", { style: {
    maxWidth: 1280,
    margin: "12px auto 0",
    padding: "0 22px",
    fontSize: 10.5,
    color: "var(--tx7)",
    lineHeight: 1.5
  } }, "Scenario returns are estimates based on consensus EPS \xD7 multiple. Not financial advice \u2014 hold all bands loosely. As of ", AS_OF_DATE, "."));
}
function PastTab() {
  var _a, _b;
  const [panel, setPanel] = useState("durability");
  const v = VAL_CONFIG;
  const nY = PAST_YEARS.length;
  const revCAGR = Math.pow(PAST_REV[nY - 1] / PAST_REV[0], 1 / (nY - 1)) - 1;
  const latestGM = PAST_GM[nY - 1];
  const latestFCF = PAST_FCF[nY - 1];
  const latestROIC = PAST_ROIC[nY - 1];
  const latestCapex = PAST_CAPEX_REV[nY - 1];
  const peakCapex = Math.max(...PAST_CAPEX_REV);
  const evAvg = PAST_EVEBITDA.reduce((a, b) => a + b, 0) / PAST_EVEBITDA.length;
  const evNow = (_b = (_a = v.peers.find((p) => p.t === TICKER_META.ticker)) == null ? void 0 : _a.ev_eb) != null ? _b : PAST_EVEBITDA[nY - 1];
  const durabilityStatus = revCAGR > 0.12 && latestGM > 55 ? { label: "STRONG", desc: `${(revCAGR * 100).toFixed(0)}% ${nY - 1}Y REVENUE CAGR \xB7 ${latestGM}% GROSS MARGIN`, col: "#66b278" } : revCAGR > 0.06 ? { label: "ADEQUATE", desc: `${(revCAGR * 100).toFixed(0)}% ${nY - 1}Y REVENUE CAGR`, col: "#c59542" } : { label: "WEAK", desc: "GROWTH STALLED", col: "#dd817a" };
  const valueStatus = latestROIC > 15 ? { label: "STRONG", desc: `ROIC ${latestROIC}% \xB7 FCF $${latestFCF}B`, col: "#66b278" } : latestROIC > 8 ? { label: "ADEQUATE", desc: `ROIC ${latestROIC}% \xB7 ABOVE WACC`, col: "#c59542" } : { label: "WATCH", desc: `ROIC ${latestROIC}% \xB7 NEAR OR BELOW WACC`, col: "#dd817a" };
  const capexStatus = latestCapex < 35 && latestFCF > PAST_FCF[nY - 2] ? { label: "DISCIPLINED", desc: `${latestCapex}% CAPEX/REVENUE \xB7 DOWN FROM ${peakCapex}% PEAK`, col: "#66b278" } : latestCapex < 45 ? { label: "ELEVATED", desc: `${latestCapex}% CAPEX/REVENUE \xB7 WATCH FCF`, col: "#c59542" } : { label: "AGGRESSIVE", desc: `${latestCapex}% CAPEX/REVENUE \xB7 HIGH SPEND`, col: "#dd817a" };
  const moodStatus = evNow < evAvg * 0.85 ? { label: "DEPRESSED", desc: `EV/EBITDA ${evNow}\xD7 \xB7 BELOW 10Y AVG ${evAvg.toFixed(0)}\xD7`, col: "#66b278" } : evNow < evAvg * 1.2 ? { label: "FAIRLY VALUED", desc: `EV/EBITDA ${evNow}\xD7 \xB7 NEAR 10Y AVG ${evAvg.toFixed(0)}\xD7`, col: "#c59542" } : { label: "ELEVATED", desc: `EV/EBITDA ${evNow}\xD7 \xB7 ABOVE 10Y AVG ${evAvg.toFixed(0)}\xD7`, col: "#dd817a" };
  const scores = [durabilityStatus, valueStatus, capexStatus, moodStatus];
  const reds = scores.filter((s) => s.col === "#dd817a").length;
  const ambers = scores.filter((s) => s.col === "#c59542").length;
  const overallBiz = reds > 0 ? { label: "FUNDAMENTAL CONCERN", sub: "One or more areas need investigation", col: "#dd817a" } : ambers > 1 ? { label: "GOOD BUSINESS", sub: "Strong core with concerns to monitor", col: "#c59542" } : { label: "STRONG BUSINESS", sub: "Track record supports long-term ownership", col: "#66b278" };
  const ScoreCard = ({ question, answer, desc, col, panelKey, tipTitle: tipTitle2, tipBody }) => /* @__PURE__ */ React.createElement("div", { onClick: () => setPanel(panelKey), ...tipTitle2 ? tip(tipTitle2, tipBody, `Click to view ${nY - 1}-year evidence below`, col) : {}, style: {
    background: "var(--inner-bg)",
    border: `1px solid ${col}44`,
    borderLeft: `3px solid ${col}`,
    borderRadius: 8,
    padding: "14px 16px",
    cursor: "pointer",
    transition: "background .15s"
  } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 8, letterSpacing: "0.14em", color: "var(--tx6)", marginBottom: 5 } }, question), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11.5, fontWeight: 700, color: col, marginBottom: 4, letterSpacing: "0.06em" } }, answer), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9.5, color: "var(--tx5)", lineHeight: 1.5 } }, desc), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 6, fontSize: 8, color: col, opacity: 0.7, letterSpacing: "0.1em" } }, "VIEW EVIDENCE \u203A"));
  const PANELS = [
    { key: "durability", label: "\u2460 DURABILITY", sub: "revenue \xB7 margin \xB7 FCF", tipBody: "Multi-year Revenue, Gross Margin, and Free Cash Flow. Are the numbers growing consistently through cycles? We want to see durable compounding, not one-time spikes." },
    { key: "value", label: "\u2461 VALUE CREATION", sub: "ROIC \xB7 capital returns", tipBody: "ROIC vs cost of capital and FCF Yield history. Is management creating real economic value \u2014 or just growing revenue while destroying shareholder capital?" },
    { key: "leverage", label: "\u2462 CAPEX INTENSITY", sub: "spend vs payoff \xB7 cycle", tipBody: "Capex as a % of revenue over time, paired with Free Cash Flow. The real question is whether the spend is being monetized faster than it's growing. A threat explains capex; only results justify it." },
    { key: "mood", label: "\u2463 MOOD HISTORY", sub: "price \xB7 multiple \xB7 cycle", tipBody: "Multi-year price, drawdown from rolling ATH, and EV/EBITDA multiple history. When has the market been too fearful or too greedy \u2014 and what happened next?" }
  ];
  const BarChart = ({ data, labels, colorFn, unit = "", height = 110, note }) => {
    const valid = data.filter((v2) => v2 !== null);
    const maxV = Math.max(...valid);
    const minV = Math.min(...valid, 0);
    const range = maxV - minV || 1;
    const W = 560, H = height, pad = 28, barW = Math.floor((W - pad * 2) / data.length) - 2;
    return /* @__PURE__ */ React.createElement(
      "svg",
      {
        width: "100%",
        viewBox: `0 0 ${W} ${H + 28}`,
        preserveAspectRatio: "xMidYMid meet",
        style: { fontFamily: FONT_MONO }
      },
      minV < 0 && /* @__PURE__ */ React.createElement(
        "line",
        {
          x1: pad,
          x2: W - pad,
          y1: H - (0 - minV) / range * H,
          y2: H - (0 - minV) / range * H,
          stroke: "var(--tx7)",
          strokeWidth: 0.5,
          strokeDasharray: "2,2"
        }
      ),
      data.map((v2, i) => {
        if (v2 === null) return null;
        const col = colorFn ? colorFn(v2) : "#66b278";
        const x = pad + i * ((W - pad * 2) / data.length) + 1;
        const zeroY = H - (0 - minV) / range * H;
        const barH = Math.abs(v2) / range * H;
        const y = v2 >= 0 ? zeroY - barH : zeroY;
        return /* @__PURE__ */ React.createElement("g", { key: i }, /* @__PURE__ */ React.createElement(
          "rect",
          {
            x,
            y,
            width: barW,
            height: Math.max(barH, 1),
            fill: col + "bb",
            rx: 1,
            ...tipSvg(labels[i], `Value: ${v2}${unit}`, null, col)
          }
        ), /* @__PURE__ */ React.createElement(
          "text",
          {
            x: x + barW / 2,
            y: H + 18,
            textAnchor: "middle",
            fontSize: 7.5,
            fill: "var(--tx6)"
          },
          labels[i]
        ), i === data.length - 1 && /* @__PURE__ */ React.createElement(
          "text",
          {
            x: x + barW / 2,
            y: y - 3,
            textAnchor: "middle",
            fontSize: 8,
            fill: col,
            fontWeight: "700"
          },
          v2,
          unit
        ));
      })
    );
  };
  const PriceLineChart = () => {
    const W = 640, H = 160, pad = { l: 40, r: 16, t: 16, b: 24 };
    const iW = W - pad.l - pad.r, iH = H - pad.t - pad.b;
    const maxP = Math.max(...PRICE_M), minP = Math.min(...PRICE_M);
    const rng = maxP - minP;
    const n = PRICE_M.length;
    const xOf = (i) => pad.l + i / (n - 1) * iW;
    const yOf2 = (p) => pad.t + (1 - (p - minP) / rng) * iH;
    const pts = PRICE_M.map((p, i) => `${xOf(i).toFixed(1)},${yOf2(p).toFixed(1)}`).join(" ");
    const areaBase = pad.t + iH;
    const areaPts = `${xOf(0)},${areaBase} ` + pts + ` ${xOf(n - 1)},${areaBase}`;
    const nowIdx = n - 1;
    const yearTicks = PRICE_M_LABELS.map((l, i) => ({ i, label: l })).filter(({ label }) => label.endsWith("-01") || label === PRICE_M_LABELS[0]);
    return /* @__PURE__ */ React.createElement(
      "svg",
      {
        width: "100%",
        viewBox: `0 0 ${W} ${H}`,
        preserveAspectRatio: "xMidYMid meet",
        style: { fontFamily: FONT_MONO }
      },
      /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("linearGradient", { id: "priceGrad", x1: "0", y1: "0", x2: "0", y2: "1" }, /* @__PURE__ */ React.createElement("stop", { offset: "0%", stopColor: "#66b278", stopOpacity: "0.18" }), /* @__PURE__ */ React.createElement("stop", { offset: "100%", stopColor: "#66b278", stopOpacity: "0.01" }))),
      /* @__PURE__ */ React.createElement("polygon", { points: areaPts, fill: "url(#priceGrad)" }),
      /* @__PURE__ */ React.createElement("polyline", { points: pts, fill: "none", stroke: "#66b278", strokeWidth: 1.5 }),
      yearTicks.map(({ i, label }) => /* @__PURE__ */ React.createElement("g", { key: label }, /* @__PURE__ */ React.createElement(
        "line",
        {
          x1: xOf(i),
          x2: xOf(i),
          y1: pad.t + iH,
          y2: pad.t + iH + 4,
          stroke: "var(--tx7)",
          strokeWidth: 0.5
        }
      ), /* @__PURE__ */ React.createElement("text", { x: xOf(i), y: H - 4, textAnchor: "middle", fontSize: 7.5, fill: "var(--tx7)" }, label.slice(0, 4)))),
      PAST_EVENTS.map(({ idx, label, note }) => {
        const x = xOf(idx);
        const y = yOf2(PRICE_M[idx]);
        return /* @__PURE__ */ React.createElement("g", { key: label, ...tipSvg(label, note || label, null, "var(--tx5)") }, /* @__PURE__ */ React.createElement(
          "line",
          {
            x1: x,
            x2: x,
            y1: pad.t,
            y2: pad.t + iH,
            stroke: "var(--tx6)",
            strokeWidth: 0.8,
            strokeDasharray: "3,2",
            opacity: 0.5
          }
        ), /* @__PURE__ */ React.createElement("text", { x, y: pad.t - 2, textAnchor: "middle", fontSize: 7, fill: "var(--tx5)" }, label));
      }),
      (() => {
        const athIdx = PRICE_M.indexOf(Math.max(...PRICE_M));
        const isATH = athIdx === nowIdx;
        return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
          "circle",
          {
            cx: xOf(nowIdx),
            cy: yOf2(PRICE_M[nowIdx]),
            r: 3,
            fill: "#46aad9",
            ...tipSvg("Current price", TEXT.past.priceNowTip(PRICE_M[nowIdx], isATH), null, "#46aad9")
          }
        ), /* @__PURE__ */ React.createElement(
          "text",
          {
            x: xOf(nowIdx) - 6,
            y: yOf2(PRICE_M[nowIdx]) - 6,
            textAnchor: "end",
            fontSize: 8,
            fill: "#46aad9",
            fontWeight: "700"
          },
          "$",
          PRICE_M[nowIdx],
          isATH ? " (ATH)" : ""
        ), !isATH && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
          "circle",
          {
            cx: xOf(athIdx),
            cy: yOf2(PRICE_M[athIdx]),
            r: 2.5,
            fill: "#c59542",
            ...tipSvg("All-Time High", `$${PRICE_M[athIdx]} \u2014 the highest monthly close in this window.`, null, "#c59542")
          }
        ), /* @__PURE__ */ React.createElement(
          "text",
          {
            x: xOf(athIdx) + 4,
            y: yOf2(PRICE_M[athIdx]) - 4,
            fontSize: 7.5,
            fill: "#c59542"
          },
          "ATH $",
          PRICE_M[athIdx]
        )));
      })(),
      [minP, (minP + maxP) / 2, maxP].map((val) => /* @__PURE__ */ React.createElement(
        "text",
        {
          key: val,
          x: pad.l - 4,
          y: yOf2(val) + 3,
          textAnchor: "end",
          fontSize: 7.5,
          fill: "var(--tx6)"
        },
        "$",
        Math.round(val)
      ))
    );
  };
  const DrawdownChart = () => {
    const W = 640, H = 70, pad = { l: 40, r: 16, t: 8, b: 20 };
    const iW = W - pad.l - pad.r, iH = H - pad.t - pad.b;
    const minDD = Math.min(...PRICE_M_DD);
    const n = PRICE_M_DD.length;
    const xOf = (i) => pad.l + i / (n - 1) * iW;
    const yOf2 = (d) => pad.t + d / minDD * iH;
    const pts = PRICE_M_DD.map((d, i) => `${xOf(i).toFixed(1)},${yOf2(d).toFixed(1)}`).join(" ");
    const areaBase = pad.t;
    const areaPts = `${xOf(0)},${areaBase} ` + pts + ` ${xOf(n - 1)},${areaBase}`;
    return /* @__PURE__ */ React.createElement(
      "svg",
      {
        width: "100%",
        viewBox: `0 0 ${W} ${H}`,
        preserveAspectRatio: "xMidYMid meet",
        style: { fontFamily: FONT_MONO }
      },
      /* @__PURE__ */ React.createElement("polygon", { points: areaPts, fill: "#dd817a", opacity: 0.12 }),
      /* @__PURE__ */ React.createElement("polyline", { points: pts, fill: "none", stroke: "#dd817a", strokeWidth: 1 }),
      /* @__PURE__ */ React.createElement("line", { x1: pad.l, x2: W - pad.r, y1: pad.t, y2: pad.t, stroke: "var(--tx7)", strokeWidth: 0.5 }),
      (() => {
        const wIdx = PRICE_M_DD.indexOf(minDD);
        return /* @__PURE__ */ React.createElement(
          "text",
          {
            x: xOf(wIdx),
            y: yOf2(minDD) + 10,
            textAnchor: "middle",
            fontSize: 7.5,
            fill: "#dd817a",
            ...tipSvg("Maximum Drawdown", TEXT.past.ddTip(minDD), null, "#dd817a")
          },
          minDD,
          "%"
        );
      })(),
      /* @__PURE__ */ React.createElement("text", { x: pad.l - 4, y: pad.t + 3, textAnchor: "end", fontSize: 7, fill: "var(--tx7)" }, "0%"),
      /* @__PURE__ */ React.createElement("text", { x: pad.l - 4, y: pad.t + iH, textAnchor: "end", fontSize: 7, fill: "var(--tx6)" }, minDD, "%")
    );
  };
  const Banner = ({ status, desc, col, summary }) => /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    alignItems: "flex-start",
    gap: 14,
    padding: "10px 14px",
    background: col + "12",
    border: `1px solid ${col}44`,
    borderLeft: `3px solid ${col}`,
    borderRadius: 7,
    marginBottom: 18
  } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", color: col, marginBottom: 3 } }, status, " \u2014 ", desc), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--tx3)", lineHeight: 1.6 } }, summary)));
  const ChartBox = ({ title, sub, children }) => /* @__PURE__ */ React.createElement("div", { style: {
    background: "var(--inner-bg)",
    border: "1px solid var(--bd)",
    borderRadius: 8,
    padding: "14px 16px",
    marginBottom: 12
  } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 8.5, letterSpacing: "0.14em", color: "var(--tx6)", marginBottom: 2 } }, title), sub && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: "var(--tx7)", marginBottom: 10 } }, sub), children);
  const Footnote = ({ text }) => /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 9.5,
    color: "var(--tx6)",
    lineHeight: 1.65,
    marginTop: 10,
    padding: "8px 12px",
    background: "var(--inner-bg)",
    borderRadius: 6,
    borderLeft: "2px solid var(--bd)"
  } }, text);
  return /* @__PURE__ */ React.createElement("div", { style: { padding: "0 22px 40px", fontFamily: FONT_MONO } }, /* @__PURE__ */ React.createElement("div", { style: {
    marginTop: 18,
    background: "var(--panel-bg)",
    border: `1px solid ${overallBiz.col}33`,
    borderRadius: 10,
    padding: "18px 18px 14px"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.22em",
    color: "var(--tx6)",
    marginBottom: 14
  } }, "THE PAST \u2014 IS THIS WORTH OWNING?"), /* @__PURE__ */ React.createElement("div", { className: "resp-2col", style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 } }, /* @__PURE__ */ React.createElement(
    ScoreCard,
    {
      question: "DOES IT GROW CONSISTENTLY?",
      answer: durabilityStatus.label,
      desc: durabilityStatus.desc,
      col: durabilityStatus.col,
      panelKey: "durability",
      tipTitle: "Does it grow consistently?",
      tipBody: TEXT.past.cardTips.durability((revCAGR * 100).toFixed(0))
    }
  ), /* @__PURE__ */ React.createElement(
    ScoreCard,
    {
      question: "DOES IT CREATE VALUE (ROIC > WACC)?",
      answer: valueStatus.label,
      desc: valueStatus.desc,
      col: valueStatus.col,
      panelKey: "value",
      tipTitle: "Does it create value?",
      tipBody: TEXT.past.cardTips.value(latestROIC)
    }
  ), /* @__PURE__ */ React.createElement(
    ScoreCard,
    {
      question: "IS THE CAPEX PAYING OFF?",
      answer: capexStatus.label,
      desc: capexStatus.desc,
      col: capexStatus.col,
      panelKey: "leverage",
      tipTitle: "Is the capex paying off?",
      tipBody: TEXT.past.cardTips.capex(peakCapex, latestCapex, latestFCF)
    }
  ), /* @__PURE__ */ React.createElement(
    ScoreCard,
    {
      question: "DOES THE MARKET OVER/UNDERPRICE IT?",
      answer: moodStatus.label,
      desc: moodStatus.desc,
      col: moodStatus.col,
      panelKey: "mood",
      tipTitle: "Does the market over/underprice it?",
      tipBody: TEXT.past.cardTips.mood(evNow, evAvg.toFixed(0))
    }
  )), /* @__PURE__ */ React.createElement("div", { ...tip("THE PAST \xB7 Business Quality Verdict", "Synthesises all four dimensions: durability (consistent growth), value creation (ROIC > WACC), capex intensity (spend vs payoff), and market mood (EV/EBITDA vs history). All green = business earns the right to a premium multiple. Any red = investigate before deploying capital. This is about the BUSINESS, not today's price.", "Hover each quadrant above for what it measures.", overallBiz.col), style: {
    padding: "14px 16px",
    background: overallBiz.col + "12",
    border: `1px solid ${overallBiz.col}44`,
    borderRadius: 8
  } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, letterSpacing: "0.18em", color: overallBiz.col, fontWeight: 700, marginBottom: 4 } }, "THE PAST \xB7 BUSINESS QUALITY VERDICT"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 15, fontWeight: 700, color: overallBiz.col, letterSpacing: "0.06em" } }, overallBiz.label), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10.5, color: "var(--tx4)", marginTop: 4 } }, overallBiz.sub)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9.5, color: "var(--tx5)", textAlign: "right", lineHeight: 1.8 } }, TEXT.past.stats.map((s, i) => /* @__PURE__ */ React.createElement("div", { key: i, ...tip(s.tipTitle, s.tipBody, null, "#66b278"), dangerouslySetInnerHTML: { __html: s.html } })))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--tx4)", lineHeight: 1.75, marginTop: 10 } }, TEXT.past.verdictBody))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "stretch", gap: 0, margin: "18px 0 0" } }, PANELS.map(({ key, label, sub, tipBody }, i) => {
    const isActive = panel === key;
    const colMap = {
      durability: durabilityStatus.col,
      value: valueStatus.col,
      leverage: capexStatus.col,
      mood: moodStatus.col
    };
    const col = colMap[key];
    const isFirst = i === 0, isLast = i === PANELS.length - 1;
    const clip = isFirst ? "polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%)" : "polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%, 14px 50%)";
    const oc = isActive ? col : "var(--bd2)";
    return /* @__PURE__ */ React.createElement("div", { key, onClick: () => setPanel(key), ...tipBody ? tip(label, tipBody, null, col) : {}, style: {
      flex: 1,
      clipPath: clip,
      marginLeft: isFirst ? 0 : "7px",
      background: isActive ? col + "22" : "var(--panel-bg)",
      filter: `drop-shadow(1px 0 0 ${oc}) drop-shadow(-1px 0 0 ${oc}) drop-shadow(0 1px 0 ${oc}) drop-shadow(0 -1px 0 ${oc})`,
      padding: isFirst ? "12px 22px 12px 16px" : "12px 22px 12px 28px",
      cursor: "pointer",
      transition: "background .15s, filter .15s",
      outline: "none"
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      fontSize: 9.5,
      fontWeight: 700,
      letterSpacing: "0.14em",
      color: isActive ? col : "var(--tx4)",
      marginBottom: 3,
      whiteSpace: "nowrap"
    } }, label), /* @__PURE__ */ React.createElement("div", { style: {
      fontSize: 8.5,
      color: isActive ? col : "var(--tx7)",
      whiteSpace: "nowrap",
      opacity: 0.85
    } }, sub));
  })), /* @__PURE__ */ React.createElement("div", { style: {
    background: "var(--panel-bg)",
    border: "1px solid var(--bd)",
    borderRadius: 10,
    padding: "20px 18px",
    marginTop: 14
  } }, panel === "durability" && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.2em",
    color: "var(--tx5)",
    marginBottom: 18,
    paddingBottom: 8,
    borderBottom: "1px solid var(--bd)"
  } }, "DOES IT GROW CONSISTENTLY?"), /* @__PURE__ */ React.createElement(
    Banner,
    {
      status: durabilityStatus.label,
      desc: durabilityStatus.desc,
      col: durabilityStatus.col,
      summary: TEXT.past.banners.durability((revCAGR * 100).toFixed(0), PAST_REV[0], PAST_REV[nY - 1], (latestGM - PAST_GM[0]).toFixed(0), latestGM, PAST_FCF[0], latestFCF)
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "resp-2col", style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 } }, /* @__PURE__ */ React.createElement(ChartBox, { title: `REVENUE ($B) \xB7 ${PAST_YEARS[0]}\u2013${PAST_YEARS[nY - 1]}`, sub: "Annual total net revenue \xB7 cyclical swings annotated" }, /* @__PURE__ */ React.createElement(
    BarChart,
    {
      data: PAST_REV,
      labels: PAST_YEARS,
      unit: "B",
      colorFn: (v2) => "#66b278",
      height: 110
    }
  ), /* @__PURE__ */ React.createElement(
    "div",
    {
      style: { display: "flex", gap: 16, marginTop: 8, fontSize: 9, color: "var(--tx6)" },
      dangerouslySetInnerHTML: { __html: TEXT.past.revAnnotationsHtml }
    }
  )), /* @__PURE__ */ React.createElement(ChartBox, { title: "GROSS MARGIN (%)", sub: "Measures pricing power and mix quality" }, /* @__PURE__ */ React.createElement(
    BarChart,
    {
      data: PAST_GM,
      labels: PAST_YEARS,
      unit: "%",
      colorFn: (v2) => v2 > 58 ? "#66b278" : v2 > 50 ? "#c59542" : "#dd817a",
      height: 110
    }
  ))), /* @__PURE__ */ React.createElement(ChartBox, { title: "FREE CASH FLOW ($B)", sub: "Cash generated after capex \u2014 the real earnings" }, /* @__PURE__ */ React.createElement(
    BarChart,
    {
      data: PAST_FCF,
      labels: PAST_YEARS,
      unit: "B",
      colorFn: (v2) => "#66b278",
      height: 80
    }
  )), /* @__PURE__ */ React.createElement(Footnote, { text: TEXT.past.footnotes.durability })), panel === "value" && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.2em",
    color: "var(--tx5)",
    marginBottom: 18,
    paddingBottom: 8,
    borderBottom: "1px solid var(--bd)"
  } }, "DOES IT CREATE VALUE (ROIC > WACC)?"), /* @__PURE__ */ React.createElement(
    Banner,
    {
      status: valueStatus.label,
      desc: valueStatus.desc,
      col: valueStatus.col,
      summary: TEXT.past.banners.value(latestROIC)
    }
  ), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 } }, /* @__PURE__ */ React.createElement(ChartBox, { title: "ROIC (%)", sub: "Return on Invested Capital \u2014 above WACC = value creation" }, /* @__PURE__ */ React.createElement(
    BarChart,
    {
      data: PAST_ROIC,
      labels: PAST_YEARS,
      unit: "%",
      colorFn: (v2) => v2 > 15 ? "#66b278" : v2 > 5 ? "#c59542" : "#dd817a",
      height: 110
    }
  ), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: "var(--tx6)", marginTop: 8 } }, TEXT.past.roicNote)), /* @__PURE__ */ React.createElement(ChartBox, { title: "FCF YIELD (%)", sub: "FCF \xF7 market cap at year-end price" }, /* @__PURE__ */ React.createElement(
    BarChart,
    {
      data: PAST_FCF_YIELD,
      labels: PAST_YEARS,
      unit: "%",
      colorFn: (v2) => v2 > 5 ? "#66b278" : v2 > 2.5 ? "#c59542" : "#dd817a",
      height: 110
    }
  ), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: "var(--tx6)", marginTop: 8 } }, TEXT.past.fcfYieldNote))), /* @__PURE__ */ React.createElement(Footnote, { text: TEXT.past.footnotes.value })), panel === "leverage" && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.2em",
    color: "var(--tx5)",
    marginBottom: 18,
    paddingBottom: 8,
    borderBottom: "1px solid var(--bd)"
  } }, "IS THE CAPEX PAYING OFF?"), /* @__PURE__ */ React.createElement(
    Banner,
    {
      status: capexStatus.label,
      desc: capexStatus.desc,
      col: capexStatus.col,
      summary: TEXT.past.banners.capex(latestCapex, peakCapex, latestFCF, v.capex_fy26_guide_b)
    }
  ), /* @__PURE__ */ React.createElement(ChartBox, { title: "CAPEX / REVENUE (%)", sub: "Share of every revenue dollar reinvested before FCF" }, /* @__PURE__ */ React.createElement(
    BarChart,
    {
      data: PAST_CAPEX_REV,
      labels: PAST_YEARS,
      unit: "%",
      colorFn: (v2) => v2 < 35 ? "#66b278" : v2 < 45 ? "#c59542" : "#dd817a",
      height: 130
    }
  ), /* @__PURE__ */ React.createElement(
    "div",
    {
      style: { display: "flex", gap: 20, marginTop: 8, fontSize: 9, color: "var(--tx6)", flexWrap: "wrap" },
      dangerouslySetInnerHTML: { __html: TEXT.past.capexAnnotationsHtml }
    }
  )), /* @__PURE__ */ React.createElement(ChartBox, { title: "FREE CASH FLOW ($B)", sub: "The monetization signal \u2014 paired against capex above" }, /* @__PURE__ */ React.createElement(
    BarChart,
    {
      data: PAST_FCF,
      labels: PAST_YEARS,
      unit: "B",
      colorFn: (v2) => "#66b278",
      height: 80
    }
  )), /* @__PURE__ */ React.createElement(Footnote, { text: TEXT.past.footnotes.capex })), panel === "mood" && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.2em",
    color: "var(--tx5)",
    marginBottom: 18,
    paddingBottom: 8,
    borderBottom: "1px solid var(--bd)"
  } }, "DOES THE MARKET OVER/UNDERPRICE IT CYCLICALLY?"), /* @__PURE__ */ React.createElement(
    Banner,
    {
      status: moodStatus.label,
      desc: moodStatus.desc,
      col: moodStatus.col,
      summary: TEXT.past.banners.mood(evNow, evAvg.toFixed(0))
    }
  ), /* @__PURE__ */ React.createElement(
    ChartBox,
    {
      title: TEXT.past.priceChartTitle,
      sub: TEXT.past.priceChartSub
    },
    /* @__PURE__ */ React.createElement(PriceLineChart, null)
  ), /* @__PURE__ */ React.createElement(
    ChartBox,
    {
      title: "DRAWDOWN FROM ROLLING ATH",
      sub: "How far below the peak at each point \u2014 shows entry windows"
    },
    /* @__PURE__ */ React.createElement(DrawdownChart, null),
    /* @__PURE__ */ React.createElement(
      "div",
      {
        style: { display: "flex", gap: 16, marginTop: 8, fontSize: 9, color: "var(--tx6)" },
        dangerouslySetInnerHTML: { __html: TEXT.past.ddAnnotationsHtml }
      }
    )
  ), /* @__PURE__ */ React.createElement(
    ChartBox,
    {
      title: `EV / EBITDA \xB7 ${PAST_YEARS[0]}\u2013${PAST_YEARS[nY - 1]}`,
      sub: "Year-end multiple \u2014 shows market optimism/pessimism cycles"
    },
    /* @__PURE__ */ React.createElement(
      BarChart,
      {
        data: PAST_EVEBITDA,
        labels: PAST_YEARS,
        unit: "\xD7",
        colorFn: (v2) => v2 > evAvg * 1.3 ? "#dd817a" : v2 > evAvg * 0.85 ? "#c59542" : "#66b278",
        height: 90
      }
    ),
    /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, color: "var(--tx6)", marginTop: 6 } }, nY - 1, "Y average: ", evAvg.toFixed(0), "\xD7 \xB7 Current EV/EBITDA: ", evNow, "\xD7 (at $", NOW_PRICE, ")")
  ), /* @__PURE__ */ React.createElement(Footnote, { text: TEXT.past.footnotes.mood }))));
}
function ThesisApp() {
  const [active, setActive] = useState("base");
  const [activeTab, setActiveTab] = useState("the-current");
  useEffect(() => {
    const onGoto = (e) => {
      if (e.data && e.data.type === "th3sis-goto" && e.data.tab) setActiveTab(e.data.tab);
    };
    window.addEventListener("message", onGoto);
    return () => window.removeEventListener("message", onGoto);
  }, []);
  const [isLight, setIsLight] = useState(() => document.documentElement.classList.contains("light"));
  const [live, setLive] = useState({ status: LIVE_PRICE.enabled ? "loading" : "static", at: null });
  useEffect(() => {
    if (!LIVE_PRICE.enabled) return;
    let cancelled = false;
    fetchLivePrice().then((p) => {
      if (cancelled) return;
      if (p == null) {
        setLive({ status: "static", at: null });
        return;
      }
      NOW_PRICE = p;
      HISTORY[HISTORY.length - 1].p = p;
      PRICE_M[PRICE_M.length - 1] = p;
      setLive({ status: "live", at: /* @__PURE__ */ new Date() });
    });
    return () => {
      cancelled = true;
    };
  }, []);
  const toggleTheme = () => {
    const next = !isLight;
    setIsLight(next);
    document.documentElement.classList.toggle("light", next);
    localStorage.setItem("th3sis_theme", next ? "light" : "dark");
    try {
      window.parent.postMessage({ type: "th3sis-theme", light: next }, "*");
    } catch (_) {
    }
  };
  const c = CASES[active];
  const inFrame = window.self !== window.top;
  return /* @__PURE__ */ React.createElement("div", { style: { background: "var(--page-bg)", minHeight: "100vh", padding: "20px 16px", fontFamily: FONT_MONO, color: "var(--tx1)" } }, /* @__PURE__ */ React.createElement("div", { className: "grain", style: { maxWidth: 1280, margin: "0 auto", position: "relative", border: "1px solid var(--bd)", borderRadius: 12, background: "var(--wrap-bg)", boxShadow: "var(--wrap-shadow)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 22px", borderBottom: "1px solid var(--bd)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "baseline", gap: 14 } }, !inFrame && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: FONT_DISPLAY, fontSize: 24, letterSpacing: "0.35em", color: "var(--title)", fontWeight: 600 } }, "TH", /* @__PURE__ */ React.createElement("span", { style: { color: c.accent } }, "3"), "SIS"), /* @__PURE__ */ React.createElement(
    "div",
    {
      ...tip("\u{1F44B} New here?", "Hover your mouse over anything on this page \u2014 charts, bars, dots, labels \u2014 and a plain-English explanation will pop up. No finance degree required.", "This little hint is one too.", "#66b278"),
      style: { fontSize: 10, color: "var(--tx5)", border: "1px solid #222a38", borderRadius: 20, padding: "3px 10px", cursor: "help" }
    },
    "\u24D8 hover anything to learn what it means"
  ))), /* @__PURE__ */ React.createElement("div", { className: "hdr-right", style: { display: "flex", gap: 18, alignItems: "center", fontSize: 12.5, color: "var(--tx4)" } }, /* @__PURE__ */ React.createElement("span", null, AS_OF_DATE), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--tx1)" } }, TICKER_META.exchange, ":", TICKER_META.ticker), /* @__PURE__ */ React.createElement("span", { className: "hdr-company", style: { fontFamily: FONT_DISPLAY, fontStyle: "italic", color: "var(--tx3)" } }, TICKER_META.company), /* @__PURE__ */ React.createElement("span", { style: { display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement(
    "span",
    {
      ...tip(
        "Today's share price",
        live.status === "live" ? TEXT.priceTipLive(NOW_PRICE, live.at ? live.at.toLocaleTimeString() : "just now", AS_OF_DATE) : TEXT.priceTipStatic(NOW_PRICE, AS_OF_DATE, LIVE_PRICE.enabled),
        null,
        "var(--title)"
      ),
      style: { color: "var(--title)", fontWeight: 700, fontSize: 15, cursor: "help" }
    },
    "$",
    NOW_PRICE
  ), /* @__PURE__ */ React.createElement(
    "span",
    {
      ...tip(
        live.status === "live" ? "Live price" : live.status === "loading" ? "Fetching live price\u2026" : "Static price",
        live.status === "live" ? `Spot is live; scenario bands are as of ${AS_OF_DATE}. Price-derived insights recompute from the live quote.` : live.status === "loading" ? "Attempting a live quote \u2014 falls back to the saved price if it cannot reach a feed." : `Showing the saved price as of ${AS_OF_DATE}. The live feed is off or unreachable; everything still renders correctly.`,
        null,
        live.status === "live" ? "#66b278" : "var(--tx5)"
      ),
      style: {
        fontSize: 8.5,
        fontWeight: 700,
        letterSpacing: "0.1em",
        cursor: "help",
        color: live.status === "live" ? "#66b278" : "var(--tx5)",
        border: `1px solid ${live.status === "live" ? "#66b278" : "var(--bd2)"}`,
        borderRadius: 20,
        padding: "2px 8px",
        whiteSpace: "nowrap"
      }
    },
    live.status === "live" ? "\u25CF LIVE" : live.status === "loading" ? "\u25CB SYNC" : "\u25CB AS-OF"
  )), !inFrame && /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: toggleTheme,
      "aria-label": isLight ? "Switch to dark mode" : "Switch to light mode",
      style: {
        background: "transparent",
        border: "1px solid var(--bd2)",
        borderRadius: 20,
        padding: "3px 10px",
        cursor: "pointer",
        fontFamily: FONT_MONO,
        fontSize: 9,
        color: "var(--tx5)",
        letterSpacing: "0.08em",
        transition: "all .15s"
      }
    },
    isLight ? "\u25D1 DARK" : "\u2600 LIGHT"
  ))), /* @__PURE__ */ React.createElement(TabNav, { activeTab, setActiveTab, accentColor: c.accent }), activeTab === "the-past" && /* @__PURE__ */ React.createElement(PastTab, null), activeTab === "the-future" && /* @__PURE__ */ React.createElement(FutureTab, null), activeTab === "the-current" && /* @__PURE__ */ React.createElement(CurrentTab, null)), /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 1280, margin: "12px auto 0", fontSize: 10.5, color: "var(--tx7)", lineHeight: 1.5 } }, TEXT.footerDisclaimer(AS_OF_DATE)));
}
ReactDOM.createRoot(document.getElementById("root")).render(/* @__PURE__ */ React.createElement(ThesisApp, null));
