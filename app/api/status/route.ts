export const dynamic = "force-dynamic";

export async function GET() {
  const joinCode = process.env.FIVEM_JOIN_CODE;

  if (!joinCode || joinCode === "DEIN_FIVEM_JOIN_CODE") {
    return Response.json({
      online: false,
      clients: 0,
      maxClients: 0,
      hostname: "Blackout RP"
    });
  }

  try {
    const response = await fetch(
      `https://servers-frontend.fivem.net/api/servers/single/${encodeURIComponent(joinCode)}`,
      {
        cache: "no-store",
        headers: { "User-Agent": "Blackout-RP-Website/1.0" }
      }
    );

    if (!response.ok) throw new Error("FiveM-Server nicht erreichbar");

    const payload = await response.json();
    const data = payload.Data || payload.data || {};

    return Response.json(
      {
        online: true,
        clients: Number(data.clients || 0),
        maxClients: Number(data.sv_maxclients || 0),
        hostname: String(data.hostname || "Blackout RP").replace(/\^[0-9]/g, ""),
        joinUrl: `https://cfx.re/join/${joinCode}`
      },
      { headers: { "Cache-Control": "public, max-age=30" } }
    );
  } catch {
    return Response.json({
      online: false,
      clients: 0,
      maxClients: 0,
      hostname: "Blackout RP"
    });
  }
}
