/* ==========================================================================
   VS INFOSERVICE - Surrealist 3D Sculpture Engine (Light Alabaster Studio)
   Organic Dreamlike Geometry, Champagne Gold Shaders & Light UI Palette (#fbf9f5)
   ========================================================================== */

(function () {
  'use strict';

  if (typeof THREE === 'undefined') return;

  let scene, camera, renderer;
  let surrealSculptureGroup, goldTorusKnot, porcelainSphere, floatingGeomsGroup, particleCloud, waveGrid;
  let pointLightGold, pointLightSapphire, pointLightPearl, ambientLight;

  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;

  // Lerped scroll progress state (0.0 to 1.0)
  let currentScrollProgress = 0;
  let targetScrollProgress = 0;
  let manualExplodeFactor = null;

  const container = document.getElementById('webgl-container');
  if (!container) return;

  function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfbf9f5); // Soft Alabaster Studio
    scene.fog = new THREE.FogExp2(0xfbf9f5, 0.0012);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 34);

    renderer = new THREE.WebGLRenderer({ alpha: false, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // Studio Ambient & Champagne Lighting
    ambientLight = new THREE.AmbientLight(0xffffff, 0.92);
    scene.add(ambientLight);

    pointLightGold = new THREE.PointLight(0xd4af37, 5.0, 130); // Metallic Champagne Gold
    pointLightGold.position.set(25, 20, 20);
    scene.add(pointLightGold);

    pointLightSapphire = new THREE.PointLight(0x0066cc, 4.5, 130); // Cobalt Sapphire
    pointLightSapphire.position.set(-25, -20, -10);
    scene.add(pointLightSapphire);

    pointLightPearl = new THREE.PointLight(0xe07a5f, 3.5, 100); // Ethereal Rose
    pointLightPearl.position.set(0, 25, -15);
    scene.add(pointLightPearl);

    // Build 3D Surrealist Objects
    createSurrealSculpture();
    createParticleConstellation();
    createCyberWaveGrid();

    // Event Listeners
    window.addEventListener('resize', onWindowResize, { passive: true });
    document.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onWindowScroll, { passive: true });

    onWindowScroll();
    animate();
  }

  /* --------------------------------------------------------------------------
     1. Surrealist Torus Knot & Porcelain Assembly
     -------------------------------------------------------------------------- */
  function createSurrealSculpture() {
    surrealSculptureGroup = new THREE.Group();

    // Polished Champagne Gold Torus Knot
    const torusGeo = new THREE.TorusKnotGeometry(5.2, 1.3, 128, 32);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.15,
      metalness: 0.85,
      envMapIntensity: 1.5
    });
    goldTorusKnot = new THREE.Mesh(torusGeo, goldMat);
    goldTorusKnot.castShadow = true;
    goldTorusKnot.receiveShadow = true;
    surrealSculptureGroup.add(goldTorusKnot);

    // Central Smooth Porcelain Core Sphere
    const sphereGeo = new THREE.SphereGeometry(3.2, 64, 64);
    const sphereMat = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      emissive: 0xf4efe6,
      emissiveIntensity: 0.5,
      shininess: 140,
      transparent: true,
      opacity: 0.88
    });
    porcelainSphere = new THREE.Mesh(sphereGeo, sphereMat);
    surrealSculptureGroup.add(porcelainSphere);

    // Floating Geometric Surreal Forms (Icosahedrons & Rings)
    floatingGeomsGroup = new THREE.Group();
    const icoGeo = new THREE.IcosahedronGeometry(1.6, 0);
    const sapphireMat = new THREE.MeshStandardMaterial({
      color: 0x0066cc,
      roughness: 0.2,
      metalness: 0.7
    });

    for (let i = 0; i < 4; i++) {
      const ico = new THREE.Mesh(icoGeo, sapphireMat);
      ico.position.set(
        Math.cos(i * Math.PI / 2) * 8.5,
        Math.sin(i * Math.PI / 2) * 5.5,
        (i % 2 === 0 ? 3 : -3)
      );
      floatingGeomsGroup.add(ico);
    }
    surrealSculptureGroup.add(floatingGeomsGroup);

    surrealSculptureGroup.position.set(9, 0, 0);
    surrealSculptureGroup.rotation.x = Math.PI / 6;
    surrealSculptureGroup.rotation.y = Math.PI / 4;

    scene.add(surrealSculptureGroup);
  }

  /* --------------------------------------------------------------------------
     2. Ethereal Particle Constellation Network
     -------------------------------------------------------------------------- */
  function createParticleConstellation() {
    const count = 1800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const palette = [
      new THREE.Color(0xd4af37), // Champagne Gold
      new THREE.Color(0x0066cc), // Cobalt Sapphire
      new THREE.Color(0x00b4d8), // Pearl Cyan
      new THREE.Color(0x0f172a), // Ebony Slate
      new THREE.Color(0xffffff)  // Pure Porcelain White
    ];

    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 140;
      positions[i + 1] = (Math.random() - 0.5) * 140;
      positions[i + 2] = (Math.random() - 0.5) * 90;

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i] = col.r;
      colors[i + 1] = col.g;
      colors[i + 2] = col.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.38,
      vertexColors: true,
      transparent: true,
      opacity: 0.75
    });

    particleCloud = new THREE.Points(geometry, material);
    scene.add(particleCloud);
  }

  /* --------------------------------------------------------------------------
     3. Cyber Wireframe Wave Grid Floor
     -------------------------------------------------------------------------- */
  function createCyberWaveGrid() {
    const gridGeo = new THREE.PlaneGeometry(160, 160, 40, 40);
    const gridMat = new THREE.MeshBasicMaterial({
      color: 0xd4af37,
      wireframe: true,
      transparent: true,
      opacity: 0.14
    });
    waveGrid = new THREE.Mesh(gridGeo, gridMat);
    waveGrid.rotation.x = -Math.PI / 2;
    waveGrid.position.y = -18;
    scene.add(waveGrid);
  }

  /* --------------------------------------------------------------------------
     4. Interactive API Hooks
     -------------------------------------------------------------------------- */
  window.setExplodeFactor = function (val) {
    manualExplodeFactor = parseFloat(val);
  };

  window.clearManualExplode = function () {
    manualExplodeFactor = null;
  };

  /* --------------------------------------------------------------------------
     5. Surrealist Morphing Loop
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

  function animate() {
    requestAnimationFrame(animate);

    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;
    currentScrollProgress += (targetScrollProgress - currentScrollProgress) * 0.06;

    const p = currentScrollProgress;
    const scrollFactor = Math.sin(p * Math.PI);
    const morphFactor = (manualExplodeFactor !== null) ? manualExplodeFactor : scrollFactor;

    /* --- SURREALIST SCULPTURE MORPHING PHYSICS --- */
    if (surrealSculptureGroup) {
      surrealSculptureGroup.rotation.x = (Math.PI / 6) + (p * Math.PI * 3);
      surrealSculptureGroup.rotation.y = (Math.PI / 4) + (p * Math.PI * 5);

      const targetX = THREE.MathUtils.lerp(9, -9, Math.sin(p * Math.PI));
      const targetY = THREE.MathUtils.lerp(0, -2, Math.cos(p * Math.PI));
      const targetZ = THREE.MathUtils.lerp(0, 10, morphFactor);

      surrealSculptureGroup.position.x = targetX + (mouseX * 14);
      surrealSculptureGroup.position.y = targetY - (mouseY * 14);
      surrealSculptureGroup.position.z = targetZ;
    }

    if (floatingGeomsGroup) {
      floatingGeomsGroup.children.forEach((child, idx) => {
        child.position.x = Math.cos(idx * Math.PI / 2 + p * Math.PI * 2) * (8.5 + morphFactor * 6.0);
        child.rotation.y = Date.now() * 0.001 * (idx + 1);
      });
    }

    if (particleCloud) {
      particleCloud.rotation.y = p * Math.PI * 2.5 + (Date.now() * 0.0003);
      particleCloud.scale.setScalar(1 + morphFactor * 0.6);
    }

    if (waveGrid) {
      waveGrid.position.z = (Date.now() * 0.002) % 4;
    }

    camera.position.x = mouseX * 8;
    camera.position.y = -mouseY * 8;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  window.addEventListener('load', init);
})();
