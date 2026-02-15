
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
        setResearchSteps(['Initializing Grounding Engine...', 'Connecting to LinkedIn Data API...']);
        
        try {
          // Artificial delays for "Demo Realism" to show loading/synthesis
          await new Promise(r => setTimeout(r, 800));
          setResearchSteps(prev => [...prev, 'Fetching GitHub Repository Metadata...']);
          
          const result = await researchCandidate(state.linkedInUrl, state.githubUrl);
          
          await new Promise(r => setTimeout(r, 1000));
          setResearchSteps(prev => [...prev, 'Analyzing Commit Patterns & Tech Stack...', 'Synthesizing Seniority Markers...']);
          
          setTimeout(() => {
            setState(prev => ({
              ...prev,
              candidateSummary: result.text,
              status: InterviewStatus.ACTIVE
            }));
          }, 1500);
        } catch (e: any) {
          console.error("Research failed unexpectedly", e);
          setResearchError("Nexus encountered a grounding error. Please verify profile accessibility.");
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
                  <h2 className="text-3xl font-black text-white uppercase tracking-tight">System Grounding Error</h2>
                  <p className="text-[#8b949e] font-medium leading-relaxed">
                    Nexus could not verify identity links. Ensure profiles are public or check API quotas.
                  </p>
                </div>
                <button 
                  onClick={() => setState(prev => ({ ...prev, candidateSummary: "Bypassed research due to technical timeout.", status: InterviewStatus.ACTIVE }))}
                  className="w-full bg-[#00A3FF] hover:bg-[#0082CC] text-white font-black py-5 rounded-2xl shadow-2xl transition-all transform hover:scale-105 active:scale-95 text-lg uppercase tracking-widest"
                >
                  Proceed without Background
                </button>
             </div>
           ) : (
             <>
               <div className="relative mb-12">
                 <div className="w-40 h-40 border-4 border-[#00A3FF]/10 border-t-[#00A3FF] rounded-full animate-spin"></div>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 bg-[#00A3FF]/5 rounded-full animate-pulse flex items-center justify-center">
                       <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#00A3FF" strokeWidth="2.5"><path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"/></svg>
                    </div>
                 </div>
               </div>
               <div className="text-center space-y-8">
                  <div>
                    <h2 className="text-4xl font-black text-white tracking-tight uppercase mb-2">Building Context</h2>
                    <p className="text-[#484f58] text-[10px] font-black tracking-widest uppercase">Nexus identity synthesis in progress</p>
                  </div>
                  <div className="space-y-3 bg-[#161b22] p-6 rounded-2xl border border-[#30363d] w-96 mx-auto">
                    {researchSteps.map((step, idx) => (
                      <p key={idx} className="text-[#8b949e] text-[11px] font-mono flex items-center animate-in fade-in slide-in-from-left-4 duration-500">
                        <span className="text-[#238636] mr-3 font-bold">DONE</span> {step}
                      </p>
                    ))}
                    <p className="text-[#00A3FF] text-[11px] font-mono flex items-center animate-pulse">
                      <span className="mr-3 font-bold">WAIT</span> Processing modality inputs...
                    </p>
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
           <div className="w-20 h-20 bg-[#238636]/10 rounded-full flex items-center justify-center text-[#238636] border border-[#238636]/20 mb-4">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
           </div>
           <h1 className="text-5xl font-black text-white uppercase tracking-tight">Session Concluded</h1>
           <p className="text-[#8b949e] font-medium">All training data has been archived. Refresh to start a new loop.</p>
           <button 
            onClick={() => window.location.reload()}
            className="px-12 py-4 bg-[#21262d] border border-[#30363d] rounded-2xl hover:bg-[#30363d] transition-all font-black uppercase tracking-widest text-xs"
          >
            Return to Onboarding
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
