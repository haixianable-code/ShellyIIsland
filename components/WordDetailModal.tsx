
import React, { useState, useEffect } from 'react';
import { Word } from '../types';
import { playAudio } from '../utils/audio';
import { getTypeTheme, getPosLabel } from '../utils/theme';
import { X, Volume2, Sparkles, AudioLines, BookOpen, PenTool, ArrowLeftRight, Map, Star, BrainCircuit } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { playClick } from '../utils/sfx';
import { useIslandStore } from '../store/useIslandStore';

interface WordDetailModalProps {
  word: Word;
  onClose: () => void;
}

const WordDetailModal: React.FC<WordDetailModalProps> = ({ word, onClose }) => {
  const { t } = useTranslation();
  const { aiCache } = useIslandStore();
  const [activeText, setActiveText] = useState<string | null>(null);
  const theme = getTypeTheme(word);
  const conjugationList = word.forms ? word.forms.split(', ') : [];
  
  const aiInfo = aiCache[word.id];

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

  const handleSpeak = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    setActiveText(text);
    playAudio(
      text, 
      () => setActiveText(text), 
      () => setActiveText(null)
    );
    try { playClick(); } catch (err) {}
  };

  const renderFormText = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\[.*?\])/g);
    return parts.map((part, i) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        return (
          <span key={i} style={{ color: theme.main }} className="font-black">
            {part.slice(1, -1)}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      
      <div className="relative w-full max-w-md bg-[#fffdf5] rounded-[3rem] shadow-[0_30px_60px_-10px_rgba(0,0,0,0.3)] overflow-hidden animate-zoomIn flex flex-col max-h-[90vh]">
        
        <div className="overflow-y-auto no-scrollbar h-full relative">
            
            <div 
                style={{ backgroundColor: theme.main }} 
                className="relative pt-10 pb-20 px-6 text-center shrink-0 transition-colors duration-300"
            >
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 z-50 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all active:scale-90 backdrop-blur-sm"
                >
                    <X size={20} strokeWidth={3} />
                </button>

                <div className="absolute inset-0 opacity-10 pointer-events-none" 
                     style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '20px 20px' }} 
                />

                <div 
                    className="relative z-10 cursor-pointer active:scale-95 transition-transform"
                    onClick={(e) => handleSpeak(e, word.s)}
                >
                    <h2 className="text-6xl md:text-7xl font-black text-white tracking-tighter drop-shadow-sm mb-2 break-words">
                        {word.s}
                    </h2>
                    <p className="text-white/90 text-xl font-bold tracking-wide italic">
                        {t(`vocab.${word.id}.t`, { defaultValue: word.t })}
                    </p>
                </div>

                <div className="absolute bottom-[-1px] left-0 w-full leading-[0]">
                    <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-[80px] fill-[#fffdf5]">
                        <path d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                </div>

                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20">
                    <button 
                        onClick={(e) => handleSpeak(e, word.s)}
                        className="bg-white p-5 rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.15)] hover:scale-110 active:scale-95 transition-all group"
                    >
                        {activeText === word.s 
                            ? <AudioLines size={32} style={{ color: theme.main }} className="animate-pulse" /> 
                            : <Volume2 size={32} style={{ color: theme.main }} className="fill-current opacity-80 group-hover:opacity-100" />
                        }
                    </button>
                </div>
            </div>

            <div className="px-6 md:px-8 pt-16 pb-12 bg-[#fffdf5] relative z-10">
                
                <div className="flex justify-center gap-2 mb-8 opacity-60">
                    <span className="px-3 py-1 rounded-full border border-slate-300 text-[9px] font-black uppercase tracking-widest text-slate-500">
                        {getPosLabel(word)}
                    </span>
                    <span className="px-3 py-1 rounded-full border border-slate-300 text-[9px] font-black uppercase tracking-widest text-slate-500">
                        Level {word.level}
                    </span>
                </div>

                {/* AI Island Wisdom (Conditional UI) */}
                {aiInfo && (
                  <div className="mb-10 animate-fadeIn">
                     <div className="bg-gradient-to-br from-[#f3e5f5] to-[#e1f5fe] p-6 rounded-[2rem] border-4 border-white shadow-md relative overflow-hidden group">
                        <div className="absolute -right-6 -top-6 text-[#4b7d78]/5 rotate-12 group-hover:scale-110 transition-transform">
                           <BrainCircuit size={120} />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles size={16} className="text-[#ab47bc] animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6a1b9a]">Island Wisdom</span>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[8px] font-black text-[#ab47bc] uppercase tracking-widest mb-1">Memory Trick</p>
                                    <p className="text-[#2d4a47] font-bold text-sm leading-tight">
                                        "{aiInfo.mnemonics}"
                                    </p>
                                </div>
                                <div className="pt-3 border-t border-white/40">
                                    <p className="text-[8px] font-black text-[#0288d1] uppercase tracking-widest mb-1">AI Smart Hint</p>
                                    <p className="text-[#2d4a47] text-xs font-medium leading-relaxed">
                                        {aiInfo.hint}
                                    </p>
                                </div>
                            </div>
                        </div>
                     </div>
                  </div>
                )}

                <div className="mb-10 relative group">
                    <div 
                        className="bg-white/50 p-6 rounded-[2rem] border-2 border-dashed relative transform -rotate-1 hover:rotate-0 transition-transform duration-300"
                        style={{ borderColor: theme.main }}
                    >   
                         <div className="absolute -top-3 left-6 bg-[#fffdf5] px-2 flex items-center gap-1">
                            <PenTool size={14} style={{ color: theme.main }} />
                            <span style={{ color: theme.main }} className="text-[10px] font-black uppercase tracking-widest">Grammar Note</span>
                         </div>

                         {conjugationList.length > 0 ? (
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                {pronouns.map((p, i) => (
                                <div key={p} className="flex items-baseline justify-between border-b border-slate-100 pb-1 last:border-0">
                                    <span className="text-[9px] text-slate-400 font-bold uppercase">{p}</span>
                                    <span className="text-sm font-black text-[#2d4a47]">
                                    {renderFormText(conjugationList[i])}
                                    </span>
                                </div>
                                ))}
                            </div>
                         ) : (
                             <p className="text-[#2d4a47] font-bold text-sm italic leading-relaxed text-center">
                                 "{t(`vocab.${word.id}.tip`, { defaultValue: word.grammarTip })}"
                             </p>
                         )}
                    </div>
                </div>

                {word.type === 'adj' && word.ant && (
                    <div className="mb-8">
                         <div 
                            onClick={(e) => handleSpeak(e, word.ant!)}
                            className="bg-slate-50 p-4 rounded-[2rem] flex items-center justify-between border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors group"
                         >
                            <div className="flex items-center gap-3">
                                <div className="bg-white p-2 rounded-full shadow-sm text-slate-400">
                                    <ArrowLeftRight size={16} />
                                </div>
                                <div>
                                    <div className="text-[8px] font-black uppercase tracking-widest text-slate-400">Opposite</div>
                                    <div className="text-lg font-black text-slate-600 group-hover:text-slate-800 transition-colors flex items-center gap-2">
                                        {word.ant}
                                        {activeText === word.ant && <AudioLines size={14} className="animate-pulse" />}
                                    </div>
                                </div>
                            </div>
                            <div className="text-xs font-bold text-slate-400 px-3">{word.antT}</div>
                         </div>
                    </div>
                )}

                <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-2 opacity-40 px-2">
                        <BookOpen size={14} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Context</span>
                    </div>
                    
                    {word.examples.map((ex, i) => (
                        <button 
                            key={i}
                            onClick={(e) => handleSpeak(e, ex.txt)}
                            className="w-full text-left bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all active:scale-[0.98] group"
                        >
                             <p className="text-lg font-black text-[#2d4a47] italic leading-tight mb-2 flex items-start gap-1">
                                <span className="text-slate-300 -ml-2">“</span>
                                {ex.txt}
                             </p>
                             <p className="text-xs font-bold text-slate-400 pl-3 border-l-2 border-slate-200">
                                {ex.eng}
                             </p>
                        </button>
                    ))}
                </div>

                {(word.nounNotes && word.nounNotes !== 'Function Word') && (
                  <div className="mt-8 pt-6 border-t-2 border-dashed border-slate-100 text-center">
                       <div className="inline-flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full mb-3">
                         <Map size={10} className="text-slate-400" />
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Note</span>
                       </div>
                       <p className="text-slate-500 text-xs font-bold leading-relaxed">
                         {t(`vocab.${word.id}.notes`, { defaultValue: word.nounNotes })}
                       </p>
                  </div>
                )}

                <div className="pt-8 pb-2 flex justify-center opacity-10">
                   <Star size={16} fill="black" />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default WordDetailModal;
