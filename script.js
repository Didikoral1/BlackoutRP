const menuButton = document.getElementById("menuButton");
const navigation = document.getElementById("navigation");
const navLinks = [...document.querySelectorAll("nav a")];
const backToTop = document.getElementById("backToTop");

menuButton.addEventListener("click", () => {
  const open = navigation.classList.toggle("open");
  document.body.classList.toggle("menu-open", open);
  menuButton.setAttribute("aria-expanded", String(open));
});

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    navigation.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll(".rule-header").forEach(header => {
  header.addEventListener("click", () => {
    const card = header.closest(".rule-card");
    const content = card.querySelector(".rule-content");
    const opening = !card.classList.contains("open");

    card.classList.toggle("open", opening);
    content.style.maxHeight = opening ? `${content.scrollHeight}px` : "0px";
  });
});

const ruleTabs = [...document.querySelectorAll(".rule-tab")];
const ruleCards = [...document.querySelectorAll(".rule-card")];
const ruleSearch = document.getElementById("ruleSearch");
const noRules = document.getElementById("noRules");
let activeCategory = "all";

function filterRules() {
  const search = ruleSearch.value.trim().toLowerCase();
  let visibleCount = 0;

  ruleCards.forEach(card => {
    const matchesCategory =
      activeCategory === "all" || card.dataset.category === activeCategory;
    const matchesSearch = card.textContent.toLowerCase().includes(search);
    const visible = matchesCategory && matchesSearch;

    card.hidden = !visible;
    if (visible) visibleCount++;
  });

  noRules.style.display = visibleCount === 0 ? "block" : "none";
}

ruleTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    ruleTabs.forEach(item => item.classList.remove("active"));
    tab.classList.add("active");
    activeCategory = tab.dataset.category;
    filterRules();
  });
});

ruleSearch.addEventListener("input", filterRules);

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach(element => {
  revealObserver.observe(element);
});

const sections = [...document.querySelectorAll("main section[id]")];
const sectionObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      }
    });
  },
  { rootMargin: "-35% 0px -55% 0px" }
);

sections.forEach(section => sectionObserver.observe(section));

window.addEventListener("scroll", () => {
  backToTop.classList.toggle("visible", window.scrollY > 650);
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.getElementById("year").textContent = new Date().getFullYear();
