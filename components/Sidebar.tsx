
import React, { useRef, useState } from 'react';
import { AppView } from '../types';
import { Home, Briefcase, Leaf, Heart, RotateCcw, Download, Upload, Volume2, VolumeX } from 'lucide-react';
import { toggleMute, getMuteState, playClick } from '../utils/sfx';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMuted, setIsMuted] = useState(getMuteState());

  const navItems = [
    { id: AppView.DASHBOARD, icon: Home, label: 'Island Home', color: '#ff7b72' },
    { id: AppView.VOCABULARY, icon: Briefcase, label: 'My Pocket', color: '#ffb74d' },
  ];

  const handleReset = () => {
    playClick();
    if (confirm("Reset all progress? This will delete your learning history on this device.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleToggleMute = () => {
    playClick();
    const newState = toggleMute();
    setIsMuted(newState);
  };

  const handleExport = () => {
    playClick();
    const data = localStorage.getItem('hola_word_srs_v3_offline');
    if (!data) return alert("No progress to backup yet!");
    
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shelly-island-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    playClick();
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        // Basic validation
        JSON.parse(json); 
        localStorage.setItem('hola_word_srs_v3_offline', json);
        alert("Island restored successfully! Reloading...");
        window.location.reload();
      } catch (err) {
        alert("Invalid backup file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <aside className="w-64 bg-[#f9f5da] border-r-4 border-[#e0d9b4] hidden md:flex flex-col h-screen fixed left-0 top-0 z-10 shadow-[10px_0_0_rgba(224,217,180,0.4)]">
      <div className="p-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-[#78c850] rounded-[2.5rem] shadow-[0_8px_0_#5a9a3b] mb-4 border-4 border-white">
          <Leaf className="text-white w-10 h-10 fill-current" />
        </div>
        <h1 className="text-xl font-black text-[#4b7d78] tracking-tight leading-tight">Shelly Spanish Island</h1>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { playClick(); setView(item.id); }}
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

        <div className="pt-8 px-2 space-y-3">
           <p className="text-[9px] font-black text-[#8d99ae] uppercase tracking-widest pl-2">Settings</p>
           
           <button onClick={handleToggleMute} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[#4b7d78] hover:bg-[#fff6e0] transition-colors border-2 border-transparent hover:border-[#e0d9b4]">
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              <span className="text-sm font-black">{isMuted ? 'Sound Off' : 'Sound On'}</span>
           </button>

           <button onClick={handleExport} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[#4b7d78] hover:bg-[#fff6e0] transition-colors border-2 border-transparent hover:border-[#e0d9b4]">
              <Download size={18} />
              <span className="text-sm font-black">Backup Memory</span>
           </button>

           <button onClick={handleImportClick} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[#4b7d78] hover:bg-[#fff6e0] transition-colors border-2 border-transparent hover:border-[#e0d9b4]">
              <Upload size={18} />
              <span className="text-sm font-black">Restore Memory</span>
           </button>
           <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".json" />
        </div>
      </nav>

      <div className="p-4 space-y-4">
        <button
          onClick={handleReset}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-[#d32f2f]/60 font-black hover:bg-red-50 hover:text-[#d32f2f] transition-colors"
        >
          <RotateCcw size={16} />
          <span>Reset Island</span>
        </button>
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
