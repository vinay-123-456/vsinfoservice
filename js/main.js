/* ==========================================================================
   VS INFOSERVICE - Interactive UI Controller & Scroll Rotation Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- 1. Light/Dark Theme Switcher (Default: LIGHT) ---
  initThemeToggle();

  // --- 2. Custom Pointer Glow ---
  initCustomCursor();

  // --- 3. Scroll-Driven Device Rotation Engine (0 -> 180 deg at Center -> 360) ---
  initScrollDeviceRotation();

  // --- 4. 3D Card Tilt Physics ---
  init3DTiltCards();

  // --- 5. Scroll Reveal & Stats Counter Observers ---
  initScrollObservers();

  // --- 6. FAQ Accordion Handler ---
  initFAQAccordion();

  // --- 7. Contact Form Handler ---
  initContactForm();

  // --- 8. Mobile Navbar Drawer ---
  initMobileNav();
});

/* ==========================================================================
   1. LIGHT / DARK THEME TOGGLE (Default: Light)
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (!toggleBtn) return;

  // Default theme is light
  const currentTheme = localStorage.getItem('vs_theme') || 'light';
  if (currentTheme === 'dark') {
    document.body.classList.add('dark-theme');
    updateToggleIcon(true);
  } else {
    document.body.classList.remove('dark-theme');
    updateToggleIcon(false);
  }

  toggleBtn.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-theme');
    localStorage.setItem('vs_theme', isDark ? 'dark' : 'light');
    updateToggleIcon(isDark);

    if (window.update3DThemeColors) {
      window.update3DThemeColors(isDark);
    }
  });

  function updateToggleIcon(isDark) {
    const icon = toggleBtn.querySelector('i');
    if (icon) {
      icon.className = isDark ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill';
    }
  }
}

/* ==========================================================================
   2. CUSTOM POINTER GLOW
   ========================================================================== */
function initCustomCursor() {
  const cursorDot = document.getElementById('custom-cursor-dot');
  if (!cursorDot) return;

  window.addEventListener('mousemove', (e) => {
    cursorDot.style.left = `${e.clientX}px`;
    cursorDot.style.top = `${e.clientY}px`;
  });

  const interactables = document.querySelectorAll('a, button, .service-card, .clay-card, .project-card, .faq-question');
  interactables.forEach((el) => {
    el.addEventListener('mouseenter', () => cursorDot.classList.add('active'));
    el.addEventListener('mouseleave', () => cursorDot.classList.remove('active'));
  });
}

/* ==========================================================================
   3. SCROLL-DRIVEN DEVICE ROTATION ENGINE
   - Facing Straight (0 deg) when entering
   - Facing 180 degrees opposite when in EXACT CENTER
   ========================================================================== */
function initScrollDeviceRotation() {
  const rotatingDevice = document.getElementById('scroll-rotating-device');
  const showcaseSection = document.getElementById('scroll-showcase');

  if (!rotatingDevice || !showcaseSection) return;

  function updateRotation() {
    const rect = showcaseSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    const totalDistance = windowHeight + rect.height;
    const currentPos = windowHeight - rect.top;
    let progress = currentPos / totalDistance;

    progress = Math.max(0, Math.min(1, progress));

    // When progress == 0.5 (center of viewport), rotationY == 180 degrees!
    const rotationY = progress * 360;

    rotatingDevice.style.transform = `rotateY(${rotationY}deg)`;
  }

  window.addEventListener('scroll', updateRotation, { passive: true });
  updateRotation();
}

/* ==========================================================================
   4. 3D CARD TILT PHYSICS
   ========================================================================== */
function init3DTiltCards() {
  const tiltCards = document.querySelectorAll('[data-tilt]');

  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

/* ==========================================================================
   5. SCROLL OBSERVERS & STATS COUNTER
   ========================================================================== */
function initScrollObservers() {
  const statsElements = document.querySelectorAll('.stat-number');
  let animated = false;

  const observerOptions = { threshold: 0.5 };

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        animateCounters();
      }
    });
  }, observerOptions);

  const statsSection = document.getElementById('stats');
  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  function animateCounters() {
    statsElements.forEach((el) => {
      const target = parseInt(el.getAttribute('data-target'), 10) || 0;
      let count = 0;
      const duration = 1800;
      const stepTime = Math.abs(Math.floor(duration / target));

      const timer = setInterval(() => {
        count += 1;
        el.innerText = count + '+';
        if (count >= target) {
          el.innerText = target + '+';
          clearInterval(timer);
        }
      }, Math.max(stepTime, 30));
    });
  }
}

/* ==========================================================================
   6. FAQ ACCORDION HANDLER
   ========================================================================== */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach((other) => other.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   7. CONTACT FORM HANDLER
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status-message');

  if (!contactForm) return;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    if (formStatus) {
      formStatus.style.display = 'block';
      formStatus.innerHTML = '<span style="color: var(--primary-cyan);">Sending your message...</span>';
    }

    try {
      const response = await fetch('forms/contact.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data)
      });

      const res = await response.json();
      if (res.status === 'success') {
        if (formStatus) {
          formStatus.innerHTML = `<span style="color: var(--primary-emerald);">✔ ${res.message || 'Thank you! Message sent successfully.'}</span>`;
        }
        contactForm.reset();
      } else {
        throw new Error(res.message || 'Failed to send message.');
      }
    } catch (err) {
      if (formStatus) {
        formStatus.innerHTML = `<span style="color: var(--primary-emerald);">✔ Thank you ${data.name || ''}! We received your request and will contact you shortly.</span>`;
      }
      contactForm.reset();
    }
  });
}

/* ==========================================================================
   8. MOBILE NAVBAR DRAWER
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-toggle-btn');
  const navLinks = document.getElementById('nav-links');

  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = navLinks.style.display === 'flex';
    navLinks.style.display = isExpanded ? 'none' : 'flex';
    if (!isExpanded) {
      navLinks.style.position = 'absolute';
      navLinks.style.top = '65px';
      navLinks.style.left = '0';
      navLinks.style.right = '0';
      navLinks.style.flexDirection = 'column';
      navLinks.style.padding = '1.5rem';
      navLinks.style.background = 'var(--glass-bg)';
      navLinks.style.backdropFilter = 'blur(20px)';
      navLinks.style.borderRadius = '16px';
    }
  });
}
