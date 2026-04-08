"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Camera, ExternalLink } from "lucide-react";
import { locations } from "@/data/trip";
import Lightbox from "./Lightbox";

const photoSpots = locations.filter(
  (l) => l.photoSpot && l.instagramUrl && l.photoGallery?.length
);

export default function PhotoSpots() {
  const [lightbox, setLightbox] = useState<{
    spotIdx: number;
    imgIdx: number;
  } | null>(null);

  const openLightbox = useCallback((spotIdx: number, imgIdx: number) => {
    setLightbox({ spotIdx, imgIdx });
  }, []);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  const navigateLightbox = useCallback(
    (imgIdx: number) => {
      if (lightbox) setLightbox({ ...lightbox, imgIdx });
    },
    [lightbox]
  );

  const activeSpot = lightbox ? photoSpots[lightbox.spotIdx] : null;

  return (
    <>
      <section id="fotos" className="relative py-20 sm:py-28 px-4 sm:px-6" style={{ backgroundColor: "#060614" }}>
        <div className="absolute inset-0 texture-grid pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(100,160,220,0.05) 0%, transparent 65%)" }}
        />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <p className="text-text-secondary text-xs tracking-[0.25em] uppercase mb-3">
              Foto Inspiration
            </p>
            <h2 className="text-3xl sm:text-5xl font-light tracking-tight">
              <span className="text-gradient-gold">Les Moments</span>
            </h2>
            <p className="text-text-secondary text-sm sm:text-base font-light mt-3 tracking-wide">
              {photoSpots.length} Locations mit hohem Motiv-Potenzial
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {photoSpots.map((spot, spotIdx) => (
              <motion.div
                key={spot.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: spotIdx * 0.06 }}
                className="glass rounded-2xl overflow-hidden group hover:glass-strong transition-all"
              >
                {/* Hero image */}
                {spot.photoGallery && spot.photoGallery[0] && (
                  <button
                    onClick={() => openLightbox(spotIdx, 0)}
                    className="relative w-full aspect-[16/9] overflow-hidden cursor-pointer"
                  >
                    <Image
                      src={spot.photoGallery[0]}
                      alt={`${spot.name} — Hauptansicht`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      quality={75}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gold/20 backdrop-blur-sm flex items-center justify-center">
                        <Camera className="w-3.5 h-3.5 text-gold" />
                      </div>
                      <span className="text-white/90 text-sm font-medium drop-shadow-lg">
                        {spot.name}
                      </span>
                    </div>
                    {spot.photoGallery.length > 1 && (
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm text-white/80 text-[10px]">
                        {spot.photoGallery.length} Fotos
                      </div>
                    )}
                  </button>
                )}

                {/* Content area */}
                <div className="p-4">
                  {/* Photo tip */}
                  {spot.photoTip && (
                    <p className="text-[11px] text-text-secondary leading-relaxed mb-3">
                      {spot.photoTip}
                    </p>
                  )}

                  {/* Thumbnail strip */}
                  {spot.photoGallery && spot.photoGallery.length > 1 && (
                    <div className="flex gap-1.5 mb-3 overflow-x-auto scrollbar-hide">
                      {spot.photoGallery.map((img, imgIdx) => (
                        <button
                          key={imgIdx}
                          onClick={() => openLightbox(spotIdx, imgIdx)}
                          className={`relative shrink-0 w-14 h-14 rounded-lg overflow-hidden transition-all ${
                            imgIdx === 0
                              ? "ring-1 ring-gold/30"
                              : "ring-1 ring-white/10 hover:ring-white/30"
                          }`}
                        >
                          <Image
                            src={img}
                            alt={`${spot.name} — Foto ${imgIdx + 1}`}
                            fill
                            sizes="(max-width: 768px) 50vw, 15vw"
                            className="object-cover transition-transform duration-300 group-hover/thumb:scale-105"
                            quality={70}
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Links */}
                  <div className="flex items-center gap-3">
                    <a
                      href={spot.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[10px] text-text-muted hover:text-[#E1306C] transition-colors"
                    >
                      <svg
                        className="w-3 h-3"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          width="20"
                          height="20"
                          x="2"
                          y="2"
                          rx="5"
                          ry="5"
                        />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                      </svg>
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && activeSpot?.photoGallery && (
        <Lightbox
          images={activeSpot.photoGallery}
          index={lightbox.imgIdx}
          spotName={activeSpot.name}
          photoTip={activeSpot.photoTip}
          onClose={closeLightbox}
          onNavigate={navigateLightbox}
        />
      )}
    </>
  );
}
