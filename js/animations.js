gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", init);

function init() {
  initCounters();
  initRadarChart();
  initCarousel();
  initGSAPReveal();
  initSparkles();
  initFloatingButtons();
  initKenBurns();
  initAppSection();
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

/* ================= RADAR ================= */
function initRadarChart() {
  const ctx = document.getElementById('radarChart');
  if (!ctx) return;

  const dataFinal = [7, 9, 8, 8, 6];

	// Detecta o tamanho da tela para definir a fonte inicial
  const getFontSize = () => {
    return window.innerWidth < 768 ? 8 : 14; // 10px para celular, 14px para desktop
  };
  
  const chart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: [
        'UAN',
        'Nutrição Clínica',
        'Nutrição Estética',
        'Nutrição Funcional',
        'Nutrição Esportiva'
      ],
      datasets: [{
        data: [0,0,0,0,0],
        borderColor: '#FBE39B',
        backgroundColor: 'rgba(251,227,155,0.2)',
        pointRadius: 4,
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      animation: { duration: 1800, easing: 'easeOutQuart' },
      plugins: { legend: { display: false } },
      scales: {
        r: {
          min: 0,
          max: 10,
          ticks: { display: false },
          grid: { color: 'rgba(251,227,155,0.2)' },
          angleLines: { color: 'rgba(251,227,155,0.2)' },
          pointLabels: { color: '#FBE39B', font: { size: getFontSize(), weight: 600 } }
        }
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

  obs.observe(document.getElementById('sec-habilidades'));
}

/* ================= CAROUSEL (SEM SALTO) ================= */
function initCarousel() {
  const track = document.querySelector('.testimonial-track');
  if (!track) return;

  const content = track.innerHTML;
  track.innerHTML += content;

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

  // Hover pausa
  track.addEventListener('mouseenter', () => isPaused = true);
  track.addEventListener('mouseleave', () => isPaused = false);

  // Touch / mouse drag
  track.addEventListener('pointerdown', (e) => {
    isDragging = true;
    startX = e.clientX;
    lastX = pos;
    track.style.cursor = 'grabbing';
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    pos = lastX + dx;
    track.style.transform = `translate3d(${pos}px,0,0)`;
  });

  window.addEventListener('pointerup', () => {
    isDragging = false;
    track.style.cursor = 'grab';
  });

  loop();
}

/* ================= SPARKLES LEVES ================= */
function initSparkles() {
  document.querySelectorAll('.testimonial-item').forEach(item => {
    for (let i = 0; i < 3; i++) {
      const s = document.createElement('span');
      s.className = 'sparkle';
      s.style.top = Math.random()*90 + '%';
      s.style.left = Math.random()*90 + '%';
      item.appendChild(s);
    }
  });
}

/* ================= FLOATING BUTTONS ================= */
function initFloatingButtons() {
  const hero = document.querySelector('.hero');
  const floatingBtn = document.querySelector('.floating-btn');
  const whatsappBtn = document.querySelector('.btn-whatsapp');

  const observer = new IntersectionObserver(([entry]) => {
    const show = !entry.isIntersecting;
    floatingBtn.classList.toggle('show', show);
    whatsappBtn.classList.toggle('show', show);
  }, { threshold: 0.1 });

  observer.observe(hero);
}

document.addEventListener('DOMContentLoaded', initFloatingButtons);

/* ================= KEN BURNS ================= */
function initKenBurns() {
  const sections = document.querySelectorAll('.secao-split');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.classList.toggle('animating', entry.isIntersecting);
    });
  }, { threshold: 0.8 });

  sections.forEach(s => obs.observe(s));
}
/* ================= SEÇÃO APLICATIVO (50% THRESHOLD) ================= */
function initAppSection() {
  const sessaoApp = document.getElementById('app-section');
  if (!sessaoApp) return;

  const observerApp = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Dispara quando 20% da seção estiver na tela
      if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
        sessaoApp.classList.add('revelar');
        observerApp.unobserve(sessaoApp);
      }
    });
  }, { 
    threshold: [0.4] 
  });

  observerApp.observe(sessaoApp);
}
/* ================= GSAP REVEAL (AJUSTADO) ================= */
function initGSAPReveal() {
  // O ":not(.mensagem-aplicativo)" impede que o GSAP tente animar 
  // o que o seu IntersectionObserver já está cuidando
  gsap.utils.toArray('section:not(.hero):not(.mensagem-aplicativo)').forEach(section => {
    gsap.from(section, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: section,
        start: "top 90%",
        toggleActions: "play none none reverse"
      }
    });
  });
}