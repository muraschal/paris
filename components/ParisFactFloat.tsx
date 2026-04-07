"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PARIS_FACTS } from "@/data/paris-facts";

const LEN = PARIS_FACTS.length;

function randInt(max: number) {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0]! % max;
  }
  return Math.floor(Math.random() * max);
}

function randRange(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function nextIndex(prev: number) {
  if (LEN <= 1) return 0;
  let n = prev;
  let guard = 0;
  while (n === prev && guard++ < 12) {
    n = randInt(LEN);
  }
  if (n === prev) n = (prev + 1 + randInt(LEN - 1)) % LEN;
  return n;
}

type Zone = "tl" | "tr" | "bc";

type SlotDef = {
  zone: Zone;
  align: "left" | "right" | "center";
};

const SLOTS: SlotDef[] = [
  { zone: "tl", align: "left" },
  { zone: "tr", align: "right" },
  { zone: "bc", align: "center" },
];

/** Pro Slot: fixe Zone, aber Zufallswerte für Platz & Bewegung */
export type SlotEntropy = {
  position: CSSProperties;
  /** Sanftes Reinfloaten vom Rand her */
  enterX: number;
  enterY: number;
  enterScale: number;
  enterRotate: number;
  /** Kontinuierliches Driften (5 Stützpunkte = organischer Pfad) */
  driftX: number[];
  driftY: number[];
  driftRotate: number[];
  floatDuration: number;
  floatDelay: number;
  floatPhaseY: number;
  xDurationScale: number;
  yDurationScale: number;
  rotDurationScale: number;
  intervalMin: number;
  intervalMax: number;
  entranceDelay: number;
  maxWidthRem: number;
};

function driftKeyframes(): number[] {
  return [
    0,
    randRange(-22, 22),
    randRange(-14, 18),
    randRange(-18, 12),
    randRange(-10, 20),
    0,
  ];
}

function rotDriftKeyframes(base: number): number[] {
  return [
    base,
    base + randRange(-2.2, 2.2),
    base + randRange(-1.4, 1.6),
    base + randRange(-1.8, 1.8),
    base + randRange(-1, 1),
    base,
  ];
}

function generateEntropyForZone(zone: Zone): SlotEntropy {
  const baseRot = randRange(-5, 5);

  let position: CSSProperties;
  switch (zone) {
    case "tl":
      position = {
        left: `${randRange(0.5, 17)}%`,
        top: `${randRange(8, 30)}%`,
      };
      break;
    case "tr":
      position = {
        right: `${randRange(0.5, 17)}%`,
        top: `${randRange(9, 31)}%`,
      };
      break;
    default: {
      /* Zentrierung über Klasse left-1/2 -translate-x-1/2 — kein transform-Konflikt mit Framer */
      position = {
        bottom: `${randRange(4, 26)}%`,
        marginLeft: `${randRange(-40, 40)}px`,
      };
      break;
    }
  }

  const fromBelow = Math.random() > 0.42;
  let enterX: number;
  let enterY: number;
  if (zone === "tl") {
    enterX = randRange(-70, -8);
    enterY = fromBelow ? randRange(40, 95) : randRange(-75, -15);
  } else if (zone === "tr") {
    enterX = randRange(8, 75);
    enterY = fromBelow ? randRange(35, 90) : randRange(-70, -12);
  } else {
    enterX = randRange(-50, 50);
    enterY = fromBelow ? randRange(50, 100) : randRange(-55, -18);
  }

  return {
    position,
    enterX,
    enterY,
    enterScale: randRange(0.92, 0.99),
    enterRotate: baseRot + randRange(-10, 10),
    driftX: driftKeyframes(),
    driftY: driftKeyframes(),
    driftRotate: rotDriftKeyframes(baseRot),
    floatDuration: randRange(12, 26),
    floatDelay: randRange(0, 3.2),
    floatPhaseY: randRange(0, 0.4),
    xDurationScale: randRange(0.88, 1.22),
    yDurationScale: randRange(0.92, 1.12),
    rotDurationScale: randRange(1.05, 1.55),
    intervalMin: randRange(5500, 9000),
    intervalMax: randRange(12000, 22000),
    entranceDelay: randRange(0.15, 2.8),
    maxWidthRem: randRange(13.5, 19),
  };
}

/** Wort für Wort */
function WordReveal({
  text,
  contentKey,
  alignClass,
}: {
  text: string;
  contentKey: number;
  alignClass: string;
}) {
  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text]);
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    setVisible(0);
    if (words.length === 0) return;

    let wordIndex = 0;
    let timeoutId: number | undefined;

    const showNext = () => {
      wordIndex += 1;
      setVisible(wordIndex);
      if (wordIndex >= words.length) return;
      const ms = randRange(42, 95);
      timeoutId = window.setTimeout(showNext, ms);
    };

    const firstMs = randRange(120, 280);
    timeoutId = window.setTimeout(showNext, firstMs);

    return () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [text, contentKey, words.length]);

  const shown = words.slice(0, visible).join(" ");

  return (
    <motion.span
      key={contentKey}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className={`
        ${alignClass}
        inline-block w-full
        text-[11px] sm:text-xs md:text-[13px]
        leading-snug md:leading-relaxed
        font-light italic text-white
        tracking-[0.02em] text-balance
        [text-shadow:0_1px_16px_rgba(0,0,0,0.95),0_0_32px_rgba(0,0,0,0.65),0_0_1px_rgba(0,0,0,1)]
      `}
    >
      {shown}
      {visible < words.length && (
        <span
          className="inline-block w-0.5 h-[0.85em] ml-0.5 align-[-0.1em] bg-white/90 animate-pulse rounded-sm"
          aria-hidden
        />
      )}
    </motion.span>
  );
}

function FloatingQuote({
  slotIndex,
  slot,
  entropy,
}: {
  slotIndex: number;
  slot: SlotDef;
  entropy: SlotEntropy;
}) {
  const [idx, setIdx] = useState(() => randInt(LEN));

  const rotate = useCallback(() => {
    setIdx((prev) => nextIndex(prev));
  }, []);

  useEffect(() => {
    let cancelled = false;
    let timeoutId: number | undefined;

    const scheduleNext = () => {
      const span = Math.max(2000, entropy.intervalMax - entropy.intervalMin);
      const wait = entropy.intervalMin + Math.random() * span;
      timeoutId = window.setTimeout(() => {
        if (cancelled) return;
        rotate();
        scheduleNext();
      }, wait);
    };

    const firstWait = randRange(4000, 11000) + slotIndex * randRange(80, 400);
    timeoutId = window.setTimeout(() => {
      if (cancelled) return;
      rotate();
      scheduleNext();
    }, firstWait);

    return () => {
      cancelled = true;
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [rotate, slotIndex, entropy.intervalMin, entropy.intervalMax]);

  const alignClass =
    slot.align === "left"
      ? "text-left"
      : slot.align === "right"
        ? "text-right"
        : "text-center";

  const sizeStyle: CSSProperties =
    slot.zone === "bc"
      ? { width: "min(92vw, 24rem)" }
      : { maxWidth: `${entropy.maxWidthRem}rem` };

  const baseRot = entropy.driftRotate[0] ?? 0;

  return (
    <motion.div
      className={`absolute pointer-events-none will-change-transform ${
        slot.zone === "bc" ? "left-1/2 -translate-x-1/2" : ""
      }`}
      style={{ ...entropy.position, ...sizeStyle }}
      initial={{
        opacity: 0,
        x: entropy.enterX,
        y: entropy.enterY,
        scale: entropy.enterScale,
        rotate: entropy.enterRotate,
      }}
      animate={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotate: baseRot,
      }}
      transition={{
        opacity: { duration: 0.9, delay: entropy.entranceDelay, ease: [0.2, 0.85, 0.25, 1] },
        x: { duration: 1.35, delay: entropy.entranceDelay, ease: [0.16, 1, 0.3, 1] },
        y: { duration: 1.35, delay: entropy.entranceDelay, ease: [0.16, 1, 0.3, 1] },
        scale: { duration: 1.35, delay: entropy.entranceDelay, ease: [0.16, 1, 0.3, 1] },
        rotate: { duration: 1.45, delay: entropy.entranceDelay, ease: [0.2, 1, 0.2, 1] },
      }}
    >
      <motion.div
        animate={{
          x: entropy.driftX,
          y: entropy.driftY,
          rotate: entropy.driftRotate,
        }}
        transition={{
          x: {
            repeat: Infinity,
            duration: entropy.floatDuration * entropy.xDurationScale,
            ease: "easeInOut",
            delay: entropy.floatDelay,
          },
          y: {
            repeat: Infinity,
            duration: entropy.floatDuration * entropy.yDurationScale,
            ease: "easeInOut",
            delay: entropy.floatDelay + entropy.floatPhaseY,
          },
          rotate: {
            repeat: Infinity,
            duration: entropy.floatDuration * entropy.rotDurationScale,
            ease: "easeInOut",
            delay: entropy.floatDelay,
          },
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className={
              slot.align === "center"
                ? "min-h-[2.75rem] sm:min-h-[3rem] px-1"
                : "min-h-[2.75rem] sm:min-h-[3rem]"
            }
          >
            <WordReveal
              text={PARIS_FACTS[idx]!}
              contentKey={idx}
              alignClass={alignClass}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default function ParisFactFloat() {
  const entropies = useMemo(
    () => SLOTS.map((s) => generateEntropyForZone(s.zone)),
    []
  );

  return (
    <div
      className="absolute inset-0 z-[7] overflow-hidden pointer-events-none"
      aria-hidden
    >
      {SLOTS.map((slot, i) => (
        <FloatingQuote
          key={i}
          slotIndex={i}
          slot={slot}
          entropy={entropies[i]!}
        />
      ))}
    </div>
  );
}
