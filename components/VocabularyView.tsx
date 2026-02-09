
import React, { useState, useMemo } from 'react';
import { Word, ProgressMap, WordLevel, WordTopic } from '../types';
import { Search, ShoppingBag, CircleDot, Sprout, Flower2, TreeDeciduous, ChevronRight, Filter, Plane, Apple, Briefcase, Leaf, Home, Heart, Users, Brain, Cpu, Palette, PenTool, Sparkles, Clock, User, Calculator, FlaskConical, Shovel } from 'lucide-react';
import WordExpansionPack from './WordExpansionPack';
import ExpansionModal from './ExpansionModal';
import { EXTRA_CANDIDATES } from '../constants';
import { playClick, playSwish } from '../utils/sfx';
import { useTranslation } from 'react-i18next';
import { getTypeTheme, getPosLabel } from '../utils/theme';

interface VocabularyViewProps {
  words: Word[];
  progress: ProgressMap;
  onWordClick: (word: Word) => void;
  onAddExtraWords: (words: Word[]) => void;
  onStartExtraStudy: (words: Word[]) => void;
}

const TOPIC_ICONS: Record<WordTopic, React.ElementType> = {
  travel: Plane,
  food: Apple,
  work: Briefcase,
  nature: Leaf,
  daily: Home,
  feelings: Heart,
  society: Users,
  abstract: Brain,
  tech: Cpu,
  art: Palette,
  grammar: PenTool,
  time: Clock,
  social: Users,
  body: User,
  life: Sparkles,
  quantity: Calculator,
  science: FlaskConical
};

const VocabularyView: React.FC<VocabularyViewProps> = ({ words, progress, onWordClick, onAddExtraWords, onStartExtraStudy }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<WordLevel | 'ALL'>('ALL');
  const [selectedTopic, setSelectedTopic] = useState<WordTopic | 'ALL'>('ALL');

  // Core Filter: Must be in progress AND match search/filters
  const filteredWords = useMemo(() => {
    return words.filter(w => {
      // 1. Only show words that the user has actually "planted" (exists in progress)
      if (!progress[w.id]) return false;

      const matchesSearch = w.s.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            t(`vocab.${w.id}.t`, { defaultValue: w.t }).toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLevel = selectedLevel === 'ALL' || w.level === selectedLevel;
      const matchesTopic = selectedTopic === 'ALL' || w.topic === selectedTopic;
      return matchesSearch && matchesLevel && matchesTopic;
    });
  }, [words, progress, searchTerm, selectedLevel, selectedTopic, t]);

  // Dynamically calculate which Levels and Topics exist in the user's pocket
  const ownedWords = useMemo(() => words.filter(w => !!progress[w.id]), [words, progress]);
  
  const availableLevels = useMemo(() => {
    const levels = new Set<WordLevel>();
    ownedWords.forEach(w => levels.add(w.level));
    return Array.from(levels).sort();
  }, [ownedWords]);

  const availableTopics = useMemo(() => {
    const topics = new Set<WordTopic>();
    ownedWords.forEach(w => topics.add(w.topic));
    return Array.from(topics).sort();
  }, [ownedWords]);

  const unlearnedExtra = EXTRA_CANDIDATES.filter(w => !progress[w.id]);

  const getGrowthIcon = (level: number) => {
    if (level <= 1) return { icon: CircleDot, color: 'text-slate-400', bg: 'bg-slate-50', label: 'Seed' };
    if (level <= 3) return { icon: Sprout, color: 'text-emerald-500', bg: 'bg-emerald-50', label: 'Sprout' };
    if (level <= 5) return { icon: Flower2, color: 'text-orange-400', bg: 'bg-orange-50', label: 'Bloom' };
    return { icon: TreeDeciduous, color: 'text-green-700', bg: 'bg-green-50', label: 'Tree' };
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-24 md:pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="bg-[#ffb74d] p-5 rounded-[2.5rem] shadow-[0_10px_0_#e67e22] border-4 border-white animate-bounce-slight">
            <ShoppingBag className="text-white fill-current" size={32} />
          </div>
          <div>
            <h2 className="text-5xl font-black text-[#4b7d78] drop-shadow-sm">{t('ui.nav.pocket')}</h2>
            <p className="text-[#8d99ae] font-bold text-sm uppercase tracking-widest mt-1">
              {ownedWords.length} {t('ui.dashboard.recently_planted')}
            </p>
          </div>
        </div>
      </div>

      <WordExpansionPack 
        availableCount={unlearnedExtra.length} 
        onExplore={() => { playClick(); setIsModalOpen(true); }}
      />
        
      <div className="relative group z-20 max-w-2xl">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-[#8bc34a] p-2.5 rounded-2xl shadow-sm border-2 border-white z-10 transition-transform group-focus-within:scale-110">
          <Search className="text-white" size={20} strokeWidth={3} />
        </div>
        <input 
          type="text" 
          placeholder={t('ui.actions.search')} 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-20 pr-8 py-6 bg-white border-4 border-[#e0d9b4] rounded-[3rem] w-full shadow-[0_10px_0_rgba(224,217,180,0.4)] focus:outline-none focus:ring-8 focus:ring-[#8bc34a]/20 transition-all font-black text-[#4b7d78] text-xl placeholder:text-slate-300"
        />
      </div>

      {/* --- FILTERS --- */}
      <div className="space-y-4">
        {/* Level Filter - Dynamically hidden based on ownership */}
        {availableLevels.length > 0 && (
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            <button
              onClick={() => { playSwish(); setSelectedLevel('ALL'); }}
              className={`px-4 py-2 rounded-xl border-2 font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap active:scale-95 ${
                selectedLevel === 'ALL' 
                ? 'bg-[#4b7d78] text-white border-[#4b7d78] shadow-md' 
                : 'bg-white text-[#8d99ae] border-[#f0f0f0] hover:border-[#b0bec5]'
              }`}
            >
              All Levels
            </button>
            {availableLevels.map((lvl) => (
              <button
                key={lvl}
                onClick={() => { playSwish(); setSelectedLevel(lvl); }}
                className={`px-4 py-2 rounded-xl border-2 font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap active:scale-95 ${
                  selectedLevel === lvl 
                  ? 'bg-[#4b7d78] text-white border-[#4b7d78] shadow-md' 
                  : 'bg-white text-[#8d99ae] border-[#f0f0f0] hover:border-[#b0bec5]'
                }`}
              >
                Level {lvl}
              </button>
            ))}
          </div>
        )}
        
        {/* Topic Filter - Dynamically hidden based on ownership */}
        {availableTopics.length > 0 && (
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            <button
              onClick={() => { playSwish(); setSelectedTopic('ALL'); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap active:scale-95 ${
                selectedTopic === 'ALL' 
                ? 'bg-[#8bc34a] text-white border-[#8bc34a] shadow-md' 
                : 'bg-white text-[#8d99ae] border-[#f0f0f0] hover:border-[#b0bec5]'
              }`}
            >
              <Filter size={14} />
              All Topics
            </button>
            {availableTopics.map((topic) => {
              const Icon = TOPIC_ICONS[topic];
              return (
                <button
                  key={topic}
                  onClick={() => { playSwish(); setSelectedTopic(topic); }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap active:scale-95 ${
                    selectedTopic === topic 
                    ? 'bg-[#8bc34a] text-white border-[#8bc34a] shadow-md' 
                    : 'bg-white text-[#8d99ae] border-[#f0f0f0] hover:border-[#b0bec5]'
                  }`}
                >
                  {Icon && <Icon size={14} />}
                  {topic}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredWords.map((word, idx) => {
          const stats = progress[word.id];
          const level = stats?.level || 0;
          const { icon: StageIcon, color, bg } = getGrowthIcon(level);
          const theme = getTypeTheme(word);
          
          return (
            <button 
              key={word.id} 
              onClick={() => { playClick(); onWordClick(word); }}
              style={{ animationDelay: `${idx * 0.05}s` }}
              className={`island-card-3d bg-white p-6 rounded-[3rem] border-4 border-transparent shadow-[0_15px_30px_-5px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(139,195,74,0.3)] transition-all flex flex-col justify-between group active:translate-y-2 active:shadow-none text-left relative overflow-hidden h-full min-h-[180px]`}
            >
              {/* Unified Pill Header */}
              <div className="flex flex-wrap gap-2 mb-3 relative z-10">
                  <span style={{ backgroundColor: theme.main }} className="px-2.5 py-1 rounded-full text-white text-[9px] font-black uppercase tracking-widest shadow-sm">
                    {getPosLabel(word)}
                  </span>
                  <span style={{ backgroundColor: theme.main }} className="px-2.5 py-1 rounded-full text-white text-[9px] font-black uppercase tracking-widest shadow-sm">
                    {word.level}
                  </span>
                  <span style={{ backgroundColor: theme.main }} className="px-2.5 py-1 rounded-full text-white text-[9px] font-black uppercase tracking-widest shadow-sm">
                    {word.topic}
                  </span>
              </div>

              <div className="relative z-10 flex items-end justify-between mt-1">
                <div className="space-y-1">
                  <h3 className="text-4xl font-black text-[#2e4d4a] group-hover:text-[#4b7d78] transition-colors tracking-tighter flex items-center gap-2">
                    {word.s}
                  </h3>
                  <p className="text-slate-400 font-bold text-lg leading-tight">
                    {t(`vocab.${word.id}.t`, { defaultValue: word.t })}
                  </p>
                </div>
                
                {/* Growth Indicator */}
                <div className={`flex flex-col items-center gap-1 p-2 rounded-2xl ${bg} transition-all`}>
                  <StageIcon size={20} className={`${color} ${level > 1 ? 'pulse-level' : ''}`} />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {filteredWords.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 bg-white/40 rounded-[4rem] border-4 border-dashed border-[#e0d9b4] text-center px-8 relative overflow-hidden">
          {/* Decorative background sprout */}
          <div className="absolute -bottom-10 -right-10 opacity-5 -rotate-12">
            <Sprout size={240} />
          </div>
          
          <div className="bg-white p-6 rounded-full shadow-lg border-4 border-[#8bc34a]/20 mb-8 animate-bounce-slight">
            <Sprout className="text-[#8bc34a]" size={64} />
          </div>
          
          <h3 className="text-2xl md:text-3xl font-black text-[#4b7d78] mb-4 tracking-tight">
            {t('ui.pocket.empty_title', { defaultValue: 'Your pocket is waiting for its first seed.' })}
          </h3>
          
          <p className="text-sm md:text-base font-bold text-[#8d99ae] max-w-sm leading-relaxed">
            {t('ui.pocket.empty_subtitle', { defaultValue: 'Go to the Supply Crate or Start Planting to fill it up!' })}
          </p>

          <div className="mt-8 flex gap-4 opacity-20">
            <Shovel size={24} className="text-[#4b7d78]" />
            <div className="w-px h-6 bg-[#4b7d78]" />
            <Leaf size={24} className="text-[#4b7d78]" />
          </div>
        </div>
      )}
      
      {isModalOpen && (
        <ExpansionModal 
          availableWords={unlearnedExtra}
          onClose={() => setIsModalOpen(false)}
          onAddWords={onAddExtraWords}
          onStudyNow={onStartExtraStudy}
        />
      )}
    </div>
  );
};

export default VocabularyView;
