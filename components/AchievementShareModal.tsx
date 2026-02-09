import React, { useState, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Map, TreePalm, ShieldCheck, Flame, Sprout, Share2, Loader2, Star, Compass } from 'lucide-react';
import { playClick } from '../utils/sfx';
// @ts-ignore
import html2canvas from 'html2canvas';

interface AchievementShareModalProps {
  name: string;
  totalWords: number;
  streak: number;
  onClose: () => void;
}

const AchievementShareModal: React.FC<AchievementShareModalProps> = ({ name, totalWords, streak, onClose }) => {
  const { t } = useTranslation();
  const [isGenerating, setIsGenerating] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);

  const rank = useMemo(() => {
    if (totalWords > 500) return t('ui.achievement.ranks.lord');
    if (totalWords > 100) return t('ui.achievement.ranks.guide');
    return t('ui.achievement.ranks.novice');
  }, [totalWords, t]);

  const handleShare = async () => {
    playClick();
    if (!captureRef.current) return;
    
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(captureRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#fffdf5',
      });

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], 'ssi-achievement.png', { type: 'image/png' });

        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file] });
        } else {
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = 'ssi-achievement.png';
          link.click();
        }
        setIsGenerating(false);
      }, 'image/png');
    } catch (err) {
      console.error(err);
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#fffdf5] rounded-[4rem] shadow-2xl overflow-hidden animate-zoomIn flex flex-col max-h-[90vh]">
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-50 bg-white/80 p-3 rounded-2xl text-[#4b7d78] shadow-md hover:bg-white transition-all active:scale-90"
        >
          <X size={20} strokeWidth={3} />
        </button>

        <div className="flex-1 overflow-y-auto no-scrollbar p-6">
           {/* CAPTURE CONTENT */}
           <div ref={captureRef} className="bg-[#fffdf5] p-10 rounded-[3rem] border-[12px] border-white shadow-inner relative flex flex-col items-center text-center overflow-hidden">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 19px, #000 20px)' }} />
              <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                 <Map className="absolute -left-20 -top-20 rotate-12" size={300} />
                 <TreePalm className="absolute -right-20 bottom-0 -rotate-12" size={300} />
              </div>

              <div className="relative z-10 space-y-8 w-full">
                 <div className="space-y-2">
                    <div className="inline-flex bg-[#78c850] p-4 rounded-3xl border-4 border-white shadow-lg mb-2">
                       <ShieldCheck size={48} className="text-white" />
                    </div>
                    <h2 className="text-4xl font-black text-[#4b7d78] tracking-tighter uppercase">{t('ui.achievement.title')}</h2>
                    <div className="bg-[#ff7b72] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest inline-block border-2 border-white shadow-sm">
                       {t('ui.achievement.certified')}
                    </div>
                 </div>

                 <div className="space-y-1">
                    <p className="text-xs font-black text-[#8d99ae] uppercase tracking-widest">Citizen of SS Island</p>
                    <h3 className="text-5xl font-black text-[#4b7d78] tracking-tighter">{name}</h3>
                 </div>

                 <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="bg-white/80 backdrop-blur p-6 rounded-[2.5rem] border-4 border-[#e0d9b4] flex flex-col items-center">
                       <Sprout className="text-[#8bc34a] mb-2 fill-current" size={32} />
                       <span className="text-3xl font-black text-[#4b7d78]">{totalWords}</span>
                       <span className="text-[9px] font-black uppercase text-[#8d99ae] tracking-widest mt-1">{t('ui.achievement.words_grown')}</span>
                    </div>
                    <div className="bg-white/80 backdrop-blur p-6 rounded-[2.5rem] border-4 border-[#e0d9b4] flex flex-col items-center">
                       <Flame className="text-[#ffa000] mb-2 fill-current" size={32} />
                       <span className="text-3xl font-black text-[#4b7d78]">{streak}</span>
                       <span className="text-[9px] font-black uppercase text-[#8d99ae] tracking-widest mt-1">{t('ui.achievement.max_streak')}</span>
                    </div>
                 </div>

                 <div className="bg-[#fff9c4] p-6 rounded-[2.5rem] border-4 border-[#fdd835] shadow-sm relative">
                    <Star className="absolute top-3 left-6 text-[#ffa600]/20" size={40} fill="currentColor" />
                    <Star className="absolute bottom-3 right-6 text-[#ffa600]/20" size={40} fill="currentColor" />
                    <p className="text-[10px] font-black text-[#8e6b23] uppercase tracking-[0.3em] mb-1">{t('ui.achievement.rank')}</p>
                    <h4 className="text-3xl font-black text-[#8e6b23] tracking-tight">{rank}</h4>
                 </div>

                 <div className="pt-10 border-t-2 border-[#e0d9b4]/50 flex flex-col items-center gap-6">
                    <div className="flex flex-col items-center gap-2">
                       <div className="w-20 h-20 bg-white p-2 rounded-2xl border-4 border-[#4b7d78] shadow-sm flex items-center justify-center">
                          <Compass size={48} className="text-[#4b7d78]" />
                       </div>
                       <p className="text-[9px] font-black text-[#4b7d78] uppercase tracking-widest">{t('ui.achievement.scan_msg')}</p>
                    </div>
                    <div className="text-[#4b7d78] text-2xl font-black uppercase tracking-widest border-b-4 border-[#ffa600] pb-1">
                       SSISLAND.SPACE
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div className="p-8 bg-[#f9f5da] border-t-4 border-[#e0d9b4] flex flex-col items-center">
           <button
             onClick={handleShare}
             disabled={isGenerating}
             className="w-full bg-[#ffa600] text-white py-5 rounded-[2.5rem] font-black text-xl shadow-[0_10px_0_#e65100] border-4 border-white bubble-button flex items-center justify-center gap-3 hover:bg-[#ffb74d] disabled:opacity-50"
           >
              {isGenerating ? <Loader2 className="animate-spin" /> : <Share2 size={24} />}
              <span>{isGenerating ? t('ui.actions.generating') : t('ui.actions.share_harvest')}</span>
           </button>
        </div>
      </div>
    </div>
  );
};

export default AchievementShareModal;