
/**
 * Shelly Spanish Island - Robust Audio Utility
 */

let voices: SpeechSynthesisVoice[] = [];

// 防止垃圾回收机制 (Garbage Collection) 导致语音中断
const keepAlive = (utterance: SpeechSynthesisUtterance) => {
  (window as any).currentUtterance = utterance;
};

// 预加载语音列表
export const initAudioSystem = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    const synth = window.speechSynthesis;
    
    // 1. 尝试立即获取
    const initialVoices = synth.getVoices();
    if (initialVoices.length > 0) {
      voices = initialVoices;
    }

    // 2. 监听异步加载
    synth.onvoiceschanged = () => {
      voices = synth.getVoices();
      console.log("🔊 Audio System: Voices loaded count:", voices.length);
    };
  }
};

export const playAudio = (text: string, onStart?: () => void, onEnd?: () => void) => {
  // 环境检查
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn("Speech Synthesis not supported");
    if (onEnd) onEnd();
    return;
  }

  const synth = window.speechSynthesis;

  // 1. 强制重置：如果在说话，立刻打断，防止队列卡死
  if (synth.speaking || synth.pending) {
    synth.cancel();
  }

  // 2. 再次尝试获取语音 (防止第一次点击时列表为空)
  if (voices.length === 0) {
    voices = synth.getVoices();
  }

  const utterance = new SpeechSynthesisUtterance(text);

  // 3. 优化的语音选择逻辑
  // 优先顺序：
  // 1. 西班牙语 + 本地服务 (LocalService) -> 响应最快，无需联网
  // 2. 西班牙语 + Google/Microsoft (高质量)
  // 3. 任何 'es' 开头的语音
  let bestVoice = voices.find(v => v.lang.toLowerCase().startsWith('es') && v.localService);
  
  if (!bestVoice) {
    bestVoice = voices.find(v => v.lang.toLowerCase().startsWith('es') && (v.name.includes('Google') || v.name.includes('Premium')));
  }

  if (!bestVoice) {
    bestVoice = voices.find(v => v.lang.toLowerCase().startsWith('es'));
  }

  if (bestVoice) {
    utterance.voice = bestVoice;
    utterance.lang = bestVoice.lang;
    // console.log("Using voice:", bestVoice.name, bestVoice.lang); // Debug log
  } else {
    // 兜底：如果没有找到任何西班牙语语音包，强制指定语言代码
    utterance.lang = 'es-ES';
  }

  // 4. 设置基本参数
  utterance.rate = 0.9; // 语速适中
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  // 5. 事件绑定
  utterance.onstart = () => {
    if (onStart) onStart();
  };

  utterance.onend = () => {
    if (onEnd) onEnd();
    (window as any).currentUtterance = null;
  };

  utterance.onerror = (e) => {
    console.warn("TTS Error event:", e);
    // 许多浏览器在 cancel() 时也会触发 error，这是正常的，可以忽略
    if (e.error !== 'interrupted') {
       if (onEnd) onEnd();
    }
    (window as any).currentUtterance = null;
  };

  // 6. 激活防回收机制
  keepAlive(utterance);

  // 7. 播放
  try {
    synth.speak(utterance);
  } catch (err) {
    console.error("TTS Speak exception:", err);
    if (onEnd) onEnd();
  }
};
