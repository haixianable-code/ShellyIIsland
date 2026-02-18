
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
  playSwish,
  playShaker
} from '../utils/sfx';
import { 
  ChevronLeft, 
  Globe, Ghost, Wind, Smile,
  Volume2, BookOpen, FastForward,
  RotateCcw, ArrowRight,
  History, Sun, Rocket
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

type TimeState = 'past' | 'present' | 'future';

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
      <div className="p-5 rounded-[2rem] border-2 border-dashed border-slate-200 mb-6 bg-white/60" role="note">
        <p className="text-[#2d4a47] font-bold text-sm italic leading-relaxed">{displayTip}</p>
      </div>
    );
  }

  const labels = word.type === 'verb' 
    ? [t('ui.grammar.yo'), t('ui.grammar.tu'), t('ui.grammar.el'), t('ui.grammar.nos'), t('ui.grammar.vos'), t('ui.grammar.ellos')] 
    : [t('ui.grammar.sing'), t('ui.grammar.plur')];

  return (
    <div className="grid grid-cols-2 gap-2.5 mb-8" aria-label="Word conjugations">
      {labels.map((label, i) => (
        <div key={label} className="bg-white/80 p-3 rounded-2xl border border-slate-100 flex flex-col items-center shadow-sm">
          <span className="text-[7px] font-bold text-slate-400 uppercase mb-1">{label}</span>
          <span className="text-sm font-black text-[#2d4a47]">{renderFormText(conjugationList[i])}</span>
        </div>
      ))}
    </div>
  );
};

const UsageExamples: React.FC<{ word: Word, timeState: TimeState }> = ({ word, timeState }) => {
  const { t } = useTranslation();
  const theme = getTypeTheme(word);
  
  // Filter examples based on Time Machine state
  const filteredExamples = word.examples.filter(ex => {
      if (timeState === 'present') return !ex.tense || ex.tense === 'present';
      return ex.tense === timeState;
  });

  const displayExamples = filteredExamples.length > 0 ? filteredExamples : word.examples.filter(ex => !ex.tense || ex.tense === 'present');

  const highlightWord = (text: string) => {
    const searchWord = word.s.split(' ')[0].toLowerCase(); 
    const regex = new RegExp(`(${searchWord}|${searchWord.substring(0, 3)}[a-zñáéíóú]*)`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) => 
      regex.test(part) ? <span key={i} style={{ color: theme.main }} className="font-black underline decoration-2 underline-offset-2">{part}</span> : <span key={i}>{part}</span>
    );
  };

  return (
    <div className={`rounded-[2.5rem] p-6 relative shadow-sm space-y-6 transition-colors duration-500 ${
        timeState === 'past' ? 'bg-[#efebe9]' : 
        timeState === 'future' ? 'bg-[#e3f2fd]' : 'bg-[#f1f8e9]'
    }`} role="complementary">
      <div className="flex items-center gap-2 mb-2" aria-hidden="true">
          <BookOpen size={14} className="opacity-50" />
          <span className="text-[9px] font-black opacity-50 uppercase tracking-widest">{t('ui.study.usage_examples')}</span>
          {timeState !== 'present' && (
              <span className="ml-auto text-[8px] font-black uppercase px-2 py-0.5 rounded-full bg-black/5">
                  {timeState}
              </span>
          )}
      </div>
      
      {displayExamples.length > 0 ? (
          displayExamples.map((ex, i) => (
            <div key={i} className="text-left w-full animate-fadeIn">
            <p className="text-[#2d4a47] text-lg font-black leading-snug italic">"{highlightWord(ex.txt)}"</p>
            <p className="text-[#2d4a47]/60 text-xs font-bold uppercase mt-1">{ex.eng}</p>
            </div>
        ))
      ) : (
          <div className="text-center py-4 opacity-40 text-xs font-bold">
              No data for this timeline.
          </div>
      )}
    </div>
  );
};

const TimeMachine: React.FC<{ 
    state: TimeState, 
    onChange: (s: TimeState) => void,
    available: boolean
}> = ({ state, onChange, available }) => {
    if (!available) return null;

    return (
        <div className="flex items-center justify-center gap-2 mb-6 animate-slideUp">
            <button 
                onClick={(e) => { e.stopPropagation(); playShaker(); onChange('past'); }}
                className={`p-3 rounded-2xl border-2 transition-all ${state === 'past' ? 'bg-[#795548] text-white border-[#795548] shadow-md scale-110' : 'bg-white border-[#d7ccc8] text-[#a1887f] hover:bg-[#efebe9]'}`}
            >
                <History size={20} />
            </button>
            
            <div className="h-1.5 w-16 bg-slate-200 rounded-full relative overflow-hidden">
                <div 
                    className={`absolute top-0 bottom-0 w-1/3 bg-slate-400 rounded-full transition-all duration-300 ${
                        state === 'past' ? 'left-0 bg-[#795548]' : 
                        state === 'future' ? 'left-2/3 bg-[#2196f3]' : 'left-1/3 bg-[#ffa600]'
                    }`} 
                />
            </div>

            <button 
                onClick={(e) => { e.stopPropagation(); playClick(); onChange('present'); }}
                className={`p-3 rounded-2xl border-2 transition-all ${state === 'present' ? 'bg-[#ffa600] text-white border-[#ffa600] shadow-md scale-110' : 'bg-white border-[#ffe0b2] text-[#ffcc80] hover:bg-[#fff3e0]'}`}
            >
                <Sun size={20} />
            </button>

            <div className="h-1.5 w-16 bg-slate-200 rounded-full relative overflow-hidden">
                 <div 
                    className={`absolute top-0 bottom-0 w-1/3 bg-slate-400 rounded-full transition-all duration-300 ${
                        state === 'past' ? 'left-0 bg-[#795548]' : 
                        state === 'future' ? 'left-2/3 bg-[#2196f3]' : 'left-1/3 bg-[#ffa600]'
                    }`} 
                />
            </div>

            <button 
                onClick={(e) => { e.stopPropagation(); playSwish(); onChange('future'); }}
                className={`p-3 rounded-2xl border-2 transition-all ${state === 'future' ? 'bg-[#2196f3] text-white border-[#2196f3] shadow-md scale-110' : 'bg-white border-[#bbdefb] text-[#90caf9] hover:bg-[#e3f2fd]'}`}
            >
                <Rocket size={20} />
            </button>
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
  
  const [timeState, setTimeState] = useState<TimeState>('present');

  const word = queue[currentIndex];
  const progressPercent = Math.max(5, (currentIndex / queue.length) * 100);
  const theme = word ? getTypeTheme(word) : { main: '#4b7d78', light: '#f7f9e4', text: '#2d4a47' };

  useEffect(() => {
      setTimeState('present');
  }, [currentIndex]);

  const handleCardClick = () => {
    if (isFlipped) return;
    playSwish();
    setIsFlipped(true);
  };

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
    setShowEnterAnim(false);

    if (quality === 'easy') {
      onFeedback(word.id, 'easy');
      playHighChime(); 
      confetti({ particleCount: 20, spread: 50, origin: { x: 0.5, y: 0.5 }, colors: [theme.main, '#ffa600'] });
      triggerExit('fast-right');
      return;
    }

    try { playSwish(); } catch(e) {}
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

  const speakCurrent = () => {
      let textToSpeak = word.s;
      if (timeState === 'past' && word.tense_forms?.past) textToSpeak = word.tense_forms.past;
      if (timeState === 'future' && word.tense_forms?.future) textToSpeak = word.tense_forms.future;
      playAudio(textToSpeak);
  };

  useEffect(() => {
    if (isFlipped && word) speakCurrent();
  }, [isFlipped, word, timeState]);

  // Prevent button clicks from propagating to card click handler
  const stopProp = (e: React.SyntheticEvent) => e.stopPropagation();

  if (isSummaryView) {
    return <SummaryView words={queue} dailyHarvest={dailyHarvest} totalLearned={userStats?.total_words_learned || 0} streak={userStats?.current_streak || 1} user={user} onFinish={onFinish} onLoginRequest={onLoginRequest} />;
  }
  if (!word) return null;

  const hasTimeMachine = !!word.tense_forms;
  const currentWordDisplay = timeState === 'past' ? (word.tense_forms?.past || word.s) : 
                             timeState === 'future' ? (word.tense_forms?.future || word.s) : 
                             word.s;

  const bgStyle = timeState === 'past' ? { backgroundColor: '#d7ccc8' } :
                  timeState === 'future' ? { backgroundColor: '#bbdefb' } :
                  { backgroundColor: theme.light };

  return (
    <main className={`flex-1 flex flex-col max-w-2xl mx-auto w-full h-[100dvh] overflow-hidden relative transition-colors duration-500 ${isTransitioning ? 'is-transitioning' : ''}`} style={{ backgroundColor: timeState === 'past' ? '#efebe9' : timeState === 'future' ? '#e3f2fd' : '#f7f9e4' }} role="main" aria-label="Study Session">
      <div className="absolute inset-0 opacity-20 transition-colors duration-700 pointer-events-none" style={{ backgroundColor: theme.light }} aria-hidden="true" />
      
      <div className="px-6 pt-6 pb-2 shrink-0 z-20">
        <div className="flex justify-between items-center mb-3 gap-3">
          <button onClick={() => { playClick(); onFinish(); }} className="p-2.5 bg-white rounded-xl shadow-sm text-[#4b7d78] bubble-button" aria-label="Exit study session"><ChevronLeft size={18} strokeWidth={3} /></button>
          <div className="flex-1 h-3 bg-white/50 rounded-full overflow-hidden border border-white p-[2px]" role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100} aria-label="Study progress">
            <div 
              className="h-full rounded-full transition-all duration-700 cubic-bezier(0.68, -0.55, 0.265, 1.55)" 
              style={{ width: `${progressPercent}%`, backgroundColor: theme.main }} 
            />
          </div>
          <button onClick={() => setIsReverseMode(!isReverseMode)} aria-label={isReverseMode ? "Switch to Spanish to English mode" : "Switch to English to Spanish mode"} className={`p-2.5 rounded-xl border transition-all bubble-button ${isReverseMode ? 'text-white border-transparent' : 'bg-white text-[#4b7d78] border-white'}`} style={isReverseMode ? { backgroundColor: theme.main } : {}}><Globe size={18} aria-hidden="true" /></button>
        </div>
      </div>

      <div className="flex-1 px-4 py-1 card-perspective relative min-h-0 mb-4 z-10">
        <article 
          onClick={handleCardClick}
          style={{ 
            transform: `${isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'}`,
            transition: 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            cursor: isFlipped ? 'default' : 'pointer'
          }}
          className={`card-inner h-full
            ${isFlipped ? 'is-flipped' : ''} 
            ${showEnterAnim && !exitDirection ? 'card-enter' : ''} 
            ${exitDirection === 'left' ? 'card-exit-left' : ''} 
            ${exitDirection === 'right' ? 'card-exit-right' : ''} 
            ${exitDirection === 'fast-right' ? 'card-exit-fast-right' : ''}
          `}
          aria-live="polite"
        >
          {/* Front Face */}
          <div className="card-face card-face-front p-8 flex flex-col items-center justify-between h-full relative overflow-hidden transition-colors duration-500" style={bgStyle}>
            
            <div className="flex-1 flex flex-col items-center justify-center text-center w-full select-none">
              <span style={{ backgroundColor: theme.main }} className="px-3 py-1 rounded-full text-white text-[10px] font-black uppercase tracking-widest mb-6 shadow-sm">{getPosLabel(word)}</span>
              <h2 className="font-black text-[#2d4a47] leading-tight text-[clamp(2.5rem,12vw,4rem)] tracking-tighter transition-all duration-300">
                  {isReverseMode ? t(`vocab.${word.id}.t`, { defaultValue: word.t }) : currentWordDisplay}
              </h2>
              {hasTimeMachine && timeState !== 'present' && (
                  <p className="text-xs font-black uppercase tracking-[0.3em] mt-4 opacity-50 animate-pulse">{timeState} Tense</p>
              )}
            </div>
            
            <nav className="w-full space-y-4 pt-6 shrink-0 relative z-10" aria-label="Recall evaluation">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'forgot', label: t('ui.study.forgot'), icon: Ghost, color: '#94a3b8' },
                  { id: 'hard', label: t('ui.study.hard'), icon: Wind, color: '#f97316' },
                  { id: 'good', label: t('ui.study.good'), icon: Smile, color: theme.main },
                ].map((btn) => (
                  <button 
                    key={btn.id} 
                    onClick={(e) => { e.stopPropagation(); handleRating(btn.id as FeedbackQuality); }} 
                    className="bubble-button py-4 flex flex-col items-center gap-2 rounded-[2rem] bg-white shadow-sm hover:bg-[#fafafa] group hover:-translate-y-1 touch-manipulation" 
                    aria-label={`Rate as ${btn.label}`}
                  >
                    <btn.icon size={22} className="button-icon group-hover:scale-110 transition-transform" style={{ color: btn.color }} aria-hidden="true" />
                    <span className="text-[10px] font-black uppercase text-slate-500">{btn.label}</span>
                  </button>
                ))}
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); handleRating('easy'); }} 
                style={{ backgroundColor: theme.main }} 
                className="bubble-button w-full py-5 rounded-[2.5rem] text-white font-black text-xl shadow-[0_8px_0_rgba(0,0,0,0.1)] flex items-center justify-center gap-3 border-4 border-white group hover:scale-[1.02]" 
                aria-label="Rate as perfect and skip details"
              >
                <FastForward size={24} className="button-icon group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                <span>{t('ui.study.perfect')}</span>
              </button>
            </nav>
          </div>

          {/* Back Face */}
          <div className="card-face card-face-back flex flex-col h-full bg-white">
            <header className="shrink-0 p-6 px-8 border-b border-slate-50 flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <span style={{ color: theme.main }} className="text-[9px] font-black uppercase tracking-widest block mb-1">{getPosLabel(word)}</span>
                <h3 className="text-3xl font-black text-[#2d4a47] tracking-tighter leading-none truncate">{currentWordDisplay}</h3>
                <p style={{ color: theme.main }} className="text-xl font-bold italic opacity-80 mt-1 truncate">{t(`vocab.${word.id}.t`, { defaultValue: word.t })}</p>
              </div>
              <button onClick={() => speakCurrent()} onMouseDown={stopProp} onTouchStart={stopProp} aria-label="Listen to pronunciation" style={{ backgroundColor: theme.light, color: theme.main }} className="shrink-0 p-3 rounded-2xl shadow-sm border border-white bubble-button"><Volume2 size={24} aria-hidden="true" /></button>
            </header>
            
            <section className="flex-1 overflow-y-auto p-8 no-scrollbar bg-white" onMouseDown={stopProp} onTouchStart={stopProp}>
              <TimeMachine state={timeState} onChange={setTimeState} available={hasTimeMachine} />
              <GrammarPocket word={word} />
              <UsageExamples word={word} timeState={timeState} />
            </section>

            <footer className="shrink-0 p-6 px-8 bg-white border-t border-slate-50 space-y-3 z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between">
                <div className="flex gap-4" role="radiogroup" aria-label="Re-evaluate recall">
                  {['forgot', 'hard', 'good'].map(id => (
                    <button 
                      key={id} 
                      onMouseDown={stopProp}
                      onTouchStart={stopProp}
                      onClick={() => setCurrentRating(id as FeedbackQuality)} 
                      aria-label={`Mark as ${id}`}
                      aria-checked={currentRating === id}
                      className={`transition-all bubble-button ${currentRating === id ? 'scale-125 opacity-100' : 'opacity-20'}`}
                    >
                      {id === 'forgot' ? <Ghost size={20} color="#94a3b8" aria-hidden="true" /> : id === 'hard' ? <Wind size={20} color="#f97316" aria-hidden="true" /> : <Smile size={20} color={theme.main} aria-hidden="true" />}
                    </button>
                  ))}
                </div>
                <button onClick={() => setIsFlipped(false)} onMouseDown={stopProp} onTouchStart={stopProp} className="text-[9px] font-black text-slate-300 uppercase flex items-center gap-1 hover:text-slate-400 bubble-button"><RotateCcw size={12} aria-hidden="true" /> {t('ui.blog.back')}</button>
              </div>
              <button onClick={handleContinue} onMouseDown={stopProp} onTouchStart={stopProp} disabled={!currentRating} style={{ backgroundColor: theme.main }} className="bubble-button w-full py-4 rounded-[2.5rem] text-white font-black text-lg shadow-[0_6px_0_rgba(0,0,0,0.1)] flex items-center justify-center gap-2 border-2 border-white/20 disabled:opacity-50"><span>{t('ui.actions.next_word')}</span><ArrowRight size={20} aria-hidden="true" /></button>
            </footer>
          </div>
        </article>
      </div>
    </main>
  );
};

export default StudyView;
