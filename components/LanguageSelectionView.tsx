
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plane, Globe, Sparkles, MapPin } from 'lucide-react';
import { playClick, playThud, playFanfare } from '../utils/sfx';

interface LanguageSelectionViewProps {
  onLanguageSelected: () => void;
}

const LanguageSelectionView: React.FC<LanguageSelectionViewProps> = ({ onLanguageSelected }) => {
  const { i18n } = useTranslation();
  const [selectedLang, setSelectedLang] = useState<'en' | 'zh' | null>(null);
  const [isStamping, setIsStamping] = useState(false);

  const handleSelect = (lang: 'en' | 'zh') => {
    if (isStamping) return;
    
    playClick();
    setSelectedLang(lang);
    setIsStamping(true);

    i18n.changeLanguage(lang);
    
    setTimeout(() => {
      playThud();
    }, 300);

    setTimeout(() => {
      playFanfare();
      localStorage.setItem('shelly_language_confirmed', 'true');
      onLanguageSelected();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f7f9e4] flex flex-col items-center justify-center p-6 relative overflow-y-auto overflow-x-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-40 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#c5e1a5 2px, transparent 0)', backgroundSize: '40px 40px' }} />
      
      <header className="text-center mb-10 relative z-10 shrink-0">
        <h1 className="text-3xl md:text-4xl font-black text-[#4b7d78] tracking-tight mb-2 drop-shadow-sm">
          Where are you from?
        </h1>
        <p className="text-[#8d99ae] font-bold text-xs uppercase tracking-widest">
          请选择您的母语
        </p>
      </header>

      <div className="flex flex-col gap-6 w-full max-w-sm relative z-10 items-center">
        
        {/* ================= CHINESE TICKET ================= */}
        <button
          onClick={() => handleSelect('zh')}
          className={`relative w-full group transition-all duration-300 transform 
            ${selectedLang === 'zh' ? 'scale-105 z-20' : 'hover:-translate-y-1 hover:rotate-[-1deg] active:scale-95'}
            ${isStamping && selectedLang !== 'zh' ? 'opacity-40 grayscale blur-[1px]' : ''}
          `}
          disabled={isStamping}
        >
          <div className={`
             relative bg-[#fff8e1] rounded-t-[1.5rem] rounded-b-sm overflow-hidden shadow-[0_10px_20px_-5px_rgba(211,47,47,0.15)] 
             border-x-4 border-t-4 border-b-0 transition-colors
             ${selectedLang === 'zh' ? 'border-[#ff7043] ring-4 ring-[#ff7043]/20' : 'border-[#fff8e1]'}
          `}>
            {/* Header Red */}
            <div className="bg-[#ff7043] h-14 flex items-center justify-between px-6 relative overflow-hidden">
               <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 2px, transparent 0)', backgroundSize: '8px 8px' }}></div>
               <div className="flex items-center gap-3 z-10">
                 <span className="text-2xl drop-shadow-sm">🐼</span>
                 <span className="text-white font-black text-sm tracking-[0.2em] uppercase">登机牌</span>
               </div>
               <div className="z-10 opacity-60">
                  <div className="w-2 h-2 rounded-full bg-white/60" />
               </div>
            </div>

            {/* Body */}
            <div className="p-7 pb-10 relative">
               {/* Watermark */}
               <div className="absolute right-4 bottom-4 text-6xl opacity-[0.05] pointer-events-none select-none text-[#ff7043] font-serif">
                 福
               </div>
               
               <div className="flex justify-between items-center relative z-10">
                 <div className="text-left space-y-1">
                    <div className="text-[#ff7043]/60 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                      <MapPin size={10} /> 出发地
                    </div>
                    <div className="text-3xl font-black text-[#4e342e] tracking-tight">
                      中文
                    </div>
                 </div>

                 <div className="text-[#ff7043]/20 mx-4">
                   <Plane size={24} className="rotate-90" />
                 </div>

                 <div className="text-right space-y-1">
                    <div className="text-[#ff7043]/60 text-[10px] font-black uppercase tracking-widest flex items-center justify-end gap-1">
                       目的地 <MapPin size={10} />
                    </div>
                    <div className="text-3xl font-black text-[#bf360c] tracking-tight">
                      西语岛
                    </div>
                 </div>
               </div>
            </div>

            {/* Sawtooth Bottom Edge */}
            <div className="absolute bottom-0 left-0 right-0 h-3 bg-[#f7f9e4]" 
                 style={{ 
                   clipPath: "polygon(0% 100%, 2% 0%, 4% 100%, 6% 0%, 8% 100%, 10% 0%, 12% 100%, 14% 0%, 16% 100%, 18% 0%, 20% 100%, 22% 0%, 24% 100%, 26% 0%, 28% 100%, 30% 0%, 32% 100%, 34% 0%, 36% 100%, 38% 0%, 40% 100%, 42% 0%, 44% 100%, 46% 0%, 48% 100%, 50% 0%, 52% 100%, 54% 0%, 56% 100%, 58% 0%, 60% 100%, 62% 0%, 64% 100%, 66% 0%, 68% 100%, 70% 0%, 72% 100%, 74% 0%, 76% 100%, 78% 0%, 80% 100%, 82% 0%, 84% 100%, 86% 0%, 88% 100%, 90% 0%, 92% 100%, 94% 0%, 96% 100%, 98% 0%, 100% 100%)"
                 }} 
            />
          </div>

          {/* STAMP */}
          {selectedLang === 'zh' && (
               <div className="absolute inset-0 flex items-center justify-center z-30 animate-zoomIn pointer-events-none">
                 <div className="w-28 h-28 border-[6px] border-[#b71c1c] rounded-xl flex items-center justify-center bg-[#fff8e1]/90 shadow-2xl transform rotate-[-12deg] mix-blend-multiply">
                    <div className="text-center">
                      <div className="text-[#b71c1c] text-2xl font-black tracking-[0.2em] border-b-2 border-[#b71c1c] pb-1 mb-1 leading-none">
                        准予<br/>通行
                      </div>
                      <div className="text-[#b71c1c] text-[8px] font-bold uppercase tracking-widest">PERMITTED</div>
                    </div>
                 </div>
               </div>
          )}
        </button>

        {/* ================= ENGLISH TICKET ================= */}
        <button
          onClick={() => handleSelect('en')}
          className={`relative w-full group transition-all duration-300 transform 
            ${selectedLang === 'en' ? 'scale-105 z-20' : 'hover:-translate-y-1 hover:rotate-[1deg] active:scale-95'}
            ${isStamping && selectedLang !== 'en' ? 'opacity-40 grayscale blur-[1px]' : ''}
          `}
          disabled={isStamping}
        >
          <div className={`
             relative bg-white rounded-t-[1.5rem] rounded-b-sm overflow-hidden shadow-[0_10px_20px_-5px_rgba(2,136,209,0.15)] 
             border-x-4 border-t-4 border-b-0 transition-colors
             ${selectedLang === 'en' ? 'border-[#29b6f6] ring-4 ring-[#29b6f6]/20' : 'border-white'}
          `}>
            {/* Header Blue */}
            <div className="bg-[#29b6f6] h-14 flex items-center justify-between px-6 relative overflow-hidden">
               <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 2px, transparent 0)', backgroundSize: '8px 8px' }}></div>
               <div className="flex items-center gap-3 z-10">
                 <span className="text-2xl drop-shadow-sm">🦅</span>
                 <span className="text-white font-black text-sm tracking-[0.1em] uppercase">BOARDING PASS</span>
               </div>
               <div className="z-10 opacity-60">
                  <Globe size={18} className="text-white" />
               </div>
            </div>

            {/* Body */}
            <div className="p-7 pb-10 relative">
               {/* Watermark */}
               <div className="absolute right-[-10px] bottom-[-10px] opacity-[0.05] pointer-events-none text-[#0277bd]">
                 <Globe size={80} />
               </div>
               
               <div className="flex justify-between items-center relative z-10">
                 <div className="text-left space-y-1">
                    <div className="text-[#0288d1]/60 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                      <MapPin size={10} /> ORIGIN
                    </div>
                    <div className="text-3xl font-black text-[#01579b] tracking-tight">
                      English
                    </div>
                 </div>

                 <div className="text-[#0288d1]/20 mx-4">
                   <Plane size={24} className="rotate-90" />
                 </div>

                 <div className="text-right space-y-1">
                    <div className="text-[#0288d1]/60 text-[10px] font-black uppercase tracking-widest flex items-center justify-end gap-1">
                      TO <MapPin size={10} />
                    </div>
                    <div className="text-2xl font-black text-[#0288d1] tracking-tight leading-none">
                      Spanish<br/>
                      <span className="text-lg">Island</span>
                    </div>
                 </div>
               </div>
            </div>

             {/* Sawtooth Bottom Edge */}
             <div className="absolute bottom-0 left-0 right-0 h-3 bg-[#f7f9e4]" 
                 style={{ 
                   clipPath: "polygon(0% 100%, 2% 0%, 4% 100%, 6% 0%, 8% 100%, 10% 0%, 12% 100%, 14% 0%, 16% 100%, 18% 0%, 20% 100%, 22% 0%, 24% 100%, 26% 0%, 28% 100%, 30% 0%, 32% 100%, 34% 0%, 36% 100%, 38% 0%, 40% 100%, 42% 0%, 44% 100%, 46% 0%, 48% 100%, 50% 0%, 52% 100%, 54% 0%, 56% 100%, 58% 0%, 60% 100%, 62% 0%, 64% 100%, 66% 0%, 68% 100%, 70% 0%, 72% 100%, 74% 0%, 76% 100%, 78% 0%, 80% 100%, 82% 0%, 84% 100%, 86% 0%, 88% 100%, 90% 0%, 92% 100%, 94% 0%, 96% 100%, 98% 0%, 100% 100%)"
                 }} 
            />
          </div>

          {/* STAMP */}
          {selectedLang === 'en' && (
               <div className="absolute inset-0 flex items-center justify-center z-30 animate-zoomIn pointer-events-none">
                 <div className="w-28 h-28 rounded-full border-[6px] border-[#01579b] flex items-center justify-center bg-white/90 shadow-2xl transform rotate-[15deg] mix-blend-multiply">
                    <div className="text-center">
                      <div className="text-[#01579b] text-sm font-black tracking-widest uppercase">
                        IMMIGRATION
                      </div>
                      <div className="text-[#01579b] text-xs font-black uppercase tracking-widest mt-1 border-t-2 border-[#01579b] pt-1">
                        CLEARED
                      </div>
                    </div>
                 </div>
               </div>
          )}
        </button>

      </div>
      
      <div className="mt-12 opacity-30 flex items-center gap-2">
        <Sparkles size={14} className="text-[#4b7d78]" />
        <span className="text-[9px] font-black text-[#4b7d78] uppercase tracking-[0.3em]">Shelly Spanish Island</span>
      </div>
    </div>
  );
};

export default LanguageSelectionView;
