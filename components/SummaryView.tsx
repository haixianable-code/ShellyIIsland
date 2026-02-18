
import React, { useState, useEffect, useRef } from 'react';
import { Word } from '../types';
import { useTranslation } from 'react-i18next';
import { getTypeTheme } from '../utils/theme';
import { 
  Share2, Leaf, ArrowRight,
  Flame, Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playFanfare, playClick } from '../utils/sfx';
import { playAudio } from '../utils/audio';
// @ts-ignore
import html2canvas from 'html2canvas';
import { useIslandStore } from '../store/useIslandStore';

// Sub-components (Story Interceptors)
import GiftUnboxing from './summary/GiftUnboxing';
import TrialCountdown from './summary/TrialCountdown';
import CliffHanger from './summary/CliffHanger';

const WordPill: React.FC<{ word: Word; index: number; forceVisible: boolean }> = ({ word, index, forceVisible }) => {
  const { t } = useTranslation();
  const theme = getTypeTheme(word);
  const [isPlaying, setIsPlaying] = useState(false);
  
  return (
    <button 
      type="button"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsPlaying(true); playAudio(word.s, undefined, () => setIsPlaying(false)); try { playClick(); } catch (err) {} }} 
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full shadow-sm border-2 border-white/40 transition-all select-none outline-none relative overflow-hidden ${forceVisible ? 'opacity-100 scale-100 translate-y-0 animate-none' : 'animate-zoomIn active:scale-95 hover:scale-105 hover:z-10 hover:shadow-lg'} ${isPlaying ? 'ring-4 ring-white/30 scale-105 z-20' : ''}`} 
      style={{ backgroundColor: theme.main, color: 'white', animationDelay: forceVisible ? '0s' : `${Math.min(index * 0.04, 1.2)}s`, animationFillMode: 'both' }}
    >
      <span className="font-black text-base md:text-lg drop-shadow-sm leading-none uppercase tracking-tighter">{word.s}</span>
      <div className="w-[1px] h-3 bg-white/30 rounded-full shrink-0" />
      <span className="text-[10px] font-bold opacity-90 leading-none uppercase tracking-tight">{t(`vocab.${word.id}.t`, { defaultValue: word.t })}</span>
    </button>
  );
};

interface SummaryViewProps {
  words: Word[];
  dailyHarvest: Word[];
  totalLearned: number;
  streak: number;
  user: any;
  onFinish: () => void;
  onLoginRequest: () => void;
}

const SummaryView: React.FC<SummaryViewProps> = ({ dailyHarvest, totalLearned, streak, user, onFinish, onLoginRequest }) => {
  const { t } = useTranslation();
  const { trialStatus, trialEndsAt, activateTrial, checkTrialStatus, profile } = useIslandStore();
  
  // Internal State for Narrative Flow
  const [viewState, setViewState] = useState<'loading' | 'gift' | 'cliff' | 'summary'>('loading');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Check Expiration
    checkTrialStatus();

    // 2. Determine Initial View State
    const determineState = () => {
        // Scenario A: Day 1 (or small streak) + No Trial + No Premium -> GIFT
        // Using streak <= 2 to be generous
        if (streak > 0 && streak <= 2 && trialStatus === 'none' && !profile?.is_premium) {
            return 'gift';
        }
        
        // Scenario C: Expired Trial -> CLIFF
        // Check if explicitly expired in this session
        if (trialStatus === 'expired') {
            return 'cliff';
        }

        // Default: Standard Summary
        return 'summary';
    };

    const nextState = determineState();
    setViewState(nextState);

    // If standard summary, play effects immediately
    if (nextState === 'summary') {
        triggerSummaryEffects();
    }

  }, [streak, trialStatus, profile?.is_premium, checkTrialStatus]);

  const triggerSummaryEffects = () => {
    setTimeout(() => playFanfare(), 300);
    const duration = 2000;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#ff7043', '#8bc34a', '#29b6f6', '#ab47bc'] });
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#ff7043', '#8bc34a', '#29b6f6', '#ab47bc'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  };

  const handleGiftOpened = () => {
      activateTrial(); // Update store state
      setTimeout(() => {
          setViewState('summary'); // Transition to summary
          triggerSummaryEffects(); // Play confetti
      }, 1500); // Wait for confetti from GiftUnboxing to settle slightly
  };

  const handleShare = async () => {
    playClick();
    if (!captureRef.current) return;
    setIsGenerating(true);
    setIsCapturing(true);
    await new Promise(resolve => setTimeout(resolve, 200));
    try {
      const canvas = await html2canvas(captureRef.current, { scale: 2, useCORS: true, backgroundColor: '#f7f9e4', logging: false });
      canvas.toBlob(async (blob) => {
        if (!blob) { setIsGenerating(false); setIsCapturing(false); return; }
        const file = new File([blob], 'shelly-harvest.png', { type: 'image/png' });
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          try { await navigator.share({ files: [file] }); } catch (err) {}
        } else {
          const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'shelly-harvest.png'; link.click();
        }
        setIsGenerating(false); setIsCapturing(false);
      }, 'image/png');
    } catch (err) { setIsGenerating(false); setIsCapturing(false); }
  };

  // --- RENDER LOGIC ---

  if (viewState === 'loading') return null;

  if (viewState === 'gift') {
      return (
          <div className="flex-1 flex flex-col items-center justify-center h-[100dvh] bg-[#f7f9e4] p-4">
              <GiftUnboxing onOpen={handleGiftOpened} />
          </div>
      );
  }

  if (viewState === 'cliff') {
      return (
          <div className="flex-1 flex flex-col items-center justify-center h-[100dvh] bg-[#f7f9e4] p-4">
              <CliffHanger />
          </div>
      );
  }

  // Standard Summary (includes Trial Countdown if active)
  return (
    <div className="flex-1 flex flex-col items-center py-6 px-4 md:py-10 md:px-12 animate-fadeIn bg-[#f7f9e4] h-[100dvh] overflow-y-auto no-scrollbar pb-32">
      
      {/* Scenario B: Active Trial Banner */}
      {trialStatus === 'active' && trialEndsAt && (
          <TrialCountdown endsAt={trialEndsAt} />
      )}

      <div ref={captureRef} className="relative w-full max-w-lg flex flex-col items-center bg-[#f7f9e4] p-6 md:p-8 rounded-[2.5rem]">
        <div className="text-center mb-8 relative z-10 mt-2">
           <div className="inline-flex items-center justify-center gap-3 mb-4">
              <div className="bg-[#ffa600] p-3 rounded-full shadow-md border-2 border-white text-white"><Leaf size={24} fill="currentColor" /></div>
           </div>
           <h1 className="text-7xl md:text-8xl leading-none font-black text-[#4b7d78] tracking-tighter drop-shadow-sm flex items-center justify-center gap-2 uppercase">
              <span className="opacity-30 text-4xl md:text-5xl">+</span>
              <span>{dailyHarvest.length}</span>
           </h1>
           <p className="text-[#8bc34a] font-black uppercase tracking-[0.2em] text-[10px] md:text-xs mt-3 bg-white/60 inline-block px-4 py-1.5 rounded-full border border-white/40">
             {t('ui.study.today_harvest')}
           </p>
        </div>
        <div className="w-full relative z-20 mb-10"><div className="flex flex-wrap justify-center gap-2.5 p-1 min-h-[80px]">{dailyHarvest.length > 0 ? dailyHarvest.map((w, idx) => (<WordPill key={w.id} word={w} index={idx} forceVisible={isCapturing} />)) : (<div className="text-center opacity-40 font-black uppercase tracking-widest text-xs">{t('ui.study.seeding')}</div>)}</div></div>
        <div className="grid grid-cols-2 gap-3 w-full px-1 mb-8"><div className="bg-white p-4 rounded-3xl shadow-sm border-2 border-[#fff3e0] flex flex-col items-center justify-center"><span className="text-3xl font-black text-[#f57c00] tracking-tighter leading-none">{streak}</span><span className="text-[8px] font-black uppercase text-[#ffcc80] tracking-widest mt-1.5">{t('ui.study.day_streak')}</span></div><div className="bg-white p-4 rounded-3xl shadow-sm border-2 border-[#e8f5e9] flex flex-col items-center justify-center"><span className="text-3xl font-black text-[#2e7d32] tracking-tighter leading-none">{totalLearned}</span><span className="text-[8px] font-black uppercase text-[#a5d6a7] tracking-widest mt-1.5">{t('ui.study.total_growth')}</span></div></div>
        <div className="flex flex-col items-center gap-1.5 pb-4 pt-6 border-t border-[#e0d9b4]/30 w-full"><div className="text-[#4b7d78] text-lg md:text-xl font-black uppercase tracking-widest border-b-2 border-[#ffa600] leading-none pb-0.5 opacity-60">SSISLAND.SPACE</div></div>
      </div>
      <div className="w-full max-w-lg mt-4 space-y-3 px-2 relative z-50">
        <button onClick={handleShare} disabled={isGenerating} className="w-full bg-[#ffa600] text-white py-4 md:py-5 rounded-3xl font-black text-lg shadow-[0_6px_0_#e65100] border-2 md:border-4 border-white bubble-button flex items-center justify-center gap-2.5 hover:bg-[#ffb74d] transition-all disabled:opacity-70">{isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Share2 size={20} />}<span>{isGenerating ? t('ui.actions.generating') : t('ui.actions.share_harvest')}</span></button>
        <button onClick={onFinish} className="w-full bg-white text-[#4b7d78] py-3.5 rounded-2xl font-black text-base transition-all active:scale-95 flex items-center justify-center gap-2 border-2 border-transparent hover:border-[#e0d9b4] shadow-sm uppercase tracking-tight"><ArrowRight size={18} /><span>{t('ui.actions.continue_learning')}</span></button>
      </div>
    </div>
  );
};

export default SummaryView;
