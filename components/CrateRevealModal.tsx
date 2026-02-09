import React, { useEffect } from 'react';
import { Word } from '../types';
import { useTranslation } from 'react-i18next';
import { X, ArrowRight, PackageOpen } from 'lucide-react';
import { playFanfare, playClick } from '../utils/sfx';
import confetti from 'canvas-confetti';

interface CrateRevealModalProps {
  words: Word[];
  onClose: () => void;
  onConfirm: () => void;
}

const CrateRevealModal: React.FC<CrateRevealModalProps> = ({ words, onClose, onConfirm }) => {
  const { t } = useTranslation();

  useEffect(() => {
    playFanfare();
    const duration = 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ffa600', '#8bc34a', '#ffffff']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ffa600', '#8bc34a', '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="fixed inset-0 md:left-72 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-sm md:max-w-2xl bg-[#f7f9e4] rounded-[3rem] md:rounded-[3.5rem] border-[8px] border-white shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col animate-zoomIn max-h-[85vh] md:h-auto">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-white/50 p-2 rounded-full hover:bg-white text-[#4b7d78] transition-all active:scale-90"
        >
          <X size={20} />
        </button>

        <div className="bg-[#ffa600] p-8 md:p-10 text-center relative overflow-hidden shrink-0">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_white_0%,_transparent_70%)] animate-pulse" />
            <div className="relative z-10 flex flex-col items-center">
                <div className="bg-white/20 p-4 rounded-[2rem] border-4 border-white/30 mb-2 shadow-inner animate-bounce-slight">
                    <PackageOpen size={48} className="text-white fill-current md:w-16 md:h-16" />
                </div>
                <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight drop-shadow-sm">
                    {t('ui.dashboard.crate_unlocked')}
                </h2>
            </div>
        </div>

        <div className="p-6 md:p-8 flex-1 overflow-y-auto no-scrollbar">
            <p className="text-center text-[#8d99ae] font-bold text-sm md:text-base mb-6 md:mb-8">
                {t('ui.dashboard.crate_found', { count: words.length })}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                {words.map((w, i) => (
                    <div key={w.id} className="bg-white p-3 rounded-2xl border-2 border-[#e0d9b4] flex items-center gap-2 animate-slideUp shadow-sm hover:border-[#8bc34a] transition-colors" style={{ animationDelay: `${i * 0.05}s` }}>
                        <div className="w-2 h-2 shrink-0 rounded-full bg-[#8bc34a]" />
                        <span className="text-xs md:text-sm font-black text-[#4b7d78] truncate">{w.s}</span>
                    </div>
                ))}
            </div>
        </div>

        <div className="p-6 pt-2 md:p-8 bg-[#f7f9e4] relative z-20 shrink-0">
            <button 
                onClick={() => { playClick(); onConfirm(); }}
                className="w-full bg-[#8bc34a] text-white py-4 md:py-5 rounded-[2rem] md:rounded-[2.5rem] font-black text-lg md:text-xl shadow-[0_6px_0_#5a9a3b] border-4 border-white bubble-button flex items-center justify-center gap-2 hover:bg-[#96e072]"
            >
                <span>{t('ui.actions.add_inventory')}</span>
                <ArrowRight size={24} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default CrateRevealModal;