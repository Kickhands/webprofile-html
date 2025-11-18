const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Welcome overlay
const welcomeScreen = document.getElementById("welcome-screen");
const enterSiteBtn = document.getElementById("enter-site");
const backBtn = document.getElementById("welcome-back");

const closeWelcome = () => {
  if (!welcomeScreen || welcomeScreen.classList.contains("exit")) return;
  welcomeScreen.classList.add("exit");
  setTimeout(() => {
    welcomeScreen.classList.add("hidden");
    document.body.classList.remove("welcome-active");
    welcomeScreen.setAttribute("aria-hidden", "true");
    document.getElementById("home")?.scrollIntoView({ behavior: "smooth" });
  }, 900);
};

if (welcomeScreen) {
  requestAnimationFrame(() => {
    welcomeScreen.classList.add("visible");
    welcomeScreen.removeAttribute("aria-hidden");
  });

  enterSiteBtn?.addEventListener("click", () => {
    closeWelcome();
  });

  backBtn?.addEventListener("click", () => {
    backBtn.classList.add("vanish");
    backBtn.setAttribute("disabled", "true");
    setTimeout(() => backBtn.remove(), 400);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.body.classList.contains("welcome-active")) {
      closeWelcome();
    }
  });
}

// Intersection Observer reveal
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
  }
);

document.querySelectorAll(".reveal").forEach((section) => {
  revealObserver.observe(section);
});

// Chip entrance animation + hover activation
const chips = document.querySelectorAll(".chips span");
chips.forEach((chip, index) => {
  chip.style.setProperty("--delay", `${index * 90}ms`);
  requestAnimationFrame(() => {
    chip.classList.add("visible");
  });

  chip.addEventListener("mouseenter", () => chip.classList.add("active"));
  chip.addEventListener("mouseleave", () => chip.classList.remove("active"));
});

// Hero parallax on scroll
const heroContent = document.querySelector(".hero-content");
if (heroContent) {
  window.addEventListener("scroll", () => {
    const progress = Math.min(window.scrollY / 400, 1);
    heroContent.style.transform = `translateY(${progress * 15}px)`;
    heroContent.style.opacity = `${1 - progress * 0.2}`;
  });
}

// Theme toggle
const THEME_KEY = "ghf-theme-pref";
const themeToggle = document.getElementById("theme-toggle");
const prefersLight = typeof window.matchMedia === "function" ? window.matchMedia("(prefers-color-scheme: light)") : null;

const syncThemeToggle = () => {
  if (!themeToggle) return;
  const isLight = document.body.classList.contains("light");
  themeToggle.textContent = isLight ? "Dark mode" : "Light mode";
  themeToggle.setAttribute("aria-pressed", String(isLight));
};

const setTheme = (mode) => {
  document.body.classList.toggle("light", mode === "light");
  syncThemeToggle();
};

const savedTheme = localStorage.getItem(THEME_KEY);
if (savedTheme === "light" || savedTheme === "dark") {
  setTheme(savedTheme);
} else if (prefersLight?.matches) {
  setTheme("light");
} else {
  setTheme("dark");
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("light") ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem(THEME_KEY, nextTheme);
  });
}

if (prefersLight) {
  const handlePrefChange = (event) => {
    if (localStorage.getItem(THEME_KEY)) return;
    setTheme(event.matches ? "light" : "dark");
  };

  if (typeof prefersLight.addEventListener === "function") {
    prefersLight.addEventListener("change", handlePrefChange);
  } else if (typeof prefersLight.addListener === "function") {
    prefersLight.addListener(handlePrefChange);
  }
}

// Contact card tilt interaction
const contactCard = document.querySelector(".contact-card");
if (contactCard) {
  const dampen = 25;
  contactCard.addEventListener("pointermove", (event) => {
    const rect = contactCard.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x - rect.width / 2) / rect.width) * dampen;
    const rotateX = ((rect.height / 2 - y) / rect.height) * dampen;

    contactCard.style.setProperty("--ry", `${rotateY}deg`);
    contactCard.style.setProperty("--rx", `${rotateX}deg`);
    contactCard.style.setProperty("--mouse-x", `${(x / rect.width) * 100}%`);
    contactCard.style.setProperty("--mouse-y", `${(y / rect.height) * 100}%`);
    contactCard.style.setProperty("--glow-opacity", "0.35");
  });

  contactCard.addEventListener("pointerleave", () => {
    contactCard.style.setProperty("--ry", "0deg");
    contactCard.style.setProperty("--rx", "0deg");
    contactCard.style.setProperty("--glow-opacity", "0.15");
  });
}

// Contact form mailto handler
const contactForm = document.querySelector(".contact-card form");
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const name = (formData.get("name") || "Anonymous").toString().trim();
    const email = (formData.get("email") || "No email provided").toString().trim();
    const message = (formData.get("message") || "").toString().trim();

    const subject = encodeURIComponent(`New message from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email || "No email provided"}\n\n${message}`
    );

    const mailtoLink = `mailto:gigihhaidarfalah14@gmail.com?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
  });
}

// Cursor glow tracker
const glow = document.querySelector(".cursor-glow");
if (glow) {
  let glowX = window.innerWidth / 2;
  let glowY = window.innerHeight / 2;
  let targetX = glowX;
  let targetY = glowY;

  const animate = () => {
    glowX += (targetX - glowX) * 0.1;
    glowY += (targetY - glowY) * 0.1;
    glow.style.left = `${glowX}px`;
    glow.style.top = `${glowY}px`;
    requestAnimationFrame(animate);
  };
  animate();

  window.addEventListener("pointermove", (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    glow.style.opacity = "0.4";
  });

  window.addEventListener("pointerleave", () => {
    glow.style.opacity = "0";
  });
}

