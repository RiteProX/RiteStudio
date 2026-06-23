# RitemastaPro — Co-Build Session Log
**Date:** June 18, 2026  
**Participants:** Robert Ashley Nikoi (Founder & CEO, Ritemasta Publications) + Claude (Anthropic)

---

## Project Overview

**RitemastaPro** is a full-stack AI-powered publishing platform built for authors, educators, entrepreneurs, and content creators worldwide. Live at: https://rpstudio.onrender.com

**Stack:** React 19 + TypeScript + Vite + Express + Gemini API (gemini-2.5-flash) + Puppeteer + Chart.js + JSZip

---

## Session Summary

### Phase 1 — Recovery & Export from AI Studio
- Robert built original app in Google AI Studio but could not export/publish due to mobile browser limitations and Google Cloud paywall
- Files extracted file-by-file by asking Gemini to print raw code in chat
- App.tsx, server.ts, types.ts and all 13 components recovered

### Phase 2 — Codebase Fixes (Critical Bugs)
- Fixed invalid Gemini model name `gemini-3.5-flash` → `gemini-2.5-flash` (4 occurrences in server.ts)
- Fixed `vite.config.ts` mangled em-dash encoding bug (`â€"` corruption) — caused Rollup parseAst crash on Render
- Fixed truncated `App.tsx` (cut off mid-file in AI Studio export)
- Fixed JSX syntax bug in `IWriteStudio.tsx` — missing ternary else branch and mismatched fragment close

### Phase 3 — Pitch Deck PDF Pipeline (18-Section)
Built complete pitch deck generator modeled on KSGC 2025 submission (validated by 80+ industry experts):
- `server/pitchSynthesisPrompt.ts` — 18-section Gemini JSON schema
- `server/chartRenderer.ts` — server-side Chart.js chart rendering (bar/pie/line, themed)
- `server/pitchDeckTemplate.ts` — 1280×720 themed HTML slide template (18 slides)
- `server/pdfRenderer.ts` — Puppeteer HTML→PDF pipeline
- `src/types/pitchDeck.ts` — full TypeScript data model
- `/api/pitch/generate-pdf` endpoint added to server.ts
- UI added to IWriteStudio: theme color pickers, logo/flag/product image upload, download button

### Phase 4 — Premium Export Engine (28 Templates)
- `src/utils/templateSystem.ts` — 28 templates with per-category color palettes, fonts, chapter heading styles, margins, page sizes
- `src/utils/exporters.ts` — real EPUB3, Word-compatible DOC, HTML, XML, MOBI export
- Template categories: wellness, academic, fiction, poetry, magazine, coaching, faith, culinary, heritage, business, forms, receipts, portfolio
- Features: drop caps, 6 chapter heading styles, cover/logo/back-cover embedding, Google Fonts integration

### Phase 5 — Dependency & Build Fixes (Render.com)
Sequential build errors resolved:
1. `ERESOLVE` — chartjs-node-canvas@4.1.6 requires chart.js@^3.x not v4 → fixed to `chart.js@^3.9.1`
2. `Could not resolve "../utils/exporters"` — exporters.ts didn't exist → built it
3. `TypeError: import_chart.registerables is not iterable` — esbuild CJS interop bug → defensive import with `.default` fallback
4. Missing `server.ts`, `vite.config.ts`, `src/types.ts` from RiteStudios repo → merged from RCreator base

### Phase 6 — Repo Merge (RCreator + RiteStudios)
Two divergent GitHub repos discovered:
- **RCreator** (AI Studio direct export) — correct scaffolding, missing pitch deck pipeline, invalid model names
- **RiteStudios** (worked branch) — has all new features, missing server.ts/vite.config.ts/types.ts
- Merged into **RiteStudios-Merged-Final.zip** — complete, 49 files, clean type-check

### Phase 7 — Branding & UI Fixes
- Logo: replaced "RM" gold circle with bare `/logo.png` in Header, Footer, App hero, AuthScreen
- Yayra avatar: replaced Unsplash stock photos with `/Yayra_Avatar1.jpg` and `/Yayra_Avatar2.jpg`
- Founder photo: replaced Unsplash with `/Founder_Robert1.jpg` in About page and testimonials
- Testimonial 1: name changed to Prof. S. N. Okai, title: Lecturer & Senior Academic Fellow
- Testimonial 2: Robert Ashley Nikoi with correct founder image
- Page title: `index.html` changed from "My Google AI Studio App" → "RitemastaPro — Write. Design. Publish. Like a Pro."
- Meta description and og:title/description added for SEO and social sharing

### Phase 8 — Hero Carousel + Ticker Band
- `src/components/HeroCarousel.tsx` — full-width 16:9 auto-advancing carousel, supports images/GIFs/MP4 video, pause on hover, prev/next, dot indicators, 4.5s interval
- `src/components/TickerBand.tsx` — right-to-left continuous scrolling ticker, 15 messages covering features/pricing/comparisons, pauses on hover, gold separators, both CAROUSEL_SLIDES and TICKER_MESSAGES arrays editable at top of each file

### Phase 9 — Navigation & Polish Pass
- Header rebuilt: 3-column grid (nav left, brand center, auth right), gold active underline, hover effects, dropdown for secondary links, mobile hamburger
- Footer rebuilt: gold underline sweep on hover, arrow indicator slides in, section headers with gold left border, social icons with hover lift, real tel/mailto links
- `src/index.css`: gold focus rings, premium dark scrollbar, gold text selection, card-hover lift utility, glass utility, text-shimmer animation, smooth scroll

### Phase 10 — Active Bug (Under Fix)
- Clicking nav/footer links causes scroll bar to stop working, page flicks to top, content doesn't render
- Root cause: `handleTabChange` recursive call bug (`handleTabChange` calls itself instead of `setCurrentTab`) + `window.scrollTo` during React state transition causing scroll lock

---

## Known Issues & Next Steps

### Bugs Being Fixed This Session
- [ ] Navigation click causes scroll freeze and page flick to top
- [ ] Footer links not showing content
- [ ] Header dropdown menu items not working
- [ ] Hero section still shows 2-column layout on some screens

### Pending Features
- [ ] Dark mode / AI aesthetic toggle (obsidian + gold)
- [ ] Yayra "Book Wizard" conversational onboarding flow (like smithbook.com competitor)
- [ ] Smooth page transitions (currently broken due to transition bug)
- [ ] Statistics counter on homepage (visits, books done, exports)
- [ ] Additional carousel banner slides (slide2.jpg, slide3.jpg, slide4.jpg, promo.mp4)
- [ ] Admin password (`RiteLuxi26!2026#Ghana$Publishing@RitemastaPro`) — server protected, AdminPanel wired
- [ ] True .docx export via `docx` npm library (currently HTML-wrapped .doc)
- [ ] Puppeteer PDF export for books (currently window.print())

### Pricing Recommendation (Not Yet Implemented)
Current prices are too low. Recommended revision:
- Lifetime Publishing Pass: $25 → **$49**
- Design Studio standalone: $15 → **$29**  
- iWrite Pro standalone: $20 → **$39**
- New "Concierge" tier at **$149** (we format/export your book, 48hr delivery)

### Competitor Analysis — smithbook.com
- Conversational onboarding funnel (name → email → book title → subtitle → summary → author → phone → Stripe)
- Charges $27.93/book + $199 Publishing Concierge = $226.93 per book
- Sells AI-written books as a service, not a self-serve platform
- Stripe + Amazon Pay + card payments
- WhatsApp integration for delivery
- Recommendation: Add Yayra Book Wizard mode with same structured Q&A → auto-populate BookEditor

---

## File Structure (Current)

```
/
├── server.ts                     # Express backend, auth, Gemini proxy, PDF endpoint
├── server/
│   ├── chartRenderer.ts          # Chart.js server-side rendering
│   ├── pdfRenderer.ts            # Puppeteer PDF pipeline  
│   ├── pitchDeckTemplate.ts      # 18-slide HTML template engine
│   └── pitchSynthesisPrompt.ts   # Gemini 18-section schema
├── src/
│   ├── App.tsx                   # Main router and state
│   ├── types.ts                  # Shared TypeScript interfaces
│   ├── index.css                 # Global styles + micro-interactions
│   ├── types/pitchDeck.ts        # Pitch deck data types
│   ├── utils/
│   │   ├── exporters.ts          # EPUB/DOC/HTML/XML/MOBI export engine
│   │   └── templateSystem.ts     # 28-template design system
│   └── components/
│       ├── Header.tsx            # Nav (3-col: nav|brand|auth)
│       ├── Footer.tsx            # Footer with hover effects
│       ├── HeroCarousel.tsx      # Full-width carousel
│       ├── TickerBand.tsx        # Scrolling feature ticker
│       ├── AuthScreen.tsx        # Login/Register modal
│       ├── Dashboard.tsx         # User project hub
│       ├── BookEditor.tsx        # WYSIWYG editor
│       ├── LayoutDesigner.tsx    # Template/margin controls
│       ├── ExportPanel.tsx       # Export + payment
│       ├── IWriteStudio.tsx      # AI writing + pitch deck
│       ├── DesignEngine.tsx      # Cover/graphics
│       ├── ManuscriptParser.tsx  # Upload + auto-outline
│       ├── YayraChatbot.tsx      # Floating AI assistant
│       ├── AdminPanel.tsx        # Admin dashboard
│       ├── StaticPages.tsx       # About/Privacy/Terms
│       ├── ContactForm.tsx       # Support contact
│       └── Footer.tsx            # Footer
├── public/
│   ├── logo.png
│   ├── ritemasta-banner.jpg
│   ├── Founder_Robert1.jpg
│   ├── Foundet_Robert2.jpg
│   ├── Yayra_Avatar1.jpg
│   └── Yayra_Avatar2.jpg
├── index.html                    # Page title + meta tags
├── package.json                  # All dependencies
├── vite.config.ts                # Vite config (encoding bug fixed)
└── tsconfig.json
```

---

## Deployment Config

- **Host:** Render.com (Web Service)
- **Repo:** https://github.com/RiteProX/RiteStudios
- **Build:** `npm install && npm run build`
- **Start:** `npm start`
- **Env Var:** `GEMINI_API_KEY` = your Google AI Studio API key
- **Live URL:** https://rpstudio.onrender.com
- **Domain:** ritemastapro.com (pending registration on Namecheap → CNAME to Render)

---

## Business Context

**Robert Ashley Nikoi** — Founder & CEO  
Ritemasta Publications | Blemafoods GH | ZiPaPa Raw Naturals  
Koforidua, Ghana | blemafoods@gmail.com  
BN: BN360822013 | TIN: P0002032406  

**Payment accepted:** MTN MoMo · Telecel · SOL · BTC  
MTN: +233 249 845 856 | Telecel/WhatsApp: +233 500 119 195
