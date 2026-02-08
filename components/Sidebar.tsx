
import React, { useRef, useState } from 'react';
import { AppView } from '../types';
import { User } from '@supabase/supabase-js';
import { Home, Briefcase, Leaf, Heart, RotateCcw, Download, Volume2, VolumeX, CloudUpload, LogOut, ShieldAlert, ShieldCheck, Fingerprint, ChevronRight } from 'lucide-react';
import { toggleMute, getMuteState, playClick, playSparkle } from '../utils/sfx';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  user: User | null;
  isSupabaseConfigured: boolean;
  onLoginRequest: () => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, user, isSupabaseConfigured, onLoginRequest, onLogout }) => {
  const { t } = useTranslation();
  const [isMuted, setIsMuted] = useState(getMuteState());
  const isGuest = isSupabaseConfigured && !user;

  const handleToggleMute = () => {
    playClick();
    const newState = toggleMute();
    setIsMuted(newState);
  };

  const handleExport = () => {
    playClick();
    const data = localStorage.getItem('hola_word_srs_v3_offline');
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
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <aside className="w-72 bg-[#f9f5da] border-r-4 border-[#e0d9b4] hidden md:flex flex-col h-screen fixed left-0 top-0 z-50 shadow-[10px_0_0_rgba(224,217,180,0.4)]">
      {/* Logo Section */}
      <div className="p-8 pb-4 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#78c850] rounded-[2rem] shadow-[0_6px_0_#5a9a3b] mb-3 border-4 border-white">
          <Leaf className="text-white w-8 h-8 fill-current" />
        </div>
        <h1 className="text-lg font-black text-[#4b7d78] tracking-tight uppercase italic">Shelly Island</h1>
      </div>

      {/* Main Navigation */}
      <nav className="px-4 py-4 space-y-3">
        <button
          onClick={() => { playClick(); setView(AppView.DASHBOARD); }}
          className={`w-full flex items-center gap-4 px-6 py-4 rounded-[2rem] transition-all duration-200 border-b-4 ${currentView === AppView.DASHBOARD ? 'bg-[#ffa600] text-white font-black border-[#cc8400] shadow-md -translate-y-0.5' : 'text-[#8d99ae] hover:bg-white/50 border-transparent'}`}
        >
          <Home size={22} className={currentView === AppView.DASHBOARD ? 'fill-current' : ''} />
          <span className="text-base font-black uppercase tracking-tight">{t('ui.nav.home')}</span>
        </button>
        <button
          onClick={() => { playClick(); setView(AppView.VOCABULARY); }}
          className={`w-full flex items-center gap-4 px-6 py-4 rounded-[2rem] transition-all duration-200 border-b-4 ${currentView === AppView.VOCABULARY ? 'bg-[#ffa600] text-white font-black border-[#cc8400] shadow-md -translate-y-0.5' : 'text-[#8d99ae] hover:bg-white/50 border-transparent'}`}
        >
          <Briefcase size={22} className={currentView === AppView.VOCABULARY ? 'fill-current' : ''} />
          <span className="text-base font-black uppercase tracking-tight">{t('ui.nav.pocket')}</span>
        </button>
      </nav>

      {/* Identity Card (Passport Badge) */}
      <div className="px-4 py-6">
        <div className="text-[10px] font-black text-[#8d99ae] uppercase tracking-[0.3em] mb-3 pl-4">Identification</div>
        {isGuest ? (
          <button 
            onClick={() => { playSparkle(); onLoginRequest(); }}
            className="w-full text-left bg-[#2d4a47] p-5 rounded-[2.5rem] border-4 border-[#4b7d78] shadow-[0_8px_0_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all group overflow-hidden relative"
          >
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '12px 12px' }} />
            <div className="flex items-center gap-4 relative z-10">
               <div className="bg-[#ff7b72] p-2.5 rounded-xl border-2 border-white/20 shadow-inner">
                  <ShieldAlert className="text-white" size={20} />
               </div>
               <div className="flex-1">
                  <h4 className="text-white text-xs font-black uppercase leading-none mb-1">Apply Citizen</h4>
                  <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest italic">Guest Mode</p>
               </div>
               <ChevronRight className="text-white/20 group-hover:translate-x-1 transition-transform" size={16} />
            </div>
            {/* Stamp decoration */}
            <div className="absolute -right-2 -bottom-2 text-[10px] font-black border-2 border-white/10 text-white/10 px-2 py-0.5 rounded rotate-12">GUEST</div>
          </button>
        ) : user ? (
          <div className="bg-white p-5 rounded-[2.5rem] border-4 border-[#e0d9b4] shadow-sm relative overflow-hidden">
             <div className="flex items-center gap-4">
                <div className="bg-[#78c850] p-2.5 rounded-xl border-2 border-white shadow-inner">
                   <ShieldCheck className="text-white" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                   <h4 className="text-[#4b7d78] text-xs font-black uppercase leading-none mb-1 truncate">{user.email?.split('@')[0]}</h4>
                   <p className="text-[#8bc34a] text-[9px] font-black uppercase tracking-widest italic">Island Citizen</p>
                </div>
             </div>
             <div className="absolute -right-2 -bottom-2 text-[10px] font-black border-2 border-[#8bc34a]/10 text-[#8bc34a]/10 px-2 py-0.5 rounded rotate-12">OFFICIAL</div>
          </div>
        ) : null}
      </div>

      {/* Utilities & Settings (Visual Downgrade) */}
      <div className="flex-1 flex flex-col justify-end px-4 py-8 space-y-6">
        <div className="space-y-1 bg-black/5 p-4 rounded-[2rem] border-2 border-transparent">
          <div className="px-2 mb-2">
            <LanguageSwitcher />
          </div>
          
          <button onClick={handleToggleMute} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[#8d99ae] hover:text-[#4b7d78] hover:bg-white/50 transition-all text-sm font-bold">
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            <span>{isMuted ? t('ui.actions.sound_off') : t('ui.actions.sound_on')}</span>
          </button>

          <button onClick={handleExport} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[#8d99ae] hover:text-[#4b7d78] hover:bg-white/50 transition-all text-sm font-bold">
            <Download size={18} />
            <span>{t('ui.actions.backup')}</span>
          </button>
        </div>

        <div className="px-2">
          {user ? (
            <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-[#8d99ae] font-black text-xs uppercase tracking-widest hover:text-[#ff7b72] transition-colors">
              <LogOut size={14} />
              <span>{t('ui.actions.logout')}</span>
            </button>
          ) : (
            <button onClick={handleReset} className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-[#d32f2f]/30 font-black text-xs uppercase tracking-widest hover:text-[#d32f2f] transition-colors">
              <RotateCcw size={14} />
              <span>{t('ui.actions.reset')}</span>
            </button>
          )}
        </div>
        
        <div className="flex flex-col items-center opacity-10 gap-1 mt-2">
           <div className="flex items-center gap-1.5 text-[7px] font-black text-[#4b7d78] uppercase tracking-[0.4em]">Made By SHELLY</div>
           <Heart size={6} className="text-[#ff7b72] fill-current" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
