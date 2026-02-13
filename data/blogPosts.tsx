
import React from 'react';
import { Link } from 'react-router-dom';
import { Bi } from '../components/Bilingual';
import { Microscope, BarChart3, Radio, Sparkles, Target, GraduationCap, History, Zap, Brain, Activity, Layers, Database, Timer, BookOpenCheck, Route, Construction, Compass, Map, Info, Lightbulb, MessageSquareText, Flame, Anchor, Repeat, ShieldCheck, UserPlus, Heart, Volume2, FastForward, Sprout, Sword } from 'lucide-react';

export type BlogTab = 'all' | 'strategy' | 'grammar' | 'ai';

export interface Post {
  id: string;
  slug: string;
  category: BlogTab;
  title: string | { en: string; zh: string }; // Now supports bilingual objects
  excerpt: string | { en: string; zh: string }; // Now supports bilingual objects
  description: string; // Keep simple for SEO meta (usually English is preferred for global SEO, or can be generic)
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
            <Bi 
              en="Rule 1: Fight the Jungle"
              zh="铁律一：抵抗“丛林吞噬”"
            />
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
            <Bi 
              en="Rule 2: Daily Expansion"
              zh="铁律二：每日拓荒"
            />
          </h3>
          
          <div className="space-y-4">
            <p>
              <Bi 
                en={<>Once your garden is safe, click <strong>"Start Planting"</strong>. The system prepares 20 high-value seeds for you daily. Do not be greedy. 20 words a day for 30 days is 600 words—enough to survive on the island.</>}
                zh={<>当你的花园安全后，点击 <strong>"Start Planting"</strong>。系统每天为你准备了 20 颗高价值种子。不要贪多。每天 20 个，坚持一个月就是 600 个——这足够你在岛上进行基本的生存对话了。</>}
              />
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-3xl border-dashed border-2 border-slate-300">
             <div className="flex gap-4 items-start">
                <div className="bg-[#ffa600] text-white p-2 rounded-lg shrink-0">
                   <FastForward size={20} />
                </div>
                <div>
                   <h4 className="font-black text-slate-700 uppercase">
                     <Bi en="The Supply Crate" zh="关于补给箱 (Supply Crate)" />
                   </h4>
                   <p className="text-sm mt-1 text-slate-600">
                     <Bi 
                       en="If you are a hardcore explorer, look for the Supply Crate. Items inside have VIP access and bypass your daily limit."
                       zh="如果你是精力旺盛的探险家，去寻找 Supply Crate。里面的物资拥有 VIP 通行证，无视每日限额，只要你敢点，我们就敢给。"
                     />
                   </p>
                </div>
             </div>
          </div>
        </section>

        {/* Rule 3 */}
        <section className="space-y-6">
          <h3 className="text-2xl font-black text-[#4b7d78] uppercase tracking-tight flex items-center gap-3">
            <Target className="text-[#0288d1]" /> 
            <Bi 
              en="Rule 3: Think Like a Hunter"
              zh="铁律三：像猎人一样思考"
            />
          </h3>
          
          <div className="space-y-4">
            <p>
              <Bi 
                en={<>You will notice the word cards are folded by default. This is not for aesthetics; it is a trap. It forces you to <strong>Active Recall</strong>.</>}
                zh={<>你会发现单词卡片默认是折叠的。这不是为了美观，这是一个陷阱。它逼迫你进行<strong>“主动回忆” (Active Recall)</strong>。不要急着看答案，逼自己去回想。</>}
              />
            </p>
          </div>

          <div className="bg-[#e1f5fe] p-8 rounded-[3rem] space-y-4">
             <h4 className="font-black text-[#01579b] uppercase text-center mb-4">
               <Bi en="The Tactical Protocol" zh="战术动作 (The Tactical Protocol)" />
             </h4>
             
             <div className="flex flex-col gap-4">
                <div className="flex gap-4 items-center">
                   <div className="w-8 h-8 rounded-full bg-white text-[#0288d1] flex items-center justify-center font-black shadow-sm">1</div>
                   <div className="flex-1">
                      <p className="font-bold text-[#01579b] text-sm">
                        <Bi en="Can't remember? → Tap 'Memory Seed'" zh="🤯 想不起来？ -> 召唤 Memory Seed" />
                      </p>
                      <p className="text-xs text-[#0288d1]/70">
                        <Bi 
                          en="Let AI give you a crazy story to hook the word in your brain." 
                          zh="让 AI 给你一个“记忆挂钩”（比如一个离谱的故事）。把单词像钉子一样钉进脑子里。" 
                        />
                      </p>
                   </div>
                </div>
                <div className="flex gap-4 items-center">
                   <div className="w-8 h-8 rounded-full bg-white text-[#0288d1] flex items-center justify-center font-black shadow-sm">2</div>
                   <div className="flex-1">
                      <p className="font-bold text-[#01579b] text-sm">
                        <Bi en="Too easy? → Tap 'Challenge'" zh="😏 觉得稳了？ -> 发起 Challenge" />
                      </p>
                      <p className="text-xs text-[#0288d1]/70">
                        <Bi 
                          en="Write a sentence. Move from 'Passive Reading' to 'Active Survival'." 
                          zh="别光看，试着造句。从“看得懂”到“能生存”，中间只差这一次主动出击。" 
                        />
                      </p>
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* Outro */}
        <section className="border-t-4 border-dashed border-[#e0d9b4] pt-8 text-center">
           <p className="font-black text-[#4b7d78] text-xl uppercase mb-2">
             <Bi en="Are you ready to guard your territory?" zh="准备好守护你的领土了吗？" />
           </p>
           <Link to="/" className="inline-block bg-[#ffa600] text-white px-8 py-3 rounded-full font-black uppercase tracking-widest shadow-lg animate-pulse hover:bg-[#ffb74d] transition-colors">
              <Bi en="Go Water Now!" zh="去浇水吧！" />
           </Link>
        </section>
      </div>
    )
  },
  {
    id: 'neuroscience-fluency',
    slug: 'stop-translating-spanish-neuroscience',
    category: 'strategy',
    title: 'The Neuroscience of Fluency: Why your brain lags and how to stop translating',
    excerpt: 'Deep dive into the Broca’s Area. Learn how to bypass the mental translation delay and build direct neural paths to Spanish concepts.',
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
          <div className="bg-[#fffdf5] p-6 rounded-2xl border-2 border-dashed border-[#e0d9b4] space-y-4">
             <h4 className="font-black text-xs uppercase tracking-widest text-[#ffa600]">The Solution: Concept Mapping</h4>
             <p className="text-xs italic leading-snug text-slate-500">
                To fix this, you must "starve" the English intermediate labels. In the Shelly Spanish Island app, we use <strong>Visual Anchoring</strong>. We don't just show you the word "Gato"; we use AI to generate contextual seeds that link the word to an action or a sensory memory.
             </p>
          </div>
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
             <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#8bc34a] text-white flex items-center justify-center shrink-0 font-black text-xs">3</div>
                <div>
                   <p className="font-black text-[#4b7d78] text-sm uppercase">Auditory Mimicry</p>
                   <p className="text-xs text-slate-500">Use the built-in TTS. Listen to the rhythm, not just the letters. Speed of sound is faster than speed of thought.</p>
                </div>
             </li>
          </ul>
        </section>

        <section className="bg-[#f0f9ff] p-8 rounded-[3rem] border-4 border-white shadow-sm space-y-4">
           <h3 className="text-xl font-black text-[#0369a1] uppercase">Conclusion: Neural Pruning</h3>
           <p className="text-sm italic">
             Fluency isn't about knowing <em>more</em> words; it's about <strong>Pruning</strong> the weak connections to English and strengthening the direct Spanish highway. Every time you use the "Island Challenge" to write a sentence without looking at your notes, you are physically re-wiring your brain for speed.
           </p>
        </section>
      </div>
    )
  },
  {
    id: 'pareto-rae-corpus',
    slug: 'spanish-80-20-rule-rae-corpus',
    category: 'strategy',
    title: 'Strategic Spanish: The 80/20 RAE Map to capturing 85% of conversation',
    excerpt: 'The Real Academia Española (RAE) data proves that you only need 500 words to understand most daily interactions. Stop wasting time on low-utility vocab.',
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
          <p>
            In linguistics, <em>Zipf's Law</em> states that the frequency of a word is inversely proportional to its rank. In Spanish, the word <strong>"de"</strong> appears millions of times, while a word like <strong>"electroencefalografista"</strong> might appear once in a decade. 
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

        <section className="space-y-6">
          <h3 className="text-2xl font-black text-[#4b7d78] uppercase tracking-tight">Why "Semantic Density" Matters</h3>
          <p>
            Many learners waste time on "Niche" vocabulary (like learning all the names of bird species) before they master <strong>High-Utility Verbs</strong>. In the Shelly Spanish Island curriculum, we prioritize <strong>Semantic Density</strong>. 
          </p>
          <p>
            Take the verb <strong>"Ir" (To go)</strong>. If you master "Ir," you haven't just learned a word; you've unlocked the ability to talk about the future (Ir a + Verb), movement, travel, and intention. That single word has 100x the "Conversational Value" of a noun like "Tablecloth."
          </p>
          <div className="bg-[#fff9c4] p-8 rounded-[3rem] border-4 border-[#fdd835] space-y-4">
             <h4 className="font-black text-[#8e6b23] uppercase flex items-center gap-2 italic">
               <Info size={18} /> The Island Strategy: Loot Prioritization
             </h4>
             <p className="text-sm text-[#8e6b23] leading-relaxed">
               When you open an <strong>Island Supply Crate</strong>, the words inside aren't random. They are mathematically selected from the RAE corpus to ensure that every seed you plant has the maximum possible impact on your comprehension. We focus on the "Connectors" and "High-Freq Verbs" that act as the scaffolding for the entire language.
             </p>
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-2xl font-black text-[#4b7d78] uppercase tracking-tight">Implementation: Functional Expression</h3>
          <p>
            Mastering the Top 500 isn't just about recognition—it's about <strong>Expression</strong>. Use the "Blitz Review" mode in SSI to test your recall speed for these core assets. If you can't recall "Hacer" in under 1 second, you are not fluent in it yet, regardless of how many niche words you know.
          </p>
        </section>
      </div>
    )
  },
  {
    id: 'memory-seeds-gemini',
    slug: 'ai-mnemonics-spanish-memory-hacks',
    category: 'ai',
    title: 'Memory Seeds: Using Gemini 3 to create biological memory anchors',
    excerpt: 'Standard flashcards are boring. Learn how SSI uses LLMs to "stitch" Spanish vocabulary into your long-term memory using bizarre mnemonics.',
    description: 'Learn how AI-powered mnemonics (Memory Seeds) help build stronger memory anchors for Spanish vocabulary. Using Gemini 3 for linguistic association.',
    keywords: ['AI mnemonics Spanish', 'Gemini AI Spanish learning', 'memory hacks for vocabulary', 'Spanish memory anchors'],
    date: 'FEB 13, 2026',
    readTime: '9 min',
    level: 'Intermediate',
    tags: ['AI Tech', 'Memory'],
    content: (
      <div className="space-y-10 pb-20 leading-relaxed text-slate-700">
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-[#ab47bc]">
            <Sparkles size={24} />
            <span className="text-xs font-black uppercase tracking-[0.3em] opacity-80">Generative Mnemonics</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-[#4b7d78] uppercase tracking-tight">The "Velcro" Theory of Learning</h2>
          <p>
            Memory isn't a filing cabinet; it's more like a wall of velcro. If a new piece of information has no "hooks," it falls off. Most Spanish learners try to force-feed dry definitions, which have no hooks.
          </p>
          <p>
            <strong>"Memory Seeds"</strong> is the name we give to the AI-generated associations in SSI. By using LLMs (Large Language Models), we create unique, often bizarre, "hooks" that connect the Spanish sound to something you already know.
          </p>
        </section>

        <section className="bg-slate-50 p-8 rounded-[3rem] border-4 border-white shadow-sm space-y-4">
           <h3 className="text-xl font-black text-[#4b7d78] uppercase">Case Study: The Word "Ayer"</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-2xl border-2 border-slate-100">
                 <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Traditional Method</p>
                 <p className="font-bold text-slate-600">Ayer = Yesterday. (Repeat 100 times until you forget it tomorrow).</p>
              </div>
              <div className="bg-[#f3e5f5] p-5 rounded-2xl border-2 border-[#ab47bc]/20">
                 <p className="text-[10px] font-black text-[#ab47bc] uppercase mb-2">SSI Memory Seed</p>
                 <p className="font-black text-[#6a1b9a]">"I ate a <strong>Layer</strong> of cake <strong>Ayer</strong> (Yesterday)."</p>
              </div>
           </div>
           <p className="text-sm italic text-slate-500">
             The brain remembers the "Layer" because it involves a sensory image (cake). Because the sound "Layer" rhymes with "Ayer," the retrieval becomes instant.
           </p>
        </section>

        <section className="space-y-6">
          <h3 className="text-2xl font-black text-[#4b7d78] uppercase tracking-tight">AI and Phonetic Overlap</h3>
          <p>
            Our Gemini-3 integration specifically looks for <strong>Phonetic Overlaps</strong> between your native tongue and Spanish. This is why "Memory Seeds" work 5x better than standard lists. They aren't generic; they are engineered for the human auditory cortex. 
          </p>
          <div className="bg-[#fff9c4] p-8 rounded-[3rem] border-4 border-[#fdd835] space-y-4">
             <h4 className="font-black text-[#8e6b23] uppercase">Action: The Detail Modal</h4>
             <p className="text-sm text-[#8e6b23]">
               Every time you plant a seed, tap the card to open the Detail Modal. Read the "Memory Seed" aloud. This multimodal input—visual, auditory, and associative—is the triple-threat to forgetting.
             </p>
          </div>
        </section>
      </div>
    )
  },
  {
    id: 'srs-forgetting-curve',
    slug: 'spaced-repetition-science-forgetting-curve',
    category: 'strategy',
    title: 'The Spaced Repetition Formula: Why your Spanish fails after 72 hours',
    excerpt: 'Hermann Ebbinghaus discovered the "Forgetting Curve" in 1885. Learn how SSI uses a modified SM-2 algorithm to hack your memory retention.',
    description: 'Learn the science of Spaced Repetition (SRS) and how the Ebbinghaus Forgetting Curve affects Spanish learning. Understand the SSI algorithm logic.',
    keywords: ['SRS algorithm explanation', 'forgetting curve language learning', 'SM-2 vs SSI', 'long term memory hacks'],
    date: 'FEB 12, 2026',
    readTime: '6 min',
    level: 'Intermediate',
    tags: ['Memory Science', 'Algorithm'],
    content: (
      <div className="space-y-10 pb-20 leading-relaxed text-slate-700">
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-[#8bc34a]">
            <Timer size={24} />
            <span className="text-xs font-black uppercase tracking-[0.3em] opacity-80">Biological Optimization</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-[#4b7d78] uppercase tracking-tight leading-none">The Forgetting Curve Physics</h2>
          <p className="text-lg font-medium text-slate-600">
            In 1885, a psychologist named Hermann Ebbinghaus ran an experiment on himself. He discovered that without review, <strong>70% of new information is deleted within 24 to 72 hours.</strong>
          </p>
          <p>
            Your brain is an efficiency machine. It is constantly "Pruning" data it thinks is useless. If you learn the Spanish word for "Friend" (Amigo) but don't use it or see it again by tomorrow, your brain assumes it was a one-time noise and clears the synaptic path to save biological energy.
          </p>
        </section>

        <section className="bg-white border-4 border-[#f7f9e4] p-8 rounded-[3rem] shadow-xl relative overflow-hidden space-y-6">
           <div className="absolute right-[-20px] top-[-20px] opacity-5 rotate-12"><Database size={150} /></div>
           <h3 className="text-2xl font-black text-[#4b7d78] uppercase">The SM-2 Protocol: `easeFactor`</h3>
           <p className="text-sm leading-relaxed">
             Traditional "Linear" learning (page 1, then page 2) is the enemy of retention. Shelly Spanish Island uses a <strong>Spaced Repetition System (SRS)</strong> based on the SM-2 algorithm. 
           </p>
           <p className="text-sm font-bold">
             Here is how we calculate your "Watering Schedule":
           </p>
           <div className="space-y-3">
              {[
                { q: "Forgot", effect: "Level 1. EF -0.2", color: "bg-red-500", desc: "Resetting the biological path." },
                { q: "Hard", effect: "Interval x 1.2", color: "bg-orange-500", desc: "Shortening the next review." },
                { q: "Good", effect: "Interval x 2.4", color: "bg-green-500", desc: "The standard retention path." },
                { q: "Perfect", effect: "Interval x 3.0+", color: "bg-blue-500", desc: "Moving to Long-Term Memory." }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                   <div className={`w-3 h-3 rounded-full ${item.color}`} />
                   <div className="flex-1">
                      <p className="text-xs font-black uppercase text-slate-700">{item.q} → {item.effect}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{item.desc}</p>
                   </div>
                </div>
              ))}
           </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-2xl font-black text-[#4b7d78] uppercase tracking-tight">The "Desired Difficulty" Concept</h3>
          <p>
            The most effective moment to review a word is <strong>the exact moment you are about to forget it.</strong> If the review is too easy (you remember it instantly), the neural connection isn't forced to grow. If it's too late (you completely forgot), you are starting from zero.
          </p>
          <p>
            When you press "Water Garden" and see a word that makes you think for 2 seconds—that is the <strong>"Sweet Spot"</strong> of neuro-plasticity. That struggle is the physical process of the synapse thickening.
          </p>
        </section>

        <section className="bg-[#f0fdf4] p-8 rounded-[3rem] border-4 border-white shadow-sm space-y-4">
           <h3 className="text-xl font-black text-[#166534] uppercase flex items-center gap-2">
             <Lightbulb size={20} /> Consistency vs Intensity
           </h3>
           <p className="text-sm italic text-[#166534]">
             "Cramming" for 5 hours is like trying to water a plant with a fire hose. Most of the water runs off. The SSI Daily Goal is designed to give you 15-20 minutes of <strong>High-Recall Intensity</strong>. Small daily doses are what keep the "Ease Factor" high and your island green.
           </p>
        </section>
      </div>
    )
  },
  {
    id: 'modular-grammar-lego',
    slug: 'spanish-verb-conjugation-patterns-guide',
    category: 'grammar',
    title: 'Modular Grammar: Thinking in patterns to master Spanish verb conjugations',
    excerpt: 'Verbs are not lists to be memorized; they are Lego blocks to be assembled. Identify the suffixes and unlock 1,000+ words instantly.',
    description: 'Master Spanish verb conjugations by identifying modular patterns instead of memorizing tables. A guide to the -AR, -ER, and -IR Lego blocks of grammar.',
    keywords: ['Spanish verb patterns', 'regular verb hacks', 'fast grammar learning', 'Spanish grammar for beginners'],
    date: 'FEB 12, 2026',
    readTime: '7 min',
    level: 'Beginner',
    tags: ['Grammar Maps', 'Logic'],
    content: (
      <div className="space-y-10 pb-20 leading-relaxed text-slate-700">
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-[#0288d1]">
            <Layers size={24} />
            <span className="text-xs font-black uppercase tracking-[0.3em] opacity-80">Structural Logic</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-[#4b7d78] uppercase tracking-tight">The LEGO Logic of Spanish</h2>
          <p className="text-lg font-medium text-slate-600">
            Traditional textbooks make you memorize "Conjugation Tables." We suggest a different approach: <strong>Modular Assembly.</strong> 
          </p>
          <p>
            Spanish is a <em>High-Inflection</em> language. This means the end of the word changes depending on WHO is doing the action. While this seems hard, it is actually a massive shortcut. In English, if you hear "He speaks," you have the pronoun "He." In Spanish, if you hear "Habl-a," the "a" ending already tells you it's a "He"—you don't even need the pronoun!
          </p>
        </section>

        <section className="bg-[#e1f5fe] p-8 rounded-[3.5rem] border-4 border-white shadow-md space-y-6 relative overflow-hidden">
           <div className="absolute right-[-20px] top-[-20px] opacity-10 rotate-12"><Construction size={150} /></div>
           <h3 className="text-2xl font-black text-[#01579b] uppercase">The 3 Tribal Suffixes</h3>
           <p className="text-sm">Every regular Spanish verb belongs to one of three tribes. If you know the tribal code, you unlock thousands of verbs instantly:</p>
           
           <div className="space-y-4 relative z-10">
              <div className="bg-white/80 p-5 rounded-2xl border-2 border-white shadow-sm">
                 <div className="flex justify-between items-center mb-2">
                    <span className="font-black text-[#0288d1] text-lg">-AR Tribe</span>
                    <span className="text-[9px] font-black text-slate-400">90% of new verbs</span>
                 </div>
                 <p className="text-xs text-slate-600">Common endings: <strong>-o, -as, -a, -amos, -áis, -an</strong>. (Example: Habl-ar)</p>
              </div>
              <div className="bg-white/80 p-5 rounded-2xl border-2 border-white shadow-sm">
                 <div className="flex justify-between items-center mb-2">
                    <span className="font-black text-[#0288d1] text-lg">-ER / -IR Tribe</span>
                    <span className="text-[9px] font-black text-slate-400">The "Sibling" Tribe</span>
                 </div>
                 <p className="text-xs text-slate-600">Common endings: <strong>-o, -es, -e, -emos, -éis, -en</strong>. (Example: Com-er)</p>
              </div>
           </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-2xl font-black text-[#4b7d78] uppercase tracking-tight">The "Yo" Shortcut</h3>
          <p>
            For a beginner, the <strong>"Yo" (I)</strong> form is the most important. Notice something? Whether it is -AR, -ER, or -IR, the "I" form almost always ends in <strong>-O</strong>.
          </p>
          <div className="flex wrap gap-4 justify-center py-4">
             <div className="bg-white px-6 py-4 rounded-2xl border-2 border-[#e0d9b4] shadow-sm"><span className="text-slate-400 text-xs">Hablo</span></div>
             <div className="bg-white px-6 py-4 rounded-2xl border-2 border-[#e0d9b4] shadow-sm"><span className="text-slate-400 text-xs">Como</span></div>
             <div className="bg-white px-6 py-4 rounded-2xl border-2 border-[#e0d9b4] shadow-sm"><span className="text-slate-400 text-xs">Vivo</span></div>
             <div className="bg-white px-6 py-4 rounded-2xl border-2 border-[#e0d9b4] shadow-sm"><span className="text-slate-400 text-xs">Bebo</span></div>
          </div>
          <p>
            When you are starting out, don't worry about the "Vosotros" form (used only in Spain) or complex irregulars. Focus on the <strong>Present Tense Suffixes</strong>. In the SSI "Grammar Pocket" within each word detail, we highlight these suffix blocks so your eye learns to separate the <em>Root</em> from the <em>Modular Tail</em>.
          </p>
        </section>

        <section className="bg-slate-900 p-8 rounded-[3rem] text-white space-y-4">
           <h3 className="text-xl font-black uppercase text-[#ffa600] flex items-center gap-2">
             <Route size={20} /> Action: Modular Sentence Mining
           </h3>
           <p className="text-sm opacity-80 leading-relaxed">
             Next time you see a verb, don't try to "Memorize" it. Use the LEGO approach:
             1. Identify the Tribe (-AR, -ER, or -IR).
             2. Chop off the tail.
             3. Snap on the "-o" to say what YOU are doing.
             Master this 3-step assembly line, and you will start speaking 3x faster than traditional students.
           </p>
        </section>
      </div>
    )
  },
  {
    id: 'sentence-mining-i-plus-1',
    slug: 'sentence-mining-polyglot-fluency-secret',
    category: 'strategy',
    title: 'Sentence Mining: Capturing functional Spanish directly from the wild',
    excerpt: 'Polyglots don’t learn words; they mine sentences. Discover the "i+1" hypothesis and why context is the ultimate memory glue.',
    description: 'Learn the Sentence Mining technique used by world-class polyglots. Understand the i+1 input hypothesis and how to use context to master Spanish.',
    keywords: ['Sentence mining Spanish', 'i+1 hypothesis language learning', 'learning Spanish in context', 'functional fluency tips'],
    date: 'FEB 14, 2026',
    readTime: '10 min',
    level: 'Expert',
    tags: ['Polyglot Secrets', 'Contextual Learning'],
    content: (
      <div className="space-y-10 pb-20 leading-relaxed text-slate-700">
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-[#8bc34a]">
            <Anchor size={24} />
            <span className="text-xs font-black uppercase tracking-[0.3em] opacity-80">Syntactic Anchoring</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-[#4b7d78] uppercase tracking-tight">The Death of the Word List</h2>
          <p>
            If you learn the word <em>"Llave" (Key)</em> in isolation, your brain has nowhere to "store" it. It is a floating island. But if you learn <em>"Busco mi llave" (I am looking for my key)</em>, you have built a bridge.
          </p>
          <p>
            <strong>Sentence Mining</strong> is the practice of finding meaningful, high-utility sentences where you know every word <em>except one</em>. This is Stephen Krashen’s famous <strong>i+1 Hypothesis</strong>: we acquire language when we understand messages that are just one step beyond our current level.
          </p>
        </section>

        <section className="bg-[#f1f8e9] p-8 rounded-[3.5rem] border-4 border-white shadow-md space-y-6">
           <h3 className="text-2xl font-black text-[#33691e] uppercase">The SSI Island Challenge</h3>
           <p className="text-sm">In the Word Detail Modal, we provide an "Island Challenge" box. This is your personal mining rig. Here is the protocol:</p>
           <div className="space-y-4">
              <div className="bg-white/60 p-5 rounded-2xl border border-[#c5e1a5]">
                 <span className="font-black text-[#8bc34a] text-xs uppercase">Step 1: The Seed</span>
                 <p className="text-xs text-slate-600 mt-1">Take the new word you just harvested (e.g., <em>"Comer"</em>).</p>
              </div>
              <div className="bg-white/60 p-5 rounded-2xl border border-[#c5e1a5]">
                 <span className="font-black text-[#8bc34a] text-xs uppercase">Step 2: The Scaffolding</span>
                 <p className="text-xs text-slate-600 mt-1">Add a high-freq word you already know (e.g., <em>"Quiero"</em>).</p>
              </div>
              <div className="bg-white/60 p-5 rounded-2xl border border-[#c5e1a5]">
                 <span className="font-black text-[#8bc34a] text-xs uppercase">Step 3: The Mine</span>
                 <p className="text-xs text-slate-600 mt-1">Build: <strong>"Quiero comer."</strong> (I want to eat).</p>
              </div>
           </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-2xl font-black text-[#4b7d78] uppercase tracking-tight">The "A-Ha!" Neuro-Moment</h3>
          <p>
            When you successfully construct a sentence, your brain releases a micro-dose of dopamine. This isn't just pleasure; it's a <strong>"Save Signature."</strong> It tells your hippocampus: "This combination of sounds resulted in meaning. Store it permanently." 
          </p>
          <p className="font-bold">
            Stop being a word collector. Start being a meaning miner.
          </p>
        </section>
      </div>
    )
  },
  {
    id: 'social-rapport-slang',
    slug: 'spanish-slang-social-rapport',
    category: 'strategy',
    title: 'Social Rapport: Why Slang is the fastest bridge to native interaction',
    excerpt: 'Textbooks teach you to be correct; slang teaches you to be human. Master the 5 essential "Social Fillers" to blend in instantly.',
    description: 'Bypass the "tourist" stage by mastering Spanish slang and social rapport. Learn how cultural pragmatics can boost your conversational confidence.',
    keywords: ['Spanish slang for beginners', 'social rapport Spanish', 'real world Spanish', 'Isla slang SSI'],
    date: 'FEB 15, 2026',
    readTime: '8 min',
    level: 'Beginner',
    tags: ['Culture', 'Social Hacks'],
    content: (
      <div className="space-y-10 pb-20 leading-relaxed text-slate-700">
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-[#ff7b72]">
            <Radio size={24} />
            <span className="text-xs font-black uppercase tracking-[0.3em] opacity-80">Pragmatic Intelligence</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-[#4b7d78] uppercase tracking-tight">The "Uncanny Valley" of Spanish</h2>
          <p>
            Have you ever met someone who speaks "Perfect" but robotic English? It feels slightly off. Spanish is the same. If you only say "Hola, ¿cómo estás?", you are in the <strong>Linguistic Uncanny Valley</strong>.
          </p>
          <p>
            Slang isn't just "informal speech." In Spanish culture, slang is <strong>Social Glue</strong>. It signals that you aren't just an outsider—you are trying to understand the <em>soul</em> of the language.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {[
             { word: "¡Vale!", origin: "Spain", meaning: "The ultimate 'Yes/Ok'. Use it as a filler, a question, and an answer." },
             { word: "¡Chévere!", origin: "LatAm", meaning: "The vibe checker. Everything good is Chévere." },
             { word: "¡Guay!", origin: "Spain", meaning: "Used by the youth. If a car or a plan is Guay, it is cool." },
             { word: "¡No manches!", origin: "Mexico", meaning: "The 'No way!'. Use it when surprised." }
           ].map((item, i) => (
             <div key={i} className="bg-white p-6 rounded-[2.5rem] border-4 border-[#fff1f0] shadow-sm">
                <div className="flex items-center justify-between mb-2">
                   <h4 className="text-xl font-black text-[#ff7b72]">{item.word}</h4>
                   <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{item.origin}</span>
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.meaning}</p>
             </div>
           ))}
        </section>

        <section className="space-y-6">
          <h3 className="text-2xl font-black text-[#4b7d78] uppercase tracking-tight">Strategy: The Island Slang Card</h3>
          <p>
            On your Dashboard, look for the **"Island Slang"** section. We rotate these daily. They aren't just for reading; they are for <strong>"Linguistic Camouflage."</strong> Next time you interact with a Spanish speaker, drop a "¡Vale!" instead of a "Sí." Watch their face light up. 
          </p>
          <p className="text-sm italic">
            Confessions of a Polyglot: "Slang is the only way to bypass the 'foreigner barrier' and reach the 'human connection' level."
          </p>
        </section>
      </div>
    )
  },
  {
    id: 'atomic-habits-protocol',
    slug: 'micro-learning-spanish-habits-consistency',
    category: 'strategy',
    title: 'Atomic Spanish: Building a 10-minute daily protocol for rapid growth',
    excerpt: 'Consistency beats intensity. Every single time. Learn how to stack SSI reviews onto your existing morning ritual.',
    description: 'Use the Fogg Behavior Model to build a bulletproof Spanish learning habit. Learn the 10-minute protocol for consistent vocabulary growth.',
    keywords: ['Language learning habits', 'consistency in Spanish', 'atomic habits language', 'SSI 10 minute protocol'],
    date: 'FEB 16, 2026',
    readTime: '7 min',
    level: 'Beginner',
    tags: ['Psychology', 'Routine'],
    content: (
      <div className="space-y-10 pb-20 leading-relaxed text-slate-700">
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-[#ffa600]">
            <Flame size={24} />
            <span className="text-xs font-black uppercase tracking-[0.3em] opacity-80">Behavioral Design</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-[#4b7d78] uppercase tracking-tight">Motivation is a Trap</h2>
          <p>
            Motivation is a fickle friend. It arrives when you buy a new app and disappears by Tuesday. To master Spanish, you don't need motivation; you need <strong>Frictionless Systems</strong>.
          </p>
          <p>
            The <strong>Fogg Behavior Model</strong> states that Behavior = Motivation + Ability + Prompt. If you want to study Spanish, we make it "Tiny" (Ability) and give you a Daily Goal (Prompt).
          </p>
        </section>

        <section className="bg-white border-4 border-[#f7f9e4] p-8 rounded-[3rem] shadow-xl space-y-6 relative overflow-hidden">
           <h3 className="text-2xl font-black text-[#4b7d78] uppercase flex items-center gap-2">
             <Repeat size={20} className="text-[#ffa600]" /> The "Coffee Stack"
           </h3>
           <p className="text-sm">
             The most successful SSI citizens use <strong>Habit Stacking</strong>. They don't "Find time" for Spanish; they "Glue" it to something they already do.
           </p>
           <div className="bg-[#fffdf5] p-6 rounded-2xl border-2 border-dashed border-[#e0d9b4] space-y-3">
              <p className="text-xs font-bold text-slate-600">The Script:</p>
              <p className="text-sm font-black text-[#4b7d78]">"AFTER I pour my first cup of coffee, I WILL open Shelly Spanish Island and Water 5 words."</p>
           </div>
           <p className="text-xs text-slate-400 italic">This anchor (Coffee) triggers the behavior (SSI) instantly without using willpower.</p>
        </section>

        <section className="space-y-6">
          <h3 className="text-2xl font-black text-[#4b7d78] uppercase tracking-tight">The 10-Minute Limit</h3>
          <p>
            Paradoxically, we suggest you <strong>Limit</strong> your study time. If you do too much, your brain associates Spanish with exhaustion. If you stop while you are still curious, you protect the dopamine loop. Use the "Daily Harvest" as your finish line. Once the progress bar hits 100%, close the app and walk away.
          </p>
        </section>
      </div>
    )
  },
  {
    id: 'semantic-10-verbs',
    slug: '10-verbs-spanish-functional-fluency',
    category: 'grammar',
    title: 'The Semantic 10: The high-utility verbs that power most Spanish sentences',
    excerpt: 'There are 10 verbs that act as the CPU of the Spanish language. Master these, and you unlock 60% of all potential expressions.',
    description: 'Master the 10 essential Spanish verbs that drive the majority of daily communication. Learn why high-utility verbs are the semantic core of fluency.',
    keywords: ['Essential Spanish verbs', 'high utility Spanish vocabulary', 'functional fluency Spanish', 'SSI core verbs'],
    date: 'FEB 17, 2026',
    readTime: '12 min',
    level: 'Beginner',
    tags: ['Linguistic Core', 'Pareto'],
    content: (
      <div className="space-y-10 pb-20 leading-relaxed text-slate-700">
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-[#0288d1]">
            <Target size={24} />
            <span className="text-xs font-black uppercase tracking-[0.3em] opacity-80">Semantic Priority</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-[#4b7d78] uppercase tracking-tight">The DNA of Communication</h2>
          <p>
            Language is like a solar system. Some words are tiny asteroids, and some are massive suns. The <strong>"Semantic 10"</strong> are the suns around which everything else orbits. 
          </p>
          <p>
            In Spanish, if you know the irregular present tense forms of these 10 verbs, you are more "fluent" than someone who knows 1,000 nouns but can't conjugate a single verb. Verbs are the <strong>Engines</strong> of sentences.
          </p>
        </section>

        <section className="bg-[#e1f5fe] p-8 rounded-[3.5rem] border-4 border-white shadow-md space-y-6">
           <h3 className="text-2xl font-black text-[#01579b] uppercase">The Power Ranking</h3>
           <div className="space-y-3">
              {[
                { v: "Ser / Estar", role: "Identity & State", hack: "If you exist, you need these." },
                { v: "Tener", role: "Possession & Feeling", hack: "Used for hunger, thirst, and age!" },
                { v: "Hacer", role: "Activity", hack: "The 'Do/Make' universal engine." },
                { v: "Ir", role: "Intention", hack: "Unlock the future with 'Ir a'." },
                { v: "Poder", role: "Capability", hack: "Permission and ability." }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 bg-white/80 p-4 rounded-2xl">
                   <div className="w-6 h-6 rounded-full bg-[#0288d1] text-white flex items-center justify-center font-black text-[10px]">{i+1}</div>
                   <div className="flex-1">
                      <p className="font-black text-[#4b7d78] uppercase text-xs">{item.v}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">{item.role} → {item.hack}</p>
                   </div>
                </div>
              ))}
           </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-2xl font-black text-[#4b7d78] uppercase tracking-tight">The "Cheat Code" for Beginners</h3>
          <p>
            Many of these verbs are irregular. That is why they are in the **Supply Crate** from Day 1. Don't avoid them because they are "hard." Embrace them because they are <strong>High-Leverage</strong>. Spending 1 hour on "Tener" is worth 100 hours on "Vegetable names." 
          </p>
        </section>
      </div>
    )
  },
  {
    id: 'mirror-protocol-ai',
    slug: 'ai-mirror-protocol-error-correction',
    category: 'ai',
    title: 'The Mirror Protocol: Using AI Feedback to bypass the embarrassment of mistakes',
    excerpt: 'Mistakes are painful because of judgment. Learn how the SSI "Recast" system mimics mother-child interaction for stress-free fluency.',
    description: 'Learn the science of Recast Feedback and how the SSI Mirror Protocol uses AI to correct Spanish errors without the stress of formal grading.',
    keywords: ['AI language feedback', 'Recast learning Spanish', 'error correction AI', 'Mirror Protocol SSI'],
    date: 'FEB 18, 2026',
    readTime: '9 min',
    level: 'Intermediate',
    tags: ['AI Tech', 'Pedagogy'],
    content: (
      <div className="space-y-10 pb-20 leading-relaxed text-slate-700">
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-[#6a1b9a]">
            <Brain size={24} />
            <span className="text-xs font-black uppercase tracking-[0.3em] opacity-80">Adaptive Pedagogy</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-[#4b7d78] uppercase tracking-tight">The "Red Pen" Trauma</h2>
          <p>
            Why do adults struggle with languages while children thrive? One reason is the <strong>Affective Filter</strong>. When a teacher marks your sentence with a red X, your brain enters "Protection Mode," which blocks learning.
          </p>
          <p>
            In the Shelly Spanish Island app, we use the <strong>Mirror Protocol (AI Recast)</strong>. When you use the "Island Challenge" to write a sentence, the AI doesn't say "Wrong." It says "I hear you! Did you mean..." and provides the correct version.
          </p>
        </section>

        <section className="bg-white border-4 border-[#f3e5f5] p-8 rounded-[3rem] shadow-xl space-y-6 relative overflow-hidden">
           <div className="absolute right-[-10px] top-[-10px] opacity-5"><MessageSquareText size={120} /></div>
           <h3 className="text-2xl font-black text-[#6a1b9a] uppercase">Recasting: The Mother's Logic</h3>
           <p className="text-sm">When a toddler says "I goed home," a mother says "Yes, you <strong>went</strong> home." This is a <em>Recast</em>. It provides the correct data while acknowledging the <em>intent</em>.</p>
           
           <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border-l-4 border-slate-300">
                 <p className="text-[10px] font-black text-slate-400 uppercase">You say:</p>
                 <p className="font-bold text-slate-600">"Yo comer manzana." (Broken)</p>
              </div>
              <div className="bg-[#f3e5f5] p-4 rounded-xl border-l-4 border-[#ab47bc]">
                 <p className="text-[10px] font-black text-[#ab47bc] uppercase">SSI AI Recast:</p>
                 <p className="font-black text-[#6a1b9a]">"¡Fantástico! You meant: <strong>Yo como una manzana.</strong>"</p>
              </div>
           </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-2xl font-black text-[#4b7d78] uppercase tracking-tight">Building the Confidence Loop</h3>
          <p>
            The Mirror Protocol is designed to keep your "Affective Filter" low. By removing the fear of being "Wrong," we encourage you to experiment. The more you experiment, the more <em>Recasts</em> you receive. The more Recasts you receive, the faster your brain aligns with native Spanish logic.
          </p>
          <p className="font-black uppercase tracking-widest text-[#ffa600]">
            Mistakes are not errors; they are data points for the AI to mirror back your potential.
          </p>
        </section>
      </div>
    )
  }
];
