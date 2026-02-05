
import React from 'react';
import { PackagePlus, ArrowRight } from 'lucide-react';
import { playShaker } from '../utils/sfx';

interface WordExpansionPackProps {
  availableCount: number;
  onExplore: () => void;
}

const WordExpansionPack: React.FC<WordExpansionPackProps> = ({ availableCount, onExplore }) => {
  return (
    <div 
      onMouseEnter={() => playShaker()} 
      className="bg-gradient-to-br from-[#88d068] to-[#78c850] p-8 rounded-[4rem] border-[8px] border-white shadow-[0_15px_0_#5a9a3b] flex flex-col md:flex-row items-center justify-between gap-6 text-white relative overflow-hidden group"
    >
      <div className="absolute -bottom-10 -left-10 opacity-10 rotate-12 transition-transform group-hover:scale-110 duration-1000">
        <PackagePlus size={180} />
      </div>
      <div className="relative z-10 flex items-center gap-6">
        <div className="bg-white/20 p-5 rounded-[2.5rem] border-4 border-white/40 shadow-inner">
          <PackagePlus size={40} />
        </div>
        <div>
          <h3 className="text-3xl font-black tracking-tight drop-shadow-sm">Island Expansion Pack</h3>
          <p className="font-bold opacity-80 mt-1">Add A1-B1 high-frequency words to your garden!</p>
        </div>
      </div>
      <button 
        onClick={onExplore}
        disabled={availableCount === 0}
        className="relative z-10 w-full md:w-auto bg-white text-[#5a9a3b] px-8 py-5 rounded-[2rem] font-black text-lg shadow-[0_8px_0_#e0e0e0] flex items-center justify-center gap-3 bubble-button disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none"
      >
        {availableCount > 0 ? `Explore ${availableCount} Seeds` : 'All Seeds Planted'}
        {availableCount > 0 && <ArrowRight size={24} />}
      </button>
    </div>
  );
};

export default WordExpansionPack;
