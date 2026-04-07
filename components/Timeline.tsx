"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Footprints } from "lucide-react";
import { days, getLocation } from "@/data/trip";
import type { TripEvent } from "@/data/trip";
import walkingRoutes from "@/data/walking-routes.json";
import DayTabs from "./DayTabs";
import TimelineEvent from "./TimelineEvent";

const dayColors = ["text-day-1", "text-day-2", "text-day-3"];
const dayKeys = ["friday", "saturday", "sunday"];

function WalkConnector({ from, to, event, dayKey }: {
  from: TripEvent;
  to: TripEvent;
  event: TripEvent;
  dayKey: string;
}) {
  const fromLoc = from.locationId ? getLocation(from.locationId) : null;
  const toLoc = to.locationId ? getLocation(to.locationId) : null;
  if (!fromLoc || !toLoc || fromLoc.id === toLoc.id) return null;

  const route = walkingRoutes.find(
    (r) => r.from === fromLoc.id && r.to === toLoc.id && r.day === dayKey
  );
  const distKm = route ? (route.distanceMeters / 1000).toFixed(1) : null;
  const dur = event.transportDuration;

  return (
    <div className="flex gap-4 sm:gap-5">
      <div className="flex flex-col items-center shrink-0">
        <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shrink-0">
          <div className="w-6 h-6 rounded-full bg-glass/60 flex items-center justify-center">
            <Footprints className="w-3 h-3 text-text-muted" />
          </div>
        </div>
        <div className="w-px flex-1 min-h-[8px] bg-gradient-to-b from-glass-border to-transparent" />
      </div>
      <div className="flex-1 pb-3 flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-glass/40 border border-glass-border/50">
          <span className="text-[10px] text-text-muted tracking-wide">
            {fromLoc.name}
          </span>
          <span className="text-text-muted/40 text-[8px]">→</span>
          <span className="text-[10px] text-text-muted tracking-wide">
            {toLoc.name}
          </span>
          {dur && (
            <span className="text-[10px] text-text-secondary font-mono tabular-nums">
              {dur}
            </span>
          )}
          {distKm && (
            <span className="text-[9px] text-text-muted/60 font-mono tabular-nums">
              {distKm} km
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Timeline() {
  const [activeDay, setActiveDay] = useState(0);
  const day = days[activeDay];

  return (
    <section id="timeline" className="relative py-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          <p className="text-text-secondary text-xs tracking-[0.25em] uppercase mb-3">
            Der Ablauf
          </p>
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight">
            <span className="text-gradient-gold">3 Tage Paris</span>
          </h2>
        </motion.div>

        {/* Day Tabs */}
        <div className="sticky top-0 z-20 pt-3 pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 bg-navy/80 backdrop-blur-xl">
          <DayTabs activeDay={activeDay} onChange={setActiveDay} />
        </div>

        {/* Day Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDay}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mt-5 mb-6">
              <p className="text-xs text-text-secondary italic">{day.subtitle}</p>
            </div>

            <div className="mt-6">
              {day.events.map((event, i) => {
                const prev = i > 0 ? day.events[i - 1] : null;
                const showWalk = event.transport === "walk" && prev;
                return (
                  <div key={`${activeDay}-${i}`}>
                    {showWalk && prev && (
                      <WalkConnector
                        from={prev}
                        to={event}
                        event={event}
                        dayKey={dayKeys[activeDay]}
                      />
                    )}
                    <TimelineEvent
                      event={event}
                      isLast={i === day.events.length - 1}
                      dayColor={dayColors[activeDay]}
                    />
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-5 border-t border-glass-border flex items-center justify-between">
              <span className="text-xs text-text-muted">Tagesbudget</span>
              <span className="text-sm font-light text-text-secondary">
                ~{day.totalCost}€
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
