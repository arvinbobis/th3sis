#!/usr/bin/env python3
"""
Extract 29 missing metrics from avgo-wise-q2fy26.xlsx and inject into FIN_METRICS.
Annual:    FY16–FY25 (10 years, Oct fiscal year)
Quarterly: Q3 FY21–Q2 FY26 (20 quarters)
"""
import json, re
from pathlib import Path
import openpyxl

XLSX = Path(__file__).parent / "wise" / "avgo-wise-q2fy26.xlsx"
HTML = Path(__file__).parent / "avgo-thesis.html"

wb = openpyxl.load_workbook(XLSX, data_only=True)

# ── Helper: read a sheet into {row_label: [values...]} ──────────────────────
def read_sheet(name):
    ws = wb[name]
    rows = list(ws.iter_rows(values_only=True))
    # Row 4 (index 3) = period labels, row 5+ = data
    period_row = rows[3]   # ('Period', 'Q2', 'Q1', ...)
    data = {}
    for row in rows[4:]:
        label = row[0]
        if not label or not str(label).strip():
            continue
        label = str(label).strip()
        data[label] = list(row[1:])
    return period_row[1:], data

# ── Read all sheets ──────────────────────────────────────────────────────────
fy_periods,  fy_is  = read_sheet("AVGO - Income Statement FY")
fy_periods,  fy_bs  = read_sheet("AVGO - Balance Sheet FY")
fy_periods,  fy_cf  = read_sheet("AVGO - Cash Flow FY")
fy_periods,  fy_km  = read_sheet("AVGO - Key Metrics FY")
fy_periods,  fy_gr  = read_sheet("AVGO - Financial Growth FY")
q_periods,   q_is   = read_sheet("AVGO - Income Statement Q")
q_periods,   q_bs   = read_sheet("AVGO - Balance Sheet Q")
q_periods,   q_cf   = read_sheet("AVGO - Cash Flow Q")
q_periods,   q_km   = read_sheet("AVGO - Key Metrics Q")
q_periods,   q_gr   = read_sheet("AVGO - Financial Growth Q")

# ── Map annual: FY16–FY25 ────────────────────────────────────────────────────
# xlsx FY sheet: cols left to right = most recent → oldest
# Period row for FY: ('FY25','FY24','FY23','FY22','FY21','FY20','FY19','FY18','FY17','FY16',...)
def get_annual(sheet_dict, row_label, scale=1, decimals=2):
    """Return 10 values [FY16..FY25] from a FY sheet row."""
    vals = sheet_dict.get(row_label, [None]*20)
    # xlsx cols: index 0 = FY25, index 1 = FY24, ..., index 9 = FY16
    # We want FY16=index9, FY17=index8, ..., FY25=index0
    sliced = vals[:10]   # first 10 cols cover FY25..FY16
    ordered = list(reversed(sliced))  # now FY16..FY25
    result = []
    for v in ordered:
        if v is None:
            result.append(None)
        else:
            try:
                result.append(round(float(v) * scale, decimals))
            except:
                result.append(None)
    return result

# ── Map quarterly: Q3FY21–Q2FY26 (20 quarters) ───────────────────────────────
# xlsx Q sheet: cols left to right = most recent → oldest
# AVGO FY ends Oct. Quarters: Q1=Feb-Apr, Q2=May-Jul, Q3=Aug-Oct, Q4=Nov-Jan
# We need: Q3FY21, Q4FY21, Q1FY22, Q2FY22, Q3FY22, Q4FY22,
#           Q1FY23, Q2FY23, Q3FY23, Q4FY23, Q1FY24, Q2FY24,
#           Q3FY24, Q4FY24, Q1FY25, Q2FY25, Q3FY25, Q4FY25, Q1FY26, Q2FY26
# In xlsx the period row is the FY period label (Q2, Q1, Q4, Q3, ...) combined with the year
# from the Date row. Let me use the Date row to identify which quarter is which.

def get_quarterly(sheet_dict, row_label, scale=1, decimals=2):
    """Return 20 values [Q3FY21..Q2FY26] from a Q sheet row."""
    vals = sheet_dict.get(row_label, [None]*75)
    # The Q periods in xlsx (left=newest): Q2FY26, Q1FY26, Q4FY25, Q3FY25, Q2FY25, Q1FY25,
    # Q4FY24, Q3FY24, Q2FY24, Q1FY24, Q4FY23, Q3FY23, Q2FY23, Q1FY23,
    # Q4FY22, Q3FY22, Q2FY22, Q1FY22, Q4FY21, Q3FY21, ...
    # We want indices 0..19 reversed → indices [19,18,17,...,0] = Q3FY21..Q2FY26
    sliced = vals[:20]
    ordered = list(reversed(sliced))
    result = []
    for v in ordered:
        if v is None:
            result.append(None)
        else:
            try:
                result.append(round(float(v) * scale, decimals))
            except:
                result.append(None)
    return result

def pct(val):
    """Round to 1 decimal for percentage."""
    return None if val is None else round(val, 1)

def b(val):
    """Round to 2 decimal for billions."""
    return None if val is None else round(val, 2)

# ── Verify against known Revenue values ──────────────────────────────────────
rev_a = get_annual(fy_is, "Revenue", scale=1e-9, decimals=2)
rev_q = get_quarterly(q_is, "Revenue", scale=1e-9, decimals=2)
print("Revenue annual (FY16–FY25):", rev_a)
print("Revenue quarterly (Q3FY21–Q2FY26):", rev_q)

# Known from existing FIN_METRICS:
# annual: [13.24,17.64,20.85,22.6,23.89,27.45,33.2,35.82,51.57,63.89]
# quarterly: [6.78,7.41,7.71,8.1,8.46,8.93,8.91,8.73,8.88,9.29,11.96,12.49,13.07,14.05,14.92,15.0,15.95,18.02,19.31,22.19]

# ── Build 29 new metric objects ──────────────────────────────────────────────
new_metrics = []

def metric(name, group, fmt, desc, ann_src, ann_row, ann_scale, q_src, q_row, q_scale, dec=2):
    a = get_annual(ann_src, ann_row, scale=ann_scale, decimals=dec)
    q = get_quarterly(q_src, q_row, scale=q_scale, decimals=dec)
    new_metrics.append({
        "name": name, "group": group, "fmt": fmt, "desc": desc,
        "annual": a, "quarterly": q
    })

# ── Income Statement ─────────────────────────────────────────────────────────
metric("Cost of Revenue",         "Income Statement", "B",  "Direct cost of goods sold",
       fy_is, "Cost Of Revenue",                  1e-9, q_is, "Cost Of Revenue",                  1e-9)
metric("SG&A Expenses",           "Income Statement", "B",  "Selling, general & admin costs",
       fy_is, "Selling General And Administrative Expenses", 1e-9, q_is, "Selling General And Administrative Expenses", 1e-9)
metric("R&D as % Revenue",        "Income Statement", "%",  "R&D spend as % of revenue",
       fy_km, "Research And Development To Revenue", 100, q_km, "Research And Development To Revenue", 100, 1)
metric("Interest Expense",        "Income Statement", "B",  "Interest cost on debt",
       fy_is, "Interest Expense",                  1e-9, q_is, "Interest Expense",                  1e-9)
metric("Depreciation & Amortization", "Income Statement", "B", "D&A — key driver of GAAP vs non-GAAP gap",
       fy_is, "Depreciation And Amortization",     1e-9, q_is, "Depreciation And Amortization",     1e-9)
metric("Stock Based Compensation","Cash Flow",       "B",  "Equity comp — dilution signal",
       fy_cf, "Stock Based Compensation",          1e-9, q_cf, "Stock Based Compensation",          1e-9)

# ── Balance Sheet ────────────────────────────────────────────────────────────
metric("Net Receivables",         "Balance Sheet",   "B",  "Accounts receivable — collection quality",
       fy_bs, "Net Receivables",                   1e-9, q_bs, "Net Receivables",                   1e-9)
metric("Inventory",               "Balance Sheet",   "B",  "Raw materials & finished goods",
       fy_bs, "Inventory",                         1e-9, q_bs, "Inventory",                         1e-9)
metric("Total Current Assets",    "Balance Sheet",   "B",  "Assets convertible to cash within 1 year",
       fy_bs, "Total Current Assets",              1e-9, q_bs, "Total Current Assets",              1e-9)
metric("Property Plant & Equipment","Balance Sheet", "B",  "Net PP&E — physical asset base",
       fy_bs, "Property Plant Equipment Net",      1e-9, q_bs, "Property Plant Equipment Net",      1e-9)
metric("Goodwill",                "Balance Sheet",   "B",  "Acquisition premium — impairment risk if deal fails",
       fy_bs, "Goodwill",                          1e-9, q_bs, "Goodwill",                          1e-9)
metric("Intangible Assets",       "Balance Sheet",   "B",  "IP, patents, customer lists — amortises over time",
       fy_bs, "Intangible Assets",                 1e-9, q_bs, "Intangible Assets",                 1e-9)
metric("Short Term Debt",         "Balance Sheet",   "B",  "Debt due within 12 months",
       fy_bs, "Short Term Debt",                   1e-9, q_bs, "Short Term Debt",                   1e-9)
metric("Long Term Debt",          "Balance Sheet",   "B",  "Debt due beyond 12 months",
       fy_bs, "Long Term Debt",                    1e-9, q_bs, "Long Term Debt",                    1e-9)
metric("Total Current Liabilities","Balance Sheet",  "B",  "Obligations due within 1 year",
       fy_bs, "Total Current Liabilities",         1e-9, q_bs, "Total Current Liabilities",         1e-9)
metric("Retained Earnings",       "Balance Sheet",   "B",  "Cumulative profits kept in the business",
       fy_bs, "Retained Earnings",                 1e-9, q_bs, "Retained Earnings",                 1e-9)

# ── Cash Flow ────────────────────────────────────────────────────────────────
metric("Acquisitions",            "Cash Flow",       "B",  "M&A spend — negative = cash out",
       fy_cf, "Acquisitions Net",                  1e-9, q_cf, "Acquisitions Net",                  1e-9)
metric("Debt Repayment",          "Cash Flow",       "B",  "Principal repaid on debt — negative = cash out",
       fy_cf, "Debt Repayment",                    1e-9, q_cf, "Debt Repayment",                    1e-9)

# ── Key Metrics ──────────────────────────────────────────────────────────────
metric("Market Cap",              "Valuation",       "B",  "Total market value of equity",
       fy_km, "Market Cap",                        1e-9, q_km, "Market Cap",                        1e-9)
metric("Enterprise Value",        "Valuation",       "B",  "Mkt cap + debt − cash — total business value",
       fy_km, "Enterprise Value",                  1e-9, q_km, "Enterprise Value",                  1e-9)
metric("Price / Sales",           "Valuation",       "x",  "Market cap divided by annual revenue",
       fy_km, "Price To Sales Ratio",              1,    q_km, "Price To Sales Ratio",              1, 1)
metric("SBC / Revenue",           "Income Statement","%" , "Stock comp as % of revenue — dilution intensity",
       fy_km, "Stock Based Compensation To Revenue", 100, q_km, "Stock Based Compensation To Revenue", 100, 1)
metric("Debt / Assets",           "Leverage",        "%",  "Total debt as % of assets — solvency signal",
       fy_km, "Debt To Assets",                    100,  q_km, "Debt To Assets",                    100, 1)
metric("Current Ratio",           "Leverage",        "x",  "Current assets / current liabilities — liquidity",
       fy_km, "Current Ratio",                     1,    q_km, "Current Ratio",                     1, 2)
metric("Interest Coverage",       "Leverage",        "x",  "EBITDA / interest expense — debt safety margin",
       fy_km, "Interest Coverage",                 1,    q_km, "Interest Coverage",                 1, 1)

# ── Financial Growth ─────────────────────────────────────────────────────────
metric("Gross Profit Growth",     "Growth",          "%",  "YoY gross profit growth",
       fy_gr, "Gross Profit Growth",               100,  q_gr, "Gross Profit Growth",               100, 1)
metric("OCF Growth",              "Growth",          "%",  "YoY operating cash flow growth",
       fy_gr, "Operating Cash Flow Growth",        100,  q_gr, "Operating Cash Flow Growth",        100, 1)
metric("Debt Growth",             "Growth",          "%",  "YoY change in total debt",
       fy_gr, "Debt Growth",                       100,  q_gr, "Debt Growth",                       100, 1)

# Derived: Working Capital = Current Assets - Current Liabilities
def derived_working_capital():
    ca_a  = get_annual(fy_bs, "Total Current Assets",      1e-9, 2)
    cl_a  = get_annual(fy_bs, "Total Current Liabilities", 1e-9, 2)
    ca_q  = get_quarterly(q_bs, "Total Current Assets",    1e-9, 2)
    cl_q  = get_quarterly(q_bs, "Total Current Liabilities", 1e-9, 2)
    ann  = [round(a-b,2) if a is not None and b is not None else None for a,b in zip(ca_a, cl_a)]
    qrt  = [round(a-b,2) if a is not None and b is not None else None for a,b in zip(ca_q, cl_q)]
    new_metrics.append({
        "name": "Working Capital", "group": "Balance Sheet", "fmt": "B",
        "desc": "Current assets minus current liabilities — short-term financial health",
        "annual": ann, "quarterly": qrt
    })

derived_working_capital()

print(f"\nBuilt {len(new_metrics)} new metric objects")
for m in new_metrics:
    nones_a = sum(1 for v in m['annual'] if v is None)
    nones_q = sum(1 for v in m['quarterly'] if v is None)
    print(f"  {m['name']:40s} annual={len(m['annual'])} ({nones_a} null)  qrt={len(m['quarterly'])} ({nones_q} null)")

# ── Generate JS snippet to inject ────────────────────────────────────────────
js_parts = []
for m in new_metrics:
    ann_str = json.dumps(m['annual'])
    qrt_str = json.dumps(m['quarterly'])
    js_parts.append(f'''  {{
    "name": "{m['name']}",
    "group": "{m['group']}",
    "fmt": "{m['fmt']}",
    "desc": "{m['desc']}",
    "annual": {ann_str},
    "quarterly": {qrt_str}
  }}''')

injection = ",\n".join(js_parts)

# ── Find insertion point: end of FIN_METRICS array (before closing ];) ───────
src = HTML.read_text(encoding="utf-8")

# Find the closing ]; of FIN_METRICS
# The array ends with the last metric entry's closing }, then ];
# We'll find the last  }  followed by newline and ]; at the top level
fin_metrics_start = src.find("const FIN_METRICS = [")
# Find the matching close bracket
depth = 0
idx = fin_metrics_start + len("const FIN_METRICS = [")
close_idx = None
for i, ch in enumerate(src[fin_metrics_start:], start=fin_metrics_start):
    if ch == '[': depth += 1
    elif ch == ']':
        depth -= 1
        if depth == 0:
            close_idx = i
            break

print(f"\nFIN_METRICS array closes at char {close_idx}")
print(f"Context around close: ...{repr(src[close_idx-30:close_idx+5])}...")

# Insert before the closing ]
new_src = src[:close_idx] + ",\n" + injection + "\n" + src[close_idx:]
HTML.write_text(new_src, encoding="utf-8")
print(f"\nInjected {len(new_metrics)} metrics into FIN_METRICS")

# ── Verify ───────────────────────────────────────────────────────────────────
txt = HTML.read_text(encoding="utf-8")
for m in new_metrics:
    found = f'"name": "{m["name"]}"' in txt
    print(f"  {'OK' if found else 'MISS'}: {m['name']}")

# Count total metrics
total = txt.count('"name":')
print(f"\n  Total metrics in FIN_METRICS: {total}")
print(f"  File: {len(txt):,} bytes")
