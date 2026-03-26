

"use strict";


const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];


const yearEl = $("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();


const header = $("#header");

const onHeaderScroll = () => {
  header.classList.toggle("scrolled", window.scrollY > 48);
  updateActiveLink();
};

window.addEventListener("scroll", onHeaderScroll, { passive: true });


const progressBar = $("#progress-bar");

const updateProgress = () => {
  const scrollTop  = document.documentElement.scrollTop;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const pct = scrollable > 0 ? (scrollTop / scrollable) * 100 : 0;
  if (progressBar) progressBar.style.width = pct + "%";
};

window.addEventListener("scroll", updateProgress, { passive: true });


const navLinks = $$(".nav__link");
const sections = $$("section[id]");

function updateActiveLink() {
  const scrollY = window.scrollY + header.offsetHeight + 40;
  let current  = "";

  sections.forEach((sec) => {
    if (scrollY >= sec.offsetTop) current = sec.id;
  });

  navLinks.forEach((link) => {
    const matches = link.getAttribute("href") === "#" + current;
    link.classList.toggle("is-active", matches);
  });
}


$$('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const target = $(anchor.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    const offset = header.offsetHeight + 24;
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  });
});


const burger = $("#burger");
const nav    = $("#nav");

function openMenu() {
  burger.classList.add("is-open");
  nav.classList.add("is-open");
  document.body.style.overflow = "hidden";
  burger.setAttribute("aria-expanded", "true");
  burger.setAttribute("aria-label", "Fermer le menu");
}

function closeMenu() {
  burger.classList.remove("is-open");
  nav.classList.remove("is-open");
  document.body.style.overflow = "";
  burger.setAttribute("aria-expanded", "false");
  burger.setAttribute("aria-label", "Ouvrir le menu");
}

burger.addEventListener("click", () => {
  nav.classList.contains("is-open") ? closeMenu() : openMenu();
});


navLinks.forEach((link) => link.addEventListener("click", closeMenu));


document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && nav.classList.contains("is-open")) closeMenu();
});


document.addEventListener("click", (e) => {
  if (nav.classList.contains("is-open") &&
      !nav.contains(e.target) &&
      e.target !== burger &&
      !burger.contains(e.target)) {
    closeMenu();
  }
});


const themeToggle = $("#theme-toggle");
const html        = document.documentElement;


const savedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const initTheme  = savedTheme || (prefersDark ? "dark" : "light");
html.setAttribute("data-theme", initTheme);

themeToggle.addEventListener("click", () => {
  const isDark  = html.getAttribute("data-theme") === "dark";
  const newTheme = isDark ? "light" : "dark";
  html.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
});


const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target); // une seule fois
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -56px 0px" }
);


$$(".reveal").forEach((el) => revealObserver.observe(el));


$$(".skills").forEach((el) => revealObserver.observe(el));




$$(".card__visual").forEach((visual) => {
  const style = visual.getAttribute("style") || "";
  const match = style.match(/background:#([0-9a-fA-F]{3,6})/);
  if (match) {
    visual.style.backgroundColor = "#" + match[1];
  }
});


const contactForm = $("#contact-form");
const submitBtn   = $("#submit-btn");

if (contactForm && submitBtn) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();


    const original    = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Envoi en cours…";

    setTimeout(() => {
      submitBtn.textContent = "Message envoyé ✓";
      submitBtn.style.opacity = ".7";

      setTimeout(() => {
        submitBtn.textContent = original;
        submitBtn.style.opacity = "";
        submitBtn.disabled = false;
        contactForm.reset();
      }, 3000);
    }, 1200);
  });
}


window.addEventListener("DOMContentLoaded", () => {
  onHeaderScroll();
  updateProgress();
});
