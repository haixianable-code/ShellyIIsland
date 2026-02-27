
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Ghost, Wind, Smile, FastForward, RotateCcw, ArrowRight } from 'lucide-react';
import { FeedbackQuality } from '../../types';
import { playClick } from '../../utils/sfx';

interface FeedbackBarProps {
  currentRating: FeedbackQuality | null;
  onFeedback: (quality: FeedbackQuality) => void;
  onNext: () => void;
  onFlipBack: () => void;
  theme: { main: string; light: string; text: string };
}

export const FeedbackBar: React.FC<FeedbackBarProps> = ({ 
  currentRating, onFeedback, onNext, onFlipBack, theme 
}) => {
  const { t } = useTranslation();

  return (
    <footer className="shrink-0 p-6 bg-white border-t border-slate-50 space-y-3 z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.02)] rounded-b-[3.5rem]">
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          {['forgot', 'hard', 'good', 'easy'].map(id => (
            <button 
              key={id} 
              onMouseDown={(e) => e.stopPropagation()} 
              onClick={() => { playClick(); onFeedback(id as FeedbackQuality); }} 
              className={`transition-all bubble-button ${currentRating === id ? 'scale-125 opacity-100' : 'opacity-20'}`}
            >
              {id === 'forgot' ? <Ghost size={20} color="#94a3b8" /> : 
               id === 'hard' ? <Wind size={20} color="#f97316" /> : 
               id === 'good' ? <Smile size={20} color={theme.main} /> :
               <FastForward size={20} color={theme.main} />}
            </button>
          ))}
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onFlipBack(); }} 
          onMouseDown={(e) => e.stopPropagation()} 
          className="text-[9px] font-black text-slate-300 uppercase flex items-center gap-1 hover:text-slate-400 bubble-button"
        >
          <RotateCcw size={12} /> {t('ui.blog.back')}
        </button>
      </div>
      <button 
        onClick={(e) => { 
          e.stopPropagation(); 
          if(currentRating) onNext(); 
        }} 
        onMouseDown={(e) => e.stopPropagation()} 
        disabled={!currentRating} 
        style={{ backgroundColor: theme.main }} 
        className="bubble-button w-full py-4 rounded-[2.5rem] text-white font-black text-lg shadow-[0_6px_0_rgba(0,0,0,0.1)] flex items-center justify-center gap-2 border-2 border-white/20 disabled:opacity-50"
      >
        <span>{t('ui.actions.next_word')}</span><ArrowRight size={20} />
      </button>
    </footer>
  );
};
