"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Copy, Check, Ticket, AlertTriangle, Clock, CheckCircle2, Wallet } from "lucide-react";
import { tickets } from "@/data/trip";

const DAY_COLORS: Record<string, string> = {
  Freitag: "#c9a96e",
  Samstag: "#7eb8e0",
  Sonntag: "#e0a07e",
};

/** Deterministic fake barcode bar widths for Wallet-style strip */
function seedToBarWidths(seed: string, count = 40): number[] {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const bars: number[] = [];
  for (let i = 0; i < count; i++) {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    bars.push(2 + (Math.abs(h) % 5));
  }
  return bars;
}

function PassBarcode({ seed }: { seed: string }) {
  const bars = useMemo(() => seedToBarWidths(seed), [seed]);
  return (
    <div
      className="pass-barcode flex h-10 w-full items-end justify-center gap-[1px] rounded-md bg-black/35 px-2 py-1.5"
      aria-hidden
    >
      {bars.map((w, i) => (
        <div
          key={i}
          className="rounded-[1px] bg-white/85"
          style={{ width: w, height: `${40 + (i % 5) * 8}%` }}
        />
      ))}
    </div>
  );
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        void copy();
      }}
      className="shrink-0 p-2 rounded-full bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.12] transition-colors"
      aria-label="Kopieren"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-accent-green" />
      ) : (
        <Copy className="w-3.5 h-3.5 text-text-muted hover:text-gold transition-colors" />
      )}
    </button>
  );
}

function TicketCard({
  ticket,
  index,
}: {
  ticket: (typeof tickets)[string];
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const dayColor = DAY_COLORS[ticket.day] || "#c9a96e";
  const barcodeSeed =
    ticket.refs.map((r) => r.value).join("|") || `${index}-${ticket.title}`;

  const showBarcode = ticket.refs.some((r) => r.value.length >= 12);

  return (
    <motion.div
      className="
        group relative rounded-2xl overflow-hidden
        border border-white/[0.08]
        shadow-[0_4px_24px_rgba(0,0,0,0.35)]
        transition-[box-shadow,border-color] duration-200 ease-out
        hover:border-white/[0.14] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]
      "
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.04 }}
    >
      {/* Day tint + glass base */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(145deg, ${dayColor}14 0%, rgba(255,255,255,0.03) 45%, rgba(10,10,20,0.5) 100%)`,
        }}
      />
      <div className="absolute inset-0 glass pointer-events-none opacity-90" />
      {/* Top gloss */}
      <div
        className="absolute inset-x-0 top-0 h-24 pointer-events-none opacity-40"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.14) 0%, transparent 100%)",
        }}
      />

      <div className="relative flex min-h-0">
        {/* Left accent strip (Wallet pass) */}
        <div
          className="w-1 shrink-0 self-stretch"
          style={{
            background: `linear-gradient(180deg, ${dayColor} 0%, ${dayColor}99 50%, ${dayColor}66 100%)`,
            boxShadow: `inset -1px 0 0 ${dayColor}40`,
          }}
        />

        <div className="flex-1 min-w-0 flex flex-col">
          {/* Pass header — tap to expand stub */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="w-full flex items-start gap-3 p-4 pr-3 text-left hover:bg-white/[0.03] transition-colors"
          >
            <div className="relative w-11 h-11 rounded-2xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center shrink-0 shadow-inner">
              <Wallet className="w-5 h-5 text-gold/90" strokeWidth={1.5} />
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent-green flex items-center justify-center ring-2 ring-[#121018]">
                <CheckCircle2 className="w-3 h-3 text-navy" />
              </div>
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-[0.9375rem] font-semibold text-text-primary leading-snug tracking-tight">
                  {ticket.title}
                </h4>
                <span className="shrink-0 text-[9px] uppercase tracking-[0.14em] font-semibold px-2 py-1 rounded-full bg-white/[0.06] text-text-secondary border border-white/[0.06]">
                  Bestätigt
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span
                  className="inline-flex items-center text-[8px] leading-none px-2 py-1 rounded-full uppercase tracking-[0.14em] font-bold"
                  style={{
                    backgroundColor: `${dayColor}22`,
                    color: dayColor,
                    border: `1px solid ${dayColor}44`,
                  }}
                >
                  {ticket.day}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-text-muted">
                  <Clock className="w-3 h-3 shrink-0 opacity-70" />
                  {ticket.datetime}
                </span>
              </div>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-text-muted/80 transition-transform duration-200 shrink-0 mt-1 ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Perforation */}
          <div className="pass-perforation mx-3 shrink-0" />

          {/* Stub preview line when collapsed */}
          {!open && (
            <div className="px-4 pb-3 flex items-center gap-2 text-[10px] text-text-muted">
              <Ticket className="w-3.5 h-3.5 opacity-50" />
              <span className="truncate">
                {ticket.refs.length > 0
                  ? `${ticket.refs.length} Referenz${ticket.refs.length > 1 ? "en" : ""}`
                  : ticket.notes.length > 0
                    ? ticket.notes[0]
                    : "Details anzeigen"}
              </span>
            </div>
          )}

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 pt-1 space-y-4 border-t border-white/[0.04]">
                  {showBarcode && <PassBarcode seed={barcodeSeed} />}

                  {ticket.notes.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-[9px] text-text-muted uppercase tracking-[0.2em] font-semibold">Infos</p>
                      {ticket.notes.map((note, i) => (
                        <p key={i} className="text-xs text-text-secondary leading-relaxed">
                          {note}
                        </p>
                      ))}
                    </div>
                  )}

                  {ticket.refs.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-[9px] text-text-muted uppercase tracking-[0.2em] font-semibold">
                        Referenznummern
                      </p>
                      {ticket.refs.map((ref) => (
                        <div
                          key={ref.value}
                          className="flex items-center justify-between gap-3 rounded-xl bg-black/25 border border-white/[0.06] px-3 py-2.5"
                        >
                          <span className="text-[11px] text-text-muted shrink-0">{ref.label}</span>
                          <div className="flex items-center gap-2 min-w-0 justify-end">
                            <code className="text-[11px] font-mono text-text-primary truncate text-right">
                              {ref.value.length > 28
                                ? `${ref.value.slice(0, 10)}…${ref.value.slice(-8)}`
                                : ref.value}
                            </code>
                            <CopyButton value={ref.value} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {ticket.cancellation && (
                    <div className="flex items-start gap-2.5 rounded-xl bg-accent-red/[0.08] border border-accent-red/20 px-3 py-2.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-accent-red/70 mt-0.5 shrink-0" />
                      <p className="text-[11px] text-accent-red/75 leading-relaxed">{ticket.cancellation}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default function TicketVault() {
  const entries = Object.entries(tickets);
  const total = entries.length;

  return (
    <section
      id="tickets"
      className="relative py-16 sm:py-24 md:min-h-dvh md:flex md:flex-col md:justify-center overflow-x-hidden lg:snap-start scroll-mt-0"
      style={{ backgroundColor: "#0e0c15" }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.07] mix-blend-luminosity pointer-events-none"
        style={{ backgroundImage: "url(/images/events/souquet-1001-nuits.jpg)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0e0c15] via-transparent to-[#0e0c15] pointer-events-none" />
      <div className="absolute inset-0 texture-noise pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 90%, rgba(201,169,110,0.10) 0%, rgba(201,169,110,0.02) 50%, transparent 80%)",
        }}
      />

      <div className="max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto relative z-10 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10 md:mb-12"
        >
          <p className="text-text-secondary text-xs tracking-[0.25em] uppercase mb-3">Alle Reservierungen</p>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight">
            <span className="text-gradient-gold">Les Réservations</span>
          </h2>
          <p className="text-text-secondary text-sm sm:text-base font-light mt-3 tracking-wide">
            {total} Buchungen bestätigt
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 w-full pb-1 md:items-start">
          {entries.map(([id, ticket], index) => (
            <TicketCard key={id} ticket={ticket} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
