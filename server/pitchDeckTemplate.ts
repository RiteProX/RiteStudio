/**
 * RitemastaPro - Pitch Deck Slide Template Generator
 *
 * Generates a full multi-slide HTML document (16:9, 1280x720 per slide)
 * matching the visual structure validated by the 2025 K-Startup Grand
 * Challenge submission: a colored header band with tagline + brand mark,
 * numbered sections (X.0 Title), bullet/two-column layouts, embedded
 * charts, and a product portfolio gallery.
 *
 * Fully themeable via PitchTheme — colors, logo, flag/region accent,
 * and fonts are all data-driven so any company/country can use it.
 */
import type { PitchDeckData, PitchTheme } from "../src/types/pitchDeck";

const SLIDE_W = 1280;
const SLIDE_H = 720;

function esc(s: string | undefined | null): string {
  if (!s) return "";
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Shared CSS for all slides, parameterized by theme */
function baseStyles(theme: PitchTheme): string {
  return `
    @page { size: ${SLIDE_W}px ${SLIDE_H}px; margin: 0; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: '${theme.fontBody}', sans-serif; color: ${theme.textColor}; }
    .slide {
      width: ${SLIDE_W}px;
      height: ${SLIDE_H}px;
      position: relative;
      overflow: hidden;
      background: ${theme.backgroundColor};
      page-break-after: always;
      display: flex;
      flex-direction: column;
    }
    .slide:last-child { page-break-after: auto; }
    .header-band {
      background: ${theme.primaryColor};
      color: #fff;
      padding: 18px 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 700;
      font-size: 20px;
      position: relative;
    }
    .header-band .tagline { font-style: italic; }
    .header-band .brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .header-band .brand img.logo { height: 40px; }
    .header-band .brand img.flag { height: 30px; border-radius: 3px; }
    .section-title {
      font-family: '${theme.fontDisplay}', serif;
      font-size: 34px;
      font-weight: 800;
      color: ${theme.textColor};
      margin: 28px 40px 4px 40px;
    }
    .section-subtitle {
      font-size: 18px;
      color: #6b5d50;
      margin: 0 40px 18px 40px;
    }
    .content {
      flex: 1;
      padding: 0 40px 30px 40px;
      display: flex;
      gap: 30px;
    }
    .col { flex: 1; }
    h3.block-title { font-size: 20px; font-weight: 700; margin: 0 0 8px 0; color: ${theme.textColor}; }
    ul.bullets { margin: 0; padding-left: 22px; line-height: 1.5; font-size: 15px; }
    ul.bullets li { margin-bottom: 8px; }
    .chart-img { width: 100%; max-height: 320px; object-fit: contain; }
    .cover-slide {
      align-items: center;
      justify-content: center;
      text-align: center;
      position: relative;
    }
    .cover-slide .cover-top-band {
      background: ${theme.primaryColor};
      color: #fff;
      width: 100%;
      padding: 22px 40px;
      font-size: 22px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .cover-slide .cover-main {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 14px;
    }
    .cover-slide .cover-main h1 {
      font-family: '${theme.fontDisplay}', serif;
      font-size: 52px;
      font-weight: 800;
      margin: 0;
      color: ${theme.textColor};
    }
    .cover-slide .cover-main h2 {
      font-size: 28px;
      font-weight: 600;
      color: ${theme.secondaryColor};
      margin: 0;
    }
    .cover-slide .cover-main p { font-size: 18px; margin: 4px 0; }
    .portfolio-gallery {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      padding: 0 40px 30px 40px;
      flex: 1;
    }
    .portfolio-gallery img {
      width: 100%;
      height: 180px;
      object-fit: cover;
      border-radius: 8px;
      border: 1px solid #eee;
    }
    .portfolio-gallery .caption { font-size: 12px; text-align: center; margin-top: 4px; color: #6b5d50; }
    .category-card {
      border: 2px solid ${theme.primaryColor}55;
      border-radius: 12px;
      padding: 14px 16px;
      margin-bottom: 14px;
      flex: 1;
    }
    .category-card h4 { margin: 0 0 6px 0; color: ${theme.secondaryColor}; font-size: 16px; }
    .category-card p { margin: 0; font-size: 14px; }
    .timeline-list, .milestone-list { list-style: none; padding: 0; margin: 0; }
    .timeline-list li, .milestone-list li {
      border-left: 3px solid ${theme.primaryColor};
      padding: 6px 14px;
      margin-bottom: 10px;
      font-size: 15px;
    }
    .timeline-list li b, .milestone-list li b { color: ${theme.secondaryColor}; }
    table.fin-table { width: 100%; border-collapse: collapse; font-size: 14px; }
    table.fin-table th, table.fin-table td { border: 1px solid #ddd; padding: 8px 10px; text-align: left; }
    table.fin-table th { background: ${theme.primaryColor}22; }
    .team-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; padding: 0 40px 30px 40px; flex: 1; }
    .team-member { display: flex; gap: 12px; align-items: flex-start; }
    .team-member img { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 2px solid ${theme.primaryColor}; }
    .team-member .name { font-weight: 700; font-size: 16px; }
    .team-member .role { font-size: 13px; color: ${theme.secondaryColor}; margin-bottom: 4px; }
    .team-member .bio { font-size: 13px; }
    .testimonial-card {
      border-left: 4px solid ${theme.primaryColor};
      background: #fafafa;
      padding: 12px 16px;
      margin-bottom: 12px;
      border-radius: 0 8px 8px 0;
      font-size: 14px;
    }
    .testimonial-card .quote { font-style: italic; }
    .testimonial-card .author { font-weight: 700; margin-top: 6px; font-size: 13px; }
    .closing-slide {
      align-items: center;
      justify-content: center;
      text-align: center;
      flex-direction: column;
      gap: 10px;
    }
    .closing-slide h1 { font-family: '${theme.fontDisplay}', serif; font-size: 44px; color: ${theme.textColor}; margin: 0; }
    .closing-slide h2 { font-size: 22px; color: ${theme.secondaryColor}; margin: 0 0 20px 0; }
    .closing-slide p { font-size: 16px; margin: 4px 0; }
    .slide-footer {
      position: absolute;
      bottom: 10px;
      right: 40px;
      font-size: 11px;
      color: #999;
    }
  `;
}

function headerBand(theme: PitchTheme): string {
  return `
    <div class="header-band">
      <span class="tagline">"${esc(theme.tagline)}"</span>
      <div class="brand">
        ${theme.flagUrl ? `<img class="flag" src="${theme.flagUrl}" />` : ""}
        ${theme.logoUrl ? `<img class="logo" src="${theme.logoUrl}" />` : ""}
      </div>
    </div>
  `;
}

function sectionHeader(num: string, title: string, subtitle?: string): string {
  return `
    <div class="section-title">${esc(num)} ${esc(title)}</div>
    ${subtitle ? `<div class="section-subtitle">${esc(subtitle)}</div>` : ""}
  `;
}

// ---- Individual slide builders ----

function coverSlide(data: PitchDeckData, theme: PitchTheme): string {
  return `
  <div class="slide cover-slide">
    <div class="cover-top-band">
      <span>"${esc(theme.tagline)}"</span>
      <span>${data.productCategoryTags.map(esc).join(" &nbsp;&bull;&nbsp; ")}</span>
    </div>
    <div class="cover-main">
      ${theme.logoUrl ? `<img src="${theme.logoUrl}" style="height:90px;margin-bottom:8px;" />` : ""}
      <h1>${esc(data.companyName)}</h1>
      <h2>${esc(data.pitchTitle)}</h2>
      ${data.competitionContext ? `<p>${esc(data.competitionContext)}</p>` : ""}
      <p style="margin-top:24px;">Prepared by:</p>
      <p style="font-weight:700;">${esc(data.presenterName)}, ${esc(data.presenterRole)}</p>
    </div>
    <div class="slide-footer">&copy; ${esc(data.companyName)}</div>
  </div>`;
}

function tocSlide(data: PitchDeckData, theme: PitchTheme): string {
  const items = [
    "1.0 Cover", "2.0 Table of Contents", "3.0 About Us", "4.0 Problem Statement",
    "5.0 Market Opportunity", "6.0 Our Solution", "7.0 Business Model",
    "8.0 Product Portfolio", "9.0 Traction", "10.0 Go-To-Market Strategy",
    "11.0 Competitive Advantage", "12.0 Timeline", "13.0 Funding Ask",
    "14.0 Team", "15.0 Risks & Mitigation", "16.0 Financial Projections",
    "17.0 Contact Us", "18.0 Appendix / Testimonials",
  ];
  const half = Math.ceil(items.length / 2);
  const col1 = items.slice(0, half);
  const col2 = items.slice(half);
  return `
  <div class="slide">
    ${headerBand(theme)}
    ${sectionHeader("2.0", "Table of Contents")}
    <div class="content">
      <div class="col"><ul class="bullets" style="list-style:none;padding-left:0;">${col1.map(i => `<li>${esc(i)}</li>`).join("")}</ul></div>
      <div class="col"><ul class="bullets" style="list-style:none;padding-left:0;">${col2.map(i => `<li>${esc(i)}</li>`).join("")}</ul></div>
    </div>
  </div>`;
}

function aboutSlide(data: PitchDeckData, theme: PitchTheme): string {
  return `
  <div class="slide">
    ${headerBand(theme)}
    ${sectionHeader("3.0", `${data.companyName}: Our Story`)}
    <div class="content">
      <div class="col">
        <h3 class="block-title">Introduction</h3>
        <p>${esc(data.aboutIntro)}</p>
        <h3 class="block-title">Mission Statement</h3>
        <p>${esc(data.missionStatement)}</p>
      </div>
      <div class="col">
        <h3 class="block-title">Vision Statement</h3>
        <p>${esc(data.visionStatement)}</p>
        <h3 class="block-title">Company Summary</h3>
        <p>${esc(data.companySummary)}</p>
        ${data.foundedDate ? `<p><b>Founded:</b> ${esc(data.foundedDate)}</p>` : ""}
        ${data.registrationDetails ? `<p><b>Registration:</b> ${esc(data.registrationDetails)}</p>` : ""}
      </div>
    </div>
  </div>`;
}

function problemSlide(data: PitchDeckData, theme: PitchTheme, chartImg?: string): string {
  return `
  <div class="slide">
    ${headerBand(theme)}
    ${sectionHeader("4.0", "Problem Statement", data.problemHeadline)}
    <div class="content">
      <div class="col">
        <h3 class="block-title">Consumer Pain Points</h3>
        <ul class="bullets">
          ${data.consumerPainPoints.map(p => `<li><b>${esc(p.title)}:</b> ${esc(p.description)}</li>`).join("")}
        </ul>
        <h3 class="block-title">Market Challenges</h3>
        <ul class="bullets">
          ${data.marketChallenges.map(p => `<li><b>${esc(p.title)}:</b> ${esc(p.description)}</li>`).join("")}
        </ul>
      </div>
      <div class="col">
        <h3 class="block-title">Global Opportunity</h3>
        <p>${esc(data.globalOpportunity)}</p>
        ${chartImg ? `<img class="chart-img" src="${chartImg}" />` : ""}
      </div>
    </div>
  </div>`;
}

function marketOpportunitySlide(data: PitchDeckData, theme: PitchTheme, chartImg?: string): string {
  return `
  <div class="slide">
    ${headerBand(theme)}
    ${sectionHeader("5.0", "Market Opportunity")}
    <div class="content">
      <div class="col">
        <h3 class="block-title">Market Growth</h3>
        <ul class="bullets">${data.marketGrowthPoints.map(p => `<li>${esc(p)}</li>`).join("")}</ul>
        <h3 class="block-title">Target Audience</h3>
        <ul class="bullets">${data.targetAudiencePoints.map(p => `<li>${esc(p)}</li>`).join("")}</ul>
      </div>
      <div class="col">
        ${chartImg ? `<img class="chart-img" src="${chartImg}" />` : ""}
      </div>
    </div>
  </div>`;
}

function solutionSlide(data: PitchDeckData, theme: PitchTheme): string {
  return `
  <div class="slide">
    ${headerBand(theme)}
    ${sectionHeader("6.0", "Our Solution", data.solutionHeadline)}
    <div class="content">
      <div class="col">
        <h3 class="block-title">Solving Key Problems</h3>
        <ul class="bullets">
          ${data.solvingKeyProblems.map(p => `<li><b>${esc(p.title)}:</b> ${esc(p.description)}</li>`).join("")}
        </ul>
      </div>
      <div class="col">
        <h3 class="block-title">Unique Approach</h3>
        <ul class="bullets">
          ${data.uniqueApproach.map(p => `<li><b>${esc(p.title)}:</b> ${esc(p.description)}</li>`).join("")}
        </ul>
      </div>
    </div>
  </div>`;
}

function businessModelSlide(data: PitchDeckData, theme: PitchTheme, chartImg?: string): string {
  return `
  <div class="slide">
    ${headerBand(theme)}
    ${sectionHeader("7.0", "Business Model", "Multi-Channel Revenue Strategy")}
    <div class="content">
      <div class="col">
        <h3 class="block-title">Revenue Streams</h3>
        <ul class="bullets">
          ${data.revenueStreams.map(p => `<li><b>${esc(p.title)}:</b> ${esc(p.description)}</li>`).join("")}
        </ul>
        <h3 class="block-title">Pricing Strategy</h3>
        <ul class="bullets">${data.pricingStrategy.map(p => `<li>${esc(p)}</li>`).join("")}</ul>
      </div>
      <div class="col">
        ${chartImg ? `<img class="chart-img" src="${chartImg}" />` : ""}
        <h3 class="block-title">Scalability</h3>
        <ul class="bullets">${data.scalabilityPoints.map(p => `<li>${esc(p)}</li>`).join("")}</ul>
      </div>
    </div>
  </div>`;
}

function portfolioSlide(data: PitchDeckData, theme: PitchTheme): string {
  return `
  <div class="slide">
    ${headerBand(theme)}
    ${sectionHeader("8.0", "Product Portfolio")}
    <div class="portfolio-gallery">
      ${data.productImages.slice(0, 6).map(img => `
        <div>
          <img src="${img.url}" />
          ${img.caption ? `<div class="caption">${esc(img.caption)}</div>` : ""}
        </div>`).join("")}
    </div>
    ${data.portfolioCategories.length ? `
    <div class="content" style="padding-top:0;">
      ${data.portfolioCategories.map(c => `
        <div class="category-card">
          <h4>${esc(c.title)}</h4>
          <p>${esc(c.description)}</p>
        </div>`).join("")}
    </div>` : ""}
  </div>`;
}

function tractionSlide(data: PitchDeckData, theme: PitchTheme, chartImg?: string): string {
  return `
  <div class="slide">
    ${headerBand(theme)}
    ${sectionHeader("9.0", "Traction", "Proven Demand and Early Wins")}
    <div class="content">
      <div class="col">
        <h3 class="block-title">Market Validation</h3>
        <ul class="bullets">${data.marketValidation.map(p => `<li>${esc(p)}</li>`).join("")}</ul>
        <h3 class="block-title">Operational Milestones</h3>
        <ul class="bullets">${data.operationalMilestones.map(p => `<li>${esc(p)}</li>`).join("")}</ul>
      </div>
      <div class="col">
        ${chartImg ? `<img class="chart-img" src="${chartImg}" />` : ""}
      </div>
    </div>
  </div>`;
}

function gtmSlide(data: PitchDeckData, theme: PitchTheme, chartImg?: string): string {
  return `
  <div class="slide">
    ${headerBand(theme)}
    ${sectionHeader("10.0", "Go-To-Market Strategy")}
    <div class="content">
      <div class="col">
        ${data.gtmPhases.map(ph => `
          <h3 class="block-title">${esc(ph.phase)} (${esc(ph.timeframe)})</h3>
          <ul class="bullets">${ph.points.map(p => `<li>${esc(p)}</li>`).join("")}</ul>
        `).join("")}
      </div>
      <div class="col">
        <h3 class="block-title">Marketing Approach</h3>
        <ul class="bullets">${data.marketingApproach.map(p => `<li>${esc(p)}</li>`).join("")}</ul>
        ${chartImg ? `<img class="chart-img" src="${chartImg}" />` : ""}
      </div>
    </div>
  </div>`;
}

function competitiveSlide(data: PitchDeckData, theme: PitchTheme, chartImg?: string): string {
  return `
  <div class="slide">
    ${headerBand(theme)}
    ${sectionHeader("11.0", "Competitive Advantage")}
    <div class="content">
      <div class="col">
        <h3 class="block-title">Unique Advantages</h3>
        <ul class="bullets">
          ${data.uniqueAdvantages.map(p => `<li><b>${esc(p.title)}:</b> ${esc(p.description)}</li>`).join("")}
        </ul>
        <h3 class="block-title">Market Positioning</h3>
        <ul class="bullets">
          ${data.marketPositioning.map(p => `<li><b>${esc(p.title)}:</b> ${esc(p.description)}</li>`).join("")}
        </ul>
      </div>
      <div class="col">
        ${chartImg ? `<img class="chart-img" src="${chartImg}" />` : ""}
      </div>
    </div>
  </div>`;
}

function timelineSlide(data: PitchDeckData, theme: PitchTheme, chartImg?: string): string {
  return `
  <div class="slide">
    ${headerBand(theme)}
    ${sectionHeader("12.0", "Timeline")}
    <div class="content">
      <div class="col">
        <p>${esc(data.timelineIntro)}</p>
        <ul class="timeline-list">
          ${data.milestones.map(m => `<li><b>${esc(m.date)}:</b> ${esc(m.description)}</li>`).join("")}
        </ul>
      </div>
      <div class="col">
        ${chartImg ? `<img class="chart-img" src="${chartImg}" />` : ""}
      </div>
    </div>
  </div>`;
}

function fundingSlide(data: PitchDeckData, theme: PitchTheme, chartImg?: string): string {
  return `
  <div class="slide">
    ${headerBand(theme)}
    ${sectionHeader("13.0", "Funding Ask", "Fuelling Sustainable Growth")}
    <div class="content">
      <div class="col">
        <h3 class="block-title">Request</h3>
        <p>${esc(data.fundingRequestSummary)}</p>
        <h3 class="block-title">Allocation</h3>
        <ul class="bullets">
          ${data.fundingAllocation.map(f => `<li><b>$${f.amount.toLocaleString()}:</b> ${esc(f.label)}</li>`).join("")}
        </ul>
      </div>
      <div class="col">
        ${chartImg ? `<img class="chart-img" src="${chartImg}" />` : ""}
        <h3 class="block-title">Expected Impact</h3>
        <ul class="bullets">${data.expectedImpact.map(p => `<li>${esc(p)}</li>`).join("")}</ul>
      </div>
    </div>
  </div>`;
}

function teamSlide(data: PitchDeckData, theme: PitchTheme): string {
  return `
  <div class="slide">
    ${headerBand(theme)}
    ${sectionHeader("14.0", "Core Team", "Experienced Leaders Driving Growth")}
    <div class="team-grid">
      ${data.teamMembers.map(m => `
        <div class="team-member">
          ${m.photoUrl ? `<img src="${m.photoUrl}" />` : `<div style="width:80px;height:80px;border-radius:50%;background:${theme.primaryColor}33;"></div>`}
          <div>
            <div class="name">${esc(m.name)}</div>
            <div class="role">${esc(m.role)}</div>
            <div class="bio">${esc(m.bio)}</div>
          </div>
        </div>`).join("")}
    </div>
    ${data.plannedHires?.length ? `
    <div class="content" style="padding-top:0;">
      <div class="col">
        <h3 class="block-title">Planned Additions</h3>
        <ul class="bullets">
          ${data.plannedHires.map(h => `<li><b>${esc(h.title)}:</b> ${esc(h.description)}</li>`).join("")}
        </ul>
      </div>
    </div>` : ""}
  </div>`;
}

function risksSlide(data: PitchDeckData, theme: PitchTheme): string {
  return `
  <div class="slide">
    ${headerBand(theme)}
    ${sectionHeader("15.0", "Risks & Mitigation", "Ensuring Sustainable Success")}
    <div class="content">
      <div class="col">
        <h3 class="block-title">Risks</h3>
        <ul class="bullets">${data.risks.map(r => `<li>${esc(r.risk)}</li>`).join("")}</ul>
      </div>
      <div class="col">
        <h3 class="block-title">Mitigation Strategies</h3>
        <ul class="bullets">${data.risks.map(r => `<li>${esc(r.mitigation)}</li>`).join("")}</ul>
      </div>
    </div>
  </div>`;
}

function financialsSlide(data: PitchDeckData, theme: PitchTheme, chartImg?: string): string {
  return `
  <div class="slide">
    ${headerBand(theme)}
    ${sectionHeader("16.0", "Financial Projections")}
    <div class="content">
      <div class="col">
        <table class="fin-table">
          <tr><th>Year</th><th>Revenue</th><th>Expenses</th><th>Profit</th></tr>
          ${data.financialProjections.map(f => `
            <tr><td>${esc(f.year)}</td><td>$${f.revenue.toLocaleString()}</td><td>$${f.expenses.toLocaleString()}</td><td>$${f.profit.toLocaleString()}</td></tr>
          `).join("")}
        </table>
        <h3 class="block-title" style="margin-top:14px;">Assumptions</h3>
        <ul class="bullets">${data.financialAssumptions.map(p => `<li>${esc(p)}</li>`).join("")}</ul>
      </div>
      <div class="col">
        ${chartImg ? `<img class="chart-img" src="${chartImg}" />` : ""}
      </div>
    </div>
  </div>`;
}

function contactSlide(data: PitchDeckData, theme: PitchTheme): string {
  return `
  <div class="slide closing-slide">
    <h1>Thank You</h1>
    <h2>${esc(data.closingStatement || "Let's Build Something Great Together")}</h2>
    <p style="font-weight:700;">${esc(data.contactName)}</p>
    ${data.contactPhones.map(p => `<p>${esc(p)}</p>`).join("")}
    <p>${esc(data.contactEmail)}</p>
    ${data.contactSocial.map(s => `<p>${esc(s.label)}: ${esc(s.url)}</p>`).join("")}
    <div class="slide-footer">&copy; ${esc(data.companyName)}</div>
  </div>`;
}

function testimonialsSlide(data: PitchDeckData, theme: PitchTheme): string {
  if (!data.testimonials.length) return "";
  const half = Math.ceil(data.testimonials.length / 2);
  const col1 = data.testimonials.slice(0, half);
  const col2 = data.testimonials.slice(half);
  return `
  <div class="slide">
    ${headerBand(theme)}
    ${sectionHeader("18.0", "Appendix: Testimonials")}
    <div class="content">
      <div class="col">${col1.map(t => `
        <div class="testimonial-card">
          <div class="quote">"${esc(t.quote)}"</div>
          <div class="author">&mdash; ${esc(t.author)}, ${esc(t.affiliation)}</div>
        </div>`).join("")}</div>
      <div class="col">${col2.map(t => `
        <div class="testimonial-card">
          <div class="quote">"${esc(t.quote)}"</div>
          <div class="author">&mdash; ${esc(t.author)}, ${esc(t.affiliation)}</div>
        </div>`).join("")}</div>
    </div>
  </div>`;
}

/**
 * Build the complete HTML document for all slides, with chart images
 * already rendered to data URLs and injected.
 */
export function buildPitchDeckHTML(data: PitchDeckData, chartImages: Record<string, string>): string {
  const theme = data.theme;

  const slides = [
    coverSlide(data, theme),
    tocSlide(data, theme),
    aboutSlide(data, theme),
    problemSlide(data, theme, chartImages.problemChart),
    marketOpportunitySlide(data, theme, chartImages.marketChart),
    solutionSlide(data, theme),
    businessModelSlide(data, theme, chartImages.businessModelChart),
    portfolioSlide(data, theme),
    tractionSlide(data, theme, chartImages.tractionChart),
    gtmSlide(data, theme, chartImages.gtmChart),
    competitiveSlide(data, theme, chartImages.competitiveChart),
    timelineSlide(data, theme, chartImages.timelineChart),
    fundingSlide(data, theme, chartImages.fundingChart),
    teamSlide(data, theme),
    risksSlide(data, theme),
    financialsSlide(data, theme, chartImages.financialChart),
    contactSlide(data, theme),
    testimonialsSlide(data, theme),
  ].filter(Boolean);

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<style>${baseStyles(theme)}</style>
</head>
<body>
${slides.join("\n")}
</body>
</html>`;
}
