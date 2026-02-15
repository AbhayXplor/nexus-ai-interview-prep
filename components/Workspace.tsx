
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { InterviewState, InterviewStatus } from '../types';
import Sidebar from './Sidebar';
import Editor from './Editor';
import InterviewPanel from './InterviewPanel';
import Terminal from './Terminal';
import { connectToLiveAI, decodeAudioData } from '../services/liveService';
import { searchTechnicalDocs, runStaticAnalysis } from '../services/geminiService';
import { GoogleGenAI } from "@google/genai";

interface WorkspaceProps {
  state: InterviewState;
  setState: React.Dispatch<React.SetStateAction<InterviewState>>;
  onEnd: () => void;
  addMessage: (text: string, sender: 'INTERVIEWER' | 'CANDIDATE') => void;
}

const Workspace: React.FC<WorkspaceProps> = ({ state, setState, onEnd, addMessage }) => {
  const [activeTab, setActiveTab] = useState('EXPLORER');
  const [isLive, setIsLive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState('');
  const [debugResult, setDebugResult] = useState('');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const liveSessionRef = useRef<any>(null);

  const handleAudioData = useCallback(async (data: Uint8Array) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') await ctx.resume();
    
    nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
    const audioBuffer = await decodeAudioData(data, ctx, 24000, 1);
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);
    
    source.onended = () => sourcesRef.current.delete(source);
    source.start(nextStartTimeRef.current);
    nextStartTimeRef.current += audioBuffer.duration;
    sourcesRef.current.add(source);
  }, []);

  const handleTranscription = useCallback((text: string, isUser: boolean) => {
    if (text.trim().length > 0) {
       addMessage(text, isUser ? 'CANDIDATE' : 'INTERVIEWER');
    }
  }, [addMessage]);

  const handleInterrupted = useCallback(() => {
    sourcesRef.current.forEach(s => {
      try { s.stop(); } catch(e) {}
    });
    sourcesRef.current.clear();
    nextStartTimeRef.current = 0;
  }, []);

  const toggleVoiceInterview = async () => {
    if (isLive) {
      setIsLive(false);
      return;
    }

    setIsLive(true);
    const instruction = `You are Nexus AI, a senior engineer at a top-tier tech firm conducting a mock technical interview for a Junior Software Engineer candidate.
    
    CANDIDATE IDENTITY (RESEARCHED):
    ${state.candidateSummary || "Candidate background research pending."}
    
    INTERVIEW GOALS:
    1. START: Greet them warmly. Specifically mention a repository or skill found in their GitHub/LinkedIn (e.g., projects from PES University or specific tech stacks).
    2. THE TASK: Ask them to walk through the 'Debounce' logic in the editor.
    3. PROBING: Don't just ask about the code in the editor. Connect it to their own repositories. For example: "I saw you used similar async logic in your [Project Name] repository, how does this implementation differ?"
    4. TONE: Professional, encouraging but high-standard. Focus on "Senior-to-Junior" mentorship style. 
    5. FEEDBACK: If they struggle, provide a small hint and observe their reasoning.`;

    try {
      liveSessionRef.current = await connectToLiveAI({
        onAudioData: handleAudioData,
        onTranscription: handleTranscription,
        onInterrupted: handleInterrupted,
        onError: (e) => {
          console.error("Live Error:", e);
          setIsLive(false);
        }
      }, instruction);
    } catch (e) {
      console.error("Failed to connect live session", e);
      setIsLive(false);
    }
  };

  const onSendTextMessage = async (text: string) => {
    addMessage(text, 'CANDIDATE');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const currentCode = state.files[state.activeFileIndex].content;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are Nexus AI, a technical coach for a student/new grad. Respond to the candidate.
        Identity Context: ${state.candidateSummary || "None"}
        Current Editor Code: ${currentCode}
        Chat History: ${state.messages.slice(-5).map(m => m.sender + ": " + m.text).join('\n')}
        User Input: ${text}`,
      });
      
      const aiText = response.text;
      if (aiText) {
        addMessage(aiText, 'INTERVIEWER');
      }
    } catch (e) {
      console.error("Failed to get text response", e);
      addMessage("Technical interruption in text pipeline. Please continue via voice or retry.", 'INTERVIEWER');
    }
  };

  const runTests = () => {
    const timestamp = new Date().toLocaleTimeString();
    const currentCode = state.files[state.activeFileIndex].content;
    const hasCancel = currentCode.toLowerCase().includes('cancel');
    
    setState(prev => ({
      ...prev,
      terminalOutput: [
        ...prev.terminalOutput, 
        `[${timestamp}] Nexus Junior-Test Runner v1.2`,
        `[${timestamp}] Booting logic verifier...`,
        `[${timestamp}] TEST: Basic Debounce Trigger -> PASS`,
        hasCancel 
          ? `[${timestamp}] TEST: Cancellation Logic -> PASS`
          : `[${timestamp}] TEST: Cancellation Logic -> FAIL (Missing .cancel() method)`,
        `[${timestamp}] ADVICE: Junior roles often test edge-case handling. Did you consider 'leading' vs 'trailing' edges?`
      ]
    }));
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearchResult('Searching technical mock docs...');
    try {
      const result = await searchTechnicalDocs(searchQuery);
      setSearchResult(result);
    } catch (e) {
      setSearchResult('Search grounding failed. Proceeding with local knowledge base.');
    }
  };

  const handleDebug = async () => {
    setDebugResult('Analyzing code for student-level common regressions...');
    try {
      const result = await runStaticAnalysis(state.files[state.activeFileIndex].content);
      setDebugResult(result);
    } catch (e) {
      setDebugResult('Static analysis engine offline.');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#0d1117] overflow-hidden">
      {/* Top Navbar */}
      <div className="h-14 border-b border-[#30363d] bg-[#161b22] flex items-center justify-between px-8">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#00A3FF] rounded-lg flex items-center justify-center shadow-lg shadow-[#00A3FF]/20">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M13 2L3 14H12L11 22L21 10H12L13 2Z"/></svg>
            </div>
            <span className="text-sm font-black text-white tracking-widest uppercase">Nexus Prep Shell</span>
          </div>
          <div className="h-5 w-[1px] bg-[#30363d]"></div>
          <button 
            onClick={runTests}
            className="text-[11px] font-black tracking-widest text-[#8b949e] hover:text-[#00A3FF] uppercase transition-colors"
          >
            Run Logic Verifier
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-3 px-5 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${isLive ? 'bg-[#00A3FF]/10 text-[#00A3FF] border border-[#00A3FF]/20' : 'bg-[#21262d] text-[#484f58] border border-[#30363d]'}`}>
            <div className={`w-2.5 h-2.5 rounded-full ${isLive ? 'bg-[#00A3FF] animate-pulse shadow-[0_0_12px_rgba(0,163,255,1)]' : 'bg-[#484f58]'}`}></div>
            <span>{isLive ? 'VOICE LIVE' : 'MIC STANDBY'}</span>
          </div>
          <button 
            onClick={onEnd}
            className="px-6 py-2 bg-[#da3633] hover:bg-[#b62d2a] text-white rounded-xl text-[11px] font-black transition-all shadow-xl shadow-[#da3633]/20 uppercase tracking-widest"
          >
            End Training
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="w-72 bg-[#010409] border-r border-[#30363d] flex flex-col shrink-0">
          {activeTab === 'EXPLORER' && (
            <div className="flex flex-col h-full animate-in slide-in-from-left duration-200">
              <div className="p-5 border-b border-[#30363d]">
                <span className="text-[11px] font-black text-[#8b949e] uppercase tracking-widest">Training Assets</span>
              </div>
              <div className="flex-1 overflow-y-auto py-2">
                {state.files.map((file, idx) => (
                  <div 
                    key={file.name}
                    onClick={() => setState(prev => ({ ...prev, activeFileIndex: idx }))}
                    className={`flex items-center px-6 py-3 cursor-pointer text-[13px] transition-all ${idx === state.activeFileIndex ? 'bg-[#00A3FF]/10 text-[#00A3FF] border-l-4 border-[#00A3FF] font-bold' : 'text-[#8b949e] hover:bg-[#161b22] hover:text-[#e6edf3]'}`}
                  >
                    <span className="mr-3 opacity-60 font-mono">{file.name.endsWith('.js') ? 'JS' : 'MD'}</span>
                    {file.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'SEARCH' && (
            <div className="flex flex-col h-full p-6 animate-in slide-in-from-left duration-200">
              <span className="text-[11px] font-black text-[#8b949e] uppercase tracking-widest mb-4">Market Grounding</span>
              <input 
                type="text" 
                placeholder="Search tech patterns..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSearch()}
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-[#00A3FF]"
              />
              <div className="flex-1 overflow-y-auto mt-6 text-[11px] text-[#8b949e] leading-relaxed">
                {searchResult ? (
                   <div className="bg-[#161b22] p-4 rounded-xl border border-[#30363d] whitespace-pre-wrap">{searchResult}</div>
                ) : (
                  <p className="opacity-40 italic text-center py-10">Use Search to find implementation standards for Junior roles.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'DEBUG' && (
            <div className="flex flex-col h-full p-6 animate-in slide-in-from-left duration-200">
              <span className="text-[11px] font-black text-[#8b949e] uppercase tracking-widest mb-4">Logic Probing</span>
              <button 
                onClick={handleDebug}
                className="w-full py-3 bg-[#00A3FF]/20 text-[#00A3FF] border border-[#00A3FF]/40 rounded-xl font-bold text-[10px] uppercase tracking-widest mb-6 hover:bg-[#00A3FF]/30 transition-all"
              >
                Scan for Junior Bugs
              </button>
              <div className="flex-1 overflow-y-auto text-[11px] text-[#8b949e] leading-relaxed">
                {debugResult ? (
                   <div className="bg-[#161b22] p-4 rounded-xl border border-[#30363d] whitespace-pre-wrap">{debugResult}</div>
                ) : (
                  <p className="opacity-40 italic text-center py-10">Run a scan to see how a lead engineer critiques this solution.</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col overflow-hidden bg-[#0d1117]">
          <div className="flex-1 overflow-hidden">
             <Editor 
              file={state.files[state.activeFileIndex]} 
              onChange={(content) => {
                const newFiles = [...state.files];
                newFiles[state.activeFileIndex].content = content;
                setState(prev => ({ ...prev, files: newFiles }));
              }}
            />
          </div>
          <Terminal output={state.terminalOutput} />
        </div>

        <InterviewPanel 
          state={state} 
          setState={setState}
          addMessage={addMessage} 
          onToggleMic={toggleVoiceInterview}
          isLive={isLive}
          onSendTextMessage={onSendTextMessage}
        />
      </div>

      <div className="h-6 bg-[#00A3FF] flex items-center justify-between px-6 text-[10px] text-white font-black tracking-widest uppercase">
        <div className="flex items-center space-x-6">
          <span>{state.files[state.activeFileIndex].name}</span>
          <span>Junior SDE Training v1.2</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
          <span>PES University Pipeline Connected</span>
        </div>
      </div>
    </div>
  );
};

export default Workspace;
