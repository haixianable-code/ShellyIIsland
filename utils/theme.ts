
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
  if (type === 'noun') return { main: '#8bc34a', light: '#f1f8e9', text: '#2e7d32' };
  if (type === 'adj') return { main: '#29b6f6', light: '#e1f5fe', text: '#01579b' };
  if (cat === 'connector' || type === 'misc') return { main: '#ab47bc', light: '#f3e5f5', text: '#6a1b9a' };
  if (cat === 'time') return { main: '#ffa000', light: '#fff8e1', text: '#ff6f00' };
  return { main: '#78909c', light: '#eceff1', text: '#37474f' };
};

/**
 * 获取专业的词性展示文本
 */
export const getPosLabel = (word: Word): string => {
  if (word.type === 'verb') return 'VERBO';
  if (word.type === 'noun') return 'SUSTANTIVO';
  if (word.type === 'adj') return 'ADJETIVO';
  return 'PARTÍCULA';
};
