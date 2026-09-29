export type LocationType = 'village' | 'town' | 'city' | 'district' | 'school' | 'hospital';

export type ConnectivityState = 'EXCELLENT' | 'GOOD' | 'MODERATE' | 'POOR' | 'CRITICAL';

export type TerrainDifficulty = 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';

export interface LocationData {
  id: string;
  name: string;
  state: string;
  district: string;
  type: 'city' | 'town' | 'village';
  lat: number;
  lng: number;
  population: number;
  activeUsers: number;
  connectedUsers: number;
  unservedUsers: number;
  currentDemandMbps: number;
  peakDemandMbps: number;
  connectivity: ConnectivityState;
  connectivityScore: number; // 0 - 100
  latencyMs: number;
  bandwidthMbps: number;
  fiberStatus: 'AVAILABLE' | 'UNAVAILABLE' | 'SEVERED' | 'CONGESTED';
  cellularStatus: 'STRONG_5G' | 'GOOD_4G' | 'WEAK' | 'UNAVAILABLE';
  satelliteStatus: 'AVAILABLE' | 'ACTIVE_SERVING' | 'SEARCHING' | 'OBSTRUCTED';
  terrainDifficulty: TerrainDifficulty;
  elevationMeters: number;
  recommendedSolution: string;
  recommendationReason: string;
  nearby: {
    schools: number;
    hospitals: number;
    towers: number;
    groundStationDistanceKm: number;
  };
  isDemonstrationTarget?: boolean;
  userClusters?: {
    count: number;
    avgDemandPerUserMbps: number;
    totalDemandMbps: number;
  };
  cityProfile?: {
    fiberPct: number;
    cellularPct: number;
    satBackupPct: number;
    peakTrafficGbps: number;
    avgLatencyMs: number;
  };
}

export interface SchoolData {
  id: string;
  name: string;
  locationName: string;
  state: string;
  lat: number;
  lng: number;
  students: number;
  teachers: number;
  currentUsers: number;
  currentDemandMbps: number;
  peakDemandMbps: number;
  connectivity: ConnectivityState;
  examModeActive: boolean;
}

export interface HospitalData {
  id: string;
  name: string;
  locationName: string;
  state: string;
  lat: number;
  lng: number;
  users: number;
  telemedicineActive: boolean;
  currentDemandMbps: number;
  priority: 'CRITICAL' | 'HIGH' | 'STANDARD';
  primaryPath: 'FIBER' | 'SATELLITE' | 'CELLULAR';
  backupPath: 'SATELLITE' | 'CELLULAR';
}

export interface SatelliteData {
  id: string;
  name: string;
  altitudeKm: number;
  velocityKmS: number;
  capacityGbps: number;
  currentLoadPct: number;
  signalDbm: number;
  status: 'SERVING' | 'TRANSIT' | 'STANDBY' | 'DEGRADED';
  lat: number;
  lng: number;
  headingDeg: number;
  coverageRadiusKm: number;
  activeUsers: number;
  latencyMs: number;
  band: 'Ka' | 'Ku' | 'Q/V';
  servingBeam?: string;
}

export interface FiberRoute {
  id: string;
  name: string;
  points: [number, number][];
  lengthKm: number;
  capacityGbps: number;
  utilizationPct: number;
  status: 'OPERATIONAL' | 'SEVERED' | 'MAINTENANCE';
  connectedRegionsCount: number;
  description: string;
}

export interface CellularTower {
  id: string;
  name: string;
  lat: number;
  lng: number;
  technology: '4G' | '5G' | '4G/5G';
  coverageRadiusKm: number;
  connectedUsers: number;
  utilizationPct: number;
  signal: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'WEAK';
  backhaul: 'Fiber' | 'Satellite' | 'Microwave';
  nearbyVillagesCount: number;
  isOperational: boolean;
}

export interface GroundStation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: 'OPERATIONAL' | 'CANDIDATE' | 'UNSUITABLE';
  elevationAngleDeg: number;
  trackingSatelliteId: string;
  backhaulCapacityGbps: number;
  weatherCondition: 'CLEAR' | 'RAIN_FADE' | 'HEAVY_CLOUD';
  suitabilityScore?: number;
  estimatedPopServedMillions?: number;
  notes?: string;
  terrainSuitability: 'OPTIMAL' | 'MODERATE' | 'CHALLENGING';
}

export type BasemapType = 'standard' | 'terrain' | 'satellite' | 'dark';

export interface MapLayerToggles {
  geographicMap: boolean;
  nationalBorder: boolean;
  stateBoundaries: boolean;
  terrain: boolean;
  population: boolean;
  networkDemand: boolean;
  connectivityQuality: boolean;
  satelliteCoverage: boolean;
  satellitePositions: boolean;
  fiberRoutes: boolean;
  cellularTowers: boolean;
  groundStations: boolean;
  schools: boolean;
  hospitals: boolean;
  villages: boolean;
  userDensity: boolean;
}


export interface SimulationFailureState {
  fiberCut: boolean;
  cellularOutage: boolean;
  satelliteAnomaly: boolean;
  demandSpike: boolean;
}

export interface HandoverState {
  currentSatelliteId: string;
  nextSatelliteId: string;
  timeToHandoverSec: number;
  signalMarginDb: number;
  status: 'TRACKING' | 'PREDICTED' | 'EXECUTING' | 'COMPLETED';
}

export interface WhatIfParameters {
  population: number;
  demandMbps: number;
  satellitesCount: number;
  groundStationsCount: number;
  fiberAvailable: boolean;
  cellularAvailable: boolean;
  satelliteAvailable: boolean;
  terrainDifficulty: TerrainDifficulty;
}

export interface WhatIfResult {
  before: {
    coveragePct: number;
    unservedUsers: number;
    congestionPct: number;
    latencyMs: number;
  };
  after: {
    coveragePct: number;
    unservedUsers: number;
    congestionPct: number;
    latencyMs: number;
  };
  satelliteLoadPct: number;
  groundStationsRequired: number;
  timestamp: string;
}

export type ActiveSidebarTab =
  | 'overview'
  | 'map'
  | 'satellites'
  | 'connectivity'
  | 'demand'
  | 'routing'
  | 'handover'
  | 'ground-stations'
  | 'what-if'
  | 'analytics';
