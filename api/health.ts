export default function handler(req: any, res: any) {
  const hasKey = !!process.env.GEMINI_API_KEY;
  res.status(200).json({ status: "ok", geminiConfigured: hasKey });
}
