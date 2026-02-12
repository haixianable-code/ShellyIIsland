
import { create } from 'zustand';
import { AppView, Word, FeedbackQuality, ProgressMap, UserStats } from '../types';
import { storageService } from '../services/storageService';
import { TODAY_SIMULATED, VOCABULARY_DATA, EXTRA_CANDIDATES } from '../constants';
import { calculateNextProgress } from '../utils/srsCore';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { User } from '@supabase/supabase-js';
import { ProgressMapSchema, UserStatsSchema } from '../schemas/islandSchema';
import { useNotificationStore } from './useNotificationStore';
import { getAISmartHint, AIWordInfo } from '../services/geminiService';

const PROGRESS_KEY = 'hola_word_srs_v3_offline';
const STATS_KEY = 'hola_user_stats_v1_offline';
const AI_CACHE_KEY = 'ssi_ai_content_v1';
const DAILY_GOAL_VALUE = 20;

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
    isAIAvailable: true,
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
      const { notify } = useNotificationStore.getState();
      
      try {
        storageService.initialize();
        const isMutedFromStorage = storageService.getItem<boolean>('ssi_muted', false);
        const savedAI = storageService.getItem<Record<string, AIWordInfo>>(AI_CACHE_KEY, {});
        let localProgress = storageService.getItem<ProgressMap>(PROGRESS_KEY, {}, ProgressMapSchema);
        let localStats = storageService.getItem<UserStats>(STATS_KEY, {
          current_streak: 0,
          last_activity_date: TODAY_SIMULATED,
          total_words_learned: 0
        }, UserStatsSchema);

        if (user && isSupabaseConfigured && supabase) {
          set({ syncStatus: 'syncing' });
          try {
            const { data, error } = await supabase
              .from('user_word_choices')
              .select('word_id, srs_level, next_review');
            
            if (error) throw error;
            if (data) {
              const cloudProgress: ProgressMap = {};
              data.forEach(item => {
                cloudProgress[item.word_id] = { level: item.srs_level, nextReviewDate: item.next_review };
              });
              localProgress = { ...localProgress, ...cloudProgress };
              storageService.setItem(PROGRESS_KEY, localProgress);
              set({ syncStatus: 'synced' });
              get().syncLocalToCloud();
            }
          } catch (err: any) {
            set({ syncStatus: 'error' });
          }
        }

        const today = new Date(TODAY_SIMULATED);
        today.setHours(0, 0, 0, 0);
        const lastDate = new Date(localStats.last_activity_date);
        lastDate.setHours(0, 0, 0, 0);
        const diffDays = Math.round((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        
        let newStreak = localStats.current_streak;
        if (diffDays === 1) newStreak += 1;
        else if (diffDays > 1 || newStreak === 0) newStreak = 1;

        const updatedStats = {
          ...localStats,
          current_streak: newStreak,
          last_activity_date: TODAY_SIMULATED,
          total_words_learned: Object.keys(localProgress).length
        };

        set({ 
          progress: localProgress, 
          stats: updatedStats, 
          aiCache: savedAI,
          loading: false, 
          isMuted: isMutedFromStorage 
        });

        storageService.setItem(STATS_KEY, updatedStats);

        // TRIGGER AI WARMUP FOR EXISTING WORDS
        const wordsToWarmup = Object.keys(localProgress)
          .map(id => wordMap.get(id))
          .filter((w): w is Word => w !== undefined && !savedAI[w.id]);
        
        if (wordsToWarmup.length > 0) {
          get().warmupAI(wordsToWarmup);
        }

      } catch (err) {
        set({ loading: false });
      }
    },

    syncLocalToCloud: async () => {
      const { user, progress } = get();
      if (!user || !supabase || !isSupabaseConfigured) return;

      const items = Object.entries(progress).map(([id, data]) => ({
        user_id: user.id,
        word_id: id,
        srs_level: data.level,
        next_review: data.nextReviewDate
      }));

      if (items.length === 0) return;

      supabase.from('user_word_choices').upsert(items)
        .then(({ error }) => {
          if (!error) console.log("🏝️ Cloud background sync successful.");
        });
    },

    warmupAI: async (words: Word[]) => {
      const { aiCache, isAIAvailable } = get();
      if (!isAIAvailable || words.length === 0) return;

      const newCache = { ...get().aiCache };
      let updatedCount = 0;

      // Use a sequential queue to respect API quotas
      for (const word of words) {
        if (!newCache[word.id]) {
          console.debug(`AI Warmup: Generating for ${word.s}`);
          const hint = await getAISmartHint(word.s, word.t);
          if (hint) {
            newCache[word.id] = hint;
            updatedCount++;
            // Update state incrementally so UI feels alive
            set({ aiCache: { ...newCache } });
            storageService.setItem(AI_CACHE_KEY, newCache);
          } else {
            console.debug(`AI Warmup: Failed for ${word.s}, stopping session warmup.`);
            set({ isAIAvailable: false });
            break;
          }
        }
      }
    },

    updateProgress: async (wordId: string, quality: FeedbackQuality) => {
      const { progress, stats, user } = get();
      const { notify } = useNotificationStore.getState();
      
      const currentWordProgress = progress[wordId] || { level: 1, nextReviewDate: TODAY_SIMULATED };
      const next = calculateNextProgress(currentWordProgress, quality);
      
      const newProgress = { ...progress, [wordId]: next };
      const newStats = {
        ...stats,
        total_words_learned: Object.keys(newProgress).length
      };

      set({ progress: newProgress, stats: newStats });
      
      const success = storageService.setItem(PROGRESS_KEY, newProgress);
      if (!success) {
        notify("Island Storage Full!", "error");
      }
      storageService.setItem(STATS_KEY, newStats);

      if (user && isSupabaseConfigured && supabase) {
        supabase.from('user_word_choices').upsert({
          user_id: user.id,
          word_id: wordId,
          srs_level: next.level,
          next_review: next.nextReviewDate
        }).then(({ error }) => {
          if (error) set({ syncStatus: 'error' });
        });
      }

      return quality === 'forgot' || quality === 'hard';
    },

    addExtraWords: async (words: Word[]) => {
      const { progress, stats, user, warmupAI } = get();
      const { notify } = useNotificationStore.getState();
      const newProgress = { ...progress };
      
      words.forEach(w => {
        if (!newProgress[w.id]) {
          newProgress[w.id] = { level: 1, nextReviewDate: TODAY_SIMULATED };
        }
      });

      const newStats = {
        ...stats,
        total_words_learned: Object.keys(newProgress).length
      };

      set({ progress: newProgress, stats: newStats });
      storageService.setItem(PROGRESS_KEY, newProgress);
      storageService.setItem(STATS_KEY, newStats);
      notify(`Collected ${words.length} seeds!`, 'success');

      // Start warming up AI for these specific new words
      get().warmupAI(words);

      if (user && isSupabaseConfigured && supabase) {
        const updates = words.map(w => ({
          user_id: user.id,
          word_id: w.id,
          srs_level: 1,
          next_review: TODAY_SIMULATED
        }));
        await supabase.from('user_word_choices').upsert(updates);
      }
    },

    resetIsland: () => {
      storageService.clear();
      window.location.reload();
    }
  };
});
