"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Coffee, Hotel, Waves, Wine, UtensilsCrossed, Sunset,
  Sparkles, Star, Moon, Car, Landmark, Camera, Music,
  Heart, MapIcon, IceCreamCone, Plane, Luggage, ChevronDown,
  ExternalLink, Copy, Check, GlassWater,
} from "lucide-react";
import type { TripEvent, TicketInfo } from "@/data/trip";
import { getLocation, tickets } from "@/data/trip";

const iconMap: Record<string, React.ElementType> = {
  coffee: Coffee,
  hotel: Hotel,
  waves: Waves,
  wine: Wine,
  utensils: UtensilsCrossed,
  sunset: Sunset,
  sparkles: Sparkles,
  star: Star,
  moon: Moon,
  car: Car,
  landmark: Landmark,
  camera: Camera,
  music: Music,
  heart: Heart,
  map: MapIcon,
  iceCream: IceCreamCone,
  plane: Plane,
  luggage: Luggage,
  champagne: GlassWater,
};

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      className="ml-2 p-1 rounded hover:bg-glass-hover transition-colors"
      aria-label="Kopieren"
    >
      {copied ? (
        <Check className="w-3 h-3 text-accent-green" />
      ) : (
        <Copy className="w-3 h-3 text-text-muted" />
      )}
    </button>
  );
}

interface TimelineEventProps {
  event: TripEvent;
  isLast: boolean;
  dayColor: string;
}

export default function TimelineEventCard({ event, isLast, dayColor }: TimelineEventProps) {
  const [expanded, setExpanded] = useState(false);
  const Icon = iconMap[event.icon] || Star;
  const location = event.locationId ? getLocation(event.locationId) : null;
  const ticket: TicketInfo | undefined = event.ticketRef ? tickets[event.ticketRef] : undefined;
  const hasExpandable = ticket && ticket.refs.length > 0;
  const isBooked = !!event.ticketRef || event.costPaid === true;
  const isFixedTime = !event.time.startsWith("~") && event.time !== "Late";

  const duration = (() => {
    if (!event.endTime) return null;
    const parse = (t: string) => {
      const clean = t.replace("~", "");
      if (clean === "Late") return null;
      const [h, m] = clean.split(":").map(Number);
      return h * 60 + m;
    };
    const start = parse(event.time);
    const end = parse(event.endTime);
    if (start == null || end == null) return null;
    let diff = end - start;
    if (diff < 0) diff += 24 * 60;
    if (diff < 60) return `${diff} Min`;
    const hrs = Math.floor(diff / 60);
    const mins = diff % 60;
    return mins > 0 ? `${hrs}h${mins.toString().padStart(2, "0")}` : `${hrs}h`;
  })();

  return (
    <div className="flex gap-4 sm:gap-5">
      {/* Timeline line + dot */}
      <div className="flex flex-col items-center pt-1.5 shrink-0">
        <div
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 ${
            isBooked
              ? "glass-gold glow-gold-strong ring-1 ring-gold/30"
              : event.highlight
                ? "glass-gold glow-gold-strong"
                : "glass"
          }`}
        >
          <Icon className={`w-4 h-4 ${event.highlight || isBooked ? "text-gold" : "text-text-secondary"}`} />
        </div>
        {!isLast && (
          <div className="w-px flex-1 min-h-[28px] bg-gradient-to-b from-glass-border to-transparent mt-2" />
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 pb-7 sm:pb-8 min-w-0 ${isBooked ? "relative" : ""}`}>
        {isBooked && (
          <div className="absolute -top-2.5 -left-3 -right-2 -bottom-1 rounded-2xl bg-gold/[0.025] border border-gold/[0.08] pointer-events-none" />
        )}
        <div className="relative">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-mono tabular-nums ${isBooked ? "text-gold font-semibold" : isFixedTime ? "text-text-primary" : "text-text-muted"}`}>
                  {event.time}
                  {event.endTime && `–${event.endTime}`}
                </span>
                {isBooked && (
                  <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-gold/15 text-gold uppercase tracking-[0.15em] font-semibold border border-gold/20">
                    Gebucht
                  </span>
                )}
                {duration && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-glass text-text-secondary tabular-nums">
                    ⏱ {duration}
                  </span>
                )}
                {event.transport === "uber" && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-glass text-text-muted uppercase tracking-wider">
                    Uber
                  </span>
                )}
                {event.transport === "walk" && event.transportDuration && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-glass text-text-muted uppercase tracking-wider">
                    🚶 {event.transportDuration}
                  </span>
                )}
              </div>
              <h4 className={`text-sm sm:text-[15px] font-medium mt-1.5 leading-snug ${isBooked ? "text-text-primary" : event.highlight ? "text-text-primary" : "text-text-primary/80"}`}>
                {event.title}
              </h4>
              {event.description && (
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">{event.description}</p>
              )}
              {event.costPaid && event.costNote && (
                <p className="text-[10px] text-accent-green/80 mt-1.5 flex items-center gap-1">
                  <Check className="w-3 h-3" /> {event.costNote}
                </p>
              )}
              {event.note && (
                <p className="text-[11px] text-gold/80 mt-2 flex items-center gap-1">
                  <span className="text-gold">⚡</span> {event.note}
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 shrink-0 mt-0.5">
              {location?.instagramUrl && (
                <a
                  href={location.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl glass hover:glass-strong transition-all group"
                  aria-label={`${location.name} auf Instagram`}
                >
                  <svg className="w-3.5 h-3.5 text-text-muted group-hover:text-[#E1306C] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
              )}
              {location && (
                <a
                  href={location.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl glass hover:glass-strong transition-all group"
                  aria-label={`${location.name} auf Google Maps öffnen`}
                >
                  <ExternalLink className="w-3.5 h-3.5 text-text-muted group-hover:text-gold transition-colors" />
                </a>
              )}
            </div>
          </div>

          {/* Expandable ticket info */}
          {hasExpandable && (
            <div className="mt-2">
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 text-[10px] text-gold/60 hover:text-gold transition-colors uppercase tracking-wider"
              >
                Ticket-Info
                <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {expanded && ticket && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 p-3 rounded-xl glass text-xs space-y-2">
                      {ticket.refs.map((ref) => (
                        <div key={ref.value} className="flex items-center justify-between">
                          <span className="text-text-muted">{ref.label}</span>
                          <span className="flex items-center font-mono text-text-secondary">
                            {ref.value.length > 16 ? `${ref.value.slice(0, 8)}...${ref.value.slice(-6)}` : ref.value}
                            <CopyButton value={ref.value} />
                          </span>
                        </div>
                      ))}
                      {ticket.cancellation && (
                        <p className="text-accent-red/70 text-[10px] mt-1">{ticket.cancellation}</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
