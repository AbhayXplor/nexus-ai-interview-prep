
import React from 'react';
import { LANDING_HERO_IMAGE } from '../constants';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0d1117] selection:bg-[#00A3FF]/40 text-[#e6edf3]">
      {/* Sticky Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] backdrop-blur-xl bg-[#0d1117]/80 border-b border-[#30363d] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="w-8 h-8 bg-[#00A3FF] rounded-lg flex items-center justify-center shadow-lg shadow-[#00A3FF]/20 group-hover:scale-110 transition-transform">
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M13 2L3 14H12L11 22L21 10H12L13 2Z"/></svg>
            </div>
            <span className="text-xl font-black text-white tracking-tighter uppercase">Nexus</span>
          </div>
          <div className="hidden md:flex items-center space-x-8 text-[11px] font-black uppercase tracking-widest text-[#8b949e]">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <a href="#tech" className="hover:text-white transition-colors">Tech Stack</a>
            <button 
              onClick={onGetStarted}
              className="px-6 py-3 bg-[#00A3FF] text-white rounded-xl font-black hover:bg-[#0082CC] transition-all transform active:scale-95 shadow-lg shadow-[#00A3FF]/20"
            >
              Start Interview
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-48 pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#00A3FF]/10 via-transparent to-transparent -z-10"></div>
        <div className="max-w-6xl mx-auto text-center space-y-12">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#00A3FF]/10 border border-[#00A3FF]/20 text-[#00A3FF] text-[10px] font-black uppercase tracking-[0.2em] animate-in fade-in slide-in-from-top-4 duration-700">
             <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00A3FF] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00A3FF]"></span>
            </span>
             <span>Powered by Google Gemini 3</span>
          </div>
          
          <h1 className="text-6xl md:text-[100px] font-black text-white leading-[0.85] tracking-tightest animate-in fade-in slide-in-from-bottom-8 duration-700">
            MASTER TECHNICAL <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A3FF] via-[#0066FF] to-[#00A3FF] bg-[length:200%_auto] animate-gradient-x">INTERVIEWS.</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-[#8b949e] max-w-3xl mx-auto leading-relaxed font-medium animate-in fade-in duration-1000 delay-200">
            Stop practicing generic LeetCode. Nexus researches your actual GitHub and LinkedIn history to build bespoke technical challenges that probe your real-world architecture.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-in fade-in duration-1000 delay-300">
            <button 
              onClick={onGetStarted}
              className="w-full sm:w-auto px-12 py-6 bg-[#00A3FF] text-white rounded-2xl font-black text-xl hover:bg-[#0082CC] transition-all transform hover:scale-105 active:scale-95 shadow-2xl shadow-[#00A3FF]/30 flex items-center justify-center group"
            >
              LAUNCH MOCK SESSION
              <svg className="ml-4 group-hover:translate-x-2 transition-transform" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
            <button className="w-full sm:w-auto px-10 py-6 bg-[#21262d] text-white rounded-2xl font-black text-xl hover:bg-[#30363d] transition-all border border-[#30363d]">
              VIEW DEMO
            </button>
          </div>
        </div>
      </header>

      {/* Problem/Solution Section */}
      <section id="features" className="py-32 bg-[#010409]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">The Personalization <br/><span className="text-[#00A3FF]">Gap.</span></h2>
              <p className="text-[#8b949e] text-lg leading-relaxed">
                Generic prep tools treat every candidate like a blank slate. They ignore the months of engineering logic you've already committed to public repos.
              </p>
              
              <div className="space-y-8">
                <div className="flex space-x-6">
                  <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center shrink-0 border border-red-500/20 text-red-500">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                  </div>
                  <div>
                    <h4 className="text-white font-black uppercase tracking-widest text-sm mb-2">Generic Mockups</h4>
                    <p className="text-[#484f58] text-sm">Static questions that don't scale with your seniority or specific tech stack.</p>
                  </div>
                </div>
                <div className="flex space-x-6">
                  <div className="w-12 h-12 bg-[#00A3FF]/10 rounded-xl flex items-center justify-center shrink-0 border border-[#00A3FF]/20 text-[#00A3FF]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  </div>
                  <div>
                    <h4 className="text-[#00A3FF] font-black uppercase tracking-widest text-sm mb-2">Nexus Identity Engine</h4>
                    <p className="text-[#484f58] text-sm">Real-time grounding across your professional history ensures every question has a purpose.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-[#00A3FF]/10 blur-[120px] rounded-full group-hover:bg-[#00A3FF]/20 transition-all"></div>
              <div className="relative bg-[#161b22] border border-[#30363d] rounded-[32px] p-8 shadow-2xl overflow-hidden">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="flex-1 h-px bg-[#30363d]"></div>
                </div>
                <div className="font-mono text-[13px] space-y-4">
                  <p className="text-[#00A3FF]">Nexus // Identity Verification Active</p>
                  <p className="text-[#8b949e]">Checking: github.com/user/project-x</p>
                  <p className="text-[#e6edf3]"><span className="text-[#238636]">MATCH:</span> Found React Architecture in 'AuthModule.js'</p>
                  <p className="text-[#e6edf3] font-bold text-white mt-8 italic">"I see you implemented a custom JWT strategy in your AuthModule. Let's walk through how you handle token revocation."</p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#161b22] to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-32 bg-[#0d1117]">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-24">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">How It <span className="text-[#00A3FF]">Works.</span></h2>
            <p className="text-[#8b949e] max-w-2xl mx-auto">Three steps from generic prep to identity-aware performance.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connection Arrows (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-[30%] right-[30%] -translate-y-1/2 h-px border-t-2 border-dashed border-[#30363d] -z-10"></div>
            
            <div className="bg-[#161b22] border border-[#30363d] p-10 rounded-[32px] space-y-6 hover:border-[#00A3FF]/40 transition-all group">
              <div className="w-16 h-16 bg-[#00A3FF]/10 rounded-2xl flex items-center justify-center mx-auto text-[#00A3FF] border border-[#00A3FF]/20 group-hover:scale-110 transition-transform">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
              </div>
              <h3 className="text-white font-black uppercase tracking-widest text-lg">1. Connect</h3>
              <p className="text-[#8b949e] text-sm leading-relaxed">Sync your GitHub and LinkedIn. Nexus indexers build a technical map of your history.</p>
            </div>

            <div className="bg-[#161b22] border border-[#30363d] p-10 rounded-[32px] space-y-6 hover:border-[#00A3FF]/40 transition-all group">
              <div className="w-16 h-16 bg-[#00A3FF]/10 rounded-2xl flex items-center justify-center mx-auto text-[#00A3FF] border border-[#00A3FF]/20 group-hover:scale-110 transition-transform">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              </div>
              <h3 className="text-white font-black uppercase tracking-widest text-lg">2. Simulate</h3>
              <p className="text-[#8b949e] text-sm leading-relaxed">Speak and code in real-time. Experience low-latency probing from our Gemini-powered coaches.</p>
            </div>

            <div className="bg-[#161b22] border border-[#30363d] p-10 rounded-[32px] space-y-6 hover:border-[#00A3FF]/40 transition-all group">
              <div className="w-16 h-16 bg-[#00A3FF]/10 rounded-2xl flex items-center justify-center mx-auto text-[#00A3FF] border border-[#00A3FF]/20 group-hover:scale-110 transition-transform">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              </div>
              <h3 className="text-white font-black uppercase tracking-widest text-lg">3. Audit</h3>
              <p className="text-[#8b949e] text-sm leading-relaxed">Receive a deep session critique. Compare your logic against current industry benchmarks.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Trust Section */}
      <section id="tech" className="py-24 border-t border-[#30363d] bg-[#010409]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[10px] font-black text-[#484f58] uppercase tracking-[0.4em] mb-12">Built with World-Class Infrastructure</p>
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
             <div className="flex items-center space-x-3">
               <span className="text-white font-black text-xl tracking-tighter">Google Gemini 3</span>
             </div>
             <div className="flex items-center space-x-3">
               <span className="text-white font-black text-xl tracking-tighter">React 19</span>
             </div>
             <div className="flex items-center space-x-3">
               <span className="text-white font-black text-xl tracking-tighter">Live Audio API</span>
             </div>
             <div className="flex items-center space-x-3">
               <span className="text-white font-black text-xl tracking-tighter">TypeScript</span>
             </div>
             <div className="flex items-center space-x-3">
               <span className="text-white font-black text-xl tracking-tighter">Grounding Engine</span>
             </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-48 px-6 bg-[radial-gradient(circle_at_bottom,_rgba(0,163,255,0.05)_0%,_transparent_50%)]">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-none">
            READY TO <br/>FIX YOUR <span className="text-[#00A3FF]">LOOP?</span>
          </h2>
          <p className="text-[#8b949e] text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            The next generation of technical coaching is here. Stop guessing and start knowing your bar.
          </p>
          <button 
            onClick={onGetStarted}
            className="px-16 py-8 bg-[#00A3FF] text-white rounded-[32px] font-black text-3xl hover:bg-[#0082CC] transition-all transform hover:scale-105 active:scale-95 shadow-2xl shadow-[#00A3FF]/40"
          >
            START TRAINING
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[#30363d] bg-[#010409]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0 text-[10px] font-black text-[#484f58] uppercase tracking-widest">
          <div className="flex items-center space-x-6">
            <span>© 2024 Nexus AI Prep</span>
            <span className="h-4 w-px bg-[#30363d]"></span>
            <span>Identity-Aware Coaching</span>
          </div>
          <div className="flex items-center space-x-8">
            <a href="https://github.com" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
