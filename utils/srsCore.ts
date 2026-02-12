
import { FeedbackQuality, SRSData } from '../types';
import { SRS_INTERVALS, TODAY_SIMULATED } from '../constants';

/**
 * 核心 SRS 算法：计算下一个复习等级和日期
 * 这是一个纯函数，非常适合进行单元测试
 */
export const calculateNextProgress = (
  currentData: SRSData, 
  quality: FeedbackQuality,
  baseDate: string = TODAY_SIMULATED
): SRSData => {
  let newLevel = currentData.level;
  const isBrandNew = currentData.level === 1;

  // 等级跃迁逻辑
  switch (quality) {
    case 'easy': 
      newLevel += 2; 
      break;
    case 'good': 
      newLevel += 1; 
      break;
    case 'hard': 
      newLevel = Math.max(1, newLevel - 1); 
      break;
    case 'forgot': 
      newLevel = 1; 
      break;
  }

  // 边界约束
  newLevel = Math.max(1, Math.min(newLevel, SRS_INTERVALS.length - 1));

  // 日期计算逻辑
  let nextReviewInDays = (quality === 'hard' || quality === 'forgot') 
    ? (isBrandNew ? 1 : 0) // 刚开始背错，明天复习；已经背过的词突然忘了，立刻重背
    : SRS_INTERVALS[newLevel];

  const date = new Date(baseDate);
  date.setDate(date.getDate() + nextReviewInDays);
  
  return {
    level: newLevel,
    nextReviewDate: date.toISOString().split('T')[0] // 仅保留日期部分
  };
};

/**
 * 模拟复习曲线（用于开发调试）
 */
export const simulateLearningCurve = (wordId: string, streak: FeedbackQuality[]) => {
  let current: SRSData = { level: 1, nextReviewDate: TODAY_SIMULATED };
  console.group(`Learning Curve Simulation for: ${wordId}`);
  streak.forEach((q, i) => {
    current = calculateNextProgress(current, q, current.nextReviewDate);
    console.log(`Day ${i+1}: Quality=${q} -> New Level=${current.level}, Next Review=${current.nextReviewDate}`);
  });
  console.groupEnd();
  return current;
};
