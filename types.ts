
export interface WordExample {
  txt: string;
  eng: string;
}

export type FeedbackQuality = 'forgot' | 'hard' | 'good' | 'easy';

export interface WordNuance {
  type: 'warning' | 'upgrade'; // warning for distinctions (Ser/Estar), upgrade for advanced synonyms
  baseWord?: string; // Optional ID of the base word (e.g. 'grande' for 'enorme')
  label: string; // Title e.g., "Don't confuse with..." or "Level Up"
  note: string; // The explanation
}

export type WordLevel = 'A1' | 'A2' | 'B1';
export type WordTopic = 'travel' | 'food' | 'work' | 'nature' | 'daily' | 'feelings' | 'society' | 'abstract' | 'tech' | 'art' | 'grammar' | 'time' | 'social' | 'body' | 'life';

export interface Word {
  id: string;
  s: string; // Spanish
  t: string; // Translation (English)
  level: WordLevel; // CEFR Level
  topic: WordTopic; // Contextual Topic
  type: 'verb' | 'adj' | 'noun' | 'misc';
  category?: string; // For catalog organization (legacy/specific)
  reg?: boolean; // Regularity
  forms?: string; // Conjugations (Present tense)
  ant?: string; // Antonym Spanish
  antT?: string; // Antonym Translation (English)
  grammarTip: string; // Required manual tip
  nuance?: WordNuance; // New: For distinctions and upgrades
  examples: WordExample[]; // Exactly 2 examples
  nounNotes: string; // English explanation of nouns used in examples
}

export interface SRSData {
  level: number;
  nextReviewDate: string;
}

export interface ProgressMap {
  [wordId: string]: SRSData;
}

export interface UserStats {
  current_streak: number;
  last_activity_date: string;
  total_words_learned: number;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  STUDY = 'STUDY',
  REVIEW = 'REVIEW',
  VOCABULARY = 'VOCABULARY',
  SETTINGS = 'SETTINGS'
}

export interface DayPack {
  id: string;
  title: string;
  words: Word[];
}