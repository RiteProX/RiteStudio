/**
 * RitemastaPro - Static Pages: About, Privacy, Terms
 * Fixed: Regional & Human Geography (not Atlas), founder bio corrected
 */
import { BookOpen, Globe, Leaf, Flame, Youtube, Mail, Phone } from "lucide-react";

interface StaticPagesProps { page: string; onChangeTab: (tab: string) => void; }

const WORKS = [
  { title: "Regional & Human Geography for Senior High Schools", cat: "Academic Textbook", publisher: "Ritemasta Publications / Aki-Ola", year: "2022", icon: "🌍" },
  { title: "Social Studies for Junior High Schools", cat: "Academic Textbook", publisher: "Aki-Ola Publications", year: "2021", icon: "📘" },
  { title: "SENT — A Call to Purpose", cat: "Motivational / Faith", publisher: "Ritemasta Publications", year: "2024", icon: "✉️" },
  { title: "Chess Out — Leave the Ordinary, Return Different", cat: "Motivational", publisher: "Ritemasta Publications", year: "2024", icon: "♟️" },
  { title: "Stop Watching — The Performer's Manifesto", cat: "Motivational", publisher: "Ritemasta Publications", year: "2025", icon: "🎯" },
  { title: "The Bitter Leaf & Coconut Water Protocol", cat: "Wellness Protocol", publisher: "Blemafoods GH / Bob Ashley", year: "2024", icon: "🌿" },
  { title: "The Bitter Leaf Lifestyle: 30-Day Guide", cat: "Wellness / Nutrition", publisher: "Blemafoods GH / Bob Ashley", year: "2025", icon: "🍃" },
];

export default function StaticPages({ page, onChangeTab }: StaticPagesProps) {
  if (page === "about") return (
    <div className="min-h-screen py-12 px-4" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Hero */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
            style={{ background: "var(--accent-dim)", color: "var(--accent)", border: "1px solid var(--accent)" }}>
            About Ritemasta
          </div>
          <h1 className="section-title text-4xl">Publishing Technology<br/>Built from Africa</h1>
          <p className="text-base max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            RitemastaPro is part of the Ritemasta Ecosystem — a publishing, educational technology, creative brand media, and interactive innovation platform founded and built by Robert Ashley Nikoi from Koforidua, Ghana.
          </p>
        </div>

        {/* Founder */}
        <div className="rounded-2xl p-8 space-y-6" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <img src="/Founder_Robert1.jpg" alt="Robert Ashley Nikoi"
              className="w-36 h-auto object-contain shrink-0 mx-auto md:mx-0 rounded-xl" />
            <div className="space-y-3">
              <div>
                <h2 className="font-serif text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Robert Ashley Nikoi</h2>
                <p className="text-sm font-semibold" style={{ color: "var(--accent)" }}>Founder & CEO — Creator & Directing Builder</p>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Robert Ashley Nikoi is an accomplished author, publication designer, curriculum developer, master food formulation scientist, and technology builder. His strategic portfolio spans commercial textbook writing, health protocol manuals, wellness books, digital product design, and Web3/blockchain ventures.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                A University of Cape Coast graduate (2002) of Ga royal heritage, Robert brings over 30 years of culinary arts expertise and deep food science knowledge to his work at Blemafoods GH / ZiPaPa Raw Naturals. He has real-world experience organising magazine layouts for <em>Ghana Business & Finance Magazine</em> (African Business Media), prepress commercial printing orchestration, and authorship of SHS academic textbooks — all of which directly inform RitemastaPro's design.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Author", "Publisher", "Food Scientist", "Educator", "Tech Builder", "Ga Royal Heritage"].map(tag => (
                  <span key={tag} className="text-[10px] px-2.5 py-1 rounded-full font-semibold"
                    style={{ background: "var(--accent-dim)", color: "var(--accent)" }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Published Works */}
        <div className="space-y-4">
          <h2 className="font-serif text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Published Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {WORKS.map((w) => (
              <div key={w.title} className="p-4 rounded-xl card-hover" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{w.icon}</span>
                  <div>
                    <p className="text-sm font-bold leading-tight" style={{ color: "var(--text-primary)" }}>{w.title}</p>
                    <p className="text-[10px] mt-1" style={{ color: "var(--accent)" }}>{w.cat}</p>
                    <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{w.publisher} · {w.year}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ventures */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: <Leaf className="w-5 h-5" />, title: "Blemafoods GH / ZiPaPa Raw Naturals", desc: "Premium natural spices, food powders, teas and wellness products from Ghana. FDA-registered. 12,900+ units sold.", link: "https://blemafoods-gh-digita-ubng.bolt.host" },
            { icon: <Flame className="w-5 h-5" />, title: "Rhema Fire Generation", desc: "Faith community and spiritual content. Guest ministry, sermon series, inspirational books and community leadership.", link: null },
            { icon: <Youtube className="w-5 h-5" />, title: "LifePop YouTube Channel", desc: "Ghana lifestyle, culture and travel content. Faceless content model using Ghanaian themes and local storytelling.", link: "https://youtube.com/@LifePop" },
          ].map((v) => (
            <div key={v.title} className="p-5 rounded-xl space-y-2 card-hover" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <span style={{ color: "var(--accent)" }}>{v.icon}</span>
              <h3 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{v.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{v.desc}</p>
              {v.link && <a href={v.link} target="_blank" rel="noreferrer" className="text-xs font-semibold underline" style={{ color: "var(--accent)" }}>Visit →</a>}
            </div>
          ))}
        </div>

        {/* Contact strip */}
        <div className="rounded-2xl p-6 flex flex-wrap gap-4 items-center justify-between" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div>
            <p className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>Get in Touch</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Koforidua, Ghana · Est. 2021</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="mailto:ritemasta@gmail.com" className="flex items-center gap-1.5 text-xs font-semibold transition-colors hover:underline" style={{ color: "var(--accent)" }}>
              <Mail className="w-3.5 h-3.5" /> ritemasta@gmail.com
            </a>
            <a href="tel:+233208559409" className="flex items-center gap-1.5 text-xs font-semibold transition-colors hover:underline" style={{ color: "var(--accent)" }}>
              <Phone className="w-3.5 h-3.5" /> +233 208 559 409
            </a>
          </div>
          <button onClick={() => onChangeTab("contact")} className="btn-primary text-xs py-2 px-4">Contact Us</button>
        </div>

        {/* Legal */}
        <div className="text-center text-xs space-y-1" style={{ color: "var(--text-muted)" }}>
          <p>Business Registration: BN360822013 · TIN: P0002032406</p>
          <p>Registered under the Ghana Business Names Act 1962, No. 151</p>
        </div>
      </div>
    </div>
  );

  if (page === "privacy") return (
    <div className="min-h-screen py-12 px-4" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="section-title text-3xl mb-2">Privacy Policy</h1>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>Last updated: June 2026 · Ritemasta Publications, Koforidua, Ghana</p>
        </div>
        {[
          { title: "Data We Collect", body: "We collect your name, email address, and hashed password when you register. We store your project data (book content, layout settings, chapter text) on our servers to enable saving and export. We do not sell your data to third parties." },
          { title: "Payment Data", body: "Payments are processed by Paystack Ghana. We do not store your card or Mobile Money details. Paystack handles all payment data under their own security standards. We store only transaction references for record-keeping." },
          { title: "Cookies & Local Storage", body: "We use browser localStorage to store your theme preference, font size, and session token (if you select Remember Me). No tracking cookies or advertising pixels are used." },
          { title: "Your Content", body: "All manuscripts, chapters, designs, and exports you create belong to you. We do not use your content to train AI models. Your content is stored on Render.com's servers (USA) with standard security practices." },
          { title: "Third-Party Services", body: "We use Google Gemini API for AI features (your prompts are sent to Google's servers per their privacy policy). We use Paystack for payments. We do not integrate with advertising networks or social media tracking." },
          { title: "Your Rights", body: "You may request deletion of your account and all associated data by emailing ritemasta@gmail.com. We will process deletion requests within 14 days." },
          { title: "Contact", body: "For privacy questions: ritemasta@gmail.com · +233 208 559 409 · Koforidua, Ghana" },
        ].map((s) => (
          <div key={s.title} className="space-y-2">
            <h2 className="font-bold text-base" style={{ color: "var(--text-primary)" }}>{s.title}</h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );

  if (page === "terms") return (
    <div className="min-h-screen py-12 px-4" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="section-title text-3xl mb-2">Terms of Service</h1>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>Last updated: June 2026 · Ritemasta Publications, Koforidua, Ghana</p>
        </div>
        {[
          { title: "Acceptance", body: "By creating an account on RitemastaPro, you agree to these terms. If you do not agree, please do not use the platform." },
          { title: "License & Access", body: "Free accounts may create projects with limited export options. Lifetime Access Pass ($49) grants permanent access to all export formats and templates with a single one-time payment. No recurring subscription applies. Your license is tied to your account and is non-transferable." },
          { title: "Acceptable Use", body: "You may not use RitemastaPro to create content that is illegal, defamatory, plagiarised, or violates third-party intellectual property rights. You are solely responsible for the content you publish using this platform." },
          { title: "Your Content", body: "You retain full ownership of all content you create. By using RitemastaPro, you grant us a limited licence to store and process your content solely for the purpose of providing the service." },
          { title: "AI-Generated Content", body: "Content generated by Yayra AI or iWrite Pro using the Gemini API is provided as a starting point. You are responsible for reviewing, editing, and verifying AI-generated content before publication. We make no guarantees about accuracy." },
          { title: "Payments & Refunds", body: "All payments are one-time and non-refundable once a license has been activated. If you experience a technical issue preventing you from accessing your paid features, contact ritemasta@gmail.com within 7 days of payment." },
          { title: "Service Availability", body: "We aim for high availability but do not guarantee uninterrupted service. The platform is hosted on Render.com and may experience occasional downtime for maintenance." },
          { title: "Governing Law", body: "These terms are governed by the laws of the Republic of Ghana. Disputes shall be resolved in the courts of the Eastern Region, Ghana." },
          { title: "Contact", body: "ritemasta@gmail.com · +233 208 559 409 · Koforidua, Eastern Region, Ghana" },
        ].map((s) => (
          <div key={s.title} className="space-y-2">
            <h2 className="font-bold text-base" style={{ color: "var(--text-primary)" }}>{s.title}</h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return null;
}
