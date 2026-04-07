"use client";

import { motion } from "framer-motion";
import { Heart, ExternalLink } from "lucide-react";
import { locations } from "@/data/trip";

export default function Footer() {
  return (
    <footer className="relative py-20 sm:py-28 px-4 sm:px-6 overflow-hidden" style={{ backgroundColor: "#0d0a11" }}>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0a11] via-transparent to-[#0d0a11] pointer-events-none" />
      <div className="absolute inset-0 texture-noise pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(201,169,110,0.16) 0%, rgba(201,169,110,0.04) 45%, transparent 75%)" }}
      />

      <div className="max-w-2xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="inline-block mb-6"
          >
            <Heart className="w-6 h-6 text-gold fill-gold/20" />
          </motion.div>

          <h3 className="text-2xl sm:text-3xl font-light tracking-tight mb-2">
            <span className="text-gradient-gold">Bon voyage</span>
          </h3>
          <p className="text-text-secondary text-sm">
            Paris · Mai 2026
          </p>

          {/* Quick Links Grid */}
          <div className="mt-12 pt-8 border-t border-glass-border">
            <p className="text-[10px] text-text-muted uppercase tracking-[0.2em] mb-4">
              Quick Navigation
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {locations
                .filter((l) => l.category !== "hotel")
                .slice(0, 12)
                .map((loc) => (
                  <a
                    key={loc.id}
                    href={loc.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-text-muted hover:text-gold hover:bg-glass transition-all group"
                  >
                    <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    <span className="truncate">{loc.name}</span>
                  </a>
                ))}
            </div>
          </div>

          <p className="mt-12 text-text-muted text-[10px]">
            Made with love in 2026
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
