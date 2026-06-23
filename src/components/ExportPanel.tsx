/**
 * RitemastaPro - ExportPanel with Paystack integration
 * Pricing: $49 Lifetime / $29 Design Studio / $39 iWrite Pro
 * Concierge $149 - Notify Me stub
 * Markdown export added
 */
import { useState, useEffect } from "react";
import { User } from "../types";
import { Project } from "../types";
import { Shield, CheckCircle, CreditCard, Smartphone, Bitcoin, Star, Bell, Download, FileText, BookOpen, Layers } from "lucide-react";

declare global {
  interface Window { PaystackPop: any; }
}

interface ExportPanelProps {
  user: User | null;
  project: Project;
  onRedeemCode: (code: string) => Promise<boolean>;
  onForceUnlockFree: () => void;
}

type ProductTier = "lifetime" | "design" | "iwrite";

const PRODUCTS = {
  lifetime: { name: "Lifetime Publishing Pass", price: 49, ghs: 724.50, description: "All 28 templates · EPUB · DOC · HTML · Markdown · PDF · Future updates forever" },
  design:   { name: "Design Studio",            price: 29, ghs: 429.30, description: "Cover designer · Graphics · All design templates" },
  iwrite:   { name: "iWrite Pro AI Studio",     price: 39, ghs: 576.90, description: "AI book writing · Pitch decks · Contracts · Proposals" },
};

export default function ExportPanel({ user, project, onRedeemCode, onForceUnlockFree }: ExportPanelProps) {
  const [redeemCode, setRedeemCode] = useState("");
  const [redeemMsg, setRedeemMsg] = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [selectedTier, setSelectedTier] = useState<ProductTier>("lifetime");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifySent, setNotifySent] = useState(false);
  const [psLoaded, setPsLoaded] = useState(false);

  const isUnlocked = user?.isUnlocked;
  const isDesign = user?.isDesignStudioUnlocked;
  const isIWrite = user?.isIWriteProUnlocked;

  useEffect(() => {
    if (!document.getElementById("paystack-js")) {
      const s = document.createElement("script");
      s.id = "paystack-js";
      s.src = "https://js.paystack.co/v1/inline.js";
      s.onload = () => setPsLoaded(true);
      document.head.appendChild(s);
    } else {
      setPsLoaded(true);
    }
  }, []);

  const handleRedeem = async () => {
    if (!redeemCode.trim()) return;
    setIsRedeeming(true);
    const ok = await onRedeemCode(redeemCode.trim());
    setRedeemMsg(ok ? "✓ Access activated successfully!" : "✗ Invalid or already used code.");
    setIsRedeeming(false);
  };

  const handlePaystack = async (tier: ProductTier) => {
    if (!user) { alert("Please sign in first."); return; }
    if (!psLoaded || !window.PaystackPop) { alert("Payment system loading. Please try again in a moment."); return; }
    const product = PRODUCTS[tier];
    setPaymentLoading(true);

    try {
      const res = await fetch("/api/payment/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, email: user.email, tier, amount: product.price }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Payment init failed");

      const handler = window.PaystackPop.setup({
        key: data.publicKey,
        email: user.email,
        amount: data.amount,
        currency: "GHS",
        ref: data.reference,
        metadata: { userId: user.id, tier },
        callback: async (response: any) => {
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reference: response.reference, userId: user.id, tier }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            alert(`✓ Payment confirmed! ${product.name} activated on your account.`);
            window.location.reload();
          } else {
            alert("Payment verification failed. Contact support with reference: " + response.reference);
          }
        },
        onClose: () => setPaymentLoading(false),
      });
      handler.openIframe();
    } catch (err: any) {
      alert("Payment error: " + err.message);
      setPaymentLoading(false);
    }
  };

  const handleNotifyConcierge = async () => {
    if (!notifyEmail) return;
    setNotifySent(true);
  };

  const formats = [
    { icon: <BookOpen className="w-4 h-4" />, label: "EPUB 3", desc: "For Kindle, Apple Books, Kobo", locked: !isUnlocked },
    { icon: <FileText className="w-4 h-4" />, label: "Word DOC", desc: "Microsoft Word compatible", locked: !isUnlocked },
    { icon: <Layers className="w-4 h-4" />, label: "HTML", desc: "Self-contained web file", locked: !isUnlocked },
    { icon: <FileText className="w-4 h-4" />, label: "XML", desc: "Structured data export", locked: !isUnlocked },
    { icon: <Download className="w-4 h-4" />, label: "Markdown (.md)", desc: "Universal text format", locked: !isUnlocked },
    { icon: <FileText className="w-4 h-4" />, label: "PDF", desc: "Print-ready via browser", locked: false },
  ];

  return (
    <div className="min-h-screen py-10 px-4" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="font-serif text-3xl font-bold" style={{ color: "var(--text-primary)" }}>Export & Access</h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {isUnlocked ? "✓ Lifetime Access Active — all formats unlocked" : "Unlock premium exports with a one-time payment"}
          </p>
        </div>

        {/* Export formats */}
        <div className="rounded-2xl p-6 space-y-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <h2 className="font-bold text-base" style={{ color: "var(--text-primary)" }}>Export Formats</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {formats.map((f) => (
              <div key={f.label} className={`p-3 rounded-xl border flex items-start gap-2.5 ${f.locked ? "opacity-50" : ""}`}
                style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}>
                <span style={{ color: "var(--accent)" }}>{f.icon}</span>
                <div>
                  <p className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>{f.label} {f.locked && "🔒"}</p>
                  <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
          {isUnlocked && (
            <button onClick={() => window.print()}
              className="w-full py-2.5 font-bold text-sm rounded-lg transition-all active:scale-95"
              style={{ background: "var(--accent)", color: "#2D1B0E" }}>
              Export / Print Current Project
            </button>
          )}
        </div>

        {/* Pricing tiers */}
        {!isUnlocked && (
          <div className="space-y-4">
            <h2 className="font-bold text-base" style={{ color: "var(--text-primary)" }}>Choose Your Plan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(Object.entries(PRODUCTS) as [ProductTier, typeof PRODUCTS[ProductTier]][]).map(([tier, p]) => (
                <div key={tier} onClick={() => setSelectedTier(tier)}
                  className="p-5 rounded-2xl border cursor-pointer transition-all"
                  style={{
                    background: selectedTier === tier ? "var(--accent-dim)" : "var(--bg-card)",
                    borderColor: selectedTier === tier ? "var(--accent)" : "var(--border)",
                  }}>
                  {tier === "lifetime" && <div className="text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 inline-block" style={{ background: "var(--accent)", color: "#2D1B0E" }}>BEST VALUE</div>}
                  <p className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{p.name}</p>
                  <p className="text-2xl font-black mt-1" style={{ color: "var(--accent)" }}>${p.price}</p>
                  <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>GHS ₵{p.ghs.toFixed(2)} · One-time</p>
                  <p className="text-[10px] mt-2 leading-relaxed" style={{ color: "var(--text-secondary)" }}>{p.description}</p>
                </div>
              ))}
            </div>

            {/* Paystack payment */}
            <div className="rounded-2xl p-6 space-y-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" style={{ color: "var(--accent)" }} />
                <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>Pay with Paystack</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "var(--accent-dim)", color: "var(--accent)" }}>MTN MoMo · Telecel · Card · USSD</span>
              </div>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Secure payment via Paystack Ghana. Mobile Money auto-detected from your phone number.
                Lifetime access activated immediately upon payment confirmation.
              </p>
              {user ? (
                <button onClick={() => handlePaystack(selectedTier)} disabled={paymentLoading}
                  className="w-full py-3 font-bold text-sm rounded-xl transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
                  style={{ background: "var(--accent)", color: "#2D1B0E" }}>
                  <Smartphone className="w-4 h-4" />
                  {paymentLoading ? "Opening payment..." : `Pay $${PRODUCTS[selectedTier].price} (GHS ₵${PRODUCTS[selectedTier].ghs}) via Paystack`}
                </button>
              ) : (
                <p className="text-xs text-center py-2" style={{ color: "var(--text-muted)" }}>Please sign in to proceed with payment.</p>
              )}

              {/* Crypto fallback */}
              <div className="border-t pt-4 space-y-2" style={{ borderColor: "var(--border)" }}>
                <div className="flex items-center gap-2">
                  <Bitcoin className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
                  <p className="text-xs font-bold" style={{ color: "var(--text-secondary)" }}>Crypto Payment (BTC / SOL / BNB)</p>
                </div>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Send ${PRODUCTS[selectedTier].price} equivalent to our wallet. WhatsApp proof to{" "}
                  <a href="https://wa.me/233500119195" className="underline" style={{ color: "var(--accent)" }}>+233 500 119 195</a>.
                  We generate your unlock code within 2 hours.
                </p>
              </div>

              {/* Redeem code */}
              <div className="border-t pt-4 space-y-2" style={{ borderColor: "var(--border)" }}>
                <p className="text-xs font-bold" style={{ color: "var(--text-secondary)" }}>Have an unlock code?</p>
                <div className="flex gap-2">
                  <input value={redeemCode} onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
                    placeholder="e.g. RM-2026-X9K4" className="flex-1 px-3 py-2 rounded-lg text-xs outline-none"
                    style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
                  <button onClick={handleRedeem} disabled={isRedeeming}
                    className="px-4 py-2 font-bold text-xs rounded-lg transition-all active:scale-95"
                    style={{ background: "var(--accent)", color: "#2D1B0E" }}>
                    {isRedeeming ? "..." : "Redeem"}
                  </button>
                </div>
                {redeemMsg && <p className="text-xs" style={{ color: redeemMsg.startsWith("✓") ? "var(--success)" : "var(--danger)" }}>{redeemMsg}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Concierge tier */}
        <div className="rounded-2xl p-6 space-y-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5" style={{ color: "var(--accent)" }} />
            <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>Concierge Publishing — $149</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "var(--accent-dim)", color: "var(--accent)" }}>LAUNCHING SOON</span>
          </div>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Send us your manuscript → we handle formatting, cover design, and export delivery within 48 hours.
            WhatsApp + email delivery. Premium hands-on service.
          </p>
          {notifySent ? (
            <div className="flex items-center gap-2 text-xs" style={{ color: "var(--success)" }}>
              <CheckCircle className="w-4 h-4" /> We'll notify you at {notifyEmail} when Concierge launches!
            </div>
          ) : (
            <div className="flex gap-2">
              <input value={notifyEmail} onChange={(e) => setNotifyEmail(e.target.value)}
                placeholder="Your email address" className="flex-1 px-3 py-2 rounded-lg text-xs outline-none"
                style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
              <button onClick={handleNotifyConcierge}
                className="px-4 py-2 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all active:scale-95"
                style={{ background: "var(--accent-dim)", color: "var(--accent)", border: "1px solid var(--accent)" }}>
                <Bell className="w-3.5 h-3.5" /> Notify Me
              </button>
            </div>
          )}
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
          <Shield className="w-4 h-4" style={{ color: "var(--success)" }} />
          Secure payment processing via Paystack Ghana · Mobile Money & Cards accepted · Instant license activation
        </div>

        {/* Tester unlock */}
        {process.env.NODE_ENV !== "production" && (
          <div className="text-center">
            <button onClick={onForceUnlockFree} className="text-xs underline" style={{ color: "var(--text-muted)" }}>
              ⚡ Dev: Force Unlock (test mode)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
