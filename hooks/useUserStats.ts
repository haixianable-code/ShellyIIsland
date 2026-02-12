import { useIslandStore } from '../store/useIslandStore';
import { useState } from 'react';

export const useUserStats = () => {
  const stats = useIslandStore(state => state.stats);
  const loading = useIslandStore(state => state.loading);
  const [showStreakModal, setShowStreakModal] = useState(false);

  // The streak check logic is now moved into the store's initialize action
  // This hook just provides the UI state for the streak modal

  return { 
    stats, 
    loadingStats: loading, 
    showStreakModal, 
    setShowStreakModal 
  };
};