
import React, { useState, useCallback, useMemo } from 'react';
import { Word, FeedbackQuality } from '../types';
import { 
  ChevronLeft, Sparkles, Zap, ArrowRightLeft, CloudRain, 
  Smile, PartyPopper, BookOpen, Layers, HelpCircle, 
  Map, Eye, Heart, Trophy, CheckCircle2, ArrowRight,
  Sprout, Leaf, Sparkle
} from 'lucide-react';

// Sub-component: Grammar Pocket
const GrammarPocket: React.FC<{ word: Word }> = ({ word }) => {
  const conjugationList = word.forms ? word.forms.split(', ') : [];
  const pronouns = ['Yo', 'Tú', 'Él/Ella', 'Nos.', 'Vos.', 'Ellos'];

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
        <div className="grid grid-cols-3 gap-2 mb-4">
          {pronouns.map((p, i) => (
            <div key={p} className="bg-white/80 p-2 rounded-xl border border-[#e0d9b4] text-center">
              <span className="text-[8px] text-[#8d99ae] font-black uppercase block mb-0.5">{p}</span>
              <span className="text-sm font-black truncate block text-[#4b7d78]">
                {renderFormText(conjugationList[i])}
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
        <div key={i} className="pl-3 border-l-3 border-[#90caf9]">
          <p className="text-[#1565c0] text-lg font-black italic leading-tight">"{ex.txt}"</p>
          <p className="text-[#1565c0]/60 text-[10px] font-bold uppercase">{ex.eng}</p>
        </div>
      ))}
    </div>
    
    <div className="bg-white/70 p-4 rounded-2xl border-2 border-dashed border-[#90caf9]">
      <div className="flex items-center gap-1.5 mb-1">
        <Map size={12} className="text-[#8bc34a]" />
        <span className="text-[9px] text-[#4b7d78] font-black uppercase tracking-wider">Vocab Note</span>
      </div>
      <p className="text-[#4b7d78] text-[11px] font-bold">{word.nounNotes}</p>
    </div>
  </section>
);

// Sub-component: Session Summary
const SessionSummary: React.FC<{ 
  words: Word[], 
  onFinish: () => void, 
  extraAvailable: Word[],
  onStartExtra: (selected: Word[]) => void
}> = ({ words, onFinish, extraAvailable, onStartExtra }) => {
  const suggestedBonus = useMemo(() => extraAvailable.slice(0, 10), [extraAvailable]);

  return (
    <div className="flex-1 flex flex-col items-center p-6 text-center animate-zoomIn overflow-y-auto no-scrollbar pb-32 bg-[#f7f9e4]">
      {/* Achievement Card - Unified Green Theme */}
      <div className="bg-white p-8 rounded-[4rem] border-[8px] border-[#8bc34a] shadow-[0_15px_0_#689f38] max-w-sm w-full relative mb-12 shrink-0 mt-8 z-10">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#ffeb3b] p-6 rounded-[2.5rem] shadow-[0_8px_0_#fbc02d] border-4 border-white animate-bounce">
          <Trophy size={48} className="text-[#f57c00] fill-current" />
        </div>
        
        <div className="mt-10 space-y-6">
          <div>
            <h2 className="text-3xl font-black text-[#4b7d78] uppercase tracking-tighter italic">¡Victoria en la isla!</h2>
            <p className="text-[#8d99ae] font-bold text-sm mt-1 uppercase tracking-widest">Seeds successfully tended</p>
          </div>

          <div className="py-6 border-y-4 border-dashed border-[#e0d9b4] flex flex-col items-center">
            <span className="text-6xl font-black text-[#8bc34a] drop-shadow-sm">{words.length}</span>
            <span className="text-[10px] font-black text-[#8d99ae] uppercase tracking-[0.3em] mt-1">Harvested Today</span>
          </div>

          <button 
            onClick={onFinish}
            className="w-full bg-[#f1f8e9] text-[#2e7d32] py-5 rounded-[2.5rem] font-black text-xl shadow-[0_8px_0_#c5e1a5] border-4 border-[#c5e1a5] bubble-button flex items-center justify-center gap-3 mt-4 relative z-20"
          >
            Back Home <ArrowRight size={24} />
          </button>
        </div>
      </div>

      {/* Bonus Box - Clearer Action and Unified Language */}
      {suggestedBonus.length > 0 && (
        <div className="w-full max-w-md bg-[#e8f5e9] p-8 rounded-[4rem] border-[6px] border-[#8bc34a] shadow-[0_12px_0_#689f38] mb-12 relative overflow-hidden group z-10">
          <div className="absolute -top-10 -right-10 opacity-10 rotate-12 transition-transform group-hover:rotate-45 duration-1000 pointer-events-none">
            <Sparkle size={180} className="fill-current text-[#2e7d32]" />
          </div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-white p-4 rounded-[2.5rem] border-4 border-[#8bc34a] shadow-sm mb-6 animate-pulse">
               <Leaf size={40} className="text-[#8bc34a] fill-current" />
            </div>
            
            <h3 className="text-2xl font-black text-[#1b5e20] uppercase tracking-tighter mb-2 italic">Still Energetic?</h3>
            <p className="text-sm font-bold text-[#2e7d32] mb-8 max-w-[260px] leading-snug">
              Grow your island even further!<br/>
              <span className="text-[#d32f2f] font-black uppercase tracking-tight">Plant 10 extra seeds</span> right now.
            </p>

            <button
              onClick={() => onStartExtra(suggestedBonus)}
              className="group w-full bg-[#8bc34a] text-white py-6 rounded-[2.5rem] font-black text-xl shadow-[0_12px_0_#5a9a3b] border-4 border-white bubble-button flex flex-col items-center justify-center gap-1 hover:bg-[#96e072] transition-colors relative z-20"
            >
              <div className="flex items-center gap-3">
                <Leaf size={32} className="fill-current group-hover:rotate-12 transition-transform" />
                <span>Learn 10 More</span>
              </div>
              <span className="text-[10px] opacity-70 font-black uppercase tracking-[0.1em]">Instant Expansion Pack</span>
            </button>
            
            <p className="mt-6 text-[9px] font-black text-[#2e7d32]/40 uppercase tracking-[0.3em]">
              Next: High-frequency essentials
            </p>
          </div>
        </div>
      )}
      
      <div className="mt-4 flex flex-col items-center opacity-20 gap-1 grayscale pb-12 shrink-0 pointer-events-none">
          <span className="text-[8px] font-black text-[#4b7d78] uppercase tracking-[0.4em]">Island Progress Saved</span>
          <Heart size={8} className="text-[#ff7b72] fill-current" />
      </div>
    </div>
  );
};

interface StudyViewProps {
  words: Word[];
  unlearnedExtra: Word[];
  onFinish: () => void;
  onFeedback: (wordId: string, quality: FeedbackQuality) => void;
  onStartExtra: (selected: Word[]) => void;
}

const StudyView: React.FC<StudyViewProps> = ({ words, unlearnedExtra, onFinish, onFeedback, onStartExtra }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isSummaryView, setIsSummaryView] = useState(false);

  const word = words[currentIndex];
  
  const progressPercent = useMemo(() => {
    if (words.length === 0) return 0;
    return (currentIndex / words.length) * 100;
  }, [currentIndex, words.length]);

  const handleNext = useCallback(() => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    } else {
      setIsSummaryView(true);
    }
  }, [currentIndex, words.length]);

  const handleFeedbackClick = (quality: FeedbackQuality) => {
    onFeedback(word.id, quality);
    handleNext();
  };

  if (isSummaryView) {
    return (
      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full bg-[#f7f9e4] overflow-hidden">
        <SessionSummary 
          words={words} 
          onFinish={onFinish} 
          extraAvailable={unlearnedExtra}
          onStartExtra={onStartExtra}
        />
      </div>
    );
  }

  if (!word) return null;

  return (
    <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full bg-[#f7f9e4] overflow-hidden animate-fadeIn relative">
      {/* Header & Progress */}
      <div className="px-4 pt-6 pb-2 shrink-0 z-20 bg-[#f7f9e4]">
        <div className="flex justify-between items-center mb-4">
          <button onClick={onFinish} className="p-3 bg-white rounded-2xl shadow-[0_4px_0_#d0d0d0] border-2 border-[#f0f0f0] text-[#4b7d78] bubble-button">
            <ChevronLeft size={24} strokeWidth={3} />
          </button>
          <div className="flex-1 mx-6">
            <div className="h-4 bg-white rounded-full border-2 border-[#e0d9b4] shadow-inner overflow-hidden">
               <div 
                 className="h-full bg-[#8bc34a] transition-all duration-500 ease-out rounded-full"
                 style={{ width: `${progressPercent}%` }}
               />
            </div>
            <div className="text-[10px] font-black text-[#8d99ae] uppercase tracking-widest mt-1 text-center">
              Word {currentIndex + 1} of {words.length}
            </div>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-64">
        <div className={`bg-white w-full rounded-[3.5rem] border-[8px] transition-all duration-500 p-6 flex flex-col items-center shadow-[0_12px_0_rgba(0,0,0,0.08)] relative ${showAnswer ? 'border-[#ffe082]' : 'border-dashed border-[#8bc34a] min-h-[400px] justify-center'}`}>
          
          <div className="flex gap-2 mb-4">
            <div className={`px-3 py-1 rounded-lg text-white font-black text-[9px] uppercase tracking-[0.2em] shadow-sm ${word.type === 'verb' ? 'bg-[#ff7043]' : word.type === 'adj' ? 'bg-[#fbc02d]' : 'bg-[#2196f3]'}`}>
              {word.type}
            </div>
            {word.reg === false && (
               <div className="bg-[#e91e63] px-3 py-1 rounded-lg text-white font-black text-[9px] uppercase tracking-[0.2em] flex items-center gap-1 shadow-sm">
                 <Zap size={10} fill="currentColor" /> Irregular
               </div>
            )}
          </div>
          
          <h2 className={`font-black text-[#2e4d4a] leading-tight tracking-tighter text-center transition-all duration-300 ${showAnswer ? 'text-4xl md:text-5xl mb-4' : 'text-6xl md:text-7xl mb-8'}`}>
            {word.s}
          </h2>

          {!showAnswer ? (
            <div className="flex flex-col items-center w-full">
              <button 
                onClick={() => setShowAnswer(true)}
                className="w-full max-w-xs bg-[#8bc34a] text-white py-6 rounded-[2.5rem] font-black text-xl shadow-[0_8px_0_#689f38] border-4 border-white bubble-button flex items-center justify-center gap-3 animate-pulse"
              >
                <Eye size={24} /> Reveal Meaning
              </button>
            </div>
          ) : (
            <div className="w-full space-y-6 animate-slideUp text-left">
              <div className="h-1 bg-[#ffd54f] w-12 mx-auto rounded-full mb-2 opacity-30" />
              
              <section className="text-center px-2 py-2">
                  <p className="text-3xl md:text-4xl text-[#2e4d4a] font-black tracking-tight leading-tight uppercase underline decoration-[#ffe082] decoration-4 underline-offset-8">
                    {word.t}
                  </p>
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

      {showAnswer && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#f7f9e4]/80 backdrop-blur-md p-4 pb-8 border-t-4 border-[#e0d9b4] animate-slideUp z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
          <div className="max-w-2xl mx-auto">
            <p className="text-[10px] font-black text-[#8d99ae] uppercase tracking-[0.25em] mb-4 text-center">How well did you recall it?</p>
            <div className="grid grid-cols-4 gap-3">
              {[
                { id: 'forgot', icon: CloudRain, color: '#455a64', label: 'Forgot', bg: '#eceff1', border: '#90a4ae', shadow: '#78909c' },
                { id: 'hard', icon: HelpCircle, color: '#e65100', label: 'Hard', bg: '#fff3e0', border: '#ffb74d', shadow: '#fb8c00' },
                { id: 'good', icon: Smile, color: '#c2185b', label: 'Good', bg: '#fce4ec', border: '#f06292', shadow: '#d81b60' },
                { id: 'easy', icon: PartyPopper, color: '#004d40', label: 'Perfect', bg: '#a5d6a7', border: '#2e7d32', shadow: '#1b5e20' }
              ].map((btn) => (
                <button 
                  key={btn.id}
                  onClick={() => handleFeedbackClick(btn.id as FeedbackQuality)} 
                  className={`p-3 rounded-2xl flex flex-col items-center border-4 bubble-button transition-all active:translate-y-1 active:shadow-none`}
                  style={{ 
                    backgroundColor: btn.bg, 
                    borderColor: btn.border, 
                    color: btn.color,
                    boxShadow: `0 6px 0 ${btn.shadow}`
                  }}
                >
                  <btn.icon size={22} className={`mb-1 fill-current ${btn.id === 'easy' ? 'opacity-100 scale-110' : 'opacity-80'}`} />
                  <span className={`text-[9px] font-black uppercase tracking-tighter text-center ${btn.id === 'easy' ? 'text-[10px]' : ''}`}>{btn.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyView;
