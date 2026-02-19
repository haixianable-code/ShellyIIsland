import React from 'react';
import { Bi } from '../components/Bilingual';
import { 
  Microscope, BarChart3, Radio, Sparkles, Target, GraduationCap, 
  History, Zap, Brain, Activity, Layers, Database, Timer, 
  BookOpenCheck, Route, Construction, Compass, Map, Info, 
  Lightbulb, MessageSquareText, Flame, Anchor, Repeat, 
  ShieldCheck, UserPlus, Heart, Volume2, FastForward, 
  Sprout, Sword, Dna, Atom, Camera, Film, Eye, ArrowRight
} from 'lucide-react';

export type BlogTab = 'all' | 'strategy' | 'grammar' | 'ai';

export interface Post {
  id: string;
  slug: string;
  category: BlogTab;
  isPremium?: boolean;
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
    isPremium: false,
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
    isPremium: false,
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
  },
  {
    id: 'devlog-ai-lab-strictness',
    slug: 'why-strictest-ai-tutor',
    category: 'ai',
    isPremium: false,
    title: {
      en: "Island Owner's Log: Why I built the world's strictest AI tutor",
      zh: "岛主日志：为什么我为你找了个最“严厉”的 AI 助教？"
    },
    excerpt: {
      en: "I received feedback that the AI is too strict with accents. Today, I'll explain why 'hablo' and 'habló' are worlds apart.",
      zh: "我收到反馈说 AI 对重音符号太死板了。今天我想聊聊，为什么 hablo 和 habló 隔着一个时空。"
    },
    description: "A deep dive into the 3-Stage AI Lab logic. Why precision matters in Spanish and how Stage 3 moves from grammar to social goals.",
    keywords: ['Spanish AI Tutor', 'Spanish Accents', 'Tildes importance', 'AI language practice'],
    date: 'MAR 01, 2026',
    readTime: '6 min',
    level: 'Intermediate',
    tags: ['Dev Log', 'AI Lab'],
    content: (
      <div className="space-y-10 pb-20 leading-relaxed text-slate-700">
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-[#0288d1]">
            <Atom size={24} />
            <span className="text-xs font-black uppercase tracking-[0.3em] opacity-80">
              <Bi en="Developer Journal" zh="开发者日志" />
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-[#4b7d78] uppercase tracking-tight">
            <Bi en="The Tilde is the Soul" zh="重音符号是语言的灵魂" />
          </h2>
          <p className="text-lg">
            <Bi 
              en="A user once messaged me: 'I got the word right, I just missed one little accent on the O. Why did the AI fail me?'"
              zh="一位用户曾给我发消息：‘单词我写对了，只是 O 上面少了个小撇。为什么 AI 判定我失败了？’"
            />
          </p>
          <p>
            <Bi 
              en="In Spanish, that 'little accent' (tilde) isn't decoration. 'Hablo' means 'I speak' (Now). 'Habló' means 'He/She spoke' (Past). If I am lenient now, I am being cruel to your future self when you're trying to order food in Madrid and end up talking about what someone else did yesterday."
              zh="在西班牙语里，重音符号不是装饰品。‘Hablo’ 是‘我说’（现在）；‘Habló’ 是‘他/她说了’（过去）。如果我现在对你的手指仁慈，那就是对你未来的实战残忍——当你试图在马德里点餐，却意外地开始讲述别人昨天做了什么。"
            />
          </p>
        </section>

        <div className="bg-[#e1f5fe] p-8 rounded-[3rem] border-4 border-white shadow-md space-y-6">
          <h3 className="text-xl font-black text-[#0288d1] uppercase flex items-center gap-3">
            <ShieldCheck size={22} /> <Bi en="The 3-Stage Lab Protocol" zh="AI 实验室的三阶协议" />
          </h3>
          <div className="space-y-4">
             <div className="flex gap-4 items-start">
                <div className="bg-white p-2 rounded-lg text-[#0288d1] shrink-0 font-black">S1</div>
                <p className="text-sm"><strong><Bi en="Recognition" zh="辨析训练" />:</strong> <Bi en="Identifying the target in a sea of look-alikes. We train your linguistic intuition." zh="在相似的变位中一眼认出目标。我们在训练你的视觉直觉。" /></p>
             </div>
             <div className="flex gap-4 items-start">
                <div className="bg-[#f57c00] p-2 rounded-lg text-white shrink-0 font-black">S2</div>
                <p className="text-sm"><strong><Bi en="Accuracy" zh="精准防火墙" />:</strong> <Bi en="The 'strict' part. We catch every missing accent and spelling error. This is where muscle memory is born." zh="这就是‘严厉’的部分。我们捕捉每一个重音遗漏。这是肌肉记忆诞生的地方。" /></p>
             </div>
             <div className="flex gap-4 items-start">
                <div className="bg-[#78c850] p-2 rounded-lg text-white shrink-0 font-black">S3</div>
                <p className="text-sm"><strong><Bi en="Social Goal" zh="社交博弈" />:</strong> <Bi en="Forget grammar. Can you achieve the goal? AI simulates real-world missions like 'Reject an invitation politely'." zh="忘掉语法。你能达成目标吗？AI 模拟真实任务，比如‘委婉地拒绝一个邀请’。" /></p>
             </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'devlog-visual-stem-mapping',
    slug: 'visual-stem-mapping-logic',
    category: 'strategy',
    isPremium: false,
    title: {
      en: "Stop Memorizing Tables: How Visual Stem Mapping works",
      zh: "别去背那个表格了，我想请你用眼睛“看”出逻辑"
    },
    excerpt: {
      en: "Traditional tables are cognitive overload. Our new mapping tech uses color and contrast to help you spot patterns instantly.",
      zh: "传统的变位表是认知过载。我们全新的词根映射技术通过色彩和对比度，帮你瞬间识别模式。"
    },
    description: "Explaining the science behind visual stem mapping. How contrast and color coding reduce cognitive load in language learning.",
    keywords: ['Spanish verb patterns', 'Visual language learning', 'stem mapping', 'Spanish conjugation hacks'],
    date: 'MAR 03, 2026',
    readTime: '5 min',
    level: 'Beginner',
    tags: ['Cognitive Science', 'UI/UX'],
    content: (
      <div className="space-y-10 pb-20 leading-relaxed text-slate-700">
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-[#ffa600]">
            <Dna size={24} />
            <span className="text-xs font-black uppercase tracking-[0.3em] opacity-80">
              <Bi en="Cognitive Design" zh="认知设计" />
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-[#4b7d78] uppercase tracking-tight">
            <Bi en="Pattern Recognition vs. Brute Force" zh="模式识别 vs. 暴力记忆" />
          </h2>
          <p className="text-lg">
            <Bi 
              en="When your brain sees a 50-cell conjugation table, it triggers a flight-or-fight response. It's too much data. We decided to hack this process."
              zh="当你的大脑看到一张 50 格的变位表时，它会触发‘逃跑或战斗’的应激反应。数据太多了。我们决定黑掉这个过程。"
            />
          </p>
        </section>

        <section className="bg-white p-8 rounded-[3rem] border-4 border-[#f7f9e4] shadow-xl">
           <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-slate-100 rounded-2xl text-slate-400 opacity-40"><Bi en="ROOT" zh="词根" /></div>
              <ArrowRight className="text-slate-300" />
              <div className="p-3 bg-orange-100 rounded-2xl text-orange-600 font-black border-2 border-orange-200"><Bi en="SUFFIX" zh="词尾" /></div>
           </div>
           <h3 className="text-xl font-black text-[#4b7d78] uppercase mb-4"><Bi en="The Visual Contrast Hack" zh="视觉对比度黑客" /></h3>
           <p className="text-sm">
             <Bi 
               en="In our word detail view, we dim the verb root (the 'stem') to 40% opacity. It becomes the background noise. Then, we highlight the changing suffix in bright brand colors. Your eye naturally ignores the static part and focuses on the dynamic part."
               zh="在单词详情页，我们将动词词根调暗至 40% 透明度，它变成了背景。然后，我们用明亮的品牌色高亮变化的词尾。你的眼睛会自然地忽略静态部分，专注于动态部分。"
             />
           </p>
           <p className="text-sm mt-4">
             <Bi 
               en="This isn't just aesthetic. It reduces your cognitive load to near zero. You aren't 'learning' a word; you are watching a wave moving through the letters."
               zh="这不仅仅是为了美观。它将你的认知负荷降低到近乎零。你不是在‘学习’一个单词，你是在观察一段在字母间流动的波浪。"
             />
           </p>
        </section>
      </div>
    )
  },
  {
    id: 'devlog-tense-sync-machine',
    slug: 'time-machine-tense-sync',
    category: 'grammar',
    isPremium: false,
    title: {
      en: "Flipping the Time Machine: Why example sentences must dance",
      zh: "拨动时光机：为什么例句必须随着时态“起舞”？"
    },
    excerpt: {
      en: "Context is everything. When you switch to the past, you shouldn't see a present-tense story. Today, we reveal our Tense Sync Protocol.",
      zh: "语境就是一切。当你切换到过去时，不该看到一个现在的场景。今天，我们揭秘“时态同步协议”。"
    },
    description: "Deep dive into contextual learning. Why synchronized example sentences are the key to mastering the Preterite and Imperfect tenses in Spanish.",
    keywords: ['Spanish Tenses', 'Pretérito vs Imperfecto', 'Contextual language learning', 'Spanish Time Machine'],
    date: 'MAR 05, 2026',
    readTime: '7 min',
    level: 'Intermediate',
    tags: ['Grammar', 'UX Logic'],
    content: (
      <div className="space-y-10 pb-20 leading-relaxed text-slate-700">
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-[#795548]">
            <Timer size={24} />
            <span className="text-xs font-black uppercase tracking-[0.3em] opacity-80">
              <Bi en="Linguistic Dimension" zh="语言维度" />
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-[#4b7d78] uppercase tracking-tight">
            <Bi en="The Snapshot vs. The Movie" zh="快照 vs. 电影" />
          </h2>
          <p className="text-lg italic font-medium">
            <Bi 
              en="A word in the past tense has a different soul than in the present."
              zh="过去时的单词，拥有与现在时完全不同的灵魂。"
            />
          </p>
          <p>
            <Bi 
              en="The biggest hurdle in Spanish is choosing between the two past tenses. We solved this with the 'Time Machine Protocol'. When you toggle to Past (Snapshot), we force the examples to tell a completed story. When you toggle to Past (Movie), the examples describe a background or a feeling."
              zh="西语最大的障碍是在两个过去时之间做选择。我们通过‘时光机协议’解决了这个问题。当你切换到‘过去-快照’（点动作），例句会强制讲述一个已完成的故事；当你切换到‘过去-电影’（未完成时），例句则会描述一个背景或情感。"
            />
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="bg-[#efebe9] p-6 rounded-[2.5rem] border-2 border-[#d7ccc8]">
              <Camera className="text-[#795548] mb-3" size={24} />
              <h4 className="font-black text-[#5d4037] uppercase text-sm mb-2">Pretérito (Snapshot)</h4>
              <p className="text-xs italic">"Fui al cine." (I went... then it was over.)</p>
           </div>
           <div className="bg-[#5d4037] p-6 rounded-[2.5rem] text-white">
              <Film className="text-white mb-3" size={24} />
              <h4 className="font-black uppercase text-sm mb-2">Imperfecto (Movie)</h4>
              <p className="text-xs italic opacity-80">"Iba al cine cada lunes." (I was going... as a habit.)</p>
           </div>
        </div>

        <section className="space-y-6">
           <h3 className="text-2xl font-black text-[#4b7d78] uppercase"><Bi en="Why synchronization matters" zh="为什么同步至关重要" /></h3>
           <p>
             <Bi 
               en="Your brain anchors new words to the 'stories' it hears. If you study a past-tense form but read a present-tense example, your linguistic intuition gets fractured. We've ensured that every dial on the island is synced to give your brain a perfect, 3D image of the word's life."
               zh="大脑会将新词锚定在它听到的‘故事’里。如果你在学过去时的变位，却读着现在时的例句，你的语感会产生裂缝。我们确保了岛屿上的每一个拨盘都是同步的，旨在为你的大脑提供关于单词生命的完美 3D 图像。"
             />
           </p>
        </section>
      </div>
    )
  }
];