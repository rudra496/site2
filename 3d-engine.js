// ==========================================================================
// RUDRA SARKER — QUANTUM 3D ENGINEERING ENGINE (Three.js WebGL)
// 1. Interactive 3D Holographic Model with Multi-Shape Switching & Drag Physics
// 2. 3D Spatial Horizon Mesh with Wave Dynamics & Camera Parallax
// 3. Tactile 3D Card Physics
// ==========================================================================

(function() {
  'use strict';

  if (typeof THREE === 'undefined') {
    console.warn('Three.js not loaded. Skipping 3D features.');
    return;
  }

  // Detect Mobile & Low Power
  const isMobile = window.innerWidth < 768;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  // ========================================================================
  // MODULE 1: 3D SPATIAL HORIZON WAVE BACKGROUND
  // ========================================================================
  const bgCanvas = document.getElementById('bg-3d-canvas');
  if (bgCanvas) {
    const bgScene = new THREE.Scene();
    bgScene.fog = new THREE.FogExp2(0x000000, 0.035);

    const bgCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    bgCamera.position.set(0, 1.8, 6.5);
    bgCamera.rotation.x = -0.22;

    const bgRenderer = new THREE.WebGLRenderer({
      canvas: bgCanvas,
      alpha: true,
      antialias: false,
      powerPreference: 'low-power'
    });
    bgRenderer.setPixelRatio(dpr);
    bgRenderer.setSize(window.innerWidth, window.innerHeight);

    // Wireframe Wave Plane
    const segs = isMobile ? 32 : 55;
    const planeGeo = new THREE.PlaneGeometry(50, 50, segs, segs);
    planeGeo.rotateX(-Math.PI / 2);
    planeGeo.translate(0, -1.8, -10);

    const planeMat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      wireframe: true,
      transparent: true,
      opacity: 0.12
    });
    const waveMesh = new THREE.Mesh(planeGeo, planeMat);
    bgScene.add(waveMesh);

    // Save initial vertex positions
    const posAttr = planeGeo.attributes.position;
    const origY = new Float32Array(posAttr.count);
    for (let i = 0; i < posAttr.count; i++) {
      origY[i] = posAttr.getY(i);
    }

    let bgClock = new THREE.Clock();
    let bgMouseX = 0, bgMouseY = 0;

    window.addEventListener('mousemove', (e) => {
      bgMouseX = (e.clientX / window.innerWidth - 0.5) * 0.4;
      bgMouseY = (e.clientY / window.innerHeight - 0.5) * 0.3;
    });

    function animateBg() {
      requestAnimationFrame(animateBg);
      const elapsed = bgClock.getElapsedTime();

      // Camera soft parallax
      bgCamera.position.x += (bgMouseX - bgCamera.position.x) * 0.03;
      bgCamera.position.y += (1.8 - bgMouseY - bgCamera.position.y) * 0.03;

      // Animate wave vertices
      for (let i = 0; i < posAttr.count; i++) {
        const vx = posAttr.getX(i);
        const vz = posAttr.getZ(i);
        const wave = Math.sin(vx * 0.35 + elapsed * 1.2) * Math.cos(vz * 0.35 + elapsed * 1.0) * 0.45;
        posAttr.setY(i, origY[i] + wave);
      }
      posAttr.needsUpdate = true;

      bgRenderer.render(bgScene, bgCamera);
    }
    animateBg();

    window.addEventListener('resize', () => {
      bgCamera.aspect = window.innerWidth / window.innerHeight;
      bgCamera.updateProjectionMatrix();
      bgRenderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  // ========================================================================
  // MODULE 2: INTERACTIVE 3D ENGINEERING LAB VIEWPORT
  // ========================================================================
  const labCanvas = document.getElementById('interactive-3d-canvas');
  if (labCanvas) {
    const container = labCanvas.parentElement;
    let width = container.clientWidth || 400;
    let height = container.clientHeight || 420;

    const labScene = new THREE.Scene();
    const labCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    labCamera.position.set(0, 0, 5.2);

    const labRenderer = new THREE.WebGLRenderer({
      canvas: labCanvas,
      alpha: true,
      antialias: true
    });
    labRenderer.setPixelRatio(dpr);
    labRenderer.setSize(width, height);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    labScene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x3b82f6, 3, 20);
    pointLight1.position.set(4, 3, 4);
    labScene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x10b981, 2.5, 20);
    pointLight2.position.set(-4, -3, 3);
    labScene.add(pointLight2);

    // Master Group for Current 3D Object
    const masterGroup = new THREE.Group();
    labScene.add(masterGroup);

    // Sub-Groups for Different Modes
    let activeShapeMode = 'core'; // core | torus | lattice
    const coreGroup = new THREE.Group();
    const torusGroup = new THREE.Group();
    const latticeGroup = new THREE.Group();

    // 1) Shape A: NEURAL CORE (Icosahedron + Glowing Core + Dual Orbital Gimbal Rings)
    // Outer Wireframe Polyhedron
    const icoGeo = new THREE.IcosahedronGeometry(1.4, 1);
    const icoWireMat = new THREE.MeshStandardMaterial({
      color: 0x60a5fa,
      wireframe: true,
      emissive: 0x1e3a8a,
      roughness: 0.2,
      metalness: 0.8
    });
    const icoMesh = new THREE.Mesh(icoGeo, icoWireMat);
    coreGroup.add(icoMesh);

    // Inner Glowing Core
    const innerGeo = new THREE.SphereGeometry(0.55, 32, 32);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      roughness: 0.1,
      metalness: 0.9
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerCore);

    // Orbital Gyroscopic Ring 1
    const ring1Geo = new THREE.TorusGeometry(1.85, 0.025, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    coreGroup.add(ring1);

    // Orbital Gyroscopic Ring 2
    const ring2Geo = new THREE.TorusGeometry(2.1, 0.02, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x34d399 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 3;
    coreGroup.add(ring2);

    // 2) Shape B: QUANTUM TORUS KNOT
    const tkGeo = new THREE.TorusKnotGeometry(1.1, 0.32, 120, 16, 2, 3);
    const tkMat = new THREE.MeshStandardMaterial({
      color: 0x818cf8,
      wireframe: true,
      emissive: 0x312e81,
      roughness: 0.3,
      metalness: 0.7
    });
    const tkMesh = new THREE.Mesh(tkGeo, tkMat);
    torusGroup.add(tkMesh);

    // 3) Shape C: ROBOTICS OCTAHEDRON LATTICE
    const octGeo = new THREE.OctahedronGeometry(1.6, 2);
    const octMat = new THREE.MeshStandardMaterial({
      color: 0x34d399,
      wireframe: true,
      emissive: 0x064e3b,
      roughness: 0.3,
      metalness: 0.8
    });
    const octMesh = new THREE.Mesh(octGeo, octMat);
    latticeGroup.add(octMesh);

    // Point cloud node vertices on Octahedron
    const octPointsMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.06 });
    const octPoints = new THREE.Points(octGeo, octPointsMat);
    latticeGroup.add(octPoints);

    // Ambient Stardust Particles inside Viewport
    const pCount = 200;
    const pGeo = new THREE.BufferGeometry();
    const pCoords = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i += 3) {
      pCoords[i] = (Math.random() - 0.5) * 6;
      pCoords[i + 1] = (Math.random() - 0.5) * 6;
      pCoords[i + 2] = (Math.random() - 0.5) * 6;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pCoords, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x60a5fa,
      size: 0.04,
      transparent: true,
      opacity: 0.75
    });
    const stardust = new THREE.Points(pGeo, pMat);
    labScene.add(stardust);

    // Initial shape load
    masterGroup.add(coreGroup);

    // Public Shape Switcher Function
    window.switch3DShape = function(mode) {
      activeShapeMode = mode;
      masterGroup.remove(coreGroup);
      masterGroup.remove(torusGroup);
      masterGroup.remove(latticeGroup);

      if (mode === 'core') masterGroup.add(coreGroup);
      else if (mode === 'torus') masterGroup.add(torusGroup);
      else if (mode === 'lattice') masterGroup.add(latticeGroup);

      // Update active button state
      document.querySelectorAll('.shape-btn').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-shape') === mode);
      });

      // Update telemetry badge
      const badge = document.getElementById('telemetry-shape');
      if (badge) {
        badge.textContent = mode.toUpperCase();
      }
    };

    // Interactive Drag Physics
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    let dragVelocity = { x: 0.003, y: 0.005 };

    labCanvas.addEventListener('mousedown', (e) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;

      dragVelocity.x = deltaX * 0.008;
      dragVelocity.y = deltaY * 0.008;

      masterGroup.rotation.y += dragVelocity.x;
      masterGroup.rotation.x += dragVelocity.y;

      prevMousePos = { x: e.clientX, y: e.clientY };
    });

    // Touch Support
    labCanvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMousePos.x;
      const deltaY = e.touches[0].clientY - prevMousePos.y;

      dragVelocity.x = deltaX * 0.008;
      dragVelocity.y = deltaY * 0.008;

      masterGroup.rotation.y += dragVelocity.x;
      masterGroup.rotation.x += dragVelocity.y;

      prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });

    // Render & Animation Loop
    let labClock = new THREE.Clock();
    let frameCount = 0;
    let lastFpsCheck = 0;

    function renderLab() {
      requestAnimationFrame(renderLab);
      const delta = labClock.getDelta();
      const time = labClock.getElapsedTime();

      // Damping / auto-rotation
      if (!isDragging) {
        dragVelocity.x *= 0.96;
        dragVelocity.y *= 0.96;
        masterGroup.rotation.y += 0.006 + dragVelocity.x;
        masterGroup.rotation.x += 0.003 + dragVelocity.y;
      }

      // Internal Shape specific animations
      if (activeShapeMode === 'core') {
        ring1.rotation.x += 0.012;
        ring1.rotation.y += 0.015;
        ring2.rotation.y += 0.018;
        ring2.rotation.z += 0.010;
        const scale = 0.55 + Math.sin(time * 3) * 0.04;
        innerCore.scale.set(scale, scale, scale);
      } else if (activeShapeMode === 'torus') {
        tkMesh.rotation.z += 0.008;
      } else if (activeShapeMode === 'lattice') {
        octMesh.rotation.y += 0.008;
      }

      stardust.rotation.y += 0.001;

      labRenderer.render(labScene, labCamera);

      // FPS Telemetry Counter
      frameCount++;
      if (time - lastFpsCheck >= 1.0) {
        const fpsEl = document.getElementById('telemetry-fps');
        if (fpsEl) fpsEl.textContent = frameCount + ' FPS';
        frameCount = 0;
        lastFpsCheck = time;
      }
    }
    renderLab();

    // Viewport Resize
    function resizeLab() {
      if (!container) return;
      width = container.clientWidth || 400;
      height = container.clientHeight || 420;
      labCamera.aspect = width / height;
      labCamera.updateProjectionMatrix();
      labRenderer.setSize(width, height);
    }
    window.addEventListener('resize', resizeLab);
  }

  // ========================================================================
  // MODULE 3: TACTILE 3D CARD PERSPECTIVE TILT
  // ========================================================================
  if (!isMobile) {
    const tiltCards = document.querySelectorAll('.work-card, .publication-hero-card, .domain-box, .portrait-frame');
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4.5;
        const rotateY = ((x - centerX) / centerX) * 4.5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    });
  }
})();
