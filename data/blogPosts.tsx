
import React from 'react';
import { Link } from 'react-router-dom';
import { Bi } from '../components/Bilingual';
import { Microscope, BarChart3, Radio, Sparkles, Target, GraduationCap, History, Zap, Brain, Activity, Layers, Database, Timer, BookOpenCheck, Route, Construction, Compass, Map, Info, Lightbulb, MessageSquareText, Flame, Anchor, Repeat, ShieldCheck, UserPlus, Heart, Volume2, FastForward, Sprout, Sword } from 'lucide-react';

export type BlogTab = 'all' | 'strategy' | 'grammar' | 'ai';

export interface Post {
  id: string;
  slug: string;
  category: BlogTab;
  isPremium?: boolean; // New field for content gating
  title: string | { en: string; zh: string };
  excerpt: string | { en: string; zh: string };
  description: string;
  keywords: string[]; 
  date: string;
  readTime: string;
  level: 'Beginner' | 'Intermediate' | 'Expert';
  tags: string[];
  content: React.ReactNode;
}

export const BLOG_POSTS: Post[] = [
  {
    id: 'island-survival-guide-bilingual',
    slug: 'island-survival-guide-bilingual',
    category: 'strategy',
    isPremium: false,
    title: {
      en: "The Island Survival Guide: How to prevent your empire from withering",
      zh: "岛屿领主进阶指南：如何防止你的帝国荒芜？"
    },
    excerpt: {
      en: "Welcome to the Island. You are not just memorizing words; you are fighting against the jungle. Here are the 3 Iron Rules of survival.",
      zh: "欢迎来到岛屿。你不是在背单词，你是在对抗遗忘。如果不复习，你的岛屿会被丛林吞没。"
    },
    description: 'A comprehensive guide to the Shelly Spanish Island methodology. Learn how to use Spaced Repetition and Active Recall to master Spanish.',
    keywords: ['Spanish learning guide', 'Island survival guide', 'spaced repetition', 'active recall', 'forgetting curve'],
    date: 'FEB 20, 2026',
    readTime: '5 min',
    level: 'Beginner',
    tags: ['Manifesto', 'Methodology'],
    content: (
      <div className="space-y-12 pb-20 leading-relaxed text-slate-700">
        {/* Intro */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-[#4b7d78]">
            <Compass size={24} />
            <span className="text-xs font-black uppercase tracking-[0.3em] opacity-80">
              <Bi en="Onboarding" zh="入门指南" />
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-[#4b7d78] uppercase tracking-tight leading-none">
            <Bi 
              en={<>Don't Memorize. <span className="text-[#8bc34a]">Survive.</span></>}
              zh={<>别背诵，要<span className="text-[#8bc34a]">生存。</span></>}
            />
          </h2>
          <div className="space-y-4 text-lg">
            <p className="font-medium text-slate-800">
              <Bi 
                en="Welcome to Shelly Spanish Island. Do not treat this app like a classroom. Treat it like a Survival Game. Your goal is simple: let your vocabulary grow wild like a tropical garden."
                zh="欢迎来到 Shelly Spanish Island。别把它当成死板的教室，把它当成一场生存游戏。在这里，你的目标只有一个：让你的词汇量像热带雨林一样疯长。"
              />
            </p>
          </div>
          <div className="bg-[#f0fdf4] p-6 rounded-3xl border-l-4 border-[#8bc34a]">
             <p className="text-sm text-[#166534] font-bold">
               <Bi 
                 en="Did you know? The human brain is like a jungle. If you don't maintain a path, weeds (forgetfulness) will cover it in just 3 days."
                 zh="你知道吗？人类的大脑像一片热带雨林，如果不去维护，刚开辟的道路只需 3 天就会被杂草（遗忘）彻底覆盖。"
               />
             </p>
          </div>
        </section>

        {/* Rule 1 */}
        <section className="space-y-6">
          <h3 className="text-2xl font-black text-[#4b7d78] uppercase tracking-tight flex items-center gap-3">
            <Sword className="text-[#ff7b72]" /> 
            <Bi en="Rule 1: Fight the Jungle" zh="铁律一：抵抗“丛林吞噬”" />
          </h3>
          <div className="space-y-4">
            <p>
              <Bi 
                en={<>See that green <strong>"Water Garden"</strong> button on the home screen? That is your most important defense. Our underground system (SRS Algorithm) calculates exactly when a word is about to wither.</>}
                zh={<>看到主页上那个绿色的 <strong>"Water Garden" (浇水)</strong> 按钮了吗？它是你最重要的防御工事。岛屿的地下系统（SRS算法）精准计算着每一个单词的“枯萎时间”。</>}
              />
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="bg-white p-5 rounded-2xl border-2 border-[#e0d9b4] shadow-sm">
                <p className="text-xs font-black text-[#ffa600] uppercase mb-2">
                  <Bi en="The Consequence" zh="后果" />
                </p>
                <p className="text-sm font-bold text-slate-700">
                  <Bi 
                    en="If you ignore it, the plant dies. You have to re-learn it from scratch (double the effort)."
                    zh="如果你忽略它，单词就会“枯死”。下次再见到它，你不仅要重新学，还得花双倍的精力。"
                  />
                </p>
             </div>
             <div className="bg-[#fff3e0] p-5 rounded-2xl border-2 border-[#ffcc80] shadow-sm">
                <p className="text-xs font-black text-[#f57c00] uppercase mb-2">
                  <Bi en="The Action" zh="行动指令" />
                </p>
                <p className="text-sm font-bold text-[#e65100]">
                  <Bi 
                    en="Always 'Water' before you 'Plant'. Protect your territory first."
                    zh="每天登录第一件事，先消灭所有待浇水的植物，再去开垦新地。保住江山，比打江山更重要。"
                  />
                </p>
             </div>
          </div>
        </section>

        {/* Rule 2 */}
        <section className="space-y-6">
          <h3 className="text-2xl font-black text-[#4b7d78] uppercase tracking-tight flex items-center gap-3">
            <Sprout className="text-[#8bc34a]" /> 
            <Bi en="Rule 2: Daily Expansion" zh="铁律二：每日拓荒" />
          </h3>
          <div className="space-y-4">
            <p>
              <Bi 
                en={<>Once your garden is safe, click <strong>"Start Planting"</strong>. The system prepares 20 high-value seeds for you daily. Do not be greedy. 20 words a day for 30 days is 600 words—enough to survive on the island.</>}
                zh={<>当你的花园安全后，点击 <strong>"Start Planting"</strong>。系统每天为你准备了 20 颗高价值种子。不要贪多。每天 20 个，坚持一个月就是 600 个——这足够你在岛上进行基本的生存对话了。</>}
              />
            </p>
          </div>
        </section>

        {/* Rule 3 */}
        <section className="space-y-6">
          <h3 className="text-2xl font-black text-[#4b7d78] uppercase tracking-tight flex items-center gap-3">
            <Target className="text-[#0288d1]" /> 
            <Bi en="Rule 3: Think Like a Hunter" zh="铁律三：像猎人一样思考" />
          </h3>
          <div className="space-y-4">
            <p>
              <Bi 
                en={<>You will notice the word cards are folded by default. This is not for aesthetics; it is a trap. It forces you to <strong>Active Recall</strong>.</>}
                zh={<>你会发现单词卡片默认是折叠的。这不是为了美观，这是一个陷阱。它逼迫你进行<strong>“主动回忆” (Active Recall)</strong>。不要急着看答案，逼自己去回想。</>}
              />
            </p>
          </div>
        </section>
      </div>
    )
  },
  {
    id: 'neuroscience-fluency',
    slug: 'stop-translating-spanish-neuroscience',
    category: 'strategy',
    isPremium: true,
    title: {
      en: "The Neuroscience of Fluency: Why your brain lags and how to stop translating",
      zh: "流利度的神经科学：为什么你的大脑会有延迟？"
    },
    excerpt: {
      en: "Deep dive into the Broca’s Area. Learn how to bypass the mental translation delay and build direct neural paths to Spanish concepts.",
      zh: "深入了解布罗卡区。学习如何绕过心理翻译延迟，建立通往西班牙语概念的直接神经路径。"
    },
    description: 'Understand the neuro-linguistic biology of Spanish fluency. Stop translating in your head by building direct neural pathways from concepts to Spanish words.',
    keywords: ['Stop translating in your head', 'Spanish neural pathways', 'fluency speed', 'Broca area language', 'Spanish acquisition'],
    date: 'FEB 12, 2026',
    readTime: '8 min', 
    level: 'Expert',
    tags: ['Neuro-Learning', 'Fluency Hacks'],
    content: (
      <div className="space-y-10 pb-20 leading-relaxed text-slate-700">
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-[#ff7b72]">
            <Brain size={24} />
            <span className="text-xs font-black uppercase tracking-[0.3em] opacity-80">Neuro-Linguistic Deep Dive</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-[#4b7d78] uppercase tracking-tight leading-none">The 500ms Latency Problem</h2>
          <p className="text-lg font-medium">
            Have you ever felt that "frozen" second in a conversation? You know the word, you know the meaning, but it stays trapped behind your teeth. In neuroscience, this is known as <strong>"Translation Interference."</strong>
          </p>
          <p>
            When you learn Spanish as a secondary language through traditional methods, your brain builds a <em>detour</em>. Instead of connecting the concept of "Water" directly to the sound "Agua," it forces the signal through your native English network first. 
            Concept → English Label → Spanish Label. This detour costs approximately 500 to 800 milliseconds—the exact amount of time required to lose the rhythm of a natural conversation.
          </p>
        </section>

        <section className="bg-white border-4 border-[#f7f9e4] p-8 rounded-[3rem] shadow-xl space-y-6">
          <h3 className="text-2xl font-black text-[#4b7d78] uppercase flex items-center gap-3">
            <Activity size={22} className="text-[#ff7b72]" /> The Broca-Wernicke Loop
          </h3>
          <p className="text-sm">
            Our brains process language using two primary hubs: <strong>Wernicke’s Area</strong> (understanding) and <strong>Broca’s Area</strong> (production). When you translate in your head, you are essentially asking Broca’s area to perform a double task—filtering out English while trying to synthesize Spanish.
          </p>
        </section>

        <section className="space-y-6">
          <h3 className="text-2xl font-black text-[#4b7d78] uppercase tracking-tight">Protocol: The 3-Second Rule</h3>
          <p>
            The secret to breaking the translation habit is <strong>Restrictive Sentence Construction</strong>. When you are on the "Study Island," try this protocol:
          </p>
          <ul className="space-y-4">
             <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#ff7b72] text-white flex items-center justify-center shrink-0 font-black text-xs">1</div>
                <div>
                   <p className="font-black text-[#4b7d78] text-sm uppercase">Bypass the "Inner Dictionary"</p>
                   <p className="text-xs text-slate-500">Stop looking at the English translation after the first 2 seconds. Close your eyes and visualize the object or the feeling.</p>
                </div>
             </li>
             <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#ffa600] text-white flex items-center justify-center shrink-0 font-black text-xs">2</div>
                <div>
                   <p className="font-black text-[#4b7d78] text-sm uppercase">The "One-Word Pivot"</p>
                   <p className="text-xs text-slate-500">Instead of translating "I want water," focus only on the verb "Quiero." Let your brain fill the rest based on instinct.</p>
                </div>
             </li>
          </ul>
        </section>
      </div>
    )
  },
  {
    id: 'pareto-rae-corpus',
    slug: 'spanish-80-20-rule-rae-corpus',
    category: 'strategy',
    isPremium: true,
    title: {
      en: 'Strategic Spanish: The 80/20 RAE Map to capturing 85% of conversation',
      zh: '策略性西语：利用 80/20 规律掌握 85% 的对话'
    },
    excerpt: {
      en: 'The Real Academia Española (RAE) data proves that you only need 500 words to understand most daily interactions. Stop wasting time on low-utility vocab.',
      zh: 'RAE 数据证明你只需要 500 个单词就能听懂大部分日常对话。别再把时间浪费在低频词汇上了。'
    },
    description: 'Use the Pareto Principle and RAE corpus data to prioritize your Spanish vocabulary. Focus on the high-frequency words that drive 85% of Spanish communication.',
    keywords: ['Most used Spanish words', 'RAE frequency list', 'Spanish priority vocabulary', '80/20 rule language learning'],
    date: 'FEB 12, 2026',
    readTime: '7 min',
    level: 'Beginner',
    tags: ['Efficiency', 'RAE Data'],
    content: (
      <div className="space-y-10 pb-20 leading-relaxed text-slate-700">
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-[#ffa600]">
            <BarChart3 size={24} />
            <span className="text-xs font-black uppercase tracking-[0.3em] opacity-80">Statistical Intelligence</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-[#4b7d78] uppercase tracking-tight">The Zipf Law of Spanish</h2>
          <p className="text-lg font-medium text-slate-600">
            Did you know the RAE dictionary contains over 93,000 words? For a beginner, this is a psychological nightmare. But here is the secret: <strong>Language is a Power Law.</strong>
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           {[
             { title: "Top 100", stat: "60%", desc: "Of all daily speech covered" },
             { title: "Top 500", stat: "82%", desc: "The Functional Fluency Threshold" },
             { title: "Top 2000", stat: "92%", desc: "The Literacy Threshold" }
           ].map((item, i) => (
             <div key={i} className="bg-white border-2 border-[#e0d9b4] p-6 rounded-[2.5rem] text-center shadow-sm hover:-translate-y-1 transition-all">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{item.title}</p>
                <h4 className="text-3xl font-black text-[#4b7d78]">{item.stat}</h4>
                <p className="text-[9px] font-bold text-slate-500 uppercase mt-2">{item.desc}</p>
             </div>
           ))}
        </div>
      </div>
    )
  }
];
