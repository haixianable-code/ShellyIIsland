
import React, { useMemo } from 'react';
import { Droplets, Sprout, CheckCircle2, ArrowRight, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { playClick } from '../../utils/sfx';

interface ActionConsoleProps {
  reviewCount: number;
  newCount: number;
  onReview: () => void;
  onStudy: () => void;
  onExplore: () => void;
  streak: number;
}

type ConsoleState = 'DEFEND' | 'EXPAND' | 'SECURE';

const ActionConsole: React.FC<ActionConsoleProps> = ({ 
  reviewCount, 
  newCount, 
  onReview, 
  onStudy, 
  onExplore,
  streak
}) => {
  const { t } = useTranslation();

  // Determine State
  const currentState: ConsoleState = useMemo(() => {
    if (reviewCount > 0) return 'DEFEND';
    if (newCount > 0) return 'EXPAND';
    return 'SECURE';
  }, [reviewCount, newCount]);

  // Visual Configuration based on state
  const config = useMemo(() => {
    switch (currentState) {
      case 'DEFEND':
        return {
          bg: 'bg-[#fff5f5]',
          border: 'border-[#ffcdd2]',
          accent: 'text-[#d32f2f]',
          iconBg: 'bg-[#ff5252]',
          icon: Droplets,
          title: t('ui.dashboard.action_defend_title'),
          subtitle: t('ui.dashboard.action_defend_subtitle', { count: reviewCount }),
          btnBg: 'bg-[#ff5252]',
          btnShadow: 'shadow-[0_8px_0_#d32f2f]',
          btnText: t('ui.dashboard.action_defend_btn'),
          action: onReview,
          animation: 'animate-pulse-slow',
          timeEst: Math.ceil(reviewCount * 0.5)
        };
      case 'EXPAND':
        return {
          bg: 'bg-[#fff8e1]',
          border: 'border-[#ffecb3]',
          accent: 'text-[#f57c00]',
          iconBg: 'bg-[#ffa600]',
          icon: Sprout,
          title: t('ui.dashboard.action_expand_title'),
          subtitle: t('ui.dashboard.action_expand_subtitle', { count: newCount }),
          btnBg: 'bg-[#ffa600]',
          btnShadow: 'shadow-[0_8px_0_#e65100]',
          btnText: t('ui.dashboard.action_expand_btn'),
          action: onStudy,
          animation: 'animate-float-small',
          timeEst: Math.ceil(newCount * 0.5)
        };
      case 'SECURE':
      default:
        return {
          bg: 'bg-[#f1f8e9]',
          border: 'border-[#c5e1a5]',
          accent: 'text-[#558b2f]',
          iconBg: 'bg-[#78c850]',
          icon: CheckCircle2,
          title: t('ui.dashboard.action_secure_title'),
          subtitle: t('ui.dashboard.action_secure_subtitle'),
          btnBg: 'bg-[#78c850]',
          btnShadow: 'shadow-[0_8px_0_#558b2f]',
          btnText: t('ui.dashboard.action_secure_btn'),
          action: onExplore,
          animation: '',
          timeEst: 0
        };
    }
  }, [currentState, reviewCount, newCount, t, onReview, onStudy, onExplore]);

  const Icon = config.icon;
  const { i18n } = useTranslation();
  const isChinese = i18n.language.startsWith('zh');

  return (
    <div className="relative w-full max-w-xl mx-auto z-30 perspective-1000">
      <div 
        className={`relative ${config.bg} rounded-[3rem] p-8 border-[6px] ${config.border} shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] flex flex-col items-center text-center overflow-hidden transition-all duration-500 ${config.animation}`}
      >
        {/* Background Texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px' }} />

        {/* Status Icon */}
        <div className={`${config.iconBg} p-5 rounded-[2rem] text-white shadow-lg mb-6 border-4 border-white transform transition-transform hover:scale-110`}>
          <Icon size={40} strokeWidth={2.5} />
        </div>

        {/* Text Content */}
        <div className="space-y-2 mb-8 relative z-10">
          <h2 className={`text-sm ${isChinese ? 'font-bold tracking-wide' : 'font-black tracking-[0.2em]'} uppercase ${config.accent} opacity-80`}>
            {config.title}
          </h2>
          <h1 className={`text-3xl md:text-4xl ${isChinese ? 'font-bold' : 'font-black'} ${config.accent} leading-tight tracking-tighter`}>
            {config.subtitle}
          </h1>
        </div>

        {/* The Big Button */}
        <button
          onClick={() => { playClick(); config.action(); }}
          className={`w-full max-w-xs ${config.btnBg} text-white py-5 rounded-[2.5rem] ${isChinese ? 'font-bold' : 'font-black'} text-xl ${config.btnShadow} border-4 border-white bubble-button flex items-center justify-center gap-3 relative overflow-hidden group animate-breathe`}
        >
          <span className="relative z-10">{config.btnText}</span>
          <ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
          
          {/* Shine Effect */}
          <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:animate-shine" />
        </button>

        {/* Footer Meta (Time Estimate) */}
        {currentState !== 'SECURE' && (
           <div className="mt-4 flex items-center gap-2 opacity-50">
              <Zap size={12} className={config.accent} />
              <span className={`text-[10px] ${isChinese ? 'font-bold tracking-wide' : 'font-black tracking-widest'} uppercase ${config.accent}`}>
                {t('ui.dashboard.action_time_est', { time: config.timeEst })}
              </span>
           </div>
        )}
      </div>

      {/* Social Proof / Motivation below console */}
      <div className="mt-6 text-center">
         <p className={`text-[10px] font-bold text-slate-400 uppercase ${isChinese ? 'tracking-wide' : 'tracking-widest'}`}>
            {streak > 2 
              ? t('ui.dashboard.streak_fire', { streak })
              : t('ui.dashboard.streak_low')}
         </p>
      </div>
    </div>
  );
};

export default ActionConsole;
