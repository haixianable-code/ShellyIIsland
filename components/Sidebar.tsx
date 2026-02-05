
import React from 'react';
import { AppView } from '../types';
import { Home, Briefcase, Leaf, Sun, Star, Heart } from 'lucide-react';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  onStreakClick: () => void;
  streak: number;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, onStreakClick, streak }) => {
  const navItems = [
    { id: AppView.DASHBOARD, icon: Home, label: 'Island Home', color: '#ff7b72' },
    { id: AppView.VOCABULARY, icon: Briefcase, label: 'My Pocket', color: '#ffb74d' },
  ];

  return (
    <aside className="w-64 bg-[#f9f5da] border-r-4 border-[#e0d9b4] hidden md:flex flex-col h-screen fixed left-0 top-0 z-10 shadow-[10px_0_0_rgba(224,217,180,0.4)]">
      <div className="p-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-[#78c850] rounded-[2.5rem] shadow-[0_8px_0_#5a9a3b] mb-4 border-4 border-white">
          <Leaf className="text-white w-10 h-10 fill-current" />
        </div>
        <h1 className="text-2xl font-black text-[#4b7d78] tracking-tight">Hola Island</h1>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-5 rounded-[2.5rem] transition-all duration-200 border-b-8 ${
                isActive
                  ? 'bg-[#ffa600] text-white font-black border-[#cc8400] shadow-md -translate-y-1'
                  : 'text-[#8d99ae] hover:bg-[#fff6e0] border-transparent'
              }`}
            >
              <div className={`p-3 rounded-2xl shadow-sm ${isActive ? 'bg-white/30' : 'bg-white border-2 border-[#f0f0f0]'}`}>
                <Icon size={24} className={isActive ? 'text-white' : 'text-[#8d99ae]'} />
              </div>
              <span className="text-lg font-black">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 space-y-6">
        <div 
          onClick={onStreakClick}
          className="bg-[#88d068] rounded-[2rem] p-5 border-b-8 border-[#66a04e] flex flex-col items-center shadow-md cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <p className="text-[9px] font-black text-white/90 uppercase tracking-[0.2em] mb-2">Daily Streak</p>
          <div className="flex items-center gap-2 mb-3">
             <div className="bg-[#ffeb3b] p-2 rounded-full shadow-md border-2 border-white animate-pulse">
               <Star className="text-[#f57c00] w-5 h-5 fill-current" />
             </div>
             <span className="text-xl font-black text-white drop-shadow-sm">{streak} Days</span>
          </div>
          <div className="w-full bg-black/10 h-3 rounded-full overflow-hidden shadow-inner border border-white/20">
            <div 
              className="bg-white h-full rounded-full transition-all duration-1000" 
              style={{ width: `${Math.min(100, (streak / 30) * 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="flex flex-col items-center opacity-30 gap-1 pb-4">
          <div className="flex items-center gap-1.5 text-[8px] font-black text-[#4b7d78] uppercase tracking-[0.4em]">
            Made By SHELLY
          </div>
          <Heart size={8} className="text-[#ff7b72] fill-current" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
