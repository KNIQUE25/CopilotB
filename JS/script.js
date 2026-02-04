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
    document.querySelectorAll('.progress-fill').forEach(bar => {
        const width = bar.dataset.width || '0';
        // small delay so it animates even on fast scroll
        setTimeout(() => {
            bar.style.width = width + '%';
        }, 300);
    });
}

function initParticles() {
    const container = document.getElementById('particles-js');
    if (!container) return;

    tsParticles.load("particles-js", {
        particles: {
            number: { value: 60, density: { enable: true, value_area: 800 } },
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 },
            move: { enable: true, speed: 2, direction: "none", random: true, straight: false, out_mode: "out", bounce: false }
        },
        interactivity: {
            detectsOn: "canvas",
            events: { onHover: { enable: true, mode: "repulse" }, onClick: { enable: true, mode: "push" }, resize: true }
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
// At the start of DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        initTheme();
        initProgressBars();
        initParticles();
        initContactForm();
        initSmoothScroll();
        
        // Initialize AOS if available
        if (typeof AOS !== 'undefined') {
            AOS.init({ 
                duration: 1000, 
                once: true,
                offset: 100 
            });
        }
    } catch (error) {
        console.error('Error initializing scripts:', error);
    }
});

// Check for missing elements in initProgressBars
function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    if (progressBars.length === 0) {
        console.warn('No progress bars found');
        return;
    }
    
    progressBars.forEach(bar => {
        const width = bar.dataset.width || '0';
        setTimeout(() => {
            bar.style.width = width + '%';
        }, 300);
    });
}