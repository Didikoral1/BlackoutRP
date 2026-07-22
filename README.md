# Blackout RP Website

Next.js-Website für den Blackout-RP-FiveM-Server, optimiert für Cloudflare Workers mit OpenNext.

## Seiten

- `/` – Startseite
- `/news` – News und Updates
- `/server` – Live-Serverstatus
- `/fraktionen` – Fraktionen und Dossiers
- `/team` – Discord-Team
- `/regeln` – Serverregelwerk
- `/admin` – Verwaltung von News und Serverregeln

## Cloudflare

Build-Befehl:

```text
npx opennextjs-cloudflare build
```

Deploy-Befehl:

```text
npx opennextjs-cloudflare deploy
```

Das Secret `DISCORD_BOT_TOKEN` muss in den Cloudflare Build Variables and Secrets hinterlegt sein und darf nicht im Repository gespeichert werden.

## Adminbereich

Die PIN-Eingabe ist verdeckt und der PIN wird auf der Website nicht angezeigt. Änderungen an News und Regeln werden erst mit „Änderungen veröffentlichen“ übernommen.

Der aktuelle Editor nutzt den Browserspeicher. Für eine globale Speicherung für alle Besucher ist später eine Cloudflare-KV- oder D1-Anbindung erforderlich.
