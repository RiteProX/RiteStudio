/**
 * RitemastaPro - Advanced Interactively Synced Document Parser & Importer
 */
import React, { useState, useRef } from "react";
import { User, Project, Chapter, LayoutSettings } from "../types";
import { FileText, Sparkles, Check, List, HelpCircle, FileCheck, ArrowRight, BookOpen, Layers } from "lucide-react";
import { playVistaSound } from "./AuthScreen";

interface ManuscriptParserProps {
  user: User | null;
  onImportComplete: (title: string, chapters: Chapter[]) => void;
  onOpenAuth: () => void;
}

interface ParseResults {
  fileName: string;
  fileSizeKb: number;
  words: number;
  charsWithSpaces: number;
  charsNoSpaces: number;
  paragraphs: number;
  chapters: Array<{ title: string; content: string }>;
  headings: string[];
  subheadings: string[];
  references: string[];
  readingTimeMin: number;
}

// Pre-designed high-fidelity sample manuscripts
const SAMPLES = [
  {
    title: "The Bitter Leaf & Coconut Water Protocol",
    description: "A complete Wellness and Botanical Reset guide containing health protocols, headings, and dietary metrics.",
    text: `Chapter 1: The Foundations of Botanical Reset
The foundational health architecture of RitemastaPro prioritizes absolute organic integrity and pristine layouts. Bitter leaf (Vernonia amygdalina) is renowned across Sub-Saharan healthcare history for its intensive hypoglycemic properties and micro-nutrient profiles.

## Section 1.1: Glycemic Synergy
When fresh organic bitter leaf tincture binds with natural organic coconut water, the composite potassium electrolytes increase systemic cellular absorption. No other platform formats wellness checklists with this level of beauty.

Chapter 2: The 7-Day Cleanse Dosages
## Section 2.1: Morning Intake
Consuming 15ml of organic cold-pressed bitter leaf solution on an empty stomach triggers natural systemic liver filtering.

## Section 2.2: Evening Replenishment
Drink fresh green coconut water (300ml) with three drops of ginger extract to preserve core metabolic rest.

Reference: [1] Dr. Robert Oseis Clinical Herbal Digest (2025), Accra, Page 43.
Reference: [2] World Health Botanical Journal, Section Ga-40.
`
  },
  {
    title: "Global Education Syllabus & Lecturing Guide",
    description: "An academic layout with detailed lecture synopsis blocks, course structures, and references.",
    text: `Chapter 1: EdTech Systems in West Africa
This academic handbook outlines standardized digital delivery systems across classrooms in developing educational sectors. Education is more than simply reading slides.

## Section 1.1: Interactive Whiteboards
Syllabus integrations require robust offline-first caching for regions without fiber connections. Ritemasta compiles high-end study manuals.

Chapter 2: Teecha AI Slides Master Draft
## Lecture Unit 2.1: Presentation Design
To keep students engaged, use clear Space Grotesk major display titles paired with monospaced JetBrains code blocks for data sets.

## Lecture Unit 2.2: Virtual Prompts
Create bulleted slides with maximum three lines per paragraph.

Reference: [1] Ministry of Education Regional SHS Study Plan 2026.
Reference: [2] Modern African Classroom Syntaxes, Vol 12.
`
  },
  {
    title: "Heritage Dialect Formulations Handbook",
    description: "A specialized cultural manual using Ga, Ewe and Akan characters with specific paragraph divisions.",
    text: `Chapter 1: Preserving Dialect Character Sets
Specialized orthography for Ewe (ɖ, ƒ, ɣ), Ga (ŋ, ɔ, ɛ), and Akan requires native vector sub-render engines. This handbook maintains extreme typographical integrity on standard paper sizes.

## Section 1.1: Linguistic Typography
Proper formatting of words like "Teecha" and "Yayra" in original letters makes sure there are no print clipping artifacts.

Chapter 2: Ancestral Botanical Glossary
## Section 2.1: Coastal Herbs
Local names of critical medicinal shrubs like "Akoko msa" or "Nton" are cataloged with perfect pronunciation marks.

Reference: [1] Linguistic council of Ghana orthography guidelines index, 1989.
`
  }
];

export default function ManuscriptParser({ user, onImportComplete, onOpenAuth }: ManuscriptParserProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "paste">("upload");
  const [rawText, setRawText] = useState("");
  const [customTitle, setCustomTitle] = useState("My Parsed Manuscript");
  const [dragActive, setDragActive] = useState(false);
  const [parsedData, setParsedData] = useState<ParseResults | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse Function
  const parseManuscript = (fileName: string, fileSizeKb: number, text: string) => {
    if (!text.trim()) return;

    const lines = text.split("\n");
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const charsWithSpaces = text.length;
    const charsNoSpaces = text.replace(/\s+/g, "").length;
    const paragraphs = text.split(/\n\s*\n/).filter(Boolean).length;
    const readingTimeMin = Math.max(1, Math.ceil(words / 200));

    const chapters: Array<{ title: string; content: string }> = [];
    const headings: string[] = [];
    const subheadings: string[] = [];
    const references: string[] = [];

    let currentChapterTitle = "Chapter 1: Preliminary Notes";
    let currentChapterContent: string[] = [];

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      // Check for Chapter marker
      if (
        trimmed.toLowerCase().startsWith("chapter") ||
        trimmed.toLowerCase().startsWith("section 1:") ||
        trimmed.toLowerCase().startsWith("section 2:")
      ) {
        if (currentChapterContent.length > 0 || currentChapterTitle) {
          chapters.push({
            title: currentChapterTitle || `Section ${chapters.length + 1}`,
            content: currentChapterContent.join("\n\n") || "No content parsed for this node.",
          });
        }
        currentChapterTitle = trimmed;
        currentChapterContent = [];
      } else if (trimmed.startsWith("##")) {
        subheadings.push(trimmed.replace(/^##\s*/, ""));
        currentChapterContent.push(trimmed);
      } else if (trimmed.startsWith("#") || (trimmed === trimmed.toUpperCase() && trimmed.length < 50 && trimmed.length > 3)) {
        headings.push(trimmed.replace(/^#\s*/, ""));
        currentChapterContent.push(trimmed);
      } else if (
        trimmed.toLowerCase().includes("reference:") ||
        trimmed.toLowerCase().includes("ref:") ||
        trimmed.startsWith("[")
      ) {
        references.push(trimmed);
        currentChapterContent.push(trimmed);
      } else {
        currentChapterContent.push(trimmed);
      }
    });

    // Add final chapter
    if (currentChapterTitle || currentChapterContent.length > 0) {
      chapters.push({
        title: currentChapterTitle || `Chapter ${chapters.length + 1}`,
        content: currentChapterContent.join("\n\n") || "No content parsed for this node.",
      });
    }

    setParsedData({
      fileName,
      fileSizeKb,
      words,
      charsWithSpaces,
      charsNoSpaces,
      paragraphs,
      chapters: chapters.length > 0 ? chapters : [{ title: "General Introduction", content: text }],
      headings,
      subheadings,
      references,
      readingTimeMin,
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setCustomTitle(file.name.replace(/\.[^/.]+$/, ""));
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        parseManuscript(file.name, Math.round(file.size / 1024), text || "");
      };
      reader.readAsText(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCustomTitle(file.name.replace(/\.[^/.]+$/, ""));
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        parseManuscript(file.name, Math.round(file.size / 1024), text || "");
      };
      reader.readAsText(file);
    }
  };

  const handleLoadSample = (sample: typeof SAMPLES[0]) => {
    setCustomTitle(sample.title);
    setRawText(sample.text);
    parseManuscript("simulated_docx_import.docx", 24, sample.text);
  };

  const triggerImport = () => {
    if (!user) {
      onOpenAuth();
      alert("Please Sign In or Register to load your parsed manuscript into a secure workspace project!");
      return;
    }
    if (parsedData) {
      const formattedChapters: Chapter[] = parsedData.chapters.map((ch, idx) => ({
        id: `parsed-ch-${idx}-${Math.random()}`,
        title: ch.title,
        content: ch.content,
        order: idx,
      }));
      onImportComplete(customTitle, formattedChapters);
    }
  };

  return (
    <div className="bg-[#FFFDFB] min-h-screen py-8 px-4" id="manuscript-parser-section">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Block */}
        <div className="text-center">
          <div className="inline-block bg-[#D4A853]/15 text-[#D4A853] text-[10px] font-bold px-3 py-1 rounded-full border border-[#D4A853]/30 uppercase tracking-widest mb-3">
            Instant Outlining Engine
          </div>
          <h1 className="font-serif text-2xl sm:text-3.5xl font-extrabold text-[#2D1B0E] tracking-tight">
            Seamless Manuscript Outlines &amp; Ingestion
          </h1>
          <p className="text-xs text-[#8A7A6A] leading-relaxed max-w-xl mx-auto mt-2">
            No more splitting manually. Drop a flat text or Word file. Our system parses sections into logical Table of Contents, headings, references, and outputs instant precision metrics.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-[#E8E0D8]/80 max-w-md mx-auto justify-center gap-1">
          <button
            onClick={() => setActiveTab("upload")}
            className={`pb-2 px-6 text-xs font-bold border-b-2 transition-colors ${
              activeTab === "upload" ? "border-[#D4A853] text-[#2D1B0E]" : "border-transparent text-[#8A7A6A] hover:text-[#2D1B0E]"
            }`}
          >
            📂 Drag-and-Drop File Import
          </button>
          <button
            onClick={() => setActiveTab("paste")}
            className={`pb-2 px-6 text-xs font-bold border-b-2 transition-colors ${
              activeTab === "paste" ? "border-[#D4A853] text-[#2D1B0E]" : "border-transparent text-[#8A7A6A] hover:text-[#2D1B0E]"
            }`}
          >
            ✒️ Paste Written Script
          </button>
        </div>

        {/* TAB 1: FILE DRAG AND DROP */}
        {activeTab === "upload" && !parsedData && (
          <div className="space-y-6">
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-3 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
                dragActive
                  ? "border-[#D4A853] bg-[#FDF8F0] scale-[1.01]"
                  : "border-[#E8E0D8] bg-white hover:border-[#D4A853] hover:bg-[#FFFDFB]"
              }`}
              id="file-drop-target-area"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.doc,.docx"
                onChange={handleFileSelect}
                className="hidden"
              />
              <span className="text-5xl block mb-3 animate-pulse">📤</span>
              <h3 className="font-serif font-bold text-base text-[#2D1B0E]">
                Drop manuscript file (.txt, docx) or click to browse
              </h3>
              <p className="text-[11px] text-[#8A7A6A] mt-1.5 max-w-sm mx-auto leading-relaxed">
                Ritemasta will parse chapters splitting on keywords like 'Chapter' or 'Section', indexing metadata and outline parameters instantly.
              </p>
            </div>

            {/* Pre-made interactive templates picker */}
            <div className="bg-white border rounded-xl p-5 space-y-4">
              <span className="text-xs font-bold text-[#2D1B0E] block uppercase tracking-wider">
                ⚡ Test-drive the parser with organic samples:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {SAMPLES.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleLoadSample(sample)}
                    className="p-4 border border-[#E8E0D8] hover:border-[#D4A853] hover:bg-[#FDF8F0]/30 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-serif font-black text-[#2D1B0E] block mb-1">
                        {sample.title}
                      </span>
                      <p className="text-[10px] text-[#8A7A6A] leading-relaxed line-clamp-2">
                        {sample.description}
                      </p>
                    </div>
                    <span className="text-[9px] text-[#D4A853] font-bold mt-3 block uppercase tracking-widest hover:underline flex items-center gap-1">
                      Load &amp; Parse Sample <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: RAW TEXT PASTING */}
        {activeTab === "paste" && !parsedData && (
          <div className="bg-white border border-[#E8E0D8] p-5 rounded-2xl space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#2D1B0E] mb-1.5">Manuscript Title</label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm bg-[#FFFDFB]"
                placeholder="The Bitter Leaf & Green Coconut Water Protocol"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#2D1B0E] mb-1.5">Raw Manuscript Scripts &amp; Chapters</label>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                className="w-full h-64 p-3 border rounded-lg text-sm font-serif leading-relaxed focus:outline-none focus:border-[#D4A853]"
                placeholder="Write, paste paragraphs or chapters split by Chapter 1, Chapter 2..."
              />
            </div>
            <button
              onClick={() => parseManuscript("pasted_manuscript.txt", Math.round(rawText.length / 1024), rawText)}
              disabled={!rawText.trim()}
              className="px-6 py-2 bg-[#D4A853] hover:bg-[#C49A42] text-[#2D1B0E] font-bold text-xs uppercase tracking-wider rounded-full transition-transform active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              Parse Script Instantly
            </button>
          </div>
        )}

        {/* PARSED STATISTICS DISPLAY SCREEN */}
        {parsedData && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200" id="parse-results">
            <div className="bg-white border border-[#E8E0D8] rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-[#2D1B0E] px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b-4 border-[#D4A853]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#D4A853] tracking-widest block">Success! File Parsed</span>
                  <h3 className="font-serif text-lg font-bold text-white mt-0.5">{customTitle}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setParsedData(null);
                    setRawText("");
                  }}
                  className="px-3 py-1 text-[10px] font-bold uppercase border border-[#FDF8F0]/20 hover:border-[#D4A853] text-[#FDF8F0]/80 rounded transition-colors"
                >
                  Change File
                </button>
              </div>

              {/* Statistics Grid */}
              <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#FDF8F0]/60 border-b">
                <div className="bg-white p-3 rounded-xl border border-[#E8E0D8]/60 text-center">
                  <span className="text-[10px] text-[#8A7A6A] uppercase font-semibold text-center block">Total Words</span>
                  <strong className="text-xl text-[#2D1B0E] font-black mt-1 block">{parsedData.words}</strong>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#E8E0D8]/60 text-center">
                  <span className="text-[10px] text-[#8A7A6A] uppercase font-semibold text-center block">Characters (No Spaces)</span>
                  <strong className="text-xl text-[#2D1B0E] font-black mt-1 block">{parsedData.charsNoSpaces}</strong>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#E8E0D8]/60 text-center">
                  <span className="text-[10px] text-[#8A7A6A] uppercase font-semibold text-center block">Characters (Spaced)</span>
                  <strong className="text-xl text-[#2D1B0E] font-black mt-1 block">{parsedData.charsWithSpaces}</strong>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#E8E0D8]/60 text-center">
                  <span className="text-[10px] text-[#8A7A6A] uppercase font-semibold text-center block">Reading Time</span>
                  <strong className="text-xl text-[#2D1B0E] font-black mt-1 block">~{parsedData.readingTimeMin} min</strong>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#E8E0D8]/60 text-center">
                  <span className="text-[10px] text-[#8A7A6A] uppercase font-semibold text-center block">Chapters Detected</span>
                  <strong className="text-xl text-indigo-700 font-extrabold mt-1 block">{parsedData.chapters.length} nodes</strong>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#E8E0D8]/60 text-center">
                  <span className="text-[10px] text-[#8A7A6A] uppercase font-semibold text-center block">Headings Matches</span>
                  <strong className="text-xl text-emerald-700 font-extrabold mt-1 block">{parsedData.headings.length} lines</strong>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#E8E0D8]/60 text-center">
                  <span className="text-[10px] text-[#8A7A6A] uppercase font-semibold text-center block">Subheadings Matches</span>
                  <strong className="text-xl text-amber-700 font-extrabold mt-1 block">{parsedData.subheadings.length} items</strong>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#E8E0D8]/60 text-center">
                  <span className="text-[10px] text-[#8A7A6A] uppercase font-semibold text-center block">Citations (Ref) Found</span>
                  <strong className="text-xl text-red-700 font-extrabold mt-1 block">{parsedData.references.length}</strong>
                </div>
              </div>

              {/* Multi-Panel TOC breakdown */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                
                {/* Outlines Accordion */}
                <div className="md:col-span-1 space-y-4">
                  <div>
                    <h4 className="text-xs font-black text-[#2D1B0E] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <List className="w-3.5 h-3.5 text-[#D4A853]" /> Extracted Chapters ({parsedData.chapters.length})
                    </h4>
                    <div className="space-y-1.5 max-h-[170px] overflow-y-auto pr-1">
                      {parsedData.chapters.map((ch, idx) => (
                        <div key={idx} className="bg-white p-2 border rounded-lg text-[10px] font-bold text-[#4A3728] truncate">
                          {idx + 1}. {ch.title}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-black text-[#2D1B0E] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-emerald-600" /> Structural Subheadings ({parsedData.subheadings.length})
                    </h4>
                    <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
                      {parsedData.subheadings.length === 0 ? (
                        <div className="text-[10px] text-gray-400 italic">No subheaders detected.</div>
                      ) : (
                        parsedData.subheadings.map((sh, idx) => (
                          <div key={idx} className="bg-[#FFF] border border-dashed p-1.5 rounded text-[9px] text-[#555] font-serif">
                            ↳ {sh}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Main preview block */}
                <div className="md:col-span-2 space-y-4">
                  <h4 className="text-xs font-black text-[#2D1B0E] uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-500" /> Parsed Chapter Content Preview
                  </h4>
                  <div className="bg-[#FFF] border p-4 rounded-xl max-h-[300px] overflow-y-auto font-serif text-xs text-[#2D1B0E] space-y-3 shadow-inner leading-relaxed">
                    {parsedData.chapters.map((ch, idx) => (
                      <div key={idx} className="border-b pb-3 mb-3 last:border-0 last:pb-0">
                        <strong className="text-[#D4A853] block text-xs mb-1 uppercase tracking-wide">
                          Parsed Node: {ch.title}
                        </strong>
                        <p className="line-clamp-4 whitespace-pre-wrap text-[#4A3728]">{ch.content}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Launch Project CTA */}
            <div className="bg-[#FDF8F0] border border-[#D4A853]/30 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-xs text-[#2D1B0E] text-center sm:text-left">
                <strong className="font-bold block text-[#2D1B0E] text-sm">Synchronize with Master Editor</strong>
                Load these parsed nodes inside your Ritemasta project workspace. Set margins, select the Serene or Textbook template, design a gorgeous cover, and trigger polished exports!
              </div>
              <button
                type="button"
                onMouseEnter={playVistaSound}
                onClick={triggerImport}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-cyan-400 hover:to-blue-600 text-white font-extrabold text-xs uppercase tracking-widest rounded-full transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-md flex items-center gap-2 cursor-pointer shrink-0"
              >
                ⚡ Launch Ritemasta Workspace project! ⚡
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
