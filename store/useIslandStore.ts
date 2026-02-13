
import { create } from 'zustand';
import { AppView, Word, FeedbackQuality, ProgressMap, UserStats, UserProfile, SRSData } from '../types';
import { storageService } from '../services/storageService';
import { TODAY_SIMULATED, VOCABULARY_DATA, EXTRA_CANDIDATES } from '../constants';
import { calculateNextProgress } from '../utils/srsCore';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { User } from '@supabase/supabase-js';
import { ProgressMapSchema, UserStatsSchema } from '../schemas/islandSchema';
import { getAISmartHint, AIWordInfo } from '../services/geminiService';

const PROGRESS_KEY = 'hola_word_srs_v4_offline'; 
const STATS_KEY = 'hola_user_stats_v1_offline';
const AI_CACHE_KEY = 'ssi_ai_content_v1';
const AI_USAGE_KEY = 'ssi_ai_usage_v1';
const MNEMONIC_USAGE_KEY = 'ssi_mnemonic_usage_v1';
const DAILY_GOAL_VALUE = 20;
const DAILY_AI_LIMIT = 3;
const DAILY_MNEMONIC_LIMIT = 5;

// Replace this with your actual Variant ID from Lemon Squeezy Dashboard
const LEMON_VARIANT_ID = 'YOUR_VARIANT_ID_HERE'; 

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

export type ModalType = 'WORD_DETAIL' | 'STREAK' | 'DAILY_HARVEST' | 'SYNC_COMPLETE' | 'PROFILE_ENTRY' | 'RETURNING_WELCOME' | 'ACHIEVEMENT' | 'SUBSCRIPTION' | 'FEEDBACK';

interface IslandState {
  view: AppView;
  activeModal: ModalType | null;
  modalData: any;
  isMuted: boolean;
  progress: ProgressMap;
  stats: UserStats;
  profile: UserProfile | null;
  aiCache: Record<string, AIWordInfo>;
  aiUsage: { date: string; count: number }; // Track challenge usage
  mnemonicUsage: { date: string; count: number }; // Track mnemonic reveals
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
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  syncLocalToCloud: () => Promise<void>;
  updateProgress: (wordId: string, quality: FeedbackQuality) => Promise<boolean>;
  addExtraWords: (words: Word[]) => Promise<void>;
  warmupAI: (words: Word[], isBackground?: boolean) => Promise<void>;
  consumeAIToken: () => boolean; // Returns true if allowed
  consumeMnemonicToken: () => boolean; // Returns true if allowed
  resetIsland: () => void;
  startSubscriptionCheckout: () => Promise<void>;
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

  const DEFAULT_SRS: SRSData = { level: 1, nextReviewDate: TODAY_SIMULATED, easeFactor: 2.5, failureCount: 0 };

  return {
    view: AppView.DASHBOARD,
    activeModal: null,
    modalData: null,
    isMuted: false,
    progress: {},
    stats: { current_streak: 0, last_activity_date: TODAY_SIMULATED, total_words_learned: 0 },
    profile: null,
    aiCache: {},
    aiUsage: { date: TODAY_SIMULATED, count: 0 },
    mnemonicUsage: { date: TODAY_SIMULATED, count: 0 },
    isAIAvailable: false, 
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
        
        // Initialize Usage tracking
        let localAiUsage = storageService.getItem(AI_USAGE_KEY, { date: TODAY_SIMULATED, count: 0 });
        if (localAiUsage.date !== TODAY_SIMULATED) {
            localAiUsage = { date: TODAY_SIMULATED, count: 0 };
            storageService.setItem(AI_USAGE_KEY, localAiUsage);
        }

        let localMnemonicUsage = storageService.getItem(MNEMONIC_USAGE_KEY, { date: TODAY_SIMULATED, count: 0 });
        if (localMnemonicUsage.date !== TODAY_SIMULATED) {
            localMnemonicUsage = { date: TODAY_SIMULATED, count: 0 };
            storageService.setItem(MNEMONIC_USAGE_KEY, localMnemonicUsage);
        }

        let localProgress = storageService.getItem<ProgressMap>(PROGRESS_KEY, {}, ProgressMapSchema);
        let localStats = storageService.getItem<UserStats>(STATS_KEY, {
          current_streak: 0, last_activity_date: TODAY_SIMULATED, total_words_learned: 0
        }, UserStatsSchema);

        if (user && supabase) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();
          
          if (profileData) {
            set({ profile: profileData });
            if (!profileData.traveler_name || profileData.traveler_name.includes('@')) {
               get().openModal('PROFILE_ENTRY');
            }
          } else {
            set({ profile: null });
            get().openModal('PROFILE_ENTRY');
          }

          const { data: cloudData, error } = await supabase
            .from('user_word_choices')
            .select('word_id, srs_level, next_review, ease_factor, failure_count')
            .eq('user_id', user.id);

          if (!error && cloudData) {
            const cloudProgress: ProgressMap = {};
            cloudData.forEach((row: any) => {
              cloudProgress[row.word_id] = {
                level: row.srs_level,
                nextReviewDate: row.next_review.split('T')[0],
                easeFactor: row.ease_factor ?? 2.5,
                failureCount: row.failure_count ?? 0
              };
            });
            localProgress = { ...localProgress, ...cloudProgress };
            storageService.setItem(PROGRESS_KEY, localProgress);
          }
        }

        set({ 
          progress: localProgress, 
          stats: localStats, 
          aiCache: savedAI,
          aiUsage: localAiUsage,
          mnemonicUsage: localMnemonicUsage,
          loading: false,
          isAIAvailable: !!process.env.API_KEY,
          syncStatus: user ? 'synced' : 'idle'
        });
      } catch (err) {
        set({ loading: false, syncStatus: 'error' });
      }
    },

    updateProfile: async (updates) => {
      const { user } = get();
      if (!user || !supabase) return;
      const { data, error } = await supabase
        .from('profiles')
        .upsert({ id: user.id, ...updates, updated_at: new Date().toISOString() })
        .select().single();
      if (!error && data) set({ profile: data });
    },

    syncLocalToCloud: async () => {
      const { user, progress } = get();
      if (!user || !supabase) return;
      set({ syncStatus: 'syncing' });
      const entries = (Object.entries(progress) as [string, SRSData][]).map(([wordId, data]) => ({
        user_id: user.id,
        word_id: wordId,
        srs_level: data.level,
        next_review: new Date(data.nextReviewDate).toISOString(),
        ease_factor: data.easeFactor,
        failure_count: data.failureCount,
        last_studied: new Date().toISOString()
      }));
      const { error } = await supabase
        .from('user_word_choices')
        .upsert(entries, { onConflict: 'user_id,word_id' });
      set({ syncStatus: error ? 'error' : 'synced' });
    },

    updateProgress: async (wordId, quality) => {
      const { progress, stats, user } = get();
      const current = progress[wordId] || DEFAULT_SRS;
      const next = calculateNextProgress(current, quality);
      const newProgress = { ...progress, [wordId]: next };
      const newStats = { ...stats, total_words_learned: Object.keys(newProgress).length };
      
      set({ progress: newProgress, stats: newStats });
      storageService.setItem(PROGRESS_KEY, newProgress);
      storageService.setItem(STATS_KEY, newStats);

      if (user && supabase) {
        set({ syncStatus: 'syncing' });
        supabase.from('user_word_choices').upsert({
          user_id: user.id,
          word_id: wordId,
          srs_level: next.level,
          next_review: new Date(next.nextReviewDate).toISOString(),
          ease_factor: next.easeFactor,
          failure_count: next.failureCount,
          last_studied: new Date().toISOString()
        }, { onConflict: 'user_id,word_id' }).then(({ error }) => {
          set({ syncStatus: error ? 'error' : 'synced' });
        });
      }
      return quality === 'forgot' || quality === 'hard';
    },

    consumeAIToken: () => {
        const { aiUsage, profile } = get();
        if (profile?.is_premium) return true;

        if (aiUsage.date !== TODAY_SIMULATED) {
            const newUsage = { date: TODAY_SIMULATED, count: 1 };
            set({ aiUsage: newUsage });
            storageService.setItem(AI_USAGE_KEY, newUsage);
            return true;
        }

        if (aiUsage.count >= DAILY_AI_LIMIT) return false;

        const newUsage = { ...aiUsage, count: aiUsage.count + 1 };
        set({ aiUsage: newUsage });
        storageService.setItem(AI_USAGE_KEY, newUsage);
        return true;
    },

    consumeMnemonicToken: () => {
        const { mnemonicUsage, profile } = get();
        if (profile?.is_premium) return true;

        if (mnemonicUsage.date !== TODAY_SIMULATED) {
            const newUsage = { date: TODAY_SIMULATED, count: 1 };
            set({ mnemonicUsage: newUsage });
            storageService.setItem(MNEMONIC_USAGE_KEY, newUsage);
            return true;
        }

        if (mnemonicUsage.count >= DAILY_MNEMONIC_LIMIT) return false;

        const newUsage = { ...mnemonicUsage, count: mnemonicUsage.count + 1 };
        set({ mnemonicUsage: newUsage });
        storageService.setItem(MNEMONIC_USAGE_KEY, newUsage);
        return true;
    },

    warmupAI: async (words, isBackground = false) => {
        const apiKey = process.env.API_KEY;
        const { profile } = get();
        
        // 1. If background warmup, ONLY do it for Premium users to save costs.
        // Free users must manually trigger "Reveal" to fetch.
        if (isBackground && !profile?.is_premium) return;

        if (!apiKey || words.length === 0) return;
        const targets = words.filter(w => !get().aiCache[w.id]);
        if (targets.length === 0) return;
        const batch = isBackground ? targets.slice(0, 5) : targets;
        for (const word of batch) {
          if (get().aiCache[word.id]) continue;
          const info = await getAISmartHint(word.s, word.t);
          if (info) {
            set((state) => {
              const updated = { ...state.aiCache, [word.id]: info };
              storageService.setItem(AI_CACHE_KEY, updated);
              return { aiCache: updated };
            });
            await sleep(8000);
          } else {
            await sleep(30000);
          }
        }
    },

    addExtraWords: async (words) => {
      const { progress, stats, user } = get();
      const newProgress = { ...progress };
      const updates: any[] = [];
      words.forEach(w => { 
        if (!newProgress[w.id]) {
          newProgress[w.id] = DEFAULT_SRS;
          if (user) {
            updates.push({
              user_id: user.id, word_id: w.id, srs_level: 1,
              next_review: new Date(TODAY_SIMULATED).toISOString(),
              ease_factor: 2.5, failure_count: 0
            });
          }
        }
      });
      set({ progress: newProgress, stats: { ...stats, total_words_learned: Object.keys(newProgress).length } });
      storageService.setItem(PROGRESS_KEY, newProgress);
      if (user && updates.length > 0 && supabase) {
        supabase.from('user_word_choices').upsert(updates, { onConflict: 'user_id,word_id' }).then(() => {
          set({ syncStatus: 'synced' });
        });
      }
      get().warmupAI(words, false);
    },

    resetIsland: () => {
      storageService.clear();
      window.location.reload();
    },

    startSubscriptionCheckout: async () => {
      const { user } = get();
      if (!user) return; 
      
      try {
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            productId: LEMON_VARIANT_ID, 
            userId: user.id,
            userEmail: user.email 
          })
        });
        
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url; 
        } else {
          console.error("Checkout failed", data);
          alert("Could not start checkout. Please try again.");
        }
      } catch (err) {
        console.error(err);
        alert("Network error starting checkout.");
      }
    }
  };
});
