
import React, { useState, useMemo, useEffect } from 'react';
import { Word } from '../types';
import { 
  X, Check, Sprout, Leaf, ArrowRight, PartyPopper, 
  PackagePlus, Link, Clock, Compass, Zap, HelpCircle, 
  TreePalm, Sparkles, Wand2, Scroll, Key, MapPin
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playClick, playSparkle, playSwish } from '../utils/sfx';

interface ExpansionModalProps {
  availableWords: Word[];
  onClose: () => void;
  onAddWords: (selectedWords: Word[]) => void;
  onStudyNow: (selectedWords: Word[]) => void;
}

// SSI Tech / Magic Item Rebranding
const CATEGORIES = [
  { id: 'all', label: 'All Items', icon: PackagePlus, color: 'text-gray-500', bg: 'bg-gray-100' },
  { id: 'island', label: 'Island Loot', icon: TreePalm, color: 'text-[#8bc34a]', bg: 'bg-[#f1f8e9]' },
  { id: 'connector', label: 'Yarn Ball', icon: Scroll, color: 'text-[#ab47bc]', bg: 'bg-[#f3e5f5]' }, // Logic/Glue
  { id: 'time', label: 'Magic Clock', icon: Clock, color: 'text-[#ffa726]', bg: 'bg-[#fff3e0]' }, // Time
  { id: 'preposition', label: 'Sticky Notes', icon: MapPin, color: 'text-[#29b6f6]', bg: 'bg-[#e1f5fe]' }, // Navigators
  { id: 'quantity', label: 'Flavor Pot', icon: Sparkles, color: 'text-[#ff7043]', bg: 'bg-[#fbe9e7]' }, // Quantifiers
  { id: 'interrogative', label: 'Mystery Keys', icon: Key, color: 'text-[#ef5350]', bg: 'bg-[#ffebee]' }, // Questions
];

const ExpansionModal: React.FC<ExpansionModalProps> = ({ availableWords, onClose, onAddWords, onStudyNow }) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [plantedWords, setPlantedWords] = useState<Word[] | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const MAX_SELECTION = 10;

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    CATEGORIES.forEach(cat => counts[cat.id] = 0);
    counts['all'] = availableWords.length;
    
    availableWords.forEach(w => {
      const cat = w.category || 'island';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [availableWords]);

  const filteredWords = useMemo(() => {
    if (activeCategory === 'all') return availableWords;
    return availableWords.filter(w => (w.category || 'island') === activeCategory);
  }, [availableWords, activeCategory]);

  const handleToggle = (wordId: string) => {
    playClick();
    const newSelected = new Set(selected);
    if (newSelected.has(wordId)) {
      newSelected.delete(wordId);
    } else {
      if (newSelected.size < MAX_SELECTION) {
        newSelected.add(wordId);
      }
    }
    setSelected(newSelected);
  };

  const handleMagicFill = () => {
    playSparkle();
    const needed = MAX_SELECTION - selected.size;
    if (needed <= 0) return;

    // Filter out already selected
    const pool = filteredWords.filter(w => !selected.has(w.id));
    // Shuffle and pick
    const randomPicks = pool.sort(() => 0.5 - Math.random()).slice(0, needed);
    
    const newSelected = new Set(selected);
    randomPicks.forEach(w => newSelected.add(w.id));
    setSelected(newSelected);
  };

  const handleConfirm = () => {
    const selectedWords = availableWords.filter(w => selected.has(w.id));
    onAddWords(selectedWords);
    setPlantedWords(selectedWords);
    
    // Confetti burst
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8bc34a', '#ffa600', '#ffffff']
    });
  };

  if (plantedWords) {
    return (
      <div className="fixed inset-0 h-[100dvh] z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn supports-[height:100dvh]:h-[100dvh]">
        <div className="relative w-full max-w-sm bg-[#f7f9e4] rounded-[3.5rem] border-[8px] border-white shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col items-center p-8 text-center animate-zoomIn">
           
           <div className="bg-[#8bc34a] p-6 rounded-[2.5rem] shadow-[0_10px_0_#5a9a3b] border-4 border-white mb-6 animate-bounce">
              <PartyPopper size={48} className="text-white fill-current" />
           </div>

           <h2 className="text-3xl font-black text-[#4b7d78] mb-2 leading-tight">Crate Unlocked!</h2>
           <p className="text-[#8d99ae] font-bold mb-8 text-sm">
             You've added <strong className="text-[#ffa600]">{plantedWords.length} magic items</strong> to your inventory.
           </p>

           <div className="w-full space-y-3">
             <button 
               onClick={() => onStudyNow(plantedWords)}
               className="w-full bg-[#ffa600] text-white py-4 rounded-[2rem] font-black text-lg shadow-[0_8px_0_#e65100] border-4 border-white bubble-button flex items-center justify-center gap-2 hover:bg-[#ffb74d]"
             >
               Use Items Now <ArrowRight size={20} />
             </button>

             <button 
               onClick={onClose}
               className="w-full bg-transparent text-[#8d99ae] py-4 rounded-[2rem] font-black text-sm hover:bg-[#e0e0e0]/20 transition-colors"
             >
               Stash for Later
             </button>
           </div>
        </div>
      </div>
    );
  }

  return (
    // FIX: Using fixed inset-0 and h-[100dvh] ensures the modal fits the mobile viewport perfectly
    // even with address bars.
    <div className="fixed inset-0 h-[100dvh] z-[100] flex flex-col md:items-center md:justify-center md:p-4 bg-black/40 backdrop-blur-sm animate-fadeIn supports-[height:100dvh]:h-[100dvh]">
      {/* 
         Mobile: h-full (fills container), rounded-none, border-0.
         Desktop: h-[90vh], rounded-[4rem], border-[8px].
      */}
      <div className="relative w-full bg-[#f7f9e4] shadow-2xl overflow-hidden flex flex-col 
        h-full rounded-none border-0
        md:h-[90vh] md:max-w-4xl md:rounded-[4rem] md:border-[8px] md:border-white md:shadow-[0_20px_50px_rgba(0,0,0,0.2)]
      ">
        
        {/* Header Section */}
        <div className="shrink-0 border-b-4 border-[#e0d9b4] bg-white relative z-20 pt-[env(safe-area-inset-top,20px)] md:pt-0">
          <div className="flex items-center justify-between p-4 md:p-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-[#4b7d78] tracking-tight">SSI Supply Crate</h2>
              <p className="text-sm font-bold text-[#8d99ae]">Select up to <span className="text-[#ffa600]">{MAX_SELECTION - selected.size}</span> items</p>
            </div>
            <button onClick={onClose} className="p-3 bg-[#f7f9e4] rounded-2xl shadow-sm hover:bg-[#e0e0e0] transition-all active:scale-90 text-[#4b7d78]">
              <X size={24} strokeWidth={3} />
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex overflow-x-auto no-scrollbar gap-2 px-4 md:px-8 pb-4">
            {CATEGORIES.map(cat => {
              const isActive = activeCategory === cat.id;
              const count = categoryCounts[cat.id] || 0;
              const Icon = cat.icon;
              
              if (count === 0 && cat.id !== 'all') return null; // Hide empty categories

              return (
                <button
                  key={cat.id}
                  onClick={() => { playSwish(); setActiveCategory(cat.id); }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 font-black text-xs uppercase tracking-wider transition-all whitespace-nowrap active:scale-95 ${
                    isActive 
                    ? `bg-[#4b7d78] text-white border-[#4b7d78] shadow-md` 
                    : `bg-white text-[#8d99ae] border-[#f0f0f0] hover:border-[#b0bec5]`
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-white' : cat.color} />
                  {cat.label}
                  <span className={`px-1.5 py-0.5 rounded-md text-[9px] ${isActive ? 'bg-black/20' : cat.bg + ' ' + cat.color}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Word Grid - flex-1 ensures it takes all remaining space */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 md:p-8 bg-[#f9fbe7] relative">
          
          {/* Magic Fill Floater */}
          <div className="absolute top-4 right-4 md:right-6 z-10">
             <button 
                onClick={handleMagicFill}
                disabled={selected.size >= MAX_SELECTION || filteredWords.length === 0}
                className="bg-[#ffa600] text-white px-4 py-2 rounded-xl shadow-md border-2 border-white font-black text-xs flex flex-col items-center hover:bg-[#ffb74d] active:scale-90 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
             >
               <div className="flex items-center gap-2">
                 <Wand2 size={16} /> <span>Magic Fill</span>
               </div>
               <span className="text-[9px] opacity-80 uppercase tracking-wide mt-0.5">Lucky Draw</span>
             </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 mt-12 md:mt-0 pb-24 md:pb-12">
            {filteredWords.map((word, idx) => {
              const isSelected = selected.has(word.id);
              const isFull = selected.size >= MAX_SELECTION && !isSelected;
              const isMisc = word.type === 'misc';
              
              const catLabel = word.category === 'connector' ? 'YARN' :
                               word.category === 'time' ? 'CLOCK' :
                               word.category === 'preposition' ? 'STICKY' :
                               word.category === 'quantity' ? 'SPICE' :
                               word.category === 'interrogative' ? 'KEY' :
                               'LOOT';

              return (
                <button
                  key={word.id}
                  onClick={() => handleToggle(word.id)}
                  disabled={isFull}
                  className={`relative p-4 rounded-[2rem] border-[3px] text-left transition-all group active:scale-95 ${
                    isSelected
                      ? 'bg-[#e8f5e9] border-[#8bc34a] shadow-none ring-2 ring-[#8bc34a] ring-offset-2'
                      : isMisc 
                        ? 'bg-[#f3e5f5] border-[#ce93d8] hover:border-[#ab47bc] shadow-[0_4px_0_#e1bee7]' 
                        : 'bg-white border-[#f0f0f0] hover:border-[#c5e1a5] shadow-[0_4px_0_#e0e0e0]'
                  } ${isFull ? 'opacity-40 grayscale cursor-not-allowed' : ''}`}
                >
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 bg-[#8bc34a] text-white p-1 rounded-full border-2 border-white shadow-sm z-10">
                      <Check size={12} strokeWidth={4} />
                    </div>
                  )}
                  
                  {/* Type Label */}
                  <div className={`absolute top-3 right-3 text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${isMisc ? 'bg-[#e1bee7] text-[#8e24aa]' : 'bg-[#f1f8e9] text-[#558b2f]'}`}>
                    {catLabel}
                  </div>

                  <div className="flex flex-col h-full justify-between">
                    <div>
                       <h4 className={`font-black text-lg md:text-xl mb-0.5 ${isMisc ? 'text-[#6a1b9a]' : 'text-[#4b7d78]'}`}>{word.s}</h4>
                       <p className="text-xs font-bold text-[#8d99ae] leading-tight">{word.t}</p>
                    </div>
                    
                    {/* Golden Rule Preview for Misc words */}
                    {isMisc && (
                      <div className="mt-3 pt-2 border-t border-[#e1bee7] flex items-start gap-1">
                        <Sparkles size={10} className="text-[#ab47bc] shrink-0 mt-0.5" />
                        <p className="text-[9px] text-[#7b1fa2] font-bold line-clamp-2 leading-tight opacity-80">
                          {word.grammarTip}
                        </p>
                      </div>
                    )}
                    
                    {!isMisc && (
                       <div className="mt-3">
                         <Sprout size={14} className={isSelected ? 'text-[#8bc34a]' : 'text-[#dcedc8]'} />
                       </div>
                    )}
                  </div>
                </button>
              );
            })}
            
            {filteredWords.length === 0 && (
              <div className="col-span-full text-center py-20 opacity-50">
                 <p className="font-black text-[#8d99ae] uppercase tracking-widest">No items found in this section.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer with Safe Area */}
        <div className="p-4 md:p-6 shrink-0 border-t-4 border-[#e0d9b4] bg-[#f9f5da] relative z-30 pb-[env(safe-area-inset-bottom,20px)]">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            <div className="flex flex-col">
               <span className="text-[10px] font-black text-[#8d99ae] uppercase tracking-widest">Cart</span>
               <div className="text-2xl font-black text-[#4b7d78] leading-none">
                 <span className={selected.size > 0 ? 'text-[#8bc34a]' : ''}>{selected.size}</span>
                 <span className="text-lg opacity-40 mx-1">/</span>
                 <span className="text-lg opacity-60">{MAX_SELECTION}</span>
               </div>
            </div>
            
            <button
              onClick={handleConfirm}
              disabled={selected.size === 0}
              className="px-6 py-4 rounded-[2rem] font-black text-lg text-white bg-[#88d068] shadow-[0_6px_0_#5a9a3b] flex items-center gap-2 bubble-button disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed hover:bg-[#7cb342] active:translate-y-1"
            >
              <Leaf size={20} className="fill-current" /> 
              <span>Get Supplies</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpansionModal;
