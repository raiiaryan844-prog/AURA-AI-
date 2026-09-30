import React, { useState } from 'react';
import { Header } from './components/Header';
import { NpuInferenceStudio } from './components/NpuInferenceStudio';
import { MultitaskingManager } from './components/MultitaskingManager';
import { HpSmartSensePanel } from './components/HpSmartSensePanel';
import { SnapLayoutPresets } from './components/SnapLayoutPresets';
import { HackathonSubmissionHub } from './components/HackathonSubmissionHub';
import { AiDiagnosticModal } from './components/AiDiagnosticModal';
import { INITIAL_PROCESSES } from './data/mockHardware';

export default function App() {
  const [activeTab, setActiveTab] = useState<'local-ai' | 'multitasking' | 'hp-smartsense' | 'snap-layouts' | 'hackathon-defense'>('local-ai');
  const [npuTopsActive, setNpuTopsActive] = useState<number>(4.8);
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [processes, setProcesses] = useState(INITIAL_PROCESSES);

  const handleApplyDiagnostic = () => {
    // Migrate emulated to native
    setProcesses((prev) =>
      prev.map((p) => {
        if (p.arch !== 'ARM64 (Native)') {
          return {
            ...p,
            arch: 'ARM64 (Native)',
            name: p.name.replace(/\(.*?\)/g, '(ARM64 Native)'),
            cpuPercent: Math.round(p.cpuPercent * 0.45 * 10) / 10,
            emulationPenaltyPercent: 0,
            powerDrawWatts: Math.round(p.powerDrawWatts * 0.4 * 10) / 10,
          };
        }
        return p;
      })
    );
    setNpuTopsActive(28.5);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* Top Bar Contract adhering to Frontend Constitution */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenDiagnostic={() => setIsDiagnosticOpen(true)}
        npuTopsActive={npuTopsActive}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {activeTab === 'local-ai' && (
          <NpuInferenceStudio
            onNpuLoadChange={(tops) => setNpuTopsActive(tops)}
          />
        )}

        {activeTab === 'multitasking' && (
          <MultitaskingManager />
        )}

        {activeTab === 'hp-smartsense' && (
          <HpSmartSensePanel />
        )}

        {activeTab === 'snap-layouts' && (
          <SnapLayoutPresets />
        )}

        {activeTab === 'hackathon-defense' && (
          <HackathonSubmissionHub />
        )}
      </main>

      {/* Quiet, minimalist footer complying with anti-slop guidelines */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-6 px-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span>HP OmniFlow</span>
            <span aria-hidden="true">·</span>
            <span>Qualcomm Snapdragon X Elite Architecture</span>
            <span aria-hidden="true">·</span>
            <span>Windows on ARM64</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Hexagon HTP 45 TOPS</span>
            <span aria-hidden="true">·</span>
            <span>LPDDR5x 135 GB/s</span>
            <span aria-hidden="true">·</span>
            <span>HP Smart Sense</span>
          </div>
        </div>
      </footer>

      {/* Server-Side AI Architecture Diagnostic Modal */}
      <AiDiagnosticModal
        isOpen={isDiagnosticOpen}
        onClose={() => setIsDiagnosticOpen(false)}
        processes={processes}
        onApplyOptimization={handleApplyDiagnostic}
      />
    </div>
  );
}
