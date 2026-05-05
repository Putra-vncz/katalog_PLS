// ============================================
// E-KATALOG PLS UNPATTI — Public Page JS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  initMobileMenu();
  initSmoothScroll();
  renderDynamicContent();
});

window.addEventListener('ekatalog_data_updated', () => {
  renderDynamicContent();
});

// === NAVBAR ===
function initNavbar() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;

  const onScroll = () => {
    if (window.scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Active link tracking
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar__link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.navbar__link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  sections.forEach(s => observer.observe(s));
}

// === SCROLL ANIMATIONS ===
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

// === MOBILE MENU ===
function initMobileMenu() {
  const hamburger = document.querySelector('.navbar__hamburger');
  const links = document.querySelector('.navbar__links');
  if (!hamburger || !links) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    links.classList.toggle('open');
    document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
  });

  // Close on link click
  links.querySelectorAll('.navbar__link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      links.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// === SMOOTH SCROLL ===
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// === RENDER DYNAMIC CONTENT ===
function renderDynamicContent() {
  const data = Storage.get();

  // Check maintenance mode
  if (data.settings && data.settings.maintenanceMode) {
    document.body.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;background:var(--color-primary);color:#fff;text-align:center;font-family:var(--font-body);padding:2rem;">
        <div>
          <h1 style="font-family:var(--font-heading);font-size:2.5rem;margin-bottom:1rem;">🔧 Sedang Dalam Pemeliharaan</h1>
          <p style="opacity:0.7;font-size:1.1rem;">E-Katalog PLS UNPATTI sedang diperbarui. Silakan kembali beberapa saat lagi.</p>
        </div>
      </div>`;
    return;
  }

  renderHero(data);
  renderKataPengantar(data);
  renderKarier(data);
  renderAlumni(data);
  renderPanduan(data);
  renderKontak(data);
}

function renderHero(data) {
  const el = document.getElementById('hero-title');
  const sub = document.getElementById('hero-subtitle');
  const badge = document.getElementById('hero-badge');
  if (el && data.hero) el.innerHTML = data.hero.title.replace('PLS', '<span>PLS</span>');
  if (sub && data.hero) sub.textContent = data.hero.subtitle;
  if (badge && data.hero) badge.textContent = data.hero.badge;
}

function renderKataPengantar(data) {
  const quote = document.getElementById('sambutan-quote');
  const name = document.getElementById('sambutan-author');
  const title = document.getElementById('sambutan-title');
  const image = document.getElementById('sambutan-image');
  
  if (quote && data.kataPengantar) quote.textContent = data.kataPengantar.quote;
  if (name && data.kataPengantar) name.textContent = data.kataPengantar.authorName;
  if (title && data.kataPengantar) title.textContent = data.kataPengantar.authorTitle;
  if (image && data.kataPengantar && data.kataPengantar.authorImage) {
    image.src = data.kataPengantar.authorImage;
    image.style.display = 'block';
  }
}

function renderKarier(data) {
  const grid = document.getElementById('karier-grid');
  if (!grid || !data.karierSectors) return;

  grid.innerHTML = data.karierSectors.map((sector, i) => `
    <div class="karier__card karier__card--${sector.theme} animate-on-scroll animate-delay-${i + 1}">
      <span class="karier__card-icon">${sector.icon}</span>
      <h4 class="karier__card-title">${sector.title}</h4>
      ${sector.jobs.map(job => `
        <div class="karier__job">
          <div class="karier__job-title">${job.title}</div>
          <div class="karier__job-desc">${job.desc}</div>
        </div>
      `).join('')}
      ${sector.jobs.some(j => j.institutions && j.institutions.length) ? `
        <div class="karier__institutions">
          ${[...new Set(sector.jobs.flatMap(j => j.institutions || []))].map(inst =>
            `<span class="karier__inst-badge">${inst}</span>`
          ).join('')}
        </div>
      ` : ''}
    </div>
  `).join('');

  // Re-observe new elements
  initScrollAnimations();
}

function renderAlumni(data) {
  const grid = document.getElementById('alumni-grid');
  if (!grid || !data.alumni) return;

  grid.innerHTML = data.alumni.map((alum, i) => `
    <div class="alumni__card animate-on-scroll animate-delay-${i + 1}">
      <div class="alumni__photo-wrap">
        ${alum.photo
          ? `<img class="alumni__photo" src="${alum.photo}" alt="${alum.name}">`
          : `<div class="alumni__photo" style="display:flex;align-items:center;justify-content:center;background:var(--color-bg-primary);color:var(--color-primary);font-size:2rem;font-weight:700;">${alum.name.charAt(0)}</div>`
        }
      </div>
      <h4 class="alumni__name">${alum.name}</h4>
      <span class="alumni__year">Lulus ${alum.year}</span>
      <div class="alumni__job">
        <strong>${alum.job}</strong>
        ${alum.institution}
      </div>
      <div class="alumni__quote">${alum.quote}</div>
      ${alum.linkedin && alum.linkedin !== '#' ? `
        <a href="${alum.linkedin}" target="_blank" class="alumni__linkedin">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/></svg>
          LinkedIn
        </a>
      ` : ''}
    </div>
  `).join('');

  initScrollAnimations();
}

function renderPanduan(data) {
  const container = document.getElementById('panduan-steps');
  if (!container || !data.panduanKarier) return;

  container.innerHTML = data.panduanKarier
    .filter(s => s.visible !== false)
    .map((step, i) => `
      <div class="panduan__step animate-on-scroll animate-delay-${i + 1}">
        <div class="panduan__step-header">
          <div class="panduan__step-number">${step.step}</div>
          <div class="panduan__step-title-wrap">
            <span class="panduan__step-icon">${step.icon}</span>
            <h4 class="panduan__step-title">${step.title}</h4>
          </div>
        </div>
        <p class="panduan__step-desc">${step.desc}</p>
        <div class="panduan__checklist">
          ${step.checklist.map(item => `
            <div class="panduan__check-item">${item}</div>
          `).join('')}
        </div>
      </div>
    `).join('');

  initScrollAnimations();
}

function renderKontak(data) {
  const k = data.kontak;
  if (!k) return;

  const el = (id) => document.getElementById(id);
  if (el('kontak-address')) el('kontak-address').textContent = k.address;
  if (el('kontak-email')) {
    el('kontak-email').textContent = k.email;
    el('kontak-email').href = `mailto:${k.email}`;
  }
  if (el('kontak-ig')) el('kontak-ig').textContent = k.instagram;
  if (el('kontak-web')) {
    el('kontak-web').textContent = k.website;
    el('kontak-web').href = k.website;
  }

  // Generate QR code
  const qrContainer = document.getElementById('qr-code');
  if (qrContainer && k.qrUrl && typeof QRCode !== 'undefined') {
    qrContainer.innerHTML = '';
    new QRCode(qrContainer, {
      text: k.qrUrl,
      width: 160,
      height: 160,
      colorDark: '#0A2463',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.M,
    });
  }
}
