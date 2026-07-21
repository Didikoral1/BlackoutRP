"use client";

import { useEffect, useMemo, useState } from "react";
import type { NewsItem } from "@/data/news";
import { rules, ruleCategories } from "@/data/rules";

type TeamMember = {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
};

type TeamGroup = {
  name: string;
  members: TeamMember[];
};

type ServerStatus = {
  online: boolean;
  clients: number;
  maxClients: number;
  hostname: string;
  joinUrl?: string;
};

export default function HomeClient({ news }: { news: NewsItem[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [ruleSearch, setRuleSearch] = useState("");
  const [category, setCategory] = useState("Alle");
  const [openRules, setOpenRules] = useState<Set<string>>(new Set());
  const [team, setTeam] = useState<TeamGroup[]>([]);
  const [teamError, setTeamError] = useState("");
  const [status, setStatus] = useState<ServerStatus | null>(null);
  const [restart, setRestart] = useState("--:--:--");

  const discord = process.env.NEXT_PUBLIC_DISCORD_INVITE || "#";

  const filteredRules = useMemo(() => {
    const query = ruleSearch.toLowerCase().trim();
    return rules.filter((rule) => {
      const categoryMatch = category === "Alle" || rule.category === category;
      const text = JSON.stringify(rule).toLowerCase();
      return categoryMatch && text.includes(query);
    });
  }, [ruleSearch, category]);

  useEffect(() => {
    fetch("/api/team")
      .then((r) => {
        if (!r.ok) throw new Error("Discord-Team noch nicht eingerichtet");
        return r.json();
      })
      .then((data) => setTeam(data.groups || []))
      .catch((error) => setTeamError(error.message));

    const loadStatus = () => {
      fetch("/api/status", { cache: "no-store" })
        .then((r) => r.json())
        .then(setStatus)
        .catch(() =>
          setStatus({
            online: false,
            clients: 0,
            maxClients: 0,
            hostname: "Blackout RP"
          })
        );
    };

    loadStatus();
    const statusInterval = setInterval(loadStatus, 60000);

    const updateRestart = () => {
      const raw = process.env.NEXT_PUBLIC_RESTART_HOURS || "4,12,20";
      const hours = raw.split(",").map(Number).filter(Number.isFinite);
      const now = new Date();
      const dates = hours.map((hour) => {
        const date = new Date(now);
        date.setHours(hour, 0, 0, 0);
        if (date <= now) date.setDate(date.getDate() + 1);
        return date;
      });
      const next = dates.sort((a, b) => a.getTime() - b.getTime())[0];
      if (!next) return;
      const diff = next.getTime() - now.getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRestart(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      );
    };

    updateRestart();
    const restartInterval = setInterval(updateRestart, 1000);

    return () => {
      clearInterval(statusInterval);
      clearInterval(restartInterval);
    };
  }, []);

  function toggleRule(id: string) {
    setOpenRules((current) => {
      const next = new Set(current);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <>
      <div className="noise" />

      <header className="navbar">
        <a className="brand" href="#start">
          <img src="/blackout-logo.png" alt="Blackout RP Logo" />
          <span>BLACKOUT <b>RP</b></span>
        </a>

        <button
          className="menuButton"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menü öffnen"
        >
          <span /><span /><span />
        </button>

        <nav className={menuOpen ? "open" : ""}>
          {[
            ["Start", "start"],
            ["News", "news"],
            ["Status", "status"],
            ["Regelwerk", "regelwerk"],
            ["Fraktionen", "fraktionen"],
            ["Team", "team"]
          ].map(([label, id]) => (
            <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>
              {label}
            </a>
          ))}
        </nav>

        <a className="discordSmall" href={discord} target="_blank">
          Discord
        </a>
      </header>

      <main>
        <section id="start" className="hero">
          <video autoPlay muted loop playsInline className="heroVideo">
            <source src="/media/background.mp4" type="video/mp4" />
          </video>
          <div className="heroFallback" />
          <div className="heroOverlay" />

          <div className="heroContent">
            <img className="heroLogo" src="/blackout-logo.png" alt="Blackout RP" />
            <p className="eyebrow">DEUTSCHER FIVEM APOCALYPSE ROLEPLAY SERVER</p>
            <h1>ÜBERLEBE<br /><span>DEN BLACKOUT</span></h1>
            <p className="lead">
              Die alte Welt ist gefallen. Strom, Ordnung und Sicherheit sind Geschichte.
              Entscheide, ob du den Wiederaufbau unterstützt oder das Chaos beherrschst.
            </p>

            <div className="actions">
              <a className="button primary" href={discord} target="_blank">Discord beitreten</a>
              <a className="button secondary" href="#regelwerk">Regelwerk lesen</a>
            </div>

            <div className="quickStatus">
              <div>
                <span className={`dot ${status?.online ? "online" : "offline"}`} />
                <strong>{status?.online ? "Server online" : "Status wird geprüft"}</strong>
              </div>
              <div>
                <small>SPIELER</small>
                <strong>{status ? `${status.clients} / ${status.maxClients || "–"}` : "– / –"}</strong>
              </div>
              <div>
                <small>NÄCHSTER RESTART</small>
                <strong>{restart}</strong>
              </div>
            </div>
          </div>
        </section>

        <section id="news" className="section">
          <Heading eyebrow="AKTUELLES AUS DER APOKALYPSE" title="NEWS & UPDATES">
            Neue Inhalte, wichtige Ankündigungen und Änderungen am Server.
          </Heading>
          <div className="newsGrid">
            {news.map((item) => (
              <article
                className={`newsCard ${item.featured ? "featured" : ""}`}
                key={item.title}
                style={{ backgroundImage: `linear-gradient(0deg, rgba(7,6,5,.98), rgba(7,6,5,.1)), url("${item.image}")` }}
              >
                <span>{item.date}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="status" className="statusSection">
          <div className="statusLayout">
            <Heading eyebrow="LIVE SERVERSTATUS" title="BLACKOUT IST LIVE">
              Der Status wird automatisch über den FiveM-Join-Code geladen.
            </Heading>

            <div className="statusPanel">
              <div className="statusHead">
                <span className={`dot large ${status?.online ? "online" : "offline"}`} />
                <div>
                  <small>SERVERSTATUS</small>
                  <h3>{status?.online ? "ONLINE" : "OFFLINE / NICHT EINGERICHTET"}</h3>
                </div>
              </div>
              <div className="statusStats">
                <div><small>SPIELER</small><strong>{status?.clients ?? "–"}</strong></div>
                <div><small>SLOTS</small><strong>{status?.maxClients || "–"}</strong></div>
                <div><small>SERVERNAME</small><strong>{status?.hostname || "Blackout RP"}</strong></div>
              </div>
              <a
                className="button primary full"
                href={status?.joinUrl || discord}
                target="_blank"
              >
                Direkt verbinden
              </a>
            </div>
          </div>
        </section>

        <section id="regelwerk" className="section">
          <Heading eyebrow="STAND: 19.07.2026" title="SERVERREGELWERK">
            Mit dem Betreten des Servers akzeptierst du dieses Regelwerk.
            Respekt, Fairness und glaubwürdiges Rollenspiel stehen immer an erster Stelle.
          </Heading>

          <div className="rulesLayout">
            <aside className="rulesSidebar">
              <label>REGEL SUCHEN</label>
              <input
                value={ruleSearch}
                onChange={(e) => setRuleSearch(e.target.value)}
                placeholder="z. B. RDM, Safezone, Loot"
              />
              {ruleCategories.map((item) => (
                <button
                  key={item}
                  className={category === item ? "active" : ""}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </aside>

            <div className="rulesList">
              {filteredRules.map((rule) => {
                const id = `${rule.number}-${rule.title}`;
                const open = openRules.has(id);
                return (
                  <article className={`ruleCard ${rule.important ? "important" : ""} ${open ? "open" : ""}`} key={id}>
                    <button className="ruleHeader" onClick={() => toggleRule(id)}>
                      <span><b>{rule.number}</b> {rule.title}</span>
                      <i>+</i>
                    </button>
                    <div className="ruleBody">
                      {rule.items && <ul>{rule.items.map((item) => <li key={item}>{item}</li>)}</ul>}
                      {rule.sections?.map((section) => (
                        <div key={section.title}>
                          <h4>{section.title}</h4>
                          <ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul>
                        </div>
                      ))}
                    </div>
                  </article>
                );
              })}
              {!filteredRules.length && <p className="empty">Keine passende Regel gefunden.</p>}
            </div>
          </div>
        </section>

        <section id="fraktionen" className="section">
          <Heading eyebrow="WÄHLE DEINEN WEG" title="FRAKTIONEN" />
          <div className="factionGrid">
            {[
              ["atlas", "ORDNUNG · SCHUTZ · WIEDERAUFBAU", "ATLAS EINHEIT", "Die letzte organisierte Schutzmacht der Stadt."],
              ["raiders", "CHAOS · MACHT · ÜBERLEBEN", "THE RAIDERS", "Sie erobern Gebiete und sabotieren die Infrastruktur."],
              ["ems", "MEDIZIN · NEUTRALITÄT · RETTUNG", "EMS", "Medizinische Hilfe in einer zerstörten Welt."],
              ["survivor", "FREIHEIT · HANDEL · ENTDECKUNG", "SURVIVOR", "Freie Überlebende schreiben ihre eigene Geschichte."]
            ].map(([cls, tag, title, text]) => (
              <article className={`factionCard ${cls}`} key={title}>
                <div>
                  <p>{tag}</p>
                  <h3>{title}</h3>
                  <span>{text}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="team" className="teamSection">
          <Heading eyebrow="AUTOMATISCH AUS DISCORD" title="UNSER TEAM">
            Mitglieder werden anhand ihrer Discord-Rollen automatisch einsortiert.
          </Heading>

          {teamError && <div className="notice">{teamError}. Trage die Cloudflare-Secrets ein.</div>}

          <div className="teamGroups">
            {team.map((group) => (
              <section className="teamGroup" key={group.name}>
                <div className="groupTitle">
                  <h3>{group.name}</h3>
                  <span>{group.members.length} Mitglieder</span>
                </div>
                <div className="teamGrid">
                  {group.members.map((member) => (
                    <article className="teamCard" key={`${group.name}-${member.id}`}>
                      <img src={member.avatar} alt={member.displayName} />
                      <p>{group.name}</p>
                      <h4>{member.displayName}</h4>
                      <small>@{member.username}</small>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="joinBanner">
            <div>
              <p className="eyebrow">WERDE TEIL DER COMMUNITY</p>
              <h3>BETRITT DEN BLACKOUT</h3>
              <span>News, Bewerbungen und Support findest du auf unserem Discord.</span>
            </div>
            <a className="button primary" href={discord} target="_blank">Discord beitreten</a>
          </div>
        </section>
      </main>

      <footer>
        <img src="/blackout-logo.png" alt="Blackout RP" />
        <p>© {new Date().getFullYear()} Blackout RP</p>
        <a href="#regelwerk">Regelwerk</a>
      </footer>
    </>
  );
}

function Heading({
  eyebrow,
  title,
  children
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {children && <div className="headingText">{children}</div>}
    </div>
  );
}
