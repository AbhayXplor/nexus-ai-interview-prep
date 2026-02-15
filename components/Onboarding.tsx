
import React, { useState } from 'react';

interface OnboardingProps {
  onStart: (linkedIn: string, github: string) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onStart }) => {
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');

  const isValid = linkedin.trim() !== '' && github.trim() !== '';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden bg-[#0d1117]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00A3FF] opacity-5 blur-[150px] rounded-full pointer-events-none"></div>
      
      <div className="z-10 w-full max-w-3xl flex flex-col items-center space-y-12 text-center">
        <div className="flex items-center space-y-6 flex-col">
          <div className="w-16 h-16 bg-[#00A3FF] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#00A3FF]/40 transform rotate-45">
             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" className="-rotate-45"><path d="M13 2L3 14H12L11 22L21 10H12L13 2Z"/></svg>
          </div>
          <span className="text-xl font-black text-white tracking-[0.2em] uppercase">Identity Link</span>
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-black tracking-tightest text-white leading-none">
            SYNC <br/><span className="text-[#00A3FF]">BACKGROUND.</span>
          </h1>
          <p className="text-[#8b949e] text-lg max-w-xl mx-auto leading-relaxed font-medium">
            Nexus analyzes your public history to generate project-specific technical assessments.
          </p>
        </div>

        <div className="w-full max-w-lg space-y-4">
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="LinkedIn Profile URL"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              className="w-full bg-[#161b22] border-2 border-[#30363d] rounded-2xl py-5 px-8 text-white text-md font-medium focus:outline-none focus:border-[#00A3FF] transition-all placeholder:text-[#484f58] shadow-inner"
            />
            <input 
              type="text" 
              placeholder="GitHub Profile URL"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              className="w-full bg-[#161b22] border-2 border-[#30363d] rounded-2xl py-5 px-8 text-white text-md font-medium focus:outline-none focus:border-[#00A3FF] transition-all placeholder:text-[#484f58] shadow-inner"
            />
          </div>

          <button 
            onClick={() => onStart(linkedin, github)}
            disabled={!isValid}
            className="w-full bg-[#00A3FF] hover:bg-[#0082CC] disabled:opacity-30 text-white font-black py-5 rounded-2xl shadow-2xl shadow-[#00A3FF]/30 flex items-center justify-center space-x-3 transition-all transform hover:scale-[1.02] active:scale-[0.98] text-lg uppercase tracking-widest"
          >
            <span>Research & Initialize</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </button>
        </div>

        <div className="flex items-center space-x-3 text-[10px] font-black text-[#484f58] uppercase tracking-widest">
           <div className="w-2.5 h-2.5 rounded-full bg-[#238636] animate-pulse"></div>
           <span>Direct Pipeline Active</span>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
