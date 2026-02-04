// Initialize AOS animations
AOS.init({ 
    duration: 1000, 
    once: true,
    offset: 100 
});

// Theme toggle
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

function setTheme(theme) {
    html.setAttribute('data-bs-theme', theme);
    if (themeToggle) {
        themeToggle.innerHTML = theme === 'dark' 
            ? '<i class="bx bx-sun"></i>' 
            : '<i class="bx bxs-moon"></i>';
    }
    localStorage.setItem('theme', theme);
}

function initTheme() {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initial = saved || (prefersDark ? 'dark' : 'light');
    setTheme(initial);
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const current = html.getAttribute('data-bs-theme') || 'light';
        setTheme(current === 'dark' ? 'light' : 'dark');
    });
}

// Progress bars — reliable animation
function initProgressBars() {
    const bars = document.querySelectorAll('.progress-fill');
    if (!bars.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const w = bar.dataset.width || '0';
                
                bar.style.width = '0%';
                bar.offsetHeight; // force reflow
                
                setTimeout(() => {
                    bar.style.width = w + '%';
                    bar.classList.add('animated');
                }, 150);

                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });

    bars.forEach(bar => observer.observe(bar));
}

// Particles — safer load + fallback
function initParticles() {
    const container = document.getElementById('particles-js');
    if (!container) return;

    if (typeof particlesJS === 'undefined') {
        console.warn('particles.js not loaded — retrying...');
        setTimeout(initParticles, 600);
        return;
    }

    particlesJS('particles-js', {
        particles: {
            number: { value: 60, density: { enable: true, value_area: 800 } },
            color: { value: '#ffffff' },
            shape: { type: 'circle' },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: '#ffffff', opacity: 0.4, width: 1 },
            move: { enable: true, speed: 2, direction: 'none', random: true, straight: false, out_mode: 'out', bounce: false }
        },
        interactivity: {
            detect_on: 'canvas',
            events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' }, resize: true }
        },
        retina_detect: true
    });
}

// Contact form (fake submission → success)
function initContactForm() {
    const form = document.getElementById('contactForm');
    const success = document.getElementById('successMessage');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        form.style.opacity = '0.4';
        form.style.pointerEvents = 'none';

        setTimeout(() => {
            form.reset();
            form.style.display = 'none';
            success.style.display = 'block';

            setTimeout(() => {
                success.style.display = 'none';
                form.style.display = 'block';
                form.style.opacity = '1';
                form.style.pointerEvents = 'auto';
            }, 5500);
        }, 1400);
    });
}

// Smooth scroll + active nav
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 90,   // adjusted for navbar
                    behavior: 'smooth'
                });

                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                anchor.classList.add('active');
            }
        });
    });
}

// Scroll spy for active link
window.addEventListener('scroll', () => {
    const pos = window.scrollY + 140; // offset for navbar + buffer

    document.querySelectorAll('section[id]').forEach(sec => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        const id = sec.getAttribute('id');

        if (pos >= top && pos < top + height) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Start everything
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initProgressBars();
    initParticles();
    initContactForm();
    initSmoothScroll();
});