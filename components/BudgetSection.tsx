"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, CheckCircle2, Clock } from "lucide-react";
import { budgetPaid, budgetOnSite, totalPaid, totalOnSite, totalBudget, days } from "@/data/trip";

const eventCount = days.reduce((s, d) => s + d.events.filter(e => e.transport === "none").length, 0);

export default function BudgetSection() {
  const [showPaidDetails, setShowPaidDetails] = useState(true);
  const [showOnSiteDetails, setShowOnSiteDetails] = useState(true);

  const paidPercent = Math.round((totalPaid / totalBudget) * 100);

  return (
    <section
      id="budget"
      className="relative min-h-dvh flex flex-col justify-center py-16 sm:py-24 px-4 sm:px-6 overflow-hidden lg:snap-start lg:snap-always scroll-mt-0"
      style={{ backgroundColor: "#05050e" }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.06] mix-blend-luminosity pointer-events-none"
        style={{ backgroundImage: "url(/images/events/fouquets.jpg)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#05050e] via-transparent to-[#05050e] pointer-events-none" />
      <div className="absolute inset-0 texture-noise pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(201,169,110,0.06) 0%, transparent 70%)" }}
      />

      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          <p className="text-text-secondary text-xs tracking-[0.25em] uppercase mb-3">
            Unser Weekend auf einen Blick
          </p>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight">
            <span className="text-gradient-gold">Le Compte</span>
          </h2>
          <p className="text-text-secondary text-sm sm:text-base font-light mt-3 tracking-wide">
            3 Tage · {eventCount} Erlebnisse · 1 Erinnerung
          </p>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="h-1.5 rounded-full bg-glass overflow-hidden flex">
            <div
              className="h-full rounded-full bg-accent-green/60 transition-all duration-700"
              style={{ width: `${paidPercent}%` }}
            />
            <div
              className="h-full rounded-full bg-gold/40 transition-all duration-700"
              style={{ width: `${100 - paidPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-text-muted mt-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-accent-green/60" />
              Bereits bezahlt · {paidPercent}%
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-gold/40" />
              Vor Ort · {100 - paidPercent}%
            </span>
          </div>
        </motion.div>

        {/* Two columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Paid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass rounded-2xl overflow-hidden border border-accent-green/[0.08]"
          >
            <button
              onClick={() => setShowPaidDetails(!showPaidDetails)}
              className="w-full flex items-center justify-between p-5 text-left hover:bg-glass-hover transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent-green/10 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-accent-green/70" />
                </div>
                <div>
                  <p className="text-xs text-accent-green/70 uppercase tracking-wider font-medium">Bezahlt</p>
                  <p className="text-lg font-light text-text-primary tabular-nums mt-0.5">~{totalPaid}€</p>
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-text-muted transition-transform ${showPaidDetails ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence>
              {showPaidDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 space-y-2.5 border-t border-glass-border pt-4">
                    {budgetPaid.map((item) => (
                      <div key={item.label} className="flex justify-between items-center">
                        <span className="text-xs text-text-secondary">{item.label}</span>
                        <span className="text-xs font-mono text-text-secondary tabular-nums">{item.amount}€</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* On-site */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass rounded-2xl overflow-hidden border border-gold/[0.08]"
          >
            <button
              onClick={() => setShowOnSiteDetails(!showOnSiteDetails)}
              className="w-full flex items-center justify-between p-5 text-left hover:bg-glass-hover transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-gold/70" />
                </div>
                <div>
                  <p className="text-xs text-gold/70 uppercase tracking-wider font-medium">Vor Ort</p>
                  <p className="text-lg font-light text-text-primary tabular-nums mt-0.5">~{totalOnSite}€</p>
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-text-muted transition-transform ${showOnSiteDetails ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence>
              {showOnSiteDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 space-y-2.5 border-t border-glass-border pt-4">
                    {budgetOnSite.map((item) => (
                      <div key={item.label} className="flex justify-between items-center">
                        <span className="text-xs text-text-secondary">{item.label}</span>
                        <span className="text-xs font-mono text-text-secondary tabular-nums">~{item.amount}€</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Total */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 text-center"
        >
          <div className="glass rounded-2xl p-6 inline-flex flex-col items-center border border-gold/[0.06]">
            <p className="text-[10px] text-text-muted uppercase tracking-[0.2em] mb-2">Total Weekend</p>
            <p className="text-3xl sm:text-4xl font-light text-gradient-gold tabular-nums">
              ~{totalBudget}€
            </p>
            <p className="text-[11px] text-text-muted mt-3 italic tracking-wide">
              No penny splitting. This is Paris. 🥂
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
