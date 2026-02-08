
/**
 * Shelly Spanish Island - Robust Audio Utility
 */

// 保持引用防止垃圾回收（GC Protection）
const activeUtterances = new Set<SpeechSynthesisUtterance>();
let voices: SpeechSynthesisVoice[] = [];

// 尝试加载语音列表
const loadVoices = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    voices = window.speechSynthesis.getVoices();
  }
};

// 初始化监听
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = loadVoices;
  // 立即尝试加载一次
  loadVoices();
}

export const playAudio = (text: string, onStart?: () => void, onEnd?: () => void) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  const synth = window.speechSynthesis;

  // 1. 强制重置状态：如果正在说话，先取消，防止队列卡死
  if (synth.speaking || synth.pending) {
    synth.cancel();
  }

  // 2. 再次尝试获取语音（Chrome Android 有时需要懒加载）
  if (voices.length === 0) {
    voices = synth.getVoices();
  }

  const utterance = new SpeechSynthesisUtterance(text);

  // 3. 极其宽容的语音选择逻辑
  // 优先找西班牙语系 (es-ES, es-MX, es-US 等)
  const esVoices = voices.filter(v => v.lang.toLowerCase().startsWith('es'));
  
  // 尝试找高质量语音 (Google, Monica, Paulina)
  let bestVoice = esVoices.find(v => 
    v.name.includes('Google') || 
    v.name.includes('Premium') || 
    v.name.includes('Monica') || 
    v.name.includes('Paulina')
  );

  // 如果没有高质量，取任意一个西班牙语
  if (!bestVoice && esVoices.length > 0) {
    bestVoice = esVoices[0];
  }

  // 设置语音或兜底语言
  if (bestVoice) {
    utterance.voice = bestVoice;
    utterance.lang = bestVoice.lang;
  } else {
    // 关键兜底：如果没有找到语音包，直接强制指定语言代码
    // 大多数现代浏览器会自动匹配默认 TTS 引擎
    utterance.lang = 'es-ES';
  }

  utterance.rate = 0.9; // 语速稍慢，适合学习
  utterance.volume = 1.0;

  // 4. 事件绑定
  utterance.onstart = () => {
    activeUtterances.add(utterance);
    if (onStart) onStart();
  };

  utterance.onend = () => {
    activeUtterances.delete(utterance);
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    console.warn("TTS Error:", e);
    activeUtterances.delete(utterance);
    if (onEnd) onEnd();
  };

  // 5. 播放
  try {
    synth.speak(utterance);
  } catch (err) {
    console.error("TTS Speak exception:", err);
    if (onEnd) onEnd();
  }
};
