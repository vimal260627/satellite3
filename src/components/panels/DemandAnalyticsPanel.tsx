import React, { useState } from 'react';
import {
  BarChart2,
  TrendingUp,
  Activity,
  Users,
  Clock,
  Zap,
  HeartPulse,
  Briefcase,
  X
} from 'lucide-react';
import { generateHourlyDemand } from '../../simulation/simulationEngine';

interface DemandAnalyticsPanelProps {
  onClose?: () => void;
}

export const DemandAnalyticsPanel: React.FC<DemandAnalyticsPanelProps> = ({ onClose }) => {
  const [baseDemand, setBaseDemand] = useState(60);
  const [peakDemand, setPeakDemand] = useState(480);
  const [schoolExamSpike, setSchoolExamSpike] = useState(false);
  const [telemedicinePriority, setTelemedicinePriority] = useState(false);
  const [commercialMultiplier, setCommercialMultiplier] = useState(1.0);

  const demandData = generateHourlyDemand(
    baseDemand * commercialMultiplier,
    peakDemand * commercialMultiplier,
    schoolExamSpike,
    telemedicinePriority
  );

  const maxVal = Math.max(...demandData.map((d) => d.demand), peakDemand * 1.3);

  return (
    <div className="h-full flex flex-col bg-[#FFFFFF] border-l border-[#DDD9D0] text-[#202322] select-none text-xs font-mono overflow-y-auto">
      {/* Header */}
      <div className="px-4 py-3 bg-[#FAF9F5] border-b border-[#DDD9D0] flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded bg-[#202322] text-[#F5F3EE] flex items-center justify-center text-xs">
            <BarChart2 className="w-3.5 h-3.5 text-[#D97706]" />
          </div>
          <div>
            <h2 className="font-bold text-xs uppercase tracking-wider text-[#202322]">
              BANDWIDTH DEMAND PREDICTION
            </h2>
            <p className="text-[10px] text-[#767B78]">
              24-Hour Diurnal Traffic & Surge Simulation
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
        {/* Interactive Demand Bar Chart */}
        <div className="p-3.5 bg-[#FAF9F5] border border-[#DDD9D0] rounded space-y-3">
          <div className="flex items-center justify-between border-b border-[#EAE6DD] pb-1.5">
            <span className="font-bold text-xs text-[#202322]">
              DIURNAL BANDWIDTH LOAD PROFILE
            </span>
            <span className="text-[10px] text-[#767B78]">UNITS: Mbps</span>
          </div>

          {/* Custom SVG / Pure CSS Bar Visualization */}
          <div className="pt-2">
            <div className="h-44 flex items-end justify-between gap-1.5 border-b border-[#CBC5B7] pb-1 px-1">
              {demandData.map((d) => {
                const heightPct = Math.round((d.demand / maxVal) * 100);
                const isPeak = d.demand > peakDemand * 0.9;
                return (
                  <div key={d.hour} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                    {/* Tooltip */}
                    <div className="absolute -top-7 hidden group-hover:flex bg-[#202322] text-white px-1.5 py-0.5 rounded text-[9px] font-mono whitespace-nowrap z-20">
                      {d.demand} Mbps
                    </div>

                    <div
                      className={`w-full rounded-t-xs transition-all duration-300 ${
                        isPeak ? 'bg-[#DC2626]' : 'bg-[#D97706]'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                );
              })}
            </div>

            {/* X-axis Hour Labels */}
            <div className="flex justify-between text-[9px] text-[#767B78] font-mono pt-1.5 px-0.5">
              {demandData.map((d) => (
                <span key={d.hour}>{d.hour.split(':')[0]}h</span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-[#767B78] pt-1 border-t border-[#EAE6DD]">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 bg-[#D97706] rounded-xs" />
              <span>Standard Traffic</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 bg-[#DC2626] rounded-xs" />
              <span>Surge / Critical Exam Peak</span>
            </div>
          </div>
        </div>

        {/* Demand Scenario Parameters & Modifiers */}
        <div className="p-3.5 bg-[#FAF9F5] border border-[#DDD9D0] rounded space-y-3">
          <div className="font-bold text-xs text-[#202322] border-b border-[#EAE6DD] pb-1.5">
            DYNAMIC DEMAND MODIFIERS
          </div>

          {/* Peak Bandwidth Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-[#767B78]">Peak Baseline Demand:</span>
              <span className="font-bold text-[#202322]">{peakDemand} Mbps</span>
            </div>
            <input
              type="range"
              min="100"
              max="1000"
              step="50"
              value={peakDemand}
              onChange={(e) => setPeakDemand(Number(e.target.value))}
              className="w-full accent-[#D97706] cursor-pointer"
            />
          </div>

          {/* Commercial Multiplier */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-[#767B78]">Enterprise / Commercial Activity:</span>
              <span className="font-bold text-[#202322]">{commercialMultiplier.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={commercialMultiplier}
              onChange={(e) => setCommercialMultiplier(Number(e.target.value))}
              className="w-full accent-[#D97706] cursor-pointer"
            />
          </div>

          {/* Event Triggers */}
          <div className="space-y-2 pt-2 border-t border-[#EAE6DD]">
            <div className="flex items-center justify-between p-2 bg-white rounded border border-[#E5E1D8]">
              <div className="flex items-center space-x-2">
                <Zap className="w-3.5 h-3.5 text-[#0284C7]" />
                <div>
                  <div className="font-bold text-[11px]">School Online Exam Surge</div>
                  <div className="text-[9px] text-[#767B78]">+35% bandwidth spike at 10h & 12h</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={schoolExamSpike}
                onChange={() => setSchoolExamSpike(!schoolExamSpike)}
                className="rounded border-[#CBC5B7] text-[#D97706] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-2 bg-white rounded border border-[#E5E1D8]">
              <div className="flex items-center space-x-2">
                <HeartPulse className="w-3.5 h-3.5 text-[#DC2626]" />
                <div>
                  <div className="font-bold text-[11px]">Telemedicine Critical Session</div>
                  <div className="text-[9px] text-[#767B78]">Reserved QoS channel +25% headroom</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={telemedicinePriority}
                onChange={() => setTelemedicinePriority(!telemedicinePriority)}
                className="rounded border-[#CBC5B7] text-[#DC2626] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Diurnal Summary Stats */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 bg-[#FAF9F5] border border-[#DDD9D0] rounded">
            <span className="text-[9px] text-[#767B78] block">DAILY PEAK LOAD</span>
            <span className="text-sm font-bold text-[#DC2626]">
              {Math.max(...demandData.map((d) => d.demand))} Mbps
            </span>
          </div>
          <div className="p-2.5 bg-[#FAF9F5] border border-[#DDD9D0] rounded">
            <span className="text-[9px] text-[#767B78] block">OFF-PEAK TROUGH</span>
            <span className="text-sm font-bold text-[#15803D]">
              {Math.min(...demandData.map((d) => d.demand))} Mbps
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
