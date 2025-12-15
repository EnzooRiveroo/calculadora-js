const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particlesArray;
let mouse = { x: null, y: null };
let forceMultiplier = 1;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 4 + 2;
    this.speedX = Math.random() * 1.5 - 0.75;
    this.speedY = Math.random() * 1.5 - 0.75;
    this.baseColor = 'rgba(255,0,255,0.9)';
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
    if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;

    if (mouse.x && mouse.y) {
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let dist = Math.sqrt(dx * dx + dy * dy);

      const influence = 120;
      const force = 0.03 * forceMultiplier;
      if (dist < influence) {
        this.x += dx * force;
        this.y += dy * force;
      }
    }
  }
  draw() {
    ctx.fillStyle = this.baseColor;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  particlesArray = [];
  for (let i = 0; i < 180; i++) {
    particlesArray.push(new Particle());
  }
}

function connectParticles() {
  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = a; b < particlesArray.length; b++) {
      let dx = particlesArray[a].x - particlesArray[b].x;
      let dy = particlesArray[a].y - particlesArray[b].y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 120) {
        ctx.strokeStyle = 'rgba(255,0,255,' + (1 - distance / 120) + ')';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particlesArray.forEach(p => {
    p.update();
    p.draw();
  });
  connectParticles();
  requestAnimationFrame(animateParticles);
}

window.addEventListener('mousemove', function (e) {
  mouse.x = e.x;
  mouse.y = e.y;
});

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initParticles();
});

initParticles();
animateParticles();

const display = document.getElementById('display');
let currentInput = '';

function appendValue(val) {
  currentInput += val;
  display.textContent = currentInput;
}

function calculate() {
  try {
    let result = eval(currentInput);
    display.textContent = result;
    display.classList.add('bounce');
    setTimeout(() => display.classList.remove('bounce'), 300);
    currentInput = result.toString();
  } catch {
    display.textContent = "Error";
    currentInput = '';
  }
}

function clearDisplay() {
  currentInput = '';
  display.textContent = '0';
}

const welcomeButton = document.getElementById('welcomeButton');
const welcomeScreen = document.getElementById('welcomeScreen');
const loadingBar = document.getElementById('loadingBar');
const loadingContainer = document.getElementById('loadingBarContainer');
const calculatorWrapper = document.querySelector('.calculator-wrapper');

welcomeButton.addEventListener('click', () => {
  welcomeButton.style.transition = "all 0.5s ease";
  welcomeButton.style.opacity = 0;
  setTimeout(() => welcomeButton.style.display = 'none', 500);

  loadingContainer.style.display = 'block';
  forceMultiplier = 1.5;

  let width = 0;
  const interval = setInterval(() => {
    if (width >= 100) {
      clearInterval(interval);
      welcomeScreen.style.display = 'none';
      calculatorWrapper.classList.add('show');
    } else {
      width++;
      loadingBar.style.width = width + '%';
      loadingBar.textContent = width + '%';
    }
  }, 30);
});