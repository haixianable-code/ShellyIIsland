import { GoogleGenAI, Type } from "@google/genai";

// AI Word Info structure for smart hints
export interface AIWordInfo {
  hint: string;
  mnemonics: string;
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

/**
 * Diagnostic function to test the AI spirit connection.
 * This is the function called in the Menu Settings to check connectivity.
 */
export const testAISpiritConnection = async (): Promise<{ success: boolean; message: string }> => {
  try {
    // 🏝️ Fix: Directly use process.env.API_KEY in the initialization as per GenAI coding guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Say 'Success' in Spanish.",
    });
    
    return { 
      success: !!response.text, 
      message: response.text || "Connected but received empty response." 
    };
  } catch (error: any) {
    return { 
      success: false, 
      message: error.message || "Unknown error connecting to Gemini API." 
    };
  }
};

/**
 * Generates a smart grammar hint and mnemonic for a word using Gemini 3 Flash.
 * Includes exponential backoff for rate limits.
 */
export const getAISmartHint = async (word: string, translation: string, retries = 0): Promise<AIWordInfo | null> => {
  const MAX_RETRIES = 3;
  
  try {
    // 🏝️ Fix: Directly use process.env.API_KEY in the initialization as per GenAI coding guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
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

    const text = response.text;
    if (text) {
      return JSON.parse(text.trim());
    }
    return null;
  } catch (error: any) {
    // Handle Rate Limiting (429)
    if ((error?.status === 429 || error?.message?.includes('429')) && retries < MAX_RETRIES) {
      const waitTime = Math.pow(2, retries) * 5000;
      await delay(waitTime);
      return getAISmartHint(word, translation, retries + 1);
    }
    console.debug("AI generation failed silently:", error);
    return null;
  }
};