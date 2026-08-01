import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({ apiKey, httpOptions: { headers: { "User-Agent": "aistudio-build" } } })
  : null;

const FALLBACK_MODELS = ["gemini-3.5-flash", "gemini-3.1-pro-preview", "gemini-3.1-flash-lite", "gemini-flash-latest"];

async function generateContentWithFallback(params: { contents: any; config?: any }) {
  if (!ai) throw new Error("GoogleGenAI client is not initialized.");
  let lastError: any = null;
  for (const modelName of FALLBACK_MODELS) {
    try {
      return await ai.models.generateContent({ model: modelName, contents: params.contents, config: params.config });
    } catch (err: any) {
      lastError = err;
    }
  }
  throw lastError || new Error("All fallback Gemini models failed.");
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    if (!ai) return res.status(500).json({ error: "GEMINI_API_KEY environment variable is required." });

    const { message, history, healthProfile } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required." });

    const formattedContents: any[] = [];
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        formattedContents.push({ role: msg.role === "user" ? "user" : "model", parts: [{ text: msg.text }] });
      }
    }
    formattedContents.push({ role: "user", parts: [{ text: message }] });

    let healthContext = "";
    if (healthProfile) {
      healthContext = `
[User Custom Health Profile]
- Body Type / Constitution: ${healthProfile.bodyType || "Not specified"}
- Medical Conditions / Issues: ${healthProfile.medicalConditions || "None"}
- Specific Concerns for Yoga: ${healthProfile.specificConcerns || "General wellness"}
- Fitness Level: ${healthProfile.fitnessLevel || "Intermediate"}

You must fully customize your recommendations, exercises, breathing flows, and alignment tips to match this user's profile.`;
    }

    const response = await generateContentWithFallback({
      contents: formattedContents,
      config: {
        systemInstruction: `You are Pranova AI, the personal intelligence wellness coach and sustainability mentor built into the Pranova™ EarthMat ecosystem.${healthContext}

Keep your tone welcoming, mindful, warm, empathetic, and professional. Format responses with clean headings, bullet points, and practical steps. Keep replies concise (max 350 words).`,
      },
    });

    const reply = response.text || "I apologize, but I could not formulate a response at this moment.";
    res.status(200).json({ text: reply });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error?.message || String(error) });
  }
}
