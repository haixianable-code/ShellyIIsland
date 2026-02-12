
import { useMemo } from 'react';
import { useIslandStore } from '../store/useIslandStore';
import { Word, SRSData } from '../types';
import { VOCABULARY_DATA, EXTRA_CANDIDATES, TODAY_SIMULATED } from '../constants';

const DAILY_GOAL = 20;

export const useSRS = () => {
  const store = useIslandStore();
  
  const getNormalizedDate = (dateStr: string) => new Date(dateStr).setHours(0, 0, 0, 0);
  const todayTimestamp = getNormalizedDate(TODAY_SIMULATED);

  // Deriving data purely from store state with explicit types to ensure downstream inference
  const allAvailableWords = useMemo<Word[]>(() => Array.from(store.wordMap.values()), [store.wordMap]);

  // FIX: Added learnedWords to track all words that have progress data in the user's pocket
  const learnedWords = useMemo<Word[]>(() => {
    return Object.keys(store.progress)
      .map(id => store.wordMap.get(id))
      .filter((w): w is Word => w !== undefined);
  }, [store.progress, store.wordMap]);

  const reviewWords = useMemo<Word[]>(() => {
    return (Object.entries(store.progress) as [string, SRSData][])
      .filter(([_, data]) => data.level > 1 && getNormalizedDate(data.nextReviewDate) <= todayTimestamp)
      .map(([id]) => store.wordMap.get(id))
      .filter((w): w is Word => w !== undefined);
  }, [store.progress, store.wordMap, todayTimestamp]);

  const learnedToday = useMemo<Word[]>(() => {
    return Object.keys(store.progress)
      .map(id => store.wordMap.get(id))
      .filter((w): w is Word => w !== undefined)
      .filter(w => {
          const stats = store.progress[w.id];
          return stats && getNormalizedDate(stats.nextReviewDate) > todayTimestamp;
      });
  }, [store.progress, todayTimestamp, store.wordMap]);

  const newWordsForToday = useMemo<Word[]>(() => {
    const activeManualWords = (Object.entries(store.progress) as [string, SRSData][])
      .filter(([_, data]) => data.level === 1)
      .map(([id]) => store.wordMap.get(id))
      .filter((w): w is Word => w !== undefined);

    if (activeManualWords.length > 0) return activeManualWords;
    if (learnedToday.length >= DAILY_GOAL) return [];

    for (const dayPack of VOCABULARY_DATA) {
      const unlearnedInPack = dayPack.words.filter(w => !store.progress[w.id]);
      if (unlearnedInPack.length > 0) return unlearnedInPack;
    }
    return [];
  }, [store.progress, store.wordMap, learnedToday]);

  const unlearnedExtraWords = useMemo<Word[]>(() => {
    return EXTRA_CANDIDATES.filter(w => !store.progress[w.id]);
  }, [store.progress]);

  return {
    progress: store.progress,
    allAvailableWords,
    learnedWords,
    reviewWords,
    newWordsForToday,
    unlearnedExtraWords,
    learnedToday,
    updateProgress: store.updateProgress,
    wordMap: store.wordMap,
    addExtraWordsToProgress: store.addExtraWords,
    loadingSrs: store.loading,
    syncStatus: store.syncStatus,
  };
};
