
import { FeedbackQuality, SRSData } from '../types';
import { SRS_INTERVALS, TODAY_SIMULATED } from '../constants';

/**
 * 升级版核心 SRS 算法 (SM-2 启发式)
 * 利用 easeFactor 和 failureCount 计算更精准的复习时间
 */
export const calculateNextProgress = (
  currentData: SRSData, 
  quality: FeedbackQuality,
  baseDate: string = TODAY_SIMULATED
): SRSData => {
  // 1. 初始化默认值（防空保护）
  let { level, easeFactor = 2.5, failureCount = 0 } = currentData;
  const isBrandNew = level === 1;

  // 2. 更新 Easy Factor 和 错误计数
  if (quality === 'forgot') {
    failureCount += 1;
    easeFactor = Math.max(1.3, easeFactor - 0.2);
    level = 1; // 忘记了就打回原型
  } else if (quality === 'hard') {
    easeFactor = Math.max(1.3, easeFactor - 0.15);
    level = Math.max(1, level - 1);
  } else if (quality === 'easy') {
    easeFactor = Math.min(3.0, easeFactor + 0.15);
    level += 2;
  } else {
    // 'good'
    level += 1;
  }

  // 3. 边界约束
  level = Math.max(1, Math.min(level, SRS_INTERVALS.length - 1));

  // 4. 计算下一次复习间隔 (天)
  // 如果是错词，固定 1 天或 0 天（取决于业务逻辑）
  // 如果是正常词，根据 Level 和 EaseFactor 动态计算
  let nextReviewInDays = SRS_INTERVALS[level];
  
  if (quality === 'forgot' || quality === 'hard') {
    nextReviewInDays = isBrandNew ? 1 : 0; 
  } else {
    // 对已经掌握较好的词，根据简易度系数放大间隔
    nextReviewInDays = Math.round(nextReviewInDays * (easeFactor / 2.5));
  }

  const date = new Date(baseDate);
  date.setDate(date.getDate() + nextReviewInDays);
  
  return {
    level,
    easeFactor: parseFloat(easeFactor.toFixed(2)),
    failureCount,
    nextReviewDate: date.toISOString().split('T')[0]
  };
};
