
import React, { useState } from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const items = [
    { id: 'EXPLORER', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', label: 'Explorer' },
    { id: 'SEARCH', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', label: 'Search Context' },
    { id: 'DEBUG', icon: 'M13 10V3L4 14h7v7l9-11h-7z', label: 'Run Analysis' },
  ];

  return (
    <div className="w-14 bg-[#0d1117] border-r border-[#30363d] flex flex-col items-center py-4 space-y-4 relative">
      {items.map(item => (
        <div 
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all cursor-pointer group relative ${activeTab === item.id ? 'bg-[#00A3FF]/10 text-[#00A3FF]' : 'text-[#484f58] hover:text-[#e6edf3] hover:bg-[#21262d]'}`}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d={item.icon} />
          </svg>
          {/* Tooltip */}
          <div className="absolute left-full ml-4 px-2 py-1 bg-[#21262d] text-white text-[10px] font-black uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap border border-[#30363d]">
            {item.label}
          </div>
        </div>
      ))}
      <div className="mt-auto flex flex-col items-center space-y-4 pb-2">
        <div 
          onClick={() => { setShowProfile(!showProfile); setShowSettings(false); }}
          className="w-10 h-10 flex items-center justify-center rounded-xl text-[#484f58] hover:text-[#e6edf3] hover:bg-[#21262d] cursor-pointer group relative transition-all"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
           <div className="absolute left-full ml-4 px-2 py-1 bg-[#21262d] text-white text-[10px] font-black uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap border border-[#30363d]">
            Profile
          </div>
        </div>
        <div 
          onClick={() => { setShowSettings(!showSettings); setShowProfile(false); }}
          className="w-10 h-10 flex items-center justify-center rounded-xl text-[#484f58] hover:text-[#e6edf3] hover:bg-[#21262d] cursor-pointer group relative transition-all"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
           <div className="absolute left-full ml-4 px-2 py-1 bg-[#21262d] text-white text-[10px] font-black uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap border border-[#30363d]">
            Settings
          </div>
        </div>
      </div>

      {/* Popovers */}
      {showProfile && (
        <div className="absolute left-16 bottom-16 w-64 bg-[#161b22] border border-[#30363d] rounded-xl p-4 shadow-2xl z-[60] animate-in slide-in-from-left-2 duration-200">
           <h4 className="text-[10px] font-black uppercase tracking-widest text-[#00A3FF] mb-2">Active Candidate</h4>
           <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#30363d] flex items-center justify-center text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold truncate">Professional Candidate</p>
                <p className="text-[10px] text-[#484f58] truncate">Interview in progress</p>
              </div>
           </div>
        </div>
      )}

      {showSettings && (
        <div className="absolute left-16 bottom-4 w-64 bg-[#161b22] border border-[#30363d] rounded-xl p-4 shadow-2xl z-[60] animate-in slide-in-from-left-2 duration-200">
           <h4 className="text-[10px] font-black uppercase tracking-widest text-[#00A3FF] mb-3">Settings</h4>
           <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8b949e]">Voice Response</span>
                <div className="w-8 h-4 bg-[#00A3FF] rounded-full relative">
                  <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8b949e]">AI Thinking Model</span>
                <span className="text-white font-bold">3 Flash</span>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
