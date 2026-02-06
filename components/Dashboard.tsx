
import React, { useState, useEffect } from 'react';
import { Word, UserStats } from '../types';
import { ISLAND_SLANG } from '../constants';
import { playClick, playSparkle, playSwish } from '../utils/sfx';
import { 
  Sprout, 
  CloudRain, 
  Shovel, 
  GlassWater, 
  Star, 
  Snail, 
  ArrowRight, 
  MousePointer2, 
  Leaf, 
  Flower2,
  TreePalm,
  RotateCw,
  PackagePlus,
  Gift,
  MoreHorizontal,
  Sun
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DashboardProps {
  progress: any;
  stats: UserStats | null;
  wordsDue: number;
  newWordsAvailable: number;
  unlearnedExtraCount: number;
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
  unlearnedExtraCount,
  newWordsList = [],
  learnedToday = [],
  onStartStudy, 
  onStartReview,
  onGetSeedPack,
  onWordClick,
  onViewAllHarvest
}) => {
  const [slangIndex, setSlangIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [titleWord, setTitleWord] = useState(TITLE_WORDS[0]);

  useEffect(() => {
    const random = TITLE_WORDS[Math.floor(Math.random() * TITLE_WORDS.length)];
    setTitleWord(random);
  }, []);

  const rotateSlang = () => {
    playSwish();
    setIsRotating(true);
    setTimeout(() => {
      setSlangIndex((prev) => (prev + 1) % ISLAND_SLANG.length);
      setIsRotating(false);
    }, 150);
  };

  const handleOpenPack = () => {
    playSparkle();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ffa600', '#8bc34a', '#ffffff']
    });
    onGetSeedPack();
  };

  const currentSlang = ISLAND_SLANG[slangIndex];
  const canGetPack = newWordsAvailable === 0 && unlearnedExtraCount > 0;
  const isIslandQuiet = wordsDue === 0 && newWordsAvailable === 0;

  const RECENT_LIMIT = 8;
  const showViewAllRecent = learnedToday.length > RECENT_LIMIT;
  const displayedRecent = showViewAllRecent ? learnedToday.slice(0, RECENT_LIMIT) : learnedToday;

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-8 animate-fadeIn pb-2">
      <header className="text-center pt-6 md:pt-10 pb-4 relative z-10">
        <div className="inline-block bg-white border-[6px] md:border-[8px] border-[#4b7d78] rounded-[2.5rem] md:rounded-[3.5rem] px-6 py-6 md:px-8 md:py-10 shadow-[0_10px_0_rgba(0,0,0,0.1)] md:shadow-[0_15px_0_rgba(0,0,0,0.1)] relative transform transition-transform hover:scale-105 duration-300 group">
            <h1 className="text-5xl md:text-8xl font-black text-[#4b7d78] tracking-tighter leading-none flex items-center justify-center gap-2 md:gap-5 flex-wrap">
                <span className="group-hover:-rotate-6 transition-transform">SSI</span>
                <span className="text-[#ffa600] underline decoration-[4px] md:decoration-[6px] decoration-[#8bc34a] underline-offset-[8px] md:underline-offset-[12px] drop-shadow-sm group-hover:rotate-3 transition-transform">{titleWord}</span>
                <span className="text-[#ff7b72] group-hover:scale-125 transition-transform">!</span>
            </h1>
            
            <TreePalm className="absolute -left-8 -top-8 md:-left-12 md:-top-12 text-[#78c850] -rotate-12 drop-shadow-md filter brightness-110" size={50} />
            <div className="absolute -right-5 -bottom-5 md:-right-8 md:-bottom-8 bg-[#ffeb3b] p-2 md:p-4 rounded-full border-[4px] md:border-[6px] border-[#fbc02d] animate-bounce shadow-md">
                 <Sun size={24} className="text-[#f57c00] fill-current animate-spin-slow" />
            </div>
        </div>

        <div className="mt-8 md:mt-12 mb-2 animate-slideUp relative z-0">
             <div className="inline-block bg-[#ff7b72] text-white text-sm md:text-2xl font-black px-6 py-3 md:px-10 md:py-4 rounded-xl md:rounded-2xl shadow-[4px_6px_0_#d32f2f] md:shadow-[8px_10px_0_#d32f2f] -rotate-2 hover:rotate-0 transition-transform cursor-default border-2 md:border-4 border-[#ff8a80] uppercase tracking-widest relative">
                <div className="absolute -left-2 -top-2 md:-left-3 md:-top-3 text-[#ffeb3b]">
                  <Star size={16} fill="currentColor" />
                </div>
                Welcome to Shelly Spanish Island!
                <div className="absolute -right-2 -bottom-2 md:-right-3 md:-bottom-3 text-[#ffeb3b]">
                  <Star size={16} fill="currentColor" />
                </div>
             </div>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 md:gap-6">
        {canGetPack ? (
           <button 
             onClick={handleOpenPack}
             className="bg-[#ffa600] p-4 md:px-6 md:py-8 rounded-[2rem] md:rounded-[2.5rem] shadow-[0_6px_0_#e65100] md:shadow-[0_8px_0_#e65100] border-4 border-white flex flex-col items-center justify-center relative overflow-hidden group hover:bg-[#ffb74d] transition-all active:translate-y-2 active:shadow-none bubble-button h-full min-h-[160px]"
           >
             <div className="bg-white/30 p-3 md:p-4 rounded-2xl shadow-sm mb-2 md:mb-3 border-2 border-white/50 z-10 animate-bounce">
               <PackagePlus className="text-white fill-current" size={24} />
             </div>
             <span className="text-lg md:text-2xl font-black text-white z-10 uppercase tracking-tighter leading-none text-center">Get Seeds</span>
             <span className="text-[9px] md:text-[10px] font-black uppercase text-white/80 tracking-widest mt-1 z-10 text-center">+10 Words</span>
             <PackagePlus className="absolute -bottom-4 -left-4 text-white/20 -rotate-12" size={60} />
           </button>
        ) : (
          <div className="bg-white p-4 md:px-6 md:py-8 rounded-[2rem] md:rounded-[2.5rem] shadow-[0_6px_0_#e0e0e0] md:shadow-[0_8px_0_#e0e0e0] border-4 border-[#f0f0f0] flex flex-col items-center justify-center relative overflow-hidden group h-full min-h-[160px]">
            <div className="bg-[#ffcc80] p-3 md:p-4 rounded-2xl shadow-sm mb-2 md:mb-3 border-2 border-white z-10">
              <Sprout className="text-white fill-current group-hover:scale-110 transition-transform" size={24} />
            </div>
            <span className="text-4xl md:text-5xl font-black text-[#4b7d78] z-10">{newWordsAvailable}</span>
            <span className="text-[9px] md:text-[10px] font-black uppercase text-[#8d99ae] tracking-widest mt-1 z-10 text-center">New Seeds</span>
            <Leaf className="absolute -bottom-2 -left-2 text-[#ffcc80]/10 -rotate-12" size={50} />
          </div>
        )}

        <div className="bg-white p-4 md:px-6 md:py-8 rounded-[2rem] md:rounded-[2.5rem] shadow-[0_6px_0_#e0e0e0] md:shadow-[0_8px_0_#e0e0e0] border-4 border-[#f0f0f0] flex flex-col items-center justify-center relative overflow-hidden group h-full min-h-[160px]">
          <div className="bg-[#a5d6a7] p-3 md:p-4 rounded-2xl shadow-sm mb-2 md:mb-3 border-2 border-white z-10">
            <CloudRain className="text-white fill-current group-hover:translate-y-1 transition-transform" size={24} />
          </div>
          <span className="text-4xl md:text-5xl font-black text-[#4b7d78] z-10">{wordsDue}</span>
          <span className="text-[9px] md:text-[10px] font-black uppercase text-[#8d99ae] tracking-widest mt-1 z-10 text-center">Daily Care</span>
          <CloudRain className="absolute -bottom-2 -left-2 text-[#a5d6a7]/10 -rotate-12" size={50} />
        </div>
      </div>

      <div className="space-y-6 pt-2">
        <div className="space-y-4">
          <button 
            onClick={() => { playClick(); onStartStudy(); }}
            disabled={newWordsAvailable === 0}
            className={`group w-full p-5 md:p-7 rounded-[2.5rem] md:rounded-[3rem] font-black flex items-center justify-between transition-all active:translate-y-2 active:shadow-none ${
              newWordsAvailable > 0 
              ? "bg-[#ff7b72] text-white hover:bg-[#ff8a80] shadow-[0_8px_0_#d32f2f] md:shadow-[0_10px_0_#d32f2f] border-4 border-white" 
              : "bg-slate-100 text-slate-300 cursor-not-allowed shadow-none border-4 border-transparent"
            }`}
          >
            <div className="flex items-center space-x-4 md:space-x-5">
              <div className="bg-white/30 p-3 md:p-4 rounded-2xl group-hover:rotate-12 transition-transform shadow-inner border-2 border-white/40">
                <Shovel size={24} className="fill-current md:w-8 md:h-8" />
              </div>
              <div className="text-left">
                <div className="text-xl md:text-2xl">Start Planting</div>
                <div className="text-[9px] md:text-[10px] uppercase opacity-80 tracking-widest font-black">
                   {newWordsAvailable > 0 ? `Dig into ${newWordsAvailable} new words` : "No new seeds selected"}
                </div>
              </div>
            </div>
            <ArrowRight className="text-white w-6 h-6 md:w-7 md:h-7" strokeWidth={3} />
          </button>

          {newWordsAvailable > 0 && (
            <div className="bg-white/60 p-5 md:p-6 rounded-[2.5rem] border-4 border-dashed border-[#e0d9b4] animate-fadeIn relative overflow-hidden">
               <p className="text-[9px] font-black text-[#8d99ae] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                 <MousePointer2 size={12} className="fill-current" /> Seed Pack Contents
               </p>
               <div className="flex flex-wrap gap-2">
                  {newWordsList.slice(0, 12).map(word => (
                    <button 
                      key={word.id} 
                      onClick={() => { playClick(); onWordClick?.(word); }}
                      className="bg-white px-3 py-1.5 rounded-xl shadow-sm border-2 border-[#f0f0f0] text-[#4b7d78] font-black text-xs hover:border-[#8bc34a] transition-all active:scale-95 flex items-center gap-1.5"
                    >
                      <Sprout size={10} className="text-[#8bc34a]" />
                      {word.s}
                    </button>
                  ))}
               </div>
            </div>
          )}
        </div>

        {learnedToday.length > 0 && (
          <div className="bg-[#e8f5e9] p-5 md:p-6 rounded-[2.5rem] border-4 border-[#8bc34a] shadow-[0_6px_0_#689f38] md:shadow-[0_8px_0_#689f38] relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flower2 size={16} className="text-[#2e7d32] group-hover:rotate-45 transition-transform" />
                <h3 className="text-[10px] md:text-[11px] font-black text-[#2e7d32] uppercase tracking-[0.2em]">Recently Planted Today</h3>
              </div>
              <span className="bg-white px-2 py-0.5 rounded-full text-[10px] font-black text-[#2e7d32] border border-[#8bc34a]">
                {learnedToday.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {displayedRecent.map(word => (
                <button 
                  key={word.id} 
                  onClick={() => { playClick(); onWordClick?.(word); }}
                  className="bg-white/80 px-4 py-2 rounded-2xl border-2 border-white shadow-sm flex items-center gap-2 group/word hover:bg-white hover:border-[#8bc34a] transition-all active:scale-95"
                >
                  <span className="font-black text-[#2e7d32] text-sm group-hover/word:text-[#4b7d78]">{word.s}</span>
                  <span className="text-[10px] text-[#2e7d32]/60 font-bold uppercase">{word.t}</span>
                </button>
              ))}
              
              {showViewAllRecent && (
                <button 
                  onClick={() => { playClick(); onViewAllHarvest?.(); }}
                  className="bg-[#2e7d32] px-4 py-2 rounded-2xl border-2 border-[#2e7d32] shadow-sm flex items-center gap-2 text-white hover:bg-[#1b5e20] transition-all active:scale-95"
                >
                  <MoreHorizontal size={14} />
                  <span className="font-black text-xs">View All (+{learnedToday.length - RECENT_LIMIT})</span>
                </button>
              )}
            </div>
          </div>
        )}

        <button 
          onClick={() => { playClick(); onStartReview(); }}
          disabled={wordsDue === 0}
          className={`w-full p-5 md:p-7 rounded-[2.5rem] md:rounded-[3rem] font-black flex items-center justify-between transition-all active:translate-y-2 active:shadow-none ${
            wordsDue > 0 
            ? "bg-[#88d068] text-white hover:bg-[#96e072] shadow-[0_8px_0_#5a9a3b] md:shadow-[0_10px_0_#5a9a3b] border-4 border-white" 
            : "bg-slate-100 text-slate-300 cursor-not-allowed shadow-none border-4 border-transparent"
          }`}
        >
          <div className="flex items-center space-x-4 md:space-x-5">
            <div className="bg-white/30 p-3 md:p-4 rounded-2xl shadow-inner border-2 border-white/40">
              <GlassWater size={24} className={`md:w-8 md:h-8 ${wordsDue > 0 ? "animate-pulse" : ""}`} />
            </div>
            <div className="text-left">
              <div className="text-xl md:text-2xl">Water the Garden</div>
              <div className="text-[9px] md:text-[10px] uppercase opacity-80 tracking-widest font-black">Refresh {wordsDue} grown words</div>
            </div>
          </div>
          <ArrowRight className="text-white w-6 h-6 md:w-7 md:h-7" strokeWidth={3} />
        </button>
      </div>

      {isIslandQuiet && canGetPack && (
        <div className="bg-[#fff3e0] p-6 md:p-8 rounded-[3rem] border-4 border-[#ffb74d] shadow-[0_10px_0_#ef6c00] text-center relative overflow-hidden animate-slideUp">
           <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
           
           <div className="relative z-10 flex flex-col items-center">
             <div className="bg-white p-5 rounded-[2rem] border-4 border-[#ffb74d] shadow-sm mb-4 animate-bounce">
               <Gift className="text-[#ef6c00] fill-current" size={40} />
             </div>
             <h3 className="text-2xl font-black text-[#e65100] uppercase tracking-tight mb-2 italic">The Island is Quiet...</h3>
             <p className="text-[#ef6c00] font-bold mb-6 max-w-xs mx-auto text-sm leading-relaxed">
               All chores are done! But look, a crate of supplies washed ashore.
             </p>
             <button 
               onClick={handleOpenPack}
               className="bg-[#ef6c00] text-white px-8 py-4 rounded-[2rem] font-black shadow-[0_6px_0_#bf360c] border-2 border-[#ffe0b2] hover:bg-[#f57c00] transition-colors bubble-button flex items-center gap-2"
             >
               <PackagePlus size={20} />
               Open Supply Crate (+10)
             </button>
           </div>
        </div>
      )}

      <div className="bg-[#fff9c4] rounded-[2.5rem] p-5 md:p-6 border-4 border-dashed border-[#fdd835] flex items-start space-x-4 md:space-x-5 shadow-sm relative overflow-hidden group">
        <div className="bg-white p-2 md:p-3 rounded-2xl shadow-md border-2 border-[#fdd835] shrink-0 z-10">
          <Snail className="text-[#795548] fill-current group-hover:translate-x-1 transition-transform w-5 h-5 md:w-6 md:h-6" />
        </div>
        <div className={`text-sm text-[#5d4037] font-bold leading-snug flex-1 z-10 transition-all duration-150 ${isRotating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
            <strong className="text-[#e91e63] text-xs font-black uppercase tracking-widest block mb-1">Island Slang!</strong>
            <span className="text-[#d32f2f] font-black text-lg md:text-xl italic block mb-0.5 leading-tight">"{currentSlang.s}"</span>
            <p className="text-[10px] md:text-[11px] opacity-70 italic mb-1">{currentSlang.t}</p>
            <p className="text-[9px] text-[#795548]/60 font-black uppercase tracking-wider">Lit: {currentSlang.note}</p>
        </div>
        
        <button 
          onClick={rotateSlang}
          className="bg-white p-2 md:p-3 rounded-2xl border-2 border-[#fdd835] text-[#fbc02d] shadow-sm hover:bg-[#fdd835] hover:text-white transition-all active:scale-90 z-20"
          title="Change Slang"
        >
          <RotateCw className={`w-4 h-4 md:w-[18px] md:h-[18px] ${isRotating ? 'animate-spin' : ''}`} />
        </button>

        <div className="absolute -bottom-4 -right-4 opacity-10 rotate-12 transition-transform group-hover:rotate-0">
          <Star size={80} className="fill-current text-[#fdd835]" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;