#!/usr/bin/env python3
"""
Migrate Position tab content into FutureTab panels:
  1. Add position state/helpers/derived values to FutureTab
  2. ② DOWNSIDE — add MY POSITION section (personal bear loss)
  3. ③ SIGNAL   — add price band with basis dots
  4. ④ CAPITAL  — add position tables + thesis checks (rename → CAPITAL & POSITION)
  5. Chevron ④ label update
"""
from pathlib import Path

HTML = Path(__file__).parent / "avgo-thesis.html"
src  = HTML.read_text(encoding="utf-8")

def r(old, new, label):
    global src
    if old not in src:
        print(f"  MISS: {label}")
        return
    src = src.replace(old, new, 1)
    print(f"  OK:   {label}")

# ─────────────────────────────────────────────────────────────────────────────
# 1. Inject position state into FutureTab (before derived scenario values)
# ─────────────────────────────────────────────────────────────────────────────
r(
    """  // ── Derived scenario values ───────────────────────────────────────────────
  const bearLo = 210, bearHi = 280;""",

    """  // ── Position state (migrated from PositionTab) ───────────────────────────
  const [checks, setChecks]         = useState(() => loadPos()?.checks    || { aiTarget: false, xpuCustomers: false, aiGrowth: false, vmwareArr: false });
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
  const clearPos      = () => { if (window.confirm("Clear all AVGO position data?")) { localStorage.removeItem(POS_KEY); setTranches(DEFAULT_TRANCHES); setChecks({ aiTarget: false, xpuCustomers: false, aiGrowth: false, vmwareArr: false }); } };

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
  const POS_BEAR_MID = 245, POS_BASE_MID = 425, POS_BULL_MID = 590;
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
  const bearLo = 210, bearHi = 280;""",

    "Add position state/helpers/derived to FutureTab"
)

# ─────────────────────────────────────────────────────────────────────────────
# 2. DownsidePanel — rename shadowing local `posPct` → `calcPct`, add MY POSITION
# ─────────────────────────────────────────────────────────────────────────────
r(
    """  const DownsidePanel = () => {
    const [portK, setPortK] = useState(100);
    const [posPct, setPosPct] = useState(2.0);
    const portV   = portK * 1000;
    const posV    = Math.round(portV * posPct / 100);
    const shares  = Math.round(posV / NOW_PRICE);
    const bearLoss = Math.round(shares * (NOW_PRICE - bearMid));
    const bearLossPct = ((bearLoss / portV) * 100).toFixed(1);""",

    """  const DownsidePanel = () => {
    const [portK, setPortK]     = useState(100);
    const [calcPct, setCalcPct] = useState(2.0);
    const portV       = portK * 1000;
    const posV        = Math.round(portV * calcPct / 100);
    const shares      = Math.round(posV / NOW_PRICE);
    const bearLoss    = Math.round(shares * (NOW_PRICE - bearMid));
    const bearLossPct = ((bearLoss / portV) * 100).toFixed(1);""",

    "DownsidePanel: rename posPct → calcPct to avoid shadowing"
)

# Fix the slider that references the old `posPct` / `setPosPct` inside DownsidePanel
r(
    """              <div style={{ flex: 1, minWidth: 140 }}>
              <div style={{ fontSize: 9, color: "var(--tx6)", marginBottom: 3 }}>POSITION SIZE (%)</div>
              <input type="number" min="0.5" max="50" step="0.5" value={posPct} onChange={e => setPosPct(Math.min(50, Math.max(0.5, parseFloat(e.target.value) || 2)))}""",

    """              <div style={{ flex: 1, minWidth: 140 }}>
              <div style={{ fontSize: 9, color: "var(--tx6)", marginBottom: 3 }}>POSITION SIZE (%)</div>
              <input type="number" min="0.5" max="50" step="0.5" value={calcPct} onChange={e => setCalcPct(Math.min(50, Math.max(0.5, parseFloat(e.target.value) || 2)))}""",

    "DownsidePanel: fix slider to use calcPct"
)

# Fix the position value card that references posPct inside DownsidePanel
r(
    """              { label: "POSITION VALUE", val: `$${posV.toLocaleString()}`, sub: `~${shares} shares @ $${NOW_PRICE}`, col: "var(--tx3)", tipTitle: "Position value", tipBody: `At $${NOW_PRICE} with a ${posPct}% allocation in a $${portK}K portfolio""",

    """              { label: "POSITION VALUE", val: `$${posV.toLocaleString()}`, sub: `~${shares} shares @ $${NOW_PRICE}`, col: "var(--tx3)", tipTitle: "Position value", tipBody: `At $${NOW_PRICE} with a ${calcPct}% allocation in a $${portK}K portfolio""",

    "DownsidePanel: fix tipBody to use calcPct"
)

# Add MY POSITION section before the DownsidePanel Footnote
r(
    """        <Footnote text={`Bear case scenario: AI capex discipline or VMware churn. Assumes ~23× multiple on EPS ~$${bearMid === 245 ? 9.5 : 10}. Position loss is illustrative at $${NOW_PRICE} entry.`} />
      </div>
    );
  };

  // ── SIGNAL panel ──────────────────────────────────────────────────────────""",

    """        {/* MY POSITION — personal bear case impact from saved data */}
        {allShares > 0 && (
          <div style={{ marginTop: 12, padding: "12px 14px", background: "rgba(47,109,255,0.06)",
            border: "1px solid rgba(47,109,255,0.25)", borderRadius: 6 }}>
            <div style={{ fontSize: 9, letterSpacing: "0.12em", color: "#2f6dff", marginBottom: 8 }}>MY AVGO POSITION — BEAR CASE IMPACT</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              {[
                { label: "TOTAL SHARES",   val: allShares.toFixed(0),    sub: `${exShares > 0 ? exShares.toFixed(0) + " existing" : ""}${exShares > 0 && totShares > 0 ? " + " : ""}${totShares > 0 ? totShares.toFixed(0) + " adds" : ""}`, col: "#2f6dff" },
                { label: "BLENDED BASIS",  val: `$${blendedAll.toFixed(2)}`, sub: blendedAll > NOW_PRICE ? `underwater $${(blendedAll - NOW_PRICE).toFixed(2)}` : `up $${(NOW_PRICE - blendedAll).toFixed(2)}`, col: blendedAll <= NOW_PRICE ? "#3fd07a" : "#e0a83b" },
                { label: "BEAR CASE LOSS", val: `-$${Math.abs(posBearLoss).toLocaleString(undefined,{maximumFractionDigits:0})}`, sub: `${posBearLossPct}% of $${portfolioK}K portfolio`, col: "#f1564b" },
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
                background: posAbsLoss > 5 ? "#f1564b" : posAbsLoss > 2 ? "#e0a83b" : "#3fd07a",
                borderRadius: 3, transition: "width .2s" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 8.5, color: "var(--tx7)", marginBottom: 6 }}>
              <span style={{ color: "#3fd07a" }}>comfortable &lt;2%</span>
              <span style={{ color: "#e0a83b" }}>watch 2–5%</span>
              <span style={{ color: "#f1564b" }}>size down &gt;5%</span>
            </div>
            <div style={{ fontSize: 10, color: "var(--tx5)", lineHeight: 1.5 }}>
              {posAbsLoss > 5 ? "Bear case hits hard — consider halving the position size."
                : posAbsLoss > 2 ? "Manageable. Make sure you can sit through this without panic-selling."
                : "Comfortable size. Room to add a second tranche without blowing limits."}
            </div>
          </div>
        )}
        <Footnote text={`Bear case scenario: AI capex discipline or VMware churn. Assumes ~23× multiple on EPS ~$${bearMid === 245 ? 9.5 : 10}. Position loss is illustrative at $${NOW_PRICE} entry.`} />
      </div>
    );
  };

  // ── SIGNAL panel ──────────────────────────────────────────────────────────""",

    "Add MY POSITION section to DownsidePanel"
)

# ─────────────────────────────────────────────────────────────────────────────
# 3. SignalPanel — add price zone band after dislocation, before FCF yield
# ─────────────────────────────────────────────────────────────────────────────
r(
    """        {/* FCF yield */}
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { label: "FCF YIELD",""",

    """        {/* Price zone with position dots */}
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
              <div {...tip("Existing position basis", `Pre-thesis entry at $${exBasis.toFixed(2)} · ${exShares.toFixed(0)} shares · $${exCost.toLocaleString(undefined,{maximumFractionDigits:0})} total`, null, "#2f6dff")}
                style={{ position: "absolute", top: "50%", left: visPct(exBasis), transform: "translate(-50%,-50%)",
                  width: 12, height: 12, borderRadius: "50%", background: "#2f6dff",
                  border: "2px solid var(--panel-bg)", boxShadow: "0 0 8px #2f6dff", zIndex: 4 }} />
            )}
            {blendedAll > VIS_LO && blendedAll < VIS_HI && allShares > exShares && (
              <div {...tip("Combined blended basis", `Avg cost $${blendedAll.toFixed(2)} across all ${allShares.toFixed(0)} shares (existing + thesis adds)`, null, "var(--blue-soft)")}
                style={{ position: "absolute", top: "50%", left: visPct(blendedAll), transform: "translate(-50%,-50%)",
                  width: 14, height: 14, borderRadius: "50%", background: "var(--blue-soft)",
                  border: "2px solid var(--panel-bg)", boxShadow: "0 0 10px var(--blue-soft)", zIndex: 5 }} />
            )}
            <div {...tip(`Current price $${NOW_PRICE}`, NOW_PRICE < 390 ? "Below base floor — dislocation window open" : NOW_PRICE <= 460 ? "Inside base band — fair value territory" : "Above base — price stretched", null, "#2f6dff")}
              style={{ position: "absolute", top: "50%", left: visPct(NOW_PRICE), transform: "translate(-50%,-50%)",
                width: 10, height: 10, borderRadius: "50%", background: "#2f6dff44",
                border: "2px solid #2f6dff", boxShadow: "0 0 8px #2f6dff", zIndex: 6 }} />
            <div style={{ position: "absolute", top: -16, left: visPct(NOW_PRICE), transform: "translateX(-50%)",
              fontSize: 8.5, color: "#2f6dff", fontWeight: 700, whiteSpace: "nowrap" }}>NOW ${NOW_PRICE}</div>
            {exBasis > VIS_LO && exBasis < VIS_HI && Math.abs(exBasis - NOW_PRICE) > 5 && (
              <div style={{ position: "absolute", top: 20, left: visPct(exBasis), transform: "translateX(-50%)",
                fontSize: 8.5, color: "#2f6dff", whiteSpace: "nowrap" }}>BASIS ${exBasis.toFixed(0)}</div>
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
            { label: "FCF YIELD",""",

    "Add price zone band with basis dots to SignalPanel"
)

# ─────────────────────────────────────────────────────────────────────────────
# 4. CapitalPanel — add MY AVGO POSITION section before the Footnote
# ─────────────────────────────────────────────────────────────────────────────
r(
    """        <Footnote text={`War chest = sum of 'Saved' entries across all logged cycles. Deployed = sum of 'Deployed' entries. Global across all tickers — future portfolio page will read this same key (th3sis_portfolio).`} />
      </div>
    );
  };""",

    """        {/* ── MY AVGO POSITION ─────────────────────────────────────────────── */}
        <div style={{ marginTop: 16, borderTop: "1px solid var(--bd)", paddingTop: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontSize: 9, letterSpacing: "0.12em", color: "var(--tx6)" }}>MY AVGO POSITION</div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ fontSize: 9, color: flash ? "#3fd07a" : "transparent", transition: "color .3s", letterSpacing: "0.1em" }}>✓ SAVED</span>
              <button onClick={clearPos} style={{ fontSize: 8, padding: "3px 8px", borderRadius: 3,
                border: "1px solid rgba(241,86,75,0.3)", background: "rgba(241,86,75,0.08)",
                color: "#f1564b", cursor: "pointer", letterSpacing: "0.08em" }}>CLEAR</button>
            </div>
          </div>

          {/* Existing position */}
          <div style={{ padding: "10px 12px", background: "rgba(47,109,255,0.06)",
            border: "1px solid rgba(47,109,255,0.22)", borderRadius: 6, marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: 9.5, letterSpacing: "0.12em", color: "#2f6dff", fontWeight: 700 }}>EXISTING · PRE-THESIS</div>
              <button onClick={addExisting} style={{ background: "transparent", border: "1px solid rgba(47,109,255,0.35)",
                borderRadius: 4, padding: "3px 10px", cursor: "pointer", fontSize: 9.5,
                color: "#2f6dff", fontFamily: FONT_MONO, letterSpacing: "0.08em" }}>+ ADD ROW</button>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(47,109,255,0.22)" }}>
                  {["PRICE ($)", "SHARES", "VALUE", "DATE", ""].map((h, i) => (
                    <th key={i} style={{ padding: "3px 6px",
                      textAlign: i < 3 ? "right" : i === 3 ? "right" : "center",
                      color: "#2f6dff88", fontSize: 9, letterSpacing: "0.1em",
                      fontWeight: 400, paddingBottom: 6 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {existing.map((e) => {
                  const ev = +e.price * +e.shares;
                  const hasV = +e.price > 0 && +e.shares > 0;
                  return (
                    <tr key={e.id} style={{ borderBottom: "1px solid rgba(47,109,255,0.12)" }}>
                      <td style={{ padding: "4px 6px", width: 80 }}>
                        <input type="number" value={e.price}
                          onChange={ev2 => updateEx(e.id, "price", ev2.target.value)}
                          placeholder="—" style={{ ...posInputStyle, accentColor: "#2f6dff" }} />
                      </td>
                      <td style={{ padding: "4px 6px", width: 70 }}>
                        <input type="number" value={e.shares}
                          onChange={ev2 => updateEx(e.id, "shares", ev2.target.value)}
                          placeholder="—" style={{ ...posInputStyle, accentColor: "#2f6dff" }} />
                      </td>
                      <td style={{ padding: "6px", textAlign: "right", width: 76,
                        color: hasV ? "#2f6dff" : "var(--tx8)", fontWeight: hasV ? 600 : 400 }}>
                        {hasV ? `$${ev.toLocaleString(undefined,{maximumFractionDigits:0})}` : "—"}
                      </td>
                      <td style={{ padding: "4px 6px", width: 110 }}>
                        <input type="date" value={e.date}
                          onChange={ev2 => updateEx(e.id, "date", ev2.target.value)}
                          style={{ ...posInputStyle, textAlign: "left", accentColor: "#2f6dff" }} />
                      </td>
                      <td style={{ padding: "4px 6px", textAlign: "center", width: 22 }}>
                        <button onClick={() => delExisting(e.id)}
                          style={{ background: "transparent", border: "none", cursor: "pointer",
                            color: existing.length > 1 ? "rgba(47,109,255,0.4)" : "var(--tx9)",
                            fontSize: 13, lineHeight: 1, padding: "0 2px", fontFamily: FONT_MONO }}>×</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {exBasis > 0 && (
              <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid rgba(47,109,255,0.2)",
                display: "flex", justifyContent: "space-between", fontSize: 10.5 }}>
                <span style={{ color: "#2f6dff88" }}>{exFilled.length} entr{exFilled.length === 1 ? "y" : "ies"} · {exShares.toFixed(0)} shares</span>
                <span style={{ color: "#2f6dff", fontWeight: 700 }}>avg ${exBasis.toFixed(2)} · ${exCost.toLocaleString(undefined,{maximumFractionDigits:0})}</span>
              </div>
            )}
          </div>

          {/* Thesis-driven adds */}
          <div style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: 9.5, letterSpacing: "0.12em", color: "var(--tx5)", fontWeight: 700 }}>THESIS-DRIVEN ADDS</div>
              <button onClick={addTranche} style={{ background: "transparent", border: "1px solid var(--bd2)",
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
                        <button onClick={() => deleteTranche(t.id)}
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
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
            {[
              { label: "EXISTING",       shares: exShares,  cost: exCost,  basis: exBasis,   color: "#2f6dff" },
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
                { label: "AVGO POSITION (%)", val: posPct, set: setPosPct, min: 0.5, max: 20, step: 0.5, fmt: v => `${v.toFixed(1)}%` },
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
                <div style={{ fontSize: 8.5, color: "#f1564b99", marginBottom: 2 }}>BEAR CASE LOSS</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#f1564b" }}>-${Math.abs(posBearLoss).toLocaleString(undefined,{maximumFractionDigits:0})}</div>
                <div style={{ fontSize: 9, color: "var(--tx7)" }}>{posBearLossPct}% of portfolio</div>
              </div>
            </div>
            <div style={{ height: 5, background: "var(--deep-bg)", borderRadius: 3, overflow: "hidden", marginBottom: 4 }}>
              <div style={{ height: "100%", width: `${Math.min(100, posAbsLoss / 10 * 100)}%`,
                background: posAbsLoss > 5 ? "#f1564b" : posAbsLoss > 2 ? "#e0a83b" : "#3fd07a",
                borderRadius: 3, transition: "width .2s" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 8.5, color: "var(--tx7)", marginBottom: 6 }}>
              <span style={{ color: "#3fd07a" }}>comfortable &lt;2%</span>
              <span style={{ color: "#e0a83b" }}>watch 2–5%</span>
              <span style={{ color: "#f1564b" }}>size down &gt;5%</span>
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
                    {...tip(label, note, "Click to toggle.", on ? "#3fd07a" : "var(--tx5)")}
                    style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer",
                      padding: "7px 10px", borderRadius: 5, transition: "all .15s",
                      background: on ? "rgba(63,208,122,0.07)" : "var(--panel-bg)",
                      border: `1px solid ${on ? "rgba(63,208,122,0.28)" : "var(--bd)"}` }}>
                    <div style={{ width: 15, height: 15, borderRadius: 3, flexShrink: 0, marginTop: 2,
                      border: `2px solid ${on ? "#3fd07a" : "var(--bd2)"}`,
                      background: on ? "#3fd07a" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {on && <span style={{ color: "var(--page-bg)", fontSize: 9, fontWeight: 900 }}>✓</span>}
                    </div>
                    <div>
                      <div style={{ fontSize: 10.5, color: on ? "#3fd07a" : "var(--tx3)", fontWeight: on ? 600 : 400 }}>{label}</div>
                      <div style={{ fontSize: 9, color: "var(--tx6)", marginTop: 2 }}>{note}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 8, paddingTop: 6, borderTop: "1px solid var(--bd)",
              display: "flex", justifyContent: "space-between", fontSize: 10.5 }}>
              <span style={{ color: "var(--tx5)" }}>{greenCount} of 4 confirmed</span>
              <span style={{ fontWeight: 700, color: allGreen ? "#3fd07a" : "#f1564b" }}>
                {allGreen ? "✓ THESIS INTACT" : "⚠ INCOMPLETE"}
              </span>
            </div>
          </div>
        </div>

        <Footnote text={`War chest = sum of 'Saved' entries across all logged cycles. Deployed = sum of 'Deployed' entries. Global across all tickers — future portfolio page will read this same key (th3sis_portfolio).`} />
      </div>
    );
  };""",

    "Add MY AVGO POSITION section to CapitalPanel"
)

# ─────────────────────────────────────────────────────────────────────────────
# 5. Update chevron ④ label and tipBody
# ─────────────────────────────────────────────────────────────────────────────
r(
    """    { key: "capital",  label: "④ CAPITAL",   col: warChest >= 400 ? "#3fd07a" : warChest >= 200 ? "#e0a83b" : "#f1564b", tipBody: `War chest tracker: log each investing cycle (deployed + saved amounts). Shows deployment mode, total capital deployed, and what would make you regret not pulling the trigger. Data stored globally under th3sis_portfolio.` },""",

    """    { key: "capital",  label: "④ CAPITAL & POSITION", col: warChest >= 400 ? "#3fd07a" : warChest >= 200 ? "#e0a83b" : "#f1564b", tipBody: `War chest tracker + your AVGO position ledger. Log each investing cycle (deployed + saved). Track your existing pre-thesis position, thesis-driven adds, and combined blended basis. Sizing check calculates bear-case dollar loss at your position size. Thesis checks gate whether it is time to add.` },""",

    "Update chevron ④ label and tipBody"
)

# Also update the scorecard "WHAT IS MY WAR CHEST?" answer to include basis when available
r(
    """            answer={`$${warChest.toLocaleString()} SAVED · MODE: ${deployMode.label}${deployMode.range ? " " + deployMode.range : ""}`}
            detail={deployMode.sub}
            col={deployMode.col}
            panelKey="capital" """,

    """            answer={`$${warChest.toLocaleString()} SAVED · MODE: ${deployMode.label}${deployMode.range ? " " + deployMode.range : ""}${blendedAll > 0 ? " · BASIS $" + blendedAll.toFixed(0) : ""}`}
            detail={blendedAll > 0 ? `${allShares.toFixed(0)} shares · avg $${blendedAll.toFixed(2)} · ${deployMode.sub}` : deployMode.sub}
            col={deployMode.col}
            panelKey="capital" """,

    "Update war chest scorecard to show blended basis when available"
)

# ─────────────────────────────────────────────────────────────────────────────
# Write + verify
# ─────────────────────────────────────────────────────────────────────────────
HTML.write_text(src, encoding="utf-8")
print("\nVerifying...")
txt = HTML.read_text(encoding="utf-8")

checks = [
    ("Position state in FutureTab",       "const [checks, setChecks]" in txt),
    ("allShares derived",                  "const allShares" in txt),
    ("blendedAll derived",                 "const blendedAll" in txt),
    ("posInputStyle defined",              "const posInputStyle" in txt),
    ("MY POSITION in DownsidePanel",       "MY AVGO POSITION — BEAR CASE IMPACT" in txt),
    ("Price zone in SignalPanel",          "PRICE ZONE" in txt),
    ("Existing position table in Capital", "EXISTING · PRE-THESIS" in txt),
    ("Thesis-driven adds table",           "THESIS-DRIVEN ADDS" in txt),
    ("Combined basis summary",             "COMBINED BASIS" in txt),
    ("Sizing check in Capital",            "SIZING CHECK — CAN YOU SIT THROUGH BEAR?" in txt),
    ("Thesis checks in Capital",           "THESIS CHECK — ALL MUST BE ✓ TO ADD" in txt),
    ("Chevron ④ renamed",                  "④ CAPITAL & POSITION" in txt),
    ("Scorecard shows basis",              'blendedAll > 0 ? " · BASIS $"' in txt),
    ("calcPct in DownsidePanel",           "calcPct" in txt),
    ("PositionTab still present",          "function PositionTab" in txt),
]
for name, ok in checks:
    print(f"  {'OK' if ok else 'MISS'}: {name}")

import re
start_ft  = txt.find("function FutureTab")
end_pt    = txt.find("\nfunction CurrentTab")
chunk     = txt[start_ft:end_pt]
all_open  = re.findall(r'<(div|span|button|input|table|thead|tbody|tr|th|td|strong|em)[\s>]', chunk)
all_close = re.findall(r'</(div|span|button|table|thead|tbody|tr|th|td|strong|em)>', chunk)
all_self  = re.findall(r'<(div|span|button|input)[ ][^>]*/>', chunk)
brace_bal = chunk.count("{") - chunk.count("}")
print(f"\n  FutureTab balance: tags={len(all_open)-len(all_close)-len(all_self)}  braces={brace_bal}")
print(f"  File: {len(txt):,} bytes")
