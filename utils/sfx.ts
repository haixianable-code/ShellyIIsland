
// Organic & Tactile Sound Synthesizer
// 100% Code-generated Web Audio API. No external assets.

let audioCtx: AudioContext | null = null;
let isMuted = false;
let noiseBuffer: AudioBuffer | null = null;

const initAudio = () => {
  if (!audioCtx && typeof window !== 'undefined') {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx?.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  // Generate White Noise Buffer once
  if (audioCtx && !noiseBuffer) {
    const bufferSize = audioCtx.sampleRate * 2; // 2 seconds
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    noiseBuffer = buffer;
  }
  return audioCtx;
};

export const toggleMute = () => {
  isMuted = !isMuted;
  return isMuted;
};

export const getMuteState = () => isMuted;

// --- HELPERS ---
const createOsc = (ctx: AudioContext, type: OscillatorType, freq: number, startTime: number, duration: number) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(startTime);
  osc.stop(startTime + duration);
  return { osc, gain };
};

const createNoise = (ctx: AudioContext, startTime: number, duration: number) => {
  if (!noiseBuffer) initAudio();
  if (!noiseBuffer) return null;
  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer;
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start(startTime);
  source.stop(startTime + duration);
  return { source, gain, filter };
};

// --- SOUNDS ---

// 1. SWISH (Card Flip) - Organic Paper Sound
export const playSwish = () => {
  if (isMuted) return;
  const ctx = initAudio();
  if (!ctx) return;
  
  const now = ctx.currentTime;
  const noise = createNoise(ctx, now, 0.2);
  if (!noise) return;

  // Filter sweep to simulate air movement
  noise.filter.type = 'lowpass';
  noise.filter.frequency.setValueAtTime(1500, now);
  noise.filter.frequency.exponentialRampToValueAtTime(100, now + 0.15);
  
  noise.gain.gain.setValueAtTime(0.3, now);
  noise.gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
};

// 2. CLICK (Navigation) - Mechanical Switch
export const playClick = () => {
  if (isMuted) return;
  const ctx = initAudio();
  if (!ctx) return;

  const now = ctx.currentTime;
  const { gain } = createOsc(ctx, 'square', 800, now, 0.05);
  
  // Very short, snappy envelope
  gain.gain.setValueAtTime(0.1, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.03);
};

// 3. SHAKER (Hover Seed Pack) - Sand Sound
export const playShaker = () => {
  if (isMuted) return;
  const ctx = initAudio();
  if (!ctx) return;

  const now = ctx.currentTime;
  // Two quick shakes
  [0, 0.08].forEach(offset => {
    const t = now + offset;
    const noise = createNoise(ctx, t, 0.05);
    if (noise) {
      noise.filter.type = 'highpass';
      noise.filter.frequency.value = 3000;
      noise.gain.gain.setValueAtTime(0.1, t);
      noise.gain.gain.exponentialRampToValueAtTime(0.01, t + 0.04);
    }
  });
};

// 4. POP + SPARKLE (Open Pack / Success)
export const playSparkle = () => {
  if (isMuted) return;
  const ctx = initAudio();
  if (!ctx) return;
  const now = ctx.currentTime;

  // Pop
  const pop = createOsc(ctx, 'sine', 600, now, 0.1);
  pop.osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
  pop.gain.gain.setValueAtTime(0.3, now);
  pop.gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

  // Sparkles (High random pitches)
  for (let i = 0; i < 6; i++) {
    const t = now + 0.1 + (i * 0.05);
    const freq = 1200 + Math.random() * 1000;
    const spark = createOsc(ctx, 'sine', freq, t, 0.1);
    spark.gain.gain.setValueAtTime(0.1, t);
    spark.gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
  }
};

// 5. HIGH CHIME (Easy/Perfect) - Gem Sound
export const playHighChime = () => {
  if (isMuted) return;
  const ctx = initAudio();
  if (!ctx) return;
  const now = ctx.currentTime;

  // Two harmonics
  [880, 1760].forEach(freq => { // A5, A6
    const sound = createOsc(ctx, 'sine', freq, now, 0.8);
    sound.gain.gain.setValueAtTime(0.1, now);
    sound.gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
  });
};

// 6. HIGH WOOD (Good) - Solid Block
export const playHighWood = () => {
  if (isMuted) return;
  const ctx = initAudio();
  if (!ctx) return;
  const now = ctx.currentTime;

  const sound = createOsc(ctx, 'triangle', 400, now, 0.1);
  sound.gain.gain.setValueAtTime(0.2, now);
  sound.gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
};

// 7. LOW WOOD (Hard) - Hollow Block
export const playLowWood = () => {
  if (isMuted) return;
  const ctx = initAudio();
  if (!ctx) return;
  const now = ctx.currentTime;

  const sound = createOsc(ctx, 'triangle', 200, now, 0.15);
  sound.gain.gain.setValueAtTime(0.2, now);
  sound.gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
};

// 8. THUD (Forgot) - Soft Impact
export const playThud = () => {
  if (isMuted) return;
  const ctx = initAudio();
  if (!ctx) return;
  const now = ctx.currentTime;

  const sound = createOsc(ctx, 'sine', 100, now, 0.2);
  sound.osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);
  sound.gain.gain.setValueAtTime(0.3, now);
  sound.gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
};

// 9. FANFARE (Streak/Victory)
export const playFanfare = () => {
  if (isMuted) return;
  const ctx = initAudio();
  if (!ctx) return;
  const now = ctx.currentTime;

  // Major Chord Arpeggio
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, C
  notes.forEach((freq, i) => {
    const t = now + (i * 0.1);
    const sound = createOsc(ctx, 'triangle', freq, t, 1.0);
    sound.gain.gain.setValueAtTime(0.1, t);
    sound.gain.gain.exponentialRampToValueAtTime(0.01, t + 0.8);
  });
};
