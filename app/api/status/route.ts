export const dynamic = "force-dynamic";

export async function GET() {
  const joinCode = process.env.FIVEM_JOIN_CODE || "xllzq5m";

  try {
    const response = await fetch(
      "http://status.mc-server24.de:20018/dynamic.json",
      {
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
        headers: {
          Accept: "application/json",
          "User-Agent": "Blackout-RP-Website/1.0"
        }
      }
    );

    if (!response.ok) {
      throw new Error(
        `FiveM-Server antwortet mit HTTP ${response.status}`
      );
    }

    const data = await response.json();

    return Response.json(
      {
        online: true,
        clients: Number(data.clients || 0),
        maxClients: Number(data.sv_maxclients || 0),
        hostname: String(
          data.hostname || "Blackout RP"
        )
          .replace(/\^[0-9]/g, "")
          .trim(),
        mapname: data.mapname || null,
        gametype: data.gametype || null,
        joinCode,
        joinUrl: `https://cfx.re/join/${joinCode}`,
        updatedAt: new Date().toISOString()
      },
      {
        headers: {
          "Cache-Control": "no-store"
        }
      }
    );
  } catch (error) {
    console.error("FiveM-Statusfehler:", error);

    return Response.json(
      {
        online: false,
        clients: 0,
        maxClients: 0,
        hostname: "Blackout RP",
        joinCode,
        joinUrl: `https://cfx.re/join/${joinCode}`,
        error:
          error instanceof Error
            ? error.message
            : "FiveM-Status nicht erreichbar",
        updatedAt: new Date().toISOString()
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store"
        }
      }
    );
  }
}
