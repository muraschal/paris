"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hotel, Map, Camera, Ticket, Wallet } from "lucide-react";
import DayTabs from "./DayTabs";
import { useAgendaDay } from "./AgendaDayContext";

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
  const { activeDay, setActiveDay } = useAgendaDay();

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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 max-w-[calc(100vw-1.5rem)]"
        >
          <AnimatePresence>
            {active === "agenda" && (
              <motion.div
                key="dock-days"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2 }}
                className="w-full flex justify-center px-1 lg:hidden"
              >
                <DayTabs
                  activeDay={activeDay}
                  onChange={setActiveDay}
                  groupId="dock"
                  compact
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="glass-strong glow-gold rounded-full px-2 py-2 flex items-center gap-1">
            {sections.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
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
