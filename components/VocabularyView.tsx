
import React, { useState } from 'react';
import { Word, ProgressMap } from '../types';
import { Search, ShoppingBag, CircleDot, Sprout, Flower2, TreeDeciduous, ChevronRight } from 'lucide-react';
import WordExpansionPack from './WordExpansionPack';
import ExpansionModal from './ExpansionModal';
import { EXTRA_CANDIDATES } from '../constants';
import { playClick } from '../utils/sfx';
import { useTranslation } from 'react-i18next';

interface VocabularyViewProps {
  words: Word[];
  progress: ProgressMap;
  onWordClick: (word: Word) => void;
  onAddExtraWords: (words: Word[]) => void;
  onStartExtraStudy: (words: Word[]) => void;
}

const VocabularyView: React.FC<VocabularyViewProps> = ({ words, progress, onWordClick, onAddExtraWords, onStartExtraStudy }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredWords = words.filter(w => 
    w.s.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t(`vocab.${w.id}.t`, { defaultValue: w.t }).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unlearnedExtra = EXTRA_CANDIDATES.filter(w => !progress[w.id]);

  const getGrowthIcon = (level: number) => {
    if (level <= 1) return { icon: CircleDot, color: 'text-slate-400', bg: 'bg-slate-50', label: 'Seed' };
    if (level <= 3) return { icon: Sprout, color: 'text-emerald-500', bg: 'bg-emerald-50', label: 'Sprout' };
    if (level <= 5) return { icon: Flower2, color: 'text-orange-400', bg: 'bg-orange-50', label: 'Bloom' };
    return { icon: TreeDeciduous, color: 'text-green-700', bg: 'bg-green-50', label: 'Tree' };
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'verb': return 'border-rose-200 bg-rose-50/30 text-rose-600 shadow-rose-100';
      case 'noun': return 'border-sky-200 bg-sky-50/30 text-sky-600 shadow-sky-100';
      case 'adj': return 'border-amber-200 bg-amber-50/30 text-amber-600 shadow-amber-100';
      default: return 'border-purple-200 bg-purple-50/30 text-purple-600 shadow-purple-100';
    }
  };

  return (
    <div className="space-y-10 animate-fadeIn pb-24 md:pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="bg-[#ffb74d] p-5 rounded-[2.5rem] shadow-[0_10px_0_#e67e22] border-4 border-white animate-bounce-slight">
            <ShoppingBag className="text-white fill-current" size={32} />
          </div>
          <div>
            <h2 className="text-5xl font-black text-[#4b7d78] drop-shadow-sm">{t('ui.nav.pocket')}</h2>
            <p className="text-[#8d99ae] font-bold text-sm uppercase tracking-widest mt-1">
              {words.length} {t('ui.dashboard.recently_planted')}
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
          placeholder={t('ui.actions.restore')} 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-20 pr-8 py-6 bg-white border-4 border-[#e0d9b4] rounded-[3rem] w-full shadow-[0_10px_0_rgba(224,217,180,0.4)] focus:outline-none focus:ring-8 focus:ring-[#8bc34a]/20 transition-all font-black text-[#4b7d78] text-xl placeholder:text-slate-300"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredWords.map((word, idx) => {
          const stats = progress[word.id];
          const level = stats?.level || 0;
          const { icon: StageIcon, color, bg, label } = getGrowthIcon(level);
          const typeStyle = getTypeStyle(word.type);
          
          return (
            <button 
              key={word.id} 
              onClick={() => { playClick(); onWordClick(word); }}
              style={{ animationDelay: `${idx * 0.05}s` }}
              className={`island-card-3d bg-white p-6 rounded-[3rem] border-4 border-transparent shadow-[0_15px_30px_-5px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(139,195,74,0.3)] transition-all flex flex-col justify-between group active:translate-y-2 active:shadow-none text-left relative overflow-hidden h-full min-h-[160px]`}
            >
              {/* 类型背景装饰 */}
              <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 ${typeStyle.split(' ')[1]}`}></div>

              <div className="relative z-10 flex justify-between items-start mb-4">
                <div className={`px-4 py-1.5 rounded-full border-2 font-black text-[10px] uppercase tracking-widest ${typeStyle}`}>
                  {word.type}
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl ${bg} ${color} transition-colors group-hover:scale-105`}>
                  <StageIcon size={14} className={level > 1 ? 'pulse-level' : ''} />
                  <span className="text-[10px] font-black uppercase tracking-tighter">{label}</span>
                </div>
              </div>

              <div className="relative z-10 flex items-end justify-between">
                <div className="space-y-1">
                  <h3 className="text-4xl font-black text-[#2e4d4a] group-hover:text-[#4b7d78] transition-colors tracking-tighter flex items-center gap-2">
                    {word.s}
                  </h3>
                  <p className="text-slate-400 font-bold text-lg leading-tight">
                    {t(`vocab.${word.id}.t`, { defaultValue: word.t })}
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl group-hover:bg-[#8bc34a] group-hover:text-white transition-all transform group-hover:translate-x-1">
                  <ChevronRight size={20} strokeWidth={3} />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default VocabularyView;
