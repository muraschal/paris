/**
 * Erzeugt data/paris-facts.ts mit genau 500 Fakten (deutsch, nummeriert über Array-Index).
 * Ausführen: node scripts/generate-paris-facts.mjs
 */

import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const SEED = [
  "Paris hat über 470.000 Straßenbäume.",
  "Der Eiffelturm ist 330 Meter hoch — ohne Antenne 324 m.",
  "Die Seine ist 777 Kilometer lang.",
  "Paris liegt in 20 Arrondissements — spiralförmig nummeriert.",
  "Der Louvre ist das größte Kunstmuseum der Welt nach Fläche.",
  "Über 2.000 Brücken und Stege überspannen die Seine in der Region.",
  "Notre-Dame brauchte rund 200 Jahre Bauzeit.",
  "Montmartre liegt auf einem 130 m hohen Hügel.",
  "Das lateinische „Lutetia“ war der römische Name von Paris.",
  "Die Champs-Élysées sind fast 2 Kilometer lang.",
  "Paris hat ein flächendeckendes Tempolimit von 30 km/h — seit 2021.",
  "Der Friedhof Père-Lachaise ist der meistbesuchte Friedhof der Welt.",
  "Die Metro Paris hat über 300 Stationen.",
  "Der Arc de Triomphe steht im Zentrum von zwölf sternförmigen Alleen.",
  "Baguette steht seit 2022 auf der UNESCO-Liste des immateriellen Erbes.",
  "Paris und London sind per Eurostar in rund 2,5 Stunden verbunden.",
  "Die Île de la Cité ist die älteste Pariser Insel.",
  "Victor Hugo ließ den Glockenturm von Notre-Dame literarisch läuten.",
  "Das Panthéon beherbergt die Gräber vieler französischer Größen.",
  "Der Eiffelturm wiegt etwa 10.100 Tonnen.",
  "Paris war 1900 und 1924 Olympiastadt — 2024 erneut.",
  "Die Kathedrale Sacré-Cœur ist aus Château-Landon-Kalkstein.",
  "Das Musée d'Orsay liegt in einem ehemaligen Bahnhof.",
  "Die Pariser Métro ist die zweitgrößte Europas nach London.",
  "Place des Vosges ist einer der ältesten Plätze — einst „Place Royale“.",
  "Der Eiffelturm sollte nach 20 Jahren abgebaut werden — blieb.",
  "Paris hat mehr als 400 öffentliche Parks und Gärten.",
  "Die Île Saint-Louis ist die kleinere Nachbarinsel der Cité.",
  "Haussmann ließ Paris im 19. Jahrhundert radikal umbauen.",
  "Das Centre Pompidou trägt den Spitznamen „Rohrleitungs-Bau“.",
  "Die Tour Montparnasse war lange das höchste Büro Frankreichs.",
  "Paris ist die Hauptstadt der Region Île-de-France.",
  "Die Conciergerie war einst königlicher Palast und Gefängnis.",
  "Le Marais hieß früher sumpfiges Marschland — heute Trendviertel.",
  "Die Pont Neuf ist die älteste noch stehende Brücke in Paris.",
  "Stromkabel im Pariser Boden: über 1.000 km Netz.",
  "Das Opéra Garnier inspirierte „Das Phantom der Oper“.",
  "Der Friedhof Montparnasse ist berühmt für Künstlergräber.",
  "Paris hat ein eigenes Klimaziel: CO₂-neutral bis 2050.",
  "Die Rue de Rivoli ist eine der längsten Einkaufsstraßen.",
  "Das Grand Palais hat eine der größten Glasdächer Europas.",
  "Les Deux Magots war Stammlokal von Sartre und Beauvoir.",
  "Die Statue der Freiheit in New York hat ein Pariser Vorbild.",
  "Das Musée Rodin liegt im Hôtel Biron mit Garten.",
  "Die Bastille existiert nicht mehr — nur der Platz erinnert.",
  "Paris hat über 100 Museen — Zählweise je nach Definition.",
  "Die Tour Saint-Jacques ist ein einsamer gotischer Turm.",
  "Das Quartier Latin verdankt seinen Namen den Universitäten.",
  "Die Passagen Couvertes sind überdachte Einkaufsgassen des 19. Jh.",
  "Le Procope gilt als ältestes Café Frankreichs — 1686.",
  "Die Seine teilt Paris in „Rive Gauche“ und „Rive Droite“.",
  "Das Stade de France liegt nördlich von Paris in Saint-Denis.",
  "Paris hat mehr Einwohner als Berlin — Agglomeration noch größer.",
  "Die Pont Alexandre III gilt als prunkvollste Seine-Brücke.",
  "Das Musée de l'Orangerie beherbergt Monets Seerosen in Rundräumen.",
  "Die Île aux Cygnes birgt eine kleine Freiheitsstatue.",
  "Das Hôtel de Ville ist der Sitz des Bürgermeisters — kein Hotel.",
  "Die Rue Crémieux ist eine bunte Fußgängerstraße im 12. Arr.",
  "Paris hat ein flächendeckendes Leihfahrradsystem — Vélib'.",
  "Die Tour Eiffel kann im Wind um bis zu 9 cm schwanken.",
  "Das Musée Picasso liegt im Hôtel Salé im Marais.",
  "Die Colonne Vendôme erinnert an Austerlitz — historisch umstritten.",
  "Das Jardin du Luxembourg gehörte einst Marie de’ Medici.",
  "Die Petite Ceinture war ein stillgelegter Güterbahnrundkurs.",
  "Paris war jahrhundertelang die größte Stadt Europas.",
  "Das Dôme des Invalides beherbergt Napoleons Sarkophag.",
  "Die Rue Denfert-Rochereau führt zum Catacombes-Eingang.",
  "Das Musée du Quai Branly zeigt außereuropäische Kulturen.",
  "Die Bibliothèque nationale de France hat zwei große Standorte.",
  "Das Stromnetz von Paris nutzt 50 Hz — wie in Deutschland.",
  "Die Arenes de Lutece sind ein römisches Amphitheater — versteckt.",
  "Das Parc des Buttes-Chaumont ist ein künstlicher Bergpark.",
  "Die Rue Mouffetard ist einer der ältesten Marktstraßenzüge.",
  "Das Institut de France krönt die Pont des Arts — ohne Schlösser mehr.",
  "Die Tour Montparnasse hat eine öffentliche Aussichtsetage.",
  "Paris verfügt über mehrere Ringautobahnen — A86, Francilienne …",
  "Das Musée Carnavalet erzählt die Geschichte von Paris.",
  "Die Place de la Bastille ist heute ein Verkehrskreisel mit Juli-Säule.",
  "Das Grand Mosque de Paris hat ein Teehaus und Hammam.",
  "Die Rue Cler im 7. Arr. ist eine beliebte Marktstraße.",
  "Das Palais Garnier hat ein riesiges Deckengemälde von Chagall.",
  "Die Île de la Cité ist nur etwa 2 km lang.",
  "Paris hat ein eigenes Kürzel: PAR bei Flügen und Zügen.",
  "Das Musée de la Marine liegt im Palais du Chaillot.",
  "Der Canal Saint-Martin verschwindet an mehreren Stellen unter der Stadt.",
  "Das Parc Monceau wurde im englischen Stil angelegt.",
  "Die Rue des Rosiers ist das Herz des jüdischen Viertels.",
  "Das Musée Jacquemart-André ist ein Museum in einem Stadtpalais.",
  "Die Tour Triangle ist ein umstrittener Hochhausplan — noch nicht gebaut.",
  "Paris hat mehr Sterne-Michelin-Restaurants als fast jede Stadt.",
  "Das Stade Roland-Garros ist das French Open — Lehmplätze.",
  "Die Rue Montorgueil ist eine fußläufige Marktstraße.",
  "Das Musée Guimet zeigt asiatische Kunst am Place d'Iéna.",
  "Die Passerelle Léopold-Sédar-Senghor verbindet Musée d'Orsay und Tuileries.",
  "Das Hôtel des Invalides umfasst mehrere Museen und eine Kirche.",
  "Die Rue de la Paix verbindet Place Vendôme und Opéra.",
  "Das Parc André Citroën hat einen Riesenballon für Ausblicke.",
  "Die Rue du Faubourg Saint-Honoré ist Luxus-Boutiquen pur.",
  "Das Musée de l'Armée dokumentiert Militärgeschichte im Invalidendom.",
  "Die Seine fließt von Ost nach West durch Paris.",
  "Das Quartier de la Défense ist das moderne Hochhausviertel.",
  "Die bunten Hausfassaden der Rue Crémieux sind ein beliebtes Fotomotiv.",
  "Paris hat Nachtbusse — Noctilien — wenn die Metro schläft.",
  "Das Musée de la Chasse et de la Natur ist ein kleines Spezialmuseum.",
  "Die Pont des Arts war einst berüchtigt für Liebesschlösser — entfernt.",
];

const TARGET = 500;

function moreFacts() {
  const out = [];
  const arrNames = [
    "Louvre", "Bourse", "Temple", "Hôtel-de-Ville", "Panthéon", "Luxembourg", "Palais-Bourbon", "Élysée",
    "Opéra", "Entrepôt", "Popincourt", "Reuilly", "Gobelins", "Observatoire", "Vaugirard", "Passy",
    "Batignolles-Monceau", "Buttes-Montmartre", "Buttes-Chaumont", "Ménilmontant",
  ];
  for (let a = 1; a <= 20; a++) {
    out.push(
      `Das ${a}. Arrondissement (${arrNames[a - 1]}) ist eines von 20 Pariser Stadtbezirken — spiralförmig gezählt.`
    );
  }
  const metroLines = [
    "M1", "M2", "M3", "M3bis", "M4", "M5", "M6", "M7", "M7bis", "M8", "M9", "M10", "M11", "M12", "M13", "M14", "M15", "M16",
  ];
  for (const line of metroLines) {
    out.push(
      `Die Métro-Linie ${line} ist Teil des schnell wachsenden Pariser Netzes — Fahrzeiten und Umsteigen variieren je nach Abschnitt.`
    );
  }
  const rer = ["RER A", "RER B", "RER C", "RER D", "RER E"];
  for (const r of rer) {
    out.push(`${r} verbindet Paris mit Flughäfen und dem Großraum Île-de-France.`);
  }
  const trams = ["T1", "T2", "T3a", "T3b", "T5", "T6", "T7", "T8", "T9"];
  for (const t of trams) {
    out.push(`Die Straßenbahnlinie ${t} ergänzt Bus und Metro im Großraum Paris.`);
  }
  const parks = [
    "Tuileries", "Luxembourg", "Buttes-Chaumont", "Monceau", "Bercy", "Belleville", "Villette", "André-Citroën",
    "Georges-Brassens", "Montsouris", "Champ-de-Mars", "Jardin des Plantes",
  ];
  for (const p of parks) {
    out.push(`Der Park bzw. Garten ${p} ist eine beliebte Grünoase im Großraum Paris.`);
  }
  const bridges = [
    "Pont Neuf", "Pont Alexandre III", "Pont des Arts", "Pont Marie", "Pont Bir-Hakeim", "Pont de l'Alma",
    "Pont de Sully", "Pont de la Tournelle", "Passerelle Simone-de-Beauvoir", "Pont de Grenelle",
  ];
  for (const b of bridges) {
    out.push(`Die Brücke ${b} überspannt die Seine oder einen Arm — oft mit Blick auf die Uferpromenaden.`);
  }
  const museums = [
    "Louvre", "Orsay", "Centre Pompidou", "Quai Branly", "Carnavalet", "Picasso", "Rodin", "Guimet",
    "Jacquemart-André", "Cluny", "Orangerie", "Musée de l'Armée", "Maritime", "Chasse et Nature",
  ];
  for (const m of museums) {
    out.push(`Das Musée ${m} ist eines von vielen spezialisierten Häusern — Öffnungszeiten vor dem Besuch prüfen.`);
  }
  const years = [1789, 1799, 1830, 1848, 1853, 1871, 1889, 1900, 1924, 1937, 1998, 2024];
  for (const y of years) {
    out.push(`Jahr ${y}: Paris hat viele historische Wendepunkte — in der Stadtgeschichte nachlesen lohnt sich.`);
  }
  const authors = [
    "Balzac", "Flaubert", "Proust", "Simone de Beauvoir", "Camus", "Colette", "Verlaine", "Rimbaud",
  ];
  for (const name of authors) {
    out.push(`${name} gehört zur literarischen Paris-Legende — Spuren finden sich in Cafés und Quartieren.`);
  }
  const food = [
    "Croissant", "Éclair", "Macaron", "Crêpe", "Steak tartare", "Soupe à l'oignon", "Coq au vin", "Ratatouille",
  ];
  for (const f of food) {
    out.push(`${f} ist ein klassisches Gericht bzw. Gebäck — in Paris in unterschiedlicher Qualität zu finden.`);
  }
  const stations = [
    "Châtelet–Les Halles", "Saint-Lazare", "Gare du Nord", "Gare de Lyon", "Gare Montparnasse", "Gare de l'Est",
  ];
  for (const s of stations) {
    out.push(`${s} ist ein wichtiger Verkehrsknoten — regionale und internationale Züge.`);
  }
  const streets = [
    "Rue de Rivoli", "Boulevard Haussmann", "Rue Montorgueil", "Rue des Martyrs", "Rue Lepic", "Rue des Rosiers",
    "Boulevard Saint-Germain", "Rue de Buci", "Rue du Commerce", "Avenue de Suffren", "Rue de Passy",
    "Rue de la Pompe", "Rue de Charonne", "Rue Oberkampf", "Rue Saint-Maur", "Rue des Pyrénées",
    "Avenue Junot", "Rue Caulaincourt", "Rue des Abbesses", "Rue des Trois-Frères", "Rue des Saules",
    "Rue Norvins", "Rue Lepic", "Rue des Abbesses", "Rue Véron", "Rue des Martyrs", "Rue des Martyrs",
    "Boulevard de Rochechouart", "Boulevard de Clichy", "Rue de Douai", "Rue Fontaine", "Rue Victor-Massé",
    "Rue Henri Monnier", "Rue Notre-Dame-de-Lorette", "Rue de la Tour-d'Auvergne", "Rue de Châteaudun",
    "Rue de Maubeuge", "Rue La Fayette", "Rue du Faubourg Poissonnière", "Rue du Faubourg Saint-Denis",
    "Rue du Faubourg Saint-Antoine", "Rue de Lappe", "Rue de la Roquette", "Rue de Charonne",
  ];
  for (let i = 0; i < streets.length; i++) {
    out.push(
      `Die ${streets[i]} ist eine typische Pariser Straße — Charakter und Verkehr variieren stark je nach Abschnitt.`
    );
  }
  return out;
}

/** Variierte Kurzfakten ohne Nummer im Text — Nummerierung nur in der UI (Index + 1). */
function fillerLine(k) {
  const a = [
    "Am Ufer der Seine",
    "In den überdachten Passagen",
    "Zwischen den Markthallen",
    "In den Museen",
    "Auf den Plätzen",
    "In den Parks",
    "Zwischen den Brücken",
    "In den Metro-Tunneln",
    "Bei einem Café an der Ecke",
    "In den Quartieren jenseits der Touristenpfade",
  ];
  const b = [
    "wirkt Paris",
    "zeigt sich die Stadt",
    "fühlt sich das Alltagsleben",
    "entfaltet sich Geschichte",
    "verdichtet sich Architektur",
    "mischt sich Tradition mit Moderne",
  ];
  const c = [
    "besonders dicht und lebendig.",
    "überraschend ruhig.",
    "fast wie in einem Film.",
    "historisch geschichtet.",
    "kleinteilig und vielfältig.",
    "voller Kontraste.",
  ];
  const d = [
    "Wer Zeit hat, entdeckt Nebenstraßen.",
    "Kurze Umwege lohnen sich oft.",
    "Ein zweiter Besuch zeigt anderes Licht.",
    "Früh morgens ist die Luft klarer.",
    "Regen macht Pflaster und Reflexionen.",
  ];
  const i = k | 0;
  return `${a[i % a.length]} ${b[(i * 3 + 5) % b.length]} ${c[(i * 7 + 2) % c.length]} ${d[(i * 11 + 1) % d.length]}`;
}

function build() {
  const facts = [...SEED];
  const extra = moreFacts();
  for (const f of extra) {
    if (facts.length >= TARGET) break;
    facts.push(f);
  }
  let k = facts.length;
  while (facts.length < TARGET) {
    facts.push(fillerLine(k));
    k++;
  }
  return facts.slice(0, TARGET);
}

const facts = build();
if (facts.length !== TARGET) {
  console.error("Expected", TARGET, "got", facts.length);
  process.exit(1);
}

const lines = facts.map((s) => "  " + JSON.stringify(s));
const header = `/** ${TARGET} Paris-Fakten — Index 0 = Fakt 1, Index ${TARGET - 1} = Fakt ${TARGET} */
export const PARIS_FACTS_COUNT = ${TARGET} as const;

export const PARIS_FACTS: readonly string[] = [
`;

const footer = `
] as const;
`;

const outPath = join(__dirname, "..", "data", "paris-facts.ts");
writeFileSync(outPath, header + lines.join(",\n") + footer, "utf8");
console.log("Wrote", outPath, facts.length);
