# RitemastaPro Publishing Platform

> **Write. Design. Publish. Like a Pro.**

RitemastaPro is a full-stack intelligent publishing platform built for authors, educators, entrepreneurs, and content creators worldwide. It combines AI-powered writing assistance, professional book formatting across 28 premium templates, multi-format export (EPUB, DOCX, HTML, XML), and an automated investor pitch deck generator — all in one unified workspace.

**Live:** [https://rpstudio.onrender.com](https://rpstudio.onrender.com)

---

## Features

### 📚 Book Publishing Engine
- Drag-and-drop manuscript upload with automatic chapter extraction
- 28 premium layout templates across wellness, academic, fiction, poetry, magazine, coaching, faith, culinary, and business categories
- Full typography control (fonts, margins, line spacing, page size)
- Heritage dialect support — zero-crash rendering for Ga, Akan, and Ewe characters

### 📤 Multi-Format Export
- **EPUB 3** — valid package with embedded cover, logo, back cover, and chapter navigation
- **DOC** — Word-compatible with proper page size, margins, and MSO namespace formatting
- **HTML** — self-contained styled file with Google Fonts embedding
- **XML** — structured project data for archiving or pipeline integration
- **MOBI** — EPUB-based output (Kindle-compatible via Send to Kindle / KDP)

### 🚀 Investor Pitch Deck PDF Generator (iWrite Pro)
- Describe your business in plain language → Gemini AI synthesizes a complete 18-section structured deck
- Auto-generated charts (bar, pie, line) themed to your brand colors
- Upload your logo, flag/region accent, and product portfolio images
- Fully themeable: primary/secondary colors, header tagline — works for any company or country
- Downloads as a presentation-ready PDF (16:9 slides)
- Modeled on the deck structure validated by the 2025 K-Startup Grand Challenge (KSGC), evaluated by 80+ industry experts

### 🤖 Yayra AI Chatbot
- Floating AI assistant powered by Gemini
- Guides users through the platform, answers publishing questions, and provides writing help
- Context-aware: knows the active tab and current user

### ✍️ iWrite Studio
- AI drafting engine for books, novels, screenplays, academic manuscripts, and curricula
- Feed a syllabus or outline → get formatted chapter content
- Business document generator: letters, proposals, contracts, MOUs, pitch decks
- Real-time slide deck preview with KSGC-standard visual layout

### 🎨 Design Engine & Layout Designer
- Cover and graphics creation
- 28 template gallery with live preview
- Margin, font, and page dimension controls
- Typography validation for print-ready output

### 🔐 Authentication & Access
- Secure sign-up/login with SHA-256 password hashing
- Lifetime access pass system ($25 one-time, GHS 362.50) — no subscriptions
- Redeem codes for iWrite Pro, Design Studio, or full Lifetime access
- Mobile Money (MTN/Telecel), SOL, BTC, BNB payment support

### 🛡️ Admin Dashboard
- Password-protected admin panel
- License code generation and management
- User metrics, revenue tracking, and platform statistics

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| AI | Google Gemini API (gemini-2.5-flash) via @google/genai |
| PDF Generation | Puppeteer (server-side Chromium rendering) |
| Chart Rendering | chartjs-node-canvas, Chart.js v3 |
| EPUB Generation | JSZip (client-side EPUB 3 packaging) |
| Icons | lucide-react |
| Animation | motion (Framer Motion) |
| Persistence | JSON file store (server-side) |

---

## Local Development

Prerequisites: Node.js 18+, a Gemini API key from https://aistudio.google.com/app/apikey

```bash
git clone https://github.com/RiteProX/RiteStudios.git
cd RiteStudios
npm install
cp .env.example .env
# Edit .env and set GEMINI_API_KEY=your_key_here
npm run dev
```

App runs at http://localhost:3000

---

## Deployment (Render.com)

1. Push repo to GitHub
2. Create a new Web Service on Render, connect your repo
3. Build Command: npm install && npm run build
4. Start Command: npm start
5. Add environment variable: GEMINI_API_KEY = your Gemini API key
6. Deploy

---

## Credits

Founded and built by Robert Ashley Nikoi
Founder and CEO, Ritemasta Publications | Blemafoods GH | ZiPaPa Raw Naturals
Koforidua, Ghana | ritemasta@gmail.com
Business Registration: BN360822013 | TIN: P0002032406

---

## License

© 2026 Robert Ashley Nikoi / Ritemasta Publications. All rights reserved.
Proprietary software — not open source. Unauthorized reproduction or distribution is prohibited.
