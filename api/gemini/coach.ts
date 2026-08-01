import { ai, generateContentWithFallback } from "../_lib/gemini";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    if (!ai) {
      return res.status(500).json({ error: "GEMINI_API_KEY environment variable is required." });
    }

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
    res.status(200).json({ text: reply });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "An error occurred with Pranova AI." });
  }
}
