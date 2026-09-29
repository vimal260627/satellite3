import React from 'react';
import {
  Globe,
  Radio,
  Server,
  Wifi,
  ShieldCheck,
  TrendingUp,
  Activity,
  AlertTriangle,
  Play
} from 'lucide-react';
import { SimulationFailureState, LocationData } from '../../types';

interface NationalOverviewPanelProps {
  coveragePct: number;
  connectedUsersM: number;
  unservedUsersM: number;
  activeSatellitesCount: number;
  networkLoadPct: number;
  failureState: SimulationFailureState;
  onSelectScenarioLocation: (locId: string) => void;
  locations: LocationData[];
}

export const NationalOverviewPanel: React.FC<NationalOverviewPanelProps> = ({
  coveragePct,
  connectedUsersM,
  unservedUsersM,
  activeSatellitesCount,
  networkLoadPct,
  failureState,
  onSelectScenarioLocation,
  locations,
}) => {
  return (
    <div className="h-full flex flex-col bg-[#FFFFFF] border-l border-[#DDD9D0] text-[#202322] select-none text-xs font-mono overflow-y-auto">
      {/* Header */}
      <div className="px-4 py-3 bg-[#FAF9F5] border-b border-[#DDD9D0] flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded bg-[#202322] text-[#F5F3EE] flex items-center justify-center text-xs">
            <Globe className="w-3.5 h-3.5 text-[#D97706]" />
          </div>
          <div>
            <h2 className="font-bold text-xs uppercase tracking-wider text-[#202322]">
              NATIONAL NETWORK STATUS
            </h2>
            <p className="text-[10px] text-[#767B78]">
              India Digital Connectivity Twin
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-[#DCFCE7] border border-[#86EFAC] text-[#14532D] text-[10px] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#15803D] status-beacon" />
          <span>SIMULATION MODE</span>
        </div>
      </div>

      <div className="p-4 space-y-4 flex-1">
        {/* Top 5 Core National Metrics Cards */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 bg-[#FAF9F5] border border-[#DDD9D0] rounded">
            <span className="text-[9px] text-[#767B78] block">NATIONAL COVERAGE</span>
            <span className="text-base font-bold text-[#15803D]">{coveragePct.toFixed(1)}%</span>
            <div className="text-[9px] text-[#16A34A] mt-0.5">+3.2% vs legacy baseline</div>
          </div>

          <div className="p-2.5 bg-[#FAF9F5] border border-[#DDD9D0] rounded">
            <span className="text-[9px] text-[#767B78] block">CONNECTED CITIZENS</span>
            <span className="text-base font-bold text-[#202322]">{connectedUsersM.toFixed(1)}M</span>
            <div className="text-[9px] text-[#555A57] mt-0.5">Across 28 states & 8 UTs</div>
          </div>

          <div className="p-2.5 bg-[#FAF9F5] border border-[#DDD9D0] rounded">
            <span className="text-[9px] text-[#767B78] block">UNSERVED POPULATION</span>
            <span className={`text-base font-bold ${unservedUsersM > 35 ? 'text-[#DC2626]' : 'text-[#EA580C]'}`}>
              {unservedUsersM.toFixed(1)}M
            </span>
            <div className="text-[9px] text-[#767B78] mt-0.5">High-terrain target focus</div>
          </div>

          <div className="p-2.5 bg-[#FAF9F5] border border-[#DDD9D0] rounded">
            <span className="text-[9px] text-[#767B78] block">ACTIVE LEO SATELLITES</span>
            <span className="text-base font-bold text-[#D97706]">{activeSatellitesCount} Orbiters</span>
            <div className="text-[9px] text-[#767B78] mt-0.5">550 km Ku/Ka Constellation</div>
          </div>
        </div>

        {/* Aggregate Network Load */}
        <div className="p-3 bg-[#FAF9F5] border border-[#DDD9D0] rounded space-y-1.5">
          <div className="flex justify-between text-[11px]">
            <span className="text-[#767B78]">NATIONAL NETWORK UTILIZATION:</span>
            <span className="font-bold text-[#202322]">{networkLoadPct}%</span>
          </div>
          <div className="w-full bg-[#E5E1D8] h-2 rounded-full overflow-hidden">
            <div
              className={`h-full ${networkLoadPct > 80 ? 'bg-[#DC2626]' : 'bg-[#15803D]'}`}
              style={{ width: `${networkLoadPct}%` }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-[#767B78]">
            <span>Aggregate Throughput: 14.8 Tbps</span>
            <span>Headroom: {(100 - networkLoadPct)}%</span>
          </div>
        </div>

        {/* Carrier Technology Distribution */}
        <div className="p-3.5 bg-[#FAF9F5] border border-[#DDD9D0] rounded space-y-2.5">
          <div className="font-bold text-xs text-[#202322] border-b border-[#EAE6DD] pb-1 flex items-center justify-between">
            <span>HYBRID CONNECTIVITY TRIAD</span>
            <span className="text-[10px] text-[#767B78]">BEARER MIX</span>
          </div>

          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-[10px] mb-0.5">
                <span className="text-[#7C3AED] font-medium flex items-center space-x-1">
                  <Server className="w-3 h-3" />
                  <span>BharatNet National Optical Fiber</span>
                </span>
                <span className="font-bold">52%</span>
              </div>
              <div className="w-full bg-[#E5E1D8] h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-[#7C3AED]" style={{ width: '52%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] mb-0.5">
                <span className="text-[#16A34A] font-medium flex items-center space-x-1">
                  <Radio className="w-3 h-3" />
                  <span>Terrestrial Cellular (4G/5G Macro)</span>
                </span>
                <span className="font-bold">38%</span>
              </div>
              <div className="w-full bg-[#E5E1D8] h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-[#16A34A]" style={{ width: '38%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] mb-0.5">
                <span className="text-[#D97706] font-medium flex items-center space-x-1">
                  <Wifi className="w-3 h-3" />
                  <span>AstraGrid LEO Satellite Constellation</span>
                </span>
                <span className="font-bold">10%</span>
              </div>
              <div className="w-full bg-[#E5E1D8] h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-[#D97706]" style={{ width: '10%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Preloaded High-Priority Demonstration Scenarios */}
        <div className="p-3.5 bg-[#FAF9F5] border border-[#DDD9D0] rounded space-y-2">
          <div className="font-bold text-xs text-[#202322] flex items-center justify-between">
            <span>INSPECT PRIORITY GEOGRAPHIC REGIONS</span>
            <span className="text-[9px] text-[#D97706]">CLICK TO INSPECT</span>
          </div>

          <div className="space-y-1.5">
            <button
              onClick={() => onSelectScenarioLocation('loc-spiti-kaza')}
              className="w-full text-left p-2 rounded bg-white border border-[#E5E1D8] hover:bg-[#F5F3EE] flex items-center justify-between transition-colors"
            >
              <div>
                <div className="font-bold text-[11px] text-[#202322]">
                  01. Kaza (Spiti Valley, HP)
                </div>
                <div className="text-[9px] text-[#767B78]">
                  3,650m Alpine Desert • Critical Terrestrial Isolation
                </div>
              </div>
              <span className="text-[9px] bg-[#FEE2E2] text-[#DC2626] px-1.5 py-0.5 rounded font-bold">
                UNSERVED
              </span>
            </button>

            <button
              onClick={() => onSelectScenarioLocation('loc-kodaikanal-rural')}
              className="w-full text-left p-2 rounded bg-white border border-[#E5E1D8] hover:bg-[#F5F3EE] flex items-center justify-between transition-colors"
            >
              <div>
                <div className="font-bold text-[11px] text-[#202322]">
                  02. Kodaikanal Rural Ridge (TN)
                </div>
                <div className="text-[9px] text-[#767B78]">
                  2,133m Western Ghats • 21,160 Unserved Population
                </div>
              </div>
              <span className="text-[9px] bg-[#FEF3C7] text-[#B45309] px-1.5 py-0.5 rounded font-bold">
                POOR
              </span>
            </button>

            <button
              onClick={() => onSelectScenarioLocation('loc-tawang-frontier')}
              className="w-full text-left p-2 rounded bg-white border border-[#E5E1D8] hover:bg-[#F5F3EE] flex items-center justify-between transition-colors"
            >
              <div>
                <div className="font-bold text-[11px] text-[#202322]">
                  03. Tawang Frontier Outpost (AR)
                </div>
                <div className="text-[9px] text-[#767B78]">
                  Sela Pass Corridor • Landslide Severed Terrestrial Link
                </div>
              </div>
              <span className="text-[9px] bg-[#FEE2E2] text-[#DC2626] px-1.5 py-0.5 rounded font-bold">
                CRITICAL
              </span>
            </button>

            <button
              onClick={() => onSelectScenarioLocation('loc-sam-jaisalmer')}
              className="w-full text-left p-2 rounded bg-white border border-[#E5E1D8] hover:bg-[#F5F3EE] flex items-center justify-between transition-colors"
            >
              <div>
                <div className="font-bold text-[11px] text-[#202322]">
                  04. Sam Sand Dunes Hamlet (RJ)
                </div>
                <div className="text-[9px] text-[#767B78]">
                  Thar Arid Zone • Optimal Ka-Band Satellite Visibility
                </div>
              </div>
              <span className="text-[9px] bg-[#FEF3C7] text-[#B45309] px-1.5 py-0.5 rounded font-bold">
                POOR
              </span>
            </button>
          </div>
        </div>

        {/* Live Autonomous Orchestrator Activity Log */}
        <div className="p-3 bg-[#FAF9F5] border border-[#DDD9D0] rounded space-y-1.5">
          <div className="font-bold text-xs text-[#202322] flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#15803D]" />
            <span>AI ORCHESTRATOR LIVE LOG</span>
          </div>
          <div className="space-y-1 text-[10px] text-[#555A57]">
            <div className="flex justify-between">
              <span>[14:31:02] GS-02 Bengaluru link budget verified</span>
              <span className="text-[#15803D]">OK</span>
            </div>
            <div className="flex justify-between">
              <span>[14:31:45] SAT-12 to SAT-15 handover scheduled</span>
              <span className="text-[#D97706]">TRACKING</span>
            </div>
            <div className="flex justify-between">
              <span>[14:32:10] Ladakh Ku-band transponder power adjusted</span>
              <span className="text-[#15803D]">LOCKED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
