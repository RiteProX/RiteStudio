/**
 * RitemastaPro - Master Client Application File
 */
import { useState, useEffect, useRef } from "react";
import { User, Project, Chapter, LayoutSettings } from "./types";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import YayraChatbot from "./components/YayraChatbot";
import AuthScreen, { playVistaSound } from "./components/AuthScreen";
import Dashboard from "./components/Dashboard";
import BookEditor from "./components/BookEditor";
import LayoutDesigner from "./components/LayoutDesigner";
import ExportPanel from "./components/ExportPanel";
import ContactForm from "./components/ContactForm";
import StaticPages from "./components/StaticPages";
import AdminPanel from "./components/AdminPanel";
import ManuscriptParser from "./components/ManuscriptParser";
import DesignEngine from "./components/DesignEngine";
import IWriteStudio from "./components/IWriteStudio";
import HeroCarousel from "./components/HeroCarousel";
import CoverDesigner from "./components/CoverDesigner";
import MagazineTemplate from "./components/MagazineTemplate";
import TemplateGallery from "./components/TemplateGallery";
import TickerBand from "./components/TickerBand";
import { Settings, CreditCard, Sparkles, Check, Database, HelpCircle } from "lucide-react";

function AppInner() {
  const { darkMode } = useTheme();
  const [currentTab, setCurrentTab] = useState<string>("home");
  const [pageVisible, setPageVisible] = useState(true);

  const handleTabChange = (tab: string) => {
    if (tab === currentTab) return;
    setPageVisible(false);
    setTimeout(() => {
      setCurrentTab(tab);
      setPageVisible(true);
    }, 160);
  };
  const [user, setUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  
  // Project Workspace States
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Synchronise active user profile from browser cookies/localStorage
  useEffect(() => {
    const cachedUser = localStorage.getItem("ritemasta_user");
    if (cachedUser) {
      try {
        const parsed = JSON.parse(cachedUser);
        setUser(parsed);
      } catch (e) {
        console.error(e);
      }
    }

    // Load local projects cache as reliable offline fallback
    const cachedProjects = localStorage.getItem("ritemasta_projects");
    if (cachedProjects) {
      try {
        setProjects(JSON.parse(cachedProjects));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Save projects to offline cash as writing progresses
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem("ritemasta_projects", JSON.stringify(projects));
    }
  }, [projects]);

  // Synchronise profile changes to local cache
  const saveUserSession = (u: User | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem("ritemasta_user", JSON.stringify(u));
    } else {
      localStorage.removeItem("ritemasta_user");
    }
  };

  // Redeem code pass function
  const handleRedeemCode = async (code: string): Promise<boolean> => {
    if (!user) return false;
    try {
      const response = await fetch("/api/auth/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, code }),
      });
      const data = await response.json();
      if (response.ok && data.user) {
        saveUserSession(data.user);
        // Refresh local projects profile unlocked states if needed
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  // Update profile name
  const handleUpdateUserName = async (newName: string) => {
    if (!user) return;
    try {
      const response = await fetch("/api/auth/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, newName }),
      });
      const data = await response.json();
      if (response.ok && data.user) {
        saveUserSession(data.user);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleForceUnlockFree = () => {
    if (!user) {
      alert("Sign In or Register a Profile first to trigger testing unlocks.");
      return;
    }
    const unlockedUser: User = {
      ...user,
      isUnlocked: true,
      unlockCode: "TEST-LIFETIME-PASS",
    };
    saveUserSession(unlockedUser);
    alert("✓ Tester Mode: $25 Lifetime Access Pass is now active for your user profile! Enjoy clean PDF, EPUB, XML exports.");
  };

  const handleCreateProject = (type: Project["type"]) => {
    if (!user) {
      setIsAuthOpen(true);
      alert("Please Sign In first to create a secure personal book project workspace.");
      return;
    }

    const defaultLayout: LayoutSettings = {
      pageSize: "6x9",
      marginTop: 1.0,
      marginBottom: 1.0,
      marginLeft: 1.25,
      marginRight: 1.0,
      bodyFontSize: 12,
      lineSpacing: "1.5",
      fontSerif: "Playfair Display",
      fontSans: "Inter",
      fontDisplay: "Playfair Display",
      activeTemplate: "Serene Wellness",
    };

    const newProject: Project = {
      id: Math.random().toString(),
      userId: user.id,
      type,
      metadata: {
        title: `My Awesome ${type === "presentation" ? "Presentation" : "Book"}`,
        author: user.name,
        publisher: "Ritemasta Publications",
        edition: "1st Edition",
        copyright: `© 2026 ${user.name}. All rights reserved.`,
      },
      layout: defaultLayout,
      chapters: [
        {
          id: "ch-intro",
          title: "Introduction",
          content: "Welcome to your new masterbook draft formatting workspace! Tap on written layouts to apply typography or write outlines.",
          order: 0,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newProject, ...projects];
    setProjects(updated);
    setSelectedProject(newProject);
    handleTabChange("editor");
  };

  const handleCreateParsedProject = (title: string, chaptersList: Chapter[]) => {
    if (!user) {
      setIsAuthOpen(true);
      alert("Please Sign In first to create a secure personal workspace.");
      return;
    }

    const defaultLayout: LayoutSettings = {
      pageSize: "6x9",
      marginTop: 1.0,
      marginBottom: 1.0,
      marginLeft: 1.25,
      marginRight: 1.0,
      bodyFontSize: 12,
      lineSpacing: "1.5",
      fontSerif: "Playfair Display",
      fontSans: "Inter",
      fontDisplay: "Playfair Display",
      activeTemplate: "Serene Wellness",
    };

    const newProject: Project = {
      id: Math.random().toString(),
      userId: user.id,
      type: "ebook",
      metadata: {
        title: title || "Parsed Manuscript Book",
        author: user.name,
        publisher: "Ritemasta Publications",
        edition: "1st Edition",
        copyright: `© 2026 ${user.name}. All rights reserved.`,
      },
      layout: defaultLayout,
      chapters: chaptersList,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newProject, ...projects];
    setProjects(updated);
    setSelectedProject(newProject);
    handleTabChange("editor");
    alert(`✓ Document '${title}' parsed and loaded into workspace successfully!`);
  };

  const handleDeleteProject = (id: string) => {
    const filtered = projects.filter((p) => p.id !== id);
    setProjects(filtered);
    if (selectedProject?.id === id) {
      setSelectedProject(null);
    }
    // Clean cache if empty
    if (filtered.length === 0) {
      localStorage.removeItem("ritemasta_projects");
    }
  };

  const handleUpdateActiveProject = (updatedProj: Project) => {
    setSelectedProject(updatedProj);
    const updatedList = projects.map((p) => (p.id === updatedProj.id ? updatedProj : p));
    setProjects(updatedList);
  };

  return (
    <div className="font-sans min-h-screen flex flex-col relative" style={{background:"var(--brown-900)",color:"var(--text-warm)"}}>
      {/* Sticky navigation Header */}
      <Header
        currentTab={currentTab}
        onChangeTab={(tab) => {
          handleTabChange(tab);
          if (tab !== "editor" && !selectedProject) {
            setSelectedProject(null);
          }
        }}
        user={user}
        onLogout={() => {
          saveUserSession(null);
          setProjects([]);
          setSelectedProject(null);
          handleTabChange("home");
          alert("Logged out safely from RitemastaPro.");
        }}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Primary Views Router */}
      <main
        className="flex-1"
        style={{
          opacity: pageVisible ? 1 : 0,
          transform: pageVisible ? "translateY(0)" : "translateY(6px)",
          transition: "opacity 160ms ease-out, transform 160ms ease-out",
          pointerEvents: pageVisible ? "auto" : "none",
        }}
      >
        {currentTab === "home" && (
          <div>
            {!user ? (
              /* LANDING VIEW — Premium Warm Dark Design */
              <div style={{background:"var(--brown-900)"}}>

                {/* === HERO SECTION === */}
                <section className="relative min-h-[92vh] flex flex-col overflow-hidden bg-hero">
                  {/* Ambient orbs */}
                  <div className="orb orb-gold w-96 h-96 top-[-80px] left-[-60px] opacity-60" />
                  <div className="orb orb-amber w-80 h-80 top-[40%] right-[-40px] opacity-40" style={{animationDelay:"-4s"}} />
                  <div className="orb orb-gold w-64 h-64 bottom-[10%] left-[30%] opacity-30" style={{animationDelay:"-7s"}} />

                  {/* Carousel */}
                  <HeroCarousel onAction={(action) => {
                    if (action === "auth") setIsAuthOpen(true);
                    else handleTabChange(action);
                  }} />

                  {/* Ticker */}
                  <TickerBand />

                  {/* Hero copy */}
                  <div className="flex-1 flex items-center justify-center px-6 py-16 relative z-10">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                      <span className="section-label animate-fade-up">
                        <span>✦</span> Global Publishing Ecosystem
                      </span>

                      <h1 className="font-serif font-bold leading-tight animate-fade-up"
                        style={{fontSize:"clamp(2.4rem, 7vw, 5rem)", animationDelay:"0.1s", color:"var(--text-warm)"}}>
                        Write. Design. Publish.<br />
                        Like a{" "}
                        <span className="text-shimmer">Pro</span>.
                      </h1>

                      <p className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed animate-fade-up"
                        style={{color:"var(--text-soft)", animationDelay:"0.2s"}}>
                        AI-powered publishing for authors, educators &amp; creators worldwide.
                        28 premium templates · Multi-format export · Pitch deck generator —
                        <strong style={{color:"var(--gold-main)"}}> one lifetime payment.</strong>
                      </p>

                      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-up" style={{animationDelay:"0.3s"}}>
                        <button onClick={() => setIsAuthOpen(true)} onMouseEnter={playVistaSound}
                          className="btn-gold animate-glow text-base px-8 py-4 z-10">
                          🚀 Start Free — Create a Project
                        </button>
                        <a href="#features"
                          className="btn-outline-gold text-sm px-6 py-3.5">
                          Explore Features ↓
                        </a>
                      </div>

                      {/* Trust strip */}
                      <div className="flex flex-wrap items-center justify-center gap-6 pt-4 animate-fade-up" style={{animationDelay:"0.4s"}}>
                        {["28 Premium Templates","EPUB · PDF · DOC · Markdown","Gemini AI Powered","$49 Lifetime — No Subscription","Ghana MoMo · Crypto · Card"].map(item => (
                          <span key={item} className="flex items-center gap-1.5 text-xs" style={{color:"var(--text-muted)"}}>
                            <span style={{color:"var(--gold-main)"}}>✓</span> {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* === FEATURES SECTION === */}
                <section id="features" className="py-20 px-6 bg-section-alt">
                  <div className="max-w-6xl mx-auto space-y-14">
                    <div className="text-center space-y-4">
                      <span className="section-label">Platform Suites</span>
                      <h2 className="font-serif font-bold text-3xl sm:text-4xl" style={{color:"var(--text-warm)"}}>
                        Everything You Need to Publish
                      </h2>
                      <p className="text-sm max-w-xl mx-auto" style={{color:"var(--text-soft)"}}>
                        Surpass Atticus, Vellum, and Reedsy — built for African creators and global authors.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {[
                        { icon:"📤", title:"Drop Book & Auto Outline", desc:"Drag and drop manuscripts. Instant chapter extraction under 1 second.", tab:"upload" },
                        { icon:"🔤", title:"28 Premium Templates", desc:"Wellness, academic, fiction, poetry, magazine, business, faith & more.", tab:"layout" },
                        { icon:"🤖", title:"iWrite Pro AI Studio", desc:"AI writing, pitch decks, contracts, proposals — Gemini-powered.", tab:"iwrite_studio" },
                        { icon:"🎨", title:"Cover Designer", desc:"Professional ebook, academic, business card, letterhead & magazine covers.", tab:"design_studio" },
                        { icon:"📰", title:"Magazine Builder", desc:"Full magazine layouts — A4, A5, Tabloid, Royal, B5 — PDF & HTML export.", tab:"magazine" },
                        { icon:"⚡", title:"Offline-First Speed", desc:"In-browser saves. Works with or without internet — your work never lost.", tab:"editor" },
                        { icon:"🎓", title:"Teecha AI Presentation", desc:"Curriculum scripts, slide synopses, and teaching modules in one click.", tab:"iwrite_studio" },
                        { icon:"🌿", title:"Wellness Protocol Architect", desc:"Formatted layout blocks for wellness guides, recipes & fitness tables.", tab:"layout" },
                        { icon:"🇬🇭", title:"Heritage Dialect Guard", desc:"Zero-crash rendering for Ewe, Ga, and Akan characters natively.", tab:"editor" },
                      ].map((f) => (
                        <div key={f.title} className="feature-card cursor-pointer" onClick={() => handleTabChange(f.tab)}>
                          <div className="text-4xl mb-4">{f.icon}</div>
                          <h3 className="font-serif font-bold text-base mb-2" style={{color:"var(--text-warm)"}}>{f.title}</h3>
                          <p className="text-sm leading-relaxed" style={{color:"var(--text-muted)"}}>{f.desc}</p>
                          <div className="mt-4 flex items-center gap-1 text-xs font-semibold" style={{color:"var(--gold-main)"}}>
                            Open Suite <span>→</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* === PRICING SECTION === */}
                <section className="py-20 px-6" style={{background:"var(--brown-900)"}}>
                  <div className="max-w-5xl mx-auto space-y-14">
                    <div className="text-center space-y-4">
                      <span className="section-label">Simple Pricing</span>
                      <h2 className="font-serif font-bold text-3xl sm:text-4xl" style={{color:"var(--text-warm)"}}>
                        One Payment. Forever.
                      </h2>
                      <p className="text-sm" style={{color:"var(--text-soft)"}}>
                        No subscriptions. No hidden fees. Upgrade once, publish forever.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {[
                        { name:"Design Studio", price:"$29", ghs:"₵429", desc:"Cover designer · All design templates · Graphics creation", featured:false },
                        { name:"Lifetime Pass", price:"$49", ghs:"₵724", desc:"All 28 templates · Every export format · AI tools · Future updates forever", featured:true },
                        { name:"iWrite Pro", price:"$39", ghs:"₵576", desc:"AI book writing · Pitch decks · Contracts · Proposals", featured:false },
                      ].map((p) => (
                        <div key={p.name} className={`pricing-card ${p.featured ? "featured" : ""}`}>
                          {p.featured && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                              <span className="bg-gradient-to-r from-[#D4A853] to-[#E8C060] text-[#1A0F06] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                                Best Value
                              </span>
                            </div>
                          )}
                          <p className="font-bold text-sm mb-3" style={{color:"var(--gold-main)"}}>{p.name}</p>
                          <div className="flex items-end gap-2 mb-1">
                            <span className="font-black text-4xl" style={{color:"var(--text-warm)"}}>{p.price}</span>
                            <span className="text-sm mb-1" style={{color:"var(--text-muted)"}}>one-time</span>
                          </div>
                          <p className="text-xs mb-4" style={{color:"var(--text-muted)"}}>{p.ghs} GHS</p>
                          <p className="text-xs leading-relaxed mb-6" style={{color:"var(--text-soft)"}}>{p.desc}</p>
                          <button onClick={() => handleTabChange("export")}
                            className={p.featured ? "btn-gold w-full" : "btn-outline-gold w-full"}>
                            Get {p.name}
                          </button>
                        </div>
                      ))}
                    </div>

                    <p className="text-center text-xs" style={{color:"var(--text-muted)"}}>
                      Pay via MTN MoMo · Telecel · Visa/Mastercard · BTC · SOL — powered by Paystack Ghana
                    </p>
                  </div>
                </section>

                {/* === TESTIMONIALS === */}
                <section id="learn-more" className="py-20 px-6 bg-section-alt">
                  <div className="max-w-5xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                      <span className="section-label">Testimonials</span>
                      <h2 className="font-serif font-bold text-3xl sm:text-4xl" style={{color:"var(--text-warm)"}}>
                        What Authors &amp; Educators Say
                      </h2>
                      <p className="text-sm" style={{color:"var(--text-soft)"}}>
                        Join teachers, wellness writers, and indie authors who switched to RitemastaPro.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {[
                        {
                          stars:5, initials:"SO", name:"Prof. S. N. Okai", role:"Lecturer & Senior Academic Fellow",
                          quote:'"The Teecha AI Presentation tool is an ultimate helper! I compiled my high-school curriculum books into slide synopsis scripts and teaching modules in under 60 seconds. RitemastaPro is a complete classroom ecosystem."',
                        },
                        {
                          stars:5, img:"/Founder_Robert1.jpg", name:"Robert Ashley Nikoi", role:"Author — The Bitter Leaf Protocols",
                          quote:'"I wrote all my medicinal herbal handbooks here. Ritemasta formats Ewe, Ga, and Akan vowels natively. Saved me thousands in prepress visual design costs!"',
                        },
                        {
                          stars:5, initials:"SJ", name:"Sarah Jenkins", role:"eBook Novelist & Indie Creator",
                          quote:'"Getting standard layouts meant paying $250 for Vellum — Mac only, no MoMo. RitemastaPro\'s $49 lifetime pass unlocked beautiful exports forever. Truly stellar value!"',
                        },
                      ].map((t,i) => (
                        <div key={i} className="testimonial-card flex flex-col justify-between gap-4">
                          <div className="space-y-3">
                            <div className="flex gap-0.5" style={{color:"var(--gold-main)"}}>{"★".repeat(t.stars)}</div>
                            <p className="text-sm leading-relaxed font-serif italic" style={{color:"var(--text-soft)"}}>{t.quote}</p>
                          </div>
                          <div className="flex items-center gap-3 pt-3 border-t" style={{borderColor:"var(--border-warm)"}}>
                            <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center font-bold text-xs flex-shrink-0"
                              style={{background:"rgba(212,168,83,0.15)", color:"var(--gold-main)", border:"1px solid var(--border-warm)"}}>
                              {t.img ? <img src={t.img} alt={t.name} className="w-full h-full object-cover" /> : t.initials}
                            </div>
                            <div>
                              <p className="font-bold text-xs" style={{color:"var(--text-warm)"}}>{t.name}</p>
                              <p className="text-[10px] uppercase tracking-wider" style={{color:"var(--text-muted)"}}>{t.role}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* === FINAL CTA === */}
                <section className="py-20 px-6 text-center relative overflow-hidden" style={{background:"var(--brown-800)"}}>
                  <div className="orb orb-gold w-96 h-96 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20" />
                  <div className="max-w-2xl mx-auto space-y-8 relative z-10">
                    <h2 className="font-serif font-bold text-3xl sm:text-4xl" style={{color:"var(--text-warm)"}}>
                      Ready to Publish Like a <span className="text-shimmer">Pro</span>?
                    </h2>
                    <p className="text-base" style={{color:"var(--text-soft)"}}>
                      Join thousands of African authors and global creators. Start free today.
                    </p>
                    <button onClick={() => setIsAuthOpen(true)} onMouseEnter={playVistaSound}
                      className="btn-gold animate-glow text-base px-10 py-4">
                      Create Your Free Account →
                    </button>
                  </div>
                </section>
              </div>
            ) : (
              /* DASHBOARD VIEW: Render personalized board once logged in */
              <Dashboard
                user={user}
                onSelectProject={(proj) => {
                  setSelectedProject(proj);
                  handleTabChange("editor");
                }}
                onDeleteProject={handleDeleteProject}
                onCreateProject={handleCreateProject}
                projects={projects.filter((p) => p.userId === user.id)}
                onRedeemCode={handleRedeemCode}
                onUpdateUserName={handleUpdateUserName}
              />
            )}
          </div>
        )}

        {/* Tab route mappings */}
        {currentTab === "upload" && (
          <ManuscriptParser
            user={user}
            onImportComplete={handleCreateParsedProject}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}

        {currentTab === "editor" && (
          <div>
            {selectedProject ? (
              <BookEditor
                project={selectedProject}
                onUpdateProject={handleUpdateActiveProject}
                onBackToDashboard={() => {
                  setSelectedProject(null);
                  handleTabChange("home");
                }}
              />
            ) : (
              <div className="py-16 text-center max-w-md mx-auto space-y-4">
                <Settings className="w-12 h-12 mx-auto animate-spin" style={{color:"var(--gold-main)"}} />
                <h2 className="font-serif font-bold text-lg" style={{color:"var(--text-warm)"}}>Select a Project workspace first</h2>
                <p className="text-xs" style={{color:"var(--text-muted)"}}>
                  Go to 'Home' (Dashboard) to launch or resume your wellness book, pitch deck outline, or receipts and forms.
                </p>
                <button
                  onClick={() => handleTabChange("home")}
                  className="btn-gold text-xs px-4 py-2"
                >
                  Return to Dashboard
                </button>
              </div>
            )}
          </div>
        )}

        {currentTab === "layout" && (
          <div>
            <div className="py-8 px-4 max-w-7xl mx-auto">
              <h2 className="section-title text-2xl mb-6">Choose Your Template</h2>
              <TemplateGallery
                activeTemplate={selectedProject?.layout?.activeTemplate || "Bookstera Clean Pro"}
                onSelect={(name) => {
                  if (selectedProject) {
                    handleUpdateActiveProject({ ...selectedProject, layout: { ...selectedProject.layout, activeTemplate: name } });
                  }
                }}
              />
            </div>
            {selectedProject && (
              <div className="border-t px-4 pb-8" style={{ borderColor: "var(--border)" }}>
                <div className="max-w-7xl mx-auto pt-8">
                  <h3 className="font-bold text-base mb-4" style={{ color: "var(--text-primary)" }}>Fine-tune Layout Settings</h3>
                  <LayoutDesigner project={selectedProject} onUpdateProject={handleUpdateActiveProject} />
                </div>
              </div>
            )}
          </div>
        )}

        {currentTab === "design_studio" && <CoverDesigner />}
        {currentTab === "magazine" && <MagazineTemplate />}
        {currentTab === "design_studio_legacy" && (
          <DesignEngine
            user={user}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}

        {currentTab === "iwrite_studio" && (
          <IWriteStudio
            user={user}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}

        {currentTab === "save" && (
          <div className="py-12 px-6" style={{background:"var(--brown-800)"}}>
            <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-2xl text-center space-y-4" style={{background:"var(--brown-700)",border:"1px solid var(--border-warm)"}}>
              <span className="text-4xl block">💾</span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold" style={{color:"var(--text-warm)"}}>Backup &amp; Manuscript Security</h2>
              <p className="text-xs leading-relaxed" style={{color:"var(--text-muted)"}}>
                RitemastaPro saves your work every 30 seconds automatically. For extra peace of mind, you can download a master JSON backup file below or restore from previous versions.
              </p>
              
              <div className="p-4 rounded-xl border flex flex-col items-center gap-3" style={{background:"var(--brown-600)",borderColor:"var(--border-warm)"}}>
                <button
                  onClick={() => {
                    if (projects.length === 0) {
                      alert("You have no active projects to backup yet.");
                      return;
                    }
                    const text = JSON.stringify(projects, null, 2);
                    const blob = new Blob([text], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = `ritemasta_backup_${new Date().toISOString().slice(0, 10)}.json`;
                    link.click();
                    URL.revokeObjectURL(url);
                    alert("✓ Workspace diagnostic package downloaded. Keep it safe!");
                  }}
                  className="btn-gold text-xs inline-flex items-center gap-1.5"
                >
                  Download Raw JSON Backups
                </button>

                <p className="text-[10px] text-[#8C7A6D] leading-relaxed">
                  Backup contains all metadata, customized line heights, copyright notices, and active table of contents databases. This file stays completely private.
                </p>
              </div>
            </div>
          </div>
        )}

        {currentTab === "export" && (
          <ExportPanel
            user={user}
            project={
              selectedProject ||
              projects[0] || {
                id: "placeholder",
                userId: "none",
                type: "ebook",
                metadata: { title: "Draft Manuscript Placeholder", author: "Guest Author" },
                layout: {
                  pageSize: "6x9",
                  marginTop: 1,
                  marginBottom: 1,
                  marginLeft: 1.25,
                  marginRight: 1,
                  bodyFontSize: 12,
                  lineSpacing: "1.5",
                  fontSerif: "Playfair Display",
                  fontSans: "Inter",
                  fontDisplay: "Playfair Display",
                  activeTemplate: "Serene Wellness",
                },
                chapters: [{ id: "c-1", title: "Placeholder Chapter", content: "No content loaded yet.", order: 0 }],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }
            }
            onRedeemCode={handleRedeemCode}
            onForceUnlockFree={handleForceUnlockFree}
          />
        )}

        {currentTab === "contact" && <ContactForm />}
        {currentTab === "about" && <StaticPages page="about" onChangeTab={handleTabChange} />}
        {currentTab === "privacy" && <StaticPages page="privacy" onChangeTab={handleTabChange} />}
        {currentTab === "terms" && <StaticPages page="terms" onChangeTab={handleTabChange} />}
        {currentTab === "admin" && <AdminPanel onBackToHome={() => handleTabChange("home")} />}
      </main>

      {/* Floating chatbot assistant Yayra */}
      <YayraChatbot 
        currentTab={currentTab} 
        onChangeTab={handleTabChange} 
        onCreateProject={handleCreateProject}
        user={user} 
      />

      {/* Auth Screen Sign In / Register Dialog */}
      {isAuthOpen && (
        <AuthScreen
          onChangeTab={handleTabChange}
          onClose={() => setIsAuthOpen(false)}
          onAuthSuccess={(authenticatedUser) => {
            saveUserSession(authenticatedUser);
            // Auto reload or map projects if needed
            const loadProjects = async () => {
              try {
                const response = await fetch(`/api/projects?userId=${authenticatedUser.id}`);
                const data = await response.json();
                if (response.ok && data.projects) {
                  setProjects(data.projects);
                  localStorage.setItem("ritemasta_projects", JSON.stringify(data.projects));
                }
              } catch (e) {
                console.warn(e);
              }
            };
            loadProjects();
            alert(`✓ Sign In Success! Welcome back, ${authenticatedUser.name}.`);
          }}
        />
      )}

      {/* Footer matching standard Ritemasta style */}
      <Footer onChangeTab={handleTabChange} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}
