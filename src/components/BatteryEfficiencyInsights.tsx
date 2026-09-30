import React, { useState, useEffect } from 'react';
import { Battery, Zap, Cpu, ArrowDownRight, Layers, Sparkles, Activity, ShieldCheck, Check, AlertCircle } from 'lucide-react';

interface WorkloadPreset {
  id: string;
  name: string;
  npuActivityTops: number;
  npuModelName: string;
  npuPowerMw: number;
  cpuBackgroundMw: number;
  displayMw: number;
  totalDischargeMw: number;
  estRuntimeHours: number;
  fanState: string;
  chassisTempC: number;
  backgroundTasksCount: number;
  backgroundArch: 'Oryon E-Cores (ARM64)' | 'Mixed (1 Emulated)' | 'Prism Emulated x86';
}

const WORKLOAD_PRESETS: WorkloadPreset[] = [
  {
    id: 'npu-whisper',
    name: 'Meeting Mode (Whisper NPU Speech Transcribe)',
    npuActivityTops: 12.0,
    npuModelName: 'Whisper-Base Int8 (QNN EP)',
    npuPowerMw: 850,
    cpuBackgroundMw: 1100,
    displayMw: 1250,
    totalDischargeMw: 3200,
    estRuntimeHours: 23.4,
    fanState: '0 dB (Passive / Fanless)',
    chassisTempC: 32.8,
    backgroundTasksCount: 4,
    backgroundArch: 'Oryon E-Cores (ARM64)',
  },
  {
    id: 'npu-phi3',
    name: 'Developer Flow (Phi-3 Code Reasoning on NPU)',
    npuActivityTops: 28.5,
    npuModelName: 'Phi-3-Mini-4K Int4 AWQ',
    npuPowerMw: 2100,
    cpuBackgroundMw: 1400,
    displayMw: 1400,
    totalDischargeMw: 4900,
    estRuntimeHours: 20.8,
    fanState: '0 dB (Silent Studio)',
    chassisTempC: 34.2,
    backgroundTasksCount: 6,
    backgroundArch: 'Oryon E-Cores (ARM64)',
  },
  {
    id: 'idle-presence',
    name: 'Ambient Standby (HP NPU Micro-Vision Gaze)',
    npuActivityTops: 4.8,
    npuModelName: 'HP Micro-Vision Attention Engine',
    npuPowerMw: 180,
    cpuBackgroundMw: 620,
    displayMw: 950,
    totalDischargeMw: 1750,
    estRuntimeHours: 26.2,
    fanState: '0 dB (Passive)',
    chassisTempC: 30.5,
    backgroundTasksCount: 3,
    backgroundArch: 'Oryon E-Cores (ARM64)',
  },
  {
    id: 'cpu-emulation',
    name: 'Unoptimized Legacy AI (x86 CPU Emulation Drag)',
    npuActivityTops: 0.0,
    npuModelName: 'None (Bypassing Hexagon NPU)',
    npuPowerMw: 0,
    cpuBackgroundMw: 13400,
    displayMw: 1600,
    totalDischargeMw: 16800,
    estRuntimeHours: 6.8,
    fanState: '39 dB (Active High Fan Spin)',
    chassisTempC: 44.5,
    backgroundTasksCount: 7,
    backgroundArch: 'Prism Emulated x86',
  },
];

export const BatteryEfficiencyInsights: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('npu-phi3');
  const [livePulse, setLivePulse] = useState(false);
  const [eCorePinned, setECorePinned] = useState(true);

  const currentPreset = WORKLOAD_PRESETS.find((p) => p.id === selectedPresetId) || WORKLOAD_PRESETS[0];

  // Minor live jitter to simulate physical telemetry sampling from HP Smart Sense controller
  const [jitterMw, setJitterMw] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setJitterMw(Math.floor(Math.random() * 80) - 40);
      setLivePulse((prev) => !prev);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  const actualDischargeMw = Math.max(1200, currentPreset.totalDischargeMw + jitterMw - (eCorePinned ? 180 : 0));
  const actualDischargeWatts = (actualDischargeMw / 1000).toFixed(2);
  const npuPowerPercent = Math.round((currentPreset.npuPowerMw / actualDischargeMw) * 100);
  const cpuPowerPercent = Math.round(((currentPreset.cpuBackgroundMw - (eCorePinned ? 180 : 0)) / actualDischargeMw) * 100);
  const displayPowerPercent = Math.max(5, 100 - npuPowerPercent - cpuPowerPercent);

  // Energy consumption per 1,000 tokens comparison
  const npuJoulesPerKTokens = 52; // 52 Joules (or ~52 mJ/token)
  const cloudJoulesPerKTokens = 210; // ~210 Joules considering Wi-Fi 7 baseband bursts and socket roundtrips
  const cpuJoulesPerKTokens = 485; // 485 Joules on x86 emulation

  return (
    <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-5">
      {/* Title & Hardware Architecture Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-medium text-emerald-400">HP Smart Sense Telemetry Engine</span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">Snapdragon X Elite Fuel Gauge IC</span>
          </div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2 mt-0.5">
            <Battery className="w-4 h-4 text-emerald-400" />
            <span>Battery Efficiency & Local NPU Power Dynamics</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Live discharge rate correlation against Qualcomm Hexagon 45 TOPS NPU utilization and Oryon background thread clusters.
          </p>
        </div>

        {/* Live Status Indicator */}
        <div className="flex items-center gap-2 font-mono text-xs bg-slate-950 p-2 rounded-lg border border-slate-800 self-start sm:self-auto">
          <span className={`w-2 h-2 rounded-full ${livePulse ? 'bg-emerald-400' : 'bg-emerald-500/40'} transition-colors`} />
          <span className="text-slate-400">Sampling:</span>
          <span className="text-emerald-300 font-bold tabular-nums">-{actualDischargeMw} mW</span>
        </div>
      </div>

      {/* Preset Workload Switcher */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-300 block">
          Simulate Multitasking Workload & Local AI Execution:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {WORKLOAD_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            const isWarning = preset.id === 'cpu-emulation';
            return (
              <button
                key={preset.id}
                onClick={() => setSelectedPresetId(preset.id)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  isSelected
                    ? isWarning
                      ? 'bg-rose-950/20 border-rose-500/50 shadow-sm shadow-rose-500/10'
                      : 'bg-emerald-950/20 border-emerald-500/50 shadow-sm shadow-emerald-500/10'
                    : 'bg-slate-950/60 border-slate-800 hover:bg-slate-950 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-200 truncate">{preset.name.split(' (')[0]}</span>
                  {isSelected && (
                    <span className={`w-2 h-2 rounded-full ${isWarning ? 'bg-rose-400' : 'bg-emerald-400'}`} />
                  )}
                </div>

                <div className="mt-2 flex items-baseline gap-1.5 font-mono">
                  <span
                    className={`text-base font-bold tabular-nums ${
                      isWarning ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    -{preset.totalDischargeMw} mW
                  </span>
                  <span className="text-[11px] text-slate-400">
                    (~{preset.estRuntimeHours}h)
                  </span>
                </div>

                <div className="mt-1.5 text-[10px] font-mono text-slate-400 truncate">
                  {preset.npuModelName}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Real-Time Telemetry Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Metric 1: Discharge Rate */}
        <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Discharge Rate</span>
            <ArrowDownRight className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white tabular-nums">
            {actualDischargeWatts} <span className="text-xs font-normal text-slate-400">Watts</span>
          </div>
          <div className="text-[11px] text-emerald-400 font-mono">
            {actualDischargeMw} mW continuous draw
          </div>
        </div>

        {/* Metric 2: Hexagon NPU TOPS & Power */}
        <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Hexagon NPU Draw</span>
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-bold font-mono text-cyan-300 tabular-nums">
            {currentPreset.npuActivityTops.toFixed(1)} <span className="text-xs font-normal text-slate-400">TOPS</span>
          </div>
          <div className="text-[11px] text-cyan-400/90 font-mono">
            {(currentPreset.npuPowerMw / 1000).toFixed(2)}W ({npuPowerPercent}% of SoC)
          </div>
        </div>

        {/* Metric 3: Background Tasks Arch */}
        <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Background Subsystem</span>
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-sm font-bold font-mono text-slate-200 truncate mt-1">
            {currentPreset.backgroundTasksCount} Active Tasks
          </div>
          <div className="text-[11px] text-indigo-300 font-mono truncate">
            {currentPreset.backgroundArch}
          </div>
        </div>

        {/* Metric 4: Acoustics & Thermals */}
        <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Acoustics & Chassis</span>
            <Activity className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-sm font-bold font-mono text-slate-200 mt-1">
            {currentPreset.chassisTempC}°C Surface
          </div>
          <div className="text-[11px] text-slate-400 font-mono truncate">
            {currentPreset.fanState}
          </div>
        </div>
      </div>

      {/* Discharge Breakdown Bar */}
      <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-300 font-medium">Power Distribution by Subsystem</span>
          <span className="text-slate-400 tabular-nums">Total: {actualDischargeWatts}W</span>
        </div>

        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
          <div
            className="bg-cyan-400 h-full transition-all duration-500"
            style={{ width: `${npuPowerPercent}%` }}
            title={`NPU: ${currentPreset.npuPowerMw} mW`}
          />
          <div
            className="bg-indigo-400 h-full transition-all duration-500"
            style={{ width: `${cpuPowerPercent}%` }}
            title={`Oryon CPU Background: ${currentPreset.cpuBackgroundMw} mW`}
          />
          <div
            className="bg-slate-500 h-full transition-all duration-500"
            style={{ width: `${displayPowerPercent}%` }}
            title={`OLED Display & Radios: ${currentPreset.displayMw} mW`}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-cyan-400 inline-block" />
            Hexagon NPU: <strong className="text-slate-200">{currentPreset.npuPowerMw} mW</strong> ({npuPowerPercent}%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-indigo-400 inline-block" />
            Oryon CPU & Background: <strong className="text-slate-200">{currentPreset.cpuBackgroundMw} mW</strong> ({cpuPowerPercent}%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-slate-500 inline-block" />
            Display & Platform: <strong className="text-slate-200">{currentPreset.displayMw} mW</strong> ({displayPowerPercent}%)
          </span>
        </div>
      </div>

      {/* Energy Comparison: Local Hexagon NPU vs Cloud API vs CPU Emulation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
        {/* Local NPU */}
        <div className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-300">Local Hexagon 45 TOPS NPU</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
              Optimal
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            {npuJoulesPerKTokens} <span className="text-xs font-normal text-slate-400">Joules / 1K tokens</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            INT4 fused kernels execute within 2.1W envelope. Zero Wi-Fi baseband wakeups and zero thermal drag on chassis.
          </p>
          <div className="text-[10px] font-mono text-emerald-300 pt-1 border-t border-emerald-500/20 flex items-center gap-1">
            <Check className="w-3 h-3 text-emerald-400" /> Battery Longevity: ~23.4 Hours
          </div>
        </div>

        {/* Cloud API Roundtrip */}
        <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200">Cloud API (Wi-Fi 7 / 5G Burst)</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
              Network Bound
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-amber-300 tabular-nums">
            {cloudJoulesPerKTokens} <span className="text-xs font-normal text-slate-400">Joules / 1K tokens</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Requires continuous Wi-Fi radio wake states (+2,200 mW tail latency per query) plus cloud network latency.
          </p>
          <div className="text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800 flex items-center gap-1">
            <span>·</span> Battery Longevity: ~14.8 Hours
          </div>
        </div>

        {/* CPU Emulation */}
        <div className="p-3.5 rounded-lg bg-rose-950/20 border border-rose-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-300">Legacy x86 CPU Emulation</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">
              High Penalty
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-rose-400 tabular-nums">
            {cpuJoulesPerKTokens} <span className="text-xs font-normal text-slate-400">Joules / 1K tokens</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Spins up cooling fans to 39 dB. Wastes 9.3x more energy doing scalar matrix math on CPU instead of Hexagon NPU.
          </p>
          <div className="text-[10px] font-mono text-rose-300 pt-1 border-t border-rose-500/20 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-rose-400" /> Battery Longevity: ~6.8 Hours
          </div>
        </div>
      </div>

      {/* Governor Action Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg bg-slate-950 border border-slate-800">
        <div>
          <div className="text-xs font-semibold text-slate-200">
            Pin Background Tasks to Oryon Efficiency Cores (Cores 8–11)
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Prevents Chromium and indexing tasks from waking the 4.2GHz Prime cores during AI execution. Saves ~180 mW.
          </div>
        </div>

        <button
          onClick={() => setECorePinned(!eCorePinned)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium font-mono transition-all whitespace-nowrap ${
            eCorePinned
              ? 'bg-emerald-500 text-slate-950 font-semibold'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          {eCorePinned ? '✓ E-Core Pinning Active' : 'Enable E-Core Pinning'}
        </button>
      </div>
    </div>
  );
};
