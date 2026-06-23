/**
 * RitemastaPro - Header Navigation (Premium Rebuild)
 * Layout: [Nav+Suites | Brand Center | FontSize+DarkToggle+Auth]
 * Dark mode default. Suites dropdown for features. User avatar after login.
 */
import { useState, useRef, useEffect } from "react";
import { User } from "../types";
import { useTheme } from "../contexts/ThemeContext";
import {
  ChevronDown, LogOut, Settings, BookOpen, Upload,
  LayoutTemplate, Palette, Sparkles, Download, Mail,
  Shield, Menu, X, Sun, Moon, Type
} from "lucide-react";

export const playVistaSound = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.setValueAtTime(880, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);
    g.gain.setValueAtTime(0.08, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    o.start(); o.stop(ctx.currentTime + 0.18);
  } catch {}
};

const playClickSound = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type = "sine";
    o.frequency.setValueAtTime(660, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.06);
    g.gain.setValueAtTime(0.06, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    o.start(); o.stop(ctx.currentTime + 0.12);
  } catch {}
};

interface HeaderProps {
  currentTab: string;
  onChangeTab: (tab: string) => void;
  user: User | null;
  onLogout: () => void;
  onOpenAuth: () => void;
}

function NavBtn({ label, tab, current, onClick, icon, highlight }: {
  label: string; tab: string; current: string;
  onClick: (tab: string) => void; icon?: React.ReactNode; highlight?: string;
}) {
  const isActive = current === tab;
  return (
    <button
      onClick={() => { playClickSound(); onClick(tab); }}
      className={`relative px-3 py-2 text-xs font-semibold tracking-wide rounded-lg transition-all duration-200 flex items-center gap-1.5 group active:scale-95 ${
        isActive ? "bg-[var(--accent-dim)] text-[var(--accent)]"
          : `text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)] ${highlight || ""}`
      }`}
    >
      {icon && <span className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity">{icon}</span>}
      {label}
      <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-[var(--accent)] rounded-full transition-all duration-300 ${
        isActive ? "w-4/5 opacity-100" : "w-0 opacity-0 group-hover:w-3/5 group-hover:opacity-40"
      }`} />
    </button>
  );
}

export default function Header({ currentTab, onChangeTab, user, onLogout, onOpenAuth }: HeaderProps) {
  const { darkMode, toggleDarkMode, lightTheme, setLightTheme, fontSize, setFontSize } = useTheme();
  const [suitesOpen, setSuitesOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [fontMenuOpen, setFontMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lightThemeOpen, setLightThemeOpen] = useState(false);
  const suitesRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const fontRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (suitesRef.current && !suitesRef.current.contains(e.target as Node)) setSuitesOpen(false);
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) { setUserMenuOpen(false); setLightThemeOpen(false); }
      if (fontRef.current && !fontRef.current.contains(e.target as Node)) setFontMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleTabChange = (tab: string) => {
    onChangeTab(tab);
    setSuitesOpen(false);
    setMoreOpen(false);
    setUserMenuOpen(false);
    setMobileOpen(false);
  };

  const suitesLinks = [
    { label: "iWrite Pro AI Studio", tab: "iwrite_studio", icon: <Sparkles className="w-3.5 h-3.5" />, desc: "Books, scripts, proposals & pitch decks" },
    { label: "Design Studio", tab: "design_studio", icon: <Palette className="w-3.5 h-3.5" />, desc: "Cover design & graphics creation" },
    { label: "28 Layout Templates", tab: "layout", icon: <LayoutTemplate className="w-3.5 h-3.5" />, desc: "Wellness, academic, fiction & more" },
    { label: "Upload & Auto-Format", tab: "upload", icon: <Upload className="w-3.5 h-3.5" />, desc: "Drop manuscript, get instant outline" },
    { label: "Book Editor", tab: "editor", icon: <BookOpen className="w-3.5 h-3.5" />, desc: "Chapter-by-chapter writing workspace" },
    { label: "Export & Pitch Deck PDF", tab: "export", icon: <Download className="w-3.5 h-3.5" />, desc: "EPUB · DOC · HTML · Markdown · PDF" },
  ];

  const marketingLinks: { label: string; tab: string }[] = [
    { label: "Home", tab: "home" },
    { label: "Pricing", tab: "export" },
    { label: "About", tab: "about" },
    { label: "Contact", tab: "contact" },
  ];

  const appLinks: { label: string; tab: string; icon?: React.ReactNode }[] = [
    { label: "Dashboard", tab: "home", icon: <BookOpen className="w-3.5 h-3.5" /> },
    { label: "Editor", tab: "editor", icon: <Settings className="w-3.5 h-3.5" /> },
    { label: "Export", tab: "export", icon: <Download className="w-3.5 h-3.5" /> },
  ];

  const moreLinks = [
    { label: "Save & Backup", tab: "save", icon: <Download className="w-3.5 h-3.5" /> },
    { label: "Contact Support", tab: "contact", icon: <Mail className="w-3.5 h-3.5" /> },
  ];

  const navLinks = user ? appLinks : marketingLinks;

  const headerBg = darkMode
    ? "bg-[#0A0C13]/95 border-b border-[var(--border)]"
    : "bg-[var(--bg-card)]/95 border-b border-[var(--border)]";

  return (
    <header className={`${headerBg} backdrop-blur-md text-[var(--text-primary)] py-2.5 px-4 sticky top-0 z-50 shadow-lg`}>
      <div className="max-w-7xl mx-auto grid grid-cols-3 items-center gap-2">

        {/* LEFT — Nav */}
        <div className="flex items-center gap-0.5">
          <nav className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <NavBtn key={link.tab} label={link.label} tab={link.tab} current={currentTab}
                onClick={handleTabChange} icon={(link as any).icon} />
            ))}

            {/* Suites dropdown (always visible) */}
            <div className="relative" ref={suitesRef}>
              <button
                onClick={() => setSuitesOpen(!suitesOpen)}
                className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg transition-all duration-200 active:scale-95 group"
              >
                Suites
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${suitesOpen ? "rotate-180" : ""}`} />
              </button>
              {suitesOpen && (
                <div className="absolute left-0 top-full mt-2 w-72 rounded-xl shadow-2xl overflow-hidden z-[100]"
                  style={{ background: darkMode ? "#0F1117" : "var(--bg-card)", border: "1px solid var(--border)" }}>
                  <div className="px-3 py-2 border-b" style={{ borderColor: "var(--border)" }}>
                    <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--accent)" }}>Platform Suites</p>
                  </div>
                  {suitesLinks.map((link) => (
                    <button key={link.tab} onClick={() => handleTabChange(link.tab)}
                      className="w-full flex items-start gap-3 px-4 py-3 transition-all duration-150 text-left group border-b last:border-0"
                      style={{ borderColor: "var(--border-subtle)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--accent-dim)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <span className="mt-0.5 shrink-0" style={{ color: "var(--accent)" }}>{link.icon}</span>
                      <div>
                        <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{link.label}</p>
                        <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>{link.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* More dropdown (logged in) */}
            {user && (
              <div className="relative" ref={moreRef}>
                <button onClick={() => setMoreOpen(!moreOpen)}
                  className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg transition-all duration-200 active:scale-95">
                  More <ChevronDown className={`w-3 h-3 transition-transform ${moreOpen ? "rotate-180" : ""}`} />
                </button>
                {moreOpen && (
                  <div className="absolute left-0 top-full mt-2 w-48 rounded-xl shadow-2xl overflow-hidden z-[100]"
                    style={{ background: darkMode ? "#0F1117" : "var(--bg-card)", border: "1px solid var(--border)" }}>
                    {moreLinks.map((link) => (
                      <button key={link.tab} onClick={() => handleTabChange(link.tab)}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-left transition-all duration-150 border-b last:border-0"
                        style={{ color: "var(--text-secondary)", borderColor: "var(--border-subtle)" }}
                        onMouseEnter={(e) => { (e.currentTarget.style.color = "var(--accent)"); (e.currentTarget.style.background = "var(--accent-dim)"); }}
                        onMouseLeave={(e) => { (e.currentTarget.style.color = "var(--text-secondary)"); (e.currentTarget.style.background = "transparent"); }}
                      >
                        <span style={{ color: "var(--accent)" }}>{link.icon}</span>{link.label}
                      </button>
                    ))}
                    {user?.email === "ritemasta@gmail.com" && (
                      <button onClick={() => handleTabChange("admin")}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-left transition-all border-t"
                        style={{ color: "var(--accent)", borderColor: "var(--border)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--accent-dim)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <Shield className="w-3.5 h-3.5" /> Admin Panel
                      </button>
                    )}
                    <button onClick={() => { onLogout(); setMoreOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-left border-t transition-all"
                      style={{ color: "var(--danger)", borderColor: "var(--border)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(229,115,115,0.08)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2 transition-colors active:scale-95"
            style={{ color: "var(--text-secondary)" }}
            onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* CENTER — Brand */}
        <div className="flex items-center justify-center gap-2 cursor-pointer group" onClick={() => { playClickSound(); handleTabChange("home"); }}>
          <img src="/logo.png" alt="RitemastaPro" className="h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-105" />
          <div className="flex flex-col leading-none">
            <span className="font-serif text-xl font-bold tracking-tight whitespace-nowrap">
              <span className="animate-wavy-shine">Ritemasta</span>
              <span style={{ color: "var(--accent)" }}>Pro</span>
            </span>
            <span className="text-[0.55rem] font-bold tracking-widest uppercase" style={{ color: "var(--accent)" }}>
              Publishing · Technology
            </span>
          </div>
        </div>

        {/* RIGHT — Controls */}
        <div className="flex items-center justify-end gap-1.5">

          {/* Font size toggle */}
          <div className="relative hidden md:block" ref={fontRef}>
            <button onClick={() => setFontMenuOpen(!fontMenuOpen)} title="Font size"
              className="p-2 rounded-lg transition-all duration-200 active:scale-95"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}>
              <Type className="w-4 h-4" />
            </button>
            {fontMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-36 rounded-xl shadow-2xl overflow-hidden z-[100]"
                style={{ background: darkMode ? "#0F1117" : "var(--bg-card)", border: "1px solid var(--border)" }}>
                {(["normal", "large", "xl"] as const).map((size) => (
                  <button key={size} onClick={() => { setFontSize(size); setFontMenuOpen(false); }}
                    className="w-full px-4 py-2 text-xs text-left transition-all"
                    style={{ color: fontSize === size ? "var(--accent)" : "var(--text-secondary)", background: fontSize === size ? "var(--accent-dim)" : "transparent" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--accent-dim)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = fontSize === size ? "var(--accent-dim)" : "transparent")}
                  >
                    {size === "normal" ? "Normal (16px)" : size === "large" ? "Large (18px)" : "Extra Large (20px)"}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dark/Light toggle */}
          <div className="relative hidden md:block">
            <button onClick={() => { if (darkMode) { toggleDarkMode(); } else { setLightThemeOpen(!lightThemeOpen); } }}
              title={darkMode ? "Switch to light mode" : "Light theme options"}
              className="p-2 rounded-lg transition-all duration-200 active:scale-95"
              style={{ color: darkMode ? "#D4A853" : "var(--text-muted)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = darkMode ? "#D4A853" : "var(--text-muted)")}>
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            {!darkMode && lightThemeOpen && (
              <div className="absolute right-0 top-full mt-2 w-40 rounded-xl shadow-2xl overflow-hidden z-[100]"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                <div className="px-3 py-1.5 border-b" style={{ borderColor: "var(--border)" }}>
                  <p className="text-[9px] uppercase font-bold tracking-widest" style={{ color: "var(--text-muted)" }}>Light Theme</p>
                </div>
                {([
                  { key: "warm", label: "Warm Cream", color: "#D4A853" },
                  { key: "slate", label: "Cool Slate", color: "#64748B" },
                  { key: "pure", label: "Pure White", color: "#111111" },
                ] as const).map((t) => (
                  <button key={t.key} onClick={() => { setLightTheme(t.key); setLightThemeOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-left transition-all"
                    style={{ color: lightTheme === t.key ? "var(--accent)" : "var(--text-secondary)", background: lightTheme === t.key ? "var(--accent-dim)" : "transparent" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--accent-dim)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = lightTheme === t.key ? "var(--accent-dim)" : "transparent")}
                  >
                    <span className="w-3 h-3 rounded-full border shrink-0" style={{ background: t.color, borderColor: "var(--border)" }} />
                    {t.label}
                  </button>
                ))}
                <div className="border-t px-4 py-2" style={{ borderColor: "var(--border)" }}>
                  <button onClick={() => { toggleDarkMode(); setLightThemeOpen(false); }}
                    className="text-[10px] font-semibold transition-colors w-full text-left"
                    style={{ color: "var(--accent)" }}>
                    ← Back to Dark Mode
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Auth controls */}
          {user ? (
            <div className="relative hidden md:block" ref={userRef}>
              <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all duration-200 active:scale-95"
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--accent-dim)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div className="w-7 h-7 rounded-full border flex items-center justify-center text-xs font-bold overflow-hidden"
                  style={{ background: "var(--accent-dim)", borderColor: "var(--accent)", color: "var(--accent)" }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-xs font-bold leading-none" style={{ color: "var(--text-primary)" }}>{user.name.split(" ")[0]}</p>
                  <p className="text-[0.6rem] leading-none mt-0.5" style={{ color: "var(--accent)" }}>
                    {user.isUnlocked ? "✓ Lifetime" : "Free"}
                  </p>
                </div>
                <ChevronDown className={`w-3 h-3 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} style={{ color: "var(--text-muted)" }} />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 rounded-xl shadow-2xl overflow-hidden z-[100]"
                  style={{ background: darkMode ? "#0F1117" : "var(--bg-card)", border: "1px solid var(--border)" }}>
                  <div className="px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
                    <p className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>{user.name}</p>
                    <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{user.email}</p>
                  </div>
                  <button onClick={() => { handleTabChange("home"); setUserMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-left transition-all"
                    style={{ color: "var(--text-secondary)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--accent-dim)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  ><BookOpen className="w-3.5 h-3.5" /> Dashboard</button>
                  {!user.isUnlocked && (
                    <button onClick={() => { handleTabChange("export"); setUserMenuOpen(false); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-left transition-all"
                      style={{ color: "var(--accent)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--accent-dim)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    ><Sparkles className="w-3.5 h-3.5" /> Upgrade — $49</button>
                  )}
                  <button onClick={() => { onLogout(); setUserMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-left border-t transition-all"
                    style={{ color: "var(--danger)", borderColor: "var(--border)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(229,115,115,0.08)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  ><LogOut className="w-3.5 h-3.5" /> Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-1.5">
              <button onClick={() => { playClickSound(); onOpenAuth(); }}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-200 active:scale-95"
                style={{ color: "var(--text-secondary)", borderColor: "var(--border)" }}
                onMouseEnter={(e) => { (e.currentTarget.style.color = "var(--text-primary)"); (e.currentTarget.style.borderColor = "var(--accent)"); }}
                onMouseLeave={(e) => { (e.currentTarget.style.color = "var(--text-secondary)"); (e.currentTarget.style.borderColor = "var(--border)"); }}
              >Sign In</button>
              <button onClick={() => { playVistaSound(); onOpenAuth(); }}
                className="px-4 py-1.5 font-bold text-xs rounded-full transition-all duration-200 hover:scale-105 active:scale-95 whitespace-nowrap"
                style={{ background: "var(--accent)", color: "#2D1B0E" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--accent-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--accent)")}
              >Start Free →</button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden mt-3 pb-3 border-t pt-3" style={{ borderColor: "var(--border)" }}>
          <div className="flex flex-col gap-1 px-1">
            {navLinks.map((link) => (
              <button key={link.tab} onClick={() => handleTabChange(link.tab)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-all"
                style={{ color: currentTab === link.tab ? "var(--accent)" : "var(--text-secondary)", background: currentTab === link.tab ? "var(--accent-dim)" : "transparent" }}
              >
                {(link as any).icon && <span>{(link as any).icon}</span>}
                {link.label}
              </button>
            ))}
            <div className="border-t my-1" style={{ borderColor: "var(--border)" }} />
            <p className="text-[9px] uppercase font-bold px-3 py-1" style={{ color: "var(--text-muted)" }}>Suites</p>
            {suitesLinks.map((link) => (
              <button key={link.tab} onClick={() => handleTabChange(link.tab)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-all"
                style={{ color: "var(--text-secondary)" }}
              >
                <span style={{ color: "var(--accent)" }}>{link.icon}</span>
                {link.label}
              </button>
            ))}
            <div className="border-t my-1 flex items-center gap-3 px-3 pt-3" style={{ borderColor: "var(--border)" }}>
              <button onClick={toggleDarkMode} className="flex items-center gap-1.5 text-xs" style={{ color: "var(--accent)" }}>
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {darkMode ? "Light" : "Dark"}
              </button>
              {(["normal", "large", "xl"] as const).map((s) => (
                <button key={s} onClick={() => setFontSize(s)}
                  className="text-[10px] px-2 py-1 rounded transition-all"
                  style={{ color: fontSize === s ? "#2D1B0E" : "var(--text-muted)", background: fontSize === s ? "var(--accent)" : "transparent" }}>
                  {s === "normal" ? "A" : s === "large" ? "A+" : "A++"}
                </button>
              ))}
            </div>
            {user ? (
              <button onClick={() => { onLogout(); setMobileOpen(false); }}
                className="flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg mt-1"
                style={{ color: "var(--danger)" }}>
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            ) : (
              <div className="flex gap-2 mt-1">
                <button onClick={() => { onOpenAuth(); setMobileOpen(false); }}
                  className="flex-1 py-2.5 text-sm font-semibold text-center rounded-lg border transition-all"
                  style={{ color: "var(--text-secondary)", borderColor: "var(--border)" }}>Sign In</button>
                <button onClick={() => { onOpenAuth(); setMobileOpen(false); }}
                  className="flex-1 py-2.5 font-bold text-sm rounded-full transition-all"
                  style={{ background: "var(--accent)", color: "#2D1B0E" }}>Start Free</button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
