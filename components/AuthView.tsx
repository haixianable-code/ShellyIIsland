import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Leaf, Mail, KeyRound, LogIn, UserPlus, AlertCircle, ArrowLeft } from 'lucide-react';

interface AuthViewProps {
  onBack?: () => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage("Success! Check your email for a confirmation link.");
      }
    } catch (error: any) {
      setError(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

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
          <div className="inline-flex items-center justify-center w-24 h-24 bg-[#78c850] rounded-[3rem] shadow-[0_10px_0_#5a9a3b] mb-6 border-4 border-white animate-bounce">
            <Leaf className="text-white w-12 h-12 fill-current" />
          </div>
          <h1 className="text-4xl font-black text-[#4b7d78] tracking-tight">Welcome to Hola Island!</h1>
          <p className="text-[#6d7c8e] font-bold mt-2">Your personal Spanish garden awaits.</p>
        </header>

        <main className="bg-white p-8 rounded-[3.5rem] border-[8px] border-[#e0d9b4] shadow-[0_12px_0_rgba(0,0,0,0.08)]">
          <form onSubmit={handleAuth} className="space-y-6">
            <h2 className="text-2xl font-black text-center text-[#4b7d78]">{isLogin ? "Welcome Back!" : "Join the Island"}</h2>
            
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8d99ae]" size={20} />
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-4 bg-[#f1f8e9] border-2 border-[#e0d9b4] rounded-2xl font-bold text-[#4b7d78] placeholder:text-[#8d99ae]/70 focus:outline-none focus:ring-4 focus:ring-[#8bc34a]/50 transition-all"
              />
            </div>

            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8d99ae]" size={20} />
              <input
                type="password"
                placeholder="Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full pl-12 pr-4 py-4 bg-[#f1f8e9] border-2 border-[#e0d9b4] rounded-2xl font-bold text-[#4b7d78] placeholder:text-[#8d99ae]/70 focus:outline-none focus:ring-4 focus:ring-[#8bc34a]/50 transition-all"
              />
            </div>

            {error && (
              <div className="bg-[#ffebee] border-2 border-[#e57373] text-[#c62828] p-3 rounded-xl text-sm font-bold flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {message && (
              <div className="bg-[#e8f5e9] border-2 border-[#a5d6a7] text-[#2e7d32] p-3 rounded-xl text-sm font-bold flex items-center gap-2">
                <UserPlus size={16} />
                <span>{message}</span>
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading || !!message}
              className={`w-full p-5 rounded-[2rem] text-white font-black text-lg flex items-center justify-center gap-3 transition-all bubble-button disabled:opacity-50 disabled:cursor-not-allowed ${
                isLogin
                  ? 'bg-[#88d068] shadow-[0_8px_0_#5a9a3b] hover:bg-[#96e072] disabled:bg-[#a5d6a7]'
                  : 'bg-[#ff7b72] shadow-[0_8px_0_#d32f2f] hover:bg-[#ff8a80] disabled:bg-[#ffab91]'
              }`}
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white/50 border-t-white rounded-full animate-spin"></div>
              ) : isLogin ? (
                <> <LogIn size={22} /> Enter Island </>
              ) : (
                <> <UserPlus size={22} /> Create Account </>
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <button onClick={() => { setIsLogin(!isLogin); setError(null); setMessage(null); }} className="text-sm font-bold text-[#8d99ae] hover:text-[#4b7d78] transition-colors">
              {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuthView;
