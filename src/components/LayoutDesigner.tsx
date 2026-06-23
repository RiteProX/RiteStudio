/**
 * RitemastaPro - Layout, Margins, Typography & 28 templates component
 */
import { Project, LayoutSettings } from "../types";
import { Sliders, Sparkles, Check, Info } from "lucide-react";

interface LayoutDesignerProps {
  project: Project;
  onUpdateProject: (updatedProj: Project) => void;
}

export default function LayoutDesigner({ project, onUpdateProject }: LayoutDesignerProps) {
  const layout = project.layout;

  const updateLayout = (updatedFields: Partial<LayoutSettings>) => {
    onUpdateProject({
      ...project,
      layout: { ...project.layout, ...updatedFields },
      updatedAt: new Date().toISOString(),
    });
  };

  const templatesList = [
    { name: "Serene Wellness", category: "Meditation & wellness", icon: "💆", style: "serif" },
    { name: "Energy & Fitness", category: "Health coaching", icon: "⚡", style: "sans" },
    { name: "Healing Wellness", category: "Natural healing", icon: "✨", style: "serif" },
    { name: "Natural Living", category: "Organic lifestyle", icon: "🌿", style: "sans" },
    { name: "Textbook Classic", category: "Educational & study", icon: "📚", style: "sans" },
    { name: "Coach's Journey", category: "Coaching & mentoring", icon: "🎯", style: "display" },
    { name: "Classic Novel", category: "Fiction & novels", icon: "📖", style: "serif" },
    { name: "Fashion Magazine", category: "Magazines & newsletters", icon: "📰", style: "display" },
    { name: "Scientific Journal", category: "Academic reports", icon: "🔬", style: "serif" },
    { name: "Executive Proposal", category: "Corporate synopsis", icon: "💼", style: "sans" },
    { name: "Minimalist Poetry", category: "Short lines & verses", icon: "✒️", style: "serif" },
    { name: "Culinary Recipes", category: "Cookbook instructions", icon: "🍳", style: "display" },
    { name: "Form/Receipt Standard", category: "Professional receipts", icon: "🧾", style: "sans" },
    { name: "Startup Pitch Deck", category: "Venture presentations", icon: "🚀", style: "display" },
    { name: "SHS SHS SHS Geography", category: "Academic text layout", icon: "🌍", style: "serif" },
    { name: "Faith-Based Set Apart", category: "Inspirational faith", icon: "⛪", style: "serif" },
    { name: "Chess Out Extraordinary", category: "Bold motivational", icon: "♟️", style: "display" },
    { name: "The Bitter Leaf Protocol", category: "Step wellness protocol", icon: "🍃", style: "serif" },
    { name: "Natural Vitality Ga", category: "Akan, Ga, Ewe dialect format", icon: "🇬🇭", style: "display" },
    { name: "German Academic Core", category: "French / German text layouts", icon: "🇪🇺", style: "serif" },
    { name: "Universal Receipts Simple", category: "Forms & invoices", icon: "🏷️", style: "sans" },
    { name: "Standard Business Cards", category: "Premium prints layout", icon: "📇", style: "sans" },
    { name: "Artistic Poster Classic", category: "Broadsheet typography", icon: "🖼️", style: "display" },
    { name: "SHS Practical Atlas", category: "Practical manuals", icon: "🗺️", style: "sans" },
    { name: "Wellness Protocol Reset", category: "Digestive healthy layouts", icon: "💧", style: "serif" },
    { name: "The Sevenfold Pack", category: "Faith spiritual guidelines", icon: "🔥", style: "serif" },
    { name: "Creative Portfolios", category: "Personal synopses", icon: "🎨", style: "display" },
    { name: "Bookstera Clean Pro", category: "General author layouts", icon: "⭐", style: "serif" },
  ];

  const handleSelectTemplate = (t: typeof templatesList[0]) => {
    let fontSerif = "Playfair Display";
    let fontSans = "Inter";
    let fontDisplay = "Playfair Display";

    if (t.style === "sans") {
      fontSerif = "Lora";
      fontSans = "Inter";
      fontDisplay = "Montserrat";
    } else if (t.style === "display") {
      fontSerif = "Cormorant Garamond";
      fontSans = "Poppins";
      fontDisplay = "Jost";
    }

    updateLayout({
      activeTemplate: t.name,
      fontSerif,
      fontSans,
      fontDisplay,
    });
  };

  return (
    <div className="bg-[#FFFDFB] min-h-screen py-6 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D1B0E] mb-1 flex items-center gap-2">
            🎨 Layout, Margins & Typography Settings
          </h1>
          <p className="text-xs text-[#8A7A6A]">
            Configure custom sizes, precision margins, premium fonts, and select from our 28 expert Ritemasta design templates to surpass vellum and Atticus.
          </p>
        </div>

        {/* Layout Specifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1: Page Size & Margins */}
          <div className="bg-white border border-[#E8E0D8] p-5 rounded-2xl space-y-4">
            <h3 className="font-serif text-base font-bold text-[#2D1B0E] border-b pb-2 flex items-center gap-1.5">
              📏 Page Dimensions & Margins
            </h3>

            <div>
              <label className="block text-xs font-bold text-[#2D1B0E] mb-1.5">Page Size</label>
              <div className="grid grid-cols-2 gap-2">
                {["6x9", "5.5x8.5", "8.5x11", "A4"].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => updateLayout({ pageSize: sz as any })}
                    className={`px-3 py-2 border rounded-lg text-xs font-bold tracking-wide transition-colors ${
                      layout.pageSize === sz
                        ? "bg-[#D4A853] border-[#D4A853] text-[#2D1B0E]"
                        : "bg-white hover:bg-gray-50 text-[#867365]"
                    }`}
                  >
                    {sz === "6x9"
                      ? "6 × 9 (Standard)"
                      : sz === "5.5x8.5"
                      ? "5.5 × 8.5 (Compact)"
                      : sz === "8.5x11"
                      ? "8.5 × 11 (Letter)"
                      : "A4 (International)"}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-[#2D1B0E] mb-1">Top Margin (in)</label>
                <input
                  type="number"
                  step="0.05"
                  value={layout.marginTop}
                  onChange={(e) => updateLayout({ marginTop: parseFloat(e.target.value) || 1 })}
                  className="w-full p-2 border rounded text-xs focus:outline-none focus:border-[#D4A853]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#2D1B0E] mb-1">Bottom Margin (in)</label>
                <input
                  type="number"
                  step="0.05"
                  value={layout.marginBottom}
                  onChange={(e) => updateLayout({ marginBottom: parseFloat(e.target.value) || 1 })}
                  className="w-full p-2 border rounded text-xs focus:outline-none focus:border-[#D4A853]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#2D1B0E] mb-1">Left Margin (in)</label>
                <input
                  type="number"
                  step="0.05"
                  value={layout.marginLeft}
                  onChange={(e) => updateLayout({ marginLeft: parseFloat(e.target.value) || 1 })}
                  className="w-full p-2 border rounded text-xs focus:outline-none focus:border-[#D4A853]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#2D1B0E] mb-1">Right Margin (in)</label>
                <input
                  type="number"
                  step="0.05"
                  value={layout.marginRight}
                  onChange={(e) => updateLayout({ marginRight: parseFloat(e.target.value) || 1 })}
                  className="w-full p-2 border rounded text-xs focus:outline-none focus:border-[#D4A853]"
                />
              </div>
            </div>
          </div>

          {/* Column 2: Advanced Typography */}
          <div className="bg-white border border-[#E8E0D8] p-5 rounded-2xl space-y-4 md:col-span-2">
            <h3 className="font-serif text-base font-bold text-[#2D1B0E] border-b pb-2 flex items-center gap-1.5 animate-pulse">
              🔤 Premium Typography Controls
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#2D1B0E] mb-1">Serif Head / Core Font</label>
                <select
                  value={layout.fontSerif}
                  onChange={(e) => updateLayout({ fontSerif: e.target.value })}
                  className="w-full p-2 bg-white border border-[#E8E0D8] rounded text-xs focus:outline-none focus:border-[#D4A853]"
                >
                  <option>Playfair Display</option>
                  <option>Merriweather</option>
                  <option>Garamond</option>
                  <option>Cormorant Garamond</option>
                  <option>EB Garamond</option>
                  <option>Lora</option>
                  <option>Baskervville</option>
                  <option>Libre Baskerville</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D1B0E] mb-1">Sans-Serif Font</label>
                <select
                  value={layout.fontSans}
                  onChange={(e) => updateLayout({ fontSans: e.target.value })}
                  className="w-full p-2 bg-white border border-[#E8E0D8] rounded text-xs focus:outline-none focus:border-[#D4A853]"
                >
                  <option>Inter</option>
                  <option>Montserrat</option>
                  <option>Open Sans</option>
                  <option>Raleway</option>
                  <option>Roboto</option>
                  <option>Lato</option>
                  <option>Oswald</option>
                  <option>Poppins</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D1B0E] mb-1">Magazine Display Font</label>
                <select
                  value={layout.fontDisplay}
                  onChange={(e) => updateLayout({ fontDisplay: e.target.value })}
                  className="w-full p-2 bg-white border border-[#E8E0D8] rounded text-xs focus:outline-none focus:border-[#D4A853]"
                >
                  <option>DM Sans</option>
                  <option>Jost</option>
                  <option>Neue Haas Display</option>
                  <option>Gothic A1</option>
                  <option>Unbounded</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D1B0E] mb-1">Akan, Ga, Ewe Dialect Font</label>
                <select
                  defaultValue="Noto Sans Ga"
                  className="w-full p-2 bg-white border border-[#E8E0D8] rounded text-xs focus:outline-none focus:border-[#D4A853]"
                >
                  <option>Noto Sans Ga &amp; Akan</option>
                  <option>Noto Sans Ewe</option>
                  <option>Standard Inter Native</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-[#2D1B0E] mb-1">Text Size (pt)</label>
                  <input
                    type="number"
                    value={layout.bodyFontSize}
                    onChange={(e) => updateLayout({ bodyFontSize: parseInt(e.target.value) || 12 })}
                    className="w-full p-2 border rounded text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#2D1B0E] mb-1">Line Spacing</label>
                  <select
                    value={layout.lineSpacing}
                    onChange={(e) => updateLayout({ lineSpacing: e.target.value as any })}
                    className="w-full p-2 bg-white border border-[#E8E0D8] rounded text-xs focus:outline-none focus:border-[#D4A853]"
                  >
                    <option value="1.15">1.15 (Compact)</option>
                    <option value="1.5">1.5 (Standard)</option>
                    <option value="2.0">2.0 (Double)</option>
                  </select>
                </div>
              </div>

              <div className="bg-[#FDF8F0] p-3.5 border border-[#E8E0D8] rounded-xl flex items-start gap-2 self-end">
                <Info className="w-5 h-5 text-[#D4A853] shrink-0 mt-0.5" />
                <div className="text-[10px] text-[#2D1B0E] leading-relaxed">
                  <strong className="block font-bold">Comprehensive Font Library Active</strong>
                  Ritemasta includes licensed fonts that format special Ghanaian, English, French, and German characters. All render correctly in POD and PDF output files.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Templates Selection Grid (28) */}
        <div>
          <h3 className="font-serif text-lg font-bold text-[#2D1B0E] border-b pb-2 mb-4 flex items-center gap-1.5">
            <Sparkles className="w-5 h-5 text-[#D4A853]" /> Premium Layout Templates (28 Styles)
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3">
            {templatesList.map((t) => (
              <div
                key={t.name}
                onClick={() => handleSelectTemplate(t)}
                className={`bg-white border rounded-xl p-4 text-center cursor-pointer transition-all hover:scale-[1.02] flex flex-col items-center justify-between min-h-[140px] shadow-sm hover:shadow ${
                  layout.activeTemplate === t.name
                    ? "border-4 border-[#D4A853] bg-[#FFFFF6]"
                    : "border-[#E8E0D8] hover:border-[#D4A853]"
                }`}
                id={`template-card-${t.name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className="flex flex-col items-center">
                  <span className="text-3xl mb-2">{t.icon}</span>
                  <div className="font-serif font-bold text-xs text-[#2D1B0E] leading-snug line-clamp-2">
                    {t.name}
                  </div>
                </div>
                <div className="text-[9px] text-[#8A7A6A] leading-tight mt-1 line-clamp-1">
                  {t.category}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
