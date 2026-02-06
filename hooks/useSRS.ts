import { useState, useEffect, useMemo, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { Word, ProgressMap, SRSData, FeedbackQuality } from '../types';
import { VOCABULARY_DATA, EXTRA_CANDIDATES, SRS_INTERVALS, TODAY_SIMULATED } from '../constants';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

const STORAGE_KEY = 'hola_word_srs_v3_offline';

// The hook now accepts the logged-in user to enable/disable sync
export const useSRS = (user: User | null) => {
  const [progress, setProgress] = useState<ProgressMap>({});
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');

  const wordMap = useMemo(() => {
    const map = new Map<string, Word>();
    VOCABULARY_DATA.forEach(day => {
      day.words.forEach(word => map.set(word.id, word));
    });
    EXTRA_CANDIDATES.forEach(word => map.set(word.id, word));
    return map;
  }, []);

  const allAvailableWords = useMemo(() => Array.from(wordMap.values()), [wordMap]);
  const getNormalizedDate = (dateStr: string) => new Date(dateStr).setHours(0, 0, 0, 0);
  const todayTimestamp = getNormalizedDate(TODAY_SIMULATED);

  // Helper for loading from localStorage, used for guests or as a fallback
  const loadFromLocalStorage = useCallback(() => {
    const localData = localStorage.getItem(STORAGE_KEY);
    if (localData) {
      setProgress(JSON.parse(localData));
    } else {
      // Initial setup for new users
      const initialProgress: ProgressMap = {};
      VOCABULARY_DATA.forEach(day => {
        if (getNormalizedDate(day.date) < todayTimestamp) {
          day.words.forEach(w => {
            initialProgress[w.id] = { level: 2, nextReviewDate: TODAY_SIMULATED };
          });
        }
      });
      setProgress(initialProgress);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProgress));
    }
  }, [todayTimestamp]);

  // Main data loading effect: syncs with Supabase if user is logged in
  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      if (!mounted) return;
      setLoading(true);

      // --- DATA MIGRATION & SYNC LOGIC ---
      if (user && isSupabaseConfigured && supabase) {
        // Step 1: User has logged in. Check for any local (guest) data to migrate.
        const localData = localStorage.getItem(STORAGE_KEY);
        if (localData && localData !== '{}') {
          try {
            const localProgress: ProgressMap = JSON.parse(localData);
            const records = Object.entries(localProgress).map(([word_id, data]) => ({
              user_id: user.id,
              word_id,
              srs_level: data.level,
              next_review: data.nextReviewDate,
            }));

            if (records.length > 0) {
              setSyncStatus('syncing');
              await supabase.from('user_word_choices').upsert(records, { onConflict: 'user_id,word_id' });
            }
          } catch (e) {
            console.error('Failed to migrate local data on login:', e);
          }
        }
        
        // Step 2: Now that migration is done, fetch the canonical data from the cloud.
        setSyncStatus('syncing');
        try {
          const { data, error } = await supabase
            .from('user_word_choices')
            .select('word_id, srs_level, next_review');
          
          if (error) throw error;
          
          if (mounted) {
            const cloudProgress: ProgressMap = {};
            data.forEach(item => {
              cloudProgress[item.word_id] = {
                level: item.srs_level,
                nextReviewDate: item.next_review
              };
            });
            setProgress(cloudProgress);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudProgress));
            setSyncStatus('synced');
          }
        } catch (err) {
          console.error("Supabase fetch failed. Falling back to local data.", err);
          if (mounted) {
            loadFromLocalStorage(); // Graceful fallback
            setSyncStatus('error');
          }
        }
      } else {
        // --- GUEST OR OFFLINE MODE ---
        if (mounted) {
          loadFromLocalStorage();
          setSyncStatus('idle');
        }
      }

      if (mounted) setLoading(false);
    };

    loadData();

    return () => { mounted = false; };
  }, [user, loadFromLocalStorage]);

  // --- Syncing logic for adding words ---
  const addExtraWordsToProgress = useCallback(async (words: Word[]) => {
    const todayStr = new Date(TODAY_SIMULATED).toISOString().split('T')[0];
    const newProgressMap = { ...progress };
    let hasChanges = false;
    const wordsToAdd = [];

    for (const word of words) {
      if (!newProgressMap[word.id]) {
        newProgressMap[word.id] = { level: 1, nextReviewDate: todayStr };
        wordsToAdd.push(word);
        hasChanges = true;
      }
    }

    if (hasChanges) {
      setProgress(newProgressMap);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgressMap));

      // Sync to Supabase if logged in
      if (user && isSupabaseConfigured && supabase && wordsToAdd.length > 0) {
        setSyncStatus('syncing');
        const recordsToUpsert = wordsToAdd.map(word => ({
          user_id: user.id,
          word_id: word.id,
          srs_level: 1,
          next_review: todayStr
        }));
        try {
          const { error } = await supabase.from('user_word_choices').upsert(recordsToUpsert, { onConflict: 'user_id,word_id' });
          if (error) throw error;
          setSyncStatus('synced');
        } catch (err) {
          console.error("Failed to sync new words.", err);
          setSyncStatus('error');
        }
      }
    }
  }, [progress, user]);

  // REVIEW WORDS: Words that are effectively learned (Level > 1) and due today
  const reviewWords = useMemo(() => {
    return (Object.entries(progress) as [string, SRSData][])
      .filter(([_, data]) => data.level > 1 && getNormalizedDate(data.nextReviewDate) <= todayTimestamp)
      .map(([id]) => wordMap.get(id))
      .filter((w): w is Word => w !== undefined);
  }, [progress, wordMap, todayTimestamp]);

  // NEW WORDS: 
  const newWordsForToday = useMemo(() => {
    const dailyDrops = VOCABULARY_DATA
      .filter(day => getNormalizedDate(day.date) === todayTimestamp)
      .flatMap(day => day.words)
      .filter(w => !progress[w.id]);

    const seedPackWords = (Object.entries(progress) as [string, SRSData][])
      .filter(([_, data]) => data.level === 1)
      .map(([id]) => wordMap.get(id))
      .filter((w): w is Word => w !== undefined);

    const uniqueMap = new Map();
    [...dailyDrops, ...seedPackWords].forEach(w => uniqueMap.set(w.id, w));
    return Array.from(uniqueMap.values());
  }, [progress, todayTimestamp, wordMap]);

  const unlearnedExtraWords = useMemo(() => {
    return EXTRA_CANDIDATES.filter(w => !progress[w.id]);
  }, [progress]);

  const learnedToday = useMemo(() => {
    return Object.keys(progress)
      .map(id => wordMap.get(id))
      .filter((w): w is Word => w !== undefined)
      .filter(w => {
          const stats = progress[w.id];
          return stats && getNormalizedDate(stats.nextReviewDate) > todayTimestamp;
      });
  }, [progress, todayTimestamp, wordMap]);

  // --- Syncing logic for updating progress ---
  const updateProgress = useCallback(async (wordId: string, quality: FeedbackQuality) => {
    const currentData = progress[wordId] || { level: 1, nextReviewDate: TODAY_SIMULATED };
    let newLevel = currentData.level;
    const isBrandNew = currentData.level === 1;

    switch (quality) {
      case 'easy': newLevel += 2; break;
      case 'good': newLevel += 1; break;
      case 'hard': newLevel = Math.max(1, newLevel - 1); break;
      case 'forgot': newLevel = 1; break;
    }
    newLevel = Math.max(1, Math.min(newLevel, SRS_INTERVALS.length - 1));

    let nextReviewInDays;
    if (quality === 'hard' || quality === 'forgot') {
      nextReviewInDays = isBrandNew ? 1 : 0;
    } else {
      nextReviewInDays = SRS_INTERVALS[newLevel];
    }
    
    const baseDate = new Date(TODAY_SIMULATED);
    baseDate.setDate(baseDate.getDate() + nextReviewInDays);
    const nextDateStr = baseDate.toISOString();
    
    const newProgress = { ...progress, [wordId]: { level: newLevel, nextReviewDate: nextDateStr } };
    setProgress(newProgress);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));

    // Sync to Supabase if logged in
    if (user && isSupabaseConfigured && supabase) {
      setSyncStatus('syncing');
      try {
        const { error } = await supabase.from('user_word_choices').upsert({
          user_id: user.id,
          word_id: wordId,
          srs_level: newLevel,
          next_review: nextDateStr
        }, { onConflict: 'user_id,word_id' });
        if (error) throw error;
        setSyncStatus('synced');
      } catch (err) {
        console.error("Failed to sync progress update.", err);
        setSyncStatus('error');
      }
    }

    return quality === 'hard' || quality === 'forgot';
  }, [progress, user]);

  return {
    progress,
    allAvailableWords,
    reviewWords,
    newWordsForToday,
    unlearnedExtraWords,
    learnedToday,
    updateProgress,
    wordMap,
    addExtraWordsToProgress,
    loadingSrs: loading,
    syncStatus,
  };
};
