#!/usr/bin/env python3
"""Fetch latest AVGO close price from Yahoo Finance and patch avgo-thesis.html.

Updates:
  - const NOW_PRICE = ...
  - { q: "NOW", p: ... } in HISTORY array

Usage:
  python3 stocks/AVGO/update-price.py
"""

import urllib.request
import json
import re
import sys
from pathlib import Path
from datetime import datetime, timezone

TICKER = "AVGO"
HTML   = Path(__file__).parent / "avgo-thesis.html"
URL    = (
    f"https://query1.finance.yahoo.com/v8/finance/chart/{TICKER}"
    "?interval=1d&range=5d"
)

def fetch_last_close():
    req = urllib.request.Request(URL, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=10) as resp:
        data = json.load(resp)

    result = data["chart"]["result"][0]
    meta   = result["meta"]
    closes = result["indicators"]["quote"][0]["close"]
    stamps = result["timestamp"]

    # Walk backwards to find the last non-null close
    for i in range(len(closes) - 1, -1, -1):
        if closes[i] is not None:
            price = round(closes[i], 2)
            date  = datetime.fromtimestamp(stamps[i], tz=timezone.utc).strftime("%Y-%m-%d")
            state = meta.get("marketState", "UNKNOWN")
            return price, date, state

    raise ValueError("No valid close found in response")

def patch_html(price):
    src = HTML.read_text(encoding="utf-8")

    # 1. Patch NOW_PRICE constant
    patched, n1 = re.subn(
        r"(const NOW_PRICE\s*=\s*)\d+(\.\d+)?(\s*;)",
        rf"\g<1>{price}\3",
        src,
    )
    if n1 == 0:
        print("ERROR: 'const NOW_PRICE' not found in HTML", file=sys.stderr)
        sys.exit(1)

    HTML.write_text(patched, encoding="utf-8")
    return n1

if __name__ == "__main__":
    try:
        price, date, state = fetch_last_close()
    except Exception as e:
        print(f"ERROR fetching price: {e}", file=sys.stderr)
        sys.exit(1)

    n1 = patch_html(price)

    print(f"  {TICKER}  last close  ${price}  ({date})  [{state}]")
    print(f"  patched NOW_PRICE × {n1}  →  {HTML.name}")
    print(f"  HISTORY[NOW] inherits automatically (uses NOW_PRICE variable)")
