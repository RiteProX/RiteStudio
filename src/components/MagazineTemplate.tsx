/**
 * RitemastaPro — Magazine Template Builder
 * Full magazine layout: Cover, TOC, Editorial, Articles, Spreads, Ads, Back Cover
 * Sizes: A4, A5, US Letter, Tabloid, Digest, Royal, Crown Quarto, Large Square, B5
 * Export: PDF (Puppeteer) + HTML (digital magazine)
 */
import { useState } from "react";
import { Plus, Trash2, Download, Eye, FileText, Globe } from "lucide-react";

type PageType = "cover"|"toc"|"editorial"|"article"|"ad-full"|"spread"|"back-cover";
type MagSize = "a4"|"a5"|"us-letter"|"tabloid"|"digest"|"royal"|"crown-quarto"|"large-square"|"b5";
type Frequency = "monthly"|"bi-monthly"|"quarterly"|"annual";
type MagCategory = "beauty"|"lifestyle"|"sports"|"food"|"business"|"christian"|"general";

const SIZES: Record<MagSize, { label:string; w:number; h:number; unit:string }> = {
  "a4":          { label:"A4 (International)",       w:210, h:297, unit:"mm" },
  "a5":          { label:"A5 (POD Digest)",           w:148, h:210, unit:"mm" },
  "us-letter":   { label:"US Letter (North America)", w:8.5, h:11,  unit:"in" },
  "tabloid":     { label:"Tabloid/Broadsheet",        w:11,  h:17,  unit:"in" },
  "digest":      { label:"Digest (5.5×8.5 POD)",     w:5.5, h:8.5, unit:"in" },
  "royal":       { label:"Royal (UK Premium)",        w:6.14,h:9.21,unit:"in" },
  "crown-quarto":{ label:"Crown Quarto (Academic UK)",w:7.44,h:9.69,unit:"in" },
  "large-square":{ label:"Large Square (Art/Coffee)", w:8.5, h:8.5, unit:"in" },
  "b5":          { label:"B5 (European Professional)",w:176, h:250, unit:"mm" },
};

interface MagPage {
  id: string;
  type: PageType;
  title: string;
  body: string;
  imageUrl?: string;
  author?: string;
  pullQuote?: string;
}

const PAGE_LABELS: Record<PageType, string> = {
  "cover":"Cover Page","toc":"Table of Contents","editorial":"Editorial / Editor's Note",
  "article":"Article Page","ad-full":"Full Page Ad","spread":"Centre Spread","back-cover":"Back Cover",
};

const TYPOGRAPHY = {
  body: "9–11pt Inter/Lora, justified, 130% leading",
  heading: "24–72pt Playfair Display",
  sub: "14–18pt",
  caption: "7–8pt italic grey",
  folio: "8pt outer margin",
  pullQuote: "16–20pt italic, gold rule",
};

export default function MagazineTemplate() {
  const [size, setSize] = useState<MagSize>("a4");
  const [freq, setFreq] = useState<Frequency>("monthly");
  const [category, setCategory] = useState<MagCategory>("general");
  const [issue, setIssue] = useState("01");
  const [year, setYear] = useState("2026");
  const [masthead, setMasthead] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#D6224A");
  const [accentColor, setAccentColor] = useState("#1A1A1A");
  const [pages, setPages] = useState<MagPage[]>([
    { id:"p1", type:"cover", title:"Cover", body:"", author:"" },
    { id:"p2", type:"toc", title:"Table of Contents", body:"", author:"" },
    { id:"p3", type:"editorial", title:"Editor's Note", body:"", author:"" },
    { id:"p4", type:"article", title:"Feature Article", body:"", author:"", pullQuote:"" },
  ]);
  const [activePageId, setActivePageId] = useState("p4");
  const [exporting, setExporting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const activePage = pages.find(p => p.id === activePageId) || pages[0];
  const sizeInfo = SIZES[size];

  const addPage = (type: PageType) => {
    const newPage: MagPage = { id: `p${Date.now()}`, type, title: PAGE_LABELS[type], body: "", author: "" };
    setPages(prev => [...prev, newPage]);
    setActivePageId(newPage.id);
  };

  const updatePage = (id: string, updates: Partial<MagPage>) => {
    setPages(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deletePage = (id: string) => {
    setPages(prev => prev.filter(p => p.id !== id));
    setActivePageId(pages[0]?.id || "");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updatePage(id, { imageUrl: reader.result as string });
    reader.readAsDataURL(file);
  };

  const buildMagazineHTML = () => {
    const pageCSS = size === "a4" ? "width:210mm;min-height:297mm;" : size === "a5" ? "width:148mm;min-height:210mm;" : "width:8.5in;min-height:11in;";
    const pagesHTML = pages.map(page => {
      if (page.type === "cover") return `
        <div class="mag-page" style="${pageCSS}background:${page.imageUrl?`url(${page.imageUrl}) center/cover`:`linear-gradient(160deg,${primaryColor} 0%,#1A1A1A 100%)`};position:relative;display:flex;flex-direction:column;justify-content:space-between;padding:24px;">
          ${page.imageUrl?`<div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.4),rgba(0,0,0,0.7));"></div>`:""}
          <div style="position:relative;z-index:2;display:flex;justify-content:space-between;align-items:flex-start;">
            <h1 style="color:#fff;font-size:36px;font-weight:900;font-family:'Playfair Display',serif;margin:0;">${masthead||"MAGAZINE"}</h1>
            <div style="text-align:right;"><p style="color:rgba(255,255,255,0.8);font-size:10px;margin:0;">${freq.toUpperCase()} ISSUE ${issue}</p><p style="color:rgba(255,255,255,0.8);font-size:10px;margin:0;">${year}</p></div>
          </div>
          <div style="position:relative;z-index:2;">
            <div style="width:48px;height:3px;background:${accentColor};margin-bottom:12px;"></div>
            <h2 style="color:#fff;font-size:24px;font-weight:800;line-height:1.2;margin:0 0 8px;">${page.title}</h2>
            ${page.body?`<p style="color:rgba(255,255,255,0.8);font-size:12px;line-height:1.5;">${page.body}</p>`:""}
          </div>
        </div>`;

      if (page.type === "toc") return `
        <div class="mag-page" style="${pageCSS}background:#fff;padding:32px;font-family:'Inter',sans-serif;">
          <div style="border-bottom:3px solid ${primaryColor};padding-bottom:12px;margin-bottom:24px;">
            <p style="color:${primaryColor};font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0;">CONTENTS</p>
          </div>
          <div style="white-space:pre-wrap;font-size:13px;color:#333;line-height:2;">${page.body||"01 — Editorial\n04 — Feature Article\n12 — Advertorial\n18 — Centre Spread"}</div>
        </div>`;

      if (page.type === "article") return `
        <div class="mag-page" style="${pageCSS}background:#fff;padding:32px;font-family:'Inter',sans-serif;column-count:2;column-gap:24px;">
          <h2 style="column-span:all;font-size:28px;font-weight:800;font-family:'Playfair Display',serif;color:#1A1A1A;margin:0 0 6px;line-height:1.2;">${page.title}</h2>
          ${page.author?`<p style="column-span:all;font-size:10px;color:#888;letter-spacing:2px;text-transform:uppercase;margin:0 0 16px;">By ${page.author}</p>`:""}
          ${page.imageUrl?`<img src="${page.imageUrl}" style="column-span:all;width:100%;height:160px;object-fit:cover;margin-bottom:16px;"/>`:""}
          ${page.pullQuote?`<blockquote style="column-span:all;font-size:17px;font-style:italic;color:${primaryColor};border-top:2px solid ${primaryColor};border-bottom:2px solid ${primaryColor};padding:12px 0;margin:16px 0;font-family:'Playfair Display',serif;">"${page.pullQuote}"</blockquote>`:""}
          <p style="font-size:10px;line-height:1.7;color:#333;text-align:justify;">${page.body||"Article content goes here..."}</p>
        </div>`;

      if (page.type === "ad-full") return `
        <div class="mag-page" style="${pageCSS}${page.imageUrl?`background:url(${page.imageUrl}) center/cover`:`background:${primaryColor}`};display:flex;align-items:center;justify-content:center;">
          ${!page.imageUrl?`<p style="color:#fff;font-size:14px;font-style:italic;opacity:0.6;">[Advertisement]</p>`:""}
        </div>`;

      if (page.type === "spread") return `
        <div class="mag-page" style="width:${size==="a4"?"420mm":size==="us-letter"?"17in":"297mm"};min-height:${size==="a4"?"297mm":size==="us-letter"?"11in":"210mm"};${page.imageUrl?`background:url(${page.imageUrl}) center/cover`:`background:#1A1A1A`};display:flex;align-items:flex-end;padding:32px;">
          ${page.title?`<h2 style="color:#fff;font-size:32px;font-weight:800;">${page.title}</h2>`:""}
        </div>`;

      if (page.type === "back-cover") return `
        <div class="mag-page" style="${pageCSS}${page.imageUrl?`background:url(${page.imageUrl}) center/cover`:`background:${accentColor}`};"></div>`;

      // editorial
      return `
        <div class="mag-page" style="${pageCSS}background:#fff;padding:32px;font-family:'Playfair Display',serif;">
          <p style="color:${primaryColor};font-size:10px;letter-spacing:3px;text-transform:uppercase;margin:0 0 8px;">EDITOR'S NOTE</p>
          <h2 style="font-size:24px;font-weight:700;color:#1A1A1A;margin:0 0 16px;">${page.title}</h2>
          <p style="font-size:12px;line-height:1.8;color:#333;font-family:'Inter',sans-serif;">${page.body||""}</p>
          ${page.author?`<p style="color:${primaryColor};font-weight:700;margin-top:24px;">${page.author}</p>`:""}
        </div>`;
    }).join('<div style="page-break-after:always;"></div>');

    return `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;800;900&family=Inter:wght@400;500;600&display=swap" rel="stylesheet"/>
      <style>
        body{margin:0;padding:20px;background:#f0f0f0;font-family:'Inter',sans-serif;}
        .mag-page{box-shadow:0 4px 20px rgba(0,0,0,0.15);margin:0 auto 24px;overflow:hidden;break-after:page;}
        @media print{body{background:white;padding:0;}.mag-page{box-shadow:none;margin:0;}}
      </style>
    </head><body>${pagesHTML}</body></html>`;
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const html = buildMagazineHTML();
      const res = await fetch("/api/magazine/export-pdf", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html, size, masthead }),
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = `${masthead||"magazine"}-${issue}-${year}.pdf`; a.click();
        URL.revokeObjectURL(url);
      }
    } catch (e) { alert("Export failed. Please try again."); }
    setExporting(false);
  };

  const handleExportHTML = () => {
    const html = buildMagazineHTML();
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${masthead||"magazine"}-${issue}-${year}.html`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen py-8 px-4" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-7xl mx-auto space-y-6">

        <div className="text-center space-y-2">
          <h1 className="section-title text-3xl">Magazine Builder</h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Professional magazine layout — Cover, Articles, Spreads, Ads · Multiple global sizes</p>
        </div>

        {/* Magazine settings */}
        <div className="rounded-2xl p-6 grid grid-cols-2 sm:grid-cols-4 gap-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: "var(--text-muted)" }}>Masthead / Name</label>
            <input value={masthead} onChange={(e) => setMasthead(e.target.value)} placeholder="MAGAZINE NAME"
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: "var(--text-muted)" }}>Size</label>
            <select value={size} onChange={(e) => setSize(e.target.value as MagSize)}
              className="w-full px-3 py-2 rounded-lg text-xs outline-none"
              style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-primary)" }}>
              {Object.entries(SIZES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: "var(--text-muted)" }}>Frequency</label>
            <select value={freq} onChange={(e) => setFreq(e.target.value as Frequency)}
              className="w-full px-3 py-2 rounded-lg text-xs outline-none"
              style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-primary)" }}>
              {["monthly","bi-monthly","quarterly","annual"].map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: "var(--text-muted)" }}>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value as MagCategory)}
              className="w-full px-3 py-2 rounded-lg text-xs outline-none"
              style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-primary)" }}>
              {["beauty","lifestyle","sports","food","business","christian","general"].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: "var(--text-muted)" }}>Issue No.</label>
            <input value={issue} onChange={(e) => setIssue(e.target.value)} placeholder="01"
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: "var(--text-muted)" }}>Year</label>
            <input value={year} onChange={(e) => setYear(e.target.value)} placeholder="2026"
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: "var(--text-muted)" }}>Primary Color</label>
            <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)}
              className="w-full h-9 rounded-lg cursor-pointer border" style={{ borderColor: "var(--border)" }} />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: "var(--text-muted)" }}>Accent Color</label>
            <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)}
              className="w-full h-9 rounded-lg cursor-pointer border" style={{ borderColor: "var(--border)" }} />
          </div>
        </div>

        {/* Typography reference */}
        <div className="rounded-xl p-4 grid grid-cols-3 sm:grid-cols-6 gap-3" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          {Object.entries(TYPOGRAPHY).map(([k, v]) => (
            <div key={k} className="text-center">
              <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--accent)" }}>{k}</p>
              <p className="text-[9px]" style={{ color: "var(--text-muted)" }}>{v}</p>
            </div>
          ))}
        </div>

        {/* Page builder */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Page list */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>Pages ({pages.length})</h2>
            </div>
            {pages.map((page, idx) => (
              <div key={page.id} onClick={() => setActivePageId(page.id)}
                className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all"
                style={{ background: activePageId === page.id ? "var(--accent-dim)" : "var(--bg-card)", border: `1px solid ${activePageId === page.id ? "var(--accent)" : "var(--border)"}` }}>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold w-4" style={{ color: "var(--text-muted)" }}>{idx + 1}</span>
                  <div>
                    <p className="text-xs font-semibold leading-none" style={{ color: "var(--text-primary)" }}>{page.title}</p>
                    <p className="text-[9px]" style={{ color: "var(--text-muted)" }}>{PAGE_LABELS[page.type]}</p>
                  </div>
                </div>
                {pages.length > 1 && (
                  <button onClick={(e) => { e.stopPropagation(); deletePage(page.id); }}
                    className="w-5 h-5 rounded flex items-center justify-center transition-all hover:bg-red-500/20"
                    style={{ color: "var(--text-muted)" }}>
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
            {/* Add page */}
            <div className="grid grid-cols-2 gap-1 pt-2">
              {(Object.entries(PAGE_LABELS) as [PageType, string][]).map(([type, label]) => (
                <button key={type} onClick={() => addPage(type)}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[9px] font-medium transition-all"
                  style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
                  <Plus className="w-3 h-3" /> {label.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Active page editor */}
          <div className="lg:col-span-3 rounded-2xl p-6 space-y-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
                {PAGE_LABELS[activePage.type]} Editor
              </h2>
              <div className="flex gap-2">
                <button onClick={() => setPreviewMode(!previewMode)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{ background: previewMode ? "var(--accent)" : "var(--accent-dim)", color: previewMode ? "#2D1B0E" : "var(--accent)" }}>
                  <Eye className="w-3.5 h-3.5" /> {previewMode ? "Edit" : "Preview"}
                </button>
              </div>
            </div>

            {previewMode ? (
              <div className="overflow-auto rounded-xl" style={{ background: "#f0f0f0", minHeight: 400 }}>
                <div className="scale-75 origin-top-left" dangerouslySetInnerHTML={{ __html: buildMagazineHTML() }} />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: "var(--text-muted)" }}>Page Title / Headline</label>
                    <input value={activePage.title} onChange={(e) => updatePage(activePage.id, { title: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                      style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: "var(--text-muted)" }}>Author / Byline</label>
                    <input value={activePage.author||""} onChange={(e) => updatePage(activePage.id, { author: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                      style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
                  </div>
                </div>

                {activePage.type === "article" && (
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: "var(--text-muted)" }}>Pull Quote</label>
                    <input value={activePage.pullQuote||""} onChange={(e) => updatePage(activePage.id, { pullQuote: e.target.value })}
                      placeholder="A striking quote to highlight..."
                      className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                      style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
                  </div>
                )}

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: "var(--text-muted)" }}>
                    {activePage.type === "toc" ? "Contents List (one entry per line)" : "Body Content"}
                  </label>
                  <textarea value={activePage.body} onChange={(e) => updatePage(activePage.id, { body: e.target.value })}
                    rows={8} className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
                    style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
                </div>

                {["cover","article","ad-full","spread","back-cover"].includes(activePage.type) && (
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: "var(--text-muted)" }}>Page Image</label>
                    <label className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-xs transition-all w-fit"
                      style={{ background: "var(--accent-dim)", color: "var(--accent)", border: "1px dashed var(--accent)" }}>
                      Upload Image
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, activePage.id)} />
                    </label>
                    {activePage.imageUrl && <img src={activePage.imageUrl} alt="page" className="h-24 mt-2 rounded-lg object-cover" />}
                  </div>
                )}
              </div>
            )}

            {/* Export buttons */}
            <div className="flex gap-3 pt-2 border-t" style={{ borderColor: "var(--border)" }}>
              <button onClick={handleExportPDF} disabled={exporting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 disabled:opacity-60"
                style={{ background: "var(--accent)", color: "#2D1B0E" }}>
                <Download className="w-4 h-4" /> {exporting ? "Exporting..." : "Export PDF"}
              </button>
              <button onClick={handleExportHTML}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95"
                style={{ background: "var(--accent-dim)", color: "var(--accent)", border: "1px solid var(--accent)" }}>
                <Globe className="w-4 h-4" /> Export HTML (Digital)
              </button>
              <div className="ml-auto text-xs flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                <FileText className="w-3.5 h-3.5" />
                {sizeInfo.label} · {sizeInfo.w}×{sizeInfo.h}{sizeInfo.unit}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
