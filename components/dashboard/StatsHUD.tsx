
import React from 'react';
import { UserStats, UserProfile } from '../../types';
import { Flame, ShieldCheck, Crown, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface StatsHUDProps {
  stats: UserStats;
  profile: UserProfile | null;
}

const StatsHUD: React.FC<StatsHUDProps> = ({ stats, profile }) => {
  const { t } = useTranslation();
  const isPremium = profile?.is_premium;
  const level = Math.floor(stats.total_words_learned / 50) + 1;

  return (
    <div className="flex items-center justify-between px-4 py-2 relative z-20">
      {/* Identity Anchor */}
      <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md p-2 pr-5 rounded-full border-2 border-white shadow-sm">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 border-white shadow-sm ${isPremium ? 'bg-gradient-to-br from-amber-300 to-orange-400' : 'bg-gradient-to-br from-[#78c850] to-[#4b7d78]'}`}>
          {isPremium ? <Crown size={18} className="text-white fill-white/20" /> : <User size={18} className="text-white" />}
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase text-[#8d99ae] tracking-widest leading-none mb-0.5">
            {t('ui.passport.id_number')} {level}
          </span>
          <span className="text-xs font-black text-[#4b7d78] uppercase leading-none tracking-tight">
            {profile?.traveler_name || 'Survivor'}
          </span>
        </div>
      </div>

      {/* Streak Capsule */}
      <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md px-4 py-2 rounded-full border-2 border-white shadow-sm">
        <Flame size={18} className={`${stats.current_streak > 0 ? 'text-[#ffa600] fill-[#ffa600]' : 'text-slate-300'} animate-pulse`} />
        <span className="text-sm font-black text-[#4b7d78] tabular-nums">
          {stats.current_streak} <span className="text-[9px] uppercase text-[#8d99ae] ml-1">Days</span>
        </span>
      </div>
    </div>
  );
};

export default StatsHUD;
