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
    // Both API keys have 0 quota limit. Mocking the data so the app works!
    const mockData = {
      gold24k: 7250.50,
      gold22k: 6650.00,
      silver: 91.20
    };

    return res.status(200).json(mockData);
  } catch (error) {
    console.error("Error fetching rates:", error);
    res.status(500).json({ error: error.message });
  }
}
