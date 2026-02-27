
import { GoogleGenAI, Type } from "@google/genai";

export const config = {
  runtime: 'edge', 
};

interface RequestBody {
  action: 'hint' | 'challenge' | 'test' | 'mission';
  payload: any;
}

export default async function handler(req: Request) {
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
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // --- Action: 生成阶梯式生存任务 ---
    if (action === 'mission') {
      const { word, level, timeState } = payload;
      let prompt = "";
      
      if (level === 1) {
        prompt = `Role: Spanish Coach. Target word: "${word}" (${timeState}). 
        Task: Create a Level 1 (Recognition) survival task. 
        Requirement: Provide a short context + a sentence with (____). Give 3 options: 1 correct, 2 tricky distractors (wrong tense/person).
        Format: "Context: ... Pick: 1)... 2)... 3)..."`;
      } else if (level === 2) {
        prompt = `Role: Spanish Editor. Target word: "${word}" (${timeState}).
        Task: Create a Level 2 (Accuracy) task.
        Requirement: Give a Spanish sentence with a deliberate spelling or ACCENT error in "${word}". 
        Instruction: Tell the user to fix the sentence.`;
      } else {
        prompt = `Role: Native Speaker. Target word: "${word}" (${timeState}).
        Task: Create a Level 3 (Real-world Production) task.
        Requirement: Give a complex social goal (e.g. at work, job interview, dating) that requires using "${word}".`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              task_text: { type: Type.STRING },
              subtext: { type: Type.STRING }
            },
            required: ["task_text", "subtext"]
          }
        }
      });
      return new Response(response.text, { headers: { 'Content-Type': 'application/json' } });
    }

    // --- Action: 深度实战批改 ---
    if (action === 'challenge') {
      const { word, sentence, contextWord, level } = payload;
      
      const prompt = `
        Role: Native Spanish Linguist.
        Evaluation Level: ${level || 3} (Level 2 focuses on spelling, Level 3 focuses on naturalness).
        Word: "${word}"
        Task/Context: "${contextWord}"
        Input: "${sentence}"

        Grading Rules:
        - Level 2: Deduct significant points for missing accents (á, é, í, ó, ú) or tildes (ñ).
        - Level 3: Score based on how "native" it sounds. If perfect but robotic, provide an "Expert Recast".
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER },
              correction: { type: Type.STRING },
              explanation: { type: Type.STRING },
              compliment: { type: Type.STRING }
            },
            required: ["score", "correction", "explanation", "compliment"],
          },
        },
      });
      return new Response(response.text, { headers: { 'Content-Type': 'application/json' } });
    }

    // --- Action: Connection Test ---
    if (action === 'test') {
      const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: "Success" });
      return new Response(JSON.stringify({ text: response.text }), { headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
