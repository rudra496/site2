// ==========================================================================
// RUDRA SARKER — INTERACTIVE 3D ENGINEERING ENGINE (Three.js WebGL)
// Clean Interactive Viewport & Tactile 3D Physics (Zero Background Clutter)
// ==========================================================================

(function() {
  'use strict';

  if (typeof THREE === 'undefined') {
    return;
  }

  const isMobile = window.innerWidth < 768;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  // ========================================================================
  // INTERACTIVE 3D ENGINEERING LAB VIEWPORT
  // ========================================================================
  const labCanvas = document.getElementById('interactive-3d-canvas');
  if (labCanvas) {
    const container = labCanvas.parentElement;
    let width = container.clientWidth || 400;
    let height = container.clientHeight || 310;

    const labScene = new THREE.Scene();
    const labCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    labCamera.position.set(0, 0, 5.2);

    const labRenderer = new THREE.WebGLRenderer({
      canvas: labCanvas,
      alpha: true,
      antialias: true
    });
    labRenderer.setPixelRatio(dpr);
    labRenderer.setSize(width, height, false);
    labCanvas.style.width = '100%';
    labCanvas.style.height = '100%';

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    labScene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x3b82f6, 3.5, 20);
    pointLight1.position.set(4, 3, 4);
    labScene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x10b981, 2.5, 20);
    pointLight2.position.set(-4, -3, 3);
    labScene.add(pointLight2);

    // Master Group
    const masterGroup = new THREE.Group();
    labScene.add(masterGroup);

    let activeShapeMode = 'core';
    const coreGroup = new THREE.Group();
    const torusGroup = new THREE.Group();
    const latticeGroup = new THREE.Group();

    // 1) Shape A: NEURAL CORE
    const icoGeo = new THREE.IcosahedronGeometry(1.4, 1);
    const icoWireMat = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      wireframe: true,
      emissive: 0x1d4ed8,
      roughness: 0.2,
      metalness: 0.8
    });
    const icoMesh = new THREE.Mesh(icoGeo, icoWireMat);
    coreGroup.add(icoMesh);

    const innerGeo = new THREE.SphereGeometry(0.55, 32, 32);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      roughness: 0.1,
      metalness: 0.9
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerCore);

    const ring1Geo = new THREE.TorusGeometry(1.85, 0.025, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0x0284c7 });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    coreGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.1, 0.02, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x059669 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 3;
    coreGroup.add(ring2);

    // 2) Shape B: QUANTUM TORUS KNOT
    const tkGeo = new THREE.TorusKnotGeometry(1.1, 0.32, 120, 16, 2, 3);
    const tkMat = new THREE.MeshStandardMaterial({
      color: 0x6366f1,
      wireframe: true,
      emissive: 0x4338ca,
      roughness: 0.3,
      metalness: 0.7
    });
    const tkMesh = new THREE.Mesh(tkGeo, tkMat);
    torusGroup.add(tkMesh);

    // 3) Shape C: ROBOTICS OCTAHEDRON LATTICE
    const octGeo = new THREE.OctahedronGeometry(1.6, 2);
    const octMat = new THREE.MeshStandardMaterial({
      color: 0x059669,
      wireframe: true,
      emissive: 0x064e3b,
      roughness: 0.3,
      metalness: 0.8
    });
    const octMesh = new THREE.Mesh(octGeo, octMat);
    latticeGroup.add(octMesh);

    const octPointsMat = new THREE.PointsMaterial({ color: 0x0f172a, size: 0.06 });
    const octPoints = new THREE.Points(octGeo, octPointsMat);
    latticeGroup.add(octPoints);

    // Stardust
    const pCount = 180;
    const pGeo = new THREE.BufferGeometry();
    const pCoords = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i += 3) {
      pCoords[i] = (Math.random() - 0.5) * 6;
      pCoords[i + 1] = (Math.random() - 0.5) * 6;
      pCoords[i + 2] = (Math.random() - 0.5) * 6;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pCoords, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x3b82f6,
      size: 0.04,
      transparent: true,
      opacity: 0.75
    });
    const stardust = new THREE.Points(pGeo, pMat);
    labScene.add(stardust);

    masterGroup.add(coreGroup);

    window.switch3DShape = function(mode) {
      activeShapeMode = mode;
      masterGroup.remove(coreGroup);
      masterGroup.remove(torusGroup);
      masterGroup.remove(latticeGroup);

      if (mode === 'core') masterGroup.add(coreGroup);
      else if (mode === 'torus') masterGroup.add(torusGroup);
      else if (mode === 'lattice') masterGroup.add(latticeGroup);

      document.querySelectorAll('.shape-btn').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-shape') === mode);
      });

      const badge = document.getElementById('telemetry-shape');
      if (badge) badge.textContent = mode.toUpperCase();
    };

    // Drag Physics
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

    // Loop
    let labClock = new THREE.Clock();
    let frameCount = 0;
    let lastFpsCheck = 0;

    function renderLab() {
      requestAnimationFrame(renderLab);
      const delta = labClock.getDelta();
      const time = labClock.getElapsedTime();

      if (!isDragging) {
        dragVelocity.x *= 0.96;
        dragVelocity.y *= 0.96;
        masterGroup.rotation.y += 0.006 + dragVelocity.x;
        masterGroup.rotation.x += 0.003 + dragVelocity.y;
      }

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

      frameCount++;
      if (time - lastFpsCheck >= 1.0) {
        const fpsEl = document.getElementById('telemetry-fps');
        if (fpsEl) fpsEl.textContent = frameCount + ' FPS';
        frameCount = 0;
        lastFpsCheck = time;
      }
    }
    renderLab();

    function resizeLab() {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      width = rect.width || container.clientWidth || 320;
      height = rect.height || container.clientHeight || 280;
      if (width <= 0) width = 320;
      if (height <= 0) height = 280;
      labCamera.aspect = width / height;
      labCamera.updateProjectionMatrix();
      labRenderer.setSize(width, height, false);
    }
    window.addEventListener('resize', resizeLab);
  }

// JS Tilt removed for zero-overlap rendering
})();
