/** Shared constants used across multiple components. */

/** Per-day accent colours — index 0 = Friday, 1 = Saturday, 2 = Sunday, 3 = ALL. */
export const DAY_COLORS = ["#c9a96e", "#7eb8e0", "#e0a07e", "#a89fbf"] as const;

/** Day keys used for route-JSON look-ups. */
export const DAY_KEYS = ["friday", "saturday", "sunday"] as const;

/** French day labels shown in tabs. */
export const DAY_LABELS = ["Vendredi", "Samedi", "Dimanche", "ALL"] as const;

/** German day labels (used in ticket badges & map bounds). */
export const DAY_LABELS_DE = ["Freitag", "Samstag", "Sonntag"] as const;

/**
 * Alternating warm/cool palettes for route segments so that neighbours always
 * contrast.  One sub-array per trip day.
 */
export const STAGE_PALETTES: readonly string[][] = [
  // Friday
  ["#FFD700", "#FF8C00", "#22D3EE", "#FF6B6B", "#4ADE80"],
  // Saturday
  ["#38BDF8", "#FACC15", "#F472B6", "#34D399", "#C084FC"],
  // Sunday
  ["#FB7185", "#2DD4BF", "#FCD34D", "#A78BFA", "#38BDF8"],
];

/** Colour used when a map marker or timeline segment is hovered. */
export const HOVER_COLOR = "#FF2D78";

/** Accent colour for the combined "ALL days" map view. */
export const ALL_MAP_ACCENT = "#c9a96e";
