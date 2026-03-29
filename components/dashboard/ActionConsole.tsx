
import React from 'react';
import { Droplets, Sprout, CheckCircle2, Target } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { playClick } from '../../utils/sfx';
import { Blueprint } from '../../types';

interface ActionConsoleProps {
  activeBlueprint?: Blueprint;
  blueprintProgress: number;
  reviewCount: number;
  newCount: number;
  onReview: () => void;
  onStudy: () => void;
  onExplore: () => void;
}

const ActionConsole: React.FC<ActionConsoleProps> = ({ 
  activeBlueprint,
  blueprintProgress,
  reviewCount, 
  newCount, 
  onReview, 
  onStudy, 
  onExplore
}) => {
  const { t, i18n } = useTranslation();
  const isChinese = i18n.language.startsWith('zh');

  const isReview = reviewCount > 0;
  const isLearn = !isReview && newCount > 0;

  const title = activeBlueprint ? (isChinese ? activeBlueprint.title.zh : activeBlueprint.title.en) : 'Unknown Sector';
  const desc = activeBlueprint ? (isChinese ? activeBlueprint.desc.zh : activeBlueprint.desc.en) : '';

  return (
    <div className="relative w-full max-w-2xl mx-auto z-30">
      <div className="bg-white rounded-[2.5rem] p-6 md:p-8 border-4 border-[#e0d9b4] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] flex flex-col relative overflow-hidden transition-all">
        {/* Header: Current Focus Badge */}
        <div className="flex items-center gap-2 mb-5">
          <div className="bg-[#ffa600] text-white text-[10px] md:text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
            <Target size={14} strokeWidth={3} /> {isChinese ? '当前目标' : 'Current Focus'}
          </div>
        </div>

        {/* Blueprint Info */}
        <div className="mb-8">
          <h2 className={`text-2xl md:text-3xl ${isChinese ? 'font-bold' : 'font-black'} text-[#2d4a47] mb-3 leading-tight tracking-tight`}>
            {title}
          </h2>
          <p className="text-[#8d99ae] font-bold text-sm md:text-base leading-relaxed">
            {desc}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 bg-slate-50 p-4 rounded-2xl border-2 border-slate-100">
          <div className="flex justify-between items-end mb-2">
            <span className="text-[10px] md:text-xs font-black text-[#8bc34a] uppercase tracking-widest">
              {isChinese ? '关卡进度' : 'Sector Progress'}
            </span>
            <span className="text-sm md:text-base font-black text-[#4b7d78]">{blueprintProgress}%</span>
          </div>
          <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden border border-slate-300/50">
            <div 
              className="h-full bg-[#8bc34a] rounded-full transition-all duration-1000 relative overflow-hidden" 
              style={{ width: `${blueprintProgress}%` }} 
            >
              <div className="absolute inset-0 bg-white/20 w-full h-full animate-shine skew-x-12" />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-auto">
          {isReview ? (
            <button 
              onClick={() => { playClick(); onReview(); }} 
              className="w-full bg-[#ff5252] text-white py-4 md:py-5 rounded-2xl font-black text-lg shadow-[0_6px_0_#d32f2f] border-2 border-white bubble-button flex items-center justify-center gap-2 hover:bg-[#ff6b6b] transition-all group"
            >
              <Droplets size={22} className="group-hover:animate-bounce" /> 
              {t('ui.dashboard.action_defend_btn')} ({reviewCount})
            </button>
          ) : isLearn ? (
            <button 
              onClick={() => { playClick(); onStudy(); }} 
              className="w-full bg-[#ffa600] text-white py-4 md:py-5 rounded-2xl font-black text-lg shadow-[0_6px_0_#e65100] border-2 border-white bubble-button flex items-center justify-center gap-2 hover:bg-[#ffb74d] transition-all group"
            >
              <Sprout size={22} className="group-hover:animate-bounce" /> 
              {t('ui.dashboard.action_expand_btn')} ({newCount})
            </button>
          ) : (
            <button 
              onClick={() => { playClick(); onExplore(); }} 
              className="w-full bg-[#8bc34a] text-white py-4 md:py-5 rounded-2xl font-black text-lg shadow-[0_6px_0_#558b2f] border-2 border-white bubble-button flex items-center justify-center gap-2 hover:bg-[#9ccc65] transition-all group"
            >
              <CheckCircle2 size={22} className="group-hover:scale-110 transition-transform" /> 
              {t('ui.dashboard.action_secure_btn')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActionConsole;
