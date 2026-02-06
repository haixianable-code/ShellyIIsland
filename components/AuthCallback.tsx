import React, { useEffect, useState } from 'react';
// FIX: Import the standalone helper function instead of trying to modify the useAuth hook.
import { useAuth, getSupabaseUserFromLocalStorage } from '../hooks/useAuth';
import { Loader2, Leaf, CheckCircle, AlertCircle } from 'lucide-react';

const AuthCallback: React.FC = () => {
  const { user, authChecking } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('⚠️ 登录链接已失效或无效');

  useEffect(() => {
    if (authChecking) {
      return; // Wait until Supabase has checked the auth state
    }

    if (user) {
      setStatus('success');
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } else {
      // If auth check is complete but there's no user, there might be an error in the hash
      const hash = window.location.hash;
      if (hash.includes('error_description')) {
        const params = new URLSearchParams(hash.substring(1));
        setErrorMessage(params.get('error_description') || 'An unknown error occurred.');
      }
      
      // After a timeout, if still no user, assume failure.
      const timer = setTimeout(() => {
        // Re-check inside timeout to avoid race conditions
        // FIX: Call the new helper function to synchronously get the user state.
        const { user: stillNoUser } = getSupabaseUserFromLocalStorage();
        if (!stillNoUser) { 
          setStatus('error');
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
            <h1 className="text-3xl font-black text-[#4b7d78]">登录成功 ✅</h1>
            <p className="text-[#6d7c8e] font-bold mt-2">正在带您前往小岛...</p>
          </>
        );
      case 'error':
        return (
          <>
            <div className="bg-red-100 p-5 rounded-[2.5rem] border-4 border-red-200 shadow-sm mb-6">
              <AlertCircle size={48} className="text-red-600" />
            </div>
            <h1 className="text-3xl font-black text-[#4b7d78]">登录失败</h1>
            <p className="text-[#6d7c8e] font-bold mt-2 max-w-xs">{errorMessage}</p>
            <a
              href="/"
              className="mt-8 inline-block bg-[#ff7b72] text-white px-8 py-4 rounded-[2rem] font-black shadow-[0_6px_0_#d32f2f] border-2 border-[#ff8a80] hover:bg-[#ff8a80] transition-colors bubble-button"
            >
              返回登录页
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
              🏝️ 正在登录 Shelly Spanish Island...
            </div>
            <p className="text-[#8d99ae] font-bold mt-4 text-sm">请稍候，我们正在将您连接到岛屿。</p>
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

// FIX: Removed incorrect assignment of `getState`. This logic was moved to a standalone function in `hooks/useAuth.ts`.

export default AuthCallback;
