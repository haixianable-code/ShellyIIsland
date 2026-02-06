
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Word, FeedbackQuality, UserStats } from '../types';
import { playAudio } from '../utils/audio';
import { User } from '@supabase/supabase-js';
import { 
  playClick, 
  playSwish, 
  playHighChime, 
  playHighWood, 
  playLowWood, 
  playThud, 
  playFanfare 
} from '../utils/sfx';
import { 
  ChevronLeft, Sparkles, Zap, ArrowRightLeft, CloudRain, 
  PartyPopper, BookOpen, Layers, 
  Map, Heart, Trophy, ArrowRight,
  FastForward, Pickaxe, Sun, Volume2,
  Globe, Star, ShieldCheck, Flame, UserPlus,
  Share2, CheckCircle2, Ticket
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Sub-component: Grammar Pocket
const GrammarPocket: React.FC<{ word: Word }> = ({ word }) => {
  const conjugationList = word.forms ? word.forms.split(', ') : [];
  
  if (word.type === 'misc') {
    return (
      <section className="bg-[#f3e5f5] p-5 rounded-[2.5rem] border-4 border-[#ce93d8] relative overflow-hidden shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Star size={16} className="text-[#9c27b0]" fill="currentColor" />
          <h4 className="text-[11px] font-black text-[#9c27b0] uppercase tracking-tighter">Golden Rule</h4>
        </div>
        <p className="text-[#4a148c] font-bold text-sm leading-relaxed italic">
          {word.grammarTip}
        </p>
      </section>
    );
  }
  
  let labels: string[] = [];
  if (word.type === 'verb') {
    labels = ['Yo', 'Tú', 'Él/Ella', 'Nos.', 'Vos.', 'Ellos'];
  } else if (word.type === 'noun') {
    labels = ['Singular', 'Plural'];
  } else if (word.type === 'adj') {
    labels = ['Masc', 'Fem', 'Masc Pl', 'Fem Pl'];
  }

  const renderFormText = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\[.*?\])/g);
    return parts.map((part, i) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        return (
          <span key={i} className="text-[#e91e63] underline decoration-wavy decoration-1 underline-offset-4 decoration-[#ff80ab]">
            {part.slice(1, -1)}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <section className="bg-[#fffdf2] p-5 rounded-[2.5rem] border-4 border-[#e0d9b4] relative overflow-hidden shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-[#ffa600]" />
          <h4 className="text-[11px] font-black text-[#4b7d78] uppercase tracking-tighter">Grammar Pocket</h4>
        </div>
        {word.reg === false && (
          <span className="text-[8px] font-black text-[#e91e63] bg-[#fce4ec] px-2 py-0.5 rounded border border-[#f8bbd0] uppercase tracking-widest">
            Pink = Irregular
          </span>
        )}
      </div>
      
      {conjugationList.length > 0 && (
        <div className={`grid gap-2 mb-4 ${word.type === 'verb' ? 'grid-cols-3' : word.type === 'adj' ? 'grid-cols-2' : 'grid-cols-2'}`}>
          {labels.map((label, i) => (
            <div key={label} className="bg-white/80 p-2 rounded-xl border border-[#e0d9b4] text-center">
              <span className="text-[8px] text-[#8d99ae] font-black uppercase block mb-0.5">{label}</span>
              <span className="text-sm font-black truncate block text-[#4b7d78]">
                {conjugationList[i] ? renderFormText(conjugationList[i]) : '-'}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2 text-xs font-bold text-[#5d4037] leading-snug">
        <Sparkles size={14} className="text-[#fbc02d] shrink-0 mt-0.5" />
        <p>{word.grammarTip}</p>
      </div>
    </section>
  );
};

// Sub-component: Usage Examples
const UsageExamples: React.FC<{ word: Word }> = ({ word }) => (
  <section className="bg-[#e3f2fd] p-6 rounded-[3rem] border-b-[8px] border-[#90caf9] relative overflow-hidden">
    <div className="flex items-center gap-2 mb-4">
      <BookOpen size={16} className="text-[#1565c0]" />
      <h4 className="text-[11px] font-black text-[#1565c0] uppercase tracking-tighter">Usage Examples</h4>
    </div>

    <div className="space-y-4 mb-4">
      {word.examples.map((ex, i) => (
        <div 
          key={i} 
          className="pl-3 border-l-3 border-[#90caf9] cursor-pointer active:opacity-60 transition-opacity group"
          onClick={() => { playClick(); playAudio(ex.txt); }} 
          title="Tap to listen"
        >
          <div className="flex items-center gap-2">
             <p className="text-[#1565c0] text-lg font-black italic leading-tight">"{ex.txt}"</p>
             <Volume2 size={12} className="text-[#1565c0] opacity-0 group-hover:opacity-50 transition-opacity" />
          </div>
          <p className="text-[#1565c0]/60 text-[10px] font-bold uppercase">{ex.eng}</p>
        </div>
      ))}
    </div>
    
    {word.nounNotes && (
      <div className="bg-white/70 p-4 rounded-2xl border-2 border-dashed border-[#90caf9]">
        <div className="flex items-center gap-1.5 mb-1">
          <Map size={12} className="text-[#8bc34a]" />
          <span className="text-[9px] text-[#4b7d78] font-black uppercase tracking-wider">Vocab Note</span>
        </div>
        <p className="text-[#4b7d78] text-[11px] font-bold">{word.nounNotes}</p>
      </div>
    )}
  </section>
);

// P1: High Conversion Session Summary & P2: Social Share
const SessionSummary: React.FC<{ 
  words: Word[], 
  onFinish: () => void, 
  isBlitz?: boolean,
  isGuest: boolean,
  onLoginRequest: () => void,
  userStats: UserStats | null,
  user: User | null
}> = ({ words, onFinish, isBlitz, isGuest, onLoginRequest, userStats, user }) => {
  
  useEffect(() => {
    playFanfare();
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
  }, []);

  const handleShare = async () => {
    playClick();
    const streak = userStats?.current_streak || 0;
    const inviterName = user?.email?.split('@')[0] || 'Friend';
    const totalWords = userStats?.total_words_learned || words.length;

    // Create Viral Link
    const shareUrl = new URL(window.location.origin);
    shareUrl.searchParams.set('invitedBy', inviterName);
    shareUrl.searchParams.set('s', streak.toString());
    shareUrl.searchParams.set('w', totalWords.toString());

    const text = `🏝️ I just harvested ${words.length} words on Shelly Spanish Island!\n🔥 Current Streak: ${streak} Days\n\nJoin me in building your vocabulary island! 🇪🇸`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Shelly Spanish Island Harvest',
          text: text,
          url: shareUrl.toString() // Use the proper viral URL
        });
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      // Fallback: Copy full text + link
      navigator.clipboard.writeText(`${text}\n${shareUrl.toString()}`);
      alert('Harvest report and link copied!');
    }
  };

  const receiptWords = words.slice(0, 5);

  return (
    <div className={`flex-1 flex flex-col items-center justify-start pt-12 px-6 text-center animate-zoomIn overflow-y-auto no-scrollbar pb-32 ${isBlitz ? 'bg-[#f3e5f5]' : 'bg-[#f7f9e4]'}`}>
      
      {/* Trophy Section */}
      <div className={`relative mb-6 ${isBlitz ? 'text-[#9c27b0]' : 'text-[#f57c00]'}`}>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white/50 rounded-full blur-2xl" />
         <Trophy size={80} className="relative z-10 fill-current animate-bounce-slight" />
      </div>

      <h2 className={`text-3xl font-black uppercase tracking-tighter italic mb-1 ${isBlitz ? 'text-[#7b1fa2]' : 'text-[#4b7d78]'}`}>
        {isBlitz ? 'Fast & Furious!' : 'Session Complete!'}
      </h2>
      <p className="text-[#8d99ae] font-bold mb-6 text-sm">
        You just watered <strong className="text-[#ffa600]">{words.length}</strong> words.
      </p>

      {/* SHAREABLE HARVEST RECEIPT */}
      <div className="bg-white p-5 rounded-[2rem] shadow-[0_15px_30px_-10px_rgba(0,0,0,0.1)] border border-[#e0e0e0] w-full max-w-xs mb-8 transform rotate-1 hover:rotate-0 transition-transform duration-500 relative">
        {/* Receipt Teeth top */}
        <div className="absolute -top-1.5 left-2 right-2 h-3 bg-white" style={{ clipPath: 'polygon(0% 100%, 5% 0%, 10% 100%, 15% 0%, 20% 100%, 25% 0%, 30% 100%, 35% 0%, 40% 100%, 45% 0%, 50% 100%, 55% 0%, 60% 100%, 65% 0%, 70% 100%, 75% 0%, 80% 100%, 85% 0%, 90% 100%, 95% 0%, 100% 100%)' }}></div>
        
        <div className="flex items-center justify-between mb-4 border-b-2 border-dashed border-[#e0e0e0] pb-2">
            <div className="flex items-center gap-2">
               <Ticket size={18} className="text-[#4b7d78]" />
               <span className="text-[10px] font-black uppercase tracking-widest text-[#4b7d78]">Harvest Report</span>
            </div>
            <div className="text-[10px] font-mono text-[#8d99ae]">{new Date().toLocaleDateString()}</div>
        </div>

        <div className="space-y-2 mb-4">
           {receiptWords.map(w => (
             <div key={w.id} className="flex justify-between items-center text-xs font-bold text-[#5d4037]">
                <span>{w.s}</span>
                <CheckCircle2 size={12} className="text-[#8bc34a]" />
             </div>
           ))}
           {words.length > 5 && (
             <div className="text-center text-[10px] text-[#8d99ae] italic pt-1">
               ...and {words.length - 5} more
             </div>
           )}
        </div>

        <div className="bg-[#f1f8e9] p-3 rounded-xl flex items-center justify-between mb-4">
           <div className="text-left">
              <span className="text-[9px] font-black uppercase text-[#689f38] block">Island Streak</span>
              <div className="flex items-center gap-1">
                 <Flame size={12} className="text-[#ffa600] fill-current" />
                 <span className="text-lg font-black text-[#4b7d78]">{userStats?.current_streak || 0}</span>
              </div>
           </div>
           <div className="text-right">
              <span className="text-[9px] font-black uppercase text-[#689f38] block">XP Gained</span>
              <span className="text-lg font-black text-[#4b7d78]">+{words.length * 10}</span>
           </div>
        </div>

        <button 
           onClick={handleShare}
           className="w-full bg-[#4b7d78] text-white py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:bg-[#3d6662] transition-colors"
        >
           <Share2 size={16} /> Share Harvest
        </button>

        {/* Receipt Teeth bottom */}
        <div className="absolute -bottom-1.5 left-2 right-2 h-3 bg-white" style={{ clipPath: 'polygon(0% 0%, 5% 100%, 10% 0%, 15% 100%, 20% 0%, 25% 100%, 30% 0%, 35% 100%, 40% 0%, 45% 100%, 50% 0%, 55% 100%, 60% 0%, 65% 100%, 70% 0%, 75% 100%, 80% 0%, 85% 100%, 90% 0%, 95% 100%, 100% 0%)' }}></div>
      </div>

      {/* CONVERSION CARD */}
      {isGuest && (
        <div className="w-full max-w-sm bg-[#e3f2fd] p-5 rounded-[2.5rem] border-[6px] border-[#90caf9] shadow-sm mb-6 relative overflow-hidden animate-slideUp">
           <div className="absolute -right-6 -top-6 text-[#bbdefb] opacity-50 rotate-12">
              <ShieldCheck size={100} />
           </div>
           
           <div className="relative z-10 text-left">
              <h3 className="text-[#1565c0] font-black text-lg leading-tight mb-1">Don't lose your XP!</h3>
              <p className="text-[#1e88e5] text-xs font-bold mb-3 pr-8">
                You're making great progress. Save it permanently to the cloud.
              </p>
              
              <button 
                onClick={() => { playClick(); onLoginRequest(); }}
                className="w-full bg-[#1976d2] text-white py-3 rounded-xl font-black flex items-center justify-center gap-2 shadow-md hover:bg-[#1565c0] active:scale-95 transition-all text-sm"
              >
                <UserPlus size={16} />
                <span>Save My Progress</span>
              </button>
           </div>
        </div>
      )}

      {/* Footer Action */}
      <button 
        onClick={() => { playClick(); onFinish(); }}
        className="text-[#8d99ae] font-black uppercase tracking-widest text-xs hover:text-[#4b7d78] transition-colors py-4"
      >
        {isGuest ? 'Skip & Return Home' : 'Back to Island'}
      </button>
      
    </div>
  );
};

interface StudyViewProps {
  words: Word[];
  unlearnedExtra: Word[]; 
  onFinish: () => void;
  onFeedback: (wordId: string, quality: FeedbackQuality) => void;
  onStartExtra: (selected: Word[]) => void;
  isBlitz?: boolean;
  isGuest: boolean;
  onLoginRequest: () => void;
  userStats: UserStats | null;
  user: User | null; // Added prop
}

const StudyView: React.FC<StudyViewProps> = ({ words, onFinish, onFeedback, isBlitz = false, isGuest, onLoginRequest, userStats, user }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isSummaryView, setIsSummaryView] = useState(false);
  const [isReverseMode, setIsReverseMode] = useState(false);
  const [isVibrating, setIsVibrating] = useState(false);

  const word = words[currentIndex];
  
  // Audio Visual Feedback Logic
  const handlePlayAudio = (text: string) => {
    playAudio(text);
    // Trigger vibration effect
    setIsVibrating(true);
    setTimeout(() => setIsVibrating(false), 300); // 300ms wiggle
  };

  useEffect(() => {
    if (showAnswer && word) {
      setTimeout(() => handlePlayAudio(word.s), 400); 
    }
  }, [showAnswer, word]);

  const progressPercent = useMemo(() => {
    if (words.length === 0) return 0;
    return (currentIndex / words.length) * 100;
  }, [currentIndex, words.length]);

  const handleNext = useCallback(() => {
    playClick(); 
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    } else {
      setIsSummaryView(true);
    }
  }, [currentIndex, words.length]);

  const handleRating = (quality: FeedbackQuality) => {
    onFeedback(word.id, quality);

    if (quality === 'easy') {
      playHighChime(); 
      confetti({
        particleCount: 25,
        spread: 40,
        origin: { y: 0.8 },
        colors: isBlitz ? ['#e1bee7', '#ffffff'] : ['#a5d6a7', '#ffffff']
      });
      handleNext();
    } 
    else {
      if (quality === 'good') playHighWood(); 
      else if (quality === 'hard') playLowWood(); 
      else playThud(); 
      
      setShowAnswer(true);
    }
  };

  const toggleReverseMode = () => {
    playClick();
    setIsReverseMode(!isReverseMode);
  };

  if (isSummaryView) {
    return (
      <div className={`flex-1 flex flex-col max-w-2xl mx-auto w-full overflow-hidden ${isBlitz ? 'bg-[#f3e5f5]' : 'bg-[#f7f9e4]'}`}>
        <SessionSummary 
          words={words} 
          onFinish={onFinish} 
          isBlitz={isBlitz}
          isGuest={isGuest}
          onLoginRequest={onLoginRequest}
          userStats={userStats}
          user={user}
        />
      </div>
    );
  }

  if (!word) return null;

  const frontText = isReverseMode ? word.t : word.s;
  const backText = isReverseMode ? word.s : word.t;
  const frontLabel = isReverseMode ? 'English' : 'Spanish';
  const showFrontAudio = !isReverseMode;
  
  const getCardBorderColor = () => {
    if (showAnswer) return 'border-[#ffe082]';
    if (isBlitz) return 'border-[#ce93d8]';
    if (word.type === 'misc') return 'border-[#ce93d8]';
    return 'border-[#8bc34a]';
  };

  return (
    <div className={`flex-1 flex flex-col max-w-2xl mx-auto w-full overflow-hidden animate-fadeIn relative ${isBlitz ? 'bg-[#f3e5f5]' : 'bg-[#f7f9e4]'}`}>
      <div className={`px-4 pt-6 pb-2 shrink-0 z-20 ${isBlitz ? 'bg-[#f3e5f5]' : 'bg-[#f7f9e4]'}`}>
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => { playClick(); onFinish(); }} className="p-3 bg-white rounded-2xl shadow-[0_4px_0_#d0d0d0] border-2 border-[#f0f0f0] text-[#4b7d78] bubble-button">
            <ChevronLeft size={24} strokeWidth={3} />
          </button>
          
          <div className="flex-1 mx-4">
             {isBlitz && (
               <div className="text-center mb-1">
                 <span className="text-[9px] font-black text-[#9c27b0] uppercase tracking-[0.2em] bg-[#e1bee7] px-2 py-0.5 rounded-md">Speed Blitz</span>
               </div>
             )}
             <div className="h-4 bg-white rounded-full border-2 border-[#e0d9b4] shadow-inner overflow-hidden">
               <div 
                 className={`h-full transition-all duration-500 ease-out rounded-full ${isBlitz ? 'bg-[#9c27b0]' : 'bg-[#8bc34a]'}`}
                 style={{ width: `${progressPercent}%` }}
               />
             </div>
          </div>

          <button 
             onClick={toggleReverseMode}
             className={`p-3 rounded-2xl border-2 transition-all active:scale-95 flex items-center gap-1 ${isReverseMode ? 'bg-[#4b7d78] text-white border-[#4b7d78] shadow-inner' : 'bg-white text-[#4b7d78] border-[#f0f0f0] shadow-[0_4px_0_#d0d0d0]'}`}
             title="Toggle Hard Mode (English -> Spanish)"
          >
             {isReverseMode ? <Globe size={20} /> : <ArrowRightLeft size={20} />}
             <span className="text-[10px] font-black uppercase hidden sm:inline">{isReverseMode ? 'Hard' : 'Normal'}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-64">
        <div className={`bg-white w-full rounded-[3.5rem] border-[8px] transition-all duration-200 p-6 flex flex-col items-center shadow-[0_12px_0_rgba(0,0,0,0.08)] relative ${getCardBorderColor()} ${showAnswer ? '' : 'justify-center min-h-[400px] border-dashed'} ${isVibrating ? 'animate-wiggle ring-4 ring-[#8bc34a]/30' : ''}`}>
          
          <div className="flex gap-2 mb-4">
            <div className={`px-3 py-1 rounded-lg text-white font-black text-[9px] uppercase tracking-[0.2em] shadow-sm ${word.type === 'verb' ? 'bg-[#ff7043]' : word.type === 'adj' ? 'bg-[#fbc02d]' : word.type === 'misc' ? 'bg-[#ab47bc]' : 'bg-[#2196f3]'}`}>
              {word.type}
            </div>
            {word.reg === false && (
               <div className="bg-[#e91e63] px-3 py-1 rounded-lg text-white font-black text-[9px] uppercase tracking-[0.2em] flex items-center gap-1 shadow-sm">
                 <Zap size={10} fill="currentColor" /> Irregular
               </div>
            )}
            <div className="bg-[#eceff1] px-3 py-1 rounded-lg text-[#546e7a] font-black text-[9px] uppercase tracking-[0.2em]">
               {frontLabel}
            </div>
          </div>
          
          <button 
            onClick={() => {
              if (showFrontAudio) {
                playClick();
                handlePlayAudio(word.s);
              }
            }}
            disabled={!showFrontAudio}
            className={`group active:scale-95 transition-transform ${!showFrontAudio ? 'cursor-default' : ''}`}
            title={showFrontAudio ? "Tap to listen" : ""}
          >
             <h2 className={`font-black text-[#2e4d4a] leading-tight tracking-tighter text-center transition-all duration-300 flex items-center justify-center gap-3 ${showAnswer ? 'text-4xl md:text-5xl mb-4' : 'text-5xl md:text-7xl mb-8'}`}>
               {frontText}
               {showFrontAudio && (
                 <Volume2 
                   size={showAnswer ? 24 : 32} 
                   className={`text-[#2e4d4a] opacity-0 group-hover:opacity-20 transition-opacity ${showAnswer ? 'translate-y-1' : 'translate-y-2'}`} 
                 />
               )}
             </h2>
          </button>

          {showAnswer && (
            <div className="w-full space-y-6 animate-slideUp text-left">
              <div className="h-1 bg-[#ffd54f] w-12 mx-auto rounded-full mb-2 opacity-30" />
              
              <section className="text-center px-2 py-2">
                  <p className="text-3xl md:text-4xl text-[#2e4d4a] font-black tracking-tight leading-tight uppercase underline decoration-[#ffe082] decoration-4 underline-offset-8">
                    {backText}
                  </p>
                  {isReverseMode && (
                    <button onClick={() => handlePlayAudio(word.s)} className="mt-3 p-2 bg-[#f0f4c3] rounded-full text-[#827717] inline-block active:scale-90 transition-transform">
                      <Volume2 size={24} />
                    </button>
                  )}
              </section>

              <GrammarPocket word={word} />

              {word.type === 'adj' && word.ant && (
                <div className="bg-[#f3e5f5] p-5 rounded-[2rem] border-4 border-[#ce93d8] flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <ArrowRightLeft size={18} className="text-[#9c27b0]" />
                    <div>
                      <span className="text-[9px] font-black text-[#9c27b0] uppercase tracking-widest block">Opposite</span>
                      <span className="text-xl font-black text-[#4a148c]">{word.ant}</span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-[#4a148c] bg-white px-3 py-1 rounded-lg border border-[#ce93d8]">{word.antT}</span>
                </div>
              )}

              <UsageExamples word={word} />

              <div className="pt-8 pb-4 flex flex-col items-center opacity-10 gap-1 pointer-events-none">
                <span className="text-[8px] font-black text-[#4b7d78] uppercase tracking-[0.4em]">Made By SHELLY</span>
                <Heart size={8} className="text-[#ff7b72] fill-current" />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={`fixed bottom-0 left-0 right-0 p-4 pb-8 border-t-4 border-[#e0d9b4] z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] backdrop-blur-md transition-colors ${isBlitz ? 'bg-[#f3e5f5]/90' : 'bg-[#f7f9e4]/80'}`}>
        <div className="max-w-2xl mx-auto">
          
          {!showAnswer ? (
            <div className="animate-slideUp flex flex-col gap-3">
               <p className="text-[10px] font-black text-[#8d99ae] uppercase tracking-[0.25em] mb-1 text-center">
                  How well do you know this?
               </p>
               
               <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'forgot', icon: CloudRain, color: '#455a64', label: 'Forgot', bg: '#eceff1', border: '#90a4ae', shadow: '#78909c' },
                    { id: 'hard', icon: Pickaxe, color: '#e65100', label: 'Hard', bg: '#fff3e0', border: '#ffb74d', shadow: '#fb8c00' },
                    { id: 'good', icon: Sun, color: '#f57f17', label: 'Good', bg: '#fff9c4', border: '#fbc02d', shadow: '#f57f17' },
                  ].map((btn) => (
                    <button 
                      key={btn.id}
                      onClick={() => { playSwish(); handleRating(btn.id as FeedbackQuality); }} 
                      className={`p-3 rounded-2xl flex flex-col items-center border-4 bubble-button transition-all active:translate-y-1 active:shadow-none relative group overflow-hidden`}
                      style={{ 
                        backgroundColor: btn.bg, 
                        borderColor: btn.border, 
                        color: btn.color,
                        boxShadow: `0 6px 0 ${btn.shadow}`
                      }}
                    >
                      <btn.icon size={22} className="mb-1 fill-current opacity-80" />
                      <span className="text-[9px] font-black uppercase tracking-tighter text-center">{btn.label}</span>
                    </button>
                  ))}
               </div>

               <button 
                  onClick={() => handleRating('easy')} 
                  className="w-full p-4 rounded-2xl border-4 bubble-button transition-all active:translate-y-1 active:shadow-none relative group overflow-hidden flex items-center justify-center gap-2 bg-[#a5d6a7] border-[#2e7d32] text-[#004d40] shadow-[0_6px_0_#1b5e20] hover:bg-[#81c784]"
               >
                  <div className="absolute inset-0 bg-white/20 animate-pulse pointer-events-none" />
                  <PartyPopper size={24} className="fill-current" />
                  <div className="flex flex-col items-start leading-none">
                     <span className="text-lg font-black uppercase tracking-tighter">Perfect</span>
                     <span className="text-[8px] font-black uppercase tracking-widest opacity-80">Skip Details</span>
                  </div>
                  <FastForward size={20} className="ml-1 opacity-70" />
               </button>
            </div>
          ) : (
            <div className="animate-slideUp">
               <button 
                 onClick={handleNext}
                 className={`w-full py-5 rounded-[2.5rem] font-black text-xl text-white shadow-[0_8px_0_rgba(0,0,0,0.2)] border-4 border-white bubble-button flex items-center justify-center gap-3 ${isBlitz ? 'bg-[#9c27b0]' : 'bg-[#8bc34a]'}`}
               >
                 <span>Next Word</span>
                 <ArrowRight size={24} />
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyView;
