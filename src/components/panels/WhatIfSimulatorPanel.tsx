import React, { useState } from 'react';
import {
  Sliders,
  Play,
  RotateCcw,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Cpu,
  ArrowRight,
  Shield,
  Layers,
  X
} from 'lucide-react';
import { WhatIfParameters, WhatIfResult, TerrainDifficulty } from '../../types';
import { calculateWhatIfOptimization } from '../../simulation/simulationEngine';

interface WhatIfSimulatorPanelProps {
  onClose?: () => void;
}

export const WhatIfSimulatorPanel: React.FC<WhatIfSimulatorPanelProps> = ({ onClose }) => {
  const [params, setParams] = useState<WhatIfParameters>({
    population: 28400,
    demandMbps: 220,
    satellitesCount: 24,
    groundStationsCount: 6,
    fiberAvailable: true,
    cellularAvailable: true,
    satelliteAvailable: true,
    terrainDifficulty: 'HIGH',
  });

  const [optimizingStep, setOptimizingStep] = useState<number | null>(null);
  const [result, setResult] = useState<WhatIfResult>(() => calculateWhatIfOptimization(params));

  const handleRunOptimization = () => {
    setOptimizingStep(1); // ANALYZING REGION (Terrain)
    setTimeout(() => setOptimizingStep(2), 400); // CHECKING INFRASTRUCTURE
    setTimeout(() => setOptimizingStep(3), 800); // ANALYZING SATELLITES
    setTimeout(() => setOptimizingStep(4), 1200); // CALCULATING DEMAND
    setTimeout(() => setOptimizingStep(5), 1600); // OPTIMIZING ROUTE
    setTimeout(() => {
      setOptimizingStep(null);
      setResult(calculateWhatIfOptimization(params));
    }, 2000);
  };

  const handleResetDefaults = () => {
    const defaultParams: WhatIfParameters = {
      population: 28400,
      demandMbps: 220,
      satellitesCount: 24,
      groundStationsCount: 6,
      fiberAvailable: true,
      cellularAvailable: true,
      satelliteAvailable: true,
      terrainDifficulty: 'HIGH',
    };
    setParams(defaultParams);
    setResult(calculateWhatIfOptimization(defaultParams));
  };

  return (
    <div className="h-full flex flex-col bg-[#FFFFFF] border-l border-[#DDD9D0] text-[#202322] select-none text-xs font-mono overflow-y-auto">
      {/* Header */}
      <div className="px-4 py-3 bg-[#FAF9F5] border-b border-[#DDD9D0] flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded bg-[#202322] text-[#F5F3EE] flex items-center justify-center text-xs">
            <Sliders className="w-3.5 h-3.5 text-[#D97706]" />
          </div>
          <div>
            <h2 className="font-bold text-xs uppercase tracking-wider text-[#202322]">
              WHAT-IF SCENARIO OPTIMIZER
            </h2>
            <p className="text-[10px] text-[#767B78]">
              Deterministic Parametric Grid Simulation
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded text-[#767B78] hover:text-[#202322] hover:bg-[#EFECE6] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="p-4 space-y-4 flex-1">
        {/* Sliders & Parametric Controls */}
        <div className="p-3.5 bg-[#FAF9F5] border border-[#DDD9D0] rounded space-y-3">
          <div className="flex items-center justify-between border-b border-[#EAE6DD] pb-1.5">
            <span className="font-bold text-xs text-[#202322]">SIMULATION PARAMETERS</span>
            <button
              onClick={handleResetDefaults}
              className="text-[10px] text-[#767B78] hover:text-[#202322] flex items-center space-x-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Population Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-[#767B78]">Target Population:</span>
              <span className="font-bold text-[#202322]">{params.population.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="100000"
              step="1000"
              value={params.population}
              onChange={(e) => setParams({ ...params, population: Number(e.target.value) })}
              className="w-full accent-[#D97706] cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-[#8C918E]">
              <span>1k</span>
              <span>50k</span>
              <span>100k</span>
            </div>
          </div>

          {/* Bandwidth Demand Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-[#767B78]">Network Demand:</span>
              <span className="font-bold text-[#202322]">{params.demandMbps} Mbps</span>
            </div>
            <input
              type="range"
              min="10"
              max="1000"
              step="10"
              value={params.demandMbps}
              onChange={(e) => setParams({ ...params, demandMbps: Number(e.target.value) })}
              className="w-full accent-[#D97706] cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-[#8C918E]">
              <span>10 Mbps</span>
              <span>500 Mbps</span>
              <span>1 Gbps</span>
            </div>
          </div>

          {/* Constellation Satellites Count */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-[#767B78]">Active LEO Satellites:</span>
              <span className="font-bold text-[#D97706]">{params.satellitesCount} Orbiters</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              step="1"
              value={params.satellitesCount}
              onChange={(e) => setParams({ ...params, satellitesCount: Number(e.target.value) })}
              className="w-full accent-[#D97706] cursor-pointer"
            />
          </div>

          {/* Ground Stations Count */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-[#767B78]">Ground Gateway Stations:</span>
              <span className="font-bold text-[#202322]">{params.groundStationsCount} Stations</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              step="1"
              value={params.groundStationsCount}
              onChange={(e) => setParams({ ...params, groundStationsCount: Number(e.target.value) })}
              className="w-full accent-[#D97706] cursor-pointer"
            />
          </div>

          {/* Bearer Availability Toggles */}
          <div className="pt-2 border-t border-[#EAE6DD] space-y-1.5">
            <div className="text-[10px] text-[#767B78] uppercase">AVAILABLE BEARERS</div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => setParams({ ...params, fiberAvailable: !params.fiberAvailable })}
                className={`py-1 px-2 rounded border text-center font-bold text-[10px] transition-colors ${
                  params.fiberAvailable
                    ? 'bg-[#7C3AED] text-white border-[#6D28D9]'
                    : 'bg-white text-[#8C918E] border-[#E5E1D8]'
                }`}
              >
                FIBER: {params.fiberAvailable ? 'ON' : 'OFF'}
              </button>

              <button
                onClick={() => setParams({ ...params, cellularAvailable: !params.cellularAvailable })}
                className={`py-1 px-2 rounded border text-center font-bold text-[10px] transition-colors ${
                  params.cellularAvailable
                    ? 'bg-[#15803D] text-white border-[#166534]'
                    : 'bg-white text-[#8C918E] border-[#E5E1D8]'
                }`}
              >
                CELLULAR: {params.cellularAvailable ? 'ON' : 'OFF'}
              </button>

              <button
                onClick={() => setParams({ ...params, satelliteAvailable: !params.satelliteAvailable })}
                className={`py-1 px-2 rounded border text-center font-bold text-[10px] transition-colors ${
                  params.satelliteAvailable
                    ? 'bg-[#D97706] text-white border-[#B45309]'
                    : 'bg-white text-[#8C918E] border-[#E5E1D8]'
                }`}
              >
                SATELLITE: {params.satelliteAvailable ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          {/* Terrain Difficulty Select */}
          <div className="pt-2 border-t border-[#EAE6DD]">
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-[#767B78]">Terrain Difficulty:</span>
              <span className="font-bold text-[#202322]">{params.terrainDifficulty}</span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {(['LOW', 'MEDIUM', 'HIGH', 'EXTREME'] as TerrainDifficulty[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setParams({ ...params, terrainDifficulty: t })}
                  className={`py-1 rounded text-[9px] border font-bold ${
                    params.terrainDifficulty === t
                      ? 'bg-[#202322] text-white border-[#202322]'
                      : 'bg-white text-[#505452] border-[#E5E1D8] hover:bg-[#EFECE6]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Run Optimization Button */}
          {optimizingStep !== null ? (
            <div className="p-3 rounded bg-[#1C1F1E] text-white space-y-1.5 border border-[#3E4542]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#D97706] font-bold">OPTIMIZATION IN PROGRESS</span>
                <span className="status-beacon">● CALCULATING</span>
              </div>
              <div className="space-y-1 text-[10px] text-[#A7ABA8]">
                <div className={optimizingStep >= 1 ? 'text-[#16A34A]' : 'opacity-40'}>
                  ✓ ANALYZING REGION (Terrain factor & elevation)
                </div>
                <div className={optimizingStep >= 2 ? 'text-[#16A34A]' : 'opacity-40'}>
                  ✓ CHECKING INFRASTRUCTURE (Fiber & Cellular)
                </div>
                <div className={optimizingStep >= 3 ? 'text-[#16A34A]' : 'opacity-40'}>
                  ✓ ANALYZING SATELLITES (Line-of-sight & Ku/Ka capacity)
                </div>
                <div className={optimizingStep >= 4 ? 'text-[#16A34A]' : 'opacity-40'}>
                  ✓ CALCULATING DEMAND (Diurnal traffic & peak headroom)
                </div>
                <div className={optimizingStep >= 5 ? 'text-[#16A34A]' : 'opacity-40'}>
                  ✓ OPTIMIZING ROUTE & DYNAMIC BEARER SELECTION
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={handleRunOptimization}
              className="w-full py-2.5 bg-[#D97706] hover:bg-[#B45309] text-white rounded font-mono text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center space-x-2"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>RUN OPTIMIZATION</span>
            </button>
          )}
        </div>

        {/* Before / After Comparison Panel */}
        <div className="p-3.5 bg-[#FAF9F5] border border-[#DDD9D0] rounded space-y-3">
          <div className="flex items-center justify-between border-b border-[#EAE6DD] pb-1.5">
            <span className="font-bold text-xs text-[#202322]">BEFORE / AFTER COMPARISON</span>
            <span className="text-[9px] bg-[#EFECE6] text-[#606462] px-1.5 py-0.5 rounded font-mono">
              SIMULATION RESULT
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* BEFORE */}
            <div className="p-2.5 bg-white border border-[#E5E1D8] rounded space-y-2">
              <div className="font-bold text-[10px] text-[#767B78] uppercase">
                BEFORE OPTIMIZATION
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div>
                  <div className="text-[9px] text-[#767B78]">COVERAGE</div>
                  <div className="font-bold text-[#DC2626] text-sm">{result.before.coveragePct}%</div>
                </div>
                <div>
                  <div className="text-[9px] text-[#767B78]">UNSERVED USERS</div>
                  <div className="font-bold text-[#DC2626]">{result.before.unservedUsers.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[9px] text-[#767B78]">CONGESTION</div>
                  <div className="font-bold text-[#EA580C]">{result.before.congestionPct}%</div>
                </div>
                <div>
                  <div className="text-[9px] text-[#767B78]">AVG LATENCY</div>
                  <div className="font-bold text-[#202322]">{result.before.latencyMs} ms</div>
                </div>
              </div>
            </div>

            {/* AFTER */}
            <div className="p-2.5 bg-[#DCFCE7]/40 border border-[#86EFAC] rounded space-y-2">
              <div className="font-bold text-[10px] text-[#15803D] uppercase">
                AFTER OPTIMIZATION
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div>
                  <div className="text-[9px] text-[#15803D]">COVERAGE</div>
                  <div className="font-bold text-[#15803D] text-sm">{result.after.coveragePct}%</div>
                </div>
                <div>
                  <div className="text-[9px] text-[#15803D]">UNSERVED USERS</div>
                  <div className="font-bold text-[#15803D]">{result.after.unservedUsers.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[9px] text-[#15803D]">CONGESTION</div>
                  <div className="font-bold text-[#15803D]">{result.after.congestionPct}%</div>
                </div>
                <div>
                  <div className="text-[9px] text-[#15803D]">AVG LATENCY</div>
                  <div className="font-bold text-[#15803D]">{result.after.latencyMs} ms</div>
                </div>
              </div>
            </div>
          </div>

          {/* Derived Simulation Telemetry */}
          <div className="pt-2 border-t border-[#EAE6DD] grid grid-cols-2 gap-2 text-[10px]">
            <div className="p-2 bg-white rounded border border-[#E5E1D8]">
              <span className="text-[#767B78] block">SATELLITE FLEET LOAD</span>
              <span className="font-bold text-xs text-[#D97706]">{result.satelliteLoadPct}%</span>
            </div>
            <div className="p-2 bg-white rounded border border-[#E5E1D8]">
              <span className="text-[#767B78] block">GATEWAYS REQUIRED</span>
              <span className="font-bold text-xs text-[#202322]">{result.groundStationsRequired} Sites</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
