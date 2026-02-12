
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
    // Check if API key is present
    if (!process.env.API_KEY) {
      return null;
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a smart grammar hint and a funny mnemonic for the Spanish word "${word}" (English: "${translation}").`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hint: {
              type: Type.STRING,
              description: 'A short, insightful grammar tip for this word.',
            },
            mnemonics: {
              type: Type.STRING,
              description: 'A funny or memorable trick to remember this word.',
            },
          },
          required: ["hint", "mnemonics"],
        },
      },
    });

    if (response && response.text) {
      return JSON.parse(response.text.trim());
    }
    return null;
  } catch (error) {
    // Silent failure for production. Log only for developer debugging.
    console.debug("AI generation skipped or failed silently:", error);
    return null;
  }
};

// Legacy placeholders for backward compatibility
export const generateExampleSentence = async () => null;
export const getGrammarExplanation = async () => null;
