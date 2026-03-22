import SynapseUsage from "../models/SynapseUsage.js";
import Course from "../models/Course.js";
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const DAILY_LIMIT = 10;

// Use a model that has free-tier quota in your AI Studio Rate Limit screen
const GEMINI_MODEL = "gemini-2.5-flash";

function getDateKey(d = new Date()) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function refusalMessage() {
  return "I can only help with EduSmart website usage (features, navigation, settings, achievements, courses, quizzes, analytics) and study questions related to your learning here. Please ask something within EduSmart.";
}

function extractJsonObject(text = "") {
  let t = String(text || "").trim();

  t = t
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  const firstBrace = t.indexOf("{");
  const lastBrace = t.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    t = t.slice(firstBrace, lastBrace + 1);
  }

  return t.trim();
}

function isAllowedQuestion(q = "") {
  const text = q.toLowerCase().trim();

  const blockedHints = [
    "politics",
    "religion",
    "adult",
    "porn",
    "sex",
    "gambling",
    "weapons",
    "drugs",
    "crime",
    "hack",
    "cheat",
  ];
  if (blockedHints.some((k) => text.includes(k))) return false;

  const websiteKeywords = [
    "edusmart",
    "dashboard",
    "login",
    "log in",
    "signin",
    "sign in",
    "signup",
    "sign up",
    "otp",
    "verification",
    "profile",
    "settings",
    "theme",
    "dark mode",
    "light mode",
    "notifications",
    "achievement",
    "achievements",
    "badge",
    "badges",
    "xp",
    "level",
    "streak",
    "analytics",
    "progress",
    "faculty",
    "student",
    "students",
    "course",
    "courses",
    "enroll",
    "enrolled",
    "enrollment",
    "register",
    "lesson",
    "lessons",
    "learning",
    "video",
    "videos",
    "quiz",
    "quizzes",
    "doubt",
    "doubts",
    "sidebar",
    "header",
    "change password",
    "logout",
    "log out",
  ];

  const studyKeywords = [
    "explain",
    "what is",
    "how to",
    "why",
    "difference",
    "example",
    "solve",
    "help me",
    "help me understand",
    "notes",
    "summary",
    "summarize",
    "javascript",
    "react",
    "node",
    "express",
    "mongodb",
    "dbms",
    "os",
    "cn",
    "data structures",
    "algorithms",
    "python",
    "java",
    "c++",
    "machine learning",
    "ai",
  ];

  return (
    websiteKeywords.some((k) => text.includes(k)) ||
    studyKeywords.some((k) => text.includes(k))
  );
}

export const askSynapse = async (req, res) => {
  try {
    const userId = req.user.id;
    const { message, context } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({ msg: "Message is required." });
    }

    const isPreset = Boolean(context?.isPreset);

    // Only block non-presets
    if (!isPreset && !isAllowedQuestion(message)) {
      const refusal = refusalMessage();
      return res.json({
        success: true,
        restricted: true,
        answer: refusal, // backward compatible
        answerJson: {
          type: "refusal",
          title: "Not supported",
          answer: refusal,
          steps: [],
          notes: [],
        },
        limit: DAILY_LIMIT,
        remaining: null,
        counted: false,
        model: GEMINI_MODEL,
      });
    }

    // EduSmart-side quota
    const dateKey = getDateKey();
    let usage = await SynapseUsage.findOne({ userId, dateKey });

    if (!usage) {
      usage = await SynapseUsage.create({ userId, dateKey, count: 0 });
    }

    if (!isPreset) {
      if (usage.count >= DAILY_LIMIT) {
        return res.status(429).json({
          msg: "Daily Synapse limit reached (10 prompts/day).",
          limit: DAILY_LIMIT,
          remaining: 0,
        });
      }
      usage.count += 1;
      await usage.save();
    }

    const remaining = Math.max(0, DAILY_LIMIT - usage.count);

    // Grounding: course titles
    let courseTitles = [];
    try {
      const courses = await Course.find({ isPublished: true })
        .select("title")
        .limit(30);
      courseTitles = courses.map((c) => c.title).filter(Boolean);
    } catch (e) {
      console.warn(
        "Synapse: could not load courses for grounding:",
        e?.message,
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      const msg =
        "Synapse is not configured yet (missing GEMINI_API_KEY). Please ask the admin to set it in the backend environment.";

      return res.json({
        success: true,
        restricted: false,
        answer: msg,
        answerJson: {
          type: "explain",
          title: "Synapse not configured",
          answer: msg,
          steps: [],
          notes: [],
        },
        limit: DAILY_LIMIT,
        remaining,
        counted: !isPreset,
        model: GEMINI_MODEL,
      });
    }

    const systemInstruction = `
You are Synapse, the built-in assistant for the EduSmart learning platform.

CRITICAL RULES:
- Only answer questions about: (1) EduSmart website/app usage OR (2) study help related to courses/topics learned inside EduSmart.
- If the user asks anything outside EduSmart + learning, respond with JSON type "refusal" and put the refusal text in "answer".
- Be concise and actionable. Use step-by-step instructions when it's a "how do I" question.
- Do not invent features that don't exist. If unsure, ask a short clarifying question.

OUTPUT FORMAT (MANDATORY):
- Respond ONLY with valid JSON.
- Do NOT wrap the JSON in Markdown code fences (no \`\`\`).
- Do NOT include any extra text before/after the JSON.
- JSON schema:
  {
    "type": "howto" | "explain" | "refusal" | "clarify",
    "title": string,
    "answer": string,
    "steps": string[],
    "notes": string[]
  }
- Rules:
  - For "howto": put steps in "steps" (3-8 items), keep "answer" short.
  - For "explain": put the explanation in "answer", keep "steps" empty.
  - For "clarify": ask 1-2 short questions in "answer".
  - For "refusal": set title="Not supported" and answer="${refusalMessage()}".

EduSmart modules: student dashboard, courses, lesson player, quizzes, achievements, analytics, profile, settings; faculty panel (students monitoring, course management, doubts, analytics), notifications.
Known course titles (may be partial): ${courseTitles.join(", ") || "N/A"}.
    `.trim();

    const prompt = `${systemInstruction}\n\nUser question: ${message}`;

    const client = new GoogleGenAI({ apiKey });

    let answerText = "";
    let answerJson = null;

    try {
      const resp = await client.models.generateContent({
        model: GEMINI_MODEL,
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      answerText = resp?.text || "";

      // ✅ Robust JSON parsing (handles ```json fences and extra text)
      try {
        const cleaned = extractJsonObject(answerText);
        answerJson = JSON.parse(cleaned);
      } catch {
        answerJson = {
          type: "explain",
          title: "Answer",
          answer:
            answerText || "Sorry, I couldn't generate a response right now.",
          steps: [],
          notes: [],
        };
      }
    } catch (e) {
      const msg = e?.message || "";
      const isRateLimit =
        msg.includes("429") ||
        msg.includes("RESOURCE_EXHAUSTED") ||
        msg.toLowerCase().includes("quota") ||
        msg.toLowerCase().includes("too many requests");

      console.error("GenAI generateContent failed:", e);

      answerText = isRateLimit
        ? `Synapse is rate-limited by Gemini right now (free tier). Please wait and try again. (Model: ${GEMINI_MODEL})`
        : "Synapse is temporarily unavailable. Please try again in a moment.";

      answerJson = {
        type: "explain",
        title: "Synapse unavailable",
        answer: answerText,
        steps: [],
        notes: [],
      };
    }

    return res.json({
      success: true,
      restricted: false,
      answer: answerText, // backward compatible (may be JSON string)
      answerJson, // structured response for UI
      limit: DAILY_LIMIT,
      remaining,
      counted: !isPreset,
      model: GEMINI_MODEL,
    });
  } catch (err) {
    console.error("Synapse error:", err);
    return res.json({
      success: true,
      restricted: false,
      answer: "Synapse encountered an error. Please try again.",
      answerJson: {
        type: "explain",
        title: "Synapse error",
        answer: "Synapse encountered an error. Please try again.",
        steps: [],
        notes: [],
      },
      limit: DAILY_LIMIT,
      remaining: null,
      counted: false,
      model: GEMINI_MODEL,
    });
  }
};
