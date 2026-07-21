/*
  CLOUDFLARE WORKER FÜR DIE DISCORD-TEAMANZEIGE

  Benötigte Secrets/Variablen:
  DISCORD_BOT_TOKEN = dein Bot-Token (als Secret)
  DISCORD_GUILD_ID   = ID deines Discord-Servers
  ALLOWED_ORIGIN     = https://didikoral1.github.io

  Discord-Rollen:
  Projektleitung: 1524899549888385196
  Teamverwaltung: 1525185369036030032
  Support:         1525184472717459608, 1525184560449458206
*/

const TEAM_GROUPS = [
  {
    name: "Projektleitung",
    roleIds: ["1524899549888385196"]
  },
  {
    name: "Teamverwaltung",
    roleIds: ["1525185369036030032"]
  },
  {
    name: "Support",
    roleIds: [
      "1525184472717459608",
      "1525184560449458206"
    ]
  }
];

export default {
  async fetch(request, env) {
    const origin = env.ALLOWED_ORIGIN || "*";

    const corsHeaders = {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Cache-Control": "public, max-age=60"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== "GET") {
      return jsonResponse({ error: "Method not allowed" }, 405, corsHeaders);
    }

    if (!env.DISCORD_BOT_TOKEN || !env.DISCORD_GUILD_ID) {
      return jsonResponse(
        { error: "Discord-Konfiguration fehlt" },
        500,
        corsHeaders
      );
    }

    try {
      const members = await fetchAllGuildMembers(
        env.DISCORD_GUILD_ID,
        env.DISCORD_BOT_TOKEN
      );

      const groups = TEAM_GROUPS.map(group => ({
        name: group.name,
        members: members
          .filter(member =>
            member.roles.some(roleId => group.roleIds.includes(roleId))
          )
          .map(member => mapMember(member, env.DISCORD_GUILD_ID))
          .sort((a, b) =>
            a.displayName.localeCompare(b.displayName, "de")
          )
      }));

      return jsonResponse(
        {
          updatedAt: new Date().toISOString(),
          groups
        },
        200,
        corsHeaders
      );
    } catch (error) {
      return jsonResponse(
        {
          error: "Discord-Team konnte nicht geladen werden",
          detail: String(error.message || error)
        },
        500,
        corsHeaders
      );
    }
  }
};

async function fetchAllGuildMembers(guildId, botToken) {
  const allMembers = [];
  let after = "0";

  while (true) {
    const url = new URL(
      `https://discord.com/api/v10/guilds/${guildId}/members`
    );
    url.searchParams.set("limit", "1000");
    url.searchParams.set("after", after);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bot ${botToken}`
      }
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Discord ${response.status}: ${body}`);
    }

    const page = await response.json();
    allMembers.push(...page);

    if (page.length < 1000) break;
    after = page[page.length - 1].user.id;
  }

  return allMembers;
}

function mapMember(member, guildId) {
  const user = member.user;
  const avatarHash = member.avatar || user.avatar;

  const avatar = avatarHash
    ? member.avatar
      ? `https://cdn.discordapp.com/guilds/${guildId}/users/${user.id}/avatars/${member.avatar}.png?size=512`
      : `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=512`
    : `https://cdn.discordapp.com/embed/avatars/${Number(user.id) % 6}.png`;

  return {
    id: user.id,
    username: user.global_name || user.username,
    displayName: member.nick || user.global_name || user.username,
    avatar,
    status: "offline"
  };
}

function jsonResponse(data, status, headers) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...headers,
      "Content-Type": "application/json; charset=UTF-8"
    }
  });
}
