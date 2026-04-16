"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown, CheckCircle2, Clock } from "lucide-react";
import {
  budgetPaid,
  budgetOnSite,
  totalPaid,
  totalOnSite,
  totalBudget,
  days,
  type BudgetItem,
} from "@/data/trip";
import { CHF_PER_EUR, formatBudgetMoney, type TripCurrency } from "@/lib/currency";
import ParisTravelInsights from "./ParisTravelInsights";

function CurrencyToggle({
  currency,
  onChange,
}: {
  currency: TripCurrency;
  onChange: (c: TripCurrency) => void;
}) {
  return (
    <div
      className="inline-flex rounded-full border border-glass-border p-0.5 bg-white/[0.03]"
      role="group"
      aria-label="Budget in Euro oder Schweizer Franken"
    >
      {(["EUR", "CHF"] as const).map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c)}
          aria-pressed={currency === c}
          className={`px-3.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] rounded-full transition-all duration-200 ${
            currency === c
              ? "bg-gold/25 text-gold shadow-sm"
              : "text-text-muted hover:text-text-secondary"
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  );
}

const eventCount = days.reduce((s, d) => s + d.events.filter(e => e.transport === "none").length, 0);

function paidLineKey(item: BudgetItem) {
  if (item.flightRoute) {
    const { origin, destination } = item.flightRoute;
    return `flight-${origin.iata}-${destination.iata}-${item.amount}`;
  }
  return item.label;
}

function PaidBudgetLabel({ item }: { item: BudgetItem }) {
  const r = item.flightRoute;
  if (!r) {
    return <span className="text-xs text-text-secondary leading-snug">{item.label}</span>;
  }
  const a11y = `Flug von ${r.origin.city} (${r.origin.iata}) nach ${r.destination.city} (${r.destination.iata}), ${r.vendor}`;
  return (
    <div className="min-w-0 text-left">
      <span className="sr-only">{a11y}</span>
      <div className="flex items-center gap-1.5" aria-hidden>
        <span className="inline-flex min-w-[2.75rem] justify-center rounded border border-gold/25 bg-gradient-to-b from-gold/[0.12] to-gold/[0.04] px-2 py-0.5 font-mono text-[11px] font-semibold tabular-nums tracking-[0.14em] text-gold">
          {r.origin.iata}
        </span>
        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-gold/45" strokeWidth={2} />
        <span className="inline-flex min-w-[2.75rem] justify-center rounded border border-gold/25 bg-gradient-to-b from-gold/[0.12] to-gold/[0.04] px-2 py-0.5 font-mono text-[11px] font-semibold tabular-nums tracking-[0.14em] text-gold">
          {r.destination.iata}
        </span>
      </div>
      <p className="mt-1 text-[10px] leading-snug text-text-muted">
        <span className="text-text-secondary/90">{r.origin.city}</span>
        <span className="mx-1.5 text-text-muted/40">·</span>
        <span className="text-text-secondary/90">{r.destination.city}</span>
        <span className="mx-2 text-text-muted/35">·</span>
        <span className="text-text-muted/80">{r.vendor}</span>
      </p>
    </div>
  );
}

export default function BudgetSection() {
  const [showPaidDetails, setShowPaidDetails] = useState(true);
  const [showOnSiteDetails, setShowOnSiteDetails] = useState(true);
  const [currency, setCurrency] = useState<TripCurrency>("EUR");

  const paidPercent = Math.round((totalPaid / totalBudget) * 100);

  return (
    <section
      id="budget"
      className="relative min-h-dvh flex flex-col justify-center py-16 sm:py-24 px-4 sm:px-6 overflow-hidden lg:snap-start scroll-mt-0"
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
            Auf einen Blick
          </p>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight">
            <span className="text-gradient-gold">Le Compte</span>
          </h2>
          <div className="flex flex-col items-center gap-2 mt-4">
            <CurrencyToggle currency={currency} onChange={setCurrency} />
            {currency === "CHF" && (
              <p className="text-[10px] text-text-muted tracking-wide">
                Umrechnung 1 EUR ≈ {CHF_PER_EUR.toLocaleString("de-DE", {
                  minimumFractionDigits: 3,
                  maximumFractionDigits: 3,
                })}{" "}
                CHF
              </p>
            )}
          </div>
          <p className="text-text-secondary text-sm sm:text-base font-light mt-3 tracking-wide">
            3 Tage · {eventCount} Aktivitäten · 1 Highlight
          </p>
        </motion.div>

        <ParisTravelInsights />

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
                  <p className="text-lg font-light text-text-primary tabular-nums mt-0.5">
                    ~{formatBudgetMoney(totalPaid, currency)}
                  </p>
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
                  <div className="px-5 pb-5 space-y-3.5 border-t border-glass-border pt-4">
                    {budgetPaid.map((item) => (
                      <div
                        key={paidLineKey(item)}
                        className="flex justify-between items-start gap-4"
                      >
                        <PaidBudgetLabel item={item} />
                        <span className="text-xs font-mono text-text-secondary tabular-nums shrink-0 pt-0.5">
                          {formatBudgetMoney(item.amount, currency)}
                        </span>
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
                  <p className="text-lg font-light text-text-primary tabular-nums mt-0.5">
                    ~{formatBudgetMoney(totalOnSite, currency)}
                  </p>
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
                        <span className="text-xs font-mono text-text-secondary tabular-nums">
                          ~{formatBudgetMoney(item.amount, currency)}
                        </span>
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
            <p className="text-[10px] text-text-muted uppercase tracking-[0.2em] mb-2">Gesamtbudget</p>
            <p className="text-3xl sm:text-4xl font-light text-gradient-gold tabular-nums">
              ~{formatBudgetMoney(totalBudget, currency)}
            </p>
            <p className="text-[11px] text-text-muted mt-3 italic tracking-wide">
              Orientierungswerte — Paris-Preisniveau inklusive.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
