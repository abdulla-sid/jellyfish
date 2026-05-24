import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import bellVert from './shaders/bell.vert?raw';
import bellFrag from './shaders/bell.frag?raw';

const width = window.innerWidth;
const height = window.innerHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
document.body.appendChild(renderer.domElement);

scene.background = new THREE.Color(0x05070d);
const clock = new THREE.Clock();

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;
controls.enablePan = true;

function makeBellProfile(N: number): THREE.Vector2[] {
  const R_max  = 0.800;   // max radius (at the equator)
  const Y_apex = 1.10;    // y at the top of the bell
  const Y_eq   = 0.550;   // y at the widest point
  const Y_rim  = 0.475;   // y at the innermost rim point
  const R_rim  = 0.750;   // r at the innermost rim point

  const H_top = Y_apex - Y_eq;
  const θ_max = Math.acos((Y_rim - Y_eq) / H_top);
  const extraCurl = R_max * Math.sin(θ_max) - R_rim;

  const pts: THREE.Vector2[] = [];
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    const θ = t * θ_max;

    const y = Y_eq + H_top * Math.cos(θ);

    const u = Math.max(0, (θ - Math.PI / 2) / (θ_max - Math.PI / 2));
    const curl = u * u * (3 - 2 * u);
    const r = R_max * Math.sin(θ) - curl * extraCurl;

    pts.push(new THREE.Vector2(r, y));
  }
  pts[0].x = 0.0001;
  return pts;
}

export const BELL_PROFILE: THREE.Vector2[] = makeBellProfile(64);

const lathe = new THREE.LatheGeometry(BELL_PROFILE, 128);

const bellMat = new THREE.ShaderMaterial({
    vertexShader: bellVert,
    fragmentShader: bellFrag,

    uniforms: {
        uTime: { value: 0},
        uPulseAmp: { value: 0.12 },
        uPulseFreq: { value: 1.4 },
        uColorTop: { value: new THREE.Color(0x88aaff) },
        uColorBottom: { value: new THREE.Color(0xc8a0ff) },
        uRimPower: {value: 2.0}
    },

    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.NormalBlending,
})

const bell = new THREE.Mesh(lathe, bellMat);
scene.add(bell);

window.addEventListener('resize', () => {
    let width = window.innerWidth;
    let height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
})

function animate() {
    requestAnimationFrame(animate);
    bellMat.uniforms.uTime.value = clock.getElapsedTime();
    controls.update();
    renderer.render(scene, camera);
}

animate();