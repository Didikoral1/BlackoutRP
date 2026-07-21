# Blackout RP V2 Premium

## Neu enthalten

- animierter Ladebildschirm
- Fullscreen-Video mit KI-Artwork-Fallback
- Regen-, Rauch- und Ascheeffekte
- moderne Gaming-Dashboard-Optik
- Live-FiveM-Status über `status.mc-server24.de:20018`
- Discord-Team automatisch mit Avataren
- interaktive Fraktionskarten und Detailfenster
- vollständiges Regelwerk
- mobile Version
- News-Adminseite unter `/admin`

## Hochladen

Ersetze in deinem GitHub-Repository alle bisherigen Projektdateien durch den Inhalt dieser ZIP. Cloudflare baut danach automatisch neu.

Build command:

```text
npx opennextjs-cloudflare build
```

Deploy command:

```text
npx opennextjs-cloudflare deploy
```

## Discord

In Cloudflare muss weiterhin das Secret existieren:

```text
DISCORD_BOT_TOKEN
```

Der Bot-Token darf nicht in GitHub stehen.

## Hintergrundvideo

Lade eine MP4-Datei als:

```text
public/media/background.mp4
```

hoch. Ohne Video wird automatisch das mitgelieferte KI-Artwork angezeigt.

## News Admin

Öffne:

```text
https://DEINE-DOMAIN/admin
```

Standard-PIN:

```text
2407
```

Das Adminsystem speichert News aktuell im Browser des Admins. Für eine globale Datenbank-Version ist später Cloudflare D1 oder KV nötig.
