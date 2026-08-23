/* ==========================================================================
   VS INFOSERVICE - Interactive Controllers & UI Physics
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  initCustomCursor();
  initServiceRingClickHandlers();
  initNavSmoothScroll();
});

/* --- Custom Cursor Follow Dot --- */
function initCustomCursor() {
  const dot = document.getElementById('custom-cursor-dot');
  if (!dot) return;

  let mouseX = 0, mouseY = 0;
  let dotX = 0, dotY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  function animateCursor() {
    dotX += (mouseX - dotX) * 0.2;
    dotY += (mouseY - dotY) * 0.2;
    dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;
    requestAnimationFrame(animateCursor);
  }

  animateCursor();
}

/* --- Section 10 Interactive 3D Service Ring Buttons --- */
function initServiceRingClickHandlers() {
  const cards = document.querySelectorAll('.service-ring-card');
  if (!cards.length) return;

  cards.forEach((card, idx) => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      if (typeof window.rotateServiceRingTo === 'function') {
        window.rotateServiceRingTo(idx);
      }
    });
  });
}

/* --- Navigation Smooth Scroll --- */
function initNavSmoothScroll() {
  const links = document.querySelectorAll('.nav-item-link');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}
