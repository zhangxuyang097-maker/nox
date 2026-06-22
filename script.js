/* ════════════════════════════════════════
   nox相机 — interactions (v2)
   ════════════════════════════════════════ */

(() => {
  'use strict';

  // ── 1. scroll reveal ────────────────────
  const revealTargets = document.querySelectorAll(
    '.section-header, .film-strip, .film-grid, .pipeline, .stats-row, ' +
    '.ai-demo, .ai-flow, .ai-cards, .feel-grid, .timeline, .links-grid, ' +
    '.comparison, .faq-list, .cta, .footer'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '-40px 0px' });

  revealTargets.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 40, 320)}ms`;
    revealObserver.observe(el);
  });

  // ── 2. film strip pause + duplicate ─────
  const strip = document.querySelector('.strip-track');
  const stripContainer = document.querySelector('.film-strip');
  if (strip && stripContainer) {
    stripContainer.addEventListener('mouseenter', () => {
      strip.style.animationPlayState = 'paused';
    });
    stripContainer.addEventListener('mouseleave', () => {
      strip.style.animationPlayState = 'running';
    });
    // duplicate ticker for seamless loop
    strip.insertAdjacentHTML('beforeend', strip.innerHTML);
  }

  // ── 3. film switcher (interactive) ───────
  const filmPills = document.querySelectorAll('.film-pill');
  const filmImg = document.getElementById('film-img');
  const filmTag = document.getElementById('film-tag');
  if (filmPills.length && filmImg && filmTag) {
    filmPills.forEach(pill => {
      pill.addEventListener('click', () => {
        // skip if already active
        if (pill.classList.contains('active')) return;

        // update active state
        filmPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        // crossfade image
        const imgPath = pill.dataset.img;
        if (imgPath) {
          filmImg.style.opacity = '0';
          setTimeout(() => {
            filmImg.src = imgPath;
            filmImg.style.opacity = '1';
          }, 180);
        }

        // update tag
        const tag = pill.dataset.tag;
        if (tag) {
          filmTag.style.opacity = '0';
          setTimeout(() => {
            filmTag.textContent = tag;
            filmTag.style.opacity = '1';
          }, 180);
        }
      });
    });
    // ensure transition is set
    filmImg.style.transition = 'opacity .25s ease';
    filmTag.style.transition = 'opacity .25s ease';
  }

  // ── 4. stat counter animation ────────────
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

  // ── 5. hero parallax ────────────────────
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
      const offset = 64;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ── 7. fade in on load ───────────────────
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity .5s ease';
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  }));

  // ── 8. nav scroll state + floating CTA ───
  const nav = document.getElementById('nav');
  const floatingCTA = document.getElementById('floating-cta');
  const onScroll = () => {
    const y = window.scrollY;
    if (nav) nav.classList.toggle('scrolled', y > 24);
    if (floatingCTA) {
      // show after scrolling past hero (~600px), hide near footer
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const nearFooter = docHeight - y < 200;
      floatingCTA.classList.toggle('show', y > 500 && !nearFooter);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── 9. nav active link on scroll ─────────
  const navLinks = document.querySelectorAll('.nav-links a[data-link]');
  const sectionsForNav = ['films', 'engine', 'ai', 'roadmap', 'price']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  if (sectionsForNav.length && navLinks.length) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const id = e.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.link === id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sectionsForNav.forEach(s => navObserver.observe(s));
  }

  // ── 10. close <details> when another opens (single-open FAQ) ──
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach(other => {
          if (other !== item && other.open) other.open = false;
        });
      }
    });
  });

})();
