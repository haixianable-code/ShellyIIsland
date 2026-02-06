
import React, { useEffect } from 'react';
import { Trophy, CheckCircle, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { playFanfare, playClick } from '../utils/sfx';
import confetti from 'canvas-confetti';

interface SyncCompleteModalProps {
  onClose: () => void;
}

const SyncCompleteModal: React.FC<SyncCompleteModalProps> = ({ onClose }) => {
  useEffect(() => {
    // 1. Play Sound
    setTimeout(() => playFanfare(), 300);

    // 2. Confetti Explosion
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#8bc34a', '#ffa600', '#29b6f6']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#8bc34a', '#ffa600', '#29b6f6']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm bg-[#f7f9e4] rounded-[3.5rem] border-[8px] border-white shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col items-center p-8 text-center animate-zoomIn">
         
         <div className="relative mb-8 mt-4">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-[#8bc34a]/20 rounded-full blur-xl animate-pulse" />
             <div className="bg-[#8bc34a] p-6 rounded-[2.5rem] shadow-[0_12px_0_#5a9a3b] border-4 border-white relative z-10 animate-bounce">
                <ShieldCheck size={64} className="text-white fill-current" />
             </div>
             <div className="absolute -right-6 -top-2 bg-[#ffa600] text-white p-2 rounded-full border-4 border-white shadow-sm rotate-12 z-20">
                <CheckCircle size={24} />
             </div>
         </div>

         <h2 className="text-3xl font-black text-[#4b7d78] mb-2 leading-tight tracking-tight">You're In!</h2>
         <p className="text-[#6d7c8e] font-bold mb-8 text-sm leading-relaxed px-4">
           Your progress is now safe in the cloud. You've officially become a <span className="text-[#ffa600]">Citizen of the Island</span>.
         </p>

         <button 
           onClick={() => { playClick(); onClose(); }}
           className="w-full bg-[#ffa600] text-white py-5 rounded-[2.5rem] font-black text-xl shadow-[0_8px_0_#e65100] border-4 border-white bubble-button flex items-center justify-center gap-3 hover:bg-[#ffb74d]"
         >
           Enter My Island <ArrowRight size={24} />
         </button>
         
         <div className="mt-8 flex flex-col items-center opacity-30 gap-1">
            <div className="flex items-center gap-1.5 text-[8px] font-black text-[#4b7d78] uppercase tracking-[0.4em]">
              Shelly Spanish Island
            </div>
            <Heart size={8} className="text-[#ff7b72] fill-current" />
         </div>
      </div>
    </div>
  );
};

export default SyncCompleteModal;
