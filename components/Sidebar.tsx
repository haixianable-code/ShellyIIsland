
import React from 'react';
import { AppView } from '../types';
import { Home, Briefcase, Leaf, RotateCcw, Volume2, VolumeX, LogOut, ShieldCheck, ChevronRight, UserPlus, Crown, Newspaper, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { playClick, playSparkle } from '../utils/sfx';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import { useIslandStore } from '../store/useIslandStore';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  user: any;
  displayName: string;
  isSupabaseConfigured: boolean;
  onLoginRequest: () => void;
  onLogout: () => void;
  onShareAchievement: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, user, displayName, isSupabaseConfigured, onLoginRequest, onLogout }) => {
  const { t } = useTranslation();
  const { isMuted, setMuted, profile, openModal, isSidebarCollapsed, toggleSidebar } = useIslandStore();
  const isGuest = isSupabaseConfigured && !user;
  const isPremium = profile?.is_premium;

  const handleToggleMute = () => {
    playClick();
    setMuted(!isMuted);
  };

  const handleReset = () => {
    playClick();
    if (confirm(t('ui.actions.clear_warning'))) {
      useIslandStore.getState().resetIsland();
    }
  };

  const widthClass = isSidebarCollapsed ? 'w-20' : 'w-64';

  return (
    <aside 
      className={`${widthClass} bg-[#f9f5da] border-r border-[#e0d9b4] hidden md:flex flex-col h-screen fixed left-0 top-0 z-50 transition-all duration-300 ease-in-out shadow-[4px_0_24px_rgba(0,0,0,0.02)]`} 
      role="complementary"
    >
      <header className={`p-6 flex flex-col items-center justify-center transition-all ${isSidebarCollapsed ? 'mb-4' : 'mb-0'}`}>
        <div className="relative group">
            <button 
                onClick={() => { playClick(); toggleSidebar(); }}
                className="absolute -right-10 top-1/2 -translate-y-1/2 text-[#8d99ae] hover:text-[#4b7d78] transition-colors p-1.5 bg-[#f9f5da] rounded-full border border-[#e0d9b4] shadow-sm opacity-0 group-hover:opacity-100"
                title={isSidebarCollapsed ? "Expand" : "Collapse"}
            >
                {isSidebarCollapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
            </button>
            <div className={`inline-flex items-center justify-center ${isSidebarCollapsed ? 'w-10 h-10 rounded-xl' : 'w-14 h-14 rounded-[1.5rem]'} bg-[#78c850] shadow-sm border-2 border-white transition-all duration-300`}>
            <Leaf className="text-white fill-current transition-all" size={isSidebarCollapsed ? 20 : 28} />
            </div>
        </div>
        {!isSidebarCollapsed && (
            <div className="mt-3 text-lg font-black text-[#4b7d78] tracking-tight uppercase animate-fadeIn whitespace-nowrap overflow-hidden">SS Spanish</div>
        )}
      </header>

      <nav className="px-3 space-y-2 flex-1" role="navigation">
        {[
            { id: AppView.DASHBOARD, icon: Home, label: t('ui.nav.home') },
            { id: AppView.VOCABULARY, icon: Briefcase, label: t('ui.nav.pocket') },
            { id: AppView.BLOG, icon: Newspaper, label: t('ui.nav.stories') },
        ].map((item) => (
            <button
            key={item.id}
            onClick={() => { playClick(); setView(item.id); }}
            className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-3 rounded-xl transition-all duration-200 group relative ${currentView === item.id ? 'bg-[#ffa600] text-white shadow-sm' : 'text-[#8d99ae] hover:bg-white/60'}`}
            title={isSidebarCollapsed ? item.label : undefined}
            >
            <item.icon size={20} className={currentView === item.id ? 'fill-current' : ''} />
            {!isSidebarCollapsed && <span className="text-sm font-black uppercase tracking-tight whitespace-nowrap">{item.label}</span>}
            {isSidebarCollapsed && (
                <div className="absolute left-14 bg-[#2d4a47] text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
                    {item.label}
                    <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-[#2d4a47] rotate-45"></div>
                </div>
            )}
            </button>
        ))}
      </nav>

      <section className="px-3 py-4">
        {!isSidebarCollapsed && <div className="text-[9px] font-black text-[#8d99ae] uppercase tracking-[0.3em] mb-3 pl-2 whitespace-nowrap overflow-hidden">{t('ui.passport.id_number')}</div>}
        
        {isGuest ? (
          <button 
            onClick={() => { playSparkle(); onLoginRequest(); }}
            className={`w-full bg-[#2d4a47] ${isSidebarCollapsed ? 'p-3 justify-center' : 'p-4'} rounded-2xl border-2 border-[#4b7d78] shadow-sm hover:shadow-md transition-all group relative overflow-hidden flex items-center gap-3`}
          >
             <UserPlus className="text-white shrink-0" size={20} />
             {!isSidebarCollapsed && (
                 <div className="flex-1 text-left min-w-0">
                    <div className="text-white text-[10px] font-black uppercase leading-none mb-0.5 whitespace-nowrap">{t('ui.passport.apply_now')}</div>
                 </div>
             )}
          </button>
        ) : user ? (
          <div className="space-y-2">
            <button 
               onClick={() => { playClick(); setView(AppView.SETTINGS); }}
               className={`w-full bg-white ${isSidebarCollapsed ? 'p-2 justify-center' : 'p-3'} rounded-2xl border-2 ${currentView === AppView.SETTINGS ? 'border-[#ffa600]' : 'border-[#e0d9b4]'} shadow-sm hover:shadow-md transition-all group flex items-center gap-3`}
            >
               <div className={`${isPremium ? 'bg-[#ffa600]' : 'bg-[#78c850]'} p-1.5 rounded-lg shrink-0`}>
                  {isPremium ? <Crown className="text-white" size={16} /> : <ShieldCheck className="text-white" size={16} />}
               </div>
               {!isSidebarCollapsed && (
                   <div className="flex-1 text-left min-w-0">
                      <div className="text-[#4b7d78] text-xs font-black uppercase leading-none mb-0.5 truncate">{displayName}</div>
                      <p className={`${isPremium ? 'text-[#ffa600]' : 'text-[#8bc34a]'} text-[9px] font-black uppercase`}>
                        {isPremium ? 'PREMIUM' : 'FREE'}
                      </p>
                   </div>
               )}
            </button>
          </div>
        ) : null}
      </section>

      <footer className="px-3 py-6 space-y-2">
        {!isSidebarCollapsed && (
            <div className="bg-black/5 p-3 rounded-2xl mb-2">
                <LanguageSwitcher />
            </div>
        )}
        
        <button onClick={handleToggleMute} className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3 px-4'} py-2.5 rounded-xl text-[#8d99ae] hover:text-[#4b7d78] hover:bg-white/50 transition-all`}>
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            {!isSidebarCollapsed && <span className="text-xs font-bold whitespace-nowrap">{isMuted ? 'Muted' : 'Sound On'}</span>}
        </button>

        {user && (
            <button onClick={onLogout} className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3 px-4'} py-2.5 rounded-xl text-[#ff7b72] hover:bg-[#ff7b72]/10 transition-all`}>
                <LogOut size={18} />
                {!isSidebarCollapsed && <span className="text-xs font-black uppercase whitespace-nowrap">{t('ui.actions.logout')}</span>}
            </button>
        )}
      </footer>
    </aside>
  );
};

export default Sidebar;
