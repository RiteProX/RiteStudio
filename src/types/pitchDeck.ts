/**
 * RitemastaPro - Pitch Deck Generator: Shared Types
 *
 * This defines the full data contract for the "Standard Global Pitch Deck"
 * template — modeled on the 13-section structure validated by the
 * 2025 K-Startup Grand Challenge (KSGC) evaluation (80+ industry experts).
 *
 * The structure is theme-agnostic: PitchTheme controls colors, logo,
 * flag/region accent, and fonts so any company/country can use it.
 */

export interface PitchTheme {
  /** Primary accent color, e.g. the gold band in the Blemafoods deck */
  primaryColor: string;
  /** Secondary accent, used for chart bars / highlights */
  secondaryColor: string;
  /** Dark text / heading color */
  textColor: string;
  /** Light background color for content slides */
  backgroundColor: string;
  /** Company tagline shown in the header band, e.g. "Innovating Africa's Food Legacy Sustainably" */
  tagline: string;
  /** Optional uploaded logo as a data URL or server path */
  logoUrl?: string;
  /** Optional flag/region accent image (data URL or server path) */
  flagUrl?: string;
  /** Heading font (serif/display) */
  fontDisplay: string;
  /** Body font (sans) */
  fontBody: string;
}

export const DEFAULT_PITCH_THEME: PitchTheme = {
  primaryColor: "#D4A853",
  secondaryColor: "#2D6B44",
  textColor: "#2D1B0E",
  backgroundColor: "#FFFDFB",
  tagline: "Innovating Sustainably, Built to Scale",
  fontDisplay: "Playfair Display",
  fontBody: "Inter",
};

/** A single bar/line/pie chart definition rendered server-side via chart.js */
export interface PitchChart {
  type: "bar" | "pie" | "line";
  title: string;
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color?: string;
  }[];
  xAxisLabel?: string;
  yAxisLabel?: string;
}

/** Team member entry for the Team slide */
export interface PitchTeamMember {
  name: string;
  role: string;
  bio: string;
  photoUrl?: string;
}

/** Testimonial entry */
export interface PitchTestimonial {
  quote: string;
  author: string;
  affiliation: string;
}

/** Funding allocation line item, used to build the funding pie chart */
export interface PitchFundingItem {
  label: string;
  amount: number;
}

/** Risk/mitigation pair */
export interface PitchRiskItem {
  risk: string;
  mitigation: string;
}

/**
 * Full pitch deck content model — one object covers all 13 standard
 * sections. Populated either by the Gemini synthesizer or directly by
 * the user via the guided form.
 */
export interface PitchDeckData {
  // 1.0 Cover
  companyName: string;
  productCategoryTags: string[]; // e.g. ["Spices", "Food Powders", "Teas"]
  pitchTitle: string; // e.g. "$500K Pitch Deck"
  competitionContext?: string; // e.g. "Entry for Korean Startup Challenge 2025"
  presenterName: string;
  presenterRole: string;
  coverImageUrl?: string;

  // 3.0 About Us
  aboutIntro: string;
  missionStatement: string;
  visionStatement: string;
  companySummary: string;
  foundedDate?: string;
  registrationDetails?: string;

  // 4.0 Problem
  problemHeadline: string;
  consumerPainPoints: { title: string; description: string }[];
  marketChallenges: { title: string; description: string }[];
  globalOpportunity: string;
  problemChart?: PitchChart;

  // 5.0 Market Opportunity
  marketGrowthPoints: string[];
  targetAudiencePoints: string[];
  marketChart?: PitchChart;

  // 6.0 Solution
  solutionHeadline: string;
  solvingKeyProblems: { title: string; description: string }[];
  uniqueApproach: { title: string; description: string }[];

  // 7.0 Business Model
  revenueStreams: { title: string; description: string }[];
  businessModelChart?: PitchChart; // typically a pie chart
  pricingStrategy: string[];
  scalabilityPoints: string[];

  // 8.0 Product Portfolio
  productImages: { url: string; caption?: string }[];
  portfolioCategories: { title: string; description: string }[];

  // 9.0 Traction
  marketValidation: string[];
  operationalMilestones: string[];
  tractionChart?: PitchChart;

  // 10.0 Go-To-Market Strategy
  gtmPhases: { phase: string; timeframe: string; points: string[] }[];
  marketingApproach: string[];
  gtmChart?: PitchChart; // typically a line chart

  // 11.0 Competitive Advantage
  uniqueAdvantages: { title: string; description: string }[];
  marketPositioning: { title: string; description: string }[];
  competitiveChart?: PitchChart; // typically a grouped bar chart

  // 12.0 Timeline
  timelineIntro: string;
  milestones: { date: string; description: string }[];
  timelineChart?: PitchChart;

  // 13.0 Funding Ask
  fundingRequestSummary: string;
  fundingAllocation: PitchFundingItem[]; // drives a pie chart
  expectedImpact: string[];

  // 14.0 Team
  teamMembers: PitchTeamMember[];
  plannedHires?: { title: string; description: string }[];

  // 15.0 Risks & Mitigation
  risks: PitchRiskItem[];

  // 16.0 Financial Projections
  financialProjections: { year: string; revenue: number; expenses: number; profit: number }[];
  financialChart?: PitchChart;
  financialAssumptions: string[];

  // 17.0 Contact Us
  contactName: string;
  contactPhones: string[];
  contactEmail: string;
  contactSocial: { label: string; url: string }[];
  closingStatement?: string;

  // 18.0 Appendix / Testimonials
  testimonials: PitchTestimonial[];

  // Theme
  theme: PitchTheme;
}
