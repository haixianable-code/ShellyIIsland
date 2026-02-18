
import React, { useState, useMemo, useEffect } from 'react';
import { Word } from '../types';
import { 
  X, Check, ArrowRight, PackagePlus, Clock, Scroll, Key, MapPin,
  Search, Wand2, PlusCircle, PackageOpen, Box, Star, Leaf, Sparkles, Lock, Crown, ChevronRight, BookOpen, MessageCircle, Zap, LifeBuoy
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playClick, playSparkle, playSwish } from '../utils/sfx';
import { useTranslation } from 'react-i18next';
import { getTypeTheme, getPosLabel } from '../utils/theme';
import { useIslandStore } from '../store/useIslandStore';

interface ExpansionModalProps {
  availableWords: Word[];
  onClose: () => void;
  onAddWords: (selectedWords: Word[]) => void;
  onStudyNow: (selectedWords: Word[]) => void;
}

const RAW_CATEGORIES = [
  { id: 'all', icon: PackagePlus, label: 'All' },
  { id: 'survivor', icon: LifeBuoy, label: 'Survivor' },
  { id: 'storyteller', icon: BookOpen, label: 'Storyteller' },
  { id: 'debater', icon: MessageCircle, label: 'Debater' },
  { id: 'cognates', icon: Zap, label: 'Speed Boost' },
  { id: 'loot', icon: Box, label: 'Survival Loot' }, 
  { id: 'connector', icon: Scroll, label: 'Connectors' }, 
  { id: 'preposition', icon: MapPin, label: 'Prepositions' }, 
];

const ExpansionModal: React.FC<ExpansionModalProps> = ({ availableWords, onClose, onAddWords, onStudyNow }) => {
  const { t } = useTranslation();
  const { profile, openModal } = useIslandStore();
  const isPremium = profile?.is_premium;
  const MAX_SELECTION = isPremium ? 10 : 3;

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [displayPool, setDisplayPool] = useState<Word[]>([]);
  const [plantedWords, setPlantedWords] = useState<Word[] | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const POOL_SIZE = 150; // Increased pool size for larger libraries

  useEffect(() => {
    document.body.classList.add('modal-open');
    // Sort logic: Prioritize new packs if they exist
    const shuffled = [...availableWords].sort((a, b) => {
       const priority = ['survivor', 'storyteller', 'debater', 'cognates'];
       const aP = priority.includes(a.category || '') ? 1 : 0;
       const bP = priority.includes(b.category || '') ? 1 : 0;
       if (aP !== bP) return bP - aP;
       return 0.5 - Math.random();
    });
    setDisplayPool(shuffled.slice(0, Math.min(availableWords.length, POOL_SIZE)));
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [availableWords]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    RAW_CATEGORIES.forEach(cat => counts[cat.id] = 0);
    counts['all'] = displayPool.length;
    displayPool.forEach(w => {
      const cat = w.category || 'loot';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [displayPool]);

  const visibleCategories = useMemo(() => {
    return RAW_CATEGORIES.filter(cat => {
      if (cat.id === 'all') return true;
      return (categoryCounts[cat.id] || 0) > 0;
    }).map(c => ({
      ...c,
      // Fallback label if translation missing
      label: t(`ui.expansion.cats.${c.id}`, { defaultValue: c.label })
    }));
  }, [categoryCounts, t]);

  const filteredWords = useMemo(() => {
    const result = displayPool.filter(w => {
      const wCat = w.category || 'loot';
      const matchesCat = activeCategory === 'all' || wCat === activeCategory;
      const matchesSearch = w.s.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            t(`vocab.${w.id}.t`, { defaultValue: w.t }).toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCat && matchesSearch;
    });

    return result.sort((a, b) => {
      const aSelected = selected.has(a.id) ? 1 : 0;
      const bSelected = selected.has(b.id) ? 1 : 0;
      return bSelected - aSelected;
    });
  }, [displayPool, activeCategory, searchTerm, selected, t]);

  const handleToggle = (wordId: string) => {
    playClick();
    const newSelected = new Set(selected);
    if (newSelected.has(wordId)) {
      newSelected.delete(wordId);
    } else {
      if (newSelected.size < MAX_SELECTION) {
        newSelected.add(wordId);
      } else if (!isPremium) {
        // Trigger paywall if free user tries to exceed limit
        openModal('SUBSCRIPTION');
        return;
      }
    }
    setSelected(newSelected);
  };

  const handleMagicFill = () => {
    playSparkle();
    const pool = filteredWords.filter(w => !selected.has(w.id));
    if (pool.length === 0) return;

    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const needed = MAX_SELECTION - selected.size;
    const toPick = shuffled.slice(0, Math.min(needed, shuffled.length));
    
    const newSelected = new Set(selected);
    toPick.forEach(w => newSelected.add(w.id));
    setSelected(newSelected);

    confetti({ 
      particleCount: 40, 
      spread: 50, 
      origin: { y: 0.3 }, 
      colors: ['#ffa600', '#ffffff'],
      shapes: ['circle']
    });
  };

  const handleConfirm = () => {
    const selectedWords = availableWords.filter(w => selected.has(w.id));
    onAddWords(selectedWords);
    setPlantedWords(selectedWords);
    confetti({ 
      particleCount: 150, 
      spread: 70, 
      origin: { y: 0.5 }, 
      colors: ['#8bc34a', '#ffa600', '#ffffff'],
      scalar: 1.2
    });
  };

  if (plantedWords) {
    return (
      <div className="fixed inset-0 h-[100dvh] w-[100dvw] z-[200] bg-black/70 backdrop-blur-md animate-fadeIn flex flex-col md:pl-72">
        <div className="flex-1 flex items-center justify-center p-6 md:p-12">
          <div className="relative w-full max-w-lg md:max-w-4xl bg-[#fffdf5] rounded-[3.5rem] md:rounded-[5rem] border-[10px] md:border-[12px] border-white shadow-[0_60px_120px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col md:flex-row animate-zoomIn max-h-[90vh]">
             
             {/* Left Column */}
             <div className="md:w-[35%] bg-[#8bc34a] p-8 md:p-12 flex flex-col items-center justify-center text-center relative overflow-hidden shrink-0 border-b-8 md:border-b-0 md:border-r-8 border-white/20">
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }} />
                <div className="bg-white/20 p-6 md:p-8 rounded-[3.5rem] border-4 border-white/40 mb-8 shadow-inner animate-bounce relative z-10">
                   <PackageOpen size={80} className="text-white fill-current md:w-20 md:h-20" />
                </div>
                <div className="relative z-10 space-y-2">
                    <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter leading-tight uppercase drop-shadow-md">{t('ui.dashboard.crate_unlocked')}</h2>
                    <p className="text-white/70 font-black text-[10px] md:text-xs uppercase tracking-[0.3em]">{t('ui.dashboard.crate_found', { count: plantedWords.length })}</p>
                </div>
                <Sparkles className="absolute top-10 left-10 text-white/10" size={48} />
                <Leaf className="absolute bottom-[-10px] right-[-10px] text-white/5 -rotate-45" size={160} />
             </div>

             {/* Right Column */}
             <div className="flex-1 p-8 md:p-12 flex flex-col bg-white/40 overflow-hidden">
                <div className="flex-1 overflow-y-auto no-scrollbar pr-1 mb-8">
                   <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                      {plantedWords.map((word, idx) => {
                         const theme = getTypeTheme(word);
                         return (
                            <div key={word.id} className="bg-white p-4 rounded-3xl border-2 md:border-4 border-[#f7f9e4] shadow-sm flex flex-col gap-1 animate-slideUp relative group overflow-hidden" style={{ animationDelay: `${idx * 0.04}s` }}>
                               <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: theme.main }} />
                               <span className="text-[8px] font-black text-[#8d99ae] uppercase tracking-widest opacity-60">{getPosLabel(word)}</span>
                               <span className="font-black text-[#4b7d78] text-base md:text-lg uppercase leading-none truncate tracking-tight">{word.s}</span>
                               <span className="text-[10px] font-bold text-[#8d99ae]/60 truncate italic">{t(`vocab.${word.id}.t`, { defaultValue: word.t })}</span>
                            </div>
                         );
                      })}
                   </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-center shrink-0">
                    <button onClick={() => onStudyNow(plantedWords!)} className="w-full md:flex-[1.5] bg-[#ffa600] text-white py-5 rounded-[2.5rem] font-black text-lg md:text-xl shadow-[0_8px_0_#e65100] border-4 border-white bubble-button flex items-center justify-center gap-3 hover:bg-[#ffb74d] transition-all"><ArrowRight size={24} strokeWidth={3} /> {t('ui.actions.use_items')}</button>
                    <button onClick={onClose} className="w-full md:flex-1 bg-white text-[#8d99ae] py-5 rounded-[2.5rem] font-black text-sm md:text-base border-4 border-[#f7f9e4] shadow-[0_6px_0_#e0d9b4] bubble-button hover:text-[#4b7d78] transition-all uppercase tracking-widest">{t('ui.actions.stash')}</button>
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 h-[100dvh] z-[100] flex flex-col md:pl-72 bg-black/30 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full bg-[#fffdf5] shadow-2xl overflow-hidden flex flex-col h-full md:h-[95vh] md:max-w-4xl md:mx-auto md:my-auto md:rounded-[4.5rem] md:border-[12px] md:border-white">
        
        {/* Header */}
        <div className="shrink-0 bg-white/80 backdrop-blur-md relative z-20 border-b-4 border-[#f7f9e4] pb-6">
          <div className="flex items-center justify-between p-6 md:p-10 pb-4">
            <div>
              <h2 className="text-2xl md:text-4xl font-black text-[#4b7d78] tracking-tighter uppercase leading-none">{t('ui.expansion.title')}</h2>
              <p className="text-[10px] font-black text-[#8d99ae] uppercase tracking-[0.2em] mt-1">Tropical Supplies Depot</p>
            </div>
            <button onClick={onClose} className="p-3 bg-[#f7f9e4] rounded-2xl text-[#4b7d78] hover:bg-white transition-all shadow-sm active:scale-90 border-2 border-transparent hover:border-[#8bc34a]/20"><X size={24} strokeWidth={4} /></button>
          </div>

          <div className="px-6 md:px-10 space-y-5">
            {!isPremium && (
                <div className="bg-[#fff9c4] p-3 rounded-2xl border-2 border-[#fbc02d] flex items-center justify-between group cursor-pointer" onClick={() => openModal('SUBSCRIPTION')}>
                    <div className="flex items-center gap-3">
                        <div className="bg-[#fbc02d] p-1.5 rounded-lg text-white"><Lock size={14} /></div>
                        <p className="text-[10px] font-black text-[#8e6b23] uppercase leading-tight">Free Limit: 3 Seeds per crate. Upgrade for 10!</p>
                    </div>
                    <ChevronRight size={14} className="text-[#8e6b23]" />
                </div>
            )}

            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#8d99ae]/50 group-focus-within:text-[#8bc34a] transition-colors" size={20} strokeWidth={3} />
              <input 
                type="text"
                placeholder={t('ui.actions.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-6 py-5 bg-[#f7f9e4] border-4 border-transparent rounded-[2.5rem] text-lg font-bold text-[#4b7d78] focus:outline-none focus:border-[#8bc34a] focus:bg-white transition-all placeholder:text-[#8d99ae]/30 shadow-inner"
              />
            </div>

            <div className="flex gap-4">
               <button 
                  onClick={handleMagicFill}
                  disabled={selected.size >= MAX_SELECTION || filteredWords.length === 0}
                  className="group relative flex-[1] bg-gradient-to-br from-[#ffcc80] to-[#ffa600] text-white py-4 px-2 rounded-[2rem] font-black text-[11px] md:text-xs uppercase flex items-center justify-center gap-2 shadow-[0_6px_0_#e65100] active:shadow-none active:translate-y-1 transition-all disabled:opacity-30 animate-glow bubble-button"
               >
                  <Wand2 size={18} className="group-hover:rotate-12 transition-transform" />
                  <span>{t('ui.expansion.magic_fill')}</span>
               </button>
               
               <button 
                  onClick={handleConfirm}
                  disabled={selected.size === 0}
                  className="flex-[2] bg-[#8bc34a] text-white py-4 rounded-[2rem] font-black text-lg md:text-xl tracking-tighter uppercase shadow-[0_8px_0_#5a9a3b] active:shadow-none active:translate-y-1 transition-all disabled:opacity-30 flex items-center justify-center gap-3 bubble-button"
               >
                  <PlusCircle size={24} />
                  <span>{t('ui.expansion.get_supplies')}</span>
                  <div className={`bg-black/15 px-3 py-1 rounded-full text-xs font-black min-w-[50px] ${!isPremium && selected.size >= 3 ? 'text-amber-300' : ''}`}>
                    {selected.size} / {MAX_SELECTION}
                  </div>
               </button>
            </div>

            <div className="relative">
              <div className="flex overflow-x-auto no-scrollbar gap-2 py-1 pr-12">
                {visibleCategories.map((cat) => (
                  <button 
                    key={cat.id} 
                    onClick={() => { playSwish(); setActiveCategory(cat.id); }} 
                    className={`flex items-center gap-2 px-6 py-3 rounded-full border-2 font-black text-[10px] uppercase transition-all whitespace-nowrap active:scale-95 shadow-sm ${activeCategory === cat.id ? 'bg-[#4b7d78] text-white border-[#4b7d78] shadow-md' : 'bg-white text-[#8d99ae] border-[#f7f9e4] hover:border-[#8bc34a]'}`}
                  >
                    <cat.icon size={14} />
                    {cat.label}
                  </button>
                ))}
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-10 relative pb-[env(safe-area-inset-bottom,2rem)] bg-[#fffdf5]">
          {filteredWords.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredWords.map((word) => {
                const isSelected = selected.has(word.id);
                const theme = getTypeTheme(word);
                
                return (
                  <button 
                    key={word.id} 
                    onClick={() => handleToggle(word.id)} 
                    className={`relative p-5 rounded-[2.5rem] border-4 text-left transition-all h-full flex flex-col justify-between group active:scale-95 animate-fadeIn shadow-sm hover:shadow-md ${
                      isSelected 
                        ? 'bg-white border-[#8bc34a] ring-8 ring-[#8bc34a]/10 -translate-y-2' 
                        : 'bg-white border-[#f7f9e4] hover:border-[#8bc34a]/30'
                    }`}
                  >
                    {isSelected && (
                        <div className="absolute -right-2 -top-2 bg-[#ffa600] text-white p-1.5 rounded-full shadow-lg z-10 animate-zoomIn border-2 border-white">
                           <Star size={12} fill="white" />
                        </div>
                    )}

                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-2">
                         <span style={{ backgroundColor: isSelected ? '#8bc34a' : theme.main }} className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full text-white shadow-sm`}>
                            {word.level}
                         </span>
                         <span className="text-[7px] font-black text-[#8d99ae] opacity-40 uppercase tracking-widest">{getPosLabel(word)}</span>
                      </div>
                      <h4 className="font-black text-lg md:text-xl text-[#4b7d78] break-words leading-none tracking-tighter mb-1 uppercase" style={{ color: isSelected ? '#4b7d78' : theme.main }}>{word.s}</h4>
                      <p className="text-[11px] font-bold text-[#8d99ae] leading-tight truncate italic">{t(`vocab.${word.id}.t`, { defaultValue: word.t })}</p>
                    </div>
                    
                    <div className={`mt-4 pt-2 border-t-2 ${isSelected ? 'border-[#8bc34a]/10' : 'border-[#f7f9e4]'} flex justify-end`}>
                       <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: theme.main }} />
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-20 opacity-20 text-center text-[#4b7d78] space-y-4">
               <PackageOpen size={80} strokeWidth={1} />
               <p className="font-black uppercase tracking-[0.3em] text-sm">{t('ui.expansion.no_items')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpansionModal;
