// NAV toggle (mobile)
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if(navToggle){
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('open');
  });
}

// Smooth scroll for anchor links
document.querySelectorAll('a.nav-link, a.brand, a.btn').forEach(a=>{
  a.addEventListener('click', (e)=>{
    const href = a.getAttribute('href');
    if(!href || !href.startsWith('#')) return;
    e.preventDefault();
    const target = document.querySelector(href);
    if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
  });
});

// Reveal on scroll
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting) entry.target.classList.add('active');
  });
},{threshold:0.12});
reveals.forEach(r=>revealObserver.observe(r));

// Animate progress bars when visible
const progressBars = document.querySelectorAll('.progress');
const progressObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      const val = entry.target.getAttribute('data-value') || 80;
      entry.target.querySelector('span').style.width = val + '%';
      progressObserver.unobserve(entry.target);
    }
  });
},{threshold:0.25});
progressBars.forEach(p=>progressObserver.observe(p));

// Simple typed effect (for small strings)
const typedEl = document.querySelector('.typed');
if(typedEl){
  const data = typedEl.dataset.strings;
  let strings = [];
  try{ strings = JSON.parse(data) }catch{ strings = [typedEl.textContent] }
  let i=0, j=0, cur='';
  const tick = () => {
    if(!strings.length) return;
    const full = strings[i];
    cur = full.slice(0, ++j);
    typedEl.textContent = cur;
    if(j === full.length){
      setTimeout(()=>{ j=0; i=(i+1)%strings.length; }, 1800);
    }
    setTimeout(tick, j===0 ? 200 : 80);
  };
  tick();
}

// Set copyright year
const yearEl = document.getElementById('year');
if(yearEl) yearEl.textContent = new Date().getFullYear();

// Simple contact form client-side feedback (no backend)
const form = document.getElementById('contactForm');
if(form){
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const m = document.getElementById('formMessage');
    m.textContent = 'Terima kasih! Pesan dikirim (simulasi).';
    m.style.color = '#8ef3d1';
    form.reset();
    setTimeout(()=> m.textContent = '', 4000);
  });
}
