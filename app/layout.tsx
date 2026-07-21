import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blackout RP | Apocalypse Roleplay",
  description: "Deutscher FiveM Apocalypse Roleplay Server",
  icons: {
    icon: "/blackout-logo.png"
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
