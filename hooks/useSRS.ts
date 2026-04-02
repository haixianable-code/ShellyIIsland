
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
    if (!blueprint || !blueprint.wordIds) return 0;
    const learnedInBlueprint = blueprint.wordIds.filter(id => !!store.progress[id]).length;
    return Math.round((learnedInBlueprint / blueprint.wordIds.length) * 100);
  }, [store.progress, activeBlueprintId, store.blueprints]);

  const newWordsForToday = useMemo<Word[]>(() => {
    const activeBlueprint = store.blueprints.find(b => b.id === activeBlueprintId);
    if (!activeBlueprint || !activeBlueprint.wordIds) return [];

    // 限制：如果是非会员且蓝图是高级的，无法开始新学习
    if (!isPremium && activeBlueprint.isPremium) return [];

    const wordsInBlueprint = activeBlueprint.wordIds
      .map(id => store.wordMap.get(id))
      .filter((w): w is Word => w !== undefined);

    const unlearnedInBlueprint = wordsInBlueprint.filter(w => !store.progress[w.id]);
    
    return unlearnedInBlueprint.slice(0, DAILY_GOAL);
  }, [store.progress, store.wordMap, learnedToday, isPremium, activeBlueprintId, store.blueprints]);

  // 获取需要巩固的弱项词汇 (SRS level <= 2)
  const weakWords = useMemo<Word[]>(() => {
    return (Object.entries(store.progress) as [string, SRSData][])
      .filter(([_, data]) => data.level <= 2)
      .map(([id]) => store.wordMap.get(id))
      .filter((w): w is Word => w !== undefined);
  }, [store.progress, store.wordMap]);

  // 获取下一个蓝图的单词
  const nextBlueprintWords = useMemo<Word[]>(() => {
    const currentIndex = store.blueprints.findIndex(b => b.id === activeBlueprintId);
    const nextBlueprint = store.blueprints[currentIndex + 1];
    if (!nextBlueprint || !nextBlueprint.wordIds) return [];
    return nextBlueprint.wordIds
      .map(id => store.wordMap.get(id))
      .filter((w): w is Word => w !== undefined)
      .filter(w => !store.progress[w.id]);
  }, [store.blueprints, activeBlueprintId, store.progress, store.wordMap]);

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
    weakWords,
    nextBlueprintWords,
  };
};
