// ─── Scroll reveal ────────────────────────────────────────────────────────────
const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            obs.unobserve(entry.target);
        }
    });
}, { rootMargin: '0px', threshold: 0.12 });

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.section-reveal').forEach(el => observer.observe(el));

    // ─── Smooth scrolling ────────────────────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });

            // Close mobile menu on link click
            mobileMenu.classList.remove('open');
        });
    });

    // ─── Hamburger menu ──────────────────────────────────────────────────────
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    hamburger?.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
    });

    // ─── Load projects from API ───────────────────────────────────────────────
    loadProjects();

    // ─── Contact form (real API call) ─────────────────────────────────────────
    const contactForm = document.getElementById('contactForm');
    const submitBtn   = document.getElementById('submitBtn');
    const formStatus  = document.getElementById('formStatus');

    contactForm?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name    = contactForm.name.value.trim();
        const email   = contactForm.email.value.trim();
        const message = contactForm.message.value.trim();

        if (!name || !email || !message) {
            setStatus('Please fill in all fields.', 'error');
            return;
        }

        submitBtn.disabled    = true;
        submitBtn.textContent = 'Sending…';
        setStatus('', '');

        try {
            const res  = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message })
            });
            const data = await res.json();

            if (data.success) {
                setStatus(data.message, 'success');
                contactForm.reset();
            } else {
                setStatus(data.message || 'Something went wrong.', 'error');
            }
        } catch {
            setStatus('Network error. Please try again.', 'error');
        } finally {
            submitBtn.disabled    = false;
            submitBtn.textContent = 'Send Message';
        }
    });

    function setStatus(text, type) {
        formStatus.textContent = text;
        formStatus.className   = `form-status ${type}`;
    }
});

// ─── Fetch & render projects ──────────────────────────────────────────────────
async function loadProjects() {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;

    try {
        const res      = await fetch('/api/projects');
        const projects = await res.json();

        grid.innerHTML = projects.map(p => `
            <div class="project-card glass-card">
                <h3>${escHtml(p.title)}</h3>
                <p>${escHtml(p.description)}</p>
                <div class="project-tags">
                    ${(p.tags || []).map(t => `<span class="project-tag">${escHtml(t)}</span>`).join('')}
                </div>
                <a href="${escHtml(p.link)}" class="btn secondary-btn">Learn More</a>
                ${p.link && p.link !== '#' ? `<div class="project-link-display">${escHtml(p.link)}</div>` : ''}
            </div>
        `).join('');
    } catch {
        grid.innerHTML = '<p class="loading-spinner">Could not load projects.</p>';
    }
}

function escHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// ─── Certificate modal viewer ────────────────────────────────────────────────
function initCertificateModal() {
    const modal = document.getElementById('certificateModal');
    const modalImg = document.getElementById('certificateModalImage');
    const modalCaption = document.getElementById('certificateModalCaption');
    const modalClose = document.getElementById('certificateModalClose');

    if (!modal || !modalImg || !modalCaption || !modalClose) return;

    document.querySelectorAll('.certificate-item').forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const label = item.querySelector('.certificate-label')?.textContent || 'Certificate';

            if (!img) return;

            modalImg.src = img.src;
            modalImg.alt = label;
            modalCaption.textContent = label;
            modal.classList.add('open');
            modal.style.display = 'block';
            modal.setAttribute('aria-hidden', 'false');
        });
    });

    function closeModal() {
        modal.style.display = 'none';
        modal.removeAttribute('aria-hidden');
    }

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
}

// Initialize certificate modal after DOM is ready
document.addEventListener('DOMContentLoaded', initCertificateModal);
