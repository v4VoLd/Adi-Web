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
  let seed = 7;
  const rr = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const rnd = (a, b) => a + rr() * (b - a);

  // Generate 70 3D faceted metallic shards
  const N = 70;
  const shards = [];
  for (let i = 0; i < N; i++) {
    const th = (i / N) * Math.PI * 2 + rnd(-0.02, 0.02);
    const aw = ((Math.PI * 2) / N) * rnd(1.3, 2.4);
    const ri = rnd(0.9, 0.99);
    const ro = ri + rnd(0.05, 0.2);

    // 6-vertex faceted polygon (rough mechanical edges)
    const poly = [
      [ri + rnd(-0.02, 0.02), -aw / 2],
      [ri + rnd(-0.03, 0.02), aw / 2],
      [ro - rnd(0, 0.04), (aw / 2) * rnd(0.5, 1)],
      [ro + rnd(0, 0.03), aw * rnd(-0.1, 0.2)],
      [ro - rnd(0, 0.05), (-aw / 2) * rnd(0.5, 1)],
      [ri + rnd(0.02, 0.08), (-aw / 2) * rnd(0.8, 1.1)]
    ];

    shards.push({
      th,
      poly,
      tilt: rnd(-0.5, 0.5),
      tilt2: rnd(-0.4, 0.4),
      z: rnd(-0.16, 0.16),
      thick: rnd(0.015, 0.05),
      sx: rnd(-1, 1),
      sy: rnd(-1, 1),
      sz: rnd(-1, 1),
      sr: rnd(-2, 2),
      tone: rnd(0, 1),
      ph: rnd(0, 6.28),
      big: rr() > 0.82
    });
  }

  // Floating ambient metallic dust particles & laser streaks
  const dust = Array.from({ length: 90 }, () => ({
    x: rnd(-1.2, 1.2),
    y: rnd(-1.2, 1.2),
    z: rnd(-1, 1),
    v: rnd(0.05, 0.25)
  }));

  const streaks = Array.from({ length: 4 }, () => ({
    a: rnd(0, 6.28),
    r: rnd(0.15, 0.7),
    l: rnd(0.25, 0.5),
    p: rnd(0, 6.28)
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
    rot += 0.0016 + boost;
    tx += (mx * 0.5 - tx) * 0.04;
    ty += (my * 0.4 - ty) * 0.04;

    const R = Math.min(W, H) * (W < 700 ? 0.38 : 0.375);
    const cx = W / 2;
    const cy = H * 0.5 - window.scrollY * 0.12;
    const as = ease(assemble);

    const A = Math.sin(rot * 0.8) * 0.35 + tx;
    const B = 0.22 + Math.sin(rot * 0.5) * 0.12 + ty;
    const ca = Math.cos(A), sa = Math.sin(A);
    const cb = Math.cos(B), sb = Math.sin(B);

    // 3D Perspective Projection Function
    const proj = (x, y, z) => {
      const x1 = x * ca + z * sa;
      const z1 = -x * sa + z * ca;
      const y1 = y * cb - z1 * sb;
      const z2 = y * sb + z1 * cb;
      const s = 1 / (2.6 - z2 * 0.6);
      return [cx + x1 * R * s * 2.3, cy + y1 * R * s * 2.3, z2, s];
    };

    // Inner subtle dark vignette disk behind text
    const rg = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 1.1);
    rg.addColorStop(0, 'rgba(8, 9, 12, 0.82)');
    rg.addColorStop(0.8, 'rgba(10, 11, 14, 0.55)');
    rg.addColorStop(1, 'rgba(10, 11, 14, 0)');
    ctx.globalAlpha = fade * as;
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.1, 0, Math.PI * 2);
    ctx.fill();

    // Project and depth-sort shards
    const list = [];
    const k = 1 - as;
    for (const s of shards) {
      const ang = s.th + rot * 0.12;
      const ox = s.sx * (k * 2.4 + ex * 2.6);
      const oy = s.sy * (k * 2.4 + ex * 2.2) + ex * ex * 0.9;
      const oz = s.sz * (k * 1.6 + ex * 2);
      const mid = (s.poly[0][0] + s.poly[2][0]) / 2;
      const t = s.tilt + (k * 2.2 + ex * 3.2) * s.sr + Math.sin(now * 0.5 + s.ph) * 0.05;
      const u = s.tilt2;

      const pts = s.poly.map(([r, da]) => {
        const x = Math.cos(ang + da) * r;
        const y = Math.sin(ang + da) * r;
        const dx = x - Math.cos(ang) * mid;
        const dy = y - Math.sin(ang) * mid;
        return proj(x + ox, y + oy, s.z + dx * Math.sin(t) * 0.9 + dy * Math.sin(u) * 0.9 + oz);
      });

      list.push({ pts, z: pts.reduce((a, p) => a + p[2], 0) / pts.length, s });
    }

    list.sort((a, b) => a.z - b.z);

    const lx = Math.cos(now * 0.25);
    const ly = -0.6;

    // Render Faceted Metallic Shards
    for (const o of list) {
      const { pts, s } = o;
      const a = fade * (0.15 + 0.85 * as);
      const th = s.thick * R * 2;

      // Extruded thickness (dark underside)
      ctx.globalAlpha = a;
      ctx.fillStyle = '#14171d';
      ctx.beginPath();
      pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1] + th * p[3] * 2) : ctx.moveTo(p[0], p[1] + th * p[3] * 2)));
      ctx.closePath();
      ctx.fill();

      // Faceted Shaded Metallic Surfaces
      for (let i = 1; i < pts.length - 1; i++) {
        const A0 = pts[0], B0 = pts[i], C0 = pts[i + 1];
        const nx = Math.sin(s.ph + i * 1.9 + now * 0.35);
        const f = 0.5 + 0.5 * (nx * lx + ly * 0.2);
        const v = Math.max(0, Math.min(1, 0.18 + f * 0.5 * (0.5 + s.tone * 0.7) + ((o.z + 1) / 2) * 0.22));

        // Titanium metallic specular color tone
        ctx.fillStyle = `rgb(${28 + v * 88 | 0}, ${33 + v * 92 | 0}, ${42 + v * 98 | 0})`;
        ctx.beginPath();
        ctx.moveTo(A0[0], A0[1]);
        ctx.lineTo(B0[0], B0[1]);
        ctx.lineTo(C0[0], C0[1]);
        ctx.closePath();
        ctx.fill();
      }

      // Metallic Specular Edge Gleam
      ctx.strokeStyle = `rgba(200, 214, 235, ${0.1 + 0.3 * ((o.z + 1) / 2)})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
      ctx.closePath();
      ctx.stroke();

      // Highlight on larger shards (Speed Yellow motorsport accents)
      if (s.big) {
        ctx.strokeStyle = 'rgba(255, 208, 0, 0.85)';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(pts[1][0], pts[1][1]);
        ctx.lineTo(pts[2][0], pts[2][1]);
        ctx.stroke();
      }
    }

    // High-Tech Dashed Laser Streaks (Speed Yellow & Electric Cyan)
    ctx.lineWidth = 1;
    for (const s of streaks) {
      const p = (Math.sin(now * 0.5 + s.p) + 1) / 2;
      if (p < 0.4) continue;
      const a1 = s.a + now * 0.04;
      const x0 = Math.cos(a1) * s.r;
      const y0 = Math.sin(a1) * s.r;
      const x1 = x0 + Math.cos(a1 + 1.3) * s.l;
      const y1 = y0 + Math.sin(a1 + 1.3) * s.l;
      const P0 = proj(x0, y0, 0);
      const P1 = proj(x1, y1, 0);

      ctx.strokeStyle = (s.p > 3.14) ? 'rgba(255, 208, 0, 0.95)' : 'rgba(0, 220, 255, 0.9)';
      ctx.globalAlpha = (p - 0.4) * 1.1 * fade * as;
      ctx.setLineDash([7, 6]);
      ctx.beginPath();
      ctx.moveTo(P0[0], P0[1]);
      ctx.lineTo(P1[0], P1[1]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Floating Ambient Dust Particles
    ctx.fillStyle = '#dfe7f5';
    for (const d of dust) {
      d.y -= d.v * 0.0016;
      if (d.y < -1.2) d.y = 1.2;
      const P = proj(d.x, d.y, d.z * 0.5);
      ctx.globalAlpha = (0.12 + (P[2] + 1) * 0.25) * fade * as;
      ctx.fillRect(P[0], P[1], 1.3, 1.3);
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  draw();
}

const GL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/\\{}[]#$%&*+=_~^';

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