
import React, { useEffect, useState } from 'react';
import { useAuth, getSupabaseUserFromLocalStorage } from '../hooks/useAuth';
import { Loader2, Leaf, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';

const AuthCallback: React.FC = () => {
  const { user, authChecking } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('Login link has expired or is invalid.');
  const [errorHint, setErrorHint] = useState<string | null>(null);

  useEffect(() => {
    if (authChecking) {
      return; 
    }

    if (user) {
      // SUCCESS: Set the flag for the celebration modal
      sessionStorage.setItem('show_sync_celebration', 'true');
      
      setStatus('success');
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } else {
      const hash = window.location.hash;
      if (hash.includes('error_description')) {
        const params = new URLSearchParams(hash.substring(1));
        setErrorMessage(params.get('error_description') || 'An unknown error occurred.');
      }
      
      const timer = setTimeout(() => {
        const { user: stillNoUser } = getSupabaseUserFromLocalStorage();
        if (!stillNoUser) { 
          setStatus('error');
          setErrorHint('On mobile, try copying the link from your email and pasting it directly into your main browser (like Chrome or Safari).');
        } else {
             // Late success check
             sessionStorage.setItem('show_sync_celebration', 'true');
             setStatus('success');
             setTimeout(() => {
                window.location.href = '/';
             }, 1500);
        }
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [authChecking, user]);

  const renderContent = () => {
    switch (status) {
      case 'success':
        return (
          <>
            <div className="bg-green-100 p-5 rounded-[2.5rem] border-4 border-green-200 shadow-sm mb-6 animate-bounce">
              <CheckCircle size={48} className="text-green-600" />
            </div>
            <h1 className="text-3xl font-black text-[#4b7d78]">Login Successful ✅</h1>
            <p className="text-[#6d7c8e] font-bold mt-2">Taking you to the island...</p>
          </>
        );
      case 'error':
        return (
          <>
            <div className="bg-red-100 p-5 rounded-[2.5rem] border-4 border-red-200 shadow-sm mb-6">
              <AlertCircle size={48} className="text-red-600" />
            </div>
            <h1 className="text-3xl font-black text-[#4b7d78]">Login Failed</h1>
            <p className="text-[#6d7c8e] font-bold mt-2 max-w-xs">
              ⚠️ {errorMessage}
            </p>

            {errorHint && (
              <div className="mt-6 w-full bg-amber-50 p-4 rounded-2xl border-2 border-dashed border-amber-200 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <HelpCircle size={16} className="text-amber-600" />
                  <p className="text-[11px] font-black text-amber-800 uppercase tracking-wider">Pro Tip</p>
                </div>
                <p className="text-xs text-amber-700 font-bold leading-snug">{errorHint}</p>
              </div>
            )}

            <a
              href="/"
              className="mt-8 inline-block bg-[#ff7b72] text-white px-8 py-4 rounded-[2rem] font-black shadow-[0_6px_0_#d32f2f] border-2 border-[#ff8a80] hover:bg-[#ff8a80] transition-colors bubble-button"
            >
              Back to Login
            </a>
          </>
        );
      case 'loading':
      default:
        return (
          <>
            <div className="bg-white p-6 rounded-[2.5rem] shadow-lg border-4 border-[#e0d9b4]">
              <Leaf className="text-[#8bc34a] w-12 h-12 animate-pulse fill-current" />
            </div>
            <div className="mt-6 flex items-center gap-2 text-[#4b7d78] font-black uppercase tracking-[0.2em]">
              <Loader2 className="animate-spin" />
              🏝️ Logging into Shelly Spanish Island...
            </div>
            <p className="text-[#8d99ae] font-bold mt-4 text-sm">Please wait while we connect you to the island.</p>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 text-center">
      <div className="island-card rounded-[3.5rem] p-8 md:p-12 w-full max-w-md flex flex-col items-center">
        {renderContent()}
      </div>
    </div>
  );
};

export default AuthCallback;
