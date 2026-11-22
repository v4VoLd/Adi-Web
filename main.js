/* ==========================================================================
   ADI PERFORMANCE — MASTER INTERACTIVE ENGINE (main.js)
   Three.js 3D Ring, Text Decrypt, Live Terminal, Dyno Calculator, 3D Tilt & CLI
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initScrollReveal();
  initAmbientBackground();
  initScrollHUD();
  initMetalRingGlobe();
  initScrambleEffects();
  initStatCounters();
  initDiagnosticTerminal();
  initConfigurator();
  init3DTilt();
  initLaunchpadMatrix();
  initTerminalModal();
});

/* ==========================================================================
   1. CUSTOM TRAILING CURSOR
   ========================================================================== */
function initCustomCursor() {
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function renderRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(renderRing);
  }
  requestAnimationFrame(renderRing);

  // Hover expansion on interactive elements
  const hoverTargets = document.querySelectorAll('a, button, input, select, textarea, .brand-card, .stage-tab, .matrix-pad, .service-card');
  hoverTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      ring.style.width = '54px';
      ring.style.height = '54px';
      ring.style.borderColor = 'rgba(255, 208, 0, 0.9)';
      ring.style.backgroundColor = 'rgba(255, 208, 0, 0.08)';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width = '34px';
      ring.style.height = '34px';
      ring.style.borderColor = 'rgba(255, 208, 0, 0.6)';
      ring.style.backgroundColor = 'transparent';
    });
  });
}

/* ==========================================================================
   2. SCROLL PROGRESS & BOTTOM HUD TELEMETRY BAR
   ========================================================================== */
function initScrollHUD() {
  const progressBar = document.getElementById('scroll-progress');
  const hudScroll = document.getElementById('hud-scroll');

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
    const cleanProgress = Math.min(100, Math.max(0, Math.round(progress)));

    if (progressBar) progressBar.style.width = `${cleanProgress}%`;
    if (hudScroll) hudScroll.textContent = `${cleanProgress}%`;
  }, { passive: true });
}

/* ==========================================================================
   3. EXACT FRACTURED METALLIC HALO RING (From Reference Site)
   70 3D faceted metallic titanium shards, depth-sorted, lighting,
   streak dashes, floating dust particles & smooth mouse parallax.
   ========================================================================== */
function initMetalRingGlobe() {
  const canvas = document.getElementById('globe');
  if (!canvas || typeof THREE === 'undefined') return;

  // --------------------------------------------------------------------------
  // 1. PROCEDURAL 4K MULTI-LAYER TEXTURES FOR 3D EXPLODED CAD DISASSEMBLY
  // --------------------------------------------------------------------------
  const size = 2048;
  const cx = size / 2;
  const cy = size / 2;
  const R = size * 0.44;

  const startAngle = 0.38 * Math.PI; // 0 KM/H (~5:15)
  const endAngle = 2.22 * Math.PI;   // 340+ KM/H (~3:45)
  const sweep = endAngle - startAngle;
  const yellowStart = 1.48 * Math.PI; // 12:00
  const yellowEnd = endAngle;

  // LAYER 1: Deep Matte Obsidian Base Plate with High-Contrast Typography Vignette
  function createBaseTexture() {
    const cv = document.createElement('canvas');
    cv.width = size; cv.height = size;
    const ctx = cv.getContext('2d');

    // Enhanced OLED contrast behind headline wordmark
    const bgGrad = ctx.createRadialGradient(cx, cy, R * 0.05, cx, cy, R * 1.05);
    bgGrad.addColorStop(0, 'rgba(6, 8, 12, 0.96)');
    bgGrad.addColorStop(0.35, 'rgba(6, 8, 12, 0.88)');
    bgGrad.addColorStop(0.65, 'rgba(5, 7, 10, 0.65)');
    bgGrad.addColorStop(0.88, 'rgba(4, 5, 8, 0.35)');
    bgGrad.addColorStop(1.0, 'rgba(4, 5, 8, 0)');
    ctx.fillStyle = bgGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.05, 0, Math.PI * 2);
    ctx.fill();

    // Subtle concentric telemetry grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 2.0;
    [0.91, 0.76, 0.62, 0.42, 0.26].forEach(rRatio => {
      ctx.beginPath();
      ctx.arc(cx, cy, R * rRatio, 0, Math.PI * 2);
      ctx.stroke();
    });

    return new THREE.CanvasTexture(cv);
  }

  // LAYER 2: Outer Speedometer Scale & Ticks (0 to 340+ KM/H)
  function createOuterScaleTexture() {
    const cv = document.createElement('canvas');
    cv.width = size; cv.height = size;
    const ctx = cv.getContext('2d');

    const speedScale = [
      { speed: 0, a: 0.38 * Math.PI, label: '0' },
      { speed: 20, a: 0.48 * Math.PI, label: '20' },
      { speed: 40, a: 0.58 * Math.PI, label: '40' },
      { speed: 60, a: 0.68 * Math.PI, label: '60' },
      { speed: 80, a: 0.78 * Math.PI, label: '80' },
      { speed: 100, a: 0.88 * Math.PI, label: '100' },
      { speed: 150, a: 1.02 * Math.PI, label: '150' },
      { speed: 170, a: 1.12 * Math.PI, label: '170' },
      { speed: 200, a: 1.22 * Math.PI, label: '200' },
      { speed: 220, a: 1.30 * Math.PI, label: '220' },
      { speed: 240, a: 1.38 * Math.PI, label: '240' },
      { speed: 260, a: 1.48 * Math.PI, label: '260' },
      { speed: 280, a: 1.58 * Math.PI, label: '280' },
      { speed: 300, a: 1.68 * Math.PI, label: '300' },
      { speed: 320, a: 1.78 * Math.PI, label: '320' },
      { speed: 340, a: 1.88 * Math.PI, label: '340+' }
    ];

    const totalTicks = 110;
    for (let i = 0; i <= totalTicks; i++) {
      const a = startAngle + (i / totalTicks) * sweep;
      const isYellow = (a >= yellowStart);
      const r1 = R * 0.875;
      const r2 = R * 0.905;
      ctx.strokeStyle = isYellow ? '#FFC000' : 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
      ctx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2);
      ctx.stroke();
    }

    speedScale.forEach(sp => {
      const isYellow = (sp.a >= yellowStart);
      const r1 = R * 0.84;
      const r2 = R * 0.915;
      ctx.strokeStyle = isYellow ? '#FFC000' : '#FFFFFF';
      ctx.lineWidth = 5.5;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(sp.a) * r1, cy + Math.sin(sp.a) * r1);
      ctx.lineTo(cx + Math.cos(sp.a) * r2, cy + Math.sin(sp.a) * r2);
      ctx.stroke();

      const tr = R * 0.77;
      const tx = cx + Math.cos(sp.a) * tr;
      const ty = cy + Math.sin(sp.a) * tr;
      ctx.save();
      ctx.translate(tx, ty);
      ctx.rotate(sp.a + Math.PI / 2);
      ctx.font = 'bold 34px "JetBrains Mono", sans-serif';
      ctx.fillStyle = isYellow ? '#FFE033' : '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(sp.label, 0, 0);
      ctx.restore();
    });

    return new THREE.CanvasTexture(cv);
  }

  // LAYER 3: Radiant Speed Yellow Power Band (6000-9000 RPM)
  function createYellowRedlineTexture() {
    const cv = document.createElement('canvas');
    cv.width = size; cv.height = size;
    const ctx = cv.getContext('2d');

    ctx.save();
    ctx.shadowColor = '#FFB800';
    ctx.shadowBlur = 45;
    ctx.strokeStyle = '#FFC000';
    ctx.lineWidth = 26;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 0.90, yellowStart, yellowEnd);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    const yGlow = ctx.createRadialGradient(cx, cy, R * 0.72, cx, cy, R * 0.91);
    yGlow.addColorStop(0, 'rgba(255, 175, 0, 0.04)');
    yGlow.addColorStop(0.6, 'rgba(255, 195, 0, 0.20)');
    yGlow.addColorStop(1, 'rgba(255, 210, 0, 0.42)');
    ctx.fillStyle = yGlow;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 0.905, yellowStart, yellowEnd);
    ctx.arc(cx, cy, R * 0.72, yellowEnd, yellowStart, true);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    const numLadder = 28;
    for (let i = 0; i <= numLadder; i++) {
      const a = yellowStart + (i / numLadder) * (yellowEnd - yellowStart);
      const r1 = R * 0.73;
      const r2 = R * 0.89;
      ctx.strokeStyle = '#FFD500';
      ctx.lineWidth = (i % 7 === 0) ? 7 : 3.2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
      ctx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2);
      ctx.stroke();
    }

    ctx.save();
    ctx.font = 'bold 38px "JetBrains Mono", monospace';
    ctx.fillStyle = '#FFE033';
    ctx.shadowColor = '#FFAA00';
    ctx.shadowBlur = 12;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const rpms = [
      { label: '6000', a: 1.58 * Math.PI },
      { label: '7000', a: 1.76 * Math.PI },
      { label: '8000', a: 1.94 * Math.PI },
      { label: '9000', a: 2.12 * Math.PI }
    ];
    rpms.forEach(rpm => {
      const tr = R * 0.65;
      const tx = cx + Math.cos(rpm.a) * tr;
      const ty = cy + Math.sin(rpm.a) * tr;
      ctx.save();
      ctx.translate(tx, ty);
      ctx.rotate(rpm.a + Math.PI / 2);
      ctx.fillText(rpm.label, 0, 0);
      ctx.restore();
    });
    ctx.restore();

    return new THREE.CanvasTexture(cv);
  }

  // LAYER 4: Inner Cyan Concentric Arc & Engineering Telemetry (NO Duplicate ADI Text)
  function createInnerTelemetryTexture() {
    const cv = document.createElement('canvas');
    cv.width = size; cv.height = size;
    const ctx = cv.getContext('2d');

    // Inner glowing cyan arc
    ctx.save();
    ctx.shadowColor = '#00F0FF';
    ctx.shadowBlur = 32;
    ctx.strokeStyle = '#00E5FF';
    ctx.lineWidth = 11;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 0.52, 0.65 * Math.PI, 2.15 * Math.PI);
    ctx.stroke();
    ctx.restore();

    // "RPM" in top center
    ctx.save();
    ctx.font = 'bold 44px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = '6px';
    ctx.fillText('RPM', cx, cy - R * 0.32);
    ctx.restore();

    // "KM/H"
    ctx.save();
    ctx.font = 'bold 36px "JetBrains Mono", monospace';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '4px';
    ctx.fillText('KM/H', cx + R * 0.12, cy + R * 0.15);

    // "BOOST 2.4 BAR"
    ctx.font = 'bold 24px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText('BOOST', cx + R * 0.16, cy + R * 0.28);

    ctx.font = 'bold 50px "JetBrains Mono", monospace';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('2.4', cx + R * 0.28, cy + R * 0.30);

    ctx.font = 'bold 22px "JetBrains Mono", monospace';
    ctx.fillStyle = '#00E5FF';
    ctx.fillText('BAR', cx + R * 0.42, cy + R * 0.29);

    // Replaced duplicate brand name with authentic motorsport engineering telemetry
    ctx.font = 'bold 24px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(0, 229, 255, 0.85)';
    ctx.shadowColor = '#00E5FF';
    ctx.shadowBlur = 10;
    ctx.letterSpacing = '4px';
    ctx.fillText('STAGE 3 PROTOCOL · AWD BENCH · CAN-BUS MAP 04', cx + R * 0.35, cy + R * 0.48);
    ctx.restore();

    return new THREE.CanvasTexture(cv);
  }

  // --------------------------------------------------------------------------
  // 2. THREE.JS SCENE SETUP (Alpha Transparent)
  // --------------------------------------------------------------------------
  const scene = new THREE.Scene();
  scene.background = null;

  const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 7.2);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;

  // Studio Lighting
  const ambientLight = new THREE.AmbientLight(0x182030, 1.8);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
  keyLight.position.set(-4.5, 5.5, 4.5);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x5a7090, 1.2);
  fillLight.position.set(4.0, 3.5, 3.0);
  scene.add(fillLight);

  const yellowSpot = new THREE.SpotLight(0xffb800, 5.0, 7.0, Math.PI / 4, 0.45, 1.0);
  yellowSpot.position.set(2.4, 2.6, 2.8);
  scene.add(yellowSpot);

  // --------------------------------------------------------------------------
  // 3. EXPLODABLE 3D GAUGE ASSEMBLY (SEPARATED LAYERS)
  // --------------------------------------------------------------------------
  const baseGaugeY = -0.22;
  const gaugeGroup = new THREE.Group();
  gaugeGroup.rotation.x = 0.44;
  gaugeGroup.rotation.y = -0.10;
  gaugeGroup.position.set(0, baseGaugeY, 0);
  scene.add(gaugeGroup);

  const dialRadius = 2.25;

  // LAYER 1: Base Plate Mesh
  const baseTex = createBaseTexture();
  baseTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const baseMat = new THREE.MeshStandardMaterial({
    map: baseTex,
    transparent: true,
    opacity: 0.95,
    roughness: 0.70,
    metalness: 0.10,
    depthWrite: false
  });
  const baseMesh = new THREE.Mesh(new THREE.CircleGeometry(dialRadius, 64), baseMat);
  baseMesh.position.z = 0;
  gaugeGroup.add(baseMesh);

  // LAYER 2: Outer Scale Mesh (0 to 340+ KM/H)
  const outerTex = createOuterScaleTexture();
  outerTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const outerMat = new THREE.MeshStandardMaterial({
    map: outerTex,
    transparent: true,
    opacity: 0.95,
    roughness: 0.50,
    metalness: 0.20,
    depthWrite: false
  });
  const outerMesh = new THREE.Mesh(new THREE.CircleGeometry(dialRadius, 64), outerMat);
  outerMesh.position.z = 0.01;
  gaugeGroup.add(outerMesh);

  // LAYER 3: Speed Yellow Redline Mesh (6000-9000 RPM)
  const yellowTex = createYellowRedlineTexture();
  yellowTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const yellowMat = new THREE.MeshStandardMaterial({
    map: yellowTex,
    transparent: true,
    opacity: 0.95,
    roughness: 0.35,
    metalness: 0.30,
    depthWrite: false
  });
  const yellowMesh = new THREE.Mesh(new THREE.CircleGeometry(dialRadius, 64), yellowMat);
  yellowMesh.position.z = 0.02;
  gaugeGroup.add(yellowMesh);

  // LAYER 4: Inner Cyan Telemetry Halo Mesh
  const innerTex = createInnerTelemetryTexture();
  innerTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const innerMat = new THREE.MeshStandardMaterial({
    map: innerTex,
    transparent: true,
    opacity: 0.95,
    roughness: 0.40,
    metalness: 0.25,
    depthWrite: false
  });
  const innerMesh = new THREE.Mesh(new THREE.CircleGeometry(dialRadius, 64), innerMat);
  innerMesh.position.z = 0.03;
  gaugeGroup.add(innerMesh);

  // LAYER 5: Sweeping 3D Needle & Machined Billet Hub
  const needlePivot = new THREE.Group();
  needlePivot.position.set(0, 0, 0.08);
  gaugeGroup.add(needlePivot);

  const hubMat = new THREE.MeshStandardMaterial({
    color: 0x3e4758,
    roughness: 0.25,
    metalness: 0.95
  });
  const hubGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.12, 32);
  hubGeo.rotateX(Math.PI / 2);
  const hubMesh = new THREE.Mesh(hubGeo, hubMat);
  hubMesh.position.z = 0.06;
  needlePivot.add(hubMesh);

  const hubRingGeo = new THREE.RingGeometry(0.10, 0.14, 32);
  const hubRingMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
  const hubRing = new THREE.Mesh(hubRingGeo, hubRingMat);
  hubRing.position.z = 0.125;
  needlePivot.add(hubRing);

  const needleShape = new THREE.Shape();
  needleShape.moveTo(-0.040, -0.25);
  needleShape.lineTo(0.040, -0.25);
  needleShape.lineTo(0.034, 1.48);
  needleShape.lineTo(0.0, 1.66);
  needleShape.lineTo(-0.034, 1.48);
  needleShape.closePath();

  const extrudeSettings = { depth: 0.035, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.015, bevelThickness: 0.015 };
  const needleGeo = new THREE.ExtrudeGeometry(needleShape, extrudeSettings);
  const needleMat = new THREE.MeshStandardMaterial({
    color: 0x00d4ff,
    emissive: 0x00f0ff,
    emissiveIntensity: 1.6,
    roughness: 0.15,
    metalness: 0.3
  });
  const needleMesh = new THREE.Mesh(needleGeo, needleMat);
  needleMesh.position.z = 0.12;
  needlePivot.add(needleMesh);

  const spineGeo = new THREE.BoxGeometry(0.012, 1.55, 0.045);
  const spineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const spineMesh = new THREE.Mesh(spineGeo, spineMat);
  spineMesh.position.set(0, 0.72, 0.15);
  needlePivot.add(spineMesh);

  const needleGlowLight = new THREE.PointLight(0x00f0ff, 3.2, 3.0);
  needleGlowLight.position.set(0, 0.9, 0.22);
  needlePivot.add(needleGlowLight);

  // Blueprint Disassembly Laser Guide Rays
  const guidesGroup = new THREE.Group();
  const guideMat = new THREE.LineDashedMaterial({
    color: 0x00e5ff,
    dashSize: 0.08,
    gapSize: 0.06,
    transparent: true,
    opacity: 0.0
  });

  const guidePoints = [
    [-1.2, 1.2],
    [1.4, 1.4],
    [1.5, -0.8],
    [-1.4, -1.0]
  ];

  guidePoints.forEach(([gx, gy]) => {
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(gx, gy, -1.0),
      new THREE.Vector3(gx, gy, 1.5)
    ]);
    const line = new THREE.Line(geo, guideMat);
    line.computeLineDistances();
    guidesGroup.add(line);
  });
  gaugeGroup.add(guidesGroup);

  // --------------------------------------------------------------------------
  // 4. IGNITION STARTUP NEEDLE SWEEP CEREMONY & INTERACTION PHYSICS
  // --------------------------------------------------------------------------
  let mouseX = 0;
  let mouseY = 0;
  let targetRotX = 0.44;
  let targetRotY = -0.10;

  // Ignition Needle Sweep State
  // Angle calibration: 1.8 = 0 KM/H, -1.0 = 340+ KM/H redline, 1.35 = ~35 KM/H idle
  let startupSweepActive = true;
  let startupStartTime = performance.now();
  const startupDuration = 1800; // Synchronized with deliberate text-forming sweep

  let currentNeedleAngle = 1.8; // Starts at 0 KM/H
  let targetNeedleAngle = 1.35; // Settles at idle (~35 KM/H)
  let scrollVel = 0;
  let lastY = window.scrollY;

  window.addEventListener('mousemove', (e) => {
    const nx = (e.clientX / window.innerWidth) - 0.5;
    const ny = (e.clientY / window.innerHeight) - 0.5;
    mouseX = nx;
    mouseY = ny;

    targetRotX = 0.44 + ny * 0.25;
    targetRotY = -0.10 + nx * 0.32;

    if (!startupSweepActive) {
      const speedFrac = Math.max(0, Math.min(1, (nx + 0.5) * 0.85));
      targetNeedleAngle = 1.6 - speedFrac * 2.6;
    }
  }, { passive: true });

  window.addEventListener('scroll', () => {
    scrollVel = window.scrollY - lastY;
    lastY = window.scrollY;
  }, { passive: true });

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener('resize', onResize);

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();
    const now = performance.now();

    // ------------------------------------------------------------------------
    // A. Startup Needle Sweep Ceremony (Porsche / GT3 Ignition Check)
    // ------------------------------------------------------------------------
    if (startupSweepActive) {
      const elapsed = now - startupStartTime;
      const t = Math.min(1, elapsed / startupDuration);

      if (t < 0.55) {
        // Phase 1: Rapid rev from 0 to 340+ KM/H redline (0 -> 1.8 to -0.85)
        const p1 = t / 0.55;
        const easeRev = 1 - Math.pow(1 - p1, 3);
        currentNeedleAngle = 1.8 - easeRev * 2.65;
      } else if (t < 1.0) {
        // Phase 2: Smooth settling return to idle ~35 KM/H (-0.85 -> 1.35)
        const p2 = (t - 0.55) / 0.45;
        const easeReturn = 1 - Math.pow(1 - p2, 2);
        currentNeedleAngle = -0.85 + easeReturn * 2.2;
      } else {
        startupSweepActive = false;
        targetNeedleAngle = 1.35;
      }
    }

    // ------------------------------------------------------------------------
    // B. Controlled Scroll Disassembly & Fade Dynamics
    // ------------------------------------------------------------------------
    const scrollProgress = Math.min(1.0, Math.max(0, window.scrollY / (window.innerHeight * 0.72)));
    // Dissolves smoothly before reaching the next section title
    const fade = Math.max(0, 1 - Math.pow(scrollProgress / 0.88, 2.2));

    if (fade <= 0.01) {
      renderer.clear();
      return;
    }

    // Parallax Interpolation
    gaugeGroup.rotation.x += (targetRotX - gaugeGroup.rotation.x) * 0.05;
    gaugeGroup.rotation.y += (targetRotY - gaugeGroup.rotation.y) * 0.05;
    gaugeGroup.position.y = baseGaugeY - window.scrollY * 0.0016;

    // Surgical Controlled 3D Separation (No exaggerated camera collisions)
    // Needle & Billet Hub: Controlled lift forward
    needlePivot.position.z = 0.08 + scrollProgress * 1.35;
    needlePivot.rotation.x = scrollProgress * 0.18;

    // Inner Cyan Telemetry Ring: Mid-plane lift
    innerMesh.position.z = 0.03 + scrollProgress * 0.75;
    innerMesh.scale.set(1 + scrollProgress * 0.08, 1 + scrollProgress * 0.08, 1);

    // Speed Yellow Power Band: Graceful upper-right expansion
    yellowMesh.position.z = 0.02 + scrollProgress * 0.55;
    yellowMesh.position.x = scrollProgress * 0.45;
    yellowMesh.position.y = scrollProgress * 0.30;

    // Outer Scale (0-340 KM/H): Subtle radial expansion
    outerMesh.position.z = 0.01 - scrollProgress * 0.65;
    outerMesh.scale.set(1 + scrollProgress * 0.18, 1 + scrollProgress * 0.18, 1);

    // Base Plate: Controlled recession
    baseMesh.position.z = -scrollProgress * 1.2;

    // Blueprint Guides: Subtle pulse during mid-disassembly
    guideMat.opacity = Math.sin(scrollProgress * Math.PI) * 0.40 * fade;

    // Smooth Opacity Fade across all layers
    baseMat.opacity = 0.95 * fade;
    outerMat.opacity = 0.95 * fade;
    yellowMat.opacity = 0.95 * fade;
    innerMat.opacity = 0.95 * fade;
    needleMat.opacity = fade;
    needleMat.transparent = fade < 0.99;

    // ------------------------------------------------------------------------
    // C. Dynamic Engine Rev & Idle Rumble Physics
    // ------------------------------------------------------------------------
    if (!startupSweepActive) {
      const scrollSurge = Math.min(2.0, Math.abs(scrollVel) * 0.08 + scrollProgress * 1.6);
      scrollVel *= 0.92;

      const idlePulse = Math.sin(elapsedTime * 4.5) * 0.025 + Math.sin(elapsedTime * 9.2) * 0.012;
      currentNeedleAngle += (targetNeedleAngle - scrollSurge + idlePulse - currentNeedleAngle) * 0.08;
    }

    needlePivot.rotation.z = currentNeedleAngle;

    renderer.render(scene, camera);
  }

  animate();
}

// --------------------------------------------------------------------------
// HIGH-TECH WORD FORMING & CIPHER DECRYPTION ENGINE
// Actively forms "ADI PERFORMANCE" letter-by-letter on page entry
// --------------------------------------------------------------------------
const TELEMETRY_GLYPHS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>/{}[];*+=_~^$#@';

function formWordEffect(element, duration = 1800, delay = 100) {
  if (element._formingWord) return;
  element._formingWord = true;
  element.style.whiteSpace = 'nowrap';

  const targetText = element.getAttribute('data-value') || element.textContent.trim() || 'ADI PERFORMANCE';
  const len = targetText.length;
  
  // Set initial encrypted telemetry state immediately (so the full word does not show at first)
  let initialCipher = '';
  for (let i = 0; i < len; i++) {
    initialCipher += targetText[i] === ' ' ? ' ' : TELEMETRY_GLYPHS[Math.floor(Math.random() * TELEMETRY_GLYPHS.length)];
  }
  element.textContent = initialCipher;

  setTimeout(() => {
    const startTime = performance.now();

    function updateForming(now) {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);

      // Non-linear pacing: start fast on 'ADI', then deliberate mechanical lock-in on 'PERFORMANCE'
      const ease = 1 - Math.pow(1 - progress, 2.5);
      const lockedCount = Math.floor(len * ease);

      let html = '';
      for (let i = 0; i < len; i++) {
        const char = targetText[i];
        const isAdi = i < 3; // 'ADI'
        if (char === ' ') {
          html += '<span class="brand-divider" style="display:inline-block; width:0.45em;">&nbsp;</span>';
        } else if (i < lockedCount) {
          // Locked characters with live motorsport colors
          const colorStyle = isAdi 
            ? 'color:#FFD000; text-shadow: 0 0 16px rgba(255,208,0,0.8), 0 0 30px rgba(255,140,0,0.4);' 
            : 'color:#00F0FF; text-shadow: 0 0 16px rgba(0,240,255,0.75), 0 0 30px rgba(0,163,224,0.4);';
          html += `<span style="display:inline-block; text-align:center; min-width:0.65ch; ${colorStyle}">${char}</span>`;
        } else if (i === lockedCount) {
          // Active forming head: brilliant flashing specular pulse
          const activeGlyph = TELEMETRY_GLYPHS[Math.floor(Math.random() * TELEMETRY_GLYPHS.length)];
          const headColor = isAdi ? '#FFE600' : '#FFFFFF';
          html += `<span style="display:inline-block; text-align:center; min-width:0.65ch; color:${headColor}; text-shadow: 0 0 20px #00F0FF, 0 0 35px #FFD000; font-weight:900;">${activeGlyph}</span>`;
        } else {
          // Unformed cipher stream: dim neon matrix glyph in fixed slot
          const cipherGlyph = TELEMETRY_GLYPHS[Math.floor(Math.random() * TELEMETRY_GLYPHS.length)];
          const cipherColor = isAdi ? 'rgba(255, 208, 0, 0.28)' : 'rgba(0, 220, 255, 0.25)';
          html += `<span style="display:inline-block; text-align:center; min-width:0.65ch; color:${cipherColor}; font-weight:400;">${cipherGlyph}</span>`;
        }
      }

      element.innerHTML = html;

      if (progress < 1) {
        requestAnimationFrame(updateForming);
      } else {
        // Final locked-in state: High-Voltage dual-tone motorsport gradient
        element.innerHTML = '<span class="brand-adi" style="background: linear-gradient(135deg, #FFF066 0%, #FFD000 45%, #FF8800 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 0 25px rgba(255, 208, 0, 0.7)); display: inline-block;">ADI</span><span class="brand-divider" style="display:inline-block; width:0.4em;">&nbsp;</span><span class="brand-perf" style="background: linear-gradient(135deg, #FFFFFF 0%, #B8F0FF 40%, #00F0FF 75%, #0090DF 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 0 28px rgba(0, 240, 255, 0.65)); display: inline-block;">PERFORMANCE</span>';
        element._formingWord = false;
      }
    }

    requestAnimationFrame(updateForming);
  }, delay);
}

function scrambleText(element, duration = 850) {
  if (element._scrambling || element._formingWord) return;
  element._scrambling = true;

  const originalText = element.getAttribute('data-value') || element.textContent.trim();
  const startTime = performance.now();

  function updateScramble(now) {
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / duration);
    const revealedLength = Math.floor(originalText.length * progress);

    let output = '';
    for (let i = 0; i < originalText.length; i++) {
      if (originalText[i] === ' ') {
        output += ' ';
      } else if (i < revealedLength) {
        output += originalText[i];
      } else {
        output += TELEMETRY_GLYPHS[Math.floor(Math.random() * TELEMETRY_GLYPHS.length)];
      }
    }

    element.textContent = output;

    if (progress < 1) {
      requestAnimationFrame(updateScramble);
    } else {
      element.textContent = originalText;
      element._scrambling = false;
    }
  }

  requestAnimationFrame(updateScramble);
}

function initScrambleEffects() {
  // Hero title word-forming on page load
  const heroTitle = document.querySelector('.scramble-target');
  if (heroTitle) {
    // Initiate word forming animation (slower, deliberate pace for cinematic luxury feel)
    formWordEffect(heroTitle, 2800, 150);

    // Hover effect: re-form the word on mouse hover
    heroTitle.style.cursor = 'pointer';
    heroTitle.addEventListener('mouseenter', () => {
      formWordEffect(heroTitle, 2200, 0);
    });
  }

  // Hover scramble on navigation links & badges
  const hoverLinks = document.querySelectorAll('.scramble-hover');
  hoverLinks.forEach((link) => {
    link.addEventListener('mouseenter', () => scrambleText(link, 500));
  });
}
/* ==========================================================================
   5. NUMBER COUNTERS IN HERO
   ========================================================================== */
function initStatCounters() {
  const statElements = document.querySelectorAll('.stat-num');
  let hasTriggered = false;

  function runCounters() {
    statElements.forEach((el) => {
      const target = parseFloat(el.getAttribute('data-count') || 0);
      const isDecimal = target % 1 !== 0;
      const duration = 1600;
      const startTime = performance.now();

      function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const current = ease * target;

        el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = isDecimal ? target.toFixed(1) : target.toLocaleString();
        }
      }
      requestAnimationFrame(update);
    });
  }

  // Trigger when visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting && !hasTriggered) {
        hasTriggered = true;
        runCounters();
      }
    });
  }, { threshold: 0.3 });

  const heroRow = document.querySelector('.hero-telemetry-row');
  if (heroRow) observer.observe(heroRow);
}

/* ==========================================================================
   6. AUTOMOTIVE DIAGNOSTIC CONSOLE (Interactive CAN-bus Terminal)
   ========================================================================== */
function initDiagnosticTerminal() {
  const termBody = document.getElementById('terminal-body');
  const quickBtns = document.querySelectorAll('.qb-btn');
  if (!termBody) return;

  const logTemplates = {
    stage1: `
      <div class="term-line"><span class="prompt">$</span> <span class="cmd">adi-flash --target=ECU --mode=STAGE_1_OEM_PLUS</span></div>
      <div class="term-output">
        <span class="dim">[0.02s]</span> Checksum calculated: <span class="highlight">0x8F44A9B2</span> <span class="ok">[VALID]</span><br>
        <span class="dim">[0.15s]</span> Writing target map: +0.35 bar boost, +3.5° timing<br>
        <span class="dim">[0.42s]</span> Verifying CAN communication... <span class="ok">[100% OK]</span><br>
        <span class="gr">STAGE 1 FLASHED: Factory safeguards retained. Dyno ready!</span>
      </div>`,
    stage2: `
      <div class="term-line"><span class="prompt">$</span> <span class="cmd">adi-flash --stage=STAGE_2 --downpipe=SPORT_CAT --decat_dtc=OFF</span></div>
      <div class="term-output">
        <span class="dim">[0.01s]</span> Reading wideband O2 lambda sensors... <span class="val">Target AFR: 11.7</span><br>
        <span class="dim">[0.18s]</span> Cat-efficiency DTC suppressed (no CEL).<br>
        <span class="dim">[0.35s]</span> Scaling boost to 2.25 bar peak.<br>
        <span class="gr">STAGE 2 ACTIVE: Exhaust gas temps mitigated. Aggressive spool!</span>
      </div>`,
    turbo: `
      <div class="term-line"><span class="prompt">$</span> <span class="cmd">adi-custom-tune --turbo="ADI_G30_900_HYBRID" --fuel="E85_FLEX"</span></div>
      <div class="term-output">
        <span class="dim">[0.03s]</span> High-pressure fuel pump (HPFP) scaling: <span class="highlight">350 bar</span><br>
        <span class="dim">[0.21s]</span> Ethanol sensor calibrated: <span class="val">E82 blend detected</span><br>
        <span class="dim">[0.44s]</span> Boost pressure set: 2.85 bar. Wastegate pre-spooled.<br>
        <span class="gr">ADI BIG TURBO READY: 900+ HP peak target locked. Track test!</span>
      </div>`,
    crackle: `
      <div class="term-line"><span class="prompt">$</span> <span class="cmd">adi-overrun --burble=AGGRESSIVE --trigger=SPORT_PLUS_MODE</span></div>
      <div class="term-output">
        <span class="dim">[0.02s]</span> Fuel cut delay set: <span class="val">1.4s post throttle-lift</span><br>
        <span class="dim">[0.12s]</span> Retarded ignition timing on overrun: <span class="highlight">-18° ATDC</span><br>
        <span class="gr">POP &amp; BANG CALIBRATED: Active only in Sport+ Mode. Stock in Comfort!</span>
      </div>`
  };

  quickBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');
      if (action === 'clear') {
        termBody.innerHTML = `
          <div class="term-line active-line">
            <span class="prompt">$</span> <span id="interactive-cmd-text">adi-telemetry --ready</span><span class="cursor-block">█</span>
          </div>`;
        return;
      }

      if (logTemplates[action]) {
        // Append log above the active cursor
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = logTemplates[action];
        const activeLine = termBody.querySelector('.active-line');
        if (activeLine) {
          termBody.insertBefore(tempDiv, activeLine);
        } else {
          termBody.appendChild(tempDiv);
        }
        termBody.scrollTop = termBody.scrollHeight;
      }
    });
  });
}

/* ==========================================================================
   7. VEHICLE TUNING CONFIGURATOR & GAIN CALCULATOR
   ========================================================================== */
const CAR_DATABASE = {
  bmw: {
    name: 'BMW M3 G80 Competition (S58)',
    ecu: 'ECU: Bosch MG1CS024 • 3.0L Twin-Turbo Inline-6',
    stock: { hp: 510, nm: 650, zeroToHundred: '3.9s', boost: '1.7 bar' },
    stages: {
      1: { hp: 620, nm: 800, zeroToHundred: '3.2s', boost: '2.1 bar', price: 'Stage 1 Package: Software + Dyno Session' },
      2: { hp: 700, nm: 880, zeroToHundred: '2.9s', boost: '2.35 bar', price: 'Stage 2 Package: Downpipes + Flash + Dyno' },
      3: { hp: 890, nm: 1020, zeroToHundred: '2.5s', boost: '2.85 bar', price: 'Stage 3 ADI Big Turbo Build: Custom Hardware & Dyno' }
    }
  },
  audi: {
    name: 'Audi RS6 Avant C8 (4.0 TFSI V8)',
    ecu: 'ECU: Bosch MD1CS006 • 4.0L Twin-Turbo Mild-Hybrid',
    stock: { hp: 600, nm: 800, zeroToHundred: '3.6s', boost: '1.8 bar' },
    stages: {
      1: { hp: 720, nm: 950, zeroToHundred: '3.1s', boost: '2.2 bar', price: 'Stage 1 Package: Software + Dyno Session' },
      2: { hp: 820, nm: 1060, zeroToHundred: '2.8s', boost: '2.45 bar', price: 'Stage 2 Package: High-Flow Downpipes + Remap' },
      3: { hp: 1000, nm: 1200, zeroToHundred: '2.4s', boost: '2.9 bar', price: 'Stage 3 ADI 1000HP Package: Hybrid Turbos + Forged' }
    }
  },
  mercedes: {
    name: 'Mercedes-AMG C63S (W205 M177)',
    ecu: 'ECU: Bosch MED17.7.5 • 4.0L Bi-Turbo Hot-V V8',
    stock: { hp: 510, nm: 700, zeroToHundred: '4.0s', boost: '1.6 bar' },
    stages: {
      1: { hp: 600, nm: 850, zeroToHundred: '3.4s', boost: '2.0 bar', price: 'Stage 1 Package: Software + Dyno Session' },
      2: { hp: 680, nm: 920, zeroToHundred: '3.1s', boost: '2.3 bar', price: 'Stage 2 Package: Downpipes + Turbo Inlets + Map' },
      3: { hp: 850, nm: 1050, zeroToHundred: '2.7s', boost: '2.7 bar', price: 'Stage 3 ADI V8 Build: Pure Turbos + Meth Injection' }
    }
  },
  porsche: {
    name: 'Porsche 911 Turbo S (992 3.8T)',
    ecu: 'ECU: Bosch MG1CS042 • 3.8L Twin-Turbo Boxer-6',
    stock: { hp: 650, nm: 800, zeroToHundred: '2.7s', boost: '1.75 bar' },
    stages: {
      1: { hp: 760, nm: 940, zeroToHundred: '2.4s', boost: '2.15 bar', price: 'Stage 1 Package: Software + Dyno Session' },
      2: { hp: 830, nm: 1020, zeroToHundred: '2.2s', boost: '2.4 bar', price: 'Stage 2 Package: Titanium Exhaust + Intercoolers + Map' },
      3: { hp: 980, nm: 1150, zeroToHundred: '1.95s', boost: '2.85 bar', price: 'Stage 3 ADI 992 Package: VTG Upgrades + Syvecs' }
    }
  },
  vw: {
    name: 'Volkswagen Golf 8 R (EA888.4 TSI)',
    ecu: 'ECU: Continental Simos 19.6 • 2.0L Turbo 4-Cylinder',
    stock: { hp: 320, nm: 420, zeroToHundred: '4.7s', boost: '1.5 bar' },
    stages: {
      1: { hp: 400, nm: 510, zeroToHundred: '3.9s', boost: '1.9 bar', price: 'Stage 1 Package: Software + Dyno Session' },
      2: { hp: 440, nm: 560, zeroToHundred: '3.5s', boost: '2.2 bar', price: 'Stage 2 Package: Intercooler + Downpipe + Map' },
      3: { hp: 550, nm: 650, zeroToHundred: '3.0s', boost: '2.7 bar', price: 'Stage 3 ADI Big Turbo EA888: Garrett G25-660' }
    }
  },
  toyota: {
    name: 'Toyota GR Supra 3.0 (B58 Twin-Scroll)',
    ecu: 'ECU: Bosch MG1CS201 • 3.0L Turbo Inline-6',
    stock: { hp: 382, nm: 500, zeroToHundred: '4.1s', boost: '1.4 bar' },
    stages: {
      1: { hp: 460, nm: 630, zeroToHundred: '3.5s', boost: '1.85 bar', price: 'Stage 1 Package: Software + Dyno Session' },
      2: { hp: 520, nm: 710, zeroToHundred: '3.2s', boost: '2.2 bar', price: 'Stage 2 Package: Catless Downpipe + Chargepipe + Map' },
      3: { hp: 750, nm: 880, zeroToHundred: '2.8s', boost: '2.65 bar', price: 'Stage 3 ADI Supra Turbo Kit: Top Mount Precision' }
    }
  }
};

let currentBrand = 'bmw';
let currentStage = 1;

function initConfigurator() {
  const brandButtons = document.querySelectorAll('.brand-card');
  const stageButtons = document.querySelectorAll('.stage-tab');

  brandButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      brandButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentBrand = btn.getAttribute('data-brand');
      updateDynoDisplay();
    });
  });

  stageButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      stageButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentStage = parseInt(btn.getAttribute('data-stage'));
      updateDynoDisplay();
    });
  });

  updateDynoDisplay();
}

function updateDynoDisplay() {
  const car = CAR_DATABASE[currentBrand];
  if (!car) return;

  const stageData = car.stages[currentStage];
  const hpGain = stageData.hp - car.stock.hp;
  const nmGain = stageData.nm - car.stock.nm;

  // Update text & headers
  document.getElementById('dyno-car-title').textContent = car.name;
  document.getElementById('dyno-ecu-desc').textContent = car.ecu;
  document.getElementById('stock-hp').textContent = car.stock.hp;
  document.getElementById('tuned-hp').textContent = stageData.hp;
  document.getElementById('stock-nm').textContent = car.stock.nm;
  document.getElementById('tuned-nm').textContent = stageData.nm;

  document.getElementById('hp-gain').textContent = `+${hpGain} HP GAIN`;
  document.getElementById('nm-gain').textContent = `+${nmGain} NM TORQUE`;

  document.getElementById('accel-stat').textContent = `${car.stock.zeroToHundred} → ${stageData.zeroToHundred}`;
  document.getElementById('boost-stat').textContent = `${car.stock.boost} → ${stageData.boost}`;
  document.getElementById('stage-price-est').textContent = stageData.price;

  // Update progress bars (relative to 1000 HP and 1200 Nm scale)
  const hpPct = Math.min(100, Math.round((stageData.hp / 1000) * 100));
  const nmPct = Math.min(100, Math.round((stageData.nm / 1200) * 100));
  document.getElementById('hp-bar').style.width = `${hpPct}%`;
  document.getElementById('nm-bar').style.width = `${nmPct}%`;
}

/* ==========================================================================
   8. 3D TILT EFFECT ON SERVICE CARDS
   ========================================================================== */
function init3DTilt() {
  const cards = document.querySelectorAll('.tilt-card');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Set CSS variables for spotlight radial glow
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // 3D tilt calculation
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

/* ==========================================================================
   9. INTERACTIVE LAUNCHPAD MATRIX GRID (As shown in video!)
   ========================================================================== */
function initLaunchpadMatrix() {
  const grid = document.getElementById('matrix-grid');
  const inspTitle = document.getElementById('insp-title');
  const inspDesc = document.getElementById('insp-desc');
  const inspSpecs = document.getElementById('insp-specs');
  if (!grid) return;

  const PROTOCOL_ITEMS = [
    { icon: '⚡', title: 'Bosch MG1 / MD1 Protocol', desc: 'Next-gen tri-core microprocessor bench and OBD-II unlock with encrypted seed bypass.', specs: 'CAN-FD • DoIP • SHA-256' },
    { icon: '🏎️', title: 'Twin-Turbo Anti-Lag System', desc: 'Maintains turbine spool off-throttle via cyclic fuel dump and ignition retard.', specs: 'Boost on lift • 0.8 bar pre-spool' },
    { icon: '⚙️', title: 'ZF 8HP Clamping Pressure', desc: 'Raises clutch line pressure to 21 bar, allowing up to 1,100 Nm without slip.', specs: 'ZF8HP50/70/76/90 • Shift: 120ms' },
    { icon: '🔥', title: 'Overrun Burble & Pop Flames', desc: 'Custom tailored exhaust decel pops switchable via drive modes.', specs: 'Map-switchable • Cat safe' },
    { icon: '📊', title: 'Dyno Data Telemetry Stream', desc: 'High-speed 100Hz CAN logging: Air-Fuel Ratio, Knock Voltages, Boost, EGT.', specs: '100Hz • 64-channel logging' },
    { icon: '🛠️', title: 'Continental Simos 19.x Unlock', desc: 'Bench unlock protocol for late-model VW EA888 Gen 4 and Audi S3/Golf R.', specs: 'Tricore TC290 • Bootloader OK' },
    { icon: '🚀', title: '2-Step Launch Control', desc: 'Stationary rev-limiter holding optimal boost off the line for AWD drag launches.', specs: 'Adjustable RPM • WOT Box' },
    { icon: '💧', title: 'Water-Methanol Dual Map', desc: 'Progressive injection failsafe map for extreme intake charge cooling.', specs: 'Dual nozzle • 250 PSI pump' },
    { icon: '⛽', title: 'FlexFuel E85 Real-Time Scaling', desc: 'Automatic timing and fuel advance based on live ethanol content sensor input.', specs: 'E10 - E85 auto-blend' }
  ];

  // Create 36 pads
  for (let i = 0; i < 36; i++) {
    const pad = document.createElement('div');
    pad.className = 'matrix-pad';
    
    const proto = PROTOCOL_ITEMS[i % PROTOCOL_ITEMS.length];
    
    // Highlight specific pads with orange / cyan as in video
    if (i === 4 || i === 13 || i === 22) pad.classList.add('highlight-orange');
    if (i === 8 || i === 17 || i === 31) pad.classList.add('highlight-cyan');

    pad.innerHTML = `<span>${proto.icon}</span>`;
    pad.setAttribute('title', proto.title);

    pad.addEventListener('click', () => {
      document.querySelectorAll('.matrix-pad').forEach(p => p.classList.remove('active'));
      pad.classList.add('active');

      if (inspTitle) inspTitle.textContent = proto.title;
      if (inspDesc) inspDesc.textContent = proto.desc;
      if (inspSpecs) {
        inspSpecs.innerHTML = proto.specs.split('•').map(s => `<span>${s.trim()}</span>`).join('');
      }
    });

    grid.appendChild(pad);
  }
}

/* ==========================================================================
   10. INTERACTIVE TERMINAL CLI MODAL (Ctrl + K)
   ========================================================================== */
function initTerminalModal() {
  const modal = document.getElementById('terminal-modal');
  const openBtns = document.querySelectorAll('.terminal-trigger-btn, #open-terminal-modal');
  const closeBtn = document.getElementById('close-modal-btn');
  const closeDot = document.getElementById('close-modal-dot');
  const backdrop = document.getElementById('modal-backdrop');
  const cmdInput = document.getElementById('modal-cmd-input');
  const cmdOutput = document.getElementById('modal-terminal-output');

  function openModal() {
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    if (cmdInput) setTimeout(() => cmdInput.focus(), 100);
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  openBtns.forEach(btn => btn.addEventListener('click', openModal));
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (closeDot) closeDot.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  // Global Ctrl+K / Cmd+K listener
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      modal.classList.contains('open') ? closeModal() : openModal();
    }
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  // CLI Command Interpreter
  if (cmdInput && cmdOutput) {
    cmdInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const input = cmdInput.value.trim();
        cmdInput.value = '';
        if (!input) return;

        printCLILine(`> ${input}`, '#fff');
        executeCLI(input.toLowerCase());
      }
    });
  }

  function printCLILine(text, color = 'var(--text-secondary)') {
    const line = document.createElement('div');
    line.style.color = color;
    line.style.margin = '4px 0';
    line.innerHTML = text;
    cmdOutput.appendChild(line);
    cmdOutput.scrollTop = cmdOutput.scrollHeight;
  }

  function executeCLI(cmd) {
    if (cmd === 'help') {
      printCLILine(`
        AVAILABLE COMMANDS:<br>
        • <span class="highlight">tune</span> - Show available tuning stages<br>
        • <span class="highlight">cars</span> - List supported performance car makes<br>
        • <span class="highlight">dyno</span> - View live AWD dyno cell status<br>
        • <span class="highlight">contact</span> - Jump directly to booking form<br>
        • <span class="highlight">clear</span> - Clear terminal history<br>
        • <span class="highlight">whoami</span> - Identity &amp; credentials
      `);
    } else if (cmd === 'tune') {
      printCLILine(`
        [ ADI PERFORMANCE STAGES ]<br>
        • Stage 1: Software Remap (+20% to +35% BHP / Torque)<br>
        • Stage 2: Hardware Downpipes + Intercooler (+35% to +50% BHP)<br>
        • Stage 3: ADI Big Turbo Fabrication &amp; Forged Builds (+100%+ BHP)<br>
        • TCU Remap: Transmission shift speed &amp; torque limit removal
      `);
    } else if (cmd === 'cars') {
      printCLILine(`
        SUPPORTED MAKES: BMW (M2/M3/M4/M5/M8), Audi (RS3/RS4/RS6/RS7/R8), Porsche (911/Cayman/Taycan), Mercedes-AMG (C63/E63/GT), VW (Golf R/GTI), Toyota Supra, Nissan G-TR.
      `);
    } else if (cmd === 'dyno') {
      printCLILine(`
        AWD DYNO CELL: <span class="ok">[ONLINE]</span><br>
        • Capacity: 2,000 HP All-Wheel Drive Linked Dyno<br>
        • Airflow: 85,000 CFM High-Velocity Dual Extraction Fans<br>
        • Calibration: Brake retarders active. Ready for runs.
      `);
    } else if (cmd === 'contact') {
      closeModal();
      window.location.hash = '#contact';
    } else if (cmd === 'clear') {
      cmdOutput.innerHTML = '<div class="term-greeting">Console cleared. Type "help" for options.</div>';
    } else if (cmd === 'whoami') {
      printCLILine(`
        <b>ADI PERFORMANCE</b> // Automotive Diagnostics &amp; Calibration<br>
        • Experience: 10+ Years Professional Automotive Service<br>
        • HQ: Cité Djilali Ahmed, Staoueli, Alger<br>
        • Contact: Contact@Adi-Performance.com | +213 770 95 72 27<br>
        • Specialty: Stage 1/2/3 ECU Remapping, Dyno Calibration, Online File Service
      `);
    } else {
      printCLILine(`Command not recognized: "${cmd}". Type <span class="highlight">help</span> for assistance.`, '#FF5F56');
    }
  }
}

/* ==========================================================================
   11. BOOKING FORM HANDLER
   ========================================================================== */
function submitInquiry() {
  const name = document.getElementById('cust-name').value;
  const car = document.getElementById('cust-car').value;
  const successMsg = document.getElementById('form-success-msg');

  if (successMsg) {
    successMsg.style.display = 'block';
    successMsg.innerHTML = `✓ Thank you, ${name}! Your inquiry for <b>${car}</b> has been received. Our ECU calibrator will get back to you shortly.`;
  }
}


/* ==========================================================================
   AERODYNAMIC WIND-TUNNEL STREAMLINES ENGINE (High-Visibility & Neon Glow)
   ========================================================================== */
function initAmbientBackground() {
  const spotlight = document.getElementById('mouse-spotlight');
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight * 0.45;
  let spotX = mouseX;
  let spotY = mouseY;
  let smoothMX = mouseX;
  let smoothMY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  function renderSpotlight() {
    spotX += (mouseX - spotX) * 0.08;
    spotY += (mouseY - spotY) * 0.08;

    if (spotlight) {
      spotlight.style.setProperty('--spot-x', `${spotX}px`);
      spotlight.style.setProperty('--spot-y', `${spotY}px`);
    }
    requestAnimationFrame(renderSpotlight);
  }
  requestAnimationFrame(renderSpotlight);
}

/* ==========================================================================
   SCROLL REVEAL & INERTIA CARD ENGINE
   ========================================================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  
  // 1. IntersectionObserver for smooth staggered entrance
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        // keep observing or unobserve once in
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  reveals.forEach((el) => observer.observe(el));

  // 2. Scroll Velocity Physics on Cards (Inertial Tilt on Fast Scroll)
  let lastScrollY = window.scrollY;
  let scrollVelocity = 0;
  let smoothVelocity = 0;
  let isTicking = false;

  window.addEventListener('scroll', () => {
    const currentY = window.scrollY;
    scrollVelocity = currentY - lastScrollY;
    lastScrollY = currentY;

    if (!isTicking) {
      window.requestAnimationFrame(() => {
        smoothVelocity += (scrollVelocity - smoothVelocity) * 0.15;
        // Clamp tilt angle between -4 and +4 degrees
        const tiltAngle = Math.max(-4, Math.min(4, smoothVelocity * 0.08));

        document.querySelectorAll('.service-card.in, .record-card.in').forEach((card) => {
          // If not currently hovered by mouse, apply subtle scroll inertia tilt
          if (!card.matches(':hover')) {
            card.style.transform = `perspective(1000px) rotateX(${-tiltAngle}deg)`;
          }
        });

        // Decay velocity
        smoothVelocity *= 0.88;
        isTicking = false;
      });
      isTicking = true;
    }
  }, { passive: true });
}