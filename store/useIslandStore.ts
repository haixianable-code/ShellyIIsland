
import { create } from 'zustand';
import { Word, UserStats, ProgressMap, UserProfile, FeedbackQuality, Blueprint } from '../types';
import { BLUEPRINTS } from '../data/blueprints';
import { supabase } from '../services/supabaseClient';
import { storageService } from '../services/storageService';
import { calculateNextProgress } from '../utils/srsCore';
import { ProgressMapSchema, UserStatsSchema } from '../schemas/islandSchema';
import { AIWordInfo } from '../services/geminiService';
import { vocabService } from '../services/vocabService';

const LEMON_VARIANT_ID = '384976';

// Persistence Keys
const KEY_PROGRESS = 'hola_word_srs_v4_offline';
const KEY_STATS = 'hola_user_stats_v1_offline';
const KEY_AI_CACHE = 'ssi_ai_content_v1';

interface AIUsage {
  date: string;
  count: number;
}

interface IslandState {
  isMuted: boolean;
  loading: boolean;
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error';
  activeModal: string | null;
  modalData: any;

  user: any;
  profile: UserProfile | null;
  progress: ProgressMap;
  stats: UserStats;
  aiCache: Record<string, AIWordInfo>;
  
  wordMap: Map<string, Word>;
  allWords: Word[];
  
  // Helpers for filtering (Computed)
  wordsByTopic: Record<string, string[]>;
  wordsByLevel: Record<string, string[]>;

  blueprints: Blueprint[];
  activeBlueprintId: string;

  // Trial Logic
  trialStatus: 'none' | 'active' | 'expired';
  trialEndsAt: number | null;

  aiUsage: AIUsage;
  mnemonicUsage: AIUsage;

  setMuted: (muted: boolean) => void;
  openModal: (modal: string, data?: any) => void;
  closeModal: () => void;
  initialize: (user: any) => Promise<void>;
  resetIsland: () => void;
  
  updateProgress: (wordId: string, quality: FeedbackQuality) => Promise<boolean>;
  setActiveBlueprint: (id: string) => void;
  addExtraWords: (words: Word[]) => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  
  consumeAIToken: () => boolean;
  consumeMnemonicToken: () => boolean;
  startSubscriptionCheckout: () => Promise<void>;
  
  activateTrial: () => void;
  checkTrialStatus: () => void;
  
  // Admin Action
  uploadVocabulary: () => Promise<string>;
}

export const useIslandStore = create<IslandState>((set, get) => ({
  isMuted: false,
  loading: true,
  syncStatus: 'idle',
  activeModal: null,
  modalData: null,
  
  user: null,
  profile: null,
  progress: {},
  stats: { current_streak: 0, last_activity_date: new Date().toISOString(), total_words_learned: 0 },
  aiCache: {},
  
  wordMap: new Map(),
  allWords: [],
  wordsByTopic: {},
  wordsByLevel: {},

  blueprints: BLUEPRINTS,
  activeBlueprintId: 'vital_existence',

  trialStatus: 'none',
  trialEndsAt: null,

  aiUsage: { date: new Date().toISOString().split('T')[0], count: 0 },
  mnemonicUsage: { date: new Date().toISOString().split('T')[0], count: 0 },

  setMuted: (muted) => {
    set({ isMuted: muted });
    localStorage.setItem('ssi_muted', String(muted));
  },
  
  openModal: (modal, data = null) => set({ activeModal: modal, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: null }),

  setActiveBlueprint: (id) => {
    set({ activeBlueprintId: id });
    localStorage.setItem('ssi_active_blueprint', id);
  },

  initialize: async (user) => {
    set({ loading: true, user });
    
    // 1. Sync Load (Settings)
    const isMuted = localStorage.getItem('ssi_muted') === 'true';
    const activeBlueprintId = localStorage.getItem('ssi_active_blueprint') || 'vital_existence';
    
    // Trial Logic
    const storedTrialStatus = localStorage.getItem('ssi_trial_status') as 'none'|'active'|'expired' || 'none';
    const storedTrialEnd = localStorage.getItem('ssi_trial_end');
    let trialEndsAt = storedTrialEnd ? parseInt(storedTrialEnd) : null;
    let trialStatus = storedTrialStatus;

    if (trialStatus === 'active' && trialEndsAt && Date.now() > trialEndsAt) {
      trialStatus = 'expired';
      localStorage.setItem('ssi_trial_status', 'expired');
    }

    const today = new Date().toISOString().split('T')[0];
    let aiUsage = storageService.getItem('ssi_ai_usage', { date: today, count: 0 });
    let mnemonicUsage = storageService.getItem('ssi_mnemonic_usage', { date: today, count: 0 });

    if (aiUsage.date !== today) aiUsage = { date: today, count: 0 };
    if (mnemonicUsage.date !== today) mnemonicUsage = { date: today, count: 0 };

    set({ isMuted, aiUsage, mnemonicUsage, activeBlueprintId, trialStatus, trialEndsAt });

    try {
        // 2. Fetch Vocabulary (Cloud First, Local Fallback)
        const words = await vocabService.getAllWords();
        const wordMap = new Map<string, Word>();
        const wordsByTopic: Record<string, string[]> = {};
        const wordsByLevel: Record<string, string[]> = {};

        words.forEach(w => {
            wordMap.set(w.id, w);
            
            if (!wordsByTopic[w.topic]) wordsByTopic[w.topic] = [];
            wordsByTopic[w.topic].push(w.id);

            if (!wordsByLevel[w.level]) wordsByLevel[w.level] = [];
            wordsByLevel[w.level].push(w.id);
        });

        set({ allWords: words, wordMap, wordsByTopic, wordsByLevel });

        // 3. Async Load (Heavy Data) from IndexedDB
        const [progress, stats, aiCache] = await Promise.all([
            storageService.getItemAsync(KEY_PROGRESS, {}, ProgressMapSchema),
            storageService.getItemAsync(KEY_STATS, { current_streak: 0, last_activity_date: new Date().toISOString(), total_words_learned: 0 }, UserStatsSchema),
            storageService.getItemAsync(KEY_AI_CACHE, {})
        ]);

        set({ progress, stats, aiCache });

        // 4. Supabase Sync (if user)
        if (user && supabase) {
            set({ syncStatus: 'syncing' });
            try {
                let { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
                if (!profile) {
                    const { data: newProfile, error } = await supabase.from('profiles').upsert({ id: user.id }).select().single();
                    if (!error) profile = newProfile;
                }
                
                if (profile && trialStatus === 'active') {
                  profile.is_premium = true;
                }

                set({ profile });
                const { data: cloudProgress } = await supabase.from('user_word_choices').select('*').eq('user_id', user.id);
                if (cloudProgress && cloudProgress.length > 0) {
                    const cloudMap: ProgressMap = {};
                    cloudProgress.forEach((row: any) => {
                        cloudMap[row.word_id] = { level: row.level, nextReviewDate: row.next_review_date, easeFactor: row.ease_factor, failureCount: row.failure_count };
                    });
                    const mergedProgress = { ...progress, ...cloudMap };
                    const mergedStats = { ...stats, total_words_learned: Object.keys(mergedProgress).length };
                    
                    set({ progress: mergedProgress, stats: mergedStats });
                    
                    storageService.setItemAsync(KEY_PROGRESS, mergedProgress);
                    storageService.setItemAsync(KEY_STATS, mergedStats);
                }
                set({ syncStatus: 'synced' });
            } catch (e) {
                console.error("Sync error", e);
                set({ syncStatus: 'error' });
            }
        } else {
            if (trialStatus === 'active') {
               set({ profile: { is_premium: true } as any });
            }
        }
    } catch (error) {
        console.error("Initialization Failed:", error);
    } finally {
        set({ loading: false });
    }
  },

  resetIsland: () => { 
      localStorage.clear(); 
      window.location.reload(); 
  },

  activateTrial: () => {
    const duration = 3 * 24 * 60 * 60 * 1000;
    const endsAt = Date.now() + duration;
    localStorage.setItem('ssi_trial_status', 'active');
    localStorage.setItem('ssi_trial_end', endsAt.toString());
    const { profile } = get();
    const updatedProfile = profile ? { ...profile, is_premium: true } : { is_premium: true } as any;
    set({ trialStatus: 'active', trialEndsAt: endsAt, profile: updatedProfile });
  },

  checkTrialStatus: () => {
    const { trialStatus, trialEndsAt, profile } = get();
    if (trialStatus === 'active' && trialEndsAt && Date.now() > trialEndsAt) {
        localStorage.setItem('ssi_trial_status', 'expired');
        const updatedProfile = profile ? { ...profile, is_premium: false } : null;
        set({ trialStatus: 'expired', profile: updatedProfile });
    }
  },

  updateProgress: async (wordId, quality) => {
    const { progress, stats, user } = get();
    const currentData = progress[wordId] || { level: 0, nextReviewDate: new Date().toISOString(), easeFactor: 2.5, failureCount: 0 };
    const nextData = calculateNextProgress(currentData, quality);
    const newProgress = { ...progress, [wordId]: nextData };
    let newStats = { ...stats };
    if (currentData.level === 0 && nextData.level > 0) newStats.total_words_learned += 1;
    newStats.last_activity_date = new Date().toISOString();

    set({ progress: newProgress, stats: newStats });
    
    storageService.setItemAsync(KEY_PROGRESS, newProgress);
    storageService.setItemAsync(KEY_STATS, newStats);

    if (user && supabase) {
        supabase.from('user_word_choices').upsert({ user_id: user.id, word_id: wordId, level: nextData.level, next_review_date: nextData.nextReviewDate, ease_factor: nextData.easeFactor, failure_count: nextData.failureCount, updated_at: new Date().toISOString() });
    }
    return quality === 'forgot' || quality === 'hard';
  },

  addExtraWords: (words) => {
    const { progress } = get();
    const newProgress = { ...progress };
    words.forEach(w => {
        if (!newProgress[w.id]) {
            newProgress[w.id] = { level: 1, nextReviewDate: new Date().toISOString().split('T')[0], easeFactor: 2.5, failureCount: 0 };
        }
    });
    set({ progress: newProgress });
    storageService.setItemAsync(KEY_PROGRESS, newProgress);
  },

  updateProfile: async (updates) => {
    const { user, profile } = get();
    if (!user || !supabase) return;
    const newProfile = { ...profile, ...updates } as UserProfile;
    set({ profile: newProfile });
    await supabase.from('profiles').update(updates).eq('id', user.id);
  },

  consumeAIToken: () => {
    const { profile, aiUsage } = get();
    if (profile?.is_premium) return true;
    if (aiUsage.count >= 3) return false;
    const newUsage = { ...aiUsage, count: aiUsage.count + 1 };
    set({ aiUsage: newUsage });
    storageService.setItem('ssi_ai_usage', newUsage);
    return true;
  },

  consumeMnemonicToken: () => {
    const { profile, mnemonicUsage } = get();
    if (profile?.is_premium) return true;
    if (mnemonicUsage.count >= 5) return false;
    const newUsage = { ...mnemonicUsage, count: mnemonicUsage.count + 1 };
    set({ mnemonicUsage: newUsage });
    storageService.setItem('ssi_mnemonic_usage', newUsage);
    return true;
  },

  startSubscriptionCheckout: async () => {
      const { user } = get();
      if (!user) return; 
      try {
        const res = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId: LEMON_VARIANT_ID, userId: user.id, userEmail: user.email }) });
        const data = await res.json();
        if (data.url) window.location.href = data.url;
      } catch (err) { alert("Checkout error"); }
  },

  // NEW: Admin Action (Updated to return result without auto-reloading)
  uploadVocabulary: async () => {
      const res = await vocabService.seedDatabaseFromLocal();
      // Previously, this function reloaded the page automatically.
      // Now we return the message so the UI component can handle the notification first.
      return res.message;
  }
}));
