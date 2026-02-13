
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

  // Learned words are those present in the progress map
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
    // 1. Priority: Active Level 1 words (Manual adds, Crate items, Leftovers)
    // These should bypass the Daily Goal limit because the user explicitly acquired them 
    // or left them unfinished.
    const activeManualWords = (Object.entries(store.progress) as [string, SRSData][])
      .filter(([_, data]) => data.level === 1)
      .map(([id]) => store.wordMap.get(id))
      .filter((w): w is Word => w !== undefined);

    // If we have active words, serve them immediately (up to a reasonable session limit like 20)
    if (activeManualWords.length > 0) {
        return activeManualWords.slice(0, 20);
    }

    // 2. Only if no active words, check Daily Goal for auto-filling new words from packs
    const wordsNeeded = DAILY_GOAL - learnedToday.length;
    if (wordsNeeded <= 0) return [];

    let sessionQueue: Word[] = [];

    // 3. Fetch new words from packs to fill the quota
    for (const dayPack of VOCABULARY_DATA) {
        // Find words in this pack that have NO progress record yet
        const unlearnedInPack = dayPack.words.filter(w => !store.progress[w.id]);
        
        // Calculate space left in the current session queue
        const spaceLeft = wordsNeeded - sessionQueue.length;
        
        if (unlearnedInPack.length > 0) {
            // Add as many as needed/available
            sessionQueue.push(...unlearnedInPack.slice(0, spaceLeft));
        }

        if (sessionQueue.length >= wordsNeeded) break;
    }

    // 4. Return exactly enough to hit the goal
    return sessionQueue;
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
