import React, { useState } from 'react';
import { X, Crown, Check, Sparkles, Zap, Heart, Star, Infinity, ShieldCheck } from 'lucide-react';
import { playClick, playSparkle } from '../utils/sfx';
import confetti from 'canvas-confetti';
import { useIslandStore } from '../store/useIslandStore';

interface SubscriptionModalProps {
  onClose: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const { upgradeToPremium } = useIslandStore();

  const handleSubscribe = async () => {
    playSparkle();
    setLoading(true);
    // Simulate payment processing
    await new Promise(res => setTimeout(res, 2000));
    await upgradeToPremium();
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ffa600', '#ff7b72', '#ffffff']
    });
    setLoading(false);
    onClose();
  };

  const perks = [
    { icon: Infinity, text: 'Unlimited AI Word Insights' },
    { icon: Zap, text: 'Advanced AI Sentence Feedback' },
    { icon: Star, text: 'Golden "SSI Supporter" Badge' },
    { icon: Sparkles, text: 'Unlock Exclusive Vocabulary Packs' },
    { icon: Heart, text: 'Support the Island Evolution' }
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#fffdf5] rounded-[4rem] border-[12px] border-white shadow-[0_40px_80px_rgba(0,0,0,0.3)] overflow-hidden animate-zoomIn flex flex-col">
        
        <div className="bg-gradient-to-br from-[#ffa600] to-[#ff7b72] p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '20px 20px' }} />
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 z-50 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all active:scale-90"
          >
            <X size={20} strokeWidth={3} />
          </button>
          
          <div className="relative z-10 flex flex-col items-center gap-4">
             <div className="bg-white p-5 rounded-[2.5rem] shadow-xl border-4 border-white animate-bounce-slight">
                <Crown size={56} className="text-[#ffa600] fill-current" />
             </div>
             <div className="space-y-1">
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter drop-shadow-md">SSI Supporter</h2>
                <p className="text-white/80 font-black text-[10px] uppercase tracking-[0.3em]">Become an Island Guardian</p>
             </div>
          </div>
        </div>

        <div className="p-8 md:p-12 space-y-8 bg-white/50">
          <div className="space-y-4">
             {perks.map((perk, i) => (
               <div key={i} className="flex items-center gap-4 group">
                  <div className="bg-[#ffa600]/10 p-2 rounded-xl group-hover:scale-110 transition-transform">
                     <perk.icon size={20} className="text-[#ffa600]" />
                  </div>
                  <span className="text-[#4b7d78] font-bold text-base">{perk.text}</span>
                  <Check size={18} className="ml-auto text-[#8bc34a]" strokeWidth={4} />
               </div>
             ))}
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] border-4 border-[#ffa600]/10 shadow-inner flex items-center justify-between">
             <div className="flex flex-col">
                <span className="text-[10px] font-black text-[#8d99ae] uppercase tracking-widest leading-none">Monthly Supporter</span>
                <span className="text-3xl font-black text-[#4b7d78] mt-1 tracking-tighter">$4.99 <span className="text-sm opacity-40">/mo</span></span>
             </div>
             <div className="text-right">
                <span className="bg-[#8bc34a]/10 text-[#8bc34a] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">7-Day Trial</span>
             </div>
          </div>

          <button 
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full bg-[#ffa600] text-white py-6 rounded-[2.5rem] font-black text-xl shadow-[0_10px_0_#e65100] border-4 border-white bubble-button flex items-center justify-center gap-3 hover:bg-[#ffb74d] transition-all relative overflow-hidden"
          >
            {loading ? <Zap size={24} className="animate-spin" /> : (
              <>
                <ShieldCheck size={24} />
                <span>Join Supporter Island</span>
              </>
            )}
          </button>
          
          <p className="text-center text-[10px] font-bold text-[#8d99ae] opacity-60">
            Secure checkout via Island Credits. Cancel anytime from your Passport.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;