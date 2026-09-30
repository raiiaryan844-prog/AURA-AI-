import React, { useState, useEffect, useRef } from 'react';
import { QualcommAiHubModel } from '../types';
import { QUALCOMM_AI_HUB_MODELS } from '../data/mockHardware';
import { Cpu, Zap, Shield, Play, RotateCcw, CheckCircle, Terminal, Layers, ArrowRight } from 'lucide-react';

interface NpuInferenceStudioProps {
  onNpuLoadChange: (tops: number) => void;
}

export const NpuInferenceStudio: React.FC<NpuInferenceStudioProps> = ({ onNpuLoadChange }) => {
  const [selectedModel, setSelectedModel] = useState<QualcommAiHubModel>(QUALCOMM_AI_HUB_MODELS[0]);
  const [executionProvider, setExecutionProvider] = useState<'qnn-npu' | 'directml-gpu' | 'cpu-native'>('qnn-npu');
  const [prompt, setPrompt] = useState('Analyze the multitasking memory footprint and summarize optimization strategies for ARM64.');
  const [isGenerating, setIsGenerating] = useState(false);
  const [outputStream, setOutputStream] = useState('');
  const [tokensGenerated, setTokensGenerated] = useState(0);
  const [elapsedTimeMs, setElapsedTimeMs] = useState(0);
  const [currentSpeedTps, setCurrentSpeedTps] = useState(0);
  const streamIntervalRef = useRef<any>(null);

  // Pre-configured sample prompts
  const samplePrompts = [
    {
      title: 'Multitasking Memory Audit',
      text: 'Analyze the multitasking memory footprint and summarize optimization strategies for ARM64.',
    },
    {
      title: 'Whisper Audio Transcribe',
      text: 'Transcribe 45-minute technical review audio on Hexagon NPU without waking CPU high-performance clusters.',
    },
    {
      title: 'Code Vectorization (NEON)',
      text: 'Convert float32 matrix dot-product into 128-bit ARM NEON intrinsics for Snapdragon Oryon CPU.',
    },
    {
      title: 'Confidential Document Summary',
      text: 'Extract key clauses and liability limits from executive agreement (100% on-device private processing).',
    },
  ];

  // Calculated metrics based on active execution provider
  const getMetrics = () => {
    if (executionProvider === 'qnn-npu') {
      return {
        providerName: 'Qualcomm QNN (Hexagon HTP)',
        speedTps: selectedModel.tokensPerSecNpu,
        latencyMs: selectedModel.latencyMs,
        powerWatts: selectedModel.powerWatts,
        fanState: '0 dB (Silent / Passive)',
        topsDraw: selectedModel.npuTopsRequirement,
        hardwareAccent: 'text-cyan-400',
        badgeBg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
      };
    } else if (executionProvider === 'directml-gpu') {
      return {
        providerName: 'DirectML (Adreno GPU)',
        speedTps: Math.round(selectedModel.tokensPerSecNpu * 0.58),
        latencyMs: Math.round(selectedModel.latencyMs * 1.7),
        powerWatts: Math.round(selectedModel.powerWatts * 3.4 * 10) / 10,
        fanState: '18 dB (Low Whispering Fan)',
        topsDraw: 0,
        hardwareAccent: 'text-indigo-400',
        badgeBg: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300',
      };
    } else {
      return {
        providerName: 'CPU Native / Prism Fallback',
        speedTps: selectedModel.tokensPerSecCpu,
        latencyMs: Math.round(selectedModel.latencyMs * 4.8),
        powerWatts: Math.round(selectedModel.powerWatts * 8.5 * 10) / 10,
        fanState: '41 dB (Active High Fan)',
        topsDraw: 0,
        hardwareAccent: 'text-rose-400',
        badgeBg: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
      };
    }
  };

  const metrics = getMetrics();

  // Run local inference simulation
  const handleRunInference = () => {
    if (isGenerating) return;

    setIsGenerating(true);
    setOutputStream('');
    setTokensGenerated(0);
    setElapsedTimeMs(0);
    onNpuLoadChange(metrics.topsDraw);

    // Realistic response text tailored to the selected prompt
    const fullResponse = `[ONNX Runtime QNN Provider: Active]
Model: ${selectedModel.name} | Quantization: ${selectedModel.quantization} (fused INT4 operators)
Hardware Acceleration: Qualcomm Hexagon 45 TOPS NPU (QnnHtp.dll)
Host Device: HP OmniBook X (Snapdragon X Elite ARM64)

1. EXECUTION TRACE & VECTOR EFFICIENCY:
- Zero data packets sent to external networks. Confidentiality grade: Complete Local Air-Gap.
- Tensor decomposition routed to Hexagon Tensor Processor (HTP) at ${metrics.powerWatts}W baseline envelope.
- Oryon CPU load stayed below 2.8%, leaving Prime cores free for background IDE compile & 4K video rendering.

2. QUANTIZED PERFORMANCE BENCHMARK:
- Target throughput achieved: ${metrics.speedTps} tokens/second.
- Thermal footprint: Surface chassis stayed at nominal 33.2°C (fanless 0dB acoustic operation).
- Memory bandwidth consumption: 4.8 GB/s over LPDDR5x unified memory bus.

3. OPTIMIZATION INSIGHT:
Running this workload on Hexagon NPU saves approximately 87% battery energy compared to running x86 emulated models on traditional legacy architectures. Seamless multitasking is guaranteed.`;

    const words = fullResponse.split(' ');
    let wordIndex = 0;
    const intervalTime = Math.max(16, Math.round(1000 / (metrics.speedTps * 1.4)));
    const startTime = Date.now();

    streamIntervalRef.current = setInterval(() => {
      if (wordIndex < words.length) {
        setOutputStream((prev) => (prev ? prev + ' ' + words[wordIndex] : words[wordIndex]));
        wordIndex++;
        setTokensGenerated(Math.round(wordIndex * 1.35));
        const elapsed = Date.now() - startTime;
        setElapsedTimeMs(elapsed);
        const instantTps = elapsed > 0 ? (wordIndex * 1.35) / (elapsed / 1000) : metrics.speedTps;
        setCurrentSpeedTps(Math.round(instantTps * 10) / 10);
      } else {
        clearInterval(streamIntervalRef.current);
        setIsGenerating(false);
      }
    }, intervalTime);
  };

  const handleStopInference = () => {
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
    }
    setIsGenerating(false);
    onNpuLoadChange(4.8); // Return to system baseline
  };

  useEffect(() => {
    return () => {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner: Qualcomm AI Hub & Local On-Device Architecture */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono font-medium text-cyan-400">Qualcomm AI Hub Verified</span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">ONNX Runtime 1.19+ with QNN Execution Provider</span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <Shield className="w-3 h-3" /> 100% On-Device Air-Gapped
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Snapdragon 45 TOPS Hexagon NPU Local Intelligence
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Execute quantized LLMs, vision, and speech models directly on the Qualcomm Hexagon Neural Processing Unit.
              Preserves 26-hour HP OmniBook battery life by freeing the 12 Oryon CPU cores from heavy matrix multiply calculations.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 p-2 rounded-lg self-start md:self-auto font-mono text-xs">
            <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <div className="text-slate-400 text-[10px]">Active NPU Engine</div>
              <div className="text-cyan-300 font-semibold">QnnHtp.dll (Hexagon HTP)</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Model Catalog from Qualcomm AI Hub */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Qualcomm AI Hub Model Registry</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">5 Optimized</span>
          </div>

          <div className="space-y-2.5">
            {QUALCOMM_AI_HUB_MODELS.map((model) => {
              const isSelected = selectedModel.id === model.id;
              return (
                <button
                  key={model.id}
                  onClick={() => {
                    setSelectedModel(model);
                    if (!isGenerating) {
                      setOutputStream('');
                    }
                  }}
                  className={`w-full text-left p-3.5 rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500/50 shadow-sm shadow-cyan-500/10'
                      : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold text-sm text-slate-200">{model.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{model.parameterSize}</div>
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                      {model.quantization}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">{model.description}</p>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">
                      NPU: <span className="text-cyan-400 font-semibold">{model.tokensPerSecNpu} tok/s</span>
                    </span>
                    <span className="text-slate-500">
                      TDP: <span className="text-slate-300">{model.powerWatts}W</span>
                    </span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Compiled
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quantization & Operator Fusion Info */}
          <div className="p-4 rounded-lg bg-slate-900/40 border border-slate-800/80 text-xs space-y-2">
            <div className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Compilation Toolchain</span>
            </div>
            <div className="text-slate-400 font-mono text-[11px] bg-slate-950 p-2.5 rounded border border-slate-800 space-y-1">
              <p className="text-slate-500">// Qualcomm AI Engine Direct v2.24</p>
              <p className="text-cyan-300">qnn-onnx-converter \</p>
              <p className="pl-3 text-slate-300">--input_network model.onnx \</p>
              <p className="pl-3 text-slate-300">--quantization_overrides act_int4.json \</p>
              <p className="pl-3 text-slate-300">--backend libQnnHtp.so</p>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Local Inference Playground */}
        <div className="lg:col-span-8 space-y-5">
          {/* Hardware Execution Provider Switcher */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Hardware Target</span>
                <h4 className="text-sm font-semibold text-white">Execution Provider Routing</h4>
              </div>
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setExecutionProvider('qnn-npu')}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-all whitespace-nowrap ${
                    executionProvider === 'qnn-npu'
                      ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Hexagon NPU (45 TOPS)
                </button>
                <button
                  onClick={() => setExecutionProvider('directml-gpu')}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-all whitespace-nowrap ${
                    executionProvider === 'directml-gpu'
                      ? 'bg-indigo-500 text-white font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Adreno GPU (DirectML)
                </button>
                <button
                  onClick={() => setExecutionProvider('cpu-native')}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-all whitespace-nowrap ${
                    executionProvider === 'cpu-native'
                      ? 'bg-rose-500 text-white font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  CPU Emulation
                </button>
              </div>
            </div>

            {/* Provider Telemetry Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80">
                <div className="text-[11px] text-slate-400">Target Throughput</div>
                <div className={`text-base font-bold font-mono tabular-nums ${metrics.hardwareAccent}`}>
                  {metrics.speedTps} <span className="text-xs font-normal text-slate-400">tok/s</span>
                </div>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80">
                <div className="text-[11px] text-slate-400">First-Token Latency</div>
                <div className="text-base font-bold font-mono tabular-nums text-slate-200">
                  {metrics.latencyMs} <span className="text-xs font-normal text-slate-400">ms</span>
                </div>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80">
                <div className="text-[11px] text-slate-400">Power Consumption</div>
                <div className="text-base font-bold font-mono tabular-nums text-amber-300">
                  {metrics.powerWatts} <span className="text-xs font-normal text-slate-400">Watts</span>
                </div>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80">
                <div className="text-[11px] text-slate-400">Chassis Acoustics</div>
                <div className="text-xs font-semibold font-mono text-slate-300 mt-1">
                  {metrics.fanState}
                </div>
              </div>
            </div>
          </div>

          {/* Prompt Presets */}
          <div className="space-y-2">
            <div className="text-xs text-slate-400 font-medium">Quick Workload Presets:</div>
            <div className="flex flex-wrap gap-2">
              {samplePrompts.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(p.text)}
                  className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition-colors"
                >
                  {p.title}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Prompt Box */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300 block">Input Prompt / Workload Task</label>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                placeholder="Type your task for on-device execution..."
              />
              <div className="absolute right-3 bottom-3 flex items-center gap-2">
                {isGenerating ? (
                  <button
                    onClick={handleStopInference}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Halt Execution</span>
                  </button>
                ) : (
                  <button
                    onClick={handleRunInference}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-semibold shadow transition-all active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Run On-Device</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Output Terminal & Live Stream */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-3 min-h-[220px]">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isGenerating ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'}`} />
                <span>TERMINAL: ONNX Runtime (QNN EP)</span>
              </div>
              <div className="flex items-center gap-4 tabular-nums">
                <span>Speed: <strong className="text-cyan-300">{isGenerating ? currentSpeedTps : metrics.speedTps} t/s</strong></span>
                <span>Tokens: <strong className="text-slate-200">{tokensGenerated}</strong></span>
                <span>Latency: <strong className="text-slate-200">{elapsedTimeMs}ms</strong></span>
              </div>
            </div>

            <div className="text-slate-200 leading-relaxed whitespace-pre-wrap font-mono min-h-[140px]">
              {outputStream ? (
                outputStream
              ) : (
                <span className="text-slate-600 italic">
                  Select a model and click "Run On-Device" to benchmark real local inference on Snapdragon Hexagon NPU.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
