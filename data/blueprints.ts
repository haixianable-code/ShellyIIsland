
import { Blueprint } from '../types';

export const BLUEPRINTS: Blueprint[] = [
  // --- PHASE 0: VITAL (0-50 words) ---
  {
    id: 'vital_existence',
    phase: 0,
    title: { en: 'Vital: Existence', zh: 'Phase 0: 核心存在' },
    icon: 'ShieldCheck',
    description: { en: 'The absolute core. Identifying self and basic needs.', zh: '西语世界的原子词汇：自我身份与生理本能。' },
    isPremium: false,
    coverage: 32,
    difficulty: 1,
    wordIds: ['ser', 'estar', 'tener', 'haber', 'querer', 'poder', 'yo', 'que_q', 'quien_q', 'si_tool']
  },
  {
    id: 'vital_survival',
    phase: 0,
    title: { en: 'Vital: Survival', zh: 'Phase 0: 生存坐标' },
    icon: 'Map',
    description: { en: 'Eat, drink, and find your way back.', zh: '进食、饮水以及在陌生城市中定位坐标。' },
    isPremium: false,
    coverage: 15,
    difficulty: 1,
    wordIds: ['comer', 'beber', 'agua', 'pan', 'donde_q', 'aqui_tool', 'alli_tool', 'ir', 'venir', 'ayuda']
  },

  // --- PHASE 1: SOCIAL (50-150 words) ---
  {
    id: 'social_lubricant',
    phase: 1,
    title: { en: 'Social: Fluidity', zh: 'Phase 1: 社交润滑' },
    icon: 'MessageSquare',
    description: { en: 'Master the art of introductions and small talk.', zh: '告别尴尬，掌握自我介绍、礼貌寒暄与交友高频词。' },
    isPremium: true,
    coverage: 12,
    difficulty: 2,
    wordIds: ['llamarse', 'vivir', 'amigo', 'conocer', 'hablar', 'decir', 'gustar', 'feliz', 'bueno', 'malo']
  },
  {
    id: 'social_time',
    phase: 1,
    title: { en: 'Social: Timeflow', zh: 'Phase 1: 时间流转' },
    icon: 'Clock',
    description: { en: 'When it happened and how long it lasts.', zh: '掌握昨天、今天与明天，描述事件发生的时机。' },
    isPremium: true,
    coverage: 8,
    difficulty: 2,
    wordIds: ['hoy_tool', 'mañana_tool', 'ayer_tool', 'ahora_tool', 'luego_tool', 'siempre_tool', 'nunca_tool', 'tiempo', 'día', 'noche']
  },

  // --- PHASE 2: LOGIC (150-300 words) ---
  {
    id: 'logic_connectors',
    phase: 2,
    title: { en: 'Logic: Connectors', zh: 'Phase 2: 逻辑骨架' },
    icon: 'Zap',
    description: { en: 'Building complex sentences with but, because, and if.', zh: '不仅是单词，学会使用连接词构建复杂的思想表达。' },
    isPremium: true,
    coverage: 10,
    difficulty: 3,
    wordIds: ['y_tool', 'o_tool', 'pero_tool', 'porque_tool', 'aunque_tool', 'entonces_tool', 'ademas_tool', 'casi_tool', 'muy_tool', 'mas_tool']
  },
  {
    id: 'logic_senses',
    phase: 2,
    title: { en: 'Logic: Perception', zh: 'Phase 2: 性质感知' },
    icon: 'Palette',
    description: { en: 'Describing the world in color and scale.', zh: '开始描述事物的性质：大小、快慢、冷热与颜色。' },
    isPremium: true,
    coverage: 7,
    difficulty: 2,
    wordIds: ['grande', 'pequeño', 'rápido', 'lento', 'caliente', 'frío_adj', 'rojo', 'azul', 'verde', 'blanco']
  },

  // --- PHASE 3: SPECIALIZED (300+) ---
  {
    id: 'pro_negotiation',
    phase: 3,
    title: { en: 'Expert: Workplace', zh: 'Phase 3: 职场办公' },
    icon: 'Briefcase',
    description: { en: 'Professional interaction and task management.', zh: '在专业环境中协作、发送邮件及处理办公事务。' },
    isPremium: true,
    coverage: 5,
    difficulty: 4,
    wordIds: ['trabajar', 'oficina', 'enviar', 'recibir', 'importante', 'necesitar', 'lograr', 'aprender', 'enseñar', 'reunión']
  },
  {
    id: 'pro_travel',
    phase: 3,
    title: { en: 'Expert: Transit', zh: 'Phase 3: 机场入境' },
    icon: 'Plane',
    description: { en: 'Airport, customs, and hotel check-ins.', zh: '流利应对值机、海关询问及酒店入住的专业场景。' },
    isPremium: true,
    coverage: 5,
    difficulty: 4,
    wordIds: ['viajar', 'vuelo', 'aeropuerto', 'estacion', 'coche', 'maleta', 'pasaporte', 'subir', 'bajar', 'hotel']
  }
];
