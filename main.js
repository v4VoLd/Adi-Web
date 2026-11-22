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
   3. PROPOSITION 1: THE MGU-K HYBRID STATOR & DYNO ROTOR BLUEPRINT ENGINE
   24 precision CAD stator coil poles, central dyno rotor hub with cooling ports,
   concentric degree calibration rings, active magnetic flux lasers & exploded scroll view.
   ========================================================================== */
function initMetalRingGlobe() {
  const canvas = document.getElementById('globe');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, D;

  function resize() {
    D = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * D;
    canvas.height = H * D;
    ctx.setTransform(D, 0, 0, D, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  // Random generator with deterministic seed
  let seed = 42;
  const rr = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const rnd = (a, b) => a + rr() * (b - a);

  // 1. Generate 24 Precision MGU-K Electromagnetic Stator Coil Segments
  const N = 24;
  const statorSegments = [];
  const dTheta = (Math.PI * 2) / N;

  for (let i = 0; i < N; i++) {
    const th = i * dTheta;
    const aw_shoe = dTheta * 0.42;    // Inner pole shoe width
    const aw_waist = dTheta * 0.26;   // Coil winding neck width
    const aw_yoke = dTheta * 0.46;    // Outer back-iron yoke width

    const ri = 0.58;                  // Inner air-gap radius
    const rm = 0.75;                  // Mid-pole radius
    const ro = 0.98;                  // Outer back-iron radius

    // Precision 6-vertex Stator Pole CAD geometry
    const poly = [
      [ri, -aw_shoe],
      [ri, aw_shoe],
      [rm, aw_waist],
      [ro, aw_yoke],
      [ro, -aw_yoke],
      [rm, -aw_waist]
    ];

    // Copper winding insert geometry (wrapped around the tooth neck)
    const coilPoly = [
      [rm - 0.04, -aw_waist * 1.15],
      [rm - 0.04, aw_waist * 1.15],
      [rm + 0.12, aw_waist * 1.15],
      [rm + 0.12, -aw_waist * 1.15]
    ];

    statorSegments.push({
      i,
      th,
      poly,
      coilPoly,
      isGoldCoil: (i % 2 === 0), // Speed Yellow copper coil accents
      thick: 0.042,
      tilt: 0,
      tone: (i % 3) / 3,
      ph: (i / N) * Math.PI * 2
    });
  }

  // 2. Generate Central Rotor Core with 8 Axial Ventilation Ports
  const rotorPorts = [];
  const numPorts = 8;
  for (let p = 0; p < numPorts; p++) {
    const ang = (p / numPorts) * Math.PI * 2;
    rotorPorts.push({
      ang,
      r: 0.32,
      size: 0.045
    });
  }

  // 3. High-Speed Magnetic Flux Laser Streaks (Yellow & Electric Cyan)
  const fluxStreaks = Array.from({ length: 6 }, (_, idx) => ({
    r: 0.56 + (idx % 3) * 0.28,
    speed: 0.06 + (idx % 2) * 0.04,
    len: 0.35 + (idx % 2) * 0.25,
    p: (idx / 6) * Math.PI * 2,
    color: idx % 2 === 0 ? 'rgba(255, 208, 0, 0.95)' : 'rgba(0, 220, 255, 0.95)'
  }));

  // 4. Ambient Titanium / Dyno Embers
  const dust = Array.from({ length: 70 }, () => ({
    x: rnd(-1.3, 1.3),
    y: rnd(-1.3, 1.3),
    z: rnd(-0.8, 0.8),
    v: rnd(0.04, 0.22)
  }));

  let assemble = 1;
  let rot = 0;
  let tx = 0;
  let ty = 0;
  let mx = 0;
  let my = 0;
  let boost = 0;
  let ex = 0;
  let scrollVel = 0;
  let lastY = window.scrollY;

  window.addEventListener('scroll', () => {
    scrollVel = window.scrollY - lastY;
    lastY = window.scrollY;
  }, { passive: true });

  window.addEventListener('pointermove', (e) => {
    mx = e.clientX / W - 0.5;
    my = e.clientY / H - 0.5;
  }, { passive: true });

  const ease = (t) => 1 - Math.pow(1 - t, 4);

  function draw() {
    ctx.clearRect(0, 0, W, H);

    ex += (Math.min(1, window.scrollY / (H * 0.8)) - ex) * 0.1;
    const fade = Math.max(0, 1 - Math.pow(ex, 1.6));

    if (fade <= 0.01) {
      requestAnimationFrame(draw);
      return;
    }

    boost += (Math.abs(scrollVel) * 0.002 - boost) * 0.08;
    scrollVel *= 0.9;

    const now = performance.now() / 1000;
    rot += 0.0018 + boost;
    tx += (mx * 0.45 - tx) * 0.04;
    ty += (my * 0.35 - ty) * 0.04;

    const R = Math.min(W, H) * (W < 700 ? 0.38 : 0.36);
    const cx = W / 2;
    const cy = H * 0.5 - window.scrollY * 0.12;
    const as = ease(assemble);
    const k = 1 - as;

    const A = Math.sin(rot * 0.7) * 0.32 + tx;
    const B = 0.24 + Math.sin(rot * 0.45) * 0.1 + ty;
    const ca = Math.cos(A), sa = Math.sin(A);
    const cb = Math.cos(B), sb = Math.sin(B);

    // 3D Perspective Projection Matrix
    const proj = (x, y, z) => {
      const x1 = x * ca + z * sa;
      const z1 = -x * sa + z * ca;
      const y1 = y * cb - z1 * sb;
      const z2 = y * sb + z1 * cb;
      const s = 1 / (2.6 - z2 * 0.6);
      return [cx + x1 * R * s * 2.3, cy + y1 * R * s * 2.3, z2, s];
    };

    // Inner subtle dark vignette disk behind text for 100% typography clarity
    const rg = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 1.15);
    rg.addColorStop(0, 'rgba(8, 10, 15, 0.85)');
    rg.addColorStop(0.65, 'rgba(8, 10, 15, 0.65)');
    rg.addColorStop(1, 'rgba(8, 10, 15, 0)');
    ctx.globalAlpha = fade * as;
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.15, 0, Math.PI * 2);
    ctx.fill();

    // --------------------------------------------------------------------------
    // A. CAD Telemetry Concentric Blueprint Rings & Degree Markers
    // --------------------------------------------------------------------------
    const drawCadRing = (radiusVal, strokeStyle, dashArray = [], lineWidth = 1) => {
      ctx.save();
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = lineWidth;
      ctx.setLineDash(dashArray);
      ctx.beginPath();
      const steps = 64;
      for (let s = 0; s <= steps; s++) {
        const a = (s / steps) * Math.PI * 2 + rot * 0.05;
        const px = Math.cos(a) * radiusVal;
        const py = Math.sin(a) * radiusVal;
        const P = proj(px, py, 0);
        if (s === 0) ctx.moveTo(P[0], P[1]);
        else ctx.lineTo(P[0], P[1]);
      }
      ctx.stroke();
      ctx.restore();
    };

    // Outer Blueprint Rings
    ctx.globalAlpha = fade * as * 0.45;
    drawCadRing(1.15, 'rgba(0, 163, 224, 0.55)', [6, 8], 1.2);
    drawCadRing(1.05, 'rgba(255, 208, 0, 0.6)', [12, 10], 1.0);
    drawCadRing(0.52, 'rgba(0, 220, 255, 0.45)', [4, 6], 0.8);

    // Radial Degree Ticks (72 calibration ticks every 5 degrees)
    ctx.lineWidth = 1;
    for (let deg = 0; deg < 360; deg += 10) {
      const a = (deg * Math.PI) / 180 + rot * 0.05;
      const isMajor = (deg % 90 === 0);
      const isSemiMajor = (deg % 30 === 0);
      const len = isMajor ? 0.08 : (isSemiMajor ? 0.05 : 0.025);
      const r1 = 1.05;
      const r2 = r1 + len;

      const P1 = proj(Math.cos(a) * r1, Math.sin(a) * r1, 0);
      const P2 = proj(Math.cos(a) * r2, Math.sin(a) * r2, 0);

      ctx.strokeStyle = isMajor ? 'rgba(255, 208, 0, 0.95)' : (isSemiMajor ? 'rgba(0, 220, 255, 0.7)' : 'rgba(200, 214, 235, 0.3)');
      ctx.beginPath();
      ctx.moveTo(P1[0], P1[1]);
      ctx.lineTo(P2[0], P2[1]);
      ctx.stroke();

      // Major degree text labels in 3D
      if (isMajor) {
        const textPos = proj(Math.cos(a) * (r2 + 0.06), Math.sin(a) * (r2 + 0.06), 0);
        ctx.fillStyle = '#FFD000';
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${deg}°`, textPos[0], textPos[1]);
      }
    }

    // --------------------------------------------------------------------------
    // B. Exploded Stator Pole Segments (24 CAD Electromagnetic Units)
    // --------------------------------------------------------------------------
    const list = [];
    const lx = Math.cos(now * 0.25);
    const ly = -0.6;

    for (const s of statorSegments) {
      const ang = s.th + rot * 0.12;

      // Dynamic Exploded Blueprint Dispersal on Scroll:
      // Radial explosion outward + Z-axis layer separation!
      const radialExplode = (ex * 1.6 + k * 1.8);
      const ox = Math.cos(ang) * radialExplode;
      const oy = Math.sin(ang) * radialExplode;
      const oz = (s.isGoldCoil ? 0.12 : -0.12) * ex * 1.4;

      // Project Stator Tooth Polygons
      const pts = s.poly.map(([r, da]) => {
        const x = Math.cos(ang + da) * r;
        const y = Math.sin(ang + da) * r;
        return proj(x + ox, y + oy, oz);
      });

      // Project Copper Coil Inserts
      const coilPts = s.coilPoly.map(([r, da]) => {
        const x = Math.cos(ang + da) * r;
        const y = Math.sin(ang + da) * r;
        return proj(x + ox, y + oy, oz + 0.015);
      });

      list.push({
        pts,
        coilPts,
        z: pts.reduce((acc, p) => acc + p[2], 0) / pts.length,
        s,
        ang
      });
    }

    // Depth-sort all 3D mechanical elements
    list.sort((a, b) => a.z - b.z);

    for (const o of list) {
      const { pts, coilPts, s } = o;
      const a = fade * (0.2 + 0.8 * as);
      const th = s.thick * R * 1.8;

      // 1. Extruded Mechanical Depth (Dark Titanium Underside)
      ctx.globalAlpha = a;
      ctx.fillStyle = '#0c0f14';
      ctx.beginPath();
      pts.forEach((p, idx) => (idx ? ctx.lineTo(p[0], p[1] + th * p[3] * 2) : ctx.moveTo(p[0], p[1] + th * p[3] * 2)));
      ctx.closePath();
      ctx.fill();

      // 2. Faceted Stator Tooth Shading (Titanium / Tool Steel Finish)
      for (let i = 1; i < pts.length - 1; i++) {
        const A0 = pts[0], B0 = pts[i], C0 = pts[i + 1];
        const nx = Math.sin(s.ph + i * 1.8 + now * 0.35);
        const f = 0.5 + 0.5 * (nx * lx + ly * 0.2);
        const v = Math.max(0, Math.min(1, 0.2 + f * 0.5 * (0.6 + s.tone * 0.5) + ((o.z + 1) / 2) * 0.2));

        // Precision Titanium Color
        ctx.fillStyle = `rgb(${26 + v * 82 | 0}, ${32 + v * 88 | 0}, ${42 + v * 98 | 0})`;
        ctx.beginPath();
        ctx.moveTo(A0[0], A0[1]);
        ctx.lineTo(B0[0], B0[1]);
        ctx.lineTo(C0[0], C0[1]);
        ctx.closePath();
        ctx.fill();
      }

      // 3. Stator Specular Edge Gleams (Electric Cyan outline)
      ctx.strokeStyle = `rgba(0, 163, 224, ${0.15 + 0.35 * ((o.z + 1) / 2)})`;
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      pts.forEach((p, idx) => (idx ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
      ctx.closePath();
      ctx.stroke();

      // 4. Speed Yellow Copper Coil Winding Core Insert
      if (s.isGoldCoil) {
        ctx.fillStyle = 'rgba(255, 208, 0, 0.85)';
        ctx.beginPath();
        coilPts.forEach((cp, cidx) => (cidx ? ctx.lineTo(cp[0], cp[1]) : ctx.moveTo(cp[0], cp[1])));
        ctx.closePath();
        ctx.fill();

        // High-contrast gold gleam
        ctx.strokeStyle = '#FFE066';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
    }

    // --------------------------------------------------------------------------
    // C. Central Dyno Rotor Core & Hub (Lifts Forward in Z on Scroll)
    // --------------------------------------------------------------------------
    const rotorZ = 0.15 + ex * 0.9;
    const P_center = proj(0, 0, rotorZ);

    // Rotor Core Base Disk
    ctx.save();
    ctx.globalAlpha = fade * as * 0.9;
    ctx.fillStyle = '#10141b';
    ctx.strokeStyle = 'rgba(255, 208, 0, 0.8)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    for (let i = 0; i <= 32; i++) {
      const a = (i / 32) * Math.PI * 2 + rot * 0.12;
      const P = proj(Math.cos(a) * 0.42, Math.sin(a) * 0.42, rotorZ);
      if (i === 0) ctx.moveTo(P[0], P[1]);
      else ctx.lineTo(P[0], P[1]);
    }
    ctx.fill();
    ctx.stroke();

    // 8 Axial Cooling Ports
    rotorPorts.forEach((port) => {
      const pAngle = port.ang + rot * 0.12;
      const px = Math.cos(pAngle) * port.r;
      const py = Math.sin(pAngle) * port.r;
      const P = proj(px, py, rotorZ + 0.01);
      ctx.fillStyle = 'rgba(0, 163, 224, 0.65)';
      ctx.beginPath();
      ctx.arc(P[0], P[1], port.size * R * P[3], 0, Math.PI * 2);
      ctx.fill();
    });

    // Central Drive Spline Hub
    ctx.strokeStyle = '#00F0FF';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (let i = 0; i <= 16; i++) {
      const a = (i / 16) * Math.PI * 2 + rot * 0.12;
      const rSpline = (i % 2 === 0) ? 0.18 : 0.14;
      const P = proj(Math.cos(a) * rSpline, Math.sin(a) * rSpline, rotorZ + 0.02);
      if (i === 0) ctx.moveTo(P[0], P[1]);
      else ctx.lineTo(P[0], P[1]);
    }
    ctx.stroke();
    ctx.restore();

    // --------------------------------------------------------------------------
    // D. Active Magnetic Flux Laser Streaks (Yellow & Electric Cyan)
    // --------------------------------------------------------------------------
    ctx.lineWidth = 1.2;
    for (const strk of fluxStreaks) {
      strk.p = (strk.p + strk.speed * (0.016 + boost * 5)) % (Math.PI * 2);
      const aStart = strk.p + rot * 0.12;
      const aEnd = aStart + strk.len;

      ctx.strokeStyle = strk.color;
      ctx.globalAlpha = 0.9 * fade * as;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      const streakSteps = 16;
      for (let st = 0; st <= streakSteps; st++) {
        const a = aStart + (st / streakSteps) * strk.len;
        const P = proj(Math.cos(a) * strk.r, Math.sin(a) * strk.r, 0.02);
        if (st === 0) ctx.moveTo(P[0], P[1]);
        else ctx.lineTo(P[0], P[1]);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // --------------------------------------------------------------------------
    // E. Floating Titanium & Dyno Dust Embers
    // --------------------------------------------------------------------------
    ctx.fillStyle = '#dfe7f5';
    for (const d of dust) {
      d.y -= d.v * 0.0016;
      if (d.y < -1.3) d.y = 1.3;
      const P = proj(d.x, d.y, d.z * 0.6);
      ctx.globalAlpha = (0.12 + (P[2] + 1) * 0.25) * fade * as;
      ctx.fillRect(P[0], P[1], 1.4, 1.4);
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  draw();
}

const GL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/\{}[]#$%&*+=_~^';

function scrambleText(element, duration = 850) {
  if (element._scrambling) return;
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
        output += GL[Math.floor(Math.random() * GL.length)];
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
  // Scramble main hero title on page entry
  const heroTitle = document.querySelector('.scramble-target');
  if (heroTitle) {
    setTimeout(() => scrambleText(heroTitle, 1200), 300);
  }

  // Scramble on hover for navigation links & badges
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