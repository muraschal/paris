"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { budgetPaid, budgetOnSite, totalPaid, totalOnSite, totalBudget } from "@/data/trip";

export default function BudgetSection() {
  const [open, setOpen] = useState(false);

  const paidPercent = Math.round((totalPaid / totalBudget) * 100);
  const onSitePercent = 100 - paidPercent;

  return (
    <section id="budget" className="relative py-20 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <div className="glass rounded-2xl overflow-hidden">
            <button
              onClick={() => setOpen(!open)}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-glass-hover transition-colors"
            >
              <div>
                <p className="text-xs text-text-muted tracking-[0.2em] uppercase">Budget</p>
                <p className="text-sm text-text-secondary mt-1">
                  Details anzeigen
                </p>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-text-muted transition-transform ${open ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 space-y-6">
                    {/* Progress bar */}
                    <div className="space-y-2">
                      <div className="h-1.5 rounded-full bg-glass overflow-hidden flex">
                        <div
                          className="h-full rounded-full bg-accent-green/60"
                          style={{ width: `${paidPercent}%` }}
                        />
                        <div
                          className="h-full rounded-full bg-gold/40"
                          style={{ width: `${onSitePercent}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-text-muted">
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-accent-green/60" />
                          Bereits bezahlt
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-gold/40" />
                          Vor Ort
                        </span>
                      </div>
                    </div>

                    {/* Paid section */}
                    <div>
                      <h4 className="text-xs text-accent-green/70 uppercase tracking-wider mb-3">
                        Bereits bezahlt
                      </h4>
                      <div className="space-y-2">
                        {budgetPaid.map((item) => (
                          <div key={item.label} className="flex justify-between items-center">
                            <span className="text-xs text-text-secondary">{item.label}</span>
                            <span className="text-xs font-mono text-text-secondary tabular-nums">
                              {item.amount === 666 ? "666 CHF" : `${item.amount}€`}
                            </span>
                          </div>
                        ))}
                        <div className="flex justify-between items-center pt-2 border-t border-glass-border">
                          <span className="text-xs text-text-muted">Subtotal</span>
                          <span className="text-sm font-mono text-accent-green/80 tabular-nums">
                            ~{totalPaid}€
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* On-site section */}
                    <div>
                      <h4 className="text-xs text-gold/70 uppercase tracking-wider mb-3">
                        Vor Ort (geschätzt)
                      </h4>
                      <div className="space-y-2">
                        {budgetOnSite.map((item) => (
                          <div key={item.label} className="flex justify-between items-center">
                            <span className="text-xs text-text-secondary">{item.label}</span>
                            <span className="text-xs font-mono text-text-secondary tabular-nums">
                              ~{item.amount}€
                            </span>
                          </div>
                        ))}
                        <div className="flex justify-between items-center pt-2 border-t border-glass-border">
                          <span className="text-xs text-text-muted">Subtotal</span>
                          <span className="text-sm font-mono text-gold/80 tabular-nums">
                            ~{totalOnSite}€
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="pt-4 border-t border-glass-border">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-text-primary">Total Weekend</span>
                        <span className="text-lg font-light text-gradient-gold tabular-nums">
                          ~{totalBudget}€
                        </span>
                      </div>
                      <p className="text-[10px] text-text-muted mt-2 text-right italic">
                        No penny splitting. This is Paris. 🥂
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
