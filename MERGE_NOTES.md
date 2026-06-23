# Merge Notes - RiteStudiosFinal (Consolidated Build)

This repo is a merge of two divergent branches that both descended from the
original AI Studio "RitemastaPro Publishing Platform" project:

- **RCreator** (direct AI Studio export): had the correct base scaffolding
  (`server.ts`, `vite.config.ts`, `src/types.ts`, `.gitignore`,
  `.env.example`, `package.json` with `@types/node`/`@types/express`) but
  was missing the Pitch Deck PDF pipeline and still had the invalid
  `gemini-3.5-flash` model name.
- **RiteStudios** (our worked branch): had the Pitch Deck PDF pipeline
  (`server/chartRenderer.ts`, `server/pdfRenderer.ts`,
  `server/pitchDeckTemplate.ts`, `server/pitchSynthesisPrompt.ts`,
  `src/types/pitchDeck.ts`), the premium template-driven exporters
  (`src/utils/exporters.ts`, `src/utils/templateSystem.ts`), and the
  18-section pitch deck UI in `IWriteStudio.tsx` - but was missing
  `server.ts`, `vite.config.ts`, and `src/types.ts` entirely (never
  re-uploaded after early fixes), so it could not build on its own.

## What this merge does

1. Base = RCreator's full file set (correct scaffolding).
2. Fixed the `vite.config.ts` mangled-em-dash encoding bug (present in
   both branches independently - watch for this recurring if AI Studio
   re-generates this file again).
3. Replaced all `gemini-3.5-flash` -> `gemini-2.5-flash` in `server.ts`
   (4 occurrences) - the old name is invalid and breaks every AI feature.
4. Replaced the old 13-field `/api/gemini/synthesize-pitch` endpoint with
   the 18-section schema version (`server/pitchSynthesisPrompt.ts`), and
   added the new `/api/pitch/generate-pdf` endpoint.
5. Added `server/` (chart rendering, PDF rendering, slide template,
   synthesis prompt) and `src/types/pitchDeck.ts` from RiteStudios.
6. Replaced `src/utils/exporters.ts` and `src/utils/templateSystem.ts`
   with the premium, template-driven versions (28 templates, drop caps,
   chapter heading styles, real EPUB/DOC/XML/HTML export, cover/logo/back
   cover embedding).
7. Used RiteStudios' `IWriteStudio.tsx` (has the 18-section Pitch Deck PDF
   generator UI plus all of RCreator's original features).
8. Merged `package.json`: RCreator's base + `puppeteer`,
   `chartjs-node-canvas`, `chart.js@^3.9.1` (peer-dep compatible),
   `jszip`, and added `@types/react` / `@types/react-dom` (were missing
   from both branches, causing widespread implicit-`any` lint noise -
   though this likely did not block the Vite/esbuild build itself).
9. Added `public/` images (founder photos, Yayra avatars, logo) from
   RiteStudios - currently unreferenced by any component; available for
   future use (About page, chatbot avatar, branding).

## Verification performed

Ran `npx tsc --noEmit` across the full merged repo. Remaining errors are
exclusively "cannot find module / @types not installed" (expected without
`node_modules`, which `npm install` resolves) - zero genuine syntax errors,
undefined names, or type mismatches (TS2304/TS2345/TS2322/TS2339/TS1xxx)
found anywhere in the merged codebase.

## Going forward

To avoid this branch-divergence problem recurring: make ALL future edits
in ONE repo only. If AI Studio is used to continue editing
`server.ts`/`vite.config.ts`/`src/types.ts`/etc., re-export those specific
files afterward and re-apply the fixes above (model name, synthesize-pitch
schema, generate-pdf endpoint, vite.config encoding) before redeploying.
