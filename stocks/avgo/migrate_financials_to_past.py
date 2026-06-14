#!/usr/bin/env python3
"""
Migrate FinancialsTab into PastTab as ⑤ EXPLORER chevron panel.
  1. Lift fin state into PastTab
  2. Add ⑤ EXPLORER to PANELS array
  3. Add explorer panel content after ④ MOOD HISTORY
  4. Delete FinancialsTab function + nav entry + render call
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
# 1. Lift fin state into PastTab (before derived verdicts)
# ─────────────────────────────────────────────────────────────────────────────
r(
    """  // ── Derived verdicts ──────────────────────────────────────────────────────
  const revCAGR    = Math.pow(PAST_REV[9] / PAST_REV[0], 1 / 9) - 1;""",

    """  // ── Explorer (Financials) state ──────────────────────────────────────────
  const finSaved  = loadFinState();
  const [period,  setPeriod]  = useState(finSaved?.period  || "quarterly");
  const [pinned,  setPinned]  = useState(finSaved?.pinned  || ["Revenue", "Free Cash Flow", "EBITDA Margin"]);
  const [finQuery, setFinQuery] = useState("");
  const [finOpen,  setFinOpen]  = useState(false);

  useEffect(() => {
    localStorage.setItem(FIN_STORE_KEY, JSON.stringify({ version: 1, period, pinned }));
  }, [period, pinned]);

  const unpinned   = FIN_METRICS.filter(m => !pinned.includes(m.name));
  const suggestions = finQuery
    ? unpinned.filter(m => m.name.toLowerCase().includes(finQuery.toLowerCase()) ||
        m.group.toLowerCase().includes(finQuery.toLowerCase())).slice(0, 12)
    : unpinned;
  const FIN_GROUPS = [...new Set(FIN_METRICS.map(m => m.group))];
  const grouped    = FIN_GROUPS.map(g => ({ group: g, items: suggestions.filter(m => m.group === g) })).filter(g => g.items.length > 0);
  const addMetric    = name => { setPinned(p => [...p, name]); setFinQuery(""); setFinOpen(false); };
  const removeMetric = name => setPinned(p => p.filter(x => x !== name));

  // ── Derived verdicts ──────────────────────────────────────────────────────
  const revCAGR    = Math.pow(PAST_REV[9] / PAST_REV[0], 1 / 9) - 1;""",

    "Lift fin state into PastTab"
)

# ─────────────────────────────────────────────────────────────────────────────
# 2. Add ⑤ EXPLORER to PANELS array
# ─────────────────────────────────────────────────────────────────────────────
r(
    """    { key: "mood",       label: "④ MOOD HISTORY",   sub: "price · multiple · cycle",  tipBody: "10-year monthly price, drawdown from rolling ATH, and EV/EBITDA multiple history. When has the market been too fearful or too greedy — and what happened next?" },
  ];""",

    """    { key: "mood",       label: "④ MOOD HISTORY",   sub: "price · multiple · cycle",  tipBody: "10-year monthly price, drawdown from rolling ATH, and EV/EBITDA multiple history. When has the market been too fearful or too greedy — and what happened next?" },
    { key: "explorer",   label: "⑤ EXPLORER",       sub: "search · pin · dig deeper", tipBody: "Raw financials explorer — 35 metrics across 7 groups (Income Statement, Margins, Cash Flow, Balance Sheet, Valuation, Returns, Leverage). Pin any metric to see a 10-year annual or 20-quarter chart with YoY badges. Source: Wisesheets Q2 FY2026." },
  ];""",

    "Add ⑤ EXPLORER to PANELS array"
)

# ─────────────────────────────────────────────────────────────────────────────
# 3. Add explorer panel after ④ MOOD HISTORY close
# ─────────────────────────────────────────────────────────────────────────────
r(
    """        {/* ─ ④ MOOD HISTORY ─ */}
        {panel === "mood" && (""",

    """        {/* ─ ⑤ EXPLORER ─ */}
        {panel === "explorer" && (
          <div>
            {/* Header row */}
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em",
                color: "var(--tx5)", paddingBottom: 0, flex: 1 }}>
                DIG DEEPER · 35 METRICS · SOURCE: WISE Q2 FY2026
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                {["annual", "quarterly"].map(p => (
                  <button key={p} onClick={() => setPeriod(p)} style={{
                    background: period === p ? "var(--blue-soft)" : "transparent",
                    color: period === p ? "var(--page-bg)" : "var(--tx4)",
                    border: `1px solid ${period === p ? "var(--blue-soft)" : "var(--bd)"}`,
                    borderRadius: 4, padding: "3px 14px", cursor: "pointer",
                    fontFamily: FONT_MONO, fontSize: 10, letterSpacing: "0.1em", fontWeight: 700,
                    textTransform: "uppercase", transition: "all .15s"
                  }}>{p}</button>
                ))}
              </div>
            </div>

            {/* Search */}
            <div style={{ position: "relative", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center",
                border: `1px solid ${finOpen ? "var(--blue-soft)" : "var(--bd)"}`,
                borderRadius: finOpen && suggestions.length > 0 ? "6px 6px 0 0" : 6,
                overflow: "hidden", background: "var(--inner-bg)",
                boxShadow: finOpen ? "0 0 0 2px rgba(12,159,206,0.12)" : "none",
                transition: "box-shadow .15s" }}>
                <span style={{ padding: "0 10px", color: "var(--tx5)", fontSize: 14 }}>⌕</span>
                <input value={finQuery}
                  onChange={e => { setFinQuery(e.target.value); setFinOpen(true); }}
                  onFocus={() => setFinOpen(true)}
                  onBlur={() => setTimeout(() => setFinOpen(false), 160)}
                  placeholder="add a metric — revenue, free cash flow, EV/EBITDA, ROIC…"
                  style={{ flex: 1, background: "transparent", border: "none", outline: "none",
                    color: "var(--tx1)", fontFamily: FONT_MONO, fontSize: 11.5,
                    padding: "9px 4px", letterSpacing: "0.03em" }}
                />
                {finQuery && (
                  <button onClick={() => { setFinQuery(""); setFinOpen(false); }}
                    style={{ background: "transparent", border: "none", color: "var(--tx5)",
                      cursor: "pointer", padding: "0 12px", fontSize: 16, fontFamily: FONT_MONO }}>×</button>
                )}
              </div>
              {/* Dropdown */}
              {finOpen && suggestions.length > 0 && (
                <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 200,
                  background: "var(--panel-bg)", border: "1px solid var(--bd2)",
                  borderTop: "none", borderRadius: "0 0 6px 6px",
                  boxShadow: "0 8px 28px rgba(0,0,0,0.18)",
                  maxHeight: 340, overflowY: "auto" }}>
                  {!finQuery
                    ? grouped.map((g, gi) => (
                      <div key={g.group}>
                        <div style={{ padding: "7px 14px 4px", fontSize: 8.5, fontWeight: 700,
                          letterSpacing: "0.14em", color: "var(--tx6)",
                          borderTop: gi > 0 ? "1px solid var(--bd)" : "none",
                          background: "var(--inner-bg)", position: "sticky", top: 0 }}>
                          {g.group.toUpperCase()}
                        </div>
                        {g.items.map(m => (
                          <div key={m.name} onMouseDown={() => addMetric(m.name)}
                            style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                              padding: "8px 14px 8px 20px", cursor: "pointer",
                              borderBottom: "1px solid var(--bd)", background: "transparent", transition: "background .1s" }}
                            onMouseEnter={e => e.currentTarget.style.background = "var(--inner-bg)"}
                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ fontSize: 11.5, color: "var(--tx1)", fontWeight: 600 }}>{m.name}</span>
                              <span style={{ fontSize: 9.5, color: "var(--tx5)" }}>{m.desc}</span>
                            </div>
                            <span style={{ fontSize: 9, color: "var(--blue-soft)", flexShrink: 0, marginLeft: 10 }}>+ pin</span>
                          </div>
                        ))}
                      </div>
                    ))
                    : suggestions.map((m, idx) => (
                      <div key={m.name} onMouseDown={() => addMetric(m.name)}
                        style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                          padding: "9px 14px", cursor: "pointer",
                          borderBottom: idx < suggestions.length - 1 ? "1px solid var(--bd)" : "none",
                          background: "transparent", transition: "background .1s" }}
                        onMouseEnter={e => e.currentTarget.style.background = "var(--inner-bg)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 12, color: "var(--tx1)", fontWeight: 600 }}>{m.name}</span>
                          <span style={{ fontSize: 9.5, color: "var(--tx5)" }}>{m.desc}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                          <span style={{ fontSize: 8.5, color: "var(--tx6)", border: "1px solid var(--bd2)",
                            borderRadius: 3, padding: "2px 6px", whiteSpace: "nowrap" }}>{m.group}</span>
                          <span style={{ fontSize: 9, color: "var(--blue-soft)" }}>+ pin</span>
                        </div>
                      </div>
                    ))
                  }
                </div>
              )}
            </div>

            {/* Quick-add pills */}
            {pinned.length < FIN_METRICS.length && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                <span style={{ fontSize: 9, color: "var(--tx6)", letterSpacing: "0.1em", alignSelf: "center", marginRight: 2 }}>QUICK ADD ›</span>
                {FIN_METRICS.filter(m => !pinned.includes(m.name)).slice(0, 10).map(m => (
                  <button key={m.name} onClick={() => addMetric(m.name)}
                    style={{ background: "transparent", border: "1px solid var(--bd)", borderRadius: 4,
                      padding: "3px 10px", cursor: "pointer", fontFamily: FONT_MONO,
                      fontSize: 9.5, color: "var(--tx4)", letterSpacing: "0.06em", transition: "all .15s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--blue-soft)"; e.currentTarget.style.color = "var(--blue-soft)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--bd)"; e.currentTarget.style.color = "var(--tx4)"; }}>
                    {m.name}
                  </button>
                ))}
              </div>
            )}

            {/* Pinned metric cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {pinned.length === 0 && (
                <div style={{ textAlign: "center", padding: "48px 20px", color: "var(--tx6)", fontSize: 11, lineHeight: 1.8 }}>
                  Search for a metric above or use quick-add pills<br/>
                  <span style={{ color: "var(--tx8)" }}>Revenue · Free Cash Flow · EBITDA Margin · ROIC · …</span>
                </div>
              )}
              {pinned.map(name => {
                const m = FIN_METRICS.find(x => x.name === name);
                if (!m) return null;
                return <MetricCard key={name + period} metric={m} period={period} onRemove={() => removeMetric(name)} />;
              })}
            </div>
          </div>
        )}

        {/* ─ ④ MOOD HISTORY ─ */}
        {panel === "mood" && (""",

    "Add ⑤ EXPLORER panel to PastTab"
)

# ─────────────────────────────────────────────────────────────────────────────
# 4. Delete FinancialsTab function, nav entry, render call
# ─────────────────────────────────────────────────────────────────────────────
lines = src.split("\n")

# Find and remove FinancialsTab function (lines 4511–4672, now shifted)
for i, l in enumerate(lines):
    if "function FinancialsTab()" in l:
        fs = i; break
depth = 0
fe = fs
for i, l in enumerate(lines[fs:], start=fs):
    depth += l.count("{") - l.count("}")
    if depth == 0 and i > fs:
        fe = i; break

print(f"  Removing FinancialsTab lines {fs+1}–{fe+1}")
del lines[fs:fe+1]
# Remove blank line before it if present
if lines[fs-1].strip() == "":
    del lines[fs-1]

src = "\n".join(lines)

# Nav entry
src = src.replace(
    '    { id: "financials", label: "FINANCIALS", sub: "search · explore · pin" },\n', "", 1)

# Render call
src = src.replace(
    '        {activeTab === "financials" && <FinancialsTab />}\n', "", 1)

HTML.write_text(src, encoding="utf-8")
print("  OK:   Delete FinancialsTab + nav + render")

# ─────────────────────────────────────────────────────────────────────────────
# Verify
# ─────────────────────────────────────────────────────────────────────────────
import re
print("\nVerifying...")
txt = HTML.read_text(encoding="utf-8")

checks = [
    ("FinancialsTab function gone",   "function FinancialsTab" not in txt),
    ("Nav entry gone",                '"financials"' not in txt),
    ("Render call gone",              "<FinancialsTab />" not in txt),
    ("⑤ EXPLORER in PANELS",          "⑤ EXPLORER" in txt),
    ("Explorer panel renders",         'panel === "explorer"' in txt),
    ("Fin state in PastTab",           "const finSaved" in txt),
    ("addMetric in PastTab",           "const addMetric" in txt),
    ("MetricCard still present",       "function MetricCard" in txt),
    ("FIN_STORE_KEY still present",    "FIN_STORE_KEY" in txt),
    ("loadFinState still present",     "function loadFinState" in txt),
    ("generateInsight still present",  "function generateInsight" in txt),
    ("FutureTab still present",        "function FutureTab" in txt),
    ("CurrentTab still present",       "function CurrentTab" in txt),
    ("PastTab still present",          "function PastTab" in txt),
    ("Only POSITION · FINANCIALS gone","FINANCIALS" not in txt or txt.count("FINANCIALS") <= 2),
]
for name, ok in checks:
    print(f"  {'OK' if ok else 'MISS'}: {name}")

start_pt = txt.find("function PastTab")
end_pt   = txt.find("\nfunction FinancialsTab") if "function FinancialsTab" in txt else txt.find("\nfunction FutureTab")
if end_pt < start_pt:
    end_pt = txt.find("\n// ── Financials Tab")
chunk    = txt[start_pt:end_pt]
all_open  = re.findall(r'<(div|span|button|input|table|thead|tbody|tr|th|td|strong|em|svg|line|rect|text|g)[\s>]', chunk)
all_close = re.findall(r'</(div|span|button|table|thead|tbody|tr|th|td|strong|em|svg|g)>', chunk)
all_self  = re.findall(r'<(div|span|button|input|line|rect)\s[^>]*/>', chunk)
brace_bal = chunk.count("{") - chunk.count("}")
print(f"\n  PastTab balance: tags={len(all_open)-len(all_close)-len(all_self)}  braces={brace_bal}")
print(f"  File: {len(txt):,} bytes · {txt.count(chr(10)):,} lines")
