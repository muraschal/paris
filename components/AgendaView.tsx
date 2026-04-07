"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import RouteMap from "./RouteMap";
import Timeline from "./Timeline";
import DayTabs from "./DayTabs";
import { useAgendaDay } from "./AgendaDayContext";

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const handler = (e: MediaQueryListEvent | MediaQueryList) => setIsDesktop(e.matches);
    handler(mq);
    mq.addEventListener("change", handler as (e: MediaQueryListEvent) => void);
    return () => mq.removeEventListener("change", handler as (e: MediaQueryListEvent) => void);
  }, []);

  return isDesktop;
}

export interface HoveredSegment {
  fromId: string;
  toId: string;
  source?: "map" | "timeline";
}

export default function AgendaView() {
  const { activeDay, setActiveDay } = useAgendaDay();
  const [hoveredLocationId, setHoveredLocationId] = useState<string | null>(null);
  const [hoveredEventKey, setHoveredEventKey] = useState<string | null>(null);
  const [hoveredSegment, setHoveredSegment] = useState<HoveredSegment | null>(null);
  const isDesktop = useIsDesktop();

  const handleMapPoiHover = useCallback((locId: string | null) => {
    setHoveredLocationId(locId);
    setHoveredEventKey(null);
    setHoveredSegment(null);
  }, []);

  const handleMapSegmentHover = useCallback((seg: HoveredSegment | null) => {
    setHoveredSegment(seg ? { ...seg, source: "map" } : null);
    setHoveredLocationId(null);
    setHoveredEventKey(null);
  }, []);

  const handleTimelineEventHover = useCallback((locId: string | null, eventKey: string | null) => {
    setHoveredLocationId(locId);
    setHoveredEventKey(eventKey);
    setHoveredSegment(null);
  }, []);

  const handleTimelineSegmentHover = useCallback((seg: HoveredSegment | null) => {
    setHoveredSegment(seg ? { ...seg, source: "timeline" } : null);
    setHoveredLocationId(null);
    setHoveredEventKey(null);
  }, []);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [tabsH, setTabsH] = useState(52);

  const measureTabs = useCallback(() => {
    if (tabsRef.current) {
      setTabsH(tabsRef.current.offsetHeight);
    }
  }, []);

  useEffect(() => {
    measureTabs();
    window.addEventListener("resize", measureTabs);
    return () => window.removeEventListener("resize", measureTabs);
  }, [measureTabs]);

  if (isDesktop) {
    return (
      <section id="agenda" className="relative scroll-mt-0 snap-start snap-always">
        <div
          ref={tabsRef}
          className="sticky top-0 z-30 bg-navy/90 backdrop-blur-xl border-b border-white/[0.06]"
        >
          <div className="max-w-md mx-auto px-4 py-2.5">
            <DayTabs activeDay={activeDay} onChange={setActiveDay} groupId="agenda" />
          </div>
        </div>

        <div className="flex" style={{ minHeight: "85vh" }}>
          <div
            className="w-[55%] sticky"
            style={{ top: tabsH, height: `calc(100vh - ${tabsH}px)` }}
          >
            <RouteMap
              activeDay={activeDay}
              onDayChange={setActiveDay}
              compact
              hoveredLocationId={hoveredLocationId}
              hoveredEventKey={hoveredEventKey}
              hoveredSegment={hoveredSegment}
              onHoverLocation={handleMapPoiHover}
              onHoverSegment={handleMapSegmentHover}
            />
          </div>

          <div className="w-[45%] border-l border-white/[0.06]">
            <div className="py-6">
              <Timeline
                activeDay={activeDay}
                onDayChange={setActiveDay}
                embedded
                hideTabs
                hoveredLocationId={hoveredLocationId}
                hoveredEventKey={hoveredEventKey}
                hoveredSegment={hoveredSegment}
                onHoverEvent={handleTimelineEventHover}
                onHoverSegment={handleTimelineSegmentHover}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ── Mobile: stacked layout — map on top, timeline below ── */
  return (
    <section id="agenda" className="relative">
      {/* Sticky day tabs */}
      <div className="sticky top-0 z-30 bg-navy/90 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-md mx-auto px-4 py-2.5">
          <DayTabs activeDay={activeDay} onChange={setActiveDay} groupId="agenda" />
        </div>
      </div>

      {/* Map — fixed-height panel */}
      <div className="relative w-full" style={{ height: "45dvh" }}>
        <RouteMap
          activeDay={activeDay}
          onDayChange={setActiveDay}
          compact
          hoveredLocationId={hoveredLocationId}
          hoveredEventKey={hoveredEventKey}
          hoveredSegment={hoveredSegment}
          onHoverLocation={handleMapPoiHover}
          onHoverSegment={handleMapSegmentHover}
        />
      </div>

      {/* Timeline — scrolls naturally */}
      <div className="px-1 py-4">
        <Timeline
          activeDay={activeDay}
          onDayChange={setActiveDay}
          embedded
          hideTabs
          hoveredLocationId={hoveredLocationId}
          hoveredEventKey={hoveredEventKey}
          hoveredSegment={hoveredSegment}
          onHoverEvent={handleTimelineEventHover}
          onHoverSegment={handleTimelineSegmentHover}
        />
      </div>
    </section>
  );
}
