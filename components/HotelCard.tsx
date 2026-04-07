"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Globe, Clock, Waves, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { hotel } from "@/data/trip";

const HOTEL_IMAGES = [
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

export default function HotelCard() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setCurrent((c) => (c + 1) % HOTEL_IMAGES.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + HOTEL_IMAGES.length) % HOTEL_IMAGES.length), []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [paused, next]);

  return (
    <section id="hotel" className="relative py-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-text-secondary text-xs tracking-[0.25em] uppercase mb-3 text-center">
            Unser Zuhause in Paris
          </p>
          <h2 className="text-3xl sm:text-4xl font-light text-center mb-10 tracking-tight">
            <span className="text-gradient-gold">Maison Souquet</span>
          </h2>
        </motion.div>

        <motion.div
          className="relative rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.15 }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Image Slideshow */}
          <div className="relative aspect-[16/9] sm:aspect-[2.2/1] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={current}
                src={HOTEL_IMAGES[current].url}
                alt={HOTEL_IMAGES[current].caption}
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              />
            </AnimatePresence>

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-navy/30 to-transparent" />

            {/* Nav arrows */}
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full glass hover:glass-strong transition-all opacity-0 group-hover:opacity-100 sm:opacity-60 hover:!opacity-100"
              aria-label="Vorheriges Bild"
            >
              <ChevronLeft className="w-4 h-4 text-white/80" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full glass hover:glass-strong transition-all opacity-0 group-hover:opacity-100 sm:opacity-60 hover:!opacity-100"
              aria-label="Nächstes Bild"
            >
              <ChevronRight className="w-4 h-4 text-white/80" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {HOTEL_IMAGES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    i === current ? "w-6 bg-gold" : "w-1.5 bg-white/30 hover:bg-white/50"
                  }`}
                  aria-label={`Bild ${i + 1}`}
                />
              ))}
            </div>

            {/* Caption */}
            <div className="absolute bottom-10 left-6 sm:left-8">
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

          {/* Info Card overlaying bottom of image */}
          <div className="relative -mt-1 glass-gold rounded-b-2xl p-6 sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-text-primary">{hotel.address}</p>
                    <a
                      href={hotel.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gold/70 hover:text-gold transition-colors flex items-center gap-1 mt-1"
                    >
                      Google Maps <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gold shrink-0" />
                  <a href={`tel:${hotel.phone}`} className="text-sm text-text-primary hover:text-gold transition-colors">
                    {hotel.phone}
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-gold shrink-0" />
                  <a
                    href={hotel.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-text-primary hover:text-gold transition-colors"
                  >
                    maisonsouquet.com
                  </a>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gold shrink-0" />
                  <p className="text-sm text-text-primary">
                    Check-in <span className="text-gold font-medium">Fr 14:00</span>
                    <span className="text-text-muted mx-2">·</span>
                    Check-out <span className="text-gold font-medium">So 12:00</span>
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <Waves className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-text-primary">{hotel.spa.name}</p>
                    <p className="text-xs text-text-secondary mt-0.5">{hotel.spa.description}</p>
                    <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] tracking-wider uppercase bg-accent-green/10 text-accent-green">
                      Inklusiv
                    </span>
                  </div>
                </div>

                <div className="text-xs text-text-muted">
                  Buchungsref: <span className="text-text-secondary font-mono">{hotel.bookingRef}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
