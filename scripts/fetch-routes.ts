/**
 * Fetches walking routes from Google Directions API for all walk segments
 * and saves them as static JSON for the RouteMap component.
 *
 * Set GOOGLE_MAPS_API_KEY in `.env` or `.env.local` (see `.env.example`), then:
 *   npm run fetch-routes
 */

import { config } from "dotenv";

config({ path: ".env" });
config({ path: ".env.local", override: true });

const API_KEY_RAW = process.env.GOOGLE_MAPS_API_KEY?.trim();
if (!API_KEY_RAW) {
  console.error(
    "Missing GOOGLE_MAPS_API_KEY. Copy .env.example to .env.local and add your key."
  );
  process.exit(1);
}
const API_KEY: string = API_KEY_RAW;

interface Coord {
  lat: number;
  lng: number;
}

const locations: Record<string, Coord> = {
  "maison-souquet": { lat: 48.8824, lng: 2.3365 },
  "sacre-coeur": { lat: 48.8867, lng: 2.3431 },
  "rencontre": { lat: 48.882, lng: 2.331 },
  "moulin-rouge": { lat: 48.8841, lng: 2.3323 },
  "eiffelturm": { lat: 48.8584, lng: 2.2945 },
  "trocadero": { lat: 48.8617, lng: 2.2885 },
  "fouquets": { lat: 48.8694, lng: 2.3017 },
  "arc-de-triomphe": { lat: 48.8738, lng: 2.295 },
  "buddha-bar": { lat: 48.8662, lng: 2.324 },
  "notre-dame": { lat: 48.853, lng: 2.3499 },
  "berthillon": { lat: 48.8515, lng: 2.357 },
  "pont-des-arts": { lat: 48.8583, lng: 2.3376 },
  "louvre": { lat: 48.8606, lng: 2.3376 },
  "laduree": { lat: 48.8676, lng: 2.3225 },
  "quais-de-seine": { lat: 48.853, lng: 2.345 },
};

interface WalkSegment {
  from: string;
  to: string;
  day: string;
}

const walkSegments: WalkSegment[] = [
  // Friday
  { from: "maison-souquet", to: "rencontre", day: "friday" },
  { from: "rencontre", to: "sacre-coeur", day: "friday" },
  { from: "sacre-coeur", to: "maison-souquet", day: "friday" },
  { from: "maison-souquet", to: "moulin-rouge", day: "friday" },
  { from: "moulin-rouge", to: "maison-souquet", day: "friday" },
  // Saturday
  { from: "eiffelturm", to: "trocadero", day: "saturday" },
  { from: "trocadero", to: "fouquets", day: "saturday" },
  { from: "fouquets", to: "arc-de-triomphe", day: "saturday" },
  // Sunday (Reihenfolge wie trip.ts: Berthillon → ND → Quais → Pont des Arts → Louvre)
  { from: "berthillon", to: "notre-dame", day: "sunday" },
  { from: "notre-dame", to: "quais-de-seine", day: "sunday" },
  { from: "quais-de-seine", to: "pont-des-arts", day: "sunday" },
  { from: "pont-des-arts", to: "louvre", day: "sunday" },
];

function decodePolyline(encoded: string): [number, number][] {
  const points: [number, number][] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let shift = 0;
    let result = 0;
    let byte: number;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    lat += result & 1 ? ~(result >> 1) : result >> 1;

    shift = 0;
    result = 0;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    lng += result & 1 ? ~(result >> 1) : result >> 1;

    points.push([lat / 1e5, lng / 1e5]);
  }

  return points;
}

interface RouteResult {
  from: string;
  to: string;
  day: string;
  points: [number, number][];
  distanceMeters: number;
  durationMinutes: number;
}

async function fetchRoute(segment: WalkSegment): Promise<RouteResult | null> {
  const origin = locations[segment.from];
  const dest = locations[segment.to];

  if (!origin || !dest) {
    console.error(`Unknown location: ${segment.from} or ${segment.to}`);
    return null;
  }

  const url = new URL("https://maps.googleapis.com/maps/api/directions/json");
  url.searchParams.set("origin", `${origin.lat},${origin.lng}`);
  url.searchParams.set("destination", `${dest.lat},${dest.lng}`);
  url.searchParams.set("mode", "walking");
  url.searchParams.set("key", API_KEY);

  try {
    const res = await fetch(url.toString());
    const data = await res.json();

    if (data.status !== "OK") {
      console.error(`API error for ${segment.from} → ${segment.to}: ${data.status}`);
      return null;
    }

    const route = data.routes[0];
    const leg = route.legs[0];
    const overviewPolyline = route.overview_polyline.points;
    const points = decodePolyline(overviewPolyline);

    return {
      from: segment.from,
      to: segment.to,
      day: segment.day,
      points,
      distanceMeters: leg.distance.value,
      durationMinutes: Math.round(leg.duration.value / 60),
    };
  } catch (err) {
    console.error(`Fetch error for ${segment.from} → ${segment.to}:`, err);
    return null;
  }
}

async function main() {
  console.log(`Fetching ${walkSegments.length} walking routes...\n`);

  const results: RouteResult[] = [];

  for (const segment of walkSegments) {
    const label = `${segment.from} → ${segment.to}`;
    process.stdout.write(`  ${label} ... `);

    const result = await fetchRoute(segment);
    if (result) {
      results.push(result);
      console.log(`✓ ${result.points.length} points, ${result.distanceMeters}m, ${result.durationMinutes}min`);
    } else {
      console.log("✗ failed");
    }

    await new Promise((r) => setTimeout(r, 200));
  }

  const fs = await import("fs");
  const path = await import("path");
  const outPath = path.join(process.cwd(), "data", "walking-routes.json");
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));

  console.log(`\n✓ Saved ${results.length} routes to data/walking-routes.json`);
}

main();
