
export const playAudio = (text: string) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  // Cancel any ongoing speech to prevent overlapping
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Mobile Adjustment: Slightly slower rate sounds more natural on default mobile engines
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  utterance.rate = isMobile ? 0.85 : 0.9; 
  utterance.pitch = 1;
  utterance.volume = 1;

  // Voice Selection Strategy: "Make it sound human"
  const voices = window.speechSynthesis.getVoices();
  const targetLang = 'es'; // Target Spanish
  
  // Priority List for selecting the "Best" voice available on the device
  // 1. "Monica" / "Paulina" (iOS Premium Spanish)
  // 2. "Google" voices (Android/Chrome High Quality)
  const preferredVoices = [
    'Monica', 'Paulina', 'Jorge', 'Juan', // Apple Premium
    'Google español', 'Google Español', // Android Google TTS
    'Microsoft Helena', 'Microsoft Laura' // Windows
  ];

  let bestVoice = voices.find(v => 
    preferredVoices.some(name => v.name.includes(name)) && v.lang.startsWith(targetLang)
  );

  // Fallback: Try to find specific regions if premium voices aren't found
  if (!bestVoice) {
      // Prefer Mexico or Spain specifically
      bestVoice = voices.find(v => (v.lang === 'es-MX' || v.lang === 'es-ES') && !v.name.includes('Compact'));
  }

  // Final Fallback: Any Spanish voice
  if (!bestVoice) {
      bestVoice = voices.find(v => v.lang.startsWith(targetLang));
  }

  if (bestVoice) {
    utterance.voice = bestVoice;
    // CRITICAL: Set the utterance lang to the voice's specific lang (e.g., es-MX) 
    // to prevent the engine from trying to force a mismatching accent.
    utterance.lang = bestVoice.lang; 
  } else {
    // Default fallback if no voice object matches (rare)
    utterance.lang = 'es-ES';
  }
  
  window.speechSynthesis.speak(utterance);
};

// Initialization: Force browser to load voices immediately
// (Chrome sometimes returns empty voices array on first load without this)
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.getVoices();
}
