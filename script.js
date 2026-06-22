/* ═══════════════════════════════════════
   nox相机 — interactions (B&W)
   ═══════════════════════════════════════ */

(() => {
  // ── 1. scroll-reveal ─────────────────────────
  const reveals = [
    ".section-head", ".film-strip", ".film-grid",
    ".pipeline", ".engine-stats",
    ".ai-flow", ".ai-modes",
    ".feel-grid", ".comp-demo", ".tiers",
    ".download", ".footer"
  ].flatMap(sel => Array.from(document.querySelectorAll(sel)));

  reveals.forEach(el => el.classList.add("reveal"));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });

  reveals.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 40, 400)}ms`;
    io.observe(el);
  });

  // ── 2. film strip — pause on hover ───────────
  const strip = document.querySelector(".strip-track");
  const stripContainer = document.querySelector(".film-strip");
  if (strip && stripContainer) {
    stripContainer.addEventListener("mouseenter", () => {
      strip.style.animationPlayState = "paused";
    });
    stripContainer.addEventListener("mouseleave", () => {
      strip.style.animationPlayState = "running";
    });
  }

  // ── 3. ticker — duplicate for seamless loop ─
  const ticker = document.querySelector(".ticker-track");
  if (ticker) {
    const clone = ticker.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    ticker.parentNode.appendChild(clone);
  }

  // ── 4. film tile hover ──────────────────────
  document.querySelectorAll(".film-tile").forEach(tile => {
    tile.addEventListener("mouseenter", () => {
      tile.style.boxShadow = "inset 0 0 0 1px rgba(0,0,0,0.2)";
    });
    tile.addEventListener("mouseleave", () => {
      tile.style.boxShadow = "none";
    });
  });

  // ── 5. parallax on hero image (subtle) ───────
  const heroImg = document.querySelector(".hero-image");
  if (heroImg) {
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        heroImg.style.transform = `translateY(${y * 0.08}px) scale(1.01)`;
      }
    }, { passive: true });
  }

  // ── 6. smooth-scroll for nav links ───────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", e => {
      const id = link.getAttribute("href");
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          const offset = 70;
          const y = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }
    });
  });

  // ── 7. fade in body on load ─────────────────
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.6s ease";
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.style.opacity = "1";
    });
  });
})();
