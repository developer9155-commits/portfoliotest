/**
 * Murari Kumar - 3D Developer Portfolio
 * ============================================================================
 * Cinematic Low-Poly Miniature World with Three.js, GSAP & Web Audio API
 * Built as a static, browser-ready web application for GitHub Pages.
 * ============================================================================
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/* ==========================================================================
   1. CONFIGURATION & CONSTANTS
   ========================================================================== */

const CONFIG = {
  // Camera view presets for cinematic transitions
  views: {
    home: {
      position: new THREE.Vector3(22, 15, 24),
      target: new THREE.Vector3(0, 2, 0),
      duration: 2.0
    },
    about: {
      position: new THREE.Vector3(-14, 7, 12),
      target: new THREE.Vector3(-6, 2.5, 4),
      duration: 1.8
    },
    skills: {
      position: new THREE.Vector3(12, 11, -3),
      target: new THREE.Vector3(3, 6.5, -4),
      duration: 1.8
    },
    nexora: {
      position: new THREE.Vector3(14, 7, 10),
      target: new THREE.Vector3(7, 3, 3),
      duration: 1.8
    },
    cropindia: {
      position: new THREE.Vector3(-12, 7, -12),
      target: new THREE.Vector3(-4, 2.5, -5),
      duration: 1.8
    },
    education: {
      position: new THREE.Vector3(0, 10, 16),
      target: new THREE.Vector3(0, 3, 2),
      duration: 1.8
    },
    contact: {
      position: new THREE.Vector3(-3, 5, 15),
      target: new THREE.Vector3(-2, 1.8, 8),
      duration: 1.8
    }
  },

  // Interactive 3D Hotspot definitions
  hotspots: [
    {
      id: 'about',
      name: 'About Murari',
      subtitle: 'CSE Diploma Student',
      icon: '👤',
      position: new THREE.Vector3(-6, 3.2, 4),
      color: 0x9333ea
    },
    {
      id: 'skills',
      name: 'Skills & Stack',
      subtitle: 'Languages & Tools',
      icon: '⚡',
      position: new THREE.Vector3(3, 7.5, -4),
      color: 0x3b82f6
    },
    {
      id: 'nexora',
      name: 'Nexora AI',
      subtitle: 'Featured AI Builder',
      icon: '🚀',
      position: new THREE.Vector3(7, 3.8, 3),
      color: 0x14b8a6
    },
    {
      id: 'cropindia',
      name: 'CropIndia AI',
      subtitle: 'Agri Intelligence',
      icon: '🌾',
      position: new THREE.Vector3(-4, 3.2, -5),
      color: 0x10b981
    },
    {
      id: 'contact',
      name: 'Contact & Links',
      subtitle: 'Get In Touch',
      icon: '📬',
      position: new THREE.Vector3(-2, 2.8, 8),
      color: 0xff6b6b
    }
  ],

  // Color Palette
  colors: {
    skyTop: 0x60a5fa,
    skyBottom: 0xc4b5fd,
    fog: 0xa5b4fc,
    islandGrass: 0x22c55e,
    islandSoil: 0x64748b,
    rockDark: 0x334155,
    mountainFront: 0x7c3aed,
    mountainMid: 0x581c87,
    mountainBack: 0x3b0764,
    snow: 0xf8fafc,
    camperCoral: 0xff6b6b,
    camperWhite: 0xf1f5f9,
    road: 0x334155
  }
};

/* ==========================================================================
   2. PROCEDURAL WEB AUDIO ENGINE
   (Generates soothing ambient drone & sound effects without external files)
   ========================================================================== */

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.isMuted = true;
    this.oscillators = [];
    this.gainNode = null;
    this.masterGain = null;
  }

  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    this.ctx = new AudioContextClass();

    // Master volume limiter
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
  }

  startAmbient() {
    if (!this.ctx) this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.isPlaying) return;
    this.isPlaying = true;
    this.isMuted = false;

    // Ambient chords (F major 9 / Dreamy Ethereal Drone: F3, C4, E4, G4)
    const frequencies = [174.61, 261.63, 329.63, 392.00];

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.gainNode.gain.exponentialRampToValueAtTime(0.18, this.ctx.currentTime + 3);
    this.gainNode.connect(this.masterGain);

    // Filter to give warm, analog lo-fi texture
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(520, this.ctx.currentTime);
    filter.Q.setValueAtTime(2, this.ctx.currentTime);
    filter.connect(this.gainNode);

    // Create detuned sine oscillators
    this.oscillators = frequencies.map((freq, i) => {
      const osc = this.ctx.createOscillator();
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Subtle detune for shimmer
      osc.detune.setValueAtTime((i - 1.5) * 6, this.ctx.currentTime);

      const panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
      if (panner) {
        panner.pan.value = (i / (frequencies.length - 1)) * 1.2 - 0.6;
        osc.connect(panner);
        panner.connect(filter);
      } else {
        osc.connect(filter);
      }

      osc.start();
      return osc;
    });
  }

  stopAmbient() {
    if (!this.gainNode || !this.ctx) return;
    this.gainNode.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);
    setTimeout(() => {
      this.oscillators.forEach(osc => {
        try { osc.stop(); osc.disconnect(); } catch (e) {}
      });
      this.oscillators = [];
      this.isPlaying = false;
      this.isMuted = true;
    }, 850);
  }

  toggle() {
    if (this.isMuted) {
      this.startAmbient();
      return true;
    } else {
      this.stopAmbient();
      return false;
    }
  }

  // Soft UI click sound effect
  playClick() {
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(640, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch (e) {}
  }

  // Smooth camera whoosh sound effect
  playWhoosh() {
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(540, this.ctx.currentTime + 0.25);
      osc.frequency.exponentialRampToValueAtTime(180, this.ctx.currentTime + 0.6);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 0.2);
      gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.65);
    } catch (e) {}
  }
}

const audio = new AudioEngine();

/* ==========================================================================
   3. APPLICATION INITIALIZATION & CORE SCENE SETUP
   ========================================================================== */

class PortfolioApp {
  constructor() {
    this.canvas = document.getElementById('webgl-canvas');
    this.clock = new THREE.Clock();
    this.isTransitioning = false;
    this.isTourActive = false;
    this.currentSection = 'home';

    // Animated objects container for tick loop
    this.animatedObjects = {
      clouds: [],
      particles: null,
      windmillBlades: null,
      van: null,
      cyclist: null,
      campfireLight: null,
      hotspotMeshes: []
    };

    // DOM Elements
    this.dom = {
      loadingScreen: document.getElementById('loading-screen'),
      progressBar: document.getElementById('progress-bar'),
      progressPercent: document.getElementById('progress-percent'),
      loadingStatus: document.getElementById('loading-status'),
      skipBtn: document.getElementById('skip-load-btn'),
      audioToggleBtn: document.getElementById('audio-toggle-btn'),
      tourToggleBtn: document.getElementById('tour-toggle-btn'),
      resetCamBtn: document.getElementById('reset-cam-btn'),
      menuToggleBtn: document.getElementById('menu-toggle-btn'),
      mobileMenu: document.getElementById('mobile-menu'),
      mobileMenuClose: document.getElementById('mobile-menu-close'),
      heroCard: document.getElementById('hero-card'),
      modalBackdrop: document.getElementById('content-modal-backdrop'),
      modalPanel: document.getElementById('content-modal'),
      modalCategory: document.getElementById('modal-category'),
      modalHeading: document.getElementById('modal-heading'),
      modalBody: document.getElementById('modal-body'),
      modalCloseBtn: document.getElementById('modal-close-btn'),
      modalBackBtn: document.getElementById('modal-back-btn'),
      hotspotsOverlay: document.getElementById('hotspots-overlay'),
      brandLogo: document.getElementById('brand-logo'),
      navLinks: document.querySelectorAll('.nav-link'),
      mobileNavLinks: document.querySelectorAll('.mobile-nav-link')
    };

    this.initThree();
    this.initEnvironment();
    this.initHotspots();
    this.initUIEvents();
    this.simulateAssetLoading();
    this.animate();
  }

  /* ------------------------------------------------------------------------
     Initialize Three.js Engine & Canvas
     ------------------------------------------------------------------------ */
  initThree() {
    // Scene
    this.scene = new THREE.Scene();

    // Atmosphere Fog for depth
    this.scene.fog = new THREE.FogExp2(CONFIG.colors.fog, 0.016);

    // Camera
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    this.camera.position.copy(CONFIG.views.home.position);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.target.copy(CONFIG.views.home.target);
    this.controls.minDistance = 8;
    this.controls.maxDistance = 60;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.02; // Prevent going beneath island
    this.controls.enablePan = false; // Keep focus on island center

    // Subtle sky background
    this.createSkyBackground();

    // Lighting
    this.setupLighting();

    // Window resize handler
    window.addEventListener('resize', () => this.onWindowResize(), false);

    // Raycasting for 3D clicks
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    window.addEventListener('pointerdown', (e) => this.onPointerDown(e));
  }

  /* ------------------------------------------------------------------------
     Atmospheric Sky Gradient
     ------------------------------------------------------------------------ */
  createSkyBackground() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 128);
    gradient.addColorStop(0, '#537ee8'); // Gentle sky cyan/blue
    gradient.addColorStop(0.5, '#9fa8da'); // Soft lavender mid
    gradient.addColorStop(1, '#e0e7ff'); // Pale horizon
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 128);

    const texture = new THREE.CanvasTexture(canvas);
    this.scene.background = texture;
  }

  /* ------------------------------------------------------------------------
     Lighting Setup
     ------------------------------------------------------------------------ */
  setupLighting() {
    // Hemisphere light: warm sky light + deep purple bounce from below
    const hemiLight = new THREE.HemisphereLight(0xfff7ed, 0x3b0764, 0.9);
    this.scene.add(hemiLight);

    // Directional Sunlight with soft low-poly shadows
    const dirLight = new THREE.DirectionalLight(0xfffbeb, 1.4);
    dirLight.position.set(30, 45, 25);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 120;
    dirLight.shadow.camera.left = -26;
    dirLight.shadow.camera.right = 26;
    dirLight.shadow.camera.top = 26;
    dirLight.shadow.camera.bottom = -26;
    dirLight.shadow.bias = -0.0005;
    this.scene.add(dirLight);

    // Ambient fill light for deep low-poly purple shadows
    const ambientLight = new THREE.AmbientLight(0x7c3aed, 0.45);
    this.scene.add(ambientLight);
  }

  /* ========================================================================
     4. PROCEDURAL LOW-POLY MINIATURE WORLD GENERATION
     ======================================================================== */

  initEnvironment() {
    this.worldGroup = new THREE.Group();
    this.scene.add(this.worldGroup);

    this.createFloatingIslandBase();
    this.createPurpleMountains();
    this.createWindingRoad();
    this.createCamperVan();
    this.createPineTrees();
    this.createVegetationAndRocks();
    this.createCampfireAndCampsite();
    this.createWindmill();
    this.createAiTechStation();
    this.createCropTerraces();
    this.createFloatingClouds();
    this.createFloatingParticles();
    this.createCyclist();
  }

  /* ------------------------------------------------------------------------
     A. Floating Island Base
     ------------------------------------------------------------------------ */
  createFloatingIslandBase() {
    const islandGroup = new THREE.Group();

    // Top grassy plateau (faceted cylinder for low-poly look)
    const topGeo = new THREE.CylinderGeometry(15, 14, 2.5, 18, 2);
    // Deform vertices slightly for organic feel
    const pos = topGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      if (y > 0) {
        // Vary surface height subtly
        pos.setY(i, y + (Math.sin(pos.getX(i) * 0.4) + Math.cos(pos.getZ(i) * 0.4)) * 0.4);
      }
    }
    topGeo.computeVertexNormals();

    const topMat = new THREE.MeshStandardMaterial({
      color: CONFIG.colors.islandGrass,
      flatShading: true,
      roughness: 0.85
    });
    const topMesh = new THREE.Mesh(topGeo, topMat);
    topMesh.position.y = 1;
    topMesh.receiveShadow = true;
    islandGroup.add(topMesh);

    // Inverted rocky bedrock core tapering downward
    const rockGeo = new THREE.ConeGeometry(14, 11, 16, 3);
    const rPos = rockGeo.attributes.position;
    for (let i = 0; i < rPos.count; i++) {
      const x = rPos.getX(i);
      const z = rPos.getZ(i);
      rPos.setX(i, x + (Math.random() - 0.5) * 1.5);
      rPos.setZ(i, z + (Math.random() - 0.5) * 1.5);
    }
    rockGeo.computeVertexNormals();

    const rockMat = new THREE.MeshStandardMaterial({
      color: CONFIG.colors.rockDark,
      flatShading: true,
      roughness: 0.95
    });
    const rockMesh = new THREE.Mesh(rockGeo, rockMat);
    rockMesh.rotation.x = Math.PI;
    rockMesh.position.y = -5;
    rockMesh.receiveShadow = true;
    islandGroup.add(rockMesh);

    this.worldGroup.add(islandGroup);
  }

  /* ------------------------------------------------------------------------
     B. Layered Purple & Indigo Mountains
     ------------------------------------------------------------------------ */
  createPurpleMountains() {
    const mountainGroup = new THREE.Group();

    const mountainDefs = [
      // x, y, z, radius, height, color, segments
      { x: 3, y: 5.5, z: -6.5, r: 6.5, h: 10, c: CONFIG.colors.mountainBack, s: 7 },
      { x: -3.5, y: 5, z: -7.5, r: 5.5, h: 8.5, c: CONFIG.colors.mountainMid, s: 6 },
      { x: 7.5, y: 4, z: -5, r: 4.5, h: 7, c: CONFIG.colors.mountainFront, s: 6 },
      { x: -7, y: 3.5, z: -4, r: 4, h: 6, c: 0x6d28d9, s: 5 },
      { x: 1, y: 4.5, z: -4, r: 4, h: 6.5, c: 0x8b5cf6, s: 6 }
    ];

    mountainDefs.forEach(def => {
      const geo = new THREE.ConeGeometry(def.r, def.h, def.s);
      // Deform slightly
      const p = geo.attributes.position;
      for (let i = 0; i < p.count; i++) {
        p.setX(i, p.getX(i) + (Math.random() - 0.5) * 0.8);
        p.setZ(i, p.getZ(i) + (Math.random() - 0.5) * 0.8);
      }
      geo.computeVertexNormals();

      const mat = new THREE.MeshStandardMaterial({
        color: def.c,
        flatShading: true,
        roughness: 0.85
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(def.x, def.y, def.z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mountainGroup.add(mesh);

      // Low-poly Snow Cap on the highest peak
      if (def.h >= 8) {
        const snowGeo = new THREE.ConeGeometry(def.r * 0.38, def.h * 0.32, def.s);
        const snowMat = new THREE.MeshStandardMaterial({
          color: CONFIG.colors.snow,
          flatShading: true,
          roughness: 0.6
        });
        const snowMesh = new THREE.Mesh(snowGeo, snowMat);
        snowMesh.position.set(def.x, def.y + def.h * 0.36, def.z);
        mountainGroup.add(snowMesh);
      }
    });

    this.worldGroup.add(mountainGroup);
  }

  /* ------------------------------------------------------------------------
     C. Winding Road
     ------------------------------------------------------------------------ */
  createWindingRoad() {
    const roadGroup = new THREE.Group();

    // Curved low-poly path coordinates across the island
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-10, 2.25, 7),
      new THREE.Vector3(-4, 2.25, 6),
      new THREE.Vector3(0, 2.25, 4),
      new THREE.Vector3(4, 2.25, 2),
      new THREE.Vector3(7, 2.25, 0),
      new THREE.Vector3(5, 2.25, -3)
    ]);

    const roadGeo = new THREE.TubeGeometry(curve, 32, 1.1, 4, false);
    const roadMat = new THREE.MeshStandardMaterial({
      color: CONFIG.colors.road,
      flatShading: true,
      roughness: 0.9
    });
    const roadMesh = new THREE.Mesh(roadGeo, roadMat);
    roadMesh.scale.set(1, 0.08, 1);
    roadMesh.position.y = 0.05;
    roadMesh.receiveShadow = true;
    roadGroup.add(roadMesh);

    // Save path for the cyclist animation
    this.roadCurve = curve;
    this.worldGroup.add(roadGroup);
  }

  /* ------------------------------------------------------------------------
     D. Coral Camper Van
     ------------------------------------------------------------------------ */
  createCamperVan() {
    const van = new THREE.Group();

    // Main lower body (coral pink)
    const bodyGeo = new THREE.BoxGeometry(2.8, 1.4, 1.7);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: CONFIG.colors.camperCoral,
      flatShading: true,
      roughness: 0.6
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.position.y = 1.0;
    bodyMesh.castShadow = true;
    van.add(bodyMesh);

    // Upper cab & roof (crisp white)
    const roofGeo = new THREE.BoxGeometry(2.6, 0.75, 1.6);
    const roofMat = new THREE.MeshStandardMaterial({
      color: CONFIG.colors.camperWhite,
      flatShading: true,
      roughness: 0.4
    });
    const roofMesh = new THREE.Mesh(roofGeo, roofMat);
    roofMesh.position.set(0, 1.75, 0);
    roofMesh.castShadow = true;
    van.add(roofMesh);

    // Windows (tinted dark glass)
    const winMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.2
    });
    // Front windshield
    const frontWin = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, 1.4), winMat);
    frontWin.position.set(1.31, 1.7, 0);
    van.add(frontWin);

    // Side windows
    const sideWin1 = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.45, 1.62), winMat);
    sideWin1.position.set(-0.2, 1.7, 0);
    van.add(sideWin1);

    // Roof rack & luggage
    const rackGeo = new THREE.BoxGeometry(1.6, 0.1, 1.2);
    const rackMat = new THREE.MeshStandardMaterial({ color: 0x475569 });
    const rack = new THREE.Mesh(rackGeo, rackMat);
    rack.position.set(-0.3, 2.2, 0);
    van.add(rack);

    // Coral Surfboard on top
    const boardGeo = new THREE.BoxGeometry(2.0, 0.1, 0.55);
    const boardMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      flatShading: true
    });
    const surfboard = new THREE.Mesh(boardGeo, boardMat);
    surfboard.position.set(-0.3, 2.32, 0.2);
    surfboard.rotation.y = 0.1;
    van.add(surfboard);

    // Wheels (4 rubber tires)
    const wheelGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.28, 12);
    const wheelMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      flatShading: true
    });
    const wheelPositions = [
      [0.9, 0.38, 0.85],
      [0.9, 0.38, -0.85],
      [-0.9, 0.38, 0.85],
      [-0.9, 0.38, -0.85]
    ];

    wheelPositions.forEach(pos => {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(...pos);
      wheel.castShadow = true;
      van.add(wheel);
    });

    // Headlights (warm glowing)
    const lightGeo = new THREE.BoxGeometry(0.08, 0.22, 0.22);
    const lightMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xfef08a,
      emissiveIntensity: 0.8
    });
    const hl1 = new THREE.Mesh(lightGeo, lightMat);
    hl1.position.set(1.41, 0.9, 0.55);
    const hl2 = new THREE.Mesh(lightGeo, lightMat);
    hl2.position.set(1.41, 0.9, -0.55);
    van.add(hl1, hl2);

    // Position camper van at campsite overlook
    van.position.set(-7.5, 2.25, 5.8);
    van.rotation.y = Math.PI * 0.22;
    van.scale.set(1.15, 1.15, 1.15);

    this.worldGroup.add(van);
    this.animatedObjects.van = van;
  }

  /* ------------------------------------------------------------------------
     E. Stylized Low-Poly Pine Trees
     ------------------------------------------------------------------------ */
  createPineTrees() {
    const treesGroup = new THREE.Group();

    const trunkGeo = new THREE.CylinderGeometry(0.18, 0.24, 0.9, 5);
    const trunkMat = new THREE.MeshStandardMaterial({
      color: 0x78350f,
      flatShading: true
    });

    // Layered foliage geometries
    const f1Geo = new THREE.ConeGeometry(1.4, 1.6, 5);
    const f2Geo = new THREE.ConeGeometry(1.1, 1.4, 5);
    const f3Geo = new THREE.ConeGeometry(0.8, 1.1, 5);

    const foliageColors = [0x15803d, 0x166534, 0x14532d, 0x047857];

    const treeLocations = [
      // Campsite cluster
      { x: -9.5, z: 4.5, s: 1.1 },
      { x: -8.8, z: 7.8, s: 1.3 },
      { x: -5.5, z: 7.2, s: 0.9 },
      { x: -11, z: 2, s: 1.2 },
      // Mountain foothills
      { x: -5, z: -2, s: 1.4 },
      { x: -2, z: -1.5, s: 1.0 },
      { x: 3, z: -1, s: 1.1 },
      { x: 6, z: -2.5, s: 1.3 },
      { x: 9, z: -1, s: 0.8 },
      // Center grove
      { x: -1.5, z: 1.5, s: 1.0 },
      { x: 1, z: 6.5, s: 1.2 },
      { x: 3.5, z: 5.5, s: 0.9 },
      // East ridge
      { x: 11, z: 1.5, s: 1.0 },
      { x: 9.5, z: 6, s: 0.85 }
    ];

    treeLocations.forEach((loc, idx) => {
      const tree = new THREE.Group();

      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 0.45;
      trunk.castShadow = true;
      tree.add(trunk);

      const color = foliageColors[idx % foliageColors.length];
      const folMat = new THREE.MeshStandardMaterial({
        color: color,
        flatShading: true,
        roughness: 0.8
      });

      const cone1 = new THREE.Mesh(f1Geo, folMat);
      cone1.position.y = 1.3;
      cone1.castShadow = true;
      cone1.receiveShadow = true;

      const cone2 = new THREE.Mesh(f2Geo, folMat);
      cone2.position.y = 2.1;
      cone2.castShadow = true;

      const cone3 = new THREE.Mesh(f3Geo, folMat);
      cone3.position.y = 2.8;
      cone3.castShadow = true;

      tree.add(cone1, cone2, cone3);

      tree.position.set(loc.x, 2.3, loc.z);
      tree.scale.set(loc.s, loc.s, loc.s);
      tree.rotation.y = Math.random() * Math.PI * 2;
      treesGroup.add(tree);
    });

    this.worldGroup.add(treesGroup);
  }

  /* ------------------------------------------------------------------------
     F. Boulders, Crystals & Vegetation
     ------------------------------------------------------------------------ */
  createVegetationAndRocks() {
    const rocksGroup = new THREE.Group();
    const rockGeo = new THREE.DodecahedronGeometry(0.5, 0);
    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      flatShading: true,
      roughness: 0.9
    });

    // Scatter rocks around edges
    for (let i = 0; i < 18; i++) {
      const angle = (i / 18) * Math.PI * 2;
      const radius = 11 + Math.random() * 2.5;
      const rock = new THREE.Mesh(rockGeo, rockMat);
      rock.position.set(
        Math.cos(angle) * radius,
        2.2,
        Math.sin(angle) * radius
      );
      const s = 0.4 + Math.random() * 0.8;
      rock.scale.set(s, s * 0.7, s);
      rock.rotation.set(Math.random(), Math.random(), Math.random());
      rock.castShadow = true;
      rocksGroup.add(rock);
    }

    this.worldGroup.add(rocksGroup);
  }

  /* ------------------------------------------------------------------------
     G. Cozy Campfire & Overlook Spot (Near "About Me")
     ------------------------------------------------------------------------ */
  createCampfireAndCampsite() {
    const campGroup = new THREE.Group();

    // Campfire ring stones
    const stoneGeo = new THREE.DodecahedronGeometry(0.18, 0);
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x475569, flatShading: true });
    for (let i = 0; i < 8; i++) {
      const stone = new THREE.Mesh(stoneGeo, stoneMat);
      const a = (i / 8) * Math.PI * 2;
      stone.position.set(Math.cos(a) * 0.5, 0.1, Math.sin(a) * 0.5);
      campGroup.add(stone);
    }

    // Wood logs
    const logGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.7, 5);
    const logMat = new THREE.MeshStandardMaterial({ color: 0x78350f, flatShading: true });
    for (let i = 0; i < 3; i++) {
      const log = new THREE.Mesh(logGeo, logMat);
      log.rotation.z = Math.PI / 4;
      log.rotation.y = (i / 3) * Math.PI;
      log.position.y = 0.2;
      campGroup.add(log);
    }

    // Fire flame crystal
    const fireGeo = new THREE.ConeGeometry(0.35, 0.7, 5);
    const fireMat = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      emissive: 0xf59e0b,
      emissiveIntensity: 1.4,
      flatShading: true
    });
    const flame = new THREE.Mesh(fireGeo, fireMat);
    flame.position.y = 0.45;
    campGroup.add(flame);

    // Flickering Point Light
    const fireLight = new THREE.PointLight(0xf97316, 2.2, 7);
    fireLight.position.y = 0.6;
    campGroup.add(fireLight);
    this.animatedObjects.campfireLight = fireLight;

    // Cozy camping chair / log bench
    const bench = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.35, 1.1),
      new THREE.MeshStandardMaterial({ color: 0xb45309, flatShading: true })
    );
    bench.position.set(-1.2, 0.2, 0);
    bench.rotation.y = 0.2;
    campGroup.add(bench);

    campGroup.position.set(-5.8, 2.3, 3.8);
    this.worldGroup.add(campGroup);
  }

  /* ------------------------------------------------------------------------
     H. Mountain Windmill (Near "Skills")
     ------------------------------------------------------------------------ */
  createWindmill() {
    const windmillGroup = new THREE.Group();

    // Tower base (conical low-poly)
    const towerGeo = new THREE.CylinderGeometry(0.7, 1.2, 5, 8);
    const towerMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      flatShading: true,
      roughness: 0.6
    });
    const tower = new THREE.Mesh(towerGeo, towerMat);
    tower.position.y = 2.5;
    tower.castShadow = true;
    windmillGroup.add(tower);

    // Roof cap
    const capGeo = new THREE.ConeGeometry(0.9, 1.2, 8);
    const capMat = new THREE.MeshStandardMaterial({
      color: 0x9333ea,
      flatShading: true
    });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.y = 5.5;
    windmillGroup.add(cap);

    // Hub and Blades
    const bladesGroup = new THREE.Group();
    bladesGroup.position.set(0, 4.8, 0.8);

    const hubGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.3, 8);
    const hubMat = new THREE.MeshStandardMaterial({ color: 0x334155 });
    const hub = new THREE.Mesh(hubGeo, hubMat);
    hub.rotation.x = Math.PI / 2;
    bladesGroup.add(hub);

    // 4 Blades
    const bladeGeo = new THREE.BoxGeometry(0.35, 2.6, 0.05);
    const bladeMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      flatShading: true
    });
    for (let i = 0; i < 4; i++) {
      const blade = new THREE.Mesh(bladeGeo, bladeMat);
      blade.position.y = 1.2;
      const arm = new THREE.Group();
      arm.rotation.z = (i * Math.PI) / 2;
      arm.add(blade);
      bladesGroup.add(arm);
    }

    windmillGroup.add(bladesGroup);
    this.animatedObjects.windmillBlades = bladesGroup;

    windmillGroup.position.set(2.8, 4.8, -4.2);
    windmillGroup.scale.set(0.9, 0.9, 0.9);
    this.worldGroup.add(windmillGroup);
  }

  /* ------------------------------------------------------------------------
     I. Futuristic AI Tech Hub (Near "Nexora AI")
     ------------------------------------------------------------------------ */
  createAiTechStation() {
    const aiGroup = new THREE.Group();

    // Hexagonal glowing pedestal
    const pedestalGeo = new THREE.CylinderGeometry(1.8, 2.2, 0.6, 6);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      flatShading: true,
      roughness: 0.3
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = 0.3;
    aiGroup.add(pedestal);

    // Floating Neon AI Energy Crystal (Octahedron)
    const crystalGeo = new THREE.OctahedronGeometry(1.1, 0);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0x14b8a6,
      emissive: 0x0d9488,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      wireframe: false
    });
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    crystal.position.y = 2.0;
    aiGroup.add(crystal);
    this.animatedObjects.aiCrystal = crystal;

    // Glowing satellite communications ring
    const ringGeo = new THREE.TorusGeometry(1.6, 0.08, 8, 24);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x6366f1,
      emissive: 0x6366f1,
      emissiveIntensity: 0.6
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.5;
    ring.position.y = 2.0;
    aiGroup.add(ring);
    this.animatedObjects.aiRing = ring;

    aiGroup.position.set(6.8, 2.3, 3.2);
    this.worldGroup.add(aiGroup);
  }

  /* ------------------------------------------------------------------------
     J. Lush Terraced Crop Fields (Near "CropIndia AI")
     ------------------------------------------------------------------------ */
  createCropTerraces() {
    const cropGroup = new THREE.Group();

    // Terraced stepped planters
    const levels = [
      { y: 0.2, r: 2.2, color: 0x15803d },
      { y: 0.6, r: 1.6, color: 0x22c55e },
      { y: 1.0, r: 1.0, color: 0x86efac }
    ];

    levels.forEach(lvl => {
      const geo = new THREE.CylinderGeometry(lvl.r, lvl.r + 0.3, 0.4, 6);
      const mat = new THREE.MeshStandardMaterial({
        color: lvl.color,
        flatShading: true,
        roughness: 0.9
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.y = lvl.y;
      mesh.receiveShadow = true;
      cropGroup.add(mesh);
    });

    // Stylized golden wheat sprouts / crops
    const wheatGeo = new THREE.ConeGeometry(0.12, 0.5, 4);
    const wheatMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      flatShading: true
    });
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const wheat = new THREE.Mesh(wheatGeo, wheatMat);
      wheat.position.set(Math.cos(a) * 0.7, 1.4, Math.sin(a) * 0.7);
      cropGroup.add(wheat);
    }

    cropGroup.position.set(-4.5, 2.3, -4.8);
    this.worldGroup.add(cropGroup);
  }

  /* ------------------------------------------------------------------------
     K. Animated Tiny Cyclist along the road
     ------------------------------------------------------------------------ */
  createCyclist() {
    const cyclist = new THREE.Group();

    // Bike Frame (cyan accent)
    const frameGeo = new THREE.BoxGeometry(0.7, 0.1, 0.1);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4 });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    frame.position.y = 0.35;
    cyclist.add(frame);

    // Wheels
    const wGeo = new THREE.TorusGeometry(0.2, 0.04, 6, 12);
    const wMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
    const w1 = new THREE.Mesh(wGeo, wMat);
    w1.position.set(-0.35, 0.2, 0);
    const w2 = new THREE.Mesh(wGeo, wMat);
    w2.position.set(0.35, 0.2, 0);
    cyclist.add(w1, w2);

    // Rider Character (Torso + Head)
    const torsoGeo = new THREE.BoxGeometry(0.25, 0.45, 0.25);
    const torsoMat = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, flatShading: true });
    const torso = new THREE.Mesh(torsoGeo, torsoMat);
    torso.position.set(0, 0.65, 0);
    torso.rotation.z = -0.2; // leaning forward
    cyclist.add(torso);

    const headGeo = new THREE.SphereGeometry(0.14, 6, 6);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xfbcfe8, flatShading: true });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.set(0.1, 0.98, 0);
    cyclist.add(head);

    cyclist.scale.set(0.9, 0.9, 0.9);
    this.worldGroup.add(cyclist);
    this.animatedObjects.cyclist = cyclist;
  }

  /* ------------------------------------------------------------------------
     L. Floating Low-Poly Clouds
     ------------------------------------------------------------------------ */
  createFloatingClouds() {
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      flatShading: true,
      roughness: 0.3,
      transparent: true,
      opacity: 0.92
    });

    const createSingleCloud = () => {
      const cloud = new THREE.Group();
      const numPuffs = 4 + Math.floor(Math.random() * 3);

      for (let i = 0; i < numPuffs; i++) {
        const r = 0.9 + Math.random() * 1.1;
        const puff = new THREE.Mesh(new THREE.DodecahedronGeometry(r, 1), cloudMat);
        puff.position.set(
          (i - numPuffs / 2) * 1.2,
          (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * 0.8
        );
        cloud.add(puff);
      }
      return cloud;
    };

    // Create 6 clouds at varied elevations and orbits
    for (let i = 0; i < 6; i++) {
      const cloud = createSingleCloud();
      const angle = (i / 6) * Math.PI * 2;
      const radius = 22 + Math.random() * 8;
      cloud.position.set(
        Math.cos(angle) * radius,
        10 + Math.random() * 6,
        Math.sin(angle) * radius
      );
      this.worldGroup.add(cloud);
      this.animatedObjects.clouds.push({
        mesh: cloud,
        speed: 0.002 + Math.random() * 0.002,
        radius: radius,
        angle: angle,
        baseY: cloud.position.y
      });
    }
  }

  /* ------------------------------------------------------------------------
     M. Ambient Floating Firefly / Mote Particles
     ------------------------------------------------------------------------ */
  createFloatingParticles() {
    const count = 120;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 32;
      positions[i * 3 + 1] = 2 + Math.random() * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 32;
      speeds[i] = 0.01 + Math.random() * 0.02;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Custom particle texture
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.5, 'rgba(168, 85, 247, 0.8)');
    grad.addColorStop(1, 'rgba(99, 102, 241, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 16);

    const texture = new THREE.CanvasTexture(canvas);

    const mat = new THREE.PointsMaterial({
      size: 0.45,
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(geo, mat);
    this.worldGroup.add(particles);
    this.animatedObjects.particles = { mesh: particles, speeds: speeds, count: count };
  }

  /* ========================================================================
     5. 3D HOTSPOTS & 2D SCREEN PROJECTION SYSTEM
     ======================================================================== */

  initHotspots() {
    this.dom.hotspotsOverlay.innerHTML = '';
    this.animatedObjects.hotspotMeshes = [];

    CONFIG.hotspots.forEach(spot => {
      // 1. 3D Interactive Beacon Mesh
      const beaconGroup = new THREE.Group();
      beaconGroup.position.copy(spot.position);
      beaconGroup.userData = { id: spot.id, name: spot.name };

      // Pulsing Outer Ring
      const ringGeo = new THREE.RingGeometry(0.35, 0.48, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: spot.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = -Math.PI / 2;
      beaconGroup.add(ringMesh);

      // Floating Gem Icon
      const gemGeo = new THREE.OctahedronGeometry(0.28, 0);
      const gemMat = new THREE.MeshStandardMaterial({
        color: spot.color,
        emissive: spot.color,
        emissiveIntensity: 0.7,
        roughness: 0.3
      });
      const gemMesh = new THREE.Mesh(gemGeo, gemMat);
      gemMesh.position.y = 0.55;
      beaconGroup.add(gemMesh);

      this.worldGroup.add(beaconGroup);
      this.animatedObjects.hotspotMeshes.push({
        group: beaconGroup,
        ring: ringMesh,
        gem: gemMesh,
        id: spot.id
      });

      // 2. Projected 2D HTML Label
      const marker = document.createElement('div');
      marker.className = 'hotspot-marker';
      marker.id = `hotspot-marker-${spot.id}`;
      marker.setAttribute('role', 'button');
      marker.setAttribute('aria-label', `Open ${spot.name}`);
      marker.innerHTML = `
        <div class="hotspot-beacon">
          <div class="beacon-wave" style="border-color: #${spot.color.toString(16)};"></div>
          <div class="beacon-core" style="background: #${spot.color.toString(16)};"></div>
        </div>
        <div class="hotspot-pill">
          <span class="icon">${spot.icon}</span>
          <span class="title">${spot.name}</span>
        </div>
      `;

      // Click on 2D label
      marker.addEventListener('click', (e) => {
        e.stopPropagation();
        this.navigateTo(spot.id);
      });

      marker.addEventListener('mouseenter', () => audio.playClick());

      this.dom.hotspotsOverlay.appendChild(marker);
      spot.domElement = marker;
    });
  }

  // Update screen coordinates for 2D hotspot badges
  updateHotspotsProjection() {
    const tempV = new THREE.Vector3();
    const widthHalf = window.innerWidth / 2;
    const heightHalf = window.innerHeight / 2;

    CONFIG.hotspots.forEach(spot => {
      if (!spot.domElement) return;

      tempV.copy(spot.position);
      tempV.y += 0.8; // Position badge above the 3D beacon
      tempV.project(this.camera);

      // Check if spot is in front of camera
      const isVisible = tempV.z < 1;

      if (isVisible) {
        const x = (tempV.x * widthHalf) + widthHalf;
        const y = -(tempV.y * heightHalf) + heightHalf;

        spot.domElement.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0)`;
        spot.domElement.style.opacity = '1';
        spot.domElement.style.pointerEvents = 'auto';
      } else {
        spot.domElement.style.opacity = '0';
        spot.domElement.style.pointerEvents = 'none';
      }
    });
  }

  /* ========================================================================
     6. CINEMATIC GSAP CAMERA TRANSITIONS
     ======================================================================== */

  navigateTo(targetKey) {
    if (this.isTransitioning) return;
    const view = CONFIG.views[targetKey];
    if (!view) return;

    this.isTransitioning = true;
    this.currentSection = targetKey;
    audio.playWhoosh();

    // Update active nav button state
    this.updateActiveNavState(targetKey);

    // Disable auto tour during targeted transitions
    if (this.isTourActive && targetKey !== 'home') {
      this.toggleTour(false);
    }

    // GSAP Dual Animation of Camera Position + Orbit Target
    const tl = gsap.timeline({
      onComplete: () => {
        this.isTransitioning = false;
        // Open modal drawer for specific content sections
        if (targetKey !== 'home') {
          this.openModal(targetKey);
        } else {
          this.closeModal();
          this.showHeroCard(true);
        }
      }
    });

    // Dismiss hero card when focusing into a section
    if (targetKey !== 'home') {
      this.showHeroCard(false);
    }

    tl.to(this.camera.position, {
      x: view.position.x,
      y: view.position.y,
      z: view.position.z,
      duration: view.duration || 1.8,
      ease: 'power2.inOut',
      onUpdate: () => this.controls.update()
    }, 0);

    tl.to(this.controls.target, {
      x: view.target.x,
      y: view.target.y,
      z: view.target.z,
      duration: view.duration || 1.8,
      ease: 'power2.inOut',
      onUpdate: () => this.controls.update()
    }, 0);
  }

  /* ========================================================================
     7. MODAL DRAWER & USER INTERFACE
     ======================================================================== */

  openModal(sectionId) {
    const templateEl = document.getElementById(`template-${sectionId}`);
    if (!templateEl) return;

    // Titles & Categories Map
    const meta = {
      about: { category: 'STUDENT DEVELOPER', title: 'About Murari Kumar' },
      skills: { category: 'TECHNICAL ARSENAL', title: 'Skills & Engineering Stack' },
      nexora: { category: 'FEATURED AI PRODUCT', title: 'Nexora AI Web Builder' },
      cropindia: { category: 'INNOVATION CONCEPT', title: 'CropIndia AI' },
      education: { category: 'ACADEMICS', title: 'Diploma in Computer Science' },
      contact: { category: 'LET\'S CONNECT', title: 'Get In Touch' }
    };

    const info = meta[sectionId] || { category: 'PORTFOLIO', title: 'Information' };
    this.dom.modalCategory.textContent = info.category;
    this.dom.modalHeading.textContent = info.title;

    // Clone content safely from template store
    this.dom.modalBody.innerHTML = templateEl.innerHTML;

    // Reattach dynamic listeners inside modal (e.g., copy email)
    this.attachModalDynamicListeners();

    // Show modal drawer
    this.dom.modalBackdrop.classList.add('open');
    audio.playClick();
  }

  closeModal() {
    this.dom.modalBackdrop.classList.remove('open');
    audio.playClick();
  }

  showHeroCard(visible) {
    if (visible) {
      this.dom.heroCard.classList.remove('dismissed');
    } else {
      this.dom.heroCard.classList.add('dismissed');
    }
  }

  updateActiveNavState(activeKey) {
    this.dom.navLinks.forEach(btn => {
      if (btn.getAttribute('data-target') === activeKey) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    this.dom.mobileNavLinks.forEach(btn => {
      if (btn.getAttribute('data-target') === activeKey) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  toggleTour(forceState = null) {
    this.isTourActive = forceState !== null ? forceState : !this.isTourActive;
    if (this.isTourActive) {
      this.dom.tourToggleBtn.classList.add('active');
      this.showHeroCard(false);
      this.closeModal();
    } else {
      this.dom.tourToggleBtn.classList.remove('active');
    }
    audio.playClick();
  }

  /* ------------------------------------------------------------------------
     Attach UI Event Handlers
     ------------------------------------------------------------------------ */
  initUIEvents() {
    // Navigation bar links
    this.dom.navLinks.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');
        this.navigateTo(target);
      });
    });

    // Mobile nav links
    this.dom.mobileNavLinks.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');
        this.dom.mobileMenu.classList.remove('open');
        this.navigateTo(target);
      });
    });

    // Brand logo returns to overview
    this.dom.brandLogo.addEventListener('click', () => {
      this.navigateTo('home');
    });

    // Hero buttons
    this.dom.heroCard.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-action');
        const target = btn.getAttribute('data-target');
        if (action === 'explore') {
          this.toggleTour(true);
        } else if (target) {
          this.navigateTo(target);
        }
      });
    });

    // Modal close & back buttons
    this.dom.modalCloseBtn.addEventListener('click', () => {
      this.closeModal();
      this.navigateTo('home');
    });

    this.dom.modalBackBtn.addEventListener('click', () => {
      this.closeModal();
      this.navigateTo('home');
    });

    // Close modal on clicking backdrop outside panel
    this.dom.modalBackdrop.addEventListener('click', (e) => {
      if (e.target === this.dom.modalBackdrop) {
        this.closeModal();
        this.navigateTo('home');
      }
    });

    // Audio toggle button
    this.dom.audioToggleBtn.addEventListener('click', () => {
      const isAudible = audio.toggle();
      const soundOn = this.dom.audioToggleBtn.querySelector('.icon-sound-on');
      const soundOff = this.dom.audioToggleBtn.querySelector('.icon-sound-off');
      if (isAudible) {
        this.dom.audioToggleBtn.classList.add('active');
        soundOn.style.display = 'block';
        soundOff.style.display = 'none';
      } else {
        this.dom.audioToggleBtn.classList.remove('active');
        soundOn.style.display = 'none';
        soundOff.style.display = 'block';
      }
    });

    // Tour mode toggle button
    this.dom.tourToggleBtn.addEventListener('click', () => this.toggleTour());

    // Reset camera button
    this.dom.resetCamBtn.addEventListener('click', () => this.navigateTo('home'));

    // Mobile hamburger menu toggle
    this.dom.menuToggleBtn.addEventListener('click', () => {
      this.dom.mobileMenu.classList.add('open');
      audio.playClick();
    });

    this.dom.mobileMenuClose.addEventListener('click', () => {
      this.dom.mobileMenu.classList.remove('open');
    });

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.dom.modalBackdrop.classList.contains('open')) {
          this.closeModal();
          this.navigateTo('home');
        }
      } else if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
        this.toggleTour();
      } else if (e.key === 'r' || e.key === 'R') {
        this.navigateTo('home');
      }
    });
  }

  attachModalDynamicListeners() {
    const copyBtn = document.getElementById('copy-email-btn');
    const emailText = document.getElementById('email-address-text');
    if (copyBtn && emailText) {
      copyBtn.addEventListener('click', () => {
        const cleanEmail = emailText.textContent.replace(/[\[\]]/g, '').trim();
        navigator.clipboard.writeText(cleanEmail).then(() => {
          const originalText = copyBtn.textContent;
          copyBtn.textContent = '✓ Copied to Clipboard!';
          copyBtn.style.borderColor = 'var(--accent-teal)';
          setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.borderColor = '';
          }, 2400);
        }).catch(() => {
          // Fallback if permission is blocked
          copyBtn.textContent = 'Select & Copy Email';
        });
      });
    }
  }

  /* ------------------------------------------------------------------------
     Pointer Raycasting for 3D clicks
     ------------------------------------------------------------------------ */
  onPointerDown(e) {
    // Ignore clicks on UI overlays
    if (e.target.closest('.top-nav') ||
        e.target.closest('.hero-card') ||
        e.target.closest('.modal-panel') ||
        e.target.closest('.mobile-menu') ||
        e.target.closest('.hotspot-marker')) {
      return;
    }

    this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera);

    const hitObjects = [];
    this.animatedObjects.hotspotMeshes.forEach(spot => {
      hitObjects.push(spot.gem, spot.ring);
    });

    const intersects = this.raycaster.intersectObjects(hitObjects);
    if (intersects.length > 0) {
      const hit = intersects[0].object;
      const spotId = hit.parent ? hit.parent.userData.id : null;
      if (spotId) {
        this.navigateTo(spotId);
      }
    }
  }

  /* ========================================================================
     8. LOADING SCREEN & ASSET LIFECYCLE
     ======================================================================== */

  simulateAssetLoading() {
    let progress = 0;
    const steps = [
      { p: 25, msg: 'Sculpting low-poly purple mountains...' },
      { p: 55, msg: 'Planting pine trees & winding road...' },
      { p: 80, msg: 'Tuning camper van & lighting shaders...' },
      { p: 100, msg: 'Miniature world ready!' }
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < steps.length) {
        progress = steps[stepIdx].p;
        this.dom.progressBar.style.width = `${progress}%`;
        this.dom.progressPercent.textContent = `${progress}%`;
        this.dom.loadingStatus.textContent = steps[stepIdx].msg;
        stepIdx++;
      } else {
        clearInterval(interval);
        setTimeout(() => this.finishLoading(), 400);
      }
    }, 280);

    // Skip button fallback if visitor doesn't want to wait
    setTimeout(() => {
      this.dom.skipBtn.style.display = 'inline-block';
    }, 1500);

    this.dom.skipBtn.addEventListener('click', () => {
      clearInterval(interval);
      this.finishLoading();
    });
  }

  finishLoading() {
    this.dom.loadingScreen.classList.add('hidden');
    // Animate camera in smoothly from higher overview
    gsap.from(this.camera.position, {
      y: 40,
      z: 50,
      duration: 2.2,
      ease: 'power3.out',
      onUpdate: () => this.controls.update()
    });
  }

  /* ========================================================================
     9. ANIMATION LOOP & TICK HANDLERS
     ======================================================================== */

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // 1. Controls Update
    this.controls.update();

    // 2. Auto Tour Mode (Slow cinematic orbit)
    if (this.isTourActive && !this.isTransitioning) {
      const radius = 32;
      const speed = 0.15;
      this.camera.position.x = Math.cos(elapsedTime * speed) * radius;
      this.camera.position.z = Math.sin(elapsedTime * speed) * radius;
      this.camera.lookAt(CONFIG.views.home.target);
    }

    // 3. Rotating Windmill Blades
    if (this.animatedObjects.windmillBlades) {
      this.animatedObjects.windmillBlades.rotation.z -= delta * 1.8;
    }

    // 4. Floating & Rotating AI Crystal
    if (this.animatedObjects.aiCrystal) {
      this.animatedObjects.aiCrystal.rotation.y += delta * 1.2;
      this.animatedObjects.aiCrystal.rotation.x = Math.sin(elapsedTime * 2) * 0.15;
      this.animatedObjects.aiCrystal.position.y = 2.0 + Math.sin(elapsedTime * 2.5) * 0.18;
    }
    if (this.animatedObjects.aiRing) {
      this.animatedObjects.aiRing.rotation.z += delta * 0.8;
    }

    // 5. Camper Van Idle Vibration
    if (this.animatedObjects.van) {
      this.animatedObjects.van.position.y = 2.25 + Math.sin(elapsedTime * 4) * 0.015;
    }

    // 6. Campfire Light Flicker
    if (this.animatedObjects.campfireLight) {
      this.animatedObjects.campfireLight.intensity = 2.0 + Math.sin(elapsedTime * 12) * 0.4 + Math.cos(elapsedTime * 7) * 0.2;
    }

    // 7. Drifting Clouds
    this.animatedObjects.clouds.forEach(cloud => {
      cloud.angle += cloud.speed;
      cloud.mesh.position.x = Math.cos(cloud.angle) * cloud.radius;
      cloud.mesh.position.z = Math.sin(cloud.angle) * cloud.radius;
      cloud.mesh.position.y = cloud.baseY + Math.sin(elapsedTime + cloud.angle) * 0.4;
    });

    // 8. Rising Firefly Particles
    if (this.animatedObjects.particles) {
      const pos = this.animatedObjects.particles.mesh.geometry.attributes.position;
      const speeds = this.animatedObjects.particles.speeds;
      for (let i = 0; i < this.animatedObjects.particles.count; i++) {
        let y = pos.getY(i) + speeds[i];
        if (y > 16) y = 2.5; // loop back down
        pos.setY(i, y);
      }
      pos.needsUpdate = true;
    }

    // 9. Cyclist Movement Along Curve
    if (this.animatedObjects.cyclist && this.roadCurve) {
      const loopTime = 14; // seconds to traverse
      const t = (elapsedTime % loopTime) / loopTime;
      const pos = this.roadCurve.getPointAt(t);
      const tangent = this.roadCurve.getTangentAt(t);

      this.animatedObjects.cyclist.position.copy(pos);
      this.animatedObjects.cyclist.position.y += 0.05;

      const angle = Math.atan2(tangent.x, tangent.z);
      this.animatedObjects.cyclist.rotation.y = angle;
    }

    // 10. Hotspots Beacons Animation
    this.animatedObjects.hotspotMeshes.forEach((spot, i) => {
      spot.gem.rotation.y += delta * 1.5;
      spot.gem.position.y = 0.55 + Math.sin(elapsedTime * 3 + i) * 0.1;
      const scale = 1 + Math.sin(elapsedTime * 4 + i) * 0.15;
      spot.ring.scale.set(scale, scale, 1);
    });

    // 11. Sync 2D HTML Hotspots Overlay
    this.updateHotspotsProjection();

    // 12. Render Frame
    this.renderer.render(this.scene, this.camera);
  }
}

// Instantiate application once DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  try {
    new PortfolioApp();
  } catch (err) {
    console.error('WebGL initialization error:', err);
    const fallback = document.getElementById('webgl-fallback');
    if (fallback) fallback.style.display = 'flex';
  }
});
