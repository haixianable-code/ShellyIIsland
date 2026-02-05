
import React, { useState } from 'react';
import { Word } from '../types';
import { X, Check, Sprout, Leaf, PackagePlus } from 'lucide-react';

interface ExpansionModalProps {
  availableWords: Word[];
  onClose: () => void;
  onAddWords: (selectedWords: Word[]) => void;
}

const ExpansionModal: React.FC<ExpansionModalProps> = ({ availableWords, onClose, onAddWords }) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const MAX_SELECTION = 10;

  const handleToggle = (wordId: string) => {
    const newSelected = new Set(selected);
    if (newSelected.has(wordId)) {
      newSelected.delete(wordId);
    } else {
      if (newSelected.size < MAX_SELECTION) {
        newSelected.add(wordId);
      }
    }
    setSelected(newSelected);
  };

  const handleConfirm = () => {
    const selectedWords = availableWords.filter(w => selected.has(w.id));
    onAddWords(selectedWords);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#f7f9e4] rounded-[3.5rem] border-[8px] border-white shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col h-[90vh]">
        
        {/* Header */}
        <div className="p-6 md:p-8 shrink-0 border-b-4 border-[#e0d9b4] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-[#8bc34a] p-3 rounded-2xl shadow-sm border-2 border-white">
              <PackagePlus className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#4b7d78]">Choose Your Seeds</h2>
              <p className="text-sm font-bold text-[#8d99ae]">Select up to {MAX_SELECTION} new words to plant.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-white rounded-2xl shadow-md hover:bg-[#f1f8e9] transition-all active:scale-90 text-[#4b7d78]">
            <X size={24} strokeWidth={3} />
          </button>
        </div>

        {/* Word List */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {availableWords.map(word => {
              const isSelected = selected.has(word.id);
              const isFull = selected.size >= MAX_SELECTION && !isSelected;
              return (
                <button
                  key={word.id}
                  onClick={() => handleToggle(word.id)}
                  disabled={isFull}
                  className={`p-4 rounded-3xl border-4 text-left transition-all relative overflow-hidden group ${
                    isSelected
                      ? 'bg-[#e8f5e9] border-[#8bc34a] shadow-[0_6px_0_#689f38]'
                      : 'bg-white border-[#f0f0f0] hover:border-[#c5e1a5]'
                  } ${isFull ? 'opacity-50 cursor-not-allowed' : 'active:translate-y-1 active:shadow-none'}`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-white p-1 rounded-full border-2 border-[#8bc34a]">
                      <Check size={12} className="text-[#8bc34a]" strokeWidth={4} />
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-1">
                     <Sprout size={12} className={isSelected ? 'text-[#8bc34a]' : 'text-[#c5e1a5]'} />
                     <h4 className="font-black text-lg text-[#4b7d78]">{word.s}</h4>
                  </div>
                  <p className="text-sm font-bold text-[#8d99ae]">{word.t}</p>
                </button>
              );
            })}
             {availableWords.length === 0 && (
              <div className="col-span-full text-center py-24 bg-white/50 rounded-[3rem] border-4 border-dashed border-[#e0d9b4]">
                 <div className="bg-[#a5d6a7] w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-white border-4 border-white shadow-inner">
                    <PackagePlus size={48} />
                 </div>
                 <p className="text-[#8d99ae] font-black uppercase tracking-[0.2em] text-md">Expansion Complete!</p>
                 <p className="text-[#8d99ae] font-bold mt-2 opacity-60">You've planted all available seeds.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 md:p-8 shrink-0 border-t-4 border-[#e0d9b4] bg-[#f9f5da]">
          <div className="flex items-center justify-between">
            <div className="text-lg font-black text-[#4b7d78]">
              <span className={selected.size > 0 ? 'text-[#8bc34a]' : ''}>{selected.size}</span> / {MAX_SELECTION} Selected
            </div>
            <button
              onClick={handleConfirm}
              disabled={selected.size === 0}
              className="px-8 py-5 rounded-[2rem] font-black text-lg text-white bg-[#88d068] shadow-[0_8px_0_#5a9a3b] flex items-center gap-2 bubble-button disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed"
            >
              <Leaf size={20} /> Plant {selected.size} Seeds
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpansionModal;
