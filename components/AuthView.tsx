import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { Leaf, Mail, AlertCircle, ArrowLeft, Loader2, CheckCircle, Send, KeyRound } from 'lucide-react';

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

        // The onAuthStateChange listener in useAuth will handle the redirect.
        // No need to do anything here on success.
        
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
    <form onSubmit={handleVerifyOtp} className="space-y-6 text-center">
        <div className="bg-green-100 p-3 rounded-full border-2 border-green-200 shadow-sm mb-4 inline-block">
            <CheckCircle size={24} className="text-green-600" />
        </div>
        <h2 className="text-xl font-black text-[#4b7d78]">Enter Your Code</h2>
        <p className="text-sm font-bold text-[#8d99ae] -mt-2">
            A 6-digit code was sent to <br/><strong>{email}</strong>
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
    <form onSubmit={handleSendCode} className="space-y-6">
        <h2 className="text-xl font-black text-center text-[#4b7d78]">
            Log In to Shelly Spanish Island
        </h2>
        <p className="text-sm font-bold text-center text-[#8d99ae] mb-6">
            We'll send you a 6-digit code to log in.
        </p>
        
        <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8d99ae]" size={20} />
            <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-[#e0d9b4] rounded-2xl font-bold text-[#4b7d78] placeholder:text-[#8d99ae]/70 focus:outline-none focus:ring-4 focus:ring-[#8bc34a]/50 transition-all"
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
            className="w-full p-5 rounded-[2rem] text-white font-black text-lg flex items-center justify-center gap-3 transition-all bubble-button disabled:opacity-50 disabled:cursor-not-allowed bg-[#88d068] shadow-[0_8px_0_#5a9a3b] hover:bg-[#96e072] disabled:bg-[#a5d6a7]"
        >
            {sendCodeStatus === 'loading' ? (
                <><Loader2 className="animate-spin" /> Sending...</>
            ) : (
                <><Send size={22} /> Send Code</>
            )}
        </button>
    </form>
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
          <div className="inline-flex items-center justify-center w-24 h-24 bg-[#78c850] rounded-[3rem] shadow-[0_10px_0_#5a9a3b] mb-6 border-4 border-white">
            <Leaf className="text-white w-12 h-12 fill-current" />
          </div>
          <h1 className="text-4xl font-black text-[#4b7d78] tracking-tight">Shelly Spanish Island</h1>
          <p className="text-[#6d7c8e] font-bold mt-2">Your journey to fluency starts here.</p>
        </header>

        <main className="bg-white p-8 rounded-[3.5rem] border-[8px] border-[#e0d9b4] shadow-[0_12px_0_rgba(0,0,0,0.08)]">
          {authStep === 'email' ? renderEmailForm() : renderOtpForm()}
        </main>
      </div>
    </div>
  );
};

export { AuthView };