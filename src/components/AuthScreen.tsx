/**
 * RitemastaPro - AuthScreen (Premium Rebuild)
 * Password toggle, Remember Me, Forgot Password, no social/passkey buttons
 */
import { useState } from "react";
import { User } from "../types";
import { Eye, EyeOff, X, Lock, Mail, User as UserIcon } from "lucide-react";

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

interface AuthScreenProps {
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
  onChangeTab: (tab: string) => void;
}

type AuthMode = "login" | "register" | "forgot";

export default function AuthScreen({ onClose, onAuthSuccess, onChangeTab }: AuthScreenProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");

  const handleLogin = async () => {
    if (!email || !password) { setError("Email and password required."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        if (rememberMe) localStorage.setItem("rm_remember", "true");
        onAuthSuccess(data.user);
        onClose();
      } else {
        setError(data.error || "Login failed.");
      }
    } catch { setError("Connection error. Please try again."); }
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!email || !password || !name) { setError("All fields required."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Account created! Signing you in...");
        setTimeout(() => handleLogin(), 800);
      } else {
        setError(data.error || "Registration failed.");
      }
    } catch { setError("Connection error. Please try again."); }
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) { setError("Please enter your email address."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Reset instructions sent! Check your email or WhatsApp.");
      } else {
        setError(data.error || "Could not process request.");
      }
    } catch { setError("Connection error."); }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex gap-2">
            {(["login", "register"] as const).map((m) => (
              <button key={m} onClick={() => { setMode(m); setError(""); setSuccess(""); }}
                className="px-3 py-1 text-xs font-bold rounded-full transition-all"
                style={{ background: mode === m ? "var(--accent)" : "transparent", color: mode === m ? "#2D1B0E" : "var(--text-muted)" }}>
                {m === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>
          <button onClick={onClose} style={{ color: "var(--text-muted)" }}
            className="hover:opacity-70 transition-opacity active:scale-95"><X className="w-4 h-4" /></button>
        </div>

        <div className="px-6 py-6 space-y-4">
          {/* Brand */}
          <div className="text-center mb-2">
            <img src="/logo.png" alt="RitemastaPro" className="h-12 w-auto object-contain mx-auto mb-2" />
            <h2 className="font-serif text-xl font-bold" style={{ color: "var(--text-primary)" }}>
              {mode === "login" ? "Welcome back!" : mode === "register" ? "Create your account" : "Reset Password"}
            </h2>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              {mode === "login" ? "Sign in to your publishing workspace" : mode === "register" ? "Start publishing like a pro today" : "Enter your email to receive reset instructions"}
            </p>
          </div>

          {error && <div className="text-xs p-3 rounded-lg" style={{ background: "rgba(229,115,115,0.1)", color: "var(--danger)", border: "1px solid rgba(229,115,115,0.2)" }}>{error}</div>}
          {success && <div className="text-xs p-3 rounded-lg" style={{ background: "rgba(129,199,132,0.1)", color: "var(--success)", border: "1px solid rgba(129,199,132,0.2)" }}>{success}</div>}

          {mode === "forgot" ? (
            <>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-muted)" }} />
                <input type="email" placeholder="Your email address" value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm outline-none transition-all"
                  style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
              </div>
              <button onClick={handleForgotPassword} disabled={loading}
                className="w-full py-2.5 font-bold text-sm rounded-lg transition-all active:scale-95 disabled:opacity-60"
                style={{ background: "var(--accent)", color: "#2D1B0E" }}>
                {loading ? "Sending..." : "Send Reset Instructions"}
              </button>
              <button onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
                className="w-full text-xs text-center transition-colors" style={{ color: "var(--text-muted)" }}>
                ← Back to Sign In
              </button>
            </>
          ) : (
            <>
              {mode === "register" && (
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-muted)" }} />
                  <input type="text" placeholder="Full name" value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm outline-none"
                    style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
                </div>
              )}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-muted)" }} />
                <input type="email" placeholder="Email address" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm outline-none"
                  style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-muted)" }} />
                <input type={showPassword ? "text" : "password"} placeholder="Password" value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (mode === "login" ? handleLogin() : handleRegister())}
                  className="w-full pl-9 pr-10 py-2.5 rounded-lg text-sm outline-none"
                  style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
                <button onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
                  style={{ color: "var(--text-muted)" }}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {mode === "login" && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 rounded accent-yellow-500" />
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>Remember me</span>
                  </label>
                  <button onClick={() => { setMode("forgot"); setError(""); setSuccess(""); }}
                    className="text-xs transition-colors hover:opacity-70" style={{ color: "var(--accent)" }}>
                    Forgot password?
                  </button>
                </div>
              )}

              <button onClick={mode === "login" ? handleLogin : handleRegister} disabled={loading}
                onMouseEnter={playVistaSound}
                className="w-full py-3 font-bold text-sm rounded-lg transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
                style={{ background: "var(--accent)", color: "#2D1B0E" }}>
                {loading ? "Please wait..." : mode === "login" ? "Sign In to RitemastaPro" : "Create Free Account"}
              </button>

              <p className="text-center text-xs" style={{ color: "var(--text-muted)" }}>
                {mode === "login" ? "No account? " : "Already registered? "}
                <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
                  className="font-bold transition-colors" style={{ color: "var(--accent)" }}>
                  {mode === "login" ? "Create one free" : "Sign in"}
                </button>
              </p>

              <div className="border-t pt-3" style={{ borderColor: "var(--border)" }}>
                <p className="text-center text-[10px]" style={{ color: "var(--text-muted)" }}>
                  By signing up, you agree to our{" "}
                  <button onClick={() => { onChangeTab("terms"); onClose(); }} className="underline">Terms</button>
                  {" & "}
                  <button onClick={() => { onChangeTab("privacy"); onClose(); }} className="underline">Privacy Policy</button>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
