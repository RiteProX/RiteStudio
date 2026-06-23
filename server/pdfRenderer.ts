/**
 * RitemastaPro - Pitch Deck PDF Renderer
 *
 * Takes the assembled slide HTML (from pitchDeckTemplate.ts) and renders
 * it to a multi-page PDF using Puppeteer, one page per 1280x720 slide
 * (16:9), matching standard presentation export dimensions.
 */
import puppeteer from "puppeteer";

const SLIDE_W = 1280;
const SLIDE_H = 720;

export async function renderHTMLToPDF(html: string): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: SLIDE_W, height: SLIDE_H });
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      width: `${SLIDE_W}px`,
      height: `${SLIDE_H}px`,
      printBackground: true,
      pageRanges: "",
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}
