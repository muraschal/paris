"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PARIS_FACTS, PARIS_FACTS_COUNT } from "@/data/paris-facts";

const LEN = PARIS_FACTS.length;
const ROTATE_MS = 14_000;

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

/** Wort für Wort */
function WordReveal({ text, contentKey }: { text: string; contentKey: number }) {
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
      className="inline-block w-full text-center text-[11px] sm:text-xs md:text-[13px] leading-snug md:leading-relaxed font-light italic text-white/90 tracking-[0.02em] text-balance [text-shadow:0_1px_16px_rgba(0,0,0,0.95),0_0_32px_rgba(0,0,0,0.65),0_0_1px_rgba(0,0,0,1)]"
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

export default function ParisHeroFact() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIdx((prev) => nextIndex(prev));
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className="mx-auto w-full max-w-md min-h-[2.75rem] sm:min-h-[3rem] px-2 flex flex-col items-center justify-center gap-1.5"
      aria-live="polite"
    >
      <p className="text-[10px] sm:text-[11px] text-gold/75 font-mono tabular-nums tracking-[0.12em] uppercase">
        Fakt {idx + 1} / {PARIS_FACTS_COUNT}
      </p>
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.35 }}
          className="w-full"
        >
          <WordReveal text={PARIS_FACTS[idx]!} contentKey={idx} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
