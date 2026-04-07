"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Phone,
  Globe,
  Clock,
  Waves,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Star,
  Sparkles,
  KeyRound,
} from "lucide-react";
import { hotel } from "@/data/trip";

const HOTEL_IMAGES = [
  {
    url: "https://www.maisonsouquet.com/wp-content/uploads/2024/02/MS-Salon-des-Petits-Bonheurs-2b.jpg",
    caption: "Salon des Petits Bonheurs",
  },
  {
    url: "https://www.maisonsouquet.com/wp-content/uploads/2024/02/MS-Salon-1001-nuits_2-1536x1024.jpg",
    caption: "Salon des 1001 Nuits",
  },
  {
    url: "https://www.maisonsouquet.com/wp-content/uploads/2024/01/home_de_luxe-1536x1023.jpg",
    caption: "Chambre De Luxe",
  },
  {
    url: "https://www.maisonsouquet.com/wp-content/uploads/2023/12/spa-1536x1024.jpg",
    caption: "Salon d'Eau — Pool & Hammam",
  },
  {
    url: "https://www.maisonsouquet.com/wp-content/uploads/2024/01/maison_souquet21-1536x1023.jpg",
    caption: "Entrée & Salon",
  },
  {
    url: "https://www.maisonsouquet.com/wp-content/uploads/2024/01/Maison-souquet-09-01-2024-1536x1023.jpeg",
    caption: "Salon Privé",
  },
  {
    url: "https://www.maisonsouquet.com/wp-content/uploads/2024/01/maison_souquet19-1536x1023.jpg",
    caption: "Suite",
  },
];

const HIGHLIGHTS = [
  {
    icon: Star,
    title: "5 étoiles · Boutique",
    text: "20 Zimmer, jedes ein Unikat. Design von Jacques Garcia — der Mann hinter dem Pariser Hôtel Costes.",
  },
  {
    icon: Sparkles,
    title: "Maison de plaisir",
    text: "Im 19. Jh. ein geheimes Vergnügungshaus — die Zimmer tragen noch die Namen berühmter Kurtisanen.",
  },
  {
    icon: Waves,
    title: "Salon d'Eau — privat",
    text: "Hammam & Pool privat nutzbar (je nach Buchung). Osmanisches Baderitual, Dampf, warmes Licht. Etwa 1 Stunde Ruhe.",
  },
  {
    icon: KeyRound,
    title: "Pigalle · Montmartre",
    text: "100m zum Moulin Rouge, 10 Min zu Fuss zum Sacré-Cœur. Das kreativste Viertel von Paris.",
  },
];

export default function HotelCard() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % HOTEL_IMAGES.length),
    []
  );
  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + HOTEL_IMAGES.length) % HOTEL_IMAGES.length),
    []
  );

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [paused, next]);

  return (
    <section
      id="hotel"
      className="relative min-h-dvh flex flex-col justify-center py-16 sm:py-24 px-4 sm:px-6 lg:snap-start scroll-mt-0"
      style={{ backgroundColor: "#0c0b16" }}
    >
      <div className="absolute inset-0 texture-noise pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(201,169,110,0.12) 0%, transparent 55%)",
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10 w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          <p className="text-text-secondary text-xs tracking-[0.25em] uppercase mb-3">
            Unterkunft · Montmartre
          </p>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight mb-3">
            <span className="text-gradient-gold">La Maison</span>
          </h2>
          <p className="text-text-secondary text-sm sm:text-base font-light tracking-wide">
            Maison Souquet · Hôtel 5 étoiles
          </p>
        </motion.div>

        {/* Main content: Image + Info side by side on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-start">
          {/* Slideshow — takes 3/5 on desktop */}
          <motion.div
            className="relative rounded-2xl overflow-hidden lg:col-span-3 touch-pan-y"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* touch-pan-y: vertikales Seiten-Scrollen auf Mobilgeräten nicht mit Bild-Transform verklemmen */}
            <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden touch-pan-y isolate">
              <AnimatePresence mode="wait">
                <motion.img
                  key={current}
                  src={HOTEL_IMAGES[current].url}
                  alt={HOTEL_IMAGES[current].caption}
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45 }}
                />
              </AnimatePresence>

              <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent" />

              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full glass hover:glass-strong transition-all sm:opacity-60 hover:!opacity-100"
                aria-label="Vorheriges Bild"
              >
                <ChevronLeft className="w-4 h-4 text-white/80" />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full glass hover:glass-strong transition-all sm:opacity-60 hover:!opacity-100"
                aria-label="Nächstes Bild"
              >
                <ChevronRight className="w-4 h-4 text-white/80" />
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {HOTEL_IMAGES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      i === current
                        ? "w-6 bg-gold"
                        : "w-1.5 bg-white/30 hover:bg-white/50"
                    }`}
                    aria-label={`Bild ${i + 1}`}
                  />
                ))}
              </div>

              <div className="absolute bottom-10 left-6">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={current}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.4 }}
                    className="text-[10px] text-white/50 tracking-[0.2em] uppercase"
                  >
                    {HOTEL_IMAGES[current].caption}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Info panel — takes 2/5 on desktop */}
          <motion.div
            className="lg:col-span-2 space-y-5"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            {/* Highlight cards */}
            {HIGHLIGHTS.map((h, i) => (
              <motion.div
                key={h.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                className="glass rounded-xl p-4 border border-gold/[0.06] hover:border-gold/[0.12] transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center shrink-0 mt-0.5">
                    <h.icon className="w-3.5 h-3.5 text-gold/70" />
                  </div>
                  <div>
                    <p className="text-xs text-gold/80 font-medium tracking-wide uppercase">
                      {h.title}
                    </p>
                    <p className="text-[12px] text-text-secondary/80 mt-1 leading-relaxed">
                      {h.text}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom info bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 glass-gold rounded-2xl p-5 sm:p-6"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-gold mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-text-primary leading-snug">{hotel.address}</p>
                <a
                  href={hotel.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-gold/70 hover:text-gold transition-colors flex items-center gap-1 mt-1"
                >
                  Google Maps <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-gold shrink-0" />
              <div className="text-xs text-text-primary">
                <span className="text-gold font-medium">Fr 14:00</span>
                <span className="text-text-muted mx-1">→</span>
                <span className="text-gold font-medium">So 12:00</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-gold shrink-0" />
              <a
                href={`tel:${hotel.phone}`}
                className="text-xs text-text-primary hover:text-gold transition-colors"
              >
                {hotel.phone}
              </a>
            </div>

            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-gold shrink-0" />
              <a
                href={hotel.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-text-primary hover:text-gold transition-colors"
              >
                maisonsouquet.com
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
