import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
export const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { "User-Agent": "aistudio-build" } },
    })
  : null;

const FALLBACK_MODELS = [
  "gemini-3.5-flash",
  "gemini-3.1-pro-preview",
  "gemini-3.1-flash-lite",
  "gemini-flash-latest",
];

export async function generateContentWithFallback(params: { contents: any; config?: any }) {
  if (!ai) throw new Error("GoogleGenAI client is not initialized.");
  let lastError: any = null;
  for (const modelName of FALLBACK_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: params.contents,
        config: params.config,
      });
      return response;
    } catch (err: any) {
      lastError = err;
    }
  }
  throw lastError || new Error("All fallback Gemini models failed.");
}
