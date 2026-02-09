
import { Word } from '../types';

export interface ThemeColors {
  main: string;
  light: string;
  text: string;
}

/**
 * 获取词性对应的视觉主题
 */
export const getTypeTheme = (word: Word): ThemeColors => {
  const type = word.type;
  const cat = word.category;
  
  if (type === 'verb') return { main: '#ff7043', light: '#fff3e0', text: '#bf360c' };
  if (type === 'adj') return { main: '#29b6f6', light: '#e1f5fe', text: '#01579b' };
  
  // 新名词颜色：琥珀金 (用于补给箱物资)
  if (type === 'noun' || cat === 'loot') return { main: '#FFB300', light: '#FFF8E1', text: '#FF8F00' };
  
  // 紫色家族：全能功能词
  if (type === 'misc' || ['connector', 'preposition', 'adverb', 'pronoun', 'interrogative'].includes(cat || '')) {
    return { main: '#ab47bc', light: '#f3e5f5', text: '#6a1b9a' };
  }
  
  if (cat === 'time') return { main: '#ffa000', light: '#fff8e1', text: '#ff6f00' };
  return { main: '#78909c', light: '#eceff1', text: '#37474f' };
};

/**
 * 获取专业的词性展示文本
 */
export const getPosLabel = (word: Word): string => {
  if (word.type === 'verb') return 'VERBO';
  if (word.type === 'adj') return 'ADJETIVO';
  if (word.type === 'noun') return 'SUSTANTIVO';
  
  // 功能词细分标签
  switch (word.category) {
    case 'connector': return 'CONJUNCIÓN';
    case 'preposition': return 'PREPOSICIÓN';
    case 'adverb': return 'ADVERBIO';
    case 'pronoun': return 'PRONOMBRE';
    case 'interrogative': return 'PREGUNTA';
    default: return 'PARTÍCULA';
  }
};
