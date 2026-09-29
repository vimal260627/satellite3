import React from 'react';
import {
  Server,
  Radio,
  Compass,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Maximize2,
  X
} from 'lucide-react';
import { FiberRoute, CellularTower, GroundStation, SimulationFailureState } from '../../types';

interface InfrastructurePanelProps {
  fiberRoute: FiberRoute | null;
  cellularTower: CellularTower | null;
  groundStation: GroundStation | null;
  failureState: SimulationFailureState;
  onToggleFiberFailure: () => void;
  onToggleTowerFailure: () => void;
  onClose: () => void;
}

export const InfrastructurePanel: React.FC<InfrastructurePanelProps> = ({
  fiberRoute,
  cellularTower,
  groundStation,
  failureState,
  onToggleFiberFailure,
  onToggleTowerFailure,
  onClose,
}) => {
  return (
    <div className="h-full flex flex-col bg-[#FFFFFF] border-l border-[#DDD9D0] text-[#202322] select-none text-xs font-mono overflow-y-auto">
      {/* Header */}
      <div className="px-4 py-3 bg-[#FAF9F5] border-b border-[#DDD9D0] flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded bg-[#202322] text-[#F5F3EE] flex items-center justify-center text-xs">
            {fiberRoute ? <Server className="w-3.5 h-3.5 text-[#7C3AED]" /> :
             cellularTower ? <Radio className="w-3.5 h-3.5 text-[#16A34A]" /> :
             <Compass className="w-3.5 h-3.5 text-[#D97706]" />}
          </div>
          <div>
            <h2 className="font-bold text-xs uppercase tracking-wider text-[#202322]">
              {fiberRoute ? 'FIBER ROUTE TELEMETRY' :
               cellularTower ? 'CELLULAR SITE METRICS' :
               'EARTH GATEWAY STATION'}
            </h2>
            <p className="text-[10px] text-[#767B78]">
              Terrestrial Infrastructure Component
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
        {/* FIBER ROUTE VIEW */}
        {fiberRoute && (
          <div className="space-y-4">
            <div className="p-3.5 bg-[#FAF9F5] border border-[#DDD9D0] rounded space-y-2.5">
              <div className="flex items-center justify-between border-b border-[#EAE6DD] pb-2">
                <div className="font-bold text-xs text-[#7C3AED]">{fiberRoute.name}</div>
                <span
                  className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                    failureState.fiberCut
                      ? 'bg-[#FEE2E2] text-[#DC2626] border border-[#FCA5A5]'
                      : 'bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]'
                  }`}
                >
                  {failureState.fiberCut ? '⚠ SEVERED (OUTAGE)' : fiberRoute.status}
                </span>
              </div>

              <p className="text-[10px] text-[#606462] leading-relaxed">
                {fiberRoute.description}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-white rounded border border-[#E5E1D8]">
                  <span className="text-[9px] text-[#767B78] block">ROUTE LENGTH</span>
                  <span className="text-sm font-bold text-[#202322]">{fiberRoute.lengthKm} km</span>
                </div>
                <div className="p-2 bg-white rounded border border-[#E5E1D8]">
                  <span className="text-[9px] text-[#767B78] block">OPTICAL CAPACITY</span>
                  <span className="text-sm font-bold text-[#202322]">{fiberRoute.capacityGbps} Gbps</span>
                </div>
                <div className="p-2 bg-white rounded border border-[#E5E1D8]">
                  <span className="text-[9px] text-[#767B78] block">UTILIZATION</span>
                  <span className="text-sm font-bold text-[#202322]">{fiberRoute.utilizationPct}%</span>
                </div>
                <div className="p-2 bg-white rounded border border-[#E5E1D8]">
                  <span className="text-[9px] text-[#767B78] block">REGIONS CONNECTED</span>
                  <span className="text-sm font-bold text-[#202322]">{fiberRoute.connectedRegionsCount} Hubs</span>
                </div>
              </div>

              {failureState.fiberCut ? (
                <div className="p-3 rounded bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] space-y-1.5">
                  <div className="flex items-center space-x-1.5 font-bold">
                    <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
                    <span>OUTAGE ACTIVE: 24,820 USERS REROUTED</span>
                  </div>
                  <p className="text-[10px]">
                    Autonomous AI Orchestrator has dynamically rerouted traffic via LEO Satellite SAT-04 & GS-01 Dehradun Gateway. 0% complete packet drop.
                  </p>
                  <button
                    onClick={onToggleFiberFailure}
                    className="mt-2 w-full py-1.5 bg-[#15803D] hover:bg-[#166534] text-white rounded font-bold text-[10px] transition-colors"
                  >
                    RESTORE FIBER BACKBONE
                  </button>
                </div>
              ) : (
                <button
                  onClick={onToggleFiberFailure}
                  className="w-full py-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded font-mono text-xs font-semibold transition-colors flex items-center justify-center space-x-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>SIMULATE FIBER CABLE CUT</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* CELLULAR TOWER VIEW */}
        {cellularTower && (
          <div className="space-y-4">
            <div className="p-3.5 bg-[#FAF9F5] border border-[#DDD9D0] rounded space-y-2.5">
              <div className="flex items-center justify-between border-b border-[#EAE6DD] pb-2">
                <div className="font-bold text-xs text-[#16A34A]">{cellularTower.name}</div>
                <span
                  className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                    failureState.cellularOutage
                      ? 'bg-[#FEE2E2] text-[#DC2626]'
                      : 'bg-[#DCFCE7] text-[#15803D]'
                  }`}
                >
                  {failureState.cellularOutage ? 'DEGRADED' : 'OPERATIONAL'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-white rounded border border-[#E5E1D8]">
                  <span className="text-[9px] text-[#767B78] block">TECHNOLOGY</span>
                  <span className="text-sm font-bold text-[#202322]">{cellularTower.technology}</span>
                </div>
                <div className="p-2 bg-white rounded border border-[#E5E1D8]">
                  <span className="text-[9px] text-[#767B78] block">COVERAGE RADIUS</span>
                  <span className="text-sm font-bold text-[#202322]">{cellularTower.coverageRadiusKm} km</span>
                </div>
                <div className="p-2 bg-white rounded border border-[#E5E1D8]">
                  <span className="text-[9px] text-[#767B78] block">CONNECTED USERS</span>
                  <span className="text-sm font-bold text-[#202322]">{cellularTower.connectedUsers.toLocaleString()}</span>
                </div>
                <div className="p-2 bg-white rounded border border-[#E5E1D8]">
                  <span className="text-[9px] text-[#767B78] block">BACKHAUL BEARER</span>
                  <span className="text-sm font-bold text-[#202322]">{cellularTower.backhaul}</span>
                </div>
              </div>

              <div className="space-y-1 text-[11px] pt-1 border-t border-[#EAE6DD]">
                <div className="flex justify-between">
                  <span className="text-[#767B78]">Carrier Signal:</span>
                  <span className="font-medium text-[#15803D]">{cellularTower.signal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#767B78]">Site Utilization:</span>
                  <span className="font-medium text-[#202322]">{cellularTower.utilizationPct}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#767B78]">Nearby Villages Served:</span>
                  <span className="font-medium text-[#202322]">{cellularTower.nearbyVillagesCount} Settlements</span>
                </div>
              </div>

              <button
                onClick={onToggleTowerFailure}
                className={`w-full py-2 rounded font-mono text-xs font-semibold transition-colors flex items-center justify-center space-x-1.5 ${
                  failureState.cellularOutage
                    ? 'bg-[#15803D] text-white hover:bg-[#166534]'
                    : 'bg-[#202322] text-white hover:bg-[#323635]'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>
                  {failureState.cellularOutage
                    ? 'RESTORE CELLULAR MACRO SITE'
                    : 'SIMULATE CELLULAR OUTAGE'}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* GROUND STATION VIEW */}
        {groundStation && (
          <div className="space-y-4">
            <div className="p-3.5 bg-[#FAF9F5] border border-[#DDD9D0] rounded space-y-2.5">
              <div className="flex items-center justify-between border-b border-[#EAE6DD] pb-2">
                <div className="font-bold text-xs text-[#202322]">{groundStation.name}</div>
                <span
                  className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                    groundStation.status === 'OPERATIONAL'
                      ? 'bg-[#DCFCE7] text-[#15803D]'
                      : groundStation.status === 'CANDIDATE'
                      ? 'bg-[#E5E7EB] text-[#374151]'
                      : 'bg-[#FEE2E2] text-[#DC2626]'
                  }`}
                >
                  {groundStation.status}
                </span>
              </div>

              <p className="text-[10px] text-[#606462] leading-relaxed">
                {groundStation.notes}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-white rounded border border-[#E5E1D8]">
                  <span className="text-[9px] text-[#767B78] block">ELEVATION ANGLE</span>
                  <span className="text-sm font-bold text-[#202322]">{groundStation.elevationAngleDeg}°</span>
                </div>
                <div className="p-2 bg-white rounded border border-[#E5E1D8]">
                  <span className="text-[9px] text-[#767B78] block">BACKHAUL CAPACITY</span>
                  <span className="text-sm font-bold text-[#202322]">{groundStation.backhaulCapacityGbps} Gbps</span>
                </div>
                <div className="p-2 bg-white rounded border border-[#E5E1D8]">
                  <span className="text-[9px] text-[#767B78] block">TRACKING SATELLITE</span>
                  <span className="text-sm font-bold text-[#D97706]">{groundStation.trackingSatelliteId}</span>
                </div>
                <div className="p-2 bg-white rounded border border-[#E5E1D8]">
                  <span className="text-[9px] text-[#767B78] block">ATMOSPHERIC STATE</span>
                  <span className="text-sm font-bold text-[#202322]">{groundStation.weatherCondition}</span>
                </div>
              </div>

              <div className="space-y-1 text-[11px] pt-1 border-t border-[#EAE6DD]">
                <div className="flex justify-between">
                  <span className="text-[#767B78]">Terrain Suitability:</span>
                  <span className="font-medium text-[#202322]">{groundStation.terrainSuitability}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#767B78]">Pop Served Estimate:</span>
                  <span className="font-medium text-[#202322]">{groundStation.estimatedPopServedMillions} Million</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
