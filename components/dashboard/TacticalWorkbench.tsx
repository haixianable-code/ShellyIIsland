import React from 'react';
import { useTranslation } from 'react-i18next';
import { Play, RotateCcw, Zap, CheckCircle2, Lock, ArrowRight, BrainCircuit, Crown } from 'lucide-react';
import { useIslandStore } from '../../store/useIslandStore';
import { playClick } from '../../utils/sfx';

interface TacticalWorkbenchProps {
  reviewCount: number;
  newCount: number;
  onReview: () => void;
  onStudy: () => void;
  onExplore: () => void;
  streak: number;
}

const TacticalWorkbench: React.FC<TacticalWorkbenchProps> = ({
  reviewCount,
  newCount,
  onReview,
  onStudy,
  onExplore,
  streak
}) => {
  const { t } = useTranslation();
  const { progress, allWords, profile, openModal } = useIslandStore();
  const isPremium = profile?.is_premium;

  // Calculate Matrix Data
  const matrixData = React.useMemo(() => {
    // Create a 10x10 grid (or more) based on total words
    const totalSlots = 100; // Show first 100 words for now
    const slots = [];
    
    for (let i = 0; i < totalSlots; i++) {
      const word = allWords[i];
      if (!word) {
        slots.push({ status: 'locked' });
        continue;
      }
      
      const p = progress[word.id];
      if (!p) {
        slots.push({ status: 'locked' });
      } else if (p.nextReviewDate && new Date(p.nextReviewDate) <= new Date()) {
        slots.push({ status: 'review' });
      } else {
        slots.push({ status: 'mastered' });
      }
    }
    return slots;
  }, [progress, allWords]);

  const masteredCount = matrixData.filter(s => s.status === 'mastered').length;
  const reviewPendingCount = matrixData.filter(s => s.status === 'review').length;

  return (
    <div className="flex flex-col h-full max-w-md mx-auto px-6 py-8 relative">
      
      {/* 1. HEADER: Status Line */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isPremium ? 'bg-amber-400' : 'bg-emerald-400'} animate-pulse`} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            {isPremium ? 'CITIZEN' : 'VISITOR'} ID: {profile?.id?.slice(0,4) || 'GUEST'}
          </span>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-1.5">
              <Zap size={12} className="text-amber-500 fill-current" />
              <span className="text-xs font-black text-slate-700">{streak}</span>
           </div>
           <div className="flex items-center gap-1.5">
              <BrainCircuit size={12} className="text-indigo-500" />
              <span className="text-xs font-black text-slate-700">{masteredCount}</span>
           </div>
        </div>
      </div>

      {/* 2. CORE: Active Deck (The Stack) */}
      <div className="flex-1 flex flex-col items-center justify-center relative mb-12">
        
        {/* The Stack Visual */}
        <div className="relative w-64 h-80 group cursor-pointer perspective-1000" onClick={() => { playClick(); newCount > 0 ? onStudy() : onReview(); }}>
           {/* Card 3 (Bottom) */}
           <div className="absolute top-4 left-4 w-full h-full bg-white rounded-[2rem] border-2 border-slate-200 shadow-sm transform rotate-6 transition-transform group-hover:rotate-12 group-hover:translate-x-4" />
           {/* Card 2 (Middle) */}
           <div className="absolute top-2 left-2 w-full h-full bg-white rounded-[2rem] border-2 border-slate-200 shadow-sm transform rotate-3 transition-transform group-hover:rotate-6 group-hover:translate-x-2" />
           
           {/* Card 1 (Top - Active) */}
           <div className="absolute inset-0 bg-white rounded-[2rem] border-[3px] border-slate-900 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.2)] flex flex-col items-center justify-center p-6 text-center transform transition-transform group-hover:-translate-y-2 group-active:scale-95 overflow-hidden">
              
              {/* Card Content */}
              <div className="absolute top-0 left-0 w-full h-2 bg-slate-900" />
              
              {newCount > 0 ? (
                <>
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-6 text-emerald-600">
                    <Play size={24} fill="currentColor" />
                  </div>
                  <h2 className="text-3xl font-black text-slate-800 mb-2">START</h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {newCount} New Words Ready
                  </p>
                  <div className="mt-8 px-4 py-2 bg-slate-50 rounded-lg border border-slate-100">
                     <p className="text-[10px] font-mono text-slate-400">NEXT: {allWords.find(w => !progress[w.id])?.spanish || '???'}</p>
                  </div>
                </>
              ) : reviewCount > 0 ? (
                <>
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-6 text-amber-600">
                    <RotateCcw size={24} />
                  </div>
                  <h2 className="text-3xl font-black text-slate-800 mb-2">REVIEW</h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {reviewCount} Words Pending
                  </p>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-6 text-indigo-600">
                    <CheckCircle2 size={24} />
                  </div>
                  <h2 className="text-2xl font-black text-slate-800 mb-2">ALL CLEAR</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                    Great work, Agent.<br/>Return tomorrow.
                  </p>
                </>
              )}
           </div>
        </div>

        {/* Action Label */}
        <div className="mt-8 flex flex-col items-center animate-pulse-slow">
           <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Tap Deck to Execute</span>
           <div className="w-1 h-8 bg-gradient-to-b from-slate-200 to-transparent rounded-full" />
        </div>

      </div>

      {/* 3. PROGRESS: Skill Matrix (The Grid) */}
      <div className="mb-8">
         <div className="flex items-center justify-between mb-3">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Neural Network</h3>
            <span className="text-[9px] font-mono text-slate-400">{Math.round((masteredCount / 100) * 100)}% Synced</span>
         </div>
         <div className="grid grid-cols-10 gap-1.5">
            {matrixData.map((slot, i) => (
               <div 
                 key={i} 
                 className={`
                    aspect-square rounded-sm transition-all duration-500
                    ${slot.status === 'mastered' ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.4)]' : ''}
                    ${slot.status === 'review' ? 'bg-amber-400 animate-pulse' : ''}
                    ${slot.status === 'locked' ? 'bg-slate-100' : ''}
                 `}
               />
            ))}
         </div>
      </div>

      {/* 4. CONTROLS: Bento Grid */}
      <div className="grid grid-cols-3 gap-3 h-24">
         {/* Review Ops */}
         <button 
           onClick={() => { playClick(); onReview(); }}
           className="col-span-1 bg-white rounded-2xl border-2 border-slate-100 shadow-sm flex flex-col items-center justify-center hover:border-amber-200 active:scale-95 transition-all relative overflow-hidden"
         >
            {reviewCount > 0 && (
               <div className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full animate-ping" />
            )}
            <RotateCcw size={20} className={reviewCount > 0 ? "text-amber-500" : "text-slate-300"} />
            <span className="text-[9px] font-black uppercase mt-2 text-slate-600">Review</span>
         </button>

         {/* AI Lab */}
         <button 
           onClick={() => { playClick(); openModal('AI_CHAT'); }}
           className="col-span-1 bg-slate-900 rounded-2xl shadow-lg flex flex-col items-center justify-center active:scale-95 transition-all group"
         >
            <BrainCircuit size={20} className="text-white group-hover:text-indigo-400 transition-colors" />
            <span className="text-[9px] font-black uppercase mt-2 text-white">AI Lab</span>
         </button>

         {/* Profile / Premium */}
         <button 
           onClick={() => { playClick(); openModal('SUBSCRIPTION'); }}
           className={`col-span-1 rounded-2xl border-2 flex flex-col items-center justify-center active:scale-95 transition-all ${isPremium ? 'bg-amber-50 border-amber-100' : 'bg-white border-slate-100'}`}
         >
            {isPremium ? <Crown size={20} className="text-amber-500 fill-current" /> : <Lock size={20} className="text-slate-300" />}
            <span className={`text-[9px] font-black uppercase mt-2 ${isPremium ? 'text-amber-600' : 'text-slate-400'}`}>
               {isPremium ? 'Citizen' : 'Upgrade'}
            </span>
         </button>
      </div>

    </div>
  );
};

export default TacticalWorkbench;
