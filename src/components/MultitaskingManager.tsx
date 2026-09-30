import React, { useState } from 'react';
import { ProcessItem, OryonCoreStatus } from '../types';
import { INITIAL_PROCESSES, INITIAL_ORYON_CORES } from '../data/mockHardware';
import { Cpu, Zap, ArrowUpRight, Check, AlertCircle, RefreshCw, Layers, ShieldCheck } from 'lucide-react';

export const MultitaskingManager: React.FC = () => {
  const [processes, setProcesses] = useState<ProcessItem[]>(INITIAL_PROCESSES);
  const [oryonCores, setOryonCores] = useState<OryonCoreStatus[]>(INITIAL_ORYON_CORES);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedMessage, setOptimizedMessage] = useState<string | null>(null);

  // Calculate live stats
  const totalPowerWatts = processes.reduce((acc, p) => acc + p.powerDrawWatts, 0);
  const emulatedProcesses = processes.filter((p) => p.arch !== 'ARM64 (Native)');
  const nativeProcesses = processes.filter((p) => p.arch === 'ARM64 (Native)');
  const nativeRatio = Math.round((nativeProcesses.length / processes.length) * 100);
  const totalEmulationPenaltyWatts = emulatedProcesses.reduce(
    (acc, p) => acc + (p.powerDrawWatts * (p.emulationPenaltyPercent / 100)),
    0
  );
  const estimatedBatteryHoursLost = (totalEmulationPenaltyWatts / 3.8).toFixed(1);

  // Convert emulated process to ARM64 native
  const handleMigrateToNative = (processId: string) => {
    setProcesses((prev) =>
      prev.map((p) => {
        if (p.id === processId) {
          return {
            ...p,
            arch: 'ARM64 (Native)',
            name: p.name.replace('(Prism Emulated)', '(ARM64 Native)').replace('(x86-64 Emulated)', '(ARM64 Native)').replace('(x86-32 Legacy Emulated)', '(ARM64 Native)'),
            cpuPercent: Math.round(p.cpuPercent * 0.45 * 10) / 10,
            emulationPenaltyPercent: 0,
            powerDrawWatts: Math.round(p.powerDrawWatts * 0.42 * 10) / 10,
          };
        }
        return p;
      })
    );
  };

  // Offload AI task to Hexagon NPU
  const handleOffloadToNpu = (processId: string) => {
    setProcesses((prev) =>
      prev.map((p) => {
        if (p.id === processId) {
          return {
            ...p,
            cpuPercent: 1.8,
            npuTopsUsed: 14.5,
            assignedCluster: 'NPU Direct',
            powerDrawWatts: 1.5,
            name: p.name.includes('(NPU Offloaded)') ? p.name : `${p.name} (Hexagon NPU Offloaded)`,
          };
        }
        return p;
      })
    );
  };

  // One-click intelligent ARM64 governor optimization
  const handleOptimizeAll = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      // Migrate all possible apps to native ARM64 and pin background processes to Efficiency cluster
      setProcesses((prev) =>
        prev.map((p) => {
          let updated = { ...p };
          if (p.nativeArmAvailable && p.arch !== 'ARM64 (Native)') {
            updated.arch = 'ARM64 (Native)';
            updated.name = p.name.replace(/\(.*?\)/g, '(ARM64 Native)');
            updated.cpuPercent = Math.round(p.cpuPercent * 0.4 * 10) / 10;
            updated.emulationPenaltyPercent = 0;
            updated.powerDrawWatts = Math.round(p.powerDrawWatts * 0.38 * 10) / 10;
          }
          if (p.category === 'Productivity' || p.category === 'Creative') {
            updated.assignedCluster = 'Efficiency';
          }
          if (p.canOffloadToNpu && p.npuTopsUsed === 0) {
            updated.assignedCluster = 'NPU Direct';
            updated.npuTopsUsed = 12.0;
            updated.cpuPercent = 1.2;
            updated.powerDrawWatts = 1.2;
          }
          return updated;
        })
      );

      // Rebalance Oryon Cores
      setOryonCores((prev) =>
        prev.map((core) => {
          if (core.cluster === 'Prime') {
            return { ...core, loadPercent: Math.max(12, core.loadPercent - 18), temperatureC: 37 };
          }
          if (core.cluster === 'Efficiency') {
            return { ...core, loadPercent: Math.min(65, core.loadPercent + 14), temperatureC: 35 };
          }
          return { ...core, loadPercent: Math.max(15, core.loadPercent - 10) };
        })
      );

      setIsOptimizing(false);
      setOptimizedMessage('All emulated binaries converted to ARM64 native. Background threads pinned to Oryon E-cores. AI routines offloaded to Hexagon NPU.');
      setTimeout(() => setOptimizedMessage(null), 6000);
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards: Native ARM64 & Prism Emulation Drag */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs font-mono text-slate-400">ARM64 Native Ratio</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-cyan-400 tabular-nums">{nativeRatio}%</span>
            <span className="text-xs text-slate-400">of active tasks</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-cyan-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${nativeRatio}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs font-mono text-slate-400">Total System Power</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-amber-300 tabular-nums">{totalPowerWatts.toFixed(1)}W</span>
            <span className="text-xs text-slate-400">SoC Envelope</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">HP Smart Sense target: &lt;25W</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs font-mono text-slate-400">Prism Emulation Drag</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-rose-400 tabular-nums">+{totalEmulationPenaltyWatts.toFixed(1)}W</span>
            <span className="text-xs text-slate-400">wasted</span>
          </div>
          <p className="text-[11px] text-rose-300/80 mt-1">Cost: ~{estimatedBatteryHoursLost} hours battery life</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="text-xs font-mono text-slate-400">Autonomous Governor</div>
          <button
            onClick={handleOptimizeAll}
            disabled={isOptimizing}
            className="w-full mt-2 py-2 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
          >
            {isOptimizing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Zap className="w-3.5 h-3.5 fill-current" />
            )}
            <span>Optimize All to ARM64</span>
          </button>
        </div>
      </div>

      {optimizedMessage && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{optimizedMessage}</span>
        </div>
      )}

      {/* Snapdragon Oryon CPU Topology (12 Cores Across 3 Clusters) */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Qualcomm Oryon CPU Topology (12 Cores @ 4.2GHz Max)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Asymmetric Multiprocessing: Prime & Performance clusters handle heavy foreground compiling; Efficiency cluster handles background multitasking.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-cyan-500 inline-block" /> Prime (4.2GHz)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-indigo-500 inline-block" /> Perf (3.4GHz)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" /> E-Cores (3.0GHz)</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {oryonCores.map((core) => {
            const clusterColor =
              core.cluster === 'Prime'
                ? 'border-cyan-500/30 bg-cyan-950/20'
                : core.cluster === 'Performance'
                ? 'border-indigo-500/30 bg-indigo-950/20'
                : 'border-emerald-500/30 bg-emerald-950/20';

            const barColor =
              core.cluster === 'Prime'
                ? 'bg-cyan-400'
                : core.cluster === 'Performance'
                ? 'bg-indigo-400'
                : 'bg-emerald-400';

            return (
              <div
                key={core.coreId}
                className={`p-3 rounded-lg border ${clusterColor} text-xs font-mono space-y-2`}
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-200">Core {core.coreId}</span>
                  <span className="text-slate-400">{core.cluster[0]}</span>
                </div>

                <div className="text-base font-bold text-white tabular-nums">
                  {core.frequencyGHz.toFixed(1)} <span className="text-[10px] text-slate-400">GHz</span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Load</span>
                    <span className="tabular-nums">{core.loadPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${barColor}`}
                      style={{ width: `${core.loadPercent}%` }}
                    />
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 flex justify-between pt-1 border-t border-slate-800/40">
                  <span>Temp</span>
                  <span className="text-slate-300">{core.temperatureC}°C</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Multitasking Process Table */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Live Multitasking Matrix & Architecture Inspector</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Inspect binaries running natively on ARM64 vs Prism emulation translation drag.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">{processes.length} Active Workloads</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="pb-3 font-medium">Process Name</th>
                <th className="pb-3 font-medium">Architecture</th>
                <th className="pb-3 font-medium text-right">CPU %</th>
                <th className="pb-3 font-medium text-right">RAM (MB)</th>
                <th className="pb-3 font-medium text-right">NPU (TOPS)</th>
                <th className="pb-3 font-medium text-right">Power (W)</th>
                <th className="pb-3 font-medium text-center">Cluster</th>
                <th className="pb-3 font-medium text-right">ARM Optimization</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {processes.map((proc) => {
                const isNative = proc.arch === 'ARM64 (Native)';
                return (
                  <tr key={proc.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 font-sans font-medium text-slate-200">
                      <div>{proc.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{proc.category}</div>
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                          isNative
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {proc.arch}
                      </span>
                    </td>
                    <td className="py-3 text-right tabular-nums text-slate-300 font-medium">
                      {proc.cpuPercent}%
                    </td>
                    <td className="py-3 text-right tabular-nums text-slate-300">
                      {proc.memoryMB}
                    </td>
                    <td className="py-3 text-right tabular-nums text-cyan-300 font-semibold">
                      {proc.npuTopsUsed > 0 ? `${proc.npuTopsUsed} TOPS` : '-'}
                    </td>
                    <td className="py-3 text-right tabular-nums text-amber-300 font-semibold">
                      {proc.powerDrawWatts}W
                    </td>
                    <td className="py-3 text-center">
                      <span className="text-[11px] text-slate-400">{proc.assignedCluster}</span>
                    </td>
                    <td className="py-3 text-right">
                      {!isNative ? (
                        <button
                          onClick={() => handleMigrateToNative(proc.id)}
                          className="px-2.5 py-1 rounded bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-[11px] font-medium transition-colors"
                        >
                          Switch to Native ARM64
                        </button>
                      ) : proc.canOffloadToNpu && proc.npuTopsUsed === 0 ? (
                        <button
                          onClick={() => handleOffloadToNpu(proc.id)}
                          className="px-2.5 py-1 rounded bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-300 text-[11px] font-medium transition-colors"
                        >
                          Offload to NPU
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-500 flex items-center justify-end gap-1 font-sans">
                          <Check className="w-3 h-3 text-emerald-400" /> Optimal
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
