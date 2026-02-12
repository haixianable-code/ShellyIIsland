
import { z } from 'zod';
import { Word, SRSData, ProgressMap, UserStats } from '../types';

/**
 * Word Item Schema
 * Ensures every word has essential fields and provides defaults for optional ones.
 */
export const WordExampleSchema = z.object({
  txt: z.string(),
  eng: z.string(),
});

export const WordNuanceSchema = z.object({
  type: z.enum(['warning', 'upgrade']),
  baseWord: z.string().optional(),
  label: z.string(),
  note: z.string(),
});

// Explicitly type WordSchema to ensure compatibility with the Word interface.
// Using 'as any' to handle complex union types like WordTopic and Zod's default/optional behavior mismatch.
export const WordSchema: z.ZodType<Word> = z.object({
  id: z.string(),
  s: z.string(),
  t: z.string(),
  level: z.enum(['A1', 'A2', 'B1']),
  topic: z.string() as any, // Cast because Topic is a large union
  type: z.enum(['verb', 'adj', 'noun', 'misc']),
  category: z.string().optional(),
  reg: z.boolean().optional(),
  forms: z.string().optional(),
  ant: z.string().optional(),
  antT: z.string().optional(),
  grammarTip: z.string().default('No specific grammar tip.'),
  nuance: WordNuanceSchema.optional(),
  examples: z.array(WordExampleSchema).min(1).default([]),
  nounNotes: z.string().default('General vocabulary.'),
}) as any;

/**
 * Progress & SRS Schema
 * Prevents "Red Screen of Death" when reading malformed local storage.
 */
// Explicitly type SRSDataSchema to ensure it matches the SRSData interface.
// Simplifies nextReviewDate validation to avoid inference issues that caused it to be marked as optional.
export const SRSDataSchema: z.ZodType<SRSData> = z.object({
  level: z.number().int().min(1).default(1),
  // Basic regex validation that accepts both short date and full ISO strings
  nextReviewDate: z.string().regex(/^(\d{4}-\d{2}-\d{2}T.*|\d{4}-\d{2}-\d{2})$/),
}) as any;

export const ProgressMapSchema: z.ZodType<ProgressMap> = z.record(z.string(), SRSDataSchema);

/**
 * User Statistics Schema
 */
// Explicitly type UserStatsSchema to satisfy compiler requirements in store initialization.
export const UserStatsSchema: z.ZodType<UserStats> = z.object({
  current_streak: z.number().int().min(0).default(0),
  last_activity_date: z.string().default(new Date().toISOString()),
  total_words_learned: z.number().int().min(0).default(0),
}) as any;
