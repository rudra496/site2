// Liquid Aurora & Ambient Stardust Canvas Engine (v2.0)
(function() {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  // Create or attach Aurora Canvas
  let canvas = document.getElementById('aurora-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'aurora-canvas';
    document.body.insertBefore(canvas, document.body.firstChild);
  }

  // Create cursor glow element if not present
  let cursorGlow = document.querySelector('.cursor-glow');
  if (!cursorGlow) {
    cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    document.body.appendChild(cursorGlow);
  }

  let mouse = { x: -1000, y: -1000 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
  });

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = window.innerWidth < 768 ? 45 : 90;
  let time = 0;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  class AuroraNode {
    constructor(x, y) {
      this.baseX = x !== undefined ? x : Math.random() * width;
      this.baseY = y !== undefined ? y : Math.random() * height;
      this.x = this.baseX;
      this.y = this.baseY;
      this.size = Math.random() * 2 + 1;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.phase = Math.random() * Math.PI * 2;
      this.color = this.getRandomColor();
      this.alpha = Math.random() * 0.4 + 0.2;
    }

    getRandomColor() {
      const colors = [
        "99, 102, 241",  // Indigo
        "0, 242, 254",   // Cyan
        "16, 185, 129",  // Emerald
        "139, 92, 246"   // Violet
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.baseX += this.vx;
      this.baseY += this.vy;

      if (this.baseX < 0) this.baseX = width;
      else if (this.baseX > width) this.baseX = 0;

      if (this.baseY < 0) this.baseY = height;
      else if (this.baseY > height) this.baseY = 0;

      // Subtle organic wave float
      this.x = this.baseX + Math.sin(time * 0.0015 + this.phase) * 18;
      this.y = this.baseY + Math.cos(time * 0.0015 + this.phase) * 18;

      // Soft mouse interaction
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 140) {
        const force = (140 - dist) / 140;
        this.x -= (dx / dist) * force * 15;
        this.y -= (dy / dist) * force * 15;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
      ctx.shadowBlur = 12;
      ctx.shadowColor = `rgba(${this.color}, 0.6)`;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function init() {
    resize();
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new AuroraNode());
    }
  }

  function renderWeb() {
    const maxDistance = 150;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.14;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
          ctx.lineWidth = 0.75;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    time++;
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    renderWeb();

    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => {
    resize();
    init();
  });

  init();
  loop();
})();
