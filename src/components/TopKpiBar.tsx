import React from 'react';
import { ShieldCheck, AlertCircle, Satellite, Users, Activity, SignalHigh } from 'lucide-react';
import { SimulationFailureState } from '../types';

interface TopKpiBarProps {
  coveragePct: number;
  connectedUsersM: number;
  unservedUsersM: number;
  activeSatellitesCount: number;
  networkLoadPct: number;
  failureState: SimulationFailureState;
}

export const TopKpiBar: React.FC<TopKpiBarProps> = ({
  coveragePct,
  connectedUsersM,
  unservedUsersM,
  activeSatellitesCount,
  networkLoadPct,
  failureState,
}) => {
  const isFailureActive =
    failureState.fiberCut ||
    failureState.cellularOutage ||
    failureState.satelliteAnomaly ||
    failureState.demandSpike;

  return (
    <div className="bg-[#FAF9F5] border-b border-[#DDD9D0] px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs font-mono shrink-0 select-none">
      {/* Metric Units Strip */}
      <div className="flex items-center space-x-4 sm:space-x-6 overflow-x-auto">
        {/* Coverage */}
        <div className="flex items-baseline space-x-1.5">
          <span className="text-[10px] text-[#787D7B] uppercase tracking-wide">COVERAGE</span>
          <span className="text-sm font-bold text-[#15803D]">{coveragePct.toFixed(1)}%</span>
          <span className="text-[10px] text-[#16A34A] bg-[#DCFCE7] px-1 rounded">+3.2%</span>
        </div>

        <div className="h-3 w-[1px] bg-[#DDD9D0]" />

        {/* Connected Users */}
        <div className="flex items-baseline space-x-1.5">
          <span className="text-[10px] text-[#787D7B] uppercase tracking-wide flex items-center space-x-1">
            <Users className="w-3 h-3 text-[#787D7B] inline" />
            <span>CONNECTED</span>
          </span>
          <span className="text-sm font-bold text-[#202322]">{connectedUsersM.toFixed(1)}M</span>
        </div>

        <div className="h-3 w-[1px] bg-[#DDD9D0]" />

        {/* Unserved */}
        <div className="flex items-baseline space-x-1.5">
          <span className="text-[10px] text-[#787D7B] uppercase tracking-wide">UNSERVED</span>
          <span className={`text-sm font-bold ${unservedUsersM > 35 ? 'text-[#DC2626]' : 'text-[#EA580C]'}`}>
            {unservedUsersM.toFixed(1)}M
          </span>
        </div>

        <div className="h-3 w-[1px] bg-[#DDD9D0]" />

        {/* Satellites Active */}
        <div className="flex items-baseline space-x-1.5">
          <span className="text-[10px] text-[#787D7B] uppercase tracking-wide flex items-center space-x-1">
            <Satellite className="w-3 h-3 text-[#D97706] inline" />
            <span>SATELLITES</span>
          </span>
          <span className="text-sm font-bold text-[#D97706]">{activeSatellitesCount}</span>
          <span className="text-[10px] text-[#8C918E]">LEO 550km</span>
        </div>

        <div className="h-3 w-[1px] bg-[#DDD9D0]" />

        {/* Network Load */}
        <div className="flex items-baseline space-x-1.5">
          <span className="text-[10px] text-[#787D7B] uppercase tracking-wide flex items-center space-x-1">
            <Activity className="w-3 h-3 text-[#787D7B] inline" />
            <span>LOAD</span>
          </span>
          <span className="text-sm font-bold text-[#202322]">{networkLoadPct}%</span>
          <div className="w-12 h-1.5 bg-[#E5E1D8] rounded-full overflow-hidden inline-block self-center ml-1">
            <div
              className={`h-full ${networkLoadPct > 80 ? 'bg-[#DC2626]' : 'bg-[#15803D]'}`}
              style={{ width: `${networkLoadPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Failure Incident Response Banner */}
      {isFailureActive ? (
        <div className="flex items-center space-x-2 bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] px-2.5 py-1 rounded text-[11px] animate-pulse">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-[#DC2626]" />
          <span>
            {failureState.fiberCut && 'INCIDENT: Terrestrial fiber cut. AI Orchestrator rerouting 24,820 users via LEO satellite beams.'}
            {failureState.cellularOutage && 'INCIDENT: Cellular tower degradation. Bandwidth boost allocated to VSAT terminals.'}
            {failureState.demandSpike && 'INCIDENT: Peak telemedicine & school exam demand surge. Dynamic Q/V beam steer active.'}
          </span>
        </div>
      ) : (
        <div className="hidden xl:flex items-center space-x-1.5 text-[10px] text-[#606462]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
          <span>HYBRID GRID STABLE • AUTOMATED ADAPTIVE QOS ACTIVE</span>
        </div>
      )}
    </div>
  );
};
