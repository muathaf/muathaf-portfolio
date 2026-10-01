/* ═══════════════════════════════════════════
   main.js — GSAP + Lenis + Splitting animations
   All animation logic lives here.
   Edit timings, easings, scroll offsets here.
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  const hasMouse = window.matchMedia('(pointer:fine)').matches;

  /* ────────────────────────────────────
     1. LENIS — smooth scroll
  ──────────────────────────────────── */
  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.25,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    const raf = time => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
    }
  }

  /* ────────────────────────────────────
     2. SPLITTING — char wrapping
  ──────────────────────────────────── */
  if (typeof Splitting !== 'undefined') Splitting();

  /* ────────────────────────────────────
     3. GSAP fallback if not loaded
  ──────────────────────────────────── */
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('visible'));
    document.querySelectorAll('.sec-divider').forEach(el => el.classList.add('go'));
    document.getElementById('eyebrow').style.opacity = '1';
    document.getElementById('hrule').classList.add('go');
    return;
  }
  if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

  /* ────────────────────────────────────
     4. HERO ENTRANCE
  ──────────────────────────────────── */
  const heroTL = gsap.timeline({ delay: 0.05 });

  // Eyebrow line + text
  heroTL
    .to('#eyebrow',  { opacity: 1, duration: 0.01 })
    .to('#eyeline',  { width: '2.5rem', duration: 0.55, ease: 'power3.out' }, '-=0.01');

  // Name — chars clip up
  const nameChars = Array.from(document.querySelectorAll('.hero-name .char'));
  if (nameChars.length) {
    gsap.set(nameChars, { yPercent: 115, opacity: 0 });
    heroTL.to(nameChars, {
      yPercent: 0, opacity: 1,
      duration: 1, stagger: 0.04, ease: 'power4.out',
    }, '-=0.35');
  }

  // Rule draws across
  heroTL.add(() => document.getElementById('hrule')?.classList.add('go'), '-=0.5');

  // Bottom content slides up
  heroTL.from('.hero-bottom > div', {
    y: 24, opacity: 0, duration: 0.75, stagger: 0.14, ease: 'power3.out',
  }, '-=0.55');

  /* ────────────────────────────────────
     5. SECTION TITLE REVEALS (scroll)
  ──────────────────────────────────── */
  if (typeof ScrollTrigger !== 'undefined') {
    document.querySelectorAll('.sec-head').forEach(head => {
      const titleChars = Array.from(head.querySelectorAll('.sec-title .char'));
      const divider    = head.querySelector('.sec-divider');
      const tag        = head.querySelector('.sec-tag');

      if (titleChars.length) gsap.set(titleChars, { yPercent: 110, opacity: 0 });
      if (tag) gsap.set(tag, { opacity: 0, x: -10 });

      ScrollTrigger.create({
        trigger: head,
        start: 'top 86%',
        once: true,
        onEnter() {
          const st = gsap.timeline();
          if (tag)              st.to(tag,        { opacity: 1, x: 0, duration: 0.45, ease: 'power3.out' });
          if (titleChars.length) st.to(titleChars, { yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.045, ease: 'power4.out' }, '-=0.25');
          if (divider)           divider.classList.add('go');
        },
      });
    });

    /* ────────────────────────────────────
       6. GENERIC SCROLL REVEALS
    ──────────────────────────────────── */
    document.querySelectorAll('[data-reveal]').forEach((el, i) => {
      const isLeft = el.getAttribute('data-reveal') === 'left';
      gsap.set(el, { opacity: 0, x: isLeft ? -28 : 0, y: isLeft ? 0 : 32 });
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter() {
          gsap.to(el, {
            opacity: 1, x: 0, y: 0,
            duration: 0.8, delay: (i % 5) * 0.07, ease: 'power3.out',
          });
        },
      });
    });

    /* ────────────────────────────────────
       7. PROJECT RADIAL MOUSE GLOW
    ──────────────────────────────────── */
    document.querySelectorAll('.pj').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - r.left)  / r.width  * 100).toFixed(1) + '%');
        card.style.setProperty('--my', ((e.clientY - r.top)   / r.height * 100).toFixed(1) + '%');
      });
    });
  }

  /* ────────────────────────────────────
     8. CUSTOM CURSOR
  ──────────────────────────────────── */
  if (hasMouse) {
    const dot  = document.getElementById('c-dot');
    const ring = document.getElementById('c-ring');
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      gsap.set(dot, { x: mx, y: my });
    }, { passive: true });

    (function lagRing() {
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      gsap.set(ring, { x: rx, y: ry });
      requestAnimationFrame(lagRing);
    })();

    const hoverEls = document.querySelectorAll('a, button, .edu-item, .pj, .sk, .cc, .hs, .tl');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cur-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cur-hover'));
    });
    document.addEventListener('mousedown', () => document.body.classList.add('cur-click'));
    document.addEventListener('mouseup',   () => document.body.classList.remove('cur-click'));
  }

  /* ────────────────────────────────────
     9. NAV — shrink on scroll + active
  ──────────────────────────────────── */
  const nav   = document.getElementById('nav');
  const links = document.querySelectorAll('.nav-links a');
  const secs  = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
    let cur = '';
    secs.forEach(s => { if (window.scrollY >= s.offsetTop - 400) cur = s.id; });
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
  }, { passive: true });

  /* ────────────────────────────────────
     10. SMOOTH ANCHOR SCROLL
  ──────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (!t) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(t, { offset: -80, duration: 1.5 });
      else window.scrollTo({ top: t.offsetTop - 80, behavior: 'smooth' });
    });
  });
});
