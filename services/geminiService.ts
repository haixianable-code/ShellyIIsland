
import { GoogleGenAI, Type } from "@google/genai";

// AI Word Info structure for smart hints
export interface AIWordInfo {
  hint: string;
  mnemonics: string;
}

/**
 * Generates a smart grammar hint and mnemonic for a word using Gemini 3 Flash.
 * Silent failure: Returns null on any error (quota, auth, network) to ensure "don't tell the customer" policy.
 */
export const getAISmartHint = async (word: string, translation: string): Promise<AIWordInfo | null> => {
  try {
    // The API key must be obtained exclusively from the environment variable process.env.API_KEY
    if (!process.env.API_KEY) {
      console.debug("AI Service: Missing API_KEY in process.env");
      return null;
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a short smart grammar hint and a funny mnemonic for the Spanish word "${word}" (English meaning: "${translation}"). Be creative and concise.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hint: {
              type: Type.STRING,
              description: 'A short, insightful grammar tip for this word (max 15 words).',
            },
            mnemonics: {
              type: Type.STRING,
              description: 'A funny or memorable trick to remember this word (max 20 words).',
            },
          },
          required: ["hint", "mnemonics"],
        },
      },
    });

    // Directly access .text property as per guidelines (not .text())
    const text = response.text;
    if (text) {
      return JSON.parse(text.trim());
    }
    return null;
  } catch (error) {
    // Silent failure for production.
    console.debug("AI generation failed silently:", error);
    return null;
  }
};
