/* =============================================
   Jim Thiele for School Board – main.js
   ============================================= */

// ── Countdown ──────────────────────────────────
function updateCountdown() {
  const election = new Date('2026-05-19T00:00:00');
  const now = new Date();
  const diff = election - now;
  if (diff <= 0) {
    const el = document.getElementById('daysRemaining');
    if (el) el.textContent = 'TODAY';
    return;
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const el = document.getElementById('daysRemaining');
  if (el) el.textContent = days;
}
updateCountdown();


// ── Navbar scroll behavior ─────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  // Back to top button
  const btn = document.getElementById('backToTop');
  if (btn) {
    btn.classList.toggle('visible', window.scrollY > 400);
  }
}, { passive: true });

// ── Mobile nav toggle ──────────────────────────
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.classList.toggle('active');
});

// Close nav on link click (mobile)
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
  });
});

// ── Smooth scroll ──────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navHeight = navbar.offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── Scroll reveal (IntersectionObserver) ───────
const fadeEls = document.querySelectorAll('.fade-in');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  fadeEls.forEach(el => observer.observe(el));
} else {
  fadeEls.forEach(el => el.classList.add('visible'));
}

// ── Back to top ────────────────────────────────
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ── Contact form — AJAX submission ─────────────
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const status = document.getElementById('formStatus');
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled = true;
    try {
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        contactForm.reset();
        status.textContent = 'Message sent — Jim will be in touch soon. Thank you!';
        status.style.color = '#c9a44a';
        btn.textContent = 'Send Message';
        btn.disabled = false;
      } else {
        throw new Error('Server error');
      }
    } catch {
      status.textContent = 'Something went wrong. Please email jim@thiele4schoolboard.com directly.';
      status.style.color = '#cc2a3f';
      btn.textContent = 'Send Message';
      btn.disabled = false;
    }
  });
}

// ── Active nav link on scroll ──────────────────
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

function setActiveNav() {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - navbar.offsetHeight - 40;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  navAnchors.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + current) {
      a.classList.add('active');
    }
  });
}
window.addEventListener('scroll', setActiveNav, { passive: true });
