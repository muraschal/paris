"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Copy, Check, Ticket, AlertTriangle, Clock, CheckCircle2 } from "lucide-react";
import { tickets } from "@/data/trip";

const DAY_COLORS: Record<string, string> = {
  Freitag: "#c9a96e",
  Samstag: "#7eb8e0",
  Sonntag: "#e0a07e",
};

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      className="p-1.5 rounded-lg hover:bg-glass-hover transition-colors"
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

function TicketCard({ id, ticket }: { id: string; ticket: (typeof tickets)[string] }) {
  const [open, setOpen] = useState(false);
  const dayColor = DAY_COLORS[ticket.day] || "#c9a96e";

  return (
    <motion.div
      className="glass rounded-xl overflow-hidden border border-gold/[0.08]"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-glass-hover transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-10 h-10 rounded-full glass-gold flex items-center justify-center shrink-0">
            <Ticket className="w-4 h-4 text-gold" />
            <div className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-accent-green flex items-center justify-center">
              <CheckCircle2 className="w-3 h-3 text-navy" />
            </div>
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-medium text-text-primary truncate">{ticket.title}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="text-[8px] px-1.5 py-0.5 rounded-full uppercase tracking-[0.12em] font-semibold"
                style={{ backgroundColor: `${dayColor}20`, color: dayColor, border: `1px solid ${dayColor}30` }}
              >
                {ticket.day}
              </span>
              <span className="flex items-center gap-1 text-[10px] text-text-muted">
                <Clock className="w-2.5 h-2.5" />
                {ticket.datetime}
              </span>
            </div>
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-text-muted transition-transform shrink-0 ml-2 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">
              {/* Notes */}
              {ticket.notes.map((note, i) => (
                <p key={i} className="text-xs text-text-secondary">{note}</p>
              ))}

              {/* Refs */}
              {ticket.refs.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-glass-border">
                  <p className="text-[9px] text-text-muted uppercase tracking-[0.15em]">Referenznummern</p>
                  {ticket.refs.map((ref) => (
                    <div key={ref.value} className="flex items-center justify-between bg-glass/50 rounded-lg px-3 py-2">
                      <span className="text-xs text-text-muted">{ref.label}</span>
                      <div className="flex items-center gap-1">
                        <code className="text-xs font-mono text-text-secondary">
                          {ref.value.length > 20
                            ? `${ref.value.slice(0, 8)}...${ref.value.slice(-6)}`
                            : ref.value}
                        </code>
                        <CopyButton value={ref.value} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Cancellation */}
              {ticket.cancellation && (
                <div className="flex items-start gap-2 pt-2 border-t border-glass-border">
                  <AlertTriangle className="w-3 h-3 text-accent-red/60 mt-0.5 shrink-0" />
                  <p className="text-[11px] text-accent-red/70">{ticket.cancellation}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function TicketVault() {
  return (
    <section id="tickets" className="relative py-20 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          <p className="text-text-secondary text-xs tracking-[0.25em] uppercase mb-3">
            Alle Reservierungen
          </p>
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight">
            <span className="text-gradient-gold">Ticket Wallet</span>
          </h2>
          <p className="text-text-muted text-xs mt-3">{Object.keys(tickets).length} Buchungen bestätigt</p>
        </motion.div>

        <div className="space-y-3">
          {Object.entries(tickets).map(([id, ticket]) => (
            <TicketCard key={id} id={id} ticket={ticket} />
          ))}
        </div>
      </div>
    </section>
  );
}
