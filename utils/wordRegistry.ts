
import { Word, WordNuance, WordTopic } from '../types';
import { pluralize, generateRegularForms } from './grammar';

export const v = (id: string, s: string, t: string, topic: WordTopic, tip: string, ex1: string, ex1t: string, ex2: string, ex2t: string, nn: string, forms?: string, reg?: boolean, nuance?: WordNuance): Word => {
  const effectiveReg = reg ?? true;
  let computedForms = forms || '';
  if (effectiveReg && !computedForms) computedForms = generateRegularForms(s);
  return { id, s, t, level: 'A1', topic, type: 'verb', category: 'island', reg: effectiveReg, forms: computedForms, grammarTip: tip, examples: [{ txt: ex1, eng: ex1t }, { txt: ex2, eng: ex2t }], nounNotes: nn, nuance };
};

export const a = (id: string, s: string, t: string, topic: WordTopic, ant: string, antT: string, tip: string, ex1: string, ex1t: string, ex2: string, ex2t: string, nn: string, nuance?: WordNuance): Word => {
  let masc = s; let fem = s; if (s.endsWith('o')) fem = s.slice(0, -1) + 'a';
  const forms = `${masc}, ${fem}, ${pluralize(masc)}, ${pluralize(fem)}`;
  return { id, s, t, level: 'A1', topic, type: 'adj', category: 'island', ant, antT, grammarTip: tip, forms, examples: [{ txt: ex1, eng: ex1t }, { txt: ex2, eng: ex2t }], nounNotes: nn, nuance };
};

export const n = (id: string, s: string, t: string, topic: WordTopic, gender: 'm' | 'f', tip: string, ex1: string, ex1t: string, ex2: string, ex2t: string, notes: string): Word => {
  const article = gender === 'm' ? 'El' : 'La'; const pluralArticle = gender === 'm' ? 'Los' : 'Las';
  const forms = `${article} ${s}, ${pluralArticle} ${pluralize(s)}`;
  return { id, s, t, level: 'A1', topic, type: 'noun', category: 'loot', forms, grammarTip: `${gender === 'm' ? 'Masc' : 'Fem'}. ${tip}`, examples: [{ txt: ex1, eng: ex1t }, { txt: ex2, eng: ex2t }], nounNotes: notes };
};

export const m = (id: string, s: string, t: string, topic: WordTopic, tip: string, ex1: string, ex1t: string, ex2: string, ex2t: string, category: string, notes: string): Word => ({
  id, s, t, level: 'A1', topic, type: 'misc', category, grammarTip: tip, forms: '', examples: [{ txt: ex1, eng: ex1t }, { txt: ex2, eng: ex2t }], nounNotes: notes
});
