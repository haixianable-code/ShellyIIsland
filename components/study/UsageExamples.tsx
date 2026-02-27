
import React from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen } from 'lucide-react';
import { Word } from '../../types';
import { getTypeTheme } from '../../utils/theme';
import { TimeState, PastMode } from './TimeMachine';

interface UsageExamplesProps {
  word: Word;
  timeState: TimeState;
  pastMode: PastMode;
}

export const UsageExamples: React.FC<UsageExamplesProps> = ({ word, timeState, pastMode }) => {
  const { t } = useTranslation();
  const theme = getTypeTheme(word);
  
  const filteredExamples = word.examples.filter(ex => {
      if (timeState === 'present') return !ex.tense || ex.tense === 'present';
      if (timeState === 'future') return ex.tense === 'future';
      if (timeState === 'past') {
          return pastMode === 'snapshot' ? ex.tense === 'past' : ex.tense === 'imperfect';
      }
      return false;
  });

  const displayExamples = filteredExamples.length > 0 ? filteredExamples : [];

  const highlightWord = (text: string) => {
    const searchWord = word.s.split(' ')[0].toLowerCase(); 
    const regex = new RegExp(`(${searchWord}|${searchWord.substring(0, 3)}[a-zñáéíóú]*)`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) => 
      regex.test(part) ? <span key={i} style={{ color: theme.main }} className="font-black underline decoration-2 underline-offset-2">{part}</span> : <span key={i}>{part}</span>
    );
  };

  return (
    <div className={`rounded-[2.5rem] p-6 relative shadow-sm space-y-6 transition-colors duration-500 ${
        timeState === 'past' ? (pastMode === 'snapshot' ? 'bg-[#efebe9]' : 'bg-[#e0e0e0]') : 
        timeState === 'future' ? 'bg-[#e3f2fd]' : 'bg-[#f1f8e9]'
    }`} role="complementary">
      <div className="flex items-center gap-2 mb-2" aria-hidden="true">
          <BookOpen size={14} className="opacity-50" />
          <span className="text-[9px] font-black opacity-50 uppercase tracking-widest">{t('ui.study.usage_examples')}</span>
          {timeState !== 'present' && (
              <span className="ml-auto text-[8px] font-black uppercase px-2 py-0.5 rounded-full bg-black/5">
                  {timeState === 'past' ? (pastMode === 'snapshot' ? 'Snapshot' : 'Movie') : timeState}
              </span>
          )}
      </div>
      
      {displayExamples.length > 0 ? (
          displayExamples.map((ex, i) => (
            <div key={i} className="text-left w-full animate-fadeIn">
            <p className="text-[#2d4a47] text-lg font-black leading-snug italic">"{highlightWord(ex.txt)}"</p>
            <p className="text-[#2d4a47]/60 text-xs font-bold uppercase mt-1">{ex.eng}</p>
            </div>
        ))
      ) : (
          <div className="text-center py-4 opacity-40 text-xs font-bold">
              No examples available for this specific timeline.
          </div>
      )}
    </div>
  );
};
