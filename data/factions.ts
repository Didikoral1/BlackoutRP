export type Faction = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  mission: string[];
  image: string;
  accent: string;
};

export const factions: Faction[] = [
  {
    id: "atlas",
    name: "Atlas Einheit",
    subtitle: "Ordnung · Schutz · Wiederaufbau",
    description:
      "Die Atlas Einheit ist die letzte strukturierte Sicherheitsmacht. Sie schützt Siedlungen, sichert Versorgungslinien und gewinnt verlorene Gebiete zurück.",
    mission: [
      "Siedlungen und Zivilisten schützen",
      "Raider-Gebiete zurückerobern",
      "Konvois und Ressourcen sichern",
      "Recht und Ordnung wiederherstellen"
    ],
    image: "/media/faction-atlas.webp",
    accent: "#d14a3f"
  },
  {
    id: "raiders",
    name: "Raiders",
    subtitle: "Chaos · Macht · Überleben",
    description:
      "Die Raiders nutzen den Zusammenbruch der alten Welt. Sie sabotieren das Stromnetz, stehlen Fahrzeuge und markieren eroberte Gebiete mit ihrer Fahne.",
    mission: [
      "Gebiete kontrollieren",
      "Versorgungsfahrzeuge erbeuten",
      "Infrastruktur sabotieren",
      "Ressourcen und Waffen sichern"
    ],
    image: "/media/faction-raiders.webp",
    accent: "#b82620"
  },
  {
    id: "ems",
    name: "Emergency Medical Service",
    subtitle: "Retten · Stabilisieren · Versorgen",
    description:
      "Der EMS hält die letzten Überlebenden am Leben. Mobile Einsätze, Notfallversorgung und medizinische Neutralität stehen im Mittelpunkt.",
    mission: [
      "Notrufe annehmen",
      "Verletzte stabilisieren",
      "Sichere Behandlungszonen schaffen",
      "Medizinische Ressourcen verwalten"
    ],
    image: "/media/faction-ems.webp",
    accent: "#58a7c6"
  },
  {
    id: "survivor",
    name: "Survivor",
    subtitle: "Erkunden · Handeln · Aufbauen",
    description:
      "Survivor sind freie Überlebende. Sie looten Ruinen, handeln mit Ressourcen und bauen sich in einer gefährlichen Welt ein neues Leben auf.",
    mission: [
      "Ruinen und Loot-Zonen erkunden",
      "Handel betreiben",
      "Zivile Berufe ausüben",
      "Eigene Gruppen bilden"
    ],
    image: "/media/faction-survivor.webp",
    accent: "#93a35b"
  }
];
