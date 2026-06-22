/* ═══════════════════════════
   nox相机 — interactions
   ═══════════════════════════ */

(() => {
  'use strict';

  // ── 1. scroll reveal ────────────────────
  const sections = document.querySelectorAll(
    '.section-header, .film-strip, .film-grid, .pipeline, .stats-row, .ai-flow, .ai-cards, .feel-grid, .timeline, .links-grid, .pricing, .cta, .footer'
  );
  sections.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '-40px 0px' });

  sections.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 50, 400)}ms`;
    observer.observe(el);
  });

  // ── 2. film strip pause on hover ──────────
  const strip = document.querySelector('.strip-track');
  const stripContainer = document.querySelector('.film-strip');
  if (strip && stripContainer) {
    stripContainer.addEventListener('mouseenter', () => { strip.style.animationPlayState = 'paused'; });
    stripContainer.addEventListener('mouseleave', () => { strip.style.animationPlayState = 'running'; });
  }

  // ── 3. duplicate ticker for seamless loop ──
  const track = document.querySelector('.strip-track');
  if (track) {
    track.insertAdjacentHTML('beforeend', track.innerHTML);
  }

  // ── 4. stat counter animation ─────────────
  const statEls = document.querySelectorAll('[data-count]');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const target = parseInt(e.target.dataset.count, 10);
      if (isNaN(target)) return;
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 40));
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        e.target.textContent = current;
      }, 25);
      countObserver.unobserve(e.target);
    });
  }, { threshold: 0.5 });
  statEls.forEach(el => countObserver.observe(el));

  // ── 5. hero parallax ─────────────────────
  const heroImg = document.querySelector('.hero-bg img');
  if (heroImg) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        heroImg.style.transform = `translateY(${y * 0.15}px) scale(1.05)`;
      }
    }, { passive: true });
  }

  // ── 6. smooth scroll for anchor links ────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (ev) => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      ev.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ── 7. fade in on load ───────────────────
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity .5s ease';
  requestAnimationFrame(() => requestAnimationFrame(() => { document.body.style.opacity = '1'; }));

})();
