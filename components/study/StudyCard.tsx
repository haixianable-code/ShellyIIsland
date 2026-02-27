
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Volume2, Camera, Film, Ghost, Wind, Smile, FastForward } from 'lucide-react';
import { Word, FeedbackQuality } from '../../types';
import { getTypeTheme, getPosLabel } from '../../utils/theme';
import { playClick } from '../../utils/sfx';
import { TimeMachine, TimeState, PastMode } from './TimeMachine';
import { GrammarPocket } from './GrammarPocket';
import { UsageExamples } from './UsageExamples';
import { FeedbackBar } from './FeedbackBar';

interface StudyCardProps {
  word: Word;
  isFlipped: boolean;
  isReverseMode: boolean;
  currentRating: FeedbackQuality | null;
  timeState: TimeState;
  pastMode: PastMode;
  showEnterAnim: boolean;
  exitDirection: 'left' | 'right' | 'fast-right' | null;
  
  onFlip: () => void;
  onFrontFeedback: (quality: FeedbackQuality) => void;
  onBackFeedback: (quality: FeedbackQuality) => void;
  onNext: () => void;
  onFlipBack: () => void;
  onSpeak: () => void;
  
  onTimeStateChange: (s: TimeState) => void;
  onPastModeChange: (m: PastMode) => void;
}

export const StudyCard: React.FC<StudyCardProps> = ({
  word, isFlipped, isReverseMode, currentRating, timeState, pastMode,
  showEnterAnim, exitDirection,
  onFlip, onFrontFeedback, onBackFeedback, onNext, onFlipBack, onSpeak,
  onTimeStateChange, onPastModeChange
}) => {
  const { t } = useTranslation();
  const theme = getTypeTheme(word);
  
  const hasTimeMachine = !!word.tense_forms;
  const hasImperfect = !!word.tense_forms?.imperfect;
  
  let currentWordDisplay = word.s;
  let tenseLabel = '';

  if (timeState !== 'present' && word.tense_forms) {
      if (timeState === 'future' && word.tense_forms.future) {
          currentWordDisplay = word.tense_forms.future.split(',')[0];
          tenseLabel = 'FUTURE';
      } else if (timeState === 'past') {
          if (pastMode === 'snapshot' && word.tense_forms.past) {
              currentWordDisplay = word.tense_forms.past.split(',')[0];
              tenseLabel = 'PAST (SNAPSHOT)';
          } else if (pastMode === 'movie' && word.tense_forms.imperfect) {
              currentWordDisplay = word.tense_forms.imperfect.split(',')[0];
              tenseLabel = 'PAST (MOVIE)';
          }
      }
  }

  const bgStyle = timeState === 'past' ? (pastMode === 'snapshot' ? { backgroundColor: '#d7ccc8' } : { backgroundColor: '#efebe9' }) :
                  timeState === 'future' ? { backgroundColor: '#bbdefb' } :
                  { backgroundColor: theme.light };

  return (
    <article 
      onClick={onFlip}
      className={`card-inner h-full ${isFlipped ? 'is-flipped' : ''} ${showEnterAnim && !exitDirection ? 'card-enter' : ''} ${exitDirection === 'left' ? 'card-exit-left' : ''} ${exitDirection === 'right' ? 'card-exit-right' : ''} ${exitDirection === 'fast-right' ? 'card-exit-fast-right' : ''}`}
    >
      {/* FRONT FACE */}
      <div className="card-face card-face-front p-8 flex flex-col items-center justify-between h-full relative overflow-hidden transition-colors duration-500" style={bgStyle}>
        <div className="flex-1 flex flex-col items-center justify-center text-center w-full select-none">
          <span style={{ backgroundColor: theme.main }} className="px-3 py-1 rounded-full text-white text-[10px] font-black uppercase tracking-widest mb-6 shadow-sm">{getPosLabel(word)}</span>
          <h2 className="font-black text-[#2d4a47] leading-tight text-[clamp(2.5rem,12vw,4rem)] tracking-tighter transition-all duration-300">
              {isReverseMode ? t(`vocab.${word.id}.t`, { defaultValue: word.t }) : currentWordDisplay}
          </h2>
          {hasTimeMachine && timeState !== 'present' && (
              <div className="mt-4 flex flex-col items-center gap-1 animate-pulse">
                  {tenseLabel.includes('SNAPSHOT') ? <Camera size={16} className="text-[#5d4037]" /> : 
                   tenseLabel.includes('MOVIE') ? <Film size={16} className="text-[#5d4037]" /> : null}
                  <p className="text-xs font-black uppercase tracking-[0.3em] opacity-50">{tenseLabel}</p>
              </div>
          )}
        </div>
        
        <nav className="w-full space-y-4 pt-6 shrink-0 relative z-10">
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'forgot', label: t('ui.study.forgot'), icon: Ghost, color: '#94a3b8' },
              { id: 'hard', label: t('ui.study.hard'), icon: Wind, color: '#f97316' },
              { id: 'good', label: t('ui.study.good'), icon: Smile, color: theme.main },
            ].map((btn) => (
              <button key={btn.id} onClick={(e) => { e.stopPropagation(); onFrontFeedback(btn.id as FeedbackQuality); }} className="bubble-button py-4 flex flex-col items-center gap-2 rounded-[2rem] bg-white shadow-sm hover:bg-[#fafafa] group">
                <btn.icon size={22} className="button-icon transition-transform" style={{ color: btn.color }} />
                <span className="text-[10px] font-black uppercase text-slate-500">{btn.label}</span>
              </button>
            ))}
          </div>
          <button onClick={(e) => { e.stopPropagation(); onFrontFeedback('easy'); }} style={{ backgroundColor: theme.main }} className="bubble-button w-full py-5 rounded-[2.5rem] text-white font-black text-xl shadow-[0_8px_0_rgba(0,0,0,0.1)] flex items-center justify-center gap-3 border-4 border-white">
            <FastForward size={24} />
            <span>{t('ui.study.perfect')}</span>
          </button>
        </nav>
      </div>

      {/* BACK FACE */}
      <div className="card-face card-face-back flex flex-col h-full bg-white">
        <header className="shrink-0 p-6 border-b border-slate-50 flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <span style={{ color: theme.main }} className="text-[9px] font-black uppercase tracking-widest block mb-1">{getPosLabel(word)}</span>
            <h3 className="text-3xl font-black text-[#2d4a47] tracking-tighter truncate">{currentWordDisplay}</h3>
            <p style={{ color: theme.main }} className="text-xl font-bold italic opacity-80 mt-1 truncate">{t(`vocab.${word.id}.t`, { defaultValue: word.t })}</p>
          </div>
          <button onClick={() => onSpeak()} onMouseDown={(e) => e.stopPropagation()} style={{ backgroundColor: theme.light, color: theme.main }} className="shrink-0 p-3 rounded-2xl shadow-sm border border-white bubble-button"><Volume2 size={24} /></button>
        </header>
        
        <section className="flex-1 min-h-0 overflow-y-auto p-6 md:p-8 no-scrollbar bg-white" onMouseDown={(e) => e.stopPropagation()}>
          <TimeMachine 
              state={timeState} 
              onChange={onTimeStateChange} 
              available={hasTimeMachine} 
              pastMode={pastMode}
              onTogglePast={onPastModeChange}
              hasImperfect={hasImperfect}
          />
          <GrammarPocket word={word} timeState={timeState} pastMode={pastMode} />
          <UsageExamples word={word} timeState={timeState} pastMode={pastMode} />
        </section>

        <FeedbackBar 
          currentRating={currentRating}
          onFeedback={onBackFeedback}
          onNext={onNext}
          onFlipBack={onFlipBack}
          theme={theme}
        />
      </div>
    </article>
  );
};
