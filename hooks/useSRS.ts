
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
    // 1. Calculate how many words are left to reach the daily goal
    const wordsNeeded = DAILY_GOAL - learnedToday.length;
    if (wordsNeeded <= 0) return [];

    // 2. First, retrieve any Level 1 words (In Progress / "Leftovers")
    const activeManualWords = (Object.entries(store.progress) as [string, SRSData][])
      .filter(([_, data]) => data.level === 1)
      .map(([id]) => store.wordMap.get(id))
      .filter((w): w is Word => w !== undefined);

    let sessionQueue = [...activeManualWords];

    // 3. If "Leftovers" aren't enough to fill the session, fetch new words from packs
    if (sessionQueue.length < wordsNeeded) {
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
    }

    // 4. Return exactly enough to hit the goal (or whatever we found)
    return sessionQueue.slice(0, wordsNeeded);
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
