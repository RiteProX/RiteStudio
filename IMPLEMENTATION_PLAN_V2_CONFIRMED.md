# RitemastaPro — CONFIRMED Implementation Plan V2
**Status:** APPROVED — Ready for file generation  
**Date:** June 19, 2026

---

## CONFIRMED DECISIONS FROM ANSWERS

1. **Paystack** — Yes, full integration. Include signup instructions in README. Replace manual MoMo with Paystack as primary + keep crypto/manual as secondary option.
2. **Social Login buttons** — Go silent. No "Coming Soon" labels. Buttons simply not shown until OAuth is ready. Cleaner UX.
3. **Cover Gallery** — Confirmed. Empty by default. Styled HTML demo previews shown to illustrate capability. User uploads their own works later.
4. **Magazine export** — Both PDF and HTML (digital magazine). Multiple size options.
5. **Concierge tier** — Future plan. WhatsApp + email delivery when ready. Not in this build. Will add a "Notify Me" form stub.

**Additional confirmed items:**
- Markdown export added for books and ebooks
- Magazine sizes: A4, A5, US Letter, Tabloid, plus research-based premium global sizes
- Dark mode is the DEFAULT. Light mode is the alternative (3 colour variants)
- Spreadsheet functionality — deferred. Not essential for this build phase.

---

## BUILD SCOPE — FILES & CHANGES

---

### 1. `src/contexts/ThemeContext.tsx` — NEW FILE
React context providing:
- `darkMode: boolean` (default: `true`) + toggle
- `lightTheme: "warm" | "slate" | "pure"` (3 light colour variants)
- `fontSize: "normal" | "large" | "xl"`
- All persisted to localStorage

---

### 2. `src/index.css` — MODIFY
Add:
- Dark mode CSS variables (obsidian `#0F1117` base, gold accents)
- 3 light mode themes:
  - `warm` — current cream/brown palette
  - `slate` — cool grey/white with gold
  - `pure` — pure white minimal with gold
- Font size utility classes (`font-size-large`, `font-size-xl`)
- Dark mode scrollbar, selection colours
- `.dark` class on `<html>` triggers all dark overrides

---

### 3. `src/App.tsx` — MODIFY
- Wrap root with `ThemeProvider`
- Apply `dark` class to root `<div>` when dark mode active
- Add `fontSize` class to root div
- Pass `handleTabChange` correctly (recursive bug fix confirmed)

---

### 4. `src/components/Header.tsx` — MODIFY
Changes:
- **"Features" renamed to "Suites"**
- Suites dropdown: iWrite Pro · Design Studio · Book Editor · Templates
- Admin Panel removed from user-facing menus (only accessible via direct URL or hidden admin link)
- Add dark/light mode toggle button (sun/moon icon) — rightmost control
- Add font size toggle (A/A icon) — next to dark mode
- User avatar (photo or initials) top-right after sign-in with mini dropdown
- Publishing · Technology tagline always visible (restored)

---

### 5. `src/components/AuthScreen.tsx` — MODIFY
Changes:
- Password field: eye/eye-off toggle icon (show/hide password)
- "Remember Me" checkbox
- "Forgot Password?" link → inline email input → sends reset request to `/api/auth/forgot-password`
- Social login buttons: **removed entirely** (silent — no buttons shown)
- Passkey: **removed entirely** (silent)
- Profile photo upload slot on registration form

---

### 6. `src/components/Dashboard.tsx` — REBUILD
Full rich dashboard:
- **Welcome banner**: user name, tier badge, member since
- **Profile panel**: photo (upload/change), name, email, tier, edit button
- **Stats row**: Projects created · Exports done · Templates used · Member since
- **Works Gallery**: tabbed grid (All · Books · Ebooks · Presentations · Pitch Decks · Documents)
  - Each card: styled thumbnail, title, type badge, last edited, actions (Open / Export / Delete)
  - Empty state per category with "Start your first [type]" CTA
- **Quick Start buttons**: Create Book · Upload Manuscript · Generate Pitch Deck · Design Cover
- Admin Panel link only shown to admin users (detected by email match against env var `ADMIN_EMAIL`)

---

### 7. `src/components/TemplateGallery.tsx` — NEW FILE
Visual template selection gallery:
- **28 template preview cards** — each card renders a live HTML mini-preview showing:
  - Actual typography (font family, size, drop cap if applicable)
  - Colour palette (background, heading colour, accent)
  - Chapter heading style
  - Category icon + name + badge
- **Category tabs**: All · Wellness · Academic · Fiction & Poetry · Magazine · Business · Coaching & Faith · Receipts & Forms · Portfolio
- "Use This Template" button on each card → applies template, navigates to editor
- "Preview Full Page" button → shows a modal with a larger rendered preview

---

### 8. `src/components/CoverDesigner.tsx` — REBUILD (replaces DesignEngine)
Cover types supported:
- Ebook Cover (6×9" — standard Kindle/KDP)
- Academic Book Cover (6×9" or 8.5×11")
- Business Card (3.5×2" standard, 90×54mm EU)
- Letterhead (A4 or US Letter)
- Magazine Cover (A4, A5, Tabloid)
- Invoice/Receipt Header

**Workflow:**
1. User selects cover type
2. Fills guided form: title, subtitle, author, publisher, colours (colour pickers), uploads logo/photo
3. Gemini generates a styled description/prompt for the layout
4. Platform renders a professional HTML/CSS cover at correct dimensions
5. User can adjust colours, fonts, layout live
6. Download as PNG or PDF via Puppeteer

**Template styles** (based on your reference designs):
- Ebook Hero — full-bleed dramatic (Chess Out / SENT style)
- Ebook Minimal Botanical — cream + nature art (Bitter Leaf / Coconut Protocol style)
- Academic Gold Band — Ritemasta header + coloured band (Geography SHS style)
- Business Card Modern — two-tone + wave accent (Crystal Deedove style)
- Letterhead Corporate — header band + watermark logo
- Magazine Masthead Bold — full-bleed + masthead (GB&F style)
- Invoice Professional — header + itemised table
- Receipt Compact — logo + items + total

---

### 9. `src/components/MagazineTemplate.tsx` — NEW FILE
Full magazine layout engine:

**Page types:**
- Cover (full-bleed image + masthead + issue info)
- Table of Contents
- Editorial Team page
- Editor's Note / Suite
- Article page (2-column, drop caps, pull quotes, image floats)
- Advertorial (full-page ad slot — upload image)
- Centre Spread (double-page photo gallery)
- Back Cover (full-page ad/image upload)

**Magazine variants:**
- Frequency: Monthly · Bi-monthly · Quarterly · Annual
- Issue number + date field
- Categories: Beauty · Lifestyle · Sports · Food · Business & Finance · Christian/Faith · General

**Magazine sizes (research-confirmed premium global standards):**

| Size | Dimensions | Use Case |
|------|-----------|----------|
| A4 | 210×297mm | Standard international magazine |
| A5 | 148×210mm | POD digest / small format |
| US Letter | 8.5×11" | North American standard |
| US Tabloid | 11×17" | Large format / broadsheet |
| Digest | 5.5×8.5" | POD digest / trade paperback |
| Royal | 6.14×9.21" | Premium UK/Commonwealth |
| Crown Quarto | 7.44×9.69" | Academic/professional UK |
| Large Square | 8.5×8.5" | Coffee table / art magazine |

**Typography standards included:**
- Body: 9–11pt, justified, 120–130% leading
- Headlines: 24–72pt display serif or sans
- Captions: 7–8pt, grey
- Folios (page numbers): 8pt, footer or header
- Pull quotes: 14–18pt italic, gold accent rule

**Export:**
- PDF (Puppeteer — each page at correct dimensions)
- HTML (digital/responsive magazine for browser viewing)
- Markdown (text content extraction for archiving)

---

### 10. `src/utils/exporters.ts` — MODIFY
Add:
- **Markdown export** for books and ebooks
  - Front matter (title, author, publisher, ISBN)
  - Chapters as `## Chapter Title` headings
  - Paragraph content preserved
  - Images referenced as `![alt](path)`
  - Clean, portable `.md` file output

---

### 11. `src/components/ExportPanel.tsx` — MODIFY
Changes:
- Updated pricing: $49 Lifetime · $29 Design Studio · $39 iWrite Pro
- **Paystack integration** replacing manual MoMo instructions:
  - "Pay with Paystack" button opens Paystack inline popup
  - Accepts: MTN MoMo · Telecel · AirtelTigo · Visa/Mastercard · Bank Transfer · USSD
  - On success: calls `/api/payment/verify` → auto-activates license
  - Manual crypto/BTC payment kept as secondary option
- **Concierge tier ($149)** — "Notify Me" stub (email collection form) with note: "Launching soon — we'll notify you"
- Add markdown to export format list

---

### 12. `src/components/StaticPages.tsx` — MODIFY
About page fixes:
- "Regional Geography and Atlas" → **"Regional and Human Geography for Senior High Schools"**
- Founder bio updated: lists all published/upcoming works correctly
- Upcoming ebook/academic covers noted as "works in preparation — coming soon"
- Blemafoods GH / ZiPaPa Raw Naturals section
- LifePop YouTube channel
- Rhema Fire Generation / faith content

---

### 13. `src/components/YayraChatbot.tsx` — MODIFY
Extended to handle:
- General-purpose publishing/writing/design questions
- Grammar, formatting standards, publishing industry advice
- **Book Wizard mode**: triggered by "Help me start a book" → structured Q&A:
  1. Book title?
  2. Subtitle?
  3. Genre/category? (dropdown options)
  4. Brief summary or "I have a manuscript"?
  5. Author name?
  6. Preferred template? (shows 3 recommendations based on genre)
  7. → Auto-creates project with all details pre-filled → navigates to editor
- Redirects off-topic queries (medical/legal/political) back to publishing context

---

### 14. `server.ts` — MODIFY
New endpoints:
- `POST /api/auth/forgot-password` — accepts email, generates reset token, stores with expiry (email delivery stubbed — logs token to console until SMTP configured)
- `POST /api/auth/reset-password` — accepts token + new password, resets if valid
- `POST /api/auth/upload-photo` — accepts base64 image, stores in user record
- `POST /api/payment/initialize` — creates Paystack payment for given product tier
- `POST /api/payment/verify` — verifies Paystack reference, activates license automatically

---

### 15. `.env.example` — MODIFY
Add:
```
PAYSTACK_SECRET_KEY="sk_live_xxxx"
PAYSTACK_PUBLIC_KEY="pk_live_xxxx"
ADMIN_EMAIL="blemafoods@gmail.com"
SMTP_HOST=""
SMTP_PORT=""
SMTP_USER=""
SMTP_PASS=""
```

---

## MAGAZINE SIZES — RESEARCH SUMMARY (for implementation)

| Category | Size | Width | Height | Notes |
|----------|------|-------|--------|-------|
| Standard | A4 | 210mm | 297mm | Most common international |
| Compact | A5 | 148mm | 210mm | POD digest, pocket magazine |
| North American | US Letter | 8.5in | 11in | US/Canada standard |
| Large Format | US Tabloid | 11in | 17in | Broadsheet/newsprint style |
| POD Digest | 5.5×8.5in | 5.5in | 8.5in | Amazon KDP / IngramSpark |
| Premium UK | Royal | 6.14in | 9.21in | UK literary magazines |
| Academic UK | Crown Quarto | 7.44in | 9.69in | Professional/academic UK |
| Art/Coffee Table | Large Square | 8.5in | 8.5in | Visual/art magazines |
| European | B5 | 176mm | 250mm | European professional |
| Digest EU | A6 | 105mm | 148mm | Compact European |

**Typography baseline for magazine:**
- Body text: 9pt–11pt, justified, 14pt leading
- Sub-heading: 14pt–18pt
- Chapter/Section head: 24pt–48pt
- Caption: 7pt–8pt italic
- Folio: 8pt, aligned to outer margin
- Pull quote: 16pt–20pt italic, rule above and below
- Gutter (inner margin): 15mm minimum for binding

---

## PAYSTACK INTEGRATION GUIDE (for your records)

### Step 1 — Sign Up
1. Go to https://paystack.com/gh/signup
2. Register as a business (Ritemasta Publications)
3. Verify BVN/Ghana Card + business registration (BN360822013)
4. Bank account for settlements: your Ghana bank account

### Step 2 — Get API Keys
1. Dashboard → Settings → API Keys & Webhooks
2. Copy **Public Key** (`pk_live_...`) and **Secret Key** (`sk_live_...`)
3. Add both to Render environment variables

### Step 3 — Test Mode First
- Use test keys (`pk_test_...` / `sk_test_...`) first
- Test card: 4084 0840 8408 4081 · CVV: 408 · Expiry: 01/25
- Test MoMo: 0551234987

### Step 4 — Go Live
- Switch to live keys after testing
- Paystack charges: **1.5% + GHS 0.50 per transaction** (capped at GHS 2,000)
- Settlements: T+1 business day to your bank account

### Step 5 — Webhook (Optional but recommended)
- Set webhook URL: `https://rpstudio.onrender.com/api/payment/webhook`
- Paystack sends `charge.success` event → server auto-activates license even if user closes browser

---

## BUILD ORDER (Execution Sequence)

1. `ThemeContext.tsx` + `index.css` dark mode (foundation everything else uses)
2. `App.tsx` (wrap with ThemeProvider)
3. `Header.tsx` (Suites rename, dark toggle, font size, user avatar)
4. `AuthScreen.tsx` (password toggle, remember me, forgot password)
5. `Dashboard.tsx` (rich user dashboard)
6. `TemplateGallery.tsx` (visual 28-template gallery)
7. `CoverDesigner.tsx` (cover design engine)
8. `MagazineTemplate.tsx` (magazine layout)
9. `exporters.ts` (add markdown export)
10. `ExportPanel.tsx` (Paystack + new pricing)
11. `StaticPages.tsx` (about page fixes)
12. `YayraChatbot.tsx` (general queries + Book Wizard)
13. `server.ts` (new endpoints)
14. `.env.example` (new variables)

---

## OUT OF SCOPE THIS BUILD
- Full OAuth social login (requires external developer app registration per platform)
- WebAuthn/Passkey (separate dedicated build)
- Real email delivery for password reset (requires SMTP credentials from you)
- Concierge tier delivery system (future — WhatsApp/email, noted)
- Spreadsheet/Excel accounting functionality (deferred)
- AI image generation for covers (Gemini Imagen in limited preview — using HTML/CSS templates instead)
- Public author profile pages
- Affiliate/referral system
