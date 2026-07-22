import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blackout RP | Wenn die Lichter ausgehen",
  description: "Deutscher FiveM Apocalypse Roleplay Server. Überlebe den Zusammenbruch, schließe dich einer Fraktion an und gestalte die neue Welt.",
  icons: {
    icon: "/media/brand-mark.webp"
  },
  openGraph: {
    title: "Blackout RP | Apocalypse Roleplay",
    description: "Überleben. Kämpfen. Gestalten.",
    images: ["/media/hero-blackout.webp"]
  }
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
