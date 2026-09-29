import React from 'react';
import {
  Wifi,
  Server,
  Radio,
  CheckCircle2,
  AlertCircle,
  Activity,
  Zap,
  Mountain,
  Shield,
  Layers,
  X
} from 'lucide-react';

interface ConnectivityTriadPanelProps {
  onClose?: () => void;
}

export const ConnectivityTriadPanel: React.FC<ConnectivityTriadPanelProps> = ({ onClose }) => {
  return (
    <div className="h-full flex flex-col bg-[#FFFFFF] border-l border-[#DDD9D0] text-[#202322] select-none text-xs font-mono overflow-y-auto">
      {/* Header */}
      <div className="px-4 py-3 bg-[#FAF9F5] border-b border-[#DDD9D0] flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded bg-[#202322] text-[#F5F3EE] flex items-center justify-center text-xs">
            <Wifi className="w-3.5 h-3.5 text-[#D97706]" />
          </div>
          <div>
            <h2 className="font-bold text-xs uppercase tracking-wider text-[#202322]">
              HYBRID CONNECTIVITY TRIAD
            </h2>
            <p className="text-[10px] text-[#767B78]">
              Multi-Layer Integrated Network Architecture
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
        {/* Layer 1: LEO Satellite */}
        <div className="p-3.5 bg-[#FAF9F5] border border-[#DDD9D0] rounded space-y-2">
          <div className="flex items-center justify-between border-b border-[#EAE6DD] pb-1.5">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 bg-[#D97706] rounded-xs" />
              <span className="font-bold text-xs text-[#D97706]">LAYER 1: LEO SATELLITE CONSTELLATION</span>
            </div>
            <span className="text-[9px] bg-[#FEF3C7] text-[#B45309] px-1.5 py-0.5 rounded font-bold">
              ORBITAL
            </span>
          </div>

          <p className="text-[10px] text-[#606462] leading-relaxed">
            24 satellites in 550 km low-Earth orbit. Delivers non-line-of-sight coverage across alpine valleys, islands, and border frontiers where terrestrial fiber trenching is prohibitive.
          </p>

          <div className="grid grid-cols-3 gap-1.5 text-[10px] pt-1">
            <div className="p-1.5 bg-white rounded border border-[#E5E1D8]">
              <span className="text-[9px] text-[#767B78] block">LATENCY</span>
              <span className="font-bold text-[#15803D]">38 - 56 ms</span>
            </div>
            <div className="p-1.5 bg-white rounded border border-[#E5E1D8]">
              <span className="text-[9px] text-[#767B78] block">TERRAIN FIT</span>
              <span className="font-bold text-[#D97706]">OPTIMAL</span>
            </div>
            <div className="p-1.5 bg-white rounded border border-[#E5E1D8]">
              <span className="text-[9px] text-[#767B78] block">BAND</span>
              <span className="font-bold text-[#202322]">Ka / Ku</span>
            </div>
          </div>
        </div>

        {/* Layer 2: Optical Fiber */}
        <div className="p-3.5 bg-[#FAF9F5] border border-[#DDD9D0] rounded space-y-2">
          <div className="flex items-center justify-between border-b border-[#EAE6DD] pb-1.5">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 bg-[#7C3AED] rounded-xs" />
              <span className="font-bold text-xs text-[#7C3AED]">LAYER 2: BHARATNET OPTICAL DWDM</span>
            </div>
            <span className="text-[9px] bg-[#FAF5FF] text-[#6B21A8] border border-[#E9D5FF] px-1.5 py-0.5 rounded font-bold">
              TERRESTRIAL
            </span>
          </div>

          <p className="text-[10px] text-[#606462] leading-relaxed">
            National high-capacity optical backbones and subsea cables (CANI). Primary carrier for dense metropolitan and regional district aggregations with sub-20ms round trips.
          </p>

          <div className="grid grid-cols-3 gap-1.5 text-[10px] pt-1">
            <div className="p-1.5 bg-white rounded border border-[#E5E1D8]">
              <span className="text-[9px] text-[#767B78] block">CAPACITY</span>
              <span className="font-bold text-[#7C3AED]">Up to 800 Gbps</span>
            </div>
            <div className="p-1.5 bg-white rounded border border-[#E5E1D8]">
              <span className="text-[9px] text-[#767B78] block">LATENCY</span>
              <span className="font-bold text-[#15803D]">12 - 28 ms</span>
            </div>
            <div className="p-1.5 bg-white rounded border border-[#E5E1D8]">
              <span className="text-[9px] text-[#767B78] block">VULNERABILITY</span>
              <span className="font-bold text-[#DC2626]">Landslides</span>
            </div>
          </div>
        </div>

        {/* Layer 3: Cellular Macro Sites */}
        <div className="p-3.5 bg-[#FAF9F5] border border-[#DDD9D0] rounded space-y-2">
          <div className="flex items-center justify-between border-b border-[#EAE6DD] pb-1.5">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 bg-[#16A34A] rounded-xs" />
              <span className="font-bold text-xs text-[#16A34A]">LAYER 3: 4G / 5G CELLULAR MESH</span>
            </div>
            <span className="text-[9px] bg-[#DCFCE7] text-[#15803D] px-1.5 py-0.5 rounded font-bold">
              LAST-MILE
            </span>
          </div>

          <p className="text-[10px] text-[#606462] leading-relaxed">
            Sub-6 GHz and mmWave radio access networks. Delivers high-speed distribution to user mobile handsets and local wireless customer premise equipment (CPE).
          </p>

          <div className="grid grid-cols-3 gap-1.5 text-[10px] pt-1">
            <div className="p-1.5 bg-white rounded border border-[#E5E1D8]">
              <span className="text-[9px] text-[#767B78] block">RADIUS</span>
              <span className="font-bold text-[#202322]">8 - 22 km</span>
            </div>
            <div className="p-1.5 bg-white rounded border border-[#E5E1D8]">
              <span className="text-[9px] text-[#767B78] block">BACKHAUL</span>
              <span className="font-bold text-[#16A34A]">Fiber / VSAT</span>
            </div>
            <div className="p-1.5 bg-white rounded border border-[#E5E1D8]">
              <span className="text-[9px] text-[#767B78] block">SIGNAL</span>
              <span className="font-bold text-[#15803D]">Macro 5G</span>
            </div>
          </div>
        </div>

        {/* Dynamic Switching Rules */}
        <div className="p-3.5 bg-white border border-[#DDD9D0] rounded space-y-2">
          <div className="font-bold text-xs text-[#202322]">
            AUTONOMOUS BEARER SELECTION POLICY
          </div>

          <div className="space-y-1.5 text-[10px]">
            <div className="p-2 rounded bg-[#FAF9F5] border border-[#E5E1D8]">
              <div className="font-bold text-[#202322]">Rule 1: Optical Primary with Instant Satellite Failover</div>
              <div className="text-[#606462]">If terrestrial optical loss &gt; 18 dB, switch high-priority telemedicine & governance packets to LEO in &lt; 15 ms.</div>
            </div>

            <div className="p-2 rounded bg-[#FAF9F5] border border-[#E5E1D8]">
              <div className="font-bold text-[#202322]">Rule 2: Remote Terrain Satellite First</div>
              <div className="text-[#606462]">In elevation &gt; 2,000m or forest canopy, establish direct solar-powered micro-VSAT with Wi-Fi 6 localized distribution.</div>
            </div>

            <div className="p-2 rounded bg-[#FAF9F5] border border-[#E5E1D8]">
              <div className="font-bold text-[#202322]">Rule 3: Surge Event Bandwidth Allocation</div>
              <div className="text-[#606462]">During school online exams or disaster relief, dynamically steer adjacent LEO spot beams to inject up to 320 Mbps burst capacity.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
