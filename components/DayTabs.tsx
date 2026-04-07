"use client";

import { motion } from "framer-motion";
import { days } from "@/data/trip";

const DAY_COLORS = ["#c9a96e", "#7eb8e0", "#e0a07e"];

interface DayTabsProps {
  activeDay: number;
  onChange: (index: number) => void;
}

export default function DayTabs({ activeDay, onChange }: DayTabsProps) {
  return (
    <div className="flex rounded-xl glass p-1 gap-1">
      {days.map((day, i) => {
        const isActive = activeDay === i;
        const color = DAY_COLORS[i];

        return (
          <button
            key={day.date}
            onClick={() => onChange(i)}
            className="relative flex-1 py-2.5 rounded-lg text-center transition-colors duration-200"
          >
            {isActive && (
              <motion.div
                layoutId="day-tab-bg"
                className="absolute inset-0 rounded-lg"
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
                className="text-[10px] font-semibold uppercase tracking-[0.15em]"
                style={{ color: isActive ? color : undefined }}
              >
                {isActive ? undefined : (
                  <span className="text-text-muted">{day.label}</span>
                )}
                {isActive && day.label}
              </span>
              <span
                className="text-[11px] tabular-nums"
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
