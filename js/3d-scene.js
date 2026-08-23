/* ==========================================================================
   VS INFOSERVICE - HD Microprocessor 5-Layer Sequential Assembly Engine
   Positioned Dead Center: Layers Float Down & Attach One By One On Scroll
   ========================================================================== */

(function () {
  'use strict';

  if (typeof THREE === 'undefined') return;

  let scene, camera, renderer;
  let chipGroup, layer0_BasePcb, layer1_GoldTraces, layer2_SiliconCore, layer3_SapphireShield, layer4_MetallicCap, pinsGroup;
  let pointLight1, pointLight2, ambientLight;

  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;

  // Lerped scroll progress state (0.0 to 1.0)
  let currentScrollProgress = 0;
  let targetScrollProgress = 0;

  const container = document.getElementById('webgl-container');
  if (!container) return;

  function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfcfcfa); // Light Studio Off-White
    scene.fog = new THREE.FogExp2(0xfcfcfa, 0.001);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 32);

    renderer = new THREE.WebGLRenderer({ alpha: false, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // Studio Lighting
    ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    pointLight1 = new THREE.PointLight(0x0066cc, 5.0, 130);
    pointLight1.position.set(25, 20, 20);
    scene.add(pointLight1);

    pointLight2 = new THREE.PointLight(0x00b4d8, 4.5, 130);
    pointLight2.position.set(-25, -20, -10);
    scene.add(pointLight2);

    // Build HD Microprocessor Centerpiece Assembly
    createHDMicroprocessor();

    // Event Listeners
    window.addEventListener('resize', onWindowResize, { passive: true });
    document.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onWindowScroll, { passive: true });

    onWindowScroll();
    animate();
  }

  /* --------------------------------------------------------------------------
     1. Build HD Microprocessor (5 High-Detail Layers)
     -------------------------------------------------------------------------- */
  function createHDMicroprocessor() {
    chipGroup = new THREE.Group();

    // LAYER 0: Base Ceramic PCB Substrate with Gold Contacts & Pins
    const pcbGeo = new THREE.BoxGeometry(10.5, 0.6, 10.5);
    const pcbMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.25,
      metalness: 0.2
    });
    layer0_BasePcb = new THREE.Mesh(pcbGeo, pcbMat);
    layer0_BasePcb.castShadow = true;
    layer0_BasePcb.receiveShadow = true;

    // Cyan Edge Outline
    const wireGeo = new THREE.WireframeGeometry(pcbGeo);
    layer0_BasePcb.add(new THREE.LineSegments(wireGeo, new THREE.LineBasicMaterial({ color: 0x0066cc })));

    // Pins Group
    pinsGroup = new THREE.Group();
    const pinGeo = new THREE.BoxGeometry(0.35, 0.24, 1.4);
    const pinMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.8, roughness: 0.2 });

    for (let i = 0; i < 7; i++) {
      const pinT = new THREE.Mesh(pinGeo, pinMat);
      pinT.position.set(-4.5 + i * 1.5, -0.3, 5.5);
      pinsGroup.add(pinT);

      const pinB = new THREE.Mesh(pinGeo, pinMat);
      pinB.position.set(-4.5 + i * 1.5, -0.3, -5.5);
      pinsGroup.add(pinB);
    }
    layer0_BasePcb.add(pinsGroup);
    chipGroup.add(layer0_BasePcb);

    // LAYER 1: Gold & Cyan Interconnect Trace Circuit Matrix
    const traceGeo = new THREE.BoxGeometry(8.8, 0.35, 8.8);
    const traceMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.25
    });
    layer1_GoldTraces = new THREE.Mesh(traceGeo, traceMat);
    chipGroup.add(layer1_GoldTraces);

    // LAYER 2: Glowing Silicon Micro-Die Core (VS NEURAL CORE)
    const dieGeo = new THREE.BoxGeometry(5.8, 0.7, 5.8);
    const dieMat = new THREE.MeshPhongMaterial({
      color: 0x0066cc,
      emissive: 0x00b4d8,
      emissiveIntensity: 0.75,
      shininess: 140
    });
    layer2_SiliconCore = new THREE.Mesh(dieGeo, dieMat);
    chipGroup.add(layer2_SiliconCore);

    // LAYER 3: Translucent Sapphire Heat Shield
    const shieldGeo = new THREE.BoxGeometry(9.6, 0.4, 9.6);
    const shieldMat = new THREE.MeshPhongMaterial({
      color: 0xe0f2fe,
      emissive: 0x0066cc,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.82,
      shininess: 160
    });
    layer3_SapphireShield = new THREE.Mesh(shieldGeo, shieldMat);
    chipGroup.add(layer3_SapphireShield);

    // LAYER 4: Metallic Top Cap & Emblem Shield
    const capGeo = new THREE.BoxGeometry(7.2, 0.35, 7.2);
    const capMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.7,
      roughness: 0.2
    });
    layer4_MetallicCap = new THREE.Mesh(capGeo, capMat);
    chipGroup.add(layer4_MetallicCap);

    // DEAD CENTER POSITION
    chipGroup.position.set(0, 0, 0);
    chipGroup.rotation.x = Math.PI / 4;
    chipGroup.rotation.y = Math.PI / 4;

    scene.add(chipGroup);
  }

  /* --------------------------------------------------------------------------
     2. Event Handlers
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
     3. Sequential Layer Attachment Physics Loop On Scroll
     -------------------------------------------------------------------------- */
  function animate() {
    requestAnimationFrame(animate);

    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;
    currentScrollProgress += (targetScrollProgress - currentScrollProgress) * 0.06;

    const p = currentScrollProgress; // 0.0 (top) -> 1.0 (bottom)

    /* --- SEQUENTIAL LAYER ATTACHMENT PHYSICS --- */
    // Layer 0: Base PCB stays positioned in lower center
    if (layer0_BasePcb) {
      layer0_BasePcb.position.y = -2.0;
    }

    // Layer 1 (Gold Traces): attaches onto Base PCB at y = -1.0 as p reaches 0.25
    if (layer1_GoldTraces) {
      const targetY1 = -1.0;
      const startY1 = 14.0;
      const progress1 = Math.min(1.0, Math.max(0.0, p / 0.25));
      layer1_GoldTraces.position.y = THREE.MathUtils.lerp(startY1, targetY1, progress1);
      layer1_GoldTraces.rotation.y = (1 - progress1) * Math.PI;
    }

    // Layer 2 (Silicon Core): attaches onto Gold Traces at y = 0.0 as p reaches 0.50
    if (layer2_SiliconCore) {
      const targetY2 = 0.0;
      const startY2 = 22.0;
      const progress2 = Math.min(1.0, Math.max(0.0, (p - 0.2) / 0.3));
      layer2_SiliconCore.position.y = THREE.MathUtils.lerp(startY2, targetY2, progress2);
      layer2_SiliconCore.rotation.y = (1 - progress2) * Math.PI * 1.5;
    }

    // Layer 3 (Sapphire Shield): attaches onto Silicon Core at y = 1.0 as p reaches 0.75
    if (layer3_SapphireShield) {
      const targetY3 = 1.0;
      const startY3 = 30.0;
      const progress3 = Math.min(1.0, Math.max(0.0, (p - 0.45) / 0.3));
      layer3_SapphireShield.position.y = THREE.MathUtils.lerp(startY3, targetY3, progress3);
      layer3_SapphireShield.rotation.z = (1 - progress3) * Math.PI * 0.75;
    }

    // Layer 4 (Metallic Cap): attaches onto Sapphire Shield at y = 2.0 as p reaches 1.00
    if (layer4_MetallicCap) {
      const targetY4 = 2.0;
      const startY4 = 40.0;
      const progress4 = Math.min(1.0, Math.max(0.0, (p - 0.7) / 0.3));
      layer4_MetallicCap.position.y = THREE.MathUtils.lerp(startY4, targetY4, progress4);
      layer4_MetallicCap.rotation.x = (1 - progress4) * Math.PI;
    }

    // Rotation & Mouse Follow Parallax in Center
    if (chipGroup) {
      chipGroup.rotation.x = (Math.PI / 4) + (p * Math.PI * 2);
      chipGroup.rotation.y = (Math.PI / 4) + (p * Math.PI * 3);

      chipGroup.position.x = mouseX * 12;
      chipGroup.position.y = -mouseY * 12;
    }

    // Camera LookAt Center
    camera.position.x = mouseX * 6;
    camera.position.y = -mouseY * 6;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  window.addEventListener('load', init);
})();
