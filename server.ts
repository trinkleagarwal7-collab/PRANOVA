import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize GoogleGenAI SDK (lazy-loaded check)
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

// Robust fallback model list to ensure continuous availability
const FALLBACK_MODELS = [
  "gemini-3.5-flash",
  "gemini-3.1-pro-preview",
  "gemini-3.1-flash-lite",
  "gemini-flash-latest"
];

async function generateContentWithFallback(params: {
  contents: any;
  config?: any;
}) {
  if (!ai) {
    throw new Error("GoogleGenAI client is not initialized.");
  }

  let lastError: any = null;

  for (const modelName of FALLBACK_MODELS) {
    try {
      console.log(`[Gemini] Attempting generateContent with model: ${modelName}`);
      const response = await ai.models.generateContent({
        model: modelName,
        contents: params.contents,
        config: params.config,
      });
      console.log(`[Gemini] Successfully generated content using model: ${modelName}`);
      return response;
    } catch (err: any) {
      console.warn(`[Gemini] Model ${modelName} failed. Error:`, err.message || err);
      lastError = err;
    }
  }

  throw lastError || new Error("All fallback Gemini models failed.");
}

// API routes FIRST
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", geminiConfigured: !!ai });
});

// Pranova AI Coach & Planner API (Customized for User Profile)
app.post("/api/gemini/coach", async (req, res) => {
  try {
    if (!ai) {
      return res.status(500).json({
        error: "GEMINI_API_KEY environment variable is required. Please add it via the Secrets panel in AI Studio UI settings.",
      });
    }

    const { message, history, healthProfile } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    // Format history and current message for generateContent contents parameter
    const formattedContents: any[] = [];
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        formattedContents.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.text }],
        });
      }
    }
    
    // Add current user prompt
    formattedContents.push({
      role: "user",
      parts: [{ text: message }],
    });

    let healthContext = "";
    if (healthProfile) {
      healthContext = `
[User Custom Health Profile]
- Body Type / Constitution: ${healthProfile.bodyType || "Not specified"}
- Medical Conditions / Issues: ${healthProfile.medicalConditions || "None"}
- Specific Concerns for Yoga: ${healthProfile.specificConcerns || "General wellness"}
- Fitness Level: ${healthProfile.fitnessLevel || "Intermediate"}

You must fully customize your recommendations, exercises, breathing flows, and alignment tips to match this user's profile. Adjust safety limits and suggest appropriate modifications or props (like a cork block, or folded EarthMat) for any listed medical issues or health concerns. Ensure you are completely aware of their health conditions!`;
    }

    const response = await generateContentWithFallback({
      contents: formattedContents,
      config: {
        systemInstruction: `You are Pranova AI, the personal intelligence wellness coach and sustainability mentor built into the Pranova™ EarthMat ecosystem.
Your mission is to provide highly personalized guidance on EarthMat™ usage, yoga alignment & posture, wellness habits (sleep, stress relief, breathing), and sustainable living practices.

[Core Knowledge Base: EarthMat™ & EarthMat™ Pro]
- Materials: 100% natural organic Mediterranean cork top surface bonded with sustainably harvested tree rubber backing. 100% plastic-free, zero PVC/TPE, non-toxic, 99.9% biodegradable.
- Grip & Traction: Cork contains natural suberin, a waxy organic substance that becomes naturally gripper when wet/sweaty. No towel needed for hot yoga.
- Cleaning & Care: Wipe after practice with a damp cloth and mild solution (1 part organic apple cider vinegar to 4 parts water, optional drop of lavender/tea tree oil). Do NOT submerge in water or use harsh chemical detergents. Always roll with cork surface facing OUTWARDS to prevent creasing and keep mat laying flat. Store away from direct sunlight.
- Circular Lifecycle (Pranova Renew™): When the mat reaches end of life (after 5-10 years), return it via Pranova Renew™ to earn upgrade credits and have the natural rubber and cork recovered for eco-construction and acoustic insulation.

[Sustainable Living Habits & Eco Guidance]
- Provide practical, micro-habit advice for daily eco-conscious living: plastic reduction, zero-waste tea/water habits, sustainable commute, composting organic waste, energy-saving desk routines, and carbon footprint awareness.
- Connect wellness actions to real environmental impact (e.g., carbon sequestered, plastic kept out of oceans, trees saved).

${healthContext}

Keep your tone:
- Welcoming, mindful, warm, empathetic, and professional.
- Actionable, encouraging, and easy to read.
- Format responses with clean headings, bullet points, and practical steps. Keep replies concise and easy to read (max 350 words).`,
      },
    });

    const reply = response.text || "I apologize, but I could not formulate a response at this moment. Let's take a mindful breath and try again.";
    res.json({ text: reply });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "An error occurred with Pranova AI." });
  }
});

// Structured Personalized Everyday Yoga suggestions based on User Health Details
app.post("/api/gemini/suggest-yoga", async (req, res) => {
  try {
    if (!ai) {
      return res.status(500).json({
        error: "GEMINI_API_KEY environment variable is required.",
      });
    }

    const { healthProfile } = req.body;
    const bodyType = healthProfile?.bodyType || "Vata-Pitta";
    const medicalConditions = healthProfile?.medicalConditions || "None";
    const specificConcerns = healthProfile?.specificConcerns || "General fitness and core stability";
    const fitnessLevel = healthProfile?.fitnessLevel || "Intermediate";

    const prompt = `Generate a customized daily yoga asana routine specifically curated for a user with the following profile:
- Body Type/Constitution: ${bodyType}
- Medical Conditions/Injuries: ${medicalConditions}
- Specific Concerns for Yoga: ${specificConcerns}
- Yoga Fitness Level: ${fitnessLevel}

The response must be structured to fit their physical needs and support safety. Provide alternative modifications for any of their injuries or health concerns. Ensure the poses stretch the target zones and are safe. Include 3-4 highly specific asanas in the sequence.`;

    const response = await generateContentWithFallback({
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            routineName: {
              type: "STRING",
              description: "The title of this tailored daily yoga session."
            },
            suitabilityReason: {
              type: "STRING",
              description: "A short, encouraging explanation of how this sequence specifically benefits their body type, medical conditions, and concerns."
            },
            asanas: {
              type: "ARRAY",
              description: "List of 3 to 4 recommended poses in sequence.",
              items: {
                type: "OBJECT",
                properties: {
                  name: { type: "STRING", description: "The Sanskrit & common name of the pose." },
                  duration: { type: "STRING", description: "Time to hold or flow (e.g., '3 minutes' or '10 slow deep breaths')." },
                  benefits: { type: "STRING", description: "Why this pose is selected for their concerns/body type." },
                  modifications: { type: "STRING", description: "Injury adaptation cues, e.g. how to adjust if they have knee/back pain or other listed conditions." }
                },
                required: ["name", "duration", "benefits", "modifications"]
              }
            }
          },
          required: ["routineName", "suitabilityReason", "asanas"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response from AI model.");
    }

    res.json(JSON.parse(resultText.trim()));
  } catch (error: any) {
    console.error("Yoga Suggestion Gemini Error:", error);
    res.status(500).json({ error: error.message || "An error occurred compiling customized yoga suggestions." });
  }
});

// Vite middleware or production static serving setup
async function setupViteOrStatic() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Serve index.html for any remaining SPA route
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Pranova App running on http://localhost:${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
}

setupViteOrStatic();
