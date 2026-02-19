
import React, { useState, useEffect, useMemo } from 'react';
import { Word } from '../types';
import { playAudio } from '../utils/audio';
import { getTypeTheme, getPosLabel } from '../utils/theme';
import { X, Volume2, Sparkles, AudioLines, BookOpen, PenTool, BrainCircuit, Loader2, Send, MessageSquareText, Heart, Lock, Crown, Eye, ChevronDown, History, Sun, Rocket, Target, CheckCircle2, AlertTriangle, RefreshCcw, Shuffle, Feather, Lightbulb } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { playClick, playSparkle, playSwish, playShaker, playHighChime, playThud } from '../utils/sfx';
import { useIslandStore } from '../store/useIslandStore';
import { getAIChallengeFeedback, getAISmartHint, getAIMission, AIChallengeResult } from '../services/geminiService';
import { storageService } from '../services/storageService';

const AI_CACHE_KEY = 'ssi_ai_content_v2';

interface WordDetailModalProps {
  word: Word;
  onClose: () => void;
}

type ActiveTool = 'none' | 'challenge' | 'mnemonic';
type TimeState = 'past' | 'present' | 'future';

interface ContextSuggestion {
    type: 'word' | 'question' | 'free' | 'ai_mission';
    text: string;
    subtext?: string;
    level?: number;
}

const WordDetailModal: React.FC<WordDetailModalProps> = ({ word, onClose }) => {
  const { t } = useTranslation();
  const { aiCache, consumeAIToken, consumeMnemonicToken, aiUsage, mnemonicUsage, profile, openModal, allWords, progress } = useIslandStore();
  
  const [activeText, setActiveText] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<ActiveTool>('none');
  const [timeState, setTimeState] = useState<TimeState>('present');
  const [userInput, setUserInput] = useState('');
  const [aiFeedback, setAiFeedback] = useState<AIChallengeResult | null>(null);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);
  const [isMissionLoading, setIsMissionLoading] = useState(false);
  const [context, setContext] = useState<ContextSuggestion | null>(null);

  const theme = getTypeTheme(word);
  const isPremium = profile?.is_premium;
  const hasTimeMachine = !!word.tense_forms;

  // --- 0 TOKEN UI 优化：视觉词根映射 (Visual Stem Mapping) ---
  const renderStemMappedText = (conjugated: string) => {
    if (!conjugated) return null;
    const base = word.s.toLowerCase().replace(/se$/, ''); // 处理自复词根
    const target = conjugated.toLowerCase();
    
    // 寻找最大公共前缀作为词根
    let prefixLength = 0;
    const minLen = Math.min(base.length, target.length);
    for (let i = 0; i < minLen; i++) {
        if (base[i] === target[i]) prefixLength++;
        else break;
    }

    // 规则判断：如果词根过短（完全不规则动词），整体高亮
    if (prefixLength < 2) {
        return <span style={{ color: theme.main }} className="font-black underline decoration-2 underline-offset-2">{conjugated}</span>;
    }

    const stem = conjugated.slice(0, prefixLength);
    const suffix = conjugated.slice(prefixLength);

    return (
        <>
            <span className="opacity-40">{stem}</span>
            <span style={{ color: theme.main }} className="font-black underline decoration-2 underline-offset-2">{suffix}</span>
        </>
    );
  };

  // --- 时态过滤逻辑 (Fix: 例句随时光机联动) ---
  const finalExamples = useMemo(() => {
    const filtered = word.examples.filter(ex => {
      if (timeState === 'present') return !ex.tense || ex.tense === 'present';
      if (timeState === 'past') return ex.tense === 'past' || ex.tense === 'imperfect';
      if (timeState === 'future') return ex.tense === 'future';
      return false;
    });
    // 如果该时态没有特定例句，回退到普通例句
    return filtered.length > 0 ? filtered : word.examples.filter(ex => !ex.tense || ex.tense === 'present');
  }, [word.examples, timeState]);

  // --- 三阶任务逻辑注入 ---
  const fetchMission = async (count: number) => {
    setIsMissionLoading(true);
    const level = count <= 1 ? 1 : count === 2 ? 2 : 3;
    const mission = await getAIMission(word.s, level, timeState);
    if (mission) {
        setContext({
            type: 'ai_mission',
            text: mission.task_text,
            subtext: mission.subtext,
            level: level
        });
    }
    setIsMissionLoading(false);
  };

  useEffect(() => {
    if (activeTool === 'challenge' && !context) fetchMission(0);
  }, [activeTool]);

  const refreshContext = (e: React.MouseEvent) => {
      e.stopPropagation();
      playSwish();
      const newCount = refreshCount + 1;
      setRefreshCount(newCount);
      fetchMission(newCount);
  };

  const handleAiChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isAiProcessing) return;
    if (!consumeAIToken()) { openModal('SUBSCRIPTION'); return; }

    setIsAiProcessing(true);
    setAiFeedback(null);
    playSwish();

    try {
      const result = await getAIChallengeFeedback(word.s, userInput, context?.text, context?.level);
      if (result) {
        setAiFeedback(result);
        if (result.score >= 80) playHighChime(); else playThud();
      }
    } catch (err) { console.error(err); } finally { setIsAiProcessing(false); }
  };

  const aiInfo = aiCache[word.id];
  const [isMnemonicRevealed, setIsMnemonicRevealed] = useState(!!isPremium);
  const [isMnemonicLoading, setIsMnemonicLoading] = useState(false);
  const challengeUsesLeft = isPremium ? 999 : Math.max(0, 3 - aiUsage.count);
  const isChallengeLocked = !isPremium && challengeUsesLeft === 0;
  const mnemonicUsesLeft = isPremium ? 999 : Math.max(0, 5 - mnemonicUsage.count);

  const getActiveForms = () => {
    if (timeState === 'future') return word.tense_forms?.future;
    if (timeState === 'past') return word.tense_forms?.past || word.tense_forms?.imperfect;
    return word.forms;
  };
  const conjugationList = getActiveForms() ? getActiveForms()!.split(/,\s*/) : [];
  const currentWordDisplay = timeState === 'present' ? word.s : (conjugationList[0] || word.s);
  const headerBgColor = timeState === 'past' ? '#795548' : timeState === 'future' ? '#2196f3' : theme.main;
  const pronouns = word.type === 'verb' ? [t('ui.grammar.yo'), t('ui.grammar.tu'), t('ui.grammar.el'), t('ui.grammar.nos'), t('ui.grammar.vos'), t('ui.grammar.ellos')] : [t('ui.grammar.sing'), t('ui.grammar.plur')];

  useEffect(() => {
    document.body.classList.add('modal-open');
    return () => document.body.classList.remove('modal-open');
  }, []);

  const handleSpeak = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    setActiveText(text);
    playAudio(text, () => setActiveText(text), () => setActiveText(null));
    try { playClick(); } catch (err) {}
  };

  const handleTimeChange = (newState: TimeState) => {
      if (newState === 'past') playShaker();
      if (newState === 'present') playClick();
      if (newState === 'future') playSwish();
      setTimeState(newState);
      if (activeTool === 'challenge') fetchMission(refreshCount);
  };

  const toggleTool = (tool: ActiveTool) => {
    playClick();
    setActiveTool(activeTool === tool ? 'none' : tool);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#fffdf5] rounded-[3rem] shadow-[0_30px_60px_-10px_rgba(0,0,0,0.3)] overflow-hidden animate-zoomIn flex flex-col max-h-[95vh]">
        <div className="overflow-y-auto no-scrollbar h-full relative">
            <div style={{ backgroundColor: headerBgColor }} className="relative pt-10 pb-20 px-6 text-center shrink-0 transition-colors duration-500">
                <button onClick={onClose} className="absolute top-6 right-6 z-50 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all active:scale-90 backdrop-blur-sm"><X size={20} strokeWidth={3} /></button>
                <div className="relative z-10 cursor-pointer active:scale-95 transition-transform" onClick={(e) => handleSpeak(e, currentWordDisplay)}>
                    <h2 className="text-6xl md:text-7xl font-black text-white tracking-tighter drop-shadow-sm mb-2 break-words">{currentWordDisplay}</h2>
                    <p className="text-white/90 text-xl font-bold tracking-wide italic">{t(`vocab.${word.id}.t`, { defaultValue: word.t })}</p>
                </div>
                <div className="absolute bottom-[-1px] left-0 w-full leading-[0]"><svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-[80px] fill-[#fffdf5]"><path d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20">
                    <button onClick={(e) => handleSpeak(e, currentWordDisplay)} className="bg-white p-5 rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.15)] hover:scale-110 active:scale-95 transition-all group">
                        {activeText === currentWordDisplay ? <AudioLines size={32} style={{ color: headerBgColor }} className="animate-pulse" /> : <Volume2 size={32} style={{ color: headerBgColor }} className="fill-current opacity-80 group-hover:opacity-100" />}
                    </button>
                </div>
            </div>

            <div className="px-6 md:px-8 pt-16 pb-12 bg-[#fffdf5] relative z-10 space-y-8">
                {hasTimeMachine && (
                    <div className="flex items-center justify-center gap-2 mb-2 animate-slideUp">
                        <button onClick={() => handleTimeChange('past')} className={`p-3 rounded-2xl border-2 transition-all ${timeState === 'past' ? 'bg-[#795548] text-white border-[#795548] shadow-md scale-110' : 'bg-white border-[#d7ccc8] text-[#a1887f] hover:bg-[#efebe9]'}`}><History size={20} /></button>
                        <div className="h-1.5 w-16 bg-slate-200 rounded-full relative overflow-hidden"><div className={`absolute top-0 bottom-0 w-1/3 rounded-full transition-all duration-300 ${timeState === 'past' ? 'left-0 bg-[#795548]' : timeState === 'future' ? 'left-2/3 bg-[#2196f3]' : 'left-1/3 bg-[#ffa600]'}`} /></div>
                        <button onClick={() => handleTimeChange('present')} className={`p-3 rounded-2xl border-2 transition-all ${timeState === 'present' ? 'bg-[#ffa600] text-white border-[#ffa600] shadow-md scale-110' : 'bg-white border-[#ffe0b2] text-[#ffcc80] hover:bg-[#fff3e0]'}`}><Sun size={20} /></button>
                        <div className="h-1.5 w-16 bg-slate-200 rounded-full relative overflow-hidden"><div className={`absolute top-0 bottom-0 w-1/3 rounded-full transition-all duration-300 ${timeState === 'past' ? 'left-0 bg-[#795548]' : timeState === 'future' ? 'left-2/3 bg-[#2196f3]' : 'left-1/3 bg-[#ffa600]'}`} /></div>
                        <button onClick={() => handleTimeChange('future')} className={`p-3 rounded-2xl border-2 transition-all ${timeState === 'future' ? 'bg-[#2196f3] text-white border-[#2196f3] shadow-md scale-110' : 'bg-white border-[#bbdefb] text-[#90caf9] hover:bg-[#e3f2fd]'}`}><Rocket size={20} /></button>
                    </div>
                )}

                <div className="flex items-center gap-3">
                   <button onClick={() => toggleTool('mnemonic')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border-2 transition-all active:scale-95 ${activeTool === 'mnemonic' ? 'bg-[#f3e5f5] border-[#ab47bc] text-[#6a1b9a]' : 'bg-white border-slate-100 text-slate-400 hover:border-[#ab47bc]/30'}`}><BrainCircuit size={18} /><span className="text-[10px] font-black uppercase tracking-widest">{t('ui.ai.tool_mnemonic')}</span>{activeTool === 'mnemonic' && <ChevronDown size={14} />}</button>
                   <button onClick={() => toggleTool('challenge')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border-2 transition-all active:scale-95 ${activeTool === 'challenge' ? 'bg-[#e1f5fe] border-[#0288d1] text-[#0288d1]' : 'bg-white border-slate-100 text-slate-400 hover:border-[#0288d1]/30'}`}><Sparkles size={18} /><span className="text-[10px] font-black uppercase tracking-widest">{t('ui.ai.tool_challenge')}</span>{activeTool === 'challenge' && <ChevronDown size={14} />}</button>
                </div>

                {activeTool !== 'none' && (
                  <div className="animate-slideDown">
                    {activeTool === 'challenge' && (
                        <div className="bg-white p-6 rounded-[2.5rem] border-4 border-[#e1f5fe] shadow-sm relative overflow-hidden transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <MessageSquareText size={16} className="text-[#0288d1]" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4b7d78]">
                                        {context?.level ? `Stage ${context.level} Lab` : t('ui.ai.challenge_title')}
                                    </span>
                                </div>
                            </div>
                            
                            <div className={`p-3 rounded-2xl border mb-3 flex items-center justify-between group transition-colors ${context?.level === 2 ? 'bg-[#fff8e1] border-[#ffecb3]' : 'bg-[#f0f9ff] border-[#b3e5fc]'}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`p-1.5 rounded-lg text-white ${context?.level === 2 ? 'bg-[#f57c00]' : 'bg-[#0288d1]'}`}>
                                        {isMissionLoading ? <Loader2 size={14} className="animate-spin" /> : <Target size={14} />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[9px] font-black uppercase tracking-widest opacity-70">Mission Protocol</p>
                                        <p className="text-xs font-bold text-[#4b7d78] leading-tight">
                                            {isMissionLoading ? "Synthesizing goal..." : context?.text}
                                        </p>
                                        {context?.subtext && !isMissionLoading && <p className="text-[10px] text-slate-400 mt-1 italic leading-tight">{context.subtext}</p>}
                                    </div>
                                </div>
                                <button onClick={refreshContext} className="p-2 rounded-xl text-[#0288d1] hover:bg-white transition-all active:scale-90 active:rotate-180 duration-300"><Shuffle size={16} /></button>
                            </div>
                            
                            {isChallengeLocked ? (
                                <div className="relative z-20 flex flex-col items-center justify-center py-6 space-y-4">
                                    <div className="bg-slate-100 p-4 rounded-full"><Lock size={32} className="text-slate-300" /></div>
                                    <div className="text-center"><p className="text-[#4b7d78] font-black text-sm uppercase">{t('ui.ai.status_energy_low')}</p><button onClick={() => openModal('SUBSCRIPTION')} className="mt-3 text-[#ffa600] font-black text-[10px] uppercase tracking-widest border-b-2 border-[#ffa600] pb-0.5">{t('ui.ai.status_unlimited')}</button></div>
                                </div>
                            ) : (
                                <form onSubmit={handleAiChallenge} className="relative z-10 space-y-3">
                                    <div className="bg-slate-50 rounded-2xl p-4 border-2 border-dashed border-slate-200 focus-within:border-[#0288d1] transition-colors">
                                        <textarea value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="Fix the sentence or construct yours..." className="w-full bg-transparent text-sm font-bold text-[#4b7d78] focus:outline-none placeholder:text-slate-300 min-h-[60px]" />
                                    </div>
                                    <button type="submit" disabled={!userInput.trim() || isAiProcessing || isMissionLoading} className="w-full bg-[#0288d1] text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-[0_4px_0_#01579b] hover:bg-[#03a9f4] active:translate-y-1 disabled:opacity-30 transition-all flex items-center justify-center gap-2">
                                        {isAiProcessing ? <Loader2 className="animate-spin" /> : <><Send size={14} /> {t('ui.ai.check')}</>}
                                    </button>
                                </form>
                            )}

                            {aiFeedback && (
                                <div className={`mt-6 p-5 rounded-2xl border-2 animate-zoomIn ${aiFeedback.score >= 80 ? 'bg-[#e8f5e9] border-[#8bc34a]' : 'bg-[#fff3e0] border-[#ffa600]'}`}>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            {aiFeedback.score >= 80 ? <CheckCircle2 size={16} className="text-[#2e7d32]" /> : <AlertTriangle size={16} className="text-[#e65100]" />}
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${aiFeedback.score >= 80 ? 'text-[#2e7d32]' : 'text-[#e65100]'}`}>{aiFeedback.compliment}</span>
                                        </div>
                                        <span className="text-xs font-black bg-white px-2 py-0.5 rounded-md border border-slate-100 shadow-sm">{aiFeedback.score}/100</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div><p className="text-[9px] font-black uppercase text-slate-400 mb-0.5">{context?.level === 3 ? 'Expert Recast' : 'Correction'}</p><p className="text-sm font-bold text-[#2d4a47] italic">"{aiFeedback.correction}"</p></div>
                                        <div className="pt-2 border-t border-black/5"><p className="text-[9px] font-black uppercase text-slate-400 mb-0.5">Tutor Analysis</p><p className="text-xs font-bold text-[#4b7d78] leading-snug">{aiFeedback.explanation}</p></div>
                                    </div>
                                    <button onClick={(e) => handleSpeak(e, aiFeedback.correction)} className="mt-3 w-full flex items-center justify-center gap-2 text-[10px] font-black text-[#2e7d32]/60 uppercase hover:text-[#2e7d32] bg-white/50 py-2 rounded-lg"><Volume2 size={12} /> {t('ui.ai.listen')}</button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTool === 'mnemonic' && (
                        <div className={`bg-gradient-to-br from-[#f3e5f5] to-[#e1f5fe] p-6 rounded-[2rem] border-4 border-white shadow-md relative overflow-hidden group transition-all`}>
                            <div className="absolute -right-6 -top-6 text-[#4b7d78]/5 rotate-12 group-hover:scale-110 transition-transform"><BrainCircuit size={120} /></div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2"><Sparkles size={16} className="text-[#ab47bc] animate-pulse" /><span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6a1b9a]">{t('ui.ai.tool_mnemonic')}</span></div>
                                    {!isPremium && !isMnemonicRevealed && <div className="text-[9px] font-black text-[#8d99ae] bg-white/50 px-2 py-0.5 rounded-full border border-white">{mnemonicUsage.count}/5</div>}
                                </div>
                                {!isMnemonicRevealed ? (
                                    <div className="flex flex-col items-center justify-center py-6 gap-3">
                                        <p className="text-center text-[#4b7d78]/60 text-xs font-bold px-4">{t('ui.ai.unlock_mnemonic_desc')}</p>
                                        <button onClick={() => setIsMnemonicRevealed(true)} className="bg-white text-[#6a1b9a] px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2">{isMnemonicLoading ? <Loader2 className="animate-spin" size={16} /> : <Eye size={16} />}{t('ui.ai.reveal')}</button>
                                    </div>
                                ) : (
                                    <div className="space-y-4 animate-fadeIn">
                                        {isMnemonicLoading ? <div className="flex items-center justify-center py-8 text-[#ab47bc]"><Loader2 className="animate-spin" size={32} /></div> : (
                                            <>
                                                <div><p className="text-[8px] font-black text-[#ab47bc] uppercase tracking-widest mb-1">{t('ui.ai.mnemonic_label')}</p><p className="text-[#2d4a47] font-bold text-sm leading-tight">"{aiInfo?.mnemonics || 'Thinking...'}"</p></div>
                                                <div className="pt-3 border-t border-white/40"><p className="text-[8px] font-black text-[#0288d1] uppercase tracking-widest mb-1">{t('ui.ai.hint_label')}</p><p className="text-[#2d4a47] text-xs font-medium leading-relaxed">{aiInfo?.hint || 'Analyzing...'}</p></div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                  </div>
                )}

                <div className="relative group">
                    <div className="bg-white/50 p-6 rounded-[2rem] border-2 border-dashed relative transform hover:rotate-0 transition-transform duration-300" style={{ borderColor: theme.main }}>   
                         <div className="absolute -top-3 left-6 bg-[#fffdf5] px-2 flex items-center gap-1"><PenTool size={14} style={{ color: theme.main }} /><span style={{ color: theme.main }} className="text-[10px] font-black uppercase tracking-widest">{t('ui.study.grammar_pocket')}</span></div>
                         {conjugationList.length > 0 ? (
                            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                {pronouns.map((p, i) => {
                                    const formText = conjugationList[i] || '';
                                    return (
                                        <button key={p} onClick={(e) => { e.stopPropagation(); playAudio(formText); try { playClick(); } catch(err) {} }} className="flex items-center justify-between border-b border-slate-200/60 pb-1 last:border-0 hover:bg-white hover:shadow-sm hover:px-2 hover:-mx-2 hover:rounded-lg transition-all active:scale-95 cursor-pointer group w-full">
                                            <span className="text-[9px] text-slate-400 font-bold uppercase group-hover:text-slate-500 transition-colors">{p}</span>
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-sm font-black text-[#2d4a47]">{renderStemMappedText(formText)}</span>
                                                <Volume2 size={10} className="text-[#2d4a47] opacity-0 group-hover:opacity-30 transition-opacity" />
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                         ) : <p className="text-[#2d4a47] font-bold text-sm italic leading-relaxed text-center">"{t(`vocab.${word.id}.tip`, { defaultValue: word.grammarTip })}"</p>}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-2 opacity-40 px-2">
                        <BookOpen size={14} />
                        <span className="text-[9px] font-black uppercase tracking-widest">{t('ui.study.usage_examples')}</span>
                        {timeState !== 'present' && <span className="ml-auto text-[8px] font-black bg-slate-100 px-2 py-0.5 rounded-full uppercase">{timeState}</span>}
                    </div>
                    {finalExamples.map((ex, i) => (
                        <button key={i} onClick={(e) => handleSpeak(e, ex.txt)} className="w-full text-left bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all active:scale-[0.98] group animate-fadeIn">
                             <p className="text-lg font-black text-[#2d4a47] italic leading-tight mb-2 flex items-start gap-1 tracking-tight">
                                <span className="text-slate-300 -ml-2">“</span>
                                {ex.txt}
                             </p>
                             <p className="text-xs font-bold text-slate-400 pl-3 border-l-2 border-slate-200 leading-tight">{ex.eng}</p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default WordDetailModal;
