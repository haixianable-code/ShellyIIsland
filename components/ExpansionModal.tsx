
import React, { useState, useMemo } from 'react';
import { Word } from '../types';
import { 
  X, Check, Sprout, Leaf, ArrowRight, PartyPopper, 
  PackagePlus, Clock, TreePalm, Sparkles, Wand2, Scroll, Key, MapPin,
  ShoppingBag, Wrench
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playClick, playSparkle, playSwish } from '../utils/sfx';
import { useTranslation } from 'react-i18next';

interface ExpansionModalProps {
  availableWords: Word[];
  onClose: () => void;
  onAddWords: (selectedWords: Word[]) => void;
  onStudyNow: (selectedWords: Word[]) => void;
}

// Updated Categories for SSI Crate
const RAW_CATEGORIES = [
  { id: 'all', icon: PackagePlus, color: 'text-gray-500', bg: 'bg-gray-100' },
  { id: 'loot', icon: ShoppingBag, color: 'text-[#FFB300]', bg: 'bg-[#FFFDE7]' }, // Nouns
  { id: 'connector', icon: Scroll, color: 'text-[#ab47bc]', bg: 'bg-[#f3e5f5]' }, // Logic
  { id: 'preposition', icon: MapPin, color: 'text-[#ab47bc]', bg: 'bg-[#f3e5f5]' }, // Placement
  { id: 'interrogative', icon: Key, color: 'text-[#ab47bc]', bg: 'bg-[#f3e5f5]' }, // Keys
  { id: 'adverb', icon: Clock, color: 'text-[#ab47bc]', bg: 'bg-[#f3e5f5]' }, // Time/Manner
];

const ExpansionModal: React.FC<ExpansionModalProps> = ({ availableWords, onClose, onAddWords, onStudyNow }) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [plantedWords, setPlantedWords] = useState<Word[] | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const MAX_SELECTION = 10;

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    RAW_CATEGORIES.forEach(cat => counts[cat.id] = 0);
    counts['all'] = availableWords.length;
    availableWords.forEach(w => {
      const cat = w.category || 'loot';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [availableWords]);

  const visibleCategories = useMemo(() => {
    return RAW_CATEGORIES.filter(cat => {
      if (cat.id === 'all') return true;
      return (categoryCounts[cat.id] || 0) > 0;
    }).map(c => ({
      ...c,
      label: t(`ui.expansion.cats.${c.id}`, { defaultValue: c.id.toUpperCase() })
    }));
  }, [categoryCounts, t]);

  const filteredWords = useMemo(() => {
    if (activeCategory === 'all') return availableWords;
    return availableWords.filter(w => (w.category || 'loot') === activeCategory);
  }, [availableWords, activeCategory]);

  const handleToggle = (wordId: string) => {
    playClick();
    const newSelected = new Set(selected);
    if (newSelected.has(wordId)) newSelected.delete(wordId);
    else if (newSelected.size < MAX_SELECTION) newSelected.add(wordId);
    setSelected(newSelected);
  };

  const handleConfirm = () => {
    const selectedWords = availableWords.filter(w => selected.has(w.id));
    onAddWords(selectedWords);
    setPlantedWords(selectedWords);
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#FFB300', '#ab47bc', '#ffffff'] });
  };

  if (plantedWords) {
    return (
      <div className="fixed inset-0 h-[100dvh] z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
        <div className="relative w-full max-w-sm bg-[#f7f9e4] rounded-[3.5rem] border-[8px] border-white shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col items-center p-8 text-center animate-zoomIn">
           <div className="bg-[#FFB300] p-6 rounded-[2.5rem] shadow-[0_10px_0_#FFA000] border-4 border-white mb-6 animate-bounce">
              <ShoppingBag size={48} className="text-white fill-current" />
           </div>
           <h2 className="text-3xl font-black text-[#4b7d78] mb-2 leading-tight">{t('ui.dashboard.crate_unlocked')}</h2>
           <p className="text-[#8d99ae] font-bold mb-8 text-sm">
             You found <strong className="text-[#FFB300]">{plantedWords.length} new items</strong> for your island.
           </p>
           <button onClick={() => onStudyNow(plantedWords)} className="w-full bg-[#ffa600] text-white py-4 rounded-[2rem] font-black text-lg shadow-[0_8px_0_#e65100] border-4 border-white bubble-button flex items-center justify-center gap-2 hover:bg-[#ffb74d] mb-3"><ArrowRight size={20} /> Use Now</button>
           <button onClick={onClose} className="w-full bg-transparent text-[#8d99ae] py-4 rounded-[2rem] font-black text-sm hover:bg-[#e0e0e0]/20 transition-colors">Stash for Later</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 h-[100dvh] z-[100] flex flex-col md:items-center md:justify-center md:p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full bg-[#f7f9e4] shadow-2xl overflow-hidden flex flex-col h-full md:h-[90vh] md:max-w-4xl md:rounded-[4rem] md:border-[8px] md:border-white">
        <div className="shrink-0 border-b-4 border-[#e0d9b4] bg-white relative z-20">
          <div className="flex items-center justify-between p-6">
            <div>
              <h2 className="text-3xl font-black text-[#4b7d78]">SSI Supply Crate</h2>
              <p className="text-sm font-bold text-[#8d99ae]">Collect up to {MAX_SELECTION - selected.size} more items</p>
            </div>
            <button onClick={onClose} className="p-3 bg-[#f7f9e4] rounded-2xl text-[#4b7d78]"><X size={24} strokeWidth={3} /></button>
          </div>
          <div className="flex overflow-x-auto no-scrollbar gap-2 px-6 pb-4">
            {visibleCategories.map(cat => (
              <button key={cat.id} onClick={() => { playSwish(); setActiveCategory(cat.id); }} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 font-black text-xs uppercase transition-all whitespace-nowrap ${activeCategory === cat.id ? 'bg-[#4b7d78] text-white border-[#4b7d78]' : 'bg-white text-[#8d99ae] border-[#f0f0f0]'}`}>
                <cat.icon size={14} className={activeCategory === cat.id ? 'text-white' : cat.color} />
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-6 bg-[#f9fbe7]">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredWords.map((word) => {
              const isSelected = selected.has(word.id);
              const isLoot = word.type === 'noun' || word.category === 'loot';
              return (
                <button key={word.id} onClick={() => handleToggle(word.id)} className={`relative p-4 rounded-[2rem] border-[3px] text-left transition-all ${isSelected ? 'bg-[#e8f5e9] border-[#8bc34a] ring-2 ring-[#8bc34a]' : isLoot ? 'bg-white border-[#FFE082] shadow-[0_4px_0_#FFF9C4]' : 'bg-[#f3e5f5] border-[#ce93d8] shadow-[0_4px_0_#e1bee7]'}`}>
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <h4 className="font-black text-lg mb-0.5 text-[#4b7d78]">{word.s}</h4>
                      <p className="text-xs font-bold text-[#8d99ae]">{word.t}</p>
                    </div>
                    <div className="mt-3 opacity-60"><Sparkles size={12} className={isLoot ? 'text-[#FFB300]' : 'text-[#ab47bc]'} /></div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6 bg-[#f9f5da] border-t-4 border-[#e0d9b4]">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-black text-[#4b7d78]">{selected.size} / {MAX_SELECTION}</div>
            <button onClick={handleConfirm} disabled={selected.size === 0} className="px-8 py-4 rounded-[2rem] font-black text-white bg-[#8bc34a] shadow-[0_6px_0_#5a9a3b] bubble-button disabled:opacity-30">Get Supplies</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpansionModal;
