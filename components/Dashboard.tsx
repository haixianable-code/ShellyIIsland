
import React from 'react';
import SEO from './SEO';
import { useIslandStore } from '../store/useIslandStore';
import { useSRS } from '../hooks/useSRS';
import TacticalWorkbench from './dashboard/TacticalWorkbench';
import { Cloud, TreePalm } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { openModal, stats } = useIslandStore();
  const { reviewWords, newWordsForToday } = useSRS();
  
  const handleOpenReview = () => openModal('REVIEW_NOW');
  const handleOpenStudy = () => openModal('STUDY_NOW');
  const handleExplore = () => openModal('DAILY_HARVEST');

  return (
    <div className="min-h-screen pb-24 md:pb-10 relative overflow-hidden bg-slate-50">
      <SEO title="Tactical Ops" description="Your Spanish evolution progress." url="https://ssisland.space/" />

      {/* Background Ambience (Subtle) */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-br from-emerald-50 to-transparent rounded-full blur-3xl" />
         <Cloud className="absolute top-[10%] right-[5%] text-slate-200 animate-float-slow" size={140} />
      </div>

      <div className="relative z-10 h-full">
        <TacticalWorkbench 
          reviewCount={reviewWords.length}
          newCount={newWordsForToday.length}
          streak={stats.current_streak}
          onReview={handleOpenReview}
          onStudy={handleOpenStudy}
          onExplore={handleExplore}
        />
      </div>
    </div>
  );
};

export default Dashboard;
