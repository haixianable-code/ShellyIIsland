
import React from 'react';
import { Blueprint, ProgressMap } from '../../types';
import { Lock, CheckCircle2, CircleDashed, ChevronDown } from 'lucide-react';
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

  const getPhaseTitle = (phase: number) => {
    const titles = [
      "Phase 0: Survival Protocol",
      "Phase 1: Social Expansion",
      "Phase 2: Logic & Reason",
      "Phase 3: Native Fluency"
    ];
    return titles[phase] || `Phase ${phase}`;
  };

  return (
    <div className="space-y-12 relative z-10 pb-12">
      {/* Connector Line Background */}
      <div className="absolute left-8 top-0 bottom-0 w-1 bg-slate-200 rounded-full -z-10 hidden md:block" />

      {Object.keys(phases).map((phaseStr) => {
        const phase = parseInt(phaseStr);
        const isPhaseLocked = !isPremium && phase > 0; // Simple locking logic for Phase 1+ if not premium
        
        return (
          <div key={phase} className="space-y-6">
            {/* Phase Header */}
            <div className="flex items-center gap-4">
               <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl border-4 shadow-sm z-10 ${isPhaseLocked ? 'bg-slate-100 border-slate-300 text-slate-400' : 'bg-white border-[#e0d9b4] text-[#4b7d78]'}`}>
                  {isPhaseLocked ? <Lock size={20} /> : phase}
               </div>
               <div>
                  <h3 className={`text-lg font-black uppercase tracking-tight ${isPhaseLocked ? 'text-slate-400' : 'text-[#4b7d78]'}`}>
                    {getPhaseTitle(phase)}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {phases[phase].length} Sectors
                  </p>
               </div>
            </div>

            {/* Grid of Blueprints */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-0 md:pl-20">
              {phases[phase].map((bp) => {
                const isActive = activeId === bp.id;
                const learnedCount = bp.wordIds.filter(id => !!progress[id]).length;
                const totalCount = bp.wordIds.length;
                const percent = Math.round((learnedCount / totalCount) * 100);
                const isCompleted = percent === 100;
                
                // Individual blueprint lock override (if specific BP is premium)
                const isItemLocked = isPhaseLocked || (bp.isPremium && !isPremium);

                return (
                  <button
                    key={bp.id}
                    onClick={() => {
                        playClick();
                        if (isItemLocked) onLockClick();
                        else onSelect(bp);
                    }}
                    className={`
                      relative text-left p-6 rounded-[2.5rem] border-4 transition-all duration-300 group
                      ${isActive 
                        ? 'bg-white border-[#4b7d78] shadow-lg ring-4 ring-[#4b7d78]/10' 
                        : 'bg-white border-transparent hover:border-[#e0d9b4] shadow-sm'}
                      ${isItemLocked ? 'opacity-70 grayscale' : ''}
                    `}
                  >
                    <div className="flex justify-between items-start mb-4">
                       <div className={`p-3 rounded-2xl ${isCompleted ? 'bg-[#8bc34a] text-white' : (isActive ? 'bg-[#4b7d78] text-white' : 'bg-slate-50 text-slate-400')}`}>
                          {isCompleted ? <CheckCircle2 size={20} /> : <CircleDashed size={20} className={isActive ? 'animate-spin-slow' : ''} />}
                       </div>
                       {isItemLocked && <Lock size={16} className="text-[#ffa600]" />}
                    </div>

                    <div className="space-y-1">
                       <h4 className={`font-black text-lg uppercase leading-none tracking-tight ${isActive ? 'text-[#4b7d78]' : 'text-slate-600'}`}>
                          {isChinese ? bp.title.zh.split(':')[1] || bp.title.zh : bp.title.en.split(':')[1] || bp.title.en}
                       </h4>
                       <p className="text-[10px] font-bold text-slate-400 line-clamp-2 leading-relaxed">
                          {isChinese ? bp.description.zh : bp.description.en}
                       </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-5 relative h-2 bg-slate-100 rounded-full overflow-hidden">
                       <div 
                          className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ${isCompleted ? 'bg-[#8bc34a]' : 'bg-[#4b7d78]'}`}
                          style={{ width: `${percent}%` }}
                       />
                    </div>
                    <div className="mt-1 flex justify-between text-[8px] font-black uppercase text-slate-300 tracking-widest">
                       <span>{percent}% Cleared</span>
                       <span>{learnedCount}/{totalCount}</span>
                    </div>
                  </button>
                );
              })}
            </div>
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
