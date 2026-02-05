
export const playAudio = (text: string) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  // Cancel any ongoing speech to prevent overlapping
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.8; // Slightly slower than default for better pronunciation clarity
  utterance.pitch = 1;
  utterance.volume = 1;

  // Voice Selection Strategy: "Make it sound human"
  const voices = window.speechSynthesis.getVoices();
  const targetLang = 'es'; // Target Spanish
  
  // Priority List for selecting the "Best" voice available on the device
  const bestVoice = 
    // 1. Google Voices (Chrome - usually very natural)
    voices.find(v => v.name.includes('Google') && v.lang.startsWith(targetLang)) ||
    // 2. iOS/macOS Premium Voices (Monica is the top-tier Spanish voice on Apple)
    voices.find(v => v.name === 'Monica') ||
    voices.find(v => v.name === 'Jorge') ||
    voices.find(v => v.name === 'Paulina') ||
    // 3. Any "Premium" or "Enhanced" Spanish voice (generic detection)
    voices.find(v => v.lang.startsWith(targetLang) && (v.name.includes('Premium') || v.name.includes('Enhanced') || v.name.includes('Natural'))) ||
    // 4. Fallback: Spain Spanish
    voices.find(v => v.lang === 'es-ES') ||
    // 5. Fallback: Any Spanish
    voices.find(v => v.lang.startsWith(targetLang));

  if (bestVoice) {
    utterance.voice = bestVoice;
    // CRITICAL: Set the utterance lang to the voice's specific lang (e.g., es-MX) 
    // to prevent the engine from trying to force an accent that doesn't match the voice.
    utterance.lang = bestVoice.lang; 
  } else {
    utterance.lang = 'es-ES';
  }
  
  window.speechSynthesis.speak(utterance);
};

// Initialization: Force browser to load voices immediately
// (Chrome sometimes returns empty voices array on first load without this)
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.getVoices();
}
