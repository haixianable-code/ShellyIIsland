
import React, { useState, useCallback, useEffect } from 'react';
import { Word, FeedbackQuality } from '../types';
import { playAudio } from '../utils/audio';
import { getTypeTheme, getPosLabel } from '../utils/theme';
import { useTranslation } from 'react-i18next';
import SummaryView from './SummaryView';
import { 
  playSwish, 
  playHighChime, 
  playHighWood,
  playLowWood,
  playThud,
  playClick
} from '../utils/sfx';
import { 
  ChevronLeft, 
  ArrowRight, Globe, Ghost, Wind, Smile,
  Volume2, BookOpen, PenTool, Map, FastForward, Zap,
  Heart, RotateCcw, Bookmark, Leaf, Star
} from 'lucide-react';
import confetti from 'canvas-confetti';

const GrammarPocket: React.FC<{ word: Word }> = ({ word }) => {
  const { t } = useTranslation();
  const theme = getTypeTheme(word);
  const conjugationList = word.forms ? word.forms.split(', ') : [];
  const displayTip = t(`vocab.${word.id}.tip`, { defaultValue: word.grammarTip });

  const renderFormText = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\[.*?\])/g);
    return parts.map((part, idx) => 
      part.startsWith('[') ? (
        <span key={idx} style={{ color: theme.main }} className="font-black underline decoration-2 underline-offset-2">
          {part.slice(1, -1)}
        </span>
      ) : (
        <span key={idx} className="text-[#2d4a47]">{part}</span>
      )
    );
  };

  if (word.type === 'misc' || !word.forms) {
    return (
      <div className="p-5 rounded-[2.5rem] border-2 border-dashed border-slate-200 mb-8 bg-white/60">
        <p className="text-[#2d4a47] font-bold text-sm italic leading-relaxed">
          {displayTip}
        </p>
      </div>
    );
  }

  const labels = word.type === 'verb' 
    ? [t('ui.grammar.yo'), t('ui.grammar.tu'), t('ui.grammar.el'), t('ui.grammar.nos'), t('ui.grammar.vos'), t('ui.grammar.ellos')] 
    : word.type === 'noun' 
      ? [t('ui.grammar.sing'), t('ui.grammar.plur')] 
      : [t('ui.grammar.masc'), t('ui.grammar.fem'), t('ui.grammar.masc_pl'), t('ui.grammar.fem_pl')];

  return (
    <div className="space-y-3 mb-10">
      <div className="flex items-center gap-2 px-1">
        <PenTool size={11} className="text-[#2d4a47]/40" />
        <span className="text-[8px] font-black text-[#2d4a47]/40 uppercase tracking-widest">{t('ui.study.grammar_pocket')}</span>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {labels.map((label, i) => (
          <div key={label} className="bg-white/80 p-3 rounded-2xl border border-slate-100 flex flex-col items-center shadow-sm">
            <span className="text-[7px] font-bold text-slate-400 uppercase leading-none mb-1">{label}</span>
            <span className="text-sm font-bold text-[#2d4a47]">
              {renderFormText(conjugationList[i])}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// 单词拆解（便利贴样式）
const VocabNotes: React.FC<{ word: Word }> = ({ word }) => {
  const { t } = useTranslation();
  if (!word.nounNotes || word.nounNotes === 'Function Word') return null;

  return (
    <div className="mt-8 mb-4 px-2">
      <div className="relative rotate-1 hover:rotate-0 transition-transform duration-500">
        <div className="absolute inset-0 bg-amber-200/20 blur-xl -z-10 translate-y-2"></div>
        <div className="bg-[#fff9c4] p-6 rounded-[2rem] shadow-sm border-b-4 border-amber-200/50 relative overflow-hidden group/note">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-8 bg-white/40 backdrop-blur-md border border-white/20 -rotate-2 shadow-sm rounded-sm z-20"></div>
          <div className="flex items-center gap-2 mb-3 relative z-10">
            <Map size={14} className="text-amber-600" />
            <span className="text-[9px] font-black text-amber-700/40 uppercase tracking-[0.2em]">{t('ui.study.vocab_note')}</span>
          </div>
          <p className="text-amber-900 text-base font-bold leading-relaxed relative z-10 handwritten">
            {t(`vocab.${word.id}.notes`, { defaultValue: word.nounNotes })}
          </p>
          <Leaf size={100} className="absolute -bottom-12 -right-12 text-amber-500/10 -rotate-12 group-hover/note:rotate-0 transition-transform duration-700" />
        </div>
      </div>
    </div>
  );
};

const UsageExamples: React.FC<{ word: Word }> = ({ word }) => {
  const { t } = useTranslation();
  const theme = getTypeTheme(word);

  const highlightWord = (text: string) => {
    const searchWord = word.s.toLowerCase();
    const regex = new RegExp(`(${searchWord}|${searchWord.substring(0, 3)}[a-zñáéíóú]*)`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, i) => 
      regex.test(part) ? (
        <span key={i} style={{ color: theme.main }} className="font-black decoration-wavy decoration-current/30 underline underline-offset-4">
          {part}
        </span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  return (
    <div className="relative z-10">
      <div className="flex items-center gap-2 px-1 mb-6">
        <BookOpen size={11} className="text-[#2d4a47]/40" />
        <span className="text-[8px] font-black text-[#2d4a47]/40 uppercase tracking-widest">{t('ui.study.usage_examples')}</span>
      </div>
      <div className="relative py-2">
        <div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px)', backgroundSize: '100% 3.5rem' }}></div>
        <div className="space-y-12">
          {word.examples.map((ex, i) => (
            <div key={i} className="group/ex relative pl-8">
              <Bookmark size={14} className="absolute left-0 top-1.5 text-sky-200 group-hover/ex:text-sky-400 transition-colors" />
              <div className="space-y-1">
                 <p className="text-slate-800 text-xl font-black leading-snug tracking-tight italic transition-colors group-hover/ex:text-sky-900">
                   {highlightWord(ex.txt)}
                 </p>
                 <p className="handwritten text-slate-400 text-base leading-relaxed">
                   {ex.eng}
                 </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StudyView: React.FC<any> = ({ words, onFinish, onFeedback, onLoginRequest, isBlitz = false, userStats, user }) => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [ritualClass, setRitualClass] = useState('');
  const [isSummaryView, setIsSummaryView] = useState(false);
  const [isReverseMode, setIsReverseMode] = useState(false);
  const [currentRating, setCurrentRating] = useState<FeedbackQuality | null>(null);
  
  const word = words[currentIndex];
  const theme = word ? getTypeTheme(word) : { main: '#4b7d78', light: '#f7f9e4', text: '#2d4a47' };
  const displayTranslation = word ? t(`vocab.${word.id}.t`, { defaultValue: word.t }) : '';
  const progressPercent = (currentIndex / words.length) * 100;

  const handleNext = useCallback(() => {
    if (currentIndex < words.length - 1) {
      setIsFlipped(false);
      setRitualClass('');
      setCurrentRating(null);
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 300);
    } else {
      setIsSummaryView(true);
    }
  }, [currentIndex, words.length]);

  const handleRating = (quality: FeedbackQuality) => {
    setCurrentRating(quality);
    if (quality === 'easy') {
      onFeedback(word.id, 'easy');
      playHighChime(); 
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 }, colors: [theme.main, '#ffa600'] });
      setRitualClass('ritual-easy');
      setTimeout(handleNext, 400);
    } else {
      onFeedback(word.id, quality);
      if (quality === 'forgot') playThud();
      else if (quality === 'hard') playLowWood();
      else playHighWood();
      setIsFlipped(true);
    }
  };

  useEffect(() => {
    if (isFlipped && word) playAudio(word.s);
  }, [isFlipped, word]);

  if (isSummaryView) return <SummaryView words={words} totalLearned={userStats?.total_words_learned || 0} streak={userStats?.current_streak || 1} user={user} onFinish={onFinish} onLoginRequest={onLoginRequest} />;
  if (!word) return null;

  return (
    <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full h-[100dvh] overflow-hidden bg-[#f7f9e4] relative">
      <div className="absolute inset-0 opacity-30 transition-colors duration-700" style={{ backgroundColor: theme.light }} />
      <div className="px-6 pt-6 pb-2 shrink-0 z-20">
        <div className="flex justify-between items-center mb-3">
          <button onClick={() => { playClick(); onFinish(); }} className="p-2.5 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm text-[#4b7d78] active:scale-90 transition-all border border-white">
            <ChevronLeft className="w-4 h-4" strokeWidth={3} />
          </button>
          <div className="flex-1 mx-4 h-1.5 bg-white/50 rounded-full overflow-hidden relative border border-white">
            <div className="h-full transition-all duration-500 rounded-full" style={{ width: `${progressPercent}%`, backgroundColor: theme.main }} />
          </div>
          <button onClick={() => { playClick(); setIsReverseMode(!isReverseMode); }} className={`p-2.5 rounded-xl border transition-all ${isReverseMode ? 'text-white border-transparent' : 'bg-white/80 backdrop-blur-sm text-[#4b7d78] border-white'}`} style={isReverseMode ? { backgroundColor: theme.main } : {}}>
             <Globe className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex-1 px-4 py-1 card-perspective relative min-h-0 mb-4 z-10">
        <div className={`card-inner h-full ${isFlipped ? 'is-flipped' : ''} ${ritualClass}`}>
          <div className="card-face card-face-front p-8 flex flex-col items-center justify-between h-full" style={{ backgroundColor: theme.light }}>
            <div className="flex-1 flex flex-col items-center justify-center text-center w-full">
              <div className="flex flex-col items-center gap-2 mb-8">
                 <span style={{ backgroundColor: theme.main }} className="px-5 py-1.5 rounded-full text-white text-[11px] font-black uppercase tracking-[0.2em] shadow-sm">
                   {getPosLabel(word)}
                 </span>
                 {word.reg === false && (
                   <span className="bg-white/60 text-rose-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 border border-rose-100">
                     <Zap size={10} fill="currentColor" /> {t('ui.study.hard_mode')}
                   </span>
                 )}
              </div>
              <h2 className="font-black text-[#2d4a47] leading-tight text-[clamp(2.5rem,12vw,5rem)] tracking-tighter transition-all duration-500 break-words w-full">
                 {isReverseMode ? displayTranslation : word.s}
              </h2>
            </div>
            <div className="w-full space-y-4 pt-6 shrink-0">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'forgot', label: t('ui.study.forgot'), icon: Ghost, color: '#94a3b8' },
                  { id: 'hard', label: t('ui.study.hard'), icon: Wind, color: '#f97316' },
                  { id: 'good', label: t('ui.study.good'), icon: Smile, color: theme.main },
                ].map((btn) => (
                  <button key={btn.id} onClick={() => handleRating(btn.id as FeedbackQuality)} className="py-4 flex flex-col items-center gap-2 rounded-[2rem] bg-white/90 backdrop-blur-sm border border-white shadow-sm active:translate-y-1 transition-all">
                    <btn.icon size={22} style={{ color: btn.color }} />
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-tighter">{btn.label}</span>
                  </button>
                ))}
              </div>
              <button onClick={() => handleRating('easy')} style={{ backgroundColor: theme.main }} className="w-full py-5 rounded-[2.5rem] text-white font-black text-xl shadow-[0_8px_0_rgba(0,0,0,0.1)] active:translate-y-1 active:shadow-none flex items-center justify-center gap-3 transition-all border-4 border-white">
                <FastForward size={24} />
                <span>{t('ui.study.perfect')}</span>
              </button>
            </div>
          </div>
          <div className="card-face card-face-back flex flex-col h-full overflow-hidden bg-white relative">
            <div className="absolute top-0 left-4 bottom-0 flex flex-col justify-around py-16 opacity-[0.05] pointer-events-none z-0">
               {[...Array(6)].map((_, i) => <div key={i} className="w-2.5 h-2.5 rounded-full bg-black shadow-inner"></div>)}
            </div>
            <div className="shrink-0 p-5 px-8 border-b border-slate-50 flex items-center justify-between bg-white z-10">
              <div className="flex-1 min-w-0 pr-4">
                <span style={{ color: theme.main }} className="text-[9px] font-black uppercase tracking-widest block mb-0.5">{getPosLabel(word)}</span>
                <div className="flex items-baseline gap-2 overflow-hidden">
                  <h3 className="text-3xl font-black text-[#2d4a47] tracking-tighter truncate">{word.s}</h3>
                  <span style={{ color: theme.main }} className="text-sm font-bold italic truncate opacity-70">{displayTranslation}</span>
                </div>
              </div>
              <button onClick={() => playAudio(word.s)} style={{ backgroundColor: theme.light, color: theme.main }} className="shrink-0 p-3 rounded-2xl shadow-sm border border-white active:scale-95 transition-all"><Volume2 className="w-6 h-6" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 px-9 no-scrollbar min-h-0 bg-[#fbfcf0]/30 relative">
              <GrammarPocket word={word} />
              <div className="relative"><UsageExamples word={word} /><VocabNotes word={word} /></div>
              <div className="h-20 flex flex-col items-center justify-center opacity-[0.03] grayscale mt-8"><div className="h-px w-full border-t border-dashed border-black mb-4"></div><Star size={12} /></div>
            </div>
            <div className="shrink-0 p-5 px-8 pt-3 bg-white border-t border-slate-50 space-y-3 z-10">
              <div className="flex items-center justify-between px-2">
                <div className="flex gap-4">
                  {[
                    { id: 'forgot', icon: Ghost, color: '#94a3b8' },
                    { id: 'hard', icon: Wind, color: '#f97316' },
                    { id: 'good', icon: Smile, color: theme.main },
                  ].map((btn) => (
                    <button key={btn.id} onClick={() => handleRating(btn.id as FeedbackQuality)} className={`p-1.5 rounded-lg transition-all ${currentRating === btn.id ? 'bg-slate-100 ring-2 ring-current' : 'opacity-40 hover:opacity-100'}`} style={{ color: btn.color }}><btn.icon size={16} /></button>
                  ))}
                </div>
                <button onClick={() => setIsFlipped(false)} className="text-[8px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1 hover:text-slate-400"><RotateCcw size={10} /> 重新评估</button>
              </div>
              <button onClick={() => { playHighWood(); handleNext(); }} style={{ backgroundColor: theme.main }} className="w-full py-4 rounded-[2.5rem] text-white font-black text-lg shadow-[0_6px_0_rgba(0,0,0,0.1)] active:translate-y-1 active:shadow-none flex flex-col items-center justify-center transition-all border-2 border-white/20">
                <div className="flex items-center gap-2"><span>继续探索</span><ArrowRight size={18} /></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyView;
