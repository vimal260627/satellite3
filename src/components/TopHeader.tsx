import React from 'react';
import {
  Radio,
  Clock,
  AlertTriangle,
  RotateCcw,
  Zap,
  Activity,
  Layers
} from 'lucide-react';
import { SimulationFailureState } from '../types';

interface TopHeaderProps {
  simulationTime: string;
  failureState: SimulationFailureState;
  onToggleFailure: (key: keyof SimulationFailureState) => void;
  onSelectScenario: (scenarioId: string) => void;
  onResetView: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  simulationTime,
  failureState,
  onToggleFailure,
  onSelectScenario,
  onResetView,
}) => {
  return (
    <header className="h-14 bg-[#1E2120] text-[#EFECE6] border-b border-[#353A38] px-4 flex items-center justify-between select-none z-30 shrink-0">
      {/* Brand & Identity */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded bg-[#D97706]/15 border border-[#D97706]/50 flex items-center justify-center text-[#D97706]">
          <Radio className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-bold tracking-wider text-sm text-[#F5F3EE] font-mono">
              ASTRA-GRID
            </span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#2D3230] text-[#D97706] border border-[#3E4542]">
              IND-TWIN v2.4
            </span>
          </div>
          <p className="text-[11px] text-[#9CA19E] tracking-tight leading-tight">
            AI-POWERED CONNECTIVITY GRID <span className="text-[#646A67] mx-1">|</span> INDIA DIGITAL TWIN
          </p>
        </div>
      </div>

      {/* Center Operational Status */}
      <div className="hidden lg:flex items-center space-x-4 text-xs font-mono">
        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#272B2A] border border-[#353A38]">
          <span className="w-2 h-2 rounded-full bg-[#16A34A] status-beacon" />
          <span className="text-[#A7ABA8]">SIMULATION:</span>
          <span className="text-[#16A34A] font-medium">ACTIVE</span>
        </div>

        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#272B2A] border border-[#353A38]">
          <Activity className="w-3.5 h-3.5 text-[#D97706]" />
          <span className="text-[#A7ABA8]">ORCHESTRATOR:</span>
          <span className="text-[#F5F3EE] font-medium">AUTONOMOUS</span>
        </div>

        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#272B2A] border border-[#353A38]">
          <Layers className="w-3.5 h-3.5 text-[#7C3AED]" />
          <span className="text-[#A7ABA8]">GRID MESH:</span>
          <span className="text-[#F5F3EE] font-medium">HYBRID LEO+4G+FIBER</span>
        </div>
      </div>

      {/* Right Controls & Telemetry */}
      <div className="flex items-center space-x-2.5">
        {/* Preset Scenarios Dropdown */}
        <div className="hidden md:flex items-center space-x-1.5 text-xs">
          <span className="text-[#888D8B] text-[11px] font-mono">SCENARIO:</span>
          <select
            className="bg-[#272B2A] text-[#EFECE6] border border-[#3E4542] rounded px-2 py-1 text-xs font-mono focus:outline-none focus:border-[#D97706] cursor-pointer"
            onChange={(e) => onSelectScenario(e.target.value)}
            defaultValue="loc-spiti-kaza"
          >
            <option value="loc-spiti-kaza">01. Himalayan Village (Spiti Valley)</option>
            <option value="loc-kodaikanal-rural">02. Western Ghats Ridge (Kodaikanal)</option>
            <option value="loc-tawang-frontier">03. Northeast Outpost (Tawang Sela Pass)</option>
            <option value="loc-sam-jaisalmer">04. Arid Desert Hamlet (Sam Jaisalmer)</option>
            <option value="loc-city-leh">05. High-Altitude Hub (Leh Ladakh)</option>
          </select>
        </div>

        {/* Failure Simulation Quick Toggles */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onToggleFailure('fiberCut')}
            className={`px-2 py-1 rounded text-[11px] font-mono flex items-center space-x-1 border transition-colors ${
              failureState.fiberCut
                ? 'bg-[#DC2626]/20 text-[#EF4444] border-[#DC2626]'
                : 'bg-[#272B2A] text-[#B0B5B2] border-[#3E4542] hover:bg-[#323836]'
            }`}
            title="Simulate Fiber Cable Cut and Automated LEO Satellite Failover"
          >
            <AlertTriangle className="w-3 h-3 text-[#EF4444]" />
            <span className="hidden sm:inline">FIBER CUT</span>
          </button>

          <button
            onClick={() => onToggleFailure('cellularOutage')}
            className={`px-2 py-1 rounded text-[11px] font-mono flex items-center space-x-1 border transition-colors ${
              failureState.cellularOutage
                ? 'bg-[#DC2626]/20 text-[#EF4444] border-[#DC2626]'
                : 'bg-[#272B2A] text-[#B0B5B2] border-[#3E4542] hover:bg-[#323836]'
            }`}
            title="Simulate Cellular Base Station Failure"
          >
            <Zap className="w-3 h-3 text-[#F59E0B]" />
            <span className="hidden sm:inline">TOWER FAIL</span>
          </button>
        </div>

        {/* Live IST Clock */}
        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#141615] border border-[#2E3331] text-[#E5E2DA] font-mono text-xs">
          <Clock className="w-3.5 h-3.5 text-[#D97706]" />
          <span>{simulationTime}</span>
        </div>

        {/* Reset View Button */}
        <button
          onClick={onResetView}
          className="p-1.5 rounded bg-[#272B2A] border border-[#3E4542] text-[#B0B5B2] hover:text-[#F5F3EE] hover:bg-[#323836] transition-colors"
          title="Reset to National India View"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
