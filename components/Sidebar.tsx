import React from 'react';
import { AppView } from '../types';
import { User } from '@supabase/supabase-js';
import { Home, Briefcase, Leaf, RotateCcw, Download, Volume2, VolumeX, LogOut, ShieldCheck, ChevronRight, UserPlus, Trophy, Heart, Newspaper, Crown } from 'lucide-react';
import { playClick, playSparkle } from '../utils/sfx';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import { useIslandStore } from '../store/useIslandStore';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  user: User | null;
  displayName: string;
  isSupabaseConfigured: boolean;
  onLoginRequest: () => void;
  onLogout: () => void;
  onShareAchievement: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, user, displayName, isSupabaseConfigured, onLoginRequest, onLogout, onShareAchievement }) => {
  const { t } = useTranslation();
  const { isMuted, setMuted, profile, openModal } = useIslandStore();
  const isGuest = isSupabaseConfigured && !user;
  const isPremium = profile?.is_premium;

  const handleToggleMute = () => {
    playClick();
    setMuted(!isMuted);
  };

  const handleExport = () => {
    playClick();
    const data = localStorage.getItem('hola_word_srs_v4_offline');
    if (!data) return;
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shelly-island-backup.json`;
    a.click();
  };

  const handleReset = () => {
    playClick();
    if (confirm("Reset all progress?")) {
      useIslandStore.getState().resetIsland();
    }
  };

  return (
    <aside className="w-72 bg-[#f9f5da] border-r-4 border-[#e0d9b4] hidden md:flex flex-col h-screen fixed left-0 top-0 z-50 shadow-[10px_0_0_rgba(224,217,180,0.4)]" role="complementary">
      <header className="p-8 pb-4 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#78c850] rounded-[2rem] shadow-[0_6px_0_#5a9a3b] mb-3 border-4 border-white" aria-hidden="true">
          <Leaf className="text-white w-8 h-8 fill-current" />
        </div>
        <div className="text-xl font-black text-[#4b7d78] tracking-tight uppercase">SS Island</div>
      </header>

      <nav className="px-4 py-4 space-y-2" role="navigation" aria-label="Main Navigation Menu">
        <button
          onClick={() => { playClick(); setView(AppView.DASHBOARD); }}
          aria-label="Go to Island Home"
          aria-current={currentView === AppView.DASHBOARD ? 'page' : undefined}
          className={`w-full flex items-center gap-4 px-6 py-4 rounded-[2.2rem] transition-all duration-200 border-b-4 ${currentView === AppView.DASHBOARD ? 'bg-[#ffa600] text-white font-black border-[#cc8400] shadow-md -translate-y-0.5' : 'text-[#8d99ae] hover:bg-white/50 border-transparent'}`}
        >
          <Home size={22} className={currentView === AppView.DASHBOARD ? 'fill-current' : ''} aria-hidden="true" />
          <span className="text-base font-black uppercase tracking-tight">{t('ui.nav.home')}</span>
        </button>
        <button
          onClick={() => { playClick(); setView(AppView.VOCABULARY); }}
          aria-label="Go to My Pocket Vocabulary"
          aria-current={currentView === AppView.VOCABULARY ? 'page' : undefined}
          className={`w-full flex items-center gap-4 px-6 py-4 rounded-[2.2rem] transition-all duration-200 border-b-4 ${currentView === AppView.VOCABULARY ? 'bg-[#ffa600] text-white font-black border-[#cc8400] shadow-md -translate-y-0.5' : 'text-[#8d99ae] hover:bg-white/50 border-transparent'}`}
        >
          <Briefcase size={22} className={currentView === AppView.VOCABULARY ? 'fill-current' : ''} aria-hidden="true" />
          <span className="text-base font-black uppercase tracking-tight">{t('ui.nav.pocket')}</span>
        </button>
        <button
          onClick={() => { playClick(); setView(AppView.BLOG); }}
          aria-label="Go to Island Stories and Articles"
          aria-current={currentView === AppView.BLOG ? 'page' : undefined}
          className={`w-full flex items-center gap-4 px-6 py-4 rounded-[2.2rem] transition-all duration-200 border-b-4 ${currentView === AppView.BLOG ? 'bg-[#ffa600] text-white font-black border-[#cc8400] shadow-md -translate-y-0.5' : 'text-[#8d99ae] hover:bg-white/50 border-transparent'}`}
        >
          <Newspaper size={22} className={currentView === AppView.BLOG ? 'fill-current' : ''} aria-hidden="true" />
          <span className="text-base font-black uppercase tracking-tight">Island Stories</span>
        </button>
      </nav>

      <section className="px-4 py-4" aria-label="User Account Status">
        <div className="text-[10px] font-black text-[#8d99ae] uppercase tracking-[0.3em] mb-3 pl-4">Citizenship</div>
        {isGuest ? (
          <button 
            onClick={() => { playSparkle(); onLoginRequest(); }}
            aria-label="Apply for official island citizenship"
            className="w-full text-left bg-[#2d4a47] p-5 rounded-[2.5rem] border-4 border-[#4b7d78] shadow-[0_8px_0_rgba(0,0,0,0.1)] hover:-translate-y-1 hover:shadow-lg transition-all group overflow-hidden relative"
          >
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '12px 12px' }} />
            <div className="flex items-center gap-4 relative z-10">
               <div className="bg-[#ff7b72] p-2.5 rounded-xl border-2 border-white/20 shadow-inner">
                  <UserPlus className="text-white" size={20} aria-hidden="true" />
               </div>
               <div className="flex-1">
                  <div className="text-white text-xs font-black uppercase leading-none mb-1">Apply Citizen</div>
                  <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">Guest Mode</p>
               </div>
               <ChevronRight className="text-white/20 group-hover:translate-x-1 transition-transform" size={16} aria-hidden="true" />
            </div>
          </button>
        ) : user ? (
          <div className="space-y-2">
            <button 
               onClick={() => { playClick(); setView(AppView.SETTINGS); }}
               aria-label={`Settings for ${displayName}`}
               className={`w-full text-left bg-white p-5 rounded-[2.5rem] border-4 ${currentView === AppView.SETTINGS ? 'border-[#ffa600]' : 'border-[#e0d9b4]'} shadow-sm relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-md group`}
            >
               <div className="flex items-center gap-4">
                  <div className={`${isPremium ? 'bg-[#ffa600]' : 'bg-[#78c850]'} p-2.5 rounded-xl border-2 border-white shadow-inner transition-colors`}>
                     {isPremium ? <Crown className="text-white" size={20} /> : <ShieldCheck className="text-white" size={20} />}
                  </div>
                  <div className="flex-1 min-w-0">
                     <div className="text-[#4b7d78] text-xs font-black uppercase leading-none mb-1 truncate">{displayName}</div>
                     <p className={`${isPremium ? 'text-[#ffa600]' : 'text-[#8bc34a]'} text-[9px] font-black uppercase tracking-widest`}>
                       {isPremium ? 'SSI SUPPORTER' : 'SSI CITIZEN'}
                     </p>
                  </div>
               </div>
               <div className={`absolute -right-2 -bottom-2 text-[10px] font-black border-2 ${isPremium ? 'border-[#ffa600]/20 text-[#ffa600]/20' : 'border-[#8bc34a]/10 text-[#8bc34a]/10'} px-2 py-0.5 rounded rotate-12`}>
                 {isPremium ? 'PREMIUM' : 'OFFICIAL'}
               </div>
            </button>
            
            {!isPremium && (
              <button 
                onClick={() => { playSparkle(); openModal('SUBSCRIPTION'); }}
                aria-label="Upgrade to SSI Supporter"
                className="w-full bg-gradient-to-r from-[#ffa600] to-[#ff7b72] text-white flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-md hover:scale-[1.02] active:scale-95 transition-all animate-glow"
              >
                 <Crown size={14} aria-hidden="true" />
                 <span>Become Supporter</span>
              </button>
            )}

            <button 
               onClick={() => { playSparkle(); onShareAchievement(); }}
               aria-label="Share your island achievements"
               className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#ff7b72]/10 text-[#ff7b72] font-black text-[10px] uppercase tracking-widest hover:bg-[#ff7b72]/20 transition-all border border-dashed border-[#ff7b72]/30"
            >
               <Trophy size={14} aria-hidden="true" />
               <span>{t('ui.passport.share_history')}</span>
            </button>
          </div>
        ) : null}
      </section>

      <footer className="flex-1 flex flex-col justify-end px-4 py-8 space-y-4">
        <div className="space-y-1 bg-black/5 p-4 rounded-[2rem] border-2 border-transparent">
          <div className="px-2 mb-2 flex justify-center">
            <LanguageSwitcher />
          </div>
          
          <button onClick={handleToggleMute} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[#8d99ae] hover:text-[#4b7d78] hover:bg-white/50 transition-all text-sm font-bold" aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}>
            {isMuted ? <VolumeX size={18} aria-hidden="true" /> : <Volume2 size={18} aria-hidden="true" />}
            <span>{isMuted ? t('ui.actions.sound_off') : t('ui.actions.sound_on')}</span>
          </button>

          <button onClick={handleExport} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[#8d99ae] hover:text-[#4b7d78] hover:bg-white/50 transition-all text-sm font-bold" aria-label="Backup your island progress">
            <Download size={18} aria-hidden="true" />
            <span>{t('ui.actions.backup')}</span>
          </button>
        </div>

        <div className="px-2">
          {user ? (
            <button onClick={onLogout} className="w-full bg-[#ff7b72] text-white flex items-center justify-center gap-2 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-[0_4px_0_#d32f2f] active:translate-y-1 transition-all" aria-label="Logout from island">
              <LogOut size={16} aria-hidden="true" />
              <span>{t('ui.actions.logout')}</span>
            </button>
          ) : (
            <button onClick={handleReset} className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-[#d32f2f]/30 font-black text-xs uppercase tracking-widest hover:text-[#d32f2f] transition-colors" aria-label="Reset local island data">
              <RotateCcw size={14} aria-hidden="true" />
              <span>{t('ui.actions.reset')}</span>
            </button>
          )}
        </div>
        
        <div className="flex flex-col items-center opacity-10 gap-1 mt-2">
           <div className="flex items-center gap-1.5 text-[7px] font-black text-[#4b7d78] uppercase tracking-[0.4em]">Made By SHELLY</div>
           <Heart size={6} className="text-[#ff7b72] fill-current" aria-hidden="true" />
        </div>
      </footer>
    </aside>
  );
};

export default Sidebar;