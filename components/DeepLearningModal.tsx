import React from 'react';
import { Word } from '../types';
import { Compass, RotateCcw, X } from 'lucide-react';
import { playClick } from '../utils/sfx';

interface DeepLearningModalProps {
  weakWords: Word[];
  nextBlueprintWords: Word[];
  onClose: () => void;
  onAdvance: (words: Word[]) => void;
  onConsolidate: (words: Word[]) => void;
}

const DeepLearningModal: React.FC<DeepLearningModalProps> = ({ weakWords, nextBlueprintWords, onClose, onAdvance, onConsolidate }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-[#f7f9e4] rounded-[2rem] p-6 w-full max-w-md shadow-2xl border-2 border-[#e0d9b4]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-[#2d4a47]">深度学习</h2>
          <button onClick={() => { playClick(); onClose(); }} className="p-2 hover:bg-white/50 rounded-full"><X size={20} /></button>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => { playClick(); onAdvance(nextBlueprintWords); }}
            disabled={nextBlueprintWords.length === 0}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-[#4a8ab5] text-white hover:bg-[#3a7a95] transition-all disabled:opacity-50"
          >
            <Compass size={24} />
            <div className="text-left">
              <div className="font-black">前瞻 - 预习新知</div>
              <div className="text-xs opacity-80">{nextBlueprintWords.length > 0 ? `解锁 ${nextBlueprintWords.length} 个新词` : '暂无新内容'}</div>
            </div>
          </button>

          <button
            onClick={() => { playClick(); onConsolidate(weakWords); }}
            disabled={weakWords.length === 0}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-[#e05a4e] text-white hover:bg-[#d04a3e] transition-all disabled:opacity-50"
          >
            <RotateCcw size={24} />
            <div className="text-left">
              <div className="font-black">巩固 - 强化记忆</div>
              <div className="text-xs opacity-80">{weakWords.length > 0 ? `复习 ${weakWords.length} 个弱项词` : '暂无弱项'}</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeepLearningModal;
