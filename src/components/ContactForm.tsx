/**
 * RitemastaPro - Contact Support Page with Frictions-free Forms & FAQs
 */
import React, { useState } from "react";
import { Mail, Phone, MessageSquare, HelpCircle, Check, Send } from "lucide-react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("general");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => {
      setName("");
      setEmail("");
      setMessage("");
      setSuccess(false);
      alert("✓ Message sent successfully! Robert Ashley Nikoi or the Ritemasta team will reply inside 24 hours.");
    }, 1500);
  };

  const faqs = [
    { q: "Is there a monthly or annual subscription fee?", a: "No! We have reduced prices to a simple, low-cost one-time fee of only $25. You receive absolute lifetime access to all PDF, EPUB, and MOBI format editors forever." },
    { q: "Can I import standard Word docx files?", a: "Yes. Simply drop your DOCX manuscripts on our 'Upload' tab, and our automated parser preserves text formats while organizing your chapter nodes in seconds." },
    { q: "Which formats are available for publication exports?", a: "We support fully compliant EPUB files for Kindle/Apple, print-ready PDF configurations with running headers and page numbers, Word DOC files, flat HTML page designs, and structured raw XML streams." },
    { q: "Which mobile money and payment channels are available in Africa?", a: "We accept secure payments through MTN Mobile Money (xxxx) and Telecel Mobile Money (+233 500 119 195), as well as Sol, Bitcoin, and Ether cryptocurrency networks." },
    { q: "Does RitemastaPro claim any ownership over my manuscripts?", a: "No! All copyright, original texts, and media files remain 100% your private intellectual property. RitemastaPro acts only as your helpful formatting software tool." },
  ];

  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  return (
    <div className="bg-[#FFFDFB] min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D1B0E] mb-2">
            📞 Get Assistance &amp; RitemastaPro Support
          </h1>
          <p className="text-sm text-[#8A7A6A] max-w-xl mx-auto">
            Have layout questions? Need an immediate active passcode generated for mobile money? Our team is available 24/7 via WhatsApp or message form.
          </p>
        </div>

        {/* Contact info grid cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border rounded-xl p-4 text-center">
            <span className="text-2xl block mb-1">📧</span>
            <span className="text-xs font-bold text-[#2D1B0E] block mb-1">Email Desk</span>
            <a href="mailto:ritemasta@gmail.com" className="text-xs text-[#D4A853] hover:underline font-semibold block">
              ritemasta@gmail.com
            </a>
          </div>
          <div className="bg-white border rounded-xl p-4 text-center">
            <span className="text-2xl block mb-1">💬</span>
            <span className="text-xs font-bold text-[#2D1B0E] block mb-1">WhatsApp Channel</span>
            <a href="https://wa.me/233500119195" target="_blank" rel="noreferrer" className="text-xs text-[#D4A853] hover:underline font-semibold block">
              +233 500 119 195
            </a>
          </div>
          <div className="bg-white border rounded-xl p-4 text-center">
            <span className="text-2xl block mb-1">📱</span>
            <span className="text-xs font-bold text-[#2D1B0E] block mb-1">Alternative hotline</span>
            <a href="tel:+233208559409" className="text-xs text-[#D4A853] hover:underline font-semibold block">
              +233 208 559 409
            </a>
          </div>
          <div className="bg-white border rounded-xl p-4 text-center">
            <span className="text-2xl block mb-1">🏢</span>
            <span className="text-xs font-bold text-[#2D1B0E] block mb-1">Business Registration</span>
            <span className="text-[10px] text-[#8C7A6D] block font-semibold leading-relaxed">
              Ghana BN360822013 / TIN: P0002032406
            </span>
          </div>
        </div>

        {/* Dynamic Contact Form & FAQs split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {/* Form Side */}
          <div className="bg-white border border-[#E8E0D8] p-5 rounded-2xl">
            <h3 className="font-serif text-sm font-bold text-[#2D1B0E] border-b pb-2 mb-4 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-[#D4A853]" /> Send Us Direct Message
            </h3>

            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#2D1B0E] mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Robert Ashley Nikoi"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#D4A853]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D1B0E] mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#D4A853]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D1B0E] mb-1">Select General Topic</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2 bg-white border border-[#E8E0D8] rounded text-xs focus:outline-none focus:border-[#D4A853]"
                >
                  <option value="general">General Enquiry</option>
                  <option value="technical">Technical Layout Assistance</option>
                  <option value="sales">Sales &amp; MoMo Pass Code redemption</option>
                  <option value="partnership">Ecosystem Partnerships</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D1B0E] mb-1">How can we help? *</label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Feel free to outline formatting layouts or code generation prompts..."
                  className="w-full h-32 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#D4A853]"
                />
              </div>

              <button
                type="submit"
                disabled={success}
                className="w-full py-2.5 bg-[#D4A853] hover:bg-[#C49A42] text-[#2D1B0E] font-bold text-xs rounded-full flex items-center justify-center gap-1.5 cursor-pointer shadow hover:shadow-md transition-shadow"
              >
                <Send className="w-4.5 h-4.5" /> Send Message
              </button>
            </form>
          </div>

          {/* FAQs Side */}
          <div className="bg-white border border-[#E8E0D8] p-5 rounded-2xl space-y-4">
            <h3 className="font-serif text-sm font-bold text-[#2D1B0E] border-b pb-2 flex items-center gap-1.5">
              <HelpCircle className="w-5 h-5 text-[#D4A853]" /> Frequently Asked Questions
            </h3>

            <div className="space-y-3">
              {faqs.map((f, i) => (
                <div
                  key={i}
                  className="border-b last:border-b-0 pb-3"
                  onClick={() => setOpenFaqIdx(openFaqIdx === i ? null : i)}
                >
                  <button className="w-full text-left font-serif font-bold text-xs text-[#2D1B0E] hover:text-[#D4A853] flex justify-between items-center py-1.5 cursor-pointer">
                    <span>{f.q}</span>
                    <span className="text-[#D4A853] shrink-0 font-bold ml-2">
                      {openFaqIdx === i ? "−" : "+"}
                    </span>
                  </button>
                  {openFaqIdx === i && (
                    <p className="text-[10px] text-[#4A3728] mt-1.5 leading-relaxed bg-[#FDF8F0] p-3 rounded-lg border border-[#E8E0D8]">
                      {f.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
