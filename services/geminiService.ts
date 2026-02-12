
import { GoogleGenAI, Type } from "@google/genai";

// AI Word Info structure
export interface AIWordInfo {
  hint: string;
  mnemonics: string;
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

/**
 * Diagnostic function to test the AI spirit connection
 */
export const testAISpiritConnection = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) return { success: false, message: "API_KEY is missing from environment." };
    
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Say 'Success' in Spanish.",
    });
    
    return { success: !!response.text, message: response.text || "Empty response" };
  } catch (error: any) {
    return { success: false, message: error.message || "Unknown error occurred." };
  }
};

/**
 * Generates a smart grammar hint and mnemonic for a word using Gemini 3 Flash.
 * Includes retry logic for 429 errors.
 */
export const getAISmartHint = async (word: string, translation: string, retries = 0): Promise<AIWordInfo | null> => {
  const MAX_RETRIES = 3;
  
  try {
    const apiKey = process.env.API_KEY;
    
    if (!apiKey) {
      console.warn("🏝️ AI Service: process.env.API_KEY is undefined.");
      return null;
    }

    console.debug(`🏝️ AI Service: [CALL] Requesting for "${word}" (Attempt ${retries + 1})...`);

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are the AI spirit of Shelly Spanish Island.
      Provide a linguistic hint and a funny mnemonic for the Spanish word: "${word}" (Meaning: "${translation}").
      Keep it brief and engaging.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hint: { type: Type.STRING, description: 'Linguistic insight (max 10 words).' },
            mnemonics: { type: Type.STRING, description: 'Funny memory trick (max 15 words).' },
          },
          required: ["hint", "mnemonics"],
        },
      },
    });

    if (response.text) {
      console.debug(`🏝️ AI Service: [DONE] Success for "${word}"`);
      return JSON.parse(response.text.trim());
    }
    return null;
  } catch (error: any) {
    // Handle Rate Limiting (429)
    if (error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('quota')) {
      if (retries < MAX_RETRIES) {
        const waitTime = Math.pow(2, retries) * 2000 + Math.random() * 1000;
        console.warn(`🏝️ AI Service: Rate limited for "${word}". Retrying in ${Math.round(waitTime/1000)}s...`);
        await delay(waitTime);
        return getAISmartHint(word, translation, retries + 1);
      }
      console.error(`🏝️ AI Service: Max retries reached for "${word}" due to rate limits.`);
    } else {
      console.error(`🏝️ AI Service: [FAIL] for "${word}":`, error);
    }
    return null;
  }
};
