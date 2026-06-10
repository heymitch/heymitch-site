// Wingman hero flight: live three.js formation rendered as micro-ASCII.
// Your F-14 (ice canopy) + your Wingman (orange canopy) slides into echelon,
// then FRIDAY's HUD card + first message appear: the Slack convo starts there.
// Prototyped in the wingman repo: design-system/hero-flight.html.
import * as THREE from 'three';

const PAPER = '#F1EEEA', INK = '#2D2118', ORANGE = '#DEA821', ICE = '#4FA8D8';
const RAMP = " `'.,:;i!l~+x*uoahkbdwOZ#MW&8%B@";
const BLANK_T = 0.16, SS = 2;

const stage = document.getElementById('flight-stage');
const cv = document.getElementById('flight-canvas');
const crewEl = document.getElementById('crew');
if (!stage || !cv) throw new Error('flight: stage missing');
const ctx = cv.getContext('2d');

/* ================= sizing (responsive, retina-aware) ================= */
let W, H, COLS, ROWS, CHAR_W, FS, CH, rt = null, pixels = null;
const renderer = new THREE.WebGLRenderer({ antialias: true });

function setup() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const cssW = Math.max(300, stage.clientWidth);
  const cssH = stage.clientHeight > 80 ? stage.clientHeight : cssW * 0.68;
  W = Math.round(cssW * dpr);
  H = Math.round(cssH * dpr);
  // wide hero canvas: the front camera faces +z, so screen-x is MIRRORED —
  // aiming at +x pushes the formation to the screen's RIGHT, clear of the copy.
  // Modest shift: the formation spans ~25 units, push too far and a jet clips.
  if (W / H > 1.4) LOOK.set(6, -1.0, -19);
  else LOOK.set(0, -3.5, -19);
  cv.width = W; cv.height = H;
  FS = 4 * dpr; CH = 5 * dpr;
  ctx.font = `${FS}px "IBM Plex Mono", monospace`;
  ctx.textBaseline = 'top';
  CHAR_W = ctx.measureText('M').width;
  COLS = Math.floor(W / CHAR_W);
  ROWS = Math.floor(H / CH);
  camera.aspect = W / H;
  camera.updateProjectionMatrix();
  renderer.setSize(COLS * SS, ROWS * SS, false);
  if (rt) rt.dispose();
  rt = new THREE.WebGLRenderTarget(COLS * SS, ROWS * SS);
  pixels = new Uint8Array(COLS * SS * ROWS * SS * 4);
}

/* ================= scene ================= */
const scene = new THREE.Scene();
scene.background = new THREE.Color(PAPER);
scene.fog = new THREE.Fog(new THREE.Color(PAPER), 60, 240);
const camera = new THREE.PerspectiveCamera(58, 1.72, 0.1, 500);

const sun = new THREE.DirectionalLight(0xfff1dd, 1.7);
sun.position.set(-20, 30, -25);
scene.add(sun);
const lamp = new THREE.PointLight(0xffe9c9, 900, 0, 2);
lamp.position.set(-16, 12, -28);
scene.add(lamp);
scene.add(new THREE.AmbientLight(0xf1eeea, 0.4));

const M_BODY  = new THREE.MeshLambertMaterial({ color: 0x8A7965 });
const M_DARK  = new THREE.MeshLambertMaterial({ color: 0x4A3A28 });
const M_GLASS = new THREE.MeshLambertMaterial({ color: 0xDEA821 }); // wingman: mustard
const M_ICE   = new THREE.MeshLambertMaterial({ color: 0x8FD4F0 }); // you: ice

function buildF14() {
  const g = new THREE.Group();
  const fus = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.85, 7.4, 10), M_BODY);
  fus.rotation.x = Math.PI / 2; fus.scale.x = 1.65; fus.scale.y = 0.62;
  g.add(fus);
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.52, 2.6, 10), M_BODY);
  nose.rotation.x = -Math.PI / 2; nose.position.z = -4.9; nose.scale.x = 1.2; nose.scale.y = 0.8;
  g.add(nose);
  const can = new THREE.Mesh(new THREE.SphereGeometry(0.62, 10, 8), M_GLASS);
  can.position.set(0, 0.52, -2.5); can.scale.set(0.85, 0.62, 1.9);
  g.add(can);
  for (const s of [-1, 1]) {
    const intake = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.85, 4.6), M_DARK);
    intake.position.set(s * 1.45, -0.12, -0.4);
    g.add(intake);
    const wing = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.14, 1.9), M_BODY);
    wing.position.set(s * 3.6, 0.18, 0.9);
    wing.rotation.y = -s * 0.56; // swept BACK: friendly, not aggro
    g.add(wing);
    const tail = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.7, 1.6), M_DARK);
    tail.position.set(s * 1.1, 0.95, 3.0);
    tail.rotation.z = s * -0.18;
    tail.rotation.x = 0.12;
    g.add(tail);
    const stab = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.1, 1.2), M_BODY);
    stab.position.set(s * 2.1, 0.05, 3.2);
    stab.rotation.y = -s * 0.38;
    g.add(stab);
  }
  return g;
}

// the wingman (slightly smaller, arrives)
const jet = buildF14();
jet.scale.setScalar(0.92);
scene.add(jet);

// YOUR jet: ice-blue cockpit
const player = buildF14();
player.traverse((m) => { if (m.isMesh && m.material === M_GLASS) m.material = M_ICE; });
player.position.set(-5, -3.6, -19);
scene.add(player);

// distant lead for squadron depth
const lead = buildF14();
lead.position.set(-19, -5.5, -60);
lead.rotation.y = 0.06;
scene.add(lead);

/* ================= choreography ================= */
const FC = new THREE.Vector3(0, -3.5, -19);
const LOOK = new THREE.Vector3(0, -3.5, -19); // camera aim (x shifts on wide canvases)
const CAM = new THREE.Vector3(0, 2.2, -37); // front view: room for the whole pair
const path = new THREE.CatmullRomCurve3([
  new THREE.Vector3(60, 10, -200),
  new THREE.Vector3(36, 6, -110),
  new THREE.Vector3(22, 1, -52),
  new THREE.Vector3(13, -2.6, -26),
  new THREE.Vector3(8.5, -3.9, -15.5),
]);
const APPROACH = 5.2;
let t0 = null, phase = 'hold';
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

let mouseX = 0, mouseY = 0;
addEventListener('pointermove', (e) => {
  mouseX = (e.clientX / innerWidth - 0.5) * 2;
  mouseY = -(e.clientY / innerHeight - 0.5) * 2;
}, { passive: true });

function flyJet(now) {
  const t = t0 === null ? 0 : (now - t0) / 1000;
  const slot = path.getPoint(1);

  if (reduced || t > APPROACH) {
    if (phase !== 'formation') { phase = 'formation'; crewArrived(); }
    const bob = Math.sin(now / 1100) * 0.14;
    jet.position.set(slot.x, slot.y + bob, slot.z);
    jet.rotation.set(Math.sin(now / 1400) * 0.012, 0.06, Math.sin(now / 1600) * 0.02);
  } else {
    phase = 'approach';
    const k = THREE.MathUtils.smoothstep(t / APPROACH, 0, 1);
    const p = path.getPoint(k);
    jet.position.copy(p);
    const ahead = path.getPoint(Math.min(k + 0.02, 1));
    const bank = THREE.MathUtils.clamp((p.x - ahead.x) * 0.4, -0.5, 0.5) * (1 - k * 0.7);
    jet.rotation.set(0.03, 0.06 + bank * 0.2, bank);
  }

  player.position.y = -3.6 + Math.sin(now / 1000) * 0.18;
  player.rotation.z = Math.sin(now / 1500) * 0.04;
  lead.position.y = -5.5 + Math.sin(now / 1400) * 0.3;
  lead.rotation.z = Math.sin(now / 1700) * 0.03;

  camera.position.set(
    CAM.x + mouseX * 1.2,
    CAM.y + Math.sin(now / 1600) * 0.3 + mouseY * 0.8,
    CAM.z
  );
  camera.lookAt(LOOK);
}

/* ================= glyph pass (micro-ascii, 3 ink colors) ================= */
const isIcePx = (r, g, b) => b > 120 && b - r > 30;

function drawFrame() {
  const RW = COLS * SS, RH = ROWS * SS;
  renderer.setRenderTarget(rt);
  renderer.render(scene, camera);
  renderer.readRenderTargetPixels(rt, 0, 0, RW, RH, pixels);
  renderer.setRenderTarget(null);

  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, W, H);
  ctx.font = `${FS}px "IBM Plex Mono", monospace`;

  for (let y = 0; y < ROWS; y++) {
    let inkRow = '', orgRow = '', iceRow = '', hasInk = false, hasOrg = false, hasIce = false;
    for (let x = 0; x < COLS; x++) {
      let r = 0, g = 0, b = 0;
      for (let sy = 0; sy < SS; sy++) {
        const ry = RH - 1 - (y * SS + sy);
        for (let sx = 0; sx < SS; sx++) {
          const i = (ry * RW + (x * SS + sx)) * 4;
          r += pixels[i]; g += pixels[i + 1]; b += pixels[i + 2];
        }
      }
      const n = SS * SS;
      r /= n; g /= n; b /= n;
      const dark = 1 - (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      if (dark < BLANK_T) { inkRow += ' '; orgRow += ' '; iceRow += ' '; continue; }
      const dN = (dark - BLANK_T) / (1 - BLANK_T);
      const chr = RAMP[Math.min(RAMP.length - 1, Math.floor(dN * (RAMP.length - 1) + 0.999))];
      const warm = r > 150 && r - b > 55 && r - g > 25;
      const cool = !warm && isIcePx(r, g, b);
      if (warm)      { orgRow += chr; inkRow += ' '; iceRow += ' '; hasOrg = true; }
      else if (cool) { iceRow += chr; inkRow += ' '; orgRow += ' '; hasIce = true; }
      else           { inkRow += chr; orgRow += ' '; iceRow += ' '; hasInk = true; }
    }
    const py = y * CH;
    if (hasInk) { ctx.fillStyle = INK; ctx.fillText(inkRow, 0, py); }
    if (hasOrg) { ctx.fillStyle = ORANGE; ctx.fillText(orgRow, 0, py); }
    if (hasIce) { ctx.fillStyle = ICE; ctx.fillText(iceRow, 0, py); }
  }
}

/* ================= crew HUD: the convo starts here ================= */
let crewShown = false, msgTimer = null;

function addCrew(src, name, klass, firstMsg) {
  const card = document.createElement('div');
  card.className = 'hud-card';
  card.innerHTML = `
    <div class="hud-portrait">
      <img src="${src}" alt="${name}, your Wingman">
      <i class="tl"></i><i class="tr"></i><i class="bl"></i><i class="br"></i>
    </div>
    <div class="hud-meta">
      <div class="hud-name">${name}<span class="hud-led"></span></div>
      <div class="hud-class">${klass}</div>
      <div class="hud-bar"><i></i></div>
      <div class="hud-status">On your wing &#10003;</div>
    </div>`;
  crewEl.appendChild(card);
  requestAnimationFrame(() => requestAnimationFrame(() => card.classList.add('in')));
  if (firstMsg) {
    const msg = document.createElement('div');
    msg.className = 'hud-msg';
    msg.innerHTML = `<b>${name}</b> &nbsp;${firstMsg}`;
    crewEl.appendChild(msg);
    msgTimer = setTimeout(() => msg.classList.add('in'), 1400);
  }
}

function crewArrived() {
  if (crewShown) return;
  crewShown = true;
  addCrew('/wingman/assets/friday-pfp.png', 'FRIDAY', 'WMN/01 · Personal agent',
    'on your wing. inbox is triaged, brief drops at 7:00. what first?');
}

/* ================= loop: starts when visible, click replays ================= */
let running = false;
function loop(now) {
  if (t0 === null) t0 = now;
  flyJet(now);
  drawFrame();
  requestAnimationFrame(loop);
}

function start() {
  if (running) return;
  running = true;
  setup();
  requestAnimationFrame(loop);
}

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((es) => {
    if (es.some((e) => e.isIntersecting)) { start(); io.disconnect(); }
  }, { threshold: 0.2 });
  io.observe(stage);
} else {
  start();
}

stage.addEventListener('click', () => {
  t0 = null;
  phase = 'hold';
  crewShown = false;
  clearTimeout(msgTimer);
  crewEl.innerHTML = '';
});

let rsT = null;
addEventListener('resize', () => {
  clearTimeout(rsT);
  rsT = setTimeout(() => { if (running) setup(); }, 150);
});
document.fonts.ready.then(() => { if (running) setup(); });
