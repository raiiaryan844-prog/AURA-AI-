import React from 'react';
import { Cpu, Sparkles, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  activeTab: 'local-ai' | 'multitasking' | 'hp-smartsense' | 'snap-layouts' | 'hackathon-defense';
  setActiveTab: (tab: 'local-ai' | 'multitasking' | 'hp-smartsense' | 'snap-layouts' | 'hackathon-defense') => void;
  onOpenDiagnostic: () => void;
  npuTopsActive: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenDiagnostic,
  npuTopsActive,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-40 px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold text-base shadow-sm shadow-cyan-500/20">
            hp
          </div>
          <div>
            <span className="text-base font-semibold tracking-tight text-white block">
              OmniFlow Studio
            </span>
            <span className="text-[11px] font-mono text-cyan-400 tracking-wider">
              Snapdragon X Elite · ARM64
            </span>
          </div>
        </div>

        {/* Zone 2: 5 clean navigation links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1 rounded-lg border border-slate-800/80">
          <button
            onClick={() => setActiveTab('local-ai')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              activeTab === 'local-ai'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            On-Device AI & NPU
          </button>
          <button
            onClick={() => setActiveTab('multitasking')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              activeTab === 'multitasking'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Multitasking & ARM64
          </button>
          <button
            onClick={() => setActiveTab('hp-smartsense')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              activeTab === 'hp-smartsense'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            HP Smart Sense & Sensors
          </button>
          <button
            onClick={() => setActiveTab('snap-layouts')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              activeTab === 'snap-layouts'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Workspaces & Snap
          </button>
          <button
            onClick={() => setActiveTab('hackathon-defense')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              activeTab === 'hackathon-defense'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                : 'text-amber-400/80 hover:text-amber-300'
            }`}
          >
            Hackathon Defense & Submission
          </button>
        </nav>

        {/* Zone 3: Primary Actions and hardware status */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono px-2.5 py-1 bg-slate-900 border border-slate-800 rounded">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">NPU:</span>
            <span className="text-cyan-300 font-semibold tabular-nums">{npuTopsActive.toFixed(1)} / 45 TOPS</span>
          </div>

          <button
            onClick={onOpenDiagnostic}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 rounded shadow-sm transition-all whitespace-nowrap active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Architecture Diagnostic</span>
          </button>
        </div>
      </div>

      {/* Mobile nav fallback */}
      <div className="flex lg:hidden overflow-x-auto gap-1 pt-2.5 mt-2 border-t border-slate-800/60 pb-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('local-ai')}
          className={`px-2.5 py-1 text-xs rounded whitespace-nowrap ${
            activeTab === 'local-ai' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'
          }`}
        >
          On-Device AI
        </button>
        <button
          onClick={() => setActiveTab('multitasking')}
          className={`px-2.5 py-1 text-xs rounded whitespace-nowrap ${
            activeTab === 'multitasking' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'
          }`}
        >
          Multitasking
        </button>
        <button
          onClick={() => setActiveTab('hp-smartsense')}
          className={`px-2.5 py-1 text-xs rounded whitespace-nowrap ${
            activeTab === 'hp-smartsense' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'
          }`}
        >
          HP Smart Sense
        </button>
        <button
          onClick={() => setActiveTab('snap-layouts')}
          className={`px-2.5 py-1 text-xs rounded whitespace-nowrap ${
            activeTab === 'snap-layouts' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'
          }`}
        >
          Workspaces
        </button>
        <button
          onClick={() => setActiveTab('hackathon-defense')}
          className={`px-2.5 py-1 text-xs rounded whitespace-nowrap ${
            activeTab === 'hackathon-defense' ? 'bg-amber-500/20 text-amber-300' : 'text-amber-400'
          }`}
        >
          Submission Hub
        </button>
      </div>
    </header>
  );
};
