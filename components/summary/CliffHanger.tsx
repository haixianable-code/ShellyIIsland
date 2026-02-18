
import React from 'react';
import { ShieldAlert, TrendingDown, Lock, ArrowRight } from 'lucide-react';
import { useIslandStore } from '../../store/useIslandStore';
import { playClick } from '../../utils/sfx';

const CliffHanger: React.FC = () => {
  const { openModal } = useIslandStore();

  const handleUpgrade = () => {
    playClick();
    openModal('SUBSCRIPTION');
  };

  const handleIgnore = () => {
    playClick();
    window.location.href = '/';
  };

  return (
    <div className="relative w-full max-w-sm bg-[#fff5f5] rounded-[3rem] p-8 border-[8px] border-[#ffcdd2] shadow-xl text-center flex flex-col items-center animate-zoomIn">
       <div className="bg-[#ff5252] p-6 rounded-full mb-6 border-4 border-white shadow-lg animate-pulse-slow">
          <ShieldAlert size={48} className="text-white" />
       </div>

       <h2 className="text-2xl font-black text-[#c62828] uppercase tracking-tight mb-2">Shield Collapsed</h2>
       <p className="text-[#e57373] font-bold text-sm mb-8 leading-relaxed">
          Your trial equipment has expired. Learning efficiency will drop by 40%.
       </p>

       <div className="w-full bg-white rounded-2xl p-4 mb-8 border-2 border-[#ffcdd2]">
          <div className="flex items-center justify-between mb-2 opacity-50">
             <span className="text-xs font-bold text-slate-400">Standard</span>
             <TrendingDown size={16} className="text-slate-400" />
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
             <div className="h-full bg-slate-300 w-[60%]" />
          </div>
          <p className="text-[10px] font-black uppercase text-slate-400 mt-2 tracking-widest text-left">Limited Retention</p>
       </div>

       <button 
         onClick={handleUpgrade}
         className="w-full bg-[#ff5252] text-white py-4 rounded-[2rem] font-black text-lg shadow-[0_6px_0_#d32f2f] bubble-button flex items-center justify-center gap-2 mb-4"
       >
         Restore Shield <Lock size={18} />
       </button>

       <button onClick={handleIgnore} className="text-xs font-bold text-[#e57373] hover:text-[#c62828] uppercase tracking-widest">
          Accept Slower Progress
       </button>
    </div>
  );
};

export default CliffHanger;
