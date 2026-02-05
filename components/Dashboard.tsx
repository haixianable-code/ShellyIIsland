
import React, { useState } from 'react';
import { Word, ProgressMap } from '../types';
import { ISLAND_SLANG } from '../constants';
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
  RotateCw
} from 'lucide-react';

interface DashboardProps {
  progress: ProgressMap;
  wordsDue: number;
  newWordsAvailable: number;
  newWordsList?: Word[];
  learnedToday?: Word[];
  onStartStudy: () => void;
  onStartReview: () => void;
  onWordClick?: (word: Word) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  progress, 
  wordsDue, 
  newWordsAvailable, 
  newWordsList = [],
  learnedToday = [],
  onStartStudy, 
  onStartReview,
  onWordClick
}) => {
  const [slangIndex, setSlangIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

  const rotateSlang = () => {
    setIsRotating(true);
    setTimeout(() => {
      setSlangIndex((prev) => (prev + 1) % ISLAND_SLANG.length);
      setIsRotating(false);
    }, 150);
  };

  const currentSlang = ISLAND_SLANG[slangIndex];

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-8 animate-fadeIn">
      <header className="text-center pt-6">
        <div className="inline-block px-10 py-3 bg-white rounded-full border-4 border-[#88d068] shadow-[0_6px_0_#88d068] mb-4 relative">
          <TreePalm className="absolute -left-8 -top-6 text-[#78c850] -rotate-12 drop-shadow-sm" size={40} />
          <h2 className="text-3xl font-black text-[#4b7d78]">¡Hola Neighbor!</h2>
          <TreePalm className="absolute -right-8 -bottom-4 text-[#78c850] rotate-12 drop-shadow-sm" size={32} />
        </div>
        <p className="text-[#6d7c8e] font-bold italic">Ready to tend to your Spanish island?</p>
      </header>

      {/* Primary Stat Panels */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white px-6 py-6 rounded-[2.5rem] shadow-[0_8px_0_#e0e0e0] border-4 border-[#f0f0f0] flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="bg-[#ffcc80] p-4 rounded-2xl shadow-sm mb-2 border-2 border-white z-10">
            <Sprout className="text-white fill-current group-hover:scale-110 transition-transform" size={28} />
          </div>
          <span className="text-4xl font-black text-[#4b7d78] z-10">{newWordsAvailable}</span>
          <span className="text-[9px] font-black uppercase text-[#8d99ae] tracking-widest mt-1 z-10">New Seeds</span>
          <Leaf className="absolute -bottom-2 -left-2 text-[#ffcc80]/10 -rotate-12" size={60} />
        </div>
        <div className="bg-white px-6 py-6 rounded-[2.5rem] shadow-[0_8px_0_#e0e0e0] border-4 border-[#f0f0f0] flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="bg-[#a5d6a7] p-4 rounded-2xl shadow-sm mb-2 border-2 border-white z-10">
            <CloudRain className="text-white fill-current group-hover:translate-y-1 transition-transform" size={28} />
          </div>
          <span className="text-4xl font-black text-[#4b7d78] z-10">{wordsDue}</span>
          <span className="text-[9px] font-black uppercase text-[#8d99ae] tracking-widest mt-1 z-10">Daily Care</span>
          <CloudRain className="absolute -top-2 -right-2 text-[#a5d6a7]/10 rotate-12" size={60} />
        </div>
      </div>

      <div className="space-y-6 pt-2">
        {/* New Lessons Button */}
        <div className="space-y-4">
          <button 
            onClick={onStartStudy}
            disabled={newWordsAvailable === 0}
            className={`group w-full p-7 rounded-[3rem] font-black flex items-center justify-between transition-all active:translate-y-2 active:shadow-none ${
              newWordsAvailable > 0 
              ? "bg-[#ff7b72] text-white hover:bg-[#ff8a80] shadow-[0_10px_0_#d32f2f] border-4 border-white" 
              : "bg-slate-100 text-slate-300 cursor-not-allowed shadow-none border-4 border-transparent"
            }`}
          >
            <div className="flex items-center space-x-5">
              <div className="bg-white/30 p-4 rounded-2xl group-hover:rotate-12 transition-transform shadow-inner border-2 border-white/40">
                <Shovel size={32} className="fill-current" />
              </div>
              <div className="text-left">
                <div className="text-2xl">Start Planting</div>
                <div className="text-[10px] uppercase opacity-80 tracking-widest font-black">Dig into {newWordsAvailable} new words</div>
              </div>
            </div>
            <ArrowRight className="text-white w-7 h-7" strokeWidth={3} />
          </button>

          {/* New Words Preview */}
          {newWordsAvailable > 0 && (
            <div className="bg-white/60 p-6 rounded-[2.5rem] border-4 border-dashed border-[#e0d9b4] animate-fadeIn relative overflow-hidden">
               <p className="text-[9px] font-black text-[#8d99ae] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                 <MousePointer2 size={12} className="fill-current" /> Seed Pack Contents
               </p>
               <div className="flex flex-wrap gap-2">
                  {newWordsList.slice(0, 8).map(word => (
                    <button 
                      key={word.id} 
                      onClick={() => onWordClick?.(word)}
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

        {/* Recently Planted */}
        {learnedToday.length > 0 && (
          <div className="bg-[#e8f5e9] p-6 rounded-[2.5rem] border-4 border-[#8bc34a] shadow-[0_8px_0_#689f38] relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flower2 size={16} className="text-[#2e7d32] group-hover:rotate-45 transition-transform" />
                <h3 className="text-[11px] font-black text-[#2e7d32] uppercase tracking-[0.2em]">Recently Planted Today</h3>
              </div>
              <span className="bg-white px-2 py-0.5 rounded-full text-[10px] font-black text-[#2e7d32] border border-[#8bc34a]">
                {learnedToday.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {learnedToday.map(word => (
                <button 
                  key={word.id} 
                  onClick={() => onWordClick?.(word)}
                  className="bg-white/80 px-4 py-2 rounded-2xl border-2 border-white shadow-sm flex items-center gap-2 group/word hover:bg-white hover:border-[#8bc34a] transition-all active:scale-95"
                >
                  <span className="font-black text-[#2e7d32] text-sm group-hover/word:text-[#4b7d78]">{word.s}</span>
                  <span className="text-[10px] text-[#2e7d32]/60 font-bold uppercase">{word.t}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Review Button */}
        <button 
          onClick={onStartReview}
          disabled={wordsDue === 0}
          className={`w-full p-7 rounded-[3rem] font-black flex items-center justify-between transition-all active:translate-y-2 active:shadow-none ${
            wordsDue > 0 
            ? "bg-[#88d068] text-white hover:bg-[#96e072] shadow-[0_10px_0_#5a9a3b] border-4 border-white" 
            : "bg-slate-100 text-slate-300 cursor-not-allowed shadow-none border-4 border-transparent"
          }`}
        >
          <div className="flex items-center space-x-5">
            <div className="bg-white/30 p-4 rounded-2xl shadow-inner border-2 border-white/40">
              <GlassWater size={32} className={wordsDue > 0 ? "animate-pulse" : ""} />
            </div>
            <div className="text-left">
              <div className="text-2xl">Water the Garden</div>
              <div className="text-[10px] uppercase opacity-80 tracking-widest font-black">Refresh {wordsDue} grown words</div>
            </div>
          </div>
          <ArrowRight className="text-white w-7 h-7" strokeWidth={3} />
        </button>
      </div>

      {/* Fun Fact Card (Island Slang) with shuffle button */}
      <div className="bg-[#fff9c4] rounded-[2.5rem] p-6 border-4 border-dashed border-[#fdd835] flex items-start space-x-5 shadow-sm relative overflow-hidden group">
        <div className="bg-white p-3 rounded-2xl shadow-md border-2 border-[#fdd835] shrink-0 z-10">
          <Snail className="text-[#795548] fill-current group-hover:translate-x-1 transition-transform" size={24} />
        </div>
        <div className={`text-sm text-[#5d4037] font-bold leading-snug flex-1 z-10 transition-all duration-150 ${isRotating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
            <strong className="text-[#e91e63] text-xs font-black uppercase tracking-widest block mb-1">Island Slang!</strong>
            <span className="text-[#d32f2f] font-black text-xl italic block mb-0.5 leading-tight">"{currentSlang.s}"</span>
            <p className="text-[11px] opacity-70 italic mb-1">{currentSlang.t}</p>
            <p className="text-[9px] text-[#795548]/60 font-black uppercase tracking-wider">Lit: {currentSlang.note}</p>
        </div>
        
        {/* Shuffle Button */}
        <button 
          onClick={rotateSlang}
          className="bg-white p-3 rounded-2xl border-2 border-[#fdd835] text-[#fbc02d] shadow-sm hover:bg-[#fdd835] hover:text-white transition-all active:scale-90 z-20"
          title="Change Slang"
        >
          <RotateCw size={18} className={isRotating ? 'animate-spin' : ''} />
        </button>

        <div className="absolute -bottom-4 -right-4 opacity-10 rotate-12 transition-transform group-hover:rotate-0">
          <Star size={80} className="fill-current text-[#fdd835]" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
