import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

// Auto-generated 3D Model Viewer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2.5, 8);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.4;
renderer.outputColorSpace = THREE.SRGBColorSpace || THREE.sRGBEncoding;
document.body.appendChild(renderer.domElement);

// ASCII Effect Setup
const asciiChars = ' .:-=+*#%@';
const asciiCanvas = document.createElement('canvas');
const asciiCtx = asciiCanvas.getContext('2d');
const asciiPre = document.createElement('pre');
asciiPre.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;margin:0;padding:0;background:#000;color:#fff;font-family:monospace;font-size:10px;line-height:10px;letter-spacing:0px;overflow:hidden;z-index:10;pointer-events:none;display:flex;align-items:center;justify-content:center;white-space:pre;';
document.body.appendChild(asciiPre);

// Render target for reading pixels
// Monospace chars are ~0.6x as wide as they are tall, so we need more cols to fill width
const charAspectRatio = 0.6;
const baseRows = 80;
const baseCols = Math.round(baseRows * (window.innerWidth / window.innerHeight) / charAspectRatio);
const asciiResolution = { cols: baseCols, rows: baseRows };
const renderTarget = new THREE.WebGLRenderTarget(asciiResolution.cols, asciiResolution.rows, {
  minFilter: THREE.LinearFilter,
  magFilter: THREE.LinearFilter,
  format: THREE.RGBAFormat
});
let pixelBufferRef = { buffer: new Uint8Array(asciiResolution.cols * asciiResolution.rows * 4) };

function updateAsciiSize() {
  // Font size is determined by how many rows fit vertically
  const fontSize = Math.floor(window.innerHeight / asciiResolution.rows);
  asciiPre.style.fontSize = fontSize + 'px';
  asciiPre.style.lineHeight = fontSize + 'px';
}
updateAsciiSize();

// Color mode toggle
let asciiColorMode = false; // true = colored, false = green monochrome
// Control panel
const controlPanel = document.createElement('div');
controlPanel.style.cssText = 'position:fixed;top:10px;right:10px;z-index:20;display:flex;flex-direction:column;gap:8px;font-family:Inter,system-ui,sans-serif;font-size:13px;color:#fff;';
document.body.appendChild(controlPanel);

// Settings toggle button
let panelOpen = false;
const settingsBtn = document.createElement('button');
settingsBtn.textContent = '⚙ Settings';
settingsBtn.style.cssText = 'padding:8px 16px;background:rgba(255,255,255,0.1);color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:6px;font-family:inherit;font-size:13px;cursor:pointer;backdrop-filter:blur(4px);align-self:flex-end;';
controlPanel.appendChild(settingsBtn);

// Collapsible panel
const panelBody = document.createElement('div');
panelBody.style.cssText = 'padding:12px 14px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:6px;backdrop-filter:blur(4px);display:none;flex-direction:column;gap:10px;';
controlPanel.appendChild(panelBody);

settingsBtn.addEventListener('click', () => {
  panelOpen = !panelOpen;
  panelBody.style.display = panelOpen ? 'flex' : 'none';
  settingsBtn.textContent = panelOpen ? '✕ Close' : '⚙ Settings';
});

// Toggle Color button
const toggleBtn = document.createElement('button');
toggleBtn.textContent = 'Toggle Color';
toggleBtn.style.cssText = 'padding:8px 16px;background:rgba(255,255,255,0.08);color:#fff;border:1px solid rgba(255,255,255,0.15);border-radius:6px;font-family:inherit;font-size:13px;cursor:pointer;';
toggleBtn.addEventListener('click', () => { asciiColorMode = !asciiColorMode; });
panelBody.appendChild(toggleBtn);

// Toggle Auto-Rotate button
const orbitBtn = document.createElement('button');
orbitBtn.textContent = 'Auto-Rotate: ON';
orbitBtn.style.cssText = 'padding:8px 16px;background:rgba(255,255,255,0.08);color:#fff;border:1px solid rgba(255,255,255,0.15);border-radius:6px;font-family:inherit;font-size:13px;cursor:pointer;';
orbitBtn.addEventListener('click', () => {
  controls.autoRotate = !controls.autoRotate;
  orbitBtn.textContent = 'Auto-Rotate: ' + (controls.autoRotate ? 'ON' : 'OFF');
});
panelBody.appendChild(orbitBtn);

// Light direction controls
const lightBox = document.createElement('div');
lightBox.style.cssText = 'display:flex;flex-direction:column;gap:6px;';
panelBody.appendChild(lightBox);

const lightTitle = document.createElement('div');
lightTitle.textContent = 'Light Direction';
lightTitle.style.cssText = 'font-size:11px;text-transform:uppercase;letter-spacing:0.05em;opacity:0.6;margin-bottom:2px;';
lightBox.appendChild(lightTitle);

let lightAngleH = Math.atan2(5, 5); // horizontal angle
let lightAngleV = Math.atan2(8, Math.sqrt(50)); // vertical angle
const lightRadius = 10;

function updateLightFromAngles() {
  const x = lightRadius * Math.cos(lightAngleV) * Math.sin(lightAngleH);
  const y = lightRadius * Math.sin(lightAngleV);
  const z = lightRadius * Math.cos(lightAngleV) * Math.cos(lightAngleH);
  mainLight.position.set(x, Math.max(y, 0.5), z);
}

function makeSlider(label, min, max, value, step, onChange) {
  const row = document.createElement('div');
  row.style.cssText = 'display:flex;align-items:center;gap:8px;';
  const lbl = document.createElement('span');
  lbl.textContent = label;
  lbl.style.cssText = 'width:14px;font-size:12px;opacity:0.7;';
  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = min;
  slider.max = max;
  slider.value = value;
  slider.step = step;
  slider.style.cssText = 'flex:1;accent-color:#888;height:2px;cursor:pointer;';
  slider.addEventListener('input', (e) => onChange(parseFloat(e.target.value)));
  row.appendChild(lbl);
  row.appendChild(slider);
  lightBox.appendChild(row);
  return slider;
}

makeSlider('H', (-Math.PI).toFixed(2), Math.PI.toFixed(2), lightAngleH.toFixed(2), '0.05', (v) => {
  lightAngleH = v;
  updateLightFromAngles();
});

makeSlider('V', '0.05', (Math.PI / 2).toFixed(2), lightAngleV.toFixed(2), '0.05', (v) => {
  lightAngleV = v;
  updateLightFromAngles();
});

const intensitySlider = makeSlider('I', '0', '4', '1.8', '0.1', (v) => {
  mainLight.intensity = v;
});

// Make renderer canvas hidden since we show ASCII
renderer.domElement.style.position = 'fixed';
renderer.domElement.style.top = '0';
renderer.domElement.style.left = '0';
renderer.domElement.style.zIndex = '0';
renderer.domElement.style.opacity = '0';
renderer.domElement.style.pointerEvents = 'auto';

// Overlay to capture mouse events on the ASCII display
asciiPre.style.pointerEvents = 'none';
const interactionOverlay = document.createElement('div');
interactionOverlay.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:15;';
document.body.appendChild(interactionOverlay);

// Procedural environment map for realistic reflections
(function createEnvironment() {
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  const envScene = new THREE.Scene();

  // Gradient sky dome
  const skyGeo = new THREE.SphereGeometry(50, 32, 32);
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    uniforms: {
      topColor: { value: new THREE.Color(0x1a1a2e) },
      bottomColor: { value: new THREE.Color(0x0a0a0a) },
      midColor: { value: new THREE.Color(0x151520) },
      offset: { value: 10 },
      exponent: { value: 0.4 }
    },
    vertexShader: `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 topColor;
      uniform vec3 bottomColor;
      uniform vec3 midColor;
      uniform float offset;
      uniform float exponent;
      varying vec3 vWorldPosition;
      void main() {
        float h = normalize(vWorldPosition + offset).y;
        float t = max(pow(max(h, 0.0), exponent), 0.0);
        vec3 color = mix(bottomColor, midColor, smoothstep(0.0, 0.3, t));
        color = mix(color, topColor, smoothstep(0.3, 1.0, t));
        gl_FragColor = vec4(color, 1.0);
      }
    `
  });
  envScene.add(new THREE.Mesh(skyGeo, skyMat));

  // Add some soft area lights to the env scene for reflections
  const envLight1 = new THREE.PointLight(0xffffff, 80, 100);
  envLight1.position.set(10, 15, 10);
  envScene.add(envLight1);

  const envLight2 = new THREE.PointLight(0x8888cc, 40, 100);
  envLight2.position.set(-10, 10, -5);
  envScene.add(envLight2);

  const envLight3 = new THREE.PointLight(0xccaa88, 30, 100);
  envLight3.position.set(5, 3, -10);
  envScene.add(envLight3);

  const envMap = pmremGenerator.fromScene(envScene, 0.04).texture;
  scene.environment = envMap;
  envScene.traverse(child => { if (child.geometry) child.geometry.dispose(); if (child.material) child.material.dispose(); });
  pmremGenerator.dispose();
})();

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const hemiLight = new THREE.HemisphereLight(0xc8d0e0, 0x2a2a3a, 0.6);
scene.add(hemiLight);

const mainLight = new THREE.DirectionalLight(0xffffff, 1.8);
mainLight.position.set(5, 8, 5);
mainLight.castShadow = true;
mainLight.shadow.mapSize.width = 2048;
mainLight.shadow.mapSize.height = 2048;
mainLight.shadow.camera.near = 0.1;
mainLight.shadow.camera.far = 30;
mainLight.shadow.camera.left = -5;
mainLight.shadow.camera.right = 5;
mainLight.shadow.camera.top = 5;
mainLight.shadow.camera.bottom = -5;
mainLight.shadow.bias = -0.001;
scene.add(mainLight);

const fillLight = new THREE.DirectionalLight(0xcccccc, 0.6);
fillLight.position.set(-3, 4, -3);
scene.add(fillLight);

const rimLight = new THREE.DirectionalLight(0xffffff, 0.4);
rimLight.position.set(0, 2, -5);
scene.add(rimLight);

// Shadow catcher (invisible ground that only shows shadows)
const groundGeo = new THREE.PlaneGeometry(20, 20);
const groundMat = new THREE.ShadowMaterial({ opacity: 0.4 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// Controls - attach to interaction overlay so clicks work over the ASCII display
const controls = new OrbitControls(camera, interactionOverlay);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0, 0.8, 0);
controls.autoRotate = true;
controls.autoRotateSpeed = 2;
controls.update();

// Loading indicator
const loadingDiv = document.createElement('div');
loadingDiv.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);color:white;font-family:system-ui;font-size:16px;text-align:center;';
loadingDiv.innerHTML = 'Loading 3D model...';
document.body.appendChild(loadingDiv);

// Load GLB/GLTF model (with Draco decompression support)
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);
// Create a torus with standard material
const torusGeo = new THREE.TorusGeometry(1, 0.4, 64, 128);
const torusMat = new THREE.MeshStandardMaterial({
  color: 0xaaaacc,
  metalness: 0.4,
  roughness: 0.3,
});
const torus = new THREE.Mesh(torusGeo, torusMat);
torus.name = 'rainbowTorus';
torus.position.y = 1.2;
torus.castShadow = true;
torus.receiveShadow = true;

scene.add(torus);

controls.target.set(0, 1.2, 0);
controls.update();
loadingDiv.remove();

// Animation loop
const clock = new THREE.Clock();
let frameCount = 0;

function animate() {
  requestAnimationFrame(animate);
  const elapsed = clock.getElapsedTime();
  frameCount++;



  controls.update();

  // Render to screen normally (hidden) and to render target for ASCII
  renderer.render(scene, camera);

  // Only update ASCII every 2 frames for performance
  if (frameCount % 2 === 0) {
    renderer.setRenderTarget(renderTarget);
    renderer.render(scene, camera);
    renderer.setRenderTarget(null);

    const currentBuffer = pixelBufferRef.buffer;
    renderer.readRenderTargetPixels(renderTarget, 0, 0, asciiResolution.cols, asciiResolution.rows, currentBuffer);

    let asciiStr = '';
    const cols = asciiResolution.cols;
    const rows = asciiResolution.rows;
    const chars = asciiChars;
    const charLen = chars.length - 1;

    if (asciiColorMode) {
      // Colored ASCII with spans
      for (let y = rows - 1; y >= 0; y--) {
        for (let x = 0; x < cols; x++) {
          const i = (y * cols + x) * 4;
          const r = currentBuffer[i];
          const g = currentBuffer[i + 1];
          const b = currentBuffer[i + 2];
          const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          const charIndex = Math.floor(luminance * charLen);
          const ch = chars[charIndex];
          if (luminance < 0.02) {
            asciiStr += ' ';
          } else {
            asciiStr += '<span style="color:rgb(' + r + ',' + g + ',' + b + ')">' + ch + '</span>';
          }
        }
        asciiStr += '\n';
      }
      asciiPre.innerHTML = asciiStr;
    } else {
      // White monochrome - use textContent for speed
      for (let y = rows - 1; y >= 0; y--) {
        for (let x = 0; x < cols; x++) {
          const i = (y * cols + x) * 4;
          const r = currentBuffer[i];
          const g = currentBuffer[i + 1];
          const b = currentBuffer[i + 2];
          const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          const charIndex = Math.floor(luminance * charLen);
          asciiStr += chars[charIndex];
        }
        asciiStr += '\n';
      }
      asciiPre.style.color = '#fff';
      asciiPre.textContent = asciiStr;
    }
  }
}
animate();

// Resize handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Update render target to match new aspect ratio
  const newRows = 80;
  const newCols = Math.round(newRows * (window.innerWidth / window.innerHeight) / charAspectRatio);
  asciiResolution.cols = newCols;
  asciiResolution.rows = newRows;
  renderTarget.setSize(newCols, newRows);

  // Reallocate pixel buffer for new size
  const newBufferSize = newCols * newRows * 4;
  if (pixelBufferRef.buffer.length !== newBufferSize) {
    pixelBufferRef.buffer = new Uint8Array(newBufferSize);
  }

  updateAsciiSize();
});