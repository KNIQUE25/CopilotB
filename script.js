(function () {
  'use strict';

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---------- 1. THEME ---------- */
  const themeToggle = $('#themeToggle');
  const syncThemeButton = () => {
    if (!themeToggle) return;
    themeToggle.textContent = document.documentElement.classList.contains('dark') ? '☀' : '☾';
  };
  syncThemeButton();
  themeToggle && themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    try { localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light'); } catch (e) {}
    syncThemeButton();
  });

  /* ---------- 2. MOBILE NAV ---------- */
  const menuToggle = $('#menuToggle');
  const mobileMenu = $('#mobileMenu');
  const closeMobileMenu = () => {
    if (!mobileMenu || !menuToggle) return;
    mobileMenu.classList.add('hidden');
    menuToggle.setAttribute('aria-expanded', 'false');
  };
  menuToggle && menuToggle.addEventListener('click', () => {
    const isHidden = mobileMenu.classList.toggle('hidden');
    menuToggle.setAttribute('aria-expanded', String(!isHidden));
  });
  $$('#mobileMenu a').forEach(a => a.addEventListener('click', closeMobileMenu));
  window.addEventListener('resize', () => { if (window.innerWidth >= 1024) closeMobileMenu(); });

  /* ---------- 3. SCROLL PROGRESS ---------- */
  const scrollProgress = $('#scrollProgress');
  let scrollScheduled = false;
  const updateProgress = () => {
    if (!scrollProgress) return;
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    scrollProgress.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
    scrollScheduled = false;
  };
  window.addEventListener('scroll', () => {
    if (!scrollScheduled) { scrollScheduled = true; requestAnimationFrame(updateProgress); }
  }, { passive: true });
  updateProgress();

  /* ---------- 4. REVEAL ---------- */
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  $$('.reveal').forEach(el => revealObserver.observe(el));

  /* ---------- 5. SKILL FILTERS ---------- */
  const skillFilters = $$('.skill-filter');
  const skillCards   = $$('.skill-card');
  skillFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.cat;
      skillFilters.forEach(b => {
        b.classList.remove('active', 'bg-violet-600', 'text-white');
        b.classList.add('border', 'border-slate-300', 'dark:border-slate-600');
      });
      btn.classList.add('active', 'bg-violet-600', 'text-white');
      btn.classList.remove('border', 'border-slate-300', 'dark:border-slate-600');
      skillCards.forEach(card => {
        const show = cat === 'all' || card.dataset.cat === cat;
        card.style.display = show ? '' : 'none';
        if (show) {
          card.classList.remove('visible');
          requestAnimationFrame(() => card.classList.add('visible'));
        }
      });
    });
  });

  /* ---------- 6. PROJECT FILTERS ---------- */
  const filterButtons = $$('.filter-btn');
  const projectCards  = $$('.project-card');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filterButtons.forEach(b => {
        b.classList.remove('bg-violet-600', 'text-white');
        b.classList.add('border', 'border-slate-300', 'dark:border-slate-700');
      });
      button.classList.add('bg-violet-600', 'text-white');
      button.classList.remove('border', 'border-slate-300', 'dark:border-slate-700');
      projectCards.forEach(card => {
        const show = filter === 'all' || card.dataset.status === filter;
        card.classList.toggle('hidden', !show);
      });
    });
  });

  /* ---------- 7. CONTACT FORM (Brevo API) ---------- */
  const contactForm = $('#contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault(); 
      if (!contactForm.reportValidity()) return;

      const data = new FormData(contactForm);
      const payload = {
        name: data.get('name').toString().trim(),
        email: data.get('email').toString().trim(),
        message: data.get('message').toString().trim(),
      };

      if (!payload.name || !payload.email || !payload.message) return;

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending...';

      try {
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const success = $('#contactSuccess');
          if (success) {
            success.classList.add('show');
            clearTimeout(success._hideTimer);
            success._hideTimer = setTimeout(() => {
              success.classList.remove('show');
            }, 8000);
          }
          contactForm.reset(); 
        } else {
          let errorDetails = 'Unknown error';
          try {
            const errorData = await response.json();
            errorDetails = errorData.error || errorData.message || JSON.stringify(errorData);
          } catch (err) {
            errorDetails = await response.text();
          }
          console.error('Server Rejected Request:', errorDetails);
          alert('Sorry, we couldn\'t send your message right now. Please try again later or email me directly at kimothobridgette@gmail.com.');
        }
      } catch (error) {
        console.error('Network Error:', error);
        alert('Network error. Please check your connection and try again.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

  /* ---------- 8. MISC ---------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Alert only on true placeholder links (href="#")
  $$('[data-placeholder-link]').forEach(link => {
    const href = (link.getAttribute('href') || '').trim();
    if (href === '' || href === '#' || href === 'javascript:void(0)') {
      link.addEventListener('click', e => {
        e.preventDefault();
        alert('This link is a placeholder. Update it with your real URL in the HTML.');
      });
    }
  });

  /* ---------- 9. ACTIVE NAV ---------- */
  const sections = $$('main section[id]');
  const navLinks = $$('.nav-link');
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link =>
        link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id)
      );
    });
  }, { rootMargin: '-35% 0px -55% 0px' });
  sections.forEach(s => sectionObserver.observe(s));

  /* ---------- 10. TYPING ANIMATION ---------- */
  const nameEl = $('#typedName');
  if (nameEl) {
    const fullName = nameEl.textContent.trim() || 'Bridgette Kimotho';
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      nameEl.textContent = fullName;
    } else {
      nameEl.textContent = '';
      let i = 0;
      const typeNext = () => {
        if (i >= fullName.length) return;
        nameEl.textContent += fullName.charAt(i);
        i++;
        setTimeout(typeNext, 70 + Math.random() * 60);
      };
      setTimeout(typeNext, 400);
    }
  }

})();