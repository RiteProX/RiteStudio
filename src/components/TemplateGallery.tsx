/**
 * RitemastaPro - Visual Template Gallery
 * 28 live preview cards, category tabs, apply + preview modal
 */
import { useState } from "react";
import { TEMPLATE_DEFINITIONS, TemplateDefinition } from "../utils/templateSystem";
import { X, Check } from "lucide-react";

interface TemplateGalleryProps {
  activeTemplate: string;
  onSelect: (name: string) => void;
}

const CATEGORIES = ["All", "Wellness", "Academic", "Fiction & Poetry", "Magazine", "Business & Pitch", "Coaching & Faith", "Receipts & Forms", "Portfolio"];

const CAT_MAP: Record<string, string[]> = {
  "Wellness": ["wellness","healing","natural","organic","digestive","step wellness"],
  "Academic": ["academic","educational","study","manuals","practical","text"],
  "Fiction & Poetry": ["fiction","poetry","novel","short lines","verses"],
  "Magazine": ["magazine","newsletter","broadsheet"],
  "Business & Pitch": ["corporate","venture","business","invoice","synopsis"],
  "Coaching & Faith": ["coaching","mentoring","bold motivational","inspirational","spiritual","faith","guidelines"],
  "Receipts & Forms": ["receipts","forms","invoices","prints layout"],
  "Portfolio": ["personal","creative","general"],
};

function TemplatePreview({ t }: { t: TemplateDefinition }) {
  const hasDropCap = t.useDropCap;
  const isBanner = t.chapterHeadingStyle === "banner-bold";
  const isNumbered = t.chapterHeadingStyle === "numbered-academic";
  const isRule = t.chapterHeadingStyle === "minimal-rule";
  const isForm = t.chapterHeadingStyle === "form-header";

  return (
    <div className="w-full h-full overflow-hidden" style={{ background: t.palette.background, fontFamily: t.fontSerif, padding: "8px" }}>
      {isBanner ? (
        <div style={{ background: t.palette.primary, color: "#fff", padding: "4px 6px", marginBottom: 6, fontSize: 8, fontWeight: 700, fontFamily: t.fontDisplay }}>
          Chapter Title
        </div>
      ) : isNumbered ? (
        <>
          <p style={{ color: t.palette.secondary, fontSize: 6, fontWeight: 700, letterSpacing: 1, marginBottom: 2 }}>CHAPTER 1</p>
          <div style={{ borderBottom: `2px solid ${t.palette.primary}`, paddingBottom: 3, marginBottom: 5, fontSize: 9, fontWeight: 700, fontFamily: t.fontDisplay, color: t.palette.text }}>Chapter Title</div>
        </>
      ) : isRule ? (
        <>
          <hr style={{ border: "none", borderTop: `1px solid ${t.palette.muted}`, margin: "4px 0", width: "40%" }} />
          <p style={{ textAlign: "center", fontSize: 8, fontWeight: 400, letterSpacing: 0.5, color: t.palette.text, marginBottom: 5 }}>Chapter Title</p>
        </>
      ) : isForm ? (
        <div style={{ borderBottom: `1px solid ${t.palette.muted}`, paddingBottom: 3, marginBottom: 5, fontSize: 7, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: t.palette.text }}>SECTION HEADER</div>
      ) : (
        <p style={{ textAlign: "center", fontSize: 9, fontWeight: 400, fontFamily: t.fontDisplay, color: t.palette.text, marginBottom: 5 }}>Chapter Title</p>
      )}
      <p style={{ fontSize: 6.5, color: t.palette.text, lineHeight: 1.5, textAlign: "justify" }}>
        {hasDropCap && <span style={{ float: "left", fontSize: 18, lineHeight: 0.85, fontWeight: 700, color: t.palette.primary, paddingRight: 2, fontFamily: t.fontDisplay }}>T</span>}
        his is a sample paragraph showing how body text appears in this template. The typography, colours and spacing all reflect the chosen design system for this category.
      </p>
    </div>
  );
}

export default function TemplateGallery({ activeTemplate, onSelect }: TemplateGalleryProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [previewTemplate, setPreviewTemplate] = useState<TemplateDefinition | null>(null);

  const filtered = activeCategory === "All" ? TEMPLATE_DEFINITIONS : TEMPLATE_DEFINITIONS.filter((t) => {
    const keywords = CAT_MAP[activeCategory] || [];
    return keywords.some((k) => t.category.toLowerCase().includes(k));
  });

  return (
    <div className="space-y-6">
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className="px-3 py-1.5 text-xs font-semibold rounded-full transition-all"
            style={{ background: activeCategory === cat ? "var(--accent)" : "var(--accent-dim)", color: activeCategory === cat ? "#2D1B0E" : "var(--accent)" }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Template grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((t) => (
          <div key={t.name} className="rounded-xl overflow-hidden transition-all hover:-translate-y-1 cursor-pointer"
            style={{ border: activeTemplate === t.name ? `2px solid var(--accent)` : "1px solid var(--border)", background: "var(--bg-card)" }}>
            {/* Live preview */}
            <div className="h-32 relative overflow-hidden" style={{ background: t.palette.background }}>
              <TemplatePreview t={t} />
              {activeTemplate === t.name && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "var(--accent)" }}>
                  <Check className="w-3 h-3" style={{ color: "#2D1B0E" }} />
                </div>
              )}
            </div>
            {/* Info */}
            <div className="p-3 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <span className="text-sm">{t.icon}</span>
                <p className="text-xs font-bold leading-tight" style={{ color: "var(--text-primary)" }}>{t.name}</p>
              </div>
              <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{t.category}</p>
              <div className="flex gap-1.5 pt-1">
                <button onClick={() => onSelect(t.name)}
                  className="flex-1 py-1 text-[10px] font-bold rounded-lg transition-all active:scale-95"
                  style={{ background: activeTemplate === t.name ? "var(--accent)" : "var(--accent-dim)", color: activeTemplate === t.name ? "#2D1B0E" : "var(--accent)" }}>
                  {activeTemplate === t.name ? "✓ Active" : "Use"}
                </button>
                <button onClick={() => setPreviewTemplate(t)}
                  className="px-2 py-1 text-[10px] rounded-lg transition-all"
                  style={{ background: "var(--bg-secondary)", color: "var(--text-muted)" }}>
                  Preview
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.8)" }}
          onClick={() => setPreviewTemplate(null)}>
          <div className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center gap-2">
                <span className="text-xl">{previewTemplate.icon}</span>
                <div>
                  <p className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{previewTemplate.name}</p>
                  <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{previewTemplate.category}</p>
                </div>
              </div>
              <button onClick={() => setPreviewTemplate(null)} style={{ color: "var(--text-muted)" }}><X className="w-4 h-4" /></button>
            </div>
            <div className="h-80" style={{ background: previewTemplate.palette.background }}>
              <TemplatePreview t={previewTemplate} />
            </div>
            <div className="p-4 flex gap-3">
              <button onClick={() => { onSelect(previewTemplate.name); setPreviewTemplate(null); }}
                className="flex-1 py-2.5 font-bold text-sm rounded-xl transition-all active:scale-95"
                style={{ background: "var(--accent)", color: "#2D1B0E" }}>
                Use This Template
              </button>
              <button onClick={() => setPreviewTemplate(null)}
                className="px-4 py-2.5 text-sm rounded-xl transition-all"
                style={{ background: "var(--bg-secondary)", color: "var(--text-muted)" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
