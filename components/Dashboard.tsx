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
import SEO from './SEO';

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
    <div className="p-4 max-w-2xl mx-auto space-y-6 animate-fadeIn pb-2 relative">
      <SEO 
        title="Shelly Spanish Island - Master Spanish with AI Mnemonics"
        description="The ultimate tropical oasis for learning Spanish. Build your vocabulary garden with AI sentence challenges and scientific SRS."
        url="https://ssisland.space/"
      />

      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.05]">
         <Cloud className="absolute top-[15%] -left-8 text-[#4b7d78] animate-float-slow" size={120} />
         <TreePalm className="absolute bottom-[5%] -left-12 text-[#78c850] animate-sway" size={240} />
      </div>

      <header className="text-center pt-4 md:pt-8 pb-2 relative z-10">
        <div className="inline-block bg-white border-4 md:border-[6px] border-[#4b7d78] rounded-[2rem] md:rounded-[3rem] px-6 py-5 md:px-10 md:py-8 shadow-[0_8px_0_rgba(0,0,0,0.1)] relative transform transition-transform hover:scale-105 duration-300 group">
            <h1 className="text-4xl md:text-6xl font-black text-[#4b7d78] tracking-tighter leading-none flex items-center justify-center gap-2 md:gap-4 flex-wrap">
                <span>SSI</span>
                <span className="text-[#ffa600] animate-breathe inline-block">{titleWord}</span>
                <span className="text-[#ff7b72]">!</span>
            </h1>
            <TreePalm className="absolute -left-6 -top-6 md:-left-10 md:-top-10 text-[#78c850] -rotate-12 drop-shadow-md animate-float" size={40} />
        </div>

        <div className="mt-6 md:mt-10 mb-2 animate-slideUp relative z-0">
             <div className="inline-block bg-[#ff7b72] text-white text-xs md:text-xl font-black px-5 py-2.5 md:px-8 md:py-3.5 rounded-xl md:rounded-2xl shadow-[0_6px_0_#d32f2f] border-2 md:border-4 border-[#ff8a80] uppercase tracking-widest">
                {VOCABULARY_DATA.find(day => day.words.some(w => w.id === newWordsList[0]?.id))?.title || t('ui.dashboard.welcome')}
             </div>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 md:gap-6 relative z-10">
        {canGetPack ? (
           <button onClick={() => setShowCrateModal(true)} className="bg-[#ffa600] p-4 md:px-6 md:py-8 rounded-3xl shadow-[0_6px_0_#e65100] border-4 border-white flex flex-col items-center justify-center relative overflow-hidden group hover:bg-[#ffb74d] transition-all bubble-button h-full min-h-[140px]">
             <div className="bg-white/30 p-2.5 md:p-3.5 rounded-xl shadow-sm mb-2 border-2 border-white/50 z-10">
               <PackagePlus className="text-white fill-current" size={20} />
             </div>
             <span className="text-base md:text-xl font-black text-white z-10 uppercase tracking-tight leading-none text-center">{t('ui.dashboard.open_crate')}</span>
             <div className="absolute top-2 right-2 bg-white/20 px-2 py-0.5 rounded-lg text-[8px] font-black text-white border border-white/20">{crateTracker.count}/{DAILY_CRATE_LIMIT}</div>
           </button>
        ) : (
          <div className={`p-4 md:px-6 md:py-8 rounded-3xl shadow-[0_6px_0_rgba(0,0,0,0.05)] border-4 flex flex-col items-center justify-center relative overflow-hidden h-full min-h-[140px] ${isDailyGoalMet ? 'bg-[#3949ab] border-[#5c6bc0]' : 'bg-white border-[#f0f0f0]'}`}>
            <div className={`p-2.5 md:p-3.5 rounded-xl shadow-sm mb-2 border-2 z-10 ${isDailyGoalMet ? 'bg-white/20 border-white/30' : 'bg-[#ffcc80] border-white'}`}>
              {isDailyGoalMet ? <Moon className="text-[#e8eaf6] fill-current" size={20} /> : <Sprout className="text-white fill-current" size={20} />}
            </div>
            <div className="text-center z-10">
              <span className={`block text-2xl md:text-4xl font-black tracking-tighter leading-none mb-1 ${isDailyGoalMet ? 'text-white' : 'text-[#4b7d78]'}`}>
                {isDailyGoalMet ? '✓' : newWordsAvailable}
              </span>
              <span className={`block text-[8px] md:text-[9px] font-bold uppercase tracking-widest ${isDailyGoalMet ? 'text-[#c5cae9]' : 'text-[#8d99ae]'}`}>
                {isDailyGoalMet ? t('ui.dashboard.rest_msg_1') : t('ui.dashboard.new_seeds')}
              </span>
            </div>
          </div>
        )}
        <div className="bg-white p-4 md:px-6 md:py-8 rounded-3xl shadow-[0_6px_0_#f0f0f0] border-4 border-[#f0f0f0] flex flex-col items-center justify-center relative h-full min-h-[140px]">
          <div className="bg-[#a5d6a7] p-2.5 md:p-3.5 rounded-xl shadow-sm mb-2 border-2 border-white z-10">
            <CloudRain className="text-white fill-current" size={20} />
          </div>
          <span className="text-2xl md:text-4xl font-black text-[#4b7d78] z-10 tracking-tighter leading-none mb-1">{wordsDue}</span>
          <span className="text-[8px] md:text-[9px] font-black uppercase text-[#8d99ae] tracking-widest z-10">{t('ui.dashboard.daily_care')}</span>
        </div>
      </div>

      <div className="space-y-4 pt-2 relative z-10">
        <button onClick={() => { playClick(); onStartStudy(); }} disabled={newWordsAvailable === 0} className={`group w-full p-5 md:p-6 rounded-[2rem] md:rounded-[2.5rem] font-black flex items-center justify-between transition-all bubble-button ${newWordsAvailable > 0 ? "bg-[#ff7b72] text-white hover:bg-[#ff8a80] shadow-[0_8px_0_#d32f2f] border-2 md:border-4 border-white" : "bg-slate-100 text-slate-300 cursor-not-allowed shadow-none border-2 border-transparent"}`}>
          <div className="flex items-center space-x-4">
            <div className="bg-white/30 p-2.5 md:p-3 rounded-xl shadow-inner border-2 border-white/40"><Shovel size={20} className={`fill-current md:w-6 md:h-6 ${newWordsAvailable > 0 ? 'animate-sway' : ''}`} /></div>
            <div className="text-left"><div className="text-lg md:text-xl">{t('ui.dashboard.start_planting')}</div><div className="text-[8px] md:text-[9px] uppercase opacity-80 tracking-widest font-black">{newWordsAvailable > 0 ? t('ui.dashboard.dig_into', { count: newWordsAvailable }) : t('ui.dashboard.no_seeds')}</div></div>
          </div>
          <ArrowRight className="text-white w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
        </button>

        <button onClick={() => { playClick(); onStartReview(); }} disabled={wordsDue === 0} className={`w-full p-5 md:p-6 rounded-[2rem] md:rounded-[2.5rem] font-black flex items-center justify-between transition-all bubble-button group ${wordsDue > 0 ? "bg-[#88d068] text-white hover:bg-[#96e072] shadow-[0_8px_0_#5a9a3b] border-2 md:border-4 border-white" : "bg-slate-100 text-slate-300 cursor-not-allowed border-2 border-transparent"}`}>
          <div className="flex items-center space-x-4">
            <div className="bg-white/30 p-2.5 md:p-3 rounded-xl shadow-inner border-2 border-white/40"><GlassWater size={20} className={`md:w-6 md:h-6 ${wordsDue > 0 ? "animate-float-small" : ""}`} /></div>
            <div className="text-left"><div className="text-lg md:text-xl">{t('ui.dashboard.water_garden')}</div><div className="text-[8px] md:text-[9px] uppercase opacity-80 tracking-widest font-black">{t('ui.dashboard.refresh_grown', { count: wordsDue })}</div></div>
          </div>
          <ArrowRight className="text-white w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
        </button>
      </div>

      <div className={`rounded-3xl p-4 md:p-5 border-2 md:border-4 border-dashed flex items-start space-x-4 shadow-sm relative transition-colors z-10 ${isSpicy ? 'bg-rose-50 border-rose-300' : 'bg-[#fff9c4] border-[#fdd835]'}`}>
        <div className={`p-2 rounded-xl shadow-md border-2 shrink-0 bg-white ${isSpicy ? 'border-rose-300' : 'border-[#fdd835]'}`}>{isSpicy ? <Flame className="text-rose-500 fill-current w-5 h-5" /> : <Snail className="text-[#795548] fill-current w-5 h-5" />}</div>
        <div className={`text-xs font-bold leading-snug flex-1 transition-all duration-150 ${isRotating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'} ${isSpicy ? 'text-rose-900' : 'text-[#5d4037]'}`}><div className="flex items-center gap-2 mb-0.5"><strong className={`text-[10px] font-black uppercase tracking-widest block ${isSpicy ? 'text-rose-500' : 'text-[#e91e63]'}`}>{t('ui.dashboard.slang_title')}</strong>{isSpicy && <span className="bg-white/80 text-[7px] font-black text-rose-500 border border-rose-200 px-1 py-0.5 rounded uppercase tracking-wider">🔞 Spicy</span>}</div><span className={`font-black text-base md:text-lg block leading-tight ${isSpicy ? 'text-rose-600' : 'text-[#d32f2f]'}`}>"{currentSlang.s}"</span><p className="text-[10px] opacity-70 mb-0.5">{currentSlang.t}</p><p className={`text-[8px] font-black uppercase tracking-wider ${isSpicy ? 'text-rose-800/60' : 'text-[#795548]/60'}`}>Lit: {currentSlang.note}</p></div>
        <button onClick={rotateSlang} className={`bg-white p-2 rounded-xl border shadow-sm transition-all active:scale-90 ${isSpicy ? 'border-rose-300 text-rose-400' : 'border-[#fdd835] text-[#fbc02d]'}`}><RotateCw size={14} className={isRotating ? 'animate-spin' : ''} /></button>
      </div>

      {showCrateModal && (
        <CrateRevealModal words={unlearnedExtraWords.slice(0, 10)} onClose={() => setShowCrateModal(false)} onConfirm={() => { onGetSeedPack(); setShowCrateModal(false); const today = new Date().toISOString().split('T')[0]; const newCount = crateTracker.count + 1; const nt = { ...crateTracker, count: newCount }; setCrateTracker(nt); localStorage.setItem('ssi_crate_tracker', JSON.stringify(nt)); }} />
      )}
    </div>
  );
};

export default Dashboard;