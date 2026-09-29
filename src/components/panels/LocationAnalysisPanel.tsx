import React, { useState } from 'react';
import {
  MapPin,
  Users,
  Activity,
  Wifi,
  Radio,
  Server,
  Mountain,
  CheckCircle2,
  Cpu,
  ArrowRight,
  TrendingUp,
  Shield,
  X
} from 'lucide-react';
import { LocationData } from '../../types';

interface LocationAnalysisPanelProps {
  location: LocationData;
  isConnected: boolean;
  onConnectRegion: (loc: LocationData) => void;
  onClose: () => void;
}

export const LocationAnalysisPanel: React.FC<LocationAnalysisPanelProps> = ({
  location,
  isConnected,
  onConnectRegion,
  onClose,
}) => {
  const [connectingStep, setConnectingStep] = useState<number | null>(null);

  const isCity = location.type === 'city';

  const handleStartConnect = () => {
    // Multi-step connection simulation
    setConnectingStep(1); // ANALYZING TERRAIN
    setTimeout(() => setConnectingStep(2), 500); // CHECKING INFRASTRUCTURE
    setTimeout(() => setConnectingStep(3), 1000); // SEARCHING SATELLITES
    setTimeout(() => setConnectingStep(4), 1500); // ALLOCATING BANDWIDTH
    setTimeout(() => setConnectingStep(5), 2000); // ESTABLISHING ROUTE
    setTimeout(() => {
      setConnectingStep(null);
      onConnectRegion(location);
    }, 2500);
  };

  return (
    <div className="h-full flex flex-col bg-[#FFFFFF] border-l border-[#DDD9D0] text-[#202322] select-none text-xs font-mono overflow-y-auto">
      {/* Panel Header */}
      <div className="px-4 py-3 bg-[#FAF9F5] border-b border-[#DDD9D0] flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded bg-[#202322] text-[#F5F3EE] flex items-center justify-center text-[10px]">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="font-bold text-xs uppercase tracking-wider text-[#202322]">
              {isCity ? 'CITY NETWORK PROFILE' : 'LOCATION ANALYSIS'}
            </h2>
            <p className="text-[10px] text-[#767B78]">
              {location.name} • {location.district}, {location.state}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded text-[#767B78] hover:text-[#202322] hover:bg-[#EFECE6] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-4 flex-1">
        {/* Connection Status Badge */}
        <div
          className={`p-3 rounded border flex items-center justify-between ${
            isConnected
              ? 'bg-[#DCFCE7]/60 border-[#86EFAC] text-[#14532D]'
              : location.connectivity === 'CRITICAL'
              ? 'bg-[#FEE2E2]/60 border-[#FCA5A5] text-[#7F1D1D]'
              : 'bg-[#FEF3C7]/60 border-[#FDE68A] text-[#78350F]'
          }`}
        >
          <div className="flex items-center space-x-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isConnected ? 'bg-[#15803D]' : location.connectivity === 'CRITICAL' ? 'bg-[#DC2626]' : 'bg-[#D97706]'
              }`}
            />
            <div>
              <div className="font-bold text-xs">
                {isConnected ? 'REGION CONNECTED' : `CONNECTIVITY: ${location.connectivity}`}
              </div>
              <div className="text-[10px] opacity-80">
                {isConnected
                  ? 'Active LEO Satellite link routed via Earth Station'
                  : 'Underserved terrain requiring adaptive hybrid routing'}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold">
              {isConnected ? '96%' : `${location.connectivityScore}%`}
            </div>
            <div className="text-[9px] uppercase">SCORE</div>
          </div>
        </div>

        {/* Demographics & Demand Metrics */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 bg-[#FAF9F5] border border-[#DDD9D0] rounded">
            <div className="text-[10px] text-[#767B78] flex items-center space-x-1">
              <Users className="w-3 h-3 text-[#767B78]" />
              <span>TOTAL POPULATION</span>
            </div>
            <div className="text-sm font-bold text-[#202322] mt-0.5">
              {location.population.toLocaleString()}
            </div>
            <div className="text-[10px] text-[#555A57] mt-0.5">
              Active: {location.activeUsers.toLocaleString()}
            </div>
          </div>

          <div className="p-2.5 bg-[#FAF9F5] border border-[#DDD9D0] rounded">
            <div className="text-[10px] text-[#767B78] flex items-center space-x-1">
              <Activity className="w-3 h-3 text-[#767B78]" />
              <span>CURRENT DEMAND</span>
            </div>
            <div className="text-sm font-bold text-[#202322] mt-0.5">
              {location.currentDemandMbps} Mbps
            </div>
            <div className="text-[10px] text-[#555A57] mt-0.5">
              Peak: {location.peakDemandMbps} Mbps
            </div>
          </div>
        </div>

        {/* Connected vs Unserved Users */}
        <div className="p-3 bg-[#FAF9F5] border border-[#DDD9D0] rounded space-y-1.5">
          <div className="flex justify-between text-[11px]">
            <span className="text-[#767B78]">CONNECTED USERS:</span>
            <span className="font-semibold text-[#15803D]">
              {isConnected
                ? (location.population - 320).toLocaleString()
                : location.connectedUsers.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-[#767B78]">UNSERVED POPULATION:</span>
            <span className={`font-semibold ${isConnected ? 'text-[#15803D]' : 'text-[#DC2626]'}`}>
              {isConnected ? '320' : location.unservedUsers.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-[#E5E1D8] h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${isConnected ? 'bg-[#15803D]' : 'bg-[#EA580C]'}`}
              style={{
                width: isConnected
                  ? '96%'
                  : `${Math.round((location.connectedUsers / location.population) * 100)}%`,
              }}
            />
          </div>
        </div>

        {/* City-Specific Breakdown (if City) */}
        {isCity && location.cityProfile && (
          <div className="p-3 bg-[#FAF9F5] border border-[#DDD9D0] rounded space-y-2.5">
            <div className="font-semibold text-xs text-[#202322] flex items-center justify-between border-b border-[#EAE6DD] pb-1">
              <span>CARRIER INFRASTRUCTURE MIX</span>
              <span className="text-[10px] text-[#767B78]">MULTI-PATH DIVERSITY</span>
            </div>

            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[10px] mb-0.5">
                  <span className="text-[#7C3AED] font-medium flex items-center space-x-1">
                    <Server className="w-2.5 h-2.5" />
                    <span>FIBER BACKBONE</span>
                  </span>
                  <span className="font-bold">{location.cityProfile.fiberPct}%</span>
                </div>
                <div className="w-full bg-[#E5E1D8] h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#7C3AED]" style={{ width: `${location.cityProfile.fiberPct}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] mb-0.5">
                  <span className="text-[#16A34A] font-medium flex items-center space-x-1">
                    <Radio className="w-2.5 h-2.5" />
                    <span>CELLULAR 5G/4G</span>
                  </span>
                  <span className="font-bold">{location.cityProfile.cellularPct}%</span>
                </div>
                <div className="w-full bg-[#E5E1D8] h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#16A34A]" style={{ width: `${location.cityProfile.cellularPct}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] mb-0.5">
                  <span className="text-[#D97706] font-medium flex items-center space-x-1">
                    <Wifi className="w-2.5 h-2.5" />
                    <span>SATELLITE BACKUP (LEO/GEO)</span>
                  </span>
                  <span className="font-bold">{location.cityProfile.satBackupPct}%</span>
                </div>
                <div className="w-full bg-[#E5E1D8] h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#D97706]" style={{ width: `${location.cityProfile.satBackupPct}%` }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Infrastructure & Terrain Breakdown */}
        <div className="p-3 bg-[#FAF9F5] border border-[#DDD9D0] rounded space-y-2">
          <div className="font-semibold text-xs text-[#202322] border-b border-[#EAE6DD] pb-1 flex items-center justify-between">
            <span>INFRASTRUCTURE STATUS</span>
            <span className="text-[10px] text-[#767B78]">TELEMETRY</span>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-[#767B78] flex items-center space-x-1.5">
                <Server className="w-3 h-3 text-[#7C3AED]" />
                <span>Terrestrial Fiber:</span>
              </span>
              <span
                className={`font-semibold ${
                  location.fiberStatus === 'AVAILABLE'
                    ? 'text-[#15803D]'
                    : location.fiberStatus === 'SEVERED'
                    ? 'text-[#DC2626]'
                    : 'text-[#888D8B]'
                }`}
              >
                {location.fiberStatus}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#767B78] flex items-center space-x-1.5">
                <Radio className="w-3 h-3 text-[#16A34A]" />
                <span>Cellular Signal:</span>
              </span>
              <span
                className={`font-semibold ${
                  location.cellularStatus === 'STRONG_5G' || location.cellularStatus === 'GOOD_4G'
                    ? 'text-[#15803D]'
                    : 'text-[#EA580C]'
                }`}
              >
                {location.cellularStatus.replace('_', ' ')}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#767B78] flex items-center space-x-1.5">
                <Wifi className="w-3 h-3 text-[#D97706]" />
                <span>Satellite Visibility:</span>
              </span>
              <span className="font-semibold text-[#D97706]">
                {isConnected ? 'ACTIVE SERVING (SAT-07/12)' : location.satelliteStatus}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-[#EAE6DD]">
              <span className="text-[#767B78] flex items-center space-x-1.5">
                <Mountain className="w-3 h-3 text-[#8A8F8D]" />
                <span>Terrain Difficulty:</span>
              </span>
              <span className="font-semibold text-[#202322]">
                {location.terrainDifficulty} ({location.elevationMeters}m ASL)
              </span>
            </div>
          </div>
        </div>

        {/* Nearby Public Assets */}
        <div className="p-3 bg-[#FAF9F5] border border-[#DDD9D0] rounded">
          <div className="text-[10px] text-[#767B78] uppercase mb-1.5">NEARBY REGIONAL ASSETS</div>
          <div className="grid grid-cols-4 gap-1 text-center">
            <div className="p-1 rounded bg-white border border-[#E5E1D8]">
              <div className="font-bold text-xs">{location.nearby.schools}</div>
              <div className="text-[9px] text-[#767B78]">Schools</div>
            </div>
            <div className="p-1 rounded bg-white border border-[#E5E1D8]">
              <div className="font-bold text-xs">{location.nearby.hospitals}</div>
              <div className="text-[9px] text-[#767B78]">Hospitals</div>
            </div>
            <div className="p-1 rounded bg-white border border-[#E5E1D8]">
              <div className="font-bold text-xs">{location.nearby.towers}</div>
              <div className="text-[9px] text-[#767B78]">Towers</div>
            </div>
            <div className="p-1 rounded bg-white border border-[#E5E1D8]">
              <div className="font-bold text-xs">{location.nearby.groundStationDistanceKm}km</div>
              <div className="text-[9px] text-[#767B78]">Gateway</div>
            </div>
          </div>
        </div>

        {/* AI Orchestrator Recommendation Engine */}
        <div className="p-3 bg-[#FAF9F5] border border-[#DDD9D0] rounded space-y-1.5">
          <div className="flex items-center space-x-1.5 text-[#D97706] font-semibold text-xs">
            <Cpu className="w-3.5 h-3.5" />
            <span>AI ORCHESTRATION ENGINE</span>
          </div>
          <div className="text-[11px] font-bold text-[#202322]">
            {location.recommendedSolution}
          </div>
          <p className="text-[10px] text-[#606462] leading-relaxed">
            {location.recommendationReason}
          </p>
        </div>

        {/* Interactive "CONNECT REGION" Action Button */}
        {!isCity && (
          <div>
            {connectingStep !== null ? (
              <div className="p-3 rounded bg-[#1C1F1E] text-white space-y-2 border border-[#3E4542]">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#D97706] font-bold">ORCHESTRATING ROUTE</span>
                  <span className="status-beacon">● ACTIVE</span>
                </div>
                <div className="space-y-1 text-[11px] font-mono">
                  <div className={connectingStep >= 1 ? 'text-[#16A34A]' : 'text-[#6C716E]'}>
                    {connectingStep >= 1 ? '✓' : '○'} ANALYZING TERRAIN ELEVATION
                  </div>
                  <div className={connectingStep >= 2 ? 'text-[#16A34A]' : 'text-[#6C716E]'}>
                    {connectingStep >= 2 ? '✓' : '○'} CHECKING TERRESTRIAL BACKHAUL
                  </div>
                  <div className={connectingStep >= 3 ? 'text-[#16A34A]' : 'text-[#6C716E]'}>
                    {connectingStep >= 3 ? '✓' : '○'} SEARCHING LEO SATELLITE BEAM
                  </div>
                  <div className={connectingStep >= 4 ? 'text-[#16A34A]' : 'text-[#6C716E]'}>
                    {connectingStep >= 4 ? '✓' : '○'} ALLOCATING DYNAMIC BANDWIDTH
                  </div>
                  <div className={connectingStep >= 5 ? 'text-[#16A34A]' : 'text-[#6C716E]'}>
                    {connectingStep >= 5 ? '✓' : '○'} ROUTING VIA GATEWAY EARTH STATION
                  </div>
                </div>
              </div>
            ) : isConnected ? (
              <div className="p-3 rounded bg-[#DCFCE7] border border-[#86EFAC] text-[#14532D] space-y-1.5 text-xs font-mono">
                <div className="flex items-center space-x-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
                  <span>REGION SUCCESSFULLY CONNECTED</span>
                </div>
                <div className="text-[11px] space-y-0.5 text-[#166534]">
                  <div>Allocated Bandwidth: 180 Mbps</div>
                  <div>Latency: 54 ms (down from {location.latencyMs} ms)</div>
                  <div>Active Route: Satellite → Ground Station → Edge Mesh</div>
                </div>
              </div>
            ) : (
              <button
                onClick={handleStartConnect}
                className="w-full py-2.5 px-4 bg-[#202322] hover:bg-[#323635] text-white rounded font-mono text-xs font-bold tracking-wider uppercase transition-colors shadow-xs flex items-center justify-center space-x-2 border border-[#202322]"
              >
                <span>CONNECT REGION</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D97706]" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
