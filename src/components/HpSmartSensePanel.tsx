import React, { useState } from 'react';
import { HpSmartSenseMode, PresenceSensorStatus } from '../types';
import { Sliders, Shield, BatteryCharging, Eye, Lock, Volume2, Thermometer, Check } from 'lucide-react';
import { BatteryEfficiencyInsights } from './BatteryEfficiencyInsights';

export const HpSmartSensePanel: React.FC = () => {
  const [smartSenseMode, setSmartSenseMode] = useState<HpSmartSenseMode>('Balanced');
  const [presenceSensors, setPresenceSensors] = useState<PresenceSensorStatus>({
    userDetected: true,
    distanceMeters: 0.65,
    attentionGaze: 'Direct at Screen',
    privacyAlert: false,
    npuEngineState: 'Ultra-Low-Power Wake Engine (0.12W)',
  });
  const [autoDimEnabled, setAutoDimEnabled] = useState(true);
  const [walkAwayLockEnabled, setWalkAwayLockEnabled] = useState(true);
  const [privacyAlertEnabled, setPrivacyAlertEnabled] = useState(true);

  // Dynamic mode properties
  const getModeDetails = (mode: HpSmartSenseMode) => {
    switch (mode) {
      case 'Performance':
        return {
          tdpWatts: 45,
          fanProfile: 'Smart Acoustic (Max 36 dB under heavy 4K render)',
          batteryHoursEst: 16.5,
          accent: 'text-amber-400',
          border: 'border-amber-500/40 bg-amber-500/5',
          description: 'Unlocks full 4.2GHz Oryon CPU boost and 3.8 TFLOPS Adreno GPU for intensive multi-threaded workloads.',
        };
      case 'Balanced':
        return {
          tdpWatts: 28,
          fanProfile: 'Whisper Quiet (<22 dB, passive for general browsing)',
          batteryHoursEst: 22.0,
          accent: 'text-cyan-400',
          border: 'border-cyan-500/40 bg-cyan-500/5',
          description: 'Adaptive dynamic tuning that balances Oryon CPU performance with Hexagon NPU offloading.',
        };
      case 'Quiet / Fanless':
        return {
          tdpWatts: 15,
          fanProfile: '0 dB (100% Fanless / Passive Heat Dissipation)',
          batteryHoursEst: 24.5,
          accent: 'text-indigo-400',
          border: 'border-indigo-500/40 bg-indigo-500/5',
          description: 'Strict 0dB fanless profile. Heavy matrix calculations offloaded strictly to the 45 TOPS NPU.',
        };
      case 'Eco 26-Hour':
        return {
          tdpWatts: 8,
          fanProfile: '0 dB Silent (Oryon Prime Cores Power-Gated)',
          batteryHoursEst: 26.2,
          accent: 'text-emerald-400',
          border: 'border-emerald-500/40 bg-emerald-500/5',
          description: 'Maximum battery longevity for travel. Screen refresh dynamically adjusted and background tasks pinned to E-cores.',
        };
    }
  };

  const currentDetails = getModeDetails(smartSenseMode);

  return (
    <div className="space-y-6">
      {/* Top Header: HP Smart Sense System Governor */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-medium text-cyan-400">HP Hardware Optimization Suite</span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">HP OmniBook X / HP EliteBook Ultra</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              HP Smart Sense & NPU Sensor Integration
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Co-engineered with Qualcomm to dynamically govern Oryon CPU clock frequencies, chassis surface thermals,
              and low-power NPU micro-vision sensors for up to 26 hours of real-world productivity.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs font-mono">
            <BatteryCharging className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-slate-400 text-[10px]">Projected Battery Life</div>
              <div className="text-emerald-300 font-bold text-sm tabular-nums">
                {currentDetails.batteryHoursEst} Hours Continuous
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HP Smart Sense Modes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {(['Performance', 'Balanced', 'Quiet / Fanless', 'Eco 26-Hour'] as HpSmartSenseMode[]).map((mode) => {
          const isSelected = smartSenseMode === mode;
          const details = getModeDetails(mode);
          return (
            <button
              key={mode}
              onClick={() => setSmartSenseMode(mode)}
              className={`p-4 rounded-xl border text-left transition-all ${
                isSelected
                  ? `${details.border} shadow-sm shadow-cyan-500/10`
                  : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-white">{mode}</span>
                {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
              </div>

              <div className="mt-2 flex items-baseline gap-1.5 font-mono">
                <span className={`text-xl font-bold ${details.accent} tabular-nums`}>{details.tdpWatts}W</span>
                <span className="text-xs text-slate-400">TDP Envelope</span>
              </div>

              <p className="text-xs text-slate-400 mt-2 line-clamp-2">{details.description}</p>

              <div className="mt-3 pt-2.5 border-t border-slate-800/60 text-[11px] font-mono text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5">
                  <Volume2 className="w-3 h-3 text-slate-500" />
                  <span className="truncate">{details.fanProfile}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BatteryCharging className="w-3 h-3 text-slate-500" />
                  <span>Est. {details.batteryHoursEst}h Lifespan</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Battery Efficiency Insights & NPU Power Dynamics Component */}
      <BatteryEfficiencyInsights />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: HP NPU Presence & Privacy Sensing */}
        <div className="lg:col-span-7 p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                <span>HP NPU Presence & Attention Sensing</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Runs on Qualcomm Hexagon NPU micro-engine (0.12W) without interrupting Oryon sleep states.
              </p>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono">
              Sensors Live
            </span>
          </div>

          {/* Sensor Status Dashboard */}
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <span className="text-slate-400">Micro-Vision NPU Pipeline:</span>
              <span className="text-cyan-300 font-semibold">{presenceSensors.npuEngineState}</span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
                <div className="text-[10px] text-slate-400">User Proximity</div>
                <div className="text-sm font-bold text-white mt-1 tabular-nums">
                  {presenceSensors.distanceMeters} m
                </div>
                <div className="text-[10px] text-emerald-400 mt-0.5">In Working Range</div>
              </div>

              <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
                <div className="text-[10px] text-slate-400">Attention Gaze</div>
                <div className="text-sm font-bold text-cyan-300 mt-1">
                  {presenceSensors.attentionGaze}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">100% Display Brightness</div>
              </div>

              <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
                <div className="text-[10px] text-slate-400">Shoulder Surfer</div>
                <div className="text-sm font-bold text-emerald-400 mt-1">
                  Clear
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Zero Bystanders</div>
              </div>
            </div>
          </div>

          {/* Interactive Sensor Toggles */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <div>
                <div className="text-xs font-semibold text-slate-200">Auto-Dim on Look Away</div>
                <div className="text-[11px] text-slate-400">Dims OLED display to 20% brightness when gaze is diverted. Saves ~1.8W.</div>
              </div>
              <button
                onClick={() => setAutoDimEnabled(!autoDimEnabled)}
                className={`w-10 h-6 rounded-full transition-colors relative ${
                  autoDimEnabled ? 'bg-cyan-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-slate-950 transition-transform absolute top-1 ${
                    autoDimEnabled ? 'left-5' : 'left-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <div>
                <div className="text-xs font-semibold text-slate-200">Walk-Away Auto Lock</div>
                <div className="text-[11px] text-slate-400">Locks Windows session and enters low-power standby when user walks past 1.2m.</div>
              </div>
              <button
                onClick={() => setWalkAwayLockEnabled(!walkAwayLockEnabled)}
                className={`w-10 h-6 rounded-full transition-colors relative ${
                  walkAwayLockEnabled ? 'bg-cyan-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-slate-950 transition-transform absolute top-1 ${
                    walkAwayLockEnabled ? 'left-5' : 'left-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <div>
                <div className="text-xs font-semibold text-slate-200">Privacy Alert (Shoulder Surfer Detection)</div>
                <div className="text-[11px] text-slate-400">Blurs sensitive windows and alerts user if someone looks from behind.</div>
              </div>
              <button
                onClick={() => setPrivacyAlertEnabled(!privacyAlertEnabled)}
                className={`w-10 h-6 rounded-full transition-colors relative ${
                  privacyAlertEnabled ? 'bg-cyan-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-slate-950 transition-transform absolute top-1 ${
                    privacyAlertEnabled ? 'left-5' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Snapdragon X Elite vs Legacy x86 Battery Curve */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-cyan-400" />
              <span>All-Day Multitasking Battery Curve</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Continuous multitasking workload: VS Code, 20 Edge tabs, Spotify, and Local NPU LLM.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-cyan-400 font-semibold">HP OmniBook X (Snapdragon X Elite)</span>
                <span className="text-cyan-300 font-bold">24.5 Hours</span>
              </div>
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full" style={{ width: '94%' }} />
              </div>
              <div className="text-[11px] text-slate-400">Avg power draw: 2.2W – 3.8W across 12 Oryon cores + NPU</div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Legacy x86 Core Ultra Laptop</span>
                <span className="text-slate-400 font-medium">8.2 Hours</span>
              </div>
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                <div className="bg-slate-600 h-full rounded-full" style={{ width: '33%' }} />
              </div>
              <div className="text-[11px] text-slate-500">Avg power draw: 14.5W – 28.0W (thermal throttling + loud fans)</div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-300 font-mono space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Energy Efficiency Gain:</span>
                <span className="text-emerald-400 font-bold">+198% Greater Longevity</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Acoustic Delta:</span>
                <span className="text-cyan-400 font-bold">0 dB vs 42 dB High Fans</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400 leading-relaxed">
            <span className="font-semibold text-slate-300">Why Snapdragon HP PCs Excel:</span> By keeping the Hexagon NPU active for background AI and pinning non-critical threads to Oryon Efficiency cores, the HP OmniBook X maintains cool palm rests and virtually zero fan spin even during aggressive multitasking.
          </div>
        </div>
      </div>
    </div>
  );
};
