import { ai, generateContentWithFallback } from "../_lib/gemini";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    if (!ai) {
      return res.status(500).json({ error: "GEMINI_API_KEY environment variable is required." });
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
            routineName: { type: "STRING", description: "The title of this tailored daily yoga session." },
            suitabilityReason: { type: "STRING", description: "A short, encouraging explanation of how this sequence specifically benefits their body type, medical conditions, and concerns." },
            asanas: {
              type: "ARRAY",
              description: "List of 3 to 4 recommended poses in sequence.",
              items: {
                type: "OBJECT",
                properties: {
                  name: { type: "STRING", description: "The Sanskrit & common name of the pose." },
                  duration: { type: "STRING", description: "Time to hold or flow (e.g., '3 minutes' or '10 slow deep breaths')." },
                  benefits: { type: "STRING", description: "Why this pose is selected for their concerns/body type." },
                  modifications: { type: "STRING", description: "Injury adaptation cues, e.g. how to adjust if they have knee/back pain or other listed conditions." },
                },
                required: ["name", "duration", "benefits", "modifications"],
              },
            },
          },
          required: ["routineName", "suitabilityReason", "asanas"],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) throw new Error("Empty response from AI model.");
    res.status(200).json(JSON.parse(resultText.trim()));
  } catch (error: any) {
    console.error("Yoga Suggestion Gemini Error:", error);
    res.status(500).json({ error: error.message || "An error occurred compiling customized yoga suggestions." });
  }
}
