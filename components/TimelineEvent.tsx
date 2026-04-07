"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Coffee, Hotel, Waves, Wine, UtensilsCrossed, Sunset,
  Sparkles, Star, Moon, Car, Landmark, Camera, Music,
  Heart, MapIcon, IceCreamCone, Plane, Luggage,
  ExternalLink, Copy, Check, GlassWater, TrainFront,
  Ticket, X, Footprints,
} from "lucide-react";
import type { TripEvent, TicketInfo } from "@/data/trip";
import { getLocation, tickets } from "@/data/trip";

const EVENT_IMAGES: Record<string, string> = {
  "Check-in Maison Souquet": "/images/events/souquet-1001-nuits.jpg",
  "Salon d'Eau — Pool & Hammam": "/images/events/souquet-salon-deau.jpg",
  "Cocktails — Salon des petits bonheurs": "/images/events/souquet-petits-bonheurs.jpg",
  "Dinner — Rencontre": "/images/events/rencontre-dinner.jpg",
  "Sacré-Cœur — Blaue Stunde": "/images/events/sacre-coeur.jpg",
  "Hotel — Frisch machen": "/images/events/souquet-suite.jpg",
  "Moulin Rouge — Féerie Show": "/images/events/moulin-rouge.jpg",
  "Frühstück im Hotel": "/images/events/fruehstueck-hotel.jpg",
  "Tour Eiffel — 2nd Floor + Champagne": "/images/events/tour-eiffel-champagne.jpg",
  "Trocadéro — Fotostop": "/images/events/trocadero.jpg",
  "Café Fouquet's": "/images/events/fouquets.jpg",
  "Arc de Triomphe": "/images/events/arc-de-triomphe.jpg",
  "Quality Time im Zimmer": "/images/events/souquet-suite.jpg",
  "Buddha Bar — Dinner & DJ": "/images/events/buddha-bar.jpg",
  "Frühstück im Zimmer": "/images/events/fruehstueck-zimmer.jpg",
  "Brunch — Ladurée Paris Royale": "/images/events/laduree.jpg",
  "Berthillon — Eis": "/images/events/berthillon.jpg",
  "Notre-Dame": "/images/events/notre-dame.jpg",
  "Quais de Seine — Spaziergang": "/images/events/quais-de-seine.jpg",
  "Pont des Arts": "/images/events/pont-des-arts.jpg",
  "Louvre Pyramide — Fotostop": "/images/events/louvre.jpg",
};

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
  train: TrainFront,
  footprints: Footprints,
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

function TicketPopover({ ticket, onClose }: { ticket: TicketInfo; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -4 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 top-8 z-20 w-56 p-3 rounded-xl glass-strong border border-gold/20 shadow-lg"
      onClick={(e) => e.stopPropagation()}
    >
      <button onClick={onClose} className="absolute top-2 right-2 p-0.5 rounded hover:bg-glass-hover transition-colors">
        <X className="w-3 h-3 text-text-muted" />
      </button>
      <p className="text-[10px] text-gold uppercase tracking-wider font-semibold mb-2">Ticket-Info</p>
      <div className="space-y-1.5">
        {ticket.refs.map((ref) => (
          <div key={ref.value} className="flex items-center justify-between">
            <span className="text-[10px] text-text-muted">{ref.label}</span>
            <span className="flex items-center font-mono text-[10px] text-text-secondary">
              {ref.value.length > 12 ? `${ref.value.slice(0, 6)}…${ref.value.slice(-4)}` : ref.value}
              <CopyButton value={ref.value} />
            </span>
          </div>
        ))}
        {ticket.cancellation && (
          <p className="text-accent-red/70 text-[9px] mt-1">{ticket.cancellation}</p>
        )}
      </div>
    </motion.div>
  );
}

interface HoveredSegment {
  fromId: string;
  toId: string;
}

interface TimelineEventProps {
  event: TripEvent;
  eventKey: string;
  isLast: boolean;
  dayColor: string;

  hoveredEventKey?: string | null;
  hoveredSegment?: HoveredSegment | null;
  onHoverEvent?: (locationId: string | null, eventKey: string | null) => void;
}

export default function TimelineEventCard({ event, eventKey, isLast, dayColor, hoveredEventKey, hoveredSegment, onHoverEvent }: TimelineEventProps) {
  const [showTicket, setShowTicket] = useState(false);
  const Icon = iconMap[event.icon] || Star;
  const location = event.locationId ? getLocation(event.locationId) : null;
  const ticket: TicketInfo | undefined = event.ticketRef ? tickets[event.ticketRef] : undefined;
  const hasTicket = ticket && ticket.refs.length > 0;
  const isBooked = !!event.ticketRef || event.costPaid === true;
  const isFixedTime = !event.time.startsWith("~") && event.time !== "Late";

  const anyHoverActive = hoveredEventKey != null || hoveredSegment != null;
  const isHovered = hoveredEventKey === eventKey;

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
    <div
      className={`flex gap-4 sm:gap-5 transition-opacity duration-200 ${
        anyHoverActive && !isHovered ? "opacity-40" : "opacity-100"
      } ${event.locationId ? "cursor-pointer" : ""}`}
      onMouseEnter={() => onHoverEvent?.(event.locationId || null, eventKey)}
      onMouseLeave={() => onHoverEvent?.(null, null)}
    >
      {/* Timeline line + dot */}
      <div className="flex flex-col items-center pt-1.5 shrink-0">
        <div
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${
            isHovered
              ? "scale-110"
              : isBooked
                ? "glass-gold glow-gold-strong ring-1 ring-gold/30"
                : event.highlight
                  ? "glass-gold glow-gold-strong"
                  : "glass"
          }`}
          style={isHovered ? {
            background: "rgba(255,45,120,0.18)",
            boxShadow: "0 0 20px rgba(255,45,120,0.4), 0 0 6px rgba(255,45,120,0.25), inset 0 0 8px rgba(255,45,120,0.1)",
            border: "2px solid #FF2D78",
          } : undefined}
        >
          <Icon className={`w-4 h-4 transition-colors duration-200 ${isHovered ? "text-[#FF2D78]" : event.highlight || isBooked ? "text-gold" : "text-text-secondary"}`} />
        </div>
        {!isLast && (
          <div className="w-px flex-1 min-h-[28px] bg-gradient-to-b from-glass-border to-transparent mt-2" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-7 sm:pb-8 min-w-0 relative">
        {/* Unified card background */}
        <div className={`absolute -top-2 -left-2.5 -right-2.5 bottom-2 rounded-xl overflow-hidden pointer-events-none border transition-all duration-200 ${
          isHovered
            ? "border-[#FF2D78]/25 shadow-[0_0_24px_rgba(255,45,120,0.15)]"
            : isBooked ? "border-gold/[0.12]" : "border-white/[0.06]"
        }`}>
          <div className={`absolute inset-0 transition-colors duration-200 ${isHovered ? "bg-[#FF2D78]/[0.06]" : isBooked ? "bg-gold/[0.03]" : "bg-white/[0.015]"}`} />
          {EVENT_IMAGES[event.title] && (
            <div
              className="absolute top-0 bottom-0 right-0 w-[30%]"
              style={{
                maskImage: "linear-gradient(to right, transparent 0%, black 70%)",
                WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 70%)",
              }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${EVENT_IMAGES[event.title]})` }}
              />
              <div className={`absolute inset-0 ${isBooked ? "bg-gold/[0.04]" : "bg-navy/30"}`} />
            </div>
          )}
        </div>
        <div className="relative">
          {/* Row 1: Time + badges + action buttons */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap min-w-0">
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
                  🚕 Uber
                </span>
              )}
              {event.transport === "metro" && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#0078D4]/15 text-[#0078D4] border border-[#0078D4]/20 uppercase tracking-wider">
                  🚇 Métro {event.transportDuration && `· ${event.transportDuration}`}
                </span>
              )}
              {event.transport === "walk" && event.transportDuration && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-glass text-text-muted uppercase tracking-wider">
                  🚶 {event.transportDuration}
                </span>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1.5 shrink-0 relative">
              {hasTicket && (
                <button
                  onClick={(e) => { e.stopPropagation(); setShowTicket(!showTicket); }}
                  className="p-1.5 rounded-lg glass hover:glass-strong transition-all group"
                  aria-label="Ticket-Info"
                >
                  <Ticket className="w-3.5 h-3.5 text-gold/60 group-hover:text-gold transition-colors" />
                </button>
              )}
              {location?.instagramUrl && (
                <a
                  href={location.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg glass hover:glass-strong transition-all group"
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
                  className="p-1.5 rounded-lg glass hover:glass-strong transition-all group"
                  aria-label={`${location.name} auf Google Maps öffnen`}
                >
                  <ExternalLink className="w-3.5 h-3.5 text-text-muted group-hover:text-gold transition-colors" />
                </a>
              )}
              <AnimatePresence>
                {showTicket && ticket && (
                  <TicketPopover ticket={ticket} onClose={() => setShowTicket(false)} />
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Row 2: Title */}
          <h4 className={`text-sm sm:text-[15px] font-medium mt-1.5 leading-snug ${isBooked ? "text-text-primary" : event.highlight ? "text-text-primary" : "text-text-primary/80"}`}>
            {event.title}
          </h4>

          {/* Row 3: Description */}
          {event.description && (
            <p className="text-xs text-text-secondary mt-1 leading-relaxed">{event.description}</p>
          )}

          {/* Row 4: Note */}
          {event.note && (
            <p className="text-[11px] text-gold/80 mt-1.5 flex items-center gap-1">
              <span className="text-gold">⚡</span> {event.note}
            </p>
          )}

          {event.funFact && (
            <p className="text-[11px] mt-2.5 leading-relaxed tracking-wide" style={{ color: "rgba(240, 236, 228, 0.7)" }}>
              {event.funFact}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
