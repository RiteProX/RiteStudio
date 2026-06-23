/**
 * RitemastaPro - Client-Side Document Exporters
 *
 * Implements the export functions referenced by ExportPanel.tsx:
 * exportToXML, exportToHTML, exportToDOC, exportToEPUB, exportToMOBI.
 *
 * All functions take a Project and trigger a browser download of the
 * compiled document in the requested format. No server round-trip is
 * required for these formats (PDF export remains handled separately
 * via window.print() in ExportPanel, and the full themed Pitch Deck
 * PDF is handled server-side via /api/pitch/generate-pdf).
 */
import JSZip from "jszip";
import type { Project, Chapter } from "../types";
import { resolveTemplate, PAGE_SIZES, type TemplateDefinition } from "./templateSystem";

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function slugify(input: string): string {
  return (input || "untitled")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "untitled";
}

function escapeXml(str: string): string {
  return (str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Converts plain-text chapter content (with blank-line paragraph breaks) into HTML paragraphs */
function contentToHtmlParagraphs(content: string): string {
  return (content || "")
    .split(/\n\s*\n/)
    .map((para) => para.trim())
    .filter((para) => para.length > 0)
    .map((para) => `<p>${escapeXml(para).replace(/\n/g, "<br/>")}</p>`)
    .join("\n");
}

function sortedChapters(project: Project): Chapter[] {
  return [...(project.chapters || [])].sort((a, b) => a.order - b.order);
}

// ---------------------------------------------------------------------------
// Chapter heading renderers - one per ChapterHeadingStyle, driven by the
// resolved TemplateDefinition. Each returns the opening HTML for a chapter
// section (everything up through the heading; content + closing </section>
// is appended by the caller).
// ---------------------------------------------------------------------------

function renderChapterHeading(ch: Chapter, index: number, template: TemplateDefinition): string {
  const title = escapeXml(ch.title);
  switch (template.chapterHeadingStyle) {
    case "numbered-academic":
      return `
        <div class="chapter-number">Chapter ${index + 1}</div>
        <h1 class="chapter-title">${title}</h1>`;
    case "icon-prefixed":
      return `<h1 class="chapter-title"><span class="chapter-icon">${template.icon}</span>${title}</h1>`;
    case "minimal-rule":
      return `<hr class="chapter-rule" /><h1 class="chapter-title">${title}</h1>`;
    case "banner-bold":
      return `<div class="chapter-banner"><h1 class="chapter-title">${title}</h1></div>`;
    case "form-header":
      return `<h1 class="chapter-title">${title}</h1>`;
    case "dropcap-serif":
    default:
      return `<h1 class="chapter-title">${title}</h1>`;
  }
}

/** Applies a drop-cap span to the first letter of the first paragraph's HTML, if enabled */
function applyDropCap(paragraphsHtml: string, useDropCap: boolean): string {
  if (!useDropCap) return paragraphsHtml;
  const match = paragraphsHtml.match(/^<p>([\s\S])/);
  if (!match) return paragraphsHtml;
  const firstChar = match[1];
  return paragraphsHtml.replace(
    /^<p>([\s\S])/,
    `<p><span class="drop-cap">${firstChar}</span>`
  );
}

// ---------------------------------------------------------------------------
// Shared HTML body builder - used by exportToHTML, exportToDOC, and exportToEPUB
// ---------------------------------------------------------------------------

function buildBodyHTML(project: Project): string {
  const { metadata } = project;
  const chapters = sortedChapters(project);
  const template = resolveTemplate(project.layout?.activeTemplate);

  const titlePage = `
    <section class="title-page">
      ${metadata.coverImage ? `<img class="cover-image" src="${metadata.coverImage}" alt="Cover" />` : ""}
      ${metadata.logoImage ? `<img class="logo-image" src="${metadata.logoImage}" alt="Logo" />` : ""}
      <h1 class="book-title">${escapeXml(metadata.title || "Untitled Project")}</h1>
      ${metadata.subtitle ? `<h2 class="book-subtitle">${escapeXml(metadata.subtitle)}</h2>` : ""}
      <p class="book-author">${escapeXml(metadata.author || "")}</p>
      ${metadata.publisher ? `<p class="book-publisher">${escapeXml(metadata.publisher)}</p>` : ""}
      ${metadata.edition ? `<p class="book-edition">${escapeXml(metadata.edition)}</p>` : ""}
    </section>
    <section class="copyright-page">
      ${metadata.copyright ? `<p>${escapeXml(metadata.copyright)}</p>` : ""}
      ${metadata.isbn ? `<p>ISBN: ${escapeXml(metadata.isbn)}</p>` : ""}
    </section>
    <nav class="toc">
      <h2>Table of Contents</h2>
      <ol>
        ${chapters.map((ch) => `<li><a href="#chapter-${escapeXml(ch.id)}">${escapeXml(ch.title)}</a></li>`).join("\n")}
      </ol>
    </nav>
  `;

  const chapterSections = chapters
    .map((ch, idx) => {
      const heading = renderChapterHeading(ch, idx, template);
      const paragraphs = applyDropCap(contentToHtmlParagraphs(ch.content), template.useDropCap);
      return `
    <section class="chapter" id="chapter-${escapeXml(ch.id)}">
      ${heading}
      ${paragraphs}
    </section>`;
    })
    .join("\n");

  const backCoverPage = metadata.backCoverImage
    ? `
    <section class="back-cover-page">
      <img class="back-cover-image" src="${metadata.backCoverImage}" alt="Back Cover" />
    </section>`
    : "";

  return titlePage + chapterSections + backCoverPage;
}

/**
 * Builds the full CSS stylesheet for a project, fully driven by the
 * resolved TemplateDefinition (palette, fonts, chapter heading styling,
 * drop caps) and the project's LayoutSettings (margins, page size, body
 * font size, line spacing override the template defaults when present).
 *
 * @param embedGoogleFonts When true, includes @import url(...) for the
 *   template's Google Fonts (used by HTML/DOC exports, which render in
 *   browsers/Word that fetch external resources). EPUB readers generally
 *   do NOT fetch external fonts, so this is omitted for EPUB - the palette,
 *   layout, drop caps, and chapter styling still apply via fallback fonts.
 */
function buildStylesheet(project: Project, embedGoogleFonts: boolean = true): string {
  const layout = project.layout;
  const template = resolveTemplate(layout?.activeTemplate);
  const palette = template.palette;

  const lineHeight = layout?.lineSpacing === "2.0" ? 2 : layout?.lineSpacing === "1.5" ? 1.5 : 1.15;
  const bodyFontSize = layout?.bodyFontSize || 12;

  const fontSerif = layout?.fontSerif || template.fontSerif;
  const fontSans = layout?.fontSans || template.fontSans;
  const fontDisplay = layout?.fontDisplay || template.fontDisplay;

  const margins = {
    top: layout?.marginTop ?? template.defaultMargins.top,
    bottom: layout?.marginBottom ?? template.defaultMargins.bottom,
    left: layout?.marginLeft ?? template.defaultMargins.left,
    right: layout?.marginRight ?? template.defaultMargins.right,
  };

  const fontImport = embedGoogleFonts
    ? `@import url('https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontSerif)}:ital,wght@0,400;0,700;1,400&family=${encodeURIComponent(
        fontDisplay
      )}:wght@400;700;800&family=${encodeURIComponent(fontSans)}:wght@400;600;700&display=swap');`
    : "";

  // Chapter heading style block - varies by template.chapterHeadingStyle
  let chapterHeadingCSS = "";
  switch (template.chapterHeadingStyle) {
    case "numbered-academic":
      chapterHeadingCSS = `
        .chapter-number {
          font-family: '${fontSans}', sans-serif;
          font-size: 0.85em;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: ${palette.secondary};
          margin-bottom: 0.3em;
        }
        .chapter-title { font-size: 1.9em; border-bottom: 3px solid ${palette.primary}; padding-bottom: 0.3em; }
      `;
      break;
    case "icon-prefixed":
      chapterHeadingCSS = `
        .chapter-icon { font-size: 1.1em; margin-right: 0.4em; }
        .chapter-title { font-size: 1.8em; color: ${palette.primary}; }
      `;
      break;
    case "minimal-rule":
      chapterHeadingCSS = `
        .chapter-rule { border: none; border-top: 1px solid ${palette.muted}; margin: 2em auto 1.5em auto; width: 40%; }
        .chapter-title { font-size: 1.4em; text-align: center; font-weight: 400; letter-spacing: 0.05em; }
      `;
      break;
    case "banner-bold":
      chapterHeadingCSS = `
        .chapter-banner {
          background: ${palette.primary};
          color: #ffffff;
          padding: 0.8em 1em;
          margin: 0 -2rem 1.5em -2rem;
        }
        .chapter-banner .chapter-title { color: #ffffff; border: none; margin: 0; font-size: 1.9em; }
      `;
      break;
    case "form-header":
      chapterHeadingCSS = `
        .chapter-title {
          font-size: 1.3em;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          border-bottom: 1px solid ${palette.muted};
          padding-bottom: 0.4em;
        }
      `;
      break;
    case "dropcap-serif":
    default:
      chapterHeadingCSS = `
        .chapter-title { font-size: 1.9em; text-align: center; font-weight: 400; }
      `;
      break;
  }

  const dropCapCSS = template.useDropCap
    ? `
    .drop-cap {
      float: left;
      font-family: '${fontDisplay}', serif;
      font-size: 3.4em;
      line-height: 0.85;
      font-weight: 700;
      color: ${palette.primary};
      padding: 0.05em 0.08em 0 0;
    }
  `
    : "";

  return `
    ${fontImport}
    :root {
      --color-primary: ${palette.primary};
      --color-secondary: ${palette.secondary};
      --color-text: ${palette.text};
      --color-background: ${palette.background};
      --color-muted: ${palette.muted};
    }
    body {
      font-family: '${fontSerif}', serif;
      font-size: ${bodyFontSize}pt;
      line-height: ${lineHeight};
      color: var(--color-text);
      background: var(--color-background);
      max-width: 720px;
      margin: 0 auto;
      padding: ${margins.top}in ${margins.right}in ${margins.bottom}in ${margins.left}in;
    }
    h1, h2, .book-title, .chapter-title {
      font-family: '${fontDisplay}', serif;
    }
    .title-page { text-align: center; padding: 4rem 0; page-break-after: always; }
    .cover-image { max-width: 100%; max-height: 400px; margin-bottom: 1.5rem; border-radius: 4px; }
    .logo-image { max-width: 120px; max-height: 120px; margin: 0 auto 1rem auto; display: block; }
    .back-cover-page { text-align: center; padding: 0; page-break-before: always; }
    .back-cover-image { max-width: 100%; max-height: 100%; }
    .book-title { font-size: 2.4em; margin-bottom: 0.2em; color: var(--color-primary); }
    .book-subtitle { font-size: 1.3em; color: var(--color-secondary); font-weight: normal; }
    .book-author { margin-top: 1.5rem; font-size: 1.1em; }
    .book-publisher, .book-edition { font-size: 0.9em; color: var(--color-muted); }
    .copyright-page { font-size: 0.85em; color: var(--color-muted); text-align: center; padding: 2rem 0; page-break-after: always; }
    .toc { page-break-after: always; }
    .toc ol { padding-left: 1.5rem; }
    .toc a { text-decoration: none; color: var(--color-text); }
    .toc a:hover { color: var(--color-primary); }
    .chapter { page-break-after: always; }
    ${chapterHeadingCSS}
    ${dropCapCSS}
    p { margin: 0 0 1em 0; text-align: justify; }
  `;
}

// ---------------------------------------------------------------------------
// 1. HTML Export - single self-contained .html file
// ---------------------------------------------------------------------------

export function exportToHTML(project: Project): void {
  const title = project.metadata.title || "Untitled Project";
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${escapeXml(title)}</title>
  <style>${buildStylesheet(project)}</style>
</head>
<body>
${buildBodyHTML(project)}
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  downloadBlob(blob, `${slugify(title)}.html`);
}

// ---------------------------------------------------------------------------
// 2. XML Export - structured representation of the full project
// ---------------------------------------------------------------------------

export function exportToXML(project: Project): void {
  const { metadata, layout } = project;
  const chapters = sortedChapters(project);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<ritemastaProject id="${escapeXml(project.id)}" type="${escapeXml(project.type)}">
  <metadata>
    <title>${escapeXml(metadata.title)}</title>
    ${metadata.subtitle ? `<subtitle>${escapeXml(metadata.subtitle)}</subtitle>` : ""}
    <author>${escapeXml(metadata.author)}</author>
    ${metadata.publisher ? `<publisher>${escapeXml(metadata.publisher)}</publisher>` : ""}
    ${metadata.edition ? `<edition>${escapeXml(metadata.edition)}</edition>` : ""}
    ${metadata.isbn ? `<isbn>${escapeXml(metadata.isbn)}</isbn>` : ""}
    ${metadata.copyright ? `<copyright>${escapeXml(metadata.copyright)}</copyright>` : ""}
  </metadata>
  <layout pageSize="${escapeXml(layout?.pageSize || "")}" bodyFontSize="${layout?.bodyFontSize ?? ""}" lineSpacing="${escapeXml(layout?.lineSpacing || "")}" fontSerif="${escapeXml(layout?.fontSerif || "")}" fontSans="${escapeXml(layout?.fontSans || "")}" fontDisplay="${escapeXml(layout?.fontDisplay || "")}" activeTemplate="${escapeXml(layout?.activeTemplate || "")}" />
  <chapters>
    ${chapters
      .map(
        (ch) => `<chapter id="${escapeXml(ch.id)}" order="${ch.order}">
      <title>${escapeXml(ch.title)}</title>
      <content><![CDATA[${ch.content || ""}]]></content>
    </chapter>`
      )
      .join("\n    ")}
  </chapters>
  <createdAt>${escapeXml(project.createdAt)}</createdAt>
  <updatedAt>${escapeXml(project.updatedAt)}</updatedAt>
</ritemastaProject>`;

  const blob = new Blob([xml], { type: "application/xml;charset=utf-8" });
  downloadBlob(blob, `${slugify(metadata.title)}.xml`);
}

// ---------------------------------------------------------------------------
// 3. DOC Export - Word-compatible HTML (.doc), opens natively in MS Word
// ---------------------------------------------------------------------------

export function exportToDOC(project: Project): void {
  const title = project.metadata.title || "Untitled Project";
  const template = resolveTemplate(project.layout?.activeTemplate);
  const layout = project.layout;
  const pageDims = PAGE_SIZES[layout?.pageSize || template.defaultPageSize] || PAGE_SIZES["6x9"];
  const margins = {
    top: layout?.marginTop ?? template.defaultMargins.top,
    bottom: layout?.marginBottom ?? template.defaultMargins.bottom,
    left: layout?.marginLeft ?? template.defaultMargins.left,
    right: layout?.marginRight ?? template.defaultMargins.right,
  };

  // Word's HTML-import format: include the mso namespaces so Word treats
  // this as a proper document (page breaks, fonts, etc. are respected).
  const html = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="UTF-8" />
  <title>${escapeXml(title)}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page { size: ${pageDims.width}in ${pageDims.height}in; margin: ${margins.top}in ${margins.right}in ${margins.bottom}in ${margins.left}in; }
    ${buildStylesheet(project, false)}
    body { max-width: none; padding: 0; }
  </style>
</head>
<body>
${buildBodyHTML(project)}
</body>
</html>`;

  const blob = new Blob(["\ufeff", html], { type: "application/msword;charset=utf-8" });
  downloadBlob(blob, `${slugify(title)}.doc`);
}

/**
 * Decodes a data: URL image and adds it to the EPUB zip under
 * OEBPS/images/<name>.<ext>. Returns the relative path + media type for
 * manifest registration, or null if the input isn't a data URL (e.g.
 * already a remote http(s) URL, which we skip embedding for EPUB since
 * most e-readers work offline).
 */
function addDataUrlImageToZip(
  zip: JSZip,
  dataUrl: string | undefined,
  baseName: string
): { path: string; mediaType: string } | null {
  if (!dataUrl || !dataUrl.startsWith("data:")) return null;

  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;

  const mediaType = match[1];
  const base64Data = match[2];
  const ext = mediaType.split("/")[1]?.replace("jpeg", "jpg") || "png";
  const filename = `${baseName}.${ext}`;

  zip.folder("OEBPS")!.folder("images")!.file(filename, base64Data, { base64: true });

  return { path: `images/${filename}`, mediaType };
}

// ---------------------------------------------------------------------------
// 4. EPUB Export - valid EPUB 3 package via JSZip
// ---------------------------------------------------------------------------

export async function exportToEPUB(project: Project): Promise<void> {
  const { metadata } = project;
  const chapters = sortedChapters(project);
  const title = metadata.title || "Untitled Project";
  const bookId = `urn:uuid:ritemasta-${project.id}`;
  const modified = new Date().toISOString().replace(/\.\d+Z$/, "Z");

  const zip = new JSZip();

  // EPUB requires mimetype to be the first file, stored (uncompressed)
  zip.file("mimetype", "application/epub+zip", { compression: "STORE" });

  zip.folder("META-INF")!.file(
    "container.xml",
    `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`
  );

  const oebps = zip.folder("OEBPS")!;

  // Stylesheet
  oebps.file("style.css", buildStylesheet(project, false));

  // Embed cover/logo/back-cover images (if provided as data URLs)
  const coverImg = addDataUrlImageToZip(zip, metadata.coverImage, "cover");
  const logoImg = addDataUrlImageToZip(zip, metadata.logoImage, "logo");
  const backCoverImg = addDataUrlImageToZip(zip, metadata.backCoverImage, "back-cover");

  // Title/copyright/TOC page
  oebps.file(
    "title.xhtml",
    `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head><title>${escapeXml(title)}</title><link rel="stylesheet" type="text/css" href="style.css"/></head>
<body>
  <section class="title-page">
    ${coverImg ? `<img class="cover-image" src="${coverImg.path}" alt="Cover"/>` : ""}
    ${logoImg ? `<img class="logo-image" src="${logoImg.path}" alt="Logo"/>` : ""}
    <h1 class="book-title">${escapeXml(title)}</h1>
    ${metadata.subtitle ? `<h2 class="book-subtitle">${escapeXml(metadata.subtitle)}</h2>` : ""}
    <p class="book-author">${escapeXml(metadata.author || "")}</p>
    ${metadata.publisher ? `<p class="book-publisher">${escapeXml(metadata.publisher)}</p>` : ""}
  </section>
  <section class="copyright-page">
    ${metadata.copyright ? `<p>${escapeXml(metadata.copyright)}</p>` : ""}
    ${metadata.isbn ? `<p>ISBN: ${escapeXml(metadata.isbn)}</p>` : ""}
  </section>
</body>
</html>`
  );

  // Chapter XHTML files
  chapters.forEach((ch, idx) => {
    oebps.file(
      `chapter-${idx + 1}.xhtml`,
      `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head><title>${escapeXml(ch.title)}</title><link rel="stylesheet" type="text/css" href="style.css"/></head>
<body>
  <section class="chapter" id="chapter-${escapeXml(ch.id)}">
    <h1 class="chapter-title">${escapeXml(ch.title)}</h1>
    ${contentToHtmlParagraphs(ch.content)}
  </section>
</body>
</html>`
    );
  });

  // Back cover page (if a back cover image was provided)
  if (backCoverImg) {
    oebps.file(
      "back-cover.xhtml",
      `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head><title>Back Cover</title><link rel="stylesheet" type="text/css" href="style.css"/></head>
<body>
  <section class="back-cover-page">
    <img class="back-cover-image" src="${backCoverImg.path}" alt="Back Cover"/>
  </section>
</body>
</html>`
    );
  }

  // Navigation document (EPUB3 nav + legacy NCX for compatibility)
  oebps.file(
    "nav.xhtml",
    `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head><title>Table of Contents</title><link rel="stylesheet" type="text/css" href="style.css"/></head>
<body>
  <nav epub:type="toc" id="toc">
    <h1>Table of Contents</h1>
    <ol>
      <li><a href="title.xhtml">Title Page</a></li>
      ${chapters.map((ch, idx) => `<li><a href="chapter-${idx + 1}.xhtml">${escapeXml(ch.title)}</a></li>`).join("\n      ")}
    </ol>
  </nav>
</body>
</html>`
  );

  oebps.file(
    "toc.ncx",
    `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="${escapeXml(bookId)}"/>
  </head>
  <docTitle><text>${escapeXml(title)}</text></docTitle>
  <navMap>
    <navPoint id="navpoint-title" playOrder="1">
      <navLabel><text>Title Page</text></navLabel>
      <content src="title.xhtml"/>
    </navPoint>
    ${chapters
      .map(
        (ch, idx) => `<navPoint id="navpoint-${idx + 2}" playOrder="${idx + 2}">
      <navLabel><text>${escapeXml(ch.title)}</text></navLabel>
      <content src="chapter-${idx + 1}.xhtml"/>
    </navPoint>`
      )
      .join("\n    ")}
  </navMap>
</ncx>`
  );

  // Package document (content.opf)
  const imageManifestItems = [
    coverImg ? `<item id="cover-image" href="${coverImg.path}" media-type="${coverImg.mediaType}" properties="cover-image"/>` : "",
    logoImg ? `<item id="logo-image" href="${logoImg.path}" media-type="${logoImg.mediaType}"/>` : "",
    backCoverImg ? `<item id="back-cover-image" href="${backCoverImg.path}" media-type="${backCoverImg.mediaType}"/>` : "",
  ].filter(Boolean);

  const manifestItems = [
    `<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>`,
    `<item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>`,
    `<item id="css" href="style.css" media-type="text/css"/>`,
    `<item id="title" href="title.xhtml" media-type="application/xhtml+xml"/>`,
    ...chapters.map((_, idx) => `<item id="chapter-${idx + 1}" href="chapter-${idx + 1}.xhtml" media-type="application/xhtml+xml"/>`),
    ...(backCoverImg ? [`<item id="back-cover" href="back-cover.xhtml" media-type="application/xhtml+xml"/>`] : []),
    ...imageManifestItems,
  ].join("\n    ");

  const spineItems = [
    `<itemref idref="title"/>`,
    ...chapters.map((_, idx) => `<itemref idref="chapter-${idx + 1}"/>`),
    ...(backCoverImg ? [`<itemref idref="back-cover"/>`] : []),
  ].join("\n    ");

  oebps.file(
    "content.opf",
    `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="bookid">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="bookid">${escapeXml(bookId)}</dc:identifier>
    <dc:title>${escapeXml(title)}</dc:title>
    <dc:creator>${escapeXml(metadata.author || "")}</dc:creator>
    <dc:language>en</dc:language>
    ${metadata.publisher ? `<dc:publisher>${escapeXml(metadata.publisher)}</dc:publisher>` : ""}
    ${metadata.isbn ? `<dc:identifier>${escapeXml(metadata.isbn)}</dc:identifier>` : ""}
    ${metadata.copyright ? `<dc:rights>${escapeXml(metadata.copyright)}</dc:rights>` : ""}
    <meta property="dcterms:modified">${modified}</meta>
  </metadata>
  <manifest>
    ${manifestItems}
  </manifest>
  <spine toc="ncx">
    ${spineItems}
  </spine>
</package>`
  );

  const blob = await zip.generateAsync({ type: "blob", mimeType: "application/epub+zip" });
  downloadBlob(blob, `${slugify(title)}.epub`);
}

// ---------------------------------------------------------------------------
// 5. MOBI Export
// ---------------------------------------------------------------------------
// True .mobi/.azw3 generation requires Amazon's KindleGen/Kindle Previewer
// toolchain, which has no browser-compatible equivalent. As a practical
// fallback, this generates the same EPUB package (which Kindle's "Send to
// Kindle" and Amazon's pipeline both accept and auto-convert), and saves it
// with a clear filename + alerts the user with conversion guidance.
export async function exportToMOBI(project: Project): Promise<void> {
  const title = project.metadata.title || "Untitled Project";
  await exportToEPUB(project);

  // Use a brief delay so the EPUB download dialog isn't immediately
  // overwritten by the alert on slower mobile browsers.
  setTimeout(() => {
    alert(
      "✓ EPUB file downloaded.\n\nNote: Amazon Kindle no longer requires .mobi files directly — Kindle's 'Send to Kindle' service and KDP both accept EPUB and convert it automatically. " +
        `If you specifically need a .mobi/.azw3 file for '${title}', upload this EPUB to Amazon's Send to Kindle tool or KDP, and it will be converted during processing.`
    );
  }, 400);
}
