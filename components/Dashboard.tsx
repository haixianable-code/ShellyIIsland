
import React, { useMemo } from 'react';
import SEO from './SEO';
import { useIslandStore } from '../store/useIslandStore';
import { useSRS } from '../hooks/useSRS';
import { useTranslation } from 'react-i18next';
import { Lock, Flame, BookOpen, RotateCcw, Compass, ArrowRight, Cloud, TreePalm } from 'lucide-react';
import { Blueprint, ProgressMap } from '../types';
import { playClick } from '../utils/sfx';

// ─── Helpers ────────────────────────────────────────────────
const pct = (learned: number, total: number) => total === 0 ? 0 : Math.round((learned / total) * 100);
const phaseLabel = (p: number, isZh: boolean) => {
  const en = ['Core Foundations', 'Daily & Survival', 'Advanced Contexts', 'Fluency & Nuance'];
  const zh = ['核心基础 (免费)', '日常与生存', '进阶与探索', '流利与细节'];
  return (isZh ? zh[p] : en[p]) ?? `Phase ${p}`;
};
const phaseAccent = (p: number) => (['#d4a843', '#5a9e6f', '#4a8ab5', '#9b72b0'] as const)[p] ?? '#888';

// ─── Global Progress ──────────────────────────────────────────
const GlobalProgress: React.FC<{ totalLearned: number; totalTarget: number }> = ({ totalLearned, totalTarget }) => {
  const p = Math.min(100, Math.round((totalLearned / totalTarget) * 100));
  return (
    <div className="px-4 py-3 bg-white/50 rounded-2xl mb-6">
      <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
        <span>Global Progress</span>
        <span>{totalLearned} / {totalTarget} words</span>
      </div>
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <div className="h-full bg-[#5a9e6f] transition-all duration-500" style={{ width: `${p}%` }} />
      </div>
    </div>
  );
};

// ─── Blueprint Row ──────────────────────────────────────────────
const BpRow: React.FC<{
  bp: Blueprint;
  progress: ProgressMap;
  isActive: boolean;
  isLocked: boolean;
  onSelect: () => void;
  onLock: () => void;
}> = ({ bp, progress, isActive, isLocked, onSelect, onLock }) => {
  const learned = bp.wordIds.filter(id => !!progress[id]).length;
  const total = bp.wordIds.length;
  const p = pct(learned, total);
  const accent = phaseAccent(bp.phase);
  const { i18n } = useTranslation();
  const isZh = i18n.language.startsWith('zh');

  return (
    <button
      onClick={() => { playClick(); isLocked ? onLock() : onSelect(); }}
      className={`w-full text-left group transition-all duration-150 ${isActive ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
    >
      <div className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${isActive ? 'bg-white/80 border-2 border-[#e0d9b4] shadow-sm' : 'hover:bg-white/60 hover:shadow-sm'}`}>
        <div className="relative shrink-0 w-10 h-10">
          <svg viewBox="0 0 40 40" className="w-10 h-10 -rotate-90">
            <circle cx="20" cy="20" r="16" fill="none" stroke="#e8e8e0" strokeWidth="3" />
            <circle
              cx="20" cy="20" r="16" fill="none"
              stroke={isLocked ? '#ccc' : accent}
              strokeWidth="3"
              strokeDasharray={`${2 * Math.PI * 16}`}
              strokeDashoffset={`${2 * Math.PI * 16 * (1 - p / 100)}`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.4s ease' }}
            />
          </svg>
          {isLocked ? <Lock size={14} className="absolute inset-0 m-auto text-slate-300" /> : <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-slate-500">{p}%</span>}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className={`text-sm font-black truncate ${isActive ? 'text-[#2d4a47]' : 'text-slate-600'}`}>{bp.title.zh || bp.title.en}</span>
            <span className="text-[10px] font-bold text-slate-400 tabular-nums">{learned} / {total}</span>
          </div>
          {isActive && <p className="text-[10px] text-slate-500 mt-0.5">{isZh ? bp.purpose.zh : bp.purpose.en}</p>}
          {isLocked && bp.previewTopics && bp.previewTopics.en.length > 0 && (
            <p className="text-[10px] text-slate-400 mt-0.5 italic">
              {isZh ? '解锁预告: ' : 'Unlock preview: '}
              {isZh ? bp.previewTopics.zh.join(', ') : bp.previewTopics.en.join(', ')}
            </p>
          )}
        </div>
      </div>
    </button>
  );
};

const Dashboard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isChinese = i18n.language.startsWith('zh');
  const { profile, blueprints, activeBlueprintId, setActiveBlueprint, openModal, stats, progress } = useIslandStore();
  const { reviewWords, newWordsForToday, blueprintProgress } = useSRS();
  
  const isPremium = profile?.is_premium;
  const name = profile?.traveler_name || 'Learner';
  const level = Math.floor(stats.total_words_learned / 50) + 1;

  const phases = useMemo(() => {
    const g: Record<number, Blueprint[]> = {};
    blueprints.forEach(bp => { (g[bp.phase] ??= []).push(bp); });
    return Object.entries(g).map(([k, v]) => ({ phase: parseInt(k), bps: v }));
  }, [blueprints]);

  const cta = useMemo(() => {
    if (reviewWords.length > 0) return { label: isChinese ? '开始复习' : 'Review', sub: `${reviewWords.length} ${isChinese ? '个单词到期' : 'words due'}`, icon: RotateCcw, color: '#e05a4e', action: () => openModal('REVIEW_NOW') };
    if (newWordsForToday.length > 0) return { label: isChinese ? '开始学习' : 'Study', sub: `${newWordsForToday.length} ${isChinese ? '个新单词' : 'new words'}`, icon: BookOpen, color: '#5a9e6f', action: () => openModal('STUDY_NOW') };
    return { label: isChinese ? '深度学习' : 'Deep Learning', sub: isChinese ? '今日任务已完成' : 'Daily tasks complete', icon: TreePalm, color: '#4a8ab5', action: () => openModal('DEEP_LEARNING') };
  }, [reviewWords, newWordsForToday, isChinese, openModal]);

  const CtaIcon = cta.icon;

  const activeBp = blueprints.find(bp => bp.id === activeBlueprintId);
  const nextBp = blueprints.find(bp => bp.phase === (activeBp?.phase || 0) && bp.id !== activeBlueprintId && !progress[bp.wordIds[0]]);

  return (
    <div className="min-h-screen pb-24 md:pb-12 bg-[#f7f9e4]">
      <SEO title="Dashboard" description="Your Spanish learning overview." url="https://ssisland.space/" />
      
      <div className="fixed inset-0 pointer-events-none z-0">
         <Cloud className="absolute top-[10%] right-[5%] text-[#4b7d78]/5 animate-float-slow" size={140} />
         <TreePalm className="absolute bottom-[20%] left-[-5%] text-[#78c850]/10 animate-sway rotate-12" size={300} />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 pt-8 space-y-8 animate-fadeIn">
        <GlobalProgress totalLearned={stats.total_words_learned} totalTarget={1292} />
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4b7d78]/60 mb-1">Lv.{level} · {name}</p>
            <h1 className="text-2xl font-black text-[#2d4a47] leading-none tracking-tight">{isChinese ? '今日任务' : "Today's Mission"}</h1>
          </div>
          <div className="flex items-center gap-1.5 bg-white border-2 border-[#e0d9b4] shadow-sm rounded-full px-3 py-1.5">
            <Flame size={14} className={stats.current_streak > 0 ? 'text-[#f57c00] fill-[#f57c00]' : 'text-slate-300'} />
            <span className="text-sm font-black text-[#f57c00] tabular-nums">{stats.current_streak}</span>
            <span className="text-[10px] font-bold text-[#f5a23a] uppercase tracking-wide">days</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: isChinese ? '总词汇' : 'Total', value: stats.total_words_learned },
            { label: isChinese ? '今日复习' : 'Review', value: reviewWords.length, alert: reviewWords.length > 0 },
            { label: isChinese ? '今日新词' : 'New', value: newWordsForToday.length },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-[2rem] border-4 border-transparent shadow-[0_10px_20px_-5px_rgba(0,0,0,0.05)] p-4 text-center">
              <div className={`text-2xl font-black tabular-nums leading-none mb-1 ${s.alert ? 'text-[#e05a4e]' : 'text-[#2d4a47]'}`}>{s.value}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>

        <button
          onClick={() => { playClick(); cta.action(); }}
          className="w-full flex items-center justify-between px-6 py-6 rounded-[2.5rem] text-white font-black text-lg shadow-[0_10px_20px_-5px_rgba(0,0,0,0.15)] hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.2)] transition-all active:scale-[0.98] active:translate-y-1"
          style={{ background: cta.color }}
        >
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-2xl"><CtaIcon size={24} strokeWidth={2.5} /></div>
            <div className="text-left">
              <div className="text-xl font-black leading-none">{cta.label}</div>
              <div className="text-xs font-bold opacity-80 mt-1">{cta.sub}</div>
            </div>
          </div>
          <ArrowRight size={24} strokeWidth={2.5} className="opacity-70" />
        </button>

        <div className="space-y-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400 px-1">{isChinese ? '学习路线' : 'Learning path'}</p>
          {phases.map(({ phase, bps }) => (
            <div key={phase} className="space-y-2">
              <h3 className="text-sm font-black uppercase tracking-widest px-1 mb-3" style={{ color: phaseAccent(phase) }}>{phaseLabel(phase, isChinese)}</h3>
              <div className="space-y-1">
                {bps.map(bp => (
                  <BpRow
                    key={bp.id}
                    bp={bp}
                    progress={progress}
                    isActive={activeBlueprintId === bp.id}
                    isLocked={(!isPremium && phase > 0) || (bp.isPremium && !isPremium)}
                    onSelect={() => setActiveBlueprint(bp.id)}
                    onLock={() => openModal('SUBSCRIPTION')}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
