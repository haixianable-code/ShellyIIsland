
import React, { useState, useMemo } from 'react';
import { Word, ProgressMap, WordLevel } from '../types';
import { Search, ShoppingBag, Filter, Hammer, Package, Sparkles, Cloud, TreePalm, CircleDot, Sprout, Flower2, TreeDeciduous, BookOpen, Lock } from 'lucide-react';
import { playClick } from '../utils/sfx';
import { useTranslation } from 'react-i18next';
import { getTypeTheme, getPosLabel } from '../utils/theme';
import { useIslandStore } from '../store/useIslandStore';
import { useSRS } from '../hooks/useSRS';
import LazyCard from './LazyCard';
import SEO from './SEO';

interface VocabularyViewProps {
  words: Word[];
  progress: ProgressMap;
  onWordClick: (word: Word) => void;
}

type InventoryCategory = 'ALL' | 'verb' | 'noun' | 'other';

const VocabularyView: React.FC<VocabularyViewProps> = ({ words, progress, onWordClick }) => {
  const { t } = useTranslation();
  const { allWords, profile, openModal, blueprints, activeBlueprintId, setActiveBlueprint } = useIslandStore();
  const { reviewWords, newWordsForToday } = useSRS();
  const isPremium = profile?.is_premium;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<InventoryCategory>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<WordLevel | 'ALL'>('ALL');
  const [selectedBlueprintFilter, setSelectedBlueprintFilter] = useState<string | 'ALL'>('ALL');

  // Only show words the user has progress for (collected items)
  const collectedWords = useMemo(() => {
    return allWords.filter(w => !!progress[w.id]);
  }, [allWords, progress]);

  const filteredWords = useMemo(() => {
    let list = collectedWords;
    
    if (selectedBlueprintFilter !== 'ALL') {
      const bp = blueprints.find(b => b.id === selectedBlueprintFilter);
      if (bp) {
        list = list.filter(w => bp.wordIds.includes(w.id));
      }
    }

    if (selectedLevel !== 'ALL') {
      list = list.filter(w => w.level === selectedLevel);
    }

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      list = list.filter(w => 
        w.s.toLowerCase().includes(lowerSearch) || 
        t(`vocab.${w.id}.t`, { defaultValue: w.t }).toLowerCase().includes(lowerSearch)
      );
    }

    return list;
  }, [collectedWords, searchTerm, selectedLevel, selectedBlueprintFilter, blueprints, t]);

  const verbs = filteredWords.filter(w => w.type === 'verb');
  const nouns = filteredWords.filter(w => w.type === 'noun');
  const others = filteredWords.filter(w => w.type === 'adj' || w.type === 'misc');

  const getGrowthIcon = (level: number) => {
    if (level <= 1) return { icon: CircleDot, color: 'text-slate-400', bg: 'bg-slate-50' };
    if (level <= 3) return { icon: Sprout, color: 'text-emerald-500', bg: 'bg-emerald-50' };
    if (level <= 5) return { icon: Flower2, color: 'text-orange-400', bg: 'bg-orange-50' };
    return { icon: TreeDeciduous, color: 'text-green-700', bg: 'bg-green-50' };
  };

  const handleItemClick = (word: Word) => {
    const hasProgress = !!progress[word.id];
    const parentPack = blueprints.find(bp => bp.wordIds.includes(word.id));
    const isPremiumWord = parentPack && parentPack.isPremium;

    if (!hasProgress && !isPremium && isPremiumWord) {
      playClick();
      openModal('SUBSCRIPTION');
      return;
    }

    playClick();
    onWordClick(word);
  };

  const renderWordCard = (word: Word) => {
    const theme = getTypeTheme(word);
    const srs = progress[word.id];
    const level = srs?.level || 0;
    const { icon: StageIcon, color, bg } = getGrowthIcon(level);
    
    const isReview = reviewWords.some(w => w.id === word.id);
    const isNew = newWordsForToday.some(w => w.id === word.id);

    return (
      <LazyCard key={word.id}>
        <article 
          className={`bg-white p-5 rounded-[2rem] border-4 border-transparent shadow-[0_10px_20px_-5px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.1)] transition-all flex flex-col justify-between group active:scale-[0.98] text-left relative overflow-hidden h-full min-h-[140px] w-full`}
        >
          <button 
            onClick={() => handleItemClick(word)}
            className="absolute inset-0 z-30 w-full h-full cursor-pointer"
            aria-label={`View details for word ${word.s}`}
          />
          
          <div className="flex flex-wrap gap-2 mb-2 relative z-10 pointer-events-none justify-between items-start">
            <div className="flex gap-2">
              <span style={{ backgroundColor: theme.main }} className="px-2.5 py-1 rounded-full text-white text-[10px] font-black uppercase tracking-widest shadow-sm">{getPosLabel(word)}</span>
              <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest shadow-sm">{word.level}</span>
            </div>
            {isReview && <div className="w-2.5 h-2.5 rounded-full bg-[#ef476f] shadow-sm"></div>}
            {isNew && <div className="w-2.5 h-2.5 rounded-full bg-[#06d6a0] shadow-sm"></div>}
          </div>

          <div className="relative z-10 flex items-end justify-between mt-auto pointer-events-none">
            <div className="space-y-1">
              <h3 className={`text-3xl font-black text-[#2e4d4a] tracking-tighter`}>{word.s}</h3>
              <p className={`text-slate-500 font-bold text-base`}>{t(`vocab.${word.id}.t`, { defaultValue: word.t })}</p>
            </div>
            
            <div className={`flex flex-col items-center gap-1 p-2 rounded-2xl ${bg}`} aria-label={`Mastery Level ${level}`}>
              <StageIcon size={20} className={color} aria-hidden="true" />
            </div>
          </div>
        </article>
      </LazyCard>
    );
  };

  return (
    <div className="space-y-10 animate-fadeIn pb-24 md:pb-12 relative">
      <SEO 
        title="单词库 - Vocabulary Collection"
        description="Review and manage your collected Spanish vocabulary."
        url="https://ssisland.space/pocket"
        breadcrumbs={[{ name: 'Home', item: '/' }, { name: 'Vocabulary', item: '/pocket' }]}
        themeColor="#ffb74d"
      />

      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.07]" aria-hidden="true">
         <Cloud className="absolute top-[10%] -left-10 text-[#4b7d78] animate-float-slow" size={120} />
         <TreePalm className="absolute bottom-[10%] -left-16 text-[#78c850] animate-sway" size={240} />
      </div>

      <header className="relative z-10 flex items-center gap-5">
        <div className="bg-[#ffb74d] p-5 rounded-[2.5rem] shadow-[0_10px_20px_-5px_rgba(230,126,34,0.3)] border-4 border-white" aria-hidden="true">
          <BookOpen className="text-white fill-current" size={32} />
        </div>
        <div>
          <h1 className="text-5xl font-black text-[#4b7d78] drop-shadow-sm">单词库</h1>
          <p className="text-[#8d99ae] font-bold text-sm uppercase tracking-widest mt-1">
            {collectedWords.length} 个已收集单词
          </p>
        </div>
      </header>
        
      <section className="relative z-10 space-y-8" aria-label="Vocabulary">
        
        {/* Today's Status Bar */}
        <div className="bg-white p-4 rounded-[2rem] border-4 border-transparent shadow-[0_10px_20px_-5px_rgba(0,0,0,0.05)] flex items-center gap-4">
          <span className="font-black text-slate-500 pl-2">今日</span>
          <div className="flex gap-2">
            <div className="bg-[#fff0f3] text-[#ef476f] px-4 py-2 rounded-full font-black text-sm flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#ef476f]"></div>
              {reviewWords.length} 个待复习
            </div>
            <div className="bg-[#e6fcf5] text-[#06d6a0] px-4 py-2 rounded-full font-black text-sm flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#06d6a0]"></div>
              {newWordsForToday.length} 个新词
            </div>
          </div>
        </div>

        {/* Blueprint Filter Bar */}
        <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar items-center">
          <button
            onClick={() => {
              playClick();
              setSelectedBlueprintFilter('ALL');
            }}
            className={`px-6 py-4 rounded-[2rem] font-black text-sm whitespace-nowrap transition-all border-4 flex items-center gap-2 ${
              selectedBlueprintFilter === 'ALL'
                ? 'bg-[#4b7d78] text-white border-[#4b7d78] shadow-[0_10px_20px_-5px_rgba(75,125,120,0.3)]'
                : 'bg-white text-slate-500 border-transparent hover:border-slate-200 shadow-[0_10px_20px_-5px_rgba(0,0,0,0.05)]'
            }`}
          >
            全部
          </button>
          
          {blueprints.map(bp => {
            const isLocked = (!isPremium && bp.phase > 0) || (bp.isPremium && !isPremium);
            const learnedInBlueprint = bp.wordIds.filter(id => !!progress[id]).length;
            const bpProgress = Math.round((learnedInBlueprint / bp.wordIds.length) * 100);
            
            return (
              <button
                key={bp.id}
                onClick={() => {
                  playClick();
                  if (isLocked) {
                    openModal('SUBSCRIPTION');
                  } else {
                    setSelectedBlueprintFilter(bp.id);
                  }
                }}
                className={`px-6 py-4 rounded-[2rem] font-black text-sm whitespace-nowrap transition-all border-4 flex items-center gap-3 ${
                  selectedBlueprintFilter === bp.id
                    ? 'bg-white text-[#4b7d78] border-[#4b7d78] shadow-[0_10px_20px_-5px_rgba(75,125,120,0.1)]'
                    : 'bg-white text-slate-500 border-transparent hover:border-slate-200 shadow-[0_10px_20px_-5px_rgba(0,0,0,0.05)]'
                }`}
              >
                {t(bp.title.zh, { defaultValue: bp.title.zh })}
                {isLocked ? (
                  <Lock size={14} className="text-slate-400" />
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#4b7d78] rounded-full" style={{ width: `${bpProgress}%` }}></div>
                    </div>
                    <span className="text-xs font-bold text-slate-400">{bpProgress}%</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative group flex-1">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 bg-[#8bc34a] p-2 rounded-xl shadow-[0_4px_10px_-2px_rgba(139,195,74,0.3)] border-2 border-white z-10" aria-hidden="true">
              <Search className="text-white" size={18} strokeWidth={3} />
            </div>
            <input 
              type="text" 
              placeholder="搜索单词 (西语/中文)..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-16 pr-6 py-5 bg-white border-4 border-transparent rounded-[2.5rem] w-full shadow-[0_10px_20px_-5px_rgba(0,0,0,0.05)] focus:outline-none focus:border-[#8bc34a] focus:ring-4 focus:ring-[#8bc34a]/20 transition-all font-black text-[#4b7d78] text-lg placeholder:text-slate-300"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar items-center">
            <div className="bg-white p-2 rounded-2xl border-4 border-transparent shadow-[0_10px_20px_-5px_rgba(0,0,0,0.05)] flex items-center justify-center mr-2">
              <Filter className="text-slate-400" size={20} />
            </div>
            {(['ALL', 'A1', 'A2', 'B1', 'B2', 'C1'] as const).map(level => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`px-5 py-3 rounded-2xl font-black text-sm whitespace-nowrap transition-all border-4 ${
                  selectedLevel === level 
                    ? 'bg-[#4b7d78] text-white border-[#4b7d78] shadow-[0_10px_20px_-5px_rgba(75,125,120,0.3)]' 
                    : 'bg-white text-slate-400 border-transparent hover:border-slate-200 shadow-[0_10px_20px_-5px_rgba(0,0,0,0.05)]'
                }`}
              >
                {level === 'ALL' ? '全部级别' : level}
              </button>
            ))}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-6 py-3 rounded-full font-black text-sm whitespace-nowrap transition-all border-2 flex items-center gap-2 ${
              selectedCategory === 'ALL' 
                ? 'bg-[#ffb74d] text-white border-[#ffb74d] shadow-md' 
                : 'bg-white text-slate-500 border-transparent hover:border-slate-200 shadow-sm'
            }`}
          >
            全部
          </button>
          <button
            onClick={() => setSelectedCategory('verb')}
            className={`px-6 py-3 rounded-full font-black text-sm whitespace-nowrap transition-all border-2 flex items-center gap-2 ${
              selectedCategory === 'verb' 
                ? 'bg-[#ef476f] text-white border-[#ef476f] shadow-md' 
                : 'bg-white text-slate-500 border-transparent hover:border-slate-200 shadow-sm'
            }`}
          >
            动词
          </button>
          <button
            onClick={() => setSelectedCategory('noun')}
            className={`px-6 py-3 rounded-full font-black text-sm whitespace-nowrap transition-all border-2 flex items-center gap-2 ${
              selectedCategory === 'noun' 
                ? 'bg-[#118ab2] text-white border-[#118ab2] shadow-md' 
                : 'bg-white text-slate-500 border-transparent hover:border-slate-200 shadow-sm'
            }`}
          >
            名词
          </button>
          <button
            onClick={() => setSelectedCategory('other')}
            className={`px-6 py-3 rounded-full font-black text-sm whitespace-nowrap transition-all border-2 flex items-center gap-2 ${
              selectedCategory === 'other' 
                ? 'bg-[#06d6a0] text-white border-[#06d6a0] shadow-md' 
                : 'bg-white text-slate-500 border-transparent hover:border-slate-200 shadow-sm'
            }`}
          >
            形容词
          </button>
        </div>

        {/* Word Lists */}
        <div className="space-y-10">
          {(selectedCategory === 'ALL' || selectedCategory === 'verb') && verbs.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-[#ef476f] flex items-center gap-2 ml-2">
                <Hammer size={24} /> 动词 <span className="text-sm text-slate-400 bg-white px-3 py-1 rounded-full shadow-sm">{verbs.length}</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {verbs.map(renderWordCard)}
              </div>
            </div>
          )}

          {(selectedCategory === 'ALL' || selectedCategory === 'noun') && nouns.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-[#118ab2] flex items-center gap-2 ml-2">
                <Package size={24} /> 名词 <span className="text-sm text-slate-400 bg-white px-3 py-1 rounded-full shadow-sm">{nouns.length}</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {nouns.map(renderWordCard)}
              </div>
            </div>
          )}

          {(selectedCategory === 'ALL' || selectedCategory === 'other') && others.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-[#06d6a0] flex items-center gap-2 ml-2">
                <Sparkles size={24} /> 形容词/其他 <span className="text-sm text-slate-400 bg-white px-3 py-1 rounded-full shadow-sm">{others.length}</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {others.map(renderWordCard)}
              </div>
            </div>
          )}

          {filteredWords.length === 0 && (
            <div className="text-center py-20 bg-white/50 rounded-[3rem] border-4 border-dashed border-slate-300">
              <BookOpen className="mx-auto text-slate-300 mb-4" size={64} />
              <h3 className="text-2xl font-black text-slate-400 mb-2">单词库为空</h3>
              <p className="text-slate-500 font-bold">没有找到符合条件的单词，去学习更多吧！</p>
            </div>
          )}
        </div>

      </section>
    </div>
  );
};

export default VocabularyView;

