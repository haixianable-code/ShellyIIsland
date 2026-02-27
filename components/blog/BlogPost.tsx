import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Clock, ArrowLeft, Share2, Check, Crown, ShieldCheck, 
  Hash, Bookmark, MessageSquare
} from 'lucide-react';
import { playSwish, playSparkle } from '../../utils/sfx';
import { Post } from '../../data/blogPosts';
import { getBilingualText } from '../Bilingual';
import SEO from '../SEO';
import { useIslandStore } from '../../store/useIslandStore';
import { IslandMarkdown } from './MarkdownRenderer';

interface BlogPostProps {
  post: Post;
}

const BlogPost: React.FC<BlogPostProps> = ({ post }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { profile, openModal } = useIslandStore();
  const isPremium = profile?.is_premium;
  
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  const resolveText = (content: string | { en: string; zh: string }) => {
    return getBilingualText(content, i18n.language);
  };

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
  }, [post.id]);

  const handleCopyLink = () => {
    playSparkle();
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const renderContent = (post: Post) => {
    if (post.content) return post.content;
    const md = i18n.language.startsWith('zh') ? post.content_md_zh : post.content_md_en;
    if (md) return <IslandMarkdown content={md} />;
    return <div className="p-12 text-center opacity-30 italic font-bold">Document missing in archives.</div>;
  };

  const displayTitle = resolveText(post.title);
  const isLocked = post.isPremium && !isPremium;

  return (
    <article className="max-w-3xl mx-auto animate-fadeIn pb-32 px-4" role="main">
      <SEO title={displayTitle} description={post.description} url={window.location.href} type="article" />

      {/* Floating Scroll Indicator */}
      <div className="fixed top-0 left-0 right-0 md:left-72 h-1.5 bg-slate-100/50 z-[60] backdrop-blur-sm" aria-hidden="true">
         <div className="h-full bg-gradient-to-r from-[#ffa600] to-[#ff7b72] transition-all duration-300 ease-out rounded-r-full shadow-[0_0_10px_#ffa600]" style={{ width: `${scrollProgress}%` }} />
      </div>

      <button 
        onClick={() => { playSwish(); navigate('/stories'); }}
        className="flex items-center gap-2 text-[#8d99ae] font-black text-[10px] uppercase tracking-[0.2em] mb-10 hover:text-[#4b7d78] transition-all py-2 px-4 bg-white rounded-2xl shadow-sm w-fit active:scale-95 border-2 border-slate-50 hover:border-[#ffa600]/30"
      >
        <ArrowLeft size={14} strokeWidth={3} aria-hidden="true" /> {t('ui.blog.back')}
      </button>

      <header className="space-y-6 mb-12">
        <div className="flex flex-wrap items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm flex items-center gap-1.5 ${post.isPremium ? 'bg-slate-900 text-[#ffd740]' : 'bg-[#8bc34a] text-white'}`}>
            {post.isPremium ? <Crown size={10} /> : <Bookmark size={10} />}
            {post.level}
          </span>
          <span className="bg-[#f0f0f0] text-slate-400 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
              {post.category}
          </span>
          <time className="text-[#8d99ae] text-[9px] font-black uppercase tracking-widest ml-auto">{post.date}</time>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black text-[#2d4a47] tracking-tighter leading-[1.1] uppercase drop-shadow-sm">
          {displayTitle}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-[#8d99ae] text-[10px] font-black uppercase tracking-widest border-y-4 border-[#e0d9b4]/10 py-6">
           <div className="flex items-center gap-2"><Clock size={14} className="text-[#ffa600]" /> {post.readTime} {t('ui.blog.read_time')}</div>
           <div className="flex items-center gap-2"><MessageSquare size={14} className="text-[#29b6f6]" /> SSI Intelligence Dept.</div>
           <button onClick={handleCopyLink} className={`ml-auto flex items-center gap-2 transition-all p-2 rounded-xl border-2 ${copiedLink ? 'bg-[#e8f5e9] text-[#2e7d32] border-[#8bc34a]' : 'bg-white text-[#4b7d78] border-slate-100 hover:border-[#ffa600] shadow-sm active:scale-90'}`}>
              {copiedLink ? <Check size={14} strokeWidth={3} /> : <Share2 size={14} strokeWidth={3} />}
              <span>{copiedLink ? t('ui.blog.copied') : t('ui.blog.share')}</span>
           </button>
        </div>
      </header>

      <section className={`prose prose-island max-w-none mb-12 relative ${isLocked ? 'max-h-[500px] overflow-hidden' : ''}`}>
         {renderContent(post)}
         
         {isLocked && (
           <>
             <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#f7f9e4] via-[#f7f9e4]/95 to-transparent z-10" />
             <div className="absolute bottom-0 left-0 right-0 p-8 pt-20 flex flex-col items-center text-center z-20">
                <div className="bg-white/95 backdrop-blur-xl p-10 rounded-[4rem] border-[6px] border-[#ffa600] shadow-[0_30px_60px_rgba(255,166,0,0.3)] max-w-sm animate-zoomIn">
                   <div className="w-20 h-20 bg-[#ffa600] rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg shadow-orange-200">
                      <Crown size={40} className="text-white fill-white/20 animate-bounce-slight" />
                   </div>
                   <h3 className="text-2xl font-black text-[#4b7d78] uppercase tracking-tight mb-3">Classified Intel</h3>
                   <p className="text-sm font-bold text-slate-500 mb-8 leading-relaxed">
                     {t('ui.blog.locked_desc')}
                   </p>
                   <button 
                      onClick={() => openModal('SUBSCRIPTION')}
                      className="w-full bg-[#ffa600] text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-[0_8px_0_#e65100] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3 border-4 border-white"
                   >
                      <ShieldCheck size={20} /> {t('ui.blog.become_btn')}
                   </button>
                </div>
             </div>
           </>
         )}
      </section>

      {!isLocked && (
        <footer className="mt-20 pt-10 border-t-8 border-double border-[#e0d9b4]/20 text-center space-y-6">
           <div className="flex items-center justify-center gap-2 opacity-30 font-black text-[10px] uppercase tracking-[0.4em]">
              <Hash size={12} /> END OF DISPATCH
           </div>
           <button onClick={() => { playSwish(); navigate('/stories'); }} className="group relative bg-[#2d4a47] text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all overflow-hidden border-4 border-[#4b7d78]">
              <span className="relative z-10">{t('ui.blog.return_btn')}</span>
              <div className="absolute inset-0 bg-[#ffa600] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
           </button>
        </footer>
      )}
    </article>
  );
};

export default BlogPost;
