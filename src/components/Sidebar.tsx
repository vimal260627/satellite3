import React from 'react';
import {
  Globe,
  Map as MapIcon,
  Satellite,
  Wifi,
  BarChart2,
  GitFork,
  Shuffle,
  Compass,
  Sliders,
  PieChart,
  Play,
  Pause,
  FastForward,
  ShieldCheck,
  Server
} from 'lucide-react';
import { ActiveSidebarTab } from '../types';

interface SidebarProps {
  activeTab: ActiveSidebarTab;
  onSelectTab: (tab: ActiveSidebarTab) => void;
  simulationSpeed: number;
  onSetSimulationSpeed: (speed: number) => void;
  isPaused: boolean;
  onTogglePause: () => void;
}

interface NavItem {
  id: ActiveSidebarTab;
  number: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  simulationSpeed,
  onSetSimulationSpeed,
  isPaused,
  onTogglePause,
}) => {
  const navItems: NavItem[] = [
    { id: 'overview', number: '01', label: 'OVERVIEW', icon: Globe },
    { id: 'map', number: '02', label: 'INDIA MAP', icon: MapIcon },
    { id: 'satellites', number: '03', label: 'SATELLITES', icon: Satellite },
    { id: 'connectivity', number: '04', label: 'CONNECTIVITY', icon: Wifi },
    { id: 'demand', number: '05', label: 'DEMAND', icon: BarChart2 },
    { id: 'routing', number: '06', label: 'NETWORK ROUTING', icon: GitFork },
    { id: 'handover', number: '07', label: 'HANDOVER', icon: Shuffle },
    { id: 'ground-stations', number: '08', label: 'GROUND STATIONS', icon: Compass },
    { id: 'what-if', number: '09', label: 'WHAT-IF SIMULATOR', icon: Sliders },
    { id: 'analytics', number: '10', label: 'ANALYTICS', icon: PieChart },
  ];

  return (
    <aside className="w-56 bg-[#EFECE6] border-r border-[#DDD9D0] flex flex-col justify-between select-none z-20 shrink-0 text-[#202322]">
      {/* Navigation List */}
      <div className="py-2 flex-1 overflow-y-auto">
        <div className="px-3 py-1.5 mb-1 text-[10px] font-mono uppercase tracking-wider text-[#7C807E] font-medium">
          GRID NAVIGATION
        </div>
        <nav className="space-y-0.5 px-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded text-left transition-colors font-mono text-xs ${
                  isActive
                    ? 'bg-[#FFFFFF] text-[#202322] font-semibold border border-[#CBC5B7] shadow-xs'
                    : 'text-[#505452] hover:bg-[#E5E1D8] hover:text-[#202322]'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <span className={`text-[10px] ${isActive ? 'text-[#D97706]' : 'text-[#8A8F8D]'}`}>
                    {item.number}
                  </span>
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#D97706]' : 'text-[#6C716E]'}`} />
                  <span className="tracking-tight text-[11px]">{item.label}</span>
                </div>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Engineering Status & Sim Controls */}
      <div className="p-3 border-t border-[#DDD9D0] bg-[#EAE6DE] space-y-2.5 text-xs">
        {/* Simulation Speed */}
        <div>
          <div className="flex items-center justify-between text-[10px] font-mono text-[#6C716E] mb-1">
            <span>TIME ACCELERATION</span>
            <span>{isPaused ? 'PAUSED' : `${simulationSpeed}x`}</span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={onTogglePause}
              className={`p-1.5 rounded border text-xs flex items-center justify-center flex-1 transition-colors ${
                isPaused
                  ? 'bg-[#D97706] text-white border-[#B45309]'
                  : 'bg-[#FFFFFF] text-[#202322] border-[#CBC5B7] hover:bg-[#F2EFE8]'
              }`}
              title={isPaused ? 'Resume Simulation' : 'Pause Simulation'}
            >
              {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
            </button>
            <button
              onClick={() => onSetSimulationSpeed(1)}
              className={`px-2 py-1 rounded border text-[10px] font-mono transition-colors ${
                simulationSpeed === 1 && !isPaused
                  ? 'bg-[#202322] text-white border-[#202322]'
                  : 'bg-[#FFFFFF] text-[#505452] border-[#CBC5B7] hover:bg-[#F2EFE8]'
              }`}
            >
              1x
            </button>
            <button
              onClick={() => onSetSimulationSpeed(2)}
              className={`px-2 py-1 rounded border text-[10px] font-mono transition-colors ${
                simulationSpeed === 2 && !isPaused
                  ? 'bg-[#202322] text-white border-[#202322]'
                  : 'bg-[#FFFFFF] text-[#505452] border-[#CBC5B7] hover:bg-[#F2EFE8]'
              }`}
            >
              2x
            </button>
            <button
              onClick={() => onSetSimulationSpeed(5)}
              className={`px-2 py-1 rounded border text-[10px] font-mono transition-colors ${
                simulationSpeed === 5 && !isPaused
                  ? 'bg-[#202322] text-white border-[#202322]'
                  : 'bg-[#FFFFFF] text-[#505452] border-[#CBC5B7] hover:bg-[#F2EFE8]'
              }`}
            >
              <FastForward className="w-2.5 h-2.5 inline" /> 5x
            </button>
          </div>
        </div>

        {/* Technical Coordinate & Grid info */}
        <div className="pt-2 border-t border-[#DDD9D0] text-[10px] font-mono text-[#6C716E] space-y-1">
          <div className="flex items-center justify-between">
            <span>DATUM:</span>
            <span className="text-[#202322]">WGS-84 (EPSG:4326)</span>
          </div>
          <div className="flex items-center justify-between">
            <span>TELEMETRY:</span>
            <span className="text-[#16A34A] flex items-center space-x-1">
              <ShieldCheck className="w-2.5 h-2.5" />
              <span>ISRO-STRAC OK</span>
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>CORE BACKBONE:</span>
            <span className="text-[#7C3AED] flex items-center space-x-1">
              <Server className="w-2.5 h-2.5" />
              <span>BHARATNET DWDM</span>
            </span>
          </div>
        </div>

        <div className="px-2 py-1 rounded bg-[#E2DED4] border border-[#CBC5B7] text-[9px] text-[#6C716E] text-center font-mono">
          ENGINEERING SIMULATION MODE
        </div>
      </div>
    </aside>
  );
};
