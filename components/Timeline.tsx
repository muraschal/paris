"use client";

import { useState, type ElementType } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Footprints,
  TrainFront,
  Car,
  ExternalLink,
  Hotel,
  UtensilsCrossed,
  Landmark,
  Wine,
  Coffee,
  ShoppingBag,
  Music,
  MapPin,
  Star,
} from "lucide-react";
import { days, getLocation, getUniqueVisitedPoisInOrder, ALL_DAY_INDEX } from "@/data/trip";
import type { TripEvent, Location } from "@/data/trip";
import walkingRoutes from "@/data/walking-routes.json";
import { STAGE_PALETTES } from "@/lib/constants";
import DayTabs from "./DayTabs";
import TimelineEvent from "./TimelineEvent";

const dayColors = ["text-day-1", "text-day-2", "text-day-3"];
const dayKeys = ["friday", "saturday", "sunday"];

const POI_CATEGORY_ICON: Record<Location["category"], ElementType> = {
  hotel: Hotel,
  restaurant: UtensilsCrossed,
  landmark: Landmark,
  bar: Wine,
  cafe: Coffee,
  entertainment: Music,
  shopping: ShoppingBag,
  transport: MapPin,
};

const POI_CATEGORY_LABEL: Record<Location["category"], string> = {
  hotel: "Hotel",
  restaurant: "Restaurant",
  landmark: "Sehenswürdigkeit",
  bar: "Bar",
  cafe: "Café",
  entertainment: "Unterhaltung",
  shopping: "Shopping",
  transport: "Transport",
};

/** Sonntag: Fußweg Pont des Arts → Louvre (eigene Akzentfarbe) */
const PONT_TO_LOUVRE_WALK_COLOR = "#f97316";

/** Route-Pills: symmetrisches Padding + feste Mindesthöhe → echte vertikale Mitte */
const routeBadgePillClass =
  "inline-flex flex-wrap items-center gap-x-2 gap-y-1 min-h-7 px-3 py-1.5 rounded-full border box-border transition-all duration-200 leading-none";

const TRANSPORT_STYLES = {
  walk: {
    Icon: Footprints,
    iconBg: "bg-glass/60",
    iconColor: "text-text-muted",
    pillBg: "bg-glass/40 border-glass-border/50",
    textColor: "text-text-muted",
    arrowColor: "text-text-muted/40",
    durColor: "text-text-secondary",
    label: null,
  },
  metro: {
    Icon: TrainFront,
    iconBg: "bg-[#0078D4]/15",
    iconColor: "text-[#0078D4]",
    pillBg: "bg-[#0078D4]/10 border-[#0078D4]/25",
    textColor: "text-[#0078D4]/80",
    arrowColor: "text-[#0078D4]/40",
    durColor: "text-[#0078D4]/70",
    label: "Métro",
  },
  uber: {
    Icon: Car,
    iconBg: "bg-purple-500/15",
    iconColor: "text-purple-400",
    pillBg: "bg-purple-500/10 border-purple-500/20",
    textColor: "text-purple-400/80",
    arrowColor: "text-purple-400/40",
    durColor: "text-purple-400/70",
    label: "Uber",
  },
} as const;

function TimeSpacer({ from, to }: { from: TripEvent; to: TripEvent }) {
  const parse = (t: string) => {
    const clean = t.replace("~", "");
    if (clean === "Late") return null;
    const [h, m] = clean.split(":").map(Number);
    return h * 60 + m;
  };
  const fromEnd = parse(from.endTime || from.time);
  const toStart = parse(to.time);
  if (fromEnd == null || toStart == null) return null;
  let gap = toStart - fromEnd;
  if (gap < 0) gap += 24 * 60;
  if (gap < 30) return null;

  const hrs = Math.floor(gap / 60);
  const mins = gap % 60;
  const label = hrs > 0 ? (mins > 0 ? `${hrs}h${mins.toString().padStart(2, "0")}` : `${hrs}h`) : `${mins} Min`;

  return (
    <div className="flex gap-4 sm:gap-5">
      <div className="flex flex-col items-center shrink-0">
        <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
        </div>
        <div className="w-px flex-1 min-h-[4px] bg-gradient-to-b from-glass-border/30 to-transparent" />
      </div>
      <div className="flex-1 pb-2 flex items-center">
        <span className="text-[10px] text-text-muted/50 italic">{label} freie Zeit</span>
      </div>
    </div>
  );
}

interface HoveredSegment {
  fromId: string;
  toId: string;
}

function TransportConnector({ from, to, event, dayKey, segmentColor, hoveredSegment, hoveredEventKey, hoveredLocationId, onHoverSegment, overrideToName, overrideFromId, overrideToId }: {
  from: TripEvent;
  to: TripEvent;
  event: TripEvent;
  dayKey: string;
  segmentColor: string;
  hoveredSegment?: HoveredSegment | null;
  hoveredEventKey?: string | null;
  hoveredLocationId?: string | null;
  onHoverSegment?: (seg: HoveredSegment | null) => void;
  overrideToName?: string;
  overrideFromId?: string;
  overrideToId?: string;
}) {
  const fromLoc = from.locationId ? getLocation(from.locationId) : null;
  const toLoc = event.locationId ? getLocation(event.locationId) : null;
  if (!fromLoc || !toLoc || fromLoc.id === toLoc.id) return null;

  const mode = event.transport as "walk" | "metro" | "uber";
  const style = TRANSPORT_STYLES[mode] || TRANSPORT_STYLES.walk;
  const { Icon, durColor, label } = style;

  const dur = event.transportDuration;

  const route = mode === "walk"
    ? walkingRoutes.find((r) => r.from === fromLoc.id && r.to === toLoc.id && r.day === dayKey)
    : null;
  const distKm = route ? (route.distanceMeters / 1000).toFixed(1) : null;

  const segFrom = overrideFromId || fromLoc.id;
  const segTo = overrideToId || toLoc.id;

  const isHighlighted = hoveredSegment != null
    && hoveredSegment.fromId === segFrom
    && hoveredSegment.toId === segTo;
  const isDimmed =
    (hoveredSegment != null || hoveredEventKey != null || hoveredLocationId != null) && !isHighlighted;

  const c = segmentColor;

  return (
    <div
      className={`flex gap-4 sm:gap-5 cursor-pointer transition-opacity duration-200 ${isDimmed ? "opacity-40" : "opacity-100"}`}
      onMouseEnter={() => onHoverSegment?.({ fromId: segFrom, toId: segTo })}
      onMouseLeave={() => onHoverSegment?.(null)}
    >
      <div className="flex flex-col items-center shrink-0">
        <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shrink-0">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-200"
            style={{ background: `${c}20` }}
          >
            <Icon className="w-3 h-3 transition-colors duration-200" style={{ color: c }} />
          </div>
        </div>
        <div className="w-px flex-1 min-h-[8px] bg-gradient-to-b from-glass-border to-transparent" />
      </div>
      <div className="flex-1 flex items-center gap-3 min-w-0">
        <div
          className={routeBadgePillClass}
          style={{
            borderColor: isHighlighted ? `${c}80` : `${c}40`,
            background: isHighlighted ? `${c}1a` : `${c}0d`,
            ...(isHighlighted ? { boxShadow: `0 0 20px ${c}30` } : {}),
          }}
        >
          <span className="text-[10px] leading-none tracking-wide transition-colors duration-200" style={{ color: `${c}cc` }}>
            {fromLoc.name}
          </span>
          <span className="text-[8px] leading-none" style={{ color: `${c}60` }} aria-hidden>
            →
          </span>
          <span className="text-[10px] leading-none tracking-wide transition-colors duration-200" style={{ color: `${c}cc` }}>
            {overrideToName || toLoc.name}
          </span>
          {label && (
            <span
              className="inline-flex items-center justify-center min-h-5 px-1.5 py-0.5 text-[9px] leading-none rounded-full font-semibold"
              style={{ background: `${c}30`, color: c }}
            >
              {label}
            </span>
          )}
          {dur && (
            <span className="text-[10px] leading-none font-mono tabular-nums" style={{ color: `${c}b0` }}>
              {dur}
            </span>
          )}
          {distKm && (
            <span className="text-[9px] leading-none font-mono tabular-nums" style={{ color: `${c}80` }}>
              {distKm} km
            </span>
          )}
          {mode === "uber" && fromLoc && toLoc && (
            <a
              href={`https://m.uber.com/ul/?action=setPickup&pickup[latitude]=${fromLoc.coordinates.lat}&pickup[longitude]=${fromLoc.coordinates.lng}&pickup[formatted_address]=${encodeURIComponent(fromLoc.address)}&dropoff[latitude]=${toLoc.coordinates.lat}&dropoff[longitude]=${toLoc.coordinates.lng}&dropoff[formatted_address]=${encodeURIComponent(toLoc.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center justify-center gap-1 min-h-5 px-1.5 py-0.5 rounded-full transition-all duration-200 hover:scale-105 leading-none"
              style={{ background: `${c}25`, color: c }}
              title="Uber öffnen"
            >
              <ExternalLink className="w-2.5 h-2.5 shrink-0" />
              <span className="text-[8px] font-semibold tracking-wide leading-none">UBER</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function ExitWalkConnector({ fromName, toName, durationMin, distanceKm, color, hoveredSegment, hoveredEventKey, hoveredLocationId, segFromId, segToId, onHoverSegment }: {
  fromName: string;
  toName: string;
  durationMin: number;
  distanceKm: string;
  color: string;
  hoveredSegment?: HoveredSegment | null;
  hoveredEventKey?: string | null;
  hoveredLocationId?: string | null;
  segFromId: string;
  segToId: string;
  onHoverSegment?: (seg: HoveredSegment | null) => void;
}) {
  const isHighlighted = hoveredSegment != null
    && hoveredSegment.fromId === segFromId
    && hoveredSegment.toId === segToId;
  const isDimmed =
    (hoveredSegment != null || hoveredEventKey != null || hoveredLocationId != null) && !isHighlighted;
  const c = color;

  return (
    <div
      className={`flex gap-4 sm:gap-5 cursor-pointer transition-opacity duration-200 ${isDimmed ? "opacity-40" : "opacity-100"}`}
      onMouseEnter={() => onHoverSegment?.({ fromId: segFromId, toId: segToId })}
      onMouseLeave={() => onHoverSegment?.(null)}
    >
      <div className="flex flex-col items-center shrink-0">
        <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shrink-0">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-200"
            style={{ background: `${c}20` }}
          >
            <Footprints className="w-3 h-3 transition-colors duration-200" style={{ color: c }} />
          </div>
        </div>
        <div className="w-px flex-1 min-h-[8px] bg-gradient-to-b from-glass-border to-transparent" />
      </div>
      <div className="flex-1 flex items-center gap-3 min-w-0">
        <div
          className={routeBadgePillClass}
          style={{
            borderColor: isHighlighted ? `${c}80` : `${c}40`,
            background: isHighlighted ? `${c}1a` : `${c}0d`,
            ...(isHighlighted ? { boxShadow: `0 0 20px ${c}30` } : {}),
          }}
        >
          <span className="text-[10px] leading-none tracking-wide transition-colors duration-200" style={{ color: `${c}cc` }}>
            {fromName}
          </span>
          <span className="text-[8px] leading-none" style={{ color: `${c}60` }} aria-hidden>
            →
          </span>
          <span className="text-[10px] leading-none tracking-wide transition-colors duration-200" style={{ color: `${c}cc` }}>
            {toName}
          </span>
          <span className="text-[10px] leading-none font-mono tabular-nums" style={{ color: `${c}b0` }}>
            {durationMin} Min
          </span>
          <span className="text-[9px] leading-none font-mono tabular-nums" style={{ color: `${c}80` }}>
            {distanceKm} km
          </span>
        </div>
      </div>
    </div>
  );
}

interface TimelineProps {
  activeDay?: number;
  onDayChange?: (day: number) => void;
  embedded?: boolean;
  hideTabs?: boolean;
  hoveredLocationId?: string | null;
  hoveredEventKey?: string | null;
  hoveredSegment?: HoveredSegment | null;
  onHoverEvent?: (locationId: string | null, eventKey: string | null) => void;
  onHoverSegment?: (seg: HoveredSegment | null) => void;
}

export default function Timeline({ activeDay: externalDay, onDayChange, embedded, hideTabs, hoveredLocationId, hoveredEventKey, hoveredSegment, onHoverEvent, onHoverSegment }: TimelineProps = {}) {
  const [internalDay, setInternalDay] = useState(0);
  const activeDay = externalDay ?? internalDay;
  const handleDayChange = (day: number) => {
    if (onDayChange) onDayChange(day);
    else setInternalDay(day);
  };
  return (
    <section id="timeline" className={embedded ? "relative px-4 sm:px-5" : "relative py-20 px-4 sm:px-6"}>
      <div className={embedded ? "" : "max-w-3xl mx-auto"}>
        {!embedded && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="text-center mb-10"
          >
            <p className="text-text-secondary text-xs tracking-[0.25em] uppercase mb-3">
              3 Tage Paris
            </p>
            <h2 className="text-3xl sm:text-5xl font-light tracking-tight">
              <span className="text-gradient-gold">L&apos;Itinéraire</span>
            </h2>
            <p className="text-text-secondary text-sm sm:text-base font-light mt-3 tracking-wide">
              Vendredi · Samedi · Dimanche
            </p>
          </motion.div>
        )}

        {/* Day Tabs */}
        {!hideTabs && (
          <div className={`sticky z-20 pt-3 pb-4 bg-navy/80 backdrop-blur-xl ${embedded ? "top-0" : "top-0 -mx-4 px-4 sm:-mx-6 sm:px-6"}`}>
            <DayTabs activeDay={activeDay} onChange={handleDayChange} groupId="timeline" />
          </div>
        )}

        {/* Day Content */}
        <AnimatePresence mode="wait">
          {activeDay === ALL_DAY_INDEX ? (
            <motion.div
              key="all-days"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mt-5 mb-6">
                <h3 className="text-lg sm:text-xl font-light text-gradient-gold tracking-wide">Alle Tage</h3>
                <p className="text-xs sm:text-sm text-text-secondary/80 font-light mt-1 tracking-wide">
                  Alle Orte einmal · kompakte Übersicht
                </p>
                <div className="mt-3 h-px w-16 bg-gradient-to-r from-gold/40 to-transparent" />
              </div>
              {(() => {
                const pois = getUniqueVisitedPoisInOrder();
                const anyHover =
                  hoveredEventKey != null || hoveredSegment != null || hoveredLocationId != null;
                return (
                  <div className="mt-6 space-y-0">
                    {pois.map((loc, i) => {
                      const Icon = POI_CATEGORY_ICON[loc.category] ?? Star;
                      const catLabel = POI_CATEGORY_LABEL[loc.category] ?? "Ort";
                      const isLast = i === pois.length - 1;
                      const isHovered =
                        hoveredEventKey === `all-${i}` ||
                        (hoveredEventKey == null && hoveredLocationId === loc.id);
                      return (
                        <div
                          key={loc.id}
                          className={`flex gap-4 sm:gap-5 transition-opacity duration-200 ${
                            anyHover && !isHovered ? "opacity-40" : "opacity-100"
                          }`}
                        >
                          <div className="flex flex-col items-center pt-1.5 shrink-0">
                            <div
                              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 text-[11px] sm:text-xs font-mono tabular-nums font-semibold transition-all duration-200 ${
                                isHovered
                                  ? "scale-110 text-[#FF2D78] bg-[#FF2D78]/15 ring-2 ring-[#FF2D78]/50 shadow-[0_0_16px_rgba(255,45,120,0.25)]"
                                  : "text-gold/90 glass border border-white/[0.08]"
                              }`}
                            >
                              {i + 1}
                            </div>
                            {!isLast && (
                              <div className="w-px flex-1 min-h-[24px] bg-gradient-to-b from-glass-border to-transparent mt-2" />
                            )}
                          </div>
                          <div className="flex-1 pb-6 sm:pb-7 min-w-0">
                            <button
                              type="button"
                              onMouseEnter={() => onHoverEvent?.(loc.id, `all-${i}`)}
                              onMouseLeave={() => onHoverEvent?.(null, null)}
                              className={`w-full text-left rounded-xl border overflow-hidden transition-all duration-200 ${
                                isHovered
                                  ? "border-[#FF2D78]/30 shadow-[0_0_20px_rgba(255,45,120,0.12)] bg-[#FF2D78]/[0.05]"
                                  : "border-white/[0.07] bg-white/[0.02] hover:border-white/[0.1] hover:bg-white/[0.04]"
                              }`}
                            >
                              <div className="relative px-3.5 py-3 sm:px-4 sm:py-3.5">
                                <div className="flex items-start gap-3">
                                  <div
                                    className={`mt-0.5 shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border transition-colors duration-200 ${
                                      isHovered
                                        ? "border-[#FF2D78]/35 bg-[#FF2D78]/10 text-[#FF2D78]"
                                        : "border-white/[0.08] bg-white/[0.04] text-gold/85"
                                    }`}
                                  >
                                    <Icon className="w-4 h-4" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm sm:text-[15px] font-light text-text-primary tracking-wide leading-snug">
                                      {loc.name}
                                    </p>
                                    <p className="text-[10px] text-text-muted uppercase tracking-[0.14em] mt-1.5">
                                      {catLabel}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </motion.div>
          ) : (
          <motion.div
            key={activeDay}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {(() => {
              const day = days[activeDay];
              return (
            <>
            <div className="mt-5 mb-6">
              {(() => {
                const parts = day.subtitle.split(" — ");
                return (
                  <>
                    <h3 className="text-lg sm:text-xl font-light text-gradient-gold tracking-wide">{parts[0]}</h3>
                    {parts[1] && (
                      <p className="text-xs sm:text-sm text-text-secondary/80 font-light mt-1 tracking-wide">{parts[1]}</p>
                    )}
                  </>
                );
              })()}
              <div className="mt-3 h-px w-16 bg-gradient-to-r from-gold/40 to-transparent" />
            </div>

            <div className="mt-6">
              {(() => {
                const lastNonTransportIdx = (() => {
                  for (let j = day.events.length - 1; j >= 0; j--) {
                    if (day.events[j].transport !== "uber" && day.events[j].transport !== "metro") return j;
                  }
                  return day.events.length - 1;
                })();

                const palette = STAGE_PALETTES[activeDay] || STAGE_PALETTES[0];
                let walkIdx = 0;

                return day.events.map((event, i) => {
                  const isTransport = event.transport === "uber" || event.transport === "metro";
                  const isMetro = event.transport === "metro";
                  const isUber = event.transport === "uber";
                  const prev = i > 0 ? day.events[i - 1] : null;
                  const isWalkWithPrev = event.transport === "walk" && prev && event.transportDuration;

                  const prevLoc = prev?.locationId ? getLocation(prev.locationId) : null;
                  const curLoc = event.locationId ? getLocation(event.locationId) : null;
                  const isNewSegment = prevLoc && curLoc && prevLoc.id !== curLoc.id;

                  let segColor: string;
                  if (isMetro) segColor = "#0078D4";
                  else if (isUber) segColor = "#8b6cda";
                  else if (isNewSegment && isWalkWithPrev) {
                    if (prevLoc?.id === "pont-des-arts" && curLoc?.id === "louvre") {
                      segColor = PONT_TO_LOUVRE_WALK_COLOR;
                    } else {
                      segColor = palette[walkIdx % palette.length];
                    }
                    walkIdx++;
                  } else {
                    segColor = palette[walkIdx % palette.length];
                  }

                  if (isTransport && prev) {
                    const exitWalk = isMetro
                      ? walkingRoutes.find((r) => r.to === (curLoc?.id ?? "") && r.day === dayKeys[activeDay] && getLocation(r.from)?.hidden)
                      : null;
                    const exitWalkFrom = exitWalk ? getLocation(exitWalk.from) : null;
                    const walkColor = palette[walkIdx % palette.length];
                    if (exitWalk) walkIdx++;

                    const metroSegFromId = prev.locationId ?? "";
                    const metroSegToId = exitWalkFrom?.id ?? (event.locationId ?? "");
                    const walkSegFromId = exitWalkFrom?.id ?? "";
                    const walkSegToId = event.locationId ?? "";

                    return (
                      <div key={`${activeDay}-${i}`} className="flex flex-col gap-3">
                        <TransportConnector
                          from={prev}
                          to={event}
                          event={event}
                          dayKey={dayKeys[activeDay]}
                          segmentColor={segColor}
                          hoveredSegment={hoveredSegment}
                          hoveredEventKey={hoveredEventKey}
                          hoveredLocationId={hoveredLocationId}
                          onHoverSegment={onHoverSegment}
                          overrideToName={exitWalkFrom?.name}
                          overrideFromId={metroSegFromId}
                          overrideToId={metroSegToId}
                        />
                        {exitWalk && exitWalkFrom && curLoc && (
                          <ExitWalkConnector
                            fromName={exitWalkFrom.name}
                            toName={curLoc.name}
                            durationMin={exitWalk.durationMinutes}
                            distanceKm={(exitWalk.distanceMeters / 1000).toFixed(1)}
                            color={walkColor}
                            hoveredSegment={hoveredSegment}
                            hoveredEventKey={hoveredEventKey}
                            hoveredLocationId={hoveredLocationId}
                            segFromId={walkSegFromId}
                            segToId={walkSegToId}
                            onHoverSegment={onHoverSegment}
                          />
                        )}
                      </div>
                    );
                  }

                  const sameLocation = prev && prev.locationId && event.locationId && prev.locationId === event.locationId;
                  const showTimeSpacer = prev && !isWalkWithPrev && (event.transport === "none" || sameLocation);

                  return (
                    <div key={`${activeDay}-${i}`} className="flex flex-col gap-3">
                      {isWalkWithPrev && prev && (
                        <TransportConnector
                          from={prev}
                          to={event}
                          event={event}
                          dayKey={dayKeys[activeDay]}
                          segmentColor={segColor}
                          hoveredSegment={hoveredSegment}
                          hoveredEventKey={hoveredEventKey}
                          hoveredLocationId={hoveredLocationId}
                          onHoverSegment={onHoverSegment}
                        />
                      )}
                      {showTimeSpacer && prev && (
                        <TimeSpacer from={prev} to={event} />
                      )}
                      <TimelineEvent
                        event={event}
                        eventKey={`${activeDay}-${i}`}
                        isLast={i >= lastNonTransportIdx}
                        dayColor={dayColors[activeDay]}
                        hoveredEventKey={hoveredEventKey}
                        hoveredLocationId={hoveredLocationId}
                        hoveredSegment={hoveredSegment}
                        onHoverEvent={onHoverEvent}
                      />
                    </div>
                  );
                });
              })()}
            </div>
            </>
              );
            })()}
          </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
