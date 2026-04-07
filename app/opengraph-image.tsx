import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Rendez-vous à Paris — Murielle & Marcel · 1.–3. Mai 2026";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0a1a 0%, #141428 50%, #0a0a1a 100%)",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle radial glow */}
        <div
          style={{
            position: "absolute",
            top: "-200px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "800px",
            height: "800px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(201,169,110,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Eiffel Tower emoji */}
        <div style={{ fontSize: 120, marginBottom: 20, display: "flex" }}>🗼</div>

        {/* Title */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 200,
            letterSpacing: "-0.5px",
            color: "#f5f0e8",
            marginBottom: 12,
            display: "flex",
          }}
        >
          Rendez-vous à Paris
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 300,
            color: "#c9a96e",
            letterSpacing: "4px",
            textTransform: "uppercase" as const,
            marginBottom: 24,
            display: "flex",
          }}
        >
          Murielle & Marcel
        </div>

        {/* Divider */}
        <div
          style={{
            width: 80,
            height: 1,
            background: "linear-gradient(90deg, transparent, #c9a96e, transparent)",
            marginBottom: 24,
            display: "flex",
          }}
        />

        {/* Date & Hotel */}
        <div
          style={{
            fontSize: 20,
            fontWeight: 300,
            color: "rgba(245,240,232,0.5)",
            letterSpacing: "2px",
            display: "flex",
            gap: 16,
            alignItems: "center",
          }}
        >
          <span>1.–3. Mai 2026</span>
          <span style={{ color: "rgba(201,169,110,0.4)" }}>·</span>
          <span>Maison Souquet</span>
          <span style={{ color: "rgba(201,169,110,0.4)" }}>·</span>
          <span>Pigalle</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
