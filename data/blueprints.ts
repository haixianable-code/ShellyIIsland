
import { Blueprint } from '../types';
import { VOCABULARY_DATA } from './courseData';

// 1. Flatten and deduplicate all words from the legacy DayPacks
const allSources = VOCABULARY_DATA.flatMap(d => d.words);
const uniqueWords = new Map();
allSources.forEach(w => uniqueWords.set(w.id, w));
const ALL_WORDS = Array.from(uniqueWords.values());

// 2. Define the Path -> Blueprint mapping
// 4 Paths x 4 Blueprints/Path = 16 Blueprints
// Each Blueprint = 20 words
const BLUEPRINT_CONFIG = [
  // Path 1: 🚀 快速上手 (Survivalist) - Phase 0
  { id: 'bp_grammar', topic: 'grammar', path: 1, icon: 'BookOpen', title: { en: 'Grammar & Connectors', zh: '语法与连接词' }, purpose: { en: 'Understand how sentences are built.', zh: '理解句子是如何构建的。' }, previewTopics: { en: ['Time & Frequency'], zh: ['时间与频率'] } },
  { id: 'bp_time', topic: 'time', path: 1, icon: 'Clock', title: { en: 'Time & Frequency', zh: '时间与频率' }, purpose: { en: 'Master temporal markers.', zh: '掌握时间标记。' }, previewTopics: { en: ['Daily Life'], zh: ['日常起居'] } },
  { id: 'bp_daily', topic: 'daily', path: 1, icon: 'Home', title: { en: 'Daily Life', zh: '日常起居' }, purpose: { en: 'Handle daily routines.', zh: '处理日常琐事。' }, previewTopics: { en: ['Social & People'], zh: ['社交与人际'] } },
  { id: 'bp_social', topic: 'social', path: 1, icon: 'Users', title: { en: 'Social & People', zh: '社交与人际' }, purpose: { en: 'Connect with others.', zh: '与他人建立联系。' }, previewTopics: { en: ['Work & Study'], zh: ['工作与学习'] } },

  // Path 2: 💼 职场社会 (Professional) - Phase 1
  { id: 'bp_work', topic: 'work', path: 2, icon: 'Briefcase', title: { en: 'Work & Study', zh: '工作与学习' }, purpose: { en: 'Navigate professional environments.', zh: '在职场环境中游刃有余。' }, previewTopics: { en: ['Tech & Tools'], zh: ['科技与工具'] } },
  { id: 'bp_tech', topic: 'tech', path: 2, icon: 'Smartphone', title: { en: 'Tech & Tools', zh: '科技与工具' }, purpose: { en: 'Master digital communication.', zh: '掌握数字交流。' }, previewTopics: { en: ['Society & Culture'], zh: ['社会与文化'] } },
  { id: 'bp_society', topic: 'society', path: 2, icon: 'Building2', title: { en: 'Society & Culture', zh: '社会与文化' }, purpose: { en: 'Understand cultural contexts.', zh: '理解文化背景。' }, previewTopics: { en: ['Abstract Concepts'], zh: ['抽象概念'] } },
  { id: 'bp_abstract', topic: 'abstract', path: 2, icon: 'Brain', title: { en: 'Abstract Concepts', zh: '抽象概念' }, purpose: { en: 'Express complex ideas.', zh: '表达复杂思想。' }, previewTopics: { en: ['Feelings & Emotions'], zh: ['情感与状态'] } },

  // Path 3: 🧠 深度表达 (Fluent) - Phase 2
  { id: 'bp_feelings', topic: 'feelings', path: 3, icon: 'Heart', title: { en: 'Feelings & Emotions', zh: '情感与状态' }, purpose: { en: 'Articulate inner states.', zh: '清晰表达内心状态。' }, previewTopics: { en: ['Food & Dining'], zh: ['饮食与味觉'] } },
  { id: 'bp_food', topic: 'food', path: 3, icon: 'Coffee', title: { en: 'Food & Dining', zh: '饮食与味觉' }, purpose: { en: 'Enjoy culinary experiences.', zh: '享受烹饪与美食体验。' }, previewTopics: { en: ['Body & Health'], zh: ['身体与健康'] } },
  { id: 'bp_body', topic: 'body', path: 3, icon: 'Activity', title: { en: 'Body & Health', zh: '身体与健康' }, purpose: { en: 'Maintain physical well-being.', zh: '维护身体健康。' }, previewTopics: { en: ['Life & Habits'], zh: ['生活与习惯'] } },
  { id: 'bp_life', topic: 'life', path: 3, icon: 'Sprout', title: { en: 'Life & Habits', zh: '生活与习惯' }, purpose: { en: 'Cultivate healthy habits.', zh: '培养健康生活习惯。' }, previewTopics: { en: ['Travel & Navigation'], zh: ['旅行与导航'] } },

  // Path 4: 🌍 探索者 (Explorer) - Phase 3
  { id: 'bp_travel', topic: 'travel', path: 4, icon: 'Compass', title: { en: 'Travel & Navigation', zh: '旅行与导航' }, purpose: { en: 'Explore the world.', zh: '探索世界。' }, previewTopics: { en: ['Nature & Environment'], zh: ['自然与环境'] } },
  { id: 'bp_nature', topic: 'nature', path: 4, icon: 'Mountain', title: { en: 'Nature & Environment', zh: '自然与环境' }, purpose: { en: 'Appreciate the natural world.', zh: '欣赏自然世界。' }, previewTopics: { en: ['Art & Media'], zh: ['艺术与媒体'] } },
  { id: 'bp_art', topic: 'art', path: 4, icon: 'Palette', title: { en: 'Art & Media', zh: '艺术与媒体' }, purpose: { en: 'Engage with creative works.', zh: '参与创意作品。' }, previewTopics: { en: ['Science & Logic'], zh: ['科学与逻辑'] } },
  { id: 'bp_science', topic: 'science', path: 4, icon: 'Microscope', title: { en: 'Science & Logic', zh: '科学与逻辑' }, purpose: { en: 'Analyze and reason.', zh: '分析与推理。' }, previewTopics: { en: [], zh: [] } },
];

// 3. Dynamically generate Blueprints based on actual word topics
export const BLUEPRINTS: Blueprint[] = BLUEPRINT_CONFIG.map(config => {
  const wordsInTopic = ALL_WORDS.filter(w => w.topic === config.topic);
  
  // Enforce 20 words per blueprint for the fixed structure
  const wordIds = wordsInTopic.slice(0, 20).map(w => w.id);
  
  return {
    id: config.id,
    phase: config.path - 1, // Map path 1-4 to phase 0-3
    title: config.title,
    icon: config.icon,
    description: { 
      en: `Master ${wordIds.length} essential words about ${config.title.en}.`, 
      zh: `掌握 ${wordIds.length} 个关于“${config.title.zh}”的核心词汇。` 
    },
    purpose: config.purpose,
    previewTopics: config.previewTopics,
    isPremium: config.path > 1, // Path 1 is free
    coverage: Math.round((wordIds.length / ALL_WORDS.length) * 100) || 1,
    difficulty: config.path as 1|2|3|4|5,
    wordIds: wordIds
  };
}).filter(bp => bp.wordIds.length > 0);
