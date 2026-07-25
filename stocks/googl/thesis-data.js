/* ╔══════════════════════════════════════════════════════════════════════════╗
   ║   GOOGL · thesis-data.js — ALL per-stock content lives here.             ║
   ║   ███  EDIT EVERYTHING IN THIS FILE EACH QUARTER  ███                    ║
   ║                                                                          ║
   ║   The rendering engine (../engine/thesis-engine.js) contains ZERO        ║
   ║   company-specific strings — every number, narrative, and tooltip        ║
   ║   that mentions GOOGL is in this file. Quarterly touch = edit this       ║
   ║   file only, then run: node tools/lint-thesis-data.js GOOGL              ║
   ║                                                                          ║
   ║   Quick map — after each earnings report:                                ║
   ║     1. AS_OF_DATE / FALLBACK_PRICE                                       ║
   ║     2. HISTORY (add quarter) / FUTURE_Q (roll labels) / PROJ_END         ║
   ║     3. CASES — re-read each narrative, still true?                       ║
   ║     4. SIGNALS / MARGIN — update BEAT/MATCH/MISS + positions             ║
   ║     5. KPI_HIST / KPI_PROJ                                               ║
   ║     6. TRACK_ALL — append new quarter (oldest auto-drops)                ║
   ║     7. TEXT.* — re-read every narrative template, refresh stale facts    ║
   ║     8. ALERT — keep in sync with PF_ALERTS (canonical)                   ║
   ╚══════════════════════════════════════════════════════════════════════════╝ */

const TICKER_META = { ticker: "GOOGL", exchange: "NASDAQ", company: "Alphabet Inc." };
const AS_OF_DATE = "2026-07-25";

// Most recent material dislocation: the Jan-Mar 2025 antitrust-ruling + AI-disruption-fear
// selloff. Trough/base-floor use REAL monthly-close data (Wisesheets, 5yr free-tier window),
// not the intraday 52-week-low figure the pre-migration build cited — the exact intraday low
// wasn't independently verifiable this session, so this uses the defensible month-end print.
const DISLOCATION_DATE = "2025-03-31";
const REVERSION_TROUGH = 155;
const REVERSION_BASEFLOOR = 370;
const REVERSION_PRECEDENT_DAYS = 380;

const CASES = {
  bear: {
    key: "bear", label: "BEAR", accent: "#f1564b", glow: "rgba(241,86,75,0.45)",
    target12: "$280 — $315",
    op: "The Q2 2026 print itself wasn't the bear case — Cloud crushed every threshold this thesis had set. But Q2 also delivered Alphabet's first-ever NEGATIVE free cash flow quarter (-$5.9B), as capex nearly doubled YoY to $44.9B — TTM FCF is still solidly positive (~$53B) and the balance sheet holds ~$240B in cash/securities, but this is a real, not cosmetic, data point for anyone arguing the spend is purely optics-driven. The bear case rests on what comes NEXT: the market's -7–8% reaction to the capex guide raise ($180–190B → $195–205B, with 2027 flagged to rise further) proves investors will punish Alphabet on cost/cash-flow optics even when Cloud is monetizing at a record pace, and if Search's deceleration (19%→17% YoY) continues into the low-teens while FCF stays negative or barely positive for multiple quarters, the multiple stays compressed regardless of Cloud's growth. A DOJ appellate structural remedy (Chrome/Android divestiture, oral arguments expected late 2026/early 2027) remains the other live tail risk, now compounded by the EU's Android antitrust loss (final appeal rejected 2026-07-02, €4.1B fine) — a real, if financially modest, adverse antitrust outcome that already landed.",
    breaks: "DOJ loses the structural remedies appeal, AND Cloud backlog keeps converting to revenue at pace for two more quarters (i.e., Q2's $514B backlog isn't a peak) — both together remove the core bear premise.",
    requires01: "Search growth falls into single digits; Cloud backlog conversion stalls or backlog itself shrinks sequentially",
    requires02: "Capex keeps rising into 2027 (as guided) without Cloud revenue/margin keeping pace — proving the spend isn't monetizing, just costing; quarterly FCF stays negative for multiple quarters running",
  },
  base: {
    key: "base", label: "BASE", accent: "#e0a83b", glow: "rgba(224,168,59,0.40)",
    target12: "$370 — $415",
    op: "Cloud individually already cleared the bull bar this quarter — 82% YoY growth, 35.5% operating margin, $514B backlog (+$50B+ sequentially) — but Search's deceleration to +17% YoY (from Q1's +19%) keeps the base case's own bull-shift condition (Cloud>60% AND Search>22%, together) from firing. Q2 also marked Alphabet's first-ever quarter of negative free cash flow (-$5.9B) as capex nearly doubled to $44.9B — real, not cosmetic, though TTM FCF is still ~$53B positive and the ~$240B cash/securities balance funds the buildout without strain. This is the most likely read of Q2: an outstanding Cloud quarter, a solid-not-spectacular Search quarter, a genuine (if temporary) FCF air-pocket, and a market reaction driven almost entirely by capex/cash-flow optics rather than the underlying monetization evidence — exactly CLAUDE.md's 'cost framing panics markets, payoff framing is the real question' pattern playing out live. Management calls the environment 'supply-constrained' (demand exceeding capacity) and expects capex to rise again in 2027 — a genuine signal of durable demand pull, not customers front-loading orders, though the backlog-conversion pace AND the path back to positive quarterly FCF over the next few quarters are the real tells. DOJ US case remains at the behavioral-remedies-only trial outcome, appeal still pending — no change this quarter.",
    breaks: "Cloud decelerates below 55% for two consecutive quarters (bear shift, after this quarter's 82% high), or Search re-accelerates above 22% while Cloud holds 60%+ (bull shift, confirming both legs fire together). The base lane widened this quarter, not narrowed — Cloud alone doesn't settle it.",
    requires01: "Cloud holds 55%+ next quarter (deceleration from 82% is expected and fine); Search holds 15%+",
    requires02: "Backlog keeps growing or holds flat (not shrinking); capex raise shows in guidance as tied to signed bookings, not speculative build; quarterly FCF returns to (even marginally) positive within 1-2 quarters",
  },
  bull: {
    key: "bull", label: "BULL", accent: "#3fd07a", glow: "rgba(63,208,122,0.45)",
    target12: "$460 — $505",
    op: "Search re-accelerates above 22% — AI Mode shopping ads and AI Overviews prove measurably more effective than static links, closing the one gap Q2 left open — while Cloud holds 60%+ for a second consecutive quarter, confirming the 82% print was a structural step-change (TPU cost/latency advantage converting the $514B backlog into a multi-year enterprise AI migration) rather than a one-quarter anomaly. Free cash flow returns to positive territory as backlog conversion outpaces new capex commitments, proving Q2's -$5.9B FCF quarter was a temporary air-pocket from front-loaded spend, not a structural cash-generation problem. DOJ appellate courts reject structural remedies on the US case; the EU Android fine, now final, proves to be the ceiling on antitrust cost rather than the start of a bigger structural risk. The market re-rates Alphabet as both legs — Cloud AND Search — compound together, closing the gap to mega-cap AI-infrastructure peer multiples despite this quarter's sector-wide capex-fear de-rate.",
    breaks: "Google Cloud's growth proves to be one-quarter catch-up, not structural — decelerates back below 55% next quarter despite the $514B backlog. Also: Search fails to re-accelerate, capping the bull case's second required leg.",
    requires01: "Cloud holds 60%+ for a second straight quarter; Search re-accelerates to 22%+; backlog keeps growing past $514B",
    requires02: "Cloud margin holds/expands above 35%; capex guide increases show up as revenue growth, not just cost, within 2-3 quarters",
  },
};

// THESIS_HISTORY — append-only archive of the full CASES set as it stood at each
// touch, captured BEFORE that touch's Layer-2 audit rewrites it. NEVER edit a past
// entry after the fact. This first entry is the May 2026 build's CASES, as it stood
// before the 2026-07-25 Q2 2026 update rewrote it.
const THESIS_HISTORY = [
  { asOf: "2026-05-30", quarter: "Q1 2026", cases: {
    bear: { target12: "$220 — $265", op: "Two antitrust fronts reach worst-case outcomes: a DOJ appellate court imposes structural remedies severing Chrome or Android distribution (removing ~40% of Google's default search placement), and forced AdX divestiture breaks the publisher ad-server flywheel that generates premium CPMs. Simultaneously, AI Overviews plateau in ad monetization — advertisers find conversion lower than traditional links as users get answers without clicking — and query volume starts migrating to ChatGPT and Perplexity for higher-value informational research. Cloud decelerates to 30–35% as the initial AI land-rush passes and AWS/Azure reassert supply advantages. Multiple compresses to 22× on a regulatory-discount + earnings-miss combination.", breaks: "DOJ loses the structural remedies appeal in both cases, AND Cloud sustains >50% growth for two more quarters — both together remove the core bear premise.", requires01: "Cloud decelerates to sub-40%; search growth falls below 12% on competitive losses", requires02: "Operating margin compresses as capex spends without proportionate revenue; DOJ structural remedy imposed" },
    base: { target12: "$395 — $435", op: "Search proves it can grow alongside AI: queries at all-time highs, AI Overviews monetizing at near-parity with traditional search (ads in 25.5% of responses and growing), and no competitor yet demonstrating the ability to capture share of commercial-intent queries at scale. Cloud sustains 50%+ growth — decelerating from 63% but the $462B backlog (nearly doubled sequentially) provides 2–3 years of demand visibility. DOJ remedies land as behavioral: end exclusive distribution deals, share some search index data — adjusts cost structure but doesn't break the data flywheel. Capex is tolerated as 'investment' because Cloud's 32.9% margin already demonstrates the return.", breaks: "Cloud decelerates below 40% for two consecutive quarters (bear shift), or Cloud sustains above 60% AND Search re-accelerates above 22% (bull shift). The base lane is narrower than it looks.", requires01: "Cloud sustains 50%+; Q2 revenue beats guide midpoint; search holds above 15%", requires02: "Cloud margin holds above 31%; capex cycle shows operating leverage emergence in guidance" },
    bull: { target12: "$540 — $610", op: "Google Cloud becomes the enterprise AI platform of choice: Gemini models running on Google's own TPU infrastructure deliver lower latency and cost than NVIDIA GPU-rented competitors, and the $462B backlog is the start of a decade-long enterprise AI migration. Search re-accelerates above 22% as AI Mode shopping ads prove measurably more effective than static links — the closed-loop data advantage across Search, YouTube, Maps, and Shopping (Alphabet knows what you bought after seeing the ad) gives targeting precision no standalone model can match. DOJ appellate courts reject structural remedies; Apple continues paying $15–20B annually for default search. The market re-rates Alphabet from 'legacy search monopoly at 29×' to 'dual-compounder AI platform at 36×.'", breaks: "Google Cloud loses market share to AWS/Azure despite growing — i.e., the AI cloud market grows faster than Alphabet's share, proving the 63% gain was catch-up not a structural win. Also: Apple drops Google as default search (observable now in court proceedings).", requires01: "Cloud holds 60%+ for Q2; backlog approaches $500B; Search re-accelerates to 22%+", requires02: "Cloud margin expands above 35% as TPU silicon scales and inference unit economics improve" },
  } },
];

const FALLBACK_PRICE = 319.74;

const LIVE_PRICE = {
  enabled: true,
  symbol: "GOOGL",
  provider: "yahoo",
  corsProxy: "https://api.allorigins.win/get?url=",
  finnhubToken: "",
};

// ALERT — buy-trigger pre-commitment. GOOGL has no PF_ALERTS row in
// stocks/portfolio/portfolio-data.js as of this migration (deliberate — like AMZN,
// treated as a steady compounder rather than an active generator/buy-floor candidate;
// see stocks/portfolio/portfolio-data.js's AMZN header note for the same reasoning).
// This block exists only because ALERT is a required schema field — it's a FALLBACK
// for offline opens, informational only, not an active portfolio pre-commitment.
const ALERT = {
  symbol: "GOOGL",
  buyFloor: 280,
  thesisIntact: true,
  asOf: AS_OF_DATE,
  nextEarnings: "~2026-10-27",
};

const HISTORY = [
  { q: "Q4 2024", p: 202.00 },
  { q: "Q1 2025", p: 177.00 },
  { q: "Q2 2025", p: 168.00 },
  { q: "Q3 2025", p: 196.00 },
  { q: "Q4 2025", p: 258.00 },
  { q: "Q1 2026", p: 375.00 },
  { q: "Q2 2026", p: 320.00 },
  { q: "NOW",     p: FALLBACK_PRICE },
];

const PROJ_END = { bear: 297, base: 392, bull: 482 };
const FUTURE_Q = ["Q3 2026", "Q4 2026", "Q1 2027", "Q2 2027"];

const SIGNALS = {
  bear: [
    { name: "Google Cloud Revenue Growth",   unit: "%",  tag: "BEAT", next: "~Oct 27, 2026", val: "ACTUAL +82% ($24.8B)", guide: "vs bull bar ≥60%",      pos: 0.90 },
    { name: "Q2 Revenue vs ~$108B Estimate", unit: "$B", tag: "BEAT", next: "~Oct 27, 2026", val: "ACTUAL $119.8B",       guide: "beat ~$108B estimate",  pos: 0.85 },
    { name: "Search Revenue Growth (YoY %)", unit: "%",  tag: "MATCH",next: "~Oct 27, 2026", val: "ACTUAL +17% ($63.3B)", guide: "base band 14–18%",      pos: 0.55 },
  ],
  base: [
    { name: "Google Cloud Revenue Growth",   unit: "%",  tag: "BEAT", next: "~Oct 27, 2026", val: "ACTUAL +82% ($24.8B)", guide: "vs bull bar ≥60%",      pos: 0.90 },
    { name: "Q2 Revenue vs ~$108B Estimate", unit: "$B", tag: "BEAT", next: "~Oct 27, 2026", val: "ACTUAL $119.8B",       guide: "beat ~$108B estimate",  pos: 0.85 },
    { name: "Search Revenue Growth (YoY %)", unit: "%",  tag: "MATCH",next: "~Oct 27, 2026", val: "ACTUAL +17% ($63.3B)", guide: "base band 14–18%",      pos: 0.55 },
  ],
  bull: [
    { name: "Google Cloud Revenue Growth",   unit: "%",  tag: "BEAT", next: "~Oct 27, 2026", val: "ACTUAL +82% ($24.8B)", guide: "vs bull bar ≥60%",      pos: 0.90 },
    { name: "Q2 Revenue vs ~$108B Estimate", unit: "$B", tag: "BEAT", next: "~Oct 27, 2026", val: "ACTUAL $119.8B",       guide: "beat ~$108B estimate",  pos: 0.85 },
    { name: "Search Revenue Growth (YoY %)", unit: "%",  tag: "MATCH",next: "~Oct 27, 2026", val: "ACTUAL +17% ($63.3B)", guide: "base band 14–18%",      pos: 0.55 },
  ],
};
const MARGIN = {
  bear: [
    { name: "Cloud Operating Margin",        tag: "BEAT",  next: "~Oct 27, 2026", pos: 0.85 },
    { name: "Quarterly Free Cash Flow",      tag: "MISS",  next: "~Oct 27, 2026", pos: 0.15 },
    { name: "DOJ Structural Remedy Risk",    tag: "WATCH", next: "Open 2026–2027", pos: 0.45 },
  ],
  base: [
    { name: "Cloud Operating Margin",        tag: "BEAT",  next: "~Oct 27, 2026", pos: 0.85 },
    { name: "Quarterly Free Cash Flow",      tag: "MISS",  next: "~Oct 27, 2026", pos: 0.15 },
    { name: "DOJ Structural Remedy Risk",    tag: "WATCH", next: "Open 2026–2027", pos: 0.45 },
  ],
  bull: [
    { name: "Cloud Operating Margin",        tag: "BEAT",  next: "~Oct 27, 2026", pos: 0.85 },
    { name: "Quarterly Free Cash Flow",      tag: "MISS",  next: "~Oct 27, 2026", pos: 0.15 },
    { name: "DOJ Structural Remedy Risk",    tag: "WATCH", next: "Open 2026–2027", pos: 0.45 },
  ],
};

// Google Cloud Revenue Growth Rate (%) — Q2 2026 ACTUAL (82%, crushed every prior band)
const KPI_HIST = 82;
const KPI_PROJ = {
  bear:  [55, 45, 38, 32],
  base:  [65, 58, 52, 48],
  bull:  [75, 78, 72, 68],
};

// TRACK RECORD — append newest to end; dashboard keeps last TRACK_WINDOW.
const TRACK_ALL = [
  { q: "Q4 2024", date: "2025-02", post: 202, reaction: "+",  bear: [165,200], base: [200,252], bull: [252,322], landed: "base",      conf: "med"  },
  { q: "Q1 2025", date: "2025-04", post: 177, reaction: "−",  bear: [152,198], base: [198,248], bull: [248,312], landed: "bear",      conf: "med"  },
  { q: "Q2 2025", date: "2025-07", post: 168, reaction: "−",  bear: [148,192], base: [192,240], bull: [240,305], landed: "bear",      conf: "med"  },
  { q: "Q3 2025", date: "2025-10", post: 196, reaction: "++", bear: [155,195], base: [195,245], bull: [245,310], landed: "base",      conf: "high" },
  { q: "Q4 2025", date: "2026-02", post: 258, reaction: "++", bear: [200,252], base: [252,325], bull: [325,418], landed: "base",      conf: "high" },
  { q: "Q1 2026", date: "2026-04", post: 375, reaction: "++", bear: [210,268], base: [268,350], bull: [350,445], landed: "bull",      conf: "high" },
  { q: "Q2 2026", date: "2026-07", post: 320, reaction: "−−", bear: [220,265], base: [395,435], bull: [540,610], landed: "bear→base", conf: "high" },
];
const TRACK_WINDOW = 6;

// THE PAST — annual history (Wisesheets 10-Q/10-K facts). Only 4 fiscal years
// (2022-2025) available, not TSM's 10 — Wisesheets' free-tier plan caps history at
// 5 years, and the 5th year (2021) lacked an aligned year-end price point this
// session, so all price-dependent series (EV/EBITDA, FCF yield) use the same
// 4-year window as revenue/margin/FCF for internal consistency. Real, sourced data
// throughout — a shorter honest window beats a longer fabricated one.
const PAST_YEARS       = ["2022","2023","2024","2025"];
const PAST_REV         = [282.8, 307.4, 350.0, 402.8];
const PAST_GM          = [55.4,  56.6,  58.2,  59.7];
const PAST_FCF         = [60.0,  69.5,  72.8,  73.3];
const PAST_ROIC        = [20.8,  21.5,  25.4,  21.3];
const PAST_EVEBITDA    = [12.1,  17.6,  17.9,  25.4];
const PAST_FCF_YIELD   = [5.6,   4.1,   3.2,   1.9];
const PAST_CAPEX_REV   = [11.1,  10.5,  15.0,  22.7];
const PRICE_M_LABELS = ["2022-07","2022-08","2022-09","2022-10","2022-11","2022-12","2023-01","2023-02","2023-03","2023-04","2023-05","2023-06","2023-07","2023-08","2023-09","2023-10","2023-11","2023-12","2024-01","2024-02","2024-03","2024-04","2024-05","2024-06","2024-07","2024-08","2024-09","2024-10","2024-11","2024-12","2025-01","2025-02","2025-03","2025-04","2025-05","2025-06","2025-07","2025-08","2025-09","2025-10","2025-11","2025-12","2026-01","2026-02","2026-03","2026-04","2026-05","2026-06","2026-07"];
const PRICE_M = [116.32,108.22,95.65,94.51,100.99,88.23,98.84,90.06,103.73,107.34,122.87,119.70,132.72,136.17,130.86,124.08,132.53,139.69,140.10,138.46,150.93,162.78,172.50,182.15,171.54,163.38,165.85,171.11,168.95,189.30,204.02,170.28,154.64,158.80,171.74,176.23,191.90,212.91,243.10,281.19,320.18,313.00,338.00,311.76,287.56,384.80,380.34,357.37,319.74];
const PRICE_M_DD = [0.0,-7.0,-17.8,-18.7,-13.2,-24.2,-15.0,-22.6,-10.8,-7.7,0.0,-2.6,0.0,0.0,-3.9,-8.9,-2.7,0.0,0.0,-1.2,0.0,0.0,0.0,0.0,-5.8,-10.3,-8.9,-6.1,-7.2,0.0,0.0,-16.5,-24.2,-22.2,-15.8,-13.6,-5.9,0.0,0.0,0.0,0.0,-2.2,0.0,-7.8,-14.9,0.0,-1.2,-7.1,-16.9];
const PAST_EVENTS = [
  { idx: 5,  label: "Rate-Hike Selloff", note: "Dec 2022 — the broad 2022 tech/rate-hike de-rating trough. No Alphabet-specific miss; the whole megacap complex compressed on rising rates. Deepest drawdown in this window alongside Mar 2025 (-24.2%)." },
  { idx: 32, label: "Antitrust + AI-Fear Selloff", note: "Mar 2025 — DOJ's August 2024 monopoly-finding remedies process plus broad 'AI disrupts Google search' fear drove the stock to its lowest level in this window (-24.2% from the Jan 2025 high). Fundamentals stayed intact through it — Search kept growing, Cloud kept accelerating." },
  { idx: 37, label: "AI Re-Rating Begins", note: "Aug 2025 onward — Google Cloud's growth acceleration (30%→63%→82% over the following quarters) started forcing the market to abandon the 'AI disrupts Google' thesis, kicking off the run from ~$213 to a new high." },
  { idx: 45, label: "Cycle High", note: "Apr 2026 — fresh high on Q1 2026's beat-and-raise (Cloud +63%, DOJ appeal still pending but no adverse ruling). The multiple was pricing continued flawless execution." },
  { idx: 48, label: "Capex-Fear Pullback", note: "Jul 2026 — Q2 2026 beat on revenue/Cloud/Search but posted Alphabet's first-ever negative quarterly FCF (-$5.9B) on a capex guide raise to $195-205B; stock fell ~7-8% on the print despite the underlying beat." },
];

const VAL_CONFIG = {
  ntm_eps:              14.32,
  shares_b:              12.088,
  fcf_ntm_b:             53.0,     // TTM as of Q2 2026 — down from the FY2025 full-year $73.3B
                                    // pace as H1 2026 capex ($80.6B) already exceeds most of FY2025's
                                    // full-year capex ($91.4B). A real compression, not noise.
  risk_free_pct:         4.35,
  default_discount_pct:  9.0,
  default_terminal_pe:   24,
  dcf_years:              5,
  capex_fy26_guide_b:    200,      // raised from $180-190B to $195-205B on the Q2 2026 call; midpoint
  prior_fy_rev_b:       402.8,     // last full fiscal year actual revenue
  prior_fy_label:       "2025",
  pe_trough: 19, pe_bear_hi: 21, pe_normal_lo: 25, pe_normal_hi: 28, pe_bull_lo: 31, pe_peak: 34,
  peers: [
    { t: "GOOGL", fpe: 21.5, ev_eb: 25.4, fcf_y: 1.4, note: "Search duopoly + Cloud/TPU dual compounder; FCF yield compressed by the Q2 capex surge, not deteriorating fundamentals" },
    { t: "MSFT",  fpe: 19.8, ev_eb: 15.0, fcf_y: 2.5, note: "Azure cloud + Copilot — the only one of this peer set still guided to GROW FCF in 2026 (Evercore)" },
    { t: "META",  fpe: 18.0, ev_eb: 14.0, fcf_y: 1.9, note: "Ads-only (no cloud upside); FCF also guided down YoY in 2026 on its own capex ramp (~$29B, Morgan Stanley est.)" },
    { t: "AMZN",  fpe: 25.0, ev_eb: 17.9, fcf_y: 2.0, note: "AWS cloud + retail; FCF also guided down YoY in 2026; reports its own Q2 2026 print Jul 30, 2026" },
  ],
};

const SIGNAL_HELP = {
  "Google Cloud Revenue Growth": "How fast Google Cloud (Alphabet's cloud business) is growing year-over-year. Cloud grew +82% in Q2 2026 — a step up from Q1's already-record +63% — to $24.8B in quarterly revenue, driven by enterprise AI/TPU demand. Backlog hit $514B (+$50B+ sequentially). This single number crushed every bull-case threshold this thesis had set — the real open question now is whether it holds anywhere near this pace next quarter, or was a one-time catch-up.",
  "Q2 Revenue vs ~$108B Estimate": "Alphabet reported $119.8B in Q2 2026 revenue (+24% YoY), well above the ~$108B analyst estimate. Cloud and Search both grew, but the stock still dropped ~7-8% on the print because full-year capex guidance was raised from $180-190B to $195-205B and the company posted its first-ever negative quarterly free cash flow — a live example of markets reacting to the cost of AI infrastructure spend before the payoff is fully priced in.",
  "Search Revenue Growth (YoY %)": "How fast Google Search advertising revenue is growing. Search grew +17% to $63.3B in Q2 2026 — a deceleration from Q1's +19%, landing in this thesis's BASE band (14-18%), not the BULL band (22%+). Queries remain healthy and AI Overviews keep monetizing, but this is the one leg of the bull case that hasn't yet fired alongside Cloud's outperformance.",
  "Cloud Operating Margin": "Google Cloud's operating profit margin — how much of each dollar of cloud revenue becomes operating income. Cloud's margin reached ~35.5% in Q2 2026 (up from 32.9% in Q1), crossing this thesis's own bull-case threshold (above 35%). Higher margin at this scale is real evidence the AI infrastructure buildout is monetizing, not just costing.",
  "Quarterly Free Cash Flow": "Operating cash flow minus capital expenditures for the quarter alone (not trailing-twelve-month). Alphabet posted -$5.9B in Q2 2026 — its first-ever negative quarter — as capex nearly doubled YoY to $44.9B. TTM FCF is still solidly positive (~$53B) and the balance sheet holds ~$240B in cash/securities, so this isn't a liquidity concern, but it's the clearest single number for whether the capex ramp is outrunning cash generation.",
  "DOJ Structural Remedy Risk": "Alphabet is fighting antitrust on two fronts. US: DOJ + 35 states are appealing the September 2025 ruling (which rejected Chrome/Android structural divestiture, imposed behavioral remedies only) to the D.C. Circuit — oral arguments expected late 2026/early 2027, unresolved this quarter. EU: the EU's top court REJECTED Google's final appeal on the Android case 2026-07-02, finalizing a €4.1B fine — a real, concluded outcome, but a smaller and separate matter from the still-pending US structural-remedy risk.",
};
const TAG_HELP = {
  BEAT: "doing better than expected — a good sign.",
  MATCH: "roughly in line with expectations — steady, no surprises.",
  MISS: "falling short of expectations — a worry.",
  WATCH: "not decided yet — keep an eye on it.",
};

const THESIS_ITEMS = [
  { key: "cloudGrowth", label: "Cloud growth holding above 55%",          note: "82% this quarter — deceleration toward 55-65% expected and fine" },
  { key: "searchGrowth", label: "Search growth holding mid-teens or better", note: "17% this quarter, decelerating from 19% — watch for further softening" },
  { key: "fcfTrend",    label: "Quarterly FCF returning toward positive", note: "First-ever negative quarter (-$5.9B) on the capex surge — TTM still +$53B" },
  { key: "dojRisk",     label: "No new DOJ structural remedy imposed",    note: "US case still on appeal; EU Android case now concluded (€4.1B fine, smaller matter)" },
];
const PRICE_ZONES = [
  { label: "BEAR", lo: 280, hi: 315, mid: 297, color: "#f1564b", action: "Exit / reduce if thesis also breaking" },
  { label: "BASE", lo: 370, hi: 415, mid: 392, color: "#e0a83b", action: "Small add OK if thesis intact" },
  { label: "BULL", lo: 460, hi: 505, mid: 482, color: "#3fd07a", action: "Let it ride — don't chase" },
];

// ── Chart geometry / axis ranges (per-stock: depends on price scale) ─────────
const GEOM = {
  priceMin: 100, priceMax: 600,
  fanGrid: [500, 400, 300, 200, 100],
  fanYears: ["2025", "2026", "2027"],
  trackMin: 130, trackMax: 650,
  trackGrid: [600, 480, 360, 240, 120],
  kpiMin: 25, kpiMax: 85,
  visLo: 200, visHi: 550,
  nowZoneLo: 370, nowZoneHi: 415,
};

/* ── TEXT — every company-specific narrative/tooltip the engine renders. ──────
   Values are strings, HTML strings (rendered with dangerouslySetInnerHTML), or
   template functions the engine calls with computed values. If it mentions the
   company, a quarter, a guide number, or an event, it belongs HERE, not in the
   engine — that rule is what makes the engine safely reusable across stocks. */
const TEXT = {
  priceTipLive: (px, at, asOf) => `Live quote: $${px} (fetched ${at}). The price is real-time, but the scenario bands and EPS are still as of ${asOf} — only the price-derived figures (scenario returns, P/E, band position) update live.`,
  priceTipStatic: (px, asOf, liveEnabled) => `$${px} as of ${asOf} — ${liveEnabled ? "live fetch unavailable (offline or blocked), using the saved price" : "static price (live fetch disabled)"}. Next earnings: Q3 2026 (~Oct 27, 2026).`,
  footerDisclaimer: (asOf) => `Illustrative scenario framing built on public consensus & estimates as of ${asOf} — not a prediction and not financial advice. Price ranges are scenario mid-bands; KPI markers are positional, not literal. Valuation ruler: forward GAAP EPS × P/E multiple. Data inputs will move with every print. Next earnings: Q3 2026 (~Oct 27, 2026).`,

  fanHistory: "The solid white line is Alphabet's actual share price since Q4 2024. The dip through Q1-Q2 2025 was markets pricing 'AI disrupts Google' alongside the DOJ antitrust remedies process. The dramatic rise from Q3 2025 onward was Google Cloud's acceleration from ~30% to 82% growth forcing a complete re-rating — then a pullback in Q2 2026 on capex/FCF optics despite the beat.",
  fanNow: (px) => `Alphabet (GOOGL) trades around $${px} right now — pulled back from a $342 pre-print high despite Q2 2026 beating on revenue ($119.8B vs ~$108B estimate), Cloud (+82% YoY, 35.5% margin, $514B backlog) and roughly matching on Search (+17% YoY). Capex guidance was raised to $195-205B and the quarter posted Alphabet's first-ever negative FCF (-$5.9B). Everything left of this dot is history; everything right is forecast.`,
  fanPastDot: (q, p) => `Around the end of ${q}, Alphabet was trading near $${p}.`,

  segmentedExplain: {
    bear: ["The pessimistic scenario", "Click to see what GOOGL looks like if things go wrong — the market keeps punishing capex/FCF optics even as Cloud monetizes, Search growth keeps decelerating toward single digits, and DOJ wins structural antitrust remedies on the still-pending US appeal. Price would likely fall to the $280–315 range."],
    base: ["The most-likely scenario", "Click for the steady-as-she-goes view — Cloud holds 55%+ growth on a $514B backlog (Q2 already printed 82%), Search holds mid-teens growth without re-accelerating, quarterly FCF drifts back toward positive, and DOJ's US case stays on appeal with no structural remedy. Price drifts toward $370–415."],
    bull: ["The optimistic scenario", "Click for the upside — Cloud holds 60%+ for a second straight quarter confirming Q2's 82% wasn't one-off, Search re-accelerates above 22% via AI Mode ads, FCF returns to positive, DOJ loses the structural remedies appeal. The market re-rates Alphabet toward mega-cap AI-infrastructure peer multiples. Price runs to $460–505."],
  },

  kpiBaseline: (val) => `This is the most recent real number: Google Cloud grew at +${val}% year-over-year in Q2 2026 — up from Q1's already-record +63%. The bars to the right are scenario forecasts for where it goes next.`,
  kpiForecast: (label, val) => `In this scenario, Google Cloud revenue growth reaches ~${val}% YoY by ${label}. Taller bar = faster growth = more AI workloads choosing Google's cloud.`,

  reversion: {
    header: "RE-RATING CLOCK · MAR 2025 ANTITRUST + AI-FEAR TROUGH",
    timeTip: "In Jan-Mar 2025, the DOJ antitrust remedies process plus broad 'AI disrupts Google search' fear drove the stock down ~24% from its January high to a March 2025 trough. This bar shows how far along we are in the recovery cycle vs. the time it took to reclaim the base floor last time.",
    priceTip: (trough, baseFloor, now) => `Stock bottomed near $${trough} (Mar 2025 close) during the antitrust/AI-fear selloff and needed to reach $${baseFloor} to re-enter the base band. At $${now}, it's ${now >= baseFloor ? "back above the base floor" : "back below the base floor again — the Q2 2026 capex/FCF reaction pulled it back down"}.`,
    footerHtml: (baseFloor, precedentDays, now) => `The Jan-Mar 2025 selloff was a sentiment/regulatory-fear shock, not a business miss — Search and Cloud both kept growing through it. Price reclaimed the $${baseFloor} base floor within the ${precedentDays}-day precedent window (by Apr 2026) before the Q2 2026 print pulled it back below that floor again on capex/FCF optics, not fundamentals. The next dislocation risk to watch is whether the capex/FCF concern proves durable or fades within a quarter or two — the same playbook applies: <span style="color:#e0a83b;font-weight:700">has the thesis actually broken, or is this fear?</span>`,
  },

  track: {
    lastDot: (post, nowPx) => `After Q2 2026 earnings (Jul 22), Alphabet traded around $${post} — landing in the gap between the OLD bear band's high ($265) and base band's floor ($395), even though revenue and Cloud both beat, because the stock pulled back hard on the capex/FCF reaction. Price sits at $${nowPx} today. Next dot: Q3 2026 earnings (~Oct 27, 2026).`,
    pastDot: (q, post) => `After ${q} earnings, Alphabet actually traded around $${post}. Compare this dot to the colored bars behind it to see if the predicted range was right.`,
    readoutHtml: (hits, n, nowPx) => `Price has tracked <span style="color:#3fd07a;font-weight:700">base-or-better in ${hits} of ${n} quarters</span> shown. Q2 2026 is the most interesting recent case: revenue beat ($119.8B vs ~$108B est.), Cloud beat every threshold (+82%, 35.5% margin, $514B backlog) — yet the stock landed BELOW the old base floor at $${nowPx}, on a capex guide raise and Alphabet's first-ever negative quarterly FCF (-$5.9B), not a business miss. Next directional catalyst: <span style="color:#e0a83b;font-weight:700">Q3 2026 earnings (~Oct 27, 2026)</span> — Cloud growth durability and whether quarterly FCF turns back positive.`,
    footnote: "⚠ Bands are reconstructed now, anchored to each date's forward EPS & multiple regime — not archived in real time. Treat levels as directional, especially \"lower-conf\" quarters. Antitrust risk (US DOJ appeal, concluded EU Android case) is a binary the bands can't fully capture — treat all bands as wider than they appear.",
  },

  current: {
    statusNarrative: {
      broken: "Multiple signals missed. Thesis is under pressure — review the kill-switch criteria.",
      watch:  "Revenue/Cloud beat but Search or FCF disappointed further, or DOJ risk escalated. Core thesis tracking — the Q3 2026 print (~Oct 27) is the next test. Not broken, but watch closely.",
      intact: "Cloud individually beat every threshold this thesis had set — the AI/TPU infrastructure buildout thesis remains intact even though Search hasn't confirmed the second bull-case leg and FCF took a real, if likely temporary, hit.",
    },
    panelTipStory: "Checks whether the original reasons to own GOOGL are playing out. Counts signals from the Q2 2026 print — Cloud growth, total revenue, Search growth, Cloud margin, quarterly FCF, DOJ risk. 0-1 miss = thesis intact. 2 misses = watch. 3+ = exit. Click to see KPI bars and kill-switch.",
    watchChipHtml: `🔑 WATCH: Q3 2026 Cloud growth durability + FCF trend · ~Oct 27, 2026`,
    exitChipHtml: `⚠ EXIT IF: Cloud decel below 55% 2 straight quarters, or DOJ structural remedy imposed`,
    verdictBody: {
      broken:     (px) => `GOOGL at $${px}: kill-switch criteria met. Price position is irrelevant — signals say the Cloud/AI infrastructure thesis is no longer playing out. The question is not whether to add; it is how much to reduce.`,
      watchBelow: (px) => `GOOGL at $${px} sits below the base floor but signals are mixed. Price is attractive, but adding into a weakening thesis is the wrong sequence. Wait for the Q3 2026 print (~Oct 27) to confirm or deny the pattern before deploying capital.`,
      below:      (px) => `GOOGL at $${px} sits below the base floor with the thesis intact — Cloud, revenue all beat, capex is being raised to CAPTURE demand (management calls it 'supply-constrained'), and the negative FCF quarter has a clear, disclosed cause. The market gave back the pre-print rally anyway on cost/cash-flow optics; the fundamentals say it's sentiment, not demand destruction — but the FCF trend genuinely needs to reverse within a quarter or two to keep saying that.`,
      inBase:     (px, statusWord) => `GOOGL at $${px} is inside the base range. Thesis ${statusWord} and price is fair. Watch Q3 2026 Cloud growth durability and whether quarterly FCF turns back positive around Oct 27 — continued strength opens the bull case; a second negative-FCF quarter or a Cloud deceleration below 55% reopens the bear.`,
      above:      (px) => `GOOGL at $${px} is above the base ceiling. The bull case — Search re-accelerating alongside sustained 60%+ Cloud growth and a return to positive FCF — needs to play out to justify entry. If already in, hold. If adding, wait for a pullback toward the base floor.`,
    },
    kpiTitle: "Google Cloud Revenue Growth",
    kpiSub: "% YoY quarterly · HIGHER BETTER",
    kpiMeasures: "Google Cloud year-over-year revenue growth. Q2 2026 printed +82% — up from Q1's already-record +63%. Cloud backlog stands at $514B, up $50B+ sequentially, giving 2-3 years of demand visibility.",
    kpiRequires: {
      bull: "Cloud holds 60%+ for a second straight quarter, confirming Q2's 82% wasn't one-off. Search re-accelerates above 22% alongside it, and FCF returns to positive.",
      base: "Cloud decelerates naturally toward 55-65% as the base grows — still exceptional growth, still justifying the current multiple. Search holds mid-teens without re-accelerating; FCF drifts back toward breakeven.",
      bear: "Cloud falls below 45%, exposing 82% as a one-quarter catch-up rather than a structural trend. FCF stays negative for multiple quarters. Multiple stays compressed as the growth story breaks.",
    },
    group1Title: "Cloud &amp; Revenue Trajectory",
    group2Title: "Margin &amp; Regulatory Exposure",
    killSwitch: "Two straight quarters of Cloud growth below 55%, quarterly FCF staying negative for multiple consecutive quarters without a clear conversion path, or a new DOJ structural remedy on the US case — exit / reduce. That is demand destruction, a cash-flow problem, or policy risk, not noise.",
    priceBanner: {
      below:  (px, baseLo) => `At $${px}, price is $${baseLo - px} below the base floor. Market is pricing in capex/FCF fear after a real, if likely temporary, negative-FCF quarter — not a Cloud or Search fundamentals problem. Historically the window patient buyers use, but confirm the FCF trend before assuming it's pure sentiment.`,
      inBase: (px) => `At $${px}, price is inside the base range. Fair value — not a discount, not expensive.`,
      above:  (px, baseHi) => `At $${px}, price is $${px - baseHi} above the base ceiling. The bull thesis needs to play out in full.`,
    },
    moodBanner: (currentPE, loPE, hiPE) => `At ${currentPE}× forward P/E, the market is pricing in some Cloud deceleration and lingering capex/FCF caution — the multiple sits ${currentPE < loPE ? "below" : "inside"} the normal band (${loPE}–${hiPE}×), a real compression versus where the stock traded just before the Q2 print, driven by cost-flow optics more than the underlying Cloud/Search beat.`,
    cagrNotes: {
      low:  "Low bar — not priced for perfection. Even moderate Cloud/Search execution justifies the price.",
      mid:  "Moderate bar — requires Cloud to hold in the mid-50s%+ and FCF to stabilize.",
      high: "High bar — requires near-perfect execution on both Cloud AND Search with no antitrust disruption.",
    },
    fy26CardTip: (fy26) => `Adding H1 2026 actuals ($229.7B) to base-case H2 2026 projections gives a full-year run rate of roughly $${fy26}B, up from $402.8B in 2025 — a real step up even before the bull case's Search re-acceleration kicks in. That's what the base case — and roughly today's price — already assumes.`,
    fy26CardHtml: (fy26, growthPct) => `H1 2026 actuals plus base-case H2 projections sum to roughly <span style="color:var(--blue-soft);font-weight:700">$${fy26}B</span> for full-year 2026 — the growth path today's price already assumes. 2025 actual revenue was <span style="color:#3fd07a">$402.8B</span>, so this implies <em>~${growthPct}%</em> YoY growth.`,
    peerCommentary: (currentPE) => `At ${currentPE}× NTM P/E, GOOGL trades at a premium to MSFT (~19.8×) and META (~18×) but a discount to AMZN (~25×) among mega-cap AI-capex peers — all four have de-rated together this week on sector-wide capex-fear, not an Alphabet-specific issue. MSFT stands out as the only peer still guided to GROW free cash flow in 2026; META and AMZN are both guided down, same direction as GOOGL's own Q2 FCF air-pocket. The premium to MSFT/META is earned by Cloud's 82% growth rate — nearly double what any peer's cloud/ad segment is printing — but that premium needs Search to eventually confirm the second leg, not just Cloud.`,
  },

  future: {
    scenarioTips: {
      bear: "Triggered by: Search decelerating further, Cloud backlog conversion stalling, or FCF staying negative for multiple quarters. Multiple compresses toward the 19-21× trough zone. Note: at current price, bear downside is smaller than it was pre-Q2 given the price has already pulled back.",
      base: (loPE, hiPE) => `Cloud holds 55%+ as it decelerates naturally from 82%; Search holds mid-teens without re-accelerating; FCF drifts back toward positive. P/E holds in the normal ${loPE}–${hiPE}× band. Modestly positive return from here as the stock re-tests the base band.`,
      bull: (currentPE) => `Cloud holds 60%+ a second straight quarter; Search re-accelerates above 22%; FCF returns to positive. Multiple re-rates from ~${currentPE}× toward the bull zone, closing the gap to the bull target.`,
    },
    downsideChevronTip: "Kill-switch: Cloud decelerates below 55% for two straight quarters, FCF stays negative for multiple quarters, or a new DOJ structural remedy lands = exit / reduce.",
    dislocEventName: "the Mar 2025 antitrust/AI-fear low",
    dislocLabel: "SINCE MAR 2025 TROUGH",
    bearPriceTip: (bearMid, bearLo, bearHi, peTrough, peBearHi) => `$${bearMid} is the midpoint of the bear case range ($${bearLo}–$${bearHi}). This assumes Search decelerates further, FCF stays negative for multiple quarters, and the multiple compresses toward the ${peTrough}–${peBearHi}× trough zone. The kill-switch is Cloud decelerating below 55% for two straight quarters, or FCF staying negative for multiple quarters running — if it triggers, do not average down.`,
    killSwitchTip: "A kill-switch is a pre-committed exit rule you set BEFORE you own the position — when you are thinking clearly. If Cloud growth falls below 55% for two straight quarters, quarterly FCF stays negative for multiple quarters without a clear conversion path, or a new DOJ structural remedy lands, the thesis is broken: that's demand weakness, a cash-flow problem, or policy risk, not timing. Do not average down into a broken thesis — the market is telling you something. No debate, no rationalisation. Exit.",
    killSwitchTipNote: "Cloud decel below 55% twice running, FCF stays negative for multiple quarters, or a new DOJ structural remedy. Any one. No debate.",
    killSwitchHtml: `<strong style="color:var(--title)">Two consecutive quarters of Cloud growth below 55%, quarterly FCF staying negative for multiple quarters running, or a new DOJ structural remedy on the US case</strong> → exit or reduce. No debate. Do not average down into a broken thesis.`,
    nextCheck: "Next check: Q3 2026 earnings (~Oct 27, 2026)",
    downsideFootnote: (px, peTrough, peBearHi) => `Bear case scenario: Search deceleration or FCF staying negative multiple quarters running. Assumes a multiple compression toward ${peTrough}–${peBearHi}× on roughly flat EPS. Position loss is illustrative at $${px} entry.`,
    multipleSummary: (peNow, loPE, hiPE) => `At ~${peNow}× NTM P/E, GOOGL sits ${peNow < loPE ? "below" : "inside"} its normal range (${loPE}–${hiPE}×) — a real compression from where it traded just before the Q2 2026 print, driven by capex/FCF optics rather than the Cloud/Search beat itself.`,
    peBarTipSuffix: "P/E uses GAAP consensus EPS — Alphabet has clean GAAP earnings without the large intangible-amortization distortions some acquisitive peers carry.",
    deepValueZoneNote: "Historically cheap for this business. Rare — last seen during the Mar 2025 antitrust/AI-fear trough. A real entry window if the thesis holds.",
    dislocPrecedent: (baseFloor) => `Historical precedent: the Jan-Mar 2025 antitrust/AI-fear dislocation resolved within the 380-day base-reversion window when the fundamentals stayed intact. Base floor: $${baseFloor}.`,
    regretHtml: (currentPE) => `Q3 2026 Cloud growth <strong style="color:#3fd07a">holds 60%+ for a second straight quarter</strong> AND quarterly FCF returns to positive. That would confirm Q2's 82% Cloud print and negative-FCF quarter were a real inflection and a temporary air-pocket respectively, not a peak and a structural problem, re-rate the stock from ~${currentPE}× toward the bull zone, and close today's entry window.`,
    regretTip: "Charlie Munger's inversion: instead of asking 'why should I buy?', ask 'what would I have to believe happened, in hindsight, to wish I had bought more?' If Q3 2026 confirms Cloud holding 60%+ and FCF turning positive again, today's entry window will close fast. This question is not about FOMO — it is about sizing correctly for your conviction.",
    chips: [
      { label: "KILL-SWITCH: CLOUD <55% 2Q, OR FCF NEGATIVE MULTIPLE Q → EXIT", col: "#f1564b" },
      { label: "REGRET IF: CLOUD HOLDS 60%+ + FCF TURNS POSITIVE",              col: "#3fd07a" },
      { label: "NEXT CHECK: ~OCT 27, 2026 EARNINGS",                            col: "#2f6dff" },
    ],
    signalFootnote: (ntmEps) => `P/E uses consensus NTM EPS $${ntmEps} — Alphabet has clean GAAP earnings, unlike some peers carrying large intangible-amortization distortions from acquisitions.`,
  },

  past: {
    cardTips: {
      durability: (revCagrPct) => `Looks at Revenue, Gross Margin, and Free Cash Flow over the last 4 fiscal years (Wisesheets' free-tier history cap). We want upward trends that hold through cycles — not spike-and-crash. GOOGL grew revenue at ~${revCagrPct}% CAGR almost entirely organically, with gross margin expanding from 55.4% to 59.7% even as capex intensity roughly doubled.`,
      value: (latestROIC) => `ROIC (Return on Invested Capital) measures how efficiently management deploys capital. Above WACC (~9-10% for a company this size) = value creation. Below = value destruction. GOOGL's ROIC has stayed in a 20-25% band across these 4 years — ${latestROIC}% in 2025 (a dip from 2024's 25.4% as the capex ramp expanded invested capital faster than operating income grew).`,
      capex: (peakCapex, latestCapex, latestFCF) => `Capex as a % of revenue shows how much of every dollar gets reinvested before cash reaches shareholders. Capex/revenue climbed from 11.1% (2022) to ${latestCapex}% (2025) as the AI buildout accelerated — even as FCF held roughly flat at $${latestFCF}B, meaning the capex increase is being funded mostly by operating cash flow growth, not by shrinking free cash flow yet. Q2 2026's negative quarterly FCF is the first sign that relationship is now under real strain.`,
      mood: (evNow, evAvg) => `EV/EBITDA vs its own 4-year average tells you whether the market is paying a premium or discount for this business. Current EV/EBITDA of ${evNow}× sits well above the 4-year average of ~${evAvg}× — the market has been pricing in the Cloud/AI re-rating story, and Q2 2026's capex/FCF reaction is the first real test of whether that premium multiple survives a cash-flow scare.`,
    },
    stats: [
      { html: `Revenue <span style="color:#3fd07a;font-weight:700">$282.8B → $402.8B</span> (4Y)`, tipTitle: "Revenue (4-year)", tipBody: "GOOGL grew annual revenue from $282.8B (2022) to $402.8B (2025) — a ~12.6% CAGR, almost entirely organic. Growth accelerated meaningfully in 2025 as Cloud/AI demand took off." },
      { html: `FCF <span style="color:#3fd07a;font-weight:700">$60.0B → $73.3B</span> (4Y)`, tipTitle: "Free Cash Flow (4-year)", tipBody: "FCF grew from $60.0B (2022) to $73.3B (2025) — a real but much slower growth rate than revenue, as capex intensity roughly doubled (11.1% of revenue in 2022 to 22.7% in 2025). Q2 2026 posted the first-ever negative QUARTERLY FCF as this trend accelerated further." },
      { html: `Price <span style="color:#3fd07a;font-weight:700">+174.9%</span> (Jul 2022 → now)`, tipTitle: "Total price return (since Jul 2022)", tipBody: "From $116.32 (Jul 2022) to $319.74 today = +174.9%. This compounding came from a mix of organic earnings growth and a real multiple re-rating on the Cloud/AI story — not acquisitions. Past returns are anchored to a Cloud growth pace (82% this quarter) that may not repeat every quarter." },
    ],
    verdictBody: "GOOGL has compounded revenue at ~12.6% annually over the last 4 fiscal years, with gross margin expanding through a real capex-intensity increase (11.1%→22.7% of revenue). ROIC has stayed in a healthy 20-25% band. FCF grew more slowly than revenue as the AI buildout accelerated, and Q2 2026 delivered the first quarter where that tension became visible as an actual negative number, not just a ratio. The business has earned a premium multiple on Cloud's growth — the open question is whether FCF re-normalizes within a few quarters or the capex intensity keeps climbing faster than cash generation.",
    banners: {
      durability: (revCagrPct, rev0, rev9, gmDelta, latestGM, fcf0, latestFCF) => `Revenue compounded at ~${revCagrPct}% annually from $${rev0}B (2022) to $${rev9}B (2025) — almost entirely organic. Gross margin expanded ${gmDelta} points to ${latestGM}%, even as capex intensity roughly doubled. FCF grew from $${fcf0}B to $${latestFCF}B — a real but much slower pace than revenue.`,
      value: (latestROIC) => `ROIC of ${latestROIC}% (2025) comfortably exceeds a typical WACC of 9-10% for a company this size, meaning each dollar reinvested still creates more than a dollar of value — though the 2025 figure is a dip from 2024's 25.4% as invested capital grew faster than operating income on the capex ramp. This is the first visible sign of the tension between AI-buildout spend and returns.`,
      capex: (latestCapex, peakCapex, latestFCF, fy26Guide) => `Capex/revenue of ${latestCapex}% (2025) is already the highest in this 4-year window, and the FY2026 guide of $${fy26Guide}B (raised mid-year) implies it climbs further. FCF held at $${latestFCF}B in 2025, but Q2 2026 alone posted -$5.9B — the clearest real-time evidence that capex intensity is now outrunning operating cash flow growth, at least for a quarter. The next few prints are the actual test of whether this reverses.`,
      mood: (evNow, evAvg) => `EV/EBITDA of ${evNow}× sits well above the 4-year average of ${evAvg}× — the multiple has more than doubled since the 2022 rate-hike trough (~12x) as the Cloud/AI buildout re-rated the stock. Q2 2026's capex/FCF reaction pulled the price back below the base floor even as the multiple on trailing numbers stayed elevated — the market questioning the premium multiple for the first time in this window, not yet abandoning it.`,
    },
    revAnnotationsHtml: `<span>2022: <span style="color:var(--tx3)">$282.8B</span> (rate-hike-era growth)</span><span>2025: <span style="color:var(--tx3)">$402.8B</span> (Cloud/AI acceleration)</span>`,
    roicNote: "Green >15% · Amber 5-15% · Red <5% — GOOGL has stayed green every year in this window",
    fcfYieldNote: "Declining yield = stock re-rating higher AND capex intensity rising — both compress the ratio. FCF itself still grew over the window, just much more slowly than revenue.",
    capexAnnotationsHtml: `<span>2022: <span style="color:#3fd07a">11.1%</span> (pre-AI-buildout baseline)</span><span>2025: <span style="color:#f1564b">22.7%</span> (AI/TPU buildout, still climbing)</span>`,
    footnotes: {
      durability: "GOOGL's growth is organic — no major acquisition playbook to adjust for. The 4-year window available (2022-2025, Wisesheets' free-tier cap) captures the 2022 rate-hike-era slowdown through the 2025-2026 Cloud/AI acceleration. Revenue growth itself accelerated in 2025 (+15% to $402.8B) as Cloud demand took off, ahead of Q2 2026's step further to +82% Cloud growth specifically.",
      value: "ROIC has stayed in a 20-25% band across this window, dipping to 21.3% in 2025 as the capex ramp expanded invested capital faster than operating income. FCF yield compression from 5.6% (2022) to 1.9% (2025) reflects both the stock's multiple expanding and capex intensity rising — not weaker underlying cash generation, though Q2 2026's negative quarterly FCF is the first sign that relationship needs to be watched closely, not assumed.",
      capex: "Capex/revenue climbed from 11.1% (2022) to 22.7% (2025) as the AI/TPU buildout accelerated, and the FY2026 guide (raised mid-year to $195-205B) implies it climbs further still. The kill-switch for this panel: if capex/revenue keeps climbing without Cloud revenue/margin keeping pace, or quarterly FCF stays negative for multiple consecutive quarters, the AI buildout has stopped paying for itself fast enough to matter.",
      mood: "The scenario bands on the other tabs use forward P/E, not EV/EBITDA — GOOGL carries real but manageable debt and clean GAAP earnings, so P/E is a fair ruler here. EV/EBITDA is shown purely to track cross-cycle mood, since it's capital-structure-neutral. The multiple bottomed near 12x at the 2022 rate-hike trough — before the AI story existed — and sits at 25.4x on 2025 actuals today, with the AI story fully priced and now facing its first real capex/FCF stress test.",
    },
    priceChartTitle: "GOOGL PRICE · MONTHLY · 2022–2026",
    priceChartSub: "$ per share · dashed lines = key events · window limited to available Wisesheets history",
    priceNowTip: (px, isATH) => `$${px} — where GOOGL trades today, ${isATH ? "also the highest monthly close in this window" : "off the window's high (Apr 2026, $384.80)"}. The chart shows organic compounding through the 2022 rate-hike slowdown and the Jan-Mar 2025 antitrust/AI-fear selloff (-24.2%), then a sustained Cloud-driven re-rating from mid-2025 on, with a capex/FCF-driven pullback in Jul 2026.`,
  ddTip: (minDD) => `${minDD}% — the deepest drop from a prior high in this window, occurring twice: the Dec 2022 rate-hike-era trough and the Mar 2025 antitrust/AI-fear trough (both -24.2%). GOOGL recovered from both and went on to make new highs as Cloud growth accelerated. Drawdown charts help you visualize what holding through a bad period actually felt like.`,
    ddAnnotationsHtml: `<span>Max drawdown: <span style="color:#f1564b">−24.2%</span> (Dec 2022 rate-hike trough, tied with Mar 2025 antitrust/AI-fear trough)</span><span>Current: <span style="color:#e0a83b">−16.9%</span> from the Apr 2026 high (Q2 2026 capex/FCF reaction)</span>`,
  },
};
