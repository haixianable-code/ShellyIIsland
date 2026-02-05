
import React from 'react';
import { Word } from '../types';
import { X, Zap, ArrowRightLeft, Sparkles, BookOpen, Map, Layers, Heart } from 'lucide-react';

interface WordDetailModalProps {
  word: Word;
  onClose: () => void;
}

const WordDetailModal: React.FC<WordDetailModalProps> = ({ word, onClose }) => {
  const conjugationList = word.forms ? word.forms.split(', ') : [];
  const pronouns = ['Yo', 'Tú', 'Él/Ella', 'Nos.', 'Vos.', 'Ellos'];

  const renderFormText = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\[.*?\])/g);
    return parts.map((part, i) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        return (
          <span key={i} className="text-[#e91e63] underline decoration-wavy decoration-1 underline-offset-2 decoration-[#ff80ab]">
            {part.slice(1, -1)}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#f7f9e4] rounded-[3.5rem] border-[8px] border-white shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden animate-zoomIn flex flex-col max-h-[90vh]">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-30 bg-white p-3 rounded-2xl text-[#4b7d78] shadow-md hover:bg-[#f1f8e9] transition-all active:scale-90"
        >
          <X size={24} strokeWidth={3} />
        </button>

        <div className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-10">
          <div className="flex flex-col items-center">
            {/* Category Tags */}
            <div className="flex gap-2 mb-4">
              <div className={`px-4 py-1 rounded-full text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-sm ${word.type === 'verb' ? 'bg-[#ff7043]' : word.type === 'adj' ? 'bg-[#fbc02d]' : 'bg-[#2196f3]'}`}>
                {word.type}
              </div>
              {word.reg === false && (
                <div className="bg-[#e91e63] px-4 py-1 rounded-full text-white font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-1 shadow-sm">
                  <Zap size={10} fill="currentColor" /> Irregular
                </div>
              )}
            </div>

            {/* Main Word */}
            <h2 className="text-5xl md:text-6xl font-black text-[#2e4d4a] tracking-tighter mb-2 text-center">
              {word.s}
            </h2>
            <p className="text-2xl md:text-3xl text-[#8bc34a] font-black uppercase tracking-tight mb-8 drop-shadow-sm">
              {word.t}
            </p>

            <div className="w-full space-y-6">
              {/* Grammar Section */}
              <section className="bg-white/80 p-6 rounded-[2.5rem] border-4 border-[#e0d9b4] relative overflow-hidden shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Layers size={18} className="text-[#ffa600]" />
                  <h4 className="text-[12px] font-black text-[#4b7d78] uppercase tracking-wider">Grammar Guide</h4>
                </div>

                {conjugationList.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    {pronouns.map((p, i) => (
                      <div key={p} className="bg-white p-2.5 rounded-2xl border-2 border-[#f0f0f0] text-center shadow-sm">
                        <span className="text-[8px] text-[#8d99ae] font-black uppercase block mb-0.5">{p}</span>
                        <span className="text-sm font-black text-[#4b7d78]">
                          {renderFormText(conjugationList[i])}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-3 text-sm font-bold text-[#5d4037] leading-relaxed bg-[#fff9c4]/50 p-4 rounded-2xl border-2 border-dashed border-[#fdd835]">
                  <Sparkles size={18} className="text-[#fbc02d] shrink-0" />
                  <p>{word.grammarTip}</p>
                </div>
              </section>

              {/* Antonym Section */}
              {word.type === 'adj' && word.ant && (
                <div className="bg-[#f3e5f5] p-5 rounded-[2rem] border-4 border-[#ce93d8] flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <ArrowRightLeft size={20} className="text-[#9c27b0]" />
                    <div>
                      <span className="text-[9px] font-black text-[#9c27b0] uppercase tracking-widest block">Opposite</span>
                      <span className="text-xl font-black text-[#4a148c]">{word.ant}</span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-[#4a148c] bg-white px-3 py-1.5 rounded-xl border border-[#ce93d8]">{word.antT}</span>
                </div>
              )}

              {/* Examples Section */}
              <section className="bg-[#e3f2fd] p-8 rounded-[3rem] border-b-[8px] border-[#90caf9] relative overflow-hidden shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <BookOpen size={18} className="text-[#1565c0]" />
                  <h4 className="text-[12px] font-black text-[#1565c0] uppercase tracking-wider">Usage Examples</h4>
                </div>

                <div className="space-y-6 mb-6">
                  {word.examples.map((ex, i) => (
                    <div key={i} className="pl-4 border-l-4 border-[#90caf9]">
                      <p className="text-[#1565c0] text-xl font-black italic leading-tight">"{ex.txt}"</p>
                      <p className="text-[#1565c0]/60 text-[11px] font-black uppercase mt-1">{ex.eng}</p>
                    </div>
                  ))}
                </div>
                
                <div className="bg-white/80 p-5 rounded-2xl border-2 border-dashed border-[#90caf9]">
                  <div className="flex items-center gap-2 mb-2">
                    <Map size={14} className="text-[#8bc34a]" />
                    <span className="text-[10px] text-[#4b7d78] font-black uppercase tracking-widest">Vocabulary Map</span>
                  </div>
                  <p className="text-[#4b7d78] text-[13px] font-bold leading-snug">{word.nounNotes}</p>
                </div>
              </section>

              <div className="pt-6 flex flex-col items-center opacity-10 gap-1 grayscale pointer-events-none">
                <span className="text-[8px] font-black text-[#4b7d78] uppercase tracking-[0.4em]">Detail Harvested</span>
                <Heart size={8} className="text-[#ff7b72] fill-current" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordDetailModal;
