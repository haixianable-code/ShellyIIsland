
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
  const { reviewWords, newWordsForToday } = useSRS();
  
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
        
        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT COL: HERO & MAP (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Action Console (Hero) */}
            <ActionConsole 
              reviewCount={reviewWords.length}
              newCount={newWordsForToday.length}
              streak={stats.current_streak}
              onReview={handleOpenReview}
              onStudy={handleOpenStudy}
              onExplore={handleExplore}
            />

            {/* Learning Map */}
            <div className="bg-white/60 rounded-[2.5rem] p-6 border-2 border-white shadow-sm backdrop-blur-sm">
               <h3 className="text-lg font-black text-[#2d4a47] mb-4 px-2 flex items-center gap-2">
                 <Zap size={20} className="text-[#ffa600]" />
                 {t('ui.dashboard.roadmap')}
               </h3>
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

          {/* RIGHT COL: STATS & EXTRAS (1/3) */}
          <div className="space-y-6">
            {/* Mini Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white p-5 rounded-[2rem] shadow-sm border-2 border-orange-100 flex flex-col items-center justify-center text-center">
                  <Flame size={24} className="text-orange-500 mb-2" />
                  <div className="text-2xl font-black text-slate-800">{stats.current_streak}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Day Streak</div>
               </div>
               <div className="bg-white p-5 rounded-[2rem] shadow-sm border-2 border-blue-100 flex flex-col items-center justify-center text-center">
                  <Trophy size={24} className="text-blue-500 mb-2" />
                  <div className="text-2xl font-black text-slate-800">{stats.total_words_learned}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Words Learned</div>
               </div>
            </div>

            {/* Quick Review Widget */}
            {reviewWords.length > 0 && (
              <div className="bg-[#fff3e0] p-6 rounded-[2.5rem] border-2 border-[#ffe0b2] relative overflow-hidden group cursor-pointer hover:shadow-md transition-all" onClick={handleOpenReview}>
                 <div className="absolute -right-4 -top-4 text-[#ffcc80]/20 rotate-12 group-hover:scale-110 transition-transform">
                    <RotateCcw size={100} />
                 </div>
                 <div className="relative z-10">
                    <div className="text-xs font-black text-[#f57c00] uppercase tracking-widest mb-1">Priority Task</div>
                    <div className="text-xl font-black text-[#e65100] mb-4">Review {reviewWords.length} Words</div>
                    <button className="bg-[#ff9800] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-sm group-hover:bg-[#f57c00] transition-colors">
                       Start Review
                    </button>
                 </div>
              </div>
            )}

            {/* Profile / Status (Simplified HUD) */}
            <StatsHUD stats={stats} profile={profile} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
