
import React, { useState, useMemo } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../services/supabaseClient';
import { UserStats } from '../types';
import { 
  LogOut, Volume2, VolumeX, RotateCcw, 
  Leaf, Settings, Heart,
  Flame, Sprout, ShieldCheck, ChevronRight, Ticket, Speaker, Trash2, Trophy, ShieldAlert, Fingerprint, Cloud, TreePalm, Sparkles, BrainCircuit, Loader2, CheckCircle2, AlertTriangle
} from 'lucide-react';
import { toggleMute, getMuteState, playClick, playSparkle } from '../utils/sfx';
import { playAudio } from '../utils/audio';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import { testAISpiritConnection } from '../services/geminiService';

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
  user, stats, displayName, isSupabaseConfigured, onLoginRequest, onLogout, onShareAchievement 
}) => {
  const { t } = useTranslation();
  const [isMuted, setIsMuted] = useState(getMuteState());
  const [aiTestStatus, setAiTestStatus] = useState<'idle' | 'testing' | 'success' | 'fail'>('idle');
  const [aiTestMsg, setAiTestMsg] = useState('');
  
  const handleToggleMute = () => {
    playClick();
    const newState = toggleMute();
    setIsMuted(newState);
  };

  const handleTestAI = async () => {
    playClick();
    setAiTestStatus('testing');
    const result = await testAISpiritConnection();
    setAiTestStatus(result.success ? 'success' : 'fail');
    setAiTestMsg(result.message);
  };

  const handleReset = () => {
    playClick();
    if (confirm("Reset everything?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12 relative">
      <div className="flex items-center gap-4 relative z-10">
        <div className="bg-[#b39ddb] p-4 rounded-3xl shadow-[0_6px_0_#7e57c2] border-4 border-white">
          <Settings className="text-white fill-current" size={32} />
        </div>
        <h2 className="text-4xl font-black text-[#4b7d78] drop-shadow-sm">{t('ui.nav.menu')}</h2>
      </div>

      {/* --- AI Diagnostic Section --- */}
      <div className="bg-white p-6 rounded-[2.5rem] border-4 border-[#f3e5f5] shadow-sm relative overflow-hidden group z-10">
          <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                 <div className="bg-[#f3e5f5] p-2 rounded-xl text-[#9c27b0]"><BrainCircuit size={20} /></div>
                 <div>
                    <h4 className="text-sm font-black text-[#9c27b0] uppercase tracking-wider leading-none">AI Spirit Status</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Linguistic Intelligence</p>
                 </div>
              </div>
              {aiTestStatus === 'success' ? <CheckCircle2 className="text-green-500" size={18} /> : 
               aiTestStatus === 'fail' ? <AlertTriangle className="text-amber-500" size={18} /> : null}
          </div>

          <button 
             onClick={handleTestAI}
             disabled={aiTestStatus === 'testing'}
             className="w-full bg-[#f3e5f5]/50 border-2 border-dashed border-[#9c27b0]/30 py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#f3e5f5] transition-all group active:scale-95"
          >
             {aiTestStatus === 'testing' ? <Loader2 className="animate-spin text-[#9c27b0]" size={16} /> : <Sparkles className="text-[#9c27b0]" size={16} />}
             <span className="text-xs font-black text-[#9c27b0] uppercase tracking-widest">Test Spirit Connection</span>
          </button>

          {aiTestMsg && (
             <div className={`mt-3 p-3 rounded-xl text-[10px] font-bold border ${aiTestStatus === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                <p className="uppercase opacity-50 mb-1">Result:</p>
                {aiTestMsg}
             </div>
          )}
      </div>

      <div className="space-y-4 z-10 relative">
        <p className="text-[10px] font-black text-[#8d99ae] uppercase tracking-[0.2em] pl-4">{t('ui.actions.system_pref')}</p>
        
        <div className="bg-white p-5 rounded-[2.5rem] border-4 border-[#f0f0f0] shadow-[0_6px_0_#e0e0e0] flex items-center justify-between">
           <div className="flex items-center gap-4">
             <div className="bg-[#e8f5e9] text-[#2e7d32] p-3 rounded-2xl"><Leaf size={24} /></div>
             <div className="text-left">
                <div className="text-lg font-black text-[#4b7d78]">Language / 语言</div>
                <div className="text-xs font-bold text-[#8d99ae]">Toggle EN/CN</div>
             </div>
           </div>
           <LanguageSwitcher />
        </div>

        <button onClick={handleToggleMute} className="w-full bg-white p-5 rounded-[2.5rem] border-4 border-[#f0f0f0] shadow-[0_6px_0_#e0e0e0] flex items-center justify-between bubble-button">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${isMuted ? 'bg-gray-100 text-gray-400' : 'bg-[#fff9c4] text-[#fbc02d]'}`}>
               {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </div>
            <div className="text-left"><div className="text-lg font-black text-[#4b7d78]">{t('ui.actions.sound_on')}</div><div className="text-xs font-bold text-[#8d99ae]">{isMuted ? 'Muted' : 'On'}</div></div>
          </div>
          <div className={`w-12 h-7 rounded-full p-1 transition-colors ${isMuted ? 'bg-gray-200' : 'bg-[#8bc34a]'}`}><div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${isMuted ? 'translate-x-0' : 'translate-x-5'}`} /></div>
        </button>
      </div>

      <div className="p-4 flex flex-col items-center space-y-4 z-10 relative">
        <button onClick={handleReset} className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-[#d32f2f]/60 font-black hover:bg-red-50 transition-colors">
          <RotateCcw size={18} /><span>{t('ui.actions.reset')}</span>
        </button>
      </div>
    </div>
  );
};

export default MobileSettings;
