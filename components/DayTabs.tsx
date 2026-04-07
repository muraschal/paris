"use client";

import { motion } from "framer-motion";
import { days } from "@/data/trip";

const DAY_COLORS = ["#c9a96e", "#7eb8e0", "#e0a07e"];

interface DayTabsProps {
  activeDay: number;
  onChange: (index: number) => void;
  /** Separate layout scope so dock + sticky tabs do not share one motion layout */
  groupId?: string;
  /** Compact pill for bottom dock — matches Navigation glass-strong */
  compact?: boolean;
}

export default function DayTabs({
  activeDay,
  onChange,
  groupId = "agenda",
  compact = false,
}: DayTabsProps) {
  const layoutId = `day-tab-bg-${groupId}`;

  return (
    <div
      className={
        compact
          ? "flex rounded-full glass-strong glow-gold p-1 gap-0.5 w-full max-w-[min(100%,20rem)]"
          : "flex rounded-xl glass p-1 gap-1"
      }
    >
      {days.map((day, i) => {
        const isActive = activeDay === i;
        const color = DAY_COLORS[i];

        return (
          <button
            key={day.date}
            type="button"
            onClick={() => onChange(i)}
            className={`relative flex-1 text-center transition-colors duration-200 ${
              compact ? "py-1.5 rounded-full" : "py-2.5 rounded-lg"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId={layoutId}
                className={`absolute inset-0 ${compact ? "rounded-full" : "rounded-lg"}`}
                style={{
                  background: `linear-gradient(135deg, ${color}12, ${color}08)`,
                  border: `1px solid ${color}25`,
                  boxShadow: `0 0 20px ${color}10`,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative flex flex-col items-center gap-0.5">
              <span
                className={`font-semibold uppercase tracking-[0.15em] ${
                  compact ? "text-[9px]" : "text-[10px]"
                }`}
                style={{ color: isActive ? color : undefined }}
              >
                {isActive ? undefined : <span className="text-text-muted">{day.label}</span>}
                {isActive && day.label}
              </span>
              <span
                className={`tabular-nums ${compact ? "text-[10px]" : "text-[11px]"}`}
                style={{ color: isActive ? `${color}bb` : undefined }}
              >
                {isActive ? (
                  <>{day.date.split("-")[2]}. Mai</>
                ) : (
                  <span className="text-text-muted/50">{day.date.split("-")[2]}.05</span>
                )}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
