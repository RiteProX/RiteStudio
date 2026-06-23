/**
 * RitemastaPro - Template Design System (28 Premium Templates)
 *
 * This is the single source of truth for visual identity per template:
 * font families, color palette, chapter heading treatment, margin
 * presets, and page size defaults. All exporters (HTML, EPUB, DOC, PDF)
 * consume this so every format renders each template consistently and
 * distinctly.
 *
 * Color palettes and margins are based on a comprehensive design pass
 * (28 templates, each with semantically-named colors appropriate to its
 * category - e.g. "Pentecostal purifying fire crimson" for faith content,
 * "Anti-inflammatory bitter dark leaf" for wellness protocols). Chapter
 * heading treatments extend the base dropcap/numbered/icon-prefixed set
 * with three additional layouts (minimal-rule, banner-bold, form-header)
 * for poetry, magazines/pitch decks/posters, and receipts/forms/business
 * cards respectively.
 */

export type FontStyleFamily = "serif" | "sans" | "display";

export type ChapterHeadingStyle =
  | "dropcap-serif" // large decorative first letter, classic novel feel
  | "numbered-academic" // "Chapter 1" numeral block + title
  | "icon-prefixed" // small emoji/icon + title (wellness, faith, coaching)
  | "minimal-rule" // thin horizontal rule + title, no ornament (poetry, minimalist)
  | "banner-bold" // full-width colored banner with title (magazine, pitch, poster)
  | "form-header"; // compact label-style header (receipts, business cards, forms)

export interface MarginPreset {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface TemplateColorPalette {
  /** Primary accent - chapter rules, headings, ornaments */
  primary: string;
  /** Secondary accent - subheadings, highlights */
  secondary: string;
  /** Main body text color */
  text: string;
  /** Page/background color */
  background: string;
  /** Muted color for captions, page numbers, running headers */
  muted: string;
}

export interface TemplateDefinition {
  name: string;
  category: string;
  icon: string;
  styleFamily: FontStyleFamily;
  fontSerif: string;
  fontSans: string;
  fontDisplay: string;
  palette: TemplateColorPalette;
  chapterHeadingStyle: ChapterHeadingStyle;
  /** Whether the first paragraph of each chapter gets a drop-cap first letter */
  useDropCap: boolean;
  /** Default margins in inches, used when LayoutSettings doesn't override */
  defaultMargins: MarginPreset;
  /** Default page size suggestion for this template's category */
  defaultPageSize: "6x9" | "5.5x8.5" | "8.5x11" | "A4" | "Custom";
}

/**
 * The 28 premium templates, matching the names/categories/icons defined
 * in LayoutDesigner.tsx, fully specified with palette, chapter heading
 * treatment, margins, and page size defaults.
 */
export const TEMPLATE_DEFINITIONS: TemplateDefinition[] = [
  {
    name: "Serene Wellness", category: "Meditation & wellness", icon: "💆", styleFamily: "serif",
    fontSerif: "Playfair Display", fontSans: "Inter", fontDisplay: "Playfair Display",
    palette: { primary: "#2E7D32", secondary: "#81C784", text: "#1B5E20", background: "#F1F8E9", muted: "#558B2F" },
    chapterHeadingStyle: "dropcap-serif",
    useDropCap: true,
    defaultMargins: { top: 1.0, bottom: 1.0, left: 1.25, right: 1.0 },
    defaultPageSize: "6x9",
  },
  {
    name: "Energy & Fitness", category: "Health coaching", icon: "⚡", styleFamily: "sans",
    fontSerif: "Lora", fontSans: "Inter", fontDisplay: "Montserrat",
    palette: { primary: "#FF6D00", secondary: "#FFAB40", text: "#212121", background: "#FAFAFA", muted: "#757575" },
    chapterHeadingStyle: "icon-prefixed",
    useDropCap: false,
    defaultMargins: { top: 0.85, bottom: 0.85, left: 1.15, right: 0.85 },
    defaultPageSize: "6x9",
  },
  {
    name: "Healing Wellness", category: "Natural healing", icon: "✨", styleFamily: "serif",
    fontSerif: "Playfair Display", fontSans: "Inter", fontDisplay: "Playfair Display",
    palette: { primary: "#00796B", secondary: "#4DB6AC", text: "#004D40", background: "#E0F2F1", muted: "#00695C" },
    chapterHeadingStyle: "dropcap-serif",
    useDropCap: true,
    defaultMargins: { top: 1.0, bottom: 1.0, left: 1.25, right: 1.0 },
    defaultPageSize: "6x9",
  },
  {
    name: "Natural Living", category: "Organic lifestyle", icon: "🌿", styleFamily: "sans",
    fontSerif: "Lora", fontSans: "Inter", fontDisplay: "Montserrat",
    palette: { primary: "#3E2723", secondary: "#8D6E63", text: "#272727", background: "#efebe9", muted: "#5D4037" },
    chapterHeadingStyle: "icon-prefixed",
    useDropCap: false,
    defaultMargins: { top: 0.9, bottom: 0.9, left: 1.2, right: 0.9 },
    defaultPageSize: "6x9",
  },
  {
    name: "Textbook Classic", category: "Educational & study", icon: "📚", styleFamily: "sans",
    fontSerif: "Lora", fontSans: "Inter", fontDisplay: "Montserrat",
    palette: { primary: "#1A237E", secondary: "#3F51B5", text: "#1C1C1E", background: "#F5F5F7", muted: "#7986CB" },
    chapterHeadingStyle: "numbered-academic",
    useDropCap: false,
    defaultMargins: { top: 1.0, bottom: 1.0, left: 1.25, right: 1.0 },
    defaultPageSize: "8.5x11",
  },
  {
    name: "Coach's Journey", category: "Coaching & mentoring", icon: "🎯", styleFamily: "display",
    fontSerif: "Cormorant Garamond", fontSans: "Poppins", fontDisplay: "Jost",
    palette: { primary: "#4E342E", secondary: "#D4A853", text: "#3E2723", background: "#FDFBF7", muted: "#8D6E63" },
    chapterHeadingStyle: "dropcap-serif",
    useDropCap: true,
    defaultMargins: { top: 1.0, bottom: 1.0, left: 1.25, right: 1.0 },
    defaultPageSize: "6x9",
  },
  {
    name: "Classic Novel", category: "Fiction & novels", icon: "📖", styleFamily: "serif",
    fontSerif: "Playfair Display", fontSans: "Inter", fontDisplay: "Playfair Display",
    palette: { primary: "#1E1E24", secondary: "#8A7A6A", text: "#111111", background: "#FAF6EE", muted: "#5C5346" },
    chapterHeadingStyle: "dropcap-serif",
    useDropCap: true,
    defaultMargins: { top: 1.1, bottom: 1.1, left: 1.5, right: 1.1 },
    defaultPageSize: "5.5x8.5",
  },
  {
    name: "Fashion Magazine", category: "Magazines & newsletters", icon: "📰", styleFamily: "display",
    fontSerif: "Cormorant Garamond", fontSans: "Poppins", fontDisplay: "Jost",
    palette: { primary: "#E91E63", secondary: "#000000", text: "#000000", background: "#FFFFFF", muted: "#9E9E9E" },
    chapterHeadingStyle: "banner-bold",
    useDropCap: false,
    defaultMargins: { top: 0.75, bottom: 0.75, left: 1.0, right: 0.75 },
    defaultPageSize: "A4",
  },
  {
    name: "Scientific Journal", category: "Academic reports", icon: "🔬", styleFamily: "serif",
    fontSerif: "Playfair Display", fontSans: "Inter", fontDisplay: "Playfair Display",
    palette: { primary: "#0D47A1", secondary: "#1976D2", text: "#212121", background: "#F8F9FA", muted: "#546E7A" },
    chapterHeadingStyle: "numbered-academic",
    useDropCap: false,
    defaultMargins: { top: 1.0, bottom: 1.0, left: 1.25, right: 1.0 },
    defaultPageSize: "A4",
  },
  {
    name: "Executive Proposal", category: "Corporate synopsis", icon: "💼", styleFamily: "sans",
    fontSerif: "Lora", fontSans: "Inter", fontDisplay: "Montserrat",
    palette: { primary: "#263238", secondary: "#00BCD4", text: "#212121", background: "#ECEFF1", muted: "#607D8B" },
    chapterHeadingStyle: "numbered-academic",
    useDropCap: false,
    defaultMargins: { top: 1.0, bottom: 1.0, left: 1.25, right: 1.0 },
    defaultPageSize: "8.5x11",
  },
  {
    name: "Minimalist Poetry", category: "Short lines & verses", icon: "✒️", styleFamily: "serif",
    fontSerif: "Playfair Display", fontSans: "Inter", fontDisplay: "Playfair Display",
    palette: { primary: "#424242", secondary: "#9E9E9E", text: "#212121", background: "#FFFDFB", muted: "#757575" },
    chapterHeadingStyle: "minimal-rule",
    useDropCap: false,
    defaultMargins: { top: 1.5, bottom: 1.5, left: 1.75, right: 1.5 },
    defaultPageSize: "5.5x8.5",
  },
  {
    name: "Culinary Recipes", category: "Cookbook instructions", icon: "🍳", styleFamily: "display",
    fontSerif: "Cormorant Garamond", fontSans: "Poppins", fontDisplay: "Jost",
    palette: { primary: "#D84315", secondary: "#FFB300", text: "#3E2723", background: "#FDF5E6", muted: "#795548" },
    chapterHeadingStyle: "icon-prefixed",
    useDropCap: false,
    defaultMargins: { top: 0.9, bottom: 0.9, left: 1.2, right: 0.9 },
    defaultPageSize: "8.5x11",
  },
  {
    name: "Form/Receipt Standard", category: "Professional receipts", icon: "🧾", styleFamily: "sans",
    fontSerif: "Lora", fontSans: "Inter", fontDisplay: "Montserrat",
    palette: { primary: "#212121", secondary: "#616161", text: "#212121", background: "#FAFAFA", muted: "#757575" },
    chapterHeadingStyle: "form-header",
    useDropCap: false,
    defaultMargins: { top: 0.4, bottom: 0.4, left: 0.4, right: 0.4 },
    defaultPageSize: "A4",
  },
  {
    name: "Startup Pitch Deck", category: "Venture presentations", icon: "🚀", styleFamily: "display",
    fontSerif: "Cormorant Garamond", fontSans: "Poppins", fontDisplay: "Jost",
    palette: { primary: "#6200EA", secondary: "#00E5FF", text: "#FFFFFF", background: "#0C0912", muted: "#9E96B3" },
    chapterHeadingStyle: "banner-bold",
    useDropCap: false,
    defaultMargins: { top: 0.8, bottom: 0.8, left: 1.1, right: 0.8 },
    defaultPageSize: "A4",
  },
  {
    name: "SHS SHS SHS Geography", category: "Academic text layout", icon: "🌍", styleFamily: "serif",
    fontSerif: "Playfair Display", fontSans: "Inter", fontDisplay: "Playfair Display",
    palette: { primary: "#0E4D92", secondary: "#4C9F70", text: "#2B1B17", background: "#FFFBF0", muted: "#5B7065" },
    chapterHeadingStyle: "numbered-academic",
    useDropCap: false,
    defaultMargins: { top: 1.0, bottom: 1.0, left: 1.25, right: 1.0 },
    defaultPageSize: "8.5x11",
  },
  {
    name: "Faith-Based Set Apart", category: "Inspirational faith", icon: "⛪", styleFamily: "serif",
    fontSerif: "Playfair Display", fontSans: "Inter", fontDisplay: "Playfair Display",
    palette: { primary: "#800020", secondary: "#D4A853", text: "#2B1A1E", background: "#FCFAF2", muted: "#8C6A3B" },
    chapterHeadingStyle: "dropcap-serif",
    useDropCap: true,
    defaultMargins: { top: 1.1, bottom: 1.1, left: 1.4, right: 1.1 },
    defaultPageSize: "6x9",
  },
  {
    name: "Chess Out Extraordinary", category: "Bold motivational", icon: "♟️", styleFamily: "display",
    fontSerif: "Cormorant Garamond", fontSans: "Poppins", fontDisplay: "Jost",
    palette: { primary: "#000000", secondary: "#B8860B", text: "#121212", background: "#FAF9F6", muted: "#696969" },
    chapterHeadingStyle: "dropcap-serif",
    useDropCap: true,
    defaultMargins: { top: 1.0, bottom: 1.0, left: 1.25, right: 1.0 },
    defaultPageSize: "6x9",
  },
  {
    name: "The Bitter Leaf Protocol", category: "Step wellness protocol", icon: "🍃", styleFamily: "serif",
    fontSerif: "Playfair Display", fontSans: "Inter", fontDisplay: "Playfair Display",
    palette: { primary: "#1B4D3E", secondary: "#8FBC8F", text: "#122620", background: "#EDF4F2", muted: "#4E6E58" },
    chapterHeadingStyle: "numbered-academic",
    useDropCap: false,
    defaultMargins: { top: 0.95, bottom: 0.95, left: 1.2, right: 0.95 },
    defaultPageSize: "6x9",
  },
  {
    name: "Natural Vitality Ga", category: "Akan, Ga, Ewe dialect format", icon: "🇬🇭", styleFamily: "display",
    fontSerif: "Cormorant Garamond", fontSans: "Poppins", fontDisplay: "Jost",
    palette: { primary: "#C8102E", secondary: "#FFCD00", text: "#006B3F", background: "#FFFBF2", muted: "#B55623" },
    chapterHeadingStyle: "dropcap-serif",
    useDropCap: true,
    defaultMargins: { top: 1.0, bottom: 1.0, left: 1.25, right: 1.0 },
    defaultPageSize: "6x9",
  },
  {
    name: "German Academic Core", category: "French / German text layouts", icon: "🇪🇺", styleFamily: "serif",
    fontSerif: "Playfair Display", fontSans: "Inter", fontDisplay: "Playfair Display",
    palette: { primary: "#2C3E50", secondary: "#7F8C8D", text: "#1A252F", background: "#F6F8F9", muted: "#95A5A6" },
    chapterHeadingStyle: "numbered-academic",
    useDropCap: false,
    defaultMargins: { top: 1.0, bottom: 1.0, left: 1.3, right: 1.0 },
    defaultPageSize: "A4",
  },
  {
    name: "Universal Receipts Simple", category: "Forms & invoices", icon: "🏷️", styleFamily: "sans",
    fontSerif: "Lora", fontSans: "Inter", fontDisplay: "Montserrat",
    palette: { primary: "#2C3E50", secondary: "#7F8C8D", text: "#111111", background: "#F9F9FA", muted: "#595959" },
    chapterHeadingStyle: "form-header",
    useDropCap: false,
    defaultMargins: { top: 0.5, bottom: 0.5, left: 0.5, right: 0.5 },
    defaultPageSize: "A4",
  },
  {
    name: "Standard Business Cards", category: "Premium prints layout", icon: "📇", styleFamily: "sans",
    fontSerif: "Lora", fontSans: "Inter", fontDisplay: "Montserrat",
    palette: { primary: "#1A1A1A", secondary: "#C5A880", text: "#2B2B2B", background: "#FFFDF9", muted: "#8C847E" },
    chapterHeadingStyle: "form-header",
    useDropCap: false,
    defaultMargins: { top: 0.35, bottom: 0.35, left: 0.35, right: 0.35 },
    defaultPageSize: "Custom",
  },
  {
    name: "Artistic Poster Classic", category: "Broadsheet typography", icon: "🖼️", styleFamily: "display",
    fontSerif: "Cormorant Garamond", fontSans: "Poppins", fontDisplay: "Jost",
    palette: { primary: "#C62828", secondary: "#1565C0", text: "#0D0D0D", background: "#FFF8E1", muted: "#D32F2F" },
    chapterHeadingStyle: "banner-bold",
    useDropCap: false,
    defaultMargins: { top: 1.3, bottom: 1.3, left: 1.5, right: 1.3 },
    defaultPageSize: "Custom",
  },
  {
    name: "SHS Practical Atlas", category: "Practical manuals", icon: "🗺️", styleFamily: "sans",
    fontSerif: "Lora", fontSans: "Inter", fontDisplay: "Montserrat",
    palette: { primary: "#006064", secondary: "#0097A7", text: "#00363A", background: "#F0F7F7", muted: "#00838F" },
    chapterHeadingStyle: "numbered-academic",
    useDropCap: false,
    defaultMargins: { top: 0.9, bottom: 0.9, left: 1.2, right: 0.9 },
    defaultPageSize: "8.5x11",
  },
  {
    name: "Wellness Protocol Reset", category: "Digestive healthy layouts", icon: "💧", styleFamily: "serif",
    fontSerif: "Playfair Display", fontSans: "Inter", fontDisplay: "Playfair Display",
    palette: { primary: "#0288D1", secondary: "#4FC3F7", text: "#01579B", background: "#E1F5FE", muted: "#0288D1" },
    chapterHeadingStyle: "numbered-academic",
    useDropCap: false,
    defaultMargins: { top: 1.0, bottom: 1.0, left: 1.25, right: 1.0 },
    defaultPageSize: "6x9",
  },
  {
    name: "The Sevenfold Pack", category: "Faith spiritual guidelines", icon: "🔥", styleFamily: "serif",
    fontSerif: "Playfair Display", fontSans: "Inter", fontDisplay: "Playfair Display",
    palette: { primary: "#D32F2F", secondary: "#FFA000", text: "#3E2723", background: "#FFFBF0", muted: "#C2185B" },
    chapterHeadingStyle: "dropcap-serif",
    useDropCap: true,
    defaultMargins: { top: 1.15, bottom: 1.15, left: 1.45, right: 1.15 },
    defaultPageSize: "6x9",
  },
  {
    name: "Creative Portfolios", category: "Personal synopses", icon: "🎨", styleFamily: "display",
    fontSerif: "Cormorant Garamond", fontSans: "Poppins", fontDisplay: "Jost",
    palette: { primary: "#B25E50", secondary: "#2E4F4F", text: "#212121", background: "#F4F1EA", muted: "#757575" },
    chapterHeadingStyle: "dropcap-serif",
    useDropCap: true,
    defaultMargins: { top: 1.1, bottom: 1.1, left: 1.4, right: 1.1 },
    defaultPageSize: "A4",
  },
  {
    name: "Bookstera Clean Pro", category: "General author layouts", icon: "⭐", styleFamily: "serif",
    fontSerif: "Playfair Display", fontSans: "Inter", fontDisplay: "Playfair Display",
    palette: { primary: "#37474F", secondary: "#78909C", text: "#263238", background: "#FAF9F5", muted: "#546E7A" },
    chapterHeadingStyle: "dropcap-serif",
    useDropCap: true,
    defaultMargins: { top: 1.0, bottom: 1.0, left: 1.25, right: 1.0 },
    defaultPageSize: "6x9",
  },
];

/** Lookup map by template name for fast access */
export const TEMPLATE_MAP: Record<string, TemplateDefinition> = TEMPLATE_DEFINITIONS.reduce(
  (acc, t) => ({ ...acc, [t.name]: t }),
  {} as Record<string, TemplateDefinition>
);

/** Fallback template if activeTemplate doesn't match any known name */
export const DEFAULT_TEMPLATE: TemplateDefinition = TEMPLATE_MAP["Bookstera Clean Pro"];

/** Resolve a template by name, falling back to the default */
export function resolveTemplate(activeTemplate?: string): TemplateDefinition {
  if (activeTemplate && TEMPLATE_MAP[activeTemplate]) {
    return TEMPLATE_MAP[activeTemplate];
  }
  return DEFAULT_TEMPLATE;
}

/** Page size dimensions in inches, for use in PDF/DOC export */
export const PAGE_SIZES: Record<string, { width: number; height: number }> = {
  "6x9": { width: 6, height: 9 },
  "5.5x8.5": { width: 5.5, height: 8.5 },
  "8.5x11": { width: 8.5, height: 11 },
  "A4": { width: 8.27, height: 11.69 },
  "Custom": { width: 6, height: 9 },
};
