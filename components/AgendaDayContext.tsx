"use client";

import { createContext, useContext, useState, useMemo, type ReactNode } from "react";

export type AgendaDayContextValue = {
  activeDay: number;
  setActiveDay: (index: number) => void;
};

const AgendaDayContext = createContext<AgendaDayContextValue | null>(null);

export function AgendaDayProvider({ children }: { children: ReactNode }) {
  const [activeDay, setActiveDay] = useState(0);
  const value = useMemo(() => ({ activeDay, setActiveDay }), [activeDay]);
  return (
    <AgendaDayContext.Provider value={value}>
      {children}
    </AgendaDayContext.Provider>
  );
}

export function useAgendaDay() {
  const ctx = useContext(AgendaDayContext);
  if (!ctx) {
    throw new Error("useAgendaDay must be used within AgendaDayProvider");
  }
  return ctx;
}
