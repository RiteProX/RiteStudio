/**
 * RitemastaPro - Yayra Floating AI Chatbot Assistant
 */
import { useState, useRef, useEffect } from "react";
import { ChatMessage, User } from "../types";
import { Bot, Send, X, User as UserIcon } from "lucide-react";

interface YayraProps {
  currentTab: string;
  onChangeTab: (tab: string) => void;
  onCreateProject?: (type: "ebook" | "presentation") => void;
  user: User | null;
}

export default function YayraChatbot({ currentTab, onChangeTab, onCreateProject, user }: YayraProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "intro",
      sender: "yayra",
      text: "👋 Akwaaba! I am Yayra, your premium RitemastaPro publishing assistant. I am here to help you write, format, apply templates, and export 10/10 masterbooks or presentations!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hovered, setHovered] = useState(false);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend || inputText;
    if (!messageText.trim()) return;

    if (!textToSend) {
      setInputText("");
    }

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: "user",
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Call modern endpoint to server-side Gemini
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          history: messages.map((m) => ({
            role: m.sender === "user" ? "user" : "model",
            text: m.text,
          })),
          currentTab,
          userName: user?.name || "Guest Author",
        }),
      });

      const data = await response.json();
      
      let yayraMsgText = data.response;
      
      if (data.functionCalls && data.functionCalls.length > 0) {
        for (const call of data.functionCalls) {
          if (call.name === "navigateTab") {
            const tabName = call.args.tabName;
            onChangeTab(tabName);
            yayraMsgText = yayraMsgText || `I've navigated you to the ${tabName} tab.`;
          } else if (call.name === "createProject") {
            const projectType = call.args.projectType;
            if (onCreateProject) {
               onCreateProject(projectType);
               yayraMsgText = yayraMsgText || `I've created a new ${projectType} project for you!`;
            } else {
               yayraMsgText = yayraMsgText || "To create a project, please go to the Home dashboard.";
            }
          }
        }
      }
      
      const yayraMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: "yayra",
        text: yayraMsgText || "I am processing your query. Please check your network connection.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, yayraMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: "yayra",
        text: "Apologies, I encountered a brief system hiccup. Could you please try again?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (topic: string, queryText: string) => {
    handleSendMessage(queryText);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Bot Chat Window */}
      {isOpen && (
        <div className="w-[360px] max-w-[calc(100vw-2rem)] h-[500px] bg-white rounded-2xl shadow-[0_10px_40px_rgba(45,27,14,0.15)] border border-[#E8E0D8] overflow-hidden flex flex-col mb-4 animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-[#2D1B0E] p-4 text-[#FDF8F0] flex justify-between items-center border-b border-[#4A3728]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-[#D4A853] overflow-hidden bg-[#FDF8F0]">
                <img
                  src="/Yayra_Avatar1.jpg"
                  alt="Yayra Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base leading-none tracking-wide text-white flex items-center gap-1.5">
                  Yayra AI <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                </h4>
                <p className="text-[0.65rem] text-[#D4A853] mt-1 font-sans font-medium tracking-wider uppercase">
                  Ghanaian Publishing Guru
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-[#4A3728] rounded text-[#B8A89A] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#FFFDFB]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "yayra" && (
                  <div className="w-8 h-8 rounded-full border border-[#D4A853] overflow-hidden bg-[#FDF8F0] shrink-0 mt-1">
                    <img
                      src="/Yayra_Avatar2.jpg"
                      alt="Yayra"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div
                  className={`max-w-[75%] p-3 rounded-2xl text-sm leading-relaxed ${
                    m.sender === "user"
                      ? "bg-[#D4A853] text-[#2D1B0E] font-medium rounded-tr-none shadow-sm"
                      : "bg-[#FDF8F0] text-[#2D1B0E] rounded-tl-none border border-[#E8E0D8]"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.text}</div>
                  <span className="text-[0.62rem] block mt-1.5 text-right opacity-60">
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 items-center text-xs text-[#8A7A6A] font-medium bg-[#FDF8F0] p-3 rounded-2xl w-fit border border-[#E8E0D8]">
                <span className="w-2 h-2 rounded-full bg-[#D4A853] animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 rounded-full bg-[#D4A853] animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 rounded-full bg-[#D4A853] animate-bounce"></span>
                <span className="ml-1 tracking-wide">Yayra is thinking...</span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Buttons Grid */}
          <div className="p-2 border-t border-[#E8E0D8] bg-[#FDF8F0] grid grid-cols-2 gap-1.5 text-xs">
            <button
              onClick={() => handleQuickQuestion("pricing", "Explain RitemastaPro's pricing, lifetime access, and payment instructions.")}
              className="p-1.5 bg-white border border-[#E8E0D8] text-[#2D1B0E] rounded-md text-left hover:border-[#D4A853] hover:bg-[#FFFDF9] transition-all font-medium truncate"
            >
              💰 $49 Access Pass
            </button>
            <button
              onClick={() => handleQuickQuestion("features", "What premium formats, editing tools, and offline modes are supported?")}
              className="p-1.5 bg-white border border-[#E8E0D8] text-[#2D1B0E] rounded-md text-left hover:border-[#D4A853] hover:bg-[#FFFDF9] transition-all font-medium truncate"
            >
              ✨ Platform Features
            </button>
            <button
              onClick={() => handleQuickQuestion("export", "Help me build an ebook with master format exports like pdf and epub.")}
              className="p-1.5 bg-white border border-[#E8E0D8] text-[#2D1B0E] rounded-md text-left hover:border-[#D4A853] hover:bg-[#FFFDF9] transition-all font-medium truncate"
            >
              📤 Export Formats
            </button>
            <button
              onClick={() => handleQuickQuestion("create", "Guide me step-by-step to create and write a professional book or synopsis.")}
              className="p-1.5 bg-white border border-[#E8E0D8] text-[#2D1B0E] rounded-md text-left hover:border-[#D4A853] hover:bg-[#FFFDF9] transition-all font-medium truncate"
            >
              ✍️ Book Guide help
            </button>
          </div>

          {/* Form Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 border-t border-[#E8E0D8] bg-white flex gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask Yayra anything..."
              disabled={isLoading}
              className="flex-1 px-3 py-2 border border-[#E8E0D8] rounded-full text-sm focus:outline-none focus:border-[#D4A853] focus:ring-1 focus:ring-[#D4A853] disabled:bg-gray-50"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="p-2 bg-[#D4A853] hover:bg-[#C49A42] text-[#2D1B0E] rounded-full transition-transform active:scale-95 disabled:opacity-50 disabled:hover:bg-[#D4A853] shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Circle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="w-16 h-16 rounded-full border-4 border-[#D4A853] shadow-[0_4px_25px_rgba(212,168,83,0.5)] bg-[#FDF8F0] overflow-hidden flex items-center justify-center transition-all duration-300 hover:scale-105"
        id="btn-yayra-chat"
      >
        <img
          src={
            hovered
              ? "/Yayra_Avatar2.jpg" // Hover/closeup view
              : "/Yayra_Avatar1.jpg" // Default portrait view
          }
          alt="Yayra Bot Avatar"
          className="w-full h-full object-cover block"
          onError={(e) => {
            // Safe fallback if images don't load
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <span className="absolute w-4 h-4 rounded-full bg-green-500 border-2 border-white top-1 right-1 animate-pulse"></span>
      </button>
    </div>
  );
}
