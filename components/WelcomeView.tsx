
import React, { useEffect, useState } from 'react';
import { Leaf, UserPlus, Compass, Ticket, Sparkles, CheckCircle2, Flame, Sprout, Heart } from 'lucide-react';
import { playFanfare, playClick } from '../utils/sfx';
import confetti from 'canvas-confetti';

interface WelcomeViewProps {
  onSelectGuest: () => void;
  onSelectAuth: () => void;
}

interface InviterStats {
  name: string;
  streak: string;
  words: string;
}

const WelcomeView: React.FC<WelcomeViewProps> = ({ onSelectGuest, onSelectAuth }) => {
  const [inviter, setInviter] = useState<InviterStats | null>(null);
  const [showInviteCard, setShowInviteCard] = useState(false);

  useEffect(() => {
    // 1. 自动捕获 URL 参数: ?invitedBy=Name&s=Streak&w=Words
    const params = new URLSearchParams(window.location.search);
    const invitedBy = params.get('invitedBy');
    const streak = params.get('s');
    const words = params.get('w');
    
    if (invitedBy) {
      const inviterData = {
        name: decodeURIComponent(invitedBy),
        streak: streak || '?',
        words: words || '?'
      };
      
      // 2. 持久化到 localStorage，以便后续统计或归因
      localStorage.setItem('referrer', inviterData.name);
      
      setInviter(inviterData);
      setShowInviteCard(true);
      
      // 3. 仪式感特效
      setTimeout(() => {
        playFanfare();
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#8bc34a', '#ffa600', '#ffffff']
        });
      }, 500);
    }
  }, []);

  const handleAcceptInvite = () => {
    playClick();
    setShowInviteCard(false);
    
    // 4. 清理 URL 保持界面整洁
    const url = new URL(window.location.href);
    url.searchParams.delete('invitedBy');
    url.searchParams.delete('s');
    url.searchParams.delete('w');
    window.history.replaceState({}, document.title, url.toString());
    
    // 5. 直接进入游客模式（极简路径）
    onSelectGuest();
  };

  // --- 邀请人专属欢迎卡片 ---
  if (showInviteCard && inviter) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#f7f9e4] z-50 fixed inset-0 animate-fadeIn">
        <div className="w-full max-w-sm bg-white rounded-[3rem] border-[10px] border-white shadow-[0_40px_80px_rgba(0,0,0,0.15)] overflow-hidden animate-zoomIn relative">
          
          {/* 装饰背景 */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#8bc34a]/20 to-transparent pointer-events-none" />

          {/* 票据头部样式 */}
          <div className="bg-[#8bc34a] p-8 text-center relative overflow-hidden">
            <div className="absolute -right-4 -top-4 text-white/20 rotate-12">
               <Ticket size={120} />
            </div>
            <div className="relative z-10">
              <div className="inline-flex bg-white/20 p-3 rounded-2xl border-2 border-white/30 mb-3">
                <Ticket className="text-white" size={32} />
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-[0.2em]">Island Invite</h2>
            </div>
          </div>

          <div className="p-8 text-center space-y-8 relative">
            <div className="space-y-2">
              <p className="text-[#8d99ae] font-black uppercase text-[10px] tracking-[0.3em]">Special Guest of</p>
              <h3 className="text-4xl font-black text-[#4b7d78] break-words leading-tight italic">
                {inviter.name}
              </h3>
            </div>

            {/* 好友成就快照 */}
            <div className="bg-[#f9fbe7] p-6 rounded-[2.5rem] border-4 border-[#e0d9b4] shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-1 bg-[#8bc34a] opacity-30" />
               <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="flex justify-center mb-1">
                      <Flame size={24} className="text-[#ffa600] fill-current" />
                    </div>
                    <div className="text-3xl font-black text-[#4b7d78]">{inviter.streak}</div>
                    <div className="text-[8px] font-black uppercase text-[#8bc34a] tracking-widest">Day Streak</div>
                  </div>
                  <div className="text-center border-l-2 border-[#e0d9b4]/50">
                    <div className="flex justify-center mb-1">
                      <Sprout size={24} className="text-[#8bc34a] fill-current" />
                    </div>
                    <div className="text-3xl font-black text-[#4b7d78]">{inviter.words}</div>
                    <div className="text-[8px] font-black uppercase text-[#8bc34a] tracking-widest">Words Grown</div>
                  </div>
               </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-[#8d99ae] font-bold text-sm">
                   <Sparkles size={16} className="text-[#ffa600]" />
                   <span>Join the island & start your garden!</span>
                </div>

                <button 
                  onClick={handleAcceptInvite}
                  className="w-full bg-[#ffa600] text-white py-5 rounded-[2.5rem] font-black text-xl shadow-[0_10px_0_#e65100] border-4 border-white bubble-button flex items-center justify-center gap-3"
                >
                  <CheckCircle2 size={24} /> Accept & Start
                </button>
                
                <p className="text-[9px] font-bold text-[#8d99ae] uppercase tracking-widest opacity-60">
                   No registration required to explore
                </p>
            </div>
          </div>
        </div>
        
        {/* 页脚署名 */}
        <div className="mt-12 flex flex-col items-center opacity-30 gap-1">
            <div className="flex items-center gap-1.5 text-[10px] font-black text-[#4b7d78] uppercase tracking-[0.4em]">
              Shelly Spanish Island
            </div>
            <Heart size={10} className="text-[#ff7b72] fill-current" />
        </div>
      </div>
    );
  }

  // --- 标准欢迎界面 ---
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-[#f7f9e4]">
      <div className="max-w-lg w-full mx-auto animate-fadeIn">
        <header className="mb-12">
          <div className="inline-flex items-center justify-center w-28 h-28 bg-[#78c850] rounded-[3rem] shadow-[0_12px_0_#5a9a3b] mb-8 border-4 border-white animate-bounce-slight">
            <Leaf className="text-white w-14 h-14 fill-current" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-[#4b7d78] tracking-tighter leading-none mb-4">
            ¡Hola! <br/>
            <span className="text-[#ffa600]">Shelly Island</span>
          </h1>
          <p className="text-[#6d7c8e] font-bold text-xl px-4">Your adventure starts here. Choose your path:</p>
        </header>

        <main className="space-y-6">
          <button
            onClick={onSelectAuth}
            className="group w-full text-left p-6 bg-white rounded-[3rem] border-4 border-[#8bc34a] shadow-[0_12px_0_#689f38] hover:shadow-[0_14px_0_#5a9a3b] hover:-translate-y-1 transition-all flex items-center gap-6 bubble-button"
          >
            <div className="bg-[#e8f5e9] p-4 rounded-3xl border-2 border-[#a5d6a7] group-hover:scale-110 transition-transform">
              <UserPlus className="text-[#388e3c]" size={36} />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-black text-[#4b7d78]">Save to Cloud</h2>
              <p className="text-sm font-bold text-[#8d99ae]">Login to sync progress across devices.</p>
            </div>
          </button>
          
          <button
            onClick={onSelectGuest}
            className="group w-full text-left p-6 bg-white rounded-[3rem] border-4 border-[#e0d9b4] shadow-[0_12px_0_#d0d0d0] hover:shadow-[0_14px_0_#c0c0c0] hover:-translate-y-1 transition-all flex items-center gap-6 bubble-button"
          >
            <div className="bg-[#f1f8e9] p-4 rounded-3xl border-2 border-[#e0e0e0] group-hover:scale-110 transition-transform">
              <Compass className="text-[#8d99ae]" size={36} />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-black text-[#4b7d78]">Explore as Guest</h2>
              <p className="text-sm font-bold text-[#8d99ae]">Jump straight in. Data stays on this device.</p>
            </div>
          </button>
        </main>
      </div>
    </div>
  );
};

export default WelcomeView;
