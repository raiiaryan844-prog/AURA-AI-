import React, { useState } from 'react';
import { LayoutGrid, Monitor, Sparkles, Check, Code, FileText, Video, Eye, Terminal } from 'lucide-react';

export const SnapLayoutPresets: React.FC = () => {
  const [activeLayout, setActiveLayout] = useState<'developer' | 'executive' | 'creator' | 'quadrant'>('developer');

  const layouts = [
    {
      id: 'developer',
      name: 'Developer & NPU Pair (60/40 Split)',
      tagline: 'IDE + Real-time Local ONNX QNN Assistant',
      description: 'Allocates Oryon Prime cores for native ARM64 compilation while Hexagon NPU streams local code explanations with zero CPU overhead.',
      windows: [
        { title: 'Visual Studio Code (ARM64 Native)', span: 'col-span-7', icon: Code, content: 'export async function compileQnnModel(tensor: TensorBuffer): Promise<HexagonExecutionHandle> {\n  const session = await ort.InferenceSession.create("phi3.onnx", {\n    executionProviders: ["QNN"]\n  });\n  return session.run(tensor);\n}' },
        { title: 'Local NPU Assistant (Phi-3 Int4)', span: 'col-span-5', icon: Terminal, content: '✓ Fused INT4 Kernel active\n✓ Zero tokens sent to external cloud\n✓ Latency: 22ms | Power: 1.8W\nSuggested refactor: Replace floating-point dot product with 128-bit ARM NEON instruction vdotq_s32.' },
      ],
    },
    {
      id: 'executive',
      name: 'Executive Briefing (Triple Column 30/40/30)',
      tagline: 'Whisper Transcribe + Living Notes + Presentation',
      description: 'Hexagon NPU continuously transcribes conference audio via Whisper-Base without waking Oryon Prime CPU cores.',
      windows: [
        { title: 'Live Meeting (Teams / Zoom)', span: 'col-span-4', icon: Video, content: 'Video feed stabilized with NPU Studio Effects (Windows Studio Effects: Gaze Correction, Voice Focus, Portrait Blur).' },
        { title: 'Whisper NPU Transcriber', span: 'col-span-4', icon: Sparkles, content: '"[09:14:22] VP Product: Our Snapdragon X Elite HP fleet delivered 22.5 hours real battery life during overseas client deployments with 0 fan noise."' },
        { title: 'Executive Summary Deck', span: 'col-span-4', icon: FileText, content: 'Action Items:\n1. Approve QNN runtime deployment.\n2. Verify VentureX hackathon submission artifacts.' },
      ],
    },
    {
      id: 'creator',
      name: 'Creator Studio (70/30 Golden Ratio)',
      tagline: 'Adreno GPU Canvas + Local Vision NPU',
      description: 'Combines 3.8 TFLOPS Adreno GPU graphics with on-device Moondream multimodal analysis on the HP high-DPI OLED display.',
      windows: [
        { title: '4K Canvas / Video Timeline', span: 'col-span-8', icon: Monitor, content: 'Multi-track 4K ProRes rendering via hardware ARM64 media engine. Unified LPDDR5x 8448 MT/s zero-copy memory pipe active.' },
        { title: 'Moondream Multimodal NPU', span: 'col-span-4', icon: Eye, content: 'On-device scene composition analyzer: High color contrast detected on foreground elements. Lighting balance optimal.' },
      ],
    },
    {
      id: 'quadrant',
      name: 'Quadrant Focus Matrix (4 x 25%)',
      tagline: 'Balanced High-Density Multitasking',
      description: 'Evenly distributes workload across the 12 Oryon cores, maintaining cool surface temperature under 34°C.',
      windows: [
        { title: 'Edge Browser (ARM64)', span: 'col-span-6', icon: Monitor, content: 'Qualcomm Developer Portal & Qualcomm AI Hub documentation tab.' },
        { title: 'Terminal (AArch64 Clang)', span: 'col-span-6', icon: Code, content: '$ clang++ -march=armv8.7-a+simd main.cpp -lQnnHtp -O3\nBuild succeeded in 0.42s.' },
        { title: 'Docker Containers', span: 'col-span-6', icon: Terminal, content: 'CONTAINER ID: 89f2a91\nIMAGE: arm64v8/postgres:16\nSTATUS: Up 3 hours (Oryon E-core pinned).' },
        { title: 'Spotify (ARM Native)', span: 'col-span-6', icon: FileText, content: 'Now Playing: Deep Focus Lo-Fi (Audio decoded via Hexagon DSP low-power pipeline).' },
      ],
    },
  ];

  const current = layouts.find((l) => l.id === activeLayout) || layouts[0];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-medium text-cyan-400">HP Virtual Display & Snap Manager</span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">High-DPI OLED 2.8K Optimized</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Seamless Multitasking Snap Workspaces
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              One-click window orchestration calibrated for HP Snapdragon PCs. Intelligently assigns each snapped window
              to its optimal compute engine (Oryon Prime CPU, Adreno GPU, or Hexagon NPU).
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs font-mono">
            <LayoutGrid className="w-4 h-4 text-cyan-400" />
            <div>
              <div className="text-slate-400 text-[10px]">Active Layout</div>
              <div className="text-cyan-300 font-bold">{current.name.split(' (')[0]}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Preset Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {layouts.map((l) => {
          const isSelected = activeLayout === l.id;
          return (
            <button
              key={l.id}
              onClick={() => setActiveLayout(l.id as any)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-slate-900 border-cyan-500/50 shadow-sm shadow-cyan-500/10'
                  : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-white">{l.name.split(' (')[0]}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
              </div>
              <div className="text-[11px] text-cyan-400/90 font-mono mt-1">{l.tagline}</div>
              <p className="text-[11px] text-slate-400 mt-1.5 line-clamp-2">{l.description}</p>
            </button>
          );
        })}
      </div>

      {/* Interactive Snapped Display Canvas */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Monitor className="w-4 h-4 text-cyan-400" />
            <span>Virtual Screen Simulation: HP OmniBook X 14" OLED (2880 x 1800 @ 120Hz)</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Zero Frame Jitter · LPDDR5x Zero-Copy
          </span>
        </div>

        {/* Display Frame */}
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 shadow-inner">
          <div className="grid grid-cols-12 gap-3 min-h-[320px]">
            {current.windows.map((win, idx) => {
              const Icon = win.icon;
              return (
                <div
                  key={idx}
                  className={`${win.span} p-4 rounded-lg bg-slate-900/80 border border-slate-800/90 flex flex-col justify-between shadow-sm`}
                >
                  <div>
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                        <Icon className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{win.title}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-slate-700" />
                        <div className="w-2 h-2 rounded-full bg-slate-700" />
                        <div className="w-2 h-2 rounded-full bg-slate-700" />
                      </div>
                    </div>

                    <pre className="text-[11px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                      {win.content}
                    </pre>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-800/50 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>Oryon Core Affinity: Automated</span>
                    <span className="text-cyan-400/80">Window {idx + 1} Snapped</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
