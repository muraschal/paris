"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hotel, Map, Clock, Camera, Ticket, Wallet } from "lucide-react";

const sections = [
  { id: "hotel", label: "Hotel", icon: Hotel },
  { id: "map", label: "Karte", icon: Map },
  { id: "timeline", label: "Ablauf", icon: Clock },
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
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="glass-strong glow-gold rounded-full px-2 py-2 flex items-center gap-1">
            {sections.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
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
                    layoutId="nav-indicator"
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
