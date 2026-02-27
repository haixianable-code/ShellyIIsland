
import React, { useState, useCallback, useEffect } from 'react';
import { Word, FeedbackQuality } from '../types';
import { playAudio } from '../utils/audio';
import { getTypeTheme } from '../utils/theme';
import SummaryView from './SummaryView';
import { 
  playHighChime, 
  playHighWood,
  playLowWood,
  playThud,
  playClick,
  playSwish
} from '../utils/sfx';
import { ChevronLeft, Globe } from 'lucide-react';
import confetti from 'canvas-confetti';
import { StudyCard } from './study/StudyCard';
import { TimeState, PastMode } from './study/TimeMachine';

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

const StudyView: React.FC<StudyViewProps> = ({ words, dailyHarvest, onFinish, onFeedback, onLoginRequest, isBlitz = false, userStats, user }) => {
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
  const [pastMode, setPastMode] = useState<PastMode>('snapshot');

  useEffect(() => {
    if (!words || words.length === 0) onFinish();
  }, [words, onFinish]);

  const word = queue[currentIndex];
  const progressPercent = Math.max(5, (currentIndex / queue.length) * 100);
  const theme = word ? getTypeTheme(word) : { main: '#4b7d78', light: '#f7f9e4', text: '#2d4a47' };

  useEffect(() => {
      setTimeState('present');
      setPastMode('snapshot');
  }, [currentIndex]);

  const handleCardClick = () => {
    if (isFlipped) return;
    playSwish();
    setIsFlipped(true);
  };

  const handleFrontFeedback = (quality: FeedbackQuality) => {
    playClick();
    setCurrentRating(quality);
    setIsFlipped(true);
    if (quality === 'forgot') playThud();
    else if (quality === 'hard') playLowWood();
    else if (quality === 'good') playHighWood();
    else if (quality === 'easy') {
      playHighChime();
      confetti({ particleCount: 20, spread: 50, origin: { x: 0.5, y: 0.5 }, colors: [theme.main, '#ffa600'] });
    }
  };

  const handleBackFeedback = (quality: FeedbackQuality) => {
    playClick();
    setCurrentRating(quality);
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

  const handleNextAction = () => {
    if(!currentRating) return; 
    onFeedback(word.id, currentRating); 
    triggerExit(currentRating === 'good' || currentRating === 'easy' ? 'right' : 'left'); 
  };

  const speakCurrent = () => {
      let textToSpeak = word.s;
      if (timeState === 'future' && word.tense_forms?.future) {
          textToSpeak = word.tense_forms.future.split(',')[0];
      } else if (timeState === 'past') {
          if (pastMode === 'snapshot' && word.tense_forms?.past) {
              textToSpeak = word.tense_forms.past.split(',')[0];
          } else if (pastMode === 'movie' && word.tense_forms?.imperfect) {
              textToSpeak = word.tense_forms.imperfect.split(',')[0];
          }
      }
      playAudio(textToSpeak);
  };

  useEffect(() => {
    if (isFlipped && word) speakCurrent();
  }, [isFlipped, word, timeState, pastMode]);

  if (isSummaryView) {
    return <SummaryView words={queue} dailyHarvest={dailyHarvest} totalLearned={userStats?.total_words_learned || 0} streak={userStats?.current_streak || 1} user={user} onFinish={onFinish} onLoginRequest={onLoginRequest} />;
  }
  
  if (!word) return null;

  return (
    <main className={`flex-1 flex flex-col max-w-2xl mx-auto w-full h-[100dvh] overflow-hidden relative transition-colors duration-500 ${isTransitioning ? 'is-transitioning' : ''}`} style={{ backgroundColor: timeState === 'past' ? (pastMode === 'snapshot' ? '#efebe9' : '#e0e0e0') : timeState === 'future' ? '#e3f2fd' : '#f7f9e4' }} role="main" aria-label="Study Session">
      <div className="absolute inset-0 opacity-20 transition-colors duration-700 pointer-events-none" style={{ backgroundColor: theme.light }} aria-hidden="true" />
      
      <div className="px-6 pt-6 pb-2 shrink-0 z-20">
        <div className="flex justify-between items-center mb-3 gap-3">
          <button onClick={() => { playClick(); onFinish(); }} className="p-2.5 bg-white rounded-xl shadow-sm text-[#4b7d78] bubble-button"><ChevronLeft size={18} strokeWidth={3} /></button>
          <div className="flex-1 h-3 bg-white/50 rounded-full overflow-hidden border border-white p-[2px]" role="progressbar" aria-valuenow={progressPercent} aria-label="Study progress">
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${progressPercent}%`, backgroundColor: theme.main }} />
          </div>
          <button onClick={() => setIsReverseMode(!isReverseMode)} className={`p-2.5 rounded-xl border transition-all bubble-button ${isReverseMode ? 'text-white border-transparent' : 'bg-white text-[#4b7d78] border-white'}`} style={isReverseMode ? { backgroundColor: theme.main } : {}}><Globe size={18} /></button>
        </div>
      </div>

      <div className="flex-1 px-4 py-1 card-perspective relative min-h-0 mb-4 z-10 w-full">
        <StudyCard 
          word={word}
          isFlipped={isFlipped}
          isReverseMode={isReverseMode}
          currentRating={currentRating}
          timeState={timeState}
          pastMode={pastMode}
          showEnterAnim={showEnterAnim}
          exitDirection={exitDirection}
          onFlip={handleCardClick}
          onFrontFeedback={handleFrontFeedback}
          onBackFeedback={handleBackFeedback}
          onNext={handleNextAction}
          onFlipBack={() => setIsFlipped(false)}
          onSpeak={speakCurrent}
          onTimeStateChange={setTimeState}
          onPastModeChange={setPastMode}
        />
      </div>
    </main>
  );
};

export default StudyView;
