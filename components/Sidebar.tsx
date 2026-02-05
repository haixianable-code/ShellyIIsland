
import React from 'react';
import { AppView } from '../types';
import { Home, Briefcase, Leaf, Heart } from 'lucide-react';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
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
