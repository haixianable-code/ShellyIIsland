
import React, { useState, useMemo } from 'react';
import { Word, ProgressMap } from '../types';
import { X, Flower2, Calendar, Sprout, Zap, Filter, CheckCircle2 } from 'lucide-react';

interface DailyHarvestModalProps {
  words: Word[];
  progress: ProgressMap;
  onClose: () => void;
  onWordClick: (word: Word) => void;
  onStartBlitz: () => void; // New action for ambitious users
}

const DailyHarvestModal: React.FC<DailyHarvestModalProps> = ({ words, progress, onClose, onWordClick, onStartBlitz }) => {
  const [filter, setFilter] = useState<'all' | 'new' | 'review'>('all');

  const { newCount, reviewCount, displayWords } = useMemo(() => {
    // Heuristic: Level <= 3 is likely a "New Seed" planted today. Level > 3 is likely a "Review" maintained today.
    const newSeeds = words.filter(w => (progress[w.id]?.level || 0) <= 3);
    const reviewSeeds = words.filter(w => (progress[w.id]?.level || 0) > 3);

    let display = words;
    if (filter === 'new') display = newSeeds;
    if (filter === 'review') display = reviewSeeds;

    return {
      newCount: newSeeds.length,
      reviewCount: reviewSeeds.length,
      displayWords: display
    };
  }, [words, progress, filter]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#f7f9e4] rounded-[3.5rem] border-[8px] border-white shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col h-[85vh] animate-zoomIn">
        
        {/* Header */}
        <div className="p-6 md:p-8 shrink-0 border-b-4 border-[#e0d9b4] flex items-center justify-between bg-white/50 relative z-10">
          <div className="flex items-center gap-4">
            <div className="bg-[#8bc34a] p-3 rounded-2xl shadow-sm border-2 border-white animate-bounce-slight">
              <Flower2 className="text-white" size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-[#4b7d78] tracking-tight">Today's Harvest</h2>
              <div className="flex items-center gap-1.5 text-sm font-bold text-[#8d99ae] mt-1">
                 <Calendar size={14} />
                 <span>{words.length} items cultivated</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-white rounded-2xl shadow-md hover:bg-[#f1f8e9] transition-all active:scale-90 text-[#4b7d78]">
            <X size={24} strokeWidth={3} />
          </button>
        </div>

        {/* Filter Tabs */}
        {words.length > 0 && (
          <div className="px-6 md:px-8 py-4 flex gap-2 overflow-x-auto no-scrollbar bg-[#f7f9e4]">
            {[
              { id: 'all', label: 'All Crops', count: words.length },
              { id: 'new', label: 'New Seeds', count: newCount },
              { id: 'review', label: 'Maintained', count: reviewCount }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`px-4 py-2 rounded-xl border-2 font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all whitespace-nowrap ${
                  filter === tab.id 
                  ? 'bg-[#4b7d78] border-[#4b7d78] text-white shadow-md' 
                  : 'bg-white border-[#e0e0e0] text-[#8d99ae] hover:border-[#b0bec5]'
                }`}
              >
                {tab.id === 'all' && <Filter size={12} />}
                {tab.id === 'new' && <Sprout size={12} />}
                {tab.id === 'review' && <CheckCircle2 size={12} />}
                {tab.label} <span className="bg-black/10 px-1.5 py-0.5 rounded-md text-[9px]">{tab.count}</span>
              </button>
            ))}
          </div>
        )}

        {/* List */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 bg-[#f7f9e4] pt-0">
           {displayWords.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full opacity-50 py-12">
                <Sprout size={48} className="text-[#8bc34a] mb-2" />
                <p className="font-black text-[#4b7d78]">No crops found in this category.</p>
              </div>
           ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
               {displayWords.map((word, index) => (
                 <button 
                    key={word.id} 
                    onClick={() => onWordClick(word)}
                    className="bg-white p-4 rounded-[2rem] border-4 border-[#f0f0f0] flex items-center justify-between group hover:border-[#8bc34a] transition-all shadow-sm active:scale-95 animate-fadeIn"
                    style={{ animationDelay: `${index * 0.05}s` }}
                 >
                    <div className="flex flex-col text-left">
                      <span className="font-black text-[#2e4d4a] text-lg group-hover:text-[#4b7d78] transition-colors">{word.s}</span>
                      <span className="font-bold text-[#8d99ae] text-xs uppercase tracking-wide">{word.t}</span>
                    </div>
                    <div className={`w-3 h-3 rounded-full border-2 border-white shadow-sm ${word.type === 'verb' ? 'bg-[#ff7043]' : word.type === 'adj' ? 'bg-[#fbc02d]' : word.type === 'misc' ? 'bg-[#ab47bc]' : 'bg-[#2196f3]'}`} />
                 </button>
               ))}
             </div>
           )}
        </div>

        {/* Footer: Blitz Action for Ambitious Users */}
        {words.length > 0 && (
          <div className="p-6 md:p-8 shrink-0 bg-white border-t-4 border-[#e0d9b4] relative z-20">
             <div className="flex flex-col gap-3">
               <div className="flex items-center justify-between px-2">
                 <p className="text-[10px] font-black text-[#8d99ae] uppercase tracking-widest">Ambitious Gardener?</p>
                 <p className="text-[10px] font-bold text-[#8d99ae]">No SRS Impact</p>
               </div>
               <button 
                 onClick={onStartBlitz}
                 className="w-full bg-[#9c27b0] text-white py-4 rounded-[2.5rem] font-black text-lg shadow-[0_8px_0_#7b1fa2] border-4 border-[#e1bee7] bubble-button flex items-center justify-center gap-3 hover:bg-[#ab47bc] transition-all group"
               >
                 <Zap size={24} className="fill-current text-[#e1bee7] group-hover:scale-110 transition-transform" />
                 <span>Speed Blitz Review</span>
               </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyHarvestModal;