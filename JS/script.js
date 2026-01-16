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
          // Set CSS custom property for animation
          el.style.setProperty('--target-width', target);
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

// Initialize particles background
document.addEventListener('DOMContentLoaded', function() {
  if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
      particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: "#ffffff" },
        shape: { type: "circle" },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#ffffff",
          opacity: 0.4,
          width: 1
        },
        move: {
          enable: true,
          speed: 2,
          direction: "none",
          random: true,
          straight: false,
          out_mode: "out",
          bounce: false
        }
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "repulse" },
          onclick: { enable: true, mode: "push" },
          resize: true
        }
      }
    });
  }
  
  // Form submission handler
  const contactForm = document.getElementById('contactForm');
  const successMessage = document.getElementById('successMessage');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Simulate form submission
      setTimeout(function() {
        contactForm.style.display = 'none';
        successMessage.style.display = 'block';
      }, 1000);
    });
  }
});