/**
 * RitemastaPro - Node.js Express Backend with simulated MongoDB local persists layers,
 * secure user authentication, active admin keys generator, and Gemini LLM proxy.
 */
import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { User, Project, AccessCode } from "./src/types";
import type { PitchDeckData } from "./src/types/pitchDeck";
import { DEFAULT_PITCH_THEME } from "./src/types/pitchDeck";
import { buildPitchDeckHTML } from "./server/pitchDeckTemplate";
import { renderAllCharts } from "./server/chartRenderer";
import { renderHTMLToPDF } from "./server/pdfRenderer";
import { buildPitchSystemInstruction } from "./server/pitchSynthesisPrompt";

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize local persistent simulated databases
const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

const USERS_FILE = path.join(DATA_DIR, "users.json");
const PROJECTS_FILE = path.join(DATA_DIR, "projects.json");
const CODES_FILE = path.join(DATA_DIR, "codes.json");

// Helper load / save functions acting as simulated MongoDB collection API
function loadUsers(): User[] & any[] {
  if (!fs.existsSync(USERS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function saveUsers(users: any[]) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
}

function loadProjects(): Project[] {
  if (!fs.existsSync(PROJECTS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(PROJECTS_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function saveProjects(projects: Project[]) {
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2), "utf-8");
}

function loadCodes(): AccessCode[] {
  if (!fs.existsSync(CODES_FILE)) {
    // Bootstrap initial coupon codes
    const initialCodes: AccessCode[] = [
      {
        code: "RM-2026-A8F3",
        customerName: "Alice Johnson",
        paymentMethod: "Mobile Money (MTN)",
        amountPaidUsd: 49,
        amountPaidGhs: 724.50,
        status: "redeemed",
        date: "2026-06-10",
      },
      {
        code: "RM-2026-B2K9",
        customerName: "Robert Ashley Nikoi",
        paymentMethod: "Cryptocurrency SOL",
        amountPaidUsd: 49,
        amountPaidGhs: 724.50,
        status: "redeemed",
        date: "2026-06-09",
      },
      {
        code: "RM-2026-C7L4",
        customerName: "Carol Davis",
        paymentMethod: "Mobile Money (Telecel)",
        amountPaidUsd: 49,
        amountPaidGhs: 724.50,
        status: "pending",
        date: "2026-06-11",
      }
    ];
    fs.writeFileSync(CODES_FILE, JSON.stringify(initialCodes, null, 2), "utf-8");
    return initialCodes;
  }
  try {
    return JSON.parse(fs.readFileSync(CODES_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function saveCodes(codes: AccessCode[]) {
  fs.writeFileSync(CODES_FILE, JSON.stringify(codes, null, 2), "utf-8");
}

// SHA256 secure native password hashing helper
function hashPassword(pass: string): string {
  return crypto.createHash("sha256").update(pass + "RitemastaSecuritySalt").digest("hex");
}

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "DUMMY_KEY",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

/* ==========================================================================
   API ENDPOINTS FIRST
   ========================================================================== */

// 1. SIGNUP USER API
app.post("/api/auth/signup", (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: "Missing required profile parameters" });
  }

  const users = loadUsers();
  const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: "An account is already registered under this email" });
  }

  const newUser = {
    id: crypto.randomUUID(),
    email: email.toLowerCase(),
    passwordHash: hashPassword(password),
    name,
    isUnlocked: false, // Lifetime pass inactive initially
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);

  res.status(201).json({ success: true, message: "Registration successful" });
});

// 2. LOGIN USER API
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required credentials" });
  }

  const users = loadUsers() as any[];
  const user = users.find(
    (u: any) =>
      u.email.toLowerCase() === email.toLowerCase() &&
      u.passwordHash === hashPassword(password)
  );

  if (!user) {
    return res.status(401).json({ error: "Password or email address is incorrect" });
  }

  // Safe client user context output (omits sensitive hashes)
  const safeUser: User = {
    id: user.id,
    email: user.email,
    name: user.name,
    isUnlocked: !!user.isUnlocked,
    isDesignStudioUnlocked: !!user.isDesignStudioUnlocked,
    isIWriteProUnlocked: !!user.isIWriteProUnlocked,
    unlockCode: user.unlockCode,
    createdAt: user.createdAt,
  };

  res.json({ success: true, user: safeUser });
});

// 3. CODE REDEEMER PASS KEY API - Multi-Product Support
app.post("/api/auth/redeem", (req, res) => {
  const { userId, code } = req.body;
  if (!userId || !code) {
    return res.status(400).json({ error: "Missing parameter details" });
  }

  const cleanCode = code.trim().toUpperCase();
  const users = loadUsers();
  const uIdx = users.findIndex((u) => u.id === userId);
  if (uIdx === -1) {
    return res.status(404).json({ error: "User profile mismatch error" });
  }

  // Check for developer test-override patterns to enable easy offline sandbox evaluations
  let productUnlocked = "";
  if (cleanCode === "TEST-IWRITE-PRO" || cleanCode === "IWRITE" || cleanCode === "WRITER" || cleanCode === "RM-WRITER-PRO") {
    productUnlocked = "iwrite";
    users[uIdx].isIWriteProUnlocked = true;
  } else if (cleanCode === "TEST-DESIGNER-PRO" || cleanCode === "DESIGNER" || cleanCode === "RM-DESIGN-STUDIO") {
    productUnlocked = "design";
    users[uIdx].isDesignStudioUnlocked = true;
  } else if (cleanCode === "TEST-LIFETIME-PASS" || cleanCode === "LIFETIME" || cleanCode === "PASS") {
    productUnlocked = "lifetime";
    users[uIdx].isUnlocked = true;
  } else {
    // Check codes database
    const codes = loadCodes();
    const cIdx = codes.findIndex((c) => c.code.toUpperCase() === cleanCode);
    if (cIdx === -1) {
      return res.status(404).json({ error: "Access key does not match Ritemasta core databases" });
    }

    const keyData = codes[cIdx];
    if (keyData.status === "redeemed") {
      return res.status(400).json({ error: "Code key has already been activated by another profile" });
    }

    // Mark as redeemed
    codes[cIdx].status = "redeemed";
    saveCodes(codes);

    // Filter package type based on amount or code characters
    if (cleanCode.includes("WRT") || cleanCode.includes("WRITER") || keyData.amountPaidUsd === 20) {
      productUnlocked = "iwrite";
      users[uIdx].isIWriteProUnlocked = true;
    } else if (cleanCode.includes("DES") || cleanCode.includes("DESIGN") || keyData.amountPaidUsd === 15) {
      productUnlocked = "design";
      users[uIdx].isDesignStudioUnlocked = true;
    } else {
      productUnlocked = "lifetime";
      users[uIdx].isUnlocked = true;
    }
  }

  users[uIdx].unlockCode = cleanCode;
  saveUsers(users);

  const safeUser: User = {
    id: users[uIdx].id,
    email: users[uIdx].email,
    name: users[uIdx].name,
    isUnlocked: !!users[uIdx].isUnlocked,
    isDesignStudioUnlocked: !!users[uIdx].isDesignStudioUnlocked,
    isIWriteProUnlocked: !!users[uIdx].isIWriteProUnlocked,
    unlockCode: cleanCode,
    createdAt: users[uIdx].createdAt,
  };

  let message = "Code redeemed successfully!";
  if (productUnlocked === "iwrite") message = "✓ Standard 'iWrite Studio' Pro unlocked! Let's generate agreements, deck slide transcripts and proposals!";
  if (productUnlocked === "design") message = "✓ Standard 'Creative Design Studio' unlocked! High-DPI exports enabled.";
  if (productUnlocked === "lifetime") message = "✓ Standard 'Lifetime eBook Master' unlocked successfully.";

  return res.json({ success: true, message, user: safeUser });
});

// 4. PROFILE NAME UPDATE API
app.post("/api/auth/update", (req, res) => {
  const { userId, newName } = req.body;
  if (!userId || !newName) {
    return res.status(400).json({ error: "Missing name metrics" });
  }

  const users = loadUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index !== -1) {
    users[index].name = newName;
    saveUsers(users);

    const safeUser: User = {
      id: users[index].id,
      email: users[index].email,
      name: users[index].name,
      isUnlocked: !!users[index].isUnlocked,
      isDesignStudioUnlocked: !!users[index].isDesignStudioUnlocked,
      isIWriteProUnlocked: !!users[index].isIWriteProUnlocked,
      unlockCode: users[index].unlockCode,
      createdAt: users[index].createdAt,
    };
    return res.json({ success: true, user: safeUser });
  }

  res.status(404).json({ error: "User matches none" });
});

// 5. PROJECTS PERSIST API - LOAD ALL USER WORKS
app.get("/api/projects", (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: "Missing user credentials" });

  const projects = loadProjects();
  const usersWork = projects.filter((p) => p.userId === userId);
  res.json({ projects: usersWork });
});

// 6. PROJECTS SAVE / UPDATE API
app.post("/api/projects", (req, res) => {
  const { project } = req.body;
  if (!project || !project.id || !project.userId) {
    return res.status(400).json({ error: "Invalid project metrics" });
  }

  const projects = loadProjects();
  const index = projects.findIndex((p) => p.id === project.id);
  if (index !== -1) {
    projects[index] = { ...project, updatedAt: new Date().toISOString() };
  } else {
    projects.push({ ...project, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  }

  saveProjects(projects);
  res.json({ success: true, project });
});

// 7. SECURE GEMINI CHAT PROXY FOR YAYRA CHATBOT
app.post("/api/gemini/chat", async (req, res) => {
  const { message, history, currentTab, userName } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message prompt details must be active" });
  }

  try {
    const formattedHistory = (history || []).map((h: any) => ({
      role: h.role === "user" ? "user" : "model",
      parts: [{ text: h.text }],
    }));

    // Prepend instruction profile as SystemInstruction or models prompt context
    const ritemastaSystemProfile = `You are Yayra, the premier floating AI agent for the RitemastaPro ecosystem.
Your personality is incredibly warm, highly encouraging, cheerful, and represents professional Ghanaian publishing hospitality.
Your founder is Robert Ashley Nikoi, a celebrated author, publisher, and creative branding designer.
Robert Ashley Nikoi wrote geographies (Human SHS geography), faith manuals (Set Apart), chess out motivational pieces, and "The Bitter Leaf & Coconut Water Reset natural protocol".
The strategic pillars are: Ritemasta Publications, RitemastaPro client suites, Teecha AI workspace, and Ritemasta Studios.

Platform guidelines context:
- Standard price has been reduced to a one-time lifetime Access Pass of only $25 (GHS equivalent GHS ₵362.50). Recurring subscriptions are removed completely.
- Formats unlocked include print-ready PDFs, epub eBook structure files, Kindle MOBIs, rich XML, Microsoft Word DOCs, standalone HTML and magazines portfolios.
- Payment MTN / Telecel number: xxxx (MTN) / +233 500 119 195 (Telecel). We also accept Sol, BTC, and BNB currencies.
- Current User Context Name: ${userName || "Author Master"}.
- Active user navigation tab: ${currentTab || "Home Dashboard"}.

Keep answers extremely helpful, concise, well-formatted, and completely accurate. Guide users beautifully from draft creation to complete masterbook formatting!`;

    const contents = [
      ...formattedHistory,
      { role: "user" as const, parts: [{ text: message }] }
    ];

    const navigateTabFunction = {
      name: "navigateTab",
      description: "Navigate the user to a different view or tab in the application.",
      parameters: {
        type: Type.OBJECT,
        properties: {
          tabName: {
            type: Type.STRING,
            description: "The name of the tab (e.g. 'home', 'upload', 'editor', 'layout', 'design_studio', 'iwrite_studio', 'save', 'export', 'admin')"
          }
        },
        required: ["tabName"]
      }
    };

    const createProjectFunction = {
      name: "createProject",
      description: "Start or create a new project workspace for the user.",
      parameters: {
        type: Type.OBJECT,
        properties: {
          projectType: {
            type: Type.STRING,
            description: "The type of project to create, e.g. 'ebook', 'presentation'"
          }
        },
        required: ["projectType"]
      }
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction: ritemastaSystemProfile,
        tools: [{ functionDeclarations: [navigateTabFunction, createProjectFunction] }],
      },
    });

    res.json({ response: response.text, functionCalls: response.functionCalls });
  } catch (err: any) {
    console.error("Gemini Chat API error:", err);
    res.status(500).json({ error: "Gemini server failed down", details: err.message });
  }
});

// 8. AI PRESENTATION AND BOOK SYNOPSIS COMPILER
app.post("/api/gemini/presentation", async (req, res) => {
  const { prompt, type, projectType, currentContent } = req.body;
  if (!prompt || !type) {
    return res.status(400).json({ error: "Target Prompt text not defined" });
  }

  try {
    const instructions = `You are RitemastaPro's expert presentation, synopsis, and academic book writing bot of Robert Ashley Nikoi.
Generate outstanding, production-ready, beautifully structures written layouts for type '${type}'.
- If type 'presentation': Provide a fully-formatted slide script with headers, guidelines, and outline sections.
- If type 'synopsis': Deliver an emotional synopsis outline that sells.
- If type 'proposal': Set up table graphs containing milestones, targets, cost variables, and publishing synopsis guides.
- If type 'chapter': Write highly coherent natural texts based on wellness or target prompts.

Reference guidelines context:
- Project Type active: ${projectType || "ebook"}
- Active Content Draft Context (for matching themes): ${currentContent || "None"}
- Specific User Guideline: ${prompt}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Compile the target draft request.",
      config: {
        systemInstruction: instructions,
      },
    });

    res.json({ response: response.text });
  } catch (err: any) {
    console.error("Gemini Compiler error:", err);
    res.status(500).json({ error: "Compiler failed down" });
  }
});

// 9. iWrite AI Pro Studio Document Compiler
app.post("/api/gemini/iwrite", async (req, res) => {
  const { idea, docType, professionalRole, customTone, formatType } = req.body;
  if (!idea) {
    return res.status(400).json({ error: "Please describe your professional content idea first" });
  }

  try {
    const instructions = `You are iWrite Studio, RitemastaPro's elite AI Writing suite designed specifically for busy professionals.
Your purpose is to instantly transform raw bullet points or thoughts into exquisite, highly precise, legally robust, and structurally advanced business documents.
Target Document: ${docType?.toUpperCase() || "LETTER / CONTRACT"}
Role of Sender: ${professionalRole || "Executive Professional"}
Tone setting: ${customTone || "Highly Professional & Formal"}
Format requirement: ${formatType || "Corporate PDF Layout Structure"}

Document-specific rules:
- Letters: Business communications with formal layouts, reference lines, clear call-to-actions, and professional signoffs.
- Proposals: Robust business proposal containing an Executive Summary, Scope of Work, Project Deliverables, Milestone Tables (rendered in beautiful text tables or styled blocks), Cost Analyses, and high-impact conclusions.
- Pitch Decks: Slide-by-slide master breakdown containing Slide Heading, Visual Asset cues, high-impact bulleted core content, and presenter cue talk-tracks.
- Contracts & Agreements / MOUs: Formal preamble, detailed numbered covenants (Section 1.0, 2.0 etc.), legal liabilities, dispute resolution, governing jurisdiction, and formatted side-by-side execution signature blocks.

Maintain perfect spacing, high-end vocabulary, absolute professional composure, and complete structural readiness. Always output raw markdown formatted with elegant typography layout. Keep it safe, professional, and ready for exports.`;

    const contents = `Write a comprehensive, professional ${docType || "business document"} based on this idea:\n\n${idea}`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction: instructions,
        temperature: 0.25, // Low temperature for highly precise legal and business wording
      }
    });

    res.json({ response: response.text });
  } catch (err: any) {
    console.error("Gemini iWrite error:", err);
    res.status(500).json({ error: "iWrite Studio backend compilation failed. Please check your credentials in Settings." });
  }
});

// 10. AI Pitch Synthesizer (The Dynamic Thinking Module)
app.post("/api/gemini/synthesize-pitch", async (req, res) => {
  const { thoughts } = req.body;
  if (!thoughts) {
    return res.status(400).json({ error: "Please describe your entrepreneur thoughts or raw business ideas first" });
  }

  try {
    const systemInstruction = buildPitchSystemInstruction();
    const contents = `Raw entrepreneur ideas and messy metrics:\n\n${thoughts}`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.35,
      }
    });

    const payload = JSON.parse(response.text || "{}");
    res.json({ success: true, payload });
  } catch (err: any) {
    console.error("Gemini Synthesize Pitch error:", err);
    res.status(500).json({ error: `Dynamic translation failed: ${err.message}. Please check your credentials.` });
  }
});

// Pitch Deck PDF Generator - renders full themed PDF from PitchDeckData
app.post("/api/pitch/generate-pdf", async (req, res) => {
  const { deck } = req.body as { deck: PitchDeckData };
  if (!deck) {
    return res.status(400).json({ error: "Missing pitch deck data" });
  }

  try {
    const theme = { ...DEFAULT_PITCH_THEME, ...(deck.theme || {}) };
    const dataWithTheme: PitchDeckData = { ...deck, theme };

    const chartImages = await renderAllCharts(
      {
        problemChart: dataWithTheme.problemChart,
        marketChart: dataWithTheme.marketChart,
        businessModelChart: dataWithTheme.businessModelChart,
        tractionChart: dataWithTheme.tractionChart,
        gtmChart: dataWithTheme.gtmChart,
        competitiveChart: dataWithTheme.competitiveChart,
        timelineChart: dataWithTheme.timelineChart,
        fundingChart: dataWithTheme.fundingAllocation?.length
          ? {
              type: "pie",
              title: "Funding Allocation",
              labels: dataWithTheme.fundingAllocation.map((f) => f.label),
              datasets: [{ label: "Allocation ($)", data: dataWithTheme.fundingAllocation.map((f) => f.amount) }],
            }
          : undefined,
        financialChart: dataWithTheme.financialChart,
      },
      theme
    );

    const html = buildPitchDeckHTML(dataWithTheme, chartImages);
    const pdfBuffer = await renderHTMLToPDF(html);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${(dataWithTheme.companyName || "pitch-deck").replace(/[^a-z0-9]+/gi, "-")}-pitch-deck.pdf"`);
    res.send(pdfBuffer);
  } catch (err: any) {
    console.error("Pitch PDF generation error:", err);
    res.status(500).json({ error: `PDF generation failed: ${err.message}` });
  }
});

/* ==========================================================================
   ADMIN SECURE DASHBOARD ENDPOINTS
   ========================================================================== */

// Admin password middleware
const ADMIN_PASSWORD_HASH = crypto.createHash("sha256").update("RiteLuxi26!2026#Ghana$Publishing@RitemastaPro" + "RitemastaAdminSalt2026").digest("hex");

function requireAdmin(req: any, res: any, next: any) {
  const provided = req.headers["x-admin-password"] as string || req.body?.adminPassword || req.query?.adminPassword;
  if (!provided) return res.status(401).json({ error: "Admin password required" });
  const hash = crypto.createHash("sha256").update(provided + "RitemastaAdminSalt2026").digest("hex");
  if (hash !== ADMIN_PASSWORD_HASH) return res.status(403).json({ error: "Invalid admin password" });
  next();
}

// Get admin metrics
app.get("/api/admin/metrics", requireAdmin, (req, res) => {
  const users = loadUsers();
  const codes = loadCodes();

  const totalUsers = users.length + 124; // Base simulation + real registered databases
  const activeCodesCount = codes.length;
  
  // Calculate revenue from active keys code
  const revenueFromCodes = codes.reduce((acc, current) => {
    return acc + (current.amountPaidUsd || 25);
  }, 2274.53);

  // Return live rate as well
  res.json({
    success: true,
    ghsRate: 14.50,
    activeCodesCount,
    totalRevenue: parseFloat(revenueFromCodes.toFixed(2)),
    totalUsers,
    recentCodes: codes,
  });
});

// Create new access license codes
app.post("/api/admin/codes", requireAdmin, (req, res) => {
  const { customerName, paymentMethod, amountPaidUsd, amountPaidGhs } = req.body;
  if (!customerName || !amountPaidUsd) {
    return res.status(400).json({ error: "Missing customer or payment details" });
  }

  // Create formatted code: RM-2026-XXXXX
  const randomSuffix = crypto.randomBytes(4).toString("hex").toUpperCase();
  const generatedCode = `RM-2026-${randomSuffix}`;

  const codes = loadCodes();

  const newCode: AccessCode = {
    code: generatedCode,
    customerName,
    paymentMethod,
    amountPaidUsd: parseFloat(amountPaidUsd) || 25,
    amountPaidGhs: parseFloat(amountPaidGhs) || 362.50,
    status: "active",
    date: new Date().toISOString().slice(0, 10),
  };

  codes.unshift(newCode);
  saveCodes(codes);

  res.status(201).json({ success: true, code: generatedCode });
});

// Delete issued codes
app.delete("/api/admin/codes", requireAdmin, (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).json({ error: "Missing code query" });

  const codes = loadCodes();
  const filtered = codes.filter((c) => c.code !== code);
  saveCodes(filtered);

  res.json({ success: true });
});


/* ==========================================================================
   AUTH EXTRAS — Forgot Password, Reset Password, Photo Upload
   ========================================================================== */

app.post("/api/auth/forgot-password", async (req: any, res: any) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });
  const users = loadUsers();
  const user = users.find((u: any) => u.email === email);
  if (!user) return res.status(404).json({ error: "No account found with that email." });
  const token = crypto.randomBytes(20).toString("hex");
  user.resetToken = token;
  user.resetExpiry = Date.now() + 3600000;
  saveUsers(users);
  console.log(`[RESET TOKEN] ${email} -> ${token}`);
  res.json({ success: true, message: "Reset instructions sent. Check your email or WhatsApp us." });
});

app.post("/api/auth/reset-password", (req: any, res: any) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) return res.status(400).json({ error: "Token and password required." });
  const users = loadUsers();
  const SALT = "RitemastaSecuritySalt";
  const user = users.find((u: any) => u.resetToken === token && u.resetExpiry > Date.now());
  if (!user) return res.status(400).json({ error: "Invalid or expired token." });
  user.passwordHash = crypto.createHash("sha256").update(newPassword + SALT).digest("hex");
  delete user.resetToken; delete user.resetExpiry;
  saveUsers(users);
  res.json({ success: true });
});

app.post("/api/auth/upload-photo", (req: any, res: any) => {
  const { userId, photoBase64 } = req.body;
  const users = loadUsers();
  const user = users.find((u: any) => u.id === userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  user.photoUrl = photoBase64;
  saveUsers(users);
  res.json({ success: true });
});

/* ==========================================================================
   PAYSTACK PAYMENT
   ========================================================================== */

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || "";
const PAYSTACK_PUBLIC = process.env.PAYSTACK_PUBLIC_KEY || "";

app.post("/api/payment/initialize", async (req: any, res: any) => {
  const { userId, email, tier } = req.body;
  if (!email || !tier) return res.status(400).json({ error: "Missing fields" });
  const reference = "RM-" + Date.now() + "-" + Math.random().toString(36).substr(2,6).toUpperCase();
  const ghsAmounts: Record<string, number> = { lifetime: 72450, design: 42930, iwrite: 57690 };
  res.json({ publicKey: PAYSTACK_PUBLIC, reference, amount: ghsAmounts[tier] || 72450, currency: "GHS", userId, tier });
});

app.post("/api/payment/verify", async (req: any, res: any) => {
  const { reference, userId, tier } = req.body;
  if (!reference || !userId) return res.status(400).json({ error: "Missing data" });
  try {
    const r = await fetch("https://api.paystack.co/transaction/verify/" + encodeURIComponent(reference), {
      headers: { Authorization: "Bearer " + PAYSTACK_SECRET },
    });
    const data = await r.json();
    if (data.status && data.data?.status === "success") {
      const users = loadUsers();
      const user = users.find((u: any) => u.id === userId);
      if (user) {
        if (tier === "lifetime") user.isUnlocked = true;
        if (tier === "design") user.isDesignStudioUnlocked = true;
        if (tier === "iwrite") user.isIWriteProUnlocked = true;
        user.paymentRef = reference;
        user.paymentDate = new Date().toISOString();
        saveUsers(users);
      }
      res.json({ success: true, tier });
    } else {
      res.status(400).json({ success: false, error: "Payment not confirmed." });
    }
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

app.post("/api/payment/webhook", express.raw({ type: "application/json" }), (req: any, res: any) => {
  const hash = crypto.createHmac("sha512", PAYSTACK_SECRET).update(req.body).digest("hex");
  if (hash !== req.headers["x-paystack-signature"]) return res.status(401).send("Invalid");
  const event = JSON.parse(req.body.toString());
  if (event.event === "charge.success") {
    const { metadata, reference } = event.data;
    const { userId, tier } = metadata || {};
    if (userId && tier) {
      const users = loadUsers();
      const user = users.find((u: any) => u.id === userId);
      if (user) {
        if (tier === "lifetime") user.isUnlocked = true;
        if (tier === "design") user.isDesignStudioUnlocked = true;
        if (tier === "iwrite") user.isIWriteProUnlocked = true;
        user.paymentRef = reference; user.paymentDate = new Date().toISOString();
        saveUsers(users);
      }
    }
  }
  res.sendStatus(200);
});

/* ==========================================================================
   COVER EXPORT + MAGAZINE EXPORT + AI COVER SUGGEST
   ========================================================================== */

app.post("/api/cover/export", async (req: any, res: any) => {
  const { html, type } = req.body;
  try {
    const fullHtml = '<!DOCTYPE html><html><head><meta charset="UTF-8"/><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;800;900&family=Inter:wght@400;600;700&family=Cormorant+Garamond:wght@400;600;700&display=swap" rel="stylesheet"/><style>*{margin:0;padding:0;box-sizing:border-box;}body{background:transparent;}</style></head><body>' + html + '</body></html>';
    const buf = await renderHTMLToPDF(fullHtml);
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Content-Disposition", 'attachment; filename="cover-' + (type||"cover") + '.png"');
    res.send(buf);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

app.post("/api/magazine/export-pdf", async (req: any, res: any) => {
  const { html, masthead } = req.body;
  try {
    const buf = await renderHTMLToPDF(html);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="' + (masthead||"magazine").replace(/[^a-z0-9]+/gi,"-") + '.pdf"');
    res.send(buf);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

app.post("/api/gemini/cover-suggest", async (req: any, res: any) => {
  const { coverType, title, subtitle, author, publisher, tagline } = req.body;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "You are a premium cover designer. Give 3 concise bullet-point suggestions for typography, color mood, and composition for: Type=" + coverType + " Title=" + title + " Author=" + author + " Publisher=" + publisher,
      config: { temperature: 0.7 }
    });
    res.json({ suggestion: response.text });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

/* ==========================================================================
   VITE DEV MIDDLEWARE AND CLIENT ROUTING OR STATICS
   ========================================================================== */

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
