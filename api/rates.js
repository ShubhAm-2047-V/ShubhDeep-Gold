import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // Allow CORS so the Flutter app can access it
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Server missing GEMINI_API_KEY environment variable" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Using antigravity-preview-05-2026 as a fallback since their internal key has access to it.
    // If they change to a standard key, they can switch this to gemini-1.5-flash.
    const model = genAI.getGenerativeModel({ model: "antigravity-preview-05-2026" });

    const prompt = `
      What is today's approximate 24K and 22K gold rate, and silver rate per gram in Indian Rupees (INR)?
      Return ONLY a JSON object with the keys "gold24k", "gold22k", and "silver", and the numeric values as doubles. No markdown formatting, just raw JSON.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const jsonRegex = /\{[\s\S]*\}/;
    const match = text.match(jsonRegex);
    
    if (!match) {
      throw new Error("Invalid response format from Gemini");
    }

    const rates = JSON.parse(match[0]);
    res.status(200).json(rates);
    
  } catch (error) {
    console.error("Error fetching rates:", error);
    res.status(500).json({ error: error.message });
  }
}
