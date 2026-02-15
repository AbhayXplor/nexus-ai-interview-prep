
import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Onboarding from './components/Onboarding';
import Workspace from './components/Workspace';
import { InterviewStatus, InterviewState, ChatMessage } from './types';
import { INITIAL_FILES } from './constants';
import { researchCandidate } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<InterviewState>({
    status: InterviewStatus.LANDING,
    userName: '',
    linkedInUrl: '',
    githubUrl: '',
    files: INITIAL_FILES,
    activeFileIndex: 0,
    messages: [],
    isThinking: false,
    isMicActive: false,
    terminalOutput: []
  });

  const [researchSteps, setResearchSteps] = useState<string[]>([]);
  const [researchError, setResearchError] = useState<string | null>(null);

  const startOnboarding = () => {
    setState(prev => ({ ...prev, status: InterviewStatus.ONBOARDING }));
  };

  const startInterviewResearch = (linkedInUrl: string, githubUrl: string) => {
    setResearchError(null);
    setState(prev => ({
      ...prev,
      linkedInUrl,
      githubUrl,
      status: InterviewStatus.RESEARCHING
    }));
  };

  useEffect(() => {
    if (state.status === InterviewStatus.RESEARCHING) {
      const runResearch = async () => {
        setResearchSteps(['Accessing Grounding API...', 'Scanning Profile Data...']);
        
        try {
          const result = await researchCandidate(state.linkedInUrl, state.githubUrl);
          
          setResearchSteps(prev => [...prev, 'Synthesizing Projects...', 'Finalizing Personality Profile...']);
          
          setTimeout(() => {
            setState(prev => ({
              ...prev,
              candidateSummary: result.text,
              status: InterviewStatus.ACTIVE
            }));
          }, 1200);
        } catch (e: any) {
          console.error("Research failed unexpectedly", e);
          setResearchError("Unexpected error during research. Please check your internet connection.");
        }
      };
      
      runResearch();
    }
  }, [state.status, state.linkedInUrl, state.githubUrl]);

  const endInterview = () => {
    setState(prev => ({ ...prev, status: InterviewStatus.COMPLETED }));
  };

  const addMessage = (text: string, sender: 'INTERVIEWER' | 'CANDIDATE') => {
    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      sender,
      text,
      timestamp: new Date()
    };
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage]
    }));
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3]">
      {state.status === InterviewStatus.LANDING && (
        <LandingPage onGetStarted={startOnboarding} />
      )}

      {state.status === InterviewStatus.ONBOARDING && (
        <Onboarding onStart={startInterviewResearch} />
      )}

      {state.status === InterviewStatus.RESEARCHING && (
        <div className="flex items-center justify-center h-screen flex-col p-8 max-w-2xl mx-auto">
           {researchError ? (
             <div className="text-center space-y-8 animate-in fade-in duration-500">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mx-auto border border-red-500/20">
                   <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                </div>
                <div className="space-y-4">
                  <h2 className="text-3xl font-black text-white uppercase tracking-tight">System Error</h2>
                  <p className="text-[#8b949e] font-medium leading-relaxed">
                    Nexus encountered a critical failure during research.
                  </p>
                </div>
                <button 
                  onClick={() => setState(prev => ({ ...prev, candidateSummary: "Bypassed research due to technical error.", status: InterviewStatus.ACTIVE }))}
                  className="w-full bg-[#00A3FF] hover:bg-[#0082CC] text-white font-black py-5 rounded-2xl shadow-2xl transition-all transform hover:scale-105 active:scale-95 text-lg uppercase tracking-widest"
                >
                  Skip & Start Interview
                </button>
             </div>
           ) : (
             <>
               <div className="relative mb-12">
                 <div className="w-32 h-32 border-4 border-[#00A3FF]/20 border-t-[#00A3FF] rounded-full animate-spin"></div>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00A3FF" strokeWidth="3" className="animate-pulse"><path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"/></svg>
                 </div>
               </div>
               <div className="text-center space-y-6">
                  <h2 className="text-3xl font-black text-white tracking-tight uppercase">Profiling Candidate...</h2>
                  <div className="space-y-3">
                    {researchSteps.map((step, idx) => (
                      <p key={idx} className="text-[#8b949e] text-sm font-mono animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <span className="text-[#00A3FF] mr-2">›</span> {step}
                      </p>
                    ))}
                  </div>
               </div>
             </>
           )}
        </div>
      )}
      
      {state.status === InterviewStatus.ACTIVE && (
        <Workspace 
          state={state} 
          setState={setState} 
          onEnd={endInterview}
          addMessage={addMessage}
        />
      )}

      {state.status === InterviewStatus.COMPLETED && (
        <div className="flex items-center justify-center h-screen flex-col space-y-6">
           <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00A3FF] to-[#0066FF]">
            Interview Session Ended
          </h1>
          <p className="text-[#8b949e]">Reviewing your performance data...</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-[#21262d] border border-[#30363d] rounded-2xl hover:bg-[#30363d] transition-all font-black uppercase tracking-widest text-xs"
          >
            Start New Session
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
