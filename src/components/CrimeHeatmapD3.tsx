import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { FirAnalysisResult, HistoryItem } from '../types';
import { demoCases } from '../data';
import { MapPin, ZoomIn, ZoomOut, RotateCcw, Flame, Navigation, ArrowLeft } from 'lucide-react';

interface CrimeHeatmapD3Props {
  activeResult: FirAnalysisResult | null;
  history: HistoryItem[];
  onBackToDashboard?: () => void;
}

interface IncidentPoint {
  id: string;
  label: string;
  state: string;
  district: string;
  policeStation: string;
  lat: number;
  lng: number;
  threatLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  intensity: number;
  summary: string;
  isCurrent: boolean;
}

// Lookup coordinates for Indian states & major cities when lat/lng are omitted
const INDIA_COORDINATE_LOOKUP: Record<string, [number, number]> = {
  maharashtra: [19.076, 72.8777],
  mumbai: [19.076, 72.8777],
  "mumbai suburban": [19.1136, 72.8697],
  pune: [18.5204, 73.8567],
  nagpur: [21.1458, 79.0882],
  delhi: [28.6139, 77.209],
  "new delhi": [28.6139, 77.209],
  "south delhi": [28.5494, 77.2001],
  karnataka: [12.9716, 77.5946],
  bengaluru: [12.9716, 77.5946],
  "bengaluru urban": [12.9716, 77.5946],
  telangana: [17.385, 78.4867],
  hyderabad: [17.385, 78.4867],
  "tamil nadu": [13.0827, 80.2707],
  chennai: [13.0827, 80.2707],
  "west bengal": [22.5726, 88.3639],
  kolkata: [22.5726, 88.3639],
  "uttar pradesh": [26.8467, 80.9462],
  lucknow: [26.8467, 80.9462],
  noida: [28.5355, 77.391],
  varanasi: [25.3176, 82.9739],
  rajasthan: [26.9124, 75.7873],
  jaipur: [26.9124, 75.7873],
  gujarat: [23.0225, 72.5714],
  ahmedabad: [23.0225, 72.5714],
  surat: [21.1702, 72.8311],
  bihar: [25.5941, 85.1376],
  patna: [25.5941, 85.1376],
  jharkhand: [23.3441, 85.3096],
  jamtara: [23.9629, 86.8026],
  ranchi: [23.3441, 85.3096],
  "madhya pradesh": [23.2599, 77.4126],
  bhopal: [23.2599, 77.4126],
  indore: [22.7196, 75.8577],
  chandigarh: [30.7333, 76.7794],
  punjab: [30.901, 75.8573],
  haryana: [28.4595, 77.0266],
  gurugram: [28.4595, 77.0266],
  assam: [26.1445, 91.7362],
  guwahati: [26.1445, 91.7362],
  "kamrup metropolitan": [26.1445, 91.7362],
  kerala: [9.9312, 76.2673],
  ernakulam: [9.9816, 76.2999],
  kochi: [9.9312, 76.2673],
  thiruvananthapuram: [8.5241, 76.9366],
  "andhra pradesh": [17.6868, 83.2185],
  visakhapatnam: [17.6868, 83.2185],
  odisha: [20.2961, 85.8245],
  bhubaneswar: [20.2961, 85.8245],
  chhattisgarh: [21.2514, 81.6296],
  raipur: [21.2514, 81.6296],
  uttarakhand: [30.3165, 78.0322],
  dehradun: [30.3165, 78.0322],
  "himachal pradesh": [31.1048, 77.1734],
  shimla: [31.1048, 77.1734],
  "jammu and kashmir": [34.0837, 74.7973],
  srinagar: [34.0837, 74.7973],
  goa: [15.4909, 73.8278],
};

// Simplified GeoJSON polygon outline of India for D3 geoMercator projection
const INDIA_BOUNDARY_GEOJSON: any = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "India" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [77.8, 35.5], [79.0, 34.5], [78.9, 33.2], [79.8, 31.2], [81.0, 30.2],
            [80.1, 28.8], [84.0, 27.4], [88.1, 27.9], [88.9, 27.2], [89.8, 26.7],
            [91.6, 27.8], [94.2, 28.5], [96.5, 28.2], [97.4, 27.8], [95.2, 26.5],
            [94.6, 24.8], [93.2, 23.0], [92.5, 22.0], [91.5, 23.8], [89.9, 25.2],
            [88.8, 24.2], [88.9, 21.6], [87.0, 21.4], [85.8, 19.8], [84.0, 18.2],
            [82.2, 16.9], [80.3, 15.8], [80.3, 13.1], [79.8, 10.3], [78.1, 8.8],
            [77.5, 8.08], [76.6, 8.9], [75.8, 11.2], [74.8, 12.8], [73.8, 15.4],
            [73.0, 18.0], [72.8, 19.1], [72.6, 20.8], [71.5, 20.7], [69.0, 22.3],
            [70.2, 22.9], [68.4, 23.7], [71.0, 24.4], [70.2, 26.8], [71.6, 27.9],
            [73.9, 30.0], [74.6, 31.8], [74.8, 32.9], [74.0, 34.5], [75.8, 35.3],
            [77.8, 35.5]
          ]
        ]
      }
    }
  ]
};

function resolveCoordinates(loc?: { state?: string; district?: string; policeStation?: string; lat?: number; lng?: number }): [number, number] {
  if (loc && typeof loc.lat === 'number' && typeof loc.lng === 'number' && loc.lat >= 6 && loc.lat <= 38 && loc.lng >= 67 && loc.lng <= 98) {
    return [loc.lat, loc.lng];
  }
  const districtKey = loc?.district?.toLowerCase().trim() || '';
  const stateKey = loc?.state?.toLowerCase().trim() || '';
  const psKey = loc?.policeStation?.toLowerCase().trim() || '';

  for (const [key, coords] of Object.entries(INDIA_COORDINATE_LOOKUP)) {
    if (districtKey.includes(key) || psKey.includes(key)) {
      return coords;
    }
  }
  for (const [key, coords] of Object.entries(INDIA_COORDINATE_LOOKUP)) {
    if (stateKey.includes(key)) {
      return coords;
    }
  }
  // Default center (New Delhi)
  return [28.6139, 77.209];
}

function getThreatWeight(level: string): number {
  switch (level) {
    case 'CRITICAL':
      return 100;
    case 'HIGH':
      return 75;
    case 'MEDIUM':
      return 50;
    default:
      return 25;
  }
}

export function CrimeHeatmapD3({ activeResult, history, onBackToDashboard }: CrimeHeatmapD3Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<IncidentPoint | null>(null);
  const [filterLevel, setFilterLevel] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');

  const incidents = useMemo<IncidentPoint[]>(() => {
    const list: IncidentPoint[] = [];

    // 1. Add active FIR result if present
    if (activeResult) {
      const [lat, lng] = resolveCoordinates(activeResult.locationDetails);
      list.push({
        id: 'active-fir',
        label: activeResult.locationDetails?.district
          ? `${activeResult.locationDetails.district} (Active Case)`
          : 'Active FIR Location',
        state: activeResult.locationDetails?.state || 'India',
        district: activeResult.locationDetails?.district || 'Jurisdiction Under Review',
        policeStation: activeResult.locationDetails?.policeStation || 'Assigned Station',
        lat,
        lng,
        threatLevel: activeResult.threatLevel,
        intensity: getThreatWeight(activeResult.threatLevel),
        summary: activeResult.summary,
        isCurrent: true,
      });
    }

    // 2. Add recent session history items
    history.forEach((item, idx) => {
      if (activeResult && item.summary === activeResult.summary) return;
      const [lat, lng] = resolveCoordinates(item.locationDetails);
      list.push({
        id: `hist-${item.id || idx}`,
        label: item.locationDetails?.district || `Case #${idx + 1}`,
        state: item.locationDetails?.state || 'India',
        district: item.locationDetails?.district || 'Recorded District',
        policeStation: item.locationDetails?.policeStation || 'Local PS',
        lat,
        lng,
        threatLevel: item.threatLevel,
        intensity: getThreatWeight(item.threatLevel),
        summary: item.summary,
        isCurrent: false,
      });
    });

    // 3. Add national baseline cases from demoCases for rich geographical density mapping
    demoCases.forEach((demo, idx) => {
      if (activeResult && demo.summary === activeResult.summary) return;
      const [lat, lng] = resolveCoordinates(demo.locationDetails);
      list.push({
        id: `demo-${idx}`,
        label: demo.label,
        state: demo.locationDetails?.state || 'India',
        district: demo.locationDetails?.district || 'District HQ',
        policeStation: demo.locationDetails?.policeStation || 'Station HQ',
        lat,
        lng,
        threatLevel: demo.threatLevel,
        intensity: getThreatWeight(demo.threatLevel),
        summary: demo.summary,
        isCurrent: false,
      });
    });

    if (filterLevel === 'ALL') return list;
    return list.filter((i) => i.threatLevel === filterLevel || i.isCurrent);
  }, [activeResult, history, filterLevel]);

  useEffect(() => {
    const current = incidents.find((i) => i.isCurrent);
    if (current) {
      setSelectedIncident(current);
    } else if (incidents.length > 0 && !selectedIncident) {
      setSelectedIncident(incidents[0]);
    }
  }, [incidents]);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 560;
    const height = 520;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Define radial gradients and glow filters
    const defs = svg.append('defs');

    const filter = defs.append('filter').attr('id', 'heat-blur').attr('x', '-30%').attr('y', '-30%').attr('width', '160%').attr('height', '160%');
    filter.append('feGaussianBlur').attr('stdDeviation', '12');

    // Projection centered on India
    const projection = d3
      .geoMercator()
      .center([82.5, 22.5])
      .scale(880)
      .translate([width / 2, height / 2]);

    const pathGenerator = d3.geoPath().projection(projection);

    const g = svg.append('g').attr('class', 'map-container');

    // Lat/Lon Graticule Grid
    const graticule = d3.geoGraticule().step([4, 4]);
    g.append('path')
      .datum(graticule())
      .attr('d', pathGenerator as any)
      .attr('fill', 'none')
      .attr('stroke', '#334155')
      .attr('stroke-width', 0.5)
      .attr('stroke-dasharray', '2,3')
      .attr('opacity', 0.45);

    // India Polygon Outline
    g.append('path')
      .datum(INDIA_BOUNDARY_GEOJSON)
      .attr('d', pathGenerator as any)
      .attr('fill', '#0f172a')
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 1.5)
      .attr('opacity', 0.9);

    // Prepare projected points weighted by threat intensity for D3 density contours
    const weightedPoints: [number, number][] = [];
    incidents.forEach((inc) => {
      const coords = projection([inc.lng, inc.lat]);
      if (coords) {
        const repeatCount = Math.max(1, Math.round(inc.intensity / 20)) + (inc.isCurrent ? 4 : 0);
        for (let r = 0; r < repeatCount; r++) {
          weightedPoints.push([coords[0], coords[1]]);
        }
      }
    });

    // D3 Contour Density Heatmap Layer
    const densityData = d3
      .contourDensity<[number, number]>()
      .x((d) => d[0])
      .y((d) => d[1])
      .size([width, height])
      .bandwidth(32)
      .thresholds(12)(weightedPoints);

    const maxVal = d3.max(densityData, (d) => d.value) || 0.01;
    const colorScale = d3.scaleSequential(d3.interpolateYlOrRd).domain([0, maxVal]);

    g.append('g')
      .attr('class', 'density-contours')
      .attr('filter', 'url(#heat-blur)')
      .selectAll('path')
      .data(densityData)
      .enter()
      .append('path')
      .attr('d', d3.geoPath())
      .attr('fill', (d) => colorScale(d.value))
      .attr('opacity', (d) => Math.min(0.68, 0.18 + (d.value / maxVal) * 0.55))
      .attr('stroke', 'none');

    // Plot individual crime heat circles + interactive incident markers
    const nodesGroup = g.append('g').attr('class', 'incident-nodes');

    incidents.forEach((inc) => {
      const coords = projection([inc.lng, inc.lat]);
      if (!coords) return;
      const [cx, cy] = coords;

      const markerColor =
        inc.threatLevel === 'CRITICAL'
          ? '#ef4444'
          : inc.threatLevel === 'HIGH'
          ? '#f97316'
          : inc.threatLevel === 'MEDIUM'
          ? '#f59e0b'
          : '#10b981';

      // Ambient heat aura per incident
      nodesGroup
        .append('circle')
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('r', inc.isCurrent ? 28 : (inc.intensity / 100) * 20 + 8)
        .attr('fill', markerColor)
        .attr('opacity', inc.isCurrent ? 0.35 : 0.2)
        .attr('filter', 'url(#heat-blur)')
        .style('pointer-events', 'none');

      // Pulsing outer ring for active FIR location
      if (inc.isCurrent) {
        nodesGroup
          .append('circle')
          .attr('cx', cx)
          .attr('cy', cy)
          .attr('r', 15)
          .attr('fill', 'none')
          .attr('stroke', '#38bdf8')
          .attr('stroke-width', 2)
          .attr('stroke-dasharray', '3,2')
          .attr('opacity', 0.95);
      }

      // Core interactive node
      nodesGroup
        .append('circle')
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('r', inc.isCurrent ? 7.5 : 5)
        .attr('fill', markerColor)
        .attr('stroke', inc.isCurrent ? '#ffffff' : '#0f172a')
        .attr('stroke-width', inc.isCurrent ? 2.5 : 1.5)
        .style('cursor', 'pointer')
        .on('click', () => {
          setSelectedIncident(inc);
        });

      // City/District label for active or CRITICAL cases
      if (inc.isCurrent || inc.threatLevel === 'CRITICAL') {
        nodesGroup
          .append('text')
          .attr('x', cx + 9)
          .attr('y', cy + 3)
          .text(inc.district.split(' ')[0])
          .attr('fill', inc.isCurrent ? '#38bdf8' : '#e2e8f0')
          .attr('font-size', inc.isCurrent ? '10px' : '8.5px')
          .attr('font-weight', inc.isCurrent ? '700' : '600')
          .style('pointer-events', 'none');
      }
    });

    // Zoom & Pan Behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 6])
      .on('zoom', (event) => {
        g.attr('transform', event.transform.toString());
      });

    zoomBehaviorRef.current = zoom;
    svg.call(zoom);
  }, [incidents]);

  const handleZoom = (factor: number) => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current).transition().duration(300).call(zoomBehaviorRef.current.scaleBy, factor);
  };

  const handleResetZoom = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current).transition().duration(400).call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
  };

  return (
    <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-6 md:col-span-2 print:hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>Geographical Crime Intensity Heatmap (India D3 Spatial Grid)</span>
          </h3>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
            Maps extracted FIR jurisdiction coordinates & threat severity density across Indian states and districts.
          </p>
        </div>

        {/* Threat Intensity Filter + Back to Main Screen */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setFilterLevel(lvl)}
              className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors border ${
                filterLevel === lvl
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
              }`}
            >
              {lvl}
            </button>
          ))}
          {onBackToDashboard && (
            <button
              type="button"
              onClick={onBackToDashboard}
              className="ml-1 inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white transition-colors cursor-pointer"
              title="Back to Main Dashboard Screen"
            >
              <ArrowLeft className="w-3 h-3" />
              Back to Main Screen
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 bg-slate-950 rounded-xl p-4 border border-slate-800 shadow-inner">
        {/* D3 SVG Map Canvas */}
        <div className="xl:col-span-7 relative flex items-center justify-center bg-slate-900/90 rounded-lg border border-slate-800 overflow-hidden min-h-[360px]">
          <svg
            ref={svgRef}
            viewBox="0 0 560 520"
            className="w-full h-auto max-h-[420px] select-none"
          />

          {/* Map Zoom Controls */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 bg-slate-900/90 border border-slate-700 p-1.5 rounded-lg shadow-md">
            <button
              type="button"
              onClick={() => handleZoom(1.4)}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleZoom(0.7)}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
              title="Reset Map"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Legend */}
          <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-800 px-3 py-2 rounded-lg text-[10px] text-slate-300 flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span> Critical
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block"></span> High
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> Medium
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> Low
            </span>
            <span className="flex items-center gap-1.5 text-sky-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full border-2 border-sky-400 inline-block"></span> Active FIR
            </span>
          </div>
        </div>

        {/* Selected Hotspot & Jurisdiction Inspector */}
        <div className="xl:col-span-5 flex flex-col justify-between bg-slate-900/70 border border-slate-800 rounded-lg p-4 space-y-4">
          {selectedIncident ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <MapPin className={`w-4 h-4 ${selectedIncident.isCurrent ? 'text-sky-400' : 'text-red-400'}`} />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    {selectedIncident.isCurrent ? 'Active Case Jurisdiction' : 'Hotspot Telemetry'}
                  </span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    selectedIncident.threatLevel === 'CRITICAL'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : selectedIncident.threatLevel === 'HIGH'
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      : selectedIncident.threatLevel === 'MEDIUM'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {selectedIncident.threatLevel} ({selectedIncident.intensity}% Heat)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-950/70 p-2.5 rounded border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 uppercase block">State</span>
                  <span className="font-semibold text-slate-200">{selectedIncident.state}</span>
                </div>
                <div className="bg-slate-950/70 p-2.5 rounded border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 uppercase block">District</span>
                  <span className="font-semibold text-slate-200">{selectedIncident.district}</span>
                </div>
                <div className="col-span-2 bg-slate-950/70 p-2.5 rounded border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 uppercase block">Handling Police Station</span>
                  <span className="font-semibold text-sky-400">{selectedIncident.policeStation}</span>
                </div>
                <div className="col-span-2 bg-slate-950/70 p-2 rounded border border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Navigation className="w-3 h-3 text-slate-500" /> Geo-Coords:
                  </span>
                  <span>
                    {selectedIncident.lat.toFixed(4)}° N, {selectedIncident.lng.toFixed(4)}° E
                  </span>
                </div>
              </div>

              <div className="bg-slate-950/50 p-3 rounded border border-slate-800/70">
                <span className="text-[10px] text-slate-500 uppercase block mb-1">Incident Summary</span>
                <p className="text-xs text-slate-300 leading-relaxed">{selectedIncident.summary}</p>
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-400 py-8 text-center">
              Click any hotspot node on the India map to inspect jurisdiction details.
            </div>
          )}

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Plotted Incidents: {incidents.length}</span>
            <span className="text-slate-500">Click nodes or scroll to zoom</span>
          </div>
        </div>
      </div>
    </div>
  );
}
