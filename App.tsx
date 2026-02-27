
import React, { useEffect, useState, useMemo } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, ShoppingBag, Menu, Leaf, Loader2, Newspaper } from 'lucide-react';
import { supabase } from './services/supabaseClient';
import { useIslandStore } from './store/useIslandStore';
import { useAuth } from './hooks/useAuth';
import { AppView } from './types';
import { initAudioSystem } from './utils/audio';
import { useSRS } from './hooks/useSRS';

// Views
import Dashboard from './components/Dashboard';
import VocabularyView from './components/VocabularyView';
import MobileSettings from './components/MobileSettings';
import StudyView from './components/StudyView';
import WelcomeView from './components/WelcomeView';
import { AuthView } from './components/AuthView';
import Sidebar from './components/Sidebar';
import ErrorBoundary from './components/ErrorBoundary';
import BlogView from './components/BlogView';

const ConnectedStudyView: React.FC = () => {
  const navigate = useNavigate();
  const { sessionQueue, updateProgress, stats, user, activeModal, openModal } = useIslandStore();
  const [isAuthView, setIsAuthView] = useState(false);

  if (isAuthView) {
    return <AuthView onBack={() => setIsAuthView(false)} />;
  }

  return (
    <StudyView 
      words={sessionQueue}
      dailyHarvest={[]} // TODO: Add daily harvest if needed
      onFinish={() => navigate('/')}
      onFeedback={(id, quality) => updateProgress(id, quality)}
      onLoginRequest={() => setIsAuthView(true)}
      userStats={stats}
      user={user}
    />
  );
};

const App: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { 
    initialize, loading: islandLoading, 
    activeModal, closeModal, wordMap, progress, stats, profile,
    updateProgress, addExtraWords,
    setSessionQueue, sessionQueue,
    isSidebarCollapsed // Access sidebar state
  } = useIslandStore();

  const [sessionVersion, setSessionVersion] = useState(0);

  const { user, authChecking } = useAuth();
  const [isGuest, setIsGuest] = useState(false);
  const [showAuthView, setShowAuthView] = useState(false);
  
  const isSupabaseConfigured = !!supabase;

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

  // --- CRITICAL FIX: Safe Modal Navigation Logic ---
  // Replaces the dangerous store.openModal overwrite.
  // We listen to the activeModal state and react if it's a navigation command.
  useEffect(() => {
    if (activeModal === 'STUDY_NOW') {
       if (newWordsForToday.length > 0) {
         setSessionQueue([...newWordsForToday]);
         setSessionVersion(v => v + 1); // Force re-mount of StudyView
         navigate('/study');
       }
       closeModal();
    } else if (activeModal === 'REVIEW_NOW') {
       if (reviewWords.length > 0) {
         setSessionQueue([...reviewWords]);
         setSessionVersion(v => v + 1);
         navigate('/review');
       }
       closeModal();
    }
  }, [activeModal, newWordsForToday, reviewWords, navigate, closeModal, setSessionQueue]);

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
        onLogout={() => (supabase?.auth as any).signOut().then(() => window.location.reload())} onShareAchievement={() => useIslandStore.getState().openModal('ACHIEVEMENT')}
      />
      
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-4 border-[#e0d9b4] flex justify-around items-center p-3 pb-5 z-40">
        <button onClick={() => navigate('/')} className={`flex flex-col items-center gap-1 transition-all w-14 ${currentView === AppView.DASHBOARD ? 'text-[#ffa600]' : 'text-[#8d99ae]'}`}>
          <Home size={20} className={currentView === AppView.DASHBOARD ? 'fill-current' : ''} />
          <span className="text-[8px] font-black uppercase">{t('ui.nav.home')}</span>
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

      <main className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'} p-4 md:p-12 overflow-y-auto mb-24 md:mb-0`}>
        <div className="max-w-7xl mx-auto w-full">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/pocket" element={<VocabularyView />} />
              <Route path="/menu" element={<MobileSettings />} />
              <Route path="/study" element={<ConnectedStudyView key={`study-${sessionVersion}`} />} />
              <Route path="/review" element={<ConnectedStudyView key={`review-${sessionVersion}`} />} />
              <Route path="/stories" element={<BlogView />} />
              <Route path="/stories/:slug" element={<BlogView />} />
            </Routes>
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
};

export default App;
