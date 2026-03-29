
import React from 'react';
import SEO from './SEO';
import { useIslandStore } from '../store/useIslandStore';
import { useSRS } from '../hooks/useSRS';
import StatsHUD from './dashboard/StatsHUD';
import ActionConsole from './dashboard/ActionConsole';
import BlueprintMap from './dashboard/BlueprintMap';
import { Cloud, TreePalm, Flame, Zap, Trophy, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { profile, blueprints, activeBlueprintId, setActiveBlueprint, openModal, stats, progress } = useIslandStore();
  const { reviewWords, newWordsForToday, learnedToday } = useSRS();
  
  const isPremium = profile?.is_premium;

  const handleOpenReview = () => openModal('REVIEW_NOW');
  const handleOpenStudy = () => openModal('STUDY_NOW');
  const handleExplore = () => openModal('DAILY_HARVEST');
  const handleLockClick = () => openModal('SUBSCRIPTION');

  return (
    <div className="min-h-screen pb-24 md:pb-10 relative overflow-hidden">
      <SEO title="Command Center" description="Your Spanish evolution progress." url="https://ssisland.space/" />

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-br from-[#8bc34a]/10 to-transparent rounded-full blur-3xl" />
         <Cloud className="absolute top-[10%] right-[5%] text-[#4b7d78]/5 animate-float-slow" size={140} />
         <TreePalm className="absolute bottom-[20%] left-[-5%] text-[#78c850]/10 animate-sway rotate-12" size={300} />
      </div>

      <div className="relative z-10 space-y-8">
        
        {/* SINGLE COLUMN LAYOUT */}
        <div className="max-w-3xl mx-auto space-y-8">
          
          {/* Action Console (Hero) */}
          <ActionConsole 
            reviewCount={reviewWords.length}
            newCount={newWordsForToday.length}
            streak={stats.current_streak}
            onReview={handleOpenReview}
            onStudy={handleOpenStudy}
            onExplore={handleExplore}
          />

          {/* Learning Map (Critterpedia Style) */}
          <div className="bg-white/80 rounded-[3rem] p-6 md:p-8 border-4 border-white shadow-sm backdrop-blur-sm">
             <div className="flex items-center justify-between mb-8 px-2">
               <h3 className="text-xl font-black text-[#2d4a47] flex items-center gap-3">
                 <div className="bg-[#ffa600] p-2 rounded-xl text-white shadow-sm">
                   <Zap size={20} />
                 </div>
                 {t('ui.dashboard.roadmap')}
               </h3>
               
               {/* Mini Stats Badge */}
               <div className="flex items-center gap-3">
                 <div className="bg-[#fff8e1] px-4 py-2 rounded-2xl border-2 border-[#ffecb3] flex items-center gap-2">
                    <Flame size={16} className="text-[#f57c00]" />
                    <span className="font-black text-[#f57c00]">{stats.current_streak}</span>
                 </div>
                 <div className="bg-[#e8f5e9] px-4 py-2 rounded-2xl border-2 border-[#c8e6c9] flex items-center gap-2">
                    <Trophy size={16} className="text-[#4b7d78]" />
                    <span className="font-black text-[#4b7d78]">{stats.total_words_learned}</span>
                 </div>
               </div>
             </div>
             
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
    </div>
  );
};

export default Dashboard;
