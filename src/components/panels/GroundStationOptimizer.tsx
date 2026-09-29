import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Zap,
  Users,
  Mountain,
  Sun,
  CloudRain,
  X
} from 'lucide-react';
import { GroundStation } from '../../types';

interface GroundStationOptimizerProps {
  groundStations: GroundStation[];
  onSelectStation: (gs: GroundStation) => void;
  onClose?: () => void;
}

export const GroundStationOptimizer: React.FC<GroundStationOptimizerProps> = ({
  groundStations,
  onSelectStation,
  onClose,
}) => {
  const [optimized, setOptimized] = useState(false);
  const [optimizing, setOptimizing] = useState(false);

  const handleOptimize = () => {
    setOptimizing(true);
    setTimeout(() => {
      setOptimizing(false);
      setOptimized(true);
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col bg-[#FFFFFF] border-l border-[#DDD9D0] text-[#202322] select-none text-xs font-mono overflow-y-auto">
      {/* Header */}
      <div className="px-4 py-3 bg-[#FAF9F5] border-b border-[#DDD9D0] flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded bg-[#202322] text-[#F5F3EE] flex items-center justify-center text-xs">
            <Compass className="w-3.5 h-3.5 text-[#D97706]" />
          </div>
          <div>
            <h2 className="font-bold text-xs uppercase tracking-wider text-[#202322]">
              GROUND STATION OPTIMIZER
            </h2>
            <p className="text-[10px] text-[#767B78]">
              Gateway Placement & Rain-Fade Analysis
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
        {/* Recommendation Summary */}
        <div className="p-3.5 bg-[#FAF9F5] border border-[#DDD9D0] rounded space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-[#202322]">OPTIMIZATION CRITERIA</span>
            <span className="text-[10px] text-[#767B78]">MULTI-VARIABLE ALGORITHM</span>
          </div>
          <p className="text-[10px] text-[#606462] leading-relaxed">
            Evaluates candidate locations against high-elevation angle visibility, atmospheric rain attenuation, proximity to DWDM fiber intersections, and rural population clustering.
          </p>

          {optimizing ? (
            <div className="p-3 rounded bg-[#1C1F1E] text-white text-center font-mono space-y-1">
              <div className="text-[#D97706] font-bold">ANALYZING CANDIDATE COORDINATES...</div>
              <div className="text-[10px] text-[#A7ABA8]">Evaluating rain-fade dB vs Population catchment</div>
            </div>
          ) : (
            <button
              onClick={handleOptimize}
              className="w-full py-2.5 bg-[#202322] hover:bg-[#323635] text-white rounded font-mono text-xs font-bold transition-colors flex items-center justify-center space-x-2"
            >
              <Play className="w-3.5 h-3.5 fill-current text-[#D97706]" />
              <span>OPTIMIZE GROUND STATIONS</span>
            </button>
          )}
        </div>

        {/* Selected Recommendations Post-Optimization */}
        {optimized && (
          <div className="p-3.5 bg-[#DCFCE7]/50 border border-[#86EFAC] rounded space-y-2 text-[#14532D]">
            <div className="flex items-center justify-between">
              <div className="font-bold text-xs flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
                <span>RECOMMENDED GROUND STATIONS</span>
              </div>
              <span className="text-[9px] bg-[#15803D] text-white px-1.5 py-0.5 rounded font-bold">
                OPTIMAL
              </span>
            </div>

            <div className="text-[11px] space-y-1">
              <div className="font-bold text-[#15803D]">
                • GS-C2 Nagpur Central Hub (Suitability: 94%)
              </div>
              <div className="text-[10px] text-[#166534] pl-3">
                Zero-mile geographic center, optimal national latency to all borders.
              </div>
              <div className="font-bold text-[#15803D]">
                • GS-C4 Jodhpur Arid Zone Station (Suitability: 91%)
              </div>
              <div className="text-[10px] text-[#166534] pl-3">
                340+ clear sky days, zero rain fade risk for Ka-band feeder links.
              </div>
            </div>

            <div className="pt-2 border-t border-[#86EFAC]/50 flex justify-between text-[11px] font-bold">
              <span>Estimated Population Served:</span>
              <span>1.82 Million</span>
            </div>
          </div>
        )}

        {/* All Candidate & Operational Earth Stations */}
        <div className="space-y-2">
          <div className="font-bold text-xs text-[#202322] flex items-center justify-between">
            <span>STATIONS STATUS DIRECTORY</span>
            <span className="text-[10px] text-[#767B78]">{groundStations.length} SITES</span>
          </div>

          <div className="space-y-2">
            {groundStations.map((gs) => {
              const isSelectedCandidate =
                optimized && (gs.id === 'gs-c2-nagpur' || gs.id === 'gs-c4-jodhpur');
              const isUnsuitable = gs.status === 'UNSUITABLE';
              const isCandidate = gs.status === 'CANDIDATE';

              return (
                <div
                  key={gs.id}
                  onClick={() => onSelectStation(gs)}
                  className={`p-2.5 rounded border transition-colors cursor-pointer ${
                    isSelectedCandidate
                      ? 'bg-[#DCFCE7]/40 border-[#86EFAC]'
                      : isUnsuitable
                      ? 'bg-[#FEE2E2]/30 border-[#FCA5A5]'
                      : 'bg-white border-[#E5E1D8] hover:bg-[#F5F3EE]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-bold text-[11px] text-[#202322]">{gs.name}</div>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                        isSelectedCandidate
                          ? 'bg-[#DCFCE7] text-[#15803D]'
                          : isUnsuitable
                          ? 'bg-[#FEE2E2] text-[#DC2626]'
                          : isCandidate
                          ? 'bg-[#E5E7EB] text-[#4B5563]'
                          : 'bg-[#EFECE6] text-[#202322]'
                      }`}
                    >
                      {isSelectedCandidate ? 'SELECTED' : gs.status}
                    </span>
                  </div>

                  <div className="text-[10px] text-[#606462] mb-1.5 leading-snug">
                    {gs.notes}
                  </div>

                  <div className="grid grid-cols-3 gap-1 text-[9px] text-[#555A57]">
                    <div className="flex items-center space-x-1">
                      <Sun className="w-2.5 h-2.5 text-[#D97706]" />
                      <span>Elev: {gs.elevationAngleDeg}°</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CloudRain className="w-2.5 h-2.5 text-[#0284C7]" />
                      <span>{gs.weatherCondition}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-2.5 h-2.5 text-[#15803D]" />
                      <span>{gs.estimatedPopServedMillions}M Pop</span>
                    </div>
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
