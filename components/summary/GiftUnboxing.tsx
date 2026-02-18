
import React, { useState } from 'react';
import { Package, Lock, Unlock, Sparkles, ArrowRight } from 'lucide-react';
import { playClick, playFanfare, playShaker } from '../../utils/sfx';
import confetti from 'canvas-confetti';

interface GiftUnboxingProps {
  onOpen: () => void;
}

const GiftUnboxing: React.FC<GiftUnboxingProps> = ({ onOpen }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    playClick();
    setIsOpen(true);
    playFanfare();
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ffd740', '#ffffff', '#ffa600']
    });
  };

  if (isOpen) {
    return (
      <div className="relative w-full max-w-sm bg-gradient-to-br from-amber-400 to-orange-500 rounded-[3rem] p-8 text-center text-white shadow-xl animate-zoomIn flex flex-col items-center border-[8px] border-white">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
        
        <div className="bg-white/20 p-6 rounded-full mb-6 animate-spin-slow backdrop-blur-sm">
           <Unlock size={48} className="text-white" />
        </div>
        
        <h2 className="text-3xl font-black uppercase tracking-tight mb-2 drop-shadow-md">Survival Kit</h2>
        <p className="font-bold opacity-90 mb-8 leading-tight">
          You found a 3-Day Premium Supply Drop!
        </p>

        <div className="space-y-3 w-full">
           <div className="bg-white/10 p-3 rounded-2xl flex items-center gap-3">
              <Sparkles size={20} /> <span className="font-black text-sm uppercase">Unlimited AI Hints</span>
           </div>
           <div className="bg-white/10 p-3 rounded-2xl flex items-center gap-3">
              <Sparkles size={20} /> <span className="font-black text-sm uppercase">Double XP Gain</span>
           </div>
        </div>

        <button 
          onClick={onOpen}
          className="mt-8 bg-white text-orange-600 w-full py-4 rounded-[2rem] font-black text-lg shadow-lg flex items-center justify-center gap-2 bubble-button"
        >
          Equip & Continue <ArrowRight size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-xs cursor-pointer group" onClick={handleOpen} onMouseEnter={playShaker}>
       {/* Parachute strings (visual only) */}
       <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-1 h-20 bg-slate-300 opacity-50 z-0"></div>
       
       <div className="relative z-10 bg-[#f7f9e4] p-8 rounded-[3rem] border-[8px] border-[#e0d9b4] shadow-[0_20px_0_#d3c89d] group-hover:-translate-y-2 transition-transform duration-300 flex flex-col items-center text-center animate-bounce-slight">
          <div className="bg-[#ffa600] p-6 rounded-3xl shadow-inner mb-4 border-4 border-white">
             <Package size={48} className="text-white" />
          </div>
          <h3 className="text-2xl font-black text-[#4b7d78] uppercase tracking-tight">Supply Drop</h3>
          <p className="text-xs font-bold text-[#8d99ae] uppercase tracking-widest mt-2">Tap to Open</p>
          
          <div className="absolute -right-2 -top-2 bg-[#ff7b72] text-white p-2 rounded-full border-4 border-white shadow-sm rotate-12">
             <Lock size={16} />
          </div>
       </div>
    </div>
  );
};

export default GiftUnboxing;
