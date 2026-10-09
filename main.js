/**
 * Murari Kumar - 3D Developer Portfolio & Miniature City
 * ============================================================================
 * Cinematic Low-Poly 3D City with Three.js, GSAP & Web Audio API
 * Features:
 * - Astropulse SMM Corporate HQ with automated gate & 8 animated employees
 * - Residential district with walking commuters who leave & enter houses
 * - Cycling commuter who hits a bump and tumbles/falls down, then gets back up!
 * - Dedicated farmer farming with a hoe at the CropIndia AI terraced fields
 * - Welcome Guide/Narrator gesturing with both hands at the About Plaza
 * - Nexora AI futuristic energy crystal laboratory
 * - Mountain windmill, campfire, coral camper van, drifting clouds & fireflies
 * ============================================================================
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/* ==========================================================================
   1. CONFIGURATION & CAMERA PRESETS
   ========================================================================== */

const CONFIG = {
  // Camera view presets for cinematic GSAP transitions
  views: {
    home: {
      position: new THREE.Vector3(34, 22, 36),
      target: new THREE.Vector3(0, 2, 0),
      duration: 2.2
    },
    about: {
      position: new THREE.Vector3(-18, 9, 16),
      target: new THREE.Vector3(-8, 3, 7),
      duration: 1.8
    },
    skills: {
      position: new THREE.Vector3(16, 14, -4),
      target: new THREE.Vector3(5, 7.5, -6),
      duration: 1.8
    },
    astropulse: {
      position: new THREE.Vector3(20, 10, -12),
      target: new THREE.Vector3(10, 4, -8),
      duration: 1.8
    },
    nexora: {
      position: new THREE.Vector3(18, 8, 14),
      target: new THREE.Vector3(9, 3.2, 5),
      duration: 1.8
    },
    cropindia: {
      position: new THREE.Vector3(-16, 9, -15),
      target: new THREE.Vector3(-7, 3, -7),
      duration: 1.8
    },
    education: {
      position: new THREE.Vector3(0, 14, 22),
      target: new THREE.Vector3(0, 3, 4),
      duration: 1.8
    },
    contact: {
      position: new THREE.Vector3(-6, 7, 20),
      target: new THREE.Vector3(-3, 2, 11),
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
      position: new THREE.Vector3(-8, 3.6, 7),
      color: 0x9333ea
    },
    {
      id: 'skills',
      name: 'Skills & Stack',
      subtitle: 'Languages & Tools',
      icon: '⚡',
      position: new THREE.Vector3(5, 8.5, -6),
      color: 0x3b82f6
    },
    {
      id: 'astropulse',
      name: 'Astropulse SMM',
      subtitle: 'Social Media Services HQ',
      icon: '📈',
      position: new THREE.Vector3(10, 5.2, -8),
      color: 0x06b6d4
    },
    {
      id: 'nexora',
      name: 'Nexora AI',
      subtitle: 'AI Website Builder',
      icon: '🚀',
      position: new THREE.Vector3(9, 4.2, 5),
      color: 0x14b8a6
    },
    {
      id: 'cropindia',
      name: 'CropIndia AI',
      subtitle: 'Agri Intelligence',
      icon: '🌾',
      position: new THREE.Vector3(-7, 3.8, -7),
      color: 0x10b981
    },
    {
      id: 'contact',
      name: 'Contact & Links',
      subtitle: 'Get In Touch',
      icon: '📬',
      position: new THREE.Vector3(-3, 3.2, 11),
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
    road: 0x1e293b,
    sidewalk: 0x94a3b8,
    officeBlue: 0x1e3a8a,
    officeGlass: 0x38bdf8,
    officeNeon: 0x06b6d4
  }
};

/* ==========================================================================
   2. PROCEDURAL WEB AUDIO ENGINE
   (Native Web Audio API ambient drone & UI sound effects)
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
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.24, this.ctx.currentTime);
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

    // Ambient chords (F major 9 / Dreamy Ethereal Drone)
    const frequencies = [174.61, 261.63, 329.63, 392.00];

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.gainNode.gain.exponentialRampToValueAtTime(0.18, this.ctx.currentTime + 3);
    this.gainNode.connect(this.masterGain);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(540, this.ctx.currentTime);
    filter.Q.setValueAtTime(2, this.ctx.currentTime);
    filter.connect(this.gainNode);

    this.oscillators = frequencies.map((freq, i) => {
      const osc = this.ctx.createOscillator();
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
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

  playClick() {
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(660, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(330, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch (e) {}
  }

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
      hotspotMeshes: [],
      // Astropulse SMM gate & employees
      smmGate: null,
      smmEmployees: [],
      // Commuter who walks in & out of house
      commuter: null,
      // Farmer who is farming
      farmer: null,
      // Guide who gestures with both hands
      guide: null
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
    this.initCityEnvironment();
    this.initHotspots();
    this.initUIEvents();
    this.simulateAssetLoading();
    this.animate();
  }

  /* ------------------------------------------------------------------------
     Initialize Three.js Engine & Canvas
     ------------------------------------------------------------------------ */
  initThree() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(CONFIG.colors.fog, 0.012);

    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    this.camera.position.copy(CONFIG.views.home.position);

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

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.target.copy(CONFIG.views.home.target);
    this.controls.minDistance = 6;
    this.controls.maxDistance = 85;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.02;
    this.controls.enablePan = false;

    this.createSkyBackground();
    this.setupLighting();

    window.addEventListener('resize', () => this.onWindowResize(), false);

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    window.addEventListener('pointerdown', (e) => this.onPointerDown(e));
  }

  createSkyBackground() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 128);
    gradient.addColorStop(0, '#4b7bec');
    gradient.addColorStop(0.5, '#a5b4fc');
    gradient.addColorStop(1, '#e0e7ff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 128);

    const texture = new THREE.CanvasTexture(canvas);
    this.scene.background = texture;
  }

  setupLighting() {
    const hemiLight = new THREE.HemisphereLight(0xfff7ed, 0x3b0764, 0.95);
    this.scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfffbeb, 1.45);
    dirLight.position.set(45, 55, 35);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 160;
    dirLight.shadow.camera.left = -40;
    dirLight.shadow.camera.right = 40;
    dirLight.shadow.camera.top = 40;
    dirLight.shadow.camera.bottom = -40;
    dirLight.shadow.bias = -0.0005;
    this.scene.add(dirLight);

    const ambientLight = new THREE.AmbientLight(0x7c3aed, 0.45);
    this.scene.add(ambientLight);
  }

  /* ========================================================================
     4. PROCEDURAL MINIATURE CITY ISLAND GENERATION
     ======================================================================== */

  initCityEnvironment() {
    this.worldGroup = new THREE.Group();
    this.scene.add(this.worldGroup);

    this.createCityIslandBase();
    this.createPurpleMountains();
    this.createCityRoadsAndAvenues();
    this.createAstropulseSMMIndustry();
    this.createResidentialDistrict();
    this.createCropTerracesAndFarmer();
    this.createCamperVanAndCampsite();
    this.createAboutPlazaAndGuide();
    this.createWindmill();
    this.createAiTechStation();
    this.createStreetFurnitureAndTrees();
    this.createFallingCyclist();
    this.createWalkingCommuter();
    this.createFloatingClouds();
    this.createFloatingParticles();
  }

  /* ------------------------------------------------------------------------
     A. Enlarged City Island Base
     ------------------------------------------------------------------------ */
  createCityIslandBase() {
    const islandGroup = new THREE.Group();

    // Expanded plateau (radius 27 for a small city!)
    const topGeo = new THREE.CylinderGeometry(27, 25.5, 3.2, 28, 2);
    const pos = topGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      if (y > 0) {
        pos.setY(i, y + (Math.sin(pos.getX(i) * 0.25) + Math.cos(pos.getZ(i) * 0.25)) * 0.35);
      }
    }
    topGeo.computeVertexNormals();

    const topMat = new THREE.MeshStandardMaterial({
      color: CONFIG.colors.islandGrass,
      flatShading: true,
      roughness: 0.85
    });
    const topMesh = new THREE.Mesh(topGeo, topMat);
    topMesh.position.y = 1.2;
    topMesh.receiveShadow = true;
    islandGroup.add(topMesh);

    // Bedrock cone tapering down
    const rockGeo = new THREE.ConeGeometry(25, 18, 24, 3);
    const rPos = rockGeo.attributes.position;
    for (let i = 0; i < rPos.count; i++) {
      rPos.setX(i, rPos.getX(i) + (Math.random() - 0.5) * 2.2);
      rPos.setZ(i, rPos.getZ(i) + (Math.random() - 0.5) * 2.2);
    }
    rockGeo.computeVertexNormals();

    const rockMat = new THREE.MeshStandardMaterial({
      color: CONFIG.colors.rockDark,
      flatShading: true,
      roughness: 0.95
    });
    const rockMesh = new THREE.Mesh(rockGeo, rockMat);
    rockMesh.rotation.x = Math.PI;
    rockMesh.position.y = -8;
    rockMesh.receiveShadow = true;
    islandGroup.add(rockMesh);

    this.worldGroup.add(islandGroup);
  }

  /* ------------------------------------------------------------------------
     B. Background Purple & Indigo Mountains
     ------------------------------------------------------------------------ */
  createPurpleMountains() {
    const mountainGroup = new THREE.Group();

    const mountainDefs = [
      { x: 5, y: 8, z: -16, r: 9, h: 14, c: CONFIG.colors.mountainBack, s: 7 },
      { x: -7, y: 7, z: -17, r: 8, h: 12, c: CONFIG.colors.mountainMid, s: 6 },
      { x: 15, y: 6, z: -13, r: 7, h: 10, c: CONFIG.colors.mountainFront, s: 6 },
      { x: -16, y: 5.5, z: -12, r: 7, h: 9.5, c: 0x6d28d9, s: 5 },
      { x: 0, y: 6.5, z: -14, r: 6.5, h: 11, c: 0x8b5cf6, s: 6 }
    ];

    mountainDefs.forEach(def => {
      const geo = new THREE.ConeGeometry(def.r, def.h, def.s);
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

      // Snow cap
      if (def.h >= 11) {
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
     C. City Road Network & Crosswalks
     ------------------------------------------------------------------------ */
  createCityRoadsAndAvenues() {
    const roadsGroup = new THREE.Group();

    // Main Avenue (runs East-West)
    const mainAvenue = new THREE.Mesh(
      new THREE.BoxGeometry(38, 0.12, 3.8),
      new THREE.MeshStandardMaterial({ color: CONFIG.colors.road, roughness: 0.9 })
    );
    mainAvenue.position.set(0, 2.82, 0);
    mainAvenue.receiveShadow = true;
    roadsGroup.add(mainAvenue);

    // Cross Street (runs North-South connecting Astropulse & residential)
    const crossStreet = new THREE.Mesh(
      new THREE.BoxGeometry(3.6, 0.12, 32),
      new THREE.MeshStandardMaterial({ color: CONFIG.colors.road, roughness: 0.9 })
    );
    crossStreet.position.set(2, 2.82, 0);
    crossStreet.receiveShadow = true;
    roadsGroup.add(crossStreet);

    // Painted Center Lines (white dashed strips)
    const stripeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
    for (let x = -17; x <= 17; x += 3) {
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.14, 0.15), stripeMat);
      stripe.position.set(x, 2.83, 0);
      roadsGroup.add(stripe);
    }

    // Pedestrian Zebra Crossings
    for (let i = -1.5; i <= 1.5; i += 0.5) {
      const zebra = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.14, 2.8), stripeMat);
      zebra.position.set(5.5, 2.83, i);
      roadsGroup.add(zebra);
    }

    this.worldGroup.add(roadsGroup);
  }

  /* ------------------------------------------------------------------------
     D. ASTROPULSE SMM CORPORATE CAMPUS (With Animated Gate & 8 Employees)
     ------------------------------------------------------------------------ */
  createAstropulseSMMIndustry() {
    const campus = new THREE.Group();

    // Campus foundation plaza (sleek stone paving)
    const plaza = new THREE.Mesh(
      new THREE.BoxGeometry(16, 0.2, 14),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 })
    );
    plaza.position.set(11, 2.85, -8);
    plaza.receiveShadow = true;
    campus.add(plaza);

    // Main Corporate Tower (Multi-tier modern glass & steel building)
    const towerMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.3,
      flatShading: true
    });
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x0891b2,
      emissiveIntensity: 0.45,
      roughness: 0.1
    });

    // Tier 1 Base
    const b1 = new THREE.Mesh(new THREE.BoxGeometry(7, 4.5, 6), towerMat);
    b1.position.set(12, 5.0, -8.5);
    b1.castShadow = true;
    campus.add(b1);

    // Tier 2 Mid
    const b2 = new THREE.Mesh(new THREE.BoxGeometry(5.5, 3.5, 5), towerMat);
    b2.position.set(12, 9.0, -8.5);
    b2.castShadow = true;
    campus.add(b2);

    // Glowing Cyan Ribbon Windows
    const win1 = new THREE.Mesh(new THREE.BoxGeometry(7.1, 0.8, 4.8), glassMat);
    win1.position.set(12, 4.8, -8.5);
    const win2 = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.7, 3.8), glassMat);
    win2.position.set(12, 8.8, -8.5);
    campus.add(win1, win2);

    // Neon 3D Rooftop Sign: "ASTROPULSE SMM"
    const signBoard = new THREE.Mesh(
      new THREE.BoxGeometry(5.2, 1.2, 0.25),
      new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        emissive: 0x06b6d4,
        emissiveIntensity: 0.9,
        flatShading: true
      })
    );
    signBoard.position.set(12, 11.4, -6.1);
    campus.add(signBoard);

    // Satellite Dish & Roof Antenna
    const dish = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 0.1, 0.3, 10),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0 })
    );
    dish.rotation.x = Math.PI / 3;
    dish.position.set(13.2, 11.5, -8.5);
    campus.add(dish);

    // Security Perimeter Fence
    const fenceMat = new THREE.MeshStandardMaterial({ color: 0x64748b });
    const fence1 = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.2, 12), fenceMat);
    fence1.position.set(18.2, 3.4, -8);
    const fence2 = new THREE.Mesh(new THREE.BoxGeometry(14, 1.2, 0.15), fenceMat);
    fence2.position.set(11, 3.4, -14.2);
    campus.add(fence1, fence2);

    // --- AUTOMATED SECURITY BARRIER GATE ---
    const gateGroup = new THREE.Group();
    gateGroup.position.set(4.5, 2.9, -4.5);

    // Gate Control Booth
    const booth = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 2.2, 1.4),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, flatShading: true })
    );
    booth.position.set(0, 1.1, 0);
    booth.castShadow = true;
    gateGroup.add(booth);

    // Gate Barrier Post
    const post = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 1.3, 8),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b })
    );
    post.position.set(1.4, 0.65, 0);
    gateGroup.add(post);

    // Motorized Barrier Bar (Arm that rotates up and down!)
    const barArm = new THREE.Group();
    barArm.position.set(1.4, 1.1, 0);

    const barMesh = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 0.12, 0.08),
      new THREE.MeshStandardMaterial({
        color: 0xef4444, // Red & white security striped bar
        emissive: 0xd97706,
        emissiveIntensity: 0.3
      })
    );
    barMesh.position.set(1.6, 0, 0);
    barArm.add(barMesh);
    gateGroup.add(barArm);

    this.animatedObjects.smmGate = barArm;
    campus.add(gateGroup);

    // --- 8 EMPLOYEES WITH SPECIFIC ASSIGNED ROLES ---
    this.createSmmEmployees(campus);

    this.worldGroup.add(campus);
  }

  /* ------------------------------------------------------------------------
     E. 8 Astropulse SMM Employees with Assigned Jobs
     ------------------------------------------------------------------------ */
  createSmmEmployees(campus) {
    const makePerson = (shirtColor, pantsColor = 0x1e293b) => {
      const person = new THREE.Group();
      // Legs
      const legGeo = new THREE.BoxGeometry(0.14, 0.45, 0.14);
      const legMat = new THREE.MeshStandardMaterial({ color: pantsColor });
      const lLeg = new THREE.Mesh(legGeo, legMat);
      lLeg.position.set(-0.1, 0.22, 0);
      const rLeg = new THREE.Mesh(legGeo, legMat);
      rLeg.position.set(0.1, 0.22, 0);
      person.add(lLeg, rLeg);

      // Torso
      const torsoGeo = new THREE.BoxGeometry(0.32, 0.48, 0.24);
      const torsoMat = new THREE.MeshStandardMaterial({ color: shirtColor, flatShading: true });
      const torso = new THREE.Mesh(torsoGeo, torsoMat);
      torso.position.y = 0.68;
      person.add(torso);

      // Head
      const headGeo = new THREE.SphereGeometry(0.15, 6, 6);
      const headMat = new THREE.MeshStandardMaterial({ color: 0xfbcfe8, flatShading: true });
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.y = 1.05;
      person.add(head);

      // Left & Right Arms for animating
      const armGeo = new THREE.BoxGeometry(0.1, 0.38, 0.1);
      const armMat = new THREE.MeshStandardMaterial({ color: shirtColor });
      const lArm = new THREE.Mesh(armGeo, armMat);
      lArm.position.set(-0.24, 0.65, 0);
      const rArm = new THREE.Mesh(armGeo, armMat);
      rArm.position.set(0.24, 0.65, 0);
      person.add(lArm, rArm);

      person.scale.set(0.85, 0.85, 0.85);
      return { group: person, lArm, rArm, head, torso, lLeg, rLeg };
    };

    // 1. Security Officer at the gate booth (salutes / operates gate)
    const guard = makePerson(0x1e3a8a, 0x0f172a); // Navy uniform
    guard.group.position.set(5.8, 2.9, -4.2);
    guard.role = 'guard';
    campus.add(guard.group);

    // 2. Server & Database Engineer in the tech wing (typing at server rack)
    const serverEng = makePerson(0x0284c7); // Blue shirt
    serverEng.group.position.set(14.8, 2.9, -6.5);
    serverEng.role = 'server_engineer';
    // Server rack next to them
    const rack = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 2.2, 0.8),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, emissive: 0x10b981, emissiveIntensity: 0.35 })
    );
    rack.position.set(15.5, 3.9, -6.5);
    campus.add(rack);
    campus.add(serverEng.group);

    // 3. Social Media Growth Strategist (gesturing at glowing analytics board)
    const strategist = makePerson(0x8b5cf6); // Purple blazer
    strategist.group.position.set(8.5, 2.9, -9.2);
    strategist.role = 'strategist';
    // Holographic social analytics board
    const board = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 1.1, 0.08),
      new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x06b6d4, emissiveIntensity: 0.8 })
    );
    board.position.set(8.5, 4.2, -10.2);
    campus.add(board);
    campus.add(strategist.group);

    // 4. Customer Support Executive (wearing headset, nodding)
    const support = makePerson(0xec4899); // Pink
    support.group.position.set(10.2, 2.9, -6.8);
    support.role = 'support';
    campus.add(support.group);

    // 5. Courier / Dispatch Runner (walking between gate & office with package)
    const courier = makePerson(0xf59e0b); // Orange delivery uniform
    courier.group.position.set(7.0, 2.9, -5.5);
    // Package box in hands
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.26, 0.28),
      new THREE.MeshStandardMaterial({ color: 0xd97706 })
    );
    box.position.set(0, 0.65, 0.28);
    courier.group.add(box);
    courier.role = 'courier';
    campus.add(courier.group);

    // 6. Coffee Break Colleague (holding coffee mug at the terrace)
    const coffeeEmp = makePerson(0x10b981); // Emerald
    coffeeEmp.group.position.set(15.2, 2.9, -11.5);
    const mug = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 0.12, 6),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    );
    mug.position.set(0.24, 0.75, 0.15);
    coffeeEmp.group.add(mug);
    coffeeEmp.role = 'coffee';
    campus.add(coffeeEmp.group);

    // 7. Creative Graphic Designer (working at desk)
    const designer = makePerson(0x38bdf8); // Light cyan
    designer.group.position.set(11.8, 2.9, -11.2);
    designer.role = 'designer';
    campus.add(designer.group);

    // 8. API Automation Engineer (inspecting throughput)
    const apiEng = makePerson(0xa855f7); // Violet
    apiEng.group.position.set(13.6, 2.9, -12.5);
    apiEng.role = 'api_eng';
    campus.add(apiEng.group);

    this.animatedObjects.smmEmployees = [
      guard, serverEng, strategist, support, courier, coffeeEmp, designer, apiEng
    ];
  }

  /* ------------------------------------------------------------------------
     F. Residential District with Houses & Commuter Path
     ------------------------------------------------------------------------ */
  createResidentialDistrict() {
    const resGroup = new THREE.Group();

    const houseDefs = [
      { x: -12, z: 2, roofColor: 0xef4444, bodyColor: 0xf8fafc },
      { x: -16, z: 2, roofColor: 0x06b6d4, bodyColor: 0xf1f5f9 },
      { x: -14, z: -3, roofColor: 0xf59e0b, bodyColor: 0xfef08a },
      { x: -18, z: -3, roofColor: 0x8b5cf6, bodyColor: 0xf3e8ff }
    ];

    houseDefs.forEach((def, i) => {
      const house = new THREE.Group();
      // Body
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(3.0, 2.4, 2.8),
        new THREE.MeshStandardMaterial({ color: def.bodyColor, flatShading: true })
      );
      body.position.y = 1.2;
      body.castShadow = true;
      house.add(body);

      // Pitched Roof
      const roof = new THREE.Mesh(
        new THREE.ConeGeometry(2.4, 1.5, 4),
        new THREE.MeshStandardMaterial({ color: def.roofColor, flatShading: true })
      );
      roof.position.y = 3.1;
      roof.rotation.y = Math.PI / 4;
      roof.castShadow = true;
      house.add(roof);

      // Doorway
      const door = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 1.2, 0.1),
        new THREE.MeshStandardMaterial({ color: 0x78350f })
      );
      door.position.set(0, 0.6, 1.41);
      house.add(door);

      // Chimney
      const chimney = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.8, 0.35),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8 })
      );
      chimney.position.set(0.8, 3.2, -0.6);
      house.add(chimney);

      house.position.set(def.x, 2.85, def.z);
      resGroup.add(house);
    });

    this.worldGroup.add(resGroup);
  }

  /* ------------------------------------------------------------------------
     G. Commuter Who Leaves House, Walks to City, & Returns Home
     ------------------------------------------------------------------------ */
  createWalkingCommuter() {
    const commuterGroup = new THREE.Group();

    // Body parts
    const legGeo = new THREE.BoxGeometry(0.14, 0.45, 0.14);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
    const lLeg = new THREE.Mesh(legGeo, legMat);
    lLeg.position.set(-0.1, 0.22, 0);
    const rLeg = new THREE.Mesh(legGeo, legMat);
    rLeg.position.set(0.1, 0.22, 0);
    commuterGroup.add(lLeg, rLeg);

    const torso = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.5, 0.24),
      new THREE.MeshStandardMaterial({ color: 0x2563eb, flatShading: true }) // Blue commuter jacket
    );
    torso.position.y = 0.7;
    commuterGroup.add(torso);

    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.16, 6, 6),
      new THREE.MeshStandardMaterial({ color: 0xfbcfe8, flatShading: true })
    );
    head.position.y = 1.08;
    commuterGroup.add(head);

    const armGeo = new THREE.BoxGeometry(0.1, 0.38, 0.1);
    const armMat = new THREE.MeshStandardMaterial({ color: 0x2563eb });
    const lArm = new THREE.Mesh(armGeo, armMat);
    lArm.position.set(-0.24, 0.65, 0);
    const rArm = new THREE.Mesh(armGeo, armMat);
    rArm.position.set(0.24, 0.65, 0);
    commuterGroup.add(lArm, rArm);

    // Briefcase in hand
    const bag = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.22, 0.1),
      new THREE.MeshStandardMaterial({ color: 0x78350f })
    );
    bag.position.set(0.32, 0.42, 0);
    commuterGroup.add(bag);

    commuterGroup.scale.set(0.9, 0.9, 0.9);
    commuterGroup.position.set(-12, 2.9, 3.4); // Start right outside house front door!

    this.worldGroup.add(commuterGroup);
    this.animatedObjects.commuter = {
      group: commuterGroup,
      lLeg, rLeg, lArm, rArm
    };
  }

  /* ------------------------------------------------------------------------
     H. The Wobbly Cyclist Who Falls Down & Recovers!
     ------------------------------------------------------------------------ */
  createFallingCyclist() {
    const cyclistGroup = new THREE.Group();

    // Bike Frame
    const bike = new THREE.Group();
    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.1, 0.08),
      new THREE.MeshStandardMaterial({ color: 0xef4444 }) // Vibrant red sports bike
    );
    frame.position.y = 0.38;
    bike.add(frame);

    // Wheels
    const wGeo = new THREE.TorusGeometry(0.22, 0.04, 6, 12);
    const wMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
    const w1 = new THREE.Mesh(wGeo, wMat);
    w1.position.set(-0.4, 0.22, 0);
    const w2 = new THREE.Mesh(wGeo, wMat);
    w2.position.set(0.4, 0.22, 0);
    bike.add(w1, w2);

    // Handlebars
    const bar = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.25, 0.5),
      new THREE.MeshStandardMaterial({ color: 0x64748b })
    );
    bar.position.set(0.35, 0.55, 0);
    bike.add(bar);

    cyclistGroup.add(bike);

    // Rider Figure
    const rider = new THREE.Group();
    const torso = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.48, 0.26),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, flatShading: true }) // Yellow cycling jersey
    );
    torso.position.set(0, 0.72, 0);
    torso.rotation.z = -0.22;
    rider.add(torso);

    // Helmet
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.16, 6, 6),
      new THREE.MeshStandardMaterial({ color: 0x06b6d4, flatShading: true }) // Cyan bike helmet
    );
    head.position.set(0.12, 1.05, 0);
    rider.add(head);

    cyclistGroup.add(rider);
    cyclistGroup.position.set(0, 2.9, 1.2);
    this.worldGroup.add(cyclistGroup);

    this.animatedObjects.cyclist = {
      group: cyclistGroup,
      bike,
      rider
    };
  }

  /* ------------------------------------------------------------------------
     I. Terraced Farm & Animated Hoeing Farmer
     ------------------------------------------------------------------------ */
  createCropTerracesAndFarmer() {
    const cropGroup = new THREE.Group();

    // Terraced plots
    const levels = [
      { y: 0.2, r: 3.0, color: 0x15803d },
      { y: 0.6, r: 2.2, color: 0x22c55e },
      { y: 1.0, r: 1.4, color: 0x86efac }
    ];

    levels.forEach(lvl => {
      const geo = new THREE.CylinderGeometry(lvl.r, lvl.r + 0.4, 0.45, 8);
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

    // Golden wheat stalks
    const wheatGeo = new THREE.ConeGeometry(0.12, 0.55, 4);
    const wheatMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, flatShading: true });
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      const wheat = new THREE.Mesh(wheatGeo, wheatMat);
      wheat.position.set(Math.cos(a) * 1.0, 1.5, Math.sin(a) * 1.0);
      cropGroup.add(wheat);
    }

    cropGroup.position.set(-7, 2.85, -7);
    this.worldGroup.add(cropGroup);

    // --- ANIMATED FARMER CHARACTER ---
    const farmer = new THREE.Group();

    // Legs
    const lLeg = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.45, 0.14),
      new THREE.MeshStandardMaterial({ color: 0x1e3a8a }) // Blue denim overalls
    );
    lLeg.position.set(-0.1, 0.22, 0);
    const rLeg = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.45, 0.14),
      new THREE.MeshStandardMaterial({ color: 0x1e3a8a })
    );
    rLeg.position.set(0.1, 0.22, 0);
    farmer.add(lLeg, rLeg);

    // Torso with farming shirt
    const torso = new THREE.Mesh(
      new THREE.BoxGeometry(0.34, 0.5, 0.26),
      new THREE.MeshStandardMaterial({ color: 0xb45309, flatShading: true }) // Plaid/orange work shirt
    );
    torso.position.y = 0.7;
    farmer.add(torso);

    // Head
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.16, 6, 6),
      new THREE.MeshStandardMaterial({ color: 0xfbcfe8, flatShading: true })
    );
    head.position.y = 1.06;
    farmer.add(head);

    // Straw Hat!
    const hatBrim = new THREE.Mesh(
      new THREE.CylinderGeometry(0.38, 0.38, 0.05, 8),
      new THREE.MeshStandardMaterial({ color: 0xfde047, flatShading: true })
    );
    hatBrim.position.y = 1.18;
    farmer.add(hatBrim);

    // Farming Hoe Tool
    const hoeArm = new THREE.Group();
    hoeArm.position.set(0.24, 0.75, 0);

    const handle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 1.2, 5),
      new THREE.MeshStandardMaterial({ color: 0x78350f })
    );
    handle.rotation.x = Math.PI / 3;
    handle.position.set(0, -0.3, 0.4);
    hoeArm.add(handle);

    const blade = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.15, 0.05),
      new THREE.MeshStandardMaterial({ color: 0x64748b })
    );
    blade.position.set(0, -0.75, 0.85);
    hoeArm.add(blade);
    farmer.add(hoeArm);

    farmer.scale.set(0.85, 0.85, 0.85);
    farmer.position.set(-6.2, 2.9, -5.8);
    this.worldGroup.add(farmer);

    this.animatedObjects.farmer = {
      group: farmer,
      torso,
      hoeArm
    };
  }

  /* ------------------------------------------------------------------------
     J. Welcome Guide Narrator Who Gestures With Both Hands
     ------------------------------------------------------------------------ */
  createAboutPlazaAndGuide() {
    const plaza = new THREE.Group();

    // Low-poly guide representing Murari Kumar
    const guide = new THREE.Group();

    // Torso (stylish hoodie / dark tech wear)
    const torso = new THREE.Mesh(
      new THREE.BoxGeometry(0.34, 0.52, 0.26),
      new THREE.MeshStandardMaterial({ color: 0x6366f1, flatShading: true }) // Indigo developer hoodie
    );
    torso.position.y = 0.72;
    guide.add(torso);

    // Head
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.16, 6, 6),
      new THREE.MeshStandardMaterial({ color: 0xfbcfe8, flatShading: true })
    );
    head.position.y = 1.1;
    guide.add(head);

    // Glasses / Tech accessory
    const glasses = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.08, 0.08),
      new THREE.MeshStandardMaterial({ color: 0x0f172a })
    );
    glasses.position.set(0, 1.1, 0.15);
    guide.add(glasses);

    // Left Arm (with pivot at shoulder)
    const lArmPivot = new THREE.Group();
    lArmPivot.position.set(-0.25, 0.88, 0);
    const lArmMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.45, 0.12),
      new THREE.MeshStandardMaterial({ color: 0x6366f1 })
    );
    lArmMesh.position.y = -0.22;
    lArmPivot.add(lArmMesh);
    guide.add(lArmPivot);

    // Right Arm (with pivot at shoulder)
    const rArmPivot = new THREE.Group();
    rArmPivot.position.set(0.25, 0.88, 0);
    const rArmMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.45, 0.12),
      new THREE.MeshStandardMaterial({ color: 0x6366f1 })
    );
    rArmMesh.position.y = -0.22;
    rArmPivot.add(rArmMesh);
    guide.add(rArmPivot);

    // Legs
    const legGeo = new THREE.BoxGeometry(0.15, 0.48, 0.15);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
    const lLeg = new THREE.Mesh(legGeo, legMat);
    lLeg.position.set(-0.1, 0.24, 0);
    const rLeg = new THREE.Mesh(legGeo, legMat);
    rLeg.position.set(0.1, 0.24, 0);
    guide.add(lLeg, rLeg);

    guide.scale.set(0.9, 0.9, 0.9);
    guide.position.set(-7.5, 2.9, 6.5);
    guide.rotation.y = Math.PI * 0.15;
    plaza.add(guide);

    this.worldGroup.add(plaza);
    this.animatedObjects.guide = {
      group: guide,
      lArm: lArmPivot,
      rArm: rArmPivot,
      head
    };
  }

  /* ------------------------------------------------------------------------
     K. Camper Van & Overlook Campsite
     ------------------------------------------------------------------------ */
  createCamperVanAndCampsite() {
    const vanGroup = new THREE.Group();

    // Coral Camper Van
    const bodyMat = new THREE.MeshStandardMaterial({ color: CONFIG.colors.camperCoral, flatShading: true });
    const body = new THREE.Mesh(new THREE.BoxGeometry(3.0, 1.4, 1.7), bodyMat);
    body.position.y = 1.0;
    body.castShadow = true;
    vanGroup.add(body);

    const roofMat = new THREE.MeshStandardMaterial({ color: CONFIG.colors.camperWhite, flatShading: true });
    const roof = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.75, 1.6), roofMat);
    roof.position.set(0, 1.8, 0);
    roof.castShadow = true;
    vanGroup.add(roof);

    // Surfboard & Roof Rack
    const surfboard = new THREE.Mesh(
      new THREE.BoxGeometry(2.1, 0.1, 0.55),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, flatShading: true })
    );
    surfboard.position.set(-0.3, 2.35, 0.2);
    vanGroup.add(surfboard);

    // Headlights
    const hlMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfef08a, emissiveIntensity: 0.8 });
    const hl1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.22, 0.22), hlMat);
    hl1.position.set(1.51, 0.9, 0.55);
    const hl2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.22, 0.22), hlMat);
    hl2.position.set(1.51, 0.9, -0.55);
    vanGroup.add(hl1, hl2);

    vanGroup.position.set(-9.5, 2.9, 8.5);
    vanGroup.rotation.y = Math.PI * 0.28;
    this.worldGroup.add(vanGroup);
    this.animatedObjects.van = vanGroup;

    // Campfire & Flickering Point Light
    const campGroup = new THREE.Group();
    const flame = new THREE.Mesh(
      new THREE.ConeGeometry(0.35, 0.7, 5),
      new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xf59e0b, emissiveIntensity: 1.5, flatShading: true })
    );
    flame.position.y = 0.45;
    campGroup.add(flame);

    const fireLight = new THREE.PointLight(0xf97316, 2.2, 8);
    fireLight.position.y = 0.6;
    campGroup.add(fireLight);
    this.animatedObjects.campfireLight = fireLight;

    campGroup.position.set(-7.5, 2.9, 4.8);
    this.worldGroup.add(campGroup);
  }

  /* ------------------------------------------------------------------------
     L. Mountain Windmill
     ------------------------------------------------------------------------ */
  createWindmill() {
    const windmill = new THREE.Group();
    const tower = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 1.4, 5.5, 8),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, flatShading: true })
    );
    tower.position.y = 2.75;
    tower.castShadow = true;
    windmill.add(tower);

    const bladesGroup = new THREE.Group();
    bladesGroup.position.set(0, 5.2, 0.9);

    const bladeGeo = new THREE.BoxGeometry(0.35, 2.8, 0.05);
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, flatShading: true });
    for (let i = 0; i < 4; i++) {
      const blade = new THREE.Mesh(bladeGeo, bladeMat);
      blade.position.y = 1.3;
      const arm = new THREE.Group();
      arm.rotation.z = (i * Math.PI) / 2;
      arm.add(blade);
      bladesGroup.add(arm);
    }
    windmill.add(bladesGroup);
    this.animatedObjects.windmillBlades = bladesGroup;

    windmill.position.set(4.8, 4.8, -5.8);
    this.worldGroup.add(windmill);
  }

  /* ------------------------------------------------------------------------
     M. Futuristic Nexora AI Tech Station
     ------------------------------------------------------------------------ */
  createAiTechStation() {
    const aiGroup = new THREE.Group();

    const pedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(2.0, 2.4, 0.6, 6),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, flatShading: true })
    );
    pedestal.position.y = 0.3;
    aiGroup.add(pedestal);

    const crystal = new THREE.Mesh(
      new THREE.OctahedronGeometry(1.2, 0),
      new THREE.MeshStandardMaterial({
        color: 0x14b8a6,
        emissive: 0x0d9488,
        emissiveIntensity: 0.85,
        flatShading: true
      })
    );
    crystal.position.y = 2.2;
    aiGroup.add(crystal);
    this.animatedObjects.aiCrystal = crystal;

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.8, 0.09, 8, 24),
      new THREE.MeshStandardMaterial({ color: 0x6366f1, emissive: 0x6366f1, emissiveIntensity: 0.6 })
    );
    ring.rotation.x = Math.PI / 2.5;
    ring.position.y = 2.2;
    aiGroup.add(ring);
    this.animatedObjects.aiRing = ring;

    aiGroup.position.set(8.5, 2.9, 5.2);
    this.worldGroup.add(aiGroup);
  }

  /* ------------------------------------------------------------------------
     N. Street Furniture, Streetlamps & Trees
     ------------------------------------------------------------------------ */
  createStreetFurnitureAndTrees() {
    const furnGroup = new THREE.Group();

    // Streetlamps with warm glowing heads
    const lampGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.4, 6);
    const lampMat = new THREE.MeshStandardMaterial({ color: 0x334155 });
    const bulbMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfef08a, emissiveIntensity: 1.0 });

    const lampPositions = [
      [3.8, 1.8], [3.8, -2.5], [3.8, -7.5],
      [-5.5, 1.8], [-10.5, 1.8], [-15.5, 1.8]
    ];

    lampPositions.forEach(([x, z]) => {
      const lamp = new THREE.Group();
      const pole = new THREE.Mesh(lampGeo, lampMat);
      pole.position.y = 1.2;
      lamp.add(pole);

      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.18, 6, 6), bulbMat);
      bulb.position.y = 2.4;
      lamp.add(bulb);

      lamp.position.set(x, 2.9, z);
      furnGroup.add(lamp);
    });

    // Stylized Pine Trees scattered around perimeter
    const trunkGeo = new THREE.CylinderGeometry(0.2, 0.26, 1.0, 5);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, flatShading: true });
    const folGeo = new THREE.ConeGeometry(1.4, 2.0, 5);
    const folMat = new THREE.MeshStandardMaterial({ color: 0x15803d, flatShading: true });

    const treeSpots = [
      [-20, 8], [-18, 14], [-12, 16], [-5, 18],
      [14, 12], [20, 6], [22, -2], [18, -16],
      [-2, -18], [-14, -16], [-22, -8]
    ];

    treeSpots.forEach(([x, z]) => {
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 0.5;
      tree.add(trunk);

      const fol = new THREE.Mesh(folGeo, folMat);
      fol.position.y = 1.8;
      fol.castShadow = true;
      tree.add(fol);

      tree.position.set(x, 2.9, z);
      furnGroup.add(tree);
    });

    this.worldGroup.add(furnGroup);
  }

  /* ------------------------------------------------------------------------
     O. Floating Clouds
     ------------------------------------------------------------------------ */
  createFloatingClouds() {
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      flatShading: true,
      transparent: true,
      opacity: 0.92
    });

    for (let i = 0; i < 7; i++) {
      const cloud = new THREE.Group();
      for (let j = 0; j < 5; j++) {
        const puff = new THREE.Mesh(new THREE.DodecahedronGeometry(1.2 + Math.random() * 0.8, 1), cloudMat);
        puff.position.set((j - 2) * 1.3, (Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.8);
        cloud.add(puff);
      }
      const angle = (i / 7) * Math.PI * 2;
      const radius = 32 + Math.random() * 10;
      cloud.position.set(Math.cos(angle) * radius, 14 + Math.random() * 8, Math.sin(angle) * radius);
      this.worldGroup.add(cloud);

      this.animatedObjects.clouds.push({
        mesh: cloud,
        speed: 0.0015 + Math.random() * 0.002,
        radius: radius,
        angle: angle,
        baseY: cloud.position.y
      });
    }
  }

  /* ------------------------------------------------------------------------
     P. Floating Firefly Particles
     ------------------------------------------------------------------------ */
  createFloatingParticles() {
    const count = 140;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 48;
      positions[i * 3 + 1] = 2.5 + Math.random() * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 48;
      speeds[i] = 0.01 + Math.random() * 0.02;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.5, 'rgba(6, 182, 212, 0.8)');
    grad.addColorStop(1, 'rgba(99, 102, 241, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 16);

    const texture = new THREE.CanvasTexture(canvas);
    const mat = new THREE.PointsMaterial({
      size: 0.5,
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
      const beaconGroup = new THREE.Group();
      beaconGroup.position.copy(spot.position);
      beaconGroup.userData = { id: spot.id, name: spot.name };

      const ringGeo = new THREE.RingGeometry(0.38, 0.52, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: spot.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = -Math.PI / 2;
      beaconGroup.add(ringMesh);

      const gemGeo = new THREE.OctahedronGeometry(0.32, 0);
      const gemMat = new THREE.MeshStandardMaterial({
        color: spot.color,
        emissive: spot.color,
        emissiveIntensity: 0.75,
        roughness: 0.3
      });
      const gemMesh = new THREE.Mesh(gemGeo, gemMat);
      gemMesh.position.y = 0.6;
      beaconGroup.add(gemMesh);

      this.worldGroup.add(beaconGroup);
      this.animatedObjects.hotspotMeshes.push({
        group: beaconGroup,
        ring: ringMesh,
        gem: gemMesh,
        id: spot.id
      });

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

      marker.addEventListener('click', (e) => {
        e.stopPropagation();
        this.navigateTo(spot.id);
      });

      marker.addEventListener('mouseenter', () => audio.playClick());

      this.dom.hotspotsOverlay.appendChild(marker);
      spot.domElement = marker;
    });
  }

  updateHotspotsProjection() {
    const tempV = new THREE.Vector3();
    const widthHalf = window.innerWidth / 2;
    const heightHalf = window.innerHeight / 2;

    CONFIG.hotspots.forEach(spot => {
      if (!spot.domElement) return;

      tempV.copy(spot.position);
      tempV.y += 0.9;
      tempV.project(this.camera);

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

    this.updateActiveNavState(targetKey);

    if (this.isTourActive && targetKey !== 'home') {
      this.toggleTour(false);
    }

    const tl = gsap.timeline({
      onComplete: () => {
        this.isTransitioning = false;
        if (targetKey !== 'home') {
          this.openModal(targetKey);
        } else {
          this.closeModal();
          this.showHeroCard(true);
        }
      }
    });

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

    const meta = {
      about: { category: 'STUDENT DEVELOPER', title: 'About Murari Kumar' },
      skills: { category: 'TECHNICAL ARSENAL', title: 'Skills & Engineering Stack' },
      astropulse: { category: 'SMM PLATFORM & SERVICES', title: 'Astropulse SMM Provider' },
      nexora: { category: 'FEATURED AI PRODUCT', title: 'Nexora AI Web Builder' },
      cropindia: { category: 'INNOVATION CONCEPT', title: 'CropIndia AI' },
      education: { category: 'ACADEMICS', title: 'Diploma in Computer Science' },
      contact: { category: 'LET\'S CONNECT', title: 'Get In Touch' }
    };

    const info = meta[sectionId] || { category: 'PORTFOLIO', title: 'Information' };
    this.dom.modalCategory.textContent = info.category;
    this.dom.modalHeading.textContent = info.title;

    this.dom.modalBody.innerHTML = templateEl.innerHTML;
    this.attachModalDynamicListeners();

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

  initUIEvents() {
    this.dom.navLinks.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');
        this.navigateTo(target);
      });
    });

    this.dom.mobileNavLinks.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');
        this.dom.mobileMenu.classList.remove('open');
        this.navigateTo(target);
      });
    });

    this.dom.brandLogo.addEventListener('click', () => {
      this.navigateTo('home');
    });

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

    this.dom.modalCloseBtn.addEventListener('click', () => {
      this.closeModal();
      this.navigateTo('home');
    });

    this.dom.modalBackBtn.addEventListener('click', () => {
      this.closeModal();
      this.navigateTo('home');
    });

    this.dom.modalBackdrop.addEventListener('click', (e) => {
      if (e.target === this.dom.modalBackdrop) {
        this.closeModal();
        this.navigateTo('home');
      }
    });

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

    this.dom.tourToggleBtn.addEventListener('click', () => this.toggleTour());
    this.dom.resetCamBtn.addEventListener('click', () => this.navigateTo('home'));

    this.dom.menuToggleBtn.addEventListener('click', () => {
      this.dom.mobileMenu.classList.add('open');
      audio.playClick();
    });

    this.dom.mobileMenuClose.addEventListener('click', () => {
      this.dom.mobileMenu.classList.remove('open');
    });

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
          copyBtn.textContent = 'Select & Copy Email';
        });
      });
    }
  }

  onPointerDown(e) {
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
      { p: 25, msg: 'Expanding city island & road network...' },
      { p: 55, msg: 'Constructing Astropulse SMM corporate campus...' },
      { p: 80, msg: 'Assigning team jobs & activating automated gate...' },
      { p: 100, msg: 'Miniature 3D city ready!' }
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
    gsap.from(this.camera.position, {
      y: 50,
      z: 65,
      duration: 2.4,
      ease: 'power3.out',
      onUpdate: () => this.controls.update()
    });
  }

  /* ========================================================================
     9. ANIMATION LOOP & LIVE EVENT TICK HANDLERS
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

    this.controls.update();

    // 1. Auto Tour Mode
    if (this.isTourActive && !this.isTransitioning) {
      const radius = 42;
      const speed = 0.12;
      this.camera.position.x = Math.cos(elapsedTime * speed) * radius;
      this.camera.position.z = Math.sin(elapsedTime * speed) * radius;
      this.camera.lookAt(CONFIG.views.home.target);
    }

    // 2. Astropulse SMM Automated Barrier Gate (Opens and Closes on loop!)
    if (this.animatedObjects.smmGate) {
      // 8 second cycle: 0-3s closed, 3-4s lifting, 4-6s open, 6-7s lowering
      const gateCycle = (elapsedTime % 8);
      let angle = 0;
      if (gateCycle >= 3 && gateCycle < 4) {
        // Lifting open
        angle = (gateCycle - 3) * (Math.PI / 2.3);
      } else if (gateCycle >= 4 && gateCycle < 6) {
        // Held open
        angle = Math.PI / 2.3;
      } else if (gateCycle >= 6 && gateCycle < 7) {
        // Lowering closed
        angle = (1 - (gateCycle - 6)) * (Math.PI / 2.3);
      } else {
        angle = 0;
      }
      this.animatedObjects.smmGate.rotation.z = angle;
    }

    // 3. Astropulse SMM Employees Assigned Job Animations
    this.animatedObjects.smmEmployees.forEach(emp => {
      switch (emp.role) {
        case 'guard':
          // Salutes with right arm when gate is opening
          emp.rArm.rotation.x = Math.sin(elapsedTime * 2) * 0.4 - 0.4;
          emp.head.rotation.y = Math.sin(elapsedTime * 1.5) * 0.25;
          break;
        case 'server_engineer':
          // Typing rapidly on keyboards
          emp.lArm.rotation.x = -Math.PI / 3 + Math.sin(elapsedTime * 12) * 0.15;
          emp.rArm.rotation.x = -Math.PI / 3 + Math.cos(elapsedTime * 12) * 0.15;
          break;
        case 'strategist':
          // Gesturing at social analytics chart
          emp.rArm.rotation.x = -Math.PI / 2.5 + Math.sin(elapsedTime * 2.5) * 0.3;
          emp.lArm.rotation.z = Math.sin(elapsedTime * 2) * 0.2;
          break;
        case 'support':
          // Nodding head and gentle gestures
          emp.head.rotation.x = Math.sin(elapsedTime * 4) * 0.15;
          emp.rArm.rotation.x = -Math.PI / 4 + Math.sin(elapsedTime * 3) * 0.2;
          break;
        case 'courier': {
          // Walking back and forth between office and gate
          const t = Math.sin(elapsedTime * 1.2);
          emp.group.position.x = 7.0 + t * 2.5;
          emp.group.rotation.y = t >= 0 ? 0 : Math.PI;
          emp.lLeg.rotation.x = Math.sin(elapsedTime * 6) * 0.4;
          emp.rLeg.rotation.x = -Math.sin(elapsedTime * 6) * 0.4;
          break;
        }
        case 'coffee':
          // Raising coffee mug to sip
          emp.rArm.rotation.x = -Math.PI / 3 + Math.sin(elapsedTime * 1.5) * 0.35;
          break;
        case 'designer':
          // Typing and inspecting dual monitors
          emp.lArm.rotation.x = -Math.PI / 3.5 + Math.sin(elapsedTime * 8) * 0.1;
          emp.rArm.rotation.x = -Math.PI / 3.5 + Math.cos(elapsedTime * 8) * 0.1;
          break;
        case 'api_eng':
          // Tapping tablet
          emp.lArm.rotation.x = -Math.PI / 3;
          emp.rArm.rotation.x = -Math.PI / 3 + Math.sin(elapsedTime * 10) * 0.12;
          break;
      }
    });

    // 4. Commuter: Leaves House, Walks Down Sidewalk, & Returns Home
    if (this.animatedObjects.commuter) {
      const c = this.animatedObjects.commuter;
      const walkTime = 16; // 16 second commute cycle
      const phase = (elapsedTime % walkTime);

      if (phase < 6) {
        // Walking out from house (-12, 2.9, 3.4) toward city center (-2, 2.9, 3.4)
        const progress = phase / 6;
        c.group.position.x = -12 + progress * 10;
        c.group.rotation.y = Math.PI / 2; // Facing city
        c.lLeg.rotation.x = Math.sin(elapsedTime * 8) * 0.45;
        c.rLeg.rotation.x = -Math.sin(elapsedTime * 8) * 0.45;
        c.lArm.rotation.x = -Math.sin(elapsedTime * 8) * 0.4;
        c.rArm.rotation.x = Math.sin(elapsedTime * 8) * 0.4;
        c.group.visible = true;
      } else if (phase < 8) {
        // Paused at city destination greeting
        c.lLeg.rotation.x = 0;
        c.rLeg.rotation.x = 0;
        c.lArm.rotation.x = 0;
        c.rArm.rotation.x = 0;
      } else if (phase < 14) {
        // Walking back to house
        const progress = (phase - 8) / 6;
        c.group.position.x = -2 - progress * 10;
        c.group.rotation.y = -Math.PI / 2; // Facing home
        c.lLeg.rotation.x = Math.sin(elapsedTime * 8) * 0.45;
        c.rLeg.rotation.x = -Math.sin(elapsedTime * 8) * 0.45;
        c.lArm.rotation.x = -Math.sin(elapsedTime * 8) * 0.4;
        c.rArm.rotation.x = Math.sin(elapsedTime * 8) * 0.4;
        c.group.visible = true;
      } else {
        // Inside house relaxing!
        c.group.visible = false;
      }
    }

    // 5. The Falling Cyclist Event! (Cycles, wobbles, tumbles down, recovers!)
    if (this.animatedObjects.cyclist) {
      const cy = this.animatedObjects.cyclist;
      const loopTime = 16; // 16-second dynamic cycle
      const cycleTime = (elapsedTime % loopTime);

      if (cycleTime < 6.5) {
        // Normal pedaling along avenue
        const speed = 2.4;
        cy.group.position.x = -14 + (cycleTime * speed);
        cy.group.position.y = 2.9;
        cy.group.rotation.set(0, Math.PI / 2, 0); // Upright
        cy.bike.rotation.z = 0;
        cy.rider.rotation.z = -0.22;
        cy.rider.position.set(0, 0, 0);
      } else if (cycleTime < 7.8) {
        // Wobble! Hits a road bump
        const wobble = Math.sin(elapsedTime * 24) * 0.3;
        cy.group.position.x = 1.6;
        cy.bike.rotation.z = wobble;
        cy.rider.rotation.z = -wobble;
      } else if (cycleTime < 10.5) {
        // Tumble / Fall Down on the road!
        cy.bike.rotation.z = -Math.PI / 2.3; // Bike flat on side
        cy.rider.position.set(0.6, -0.45, 0.4); // Rider on the ground
        cy.rider.rotation.z = -Math.PI / 2.2;
      } else if (cycleTime < 12.5) {
        // Sits up and shakes off dust ("Ouch!")
        cy.bike.rotation.z = -Math.PI / 2.3;
        cy.rider.position.set(0.4, -0.15, 0.2);
        cy.rider.rotation.z = -0.4; // Sitting up
      } else if (cycleTime < 14.5) {
        // Stands up & lifts bike upright
        cy.bike.rotation.z = 0; // Bike lifted back up
        cy.rider.position.set(0, 0, 0);
        cy.rider.rotation.z = 0; // Standing beside bike
      } else {
        // Mounts back on bike and prepares to ride
        cy.rider.rotation.z = -0.22;
      }
    }

    // 6. Farmer Farming with Hoe at the Terraced Fields
    if (this.animatedObjects.farmer) {
      const f = this.animatedObjects.farmer;
      // Rhythmic hoeing swing into soil
      const farmCycle = (elapsedTime * 2.8) % (Math.PI * 2);
      f.torso.rotation.x = Math.sin(farmCycle) * 0.35 + 0.15; // Bends forward
      f.hoeArm.rotation.x = -Math.sin(farmCycle) * 0.65; // Swings hoe
    }

    // 7. Welcome Guide / Narrator Moving Both Hands
    if (this.animatedObjects.guide) {
      const g = this.animatedObjects.guide;
      // Active presentation gestures with both arms
      g.lArm.rotation.x = Math.sin(elapsedTime * 3) * 0.5 - 0.5;
      g.lArm.rotation.z = Math.sin(elapsedTime * 2.5) * 0.4 - 0.4; // Arm spread wide
      g.rArm.rotation.x = Math.cos(elapsedTime * 3) * 0.5 - 0.5;
      g.rArm.rotation.z = -Math.cos(elapsedTime * 2.5) * 0.4 + 0.4; // Arm spread wide
      g.head.rotation.y = Math.sin(elapsedTime * 2) * 0.25;
    }

    // 8. Rotating Windmill Blades
    if (this.animatedObjects.windmillBlades) {
      this.animatedObjects.windmillBlades.rotation.z -= delta * 1.8;
    }

    // 9. Floating & Rotating AI Crystal
    if (this.animatedObjects.aiCrystal) {
      this.animatedObjects.aiCrystal.rotation.y += delta * 1.2;
      this.animatedObjects.aiCrystal.position.y = 2.2 + Math.sin(elapsedTime * 2.5) * 0.18;
    }
    if (this.animatedObjects.aiRing) {
      this.animatedObjects.aiRing.rotation.z += delta * 0.8;
    }

    // 10. Camper Van Idle Bounce
    if (this.animatedObjects.van) {
      this.animatedObjects.van.position.y = 2.9 + Math.sin(elapsedTime * 4) * 0.015;
    }

    // 11. Campfire Light Flicker
    if (this.animatedObjects.campfireLight) {
      this.animatedObjects.campfireLight.intensity = 2.0 + Math.sin(elapsedTime * 12) * 0.4 + Math.cos(elapsedTime * 7) * 0.2;
    }

    // 12. Drifting Clouds
    this.animatedObjects.clouds.forEach(cloud => {
      cloud.angle += cloud.speed;
      cloud.mesh.position.x = Math.cos(cloud.angle) * cloud.radius;
      cloud.mesh.position.z = Math.sin(cloud.angle) * cloud.radius;
      cloud.mesh.position.y = cloud.baseY + Math.sin(elapsedTime + cloud.angle) * 0.4;
    });

    // 13. Rising Particles
    if (this.animatedObjects.particles) {
      const pos = this.animatedObjects.particles.mesh.geometry.attributes.position;
      const speeds = this.animatedObjects.particles.speeds;
      for (let i = 0; i < this.animatedObjects.particles.count; i++) {
        let y = pos.getY(i) + speeds[i];
        if (y > 20) y = 3;
        pos.setY(i, y);
      }
      pos.needsUpdate = true;
    }

    // 14. Hotspots Pulse & Gem Rotation
    this.animatedObjects.hotspotMeshes.forEach((spot, i) => {
      spot.gem.rotation.y += delta * 1.5;
      spot.gem.position.y = 0.6 + Math.sin(elapsedTime * 3 + i) * 0.1;
      const scale = 1 + Math.sin(elapsedTime * 4 + i) * 0.15;
      spot.ring.scale.set(scale, scale, 1);
    });

    // 15. Project Hotspot DOM overlay
    this.updateHotspotsProjection();

    // 16. Render Scene
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
