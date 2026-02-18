
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
  
  const { reviewWords, newWordsForToday, learnedToday, allAvailableWords } = useSRS(); 

  const handleStartStudy = useCallback(() => {
    if (newWordsForToday.length === 0) return;
    setSessionVersion(v => v + 1);
    setSessionWords([...newWordsForToday]);
    navigate('/study');
  }, [newWordsForToday, navigate]);

  const handleStartReview = useCallback(() => {
    if (reviewWords.length === 0) return;
    setSessionVersion(v => v + 1);
    setSessionWords([...reviewWords]);
    navigate('/review');
  }, [reviewWords, navigate]);

  // 重写 ModalManager 中的对应逻辑调用
  useEffect(() => {
    const store = useIslandStore.getState();
    const originalOpenModal = store.openModal;
    store.openModal = (modal: string, data?: any) => {
      if (modal === 'STUDY_NOW') handleStartStudy();
      else if (modal === 'REVIEW_NOW') handleStartReview();
      else originalOpenModal(modal, data);
    };
  }, [handleStartStudy, handleStartReview]);

  if (authChecking || islandLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7f9e4] text-center">
        <div className="bg-white p-6 rounded-[2.5rem] shadow-lg border-4 border-[#e0d9b4] animate-bounce">
          <Leaf className="text-[#8bc34a] w-12 h-12 fill-current" />
        </div>
        <div className="mt-6 flex items-center gap-2 text-[#4b7d78] font-black uppercase tracking-[0.2em]">
           <Loader2 className="animate-spin" /> Connecting Lab...
        </div>
      </div>
    );
  }

  if (isSupabaseConfigured && !user && !isGuest) {
    if (showAuthView) return <AuthView onBack={() => setShowAuthView(false)} />;
    return <WelcomeView onSelectGuest={() => setIsGuest(true)} onSelectAuth={() => setShowAuthView(true)} />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Sidebar 
        currentView={currentView} setView={(v) => navigate(v === AppView.BLOG ? '/stories' : v === AppView.VOCABULARY ? '/pocket' : v === AppView.SETTINGS ? '/menu' : '/')} user={user} displayName={profile?.traveler_name || user?.email?.split('@')[0] || 'Learner'}
        isSupabaseConfigured={isSupabaseConfigured} onLoginRequest={() => setShowAuthView(true)}
        onLogout={() => (supabase?.auth as any).signOut().then(() => window.location.reload())} onShareAchievement={() => openModal('ACHIEVEMENT')}
      />
      
      {/* 底部移动端导航栏 - 已添加 Newspaper (博客) 按钮 */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-4 border-[#e0d9b4] flex justify-around items-center p-3 pb-5 z-40">
        <button onClick={() => navigate('/')} className={`flex flex-col items-center gap-1 transition-all w-14 ${currentView === AppView.DASHBOARD ? 'text-[#ffa600]' : 'text-[#8d99ae]'}`}>
          <Home size={20} className={currentView === AppView.DASHBOARD ? 'fill-current' : ''} />
          <span className="text-[8px] font-black uppercase">{t('ui.nav.home')}</span>
        </button>
        <button onClick={() => navigate('/stories')} className={`flex flex-col items-center gap-1 transition-all w-14 ${currentView === AppView.BLOG ? 'text-[#ffa600]' : 'text-[#8d99ae]'}`}>
          <Newspaper size={20} className={currentView === AppView.BLOG ? 'fill-current' : ''} />
          <span className="text-[8px] font-black uppercase">{t('ui.nav.stories')}</span>
        </button>
        <button onClick={() => navigate('/pocket')} className={`flex flex-col items-center gap-1 transition-all w-14 ${currentView === AppView.VOCABULARY ? 'text-[#ffa600]' : 'text-[#8d99ae]'}`}>
          <ShoppingBag size={20} className={currentView === AppView.VOCABULARY ? 'fill-current' : ''} />
          <span className="text-[8px] font-black uppercase">{t('ui.nav.pocket')}</span>
        </button>
        <button onClick={() => navigate('/menu')} className={`flex flex-col items-center gap-1 transition-all w-14 ${currentView === AppView.SETTINGS ? 'text-[#ffa600]' : 'text-[#8d99ae]'}`}>
           <Menu size={20} />
           <span className="text-[8px] font-black uppercase">{t('ui.nav.menu')}</span>
        </button>
      </nav>

      <main className="flex-1 md:ml-72 p-4 md:p-12 overflow-y-auto mb-24 md:mb-0">
        <div className="max-w-4xl mx-auto w-full">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/pocket" element={<VocabularyView words={allAvailableWords} progress={progress} onWordClick={(w) => openModal('WORD_DETAIL', w)} onAddExtraWords={addExtraWords} onStartExtraStudy={(s) => { setSessionWords(s); navigate('/study'); }} />} />
              <Route path="/stories" element={<BlogView />} />
              <Route path="/stories/:slug" element={<BlogView />} />
              <Route path="/menu" element={<MobileSettings user={user} stats={stats} displayName={profile?.traveler_name || 'Learner'} isSupabaseConfigured={isSupabaseConfigured} onLoginRequest={() => setShowAuthView(true)} onLogout={() => (supabase?.auth as any).signOut()} onShareAchievement={() => openModal('ACHIEVEMENT')} />} />
              <Route path="/study" element={<div className="fixed inset-0 z-50 overflow-hidden flex flex-col bg-[#f7f9e4]"><StudyView key={`session-${sessionVersion}`} user={user} words={sessionWords} dailyHarvest={learnedToday} onFinish={() => navigate('/')} onFeedback={updateProgress} userStats={stats} onLoginRequest={() => setShowAuthView(true)} /></div>} />
              <Route path="/review" element={<div className="fixed inset-0 z-50 overflow-hidden flex flex-col bg-[#f7f9e4]"><StudyView key={`session-${sessionVersion}`} user={user} words={sessionWords} dailyHarvest={learnedToday} onFinish={() => navigate('/')} onFeedback={updateProgress} userStats={stats} onLoginRequest={() => setShowAuthView(true)} /></div>} />
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
  return <Router><AppContent /></Router>;
};

export default App;