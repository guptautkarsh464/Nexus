// ── CURSOR ────────────────────────────────────────────────────────
const dot = document.getElementById("cursorDot"),
  ring = document.getElementById("cursorRing");
let mx = 0,
  my = 0,
  rx = 0,
  ry = 0;
document.addEventListener("mousemove", (e) => {
  mx = e.clientX;
  my = e.clientY;
  dot.style.left = mx + "px";
  dot.style.top = my + "px";
});
document
  .querySelectorAll("a,button,.service-item,.work-item,.testi-card")
  .forEach((el) => {
    el.addEventListener("mouseenter", () => ring.classList.add("grow"));
    el.addEventListener("mouseleave", () => ring.classList.remove("grow"));
  });
(function animRing() {
  rx += (mx - rx) * 0.1;
  ry += (my - ry) * 0.1;
  ring.style.left = rx + "px";
  ring.style.top = ry + "px";
  requestAnimationFrame(animRing);
})();

// ── NAV SCROLL ────────────────────────────────────────────────────
const nav = document.getElementById("navbar");
window.addEventListener("scroll", () =>
  nav.classList.toggle("scrolled", scrollY > 60),
);

// ── SPLIT TEXT — char by char ─────────────────────────────────────
function splitIntoChars(el, baseDelay = 0) {
  const text = el.textContent;
  el.innerHTML = "";
  const chars = [];
  [...text].forEach((ch, i) => {
    if (ch === " ") {
      const sp = document.createElement("span");
      sp.style.cssText = "display:inline-block;width:.26em";
      el.appendChild(sp);
      return;
    }
    const wrap = document.createElement("span");
    wrap.className = "char-wrap";
    const inner = document.createElement("span");
    inner.className = "char";
    inner.textContent = ch;
    inner.style.transitionDelay = baseDelay + i * 0.038 + "s";
    wrap.appendChild(inner);
    el.appendChild(wrap);
    chars.push(inner);
  });
  return chars;
}

// ── HERO TITLE ANIMATION ─────────────────────────────────────────
const heroLines = document.querySelectorAll(".hero-title .tline");
heroLines.forEach((line, li) => {
  // For glitch line, split only text nodes
  if (li === 2) {
    const glitchEl = line.querySelector(".glitch-el");
    if (glitchEl) {
      const chars = splitIntoChars(glitchEl, 0.7 + li * 0.2);
      glitchEl.dataset.g = glitchEl.textContent; // restore for glitch
      setTimeout(() => chars.forEach((c) => c.classList.add("in")), 80);
    }
  } else {
    const chars = splitIntoChars(line, 0.38 + li * 0.18);
    setTimeout(() => chars.forEach((c) => c.classList.add("in")), 80);
  }
});
setTimeout(() => document.getElementById("heroBadge").classList.add("in"), 150);
setTimeout(
  () => document.getElementById("heroBottom").classList.add("in"),
  1500,
);
setTimeout(
  () => document.getElementById("scrollHint").classList.add("in"),
  2000,
);

// ── PARALLAX SCROLL ───────────────────────────────────────────────
window.addEventListener("scroll", () => {
  const sy = scrollY;
  const ht = document.querySelector(".hero-title");
  if (ht) ht.style.transform = `translateY(${sy * 0.16}px)`;
  document.querySelector(".orb1").style.transform = `translateY(${sy * 0.1}px)`;
  document.querySelector(".orb2").style.transform =
    `translateY(${-sy * 0.07}px)`;
});

// ── COUNT UP ──────────────────────────────────────────────────────
function countUp(el, target, dur = 1600) {
  const sfx = el.querySelector("span").outerHTML;
  let start = null;
  (function step(ts) {
    if (!start) start = ts;
    const p = Math.min((ts - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.innerHTML = Math.round(ease * target) + sfx;
    if (p < 1) requestAnimationFrame(step);
    else el.classList.add("counted");
  })(performance.now());
}

// ── SCRAMBLE TEXT ─────────────────────────────────────────────────
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ&!@#$%";
function scramble(el, orig) {
  let iter = 0;
  const id = setInterval(() => {
    el.textContent = orig
      .split("")
      .map((ch, i) => {
        if (i < iter) return orig[i];
        if (ch === " ") return " ";
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      })
      .join("");
    iter += 0.55;
    if (iter > orig.length) {
      el.textContent = orig;
      clearInterval(id);
    }
  }, 26);
}
document.querySelectorAll(".service-item[data-scramble]").forEach((item) => {
  const nameEl = item.querySelector(".service-name");
  const orig = item.dataset.scramble;
  item.addEventListener("mouseenter", () => scramble(nameEl, orig));
});

// ── MAGNETIC BUTTONS ──────────────────────────────────────────────
document.querySelectorAll(".nav-cta,.btn-primary").forEach((btn) => {
  btn.addEventListener("mousemove", (e) => {
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.2;
    const y = (e.clientY - r.top - r.height / 2) * 0.2;
    btn.style.transform = `translate(${x}px,${y}px)`;
  });
  btn.addEventListener("mouseleave", () => (btn.style.transform = ""));
});

// ── TYPING CURSOR — CTA EMAIL ─────────────────────────────────────
const emailEl = document.getElementById("ctaEmail");
if (emailEl) {
  const orig = emailEl.textContent;
  let typed = false;
  new IntersectionObserver(
    (ents) => {
      if (ents[0].isIntersecting && !typed) {
        typed = true;
        emailEl.textContent = "";
        let i = 0;
        const t = setInterval(() => {
          emailEl.textContent = orig.slice(0, ++i);
          if (i >= orig.length) clearInterval(t);
        }, 44);
      }
    },
    { threshold: 0.5 },
  ).observe(emailEl);
}

// ── SECTION TITLE CHAR ANIM on scroll ────────────────────────────
function animTitleOnVisible(el) {
  const lines = el.querySelectorAll(".tline");
  lines.forEach((line, li) => {
    const isEm = line.querySelector("em");
    if (isEm) {
      const emEl = isEm;
      const chars = splitIntoChars(emEl, li * 0.15);
      const newEm = document.createElement("em");
      while (emEl.firstChild) newEm.appendChild(emEl.firstChild);
      emEl.replaceWith(newEm);
      setTimeout(() => chars.forEach((c) => c.classList.add("in")), 50);
    } else {
      const chars = splitIntoChars(line, li * 0.15);
      setTimeout(() => chars.forEach((c) => c.classList.add("in")), 50);
    }
  });
}

// Pre-wrap .tline spans for section titles
["servTitle", "workTitle", "aboutTitle", "testiTitle", "ctaTitle"].forEach(
  (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    // parse innerHTML lines, wrap each block in .tline
    const raw = el.innerHTML;
    const parts = raw.split(/<br\s*\/?>/i);
    el.innerHTML = parts
      .map(
        (p) =>
          `<span class="tline" style="display:block;overflow:hidden">${p}</span>`,
      )
      .join("");
  },
);

// ── MAIN INTERSECTION OBSERVER ────────────────────────────────────
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;

      if (el.classList.contains("reveal")) el.classList.add("visible");
      if (el.classList.contains("section-label")) el.classList.add("in");

      // section titles
      if (
        [
          "servTitle",
          "workTitle",
          "aboutTitle",
          "testiTitle",
          "ctaTitle",
        ].includes(el.id)
      ) {
        animTitleOnVisible(el);
      }

      // about list items
      if (el.tagName === "LI") el.classList.add("in");

      // counters
      if (el.dataset.target) countUp(el, +el.dataset.target);

      io.unobserve(el);
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
);

document
  .querySelectorAll(".reveal,.section-label")
  .forEach((el) => io.observe(el));
["servTitle", "workTitle", "aboutTitle", "testiTitle", "ctaTitle"].forEach(
  (id) => {
    const el = document.getElementById(id);
    if (el) io.observe(el);
  },
);
document.querySelectorAll(".about-list li").forEach((li, i) => {
  li.style.transitionDelay = i * 0.1 + "s";
  io.observe(li);
});
document.querySelectorAll("[data-target]").forEach((el) => io.observe(el));
