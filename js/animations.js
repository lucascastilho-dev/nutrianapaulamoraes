

gsap.registerPlugin(ScrollTrigger);

// ====================
// STAT COUNTERS
// ====================
document.addEventListener("DOMContentLoaded", function () {
  const counters = document.querySelectorAll('.stat-number');

  const startCounter = (counter) => {
    const target = +counter.getAttribute('data-target');
    const suffix = counter.getAttribute('data-suffix') || '';
    let count = 0;
    const increment = target / 120;

    const update = () => {
      count += increment;
      if (count < target) {
        counter.innerText = Math.floor(count) + suffix;
        requestAnimationFrame(update);
      } else {
        counter.innerText = target + suffix;
      }
    };

    update();
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
      animation: { duration: 1200 },
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

    // Clona os itens para permitir loop infinito suave
    items.forEach(item => {
        const clone = item.cloneNode(true);
        track.appendChild(clone);
    });

    let x = 0;
    const speed = 0.5; // ajuste a velocidade

    function animate() {
        x -= speed;
        if (x <= -track.scrollWidth / 2) {
            x = 0; // reseta suavemente
        }
        track.style.transform = `translateX(${x}px)`;
        requestAnimationFrame(animate);
    }

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
