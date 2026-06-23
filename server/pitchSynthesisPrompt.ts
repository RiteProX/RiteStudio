/**
 * RitemastaPro - Pitch Deck Synthesizer Prompt
 *
 * Defines the full JSON schema (matching PitchDeckData minus theme/images)
 * that Gemini must return when expanding a user's raw business thoughts
 * into a complete 13-section investor pitch deck, modeled on the
 * standard validated by the 2025 K-Startup Grand Challenge submission.
 */

export const PITCH_DECK_JSON_SCHEMA = `{
  "companyName": "string - elegant startup name",
  "productCategoryTags": ["string", "string", "string"],
  "pitchTitle": "string - e.g. '$500K Pitch Deck'",
  "competitionContext": "string or null - e.g. 'Seed Funding Round 2026'",
  "presenterName": "string",
  "presenterRole": "string - e.g. 'Founder & CEO'",

  "aboutIntro": "string - 3-4 sentence company intro",
  "missionStatement": "string - 1-2 sentences",
  "visionStatement": "string - 1-2 sentences",
  "companySummary": "string - founding details, founder name, registration context",
  "foundedDate": "string or null",
  "registrationDetails": "string or null",

  "problemHeadline": "string - short framing line",
  "consumerPainPoints": [{"title": "string", "description": "string"}],
  "marketChallenges": [{"title": "string", "description": "string"}],
  "globalOpportunity": "string - 2-3 sentences with a market stat",
  "problemChart": {
    "type": "bar",
    "title": "string",
    "labels": ["string", "string"],
    "datasets": [{"label": "string", "data": [number, number]}],
    "yAxisLabel": "string"
  },

  "marketGrowthPoints": ["string", "string", "string"],
  "targetAudiencePoints": ["string", "string", "string"],
  "marketChart": {
    "type": "bar",
    "title": "string",
    "labels": ["string", "string", "string"],
    "datasets": [{"label": "string", "data": [number, number, number]}],
    "yAxisLabel": "string"
  },

  "solutionHeadline": "string",
  "solvingKeyProblems": [{"title": "string", "description": "string"}],
  "uniqueApproach": [{"title": "string", "description": "string"}],

  "revenueStreams": [{"title": "string", "description": "string"}],
  "businessModelChart": {
    "type": "pie",
    "title": "string - e.g. 'Year 1 Revenue Stream Breakdown'",
    "labels": ["string", "string", "string"],
    "datasets": [{"label": "Revenue Share", "data": [number, number, number]}]
  },
  "pricingStrategy": ["string", "string"],
  "scalabilityPoints": ["string", "string", "string"],

  "portfolioCategories": [{"title": "string", "description": "string"}],

  "marketValidation": ["string", "string", "string"],
  "operationalMilestones": ["string", "string", "string"],
  "tractionChart": {
    "type": "line",
    "title": "string - e.g. 'Revenue Growth'",
    "labels": ["string", "string", "string", "string"],
    "datasets": [{"label": "Revenue ($)", "data": [number, number, number, number]}],
    "xAxisLabel": "string",
    "yAxisLabel": "string"
  },

  "gtmPhases": [{"phase": "string", "timeframe": "string", "points": ["string", "string"]}],
  "marketingApproach": ["string", "string"],
  "gtmChart": {
    "type": "line",
    "title": "string - e.g. 'Go-to-Market Expansion Timeline'",
    "labels": ["string", "string", "string"],
    "datasets": [{"label": "Total Revenue ($)", "data": [number, number, number]}],
    "xAxisLabel": "Timeline",
    "yAxisLabel": "Revenue ($)"
  },

  "uniqueAdvantages": [{"title": "string", "description": "string"}],
  "marketPositioning": [{"title": "string", "description": "string"}],
  "competitiveChart": {
    "type": "bar",
    "title": "string - e.g. 'Competitive Advantage Comparison'",
    "labels": ["string", "string", "string"],
    "datasets": [
      {"label": "Company Name", "data": [number, number, number]},
      {"label": "Competitors", "data": [number, number, number]}
    ],
    "yAxisLabel": "Score (%)"
  },

  "timelineIntro": "string",
  "milestones": [{"date": "string", "description": "string"}],
  "timelineChart": {
    "type": "bar",
    "title": "string - e.g. 'Revenue Milestones by Period'",
    "labels": ["string", "string", "string"],
    "datasets": [{"label": "Revenue ($K)", "data": [number, number, number]}],
    "yAxisLabel": "Revenue ($K)"
  },

  "fundingRequestSummary": "string - 1-2 sentences stating the ask",
  "fundingAllocation": [{"label": "string", "amount": number}],
  "expectedImpact": ["string", "string", "string"],

  "teamMembers": [{"name": "string", "role": "string", "bio": "string"}],
  "plannedHires": [{"title": "string", "description": "string"}],

  "risks": [{"risk": "string", "mitigation": "string"}],

  "financialProjections": [
    {"year": "string", "revenue": number, "expenses": number, "profit": number}
  ],
  "financialChart": {
    "type": "bar",
    "title": "string - e.g. 'Revenue and Profit Growth'",
    "labels": ["string", "string", "string"],
    "datasets": [
      {"label": "Revenue", "data": [number, number, number]},
      {"label": "Profit", "data": [number, number, number]}
    ],
    "yAxisLabel": "Amount ($K)"
  },
  "financialAssumptions": ["string", "string"],

  "contactName": "string",
  "contactPhones": ["string"],
  "contactEmail": "string",
  "contactSocial": [{"label": "string", "url": "string"}],
  "closingStatement": "string or null",

  "testimonials": [{"quote": "string", "author": "string", "affiliation": "string"}]
}`;

export function buildPitchSystemInstruction(): string {
  return `You are the elite Pitch Deck Venture Expert of iWrite Pro, designed to analyze incomplete or messy startup notes and synthesize a professional investor pitch deck matching the high standard of decks that pass first-stage evaluation at the 2025 Korean Startup Grand Challenge (KSGC), reviewed by 80+ industry experts.

Based on the user's raw thoughts, expand and structure their ideas into a pristine, realistic, and highly compelling 18-section pitch deck content package (Cover, TOC, About Us, Problem, Market Opportunity, Solution, Business Model, Product Portfolio, Traction, Go-To-Market, Competitive Advantage, Timeline, Funding Ask, Team, Risks & Mitigation, Financial Projections, Contact, Testimonials).

Your output must be a single, strict JSON object matching this exact structure (do not include any explanation or markdown formatting like \\\`\\\`\\\`json):

${PITCH_DECK_JSON_SCHEMA}

Guidance:
- Every chart's "data" arrays must contain only plausible numeric values consistent with the narrative and with each other (e.g. profit = revenue - expenses).
- Use realistic, investment-grade numbers; if the user gives real traction figures, use them exactly and build projections from them.
- testimonials: generate 3-4 plausible, professional customer/partner quotes if none provided, clearly fictional-sounding placeholders the user can replace.
- teamMembers: include the presenter as the first entry; add 2-3 plausible role placeholders if the user gives no team info.
- Keep all bullet/description strings concise (1-2 sentences) — this is a slide deck, not a report.
- Align registration/legal references and currency framing to the user's stated country/region; default to neutral international framing if unspecified.
- Make every number internally consistent across problemChart, marketChart, tractionChart, gtmChart, timelineChart, financialChart, and fundingAllocation (e.g. fundingAllocation amounts should sum to the requested funding amount).`;
}
