"use client";

import { useEffect, useRef } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import type { LenisRef } from "lenis/react";
import Snap from "lenis/snap";
import { frame, cancelFrame } from "framer-motion";

const SNAP_SECTION_IDS = ["hotel", "agenda", "fotos", "tickets", "budget"];

const LUXURY_EASING = (t: number) => 1 - Math.pow(1 - t, 4);

function SnapSetup() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(max-width: 1023px)").matches) return;

    const snap = new Snap(lenis, {
      type: "proximity",
      distanceThreshold: "35%",
      debounce: 150,
      easing: LUXURY_EASING,
      duration: 1.2,
    });

    const cleanups: (() => void)[] = [];
    for (const id of SNAP_SECTION_IDS) {
      const el = document.getElementById(id);
      if (el) {
        cleanups.push(snap.addElement(el, { align: ["start"] }));
      }
    }

    return () => {
      cleanups.forEach((fn) => fn());
      snap.destroy();
    };
  }, [lenis]);

  return null;
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    function update(data: { timestamp: number }) {
      lenisRef.current?.lenis?.raf(data.timestamp);
    }
    frame.update(update, true);
    return () => cancelFrame(update);
  }, []);

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{
        lerp: 0.09,
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
        autoRaf: false,
        easing: LUXURY_EASING,
      }}
    >
      <SnapSetup />
      {children}
    </ReactLenis>
  );
}
