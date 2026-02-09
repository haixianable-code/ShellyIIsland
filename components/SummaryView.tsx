import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Word } from '../types';
import { useTranslation } from 'react-i18next';
import { getTypeTheme } from '../utils/theme';
import { 
  Share2, Home, Volume2, TreePalm, Map, Leaf, ArrowRight,
  Flame, Sprout, Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playFanfare, playClick } from '../utils/sfx';
import { playAudio } from '../utils/audio';
// @ts-ignore
import html2canvas from 'html2canvas';

const WordPill: React.FC<{ word: Word; index: number; forceVisible: boolean }> = ({ word, index, forceVisible }) => {
  const { t } = useTranslation();
  const theme = getTypeTheme(word);
  const [isPlaying, setIsPlaying] = useState(false);
  
  return (
    <button 
      type="button"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsPlaying(true); playAudio(word.s, undefined, () => setIsPlaying(false)); try { playClick(); } catch (err) {} }} 
      className={`inline-flex items-center justify-center gap-3 px-5 py-3 rounded-full shadow-sm border-[3px] border-white/40 transition-all select-none outline-none relative overflow-hidden ${forceVisible ? 'opacity-100 scale-100 translate-y-0 animate-none' : 'animate-zoomIn active:scale-95 hover:scale-110 hover:z-10 hover:shadow-lg'} ${isPlaying ? 'ring-4 ring-white/50 scale-105 z-20' : ''}`} 
      style={{ backgroundColor: theme.main, color: 'white', animationDelay: forceVisible ? '0s' : `${Math.min(index * 0.04, 1.5)}s`, animationFillMode: 'both' }}
    >
      <span className="font-black text-lg md:text-xl drop-shadow-sm leading-none uppercase tracking-tighter">{word.s}</span>
      <div className="w-[2px] h-4 bg-white/40 rounded-full shrink-0" />
      <span className="text-xs md:text-sm font-bold opacity-90 leading-none uppercase tracking-tight">{t(`vocab.${word.id}.t`, { defaultValue: word.t })}</span>
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => playFanfare(), 500);
    const duration = 2000;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#ff7043', '#8bc34a', '#29b6f6', '#ab47bc'] });
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#ff7043', '#8bc34a', '#29b6f6', '#ab47bc'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

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

  return (
    <div className="flex-1 flex flex-col items-center py-8 px-4 md:py-12 md:px-12 animate-fadeIn bg-[#f7f9e4] h-[100dvh] overflow-y-auto no-scrollbar pb-32">
      <div ref={captureRef} className="relative w-full max-w-xl flex flex-col items-center bg-[#f7f9e4] p-8 rounded-[3rem]">
        <div className="text-center mb-10 relative z-10 mt-4">
           <div className="inline-flex items-center justify-center gap-3 mb-4 animate-bounce-slight">
              <div className="bg-[#ffa600] p-4 rounded-full shadow-lg border-2 border-white text-white"><Leaf size={28} fill="currentColor" /></div>
           </div>
           {/* 修复：将 "+" 和 数字统一为相同大小，消除基准线偏差 */}
           <h1 className="text-[6rem] md:text-[8rem] leading-none font-black text-[#4b7d78] tracking-tighter drop-shadow-sm flex items-center justify-center gap-2 uppercase">
              <span className="opacity-40">+</span>
              <span>{dailyHarvest.length}</span>
           </h1>
           <p className="text-[#8bc34a] font-black uppercase tracking-[0.3em] text-xs md:text-sm mt-4 bg-white/60 inline-block px-5 py-2 rounded-full border border-white/50">
             {t('ui.study.today_harvest')}
           </p>
        </div>
        <div className="w-full relative z-20 mb-12"><div className="flex flex-wrap justify-center gap-3 md:gap-4 p-2 min-h-[100px]">{dailyHarvest.length > 0 ? dailyHarvest.map((w, idx) => (<WordPill key={w.id} word={w} index={idx} forceVisible={isCapturing} />)) : (<div className="text-center opacity-40 font-black uppercase tracking-widest">{t('ui.study.seeding')}</div>)}</div></div>
        <div className="grid grid-cols-2 gap-4 w-full px-2 mb-10"><div className="bg-white p-5 rounded-[2.5rem] shadow-sm border-4 border-[#fff3e0] flex flex-col items-center justify-center relative overflow-hidden"><span className="text-4xl font-black text-[#f57c00] tracking-tighter leading-none">{streak}</span><span className="text-[10px] font-black uppercase text-[#ffcc80] tracking-widest mt-2">{t('ui.study.day_streak')}</span></div><div className="bg-white p-5 rounded-[2.5rem] shadow-sm border-4 border-[#e8f5e9] flex flex-col items-center justify-center relative overflow-hidden"><span className="text-4xl font-black text-[#2e7d32] tracking-tighter leading-none">{totalLearned}</span><span className="text-[10px] font-black uppercase text-[#a5d6a7] tracking-widest mt-2">{t('ui.study.total_growth')}</span></div></div>
        <div className="flex flex-col items-center gap-2 pb-6 pt-8 border-t-2 border-[#e0d9b4]/20 w-full"><div className="text-[#4b7d78] text-2xl md:text-3xl font-black uppercase tracking-widest border-b-4 border-[#ffa600] leading-none pb-1">SSISLAND.SPACE</div></div>
      </div>
      <div className="w-full max-w-lg mt-6 space-y-3 px-2 relative z-50">
        <button onClick={handleShare} disabled={isGenerating} className="w-full bg-[#ffa600] text-white py-5 rounded-[2.5rem] font-black text-xl shadow-[0_8px_0_#e65100] border-4 border-white bubble-button flex items-center justify-center gap-3 hover:bg-[#ffb74d] transition-all disabled:opacity-70">{isGenerating ? <Loader2 className="animate-spin" /> : <Share2 size={22} />}<span>{isGenerating ? t('ui.actions.generating') : t('ui.actions.share_harvest')}</span></button>
        <button onClick={onFinish} className="w-full bg-white text-[#4b7d78] py-4 rounded-[2rem] font-black text-lg transition-all active:scale-95 flex items-center justify-center gap-2 border-4 border-transparent hover:border-[#e0d9b4] shadow-sm uppercase tracking-tighter"><ArrowRight size={20} /><span>{t('ui.actions.continue_learning')}</span></button>
      </div>
    </div>
  );
};

export default SummaryView;