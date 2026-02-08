
import React, { useState } from 'react';
import { Word } from '../types';
import { playAudio } from '../utils/audio';
import { getTypeTheme, getPosLabel } from '../utils/theme';
import { X, Sparkles, BookOpen, Map, Star, PenTool, AudioLines, ChevronLeft, ArrowLeftRight, Volume2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { playClick } from '../utils/sfx';

interface WordDetailModalProps {
  word: Word;
  onClose: () => void;
}

const WordDetailModal: React.FC<WordDetailModalProps> = ({ word, onClose }) => {
  const { t } = useTranslation();
  const [activeText, setActiveText] = useState<string | null>(null);
  const theme = getTypeTheme(word);
  const conjugationList = word.forms ? word.forms.split(', ') : [];
  
  const pronouns = word.type === 'verb' 
    ? [t('ui.grammar.yo'), t('ui.grammar.tu'), t('ui.grammar.el'), t('ui.grammar.nos'), t('ui.grammar.vos'), t('ui.grammar.ellos')] 
    : word.type === 'noun' 
      ? [t('ui.grammar.sing'), t('ui.grammar.plur')] 
      : [t('ui.grammar.masc'), t('ui.grammar.fem'), t('ui.grammar.masc_pl'), t('ui.grammar.fem_pl')];

  // 核心修复：优先播放语音，后播放音效，并捕获音效错误
  const handleSpeak = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    setActiveText(text);
    
    // 1. Play TTS first (Highest Priority)
    playAudio(
      text, 
      () => setActiveText(text), 
      () => setActiveText(null)
    );

    // 2. Play Click SFX (Low Priority, fail-safe)
    try { 
      playClick(); 
    } catch (err) {
      // Ignore audio context errors
    }
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-10 bg-[#fdfdf3]/90 backdrop-blur-sm animate-fadeIn">
      {/* 桌面端返回按钮 */}
      <button 
        onClick={onClose}
        className="absolute top-6 left-6 z-50 bg-white p-4 rounded-3xl text-slate-400 shadow-xl border-2 border-slate-50 hover:text-slate-600 active:scale-90 transition-all hidden md:block"
      >
        <ChevronLeft size={24} strokeWidth={4} />
      </button>

      {/* 主卡片 */}
      <div className="relative w-full max-w-3xl bg-white rounded-none md:rounded-[4rem] border-0 md:border-[12px] border-[#fde68a] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden animate-zoomIn flex flex-col h-full md:h-auto md:max-h-[90vh]">
        
        {/* 关闭按钮 */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-50 bg-slate-50 p-3 rounded-2xl text-slate-400 hover:bg-slate-100 hover:text-rose-500 transition-all active:scale-90"
        >
          <X size={20} strokeWidth={4} />
        </button>

        <div className="flex-1 overflow-y-auto no-scrollbar pt-12 pb-12 px-6 md:px-12">
          <div className="flex flex-col items-center">
            
            <div className="flex gap-2 mb-6">
              <span className="bg-[#ff7043] px-5 py-1.5 rounded-full text-white font-black text-[10px] uppercase tracking-widest shadow-sm">
                {getPosLabel(word)}
              </span>
              <span className="bg-[#e2e8f0] px-5 py-1.5 rounded-full text-[#64748b] font-black text-[10px] uppercase tracking-widest shadow-sm">
                SPANISH
              </span>
            </div>

            {/* 标题区域：点击整个区域发音 */}
            <div 
              className="text-center mb-10 w-full group cursor-pointer select-none active:scale-95 transition-transform duration-200" 
              onClick={(e) => handleSpeak(e, word.s)}
            >
              <div className="relative inline-flex items-center justify-center gap-4">
                <h2 className="text-7xl md:text-8xl font-black text-[#2d4a47] tracking-tight relative inline-block">
                  {word.s}
                </h2>
                {/* 独立发音按钮 */}
                <button 
                  onClick={(e) => handleSpeak(e, word.s)}
                  className="bg-[#f0f0f0] hover:bg-[#e0e0e0] text-[#4b7d78] p-3 rounded-full transition-colors shadow-sm active:bg-[#8bc34a] active:text-white"
                  aria-label="Play pronunciation"
                >
                   {activeText === word.s ? <AudioLines size={32} className="animate-pulse text-[#8bc34a]" /> : <Volume2 size={32} />}
                </button>
              </div>
              
              <div className="mt-8 block">
                {/* 增大字体：text-6xl 到 text-8xl */}
                <h3 className="text-6xl md:text-8xl font-black text-[#2d4a47] uppercase tracking-tight relative inline-block leading-tight">
                  {t(`vocab.${word.id}.t`, { defaultValue: word.t })}
                  <div className="absolute -bottom-2 left-0 w-full h-3 bg-[#fde68a] rounded-full opacity-80"></div>
                </h3>
              </div>
            </div>

            <div className="w-full space-y-8">
              
              <section className="bg-white rounded-[2.5rem] p-6 border-4 border-[#e9e4d0] relative shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                   <PenTool size={16} className="text-[#ffa600]" />
                   <h4 className="text-xs font-black text-[#bcaaa4] uppercase tracking-widest">GRAMMAR POCKET</h4>
                </div>

                {conjugationList.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                    {pronouns.map((p, i) => (
                      <div key={p} className="bg-white p-3 rounded-2xl border-2 border-[#f5f5f5] text-center hover:border-[#fde68a] transition-colors">
                        <span className="text-[9px] text-[#bcaaa4] font-bold uppercase block mb-0.5">{p}</span>
                        <span className="text-base font-black text-[#2d4a47]">
                          {renderFormText(conjugationList[i])}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 text-[#ffa600]">
                   <Sparkles size={16} fill="currentColor" />
                   <p className="font-black text-sm tracking-tight">
                     {word.type === 'verb' && word.reg ? `Regular ${word.s.slice(-2).toUpperCase()}.` : t(`vocab.${word.id}.tip`, { defaultValue: word.grammarTip })}
                   </p>
                </div>
              </section>

              {word.type === 'adj' && word.ant && (
                <section 
                  onClick={(e) => handleSpeak(e, word.ant!)}
                  className="bg-[#f3e5f5] rounded-[2.5rem] p-6 border-4 border-[#ce93d8]/30 flex items-center justify-between group cursor-pointer active:scale-95 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-white p-3.5 rounded-2xl text-[#ab47bc] shadow-sm border border-[#ce93d8]/20">
                      <ArrowLeftRight size={24} />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-[#ab47bc]/60 uppercase tracking-widest mb-0.5">OPPOSITE / ANTÓNIMO</h4>
                      <h3 className="text-3xl font-black text-[#6a1b9a] tracking-tight flex items-center gap-3">
                        {word.ant}
                        {activeText === word.ant && <AudioLines size={18} className="text-[#ab47bc] animate-pulse" />}
                      </h3>
                    </div>
                  </div>
                  <div className="bg-white px-5 py-2.5 rounded-2xl border-2 border-white shadow-sm font-black text-[#ab47bc] text-sm group-hover:bg-[#f3e5f5] transition-colors">
                    {word.antT}
                  </div>
                </section>
              )}

              <section className="bg-[#e3f2fd] rounded-[3rem] p-8 md:p-10 relative shadow-sm group">
                <div className="flex items-center gap-2 mb-8">
                   <BookOpen size={16} className="text-[#0277bd]" />
                   <h4 className="text-xs font-black text-[#0277bd]/50 uppercase tracking-widest">USAGE EXAMPLES</h4>
                </div>

                <div className="space-y-10">
                  {word.examples.map((ex, i) => (
                    <button 
                      key={i} 
                      onClick={(e) => handleSpeak(e, ex.txt)}
                      className="text-left w-full group/ex relative active:scale-[0.98] transition-all block focus:outline-none"
                    >
                      <div className="space-y-2">
                         <p className="text-[#01579b] text-3xl font-black leading-tight italic flex items-start gap-3">
                           <span className="opacity-40">"</span>
                           <span>{ex.txt}</span>
                           <span className="opacity-40">"</span>
                           {activeText === ex.txt && <AudioLines size={20} className="mt-2 text-[#0277bd] animate-pulse" />}
                         </p>
                         <p className="text-[#0277bd]/60 text-sm font-bold uppercase tracking-widest pl-5 border-l-2 border-[#0277bd]/20">
                           {ex.eng}
                         </p>
                      </div>
                    </button>
                  ))}
                </div>

                {(word.nounNotes && word.nounNotes !== 'Function Word') && (
                  <div className="mt-12 pt-8 border-t-2 border-dashed border-[#0277bd]/20">
                     <div className="flex items-center gap-2 mb-3">
                       <Map size={14} className="text-[#0277bd]/40" />
                       <span className="text-[10px] font-black text-[#0277bd]/40 uppercase tracking-widest">VOCAB NOTE</span>
                     </div>
                     <div className="p-5 rounded-2xl border-2 border-dashed border-[#0277bd]/30 bg-white/60">
                       <p className="text-[#0277bd] text-base font-bold leading-relaxed">
                         {t(`vocab.${word.id}.notes`, { defaultValue: word.nounNotes })}
                       </p>
                     </div>
                  </div>
                )}
              </section>

              <div className="pt-6 pb-2 flex flex-col items-center opacity-20 pointer-events-none">
                <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">
                  <Star size={10} fill="currentColor" /> Shelly Spanish Island <Star size={10} fill="currentColor" />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordDetailModal;
