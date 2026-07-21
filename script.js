const CONFIG = window.BLACKOUT_CONFIG || {};
const NEWS = window.BLACKOUT_NEWS || [];

const menuButton = document.getElementById("menuButton");
const navigation = document.getElementById("navigation");
const navLinks = [...document.querySelectorAll("nav a")];

menuButton.addEventListener("click", () => {
  const open = navigation.classList.toggle("open");
  document.body.classList.toggle("menu-open", open);
});

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    navigation.classList.remove("open");
    document.body.classList.remove("menu-open");
  });
});

document.querySelectorAll("[data-discord-link]").forEach(link => {
  link.href = CONFIG.discordInvite || "#";
});

const joinButton = document.getElementById("fivemJoinButton");
if (CONFIG.fivemJoinCode && CONFIG.fivemJoinCode !== "DEIN-JOIN-CODE") {
  joinButton.href = `https://cfx.re/join/${CONFIG.fivemJoinCode}`;
} else {
  joinButton.href = CONFIG.discordInvite || "#";
  joinButton.textContent = "Join-Code in config.js eintragen";
}

function renderNews() {
  const grid = document.getElementById("newsGrid");
  grid.innerHTML = "";

  NEWS.forEach(item => {
    const article = document.createElement("article");
    article.className = "news-card reveal";
    article.style.setProperty("--news-image", `url("${item.image}")`);
    article.innerHTML = `
      <div class="news-date">${escapeHtml(item.date)}</div>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.text)}</p>
    `;
    grid.appendChild(article);
  });
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[character]));
}

renderNews();

document.querySelectorAll(".rule-header").forEach(header => {
  header.addEventListener("click", () => {
    const card = header.closest(".rule-card");
    const content = card.querySelector(".rule-content");
    const opening = !card.classList.contains("open");

    card.classList.toggle("open", opening);
    content.style.maxHeight = opening ? `${content.scrollHeight}px` : "0px";
  });
});

const ruleCards = [...document.querySelectorAll(".rule-card")];
const ruleFilters = [...document.querySelectorAll(".rule-filter")];
const ruleSearch = document.getElementById("ruleSearch");
const noRules = document.getElementById("noRules");
let selectedCategory = "all";

function filterRules() {
  const search = ruleSearch.value.trim().toLowerCase();
  let visible = 0;

  ruleCards.forEach(card => {
    const categories = (card.dataset.category || "").split(" ");
    const categoryMatch =
      selectedCategory === "all" || categories.includes(selectedCategory);
    const searchMatch = card.textContent.toLowerCase().includes(search);
    const shouldShow = categoryMatch && searchMatch;

    card.hidden = !shouldShow;
    if (shouldShow) visible++;
  });

  noRules.style.display = visible ? "none" : "block";
}

ruleFilters.forEach(filter => {
  filter.addEventListener("click", () => {
    ruleFilters.forEach(item => item.classList.remove("active"));
    filter.classList.add("active");
    selectedCategory = filter.dataset.category;
    filterRules();
  });
});

ruleSearch.addEventListener("input", filterRules);

async function loadFiveMStatus() {
  const statusText = document.getElementById("serverStatus");
  const heroText = document.getElementById("heroStatusText");
  const playersOnline = document.getElementById("playersOnline");
  const maxPlayers = document.getElementById("maxPlayers");
  const heroPlayers = document.getElementById("heroPlayers");
  const serverName = document.getElementById("serverName");
  const dots = [
    document.getElementById("serverDot"),
    document.getElementById("heroStatusDot")
  ];

  const setOffline = (message = "Nicht verbunden") => {
    statusText.textContent = message;
    heroText.textContent = message;
    dots.forEach(dot => {
      dot.className = "status-dot offline";
    });
  };

  if (!CONFIG.fivemJoinCode || CONFIG.fivemJoinCode === "DEIN-JOIN-CODE") {
    setOffline("Join-Code fehlt");
    return;
  }

  try {
    const response = await fetch(
      `https://servers-frontend.fivem.net/api/servers/single/${encodeURIComponent(CONFIG.fivemJoinCode)}`,
      { cache: "no-store" }
    );

    if (!response.ok) throw new Error("Server nicht erreichbar");

    const result = await response.json();
    const data = result.Data || result.data || {};
    const current = Number(data.clients ?? 0);
    const maximum = Number(data.sv_maxclients ?? 0);
    const hostname = data.hostname || "Blackout RP";

    statusText.textContent = "ONLINE";
    heroText.textContent = "Server online";
    playersOnline.textContent = current;
    maxPlayers.textContent = maximum || "–";
    heroPlayers.textContent = `${current} / ${maximum || "–"}`;
    serverName.textContent = hostname.replace(/\^[0-9]/g, "");

    dots.forEach(dot => {
      dot.className = "status-dot online";
    });
  } catch (error) {
    console.warn("FiveM-Status konnte nicht geladen werden:", error);
    setOffline("OFFLINE / NICHT ERREICHBAR");
  }
}

function updateRestartTimer() {
  const hours = Array.isArray(CONFIG.restartHours) && CONFIG.restartHours.length
    ? CONFIG.restartHours
    : [4, 12, 20];

  const now = new Date();
  const candidates = hours.map(hour => {
    const date = new Date(now);
    date.setHours(hour, 0, 0, 0);
    if (date <= now) date.setDate(date.getDate() + 1);
    return date;
  });

  const next = candidates.sort((a, b) => a - b)[0];
  const difference = next - now;

  const h = Math.floor(difference / 3600000);
  const m = Math.floor((difference % 3600000) / 60000);
  const s = Math.floor((difference % 60000) / 1000);

  document.getElementById("restartTimer").textContent =
    `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

async function loadDiscordTeam() {
  const groupsContainer = document.getElementById("teamGroups");
  const loading = document.getElementById("teamLoading");
  const error = document.getElementById("teamError");

  if (!CONFIG.discordTeamApi) {
    loading.hidden = true;
    error.hidden = false;
    return;
  }

  try {
    const response = await fetch(CONFIG.discordTeamApi, { cache: "no-store" });
    if (!response.ok) throw new Error("Discord API Fehler");

    const data = await response.json();
    const groups = data.groups || [];

    groupsContainer.innerHTML = "";

    groups.forEach(group => {
      const section = document.createElement("section");
      section.className = "team-group reveal";

      const members = group.members || [];
      section.innerHTML = `
        <div class="team-group-title">
          <h3>${escapeHtml(group.name)}</h3>
          <span>${members.length} Mitglied${members.length === 1 ? "" : "er"}</span>
        </div>
        <div class="team-grid">
          ${members.map(member => `
            <article class="team-card">
              <div class="team-avatar-wrap">
                <img class="team-avatar" src="${escapeHtml(member.avatar)}" alt="${escapeHtml(member.displayName)}">
                <span class="presence-dot ${escapeHtml(member.status || "offline")}"></span>
              </div>
              <div class="team-role">${escapeHtml(group.name)}</div>
              <h4>${escapeHtml(member.displayName)}</h4>
              <small>@${escapeHtml(member.username)}</small>
            </article>
          `).join("")}
        </div>
      `;

      groupsContainer.appendChild(section);
    });

    loading.hidden = true;
    error.hidden = groups.length > 0;
    observeReveals();
  } catch (fetchError) {
    console.warn(fetchError);
    loading.hidden = true;
    error.hidden = false;
  }
}

let revealObserver;

function observeReveals() {
  if (!revealObserver) {
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.11 });
  }

  document.querySelectorAll(".reveal:not(.visible)").forEach(element => {
    revealObserver.observe(element);
  });
}

const sections = [...document.querySelectorAll("main section[id]")];
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    navLinks.forEach(link => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${entry.target.id}`
      );
    });
  });
}, { rootMargin: "-35% 0px -55% 0px" });

sections.forEach(section => sectionObserver.observe(section));

const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  backToTop.classList.toggle("visible", window.scrollY > 650);
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.getElementById("year").textContent = new Date().getFullYear();

observeReveals();
loadFiveMStatus();
loadDiscordTeam();
updateRestartTimer();

setInterval(updateRestartTimer, 1000);
setInterval(loadFiveMStatus, 60000);
