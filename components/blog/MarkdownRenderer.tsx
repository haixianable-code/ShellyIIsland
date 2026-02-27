import React from 'react';
import { 
  BarChart3, Radio, Sparkles, Target, 
  Compass, Info, 
  Lightbulb, Flame, 
  ShieldCheck, CheckCircle2, AlertCircle, Brain, Timer, Activity, Dna
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// --- 🏝️ 岛屿沉浸式排版系统 ---

export const Article: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="space-y-12 pb-32 leading-relaxed text-slate-700 max-w-none blog-content-flow">{children}</div>
);

export const Section: React.FC<{ title?: React.ReactNode; icon?: React.ElementType; children: React.ReactNode }> = ({ title, icon: Icon, children }) => {
  const FallbackIcon = Compass;
  return (
    <section className="space-y-6 pt-8 first:pt-0">
      {title && (
        <div className="flex items-center gap-4 border-b-4 border-[#e0d9b4]/20 pb-4 mb-8">
          <div className="p-3 bg-white rounded-[1.2rem] shadow-sm border-2 border-slate-50 text-[#4b7d78]">
            {Icon ? <Icon size={24} strokeWidth={2.5} /> : <FallbackIcon size={24} strokeWidth={2.5} />}
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-[#2d4a47] uppercase tracking-tight leading-none">
            {title}
          </h2>
        </div>
      )}
      <div className="space-y-6 px-1 md:px-2">{children}</div>
    </section>
  );
};

export const Text: React.FC<{ children: React.ReactNode; variant?: 'normal' | 'lead' | 'muted' | 'highlight' }> = ({ children, variant = 'normal' }) => {
  const styles = {
    normal: "text-base md:text-lg text-slate-600 font-medium leading-[1.8]",
    lead: "text-xl md:text-2xl text-slate-800 font-black leading-snug tracking-tight mb-8",
    muted: "text-sm text-[#8d99ae] font-bold uppercase tracking-widest italic opacity-80",
    highlight: "bg-[#fff9c4] px-1 rounded-md text-[#2d4a47] font-black"
  };
  return <p className={styles[variant]}>{children}</p>;
};

export const Callout: React.FC<{ type?: 'tip' | 'warning' | 'info' | 'goal'; children: React.ReactNode }> = ({ type = 'info', children }) => {
  const themes = {
    info: { bg: "bg-slate-50", border: "border-slate-200", text: "text-slate-700", icon: Info, label: "Intelligence" },
    tip: { bg: "bg-[#f1f8e9]", border: "border-[#8bc34a]", text: "text-[#2e7d32]", icon: Lightbulb, label: "Field Tip" },
    warning: { bg: "bg-[#fff5f5]", border: "border-[#ff7b72]", text: "text-[#c62828]", icon: AlertCircle, label: "Risk Warning" },
    goal: { bg: "bg-[#e3f2fd]", border: "border-[#2196f3]", text: "text-[#01579b]", icon: Target, label: "Objective" }
  };
  const theme = themes[type];
  const Icon = theme.icon;
  
  return (
    <div className={`${theme.bg} p-8 rounded-[3rem] border-4 ${theme.border} my-10 shadow-sm relative overflow-hidden group transition-all hover:shadow-md`}>
       <div className="absolute -right-4 -top-4 opacity-5 rotate-12 group-hover:scale-110 transition-transform">
          <Icon size={120} />
       </div>
       <div className="flex flex-col md:flex-row gap-5 relative z-10">
          <div className={`p-4 rounded-[1.5rem] bg-white shadow-sm shrink-0 h-fit border-2 ${theme.border} border-opacity-20`}>
            <Icon className={`${theme.text}`} size={28} strokeWidth={3} />
          </div>
          <div className="space-y-2">
            <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${theme.text} opacity-60`}>{theme.label}</span>
            <div className={`text-base md:text-lg font-bold ${theme.text} leading-relaxed`}>{children}</div>
          </div>
       </div>
    </div>
  );
};

// --- 🤖 Markdown 自动转化器 V2 ---

export const IslandMarkdown: React.FC<{ content: string }> = ({ content }) => {
  return (
    <Article>
      <ReactMarkdown
        components={{
          h1: ({ children }) => <Section title={children} icon={Flame}>{null}</Section>,
          h2: ({ children }) => {
            const title = String(children).toLowerCase();
            let icon = Compass;
            if (title.includes('ai') || title.includes('智能') || title.includes('hacks')) icon = Sparkles;
            if (title.includes('神经') || title.includes('脑') || title.includes('brain')) icon = Brain;
            if (title.includes('技巧') || title.includes('攻略') || title.includes('rule') || title.includes('target')) icon = Target;
            if (title.includes('规律') || title.includes('pattern') || title.includes('evolution')) icon = Dna;
            if (title.includes('警告') || title.includes('注意') || title.includes('risk') || title.includes('danger')) icon = AlertCircle;
            if (title.includes('数据') || title.includes('corpus') || title.includes('stats')) icon = BarChart3;
            if (title.includes('习惯') || title.includes('habit') || title.includes('consistency')) icon = Timer;
            if (title.includes('俚语') || title.includes('slang') || title.includes('social')) icon = Radio;
            if (title.includes('动词') || title.includes('verb') || title.includes('action')) icon = Activity;
            if (title.includes('conclusion') || title.includes('总结')) icon = CheckCircle2;
            if (title.includes('protocol') || title.includes('协议')) icon = ShieldCheck;
            return <Section title={children} icon={icon}>{null}</Section>;
          },
          p: ({ children }) => {
              if (typeof children === 'string' && children.length < 50 && children.endsWith('...')) {
                  return <Text variant="lead">{children}</Text>;
              }
              return <Text>{children}</Text>;
          },
          blockquote: ({ children }) => {
            const text = String(children);
            let type: 'tip' | 'warning' | 'info' | 'goal' = 'info';
            if (text.includes('[!TIP]') || text.includes('提示')) type = 'tip';
            if (text.includes('[!WARNING]') || text.includes('警告') || text.includes('注意')) type = 'warning';
            if (text.includes('[!GOAL]') || text.includes('任务') || text.includes('目标')) type = 'goal';
            
            // Clean up markers
            const cleanContent = React.Children.map(children, child => {
                if (typeof child === 'string') {
                    return child.replace(/\[!(TIP|WARNING|GOAL)\]\s*/g, '').replace(/^(提示|警告|任务|目标)[:：]\s*/g, '');
                }
                return child;
            });

            return <Callout type={type}>{cleanContent}</Callout>;
          },
          ul: ({ children }) => <ul className="space-y-4 my-8 pl-1">{children}</ul>,
          li: ({ children }) => (
            <li className="flex items-start gap-4 text-slate-600 font-bold text-base md:text-lg">
               <div className="mt-2.5 shrink-0 w-2.5 h-2.5 rounded-full bg-[#ffa600] shadow-[0_0_10px_rgba(255,166,0,0.4)]" />
               <span className="leading-relaxed">{children}</span>
            </li>
          ),
          strong: ({ children }) => <span className="text-[#2d4a47] font-black underline decoration-4 decoration-[#ffa600]/30 underline-offset-2">{children}</span>,
          em: ({ children }) => <span className="text-[#4b7d78] font-bold italic tracking-tight">{children}</span>,
          code: ({ children }) => <code className="bg-[#f0f0f0] text-[#e65100] px-2 py-0.5 rounded-md font-mono font-bold text-sm mx-1 border border-slate-200">{children}</code>
        }}
      >
        {content}
      </ReactMarkdown>
    </Article>
  );
};
