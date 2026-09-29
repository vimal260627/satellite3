import { SatelliteData, WhatIfParameters, WhatIfResult, TerrainDifficulty, GroundStation } from '../types';

/**
 * Deterministic formula-based route scoring engine.
 * Selects optimal bearer (Fiber, Cellular, Satellite, or Hybrid combination).
 */
export function calculateRouteScore(
  fiberAvailable: boolean,
  cellularStatus: 'STRONG_5G' | 'GOOD_4G' | 'WEAK' | 'UNAVAILABLE',
  satelliteAvailable: boolean,
  terrainDifficulty: TerrainDifficulty,
  currentDemandMbps: number,
  peakDemandMbps: number
) {
  const terrainPenalties: Record<TerrainDifficulty, number> = {
    LOW: 5,
    MEDIUM: 20,
    HIGH: 50,
    EXTREME: 85,
  };

  const penalty = terrainPenalties[terrainDifficulty];

  // Fiber Score
  let fiberScore = -100;
  if (fiberAvailable) {
    fiberScore = 95 - penalty * 0.8 - (currentDemandMbps / (peakDemandMbps || 1)) * 10;
  }

  // Cellular Score
  let cellularScore = -100;
  if (cellularStatus === 'STRONG_5G') cellularScore = 88 - penalty * 0.4;
  else if (cellularStatus === 'GOOD_4G') cellularScore = 72 - penalty * 0.5;
  else if (cellularStatus === 'WEAK') cellularScore = 40 - penalty * 0.6;

  // Satellite Score (High terrain immunity)
  let satelliteScore = -100;
  if (satelliteAvailable) {
    // In extreme terrain, satellite is uniquely capable with high elevation line-of-sight
    const terrainAdvantage = terrainDifficulty === 'EXTREME' || terrainDifficulty === 'HIGH' ? 35 : 10;
    satelliteScore = 65 + terrainAdvantage - (currentDemandMbps > 500 ? 15 : 0);
  }

  let selectedPrimary: 'FIBER' | 'CELLULAR' | 'SATELLITE' = 'FIBER';
  let recommendedTech = 'DENSE FIBER';
  let reason = 'High terrestrial optical capacity available with low latency.';

  if (fiberScore >= cellularScore && fiberScore >= satelliteScore && fiberScore > 40) {
    selectedPrimary = 'FIBER';
    recommendedTech = cellularScore > 50 ? 'FIBER + CELLULAR DIVERSE' : 'FIBER ONLY';
    reason = 'Optimal optical backhaul capacity meets peak demand at minimum latency.';
  } else if (satelliteScore >= fiberScore && satelliteScore >= cellularScore) {
    selectedPrimary = 'SATELLITE';
    if (cellularScore > 35) {
      recommendedTech = 'LEO SATELLITE + LOCAL WIRELESS';
      reason = 'Rugged terrain restricts optical trenching; Ku/Ka orbital links provide primary backhaul with local distribution.';
    } else {
      recommendedTech = 'LEO SATELLITE VSAT';
      reason = 'Complete terrestrial gap. High elevation angle enables direct satellite terminal connectivity.';
    }
  } else if (cellularScore > fiberScore && cellularScore > 40) {
    selectedPrimary = 'CELLULAR';
    recommendedTech = satelliteScore > 50 ? 'CELLULAR + SATELLITE BACKUP' : 'CELLULAR MACRO SITE';
    reason = 'Cellular base station provides immediate coverage; satellite configured as cold/warm standby.';
  } else {
    selectedPrimary = 'SATELLITE';
    recommendedTech = 'LEO SATELLITE + LOCAL WIRELESS';
    reason = 'Severe terrestrial deficit. Autonomous satellite terminal deployed with solar microgrid.';
  }

  return {
    fiberScore: Math.max(0, Math.round(fiberScore)),
    cellularScore: Math.max(0, Math.round(cellularScore)),
    satelliteScore: Math.max(0, Math.round(satelliteScore)),
    selectedPrimary,
    recommendedTech,
    reason,
  };
}

/**
 * Predicts and models satellite handover between two LEO satellites.
 */
export function calculateHandoverMetrics(
  sat1: SatelliteData,
  sat2: SatelliteData
) {
  // Distance from central meridian
  const dist1 = Math.abs(sat1.lat - 22.0) + Math.abs(sat1.lng - 79.0);
  const dist2 = Math.abs(sat2.lat - 22.0) + Math.abs(sat2.lng - 79.0);

  // Time remaining before SAT1 drops below 25 deg elevation
  const timeToHandoverSec = Math.max(12, Math.round((28 - dist1) * 9.5));
  const signalMarginDb = Number(((sat2.signalDbm - sat1.signalDbm) * 0.4).toFixed(1));

  let status: 'TRACKING' | 'PREDICTED' | 'EXECUTING' | 'COMPLETED' = 'TRACKING';
  if (timeToHandoverSec <= 15) {
    status = 'EXECUTING';
  } else if (timeToHandoverSec <= 150) {
    status = 'PREDICTED';
  }

  return {
    timeToHandoverSec,
    signalMarginDb,
    status,
    sat1Signal: sat1.signalDbm,
    sat2Signal: sat2.signalDbm,
    elevationAngle1: Math.max(18, Math.round(65 - dist1 * 2.2)),
    elevationAngle2: Math.max(22, Math.round(35 + (25 - dist2) * 2.0)),
  };
}

/**
 * Deterministic What-If parametric optimization calculator.
 */
export function calculateWhatIfOptimization(params: WhatIfParameters): WhatIfResult {
  const {
    population,
    demandMbps,
    satellitesCount,
    groundStationsCount,
    fiberAvailable,
    cellularAvailable,
    satelliteAvailable,
    terrainDifficulty,
  } = params;

  const terrainFactor =
    terrainDifficulty === 'LOW' ? 1.0 :
    terrainDifficulty === 'MEDIUM' ? 1.4 :
    terrainDifficulty === 'HIGH' ? 2.1 : 3.0;

  // Baseline legacy state (unoptimized)
  let baseCoverage = 0;
  if (fiberAvailable) baseCoverage += 45;
  if (cellularAvailable) baseCoverage += 35;
  baseCoverage = Math.max(12, Math.min(85, Math.round(baseCoverage / Math.sqrt(terrainFactor))));

  const baseUnservedUsers = Math.round(population * (1 - baseCoverage / 100));
  const baseCongestion = Math.min(96, Math.max(15, Math.round((demandMbps / 500) * 45 * terrainFactor)));
  const baseLatency = Math.round(
    fiberAvailable ? 32 * terrainFactor : cellularAvailable ? 78 * terrainFactor : 145
  );

  // Optimized state calculation with AstraGrid intelligent hybrid routing
  let optCapacityMultiplier = 1.0;
  if (satelliteAvailable) {
    optCapacityMultiplier += (satellitesCount / 24) * 0.85;
  }
  if (groundStationsCount >= 4) {
    optCapacityMultiplier += (groundStationsCount / 10) * 0.45;
  }

  let optCoverage = baseCoverage;
  if (satelliteAvailable) {
    optCoverage += Math.round(40 * (satellitesCount / 24) * (groundStationsCount / 6));
  }
  if (cellularAvailable) optCoverage += 12;
  if (fiberAvailable) optCoverage += 15;
  optCoverage = Math.min(98.8, Math.max(baseCoverage + 14, Math.round(optCoverage)));

  const optUnservedUsers = Math.max(
    Math.round(population * 0.02),
    Math.round(population * (1 - optCoverage / 100))
  );

  const optCongestion = Math.max(
    8,
    Math.round(baseCongestion / (optCapacityMultiplier * 1.6))
  );

  const optLatency = Math.max(
    28,
    Math.round(
      fiberAvailable
        ? 18 * Math.sqrt(terrainFactor)
        : 48 + (30 / Math.sqrt(groundStationsCount))
    )
  );

  const satelliteLoadPct = satelliteAvailable
    ? Math.min(92, Math.max(34, Math.round((demandMbps / (satellitesCount * 25)) * 62)))
    : 0;

  const groundStationsRequired = Math.min(
    18,
    Math.max(2, Math.round((population / 25000) * terrainFactor))
  );

  return {
    before: {
      coveragePct: baseCoverage,
      unservedUsers: baseUnservedUsers,
      congestionPct: baseCongestion,
      latencyMs: baseLatency,
    },
    after: {
      coveragePct: optCoverage,
      unservedUsers: optUnservedUsers,
      congestionPct: optCongestion,
      latencyMs: optLatency,
    },
    satelliteLoadPct,
    groundStationsRequired,
    timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false }) + ' IST',
  };
}

/**
 * 24-hour diurnal bandwidth demand generator.
 */
export function generateHourlyDemand(
  baseDemandMbps: number,
  peakDemandMbps: number,
  examMode = false,
  telemedicineMode = false
) {
  const hours = [
    '00:00', '02:00', '04:00', '06:00', '08:00', '10:00',
    '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'
  ];

  // Diurnal shape factors for 24 hours
  const baseCurve = [0.22, 0.15, 0.12, 0.28, 0.65, 0.94, 0.98, 0.72, 0.81, 0.96, 0.84, 0.48];

  return hours.map((hour, idx) => {
    let multiplier = baseCurve[idx];
    if (examMode && (hour === '10:00' || hour === '12:00' || hour === '14:00')) {
      multiplier = 1.35; // Exam spike
    }
    if (telemedicineMode && (hour === '10:00' || hour === '16:00')) {
      multiplier += 0.25; // Dedicated priority telemedicine channel
    }

    const demand = Math.round(baseDemandMbps + (peakDemandMbps - baseDemandMbps) * multiplier);
    const capacity = Math.round(peakDemandMbps * 1.25);
    const fiberAlloc = Math.round(demand * 0.45);
    const cellularAlloc = Math.round(demand * 0.35);
    const satelliteAlloc = Math.round(demand * 0.20);

    return {
      hour,
      demand,
      capacity,
      fiberAlloc,
      cellularAlloc,
      satelliteAlloc,
    };
  });
}

/**
 * Advances satellite coordinates in their orbital path across India.
 * Simulates 53-degree inclination orbital drift.
 */
export function advanceSatelliteCoordinates(satellites: SatelliteData[], deltaSec = 1.5): SatelliteData[] {
  return satellites.map((sat) => {
    // Velocity is ~7.58 km/s. In deltaSec, distance moved ~ 11.37 km.
    // 1 deg lat ~ 111 km, 1 deg lng ~ 100 km at 20 deg N.
    const degShiftLat = -0.06 * (deltaSec / 1.5); // Moving southward
    const degShiftLng = 0.08 * (deltaSec / 1.5);  // Moving eastward

    let newLat = sat.lat + degShiftLat;
    let newLng = sat.lng + degShiftLng;

    // Wrap around India bounding box [6N to 38N, 66E to 98E]
    if (newLat < 6.0) {
      newLat = 37.5;
      newLng = sat.lng - 6.5;
      if (newLng < 68.0) newLng = 94.0;
    }
    if (newLng > 98.0) {
      newLng = 68.5;
    }

    // Micro fluctuations in load and signal
    const loadDelta = (Math.random() - 0.5) * 1.5;
    const newLoad = Math.min(95, Math.max(30, Math.round(sat.currentLoadPct + loadDelta)));

    return {
      ...sat,
      lat: Number(newLat.toFixed(4)),
      lng: Number(newLng.toFixed(4)),
      currentLoadPct: newLoad,
    };
  });
}
