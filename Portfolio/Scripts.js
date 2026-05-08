const text = "Aspiring Software Engineer | DSA Enthusiast";
const typingEl = document.getElementById("typing");
const submitBtn = document.getElementById("submitBtn");
const form = document.querySelector("form");
const navLinks = document.getElementById("navLinks");
const menuToggle = document.getElementById("menuToggle");
const topBtn = document.getElementById("backToTop");
const themeToggle = document.getElementById("themeToggle");

const projectSearch = document.getElementById("projectSearch");
const techFilter = document.getElementById("techFilter");
const projectCards = document.querySelectorAll(".project-card");

const toggleAchievementsBtn = document.getElementById("toggleAchievementsBtn");
const toggleCertificationsBtn = document.getElementById("toggleCertificationsBtn");
const achievementMoreItems = document.querySelectorAll("#achievements .more-item");
const certificationMoreItems = document.querySelectorAll("#certifications .more-item");

const counters = document.querySelectorAll(".counter");
const achievementItems = document.querySelectorAll(".achievement-item");
const certItems = document.querySelectorAll(".cert-item");
const achievementCounter = document.getElementById("achievementCounter");
const certCounter = document.getElementById("certCounter");

let i = 0;
function typeEffect() {
  if (!typingEl) return;
  if (i < text.length) {
    typingEl.innerHTML += text.charAt(i);
    i++;
    setTimeout(typeEffect, 50);
  }
}
typeEffect();

if (submitBtn && form) {
  submitBtn.addEventListener("click", function (e) {
    if (!form.checkValidity()) return;
    e.preventDefault();
    submitBtn.classList.add("success");
    submitBtn.innerText = "Submitted ✅";
    setTimeout(() => {
      submitBtn.classList.remove("success");
      submitBtn.innerText = "Send Message";
      form.submit();
    }, 1200);
  });
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
}

const setTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  const icon = themeToggle?.querySelector("i");
  if (icon) {
    icon.className = theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }
  localStorage.setItem("theme", theme);
};

const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  setTheme(savedTheme);
} else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  setTheme("dark");
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    setTheme(current === "dark" ? "light" : "dark");
  });
}

// Auto-update counters from current cards
if (achievementCounter) {
  achievementCounter.dataset.target = String(achievementItems.length);
}
if (certCounter) {
  certCounter.dataset.target = String(certItems.length);
}

const sections = document.querySelectorAll("section");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("show");
    });
  },
  { threshold: 0.15 }
);
sections.forEach((section) => observer.observe(section));

const countAnimation = (counter) => {
  const target = Number(counter.dataset.target || 0);
  const step = Math.max(1, Math.floor(target / 40));
  let value = 0;

  const run = () => {
    value += step;
    if (value >= target) {
      counter.textContent = String(target);
      return;
    }
    counter.textContent = String(value);
    requestAnimationFrame(run);
  };

  run();
};

const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      countAnimation(entry.target);
      statObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.5 }
);
counters.forEach((counter) => statObserver.observe(counter));

const navAnchors = document.querySelectorAll(".nav-links a");
window.addEventListener("scroll", () => {
  const fromTop = window.scrollY + 120;

  sections.forEach((section) => {
    if (
      fromTop >= section.offsetTop &&
      fromTop < section.offsetTop + section.offsetHeight
    ) {
      navAnchors.forEach((link) => link.classList.remove("active"));
      const activeLink = document.querySelector(`.nav-links a[href="#${section.id}"]`);
      if (activeLink) activeLink.classList.add("active");
    }
  });

  if (window.scrollY > 300) topBtn?.classList.add("show");
  else topBtn?.classList.remove("show");
});

if (topBtn) {
  topBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

const setupShowMore = (button, items, moreText, lessText) => {
  if (!button || !items.length) return;
  let expanded = false;
  button.addEventListener("click", () => {
    expanded = !expanded;
    items.forEach((item) => item.classList.toggle("hidden-item", !expanded));
    button.textContent = expanded ? lessText : moreText;
  });
};

setupShowMore(
  toggleAchievementsBtn,
  achievementMoreItems,
  "Show More Achievements",
  "Show Less Achievements"
);

setupShowMore(
  toggleCertificationsBtn,
  certificationMoreItems,
  "Show More Certifications",
  "Show Less Certifications"
);

const filterProjects = () => {
  const query = (projectSearch?.value || "").toLowerCase().trim();
  const tech = techFilter?.value || "all";

  projectCards.forEach((card) => {
    const title = card.querySelector("h3")?.textContent.toLowerCase() || "";
    const description = card.querySelector("p")?.textContent.toLowerCase() || "";
    const tags = (card.getAttribute("data-tech") || "").toLowerCase();

    const searchMatch =
      title.includes(query) || description.includes(query) || tags.includes(query);
    const techMatch = tech === "all" || tags.includes(tech);

    card.classList.toggle("hidden-project", !(searchMatch && techMatch));
  });
};
//for menu bar navigation 
const navItems = document.querySelectorAll("#navLinks a");
navItems.forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
  });
});
projectSearch?.addEventListener("input", filterProjects);
techFilter?.addEventListener("change", filterProjects);