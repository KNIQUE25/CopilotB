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





// Contact Form
function initContactForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('formMessage');
    
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Show loading state
        submitBtn.disabled = true;
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin me-2"></i>Sending...';
        
        // Get form data
        const formData = {
            timestamp: new Date().toLocaleString(),
            name: form.querySelector('[name="name"]').value,
            email: form.querySelector('[name="email"]').value,
            subject: form.querySelector('[name="subject"]').value,
            message: form.querySelector('[name="message"]').value,
            status: 'new'
        };
        
        try {
            const SHEETDB_URL = 'https://sheetdb.io/api/v1/cdbxrn9dh2asa';
            
            const response = await fetch(SHEETDB_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: [formData] })
            });
            
            const result = await response.json();
            
            if (response.ok) {
                showMessage('success', 'Thank you! Your message has been sent.');
                form.reset();
            } else {
                throw new Error('Submission failed');
            }
            
        } catch (error) {
            console.error('Error:', error);
            showMessage('error', 'Something went wrong. Please try again or email me directly.');
            
            // Fallback: mailto link
            const mailtoLink = `mailto:kimothobridgette@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=Name: ${encodeURIComponent(formData.name)}%0AEmail: ${encodeURIComponent(formData.email)}%0A%0A${encodeURIComponent(formData.message)}`;
            
            if (confirm('Would you like to send via email instead?')) {
                window.location.href = mailtoLink;
            }
            
        } finally {
            // Restore button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });
}

// Helper function to show messages
function showMessage(type, text) {
    const msgDiv = document.getElementById('formMessage');
    if (!msgDiv) return;
    
    msgDiv.className = `text-center p-4 rounded ${type === 'success' ? 'bg-success text-white' : 'bg-danger text-white'}`;
    msgDiv.innerHTML = `<h4>${type === 'success' ? '✓' : '✗'}</h4><p>${text}</p>`;
    msgDiv.style.display = 'block';
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        msgDiv.style.display = 'none';
    }, 5000);
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

