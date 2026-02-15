
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { InterviewState, ChatMessage } from '../types';
import { AVATAR_URL } from '../constants';
import { getDeepAnalysis } from '../services/geminiService';

interface InterviewPanelProps {
  state: InterviewState;
  setState: React.Dispatch<React.SetStateAction<InterviewState>>;
  addMessage: (text: string, sender: 'INTERVIEWER' | 'CANDIDATE') => void;
  onToggleMic: () => void;
  isLive: boolean;
  onSendTextMessage: (text: string) => void;
}

const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  const parts = useMemo(() => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    
    return lines.map((line, idx) => {
      const trimmedLine = line.trim();
      const listMatch = trimmedLine.match(/^[-*]\s+(.*)/);
      const isListItem = !!listMatch;
      let content = isListItem ? listMatch![1] : trimmedLine;

      const boldRegex = /\*\*(.*?)\*\*/g;
      const elements: (string | React.ReactNode)[] = [];
      let lastIndex = 0;
      let match;

      while ((match = boldRegex.exec(content)) !== null) {
        if (match.index > lastIndex) {
          elements.push(content.substring(lastIndex, match.index));
        }
        elements.push(<strong key={match.index} className="font-bold text-white">{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }
      
      if (lastIndex < content.length) {
        elements.push(content.substring(lastIndex));
      }

      return (
        <div key={idx} className={`mb-3 last:mb-0 ${isListItem ? 'flex items-start space-x-2 ml-1' : ''}`}>
          {isListItem && <span className="text-[#00A3FF] mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-[#00A3FF]/30"></span>}
          <p className="flex-1 text-[14px] leading-[1.6] text-[#c9d1d9] antialiased">
            {elements.length > 0 ? elements : content}
          </p>
        </div>
      );
    });
  }, [text]);

  return <div className="space-y-1">{parts}</div>;
};

const InterviewPanel: React.FC<InterviewPanelProps> = ({ state, setState, addMessage, onToggleMic, isLive, onSendTextMessage }) => {
  const [inputText, setInputText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [state.messages]);

  const handleDeepAnalysis = async () => {
    if (state.messages.length < 1) return;
    setAnalyzing(true);
    try {
      const code = state.files[state.activeFileIndex].content;
      const transcript = state.messages.map(m => `${m.sender}: ${m.text}`).join('\n');
      const analysis = await getDeepAnalysis(code, transcript, state.linkedInUrl);
      
      setState(prev => ({ ...prev, auditReport: analysis }));
      setShowAuditModal(true);
      addMessage("I've compiled a full coaching analysis. Open the report above for specific improvement feedback.", 'INTERVIEWER');
    } catch (e) {
      console.error(e);
      addMessage("[SYSTEM ERROR]: Analysis engine timed out.", 'INTERVIEWER');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSendMessage = () => {
    const trimmed = inputText.trim();
    if (trimmed) {
      onSendTextMessage(trimmed);
      setInputText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDownload = () => {
    if (!state.auditReport) return;
    const blob = new Blob([state.auditReport], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Coaching-Audit-${new Date().getTime()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`${isExpanded ? 'w-[750px]' : 'w-[420px]'} bg-[#161b22] border-l border-[#30363d] flex flex-col shrink-0 overflow-hidden relative transition-all duration-500 ease-in-out shadow-2xl z-20`}>
      {/* AI Status Header */}
      <div className="pt-6 pb-4 px-6 flex items-center justify-between bg-[#0d1117] border-b border-[#30363d] shrink-0">
        <div className="flex items-center space-x-4">
          <div className="relative group">
            <div className={`w-14 h-14 rounded-full border-2 p-0.5 transition-all duration-500 ${
              isLive ? 'border-[#00A3FF] shadow-[0_0_15px_rgba(0,163,255,0.4)]' : 'border-[#30363d]'
            }`}>
              <img src={AVATAR_URL} className="w-full h-full rounded-full object-cover grayscale-[0.2]" alt="Nexus AI" />
            </div>
            {isLive && <div className="absolute top-0 right-0 w-3 h-3 bg-[#238636] border-2 border-[#0d1117] rounded-full animate-pulse"></div>}
          </div>
          <div>
            <h3 className="text-sm font-black text-white tracking-tight uppercase">Nexus Coach</h3>
            <p className="text-[10px] text-[#00A3FF] font-black tracking-widest uppercase flex items-center">
               <span className="mr-1 w-1.5 h-1.5 rounded-full bg-[#00A3FF] animate-pulse"></span>
               AI Training Mode
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-3 rounded-xl transition-all border ${isExpanded ? 'bg-[#00A3FF]/10 border-[#00A3FF]/20 text-[#00A3FF]' : 'text-[#8b949e] border-transparent hover:bg-[#21262d] hover:text-white'}`}
            title={isExpanded ? "Collapse View" : "Expand View"}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`}>
               <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />
            </svg>
          </button>
          <button 
            onClick={onToggleMic}
            className={`p-3 rounded-xl border transition-all ${
              isLive ? 'bg-[#00A3FF] border-[#00A3FF] text-white shadow-lg shadow-[#00A3FF]/30' : 'bg-[#21262d] border-[#30363d] text-[#8b949e] hover:text-white'
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" />
              {!isLive && <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" opacity="0.5" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Main Feed */}
      <div className="flex-1 overflow-y-auto bg-[#0d1117]/40 p-6 space-y-10 scrollbar-hide" ref={scrollRef}>
        {state.messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-10 text-center space-y-6">
             <div className="w-20 h-20 bg-[#21262d] rounded-full flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
             </div>
             <p className="text-sm font-medium">Mock connection idle.<br/>Initiate coaching session.</p>
          </div>
        ) : (
          state.messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.sender === 'CANDIDATE' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2 duration-300`}>
              <div className="flex items-center space-x-2 mb-2.5 px-1">
                <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${msg.sender === 'CANDIDATE' ? 'text-[#00A3FF]' : 'text-[#8b949e]'}`}>
                  {msg.sender === 'CANDIDATE' ? 'Candidate' : 'Nexus Coach'}
                </span>
                <span className="text-[9px] text-[#484f58] font-mono">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
              <div className={`p-5 rounded-2xl border transition-all duration-300 ${
                msg.sender === 'CANDIDATE' 
                  ? 'bg-[#00A3FF] border-[#00A3FF] text-white rounded-tr-none shadow-lg shadow-[#00A3FF]/10 max-w-[85%]' 
                  : 'bg-[#1c2128] border-[#30363d] text-[#c9d1d9] rounded-tl-none shadow-md w-full'
              }`}>
                <FormattedText text={msg.text} />
              </div>
            </div>
          ))
        )}
        {analyzing && (
          <div className="flex items-center space-x-4 p-5 bg-[#00A3FF]/5 border border-[#00A3FF]/20 rounded-2xl animate-pulse">
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 bg-[#00A3FF] rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-[#00A3FF] rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-[#00A3FF] rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-[#00A3FF]">Auditing Session Performance...</span>
          </div>
        )}
      </div>

      {/* Control Surface */}
      <div className="p-6 bg-[#161b22] border-t border-[#30363d] space-y-4 shrink-0">
        <div className="flex space-x-3">
          {state.auditReport ? (
            <button 
              onClick={() => setShowAuditModal(true)}
              className="flex-1 bg-[#238636] hover:bg-[#2ea043] text-white rounded-xl text-[11px] font-black uppercase tracking-widest py-4 transition-all shadow-lg flex items-center justify-center space-x-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
              <span>View Coaching Report</span>
            </button>
          ) : (
            <button 
              onClick={handleDeepAnalysis}
              disabled={analyzing || state.messages.length < 1}
              className="flex-1 bg-[#21262d] hover:bg-[#30363d] disabled:opacity-30 disabled:cursor-not-allowed text-[#e6edf3] border border-[#30363d] text-[11px] font-black uppercase tracking-widest py-4 transition-all flex items-center justify-center space-x-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
              <span>Analyze Session</span>
            </button>
          )}
        </div>

        <div className="relative">
          <textarea 
            rows={1}
            placeholder="Respond to mock challenge..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            className="w-full bg-[#0d1117] border border-[#30363d] rounded-2xl py-5 pl-6 pr-16 text-sm text-white focus:outline-none focus:border-[#00A3FF] focus:ring-1 focus:ring-[#00A3FF]/20 transition-all placeholder:text-[#484f58] resize-none overflow-hidden shadow-inner"
          />
          <button 
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 text-[#484f58] hover:text-[#00A3FF] disabled:opacity-20 transition-all rounded-xl hover:bg-[#00A3FF]/10"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
          </button>
        </div>
      </div>

      {/* Detailed Audit Modal */}
      {showAuditModal && state.auditReport && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-8 animate-in fade-in duration-300">
          <div className="bg-[#0d1117] border border-[#30363d] rounded-[32px] w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)]">
            <div className="p-8 border-b border-[#30363d] flex items-center justify-between bg-[#161b22]">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight uppercase">Coaching Feedback Report</h2>
                <p className="text-xs text-[#8b949e] mt-1 font-bold uppercase tracking-widest">Logic Audit & Communication Critique</p>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={handleDownload}
                  className="px-6 py-3 bg-[#00A3FF] hover:bg-[#0082CC] text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl flex items-center space-x-2"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                  <span>Export Report</span>
                </button>
                <button 
                  onClick={() => setShowAuditModal(false)}
                  className="p-3 text-[#8b949e] hover:text-white hover:bg-[#21262d] rounded-xl transition-all"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-12 bg-[#010409]/60">
              <div className="max-w-3xl mx-auto text-[#c9d1d9]">
                <FormattedText text={state.auditReport} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewPanel;
