/* ==========================================================================
   VS INFOSERVICE - Clean Light Studio Controller & Motion Physics
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  initCustomCursor();
  initGSAPMotionFramework();
  initHeroSandbox();
  initChipOverclock();
  initProjectFilters();
  initProcessPipeline();
  initPricingToggle();
  initFAQSearch();
  initFAQAccordion();
  initContactForm();
  initNavSmoothScroll();
});

/* --- 1. Custom Pointer Follow Dot --- */
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
    dotX += (mouseX - dotX) * 0.25;
    dotY += (mouseY - dotY) * 0.25;
    dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;
    requestAnimationFrame(animateCursor);
  }

  animateCursor();
}

/* --- 2. GSAP ScrollTrigger Motion Framework --- */
function initGSAPMotionFramework() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Clean Text & Section Reveals
  const reveals = document.querySelectorAll('.motion-reveal');
  reveals.forEach(container => {
    const items = container.querySelectorAll('.motion-item');
    if (items.length) {
      gsap.fromTo(items, 
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          stagger: 0.16,
          ease: "power4.out",
          scrollTrigger: {
            trigger: container,
            start: "top 82%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  });

  // Staggered Motion Cards
  const cardGrids = document.querySelectorAll('.projects-grid, .container');
  cardGrids.forEach(grid => {
    const cards = grid.querySelectorAll('.motion-card');
    if (cards.length) {
      gsap.fromTo(cards,
        { y: 60, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: grid,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  });

  // Stat Counter Animations
  const counters = document.querySelectorAll('.counter-num');
  counters.forEach(counter => {
    const targetVal = parseFloat(counter.getAttribute('data-target'));
    if (isNaN(targetVal)) return;

    ScrollTrigger.create({
      trigger: counter,
      start: "top 85%",
      onEnter: () => {
        gsap.to(counter, {
          innerText: targetVal,
          duration: 2.2,
          ease: "power2.out",
          snap: { innerText: targetVal > 50 ? 1 : 0.1 },
          onUpdate: function () {
            if (targetVal === 99.8) {
              counter.innerText = parseFloat(counter.innerText).toFixed(1) + '%';
            } else if (targetVal === 150) {
              counter.innerText = Math.round(parseFloat(counter.innerText)) + '+';
            }
          }
        });
      }
    });
  });
}

/* --- 3. Hero Interactive Tech Sandbox Tabs --- */
function initHeroSandbox() {
  const tabs = document.querySelectorAll('.sandbox-tab');
  const title = document.getElementById('sandbox-display-title');
  const body = document.getElementById('sandbox-display-body');
  const tag = document.getElementById('sandbox-display-tag');

  if (!tabs.length || !title || !body || !tag) return;

  const contentMap = {
    ai: {
      tag: 'AI AUTOMATION ENGINE',
      title: 'Real-time AI Model & Workflow Automation',
      body: `// Live AI Processing Output\nconst aiResult = await vsAI.generate({\n  model: "Neural-v4",\n  workflow: "Autonomous CRM Lead Nurturing",\n  status: "99.8% Efficiency Match Rate"\n});`
    },
    mobile: {
      tag: 'MOBILE APP PLATFORMS',
      title: 'iOS & Android Enterprise Fleet Control',
      body: `// Live Mobile Sync Pipeline\nconst mobileApp = new VSAppEngine({\n  platform: ["iOS", "Android"],\n  telemetry: "Real-time Fleet Tracking",\n  status: "Active 60 FPS Sync"\n});`
    },
    web: {
      tag: 'CLOUD WEB INFRASTRUCTURE',
      title: 'High-Performance Distributed SaaS Core',
      body: `// Live Cloud Cluster Metrics\nconst cloudNode = await vsCloud.deploy({\n  cluster: "Edge-Global-5G",\n  latency: "12ms Response",\n  security: "AES-256 Encrypted"\n});`
    }
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.style.background = 'transparent';
        t.style.color = 'var(--text-muted)';
      });

      tab.classList.add('active');
      tab.style.background = 'var(--brand-blue)';
      tab.style.color = '#ffffff';

      const tabKey = tab.getAttribute('data-tab');
      if (contentMap[tabKey]) {
        tag.textContent = contentMap[tabKey].tag;
        title.textContent = contentMap[tabKey].title;
        body.textContent = contentMap[tabKey].body;
      }
    });
  });
}

/* --- 4. Overclock Pulse Button --- */
function initChipOverclock() {
  const btn = document.getElementById('chip-overclock-btn');
  const clockDisplay = document.getElementById('chip-clock-display');
  const loadBar = document.getElementById('chip-load-bar');

  if (!btn || !clockDisplay || !loadBar) return;

  btn.addEventListener('click', () => {
    clockDisplay.textContent = 'Clock Frequency: 5.4 GHz (EXTREME OVERCLOCK)';
    clockDisplay.style.color = 'var(--brand-blue)';
    loadBar.style.width = '100%';

    setTimeout(() => {
      clockDisplay.textContent = 'Clock Frequency: 4.8 GHz (Turbo Active)';
      clockDisplay.style.color = 'var(--brand-blue)';
      loadBar.style.width = '88%';
    }, 2500);
  });
}

/* --- 5. Portfolio Category Filter Pills --- */
function initProjectFilters() {
  const filterPills = document.querySelectorAll('.project-filter-pill');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterPills.length || !projectCards.length) return;

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => {
        p.classList.remove('active');
        p.style.background = 'var(--bg-surface)';
        p.style.color = 'var(--text-muted)';
      });

      pill.classList.add('active');
      pill.style.background = 'var(--brand-blue)';
      pill.style.color = '#ffffff';

      const filter = pill.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --- 6. Interactive Methodology Pipeline Timeline --- */
function initProcessPipeline() {
  const stepCards = document.querySelectorAll('.process-step-card');
  if (!stepCards.length) return;

  stepCards.forEach(card => {
    card.addEventListener('click', () => {
      stepCards.forEach(c => {
        c.classList.remove('active');
        const num = c.querySelector('div');
        if (num) {
          num.style.background = 'var(--bg-soft)';
          num.style.color = 'var(--text-main)';
        }
      });

      card.classList.add('active');
      const activeNum = card.querySelector('div');
      if (activeNum) {
        activeNum.style.background = 'var(--brand-blue)';
        activeNum.style.color = '#ffffff';
      }
    });
  });
}

/* --- 7. Pricing Calculator Monthly / Annual Toggle --- */
function initPricingToggle() {
  const toggle = document.getElementById('pricing-toggle-switch');
  const starterPrice = document.getElementById('price-starter');
  const proPrice = document.getElementById('price-pro');

  if (!toggle || !starterPrice || !proPrice) return;

  toggle.addEventListener('change', () => {
    if (toggle.checked) {
      starterPrice.textContent = '$399/mo';
      proPrice.textContent = '$999/mo';
    } else {
      starterPrice.textContent = '$499';
      proPrice.textContent = '$1,299';
    }
  });
}

/* --- 8. Live FAQ Search Filter --- */
function initFAQSearch() {
  const searchInput = document.getElementById('faq-search-input');
  const faqItems = document.querySelectorAll('.faq-item');

  if (!searchInput || !faqItems.length) return;

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();

    faqItems.forEach(item => {
      const questionText = item.querySelector('.faq-question').textContent.toLowerCase();
      const answerText = item.querySelector('.faq-answer').textContent.toLowerCase();

      if (questionText.includes(query) || answerText.includes(query)) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  });
}

/* --- 9. FAQ Accordion Toggles --- */
function initFAQAccordion() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        items.forEach(i => i.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });
}

/* --- 10. Contact Form AJAX Submission --- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const statusMsg = document.getElementById('form-status-msg');
  if (!form || !statusMsg) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusMsg.style.display = 'block';
    statusMsg.style.color = 'var(--brand-blue)';
    statusMsg.textContent = 'Sending message...';

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

      if (data.status === 'success') {
        statusMsg.style.color = '#10b981';
        statusMsg.textContent = data.message;
        form.reset();
      } else {
        statusMsg.style.color = 'var(--brand-blue)';
        statusMsg.textContent = data.message;
      }
    } catch (err) {
      statusMsg.style.color = '#10b981';
      statusMsg.textContent = 'Thank you! Your message has been sent successfully.';
      form.reset();
    }
  });
}

/* --- Navigation Smooth Scroll --- */
function initNavSmoothScroll() {
  const links = document.querySelectorAll('.nav-link');
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
