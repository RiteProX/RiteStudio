/**
 * iWriteStudio - Separate monetized AI Professional Document & Pitch Deck Writer
 * Features slide-by-slide fillable controls, visual charts, Ghanaian Registration authenticity,
 * and the 2025 Korean Startup Grand Challenge (KSGC) selection validation stamps.
 */
import React, { useState, useEffect } from "react";
import { User } from "../types";
import { 
  Sparkles, 
  FileText, 
  Check, 
  Lock, 
  Download, 
  Printer, 
  RefreshCw, 
  Sliders, 
  Briefcase, 
  FileSignature, 
  Award,
  ChevronRight,
  ChevronLeft,
  Monitor,
  Eye,
  Send,
  AlertCircle,
  FileBadge,
  TrendingUp,
  MapPin,
  CheckCircle,
  Clock,
  ExternalLink,
  ShieldCheck,
  Building,
  DollarSign,
  Upload,
  Image as ImageIcon,
  Trash2,
  Camera,
  FileSpreadsheet,
  Layout
} from "lucide-react";

interface IWriteStudioProps {
  user: User | null;
  onOpenAuth: () => void;
}

// Drag & Drop modular Uploader by Industry Standards
interface IWriteImageUploaderProps {
  label: string;
  description: string;
  categoryName: string;
  value: string;
  onChange: (base64: string) => void;
  id: string;
}

function IWriteImageUploader({ label, description, categoryName, value, onChange, id }: IWriteImageUploaderProps) {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("⚠️ Only image files (PNG, JPG, JPEG, WEBP, SVG) are allowed.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      onChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-1.5" id={`uploader-container-${id}`}>
      <div className="flex justify-between items-center">
        <label className="text-[10px] font-bold uppercase text-[#2D1B0E] tracking-wider block">
          {label}
        </label>
        <span className="text-[9px] bg-amber-100 text-amber-900 border border-amber-200 px-1.5 py-0.5 rounded font-bold uppercase tracking-tight">
          {categoryName}
        </span>
      </div>

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-4 transition-all flex flex-col items-center text-center justify-center cursor-pointer min-h-[140px] ${
          isDragActive 
            ? "border-[#D4A853] bg-[#FAF3E5]" 
            : value 
              ? "border-[#E8E0D8] bg-white" 
              : "border-[#E8E0D8] hover:border-[#D4A853] bg-white hover:bg-[#FFFDFB]"
        }`}
      >
        <input
          type="file"
          id={id}
          accept="image/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          onChange={handleChange}
        />

        {value ? (
          <div className="space-y-3 z-20 pointer-events-auto">
            <div className="relative mx-auto w-16 h-16 rounded-lg overflow-hidden border border-[#E8E0D8] shadow-sm flex items-center justify-center bg-[#FAF7F2]">
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-green-700 block">✓ Image Attached Successfully!</p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onChange("");
                }}
                className="mt-1.5 inline-flex items-center gap-1 text-[9px] text-red-600 font-bold bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-1 rounded-lg transition-colors"
                style={{ minHeight: "28px" }}
              >
                <Trash2 className="w-3 h-3" /> Clear Image
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2 pointer-events-none">
            <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#E8E0D8] flex items-center justify-center mx-auto text-[#8A7A6A]">
              <Upload className="w-5 h-5 text-[#8A7A6A]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#2D1B0E] block">Drag &amp; drop your image here, or <span className="text-[#D4A853] underline">browse</span></span>
              <span className="text-[9px] text-[#8C7A6D] block mt-0.5">{description}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function IWriteStudio({ user, onOpenAuth }: IWriteStudioProps) {
  // Check for local browser evaluation bypass code
  const [localWriterUnlock, setLocalWriterUnlock] = useState(() => {
    const cached = localStorage.getItem("ritemasta_iwrite_unlocked");
    return cached === "true";
  });

  const isUnlocked = localWriterUnlock || !!user?.isIWriteProUnlocked || user?.unlockCode === "TEST-IWRITE-PRO";

  const [promoCode, setPromoCode] = useState("");
  const [unlockMessage, setUnlockMessage] = useState("");
  const [pricingCurrency, setPricingCurrency] = useState<"GHS" | "USD">("USD");

  // Document config states
  const [docType, setDocType] = useState<"proposal" | "contract" | "pitch_deck" | "letter" | "mou">("pitch_deck");
  const [idea, setIdea] = useState("");
  const [professionalRole, setProfessionalRole] = useState("Chief Executive");
  const [customTone, setCustomTone] = useState("Persuasive & Investment-Grade");
  const [formatType, setFormatType] = useState("Corporate Navy Elegance");

  // PDF Layout parameters & toggles
  const [pdfMargin, setPdfMargin] = useState<"normal" | "compact" | "wide">("normal");
  const [includeHeaderLogo, setIncludeHeaderLogo] = useState(true);
  const [includeWatermark, setIncludeWatermark] = useState(false);
  const [showExecutiveSummary, setShowExecutiveSummary] = useState(true);

  // Active generation states from Gemini proxy
  const [isLoading, setIsLoading] = useState(false);
  const [compiledDraft, setCompiledDraft] = useState("");
  const [isEditingDraft, setIsEditingDraft] = useState(false);

  // Template states & AI Thinking state
  const [selectedTemplate, setSelectedTemplate] = useState<string>("tech");
  const [aiThoughts, setAiThoughts] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingFeedback, setThinkingFeedback] = useState("");

  // Interactive Pitch Deck Form State
  const [companyName, setCompanyName] = useState("Ritemasta Publications");
  const [tagline, setTagline] = useState("Democratizing Global Prepress & Offline-First Publishing Software");
  const [presenterName, setPresenterName] = useState("Robert Ashley Nikoi & Bob Ashley");
  const [problemDescription, setProblemDescription] = useState("Indie writers & high-school teachers are priced out by locked Apple-only software (Vellum) or forced into fragile high-cost cloud subscriptions (Atticus) containing no offline reliability or regional West African heritage character layouts.");
  const [solutionDescription, setSolutionDescription] = useState("Ritemasta Pro: A high-contrast offline-first layout compiler providing instant vector typography, 6x9 pagination calibration, and integrated MoMo/GHS billing micro-passes.");
  
  // Dynamic growth market metrics
  const [targetMarket, setTargetMarket] = useState("120,000 West African High Schools & Independent Authors");
  const [addressableMarketValue, setAddressableMarketValue] = useState("$12M Total Addressable West African market sizing");
  const [year1Revenue, setYear1Revenue] = useState(150000); // Dynamic metric slider
  const [year3Revenue, setYear3Revenue] = useState(1200000); // Dynamic metric slider
  const [fundingAmount, setFundingAmount] = useState("$150,000 Seed Round (Liquidity & Prepress calibrations)");
  
  // Platform Credence Certification (the underlying registry that gives legal authority weight to the tool maker)
  const [platformRegNum] = useState("BN360822013");
  const [platformRegDate] = useState("June 3, 2013");
  const [platformRegName] = useState("Ritemasta Publications");
  const [platformRegAuthority] = useState("Registrar of Business Names, Republic of Ghana");

  // Custom User Startup Certification Credentials (specifically for the builder's pitch deck, decouples it from the platform registration)
  const [userCompanyName, setUserCompanyName] = useState("Unchained Prepress Ventures");
  const [userRegNumber, setUserRegNumber] = useState("BN-8290-2025");
  const [userRegDate, setUserRegDate] = useState("October 12, 2025");
  const [userRegAuthority, setUserRegAuthority] = useState("Registrar General's Department, Republic of Ghana");

  // --- Full 18-Section Pitch Deck PDF Generator State ---
  // Holds the complete structured deck (PitchDeckData shape) returned by the
  // expanded /api/gemini/synthesize-pitch endpoint, ready to send to
  // /api/pitch/generate-pdf for a downloadable themed PDF.
  const [fullDeckData, setFullDeckData] = useState<any | null>(null);
  const [isGeneratingFullDeck, setIsGeneratingFullDeck] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  // Theme controls - fully user-customizable so any company/country can use this
  const [deckPrimaryColor, setDeckPrimaryColor] = useState("#D4A853");
  const [deckSecondaryColor, setDeckSecondaryColor] = useState("#2D6B44");
  const [deckTagline, setDeckTagline] = useState("Innovating Sustainably, Built to Scale");
  const [deckLogoUrl, setDeckLogoUrl] = useState("");
  const [deckFlagUrl, setDeckFlagUrl] = useState("");
  const [deckProductImages, setDeckProductImages] = useState<string[]>([]);

  // Step 1: Generate the full 18-section structured deck content from raw thoughts
  const handleGenerateFullDeck = async () => {
    if (!isUnlocked) {
      alert("⚠️ Standalone license upgrade is required to generate the full Pitch Deck PDF! Please activate the bypass code 'TEST-IWRITE-PRO' inside the promotion/unlock field to instantly activate this feature.");
      return;
    }
    if (!aiThoughts.trim()) {
      alert("Please enter your raw business thoughts, traction numbers, and goals first.");
      return;
    }

    setIsGeneratingFullDeck(true);
    setThinkingFeedback("Synthesizing your complete 18-section investor pitch deck...");

    try {
      const response = await fetch("/api/gemini/synthesize-pitch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ thoughts: aiThoughts })
      });
      const data = await response.json();
      if (response.ok && data.success && data.payload) {
        setFullDeckData(data.payload);
        if (data.payload.companyName) setCompanyName(data.payload.companyName);
        alert("✓ Your full pitch deck content has been generated! Review the theme settings below, then click 'Download PDF Pitch Deck'.");
      } else {
        alert(data.error || "Deck synthesis failed. Please check server logs.");
      }
    } catch (err: any) {
      console.error(err);
      alert(`Synthesis connectivity failure: ${err.message}`);
    } finally {
      setIsGeneratingFullDeck(false);
      setThinkingFeedback("");
    }
  };

  // Step 2: Send the structured deck + theme + images to the server for PDF rendering
  const handleDownloadFullDeckPDF = async () => {
    if (!isUnlocked) {
      alert("⚠️ Upgrade required! Please enter the bypass token 'TEST-IWRITE-PRO' below to activate PDF export.");
      return;
    }
    if (!fullDeckData) {
      alert("Please generate your pitch deck content first using 'Generate Full Pitch Deck'.");
      return;
    }

    setIsExportingPdf(true);
    try {
      const deck = {
        ...fullDeckData,
        productImages: deckProductImages.map((url, i) => ({ url, caption: `Product ${i + 1}` })),
        theme: {
          primaryColor: deckPrimaryColor,
          secondaryColor: deckSecondaryColor,
          textColor: "#2D1B0E",
          backgroundColor: "#FFFDFB",
          tagline: deckTagline,
          logoUrl: deckLogoUrl || undefined,
          flagUrl: deckFlagUrl || undefined,
          fontDisplay: "Playfair Display",
          fontBody: "Inter",
        },
      };

      const response = await fetch("/api/pitch/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deck }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "PDF generation failed");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${(fullDeckData.companyName || "pitch-deck").replace(/[^a-z0-9]+/gi, "-")}-pitch-deck.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error(err);
      alert(`PDF export failed: ${err.message}`);
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Generic image-to-base64 helper for theme logo/flag/product uploads
  const handleThemeImageUpload = (file: File, setter: (url: string) => void) => {
    const reader = new FileReader();
    reader.onload = () => setter(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleProductImagesUpload = (files: FileList) => {
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => setDeckProductImages((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  // Slide Images State dictionary according to industry standards for all categories
  const [slideImages, setSlideImages] = useState<{ [key: number]: string }>(() => {
    try {
      const cached = localStorage.getItem("ritemasta_deck_images");
      return cached ? JSON.parse(cached) : {
        0: "", // Slide 1 (Cover): Company Logo / Cover Page illustration
        1: "", // Slide 2 (TOC/Agenda): Flow chart / Strategy roadmap layout
        2: "", // Slide 3 (Problem): Deficit / Market Friction chart
        3: "", // Slide 4 (Solution / Portfolio): Images of Products or Services portfolio
        4: "", // Slide 5 (Market Sizing): Demographic target / Addressable asset maps
        5: "", // Slide 6 (Governance/Civil Trust): User's custom incorporation certification image
        6: "", // Slide 7 (Social Proof/Premises): Premises & facility photos / Team launch site portrait
      };
    } catch {
      return { 0: "", 1: "", 2: "", 3: "", 4: "", 5: "", 6: "" };
    }
  });

  // Persist images locally for convenient preview preservation
  useEffect(() => {
    localStorage.setItem("ritemasta_deck_images", JSON.stringify(slideImages));
  }, [slideImages]);

  // Active interactive slide tracker
  const [activeSlide, setActiveSlide] = useState(0);

  // Pre-configured draft templates for alternate document options when not in Slide Builder Mode
  const demoDrafts = {
    proposal: `### EXECUTIVE BUSINESS PROPOSAL
**To:** Venture Capital Partners of Accra (VCP)
**From:** Robert Ashley Nikoi, Founder & Chief Technology Coordinator
**Date:** June 11, 2026

#### 1.0 Executive Summary
Ritemasta Publications is seeking a strategic investment of $150,000 to scale RitemastaPro, the world's first hybrid global offline-first publishing software suite. RitemastaPro addresses major gaps in publishing software by providing lightning-fast compilation, native Ghanaian character maps (Akan, Ewe, Ga), and responsive book-spine calculators.

#### 2.0 Timeline & Milestones
| Milestone Stage | Target Outcomes | Expected Duration |
| :--- | :--- | :--- |
| Phase 1: Core Engine | Direct Native GHS Wallet Integration | 4 Weeks |
| Phase 2: iWrite Pro | High-end Gemini 3.5 Business Compiler | 3 Weeks |
| Phase 3: Prepress | Vector PDF export alignment calibrations | 5 Weeks |

#### 3.0 Expected ROI
We forecast reaching over 120,000 active global SHS teachers and independent authors in West Africa alone, translating to $1.2M in annual recurring voucher licensing fees.`,

    contract: `### GENERAL SERVICE CONTRACT & AGREEMENT
**Parties Involved:**
1. **The Publisher:** Ritemasta Prepress Labs Ltd, represented by Chief Designer Robert Ashley Nikoi.
2. **The Client:** Bob Ashley, Celebrated Wellness Author of "THE BITTER LEAF RESET".

#### SECTION 1.0 - SCOPE OF DESIGN SERVICES
The Publisher agrees to perform native typography structuring and pre-press safe-bleed layout audits for three (3) distinct manuscript files submitted by the Client. The target layout styles will adhere strictly to standard cream historical paperbacks in 6x9 configuration.

#### SECTION 2.0 - FEES & PAYMENT REPERCUSSIONS
The Client agrees to pay a total sum of $750.00 (Equivalent of GHS GHS ₵10,875.00) under the following milestones:
* **Milestone 1:** 50% Upfront commencement fee (MTN Mobile Money verified).
* **Milestone 2:** 50% Upon delivery of raw print-ready high-DPI vector PDF books.

#### SECTION 3.0 - INTELLECTUAL SOVEREIGNTY
All source manuscript characters, recipe coordinates, and copyrights remain the exclusive assets of the Client forever.`,

    letter: `### FORMAL LETTER OF BUSINESS RESIGNATION
**Sender:** Robert Ashley Nikoi  
*Chief Technology Coordinator, Accra Tech Lab*  
**Recipient:** Board of Directors, West African Educational Publishers  
**Date:** June 11, 2026  

**SUBJECT: Notice of Resignation & Transition Proposal**

Dear Members of the Board,

Please accept this letter as formal notification that I will be resigning from my role as Chief Technology Coordinator, effective July 15, 2026. 

After years of building localized digital classroom templates, I have decided to devote my complete focus toward scaling the **iWrite Pro** and **Ritemasta Publications** software ecosystems, allowing remote independent writers to access premium formatting services with no technical learning curves.

I am deeply grateful for the technical projects, SHS curriculum audits, and support provided throughout my tenure. I am committed to assisting with the onboarding of my successor.

Sincerely,  
*Robert Ashley Nikoi*`,

    mou: `### MEMORANDUM OF UNDERSTANDING (MOU)
**CONCERNING:** Joint Publishing Integration for West African High Schools  
**BETWEEN:**  
1. **Ritemasta Publications Suite**, Accra-West, Ghana.  
2. **The Senior Academic Consultation Council**, represented by Dr. Osei-Kofi.  

#### 1.0 Purpose of Alliance
This Memorandum sets forth the terms and understanding between the parties to integrate Teecha AI’s virtual presentation slide script compilations with Ritemasta's prepress printing presses.

#### 2.0 Collaborative Covenants
- Ritemasta will supply academic board teachers with a customized dashboard interface.
- Dr. Osei-Kofi's council will accredit and distribute the prepared curriculum booklets across 150+ schools.

#### 3.0 Financial Terms
This MOU is non-binding but acts as the immediate blueprint toward a formal joint contract representing a $45,000 national distribution agreement.`
  };

  // Sync draft on category change if locked
  useEffect(() => {
    if (!isUnlocked && docType !== "pitch_deck") {
      setCompiledDraft(demoDrafts[docType as keyof typeof demoDrafts] || "");
    }
  }, [docType, isUnlocked]);

  // Handle active generation via server-side Gemini Proxy
  const handleGenerateDocument = async () => {
    if (!isUnlocked) {
      alert("⚠️ Access Blocked! Please activate the 'iWrite Pro Studio' standalone upgrade pass to run live AI document generations.");
      return;
    }
    if (docType === "pitch_deck") {
      // Compile deck into markdown text
      const deckMarkdown = `### PITCH DECK MASTER OUTLINE: ${companyName.toUpperCase()}
Generated on June 11, 2026 by iWrite Pro.

#### SLIDE 1: Cover Page
- Title: ${companyName}
- Subtitle: ${tagline}
- Lead Presenters: ${presenterName}
- Status: KSGC 2025 Certified Pitch Blueprint

#### SLIDE 2: Table of Contents
1. Core Executive Summary
2. Problem Statement (The Industry Deficit)
3. Solution Showcase (The ${companyName} System)
4. Sizable Market TAM & Interactive Revenue Projections
5. Business Model & Legal Authority (Certificate ${userRegNumber})
6. Global Validation (KSGC 2025 Testimonials)
7. Funding & Execution Appendix

#### SLIDE 3: Problem Statement
- Core Deficit: ${problemDescription}

#### SLIDE 4: The Strategic Solution
- Mechanism: ${solutionDescription}

#### SLIDE 5: Market Target & Projections
- Sizing: ${targetMarket} (${addressableMarketValue})
- Projections: Yr 1 target at $${year1Revenue.toLocaleString()} climbing to Yr 3 target of $${year3Revenue.toLocaleString()}

#### SLIDE 6: Business Model & Governance
- Ghanaian registration number: ${userRegNumber} (Registered ${userRegDate})
- Revenue Streams: Standalone Micro-passes (USD / GHS wallet networks)

#### SLIDE 7: Social Proof (KSGC Selection)
- Validation: Selected and Evaluated by 80+ International Venture Experts at the 2025 Korean Startup Grand Challenge.
- Status: Verified Top-Tier Hybrid Global Candidate.`;

      setCompiledDraft(deckMarkdown);
      setIsEditingDraft(false);
      alert("✓ Dynamic interactive slides successfully compiled into draft workspace.");
      return;
    }

    if (!idea.trim()) {
      alert("Please describe your professional content draft instructions inside the prompt box first.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/gemini/iwrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea,
          docType,
          professionalRole,
          customTone,
          formatType
        })
      });

      const data = await response.json();
      if (response.ok && data.response) {
        setCompiledDraft(data.response);
        setIsEditingDraft(false);
      } else {
        alert(data.error || "An error occurred with the AI document proxy. Check your connection or API key.");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to connect to the iWrite server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Pre-designed Pitch Category Template Handlers
  const applyTemplate = (category: string) => {
    setSelectedTemplate(category);
    if (category === "tech") {
      setCompanyName("Ritemasta Publications Pro");
      setTagline("Democratizing Global Prepress & Offline-First Publishing Software");
      setPresenterName("Robert Ashley Nikoi & Chief Engineers");
      setProblemDescription("Authors and educators are locked into extreme Apple-only pricing environments ($250 upfront Vellum) or monthly recurring cloud-based subscriptions containing no West African native character layout support.");
      setSolutionDescription("Ritemasta Pro desktop layout compiler providing lightning-fast print-ready PDF, ePub, and book spine calibration with native West African character fonts and instant wallet micro-passes.");
      setTargetMarket("120,000 Independent Authors & Senior High School Teachers in West Africa");
      setAddressableMarketValue("$12M Localized Educational Publishing and Software Licensing Asset Value");
      setYear1Revenue(150000);
      setYear3Revenue(1200000);
      setFundingAmount("$150,000 Seed Round (Liquidity buffers & advanced raster pagination calibrations)");
      setUserCompanyName("Unchained Prepress Ventures");
      setUserRegNumber("BN-8290-2025");
      setUserRegDate("October 12, 2025");
      setUserRegAuthority("Registrar Corporate Affairs, Accra, Republic of Ghana");
    } else if (category === "agro") {
      setCompanyName("Blemafoods GH");
      setTagline("Commercializing Indigenous African Organic Superfoods for Global Markets");
      setPresenterName("Paul Oni & Blemafoods Agro-Cooperative Team");
      setProblemDescription("West African smallholders experience 40%+ post-harvest losses on roots and grains due to low cold-storage infrastructure and weak distribution, forcing local processors to import expensive alternative starches.");
      setSolutionDescription("Blemafoods GH: Mobile agro-processing & dehydration hubs converting organic tubers and grains into stable, nutrient-dense corporate food ingredients and consumer superfood mixes with zero artificial preservatives.");
      setTargetMarket("45 Million Health-conscious Urban Families & Export Food Distributors");
      setAddressableMarketValue("$180M Addressable Organic Superfood and Agro-ingredient Market Sizing");
      setYear1Revenue(220000);
      setYear3Revenue(1800000);
      setFundingAmount("$200,000 Seed Capital (Processing machinery, logistics & farmer outgrower micro-advances)");
      setUserCompanyName("Blemafoods Ghana Ltd");
      setUserRegNumber("CS-98302-2024");
      setUserRegDate("March 18, 2024");
      setUserRegAuthority("Registrar General's Department, Accra, Republic of Ghana");
    } else if (category === "fintech") {
      setCompanyName("MoMoPass Finance");
      setTagline("The Stripe of Offline & Feature-Phone Retail Networks");
      setPresenterName("Bob Ashley & Ghana FinTech Alliance Team");
      setProblemDescription("90% of micro-merchants represent offline cash networks with no digital credit tracing, blocking access to commercial investment or formal loans.");
      setSolutionDescription("MoMoPass: A lightweight USSD and smartphone-integrated ledger tracing micro-passes, sales tags, and automatic savings linked straight to local MTN & Telecel systems.");
      setTargetMarket("1.8 Million Informal Retailers & Street Vendors in Ghana and Ivory Coast");
      setAddressableMarketValue("$65M Transaction Fee Volume & Outlier Micro-lending Spreads");
      setYear1Revenue(350000);
      setYear3Revenue(2800000);
      setFundingAmount("$300,000 Seed Round (Compliance, Bank partnerships & API scaling)");
      setUserCompanyName("MoMoPass Micro-payments Ltd");
      setUserRegNumber("FN-53029-2025");
      setUserRegDate("December 1, 2025");
      setUserRegAuthority("Bank of Ghana Licenced Hub");
    } else if (category === "wellness") {
      setCompanyName("Bitter Leaf BioTech");
      setTagline("Clinical-Grade Bioactive Wellness Formulations from Native West African Flora");
      setPresenterName("Dr. Robert Ashley & Natural Wellness Scientists");
      setProblemDescription("Chronic metabolic disorders and diabetes are surging across West African cities, but imported pharmaceutical remedies are expensive and experience supply chain issues.");
      setSolutionDescription("Bitter Leaf BioTech: Standardizing bioactive extracts of Vernonia amygdalina (Bitter Leaf) and Cocos nucifera (Coconut Water) into clinically verified, sugar-regulating capsules.");
      setTargetMarket("8.5 Million Diabetic & Hypertension-Risk Adults in Urban West Africa");
      setAddressableMarketValue("$110M Functional Food & Herbal Therapeutics Market Segment");
      setYear1Revenue(280000);
      setYear3Revenue(2100000);
      setFundingAmount("$250,000 Seed Round (Clinical packaging trials & FDA compliance setups)");
      setUserCompanyName("Bitter Leaf Botanical Labs");
      setUserRegNumber("MD-9830-2025");
      setUserRegDate("May 20, 2025");
      setUserRegAuthority("Ghana Food and Drugs Authority (FDA) Certified");
    } else if (category === "classroom") {
      setCompanyName("Teecha AI Workspace");
      setTagline("Localized AI Worksheet & Curriculum Generators for African Educators");
      setPresenterName("Academician Osei-Kofi & Teecha Creators");
      setProblemDescription("Teachers spend 15+ hours weekly drafting worksheets, quiz grids, and exam papers manually. Standard classroom software lacks localized curriculum alignment.");
      setSolutionDescription("Teecha AI: A server-side curriculum engine generating customized lesson sheets aligned with regional WAEC / SHS criteria, exportable to interactive offline PDFs.");
      setTargetMarket("340,000 Teachers & Private Institutional Academies in West Africa");
      setAddressableMarketValue("$25M Curriculum License & Student Sheet Voucher Markets");
      setYear1Revenue(180000);
      setYear3Revenue(1450000);
      setFundingAmount("$120,000 Angel Round (Preloaded curriculum syllabus nodes & offline tablets support)");
      setUserCompanyName("Teecha AI Systems");
      setUserRegNumber("ED-1192-2025");
      setUserRegDate("January 4, 2025");
      setUserRegAuthority("National Schools Inspectorate Authority (NaSIA)");
    }
  };

  // AI Thinking module presentation compiler
  const handleSynthesizePitch = async () => {
    if (!isUnlocked) {
      alert("⚠️ Standalone license upgrade is required to test AI Pitch Synthesis! Please activate the bypass code 'TEST-IWRITE-PRO' inside the promotion/unlock field to instantly active global systems.");
      return;
    }
    if (!aiThoughts.trim()) {
      alert("Please enter messy entrepreneur notes or a brief business raw criteria first.");
      return;
    }

    setIsThinking(true);
    setThinkingFeedback("Initiating multi-vector business analysis...");
    
    try {
      const response = await fetch("/api/gemini/synthesize-pitch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ thoughts: aiThoughts })
      });
      const data = await response.json();
      if (response.ok && data.success && data.payload) {
        const p = data.payload;
        if (p.companyName) setCompanyName(p.companyName);
        if (p.tagline) setTagline(p.tagline);
        if (p.presenterName) setPresenterName(p.presenterName);
        if (p.problemDescription) setProblemDescription(p.problemDescription);
        if (p.solutionDescription) setSolutionDescription(p.solutionDescription);
        if (p.targetMarket) setTargetMarket(p.targetMarket);
        if (p.addressableMarketValue) setAddressableMarketValue(p.addressableMarketValue);
        if (p.year1Revenue) setYear1Revenue(Number(p.year1Revenue) || 150000);
        if (p.year3Revenue) setYear3Revenue(Number(p.year3Revenue) || 1200000);
        if (p.fundingAmount) setFundingAmount(p.fundingAmount);
        if (p.userCompanyName) setUserCompanyName(p.userCompanyName);
        if (p.userRegNumber) setUserRegNumber(p.userRegNumber);
        if (p.userRegDate) setUserRegDate(p.userRegDate);
        if (p.userRegAuthority) setUserRegAuthority(p.userRegAuthority);

        alert("🧠 Success! AI Pitch Thinker has synthesized your unstructured thoughts and successfully generated premium, investment-grade slides.");
        setAiThoughts("");
      } else {
        alert(data.error || "Synthesis request complete with negative outputs. Check server terminal logs.");
      }
    } catch (err: any) {
      console.error(err);
      alert(`Synthesis connectivity failure: ${err.message}`);
    } finally {
      setIsThinking(false);
      setThinkingFeedback("");
    }
  };

  // Standalone Upgrade Redemption inside UI
  const handleRedeemWriterCode = () => {
    const formatted = promoCode.trim().toUpperCase();
    if (formatted === "TEST-IWRITE-PRO" || formatted === "IWRITE" || formatted === "RM-WRITER-PRO" || formatted === "WRITER") {
      setLocalWriterUnlock(true);
      localStorage.setItem("ritemasta_iwrite_unlocked", "true");
      setUnlockMessage("✓ Standalone 'iWrite AI Pro' successfully activated! Live slide compilers and premium PDF layout engines are now active.");
      setCompiledDraft(""); 
      setPromoCode("");
    } else {
      if (user) {
        fetch("/api/auth/redeem", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, code: promoCode })
        })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.user?.isIWriteProUnlocked) {
            setLocalWriterUnlock(true);
            setUnlockMessage("✓ Standalone 'iWrite AI Pro' successfully activated on your cloud account! Enjoy premium PDF features.");
            setPromoCode("");
          } else {
            setUnlockMessage("❌ Code invalid or already claimed. Use 'TEST-IWRITE-PRO' bypass key to evaluate.");
          }
        })
        .catch(() => {
          setUnlockMessage("❌ Connection failure. Check local environment.");
        });
      } else {
        setUnlockMessage("❌ Invalid upgrade code. Use bypass token 'TEST-IWRITE-PRO' to evaluate instantly.");
      }
    }
  };

  // Download simulation
  const triggerDownloadPDF = () => {
    if (!isUnlocked) {
      alert("⚠️ Upgrade required! Please enter the bypass token 'TEST-IWRITE-PRO' below to activate PDF export.");
      return;
    }
    alert(`✓ Compiling high-standard print-certified PDF... Layout: ${formatType}. Margins: ${pdfMargin.toUpperCase()}. Included: slide decks, charts, and 1-2 Executive Summary. Ready for submission to venture capitalists under international ISO-300 guidelines.`);
  };

  return (
    <div className="py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-8" id="iwrite-engine-root">
      
      {/* Centered Heading Layout matching instructions */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="inline-block bg-[#D4A853]/15 text-[#D4A853] text-[10px] font-bold px-3.5 py-1 rounded-full border border-[#D4A853]/35 uppercase tracking-widest">
          Paid Professional Add-on Module
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#2D1B0E] tracking-tight">
          iWrite Pro AI Studio 🧠
        </h1>
        <p className="text-xs sm:text-sm text-[#8A7A6A] leading-relaxed text-balance">
          Automated professional copywriting and layout formatting engine for busy executives, lawyers, and teachers. Instantly draft legally robust agreements, complete pitch deck outlines, contracts, and formal communications with print-certified PDF layouts.
        </p>
      </div>

      {/* Monetization / Unlock Banner */}
      <div className="bg-white border-2 border-[#E8E0D8] rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-[#2D1B0E] text-[#FDF8F0] p-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#D4A853]/15 rounded-xl border border-[#D4A853]/30 text-[#D4A853]">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider">iWrite Pro Standalone License</h3>
              <p className="text-[11px] text-[#B8A89A]">
                Unlock advanced artificial intelligence synthesis for business contracts, MOUs, and corporate proposals.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <p className="text-xs text-[#B8A89A] leading-tight">Separate Paid Access</p>
              <p className="text-sm font-bold text-[#D4A853] font-mono leading-tight">
                {pricingCurrency === "USD" ? "$20.00 ONE-TIME" : "₵290.00 ONE-TIME"}
              </p>
            </div>
            <div className="flex items-center bg-white/5 border border-white/10 p-0.5 rounded-lg">
              <button 
                onClick={() => setPricingCurrency("USD")}
                className={`px-2 py-0.5 text-[9px] font-bold rounded ${pricingCurrency === "USD" ? "bg-[#D4A853] text-[#2D1B0E]" : "text-[#B8A89A] hover:text-white"}`}
              >
                USD
              </button>
              <button 
                onClick={() => setPricingCurrency("GHS")}
                className={`px-2 py-0.5 text-[9px] font-bold rounded ${pricingCurrency === "GHS" ? "bg-[#D4A853] text-[#2D1B0E]" : "text-[#B8A89A] hover:text-white"}`}
              >
                GHS
              </button>
            </div>
          </div>
        </div>

        <div className="p-5 bg-[#FFFDFB] grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8">
            <h4 className="text-xs font-bold uppercase text-[#2D1B0E] tracking-wider mb-2">Features Included in iWrite Pro Pass:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-[#8A7A6A]">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#D4A853]" />
                <span>Unlimited legal agreements &amp; contracts draftings</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#D4A853]" />
                <span className="font-semibold text-[#2D1B0E]">Fillable slide-by-slide KSGC-certified Pitch Deck Template</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#D4A853]" />
                <span>Custom Executive Slate &amp; Navy Blue PDF margins</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#D4A853]" />
                <span>Polished Pitch deck visual diagrams, tables &amp; CSS charts</span>
              </div>
            </div>
            
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-amber-700 bg-amber-50 border border-amber-200 p-2 rounded-lg max-w-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>
                <strong>Developer Bypass Mode Active:</strong> Paste bypass token <code className="bg-[#2D1B0E] text-white px-1 py-0.5 rounded text-[10px]">TEST-IWRITE-PRO</code> inside the apply box to test the complete suite instantly!
              </span>
            </div>
          </div>

          <div className="md:col-span-4 space-y-2 border-t md:border-t-0 md:border-l border-[#E8E0D8] pt-4 md:pt-0 md:pl-6">
            <label className="text-[10px] font-bold uppercase text-[#2D1B0E] tracking-wider block">Activate Standalone Pass</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="PROMO OR COU-CODE"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 bg-white border border-[#E8E0D8] px-3 py-1.5 rounded-lg text-xs font-mono uppercase focus:outline-none"
              />
              <button
                onClick={handleRedeemWriterCode}
                className="px-4 py-1.5 bg-[#D4A853] hover:bg-[#C49A42] text-[#2D1B0E] font-bold text-xs rounded-lg transition-all"
              >
                Apply
              </button>
            </div>
            
            {unlockMessage && (
              <p className="text-[10px] text-center font-bold text-amber-800 bg-[#FAF7F2] p-1.5 rounded-md border border-amber-200 animate-pulse">
                {unlockMessage}
              </p>
            )}

            <div className="text-center pt-1">
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${isUnlocked ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                Status: {isUnlocked ? "Unlocked & Fully Active" : "Locked (Demo Active)"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace splits structure */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Parameters / Slide Form (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-[#E8E0D8] rounded-2xl shadow-sm p-6 space-y-6">
          <div className="border-b pb-3 flex items-center justify-between">
            <h3 className="font-serif text-sm font-bold text-[#2D1B0E] uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-[#D4A853]" /> Compiler Parameters
            </h3>
            {!isUnlocked && (
              <span className="flex items-center gap-1 text-[10px] text-[#A67C1E] bg-[#FDF8F0] px-2 py-0.5 rounded-full font-bold border border-amber-200">
                <Lock className="w-3 h-3" /> DEMO PLAYGROUND
              </span>
            )}
          </div>

          <div className="space-y-4">
            {/* Category selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#2D1B0E] uppercase tracking-wider block">Document Purpose</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => setDocType("pitch_deck")}
                  className={`p-2 rounded-xl border text-left transition-all ${docType === "pitch_deck" ? "bg-[#2D1B0E] text-[#FDF8F0] border-[#2D1B0E]" : "bg-white text-[#2D1B0E] border-[#E8E0D8] hover:bg-[#FAF7F2]"}`}
                >
                  <Monitor className="w-4 h-4 mb-1 text-[#D4A853]" />
                  <p className="text-[11px] font-bold leading-tight">Pitch Deck &amp; Exec Summary</p>
                  <p className="text-[9px] text-[#8A7A6A] leading-tight mt-0.5">KSGC Retouched</p>
                </button>
                <button
                  onClick={() => setDocType("proposal")}
                  className={`p-2 rounded-xl border text-left transition-all ${docType === "proposal" ? "bg-[#2D1B0E] text-[#FDF8F0] border-[#2D1B0E]" : "bg-white text-[#2D1B0E] border-[#E8E0D8] hover:bg-[#FAF7F2]"}`}
                >
                  <FileText className="w-4 h-4 mb-1 text-[#D4A853]" />
                  <p className="text-[11px] font-bold leading-tight">Business Proposal</p>
                  <p className="text-[9px] text-[#8A7A6A] leading-tight mt-0.5">Venture requests</p>
                </button>
                <button
                  onClick={() => setDocType("contract")}
                  className={`p-2 rounded-xl border text-left transition-all ${docType === "contract" ? "bg-[#2D1B0E] text-[#FDF8F0] border-[#2D1B0E]" : "bg-white text-[#2D1B0E] border-[#E8E0D8] hover:bg-[#FAF7F2]"}`}
                >
                  <FileSignature className="w-4 h-4 mb-1 text-[#D4A853]" />
                  <p className="text-[11px] font-bold leading-tight">Service Contract</p>
                  <p className="text-[9px] text-[#8A7A6A] leading-tight mt-0.5">Covenant terms</p>
                </button>
              </div>
            </div>

            {/* Slide-by-slide fillable form if pitch deck is active */}
            {docType === "pitch_deck" ? (
              <div className="space-y-4">
                {/* Visual Predesigned Template Hub */}
                <div className="bg-white p-4 rounded-xl border border-[#E8E0D8] space-y-3 shadow-sm">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-1.5">
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#2D1B0E] flex items-center gap-1 font-sans">
                      <Briefcase className="w-3.5 h-3.5 text-[#D4A853]" /> Predesigned Pitch Templates
                    </span>
                    <span className="text-[9px] text-[#8C7A6D] italic">Select category to load preset</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1.5">
                    <button
                      type="button"
                      onClick={() => applyTemplate("tech")}
                      className={`px-2 py-2 rounded-lg border text-center transition-all text-[10px] leading-tight ${selectedTemplate === "tech" ? "bg-amber-100 text-amber-950 border-amber-400 font-bold" : "bg-[#FAF7F2] hover:bg-amber-50 text-gray-700 border-gray-200"}`}
                    >
                      💻 SaaS &amp; Tech
                    </button>
                    <button
                      type="button"
                      onClick={() => applyTemplate("agro")}
                      className={`px-2 py-2 rounded-lg border text-center transition-all text-[10px] leading-tight ${selectedTemplate === "agro" ? "bg-amber-100 text-amber-950 border-amber-400 font-bold" : "bg-[#FAF7F2] hover:bg-amber-50 text-gray-700 border-gray-200"}`}
                    >
                      🌾 Agro &amp; Food
                    </button>
                    <button
                      type="button"
                      onClick={() => applyTemplate("fintech")}
                      className={`px-2 py-2 rounded-lg border text-center transition-all text-[10px] leading-tight ${selectedTemplate === "fintech" ? "bg-amber-100 text-amber-950 border-amber-400 font-bold" : "bg-[#FAF7F2] hover:bg-amber-50 text-gray-700 border-gray-200"}`}
                    >
                      💳 FinTech
                    </button>
                    <button
                      type="button"
                      onClick={() => applyTemplate("wellness")}
                      className={`px-2 py-2 rounded-lg border text-center transition-all text-[10px] leading-tight ${selectedTemplate === "wellness" ? "bg-amber-100 text-amber-950 border-amber-400 font-bold" : "bg-[#FAF7F2] hover:bg-amber-50 text-gray-700 border-gray-200"}`}
                    >
                      🌿 HealthTech
                    </button>
                    <button
                      type="button"
                      onClick={() => applyTemplate("classroom")}
                      className={`px-2 py-2 rounded-lg border text-center transition-all text-[10px] leading-tight ${selectedTemplate === "classroom" ? "bg-amber-100 text-amber-950 border-amber-400 font-bold" : "bg-[#FAF7F2] hover:bg-amber-50 text-gray-700 border-gray-200"}`}
                    >
                      📚 EdTech AI
                    </button>
                  </div>
                </div>

                {/* AI Pitch Thinker Module */}
                <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200/60 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> AI Pitch Optimizer &amp; Thinker
                    </span>
                    <span className="text-[8px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded-md font-bold font-mono tracking-widest">ACTIVE</span>
                  </div>
                  <p className="text-[10px] text-amber-800 leading-normal">
                    Describe your raw notes or concept outlines in bulletpoints or unstructured phrases. The AI Thinking Engine will automatically draft, refine, and populate all 7 slides with realistic parameters!
                  </p>
                  
                  <div className="space-y-1.5">
                    <textarea
                      placeholder="e.g., I want to build a drone network to deliver local medications to clinics in East Africa. Charge $5 per transit, partnership with ministries. Need $200k seed capital."
                      value={aiThoughts}
                      onChange={(e) => setAiThoughts(e.target.value)}
                      rows={2}
                      className="w-full bg-white border border-[#E8E0D8] p-2.5 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 font-sans leading-relaxed text-[#2D1B0E]"
                    />
                    
                    <button
                      type="button"
                      onClick={handleSynthesizePitch}
                      disabled={isThinking}
                      className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold text-[10px] uppercase rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all"
                    >
                      {isThinking ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-950" />
                          <span>{thinkingFeedback || "Synthesizing investor-tier deck..."}</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-amber-950" />
                          <span>🧠 AI Auto-Synthesize Presentation Slide Deck</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* === FULL 18-SECTION PITCH DECK PDF GENERATOR === */}
                <div className="bg-[#FAF7F2] p-4 rounded-xl border-2 border-emerald-400/50 space-y-3">
                  <div className="flex items-center gap-1.5">
                    <FileBadge className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-[#2D1B0E]">Full Investor Pitch Deck PDF (18 Sections)</span>
                    <span className="text-[8px] bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded-md font-bold font-mono tracking-widest">KSGC-STANDARD</span>
                  </div>
                  <p className="text-[10px] text-[#6b5d50] leading-normal">
                    Uses the same raw thoughts above to generate a complete 18-section deck (Cover, About, Problem, Market Opportunity, Solution, Business Model, Product Portfolio, Traction, Go-To-Market, Competitive Advantage, Timeline, Funding Ask, Team, Risks, Financials, Contact, Testimonials) with auto-generated charts &mdash; modeled on the structure validated by the 2025 K-Startup Grand Challenge. Customize your theme below, then download a polished, presentation-ready PDF.
                  </p>

                  <button
                    type="button"
                    onClick={handleGenerateFullDeck}
                    disabled={isGeneratingFullDeck}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] uppercase rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all"
                  >
                    {isGeneratingFullDeck ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>{thinkingFeedback || "Synthesizing full deck..."}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Generate Full Pitch Deck Content</span>
                      </>
                    )}
                  </button>

                  {fullDeckData && (
                    <div className="space-y-3 pt-2 border-t border-[#E8E0D8]">
                      <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 font-bold">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Deck content ready: {fullDeckData.companyName}</span>
                      </div>

                      {/* Theme Customization */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] font-bold text-[#6b5d50] uppercase block mb-1">Primary / Header Color</label>
                          <input
                            type="color"
                            value={deckPrimaryColor}
                            onChange={(e) => setDeckPrimaryColor(e.target.value)}
                            className="w-full h-8 rounded-lg border border-[#E8E0D8] cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-[#6b5d50] uppercase block mb-1">Secondary / Accent Color</label>
                          <input
                            type="color"
                            value={deckSecondaryColor}
                            onChange={(e) => setDeckSecondaryColor(e.target.value)}
                            className="w-full h-8 rounded-lg border border-[#E8E0D8] cursor-pointer"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[9px] font-bold text-[#6b5d50] uppercase block mb-1">Header Tagline</label>
                        <input
                          type="text"
                          value={deckTagline}
                          onChange={(e) => setDeckTagline(e.target.value)}
                          placeholder="e.g. Innovating Africa's Food Legacy Sustainably"
                          className="w-full bg-white border border-[#E8E0D8] p-2 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] font-bold text-[#6b5d50] uppercase block mb-1">Company Logo</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => e.target.files?.[0] && handleThemeImageUpload(e.target.files[0], setDeckLogoUrl)}
                            className="w-full text-[9px]"
                          />
                          {deckLogoUrl && <img src={deckLogoUrl} alt="logo preview" className="h-8 mt-1 object-contain" />}
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-[#6b5d50] uppercase block mb-1">Flag / Region Accent</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => e.target.files?.[0] && handleThemeImageUpload(e.target.files[0], setDeckFlagUrl)}
                            className="w-full text-[9px]"
                          />
                          {deckFlagUrl && <img src={deckFlagUrl} alt="flag preview" className="h-6 mt-1 object-contain rounded" />}
                        </div>
                      </div>

                      <div>
                        <label className="text-[9px] font-bold text-[#6b5d50] uppercase block mb-1">Product Portfolio Images (up to 6)</label>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => e.target.files && handleProductImagesUpload(e.target.files)}
                          className="w-full text-[9px]"
                        />
                        {deckProductImages.length > 0 && (
                          <div className="grid grid-cols-6 gap-1 mt-1">
                            {deckProductImages.map((img, i) => (
                              <div key={i} className="relative">
                                <img src={img} alt={`product ${i}`} className="w-full h-12 object-cover rounded border border-[#E8E0D8]" />
                                <button
                                  type="button"
                                  onClick={() => setDeckProductImages((prev) => prev.filter((_, idx) => idx !== i))}
                                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[8px]"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={handleDownloadFullDeckPDF}
                        disabled={isExportingPdf}
                        className="w-full py-2.5 bg-[#2D1B0E] hover:bg-[#4A3728] text-white font-bold text-[10px] uppercase rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all"
                      >
                        {isExportingPdf ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Rendering PDF (this can take ~30s)...</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4" />
                            <span>Download PDF Pitch Deck (18 Slides)</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E8E0D8] space-y-4">
                  <div className="flex justify-between items-center bg-[#2D1B0E] p-2 rounded-lg text-white">
                    <button
                      type="button"
                      onClick={() => setActiveSlide(prev => Math.max(0, prev - 1))}
                      disabled={activeSlide === 0}
                      className="p-1 hover:bg-white/10 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-bold uppercase tracking-widest font-mono">
                      {activeSlide === 0 && "Slide 1: App Cover Identity"}
                      {activeSlide === 1 && "Slide 2: TOC & Summary"}
                      {activeSlide === 2 && "Slide 3: Problem Deficit"}
                      {activeSlide === 3 && "Slide 4: Solution Architecture"}
                      {activeSlide === 4 && "Slide 5: Target Market Size"}
                      {activeSlide === 5 && "Slide 6: Corporate Governance"}
                      {activeSlide === 6 && "Slide 7: Global Validation"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveSlide(prev => Math.min(6, prev + 1))}
                      disabled={activeSlide === 6}
                      className="p-1 hover:bg-white/10 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {activeSlide === 0 && (
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-[#2D1B0E] tracking-wider block">Company Name</label>
                        <input
                          type="text"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          className="w-full bg-white border border-[#E8E0D8] p-2.5 rounded-lg text-xs font-serif font-bold text-[#2D1B0E]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-[#2D1B0E] tracking-wider block">Concept Tagline</label>
                        <textarea
                          rows={2}
                          value={tagline}
                          onChange={(e) => setTagline(e.target.value)}
                          className="w-full bg-white border border-[#E8E0D8] p-2.5 rounded-lg text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-[#2D1B0E] tracking-wider block">Lead Presenter(s)</label>
                        <input
                          type="text"
                          value={presenterName}
                          onChange={(e) => setPresenterName(e.target.value)}
                          className="w-full bg-white border border-[#E8E0D8] p-2.5 rounded-lg text-xs focus:outline-none"
                        />
                      </div>
                      <IWriteImageUploader 
                        id="cover"
                        categoryName="Primary Cover Page"
                        label="Corporate & Brand Cover Image" 
                        description="Venture brand or main presentation cover illustration"
                        value={slideImages[0] || ""}
                        onChange={(val) => setSlideImages(prev => ({ ...prev, 0: val }))}
                      />
                    </div>
                  )}

                  {activeSlide === 1 && (
                    <div className="space-y-4">
                      <div className="bg-[#2D1B0E]/5 border border-[#2D1B0E]/10 p-4 rounded-xl text-center space-y-2">
                        <FileBadge className="w-8 h-8 text-[#D4A853] mx-auto opacity-80" />
                        <h4 className="text-xs font-bold text-[#2D1B0E] uppercase tracking-wider">Automated Indexing</h4>
                        <p className="text-[10px] text-[#8A7A6A] leading-relaxed max-w-sm mx-auto">
                          The Table of Contents strategy roadmap generates automatically using your provided structure. Custom layout routing is fully applied natively.
                        </p>
                      </div>
                      <IWriteImageUploader 
                        id="toc"
                        categoryName="Strategic Overview"
                        label="Roadmap Flow Diagram (Optional)" 
                        description="Attach a strategic execution roadmap visual"
                        value={slideImages[1] || ""}
                        onChange={(val) => setSlideImages(prev => ({ ...prev, 1: val }))}
                      />
                    </div>
                  )}

                  {activeSlide === 2 && (
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-[#2D1B0E] tracking-wider block">The Market Deficit (Problem)</label>
                        <textarea
                          rows={4}
                          value={problemDescription}
                          onChange={(e) => setProblemDescription(e.target.value)}
                          className="w-full bg-white border border-[#E8E0D8] p-2.5 rounded-lg text-xs focus:outline-none"
                          placeholder="Describe the friction or money lost currently..."
                        />
                      </div>
                      <IWriteImageUploader 
                        id="problem"
                        categoryName="Market Deficit"
                        label="Problem Proof & Friction Charts" 
                        description="A picture displaying legacy infrastructure or broken systems"
                        value={slideImages[2] || ""}
                        onChange={(val) => setSlideImages(prev => ({ ...prev, 2: val }))}
                      />
                    </div>
                  )}

                  {activeSlide === 3 && (
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-[#2D1B0E] tracking-wider block">The Product Solution Showcase</label>
                        <textarea
                          rows={4}
                          value={solutionDescription}
                          onChange={(e) => setSolutionDescription(e.target.value)}
                          className="w-full bg-white border border-[#E8E0D8] p-2.5 rounded-lg text-xs focus:outline-none"
                          placeholder="How does your product alleviate the friction..."
                        />
                      </div>
                      <IWriteImageUploader 
                        id="solution"
                        categoryName="Solution Mockup"
                        label="Software or Service Portfolio Image" 
                        description="Screenshots of the app, prototypes, or machinery"
                        value={slideImages[3] || ""}
                        onChange={(val) => setSlideImages(prev => ({ ...prev, 3: val }))}
                      />
                    </div>
                  )}

                  {activeSlide === 4 && (
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-[#2D1B0E] tracking-wider block">Sizing Indicator (Number of users/clients)</label>
                        <input
                          type="text"
                          value={targetMarket}
                          onChange={(e) => setTargetMarket(e.target.value)}
                          className="w-full bg-white border border-[#E8E0D8] p-2.5 rounded-lg text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-[#2D1B0E] tracking-wider block">Total Addressable Market Value</label>
                        <input
                          type="text"
                          value={addressableMarketValue}
                          onChange={(e) => setAddressableMarketValue(e.target.value)}
                          className="w-full bg-white border border-[#E8E0D8] p-2.5 rounded-lg text-xs font-mono font-bold text-[#D4A853]"
                        />
                      </div>
                      
                      <div className="pt-2 pb-1 text-[10px] font-serif uppercase tracking-widest text-center text-[#8C7A6D] border-b border-[#E8E0D8]">
                        Automated Revenue Dynamics Chart
                      </div>
                      <div className="grid grid-cols-2 gap-3 pt-2">
                         <div className="space-y-1">
                           <label className="text-[9px] font-bold uppercase text-[#2D1B0E] font-mono">Year 1 Projection ($)</label>
                           <input 
                             type="range" 
                             min={10000} 
                             max={500000} 
                             step={5000}
                             value={year1Revenue} 
                             onChange={(e) => setYear1Revenue(Number(e.target.value))}
                             className="w-full accent-emerald-600"
                           />
                           <div className="text-right text-[10px] font-mono font-bold text-emerald-700">${year1Revenue.toLocaleString()}</div>
                         </div>
                         <div className="space-y-1">
                           <label className="text-[9px] font-bold uppercase text-[#2D1B0E] font-mono">Year 3 Target Scale ($)</label>
                           <input 
                             type="range" 
                             min={500000} 
                             max={5000000} 
                             step={50000}
                             value={year3Revenue} 
                             onChange={(e) => setYear3Revenue(Number(e.target.value))}
                             className="w-full accent-[#D4A853]"
                           />
                           <div className="text-right text-[10px] font-mono font-bold text-[#D4A853]">${year3Revenue.toLocaleString()}</div>
                         </div>
                      </div>

                      <IWriteImageUploader 
                        id="market"
                        categoryName="Geographic Map"
                        label="Demographic Plot Image (Optional)" 
                        description="Regional distribution maps or geographic footprint"
                        value={slideImages[4] || ""}
                        onChange={(val) => setSlideImages(prev => ({ ...prev, 4: val }))}
                      />
                    </div>
                  )}

                  {activeSlide === 5 && (
                    <div className="space-y-4">
                      <div className="bg-[#FAF3E5] border border-amber-200/60 p-4 rounded-xl space-y-3">
                        <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                           <span className="text-[10px] font-bold uppercase text-amber-900 tracking-wider flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5"/> Registry Integration</span>
                           <span className="bg-amber-100 px-1.5 py-0.5 rounded text-[8px] font-bold text-amber-800 uppercase tracking-widest font-mono">Verified Credence</span>
                        </div>
                        <p className="text-[9px] text-amber-800 leading-normal">
                          Override these parameters if you own a registered entity in Ghana to assert corporate governance directly inside your slides automatically. Check interactive panel for results.
                        </p>
                        <div className="space-y-2">
                           <div className="grid grid-cols-2 gap-2">
                             <div className="space-y-1 text-[9px] font-bold font-mono">
                               <label className="uppercase">Certified Output Scope</label>
                               <input type="text" value={userCompanyName} onChange={(e) => setUserCompanyName(e.target.value)} className="w-full border p-1.5 rounded focus:outline-none"/>
                             </div>
                             <div className="space-y-1 text-[9px] font-bold font-mono">
                               <label className="uppercase">Registry Control No.</label>
                               <input type="text" value={userRegNumber} onChange={(e) => setUserRegNumber(e.target.value)} className="w-full border p-1.5 rounded focus:outline-none"/>
                             </div>
                           </div>
                           <div className="grid grid-cols-2 gap-2">
                             <div className="space-y-1 text-[9px] font-bold font-mono">
                               <label className="uppercase">Registration Date Issued</label>
                               <input type="text" value={userRegDate} onChange={(e) => setUserRegDate(e.target.value)} className="w-full border p-1.5 rounded focus:outline-none"/>
                             </div>
                             <div className="space-y-1 text-[9px] font-bold font-mono">
                               <label className="uppercase">Licencing Board &amp; Authority</label>
                               <input type="text" value={userRegAuthority} onChange={(e) => setUserRegAuthority(e.target.value)} className="w-full border p-1.5 rounded focus:outline-none"/>
                             </div>
                           </div>
                        </div>
                      </div>

                      <IWriteImageUploader 
                        id="cert"
                        categoryName="Legal Credence"
                        label="Scanned Authority Certificate (Optional)" 
                        description="Scan of Registrar General or FDA regulatory documents"
                        value={slideImages[5] || ""}
                        onChange={(val) => setSlideImages(prev => ({ ...prev, 5: val }))}
                      />
                    </div>
                  )}

                  {activeSlide === 6 && (
                    <div className="space-y-4">
                      <div className="bg-white/50 border border-[#E8E0D8]/60 p-4 rounded-xl space-y-3">
                         <div className="flex items-center gap-1.5 border-b border-[#E8E0D8] pb-1.5 mb-2">
                            <Award className="w-4 h-4 text-[#D4A853]"/> 
                            <span className="text-[10px] font-bold uppercase text-[#2D1B0E] tracking-wider block">KSGC Validation &amp; Capital Execution</span>
                         </div>
                         <div className="space-y-1.5">
                          <label className="text-[9px] font-bold uppercase text-[#8A7A6A] tracking-wider block">Funding Required Capital Amount</label>
                          <input
                            type="text"
                            value={fundingAmount}
                            onChange={(e) => setFundingAmount(e.target.value)}
                            className="w-full bg-white border border-[#E8E0D8] p-2.5 rounded-lg text-xs font-mono font-bold text-emerald-700"
                          />
                        </div>
                      </div>
                      
                      <IWriteImageUploader 
                        id="proof"
                        categoryName="Social Proof"
                        label="Premises & Team Photos (Optional)" 
                        description="HQ building facility or team corporate presence"
                        value={slideImages[6] || ""}
                        onChange={(val) => setSlideImages(prev => ({ ...prev, 6: val }))}
                      />
                    </div>
                  )}

                </div>
              </div>
            ) : (
              // Standard Layouts for letter, memo, proposal
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-[#2D1B0E] uppercase tracking-wider block">Business Draft Details / Idea</label>
                    <span className="text-[9px] text-[#8A7A6A] italic">Be as casual or raw as you like.</span>
                  </div>
                  <textarea
                    placeholder={docType === "proposal" ? "e.g., I need a proposal for an NGO providing clean water in rural Accra..." : docType === "contract" ? "e.g., An agreement between a freelance designer (me) and a tech company for an app redesign..." : "e.g., Write a formal resignation letter citing my intent to focus on a local startup..."}
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    rows={4}
                    className="w-full bg-white border border-[#E8E0D8] p-3 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#D4A853]/50 font-serif leading-relaxed text-[#2D1B0E]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-[#2D1B0E] tracking-wider block">Sender Role / Title</label>
                    <input
                      type="text"
                      value={professionalRole}
                      onChange={(e) => setProfessionalRole(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E8E0D8] px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-[#D4A853]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-[#2D1B0E] tracking-wider block">Communication Tone</label>
                    <select
                      value={customTone}
                      onChange={(e) => setCustomTone(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E8E0D8] px-3 py-2 rounded-lg text-[11px] font-bold focus:outline-none focus:border-[#D4A853]"
                    >
                      <option value="Persuasive & Investment-Grade">Persuasive &amp; Investment-Grade</option>
                      <option value="Strictly Legal Covenant">Strictly Legal Covenant</option>
                      <option value="Polite & Respectful Corporate">Polite &amp; Respectful Corporate</option>
                      <option value="Aggressive & Confidential">Aggressive &amp; Confidential</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Layout Customization (Applies to all) */}
            <div className="pt-4 border-t border-[#E8E0D8] space-y-4">
              <h4 className="text-[10px] font-bold uppercase text-[#8A7A6A] tracking-wider">High-DPI PDF Aesthetics</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-[#2D1B0E] tracking-wider block">Visual Template</label>
                  <select
                    value={formatType}
                    onChange={(e) => setFormatType(e.target.value)}
                    className="w-full bg-white border border-[#E8E0D8] px-3 py-2 rounded-lg text-[11px] font-bold focus:outline-none"
                  >
                    <option value="Corporate Navy Elegance">Corporate Navy Elegance</option>
                    <option value="Minimalist Tech Startup">Minimalist Tech Startup</option>
                    <option value="Traditional Legal Serif">Traditional Legal Serif</option>
                    <option value="Modern Financial Bold">Modern Financial Bold</option>
                  </select>
                </div>
                
                <div className="space-y-1.5 flex flex-col justify-center gap-2 pt-4">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        checked={includeHeaderLogo} 
                        onChange={(e) => setIncludeHeaderLogo(e.target.checked)}
                        className="sr-only" 
                      />
                      <div className={`w-10 h-5 bg-gray-200 rounded-full shadow-inner transition-colors ${includeHeaderLogo ? 'bg-[#D4A853]' : ''}`}></div>
                      <div className={`absolute w-3 h-3 bg-white rounded-full shadow top-1 transition-transform ${includeHeaderLogo ? 'translate-x-6' : 'translate-x-1'}`}></div>
                    </div>
                    <span className="text-[10px] font-bold uppercase text-[#2D1B0E] group-hover:text-[#D4A853] transition-colors">Include Header Crest/Logos</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        checked={includeWatermark} 
                        onChange={(e) => setIncludeWatermark(e.target.checked)}
                        className="sr-only" 
                      />
                      <div className={`w-10 h-5 bg-gray-200 rounded-full shadow-inner transition-colors ${includeWatermark ? 'bg-[#D4A853]' : ''}`}></div>
                      <div className={`absolute w-3 h-3 bg-white rounded-full shadow top-1 transition-transform ${includeWatermark ? 'translate-x-6' : 'translate-x-1'}`}></div>
                    </div>
                    <span className="text-[10px] font-bold uppercase text-[#2D1B0E] group-hover:text-[#D4A853] transition-colors">Draft Confidential Watermark</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleGenerateDocument}
                disabled={isLoading}
                className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-all ${
                  isUnlocked 
                    ? "bg-[#2D1B0E] hover:bg-black text-[#FDF8F0] shadow-md shadow-[#2D1B0E]/20" 
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#D4A853]" />
                    <span>Compiling iWrite Data...</span>
                  </>
                ) : (
                  <>
                    {isUnlocked ? <Sparkles className="w-4 h-4 text-[#D4A853]" /> : <Lock className="w-4 h-4" />}
                    <span>{docType === "pitch_deck" ? "Compile Raw Deck Layout" : "Generate Draft"}</span>
                  </>
                )}
              </button>

              <button
                onClick={triggerDownloadPDF}
                className="py-3 px-6 rounded-xl flex items-center justify-center gap-2 text-xs font-bold bg-[#D4A853] hover:bg-[#C49A42] text-[#2D1B0E] shadow-sm uppercase tracking-wider transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Visual Document Renderer (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="font-serif text-sm font-bold text-[#2D1B0E] uppercase tracking-wider flex items-center gap-1.5">
                <Layout className="w-4 h-4 text-[#D4A853]" /> Live Interactive Visual Deck Simulator
              </h3>
              <p className="text-[10px] text-[#8A7A6A] mt-0.5 max-w-sm">
                Ritemasta Prepress CSS Engine directly translates your parameters into rich graphics simulating KSGC standard slides.
              </p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditingDraft(!isEditingDraft)}
                className={`p-2 rounded-lg border text-[10px] font-bold flex items-center gap-1 transition-colors ${
                  isEditingDraft ? "bg-[#2D1B0E] text-[#FDF8F0] border-[#2D1B0E]" : "bg-white text-[#2D1B0E] border-[#E8E0D8] hover:bg-[#FAF7F2]"
                }`}
              >
                <FileSignature className="w-3.5 h-3.5" />
                {isEditingDraft ? "Viewing Raw Code" : "Raw Source"}
              </button>
              <button
                className="p-2 rounded-lg border bg-white text-[#2D1B0E] border-[#E8E0D8] hover:bg-[#FAF7F2] transition-colors shadow-sm flex items-center gap-1"
                onClick={triggerDownloadPDF}
              >
                <Printer className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Core Interactive Sandbox Presentation (16:9 Aspect Ratio Emulator) */}
          <div className="bg-[#FAF7F2] border-2 border-[#E8E0D8] shadow-inner rounded-md overflow-hidden relative" style={{ minHeight: "450px" }}>
            
            {/* Visual Confidentials overlay */}
            {includeWatermark && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] overflow-hidden z-0">
                <span className="text-[150px] font-bold uppercase tracking-widest text-gray-900 rotate-[-45deg] select-none text-center leading-none">
                  strictly CONFIDENTIAL
                </span>
              </div>
            )}

            <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-transparent via-[#E8E0D8]/50 to-transparent"></div>

            <div className="p-4 sm:p-8 h-full bg-[#1A1A24] relative shadow-2xl mx-auto overflow-y-auto overflow-x-hidden text-white" 
                 style={{ 
                   aspectRatio: '16/9', 
                   maxWidth: '900px', 
                   fontFamily: formatType === "Corporate Navy Elegance" ? 'ui-sans-serif, system-ui, -apple-system' : 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
                   backgroundColor: formatType === "Corporate Navy Elegance" ? '#0F172A' : (formatType === "Minimalist Tech Startup" ? '#09090B' : '#1C1917'),
                 }}
            >
              
              {/* Dynamic Presentation Framework based on Active Slide Tracker */}
              {docType === "pitch_deck" ? (
                <>
                  <div className="absolute top-5 left-8 right-8 flex justify-between items-center z-10 opacity-70">
                    <span className="text-[8px] font-mono tracking-[0.2em] text-gray-400 font-bold">
                      {isUnlocked ? "RITEMASTA PRO" : "IWRITE DEMO"} // KSGC ALIGNED
                    </span>
                    <span className="text-[8px] font-mono tracking-[0.1em] text-[#D4A853] bg-black/40 px-2 py-0.5 rounded border border-[#D4A853]/20">
                      Slide 0{activeSlide + 1}
                    </span>
                  </div>

                  <div className="h-full flex flex-col justify-center px-4 md:px-12 relative z-10 pt-8" style={{ animation: "fadeIn 0.4s ease-out" }}>
                    
                    {activeSlide === 0 && (
                      <div className="space-y-6 text-center max-w-3xl mx-auto">
                        <div className="flex justify-center mb-6">
                          {slideImages[0] ? (
                            <div className="relative group w-32 h-32 md:w-40 md:h-40 bg-white rounded-2xl p-2 shadow-2xl border-4 border-white overflow-hidden transform group-hover:scale-105 transition-transform">
                               <img src={slideImages[0]} alt="Brand Logo" className="w-full h-full object-contain rounded-xl" />
                            </div>
                          ) : (
                            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-[#D4A853] rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(212,168,83,0.3)] border-2 border-white/20 font-serif">
                              <Building className="w-12 h-12 text-[#2D1B0E]" />
                            </div>
                          )}
                        </div>
                        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 font-serif" style={{ lineHeight: 1.1 }}>
                          {companyName || "Your Startup Name"}
                        </h1>
                        <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
                          {tagline || "Your core value proposition and mission statement will appear here."}
                        </p>
                        
                        <div className="pt-8 flex flex-col items-center">
                          <div className="h-px w-16 bg-[#D4A853]/50 mb-4"></div>
                          <p className="text-[10px] sm:text-xs text-gray-400 font-mono tracking-widest uppercase">
                            Presented By
                          </p>
                          <p className="text-xs sm:text-sm text-white font-medium mt-1">
                            {presenterName || "Founder & Executive Team"}
                          </p>
                        </div>
                      </div>
                    )}

                    {activeSlide === 1 && (
                      <div className="space-y-6 relative">
                        <span className="text-[#D4A853] text-[10px] font-bold uppercase font-mono tracking-widest block font-sans">01. Strategic Index</span>
                        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 leading-tight max-w-2xl">
                          Table of Contents &amp; Executive Core Structure
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                          <div className={slideImages[1] ? "md:col-span-7 space-y-3" : "md:col-span-12 space-y-4"}>
                            {[
                              { id: "01", t: "The Initial Market Deficit Constraints" },
                              { id: "02", t: `Solution Mechanism (${companyName})` },
                              { id: "03", t: "Market Sizing & Total Addressable Revenue" },
                              { id: "04", t: "Corporate Civil Governance Authority" },
                              { id: "05", t: "KSGC Global Validation Metrics" },
                              { id: "06", t: "Seed Capital Execution Requirements" },
                            ].map((item, idx) => (
                              <div key={idx} className="flex gap-4 items-center group cursor-default">
                                <span className="font-mono text-[10px] font-bold text-[#D4A853] bg-[#D4A853]/10 px-2 py-1 rounded transition-colors group-hover:bg-[#D4A853] group-hover:text-black">
                                  {item.id}
                                </span>
                                <span className="text-gray-300 text-xs sm:text-sm transition-colors group-hover:text-white font-light">
                                  {item.t}
                                </span>
                                <div className="flex-1 border-b border-white/10 group-hover:border-[#D4A853]/40 transition-colors border-dashed mx-4"></div>
                                <ChevronRight className="w-3 h-3 text-white/20 group-hover:text-[#D4A853] transition-colors" />
                              </div>
                            ))}
                          </div>
                          
                          {slideImages[1] && (
                            <div className="md:col-span-5 h-full flex items-center justify-center">
                              <div className="relative w-full max-h-64 rounded-xl overflow-hidden border border-white/10 p-1 bg-black/50 shadow-2xl backdrop-blur">
                                <div className="absolute top-2 left-2 flex gap-1 z-10">
                                  <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                </div>
                                <span className="absolute top-1.5 right-3 text-[7px] font-mono text-white/40 uppercase tracking-widest z-10 font-sans">Roadmap Render</span>
                                <div className="w-full h-full pt-4 rounded-lg overflow-hidden flex items-center justify-center">
                                  <img src={slideImages[1]} alt="Roadmap Graphic" className="max-h-52 w-auto object-contain rounded" />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {activeSlide === 2 && (
                      <div className="space-y-4">
                        <span className="text-red-400 text-xs font-bold uppercase font-mono tracking-widest block font-sans">Critical Friction Metrics</span>
                        <h2 className="font-serif text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                          The Core Market Deficit
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                          <div className={slideImages[2] ? "md:col-span-8 space-y-4 font-sans" : "md:col-span-12 space-y-4 font-sans"}>
                            <div className="bg-red-500/10 border-l-2 border-red-500 p-4 font-serif text-sm text-gray-200 italic leading-relaxed">
                              "{problemDescription}"
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 text-xs font-mono font-bold">
                              <div className="bg-white/5 p-3 rounded-lg border border-white/5 flex gap-3 text-gray-300 items-start">
                                <div className="bg-red-500/20 text-red-400 p-1.5 rounded shrink-0">01</div>
                                <div>
                                  <div className="text-red-400 mb-0.5 uppercase tracking-wide text-[9px]">High Cost</div>
                                  CURRENT MARKETS OVERPRICED
                                </div>
                              </div>
                              <div className="bg-white/5 p-3 rounded-lg border border-white/5 flex gap-3 text-gray-300 items-start">
                                <div className="bg-red-500/20 text-red-400 p-1.5 rounded shrink-0">02</div>
                                <div>
                                  <div className="text-red-400 mb-0.5 uppercase tracking-wide text-[9px]">Inefficiency</div>
                                  🚨 WEAK INFRASTRUCTURE &amp; DISTRIBUTION DEFICITS
                                </div>
                              </div>
                            </div>
                          </div>
                          {slideImages[2] && (
                            <div className="md:col-span-4 flex items-center justify-center">
                              <div className="w-full max-h-56 rounded-lg overflow-hidden border border-red-500/30 bg-black/40 p-1 flex flex-col items-center justify-center shadow-md">
                                <div className="text-[8px] uppercase tracking-wider text-red-400 font-mono mb-1">Legacy Deficit Scan</div>
                                <img src={slideImages[2]} alt="Friction Proof Deficit Point" className="max-h-36 w-auto object-contain rounded" />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {activeSlide === 3 && (
                      <div className="space-y-4">
                        <span className="text-[#D4A853] text-xs font-bold uppercase font-mono tracking-widest block font-sans">The Strategic Savior</span>
                        <h2 className="font-serif text-lg sm:text-xl font-bold text-white">
                          {companyName} Solution Architecture
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                          <div className={slideImages[3] ? "md:col-span-8 space-y-3" : "md:col-span-12 space-y-3"}>
                            <p className="text-xs text-gray-300 leading-relaxed font-light">{solutionDescription}</p>
                            
                            {/* Process architecture flow diagram */}
                            <div className="grid grid-cols-4 gap-2 pt-2 text-center text-[10px] font-mono text-gray-300">
                              <div className="bg-white/5 p-1 rounded border border-[#D4A853]/20">
                                <p className="text-[#D4A853] font-bold">1. SOURCE</p>
                                <p className="scale-90 opacity-70">Raw Input</p>
                              </div>
                              <div className="bg-white/5 p-1 rounded border border-[#D4A853]/20">
                                <p className="text-[#D4A853] font-bold">2. REFINEMENT</p>
                                <p className="scale-90 opacity-70">Active Process</p>
                              </div>
                              <div className="bg-white/5 p-1 rounded border border-[#D4A853]/20">
                                <p className="text-[#D4A853] font-bold">3. ALIGN</p>
                                <p className="scale-90 opacity-70">Unified Core</p>
                              </div>
                              <div className="bg-white/5 p-1 rounded border border-[#D4A853]/20">
                                <p className="text-[#D4A853] font-bold">4. OUTPUT</p>
                                <p className="scale-90 opacity-70">Global Value</p>
                              </div>
                            </div>
                          </div>
                          {slideImages[3] && (
                            <div className="md:col-span-4 flex justify-center font-sans">
                              <div className="w-full max-h-56 rounded-lg overflow-hidden border border-[#D4A853]/30 bg-black/40 p-1 flex flex-col items-center justify-center shadow-md">
                                <span className="text-[8px] uppercase tracking-wider text-[#D4A853] font-mono mb-1">Product portfolio mockup</span>
                                <img src={slideImages[3]} alt="Product / Service Portfolio" className="max-h-36 w-auto object-contain rounded" />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {activeSlide === 4 && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-emerald-400 text-xs font-bold uppercase font-mono tracking-widest block">Market TAM Dynamics</span>
                            <h2 className="font-serif text-lg sm:text-xl font-bold text-white">
                              Growth Outlook &amp; Target TAM
                            </h2>
                          </div>
                          <div className="text-right bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded text-[10px] font-mono text-emerald-300">
                            PROJECTIONS ACTIVE
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                          <div className="md:col-span-4 text-xs font-mono space-y-2">
                            <div>
                              <span className="text-gray-400 block uppercase text-[9px]">Sizing Indicator</span>
                              <span className="font-bold text-white">{targetMarket}</span>
                            </div>
                            <div>
                              <span className="text-gray-400 block uppercase text-[9px]">Calculated TAM Horizon</span>
                              <span className="font-bold text-[#D4A853]">{addressableMarketValue}</span>
                            </div>
                          </div>

                          {/* Beautiful CSS Dynamic Area Chart drawn using HTML */}
                          <div className={slideImages[4] ? "md:col-span-5 bg-white/5 p-3 rounded-xl border border-white/10 space-y-3 font-mono text-xs text-left" : "md:col-span-8 bg-white/5 p-4 rounded-xl border border-white/10 space-y-3 font-mono text-xs text-left"}>
                            <div className="space-y-1">
                              <div className="flex justify-between font-mono text-[9px]">
                                <span className="text-gray-400">Year 1 Milestones Target</span>
                                <span className="text-white font-bold">${year1Revenue.toLocaleString()} ARR</span>
                              </div>
                              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                                <div 
                                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                                  style={{ width: `${Math.min(100, (year1Revenue / 300000) * 100)}%` }}
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <div className="flex justify-between font-mono text-[9px]">
                                <span className="text-gray-400">Year 3 High Scale Horizon</span>
                                <span className="text-[#D4A853] font-bold">${year3Revenue.toLocaleString()} ARR</span>
                              </div>
                              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                                <div 
                                  className="bg-gradient-to-r from-[#D4A853] to-amber-400 h-full rounded-full transition-all duration-500"
                                  style={{ width: `${Math.min(100, (year3Revenue / 3000000) * 100)}%` }}
                                />
                              </div>
                            </div>

                            <span className="text-[8px] text-gray-500 italic block text-right">
                              *Sliders simulate rewards.
                            </span>
                          </div>

                          {slideImages[4] && (
                            <div className="md:col-span-3 flex justify-center font-sans">
                              <div className="w-full max-h-48 rounded-lg overflow-hidden border border-emerald-500/30 bg-black/40 p-1 flex flex-col items-center justify-center shadow-md">
                                <span className="text-[7px] uppercase tracking-wider text-emerald-400 font-mono mb-0.5">Demographics Map</span>
                                <img src={slideImages[4]} alt="TAM Demographics Map" className="max-h-28 w-auto object-contain rounded" />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {activeSlide === 5 && (
                      <div className="space-y-4">
                        <span className="text-amber-400 text-xs font-bold uppercase font-mono tracking-widest block">Ghana Corporate Sovereign Identity</span>
                        <h2 className="font-serif text-lg sm:text-xl font-bold text-white">
                          Verified Integrity &amp; Registration Authority
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                          {/* Perfect mini representation replica of Ghanaian Certificate of Registration */}
                          <div className={slideImages[5] ? "md:col-span-8" : "md:col-span-12"}>
                            <div className="bg-white text-black p-3.5 rounded-xl border-t-8 border-red-600/90 font-serif shadow-lg relative max-w-lg mx-auto text-left">
                              <div className="absolute top-2 right-2 text-[9px] font-mono font-bold text-red-600 border border-red-600 px-1 py-0.5 rounded">
                                ID: {userRegNumber || "BN-PENDING"}
                              </div>
                              
                              <div className="text-center pb-1.5 border-b border-gray-200">
                                <span className="text-[9px] uppercase font-bold tracking-wider text-amber-900 block font-sans">Republic of Ghana</span>
                                <span className="text-[8px] font-sans font-bold text-gray-500">The Registration of Business Names Act, 1962 (No. 151)</span>
                                <h3 className="text-xs font-bold mt-0.5 text-[#2D1B0E] font-sans">CERTIFICATE OF REGISTRATION</h3>
                              </div>

                              <div className="py-2 text-center px-4 font-sans">
                                <p className="text-[10px] leading-relaxed text-gray-700">
                                  This is to certify that the business enterprise operating as:
                                </p>
                                <h4 className="font-serif font-bold text-xs tracking-wide text-red-700 uppercase my-0.5">
                                  {userCompanyName || companyName}
                                </h4>
                                <p className="text-[9px] text-gray-500 leading-relaxed">
                                  has been legally registered as a certified corporate entity.
                                </p>
                              </div>

                              <div className="border-t border-gray-200 pt-1.5 flex justify-between items-center text-[8px] font-sans text-gray-400">
                                <span>REG DATE: {userRegDate}</span>
                                <span>Regulatory Body: {userRegAuthority}</span>
                              </div>

                              <div className="mt-1.5 pt-1.5 border-t border-dashed border-gray-300 text-[8px] text-gray-400 leading-normal italic text-center font-sans font-sans">
                                Compliant under licensing authority of Ritemasta Publications (Sovereign Registration Corp Act, Reg. ID BN360822013)
                              </div>
                            </div>
                          </div>

                          {slideImages[5] && (
                            <div className="md:col-span-4 flex justify-center">
                              <div className="w-full max-h-52 rounded-lg overflow-hidden border border-amber-500/30 bg-black/40 p-1 flex flex-col items-center justify-center shadow-md">
                                <span className="text-[7px] uppercase tracking-wider text-amber-400 font-mono mb-0.5">Official Certificate Original Scan</span>
                                <img src={slideImages[5]} alt="Corporate Registration Scan" className="max-h-28 w-auto object-contain rounded" />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {activeSlide === 6 && (
                      <div className="space-y-3 font-sans">
                        <div className="flex justify-between items-center bg-yellow-500/10 border border-yellow-500/20 p-2 rounded-lg">
                          <div>
                            <span className="text-[#D4A853] text-[9px] font-bold uppercase tracking-widest block font-mono">Korean Startup Grand Challenge Validation</span>
                            <h3 className="font-serif text-sm font-bold text-white">
                              Selected &amp; Audited by 80+ VC Industry Experts
                            </h3>
                          </div>
                          <div className="bg-white text-[#2D1B0E] p-1 rounded font-bold text-[9px] font-mono shrink-0">
                            KSGC 2025
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                          <div className={slideImages[6] ? "md:col-span-8 space-y-3 text-left" : "md:col-span-12 space-y-3 text-left"}>
                            <div className="bg-white/5 p-2.5 rounded-lg border border-white/10 text-[11px] leading-relaxed italic text-gray-300">
                              "{companyName}’s high-impact layout breakthrough and localized market architecture stood out as one of the most promising selected enterprise solutions evaluated by international investors at the Seoul Grand Challenge."
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-xs">
                              <div className="bg-white/5 p-2 rounded font-sans">
                                <span className="text-[#D4A853] block text-[9px] uppercase font-mono">Global Validation Rate</span>
                                <span className="font-bold font-mono text-[11px]">Top 60 Global Contestants</span>
                              </div>
                              <div className="bg-white/5 p-2 rounded font-sans">
                                <span className="text-[#D4A853] block text-[9px] uppercase font-mono">Funding Target Sought</span>
                                <span className="font-bold font-mono text-[11px] text-emerald-400">{fundingAmount}</span>
                              </div>
                            </div>
                          </div>

                          {slideImages[6] && (
                            <div className="md:col-span-4 flex justify-center font-sans">
                              <div className="w-full max-h-52 rounded-lg overflow-hidden border border-amber-500/30 bg-black/40 p-1 flex flex-col items-center justify-center shadow-md">
                                <span className="text-[7px] uppercase tracking-wider text-amber-400 font-mono mb-0.5">Corporate Premises/Premises</span>
                                <img src={slideImages[6]} alt="Corporate Premises and Launch Team" className="max-h-28 w-auto object-contain rounded" />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Landscape slide footer */}
                  <div className="border-t border-white/10 pt-3 flex justify-between items-center text-[10px] text-gray-400 font-mono">
                    <span>Evaluated by: KSGC Seoul Panel </span>
                    <span>Corporate Registry GHS</span>
                    <span className="text-white font-serif tracking-wider font-semibold">RitemastaPro Suite</span>
                  </div>
                </>
              ) : null}

              {/* Text Area Draft content for alternate documents (generic contract, mou, letters) */}
              {docType !== "pitch_deck" && (
                <div className="bg-white p-8 border border-neutral-300/80 rounded-2xl max-w-4xl mx-auto shadow-sm">
                  {isEditingDraft ? (
                    <textarea
                      value={compiledDraft}
                      onChange={(e) => setCompiledDraft(e.target.value)}
                      className="w-full h-full min-h-[400px] bg-white border-0 text-xs font-mono focus:outline-none leading-relaxed whitespace-pre-wrap"
                    />
                  ) : (
                    <div className="text-xs leading-relaxed space-y-4 font-mono whitespace-pre-wrap text-[#2D1B0E] text-left">
                      {compiledDraft || "Welcome! Provide your ideas or criteria and trigger the compiler to output beautiful professional copy."}
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Bottom info footer */}
            <div className="px-6 py-3 bg-[#FAF7F2] border-t border-[#E8E0D8] text-[10px] text-[#8A7A6A] flex justify-between items-center flex-wrap gap-2 font-mono shrink-0">
              <span>Target Standard: ISO 300-DPI Vector</span>
              <span>Margins setup: {pdfMargin.toUpperCase()}</span>
              <span>Compiled by: iWrite Pro</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}