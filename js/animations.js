


var globalDarkSamsung = false; 

(function() {
  if (window.__detectSamsungForcedDarkRun) return;
  window.__detectSamsungForcedDarkRun = true;

  const ua = navigator.userAgent || '';
  const isSamsung = /SamsungBrowser/i.test(ua);
  const forceTest = new URLSearchParams(location.search).get('samsung_forced_test') === '1';
  if (!isSamsung && !forceTest) return; // roda só para Samsung ou teste

  //alert('UA: ' + ua + '\nisSamsung: ' + (isSamsung ? 'SIM' : 'NÃO') + '\nforceTest: ' + (forceTest ? 'SIM' : 'NÃO'));

  // cria imagem SVG branca (1x1)
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
      const data = ctx.getImageData(0, 0, 1, 1).data; // [r,g,b,a]
      const [r,g,b,a] = data;
      // alert('Canvas pixel read: r=' + r + ' g=' + g + ' b=' + b + ' a=' + a);

      // tolerância: considerar branco se >= 250
      const isWhite = (r >= 250 && g >= 250 && b >= 250);
      const isDark = !isWhite;
  
      // heurística: forced dark se canvas indica escuro OR body luminance baixa enquanto matchMedia=false
      const forcedDark = isDark;

//alert('isWhite=' + isWhite + ' => forcedDark=' + (forcedDark ? 'SIM' : 'NÃO'));

      if (forcedDark) {
		  globalDarkSamsung = true;
        document.documentElement.classList.add('samsung-forced-dark');
		
        // alert('Classe samsung-forced-dark aplicada (teste).');
		
		try{
			// showSamsungBanner();
			alert('O seu navegador aplicou um modo escuro automático que pode alterar as cores do site. Para ver o visual original, desative o modo escuro do Samsung Internet nas configurações ou mude de navegador.');
	  }catch (err){
		  alert(err.message);
	  }
        // aqui você pode injetar banner ou overrides inline para testes
      }
    } catch (err) {
      // alert('Erro no processamento do canvas: ' + err.message);
    }
  };
  img.onerror = function() {
    // alert('Erro ao carregar SVG data URI.');
  };
  img.src = svgData;
})();


  function showSamsungBanner() {
  try {
    if (document.querySelector('.samsung-banner')) return;
    if (localStorage.getItem('samsung_forced_dark_dismissed') === '1') return;

    // se body ainda não existe, aguarda DOMContentLoaded
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

    // fallback para garantir visibilidade
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




  // function applyInline() {
	  
  // const selectors = ['.floating-btn', '.btn-whatsapp', '.btn-agendar'];
	   // alert('gold');
    // selectors.forEach(sel => {
      // document.querySelectorAll(sel).forEach(el => {
        // try {
          // el.style.setProperty('background', 'linear-gradient(90deg, #ffeb3b, #ffeb3b)', 'important');
          // el.style.setProperty('background-color', '#A57234', 'important');
          // el.style.setProperty('color', '#16261B', 'important');
          // el.style.setProperty('-webkit-text-fill-color', '#16261B', 'important');
          // el.style.setProperty('filter', 'none', 'important');
          // el.style.setProperty('mix-blend-mode', 'normal', 'important');
          // el.style.setProperty('border', '1px solid rgba(0,0,0,0.08)', 'important');
          // el.style.setProperty('box-shadow', '0 10px 30px rgba(0,0,0,0.32)', 'important');
          // el.getBoundingClientRect();
        // } catch(e){}
      // });
    // });
	
		// const el2 = document.querySelector('.habilidades h2');
		// try {
          // el2.style.setProperty('color', 'white', 'important');
          // el2.getBoundingClientRect();
        // } catch(e){}
  // }



/* fim validacao modo dark forçado da samsung */

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
  const getFontSize = () => window.innerWidth < 768 ? 10 : 14;

  // Lê uma variável CSS e retorna cor em formato string
  const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  // Converte hex/rgba para objeto RGB
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

  // função que decide paleta do radar com base no contexto atual
  function computeRadarColors() {
    // detecta forced dark class (Samsung) e prefers-color-scheme
    const forcedSamsung = document.documentElement.classList.contains('samsung-forced-dark');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    // tenta ler --bg; se não existir, usa body
    let bgVar = cssVar('--bg') || getComputedStyle(document.body).backgroundColor;
    const bgRGB = parseColorToRGB(bgVar);
    const lum = luminance(bgRGB);
    const isLightBg = lum > 0.5;

    // se for forced Samsung, tratamos como dark (mas queremos radar claro)
    const treatAsDark = globalDarkSamsung;

    // cores claras para o radar quando em dark forced (quer branco/alto contraste)
    if (treatAsDark) {
      return {
        radarGrid: 'rgba(255,255,255,0.08)',        // linhas de grid mais suaves
        radarAngle: 'rgba(255,255,255,0.06)',
        radarLabel: '#FFFFFF',                      // labels brancas
        radarStroke: 'rgba(255,255,255,0.95)',      // contorno do dataset (quase branco)
        radarFill: 'rgba(255,255,255,0.12)',        // preenchimento translúcido claro
        radarPoint: '#FFFFFF',
        radarTick: 'rgba(255,255,255,0.06)'
      };
    }

    // caso normal (light)
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

  // cria chart com as cores calculadas
  let colors = computeRadarColors();

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
        r: {
          min: 0,
          max: 10,
          ticks: {
            display: false,
            color: colors.radarTick
          },
          grid: {
            color: colors.radarGrid
          },
          angleLines: {
            color: colors.radarAngle
          },
          pointLabels: {
            color: colors.radarLabel,
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

  const sec = document.getElementById('sec-habilidades');
  if (sec) obs.observe(sec);

  // função para recalcular cores e atualizar o chart (usada por observer)
  function refreshChartColors() {
    const newColors = computeRadarColors();
    // atualiza dataset e opções
    chart.data.datasets[0].borderColor = newColors.radarStroke;
    chart.data.datasets[0].backgroundColor = newColors.radarFill;
    chart.data.datasets[0].pointBackgroundColor = newColors.radarPoint;
    chart.data.datasets[0].pointBorderColor = newColors.radarPoint;
    // atualiza opções de escala
    chart.options.scales.r.grid.color = newColors.radarGrid;
    chart.options.scales.r.angleLines.color = newColors.radarAngle;
    chart.options.scales.r.ticks.color = newColors.radarTick;
    chart.options.scales.r.pointLabels.color = newColors.radarLabel;
    // força update
    chart.update();
  }

  // observa mudanças na classe do <html> (ex.: samsung-forced-dark adicionada/removida)
  const htmlObserver = new MutationObserver(muts => {
    for (const m of muts) {
      if (m.type === 'attributes' && m.attributeName === 'class') {
        // se a classe samsung-forced-dark foi adicionada/retirada, atualiza cores
        refreshChartColors();
      }
    }
  });
  htmlObserver.observe(document.documentElement, { attributes: true });

  // também atualiza no resize (ajusta font-size)
  window.addEventListener('resize', () => {
    chart.options.scales.r.pointLabels.font.size = getFontSize();
    chart.update();
  });
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

