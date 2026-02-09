
import React, { useState, useCallback, useEffect, useRef } from 'react';
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
  playClick
} from '../utils/sfx';
import { 
  ChevronLeft, 
  Globe, Ghost, Wind, Smile,
  Volume2, BookOpen, PenTool, Map, FastForward, Zap,
  Star, RotateCcw, ArrowLeftRight, AudioLines,
  AlertTriangle, TrendingUp, ArrowRight, Circle, CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

// ... [Helper Components kept exactly as is for brevity] ...

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
        <div className="flex items-center gap-2 mb-2">
           <PenTool size={12} className="text-[#2d4a47]/40" />
           <span className="text-[9px] font-black text-[#2d4a47]/40 uppercase tracking-widest">GRAMMAR TIP</span>
        </div>
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
    <div className="space-y-3 mb-8">
      <div className="flex items-center gap-2 px-1">
        <PenTool size={12} className="text-[#2d4a47]/40" />
        <span className="text-[9px] font-black text-[#2d4a47]/40 uppercase tracking-widest">{t('ui.study.grammar_pocket')}</span>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {labels.map((label, i) => (
          <div key={label} className="bg-white/80 p-3 rounded-2xl border border-slate-100 flex flex-col items-center shadow-sm">
            <span className="text-[7px] font-bold text-slate-400 uppercase leading-none mb-1">{label}</span>
            <span className="text-sm font-black text-[#2d4a47]">
              {renderFormText(conjugationList[i])}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const NuancePocket: React.FC<{ word: Word }> = ({ word }) => {
  if (!word.nuance) return null;
  const isWarning = word.nuance.type === 'warning';
  const bgColor = isWarning ? 'bg-[#fff8e1]' : 'bg-[#e8eaf6]';
  const borderColor = isWarning ? 'border-[#ffe082]' : 'border-[#c5cae9]';
  const textColor = isWarning ? 'text-[#ff6f00]' : 'text-[#3f51b5]';
  const Icon = isWarning ? AlertTriangle : TrendingUp;

  return (
    <div className={`${bgColor} rounded-[2.5rem] p-6 border-4 ${borderColor} mb-8 shadow-sm relative overflow-hidden group`}>
       <div className="flex items-start gap-4 relative z-10">
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-white/50 shrink-0">
             <Icon size={24} className={textColor} />
          </div>
          <div>
             <h4 className={`text-[10px] font-black uppercase tracking-widest mb-1 opacity-60 ${textColor}`}>
                {word.nuance.label}
             </h4>
             <p className={`text-sm font-bold leading-relaxed ${textColor}`}>
                {word.nuance.note}
             </p>
          </div>
       </div>
    </div>
  );
};

const OppositePocket: React.FC<{ word: Word }> = ({ word }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  if (word.type !== 'adj' || !word.ant) return null;
  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(true);
    playAudio(word.ant!, undefined, () => setIsPlaying(false));
  };
  return (
    <div 
      onClick={handleSpeak}
      className="bg-[#f3e5f5] rounded-[2.5rem] p-5 border-2 border-[#ce93d8]/30 flex items-center justify-between mb-8 shadow-sm cursor-pointer active:scale-95 transition-all group"
    >
      <div className="flex items-center gap-3">
        <div className="bg-white p-2.5 rounded-xl text-[#ab47bc] shadow-sm border border-[#ce93d8]/20">
          <ArrowLeftRight size={20} />
        </div>
        <div>
          <h4 className="text-[9px] font-black text-[#ab47bc]/60 uppercase tracking-widest mb-0.5">OPPOSITE</h4>
          <h3 className="text-2xl font-black text-[#6a1b9a] tracking-tight flex items-center gap-2">
            {word.ant}
            {isPlaying && <AudioLines size={16} className="text-[#ab47bc] animate-pulse" />}
          </h3>
        </div>
      </div>
      <div className="bg-white px-4 py-1.5 rounded-xl border-2 border-white shadow-sm font-black text-[#ab47bc] text-xs group-hover:bg-[#f3e5f5] transition-colors">
        {word.antT}
      </div>
    </div>
  );
};

const VocabNotes: React.FC<{ word: Word }> = ({ word }) => {
  const { t } = useTranslation();
  if (!word.nounNotes || word.nounNotes === 'Function Word') return null;
  return (
    <div className="mt-8 pt-6 border-t-2 border-dashed border-[#0277bd]/20">
       <div className="flex items-center gap-2 mb-3">
         <Map size={14} className="text-[#0277bd]/40" />
         <span className="text-[9px] font-black text-[#0277bd]/40 uppercase tracking-widest">{t('ui.study.vocab_note')}</span>
       </div>
       <div className="p-5 rounded-2xl border-2 border-dashed border-[#0277bd]/30 bg-white/60">
         <p className="text-[#0277bd] text-sm font-bold leading-relaxed">
           {t(`vocab.${word.id}.notes`, { defaultValue: word.nounNotes })}
         </p>
       </div>
    </div>
  );
};

const UsageExamples: React.FC<{ word: Word }> = ({ word }) => {
  const { t } = useTranslation();
  const theme = getTypeTheme(word);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const highlightWord = (text: string) => {
    const searchWord = word.s.toLowerCase();
    const regex = new RegExp(`(${searchWord}|${searchWord.substring(0, 3)}[a-zñáéíóú]*)`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) => 
      regex.test(part) ? <span key={i} style={{ color: theme.main }} className="font-black decoration-2 decoration-current/30 underline underline-offset-4">{part}</span> : <span key={i}>{part}</span>
    );
  };
  const playExample = (e: React.MouseEvent, text: string, index: number) => {
    e.stopPropagation();
    setPlayingIndex(index);
    playAudio(text, undefined, () => setPlayingIndex(null));
  };
  return (
    <div className="bg-[#e3f2fd] rounded-[2.5rem] p-6 relative shadow-sm group">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen size={14} className="text-[#0277bd]" />
        <span className="text-[9px] font-black text-[#0277bd]/50 uppercase tracking-widest">{t('ui.study.usage_examples')}</span>
      </div>
      <div className="space-y-8">
        {word.examples.map((ex, i) => (
          <button key={i} onClick={(e) => playExample(e, ex.txt, i)} className="text-left w-full group/ex relative block focus:outline-none">
            <div className="space-y-1.5">
               <p className="text-[#01579b] text-lg font-black leading-snug italic transition-colors flex items-start gap-2">
                 <span className="opacity-40 select-none">"</span>
                 <span>{highlightWord(ex.txt)}</span>
                 <span className="opacity-40 select-none">"</span>
                 {playingIndex === i && <AudioLines size={16} className="mt-1 text-[#0277bd] animate-pulse shrink-0" />}
               </p>
               <p className="text-[#0277bd]/60 text-xs font-bold uppercase tracking-wide pl-4 border-l-2 border-[#0277bd]/20">{ex.eng}</p>
            </div>
          </button>
        ))}
      </div>
      <VocabNotes word={word} />
    </div>
  );
};

// --- MAIN STUDY COMPONENT ---

const StudyView: React.FC<any> = ({ words, dailyHarvest, onFinish, onFeedback, onLoginRequest, isBlitz = false, userStats, user }) => {
  const { t } = useTranslation();
  
  // Local Queue Management
  // We initialize state with props.words, but then manage it locally to handle re-queuing for drills
  const [queue, setQueue] = useState<Word[]>(words);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Drill Status: Maps WordID -> Remaining Steps (3, 2, 1). 0 or undefined means done/no drill.
  const [drillStatus, setDrillStatus] = useState<Record<string, number>>({});
  
  // Determine if we are currently looking at a "Retry Card" (Added later)
  // We can track the original length to know if we are in overtime
  const [originalLength] = useState(words.length);
  
  const [isFlipped, setIsFlipped] = useState(false);
  const [ritualClass, setRitualClass] = useState('');
  const [isSummaryView, setIsSummaryView] = useState(false);
  const [isReverseMode, setIsReverseMode] = useState(false);
  const [currentRating, setCurrentRating] = useState<FeedbackQuality | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const word = queue[currentIndex];
  
  // Check Drill Status
  const stepsRemaining = word ? (drillStatus[word.id] || 0) : 0;
  const isInDrill = stepsRemaining > 0;
  const isRetryCard = currentIndex >= originalLength || isInDrill;

  const theme = word ? getTypeTheme(word) : { main: '#4b7d78', light: '#f7f9e4', text: '#2d4a47' };
  const displayTranslation = word ? t(`vocab.${word.id}.t`, { defaultValue: word.t }) : '';
  const progressPercent = (currentIndex / queue.length) * 100;

  const handleNext = useCallback(() => {
    if (currentIndex < queue.length - 1) {
      setIsFlipped(false);
      setRitualClass('');
      setCurrentRating(null);
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 300);
    } else {
      setIsSummaryView(true);
    }
  }, [currentIndex, queue.length]);

  const handleRating = (quality: FeedbackQuality) => {
    setCurrentRating(quality);

    // 1. Easy / Perfect (Instant Pass)
    // Only allowed if NOT in a drill
    if (quality === 'easy' && !isInDrill) {
      onFeedback(word.id, 'easy');
      playHighChime(); 
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 }, colors: [theme.main, '#ffa600'] });
      setRitualClass('ritual-easy');
      setTimeout(handleNext, 400);
      return;
    }

    // 2. Forgot / Hard (Penalty Trigger)
    if (quality === 'forgot' || quality === 'hard') {
       // Trigger external SRS update immediately (reset level)
       onFeedback(word.id, quality);
       
       if (quality === 'forgot') playThud();
       else playLowWood();

       // Activate Drill Mode (3 Steps)
       setDrillStatus(prev => ({ ...prev, [word.id]: 3 }));
       
       // Add to end of queue
       if (!isBlitz) setRetryCount(prev => prev + 1);
       setQueue(prev => [...prev, word]);
       
       setIsFlipped(true);
       return;
    }

    // 3. Good (Progress)
    if (quality === 'good') {
       if (isInDrill) {
          // Decrement Drill Steps
          const newSteps = stepsRemaining - 1;
          setDrillStatus(prev => ({ ...prev, [word.id]: newSteps }));

          if (newSteps > 0) {
             // Still need practice -> Re-queue
             playHighWood();
             setQueue(prev => [...prev, word]);
          } else {
             // Drill Complete!
             playHighChime();
             // Fix: Finally mark as good in SRS so it advances from Level 1
             onFeedback(word.id, 'good');
          }
       } else {
          // Standard Pass
          onFeedback(word.id, 'good');
          playHighWood();
       }
       setIsFlipped(true);
    }
  };

  useEffect(() => {
    if (isFlipped && word) playAudio(word.s);
  }, [isFlipped, word]);

  if (isSummaryView) {
    return <SummaryView words={queue} dailyHarvest={dailyHarvest && dailyHarvest.length > 0 ? dailyHarvest : queue} totalLearned={userStats?.total_words_learned || 0} streak={userStats?.current_streak || 1} user={user} onFinish={onFinish} onLoginRequest={onLoginRequest} />;
  }
  if (!word) return null;

  return (
    <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full h-[100dvh] overflow-hidden bg-[#f7f9e4] relative">
      <div className="absolute inset-0 opacity-30 transition-colors duration-700" style={{ backgroundColor: theme.light }} />
      <div className="px-6 pt-6 pb-2 shrink-0 z-20">
        <div className="flex justify-between items-center mb-3 gap-3">
          <button onClick={() => { playClick(); onFinish(); }} className="p-2.5 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm text-[#4b7d78] active:scale-90 transition-all border border-white">
            <ChevronLeft className="w-4 h-4" strokeWidth={3} />
          </button>
          
          <div className="flex-1 h-3 bg-white/50 rounded-full overflow-hidden relative border border-white">
            <div className="h-full transition-all duration-500 rounded-full" style={{ width: `${progressPercent}%`, backgroundColor: theme.main }} />
          </div>

          {/* Retry Indicator Badge */}
          {retryCount > 0 && (
             <div key={retryCount} className="bg-[#ffcc80] text-[#e65100] px-2.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 shadow-sm animate-wiggle border-2 border-white">
                 <RotateCcw size={12} strokeWidth={4} />
                 <span>+{retryCount}</span>
             </div>
          )}

          <button onClick={() => { playClick(); setIsReverseMode(!isReverseMode); }} className={`p-2.5 rounded-xl border transition-all ${isReverseMode ? 'text-white border-transparent' : 'bg-white/80 backdrop-blur-sm text-[#4b7d78] border-white'}`} style={isReverseMode ? { backgroundColor: theme.main } : {}}>
             <Globe className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex-1 px-4 py-1 card-perspective relative min-h-0 mb-4 z-10">
        <div className={`card-inner h-full ${isFlipped ? 'is-flipped' : ''} ${ritualClass}`}>
          {/* Front */}
          <div className="card-face card-face-front p-8 flex flex-col items-center justify-between h-full" style={{ backgroundColor: theme.light }}>
            
            <div className="flex-1 flex flex-col items-center justify-center text-center w-full">
              
              {/* Info Pills Row */}
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                 {/* POS */}
                 <span style={{ backgroundColor: theme.main }} className="px-3 py-1.5 rounded-full text-white text-[10px] font-black uppercase tracking-widest shadow-sm border border-white/20">
                   {getPosLabel(word)}
                 </span>
                 {/* Level */}
                 <span style={{ backgroundColor: theme.main }} className="px-3 py-1.5 rounded-full text-white text-[10px] font-black uppercase tracking-widest shadow-sm border border-white/20">
                   {word.level}
                 </span>
                 
                 {/* Drill Indicator Pills */}
                 {isInDrill && (
                    <span className="bg-[#ff7043] text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm border border-white/20 animate-pulse">
                       <RotateCcw size={10} /> Step {4 - stepsRemaining}/3
                    </span>
                 )}

                 {/* Hard Mode Badge */}
                 {word.reg === false && (
                   <span className="bg-white/60 text-rose-500 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 border border-rose-100">
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
              
              {/* Perfect button hidden for Retry Cards */}
              {!isRetryCard && (
                <button onClick={() => handleRating('easy')} style={{ backgroundColor: theme.main }} className="w-full py-5 rounded-[2.5rem] text-white font-black text-xl shadow-[0_8px_0_rgba(0,0,0,0.1)] active:translate-y-1 active:shadow-none flex items-center justify-center gap-3 transition-all border-4 border-white">
                  <FastForward size={24} />
                  <span>{t('ui.study.perfect')}</span>
                </button>
              )}
              {isRetryCard && (
                 <div className="w-full py-3 text-center opacity-40">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Perfect unavailable during drill</span>
                 </div>
              )}
            </div>
          </div>

          {/* Back */}
          <div className="card-face card-face-back flex flex-col h-full overflow-hidden bg-white relative">
            <div className="absolute top-0 left-4 bottom-0 flex flex-col justify-around py-16 opacity-[0.05] pointer-events-none z-0">
               {[...Array(6)].map((_, i) => <div key={i} className="w-2.5 h-2.5 rounded-full bg-black shadow-inner"></div>)}
            </div>
            
            <div className="shrink-0 p-5 px-8 border-b border-slate-50 flex items-center justify-between bg-white z-10">
              <div className="flex-1 min-w-0 pr-4">
                <span style={{ color: theme.main }} className="text-[9px] font-black uppercase tracking-widest block mb-1">{getPosLabel(word)}</span>
                <div className="flex items-center gap-3">
                   <h3 className="text-3xl font-black text-[#2d4a47] tracking-tighter truncate leading-none">{word.s}</h3>
                   {/* Drill Step Dots on Back */}
                   {isInDrill && (
                     <div className="flex gap-1">
                        {[1, 2, 3].map(step => (
                            <div key={step} className={`w-2 h-2 rounded-full border border-[#ff7043] ${(4 - stepsRemaining) >= step ? 'bg-[#ff7043]' : 'bg-transparent'}`} />
                        ))}
                     </div>
                   )}
                </div>
                <p style={{ color: theme.main }} className="text-xl font-black italic truncate opacity-80 mt-1">{displayTranslation}</p>
              </div>
              <button onClick={() => playAudio(word.s)} style={{ backgroundColor: theme.light, color: theme.main }} className="shrink-0 p-3 rounded-2xl shadow-sm border border-white active:scale-95 transition-all"><Volume2 className="w-6 h-6" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 px-8 no-scrollbar min-h-0 bg-white relative">
              <GrammarPocket word={word} />
              <NuancePocket word={word} />
              <OppositePocket word={word} />
              <UsageExamples word={word} />
              <div className="h-16 flex flex-col items-center justify-center opacity-[0.03] grayscale mt-4">
                <Star size={12} />
              </div>
            </div>

            <div className="shrink-0 p-5 px-8 pt-3 bg-white border-t border-slate-50 space-y-3 z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
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
                <button onClick={() => setIsFlipped(false)} className="text-[8px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1 hover:text-slate-400"><RotateCcw size={10} /> RE-EVALUATE</button>
              </div>
              <button onClick={() => { playHighWood(); handleNext(); }} style={{ backgroundColor: theme.main }} className="w-full py-4 rounded-[2.5rem] text-white font-black text-lg shadow-[0_6px_0_rgba(0,0,0,0.1)] active:translate-y-1 active:shadow-none flex flex-col items-center justify-center transition-all border-2 border-white/20">
                <div className="flex items-center gap-2">
                    {isInDrill ? <span>NEXT STEP ({4 - stepsRemaining}/3)</span> : <span>CONTINUE</span>}
                    <ArrowRight size={18} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyView;
