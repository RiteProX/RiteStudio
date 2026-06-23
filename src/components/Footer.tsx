/**
 * RitemastaPro - Footer
 *
 * Premium footer with:
 * - Gold underline slide-in effect on hover for all links
 * - Active press scale on click
 * - Visual cursor pointer on all interactive elements
 * - Smooth color transitions
 * - Social links with hover lift
 */

interface FooterProps {
  onChangeTab: (tab: string) => void;
}

function FooterLink({ label, tab, onClick }: { label: string; tab: string; onClick: (tab: string) => void }) {
  return (
    <li>
      <button
        onClick={() => onClick(tab)}
        className="
          relative text-sm text-[#B8A89A] text-left cursor-pointer
          hover:text-[#D4A853] transition-colors duration-200
          active:scale-95 active:text-[#E8C060]
          group flex items-center gap-1
        "
      >
        <span className="
          absolute -left-3 text-[#D4A853] opacity-0 group-hover:opacity-100
          transition-all duration-200 transform -translate-x-1 group-hover:translate-x-0
          text-[10px]
        ">›</span>
        <span className="relative">
          {label}
          <span className="
            absolute -bottom-px left-0 w-0 h-px bg-[#D4A853]
            group-hover:w-full transition-all duration-300
          " />
        </span>
      </button>
    </li>
  );
}

export default function Footer({ onChangeTab }: FooterProps) {
  return (
    <footer className="bg-[#1A0F08] text-[#B8A89A] pt-12 pb-6 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 border-b border-[#D4A853]/10 pb-8">

          {/* Brand Column */}
          <div className="flex flex-col gap-4">
            <button
              onClick={() => onChangeTab("home")}
              className="flex items-center gap-2 cursor-pointer group active:scale-95 transition-transform duration-150 w-fit"
            >
              <img
                src="/logo.png"
                alt="RitemastaPro Logo"
                className="h-8 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              />
              <div className="flex flex-col leading-none text-left">
                <span className="font-serif text-xl font-bold">
                  <span className="animate-wavy-shine">Ritemasta</span>
                  <span className="text-[#D4A853]">Pro</span>
                </span>
                <span className="text-[#D4A853] text-[0.6rem] tracking-wider uppercase">Publishing · Technology</span>
              </div>
            </button>

            <p className="text-sm leading-relaxed max-w-xs mt-1">
              The most affordable, feature-rich AI publishing platform for independent authors, educators, coaches, and creators worldwide. No recurring subscription.
            </p>

            <div className="text-xs leading-relaxed flex flex-col gap-1.5 text-[#FDF8F0]/80">
              <a
                href="mailto:ritemasta@gmail.com"
                className="hover:text-[#D4A853] transition-colors duration-200 group flex items-center gap-1.5"
              >
                <span>📧</span>
                <span className="relative">
                  ritemasta@gmail.com
                  <span className="absolute -bottom-px left-0 w-0 h-px bg-[#D4A853] group-hover:w-full transition-all duration-300" />
                </span>
              </a>
              <a
                href="https://wa.me/233500119195"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#D4A853] transition-colors duration-200 group flex items-center gap-1.5"
              >
                <span>📱</span>
                <span className="relative">
                  +233 500 119 195 (Telecel/WhatsApp)
                  <span className="absolute -bottom-px left-0 w-0 h-px bg-[#D4A853] group-hover:w-full transition-all duration-300" />
                </span>
              </a>
              <a
                href="https://wa.me/233208559409"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#D4A853] transition-colors duration-200 group flex items-center gap-1.5"
              >
                <span>📱</span>
                <span className="relative">
                  +233 208 559 409 (MTN/WhatsApp)
                  <span className="absolute -bottom-px left-0 w-0 h-px bg-[#D4A853] group-hover:w-full transition-all duration-300" />
                </span>
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-sans text-xs uppercase tracking-widest text-[#FDF8F0] mb-4 font-bold border-l-2 border-[#D4A853] pl-2">
              Product
            </h4>
            <ul className="flex flex-col gap-2.5 pl-3">
              <FooterLink label="Upload & Auto-Format" tab="upload" onClick={onChangeTab} />
              <FooterLink label="Book Editor" tab="editor" onClick={onChangeTab} />
              <FooterLink label="28 Layout Templates" tab="layout" onClick={onChangeTab} />
              <FooterLink label="Cover Designer" tab="design_studio" onClick={onChangeTab} />
              <FooterLink label="Magazine Builder" tab="magazine" onClick={onChangeTab} />
              <FooterLink label="iWrite Pro AI Studio" tab="iwrite_studio" onClick={onChangeTab} />
              <FooterLink label="EPUB · PDF · Markdown Export" tab="export" onClick={onChangeTab} />
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-sans text-xs uppercase tracking-widest text-[#FDF8F0] mb-4 font-bold border-l-2 border-[#D4A853] pl-2">
              Support
            </h4>
            <ul className="flex flex-col gap-2.5 pl-3">
              <FooterLink label="Customer Support" tab="contact" onClick={onChangeTab} />
              <FooterLink label="FAQ" tab="contact" onClick={onChangeTab} />
              <FooterLink label="Save & Backup Projects" tab="save" onClick={onChangeTab} />
              <FooterLink label="Pricing & Access" tab="export" onClick={onChangeTab} />
              <FooterLink label="Admin Console" tab="admin" onClick={onChangeTab} />
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-sans text-xs uppercase tracking-widest text-[#FDF8F0] mb-4 font-bold border-l-2 border-[#D4A853] pl-2">
              Company
            </h4>
            <ul className="flex flex-col gap-2.5 pl-3">
              <FooterLink label="About the Founder" tab="about" onClick={onChangeTab} />
              <FooterLink label="Ritemasta Ecosystem" tab="about" onClick={onChangeTab} />
              <FooterLink label="Privacy Policy" tab="privacy" onClick={onChangeTab} />
              <FooterLink label="Terms of Service" tab="terms" onClick={onChangeTab} />
            </ul>

            {/* Social links */}
            <div className="mt-6 flex gap-3 flex-wrap">
              {[
                { label: "FB", url: "https://facebook.com/ritemasta", title: "Facebook" },
                { label: "X", url: "https://x.com/ritemasta", title: "X / Twitter" },
                { label: "IG", url: "https://instagram.com/ritemasta", title: "Instagram" },
                { label: "YT", url: "https://youtube.com/@LifePop", title: "YouTube LifePop" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  title={s.title}
                  className="
                    w-7 h-7 rounded-lg border border-[#D4A853]/30
                    flex items-center justify-center text-[10px] font-bold
                    text-[#D4A853]/70 hover:text-[#D4A853] hover:border-[#D4A853]
                    hover:bg-[#D4A853]/10 hover:-translate-y-0.5
                    transition-all duration-200 active:scale-90
                  "
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Legal strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/10 pt-6 mb-6 text-xs text-[#8A7A6A]">
          <div>
            <span className="text-[#FDF8F0] font-bold block mb-1">Business Registration No:</span>
            <span className="text-sm font-semibold text-[#B8A89A]">BN360822013</span>
            <span className="block mt-0.5 opacity-80">Registered under the Ghana Business Names Act 1962, No. 151</span>
          </div>
          <div>
            <span className="text-[#FDF8F0] font-bold block mb-1">Taxpayer Identification Number (TIN):</span>
            <span className="text-sm font-semibold text-[#B8A89A]">P0002032406</span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="text-center text-xs mt-4 text-[#6A5A4A] border-t border-white/5 pt-4">
          <p>© 2026 RitemastaPro · Ritemasta Publications · All rights reserved.</p>
          <p className="mt-1">Made with ❤️ in Ghana · Built for authors, educators & creators worldwide.</p>
        </div>
      </div>
    </footer>
  );
}
