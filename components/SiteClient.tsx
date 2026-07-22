"use client";

import { useEffect, useMemo, useState } from "react";
import type { NewsItem } from "@/data/news";
import { rules as defaultRules, ruleCategories, type Rule } from "@/data/rules";
import { factions } from "@/data/factions";

export type SitePage = "start" | "news" | "server" | "fraktionen" | "team" | "regeln";

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

const NEWS_STORAGE_KEY = "blackout-rp-news-v2";
const RULES_STORAGE_KEY = "blackout-rp-rules-v1";
const ASSET_REVISION = "20260722-3";

const pages: { id: SitePage; number: string; label: string; href: string }[] = [
  { id: "start", number: "01", label: "Start", href: "/" },
  { id: "news", number: "02", label: "News", href: "/news" },
  { id: "server", number: "03", label: "Server", href: "/server" },
  { id: "fraktionen", number: "04", label: "Fraktionen", href: "/fraktionen" },
  { id: "team", number: "05", label: "Team", href: "/team" },
  { id: "regeln", number: "06", label: "Regeln", href: "/regeln" }
];

const pageHeaders: Record<Exclude<SitePage, "start">, { code: string; eyebrow: string; title: string; text: string; image: string }> = {
  news: { code: "02", eyebrow: "MELDUNGEN AUS DER SPERRZONE", title: "News & Updates", text: "Einsatzberichte, Änderungen und Neuigkeiten aus der Welt von Blackout RP.", image: "/media/hero-blackout.webp" },
  server: { code: "03", eyebrow: "BLACKOUT NETWORK", title: "Server", text: "Live-Status, Spielerzahl und direkter Zugang zur Apokalypse.", image: "/media/faction-survivor.webp" },
  fraktionen: { code: "04", eyebrow: "WÄHLE DEINEN WEG", title: "Fraktionen", text: "Vier Wege. Vier Ideale. Eine Welt, in der jede Entscheidung Folgen hat.", image: "/media/faction-atlas.webp" },
  team: { code: "05", eyebrow: "DIE MENSCHEN HINTER BLACKOUT", title: "Unser Team", text: "Leitung, Administration und Support – live mit Discord verbunden.", image: "/media/faction-ems.webp" },
  regeln: { code: "06", eyebrow: "PROTOKOLL BO-RP/26", title: "Regelwerk", text: "Klare Regeln für glaubwürdiges, faires und intensives Roleplay.", image: "/media/faction-raiders.webp" }
};

function mediaAsset(path: string) {
  return `${path}?v=${ASSET_REVISION}`;
}

export default function SiteClient({ page, initialNews }: { page: SitePage; initialNews: NewsItem[] }) {
  const [loading, setLoading] = useState(page === "start");
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [ruleSearch, setRuleSearch] = useState("");
  const [category, setCategory] = useState("Alle");
  const [openRules, setOpenRules] = useState<Set<string>>(new Set());
  const [siteRules, setSiteRules] = useState<Rule[]>(defaultRules);
  const [team, setTeam] = useState<TeamGroup[]>([]);
  const [teamError, setTeamError] = useState("");
  const [status, setStatus] = useState<ServerStatus | null>(null);
  const [restart, setRestart] = useState("--:--:--");
  const [activeFaction, setActiveFaction] = useState<(typeof factions)[number] | null>(null);
  const [news, setNews] = useState(initialNews);
  const discord = process.env.NEXT_PUBLIC_DISCORD_INVITE || "https://aliaslink.de/r/blackoutrp";
  const joinUrl = status?.joinUrl || "https://cfx.re/join/xllzq5m";
  const pageHeader = page === "start" ? null : pageHeaders[page];

  useEffect(() => {
    if (page !== "start") return;
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
  }, [page]);

  useEffect(() => {
    function loadPublishedContent() {
      try {
        const savedNews = localStorage.getItem(NEWS_STORAGE_KEY);
        const savedRules = localStorage.getItem(RULES_STORAGE_KEY);
        if (savedNews) setNews(JSON.parse(savedNews));
        if (savedRules) setSiteRules(JSON.parse(savedRules));
      } catch {}
    }

    loadPublishedContent();
    window.addEventListener("storage", loadPublishedContent);
    return () => window.removeEventListener("storage", loadPublishedContent);
  }, []);

  useEffect(() => {
    if (page !== "team") return;
    fetch("/api/team", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Discord-Team konnte nicht geladen werden");
        return response.json();
      })
      .then((data) => setTeam(data.groups || []))
      .catch((error) => setTeamError(error.message));
  }, [page]);

  useEffect(() => {
    if (page !== "start" && page !== "server") return;

    const loadStatus = () => {
      fetch("/api/status", { cache: "no-store" })
        .then((response) => response.json())
        .then(setStatus)
        .catch(() => setStatus({ online: false, clients: 0, maxClients: 0, hostname: "Blackout RP" }));
    };

    const updateRestart = () => {
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
      setRestart(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
    };

    loadStatus();
    updateRestart();
    const statusTimer = setInterval(loadStatus, 30000);
    const restartTimer = setInterval(updateRestart, 1000);
    return () => {
      clearInterval(statusTimer);
      clearInterval(restartTimer);
    };
  }, [page]);

  const filteredRules = useMemo(() => {
    const query = ruleSearch.toLowerCase().trim();
    return siteRules.filter((rule) => {
      const categoryMatch = category === "Alle" || rule.category === category;
      return categoryMatch && JSON.stringify(rule).toLowerCase().includes(query);
    });
  }, [siteRules, ruleSearch, category]);

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
          <div className="loaderMark"><img src={mediaAsset("/media/brand-mark.webp")} alt="Blackout RP" /></div>
          <p>BLACKOUT PROTOCOL // SYSTEMSTART</p>
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
        <a className="brand" href="/">
          <span className="brandMark"><img src={mediaAsset("/media/brand-mark.webp")} alt="" /></span>
          <span className="brandCopy">BLACKOUT <b>RP</b><small>APOCALYPSE ROLEPLAY</small></span>
        </a>
        <button className="menuButton" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menü">
          <span /><span /><span />
        </button>
        <nav className={menuOpen ? "open" : ""}>
          {pages.map((item) => (
            <a className={page === item.id ? "active" : ""} key={item.id} href={item.href} onClick={() => setMenuOpen(false)}>
              <small>{item.number}</small>{item.label}
            </a>
          ))}
        </nav>
        <a className="discordSmall" href={discord} target="_blank" rel="noreferrer"><i />Discord öffnen</a>
      </header>

      <main className={page === "start" ? "" : "subpageMain"}>
        {pageHeader && (
          <section className="pageMasthead" style={{ backgroundImage: `url("${mediaAsset(pageHeader.image)}")` }}>
            <div className="pageMastheadShade" />
            <div className="pageMastheadGrid" />
            <div className="pageMastheadContent">
              <div className="pageCode">SEKTOR // {pageHeader.code}</div>
              <p className="eyebrow">{pageHeader.eyebrow}</p>
              <h1>{pageHeader.title}</h1>
              <p>{pageHeader.text}</p>
            </div>
            <div className="pageMastheadSignal"><span />SIGNAL STABIL</div>
          </section>
        )}

        {page === "start" && (
          <section className="hero">
            <video autoPlay muted loop playsInline className="heroVideo" poster={mediaAsset("/media/hero-blackout.webp")}>
              <source src="/media/background.mp4" type="video/mp4" />
            </video>
            <div className="heroArtwork" style={{ backgroundImage: `url("${mediaAsset("/media/hero-blackout.webp")}")` }} />
            <div className="heroVignette" />
            <div className="heroGrid" aria-hidden="true" />

            <div className="heroContent">
              <div className="heroProtocol"><span>NOTFALLPROTOKOLL</span><b>SEKTOR 07 // SAN ANDREAS</b></div>
              <p className="eyebrow">DEUTSCHER FIVEM APOCALYPSE ROLEPLAY</p>
              <h1>BLACKOUT <span>RP</span></h1>
              <h2>ÜBERLEBEN. KÄMPFEN. GESTALTEN.</h2>
              <p className="lead">Willkommen in einer Welt, in der Strom, Ordnung und Sicherheit zusammengebrochen sind. Entscheide selbst, ob du Hoffnung bringst oder das Chaos beherrschst.</p>
              <div className="actions">
                <a className="button primary" href={joinUrl} target="_blank" rel="noreferrer">Jetzt verbinden <span>↗</span></a>
                <a className="button secondary" href="/fraktionen">Fraktionen ansehen</a>
              </div>
              <div className="quickStatus glass">
                <div><span className={`dot ${status?.online ? "online" : "offline"}`} /><strong>{status?.online ? "ONLINE" : "STATUS WIRD GEPRÜFT"}</strong></div>
                <div><small>SPIELER</small><strong>{status ? `${status.clients} / ${status.maxClients || "–"}` : "– / –"}</strong></div>
                <div><small>MAP</small><strong>{status?.mapname || "San Andreas"}</strong></div>
                <div><small>NÄCHSTER RESTART</small><strong>{restart}</strong></div>
              </div>
            </div>
            <aside className="heroTelemetry" aria-label="Server-Kennung">
              <span>BLACKOUT NETWORK</span><b>48° 08′ N // 11° 34′ E</b><small>VERSCHLÜSSELTES SIGNAL · BO-RP/26</small>
            </aside>
            <a className="scrollCue" href="/server"><span />SERVERSTATUS ÖFFNEN</a>
          </section>
        )}

        {page === "news" && (
          <section className="section">
            <Heading eyebrow="NEUIGKEITEN AUS DER SPERRZONE" title="NEWS & UPDATES">Alle Meldungen des Blackout-RP-Servers an einem Ort.</Heading>
            <div className="newsGrid">
              {news.map((item, index) => (
                <article className={`newsCard ${index === 0 ? "featured" : ""}`} key={`${item.title}-${index}`}
                  style={{ backgroundImage: `linear-gradient(0deg,rgba(5,4,4,.98),rgba(5,4,4,.1)),url("${mediaAsset(item.image)}")` }}>
                  <div className="newsMeta"><span>{String(index + 1).padStart(2, "0")}</span><time>{item.date}</time></div>
                  <h3>{item.title}</h3><p>{item.text}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {page === "server" && (
          <section className="section serverPage">
            <Heading eyebrow="LIVE-VERBINDUNG" title="SERVER">Status, Spielerzahl und der direkte Zugang zum Blackout-RP-Server.</Heading>
            <div className="dashboardGrid serverStandaloneGrid">
              <article className="dashboardCard serverCard">
                <div className="cardTop"><span><i>01</i> SERVER STATUS</span><b className={status?.online ? "green" : "red"}>{status?.online ? "● ONLINE" : "● OFFLINE"}</b></div>
                <div className="serverNumbers">
                  <div><strong>{status?.clients ?? 0}</strong><span>SPIELER</span></div>
                  <div><strong>{status?.maxClients || 64}</strong><span>SLOTS</span></div>
                  <div><strong>{status?.mapname || "San Andreas"}</strong><span>MAP</span></div>
                  <div><strong>{restart.slice(0, 5)}</strong><span>RESTART</span></div>
                </div>
                <div className="connectRow">
                  <div><b>{status?.hostname || "Blackout RP | Apocalypse"}</b><small>Survive. Build. Dominate.</small></div>
                  <a href={joinUrl} target="_blank" rel="noreferrer">VERBINDEN ↗</a>
                </div>
              </article>
              <article className="dashboardCard serverBriefing">
                <div className="cardTop"><span><i>02</i> EINSATZBEREIT</span><b className="green">● NETZWERK</b></div>
                <p className="serverLead">Tritt dem Server direkt bei oder öffne Discord für Neuigkeiten, Support und die Community.</p>
                <div className="serverActions">
                  <a className="button primary" href={joinUrl} target="_blank" rel="noreferrer">FiveM starten <span>↗</span></a>
                  <a className="button secondary" href={discord} target="_blank" rel="noreferrer">Discord öffnen <span>↗</span></a>
                </div>
              </article>
            </div>
          </section>
        )}

        {page === "fraktionen" && (
          <section className="section">
            <Heading eyebrow="WÄHLE DEINEN WEG" title="FRAKTIONEN">Entdecke die Gruppen, Aufgaben und Ziele in der Welt von Blackout RP.</Heading>
            <div className="factionGrid">
              {factions.map((faction, index) => (
                <button className={`factionCard ${faction.id}`} key={faction.id} onClick={() => setActiveFaction(faction)}
                  style={{ "--faction-accent": faction.accent } as React.CSSProperties}>
                  <div className="factionBackdrop" style={{ backgroundImage: `url("${mediaAsset(faction.image)}")` }} />
                  <div className="factionText">
                    <div className="factionIndex">FRAKTION // 0{index + 1}</div>
                    <p>{faction.subtitle}</p><h3>{faction.name}</h3><span>{faction.description}</span><b>DOSSIER ÖFFNEN ↗</b>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {page === "team" && (
          <section className="teamSection">
            <Heading eyebrow="LIVE AUS DISCORD" title="UNSER TEAM">Mitglieder und Avatare werden automatisch anhand der Discord-Rollen geladen.</Heading>
            {teamError && <div className="notice">{teamError}</div>}
            {!teamError && team.length === 0 && <div className="notice">Teamdaten werden geladen …</div>}
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
        )}

        {page === "regeln" && (
          <section className="section">
            <Heading eyebrow="VERBINDLICH FÜR ALLE SPIELER" title="SERVERREGELWERK">Nutze die Suche oder filtere die Regeln nach Kategorie.</Heading>
            <div className="rulesLayout">
              <aside className="rulesSidebar">
                <label>REGEL SUCHEN</label>
                <input value={ruleSearch} onChange={(event) => setRuleSearch(event.target.value)} placeholder="RDM, Safezone, Loot …" />
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
                      <button className="ruleHeader" onClick={() => toggleRule(id)}><span><b>{rule.number}</b> {rule.title}</span><i>+</i></button>
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
        )}
      </main>

      {activeFaction && (
        <div className="modalBackdrop" onClick={() => setActiveFaction(null)}>
          <article className="factionModal" onClick={(event) => event.stopPropagation()}>
            <button className="modalClose" onClick={() => setActiveFaction(null)} aria-label="Schließen">×</button>
            <div className="modalHero" style={{ backgroundImage: `linear-gradient(0deg,#090807,transparent),url("${mediaAsset(activeFaction.image)}")` }} />
            <p className="eyebrow">{activeFaction.subtitle}</p>
            <h2>{activeFaction.name}</h2>
            <p>{activeFaction.description}</p>
            <ul>{activeFaction.mission.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
        </div>
      )}

      <footer>
        <div className="footerBrand"><span className="brandMark"><img src={mediaAsset("/media/brand-mark.webp")} alt="" /></span><div><b>BLACKOUT RP</b><small>Wenn die Lichter ausgehen, beginnt deine Geschichte.</small></div></div>
        <p>© {new Date().getFullYear()} Blackout RP · BO-RP/26</p>
        <a href="/admin">Adminbereich ↗</a>
      </footer>
    </>
  );
}

function Heading({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return <div className="heading"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{children && <div className="headingText">{children}</div>}</div>;
}
