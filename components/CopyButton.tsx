"use client";

import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";

interface CopyButtonProps {
  /** The text value to copy to clipboard. */
  value: string;
  /** Visual variant — "pill" for TicketVault, "inline" for Timeline popovers. */
  variant?: "pill" | "inline";
}

/**
 * Shared copy-to-clipboard button with success feedback.
 * Gracefully falls back if the Clipboard API is unavailable.
 */
export default function CopyButton({ value, variant = "pill" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (HTTP, older browser) — silent fail
    }
  }, [value]);

  if (variant === "inline") {
    return (
      <button
        type="button"
        onClick={copy}
        className="ml-2 p-1 rounded hover:bg-glass-hover transition-colors"
        aria-label="Kopieren"
      >
        {copied ? (
          <Check className="w-3 h-3 text-accent-green" />
        ) : (
          <Copy className="w-3 h-3 text-text-muted" />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        void copy();
      }}
      className="shrink-0 p-2 rounded-full bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.12] transition-colors"
      aria-label="Kopieren"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-accent-green" />
      ) : (
        <Copy className="w-3.5 h-3.5 text-text-muted hover:text-gold transition-colors" />
      )}
    </button>
  );
}
