import React, { useState } from 'react';
import {
  Search,
  Layers,
  Plus,
  Minus,
  Maximize2,
  X,
  Compass,
  MapPin,
  Mountain,
  Globe,
  Sun,
  Moon
} from 'lucide-react';
import { MapLayerToggles, LocationData, BasemapType } from '../types';
import { INDIA_STATES } from '../data/indiaStates';

interface MapControlsProps {
  layers: MapLayerToggles;
  onToggleLayer: (key: keyof MapLayerToggles) => void;
  basemap: BasemapType;
  onChangeBasemap: (base: BasemapType) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetToIndia: () => void;
  locations: LocationData[];
  onSelectLocation: (loc: LocationData) => void;
  onSelectState: (stateId: string) => void;
  cursorCoords: { lat: number; lng: number } | null;
  currentZoom: number;
}

export const MapControls: React.FC<MapControlsProps> = ({
  layers,
  onToggleLayer,
  basemap,
  onChangeBasemap,
  onZoomIn,
  onZoomOut,
  onResetToIndia,
  locations,
  onSelectLocation,
  onSelectState,
  cursorCoords,
  currentZoom,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showLayersMenu, setShowLayersMenu] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showBasemapMenu, setShowBasemapMenu] = useState(false);

  const query = searchQuery.trim().toLowerCase();

  // Search results match locations and Indian states
  const matchedLocations = query
    ? locations.filter(
        (loc) =>
          loc.name.toLowerCase().includes(query) ||
          loc.state.toLowerCase().includes(query) ||
          loc.district.toLowerCase().includes(query)
      )
    : [];

  const matchedStates = query
    ? INDIA_STATES.filter(
        (st) =>
          st.name.toLowerCase().includes(query) ||
          st.capital.toLowerCase().includes(query) ||
          st.code.toLowerCase().includes(query)
      )
    : [];

  const layerItems: { key: keyof MapLayerToggles; label: string; color: string }[] = [
    { key: 'geographicMap', label: 'Geographic Base Map', color: '#0284C7' },
    { key: 'nationalBorder', label: 'India National Boundary', color: '#1E293B' },
    { key: 'stateBoundaries', label: 'Indian State Boundaries', color: '#475569' },
    { key: 'terrain', label: 'Himalayan / Ghats Topography', color: '#D97706' },
    { key: 'fiberRoutes', label: 'National Fiber Trunks (BharatNet)', color: '#7C3AED' },
    { key: 'cellularTowers', label: 'Cellular Macro Sites (4G/5G)', color: '#16A34A' },
    { key: 'groundStations', label: 'Gateway Earth Stations', color: '#202322' },
    { key: 'villages', label: 'Villages & Remote Settlements', color: '#DC2626' },
    { key: 'schools', label: 'Schools & Online Exam Centers', color: '#0284C7' },
    { key: 'hospitals', label: 'Hospitals & Telemedicine PHCs', color: '#EF4444' },
    { key: 'satellitePositions', label: 'LEO Satellites (AstraGrid-24)', color: '#D97706' },
    { key: 'satelliteCoverage', label: 'Satellite Coverage Beams (Thin)', color: '#F59E0B' },
    { key: 'population', label: 'Population Heatmap Zones', color: '#B45309' },
    { key: 'networkDemand', label: 'Bandwidth Demand Heatmap', color: '#DC2626' },
    { key: 'connectivityQuality', label: 'Connectivity Quality Gradients', color: '#15803D' },
    { key: 'userDensity', label: 'User Population Clusters', color: '#78350F' },
  ];

  return (
    <>
      {/* Top Left Floating Bar: Search India, Basemap Switcher, Layer Toggles, Reset to India */}
      <div className="absolute top-3 left-3 z-[1000] flex flex-wrap items-center gap-2">
        {/* Real Geographic Search Bar */}
        <div className="relative">
          <div className="flex items-center bg-[#FFFFFF] border border-[#CBC5B7] rounded shadow-xs px-2.5 py-1.5 w-72 md:w-88">
            <Search className="w-3.5 h-3.5 text-[#888D8B] mr-2 shrink-0" />
            <input
              type="text"
              placeholder="SEARCH INDIA (e.g. Chennai, Leh, Kodaikanal, Spiti...)"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              className="bg-transparent text-xs text-[#202322] placeholder-[#888D8B] focus:outline-none w-full font-mono font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setShowSearchResults(false);
                }}
                className="text-[#888D8B] hover:text-[#202322]"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Autocomplete Results */}
          {showSearchResults && (matchedLocations.length > 0 || matchedStates.length > 0) && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#FFFFFF] border border-[#CBC5B7] rounded shadow-xl max-h-72 overflow-y-auto z-[1001] py-1 text-xs font-mono">
              {/* States section */}
              {matchedStates.length > 0 && (
                <div className="px-2.5 py-1 text-[10px] font-bold text-[#767B78] uppercase bg-[#FAF9F5] border-b border-[#EFECE6]">
                  INDIAN STATES
                </div>
              )}
              {matchedStates.map((st) => (
                <button
                  key={st.id}
                  onClick={() => {
                    onSelectState(st.id);
                    setShowSearchResults(false);
                    setSearchQuery(st.name);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#F5F3EE] flex items-center justify-between border-b border-[#F0ECE1] last:border-none"
                >
                  <div>
                    <span className="font-bold text-[#202322]">{st.name}</span>
                    <span className="text-[10px] text-[#6E7370] ml-1.5">Capital: {st.capital}</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#DCFCE7] text-[#15803D] font-bold">
                    STATE • {st.population}
                  </span>
                </button>
              ))}

              {/* Locations section */}
              {matchedLocations.length > 0 && (
                <div className="px-2.5 py-1 text-[10px] font-bold text-[#767B78] uppercase bg-[#FAF9F5] border-b border-[#EFECE6]">
                  CITIES, TOWNS & VILLAGES
                </div>
              )}
              {matchedLocations.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => {
                    onSelectLocation(loc);
                    setShowSearchResults(false);
                    setSearchQuery(loc.name);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#F5F3EE] flex items-center justify-between border-b border-[#F0ECE1] last:border-none"
                >
                  <div>
                    <div className="font-medium text-[#202322]">{loc.name}</div>
                    <div className="text-[10px] text-[#6E7370]">
                      {loc.district}, {loc.state} • {loc.type.toUpperCase()}
                    </div>
                  </div>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-mono uppercase font-bold ${
                      loc.connectivity === 'EXCELLENT' || loc.connectivity === 'GOOD'
                        ? 'bg-[#DCFCE7] text-[#15803D]'
                        : loc.connectivity === 'MODERATE'
                        ? 'bg-[#FEF3C7] text-[#B45309]'
                        : 'bg-[#FEE2E2] text-[#DC2626]'
                    }`}
                  >
                    {loc.connectivity}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Clear "RESET TO INDIA" Button */}
        <button
          onClick={onResetToIndia}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-[#202322] hover:bg-[#323635] text-white border border-[#202322] text-xs font-mono font-bold shadow-xs transition-colors"
          title="Return to National Subcontinent View"
        >
          <Compass className="w-3.5 h-3.5 text-[#D97706]" />
          <span>RESET TO INDIA</span>
        </button>

        {/* Basemap Switcher */}
        <div className="relative">
          <button
            onClick={() => {
              setShowBasemapMenu(!showBasemapMenu);
              setShowLayersMenu(false);
            }}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded bg-[#FFFFFF] hover:bg-[#F5F3EE] text-[#202322] border border-[#CBC5B7] text-xs font-mono shadow-xs transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-[#0284C7]" />
            <span className="hidden sm:inline">BASE MAP:</span>
            <span className="font-bold uppercase text-[11px] text-[#0284C7]">{basemap}</span>
          </button>

          {showBasemapMenu && (
            <div className="absolute top-full left-0 mt-1 w-44 bg-[#FFFFFF] border border-[#CBC5B7] rounded shadow-xl p-1 z-[1002] text-xs font-mono">
              <div className="px-2 py-1 text-[10px] text-[#767B78] uppercase font-bold border-b border-[#EFECE6] mb-1">
                SELECT BASEMAP
              </div>
              {(['standard', 'terrain', 'satellite', 'dark'] as BasemapType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    onChangeBasemap(type);
                    setShowBasemapMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between text-xs capitalize ${
                    basemap === type
                      ? 'bg-[#0284C7] text-white font-bold'
                      : 'text-[#202322] hover:bg-[#F5F3EE]'
                  }`}
                >
                  <span>{type}</span>
                  {basemap === type && <span>✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Map Layers Dropdown Button */}
        <div className="relative">
          <button
            onClick={() => {
              setShowLayersMenu(!showLayersMenu);
              setShowBasemapMenu(false);
            }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded border text-xs font-mono shadow-xs transition-colors ${
              showLayersMenu
                ? 'bg-[#202322] text-white border-[#202322]'
                : 'bg-[#FFFFFF] text-[#202322] border-[#CBC5B7] hover:bg-[#F5F3EE]'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#D97706]" />
            <span className="hidden sm:inline">MAP LAYERS</span>
            <span className="text-[10px] bg-[#EFECE6] text-[#202322] px-1 rounded ml-0.5 font-semibold">
              {Object.values(layers).filter(Boolean).length}
            </span>
          </button>

          {/* Layer Checkboxes Popover */}
          {showLayersMenu && (
            <div className="absolute top-full left-0 mt-1.5 w-80 bg-[#FFFFFF] border border-[#CBC5B7] rounded shadow-xl p-2.5 z-[1002] text-xs font-mono">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#DDD9D0]">
                <span className="font-semibold text-[#202322] text-[11px] uppercase tracking-wide">
                  GIS OVERLAY LAYERS
                </span>
                <button
                  onClick={() => setShowLayersMenu(false)}
                  className="text-[#888D8B] hover:text-[#202322]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                {layerItems.map((item) => {
                  const isChecked = layers[item.key];
                  return (
                    <label
                      key={item.key}
                      className="flex items-center justify-between px-2 py-1 rounded hover:bg-[#F5F3EE] cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <span
                          className="w-2.5 h-2.5 rounded-xs shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-[11px] text-[#333735]">{item.label}</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => onToggleLayer(item.key)}
                        className="rounded border-[#CBC5B7] text-[#D97706] focus:ring-0 cursor-pointer"
                      />
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Top Right Zoom and Fullscreen Controls */}
      <div className="absolute top-3 right-3 z-[1000] flex flex-col space-y-1 bg-[#FFFFFF] border border-[#CBC5B7] rounded shadow-xs p-0.5">
        <button
          onClick={onZoomIn}
          className="p-1.5 hover:bg-[#F5F3EE] text-[#202322] rounded transition-colors"
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={onZoomOut}
          className="p-1.5 hover:bg-[#F5F3EE] text-[#202322] rounded transition-colors border-t border-[#EFECE6]"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={onResetToIndia}
          className="p-1.5 hover:bg-[#F5F3EE] text-[#202322] rounded transition-colors border-t border-[#EFECE6]"
          title="Reset to Full India View"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Bottom Left Floating Legend (Updated to Section 27 Specifications) */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-[#FFFFFF]/95 backdrop-blur-xs border border-[#CBC5B7] rounded shadow-md px-3 py-2 text-[10px] font-mono select-none">
        <div className="font-bold text-[#202322] mb-1.5 flex items-center justify-between border-b border-[#EFECE6] pb-1">
          <span>MAP LEGEND</span>
          <span className="text-[9px] text-[#767B78] uppercase">GIS DIGITAL TWIN</span>
        </div>
        <div className="grid grid-cols-2 gap-x-5 gap-y-2">
          {/* Geography & Connectivity */}
          <div className="space-y-1">
            <div className="text-[9px] text-[#767B78] font-bold uppercase border-b border-[#EFECE6] pb-0.5">
              GEOGRAPHY & STATUS
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-0.5 bg-[#1E293B]" />
              <span className="font-semibold text-[#1E293B]">India Boundary</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-0.5 bg-[#64748B] border-dashed" />
              <span>State Boundary</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-[#15803D]" />
              <span>Good / Excellent</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-[#D97706]" />
              <span>Moderate</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-[#EA580C]" />
              <span>Poor</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
              <span>Critical / Unserved</span>
            </div>
          </div>

          {/* Infrastructure & Services */}
          <div className="space-y-1">
            <div className="text-[9px] text-[#767B78] font-bold uppercase border-b border-[#EFECE6] pb-0.5">
              INFRASTRUCTURE
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-1 bg-[#7C3AED] rounded-xs" />
              <span>Fiber (BharatNet)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 bg-[#16A34A] rounded-xs" />
              <span>Cellular 4G/5G</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 bg-[#202322] rounded-xs text-[7px] text-white flex items-center justify-center font-bold">
                📡
              </span>
              <span>Ground Station</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 bg-[#D97706] rounded-xs text-[7px] text-white flex items-center justify-center font-bold">
                🛰
              </span>
              <span>LEO Satellite</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-[9px]">🏫</span>
              <span>School Center</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-[9px]">🏥</span>
              <span>Telemedicine PHC</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Right Lat/Lng Coordinates & Zoom Level */}
      <div className="absolute bottom-3 right-3 z-[1000] bg-[#FFFFFF]/95 backdrop-blur-xs border border-[#CBC5B7] rounded px-2.5 py-1 text-[10px] font-mono text-[#505452] shadow-xs">
        <span className="font-bold text-[#202322]">ZOOM {currentZoom}</span>
        <span className="mx-2 text-[#DDD9D0]">|</span>
        {cursorCoords ? (
          <>
            <span>LAT: {cursorCoords.lat.toFixed(4)}° N</span>
            <span className="mx-1.5 text-[#DDD9D0]">|</span>
            <span>LNG: {cursorCoords.lng.toFixed(4)}° E</span>
          </>
        ) : (
          <span>INDIA SUB-CONTINENT</span>
        )}
      </div>
    </>
  );
};
