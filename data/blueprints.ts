
import { Blueprint } from '../types';
import { VOCABULARY_DATA } from './courseData';

// Map DayPacks to Blueprints
export const BLUEPRINTS: Blueprint[] = VOCABULARY_DATA.map((pack, index) => {
  // Determine phase based on index (approximate grouping)
  let phase = 0;
  let icon = 'Map';
  let difficulty: 1 | 2 | 3 | 4 | 5 = 1;

  if (index >= 2 && index < 5) { // Days 3-5
    phase = 1;
    icon = 'MessageSquare';
    difficulty = 2;
  } else if (index >= 5 && index < 8) { // Days 6-8
    phase = 2;
    icon = 'Zap';
    difficulty = 3;
  } else if (index >= 8) { // Days 9+
    phase = 3;
    icon = 'Briefcase';
    difficulty = 4;
  }

  // Custom icon overrides based on title keywords
  const titleLower = pack.title.toLowerCase();
  if (titleLower.includes('identity')) icon = 'ShieldCheck';
  else if (titleLower.includes('movement')) icon = 'Compass';
  else if (titleLower.includes('routine')) icon = 'Clock';
  else if (titleLower.includes('work')) icon = 'Briefcase';
  else if (titleLower.includes('senses')) icon = 'Eye';
  else if (titleLower.includes('social')) icon = 'Users';
  else if (titleLower.includes('creation')) icon = 'Palette';
  else if (titleLower.includes('nature')) icon = 'Mountain';
  else if (titleLower.includes('mind')) icon = 'Brain';
  else if (titleLower.includes('life')) icon = 'Sprout';

  return {
    id: pack.id,
    phase,
    title: { en: pack.title, zh: pack.title }, // Using same title for now, can be localized later
    icon,
    description: { 
      en: `${pack.words.length} essential words for ${pack.title.toLowerCase()}.`, 
      zh: `掌握 ${pack.words.length} 个关于${pack.title}的核心词汇。` 
    },
    isPremium: index > 0, // First pack is free
    coverage: Math.round(100 / VOCABULARY_DATA.length), // Approximate coverage
    difficulty,
    wordIds: pack.words.map(w => w.id)
  };
});
