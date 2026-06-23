/**
 * RitemastaPro - Superior Two-Panel Editor & AI Assistant
 */
import React, { useState, useEffect } from "react";
import { Project, Chapter, ReviewComment } from "../types";
import { FileText, Plus, Trash2, Check, Sparkles, Image, Settings, BookOpen, AlertCircle, Save, FileSpreadsheet, PlayCircle } from "lucide-react";

interface BookEditorProps {
  project: Project;
  onUpdateProject: (updatedProj: Project) => void;
  onBackToDashboard: () => void;
}

export default function BookEditor({ project, onUpdateProject, onBackToDashboard }: BookEditorProps) {
  const [activeChapterId, setActiveChapterId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"write" | "metadata" | "ai_assets">("write");

  // AI Assistant States
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiTarget, setAiTarget] = useState<"chapter" | "presentation" | "synopsis" | "receipt">("chapter");

  // Dynamic Cover Designer States
  const [coverPreset, setCoverPreset] = useState<string>("aura");
  const [customBgColor, setCustomBgColor] = useState<string>("#1E352F");
  const [titleColor, setTitleColor] = useState<string>("#F3EFE0");
  const [coverLoading, setCoverLoading] = useState(false);

  // Wide editor mode
  const [isWideMode, setIsWideMode] = useState(false);

  // Keyboard shortcut active toast state
  const [shortcutToast, setShortcutToast] = useState<string | null>(null);

  // Collaborators & reviewer state
  const [reviewerName, setReviewerName] = useState<string>("Bob Ashley 🌐");
  const [commentText, setCommentText] = useState("");
  const [commentStatus, setCommentStatus] = useState<"pending" | "resolved" | "approved" | "attention">("pending");

  // Dynamic Art generation tone preset
  const [artStyle, setStylePreset] = useState<"flora" | "cosmic" | "imperial" | "bauhaus">("flora");
  const [isGeneratingCover, setIsGeneratingCover] = useState(false);

  // Set active chapter initially
  useEffect(() => {
    if (project.chapters.length > 0 && !activeChapterId) {
      setActiveChapterId(project.chapters[0].id);
    }
  }, [project, activeChapterId]);

  const activeChapter = project.chapters.find((ch) => ch.id === activeChapterId) || project.chapters[0];

  // Auto-saves visual queues
  const [saveStatus, setSaveStatus] = useState("Draft saved automatically");

  // Save changes locally
  const updateActiveChapter = (updatedFields: Partial<Chapter>) => {
    setSaveStatus("Saving changes...");
    const updatedChapters = project.chapters.map((ch) =>
      ch.id === activeChapter.id ? { ...ch, ...updatedFields } : ch
    );
    onUpdateProject({
      ...project,
      chapters: updatedChapters,
      updatedAt: new Date().toISOString(),
    });
    setTimeout(() => {
      setSaveStatus("✓ Changes saved locally in browser database");
    }, 400);
  };

  // Keyboard Shortcut Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Switch tabs using Alt + Key
      if (e.altKey) {
        if (e.key === "1") {
          e.preventDefault();
          setActiveTab("write");
          triggerShortcutToast("Switched to Write Tab ✏️");
        } else if (e.key === "2") {
          e.preventDefault();
          setActiveTab("metadata");
          triggerShortcutToast("Switched to Metadata & Cover setting ⚙️");
        } else if (e.key === "3") {
          e.preventDefault();
          setActiveTab("ai_assets");
          triggerShortcutToast("Switched to AI Presentation Wizard 🤖");
        }
      }

      // Ctrl + Shift / Cmd + Shift shortcuts
      if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
         if (e.key.toLowerCase() === "s") {
           e.preventDefault();
           setSaveStatus("✓ Workspace Cache Synced via Hotkey");
           triggerShortcutToast("Workspace instant Cache Sync! 💾");
         } else if (e.key.toLowerCase() === "n") {
           e.preventDefault();
           handleAddChapter();
           triggerShortcutToast("Added new chapter outline! 📑");
         } else if (e.key.toLowerCase() === "e") {
           e.preventDefault();
           setIsWideMode(prev => !prev);
           triggerShortcutToast(!isWideMode ? "Wide Focus editor mode enabled! 🖥️" : "Standard layout mode active");
         }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [project, activeChapter, isWideMode]);

  const triggerShortcutToast = (msg: string) => {
    setShortcutToast(msg);
    setTimeout(() => setShortcutToast(null), 2500);
  };

  // Dynamic Procedural Cover Art Generator Engine
  const handleGenerateProceduralCover = () => {
    setIsGeneratingCover(true);
    setTimeout(() => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 600;
        canvas.height = 900;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          // Dynamic background gradient
          const grad = ctx.createLinearGradient(0, 0, 600, 900);
          grad.addColorStop(0, customBgColor);
          grad.addColorStop(1, "#111111"); 
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 600, 900);

          // Aesthetic artwork patterns based on current style tone preset selection
          if (artStyle === "flora") {
            ctx.strokeStyle = titleColor + "44";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(300, 900);
            ctx.bezierCurveTo(150, 650, 450, 350, 300, 100);
            ctx.stroke();

            ctx.fillStyle = titleColor;
            for (let i = 0; i < 9; i++) {
              const t = 160 + i * 80;
              ctx.beginPath();
              ctx.ellipse(300 + (i % 2 === 0 ? 40 : -40), t, 16, 9, (i % 2 === 0 ? 35 : -35) * Math.PI / 180, 0, 2 * Math.PI);
              ctx.fill();
            }

            ctx.fillStyle = "#D4A853";
            for (let i = 0; i < 15; i++) {
              const rx = Math.random() * 600;
              const ry = Math.random() * 900;
              ctx.beginPath();
              ctx.arc(rx, ry, Math.random() * 2.5 + 1, 0, 2 * Math.PI);
              ctx.fill();
            }
          } else if (artStyle === "cosmic") {
            const radialGrad = ctx.createRadialGradient(300, 450, 40, 300, 450, 400);
            radialGrad.addColorStop(0, "#4C1D95"); 
            radialGrad.addColorStop(1, "transparent");
            ctx.fillStyle = radialGrad;
            ctx.fillRect(0, 0, 600, 900);

            ctx.fillStyle = "#FFFFFF";
            for (let i = 0; i < 75; i++) {
              const rx = Math.random() * 600;
              const ry = Math.random() * 900;
              ctx.beginPath();
              ctx.arc(rx, ry, Math.random() * 2, 0, 2 * Math.PI);
              ctx.fill();
            }

            ctx.strokeStyle = "rgba(255,255,255,0.15)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(120, 240);
            ctx.lineTo(280, 180);
            ctx.lineTo(380, 310);
            ctx.lineTo(480, 210);
            ctx.stroke();

            ctx.fillStyle = titleColor;
            [[120, 240], [280, 180], [380, 310], [480, 210]].forEach(([x, y]) => {
              ctx.beginPath();
              ctx.arc(x, y, 5, 0, 2 * Math.PI);
              ctx.fill();
            });
          } else if (artStyle === "imperial") {
            ctx.strokeStyle = "#D4A853";
            ctx.lineWidth = 2.5;
            
            ctx.beginPath();
            ctx.arc(300, 450, 180, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(300, 450, 160, 0, 2 * Math.PI);
            ctx.stroke();

            ctx.fillStyle = "rgba(0,0,0,0.25)";
            ctx.beginPath();
            ctx.arc(300, 450, 120, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();

            ctx.beginPath();
            for (let deg = 0; deg < 360; deg += 30) {
              const rad = deg * Math.PI / 180;
              const x1 = 300 + Math.cos(rad) * 180;
              const y1 = 450 + Math.sin(rad) * 180;
              const x2 = 300 + Math.cos(rad) * 230;
              const y2 = 450 + Math.sin(rad) * 230;
              ctx.moveTo(x1, y1);
              ctx.lineTo(x2, y2);
            }
            ctx.stroke();
          } else {
            ctx.fillStyle = titleColor + "22";
            ctx.fillRect(100, 150, 200, 200);

            const bauGradient = ctx.createLinearGradient(400, 300, 200, 600);
            bauGradient.addColorStop(0, "#D4A853");
            bauGradient.addColorStop(1, "transparent");
            ctx.fillStyle = bauGradient;
            ctx.beginPath();
            ctx.arc(350, 480, 160, 0, Math.PI, true);
            ctx.fill();

            ctx.strokeStyle = titleColor;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(60, 120);
            ctx.lineTo(540, 780);
            ctx.stroke();
          }

          // Overlay Title and Metadata smoothly like a real book jacket
          ctx.fillStyle = titleColor;
          ctx.textAlign = "center";
          
          ctx.font = "bold 28px Georgia, serif";
          const title = project.metadata.title || "My Manuscript";
          ctx.fillText(title.toUpperCase(), 300, 280);

          if (project.metadata.subtitle) {
            ctx.font = "italic 16px Georgia, serif";
            ctx.fillText(project.metadata.subtitle, 300, 335);
          }

          ctx.strokeStyle = titleColor;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(240, 380);
          ctx.lineTo(360, 380);
          ctx.stroke();

          ctx.font = "14px Arial, sans-serif";
          ctx.fillText("WRITTEN BY " + (project.metadata.author || "Author").toUpperCase(), 300, 430);

          ctx.font = "bold 11px Arial, sans-serif";
          ctx.fillText("RITEMASTAPRO ARTSTUDIO 2026", 300, 800);

          const dataUrl = canvas.toDataURL("image/jpeg");
          updateMetadata({ coverImage: dataUrl });
          alert("✓ Artistic Cover procedurally compiled and loaded seamlessly!");
        }
      } catch (err) {
        console.error("Cover Art generation failed", err);
      } finally {
        setIsGeneratingCover(false);
      }
    }, 600);
  };

  // Review System Event Handlers
  const handleAddReviewComment = () => {
    if (!commentText.trim()) return;
    const newComment: ReviewComment = {
      id: Math.random().toString(),
      author: reviewerName,
      text: commentText,
      status: commentStatus,
      chapterId: activeChapter?.id || "general",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " Today",
    };
    
    const existingComments = project.reviewComments || [];
    onUpdateProject({
      ...project,
      reviewComments: [...existingComments, newComment],
      updatedAt: new Date().toISOString(),
    });
    setCommentText("");
    alert("✓ Editorial Markup comment registered in project review log!");
  };

  const handleResolveComment = (cId: string) => {
    if (!project.reviewComments) return;
    const updated = project.reviewComments.map((c) =>
      c.id === cId ? { ...c, status: "resolved" as const } : c
    );
    onUpdateProject({
      ...project,
      reviewComments: updated,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleDeleteComment = (cId: string) => {
    if (!project.reviewComments) return;
    const updated = project.reviewComments.filter((c) => c.id !== cId);
    onUpdateProject({
      ...project,
      reviewComments: updated,
      updatedAt: new Date().toISOString(),
    });
  };

  const updateMetadata = (updatedFields: Partial<typeof project.metadata>) => {
    setSaveStatus("Saving metadata...");
    onUpdateProject({
      ...project,
      metadata: { ...project.metadata, ...updatedFields },
      updatedAt: new Date().toISOString(),
    });
    setTimeout(() => {
      setSaveStatus("✓ Metadata saved locally");
    }, 400);
  };

  const handleAddChapter = () => {
    const newId = Math.random().toString();
    const newChapter: Chapter = {
      id: newId,
      title: `Chapter ${project.chapters.length + 1}`,
      content: "Start writing your content here. Use the AI suite to outline or rewrite if you need help!",
      order: project.chapters.length,
    };
    onUpdateProject({
      ...project,
      chapters: [...project.chapters, newChapter],
      updatedAt: new Date().toISOString(),
    });
    setActiveChapterId(newId);
  };

  const handleDeleteChapter = (id: string) => {
    if (project.chapters.length <= 1) {
      alert("Your manuscript must contain at least one chapter.");
      return;
    }
    const filtered = project.chapters.filter((ch) => ch.id !== id);
    onUpdateProject({
      ...project,
      chapters: filtered,
      updatedAt: new Date().toISOString(),
    });
    // Set active chapter to first remaining
    setActiveChapterId(filtered[0].id);
  };

  // Run server AI helper
  const handleRunAI = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    try {
      const response = await fetch("/api/gemini/presentation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: aiPrompt,
          type: aiTarget,
          projectType: project.type,
          currentContent: activeChapter?.content || "",
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "AI could not process");

      const generatedResult = data.response;

      if (aiTarget === "chapter") {
        updateActiveChapter({
          content: activeChapter.content + "\n\n" + generatedResult,
        });
      } else {
        // Create a new chapter containing the presentation outline / pitch deck synopsis / proposal
        const newId = Math.random().toString();
        const newChapter: Chapter = {
          id: newId,
          title: `AI ${aiTarget.toUpperCase()} Output`,
          content: generatedResult,
          order: project.chapters.length,
        };
        onUpdateProject({
          ...project,
          chapters: [...project.chapters, newChapter],
          updatedAt: new Date().toISOString(),
        });
        setActiveChapterId(newId);
      }
      setAiPrompt("");
      alert(`✅ RitemastaPro AI completed! Result added to your project.`);
    } catch (err: any) {
      alert(`AI error: ${err.message || "Failed to call Gemini"}`);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Counting metrics
  const wordCount = project.chapters.reduce((acc, ch) => {
    const words = ch.content.trim().split(/\s+/).filter(Boolean).length;
    return acc + words;
  }, 0);

  const estimatedPages = Math.max(1, Math.ceil(wordCount / 250));

  return (
    <div className="bg-[#FFFDFB] min-h-screen py-6 px-4 relative">
      {/* Floating Keyboard Shortcut Notification Toast */}
      {shortcutToast && (
        <div className="fixed bottom-6 right-6 bg-[#2D1B0E] text-[#FFFDF0] px-4 py-3 rounded-xl shadow-2xl border border-amber-400/20 text-xs font-bold font-serif flex items-center gap-2 z-50 animate-bounce">
          <span className="text-[#D4A853]">⚡</span> {shortcutToast}
        </div>
      )}
      <div className="max-w-7xl mx-auto">
        {/* Editor Sub-Header bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E8E0D8] pb-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <button
                onClick={onBackToDashboard}
                className="text-xs font-bold text-[#8A7A6A] hover:text-[#2D1B0E] flex items-center gap-1 cursor-pointer"
              >
                ← Back to Dashboard
              </button>
            </div>
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#2D1B0E] mt-1 flex items-center gap-2">
              📝 Project Workspace: <span className="text-[#D4A853]">{project.metadata.title}</span>
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
            <span className="text-[10px] sm:text-xs font-semibold px-2 py-1 bg-[#FDF8F0] border rounded text-[#2D1B0E] inline-flex items-center gap-1">
              Words: <strong className="font-bold">{wordCount}</strong>
            </span>
            <span className="text-[10px] sm:text-xs font-semibold px-2 py-1 bg-[#FDF8F0] border rounded text-[#2D1B0E] inline-flex items-center gap-1">
              Estimated Pages (6x9): <strong className="font-bold">{estimatedPages}</strong>
            </span>
            <span className="text-[10px] sm:text-xs font-medium text-emerald-700 bg-green-50 px-2 py-1 rounded inline-flex items-center gap-1 shrink-0">
              <Save className="w-3.5 h-3.5" /> {saveStatus}
            </span>
          </div>
        </div>

        {/* Keyboard Shortcuts Helper Indicator */}
        <div className="bg-[#FFFDFB] border border-[#E8E0D8]/80 px-4 py-3 rounded-xl mb-6 text-xs text-[#8A7A6A] leading-relaxed flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-xs">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-amber-500 font-bold block shrink-0">⌨️ Pro Keyboard Shortcuts Active:</span>
            <span className="hidden sm:inline">Alt+1 (Write), Alt+2 (Cover designer), Alt+3 (AI Assistant)</span>
          </div>
          <div className="flex flex-wrap gap-2.5 items-center font-semibold text-[#2D1B0E]">
            <span className="px-1.5 py-0.5 bg-gray-100 rounded border text-[10px] font-mono">Ctrl+Shift+E</span> Toggle Distraction-free
            <span className="px-1.5 py-0.5 bg-gray-100 rounded border text-[10px] font-mono">Ctrl+Shift+N</span> New Chapter
            <span className="px-1.5 py-0.5 bg-gray-100 rounded border text-[10px] font-mono">Ctrl+Shift+S</span> Save Layout
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-[#E8E0D8] mb-6 gap-2">
          <button
            onClick={() => setActiveTab("write")}
            className={`pb-2.5 px-4 text-xs sm:text-sm font-bold border-b-2 tracking-wide transition-colors ${
              activeTab === "write" ? "border-[#D4A853] text-[#2D1B0E]" : "border-transparent text-[#8A7A6A] hover:text-[#2D1B0E]"
            }`}
          >
            ✏️ Document Editor & Write Panel
          </button>
          <button
            onClick={() => setActiveTab("metadata")}
            className={`pb-2.5 px-4 text-xs sm:text-sm font-bold border-b-2 tracking-wide transition-colors ${
              activeTab === "metadata" ? "border-[#D4A853] text-[#2D1B0E]" : "border-transparent text-[#8A7A6A] hover:text-[#2D1B0E]"
            }`}
          >
            ⚙️ Book cover & metadata settings
          </button>
          <button
            onClick={() => setActiveTab("ai_assets")}
            className={`pb-2.5 px-4 text-xs sm:text-sm font-bold border-b-2 tracking-wide transition-colors ${
              activeTab === "ai_assets" ? "border-[#D4A853] text-[#2D1B0E]" : "border-transparent text-[#8A7A6A] hover:text-[#2D1B0E]"
            }`}
          >
            🤖 presentation & synopsis AI wizard
          </button>
        </div>

        {/* TAB 1: TWO-PANEL WRITE COMPONENT */}
        {activeTab === "write" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
              {/* LEFT PANEL: Table of Contents */}
              {!isWideMode && (
                <div className="lg:col-span-1 bg-white border border-[#E8E0D8] rounded-xl p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-serif text-sm font-bold text-[#2D1B0E] uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-[#D4A853]" /> Manuscript TOC
                    </h3>
                    <button
                      onClick={handleAddChapter}
                      className="p-1 hover:bg-[#FDF8F0] text-[#D4A853] rounded cursor-pointer"
                      title="Add New Chapter"
                      id="btn-add-chapter"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-1 max-h-[350px] overflow-y-auto pr-1">
                    {project.chapters.map((ch, idx) => (
                      <div
                        key={ch.id}
                        onClick={() => setActiveChapterId(ch.id)}
                        className={`flex justify-between items-center p-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                          activeChapter && activeChapter.id === ch.id
                            ? "bg-[#FDF8F0] text-[#2D1B0E] border-l-4 border-[#D4A853]"
                            : "hover:bg-[#FFFDFB] text-[#816C61]"
                        }`}
                      >
                        <span className="truncate flex-1 pr-2">
                          {idx + 1}. {ch.title}
                        </span>
                        {project.chapters.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Delete '${ch.title}'?`)) {
                                handleDeleteChapter(ch.id);
                              }
                            }}
                            className="text-red-400 hover:text-red-600 p-0.5 rounded transition-opacity cursor-pointer"
                            title="Delete this chapter"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* RIGHT PANEL: Chapter Writing Editor */}
              {activeChapter ? (
                <div className={`lg:grid lg:grid-cols-1 bg-white border border-[#E8E0D8] rounded-xl overflow-hidden shadow-sm flex flex-col ${
                  isWideMode ? "lg:col-span-4" : "lg:col-span-3"
                }`}>
                  <div className="bg-[#FDF8F0] border-b border-[#E8E0D8] px-4 py-3 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
                    <div className="flex-1 w-full flex items-center gap-2">
                      <input
                        type="text"
                        value={activeChapter.title}
                        onChange={(e) => updateActiveChapter({ title: e.target.value })}
                        placeholder="Chapter Title"
                        className="font-serif font-bold text-lg text-[#2D1B0E] bg-transparent border-0 focus:outline-none focus:border-b border-[#D4A853] w-full"
                        id="chapter-title-input"
                      />
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        type="button"
                        onClick={() => setIsWideMode(prev => !prev)}
                        className="text-[10px] font-bold text-[#D4A853] bg-[#2D1B0E] hover:bg-[#D4A853] hover:text-[#2D1B0E] px-2.5 py-1 rounded-full transition-colors cursor-pointer shrink-0"
                      >
                        {isWideMode ? "🔎 Show Sidebar TOC" : "🖥️ Distraction-Free Wide"}
                      </button>
                      <div className="text-[10px] text-[#8A7A6A] font-semibold shrink-0">
                        Chapter Words: {activeChapter.content.trim().split(/\s+/).filter(Boolean).length}
                      </div>
                    </div>
                  </div>

                  {/* Main Content Area */}
                  <div className="p-4 flex-1">
                    <textarea
                      value={activeChapter.content}
                      onChange={(e) => updateActiveChapter({ content: e.target.value })}
                      placeholder="Load up your ideas! Use double returns to start new paragraphs..."
                      className="w-full h-[380px] p-2 text-sm text-[#4A3728] focus:outline-none border-0 resize-none font-serif leading-relaxed"
                      id="chapter-textarea"
                    />
                  </div>
                </div>
              ) : (
                <div className={`bg-white border border-[#E8E0D8] rounded-xl p-8 text-center shrink-0 ${
                  isWideMode ? "lg:col-span-4" : "lg:col-span-3"
                }`}>
                  <AlertCircle className="w-10 h-10 text-[#D4A853] mx-auto mb-2" />
                  <h4 className="font-serif font-bold text-base text-[#2D1B0E] mb-1">No Chapter Selected</h4>
                  <p className="text-xs text-[#8A7A6A] mb-3">Add a standard chapter inside the TOC panel on the left to start writing!</p>
                  <button onClick={handleAddChapter} className="px-4 py-2 bg-[#D4A853] text-[#2D1B0E] font-bold text-xs rounded-full">
                    Create First Chapter
                  </button>
                </div>
              )}
            </div>

            {/* BOTTOM PANELS: WORD COUNTS PROGRESS CHART & COLLABORATIVE REVIEWS */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start mt-6">
              {/* Word Count Progress and Milestones Metric Chart */}
              <div className="md:col-span-7 bg-white border border-[#E8E0D8] rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-[#E8E0D8]/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📈</span>
                    <h3 className="font-serif text-sm font-bold text-[#2D1B0E] uppercase tracking-wider">
                      Manuscript Analytics: Word Count Milestones
                    </h3>
                  </div>
                  <div className="text-[10px] text-emerald-700 bg-green-50 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    Target: 1,500 words per chapter
                  </div>
                </div>

                {/* Render dynamic customizable SVG scale bar chart */}
                <div className="bg-[#FFFDFB] border border-[#E8E0D8]/40 p-4 rounded-xl space-y-4">
                  <div className="flex justify-between items-center text-[10px] text-[#816C61] font-semibold uppercase">
                    <span>Chapter Outlines</span>
                    <span>Word Length Count</span>
                  </div>

                  <div className="space-y-3">
                    {project.chapters.map((ch, idx) => {
                      const cWords = ch.content.trim().split(/\s+/).filter(Boolean).length;
                      const maxTarget = 1500;
                      const pct = Math.min(100, Math.round((cWords / maxTarget) * 100));
                      
                      return (
                        <div key={ch.id} className="space-y-1 group">
                          <div className="flex justify-between text-xs font-semibold text-[#2D1B0E]">
                            <span className="truncate max-w-[120px] sm:max-w-xs">{idx + 1}. {ch.title}</span>
                            <span className="text-[10px] text-[#8A7A6A] font-mono select-none">
                              {cWords} / {maxTarget} words ({pct}%)
                            </span>
                          </div>
                          {/* Interactive dynamic progress fill bar with custom tooltips on hover */}
                          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-200/50 relative flex items-center group-hover:ring-1 group-hover:ring-[#D4A853]/20 transition-all">
                            <div 
                              className={`h-full rounded-full transition-all duration-700 ${
                                pct >= 100 
                                  ? "bg-gradient-to-r from-[#D4A853] to-[#C49A42]" 
                                  : pct >= 50 
                                    ? "bg-[#D4A853]/80" 
                                    : "bg-[#8A7A6A]/50"
                              }`}
                              style={{ width: `${pct}%` }} 
                            />
                            {/* target checkpoint dot marker line */}
                            <div className="absolute right-[25%] top-0 bottom-0 w-0.5 bg-red-400/40 border-r border-[#FFF]" title="Classic chapter length checkpoint threshold" />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-2 border-t border-[#E8E0D8]/40 flex justify-between items-center text-[9px] text-[#8A7A6A] leading-relaxed">
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#D4A853] to-[#C49A42]" />
                      <span>✓ Target Complete (1.5k w)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#D4A853]/80" />
                      <span>📝 In Progress</span>
                    </div>
                  </div>
                </div>

                {/* Informational advice */}
                <p className="text-[10px] text-[#8A7A6A] leading-relaxed">
                  ℹ️ Ritemasta formats chapter scales natively to preserve beautiful PDF layout margins.
                </p>
              </div>

              {/* Collaborative board and Editorial Markup */}
              <div className="md:col-span-5 bg-white border border-[#E8E0D8] rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-[#E8E0D8]/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">💬</span>
                    <h3 className="font-serif text-sm font-bold text-[#2D1B0E] uppercase tracking-wider">
                      Collaborative Review &amp; Markup
                    </h3>
                  </div>
                  <span className="text-[9px] font-bold text-[#8A7A6A] bg-gray-50 border border-gray-100 px-2 py-0.5 rounded">
                    Team Synced
                  </span>
                </div>

                {/* Select reviewer profile role */}
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div>
                    <label className="block text-[8px] font-bold text-[#2D1B0E] uppercase mb-1">Editor Persona</label>
                    <select
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className="w-full bg-white p-1 rounded border border-[#E8E0D8] font-bold text-[#2D1B0E]"
                    >
                      <option value="Bob Ashley 🌐">Bob Ashley 🌐 (Team Lead)</option>
                      <option value="Proofreader Ama 🔍">Proofreader Ama 🔍</option>
                      <option value="Editor Kofi ✍️">Editor Kofi ✍️</option>
                      <option value="Layout Architect Robert 📐">Layout Robert 📐</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[8px] font-bold text-[#2D1B0E] uppercase mb-1">Review Urgency</label>
                    <select
                      value={commentStatus}
                      onChange={(e) => setCommentStatus(e.target.value as any)}
                      className="w-full bg-white p-1 rounded border border-[#E8E0D8] text-[#2D1B0E]"
                    >
                      <option value="pending">📝 Editorial Note</option>
                      <option value="attention">⚠️ Action needed</option>
                      <option value="approved">✓ Passed/Approved</option>
                    </select>
                  </div>
                </div>

                {/* Post comment form */}
                <div className="space-y-2">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder={`Leave feedback on Chapter: "${activeChapter?.title || "general"}"`}
                    className="w-full p-2 border border-[#E8E0D8] rounded text-xs focus:outline-none focus:border-[#D4A853] h-14"
                  />
                  <button
                    type="button"
                    onClick={handleAddReviewComment}
                    disabled={!commentText.trim()}
                    className="w-full py-1.5 bg-[#2D1B0E] text-white hover:bg-[#D4A853] hover:text-[#2D1B0E] transition-colors text-[10px] font-bold rounded flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40"
                  >
                    Post Markup Comment
                  </button>
                </div>

                {/* Comments display log */}
                <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                  {(!project.reviewComments || project.reviewComments.length === 0) ? (
                    <div className="p-3 text-center text-[10px] text-[#8A7A6A] bg-[#FFFDFB] border border-dashed rounded-lg">
                      No active comments. Post editorial review comments to collaborate!
                    </div>
                  ) : (
                    project.reviewComments.map((c) => (
                      <div key={c.id} className="p-2.5 bg-gray-50 border rounded-lg text-[11px] leading-relaxed relative hover:bg-[#FDF8F0] transition-colors">
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <span className="font-bold text-[#2D1B0E] text-[10px]">{c.author}</span>
                          <div className="flex gap-1.5 items-center shrink-0">
                            <span className={`text-[8px] px-1 rounded uppercase font-semibold border ${
                              c.status === "resolved" 
                                ? "bg-green-50 text-green-700 border-green-200" 
                                : c.status === "attention" 
                                  ? "bg-red-50 text-red-700 border-red-200" 
                                  : c.status === "approved"
                                    ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                    : "bg-amber-50 text-amber-700 border-amber-300"
                            }`}>
                              {c.status}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDeleteComment(c.id)}
                              className="text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                              title="Remove Comment"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                        <p className="text-[#4A3728] text-[11px] leading-relaxed text-left">{c.text}</p>
                        <div className="flex justify-between items-center text-[8px] text-[#8A7A6A] mt-1.5 pt-1 border-t border-gray-100">
                          <span>Target: {project.chapters.find(ch => ch.id === c.chapterId)?.title || "General Doc"}</span>
                          <span>{c.timestamp}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COVER & BOOK METADATA SETTINGS */}
        {activeTab === "metadata" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-[#E8E0D8] p-6 rounded-2xl">
            {/* Front details form */}
            <div className="space-y-4">
              <h3 className="font-serif text-base font-bold text-[#2D1B0E] border-b pb-2">📖 Publication Info</h3>
              <div>
                <label className="block text-xs font-bold text-[#2D1B0E] mb-1">Book / Document Title</label>
                <input
                  type="text"
                  value={project.metadata.title}
                  onChange={(e) => updateMetadata({ title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  placeholder="The Bitter Leaf & Coconut Water Protocol"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#2D1B0E] mb-1">Book Subtitle (Optional)</label>
                <input
                  type="text"
                  value={project.metadata.subtitle || ""}
                  onChange={(e) => updateMetadata({ subtitle: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  placeholder="A Step-by-Step Natural Wellness Protocol"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#2D1B0E] mb-1">Author Name</label>
                <input
                  type="text"
                  value={project.metadata.author}
                  onChange={(e) => updateMetadata({ author: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  placeholder="Robert Ashley Nikoi"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#2D1B0E] mb-1">Publisher</label>
                  <input
                    type="text"
                    value={project.metadata.publisher || ""}
                    onChange={(e) => updateMetadata({ publisher: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    placeholder="Ritemasta Publications"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#2D1B0E] mb-1">Edition</label>
                  <input
                    type="text"
                    value={project.metadata.edition || ""}
                    onChange={(e) => updateMetadata({ edition: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    placeholder="1st Edition"
                  />
                </div>
              </div>
            </div>

            {/* Back details covers info */}
            <div className="space-y-4">
              <h3 className="font-serif text-base font-bold text-[#2D1B0E] border-b pb-2">🛡️ ISBN & Advanced Identity</h3>
              <div>
                <label className="block text-xs font-bold text-[#2D1B0E] mb-1">ISBN Identifier Code (Optional)</label>
                <input
                  type="text"
                  value={project.metadata.isbn || ""}
                  onChange={(e) => updateMetadata({ isbn: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm font-mono"
                  placeholder="978-9988-XXXX-X"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#2D1B0E] mb-1">Copyright Notice Statement</label>
                <textarea
                  value={project.metadata.copyright || ""}
                  onChange={(e) => updateMetadata({ copyright: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-xs h-20 font-serif leading-relaxed"
                  placeholder="© 2026 Robert Ashley Nikoi. All rights reserved. Registered under Ghana Business Names Act 1962."
                />
              </div>

              {/* Custom Cover upload and base64 helper builders */}
              {(() => {
                const handleFrontCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setCoverLoading(true);
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      updateMetadata({ coverImage: event.target?.result as string });
                      setCoverLoading(false);
                    };
                    reader.readAsDataURL(file);
                  }
                };

                const handleBackCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      updateMetadata({ backCoverImage: event.target?.result as string });
                    };
                    reader.readAsDataURL(file);
                  }
                };

                return (
                  <div className="col-span-1 md:col-span-2 mt-6 border-t pt-6" id="cover-designer-panel">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      
                      {/* Control Panel Form */}
                      <div className="lg:col-span-7 bg-[#FDF8F0]/40 p-5 rounded-2xl border border-[#E8E0D8] space-y-4">
                        <span className="text-[10px] bg-[#D4A853]/15 text-[#D4A853] px-3 py-1 rounded-full font-bold uppercase tracking-widest border border-[#D4A853]/25 inline-block">
                          Design Studio
                        </span>
                        <h4 className="font-serif text-sm font-bold text-[#2D1B0E] uppercase tracking-wider">
                          🎨 Custom Cover Designer &amp; Templates
                        </h4>
                        <p className="text-[11px] text-[#8A7A6A] leading-relaxed">
                          Ritemasta lets you design a gorgeous cover on-the-fly. Select elegant presets style configurations, change color sliders, or upload any externally designed full-bleed artworks!
                        </p>

                        {/* Preset Buttons */}
                        <div>
                          <label className="block text-[10px] font-bold text-[#2D1B0E] uppercase mb-1.5">
                            Select Template Presets
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {[
                              { id: "aura", name: "🌿 Aura Botanical", bg: "#1E352F", text: "#F3EFE0" },
                              { id: "luxury", name: "⚜️ Gold Royalty", bg: "#1F1A17", text: "#D4A853" },
                              { id: "academic", name: "📚 Midnight Blue", bg: "#112233", text: "#FFFFFF" },
                              { id: "scarlet", name: "🔥 Crimson Red", bg: "#4A0E17", text: "#FFFDF0" },
                              { id: "minimalist", name: "▫️ Pure Cream", bg: "#FAF6F0", text: "#2D1B0E" },
                            ].map((theme) => (
                              <button
                                key={theme.id}
                                type="button"
                                onClick={() => {
                                  setCoverPreset(theme.id);
                                  setCustomBgColor(theme.bg);
                                  setTitleColor(theme.text);
                                }}
                                className={`p-2 rounded text-left transition-all flex flex-col justify-between border ${
                                  coverPreset === theme.id
                                    ? "border-[#D4A853] bg-white ring-2 ring-[#D4A853]/20 font-bold"
                                    : "border-gray-200 bg-white hover:border-gray-300 font-medium"
                                } text-[10px] cursor-pointer`}
                              >
                                <span className="truncate">{theme.name}</span>
                                <span className="w-full h-1 mt-1 rounded-full block" style={{ backgroundColor: theme.bg }} />
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Color Picker Controllers */}
                        <div className="grid grid-cols-2 gap-3 pt-1">
                          <div>
                            <label className="block text-[9px] font-bold text-[#2D1B0E] uppercase mb-1">Canvas Background</label>
                            <div className="flex gap-1.5">
                              <input
                                type="color"
                                value={customBgColor}
                                onChange={(e) => setCustomBgColor(e.target.value)}
                                className="w-6 h-6 rounded cursor-pointer border border-[#E8E0D8] bg-transparent"
                              />
                              <input
                                type="text"
                                value={customBgColor}
                                onChange={(e) => setCustomBgColor(e.target.value)}
                                className="w-full p-0.5 border rounded text-[10px] px-1.5 font-mono"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-[#2D1B0E] uppercase mb-1">Title Text Tint</label>
                            <div className="flex gap-1.5">
                              <input
                                type="color"
                                value={titleColor}
                                onChange={(e) => setTitleColor(e.target.value)}
                                className="w-6 h-6 rounded cursor-pointer border border-[#E8E0D8] bg-transparent"
                              />
                              <input
                                type="text"
                                value={titleColor}
                                onChange={(e) => setTitleColor(e.target.value)}
                                className="w-full p-0.5 border rounded text-[10px] px-1.5 font-mono"
                              />
                            </div>
                          </div>
                        </div>

                        {/* HIGH-END PROCEDURAL CANVAS GENERATOR PANEL */}
                        <div className="bg-[#FFFDFB] border border-amber-200/60 p-4 rounded-xl space-y-3.5">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-amber-700 block">
                              ✨ HTML5 Cover Art Generator Engine
                            </span>
                            <p className="text-[9px] text-[#816C61] leading-relaxed mt-0.5">
                              Procedurally renders elegant decorative geometry patterns onto a physical 6"x9" book jacket base using your background color.
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[8px] font-bold text-[#2D1B0E] uppercase mb-1">Pattern Theme Style</label>
                              <select
                                value={artStyle}
                                onChange={(e) => setStylePreset(e.target.value as any)}
                                className="w-full bg-white p-1 rounded border text-[10px] font-semibold text-[#2D1B0E]"
                              >
                                <option value="flora">🌿 Flora & Laurel Decors</option>
                                <option value="cosmic">🌌 Cosmic Astral Constellation</option>
                                <option value="imperial">🏆 Imperial Royal Emblem</option>
                                <option value="bauhaus">📐 Bauhaus Minimalist Blocks</option>
                              </select>
                            </div>
                            <div className="flex items-end">
                              <button
                                type="button"
                                onClick={handleGenerateProceduralCover}
                                disabled={isGeneratingCover}
                                className="w-full py-1.5 bg-[#D4A853] text-[#2D1B0E] hover:bg-[#2D1B0E] hover:text-white transition-all text-[10px] font-bold rounded cursor-pointer disabled:opacity-40"
                              >
                                {isGeneratingCover ? "Rendering Art..." : "🎨 Render Cover art"}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Direct File Art Ingestion */}
                        <div className="border border-dashed p-3.5 rounded-xl bg-white space-y-2.5">
                          <span className="text-[10px] uppercase font-bold text-[#2D1B0E] block">
                            Direct Image Uploads (.PNG, .JPG supported)
                          </span>
                          <p className="text-[9px] text-[#8A7A6A] leading-relaxed">
                            Upload externally designed cover files to render them full-bleed during EPUB, PDF, and print runs.
                          </p>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <span className="block text-[8px] font-bold text-[#2D1B0E] mb-1">FRONT COVER ART</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleFrontCoverUpload}
                                className="w-full text-[9px] text-gray-500 file:mr-1 file:py-0.5 file:px-1.5 file:rounded file:border-0 file:text-[9px] file:font-semibold file:bg-[#D4A853]/15 file:text-[#D4A853] hover:file:bg-[#D4A853]/25 cursor-pointer"
                              />
                            </div>
                            <div>
                              <span className="block text-[8px] font-bold text-[#2D1B0E] mb-1">BACK COVER ART</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleBackCoverUpload}
                                className="w-full text-[9px] text-gray-500 file:mr-1 file:py-0.5 file:px-1.5 file:rounded file:border-0 file:text-[9px] file:font-semibold file:bg-[#D4A853]/15 file:text-[#D4A853] hover:file:bg-[#D4A853]/25 cursor-pointer"
                              />
                            </div>
                          </div>
                          {(project.metadata.coverImage || project.metadata.backCoverImage) && (
                            <button
                              type="button"
                              onClick={() => {
                                updateMetadata({ coverImage: undefined, backCoverImage: undefined });
                                alert("Uploaded art cleared! Preset design is now responsive.");
                              }}
                              className="text-[9px] text-red-500 font-bold uppercase hover:underline"
                            >
                              Reset to standard template
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Cover spine Live Mockup */}
                      <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl border border-[#E8E0D8]/60 relative min-h-[300px]">
                        <span className="text-[9px] uppercase font-bold text-[#8A7A6A] tracking-wider absolute top-4 block">
                          3D Spine Mockup Preview
                        </span>

                        <div className="w-40 h-56 shadow-xl rounded-r-lg relative overflow-hidden transition-all duration-300 transform hover:scale-105 flex border border-black/10"
                             style={{ backgroundColor: customBgColor }}>
                          
                          {/* Spine Spine highlight */}
                          <div className="w-3.5 h-full bg-gradient-to-r from-black/25 via-white/5 to-transparent absolute left-0 top-0 z-10" />

                          {project.metadata.coverImage ? (
                            <div className="w-full h-full relative z-0">
                              <img
                                src={project.metadata.coverImage}
                                alt="Custom Front Cover"
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          ) : (
                            <div className="w-full h-full p-4 flex flex-col justify-between text-center relative font-serif"
                                 style={{ color: titleColor }}>
                              <div className="absolute inset-1.5 border border-current opacity-25 rounded pointer-events-none" />
                              <span className="text-[6px] uppercase tracking-widest font-sans font-bold opacity-75">
                                🎓 Ritemasta Publishing
                              </span>
                              <div className="space-y-1">
                                <h5 className="text-[10px] font-black leading-tight uppercase line-clamp-3">
                                  {project.metadata.title}
                                </h5>
                                {project.metadata.subtitle && (
                                  <p className="text-[8px] leading-relaxed italic opacity-85 line-clamp-2">
                                    {project.metadata.subtitle}
                                  </p>
                                )}
                              </div>
                              <div className="space-y-0.5">
                                <div className="w-6 h-px mx-auto bg-current opacity-40 animate-pulse" />
                                <span className="text-[8px] font-bold block tracking-wider uppercase font-sans">
                                  {project.metadata.author}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* TAB 3: AI PRESENTATION, PITCH DECK, SYNOPSIS ADVISOR */}
        {activeTab === "ai_assets" && (
          <div className="bg-white border border-[#E8E0D8] p-6 rounded-2xl space-y-6">
            <div className="max-w-2xl">
              <h3 className="font-serif text-lg font-bold text-[#2D1B0E] mb-1 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#D4A853]" /> AI Presentation, Proposal & Synopsis wizard
              </h3>
              <p className="text-xs text-[#8A7A6A]">
                Unlock supreme professional automated drafts. Harness Gemini intelligence to automatically compile stunning templates from your active chapter, write proposals, presentation notes, synopses, receipts, or pitch decks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {/* Controls Column */}
              <div className="md:col-span-1 border border-[#E8E0D8] p-4 bg-[#FDF8F0] rounded-xl space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#2D1B0E] mb-1">Target Resource outputs</label>
                  <select
                    value={aiTarget}
                    onChange={(e) => setAiTarget(e.target.value as any)}
                    className="w-full p-2 bg-white border border-[#E8E0D8] rounded text-xs font-bold focus:outline-none"
                  >
                    <option value="chapter">📖 Append custom written chapters</option>
                    <option value="presentation">🖥️ AI-Assisted Presentation Slide deck script</option>
                    <option value="proposal">📂 Complete Book Project Proposal & outline</option>
                    <option value="synopsis">📝 Book Synopsis description and pitches</option>
                    <option value="receipt">🧾 Form or Premium Receipt Layout code</option>
                  </select>
                </div>

                <div className="text-[10px] text-[#8A7A6A] leading-relaxed">
                  <span className="font-bold text-[#2D1B0E] block mb-1">How it works:</span>
                  1. Enter custom requests or guidelines.
                  <br />
                  2. Choose your layout output.
                  <br />
                  3. Gemini processes and appends or adds a new chapter to your book instantly!
                </div>
              </div>

              {/* Pitch prompt details */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#2D1B0E] mb-1">AI Prompt & Guidelines</label>
                  <textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g. Write a 10-slide pitch presentation for a Wellness Book outlining natural healing resetting using the bitter leaf protocol..."
                    className="w-full h-32 p-3 border border-[#E8E0D8] rounded-lg text-sm focus:outline-none focus:border-[#D4A853]"
                  />
                </div>

                <button
                  onClick={handleRunAI}
                  disabled={isAiLoading || !aiPrompt.trim()}
                  className="px-6 py-2.5 bg-[#D4A853] hover:bg-[#C49A42] text-[#2D1B0E] font-bold text-xs rounded-full flex items-center gap-2 shadow hover:shadow-md transition-shadow cursor-pointer disabled:opacity-50"
                  id="btn-run-ai"
                >
                  <Sparkles className="w-4 h-4" /> {isAiLoading ? "Processing on Gemini server..." : "Compile draft using Gemini"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
