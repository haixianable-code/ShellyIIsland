
import React, { useState, useMemo } from 'react';
import { Word, ProgressMap } from '../types';
import { X, Flower2, Calendar, Sprout, Zap, Filter, CheckCircle2, Volume2, TreeDeciduous } from 'lucide-react';
import { playAudio } from '../utils/audio';
import { playClick } from '../utils/sfx';
import { useTranslation } from 'react-i18next';

interface DailyHarvestModalProps {
  words: Word[];
  progress: ProgressMap;
  onClose: () => void;
  onWordClick: (word: Word) => void;
  onStartBlitz: () => void;
}

const DailyHarvestModal: React.FC<DailyHarvestModalProps> = ({ words, progress, onClose, onWordClick, onStartBlitz }) => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<'all' | 'new' | 'review'>('all');

  const { newCount, reviewCount, displayWords } = useMemo(() => {
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

  const handlePlayAudio = (e: React.MouseEvent, word: string) => {
    e.stopPropagation();
    playAudio(word);
    try { playClick(); } catch (err) {}
  };

  const getTypeColor = (type: string) => {
    if (type === 'verb') return 'bg-[#ff7043] border-[#ff7043]';
    if (type === 'noun') return 'bg-[#8bc34a] border-[#8bc34a]';
    if (type === 'adj') return 'bg-[#29b6f6] border-[#29b6f6]';
    return 'bg-[#ab47bc] border-[#ab47bc]';
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#f7f9e4] rounded-[3rem] md:rounded-[3.5rem] border-[8px] border-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col h-[85vh] animate-zoomIn">
        
        {/* Header */}
        <div className="p-6 shrink-0 border-b-4 border-[#e0d9b4] flex items-center justify-between bg-white/60 relative z-10 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="bg-[#8bc34a] p-3 rounded-2xl shadow-sm border-2 border-white animate-bounce-slight">
              <TreeDeciduous className="text-white" size={28} />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-[#4b7d78] tracking-tight leading-none">{t('ui.study.today_harvest')}</h2>
              <div className="flex items-center gap-1.5 text-xs md:text-sm font-bold text-[#8d99ae] mt-1.5">
                 <Calendar size={14} />
                 <span>{words.length} crops collected today</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-white rounded-2xl shadow-md hover:bg-[#f1f8e9] transition-all active:scale-90 text-[#4b7d78]">
            <X size={24} strokeWidth={3} />
          </button>
        </div>

        {/* Filter Tabs */}
        {words.length > 0 && (
          <div className="px-6 pt-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar bg-[#f7f9e4] shrink-0">
            {[
              { id: 'all', label: 'All Crops', count: words.length },
              { id: 'new', label: 'New', count: newCount },
              { id: 'review', label: 'Review', count: reviewCount }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl border-2 font-black text-[10px] uppercase tracking-wider flex items-center gap-2 transition-all whitespace-nowrap active:scale-95 ${
                  filter === tab.id 
                  ? 'bg-[#4b7d78] border-[#4b7d78] text-white shadow-md' 
                  : 'bg-white border-[#e0e0e0] text-[#8d99ae] hover:border-[#b0bec5]'
                }`}
              >
                {tab.id === 'all' && <Filter size={10} />}
                {tab.id === 'new' && <Sprout size={10} />}
                {tab.id === 'review' && <CheckCircle2 size={10} />}
                {tab.label} <span className={`px-1.5 py-0.5 rounded-md text-[9px] ${filter === tab.id ? 'bg-black/20' : 'bg-slate-100'}`}>{tab.count}</span>
              </button>
            ))}
          </div>
        )}

        {/* Dense Grid List */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 bg-[#f7f9e4] pt-2">
           {displayWords.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full opacity-50 py-12">
                <Sprout size={48} className="text-[#8bc34a] mb-2" />
                <p className="font-black text-[#4b7d78]">No crops found.</p>
              </div>
           ) : (
             <div className="flex flex-wrap content-start gap-2 pb-12">
               {displayWords.map((word, index) => {
                 const colorClass = getTypeColor(word.type);
                 return (
                   <button
                      key={word.id} 
                      onClick={() => onWordClick(word)}
                      className={`group relative flex items-center gap-2 pl-3 pr-2 py-2 bg-white border-2 border-[#f0f0f0] rounded-xl shadow-sm hover:border-[#8bc34a] hover:shadow-md active:scale-95 transition-all animate-fadeIn`}
                      style={{ animationDelay: `${Math.min(index * 0.03, 0.5)}s` }}
                   >
                      {/* Indicator Dot */}
                      <div className={`w-2 h-2 rounded-full ${colorClass.split(' ')[0]}`} />
                      
                      <div className="text-left flex flex-col">
                        <span className="font-black text-[#2e4d4a] text-sm leading-none">{word.s}</span>
                        <span className="text-[9px] font-bold text-[#8d99ae] leading-none mt-0.5 truncate max-w-[80px]">
                           {t(`vocab.${word.id}.t`, { defaultValue: word.t })}
                        </span>
                      </div>

                      {/* Mini Play Button */}
                      <div
                         onClick={(e) => handlePlayAudio(e, word.s)}
                         className="ml-1 p-1.5 rounded-lg bg-slate-50 text-slate-300 hover:bg-[#8bc34a] hover:text-white transition-colors"
                       >
                         <Volume2 size={12} />
                       </div>
                   </button>
                 );
               })}
             </div>
           )}
        </div>

        {/* Footer: Blitz Action */}
        {words.length > 0 && (
          <div className="p-4 md:p-6 shrink-0 bg-white border-t-4 border-[#e0d9b4] relative z-20 pb-[env(safe-area-inset-bottom,20px)]">
             <div className="flex items-center gap-4">
               <div className="hidden md:block">
                 <p className="text-[10px] font-black text-[#8d99ae] uppercase tracking-widest">Extra Credit</p>
                 <p className="text-[10px] font-bold text-[#8d99ae]">No SRS Impact</p>
               </div>
               <button 
                 onClick={onStartBlitz}
                 className="flex-1 bg-[#9c27b0] text-white py-3 md:py-4 rounded-[2rem] font-black text-base md:text-lg shadow-[0_6px_0_#7b1fa2] border-4 border-[#e1bee7] bubble-button flex items-center justify-center gap-2 hover:bg-[#ab47bc] transition-all group"
               >
                 <Zap size={20} className="fill-current text-[#e1bee7] group-hover:scale-110 transition-transform" />
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
