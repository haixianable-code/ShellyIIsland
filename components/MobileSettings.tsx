
import React, { useState, useMemo } from 'react';
import { User } from '@supabase/supabase-js';
import { UserStats } from '../types';
import { 
  LogOut, Volume2, VolumeX, RotateCcw, 
  CloudUpload, Leaf, Settings, User as UserIcon, Heart,
  Flame, Sprout, ShieldCheck, ChevronRight, Share2, Ticket, Check, Mail, Send,
  ShieldAlert, Fingerprint, Calendar
} from 'lucide-react';
import { toggleMute, getMuteState, playClick } from '../utils/sfx';
import { useTranslation } from 'react-i18next';

interface MobileSettingsProps {
  user: User | null;
  stats: UserStats | null;
  isSupabaseConfigured: boolean;
  onLoginRequest: () => void;
  onLogout: () => void;
}

const MobileSettings: React.FC<MobileSettingsProps> = ({ 
  user, 
  stats,
  isSupabaseConfigured, 
  onLoginRequest, 
  onLogout 
}) => {
  const { t } = useTranslation();
  const [isMuted, setIsMuted] = useState(getMuteState());
  const [shareState, setShareState] = useState<'idle' | 'copied'>('idle');
  
  const handleToggleMute = () => {
    playClick();
    const newState = toggleMute();
    setIsMuted(newState);
  };

  const handleReset = () => {
    playClick();
    if (confirm("Reset all progress? This will delete your learning history on this device.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const generateShareData = () => {
    const streak = stats?.current_streak || 0;
    const total = stats?.total_words_learned || 0;
    const inviterName = user?.email?.split('@')[0] || 'Friend';
    
    const shareUrl = new URL(window.location.origin);
    shareUrl.searchParams.set('invitedBy', inviterName);
    shareUrl.searchParams.set('s', streak.toString());
    shareUrl.searchParams.set('w', total.toString());

    const text = t('ui.study.share_template', {
      level: stats?.total_words_learned || 0,
      streak: streak,
      count: 0, // 仅展示统计
      url: shareUrl.toString()
    });

    return { title: 'Join my Island', text, url: shareUrl.toString() };
  };

  const handleShareStats = async () => {
    playClick();
    const data = generateShareData();
    
    if (navigator.share) {
      try {
        await navigator.share(data);
      } catch (err) { /* ignore */ }
    } else {
      await navigator.clipboard.writeText(`${data.text}`);
      setShareState('copied');
      setTimeout(() => setShareState('idle'), 2000);
    }
  };

  // 护照视觉逻辑
  const passportStyles = useMemo(() => {
    if (user) {
      return {
        bg: 'bg-[#2d4a47]',
        accent: 'bg-[#78c850]',
        border: 'border-[#4b7d78]',
        text: 'text-white',
        status: t('ui.passport.citizen'),
        stamp: 'CITIZEN',
        label: t('ui.passport.official_passport')
      };
    }
    return {
      bg: 'bg-[#e0d9b4]',
      accent: 'bg-[#ff7b72]',
      border: 'border-[#cbbfa1]',
      text: 'text-[#4b7d78]',
      status: t('ui.passport.unverified'),
      stamp: 'GUEST',
      label: t('ui.passport.temp_pass')
    };
  }, [user, t]);

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="bg-[#b39ddb] p-4 rounded-3xl shadow-[0_6px_0_#7e57c2] border-4 border-white animate-bounce-slight">
          <Settings className="text-white fill-current" size={32} />
        </div>
        <h2 className="text-4xl font-black text-[#4b7d78] drop-shadow-sm">{t('ui.nav.menu')}</h2>
      </div>

      {/* 拟物化护照卡片 */}
      <div className="relative group perspective-1000">
         {/* 顶部页签 */}
         <div className={`absolute -top-3 left-8 z-20 ${user ? 'bg-[#ffa600]' : 'bg-[#8d99ae]'} text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 border-white shadow-md flex items-center gap-1.5`}>
            <Ticket size={12} /> {passportStyles.label}
         </div>

         <div className={`${passportStyles.bg} rounded-[3rem] p-8 shadow-[0_20px_0_rgba(0,0,0,0.1)] border-4 ${passportStyles.border} ${passportStyles.text} relative overflow-hidden transition-all duration-500`}>
            {/* 护照纹理背景 */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }} />
            
            <div className="flex items-start justify-between relative z-10 mb-8">
               <div className="space-y-1">
                  <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
                     Shelly Island
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${user ? 'bg-[#78c850] text-[#2d4a47]' : 'bg-white/40 text-[#4b7d78]'}`}>
                      {passportStyles.status}
                    </span>
                    <span className="text-[10px] font-bold opacity-60">ID: {user?.id.slice(0, 8) || 'T-800-GUEST'}</span>
                  </div>
               </div>
               
               <div className={`w-16 h-16 rounded-2xl border-4 ${user ? 'border-white/20' : 'border-[#4b7d78]/10'} flex items-center justify-center overflow-hidden bg-white/10`}>
                  {user ? <Leaf className="text-white fill-current" size={32} /> : <Fingerprint className="text-[#4b7d78]/20" size={32} />}
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

            {/* 警告/同步状态栏 */}
            <div className={`p-4 rounded-2xl flex items-center gap-4 transition-colors ${user ? 'bg-white/10' : 'bg-[#ff7b72] text-white shadow-lg shadow-rose-900/20'}`}>
                {user ? <ShieldCheck size={20} className="text-[#78c850]" /> : <ShieldAlert size={20} className="animate-pulse" />}
                <div className="flex-1">
                  <p className="text-[10px] font-black leading-tight uppercase">
                    {user ? t('ui.passport.citizen_desc') : t('ui.passport.verify_warning')}
                  </p>
                </div>
                {!user && (
                   <button onClick={onLoginRequest} className="bg-white text-[#ff7b72] px-3 py-1 rounded-lg text-[9px] font-black uppercase shadow-sm">
                      {t('ui.passport.apply_now')}
                   </button>
                )}
            </div>

            {/* 盖章装饰 */}
            <div className={`absolute bottom-4 right-4 text-[12px] font-black border-[3px] rounded-lg px-2 py-1 rotate-[25deg] opacity-20 ${user ? 'border-[#78c850] text-[#78c850]' : 'border-rose-500 text-rose-500'}`}>
               {passportStyles.stamp}
            </div>
         </div>
      </div>

      {/* 邀请卡片 */}
      <button 
        onClick={handleShareStats}
        className="w-full bg-[#ff7b72] p-6 rounded-[2.5rem] border-4 border-[#ff8a80] shadow-[0_8px_0_#d32f2f] flex items-center justify-between group active:scale-95 transition-all relative overflow-hidden"
      >
        <div className="absolute -left-4 -bottom-4 text-white opacity-10 rotate-12">
            <Mail size={100} />
        </div>
        <div className="relative z-10 flex items-center gap-5">
           <div className="bg-white/20 p-4 rounded-2xl border-2 border-white/30">
              <Send className="text-white fill-current" size={28} />
           </div>
           <div className="text-left text-white">
              <h3 className="text-xl font-black leading-none">{t('ui.actions.share_island')}</h3>
              <p className="text-[10px] font-bold opacity-90 uppercase tracking-widest mt-1.5">{shareState === 'copied' ? t('ui.actions.copied') : 'Invite friends to the island'}</p>
           </div>
        </div>
        <div className="bg-white p-2 rounded-full shadow-sm">
           <ChevronRight className="text-[#ff7b72]" size={20} />
        </div>
      </button>

      {/* 设置列表 */}
      <div className="space-y-4">
        <p className="text-[10px] font-black text-[#8d99ae] uppercase tracking-[0.2em] pl-4">System Preferences</p>
        
        <button 
          onClick={handleToggleMute} 
          className="w-full bg-white p-5 rounded-[2.5rem] border-4 border-[#f0f0f0] shadow-[0_6px_0_#e0e0e0] flex items-center justify-between group active:scale-95 transition-transform"
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl transition-colors ${isMuted ? 'bg-gray-100 text-gray-400' : 'bg-[#fff9c4] text-[#fbc02d]'}`}>
               {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
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
      </div>

      <div className="p-4 flex flex-col items-center">
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

      <div className="flex flex-col items-center opacity-30 gap-1 pb-4">
          <div className="flex items-center gap-1.5 text-[8px] font-black text-[#4b7d78] uppercase tracking-[0.4em]">
            Made By SHELLY
          </div>
          <Heart size={8} className="text-[#ff7b72] fill-current" />
      </div>
    </div>
  );
};

export default MobileSettings;
