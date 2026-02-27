
import React, { useState } from 'react';
import { X, Crown, Check, Sparkles, Zap, Heart, Star, Infinity, ShieldCheck, Loader2, Lock } from 'lucide-react';
import { playClick, playSparkle } from '../utils/sfx';
import { useIslandStore } from '../store/useIslandStore';
import { useTranslation } from 'react-i18next';

interface SubscriptionModalProps {
  onClose: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { startSubscriptionCheckout } = useIslandStore();

  const handleSubscribe = async () => {
    playSparkle();
    setLoading(true);
    try {
        await startSubscriptionCheckout();
    } catch (e) {
        console.error(e);
        setLoading(false);
    }
  };

  const perks = [
    { icon: Infinity, text: "Unlimited New Words", desc: "Learn as fast as you want. No daily limits." },
    { icon: Sparkles, text: "All Vocab Packs", desc: "Slang, Business, Travel & more." },
    { icon: Zap, text: "100 AI Credits Gift", desc: "Generate mnemonics & get AI coaching." },
    { icon: Star, text: "Supporter Badge", desc: "Show off your island citizenship." },
    { icon: Heart, text: "Support Development", desc: "Help us keep the island growing." }
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#fffdf5] rounded-[4rem] border-[12px] border-white shadow-[0_40px_80px_rgba(0,0,0,0.4)] overflow-hidden animate-zoomIn flex flex-col">
        
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '20px 20px' }} />
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 z-50 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-all active:scale-90 backdrop-blur-sm"
          >
            <X size={20} strokeWidth={3} />
          </button>
          
          <div className="relative z-10 flex flex-col items-center gap-4">
             <div className="bg-[#ffd740] p-5 rounded-[2.5rem] shadow-[0_15px_30px_rgba(255,215,64,0.3)] border-4 border-white animate-float">
                <Crown size={56} className="text-slate-900 fill-current" />
             </div>
             <div className="space-y-1">
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Island Citizenship</h2>
                <p className="text-amber-400 font-black text-[10px] uppercase tracking-[0.3em]">Lifetime Access Pass</p>
             </div>
          </div>
        </div>

        <div className="p-8 md:p-10 space-y-8 overflow-y-auto no-scrollbar max-h-[60vh]">
          <div className="space-y-5">
             {perks.map((perk, i) => (
               <div key={i} className="flex items-start gap-4 group">
                  <div className="bg-slate-50 p-2.5 rounded-xl border-2 border-slate-100 group-hover:border-amber-200 transition-colors">
                     <perk.icon size={20} className="text-[#4b7d78]" />
                  </div>
                  <div className="flex-1">
                     <h4 className="text-[#4b7d78] font-black text-sm uppercase leading-tight tracking-tight">{perk.text}</h4>
                     <p className="text-[10px] font-bold text-slate-400 mt-0.5 leading-tight">{perk.desc}</p>
                  </div>
                  <Check size={18} className="text-[#8bc34a] shrink-0 mt-1" strokeWidth={4} />
               </div>
             ))}
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] border-4 border-slate-100 shadow-inner flex items-center justify-between">
             <div className="flex flex-col">
                <span className="text-[10px] font-black text-[#8d99ae] uppercase tracking-widest leading-none">One-time Payment</span>
                <span className="text-3xl font-black text-[#4b7d78] mt-1 tracking-tighter">$9.90 <span className="text-sm opacity-40">/ forever</span></span>
             </div>
             <div className="text-right">
                <span className="bg-[#8bc34a] text-white px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">Best Value</span>
             </div>
          </div>

          <div className="space-y-4">
              <button 
                onClick={handleSubscribe}
                disabled={loading}
                className="w-full bg-gradient-to-r from-slate-900 to-slate-800 text-white py-6 rounded-[2.5rem] font-black text-xl shadow-[0_10px_0_rgba(0,0,0,0.1)] border-4 border-slate-700 bubble-button flex items-center justify-center gap-3 hover:scale-[1.02] transition-all relative overflow-hidden"
              >
                {loading ? <Loader2 className="animate-spin" /> : (
                  <>
                    <ShieldCheck size={24} className="text-amber-400" />
                    <span>Unlock Forever</span>
                  </>
                )}
              </button>
              
              <div className="flex items-center justify-center gap-2 opacity-60">
                 <Lock size={12} />
                 <p className="text-[10px] font-bold text-[#8d99ae] uppercase tracking-widest">Secure Payment via LemonSqueezy</p>
              </div>
          </div>
        </div>
        
        <div className="bg-slate-50 p-4 border-t border-slate-100 text-center">
            <p className="text-[8px] font-bold text-slate-400 leading-relaxed max-w-[300px] mx-auto uppercase">
               No recurring fees. No hidden costs. Just pure learning.
            </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
