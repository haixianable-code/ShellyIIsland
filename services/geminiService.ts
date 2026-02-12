
import { GoogleGenAI, Type } from "@google/genai";

// AI Word Info structure for smart hints
export interface AIWordInfo {
  hint: string;
  mnemonics: string;
}

/**
 * Generates a smart grammar hint and mnemonic for a word using Gemini 3 Flash.
 */
export const getAISmartHint = async (word: string, translation: string): Promise<AIWordInfo | null> => {
  try {
    // Accessing process.env.API_KEY as per mandatory instructions
    const apiKey = process.env.API_KEY;
    
    if (!apiKey) {
      console.warn("AI Service: API_KEY is missing from environment variables.");
      return null;
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are the spirit of "Shelly Spanish Island". 
      Provide a smart grammar tip and a funny mnemonic to help a student remember:
      Spanish Word: "${word}"
      Meaning: "${translation}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hint: {
              type: Type.STRING,
              description: 'A sharp, short linguistic insight (max 12 words).',
            },
            mnemonics: {
              type: Type.STRING,
              description: 'A weirdly funny way to remember this word (max 15 words).',
            },
          },
          required: ["hint", "mnemonics"],
        },
      },
    });

    // Directly access .text property (not a method)
    const text = response.text;
    if (text) {
      return JSON.parse(text.trim());
    }
    return null;
  } catch (error) {
    console.error("Gemini AI error:", error);
    return null;
  }
};
