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
function initRadarChart() {
  const ctx = document.getElementById('radarChart');
  if (!ctx) return;

  const dataFinal = [7, 9, 8, 8, 6];

  // Detecta o tamanho da tela para definir a fonte inicial
  const getFontSize = () => {
    return window.innerWidth < 768 ? 10 : 14;
  };

  // Lê uma variável CSS e retorna cor em formato rgb/hex
  const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  // Função utilitária para converter hex/rgba para luminance (0..1)
  const parseColorToRGB = (c) => {
    if (!c) return null;
    c = c.replace(/\s+/g, '');
    // rgba(...)
    if (c.startsWith('rgba') || c.startsWith('rgb')) {
      const nums = c.match(/[\d.]+/g).map(Number);
      return { r: nums[0], g: nums[1], b: nums[2], a: nums[3] ?? 1 };
    }
    // hex #rrggbb or #rgb
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

  // Tenta ler --bg (definida no CSS). Se não existir, pega background do body.
  let bgVar = cssVar('--bg') || getComputedStyle(document.body).backgroundColor;
  const bgRGB = parseColorToRGB(bgVar);
  const lum = luminance(bgRGB);
  const isLightBg = lum > 0.5; // threshold: >0.5 = claro

  // Lê as variáveis do radar (fallbacks caso não existam)
  const radarGrid = cssVar('--radar-grid') || (isLightBg ? 'rgba(0,0,0,0.06)' : 'rgba(251,227,155,0.12)');
  const radarAngle = cssVar('--radar-angle-lines') || radarGrid;
  const radarLabel = cssVar('--radar-label') || (isLightBg ? '#1b1b1b' : '#FBE39B');
  const radarStroke = cssVar('--radar-stroke') || (isLightBg ? '#A57234' : '#FBE39B');
  const radarFill = cssVar('--radar-fill') || (isLightBg ? 'rgba(251,227,155,0.18)' : 'rgba(251,227,155,0.18)');
  const radarPoint = cssVar('--radar-point') || radarStroke;
  const radarTick = cssVar('--radar-tick') || radarGrid;

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
        borderColor: radarStroke,
        backgroundColor: radarFill,
        pointBackgroundColor: radarPoint,
        pointBorderColor: radarPoint,
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
          ticks: {
            display: false,
            color: radarTick
          },
          grid: {
            color: radarGrid
          },
          angleLines: {
            color: radarAngle
          },
          pointLabels: {
            color: radarLabel,
            font: { size: getFontSize(), weight: 600 }
          }
        }
      }
    }
  });

  // animação de entrada quando a seção aparece
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
  // limpa sparkles antigos e timers
  document.querySelectorAll('.testimonial-item .sparkle').forEach(s => {
    if (s._stop) s._stop();
    s.remove();
  });

  const perItemMin = 1;
  const perItemMax = 2;
  const TICK_MS = 1000; // 1s on / 1s off
  const initialStaggerMax = 0; // ms de stagger inicial para evitar piscar todos juntos

  const rand = (min, max) => Math.random() * (max - min) + min;
  const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  // função que gera posição aleatória segura (percentual)
  const randomPos = () => {
    const left = Math.round(rand(8, 92));
    const top = Math.round(rand(8, 92));
    return [left, top];
  };

  // estrutura para controlar todos os sparkles com um tick mestre
  const sparkleInstances = [];

  document.querySelectorAll('.testimonial-item').forEach(item => {
    const count = randInt(perItemMin, perItemMax);

    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      s.className = 'sparkle';

      // posição inicial aleatória
      const [l, t] = randomPos();
      s.style.left = l + '%';
      s.style.top = t + '%';

      // aparência
      s.style.background = 'radial-gradient(circle, rgba(255,243,198,0.95) 0%, rgba(251,227,155,0.9) 45%, rgba(165,114,52,0.9) 100%)';

      item.appendChild(s);

      // estado
      const instance = {
        el: s,
        isOn: false, // começa apagado
        // optional: small initial offset so not all toggle same tick
        offset: Math.round(rand(0, initialStaggerMax))
      };

      sparkleInstances.push(instance);
    }
  });

  // Master tick: executa a alternância de todos os sparkles a cada TICK_MS
  // Usamos setInterval para precisão e evitar drift acumulado
  let masterTimer = null;
  let startTime = performance.now();

  const masterTick = () => {
    const now = performance.now();

    // Para cada sparkle: se está off -> escolher nova posição e ligar; se está on -> desligar
    sparkleInstances.forEach(inst => {
      // respeita offset inicial: só começa a alternar após offset ter passado
      if (now - startTime < inst.offset) return;

      if (!inst.isOn) {
        // está off: reposiciona INSTANTANEAMENTE (sem transição) e liga
        const [nl, nt] = randomPos();
        inst.el.style.left = nl + '%';
        inst.el.style.top = nt + '%';

        // ligar (aplica classe visível)
        inst.el.classList.add('sparkle--visible');
        inst.isOn = true;
      } else {
        // está on: desligar (remove classe)
        inst.el.classList.remove('sparkle--visible');
        inst.isOn = false;
      }
    });
  };

  // start after a tiny delay so offsets work predictably
  masterTimer = setInterval(masterTick, TICK_MS);

  // opcional: executar o primeiro tick imediatamente after small delay so offsets apply
  setTimeout(() => {
    startTime = performance.now();
    masterTick();
  }, 50);

  // expõe método de parada para limpeza futura
  const stopAll = () => {
    clearInterval(masterTimer);
    sparkleInstances.forEach(inst => {
      inst.el.remove();
    });
    sparkleInstances.length = 0;
  };

  // guarda referência global para permitir limpeza se initSparkles for chamado novamente
  window.__sparkles_stop_all && window.__sparkles_stop_all();
  window.__sparkles_stop_all = stopAll;
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

  // Observador com rootMargin negativo para manter "intersecting"
  // mesmo quando a seção começa a sair da viewport.
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      // Mantemos animating enquanto pelo menos 25% da seção estiver visível.
      // Isso evita que a classe seja removida assim que a seção começa a sair.
      if (entry.intersectionRatio >= 0.25) {
        entry.target.classList.add('animating');
      } else {
        // Pequeno debounce para evitar flicker quando o usuário faz scroll rápido
        // (evita remover imediatamente se houver micro-flutuações)
        clearTimeout(entry.target._kbTimeout);
        entry.target._kbTimeout = setTimeout(() => {
          if (entry.intersectionRatio < 0.15) {
            entry.target.classList.remove('animating');
          }
        }, 200); // 120ms debounce
      }
    });
  }, {
    // start a considerar a seção "visível" um pouco antes de entrar totalmente
    root: null,
    rootMargin: '0px 0px -30% 0px', // mantém intersecting até 30% após o topo inferior
    threshold: [0, 0.15, 0.25, 0.5, 0.75, 1]
  });

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