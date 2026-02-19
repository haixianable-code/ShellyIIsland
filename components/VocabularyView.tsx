
import React, { useState, useMemo } from 'react';
import { Word, ProgressMap, WordLevel, WordTopic } from '../types';
import { Search, ShoppingBag, CircleDot, Sprout, Flower2, TreeDeciduous, Filter, Plane, Apple, Briefcase, Leaf, Home, Heart, Users, Brain, Cpu, Palette, PenTool, Sparkles, Clock, User, Calculator, FlaskConical, Cloud, TreePalm, Lock, Crown } from 'lucide-react';
import WordExpansionPack from './WordExpansionPack';
import ExpansionModal from './ExpansionModal';
import { EXTRA_CANDIDATES, VOCABULARY_DATA } from '../constants';
import { playClick, playSwish } from '../utils/sfx';
import { useTranslation } from 'react-i18next';
import { getTypeTheme, getPosLabel } from '../utils/theme';
import { useIslandStore } from '../store/useIslandStore';
import LazyCard from './LazyCard';
import SEO from './SEO';

interface VocabularyViewProps {
  words: Word[];
  progress: ProgressMap;
  onWordClick: (word: Word) => void;
  onAddExtraWords: (words: Word[]) => void;
  onStartExtraStudy: (words: Word[]) => void;
}

const VocabularyView: React.FC<VocabularyViewProps> = ({ words, progress, onWordClick, onAddExtraWords, onStartExtraStudy }) => {
  const { t } = useTranslation();
  const { allWords, wordsByTopic, wordsByLevel, profile, openModal } = useIslandStore();
  const isPremium = profile?.is_premium;

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<WordLevel | 'ALL'>('ALL');
  const [selectedTopic, setSelectedTopic] = useState<WordTopic | 'ALL'>('ALL');

  const filteredWords = useMemo(() => {
    let baseList = allWords;
    
    if (selectedTopic !== 'ALL') {
      const ids = wordsByTopic[selectedTopic] || [];
      baseList = baseList.filter(w => ids.includes(w.id));
    }
    
    if (selectedLevel !== 'ALL') {
      const ids = wordsByLevel[selectedLevel] || [];
      baseList = baseList.filter(w => ids.includes(w.id));
    }

    return baseList.filter(w => {
      // Logic: If it's already learned, always show it.
      // If NOT learned, show only if premium OR search matches.
      // BUT we want to show 'Locked' items to non-premium users for Upsell.
      const hasProgress = !!progress[w.id];
      
      // If searching, show any match
      if (searchTerm) {
        const lowerSearch = searchTerm.toLowerCase();
        return w.s.toLowerCase().includes(lowerSearch) || 
               t(`vocab.${w.id}.t`, { defaultValue: w.t }).toLowerCase().includes(lowerSearch);
      }

      // If not searching, only show what the user "owns" (progress exists)
      return hasProgress;
    });
  }, [allWords, progress, searchTerm, selectedLevel, selectedTopic, t, wordsByTopic, wordsByLevel]);

  const ownedWordsCount = useMemo(() => words.filter(w => !!progress[w.id]).length, [words, progress]);
  const unlearnedExtra = EXTRA_CANDIDATES.filter(w => !progress[w.id]);

  const getGrowthIcon = (level: number) => {
    if (level <= 1) return { icon: CircleDot, color: 'text-slate-400', bg: 'bg-slate-50' };
    if (level <= 3) return { icon: Sprout, color: 'text-emerald-500', bg: 'bg-emerald-50' };
    if (level <= 5) return { icon: Flower2, color: 'text-orange-400', bg: 'bg-orange-50' };
    return { icon: TreeDeciduous, color: 'text-green-700', bg: 'bg-green-50' };
  };

  const handleItemClick = (word: Word) => {
    const hasProgress = !!progress[word.id];
    
    // Check if word belongs to a premium pack
    const parentPack = VOCABULARY_DATA.find(p => p.words.some(w => w.id === word.id));
    const isPremiumWord = parentPack && parentPack.id !== 'day1';

    if (!hasProgress && !isPremium && isPremiumWord) {
      playClick();
      openModal('SUBSCRIPTION');
      return;
    }

    playClick();
    onWordClick(word);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-24 md:pb-12 relative">
      <SEO 
        title="My Pocket - Vocabulary Collection"
        description="Review and manage your grown Spanish vocabulary seeds. Track your mastery levels and filter by topic."
        url="https://ssisland.space/pocket"
        breadcrumbs={[{ name: 'Home', item: '/' }, { name: 'Pocket', item: '/pocket' }]}
        themeColor="#ffb74d"
      />

      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.07]" aria-hidden="true">
         <Cloud className="absolute top-[10%] -left-10 text-[#4b7d78] animate-float-slow" size={120} />
         <TreePalm className="absolute bottom-[10%] -left-16 text-[#78c850] animate-sway" size={240} />
      </div>

      <header className="relative z-10 flex items-center gap-5">
        <div className="bg-[#ffb74d] p-5 rounded-[2.5rem] shadow-[0_10px_0_#e67e22] border-4 border-white" aria-hidden="true">
          <ShoppingBag className="text-white fill-current" size={32} />
        </div>
        <div>
          <h1 className="text-5xl font-black text-[#4b7d78] drop-shadow-sm">{t('ui.nav.pocket')}</h1>
          <p className="text-[#8d99ae] font-bold text-sm uppercase tracking-widest mt-1">
            {ownedWordsCount} {t('ui.dashboard.recently_planted')}
          </p>
        </div>
      </header>

      <section className="relative z-10" aria-label="Vocabulary expansion pack">
        <WordExpansionPack availableCount={unlearnedExtra.length} onExplore={() => { playClick(); setIsModalOpen(true); }} />
      </section>
        
      <section className="relative group z-20 max-w-2xl" aria-label="Search and filter vocabulary">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-[#8bc34a] p-2.5 rounded-2xl shadow-sm border-2 border-white z-10" aria-hidden="true">
          <Search className="text-white" size={20} strokeWidth={3} />
        </div>
        <label htmlFor="vocab-search" className="sr-only">Search your vocabulary</label>
        <input 
          id="vocab-search"
          type="text" 
          placeholder={t('ui.actions.search')} 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-20 pr-8 py-6 bg-white border-4 border-[#e0d9b4] rounded-[3rem] w-full shadow-[0_10px_0_rgba(224,217,180,0.4)] focus:outline-none focus:border-[#8bc34a] focus:ring-8 focus:ring-[#8bc34a]/20 transition-all font-black text-[#4b7d78] text-xl placeholder:text-slate-300"
        />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10" aria-label="Vocabulary results list">
        {filteredWords.map((word) => {
          const srs = progress[word.id];
          const hasProgress = !!srs;
          const level = srs?.level || 0;
          const { icon: StageIcon, color, bg } = getGrowthIcon(level);
          const theme = getTypeTheme(word);

          // Paywall logic check
          const parentPack = VOCABULARY_DATA.find(p => p.words.some(w => w.id === word.id));
          const isPremiumWord = parentPack && parentPack.id !== 'day1';
          const isLocked = !hasProgress && !isPremium && isPremiumWord;
          
          return (
            <LazyCard key={word.id}>
              <article 
                className={`island-card-3d bg-white p-6 rounded-[3rem] border-4 border-transparent shadow-[0_15px_30px_-5px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(139,195,74,0.3)] transition-all flex flex-col justify-between group active:translate-y-2 active:shadow-none text-left relative overflow-hidden h-full min-h-[180px] bubble-button w-full ${isLocked ? 'grayscale-[0.8] opacity-80' : ''}`}
              >
                {/* Click Overlay - Increased z-index to 30 to cover content (z-10) */}
                <button 
                  onClick={() => handleItemClick(word)}
                  className="absolute inset-0 z-30 w-full h-full cursor-pointer"
                  aria-label={isLocked ? `Unlock premium word ${word.s}` : `View details for word ${word.s}`}
                />
                
                <div className="flex flex-wrap gap-2 mb-3 relative z-10 pointer-events-none">
                    <span style={{ backgroundColor: theme.main }} className="px-2.5 py-1 rounded-full text-white text-[9px] font-black uppercase tracking-widest shadow-sm">{getPosLabel(word)}</span>
                    {!isLocked && <span style={{ backgroundColor: theme.main }} className="px-2.5 py-1 rounded-full text-white text-[9px] font-black uppercase tracking-widest shadow-sm">{word.level}</span>}
                </div>

                <div className="relative z-10 flex items-end justify-between mt-1 pointer-events-none">
                  <div className="space-y-1">
                    <h3 className={`text-4xl font-black text-[#2e4d4a] tracking-tighter ${isLocked ? 'blur-[3px]' : ''}`}>{word.s}</h3>
                    <p className={`text-slate-400 font-bold text-lg ${isLocked ? 'blur-[2px]' : ''}`}>{t(`vocab.${word.id}.t`, { defaultValue: word.t })}</p>
                  </div>
                  
                  {isLocked ? (
                    <div className="bg-[#ffa600]/10 p-3 rounded-2xl border-2 border-[#ffa600]/20 flex flex-col items-center">
                       <Lock size={20} className="text-[#ffa600]" />
                       <span className="text-[7px] font-black text-[#ffa600] uppercase mt-1">Supporter</span>
                    </div>
                  ) : (
                    <div className={`flex flex-col items-center gap-1 p-2 rounded-2xl ${bg}`} aria-label={`Mastery Level ${level}`}>
                      <StageIcon size={20} className={color} aria-hidden="true" />
                    </div>
                  )}
                </div>

                {isLocked && (
                    <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] pointer-events-none flex items-center justify-center z-20">
                       <div className="bg-white/90 p-4 rounded-3xl shadow-xl flex items-center gap-3 border-2 border-[#ffa600]/30 transform -rotate-2">
                          <Crown size={24} className="text-[#ffa600]" />
                          <div className="text-left">
                             <p className="text-[9px] font-black text-[#4b7d78] uppercase leading-none">Premium Content</p>
                             <p className="text-[8px] font-bold text-[#8d99ae] uppercase tracking-widest">Tap to Unlock</p>
                          </div>
                       </div>
                    </div>
                )}
              </article>
            </LazyCard>
          );
        })}
      </section>

      {isModalOpen && <ExpansionModal availableWords={unlearnedExtra} onClose={() => setIsModalOpen(false)} onAddWords={onAddExtraWords} onStudyNow={onStartExtraStudy} />}
    </div>
  );
};

export default VocabularyView;
