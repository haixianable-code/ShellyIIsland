import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Search, Loader2, RefreshCcw, BookOpen, ChevronRight, Crown 
} from 'lucide-react';
import { playClick, playSwish } from '../../utils/sfx';
import { Post, BlogTab } from '../../data/blogPosts';
import { getBilingualText } from '../Bilingual';
import SEO from '../SEO';

interface BlogListProps {
  posts: Post[];
  loading: boolean;
}

const BlogList: React.FC<BlogListProps> = ({ posts, loading }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<BlogTab>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const resolveText = (content: string | { en: string; zh: string }) => {
    return getBilingualText(content, i18n.language);
  };

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesTab = activeTab === 'all' || post.category === activeTab;
      const title = resolveText(post.title).toLowerCase();
      const query = searchQuery.toLowerCase();
      return matchesTab && title.includes(query);
    });
  }, [activeTab, searchQuery, i18n.language, posts]);

  return (
    <div className="max-w-5xl mx-auto space-y-8 md:space-y-12 animate-fadeIn pb-32">
      <SEO title="Island Stories" description="Deep dives into neuro-linguistic Spanish learning." url={window.location.href} />
      
      <header className="space-y-4 text-center md:text-left pt-6 relative">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#ffa600]/10 rounded-full blur-3xl" />
        <h1 className="text-5xl md:text-9xl font-black text-[#2d4a47] tracking-tighter leading-[0.9] uppercase drop-shadow-sm select-none">
          Intelligence <span className="text-[#ffa600]">Hub</span>.
        </h1>
        <p className="text-[#8d99ae] font-black text-xs md:text-sm uppercase tracking-[0.5em] pl-2 opacity-60">Global Strategy & Linguistics</p>
      </header>

      <div className="flex flex-col md:flex-row gap-4 items-center sticky top-2 z-40">
        <nav className="flex-1 flex overflow-x-auto no-scrollbar gap-2 bg-white/90 backdrop-blur-xl p-2 rounded-3xl border-4 border-[#e0d9b4]/30 shadow-2xl w-full">
            {['all', 'strategy', 'grammar', 'ai'].map(tab => (
            <button key={tab} onClick={() => { playSwish(); setActiveTab(tab as BlogTab); }} className={`flex-1 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap active:scale-95 ${activeTab === tab ? 'bg-[#4b7d78] text-white shadow-lg -translate-y-0.5' : 'text-[#8d99ae] hover:bg-[#f7f9e4] hover:text-[#4b7d78]'}`}>
                {t(`ui.blog.${tab}`, { defaultValue: tab })}
            </button>
            ))}
        </nav>
        
        <div className="w-full md:w-72 relative group">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8d99ae]/50 group-focus-within:text-[#ffa600] transition-colors" size={18} strokeWidth={3} />
           <input 
             type="text"
             placeholder={t('ui.actions.search')}
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="w-full bg-white/90 backdrop-blur-xl pl-12 pr-4 py-4 rounded-3xl border-4 border-[#e0d9b4]/30 focus:outline-none focus:border-[#ffa600] transition-all text-sm font-bold shadow-xl"
           />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-6">
           <div className="p-8 bg-white rounded-[3rem] shadow-xl border-4 border-[#e0d9b4] animate-bounce-slight">
                <Loader2 size={48} className="text-[#ffa600] animate-spin" />
           </div>
           <p className="font-black text-[#4b7d78] uppercase tracking-[0.3em] text-xs">Decrypting Archives...</p>
        </div>
      ) : filteredPosts.length > 0 ? (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, idx) => (
            <article 
                key={post.id} 
                onClick={() => { playClick(); navigate(`/stories/${post.slug}`); }} 
                className="group cursor-pointer bg-white rounded-[3rem] border-4 border-[#e0d9b4] overflow-hidden shadow-sm hover:shadow-[0_20px_50px_rgba(45,74,71,0.15)] hover:-translate-y-2 transition-all duration-500 relative flex flex-col h-full animate-slideUp"
                style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {post.isPremium && (
                 <div className="absolute top-4 right-4 z-10 bg-slate-900 text-[#ffd740] p-2 rounded-xl shadow-lg border-2 border-[#ffd740]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Crown size={14} fill="currentColor" />
                 </div>
              )}
              
              <div className="p-8 flex flex-col h-full space-y-5">
                 <div className="flex items-center gap-3">
                    <div className="bg-[#f7f9e4] p-2.5 rounded-xl border-2 border-[#e0d9b4]/50 group-hover:border-[#ffa600] transition-colors">
                        <BookOpen size={16} className="text-[#4b7d78]" />
                    </div>
                    <span className="text-[10px] font-black text-[#8d99ae] uppercase tracking-widest">{post.category}</span>
                 </div>

                 <h2 className="text-2xl font-black text-[#2d4a47] group-hover:text-[#ffa600] transition-colors leading-tight tracking-tight uppercase line-clamp-3">
                    {resolveText(post.title)}
                 </h2>

                 <p className="text-slate-400 font-bold text-sm leading-relaxed line-clamp-4 italic flex-1">
                    {resolveText(post.excerpt)}
                 </p>

                 <div className="pt-6 border-t-2 border-dashed border-slate-50 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-[#8d99ae] uppercase tracking-[0.2em]">{post.date}</span>
                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-0.5">{post.readTime} Read</span>
                    </div>
                    <div className="bg-[#f7f9e4] p-2 rounded-full text-[#ffa600] group-hover:bg-[#ffa600] group-hover:text-white transition-all transform group-hover:translate-x-1 shadow-inner">
                        <ChevronRight size={20} strokeWidth={4} />
                    </div>
                 </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 text-center space-y-6 bg-white/40 rounded-[4rem] border-4 border-dashed border-[#e0d9b4]/30 animate-pulse">
           <RefreshCcw size={80} strokeWidth={1} className="text-[#8d99ae] opacity-20" />
           <div className="space-y-1">
              <p className="font-black uppercase tracking-[0.4em] text-[#4b7d78] text-sm">No Intel Found</p>
              <p className="text-xs font-bold text-[#8d99ae] uppercase tracking-widest">Adjust your filters or query</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default BlogList;
