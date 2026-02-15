
import React from 'react';
import { FileItem } from '../types';

interface EditorProps {
  file: FileItem;
  onChange: (content: string) => void;
}

const Editor: React.FC<EditorProps> = ({ file, onChange }) => {
  return (
    <div className="h-full bg-[#0d1117] flex flex-col overflow-hidden">
      {/* Tab bar */}
      <div className="flex bg-[#161b22] border-b border-[#30363d]">
        <div className="bg-[#0d1117] px-5 py-3 text-[11px] font-bold border-r border-[#30363d] border-t border-t-[#00A3FF] flex items-center text-[#e6edf3] select-none">
          <span className="mr-2 text-yellow-500 font-mono">JS</span>
          {file.name}
          <div className="ml-4 w-1.5 h-1.5 rounded-full bg-[#00A3FF] opacity-50"></div>
        </div>
      </div>
      
      {/* Editor Content */}
      <div className="flex-1 flex overflow-hidden relative group">
        <div className="w-14 bg-[#0d1117] border-r border-[#30363d] flex flex-col items-end pr-4 py-6 text-[#30363d] text-[12px] mono select-none pointer-events-none">
          {Array.from({ length: 60 }).map((_, i) => (
            <div key={i} className="h-[21px]">{i + 1}</div>
          ))}
        </div>
        <textarea
          spellCheck={false}
          value={file.content}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent px-6 py-6 text-[#e6edf3] focus:outline-none resize-none mono text-[14px] leading-[21px] selection:bg-[#00A3FF]/30 whitespace-pre scrollbar-thin scrollbar-thumb-[#30363d] scrollbar-track-transparent"
        />
        
        {/* Subtle border indicator */}
        <div className="absolute inset-0 pointer-events-none border-l border-[#00A3FF]/0 group-focus-within:border-l-[#00A3FF]/30 transition-all duration-300"></div>
      </div>
    </div>
  );
};

export default Editor;
