
import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Newspaper, Clock, 
  ArrowLeft, Share2, Search, Check, ArrowRight, Lock, Crown, ShieldCheck
} from 'lucide-react';
import { playClick, playSwish, playSparkle } from '../utils/sfx';
import { useTranslation } from 'react-i18next';
import { BLOG_POSTS, BlogTab } from '../data/blogPosts';
import { getBilingualText } from './Bilingual'; 
import SEO from './SEO';
import { useIslandStore } from '../store/useIslandStore';

const BlogView: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { slug } = useParams();
  const navigate = useNavigate();
  const { profile, openModal } = useIslandStore();
  const isPremium = profile?.is_premium;
  
  const [activeTab, setActiveTab] = useState<BlogTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  const resolveText = (content: string | { en: string; zh: string }) => {
    return getBilingualText(content, i18n.language);
  };

  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter(post => {
      const matchesTab = activeTab === 'all' || post.category === activeTab;
      const title = resolveText(post.title).toLowerCase();
      const query = searchQuery.toLowerCase();
      return matchesTab && title.includes(query);
    });
  }, [activeTab, searchQuery, i18n.language]);

  const selectedPost = useMemo(() => BLOG_POSTS.find(p => p.slug === slug), [slug]);

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
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (selectedPost) {
    const displayTitle = resolveText(selectedPost.title);
    const isLocked = selectedPost.isPremium && !isPremium;

    return (
      <article className="max-w-2xl mx-auto animate-fadeIn pb-32 px-2" role="main">
        <SEO title={displayTitle} description={selectedPost.description} url={window.location.href} type="article" />

        <div className="fixed top-0 left-0 right-0 md:left-72 h-1 bg-slate-100/30 z-[60]" aria-hidden="true">
           <div className="h-full bg-gradient-to-r from-[#ffa600] to-[#ff7b72] transition-all duration-150" style={{ width: `${scrollProgress}%` }} />
        </div>

        <button 
          onClick={() => { playSwish(); navigate('/stories'); }}
          className="flex items-center gap-2 text-[#8d99ae] font-black text-[9px] uppercase tracking-widest mb-4 hover:text-[#4b7d78] transition-all py-1.5 px-3 bg-white rounded-full shadow-sm w-fit active:scale-95 border border-slate-100"
        >
          <ArrowLeft size={10} aria-hidden="true" /> {t('ui.blog.back')}
        </button>

        <header className="space-y-4 mb-8">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest shadow-sm ${selectedPost.isPremium ? 'bg-[#ffa600] text-white' : 'bg-[#8bc34a] text-white'}`}>
              {selectedPost.isPremium && <Crown size={8} className="inline mr-1 mb-0.5" />}
              {selectedPost.level}
            </span>
            <time className="text-[#8d99ae] text-[8px] font-black uppercase tracking-widest">{selectedPost.date}</time>
          </div>
          <h1 className="text-2xl md:text-5xl font-black text-[#4b7d78] tracking-tight leading-tight uppercase">
            {displayTitle}
          </h1>
          <div className="flex items-center gap-4 text-[#8d99ae] text-[8px] font-black uppercase tracking-widest border-t border-dashed border-slate-100 pt-4">
             <div className="flex items-center gap-1.5"><Clock size={10} className="text-[#ffa600]" /> {selectedPost.readTime} {t('ui.blog.read_time')}</div>
             <button onClick={handleCopyLink} className={`ml-auto flex items-center gap-1.5 transition-colors ${copiedLink ? 'text-[#78c850]' : 'text-[#4b7d78]'}`}>
                {copiedLink ? <Check size={10} /> : <Share2 size={10} />}
                <span>{copiedLink ? t('ui.blog.copied') : t('ui.blog.share')}</span>
             </button>
          </div>
        </header>

        <section className={`prose prose-slate max-w-none mb-12 relative ${isLocked ? 'max-h-[400px] overflow-hidden' : ''}`}>
           {selectedPost.content}
           
           {isLocked && (
             <>
               <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#f7f9e4] via-[#f7f9e4]/80 to-transparent z-10" />
               <div className="absolute bottom-0 left-0 right-0 p-8 pt-20 flex flex-col items-center text-center z-20">
                  <div className="bg-white/90 backdrop-blur-md p-8 rounded-[3.5rem] border-4 border-[#ffa600] shadow-[0_20px_50px_rgba(255,166,0,0.2)] max-w-sm">
                     <Crown size={40} className="text-[#ffa600] mb-4 mx-auto animate-bounce-slight" />
                     <h3 className="text-xl font-black text-[#4b7d78] uppercase tracking-tight mb-2">{t('ui.blog.locked_title')}</h3>
                     <p className="text-xs font-bold text-[#8d99ae] mb-6 leading-relaxed">
                       {t('ui.blog.locked_desc')}
                     </p>
                     <button 
                        onClick={() => openModal('SUBSCRIPTION')}
                        className="w-full bg-[#ffa600] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-[0_4px_0_#e65100] active:translate-y-1 transition-all flex items-center justify-center gap-2"
                     >
                        <ShieldCheck size={16} /> {t('ui.blog.become_btn')}
                     </button>
                  </div>
               </div>
             </>
           )}
        </section>

        {!isLocked && (
          <footer className="mt-12 pt-8 border-t border-dashed border-slate-100 text-center space-y-4">
             <button onClick={() => navigate('/stories')} className="bg-[#4b7d78] text-white px-8 py-3.5 rounded-full font-black text-[9px] uppercase tracking-[0.2em] shadow-lg active:scale-95 w-full md:w-auto">{t('ui.blog.return_btn')}</button>
          </footer>
        )}
      </article>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-10 animate-fadeIn pb-32">
      <SEO title="Island Stories" description="Deep dives into neuro-linguistic Spanish learning." url={window.location.href} />
      <header className="space-y-4 text-center md:text-left">
        <h1 className="text-3xl md:text-8xl font-black text-[#4b7d78] tracking-tighter leading-none">Island <span className="text-[#ffa600]">Stories</span>.</h1>
      </header>

      <nav className="flex overflow-x-auto no-scrollbar gap-2 sticky top-2 z-40 bg-white/80 backdrop-blur-xl p-1.5 rounded-xl border border-[#e0d9b4]/20 shadow-lg">
        {['all', 'strategy', 'grammar', 'ai'].map(tab => (
          <button key={tab} onClick={() => { playSwish(); setActiveTab(tab as BlogTab); }} className={`px-4 py-2 rounded-lg font-black text-[8px] uppercase transition-all ${activeTab === tab ? 'bg-[#4b7d78] text-white' : 'text-[#8d99ae] hover:bg-slate-50'}`}>
            {t(`ui.blog.${tab}`, { defaultValue: tab })}
          </button>
        ))}
      </nav>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPosts.map((post) => (
          <article key={post.id} onClick={() => { playClick(); navigate(`/stories/${post.slug}`); }} className="group cursor-pointer bg-white rounded-3xl border-2 border-[#e0d9b4] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 relative">
            <div className="p-4 md:p-6 space-y-3">
               <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                     <span className="bg-[#f7f9e4] text-[#4b7d78] px-2 py-0.5 rounded text-[7px] font-black uppercase border border-[#e0d9b4]">
                        {t(`ui.blog.${post.category}`, { defaultValue: post.category })}
                     </span>
                     {post.isPremium && (
                        <span className="bg-[#ffa600] text-white px-2 py-0.5 rounded text-[7px] font-black uppercase flex items-center gap-1">
                           <Crown size={8} /> SUPPORTER
                        </span>
                     )}
                  </div>
                  <div className="text-[#8d99ae] text-[7px] font-black uppercase">{post.readTime}</div>
               </div>
               <h2 className="text-lg md:text-2xl font-black text-[#4b7d78] group-hover:text-[#ffa600] transition-colors leading-tight tracking-tight uppercase line-clamp-2">{resolveText(post.title)}</h2>
               <p className="text-slate-400 font-bold text-[10px] md:text-sm leading-snug line-clamp-2">{resolveText(post.excerpt)}</p>
               <div className="pt-3 flex items-center justify-between border-t border-dashed border-slate-100">
                  <time className="text-[8px] font-black text-[#8d99ae] uppercase opacity-50">{post.date}</time>
                  <div className="flex items-center gap-1 text-[#ffa600] font-black text-[9px] uppercase">Read <ArrowRight size={12} /></div>
               </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default BlogView;
