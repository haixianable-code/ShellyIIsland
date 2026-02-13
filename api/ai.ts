import { GoogleGenAI, Type } from "@google/genai";

export const config = {
  runtime: 'edge', // Use Edge runtime for faster cold starts
};

interface RequestBody {
  action: 'hint' | 'challenge' | 'test';
  payload: any;
}

export default async function handler(req: Request) {
  // 1. Security: Basic CORS/Referer check
  // Ensure requests only come from your own domain (or localhost during dev)
  const referer = req.headers.get('referer') || '';
  const allowedOrigins = ['ssisland.space', 'localhost', '127.0.0.1'];
  const isAllowed = allowedOrigins.some(origin => referer.includes(origin));
  
  if (!isAllowed) {
    return new Response(JSON.stringify({ error: 'Unauthorized origin' }), { status: 403 });
  }

  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { action, payload } = await req.json() as RequestBody;
    const apiKey = process.env.GEMINI_API_KEY; // Rename your env var in Vercel to this

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Server configuration error: Missing API Key' }), { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    // --- Action: Generate Mnemonic Hint ---
    if (action === 'hint') {
      const { word, translation } = payload;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash', // Upgraded to faster, cheaper model
        contents: `Provide a short smart grammar hint and a funny mnemonic for the Spanish word "${word}" (English: "${translation}"). Concise JSON only.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              hint: { type: Type.STRING, description: 'Linguistic tip (max 10 words).' },
              mnemonics: { type: Type.STRING, description: 'Funny trick (max 15 words).' },
            },
            required: ["hint", "mnemonics"],
          },
        },
      });
      return new Response(response.text || '{}', { 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    // --- Action: Challenge/Correction ---
    if (action === 'challenge') {
      const { word, sentence } = payload;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `I am trying to learn the Spanish word "${word}". My sentence is: "${sentence}". 
        Be a friendly Islander tutor. 
        1. If the sentence has errors, respond starting with "I hear you! Did you mean..." and provide a corrected version. 
        2. If correct, celebrate and acknowledge my use of "${word}".
        3. No grades, just re-understanding and appreciation. Keep it concise.`,
      });
      return new Response(JSON.stringify({ text: response.text }), { 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    // --- Action: Connection Test ---
    if (action === 'test') {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: "Say 'Success' in Spanish.",
      });
      return new Response(JSON.stringify({ text: response.text }), { 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400 });

  } catch (error: any) {
    console.error('AI API Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), { status: 500 });
  }
}