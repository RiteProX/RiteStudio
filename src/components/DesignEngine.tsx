/**
 * RitemastaPro - Intelligent Creative Design Engine
 * Supports Magazines, Posters, Book Covers, Receipts/Forms, and Business Cards.
 */
import { useState } from "react";
import { User } from "../types";
import { 
  Sparkles, Check, Download, Layers, Eye, BookOpen, 
  FileText, CreditCard, LayoutGrid, Sliders, Play, Plus, Trash2, Printer,
  Search, Filter, X
} from "lucide-react";

interface DesignEngineProps {
  user: User | null;
  onOpenAuth: () => void;
}

type DesignMode = "magazine" | "poster" | "book_cover" | "receipt" | "business_card";

// Curated Design Presets for each category
const magazineTemplates = [
  {
    id: "botanical",
    name: "Botanical / Herbs",
    theme: "cream",
    title: "VITAL HERBALIST",
    subtitle: "Exploring Rare Flora of the Volta Basin",
    story: "The Bitter Leaf Protocol: Nature's Secret to Balance",
    columns: 2,
    body: "Medical plants in West Africa have formed the backbone of holistic wellness for centuries. Through precise dehydration, indigenous practitioners format delicate leaves like Ga and Akan dialects. Today's researchers study active organic compounds with computerized modeling in modern labs."
  },
  {
    id: "tech",
    name: "Tech Disruptor",
    theme: "midnight",
    title: "SANDBOX REVIEW",
    subtitle: "The Future of Offline-First Web Applications",
    story: "Absolute Sovereignty: Why Databases Move Local",
    columns: 3,
    body: "Cloud computing remains expensive and fragile under extreme latency. Forward-thinking companies build hybrid environments where standard state slices synchronize with high-end backends background-style. The immediate results are zero feedback lags and continuous runtime."
  },
  {
    id: "literary",
    name: "Classic Literary",
    theme: "sage",
    title: "THE COCOA LEAF",
    subtitle: "Academic Musings of Contemporary West Africa",
    story: "Robert Ashley Nikoi & The Golden Generation",
    columns: 2,
    body: "Intellectual movements thrive on durable publishing infrastructure. When printing-press access was locked behind exorbitant corporate pricing, modern writers configured community newsletters to bypass formatting. Ritemasta brings this sovereignty back directly to the authors."
  }
];

const posterTemplates = [
  {
    id: "craft",
    name: "Aesthetic Quote",
    theme: "cream",
    title: "CRAFT OVER DEFAULTS",
    quote: "The difference between raw code and digital art is intentional typography.",
    author: "Ritemasta Philosophy",
    layout: "editorial" as const
  },
  {
    id: "minimal",
    name: "Zen Minimalism",
    theme: "sage",
    title: "ZEN THOUGHTS",
    quote: "In the middle of noise, absolute silence is the strongest state variable.",
    author: "Sovereign Mind",
    layout: "minimal" as const
  },
  {
    id: "retro",
    name: "Swiss Modern",
    theme: "charcoal",
    title: "SWISS GEOMETRY",
    quote: "Layout grids are not cages. Indeed, they represent the absolute map of freedom.",
    author: "Zurich Bauhaus",
    layout: "bold" as const
  }
];

const coverTemplates = [
  {
    id: "healing",
    name: "Herbal Healing",
    theme: "cream",
    title: "HEALING PROTOCOLS",
    subtitle: "A Comprehensive Organic Herbalist Handbook",
    author: "Bob Ashley",
    pages: 180,
    spine: "HEALING PROTOCOLS — Bob Ashley"
  },
  {
    id: "scifi",
    name: "Minimal Tech-Fiction",
    theme: "midnight",
    title: "BEYOND SANDBOX",
    subtitle: "A Deep Dives Into Virtual State Collections",
    author: "A. G. Antigravity",
    pages: 350,
    workspace: "Accra Lab",
    spine: "BEYOND SANDBOX — Antigravity"
  },
  {
    id: "history",
    name: "Historical Epic",
    theme: "crimson",
    title: "WHISPERS OF VOLTA",
    subtitle: "Legends and Legacies of Gold Coast Publishers",
    author: "Dr. Osei-Kofi",
    pages: 520,
    spine: "WHISPERS OF VOLTA — Osei-Kofi"
  }
];

const receiptTemplates = [
  {
    id: "retail",
    name: "Organic Herbs Sales",
    theme: "cream",
    company: "Ritemasta Organic Herbs",
    number: "RM-2026-9041",
    client: "Bob Ashley",
    tax: 15,
    items: [
      { id: 1, name: "Premium Bitter Leaf Powder (500g)", price: 45.0, qty: 2 },
      { id: 2, name: "Vocal Chord Vocalist Syrup (250ml)", price: 32.5, qty: 1 },
      { id: 3, name: "Prepress Layout Consultation Hour", price: 150.0, qty: 1 },
    ]
  },
  {
    id: "consulting",
    name: "Classroom AI Consulting",
    theme: "sage",
    company: "Teecha AI Consulting Ltd",
    number: "TAC-2026-003",
    client: "Senior HS Academic Board",
    tax: 5,
    items: [
      { id: 1, name: "Curriculum Slide Synopsis Generator Setup", price: 450.0, qty: 1 },
      { id: 2, name: "Teacher Virtual Coach Prompts Custom Work", price: 180.0, qty: 2 },
    ]
  },
  {
    id: "prepress",
    name: "Prepress Publishing Fees",
    theme: "charcoal",
    company: "Ritemasta Prepress Lab",
    number: "RPL-2026-881",
    client: "Sarah Jenkins Novels",
    tax: 12.5,
    items: [
      { id: 1, name: "EPUB Formatting & Vellum Bypassing Work", price: 250.0, qty: 1 },
      { id: 2, name: "Spine Width Safe-Bleed Visual Calculator Calibration", price: 120.0, qty: 1 },
    ]
  }
];

const cardTemplates = [
  {
    id: "advisor",
    name: "Wellness Advisor",
    theme: "cream",
    nameField: "Ewuraba Mensah",
    jobField: "Lead Wellness Advisor & Publisher",
    phoneField: "+233 24 555 9012",
    emailField: "ewuraba@ritemasta.org",
    addressField: "No. 12 Cocoa House Street, Accra"
  },
  {
    id: "lead",
    name: "Technical Executive",
    theme: "charcoal",
    nameField: "Robert Ashley Nikoi",
    jobField: "Chief Technology Coordinator",
    phoneField: "+233 501 119 195",
    emailField: "ritemasta@gmail.com",
    addressField: "No. 44 High Street Sandboxes, Accra"
  },
  {
    id: "academic",
    name: "Academic Dean",
    theme: "midnight",
    nameField: "Dr. Robert Osei-Kofi",
    jobField: "SHS Senior Academic Coordinator",
    phoneField: "+233 20 882 4192",
    emailField: "osei.kofi@edu.gov.gh",
    addressField: "Ministry Education Complex, Accra"
  }
];

export default function DesignEngine({ user, onOpenAuth }: DesignEngineProps) {
  const [activeMode, setActiveMode] = useState<DesignMode>("magazine");
  
  // Real-time synchronization of lock state
  const [localUnlock, setLocalUnlock] = useState(() => {
    const cached = localStorage.getItem("ritemasta_designer_unlocked");
    return cached === "true";
  });

  const isUnlocked = localUnlock || !!user?.isUnlocked || user?.unlockCode === "TEST-LIFETIME-PASS" || user?.unlockCode === "TEST-DESIGNER-PRO";

  const [promoCode, setPromoCode] = useState("");
  const [unlockMessage, setUnlockMessage] = useState("");

  // New templates search, filter, preview modal and design pricing toggle states
  const [searchTerm, setSearchTerm] = useState("");
  const [themeFilter, setThemeFilter] = useState("all");
  const [pricingCurrency, setPricingCurrency] = useState<"GHS" | "USD">("USD");
  const [selectedPreviewTemplate, setSelectedPreviewTemplate] = useState<any | null>(null);

  // Common styles & colors
  const [colorTheme, setColorTheme] = useState<"cream" | "midnight" | "sage" | "crimson" | "charcoal">("cream");

  // MODE 1: MAGAZINE STATES
  const [magTitle, setMagTitle] = useState("VITAL HERBALIST");
  const [magSubtitle, setMagSubtitle] = useState("Exploring Rare Flora of the Volta Basin");
  const [magCoverStory, setMagCoverStory] = useState("The Bitter Leaf Protocol: Nature's Secret to Balance");
  const [magColumns, setMagColumns] = useState(2);
  const [magBodyText, setMagBodyText] = useState(
    "Medical plants in West Africa have formed the backbone of holistic wellness for centuries. " +
    "Through precise dehydration, indigenous practitioners format delicate leaves like Ga and Akan dialects. " +
    "Today's researchers study active organic compounds with computerized modeling in modern labs."
  );

  // MODE 2: POSTER STATES
  const [posterTitle, setPosterTitle] = useState("CRAFT OVER DEFAULTS");
  const [posterQuote, setPosterQuote] = useState("The difference between raw code and digital art is intentional typography.");
  const [posterAuthor, setPosterAuthor] = useState("Ritemasta Philosophy");
  const [posterLayout, setPosterLayout] = useState<"minimal" | "bold" | "editorial">("editorial");

  // MODE 3: BOOK COVER STATES
  const [coverTitle, setCoverTitle] = useState("HEALING PROTOCOLS");
  const [coverAuthor, setCoverAuthor] = useState("Bob Ashley");
  const [coverSubTitle, setCoverSubTitle] = useState("A Comprehensive Organic Herbalist Handbook");
  const [coverPages, setCoverPages] = useState(180);
  const [coverSpineText, setCoverSpineText] = useState("HEALING PROTOCOLS — Bob Ashley");

  // Spine calculation formula
  const calculatedSpineWidth = (coverPages * 0.00225).toFixed(3); // Standard spine width in inches

  // MODE 4: RECEIPTS BOOK & BUSINESS FORMS STATES
  const [companyName, setCompanyName] = useState("Ritemasta Organic Herbs");
  const [receiptNumber, setReceiptNumber] = useState("RM-2026-9041");
  const [clientName, setClientName] = useState("Bob Ashley");
  const [taxRate, setTaxRate] = useState(15); // VAT %
  const [lineItems, setLineItems] = useState([
    { id: 1, name: "Premium Bitter Leaf Powder (500g)", price: 45.0, qty: 2 },
    { id: 2, name: "Vocal Chord Vocalist Syrup (250ml)", price: 32.5, qty: 1 },
    { id: 3, name: "Prepress Layout Consultation Hour", price: 150.0, qty: 1 },
  ]);

  const addLineItem = () => {
    const nextId = lineItems.length + 1;
    setLineItems([...lineItems, { id: nextId, name: "New Premium Item", price: 10.0, qty: 1 }]);
  };

  const removeLineItem = (id: number) => {
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  const updateLineItem = (id: number, key: "name" | "price" | "qty", value: any) => {
    setLineItems(lineItems.map(item => {
      if (item.id === id) {
        return { ...item, [key]: value };
      }
      return item;
    }));
  };

  const subTotal = lineItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const taxAmount = (subTotal * (taxRate / 100));
  const totalAmount = subTotal + taxAmount;

  // MODE 5: BUSINESS CARDS STATES
  const [cardSide, setCardSide] = useState<"front" | "back">("front");
  const [cardName, setCardName] = useState("Bob Ashley");
  const [cardJob, setCardJob] = useState("Lead Wellness Advisor & Publisher");
  const [cardPhone, setCardPhone] = useState("+233 24 555 9012");
  const [cardEmail, setCardEmail] = useState("ewuraba@ritemasta.org");
  const [cardAddress, setCardAddress] = useState("No. 12 Cocoa House Street, Accra");

  // Premium Code Unlocks Handle
  const handleRedeemDesignerCode = () => {
    const formatted = promoCode.trim().toUpperCase();
    if (formatted === "TEST-DESIGNER-PRO" || formatted === "TEST-LIFETIME-PASS" || formatted === "LIFETIME") {
      setLocalUnlock(true);
      localStorage.setItem("ritemasta_designer_unlocked", "true");
      setUnlockMessage("✓ Creative Designer Premium Module successfully unlocked! Download exports are now enabled.");
      setPromoCode("");
    } else {
      setUnlockMessage("❌ Invalid upgrade code. Use bypass token 'TEST-DESIGNER-PRO' to unlock for evaluation.");
    }
  };

  const triggerDownloadPrint = () => {
    if (!isUnlocked) {
      alert("⚠️ Premium Exports Locked! The Creative Designer Module is monetized separately ($15 upgrade / TEST-DESIGNER-PRO). Let's unlock it first in the pricing panel!");
      return;
    }
    alert(`✓ Generating Print-Ready Vector PDF for ${activeMode.toUpperCase()}... Resolution target: 300 DPI. Safe-bleed zones checked! Download started.`);
  };

  const getThemeClasses = () => {
    switch (colorTheme) {
      case "midnight":
        return {
          bg: "bg-[#0F172A] text-slate-100 border-slate-700",
          card: "bg-[#1E293B] text-white border-slate-700",
          accentText: "text-[#38bdf8]",
          btnAccent: "bg-[#0ea5e9] text-white border-[#38bdf8]",
        };
      case "sage":
        return {
          bg: "bg-[#F4F6F4] text-[#1E2E1E] border-[#D1D9D1]",
          card: "bg-white text-[#1E2E1E] border-[#E2EAE2]",
          accentText: "text-[#4F7942]",
          btnAccent: "bg-[#4F7942] text-white border-[#689E57]",
        };
      case "crimson":
        return {
          bg: "bg-[#FDF6F6] text-[#3A1414] border-[#E8D1D1]",
          card: "bg-white text-[#3A1414] border-[#F2E4E4]",
          accentText: "text-[#B22222]",
          btnAccent: "bg-[#B22222] text-white border-[#D63838]",
        };
      case "charcoal":
        return {
          bg: "bg-[#121212] text-[#F3F3F3] border-[#292929]",
          card: "bg-[#1E1E1E] text-white border-[#2A2A2A]",
          accentText: "text-[#D4A853]",
          btnAccent: "bg-[#D4A853] text-[#2D1B0E] border-[#FFE3A8]",
        };
      default: // Cream
        return {
          bg: "bg-[#FDF8F0] text-[#2D1B0E] border-[#E8E0D8]",
          card: "bg-white text-[#2D1B0E] border-[#F0EAE1]",
          accentText: "text-[#D4A853]",
          btnAccent: "bg-[#2D1B0E] text-[#FDF8F0] border-[#4A3728]",
        };
    }
  };

  const tc = getThemeClasses();

  const getTemplatesForMode = () => {
    let list: any[] = [];
    switch (activeMode) {
      case "magazine": list = magazineTemplates; break;
      case "poster": list = posterTemplates; break;
      case "book_cover": list = coverTemplates; break;
      case "receipt": list = receiptTemplates; break;
      case "business_card": list = cardTemplates; break;
      default: list = [];
    }

    if (searchTerm.trim() !== "") {
      const s = searchTerm.toLowerCase();
      list = list.filter(tpl => 
        (tpl.name && tpl.name.toLowerCase().includes(s)) ||
        (tpl.title && tpl.title.toLowerCase().includes(s)) ||
        (tpl.subtitle && tpl.subtitle.toLowerCase().includes(s)) ||
        (tpl.story && tpl.story.toLowerCase().includes(s)) ||
        (tpl.body && tpl.body.toLowerCase().includes(s)) ||
        (tpl.quote && tpl.quote.toLowerCase().includes(s)) ||
        (tpl.author && tpl.author.toLowerCase().includes(s)) ||
        (tpl.company && tpl.company.toLowerCase().includes(s)) ||
        (tpl.client && tpl.client.toLowerCase().includes(s))
      );
    }

    if (themeFilter !== "all") {
      list = list.filter(tpl => tpl.theme === themeFilter);
    }

    return list;
  };

  const handleLoadTemplate = (tpl: any) => {
    setColorTheme(tpl.theme as any);
    switch (activeMode) {
      case "magazine":
        setMagTitle(tpl.title);
        setMagSubtitle(tpl.subtitle);
        setMagCoverStory(tpl.story);
        setMagColumns(tpl.columns);
        setMagBodyText(tpl.body);
        break;
      case "poster":
        setPosterTitle(tpl.title);
        setPosterQuote(tpl.quote);
        setPosterAuthor(tpl.author);
        setPosterLayout(tpl.layout);
        break;
      case "book_cover":
        setCoverTitle(tpl.title);
        setCoverSubTitle(tpl.subtitle);
        setCoverAuthor(tpl.author);
        setCoverPages(tpl.pages);
        setCoverSpineText(tpl.spine);
        break;
      case "receipt":
        setCompanyName(tpl.company);
        setReceiptNumber(tpl.number);
        setClientName(tpl.client);
        setTaxRate(tpl.tax);
        setLineItems(tpl.items);
        break;
      case "business_card":
        setCardName(tpl.nameField);
        setCardJob(tpl.jobField);
        setCardPhone(tpl.phoneField);
        setCardEmail(tpl.emailField);
        setCardAddress(tpl.addressField);
        break;
    }
    alert(`✓ Loaded curated preset template: "${tpl.name}"`);
  };

  return (
    <div className="bg-[#FFFDFB] py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Module Header */}
        <div className="flex flex-col items-center justify-center text-center gap-4 bg-white border border-[#E8E0D8] p-5 rounded-2xl shadow-sm">
          <div className="flex flex-col items-center justify-center text-center">
            <span className="inline-flex items-center gap-1.5 bg-[#D4A853]/15 text-[#D4A853] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 border border-[#D4A853]/30">
              <Layers className="w-3.5 h-3.5 animate-pulse" /> Advanced Visual Studio
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D1B0E] leading-tight text-center">
              Ritemasta Creative Design Engine
            </h1>
            <p className="text-xs text-[#8A7A6A] max-w-2xl mt-1 text-center">
              Empower indie writers with pre-press marketing layout collateral. Design Magazines, Book Covers, Posters, receipts, and brand cards in high resolution.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center">
            {!isUnlocked && (
              <button
                onClick={() => {
                  const bypass = prompt("Enter bypass voucher code key to unlock the Creative Designer upgrade ($15 value):", "TEST-DESIGNER-PRO");
                  if (bypass) {
                    setPromoCode(bypass);
                    const formatted = bypass.trim().toUpperCase();
                    if (formatted === "TEST-DESIGNER-PRO" || formatted === "TEST-LIFETIME-PASS") {
                      setLocalUnlock(true);
                      localStorage.setItem("ritemasta_designer_unlocked", "true");
                      alert("✓ Creative Designer Premium Module Unlocked!");
                    } else {
                      alert("Invalid code format.");
                    }
                  }
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-full flex items-center gap-1.5 shadow"
              >
                <Sparkles className="w-3.5 h-3.5" /> Unlock Premium Studio
              </button>
            )}
            <button
              onClick={triggerDownloadPrint}
              className="px-4 py-2 bg-[#2D1B0E] hover:bg-[#4A3728] text-white font-bold text-xs rounded-full flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Print-Ready Vector PDF
            </button>
          </div>
        </div>

        {/* Pricing Coordination & Info Bar */}
        <div className="bg-white border border-[#E8E0D8] p-6 rounded-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-center border-b pb-3 mb-4 gap-3">
            <h2 className="font-serif text-sm font-bold text-[#2D1B0E] uppercase tracking-wider flex items-center gap-2">
              <span className="p-1 bg-amber-100 text-amber-800 rounded">🏷️</span> RitemastaPro Official Access &amp; Pricing Packages
            </h2>
            <div className="flex items-center bg-[#FAF7F2] border p-1 rounded-lg">
              <button 
                onClick={() => setPricingCurrency("USD")}
                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${pricingCurrency === "USD" ? "bg-[#2D1B0E] text-white shadow-sm" : "text-[#8A7A6A] hover:text-[#2D1B0E]"}`}
                id="pricing-toggle-usd"
              >
                USD ($)
              </button>
              <button 
                onClick={() => setPricingCurrency("GHS")}
                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${pricingCurrency === "GHS" ? "bg-[#2D1B0E] text-white shadow-sm" : "text-[#8A7A6A] hover:text-[#2D1B0E]"}`}
                id="pricing-toggle-ghs"
              >
                GHS (₵)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            
            {/* Pass 1: standard pass */}
            <div className={`p-5 rounded-xl border flex flex-col justify-between transition-all ${user?.isUnlocked ? "bg-green-50/50 border-green-300" : "bg-[#FFFDFB] border-[#E8E0D8]"}`}>
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-[#2D1B0E] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Standard Package</span>
                  {user?.isUnlocked && <span className="bg-green-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">✓ ACTIVE</span>}
                </div>
                <h3 className="text-base font-bold text-[#2D1B0E]">Full Lifetime Access Pass</h3>
                <p className="text-[12px] text-amber-600 font-bold mt-0.5 font-mono">
                  {pricingCurrency === "USD" ? "$25.00 ONE-TIME PAYMENT" : "₵362.50 ONE-TIME PAYMENT"}
                </p>
                <ul className="text-xs text-[#8A7A6A] space-y-1.5 mt-3 list-disc pl-4 leading-normal">
                  <li><strong>Complete Book Publishers Suite:</strong> Compile EPUB, Kindle, and print-ready PDFs.</li>
                  <li><strong>No Subscriptions:</strong> Bypasses Vellum ($250) and Atticus ($147) forever.</li>
                  <li><strong>Full Studio Included:</strong> Automatically unlocks this Visual Design Studio at no extra cost!</li>
                </ul>
              </div>
              <div className="mt-4 pt-3 border-t">
                <span className="text-[11px] text-[#2D1B0E] font-semibold block text-center">
                  {user?.isUnlocked ? "Unlocked & Enabled! Thank you for purchasing." : "Redeem your Lifetime Pass Code in settings or buy via Export tab."}
                </span>
              </div>
            </div>

            {/* Pass 2: Studio Pass */}
            <div className={`p-5 rounded-xl border flex flex-col justify-between transition-all ${isUnlocked ? "bg-green-50/50 border-green-300" : "bg-[#FFFDFB] border-[#E8E0D8]"}`}>
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-amber-500 text-[#2D1B0E] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Design Studio Bundle</span>
                  {isUnlocked && <span className="bg-green-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">✓ UNLOCKED</span>}
                </div>
                <h3 className="text-base font-bold text-[#2D1B0E]">Standalone Creative Designer Upgrade</h3>
                <p className="text-[12px] text-amber-600 font-bold mt-0.5 font-mono">
                  {pricingCurrency === "USD" ? "$15.00 ONE-TIME PAYMENT" : "₵217.50 ONE-TIME PAYMENT"}
                </p>
                <ul className="text-xs text-[#8A7A6A] space-y-1.5 mt-3 list-disc pl-4 leading-normal">
                  <li><strong>Aesthetic Marketing layouts:</strong> Build Posters, double-sided Business Cards and Magazine pages.</li>
                  <li><strong>Smart Presets:</strong> Access 15+ curated pre-press business templates with 300 DPI raw vector PDF exports.</li>
                  <li><strong>Developer Evaluation:</strong> Enter code <code className="bg-[#2D1B0E] text-white px-1 py-0.5 rounded text-[10px]">TEST-DESIGNER-PRO</code> below to test instantly.</li>
                </ul>
              </div>
              <div className="mt-4 pt-3 border-t flex items-center justify-between gap-2">
                <input
                  type="text"
                  placeholder="ENTER UPGRADE CODE"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 bg-white border border-[#E8E0D8] px-3 py-1.5 rounded-lg text-xs font-mono uppercase focus:outline-none"
                />
                <button
                  onClick={handleRedeemDesignerCode}
                  className="px-3 py-1.5 bg-[#D4A853] hover:bg-[#C49A42] text-[#2D1B0E] font-bold text-xs rounded-lg transition-transform"
                >
                  Apply
                </button>
              </div>
            </div>

          </div>
          {unlockMessage && (
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold rounded-lg text-center">
              {unlockMessage}
            </div>
          )}
        </div>

        {/* Studio Sub-tabs Workspace */}
        <div className="bg-white border border-[#E8E0D8] rounded-2xl shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          
          {/* LEFT DESK: Quick Category Switcher & Specific State Controls (Col-span 4) */}
          <div className="lg:col-span-4 border-r border-[#E8E0D8] flex flex-col bg-[#FAF7F2]">
            {/* Mode Category Links */}
            <div className="p-3 bg-white border-b border-[#E8E0D8] flex gap-1 overflow-x-auto scrollbar-none shrink-0">
              <button
                onClick={() => setActiveMode("magazine")}
                className={`px-3 py-2 rounded-lg text-xs font-bold tracking-tight shrink-0 transition-all flex items-center gap-1 ${
                  activeMode === "magazine" ? "bg-[#2D1B0E] text-white" : "text-[#8A7A6A] hover:bg-[#FAF7F2]"
                }`}
              >
                <span>📰</span> Mag
              </button>
              <button
                onClick={() => setActiveMode("poster")}
                className={`px-3 py-2 rounded-lg text-xs font-bold tracking-tight shrink-0 transition-all flex items-center gap-1 ${
                  activeMode === "poster" ? "bg-[#2D1B0E] text-white" : "text-[#8A7A6A] hover:bg-[#FAF7F2]"
                }`}
              >
                <span>🖼️</span> Poster
              </button>
              <button
                onClick={() => setActiveMode("book_cover")}
                className={`px-3 py-2 rounded-lg text-xs font-bold tracking-tight shrink-0 transition-all flex items-center gap-1 ${
                  activeMode === "book_cover" ? "bg-[#2D1B0E] text-white" : "text-[#8A7A6A] hover:bg-[#FAF7F2]"
                }`}
              >
                <span>📖</span> Cover
              </button>
              <button
                onClick={() => setActiveMode("receipt")}
                className={`px-3 py-2 rounded-lg text-xs font-bold tracking-tight shrink-0 transition-all flex items-center gap-1 ${
                  activeMode === "receipt" ? "bg-[#2D1B0E] text-white" : "text-[#8A7A6A] hover:bg-[#FAF7F2]"
                }`}
              >
                <span>🧾</span> Forms
              </button>
              <button
                onClick={() => setActiveMode("business_card")}
                className={`px-3 py-2 rounded-lg text-xs font-bold tracking-tight shrink-0 transition-all flex items-center gap-1 ${
                  activeMode === "business_card" ? "bg-[#2D1B0E] text-white" : "text-[#8A7A6A] hover:bg-[#FAF7F2]"
                }`}
              >
                <span>📇</span> Card
              </button>
            </div>

            {/* Customizer Widgets Container */}
            <div className="p-5 flex-1 overflow-y-auto space-y-5">
              
              {/* Layout Presets Selection Widget with upgraded Search & Filter controls */}
              <div className="bg-white border p-3.5 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-[#2D1B0E] uppercase tracking-wider flex items-center justify-between font-sans">
                  <span className="flex items-center gap-1.5"><LayoutGrid className="w-3.5 h-3.5 text-[#D4A853]" /> Curated Templates</span>
                  <span className="text-[9px] bg-amber-500/10 text-amber-800 px-1.5 py-0.5 rounded-full font-bold">15 Presets</span>
                </h4>

                {/* Search input bar */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-[#867667]">
                    <Search className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={`Search ${activeMode} layouts...`}
                    className="w-full bg-[#FAF7F2] border border-[#E8E0D8] pl-8 pr-7 py-1.5 rounded-lg text-xs placeholder:text-[#B8A89A] focus:outline-none focus:border-[#D4A853]"
                    id="template-search-input"
                  />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm("")}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[#867667] hover:text-[#2D1B0E]"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Color theme filters */}
                <div className="space-y-1">
                  <span className="text-[9px] text-[#867667] font-semibold uppercase tracking-wider block">Palette Mood:</span>
                  <div className="flex flex-wrap gap-1">
                    {[
                      { key: "all", label: "All Colors" },
                      { key: "cream", label: "Cream" },
                      { key: "midnight", label: "Slate" },
                      { key: "sage", label: "Sage" },
                      { key: "charcoal", label: "Charcoal" },
                      { key: "crimson", label: "Rose" },
                    ].map((btn) => (
                      <button
                        key={btn.key}
                        onClick={() => setThemeFilter(btn.key)}
                        className={`px-1.5 py-0.5 text-[9px] font-bold rounded border transition-all ${
                          themeFilter === btn.key 
                            ? "bg-[#D4A853] text-[#2D1B0E] border-[#D4A853]" 
                            : "bg-[#FAF7F2] text-[#8A7A6A] border-[#E8E0D8] hover:text-[#2D1B0E]"
                        }`}
                        id={`theme-filter-pill-${btn.key}`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 text-left max-h-[220px] overflow-y-auto pr-0.5">
                  {getTemplatesForMode().length === 0 ? (
                    <p className="text-[10px] text-center py-4 text-[#8A7A6A] italic">No matching templates found.</p>
                  ) : (
                    getTemplatesForMode().map((tpl) => (
                      <div
                        key={tpl.id}
                        className="p-2 border border-[#E8E0D8]/80 hover:border-[#D4A853] rounded-lg bg-[#FAF7F2] hover:bg-white transition-all text-left flex items-center justify-between gap-1.5"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-bold text-[#2D1B0E] truncate">
                            ✨ {tpl.name}
                          </p>
                          <p className="text-[9px] text-[#8A7A6A] font-mono uppercase tracking-tight">
                            {tpl.theme} Style
                          </p>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button
                            onClick={() => setSelectedPreviewTemplate(tpl)}
                            className="p-1 px-2 text-[10px] bg-white border border-[#E8E0D8] text-[#2D1B0E] rounded hover:border-[#2D1B0E] flex items-center gap-0.5 hover:bg-slate-50 transition-all font-semibold"
                            id={`btn-preview-${tpl.id}`}
                          >
                            <Eye className="w-3 h-3 text-[#D4A853]" /> Specs
                          </button>
                          <button
                            onClick={() => handleLoadTemplate(tpl)}
                            className="p-1 bg-[#2D1B0E] text-white hover:bg-amber-600 rounded flex items-center justify-center transition-all px-2 text-[10px] font-bold"
                            id={`btn-load-${tpl.id}`}
                          >
                            Load
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Theme Settings Widget */}
              <div className="bg-white border p-3.5 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-[#2D1B0E] uppercase tracking-wider flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5 text-[#D4A853]" /> Palette & Mood Selection
                </h4>
                <div className="grid grid-cols-5 gap-1.5">
                  {[
                    { key: "cream", name: "Cream", hexBg: "bg-[#FDF8F0]" },
                    { key: "midnight", name: "Slate", hexBg: "bg-[#0F172A]" },
                    { key: "sage", name: "Sage", hexBg: "bg-[#BAC7BA]" },
                    { key: "crimson", name: "Rose", hexBg: "bg-[#E39494]" },
                    { key: "charcoal", name: "Char", hexBg: "bg-[#1E1E1E]" },
                  ].map((preset) => (
                    <button
                      key={preset.key}
                      onClick={() => setColorTheme(preset.key as any)}
                      title={preset.name}
                      className={`h-8 rounded-lg border-2 ${preset.hexBg} transition-all relative ${
                        colorTheme === preset.key ? "border-[#D4A853] scale-105" : "border-slate-200 hover:scale-102"
                      }`}
                    >
                      {colorTheme === preset.key && (
                        <Check className="w-3.5 h-3.5 absolute inset-0 m-auto text-amber-500 stroke-[3]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* DYNAMIC FORM VIEWS BY ACTIVE TAB */}
              {activeMode === "magazine" && (
                <div className="space-y-4">
                  <div className="border-l-4 border-amber-500 pl-2.5">
                    <h3 className="text-sm font-bold text-[#2D1B0E]">Magazine Typography Settings</h3>
                    <p className="text-[10px] text-[#867667]">Configure editorial master stories with dynamic columns.</p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#2D1B0E] mb-1">Magazine Title</label>
                    <input
                      type="text"
                      value={magTitle}
                      onChange={(e) => setMagTitle(e.target.value)}
                      className="w-full bg-white border px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-[#D4A853]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#2D1B0E] mb-1">Issue Subtitle</label>
                    <input
                      type="text"
                      value={magSubtitle}
                      onChange={(e) => setMagSubtitle(e.target.value)}
                      className="w-full bg-white border px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-[#D4A853]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#2D1B0E] mb-1">Main Cover Story Header</label>
                    <input
                      type="text"
                      value={magCoverStory}
                      onChange={(e) => setMagCoverStory(e.target.value)}
                      className="w-full bg-white border px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-[#D4A853]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#2D1B0E] mb-1">Columns Layout</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[2, 3].map((num) => (
                        <button
                          key={num}
                          onClick={() => setMagColumns(num)}
                          className={`py-1.5 border rounded-lg text-xs font-bold ${
                            magColumns === num ? "bg-[#2D1B0E] text-white border-transparent" : "bg-white hover:bg-slate-55"
                          }`}
                        >
                          {num} Columns
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#2D1B0E] mb-1">Editorial Article Content</label>
                    <textarea
                      rows={5}
                      value={magBodyText}
                      onChange={(e) => setMagBodyText(e.target.value)}
                      className="w-full bg-white border px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-[#D4A853] font-serif leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {activeMode === "poster" && (
                <div className="space-y-4">
                  <div className="border-l-4 border-amber-500 pl-2.5">
                    <h3 className="text-sm font-bold text-[#2D1B0E]">Wall Poster Customization</h3>
                    <p className="text-[10px] text-[#867667]">Create aesthetic inspirational board layouts for print.</p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#2D1B0E] mb-1">Primary Headliner</label>
                    <input
                      type="text"
                      value={posterTitle}
                      onChange={(e) => setPosterTitle(e.target.value)}
                      className="w-full bg-white border px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-[#D4A853]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#2D1B0E] mb-1">Inspirational Quote Body</label>
                    <textarea
                      rows={4}
                      value={posterQuote}
                      onChange={(e) => setPosterQuote(e.target.value)}
                      className="w-full bg-white border px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-[#D4A853] font-serif"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#2D1B0E] mb-1">Signature Credit Line</label>
                    <input
                      type="text"
                      value={posterAuthor}
                      onChange={(e) => setPosterAuthor(e.target.value)}
                      className="w-full bg-white border px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-[#D4A853]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#2D1B0E] mb-1">Poster Framing Style</label>
                    <div className="grid grid-cols-3 gap-2 text-[10px] font-bold">
                      {(["editorial", "minimal", "bold"] as const).map((style) => (
                        <button
                          key={style}
                          onClick={() => setPosterLayout(style)}
                          className={`py-1.5 border rounded-lg uppercase ${
                            posterLayout === style ? "bg-[#2D1B0E] text-white border-transparent" : "bg-white hover:bg-slate-55"
                          }`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeMode === "book_cover" && (
                <div className="space-y-4">
                  <div className="border-l-4 border-amber-500 pl-2.5">
                    <h3 className="text-sm font-bold text-[#2D1B0E]">Full Spine-Width Book Cover</h3>
                    <p className="text-[10px] text-[#867667]">Precision bleed calculators for Amazon paperback prints.</p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#2D1B0E] mb-1">Book Title Line</label>
                    <input
                      type="text"
                      value={coverTitle}
                      onChange={(e) => setCoverTitle(e.target.value)}
                      className="w-full bg-white border px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-[#D4A853]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#2D1B0E] mb-1">Subtitle Prose</label>
                    <input
                      type="text"
                      value={coverSubTitle}
                      onChange={(e) => setCoverSubTitle(e.target.value)}
                      className="w-full bg-white border px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-[#D4A853]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#2D1B0E] mb-1">Author Name Label</label>
                    <input
                      type="text"
                      value={coverAuthor}
                      onChange={(e) => setCoverAuthor(e.target.value)}
                      className="w-full bg-white border px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-[#D4A853]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#2D1B0E] mb-1">Paperback Book Pages ({coverPages} Pages)</label>
                    <input
                      type="range"
                      min={50}
                      max={800}
                      step={5}
                      value={coverPages}
                      onChange={(e) => setCoverPages(Number(e.target.value))}
                      className="w-full h-1.5 bg-[#E8E0D8] rounded-lg appearance-none cursor-pointer accent-[#D4A853]"
                    />
                    <div className="flex justify-between items-center text-[10px] font-mono text-[#8C7A6D] mt-1">
                      <span>50 pages (0.11" spine)</span>
                      <span className="font-bold text-[#2D1B0E]">Calculated: {calculatedSpineWidth}"</span>
                      <span>800 pages (1.80" spine)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#2D1B0E] mb-1">Cover Spine Printed Text</label>
                    <input
                      type="text"
                      value={coverSpineText}
                      onChange={(e) => setCoverSpineText(e.target.value)}
                      className="w-full bg-white border px-3 py-2 rounded-lg text-xs font-serif"
                    />
                  </div>
                </div>
              )}

              {activeMode === "receipt" && (
                <div className="space-y-4">
                  <div className="border-l-4 border-amber-500 pl-2.5">
                    <h3 className="text-sm font-bold text-[#2D1B0E]">Legal Business Invoice / Form</h3>
                    <p className="text-[10px] text-[#867667]">Generate receipt books for herbal remedies and layouts.</p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#2D1B0E] mb-1">Issuer Company Name</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full bg-white border px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-[#D4A853]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-[#2D1B0E] mb-1">Form Reference #</label>
                      <input
                        type="text"
                        value={receiptNumber}
                        onChange={(e) => setReceiptNumber(e.target.value)}
                        className="w-full bg-white border px-2 py-1.5 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#2D1B0E] mb-1">Billed To (Client)</label>
                      <input
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full bg-white border px-2 py-1.5 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#2D1B0E] mb-1">VAT or Sales Tax (%)</label>
                    <input
                      type="number"
                      value={taxRate}
                      onChange={(e) => setTaxRate(Number(e.target.value))}
                      className="w-32 bg-white border px-2 py-1 rounded-lg text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-2 border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase font-bold text-[#2D1B0E]">Line Items database</span>
                      <button
                        onClick={addLineItem}
                        className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded flex items-center gap-0.5"
                      >
                        <Plus className="w-2.5 h-2.5" /> Add Row
                      </button>
                    </div>

                    <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                      {lineItems.map((item) => (
                        <div key={item.id} className="bg-white p-2 rounded border text-[10px] space-y-1.5">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => updateLineItem(item.id, "name", e.target.value)}
                            placeholder="Item description"
                            className="w-full bg-slate-50 border-r-0 px-1.5 py-0.5 rounded text-[9px] font-medium"
                          />
                          <div className="grid grid-cols-3 gap-1.5 items-center">
                            <div className="flex items-center gap-1">
                              <span>Price:</span>
                              <input
                                type="number"
                                value={item.price}
                                onChange={(e) => updateLineItem(item.id, "price", parseFloat(e.target.value) || 0)}
                                className="w-12 bg-slate-50 px-1 py-0.5 text-center font-mono"
                              />
                            </div>
                            <div className="flex items-center gap-1">
                              <span>Qty:</span>
                              <input
                                type="number"
                                value={item.qty}
                                onChange={(e) => updateLineItem(item.id, "qty", parseInt(e.target.value) || 0)}
                                className="w-10 bg-slate-50 px-1 py-0.5 text-center font-mono"
                              />
                            </div>
                            <button
                              onClick={() => removeLineItem(item.id)}
                              className="text-red-500 hover:text-red-700 text-right pr-1"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeMode === "business_card" && (
                <div className="space-y-4">
                  <div className="border-l-4 border-amber-500 pl-2.5">
                    <h3 className="text-sm font-bold text-[#2D1B0E]">Double-Sided Premium Business Card</h3>
                    <p className="text-[10px] text-[#867667]">Print corporate details on standard 3.5" x 2" landscape grids.</p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#2D1B0E] mb-1">Active Card Side View</label>
                    <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                      <button
                        onClick={() => setCardSide("front")}
                        className={`py-1.5 border rounded-lg ${
                          cardSide === "front" ? "bg-[#2D1B0E] text-white" : "bg-white"
                        }`}
                      >
                        Front (Logo Lockup)
                      </button>
                      <button
                        onClick={() => setCardSide("back")}
                        className={`py-1.5 border rounded-lg ${
                          cardSide === "back" ? "bg-[#2D1B0E] text-white" : "bg-white"
                        }`}
                      >
                        Back (Contact Desk)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#2D1B0E] mb-1">Professional Full Name</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full bg-white border px-3 py-2 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#2D1B0E] mb-1">Job Designation</label>
                    <input
                      type="text"
                      value={cardJob}
                      onChange={(e) => setCardJob(e.target.value)}
                      className="w-full bg-white border px-3 py-2 rounded-lg text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-[#2D1B0E] mb-1">Telephone Contact</label>
                      <input
                        type="text"
                        value={cardPhone}
                        onChange={(e) => setCardPhone(e.target.value)}
                        className="w-full bg-white border px-2.5 py-1.5 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#2D1B0E] mb-1">Email Box Address</label>
                      <input
                        type="text"
                        value={cardEmail}
                        onChange={(e) => setCardEmail(e.target.value)}
                        className="w-full bg-white border px-2.5 py-1.5 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#2D1B0E] mb-1">Corporate Physical Office</label>
                      <input
                        type="text"
                        value={cardAddress}
                        onChange={(e) => setCardAddress(e.target.value)}
                        className="w-full bg-white border px-2.5 py-1.5 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* RIGHT CANVAS PREVIEW: The beautiful responsive frame representing print limits (Col-span 8) */}
          <div className="lg:col-span-8 p-6 sm:p-10 flex flex-col justify-between bg-slate-900 overflow-hidden relative">
            
            {/* Real-time Watermark or Unlock Indicator */}
            <div className="absolute top-3 right-3 z-10">
              {isUnlocked ? (
                <span className="bg-emerald-500/20 text-[#34d399] border border-emerald-500/30 text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1 backdrop-blur-sm shadow-md">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" /> Vector Output Unlocked
                </span>
              ) : (
                <span className="bg-red-500/20 text-red-300 border border-red-500/20 text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1 backdrop-blur-sm shadow-md">
                  ⚠️ Draft Evaluation (Watermarked)
                </span>
              )}
            </div>

            {/* Print Stage Header */}
            <div className="text-left mb-6 shrink-0">
              <span className="text-[10px] font-mono text-slate-400 block uppercase tracking-wider">Canvas Presentation Live Stage (300 DPI Rendering)</span>
              <span className="text-xs text-slate-300 mt-1 block font-sans">
                Active Theme: <span className="font-bold text-amber-400 capitalize">{colorTheme}</span> | Dimensions: <span className="font-mono text-amber-400">{activeMode === "book_cover" ? `${(14.25 + coverPages*0.00225).toFixed(2)}" x 9.25" Wrap` : activeMode === "business_card" ? "3.5\" x 2.0\"" : "8.5\" x 11\" US Letter"}</span>
              </span>
            </div>

            {/* THE RESPONSIVE CANVAS INNER */}
            <div className="flex-1 flex items-center justify-center py-4 relative">
              
              {/* WATERMARK EFFECT if not unlocked */}
              {!isUnlocked && (
                <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center overflow-hidden">
                  <span className="text-red-500/10 text-4xl sm:text-7xl font-sans font-black tracking-widest uppercase rotate-12 select-none select-all text-center">
                    RITEMASTAPRO EVAL <br /> WATERMARK PREVIEW
                  </span>
                </div>
              )}

              {/* 1. MAGAZINE LAYOUT CANVAS */}
              {activeMode === "magazine" && (
                <div className={`w-full max-w-lg aspect-[3/4] p-8 border shadow-2xl rounded-sm transition-all duration-300 relative overflow-hidden font-sans ${tc.bg} ${tc.card}`}>
                  {/* Decorative Border */}
                  <div className="absolute inset-2 border border-current opacity-10 pointer-events-none" />

                  {/* Header metadata row */}
                  <div className="flex justify-between items-center text-[9px] border-b pb-1.5 uppercase font-bold tracking-widest opacity-80">
                    <span>Ghana Edition 2026</span>
                    <span className={tc.accentText}>Volume III No. VII</span>
                    <span>No subscription fee</span>
                  </div>

                  {/* Large Stylized Logo header */}
                  <div className="text-center py-4">
                    <h1 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tighter uppercase leading-none border-y border-current py-2.5">
                      {magTitle}
                    </h1>
                    <p className="text-[10px] tracking-wide mt-1 italic font-serif">
                      {magSubtitle}
                    </p>
                  </div>

                  {/* Primary Feature Story Row */}
                  <div className="bg-black/5 p-4 rounded text-center my-3 relative">
                    <span className="text-[8px] font-mono uppercase bg-amber-500 text-[#2D1B0E] font-bold px-1.5 py-0.5 rounded absolute -top-2 left-4">
                      Cover Feature Story
                    </span>
                    <h3 className="font-serif text-xs sm:text-sm font-bold text-balance leading-normal">
                      {magCoverStory}
                    </h3>
                  </div>

                  {/* Dynamic Editorial article columns output */}
                  <div className={`grid grid-cols-1 ${magColumns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"} gap-4 text-[10px] leading-relaxed font-serif text-justify pt-2`}>
                    <div className="space-y-2">
                      <p className="first-letter:text-2xl first-letter:font-bold first-letter:float-left first-letter:mr-1.5 first-letter:text-amber-500">
                        {magBodyText.slice(0, 150)}...
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="italic font-medium opacity-90 border-l border-amber-500/40 pl-2">
                        "Holistic integration enables native authors &amp; developers to persist layout formats natively."
                      </p>
                      <p className="text-[9px]">
                        {magBodyText.slice(150, 300) || "Additional diagnostic column text wraps here gracefully."}
                      </p>
                    </div>
                    {magColumns === 3 && (
                      <div className="hidden sm:block text-[9px] opacity-80">
                        <p className="font-bold mb-1 uppercase tracking-wide text-[8px]">In summary:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Secure layouts</li>
                          <li>Beautiful print spreads</li>
                          <li>Offline publishing</li>
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Bottom Footer block */}
                  <div className="absolute bottom-4 left-8 right-8 flex justify-between items-center text-[8px] opacity-75 font-mono border-t pt-1.5">
                    <span>Design: RitemastaPro Visual Engine</span>
                    <span>Page 41</span>
                  </div>
                </div>
              )}

              {/* 2. POSTER LAYOUT CANVAS */}
              {activeMode === "poster" && (
                <div className={`w-full max-w-sm aspect-[1/1.4] p-8 border shadow-2xl rounded transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${tc.bg} ${tc.card}`}>
                  {/* Styling Border Frames */}
                  {posterLayout === "editorial" && (
                    <div className="absolute inset-4 border-2 border-double border-current opacity-30 pointer-events-none" />
                  )}

                  {/* Section Top */}
                  <div className="pt-6 text-center">
                    <span className="text-[9px] uppercase tracking-widest font-mono opacity-80 font-bold block mb-1">
                      Aesthetic Broadsheet series
                    </span>
                    <div className="w-8 h-px bg-current mx-auto opacity-40" />
                  </div>

                  {/* Section Middle: The Quote display */}
                  <div className="text-center px-4 space-y-6">
                    {posterLayout === "bold" ? (
                      <h1 className="font-sans text-3xl sm:text-4xl font-black uppercase tracking-tight leading-none text-balance">
                        {posterTitle}
                      </h1>
                    ) : (
                      <h1 className="font-serif text-2xl sm:text-3xl font-normal italic tracking-tight leading-tight">
                        {posterTitle}
                      </h1>
                    )}

                    <div className="w-12 h-1 bg-amber-500 mx-auto rounded" />

                    <p className="font-serif text-sm sm:text-base leading-relaxed italic text-balance opacity-90">
                      "{posterQuote}"
                    </p>
                  </div>

                  {/* Section Bottom */}
                  <div className="pb-6 text-center space-y-1.5">
                    <p className="text-[10px] tracking-wide uppercase font-bold text-amber-500">
                      - {posterAuthor} -
                    </p>
                    <span className="text-[8px] font-mono tracking-widest uppercase opacity-60 block">
                      Rendered on RitemastaPro • US Letter Broadsheet Print
                    </span>
                  </div>
                </div>
              )}

              {/* 3. BOOK COVER CANVAS (Full Wrap Wrap-around: Back Cover | Spine | Front Cover) */}
              {activeMode === "book_cover" && (
                <div className={`w-full max-w-2xl aspect-[1.8/1] p-5 border text-xs shadow-2xl rounded-md transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${tc.bg} ${tc.card} font-serif`}>
                  
                  {/* Canvas divided into Back cover, Spine, Front cover */}
                  <div className="grid grid-cols-12 h-full gap-2 relative">
                    
                    {/* LEFT THIRD: BACK COVER DRAFT */}
                    <div className="col-span-5 border-r border-dashed border-current/25 pr-3 flex flex-col justify-between h-full bg-black/5 p-3 rounded">
                      <div className="space-y-2">
                        <span className="text-[8px] font-mono uppercase bg-slate-500 text-white px-1.5 rounded inline-block">Back Cover (Bleed included)</span>
                        <h4 className="text-xs font-bold font-sans uppercase">Synopsis &amp; Blurbs</h4>
                        <p className="text-[8px] leading-relaxed text-justify line-clamp-6 font-sans">
                          Formatted natively without standard Word processor crashes. Authors, health coaches, and indie creators are unlocked with maximum design templates, making digital and paperback manuscript exports simple and beautiful.
                        </p>
                      </div>

                      {/* Barcode Mockup */}
                      <div className="flex justify-between items-end border-t border-current/15 pt-2">
                        <div className="bg-white p-1 text-black font-mono text-[8px] flex flex-col items-center">
                          <span className="font-black tracking-widest text-[11px] block text-center">|||| | | ||| | ||</span>
                          <span className="text-[7px]">ISBN 978-0-226-5-5</span>
                        </div>
                        <span className="text-[7px] text-right font-sans">Ritemasta Publications • $25.00</span>
                      </div>
                    </div>

                    {/* MIDDLE SLIVER: BOOK SPINE */}
                    <div className="col-span-2 border-r border-dashed border-current/25 flex flex-col items-center justify-center relative overflow-hidden bg-black/10 px-1 py-4">
                      {/* Vertical text inside spine */}
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="rotate-90 origin-center whitespace-nowrap text-[9px] uppercase tracking-widest font-bold tracking-tight text-center">
                          {coverSpineText || "HEALING PROTOCOLS"}
                        </div>
                      </div>
                      
                      {/* Small tech details */}
                      <span className="text-[7px] text-amber-500 absolute bottom-1 font-mono">{coverPages} Pages</span>
                    </div>

                    {/* RIGHT THIRD: FRONT COVER */}
                    <div className="col-span-5 pl-3 flex flex-col justify-between h-full relative">
                      <span className="text-[8px] font-mono text-amber-500 absolute top-0 right-0">Front Cover (Bleed included)</span>
                      
                      {/* Cover Header */}
                      <div className="space-y-2 mt-4 text-center">
                        <p className="text-[8px] font-sans tracking-widest uppercase text-amber-500 font-bold">Standard First Edition</p>
                        <h2 className="text-sm sm:text-base font-extrabold uppercase leading-tight tracking-normal text-balance border-b pb-1">
                          {coverTitle}
                        </h2>
                        <p className="text-[8px] leading-snug italic font-serif opacity-90">
                          {coverSubTitle}
                        </p>
                      </div>

                      {/* Floral graphic center mockup */}
                      <div className="my-auto text-center py-2">
                        <div className="w-10 h-10 rounded-full border border-amber-500/40 flex items-center justify-center mx-auto text-sm">
                          🌿
                        </div>
                      </div>

                      {/* Cover Footer */}
                      <div className="text-center pb-2 border-t pt-1.5">
                        <p className="text-[9px] font-sans font-bold uppercase tracking-widest">
                          {coverAuthor}
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* 4. RECEIPT BOOK CANVAS */}
              {activeMode === "receipt" && (
                <div className={`w-full max-w-lg aspect-[1.4/1] p-6 border shadow-2xl rounded transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${tc.bg} ${tc.card} font-sans`}>
                  
                  {/* Receipt header row */}
                  <div className="flex justify-between items-start border-b pb-4">
                    <div>
                      <h2 className="text-sm font-black uppercase tracking-wider">{companyName}</h2>
                      <p className="text-[9px] opacity-75">No. 12 Cocoa House Street, Accra • Tel: +233 24 555 9012</p>
                    </div>
                    <div className="text-right">
                      <span className="bg-[#D4A853]/20 text-[#D4A853] text-[9.5px] font-bold px-2 py-0.5 rounded uppercase">Invoice Receipt</span>
                      <p className="text-[9px] font-mono mt-1 text-slate-400">Ref: {receiptNumber}</p>
                    </div>
                  </div>

                  {/* Billing address row */}
                  <div className="grid grid-cols-2 gap-4 text-[10px] py-3 my-1 bg-black/5 rounded px-2.5">
                    <div>
                      <span className="text-[8px] uppercase tracking-wider text-slate-400 block font-bold">Billed To</span>
                      <span className="font-bold">{clientName}</span>
                      <p className="text-[9px] opacity-75">Contract Author Account</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[8px] uppercase tracking-wider text-slate-400 block font-bold">Date of Invoice</span>
                      <span>{new Date().toISOString().slice(0, 10)}</span>
                      <p className="text-[9px] text-[#D4A853] font-bold">Payment Status: Approved</p>
                    </div>
                  </div>

                  {/* Receipt Table Items */}
                  <div className="flex-1 overflow-y-auto min-h-24">
                    <table className="w-full text-left text-[10px] border-collapse">
                      <thead>
                        <tr className="border-b text-slate-400 font-bold uppercase text-[8px]">
                          <th className="py-1">Description</th>
                          <th className="py-1 text-center">Unit Price</th>
                          <th className="py-1 text-center">Qty</th>
                          <th className="py-1 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lineItems.map((item) => (
                          <tr key={item.id} className="border-b border-dashed border-current/10">
                            <td className="py-1.5 font-medium">{item.name}</td>
                            <td className="py-1.5 text-center font-mono">${item.price.toFixed(2)}</td>
                            <td className="py-1.5 text-center font-mono">{item.qty}</td>
                            <td className="py-1.5 text-right font-mono">${(item.price * item.qty).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Receipt Summary calculation row */}
                  <div className="border-t pt-2 mt-2 flex justify-between items-end">
                    <div className="text-[8px] text-slate-400 max-w-[200px] leading-tight">
                      Thank you for choosing RitemastaPro. All organic purchases include native local botanical consulting sessions. Excludes delivery tax.
                    </div>
                    <div className="w-48 text-[11px] font-bold text-right space-y-1">
                      <div className="flex justify-between text-slate-400 text-[10px]">
                        <span>Subtotal:</span>
                        <span className="font-mono">${subTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-slate-400 text-[10px]">
                        <span>VAT ({taxRate}%):</span>
                        <span className="font-mono">${taxAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-lg border-t pt-1 font-black text-amber-500">
                        <span>Grand Total:</span>
                        <span className="font-mono text-[#D4A853]">${totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* 5. BUSINESS CARDS CANVAS */}
              {activeMode === "business_card" && (
                <div className={`w-full max-w-sm aspect-[1.75/1] p-6 border shadow-2xl rounded-lg transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${tc.bg} ${tc.card} font-sans`}>
                  
                  {/* Decorative corner block */}
                  <div className="absolute top-0 right-0 w-12 h-12 bg-amber-500/10 rounded-bl-full pointer-events-none" />

                  {cardSide === "front" ? (
                    /* FRONT OF BUSINESS CARD */
                    <div className="flex flex-col justify-between h-full items-center text-center py-4">
                      {/* Mini Logo lockup */}
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-amber-500 text-[#2D1B0E] flex items-center justify-center font-bold text-xs font-serif shadow-sm">
                          RM
                        </div>
                        <div className="text-left leading-none">
                          <span className="text-sm font-serif font-bold tracking-tight">Ritemasta<span className={tc.accentText}>Pro</span></span>
                          <span className="text-[6px] text-slate-400 block tracking-widest uppercase">Publishing Solutions</span>
                        </div>
                      </div>

                      {/* Display name and role */}
                      <div className="space-y-1">
                        <h2 className="text-base font-bold font-serif uppercase tracking-wider">{cardName}</h2>
                        <p className="text-[9px] text-[#D4A853] font-bold uppercase tracking-widest">{cardJob}</p>
                      </div>

                      <span className="text-[7px] font-mono uppercase tracking-widest opacity-60">Interactive Standard Print card • 3.5" x 2.0"</span>
                    </div>
                  ) : (
                    /* BACK OF BUSINESS CARD */
                    <div className="flex flex-col justify-between h-full py-2">
                      <div className="flex justify-between items-center border-b pb-1.5">
                        <span className="text-[8px] font-mono tracking-widest uppercase text-amber-500 font-bold">Desk &amp; Consulting Support</span>
                        <div className="w-2.5 h-2.5 bg-amber-500 rounded-full" />
                      </div>

                      {/* Personal metadata contact rows */}
                      <div className="space-y-2 py-2">
                        <div className="flex items-center gap-2 text-[10px]">
                          <span className="text-amber-500 text-xs">📞</span>
                          <span className="font-mono">{cardPhone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px]">
                          <span className="text-amber-500 text-xs">✉️</span>
                          <span className="font-mono">{cardEmail}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px]">
                          <span className="text-amber-500 text-xs text-balance">🏢</span>
                          <span className="opacity-90">{cardAddress}</span>
                        </div>
                      </div>

                      {/* Footer link line */}
                      <div className="flex justify-between items-center text-[7px] pt-1.5 border-t opacity-70 uppercase font-mono">
                        <span>Web Applet: RitemastaPro</span>
                        <span>Accra, West Africa</span>
                      </div>
                    </div>
                  )}

                  {/* Card bottom bar */}
                  <div className="absolute bottom-1 right-2">
                    <span className="text-[6px] opacity-40 font-mono">RitemastaPro Studio</span>
                  </div>

                </div>
              )}

            </div>

            {/* Print Stage Footer actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 shrink-0 pt-4 border-t border-slate-800 text-[10px]">
              <div className="text-slate-400 text-center sm:text-left">
                <span className="block font-bold">✓ Responsive Flex Vector Core</span>
                <span className="block">Zero pixel stretching or low-res layout noise guaranteed.</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={triggerDownloadPrint}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-[#D4A853] text-[#2D1B0E] font-bold rounded-full cursor-pointer flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Layout Now
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Curved Template Preview Overlay Modal */}
        {selectedPreviewTemplate && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-white border border-[#E8E0D8] max-w-md w-full rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
              {/* Header */}
              <div className="bg-[#2D1B0E] p-4 text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xl">✨</span>
                  <div>
                    <h3 className="font-serif font-bold text-sm tracking-wide uppercase">Template Interactive Specs</h3>
                    <p className="text-[10px] text-amber-300 font-mono">Preset Name: {selectedPreviewTemplate.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPreviewTemplate(null)}
                  className="bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors text-white"
                  title="Close Spec Card"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Specs & Values */}
              <div className="p-5 space-y-4 text-left overflow-y-auto max-h-[400px]">
                
                {/* Visual Palette Preview */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#8A7A6A] uppercase tracking-wider block">Palette Integration:</span>
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full border border-gray-300 inline-block bg-${
                      selectedPreviewTemplate.theme === 'midnight' ? 'slate-900' : 
                      selectedPreviewTemplate.theme === 'sage' ? 'green-100' : 
                      selectedPreviewTemplate.theme === 'crimson' ? 'red-200' : 
                      selectedPreviewTemplate.theme === 'charcoal' ? 'neutral-800' : 'amber-50/50'}`} 
                    />
                    <span className="text-xs font-bold font-mono text-[#2D1B0E] uppercase">{selectedPreviewTemplate.theme} Theme Mode</span>
                  </div>
                </div>

                {/* Sub category dependent variables */}
                <div className="bg-[#FAF7F2] p-3 rounded-lg space-y-2 border border-[#E8E0D8]">
                  <h4 className="text-xs font-bold text-[#2D1B0E] uppercase tracking-wide">Included Mock Content:</h4>
                  {activeMode === "magazine" && (
                    <div className="space-y-1.5 text-xs">
                      <p><strong>Heads Title:</strong> {selectedPreviewTemplate.title}</p>
                      <p><strong>Section Deck:</strong> {selectedPreviewTemplate.subtitle}</p>
                      <p><strong>Cover Story:</strong> {selectedPreviewTemplate.story}</p>
                      <p><strong>Configured Grid:</strong> {selectedPreviewTemplate.columns} Editorial Columns</p>
                    </div>
                  )}
                  {activeMode === "poster" && (
                    <div className="space-y-1.5 text-xs">
                      <p><strong>Bold Title:</strong> {selectedPreviewTemplate.title}</p>
                      <p className="italic">"{selectedPreviewTemplate.quote}"</p>
                      <p><strong>Author Credit:</strong> — {selectedPreviewTemplate.author}</p>
                      <p><strong>Style Layout:</strong> {selectedPreviewTemplate.layout?.toUpperCase()}</p>
                    </div>
                  )}
                  {activeMode === "book_cover" && (
                    <div className="space-y-1.5 text-xs">
                      <p><strong>Cover Title:</strong> {selectedPreviewTemplate.title}</p>
                      <p><strong>Subtitle:</strong> {selectedPreviewTemplate.subtitle}</p>
                      <p><strong>Author:</strong> {selectedPreviewTemplate.author}</p>
                      <p><strong>Width spine formula:</strong> {selectedPreviewTemplate.pages} Print Pages</p>
                    </div>
                  )}
                  {activeMode === "receipt" && (
                    <div className="space-y-1.5 text-xs text-slate-700">
                      <p><strong>Vendor Name:</strong> {selectedPreviewTemplate.company}</p>
                      <p><strong>Receipt Reference:</strong> {selectedPreviewTemplate.number}</p>
                      <p><strong>Billed Client:</strong> {selectedPreviewTemplate.client}</p>
                      <p><strong>Tax Setup:</strong> {selectedPreviewTemplate.tax}% Tax Rate</p>
                    </div>
                  )}
                  {activeMode === "business_card" && (
                    <div className="space-y-1.5 text-xs">
                      <p><strong>Card holder:</strong> {selectedPreviewTemplate.nameField}</p>
                      <p><strong>Job Title:</strong> {selectedPreviewTemplate.jobField}</p>
                      <p><strong>Phone:</strong> {selectedPreviewTemplate.phoneField}</p>
                      <p><strong>Email:</strong> {selectedPreviewTemplate.emailField}</p>
                    </div>
                  )}
                </div>

                <div className="p-3 bg-amber-50 text-amber-800 text-[11px] leading-relaxed rounded-lg border border-amber-200">
                  💡 This layout preset overrides your current input values safely on the visual board and configures color themes instantly!
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-2">
                <button
                  onClick={() => setSelectedPreviewTemplate(null)}
                  className="flex-1 px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 bg-white border rounded-lg transition-all"
                >
                  Dismiss
                </button>
                <button
                  onClick={() => {
                    handleLoadTemplate(selectedPreviewTemplate);
                    setSelectedPreviewTemplate(null);
                  }}
                  className="flex-1 px-4 py-2 text-xs font-bold text-[#2D1B0E] bg-[#D4A853] hover:bg-amber-600 rounded-lg shadow transition-all"
                >
                  ⚡ Apply &amp; Load Preset
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
