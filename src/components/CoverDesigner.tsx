/**
 * RitemastaPro — Cover Designer
 * Types: Ebook, Academic, Business Card, Letterhead, Magazine, Invoice
 * AI-assisted layout prompt via Gemini + HTML/CSS rendered cover
 * Download as PNG via Puppeteer /api/cover/export
 */
import { useState } from "react";
import { Download, Wand2, Upload, Palette } from "lucide-react";

type CoverType = "ebook-hero"|"ebook-minimal"|"academic"|"business-card"|"letterhead"|"magazine"|"invoice";

const COVER_TYPES: { id: CoverType; label: string; icon: string; dims: string }[] = [
  { id:"ebook-hero",     label:"Ebook — Hero Drama",    icon:"📖", dims:"1600×2560px (6×9.6in)" },
  { id:"ebook-minimal",  label:"Ebook — Minimal",       icon:"🌿", dims:"1600×2560px (6×9.6in)" },
  { id:"academic",       label:"Academic Book",          icon:"🎓", dims:"1654×2339px (A4)" },
  { id:"business-card",  label:"Business Card",          icon:"📇", dims:"1050×600px (3.5×2in)" },
  { id:"letterhead",     label:"Letterhead",             icon:"📄", dims:"2480×3508px (A4 300dpi)" },
  { id:"magazine",       label:"Magazine Cover",         icon:"📰", dims:"2480×3508px (A4)" },
  { id:"invoice",        label:"Invoice/Receipt Header", icon:"🧾", dims:"A4 header strip" },
];

const FONT_OPTIONS = ["Playfair Display","Cormorant Garamond","Inter","Montserrat","Lora","Poppins","Georgia"];

function renderCoverHTML(type: CoverType, fields: any): string {
  const { title, subtitle, author, publisher, primaryColor, secondaryColor, bgColor, tagline, logoUrl, bgImageUrl } = fields;
  const bg = bgImageUrl ? `url(${bgImageUrl})` : bgColor || (type === "ebook-hero" ? "#1A0F08" : "#FFFFFF");
  const isBgImage = !!bgImageUrl;

  if (type === "ebook-hero") return `
    <div style="width:400px;height:640px;background:${isBgImage?`url(${bgImageUrl}) center/cover`:`linear-gradient(160deg,${primaryColor||"#1A0F08"} 0%,#0A0500 100%)`};display:flex;flex-direction:column;justify-content:space-between;padding:32px;position:relative;overflow:hidden;font-family:'Playfair Display',serif;">
      ${isBgImage?`<div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.3) 0%,rgba(0,0,0,0.7) 100%);"></div>`:""}
      <div style="position:relative;z-index:2;">
        ${logoUrl?`<img src="${logoUrl}" style="height:40px;object-fit:contain;margin-bottom:12px;"/>`:""}
        ${tagline?`<p style="color:${secondaryColor||"#D4A853"};font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 16px;">${tagline}</p>`:""}
        <h1 style="color:#FFFFFF;font-size:${title&&title.length>20?"32px":"42px"};font-weight:800;line-height:1.1;margin:0 0 12px;text-shadow:0 2px 8px rgba(0,0,0,0.5);">${title||"BOOK TITLE"}</h1>
        ${subtitle?`<p style="color:rgba(255,255,255,0.8);font-size:14px;font-style:italic;line-height:1.4;margin:0;">${subtitle}</p>`:""}
      </div>
      <div style="position:relative;z-index:2;border-top:2px solid ${secondaryColor||"#D4A853"};padding-top:12px;">
        <p style="color:${secondaryColor||"#D4A853"};font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0;">${author||"AUTHOR NAME"}</p>
        ${publisher?`<p style="color:rgba(255,255,255,0.5);font-size:10px;margin:4px 0 0;">${publisher}</p>`:""}
      </div>
    </div>`;

  if (type === "ebook-minimal") return `
    <div style="width:400px;height:640px;background:${bgColor||"#F5F0E8"};display:flex;flex-direction:column;padding:40px 32px;font-family:'Cormorant Garamond',serif;position:relative;">
      <div style="border-top:3px solid ${primaryColor||"#2D6B44"};border-bottom:1px solid ${primaryColor||"#2D6B44"};padding:8px 0;margin-bottom:24px;text-align:center;">
        <p style="color:${primaryColor||"#2D6B44"};font-size:9px;letter-spacing:4px;text-transform:uppercase;margin:0;">THE</p>
      </div>
      <h1 style="color:${primaryColor||"#2D6B44"};font-size:${title&&title.length>15?"28px":"36px"};font-weight:700;text-align:center;line-height:1.15;margin:0 0 8px;text-transform:uppercase;">${title||"BOOK TITLE"}</h1>
      <div style="display:flex;align-items:center;gap:8px;margin:12px 0;">
        <div style="flex:1;height:1px;background:${primaryColor||"#2D6B44"};opacity:0.3;"></div>
        <span style="color:${primaryColor||"#2D6B44"};font-size:14px;">✦</span>
        <div style="flex:1;height:1px;background:${primaryColor||"#2D6B44"};opacity:0.3;"></div>
      </div>
      ${subtitle?`<p style="color:${primaryColor||"#2D6B44"};font-size:12px;font-style:italic;text-align:center;line-height:1.5;margin:0 0 auto;">${subtitle}</p>`:"<div style='flex:1;'></div>"}
      ${logoUrl?`<img src="${logoUrl}" style="height:60px;object-fit:contain;margin:0 auto 16px;display:block;"/>`:""}
      <div style="border-top:2px solid ${primaryColor||"#2D6B44"};padding-top:12px;text-align:center;">
        <p style="color:${primaryColor||"#2D6B44"};font-size:14px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin:0;">${author||"AUTHOR NAME"}</p>
        ${tagline?`<p style="color:${primaryColor||"#2D6B44"};font-size:9px;letter-spacing:1px;margin:4px 0 0;opacity:0.7;">${tagline}</p>`:""}
      </div>
    </div>`;

  if (type === "academic") return `
    <div style="width:400px;height:565px;background:#FFFFFF;font-family:'Inter',sans-serif;display:flex;flex-direction:column;">
      <div style="background:${primaryColor||"#22395B"};padding:12px 16px;display:flex;align-items:center;gap:10px;">
        ${logoUrl?`<img src="${logoUrl}" style="height:36px;object-fit:contain;"/>`:`<div style="width:36px;height:36px;background:${secondaryColor||"#D4A853"};border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;color:#fff;">R</div>`}
        <div><p style="color:#FFFFFF;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0;">${publisher||"RITEMASTA ECOSYSTEM"}</p></div>
      </div>
      ${bgImageUrl?`<div style="height:180px;background:url(${bgImageUrl}) center/cover;"></div>`:`<div style="height:180px;background:linear-gradient(135deg,${secondaryColor||"#D4A853"}22,${primaryColor||"#22395B"}44);display:flex;align-items:center;justify-content:center;"><span style="font-size:60px;opacity:0.3;">📚</span></div>`}
      <div style="background:${primaryColor||"#22395B"};padding:16px;flex:1;">
        <h1 style="color:#FFFFFF;font-size:${title&&title.length>25?"18px":"22px"};font-weight:800;text-transform:uppercase;margin:0 0 4px;line-height:1.2;">${title||"SUBJECT TITLE"}</h1>
        ${subtitle?`<p style="color:${secondaryColor||"#D4A853"};font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">${subtitle}</p>`:""}
        <div style="background:${secondaryColor||"#D4A853"};display:inline-block;padding:3px 10px;border-radius:3px;margin-bottom:8px;">
          <p style="color:#1A1A1A;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0;">${tagline||"COMPLETE SYLLABUS"}</p>
        </div>
      </div>
      <div style="background:#F5F5F5;padding:10px 16px;display:flex;justify-content:space-between;align-items:center;">
        <p style="color:${primaryColor||"#22395B"};font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0;">${author||"AUTHOR NAME"}</p>
        <div style="background:${primaryColor||"#22395B"};color:#fff;padding:3px 8px;border-radius:3px;font-size:8px;font-weight:700;">NaCCA-COMPLIANT</div>
      </div>
    </div>`;

  if (type === "business-card") return `
    <div style="width:420px;height:240px;background:#FFFFFF;font-family:'Inter',sans-serif;display:flex;overflow:hidden;position:relative;">
      <div style="width:140px;background:${primaryColor||"#1A3D2B"};display:flex;flex-direction:column;align-items:center;justify-content:center;padding:16px;position:relative;">
        ${logoUrl?`<img src="${logoUrl}" style="width:70px;height:70px;object-fit:contain;"/>`:`<div style="width:60px;height:60px;background:${secondaryColor||"#D4A853"};border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:900;color:#fff;font-family:'Playfair Display',serif;">${(title||"C").charAt(0)}</div>`}
        <p style="color:rgba(255,255,255,0.6);font-size:9px;text-align:center;margin-top:8px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">${publisher||"COMPANY"}</p>
        <div style="position:absolute;bottom:0;left:0;right:0;height:4px;background:${secondaryColor||"#D4A853"};"></div>
      </div>
      <div style="flex:1;padding:16px 20px;display:flex;flex-direction:column;justify-content:center;gap:4px;">
        <p style="font-size:17px;font-weight:800;color:${primaryColor||"#1A3D2B"};margin:0;line-height:1.1;">${title||"FULL NAME"}</p>
        <p style="font-size:10px;font-weight:700;color:${secondaryColor||"#2E7D32"};text-transform:uppercase;letter-spacing:1.5px;margin:0 0 8px;">${subtitle||"POSITION"}</p>
        ${tagline?`<div style="display:flex;align-items:center;gap:6px;"><span style="font-size:11px;">📍</span><p style="font-size:10px;color:#555;margin:0;line-height:1.3;">${tagline}</p></div>`:""}
        ${author?`<div style="display:flex;align-items:center;gap:6px;"><span style="font-size:11px;">📞</span><p style="font-size:10px;color:#555;margin:0;">${author}</p></div>`:""}
      </div>
      <div style="position:absolute;bottom:0;right:0;width:80px;height:40px;background:${primaryColor||"#1A3D2B"};opacity:0.08;border-radius:60px 0 0 0;"></div>
    </div>`;

  if (type === "letterhead") return `
    <div style="width:420px;height:595px;background:#FFFFFF;font-family:'Inter',sans-serif;display:flex;flex-direction:column;">
      <div style="background:${primaryColor||"#1A3D2B"};padding:14px 20px;display:flex;align-items:center;gap:12px;">
        ${logoUrl?`<img src="${logoUrl}" style="height:44px;object-fit:contain;"/>`:`<div style="width:44px;height:44px;background:${secondaryColor||"#D4A853"};border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:900;color:#fff;">${(publisher||"R").charAt(0)}</div>`}
        <div>
          <p style="color:#FFFFFF;font-size:15px;font-weight:800;margin:0;letter-spacing:0.5px;text-transform:uppercase;">${publisher||"COMPANY NAME"}</p>
          ${tagline?`<p style="color:rgba(255,255,255,0.7);font-size:9px;margin:2px 0 0;letter-spacing:1px;">${tagline}</p>`:""}
        </div>
      </div>
      <div style="display:flex;height:3px;">
        <div style="flex:1;background:${secondaryColor||"#D4A853"};"></div>
        <div style="flex:1;background:${primaryColor||"#1A3D2B"};"></div>
        <div style="flex:1;background:${secondaryColor||"#D4A853"};"></div>
      </div>
      <div style="padding:12px 20px;display:grid;grid-template-columns:1fr 1fr;gap:4px;background:#FAFAFA;border-bottom:1px solid #eee;">
        ${title?`<p style="font-size:9px;color:#555;margin:0;">📍 ${title}</p>`:""}
        ${subtitle?`<p style="font-size:9px;color:#555;margin:0;text-align:right;">✉ ${subtitle}</p>`:""}
        ${author?`<p style="font-size:9px;color:#555;margin:0;">📞 ${author}</p>`:""}
      </div>
      <div style="flex:1;display:flex;align-items:center;justify-content:center;opacity:0.05;">
        ${logoUrl?`<img src="${logoUrl}" style="width:180px;height:180px;object-fit:contain;"/>`:`<p style="font-size:80px;font-weight:900;color:${primaryColor||"#1A3D2B"};">${(publisher||"R").charAt(0)}</p>`}
      </div>
      <div style="border-top:1px solid #eee;padding:10px 20px;display:flex;justify-content:space-between;background:#FAFAFA;">
        ${subtitle?`<p style="font-size:9px;color:#888;margin:0;">${subtitle}</p>`:""}
        ${tagline?`<p style="font-size:9px;color:#888;margin:0;">${tagline}</p>`:""}
      </div>
    </div>`;

  if (type === "magazine") return `
    <div style="width:400px;height:565px;font-family:'Playfair Display',serif;position:relative;overflow:hidden;background:${isBgImage?`#000`:`linear-gradient(160deg,${primaryColor||"#D6224A"} 0%,#1A1A1A 100%)`};">
      ${isBgImage?`<img src="${bgImageUrl}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0.7;"/>`:""}
      <div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.4) 0%,transparent 40%,rgba(0,0,0,0.8) 100%);"></div>
      <div style="position:absolute;top:12px;left:0;right:0;padding:0 16px;z-index:2;display:flex;justify-content:space-between;align-items:center;">
        <h1 style="color:#FFFFFF;font-size:32px;font-weight:900;letter-spacing:-1px;text-transform:uppercase;margin:0;">${publisher||"MAGAZINE"}</h1>
        <div style="text-align:right;"><p style="color:rgba(255,255,255,0.8);font-size:9px;margin:0;">ISSUE ${subtitle||"01"}</p><p style="color:rgba(255,255,255,0.8);font-size:9px;margin:0;">${tagline||"2026"}</p></div>
      </div>
      <div style="position:absolute;bottom:24px;left:16px;right:16px;z-index:2;">
        ${title?`<h2 style="color:#FFFFFF;font-size:22px;font-weight:800;line-height:1.2;margin:0 0 8px;text-shadow:0 2px 8px rgba(0,0,0,0.8);">${title}</h2>`:""}
        <div style="width:40px;height:3px;background:${secondaryColor||"#D4A853"};margin-bottom:8px;"></div>
        ${author?`<p style="color:rgba(255,255,255,0.8);font-size:11px;margin:0;">${author}</p>`:""}
      </div>
    </div>`;

  // invoice
  return `
    <div style="width:420px;background:#FFFFFF;font-family:'Inter',sans-serif;">
      <div style="background:${primaryColor||"#1F2937"};padding:16px 20px;display:flex;align-items:center;gap:12px;">
        ${logoUrl?`<img src="${logoUrl}" style="height:40px;object-fit:contain;"/>`:`<div style="width:40px;height:40px;background:${secondaryColor||"#D4A853"};border-radius:6px;display:flex;align-items:center;justify-content:center;font-weight:900;color:#fff;font-size:18px;">${(publisher||"R").charAt(0)}</div>`}
        <div>
          <p style="color:#FFFFFF;font-size:14px;font-weight:800;margin:0;text-transform:uppercase;">${publisher||"COMPANY NAME"}</p>
          ${tagline?`<p style="color:rgba(255,255,255,0.6);font-size:9px;margin:2px 0 0;">${tagline}</p>`:""}
        </div>
        <div style="margin-left:auto;text-align:right;">
          <p style="color:${secondaryColor||"#D4A853"};font-size:18px;font-weight:800;margin:0;">${title||"INVOICE"}</p>
          ${subtitle?`<p style="color:rgba(255,255,255,0.6);font-size:9px;margin:0;">${subtitle}</p>`:""}
        </div>
      </div>
      <div style="height:3px;background:${secondaryColor||"#D4A853"};"></div>
      <div style="padding:16px 20px;display:grid;grid-template-columns:1fr 1fr;gap:8px;background:#F9FAFB;border-bottom:1px solid #eee;">
        ${author?`<div><p style="font-size:8px;color:#9CA3AF;text-transform:uppercase;letter-spacing:1px;margin:0 0 2px;">Address</p><p style="font-size:10px;color:#374151;margin:0;">${author}</p></div>`:""}
        <div style="text-align:right;"><p style="font-size:8px;color:#9CA3AF;text-transform:uppercase;letter-spacing:1px;margin:0 0 2px;">Date</p><p style="font-size:10px;color:#374151;margin:0;">${new Date().toLocaleDateString()}</p></div>
      </div>
    </div>`;
}

export default function CoverDesigner() {
  const [coverType, setCoverType] = useState<CoverType>("ebook-hero");
  const [fields, setFields] = useState({
    title: "", subtitle: "", author: "", publisher: "", tagline: "",
    primaryColor: "#1A0F08", secondaryColor: "#D4A853", bgColor: "#FFFFFF",
    font: "Playfair Display", logoUrl: "", bgImageUrl: "",
  });
  const [generating, setGenerating] = useState(false);
  const [aiPromptResult, setAiPromptResult] = useState("");

  const upd = (k: string, v: string) => setFields((p) => ({ ...p, [k]: v }));

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => upd("logoUrl", reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => upd("bgImageUrl", reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleAISuggest = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/gemini/cover-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverType, ...fields }),
      });
      const data = await res.json();
      if (data.suggestion) setAiPromptResult(data.suggestion);
    } catch {}
    setGenerating(false);
  };

  const handleExportPNG = async () => {
    const html = renderCoverHTML(coverType, fields);
    const res = await fetch("/api/cover/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ html, type: coverType }),
    });
    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `cover-${coverType}.png`; a.click();
      URL.revokeObjectURL(url);
    }
  };

  const previewHtml = renderCoverHTML(coverType, fields);

  return (
    <div className="min-h-screen py-8 px-4" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="section-title text-3xl">Cover Designer</h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Professional covers for ebooks, academic books, business cards, letterheads & more</p>
        </div>

        {/* Cover type selector */}
        <div className="flex flex-wrap gap-2 justify-center">
          {COVER_TYPES.map((ct) => (
            <button key={ct.id} onClick={() => setCoverType(ct.id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-all"
              style={{ background: coverType === ct.id ? "var(--accent)" : "var(--accent-dim)", color: coverType === ct.id ? "#2D1B0E" : "var(--accent)" }}>
              {ct.icon} {ct.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Fields */}
          <div className="space-y-4 rounded-2xl p-6" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <h2 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
              {COVER_TYPES.find(c => c.id === coverType)?.label} Details
              <span className="ml-2 text-[10px] font-normal" style={{ color: "var(--text-muted)" }}>{COVER_TYPES.find(c => c.id === coverType)?.dims}</span>
            </h2>

            {[
              { key:"title", label: coverType==="business-card"?"Full Name":coverType==="invoice"?"Invoice/Receipt":"Title", placeholder:"e.g. Chess Out" },
              { key:"subtitle", label: coverType==="business-card"?"Job Title":coverType==="magazine"?"Issue No.":"Subtitle", placeholder:"Subtitle or tagline" },
              { key:"author", label: coverType==="business-card"?"Phone / Contact":coverType==="letterhead"?"Phone":"Author Name", placeholder:"e.g. Bob Ashley" },
              { key:"publisher", label: coverType==="business-card"?"Company Name":"Publisher / Brand", placeholder:"e.g. Ritemasta Publications" },
              { key:"tagline", label: coverType==="letterhead"?"Address / Web":coverType==="business-card"?"Address":"Badge / Tagline", placeholder:"e.g. NaCCA-Compliant" },
            ].map((f) => (
              <div key={f.key}>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: "var(--text-muted)" }}>{f.label}</label>
                <input value={(fields as any)[f.key]} onChange={(e) => upd(f.key, e.target.value)}
                  placeholder={f.placeholder} className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
              </div>
            ))}

            {/* Colors */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { key:"primaryColor", label:"Primary" },
                { key:"secondaryColor", label:"Accent" },
                { key:"bgColor", label:"Background" },
              ].map((c) => (
                <div key={c.key}>
                  <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: "var(--text-muted)" }}>{c.label}</label>
                  <input type="color" value={(fields as any)[c.key]} onChange={(e) => upd(c.key, e.target.value)}
                    className="w-full h-9 rounded-lg cursor-pointer border" style={{ borderColor: "var(--border)" }} />
                </div>
              ))}
            </div>

            {/* Uploads */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: "var(--text-muted)" }}>Logo / Watermark</label>
                <label className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all text-xs"
                  style={{ background: "var(--accent-dim)", color: "var(--accent)", border: "1px dashed var(--accent)" }}>
                  <Upload className="w-3.5 h-3.5" /> Upload Logo
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                </label>
                {fields.logoUrl && <img src={fields.logoUrl} alt="logo" className="h-8 mt-1 object-contain" />}
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: "var(--text-muted)" }}>Background Image</label>
                <label className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all text-xs"
                  style={{ background: "var(--accent-dim)", color: "var(--accent)", border: "1px dashed var(--accent)" }}>
                  <Palette className="w-3.5 h-3.5" /> Upload BG
                  <input type="file" accept="image/*" className="hidden" onChange={handleBgUpload} />
                </label>
              </div>
            </div>

            {/* AI suggest */}
            <button onClick={handleAISuggest} disabled={generating}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-xs transition-all"
              style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--accent)" }}>
              <Wand2 className="w-4 h-4" />
              {generating ? "Generating AI Suggestion..." : "AI Design Suggestion"}
            </button>
            {aiPromptResult && (
              <div className="text-xs p-3 rounded-lg leading-relaxed" style={{ background: "var(--accent-dim)", color: "var(--text-secondary)" }}>
                {aiPromptResult}
              </div>
            )}

            {/* Export */}
            <button onClick={handleExportPNG}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all active:scale-95"
              style={{ background: "var(--accent)", color: "#2D1B0E" }}>
              <Download className="w-4 h-4" /> Download Cover (PNG)
            </button>
          </div>

          {/* Live Preview */}
          <div className="space-y-3">
            <h2 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>Live Preview</h2>
            <div className="rounded-2xl overflow-hidden flex items-center justify-center p-6"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)", minHeight: 400 }}>
              <div className="shadow-2xl overflow-hidden rounded-lg"
                dangerouslySetInnerHTML={{ __html: previewHtml }} />
            </div>
            <p className="text-[10px] text-center" style={{ color: "var(--text-muted)" }}>
              Preview updates in real time as you edit fields above
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
