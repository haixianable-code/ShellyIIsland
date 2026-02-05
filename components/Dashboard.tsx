
import React from 'react';
import { Word, ProgressMap } from '../types';
import { BookOpen, Sun, Sparkles, Footprints, Star, Zap, ArrowRight, MousePointer2, Leaf } from 'lucide-react';

interface DashboardProps {
  progress: ProgressMap;
  wordsDue: number;
  newWordsAvailable: number;
  newWordsList?: Word[];
  onStartStudy: () => void;
  onStartReview: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  progress, 
  wordsDue, 
  newWordsAvailable, 
  newWordsList = [],
  onStartStudy, 
  onStartReview 
}) => {
  return (
    <div className="p-4 max-w-2xl mx-auto space-y-8 animate-fadeIn">
      <header className="text-center pt-6">
        <div className="inline-block px-10 py-3 bg-white rounded-full border-4 border-[#88d068] shadow-[0_6px_0_#88d068] mb-4">
          <h2 className="text-3xl font-black text-[#4b7d78]">¡Hola Neighbor!</h2>
        </div>
        <p className="text-[#6d7c8e] font-bold italic">Ready to tend to your Spanish island?</p>
      </header>

      {/* Primary Stat Panels */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white px-6 py-6 rounded-[2.5rem] shadow-[0_8px_0_#e0e0e0] border-4 border-[#f0f0f0] flex flex-col items-center justify-center">
          <div className="bg-[#ffcc80] p-4 rounded-2xl shadow-sm mb-2 border-2 border-white">
            <BookOpen className="text-white fill-current" size={28} />
          </div>
          <span className="text-4xl font-black text-[#4b7d78]">{newWordsAvailable}</span>
          <span className="text-[9px] font-black uppercase text-[#8d99ae] tracking-widest mt-1">New Seeds</span>
        </div>
        <div className="bg-white px-6 py-6 rounded-[2.5rem] shadow-[0_8px_0_#e0e0e0] border-4 border-[#f0f0f0] flex flex-col items-center justify-center">
          <div className="bg-[#a5d6a7] p-4 rounded-2xl shadow-sm mb-2 border-2 border-white">
            <Sun className="text-white fill-current" size={28} />
          </div>
          <span className="text-4xl font-black text-[#4b7d78]">{wordsDue}</span>
          <span className="text-[9px] font-black uppercase text-[#8d99ae] tracking-widest mt-1">Daily Care</span>
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
              : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none border-4 border-transparent"
            }`}
          >
            <div className="flex items-center space-x-5">
              <div className="bg-white/30 p-4 rounded-2xl group-hover:rotate-12 transition-transform shadow-inner border-2 border-white/40">
                <Sparkles size={32} className="fill-current" />
              </div>
              <div className="text-left">
                <div className="text-2xl">Start Planting</div>
                <div className="text-[10px] uppercase opacity-80 tracking-widest font-black">Learn {newWordsAvailable} new words</div>
              </div>
            </div>
            <ArrowRight className="text-white w-7 h-7" strokeWidth={3} />
          </button>

          {/* New Words Preview */}
          {newWordsAvailable > 0 && (
            <div className="bg-white/60 p-6 rounded-[2.5rem] border-4 border-dashed border-[#e0d9b4] animate-fadeIn relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                 <Leaf size={100} className="fill-current" />
               </div>
               <p className="text-[9px] font-black text-[#8d99ae] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                 <MousePointer2 size={12} className="fill-current" /> Package Contents
               </p>
               <div className="flex flex-wrap gap-2">
                  {newWordsList.slice(0, 8).map(word => (
                    <span key={word.id} className="bg-white px-3 py-1.5 rounded-xl shadow-sm border-2 border-[#f0f0f0] text-[#4b7d78] font-black text-xs">
                      {word.s}
                    </span>
                  ))}
                  {newWordsAvailable > 8 && (
                    <span className="px-2 py-1 text-[#8d99ae] font-black text-[10px] italic">+{newWordsAvailable - 8} more</span>
                  )}
               </div>
            </div>
          )}
        </div>

        <button 
          onClick={onStartReview}
          disabled={wordsDue === 0}
          className={`w-full p-7 rounded-[3rem] font-black flex items-center justify-between transition-all active:translate-y-2 active:shadow-none ${
            wordsDue > 0 
            ? "bg-[#88d068] text-white hover:bg-[#96e072] shadow-[0_10px_0_#5a9a3b] border-4 border-white" 
            : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none border-4 border-transparent"
          }`}
        >
          <div className="flex items-center space-x-5">
            <div className="bg-white/30 p-4 rounded-2xl shadow-inner border-2 border-white/40">
              <Footprints size={32} className={wordsDue > 0 ? "animate-bounce" : ""} />
            </div>
            <div className="text-left">
              <div className="text-2xl">Tending Garden</div>
              <div className="text-[10px] uppercase opacity-80 tracking-widest font-black">Review {wordsDue} known words</div>
            </div>
          </div>
          <ArrowRight className="text-white w-7 h-7" strokeWidth={3} />
        </button>
      </div>

      {/* Fun Fact Card */}
      <div className="bg-[#fff9c4] rounded-[2.5rem] p-6 border-4 border-dashed border-[#fdd835] flex items-start space-x-5 shadow-sm relative overflow-hidden group">
        <div className="bg-white p-3 rounded-2xl shadow-md border-2 border-[#fdd835] shrink-0 z-10">
          <Zap className="text-[#f44336] fill-current" size={24} />
        </div>
        <div className="text-sm text-[#5d4037] font-bold leading-snug flex-1 z-10">
            <strong className="text-[#e91e63] text-xs font-black uppercase tracking-widest block mb-1">Island Slang!</strong>
            <span className="text-[#d32f2f] font-black text-xl italic block mb-0.5">"¡No me toques los huevos!"</span>
            <p className="text-[11px] opacity-70 italic">"Stop bothering me!" (lit. don't touch my eggs)</p>
        </div>
        <div className="absolute -bottom-4 -right-4 opacity-10 rotate-12 transition-transform group-hover:rotate-0">
          <Star size={80} className="fill-current text-[#fdd835]" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
