export const dynamic = "force-dynamic";

const groups = [
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
    roleIds: ["1525184472717459608", "1525184560449458206"]
  }
];

type DiscordMember = {
  nick?: string;
  avatar?: string;
  roles: string[];
  user: {
    id: string;
    username: string;
    global_name?: string;
    avatar?: string;
  };
};

export async function GET() {
  const token = process.env.DISCORD_BOT_TOKEN;
  const guildId = process.env.DISCORD_GUILD_ID;

  if (!token || !guildId || guildId === "DEINE_DISCORD_SERVER_ID") {
    return Response.json(
      { error: "Discord-Konfiguration fehlt" },
      { status: 503 }
    );
  }

  try {
    const members: DiscordMember[] = [];
    let after = "0";

    while (true) {
      const url = new URL(`https://discord.com/api/v10/guilds/${guildId}/members`);
      url.searchParams.set("limit", "1000");
      url.searchParams.set("after", after);

      const response = await fetch(url, {
        headers: { Authorization: `Bot ${token}` },
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error(`Discord API: ${response.status}`);
      }

      const page = (await response.json()) as DiscordMember[];
      members.push(...page);

      if (page.length < 1000) break;
      after = page[page.length - 1].user.id;
    }

    const result = groups.map((group) => ({
      name: group.name,
      members: members
        .filter((member) =>
          member.roles.some((roleId) => group.roleIds.includes(roleId))
        )
        .map((member) => {
          const user = member.user;
          const hash = member.avatar || user.avatar;
          let avatar = `https://cdn.discordapp.com/embed/avatars/${Number(BigInt(user.id) % BigInt(6))}.png`;

          if (member.avatar) {
            avatar = `https://cdn.discordapp.com/guilds/${guildId}/users/${user.id}/avatars/${member.avatar}.png?size=512`;
          } else if (user.avatar) {
            avatar = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=512`;
          }

          return {
            id: user.id,
            username: user.username,
            displayName: member.nick || user.global_name || user.username,
            avatar
          };
        })
        .sort((a, b) => a.displayName.localeCompare(b.displayName, "de"))
    }));

    return Response.json(
      { groups: result, updatedAt: new Date().toISOString() },
      { headers: { "Cache-Control": "public, max-age=60" } }
    );
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unbekannter Fehler" },
      { status: 500 }
    );
  }
}
