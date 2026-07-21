export const dynamic = "force-dynamic";

export async function GET() {
  const botApiUrl = process.env.BOT_API_URL;

  if (!botApiUrl) {
    return Response.json(
      {
        online: false,
        clients: 0,
        maxClients: 0,
        hostname: "Blackout RP",
        error: "BOT_API_URL fehlt"
      },
      {
        status: 500
      }
    );
  }

  try {
    const response = await fetch(
      `${botApiUrl.replace(/\/$/, "")}/status`,
      {
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
        headers: {
          Accept: "application/json",
          "User-Agent": "BlackoutRP Website"
        }
      }
    );

    if (!response.ok) {
      throw new Error(
        `Bot API antwortet mit HTTP ${response.status}`
      );
    }

    const data = await response.json();

    return Response.json(
      {
        online: Boolean(data.online),
        clients: Number(data.clients || 0),
        maxClients: Number(data.maxClients || 0),
        hostname: data.hostname || "Blackout RP",
        joinCode: data.joinCode || "",
        joinUrl: data.joinUrl || ""
      },
      {
        headers: {
          "Cache-Control": "no-store"
        }
      }
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        online: false,
        clients: 0,
        maxClients: 0,
        hostname: "Blackout RP",
        error:
          error instanceof Error
            ? error.message
            : "Bot API nicht erreichbar"
      },
      {
        status: 500
      }
    );
  }
}
