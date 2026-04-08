"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hotel, Map, Camera, Ticket, Wallet } from "lucide-react";

const sections = [
  { id: "hotel", label: "Hotel", icon: Hotel },
  { id: "agenda", label: "Agenda", icon: Map },
  { id: "fotos", label: "Fotos", icon: Camera },
  { id: "tickets", label: "Tickets", icon: Ticket },
  { id: "budget", label: "Budget", icon: Wallet },
];

export default function Navigation() {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.5);

      for (const section of [...sections].reverse()) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.4) {
            setActive(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const showNav = visible;

  return (
    <AnimatePresence>
      {showNav && (
        <motion.nav
          aria-label="Sektions-Navigation"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 inset-x-4 z-50 flex justify-center pointer-events-none sm:inset-x-6"
        >
          <div className="glass-strong glow-gold rounded-full px-2 py-2 flex items-center gap-1 max-w-full pointer-events-auto" role="tablist">
            {sections.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={active === id}
                aria-label={label}
                onClick={() => scrollTo(id)}
                className={`
                  relative flex items-center gap-1.5 px-3 py-2 rounded-full text-xs transition-all duration-300
                  ${active === id ? "text-gold" : "text-text-muted hover:text-text-secondary"}
                `}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{label}</span>
                {active === id && (
                  <motion.div
                    layoutId="nav-section-indicator"
                    className="absolute inset-0 rounded-full glass-gold"
                    style={{ zIndex: -1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
