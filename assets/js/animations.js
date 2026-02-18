var globalDarkSamsung = false; 

(function() {
  if (window.__detectSamsungForcedDarkRun) return;
  window.__detectSamsungForcedDarkRun = true;

  const ua = navigator.userAgent || '';
  const isSamsung = /SamsungBrowser/i.test(ua);
  const forceTest = new URLSearchParams(location.search).get('samsung_forced_test') === '1';
  if (!isSamsung && !forceTest) return; 

  const svgData = 'data:image/svg+xml;base64,' +
    btoa('<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"><rect width="1" height="1" fill="white"/></svg>');

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = function() {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, 1, 1).data; 
      const [r,g,b,a] = data;
      const isWhite = (r >= 250 && g >= 250 && b >= 250);
      const isDark = !isWhite;
      const forcedDark = isDark;

      if (forcedDark) {
        globalDarkSamsung = true;
        document.documentElement.classList.add('samsung-forced-dark');
        try{
            alert('O seu navegador aplicou um modo escuro automático que pode alterar as cores do site. Para ver o visual original, desative o modo escuro do Samsung Internet nas configurações ou mude de navegador.');
        } catch (err){
            alert(err.message);
        }
      }
    } catch (err) {}
  };
  img.onerror = function() {};
  img.src = svgData;
})();

function showSamsungBanner() {
  try {
    if (document.querySelector('.samsung-banner')) return;
    if (localStorage.getItem('samsung_forced_dark_dismissed') === '1') return;

    if (!document.body) {
      document.addEventListener('DOMContentLoaded', showSamsungBanner, { once: true });
      return;
    }

    const banner = document.createElement('div');
    banner.className = 'samsung-banner';
    banner.setAttribute('role', 'status');
    banner.innerHTML = `
      <div class="sb-text">
        O seu navegador aplicou um modo escuro automático que pode alterar as cores do site.
        Para ver o visual original, desative o modo escuro do Samsung Internet nas configurações.
      </div>
      <div class="sb-actions">
        <button class="sb-btn sb-dismiss">Entendi</button>
        <button class="sb-link sb-help">Como desativar</button>
      </div>
    `;
    document.body.appendChild(banner);

    banner.querySelector('.sb-dismiss').addEventListener('click', () => {
      localStorage.setItem('samsung_forced_dark_dismissed', '1');
      banner.remove();
    });
    banner.querySelector('.sb-help').addEventListener('click', () => {
      window.open('https://help.samsung.com/', '_blank', 'noopener');
    });

    banner.style.position = 'fixed';
    banner.style.bottom = '16px';
    banner.style.left = '16px';
    banner.style.zIndex = '99999';
    banner.style.background = '#222';
    banner.style.color = '#fff';
    banner.style.padding = '12px 16px';
    banner.style.borderRadius = '8px';
    banner.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';

    setTimeout(() => { if (document.body.contains(banner)) banner.remove(); }, 12000);
  } catch (err) {
    console.error('showSamsungBanner error:', err);
  }
}

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", init);

function init() {
  // Chamadas protegidas: Só executa se o elemento principal da função existir na página
  if(document.querySelector('.stats')) initCounters();
  if(document.getElementById('radarChart')) initRadarChart();
  if(document.querySelector('.testimonial-track')) initCarousel();
  initGSAPReveal(); 
  if(document.querySelector('.testimonial-item')) initSparkles();
  if(document.querySelector('.hero')) initFloatingButtons();
  if(document.querySelectorAll('.secao-split').length > 0) initKenBurns();
  if(document.getElementById('app-section')) initAppSection();
  initNavbar();
}

/* ================= COUNTERS ================= */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  const animateCounter = (el) => {
    const target = +el.dataset.target;
    const suffix = el.dataset.suffix || '';
    let start = 0;
    const duration = 2000;
    const startTime = performance.now();
    function update(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      el.textContent = Math.floor(progress * target) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  };
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      counters.forEach(animateCounter);
      obs.disconnect();
    }
  });
  obs.observe(document.querySelector('.stats'));
}

/* ================= RADAR CHART ================= */
function initRadarChart() {
  const ctx = document.getElementById('radarChart');
  if (!ctx) return;
  const dataFinal = [7, 9, 8, 8, 6];
  const getFontSize = () => window.innerWidth < 768 ? 10 : 14;
  const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const parseColorToRGB = (c) => {
    if (!c) return null;
    c = c.replace(/\s+/g, '');
    if (c.startsWith('rgba') || c.startsWith('rgb')) {
      const nums = c.match(/[\d.]+/g).map(Number);
      return { r: nums[0], g: nums[1], b: nums[2], a: nums[3] ?? 1 };
    }
    if (c[0] === '#') {
      let hex = c.slice(1);
      if (hex.length === 3) hex = hex.split('').map(h => h + h).join('');
      const int = parseInt(hex, 16);
      return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255, a: 1 };
    }
    return null;
  };
  const luminance = (rgb) => {
    if (!rgb) return 1;
    const srgb = [rgb.r, rgb.g, rgb.b].map(v => {
      v = v / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
  };

  function computeRadarColors() {
    const treatAsDark = globalDarkSamsung;
    if (treatAsDark) {
      return {
        radarGrid: 'rgba(255,255,255,0.08)', radarAngle: 'rgba(255,255,255,0.06)',
        radarLabel: '#FFFFFF', radarStroke: 'rgba(255,255,255,0.95)',
        radarFill: 'rgba(255,255,255,0.12)', radarPoint: '#FFFFFF', radarTick: 'rgba(255,255,255,0.06)'
      };
    }
    return {
      radarGrid: cssVar('--radar-grid') || 'rgba(0,0,0,0.06)',
      radarAngle: cssVar('--radar-angle-lines') || 'rgba(0,0,0,0.06)',
      radarLabel: cssVar('--radar-label') || '#1b1b1b',
      radarStroke: cssVar('--radar-stroke') || '#A57234',
      radarFill: cssVar('--radar-fill') || 'rgba(251,227,155,0.18)',
      radarPoint: cssVar('--radar-point') || '#A57234',
      radarTick: cssVar('--radar-tick') || 'rgba(0,0,0,0.06)'
    };
  }

  let colors = computeRadarColors();
  const chart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['UAN', 'Nutrição Clínica', 'Nutrição Estética', 'Nutrição Funcional', 'Nutrição Esportiva'],
      datasets: [{
        data: [0,0,0,0,0],
        borderColor: colors.radarStroke,
        backgroundColor: colors.radarFill,
        pointBackgroundColor: colors.radarPoint,
        pointBorderColor: colors.radarPoint,
        pointRadius: 4,
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      animation: { duration: 1800, easing: 'easeOutQuart' },
      plugins: { legend: { display: false } },
      scales: {
        r: { min: 0, max: 10, ticks: { display: false }, grid: { color: colors.radarGrid }, angleLines: { color: colors.radarAngle }, pointLabels: { color: colors.radarLabel, font: { size: getFontSize(), weight: 600 } } }
      }
    }
  });

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      chart.data.datasets[0].data = dataFinal;
      chart.update();
      obs.disconnect();
    }
  }, { threshold: 0.6 });
  const sec = document.getElementById('sec-habilidades');
  if (sec) obs.observe(sec);

  const htmlObserver = new MutationObserver(() => {
    const newColors = computeRadarColors();
    chart.data.datasets[0].borderColor = newColors.radarStroke;
    chart.data.datasets[0].backgroundColor = newColors.radarFill;
    chart.options.scales.r.grid.color = newColors.radarGrid;
    chart.options.scales.r.pointLabels.color = newColors.radarLabel;
    chart.update();
  });
  htmlObserver.observe(document.documentElement, { attributes: true });
}

/* ================= CAROUSEL ================= */
function initCarousel() {
  const track = document.querySelector('.testimonial-track');
  if (!track) return;
  track.innerHTML += track.innerHTML;
  let pos = 0;
  const speed = 0.3;
  let isPaused = false;
  let isDragging = false;
  let startX = 0;
  let lastX = 0;
  function loop() {
    if (!isPaused && !isDragging) {
      pos -= speed;
      if (Math.abs(pos) >= track.scrollWidth / 2) pos = 0;
      track.style.transform = `translate3d(${pos}px,0,0)`;
    }
    requestAnimationFrame(loop);
  }
  track.addEventListener('mouseenter', () => isPaused = true);
  track.addEventListener('mouseleave', () => isPaused = false);
  track.addEventListener('pointerdown', (e) => { isDragging = true; startX = e.clientX; lastX = pos; track.style.cursor = 'grabbing'; track.setPointerCapture(e.pointerId); });
  window.addEventListener('pointermove', (e) => { if (!isDragging) return; const dx = e.clientX - startX; pos = lastX + dx; track.style.transform = `translate3d(${pos}px,0,0)`; });
  window.addEventListener('pointerup', () => { isDragging = false; track.style.cursor = 'grab'; });
  loop();
}

/* ================= SPARKLES ================= */
function initSparkles() {
   const testimonials = document.querySelectorAll('.testimonial-item');

  testimonials.forEach(item => {
    for (let i = 0; i < 5; i++) {
      const sparkle = document.createElement('span');
      sparkle.classList.add('sparkle');
      
      sparkle.style.top = `${Math.random() * 90}%`;
      sparkle.style.left = `${Math.random() * 90}%`;
      const size = Math.random() * 6 + 4; // 4px a 10px
      sparkle.style.width = `${size}px`;
      sparkle.style.height = `${size}px`;
      sparkle.style.animationDelay = `${Math.random() * 3}s`;

      item.appendChild(sparkle); }
  });

  }

/* ================= FLOATING BUTTONS ================= */
function initFloatingButtons() {
  const hero = document.querySelector('.hero');
  const floatingBtn = document.querySelector('.floating-btn');
  const whatsappBtn = document.querySelector('.btn-whatsapp');
  if(!hero || !floatingBtn || !whatsappBtn) return;
  const observer = new IntersectionObserver(([entry]) => {
    const show = !entry.isIntersecting;
    floatingBtn.classList.toggle('show', show);
    whatsappBtn.classList.toggle('show', show);
  }, { threshold: 0.1 });
  observer.observe(hero);
}

/* ================= KEN BURNS ================= */
function initKenBurns() {
  const sections = document.querySelectorAll('.secao-split');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.intersectionRatio >= 0.25) entry.target.classList.add('animating');
      else {
        clearTimeout(entry.target._kbTimeout);
        entry.target._kbTimeout = setTimeout(() => { if (entry.intersectionRatio < 0.15) entry.target.classList.remove('animating'); }, 200);
      }
    });
  }, { rootMargin: '0px 0px -30% 0px', threshold: [0, 0.15, 0.25, 0.5, 0.75, 1] });
  sections.forEach(s => obs.observe(s));
}

/* ================= SEÇÃO APLICATIVO ================= */
function initAppSection() {
  const sessaoApp = document.getElementById('app-section');
  if (!sessaoApp) return;
  const observerApp = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
        sessaoApp.classList.add('revelar');
        observerApp.unobserve(sessaoApp);
      }
    });
  }, { threshold: [0.4] });
  observerApp.observe(sessaoApp);
}

/* ================= GSAP REVEAL ================= */
function initGSAPReveal() {
  gsap.utils.toArray('section:not(.hero):not(.mensagem-aplicativo)').forEach(section => {
    gsap.from(section, {
      y: 40, opacity: 0, duration: 0.8, ease: "power2.out",
      scrollTrigger: { trigger: section, start: "top 90%", toggleActions: "play none none reverse" }
    });
  });
}

/* ================= NAVBAR ================= */
function initNavbar() {
    const header = document.querySelector('header');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('nav.nav-links a.nav-button');
    if(!header || !hamburger || !navMenu) return;

    window.addEventListener('scroll', () => { header.classList.toggle('scrolled', window.scrollY > 50); });
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('open');
    });
    navLinks.forEach(link => { link.addEventListener('click', () => { navMenu.classList.remove('active'); hamburger.classList.remove('open'); }); });
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('open');
        }
    });
}