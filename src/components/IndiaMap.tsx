import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
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
  BasemapType,
} from '../types';
import { MapControls } from './MapControls';
import { INDIA_NATIONAL_OUTLINE } from '../data/indiaNationalBoundary';
import { INDIA_STATES } from '../data/indiaStates';

interface IndiaMapProps {
  locations: LocationData[];
  satellites: SatelliteData[];
  fiberRoutes: FiberRoute[];
  cellularTowers: CellularTower[];
  groundStations: GroundStation[];
  schools: SchoolData[];
  hospitals: HospitalData[];
  selectedLocation: LocationData | null;
  onSelectLocation: (loc: LocationData) => void;
  selectedSatellite: SatelliteData | null;
  onSelectSatellite: (sat: SatelliteData) => void;
  selectedFiberRoute: FiberRoute | null;
  onSelectFiberRoute: (route: FiberRoute) => void;
  selectedTower: CellularTower | null;
  onSelectTower: (tower: CellularTower) => void;
  selectedGroundStation: GroundStation | null;
  onSelectGroundStation: (gs: GroundStation) => void;
  selectedSchool: SchoolData | null;
  onSelectSchool: (sch: SchoolData) => void;
  selectedHospital: HospitalData | null;
  onSelectHospital: (hosp: HospitalData) => void;
  activeLayers: MapLayerToggles;
  onToggleLayer: (key: keyof MapLayerToggles) => void;
  basemap: BasemapType;
  onChangeBasemap: (base: BasemapType) => void;
  failureState: SimulationFailureState;
  connectedVillageIds: Set<string>;
  onResetToIndia: () => void;
}

export const IndiaMap: React.FC<IndiaMapProps> = ({
  locations,
  satellites,
  fiberRoutes,
  cellularTowers,
  groundStations,
  schools,
  hospitals,
  selectedLocation,
  onSelectLocation,
  selectedSatellite,
  onSelectSatellite,
  selectedFiberRoute,
  onSelectFiberRoute,
  selectedTower,
  onSelectTower,
  selectedGroundStation,
  onSelectGroundStation,
  selectedSchool,
  onSelectSchool,
  selectedHospital,
  onSelectHospital,
  activeLayers,
  onToggleLayer,
  basemap,
  onChangeBasemap,
  failureState,
  connectedVillageIds,
  onResetToIndia,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Layer groups refs to allow fast dynamic updates without destroying the map
  const nationalBoundaryGroupRef = useRef<L.LayerGroup | null>(null);
  const stateBoundariesGroupRef = useRef<L.LayerGroup | null>(null);
  const satellitesGroupRef = useRef<L.LayerGroup | null>(null);
  const satelliteCoverageGroupRef = useRef<L.LayerGroup | null>(null);
  const fiberGroupRef = useRef<L.LayerGroup | null>(null);
  const towersGroupRef = useRef<L.LayerGroup | null>(null);
  const groundStationsGroupRef = useRef<L.LayerGroup | null>(null);
  const locationsGroupRef = useRef<L.LayerGroup | null>(null);
  const schoolsGroupRef = useRef<L.LayerGroup | null>(null);
  const hospitalsGroupRef = useRef<L.LayerGroup | null>(null);
  const routingBeamGroupRef = useRef<L.LayerGroup | null>(null);

  const [cursorCoords, setCursorCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [currentZoom, setCurrentZoom] = useState(5);

  // Basemap Tile Providers
  const getTileConfig = (type: BasemapType) => {
    switch (type) {
      case 'terrain':
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
          attribution: '&copy; Esri & OpenStreetMap | AstraGrid Digital Twin',
        };
      case 'satellite':
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attribution: '&copy; Esri World Imagery | AstraGrid Digital Twin',
        };
      case 'dark':
        return {
          url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
          attribution: '&copy; CartoDB & OpenStreetMap | AstraGrid Digital Twin',
        };
      case 'standard':
      default:
        // Carto Voyager: high clarity, crisp country/state names, roads, rivers, blue oceans
        return {
          url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
          attribution: '&copy; CartoDB & OpenStreetMap contributors | AstraGrid Digital Twin',
        };
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center directly on India subcontinent
    const map = L.map(mapContainerRef.current, {
      center: [21.8, 79.2],
      zoom: 5,
      minZoom: 4,
      maxZoom: 14,
      zoomControl: false,
    });

    const tileCfg = getTileConfig(basemap);
    const tileLayer = L.tileLayer(tileCfg.url, {
      attribution: tileCfg.attribution,
      subdomains: 'abcd',
      maxZoom: 19,
      className: 'gis-tile-filter',
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Initialize layer groups in proper geographic z-order
    nationalBoundaryGroupRef.current = L.layerGroup().addTo(map);
    stateBoundariesGroupRef.current = L.layerGroup().addTo(map);
    fiberGroupRef.current = L.layerGroup().addTo(map);
    towersGroupRef.current = L.layerGroup().addTo(map);
    groundStationsGroupRef.current = L.layerGroup().addTo(map);
    schoolsGroupRef.current = L.layerGroup().addTo(map);
    hospitalsGroupRef.current = L.layerGroup().addTo(map);
    locationsGroupRef.current = L.layerGroup().addTo(map);
    routingBeamGroupRef.current = L.layerGroup().addTo(map);
    satelliteCoverageGroupRef.current = L.layerGroup().addTo(map);
    satellitesGroupRef.current = L.layerGroup().addTo(map);

    map.on('mousemove', (e) => {
      setCursorCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
    });

    map.on('zoomend', () => {
      setCurrentZoom(map.getZoom());
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle Basemap Switch
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    const map = mapInstanceRef.current;
    map.removeLayer(tileLayerRef.current);

    const tileCfg = getTileConfig(basemap);
    const newTileLayer = L.tileLayer(tileCfg.url, {
      attribution: tileCfg.attribution,
      subdomains: 'abcd',
      maxZoom: 19,
      className: 'gis-tile-filter',
    }).addTo(map);

    tileLayerRef.current = newTileLayer;
  }, [basemap]);

  // Update National Boundary of India (Makes India's outline unmistakably clear!)
  useEffect(() => {
    if (!nationalBoundaryGroupRef.current) return;
    nationalBoundaryGroupRef.current.clearLayers();

    if (!activeLayers.nationalBorder) return;

    // Draw crisp outer boundary polygon of India
    const nationalBorder = L.polyline(INDIA_NATIONAL_OUTLINE, {
      color: basemap === 'dark' || basemap === 'satellite' ? '#F8FAFC' : '#1E293B',
      weight: 2.2,
      opacity: 0.95,
      className: 'india-national-border',
    });

    nationalBorder.bindTooltip(
      `<div class="p-1 font-mono text-[10px]">
        <div class="font-bold text-[#1E293B]">REPUBLIC OF INDIA</div>
        <div>Sovereign Hybrid Connectivity Digital Twin</div>
      </div>`,
      { sticky: true }
    );

    nationalBorder.addTo(nationalBoundaryGroupRef.current);
  }, [activeLayers.nationalBorder, basemap]);

  // Update Indian State Boundaries & Labels
  useEffect(() => {
    if (!stateBoundariesGroupRef.current) return;
    stateBoundariesGroupRef.current.clearLayers();

    if (!activeLayers.stateBoundaries) return;

    INDIA_STATES.forEach((state) => {
      // Draw state polygon boundary
      const polygon = L.polygon(state.boundary, {
        color: basemap === 'dark' || basemap === 'satellite' ? '#94A3B8' : '#475569',
        weight: 1.2,
        dashArray: '3,3',
        fillColor: '#D97706',
        fillOpacity: 0.0,
        className: 'state-boundary-polygon',
      });

      polygon.on('click', () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([state.lat, state.lng], state.zoom, {
            duration: 1.2,
          });
        }
      });

      polygon.bindTooltip(
        `<div class="p-1.5 font-mono text-[11px] text-[#202322]">
          <div class="font-bold text-[#D97706] text-xs uppercase">${state.name} (${state.code})</div>
          <div>Capital: <b>${state.capital}</b></div>
          <div>Population: <b>${state.population}</b></div>
          <div>Connectivity Score: <b class="text-[#15803D]">${state.connectivityPct}%</b></div>
          <div class="text-[9px] text-[#606462] mt-1">${state.terrainType}</div>
          <div class="text-[9px] text-[#D97706] font-semibold mt-0.5">Click to zoom into state</div>
        </div>`,
        { sticky: true }
      );

      polygon.addTo(stateBoundariesGroupRef.current!);

      // At national zoom (z < 6), place state capital label
      if (currentZoom < 6) {
        const stateLabelIcon = L.divIcon({
          className: 'state-label',
          html: `<div class="text-[9px] font-mono font-bold tracking-wider text-[#334155] uppercase bg-white/70 backdrop-blur-2xs px-1 py-0.2 rounded border border-[#CBD5E1] whitespace-nowrap shadow-2xs pointer-events-none select-none">
            ${state.name}
          </div>`,
          iconSize: [60, 14],
          iconAnchor: [30, 7],
        });

        L.marker([state.lat, state.lng], { icon: stateLabelIcon }).addTo(
          stateBoundariesGroupRef.current!
        );
      }
    });
  }, [activeLayers.stateBoundaries, basemap, currentZoom]);

  // Update Fiber Routes
  useEffect(() => {
    if (!fiberGroupRef.current) return;
    fiberGroupRef.current.clearLayers();

    if (!activeLayers.fiberRoutes) return;

    fiberRoutes.forEach((route) => {
      const isSevered = failureState.fiberCut && route.id === 'fiber-himalayan-spur';
      const isSelected = selectedFiberRoute?.id === route.id;

      const polyline = L.polyline(route.points, {
        color: isSevered ? '#DC2626' : '#7C3AED',
        weight: isSelected ? 4 : 2.5,
        opacity: isSevered ? 0.95 : 0.85,
        dashArray: isSevered ? '6,6' : undefined,
      });

      polyline.on('click', () => {
        onSelectFiberRoute(route);
      });

      polyline.bindTooltip(
        `<div class="p-1 font-mono text-[10px]">
          <div class="font-bold text-[#7C3AED]">${route.name}</div>
          <div>Capacity: ${route.capacityGbps} Gbps | Util: ${route.utilizationPct}%</div>
          <div class="${isSevered ? 'text-[#DC2626] font-bold' : 'text-[#16A34A]'}">
            Status: ${isSevered ? '⚠ SEVERED (OUTAGE)' : route.status}
          </div>
        </div>`,
        { sticky: true }
      );

      polyline.addTo(fiberGroupRef.current!);
    });
  }, [fiberRoutes, activeLayers.fiberRoutes, failureState.fiberCut, selectedFiberRoute, onSelectFiberRoute]);

  // Update Cellular Towers
  useEffect(() => {
    if (!towersGroupRef.current) return;
    towersGroupRef.current.clearLayers();

    if (!activeLayers.cellularTowers) return;

    // Show towers only at zoom >= 6 to avoid clutter at national zoom
    if (currentZoom < 6) return;

    cellularTowers.forEach((tower) => {
      const isOutage = failureState.cellularOutage && tower.id.includes('kodaikanal');
      const isSelected = selectedTower?.id === tower.id;

      const towerIcon = L.divIcon({
        className: 'tower-marker',
        html: `<div class="w-4 h-4 rounded-full ${
          isOutage ? 'bg-[#DC2626]' : 'bg-[#15803D]'
        } text-white flex items-center justify-center text-[9px] border ${
          isSelected ? 'border-[#202322] ring-2 ring-[#15803D]' : 'border-white'
        } shadow-xs cursor-pointer">
          🗼
        </div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      const marker = L.marker([tower.lat, tower.lng], { icon: towerIcon });
      marker.on('click', () => onSelectTower(tower));

      // Subtle coverage circle
      const coverageCircle = L.circle([tower.lat, tower.lng], {
        radius: tower.coverageRadiusKm * 1000,
        color: isOutage ? '#DC2626' : '#16A34A',
        weight: 1,
        dashArray: '3,3',
        fillColor: isOutage ? '#DC2626' : '#16A34A',
        fillOpacity: 0.04,
      });

      marker.addTo(towersGroupRef.current!);
      coverageCircle.addTo(towersGroupRef.current!);
    });
  }, [cellularTowers, activeLayers.cellularTowers, failureState.cellularOutage, currentZoom, selectedTower, onSelectTower]);

  // Update Ground Stations (Gateway Earth Stations)
  useEffect(() => {
    if (!groundStationsGroupRef.current) return;
    groundStationsGroupRef.current.clearLayers();

    if (!activeLayers.groundStations) return;

    groundStations.forEach((gs) => {
      const isSelected = selectedGroundStation?.id === gs.id;
      const isCandidate = gs.status === 'CANDIDATE';
      const isUnsuitable = gs.status === 'UNSUITABLE';

      const gsIcon = L.divIcon({
        className: 'gs-marker',
        html: `<div class="flex items-center space-x-1 cursor-pointer">
          <div class="w-4 h-4 rounded-xs ${
            isUnsuitable
              ? 'bg-[#DC2626]'
              : isCandidate
              ? 'bg-[#6B7280]'
              : 'bg-[#202322]'
          } text-white flex items-center justify-center text-[9px] border ${
            isSelected ? 'border-[#D97706] ring-2 ring-[#D97706]' : 'border-white'
          } shadow-xs">
            📡
          </div>
          ${
            currentZoom >= 6
              ? `<span class="text-[9px] font-mono bg-white/95 px-1 py-0.2 rounded border border-[#CBC5B7] text-[#202322] whitespace-nowrap shadow-xs font-semibold">
                  ${gs.name.split(' ')[0]}
                </span>`
              : ''
          }
        </div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      const marker = L.marker([gs.lat, gs.lng], { icon: gsIcon });
      marker.on('click', () => onSelectGroundStation(gs));
      marker.addTo(groundStationsGroupRef.current!);
    });
  }, [groundStations, activeLayers.groundStations, currentZoom, selectedGroundStation, onSelectGroundStation]);

  // Update Schools and Hospitals (Only at zoom >= 7 to prevent national map clutter)
  useEffect(() => {
    if (!schoolsGroupRef.current || !hospitalsGroupRef.current) return;
    schoolsGroupRef.current.clearLayers();
    hospitalsGroupRef.current.clearLayers();

    if (currentZoom >= 7) {
      if (activeLayers.schools) {
        schools.forEach((sch) => {
          const schIcon = L.divIcon({
            className: 'sch-marker',
            html: `<div class="w-4 h-4 rounded-full bg-[#0284C7] text-white flex items-center justify-center text-[9px] border border-white shadow-xs cursor-pointer" title="${sch.name}">
              🏫
            </div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          });
          const marker = L.marker([sch.lat, sch.lng], { icon: schIcon });
          marker.on('click', () => onSelectSchool(sch));
          marker.addTo(schoolsGroupRef.current!);
        });
      }

      if (activeLayers.hospitals) {
        hospitals.forEach((hosp) => {
          const hospIcon = L.divIcon({
            className: 'hosp-marker',
            html: `<div class="w-4 h-4 rounded-full bg-[#DC2626] text-white flex items-center justify-center text-[9px] border border-white shadow-xs cursor-pointer" title="${hosp.name}">
              🏥
            </div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          });
          const marker = L.marker([hosp.lat, hosp.lng], { icon: hospIcon });
          marker.on('click', () => onSelectHospital(hosp));
          marker.addTo(hospitalsGroupRef.current!);
        });
      }
    }
  }, [schools, hospitals, currentZoom, activeLayers.schools, activeLayers.hospitals, onSelectSchool, onSelectHospital]);

  // Update Cities and Villages (Progressive Reveal)
  useEffect(() => {
    if (!locationsGroupRef.current) return;
    locationsGroupRef.current.clearLayers();

    locations.forEach((loc) => {
      const isVillage = loc.type === 'village';
      const isCity = loc.type === 'city' || loc.type === 'town';
      const isConnectedNow = connectedVillageIds.has(loc.id);
      const isSelected = selectedLocation?.id === loc.id;

      // Progressive level of detail:
      // At zoom < 7: only show major cities (and selected location)
      if (isVillage && currentZoom < 7 && !isSelected) {
        return;
      }

      let color = '#15803D';
      if (isConnectedNow) {
        color = '#15803D';
      } else if (loc.connectivity === 'CRITICAL') {
        color = '#DC2626';
      } else if (loc.connectivity === 'POOR') {
        color = '#EA580C';
      } else if (loc.connectivity === 'MODERATE') {
        color = '#D97706';
      } else {
        color = '#15803D';
      }

      const icon = L.divIcon({
        className: 'loc-marker',
        html: `<div class="flex items-center space-x-1 cursor-pointer">
          <div class="relative">
            <span class="block ${isCity ? 'w-3 h-3' : 'w-2.5 h-2.5'} rounded-full shadow-xs border ${
          isSelected ? 'border-[#202322] ring-2 ring-[#D97706]' : 'border-white'
        }" style="background-color: ${color};"></span>
            ${
              loc.isDemonstrationTarget && !isConnectedNow
                ? '<span class="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#DC2626] status-beacon"></span>'
                : ''
            }
          </div>
          <span class="text-[10px] font-mono font-bold px-1 py-0.2 rounded bg-white/95 border border-[#CBC5B7] text-[#202322] whitespace-nowrap shadow-xs">
            ${loc.name}
          </span>
        </div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      const marker = L.marker([loc.lat, loc.lng], { icon });
      marker.on('click', () => onSelectLocation(loc));
      marker.addTo(locationsGroupRef.current!);
    });
  }, [locations, currentZoom, connectedVillageIds, selectedLocation, onSelectLocation]);

  // Update Dynamic Satellites & Coverage Beams
  useEffect(() => {
    if (!satellitesGroupRef.current || !satelliteCoverageGroupRef.current) return;
    satellitesGroupRef.current.clearLayers();
    satelliteCoverageGroupRef.current.clearLayers();

    if (!activeLayers.satellitePositions) return;

    satellites.forEach((sat) => {
      const isSelected = selectedSatellite?.id === sat.id;

      // Small compact satellite icon (NOT giant dominating orange symbols!)
      const satIcon = L.divIcon({
        className: 'sat-marker',
        html: `<div class="flex flex-col items-center cursor-pointer select-none">
          <div class="w-4 h-4 rounded-full bg-[#D97706] text-white flex items-center justify-center text-[8px] border border-white shadow-xs ${
            isSelected ? 'ring-2 ring-[#B45309]' : ''
          }">
            🛰
          </div>
          <span class="text-[8px] font-mono font-bold bg-[#1C1F1E] text-[#F5F3EE] px-1 rounded border border-[#3E4542] mt-0.5 whitespace-nowrap">
            ${sat.id}
          </span>
        </div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      const marker = L.marker([sat.lat, sat.lng], { icon: satIcon });
      marker.on('click', () => onSelectSatellite(sat));
      marker.addTo(satellitesGroupRef.current!);

      // Coverage beam: subtle, thin, semi-transparent.
      // ONLY render if explicitly enabled in layers OR if this satellite is currently selected!
      if (activeLayers.satelliteCoverage || isSelected) {
        const circle = L.circle([sat.lat, sat.lng], {
          radius: sat.coverageRadiusKm * 1000,
          color: '#D97706',
          weight: 1,
          dashArray: '4,4',
          fillColor: '#F59E0B',
          fillOpacity: isSelected ? 0.08 : 0.03, // Extremely subtle so India stays clearly visible!
        });
        circle.addTo(satelliteCoverageGroupRef.current!);
      }
    });
  }, [satellites, activeLayers.satellitePositions, activeLayers.satelliteCoverage, selectedSatellite, onSelectSatellite]);

  // Active Flowing Routing Line (When a village is selected or connected)
  useEffect(() => {
    if (!routingBeamGroupRef.current) return;
    routingBeamGroupRef.current.clearLayers();

    if (selectedLocation) {
      let nearestSat = satellites[0];
      let minDist = 999999;
      satellites.forEach((s) => {
        const d = Math.hypot(s.lat - selectedLocation.lat, s.lng - selectedLocation.lng);
        if (d < minDist) {
          minDist = d;
          nearestSat = s;
        }
      });

      let nearestGs = groundStations[0];
      let minGsDist = 999999;
      groundStations
        .filter((g) => g.status === 'OPERATIONAL')
        .forEach((g) => {
          const d = Math.hypot(g.lat - nearestSat.lat, g.lng - nearestSat.lng);
          if (d < minGsDist) {
            minGsDist = d;
            nearestGs = g;
          }
        });

      const isConnected = connectedVillageIds.has(selectedLocation.id);
      const beamColor = isConnected ? '#15803D' : '#D97706';

      const pathPoints: [number, number][] = [
        [selectedLocation.lat, selectedLocation.lng],
        [nearestSat.lat, nearestSat.lng],
        [nearestGs.lat, nearestGs.lng],
      ];

      const flowBeam = L.polyline(pathPoints, {
        color: beamColor,
        weight: 2.5,
        dashArray: '6,4',
        className: 'network-flow-active',
      });

      flowBeam.bindTooltip(
        `<div class="p-1 font-mono text-[10px]">
          <div class="font-bold text-[#D97706]">ACTIVE HYBRID ORBITAL LINK</div>
          <div>Terminal: ${selectedLocation.name}</div>
          <div>LEO Node: ${nearestSat.id} (550 km)</div>
          <div>Earth Gateway: ${nearestGs.name}</div>
        </div>`,
        { sticky: true }
      );

      flowBeam.addTo(routingBeamGroupRef.current!);
    }
  }, [selectedLocation, satellites, groundStations, connectedVillageIds]);

  // Zoom / Pan handlers
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();

  // Reset to full India view
  const handleResetToIndia = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([21.8, 79.2], 5, { duration: 1.2 });
    }
    onResetToIndia();
  };

  // Fly to location when selected
  useEffect(() => {
    if (selectedLocation && mapInstanceRef.current) {
      const targetZoom = selectedLocation.type === 'village' ? 10 : 8;
      mapInstanceRef.current.flyTo([selectedLocation.lat, selectedLocation.lng], targetZoom, {
        duration: 1.2,
      });
    }
  }, [selectedLocation]);

  // Fly to selected Indian state
  const handleSelectState = (stateId: string) => {
    const st = INDIA_STATES.find((s) => s.id === stateId);
    if (st && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([st.lat, st.lng], st.zoom, { duration: 1.2 });
    }
  };

  return (
    <div className="relative w-full h-full bg-[#E9E6DE] overflow-hidden">
      {/* Real Interactive Leaflet Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Map Controls & Overlays */}
      <MapControls
        layers={activeLayers}
        onToggleLayer={onToggleLayer}
        basemap={basemap}
        onChangeBasemap={onChangeBasemap}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetToIndia={handleResetToIndia}
        locations={locations}
        onSelectLocation={onSelectLocation}
        onSelectState={handleSelectState}
        cursorCoords={cursorCoords}
        currentZoom={currentZoom}
      />
    </div>
  );
};
