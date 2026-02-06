import React from 'react';
import { Leaf, UserPlus, Compass } from 'lucide-react';

interface WelcomeViewProps {
  onSelectGuest: () => void;
  onSelectAuth: () => void;
}

const WelcomeView: React.FC<WelcomeViewProps> = ({ onSelectGuest, onSelectAuth }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center selection:bg-[#ffd3b6] selection:text-[#e67e22]">
      <div className="max-w-lg w-full mx-auto animate-fadeIn">
        <header className="mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-[#78c850] rounded-[3rem] shadow-[0_10px_0_#5a9a3b] mb-6 border-4 border-white animate-bounce">
            <Leaf className="text-white w-12 h-12 fill-current" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#4b7d78] tracking-tight leading-tight">
            Welcome to Shelly Spanish Island!
          </h1>
          <p className="text-[#6d7c8e] font-bold mt-3 text-lg">Your adventure starts here. Choose your path:</p>
        </header>

        <main className="space-y-6">
          <button
            onClick={onSelectAuth}
            className="group w-full text-left p-6 bg-white rounded-[3rem] border-4 border-[#8bc34a] shadow-[0_10px_0_#689f38] hover:shadow-[0_12px_0_#5a9a3b] hover:-translate-y-1 transition-all flex items-center gap-6 bubble-button"
          >
            <div className="bg-[#e8f5e9] p-4 rounded-3xl border-2 border-[#a5d6a7] group-hover:scale-110 transition-transform">
              <UserPlus className="text-[#388e3c]" size={32} />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#4b7d78]">Save to Cloud</h2>
              <p className="text-sm font-bold text-[#8d99ae]">Login or create an account to sync progress.</p>
            </div>
          </button>
          
          <button
            onClick={onSelectGuest}
            className="group w-full text-left p-6 bg-white rounded-[3rem] border-4 border-[#e0d9b4] shadow-[0_10px_0_#d0d0d0] hover:shadow-[0_12px_0_#c0c0c0] hover:-translate-y-1 transition-all flex items-center gap-6 bubble-button"
          >
            <div className="bg-[#f1f8e9] p-4 rounded-3xl border-2 border-[#e0e0e0] group-hover:scale-110 transition-transform">
              <Compass className="text-[#8d99ae]" size={32} />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#4b7d78]">Explore as Guest</h2>
              <p className="text-sm font-bold text-[#8d99ae]">Progress saved on this device only.</p>
            </div>
          </button>
        </main>
      </div>
    </div>
  );
};

export default WelcomeView;