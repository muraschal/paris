"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const TARGET = new Date("2026-05-01T06:00:00+02:00").getTime();

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function Hero() {
  const [diff, setDiff] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setDiff(Math.max(0, TARGET - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const d = diff ?? 0;
  const days = Math.floor(d / 86_400_000);
  const hours = Math.floor((d % 86_400_000) / 3_600_000);
  const minutes = Math.floor((d % 3_600_000) / 60_000);
  const seconds = Math.floor((d % 60_000) / 1000);
  const isPast = diff !== null && diff <= 0;

  return (
    <section className="relative h-dvh w-full flex items-center justify-center overflow-hidden">
      {/* Background gradient simulating Paris night sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d2b] via-[#0a0a1a] to-navy" />

      {/* Eiffel Tower background — very subtle */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.06] mix-blend-luminosity pointer-events-none"
        style={{ backgroundImage: "url(/hero-eiffel.png)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-navy/40 via-transparent to-navy pointer-events-none" />

      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_50%_30%,rgba(201,169,110,0.3)_0%,transparent_70%)]" />

      {/* Subtle star-like particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-[1px] h-[1px] bg-white rounded-full animate-pulse-gold"
            style={{
              left: `${(i * 37 + 13) % 100}%`,
              top: `${(i * 23 + 7) % 80}%`,
              animationDelay: `${(i * 0.3) % 3}s`,
              opacity: 0.3 + (i % 3) * 0.2,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <p className="text-text-secondary text-sm tracking-[0.3em] uppercase mb-4">
            1.–3. Mai 2026
          </p>

          <h1 className="text-[clamp(1.6rem,6.5vw,3.75rem)] font-light tracking-tight mb-3 whitespace-nowrap">
            <span className="text-gradient-gold">Rendez-vous à Paris</span>
          </h1>

          <p className="text-xl sm:text-2xl font-extralight text-text-primary/70 tracking-wide">
            Murielle & Marcel
          </p>

          <div className="flex items-center justify-center gap-3 mt-7 mb-10">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold opacity-40" />
            <span className="text-gold text-xs tracking-[0.2em] uppercase">Maison Souquet · Pigalle</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold opacity-40" />
          </div>
        </motion.div>

        {/* Countdown */}
        {diff !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {isPast ? (
              <p className="text-gold text-lg tracking-wide">Bon voyage! 🥂</p>
            ) : (
              <div className="flex items-center justify-center gap-1 sm:gap-3">
                {[
                  { value: pad(days), label: "Tage" },
                  { value: pad(hours), label: "Std" },
                  { value: pad(minutes), label: "Min" },
                  { value: pad(seconds), label: "Sek" },
                ].map((unit, i) => (
                  <div key={unit.label} className="flex items-center gap-1 sm:gap-3">
                    <div className="flex flex-col items-center">
                      <span className="text-3xl sm:text-4xl font-extralight tracking-wider text-text-primary tabular-nums">
                        {unit.value}
                      </span>
                      <span className="text-[10px] text-text-muted tracking-[0.15em] uppercase mt-1">
                        {unit.label}
                      </span>
                    </div>
                    {i < 3 && (
                      <span className="text-gold-dim text-2xl font-extralight mb-4">:</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <ChevronDown className="w-5 h-5 text-gold opacity-40" />
      </motion.div>
    </section>
  );
}
