// Modern portfolio interactions:
// - Mobile nav toggle
// - Smooth scrolling with offset due to fixed nav
// - Typing effect
// - Scroll reveal (IntersectionObserver)
// - Animate progress bars when visible
// - Ripple effect on buttons
// - Parallax for particle elements
// - Simple contact form handling

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navBar = document.getElementById('navbar');
  const navLinkEls = document.querySelectorAll('.nav-link');
  const yearEl = document.getElementById('year');
  const particles = document.querySelectorAll('.particle');

  yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  navToggle?.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('open');
  });

  // Smooth scrolling with offset (account for fixed header)
  function scrollToHash(hash) {
    const el = document.querySelector(hash);
    if (!el) return;
    const headerOffset = navBar.offsetHeight + 12;
    const rect = el.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const target = rect.top + scrollTop - headerOffset;
    window.scrollTo({ top: target, behavior: 'smooth' });
  }

  navLinkEls.forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      navLinks.classList.remove('open');
      const href = a.getAttribute('href');
      if (href && href.startsWith('#')) scrollToHash(href);
    });
  });

  // Typing effect
  class Typer {
    constructor(el) {
      this.el = el;
      this.strings = JSON.parse(el.dataset.strings || '[]');
      this.loop = true;
      this.delay = 80;
      this.pause = 1600;
      this.index = 0;
      this.isDeleting = false;
      this.txt = '';
      this.tick();
    }
    tick() {
      const full = this.strings[this.index % this.strings.length] || '';
      if (this.isDeleting) {
        this.txt = full.substring(0, this.txt.length - 1);
      } else {
        this.txt = full.substring(0, this.txt.length + 1);
      }
      this.el.textContent = this.txt;
      let delta = this.delay + Math.random() * 100;
      if (this.isDeleting) delta /= 2;
      if (!this.isDeleting && this.txt === full) {
        delta = this.pause;
        this.isDeleting = true;
      } else if (this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        this.index++;
        delta = 400;
      }
      setTimeout(() => this.tick(), delta);
    }
  }

  document.querySelectorAll('.typed').forEach(el => new Typer(el));

  // Scroll reveal + progress bar animation
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // progress bars
        if (entry.target.matches('.progress') || entry.target.querySelector('.progress')) {
          const progressEls = entry.target.matches('.progress') ? [entry.target] : entry.target.querySelectorAll('.progress');
          progressEls.forEach(p => {
            const value = p.dataset.value || 70;
            const span = p.querySelector('span');
            span.style.width = value + '%';
          });
        }

        // skill cards: animate progress inside card
        if (entry.target.matches('.skill-card')) {
          const prog = entry.target.querySelector('.progress');
          if (prog) {
            const value = prog.dataset.value || 70;
            prog.querySelector('span').style.width = value + '%';
          }
        }
        // timeline and others handled by adding .visible
      }
    });
  }, { threshold: 0.14 });

  document.querySelectorAll('.reveal, .progress, .skill-card, .timeline-item').forEach(el => observer.observe(el));

  // Ripple effect for buttons with .ripple
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.ripple');
    if (!btn) return;
    const circle = document.createElement('span');
    circle.className = 'ripple-circle';
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    circle.style.width = circle.style.height = size + 'px';
    circle.style.left = (e.clientX - rect.left - size / 2) + 'px';
    circle.style.top = (e.clientY - rect.top - size / 2) + 'px';
    btn.appendChild(circle);
    setTimeout(() => circle.remove(), 650);
  });

  // Parallax for particles (mouse move + subtle on scroll)
  const pos = {x:0,y:0};
  window.addEventListener('mousemove', (e) => {
    pos.x = (e.clientX / window.innerWidth) - 0.5;
    pos.y = (e.clientY / window.innerHeight) - 0.5;
    particles.forEach((p, i) => {
      const depth = (i + 1) * 6;
      p.style.transform = `translate3d(${pos.x * depth}px, ${pos.y * depth}px, 0)`;
    });
  });

  // subtle parallax on scroll
  window.addEventListener('scroll', () => {
    const st = window.scrollY || window.pageYOffset;
    particles.forEach((p, i) => {
      const speed = (i + 1) * 0.05;
      p.style.transform = p.style.transform + ` translateY(${st * speed * -0.02}px)`;
    });
  }, { passive:true });

  // Contact form simple handler
  const form = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = data.get('name')?.toString().trim();
    const email = data.get('email')?.toString().trim();
    const message = data.get('message')?.toString().trim();
    if (!name || !email || !message) {
      formMessage.textContent = 'Mohon isi semua kolom.';
      return;
    }
    // Simulate sending
    formMessage.textContent = 'Mengirim...';
    setTimeout(() => {
      formMessage.textContent = 'Pesan terkirim! Terima kasih.';
      form.reset();
    }, 900);
  });

  // Close mobile nav when clicking outside
  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
      navLinks.classList.remove('open');
    }
  });

  // Ensure hash navigation from load uses offset
  if (location.hash) {
    setTimeout(() => scrollToHash(location.hash), 300);
  }
});