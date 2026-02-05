
import React, { useState, useEffect, useMemo } from 'react';
import { AppView, Word, ProgressMap } from './types';
import { VOCABULARY_DATA, SRS_INTERVALS, TODAY_SIMULATED } from './constants';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import StudyView from './components/StudyView';
import VocabularyView from './components/VocabularyView';
import StreakModal from './components/StreakModal';
import { Heart, Flame, Home, ShoppingBag } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.DASHBOARD);
  const [progress, setProgress] = useState<ProgressMap>({});
  const [history, setHistory] = useState<string[]>([]); // Array of 'YYYY-MM-DD' strings
  const [sessionWords, setSessionWords] = useState<Word[]>([]);
  const [showStreakModal, setShowStreakModal] = useState(false);

  const allAvailableWords = useMemo(() => {
    return VOCABULARY_DATA.flatMap(d => d.words);
  }, []);

  // Words that have been studied (level > 0)
  const learnedWords = useMemo(() => {
    return allAvailableWords.filter(w => progress[w.id] && progress[w.id].level > 1);
  }, [allAvailableWords, progress]);

  // Helper to calculate streak from a list of dates
  const calculateStreak = (dateList: string[]): number => {
    if (dateList.length === 0) return 0;
    
    // Sort unique dates descending
    const sortedDates = Array.from(new Set(dateList))
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let streak = 0;
    
    // If the latest date isn't today or yesterday, streak is broken (0)
    const latestDate = new Date(sortedDates[0]);
    const diffTime = Math.abs(new Date(TODAY_SIMULATED).getTime() - latestDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 1) return 0;

    // Start checking from the most recent activity (could be today or yesterday)
    let currentIdx = 0;
    let expectedDate = new Date(sortedDates[0]);

    while (currentIdx < sortedDates.length) {
      const actualDateStr = sortedDates[currentIdx];
      const expectedDateStr = expectedDate.toISOString().split('T')[0];

      if (actualDateStr === expectedDateStr) {
        streak++;
        expectedDate.setDate(expectedDate.getDate() - 1);
        currentIdx++;
      } else {
        break;
      }
    }

    return streak;
  };

  const currentStreak = useMemo(() => calculateStreak(history), [history]);

  useEffect(() => {
    const saved = localStorage.getItem('hola_word_srs_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProgress(parsed.progress || {});
        setHistory(parsed.history || []);
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    } else {
      // Onboarding initial state
      const initialProgress: ProgressMap = {};
      const initialHistory: string[] = [];
      
      VOCABULARY_DATA.forEach(day => {
        if (day.date < TODAY_SIMULATED) {
          day.words.forEach(w => {
            initialProgress[w.id] = { level: 2, nextReviewDate: TODAY_SIMULATED };
          });
          // Mock history for previous days to give users a head start streak
          initialHistory.push(day.date);
        }
      });
      
      setProgress(initialProgress);
      setHistory(initialHistory);
      localStorage.setItem('hola_word_srs_v2', JSON.stringify({ progress: initialProgress, history: initialHistory }));
    }
  }, []);

  const saveData = (newProgress: ProgressMap, newHistory: string[]) => {
    setProgress(newProgress);
    setHistory(newHistory);
    localStorage.setItem('hola_word_srs_v2', JSON.stringify({ progress: newProgress, history: newHistory }));
  };

  const reviewWords = useMemo(() => {
    return Object.entries(progress)
      .filter(([_, data]) => data.nextReviewDate <= TODAY_SIMULATED)
      .map(([id]) => allAvailableWords.find(w => w.id === id))
      .filter((w): w is Word => w !== undefined);
  }, [progress, allAvailableWords]);

  const newWordsForToday = useMemo(() => {
    return VOCABULARY_DATA
      .filter(day => day.date === TODAY_SIMULATED)
      .flatMap(day => day.words)
      .filter(w => !progress[w.id]);
  }, [progress]);

  const handleStartStudy = () => {
    if (newWordsForToday.length === 0) return;
    setSessionWords([...newWordsForToday]);
    setView(AppView.STUDY);
  };

  const handleStartReview = () => {
    if (reviewWords.length === 0) return;
    setSessionWords([...reviewWords]);
    setView(AppView.REVIEW);
  };

  const handleFinishSession = () => {
    setView(AppView.DASHBOARD);
    // Add today to history if not exists
    if (!history.includes(TODAY_SIMULATED)) {
      const newHistory = [...history, TODAY_SIMULATED];
      saveData(progress, newHistory);
    }
  };

  const handleFeedback = (wordId: string, quality: 'forgot' | 'hard' | 'good' | 'easy') => {
    const currentData = progress[wordId] || { level: 1, nextReviewDate: TODAY_SIMULATED };
    let newLevel = currentData.level;
    let nextReviewInDays = 0;

    if (quality === 'easy') {
      newLevel += 2;
      nextReviewInDays = SRS_INTERVALS[Math.min(newLevel, SRS_INTERVALS.length - 1)];
    } else if (quality === 'good') {
      newLevel += 1;
      nextReviewInDays = SRS_INTERVALS[Math.min(newLevel, SRS_INTERVALS.length - 1)];
    } else if (quality === 'hard') {
      newLevel = Math.max(1, newLevel - 1);
      nextReviewInDays = 0;
      const currentWord = allAvailableWords.find(w => w.id === wordId);
      if (currentWord) setSessionWords(prev => [...prev, currentWord]);
    } else if (quality === 'forgot') {
      newLevel = 1;
      nextReviewInDays = 0;
      const currentWord = allAvailableWords.find(w => w.id === wordId);
      if (currentWord) setSessionWords(prev => [...prev, currentWord]);
    }

    newLevel = Math.max(1, Math.min(newLevel, SRS_INTERVALS.length - 1));
    const baseDate = new Date(TODAY_SIMULATED);
    baseDate.setDate(baseDate.getDate() + nextReviewInDays);
    const nextDateStr = baseDate.toISOString().split('T')[0];
    
    const newProgress = {
      ...progress,
      [wordId]: { level: newLevel, nextReviewDate: nextDateStr }
    };

    saveData(newProgress, history);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row selection:bg-[#ffd3b6] selection:text-[#e67e22]">
      <Sidebar 
        currentView={view} 
        setView={setView} 
        onStreakClick={() => setShowStreakModal(true)} 
        streak={currentStreak}
      />
      
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-4 border-[#e0d9b4] flex justify-around items-center p-3 pb-5 z-40 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <button onClick={() => setView(AppView.DASHBOARD)} className={`flex flex-col items-center gap-1 transition-all ${view === AppView.DASHBOARD ? 'text-[#ffa600]' : 'text-[#8d99ae]'}`}>
          <Home size={22} className={view === AppView.DASHBOARD ? 'fill-current' : ''} />
          <span className="text-[9px] font-black uppercase">Home</span>
        </button>
        
        <button 
          onClick={() => setShowStreakModal(true)}
          className="bg-[#88d068] text-white p-3 rounded-2xl shadow-[0_4px_0_#5a9a3b] border-2 border-white flex flex-col items-center gap-0.5 bubble-button"
        >
          <Flame size={20} className={`fill-current ${currentStreak > 0 ? 'text-[#ffeb3b]' : 'text-white/40'}`} />
          <span className="text-[8px] font-black uppercase">{currentStreak} Days</span>
        </button>

        <button onClick={() => setView(AppView.VOCABULARY)} className={`flex flex-col items-center gap-1 transition-all ${view === AppView.VOCABULARY ? 'text-[#ffa600]' : 'text-[#8d99ae]'}`}>
          <ShoppingBag size={22} className={view === AppView.VOCABULARY ? 'fill-current' : ''} />
          <span className="text-[9px] font-black uppercase">Pocket</span>
        </button>
      </div>

      <main className="flex-1 md:ml-64 p-4 md:p-12 overflow-y-auto mb-24 md:mb-0 flex flex-col">
        <div className="max-w-4xl mx-auto w-full flex-1">
          {view === AppView.DASHBOARD && (
            <Dashboard 
              progress={progress}
              wordsDue={reviewWords.length}
              newWordsAvailable={newWordsForToday.length}
              newWordsList={newWordsForToday}
              onStartStudy={handleStartStudy}
              onStartReview={handleStartReview}
            />
          )}
          {view === AppView.VOCABULARY && <VocabularyView words={allAvailableWords} progress={progress} />}
        </div>
        
        <footer className="mt-20 py-8 flex flex-col items-center justify-center space-y-2 opacity-30 grayscale hover:grayscale-0 transition-all">
           <div className="flex items-center gap-2 text-[10px] font-black text-[#4b7d78] uppercase tracking-[0.4em]">
              Made By SHELLY
           </div>
           <Heart size={10} className="text-[#ff7b72] fill-current" />
        </footer>
      </main>

      {showStreakModal && (
        <StreakModal 
          onClose={() => setShowStreakModal(false)} 
          streak={currentStreak} 
          words={learnedWords}
        />
      )}

      {(view === AppView.STUDY || view === AppView.REVIEW) && (
        <div className="fixed inset-0 bg-[#f7f9e4] z-50 overflow-hidden flex flex-col">
          <StudyView 
            words={sessionWords}
            onFinish={handleFinishSession}
            onFeedback={handleFeedback}
          />
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes zoomIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .animate-zoomIn { animation: zoomIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
      `}</style>
    </div>
  );
};

export default App;
