import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { Leaf, Mail, AlertCircle, ArrowLeft, Loader2, CheckCircle, Send } from 'lucide-react';

interface AuthViewProps {
  onBack?: () => void;
}

type AuthStatus = 'idle' | 'loading' | 'sent' | 'error';

const AuthView: React.FC<AuthViewProps> = ({ onBack }) => {
  const [status, setStatus] = useState<AuthStatus>('idle');
  const [email, setEmail] = useState('');
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

  const handleSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email address.");
      setStatus('error');
      return;
    }
    
    setStatus('loading');
    setError(null);

    try {
      if (!supabase) throw new Error("Supabase client is not available.");
      
      const { error: supabaseError } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });

      if (supabaseError) throw supabaseError;

      setStatus('sent');
      setCooldown(15);
    } catch (err: any) {
      console.error("Auth error:", err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
      setStatus('error');
    }
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

  // Renders the main content after sending the link
  const renderSuccessContent = () => (
    <div className="text-center p-4">
      <div className="bg-green-100 p-5 rounded-[2.5rem] border-4 border-green-200 shadow-sm mb-6 inline-block">
        <CheckCircle size={48} className="text-green-600" />
      </div>
      <h2 className="text-2xl font-black text-[#4b7d78]">✅ Check your email!</h2>
      <p className="text-[#6d7c8e] font-bold mt-2 mb-6">
        We sent a login link to <strong>{email}</strong>.
      </p>
      <button
        onClick={() => handleSubmit()}
        disabled={cooldown > 0}
        className="w-full p-4 rounded-2xl font-black text-sm bubble-button disabled:opacity-50 disabled:cursor-not-allowed bg-[#f1f8e9] text-[#2e7d32] border-2 border-[#c5e1a5] shadow-[0_4px_0_#c5e1a5] hover:bg-[#dcedc8]"
      >
        {cooldown > 0 ? `Resend Link (${cooldown}s)` : 'Resend Link'}
      </button>
    </div>
  );

  // Renders the form for email input
  const renderFormContent = () => (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-xl font-black text-center text-[#4b7d78]">
          Log In to Shelly Spanish Island
        </h2>
        <p className="text-sm font-bold text-center text-[#8d99ae] mb-6">
          We'll send you a magic link to log in.
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

        {status === 'error' && error && (
          <div className="bg-[#ffebee] border-2 border-[#e57373] text-[#c62828] p-3 rounded-xl text-sm font-bold flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
        
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full p-5 rounded-[2rem] text-white font-black text-lg flex items-center justify-center gap-3 transition-all bubble-button disabled:opacity-50 disabled:cursor-not-allowed bg-[#88d068] shadow-[0_8px_0_#5a9a3b] hover:bg-[#96e072] disabled:bg-[#a5d6a7]"
        >
          {status === 'loading' ? (
             <><Loader2 className="animate-spin" /> Sending...</>
          ) : (
            <><Send size={22} /> Send Login Link</>
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
          <div className="inline-flex items-center justify-center w-24 h-24 bg-[#78c850] rounded-[3rem] shadow-[0_10px_0_#5a9a3b] mb-6 border-4 border-white">
            <Leaf className="text-white w-12 h-12 fill-current" />
          </div>
          <h1 className="text-4xl font-black text-[#4b7d78] tracking-tight">Shelly Spanish Island</h1>
          <p className="text-[#6d7c8e] font-bold mt-2">Your journey to fluency starts here.</p>
        </header>

        <main className="bg-white p-8 rounded-[3.5rem] border-[8px] border-[#e0d9b4] shadow-[0_12px_0_rgba(0,0,0,0.08)]">
          {status === 'sent' ? renderSuccessContent() : renderFormContent()}
        </main>
      </div>
    </div>
  );
};

// FIX: Changed default export to named export to align with the import change in App.tsx.
export { AuthView };