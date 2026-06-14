#!/usr/bin/env python3
"""
Migrate reverse DCF + full peer table into CurrentTab MOOD panel.
Enrich verdict and marketMood with DCF signal.
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
# 1. Add DCF state + derived values right after existing derived block ends
# ─────────────────────────────────────────────────────────────────────────────
r(
    """  const asymRatio = (bullHi - NOW_PRICE) / (NOW_PRICE - bearLo);
  const asymStatus = asymRatio >= 2
    ? { label: "FAVORABLE",   desc: `${asymRatio.toFixed(1)}× UP PER UNIT DOWN`, col: "#3fd07a" }
    : asymRatio >= 1
    ? { label: "BALANCED",    desc: `${asymRatio.toFixed(1)}× UP PER UNIT DOWN`, col: "#e0a83b" }
    : { label: "UNFAVORABLE", desc: `${asymRatio.toFixed(1)}× UP PER UNIT DOWN`, col: "#f1564b" };

  const overallVerdict = thesisStatus.label === "BROKEN"
    ? { label: "REDUCE / EXIT",      sub: "Kill-switch criteria met — act on signal",              col: "#f1564b" }
    : thesisStatus.label === "WATCH" && belowBase
    ? { label: "HOLD — WATCH CLOSELY", sub: "Signals mixed · price attractive · wait for clarity", col: "#e0a83b" }
    : belowBase
    ? { label: "CONSIDER ADDING",   sub: `Thesis ${thesisStatus.label.toLowerCase()} · price below base floor`, col: "#3fd07a" }
    : inBase
    ? { label: "HOLD AND MONITOR",  sub: `Thesis ${thesisStatus.label.toLowerCase()} · price fair`,             col: "#e0a83b" }
    : { label: "WAIT FOR PULLBACK", sub: `Thesis ${thesisStatus.label.toLowerCase()} · price stretched`,        col: "#f1564b" };""",
    """  const asymRatio = (bullHi - NOW_PRICE) / (NOW_PRICE - bearLo);
  const asymStatus = asymRatio >= 2
    ? { label: "FAVORABLE",   desc: `${asymRatio.toFixed(1)}× UP PER UNIT DOWN`, col: "#3fd07a" }
    : asymRatio >= 1
    ? { label: "BALANCED",    desc: `${asymRatio.toFixed(1)}× UP PER UNIT DOWN`, col: "#e0a83b" }
    : { label: "UNFAVORABLE", desc: `${asymRatio.toFixed(1)}× UP PER UNIT DOWN`, col: "#f1564b" };

  // ── Reverse DCF ─────────────────────────────────────────────────────────
  const [dr, setDr]         = useState(VAL_CONFIG.default_discount_pct);
  const [termPE, setTermPE] = useState(VAL_CONFIG.default_terminal_pe);
  const dcfN        = VAL_CONFIG.dcf_years;
  const impliedCAGR = (Math.pow(NOW_PRICE * Math.pow(1 + dr / 100, dcfN) / (v.ntm_eps * termPE), 1 / dcfN) - 1) * 100;
  const cagrRounded = impliedCAGR.toFixed(1);
  const cagrColor   = impliedCAGR > 25 ? "#f1564b" : impliedCAGR > 15 ? "#e0a83b" : "#3fd07a";
  const cagrNote    = impliedCAGR < 15
    ? "Low bar — not priced for perfection. Even moderate execution justifies the price."
    : impliedCAGR < 25
    ? "Moderate bar — requires solid execution on the AI revenue ramp."
    : "High bar — requires near-perfect execution on the $100B FY2027 target.";

  const overallVerdict = thesisStatus.label === "BROKEN"
    ? { label: "REDUCE / EXIT",       sub: "Kill-switch criteria met — act on signal",                                                                         col: "#f1564b" }
    : thesisStatus.label === "WATCH" && belowBase
    ? { label: "HOLD — WATCH CLOSELY", sub: `Signals mixed · price attractive · market requires only +${cagrRounded}% EPS CAGR — wait for Q3 clarity`,         col: "#e0a83b" }
    : belowBase
    ? { label: "CONSIDER ADDING",      sub: `Thesis ${thesisStatus.label.toLowerCase()} · below base floor · market requires only +${cagrRounded}% EPS CAGR`, col: "#3fd07a" }
    : inBase
    ? { label: "HOLD AND MONITOR",     sub: `Thesis ${thesisStatus.label.toLowerCase()} · price fair · market requires +${cagrRounded}% EPS CAGR`,            col: "#e0a83b" }
    : { label: "WAIT FOR PULLBACK",    sub: `Thesis ${thesisStatus.label.toLowerCase()} · price stretched · market pricing +${cagrRounded}% EPS CAGR`,        col: "#f1564b" };""",
    "Add DCF state + enrich overallVerdict"
)

# ─────────────────────────────────────────────────────────────────────────────
# 2. Enrich marketMood to carry DCF sub-label
# ─────────────────────────────────────────────────────────────────────────────
r(
    """  const marketMood = pePos > 0.67 ? { label: "ELEVATED OPTIMISM",  col: "#f1564b" }
    : pePos > 0.4   ? { label: "MODERATE OPTIMISM",  col: "#e0a83b" }
    :                 { label: "SKEPTICISM / FEAR",   col: "#3fd07a" };""",
    """  const marketMood = pePos > 0.67
    ? { label: "ELEVATED OPTIMISM", sub: `market pricing +${(Math.pow(NOW_PRICE * Math.pow(1 + VAL_CONFIG.default_discount_pct / 100, VAL_CONFIG.dcf_years) / (v.ntm_eps * VAL_CONFIG.default_terminal_pe), 1 / VAL_CONFIG.dcf_years) - 1) * 100 > 0 ? "+" : ""}X% EPS CAGR`, col: "#f1564b" }
    : pePos > 0.4
    ? { label: "MODERATE OPTIMISM", sub: `market pricing +${(Math.pow(NOW_PRICE * Math.pow(1 + VAL_CONFIG.default_discount_pct / 100, VAL_CONFIG.dcf_years) / (v.ntm_eps * VAL_CONFIG.default_terminal_pe), 1 / VAL_CONFIG.dcf_years) - 1) * 100 > 0 ? "+" : ""}X% EPS CAGR`, col: "#e0a83b" }
    : { label: "SKEPTICISM / FEAR",  sub: `market requires only moderate EPS growth`,                                                                                                                                                                                              col: "#3fd07a" };""",
    "Enrich marketMood with sub-label placeholder"
)

# Actually that's too complex inline — simpler: just reference impliedCAGR which is now in scope
# Let me redo marketMood properly after the DCF vars are defined
r(
    """  const marketMood = pePos > 0.67
    ? { label: "ELEVATED OPTIMISM", sub: `market pricing +${(Math.pow(NOW_PRICE * Math.pow(1 + VAL_CONFIG.default_discount_pct / 100, VAL_CONFIG.dcf_years) / (v.ntm_eps * VAL_CONFIG.default_terminal_pe), 1 / VAL_CONFIG.dcf_years) - 1) * 100 > 0 ? "+" : ""}X% EPS CAGR`, col: "#f1564b" }
    : pePos > 0.4
    ? { label: "MODERATE OPTIMISM", sub: `market pricing +${(Math.pow(NOW_PRICE * Math.pow(1 + VAL_CONFIG.default_discount_pct / 100, VAL_CONFIG.dcf_years) / (v.ntm_eps * VAL_CONFIG.default_terminal_pe), 1 / VAL_CONFIG.dcf_years) - 1) * 100 > 0 ? "+" : ""}X% EPS CAGR`, col: "#e0a83b" }
    : { label: "SKEPTICISM / FEAR",  sub: `market requires only moderate EPS growth`,                                                                                                                                                                                              col: "#3fd07a" };""",
    """  // marketMood defined after DCF vars (impliedCAGR is in scope)""",
    "Remove inline complex marketMood — replace with simple reference"
)

# Move marketMood definition to AFTER the DCF block (it's already after in the file order since
# DCF vars come before it in the new layout). Actually, impliedCAGR IS defined before marketMood
# now since we injected DCF vars before overallVerdict, and marketMood is defined even before that.
# Need to reorder — move marketMood below DCF. Let's just patch the existing marketMood line.

# Find and fix the placeholder comment
r(
    """  // marketMood defined after DCF vars (impliedCAGR is in scope)""",
    """  const marketMood = pePos > 0.67
    ? { label: "ELEVATED OPTIMISM", sub: `market pricing +${cagrRounded}% EPS CAGR (high bar)`,     col: "#f1564b" }
    : pePos > 0.4
    ? { label: "MODERATE OPTIMISM", sub: `market requires +${cagrRounded}% EPS CAGR`,               col: "#e0a83b" }
    : { label: "SKEPTICISM / FEAR",  sub: `market requires only +${cagrRounded}% EPS CAGR (low bar)`, col: "#3fd07a" };""",
    "Restore clean marketMood with cagrRounded"
)

# ─────────────────────────────────────────────────────────────────────────────
# 3. Update MOOD ScoreCard detail to include DCF CAGR
# ─────────────────────────────────────────────────────────────────────────────
r(
    """            detail={`P/E ${currentPE}× · normal ${v.pe_normal_lo}–${v.pe_normal_hi}× · FCF yield ${fcfYield}%`}
            col={marketMood.col} panelKey="mood"
            tipTitle="What is the market assuming?"
            tipBody={`P/E of ${currentPE}× implies the market expects ${marketMood.label.toLowerCase()}. Normal AVGO range: ${v.pe_normal_lo}–${v.pe_normal_hi}×. Below normal = fear or skepticism (often a better entry). Above normal = optimism baked in. FCF yield ${fcfYield}% vs 10Y Treasury ${v.risk_free_pct}% — a positive spread means equities still offer a risk premium.`} />""",
    """            detail={`P/E ${currentPE}× · requires +${cagrRounded}% EPS CAGR · FCF yield ${fcfYield}%`}
            col={marketMood.col} panelKey="mood"
            tipTitle="What is the market assuming?"
            tipBody={`At ${currentPE}× NTM P/E, the market requires a +${cagrRounded}% EPS CAGR over ${dcfN} years just to justify today's price (at ${dr}% discount rate, ${termPE}× terminal P/E). ${cagrNote} FCF yield ${fcfYield}% vs 10Y Treasury ${v.risk_free_pct}% — positive spread means equities still offer a risk premium above risk-free.`} />""",
    "MOOD ScoreCard detail includes DCF CAGR"
)

# ─────────────────────────────────────────────────────────────────────────────
# 4. Replace MOOD panel content with enriched version
# ─────────────────────────────────────────────────────────────────────────────
OLD_MOOD = """        {/* ─ ③ MOOD ──────────────────────────────────────────────────── */}
        {panel === "mood" && (
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em",
              color: "var(--tx5)", marginBottom: 18, paddingBottom: 8, borderBottom: "1px solid var(--bd)" }}>
              WHAT IS THE MARKET CURRENTLY ASSUMING?
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "10px 14px",
              background: marketMood.col + "12", border: `1px solid ${marketMood.col}44`,
              borderLeft: `3px solid ${marketMood.col}`, borderRadius: 7, marginBottom: 18 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", color: marketMood.col, marginBottom: 3 }}>
                  {marketMood.label}
                </div>
                <div style={{ fontSize: 9.5, color: "var(--tx5)", marginBottom: 3 }}>
                  P/E {currentPE}× · normal {v.pe_normal_lo}–{v.pe_normal_hi}× · trough {v.pe_trough}× · peak {v.pe_peak}×
                </div>
                <div style={{ fontSize: 11, color: "var(--tx3)", lineHeight: 1.6 }}>
                  At {currentPE}× forward P/E, the market is pricing in the FY2026 $56B AI guide but has not fully priced the $100B FY2027 target. FCF yield of {fcfYield}% suggests moderate — not excessive — optimism.
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div style={{ background: "var(--inner-bg)", border: "1px solid var(--bd)", borderRadius: 8, padding: "14px 16px" }}>
                <div style={{ fontSize: 8.5, letterSpacing: "0.14em", color: "var(--tx6)", marginBottom: 10 }}>PRICE-IMPLIED AI REVENUE</div>
                <div style={{ fontSize: 10.5, color: "var(--tx3)", lineHeight: 1.7, marginBottom: 12 }}>
                  At ${NOW_PRICE}, the market is baking in roughly <span style={{ color: "var(--blue-soft)", fontWeight: 700 }}>$55–65B</span> of FY2026 AI revenue — near management's $56B reaffirmed guide.
                  The <span style={{ color: "#3fd07a" }}>$100B FY2027</span> target is not yet fully priced in. A beat + raised guide unlocks that upside.
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9.5 }}>
                  <span style={{ color: "var(--tx5)" }}>Management FY27 target</span>
                  <span style={{ color: "#3fd07a", fontWeight: 700 }}>${v.ai_rev_fy27_target_b}B</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9.5, marginTop: 4 }}>
                  <span style={{ color: "var(--tx5)" }}>Implied by current price</span>
                  <span style={{ color: "var(--blue-soft)", fontWeight: 700 }}>~$55–65B FY26</span>
                </div>
              </div>

              <div style={{ background: "var(--inner-bg)", border: "1px solid var(--bd)", borderRadius: 8, padding: "14px 16px" }}>
                <div style={{ fontSize: 8.5, letterSpacing: "0.14em", color: "var(--tx6)", marginBottom: 10 }}>FCF YIELD — AM I BEING PAID FAIRLY?</div>
                <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 4,
                  color: parseFloat(fcfYield) > 3.5 ? "#3fd07a" : parseFloat(fcfYield) > 2.5 ? "#e0a83b" : "#f1564b" }}>
                  {fcfYield}%
                </div>
                <div style={{ fontSize: 9.5, color: "var(--tx5)", marginBottom: 10 }}>
                  ${v.fcf_ntm_b}B NTM FCF ÷ ${(NOW_PRICE * v.shares_b).toFixed(0)}B market cap
                </div>
                <div style={{ fontSize: 10.5, color: "var(--tx3)", lineHeight: 1.65 }}>
                  {parseFloat(fcfYield) > 3.5
                    ? "Above 3.5% — reasonable compensation. Market not pricing in runaway growth."
                    : parseFloat(fcfYield) > 2.5
                    ? "2.5–3.5% range — fair but not cheap. Growth story needs to play out."
                    : "Below 2.5% — expensive on cash flow. Growth premium fully baked in."}
                </div>
              </div>
            </div>

            {/* Peer comp */}
            <div style={{ background: "var(--inner-bg)", border: "1px solid var(--bd)", borderRadius: 8, padding: "14px 16px" }}>
              <div style={{ fontSize: 8.5, letterSpacing: "0.14em", color: "var(--tx6)", marginBottom: 12 }}>PEER CONTEXT — ARE YOU PAYING MORE OR LESS?</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                {v.peers.map(p => (
                  <div key={p.t} style={{ padding: "10px 12px",
                    background: p.t === "AVGO" ? "var(--panel-bg)" : "var(--tiny-bg)",
                    border: `1px solid ${p.t === "AVGO" ? "var(--blue-soft)" : "var(--bd)"}`, borderRadius: 6 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 6,
                      color: p.t === "AVGO" ? "var(--blue-soft)" : "var(--tx3)" }}>{p.t}</div>
                    <div style={{ fontSize: 9, color: "var(--tx5)", marginBottom: 2 }}>Fwd P/E <span style={{ color: "var(--tx2)", fontWeight: 600 }}>{p.fpe}×</span></div>
                    <div style={{ fontSize: 9, color: "var(--tx5)", marginBottom: 2 }}>EV/EBITDA <span style={{ color: "var(--tx2)", fontWeight: 600 }}>{p.ev_eb}×</span></div>
                    <div style={{ fontSize: 9, color: "var(--tx5)", marginBottom: 6 }}>FCF Yield <span style={{ color: "var(--tx2)", fontWeight: 600 }}>{p.fcf_y}%</span></div>
                    <div style={{ fontSize: 8, color: "var(--tx7)", lineHeight: 1.4 }}>{p.note}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}"""

NEW_MOOD = """        {/* ─ ③ MOOD ──────────────────────────────────────────────────── */}
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
                  At {currentPE}× forward P/E, the market is pricing in the FY2026 $56B AI guide but has not fully priced the $100B FY2027 target.
                  The reverse DCF says the crowd is only requiring <span style={{ color: cagrColor, fontWeight: 700 }}>+{cagrRounded}% EPS CAGR</span> to justify today's price. {cagrNote}
                </div>
              </div>
            </div>

            {/* Reverse DCF */}
            <div {...tip("Reverse DCF — what is the market pricing in?", `Works backwards from today's price: given a discount rate and terminal multiple, what annual EPS growth rate must the market be embedding? At $${NOW_PRICE}, the required CAGR is +${cagrRounded}%. ${cagrNote} Adjust sliders to stress-test assumptions.`, "Low required CAGR = not priced for perfection. High = very little room for error.", cagrColor)}
              style={{ padding: "14px 16px", background: "var(--inner-bg)", border: `1px solid ${cagrColor}44`, borderRadius: 8, marginBottom: 14 }}>
              <div style={{ fontSize: 8.5, letterSpacing: "0.14em", color: "var(--tx6)", marginBottom: 12 }}>REVERSE DCF · IMPLIED EPS CAGR</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                {[
                  { label: "DISCOUNT RATE", val: dr, set: setDr, min: 6, max: 14, step: 0.5, fmt: v => `${v.toFixed(1)}%` },
                  { label: `TERMINAL P/E (${dcfN}YR)`, val: termPE, set: setTermPE, min: 15, max: 35, step: 1, fmt: v => `${v}×` },
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
                  +{cagrRounded}% EPS CAGR
                </div>
                <div style={{ fontSize: 9.5, color: "var(--tx7)", margin: "4px 0 8px" }}>over {dcfN}yr · NTM EPS $${v.ntm_eps} · ${dcfN}yr terminal {termPE}× · discount {dr}%</div>
                <div style={{ fontSize: 10.5, color: "var(--tx3)", lineHeight: 1.55 }}>{cagrNote}</div>
              </div>
            </div>

            {/* 2-col: AI revenue implied + FCF yield */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div {...tip("Price-implied AI revenue", `At $${NOW_PRICE}, the market is baking in roughly $55–65B of FY2026 AI revenue — near management's $56B reaffirmed guide. The $100B FY2027 target is not yet fully priced in. A beat + raised guide unlocks the remaining upside.`, null, "var(--blue-soft)")}
                style={{ background: "var(--inner-bg)", border: "1px solid var(--bd)", borderRadius: 8, padding: "14px 16px" }}>
                <div style={{ fontSize: 8.5, letterSpacing: "0.14em", color: "var(--tx6)", marginBottom: 10 }}>PRICE-IMPLIED AI REVENUE</div>
                <div style={{ fontSize: 10.5, color: "var(--tx3)", lineHeight: 1.7, marginBottom: 12 }}>
                  At ${NOW_PRICE}, the market is baking in roughly <span style={{ color: "var(--blue-soft)", fontWeight: 700 }}>$55–65B</span> of FY2026 AI revenue — near management's $56B guide.
                  The <span style={{ color: "#3fd07a" }}>$100B FY2027</span> target is <em>not</em> fully priced in yet.
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9.5, marginBottom: 3 }}>
                  <span style={{ color: "var(--tx5)" }}>Management FY27 target</span>
                  <span style={{ color: "#3fd07a", fontWeight: 700 }}>${v.ai_rev_fy27_target_b}B</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9.5 }}>
                  <span style={{ color: "var(--tx5)" }}>Implied by current price</span>
                  <span style={{ color: "var(--blue-soft)", fontWeight: 700 }}>~$55–65B FY26</span>
                </div>
              </div>

              <div {...tip("FCF Yield vs risk-free", `FCF yield = NTM FCF ÷ market cap. At ${fcfYield}%, AVGO's cash yield is ${(parseFloat(fcfYield) - v.risk_free_pct).toFixed(2)}% above the 10Y Treasury (${v.risk_free_pct}%). Positive spread = some compensation above risk-free. Below Treasury = paying purely for growth.`, null, parseFloat(fcfYield) > 3.5 ? "#3fd07a" : parseFloat(fcfYield) > 2.5 ? "#e0a83b" : "#f1564b")}
                style={{ background: "var(--inner-bg)", border: "1px solid var(--bd)", borderRadius: 8, padding: "14px 16px" }}>
                <div style={{ fontSize: 8.5, letterSpacing: "0.14em", color: "var(--tx6)", marginBottom: 10 }}>FCF YIELD — AM I BEING PAID FAIRLY?</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 6 }}>
                  <div style={{ fontSize: 28, fontWeight: 700,
                    color: parseFloat(fcfYield) > 3.5 ? "#3fd07a" : parseFloat(fcfYield) > 2.5 ? "#e0a83b" : "#f1564b" }}>
                    {fcfYield}%
                  </div>
                  <div style={{ fontSize: 9.5, color: "var(--tx6)" }}>
                    vs Treasury {v.risk_free_pct}% &nbsp;
                    <span style={{ color: parseFloat(fcfYield) > v.risk_free_pct ? "#3fd07a" : "#f1564b", fontWeight: 700 }}>
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
                    const isAvgo = p.t === "AVGO";
                    const col = isAvgo ? "var(--blue-soft)" : "var(--tx5)";
                    return (
                      <tr key={p.t} {...tip(p.t, `${p.note}. FWD P/E: ${p.fpe}× · EV/EBITDA: ${p.ev_eb}× · FCF yield: ${p.fcf_y}%`, isAvgo ? "Your holding" : null, col)}
                        style={{ borderBottom: "1px solid var(--bd)", background: isAvgo ? "var(--row-hl)" : "transparent",
                          transition: "background .1s" }}>
                        <td style={{ padding: "7px 8px", color: isAvgo ? "var(--title)" : "var(--tx4)", fontWeight: isAvgo ? 700 : 400 }}>{p.t}</td>
                        <td style={{ padding: "7px 8px", textAlign: "right", color: col, fontWeight: isAvgo ? 700 : 400 }}>{p.fpe}×</td>
                        <td style={{ padding: "7px 8px", textAlign: "right", color: col, fontWeight: isAvgo ? 700 : 400 }}>{p.ev_eb}×</td>
                        <td style={{ padding: "7px 8px", textAlign: "right", color: col, fontWeight: isAvgo ? 700 : 400 }}>{p.fcf_y}%</td>
                        <td style={{ padding: "7px 8px", color: "var(--tx7)", fontSize: 9.5 }}>{p.note}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div style={{ marginTop: 10, fontSize: 10.5, color: "var(--tx4)", lineHeight: 1.55 }}>
                At {(NOW_PRICE / v.ntm_eps).toFixed(1)}× NTM P/E, AVGO trades in line with MSFT despite growing AI revenue faster.
                NVDA commands a large premium for GPU monopoly; MRVL is priced for execution it has not yet proven.
              </div>
            </div>
          </div>
        )}"""

r(OLD_MOOD, NEW_MOOD, "Replace MOOD panel with enriched version (DCF + full peer table)")

# ─────────────────────────────────────────────────────────────────────────────
# Write and verify
# ─────────────────────────────────────────────────────────────────────────────
HTML.write_text(src, encoding="utf-8")
print("\nVerifying...")

import re
txt = HTML.read_text(encoding="utf-8")

# Balance check on CurrentTab
start = txt.find("function CurrentTab()")
end   = txt.find("\nfunction PastTab")
chunk = txt[start:end]
all_open  = re.findall(r'<(div|span|button|strong|table|thead|tbody|tr|th|td)[\s>]', chunk)
all_close = re.findall(r'</(div|span|button|strong|table|thead|tbody|tr|th|td)>', chunk)
all_self  = re.findall(r'<(div|span|button|strong)\b[^>]*/>', chunk)
bal = len(all_open) - len(all_close) - len(all_self)
brace_bal = chunk.count("{") - chunk.count("}")
print(f"  CurrentTab balance: div={bal}  braces={brace_bal}")

checks = [
    ("DCF state in CurrentTab",       "const [dr, setDr]" in txt),
    ("impliedCAGR computed",           "const impliedCAGR" in txt),
    ("cagrRounded in overallVerdict",  "cagrRounded}% EPS CAGR" in txt),
    ("marketMood sub field",           "marketMood.sub" in txt),
    ("Reverse DCF slider in MOOD",     "REVERSE DCF · IMPLIED EPS CAGR" in txt),
    ("Full peer table in MOOD",        "PEER COMPS — FORWARD MULTIPLES" in txt),
    ("FCF spread in MOOD",             "vs Treasury" in txt),
    ("Banner shows cagrRounded",       "cagrColor, fontWeight: 700 }}>+{cagrRounded}" in txt),
]
for name, ok in checks:
    print(f"  {'OK' if ok else 'MISS'}: {name}")
