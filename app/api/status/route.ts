export const dynamic = "force-dynamic";

export async function GET() {
  const serverAddress = process.env.FIVEM_SERVER_ADDRESS;
  const joinCode = process.env.FIVEM_JOIN_CODE || "xllzq5m";

  if (!serverAddress) {
    return Response.json({
      online: false,
      clients: 0,
      maxClients: 0,
      hostname: "Blackout RP"
    });
  }

  try {
    const response = await fetch(
      `http://${serverAddress}/dynamic.json`,
      {
        cache: "no-store"
      }
    );

    if (!response.ok) {
      throw new Error(`FiveM antwortet mit Status ${response.status}`);
    }

    const data = await response.json();

    return Response.json(
      {
        online: true,
        clients: Number(data.clients || 0),
        maxClients: Number(data.sv_maxclients || 0),
        hostname: String(data.hostname || "Blackout RP")
          .replace(/\^[0-9]/g, ""),
        joinUrl: `https://cfx.re/join/${joinCode}`
      },
      {
        headers: {
          "Cache-Control": "public, max-age=20"
        }
      }
    );
  } catch (error) {
    console.error("FiveM-Statusfehler:", error);

    return Response.json({
      online: false,
      clients: 0,
      maxClients: 0,
      hostname: "Blackout RP"
    });
  }
}
