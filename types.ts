
export interface WordExample {
  txt: string;
  eng: string;
}

export interface Word {
  id: string;
  s: string; // Spanish
  t: string; // Translation (English)
  type: 'verb' | 'adj' | 'noun';
  reg?: boolean; // Regularity
  forms?: string; // Conjugations (Present tense)
  ant?: string; // Antonym Spanish
  antT?: string; // Antonym Translation (English)
  grammarTip: string; // Required manual tip
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

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  STUDY = 'STUDY',
  REVIEW = 'REVIEW',
  VOCABULARY = 'VOCABULARY'
}
