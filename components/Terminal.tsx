
import React from 'react';

interface TerminalProps {
  output: string[];
}

const Terminal: React.FC<TerminalProps> = ({ output }) => {
  return (
    <div className="h-56 bg-[#010409] border-t border-[#30363d] flex flex-col shadow-inner">
      <div className="flex border-b border-[#30363d] px-8 bg-[#0d1117]">
        <div className="py-3 text-[11px] font-black tracking-widest text-[#00A3FF] border-b-2 border-[#00A3FF] mr-10 cursor-pointer uppercase">Terminal</div>
        <div className="py-3 text-[11px] font-black tracking-widest text-[#484f58] mr-10 hover:text-[#8b949e] cursor-pointer transition-colors uppercase">Console</div>
      </div>
      <div className="flex-1 p-6 overflow-y-auto font-mono text-[14px] leading-relaxed">
        {output.length === 0 ? (
          <>
            <div className="flex space-x-3 mb-2">
              <span className="text-[#00A3FF] font-bold">➜</span>
              <span className="text-[#238636] font-bold">~/nexus-workspace</span>
              <span className="text-[#e6edf3]">System initialized. Ready for tests.</span>
            </div>
            <div className="flex space-x-3">
              <span className="text-[#00A3FF] font-bold">➜</span>
              <span className="text-[#238636] font-bold">~/nexus-workspace</span>
              <span className="text-[#e6edf3] font-bold animate-pulse">_</span>
            </div>
          </>
        ) : (
          <div className="space-y-1">
            {output.map((line, i) => (
              <div key={i} className="text-[#8b949e]">
                <span className="text-[#00A3FF] mr-2">›</span> {line}
              </div>
            ))}
            <div className="flex space-x-3 mt-4">
              <span className="text-[#00A3FF] font-bold">➜</span>
              <span className="text-[#e6edf3] font-bold animate-pulse">_</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Terminal;
