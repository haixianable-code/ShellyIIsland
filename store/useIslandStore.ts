
import { create } from 'zustand';
import { AppView, Word, FeedbackQuality, ProgressMap, UserStats } from '../types';
import { storageService } from '../services/storageService';
import { TODAY_SIMULATED, VOCABULARY_DATA, EXTRA_CANDIDATES } from '../constants';
import { calculateNextProgress } from '../utils/srsCore';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { User } from '@supabase/supabase-js';
import { ProgressMapSchema, UserStatsSchema } from '../schemas/islandSchema';
import { getAISmartHint, AIWordInfo } from '../services/geminiService';

const PROGRESS_KEY = 'hola_word_srs_v3_offline';
const STATS_KEY = 'hola_user_stats_v1_offline';
const AI_CACHE_KEY = 'ssi_ai_content_v1';
const DAILY_GOAL_VALUE = 20;

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

export type ModalType = 'WORD_DETAIL' | 'STREAK' | 'DAILY_HARVEST' | 'SYNC_COMPLETE' | 'PROFILE_ENTRY' | 'RETURNING_WELCOME' | 'ACHIEVEMENT';

interface IslandState {
  view: AppView;
  activeModal: ModalType | null;
  modalData: any;
  isMuted: boolean;
  progress: ProgressMap;
  stats: UserStats;
  aiCache: Record<string, AIWordInfo>;
  isAIAvailable: boolean; 
  user: User | null;
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error';
  loading: boolean;
  dailyGoal: number;
  
  wordMap: Map<string, Word>;
  allWords: Word[];
  wordsByTopic: Record<string, string[]>;
  wordsByLevel: Record<string, string[]>;
  
  setView: (view: AppView) => void;
  openModal: (type: ModalType, data?: any) => void;
  closeModal: () => void;
  setMuted: (muted: boolean) => void;
  initialize: (user: User | null) => Promise<void>;
  syncLocalToCloud: () => Promise<void>;
  updateProgress: (wordId: string, quality: FeedbackQuality) => Promise<boolean>;
  addExtraWords: (words: Word[]) => Promise<void>;
  warmupAI: (words: Word[]) => Promise<void>;
  resetIsland: () => void;
}

export const useIslandStore = create<IslandState>((set, get) => {
  const wordMap = new Map<string, Word>();
  const allWords: Word[] = [];
  const wordsByTopic: Record<string, string[]> = {};
  const wordsByLevel: Record<string, string[]> = {};

  const processWord = (w: Word) => {
    wordMap.set(w.id, w);
    allWords.push(w);
    if (!wordsByTopic[w.topic]) wordsByTopic[w.topic] = [];
    wordsByTopic[w.topic].push(w.id);
    if (!wordsByLevel[w.level]) wordsByLevel[w.level] = [];
    wordsByLevel[w.level].push(w.id);
  };

  VOCABULARY_DATA.forEach(day => day.words.forEach(processWord));
  EXTRA_CANDIDATES.forEach(processWord);

  return {
    view: AppView.DASHBOARD,
    activeModal: null,
    modalData: null,
    isMuted: false,
    progress: {},
    stats: { current_streak: 0, last_activity_date: TODAY_SIMULATED, total_words_learned: 0 },
    aiCache: {},
    isAIAvailable: !!process.env.API_KEY,
    user: null,
    syncStatus: 'idle',
    loading: true,
    dailyGoal: DAILY_GOAL_VALUE,
    wordMap,
    allWords,
    wordsByTopic,
    wordsByLevel,

    setView: (view) => set({ view }),
    openModal: (type, data = null) => set({ activeModal: type, modalData: data }),
    closeModal: () => set({ activeModal: null, modalData: null }),
    setMuted: (isMuted) => {
      storageService.setItem('ssi_muted', isMuted);
      set({ isMuted });
    },

    initialize: async (user) => {
      set({ user, loading: true });
      
      try {
        storageService.initialize();
        const savedAI = storageService.getItem<Record<string, AIWordInfo>>(AI_CACHE_KEY, {});
        let localProgress = storageService.getItem<ProgressMap>(PROGRESS_KEY, {}, ProgressMapSchema);
        let localStats = storageService.getItem<UserStats>(STATS_KEY, {
          current_streak: 0, last_activity_date: TODAY_SIMULATED, total_words_learned: 0
        }, UserStatsSchema);

        set({ 
          progress: localProgress, 
          stats: localStats, 
          aiCache: savedAI,
          loading: false,
          isAIAvailable: !!process.env.API_KEY
        });

        // 🏝️ DEFERRED AUTO-SCAN: Wait longer to ensure UI is ready
        setTimeout(() => {
          const needsAIIds = new Set<string>();
          // Focus on today's packs first (Prioritize what user sees)
          VOCABULARY_DATA.forEach(pack => {
            pack.words.forEach(w => {
              if (!savedAI[w.id]) needsAIIds.add(w.id);
            });
          });
          // Then words in pocket
          Object.keys(localProgress).forEach(id => {
            if (!savedAI[id]) needsAIIds.add(id);
          });

          const needsAIWords = Array.from(needsAIIds)
            .map(id => wordMap.get(id))
            .filter((w): w is Word => !!w);

          if (needsAIWords.length > 0) {
            get().warmupAI(needsAIWords);
          }
        }, 2000);

      } catch (err) {
        set({ loading: false });
      }
    },

    syncLocalToCloud: async () => {},

    warmupAI: async (words: Word[]) => {
      const apiKey = process.env.API_KEY;
      if (!apiKey || words.length === 0) return;

      // 🏝️ Rate Limiting Strategy:
      // Reduce chunk size to 2 and add a 3 second delay between chunks.
      // This helps stay under the ~15 RPM typical free tier limit.
      const CHUNK_SIZE = 2;
      for (let i = 0; i < words.length; i += CHUNK_SIZE) {
        const chunk = words.slice(i, i + CHUNK_SIZE);
        
        // Skip if already processed in this session
        const actualChunk = chunk.filter(w => !get().aiCache[w.id]);
        if (actualChunk.length === 0) continue;

        await Promise.all(actualChunk.map(async (word) => {
          const info = await getAISmartHint(word.s, word.t);
          if (info) {
            set((state) => {
              const updated = { ...state.aiCache, [word.id]: info };
              storageService.setItem(AI_CACHE_KEY, updated);
              return { aiCache: updated };
            });
          }
        }));

        // Delay between chunks to respect rate limits
        if (i + CHUNK_SIZE < words.length) {
          await sleep(3500); 
        }
      }
    },

    updateProgress: async (wordId: string, quality: FeedbackQuality) => {
      const { progress, stats } = get();
      const current = progress[wordId] || { level: 1, nextReviewDate: TODAY_SIMULATED };
      const next = calculateNextProgress(current, quality);
      const newProgress = { ...progress, [wordId]: next };
      set({ progress: newProgress, stats: { ...stats, total_words_learned: Object.keys(newProgress).length } });
      storageService.setItem(PROGRESS_KEY, newProgress);
      return quality === 'forgot' || quality === 'hard';
    },

    addExtraWords: async (words: Word[]) => {
      const { progress, stats } = get();
      const newProgress = { ...progress };
      words.forEach(w => { if (!newProgress[w.id]) newProgress[w.id] = { level: 1, nextReviewDate: TODAY_SIMULATED }; });
      set({ progress: newProgress, stats: { ...stats, total_words_learned: Object.keys(newProgress).length } });
      storageService.setItem(PROGRESS_KEY, newProgress);
      get().warmupAI(words);
    },

    resetIsland: () => {
      storageService.clear();
      window.location.reload();
    }
  };
});
