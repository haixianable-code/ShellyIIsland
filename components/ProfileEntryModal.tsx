import React, { useState } from 'react';
import { PenTool, Scroll, Ship, Map, Loader2, Compass } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { playClick, playSparkle } from '../utils/sfx';

interface ProfileEntryModalProps {
  onSave: (name: string) => Promise<void>;
}

const ProfileEntryModal: React.FC<ProfileEntryModalProps> = ({ onSave }) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || loading) return;

    setLoading(true);
    try {
      playSparkle();
      await onSave(name.trim());
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#fffdf5] rounded-[3.5rem] shadow-[0_30px_60px_-10px_rgba(0,0,0,0.4)] overflow-hidden animate-zoomIn border-[10px] border-[#e0d9b4]">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-24 bg-[#78c850]/10 pointer-events-none" />
        <div className="absolute bottom-0 right-0 p-8 opacity-5 pointer-events-none -rotate-12">
            <Ship size={120} />
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-10 relative z-10 space-y-8">
           <div className="text-center space-y-2">
              <div className="inline-flex bg-white p-4 rounded-3xl border-4 border-[#e0d9b4] shadow-sm mb-2">
                 <Compass size={32} className="text-[#4b7d78] animate-spin-slow" />
              </div>
              <h2 className="text-3xl font-black text-[#4b7d78] uppercase tracking-tighter italic">
                 {t('ui.auth.entry_modal.title')}
              </h2>
              <p className="text-sm font-bold text-[#8d99ae] leading-relaxed max-w-[280px] mx-auto">
                 {t('ui.auth.entry_modal.subtitle')}
              </p>
           </div>

           <div className="relative group">
              <div className="absolute -top-3 left-6 bg-[#fffdf5] px-2 flex items-center gap-1 z-10">
                 <PenTool size={14} className="text-[#ffa600]" />
                 <span className="text-[10px] font-black text-[#ffa600] uppercase tracking-widest">Registrar Name</span>
              </div>
              
              <div className="bg-white rounded-3xl border-4 border-[#e0d9b4] shadow-inner p-2 relative">
                 <input 
                    type="text"
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('ui.auth.entry_modal.placeholder')}
                    maxLength={20}
                    required
                    className="w-full bg-transparent px-6 py-5 text-2xl font-black text-[#4b7d78] focus:outline-none placeholder:text-slate-200 placeholder:italic"
                 />
                 {/* Parchment background effect */}
                 <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 19px, #000 20px)' }} />
              </div>
           </div>

           <div className="pt-2">
              <button
                 type="submit"
                 disabled={!name.trim() || loading}
                 className="w-full bg-[#ffa600] text-white py-5 rounded-[2.5rem] font-black text-xl shadow-[0_10px_0_#e65100] border-4 border-white bubble-button flex items-center justify-center gap-3 hover:bg-[#ffb74d] disabled:opacity-50 transition-all"
              >
                 {loading ? <Loader2 className="animate-spin" /> : (
                   <>
                     <Scroll size={24} />
                     <span>{t('ui.auth.entry_modal.button')}</span>
                   </>
                 )}
              </button>
           </div>
           
           <div className="flex justify-center opacity-30 gap-1 mt-4">
              <div className="flex items-center gap-1.5 text-[8px] font-black text-[#4b7d78] uppercase tracking-[0.4em]">
                Island Registry Form SSI-001
              </div>
           </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEntryModal;