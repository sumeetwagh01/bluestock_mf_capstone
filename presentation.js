const pptxgen = require("pptxgenjs");
const fs = require("fs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");

// ── Brand palette ─────────────────────────────────────────────────────────
const C = {
  purple:    "4A31AE",   // primary
  violet:    "6D54DE",   // secondary
  lavender:  "C1B0DF",   // light accent
  orange:    "F5A623",   // logo orange
  dark:      "1E1446",   // near-black
  white:     "FFFFFF",
  offwhite:  "F7F4FF",
  gray:      "64607A",
  lightgray: "EDE9F8",
  green:     "27AE60",
  red:       "E74C3C",
};

// ── Logo base64 ───────────────────────────────────────────────────────────
const logoPath = "./submission/logo int.webp";

// ── Icon helper ───────────────────────────────────────────────────────────
const { FaDatabase, FaChartLine, FaTable, FaRocket, FaSearch,
        FaCheckCircle, FaExclamationTriangle, FaLightbulb, FaGithub,
        FaEnvelope, FaArrowRight, FaTrophy, FaCog, FaUsers, FaMoneyBillWave } = require("react-icons/fa");

async function iconPng(IconComp, color="#FFFFFF", size=256) {
  const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(IconComp, { color, size: String(size) }));
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

// ── Shadow factory ────────────────────────────────────────────────────────
const mkShadow = () => ({ type:"outer", color:"000000", blur:8, offset:3, angle:45, opacity:0.12 });

// ── Helpers ───────────────────────────────────────────────────────────────
function darkSlide(slide) { slide.background = { color: C.dark }; }
function lightSlide(slide) { slide.background = { color: C.offwhite }; }
function whiteSlide(slide) { slide.background = { color: C.white }; }

// Header bar (purple) across top of content slides
function addHeader(slide, title) {
  slide.addShape("rect", { x:0, y:0, w:10, h:0.75, fill:{ color:C.purple } });
  slide.addText(title, {
    x:0.35, y:0, w:9.3, h:0.75, fontSize:22, bold:true,
    color:C.white, valign:"middle", fontFace:"Calibri", margin:0
  });
}

// Footer
function addFooter(slide) {
  slide.addShape("rect", { x:0, y:5.35, w:10, h:0.275, fill:{ color:C.lightgray } });
  slide.addText("Bluestock Fintech Pvt. Ltd.  |  Mutual Fund Analytics Platform  |  June 2026  |  Confidential", {
    x:0, y:5.35, w:10, h:0.275, fontSize:8, color:C.gray,
    align:"center", valign:"middle", fontFace:"Calibri", margin:0
  });
}

// KPI card helper
function kpiCard(slide, x, y, w, h, value, label, bgColor) {
  slide.addShape("roundRect", {
    x, y, w, h, rectRadius:0.08,
    fill:{ color: bgColor || C.lightgray },
    shadow: mkShadow()
  });
  slide.addText(value, { x, y:y+0.06, w, h:h*0.55, fontSize:26, bold:true,
    color:C.purple, align:"center", valign:"middle", fontFace:"Calibri", margin:0 });
  slide.addText(label, { x, y:y+h*0.55, w, h:h*0.4, fontSize:10,
    color:C.gray, align:"center", valign:"middle", fontFace:"Calibri", margin:0 });
}

// Section divider on dark slide
function sectionCard(slide, x, y, w, h, num, title, sub) {
  slide.addShape("roundRect", { x, y, w, h, rectRadius:0.1,
    fill:{ color:C.violet }, shadow:mkShadow() });
  slide.addText(num, { x, y:y+0.08, w, h:0.4, fontSize:18, bold:true,
    color:C.orange, align:"center", fontFace:"Calibri", margin:0 });
  slide.addText(title, { x, y:y+0.44, w, h:0.35, fontSize:12, bold:true,
    color:C.white, align:"center", fontFace:"Calibri", margin:0 });
  slide.addText(sub, { x:x+0.05, y:y+0.76, w:w-0.1, h:0.5, fontSize:9,
    color:C.lavender, align:"center", fontFace:"Calibri", margin:0 });
}

async function buildPPT() {
  const pres = new pptxgen();
  pres.layout  = "LAYOUT_16x9";
  pres.author  = "Sumeet Wagh";
  pres.title   = "Bluestock MF Analytics Platform";

  // ────────────────────────────────────────────────────────────────────────
  // SLIDE 1 — TITLE
  // ────────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide();
    darkSlide(s);

    // top banner
    s.addShape("rect", { x:0, y:0, w:10, h:0.55, fill:{ color:C.purple } });
    s.addText("Capstone Project Report  |  Data Analyst Internship  |  June 2026", {
      x:0, y:0, w:10, h:0.55, fontSize:10, color:C.lavender,
      align:"center", valign:"middle", fontFace:"Calibri", margin:0
    });

    // logo
    // logo
s.addImage({
    path: "./submission/logo int.webp",
    x: 3.2,
    y: 0.7,
    w: 3.6,
    h: 0.46
});

    // title
    s.addText("Mutual Fund Analytics Platform", {
      x:0.5, y:1.42, w:9, h:0.75, fontSize:34, bold:true,
      color:C.white, align:"center", fontFace:"Cambria", margin:0
    });
    s.addText("End-to-End Data Engineering, ETL Pipeline & Interactive Dashboard", {
      x:0.5, y:2.1, w:9, h:0.38, fontSize:13, italic:true,
      color:C.lavender, align:"center", fontFace:"Calibri", margin:0
    });

    // KPI row
    const kpis = [
      ["46,000+","NAV Records"], ["32,778","Transactions"],
      ["40","Fund Schemes"], ["10","Fund Houses"],
      ["7","Days Built"], ["Rs.81L Cr","Industry AUM"]
    ];
    const kW = 1.48, kH = 0.9, kGap = 0.06, kX0 = 0.27, kY = 2.68;
    kpis.forEach(([v,l], i) => {
      const x = kX0 + i*(kW+kGap);
      s.addShape("roundRect", { x, y:kY, w:kW, h:kH, rectRadius:0.08,
        fill:{ color:C.violet, transparency:30 }, shadow:mkShadow() });
      s.addText(v, { x, y:kY+0.06, w:kW, h:0.48, fontSize:20, bold:true,
        color:C.orange, align:"center", fontFace:"Calibri", margin:0 });
      s.addText(l, { x, y:kY+0.52, w:kW, h:0.3, fontSize:9,
        color:C.lavender, align:"center", fontFace:"Calibri", margin:0 });
    });

    // author block
    s.addText("Prepared by", { x:0.5, y:3.78, w:9, h:0.28, fontSize:11,
      color:C.gray, align:"center", fontFace:"Calibri", margin:0 });
    s.addText("Sumeet Wagh", { x:0.5, y:4.02, w:9, h:0.52, fontSize:28, bold:true,
      color:C.white, align:"center", fontFace:"Cambria", margin:0 });
    s.addText("Data Analyst Intern  •  Bluestock Fintech Pvt. Ltd.  •  June 2026", {
      x:0.5, y:4.5, w:9, h:0.28, fontSize:11,
      color:C.lavender, align:"center", fontFace:"Calibri", margin:0
    });

    // bottom bar
    s.addShape("rect", { x:0, y:5.35, w:10, h:0.275, fill:{ color:C.purple } });
    s.addText("Confidential — For Internal Use Only   •   bluestock.in", {
      x:0, y:5.35, w:10, h:0.275, fontSize:9, bold:true,
      color:C.lavender, align:"center", valign:"middle", fontFace:"Calibri", margin:0
    });

    s.addNotes("Welcome everyone. Today I'll walk you through the Bluestock Mutual Fund Analytics Platform — a 7-day capstone project covering 40 fund schemes, 46,000+ NAV records, and a full 4-page Power BI dashboard.");
  }

  // ────────────────────────────────────────────────────────────────────────
  // SLIDE 2 — PROBLEM & OBJECTIVE
  // ────────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide();
    whiteSlide(s);
    addHeader(s, "2  |  Problem Statement & Objectives");
    addFooter(s);

    // Left col — 5 Problems
    s.addText("5 Core Business Problems", {
      x:0.35, y:0.88, w:4.5, h:0.35, fontSize:13, bold:true,
      color:C.purple, fontFace:"Calibri", margin:0
    });

    const problems = [
      ["P1","Data Fragmentation","NAV, AUM, SIP data scattered across formats"],
      ["P2","Performance Gap","No easy risk-adjusted fund comparison"],
      ["P3","No Benchmark Track","Investors unaware if fund beats benchmark"],
      ["P4","Investor Blind Spot","No visibility into demographic patterns"],
      ["P5","Slow Static Reports","Monthly reports take days to prepare"],
    ];
    problems.forEach(([id, title, desc], i) => {
      const y = 1.3 + i*0.78;
      s.addShape("roundRect", { x:0.35, y, w:4.5, h:0.68, rectRadius:0.07,
        fill:{ color:C.lightgray }, shadow:mkShadow() });
      s.addText(id, { x:0.35, y, w:0.52, h:0.68, fontSize:11, bold:true,
        color:C.white, align:"center", valign:"middle", fontFace:"Calibri", margin:0,
        fill:{ color:C.purple } });
      s.addText(title, { x:0.92, y:y+0.05, w:3.88, h:0.26, fontSize:11, bold:true,
        color:C.dark, fontFace:"Calibri", margin:0 });
      s.addText(desc, { x:0.92, y:y+0.3, w:3.88, h:0.28, fontSize:9,
        color:C.gray, fontFace:"Calibri", margin:0 });
    });

    // Right col — 8 Objectives
    s.addText("8 Project Objectives", {
      x:5.1, y:0.88, w:4.55, h:0.35, fontSize:13, bold:true,
      color:C.purple, fontFace:"Calibri", margin:0
    });

    const objs = [
      "Build automated ETL pipeline (mfapi.in REST API)",
      "Design 5-table SQLite star schema",
      "Generate 9 EDA charts with insights",
      "Compute 7 risk-adjusted performance metrics",
      "Build composite Fund Scorecard (0–100)",
      "Develop 4-page Power BI interactive dashboard",
      "Build VaR/CVaR risk model & fund recommender",
      "Deliver 15–20 page report + 12-slide deck",
    ];
    objs.forEach((txt, i) => {
      const y = 1.3 + i * 0.485;
      s.addShape("roundRect", { x:5.1, y, w:4.55, h:0.4, rectRadius:0.06,
        fill:{ color: i%2===0 ? C.lightgray : C.white }, shadow:mkShadow() });
      s.addText(`O${i+1}`, { x:5.1, y, w:0.38, h:0.4, fontSize:9, bold:true,
        color:C.white, align:"center", valign:"middle", fontFace:"Calibri", margin:0,
        fill:{ color:C.violet } });
      s.addText(txt, { x:5.52, y:y+0.01, w:4.08, h:0.38, fontSize:9.5,
        color:C.dark, valign:"middle", fontFace:"Calibri", margin:4 });
    });

    s.addNotes("India's MF industry manages Rs.81 lakh crore in AUM across 26 crore folios — yet individual investors lack tools for data-driven decisions. This project addresses 5 core problems through 8 measurable objectives.");
  }

  // ────────────────────────────────────────────────────────────────────────
  // SLIDE 3 — DATA SOURCES
  // ────────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide();
    whiteSlide(s);
    addHeader(s, "3  |  Data Sources & Datasets");
    addFooter(s);

    s.addText("10 datasets · 87,000+ total rows · All publicly available sources", {
      x:0.35, y:0.85, w:9.3, h:0.3, fontSize:11, italic:true,
      color:C.gray, fontFace:"Calibri", margin:0
    });

    const rows = [
      [{ text:"#", options:{bold:true, color:C.white} },
       { text:"File", options:{bold:true, color:C.white} },
       { text:"Rows", options:{bold:true, color:C.white} },
       { text:"Description", options:{bold:true, color:C.white} },
       { text:"Source", options:{bold:true, color:C.white} }],
      ["01","fund_master.csv","40","40 real MF schemes — AMFI codes, expense ratio, risk grade","AMFI India"],
      ["02","nav_history.csv","46,000","Daily NAV Jan 2022–May 2026 for all 40 schemes","mfapi.in"],
      ["03","aum_by_fund_house.csv","~90","Quarterly AUM for 10 fund houses 2022–2025","AMFI Quarterly"],
      ["04","monthly_sip_inflows.csv","48","Month-wise SIP inflow, accounts, AUM — 2022–2025","AMFI Monthly"],
      ["05","category_inflows.csv","~144","Net inflows by fund category — FY 2024-25","AMFI India"],
      ["06","industry_folio_count.csv","21","Total MF folios by type — Equity, Debt, Hybrid","AMFI India"],
      ["07","scheme_performance.csv","40","1yr/3yr/5yr returns, Sharpe, Sortino, Alpha, Beta","Computed"],
      ["08","investor_transactions.csv","32,778","SIP + Lumpsum + Redemption — 5,000 investors","Simulated"],
      ["09","portfolio_holdings.csv","~320","Top equity holdings per fund as of Dec 2025","AMFI India"],
      ["10","benchmark_indices.csv","~8,000","Daily Nifty 50, Nifty 100, BSE SmallCap values","NSE/BSE"],
    ];

    const tableData = rows.map((row, ri) => row.map((cell, ci) => {
      const isHeader = ri === 0;
      const isAlt = ri % 2 === 0 && !isHeader;
      const opts = {
        fill: { color: isHeader ? C.purple : (isAlt ? C.lightgray : C.white) },
        color: isHeader ? C.white : C.dark,
        fontSize: isHeader ? 10 : 9,
        bold: isHeader,
        fontFace: "Calibri",
        margin: [3, 5, 3, 5],
        valign: "middle",
      };
      const txt = typeof cell === "object" ? cell.text : cell;
      const extra = typeof cell === "object" ? cell.options : {};
      return { text: txt, options: { ...opts, ...extra } };
    }));

    s.addTable(tableData, {
      x:0.35, y:1.15, w:9.3, h:4.1,
      colW:[0.35, 2.2, 0.7, 3.65, 1.5],
      border:{ pt:0.5, color:C.lavender },
      autoPage:false,
    });

    s.addNotes("All data sourced from public APIs and AMFI India — no proprietary data used. The investor transaction dataset is synthetically generated for privacy.");
  }

  // ────────────────────────────────────────────────────────────────────────
  // SLIDE 4 — SYSTEM ARCHITECTURE
  // ────────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide();
    darkSlide(s);
    addHeader(s, "4  |  System Architecture & ETL Pipeline");

    s.addText("5-Layer Data Engineering Architecture — Extract → Transform → Load → Analyse → Visualise", {
      x:0.35, y:0.85, w:9.3, h:0.28, fontSize:10, italic:true,
      color:C.lavender, fontFace:"Calibri", margin:0
    });

    // ETL layers
    const layers = [
      ["L1","EXTRACT","requests, mfapi.in REST API, AMFI CSV","10 raw CSV files + live NAV JSON", C.orange],
      ["L2","TRANSFORM","Python, Pandas — clean, reshape, forward-fill","10 cleaned CSVs in data/processed/", C.violet],
      ["L3","LOAD","SQLite, SQLAlchemy — star schema, indexes","bluestock_mf.db (5 tables, 80K+ rows)", "27AE60"],
      ["L4","ANALYSE","Jupyter, NumPy, SciPy — metrics, EDA","9 charts, 7 metrics, 5 advanced models", "E67E22"],
      ["L5","VISUALISE","Power BI Desktop — 4 pages, slicers, drill-through","bluestock_mf_dashboard.pbix", C.purple],
    ];

    layers.forEach(([id, name, tools, output, color], i) => {
      const y = 1.22 + i * 0.72;
      // layer card
      s.addShape("roundRect", { x:0.35, y, w:9.3, h:0.62, rectRadius:0.07,
        fill:{ color:C.dark }, shadow:mkShadow() });
      // color label
      s.addShape("roundRect", { x:0.35, y, w:0.72, h:0.62, rectRadius:0.07,
        fill:{ color:color } });
      s.addText(id, { x:0.35, y, w:0.72, h:0.32, fontSize:12, bold:true,
        color:C.white, align:"center", valign:"bottom", fontFace:"Calibri", margin:0 });
      s.addText(name, { x:0.35, y:y+0.3, w:0.72, h:0.3, fontSize:8,
        color:C.white, align:"center", fontFace:"Calibri", margin:0 });
      // tools
      s.addText("Tools:", { x:1.18, y:y+0.06, w:0.7, h:0.22, fontSize:8, bold:true,
        color:color, fontFace:"Calibri", margin:0 });
      s.addText(tools, { x:1.85, y:y+0.06, w:4.1, h:0.22, fontSize:9,
        color:C.white, fontFace:"Calibri", margin:0 });
      // arrow
      s.addShape("rect", { x:6.05, y:y+0.27, w:0.3, h:0.08, fill:{ color:C.lavender } });
      // output
      s.addText("Output:", { x:6.45, y:y+0.06, w:0.72, h:0.22, fontSize:8, bold:true,
        color:color, fontFace:"Calibri", margin:0 });
      s.addText(output, { x:7.15, y:y+0.06, w:2.45, h:0.22, fontSize:9,
        color:C.lavender, fontFace:"Calibri", margin:0 });

      // connecting arrow between layers
      if (i < 4) {
        s.addShape("rect", { x:4.7, y:y+0.62, w:0.08, h:0.1, fill:{ color:C.lavender } });
      }
    });

    // Star schema mini-table (right inset)
    s.addShape("roundRect", { x:0.35, y:4.88, w:9.3, h:0.28, rectRadius:0.05,
      fill:{ color:C.purple } });
    s.addText("Database Star Schema:  dim_fund (40)  •  dim_date (1,500)  •  fact_nav (46,000)  •  fact_transactions (32,778)  •  fact_performance (40)", {
      x:0.35, y:4.88, w:9.3, h:0.28, fontSize:9, color:C.white,
      align:"center", valign:"middle", fontFace:"Calibri", margin:0
    });

    addFooter(s);
    s.addNotes("The 5-layer architecture mirrors real fintech pipelines used at Zerodha and Groww. Layer L3 stores 80K+ rows in a normalised SQLite star schema — structured for future migration to PostgreSQL.");
  }

  // ────────────────────────────────────────────────────────────────────────
  // SLIDE 5 — EDA PART 1
  // ────────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide();
    whiteSlide(s);
    addHeader(s, "5  |  EDA Highlights — NAV Trends & SIP Growth");
    addFooter(s);

    s.addText("9 publication-quality charts produced using Plotly, Seaborn & Matplotlib", {
      x:0.35, y:0.85, w:9.3, h:0.28, fontSize:10, italic:true,
      color:C.gray, fontFace:"Calibri", margin:0
    });

    // Image placeholder boxes for charts
    const chartH = 2.6;
    // Left chart placeholder
    s.addShape("roundRect", { x:0.35, y:1.2, w:4.55, h:chartH, rectRadius:0.1,
      fill:{ color:C.lightgray }, shadow:mkShadow() });
    s.addText("📊", { x:0.35, y:1.2, w:4.55, h:0.5, fontSize:22,
      align:"center", valign:"middle", margin:0 });
    s.addText("Chart 1: NAV Trend — All 40 Schemes (2022–2026)", {
      x:0.45, y:1.66, w:4.35, h:0.3, fontSize:10, bold:true,
      color:C.purple, align:"center", fontFace:"Calibri", margin:0
    });
    s.addText("[ ADD YOUR NAV TREND CHART IMAGE HERE ]", {
      x:0.45, y:1.96, w:4.35, h:0.48, fontSize:9, italic:true,
      color:C.lavender, align:"center", fontFace:"Calibri", margin:0
    });
    s.addShape("roundRect", { x:0.45, y:2.44, w:4.35, h:1.28, rectRadius:0.07,
      fill:{ color:C.white }, shadow:mkShadow() });
    s.addText([
      { text:"Key Insight:\n", options:{ bold:true, color:C.purple, breakLine:false } },
      { text:"All 40 NAVs grew 2x–3x over 4 years. 2023 bull run drove 15–22% gains. Oct–Nov 2024 correction was brief at ~7%." , options:{ color:C.dark } }
    ], { x:0.55, y:2.52, w:4.15, h:1.12, fontSize:9.5, fontFace:"Calibri", valign:"middle", margin:6 });

    // Right chart placeholder
    s.addShape("roundRect", { x:5.1, y:1.2, w:4.55, h:chartH, rectRadius:0.1,
      fill:{ color:C.lightgray }, shadow:mkShadow() });
    s.addText("📈", { x:5.1, y:1.2, w:4.55, h:0.5, fontSize:22,
      align:"center", valign:"middle", margin:0 });
    s.addText("Chart 3: Monthly SIP Inflow Trend (2022–2025)", {
      x:5.2, y:1.66, w:4.35, h:0.3, fontSize:10, bold:true,
      color:C.purple, align:"center", fontFace:"Calibri", margin:0
    });
    s.addText("[ ADD YOUR SIP INFLOW CHART IMAGE HERE ]", {
      x:5.2, y:1.96, w:4.35, h:0.48, fontSize:9, italic:true,
      color:C.lavender, align:"center", fontFace:"Calibri", margin:0
    });
    s.addShape("roundRect", { x:5.2, y:2.44, w:4.35, h:1.28, rectRadius:0.07,
      fill:{ color:C.white }, shadow:mkShadow() });
    s.addText([
      { text:"Key Insight:\n", options:{ bold:true, color:C.purple, breakLine:false } },
      { text:"SIP inflows tripled from Rs.11,000 Cr to Rs.31,002 Cr — structural retail savings behaviour, not a cyclical spike.", options:{ color:C.dark } }
    ], { x:5.3, y:2.52, w:4.15, h:1.12, fontSize:9.5, fontFace:"Calibri", valign:"middle", margin:6 });

    s.addNotes("Charts 1 and 3 from Day 3 EDA. NAV chart shows all 40 fund trajectories; SIP trend confirms India's mutual fund story is structural and long-term.");
  }

  // ────────────────────────────────────────────────────────────────────────
  // SLIDE 6 — EDA PART 2
  // ────────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide();
    whiteSlide(s);
    addHeader(s, "6  |  EDA Highlights — Demographics & Geography");
    addFooter(s);

    // 4 insight cards in a 2x2 grid
    const insights = [
      { num:"Chart 5", title:"Investor Age Demographics",
        placeholder:"[ ADD AGE DEMOGRAPHICS CHART ]",
        insight:"26–35 age group has most investors. But 46–55 cohort invests highest median SIP at Rs.12,000/mo — wealth concentration in experienced investors." },
      { num:"Chart 6", title:"Geographic Distribution",
        placeholder:"[ ADD GEO DISTRIBUTION CHART ]",
        insight:"72% of SIP value from T30 cities. Maharashtra alone contributes 20%+. B30 share growing at 28% as AMFI commission incentives kick in." },
      { num:"Chart 7", title:"Folio Count Growth",
        placeholder:"[ ADD FOLIO GROWTH CHART ]",
        insight:"Folios doubled from 13.26 Cr to 26.12 Cr in 4 years — 18.5% CAGR. Driven by Zerodha Coin, Groww, Paytm Money democratising access." },
      { num:"Chart 8", title:"NAV Return Correlation Matrix",
        placeholder:"[ ADD CORRELATION HEATMAP ]",
        insight:"Large Cap funds correlate at 0.85–0.95. Holding SBI Bluechip + HDFC Top 100 + ICICI Bluechip gives almost zero diversification benefit." },
    ];

    insights.forEach(({ num, title, placeholder, insight }, i) => {
      const col = i % 2, row = Math.floor(i / 2);
      const x = col === 0 ? 0.35 : 5.1;
      const y = row === 0 ? 0.9 : 3.1;
      const w = 4.55, h = 2.05;

      s.addShape("roundRect", { x, y, w, h, rectRadius:0.08,
        fill:{ color:C.lightgray }, shadow:mkShadow() });
      s.addText(num + ": " + title, { x:x+0.1, y:y+0.06, w:w-0.2, h:0.26,
        fontSize:10, bold:true, color:C.purple, fontFace:"Calibri", margin:0 });
      s.addShape("roundRect", { x:x+0.1, y:y+0.32, w:w-0.2, h:0.78, rectRadius:0.05,
        fill:{ color:"E8E2F6" } });
      s.addText(placeholder, { x:x+0.1, y:y+0.32, w:w-0.2, h:0.78, fontSize:8,
        italic:true, color:C.lavender, align:"center", valign:"middle",
        fontFace:"Calibri", margin:0 });
      s.addText(insight, { x:x+0.1, y:y+1.12, w:w-0.2, h:0.82, fontSize:8.5,
        color:C.dark, fontFace:"Calibri", valign:"top", margin:4 });
    });

    s.addNotes("Demographics and geographic data reveal two key business opportunities: targeting B30 cities for growth, and the 46–55 age segment for high-value SIP retention.");
  }

  // ────────────────────────────────────────────────────────────────────────
  // SLIDE 7 — PERFORMANCE METRICS PART 1
  // ────────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide();
    whiteSlide(s);
    addHeader(s, "7  |  Performance Metrics — Fund Scorecard");
    addFooter(s);

    // Metrics formula table
    s.addText("7 Risk-Adjusted Metrics Computed from 46,000+ Daily NAV Records", {
      x:0.35, y:0.85, w:5.5, h:0.28, fontSize:10, bold:true,
      color:C.purple, fontFace:"Calibri", margin:0
    });

    const metricRows = [
      [{ text:"Metric", options:{bold:true, color:C.white} },
       { text:"Formula / Method", options:{bold:true, color:C.white} },
       { text:"Purpose", options:{bold:true, color:C.white} }],
      ["Daily Return","navₜ / navₜ₋₁ − 1","Base metric for all calculations"],
      ["CAGR","(NAVₑₙd/NAVₛₜₐᵣₜ)^(1/n) − 1","Annualised return over 1/3/5 years"],
      ["Sharpe Ratio","(Rp − Rf) / σp × √252,  Rf = 6.5%","Risk-adjusted return vs RBI rate"],
      ["Sortino Ratio","(Rp − Rf) / σdown × √252","Penalises only downside volatility"],
      ["Alpha","OLS intercept × 252  (vs Nifty 100)","Excess return above benchmark"],
      ["Beta","OLS slope  (fund vs Nifty 100)","Market sensitivity (1.0 = market)"],
      ["Max Drawdown","min(NAV / running_max_NAV − 1)","Worst peak-to-trough loss"],
    ];

    const mTableData = metricRows.map((row, ri) => row.map((cell) => {
      const isHeader = ri === 0;
      const isAlt = ri % 2 === 0 && !isHeader;
      return {
        text: typeof cell === "object" ? cell.text : cell,
        options: {
          fill:{ color: isHeader ? C.purple : (isAlt ? C.lightgray : C.white) },
          color: isHeader ? C.white : C.dark,
          fontSize: isHeader ? 9 : 8.5,
          bold: isHeader,
          fontFace:"Calibri",
          margin:[3,5,3,5],
          valign:"middle",
          ...(typeof cell === "object" ? cell.options : {})
        }
      };
    }));

    s.addTable(mTableData, {
      x:0.35, y:1.18, w:5.55, h:3.2,
      colW:[1.5, 2.7, 1.35],
      border:{ pt:0.5, color:C.lavender }
    });

    // Right: scorecard weights
    s.addText("Fund Scorecard Weights (0–100)", {
      x:6.1, y:0.85, w:3.55, h:0.28, fontSize:10, bold:true,
      color:C.purple, fontFace:"Calibri", margin:0
    });

    const weights = [
      ["3yr CAGR","30%"],
      ["Sharpe Ratio","25%"],
      ["Alpha","20%"],
      ["Expense Ratio","15%"],
      ["Max Drawdown","10%"],
    ];
    const barColors = [C.purple, C.violet, "9B59B6", C.orange, "E74C3C"];

    weights.forEach(([label, pct], i) => {
      const y = 1.18 + i * 0.56;
      const barW = parseFloat(pct) / 100 * 3.3;
      s.addText(label, { x:6.1, y, w:3.55, h:0.24, fontSize:9.5, bold:true,
        color:C.dark, fontFace:"Calibri", margin:0 });
      s.addShape("roundRect", { x:6.1, y:y+0.24, w:3.3, h:0.2, rectRadius:0.04,
        fill:{ color:C.lightgray } });
      s.addShape("roundRect", { x:6.1, y:y+0.24, w:barW, h:0.2, rectRadius:0.04,
        fill:{ color:barColors[i] } });
      s.addText(pct, { x:6.1+barW+0.05, y:y+0.22, w:0.5, h:0.24, fontSize:9, bold:true,
        color:barColors[i], fontFace:"Calibri", margin:0 });
    });

    // Composite score callout
    s.addShape("roundRect", { x:6.1, y:4.12, w:3.55, h:0.78, rectRadius:0.09,
      fill:{ color:C.purple }, shadow:mkShadow() });
    s.addText("Composite Scorecard", {
      x:6.1, y:4.14, w:3.55, h:0.26, fontSize:10, bold:true,
      color:C.orange, align:"center", fontFace:"Calibri", margin:0
    });
    s.addText("Weighted rank across 5 metrics → single 0–100 score for every fund scheme", {
      x:6.15, y:4.38, w:3.45, h:0.44, fontSize:8.5,
      color:C.lavender, align:"center", fontFace:"Calibri", margin:4
    });

    addFooter(s);
    s.addNotes("The Fund Scorecard aggregates 5 dimensions into one 0-100 score. This allows direct comparison across very different fund types. CAGR is highest-weighted at 30% as it is most relevant to retail investors.");
  }

  // ────────────────────────────────────────────────────────────────────────
  // SLIDE 8 — PERFORMANCE METRICS PART 2
  // ────────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide();
    whiteSlide(s);
    addHeader(s, "8  |  Benchmark Comparison & Risk Findings");
    addFooter(s);

    // Left: benchmark chart placeholder
    s.addShape("roundRect", { x:0.35, y:0.9, w:4.8, h:3.05, rectRadius:0.1,
      fill:{ color:C.lightgray }, shadow:mkShadow() });
    s.addText("Chart 8: Benchmark Comparison", {
      x:0.45, y:0.96, w:4.6, h:0.3, fontSize:10, bold:true,
      color:C.purple, align:"center", fontFace:"Calibri", margin:0
    });
    s.addText("[ ADD NAV vs BENCHMARK COMPARISON CHART\nOR SCORECARD TOP-10 TABLE IMAGE HERE ]", {
      x:0.45, y:1.26, w:4.6, h:2.6, fontSize:9, italic:true,
      color:C.lavender, align:"center", valign:"middle", fontFace:"Calibri", margin:0
    });

    // Right: key risk findings as cards
    s.addText("Key Risk Findings", {
      x:5.35, y:0.9, w:4.3, h:0.3, fontSize:12, bold:true,
      color:C.purple, fontFace:"Calibri", margin:0
    });

    const findings = [
      { label:"Sharpe Range", val:"0.62 – 1.89", note:"Higher = better risk-adjusted return", color:C.green },
      { label:"Alpha Range", val:"-4.2% to +8.7%", note:"Positive = beats Nifty 100 benchmark", color:C.violet },
      { label:"Beta Range", val:"0.71 – 1.35", note:"<1 = less volatile than market", color:C.orange },
      { label:"Max Drawdown", val:"-18% to -42%", note:"Small Cap worst in Oct–Nov 2024", color:"E74C3C" },
    ];

    findings.forEach(({ label, val, note, color }, i) => {
      const y = 1.28 + i * 0.74;
      s.addShape("roundRect", { x:5.35, y, w:4.3, h:0.62, rectRadius:0.07,
        fill:{ color:C.lightgray }, shadow:mkShadow() });
      s.addText(label + ":", { x:5.45, y:y+0.07, w:2.0, h:0.24, fontSize:9, bold:true,
        color:C.dark, fontFace:"Calibri", margin:0 });
      s.addText(val, { x:7.4, y:y+0.05, w:2.15, h:0.28, fontSize:14, bold:true,
        color:color, align:"right", fontFace:"Calibri", margin:0 });
      s.addText(note, { x:5.45, y:y+0.33, w:4.1, h:0.22, fontSize:8.5,
        color:C.gray, fontFace:"Calibri", margin:0 });
    });

    // Bottom: VaR callout
    s.addShape("roundRect", { x:0.35, y:4.1, w:9.3, h:0.72, rectRadius:0.08,
      fill:{ color:C.dark }, shadow:mkShadow() });
    s.addText([
      { text:"Historical VaR (95%): ", options:{ bold:true, color:C.orange } },
      { text:"Small Cap: −2.1% to −2.8% daily  •  ", options:{ color:C.white } },
      { text:"Large Cap: −1.3% to −1.6% daily  •  ", options:{ color:C.white } },
      { text:"CVaR is 1.3–1.5× worse than VaR — fat tail risk persists in mid/small cap funds", options:{ color:C.lavender } }
    ], { x:0.45, y:4.12, w:9.1, h:0.66, fontSize:9.5, valign:"middle", fontFace:"Calibri", margin:6 });

    addFooter(s);
    s.addNotes("Day 4 analysis revealed that Small Cap funds carry significantly higher tail risk — VaR of 2.8% per day is nearly 2x that of Large Cap. The alpha range shows some funds genuinely outperform the Nifty 100 benchmark.");
  }

  // ────────────────────────────────────────────────────────────────────────
  // SLIDE 9 — DASHBOARD SCREENSHOTS PART 1
  // ────────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide();
    darkSlide(s);
    addHeader(s, "9  |  Power BI Dashboard — Page 1 & 2");

    s.addText("4-page interactive dashboard · Cross-filterable · Drill-through enabled · Bluestock brand theme", {
      x:0.35, y:0.85, w:9.3, h:0.28, fontSize:10, italic:true,
      color:C.lavender, fontFace:"Calibri", margin:0
    });

    // Page 1 placeholder
    s.addShape("roundRect", { x:0.35, y:1.18, w:4.6, h:2.85, rectRadius:0.1,
      fill:{ color:"2A1F5A" }, shadow:mkShadow() });
    s.addShape("roundRect", { x:0.35, y:1.18, w:4.6, h:0.32, rectRadius:0.08,
      fill:{ color:C.purple } });
    s.addText("Page 1: Industry Overview", {
      x:0.45, y:1.18, w:4.4, h:0.32, fontSize:10, bold:true,
      color:C.white, valign:"middle", fontFace:"Calibri", margin:0
    });
    s.addText("[ ADD DASHBOARD PAGE 1 SCREENSHOT HERE ]", {
      x:0.45, y:1.52, w:4.4, h:2.45, fontSize:9, italic:true,
      color:C.lavender, align:"center", valign:"middle", fontFace:"Calibri", margin:0
    });
    s.addText("Slicer: Year", {
      x:0.45, y:3.96, w:1.2, h:0.22, fontSize:8,
      color:C.orange, fontFace:"Calibri", margin:0
    });
    s.addText("4 KPI cards  •  AUM trend line  •  AUM by AMC bar  •  Market share donut", {
      x:1.65, y:3.96, w:3.2, h:0.22, fontSize:7.5,
      color:C.lavender, fontFace:"Calibri", margin:0
    });

    // Page 2 placeholder
    s.addShape("roundRect", { x:5.15, y:1.18, w:4.6, h:2.85, rectRadius:0.1,
      fill:{ color:"2A1F5A" }, shadow:mkShadow() });
    s.addShape("roundRect", { x:5.15, y:1.18, w:4.6, h:0.32, rectRadius:0.08,
      fill:{ color:C.purple } });
    s.addText("Page 2: Fund Performance", {
      x:5.25, y:1.18, w:4.4, h:0.32, fontSize:10, bold:true,
      color:C.white, valign:"middle", fontFace:"Calibri", margin:0
    });
    s.addText("[ ADD DASHBOARD PAGE 2 SCREENSHOT HERE ]", {
      x:5.25, y:1.52, w:4.4, h:2.45, fontSize:9, italic:true,
      color:C.lavender, align:"center", valign:"middle", fontFace:"Calibri", margin:0
    });
    s.addText("Slicers: Fund House, Category, Plan", {
      x:5.25, y:3.96, w:2.2, h:0.22, fontSize:8,
      color:C.orange, fontFace:"Calibri", margin:0
    });
    s.addText("Risk vs Return scatter  •  Scorecard table  •  NAV line chart", {
      x:7.45, y:3.96, w:2.25, h:0.22, fontSize:7.5,
      color:C.lavender, fontFace:"Calibri", margin:0
    });

    // Drill-through callout
    s.addShape("roundRect", { x:0.35, y:4.3, w:9.3, h:0.68, rectRadius:0.07,
      fill:{ color:C.violet, transparency:60 }, shadow:mkShadow() });
    s.addText([
      { text:"✦  Drill-Through: ", options:{ bold:true, color:C.orange } },
      { text:"Right-click any fund name in Page 2 table → ", options:{ color:C.white } },
      { text:"Drill through → Nav_Detail  ", options:{ bold:true, color:C.orange } },
      { text:"→ opens fund-specific NAV trend + metrics page filtered automatically", options:{ color:C.lavender } }
    ], { x:0.45, y:4.32, w:9.1, h:0.62, fontSize:9.5, valign:"middle", fontFace:"Calibri", margin:6 });

    addFooter(s);
    s.addNotes("Pages 1 and 2 are the core analytical views. The drill-through from Page 2 to Nav_Detail page is the showcase interactivity feature — it filters all visuals on the detail page to a single fund.");
  }

  // ────────────────────────────────────────────────────────────────────────
  // SLIDE 10 — DASHBOARD SCREENSHOTS PART 2
  // ────────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide();
    darkSlide(s);
    addHeader(s, "10  |  Power BI Dashboard — Page 3 & 4");

    // Page 3 placeholder
    s.addShape("roundRect", { x:0.35, y:0.9, w:4.6, h:2.85, rectRadius:0.1,
      fill:{ color:"2A1F5A" }, shadow:mkShadow() });
    s.addShape("roundRect", { x:0.35, y:0.9, w:4.6, h:0.32, rectRadius:0.08,
      fill:{ color:C.purple } });
    s.addText("Page 3: Investor Analytics", {
      x:0.45, y:0.9, w:4.4, h:0.32, fontSize:10, bold:true,
      color:C.white, valign:"middle", fontFace:"Calibri", margin:0
    });
    s.addText("[ ADD DASHBOARD PAGE 3 SCREENSHOT HERE ]", {
      x:0.45, y:1.24, w:4.4, h:2.44, fontSize:9, italic:true,
      color:C.lavender, align:"center", valign:"middle", fontFace:"Calibri", margin:0
    });
    s.addText("Slicers: State, Age Group, City Tier", {
      x:0.45, y:3.68, w:2.2, h:0.22, fontSize:8,
      color:C.orange, fontFace:"Calibri", margin:0
    });
    s.addText("SIP by state  •  SIP/Lump/Redemption donut  •  Age group bar  •  Volume line", {
      x:2.65, y:3.68, w:2.25, h:0.22, fontSize:7.5,
      color:C.lavender, fontFace:"Calibri", margin:0
    });

    // Page 4 placeholder
    s.addShape("roundRect", { x:5.15, y:0.9, w:4.6, h:2.85, rectRadius:0.1,
      fill:{ color:"2A1F5A" }, shadow:mkShadow() });
    s.addShape("roundRect", { x:5.15, y:0.9, w:4.6, h:0.32, rectRadius:0.08,
      fill:{ color:C.purple } });
    s.addText("Page 4: SIP & Market Trends", {
      x:5.25, y:0.9, w:4.4, h:0.32, fontSize:10, bold:true,
      color:C.white, valign:"middle", fontFace:"Calibri", margin:0
    });
    s.addText("[ ADD DASHBOARD PAGE 4 SCREENSHOT HERE ]", {
      x:5.25, y:1.24, w:4.4, h:2.44, fontSize:9, italic:true,
      color:C.lavender, align:"center", valign:"middle", fontFace:"Calibri", margin:0
    });
    s.addText("No slicer (full-period view)", {
      x:5.25, y:3.68, w:2.2, h:0.22, fontSize:8,
      color:C.orange, fontFace:"Calibri", margin:0
    });
    s.addText("SIP inflow bar + Nifty 50 dual-axis  •  Category heatmap  •  Top 5 bar", {
      x:7.45, y:3.68, w:2.25, h:0.22, fontSize:7.5,
      color:C.lavender, fontFace:"Calibri", margin:0
    });

    // Dashboard KPI strip
    s.addShape("roundRect", { x:0.35, y:4.0, w:9.3, h:0.24, rectRadius:0.04,
      fill:{ color:C.purple } });
    s.addText("KPI Cards:  Rs.81L Cr Total AUM  •  Rs.31K Cr SIP Inflow  •  26.12 Cr Folios  •  1,908 Schemes  •  9.35 Cr Active SIP A/Cs", {
      x:0.35, y:4.0, w:9.3, h:0.24, fontSize:8, color:C.white,
      align:"center", valign:"middle", fontFace:"Calibri", margin:0
    });

    // Dashboard features grid
    const feats = [
      ["Cross-Filtering","Click any visual to filter all others on the page"],
      ["Tooltips","Hover any chart point → scheme name, Sharpe, Alpha, AUM"],
      ["Drill-Through","Right-click fund → Nav_Detail page filtered to that fund"],
      ["Slicers","Fund House / Category / Plan / State / Age / City Tier"],
    ];
    feats.forEach(([title, desc], i) => {
      const x = (i % 2) === 0 ? 0.35 : 5.1;
      const y = i < 2 ? 4.34 : 4.84;
      const w = 4.55;
      s.addShape("roundRect", { x, y, w, h:0.42, rectRadius:0.06,
        fill:{ color:C.violet, transparency:70 } });
      s.addText(title + ": ", { x:x+0.1, y:y+0.04, w:1.4, h:0.34, fontSize:8.5, bold:true,
        color:C.orange, valign:"middle", fontFace:"Calibri", margin:0 });
      s.addText(desc, { x:x+1.45, y:y+0.04, w:w-1.55, h:0.34, fontSize:8,
        color:C.lavender, valign:"middle", fontFace:"Calibri", margin:0 });
    });

    addFooter(s);
    s.addNotes("Pages 3 and 4 focus on investor behaviour and macro market trends. The cross-filtering means every click is interactive — selecting Maharashtra in Page 3 instantly filters age, transaction type, and volume for that state.");
  }

  // ────────────────────────────────────────────────────────────────────────
  // SLIDE 11 — KEY FINDINGS
  // ────────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide();
    whiteSlide(s);
    addHeader(s, "11  |  10 Key Findings");
    addFooter(s);

    const findings = [
      { n:"1", title:"SIP Growth Is Structural", body:"Inflows 3× from Rs.11K→Rs.31K Cr with no reversal, even during corrections.", pri:"HIGH" },
      { n:"2", title:"SBI MF Unassailable AUM Lead", body:"AUM doubled to Rs.12.5L Cr in 3 yrs via govt-bank B30 distribution.", pri:"HIGH" },
      { n:"3", title:"MF Participation Doubled", body:"Folios: 13.26 Cr → 26.12 Cr, 18.5% CAGR — digital platforms key driver.", pri:"HIGH" },
      { n:"4", title:"Large Cap Over-Correlated", body:"0.85–0.95 correlation means SBI Bluechip + HDFC Top 100 = no diversification.", pri:"HIGH" },
      { n:"5", title:"BFSI+IT = 50% Portfolio Risk", body:"BFSI 32% + IT 18% — sector concentration creates systemic risk.", pri:"MED" },
      { n:"6", title:"T30 Cities Dominate", body:"72% SIP value from T30. Maharashtra 20%+. B30 growing at 28% share.", pri:"MED" },
      { n:"7", title:"Tax-Season ELSS Spike", body:"Predictable Jan–Mar surge driven by 80C tax-saving deadline Mar 31.", pri:"MED" },
      { n:"8", title:"2023 Bull Run Rewarded SIPs", body:"SIP investors averaged into low NAVs in 2022 → captured 15–22% recovery.", pri:"HIGH" },
      { n:"9", title:"Experienced Investors Invest Most", body:"46–55 age: Rs.12,000/mo median SIP vs Rs.5,000 for 26–35.", pri:"MED" },
      { n:"10", title:"23% SIP Investors At-Risk", body:"6+ SIP gap > 35 days — need targeted re-engagement campaigns.", pri:"MED" },
    ];

    const colW = 4.55, cardH = 0.52, gapX = 0.2, gapY = 0.1;
    const x0 = 0.35, y0 = 0.9;
    findings.forEach(({ n, title, body, pri }, i) => {
      const col = i % 2, row = Math.floor(i / 2);
      const x = x0 + col * (colW + gapX);
      const y = y0 + row * (cardH + gapY);
      const priColor = pri === "HIGH" ? C.purple : C.orange;

      s.addShape("roundRect", { x, y, w:colW, h:cardH, rectRadius:0.06,
        fill:{ color: row % 2 === 0 ? C.lightgray : C.white }, shadow:mkShadow() });
      // number badge
      s.addShape("roundRect", { x, y, w:0.38, h:cardH, rectRadius:0.06,
        fill:{ color:priColor } });
      s.addText(n, { x, y, w:0.38, h:cardH, fontSize:11, bold:true,
        color:C.white, align:"center", valign:"middle", fontFace:"Calibri", margin:0 });
      // priority tag
      s.addShape("roundRect", { x:x+colW-0.65, y:y+0.04, w:0.58, h:0.2, rectRadius:0.04,
        fill:{ color:priColor, transparency:30 } });
      s.addText(pri, { x:x+colW-0.65, y:y+0.04, w:0.58, h:0.2, fontSize:7, bold:true,
        color:priColor, align:"center", fontFace:"Calibri", margin:0 });
      // title + body
      s.addText(title, { x:x+0.44, y:y+0.03, w:colW-1.15, h:0.2, fontSize:9, bold:true,
        color:C.dark, fontFace:"Calibri", margin:0 });
      s.addText(body, { x:x+0.44, y:y+0.24, w:colW-0.5, h:0.22, fontSize:7.5,
        color:C.gray, fontFace:"Calibri", margin:0 });
    });

    s.addNotes("10 findings distilled from 7 days of analysis. High-priority items (purple) are actionable immediately. The 23% at-risk SIP investors is a direct revenue retention opportunity for Bluestock's product team.");
  }

  // ────────────────────────────────────────────────────────────────────────
  // SLIDE 12 — THANK YOU
  // ────────────────────────────────────────────────────────────────────────
  {
    const s = pres.addSlide();
    darkSlide(s);

    // top bar
    s.addShape("rect", { x:0, y:0, w:10, h:0.55, fill:{ color:C.purple } });
    s.addText("Bluestock Fintech Pvt. Ltd.  |  Mutual Fund Analytics Platform  |  Capstone Project", {
      x:0, y:0, w:10, h:0.55, fontSize:10, color:C.lavender,
      align:"center", valign:"middle", fontFace:"Calibri", margin:0
    });

    // logo
    s.addImage({
    path: "./submission/logo int.webp",
    x: 3.2,
    y: 0.68,
    w: 3.6,
    h: 0.46
});

    // Thank you text
    s.addText("Thank You", { x:0.5, y:1.3, w:9, h:0.7, fontSize:44, bold:true,
      color:C.white, align:"center", fontFace:"Cambria", margin:0 });
    s.addText("Questions & Discussion", { x:0.5, y:1.95, w:9, h:0.36, fontSize:16,
      color:C.lavender, align:"center", italic:true, fontFace:"Calibri", margin:0 });

    // Divider
    s.addShape("rect", { x:2, y:2.42, w:6, h:0.04, fill:{ color:C.violet } });

    // Contact cards
    const contacts = [
      { icon:"🔗", label:"GitHub", val:"github.com/sumeetwagh01/bluestock_mf_capstone" },
      { icon:"📧", label:"Email", val:"sumeetwagh01@gmail.com" },
      { icon:"🌐", label:"Website", val:"bluestock.in" },
    ];
    contacts.forEach(({ icon, label, val }, i) => {
      const x = 0.5 + i * 3.1;
      s.addShape("roundRect", { x, y:2.58, w:2.9, h:0.8, rectRadius:0.08,
        fill:{ color:C.violet, transparency:70 }, shadow:mkShadow() });
      s.addText(icon + "  " + label, { x, y:2.62, w:2.9, h:0.26, fontSize:10, bold:true,
        color:C.orange, align:"center", fontFace:"Calibri", margin:0 });
      s.addText(val, { x, y:2.9, w:2.9, h:0.4, fontSize:8,
        color:C.lavender, align:"center", fontFace:"Calibri", margin:4 });
    });

    // Project summary metrics
    s.addShape("roundRect", { x:0.5, y:3.55, w:9, h:1.3, rectRadius:0.1,
      fill:{ color:C.purple, transparency:30 }, shadow:mkShadow() });
    s.addText("Project Deliverables Summary", {
      x:0.5, y:3.6, w:9, h:0.28, fontSize:11, bold:true,
      color:C.orange, align:"center", fontFace:"Calibri", margin:0
    });

    const summary = [
      ["D1","ETL Pipeline",".py"], ["D2","SQLite DB",".db"],
      ["D3","EDA Notebook",".ipynb"], ["D4","Perf Metrics",".ipynb+CSV"],
      ["D5","Dashboard",".pbix"], ["D6","Adv Analytics",".ipynb"],
      ["D7","Report+Slides",".pdf+.pptx"],
    ];
    summary.forEach(([id, label, fmt], i) => {
      const x = 0.65 + i * 1.26;
      s.addShape("roundRect", { x, y:3.92, w:1.18, h:0.78, rectRadius:0.07,
        fill:{ color:C.dark }, shadow:mkShadow() });
      s.addText(id, { x, y:3.94, w:1.18, h:0.22, fontSize:9, bold:true,
        color:C.orange, align:"center", fontFace:"Calibri", margin:0 });
      s.addText(label, { x, y:4.14, w:1.18, h:0.26, fontSize:7.5,
        color:C.white, align:"center", fontFace:"Calibri", margin:0 });
      s.addText(fmt, { x, y:4.38, w:1.18, h:0.24, fontSize:7,
        color:C.lavender, align:"center", fontFace:"Calibri", margin:0 });
    });

    // bottom bar
    s.addShape("rect", { x:0, y:5.35, w:10, h:0.275, fill:{ color:C.purple } });
    s.addText("Project Status: COMPLETE  •  GitHub Tag: v1.0  •  Confidential — Bluestock Fintech Pvt. Ltd.", {
      x:0, y:5.35, w:10, h:0.275, fontSize:9, bold:true,
      color:C.lavender, align:"center", valign:"middle", fontFace:"Calibri", margin:0
    });

    s.addNotes("Thank you for attending. The full report, ETL pipeline, Jupyter notebooks, and Power BI dashboard are available on GitHub. Happy to take questions on any section — metrics computation, dashboard design, or data pipeline architecture.");
  }

  // ── Write file ────────────────────────────────────────────────────────
  const OUT = "./bluestock_mf_presentation.pptx";
  await pres.writeFile({ fileName: OUT });
  console.log("✅ Written:", OUT);
}

buildPPT().catch(e => { console.error(e); process.exit(1); });