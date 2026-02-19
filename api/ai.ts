
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

    // --- Action: 阶梯任务 (加速版) ---
    if (action === 'mission') {
      const { word, level, timeState } = payload;
      let prompt = "";
      
      if (level === 1) {
        prompt = `Generate a Level 1 Spanish fill-in-the-blank question for "${word}" (${timeState}). 
        - task_text: Sentence with "____". 
        - subtext: 3 numbered options (1 correct, 2 wrong tenses/persons).`;
      } else if (level === 2) {
        prompt = `Generate a Level 2 Spanish grammar fixing task for "${word}" (${timeState}). 
        - task_text: A sentence with a deliberate small spelling/accent error in "${word}".
        - subtext: Instruction to fix it.`;
      } else {
        prompt = `Generate a Level 3 production goal for "${word}" (${timeState}). 
        - task_text: A specific real-world social scenario.
        - subtext: Brief context.`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          temperature: 0.4,
          thinkingConfig: { thinkingBudget: 0 }, // 禁用推理以获取极致速度
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

    // --- Action: 批改反馈 (加速版) ---
    if (action === 'challenge') {
      const { word, sentence, contextWord, level } = payload;
      
      const prompt = `Grade Spanish sentence. Target: "${word}". Context: "${contextWord}". User: "${sentence}".
      Evaluation: ${level === 2 ? 'Focus on spelling/accents.' : 'Focus on naturalness.'}
      JSON output: score (0-100), correction, explanation (short), compliment (1-2 words).`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          temperature: 0.3,
          thinkingConfig: { thinkingBudget: 0 }, // 批改任务不需要长时间思考
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

    // --- Action: 智能提示 (加速版) ---
    if (action === 'hint') {
      const { word, translation } = payload;
      const prompt = `Spanish word: "${word}" (${translation}). 
      Provide: 1. hint (usage tip), 2. mnemonics (memory hack). Short and sharp.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          temperature: 0.5,
          thinkingConfig: { thinkingBudget: 0 },
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              hint: { type: Type.STRING },
              mnemonics: { type: Type.STRING }
            },
            required: ["hint", "mnemonics"]
          }
        }
      });
      return new Response(response.text, { headers: { 'Content-Type': 'application/json' } });
    }

    // --- Action: 测试 ---
    if (action === 'test') {
      const response = await ai.models.generateContent({ 
        model: 'gemini-3-flash-preview', 
        contents: "Success",
        config: { thinkingConfig: { thinkingBudget: 0 } }
      });
      return new Response(JSON.stringify({ text: response.text }), { headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
