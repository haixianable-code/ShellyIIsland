
import React, { useState, useCallback, useMemo } from 'react';
import { AppView, Word, FeedbackQuality } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import StudyView from './components/StudyView';
import VocabularyView from './components/VocabularyView';
import WordDetailModal from './components/WordDetailModal';
import { useSRS } from './hooks/useSRS';
import { Heart, Home, ShoppingBag } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.DASHBOARD);
  const [sessionWords, setSessionWords] = useState<Word[]>([]);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  // Version counter to force fresh component mounting
  const [sessionVersion, setSessionVersion] = useState(0);
  
  const { 
    progress, 
    allAvailableWords, 
    reviewWords, 
    newWordsForToday, 
    unlearnedExtraWords,
    learnedToday,
    updateProgress,
    wordMap,
    addExtraWordsToProgress
  } = useSRS();

  const handleStartStudy = useCallback(() => {
    if (newWordsForToday.length === 0) return;
    setSessionVersion(v => v + 1);
    setSessionWords([...newWordsForToday]);
    setView(AppView.STUDY);
  }, [newWordsForToday]);

  const handleStartReview = useCallback(() => {
    if (reviewWords.length === 0) return;
    setSessionVersion(v => v + 1);
    setSessionWords([...reviewWords]);
    setView(AppView.REVIEW);
  }, [reviewWords]);

  const handleStartExtraStudy = useCallback((selected: Word[]) => {
    if (selected.length === 0) return;
    // Increment version to force StudyView to remount and reset internal isSummaryView state
    setSessionVersion(v => v + 1);
    setSessionWords([...selected]);
    setView(AppView.STUDY);
  }, []);

  const handleFinishSession = useCallback(() => {
    setView(AppView.DASHBOARD);
  }, []);

  const handleFeedback = useCallback((wordId: string, quality: FeedbackQuality) => {
    const needsRetry = updateProgress(wordId, quality);
    if (needsRetry) {
      const word = wordMap.get(wordId);
      if (word) setSessionWords(prev => [...prev, word]);
    }
  }, [updateProgress, wordMap]);

  const openWordDetail = useCallback((word: Word) => {
    setSelectedWord(word);
  }, []);

  // Use sessionVersion in key to ensure component is fully replaced
  const studySessionKey = useMemo(() => 
    `session-${sessionVersion}`, 
    [sessionVersion]
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row selection:bg-[#ffd3b6] selection:text-[#e67e22]">
      <Sidebar 
        currentView={view} 
        setView={setView} 
      />
      
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-4 border-[#e0d9b4] flex justify-around items-center p-3 pb-5 z-40 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <button onClick={() => setView(AppView.DASHBOARD)} className={`flex flex-col items-center gap-1 transition-all ${view === AppView.DASHBOARD ? 'text-[#ffa600]' : 'text-[#8d99ae]'}`}>
          <Home size={22} className={view === AppView.DASHBOARD ? 'fill-current' : ''} />
          <span className="text-[9px] font-black uppercase">Home</span>
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
              learnedToday={learnedToday}
              onStartStudy={handleStartStudy}
              onStartReview={handleStartReview}
              onWordClick={openWordDetail}
            />
          )}
          {view === AppView.VOCABULARY && (
            <VocabularyView 
              words={allAvailableWords} 
              progress={progress} 
              onWordClick={openWordDetail}
              onAddExtraWords={addExtraWordsToProgress}
            />
          )}
        </div>
        
        <footer className="mt-20 py-8 flex flex-col items-center justify-center space-y-2 opacity-30 grayscale hover:grayscale-0 transition-all">
           <div className="flex items-center gap-2 text-[10px] font-black text-[#4b7d78] uppercase tracking-[0.4em]">
              Made By SHELLY
           </div>
           <Heart size={10} className="text-[#ff7b72] fill-current" />
        </footer>
      </main>

      {/* Overlays */}
      {(view === AppView.STUDY || view === AppView.REVIEW) && (
        <div className="fixed inset-0 bg-[#f7f9e4] z-50 overflow-hidden flex flex-col">
          <StudyView 
            key={studySessionKey}
            words={sessionWords}
            unlearnedExtra={unlearnedExtraWords}
            onFinish={handleFinishSession}
            onFeedback={handleFeedback}
            onStartExtra={handleStartExtraStudy}
          />
        </div>
      )}

      {selectedWord && (
        <WordDetailModal 
          word={selectedWord} 
          onClose={() => setSelectedWord(null)} 
        />
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes zoomIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .animate-zoomIn { animation: zoomIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
      `}</style>
    </div>
  );
};

export default App;
