
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Word } from '../types';
import { useTranslation } from 'react-i18next';
import { getTypeTheme } from '../utils/theme';
import { 
  Share2, Home, Volume2, TreePalm, Sparkles, Map, Leaf, ArrowRight,
  CheckCircle2, Flame, Sprout, Loader2, Play
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playFanfare, playClick, playSparkle } from '../utils/sfx';
import { playAudio } from '../utils/audio';
import html2canvas from 'html2canvas';

// Custom hook for number counting animation
const useCountUp = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      // Ease out expo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setCount(Math.floor(ease * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration]);

  return count;
};

// 单个单词胶囊组件
const WordPill: React.FC<{ word: Word; index: number; forceVisible: boolean }> = ({ word, index, forceVisible }) => {
  const { t } = useTranslation();
  const theme = getTypeTheme(word);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const handleWordClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPlaying(true);
    playAudio(word.s, undefined, () => setIsPlaying(false));
    try { playClick(); } catch (err) {}
  };

  return (
    <button 
      type="button"
      onClick={handleWordClick}
      className={`
        inline-flex items-center justify-center gap-3 px-5 py-3 rounded-full shadow-sm border-[3px] border-white/40 
        transition-all select-none outline-none relative overflow-hidden
        ${forceVisible 
           ? 'opacity-100 scale-100 translate-y-0 animate-none' 
           : 'animate-zoomIn active:scale-95 hover:scale-110 hover:z-10 hover:shadow-lg'
        }
        ${isPlaying ? 'ring-4 ring-white/50 scale-105 z-20' : ''}
      `}
      style={{ 
        backgroundColor: theme.main, 
        color: 'white',
        // If forceVisible is true (during capture), remove delay to ensure it renders immediately
        animationDelay: forceVisible ? '0s' : `${Math.min(index * 0.04, 1.5)}s`,
        animationFillMode: 'both'
      }}
    >
      {/* Word Text */}
      <span className="font-black text-lg md:text-xl drop-shadow-md pb-[2px] leading-none">{word.s}</span>
      
      {/* Vertical Separator */}
      <div className="w-[2px] h-4 bg-white/40 rounded-full shrink-0" />
      
      {/* Translation Text */}
      <span className="text-xs md:text-sm font-bold opacity-90 pb-[1px] leading-none">
        {t(`vocab.${word.id}.t`, { defaultValue: word.t })}
      </span>
      
      {/* Glossy effect overlay */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-white/10 pointer-events-none" />
    </button>
  );
};

interface SummaryViewProps {
  words: Word[]; // Session words (just for reference if needed, but we use dailyHarvest mostly)
  dailyHarvest: Word[]; // All words learned today
  totalLearned: number;
  streak: number;
  user: any;
  onFinish: () => void;
  onLoginRequest: () => void;
}

const SummaryView: React.FC<SummaryViewProps> = ({ dailyHarvest, totalLearned, streak, user, onFinish, onLoginRequest }) => {
  const { t } = useTranslation();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false); // New state to control visibility during capture
  const captureRef = useRef<HTMLDivElement>(null);

  // Randomize words for the "Pile" effect
  const shuffledWords = useMemo(() => {
    return [...dailyHarvest].sort(() => 0.5 - Math.random());
  }, [dailyHarvest]);
  
  // Animations
  const displayTotalHarvest = useCountUp(dailyHarvest.length);
  const displayStreak = useCountUp(streak);

  useEffect(() => {
    // Delayed fanfare to match the counter finishing
    setTimeout(() => playFanfare(), 500);
    
    // Multiple confetti bursts for "Abundance" feel
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff7043', '#8bc34a', '#29b6f6', '#ab47bc']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff7043', '#8bc34a', '#29b6f6', '#ab47bc']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const handleShare = async () => {
    playClick();
    if (!captureRef.current) return;
    
    setIsGenerating(true);
    setIsCapturing(true); // Disable animations immediately
    
    // Slight delay to ensure React renders the 'forceVisible' state before capturing
    await new Promise(resolve => setTimeout(resolve, 200));

    try {
      const canvas = await html2canvas(captureRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#f7f9e4',
        logging: false,
        // Force full dimensions to avoid clipping
        windowWidth: captureRef.current.scrollWidth,
        windowHeight: captureRef.current.scrollHeight
      });

      canvas.toBlob(async (blob) => {
        if (!blob) {
          setIsGenerating(false);
          setIsCapturing(false);
          return;
        }
        
        const file = new File([blob], 'shelly-harvest.png', { type: 'image/png' });

        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              // Explicitly removed title/text/url to force image-only share on supporting platforms
            });
          } catch (err) {
            console.log('Share canceled');
          }
        } else {
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = 'shelly-harvest.png';
          link.click();
        }
        setIsGenerating(false);
        setIsCapturing(false);
      }, 'image/png');

    } catch (err) {
      console.error("Image generation failed", err);
      setIsGenerating(false);
      setIsCapturing(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center py-8 px-4 md:py-12 md:px-12 animate-fadeIn bg-[#f7f9e4] h-[100dvh] overflow-y-auto no-scrollbar pb-32">
      
      {/* --- CAPTURE AREA --- */}
      <div ref={captureRef} className="relative w-full max-w-xl flex flex-col items-center bg-[#f7f9e4] p-8 rounded-[3rem]">
        
        {/* Background Decor */}
        <div className="absolute top-10 -left-10 opacity-5 -rotate-12 pointer-events-none"><TreePalm size={200} /></div>
        <div className="absolute bottom-40 -right-10 opacity-5 rotate-12 pointer-events-none"><Map size={200} /></div>

        {/* 1. Header: The Big Counter */}
        <div className="text-center mb-10 relative z-10 mt-4">
           <div className={`inline-flex items-center justify-center gap-3 mb-2 ${isCapturing ? '' : 'animate-bounce-slight'}`}>
              <div className="bg-[#ffa600] p-4 rounded-full shadow-lg border-2 border-white text-white">
                <Leaf size={28} fill="currentColor" />
              </div>
           </div>
           
           <h1 className="text-[5rem] md:text-[6.5rem] leading-none font-black text-[#4b7d78] tracking-tighter drop-shadow-sm flex items-baseline justify-center gap-1">
              <span className="text-4xl md:text-5xl opacity-40">+</span>
              <span>{isCapturing ? dailyHarvest.length : displayTotalHarvest}</span>
           </h1>
           <p className="text-[#8bc34a] font-black uppercase tracking-[0.3em] text-xs md:text-sm mt-2 bg-white/60 inline-block px-5 py-2 rounded-full border border-white/50">
             {t('ui.study.today_harvest')}
           </p>
        </div>

        {/* 2. The Abundance Pile (Word Cloud) */}
        <div className="w-full relative z-20 mb-12">
           <div className="flex flex-wrap justify-center gap-3 md:gap-4 p-2 min-h-[100px]">
              {shuffledWords.length > 0 ? (
                shuffledWords.map((w, idx) => (
                  <WordPill 
                    key={w.id} 
                    word={w} 
                    index={idx} 
                    forceVisible={isCapturing} // Pass down state to force visibility
                  />
                ))
              ) : (
                <div className="text-center opacity-40 font-bold italic">Seeding...</div>
              )}
           </div>
        </div>

        {/* 3. Footer Stats (Streak & Total) */}
        <div className="grid grid-cols-2 gap-4 w-full px-2 mb-10">
           <div className="bg-white p-5 rounded-[2.5rem] shadow-sm border-4 border-[#fff3e0] flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute -right-2 -top-2 opacity-10 rotate-12"><Flame size={60} /></div>
              <span className="text-4xl font-black text-[#f57c00]">{isCapturing ? streak : displayStreak}</span>
              <span className="text-[10px] font-black uppercase text-[#ffcc80] tracking-widest mt-1">{t('ui.study.day_streak')}</span>
           </div>
           <div className="bg-white p-5 rounded-[2.5rem] shadow-sm border-4 border-[#e8f5e9] flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute -right-2 -top-2 opacity-10 rotate-12"><Sprout size={60} /></div>
              <span className="text-4xl font-black text-[#2e7d32]">{totalLearned}</span>
              <span className="text-[10px] font-black uppercase text-[#a5d6a7] tracking-widest mt-1">{t('ui.study.total_growth')}</span>
           </div>
        </div>

        {/* Branding Footer - Domain Logo */}
        <div className="flex flex-col items-center gap-2 pb-6 pt-8 border-t-2 border-[#e0d9b4]/20 w-full">
           <div className="text-[#4b7d78] text-2xl md:text-3xl font-black uppercase tracking-widest font-mono border-b-4 border-[#ffa600] leading-none pb-1">
             SSISLAND.SPACE
           </div>
        </div>

      </div>

      {/* --- ACTION BUTTONS --- */}
      <div className="w-full max-w-lg mt-6 space-y-3 px-2 relative z-50">
        <button 
          onClick={handleShare}
          disabled={isGenerating}
          className="w-full bg-[#ffa600] text-white py-5 rounded-[2.5rem] font-black text-xl shadow-[0_8px_0_#e65100] border-4 border-white bubble-button flex items-center justify-center gap-3 active:translate-y-2 active:shadow-none transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:bg-[#ffb74d]"
        >
          {isGenerating ? <Loader2 className="animate-spin" /> : <Share2 size={22} />}
          <span>{isGenerating ? t('ui.actions.generating') : t('ui.actions.share_harvest')}</span>
        </button>
        
        <button 
          onClick={onFinish} 
          className="w-full bg-white text-[#4b7d78] py-4 rounded-[2rem] font-black text-lg transition-all active:scale-95 flex items-center justify-center gap-2 border-4 border-transparent hover:border-[#e0d9b4] shadow-sm"
        >
          <ArrowRight size={20} />
          <span>{t('ui.actions.continue_learning')}</span>
        </button>
      </div>

    </div>
  );
};

export default SummaryView;
