
import React, { useState, useEffect } from 'react';
import { Blueprint, ProgressMap } from '../../types';
import { Lock, CheckCircle2, CircleDashed, ChevronDown, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { playClick } from '../../utils/sfx';

interface BlueprintMapProps {
  blueprints: Blueprint[];
  progress: ProgressMap;
  activeId: string;
  isPremium: boolean | undefined;
  onSelect: (bp: Blueprint) => void;
  onLockClick: () => void;
}

const BlueprintMap: React.FC<BlueprintMapProps> = ({ 
  blueprints, 
  progress, 
  activeId, 
  isPremium, 
  onSelect,
  onLockClick
}) => {
  const { t, i18n } = useTranslation();
  const isChinese = i18n.language.startsWith('zh');

  // Group blueprints by Phase
  const phases = React.useMemo(() => {
    const grouped: Record<number, Blueprint[]> = {};
    blueprints.forEach(bp => {
      if (!grouped[bp.phase]) grouped[bp.phase] = [];
      grouped[bp.phase].push(bp);
    });
    return grouped;
  }, [blueprints]);

  // Determine active phase
  const activePhase = React.useMemo(() => {
    const activeBp = blueprints.find(bp => bp.id === activeId);
    return activeBp ? activeBp.phase : 0;
  }, [blueprints, activeId]);

  const [expandedPhases, setExpandedPhases] = useState<Record<number, boolean>>({});

  // Initialize expanded phases
  useEffect(() => {
    setExpandedPhases(prev => ({ ...prev, [activePhase]: true }));
  }, [activePhase]);

  const togglePhase = (phase: number) => {
    playClick();
    setExpandedPhases(prev => ({ ...prev, [phase]: !prev[phase] }));
  };

  const getPhaseTitle = (phase: number) => {
    const titles = [
      "Phase 0: Survival Protocol",
      "Phase 1: Social Expansion",
      "Phase 2: Logic & Reason",
      "Phase 3: Native Fluency"
    ];
    const zhTitles = [
      "阶段 0：生存协议",
      "阶段 1：社交拓展",
      "阶段 2：逻辑与理性",
      "阶段 3：母语流利度"
    ];
    return isChinese ? (zhTitles[phase] || `阶段 ${phase}`) : (titles[phase] || `Phase ${phase}`);
  };

  return (
    <div className="space-y-8 relative z-10 pb-12">
      {/* Connector Line Background - Made softer */}
      <div className="absolute left-[2.25rem] top-8 bottom-0 w-0.5 bg-slate-100 rounded-full -z-10 hidden md:block" />

      {Object.keys(phases).map((phaseStr) => {
        const phase = parseInt(phaseStr);
        const isPhaseLocked = !isPremium && phase > 0; // Simple locking logic for Phase 1+ if not premium
        const isExpanded = expandedPhases[phase];
        
        // Calculate phase progress
        const phaseBlueprints = phases[phase];
        let phaseLearned = 0;
        let phaseTotal = 0;
        phaseBlueprints.forEach(bp => {
            phaseLearned += bp.wordIds.filter(id => !!progress[id]).length;
            phaseTotal += bp.wordIds.length;
        });
        const phasePercent = phaseTotal > 0 ? Math.round((phaseLearned / phaseTotal) * 100) : 0;

        // Phase Theme Colors for Header
        const getHeaderTheme = (p: number) => {
          switch(p) {
            case 0: return { bg: 'bg-[#fff8e1]', border: 'border-[#ffe082]', text: 'text-[#f57c00]', iconBg: 'bg-[#ffca28]' };
            case 1: return { bg: 'bg-[#e8f5e9]', border: 'border-[#c8e6c9]', text: 'text-[#388e3c]', iconBg: 'bg-[#66bb6a]' };
            case 2: return { bg: 'bg-[#e3f2fd]', border: 'border-[#bbdefb]', text: 'text-[#1976d2]', iconBg: 'bg-[#42a5f5]' };
            case 3: return { bg: 'bg-[#f3e5f5]', border: 'border-[#e1bee7]', text: 'text-[#7b1fa2]', iconBg: 'bg-[#ab47bc]' };
            default: return { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-500', iconBg: 'bg-slate-300' };
          }
        };
        const headerTheme = getHeaderTheme(phase);

        return (
          <div key={phase} className="space-y-4">
            {/* Phase Header - Styled like a notebook divider */}
            <button 
              onClick={() => togglePhase(phase)}
              className={`w-full flex items-center gap-4 text-left group transition-all duration-300 p-3 rounded-[2rem] border-2 ${isExpanded ? `${headerTheme.bg} ${headerTheme.border}` : 'bg-white border-transparent hover:bg-slate-50'}`}
            >
               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm shrink-0 transition-colors ${isPhaseLocked ? 'bg-slate-100 text-slate-400' : `${headerTheme.iconBg} text-white`}`}>
                  {isPhaseLocked ? <Lock size={18} /> : phase}
               </div>
               <div className="flex-1 flex flex-col justify-center">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-base ${isChinese ? 'font-bold' : 'font-black'} uppercase tracking-tight ${isPhaseLocked ? 'text-slate-400' : headerTheme.text}`}>
                      {getPhaseTitle(phase)}
                    </h3>
                    <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}>
                       <ChevronRight size={20} className={isPhaseLocked ? 'text-slate-300' : headerTheme.text} opacity={0.5} />
                    </div>
                  </div>
                  
                  {/* Show progress bar when collapsed */}
                  {!isExpanded && (
                    <div className="mt-1.5 flex items-center gap-3">
                       <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                             className={`h-full rounded-full transition-all duration-1000 ${phasePercent === 100 ? 'bg-[#8bc34a]' : headerTheme.iconBg}`}
                             style={{ width: `${phasePercent}%` }}
                          />
                       </div>
                       <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest shrink-0">
                          {phasePercent}%
                       </span>
                    </div>
                  )}
                  
                  {isExpanded && (
                    <p className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 opacity-60 ${headerTheme.text}`}>
                      {phases[phase].length} Sectors
                    </p>
                  )}
               </div>
            </button>

            {/* Grid of Blueprints (Critterpedia Style) */}
            {isExpanded && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 md:gap-4 pl-2 md:pl-16 pr-2 py-2 animate-fadeIn">
                {phases[phase].map((bp) => {
                  const isActive = activeId === bp.id;
                  const learnedCount = bp.wordIds.filter(id => !!progress[id]).length;
                  const totalCount = bp.wordIds.length;
                  const percent = Math.round((learnedCount / totalCount) * 100);
                  const isCompleted = percent === 100;
                  
                  // Individual blueprint lock override (if specific BP is premium)
                  const isItemLocked = isPhaseLocked || (bp.isPremium && !isPremium);

                  // Determine color theme based on phase - Softer, more pastel colors for the grid
                  const getPhaseColors = (p: number) => {
                    switch(p) {
                      case 0: return { bg: 'bg-[#fffdf7]', border: 'border-[#ffe082]', text: 'text-[#f57c00]', hover: 'hover:border-[#ffd54f] hover:bg-[#fff8e1]', activeRing: 'ring-[#ffe082]/40', activeBg: 'bg-[#fff8e1]' };
                      case 1: return { bg: 'bg-[#f6fbf7]', border: 'border-[#c8e6c9]', text: 'text-[#388e3c]', hover: 'hover:border-[#a5d6a7] hover:bg-[#e8f5e9]', activeRing: 'ring-[#c8e6c9]/40', activeBg: 'bg-[#e8f5e9]' };
                      case 2: return { bg: 'bg-[#f5faff]', border: 'border-[#bbdefb]', text: 'text-[#1976d2]', hover: 'hover:border-[#90caf9] hover:bg-[#e3f2fd]', activeRing: 'ring-[#bbdefb]/40', activeBg: 'bg-[#e3f2fd]' };
                      case 3: return { bg: 'bg-[#fbf7fc]', border: 'border-[#e1bee7]', text: 'text-[#7b1fa2]', hover: 'hover:border-[#ce93d8] hover:bg-[#f3e5f5]', activeRing: 'ring-[#e1bee7]/40', activeBg: 'bg-[#f3e5f5]' };
                      default: return { bg: 'bg-white', border: 'border-slate-200', text: 'text-slate-500', hover: 'hover:border-slate-300 hover:bg-slate-50', activeRing: 'ring-slate-200/40', activeBg: 'bg-slate-50' };
                    }
                  };
                  
                  const phaseTheme = getPhaseColors(phase);

                  return (
                    <button
                      key={bp.id}
                      onClick={() => {
                          playClick();
                          if (isItemLocked) onLockClick();
                          else onSelect(bp);
                      }}
                      className={`
                        relative h-28 sm:h-32 w-full rounded-[1.25rem] sm:rounded-[1.5rem] border-[3px] transition-all duration-300 group flex flex-col items-center justify-center p-2
                        ${isActive 
                          ? `${phaseTheme.activeBg} ${phaseTheme.border} shadow-sm ring-4 ${phaseTheme.activeRing} scale-105 z-10` 
                          : `bg-white border-slate-100 ${phaseTheme.hover} shadow-sm`}
                        ${isItemLocked ? 'opacity-60 grayscale' : ''}
                      `}
                    >
                      {/* Icon / Status */}
                      <div className={`mb-1 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1 ${isCompleted ? 'text-[#8bc34a]' : (isActive ? phaseTheme.text : 'text-slate-300')}`}>
                         {isItemLocked ? (
                            <Lock size={24} className="text-slate-300" />
                         ) : isCompleted ? (
                            <div className="relative">
                               <CheckCircle2 size={28} strokeWidth={2.5} />
                               <div className="absolute -bottom-1 -right-2 bg-[#ffa600] text-white text-[8px] font-black px-1.5 py-0.5 rounded-full rotate-12 border-2 border-white shadow-sm">
                                  MAX
                               </div>
                            </div>
                         ) : isActive ? (
                            <CircleDashed size={28} strokeWidth={2.5} className="animate-spin-slow" />
                         ) : (
                            <div className={`w-7 h-7 rounded-full border-2 ${isActive ? phaseTheme.border : 'border-slate-200'} flex items-center justify-center`}>
                               <span className={`text-[11px] font-bold ${isActive ? phaseTheme.text : 'text-slate-300'}`}>?</span>
                            </div>
                         )}
                      </div>

                      {/* Title */}
                      <div className="w-full text-center px-0.5 mt-1">
                         <h4 className={`text-[10px] sm:text-xs font-bold leading-[1.15] sm:leading-tight line-clamp-3 ${isActive ? phaseTheme.text : 'text-slate-500 group-hover:text-slate-700'}`}>
                            {isChinese 
                              ? (bp.title.zh.split(/[:：]/)[1] || bp.title.zh).trim() 
                              : (bp.title.en.split(/[:：]/)[1] || bp.title.en).trim()}
                         </h4>
                      </div>

                      {/* Subtle Progress Dot */}
                      {!isCompleted && !isItemLocked && percent > 0 && (
                         <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#8bc34a] shadow-sm" />
                         </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
      
      {/* End of Line */}
      <div className="flex flex-col items-center justify-center pt-8 opacity-40">
         <div className="w-1 h-12 bg-gradient-to-b from-slate-300 to-transparent rounded-full mb-4" />
         <ChevronDown size={24} className="text-slate-400" />
         <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.3em] mt-2">More Sectors Coming Soon</p>
      </div>
    </div>
  );
};

export default BlueprintMap;
