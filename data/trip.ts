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
  category: "hotel" | "restaurant" | "landmark" | "bar" | "cafe" | "entertainment" | "shopping" | "transport";
  photoSpot?: boolean;
  instagramUrl?: string;
  photoTip?: string;
  photoGallery?: string[];
  hidden?: boolean;
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
  transport: "walk" | "uber" | "metro" | "none";
  transportDuration?: string;
  cost: number | null;
  costNote?: string;
  costPaid?: boolean;
  highlight: boolean;
  ticketRef?: string;
  icon: string;
  note?: string;
  funFact?: string;
}

export interface TripDay {
  date: string;
  label: string;
  subtitle: string;
  events: TripEvent[];
  totalCost: number;
}

/** Optionale Flug-Strecke für IATA-Darstellung im Budget (z. B. ZRH → CDG). */
export type BudgetFlightRoute = {
  origin: { iata: string; city: string };
  destination: { iata: string; city: string };
  /** z. B. Airline oder Buchungskanal */
  vendor: string;
};

export interface BudgetItem {
  label: string;
  amount: number;
  icon: string;
  flightRoute?: BudgetFlightRoute;
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
    photoGallery: ["/images/spots/sacre-coeur-1.jpg", "/images/spots/sacre-coeur-2.jpg", "/images/spots/sacre-coeur-3.jpg"],
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
    id: "bir-hakeim",
    name: "Bir-Hakeim",
    address: "Pont de Bir-Hakeim, 75015 Paris",
    coordinates: { lat: 48.8539, lng: 2.2893 },
    googleMapsUrl: "https://maps.google.com/?q=Bir-Hakeim+Metro+Paris",
    category: "transport",
    hidden: true,
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
    photoGallery: ["/images/spots/tour-eiffel-1.jpg", "/images/spots/tour-eiffel-2.jpg", "/images/spots/tour-eiffel-3.jpg"],
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
    photoGallery: ["/images/spots/trocadero-1.jpg", "/images/spots/trocadero-2.jpg", "/images/spots/trocadero-3.jpg"],
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
    photoGallery: ["/images/spots/arc-de-triomphe-1.jpg", "/images/spots/arc-de-triomphe-2.jpg", "/images/spots/arc-de-triomphe-3.jpg"],
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
    photoGallery: ["/images/spots/notre-dame-1.jpg", "/images/spots/notre-dame-2.jpg", "/images/spots/notre-dame-3.jpg"],
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
    photoGallery: ["/images/spots/pont-des-arts-1.jpg", "/images/spots/pont-des-arts-2.jpg", "/images/spots/pont-des-arts-3.jpg"],
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
    photoGallery: ["/images/spots/louvre-1.jpg", "/images/spots/louvre-2.jpg", "/images/spots/louvre-3.jpg"],
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
    photoGallery: ["/images/spots/quais-de-seine-1.jpg", "/images/spots/quais-de-seine-2.jpg", "/images/spots/quais-de-seine-3.jpg"],
  },
];

export const days: TripDay[] = [
  {
    date: "2026-05-01",
    label: "Vendredi",
    subtitle: "L'Arrivée — Montmartre, Magie & Moulin Rouge",
    totalCost: 550,
    events: [
      {
        time: "~10:30",
        title: "Check-in Maison Souquet",
        description: "5-Sterne-Boutique-Hotel im Herzen von Montmartre · Belle-Époque-Stil",
        locationId: "maison-souquet",
        transport: "none",
        cost: 30,
        costNote: "Kaffee + Croissant",
        highlight: false,
        icon: "hotel",
        funFact: "Das Haus war im 19. Jh. ein geheimes Maison de plaisir — die Zimmer tragen noch heute die Namen berühmter Kurtisanen. Diskretion inklusive.",
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
        funFact: "Der Pool ist absichtlich kompakt gehalten — eher Therme als Schwimmbad. Das Hammam-Ritual stammt aus der osmanischen Badekultur, die Paris im 19. Jh. importierte.",
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
        funFact: "«Petits bonheurs» — kleine Glücksmomente. Die Cocktailkarte ist nach Pariser Kurtisanen benannt, passend zum Haus. Tipp: den Signature Cocktail bestellen.",
      },
      {
        time: "19:15",
        endTime: "~20:30",
        title: "Dinner — Rencontre",
        description: "Intimes Bistro-Erlebnis · Saisonale französische Küche · Tipp: Dégustation-Menü",
        locationId: "rencontre",
        transport: "walk",
        transportDuration: "5 Min",
        cost: 150,
        costNote: "Dinner + Wein für 2",
        costPaid: false,
        highlight: true,
        icon: "utensils",
        ticketRef: "rencontre",
        funFact: "«Rencontre» — Begegnung. Nur 20 Plätze, offene Küche. Der Chef kocht saisonal und wechselt die Karte wöchentlich. Reservierung war Pflicht.",
      },
      {
        time: "~21:00",
        title: "Sacré-Cœur — Blaue Stunde",
        description: "Sunset 21:07 · Blick über ganz Paris von den Stufen · Die magische Stunde",
        locationId: "sacre-coeur",
        transport: "walk",
        transportDuration: "28 Min",
        cost: null,
        highlight: true,
        icon: "sunset",
        funFact: "Der Travertin-Kalkstein der Kuppel sondert bei Regen Calcit ab und reinigt sich selbst — Sacré-Cœur wird mit den Jahren buchstäblich weisser. Bestes Licht: kurz vor Sonnenuntergang.",
      },
      {
        time: "~21:45",
        title: "Hotel — Frisch machen",
        description: "Petit robe noire & High Heels. Anzug. Black-Tie-Vibes. Moulin Rouge: chic. 👠🤵✨",
        locationId: "maison-souquet",
        transport: "walk",
        transportDuration: "17 Min",
        cost: null,
        highlight: false,
        icon: "sparkles",
        funFact: "Dresscode Moulin Rouge: Smart Elegant. Kein striktes Black Tie, aber Paris belohnt Effort. Das Hotel hat einen Dampfbügel-Service auf Anfrage.",
      },
      {
        time: "22:45",
        endTime: "~01:15",
        title: "Moulin Rouge — Féerie Show",
        description: "Legendäres Cabaret seit 1889 · 80 Artisten, 1000 Kostüme, pure Magie",
        locationId: "moulin-rouge",
        transport: "walk",
        transportDuration: "2 Min",
        cost: 330,
        costNote: "bereits bezahlt (270€ Tickets + ~60€ Drinks)",
        costPaid: true,
        highlight: true,
        icon: "star",
        ticketRef: "moulin-rouge",
        funFact: "80 Artisten, 1000 handgefertigte Kostüme pro Saison. Die Féerie-Show läuft seit 1999 ohne Unterbrechung — längstes laufendes Programm in der Geschichte des Hauses.",
      },
    ],
  },
  {
    date: "2026-05-02",
    label: "Samedi",
    subtitle: "La Grande Journée — Tour Eiffel, Champs-Élysées & Buddha Bar",
    totalCost: 610,
    events: [
      {
        time: "~09:30",
        title: "Frühstück im Hotel",
        description: "Croissants, Confiture, Café au Lait — gemütlich im Bett",
        locationId: "maison-souquet",
        transport: "none",
        cost: 60,
        costNote: "Room Service für 2",
        highlight: false,
        icon: "coffee",
        funFact: "Ein echtes Croissant au beurre hat exakt 27 Schichten. Die besten Boulangeries backen ab 4 Uhr morgens — Room Service liefert sie direkt ans Bett.",
      },
      {
        time: "~13:15",
        title: "Métro → Bir-Hakeim + Walk",
        description: "Ⓜ️ Blanche ➝ Linie 2 (8 Stops) ➝ Étoile umsteigen ➝ Linie 6 (5 Stops) ➝ Bir-Hakeim · Linie 6 fährt oberirdisch über die Seine!",
        locationId: "eiffelturm",
        transport: "metro",
        transportDuration: "~25 Min",
        cost: 5,
        costNote: "2× Métro-Ticket à 2.55€",
        highlight: false,
        icon: "train",
        funFact: "Linie 6 fährt oberirdisch über die Pont de Bir-Hakeim — die Brücke aus «Inception». Fensterplatz rechts sichern für den Blick auf den Eiffelturm über der Seine.",
      },
      {
        time: "14:00",
        endTime: "15:30",
        title: "Tour Eiffel — 2nd Floor + Champagne",
        description: "Auffahrt 2. Etage mit Champagner-Stopp",
        locationId: "eiffelturm",
        transport: "none",
        cost: 89,
        costNote: "bereits bezahlt",
        costPaid: true,
        highlight: true,
        icon: "landmark",
        ticketRef: "eiffelturm",
        funFact: "Gustave Eiffel hatte eine private Wohnung auf 300m Höhe — er empfing dort Thomas Edison. Die Champagner-Bar auf dem 2. Stock existiert seit 2014 und serviert Moët rosé.",
      },
      {
        time: "~15:45",
        title: "Trocadéro — Fotostop",
        description: "DAS Eiffelturm-Foto · Jardins du Trocadéro · Fontänen-Panorama",
        locationId: "trocadero",
        transport: "walk",
        transportDuration: "13 Min",
        cost: null,
        highlight: true,
        icon: "camera",
        funFact: "Der Trocadéro wurde 1937 für die Weltausstellung gebaut. Die Fontänen springen synchron — bester Fotospot ist zwischen den beiden Wasserbecken, tief kniend.",
      },
      {
        time: "~16:15",
        title: "Café Fouquet's",
        description: "Legendäre Brasserie seit 1899 · Terrasse an den Champs-Élysées · Espresso & Champagner",
        locationId: "fouquets",
        transport: "walk",
        transportDuration: "21 Min",
        cost: 60,
        highlight: false,
        icon: "coffee",
        funFact: "Fouquet's ist seit 1899 der inoffizielle Salon der Pariser Macht-Elite — jeder Präsident feiert hier seine Wahlnacht. Terrasse Champs-Élysées-seitig reserviert.",
      },
      {
        time: "~17:00",
        title: "Arc de Triomphe",
        description: "284 Stufen nach oben · 360° Panorama über Paris · Walk-in ohne Reservation",
        locationId: "arc-de-triomphe",
        transport: "walk",
        transportDuration: "13 Min",
        cost: 44,
        costNote: "2× 22€",
        highlight: true,
        icon: "landmark",
        funFact: "12 Avenuen treffen sich sternförmig am Place de l'Étoile. Napoleon gab den Bau 1806 in Auftrag, erlebte die Fertigstellung aber nie. 284 Stufen bis zur Terrasse, Aufzug gibt es keinen.",
      },
      {
        time: "~18:00",
        title: "Uber → Maison Souquet",
        description: "Zurück nach Montmartre — Füsse hochlegen",
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
        description: "Champagner aus der Minibar, Pariser Dächer im Abendlicht, ruhiger Ausklang.",
        locationId: "maison-souquet",
        transport: "none",
        cost: null,
        highlight: false,
        icon: "heart",
        funFact: "Der Blick über die Pariser Zinndächer ist seit 2024 UNESCO-geschützt. Vom Hoteldach sieht man bei klarem Himmel bis zum Sacré-Cœur — Champagner dazu liegt bereit.",
      },
      {
        time: "~21:15",
        title: "Uber → Buddha Bar",
        description: "Place de la Concorde · Schick angezogen!",
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
        description: "Asiatisch-französische Fusion-Küche · Riesige Buddha-Statue · DJ ab 22h",
        locationId: "buddha-bar",
        transport: "none",
        cost: 300,
        costNote: "Dinner + Drinks + DJ",
        highlight: true,
        icon: "music",
        ticketRef: "buddha-bar",
        funFact: "Die 4-Meter-Buddha-Statue stammt aus dem Original-Restaurant von 1996. Küche: Pan-asiatisch mit französischem Twist. Nach 22 Uhr verwandelt sich der Saal in einen Club.",
      },
    ],
  },
  {
    date: "2026-05-03",
    label: "Dimanche",
    subtitle: "Le Dernier Jour — Ladurée, Notre-Dame & Au Revoir",
    totalCost: 335,
    events: [
      {
        time: "~09:00",
        title: "Frühstück im Zimmer",
        description: "Letztes Frühstück im Bett — Viennoiseries, frisch gepresster OJ, Café",
        locationId: "maison-souquet",
        transport: "none",
        cost: 60,
        costNote: "Room Service für 2",
        highlight: false,
        icon: "coffee",
        funFact: "«Viennoiseries» — wörtlich: Wiener Gebäck. Der österreichische Offizier August Zang brachte das Kipferl 1838 nach Paris. Seitdem behaupten die Franzosen, sie hätten es erfunden.",
      },
      {
        time: "~10:30",
        title: "Check-out & Koffer deponieren",
        description: "Koffer an der Rezeption lassen · Abholung am Nachmittag",
        locationId: "maison-souquet",
        transport: "none",
        cost: null,
        highlight: false,
        icon: "luggage",
        funFact: "Koffer an der Rezeption lassen, nicht im Zimmer. Montmartre-Tipp für den letzten Spaziergang: Rue Lepic → Place du Tertre → Sacré-Cœur. 10 Minuten zu Fuss.",
      },
      {
        time: "~11:15",
        title: "Uber → Ladurée",
        description: "Rue Royale, direkt bei der Place de la Madeleine",
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
        description: "Legendäres Macaron-Haus seit 1862 · Eggs Benedict, Champagner, Patisserie",
        locationId: "laduree",
        transport: "none",
        cost: 160,
        costNote: "Brunch + Drinks für 2",
        highlight: true,
        icon: "utensils",
        ticketRef: "laduree",
        funFact: "Ladurée erfand 1862 den Doppel-Macaron: zwei Mandel-Meringue-Hälften mit Ganache. Die Filiale Rue Royale ist das Original. Empfehlung: Ispahan (Rose-Litschi-Himbeere) von Pierre Hermé nebenan als Vergleich.",
      },
      {
        time: "~13:45",
        title: "Uber → Berthillon",
        description: "Auf die Île Saint-Louis im Herzen von Paris",
        locationId: "berthillon",
        transport: "uber",
        cost: 10,
        highlight: false,
        icon: "car",
      },
      {
        time: "~14:00",
        title: "Berthillon — Eis",
        description: "Pariser Glacé-Institution seit 1954 · Tipp: Caramel au beurre salé & Framboise",
        locationId: "berthillon",
        transport: "none",
        cost: 15,
        highlight: false,
        icon: "iceCream",
        funFact: "Berthillon schliesst jeden Sommer 3 Wochen freiwillig — mitten in der Hochsaison. Seit 1954 so. Empfehlung: Caramel au beurre salé + Framboise. Auf der Brücke zur Île essen, nicht im Laden.",
      },
      {
        time: "~14:20",
        title: "Notre-Dame",
        description: "Wiedereröffnet nach 5 Jahren Restaurierung · Gotische Meisterwerk-Fassade",
        locationId: "notre-dame",
        transport: "walk",
        transportDuration: "~18 Min",
        cost: null,
        highlight: true,
        icon: "landmark",
        funFact: "Die 200'000 Bienen auf dem Dach überlebten den Brand 2019. Der neue Spire ist mit Blattgold überzogen und 6 Meter höher als Viollet-le-Ducs Original von 1859.",
      },
      {
        time: "~14:50",
        title: "Quais de Seine — Spaziergang",
        description: "UNESCO-Welterbe · Bouquinistes, Hausboote & Blick auf die Brücken",
        locationId: "quais-de-seine",
        transport: "walk",
        transportDuration: "~22 Min",
        cost: null,
        highlight: false,
        icon: "camera",
        funFact: "Die grünen Bouquinisten-Kästen entlang der Seine stammen aus dem 16. Jh. — ältestes Open-Air-Buchgeschäft der Welt, seit 1991 UNESCO-geschützt. Vintage-Poster ab 5 € als Souvenir.",
      },
      {
        time: "~15:15",
        title: "Pont des Arts",
        description: "Die berühmte Liebesbrücke · Blick auf Île de la Cité & Institut de France",
        locationId: "pont-des-arts",
        transport: "walk",
        transportDuration: "~13 Min",
        cost: null,
        highlight: true,
        icon: "heart",
        funFact: "2015 brach das Geländer unter dem Gewicht von 1 Mio. Liebesschlössern. Heute sind Glasplatten montiert. Der Blick auf Île de la Cité und das Institut de France bleibt der schönste der Stadt.",
      },
      {
        time: "~15:30",
        title: "Louvre Pyramide — Fotostop",
        description: "I.M. Peis ikonische Glaspyramide · Cour Napoléon · DAS Paris-Foto",
        locationId: "louvre",
        transport: "walk",
        transportDuration: "~28 Min",
        cost: null,
        highlight: true,
        icon: "camera",
        funFact: "I.M. Peis Pyramide: 673 Glasscheiben, nicht 666 wie die Legende behauptet. Bestes Foto: kniend am Wasserbecken, Spiegelung einfangen. Morgens vor 10 Uhr fast menschenleer.",
      },
      {
        time: "~16:00",
        title: "Uber → Hotel (Koffer holen)",
        description: "Koffer abholen · Ein letztes Mal durch Montmartre schauen",
        locationId: "maison-souquet",
        transport: "uber",
        cost: 15,
        highlight: false,
        icon: "car",
      },
      {
        time: "~16:30",
        title: "Uber → CDG",
        description: "~45 Min Fahrt · Au revoir, Paris! À bientôt 💛",
        locationId: null,
        transport: "uber",
        cost: 60,
        highlight: false,
        icon: "plane",
        funFact: "CDG Terminal 2 hat Post-Security eine Ladurée-Filiale und eine Champagner-Bar. Letzter Paris-Moment vor dem Boarding.",
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
      { label: "Person 1", value: "6023453" },
      { label: "Person 2", value: "6023454" },
    ],
    notes: [
      "Einlass ab 22:45 · Show beginnt 23:30",
      "Reihe R 554",
      "15–20 Min früher da sein!",
      "Champagner im Preis inbegriffen",
    ],
    cancellation: "Non-refundable",
  },
  "eiffelturm": {
    title: "Tour Eiffel — 2nd Floor + Champagne",
    day: "Samstag",
    datetime: "Sa 2. Mai · 14:00–15:30",
    refs: [
      { label: "Person 1", value: "341262010064829591" },
      { label: "Person 2", value: "341262010064829647" },
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
  { label: "Maison Souquet (2 Nächte)", amount: 890, icon: "hotel" },
  { label: "Moulin Rouge (2× Show + Champagne)", amount: 270, icon: "star" },
  { label: "Tour Eiffel (2× + Champagne)", amount: 89, icon: "landmark" },
  {
    label: "Flug BER → CDG (Air France)",
    amount: 539,
    icon: "plane",
    flightRoute: {
      origin: { iata: "BER", city: "Berlin" },
      destination: { iata: "CDG", city: "Paris" },
      vendor: "Air France",
    },
  },
  {
    label: "Flug ZRH → CDG (Booking.com)",
    amount: 575,
    icon: "plane",
    flightRoute: {
      origin: { iata: "ZRH", city: "Zürich" },
      destination: { iata: "CDG", city: "Paris" },
      vendor: "Booking.com",
    },
  },
];

export const budgetOnSite: BudgetItem[] = [
  // Freitag
  { label: "Rencontre Dinner Fr.", amount: 150, icon: "utensils" },
  { label: "Extra Drinks Moulin Rouge", amount: 60, icon: "champagne" },
  // Samstag
  { label: "Fouquet's Sa.", amount: 60, icon: "coffee" },
  { label: "Arc de Triomphe (2×)", amount: 44, icon: "landmark" },
  { label: "Buddha Bar Dinner + Drinks Sa.", amount: 300, icon: "music" },
  // Sonntag
  { label: "Ladurée Royale Brunch So.", amount: 160, icon: "utensils" },
  { label: "Berthillon So.", amount: 15, icon: "iceCream" },
  // Übergreifend
  { label: "Uber & Métro total (Fr–So)", amount: 155, icon: "car" },
  { label: "Frühstücke (Fr Café + Sa/So Room Service)", amount: 150, icon: "coffee" },
];

export const totalPaid = budgetPaid.reduce((s, i) => s + i.amount, 0);
export const totalOnSite = budgetOnSite.reduce((s, i) => s + i.amount, 0);
export const totalBudget = totalPaid + totalOnSite;

export function getLocation(id: string): Location | undefined {
  return locations.find((l) => l.id === id);
}

/** Tab-Index für kombinierte Ansicht: alle besuchten POIs auf einer Karte */
export const ALL_DAY_INDEX = 3 as const;

/**
 * Chronologische Kette aller besuchten POIs über alle Trip-Tage (ohne `hidden`).
 * Aufeinanderfolgende Events am gleichen Ort werden wie pro Tag zusammengefasst.
 */
export function getChronologicalRouteAllDays(): Location[] {
  const route: Location[] = [];
  let prevId: string | null = null;
  for (let d = 0; d < days.length; d++) {
    for (const event of days[d].events) {
      if (!event.locationId) continue;
      const loc = getLocation(event.locationId);
      if (!loc || loc.hidden) continue;
      if (event.locationId === prevId) continue;
      route.push(loc);
      prevId = event.locationId;
    }
  }
  return route;
}

/** Jeder besuchte POI nur einmal, Reihenfolge = erster Auftritt im Trip (für ALL-Ansicht). */
export function getUniqueVisitedPoisInOrder(): Location[] {
  const seen = new Set<string>();
  const out: Location[] = [];
  for (const loc of getChronologicalRouteAllDays()) {
    if (seen.has(loc.id)) continue;
    seen.add(loc.id);
    out.push(loc);
  }
  return out;
}
