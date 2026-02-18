
import React from 'react';
import { Zap, Clock } from 'lucide-react';

interface TrialCountdownProps {
  endsAt: number;
}

const TrialCountdown: React.FC<TrialCountdownProps> = ({ endsAt }) => {
  const timeLeft = Math.max(0, endsAt - Date.now());
  const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  return (
    <div className="w-full max-w-lg bg-gradient-to-r from-slate-900 to-slate-800 p-1 rounded-2xl shadow-lg mb-6 animate-slideDown">
      <div className="bg-slate-900 rounded-xl p-3 flex items-center justify-between border border-slate-700/50">
         <div className="flex items-center gap-3">
            <div className="bg-[#ffd740] p-2 rounded-lg text-slate-900 animate-pulse">
               <Zap size={18} fill="currentColor" />
            </div>
            <div>
               <p className="text-[#ffd740] text-[10px] font-black uppercase tracking-[0.2em] leading-none">Premium Active</p>
               <p className="text-white text-xs font-bold mt-0.5">2.5x Learning Speed</p>
            </div>
         </div>
         <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
            <Clock size={14} className="text-slate-400" />
            <span className="text-white text-xs font-mono font-bold">
               {daysLeft}d {hoursLeft}h
            </span>
         </div>
      </div>
    </div>
  );
};

export default TrialCountdown;
