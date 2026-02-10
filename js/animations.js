

gsap.registerPlugin(ScrollTrigger);

// ====================
// STAT COUNTERS
// ====================
document.addEventListener("DOMContentLoaded", function () {
  const counters = document.querySelectorAll('.stat-number');

  const startCounter = (counter) => {
    const target = +counter.getAttribute('data-target');
    const suffix = counter.getAttribute('data-suffix') || '';
	const duration = 3500; //velocidade stats
	
	let startTime = null;
	
    const animate = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const progress = timestamp - startTime;

    const current = Math.min(
      Math.floor((progress / duration) * target),
      target
    );

    counter.innerText = current + suffix;

    if (progress < duration) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
};

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        counters.forEach(startCounter);
        observer.disconnect();
      }
    });
  });

  observer.observe(document.querySelector('.stats'));
});

// ====================
// RADAR CHART
// ====================
let radarChart;
let chartIniciado = false;

const valoresReais = [7, 9, 8, 8, 6]; // suas notas
const valoresZerados = [0, 0, 0, 0, 0];

function criarGrafico(dataInicial){
  const ctx = document.getElementById('radarChart');
  
  function getFontSize() {
	const w = window.innerWidth;
	if (w < 350) return 8;      // celular pequeno
	if (w < 480) return 10;      // celular pequeno
	if (w < 768) return 12;      // celular grande
	if (w < 1024) return 14;     // tablet
	return 16;                   // desktop
	
}

  radarChart = new Chart(ctx, {
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
        data: dataInicial,
        fill: true,
        backgroundColor: 'rgba(251,227,155,0.20)',
        borderColor: '#FBE39B',
        pointBackgroundColor: '#A57234',
        pointBorderColor: '#fff',
        pointRadius: 5,
        borderWidth: 2
      }]
    },
    options: {
	  responsive: true,
	  maintainAspectRatio: true,
      animation: { duration: 2200 },
      plugins: { legend: { display: false } },
      scales: {
        r: {
          min: 0,
          max: 10,
          ticks: {
            stepSize: 2,
            backdropColor: 'transparent',
            color: '#FBE39B'
          },
          grid: { color: 'rgba(251,227,155,0.25)' },
          angleLines: { color: 'rgba(251,227,155,0.25)' },
          pointLabels: {
            color: '#FBE39B',
            font: { 
				size: getFontSize(), 
				weight: '600' 
				}
          }
        }
      }
    }
  });
}


function animarGrafico(){
  radarChart.data.datasets[0].data = valoresReais;
  radarChart.update();
}

document.addEventListener("DOMContentLoaded", function(){
  criarGrafico(valoresZerados);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting && !chartIniciado){
        chartIniciado = true;
        animarGrafico();
      }
    });
  }, { threshold: 0.6 });

  observer.observe(document.getElementById('sec-habilidades'));
});

// ====================
// TESTIMONIAL CAROUSEL
// ====================
document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector('.testimonial-track');
  const items = Array.from(track.children);

  // Clona para loop infinito
  items.forEach(item => track.appendChild(item.cloneNode(true)));

  let x = 0;
  let speed = 0.4; // velocidade automática
  let isPaused = false;
  let isDragging = false;
  let startX = 0;
  let currentX = 0;

  const halfWidth = () => track.scrollWidth / 2;

  function animate() {
    if (!isPaused && !isDragging) {
      x -= speed;
      if (Math.abs(x) >= halfWidth()) x = 0;
      track.style.transform = `translateX(${x}px)`;
    }
    requestAnimationFrame(animate);
  }

  // =====================
  // PAUSAR NO HOVER
  // =====================
  track.addEventListener('mouseenter', () => isPaused = true);
  track.addEventListener('mouseleave', () => isPaused = false);

  // =====================
  // ARRASTAR COM MOUSE
  // =====================
  track.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    currentX = x;
    track.style.cursor = 'grabbing';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    x = currentX + dx;
    track.style.transform = `translateX(${x}px)`;
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    track.style.cursor = 'grab';
  });

  // =====================
  // ARRASTAR NO MOBILE
  // =====================
  track.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].clientX;
    currentX = x;
  });

  track.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const dx = e.touches[0].clientX - startX;
    x = currentX + dx;
    track.style.transform = `translateX(${x}px)`;
  });

  track.addEventListener('touchend', () => {
    isDragging = false;
  });

  track.style.cursor = 'grab';

  animate();
});
// ====================
// GSAP PARALLAX & REVEAL
// ====================
document.querySelectorAll('section').forEach(section => {
  gsap.from(section, {
    y: 60,
    opacity: 0,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: section,
      start: "top 80%",
      end: "bottom 60%",
      toggleActions: "play none none reverse"
    }
  });
});

// GSAP horizontal parallax lines
document.querySelectorAll('section::before').forEach((line) => {
  gsap.to(line, {
    x: 50, // deslocamento horizontal
    ease: "none",
    scrollTrigger: {
      trigger: line.parentElement,
      start: "top bottom",
      end: "bottom top",
      scrub: true
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
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

      item.appendChild(sparkle);
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const gatilho = document.querySelector('.hero');
  const floatingBtn = document.querySelector('.floating-btn');
  const whatsappBtn = document.querySelector('.btn-whatsapp');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Quando a seção NÃO está mais visível
      if (!entry.isIntersecting) {
        floatingBtn.classList.add('show');
        whatsappBtn.classList.add('show');
		Object.assign(floatingBtn.style, {
          position: 'fixed'});
		Object.assign(whatsappBtn.style, {
          position: 'fixed'});
      } else {
        floatingBtn.classList.remove('show');
        whatsappBtn.classList.remove('show');
		Object.assign(floatingBtn.style, {
          position: 'relative'});
		Object.assign(whatsappBtn.style, {
          position: 'relative'});
      }
    });
  }, {
    threshold: 0.1
  });

  observer.observe(gatilho);
});