
import React from 'react';
import SEO from './SEO';
import { useIslandStore } from '../store/useIslandStore';
import { useSRS } from '../hooks/useSRS';
import StatsHUD from './dashboard/StatsHUD';
import ActionConsole from './dashboard/ActionConsole';
import BlueprintMap from './dashboard/BlueprintMap';
import { Cloud, TreePalm } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { profile, blueprints, activeBlueprintId, setActiveBlueprint, openModal, stats, progress } = useIslandStore();
  const { reviewWords, newWordsForToday, learnedToday } = useSRS();
  
  const isPremium = profile?.is_premium;

  const handleOpenReview = () => {
    openModal('REVIEW_NOW');
  };

  const handleOpenStudy = () => {
    openModal('STUDY_NOW');
  };

  const handleExplore = () => {
    // Green State Action: Open Vocabulary/Pocket for now, or expansion
    openModal('DAILY_HARVEST'); // Or redirect to pocket
  };

  const handleLockClick = () => {
    openModal('SUBSCRIPTION');
  };

  return (
    <div className="min-h-screen pb-24 md:pb-10 relative overflow-hidden">
      <SEO title="Command Center" description="Your Spanish evolution progress." url="https://ssisland.space/" />

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-br from-[#8bc34a]/10 to-transparent rounded-full blur-3xl" />
         <Cloud className="absolute top-[10%] right-[5%] text-[#4b7d78]/5 animate-float-slow" size={140} />
         <TreePalm className="absolute bottom-[20%] left-[-5%] text-[#78c850]/10 animate-sway rotate-12" size={300} />
      </div>

      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        
        {/* 1. HUD: Identity & Stats */}
        <StatsHUD stats={stats} profile={profile} />

        {/* 2. CORE: Action Console (The One Thing) */}
        <div className="px-4">
          <ActionConsole 
            reviewCount={reviewWords.length}
            newCount={newWordsForToday.length}
            streak={stats.current_streak}
            onReview={handleOpenReview}
            onStudy={handleOpenStudy}
            onExplore={handleExplore}
          />
        </div>

        {/* 3. MAP: Strategy & Progress */}
        <div className="px-4 md:px-8">
           <BlueprintMap 
             blueprints={blueprints}
             progress={progress}
             activeId={activeBlueprintId}
             isPremium={isPremium}
             onSelect={(bp) => setActiveBlueprint(bp.id)}
             onLockClick={handleLockClick}
           />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;