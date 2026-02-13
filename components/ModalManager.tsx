import React from 'react';
import { useIslandStore } from '../store/useIslandStore';
import WordDetailModal from './WordDetailModal';
import StreakModal from './StreakModal';
import DailyHarvestModal from './DailyHarvestModal';
import SyncCompleteModal from './SyncCompleteModal';
import ProfileEntryModal from './ProfileEntryModal';
import ReturningWelcomeModal from './ReturningWelcomeModal';
import AchievementShareModal from './AchievementShareModal';
import SubscriptionModal from './SubscriptionModal';
import { useSRS } from '../hooks/useSRS';

const ModalManager: React.FC = () => {
  const { activeModal, modalData, closeModal, stats, progress, updateProfile } = useIslandStore();
  const { learnedToday, learnedWords, reviewWords, newWordsForToday } = useSRS();

  if (!activeModal) return null;

  switch (activeModal) {
    case 'WORD_DETAIL':
      return <WordDetailModal word={modalData} onClose={closeModal} />;
    
    case 'STREAK':
      return <StreakModal streak={stats.current_streak} words={learnedWords} onClose={closeModal} />;
    
    case 'DAILY_HARVEST':
      return (
        <DailyHarvestModal 
          words={learnedToday}
          progress={progress}
          onClose={closeModal}
          onWordClick={(w) => useIslandStore.getState().openModal('WORD_DETAIL', w)}
          onStartBlitz={(words) => {
             closeModal();
          }}
        />
      );

    case 'SYNC_COMPLETE':
      return <SyncCompleteModal onClose={closeModal} />;

    case 'PROFILE_ENTRY':
      return <ProfileEntryModal onSave={async (name) => { await updateProfile({ traveler_name: name }); closeModal(); }} />;

    case 'RETURNING_WELCOME':
      return (
        <ReturningWelcomeModal 
          name={modalData?.name || 'Traveler'}
          reviewsCount={reviewWords.length}
          newSeedsCount={newWordsForToday.length}
          streak={stats.current_streak}
          onEnter={closeModal}
        />
      );

    case 'ACHIEVEMENT':
      return (
        <AchievementShareModal 
          name={modalData?.name || 'Traveler'}
          totalWords={stats.total_words_learned}
          streak={stats.current_streak}
          onClose={closeModal}
        />
      );

    case 'SUBSCRIPTION':
      return <SubscriptionModal onClose={closeModal} />;

    default:
      return null;
  }
};

export default ModalManager;