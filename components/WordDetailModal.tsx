
import React from 'react';
import { Word } from '../types';
import { playAudio } from '../utils/audio';
import { getTypeTheme, getPosLabel } from '../utils/theme';
import { X, Zap, Sparkles, BookOpen, Map, Volume2, Star, Leaf, PenTool, Info, Bookmark } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface WordDetailModalProps {
  word: Word;
  onClose: () => void;
}

const WordDetailModal: React.FC<WordDetailModalProps> = ({ word, onClose }) => {
  const { t } = useTranslation();
  const theme = getTypeTheme(word);
  const conjugationList = word.forms ? word.forms.split(', ') : [];
  
  // 使用翻译系统获取标签
  const pronouns = word.type === 'verb' 
    ? [t('ui.grammar.yo'), t('ui.grammar.tu'), t('ui.grammar.el'), t('ui.grammar.nos'), t('ui.grammar.vos'), t('ui.grammar.ellos')] 
    : word.type === 'noun' 
      ? [t('ui.grammar.sing'), t('ui.grammar.plur')] 
      : [t('ui.grammar.masc'), t('ui.grammar.fem'), t('ui.grammar.masc_pl'), t('ui.grammar.fem_pl')];

  const renderFormText = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\[.*?\])/g);
    return parts.map((part, i) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        return (
          <span key={i} style={{ color: theme.main }} className="font-black underline decoration-2 underline-offset-4 decoration-current/20">
            {part.slice(1, -1)}
          </span>
        );
      }
      return part;
    });
  };

  const highlightExample = (text: string) => {
    const searchWord = word.s.toLowerCase();
    const regex = new RegExp(`(${searchWord}|${searchWord.slice(0, -1)}[a-zñáéíóú]*)`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) => 
      regex.test(part) ? (
        <span key={i} style={{ color: theme.main }} className="underline decoration-wavy decoration-current/30 underline-offset-4 font-black">
          {part}
        </span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      {/* 岛屿护照容器 */}
      <div className="relative w-full max-w-2xl bg-[#f7f9e4] rounded-none md:rounded-[4rem] border-0 md:border-[12px] border-white shadow-[0_30px_60px_-12px_rgba(0,0,0,0.3)] overflow-hidden animate-zoomIn flex flex-col h-full md:h-auto md:max-h-[95vh]">
        
        {/* 背景装饰：左侧装订孔位 */}
        <div className="absolute top-0 left-6 bottom-0 w-px border-l-2 border-dashed border-slate-200 opacity-50 z-0 hidden md:block"></div>
        <div className="absolute top-0 left-3 bottom-0 flex flex-col justify-around py-20 opacity-20 pointer-events-none hidden md:flex">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-3 h-3 rounded-full bg-slate-400 shadow-inner"></div>
          ))}
        </div>

        {/* 关闭按钮 */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-50 bg-white/80 backdrop-blur p-4 rounded-3xl text-slate-600 shadow-xl hover:bg-white hover:text-rose-500 transition-all active:scale-90"
        >
          <X size={24} strokeWidth={4} />
        </button>

        <div className="flex-1 overflow-y-auto no-scrollbar pt-16 md:pt-12 pb-12 px-6 md:px-10 relative z-10">
          <div className="flex flex-col items-center">
            
            {/* 徽章区 */}
            <div className="flex gap-3 mb-8">
              <span style={{ backgroundColor: theme.main }} className="px-5 py-1.5 rounded-full text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-black/10">
                {getPosLabel(word)}
              </span>
              {word.reg === false && (
                <span className="bg-slate-800 px-5 py-1.5 rounded-full text-white font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-2 shadow-lg shadow-black/10">
                  <Zap size={12} fill="currentColor" className="text-orange-400" /> {t('ui.study.hard_mode')}
                </span>
              )}
            </div>

            {/* 单词主展示区 */}
            <div className="text-center space-y-2 mb-10 w-full">
              <button 
                onClick={() => playAudio(word.s)}
                className="group relative inline-block active:scale-95 transition-transform"
              >
                <h2 className="text-7xl md:text-8xl font-black text-slate-800 tracking-tighter drop-shadow-sm flex items-center justify-center gap-4 relative">
                  {word.s}
                  <div className="bg-white p-3 rounded-2xl shadow-md border-2 border-slate-100 opacity-0 md:group-hover:opacity-100 transition-opacity absolute -right-16 top-1/2 -translate-y-1/2">
                    <Volume2 size={24} className="text-[#8bc34a]" />
                  </div>
                </h2>
                <div style={{ backgroundColor: theme.main + '20' }} className="absolute -bottom-2 left-0 w-full h-3 -rotate-1 rounded-full"></div>
              </button>
              <p className="text-3xl md:text-4xl text-[#ffa600] font-black uppercase tracking-tight italic handwritten">
                {t(`vocab.${word.id}.t`, { defaultValue: word.t })}
              </p>
            </div>

            <div className="w-full space-y-10 max-w-lg">
              {/* 语法部分 */}
              <section className="bg-white rounded-[3rem] p-8 border-4 border-slate-50 shadow-[0_10px_0_#f4f4f4] relative overflow-hidden group">
                <div className="flex items-center gap-3 mb-6 px-1">
                  <div style={{ backgroundColor: theme.light, color: theme.main }} className="p-2 rounded-xl">
                    <PenTool size={20} />
                  </div>
                  <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">{t('ui.study.grammar_pocket')}</h4>
                </div>

                {conjugationList.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 mb-8">
                    {pronouns.map((p, i) => (
                      <div key={p} className="bg-slate-50/50 p-4 rounded-2xl border-2 border-transparent hover:border-slate-100 hover:bg-white transition-all group/cell">
                        <span className="text-[9px] text-slate-400 font-black uppercase block mb-1 group-hover/cell:text-[#ffa600] tracking-tighter">{p}</span>
                        <span className="text-base font-black text-slate-700">
                          {renderFormText(conjugationList[i])}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ backgroundColor: theme.light + '50', borderColor: theme.main + '30' }} className="flex gap-4 p-5 rounded-3xl border-2 border-dashed">
                  <Sparkles size={22} style={{ color: theme.main }} className="shrink-0" />
                  <p className="text-slate-700 font-bold text-sm leading-relaxed italic">
                    "{t(`vocab.${word.id}.tip`, { defaultValue: word.grammarTip })}"
                  </p>
                </div>
              </section>

              {/* 语境区：例句成组，拆解在下 */}
              <section className="relative">
                <div className="bg-white rounded-[3.5rem] border-4 border-slate-50 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.1)] overflow-hidden">
                  
                  {/* 核心内容区 */}
                  <div className="p-8 pb-10 relative min-h-[300px]">
                    {/* 横线背景 */}
                    <div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px)', backgroundSize: '100% 3.5rem' }}></div>
                    
                    {/* 标题 */}
                    <div className="flex items-center gap-3 mb-8 px-1 relative z-10">
                      <div className="bg-sky-100 p-2 rounded-xl">
                        <BookOpen size={20} className="text-sky-600" />
                      </div>
                      <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">{t('ui.study.usage_examples')}</h4>
                    </div>
                    
                    {/* 两个例句紧凑排列在一起 */}
                    <div className="space-y-12 relative z-10 mb-14">
                      {word.examples.map((ex, i) => (
                        <div key={i} className="group/ex relative pl-8">
                          <Bookmark size={16} className="absolute left-0 top-1.5 text-sky-200 group-hover/ex:text-sky-400 transition-colors" />
                          <div className="space-y-1">
                             <p className="text-slate-800 text-xl font-black leading-snug tracking-tight italic transition-colors group-hover/ex:text-sky-900">
                               {highlightExample(ex.txt)}
                             </p>
                             <p className="handwritten text-slate-400 text-base leading-relaxed">
                               {ex.eng}
                             </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 单词拆解 - 移动到下方作为补充“小字”笔记 */}
                    {(word.nounNotes && word.nounNotes !== 'Function Word') && (
                      <div className="relative z-10 mt-6 pt-6 border-t border-dashed border-slate-100">
                         <div className="flex items-center gap-2 mb-3 px-1">
                           <Map size={12} className="text-amber-600" />
                           <span className="text-[8px] font-black text-amber-700/50 uppercase tracking-[0.2em]">{t('ui.study.vocab_note')}</span>
                         </div>
                         <p className="handwritten text-amber-900/60 text-sm font-bold leading-relaxed italic pl-4">
                           {t(`vocab.${word.id}.notes`, { defaultValue: word.nounNotes })}
                         </p>
                         <Leaf size={40} className="absolute -bottom-2 -right-2 text-amber-200/10 rotate-12" />
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* 底部功能提示 */}
              <div className="flex items-center justify-center gap-4 px-8 py-4 bg-slate-50/50 rounded-full border-2 border-white text-slate-400 transition-opacity hover:opacity-100 opacity-60">
                <Info size={14} />
                <p className="text-[9px] font-black uppercase tracking-widest">
                  {t('ui.study.skip_hint')}
                </p>
              </div>

              {/* 页脚署名 */}
              <div className="pt-4 pb-4 flex flex-col items-center opacity-10 pointer-events-none">
                <div className="h-px w-24 bg-slate-300 mb-4"></div>
                <div className="flex items-center gap-2 text-[8px] font-black text-slate-500 uppercase tracking-[0.5em]">
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
