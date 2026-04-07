"use client";

import { useRef, useCallback, useState, useEffect, type ReactNode } from "react";
import { motion, useMotionValue, useTransform, animate, type PanInfo } from "framer-motion";

interface BottomSheetProps {
  children: ReactNode;
  header?: ReactNode;
  snapPoints?: number[];
  initialSnap?: number;
}

export default function BottomSheet({
  children,
  header,
  snapPoints = [0.15, 0.5, 0.9],
  initialSnap = 0,
}: BottomSheetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewportH, setViewportH] = useState(0);
  const [snapIndex, setSnapIndex] = useState(initialSnap);

  useEffect(() => {
    const update = () => setViewportH(window.innerHeight);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const sheetHeights = snapPoints.map((p) => Math.round(viewportH * p));

  const y = useMotionValue(viewportH > 0 ? viewportH - sheetHeights[initialSnap] : 0);

  useEffect(() => {
    if (viewportH > 0) {
      animate(y, viewportH - sheetHeights[snapIndex], {
        type: "spring",
        stiffness: 400,
        damping: 40,
      });
    }
  }, [viewportH]);

  const backdropOpacity = useTransform(
    y,
    [viewportH - sheetHeights[sheetHeights.length - 1], viewportH - sheetHeights[0]],
    [0.4, 0]
  );

  const snapTo = useCallback(
    (idx: number) => {
      const clamped = Math.max(0, Math.min(snapPoints.length - 1, idx));
      setSnapIndex(clamped);
      animate(y, viewportH - sheetHeights[clamped], {
        type: "spring",
        stiffness: 400,
        damping: 40,
      });
    },
    [viewportH, sheetHeights, snapPoints.length, y]
  );

  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      const currentY = y.get();
      const velocity = info.velocity.y;

      if (Math.abs(velocity) > 500) {
        snapTo(velocity > 0 ? Math.max(0, snapIndex - 1) : Math.min(snapPoints.length - 1, snapIndex + 1));
        return;
      }

      let closestIdx = 0;
      let closestDist = Infinity;
      for (let i = 0; i < sheetHeights.length; i++) {
        const targetY = viewportH - sheetHeights[i];
        const dist = Math.abs(currentY - targetY);
        if (dist < closestDist) {
          closestDist = dist;
          closestIdx = i;
        }
      }
      snapTo(closestIdx);
    },
    [viewportH, sheetHeights, snapIndex, snapPoints.length, snapTo, y]
  );

  if (viewportH === 0) return null;

  const maxSheetH = sheetHeights[sheetHeights.length - 1];
  const isScrollable = snapIndex >= 1;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 z-30 bg-black pointer-events-none"
        style={{ opacity: backdropOpacity }}
      />

      {/* Sheet */}
      <motion.div
        ref={containerRef}
        className="absolute left-0 right-0 z-40 flex flex-col bg-navy/95 backdrop-blur-2xl rounded-t-2xl shadow-[0_-4px_40px_rgba(0,0,0,0.4)]"
        style={{
          y,
          height: maxSheetH,
          top: 0,
          touchAction: "none",
        }}
        drag="y"
        dragConstraints={{
          top: viewportH - sheetHeights[sheetHeights.length - 1],
          bottom: viewportH - sheetHeights[0],
        }}
        dragElastic={0.1}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-2.5 pb-2 shrink-0 cursor-grab active:cursor-grabbing">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Fixed header (not scrollable) */}
        {header && (
          <div className="shrink-0 px-3 pb-2">
            {header}
          </div>
        )}

        {/* Content */}
        <div
          className={`flex-1 min-h-0 ${isScrollable ? "overflow-y-auto" : "overflow-hidden"}`}
          onTouchStart={(e) => {
            if (isScrollable) e.stopPropagation();
          }}
        >
          {children}
        </div>
      </motion.div>
    </>
  );
}
