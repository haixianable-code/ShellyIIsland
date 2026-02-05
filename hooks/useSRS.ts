import { useState, useMemo, useCallback } from 'react';
import { Word, ProgressMap, SRSData, FeedbackQuality } from '../types';
import { VOCABULARY_DATA, EXTRA_CANDIDATES, SRS_INTERVALS, TODAY_SIMULATED } from '../constants';

// Renamed for clarity to reflect local storage
const LOCAL_STORAGE_KEY = 'hola_word_srs_v3_offline';

export const useSRS = () => {
  const [progress, setProgress] = useState<ProgressMap>(() => {
    try {
      const local = localStorage.getItem(LOCAL_STORAGE_KEY); // Use LOCAL_STORAGE_KEY
      return local ? JSON.parse(local) : {};
    } catch (e) {
      console.error("Local storage read error", e);
      return {};
    }
  });

  // Removed loadingSrs, authChecking, user states

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

  // Removed useEffect for Supabase sync

  const addExtraWordsToProgress = useCallback(async (words: Word[]) => {
    const todayStr = new Date(TODAY_SIMULATED).toISOString().split('T')[0];
    
    setProgress(prev => {
        const newProgressMap = { ...prev };
        let hasChanges = false;

        for (const word of words) {
            if (!prev[word.id]) {
                newProgressMap[word.id] = { level: 1, nextReviewDate: todayStr };
                hasChanges = true;
                // Removed Supabase upsert logic
            }
        }
        
        if (hasChanges) {
             localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newProgressMap)); // Use LOCAL_STORAGE_KEY
        }
        return newProgressMap;
    });
  }, []); // Removed 'user' from dependency array

  const updateProgress = useCallback(async (wordId: string, quality: FeedbackQuality) => {
    let needsRetry = false;
    
    setProgress(prev => {
        const currentData = prev[wordId] || { level: 1, nextReviewDate: TODAY_SIMULATED };
        let newLevel = currentData.level;
        let nextReviewInDays = 0;
        const isBrandNew = currentData.level === 1;

        switch (quality) {
          case 'easy':
            newLevel += 2;
            nextReviewInDays = SRS_INTERVALS[Math.min(newLevel, SRS_INTERVALS.length - 1)];
            break;
          case 'good':
            newLevel += 1;
            nextReviewInDays = SRS_INTERVALS[Math.min(newLevel, SRS_INTERVALS.length - 1)];
            break;
          case 'hard':
            newLevel = Math.max(1, newLevel - 1);
            nextReviewInDays = 0;
            break;
          case 'forgot':
            newLevel = 1;
            nextReviewInDays = 0;
            break;
        }

        if (isBrandNew && nextReviewInDays === 0) {
          nextReviewInDays = 1;
        }

        newLevel = Math.max(1, Math.min(newLevel, SRS_INTERVALS.length - 1));
        const baseDate = new Date(TODAY_SIMULATED);
        baseDate.setDate(baseDate.getDate() + nextReviewInDays);
        const nextDateStr = baseDate.toISOString().split('T')[0];

        const newProgress = { ...prev, [wordId]: { level: newLevel, nextReviewDate: nextDateStr } };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newProgress)); // Use LOCAL_STORAGE_KEY

        // Removed Supabase upsert logic
        
        needsRetry = (quality === 'hard' || quality === 'forgot');
        return newProgress;
    });

    return needsRetry;
  }, []); // Removed 'user' from dependency array

  const reviewWords = useMemo(() => {
    return (Object.entries(progress) as [string, SRSData][])
      .filter(([_, data]) => data.level > 1 && getNormalizedDate(data.nextReviewDate) <= todayTimestamp)
      .map(([id]) => wordMap.get(id))
      .filter((w): w is Word => w !== undefined);
  }, [progress, wordMap, todayTimestamp]);

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
    // Removed loadingSrs, authChecking, user
    hasLocalData: Object.keys(progress).length > 0 // Renamed and simplified
  };
};