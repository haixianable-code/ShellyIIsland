
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Word } from '../../types';
import { getTypeTheme } from '../../utils/theme';
import { TimeState, PastMode } from './TimeMachine';

interface GrammarPocketProps {
  word: Word;
  timeState: TimeState;
  pastMode: PastMode;
}

export const GrammarPocket: React.FC<GrammarPocketProps> = ({ word, timeState, pastMode }) => {
  const { t } = useTranslation();
  const theme = getTypeTheme(word);
  const displayTip = t(`vocab.${word.id}.tip`, { defaultValue: word.grammarTip });

  let sourceForms = word.forms; 
  if (timeState === 'future') sourceForms = word.tense_forms?.future;
  if (timeState === 'past') {
      if (pastMode === 'snapshot') sourceForms = word.tense_forms?.past;
      if (pastMode === 'movie') sourceForms = word.tense_forms?.imperfect;
  }

  const conjugationList = sourceForms ? sourceForms.split(/,\s*/) : [];

  const renderFormText = (text: string | undefined) => {
    if (!text) return <span className="text-slate-300">-</span>;
    const parts = text.split(/(\[.*?\])/g);
    return parts.map((part, idx) => 
      part.startsWith('[') ? (
        <span key={idx} style={{ color: theme.main }} className="font-black underline decoration-2 underline-offset-2">
          {part.slice(1, -1)}
        </span>
      ) : (
        <span key={idx} className="text-[#2d4a47]">{part}</span>
      )
    );
  };

  if ((word.type === 'misc' && !sourceForms) || conjugationList.length === 0) {
    return (
      <div className="p-5 rounded-[2rem] border-2 border-dashed border-slate-200 mb-6 bg-white/60" role="note">
        <div className="flex items-center gap-2 mb-2 opacity-50">
            <span className="text-[9px] font-black uppercase tracking-widest">{t('ui.study.vocab_note')}</span>
        </div>
        <p className="text-[#2d4a47] font-bold text-sm italic leading-relaxed">{displayTip || "No specific grammar notes."}</p>
      </div>
    );
  }

  const labels = word.type === 'verb' 
    ? [t('ui.grammar.yo'), t('ui.grammar.tu'), t('ui.grammar.el'), t('ui.grammar.nos'), t('ui.grammar.vos'), t('ui.grammar.ellos')] 
    : [t('ui.grammar.sing'), t('ui.grammar.plur')];

  const cardBg = timeState === 'past' ? (pastMode === 'snapshot' ? 'bg-[#d7ccc8]/40 border-[#d7ccc8]' : 'bg-[#efebe9] border-[#d7ccc8]') : 
                 timeState === 'future' ? 'bg-[#bbdefb]/40 border-[#bbdefb]' : 
                 'bg-white/80 border-slate-100';

  return (
    <div className="grid grid-cols-2 gap-2.5 mb-8" aria-label="Word conjugations">
      {labels.map((label, i) => (
        <div key={label} className={`${cardBg} p-3 rounded-2xl border flex flex-col items-center shadow-sm transition-colors duration-500`}>
          <span className="text-[7px] font-bold text-slate-400 uppercase mb-1">{label}</span>
          <span className="text-sm font-black text-[#2d4a47] text-center leading-tight">{renderFormText(conjugationList[i])}</span>
        </div>
      ))}
    </div>
  );
};
