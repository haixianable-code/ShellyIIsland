
import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { Leaf, Mail, AlertCircle, ArrowLeft, Loader2, CheckCircle, Send, KeyRound, ShieldCheck } from 'lucide-react';

interface AuthViewProps {
  onBack?: () => void;
}

type AuthStep = 'email' | 'otp';
type Status = 'idle' | 'loading' | 'error';

const AuthView: React.FC<AuthViewProps> = ({ onBack }) => {
  const [authStep, setAuthStep] = useState<AuthStep>('email');
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
        
        const { data, error: supabaseError } = await supabase.auth.verifyOtp({
            email: email.trim().toLowerCase(),
            token: otp,
            type: 'email',
        });

        if (supabaseError) throw supabaseError;
        
        // SUCCESS: Set celebration flag
        sessionStorage.setItem('show_sync_celebration', 'true');
        // Let the Auth Listener in App.tsx handle the redirect/state update
        
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

  // Renders when Supabase is not configured
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

  const renderOtpForm = () => (
    <form onSubmit={handleVerifyOtp} className="space-y-6 text-center animate-fadeIn">
        <div className="bg-green-100 p-3 rounded-full border-2 border-green-200 shadow-sm mb-4 inline-block">
            <CheckCircle size={24} className="text-green-600" />
        </div>
        <h2 className="text-xl font-black text-[#4b7d78]">Check Your Email</h2>
        <p className="text-sm font-bold text-[#8d99ae] -mt-2">
            We sent a code to <br/><strong>{email}</strong>
        </p>

        <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="\d{6}"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            required
            className="w-full text-center tracking-[1em] text-4xl font-black py-4 bg-white border-4 border-[#e0d9b4] rounded-2xl text-[#4b7d78] focus:outline-none focus:ring-8 focus:ring-[#8bc34a]/50 transition-all"
        />

        {verifyOtpStatus === 'error' && error && (
            <div className="bg-[#ffebee] border-2 border-[#e57373] text-[#c62828] p-3 rounded-xl text-sm font-bold flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{error}</span>
            </div>
        )}

        <button
            type="submit"
            disabled={verifyOtpStatus === 'loading'}
            className="w-full p-5 rounded-[2rem] text-white font-black text-lg flex items-center justify-center gap-3 transition-all bubble-button disabled:opacity-50 disabled:cursor-not-allowed bg-[#88d068] shadow-[0_8px_0_#5a9a3b] hover:bg-[#96e072] disabled:bg-[#a5d6a7]"
        >
            {verifyOtpStatus === 'loading' ? (
                <><Loader2 className="animate-spin" /> Verifying...</>
            ) : (
                <><KeyRound size={22} /> Verify Code</>
            )}
        </button>
        
        <div className="flex justify-between items-center pt-2">
            <button type="button" onClick={changeEmail} className="text-xs font-black text-[#8d99ae] hover:text-[#4b7d78]">Change Email</button>
            <button
                type="button"
                onClick={() => handleSendCode()}
                disabled={cooldown > 0 || sendCodeStatus === 'loading'}
                className="text-xs font-black text-[#8d99ae] disabled:text-slate-300 hover:text-[#4b7d78]"
            >
                {cooldown > 0 ? `Resend Code (${cooldown}s)` : 'Resend Code'}
            </button>
        </div>
    </form>
  );

  const renderEmailForm = () => (
    <div className="space-y-6 animate-fadeIn">
        <div className="text-center">
             <div className="inline-flex items-center justify-center w-20 h-20 bg-[#e0f2f1] rounded-[2.5rem] shadow-sm mb-4 border-4 border-[#b2dfdb]">
                <ShieldCheck className="text-[#009688]" size={40} />
             </div>
             <h2 className="text-2xl font-black text-[#4b7d78] mb-1">
                Save Your Progress
            </h2>
            <p className="text-xs font-bold text-[#8d99ae]">
                Sync across devices. Never lose a word.
            </p>
        </div>

        {/* P0: Google Login - High Priority */}
        <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full bg-white text-[#3c4043] p-4 rounded-[2rem] border-4 border-[#dadce0] font-black text-lg shadow-sm hover:bg-gray-50 hover:border-[#d2e3fc] hover:shadow-md active:scale-95 transition-all flex items-center justify-center gap-3 relative overflow-hidden"
        >
            {googleLoading ? (
                <Loader2 className="animate-spin text-[#8d99ae]" />
            ) : (
                <>
                {/* Google Logo SVG */}
                <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>Continue with Google</span>
                </>
            )}
        </button>

        <div className="relative flex items-center py-2">
            <div className="flex-grow border-t-2 border-[#e0d9b4]"></div>
            <span className="flex-shrink-0 mx-4 text-[#8d99ae] text-[10px] font-black uppercase tracking-widest">Or use email</span>
            <div className="flex-grow border-t-2 border-[#e0d9b4]"></div>
        </div>
        
        <form onSubmit={handleSendCode} className="space-y-4">
            <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8d99ae]" size={20} />
                <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-[#f7f9e4] border-2 border-[#e0d9b4] rounded-2xl font-bold text-[#4b7d78] placeholder:text-[#8d99ae]/70 focus:outline-none focus:ring-4 focus:ring-[#8bc34a]/50 focus:bg-white transition-all"
                />
            </div>

            {sendCodeStatus === 'error' && error && (
                <div className="bg-[#ffebee] border-2 border-[#e57373] text-[#c62828] p-3 rounded-xl text-sm font-bold flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                </div>
            )}
            
            <button
                type="submit"
                disabled={sendCodeStatus === 'loading'}
                className="w-full p-4 rounded-[2rem] text-[#4b7d78] font-black text-lg flex items-center justify-center gap-3 transition-all hover:bg-[#e0e0e0]/20 active:scale-95 disabled:opacity-50"
            >
                {sendCodeStatus === 'loading' ? (
                    <Loader2 className="animate-spin" />
                ) : (
                    <>Email me a code <Send size={18} /></>
                )}
            </button>
        </form>
    </div>
  );
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 selection:bg-[#ffd3b6] selection:text-[#e67e22]">
      {onBack && (
        <button 
           onClick={onBack}
           className="absolute top-6 left-6 bg-white/80 backdrop-blur-sm p-3 rounded-2xl text-[#4b7d78] shadow-md hover:bg-white transition-all active:scale-90 z-20"
        >
          <ArrowLeft size={20} strokeWidth={3} />
        </button>
      )}

      <div className="max-w-md w-full mx-auto">
        <header className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#78c850] rounded-[2.5rem] shadow-[0_10px_0_#5a9a3b] mb-4 border-4 border-white">
            <Leaf className="text-white w-10 h-10 fill-current" />
          </div>
        </header>

        <main className="bg-white p-8 rounded-[3.5rem] border-[8px] border-[#e0d9b4] shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
          {authStep === 'email' ? renderEmailForm() : renderOtpForm()}
        </main>
        
        <p className="text-center mt-6 text-[10px] font-black uppercase tracking-widest text-[#8d99ae] opacity-60">
            Secure Login • No Password Needed
        </p>
      </div>
    </div>
  );
};

export { AuthView };
