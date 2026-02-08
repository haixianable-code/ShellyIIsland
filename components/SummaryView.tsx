
import React, { useState, useEffect, useMemo } from 'react';
import { Word } from '../types';
import { useTranslation } from 'react-i18next';
import { getTypeTheme } from '../utils/theme';
import { 
  Trophy, Share2, Heart, 
  TreePalm, Map,
  Flame, Sprout, Home, Volume2, Sparkles, Gem,
  Shield, Award, ShieldAlert, ChevronRight, CloudUpload, Fingerprint, ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playFanfare, playClick, playSparkle } from '../utils/sfx';
import { playAudio } from '../utils/audio';

// Gardener Level Logic
const getGardenerLevel = (total: number) => {
  if (total <= 20) return { title: 'Apprentice Gardener', icon: Sprout, next: 21, color: '#8bc34a' };
  if (total <= 50) return { title: 'Diligent Farmer', icon: Award, next: 51, color: '#ffa600' };
  if (total <= 100) return { title: 'Island Wealthy', icon: Gem, next: 101, color: '#ab47bc' };
  return { title: 'Spanish Lord', icon: Shield, next: 9999, color: '#ff7b72' };
};

const WordSticker: React.FC<{ word: Word }> = ({ word }) => {
  const { t } = useTranslation();
  const theme = getTypeTheme(word);
  
  const randomStyles = useMemo(() => ({
    rotate: `${Math.floor(Math.random() * 20) - 10}deg`,
    x: `${Math.floor(Math.random() * 10) - 5}px`,
    y: `${Math.floor(Math.random() * 10) - 5}px`,
  }), []);

  const handleWordClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    playClick();
    playAudio(word.s);
  };

  return (
    <button 
      type="button"
      onClick={handleWordClick}
      style={{ 
        transform: `rotate(${randomStyles.rotate}) translate(${randomStyles.x}, ${randomStyles.y})`,
        backgroundColor: theme.main,
        borderColor: 'white'
      }}
      className="inline-flex flex-col items-center px-5 py-3 rounded-2xl border-4 shadow-lg text-white transition-all active:scale-95 active:shadow-sm hover:z-20 hover:scale-105 group relative cursor-pointer"
    >
      <span className="font-black text-lg leading-tight tracking-tight pointer-events-none">{word.s}</span>
      <span className="text-[9px] font-black opacity-80 uppercase mt-0.5 pointer-events-none">
        {t(`vocab.${word.id}.t`, { defaultValue: word.t })}
      </span>
      <div className="absolute -top-1 -left-1 w-2 h-2 bg-white/40 rounded-full" />
    </button>
  );
};

const SummaryView: React.FC<any> = ({ words, totalLearned, streak, user, onFinish, onLoginRequest }) => {
  const { t } = useTranslation();
  const [shareState, setShareState] = useState<'idle' | 'copied'>('idle');

  const levelInfo = useMemo(() => getGardenerLevel(totalLearned), [totalLearned]);
  const progressToNext = Math.min(100, (totalLearned / levelInfo.next) * 100);

  useEffect(() => {
    playFanfare();
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8bc34a', '#ffa600', '#ffffff', '#ff7b72', '#29b6f6']
    });
  }, []);

  const handleShare = async () => {
    playClick();
    const shareUrl = new URL(window.location.origin);
    const shareText = t('ui.study.share_template', {
      level: levelInfo.title,
      streak: streak,
      count: words.length,
      url: shareUrl.toString()
    });

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Shelly Spanish Island', text: shareText, url: shareUrl.toString() });
      } catch (err) { /* ignore */ }
    } else {
      await navigator.clipboard.writeText(shareText);
      setShareState('copied');
      setTimeout(() => setShareState('idle'), 2000);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start py-8 px-4 md:py-12 md:px-12 animate-fadeIn bg-gradient-to-b from-[#f7f9e4] to-[#fffde7] h-[100dvh] overflow-y-auto no-scrollbar pb-32">
      <div className="relative w-full max-w-xl mb-12 flex flex-col items-center">
        <div className="absolute top-0 -left-12 opacity-5 -rotate-12 pointer-events-none"><TreePalm size={180} /></div>
        <div className="absolute bottom-40 -right-12 opacity-5 rotate-12 pointer-events-none"><Map size={180} /></div>
        <div className="bg-white rounded-[3.5rem] border-[10px] border-white shadow-[0_40px_80px_-20px_rgba(45,74,71,0.2)] overflow-hidden flex flex-col relative z-10 w-full shrink-0">
          <div className="bg-[#8bc34a] p-10 pb-14 text-center text-white relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-white/20 p-3 rounded-3xl backdrop-blur-sm border-2 border-white/30 rotate-12"><Trophy size={40} className="drop-shadow-md" /></div>
            <div className="absolute -left-8 -bottom-8 opacity-20"><Sparkles size={120} /></div>
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-1 relative z-10">{t('ui.study.summary_title')}</h2>
            <p className="text-white/80 font-black uppercase tracking-widest text-[11px] italic relative z-10">{t('ui.study.harvest_report')}</p>
          </div>
          <div className="p-8 space-y-8 bg-white rounded-t-[3.5rem] -mt-8 relative z-20">
            <div className="bg-slate-50/80 rounded-[2.5rem] p-6 border-2 border-slate-100 flex flex-col items-center relative group">
               <div className="absolute -top-4 bg-white px-5 py-1 rounded-full border-2 border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest shadow-sm">
                 {t('ui.dashboard.slang_title')}
               </div>
               <div className="flex items-center gap-4 mb-4 mt-2">
                 <div style={{ backgroundColor: levelInfo.color }} className="p-4 rounded-[1.8rem] text-white shadow-lg rotate-[-4deg]"><levelInfo.icon size={32} /></div>
                 <div className="text-left"><h3 className="text-3xl font-black text-[#4b7d78] tracking-tight">{levelInfo.title}</h3><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('ui.study.total_growth')}: {totalLearned}</p></div>
               </div>
               <div className="w-full px-4 mb-2"><div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden border-2 border-white shadow-inner"><div className="h-full transition-all duration-1000 ease-out rounded-full" style={{ width: `${progressToNext}%`, backgroundColor: levelInfo.color }} /></div></div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#f1f8e9] p-5 rounded-[2.5rem] border-4 border-[#e8f5e9] flex flex-col items-center shadow-inner group"><Flame size={28} className="text-[#ffa600] mb-1 fill-current group-hover:scale-110 transition-transform" /><span className="text-4xl font-black text-[#4b7d78] tracking-tighter">{streak}</span><span className="text-[9px] font-black uppercase text-[#8bc34a] tracking-widest mt-1">Day Streak</span></div>
              <div className="bg-[#fffde7] p-5 rounded-[2.5rem] border-4 border-[#fff9c4] flex flex-col items-center shadow-inner group">
                <Gem size={28} className="text-[#fbc02d] mb-1 fill-current group-hover:rotate-12 transition-transform" />
                <span className="text-4xl font-black text-[#4b7d78] tracking-tighter">{words.length}</span>
                <span className="text-[9px] font-black uppercase text-[#fbc02d] tracking-widest mt-1">{t('ui.study.today_harvest')}</span>
              </div>
            </div>

            <div className="relative py-12 px-6 bg-slate-50/50 rounded-[3rem] border-4 border-dashed border-slate-100 min-h-[300px]">
              <div className="flex flex-wrap justify-center gap-3">{words.map(w => <WordSticker key={w.id} word={w} />)}</div>
            </div>

            {/* Enhanced Citizen Onboarding Module */}
            {!user && (
              <div className="bg-[#fff9c4] p-8 rounded-[3.5rem] border-[6px] border-white shadow-[0_15px_30px_rgba(251,192,45,0.2)] animate-slideUp relative overflow-hidden group">
                 <div className="absolute -right-6 -top-6 w-32 h-32 border-[12px] border-[#fbc02d]/10 rounded-full flex items-center justify-center rotate-12">
                   <ShieldCheck size={60} className="text-[#fbc02d]/10" />
                 </div>
                 
                 <div className="flex flex-col items-center text-center relative z-10 space-y-4">
                    <div className="bg-[#fbc02d] p-4 rounded-[1.8rem] shadow-md border-4 border-white rotate-[-3deg]">
                       <Fingerprint className="text-white" size={32} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-2xl font-black text-[#4b7d78] uppercase tracking-tighter italic">{t('ui.passport.protect_harvest')}</h3>
                      <p className="text-xs font-bold text-[#8d99ae] leading-relaxed max-w-[240px] mx-auto">
                        {t('ui.passport.protect_desc', { count: totalLearned })}. Warning: Guest seeds may vanish in the storm.
                      </p>
                    </div>
                    
                    <button 
                      onClick={() => { playSparkle(); onLoginRequest(); }}
                      className="w-full bg-[#4b7d78] text-white py-5 rounded-[2rem] font-black text-xl flex items-center justify-between px-8 active:scale-95 transition-all shadow-[0_10px_0_#2d4a47] border-4 border-white hover:bg-[#3d5a57]"
                    >
                       <div className="flex items-center gap-3">
                          <CloudUpload size={24} className="animate-bounce" />
                          <span>{t('ui.passport.apply_now')}</span>
                       </div>
                       <ChevronRight size={24} />
                    </button>
                    
                    <div className="flex items-center gap-2 opacity-30 text-[9px] font-black uppercase tracking-widest pt-2">
                      <Fingerprint size={12} /> IDENTITY SECURE • PROGRESS BACKED UP • PERMANENT ACCESS
                    </div>
                 </div>
              </div>
            )}

            <div className="space-y-4 pt-2">
              <button 
                onClick={handleShare} 
                className="w-full bg-[#ffa600] text-white py-5 rounded-[2.5rem] font-black text-xl shadow-[0_8px_0_#e65100] border-4 border-white bubble-button flex items-center justify-center gap-3 active:translate-y-2 active:shadow-none transition-all"
              >
                <Share2 size={22} />
                <span>{shareState === 'copied' ? t('ui.actions.copied') : t('ui.actions.share_island')}</span>
              </button>
              <button 
                onClick={onFinish} 
                className="w-full bg-slate-100 text-[#4b7d78] py-4 rounded-[2rem] font-black text-lg transition-all active:translate-y-1 flex items-center justify-center gap-2 border-b-4 border-slate-200"
              >
                <Home size={20} />
                <span>{t('ui.nav.home')}</span>
              </button>
            </div>
          </div>
          <div className="bg-slate-50 py-6 flex flex-col items-center opacity-40"><div className="flex items-center gap-1.5 text-[8px] font-black text-slate-500 uppercase tracking-[0.4em]">Island Gardener Authority <Heart size={6} className="fill-current text-[#ff7b72]" /></div></div>
        </div>
      </div>
    </div>
  );
};

export default SummaryView;
