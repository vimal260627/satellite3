import React, { useState } from 'react';
import {
  Satellite,
  Activity,
  Radio,
  Clock,
  Shuffle,
  ShieldCheck,
  TrendingUp,
  X
} from 'lucide-react';
import { SatelliteData } from '../../types';

interface SatellitePanelProps {
  satellites: SatelliteData[];
  selectedSatellite: SatelliteData | null;
  onSelectSatellite: (sat: SatelliteData) => void;
  onClose?: () => void;
}

export const SatellitePanel: React.FC<SatellitePanelProps> = ({
  satellites,
  selectedSatellite,
  onSelectSatellite,
  onClose,
}) => {
  const [handoverExecuting, setHandoverExecuting] = useState(false);
  const [handoverCompleted, setHandoverCompleted] = useState(false);

  const sat = selectedSatellite || satellites[6]; // Default to SAT-07 if none selected

  const handleSimulateHandover = () => {
    setHandoverExecuting(true);
    setTimeout(() => {
      setHandoverExecuting(false);
      setHandoverCompleted(true);
      setTimeout(() => setHandoverCompleted(false), 4000);
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col bg-[#FFFFFF] border-l border-[#DDD9D0] text-[#202322] select-none text-xs font-mono overflow-y-auto">
      {/* Header */}
      <div className="px-4 py-3 bg-[#FAF9F5] border-b border-[#DDD9D0] flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded bg-[#D97706] text-white flex items-center justify-center text-xs">
            <Satellite className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="font-bold text-xs uppercase tracking-wider text-[#202322]">
              SATELLITE CONSTELLATION TELEMETRY
            </h2>
            <p className="text-[10px] text-[#767B78]">
              AstraGrid-24 LEO Orbiter Fleet (550 km Sun-Synchronous)
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
        {/* Selected Satellite Telemetry Card */}
        <div className="p-3.5 bg-[#FAF9F5] border border-[#DDD9D0] rounded space-y-3">
          <div className="flex items-center justify-between border-b border-[#EAE6DD] pb-2">
            <div>
              <div className="text-sm font-bold text-[#D97706]">{sat.id} — {sat.name}</div>
              <div className="text-[10px] text-[#767B78]">Band: {sat.band}-band Transponders</div>
            </div>
            <span className="text-[10px] bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC] px-2 py-0.5 rounded font-bold">
              {sat.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-white rounded border border-[#E5E1D8]">
              <span className="text-[9px] text-[#767B78] block">ORBITAL ALTITUDE</span>
              <span className="text-sm font-bold text-[#202322]">{sat.altitudeKm} km</span>
            </div>
            <div className="p-2 bg-white rounded border border-[#E5E1D8]">
              <span className="text-[9px] text-[#767B78] block">ORBITAL VELOCITY</span>
              <span className="text-sm font-bold text-[#202322]">{sat.velocityKmS} km/s</span>
            </div>
            <div className="p-2 bg-white rounded border border-[#E5E1D8]">
              <span className="text-[9px] text-[#767B78] block">TRANSPONDER CAPACITY</span>
              <span className="text-sm font-bold text-[#202322]">{sat.capacityGbps} Gbps</span>
            </div>
            <div className="p-2 bg-white rounded border border-[#E5E1D8]">
              <span className="text-[9px] text-[#767B78] block">DOWNLINK LATENCY</span>
              <span className="text-sm font-bold text-[#15803D]">{sat.latencyMs} ms</span>
            </div>
          </div>

          {/* Current Load & Utilization */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px]">
              <span className="text-[#767B78]">CONCURRENT BEAM UTILIZATION:</span>
              <span className="font-bold text-[#202322]">{sat.currentLoadPct}%</span>
            </div>
            <div className="w-full bg-[#E5E1D8] h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  sat.currentLoadPct > 80 ? 'bg-[#DC2626]' : 'bg-[#D97706]'
                }`}
                style={{ width: `${sat.currentLoadPct}%` }}
              />
            </div>
          </div>

          <div className="space-y-1 text-[11px] pt-1 border-t border-[#EAE6DD]">
            <div className="flex justify-between">
              <span className="text-[#767B78]">Footprint Coverage:</span>
              <span className="font-medium text-[#202322]">1.2 million km²</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#767B78]">Serving Target Beam:</span>
              <span className="font-medium text-[#202322]">{sat.servingBeam || 'India Subcontinent Arc'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#767B78]">Active Ground Users:</span>
              <span className="font-medium text-[#202322]">{sat.activeUsers.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#767B78]">Received Signal (C/N0):</span>
              <span className="font-medium text-[#202322]">{sat.signalDbm} dBm</span>
            </div>
          </div>
        </div>

        {/* LEO Handover Prediction Section */}
        <div className="p-3.5 bg-[#FAF9F5] border border-[#DDD9D0] rounded space-y-2.5">
          <div className="flex items-center justify-between border-b border-[#EAE6DD] pb-1.5">
            <div className="flex items-center space-x-1.5 font-bold text-xs text-[#202322]">
              <Shuffle className="w-3.5 h-3.5 text-[#D97706]" />
              <span>SATELLITE HANDOVER SIMULATION</span>
            </div>
            <span className="text-[9px] bg-[#FEF3C7] text-[#B45309] px-1.5 py-0.5 rounded font-bold">
              PREDICTED
            </span>
          </div>

          <p className="text-[10px] text-[#606462]">
            Simulates non-disruptive make-before-break inter-satellite beam handovers across moving orbital slots.
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-white rounded border border-[#E5E1D8]">
              <div className="text-[9px] text-[#767B78]">CURRENT SERVING</div>
              <div className="font-bold text-[#DC2626]">SAT-12 (Moving Out)</div>
              <div className="text-[10px] text-[#767B78]">Elev: 21.4° • Elevating Down</div>
            </div>
            <div className="p-2 bg-white rounded border border-[#E5E1D8]">
              <div className="text-[9px] text-[#767B78]">TARGET ACQUIRING</div>
              <div className="font-bold text-[#15803D]">SAT-15 (Approaching)</div>
              <div className="text-[10px] text-[#767B78]">Elev: 46.8° • Signal: -71 dBm</div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] p-2 bg-white rounded border border-[#E5E1D8]">
            <span className="text-[#767B78] flex items-center space-x-1">
              <Clock className="w-3 h-3 text-[#D97706]" />
              <span>Time to Handover:</span>
            </span>
            <span className="font-mono font-bold text-[#202322]">00:02:14</span>
          </div>

          <div className="flex items-center justify-between text-[11px] px-1">
            <span className="text-[#767B78]">Relative Signal Margin:</span>
            <span className="font-mono font-bold text-[#15803D]">+3.2 dB (Acquiring)</span>
          </div>

          {handoverExecuting ? (
            <div className="p-2 rounded bg-[#1C1F1E] text-white text-center font-mono text-[11px] space-y-1">
              <div className="text-[#D97706] font-bold">EXECUTING HANDOVER...</div>
              <div className="text-[10px] text-[#A7ABA8]">SAT-12 → SAT-15 (Beam Phase-Locked)</div>
            </div>
          ) : handoverCompleted ? (
            <div className="p-2 rounded bg-[#DCFCE7] border border-[#86EFAC] text-[#14532D] text-center font-mono text-[11px] font-bold">
              ✓ HANDOVER COMPLETED (0 PACKET LOSS)
            </div>
          ) : (
            <button
              onClick={handleSimulateHandover}
              className="w-full py-2 bg-[#202322] hover:bg-[#323635] text-white rounded font-mono text-[11px] font-semibold transition-colors flex items-center justify-center space-x-1.5"
            >
              <Shuffle className="w-3 h-3 text-[#D97706]" />
              <span>TRIGGER IMMEDIATE HANDOVER</span>
            </button>
          )}
        </div>

        {/* Constellation Fleet Quick Selector */}
        <div className="p-3 bg-[#FAF9F5] border border-[#DDD9D0] rounded space-y-2">
          <div className="font-semibold text-xs text-[#202322]">
            CONSTELLATION FLEET (24 ACTIVE LEO)
          </div>
          <div className="grid grid-cols-4 gap-1 max-h-48 overflow-y-auto pr-1">
            {satellites.map((s) => (
              <button
                key={s.id}
                onClick={() => onSelectSatellite(s)}
                className={`p-1.5 rounded text-[10px] font-mono border text-center transition-colors ${
                  sat.id === s.id
                    ? 'bg-[#D97706] text-white border-[#B45309] font-bold'
                    : 'bg-white text-[#202322] border-[#E5E1D8] hover:bg-[#EFECE6]'
                }`}
              >
                <div>{s.id}</div>
                <div className="text-[8px] opacity-75">{s.currentLoadPct}%</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
