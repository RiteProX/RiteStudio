import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface CarouselSlide {
  type: "image" | "video";
  src: string;
  alt: string;
  headline?: string;
  subline?: string;
  cta?: { label: string; action: string };
}

export const CAROUSEL_SLIDES: CarouselSlide[] = [
  {
    type: "image", src: "/ritemasta-banner.jpg",
    alt: "RitemastaPro — Turn Any Manuscript into a Masterpiece",
    headline: "Turn Any Manuscript into a Masterpiece",
    subline: "28 premium templates · AI-powered · One lifetime payment",
    cta: { label: "Start Free", action: "auth" },
  },
  {
    type: "image", src: "/slide2.jpg",
    alt: "28 Premium Publishing Templates",
    headline: "28 Premium Layout Templates",
    subline: "Wellness · Academic · Fiction · Magazine · Business & more",
    cta: { label: "Browse Templates", action: "layout" },
  },
  {
    type: "image", src: "/slide3.jpg",
    alt: "AI Pitch Deck Generator",
    headline: "Investor Pitch Decks in Minutes",
    subline: "KSGC 2025 validated · 18 sections · Auto-generated charts",
    cta: { label: "Try iWrite Pro", action: "iwrite_studio" },
  },
  {
    type: "image", src: "/slide4.jpg",
    alt: "Export to all formats",
    headline: "Export to Any Format",
    subline: "EPUB · DOC · HTML · Markdown · PDF — all from one platform",
    cta: { label: "See Export Options", action: "export" },
  },
  {
    type: "video", src: "/promo.mp4",
    alt: "RitemastaPro platform demo",
    headline: "Write. Design. Publish. Like a Pro.",
    subline: "The publishing platform built for African creators and educators",
    cta: { label: "Get Lifetime Access — $49", action: "export" },
  },
];

const INTERVAL = 5000;

interface HeroCarouselProps {
  onAction?: (action: string) => void;
}

export default function HeroCarousel({ onAction }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = CAROUSEL_SLIDES.length;

  const goTo = useCallback((idx: number) => {
    setFading(true);
    setTimeout(() => { setCurrent((idx + total) % total); setFading(false); }, 350);
  }, [total]);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    if (paused) return;
    timer.current = setInterval(next, INTERVAL);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [paused, next]);

  const slide = CAROUSEL_SLIDES[current];

  return (
    <div className="relative w-full overflow-hidden bg-black"
      style={{ aspectRatio: "21/9", maxHeight: 520, minHeight: 220 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}>

      {/* Slide */}
      <div className="absolute inset-0 transition-opacity duration-350" style={{ opacity: fading ? 0 : 1 }}>
        {slide.type === "video"
          ? <video src={slide.src} autoPlay muted loop playsInline className="w-full h-full object-cover" />
          : <img src={slide.src} alt={slide.alt} className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0"; }} />
        }
        {/* Gradient overlay */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)" }} />
      </div>

      {/* Text overlay */}
      {(slide.headline || slide.subline) && (
        <div className="absolute inset-0 flex items-center px-8 sm:px-16">
          <div className="max-w-lg space-y-3" style={{ opacity: fading ? 0 : 1, transition: "opacity 0.35s ease" }}>
            {slide.headline && (
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white leading-tight drop-shadow-lg">
                {slide.headline}
              </h2>
            )}
            {slide.subline && (
              <p className="text-sm sm:text-base text-white/80 leading-relaxed">{slide.subline}</p>
            )}
            {slide.cta && onAction && (
              <button onClick={() => onAction(slide.cta!.action)} className="btn-primary mt-2">
                {slide.cta.label} →
              </button>
            )}
          </div>
        </div>
      )}

      {/* Controls */}
      <button onClick={prev} aria-label="Previous"
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center z-10 transition-all"
        style={{ background: "rgba(0,0,0,0.5)", color: "#fff" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(212,168,83,0.8)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.5)")}>
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button onClick={next} aria-label="Next"
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center z-10 transition-all"
        style={{ background: "rgba(0,0,0,0.5)", color: "#fff" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(212,168,83,0.8)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.5)")}>
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {CAROUSEL_SLIDES.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`}
            className="rounded-full transition-all duration-300"
            style={{ width: i === current ? 24 : 8, height: 8, background: i === current ? "var(--accent)" : "rgba(255,255,255,0.4)" }} />
        ))}
      </div>

      {/* Progress bar */}
      {!paused && (
        <div className="absolute bottom-0 left-0 h-0.5 z-10"
          style={{ background: "var(--accent)", width: `${((current + 1) / total) * 100}%`, transition: "width 0.3s ease" }} />
      )}
    </div>
  );
}
