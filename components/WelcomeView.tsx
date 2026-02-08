
import React, { useEffect, useState } from 'react';
import { Leaf, UserPlus, Compass, Ticket, Sparkles, CheckCircle2, Flame, Sprout, Heart, ShieldCheck, ChevronRight } from 'lucide-react';
import { playFanfare, playClick } from '../utils/sfx';
import confetti from 'canvas-confetti';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const [inviter, setInviter] = useState<InviterStats | null>(null);
  const [showInviteCard, setShowInviteCard] = useState(false);

  useEffect(() => {
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
      localStorage.setItem('referrer', inviterData.name);
      setInviter(inviterData);
      setShowInviteCard(true);
      
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
    const url = new URL(window.location.href);
    url.searchParams.delete('invitedBy');
    url.searchParams.delete('s');
    url.searchParams.delete('w');
    window.history.replaceState({}, document.title, url.toString());
    onSelectGuest();
  };

  if (showInviteCard && inviter) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#f7f9e4] z-50 fixed inset-0 animate-fadeIn">
        <div className="w-full max-w-sm bg-white rounded-[3rem] border-[10px] border-white shadow-[0_40px_80px_rgba(0,0,0,0.15)] overflow-hidden animate-zoomIn relative">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#8bc34a]/20 to-transparent pointer-events-none" />
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
              <h3 className="text-4xl font-black text-[#4b7d78] break-words leading-tight italic">{inviter.name}</h3>
            </div>
            <div className="bg-[#f9fbe7] p-6 rounded-[2.5rem] border-4 border-[#e0d9b4] shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-1 bg-[#8bc34a] opacity-30" />
               <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="flex justify-center mb-1"><Flame size={24} className="text-[#ffa600] fill-current" /></div>
                    <div className="text-3xl font-black text-[#4b7d78]">{inviter.streak}</div>
                    <div className="text-[8px] font-black uppercase text-[#8bc34a] tracking-widest">Day Streak</div>
                  </div>
                  <div className="text-center border-l-2 border-[#e0d9b4]/50">
                    <div className="flex justify-center mb-1"><Sprout size={24} className="text-[#8bc34a] fill-current" /></div>
                    <div className="text-3xl font-black text-[#4b7d78]">{inviter.words}</div>
                    <div className="text-[8px] font-black uppercase text-[#8bc34a] tracking-widest">Words Grown</div>
                  </div>
               </div>
            </div>
            <div className="space-y-4">
                <button onClick={handleAcceptInvite} className="w-full bg-[#ffa600] text-white py-5 rounded-[2.5rem] font-black text-xl shadow-[0_10px_0_#e65100] border-4 border-white bubble-button flex items-center justify-center gap-3">
                  <CheckCircle2 size={24} /> Accept & Start
                </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-[#f7f9e4]">
      <div className="max-w-lg w-full mx-auto animate-fadeIn px-4">
        <header className="mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-[#78c850] rounded-[2.5rem] shadow-[0_10px_0_#5a9a3b] mb-8 border-4 border-white animate-bounce-slight">
            <Leaf className="text-white w-12 h-12 fill-current" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#4b7d78] tracking-tighter leading-tight mb-2">
            ¡Hola! <br/>
            <span className="text-[#ffa600]">Shelly Spanish Island</span>
          </h1>
          <p className="text-[#6d7c8e] font-bold text-lg">{t('ui.dashboard.welcome')}</p>
        </header>

        <main className="flex flex-col items-center space-y-10">
          <div className="w-full relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#8bc34a] to-[#ffa600] rounded-[3.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <button
              onClick={() => { playClick(); onSelectAuth(); }}
              className="relative w-full bg-[#2d4a47] p-8 rounded-[3rem] border-4 border-[#4b7d78] shadow-[0_15px_30px_rgba(45,74,71,0.3)] hover:shadow-[0_20px_40px_rgba(45,74,71,0.4)] hover:-translate-y-1 transition-all flex items-center gap-6 overflow-hidden bubble-button"
            >
              <div className="bg-[#78c850] p-5 rounded-[2.2rem] border-2 border-white/20 shadow-inner shrink-0">
                <ShieldCheck className="text-white" size={32} />
              </div>
              <div className="flex-1 text-left">
                <h2 className="text-2xl font-black text-white leading-tight uppercase tracking-tighter">{t('ui.passport.apply_now')}</h2>
                <p className="text-[#8bc34a] font-black text-[10px] mt-1 uppercase tracking-widest border border-[#8bc34a]/30 inline-block px-2 py-0.5 rounded-md">
                   Authorized by SSI Dept.
                </p>
              </div>
              <ChevronRight className="text-white/30" size={32} />
              
              {/* Gold Emblem Decor */}
              <div className="absolute -right-6 -bottom-6 w-24 h-24 border-[10px] border-[#ffa600]/10 rounded-full flex items-center justify-center rotate-12">
                <Sparkles size={40} className="text-[#ffa600]/10" />
              </div>
            </button>
          </div>
          
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={() => { playClick(); onSelectGuest(); }}
              className="group flex items-center gap-2 text-[#8d99ae] font-black text-sm uppercase tracking-widest hover:text-[#4b7d78] transition-colors"
            >
              <Compass size={18} />
              <span className="underline underline-offset-8 decoration-2 decoration-[#e0d9b4] group-hover:decoration-[#8bc34a] transition-all">
                {t('ui.passport.temp_pass')}
              </span>
            </button>
            <p className="text-[10px] font-bold text-[#8d99ae] opacity-50 px-8 leading-relaxed max-w-[280px]">
              {t('ui.passport.verify_warning')}
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default WelcomeView;
