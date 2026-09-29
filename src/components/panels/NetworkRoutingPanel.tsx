import React, { useState } from 'react';
import {
  GitFork,
  Radio,
  Server,
  Wifi,
  Globe,
  ArrowDown,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Activity,
  Layers,
  X
} from 'lucide-react';
import { LocationData } from '../../types';

interface NetworkRoutingPanelProps {
  selectedLocation: LocationData | null;
  onClose?: () => void;
}

export const NetworkRoutingPanel: React.FC<NetworkRoutingPanelProps> = ({
  selectedLocation,
  onClose,
}) => {
  const [activeRoutingMode, setActiveRoutingMode] = useState<'hybrid' | 'satellite' | 'terrestrial'>('hybrid');

  const locName = selectedLocation ? selectedLocation.name : 'Kaza (Spiti Valley)';
  const isRemote = selectedLocation ? selectedLocation.type === 'village' : true;

  return (
    <div className="h-full flex flex-col bg-[#FFFFFF] border-l border-[#DDD9D0] text-[#202322] select-none text-xs font-mono overflow-y-auto">
      {/* Header */}
      <div className="px-4 py-3 bg-[#FAF9F5] border-b border-[#DDD9D0] flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded bg-[#202322] text-[#F5F3EE] flex items-center justify-center text-xs">
            <GitFork className="w-3.5 h-3.5 text-[#7C3AED]" />
          </div>
          <div>
            <h2 className="font-bold text-xs uppercase tracking-wider text-[#202322]">
              END-TO-END NETWORK ROUTING
            </h2>
            <p className="text-[10px] text-[#767B78]">
              Dynamic Hop-by-Hop Packet Trajectory
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
        {/* Routing Mode Selector */}
        <div className="flex items-center justify-between p-1 bg-[#EFECE6] rounded border border-[#DDD9D0]">
          <button
            onClick={() => setActiveRoutingMode('hybrid')}
            className={`flex-1 py-1.5 rounded text-[10px] font-bold transition-colors ${
              activeRoutingMode === 'hybrid'
                ? 'bg-[#FFFFFF] text-[#202322] shadow-xs'
                : 'text-[#606462] hover:text-[#202322]'
            }`}
          >
            HYBRID BONDED
          </button>
          <button
            onClick={() => setActiveRoutingMode('satellite')}
            className={`flex-1 py-1.5 rounded text-[10px] font-bold transition-colors ${
              activeRoutingMode === 'satellite'
                ? 'bg-[#FFFFFF] text-[#202322] shadow-xs'
                : 'text-[#606462] hover:text-[#202322]'
            }`}
          >
            LEO SATELLITE
          </button>
          <button
            onClick={() => setActiveRoutingMode('terrestrial')}
            className={`flex-1 py-1.5 rounded text-[10px] font-bold transition-colors ${
              activeRoutingMode === 'terrestrial'
                ? 'bg-[#FFFFFF] text-[#202322] shadow-xs'
                : 'text-[#606462] hover:text-[#202322]'
            }`}
          >
            TERRESTRIAL ONLY
          </button>
        </div>

        {/* AI Network Orchestrator Live Decision Box */}
        <div className="p-3.5 bg-[#FAF9F5] border border-[#DDD9D0] rounded space-y-2">
          <div className="flex items-center justify-between border-b border-[#EAE6DD] pb-1.5">
            <div className="flex items-center space-x-1.5 font-bold text-xs text-[#202322]">
              <Cpu className="w-3.5 h-3.5 text-[#D97706]" />
              <span>AI ORCHESTRATION ENGINE</span>
            </div>
            <span className="text-[9px] bg-[#DCFCE7] text-[#15803D] px-1.5 py-0.5 rounded font-bold">
              OPTIMIZED
            </span>
          </div>

          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-[#767B78]">Focal Region:</span>
              <span className="font-bold text-[#202322]">{locName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#767B78]">Selected Bearer:</span>
              <span className="font-bold text-[#D97706]">
                {activeRoutingMode === 'hybrid'
                  ? 'LEO SATELLITE + LOCAL 4G MESH'
                  : activeRoutingMode === 'satellite'
                  ? 'DIRECT VSAT SATELLITE LINK'
                  : 'OPTICAL DWDM BACKBONE'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#767B78]">Estimated Round-Trip:</span>
              <span className="font-bold text-[#15803D]">
                {activeRoutingMode === 'terrestrial' ? '18 ms' : '44 ms'}
              </span>
            </div>
          </div>

          <p className="text-[10px] text-[#606462] leading-relaxed pt-1 border-t border-[#EAE6DD]">
            Decision Rationale: Rugged terrain elevates terrestrial fiber failure probability. Multipath load balancing directs high-priority packets (health, governance) through dedicated Ku/Ka LEO transponders.
          </p>
        </div>

        {/* Visual Hop-by-Hop Path Flow */}
        <div className="p-3.5 bg-white border border-[#DDD9D0] rounded space-y-3">
          <div className="font-bold text-xs text-[#202322]">
            PACKET TRAVERSAL ARCHITECTURE
          </div>

          <div className="space-y-2 relative">
            {/* Hop 1: End User */}
            <div className="p-2 bg-[#FAF9F5] border border-[#E5E1D8] rounded flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded bg-[#202322] text-white flex items-center justify-center text-[10px]">
                  👤
                </div>
                <div>
                  <div className="font-bold text-[11px]">01. LOCAL SUBSCRIBERS / CLINICS</div>
                  <div className="text-[9px] text-[#767B78]">Local Wi-Fi 6 / CPE Handset • 5.8 GHz</div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-[#15803D]">140 Mbps</span>
            </div>

            <div className="flex justify-center text-[#8C918E]">
              <ArrowDown className="w-3.5 h-3.5" />
            </div>

            {/* Hop 2: Regional Terminal / Wireless CPE */}
            <div className="p-2 bg-[#FAF9F5] border border-[#E5E1D8] rounded flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded bg-[#16A34A] text-white flex items-center justify-center text-[10px]">
                  <Radio className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-[11px]">02. EDGE WIRELESS ACCESS / MICRO-VSAT</div>
                  <div className="text-[9px] text-[#767B78]">Phased Array Beamforming • Elevation 54°</div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-[#16A34A]">4G / Ku Band</span>
            </div>

            <div className="flex justify-center text-[#8C918E]">
              <ArrowDown className="w-3.5 h-3.5" />
            </div>

            {/* Hop 3: LEO Satellite Orbiter */}
            <div className="p-2 bg-[#FEF3C7] border border-[#FDE68A] rounded flex items-center justify-between text-[#78350F]">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded bg-[#D97706] text-white flex items-center justify-center text-[10px]">
                  <Wifi className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-[11px] text-[#B45309]">03. LEO ORBITER (SAT-07 / SAT-12)</div>
                  <div className="text-[9px] text-[#92400E]">Altitude: 550 km • Laser Inter-Satellite Link</div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-[#B45309]">20 Gbps</span>
            </div>

            <div className="flex justify-center text-[#8C918E]">
              <ArrowDown className="w-3.5 h-3.5" />
            </div>

            {/* Hop 4: Master Earth Station Gateway */}
            <div className="p-2 bg-[#FAF9F5] border border-[#E5E1D8] rounded flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded bg-[#202322] text-white flex items-center justify-center text-[10px]">
                  📡
                </div>
                <div>
                  <div className="font-bold text-[11px]">04. GATEWAY EARTH STATION (GS-01 / GS-02)</div>
                  <div className="text-[9px] text-[#767B78]">9-Meter Tracking Dish • Clear Sky Ku/Ka Downlink</div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-[#202322]">100 Gbps</span>
            </div>

            <div className="flex justify-center text-[#8C918E]">
              <ArrowDown className="w-3.5 h-3.5" />
            </div>

            {/* Hop 5: National Core & IXP */}
            <div className="p-2 bg-[#FAF5FF] border border-[#E9D5FF] rounded flex items-center justify-between text-[#581C87]">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded bg-[#7C3AED] text-white flex items-center justify-center text-[10px]">
                  <Server className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-[11px] text-[#7C3AED]">05. NATIONAL CORE DWDM & NIXI IXP</div>
                  <div className="text-[9px] text-[#6B21A8]">Delhi / Bengaluru / Mumbai Peering Gateways</div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-[#7C3AED]">Global IP</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
