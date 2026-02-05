
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Word, ProgressMap, SRSData, FeedbackQuality } from '../types';
import { VOCABULARY_DATA, EXTRA_CANDIDATES, SRS_INTERVALS, TODAY_SIMULATED } from '../constants';

const STORAGE_KEY = 'hola_word_srs_v2';

export const useSRS = () => {
  const [progress, setProgress] = useState<ProgressMap>({});

  const wordMap = useMemo(() => {
    const map = new Map<string, Word>();
    // Combine both mandatory words and extra candidates
    VOCABULARY_DATA.forEach(day => {
      day.words.forEach(word => map.set(word.id, word));
    });
    EXTRA_CANDIDATES.forEach(word => map.set(word.id, word));
    return map;
  }, []);

  const allAvailableWords = useMemo(() => Array.from(wordMap.values()), [wordMap]);

  const getNormalizedDate = (dateStr: string) => new Date(dateStr).setHours(0, 0, 0, 0);
  const todayTimestamp = getNormalizedDate(TODAY_SIMULATED);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProgress(parsed.progress || {});
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    } else {
      const initialProgress: ProgressMap = {};
      VOCABULARY_DATA.forEach(day => {
        if (getNormalizedDate(day.date) < todayTimestamp) {
          day.words.forEach(w => {
            initialProgress[w.id] = { level: 2, nextReviewDate: TODAY_SIMULATED };
          });
        }
      });
      setProgress(initialProgress);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ progress: initialProgress }));
    }
  }, [todayTimestamp]);

  const saveData = useCallback((newProgress: ProgressMap) => {
    setProgress(newProgress);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ progress: newProgress }));
  }, []);

  const addExtraWordsToProgress = useCallback((words: Word[]) => {
    const newProgressEntries: ProgressMap = {};
    const todayStr = new Date(TODAY_SIMULATED).toISOString().split('T')[0];

    words.forEach(word => {
      if (!progress[word.id]) { // Ensure we don't overwrite existing progress
        newProgressEntries[word.id] = {
          level: 1,
          nextReviewDate: todayStr,
        };
      }
    });

    if (Object.keys(newProgressEntries).length > 0) {
      const updatedProgress = { ...progress, ...newProgressEntries };
      saveData(updatedProgress);
    }
  }, [progress, saveData]);

  // Words due for review
  const reviewWords = useMemo(() => {
    return (Object.entries(progress) as [string, SRSData][])
      .filter(([_, data]) => getNormalizedDate(data.nextReviewDate) <= todayTimestamp)
      .map(([id]) => wordMap.get(id))
      .filter((w): w is Word => w !== undefined);
  }, [progress, wordMap, todayTimestamp]);

  // Words available to learn today (mandatory date-based seeds)
  const newWordsForToday = useMemo(() => {
    return VOCABULARY_DATA
      .filter(day => getNormalizedDate(day.date) === todayTimestamp)
      .flatMap(day => day.words)
      .filter(w => !progress[w.id]);
  }, [progress, todayTimestamp]);

  // Extra words currently not learned
  const unlearnedExtraWords = useMemo(() => {
    return EXTRA_CANDIDATES.filter(w => !progress[w.id]);
  }, [progress]);

  // Words that were learned today
  const learnedToday = useMemo(() => {
    // Collect all words currently in progress
    return Object.keys(progress)
      .map(id => wordMap.get(id))
      .filter((w): w is Word => w !== undefined)
      // Filter for those that match today's date in vocabulary or were added today
      // (Simplified: showing everything learned so far today for dashboard summary)
      .filter(w => {
          const stats = progress[w.id];
          return stats && getNormalizedDate(stats.nextReviewDate) > todayTimestamp;
      });
  }, [progress, todayTimestamp, wordMap]);

  const updateProgress = useCallback((wordId: string, quality: FeedbackQuality) => {
    const currentData = progress[wordId] || { level: 1, nextReviewDate: TODAY_SIMULATED };
    let newLevel = currentData.level;
    let nextReviewInDays = 0;

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

    newLevel = Math.max(1, Math.min(newLevel, SRS_INTERVALS.length - 1));
    const baseDate = new Date(TODAY_SIMULATED);
    baseDate.setDate(baseDate.getDate() + nextReviewInDays);
    const nextDateStr = baseDate.toISOString().split('T')[0];
    
    const newProgress = {
      ...progress,
      [wordId]: { level: newLevel, nextReviewDate: nextDateStr }
    };

    saveData(newProgress);
    return quality === 'hard' || quality === 'forgot';
  }, [progress, saveData]);

  return {
    progress,
    allAvailableWords,
    reviewWords,
    newWordsForToday,
    unlearnedExtraWords,
    learnedToday,
    updateProgress,
    wordMap,
    addExtraWordsToProgress
  };
};
