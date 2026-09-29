import React, { useState, useEffect } from 'react';
import { INDIA_LOCATIONS } from './data/indiaLocations';
import {
  FIBER_ROUTES,
  CELLULAR_TOWERS,
  GROUND_STATIONS,
  SCHOOLS,
  HOSPITALS,
} from './data/infrastructure';
import { INITIAL_SATELLITES } from './data/satellites';
import {
  LocationData,
  SatelliteData,
  FiberRoute,
  CellularTower,
  GroundStation,
  SchoolData,
  HospitalData,
  MapLayerToggles,
  SimulationFailureState,
  ActiveSidebarTab,
  BasemapType,
} from './types';
import { advanceSatelliteCoordinates } from './simulation/simulationEngine';
import { TopHeader } from './components/TopHeader';
import { Sidebar } from './components/Sidebar';
import { TopKpiBar } from './components/TopKpiBar';
import { IndiaMap } from './components/IndiaMap';
import { LocationAnalysisPanel } from './components/panels/LocationAnalysisPanel';
import { SatellitePanel } from './components/panels/SatellitePanel';
import { InfrastructurePanel } from './components/panels/InfrastructurePanel';
import { SchoolHospitalModal } from './components/panels/SchoolHospitalModal';
import { WhatIfSimulatorPanel } from './components/panels/WhatIfSimulatorPanel';
import { GroundStationOptimizer } from './components/panels/GroundStationOptimizer';
import { NetworkRoutingPanel } from './components/panels/NetworkRoutingPanel';
import { DemandAnalyticsPanel } from './components/panels/DemandAnalyticsPanel';
import { NationalOverviewPanel } from './components/panels/NationalOverviewPanel';
import { ConnectivityTriadPanel } from './components/panels/ConnectivityTriadPanel';
import { AnalyticsKpiPanel } from './components/panels/AnalyticsKpiPanel';

export function App() {
  // --- Simulation State ---
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [simulationTime, setSimulationTime] = useState<string>('14:32:18 IST');

  // --- Dynamic Constellation Coordinates ---
  const [satellites, setSatellites] = useState<SatelliteData[]>(INITIAL_SATELLITES);

  // --- Selected Focus Entities ---
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(() => {
    // Preload Himalayan Demonstration Scenario (Section 50)
    return INDIA_LOCATIONS.find((loc) => loc.id === 'loc-spiti-kaza') || INDIA_LOCATIONS[0];
  });
  const [selectedSatellite, setSelectedSatellite] = useState<SatelliteData | null>(null);
  const [selectedFiberRoute, setSelectedFiberRoute] = useState<FiberRoute | null>(null);
  const [selectedTower, setSelectedTower] = useState<CellularTower | null>(null);
  const [selectedGroundStation, setSelectedGroundStation] = useState<GroundStation | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<SchoolData | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<HospitalData | null>(null);

  // --- Active Sidebar Navigation ---
  const [activeTab, setActiveTab] = useState<ActiveSidebarTab>('map');

  // --- Connected Villages Registry ---
  const [connectedVillageIds, setConnectedVillageIds] = useState<Set<string>>(new Set());

  // --- Basemap and Panel States ---
  const [basemap, setBasemap] = useState<BasemapType>('standard');
  const [isPanelCollapsed, setIsPanelCollapsed] = useState<boolean>(false);

  // --- Map Layer Toggles ---
  const [activeLayers, setActiveLayers] = useState<MapLayerToggles>({
    geographicMap: true,
    nationalBorder: true,
    stateBoundaries: true,
    terrain: true,
    fiberRoutes: true,
    cellularTowers: true,
    groundStations: true,
    villages: true,
    schools: true,
    hospitals: true,
    satellitePositions: true,
    satelliteCoverage: false, // Default FALSE so India is NOT covered in giant orange circles!
    population: false,
    networkDemand: false,
    connectivityQuality: false,
    userDensity: false,
  });

  // --- Failure Injections ---
  const [failureState, setFailureState] = useState<SimulationFailureState>({
    fiberCut: false,
    cellularOutage: false,
    satelliteAnomaly: false,
    demandSpike: false,
  });

  // --- Live Clock & Satellite Orbital Motion Loop ---
  useEffect(() => {
    const timer = setInterval(() => {
      // Advance ticking IST clock
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-IN', { hour12: false }) + ' IST';
      setSimulationTime(timeStr);

      // Advance satellites along orbital planes
      if (!isPaused) {
        setSatellites((prevSats) =>
          advanceSatelliteCoordinates(prevSats, 1.5 * simulationSpeed)
        );
      }
    }, 1500 / simulationSpeed);

    return () => clearInterval(timer);
  }, [isPaused, simulationSpeed]);

  // Handle Layer Toggle
  const handleToggleLayer = (key: keyof MapLayerToggles) => {
    setActiveLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Handle Failure Toggle
  const handleToggleFailure = (key: keyof SimulationFailureState) => {
    setFailureState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Handle Selection of Preset Scenario
  const handleSelectScenario = (scenarioId: string) => {
    const loc = INDIA_LOCATIONS.find((l) => l.id === scenarioId);
    if (loc) {
      setSelectedLocation(loc);
      setSelectedSatellite(null);
      setSelectedFiberRoute(null);
      setSelectedTower(null);
      setSelectedGroundStation(null);
      setSelectedSchool(null);
      setSelectedHospital(null);
      setActiveTab('map');
    }
  };

  // Reset to National India Overview
  const handleResetView = () => {
    setSelectedLocation(null);
    setSelectedSatellite(null);
    setSelectedFiberRoute(null);
    setSelectedTower(null);
    setSelectedGroundStation(null);
    setSelectedSchool(null);
    setSelectedHospital(null);
    setActiveTab('overview');
  };

  // Connect Region Action
  const handleConnectRegion = (loc: LocationData) => {
    setConnectedVillageIds((prev) => {
      const next = new Set(prev);
      next.add(loc.id);
      return next;
    });
  };

  // Determine what panel to show on the right side
  const renderRightPanel = () => {
    if (selectedSchool || selectedHospital) {
      return (
        <SchoolHospitalModal
          school={selectedSchool}
          hospital={selectedHospital}
          onClose={() => {
            setSelectedSchool(null);
            setSelectedHospital(null);
          }}
        />
      );
    }

    if (selectedFiberRoute || selectedTower || selectedGroundStation) {
      return (
        <InfrastructurePanel
          fiberRoute={selectedFiberRoute}
          cellularTower={selectedTower}
          groundStation={selectedGroundStation}
          failureState={failureState}
          onToggleFiberFailure={() => handleToggleFailure('fiberCut')}
          onToggleTowerFailure={() => handleToggleFailure('cellularOutage')}
          onClose={() => {
            setSelectedFiberRoute(null);
            setSelectedTower(null);
            setSelectedGroundStation(null);
          }}
        />
      );
    }

    if (selectedSatellite || activeTab === 'satellites' || activeTab === 'handover') {
      return (
        <SatellitePanel
          satellites={satellites}
          selectedSatellite={selectedSatellite}
          onSelectSatellite={setSelectedSatellite}
          onClose={() => setSelectedSatellite(null)}
        />
      );
    }

    if (activeTab === 'what-if') {
      return <WhatIfSimulatorPanel onClose={() => setActiveTab('map')} />;
    }

    if (activeTab === 'ground-stations') {
      return (
        <GroundStationOptimizer
          groundStations={GROUND_STATIONS}
          onSelectStation={setSelectedGroundStation}
          onClose={() => setActiveTab('map')}
        />
      );
    }

    if (activeTab === 'routing') {
      return (
        <NetworkRoutingPanel
          selectedLocation={selectedLocation}
          onClose={() => setActiveTab('map')}
        />
      );
    }

    if (activeTab === 'demand') {
      return <DemandAnalyticsPanel onClose={() => setActiveTab('map')} />;
    }

    if (activeTab === 'connectivity') {
      return <ConnectivityTriadPanel onClose={() => setActiveTab('map')} />;
    }

    if (activeTab === 'analytics') {
      return <AnalyticsKpiPanel onClose={() => setActiveTab('map')} />;
    }

    if (selectedLocation) {
      return (
        <LocationAnalysisPanel
          location={selectedLocation}
          isConnected={connectedVillageIds.has(selectedLocation.id)}
          onConnectRegion={handleConnectRegion}
          onClose={() => setSelectedLocation(null)}
        />
      );
    }

    // Default: National Network Status
    return (
      <NationalOverviewPanel
        coveragePct={84.7 + (connectedVillageIds.size > 0 ? 1.8 : 0)}
        connectedUsersM={182.4 + (connectedVillageIds.size > 0 ? 0.08 : 0)}
        unservedUsersM={31.8 - (connectedVillageIds.size > 0 ? 0.08 : 0)}
        activeSatellitesCount={satellites.length}
        networkLoadPct={failureState.fiberCut ? 78 : 63}
        failureState={failureState}
        onSelectScenarioLocation={handleSelectScenario}
        locations={INDIA_LOCATIONS}
      />
    );
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#F5F3EE] text-[#202322]">
      {/* Top Header */}
      <TopHeader
        simulationTime={simulationTime}
        failureState={failureState}
        onToggleFailure={handleToggleFailure}
        onSelectScenario={handleSelectScenario}
        onResetView={handleResetView}
      />

      {/* Main Layout Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            // Clear granular selections if navigating to high-level views
            if (tab === 'what-if' || tab === 'ground-stations' || tab === 'routing' || tab === 'demand') {
              setSelectedSchool(null);
              setSelectedHospital(null);
              setSelectedFiberRoute(null);
              setSelectedTower(null);
            }
          }}
          simulationSpeed={simulationSpeed}
          onSetSimulationSpeed={setSimulationSpeed}
          isPaused={isPaused}
          onTogglePause={() => setIsPaused(!isPaused)}
        />

        {/* Center Main Stage: The Hero Map */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          {/* Top KPI Metric Strip */}
          <TopKpiBar
            coveragePct={84.7 + (connectedVillageIds.size > 0 ? 1.8 : 0)}
            connectedUsersM={182.4 + (connectedVillageIds.size > 0 ? 0.08 : 0)}
            unservedUsersM={31.8 - (connectedVillageIds.size > 0 ? 0.08 : 0)}
            activeSatellitesCount={satellites.length}
            networkLoadPct={failureState.fiberCut ? 78 : 63}
            failureState={failureState}
          />

          {/* Interactive GIS India Digital Twin Map */}
          <div className="flex-1 relative overflow-hidden">
            <IndiaMap
              locations={INDIA_LOCATIONS}
              satellites={satellites}
              fiberRoutes={FIBER_ROUTES}
              cellularTowers={CELLULAR_TOWERS}
              groundStations={GROUND_STATIONS}
              schools={SCHOOLS}
              hospitals={HOSPITALS}
              selectedLocation={selectedLocation}
              onSelectLocation={(loc) => {
                setSelectedLocation(loc);
                setSelectedSatellite(null);
                setSelectedFiberRoute(null);
                setSelectedTower(null);
                setSelectedGroundStation(null);
                setSelectedSchool(null);
                setSelectedHospital(null);
              }}
              selectedSatellite={selectedSatellite}
              onSelectSatellite={(sat) => {
                setSelectedSatellite(sat);
                setSelectedSchool(null);
                setSelectedHospital(null);
              }}
              selectedFiberRoute={selectedFiberRoute}
              onSelectFiberRoute={(route) => {
                setSelectedFiberRoute(route);
                setSelectedSchool(null);
                setSelectedHospital(null);
              }}
              selectedTower={selectedTower}
              onSelectTower={(tower) => {
                setSelectedTower(tower);
                setSelectedSchool(null);
                setSelectedHospital(null);
              }}
              selectedGroundStation={selectedGroundStation}
              onSelectGroundStation={(gs) => {
                setSelectedGroundStation(gs);
                setSelectedSchool(null);
                setSelectedHospital(null);
              }}
              selectedSchool={selectedSchool}
              onSelectSchool={(sch) => {
                setSelectedSchool(sch);
                setSelectedHospital(null);
              }}
              selectedHospital={selectedHospital}
              onSelectHospital={(hosp) => {
                setSelectedHospital(hosp);
                setSelectedSchool(null);
              }}
              activeLayers={activeLayers}
              onToggleLayer={handleToggleLayer}
              basemap={basemap}
              onChangeBasemap={setBasemap}
              failureState={failureState}
              connectedVillageIds={connectedVillageIds}
              onResetToIndia={handleResetView}
            />
          </div>
        </div>

        {/* Collapsible Right Engineering Operations Panel */}
        <div
          className={`h-full shrink-0 z-20 transition-all duration-300 relative flex ${
            isPanelCollapsed ? 'w-0' : 'w-80 md:w-96 xl:w-[410px]'
          }`}
        >
          {/* Panel Collapse / Expand Tab Button */}
          <button
            onClick={() => {
              setIsPanelCollapsed(!isPanelCollapsed);
              setTimeout(() => window.dispatchEvent(new Event('resize')), 150);
            }}
            className="absolute -left-7 top-16 z-30 bg-[#202322] hover:bg-[#323635] text-white border border-[#3E4542] rounded-l px-1.5 py-2 text-[10px] font-mono shadow-md flex items-center justify-center transition-colors"
            title={isPanelCollapsed ? 'Open Operations Panel' : 'Collapse Panel for Full Map'}
          >
            <span className="[writing-mode:vertical-rl] tracking-wider text-[9px] uppercase font-bold">
              {isPanelCollapsed ? '◀ OPEN PANEL' : '▶ FULL MAP'}
            </span>
          </button>

          {!isPanelCollapsed && (
            <div className="w-full h-full shadow-xs overflow-hidden">
              {renderRightPanel()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

