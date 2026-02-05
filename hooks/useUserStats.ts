
import { useState, useEffect, useCallback } from 'react';
import { UserStats, ProgressMap } from '../types';
import { TODAY_SIMULATED } from '../constants';

const STATS_KEY = 'hola_user_stats_v1_offline';

export const useUserStats = (progress: ProgressMap) => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [showStreakModal, setShowStreakModal] = useState(false);

  const getNormalizedDate = (date: Date) => {
    const d = new Date(date);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  };

  const checkAndUpdateStreak = useCallback(() => {
    setLoadingStats(true);
    const today = getNormalizedDate(new Date(TODAY_SIMULATED));
    const todayStr = today.toISOString().split('T')[0];
    const totalWordsLearned = Object.keys(progress).length;

    const localData = localStorage.getItem(STATS_KEY);
    let currentStats: UserStats | null = localData ? JSON.parse(localData) : null;
    let updatedStreak = currentStats ? currentStats.current_streak : 0;
    let shouldShowModal = false;

    if (!currentStats) {
      currentStats = {
        current_streak: 1,
        last_activity_date: todayStr,
        total_words_learned: totalWordsLearned
      };
    } else {
      const lastActivityDate = getNormalizedDate(new Date(currentStats.last_activity_date));
      const diffTime = today.getTime() - lastActivityDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        updatedStreak += 1;
        shouldShowModal = true;
      } else if (diffDays > 1) {
        updatedStreak = 1;
      }
      
      if (diffDays > 0 || totalWordsLearned !== currentStats.total_words_learned) {
        currentStats = {
          ...currentStats,
          current_streak: updatedStreak,
          last_activity_date: todayStr,
          total_words_learned: totalWordsLearned
        };
      }
    }
    
    setStats(currentStats);
    localStorage.setItem(STATS_KEY, JSON.stringify(currentStats));

    if (shouldShowModal && updatedStreak > 1) {
      setShowStreakModal(true);
    }
    setLoadingStats(false);
  }, [progress]);

  useEffect(() => {
    checkAndUpdateStreak();
  }, [checkAndUpdateStreak]);

  return { stats, loadingStats, showStreakModal, setShowStreakModal };
};
