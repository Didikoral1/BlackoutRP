export type NewsItem = {
  date: string;
  title: string;
  text: string;
  image: string;
  featured?: boolean;
};

export const news: NewsItem[] = [
  {
    date: "21.07.2026",
    title: "Blackout RP öffnet seine Tore",
    text: "Eine neue Welt nach dem Zusammenbruch erwartet dich. Schließe dich einer Fraktion an oder überlebe als freier Survivor.",
    image: "/media/hero-blackout.webp",
    featured: true
  },
  {
    date: "20.07.2026",
    title: "Gebietseroberungen aktiviert",
    text: "Raiders können Gebiete markieren. Die Atlas Einheit kann die Kontrolle durch Entfernen der Fahne zurückgewinnen.",
    image: "/media/faction-raiders.webp"
  },
  {
    date: "19.07.2026",
    title: "Neues Serverregelwerk",
    text: "Alle Regeln wurden an das Apokalypse-Konzept angepasst. Schüsse bei Gebietseroberungen sind nur innerhalb der Zone erlaubt.",
    image: "/media/faction-atlas.webp"
  }
];
