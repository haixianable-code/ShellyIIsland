
import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { Leaf, Mail, AlertCircle, ArrowLeft, Loader2, CheckCircle, Send, KeyRound, ShieldCheck, Ticket, TreePalm, Shell, Star, Fingerprint, PenTool } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { playClick, playSparkle } from '../utils/sfx';

interface AuthViewProps {
  onBack?: () => void;
}

type AuthStep = 'ritual' | 'email' | 'otp';
type Status = 'idle' | 'loading' | 'error';

const AuthView: React.FC<AuthViewProps> = ({ onBack }) => {
  const { t } = useTranslation();
  const [authStep, setAuthStep] = useState<AuthStep>('ritual');
  const [selectedSeal, setSelectedSeal] = useState<number | null>(null);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  
  const [sendCodeStatus, setSendCodeStatus] = useState<Status>('idle');
  const [verifyOtpStatus, setVerifyOtpStatus] = useState<Status>('idle');
  const [googleLoading, setGoogleLoading] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer: number;
    if (cooldown > 0) {
      timer = window.setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => window.clearInterval(timer);
  }, [cooldown]);

  const handleGoogleLogin = async () => {
    if (!supabase) return;
    setGoogleLoading(true);
    try {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
            },
        });
        if (error) throw error;
    } catch (err: any) {
        console.error("Google Auth error:", err);
        setError(err.message);
        setGoogleLoading(false);
    }
  };

  const handleSendCode = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email address.");
      setSendCodeStatus('error');
      return;
    }
    
    setSendCodeStatus('loading');
    setError(null);

    try {
      if (!supabase) throw new Error("Supabase client is not available.");
      
      const { error: supabaseError } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          shouldCreateUser: true,
        },
      });

      if (supabaseError) throw supabaseError;

      setSendCodeStatus('idle');
      setAuthStep('otp');
      setCooldown(10);
    } catch (err: any) {
      console.error("Auth error:", err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
      setSendCodeStatus('error');
    }
  };

  const handleVerifyOtp = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (otp.length !== 6) {
        setError("Please enter the 6-digit code.");
        setVerifyOtpStatus('error');
        return;
    }

    setVerifyOtpStatus('loading');
    setError(null);

    try {
        if (!supabase) throw new Error("Supabase client is not available.");
        
        const { error: supabaseError } = await supabase.auth.verifyOtp({
            email: email.trim().toLowerCase(),
            token: otp,
            type: 'email',
        });

        if (supabaseError) throw supabaseError;
        
        sessionStorage.setItem('show_sync_celebration', 'true');
        
    } catch (err: any) {
        console.error("OTP verification error:", err);
        setError("Invalid or expired code. Please try again.");
        setVerifyOtpStatus('error');
        setOtp('');
    }
  };
  
  const changeEmail = () => {
    setOtp('');
    setError(null);
    setAuthStep('email');
  };

  const selectRitualSeal = (id: number) => {
    playSparkle();
    setSelectedSeal(id);
    setTimeout(() => {
        setAuthStep('email');
    }, 600);
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <div className="island-card rounded-[3.5rem] p-8 md:p-12 w-full max-w-md flex flex-col items-center">
          <div className="bg-blue-100 p-5 rounded-[2.5rem] border-4 border-blue-200 shadow-sm mb-6">
            <AlertCircle size={48} className="text-blue-600" />
          </div>
          <h1 className="text-2xl font-black text-[#4b7d78]">Local Mode Only</h1>
          <p className="text-[#6d7c8e] font-bold mt-2">
            ℹ️ Running in local mode. Your data is saved on this device only.
          </p>
          {onBack && (
            <button onClick={onBack} className="mt-8 bg-gray-200 text-gray-700 px-6 py-3 rounded-2xl font-black bubble-button">
              Continue to Guest Mode
            </button>
          )}
        </div>
      </div>
    );
  }

  const renderRitual = () => (
    <div className="space-y-10 text-center animate-fadeIn">
        <div className="space-y-3">
            <h2 className="text-2xl font-black text-[#4b7d78] uppercase tracking-tighter">
                Pick Your Citizen Seal
            </h2>
            <p className="text-sm font-bold text-[#8d99ae] leading-relaxed">
                Choose an emblem for your permanent island passport. This choice builds your identity.
            </p>
        </div>

        <div className="grid grid-cols-3 gap-5">
            {[
                { id: 1, icon: TreePalm, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                { id: 2, icon: Shell, color: 'text-sky-500', bg: 'bg-sky-50' },
                { id: 3, icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' }
            ].map((seal) => (
                <button
                    key={seal.id}
                    onClick={() => selectRitualSeal(seal.id)}
                    className={`relative p-6 rounded-[2.8rem] border-4 transition-all active:scale-95 group ${
                        selectedSeal === seal.id 
                        ? 'border-[#8bc34a] bg-white shadow-xl scale-110 z-10' 
                        : 'border-[#f0f0f0] bg-white hover:border-[#e0d9b4]'
                    }`}
                >
                    <seal.icon className={`w-12 h-12 mx-auto ${seal.color} ${selectedSeal === seal.id ? 'animate-bounce' : 'group-hover:rotate-12 transition-transform'}`} />
                    {selectedSeal === seal.id && (
                        <div className="absolute -top-2 -right-2 bg-[#8bc34a] text-white p-1 rounded-full border-2 border-white shadow-sm">
                            <CheckCircle size={16} strokeWidth={3} />
                        </div>
                    )}
                </button>
            ))}
        </div>

        <div className="pt-4 opacity-50 flex flex-col items-center border-t-2 border-dashed border-[#e0d9b4]">
            <Fingerprint size={32} className="text-[#4b7d78] mb-2" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Identity Verification Ritual</span>
        </div>
    </div>
  );

  const renderEmailForm = () => (
    <div className="space-y-8 animate-fadeIn">
        <div className="text-center relative">
             <div className="bg-white p-6 rounded-[2.5rem] border-4 border-[#e0d9b4] shadow-[0_10px_0_rgba(0,0,0,0.05)] mb-6 relative">
                 <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-4 w-full">
                        <div className="w-16 h-16 bg-[#f7f9e4] rounded-2xl flex items-center justify-center border-2 border-dashed border-[#e0d9b4]">
                           <Fingerprint size={28} className="text-[#4b7d78]/20" />
                        </div>
                        <div className="flex-1 text-left">
                           <p className="text-[10px] font-black text-[#8d99ae] uppercase tracking-widest">Citizen Name</p>
                           <h4 className="text-xl font-black text-[#4b7d78]/30 uppercase italic">Anonymous Visitor</h4>
                        </div>
                    </div>
                    <div className="w-full h-px bg-[#e0d9b4] opacity-50 my-1" />
                    <div className="flex items-center justify-between w-full">
                       <span className="text-[10px] font-black text-[#8d99ae] uppercase tracking-widest italic">To be signed: Island Covenant</span>
                       <PenTool size={16} className="text-[#ffa600]" />
                    </div>
                 </div>
             </div>
             <h2 className="text-2xl font-black text-[#4b7d78] uppercase tracking-tighter">Final Step: Secure Identity</h2>
             <p className="text-xs font-bold text-[#8d99ae] mt-1">Sign with your email to protect your harvest forever.</p>
        </div>

        <div className="space-y-4">
            <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="w-full bg-white text-[#3c4043] p-5 rounded-[2.2rem] border-4 border-[#dadce0] font-black text-lg shadow-sm hover:bg-gray-50 hover:border-[#d2e3fc] active:scale-95 transition-all flex items-center justify-center gap-3 relative overflow-hidden"
            >
                {googleLoading ? <Loader2 className="animate-spin" /> : (
                    <>
                    <svg className="w-6 h-6" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    <span>Google Citizenship</span>
                    </>
                )}
            </button>

            <div className="relative flex items-center py-2">
                <div className="flex-grow border-t-2 border-[#e0d9b4] opacity-50"></div>
                <span className="flex-shrink-0 mx-4 text-[#8d99ae] text-[10px] font-black uppercase tracking-widest opacity-50 italic">Covenant Sign-off</span>
                <div className="flex-grow border-t-2 border-[#e0d9b4] opacity-50"></div>
            </div>
            
            <form onSubmit={handleSendCode} className="space-y-4">
                <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-[#8d99ae]" size={20} />
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full pl-14 pr-5 py-5 bg-[#f7f9e4] border-2 border-[#e0d9b4] rounded-[2rem] font-bold text-[#4b7d78] focus:outline-none focus:ring-8 focus:ring-[#8bc34a]/20 focus:bg-white transition-all"
                    />
                </div>
                <button
                    type="submit"
                    disabled={sendCodeStatus === 'loading'}
                    className="w-full p-5 rounded-[2.2rem] text-white bg-[#8bc34a] font-black text-lg shadow-[0_8px_0_#5a9a3b] hover:bg-[#96e072] disabled:opacity-50 flex items-center justify-center gap-3 transition-all bubble-button"
                >
                    {sendCodeStatus === 'loading' ? <Loader2 className="animate-spin" /> : <>Request Secure Invite <Send size={20} /></>}
                </button>
            </form>
        </div>
    </div>
  );

  const renderOtpForm = () => (
    <form onSubmit={handleVerifyOtp} className="space-y-8 text-center animate-fadeIn">
        <div className="bg-green-100 p-5 rounded-[2.5rem] border-4 border-green-200 shadow-sm mb-4 inline-block">
            <KeyRound size={40} className="text-green-600" />
        </div>
        <div className="space-y-2">
            <h2 className="text-2xl font-black text-[#4b7d78] uppercase tracking-tighter">Enter Ritual Code</h2>
            <p className="text-sm font-bold text-[#8d99ae] leading-relaxed px-4">
                We've sent a 6-digit seal to <strong>{email}</strong>. Enter it to finalize your citizenship.
            </p>
        </div>

        <input
            type="text"
            inputMode="numeric"
            pattern="\d{6}"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            required
            className="w-full text-center tracking-[0.8em] text-5xl font-black py-6 bg-white border-4 border-[#e0d9b4] rounded-[2.5rem] text-[#4b7d78] focus:outline-none focus:ring-12 focus:ring-[#8bc34a]/10 transition-all shadow-inner"
        />

        {error && (
            <div className="bg-[#ffebee] border-2 border-[#e57373] text-[#c62828] p-4 rounded-2xl text-sm font-bold flex items-center gap-3">
                <AlertCircle size={20} className="shrink-0" />
                <span>{error}</span>
            </div>
        )}

        <button
            type="submit"
            disabled={verifyOtpStatus === 'loading'}
            className="w-full p-6 rounded-[2.5rem] text-white font-black text-xl flex items-center justify-center gap-3 transition-all bubble-button bg-[#8bc34a] shadow-[0_10px_0_#5a9a3b] hover:bg-[#96e072] disabled:opacity-50"
        >
            {verifyOtpStatus === 'loading' ? <Loader2 className="animate-spin" /> : <>Seal My Passport <ShieldCheck size={24} /></>}
        </button>
        
        <div className="flex flex-col gap-4 pt-2">
            <button type="button" onClick={changeEmail} className="text-xs font-black text-[#8d99ae] uppercase tracking-widest hover:text-[#4b7d78]">Change Email</button>
            <button
                type="button"
                onClick={() => handleSendCode()}
                disabled={cooldown > 0 || sendCodeStatus === 'loading'}
                className="text-[10px] font-black text-[#8d99ae] disabled:opacity-30 uppercase tracking-[0.3em]"
            >
                {cooldown > 0 ? `Resend Ritual Code in ${cooldown}s` : 'Resend Ritual Code'}
            </button>
        </div>
    </form>
  );
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {onBack && (
        <button 
           onClick={() => { playClick(); onBack(); }}
           className="absolute top-6 left-6 bg-white/80 backdrop-blur-sm p-4 rounded-[1.8rem] text-[#4b7d78] shadow-md hover:bg-white transition-all active:scale-90 z-20"
        >
          <ArrowLeft size={24} strokeWidth={4} />
        </button>
      )}

      <div className="max-w-md w-full mx-auto">
        <header className="text-center mb-10 flex flex-col items-center">
          <div className="bg-[#78c850] p-4 rounded-3xl shadow-[0_8px_0_#5a9a3b] border-4 border-white mb-4">
            <Leaf className="text-white fill-current" size={40} />
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-black text-[#4b7d78]/30 uppercase tracking-[0.5em]">Island Immigration</div>
        </header>

        <main className="bg-white p-8 rounded-[4rem] border-[10px] border-[#e0d9b4] shadow-[0_30px_60px_rgba(0,0,0,0.15)] relative overflow-hidden">
          {/* Decorative Holes like a real form */}
          <div className="absolute top-0 left-8 bottom-0 w-px border-l-2 border-dashed border-[#e0d9b4] opacity-30 pointer-events-none" />
          
          <div className="relative z-10">
            {authStep === 'ritual' ? renderRitual() : (authStep === 'email' ? renderEmailForm() : renderOtpForm())}
          </div>
        </main>
      </div>
    </div>
  );
};

export { AuthView };
