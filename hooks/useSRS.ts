
import { useState, useEffect, useMemo, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { Word, SRSData, FeedbackQuality, ProgressMap } from '../types';
import { VOCABULARY_DATA, EXTRA_CANDIDATES, SRS_INTERVALS, TODAY_SIMULATED } from '../constants';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

const STORAGE_KEY = 'hola_word_srs_v3_offline';
const DAILY_GOAL = 20; // Max automatic new words per day

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

  const loadFromLocalStorage = useCallback(() => {
    const localData = localStorage.getItem(STORAGE_KEY);
    if (localData) {
      setProgress(JSON.parse(localData));
    } else {
      const initialProgress: ProgressMap = {};
      setProgress(initialProgress);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProgress));
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      if (!mounted) return;
      setLoading(true);

      if (user && isSupabaseConfigured && supabase) {
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
            loadFromLocalStorage();
            setSyncStatus('error');
          }
        }
      } else {
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

  const reviewWords = useMemo(() => {
    return (Object.entries(progress) as [string, SRSData][])
      .filter(([_, data]) => data.level > 1 && getNormalizedDate(data.nextReviewDate) <= todayTimestamp)
      .map(([id]) => wordMap.get(id))
      .filter((w): w is Word => w !== undefined);
  }, [progress, wordMap, todayTimestamp]);

  const learnedToday = useMemo(() => {
    return Object.keys(progress)
      .map(id => wordMap.get(id))
      .filter((w): w is Word => w !== undefined)
      .filter(w => {
          const stats = progress[w.id];
          // Simple heuristic: if next review is in the future, it was likely interacted with today or recently.
          // For exact "learned today", we'd need a timestamp in the data, but this works for general tracking.
          return stats && getNormalizedDate(stats.nextReviewDate) > todayTimestamp;
      });
  }, [progress, todayTimestamp, wordMap]);

  const newWordsForToday = useMemo(() => {
    // 1. Priority: Manual/Extra words (Supply Crate)
    // If we have any words at Level 1 (just added), show them immediately, ignoring the daily limit.
    const activeManualWords = (Object.entries(progress) as [string, SRSData][])
      .filter(([_, data]) => data.level === 1)
      .map(([id]) => wordMap.get(id))
      .filter((w): w is Word => w !== undefined);

    if (activeManualWords.length > 0) {
      return activeManualWords;
    }

    // 2. Daily Goal Check
    // If user has learned >= 20 words today, STOP automatic progression.
    if (learnedToday.length >= DAILY_GOAL) {
      return [];
    }

    // 3. Automatic Day Progression
    for (const dayPack of VOCABULARY_DATA) {
      const unlearnedInPack = dayPack.words.filter(w => !progress[w.id]);
      
      // If we find unlearned words in this day, return them.
      // This enforces doing Day 1 before Day 2.
      if (unlearnedInPack.length > 0) {
        return unlearnedInPack;
      }
    }

    return [];
  }, [progress, wordMap, learnedToday]);

  const unlearnedExtraWords = useMemo(() => {
    return EXTRA_CANDIDATES.filter(w => !progress[w.id]);
  }, [progress]);

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
