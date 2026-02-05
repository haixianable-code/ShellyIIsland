
import React, { useState } from 'react';
import { Word, ProgressMap } from '../types';
import { Search, Briefcase, ShoppingBag, Leaf, Coffee } from 'lucide-react';

interface VocabularyViewProps {
  words: Word[];
  progress: ProgressMap;
}

const VocabularyView: React.FC<VocabularyViewProps> = ({ words, progress }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredWords = words.filter(w => 
    w.s.toLowerCase().includes(searchTerm.toLowerCase()) || 
    w.t.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-[#ffb74d] p-4 rounded-3xl shadow-[0_6px_0_#e67e22] border-4 border-white">
            <ShoppingBag className="text-white fill-current" size={32} />
          </div>
          <h2 className="text-5xl font-black text-[#4b7d78] drop-shadow-sm">My Pocket</h2>
        </div>
        
        <div className="relative group">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-[#8bc34a] p-2 rounded-xl shadow-sm border-2 border-white">
            <Search className="text-white" size={20} strokeWidth={3} />
          </div>
          <input 
            type="text" 
            placeholder="Search words..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-20 pr-8 py-5 bg-white border-4 border-[#e0d9b4] rounded-[3rem] w-full md:w-80 shadow-[0_6px_0_#e0d9b4] focus:outline-none focus:ring-8 focus:ring-[#8bc34a]/30 transition-all font-black text-[#4b7d78] placeholder:text-[#8d99ae]/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredWords.map(word => {
          const stats = progress[word.id];
          const level = stats?.level || 0;
          return (
            <div key={word.id} className="bg-white p-8 rounded-[4rem] border-4 border-[#f0f0f0] shadow-[0_12px_0_rgba(0,0,0,0.06)] hover:shadow-[0_16px_0_rgba(139,195,74,0.15)] hover:border-[#8bc34a] transition-all flex items-center justify-between group cursor-pointer active:translate-y-2 active:shadow-none">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full shadow-inner border-2 border-white ${word.type === 'verb' ? 'bg-[#ff7043]' : word.type === 'adj' ? 'bg-[#fbc02d]' : 'bg-[#2196f3]'}`}></div>
                  <h3 className="text-2xl font-black text-[#2e4d4a] group-hover:text-[#4b7d78] transition-colors">{word.s}</h3>
                </div>
                <p className="text-[#6d7c8e] font-bold text-lg tracking-tight">{word.t}</p>
              </div>
              
              <div className="flex gap-2 justify-end">
                {[...Array(6)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-4 w-4 rounded-full transition-all border-2 shadow-sm ${i < level ? 'bg-[#8bc34a] border-white scale-110' : 'bg-slate-100 border-slate-200'}`} 
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {filteredWords.length === 0 && (
        <div className="text-center py-24 bg-white/50 rounded-[5rem] border-8 border-dashed border-[#e0d9b4]">
          <div className="bg-[#fff9c4] w-32 h-32 rounded-[3rem] flex items-center justify-center mx-auto mb-8 text-[#fbc02d] border-4 border-[#fdd835] shadow-inner rotate-3">
            <Coffee size={64} className="fill-current" />
          </div>
          <p className="text-[#8d99ae] font-black uppercase tracking-[0.3em] text-lg">Pocket is empty!</p>
          <p className="text-[#8d99ae] font-bold mt-2 opacity-60">Try searching for something else?</p>
        </div>
      )}
    </div>
  );
};

export default VocabularyView;
