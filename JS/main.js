AOS.init({ duration: 1000, once: true });

// Theme toggle (safe: only attach if the element exists)
const toggle = document.getElementById('themeToggle');
const html = document.documentElement;

function setThemeDark() {
  html.setAttribute('data-bs-theme', 'dark');
  if (toggle) toggle.innerHTML = '<i class="bx bx-sun"></i>';
  localStorage.setItem('theme', 'dark');
}

function setThemeLight() {
  html.setAttribute('data-bs-theme', 'light');
  if (toggle) toggle.innerHTML = '<i class="bx bxs-moon"></i>';
  localStorage.setItem('theme', 'light');
}

// Set initial theme from localStorage or OS preference
if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  setThemeDark();
} else {
  // If explicit light preference is set in storage, honor it
  if (localStorage.getItem('theme') === 'light') setThemeLight();
}

if (toggle) {
  toggle.addEventListener('click', () => {
    if (html.getAttribute('data-bs-theme') === 'dark') {
      setThemeLight();
    } else {
      setThemeDark();
    }
  });
}

// Animate progress bars when they come into view
const progressBars = document.querySelectorAll('.progress-fill');

// Helper to parse width - handles numbers like "95" or "95%"
function parseWidth(value) {
  if (!value) return '';
  value = String(value).trim();
  return value.endsWith('%') ? value : `${value}%`;
}

if (progressBars && progressBars.length) {
  const progressObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseWidth(el.dataset.width || el.getAttribute('data-width'));
        if (target) {
          // Use inline style so we can animate from 0 to value (CSS uses transition)
          el.style.width = target;
          el.classList.add('animated');
        }
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  progressBars.forEach(bar => {
    // ensure starting at 0 width
    bar.style.width = '0%';
    progressObserver.observe(bar);
  });
}