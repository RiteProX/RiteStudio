# RitemastaPro — Implementation Plan for Approval
**Prepared by:** Claude (Co-Build Pilot)  
**Date:** June 19, 2026  
**Status:** AWAITING APPROVAL before file generation

---

## SECTION A — Navigation & Menu Restructure

### A1. Header Nav — Rename "Features" to "Suites"
- Logged-out dropdown renamed from **Features** → **Suites**
- Suites dropdown contains: **iWrite Pro · Design Studio · Book Editor · Templates**
- All other nav items remain unchanged (Home, Pricing, About, Contact)

### A2. Remove Admin Panel from Dashboard
- AdminPanel tab removed from user dashboard visible items
- Admin Panel moved to: **Suites dropdown → bottom item** (only visible to admin users)
- Regular users never see Admin Panel link

### A3. Footer Links — Maintained
- All footer links kept as-is (already wired correctly)
- No changes to footer structure

---

## SECTION B — Authentication Upgrades

### B1. Password Visibility Toggle
- Eye/eye-off icon inside password input field
- Click toggles between `type="password"` and `type="text"`

### B2. Remember Me Checkbox
- Checkbox below password field
- When checked: saves encrypted session token to localStorage (7-day persistence)
- When unchecked: session clears on browser close

### B3. Forgot Password
- "Forgot password?" link below password field
- Opens a modal asking for email address
- Server sends a password reset code to email via `/api/auth/forgot-password`
- Note: requires an email sending service (Nodemailer or Resend) — will build the UI and endpoint stub; actual email delivery needs SMTP credentials added to `.env`

### B4. Social Sign-In Buttons (UI Only — Stub)
- Buttons displayed for: **Google · Facebook · LinkedIn · X (Twitter)**
- Currently rendered as UI buttons that show "Coming Soon — OAuth integration in progress"
- Note: Full OAuth requires registering app credentials with each provider (Google OAuth2, Facebook App, LinkedIn App, X Developer). This is a multi-day setup per provider requiring domain verification. Will build the UI and the server route stubs. You activate each by adding the credentials to `.env` when ready.

### B5. Passkey Sign-In (UI Stub)
- "Sign in with Passkey" button displayed
- Shows "Passkey support coming soon" until WebAuthn integration is built
- Full WebAuthn implementation is a separate dedicated build session

---

## SECTION C — Rich User Dashboard

### C1. User Profile Panel
- Full-width welcome banner with user's name and membership tier
- Profile photo upload (stored as base64 in user record, displayed as avatar)
- Profile info: name, email, member since date, access tier (Free / iWrite Pro / Design Studio / Lifetime)
- Edit name button (already works via `/api/auth/update`)

### C2. User Avatar in Header
- After sign-in, user's profile photo (or initials circle if no photo) appears top-right
- Clicking opens a mini dropdown: Dashboard · Settings · Sign Out

### C3. Works Gallery (Created Projects)
- Grid view of all user's projects with thumbnail preview, title, type badge, last edited date
- Categorized tabs: **All · Books · Ebooks · Presentations · Pitch Decks · Documents**
- Each card has: Open, Export, Delete actions
- Empty state shows a friendly "Start your first project" prompt

---

## SECTION D — Template Gallery (Visual, Clickable)

### D1. What's Being Fixed
- Currently clicking "Templates" shows only a settings panel (margins, fonts)
- Will add a **visual template gallery** as the first view when entering Layout tab
- Gallery shows rich preview cards for all 28 templates before the settings panel

### D2. Template Preview Cards
Each template card shows:
- **Visual thumbnail** — a styled HTML preview rendered in a small iframe/div showing the actual typography, colors, drop caps, and header style of that template
- **Template name + category badge + icon**
- **"Use This Template" button** — applies template and opens editor

### D3. Template Categories (Tabs)
- All (28) · Wellness (4) · Academic (4) · Fiction & Poetry (3) · Magazine (4) · Business & Pitch (3) · Coaching & Faith (5) · Receipts & Forms (3) · Portfolio (2)

---

## SECTION E — Cover Designer (AI + Upload)

### E1. What You Showed Me
Studying your uploads:
- **Ebook covers** (Chess Out, Bitter Leaf, SENT, STOP WATCHING, Coconut Lifestyle): dramatic full-bleed photography, large bold serif title, subtitle in italic, author name at bottom — all generated with AI image tools
- **Academic covers** (Geography, Social Studies): Ritemasta branding header, subject title in bold on colored background, NaCCA badge, author name, video library QR code
- **Business cards** (Crystal Deedove): clean two-color layout, logo left, contact details right, diagonal accent wave
- **Letterhead**: company header band, watermark logo center, footer strip

### E2. Cover Design Feature in Design Studio
**Cover Generator (AI-Assisted):**
- User selects cover type: Ebook · Academic Book · Business Card · Letterhead · Magazine Cover · Invoice Header
- User fills in: Title, Subtitle, Author Name, Publisher, colors, uploads logo
- Gemini generates a detailed cover design prompt
- Platform generates a styled HTML cover at the correct dimensions using the template system
- User can download as PNG/PDF via Puppeteer

**Upload Your Own Cover:**
- Users can upload a finished cover image (JPG/PNG) directly to attach to their project
- Uploaded cover replaces the AI-generated one in exports

### E3. Cover Templates by Category
Pre-designed CSS/HTML templates matching your reference designs:

| Template | Style | Based On |
|---|---|---|
| Ebook Hero | Full-bleed photo + bold title | Chess Out / Bitter Leaf style |
| Ebook Minimal | Clean cream background + botanical art | Coconut Protocol style |
| Academic Standard | Colored band header + NaCCA badge | Geography SHS style |
| Business Card Modern | Two-tone + logo left + wave accent | Crystal Deedove style |
| Letterhead Corporate | Header band + watermark | Crystal Deedove Letterhead style |
| Magazine Cover Bold | Full-bleed + masthead | GB&F Magazine style |
| Invoice Professional | Letterhead + table + totals | Pro Forma Invoice style |
| Receipt Simple | Compact logo + items + total | Receipt Book style |

---

## SECTION F — Magazine Template

### F1. Full Magazine Layout Template
Based on your GB&F Magazine (2013):
- **Cover page**: masthead, issue number/month/year, cover image, feature teasers
- **Table of Contents** page with section thumbnails
- **Editorial Team** page
- **Editor's Note / Suite** page
- **Article chapters**: pull quotes, drop caps, 2-column layout, image floats
- **Advertorial pages**: full-page ad layout with upload slot
- **Centre spread**: double-page photo gallery with captions
- **Back cover**: full-page ad/image upload slot

### F2. Magazine Variants
- Monthly · Bi-monthly · Quarterly · Annual (with issue number field)
- Categories: Beauty · Lifestyle · Sports · Food · Business & Finance · Christian/Faith · General

### F3. Magazine Export
- PDF export via Puppeteer pipeline (same as pitch deck)
- Each page at A4 (8.27" × 11.69") or US Letter

---

## SECTION G — About Page Updates

### G1. Corrections
- "Regional Geography and Atlas" → **"Regional and Human Geography"** (no Atlas)
- Fix all references to match the actual book title shown on the cover

### G2. Founder Section
- Robert Ashley Nikoi — Founder & CEO
- Published works listed: Regional & Human Geography (SHS), Social Studies (JHS/SHS), SENT, Chess Out, Stop Watching, The Bitter Leaf & Coconut Water Protocol, The Bitter Leaf Lifestyle
- Blemafoods GH / ZiPaPa Raw Naturals section
- LifePop YouTube channel mention
- Rhema Fire Generation / faith content mention
- Note about upcoming works: upcoming ebook and academic book covers shown are works-in-progress, not yet available

---

## SECTION H — Yayra AI Scope

**Answer: Yes — Yayra should answer general-purpose queries.**

Yayra will be enhanced to:
1. Answer general publishing, writing, and design questions
2. Guide users through the platform (current behavior)
3. Answer general knowledge questions (grammar, formatting standards, publishing industry, etc.)
4. **New: Book Wizard mode** — structured Q&A that collects book details and auto-creates a project (like smithbook.com competitor but smarter and integrated into the editor)

She will NOT answer: medical/legal advice, political topics, or anything unrelated to creative/professional work (those redirect back to publishing context).

---

## SECTION I — Accessibility & UX Toggles

### I1. Dark / Light Mode Toggle
- Toggle button in header (sun/moon icon)
- Dark mode: obsidian `#0F1117` base, gold accents, white text
- Light mode: current warm cream palette
- Preference saved to localStorage

### I2. Font Size Toggle
- Three sizes: Normal · Large · Extra Large
- Affects body text across the platform
- Stored in localStorage

### I3. Page Language Translation
- Dropdown in footer or header: English (default) · French · Swahili · Arabic · Twi/Akan
- Uses browser's built-in `translate` meta or integrates with Google Translate widget
- Note: Full professional translation requires either Google Cloud Translation API (paid) or pre-translated string files. Will implement the toggle UI and Google Translate widget integration (free for basic use)

---

## SECTION J — Paystack Integration

### J1. What Paystack Offers
- **Cost**: Free to sign up. Paystack charges **1.5% + GHS 0.50 per transaction** (capped at GHS 2,000). No monthly fee.
- **Accepts**: Mobile Money (MTN, Vodafone/Telecel, AirtelTigo), Visa/Mastercard, Bank Transfer, USSD, QR
- **Cryptocurrency**: Paystack does NOT support crypto directly. Your current MTN MoMo manual process covers that need better.
- **Ghana-specific**: Paystack Ghana is fully licensed and widely used — ideal for your market.

### J2. How Integration Works
1. Sign up at paystack.com → get Public Key + Secret Key
2. Add `PAYSTACK_SECRET_KEY` to Render environment variables
3. Frontend: load Paystack's inline popup JS → user clicks "Pay" → Paystack handles card/MoMo input
4. Backend: `/api/payment/verify` endpoint verifies transaction reference with Paystack API → if verified, activates user's license automatically
5. No more manual MoMo confirmation — payment is instant and automatic

### J3. Files Affected
- `server.ts` — add `/api/payment/initialize` and `/api/payment/verify` endpoints
- `src/components/ExportPanel.tsx` — replace manual MoMo instructions with Paystack popup button
- `.env.example` — add `PAYSTACK_SECRET_KEY` and `PAYSTACK_PUBLIC_KEY`

### J4. Implementation Plan (This Build)
- Build the full Paystack flow for the **$49 Lifetime Pass**
- Mobile Money auto-detected based on phone number format entered
- Successful payment automatically redeems the lifetime license (no admin code needed)
- Failed payments show clear error message with retry

---

## SECTION K — Pricing Update (Implement Now)

| Product | Old Price | New Price | GHS Equivalent |
|---|---|---|---|
| Lifetime Publishing Pass | $25 | **$49** | ₵724.50 |
| Design Studio Standalone | $15 | **$29** | ₵429.30 |
| iWrite Pro Standalone | $20 | **$39** | ₵576.90 |
| Concierge (new tier) | — | **$149** | ₵2,203.20 |

**Concierge Tier** ($149): User sends manuscript → Ritemasta team formats, designs cover, exports, and delivers within 48 hours. Premium hands-on service tier.

---

## FILES TO BE CREATED / MODIFIED

### New Files
| File | Purpose |
|---|---|
| `src/components/Dashboard.tsx` | Rich user dashboard (replace existing) |
| `src/components/TemplateGallery.tsx` | Visual template gallery with previews |
| `src/components/CoverDesigner.tsx` | AI + upload cover designer (replace/upgrade existing DesignEngine) |
| `src/components/MagazineTemplate.tsx` | Full magazine layout template |
| `src/components/DarkModeToggle.tsx` | Dark/light mode toggle with localStorage |
| `src/contexts/ThemeContext.tsx` | React context for dark mode + font size |

### Modified Files
| File | Changes |
|---|---|
| `src/components/Header.tsx` | Suites dropdown, user avatar, dark mode toggle, font size |
| `src/components/AuthScreen.tsx` | Password toggle, remember me, forgot password, social buttons, passkey |
| `src/components/StaticPages.tsx` | Fix About page (Regional & Human Geography, founder bio) |
| `src/components/ExportPanel.tsx` | Paystack integration, new pricing tiers |
| `src/components/YayraChatbot.tsx` | General-purpose queries + Book Wizard mode |
| `src/components/Footer.tsx` | Language toggle, dark mode, font size controls |
| `server.ts` | Paystack endpoints, password reset endpoint, photo upload |
| `src/index.css` | Dark mode CSS variables, font size classes |
| `src/App.tsx` | ThemeContext provider wrapping, dark mode class on root |

---

## WHAT IS NOT IN SCOPE THIS BUILD (Future Sessions)
- Full OAuth (Google/Facebook/LinkedIn/X) — requires external app registration per provider
- Full WebAuthn/Passkey — separate dedicated build
- Real email delivery for password reset — requires SMTP credentials from you
- Actual AI image generation for covers — requires Gemini Imagen API access (currently in limited preview; will use CSS/HTML template approach instead)
- Public author profile pages (`/@username`)
- Affiliate/referral system

---

## QUESTIONS FOR YOU BEFORE I BUILD

1. **Paystack**: Do you have a Paystack account already, or should I include signup instructions? Do you want Paystack as the primary payment (replacing the manual MoMo instructions) or alongside them?

2. **Social Login**: Confirm you understand these will show as "Coming Soon" buttons until you register developer apps with Google/Facebook/etc. — OK to proceed this way?

3. **Cover Gallery**: You said you don't want to upload your upcoming covers yet. Confirmed — the gallery will be empty by default and you upload your own works later. The platform will show **sample/demo covers** (styled HTML previews, not your actual files) to show users what's achievable. OK?

4. **Magazine template**: Should the magazine export be PDF-only, or also allow HTML export for digital magazine viewing in browser?

5. **Concierge tier ($149)**: How do you want to handle delivery? WhatsApp? Email? Or a dedicated submission form on the platform?

---

*Awaiting your approval and answers before generating any files.*
