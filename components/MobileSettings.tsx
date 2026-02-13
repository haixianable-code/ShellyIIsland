
import React, { useState, useMemo } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../services/supabaseClient';
import { UserStats } from '../types';
import { 
  LogOut, Volume2, VolumeX, RotateCcw, 
  Leaf, Settings, Heart,
  Flame, Sprout, ShieldCheck, ChevronRight, Ticket, Speaker, Trash2, Trophy, ShieldAlert, Fingerprint, Cloud, TreePalm, Crown, Star, Sparkles
} from 'lucide-react';
import { toggleMute, getMuteState, playClick, playSparkle } from '../utils/sfx';
import { playAudio } from '../utils/audio';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import { useIslandStore } from '../store/useIslandStore';

interface MobileSettingsProps {
  user: User | null;
  stats: UserStats | null;
  displayName: string;
  isSupabaseConfigured: boolean;
  onLoginRequest: () => void;
  onLogout: () => void;
  onShareAchievement: () => void;
}

const MobileSettings: React.FC<MobileSettingsProps> = ({ 
  user, 
  stats,
  displayName,
  isSupabaseConfigured, 
  onLoginRequest, 
  onLogout,
  onShareAchievement
}) => {
  const { t } = useTranslation();
  const { profile } = useIslandStore();
  const [isMuted, setIsMuted] = useState(getMuteState());
  
  const handleToggleMute = () => {
    playClick();
    const newState = toggleMute();
    setIsMuted(newState);
  };

  const handleTestAudio = () => {
    playClick();
    playAudio("¡Hola! Bienvenido a la isla.");
  };

  const handleReset = () => {
    playClick();
    if (confirm("Reset everything? This will log you out and clear local storage.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleClearProgress = async () => {
    playClick();
    if (confirm(t('ui.actions.clear_warning'))) {
        if (user && supabase) {
             const { error } = await supabase.from('user_word_choices').delete().eq('user_id', user.id);
             if (error) {
                 alert("Error clearing cloud progress");
                 return;
             }
        }
        localStorage.removeItem('hola_word_srs_v3_offline');
        localStorage.removeItem('hola_user_stats_v1_offline');
        window.location.reload();
    }
  };

  const isPremium = profile?.is_premium;

  const passportStyles = useMemo(() => {
    if (user && isPremium) {
      return {
        bg: 'bg-gradient-to-br from-slate-800 via-slate-900 to-black',
        accent: 'bg-[#ffd740]', // Gold
        border: 'border-[#ffd740]',
        text: 'text-white',
        status: 'SSI SUPPORTER',
        stamp: 'SUPPORTER',
        label: 'Premium Passport',
        icon: Crown,
        iconColor: 'text-[#ffd740]',
        shimmer: true
      };
    }
    if (user) {
      return {
        bg: 'bg-[#2d4a47]', // Deep Teal
        accent: 'bg-[#78c850]', // Green
        border: 'border-[#4b7d78]',
        text: 'text-white',
        status: t('ui.passport.citizen'),
        stamp: 'CITIZEN',
        label: t('ui.passport.official_passport'),
        icon: Leaf,
        iconColor: 'text-[#78c850]',
        shimmer: false
      };
    }
    return {
      bg: 'bg-[#e0d9b4]', // Beige
      accent: 'bg-[#ff7b72]', // Red
      border: 'border-[#cbbfa1]',
      text: 'text-[#4b7d78]',
      status: t('ui.passport.unverified'),
      stamp: 'GUEST',
      label: t('ui.passport.temp_pass'),
      icon: Fingerprint,
      iconColor: 'text-[#ff7b72]',
      shimmer: false
    };
  }, [user, isPremium, t]);

  const PassportIcon = passportStyles.icon;

  return (
    <div className="space-y-8 animate-fadeIn pb-12 relative">
      {/* --- Ambient Decorations --- */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.06]">
         <Cloud className="absolute top-[20%] -right-10 text-[#4b7d78] animate-float-slow" size={100} />
         <TreePalm className="absolute top-[60%] -left-12 text-[#78c850] animate-sway" size={200} />
      </div>

      {/* Header */}
      <div className="flex items-center gap-4 relative z-10">
        <div className="bg-[#b39ddb] p-4 rounded-3xl shadow-[0_6px_0_#7e57c2] border-4 border-white">
          <Settings className="text-white fill-current" size={32} />
        </div>
        <h2 className="text-4xl font-black text-[#4b7d78] drop-shadow-sm">{t('ui.nav.menu')}</h2>
      </div>

      {/* Passport Card */}
      <div className="relative group perspective-1000 z-10">
         <div className={`absolute -top-3 left-8 z-20 ${isPremium ? 'bg-[#ffd740] text-slate-900 border-[#ff6f00]' : (user ? 'bg-[#78c850] text-white border-white' : 'bg-[#8d99ae] text-white border-white')} px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 shadow-md flex items-center gap-1.5`}>
            {isPremium ? <Crown size={12} /> : <Ticket size={12} />} 
            {passportStyles.label}
         </div>

         <div className={`${passportStyles.bg} rounded-[3rem] p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] border-4 ${passportStyles.border} ${passportStyles.text} relative overflow-hidden transition-all duration-500 animate-float-small`}>
            
            {/* Holographic Shimmer for Premium */}
            {passportStyles.shimmer && (
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-30 animate-pulse pointer-events-none" style={{ backgroundSize: '200% 200%' }} />
            )}
            
            {/* Texture */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }} />
            
            <div className="flex items-start justify-between relative z-10 mb-8">
               <div className="space-y-1">
                  <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2 truncate pr-4">
                     {displayName}
                     {isPremium && <Star size={20} className="text-[#ffd740] fill-current animate-spin-slow" />}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${isPremium ? 'bg-[#ffd740] text-slate-900' : (user ? 'bg-[#78c850] text-[#2d4a47]' : 'bg-white/40 text-[#4b7d78]')}`}>
                      {passportStyles.status}
                    </span>
                    <span className="text-[10px] font-bold opacity-60">ID: {user?.id.slice(0, 8) || 'T-800-GUEST'}</span>
                  </div>
               </div>
               
               <div className={`w-16 h-16 rounded-2xl border-4 ${isPremium ? 'border-[#ffd740]/30 bg-white/5' : 'border-white/20 bg-white/10'} flex items-center justify-center overflow-hidden shrink-0`}>
                  <PassportIcon className={`${passportStyles.iconColor} ${isPremium ? 'animate-pulse' : 'animate-float'} fill-current`} size={32} />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4 relative z-10 mb-8">
               <div className="bg-white/10 rounded-2xl p-5 flex flex-col items-center justify-center border border-white/5 backdrop-blur-sm">
                  <Flame size={24} className="mb-1 text-[#fff176] fill-current" />
                  <span className="text-3xl font-black">{stats?.current_streak || 0}</span>
                  <span className="text-[8px] uppercase font-black opacity-60 tracking-wider">Day Streak</span>
               </div>
               <div className="bg-white/10 rounded-2xl p-5 flex flex-col items-center justify-center border border-white/5 backdrop-blur-sm">
                  <Sprout size={24} className="mb-1 text-[#b2dfdb] fill-current" />
                  <span className="text-3xl font-black">{stats?.total_words_learned || 0}</span>
                  <span className="text-[8px] uppercase font-black opacity-60 tracking-wider">Words Grown</span>
               </div>
            </div>

            <div className={`p-4 rounded-2xl flex items-center gap-4 transition-colors ${user ? 'bg-white/10' : 'bg-[#ff7b72] text-white shadow-lg shadow-rose-900/20'}`}>
                {user ? <ShieldCheck size={20} className={isPremium ? "text-[#ffd740]" : "text-[#78c850]"} /> : <ShieldAlert size={20} className="animate-pulse" />}
                <div className="flex-1">
                  <p className="text-[10px] font-black leading-tight uppercase">
                    {user ? (isPremium ? "Cloud Sync & AI Active" : t('ui.passport.citizen_desc')) : t('ui.passport.verify_warning')}
                  </p>
                </div>
                {!user && (
                   <button onClick={onLoginRequest} className="bg-white text-[#ff7b72] px-3 py-1 rounded-lg text-[9px] font-black uppercase shadow-sm active:scale-90">
                      {t('ui.passport.apply_now')}
                   </button>
                )}
            </div>

            {/* STAMP */}
            <div className={`absolute bottom-6 right-6 pointer-events-none transform rotate-[-15deg]`}>
               <div className={`border-[4px] border-dashed ${isPremium ? 'border-[#ffd740] text-[#ffd740]' : (user ? 'border-[#78c850] text-[#78c850]' : 'border-rose-500 text-rose-500')} rounded-xl px-3 py-2 opacity-30`}>
                  <span className="text-xl font-black uppercase tracking-widest">{passportStyles.stamp}</span>
               </div>
            </div>
         </div>
      </div>

      {/* Main Achievement Sharing Action */}
      <button 
        onClick={() => { playSparkle(); onShareAchievement(); }}
        className="w-full bg-[#ff7b72] p-6 rounded-[2.5rem] border-4 border-[#ff8a80] shadow-[0_8px_0_#d32f2f] flex items-center justify-between group active:scale-95 transition-all relative overflow-hidden bubble-button z-10"
      >
        <div className="absolute -left-4 -bottom-4 text-white opacity-10 rotate-12 animate-sway">
            <Trophy size={100} />
        </div>
        <div className="relative z-10 flex items-center gap-5">
           <div className="bg-white/20 p-4 rounded-2xl border-2 border-white/30">
              <Trophy className="text-white fill-current" size={28} />
           </div>
           <div className="text-left text-white">
              <h3 className="text-xl font-black">{t('ui.actions.share_island')}</h3>
              <p className="text-[10px] font-bold opacity-90 uppercase tracking-widest mt-1.5">Show your merit scroll to friends</p>
           </div>
        </div>
        <div className="bg-white p-2 rounded-full shadow-sm group-hover:translate-x-1 transition-transform">
           <ChevronRight className="text-[#ff7b72]" size={20} />
        </div>
      </button>

      {/* System Preferences */}
      <div className="space-y-4 z-10 relative">
        <p className="text-[10px] font-black text-[#8d99ae] uppercase tracking-[0.2em] pl-4">{t('ui.actions.system_pref')}</p>
        
        {/* Language Switcher Button Group */}
        <div className="bg-white p-5 rounded-[2.5rem] border-4 border-[#f0f0f0] shadow-[0_6px_0_#e0e0e0] flex items-center justify-between group bubble-button transition-transform">
           <div className="flex items-center gap-4">
             <div className="bg-[#e8f5e9] text-[#2e7d32] p-3 rounded-2xl">
                <Leaf size={24} className="animate-float-small" />
             </div>
             <div className="text-left">
                <div className="text-lg font-black text-[#4b7d78]">Language / 语言</div>
                <div className="text-xs font-bold text-[#8d99ae]">Toggle EN/CN</div>
             </div>
           </div>
           <LanguageSwitcher />
        </div>

        <button 
          onClick={handleToggleMute} 
          className="w-full bg-white p-5 rounded-[2.5rem] border-4 border-[#f0f0f0] shadow-[0_6px_0_#e0e0e0] flex items-center justify-between group active:scale-95 transition-transform bubble-button"
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl transition-colors ${isMuted ? 'bg-gray-100 text-gray-400' : 'bg-[#fff9c4] text-[#fbc02d]'}`}>
               {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} className="animate-pulse" />}
            </div>
            <div className="text-left">
              <div className="text-lg font-black text-[#4b7d78]">{t('ui.actions.sound_on')}</div>
              <div className="text-xs font-bold text-[#8d99ae]">{isMuted ? 'Muted' : 'On'}</div>
            </div>
          </div>
          <div className={`w-12 h-7 rounded-full p-1 transition-colors ${isMuted ? 'bg-gray-200' : 'bg-[#8bc34a]'}`}>
             <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${isMuted ? 'translate-x-0' : 'translate-x-5'}`} />
          </div>
        </button>

        <button 
          onClick={handleTestAudio} 
          className="w-full bg-white p-5 rounded-[2.5rem] border-4 border-[#f0f0f0] shadow-[0_6px_0_#e0e0e0] flex items-center justify-between group active:scale-95 transition-transform bubble-button"
        >
          <div className="flex items-center gap-4">
            <div className="bg-[#e1f5fe] text-[#0288d1] p-3 rounded-2xl">
               <Speaker size={24} />
            </div>
            <div className="text-left">
              <div className="text-lg font-black text-[#4b7d78]">{t('ui.actions.test_audio')}</div>
              <div className="text-xs font-bold text-[#8d99ae]">{t('ui.actions.check_voice')}</div>
            </div>
          </div>
          <ChevronRight className="text-slate-300 group-hover:translate-x-1 transition-transform" size={20} />
        </button>
      </div>

      <div className="p-4 flex flex-col items-center space-y-4 z-10 relative">
        {user ? (
          <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-[#d32f2f] font-black hover:bg-red-50 transition-colors">
            <LogOut size={18} />
            <span>{t('ui.actions.logout')}</span>
          </button>
        ) : (
          <button onClick={handleReset} className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-[#d32f2f]/60 font-black hover:bg-red-50 hover:text-[#d32f2f] transition-colors">
            <RotateCcw size={18} />
            <span>{t('ui.actions.reset')}</span>
          </button>
        )}
      </div>

      <div className="pt-8 border-t-2 border-dashed border-[#e0d9b4]/30 z-10 relative">
          <p className="text-[10px] font-black text-[#8d99ae] uppercase tracking-[0.2em] pl-4 mb-3">Zone of Reset</p>
          <button 
          onClick={handleClearProgress} 
          className="w-full bg-[#fff5f5] p-5 rounded-[2.5rem] border-4 border-[#ffebee] shadow-[0_6px_0_#ffcdd2] flex items-center justify-between group active:scale-95 transition-transform bubble-button"
          >
          <div className="flex items-center gap-4">
              <div className="bg-[#ffcdd2] text-[#c62828] p-3 rounded-2xl shadow-sm group-hover:animate-wiggle">
              <Trash2 size={24} />
              </div>
              <div className="text-left">
              <div className="text-lg font-black text-[#c62828]">{t('ui.actions.clear_progress')}</div>
              <div className="text-xs font-bold text-[#ef9a9a]">{t('ui.actions.wipe_data')}</div>
              </div>
          </div>
          <ChevronRight className="text-[#ef9a9a]" size={20} />
          </button>
      </div>

      <div className="flex flex-col items-center opacity-30 gap-1 pb-4 z-10 relative">
          <div className="flex items-center gap-1.5 text-[8px] font-black text-[#4b7d78] uppercase tracking-[0.4em]">
            Made By SHELLY
          </div>
          <Heart size={8} className="text-[#ff7b72] fill-current animate-pulse" />
      </div>
    </div>
  );
};

export default MobileSettings;
