/**
 * scene.js — Motor 3D de la mascota con Three.js
 * API pública: init(container, emoji), setEmoji(str), celebrate()
 */
import * as THREE from 'three';
import { EffectComposer }  from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass }      from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

let renderer, scene, camera, composer;
let petMesh, petGlow, ring1, ring2;
let particleSystem;
let clock = new THREE.Clock();
let mouse = new THREE.Vector2(0, 0);
let smoothMouse = new THREE.Vector2(0, 0);
let celebrateTimer = null;
let isInitialized = false;

// ── Public API ──────────────────────────────────────────────────────
export function init(container, emoji = '🥚') {
    try {
        const W = container.clientWidth || 350;
        const H = container.clientHeight || 320;

        // --- Renderer ---
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Canvas fills container but stays behind HTML overlays (z-index 0)
    const cv = renderer.domElement;
    cv.style.position = 'absolute';
    cv.style.inset = '0';
    cv.style.zIndex = '0';
    cv.style.borderRadius = 'inherit';
    container.appendChild(cv);

    // --- Scene ---
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060e24);
    scene.fog = new THREE.FogExp2(0x060e24, 0.03);

    // --- Camera ---
    camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 200);
    camera.position.set(0, 1.5, 9);
    camera.lookAt(0, 0.5, 0);

    // --- Build scene objects ---
    _addLights();
    _addFloor();
    _addParticles();
    _addRings();
    _addPet(emoji);

    // --- Post-processing: bloom ---
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(W, H), 1.2, 0.5, 0.15));

    // --- Resize observer ---
    new ResizeObserver(() => {
        const w = container.clientWidth, h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        composer.setSize(w, h);
    }).observe(container);

    // --- Mouse ---
    container.addEventListener('mousemove', e => {
        const r = container.getBoundingClientRect();
        mouse.x =  ((e.clientX - r.left) / r.width)  * 2 - 1;
        mouse.y = -((e.clientY - r.top)  / r.height) * 2 + 1;
    });
    container.addEventListener('mouseleave', () => { mouse.set(0, 0); });
    container.addEventListener('click', _burst);

    _loop();
    isInitialized = true;
    const fallback = container.querySelector('#petEmojiFallback');
    if (fallback) fallback.style.display = 'none';
    } catch (err) {
        console.warn('Three.js scene init failed or WebGL not supported, falling back gracefully:', err);
    }
}

export function setEmoji(emoji) {
    if (!petMesh) return;
    petMesh.material.map = _emojiTex(emoji);
    petMesh.material.needsUpdate = true;
}

export function celebrate() {
    if (celebrateTimer) clearInterval(celebrateTimer);
    let t = 0;
    celebrateTimer = setInterval(() => {
        if (!petMesh) return;
        petMesh.scale.setScalar(1 + 0.4 * Math.abs(Math.sin(t * 0.2)));
        if (petGlow) petGlow.material.emissiveIntensity = 1.5 + Math.sin(t * 0.3);
        t++;
        if (t > 90) {
            clearInterval(celebrateTimer);
            celebrateTimer = null;
            petMesh.scale.setScalar(1);
            if (petGlow) petGlow.material.emissiveIntensity = 0.6;
        }
    }, 16);
}

// ── Private helpers ─────────────────────────────────────────────────
function _addLights() {
    scene.add(new THREE.AmbientLight(0x1a3a6e, 3));

    const key = new THREE.DirectionalLight(0x6ec6ff, 5);
    key.position.set(4, 8, 5);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    scene.add(key);

    const rim = new THREE.DirectionalLight(0xff6eb4, 1.8);
    rim.position.set(-5, 2, -4);
    scene.add(rim);

    const fill = new THREE.PointLight(0x1CB0F6, 4, 15);
    fill.position.set(0, -1, 2);
    scene.add(fill);
}

function _addFloor() {
    const geo = new THREE.PlaneGeometry(60, 60);
    const mat = new THREE.MeshStandardMaterial({
        color: 0x070f26, roughness: 0.05, metalness: 0.95
    });
    const floor = new THREE.Mesh(geo, mat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2.5;
    floor.receiveShadow = true;
    scene.add(floor);

    const grid = new THREE.GridHelper(60, 40, 0x1CB0F6, 0x0a1f44);
    grid.position.y = -2.49;
    grid.material.transparent = true;
    grid.material.opacity = 0.35;
    scene.add(grid);
}

function _emojiTex(emoji) {
    const size = 256;
    const cv = document.createElement('canvas');
    cv.width = cv.height = size;
    const ctx = cv.getContext('2d');
    ctx.font = `${size * 0.72}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, size / 2, size / 2 + 8);
    return new THREE.CanvasTexture(cv);
}

function _addPet(emoji) {
    // Emoji sprite (always faces camera)
    const mat = new THREE.MeshBasicMaterial({
        map: _emojiTex(emoji), transparent: true, depthWrite: false, side: THREE.DoubleSide
    });
    petMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 2.4), mat);
    petMesh.position.set(0, 0.6, 0);
    scene.add(petMesh);

    // Bloom sphere behind emoji
    petGlow = new THREE.Mesh(
        new THREE.SphereGeometry(1.05, 32, 32),
        new THREE.MeshStandardMaterial({
            color: 0x1CB0F6, emissive: 0x1CB0F6, emissiveIntensity: 0.6,
            roughness: 0.3, metalness: 0.9, transparent: true, opacity: 0.15
        })
    );
    petGlow.position.copy(petMesh.position);
    scene.add(petGlow);

    // Shadow disc
    const shadow = new THREE.Mesh(
        new THREE.CircleGeometry(1.0, 32),
        new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.5 })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.set(0, -2.48, 0);
    scene.add(shadow);
}

function _addParticles() {
    const N = 280;
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    const c1 = new THREE.Color(0x1CB0F6), c2 = new THREE.Color(0x84D8FF);

    for (let i = 0; i < N; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi   = Math.acos(2 * Math.random() - 1);
        const r     = 2.5 + Math.random() * 5.5;
        pos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
        pos[i*3+1] = r * Math.cos(phi) - 0.5;
        pos[i*3+2] = r * Math.sin(phi) * Math.sin(theta);
        const c = Math.random() > 0.5 ? c1 : c2;
        col[i*3] = c.r; col[i*3+1] = c.g; col[i*3+2] = c.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));

    particleSystem = new THREE.Points(geo, new THREE.PointsMaterial({
        size: 0.07, vertexColors: true, transparent: true,
        opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending
    }));
    scene.add(particleSystem);
}

function _addRings() {
    const matA = new THREE.MeshBasicMaterial({ color: 0x1CB0F6, transparent: true, opacity: 0.55 });
    const matB = new THREE.MeshBasicMaterial({ color: 0x84D8FF, transparent: true, opacity: 0.3  });
    ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.018, 16, 120), matA);
    ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.010, 16, 120), matB);
    ring1.rotation.x = Math.PI / 3;
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.z =  Math.PI / 5;
    ring1.position.y = ring2.position.y = 0.6;
    scene.add(ring1, ring2);
}

function _burst() {
    let t = 0;
    const id = setInterval(() => {
        if (petMesh) petMesh.scale.setScalar(1 + 0.18 * Math.abs(Math.sin(t * 0.45)));
        t++;
        if (t > 24) { clearInterval(id); if (petMesh) petMesh.scale.setScalar(1); }
    }, 16);
}

// ── Render loop ─────────────────────────────────────────────────────
function _loop() {
    requestAnimationFrame(_loop);
    const t = clock.getElapsedTime();

    // Smooth mouse follow
    smoothMouse.x += (mouse.x - smoothMouse.x) * 0.04;
    smoothMouse.y += (mouse.y - smoothMouse.y) * 0.04;

    // Parallax camera orbit
    camera.position.x = Math.sin(smoothMouse.x * 0.5) * 9;
    camera.position.y = 1.5 + smoothMouse.y * 1.5;
    camera.position.z = Math.cos(smoothMouse.x * 0.5) * 9;
    camera.lookAt(0, 0.5, 0);

    // Pet: float + always face camera
    if (petMesh) {
        petMesh.position.y = 0.6 + Math.sin(t * 1.1) * 0.22;
        petGlow.position.y = petMesh.position.y;
        petMesh.lookAt(camera.position);
    }

    // Rings spin
    if (ring1) ring1.rotation.y = t * 0.45;
    if (ring2) ring2.rotation.y = -t * 0.3;

    // Particles drift
    if (particleSystem) {
        particleSystem.rotation.y =  t * 0.04;
        particleSystem.rotation.x =  t * 0.012;
    }

    composer.render();
}
