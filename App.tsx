
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { BrowserRouter, HashRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AppView, Word, FeedbackQuality } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import StudyView from './components/StudyView';
import VocabularyView from './components/VocabularyView';
import BlogView from './components/BlogView';
import MobileSettings from './components/MobileSettings';
import ModalManager from './components/ModalManager';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthView } from './components/AuthView';
import WelcomeView from './components/WelcomeView';
import { useSRS } from './hooks/useSRS';
import { Leaf, Loader2, Cloud, CloudOff, Menu, Newspaper, Home, ShoppingBag } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { isSupabaseConfigured, supabase } from './services/supabaseClient';
import { initAudioSystem } from './utils/audio'; 
import { useTranslation } from 'react-i18next';
import { useIslandStore } from './store/useIslandStore';

const AppContent: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { 
    initialize, syncStatus, loading: islandLoading, 
    openModal, wordMap, progress, stats, profile,
    updateProgress, addExtraWords
  } = useIslandStore();

  const [sessionWords, setSessionWords] = useState<Word[]>([]);
  const [sessionVersion, setSessionVersion] = useState(0);
  const [isBlitzMode, setIsBlitzMode] = useState(false);

  const { user, authChecking } = useAuth();
  const [isGuest, setIsGuest] = useState(false);
  const [showAuthView, setShowAuthView] = useState(false);
  
  const currentView = useMemo(() => {
    if (location.pathname.startsWith('/stories')) return AppView.BLOG;
    if (location.pathname === '/pocket') return AppView.VOCABULARY;
    if (location.pathname === '/menu') return AppView.SETTINGS;
    if (location.pathname === '/study' || location.pathname === '/review') return AppView.STUDY;
    return AppView.DASHBOARD;
  }, [location.pathname]);

  useEffect(() => {
    initAudioSystem();
  }, []);

  useEffect(() => {
    if (!authChecking) {
      initialize(user);
    }
  }, [user, authChecking, initialize]);
  
  const { reviewWords, newWordsForToday, unlearnedExtraWords, learnedToday, allAvailableWords } = useSRS(); 

  useEffect(() => {
    if (user && !islandLoading) {
      if (sessionStorage.getItem('show_sync_celebration') === 'true') {
         openModal('SYNC_COMPLETE');
         sessionStorage.removeItem('show_sync_celebration');
      } else if (!sessionStorage.getItem('session_welcomed')) {
         openModal('RETURNING_WELCOME', { name: profile?.traveler_name || user.email?.split('@')[0] });
         sessionStorage.setItem('session_welcomed', 'true');
      }
    }
  }, [user, islandLoading, profile, openModal]);

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
    navigate('/study');
  }, [newWordsForToday, navigate]);

  const handleStartReview = useCallback(() => {
    if (reviewWords.length === 0) return;
    setIsBlitzMode(false);
    setSessionVersion(v => v + 1);
    setSessionWords([...reviewWords]);
    navigate('/review');
  }, [reviewWords, navigate]);

  const handleStartExtraStudy = useCallback((selected: Word[]) => {
    if (selected.length === 0) return;
    setIsBlitzMode(false);
    setSessionVersion(v => v + 1);
    addExtraWords(selected);
    setSessionWords([...selected]);
    navigate('/study');
  }, [addExtraWords, navigate]);

  const handleFeedback = useCallback(async (wordId: string, quality: FeedbackQuality) => {
    if (isBlitzMode) return; 
    const needsRetry = await updateProgress(wordId, quality);
    if (needsRetry) {
      const word = wordMap.get(wordId);
      if (word) setSessionWords(prev => [...prev, word]);
    }
  }, [updateProgress, wordMap, isBlitzMode]);

  const travelerName = useMemo(() => {
    if (profile?.traveler_name) return profile.traveler_name;
    if (user?.email) return user.email.split('@')[0];
    return t('ui.auth.anonymous');
  }, [profile, user, t]);

  if (authChecking || islandLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7f9e4] text-center">
        <div className="bg-white p-6 rounded-[2.5rem] shadow-lg border-4 border-[#e0d9b4] animate-bounce">
          <Leaf className="text-[#8bc34a] w-12 h-12 fill-current" />
        </div>
        <div className="mt-6 flex items-center gap-2 text-[#4b7d78] font-black uppercase tracking-[0.2em]">
           <Loader2 className="animate-spin" /> Connecting...
        </div>
      </div>
    );
  }

  if (isSupabaseConfigured && !user && !isGuest) {
    if (showAuthView) return <AuthView onBack={() => setShowAuthView(false)} />;
    return <WelcomeView onSelectGuest={() => setIsGuest(true)} onSelectAuth={() => setShowAuthView(true)} />;
  }

  const SyncIndicator = () => {
    switch (syncStatus) {
      case 'syncing': return <span title="Syncing..."><Loader2 size={12} className="animate-spin text-blue-500" /></span>;
      case 'synced': return <span title="Synced"><Cloud size={12} className="text-green-500" /></span>;
      case 'error': return <span title="Sync failed."><CloudOff size={12} className="text-red-500" /></span>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Sidebar 
        currentView={currentView} setView={(v) => navigate(v === AppView.BLOG ? '/stories' : v === AppView.VOCABULARY ? '/pocket' : v === AppView.SETTINGS ? '/menu' : '/')} user={user} displayName={travelerName}
        isSupabaseConfigured={isSupabaseConfigured} onLoginRequest={handleLoginRequest}
        onLogout={handleLogout} onShareAchievement={() => openModal('ACHIEVEMENT', { name: travelerName })}
      />
      
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-4 border-[#e0d9b4] flex justify-around items-center p-3 pb-5 z-40" role="navigation" aria-label="Mobile Bottom Navigation">
        <button onClick={() => navigate('/')} className={`flex flex-col items-center gap-1 transition-all w-16 ${currentView === AppView.DASHBOARD ? 'text-[#ffa600]' : 'text-[#8d99ae]'}`} aria-label="Home">
          <Home size={22} className={currentView === AppView.DASHBOARD ? 'fill-current' : ''} aria-hidden="true" />
          <span className="text-[9px] font-black uppercase">{t('ui.nav.home')}</span>
        </button>
        <button onClick={() => navigate('/pocket')} className={`flex flex-col items-center gap-1 transition-all w-16 ${currentView === AppView.VOCABULARY ? 'text-[#ffa600]' : 'text-[#8d99ae]'}`} aria-label="My Pocket Vocabulary">
          <ShoppingBag size={22} className={currentView === AppView.VOCABULARY ? 'fill-current' : ''} aria-hidden="true" />
          <span className="text-[9px] font-black uppercase">{t('ui.nav.pocket')}</span>
        </button>
        <button onClick={() => navigate('/stories')} className={`flex flex-col items-center gap-1 transition-all w-16 ${currentView === AppView.BLOG ? 'text-[#ffa600]' : 'text-[#8d99ae]'}`} aria-label="Island Stories">
          <Newspaper size={22} className={currentView === AppView.BLOG ? 'fill-current' : ''} aria-hidden="true" />
          <span className="text-[9px] font-black uppercase">Stories</span>
        </button>
        <button onClick={() => navigate('/menu')} className={`flex flex-col items-center gap-1 transition-all w-16 ${currentView === AppView.SETTINGS ? 'text-[#ffa600]' : 'text-[#8d99ae]'}`} aria-label="Menu and Settings">
           <Menu size={22} aria-hidden="true" />
           <span className="text-[9px] font-black uppercase">{t('ui.nav.menu')}</span>
        </button>
      </nav>

      <main className="flex-1 md:ml-72 p-4 md:p-12 overflow-y-auto mb-24 md:mb-0">
        <div className="hidden md:flex absolute top-4 right-4 bg-white/80 px-3 py-1 rounded-full text-[10px] text-[#4b7d78] font-black border border-[#e0d9b4] items-center gap-2">
             {user ? (<><SyncIndicator /><span>{user.email}</span></>) : (<span className="text-[#8d99ae]">Guest Mode</span>)}
        </div>

        <div className="max-w-4xl mx-auto w-full">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={
                <Dashboard 
                  progress={progress} stats={stats} wordsDue={reviewWords.length}
                  newWordsAvailable={newWordsForToday.length} unlearnedExtraWords={unlearnedExtraWords}
                  newWordsList={newWordsForToday} learnedToday={learnedToday}
                  onStartStudy={handleStartStudy} onStartReview={handleStartReview}
                  onGetSeedPack={() => addExtraWords(unlearnedExtraWords.slice(0, 10))}
                  onWordClick={(w) => openModal('WORD_DETAIL', w)}
                  onViewAllHarvest={() => openModal('DAILY_HARVEST')}
                />
              } />
              <Route path="/pocket" element={
                <VocabularyView 
                  words={allAvailableWords} progress={progress} 
                  onWordClick={(w) => openModal('WORD_DETAIL', w)}
                  onAddExtraWords={addExtraWords} onStartExtraStudy={handleStartExtraStudy}
                />
              } />
              <Route path="/stories" element={<BlogView />} />
              <Route path="/stories/:slug" element={<BlogView />} />
              <Route path="/menu" element={
                <MobileSettings
                  user={user} stats={stats} displayName={travelerName}
                  isSupabaseConfigured={isSupabaseConfigured} onLoginRequest={handleLoginRequest}
                  onLogout={handleLogout} onShareAchievement={() => openModal('ACHIEVEMENT', { name: travelerName })}
                />
              } />
              <Route path="/study" element={
                <div className="fixed inset-0 z-50 overflow-hidden flex flex-col bg-[#f7f9e4]">
                   <StudyView key={`session-${sessionVersion}`} user={user} words={sessionWords} dailyHarvest={learnedToday} onFinish={() => navigate('/')} onFeedback={handleFeedback} userStats={stats} onLoginRequest={handleLoginRequest} />
                </div>
              } />
              <Route path="/review" element={
                <div className="fixed inset-0 z-50 overflow-hidden flex flex-col bg-[#f7f9e4]">
                   <StudyView key={`session-${sessionVersion}`} user={user} words={sessionWords} dailyHarvest={learnedToday} onFinish={() => navigate('/')} onFeedback={handleFeedback} userStats={stats} onLoginRequest={handleLoginRequest} />
                </div>
              } />
            </Routes>
          </ErrorBoundary>
        </div>
      </main>

      <ModalManager />
    </div>
  );
};

const App: React.FC = () => {
  const isProduction = window.location.hostname === 'ssisland.space';
  const Router = isProduction ? BrowserRouter : HashRouter;

  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
