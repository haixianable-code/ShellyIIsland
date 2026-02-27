
import { useMemo } from 'react';
import { useIslandStore } from '../store/useIslandStore';
import { Word, SRSData, Blueprint } from '../types';
import { getTodayDateString } from '../constants';

const DAILY_GOAL = 15;

export const useSRS = () => {
  const store = useIslandStore();
  const isPremium = store.profile?.is_premium;
  const activeBlueprintId = store.activeBlueprintId;
  
  // Dynamic date calculation
  const todayStr = getTodayDateString();
  const getNormalizedDate = (dateStr: string) => new Date(dateStr).setHours(0, 0, 0, 0);
  const todayTimestamp = getNormalizedDate(todayStr);

  const allAvailableWords = useMemo<Word[]>(() => Array.from(store.wordMap.values()), [store.wordMap]);

  const reviewWords = useMemo<Word[]>(() => {
    return (Object.entries(store.progress) as [string, SRSData][])
      .filter(([_, data]) => data.level > 1 && getNormalizedDate(data.nextReviewDate) <= todayTimestamp)
      .map(([id]) => store.wordMap.get(id))
      .filter((w): w is Word => w !== undefined);
  }, [store.progress, store.wordMap, todayTimestamp]);

  // Added learnedWords to fix ModalManager property missing error
  const learnedWords = useMemo<Word[]>(() => {
    return Object.keys(store.progress)
      .map(id => store.wordMap.get(id))
      .filter((w): w is Word => w !== undefined);
  }, [store.progress, store.wordMap]);

  const learnedToday = useMemo<Word[]>(() => {
    return Object.keys(store.progress)
      .map(id => store.wordMap.get(id))
      .filter((w): w is Word => w !== undefined)
      .filter(w => {
          const stats = store.progress[w.id];
          return stats && getNormalizedDate(stats.nextReviewDate) > todayTimestamp;
      });
  }, [store.progress, todayTimestamp, store.wordMap]);

  // 计算当前蓝图的进度
  const blueprintProgress = useMemo(() => {
    const blueprint = store.blueprints.find(b => b.id === activeBlueprintId);
    if (!blueprint) return 0;
    const learnedInBlueprint = blueprint.wordIds.filter(id => !!store.progress[id]).length;
    return Math.round((learnedInBlueprint / blueprint.wordIds.length) * 100);
  }, [store.progress, activeBlueprintId, store.blueprints]);

  const newWordsForToday = useMemo<Word[]>(() => {
    const activeBlueprint = store.blueprints.find(b => b.id === activeBlueprintId);
    if (!activeBlueprint) return [];

    // 限制：如果是非会员且蓝图是高级的，无法开始新学习
    if (!isPremium && activeBlueprint.isPremium) return [];

    const wordsInBlueprint = activeBlueprint.wordIds
      .map(id => store.wordMap.get(id))
      .filter((w): w is Word => w !== undefined);

    const unlearnedInBlueprint = wordsInBlueprint.filter(w => !store.progress[w.id]);
    
    return unlearnedInBlueprint.slice(0, DAILY_GOAL);
  }, [store.progress, store.wordMap, learnedToday, isPremium, activeBlueprintId, store.blueprints]);

  return {
    progress: store.progress,
    allAvailableWords,
    reviewWords,
    newWordsForToday,
    learnedToday,
    learnedWords, // Exported to fix ModalManager error
    blueprintProgress,
    activeBlueprint: store.blueprints.find(b => b.id === activeBlueprintId),
    loadingSrs: store.loading,
    syncStatus: store.syncStatus,
  };
};
