"use client";

import { useEffect, useMemo, useState } from "react";
import type { NewsItem } from "@/data/news";
import { rules, ruleCategories } from "@/data/rules";
import { factions } from "@/data/factions";

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
  mapname?: string;
  gametype?: string;
  joinUrl?: string;
};

const STORAGE_KEY = "blackout-rp-news-v2";

export default function HomeClient({ news: initialNews }: { news: NewsItem[] }) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [ruleSearch, setRuleSearch] = useState("");
  const [category, setCategory] = useState("Alle");
  const [openRules, setOpenRules] = useState<Set<string>>(new Set());
  const [team, setTeam] = useState<TeamGroup[]>([]);
  const [teamError, setTeamError] = useState("");
  const [status, setStatus] = useState<ServerStatus | null>(null);
  const [restart, setRestart] = useState("--:--:--");
  const [activeFaction, setActiveFaction] = useState<(typeof factions)[number] | null>(null);
  const [news, setNews] = useState(initialNews);
  const discord = process.env.NEXT_PUBLIC_DISCORD_INVITE || "https://aliaslink.de/r/blackoutrp";

  useEffect(() => {
    let value = 0;
    const timer = setInterval(() => {
      value += Math.floor(Math.random() * 13) + 5;
      if (value >= 100) {
        value = 100;
        clearInterval(timer);
        setTimeout(() => setLoading(false), 350);
      }
      setProgress(value);
    }, 110);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setNews(JSON.parse(saved));
    } catch {}
  }, []);

  const filteredRules = useMemo(() => {
    const query = ruleSearch.toLowerCase().trim();
    return rules.filter((rule) => {
      const categoryMatch = category === "Alle" || rule.category === category;
      return categoryMatch && JSON.stringify(rule).toLowerCase().includes(query);
    });
  }, [ruleSearch, category]);

  useEffect(() => {
    fetch("/api/team", { cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error("Discord-Team konnte nicht geladen werden");
        return r.json();
      })
      .then((data) => setTeam(data.groups || []))
      .catch((error) => setTeamError(error.message));

    const loadStatus = () => {
      fetch("/api/status", { cache: "no-store" })
        .then((r) => r.json())
        .then(setStatus)
        .catch(() => setStatus({
          online: false,
          clients: 0,
          maxClients: 0,
          hostname: "Blackout RP"
        }));
    };

    loadStatus();
    const statusTimer = setInterval(loadStatus, 30000);

    const restartTimer = setInterval(() => {
      const hours = (process.env.NEXT_PUBLIC_RESTART_HOURS || "4,12,20")
        .split(",")
        .map(Number)
        .filter(Number.isFinite);
      const now = new Date();
      const candidates = hours.map((hour) => {
        const date = new Date(now);
        date.setHours(hour, 0, 0, 0);
        if (date <= now) date.setDate(date.getDate() + 1);
        return date;
      });
      const next = candidates.sort((a, b) => a.getTime() - b.getTime())[0];
      if (!next) return;
      const diff = next.getTime() - now.getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRestart(`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`);
    }, 1000);

    return () => {
      clearInterval(statusTimer);
      clearInterval(restartTimer);
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
      {loading && (
        <div className="loaderScreen">
          <div className="loaderSmoke" />
          <img src="/blackout-logo.png" alt="Blackout RP" />
          <p>SYSTEME WERDEN HOCHGEFAHREN</p>
          <div className="loaderTrack"><span style={{ width: `${progress}%` }} /></div>
          <strong>{progress}%</strong>
        </div>
      )}

      <div className="weatherFx" aria-hidden="true">
        <div className="rain" />
        <div className="ash ashOne" />
        <div className="ash ashTwo" />
        <div className="smoke smokeOne" />
        <div className="smoke smokeTwo" />
      </div>

      <header className="navbar">
        <a className="brand" href="#start">
          <img src="/blackout-logo.png" alt="Blackout RP" />
          <span>BLACKOUT <b>RP</b></span>
        </a>
        <button className="menuButton" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menü">
          <span /><span /><span />
        </button>
        <nav className={menuOpen ? "open" : ""}>
          {[
            ["Start", "start"], ["News", "news"], ["Server", "status"],
            ["Fraktionen", "fraktionen"], ["Team", "team"], ["Regeln", "regelwerk"]
          ].map(([label,id]) => (
            <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}</a>
          ))}
        </nav>
        <a className="discordSmall" href={discord} target="_blank">Verbinden</a>
      </header>

      <main>
        <section id="start" className="hero">
          <video autoPlay muted loop playsInline className="heroVideo">
            <source src="/media/background.mp4" type="video/mp4" />
          </video>
          <div className="heroArtwork" />
          <div className="heroVignette" />

          <div className="heroContent">
            <p className="eyebrow">FIVEM APOCALYPSE ROLEPLAY</p>
            <h1>BLACKOUT <span>RP</span></h1>
            <h2>ÜBERLEBEN. KÄMPFEN. GESTALTEN.</h2>
            <p className="lead">
              Willkommen in einer Welt, in der Strom, Ordnung und Sicherheit zusammengebrochen sind.
              Entscheide selbst, ob du Hoffnung bringst oder das Chaos beherrschst.
            </p>
            <div className="actions">
              <a className="button primary" href={status?.joinUrl || `https://cfx.re/join/xllzq5m`} target="_blank">Jetzt verbinden</a>
              <a className="button secondary" href="#fraktionen">Mehr erfahren</a>
            </div>

            <div className="quickStatus glass">
              <div>
                <span className={`dot ${status?.online ? "online" : "offline"}`} />
                <strong>{status?.online ? "ONLINE" : "STATUS WIRD GEPRÜFT"}</strong>
              </div>
              <div><small>SPIELER</small><strong>{status ? `${status.clients} / ${status.maxClients || "–"}` : "– / –"}</strong></div>
              <div><small>MAP</small><strong>{status?.mapname || "San Andreas"}</strong></div>
              <div><small>NÄCHSTER RESTART</small><strong>{restart}</strong></div>
            </div>
          </div>
        </section>

        <section id="status" className="dashboardSection">
          <div className="dashboardGrid">
            <article className="dashboardCard serverCard">
              <div className="cardTop"><span>SERVER STATUS</span><b className={status?.online ? "green" : "red"}>{status?.online ? "● ONLINE" : "● OFFLINE"}</b></div>
              <div className="serverNumbers">
                <div><strong>{status?.clients ?? 0}</strong><span>SPIELER</span></div>
                <div><strong>{status?.maxClients || 64}</strong><span>SLOTS</span></div>
                <div><strong>{status?.mapname || "San Andreas"}</strong><span>MAP</span></div>
                <div><strong>{restart.slice(0,5)}</strong><span>RESTART</span></div>
              </div>
              <div className="connectRow">
                <div><b>{status?.hostname || "Blackout RP | Apocalypse"}</b><small>Survive. Build. Dominate.</small></div>
                <a href={status?.joinUrl || "https://cfx.re/join/xllzq5m"} target="_blank">VERBINDEN</a>
              </div>
            </article>

            <article className="dashboardCard newsMini">
              <div className="cardTop"><span>NEUESTE NEWS</span><a href="/admin">ADMIN</a></div>
              {news.slice(0,3).map((item) => (
                <div className="miniNews" key={item.title}>
                  <img src={item.image} alt="" />
                  <div><small>{item.date}</small><b>{item.title}</b><p>{item.text}</p></div>
                </div>
              ))}
            </article>
          </div>
        </section>

        <section id="news" className="section">
          <Heading eyebrow="NEUIGKEITEN AUS DER SPERRZONE" title="NEWS & UPDATES" />
          <div className="newsGrid">
            {news.map((item, index) => (
              <article className={`newsCard ${index === 0 ? "featured" : ""}`} key={item.title}
                style={{ backgroundImage: `linear-gradient(0deg,rgba(5,4,4,.98),rgba(5,4,4,.1)),url("${item.image}")` }}>
                <span>{item.date}</span><h3>{item.title}</h3><p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="fraktionen" className="section">
          <Heading eyebrow="WÄHLE DEINEN WEG" title="FRAKTIONEN" />
          <div className="factionGrid">
            {factions.map((faction) => (
              <button className={`factionCard ${faction.id}`} key={faction.id} onClick={() => setActiveFaction(faction)}>
                <div className="factionBackdrop" style={{ backgroundImage: `url("${faction.image}")` }} />
                <div className="factionText">
                  <p>{faction.subtitle}</p><h3>{faction.name}</h3><span>{faction.description}</span><b>MEHR ERFAHREN →</b>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section id="team" className="teamSection">
          <Heading eyebrow="LIVE AUS DISCORD" title="UNSER TEAM">
            Mitglieder und Avatare werden automatisch anhand der Discord-Rollen geladen.
          </Heading>
          {teamError && <div className="notice">{teamError}</div>}
          <div className="teamGroups">
            {team.map((group) => (
              <section className="teamGroup" key={group.name}>
                <div className="groupTitle"><h3>{group.name}</h3><span>{group.members.length} Mitglieder</span></div>
                <div className="teamGrid">
                  {group.members.map((member) => (
                    <article className="teamCard" key={`${group.name}-${member.id}`}>
                      <div className="avatarFrame"><img src={member.avatar} alt={member.displayName} /></div>
                      <p>{group.name}</p><h4>{member.displayName}</h4><small>@{member.username}</small>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>

        <section id="regelwerk" className="section">
          <Heading eyebrow="STAND: 19.07.2026" title="SERVERREGELWERK" />
          <div className="rulesLayout">
            <aside className="rulesSidebar">
              <label>REGEL SUCHEN</label>
              <input value={ruleSearch} onChange={(e) => setRuleSearch(e.target.value)} placeholder="RDM, Safezone, Loot..." />
              {ruleCategories.map((item) => (
                <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>
              ))}
            </aside>
            <div className="rulesList">
              {filteredRules.map((rule) => {
                const id = `${rule.number}-${rule.title}`;
                const open = openRules.has(id);
                return (
                  <article className={`ruleCard ${rule.important ? "important" : ""} ${open ? "open" : ""}`} key={id}>
                    <button className="ruleHeader" onClick={() => toggleRule(id)}>
                      <span><b>{rule.number}</b> {rule.title}</span><i>+</i>
                    </button>
                    <div className="ruleBody">
                      {rule.items && <ul>{rule.items.map((item) => <li key={item}>{item}</li>)}</ul>}
                      {rule.sections?.map((section) => (
                        <div key={section.title}><h4>{section.title}</h4><ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul></div>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {activeFaction && (
        <div className="modalBackdrop" onClick={() => setActiveFaction(null)}>
          <article className="factionModal" onClick={(e) => e.stopPropagation()}>
            <button className="modalClose" onClick={() => setActiveFaction(null)}>×</button>
            <div className="modalHero" style={{ backgroundImage: `linear-gradient(0deg,#090807,transparent),url("${activeFaction.image}")` }} />
            <p className="eyebrow">{activeFaction.subtitle}</p>
            <h2>{activeFaction.name}</h2>
            <p>{activeFaction.description}</p>
            <ul>{activeFaction.mission.map((item) => <li key={item}>{item}</li>)}</ul>
            <a className="button primary" href={discord} target="_blank">Auf Discord bewerben</a>
          </article>
        </div>
      )}

      <footer><img src="/blackout-logo.png" alt="" /><p>© {new Date().getFullYear()} Blackout RP</p><a href="/admin">News Admin</a></footer>
    </>
  );
}

function Heading({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return <div className="heading"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{children && <div className="headingText">{children}</div>}</div>;
}
