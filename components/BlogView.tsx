import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Newspaper, Calendar, ArrowRight, Clock, 
  Compass, BrainCircuit, Target, 
  ArrowLeft, Share2, Search, Sparkles, 
  Flame, Copy, Check, Leaf,
  Microscope, BarChart3, Radio, Zap, Users, GraduationCap, History, ChevronRight
} from 'lucide-react';
import { playClick, playSwish, playSparkle } from '../utils/sfx';
import { useTranslation } from 'react-i18next';
import { BLOG_POSTS, BlogTab, Post } from '../data/blogPosts';
import SEO from './SEO';
import { useIslandStore } from '../store/useIslandStore';
import { getTypeTheme } from '../utils/theme';

const Breadcrumbs: React.FC<{ post?: Post }> = ({ post }) => {
  const navigate = useNavigate();
  return (
    <nav className="flex items-center gap-2 mb-6 text-[9px] font-black uppercase tracking-widest text-slate-400">
      <button onClick={() => navigate('/stories')} className="hover:text-[#4b7d78] transition-colors">Stories</button>
      {post && (
        <>
          <ChevronRight size={10} className="opacity-40" />
          <span className="text-[#ffa600] opacity-80">{post.category}</span>
          <ChevronRight size={10} className="opacity-40" />
          <span className="text-slate-500 truncate max-w-[120px]">{post.title}</span>
        </>
      )}
    </nav>
  );
};

const IslandSeedSnapshot: React.FC<{ wordIds: string[] }> = ({ wordIds }) => {
  const { wordMap, openModal } = useIslandStore();
  const { t } = useTranslation();

  const relatedWords = useMemo(() => 
    wordIds.map(id => wordMap.get(id)).filter(Boolean),
  [wordIds, wordMap]);

  if (relatedWords.length === 0) return null;

  return (
    <div className="mt-16 pt-10 border-t-4 border-[#f7f9e4] animate-fadeIn">
      <div className="flex items-center gap-3 mb-8 px-2">
         <div className="bg-[#ffa600] p-2 rounded-xl text-white shadow-sm">
            <Leaf size={18} fill="currentColor" />
         </div>
         <div className="text-left">
            <h3 className="text-lg font-black text-[#4b7d78] uppercase tracking-tight">Strategy Seedlings</h3>
            <p className="text-[10px] font-bold text-[#8d99ae] uppercase tracking-widest">Master words discussed in this guide</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {relatedWords.map((word: any) => {
          const theme = getTypeTheme(word);
          return (
            <button
              key={word.id}
              onClick={() => { playClick(); openModal('WORD_DETAIL', word); }}
              className="bg-white p-6 rounded-[2.5rem] border-4 border-[#f7f9e4] shadow-sm hover:shadow-md hover:border-[#ffa600]/20 transition-all flex items-center justify-between group text-left"
            >
              <div className="space-y-1">
                 <span style={{ color: theme.main }} className="text-[8px] font-black uppercase tracking-[0.2em]">{word.type}</span>
                 <h4 className="text-2xl font-black text-[#4b7d78] group-hover:text-[#ffa600] transition-colors">{word.s}</h4>
                 <p className="text-xs font-bold text-[#8d99ae] italic">{t(`vocab.${word.id}.t`, { defaultValue: word.t })}</p>
              </div>
              <div className="bg-[#f7f9e4] p-3 rounded-2xl group-hover:bg-[#ffa600] group-hover:text-white transition-all">
                 <ArrowRight size={20} />
              </div>
            </button>
          );
        })}
      </div>
      
      <div className="mt-8 bg-[#fff9c4] p-5 rounded-[2rem] border-2 border-dashed border-[#fdd835]/50 flex items-start gap-4">
         <div className="p-2 bg-white rounded-xl shadow-sm shrink-0"><Sparkles size={16} className="text-[#ffa600]" /></div>
         <p className="text-[11px] font-bold text-[#8e6b23] leading-relaxed">
            <strong>Pro Tip:</strong> Tapping these seeds will open the interactive Island Card. You can use our AI Mirror Protocol to test if you've internalized the neuroscience strategies mentioned above!
         </p>
      </div>
    </div>
  );
};

const BlogView: React.FC = () => {
  const { t } = useTranslation();
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<BlogTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter(post => {
      const matchesTab = activeTab === 'all' || post.category === activeTab;
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  const selectedPost = useMemo(() => 
    BLOG_POSTS.find(p => p.slug === slug), 
  [slug]);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.querySelector('main');
      if (element) {
        const totalHeight = element.scrollHeight - element.clientHeight;
        const progress = (element.scrollTop / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };
    const mainEl = document.querySelector('main');
    mainEl?.addEventListener('scroll', handleScroll);
    return () => mainEl?.removeEventListener('scroll', handleScroll);
  }, [slug]);

  const handleCopyLink = () => {
    playSparkle();
    const url = `${window.location.origin}/stories/${selectedPost?.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // --- Article View ---
  if (selectedPost) {
    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BlogPosting",
          "headline": selectedPost.title,
          "description": selectedPost.description,
          "datePublished": selectedPost.date,
          "author": { "@type": "Person", "name": "SSI Editorial" },
          "image": "https://ssisland.space/og-preview.png",
          "publisher": { "@type": "Organization", "name": "Shelly Spanish Island" },
          "about": selectedPost.relatedWordIds?.map(id => ({
             "@type": "DefinedTerm",
             "name": id,
             "inDefinedTermSet": "https://ssisland.space/vocabulary"
          }))
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Stories", "item": "https://ssisland.space/stories" },
            { "@type": "ListItem", "position": 2, "name": selectedPost.category, "item": `https://ssisland.space/stories?tab=${selectedPost.category}` },
            { "@type": "ListItem", "position": 3, "name": selectedPost.title, "item": `https://ssisland.space/stories/${selectedPost.slug}` }
          ]
        }
      ]
    };

    return (
      <div className="max-w-2xl mx-auto animate-fadeIn pb-32 px-2">
        <SEO 
          title={selectedPost.title}
          description={selectedPost.description}
          keywords={selectedPost.keywords}
          url={`https://ssisland.space/stories/${selectedPost.slug}`}
          type="article"
          jsonLd={jsonLd}
        />

        <div className="fixed top-0 left-0 right-0 md:left-72 h-1 bg-slate-100/30 z-[60]">
           <div className="h-full bg-gradient-to-r from-[#ffa600] to-[#ff7b72] transition-all duration-150" style={{ width: `${scrollProgress}%` }} />
        </div>

        <Breadcrumbs post={selectedPost} />

        <button 
          onClick={() => { playSwish(); navigate('/stories'); }}
          className="flex items-center gap-2 text-[#8d99ae] font-black text-[9px] uppercase tracking-widest mb-4 hover:text-[#4b7d78] transition-all py-1.5 px-3 bg-white rounded-full shadow-sm w-fit active:scale-95 border border-slate-100"
        >
          <ArrowLeft size={10} /> Back to Archives
        </button>

        <header className="space-y-4 mb-8">
          <div className="flex items-center gap-2">
            <span className="bg-[#ffa600] text-white px-2.5 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest shadow-sm">
              {selectedPost.level}
            </span>
            <span className="text-[#8d99ae] text-[8px] font-black uppercase tracking-widest">
              {selectedPost.date}
            </span>
          </div>
          <h1 className="text-2xl md:text-5xl font-black text-[#4b7d78] tracking-tight leading-tight uppercase">
            {selectedPost.title}
          </h1>
          <div className="flex items-center gap-4 text-[#8d99ae] text-[8px] font-black uppercase tracking-widest border-t border-dashed border-slate-100 pt-4">
             <div className="flex items-center gap-1.5"><Clock size={10} className="text-[#ffa600]" /> {selectedPost.readTime} Read</div>
             <button onClick={handleCopyLink} className={`ml-auto flex items-center gap-1.5 transition-colors ${copiedLink ? 'text-[#78c850]' : 'text-[#4b7d78]'}`}>
                {copiedLink ? <Check size={10} /> : <Share2 size={10} />}
                <span>{copiedLink ? 'Link Copied!' : 'Share Story'}</span>
             </button>
          </div>
        </header>

        <div className="prose prose-slate max-w-none">
           {selectedPost.content}
        </div>

        {/* Dynamic Bridge: Word Cards */}
        {selectedPost.relatedWordIds && (
          <IslandSeedSnapshot wordIds={selectedPost.relatedWordIds} />
        )}

        <footer className="mt-12 pt-8 border-t border-dashed border-slate-100 text-center space-y-4">
           <button 
             onClick={() => { playSwish(); navigate('/stories'); }}
             className="bg-[#4b7d78] text-white px-8 py-3.5 rounded-full font-black text-[9px] uppercase tracking-[0.2em] shadow-lg active:scale-95 w-full md:w-auto"
           >
             Return to Archives
           </button>
        </footer>
      </div>
    );
  }

  // --- List View ---
  return (
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-10 animate-fadeIn pb-32">
      <SEO 
        title="Island Stories - Strategic Spanish Learning"
        description="Deep dives into neuro-linguistic Spanish learning, RAE corpus data, and AI-powered fluency protocols."
        url="https://ssisland.space/stories"
      />

      <Breadcrumbs />

      <header className="space-y-4 text-center md:text-left">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
           <div>
              <h1 className="text-3xl md:text-8xl font-black text-[#4b7d78] tracking-tighter leading-none">
                 Island <span className="text-[#ffa600]">Stories</span>.
              </h1>
              <p className="text-[9px] font-black text-[#8d99ae] uppercase tracking-[0.2em] mt-1 md:mt-4 opacity-70">
                 Linguistic Intelligence & Strategy
              </p>
           </div>

           <div className="w-full md:w-64">
              <div className="relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8d99ae]/50" size={14} />
                 <input 
                   type="text" 
                   placeholder="Search..." 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-[#e0d9b4] rounded-xl focus:outline-none focus:border-[#4b7d78] font-bold text-xs text-[#4b7d78] shadow-sm"
                 />
              </div>
           </div>
        </div>
      </header>

      <div className="flex overflow-x-auto no-scrollbar gap-2 sticky top-2 z-40 bg-white/80 backdrop-blur-xl p-1.5 rounded-xl border border-[#e0d9b4]/20 shadow-lg">
        {[
          { id: 'all', label: 'All', icon: Newspaper },
          { id: 'strategy', label: 'Strategy', icon: Target },
          { id: 'grammar', label: 'Maps', icon: Compass },
          { id: 'ai', label: 'Mirror', icon: BrainCircuit },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => { playSwish(); setActiveTab(tab.id as BlogTab); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-black text-[8px] uppercase transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-[#4b7d78] text-white shadow-sm' : 'text-[#8d99ae] hover:bg-slate-50'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPosts.map((post) => (
          <article 
            key={post.id} 
            onClick={() => { playClick(); navigate(`/stories/${post.slug}`); }}
            className="group cursor-pointer bg-white rounded-3xl border-2 border-[#e0d9b4] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 relative"
          >
            <div className="p-4 md:p-6 space-y-3">
               <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                     <span className="bg-[#f7f9e4] text-[#4b7d78] px-2 py-0.5 rounded text-[7px] font-black uppercase border border-[#e0d9b4]">
                        {post.category}
                     </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#8d99ae] text-[7px] font-black uppercase">
                     <Clock size={10} /> {post.readTime}
                  </div>
               </div>

               <div className="space-y-1.5">
                  <h2 className="text-lg md:text-2xl font-black text-[#4b7d78] group-hover:text-[#ffa600] transition-colors leading-tight tracking-tight uppercase line-clamp-2">
                     {post.title}
                  </h2>
                  <p className="text-slate-400 font-bold text-[10px] md:text-sm leading-snug line-clamp-2">
                     {post.excerpt}
                  </p>
               </div>

               <div className="pt-3 flex items-center justify-between border-t border-dashed border-slate-100">
                  <div className="text-[8px] font-black text-[#8d99ae] uppercase opacity-50">
                     {post.date}
                  </div>
                  <div className="flex items-center gap-1 text-[#ffa600] font-black text-[9px] uppercase group-hover:translate-x-1 transition-transform">
                     Read <ArrowRight size={12} />
                  </div>
               </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default BlogView;