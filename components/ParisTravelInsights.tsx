"use client";

import { motion } from "framer-motion";
import {
  TrainFront,
  UtensilsCrossed,
  Wallet,
  Smartphone,
  Receipt,
  TrendingUp,
  Coffee,
  type LucideIcon,
} from "lucide-react";
import {
  COFFEE_COMPARE,
  METRO_COMPARE,
  TRAVEL_INSIGHTS,
} from "@/data/paris-travel-insights";

const ICONS: Record<(typeof TRAVEL_INSIGHTS)[number]["icon"], LucideIcon> = {
  train: TrainFront,
  utensils: UtensilsCrossed,
  wallet: Wallet,
  smartphone: Smartphone,
  receipt: Receipt,
  trending: TrendingUp,
};

function formatEur(n: number) {
  return n.toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function BarRow({
  label,
  flag,
  value,
  max,
  accent,
}: {
  label: string;
  flag: string;
  value: number;
  max: number;
  accent: "gold" | "blue";
}) {
  const pct = Math.max(8, Math.round((value / max) * 100));
  const barClass =
    accent === "gold"
      ? "bg-gradient-to-r from-gold/50 to-gold/25"
      : "bg-gradient-to-r from-[#7eb8e0]/55 to-[#7eb8e0]/20";

  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[11px] text-text-secondary">
          <span className="text-text-primary/90 font-medium">{label}</span>
          <span className="text-text-muted/70 ml-1.5 text-[10px] font-mono">{flag}</span>
        </span>
        <span className="text-[11px] font-mono tabular-nums text-gold/90 shrink-0">
          ca. {formatEur(value)}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${barClass}`}
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

export default function ParisTravelInsights() {
  const maxCoffee = Math.max(...COFFEE_COMPARE.map((c) => c.eur));
  const maxMetro = Math.max(...METRO_COMPARE.map((m) => m.eur));

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55 }}
      className="mb-10 space-y-6"
    >
      <div className="text-center">
        <p className="text-[10px] text-text-muted uppercase tracking-[0.22em] mb-2">
          Paris für Reisende
        </p>
        <h3 className="text-lg sm:text-xl font-light text-text-primary tracking-tight">
          Geld, Kaffee &amp; Großstadt-Kontext
        </h3>
        <p className="text-[11px] text-text-muted mt-2 max-w-xl mx-auto leading-relaxed">
          Keine Finanzberatung — nur Orientierung: Paris im Städtevergleich und typische Alltagspreise.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Kaffee-Vergleich */}
        <div className="glass rounded-2xl border border-white/[0.06] p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-gold/10 flex items-center justify-center border border-gold/15">
              <Coffee className="w-4 h-4 text-gold/80" />
            </div>
            <div>
              <p className="text-xs font-medium text-text-primary">Cappuccino / Café crème</p>
              <p className="text-[10px] text-text-muted">Tischpreis Zentrum · 6 Städte · inkl. Berlin &amp; München</p>
            </div>
          </div>
          <div className="space-y-3.5">
            {COFFEE_COMPARE.map((row) => (
              <BarRow
                key={row.city}
                label={row.city}
                flag={row.flag}
                value={row.eur}
                max={maxCoffee}
                accent="gold"
              />
            ))}
          </div>
          <p className="text-[9px] text-text-muted/70 mt-4 leading-relaxed border-t border-white/[0.05] pt-3">
            Rom oft günstiger am Tisch — an der Bar steht der Espresso nochmal in anderer Liga. London: GBP→EUR schwankt. Zürich: CHF→EUR — Café-Preise oft mit London vergleichbar oder darüber.
          </p>
        </div>

        {/* ÖPNV-Vergleich */}
        <div className="glass rounded-2xl border border-white/[0.06] p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-[#7eb8e0]/10 flex items-center justify-center border border-[#7eb8e0]/20">
              <TrainFront className="w-4 h-4 text-[#7eb8e0]/85" />
            </div>
            <div>
              <p className="text-xs font-medium text-text-primary">Einzelfahrt Innenstadt</p>
              <p className="text-[10px] text-text-muted">
                6 Städte · inkl. Berlin &amp; München · ca. EUR (CHF für Zürich umgerechnet)
              </p>
            </div>
          </div>
          <div className="space-y-3.5">
            {METRO_COMPARE.map((row) => (
              <BarRow
                key={row.city}
                label={row.city}
                flag={row.flag}
                value={row.eur}
                max={maxMetro}
                accent="blue"
              />
            ))}
          </div>
          <p className="text-[9px] text-text-muted/70 mt-4 leading-relaxed border-t border-white/[0.05] pt-3">
            Berlin (BVG) &amp; München (MVV): jeweils eigene Zonen — Einzelfahrt nur zur Einordnung; mit Deutschlandticket oft anders kalkulieren. Paris: Ticket+ / Zentrum.
          </p>
        </div>
      </div>

      {/* Insight-Karten */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {TRAVEL_INSIGHTS.map((item, i) => {
          const Icon = ICONS[item.icon];
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3.5 hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex gap-3">
                <div className="shrink-0 w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center border border-white/[0.06]">
                  <Icon className="w-3.5 h-3.5 text-gold/65" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-text-primary tracking-wide uppercase text-gold/75 mb-1">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-text-secondary leading-relaxed">{item.detail}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <p className="text-center text-[9px] text-text-muted/60 tracking-wide">
        Richtwerte · Wechselkurse &amp; Tarife ändern sich — vor Ort nochmal prüfen.
      </p>
    </motion.div>
  );
}
