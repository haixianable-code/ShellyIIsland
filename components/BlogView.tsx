
import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Newspaper, Clock, 
  Compass, BrainCircuit, Target, 
  ArrowLeft, Share2, Search, Check, ArrowRight
} from 'lucide-react';
import { playClick, playSwish, playSparkle } from '../utils/sfx';
import { useTranslation } from 'react-i18next';
import { BLOG_POSTS, BlogTab } from '../data/blogPosts';
import { getBilingualText } from './Bilingual'; // Import helper
import SEO, { BreadcrumbItem } from './SEO';

const BlogView: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<BlogTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  // Helper to resolve text based on current language
  const resolveText = (content: string | { en: string; zh: string }) => {
    return getBilingualText(content, i18n.language);
  };

  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter(post => {
      const matchesTab = activeTab === 'all' || post.category === activeTab;
      
      const title = resolveText(post.title).toLowerCase();
      const excerpt = resolveText(post.excerpt).toLowerCase();
      const query = searchQuery.toLowerCase();

      const matchesSearch = title.includes(query) || excerpt.includes(query);
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery, i18n.language]);

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
    const isProduction = window.location.hostname === 'ssisland.space';
    const url = isProduction 
      ? `${window.location.origin}/stories/${selectedPost?.slug}`
      : `${window.location.origin}/#/stories/${selectedPost?.slug}`;
    
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // --- Article View ---
  if (selectedPost) {
    const displayTitle = resolveText(selectedPost.title);
    const displayExcerpt = resolveText(selectedPost.excerpt);
    const articleUrl = `https://ssisland.space/stories/${selectedPost.slug}`;
    
    const blogPostingJsonLd = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": displayTitle,
      "description": selectedPost.description,
      "datePublished": selectedPost.date,
      "author": { "@type": "Person", "name": "SSI Editorial" },
      "image": "https://ssisland.space/og-preview.png",
      "publisher": { "@type": "Organization", "name": "Shelly Spanish Island" }
    };

    const breadcrumbs: BreadcrumbItem[] = [
      { name: 'Home', item: '/' },
      { name: 'Stories', item: '/stories' },
      { name: displayTitle, item: `/stories/${selectedPost.slug}` }
    ];

    // Conditional Extra Schema
    const extraSchema = [];
    if (selectedPost.id === 'neuroscience-fluency') {
       extraSchema.push({
         "@context": "https://schema.org",
         "@type": "FAQPage",
         "mainEntity": [{
           "@type": "Question",
           "name": "Why do I translate Spanish in my head?",
           "acceptedAnswer": {
             "@type": "Answer",
             "text": "This is called Translation Interference. Your brain creates a detour through your native language instead of direct neural concept-to-Spanish mapping."
           }
         }]
       });
    }

    return (
      <article className="max-w-2xl mx-auto animate-fadeIn pb-32 px-2" role="main">
        <SEO 
          title={displayTitle}
          description={selectedPost.description}
          keywords={selectedPost.keywords}
          url={articleUrl}
          type="article"
          jsonLd={[blogPostingJsonLd, ...extraSchema]}
          breadcrumbs={breadcrumbs}
          themeColor="#4b7d78"
        />

        <div className="fixed top-0 left-0 right-0 md:left-72 h-1 bg-slate-100/30 z-[60]" aria-hidden="true">
           <div className="h-full bg-gradient-to-r from-[#ffa600] to-[#ff7b72] transition-all duration-150" style={{ width: `${scrollProgress}%` }} />
        </div>

        <button 
          onClick={() => { playSwish(); navigate('/stories'); }}
          aria-label="Back to stories list"
          className="flex items-center gap-2 text-[#8d99ae] font-black text-[9px] uppercase tracking-widest mb-4 hover:text-[#4b7d78] transition-all py-1.5 px-3 bg-white rounded-full shadow-sm w-fit active:scale-95 border border-slate-100"
        >
          <ArrowLeft size={10} aria-hidden="true" /> Back to Archives
        </button>

        <header className="space-y-4 mb-8">
          <div className="flex items-center gap-2">
            <span className="bg-[#ffa600] text-white px-2.5 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest shadow-sm">
              {selectedPost.level}
            </span>
            <time className="text-[#8d99ae] text-[8px] font-black uppercase tracking-widest" dateTime={new Date(selectedPost.date).toISOString().split('T')[0]}>
              {selectedPost.date}
            </time>
          </div>
          <h1 className="text-2xl md:text-5xl font-black text-[#4b7d78] tracking-tight leading-tight uppercase">
            {displayTitle}
          </h1>
          <div className="flex items-center gap-4 text-[#8d99ae] text-[8px] font-black uppercase tracking-widest border-t border-dashed border-slate-100 pt-4">
             <div className="flex items-center gap-1.5">
                <Clock size={10} className="text-[#ffa600]" aria-hidden="true" /> {selectedPost.readTime} Read
             </div>
             <button 
                onClick={handleCopyLink} 
                aria-label="Copy article link to clipboard"
                className={`ml-auto flex items-center gap-1.5 transition-colors ${copiedLink ? 'text-[#78c850]' : 'text-[#4b7d78]'}`}
             >
                {copiedLink ? <Check size={10} /> : <Share2 size={10} />}
                <span>{copiedLink ? 'Link Copied!' : 'Share Story'}</span>
             </button>
          </div>
        </header>

        <section className="prose prose-slate max-w-none mb-12">
           {selectedPost.content}
        </section>

        <footer className="mt-12 pt-8 border-t border-dashed border-slate-100 text-center space-y-4">
           <button 
             onClick={() => { playSwish(); navigate('/stories'); }}
             aria-label="Return to library"
             className="bg-[#4b7d78] text-white px-8 py-3.5 rounded-full font-black text-[9px] uppercase tracking-[0.2em] shadow-lg active:scale-95 w-full md:w-auto"
           >
             Return to Archives
           </button>
        </footer>
      </article>
    );
  }

  // --- List View ---
  return (
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-10 animate-fadeIn pb-32">
      <SEO 
        title="Island Stories - Strategic Spanish Learning"
        description="Deep dives into neuro-linguistic Spanish learning, RAE corpus data, and AI-powered fluency protocols."
        url="https://ssisland.space/stories"
        breadcrumbs={[{ name: 'Home', item: '/' }, { name: 'Stories', item: '/stories' }]}
        themeColor="#ffa600"
      />

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
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8d99ae]/50" size={14} aria-hidden="true" />
                 <input 
                   type="text" 
                   aria-label="Search stories"
                   placeholder="Search logs..." 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-[#e0d9b4] rounded-xl focus:outline-none focus:border-[#4b7d78] font-bold text-xs text-[#4b7d78] shadow-sm"
                 />
              </div>
           </div>
        </div>
      </header>

      <nav className="flex overflow-x-auto no-scrollbar gap-2 sticky top-2 z-40 bg-white/80 backdrop-blur-xl p-1.5 rounded-xl border border-[#e0d9b4]/20 shadow-lg" aria-label="Category tabs">
        {[
          { id: 'all', label: 'All', icon: Newspaper },
          { id: 'strategy', label: 'Strategy', icon: Target },
          { id: 'grammar', label: 'Maps', icon: Compass },
          { id: 'ai', label: 'Mirror', icon: BrainCircuit },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => { playSwish(); setActiveTab(tab.id as BlogTab); }}
            aria-label={`Show ${tab.label} category`}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-black text-[8px] uppercase transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-[#4b7d78] text-white shadow-sm' : 'text-[#8d99ae] hover:bg-slate-50'}`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                     <Clock size={10} aria-hidden="true" /> {post.readTime}
                  </div>
               </div>

               <div className="space-y-1.5">
                  <h2 className="text-lg md:text-2xl font-black text-[#4b7d78] group-hover:text-[#ffa600] transition-colors leading-tight tracking-tight uppercase line-clamp-2">
                     {resolveText(post.title)}
                  </h2>
                  <p className="text-slate-400 font-bold text-[10px] md:text-sm leading-snug line-clamp-2">
                     {resolveText(post.excerpt)}
                  </p>
               </div>

               <div className="pt-3 flex items-center justify-between border-t border-dashed border-slate-100">
                  <time className="text-[8px] font-black text-[#8d99ae] uppercase opacity-50" dateTime={new Date(post.date).toISOString().split('T')[0]}>
                     {post.date}
                  </time>
                  <div className="flex items-center gap-1 text-[#ffa600] font-black text-[9px] uppercase group-hover:translate-x-1 transition-transform" aria-hidden="true">
                     Read <ArrowRight size={12} />
                  </div>
               </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default BlogView;
