
import React from 'react';
import { History, Sun, Rocket, Camera, Film } from 'lucide-react';
import { playClick, playShaker, playSwish } from '../../utils/sfx';

export type TimeState = 'past' | 'present' | 'future';
export type PastMode = 'snapshot' | 'movie';

interface TimeMachineProps {
  state: TimeState;
  onChange: (s: TimeState) => void;
  available: boolean;
  pastMode: PastMode;
  onTogglePast: (mode: PastMode) => void;
  hasImperfect: boolean;
}

export const TimeMachine: React.FC<TimeMachineProps> = ({ 
  state, onChange, available, pastMode, onTogglePast, hasImperfect 
}) => {
  if (!available) return null;

  return (
    <div className="mb-6 animate-slideUp">
      <div className="flex items-center justify-center gap-2">
        <button 
          onClick={(e) => { e.stopPropagation(); playShaker(); onChange('past'); }}
          className={`p-3 rounded-2xl border-2 transition-all ${state === 'past' ? 'bg-[#795548] text-white border-[#795548] shadow-md scale-110' : 'bg-white border-[#d7ccc8] text-[#a1887f] hover:bg-[#efebe9]'}`}
        >
          <History size={20} />
        </button>
        
        <div className="h-1.5 w-16 bg-slate-200 rounded-full relative overflow-hidden">
          <div className={`absolute top-0 bottom-0 w-1/3 rounded-full transition-all duration-300 ${state === 'past' ? 'left-0 bg-[#795548]' : state === 'future' ? 'left-2/3 bg-[#2196f3]' : 'left-1/3 bg-[#ffa600]'}`} />
        </div>

        <button 
          onClick={(e) => { e.stopPropagation(); playClick(); onChange('present'); }}
          className={`p-3 rounded-2xl border-2 transition-all ${state === 'present' ? 'bg-[#ffa600] text-white border-[#ffa600] shadow-md scale-110' : 'bg-white border-[#ffe0b2] text-[#ffcc80] hover:bg-[#fff3e0]'}`}
        >
          <Sun size={20} />
        </button>

        <div className="h-1.5 w-16 bg-slate-200 rounded-full relative overflow-hidden">
          <div className={`absolute top-0 bottom-0 w-1/3 rounded-full transition-all duration-300 ${state === 'past' ? 'left-0 bg-[#795548]' : state === 'future' ? 'left-2/3 bg-[#2196f3]' : 'left-1/3 bg-[#ffa600]'}`} />
        </div>

        <button 
          onClick={(e) => { e.stopPropagation(); playSwish(); onChange('future'); }}
          className={`p-3 rounded-2xl border-2 transition-all ${state === 'future' ? 'bg-[#2196f3] text-white border-[#2196f3] shadow-md scale-110' : 'bg-white border-[#bbdefb] text-[#90caf9] hover:bg-[#e3f2fd]'}`}
        >
          <Rocket size={20} />
        </button>
      </div>

      {state === 'past' && hasImperfect && (
        <div className="flex justify-center mt-4 animate-slideDown">
          <div className="bg-[#efebe9] p-1 rounded-xl flex gap-1 border border-[#d7ccc8]">
            <button
              onClick={(e) => { e.stopPropagation(); playClick(); onTogglePast('snapshot'); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${pastMode === 'snapshot' ? 'bg-[#795548] text-white shadow-sm' : 'text-[#8d6e63] hover:bg-[#d7ccc8]/50'}`}
            >
              <Camera size={12} /> Fui (Snapshot)
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); playClick(); onTogglePast('movie'); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${pastMode === 'movie' ? 'bg-[#5d4037] text-white shadow-sm' : 'text-[#8d6e63] hover:bg-[#d7ccc8]/50'}`}
            >
              <Film size={12} /> Era (Movie)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
