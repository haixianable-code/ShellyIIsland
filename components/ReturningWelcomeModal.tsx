import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Map, Leaf, Ship, Sprout, CloudRain, Flame, ChevronRight, Compass } from 'lucide-react';
import { playClick, playSparkle, playSwish } from '../utils/sfx';

interface ReturningWelcomeModalProps {
  name: string;
  reviewsCount: number;
  newSeedsCount: number;
  streak: number;
  onEnter: () => void;
}

const ReturningWelcomeModal: React.FC<ReturningWelcomeModalProps> = ({ name, reviewsCount, newSeedsCount, streak, onEnter }) => {
  const { t } = useTranslation();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return t('ui.auth.returning.good_morning');
    if (hour < 18) return t('ui.auth.returning.good_afternoon');
    return t('ui.auth.returning.good_evening');
  }, [t]);

  useEffect(() => {
    playSwish();
  }, []);

  const handleEnter = () => {
    playClick();
    onEnter();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#f7f9e4]/80 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#fffdf5] rounded-[3.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] overflow-hidden animate-zoomIn border-[10px] border-white">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #000 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        <div className="bg-[#78c850] p-8 pb-14 text-center relative">
          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-white p-4 rounded-[2rem] shadow-lg mb-3">
              <Compass size={32} className="text-[#4b7d78] animate-spin-slow" />
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-[0.2em]">{t('ui.auth.returning.log_title')}</h2>
          </div>
          <div className="absolute right-6 -bottom-4 bg-white px-4 py-2 rounded-xl border-4 border-[#ff7b72] text-[#ff7b72] font-black text-xl rotate-12 shadow-md z-20 uppercase tracking-tighter">
             {t('ui.auth.returning.arrived_stamp')}
          </div>
        </div>

        <div className="p-8 pt-12 space-y-8 relative bg-[#fffdf5]">
          <div className="space-y-1">
             <h3 className="text-3xl font-black text-[#4b7d78] leading-tight uppercase tracking-tighter">{greeting}</h3>
             <p className="text-lg font-bold text-[#8d99ae] uppercase tracking-wide">{t('ui.auth.returning.welcome_back', { name })}</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-3xl bg-white border-2 border-[#e0d9b4]/50 shadow-sm transition-transform hover:scale-[1.02]">
               <div className="bg-[#e1f5fe] p-3 rounded-2xl shrink-0"><CloudRain size={24} className="text-[#0288d1] fill-current" /></div>
               <div className="flex items-baseline gap-1 pt-1">
                 <span className="text-2xl font-black text-[#4b7d78] tracking-tighter leading-none">{reviewsCount}</span>
                 <p className="text-[10px] font-black text-[#8d99ae] uppercase tracking-tight">{t('ui.dashboard.daily_care')}</p>
               </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-3xl bg-white border-2 border-[#e0d9b4]/50 shadow-sm transition-transform hover:scale-[1.02]">
               <div className="bg-[#f1f8e9] p-3 rounded-2xl shrink-0"><Sprout size={24} className="text-[#8bc34a] fill-current" /></div>
               <div className="flex items-baseline gap-1 pt-1">
                 <span className="text-2xl font-black text-[#4b7d78] tracking-tighter leading-none">{newSeedsCount}</span>
                 <p className="text-[10px] font-black text-[#8d99ae] uppercase tracking-tight">{t('ui.dashboard.new_seeds')}</p>
               </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-3xl bg-white border-2 border-[#e0d9b4]/50 shadow-sm transition-transform hover:scale-[1.02]">
               <div className="bg-[#fff3e0] p-3 rounded-2xl shrink-0"><Flame size={24} className="text-[#ffa000] fill-current" /></div>
               <div className="flex items-baseline gap-1 pt-1">
                 <span className="text-2xl font-black text-[#4b7d78] tracking-tighter leading-none">{streak}</span>
                 <p className="text-[10px] font-black text-[#8d99ae] uppercase tracking-tight">{t('ui.study.day_streak')}</p>
               </div>
            </div>
          </div>
          <div className="pt-4"><button onClick={handleEnter} className="w-full bg-[#ffa600] text-white py-5 rounded-[2.5rem] font-black text-xl shadow-[0_10px_0_#e65100] border-4 border-white bubble-button flex items-center justify-center gap-3 hover:bg-[#ffb74d] transition-all"><Ship size={24} /><span>{t('ui.auth.returning.enter_btn')}</span><ChevronRight size={24} /></button></div>
        </div>
        <div className="flex justify-center opacity-30 pb-8 bg-[#fffdf5]"><div className="text-[8px] font-black text-[#4b7d78] uppercase tracking-[0.4em]">Official SSI Entry Log V2</div></div>
      </div>
    </div>
  );
};

export default ReturningWelcomeModal;