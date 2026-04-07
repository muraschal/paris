"use client";

import "leaflet/dist/leaflet.css";
import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ExternalLink, X, Camera } from "lucide-react";
import { MapContainer, TileLayer, Marker, Polyline, CircleMarker, Tooltip, useMap, ZoomControl } from "react-leaflet";
import L from "leaflet";
import { locations, days, getLocation } from "@/data/trip";
import type { Location } from "@/data/trip";
import walkingRoutes from "@/data/walking-routes.json";
import metroRoutes from "@/data/metro-routes.json";
import uberRoutes from "@/data/uber-routes.json";

const MAP_STYLES = {
  dark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    label: "Dunkel",
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    label: "Satellite",
  },
  light: {
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    label: "Hell",
  },
} as const;

type MapStyle = keyof typeof MAP_STYLES;

const DAY_COLORS = ["#c9a96e", "#7eb8e0", "#e0a07e"];
const HOVER_COLOR = "#FF2D78";
const DAY_KEY_MAP = ["friday", "saturday", "sunday"];

const STAGE_PALETTES: string[][] = [
  // Friday: alternating warm/cool so neighbors always contrast
  ["#FFD700", "#FF8C00", "#22D3EE", "#FF6B6B", "#4ADE80"],
  // Saturday: same principle
  ["#38BDF8", "#FACC15", "#F472B6", "#34D399", "#C084FC"],
  // Sunday: same principle
  ["#FB7185", "#2DD4BF", "#FCD34D", "#A78BFA", "#38BDF8"],
];
const DAY_LABELS = ["Vendredi", "Samedi", "Dimanche"];

const CATEGORY_SVGS: Record<string, string> = {
  hotel: `<svg viewBox="0 0 24 24" fill="none" stroke="CCC" stroke-width="2" stroke-linecap="round"><path d="M3 21h18M3 7v14M21 7v14M6 11h4v4H6zM14 11h4v4h-4zM9 3h6l3 4H6l3-4z"/></svg>`,
  restaurant: `<svg viewBox="0 0 24 24" fill="none" stroke="CCC" stroke-width="2" stroke-linecap="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>`,
  landmark: `<svg viewBox="0 0 24 24" fill="none" stroke="CCC" stroke-width="2" stroke-linecap="round"><path d="M2 20h20M5 20V8l7-5 7 5v12M9 20v-5h6v5"/></svg>`,
  bar: `<svg viewBox="0 0 24 24" fill="none" stroke="CCC" stroke-width="2" stroke-linecap="round"><path d="M8 22h8M12 15v7M3 2h18l-4 9a4 4 0 0 1-3.8 2.8h-2.4A4 4 0 0 1 7 11L3 2z"/></svg>`,
  cafe: `<svg viewBox="0 0 24 24" fill="none" stroke="CCC" stroke-width="2" stroke-linecap="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8zM6 2v2M10 2v2M14 2v2"/></svg>`,
  entertainment: `<svg viewBox="0 0 24 24" fill="none" stroke="CCC" stroke-width="2" stroke-linecap="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
  shopping: `<svg viewBox="0 0 24 24" fill="none" stroke="CCC" stroke-width="2" stroke-linecap="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"/></svg>`,
  transport: `<svg viewBox="0 0 24 24" fill="none" stroke="CCC" stroke-width="2" stroke-linecap="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"/></svg>`,
};

interface RouteSegment {
  from: Location;
  to: Location;
  transport: "walk" | "uber" | "metro" | "none";
  duration?: string;
  segIndex: number;
}

interface MarkerInfo {
  location: Location;
  visitNumbers: number[];
}

function getChronologicalRoute(dayIndex: number): Location[] {
  const route: Location[] = [];
  let prevId: string | null = null;
  for (const event of days[dayIndex].events) {
    if (!event.locationId) continue;
    if (event.locationId === prevId) continue;
    const loc = getLocation(event.locationId);
    if (loc) {
      route.push(loc);
      prevId = event.locationId;
    }
  }
  return route;
}

function getUniqueLocationsForDay(dayIndex: number): Location[] {
  const seen = new Set<string>();
  const unique: Location[] = [];
  for (const event of days[dayIndex].events) {
    if (!event.locationId || seen.has(event.locationId)) continue;
    const loc = getLocation(event.locationId);
    if (loc) {
      unique.push(loc);
      seen.add(event.locationId);
    }
  }
  return unique;
}

function getMarkersForDay(dayIndex: number): MarkerInfo[] {
  const chronoRoute = getChronologicalRoute(dayIndex);
  const markerMap = new Map<string, MarkerInfo>();

  chronoRoute.forEach((loc, idx) => {
    const existing = markerMap.get(loc.id);
    if (existing) {
      existing.visitNumbers.push(idx + 1);
    } else {
      markerMap.set(loc.id, { location: loc, visitNumbers: [idx + 1] });
    }
  });

  return Array.from(markerMap.values());
}

function getVisitNumberForEvent(dayIndex: number, eventIndex: number): number | null {
  const evts = days[dayIndex]?.events;
  if (!evts || !evts[eventIndex]?.locationId) return null;

  let visitNum = 0;
  let prevId: string | null = null;
  let currentNum: number | null = null;
  for (let i = 0; i < evts.length; i++) {
    const locId = evts[i].locationId;
    if (!locId || locId === prevId) {
      if (i === eventIndex) return currentNum;
      continue;
    }
    visitNum++;
    prevId = locId;
    currentNum = visitNum;
    if (i === eventIndex) return visitNum;
  }
  return currentNum;
}

function getSegmentsForDay(dayIndex: number): RouteSegment[] {
  const chronoRoute = getChronologicalRoute(dayIndex);
  const segments: RouteSegment[] = [];
  const evts = days[dayIndex].events;

  let segIdx = 0;
  let prevLoc: Location | null = null;

  for (const evt of evts) {
    if (!evt.locationId) continue;
    const loc = getLocation(evt.locationId);
    if (!loc) continue;

    if (prevLoc && prevLoc.id !== loc.id) {
      segments.push({
        from: prevLoc,
        to: loc,
        transport: evt.transport,
        duration: evt.transportDuration,
        segIndex: segIdx++,
      });
    }
    prevLoc = loc;
  }
  return segments;
}

/**
 * Generate points along a quadratic bezier arc between two coordinates.
 * The arc bows perpendicular to the line, always to the left of travel direction.
 */
function arcBetween(
  from: [number, number],
  to: [number, number],
  steps = 20,
  bowFactor = 0.15
): [number, number][] {
  const midLat = (from[0] + to[0]) / 2;
  const midLng = (from[1] + to[1]) / 2;

  const dLat = to[0] - from[0];
  const dLng = to[1] - from[1];

  // perpendicular offset for the arc's control point
  const controlLat = midLat + dLng * bowFactor;
  const controlLng = midLng - dLat * bowFactor;

  const points: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const inv = 1 - t;
    const lat = inv * inv * from[0] + 2 * inv * t * controlLat + t * t * to[0];
    const lng = inv * inv * from[1] + 2 * inv * t * controlLng + t * t * to[1];
    points.push([lat, lng]);
  }
  return points;
}

function arcMidpoint(from: [number, number], to: [number, number], bowFactor = 0.15): [number, number] {
  const midLat = (from[0] + to[0]) / 2;
  const midLng = (from[1] + to[1]) / 2;
  const dLat = to[0] - from[0];
  const dLng = to[1] - from[1];
  return [midLat + dLng * bowFactor * 0.5, midLng - dLat * bowFactor * 0.5];
}

function createIcon(color: string, category: string, name: string, visitNumbers?: number[], highlighted?: boolean) {
  const escapedName = name.replace(/'/g, "&#39;").replace(/"/g, "&quot;");
  const hc = highlighted ? HOVER_COLOR : color;
  const svg = (CATEGORY_SVGS[category] || CATEGORY_SVGS.landmark).replace(/CCC/g, hc);

  let numberBadge = "";
  if (visitNumbers && visitNumbers.length > 0) {
    const label = visitNumbers.join("·");
    const w = visitNumbers.length > 1 ? "auto" : "20px";
    const pad = visitNumbers.length > 1 ? "padding:0 5px;" : "";
    numberBadge = `<div style="position:absolute;top:-8px;right:-8px;min-width:20px;width:${w};height:20px;border-radius:10px;background:${hc};color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;line-height:1;border:2px solid #0a0a1a;${pad}">${label}</div>`;
  }

  const scale = highlighted ? "transform:scale(1.4);" : "";
  const glow = highlighted
    ? `box-shadow: 0 0 28px ${HOVER_COLOR}aa, 0 0 12px ${HOVER_COLOR}66;`
    : `box-shadow: 0 0 14px ${color}40, 0 0 4px ${color}25;`;
  const labelStyle = highlighted ? `font-weight:700;opacity:1;color:${HOVER_COLOR};` : "";
  const cursor = "cursor:pointer;";

  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="position:relative;display:flex;flex-direction:column;align-items:center;transition:transform 0.2s ease;${scale}${cursor}">
        <div style="
          position:relative;
          width: 30px; height: 30px; border-radius: 50%;
          background: ${highlighted ? `${HOVER_COLOR}30` : `${color}18`}; border: 2.5px solid ${hc};
          display: flex; align-items: center; justify-content: center;
          ${glow}
          transition: all 0.2s ease;
        ">
          <div style="width:14px;height:14px;">${svg}</div>
          ${numberBadge}
        </div>
        <div class="marker-label" style="${labelStyle}">${escapedName}</div>
      </div>
    `,
    iconSize: [30, 48],
    iconAnchor: [15, 15],
  });
}

function createTransportLabel(segment: RouteSegment, arcMid: [number, number], stageColor?: string) {
  const isUber = segment.transport === "uber";
  const isMetro = segment.transport === "metro";
  const emoji = isMetro ? "🚇" : isUber ? "🚕" : "🚶";
  const text = segment.duration || (isMetro ? "Métro" : isUber ? "Uber" : "");
  const bg = isMetro ? "rgba(0,120,212,0.85)" : isUber ? "rgba(100,70,200,0.8)" : stageColor ? `${stageColor}cc` : "rgba(60,120,60,0.7)";

  return {
    position: arcMid,
    icon: L.divIcon({
      className: "custom-marker",
      html: `<div class="transport-badge" style="background:${bg}">${emoji}${text ? `<span>${text}</span>` : ""}</div>`,
      iconSize: [1, 1],
      iconAnchor: [0, 0],
    }),
  };
}

/** Tighter fit = more zoom while keeping all markers in view; Vendredi (0) tolerates closest zoom. */
function getFitOptions(dayIndex: number | null): { padding: [number, number]; maxZoom: number; singleZoom: number } {
  if (dayIndex === 0) {
    return { padding: [10, 10], maxZoom: 17, singleZoom: 15 };
  }
  if (dayIndex === 1 || dayIndex === 2) {
    return { padding: [18, 18], maxZoom: 16, singleZoom: 14 };
  }
  return { padding: [24, 24], maxZoom: 15, singleZoom: 13 };
}

function FitBounds({ locs, dayIndex }: { locs: Location[]; dayIndex: number | null }) {
  const map = useMap();
  useEffect(() => {
    const { padding, maxZoom, singleZoom } = getFitOptions(dayIndex);
    if (locs.length > 1) {
      const bounds = L.latLngBounds(
        locs.map((l) => [l.coordinates.lat, l.coordinates.lng] as [number, number])
      );
      map.fitBounds(bounds, { padding, maxZoom });
    } else if (locs.length === 1) {
      map.setView([locs[0].coordinates.lat, locs[0].coordinates.lng], singleZoom);
    }
  }, [locs, map, dayIndex]);
  return null;
}

interface HoveredSegment {
  fromId: string;
  toId: string;
  source?: "map" | "timeline";
}

interface RouteMapProps {
  activeDay?: number;
  onDayChange?: (day: number) => void;
  compact?: boolean;
  hoveredLocationId?: string | null;
  hoveredEventKey?: string | null;
  hoveredSegment?: HoveredSegment | null;
  onHoverLocation?: (id: string | null) => void;
  onHoverSegment?: (seg: HoveredSegment | null) => void;
}

export default function RouteMap({ activeDay: externalDay, onDayChange, compact, hoveredLocationId, hoveredEventKey, hoveredSegment, onHoverLocation, onHoverSegment }: RouteMapProps = {}) {
  const [internalDay, setInternalDay] = useState<number | null>(0);
  const activeDay = externalDay ?? internalDay;
  const handleDayChange = (day: number | null) => {
    if (day !== null && onDayChange) onDayChange(day);
    if (!onDayChange) setInternalDay(day);
  };
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [mapStyle, setMapStyle] = useState<MapStyle>("dark");

  const markers = useMemo(
    () => (activeDay !== null ? getMarkersForDay(activeDay) : locations.map(l => ({ location: l, visitNumbers: [] as number[] }))),
    [activeDay]
  );

  const uniqueLocations = useMemo(
    () => (activeDay !== null ? getUniqueLocationsForDay(activeDay) : locations),
    [activeDay]
  );

  const segments = useMemo(
    () => (activeDay !== null ? getSegmentsForDay(activeDay) : []),
    [activeDay]
  );

  const color = activeDay !== null ? DAY_COLORS[activeDay] : DAY_COLORS[0];

  const center = useMemo((): [number, number] => {
    if (uniqueLocations.length > 0) {
      const lat = uniqueLocations.reduce((s, l) => s + l.coordinates.lat, 0) / uniqueLocations.length;
      const lng = uniqueLocations.reduce((s, l) => s + l.coordinates.lng, 0) / uniqueLocations.length;
      return [lat, lng];
    }
    return [48.865, 2.32];
  }, [uniqueLocations]);

  const handleMarkerClick = useCallback((loc: Location) => {
    setSelectedLocation(loc);
  }, []);

  const hasUber = segments.some((s) => s.transport === "uber");
  const hasWalk = segments.some((s) => s.transport === "walk");
  const hasMetro = segments.some((s) => s.transport === "metro");

  return (
    <section id="map" className={compact ? "relative h-full" : "relative py-20"}>
      {/* Header + Day Filter — only in standalone mode */}
      {!compact && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="text-center mb-10"
          >
            <p className="text-text-secondary text-xs tracking-[0.25em] uppercase mb-3">
              Die Route
            </p>
            <h2 className="text-3xl sm:text-5xl font-light tracking-tight">
              <span className="text-gradient-gold">L&apos;Itinéraire</span>
            </h2>
            <p className="text-text-secondary text-sm sm:text-base font-light mt-3 tracking-wide">
              Stationen auf der Route
            </p>
          </motion.div>

          {/* Day Filter */}
          <div className="flex gap-2 justify-center mb-6">
            {DAY_LABELS.map((label, i) => (
              <button
                key={label}
                onClick={() => handleDayChange(activeDay === i ? null : i)}
                className={`px-4 py-2 rounded-full text-xs tracking-wide transition-all duration-300 ${
                  activeDay === i
                    ? "glass-strong text-text-primary"
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                <span
                  className="inline-block w-2 h-2 rounded-full mr-2"
                  style={{ backgroundColor: DAY_COLORS[i], opacity: activeDay === i ? 1 : 0.4 }}
                />
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Map */}
      <div className={compact ? "h-full" : "px-3 sm:px-4 lg:px-6"}>
        <motion.div
          className={`relative overflow-hidden ${compact ? "h-full" : "h-[55vh] sm:h-[65vh] lg:h-[75vh] rounded-2xl glass glow-gold"}`}
          initial={compact ? { opacity: 1 } : { opacity: 0, y: 30 }}
          whileInView={compact ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={compact ? { duration: 0 } : { duration: 0.7, delay: 0.15 }}
        >
          <MapContainer
            center={center}
            zoom={13}
            className={`w-full h-full ${compact ? "" : "rounded-2xl"} ${mapStyle === "light" ? "map-light" : ""} ${mapStyle === "satellite" ? "map-satellite" : ""}`}
            zoomControl={false}
            attributionControl={false}
            scrollWheelZoom={false}
            doubleClickZoom
            touchZoom
          >
            <ZoomControl position="bottomright" />
            <TileLayer key={mapStyle} url={MAP_STYLES[mapStyle].url} />

            {/* Route segments between stops */}
            {(() => {
              const palette = activeDay !== null ? STAGE_PALETTES[activeDay] : STAGE_PALETTES[0];
              const dayKeyForRoutes = activeDay !== null ? DAY_KEY_MAP[activeDay] : null;
              let walkColorIdx = 0;

              const segColors: { stageColor: string; exitWalkColor: string | null }[] = segments.map((seg) => {
                const isUber = seg.transport === "uber";
                const isMetro = seg.transport === "metro";

                if (isMetro) {
                  let ewColor: string | null = null;
                  if (dayKeyForRoutes) {
                    const mr = metroRoutes.find((r) => r.from === seg.from.id && r.to === seg.to.id && r.day === dayKeyForRoutes);
                    if (mr) {
                      const ls = mr.segments[mr.segments.length - 1];
                      const lst = ls.stations[ls.stations.length - 1];
                      const ew = walkingRoutes.find((r) => r.to === seg.to.id && r.day === dayKeyForRoutes
                        && Math.abs((getLocation(r.from)?.coordinates.lat ?? 0) - lst.lat) < 0.002
                        && Math.abs((getLocation(r.from)?.coordinates.lng ?? 0) - lst.lng) < 0.002);
                      if (ew) {
                        ewColor = palette[walkColorIdx % palette.length];
                        walkColorIdx++;
                      }
                    }
                  }
                  return { stageColor: "#0078D4", exitWalkColor: ewColor };
                }
                if (isUber) return { stageColor: "#8b6cda", exitWalkColor: null };
                const isPontToLouvreWalk =
                  dayKeyForRoutes === "sunday"
                  && seg.from.id === "pont-des-arts"
                  && seg.to.id === "louvre";
                const c = isPontToLouvreWalk ? "#f97316" : palette[walkColorIdx % palette.length];
                walkColorIdx++;
                return { stageColor: c, exitWalkColor: null };
              });

              return segments.map((seg, i) => {
              const from: [number, number] = [seg.from.coordinates.lat, seg.from.coordinates.lng];
              const to: [number, number] = [seg.to.coordinates.lat, seg.to.coordinates.lng];
              const isUber = seg.transport === "uber";
              const isMetro = seg.transport === "metro";
              const isNonWalk = isUber || isMetro;

              const stageColor = segColors[i].stageColor;
              const exitWalkStageColor = segColors[i].exitWalkColor;

              const dayKey = activeDay !== null ? DAY_KEY_MAP[activeDay] : null;

              const isSat = mapStyle === "satellite";

              /* ── Detailed metro route ── */
              if (isMetro && dayKey) {
                const metroRoute = metroRoutes.find(
                  (r) => r.from === seg.from.id && r.to === seg.to.id && r.day === dayKey
                );
                if (metroRoute) {
                  const lastMetroSeg = metroRoute.segments[metroRoute.segments.length - 1];
                  const lastStation = lastMetroSeg.stations[lastMetroSeg.stations.length - 1];
                  const exitWalk = walkingRoutes.find(
                    (r) => r.day === dayKey
                      && Math.abs((getLocation(r.from)?.coordinates.lat ?? 0) - lastStation.lat) < 0.002
                      && Math.abs((getLocation(r.from)?.coordinates.lng ?? 0) - lastStation.lng) < 0.002
                      && r.to === seg.to.id
                  );
                  const exitWalkFromLoc = exitWalk ? getLocation(exitWalk.from) : null;
                  const metroHubId = exitWalkFromLoc?.id;

                  const metroSegHighlighted = hoveredSegment != null
                    && hoveredSegment.fromId === seg.from.id
                    && hoveredSegment.toId === (metroHubId || seg.to.id);
                  const walkSegHighlighted = exitWalk && hoveredSegment != null
                    && hoveredSegment.fromId === (metroHubId || "")
                    && hoveredSegment.toId === seg.to.id;

                  const metroDimmed = (hoveredSegment != null || hoveredEventKey != null) && !metroSegHighlighted;
                  const metroOpacity = metroDimmed ? 0.15 : metroSegHighlighted ? 1 : 0.85;

                  const metroHoverHandlers = {
                    mouseover: () => onHoverSegment?.({ fromId: seg.from.id, toId: metroHubId || seg.to.id }),
                    mouseout: () => onHoverSegment?.(null),
                  };
                  return (
                    <span key={`seg-${i}`}>
                      {metroRoute.segments.map((lineSeg, li) => {
                        const lineColor = lineSeg.lineColor;
                        const pts: [number, number][] = lineSeg.stations.map((s) => [s.lat, s.lng]);
                        const weight = metroSegHighlighted ? 6 : 4;
                        const glowW = metroSegHighlighted ? 12 : 8;
                        return (
                          <span key={`metro-line-${li}`}>
                            <Polyline
                              positions={pts}
                              pathOptions={{ color: lineColor, weight: glowW, opacity: metroOpacity * 0.2 }}
                            />
                            <Polyline
                              positions={pts}
                              pathOptions={{ color: lineColor, weight, opacity: metroOpacity }}
                            />
                            <Polyline
                              positions={pts}
                              pathOptions={{ color: "transparent", weight: 20, opacity: 0 }}
                              eventHandlers={metroHoverHandlers}
                            />
                            {/* Station dots */}
                            {lineSeg.stations.map((station, si) => {
                              const isTerminal = si === 0 || si === lineSeg.stations.length - 1;
                              const isTransfer = station.name.includes("Étoile");
                              return (
                                <CircleMarker
                                  key={`station-${li}-${si}`}
                                  center={[station.lat, station.lng]}
                                  radius={isTransfer ? 5 : isTerminal ? 4 : 3}
                                  pathOptions={{
                                    color: lineColor,
                                    fillColor: isTransfer ? "#fff" : lineColor,
                                    fillOpacity: metroOpacity,
                                    weight: isTransfer ? 2.5 : 1.5,
                                    opacity: metroOpacity,
                                  }}
                                >
                                  <Tooltip
                                    direction="top"
                                    offset={[0, -6]}
                                    className="metro-station-tooltip"
                                  >
                                    <span style={{ fontSize: "10px", fontWeight: isTransfer ? 700 : 500 }}>
                                      {station.name}
                                      {isTransfer ? " ⇄" : ""}
                                    </span>
                                  </Tooltip>
                                </CircleMarker>
                              );
                            })}
                            {/* Line number label at midpoint */}
                            {(() => {
                              const midSi = Math.floor(pts.length / 2);
                              const midPt = pts[midSi];
                              return (
                                <Marker
                                  position={midPt}
                                  icon={L.divIcon({
                                    className: "custom-marker",
                                    html: `<div class="transport-badge" style="background:${lineColor}dd;font-weight:700;font-size:10px;letter-spacing:0.5px">🚇 M${lineSeg.line}</div>`,
                                    iconSize: [1, 1],
                                    iconAnchor: [0, 0],
                                  })}
                                  interactive={false}
                                />
                              );
                            })()}
                          </span>
                        );
                      })}
                      {/* Walking connection after metro (e.g. Bir-Hakeim → Eiffelturm) */}
                      {(() => {
                        if (!exitWalk || !metroHubId) return null;
                        const walkPts = exitWalk.points as [number, number][];
                        const walkColor = exitWalkStageColor || stageColor;
                        const walkHl = walkSegHighlighted;
                        const walkDim = (hoveredSegment != null || hoveredEventKey != null) && !walkHl;
                        const walkOpacity = walkDim ? 0.15 : walkHl ? 1 : 0.85;
                        const wW = walkHl ? 5 : 3;
                        const walkHoverHandlers = {
                          mouseover: () => onHoverSegment?.({ fromId: metroHubId, toId: seg.to.id }),
                          mouseout: () => onHoverSegment?.(null),
                        };
                        return (
                          <span>
                            <Polyline
                              positions={walkPts}
                              pathOptions={{ color: walkColor, weight: wW + 4, opacity: walkOpacity * 0.15 }}
                            />
                            <Polyline
                              positions={walkPts}
                              pathOptions={{ color: walkColor, weight: wW, opacity: walkOpacity * 0.8, dashArray: "4 6" }}
                            />
                            <Polyline
                              positions={walkPts}
                              pathOptions={{ color: "transparent", weight: 20, opacity: 0 }}
                              eventHandlers={walkHoverHandlers}
                            />
                          </span>
                        );
                      })()}
                    </span>
                  );
                }
              }

              /* ── Walking / Uber / fallback metro ── */
              const segHighlighted = hoveredSegment != null
                && seg.from.id === hoveredSegment.fromId
                && seg.to.id === hoveredSegment.toId;
              const segDimmed = (hoveredSegment != null || hoveredEventKey != null) && !segHighlighted;

              const walkRoute = !isNonWalk && dayKey
                ? walkingRoutes.find((r) => r.from === seg.from.id && r.to === seg.to.id && r.day === dayKey)
                : null;
              const uberRoute = isUber && dayKey
                ? uberRoutes.find((r) => r.from === seg.from.id && r.to === seg.to.id && r.day === dayKey)
                : null;

              const routePoints: [number, number][] = walkRoute
                ? walkRoute.points as [number, number][]
                : uberRoute
                  ? uberRoute.points as [number, number][]
                  : (() => {
                      const pairKey = [seg.from.id, seg.to.id].sort().join("-");
                      const pairCount = segments.filter((s, j) => j < i && [s.from.id, s.to.id].sort().join("-") === pairKey).length;
                      const bow = 0.18 * (pairCount % 2 === 0 ? 1 : -1) * (1 + pairCount * 0.3);
                      return arcBetween(from, to, 24, bow);
                    })();

              const midIdx = Math.floor(routePoints.length / 2);
              const mid: [number, number] = routePoints[midIdx] || arcMidpoint(from, to, 0.15);
              const tLabel = seg.transport !== "none" ? createTransportLabel(seg, mid, (isNonWalk && !uberRoute) ? undefined : stageColor) : null;

              const segColor = stageColor;
              const mainWeight = segHighlighted ? (isSat ? 7 : 5) : (isSat ? 5 : 3);
              const glowWeight = segHighlighted ? (isSat ? 14 : 10) : (isSat ? 10 : 6);
              const hasRealRoute = walkRoute || uberRoute;
              const mainOpacity = segDimmed ? 0.15 : segHighlighted ? 1 : hasRealRoute ? (isSat ? 0.95 : 0.8) : 0.6;

              const segHoverHandlers = {
                mouseover: () => onHoverSegment?.({ fromId: seg.from.id, toId: seg.to.id }),
                mouseout: () => onHoverSegment?.(null),
              };

              return (
                <span key={`seg-${i}`}>
                  {isSat && (
                    <Polyline
                      positions={routePoints}
                      pathOptions={{ color: "#000000", weight: glowWeight + 3, opacity: 0.4 }}
                    />
                  )}
                  <Polyline
                    positions={routePoints}
                    pathOptions={{ color: segColor, weight: glowWeight, opacity: segHighlighted ? 0.3 : isSat ? 0.2 : 0.1 }}
                  />
                  <Polyline
                    positions={routePoints}
                    pathOptions={{
                      color: segColor,
                      weight: mainWeight,
                      opacity: mainOpacity,
                      dashArray: segHighlighted ? undefined : isUber ? "3 7" : walkRoute ? undefined : "6 5",
                    }}
                  />
                  {/* Invisible wide hit-area for hover */}
                  <Polyline
                    positions={routePoints}
                    pathOptions={{ color: "transparent", weight: 20, opacity: 0 }}
                    eventHandlers={segHoverHandlers}
                  />
                  {tLabel && (
                    <Marker
                      position={tLabel.position}
                      icon={tLabel.icon}
                      interactive={false}
                    />
                  )}
                </span>
              );
            });
            })()}

            {/* Location markers with visit numbers */}
            {markers.filter((m) => !m.location.hidden).map((m) => {
              const anySegHover = hoveredSegment != null;
              const isSegEndpoint = anySegHover && (hoveredSegment!.fromId === m.location.id || hoveredSegment!.toId === m.location.id);
              const eventMatchesPoi = (() => {
                if (!hoveredEventKey || activeDay === null) return false;
                const [, eiStr] = hoveredEventKey.split("-");
                const locId = days[activeDay]?.events[parseInt(eiStr, 10)]?.locationId;
                return locId === m.location.id;
              })();
              const poiHighlighted = hoveredLocationId === m.location.id
                || eventMatchesPoi
                || (anySegHover && isSegEndpoint);
              const poiDimmed = (hoveredLocationId != null || hoveredEventKey != null || anySegHover) && !poiHighlighted;

              let displayNumbers = activeDay !== null ? m.visitNumbers : undefined;
              if (hoveredEventKey && activeDay !== null) {
                const [, eiStr] = hoveredEventKey.split("-");
                const ei = parseInt(eiStr, 10);
                const hoveredLocId = days[activeDay]?.events[ei]?.locationId;
                if (hoveredLocId === m.location.id) {
                  const singleNum = getVisitNumberForEvent(activeDay, ei);
                  if (singleNum != null) displayNumbers = [singleNum];
                }
              }

              const markerKey = `${m.location.id}-${poiHighlighted ? "h" : "n"}-${displayNumbers?.join(",") ?? ""}`;
              return (
                <Marker
                  key={markerKey}
                  position={[m.location.coordinates.lat, m.location.coordinates.lng]}
                  icon={createIcon(
                    color,
                    m.location.category,
                    m.location.name,
                    displayNumbers,
                    poiHighlighted
                  )}
                  opacity={poiDimmed ? 0.3 : 1}
                  eventHandlers={{
                    click: () => handleMarkerClick(m.location),
                    mouseover: () => onHoverLocation?.(m.location.id),
                    mouseout: () => onHoverLocation?.(null),
                  }}
                />
              );
            })}

            <FitBounds locs={uniqueLocations} dayIndex={activeDay} />
          </MapContainer>

          {/* Map Style Switcher */}
          <div className={`absolute z-[400] flex rounded-lg overflow-hidden glass-strong ${compact ? "bottom-3 left-3" : "top-3 right-3"}`}>
            {(Object.keys(MAP_STYLES) as MapStyle[]).map((key) => (
              <button
                key={key}
                onClick={() => setMapStyle(key)}
                className={`px-3 py-1.5 text-[10px] tracking-wide transition-all duration-200 ${
                  mapStyle === key
                    ? "bg-gold/20 text-gold font-semibold"
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                {MAP_STYLES[key].label}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Legend + Bottom Sheet — only in standalone mode */}
      {!compact && <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Legend */}
        {activeDay !== null && segments.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-5 mt-5 text-[10px] text-text-muted"
          >
            {hasWalk && (
              <span className="flex items-center gap-1.5">
                <svg width="24" height="6" className="shrink-0">
                  {(() => {
                    const palette = STAGE_PALETTES[activeDay];
                    const walkSegs = segments.filter((s) => s.transport === "walk");
                    const count = Math.min(walkSegs.length, palette.length);
                    const w = 24 / count;
                    return Array.from({ length: count }, (_, j) => (
                      <rect key={j} x={j * w} y="1" width={w} height="4" rx="2" fill={palette[j]} opacity="0.8" />
                    ));
                  })()}
                </svg>
                Etappen
              </span>
            )}
            {hasMetro && (
              <span className="flex items-center gap-1.5">
                <svg width="20" height="6"><line x1="0" y1="3" x2="20" y2="3" stroke="#0078D4" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.7" /></svg>
                🚇 Métro
              </span>
            )}
            {hasUber && (
              <span className="flex items-center gap-1.5">
                <svg width="20" height="6"><line x1="0" y1="3" x2="20" y2="3" stroke="#8b6cda" strokeWidth="1.5" strokeDasharray="2 4" opacity="0.6" /></svg>
                🚕 Uber
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[8px] font-bold" style={{ background: color, color: "#0a0a1a" }}>1</span>
              Reihenfolge
            </span>
          </motion.div>
        )}

        {/* Bottom Sheet for selected location */}
        <AnimatePresence>
          {selectedLocation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="mt-4 glass-strong rounded-2xl p-4 relative"
            >
              <button
                onClick={() => setSelectedLocation(null)}
                className="absolute top-3 right-3 p-1 rounded-full hover:bg-glass-hover transition-colors"
              >
                <X className="w-4 h-4 text-text-muted" />
              </button>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full glass-gold flex items-center justify-center shrink-0">
                  {selectedLocation.photoSpot ? (
                    <Camera className="w-3.5 h-3.5 text-gold" />
                  ) : (
                    <MapPin className="w-3.5 h-3.5 text-gold" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-medium text-text-primary">{selectedLocation.name}</h4>
                  <p className="text-xs text-text-secondary mt-0.5">{selectedLocation.address}</p>
                  {selectedLocation.photoSpot && (
                    <span className="inline-block mt-1.5 text-[9px] px-2 py-0.5 rounded-full bg-gold/10 text-gold uppercase tracking-wider">
                      Photo Spot
                    </span>
                  )}
                  <a
                    href={selectedLocation.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex items-center gap-1.5 text-xs text-gold hover:text-gold-light transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Navigation starten
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>}
    </section>
  );
}
