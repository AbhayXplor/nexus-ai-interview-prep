
import React from 'react';
import { LANDING_HERO_IMAGE } from '../constants';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0d1117] selection:bg-[#00A3FF]/40">
      <nav className="flex items-center justify-between px-10 py-10 max-w-7xl mx-auto w-full">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-[#00A3FF] rounded-xl flex items-center justify-center shadow-lg shadow-[#00A3FF]/30">
             <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M13 2L3 14H12L11 22L21 10H12L13 2Z"/></svg>
          </div>
          <span className="text-3xl font-black text-white tracking-tighter">NEXUS</span>
        </div>
        <div className="flex items-center space-x-12 text-sm font-bold text-[#8b949e]">
          <button 
            onClick={onGetStarted}
            className="px-8 py-4 bg-white text-black rounded-2xl font-black hover:bg-[#00A3FF] hover:text-white transition-all transform active:scale-95 shadow-2xl"
          >
            Start Mock Session
          </button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center px-8 pt-16 pb-32 text-center max-w-6xl mx-auto relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#00A3FF]/15 via-transparent to-transparent -z-10"></div>
        
        <h1 className="text-7xl md:text-9xl font-black text-white leading-[0.95] mb-12 tracking-tightest">
          MASTER YOUR <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A3FF] to-[#0066FF]">INTERVIEW</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-[#8b949e] max-w-4xl mb-20 leading-relaxed font-medium">
          The world's most advanced mock interview simulator. Experience high-fidelity technical coaching with low-latency voice dialogue and personalized assessment scenarios.
        </p>

        <div className="mb-24">
          <button 
            onClick={onGetStarted}
            className="px-12 py-6 bg-[#00A3FF] text-white rounded-2xl font-black text-2xl hover:bg-[#0082CC] transition-all transform hover:scale-105 active:scale-95 shadow-2xl shadow-[#00A3FF]/40 flex items-center group"
          >
            LAUNCH MOCK SESSION
            <svg className="ml-4 group-hover:translate-x-2 transition-transform" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>

        <div className="w-full rounded-[40px] border border-[#30363d] bg-[#161b22] shadow-[0_60px_150px_rgba(0,0,0,0.8)] overflow-hidden">
          <div className="h-14 border-b border-[#30363d] bg-[#0d1117] flex items-center px-8 space-x-3">
            <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f56]"></div>
            <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f]"></div>
            <div className="flex-1"></div>
            <div className="text-[10px] font-black text-[#484f58] uppercase tracking-[0.2em]">Prep Environment v2.0</div>
          </div>
          <img 
             src={LANDING_HERO_IMAGE} 
             className="w-full aspect-[21/9] object-cover opacity-90 saturate-[0.8] hover:saturate-100 transition-all duration-700"
             alt="Nexus Mock Interview Workspace" 
          />
        </div>
      </main>

      <section className="py-40 bg-[#010409]">
        <div className="max-w-7xl mx-auto px-12 grid md:grid-cols-2 gap-32 items-center">
          <div>
            <h2 className="text-5xl md:text-7xl font-black text-white mb-12 tracking-tight">Practice Like It's Real.</h2>
            <p className="text-[#8b949e] text-xl mb-16 leading-relaxed font-medium">
              Don't leave your career to chance. Nexus simulates high-pressure conditions to help you refine your communication, logic, and implementation speed.
            </p>
            <div className="space-y-8">
              {[
                { title: "Real-time AI Coaching", desc: "Get immediate feedback and probing questions as you implement solutions." },
                { title: "Background Synthesis", desc: "Challenges are tailored to your actual GitHub and LinkedIn professional history." },
                { title: "Logic Regression Audit", desc: "A deep post-session analysis identifying where your logic or communication can improve." }
              ].map(feat => (
                <div key={feat.title} className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-4 text-white font-black text-xl uppercase tracking-widest">
                    <div className="w-2 h-8 bg-[#00A3FF]"></div>
                    <span>{feat.title}</span>
                  </div>
                  <p className="text-[#484f58] font-medium ml-6">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#0d1117] border border-[#30363d] rounded-[40px] p-12 aspect-square flex flex-col justify-center relative group">
             <div className="absolute inset-0 bg-[#00A3FF]/5 blur-[100px] group-hover:bg-[#00A3FF]/10 transition-all"></div>
             <div className="relative z-10 flex flex-col items-center">
                <div className="w-24 h-24 bg-[#00A3FF]/10 rounded-3xl flex items-center justify-center text-[#00A3FF] mb-10 shadow-inner">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>
                </div>
                <h4 className="text-white font-black text-4xl mb-4 text-center tracking-tight">MOCK VOICE CORE</h4>
                <p className="text-[#8b949e] text-center max-w-sm font-medium">Practice your verbal technical walkthroughs with natural, human-like dialogue.</p>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
