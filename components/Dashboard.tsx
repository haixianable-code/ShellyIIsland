
import React, { useState, useEffect, useMemo } from 'react';
import { Word, UserStats } from '../types';
import { ISLAND_SLANG, VOCABULARY_DATA } from '../constants';
import { playClick, playSparkle, playSwish } from '../utils/sfx';
import CrateRevealModal from './CrateRevealModal';
import { 
  Sprout, 
  CloudRain, 
  Shovel, 
  GlassWater, 
  Star, 
  Snail, 
  ArrowRight, 
  Leaf, 
  Flower2,
  TreePalm,
  RotateCw,
  PackagePlus,
  Gift,
  Sun,
  Moon,
  List,
  Flame,
  Cloud
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DashboardProps {
  progress: any;
  stats: UserStats | null;
  wordsDue: number;
  newWordsAvailable: number;
  unlearnedExtraWords: Word[];
  newWordsList?: Word[];
  learnedToday?: Word[];
  onStartStudy: () => void;
  onStartReview: () => void;
  onGetSeedPack: () => void;
  onWordClick?: (word: Word) => void;
  onViewAllHarvest?: () => void;
}

const TITLE_WORDS = ['¡Vamos', '¡Fiesta', '¡Amigo', '¡Suerte', '¡Isla', '¡Sol', '¡Vida', '¡Hola', '¡Baila', '¡Ríe'];

const Dashboard: React.FC<DashboardProps> = ({ 
  stats,
  wordsDue, 
  newWordsAvailable, 
  unlearnedExtraWords,
  newWordsList = [],
  learnedToday = [],
  onStartStudy, 
  onStartReview,
  onGetSeedPack,
  onWordClick,
  onViewAllHarvest
}) => {
  const { t } = useTranslation();
  
  const [slangIndex, setSlangIndex] = useState(() => Math.floor(Math.random() * ISLAND_SLANG.length));
  const [isRotating, setIsRotating] = useState(false);
  const [titleWord, setTitleWord] = useState(TITLE_WORDS[0]);
  const [showCrateModal, setShowCrateModal] = useState(false);

  const [crateTracker, setCrateTracker] = useState<{date: string, count: number}>({ date: '', count: 0 });

  useEffect(() => {
    setTitleWord(TITLE_WORDS[Math.floor(Math.random() * TITLE_WORDS.length)]);
    const today = new Date().toISOString().split('T')[0];
    const stored = localStorage.getItem('ssi_crate_tracker');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.date === today) setCrateTracker(parsed);
      else setCrateTracker({ date: today, count: 0 });
    } else {
       setCrateTracker({ date: today, count: 0 });
    }
  }, []);

  const rotateSlang = () => {
    playSwish();
    setIsRotating(true);
    setTimeout(() => {
      let nextIndex;
      do { nextIndex = Math.floor(Math.random() * ISLAND_SLANG.length); } while (nextIndex === slangIndex && ISLAND_SLANG.length > 1);
      setSlangIndex(nextIndex);
      setIsRotating(false);
    }, 150);
  };

  const currentSlang = ISLAND_SLANG[slangIndex];
  const isSpicy = (currentSlang as any).spicy;
  const DAILY_CRATE_LIMIT = 3;
  const canGetPack = newWordsAvailable === 0 && unlearnedExtraWords.length > 0 && crateTracker.count < DAILY_CRATE_LIMIT;
  const isDailyGoalMet = newWordsAvailable === 0 && (unlearnedExtraWords.length === 0 || crateTracker.count >= DAILY_CRATE_LIMIT);

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-8 animate-fadeIn pb-2 relative">
      {/* --- Ambient Layer (Home Exclusive Background) --- */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.05]">
         <Cloud className="absolute top-[15%] -left-8 text-[#4b7d78] animate-float-slow" size={120} />
         <Cloud className="absolute top-[45%] -right-12 text-[#4b7d78] animate-float-slow" style={{ animationDelay: '-9s' }} size={90} />
         <TreePalm className="absolute bottom-[5%] -left-12 text-[#78c850] animate-sway" size={240} />
         <TreePalm className="absolute bottom-[35%] -right-12 text-[#78c850] animate-sway" style={{ animationDelay: '-3.5s' }} size={180} />
      </div>

      <header className="text-center pt-6 md:pt-10 pb-4 relative z-10">
        <div className="inline-block bg-white border-[6px] md:border-[8px] border-[#4b7d78] rounded-[2.5rem] md:rounded-[3.5rem] px-6 py-6 md:px-8 md:py-10 shadow-[0_10px_0_rgba(0,0,0,0.1)] relative transform transition-transform hover:scale-105 duration-300 group">
            <h1 className="text-5xl md:text-8xl font-black text-[#4b7d78] tracking-tighter leading-none flex items-center justify-center gap-2 md:gap-5 flex-wrap">
                <span>SSI</span>
                <span className="text-[#ffa600] animate-breathe inline-block">{titleWord}</span>
                <span className="text-[#ff7b72]">!</span>
            </h1>
            <TreePalm className="absolute -left-8 -top-8 md:-left-12 md:-top-12 text-[#78c850] -rotate-12 drop-shadow-md animate-float" size={50} />
            <div className="absolute -right-5 -bottom-5 md:-right-8 md:-bottom-8 bg-[#ffeb3b] p-2 md:p-4 rounded-full border-[4px] border-[#fbc02d] shadow-md hover:scale-110 transition-transform cursor-pointer">
                 <Sun size={24} className="text-[#f57c00] fill-current animate-spin-slow" />
            </div>
        </div>

        <div className="mt-8 md:mt-12 mb-2 animate-slideUp relative z-0">
             <div className="inline-block bg-[#ff7b72] text-white text-sm md:text-2xl font-black px-6 py-3 md:px-10 md:py-4 rounded-xl md:rounded-2xl shadow-[4px_6px_0_#d32f2f] border-2 md:border-4 border-[#ff8a80] uppercase tracking-widest relative">
                <div className="absolute -left-2 -top-2 md:-left-3 md:-top-3 text-[#ffeb3b]">
                  <Star size={16} fill="currentColor" className="animate-pulse" />
                </div>
                {VOCABULARY_DATA.find(day => day.words.some(w => w.id === newWordsList[0]?.id))?.title || t('ui.dashboard.welcome')}
                <div className="absolute -right-2 -bottom-2 md:-right-3 md:-bottom-3 text-[#ffeb3b]">
                  <Star size={16} fill="currentColor" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
                </div>
             </div>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 md:gap-6 relative z-10">
        {canGetPack ? (
           <button onClick={() => setShowCrateModal(true)} className="bg-[#ffa600] p-4 md:px-6 md:py-8 rounded-[2rem] md:rounded-[2.5rem] shadow-[0_6px_0_#e65100] border-4 border-white flex flex-col items-center justify-center relative overflow-hidden group hover:bg-[#ffb74d] transition-all bubble-button h-full min-h-[160px] animate-float-small">
             <div className="bg-white/30 p-3 md:p-4 rounded-2xl shadow-sm mb-2 md:mb-3 border-2 border-white/50 z-10">
               <PackagePlus className="text-white fill-current" size={24} />
             </div>
             <span className="text-lg md:text-2xl font-black text-white z-10 uppercase tracking-tighter leading-none text-center">{t('ui.dashboard.open_crate')}</span>
             <div className="absolute top-3 right-3 bg-white/20 px-2 py-0.5 rounded-lg text-[9px] font-black text-white border border-white/20">{crateTracker.count}/{DAILY_CRATE_LIMIT}</div>
           </button>
        ) : (
          <div className={`p-4 md:px-6 md:py-8 rounded-[2rem] md:rounded-[2.5rem] shadow-[0_6px_0_rgba(0,0,0,0.1)] border-4 flex flex-col items-center justify-center relative overflow-hidden h-full min-h-[160px] ${isDailyGoalMet ? 'bg-[#3949ab] border-[#5c6bc0]' : 'bg-white border-[#f0f0f0]'}`}>
            <div className={`p-3 md:p-4 rounded-2xl shadow-sm mb-2 md:mb-3 border-2 z-10 animate-float ${isDailyGoalMet ? 'bg-white/20 border-white/30' : 'bg-[#ffcc80] border-white'}`}>
              {isDailyGoalMet ? <Moon className="text-[#e8eaf6] fill-current" size={24} /> : <Sprout className="text-white fill-current" size={24} />}
            </div>
            <div className="text-center z-10">
              <span className={`block text-3xl md:text-5xl font-black tracking-tighter leading-none mb-2 ${isDailyGoalMet ? 'text-white' : 'text-[#4b7d78]'}`}>
                {isDailyGoalMet ? '✓' : newWordsAvailable}
              </span>
              <span className={`block text-[9px] md:text-[10px] font-bold uppercase tracking-widest ${isDailyGoalMet ? 'text-[#c5cae9]' : 'text-[#8d99ae]'}`}>
                {isDailyGoalMet ? t('ui.dashboard.rest_msg_1') : t('ui.dashboard.new_seeds')}
              </span>
            </div>
          </div>
        )}
        <div className="bg-white p-4 md:px-6 md:py-8 rounded-[2rem] md:rounded-[2.5rem] shadow-[0_6px_0_#e0e0e0] border-4 border-[#f0f0f0] flex flex-col items-center justify-center relative overflow-hidden group h-full min-h-[160px]">
          <div className="bg-[#a5d6a7] p-3 md:p-4 rounded-2xl shadow-sm mb-2 md:mb-3 border-2 border-white z-10 animate-float" style={{ animationDelay: '1s' }}>
            <CloudRain className="text-white fill-current" size={24} />
          </div>
          <span className="text-3xl md:text-5xl font-black text-[#4b7d78] z-10 tracking-tighter leading-none mb-2">{wordsDue}</span>
          <span className="text-[9px] md:text-[10px] font-black uppercase text-[#8d99ae] tracking-widest z-10 text-center">{t('ui.dashboard.daily_care')}</span>
        </div>
      </div>

      <div className="space-y-6 pt-2 relative z-10">
        {/* 'Start Planting' button: Removed animate-float-small to keep it steady */}
        <button onClick={() => { playClick(); onStartStudy(); }} disabled={newWordsAvailable === 0} className={`group w-full p-5 md:p-7 rounded-[2.5rem] md:rounded-[3rem] font-black flex items-center justify-between transition-all bubble-button ${newWordsAvailable > 0 ? "bg-[#ff7b72] text-white hover:bg-[#ff8a80] shadow-[0_8px_0_#d32f2f] border-4 border-white" : "bg-slate-100 text-slate-300 cursor-not-allowed shadow-none border-4 border-transparent"}`}>
          <div className="flex items-center space-x-4 md:space-x-5">
            <div className="bg-white/30 p-3 md:p-4 rounded-2xl shadow-inner border-2 border-white/40 group-hover:scale-110 transition-transform"><Shovel size={24} className={`fill-current md:w-8 md:h-8 ${newWordsAvailable > 0 ? 'animate-sway' : ''}`} /></div>
            <div className="text-left"><div className="text-xl md:text-2xl">{t('ui.dashboard.start_planting')}</div><div className="text-[9px] md:text-[10px] uppercase opacity-80 tracking-widest font-black">{newWordsAvailable > 0 ? t('ui.dashboard.dig_into', { count: newWordsAvailable }) : t('ui.dashboard.no_seeds')}</div></div>
          </div>
          <ArrowRight className="text-white w-6 h-6 md:w-7 md:h-7 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
        </button>

        {learnedToday.length > 0 && (
          <div className="bg-[#e8f5e9] p-5 md:p-6 rounded-[2.5rem] border-4 border-[#8bc34a] shadow-[0_6px_0_#689f38] relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2"><Flower2 size={16} className="text-[#2e7d32]" /><h3 className="text-[10px] md:text-[11px] font-black text-[#2e7d32] uppercase tracking-[0.2em]">{t('ui.dashboard.recently_planted')}</h3></div>
              <div className="flex items-center gap-2"><span className="bg-white px-2 py-0.5 rounded-full text-[10px] font-black text-[#2e7d32] border border-[#8bc34a]">{learnedToday.length}</span><button onClick={(e) => { e.stopPropagation(); playClick(); onViewAllHarvest?.(); }} className="bg-white p-2 rounded-xl text-[#2e7d32] hover:bg-[#c8e6c9] transition-all shadow-sm border border-[#8bc34a] flex items-center justify-center bubble-button"><List size={16} strokeWidth={3} /></button></div>
            </div>
            <div className="flex flex-wrap gap-2">{learnedToday.slice(0, 8).map(word => (<button key={word.id} onClick={() => { playClick(); onWordClick?.(word); }} className="bg-white/80 px-4 py-2 rounded-2xl border-2 border-white shadow-sm flex items-center gap-2 hover:bg-white hover:border-[#8bc34a] transition-all active:scale-95"><span className="font-black text-[#2e7d32] text-sm">{word.s}</span><span className="text-[10px] text-[#2e7d32]/60 font-bold uppercase">{t(`vocab.${word.id}.t`, { defaultValue: word.t })}</span></button>))}</div>
          </div>
        )}

        <button onClick={() => { playClick(); onStartReview(); }} disabled={wordsDue === 0} className={`w-full p-5 md:p-7 rounded-[2.5rem] md:rounded-[3rem] font-black flex items-center justify-between transition-all bubble-button group ${wordsDue > 0 ? "bg-[#88d068] text-white hover:bg-[#96e072] shadow-[0_8px_0_#5a9a3b] border-4 border-white" : "bg-slate-100 text-slate-300 cursor-not-allowed border-4 border-transparent"}`}>
          <div className="flex items-center space-x-4 md:space-x-5">
            <div className="bg-white/30 p-3 md:p-4 rounded-2xl shadow-inner border-2 border-white/40 group-hover:scale-110 transition-transform"><GlassWater size={24} className={`md:w-8 md:h-8 ${wordsDue > 0 ? "animate-float-small" : ""}`} /></div>
            <div className="text-left"><div className="text-xl md:text-2xl">{t('ui.dashboard.water_garden')}</div><div className="text-[9px] md:text-[10px] uppercase opacity-80 tracking-widest font-black">{t('ui.dashboard.refresh_grown', { count: wordsDue })}</div></div>
          </div>
          <ArrowRight className="text-white w-6 h-6 md:w-7 md:h-7 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
        </button>
      </div>

      <div className={`rounded-[2.5rem] p-5 md:p-6 border-4 border-dashed flex items-start space-x-4 md:space-x-5 shadow-sm relative overflow-hidden group transition-colors relative z-10 ${isSpicy ? 'bg-rose-50 border-rose-300' : 'bg-[#fff9c4] border-[#fdd835]'}`}>
        <div className={`p-2 md:p-3 rounded-2xl shadow-md border-2 shrink-0 z-10 bg-white ${isSpicy ? 'border-rose-300' : 'border-[#fdd835]'}`}>{isSpicy ? <Flame className="text-rose-500 fill-current w-5 h-5 md:w-6 md:h-6" /> : <Snail className="text-[#795548] fill-current w-5 h-5 md:w-6 md:h-6" />}</div>
        <div className={`text-sm font-bold leading-snug flex-1 z-10 transition-all duration-150 ${isRotating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'} ${isSpicy ? 'text-rose-900' : 'text-[#5d4037]'}`}><div className="flex items-center gap-2 mb-1"><strong className={`text-xs font-black uppercase tracking-widest block ${isSpicy ? 'text-rose-500' : 'text-[#e91e63]'}`}>{t('ui.dashboard.slang_title')}</strong>{isSpicy && <span className="bg-white/80 text-[8px] font-black text-rose-500 border border-rose-200 px-1.5 py-0.5 rounded uppercase tracking-wider">🔞 Spicy</span>}</div><span className={`font-black text-lg md:text-xl block mb-0.5 leading-tight ${isSpicy ? 'text-rose-600' : 'text-[#d32f2f]'}`}>"{currentSlang.s}"</span><p className="text-[10px] md:text-[11px] opacity-70 mb-1">{currentSlang.t}</p><p className={`text-[9px] font-black uppercase tracking-wider ${isSpicy ? 'text-rose-800/60' : 'text-[#795548]/60'}`}>Lit: {currentSlang.note}</p></div>
        <button onClick={rotateSlang} className={`bg-white p-2 md:p-3 rounded-2xl border-2 shadow-sm transition-all active:scale-90 z-20 ${isSpicy ? 'border-rose-300 text-rose-400' : 'border-[#fdd835] text-[#fbc02d]'}`}><RotateCw className={`w-4 h-4 md:w-[18px] md:h-[18px] ${isRotating ? 'animate-spin' : ''}`} /></button>
      </div>

      {showCrateModal && (
        <CrateRevealModal words={unlearnedExtraWords.slice(0, 10)} onClose={() => setShowCrateModal(false)} onConfirm={() => { onGetSeedPack(); setShowCrateModal(false); const today = new Date().toISOString().split('T')[0]; const newCount = crateTracker.count + 1; const nt = { ...crateTracker, count: newCount }; setCrateTracker(nt); localStorage.setItem('ssi_crate_tracker', JSON.stringify(nt)); }} />
      )}
    </div>
  );
};

export default Dashboard;
