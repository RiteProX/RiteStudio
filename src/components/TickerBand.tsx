/**
 * RitemastaPro - TickerBand
 *
 * Horizontally scrolling announcement/feature ticker displayed
 * directly below the HeroCarousel. Loops continuously right to left.
 *
 * ─────────────────────────────────────────────────────────────────
 *  TO EDIT TICKER MESSAGES: update the TICKER_MESSAGES array below.
 *  Each entry is a short string. A bullet separator is added between
 *  entries automatically. Keep each message under ~80 characters
 *  for best readability at mobile sizes.
 *
 *  Tips:
 *  - Lead with your strongest differentiator
 *  - Mix feature highlights, comparisons, and pricing
 *  - Include a call-to-action entry at the end
 * ─────────────────────────────────────────────────────────────────
 */

// ─── EDIT TICKER MESSAGES HERE ───────────────────────────────────
export const TICKER_MESSAGES: string[] = [
  "🚀 RitemastaPro — The World's Most Complete African Publishing Ecosystem",
  "📚 28 Premium Layout Templates — Wellness, Academic, Fiction, Poetry, Magazine & More",
  "✍️ Publish Like a Pro with AI-Powered Writing, Formatting & Export Tools",
  "💡 iWrite Studio: Generate Books, Proposals, Contracts & Pitch Decks with AI",
  "📤 Export to EPUB · DOC · HTML · XML · PDF — All Formats, One Platform",
  "💰 Lifetime Book Publishing Access — Just $25 (GHS ₵362.50) — No Subscriptions Ever",
  "🎨 Design Studio Standalone Access — $15 (GHS ₵217.50)",
  "🏆 Pitch Deck Generator: KSGC 2025 Validated — Evaluated by 80+ Industry Experts",
  "🌍 vs Vellum ($250, Mac Only) · vs Atticus ($147/yr) · vs Reedsy (% royalties) — RitemastaPro wins on price & features",
  "🇬🇭 Heritage Dialect Support — Ga, Akan & Ewe Characters Render Flawlessly",
  "🤖 Meet Yayra — Your AI Publishing Assistant, Available 24/7",
  "📱 Works on Desktop · Phones · Tablets · Chrome — Anywhere, Anytime",
  "🔐 Pay via MTN MoMo · Telecel · SOL · BTC — No Card Required",
  "📖 From Raw Manuscript to Published Book — Upload, Format, Export in Minutes",
  "⭐ Sign Up Free Today → Upgrade Once → Publish Forever",
];
// ─────────────────────────────────────────────────────────────────

const SCROLL_SPEED = 40; // pixels per second — increase to speed up

export default function TickerBand() {
  // Duplicate messages so the loop is seamless
  const items = [...TICKER_MESSAGES, ...TICKER_MESSAGES];
  const separator = " ◆ ";

  const fullText = items.join(separator);
  // Approximate character count for one full set to set animation duration
  const singleSetLength = TICKER_MESSAGES.join(separator).length;
  // ~8px per character at text-sm is a rough estimate
  const pixelWidth = singleSetLength * 7.5;
  const durationSeconds = pixelWidth / SCROLL_SPEED;

  return (
    <div
      className="w-full overflow-hidden bg-[#2D1B0E] border-t border-b border-[#D4A853]/30 py-2.5 select-none"
      aria-label="Feature announcements ticker"
    >
      <style>{`
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track {
          display: inline-flex;
          white-space: nowrap;
          animation: ticker-scroll ${durationSeconds}s linear infinite;
          will-change: transform;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="ticker-track">
        {items.map((msg, i) => (
          <span key={i} className="inline-flex items-center">
            <span className="text-[#FDF8F0] text-xs sm:text-sm font-medium px-1">
              {msg}
            </span>
            <span className="text-[#D4A853] font-bold px-2 text-sm" aria-hidden>
              {separator}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
