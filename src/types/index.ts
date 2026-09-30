export type ArchitectureType = 'ARM64 (Native)' | 'x86-64 (Prism Emulated)' | 'x86-32 (Emulated)';

export type ComputeTarget = 'Hexagon NPU' | 'Oryon Prime Cores' | 'Oryon Efficiency Cores' | 'Adreno GPU';

export interface ProcessItem {
  id: string;
  name: string;
  category: 'Development' | 'Creative' | 'Productivity' | 'System' | 'AI / Machine Learning';
  arch: ArchitectureType;
  cpuPercent: number;
  memoryMB: number;
  npuTopsUsed: number;
  assignedCluster: 'Prime' | 'Performance' | 'Efficiency' | 'NPU Direct';
  emulationPenaltyPercent: number;
  nativeArmAvailable: boolean;
  nativePackageUrl?: string;
  powerDrawWatts: number;
  canOffloadToNpu: boolean;
}

export interface QualcommAiHubModel {
  id: string;
  name: string;
  category: 'LLM' | 'Speech' | 'Vision' | 'Embedding';
  parameterSize: string;
  quantization: 'INT4' | 'INT8' | 'FP16';
  executionProvider: 'QNN Execution Provider (HTP)' | 'DirectML (GPU)' | 'CPU Native (NEON)';
  npuTopsRequirement: number;
  tokensPerSecNpu: number;
  tokensPerSecCpu: number;
  latencyMs: number;
  powerWatts: number;
  ramUsageMB: number;
  description: string;
  status: 'Ready on NPU' | 'Compiling to QNN' | 'Available';
}

export interface OryonCoreStatus {
  coreId: number;
  cluster: 'Prime' | 'Performance' | 'Efficiency';
  frequencyGHz: number;
  loadPercent: number;
  temperatureC: number;
}

export type HpSmartSenseMode = 'Performance' | 'Balanced' | 'Quiet / Fanless' | 'Eco 26-Hour';

export interface PresenceSensorStatus {
  userDetected: boolean;
  distanceMeters: number;
  attentionGaze: 'Direct at Screen' | 'Looking Away' | 'Not Present';
  privacyAlert: boolean;
  npuEngineState: 'Ultra-Low-Power Wake Engine (0.12W)';
}
