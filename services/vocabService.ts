
import { supabase } from './supabaseClient';
import { Word } from '../types';
import { VOCABULARY_DATA, EXTRA_CANDIDATES } from '../constants';

const TABLE = 'vocabulary';

// Map DB row (snake_case) to App Word (camelCase)
const mapRowToWord = (row: any): Word => ({
  id: row.id,
  s: row.s,
  t: row.t,
  level: row.level as any,
  topic: row.topic as any,
  type: row.type as any,
  category: row.category,
  reg: row.reg,
  forms: row.forms,
  grammarTip: row.grammar_tip,
  nounNotes: row.noun_notes,
  examples: row.examples || [],
  nuance: row.nuance || undefined,
  tense_forms: row.tense_forms || undefined, // Vital for Time Machine
});

// Map App Word to DB Row
const mapWordToRow = (word: Word) => ({
  id: word.id,
  s: word.s,
  t: word.t,
  level: word.level,
  topic: word.topic,
  type: word.type,
  category: word.category,
  reg: word.reg,
  forms: word.forms,
  grammar_tip: word.grammarTip,
  noun_notes: word.nounNotes,
  examples: word.examples,
  nuance: word.nuance,
  tense_forms: word.tense_forms, // Vital for Time Machine
});

/**
 * Validation Helper
 * Ensures no broken words get sent to the cloud.
 */
const validateWord = (word: Word): boolean => {
  if (!word.id || word.id.trim() === '') return false;
  if (!word.s || word.s.trim() === '') return false;
  if (!word.t || word.t.trim() === '') return false;
  // Ensure level is one of the allowed types (basic check)
  if (!['A1', 'A2', 'B1'].includes(word.level)) return false;
  return true;
};

export const vocabService = {
  /**
   * Fetches all vocabulary from Supabase.
   * Falls back to local data if connection fails or table is empty.
   */
  async getAllWords(): Promise<Word[]> {
    if (!supabase) return this.getLocalWords();

    try {
      const { data, error } = await supabase
        .from(TABLE)
        .select('*');

      if (error) throw error;

      if (!data || data.length === 0) {
        console.warn("☁️ Supabase vocabulary empty. Using local backup.");
        return this.getLocalWords();
      }

      // console.log(`☁️ Loaded ${data.length} words from Supabase.`);
      return data.map(mapRowToWord);
    } catch (err) {
      console.error("☁️ Fetch Error:", err);
      return this.getLocalWords();
    }
  },

  /**
   * Returns the hardcoded local data (Legacy Mode)
   */
  getLocalWords(): Word[] {
    const allSources = [...VOCABULARY_DATA.flatMap(d => d.words), ...EXTRA_CANDIDATES];
    // De-duplicate by ID
    const unique = new Map();
    allSources.forEach(w => unique.set(w.id, w));
    return Array.from(unique.values());
  },

  /**
   * ADMIN TOOL: Uploads all local `courseData` and `expansionData` to Supabase.
   * Includes validation and sanitation.
   */
  async seedDatabaseFromLocal(): Promise<{ success: boolean; count: number; message: string }> {
    if (!supabase) return { success: false, count: 0, message: "Supabase not configured" };

    try {
      const localWords = this.getLocalWords();
      
      // 1. Sanitize
      const validWords = localWords.filter(validateWord);
      const invalidCount = localWords.length - validWords.length;
      
      if (invalidCount > 0) {
        console.warn(`⚠️ Skipped ${invalidCount} invalid words during upload.`);
      }

      // 2. Prepare Payload
      const payload = validWords.map(mapWordToRow);

      // 3. Upsert (Chunked if necessary, but 500 is usually fine for Supabase)
      // We'll split into chunks of 100 just to be safe for larger expansion packs
      const CHUNK_SIZE = 100;
      let upsertedCount = 0;

      for (let i = 0; i < payload.length; i += CHUNK_SIZE) {
        const chunk = payload.slice(i, i + CHUNK_SIZE);
        const { error } = await supabase
          .from(TABLE)
          .upsert(chunk, { onConflict: 'id' });

        if (error) {
          console.error(`Seed Error at chunk ${i}:`, error);
          throw error;
        }
        upsertedCount += chunk.length;
      }

      return { 
        success: true, 
        count: upsertedCount, 
        message: `Successfully synced ${upsertedCount} words (with new Tense data) to the cloud!` 
      };

    } catch (err: any) {
      return { success: false, count: 0, message: `Upload failed: ${err.message}` };
    }
  }
};
