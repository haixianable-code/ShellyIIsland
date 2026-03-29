
import { create } from 'zustand';
import { Word, UserStats, ProgressMap, UserProfile, FeedbackQuality, Blueprint } from '../types';
import { BLUEPRINTS } from '../data/blueprints';
import { supabase } from '../services/supabaseClient';
import { storageService } from '../services/storageService';
import { calculateNextProgress } from '../utils/srsCore';
import { ProgressMapSchema, UserStatsSchema } from '../schemas/islandSchema';
import { AIWordInfo } from '../services/geminiService';
import { vocabService } from '../services/vocabService';
import { getTodayDateString } from '../constants';

// Persistence Keys
const KEY_PROGRESS = 'hola_word_srs_v4_offline';
const KEY_STATS = 'hola_user_stats_v1_offline';
const KEY_AI_CACHE = 'ssi_ai_content_v2'; // Bumped to v2 for Visual Mnemonics
const KEY_SESSION = 'ssi_session_queue';

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

  // Session Data (Persisted in SessionStorage)
  sessionQueue: Word[];

  blueprints: Blueprint[];
  activeBlueprintId: string;

  // Trial Logic
  trialStatus: 'none' | 'active' | 'expired';
  trialEndsAt: number | null;

  aiUsage: AIUsage;
  mnemonicUsage: AIUsage;

  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;

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
  
  // New: Session Management
  setSessionQueue: (words: Word[]) => void;

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
  
  sessionQueue: [],

  blueprints: BLUEPRINTS,
  activeBlueprintId: 'day1',

  trialStatus: 'none',
  trialEndsAt: null,

  aiUsage: { date: getTodayDateString(), count: 0 },
  mnemonicUsage: { date: getTodayDateString(), count: 0 },

  isSidebarCollapsed: false,

  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

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

  setSessionQueue: (words) => {
    set({ sessionQueue: words });
    sessionStorage.setItem(KEY_SESSION, JSON.stringify(words));
  },

  initialize: async (user) => {
    set({ loading: true, user });
    
    // 1. Sync Load (Settings & Session)
    const isMuted = localStorage.getItem('ssi_muted') === 'true';
    const activeBlueprintId = localStorage.getItem('ssi_active_blueprint') || 'day1';
    
    // Restore Session Queue if page was refreshed
    let sessionQueue: Word[] = [];
    try {
      const storedSession = sessionStorage.getItem(KEY_SESSION);
      if (storedSession) sessionQueue = JSON.parse(storedSession);
    } catch (e) {
      console.warn("Failed to restore session queue", e);
    }

    // Trial Logic - REMOVED (Moved to backend/profile)
    
    const today = getTodayDateString();
    let aiUsage = storageService.getItem('ssi_ai_usage', { date: today, count: 0 });
    let mnemonicUsage = storageService.getItem('ssi_mnemonic_usage', { date: today, count: 0 });

    if (aiUsage.date !== today) aiUsage = { date: today, count: 0 };
    if (mnemonicUsage.date !== today) mnemonicUsage = { date: today, count: 0 };

    set({ isMuted, aiUsage, mnemonicUsage, activeBlueprintId, sessionQueue });

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
                
                // Handle Trial Status from Profile
                let trialStatus: 'none' | 'active' | 'expired' = 'none';
                let trialEndsAt: number | null = null;

                if (profile?.trial_ends_at) {
                    trialEndsAt = new Date(profile.trial_ends_at).getTime();
                    if (Date.now() > trialEndsAt) {
                        trialStatus = 'expired';
                    } else {
                        trialStatus = 'active';
                        profile.is_premium = true; // Force premium if trial active
                    }
                }

                set({ profile, trialStatus, trialEndsAt });

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
            // Guest or no user - no trial unless we want to support guest trials (not requested)
        }
    } catch (error) {
        console.error("Initialization Failed:", error);
    } finally {
        set({ loading: false });
    }
  },

  resetIsland: () => { 
      localStorage.clear(); 
      sessionStorage.clear();
      window.location.reload(); 
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
            newProgress[w.id] = { level: 1, nextReviewDate: getTodayDateString(), easeFactor: 2.5, failureCount: 0 };
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

  // AI Usage Logic
  // Free User: 3 daily credits
  // Premium User: 100 lifetime gift credits. Once used, falls back to 3 daily credits (unless they buy more).
  consumeAIToken: () => {
    const { profile, aiUsage } = get();
    const today = getTodayDateString();
    
    let currentUsage = aiUsage;

    // Reset daily counter if new day
    if (aiUsage.date !== today) {
      currentUsage = { date: today, count: 0 };
      set({ aiUsage: currentUsage });
    }

    // 1. Check Daily Limit FIRST (3/day for everyone)
    if (currentUsage.count < 3) {
      const newUsage = { ...currentUsage, count: currentUsage.count + 1 };
      set({ aiUsage: newUsage });
      storageService.setItem('ssi_ai_usage', newUsage);
      return true;
    }

    // 2. If Daily Limit Exceeded, Check Premium Lifetime Allowance
    if (profile?.is_premium) {
      const lifetimeUsed = profile.ai_lifetime_used || 0;
      const lifetimeLimit = 100; // Gifted amount

      if (lifetimeUsed < lifetimeLimit) {
        // Consume lifetime credit
        const newProfile = { ...profile, ai_lifetime_used: lifetimeUsed + 1 };
        set({ profile: newProfile });
        // Sync to Supabase if possible, but don't block
        if (supabase && get().user) {
             supabase.from('profiles').update({ ai_lifetime_used: lifetimeUsed + 1 }).eq('id', get().user.id).then();
        }
        return true;
      }
    }

    return false;
  },

  // Mnemonics share the same pool as other AI features
  consumeMnemonicToken: () => {
      return get().consumeAIToken();
  },

  startSubscriptionCheckout: async () => {
      const { user } = get();
      if (!user) {
          alert("Please login first");
          return;
      }
      set({ loading: true });
      try {
        const res = await fetch('/api/checkout', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ userId: user.id, userEmail: user.email }) 
        });
        const data = await res.json();
        if (data.url) {
            // Open in a new tab to avoid iframe restrictions in the preview environment
            const newWindow = window.open(data.url, '_blank');
            if (!newWindow) {
                alert("Popup blocked! Please allow popups for this site to proceed to checkout.");
            }
        } else {
            throw new Error(data.error || "No URL returned");
        }
      } catch (err: any) { 
          console.error(err);
          alert("Checkout error: " + err.message + "\n\nPlease ensure you have configured the LemonSqueezy API keys in your environment variables."); 
      } finally {
          set({ loading: false });
      }
  },

  activateTrial: async () => {
    const { user } = get();
    if (!user || !supabase) return;
    
    const duration = 3 * 24 * 60 * 60 * 1000;
    const endsAt = new Date(Date.now() + duration).toISOString();
    
    const { error } = await supabase.from('profiles').update({ trial_ends_at: endsAt, is_premium: true }).eq('id', user.id);
    
    if (!error) {
        set((state) => ({ 
            profile: state.profile ? { ...state.profile, trial_ends_at: endsAt, is_premium: true } : null,
            trialStatus: 'active',
            trialEndsAt: Date.now() + duration
        }));
    }
  },

  checkTrialStatus: () => {
    const { profile } = get();
    if (profile?.trial_ends_at) {
        const endsAt = new Date(profile.trial_ends_at).getTime();
        if (Date.now() > endsAt) {
            set((state) => ({ 
                trialStatus: 'expired',
                profile: state.profile ? { ...state.profile, is_premium: false } : null
            }));
        } else {
            set({ trialStatus: 'active', trialEndsAt: endsAt });
        }
    }
  },

  uploadVocabulary: async () => {
      const res = await vocabService.seedDatabaseFromLocal();
      return res.message;
  }
}));
