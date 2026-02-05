
import React, { useState } from 'react';
import { Word, ProgressMap } from '../types';
import { Search, ShoppingBag, Coffee, CircleDot, Sprout, Flower2, TreeDeciduous } from 'lucide-react';
import WordExpansionPack from './WordExpansionPack';
import ExpansionModal from './ExpansionModal';
import { EXTRA_CANDIDATES } from '../constants';
import { playClick } from '../utils/sfx';

interface VocabularyViewProps {
  words: Word[];
  progress: ProgressMap;
  onWordClick: (word: Word) => void;
  onAddExtraWords: (words: Word[]) => void;
  onStartExtraStudy: (words: Word[]) => void;
}

const VocabularyView: React.FC<VocabularyViewProps> = ({ words, progress, onWordClick, onAddExtraWords, onStartExtraStudy }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredWords = words.filter(w => 
    w.s.toLowerCase().includes(searchTerm.toLowerCase()) || 
    w.t.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unlearnedExtra = EXTRA_CANDIDATES.filter(w => !progress[w.id]);

  const handleAddWords = (selected: Word[]) => {
    onAddExtraWords(selected);
  };

  // Helper to determine the "Growth Stage" of a word
  const getGrowthIcon = (level: number) => {
    if (level <= 1) return { icon: CircleDot, color: 'text-[#8d99ae]', label: 'Seed' };
    if (level <= 3) return { icon: Sprout, color: 'text-[#8bc34a]', label: 'Sprout' };
    if (level <= 5) return { icon: Flower2, color: 'text-[#ffa600]', label: 'Bloom' };
    return { icon: TreeDeciduous, color: 'text-[#2e7d32]', label: 'Tree' };
  };

  return (
    <div className="space-y-10 animate-fadeIn pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-[#ffb74d] p-4 rounded-3xl shadow-[0_6px_0_#e67e22] border-4 border-white animate-bounce-slight">
            <ShoppingBag className="text-white fill-current" size={32} />
          </div>
          <h2 className="text-5xl font-black text-[#4b7d78] drop-shadow-sm">My Pocket</h2>
        </div>
      </div>

      <WordExpansionPack 
        availableCount={unlearnedExtra.length} 
        onExplore={() => { playClick(); setIsModalOpen(true); }}
      />
        
      <div className="relative group z-20">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-[#8bc34a] p-2 rounded-xl shadow-sm border-2 border-white z-10 transition-transform group-focus-within:scale-110">
          <Search className="text-white" size={20} strokeWidth={3} />
        </div>
        <input 
          type="text" 
          placeholder="Search your seeds..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-20 pr-8 py-5 bg-white border-4 border-[#e0d9b4] rounded-[3rem] w-full shadow-[0_6px_0_#e0d9b4] focus:outline-none focus:ring-8 focus:ring-[#8bc34a]/30 transition-all font-black text-[#4b7d78] placeholder:text-[#8d99ae]/50 text-lg"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredWords.map(word => {
          const stats = progress[word.id];
          const level = stats?.level || 0;
          const { icon: StageIcon, color, label } = getGrowthIcon(level);
          
          return (
            <button 
              key={word.id} 
              onClick={() => { playClick(); onWordClick(word); }}
              className="bg-white p-8 rounded-[3.5rem] border-4 border-[#f0f0f0] shadow-[0_10px_0_#e0e0e0] hover:shadow-[0_14px_0_#8bc34a] hover:border-[#8bc34a] transition-all flex items-center justify-between group cursor-pointer active:translate-y-2 active:shadow-none text-left relative overflow-hidden"
            >
              <div className="relative z-10 space-y-2">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full shadow-sm border border-white/50 ${word.type === 'verb' ? 'bg-[#ff7043]' : word.type === 'adj' ? 'bg-[#fbc02d]' : word.type === 'misc' ? 'bg-[#ab47bc]' : 'bg-[#2196f3]'}`}></div>
                  <h3 className="text-3xl font-black text-[#2e4d4a] group-hover:text-[#4b7d78] transition-colors tracking-tight">{word.s}</h3>
                </div>
                <p className="text-[#6d7c8e] font-bold text-lg tracking-tight pl-6 border-l-4 border-[#f0f0f0] group-hover:border-[#e0e0e0] transition-colors">{word.t}</p>
              </div>
              
              <div className="flex flex-col items-center gap-1 shrink-0 bg-[#f9fbe7] p-3 rounded-2xl border-2 border-[#f0f4c3] group-hover:bg-[#f1f8e9] group-hover:border-[#dcedc8] transition-colors">
                 <StageIcon size={32} className={`${color} fill-current transition-transform group-hover:scale-110`} />
                 <span className={`text-[9px] font-black uppercase tracking-widest ${color}`}>{label}</span>
                 
                 {/* Mini progress bar for level within stage (simplified) */}
                 <div className="flex gap-0.5 mt-1">
                   {[...Array(3)].map((_, i) => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < (level % 2 === 0 ? 1 : 2) ? color.replace('text-', 'bg-') : 'bg-gray-200'}`} />
                   ))}
                 </div>
              </div>
            </button>
          );
        })}
      </div>

      {filteredWords.length === 0 && (
        <div className="text-center py-24 bg-white/50 rounded-[5rem] border-8 border-dashed border-[#e0d9b4]">
          <div className="bg-[#fff9c4] w-32 h-32 rounded-[3rem] flex items-center justify-center mx-auto mb-8 text-[#fbc02d] border-4 border-[#fdd835] shadow-inner rotate-3">
            <Coffee size={64} className="fill-current" />
          </div>
          <p className="text-[#8d99ae] font-black uppercase tracking-[0.3em] text-lg">Pocket is empty!</p>
          <p className="text-[#8d99ae] font-bold mt-2 opacity-60">Try searching for something else?</p>
        </div>
      )}

      {isModalOpen && (
        <ExpansionModal
          availableWords={unlearnedExtra}
          onClose={() => setIsModalOpen(false)}
          onAddWords={handleAddWords}
          onStudyNow={onStartExtraStudy}
        />
      )}
    </div>
  );
};

export default VocabularyView;
