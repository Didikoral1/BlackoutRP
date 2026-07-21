export const dynamic = "force-dynamic";

export async function GET() {
  const botApiUrl = process.env.BOT_API_URL;

  if (!botApiUrl) {
    return Response.json({
      online: false,
      clients: 0,
      maxClients: 0,
      hostname: "Blackout RP"
    });
  }

  try {
    const response = await fetch(
      `${botApiUrl.replace(/\/$/, "")}/status`,
      {
        cache: "no-store",
        signal: AbortSignal.timeout(7000)
      }
    );

    if (!response.ok) {
      throw new Error(`Bot-API antwortet mit ${response.status}`);
    }

    const data = await response.json();

    return Response.json(data, {
      headers: {
        "Cache-Control": "public, max-age=20"
      }
    });
  } catch (error) {
    console.error("Status-API-Fehler:", error);

    return Response.json({
      online: false,
      clients: 0,
      maxClients: 0,
      hostname: "Blackout RP"
    });
  }
}
