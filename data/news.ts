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
    title: "Willkommen auf Blackout RP",
    text: "Die neue Website ist online. Hier findest du News, Regeln, Fraktionen, das Serverteam und den Live-Status.",
    image: "/blackout-logo.png",
    featured: true
  },
  {
    date: "19.07.2026",
    title: "Regelwerk überarbeitet",
    text: "Das Serverregelwerk wurde vollständig an das Apokalypse-Konzept und die neuen Spielsysteme angepasst.",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85"
  },
  {
    date: "18.07.2026",
    title: "Gebietseroberungen",
    text: "Atlas und Raiders kämpfen um Gebiete. Schüsse sind während einer Eroberung ausschließlich innerhalb der markierten Zone erlaubt.",
    image: "https://images.unsplash.com/photo-1566566716921-b50e82140547?auto=format&fit=crop&w=1200&q=85"
  }
];
