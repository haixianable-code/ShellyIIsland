
import React, { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { UserStats } from '../types';
import { 
  LogOut, Volume2, VolumeX, RotateCcw, 
  CloudUpload, Leaf, Settings, User as UserIcon, Heart,
  Flame, Sprout, ShieldCheck, ChevronRight, Share2, Ticket, Check, Mail, Send
} from 'lucide-react';
import { toggleMute, getMuteState, playClick } from '../utils/sfx';

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
    
    // Viral Share Logic: Add stats to URL for the recipient to see
    const shareUrl = new URL(window.location.origin);
    shareUrl.searchParams.set('invitedBy', inviterName);
    shareUrl.searchParams.set('s', streak.toString()); // s = streak
    shareUrl.searchParams.set('w', total.toString());  // w = words

    const text = `🏝️ I'm building my vocabulary island!\n🔥 Day Streak: ${streak}\n🌱 Words Grown: ${total}\n\nJoin me on Shelly Spanish Island! 👇`;

    return { title: 'Join my Island', text, url: shareUrl.toString() };
  };

  const handleShareStats = async () => {
    playClick();
    const data = generateShareData();
    
    if (navigator.share) {
      try {
        await navigator.share(data);
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      try {
        // For clipboard, we manually append the URL to the text
        await navigator.clipboard.writeText(`${data.text}\n${data.url}`);
        setShareState('copied');
        setTimeout(() => setShareState('idle'), 2000);
      } catch (err) {
        alert("Could not copy stats. Please check permissions.");
      }
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="bg-[#b39ddb] p-4 rounded-3xl shadow-[0_6px_0_#7e57c2] border-4 border-white animate-bounce-slight">
          <Settings className="text-white fill-current" size={32} />
        </div>
        <h2 className="text-4xl font-black text-[#4b7d78] drop-shadow-sm">Island Menu</h2>
      </div>

      {/* INTEGRATED: Island Passport Card (Stats + Share) */}
      <div className="relative group">
         {/* Decorative Passport Tag */}
         <div className="absolute -top-3 left-6 z-20 bg-[#ffa600] text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border-2 border-white shadow-sm flex items-center gap-1">
            <Ticket size={10} /> Official Passport
         </div>

         <div className="bg-[#8bc34a] rounded-[2.5rem] p-6 pt-8 shadow-[0_10px_0_#689f38] border-4 border-white text-white relative overflow-hidden transition-transform active:scale-[0.98]">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
               <Leaf size={120} />
            </div>
            
            <div className="flex items-start justify-between relative z-10 mb-6">
               <div>
                  <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                     Shelly Island
                  </h3>
                  <p className="text-xs font-bold opacity-80">Citizen Statistics</p>
               </div>
               {/* Share Button Inside Card */}
               <button 
                  onClick={handleShareStats}
                  className="bg-white/20 hover:bg-white/30 p-3 rounded-2xl backdrop-blur-sm border-2 border-white/30 transition-all active:scale-90 flex items-center gap-2"
                  title="Share Passport"
               >
                  {shareState === 'copied' ? <Check size={20} className="text-white" /> : <Share2 size={20} className="text-white" />}
               </button>
            </div>

            <div className="grid grid-cols-2 gap-4 relative z-10">
               <div className="bg-white/20 rounded-2xl p-4 flex flex-col items-center justify-center border border-white/10">
                  <Flame size={28} className="mb-1 text-[#fff176] fill-current drop-shadow-sm" />
                  <span className="text-4xl font-black">{stats?.current_streak || 0}</span>
                  <span className="text-[9px] uppercase font-black opacity-80 tracking-wider">Day Streak</span>
               </div>
               <div className="bg-white/20 rounded-2xl p-4 flex flex-col items-center justify-center border border-white/10">
                  <Sprout size={28} className="mb-1 text-[#b2dfdb] fill-current drop-shadow-sm" />
                  <span className="text-4xl font-black">{stats?.total_words_learned || 0}</span>
                  <span className="text-[9px] uppercase font-black opacity-80 tracking-wider">Total Words</span>
               </div>
            </div>
            
            <div className="mt-4 text-center">
               <button onClick={handleShareStats} className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 hover:opacity-100 transition-opacity flex items-center justify-center gap-1 w-full">
                  {shareState === 'copied' ? 'Copied to Clipboard!' : (
                    <>Tap icon to share <Share2 size={8} /></>
                  )}
               </button>
            </div>
         </div>
      </div>

      {/* NEW: Dedicated Invite Button */}
      <button 
        onClick={handleShareStats}
        className="w-full bg-[#ff7b72] p-5 rounded-[2.5rem] border-4 border-[#ff8a80] shadow-[0_8px_0_#d32f2f] flex items-center justify-between group active:scale-95 transition-all relative overflow-hidden"
      >
        <div className="absolute -left-4 -bottom-4 text-white opacity-20 rotate-12">
            <Mail size={80} />
        </div>
        <div className="relative z-10 flex items-center gap-4">
           <div className="bg-white/20 p-3 rounded-2xl border-2 border-white/30">
              <Send className="text-white fill-current" size={24} />
           </div>
           <div className="text-left text-white">
              <h3 className="text-lg font-black leading-none">Send Invitation</h3>
              <p className="text-[10px] font-bold opacity-90 uppercase tracking-wider mt-1">Invite friends to the island</p>
           </div>
        </div>
        <div className="bg-white p-2 rounded-full shadow-sm">
           <ChevronRight className="text-[#ff7b72]" size={20} />
        </div>
      </button>

      {/* User Profile / Cloud Sync Card */}
      <div className="bg-white p-6 rounded-[2.5rem] border-4 border-[#e0d9b4] shadow-sm flex flex-col items-center text-center">
         
         {/* Profile Avatar */}
         <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center mb-4 shadow-inner ${user ? 'bg-[#e8f5e9] border-[#8bc34a]' : 'bg-[#eceff1] border-[#cfd8dc]'}`}>
            {user ? <Leaf size={32} className="text-[#8bc34a] fill-current" /> : <UserIcon size={32} className="text-[#b0bec5]" />}
         </div>
         
         {user ? (
           <>
             <h3 className="text-xl font-black text-[#4b7d78]">{user.email?.split('@')[0]}</h3>
             <div className="flex items-center gap-1 bg-[#e0f2f1] px-3 py-1 rounded-full mt-2">
                <ShieldCheck size={12} className="text-[#009688]" />
                <p className="text-[10px] font-black text-[#009688] uppercase tracking-widest">Cloud Sync Active</p>
             </div>
             
             <button
                onClick={onLogout}
                className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-4 rounded-2xl border-2 border-[#cfd8dc] text-[#546e7a] font-black hover:bg-slate-100 hover:text-[#d32f2f] transition-colors active:scale-95"
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
           </>
         ) : (
           <div className="w-full">
             <h3 className="text-xl font-black text-[#4b7d78]">Guest Explorer</h3>
             <p className="text-xs text-[#8d99ae] mt-1 font-bold">Progress is saved on this device only.</p>
             
             {/* Cloud Sync Upsell Card */}
             <button 
                onClick={onLoginRequest}
                className="mt-6 w-full bg-[#e3f2fd] p-5 rounded-3xl border-4 border-[#bbdefb] shadow-[0_6px_0_#90caf9] group active:scale-95 transition-all text-left relative overflow-hidden"
             >
                <CloudUpload className="absolute -right-4 -top-4 text-[#90caf9] opacity-20" size={80} />
                <div className="relative z-10">
                   <div className="flex items-center gap-2 mb-1">
                      <CloudUpload size={18} className="text-[#1976d2]" />
                      <span className="text-xs font-black text-[#1976d2] uppercase tracking-wider">Cloud Sync</span>
                   </div>
                   <h4 className="text-lg font-black text-[#1565c0] leading-tight">Save your progress</h4>
                   <div className="mt-3 flex items-center gap-2 text-[#1565c0] text-xs font-bold">
                      <span>Connect Account</span> <ChevronRight size={14} />
                   </div>
                </div>
             </button>
           </div>
         )}
      </div>

      {/* Global Settings */}
      <div className="space-y-4">
        <p className="text-[10px] font-black text-[#8d99ae] uppercase tracking-[0.2em] pl-4">Preferences</p>
        
        <button 
          onClick={handleToggleMute} 
          className="w-full bg-white p-5 rounded-[2rem] border-4 border-[#f0f0f0] shadow-[0_6px_0_#e0e0e0] flex items-center justify-between group active:scale-95 transition-transform"
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl transition-colors ${isMuted ? 'bg-gray-100 text-gray-400' : 'bg-[#fff9c4] text-[#fbc02d]'}`}>
               {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </div>
            <div className="text-left">
              <div className="text-lg font-black text-[#4b7d78]">Sound Effects</div>
              <div className="text-xs font-bold text-[#8d99ae]">{isMuted ? 'Muted' : 'On'}</div>
            </div>
          </div>
          <div className={`w-12 h-7 rounded-full p-1 transition-colors ${isMuted ? 'bg-gray-200' : 'bg-[#8bc34a]'}`}>
             <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${isMuted ? 'translate-x-0' : 'translate-x-5'}`} />
          </div>
        </button>
      </div>

      {/* Danger Zone */}
      {!user && (
        <div className="pt-4">
          <button 
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl text-[#d32f2f]/70 font-black hover:bg-red-50 hover:text-[#d32f2f] transition-colors text-sm"
          >
            <RotateCcw size={16} />
            <span>Reset Island (Delete Data)</span>
          </button>
        </div>
      )}

      <div className="flex flex-col items-center opacity-30 gap-1 pt-4">
          <div className="flex items-center gap-1.5 text-[8px] font-black text-[#4b7d78] uppercase tracking-[0.4em]">
            Made By SHELLY
          </div>
          <Heart size={8} className="text-[#ff7b72] fill-current" />
      </div>
    </div>
  );
};

export default MobileSettings;
