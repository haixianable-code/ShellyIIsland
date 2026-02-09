
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { AppView, Word, FeedbackQuality } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import StudyView from './components/StudyView';
import VocabularyView from './components/VocabularyView';
import MobileSettings from './components/MobileSettings';
import WordDetailModal from './components/WordDetailModal';
import StreakModal from './components/StreakModal';
import DailyHarvestModal from './components/DailyHarvestModal';
import SyncCompleteModal from './components/SyncCompleteModal';
import ProfileEntryModal from './components/ProfileEntryModal';
import ReturningWelcomeModal from './components/ReturningWelcomeModal';
import AchievementShareModal from './components/AchievementShareModal';
import { AuthView } from './components/AuthView';
import WelcomeView from './components/WelcomeView';
import { useSRS } from './hooks/useSRS';
import { useUserStats } from './hooks/useUserStats';
import { useProfile } from './hooks/useProfile';
import { Heart, Home, ShoppingBag, Leaf, Loader2, Cloud, CloudOff, Menu } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { isSupabaseConfigured, supabase } from './services/supabaseClient';
import { initAudioSystem } from './utils/audio'; // Import Audio Init
import { useTranslation } from 'react-i18next';

const App: React.FC = () => {
  const { t } = useTranslation();
  const [view, setView] = useState<AppView>(AppView.DASHBOARD);
  const [sessionWords, setSessionWords] = useState<Word[]>([]);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [showHarvestModal, setShowHarvestModal] = useState(false);
  const [sessionVersion, setSessionVersion] = useState(0);
  const [isBlitzMode, setIsBlitzMode] = useState(false);

  // --- Auth & Data Hooks Integration ---
  const { user, authChecking } = useAuth();
  const [isGuest, setIsGuest] = useState(false);
  const [showAuthView, setShowAuthView] = useState(false);
  const [showSyncCelebration, setShowSyncCelebration] = useState(false);
  const [showReturningWelcome, setShowReturningWelcome] = useState(false);
  const [showAchievementShare, setShowAchievementShare] = useState(false);
  
  // Profile Hook
  const { profile, updateProfile, loading: profileLoading } = useProfile(user);

  // 1. Initialize Audio System on App Mount
  useEffect(() => {
    initAudioSystem();
  }, []);
  
  const { 
    progress, 
    allAvailableWords, 
    reviewWords, 
    newWordsForToday, 
    unlearnedExtraWords,
    learnedToday,
    updateProgress, 
    wordMap,
    addExtraWordsToProgress,
    loadingSrs,
    syncStatus 
  } = useSRS(user); 

  const { stats, showStreakModal, setShowStreakModal, loadingStats } = useUserStats(progress);

  const learnedWords = useMemo(() => {
    return allAvailableWords.filter(w => progress[w.id]);
  }, [allAvailableWords, progress]);
  
  // Check for Celebration Flag or Welcome Flag on User Load
  useEffect(() => {
    if (user) {
      if (sessionStorage.getItem('show_sync_celebration') === 'true') {
         setShowSyncCelebration(true);
         sessionStorage.removeItem('show_sync_celebration');
      } else if (!sessionStorage.getItem('session_welcomed')) {
         // Show returning welcome only once per session if not doing initial sync celebration
         setShowReturningWelcome(true);
      }
    }
  }, [user]);

  const handleLoginRequest = useCallback(() => {
    setIsGuest(false);
    setShowAuthView(true);
  }, []);
  
  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
      setIsGuest(false);
      setShowAuthView(false);
      sessionStorage.removeItem('session_welcomed');
      window.location.reload();
    }
  };


  const handleStartStudy = useCallback(() => {
    if (newWordsForToday.length === 0) return;
    setIsBlitzMode(false);
    setSessionVersion(v => v + 1);
    setSessionWords([...newWordsForToday]);
    setView(AppView.STUDY);
  }, [newWordsForToday]);

  const handleStartReview = useCallback(() => {
    if (reviewWords.length === 0) return;
    setIsBlitzMode(false);
    setSessionVersion(v => v + 1);
    setSessionWords([...reviewWords]);
    setView(AppView.REVIEW);
  }, [reviewWords]);

  const handleStartExtraStudy = useCallback((selected: Word[]) => {
    if (selected.length === 0) return;
    setIsBlitzMode(false);
    setSessionVersion(v => v + 1);
    addExtraWordsToProgress(selected);
    setSessionWords([...selected]);
    setView(AppView.STUDY);
  }, [addExtraWordsToProgress]);

  const handleStartBlitz = useCallback((wordsToReview?: Word[]) => {
    const targetWords = wordsToReview || learnedToday;
    if (targetWords.length === 0) return;
    setIsBlitzMode(true);
    setSessionVersion(v => v + 1);
    setSessionWords([...targetWords].sort(() => 0.5 - Math.random()));
    setShowHarvestModal(false);
    setView(AppView.STUDY);
  }, [learnedToday]);

  const handleGetSeedPack = useCallback(() => {
    if (unlearnedExtraWords.length === 0) return;
    const pack = unlearnedExtraWords.slice(0, 10);
    addExtraWordsToProgress(pack);
  }, [unlearnedExtraWords, addExtraWordsToProgress]);

  const handleFinishSession = useCallback(() => {
    setView(AppView.DASHBOARD);
    setIsBlitzMode(false);
  }, []);

  const handleFeedback = useCallback(async (wordId: string, quality: FeedbackQuality) => {
    if (isBlitzMode) return; 
    const needsRetry = await updateProgress(wordId, quality);
    if (needsRetry) {
      const word = wordMap.get(wordId);
      if (word) setSessionWords(prev => [...prev, word]);
    }
  }, [updateProgress, wordMap, isBlitzMode]);

  const openWordDetail = useCallback((word: Word) => {
    setSelectedWord(word);
  }, []);

  const handleSaveProfileName = async (name: string) => {
    await updateProfile({ traveler_name: name });
  };

  const handleCloseReturningWelcome = () => {
    setShowReturningWelcome(false);
    sessionStorage.setItem('session_welcomed', 'true');
  };

  const studySessionKey = useMemo(() => `session-${sessionVersion}`, [sessionVersion]);

  // Determine traveler display name
  const travelerName = useMemo(() => {
    if (profile?.traveler_name) return profile.traveler_name;
    if (user?.email) return user.email.split('@')[0];
    return t('ui.auth.anonymous');
  }, [profile, user, t]);

  // --- 1. Loading State for Authentication Check ---
  if (authChecking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7f9e4] text-center">
        <div className="bg-white p-6 rounded-[2.5rem] shadow-lg border-4 border-[#e0d9b4] animate-bounce">
          <Leaf className="text-[#8bc34a] w-12 h-12 fill-current" />
        </div>
        <div className="mt-6 flex items-center gap-2 text-[#4b7d78] font-black uppercase tracking-[0.2em]">
           <Loader2 className="animate-spin" /> Connecting to Island...
        </div>
      </div>
    );
  }

  // --- 2. New Welcome / Auth Flow ---
  if (isSupabaseConfigured && !user && !isGuest) {
    if (showAuthView) {
      return <AuthView onBack={() => setShowAuthView(false)} />;
    }
    return (
      <WelcomeView
        onSelectGuest={() => setIsGuest(true)}
        onSelectAuth={() => setShowAuthView(true)}
      />
    );
  }


  // --- 3. Main App Render (Logged in, Guest, or Offline) ---
  if (loadingSrs) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7f9e4] text-center">
        <div className="bg-white p-6 rounded-[2.5rem] shadow-lg border-4 border-[#e0d9b4]">
          <Leaf className="text-[#8bc34a] w-12 h-12 animate-pulse fill-current" />
        </div>
        <p className="mt-6 text-lg font-black text-[#4b7d78] uppercase tracking-[0.2em]">Waking up the island...</p>
      </div>
    );
  }

  const SyncIndicator = () => {
    switch (syncStatus) {
      case 'syncing': return <span title="Syncing..."><Loader2 size={12} className="animate-spin text-blue-500" /></span>;
      case 'synced': return <span title="Synced"><Cloud size={12} className="text-green-500" /></span>;
      case 'error': return <span title="Sync failed, offline mode."><CloudOff size={12} className="text-red-500" /></span>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row selection:bg-[#ffd3b6] selection:text-[#e67e22]">
      <Sidebar 
        currentView={view} 
        setView={setView}
        user={user}
        displayName={travelerName}
        isSupabaseConfigured={isSupabaseConfigured}
        onLoginRequest={handleLoginRequest}
        onLogout={handleLogout}
        onShareAchievement={() => setShowAchievementShare(true)}
      />
      
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-4 border-[#e0d9b4] flex justify-around items-center p-3 pb-5 z-40 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <button onClick={() => setView(AppView.DASHBOARD)} className={`flex flex-col items-center gap-1 transition-all w-16 ${view === AppView.DASHBOARD ? 'text-[#ffa600]' : 'text-[#8d99ae]'}`}>
          <Home size={22} className={view === AppView.DASHBOARD ? 'fill-current' : ''} />
          <span className="text-[9px] font-black uppercase">{t('ui.nav.home')}</span>
        </button>
        <button onClick={() => setView(AppView.VOCABULARY)} className={`flex flex-col items-center gap-1 transition-all w-16 ${view === AppView.VOCABULARY ? 'text-[#ffa600]' : 'text-[#8d99ae]'}`}>
          <ShoppingBag size={22} className={view === AppView.VOCABULARY ? 'fill-current' : ''} />
          <span className="text-[9px] font-black uppercase">{t('ui.nav.pocket')}</span>
        </button>
        <button onClick={() => setView(AppView.SETTINGS)} className={`flex flex-col items-center gap-1 transition-all w-16 ${view === AppView.SETTINGS ? 'text-[#ffa600]' : 'text-[#8d99ae]'}`}>
           <Menu size={22} />
           <span className="text-[9px] font-black uppercase">{t('ui.nav.menu')}</span>
        </button>
      </div>

      <main className="flex-1 md:ml-72 p-4 md:p-12 overflow-y-auto mb-24 md:mb-0 flex flex-col">
        {/* Desktop Header Sync Indicator */}
        <div className="hidden md:flex absolute top-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] text-[#4b7d78] font-black border border-[#e0d9b4] items-center gap-2">
             {user ? (
               <>
                 <SyncIndicator />
                 <span>{user.email}</span>
               </>
             ) : (
                <span className="text-[#8d99ae]">Guest Mode</span>
             )}
        </div>

        <div className="max-w-4xl mx-auto w-full flex-1">
          {view === AppView.DASHBOARD ? (
            <Dashboard 
              progress={progress}
              stats={stats}
              wordsDue={reviewWords.length}
              newWordsAvailable={newWordsForToday.length}
              unlearnedExtraWords={unlearnedExtraWords}
              newWordsList={newWordsForToday}
              learnedToday={learnedToday}
              onStartStudy={handleStartStudy}
              onStartReview={handleStartReview}
              onGetSeedPack={handleGetSeedPack}
              onWordClick={openWordDetail}
              onViewAllHarvest={() => setShowHarvestModal(true)}
            />
          ) : view === AppView.VOCABULARY ? (
            <VocabularyView 
              words={allAvailableWords} 
              progress={progress} 
              onWordClick={openWordDetail}
              onAddExtraWords={addExtraWordsToProgress}
              onStartExtraStudy={handleStartExtraStudy}
            />
          ) : view === AppView.SETTINGS ? (
            <MobileSettings
              user={user}
              stats={stats}
              displayName={travelerName}
              isSupabaseConfigured={isSupabaseConfigured}
              onLoginRequest={handleLoginRequest}
              onLogout={handleLogout}
              onShareAchievement={() => setShowAchievementShare(true)}
            />
          ) : null}
        </div>
        
        {view !== AppView.SETTINGS && (
          <footer className="mt-8 py-8 flex flex-col items-center justify-center space-y-2 opacity-30 grayscale hover:grayscale-0 transition-all">
             <div className="flex items-center gap-2 text-[10px] font-black text-[#4b7d78] uppercase tracking-[0.4em]">Made By SHELLY</div>
             <Heart size={10} className="text-[#ff7b72] fill-current" />
          </footer>
        )}
      </main>

      {(view === AppView.STUDY || view === AppView.REVIEW) && (
        <div className={`fixed inset-0 z-50 overflow-hidden flex flex-col ${isBlitzMode ? 'bg-[#f3e5f5]' : 'bg-[#f7f9e4]'}`}>
          <StudyView 
            key={studySessionKey}
            user={user}
            words={sessionWords}
            dailyHarvest={learnedToday}
            unlearnedExtra={unlearnedExtraWords}
            onFinish={handleFinishSession}
            onFeedback={handleFeedback}
            onStartExtra={handleStartExtraStudy}
            isBlitz={isBlitzMode}
            isGuest={isGuest}
            onLoginRequest={handleLoginRequest}
            userStats={stats} 
          />
        </div>
      )}

      {/* Profile Name Entry Modal - If logged in but no name found yet */}
      {user && !profile?.traveler_name && !profileLoading && (
        <ProfileEntryModal onSave={handleSaveProfileName} />
      )}

      {/* Returning Welcome Modal */}
      {showReturningWelcome && (
        <ReturningWelcomeModal 
          name={travelerName}
          reviewsCount={reviewWords.length}
          newSeedsCount={newWordsForToday.length}
          streak={stats?.current_streak || 0}
          onEnter={handleCloseReturningWelcome}
        />
      )}

      {/* Total Achievement Share Modal */}
      {showAchievementShare && (
        <AchievementShareModal 
          name={travelerName}
          totalWords={stats?.total_words_learned || 0}
          streak={stats?.current_streak || 0}
          onClose={() => setShowAchievementShare(false)}
        />
      )}

      {showSyncCelebration && (
        <SyncCompleteModal onClose={() => setShowSyncCelebration(false)} />
      )}

      {showStreakModal && stats && stats.current_streak > 1 && (
        <StreakModal 
          streak={stats.current_streak}
          words={learnedWords}
          onClose={() => setShowStreakModal(false)}
        />
      )}

      {showHarvestModal && (
        <DailyHarvestModal 
          words={learnedToday}
          progress={progress}
          onClose={() => setShowHarvestModal(false)}
          onWordClick={openWordDetail}
          onStartBlitz={handleStartBlitz}
        />
      )}

      {selectedWord && (
        <WordDetailModal word={selectedWord} onClose={() => setSelectedWord(null)} />
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes zoomIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes wiggle { 
          0%, 100% { transform: rotate(0deg); } 
          25% { transform: rotate(-2deg); } 
          75% { transform: rotate(2deg); } 
        }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .animate-zoomIn { animation: zoomIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .animate-wiggle { animation: wiggle 0.3s ease-in-out; }
        .handwritten { font-family: 'Kalam', cursive; }
      `}</style>
    </div>
  );
};

export default App;
