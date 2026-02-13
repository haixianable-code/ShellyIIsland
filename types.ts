export interface WordExample {
  txt: string;
  eng: string;
}

export type FeedbackQuality = 'forgot' | 'hard' | 'good' | 'easy';

export interface WordNuance {
  type: 'warning' | 'upgrade'; 
  baseWord?: string; 
  label: string; 
  note: string; 
}

export type WordLevel = 'A1' | 'A2' | 'B1';
export type WordTopic = 'travel' | 'food' | 'work' | 'nature' | 'daily' | 'feelings' | 'society' | 'abstract' | 'tech' | 'art' | 'grammar' | 'time' | 'social' | 'body' | 'life' | 'quantity' | 'science';

export interface Word {
  id: string;
  s: string; 
  t: string; 
  level: WordLevel; 
  topic: WordTopic; 
  type: 'verb' | 'adj' | 'noun' | 'misc';
  category?: string; 
  reg?: boolean; 
  forms?: string; 
  ant?: string; 
  antT?: string; 
  grammarTip: string; 
  nuance?: WordNuance; 
  examples: WordExample[]; 
  nounNotes: string; 
}

export interface SRSData {
  level: number;
  nextReviewDate: string;
  easeFactor: number;
  failureCount: number;
}

export interface ProgressMap {
  [wordId: string]: SRSData;
}

export interface UserStats {
  current_streak: number;
  last_activity_date: string;
  total_words_learned: number;
}

export interface UserProfile {
  id: string;
  traveler_name: string | null;
  avatar_id: string;
  is_premium: boolean;
  updated_at: string;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  STUDY = 'STUDY',
  REVIEW = 'REVIEW',
  VOCABULARY = 'VOCABULARY',
  SETTINGS = 'SETTINGS',
  BLOG = 'BLOG'
}

export interface DayPack {
  id: string;
  title: string;
  words: Word[];
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  tags: string[];
}
