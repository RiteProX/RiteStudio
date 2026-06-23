/**
 * RitemastaPro - Interactive User Dashboard and Account Settings
 */
import React, { useState } from "react";
import { User, Project } from "../types";
import { Book, Plus, Trash2, Edit, CreditCard, Shield, Sliders, Smartphone, AlertCircle, Sparkles, Check, Database } from "lucide-react";

interface DashboardProps {
  user: User;
  onSelectProject: (proj: Project) => void;
  onDeleteProject: (id: string) => void;
  onCreateProject: (type: Project["type"]) => void;
  projects: Project[];
  onRedeemCode: (code: string) => Promise<boolean>;
  onUpdateUserName: (newName: string) => Promise<void>;
}

export default function Dashboard({
  user,
  onSelectProject,
  onDeleteProject,
  onCreateProject,
  projects,
  onRedeemCode,
  onUpdateUserName,
}: DashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<"projects" | "settings">("projects");
  const [newName, setNewName] = useState(user.name);
  const [couponCode, setCouponCode] = useState("");
  const [settingsMsg, setSettingsMsg] = useState("");
  const [settingsError, setSettingsError] = useState("");
  const [codeMsg, setCodeMsg] = useState("");
  const [codeError, setCodeError] = useState("");

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsMsg("");
    setSettingsError("");
    try {
      if (!newName.trim()) throw new Error("Name cannot be empty");
      await onUpdateUserName(newName);
      setSettingsMsg("Profile details updated successfully!");
    } catch (err: any) {
      setSettingsError(err.message || "Failed to update profile settings");
    }
  };

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    setCodeMsg("");
    setCodeError("");
    try {
      if (!couponCode.trim()) throw new Error("Please enter a valid code format");
      const success = await onRedeemCode(couponCode);
      if (success) {
        setCodeMsg("Congratulations! $25 Lifetime Access Pass is now active!");
        setCouponCode("");
      } else {
        setCodeError("Invalid or already redeemed Access Code. Check our admin panel or support desk.");
      }
    } catch (err: any) {
      setCodeError(err.message || "Redeem validation failed");
    }
  };

  // Safe category icons helper
  const getProjectIcon = (type: Project["type"]) => {
    switch (type) {
      case "ebook": return "📖";
      case "POD": return "🖨️";
      case "academic": return "📚";
      case "magazine": return "📰";
      case "receipt": return "🧾";
      case "presentation": return "🖥️";
      case "synopsis": return "📝";
      default: return "📄";
    }
  };

  return (
    <div className="bg-[#FFFDFB] min-height-screen py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Banner */}
        <div className="bg-[#2D1B0E] p-6 sm:p-8 rounded-2xl text-[#FDF8F0] shadow-md border-b-4 border-[#D4A853] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl">👋 Welcome,</span>
              <span className="text-xl sm:text-2xl font-bold font-serif">{user.name}</span>
            </div>
            <p className="text-xs text-[#B8A89A] mt-1.5 max-w-xl">
              RitemastaPro has synced with the sandbox server database. All your work persists automatically in local MongoDB simulation collections.
            </p>
          </div>
          <div className="bg-[#4A3728] px-4 py-2 rounded-xl border border-[#D4A853]/30 shrink-0">
            <span className="text-[0.65rem] text-[#D4A853] block font-bold uppercase tracking-widest leading-none">Account Status</span>
            <span className="text-sm font-bold text-white mt-1 block">
              {user.isUnlocked ? "✓ Lifetime Access Active" : "⚠️ Trial Account (Exports Locked)"}
            </span>
          </div>
        </div>

        {/* Sub Tabs Controls */}
        <div className="flex border-b border-[#E8E0D8] mb-6 gap-2">
          <button
            onClick={() => setActiveSubTab("projects")}
            className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeSubTab === "projects"
                ? "border-[#D4A853] text-[#2D1B0E]"
                : "border-transparent text-[#8A7A6A] hover:text-[#2D1B0E]"
            }`}
          >
            <Book className="w-4 h-4" /> My Publications & Projects ({projects.length})
          </button>
          <button
            onClick={() => setActiveSubTab("settings")}
            className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeSubTab === "settings"
                ? "border-[#D4A853] text-[#2D1B0E]"
                : "border-transparent text-[#8A7A6A] hover:text-[#2D1B0E]"
            }`}
          >
            <Sliders className="w-4 h-4" /> Personalized Settings & Pricing Pass
          </button>
        </div>

        {/* TAB 1: PROJECTS */}
        {activeSubTab === "projects" && (
          <div>
            {/* Creator Tools Grid */}
            <div className="mb-8">
              <h3 className="font-serif text-lg font-bold text-[#2D1B0E] mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#D4A853]" /> Launch New Author Project
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                <button
                  onClick={() => onCreateProject("ebook")}
                  className="bg-white border hover:border-[#D4A853] p-4 text-center rounded-xl hover:shadow-md transition-all flex flex-col items-center group cursor-pointer"
                >
                  <span className="text-3xl group-hover:scale-110 transition-transform">📖</span>
                  <span className="text-xs font-bold text-[#2D1B0E] mt-2 block">10/10 Ebook</span>
                </button>
                <button
                  onClick={() => onCreateProject("POD")}
                  className="bg-white border hover:border-[#D4A853] p-4 text-center rounded-xl hover:shadow-md transition-all flex flex-col items-center group cursor-pointer"
                >
                  <span className="text-3xl group-hover:scale-110 transition-transform">🗂️</span>
                  <span className="text-xs font-bold text-[#2D1B0E] mt-2 block">POD Print Book</span>
                </button>
                <button
                  onClick={() => onCreateProject("academic")}
                  className="bg-white border hover:border-[#D4A853] p-4 text-center rounded-xl hover:shadow-md transition-all flex flex-col items-center group cursor-pointer"
                >
                  <span className="text-3xl group-hover:scale-110 transition-transform">📚</span>
                  <span className="text-xs font-bold text-[#2D1B0E] mt-2 block">Academic Book</span>
                </button>
                <button
                  onClick={() => onCreateProject("magazine")}
                  className="bg-white border hover:border-[#D4A853] p-4 text-center rounded-xl hover:shadow-md transition-all flex flex-col items-center group cursor-pointer"
                >
                  <span className="text-3xl group-hover:scale-110 transition-transform">📰</span>
                  <span className="text-xs font-bold text-[#2D1B0E] mt-2 block">Premium Magazine</span>
                </button>
                <button
                  onClick={() => onCreateProject("receipt")}
                  className="bg-white border hover:border-[#D4A853] p-4 text-center rounded-xl hover:shadow-md transition-all flex flex-col items-center group cursor-pointer"
                >
                  <span className="text-3xl group-hover:scale-110 transition-transform">🧾</span>
                  <span className="text-xs font-bold text-[#2D1B0E] mt-2 block">Premium Receipt</span>
                </button>
                <button
                  onClick={() => onCreateProject("presentation")}
                  className="bg-white border hover:border-[#D4A853] p-4 text-center rounded-xl hover:shadow-md transition-all flex flex-col items-center group cursor-pointer"
                >
                  <span className="text-3xl group-hover:scale-110 transition-transform">🖥️</span>
                  <span className="text-xs font-bold text-[#2D1B0E] mt-2 block">AI Presentation</span>
                </button>
                <button
                  onClick={() => onCreateProject("synopsis")}
                  className="bg-white border hover:border-[#D4A853] p-4 text-center rounded-xl hover:shadow-md transition-all flex flex-col items-center group cursor-pointer"
                >
                  <span className="text-3xl group-hover:scale-110 transition-transform">📝</span>
                  <span className="text-xs font-bold text-[#2D1B0E] mt-2 block">Book Synopsis</span>
                </button>
              </div>
            </div>

            {/* Offline Functionality Banner */}
            <div className="bg-[#FDF8F0] p-4 border border-[#E8E0D8] rounded-xl flex items-center gap-3 mb-6">
              <Database className="w-6 h-6 text-[#D4A853]" />
              <div className="text-xs text-[#2D1B0E]">
                <strong className="block font-bold">Offline-First Lightning-Fast Architecture Active</strong>
                Your drafts, cover settings, templates, and margins save locally instantly (0.1ms load speed) and auto-sync with the server database. Access everything instantly!
              </div>
            </div>

            {/* Project List */}
            {projects.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-[#E8E0D8] rounded-2xl p-10 text-center">
                <Book className="w-12 h-12 text-[#E8E0D8] mx-auto mb-3" />
                <h4 className="font-serif font-bold text-lg text-[#2D1B0E] mb-1">No Active Projects Found</h4>
                <p className="text-xs text-[#8A7A6A] mb-4 max-w-sm mx-auto">
                  Get ahead of Vellum, Atticus, and Reedsy by formatting your first premium book! Select any project type above to begin editing.
                </p>
                <button
                  onClick={() => onCreateProject("ebook")}
                  className="px-4 py-2 bg-[#D4A853] text-[#2D1B0E] font-bold text-xs rounded-full hover:bg-[#C49A42]"
                >
                  Create Ebook Project
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="bg-white border border-[#E8E0D8] hover:border-[#D4A853] rounded-xl overflow-hidden hover:shadow-md transition-all flex flex-col p-5"
                    id={`project-${proj.id}`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#FDF8F0] border border-[#E8E0D8] text-xl shrink-0">
                        {getProjectIcon(proj.type)}
                      </div>
                      <span className="text-[0.62rem] font-bold text-[#D4A853] uppercase border border-[#D4A853]/30 px-2 py-0.5 rounded-full">
                        {proj.type}
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-base text-[#2D1B0E] line-clamp-1 mb-1">
                      {proj.metadata.title}
                    </h4>
                    <p className="text-xs text-[#8A7A6A] font-medium mb-3">
                      By {proj.metadata.author || "Unknown Author"}
                    </p>

                    <div className="text-[0.65rem] text-[#8A7A6A] border-t border-[#E8E0D8] pt-2 mb-4 mt-auto flex justify-between">
                      <span>Chapters: {proj.chapters.length}</span>
                      <span>Saved: {new Date(proj.updatedAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => onSelectProject(proj)}
                        className="flex-1 py-1.5 bg-[#FDF8F0] hover:bg-[#D4A853]/10 text-xs font-bold text-[#2D1B0E] border border-[#E8E0D8] rounded-md transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        id={`btn-edit-${proj.id}`}
                      >
                        <Edit className="w-3.5 h-3.5" /> Edit Project
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this project? Your changes will be wiped from the browser database.")) {
                            onDeleteProject(proj.id);
                          }
                        }}
                        className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-md border border-red-200 transition-colors cursor-pointer"
                        title="Delete Project"
                        id={`btn-delete-${proj.id}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SETTINGS & PRICING */}
        {activeSubTab === "settings" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Account Settings Forms */}
            <div className="bg-white border border-[#E8E0D8] p-6 rounded-2xl">
              <h3 className="font-serif text-lg font-bold text-[#2D1B0E] mb-4 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#D4A853]" /> Personalized Profile Settings
              </h3>

              {settingsMsg && (
                <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700 text-xs font-semibold rounded flex items-center gap-1">
                  <Check className="w-4 h-4 shrink-0" />
                  {settingsMsg}
                </div>
              )}
              {settingsError && (
                <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-semibold rounded">
                  {settingsError}
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#2D1B0E] mb-1">Author / Name</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E8E0D8] rounded-lg text-sm focus:outline-none focus:border-[#D4A853]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#2D1B0E] mb-1">Email (ReadOnly)</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-3 py-2 border border-[#E8E0D8] bg-gray-50 rounded-lg text-sm text-[#8A7A6A]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2D1B0E] hover:bg-[#4A3728] text-white hover:text-[#FDF8F0] font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Save Profile Settings
                </button>
              </form>
            </div>

            {/* Lifetime Access redeem Code */}
            <div className="bg-white border border-[#E8E0D8] p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#2D1B0E] mb-1 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#D4A853]" /> Lifetime Access pass redeem
                </h3>
                <p className="text-xs text-[#8A7A6A] mb-4">
                  We have reduced fees to a simple **one-time $25 Access Pass** (removing all monthly subscription models) so that everyone can publishing premium content!
                </p>

                {codeMsg && (
                  <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700 text-xs font-semibold rounded flex items-center gap-1">
                    <Check className="w-4 h-4 shrink-0" />
                    {codeMsg}
                  </div>
                )}
                {codeError && (
                  <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-semibold rounded">
                    {codeError}
                  </div>
                )}

                {user.isUnlocked ? (
                  <div className="bg-green-50 p-4 border border-green-200 rounded-xl flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-600 shrink-0" />
                    <div className="text-xs text-green-800">
                      <strong>Access Status: ACTIVE!</strong>
                      Your unique Access Pass has been validated on-chain and registered to your MongoDB profile! Export formats are completely unlocked.
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleRedeem} className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-[#2D1B0E] mb-1">Enter your License Code</label>
                      <input
                        type="text"
                        placeholder="RM-2026-XXXXXXX"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="w-full px-3 py-2 border border-[#E8E0D8] rounded-lg text-sm font-mono focus:outline-none focus:border-[#D4A853]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 bg-[#D4A853] hover:bg-[#C49A42] text-[#2D1B0E] font-bold text-xs rounded-lg transition-transform active:scale-95 cursor-pointer"
                    >
                      Redeem Lifetime Pass code
                    </button>
                    <p className="text-[0.65rem] text-[#8A7A6A] leading-relaxed mt-2 text-center">
                      Need a code? Make a mobile money or crypto payment in the **Export** tab and copy your generated code from the **Admin** panel or email us!
                    </p>
                  </form>
                )}
              </div>

              {/* Extra branding security */}
              <div className="border-t border-[#E8E0D8] pt-4 mt-6 flex items-center gap-2 text-xs text-[#8A7A6A]">
                <Shield className="w-4 h-4 text-green-600" />
                Your intellectual property rights are fully protected. All original publications are owned 100% by you.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
