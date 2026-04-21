/* ===========================
   script.js — Kushal Portfolio
=========================== */

// ── Navbar scroll effect ──────────────────────────────────
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
});

// ── Active nav link on scroll ─────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveLink() {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}
window.addEventListener('scroll', updateActiveLink, { passive: true });

// ── Hamburger menu ────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  const isOpen = navMenu.classList.contains('open');
  spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)' : '';
  spans[1].style.opacity   = isOpen ? '0' : '1';
  spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -5px)' : '';
});

// Close menu on link click
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navMenu.classList.remove('open'));
});

// ── Scroll reveal ─────────────────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay for siblings
        const siblings = entry.target.closest('.skills-grid, .projects-grid, .contact-grid, .about-grid, .timeline');
        const delay = siblings
          ? Array.from(siblings.children).indexOf(entry.target) * 80
          : 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Typing animation ──────────────────────────────────────
const phrases = [
  'ECE Engineer',
  'AI Developer',
  'Rapid Prototyper',
  'EEG Signal Researcher',
  'ML Systems Builder',
];

const typedEl = document.getElementById('typed-text');
let phraseIndex = 0;
let charIndex   = 0;
let isDeleting  = false;
let isPaused    = false;

function type() {
  if (!typedEl) return;

  const current = phrases[phraseIndex];

  if (!isDeleting) {
    typedEl.innerHTML = current.slice(0, charIndex + 1) + '<span class="cursor"></span>';
    charIndex++;
    if (charIndex === current.length) {
      isPaused = true;
      setTimeout(() => { isPaused = false; isDeleting = true; }, 2000);
    }
  } else {
    typedEl.innerHTML = current.slice(0, charIndex - 1) + '<span class="cursor"></span>';
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }

  if (!isPaused) {
    const speed = isDeleting ? 55 : 95;
    setTimeout(type, speed);
  } else {
    setTimeout(type, 2000);
  }
}

// Start typing after a short delay
setTimeout(type, 600);

// ── Smooth scroll for all anchor links ───────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── Skill tags hover glow ─────────────────────────────────
document.querySelectorAll('.skill-tags span').forEach(tag => {
  tag.addEventListener('mouseenter', () => {
    tag.style.borderColor = 'rgba(139,92,246,0.5)';
    tag.style.color = '#c4b5fd';
    tag.style.background = 'rgba(139,92,246,0.1)';
  });
  tag.addEventListener('mouseleave', () => {
    tag.style.borderColor = '';
    tag.style.color = '';
    tag.style.background = '';
  });
});

// ── Parallax orbs on mouse move (subtle) ──────────────────
const orb1 = document.querySelector('.orb-1');
const orb2 = document.querySelector('.orb-2');

document.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 30;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  if (orb1) orb1.style.transform = `translate(${x}px, ${y}px)`;
  if (orb2) orb2.style.transform = `translate(${-x * 0.6}px, ${-y * 0.6}px)`;
});

// ── Stats counter animation ───────────────────────────────
function animateCounter(el, target, duration = 1200) {
  let start = null;
  const isNum = !isNaN(target);
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    if (isNum) {
      el.textContent = Math.floor(eased * target) + '+';
    }
    if (progress < 1) requestAnimationFrame(step);
    else if (isNum) el.textContent = target + '+';
  };
  requestAnimationFrame(step);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nums = entry.target.querySelectorAll('.stat-num');
      nums.forEach(num => {
        const val = parseInt(num.textContent);
        if (!isNaN(val)) animateCounter(num, val);
      });
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statObserver.observe(heroStats);
