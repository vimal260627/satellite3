import React from 'react';
import {
  PieChart,
  BarChart2,
  TrendingUp,
  ShieldCheck,
  Activity,
  Layers,
  Clock,
  Users,
  Mountain,
  X
} from 'lucide-react';

interface AnalyticsKpiPanelProps {
  onClose?: () => void;
}

export const AnalyticsKpiPanel: React.FC<AnalyticsKpiPanelProps> = ({ onClose }) => {
  return (
    <div className="h-full flex flex-col bg-[#FFFFFF] border-l border-[#DDD9D0] text-[#202322] select-none text-xs font-mono overflow-y-auto">
      {/* Header */}
      <div className="px-4 py-3 bg-[#FAF9F5] border-b border-[#DDD9D0] flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded bg-[#202322] text-[#F5F3EE] flex items-center justify-center text-xs">
            <PieChart className="w-3.5 h-3.5 text-[#D97706]" />
          </div>
          <div>
            <h2 className="font-bold text-xs uppercase tracking-wider text-[#202322]">
              NATIONAL PERFORMANCE ANALYTICS
            </h2>
            <p className="text-[10px] text-[#767B78]">
              Simulated Digital Twin Performance Metrics
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
        {/* Core Availability Index */}
        <div className="p-3.5 bg-[#FAF9F5] border border-[#DDD9D0] rounded space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-[#202322]">GRID RELIABILITY & RESILIENCE</span>
            <span className="text-[9px] bg-[#DCFCE7] text-[#15803D] px-1.5 py-0.5 rounded font-bold">
              99.98% HYBRID
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="p-2 bg-white rounded border border-[#E5E1D8]">
              <span className="text-[9px] text-[#767B78] block">PACKET DELIVERY RATIO</span>
              <span className="text-sm font-bold text-[#15803D]">99.94%</span>
            </div>
            <div className="p-2 bg-white rounded border border-[#E5E1D8]">
              <span className="text-[9px] text-[#767B78] block">FAILOVER RESTORATION</span>
              <span className="text-sm font-bold text-[#202322]">&lt; 14 ms</span>
            </div>
          </div>
        </div>

        {/* Latency Comparison Matrix */}
        <div className="p-3.5 bg-[#FAF9F5] border border-[#DDD9D0] rounded space-y-2.5">
          <div className="font-bold text-xs text-[#202322] border-b border-[#EAE6DD] pb-1 flex items-center justify-between">
            <span>LATENCY BENCHMARKS</span>
            <span className="text-[10px] text-[#767B78]">ROUND-TRIP TIME (ms)</span>
          </div>

          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-[10px] mb-0.5">
                <span className="text-[#7C3AED]">BharatNet Optical DWDM</span>
                <span className="font-bold">14 ms</span>
              </div>
              <div className="w-full bg-[#E5E1D8] h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-[#7C3AED]" style={{ width: '14%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] mb-0.5">
                <span className="text-[#16A34A]">Cellular 4G/5G Macro Base</span>
                <span className="font-bold">36 ms</span>
              </div>
              <div className="w-full bg-[#E5E1D8] h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-[#16A34A]" style={{ width: '36%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] mb-0.5">
                <span className="text-[#D97706]">AstraGrid LEO Satellite (550 km)</span>
                <span className="font-bold">44 ms</span>
              </div>
              <div className="w-full bg-[#E5E1D8] h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-[#D97706]" style={{ width: '44%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] mb-0.5">
                <span className="text-[#888D8B]">Legacy GEO Satellite (35,786 km)</span>
                <span className="font-bold text-[#DC2626]">580 ms</span>
              </div>
              <div className="w-full bg-[#E5E1D8] h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-[#DC2626]" style={{ width: '100%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Unserved Population by Difficult Terrain */}
        <div className="p-3.5 bg-[#FAF9F5] border border-[#DDD9D0] rounded space-y-2">
          <div className="font-bold text-xs text-[#202322] border-b border-[#EAE6DD] pb-1 flex items-center justify-between">
            <span>UNSERVED POPULATION TARGETING</span>
            <span className="text-[10px] text-[#767B78]">31.8M TOTAL</span>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between p-1.5 bg-white rounded border border-[#E5E1D8]">
              <span className="text-[#555A57]">Himalayan Alpine Valleys (Leh/Spiti/Tawang):</span>
              <span className="font-bold text-[#DC2626]">11.4M (36%)</span>
            </div>
            <div className="flex justify-between p-1.5 bg-white rounded border border-[#E5E1D8]">
              <span className="text-[#555A57]">Dense Forest & Tribal Plateaus (Bastar/Ghats):</span>
              <span className="font-bold text-[#DC2626]">12.2M (38%)</span>
            </div>
            <div className="flex justify-between p-1.5 bg-white rounded border border-[#E5E1D8]">
              <span className="text-[#555A57]">Desert Arid Zone (Thar/Jaisalmer):</span>
              <span className="font-bold text-[#EA580C]">5.1M (16%)</span>
            </div>
            <div className="flex justify-between p-1.5 bg-white rounded border border-[#E5E1D8]">
              <span className="text-[#555A57]">Tidal Delta & Islands (Sundarbans/Andaman):</span>
              <span className="font-bold text-[#EA580C]">3.1M (10%)</span>
            </div>
          </div>
        </div>

        <div className="p-2.5 rounded bg-[#EFECE6] border border-[#DDD9D0] text-[9px] text-[#606462] font-mono text-center">
          SIMULATED METRICS • GENERATED BY DETERMINISTIC DIGITAL TWIN ENGINE
        </div>
      </div>
    </div>
  );
};
