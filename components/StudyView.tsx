import React, { useState, useCallback, useEffect } from 'react';
import { Word, FeedbackQuality } from '../types';
import { playAudio } from '../utils/audio';
import { getTypeTheme, getPosLabel } from '../utils/theme';
import { useTranslation } from 'react-i18next';
import SummaryView from './SummaryView';
import { 
  playHighChime, 
  playHighWood,
  playLowWood,
  playThud,
  playClick,
  playSwish
} from '../utils/sfx';
import { 
  ChevronLeft, 
  Globe, Ghost, Wind, Smile,
  Volume2, BookOpen, PenTool, FastForward,
  RotateCcw, ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StudyViewProps {
  words: Word[];
  dailyHarvest: Word[];
  onFinish: () => void;
  onFeedback: (wordId: string, quality: FeedbackQuality) => void;
  onLoginRequest: () => void;
  isBlitz?: boolean;
  userStats: any;
  user: any;
}

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
      <div className="p-5 rounded-[2rem] border-2 border-dashed border-slate-200 mb-6 bg-white/60">
        <p className="text-[#2d4a47] font-bold text-sm italic leading-relaxed">{displayTip}</p>
      </div>
    );
  }

  const labels = word.type === 'verb' 
    ? [t('ui.grammar.yo'), t('ui.grammar.tu'), t('ui.grammar.el'), t('ui.grammar.nos'), t('ui.grammar.vos'), t('ui.grammar.ellos')] 
    : [t('ui.grammar.sing'), t('ui.grammar.plur')];

  return (
    <div className="grid grid-cols-2 gap-2.5 mb-8">
      {labels.map((label, i) => (
        <div key={label} className="bg-white/80 p-3 rounded-2xl border border-slate-100 flex flex-col items-center shadow-sm">
          <span className="text-[7px] font-bold text-slate-400 uppercase mb-1">{label}</span>
          <span className="text-sm font-black text-[#2d4a47]">{renderFormText(conjugationList[i])}</span>
        </div>
      ))}
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
      regex.test(part) ? <span key={i} style={{ color: theme.main }} className="font-black">{part}</span> : <span key={i}>{part}</span>
    );
  };
  return (
    <div className="bg-[#e3f2fd] rounded-[2.5rem] p-6 relative shadow-sm space-y-6">
      <div className="flex items-center gap-2 mb-2"><BookOpen size={14} className="text-[#0277bd]" /><span className="text-[9px] font-black text-[#0277bd]/50 uppercase tracking-widest">{t('ui.study.usage_examples')}</span></div>
      {word.examples.map((ex, i) => (
        <div key={i} className="text-left w-full">
           <p className="text-[#01579b] text-lg font-black leading-snug italic italic">"{highlightWord(ex.txt)}"</p>
           <p className="text-[#0277bd]/60 text-xs font-bold uppercase mt-1">{ex.eng}</p>
        </div>
      ))}
    </div>
  );
};

const StudyView: React.FC<StudyViewProps> = ({ words, dailyHarvest, onFinish, onFeedback, onLoginRequest, isBlitz = false, userStats, user }) => {
  const { t } = useTranslation();
  const [queue, setQueue] = useState<Word[]>(words);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSummaryView, setIsSummaryView] = useState(false);
  const [isReverseMode, setIsReverseMode] = useState(false);
  const [currentRating, setCurrentRating] = useState<FeedbackQuality | null>(null);
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | 'fast-right' | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showEnterAnim, setShowEnterAnim] = useState(true);

  const word = queue[currentIndex];
  // Calculate progress with a minimum visibility
  const progressPercent = Math.max(5, (currentIndex / queue.length) * 100);
  const theme = word ? getTypeTheme(word) : { main: '#4b7d78', light: '#f7f9e4', text: '#2d4a47' };

  const handleNext = useCallback(() => {
    if (currentIndex < queue.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
      setExitDirection(null);
      setCurrentRating(null);
      setShowEnterAnim(true);
      setTimeout(() => setIsTransitioning(false), 100);
    } else {
      setIsSummaryView(true);
    }
  }, [currentIndex, queue.length]);

  const triggerExit = (direction: 'left' | 'right' | 'fast-right') => {
    setIsTransitioning(true);
    setExitDirection(direction);
    const duration = direction === 'fast-right' ? 350 : 500;
    setTimeout(handleNext, duration);
  };

  const handleRating = (quality: FeedbackQuality) => {
    if (isTransitioning) return;
    
    // CRITICAL: 只要点击了按钮，就关闭入场动画，释放 transform 控制权
    setShowEnterAnim(false);

    if (quality === 'easy') {
      onFeedback(word.id, 'easy');
      playHighChime(); 
      confetti({ particleCount: 20, spread: 50, origin: { x: 0.5, y: 0.5 }, colors: [theme.main, '#ffa600'] });
      triggerExit('fast-right');
      return;
    }

    playSwish();
    setCurrentRating(quality);
    setIsFlipped(true);
  };

  const handleContinue = () => {
    if (isTransitioning || !currentRating) return;

    const quality = currentRating;
    onFeedback(word.id, quality);

    if (quality === 'forgot' || quality === 'hard') {
       if (quality === 'forgot') playThud(); else playLowWood();
       setQueue(prev => [...prev, word]);
       triggerExit('left');
    } else {
       playHighWood();
       triggerExit('right');
    }
  };

  useEffect(() => {
    if (isFlipped && word) playAudio(word.s);
  }, [isFlipped, word]);

  if (isSummaryView) {
    return <SummaryView words={queue} dailyHarvest={dailyHarvest} totalLearned={userStats?.total_words_learned || 0} streak={userStats?.current_streak || 1} user={user} onFinish={onFinish} onLoginRequest={onLoginRequest} />;
  }
  if (!word) return null;

  return (
    <div className={`flex-1 flex flex-col max-w-2xl mx-auto w-full h-[100dvh] overflow-hidden bg-[#f7f9e4] relative ${isTransitioning ? 'is-transitioning' : ''}`}>
      <div className="absolute inset-0 opacity-20 transition-colors duration-700" style={{ backgroundColor: theme.light }} />
      
      <div className="px-6 pt-6 pb-2 shrink-0 z-20">
        <div className="flex justify-between items-center mb-3 gap-3">
          <button onClick={() => { playClick(); onFinish(); }} className="p-2.5 bg-white rounded-xl shadow-sm text-[#4b7d78] bubble-button"><ChevronLeft size={18} strokeWidth={3} /></button>
          <div className="flex-1 h-3 bg-white/50 rounded-full overflow-hidden border border-white p-[2px]">
            <div 
              className="h-full rounded-full transition-all duration-700 cubic-bezier(0.68, -0.55, 0.265, 1.55)" 
              style={{ width: `${progressPercent}%`, backgroundColor: theme.main }} 
            />
          </div>
          <button onClick={() => setIsReverseMode(!isReverseMode)} className={`p-2.5 rounded-xl border transition-all bubble-button ${isReverseMode ? 'text-white border-transparent' : 'bg-white text-[#4b7d78] border-white'}`} style={isReverseMode ? { backgroundColor: theme.main } : {}}><Globe size={18} /></button>
        </div>
      </div>

      <div className="flex-1 px-4 py-1 card-perspective relative min-h-0 mb-4 z-10">
        <div className={`card-inner h-full 
          ${isFlipped ? 'is-flipped' : ''} 
          ${showEnterAnim && !exitDirection ? 'card-enter' : ''} 
          ${exitDirection === 'left' ? 'card-exit-left' : ''} 
          ${exitDirection === 'right' ? 'card-exit-right' : ''} 
          ${exitDirection === 'fast-right' ? 'card-exit-fast-right' : ''}
        `}>
          
          <div className="card-face card-face-front p-8 flex flex-col items-center justify-between h-full" style={{ backgroundColor: theme.light }}>
            <div className="flex-1 flex flex-col items-center justify-center text-center w-full">
              <span style={{ backgroundColor: theme.main }} className="px-3 py-1 rounded-full text-white text-[10px] font-black uppercase tracking-widest mb-6 shadow-sm">{getPosLabel(word)}</span>
              <h2 className="font-black text-[#2d4a47] leading-tight text-[clamp(2.5rem,12vw,4rem)] tracking-tighter transition-all duration-500">{isReverseMode ? t(`vocab.${word.id}.t`, { defaultValue: word.t }) : word.s}</h2>
            </div>
            
            <div className="w-full space-y-4 pt-6 shrink-0">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'forgot', label: t('ui.study.forgot'), icon: Ghost, color: '#94a3b8' },
                  { id: 'hard', label: t('ui.study.hard'), icon: Wind, color: '#f97316' },
                  { id: 'good', label: t('ui.study.good'), icon: Smile, color: theme.main },
                ].map((btn) => (
                  <button key={btn.id} onClick={() => handleRating(btn.id as FeedbackQuality)} className="bubble-button py-4 flex flex-col items-center gap-2 rounded-[2rem] bg-white shadow-sm hover:bg-[#fafafa] group hover:-translate-y-1">
                    <btn.icon size={22} className="button-icon group-hover:scale-110 transition-transform" style={{ color: btn.color }} />
                    <span className="text-[10px] font-black uppercase text-slate-500">{btn.label}</span>
                  </button>
                ))}
              </div>
              <button onClick={() => handleRating('easy')} style={{ backgroundColor: theme.main }} className="bubble-button w-full py-5 rounded-[2.5rem] text-white font-black text-xl shadow-[0_8px_0_rgba(0,0,0,0.1)] flex items-center justify-center gap-3 border-4 border-white group hover:scale-[1.02]"><FastForward size={24} className="button-icon group-hover:translate-x-1 transition-transform" /><span>{t('ui.study.perfect')}</span></button>
            </div>
          </div>

          <div className="card-face card-face-back flex flex-col h-full bg-white">
            <div className="shrink-0 p-6 px-8 border-b border-slate-50 flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <span style={{ color: theme.main }} className="text-[9px] font-black uppercase tracking-widest block mb-1">{getPosLabel(word)}</span>
                <h3 className="text-3xl font-black text-[#2d4a47] tracking-tighter leading-none truncate">{word.s}</h3>
                <p style={{ color: theme.main }} className="text-xl font-bold italic opacity-80 mt-1 truncate">{t(`vocab.${word.id}.t`, { defaultValue: word.t })}</p>
              </div>
              <button onClick={() => playAudio(word.s)} style={{ backgroundColor: theme.light, color: theme.main }} className="shrink-0 p-3 rounded-2xl shadow-sm border border-white bubble-button"><Volume2 size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 no-scrollbar bg-white">
              <GrammarPocket word={word} />
              <UsageExamples word={word} />
            </div>
            <div className="shrink-0 p-6 px-8 bg-white border-t border-slate-50 space-y-3 z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between">
                <div className="flex gap-4">
                  {['forgot', 'hard', 'good'].map(id => (
                    <button key={id} onClick={() => setCurrentRating(id as FeedbackQuality)} className={`transition-all bubble-button ${currentRating === id ? 'scale-125 opacity-100' : 'opacity-20'}`}>
                      {id === 'forgot' ? <Ghost size={20} color="#94a3b8" /> : id === 'hard' ? <Wind size={20} color="#f97316" /> : <Smile size={20} color={theme.main} />}
                    </button>
                  ))}
                </div>
                <button onClick={() => setIsFlipped(false)} className="text-[9px] font-black text-slate-300 uppercase flex items-center gap-1 hover:text-slate-400 bubble-button"><RotateCcw size={12} /> BACK</button>
              </div>
              <button onClick={handleContinue} disabled={!currentRating} style={{ backgroundColor: theme.main }} className="bubble-button w-full py-4 rounded-[2.5rem] text-white font-black text-lg shadow-[0_6px_0_rgba(0,0,0,0.1)] flex items-center justify-center gap-2 border-2 border-white/20 disabled:opacity-50"><span>CONTINUE</span><ArrowRight size={20} /></button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudyView;