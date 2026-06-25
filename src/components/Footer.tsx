/**
 * RitemastaPro — Footer (Warm Dark Premium)
 */
interface FooterProps { onChangeTab: (tab: string) => void; }

function FooterLink({ label, tab, onClick }: { label: string; tab: string; onClick: (tab: string) => void }) {
  return (
    <li>
      <button onClick={() => onClick(tab)}
        className="text-sm text-left transition-all duration-200 group flex items-center gap-1.5 cursor-pointer"
        style={{ color: "var(--text-muted)" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold-main)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}>
        <span className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--gold-main)" }}>›</span>
        <span className="relative">
          {label}
          <span className="absolute -bottom-px left-0 w-0 h-px group-hover:w-full transition-all duration-300" style={{ background: "var(--gold-main)" }} />
        </span>
      </button>
    </li>
  );
}

export default function Footer({ onChangeTab }: FooterProps) {
  return (
    <footer style={{ background: "var(--brown-950)", borderTop: "1px solid var(--border-warm)" }} className="pt-14 pb-6 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10 pb-10" style={{ borderBottom: "1px solid var(--border-warm)" }}>

          {/* Brand */}
          <div className="space-y-5">
            <button onClick={() => onChangeTab("home")} className="flex items-center gap-3 group cursor-pointer">
              <img src="/logo.png" alt="RitemastaPro" className="h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105" />
              <div className="text-left">
                <p className="font-serif text-xl font-bold" style={{ color: "var(--text-warm)" }}>
                  Ritemasta<span style={{ color: "var(--gold-main)" }}>Pro</span>
                </p>
                <p className="text-[0.6rem] font-bold tracking-widest uppercase" style={{ color: "var(--gold-main)" }}>Publishing · Technology</p>
              </div>
            </button>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              The most affordable AI publishing platform for independent authors, educators, coaches, and creators worldwide. No recurring subscription.
            </p>
            <div className="space-y-2">
              <a href="mailto:ritemasta@gmail.com" className="flex items-center gap-2 text-xs transition-colors group" style={{ color: "var(--text-muted)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold-main)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}>
                <span>📧</span> ritemasta@gmail.com
              </a>
              <a href="https://wa.me/233208559409" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs transition-colors" style={{ color: "var(--text-muted)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold-main)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}>
                <span>💬</span> +233 208 559 409 (Support/WhatsApp)
              </a>
              <a href="https://wa.me/233500119195" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs transition-colors" style={{ color: "var(--text-muted)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold-main)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}>
                <span>📱</span> +233 500 119 195 (Telecel/WhatsApp)
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-5 pl-2" style={{ color: "var(--gold-main)", borderLeft: "2px solid var(--gold-main)" }}>Product</h4>
            <ul className="space-y-3 pl-3">
              <FooterLink label="Upload & Auto-Format" tab="upload" onClick={onChangeTab} />
              <FooterLink label="Book Editor" tab="editor" onClick={onChangeTab} />
              <FooterLink label="28 Layout Templates" tab="layout" onClick={onChangeTab} />
              <FooterLink label="Cover Designer" tab="design_studio" onClick={onChangeTab} />
              <FooterLink label="Magazine Builder" tab="magazine" onClick={onChangeTab} />
              <FooterLink label="iWrite Pro AI Studio" tab="iwrite_studio" onClick={onChangeTab} />
              <FooterLink label="EPUB · PDF · Markdown Export" tab="export" onClick={onChangeTab} />
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-5 pl-2" style={{ color: "var(--gold-main)", borderLeft: "2px solid var(--gold-main)" }}>Support</h4>
            <ul className="space-y-3 pl-3">
              <FooterLink label="Pricing & Access" tab="export" onClick={onChangeTab} />
              <FooterLink label="Contact Support" tab="contact" onClick={onChangeTab} />
              <FooterLink label="Save & Backup Projects" tab="save" onClick={onChangeTab} />
              <FooterLink label="About RitemastaPro" tab="about" onClick={onChangeTab} />
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-5 pl-2" style={{ color: "var(--gold-main)", borderLeft: "2px solid var(--gold-main)" }}>Company</h4>
            <ul className="space-y-3 pl-3">
              <FooterLink label="About the Founder" tab="about" onClick={onChangeTab} />
              <FooterLink label="Privacy Policy" tab="privacy" onClick={onChangeTab} />
              <FooterLink label="Terms of Service" tab="terms" onClick={onChangeTab} />
            </ul>
            <div className="mt-6 flex gap-2 flex-wrap pl-3">
              {[
                { label: "FB", url: "https://facebook.com/ritemasta", title: "Facebook" },
                { label: "X",  url: "https://x.com/ritemasta",        title: "X / Twitter" },
                { label: "IG", url: "https://instagram.com/ritemasta", title: "Instagram" },
                { label: "YT", url: "https://youtube.com/@LifePop",    title: "YouTube LifePop" },
              ].map((s) => (
                <a key={s.label} href={s.url} target="_blank" rel="noreferrer" title={s.title}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold transition-all duration-200"
                  style={{ background: "rgba(212,168,83,0.08)", color: "var(--text-muted)", border: "1px solid var(--border-warm)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--gold-main)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--gold-main)"; (e.currentTarget as HTMLElement).style.background = "rgba(212,168,83,0.12)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border-warm)"; (e.currentTarget as HTMLElement).style.background = "rgba(212,168,83,0.08)"; }}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Legal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 mb-6 text-xs" style={{ borderBottom: "1px solid var(--border-warm)" }}>
          <div>
            <span className="font-bold block mb-1" style={{ color: "var(--text-warm)" }}>Business Registration:</span>
            <span style={{ color: "var(--text-muted)" }}>BN360822013 · Ghana Business Names Act 1962</span>
          </div>
          <div>
            <span className="font-bold block mb-1" style={{ color: "var(--text-warm)" }}>TIN:</span>
            <span style={{ color: "var(--text-muted)" }}>P0002032406</span>
          </div>
        </div>

        <div className="text-center text-xs space-y-1" style={{ color: "var(--text-muted)" }}>
          <p>© 2026 RitemastaPro · Ritemasta Publications · All rights reserved.</p>
          <p>Made with ❤️ in Ghana · Built for authors, educators & creators worldwide.</p>
        </div>
      </div>
    </footer>
  );
}
