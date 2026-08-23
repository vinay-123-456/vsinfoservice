/* ==========================================================================
   VS INFOSERVICE - Persistent 11-Section WebGL 3D Scroll Journey Engine
   ========================================================================== */

(function () {
  'use strict';

  if (typeof THREE === 'undefined') return;

  let scene, camera, renderer;
  let sec01BrowserGroup, sec02LayersGroup, sec03CodeGroup, sec04UIMorphGroup, sec05DataParticles, sec06SEOGroup, sec07NeuralGroup, sec08SaaSGroup, sec09RingGroup, sec10ServicesRingGroup, sec11FinalGroup;
  let ambientLight, keyLight, fillLight, spotLight;

  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;

  // Lerped scroll progress state (0.0 to 1.0)
  let currentScrollProgress = 0;
  let targetScrollProgress = 0;

  const container = document.getElementById('webgl-container');
  if (!container) return;

  function init() {
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050608, 0.0015);

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 35);

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // Studio Lighting
    ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    spotLight = new THREE.SpotLight(0xffffff, 4);
    spotLight.position.set(15, 35, 30);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.8;
    scene.add(spotLight);

    keyLight = new THREE.PointLight(0xff4100, 5, 150); // Flame Orange Accent
    keyLight.position.set(25, 20, 20);
    scene.add(keyLight);

    fillLight = new THREE.PointLight(0x00f2fe, 5, 150); // Neon Cyan Accent
    fillLight.position.set(-25, -20, -10);
    scene.add(fillLight);

    // Build Objects for All 11 Sections
    buildSec01Browser();
    buildSec02Layers();
    buildSec03Code();
    buildSec04UIMorph();
    buildSec05DataParticles();
    buildSec06SEO();
    buildSec07Neural();
    buildSec08SaaS();
    buildSec09AssemblyRing();
    buildSec10ServicesRing();
    buildSec11FinalCore();

    // Event Listeners
    window.addEventListener('resize', onWindowResize, { passive: true });
    document.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onWindowScroll, { passive: true });

    onWindowScroll(); // Initial scroll
    animate();
  }

  /* --------------------------------------------------------------------------
     SEC 01 — THE DIGITAL WORLD (3D Floating Browser Window)
     -------------------------------------------------------------------------- */
  function buildSec01Browser() {
    sec01BrowserGroup = new THREE.Group();

    const frameGeo = new THREE.BoxGeometry(14, 9, 0.4);
    const frameMat = new THREE.MeshPhongMaterial({
      color: 0x090c12,
      emissive: 0x00f2fe,
      emissiveIntensity: 0.25,
      transparent: true,
      opacity: 0.9
    });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    sec01BrowserGroup.add(frame);

    const wireGeo = new THREE.WireframeGeometry(frameGeo);
    const wireMat = new THREE.LineBasicMaterial({ color: 0x00f2fe, linewidth: 2 });
    sec01BrowserGroup.add(new THREE.LineSegments(wireGeo, wireMat));

    // Traffic light buttons
    const btnGeo = new THREE.CircleGeometry(0.25, 16);
    const colors = [0xff5f56, 0xffbd2e, 0x27c93f];
    colors.forEach((col, idx) => {
      const btnMat = new THREE.MeshBasicMaterial({ color: col });
      const btn = new THREE.Mesh(btnGeo, btnMat);
      btn.position.set(-5.8 + idx * 0.7, 3.7, 0.25);
      sec01BrowserGroup.add(btn);
    });

    sec01BrowserGroup.position.set(0, 0, 0);
    scene.add(sec01BrowserGroup);
  }

  /* --------------------------------------------------------------------------
     SEC 02 — INSIDE A WEBSITE (6 Exploded 3D Architecture Layers)
     -------------------------------------------------------------------------- */
  function buildSec02Layers() {
    sec02LayersGroup = new THREE.Group();

    const layerNames = ['UI', 'FRONTEND', 'LOGIC', 'API', 'BACKEND', 'DATABASE'];
    const colors = [0xff4100, 0x00f2fe, 0x7928ca, 0xff0080, 0x00ffaa, 0xffbd2e];

    layerNames.forEach((name, idx) => {
      const layerGeo = new THREE.BoxGeometry(11, 6.5, 0.2);
      const layerMat = new THREE.MeshPhongMaterial({
        color: colors[idx],
        emissive: colors[idx],
        emissiveIntensity: 0.35,
        transparent: true,
        opacity: 0.8
      });
      const layer = new THREE.Mesh(layerGeo, layerMat);
      layer.position.set(0, 0, -idx * 3.5);

      const wireGeo = new THREE.WireframeGeometry(layerGeo);
      const wireMat = new THREE.LineBasicMaterial({ color: colors[idx] });
      layer.add(new THREE.LineSegments(wireGeo, wireMat));

      sec02LayersGroup.add(layer);
    });

    sec02LayersGroup.position.set(0, 0, -10);
    sec02LayersGroup.visible = false;
    scene.add(sec02LayersGroup);
  }

  /* --------------------------------------------------------------------------
     SEC 03 — CODE (3D Physical Code Fragment Assembly)
     -------------------------------------------------------------------------- */
  function buildSec03Code() {
    sec03CodeGroup = new THREE.Group();

    const codeBlockGeo = new THREE.BoxGeometry(1.6, 0.8, 0.8);
    const materials = [
      new THREE.MeshPhongMaterial({ color: 0xff4100, emissive: 0xff4100, emissiveIntensity: 0.5 }),
      new THREE.MeshPhongMaterial({ color: 0x00f2fe, emissive: 0x00f2fe, emissiveIntensity: 0.5 }),
      new THREE.MeshPhongMaterial({ color: 0x00ffaa, emissive: 0x00ffaa, emissiveIntensity: 0.5 })
    ];

    for (let i = 0; i < 40; i++) {
      const codeMesh = new THREE.Mesh(codeBlockGeo, materials[i % 3]);
      codeMesh.position.set((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 14, (Math.random() - 0.5) * 14);
      sec03CodeGroup.add(codeMesh);
    }

    sec03CodeGroup.visible = false;
    scene.add(sec03CodeGroup);
  }

  /* --------------------------------------------------------------------------
     SEC 04 — UI / UX (Morphing Desktop -> Tablet -> Mobile UI)
     -------------------------------------------------------------------------- */
  function buildSec04UIMorph() {
    sec04UIMorphGroup = new THREE.Group();

    const uiFrameGeo = new THREE.BoxGeometry(13, 8.5, 0.3);
    const uiFrameMat = new THREE.MeshPhongMaterial({
      color: 0x0f131d,
      emissive: 0x7928ca,
      emissiveIntensity: 0.45
    });
    const uiFrame = new THREE.Mesh(uiFrameGeo, uiFrameMat);
    sec04UIMorphGroup.add(uiFrame);

    const wireGeo = new THREE.WireframeGeometry(uiFrameGeo);
    const wireMat = new THREE.LineBasicMaterial({ color: 0xff4100, linewidth: 2 });
    uiFrame.add(new THREE.LineSegments(wireGeo, wireMat));

    sec04UIMorphGroup.visible = false;
    scene.add(sec04UIMorphGroup);
  }

  /* --------------------------------------------------------------------------
     SEC 05 — DATA (Flowing Particles Data Streams)
     -------------------------------------------------------------------------- */
  function buildSec05DataParticles() {
    const count = 2500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const palette = [new THREE.Color(0xff4100), new THREE.Color(0x00f2fe), new THREE.Color(0x7928ca), new THREE.Color(0x00ffaa)];

    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 120;
      positions[i + 1] = (Math.random() - 0.5) * 50;
      positions[i + 2] = (Math.random() - 0.5) * 50;

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i] = col.r;
      colors[i + 1] = col.g;
      colors[i + 2] = col.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({ size: 0.4, vertexColors: true, transparent: true, opacity: 0.85 });
    sec05DataParticles = new THREE.Points(geometry, material);
    sec05DataParticles.visible = false;
    scene.add(sec05DataParticles);
  }

  /* --------------------------------------------------------------------------
     SEC 06 — SEO (Search Environment & Rising Rank Card)
     -------------------------------------------------------------------------- */
  function buildSec06SEO() {
    sec06SEOGroup = new THREE.Group();

    const searchCardGeo = new THREE.BoxGeometry(9, 2.5, 0.2);
    const searchCardMat = new THREE.MeshPhongMaterial({ color: 0x090c12, emissive: 0x00ffaa, emissiveIntensity: 0.4 });

    for (let i = 0; i < 4; i++) {
      const card = new THREE.Mesh(searchCardGeo, searchCardMat);
      card.position.set(0, (1.5 - i) * 3.2, 0);

      const wireGeo = new THREE.WireframeGeometry(searchCardGeo);
      const wireMat = new THREE.LineBasicMaterial({ color: i === 0 ? 0xff4100 : 0x00f2fe });
      card.add(new THREE.LineSegments(wireGeo, wireMat));

      sec06SEOGroup.add(card);
    }

    sec06SEOGroup.visible = false;
    scene.add(sec06SEOGroup);
  }

  /* --------------------------------------------------------------------------
     SEC 07 — AI / AUTOMATION (Intelligent Neural Network)
     -------------------------------------------------------------------------- */
  function buildSec07Neural() {
    sec07NeuralGroup = new THREE.Group();

    const nodeCount = 24;
    const nodeGeo = new THREE.IcosahedronGeometry(0.75, 1);
    const nodeMat = new THREE.MeshPhongMaterial({ color: 0xff4100, emissive: 0x7928ca, emissiveIntensity: 0.9 });

    const coords = [];
    for (let i = 0; i < nodeCount; i++) {
      const mesh = new THREE.Mesh(nodeGeo, nodeMat);
      const pos = new THREE.Vector3((Math.random() - 0.5) * 18, (Math.random() - 0.5) * 14, (Math.random() - 0.5) * 12);
      mesh.position.copy(pos);
      coords.push(pos);
      sec07NeuralGroup.add(mesh);
    }

    // Connective Synapse Lines
    const linePos = [];
    for (let i = 0; i < coords.length; i++) {
      for (let j = i + 1; j < coords.length; j++) {
        if (coords[i].distanceTo(coords[j]) < 8.5) {
          linePos.push(coords[i].x, coords[i].y, coords[i].z);
          linePos.push(coords[j].x, coords[j].y, coords[j].z);
        }
      }
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePos, 3));
    const lineMat = new THREE.LineBasicMaterial({ color: 0x00f2fe, transparent: true, opacity: 0.6 });
    sec07NeuralGroup.add(new THREE.LineSegments(lineGeo, lineMat));

    sec07NeuralGroup.visible = false;
    scene.add(sec07NeuralGroup);
  }

  /* --------------------------------------------------------------------------
     SEC 08 — SOFTWARE (Full 3D SaaS Analytics Product Dashboard)
     -------------------------------------------------------------------------- */
  function buildSec08SaaS() {
    sec08SaaSGroup = new THREE.Group();

    const mainDashGeo = new THREE.BoxGeometry(14, 9, 0.4);
    const mainDashMat = new THREE.MeshPhongMaterial({ color: 0x0f131d, emissive: 0x00f2fe, emissiveIntensity: 0.3 });
    const mainDash = new THREE.Mesh(mainDashGeo, mainDashMat);
    sec08SaaSGroup.add(mainDash);

    const wireGeo = new THREE.WireframeGeometry(mainDashGeo);
    const wireMat = new THREE.LineBasicMaterial({ color: 0xff4100, linewidth: 2 });
    mainDash.add(new THREE.LineSegments(wireGeo, wireMat));

    sec08SaaSGroup.visible = false;
    scene.add(sec08SaaSGroup);
  }

  /* --------------------------------------------------------------------------
     SEC 09 — THE ASSEMBLY (Reverse Collapse into Central 3D Ring)
     -------------------------------------------------------------------------- */
  function buildSec09AssemblyRing() {
    sec09RingGroup = new THREE.Group();

    const ringGeo = new THREE.TorusGeometry(10, 0.35, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xff4100, wireframe: true });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    sec09RingGroup.add(ring);

    sec09RingGroup.visible = false;
    scene.add(sec09RingGroup);
  }

  /* --------------------------------------------------------------------------
     SEC 10 — SERVICES (Interactive 3D Circular Ring Navigation System)
     -------------------------------------------------------------------------- */
  function buildSec10ServicesRing() {
    sec10ServicesRingGroup = new THREE.Group();

    const navRingGeo = new THREE.TorusGeometry(12, 0.4, 16, 120);
    const navRingMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe, wireframe: true });
    const navRing = new THREE.Mesh(navRingGeo, navRingMat);
    sec10ServicesRingGroup.add(navRing);

    // 7 Orbiting Service Spheres
    const serviceGeo = new THREE.IcosahedronGeometry(1.0, 1);
    const serviceMat = new THREE.MeshPhongMaterial({ color: 0xff4100, emissive: 0x7928ca, emissiveIntensity: 0.8 });

    for (let i = 0; i < 7; i++) {
      const angle = (i / 7) * Math.PI * 2;
      const serviceNode = new THREE.Mesh(serviceGeo, serviceMat);
      serviceNode.position.set(Math.cos(angle) * 12, Math.sin(angle) * 12, 0);
      sec10ServicesRingGroup.add(serviceNode);
    }

    sec10ServicesRingGroup.visible = false;
    scene.add(sec10ServicesRingGroup);
  }

  /* --------------------------------------------------------------------------
     SEC 11 — FINAL EXPERIENCE (Final Core Assembly & Conclusion)
     -------------------------------------------------------------------------- */
  function buildSec11FinalCore() {
    sec11FinalGroup = new THREE.Group();

    const coreGeo = new THREE.IcosahedronGeometry(5.5, 2);
    const coreMat = new THREE.MeshPhongMaterial({
      color: 0xff4100,
      emissive: 0x00f2fe,
      emissiveIntensity: 0.9,
      wireframe: true
    });
    const finalCore = new THREE.Mesh(coreGeo, coreMat);
    sec11FinalGroup.add(finalCore);

    sec11FinalGroup.visible = false;
    scene.add(sec11FinalGroup);
  }

  /* --------------------------------------------------------------------------
     Event Handlers
     -------------------------------------------------------------------------- */
  function onMouseMove(event) {
    targetMouseX = (event.clientX - window.innerWidth / 2) * 0.0006;
    targetMouseY = (event.clientY - window.innerHeight / 2) * 0.0006;
  }

  function onWindowScroll() {
    const totalScrollable = document.documentElement.scrollHeight - window.innerHeight;
    if (totalScrollable > 0) {
      targetScrollProgress = Math.max(0, Math.min(1, window.scrollY / totalScrollable));
    }
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  /* --------------------------------------------------------------------------
     11-Section Continuous Animation Timeline & Morphing Controller Loop
     -------------------------------------------------------------------------- */
  function animate() {
    requestAnimationFrame(animate);

    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;
    currentScrollProgress += (targetScrollProgress - currentScrollProgress) * 0.06;

    const p = currentScrollProgress; // 0.0 (Section 01) to 1.0 (Section 11)

    // Calculate active section index (0 to 10)
    const sectionIndex = Math.min(10, Math.floor(p * 11));

    // Visibility toggle per section
    sec01BrowserGroup.visible = (sectionIndex === 0);
    sec02LayersGroup.visible = (sectionIndex === 1);
    sec03CodeGroup.visible = (sectionIndex === 2);
    sec04UIMorphGroup.visible = (sectionIndex === 3);
    sec05DataParticles.visible = (sectionIndex === 4);
    sec06SEOGroup.visible = (sectionIndex === 5);
    sec07NeuralGroup.visible = (sectionIndex === 6);
    sec08SaaSGroup.visible = (sectionIndex === 7);
    sec09RingGroup.visible = (sectionIndex === 8);
    sec10ServicesRingGroup.visible = (sectionIndex === 9);
    sec11FinalGroup.visible = (sectionIndex === 10);

    // Section 01: 3D Browser Floating & Camera Entry
    if (sectionIndex === 0 && sec01BrowserGroup) {
      const localP = (p / 0.091);
      sec01BrowserGroup.rotation.y = Math.sin(localP * Math.PI) * 0.3;
      sec01BrowserGroup.position.z = localP * 15; // Moves toward camera
    }

    // Section 02: Exploded Layers
    if (sectionIndex === 1 && sec02LayersGroup) {
      const localP = ((p - 0.091) / 0.091);
      sec02LayersGroup.children.forEach((child, idx) => {
        child.position.z = -idx * (3.5 + localP * 3.0); // Layers separate farther apart
      });
      sec02LayersGroup.rotation.y = localP * 0.4;
    }

    // Section 03: Code Assembly
    if (sectionIndex === 2 && sec03CodeGroup) {
      sec03CodeGroup.rotation.y += 0.01;
      sec03CodeGroup.rotation.x += 0.005;
    }

    // Section 04: UI Morphing (Desktop -> Tablet -> Mobile)
    if (sectionIndex === 3 && sec04UIMorphGroup) {
      const localP = ((p - 0.273) / 0.091);
      const scaleX = THREE.MathUtils.lerp(1.0, 0.45, localP);
      sec04UIMorphGroup.scale.set(scaleX, 1.0, 1.0);
    }

    // Section 05: Data Particles Stream
    if (sectionIndex === 4 && sec05DataParticles) {
      sec05DataParticles.rotation.y += 0.015;
    }

    // Section 06: SEO Search Environment
    if (sectionIndex === 5 && sec06SEOGroup) {
      const localP = ((p - 0.455) / 0.091);
      sec06SEOGroup.children[0].position.y = (1.5 * 3.2) + (localP * 2.0); // Rank #1 rises up!
    }

    // Section 07: AI Neural Network
    if (sectionIndex === 6 && sec07NeuralGroup) {
      sec07NeuralGroup.rotation.y += 0.008;
      sec07NeuralGroup.rotation.z += 0.004;
    }

    // Section 08: Software SaaS Product
    if (sectionIndex === 7 && sec08SaaSGroup) {
      sec08SaaSGroup.rotation.y = mouseX * 2;
      sec08SaaSGroup.rotation.x = mouseY * 2;
    }

    // Section 09: Assembly Compression Ring
    if (sectionIndex === 8 && sec09RingGroup) {
      const localP = ((p - 0.727) / 0.091);
      sec09RingGroup.rotation.z = localP * Math.PI * 4;
      sec09RingGroup.scale.setScalar(1 + Math.sin(localP * Math.PI) * 0.3);
    }

    // Section 10: Interactive Services Ring
    if (sectionIndex === 9 && sec10ServicesRingGroup) {
      sec10ServicesRingGroup.rotation.z += 0.005;
    }

    // Section 11: Final Core Assembly & Conclusion
    if (sectionIndex === 10 && sec11FinalGroup) {
      sec11FinalGroup.rotation.y += 0.02;
      sec11FinalGroup.rotation.x += 0.01;
      sec11FinalGroup.scale.setScalar(1 + Math.sin(Date.now() * 0.003) * 0.12);
    }

    // Camera Sway Physics
    camera.position.x = mouseX * 6;
    camera.position.y = -mouseY * 6;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  // Global window handle for Service Ring Rotation Trigger (Section 10)
  window.rotateServiceRingTo = function (index) {
    if (sec10ServicesRingGroup) {
      const targetAngle = (index / 7) * Math.PI * 2;
      sec10ServicesRingGroup.rotation.z = -targetAngle;
    }
  };

  window.addEventListener('load', init);
})();
