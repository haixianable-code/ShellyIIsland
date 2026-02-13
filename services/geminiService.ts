// AI Word Info structure for smart hints
export interface AIWordInfo {
  hint: string;
  mnemonics: string;
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

/**
 * Diagnostic function to test the AI spirit connection via Backend.
 */
export const testAISpiritConnection = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'test', payload: {} })
    });

    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    const data = await res.json();
    
    return { 
      success: !!data.text, 
      message: data.text || "Connected but received empty response." 
    };
  } catch (error: any) {
    return { 
      success: false, 
      message: error.message || "Error connecting to Island Spirit API." 
    };
  }
};

/**
 * Generates a smart grammar hint and mnemonic via Backend.
 */
export const getAISmartHint = async (word: string, translation: string, retries = 0): Promise<AIWordInfo | null> => {
  const MAX_RETRIES = 3;
  
  try {
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        action: 'hint', 
        payload: { word, translation } 
      })
    });

    if (res.status === 429 && retries < MAX_RETRIES) {
      const waitTime = Math.pow(2, retries) * 1000;
      await delay(waitTime);
      return getAISmartHint(word, translation, retries + 1);
    }

    if (!res.ok) return null;

    const data = await res.json();
    return data; 
  } catch (error) {
    console.debug("AI generation failed silently:", error);
    return null;
  }
};

/**
 * Validates a user's sentence using the word via Backend.
 */
export const getAIChallengeFeedback = async (word: string, sentence: string): Promise<string | null> => {
  try {
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        action: 'challenge', 
        payload: { word, sentence } 
      })
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.text;
  } catch (error) {
    console.error("Challenge failed:", error);
    return null;
  }
};