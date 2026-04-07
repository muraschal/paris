export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  coordinates: Coordinates;
  googleMapsUrl: string;
  category: "hotel" | "restaurant" | "landmark" | "bar" | "cafe" | "entertainment" | "shopping";
  photoSpot?: boolean;
  instagramUrl?: string;
  photoTip?: string;
}

export interface TicketInfo {
  title: string;
  day: string;
  datetime: string;
  refs: { label: string; value: string }[];
  notes: string[];
  cancellation?: string;
}

export interface TripEvent {
  time: string;
  endTime?: string;
  title: string;
  description?: string;
  locationId: string | null;
  transport: "walk" | "uber" | "none";
  transportDuration?: string;
  cost: number | null;
  costNote?: string;
  costPaid?: boolean;
  highlight: boolean;
  ticketRef?: string;
  icon: string;
  note?: string;
}

export interface TripDay {
  date: string;
  label: string;
  subtitle: string;
  events: TripEvent[];
  totalCost: number;
}

export interface BudgetItem {
  label: string;
  amount: number;
  icon: string;
}

export const locations: Location[] = [
  {
    id: "maison-souquet",
    name: "Maison Souquet",
    address: "10 Rue de Bruxelles, 75009 Paris",
    coordinates: { lat: 48.8836, lng: 2.3315 },
    googleMapsUrl: "https://maps.google.com/?q=10+Rue+de+Bruxelles+75009+Paris",
    category: "hotel",
  },
  {
    id: "sacre-coeur",
    name: "Sacré-Cœur",
    address: "35 Rue du Chevalier de la Barre, 75018 Paris",
    coordinates: { lat: 48.8867, lng: 2.3431 },
    googleMapsUrl: "https://maps.google.com/?q=Sacre+Coeur+Paris",
    category: "landmark",
    photoSpot: true,
    instagramUrl: "https://www.instagram.com/explore/locations/1030199848/sacre-coeur/",
    photoTip: "Treppen von unten fotografieren — Basilika im Abendlicht mit Paris-Panorama",
  },
  {
    id: "rencontre",
    name: "Rencontre",
    address: "51 Rue Blanche, 75009 Paris",
    coordinates: { lat: 48.8810, lng: 2.3314 },
    googleMapsUrl: "https://maps.google.com/?q=51+Rue+Blanche+75009+Paris",
    category: "restaurant",
  },
  {
    id: "moulin-rouge",
    name: "Moulin Rouge",
    address: "82 Bd de Clichy, 75018 Paris",
    coordinates: { lat: 48.8841, lng: 2.3323 },
    googleMapsUrl: "https://maps.google.com/?q=Moulin+Rouge+Paris",
    category: "entertainment",
  },
  {
    id: "eiffelturm",
    name: "Tour Eiffel",
    address: "Champ de Mars, 75007 Paris",
    coordinates: { lat: 48.8584, lng: 2.2945 },
    googleMapsUrl: "https://maps.google.com/?q=Tour+Eiffel+Paris",
    category: "landmark",
    photoSpot: true,
    instagramUrl: "https://www.instagram.com/explore/locations/514867263/eiffelturm-paris---la-tour-eiffel/",
    photoTip: "Vom 2. Stock nach unten durch die Eisenstruktur — oder klassisch vom Trocadéro",
  },
  {
    id: "trocadero",
    name: "Trocadéro",
    address: "Place du Trocadéro, 75016 Paris",
    coordinates: { lat: 48.8617, lng: 2.2885 },
    googleMapsUrl: "https://maps.google.com/?q=Trocadero+Paris",
    category: "landmark",
    photoSpot: true,
    instagramUrl: "https://www.instagram.com/explore/locations/215916311/jardins-du-trocadero/",
    photoTip: "DER ikonische Eiffelturm-Blick — Fontänen im Vordergrund, Turm mittig",
  },
  {
    id: "fouquets",
    name: "Café Fouquet's",
    address: "99 Av. des Champs-Élysées, 75008 Paris",
    coordinates: { lat: 48.8694, lng: 2.3017 },
    googleMapsUrl: "https://maps.google.com/?q=Fouquets+Champs+Elysees+Paris",
    category: "cafe",
  },
  {
    id: "arc-de-triomphe",
    name: "Arc de Triomphe",
    address: "Place Charles de Gaulle, 75008 Paris",
    coordinates: { lat: 48.8738, lng: 2.2950 },
    googleMapsUrl: "https://maps.google.com/?q=Arc+de+Triomphe+Paris",
    category: "landmark",
    photoSpot: true,
    instagramUrl: "https://www.instagram.com/explore/locations/288407680/arc-de-triomphe-de-letoile/",
    photoTip: "360°-Panorama von der Terrasse — Champs-Élysées, La Défense, Eiffelturm",
  },
  {
    id: "buddha-bar",
    name: "Buddha Bar",
    address: "8 Rue Boissy d'Anglas, 75008 Paris",
    coordinates: { lat: 48.8662, lng: 2.3240 },
    googleMapsUrl: "https://maps.google.com/?q=Buddha+Bar+Paris",
    category: "restaurant",
  },
  {
    id: "notre-dame",
    name: "Notre-Dame",
    address: "6 Parvis Notre-Dame, 75004 Paris",
    coordinates: { lat: 48.8530, lng: 2.3499 },
    googleMapsUrl: "https://maps.google.com/?q=Notre+Dame+Paris",
    category: "landmark",
    photoSpot: true,
    instagramUrl: "https://www.instagram.com/explore/locations/534169173/cathedrale-notre-dame-de-paris/",
    photoTip: "Frisch restaurierte Fassade — morgens weniger Touristen, Licht von Osten",
  },
  {
    id: "berthillon",
    name: "Berthillon",
    address: "29-31 Rue Saint-Louis en l'Île, 75004 Paris",
    coordinates: { lat: 48.8515, lng: 2.3570 },
    googleMapsUrl: "https://maps.google.com/?q=Berthillon+Paris",
    category: "cafe",
  },
  {
    id: "pont-des-arts",
    name: "Pont des Arts",
    address: "Pont des Arts, 75006 Paris",
    coordinates: { lat: 48.8583, lng: 2.3376 },
    googleMapsUrl: "https://maps.google.com/?q=Pont+des+Arts+Paris",
    category: "landmark",
    photoSpot: true,
    instagramUrl: "https://www.instagram.com/explore/locations/252157666/pont-des-arts-bridge-in-paris/",
    photoTip: "Paar-Foto auf der Brücke mit Île de la Cité im Hintergrund",
  },
  {
    id: "louvre",
    name: "Louvre & Jardin des Tuileries",
    address: "Rue de Rivoli, 75001 Paris",
    coordinates: { lat: 48.8606, lng: 2.3376 },
    googleMapsUrl: "https://maps.google.com/?q=Louvre+Pyramide+Paris",
    category: "landmark",
    photoSpot: true,
    instagramUrl: "https://www.instagram.com/explore/locations/685982323/pyramide-du-louvre/",
    photoTip: "Glaspyramide spiegelt sich im Wasser — knieend von unten ist der Trick",
  },
  {
    id: "laduree",
    name: "Ladurée Paris Royale",
    address: "16 Rue Royale, 75008 Paris",
    coordinates: { lat: 48.8676, lng: 2.3225 },
    googleMapsUrl: "https://maps.google.com/?q=16+Rue+Royale+75008+Paris",
    category: "restaurant",
  },
  {
    id: "quais-de-seine",
    name: "Quais de Seine",
    address: "Quai de la Tournelle, 75005 Paris",
    coordinates: { lat: 48.8530, lng: 2.3450 },
    googleMapsUrl: "https://maps.google.com/?q=Quais+de+Seine+Paris",
    category: "landmark",
    photoSpot: true,
    instagramUrl: "https://www.instagram.com/explore/locations/234481796/les-quais-de-la-seine/",
    photoTip: "Bouquinistes und Seine-Ufer — Kamera tief halten für dramatische Perspektive",
  },
];

export const days: TripDay[] = [
  {
    date: "2026-05-01",
    label: "Vendredi",
    subtitle: "Jour 1 — Fête du Travail",
    totalCost: 550,
    events: [
      {
        time: "~10:30",
        title: "Ankunft & Montmartre-Bummel",
        description: "Gepäck im Hotel abgeben · Café, Croissant & Sacré-Cœur-Blick",
        locationId: "maison-souquet",
        transport: "none",
        cost: 30,
        costNote: "Kaffee + Croissant",
        highlight: false,
        icon: "coffee",
      },
      {
        time: "14:00",
        title: "Check-in Maison Souquet",
        locationId: "maison-souquet",
        transport: "none",
        cost: null,
        highlight: false,
        icon: "hotel",
      },
      {
        time: "16:00",
        endTime: "17:00",
        title: "Salon d'Eau — Pool & Hammam",
        description: "1h privat — Pool, Hammam, pure Entspannung",
        locationId: "maison-souquet",
        transport: "none",
        cost: null,
        costNote: "Inklusiv",
        costPaid: true,
        highlight: true,
        icon: "waves",
      },
      {
        time: "~18:00",
        title: "Cocktails — Salon des petits bonheurs",
        description: "Signature Cocktails nach Pariser Kurtisanen benannt",
        locationId: "maison-souquet",
        transport: "none",
        cost: 40,
        costNote: "2 Signature Cocktails",
        highlight: false,
        icon: "champagne",
      },
      {
        time: "19:15",
        endTime: "~20:30",
        title: "Dinner — Rencontre",
        description: "51 Rue Blanche · ⭐ 5.0",
        locationId: "rencontre",
        transport: "walk",
        transportDuration: "5 Min",
        cost: 150,
        costNote: "Dinner + Wein für 2",
        costPaid: false,
        highlight: true,
        icon: "utensils",
        ticketRef: "rencontre",
      },
      {
        time: "~21:00",
        title: "Sacré-Cœur — Blaue Stunde",
        description: "Sunset 21:07 · Die magische Stunde",
        locationId: "sacre-coeur",
        transport: "walk",
        transportDuration: "28 Min",
        cost: null,
        highlight: true,
        icon: "sunset",
      },
      {
        time: "~21:45",
        title: "Hotel — Frisch machen",
        description: "Highheels montieren 👠",
        locationId: "maison-souquet",
        transport: "walk",
        transportDuration: "17 Min",
        cost: null,
        highlight: false,
        icon: "sparkles",
      },
      {
        time: "22:45",
        endTime: "~01:15",
        title: "Moulin Rouge — Féerie Show",
        description: "Einlass 22:45 · Show 23:30 · Reihe R 554",
        locationId: "moulin-rouge",
        transport: "walk",
        transportDuration: "2 Min",
        cost: 330,
        costNote: "bereits bezahlt (270€ Tickets + ~60€ Drinks)",
        costPaid: true,
        highlight: true,
        icon: "star",
        note: "15–20 Min früher da sein!",
        ticketRef: "moulin-rouge",
      },
      {
        time: "~01:30",
        title: "Zurück — Maison Souquet",
        locationId: "maison-souquet",
        transport: "walk",
        transportDuration: "2 Min",
        cost: null,
        highlight: false,
        icon: "moon",
      },
    ],
  },
  {
    date: "2026-05-02",
    label: "Samedi",
    subtitle: "Jour 2 — Grand Tour de Paris",
    totalCost: 620,
    events: [
      {
        time: "~09:30",
        title: "Frühstück im Hotel",
        description: "Room Service für 2",
        locationId: "maison-souquet",
        transport: "none",
        cost: 60,
        costNote: "Room Service für 2",
        highlight: false,
        icon: "coffee",
      },
      {
        time: "13:45",
        title: "Uber → Tour Eiffel",
        locationId: "eiffelturm",
        transport: "uber",
        cost: 15,
        highlight: false,
        icon: "car",
      },
      {
        time: "14:00",
        endTime: "15:30",
        title: "Tour Eiffel — 2nd Floor + Champagne",
        description: "Champagne-Kiosk Pilier EST, 2. Etage",
        locationId: "eiffelturm",
        transport: "none",
        cost: 89,
        costNote: "bereits bezahlt",
        costPaid: true,
        highlight: true,
        icon: "landmark",
        note: "Eingang 'Visiteurs munis de billets' (grüne Flagge) — 15–20 Min früher!",
        ticketRef: "eiffelturm",
      },
      {
        time: "~15:45",
        title: "Trocadéro — Fotostop",
        description: "Der ikonische Eiffelturm-Blick",
        locationId: "trocadero",
        transport: "walk",
        transportDuration: "13 Min",
        cost: null,
        highlight: true,
        icon: "camera",
      },
      {
        time: "~16:15",
        title: "Café Fouquet's",
        description: "Champs-Élysées — Kaffee & Drinks für 2",
        locationId: "fouquets",
        transport: "walk",
        transportDuration: "21 Min",
        cost: 60,
        highlight: false,
        icon: "coffee",
      },
      {
        time: "~17:00",
        title: "Arc de Triomphe",
        description: "Walk-in · Panorama über ganz Paris",
        locationId: "arc-de-triomphe",
        transport: "walk",
        transportDuration: "13 Min",
        cost: 44,
        costNote: "2× 22€",
        highlight: true,
        icon: "landmark",
      },
      {
        time: "~18:00",
        title: "Uber → Maison Souquet",
        locationId: "maison-souquet",
        transport: "uber",
        cost: 15,
        highlight: false,
        icon: "car",
      },
      {
        time: "~18:15",
        endTime: "21:00",
        title: "Quality Time im Zimmer",
        description: "😏",
        locationId: "maison-souquet",
        transport: "none",
        cost: null,
        highlight: false,
        icon: "heart",
      },
      {
        time: "~21:15",
        title: "Uber → Buddha Bar",
        locationId: "buddha-bar",
        transport: "uber",
        cost: 15,
        highlight: false,
        icon: "car",
      },
      {
        time: "21:30",
        endTime: "Late",
        title: "Buddha Bar — Dinner & DJ",
        description: "Dinner + Drinks + DJ — die ganze Nacht",
        locationId: "buddha-bar",
        transport: "none",
        cost: 300,
        costNote: "Dinner + Drinks + DJ",
        highlight: true,
        icon: "music",
        ticketRef: "buddha-bar",
      },
      {
        time: "Late",
        title: "Uber → Hotel",
        locationId: "maison-souquet",
        transport: "uber",
        cost: 20,
        costNote: "Nachtzuschlag",
        highlight: false,
        icon: "moon",
      },
    ],
  },
  {
    date: "2026-05-03",
    label: "Dimanche",
    subtitle: "Jour 3 — Le Grand Finale",
    totalCost: 335,
    events: [
      {
        time: "~09:00",
        title: "Frühstück im Zimmer",
        description: "Room Service für 2",
        locationId: "maison-souquet",
        transport: "none",
        cost: 60,
        costNote: "Room Service für 2",
        highlight: false,
        icon: "coffee",
      },
      {
        time: "~09:45",
        title: "Uber → Notre-Dame",
        locationId: "notre-dame",
        transport: "uber",
        cost: 15,
        highlight: false,
        icon: "car",
      },
      {
        time: "~10:00",
        title: "Notre-Dame",
        description: "Die frisch restaurierte Kathedrale (außen)",
        locationId: "notre-dame",
        transport: "none",
        cost: null,
        highlight: true,
        icon: "landmark",
      },
      {
        time: "~10:30",
        title: "Berthillon — Eis",
        description: "Das beste Eis von Paris · Île Saint-Louis",
        locationId: "berthillon",
        transport: "walk",
        transportDuration: "8 Min",
        cost: 15,
        highlight: false,
        icon: "iceCream",
      },
      {
        time: "~11:10",
        title: "Pont des Arts",
        description: "Die berühmte Liebesbrücke",
        locationId: "pont-des-arts",
        transport: "walk",
        transportDuration: "25 Min",
        cost: null,
        highlight: true,
        icon: "heart",
      },
      {
        time: "~11:30",
        title: "Quais de Seine & Louvre Pyramide",
        description: "Spaziergang am Ufer · Fotostop bei der Pyramide",
        locationId: "louvre",
        transport: "walk",
        transportDuration: "8 Min",
        cost: null,
        highlight: true,
        icon: "camera",
      },
      {
        time: "~11:45",
        title: "Uber → Ladurée",
        locationId: "laduree",
        transport: "uber",
        cost: 10,
        highlight: false,
        icon: "car",
      },
      {
        time: "12:00",
        endTime: "~13:30",
        title: "Brunch — Ladurée Paris Royale",
        description: "Macarons, Eggs Benedict, Champagne",
        locationId: "laduree",
        transport: "none",
        cost: 160,
        costNote: "Brunch + Drinks für 2",
        highlight: true,
        icon: "utensils",
        ticketRef: "laduree",
      },
      {
        time: "~13:30",
        title: "Uber → Hotel",
        locationId: "maison-souquet",
        transport: "uber",
        cost: 15,
        highlight: false,
        icon: "car",
      },
      {
        time: "~14:00",
        title: "Check-out & Koffer holen",
        locationId: "maison-souquet",
        transport: "none",
        cost: null,
        highlight: false,
        icon: "luggage",
      },
      {
        time: "~14:30",
        title: "Uber → CDG",
        description: "Au revoir, Paris!",
        locationId: null,
        transport: "uber",
        cost: 60,
        highlight: false,
        icon: "plane",
      },
    ],
  },
];

export const tickets: Record<string, TicketInfo> = {
  "maison-souquet": {
    title: "Maison Souquet — 2 Nächte",
    day: "Freitag",
    datetime: "Fr 1. Mai 14:00 – So 3. Mai 12:00",
    refs: [
      { label: "Buchung", value: "0fVJusWbA" },
    ],
    notes: [
      "10 Rue de Bruxelles, 75009 Paris",
      "Inkl. Salon d'Eau (Pool & Hammam)",
    ],
  },
  "salon-deau": {
    title: "Salon d'Eau — Pool & Hammam",
    day: "Freitag",
    datetime: "Fr 1. Mai · 16:00–17:00",
    refs: [],
    notes: [
      "1h privat · Pool + Hammam",
      "Bestätigt von Angélique IBASHEVA",
      "Inklusiv im Hotelaufenthalt",
    ],
  },
  "rencontre": {
    title: "Rencontre — Dinner",
    day: "Freitag",
    datetime: "Fr 1. Mai · 19:15 · 2 Personen",
    refs: [
      { label: "Reservation", value: "TheFork" },
    ],
    notes: [
      "51 Rue Blanche, 75009 Paris",
    ],
  },
  "moulin-rouge": {
    title: "Moulin Rouge — Féerie Show",
    day: "Freitag",
    datetime: "Fr 1. Mai · Einlass 22:45 · Show 23:30",
    refs: [
      { label: "Marcel", value: "6023453" },
      { label: "Murielle", value: "6023454" },
    ],
    notes: [
      "Reihe R 554",
      "15–20 Min früher da sein!",
    ],
    cancellation: "Non-refundable",
  },
  "eiffelturm": {
    title: "Tour Eiffel — 2nd Floor + Champagne",
    day: "Samstag",
    datetime: "Sa 2. Mai · 14:00–15:30",
    refs: [
      { label: "Marcel", value: "341262010064829591" },
      { label: "Murielle", value: "341262010064829647" },
      { label: "Champagne 1", value: "341262010064829709" },
      { label: "Champagne 2", value: "341262010064829859" },
    ],
    notes: [
      "Eingang: 'Visiteurs munis de billets' (grüne Flagge)",
      "Champagne: Kiosk Pilier EST, 2. Etage",
      "15–20 Min früher da sein!",
    ],
    cancellation: "Non-modifiable, Non-remboursable",
  },
  "buddha-bar": {
    title: "Buddha Bar — Dinner",
    day: "Samstag",
    datetime: "Sa 2. Mai · 21:30 · 2 Personen",
    refs: [
      { label: "Reservation", value: "68ET5URZVCJW" },
    ],
    notes: [],
    cancellation: "Cancel min. 24h: buddhabar@buddhabar.com · 50€/Person No-Show",
  },
  "laduree": {
    title: "Ladurée Paris Royale — Brunch",
    day: "Sonntag",
    datetime: "So 3. Mai · 12:00 · 2 Personen",
    refs: [
      { label: "Reservation", value: "TheFork" },
    ],
    notes: [
      "16 Rue Royale, 75008",
    ],
  },
};

export const hotel = {
  name: "Maison Souquet, Hotel & Spa",
  address: "10 Rue de Bruxelles, 75009 Paris",
  phone: "+33 1 48 78 55 55",
  website: "https://www.maisonsouquet.com",
  googleMapsUrl: "https://maps.google.com/?q=10+Rue+de+Bruxelles+75009+Paris",
  checkIn: "Fr 14:00",
  checkOut: "So 12:00",
  bookingRef: "0fVJusWbA",
  coordinates: { lat: 48.8812, lng: 2.3326 },
  spa: {
    name: "Salon d'Eau",
    time: "Fr 16:00–17:00",
    description: "Pool + Hammam privat · 1h",
    included: true,
  },
};

export const budgetPaid: BudgetItem[] = [
  { label: "Maison Souquet (2 Nächte)", amount: 666, icon: "hotel" },
  { label: "Moulin Rouge (2× Show + Champagne)", amount: 270, icon: "star" },
  { label: "Tour Eiffel (2× + Champagne)", amount: 89, icon: "landmark" },
];

export const budgetOnSite: BudgetItem[] = [
  { label: "Uber total (Fr–So)", amount: 165, icon: "car" },
  { label: "Frühstücke (Fr Café + Sa/So Room Service)", amount: 150, icon: "coffee" },
  { label: "Les Vins de Montmartre Apéro", amount: 80, icon: "wine" },
  { label: "Rencontre Dinner Fr.", amount: 150, icon: "utensils" },
  { label: "Extra Drinks Moulin Rouge", amount: 60, icon: "champagne" },
  { label: "Fouquet's Sa.", amount: 60, icon: "coffee" },
  { label: "Arc de Triomphe (2×)", amount: 44, icon: "landmark" },
  { label: "Buddha Bar Dinner + Drinks Sa.", amount: 300, icon: "music" },
  { label: "Berthillon So.", amount: 15, icon: "iceCream" },
  { label: "Ladurée Royale Brunch So.", amount: 160, icon: "utensils" },
];

export const totalPaid = budgetPaid.reduce((s, i) => s + i.amount, 0);
export const totalOnSite = budgetOnSite.reduce((s, i) => s + i.amount, 0);
export const totalBudget = totalPaid + totalOnSite;

export function getLocation(id: string): Location | undefined {
  return locations.find((l) => l.id === id);
}
