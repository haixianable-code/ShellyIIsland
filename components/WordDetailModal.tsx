
import React, { useState, useEffect } from 'react';
import { Word } from '../types';
import { playAudio } from '../utils/audio';
import { getTypeTheme, getPosLabel } from '../utils/theme';
import { X, Volume2, Sparkles, AudioLines, BookOpen, PenTool, BrainCircuit, Loader2, Send, MessageSquareText, Heart, Lock, Crown, Eye, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { playClick, playSparkle, playSwish } from '../utils/sfx';
import { useIslandStore } from '../store/useIslandStore';
import { getAIChallengeFeedback, getAISmartHint } from '../services/geminiService';
import { storageService } from '../services/storageService';

const AI_CACHE_KEY = 'ssi_ai_content_v1';

interface WordDetailModalProps {
  word: Word;
  onClose: () => void;
}

type ActiveTool = 'none' | 'challenge' | 'mnemonic';

const WordDetailModal: React.FC<WordDetailModalProps> = ({ word, onClose }) => {
  const { t } = useTranslation();
  const { aiCache, consumeAIToken, consumeMnemonicToken, aiUsage, mnemonicUsage, profile, openModal } = useIslandStore();
  const [activeText, setActiveText] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<ActiveTool>('none');
  
  // AI Challenge State
  const [userInput, setUserInput] = useState('');
  const [aiFeedback, setAiFeedback] = useState<{recast?: string, note?: string} | null>(null);
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  // Mnemonic State (Soft Lock)
  const isPremium = profile?.is_premium;
  const [isMnemonicRevealed, setIsMnemonicRevealed] = useState(!!isPremium); // Premium users see it instantly
  const [isMnemonicLoading, setIsMnemonicLoading] = useState(false);

  const theme = getTypeTheme(word);
  const conjugationList = word.forms ? word.forms.split(', ') : [];
  const aiInfo = aiCache[word.id];
  
  // Usage tracking
  const challengeUsesLeft = isPremium ? 999 : Math.max(0, 3 - aiUsage.count);
  const isChallengeLocked = !isPremium && challengeUsesLeft === 0;
  
  const mnemonicUsesLeft = isPremium ? 999 : Math.max(0, 5 - mnemonicUsage.count);

  const pronouns = word.type === 'verb' 
    ? [t('ui.grammar.yo'), t('ui.grammar.tu'), t('ui.grammar.el'), t('ui.grammar.nos'), t('ui.grammar.vos'), t('ui.grammar.ellos')] 
    : word.type === 'noun' 
      ? [t('ui.grammar.sing'), t('ui.grammar.plur')] 
      : [t('ui.grammar.masc'), t('ui.grammar.fem'), t('ui.grammar.masc_pl'), t('ui.grammar.fem_pl')];

  useEffect(() => {
    document.body.classList.add('modal-open');
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  useEffect(() => {
    if (isPremium && !aiInfo && !isMnemonicLoading) {
       setIsMnemonicLoading(true);
       getAISmartHint(word.s, word.t).then(info => {
          if (info) {
             useIslandStore.setState(state => {
                const updated = { ...state.aiCache, [word.id]: info };
                storageService.setItem(AI_CACHE_KEY, updated);
                return { aiCache: updated };
             });
          }
          setIsMnemonicLoading(false);
       });
    }
  }, [isPremium, aiInfo, word.id]);

  const handleSpeak = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    setActiveText(text);
    playAudio(text, () => setActiveText(text), () => setActiveText(null));
    try { playClick(); } catch (err) {}
  };

  const handleRevealMnemonic = async () => {
    if (isMnemonicRevealed && aiInfo) return; // Already revealed and loaded
    playClick();

    if (!consumeMnemonicToken()) {
        openModal('SUBSCRIPTION');
        return;
    }

    setIsMnemonicRevealed(true);
    
    // If not cached, fetch it
    if (!aiInfo) {
        setIsMnemonicLoading(true);
        const info = await getAISmartHint(word.s, word.t);
        if (info) {
            useIslandStore.setState(state => {
                const updated = { ...state.aiCache, [word.id]: info };
                storageService.setItem(AI_CACHE_KEY, updated);
                return { aiCache: updated };
            });
            playSparkle();
        }
        setIsMnemonicLoading(false);
    } else {
        playSparkle();
    }
  };

  const handleAiChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isAiProcessing) return;

    // 1. Check Limits before API Call
    if (!consumeAIToken()) {
        openModal('SUBSCRIPTION'); // Trigger upgrade flow
        return;
    }

    setIsAiProcessing(true);
    setAiFeedback(null);
    playSwish();

    try {
      const text = await getAIChallengeFeedback(word.s, userInput);

      if (text) {
        setAiFeedback({ recast: text });
        playSparkle();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiProcessing(false);
    }
  };

  const toggleTool = (tool: ActiveTool) => {
    playClick();
    if (activeTool === tool) {
      setActiveTool('none');
    } else {
      setActiveTool(tool);
    }
  };

  const renderFormText = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\[.*?\])/g);
    return parts.map((part, i) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        return <span key={i} style={{ color: theme.main }} className="font-black">{part.slice(1, -1)}</span>;
      }
      return part;
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#fffdf5] rounded-[3rem] shadow-[0_30px_60px_-10px_rgba(0,0,0,0.3)] overflow-hidden animate-zoomIn flex flex-col max-h-[95vh]">
        <div className="overflow-y-auto no-scrollbar h-full relative">
            {/* Header */}
            <div style={{ backgroundColor: theme.main }} className="relative pt-10 pb-20 px-6 text-center shrink-0 transition-colors duration-300">
                <button onClick={onClose} className="absolute top-6 right-6 z-50 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all active:scale-90 backdrop-blur-sm"><X size={20} strokeWidth={3} /></button>
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '20px 20px' }} />
                <div className="relative z-10 cursor-pointer active:scale-95 transition-transform" onClick={(e) => handleSpeak(e, word.s)}>
                    <h2 className="text-6xl md:text-7xl font-black text-white tracking-tighter drop-shadow-sm mb-2 break-words">{word.s}</h2>
                    <p className="text-white/90 text-xl font-bold tracking-wide italic">{t(`vocab.${word.id}.t`, { defaultValue: word.t })}</p>
                </div>
                <div className="absolute bottom-[-1px] left-0 w-full leading-[0]"><svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-[80px] fill-[#fffdf5]"><path d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20">
                    <button onClick={(e) => handleSpeak(e, word.s)} className="bg-white p-5 rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.15)] hover:scale-110 active:scale-95 transition-all group">
                        {activeText === word.s ? <AudioLines size={32} style={{ color: theme.main }} className="animate-pulse" /> : <Volume2 size={32} style={{ color: theme.main }} className="fill-current opacity-80 group-hover:opacity-100" />}
                    </button>
                </div>
            </div>

            <div className="px-6 md:px-8 pt-16 pb-12 bg-[#fffdf5] relative z-10 space-y-8">
                {/* Meta Tags */}
                <div className="flex justify-center gap-2 opacity-60">
                    <span className="px-3 py-1 rounded-full border border-slate-300 text-[9px] font-black uppercase tracking-widest text-slate-500">{getPosLabel(word)}</span>
                    <span className="px-3 py-1 rounded-full border border-slate-300 text-[9px] font-black uppercase tracking-widest text-slate-500">Level {word.level}</span>
                </div>

                {/* Island Toolkit (Action Bar) */}
                <div className="flex items-center gap-3">
                   <button 
                     onClick={() => toggleTool('mnemonic')}
                     className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border-2 transition-all active:scale-95 ${activeTool === 'mnemonic' ? 'bg-[#f3e5f5] border-[#ab47bc] text-[#6a1b9a]' : 'bg-white border-slate-100 text-slate-400 hover:border-[#ab47bc]/30'}`}
                   >
                      <BrainCircuit size={18} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{t('ui.ai.tool_mnemonic')}</span>
                      {activeTool === 'mnemonic' && <ChevronDown size={14} />}
                   </button>
                   <button 
                     onClick={() => toggleTool('challenge')}
                     className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border-2 transition-all active:scale-95 ${activeTool === 'challenge' ? 'bg-[#e1f5fe] border-[#0288d1] text-[#0288d1]' : 'bg-white border-slate-100 text-slate-400 hover:border-[#0288d1]/30'}`}
                   >
                      <Sparkles size={18} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{t('ui.ai.tool_challenge')}</span>
                      {activeTool === 'challenge' && <ChevronDown size={14} />}
                   </button>
                </div>

                {/* Collapsible Content Area */}
                {activeTool !== 'none' && (
                  <div className="animate-slideDown">
                    {/* Challenge Tool */}
                    {activeTool === 'challenge' && (
                        <div className="bg-white p-6 rounded-[2.5rem] border-4 border-[#e1f5fe] shadow-sm relative overflow-hidden transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <MessageSquareText size={16} className="text-[#0288d1]" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4b7d78]">{t('ui.ai.challenge_title')}</span>
                                </div>
                                {!isPremium && (
                                    <div className="text-[9px] font-black text-[#8d99ae] bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
                                        {challengeUsesLeft}
                                    </div>
                                )}
                            </div>
                            
                            <p className="text-xs font-black text-[#0288d1] uppercase tracking-widest mb-3">{t('ui.ai.goal_prefix')} "{word.s}" {t('ui.ai.goal_suffix')}</p>
                            
                            {isChallengeLocked ? (
                                <div className="relative z-20 flex flex-col items-center justify-center py-6 space-y-4">
                                    <div className="bg-slate-100 p-4 rounded-full">
                                        <Lock size={32} className="text-slate-300" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[#4b7d78] font-black text-sm uppercase">{t('ui.ai.status_energy_low')}</p>
                                        <button 
                                            onClick={() => openModal('SUBSCRIPTION')}
                                            className="mt-3 text-[#ffa600] font-black text-[10px] uppercase tracking-widest border-b-2 border-[#ffa600] pb-0.5"
                                        >
                                            {t('ui.ai.status_unlimited')}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleAiChallenge} className="relative z-10 space-y-3">
                                    <div className="bg-slate-50 rounded-2xl p-4 border-2 border-dashed border-slate-200 focus-within:border-[#0288d1] transition-colors">
                                        <textarea 
                                            value={userInput}
                                            onChange={(e) => setUserInput(e.target.value)}
                                            placeholder="Yo..."
                                            className="w-full bg-transparent text-sm font-bold text-[#4b7d78] focus:outline-none placeholder:text-slate-300 min-h-[60px]"
                                        />
                                    </div>
                                    <button 
                                        type="submit"
                                        disabled={!userInput.trim() || isAiProcessing}
                                        className="w-full bg-[#0288d1] text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-[0_4px_0_#01579b] hover:bg-[#03a9f4] active:translate-y-1 disabled:opacity-30 transition-all flex items-center justify-center gap-2"
                                    >
                                        {isAiProcessing ? <Loader2 className="animate-spin" /> : <><Send size={14} /> {t('ui.ai.check')}</>}
                                    </button>
                                </form>
                            )}

                            {aiFeedback && (
                                <div className="mt-6 p-5 bg-[#e8f5e9] rounded-2xl border-2 border-[#8bc34a] animate-zoomIn">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Heart size={14} className="text-[#2e7d32] fill-current" />
                                        <span className="text-[10px] font-black text-[#2e7d32] uppercase tracking-widest">{t('ui.ai.feedback_label')}</span>
                                    </div>
                                    <p className="text-sm font-bold text-[#2e7d32] leading-relaxed italic">
                                        "{aiFeedback.recast}"
                                    </p>
                                    <button 
                                        onClick={(e) => handleSpeak(e, aiFeedback.recast!)}
                                        className="mt-3 flex items-center gap-2 text-[10px] font-black text-[#2e7d32]/60 uppercase hover:text-[#2e7d32]"
                                    >
                                        <Volume2 size={12} /> {t('ui.ai.listen')}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Mnemonic Tool */}
                    {activeTool === 'mnemonic' && (
                        <div className={`bg-gradient-to-br from-[#f3e5f5] to-[#e1f5fe] p-6 rounded-[2rem] border-4 border-white shadow-md relative overflow-hidden group transition-all`}>
                            <div className="absolute -right-6 -top-6 text-[#4b7d78]/5 rotate-12 group-hover:scale-110 transition-transform"><BrainCircuit size={120} /></div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Sparkles size={16} className="text-[#ab47bc] animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6a1b9a]">{t('ui.ai.tool_mnemonic')}</span>
                                    </div>
                                    {!isPremium && !isMnemonicRevealed && (
                                        <div className="text-[9px] font-black text-[#8d99ae] bg-white/50 px-2 py-0.5 rounded-full border border-white">
                                            {mnemonicUsesLeft}
                                        </div>
                                    )}
                                </div>

                                {!isMnemonicRevealed ? (
                                    <div className="flex flex-col items-center justify-center py-6 gap-3">
                                        <p className="text-center text-[#4b7d78]/60 text-xs font-bold px-4">
                                            {t('ui.ai.unlock_mnemonic_desc')}
                                        </p>
                                        <button 
                                            onClick={handleRevealMnemonic}
                                            className="bg-white text-[#6a1b9a] px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                                        >
                                            {isMnemonicLoading ? <Loader2 className="animate-spin" size={16} /> : <Eye size={16} />}
                                            {t('ui.ai.reveal')}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4 animate-fadeIn">
                                        {isMnemonicLoading ? (
                                            <div className="flex items-center justify-center py-8 text-[#ab47bc]">
                                                <Loader2 className="animate-spin" size={32} />
                                            </div>
                                        ) : (
                                            <>
                                                <div>
                                                    <p className="text-[8px] font-black text-[#ab47bc] uppercase tracking-widest mb-1">{t('ui.ai.mnemonic_label')}</p>
                                                    <p className="text-[#2d4a47] font-bold text-sm leading-tight">
                                                        "{aiInfo?.mnemonics || t('ui.ai.processing')}"
                                                    </p>
                                                </div>
                                                <div className="pt-3 border-t border-white/40">
                                                    <p className="text-[8px] font-black text-[#0288d1] uppercase tracking-widest mb-1">{t('ui.ai.hint_label')}</p>
                                                    <p className="text-[#2d4a47] text-xs font-medium leading-relaxed">
                                                        {aiInfo?.hint || t('ui.ai.processing')}
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                  </div>
                )}

                {/* Standard Grammar Note */}
                <div className="relative group">
                    <div className="bg-white/50 p-6 rounded-[2rem] border-2 border-dashed relative transform hover:rotate-0 transition-transform duration-300" style={{ borderColor: theme.main }}>   
                         <div className="absolute -top-3 left-6 bg-[#fffdf5] px-2 flex items-center gap-1">
                            <PenTool size={14} style={{ color: theme.main }} />
                            <span style={{ color: theme.main }} className="text-[10px] font-black uppercase tracking-widest">{t('ui.study.grammar_pocket')}</span>
                         </div>
                         {conjugationList.length > 0 ? (
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                {pronouns.map((p, i) => (
                                <div key={p} className="flex items-baseline justify-between border-b border-slate-100 pb-1 last:border-0">
                                    <span className="text-[9px] text-slate-400 font-bold uppercase">{p}</span>
                                    <span className="text-sm font-black text-[#2d4a47]">{renderFormText(conjugationList[i])}</span>
                                </div>
                                ))}
                            </div>
                         ) : (
                             <p className="text-[#2d4a47] font-bold text-sm italic leading-relaxed text-center">"{t(`vocab.${word.id}.tip`, { defaultValue: word.grammarTip })}"</p>
                         )}
                    </div>
                </div>

                {/* Examples */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-2 opacity-40 px-2"><BookOpen size={14} /><span className="text-[9px] font-black uppercase tracking-widest">{t('ui.study.usage_examples')}</span></div>
                    {word.examples.map((ex, i) => (
                        <button key={i} onClick={(e) => handleSpeak(e, ex.txt)} className="w-full text-left bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all active:scale-[0.98] group">
                             <p className="text-lg font-black text-[#2d4a47] italic leading-tight mb-2 flex items-start gap-1 tracking-tight">
                                <span className="text-slate-300 -ml-2">“</span>{ex.txt}
                             </p>
                             <p className="text-xs font-bold text-slate-400 pl-3 border-l-2 border-slate-200 leading-tight">{ex.eng}</p>
                        </button>
                    ))}
                </div>

                <div className="pt-8 pb-2 flex justify-center opacity-10"><BookOpen size={16} fill="black" /></div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default WordDetailModal;
