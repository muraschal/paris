"use client";

import { motion } from "framer-motion";
import { Camera, ExternalLink } from "lucide-react";
import { locations } from "@/data/trip";

const photoSpots = locations.filter((l) => l.photoSpot && l.instagramUrl);

export default function PhotoSpots() {
  return (
    <section id="fotos" className="relative py-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          <p className="text-text-secondary text-xs tracking-[0.25em] uppercase mb-3">
            Foto Inspiration
          </p>
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight">
            <span className="text-gradient-gold">Photo Spots</span>
          </h2>
          <p className="text-text-muted text-xs mt-3">
            {photoSpots.length} Locations · Tipps & Instagram-Hashtags
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {photoSpots.map((spot, i) => (
            <motion.div
              key={spot.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="glass rounded-xl p-4 group hover:glass-strong transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full glass-gold flex items-center justify-center shrink-0">
                  <Camera className="w-4 h-4 text-gold" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-medium text-text-primary">{spot.name}</h3>
                  {spot.photoTip && (
                    <p className="text-[11px] text-text-secondary mt-1 leading-relaxed">
                      {spot.photoTip}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-2.5">
                    <a
                      href={spot.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[10px] text-text-muted hover:text-[#E1306C] transition-colors"
                    >
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                      Instagram
                    </a>
                    <a
                      href={spot.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[10px] text-text-muted hover:text-gold transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Maps
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
