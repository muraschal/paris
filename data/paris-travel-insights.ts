/**
 * Richtwerte für Reisende — illustrativ, nicht Preisgarantie.
 * Kaffee: typischer Café-crème / Cappuccino am Tisch im Zentrum, ca. 2024–2025.
 */

export interface CityCoffeeRow {
  city: string;
  /** ISO-ähnlich für Mini-Label */
  flag: string;
  /** Durchschnitt ca. in EUR */
  eur: number;
}

/** Relativvergleich — höchster Balken = teuerster in dieser Auswahl */
export const COFFEE_COMPARE: CityCoffeeRow[] = [
  { city: "Paris", flag: "FR", eur: 4.2 },
  { city: "Berlin", flag: "DE", eur: 3.5 },
  { city: "München", flag: "DE", eur: 4.0 },
  { city: "London", flag: "UK", eur: 5.0 },
  { city: "Rom", flag: "IT", eur: 2.9 },
  { city: "Zürich", flag: "CH", eur: 5.65 },
];

export interface MetroRow {
  city: string;
  flag: string;
  /** Einzelfahrt Innenstadt / Zone 1, ca. EUR */
  eur: number;
}

export const METRO_COMPARE: MetroRow[] = [
  { city: "Paris", flag: "FR", eur: 2.5 },
  { city: "Berlin", flag: "DE", eur: 3.2 },
  { city: "München", flag: "DE", eur: 3.5 },
  { city: "London", flag: "UK", eur: 3.0 },
  { city: "Mailand", flag: "IT", eur: 2.0 },
  { city: "Zürich", flag: "CH", eur: 3.25 },
];

export interface TravelInsight {
  title: string;
  detail: string;
  /** lucide icon name subset */
  icon: "train" | "utensils" | "wallet" | "smartphone" | "receipt" | "trending";
}

export const TRAVEL_INSIGHTS: TravelInsight[] = [
  {
    icon: "train",
    title: "ÖPNV",
    detail:
      "Einzelfahrt Zentrum oft um 2,50 € — Tagespakete & Navigo Easy lohnen bei mehreren Fahrten. Flughafen ≠ Zentrum: Aufpreis einplanen.",
  },
  {
    icon: "utensils",
    title: "Mittagessen",
    detail:
      "Formule du jour in Bistro-Terrain viele 16–24 €. Direkt an Touristen-Hotspots + Terrasse = schnell +30 %.",
  },
  {
    icon: "wallet",
    title: "Trinkgeld & Service",
    detail:
      "„Service compris“ steht oft auf der Rechnung — trotzdem 5–10 % oder Aufrunden bei gutem Service üblich.",
  },
  {
    icon: "smartphone",
    title: "Zahlen wie ein Local",
    detail:
      "Kontaktlos überall ab Kleinstbeträgen — Apple/Google Pay geht fast durchgängig. Bargeld nur für kleine Märkte / Kiosk.",
  },
  {
    icon: "receipt",
    title: "MwSt.-Erstattung",
    detail:
      "Ab ca. 100 € Einkauf bei teilnehmenden Shops (nicht überall): Tax-free-Formular — Reisepass mitführen.",
  },
  {
    icon: "trending",
    title: "Großstadt-Kontext",
    detail:
      "Paris liegt bei Lebenshaltungskosten international vorn — zur Kostenersparnis: Bistro statt Boulevard-Café direkt am Block.",
  },
];
