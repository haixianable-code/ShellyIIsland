
import React, { useMemo } from 'react';
import { X, Flame, Sparkles, Star, Trophy, Heart, Languages } from 'lucide-react';
import { Word } from '../types';

interface StreakModalProps {
  onClose: () => void;
  streak: number;
  words: Word[];
}

const StreakModal: React.FC<StreakModalProps> = ({ onClose, streak, words }) => {
  // Select a random sample of words to "pile up"
  const wordPile = useMemo(() => {
    return [...words].sort(() => 0.5 - Math.random()).slice(0, 12);
  }, [words]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm bg-[#f7f9e4] rounded-[4rem] border-[12px] border-white shadow-[0_30px_60px_-12px_rgba(0,0,0,0.4)] overflow-hidden animate-zoomIn flex flex-col">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-30 bg-white/90 backdrop-blur p-3 rounded-2xl text-[#4b7d78] hover:bg-white transition-all shadow-md active:scale-90"
        >
          <X size={20} strokeWidth={3} />
        </button>

        {/* Poster Content */}
        <div className="relative p-8 pt-12 flex flex-col items-center text-center overflow-y-auto no-scrollbar max-h-[85vh]">
          
          {/* Background Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 z-0">
            <Star className="absolute top-10 left-10 text-[#ffa600] animate-pulse" size={40} fill="currentColor" />
            <Sparkles className="absolute bottom-20 right-10 text-[#88d068]" size={60} />
            <Languages className="absolute top-40 left-[-20px] text-[#ffcc80] -rotate-12" size={100} />
          </div>

          <div className="z-10 space-y-6 w-full">
            <div className="inline-flex flex-col items-center">
              <div className="bg-[#ffeb3b] p-5 rounded-[2.5rem] shadow-[0_8px_0_#fbc02d] border-4 border-white mb-3 animate-bounce">
                <Flame size={48} className="text-[#f57c00] fill-current" />
              </div>
              <h2 className="text-3xl font-black text-[#4b7d78] tracking-tight uppercase italic">Spanish Master!</h2>
            </div>

            <div className="space-y-1">
              <p className="text-[11px] font-black text-[#8d99ae] uppercase tracking-[0.2em]">You've stayed consistent for</p>
              <div className="relative inline-block">
                <span className="text-7xl font-black text-[#ffa600] drop-shadow-[0_6px_0_#cc8400] italic">
                  {streak}
                </span>
                <span className="text-2xl font-black text-[#ffa600] ml-2 italic">Days</span>
              </div>
            </div>

            {/* Word Pile Section */}
            <div className="relative py-4 px-2">
              <p className="text-[10px] font-black text-[#4b7d78] uppercase tracking-[0.3em] mb-6 opacity-60">My Vocabulary Harvest</p>
              <div className="flex flex-wrap justify-center gap-2 items-center min-h-[140px]">
                {wordPile.length > 0 ? (
                  wordPile.map((w, i) => {
                    const rotations = ['rotate-1', '-rotate-2', 'rotate-3', '-rotate-1', 'rotate-2', '-rotate-3'];
                    const bgColors = ['bg-[#ff7b72]', 'bg-[#ffb74d]', 'bg-[#88d068]', 'bg-[#ffa600]', 'bg-[#78c850]'];
                    return (
                      <div 
                        key={w.id}
                        className={`px-4 py-2 rounded-2xl text-white font-black text-xs shadow-md border-2 border-white/40 ${rotations[i % rotations.length]} ${bgColors[i % bgColors.length]} animate-fadeIn`}
                        style={{ animationDelay: `${i * 0.05}s` }}
                      >
                        {w.s}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-[#8d99ae] italic font-bold text-sm">Learning first words...</div>
                )}
              </div>
              <div className="mt-4 text-[10px] font-black text-[#4b7d78] uppercase bg-white/60 py-2 px-4 rounded-full border-2 border-dashed border-[#e0d9b4] inline-block">
                Total Words: {words.length}
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur p-5 rounded-[2.5rem] border-4 border-[#88d068] shadow-inner">
              <p className="text-[#4b7d78] font-black leading-tight italic text-base">
                "¡Increíble! Your Spanish garden is flourishing beautifully."
              </p>
            </div>

            <button 
              onClick={onClose}
              className="w-full bg-[#88d068] text-white py-5 rounded-[2.5rem] font-black text-xl shadow-[0_8px_0_#5a9a3b] border-4 border-white bubble-button"
            >
              Back to Island
            </button>
          </div>

          {/* Signature on Poster */}
          <div className="mt-10 pt-6 border-t-2 border-black/5 flex flex-col items-center opacity-40 gap-1 w-full pb-4">
            <div className="flex items-center gap-1.5 text-[8px] font-black text-[#4b7d78] uppercase tracking-[0.4em]">
              Made By SHELLY
            </div>
            <Heart size={8} className="text-[#ff7b72] fill-current" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreakModal;
