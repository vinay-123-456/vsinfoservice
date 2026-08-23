/* ==========================================================================
   VS INFOSERVICE - Brew District 24 3D Continuous Flip & Exploded View Engine
   Interactive Exploded View Telemetry & Scroll Morphing Physics
   ========================================================================== */

(function () {
  'use strict';

  if (typeof THREE === 'undefined') return;

  let scene, camera, renderer;
  let heroProductMesh, internalLayersGroup, particleMatrix, waveGrid;
  let pointLightCyan, pointLightBlue, pointLightEmerald, ambientLight;

  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;

  // Lerped scroll progress state (0.0 to 1.0)
  let currentScrollProgress = 0;
  let targetScrollProgress = 0;
  let manualExplodeFactor = null; // Interactive override slider factor

  const container = document.getElementById('webgl-container');
  if (!container) return;

  function init() {
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060a12, 0.0012);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 34);

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    container.appendChild(renderer.domElement);

    // Multi-Tone Lighting
    ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    pointLightCyan = new THREE.PointLight(0x00f2fe, 5.5, 130);
    pointLightCyan.position.set(25, 20, 20);
    scene.add(pointLightCyan);

    pointLightBlue = new THREE.PointLight(0x0066cc, 5.5, 130);
    pointLightBlue.position.set(-25, -20, -10);
    scene.add(pointLightBlue);

    pointLightEmerald = new THREE.PointLight(0x00ffaa, 4.5, 100);
    pointLightEmerald.position.set(0, 25, -15);
    scene.add(pointLightEmerald);

    // Build 3D Product & Particle Objects
    createContinuousProduct();
    createParticleMatrix();
    createCyberWaveGrid();

    // Event Listeners
    window.addEventListener('resize', onWindowResize, { passive: true });
    document.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onWindowScroll, { passive: true });

    onWindowScroll();
    animate();
  }

  /* --------------------------------------------------------------------------
     1. Hero 3D SaaS / Hardware Enclosure Product
     -------------------------------------------------------------------------- */
  function createContinuousProduct() {
    heroProductMesh = new THREE.Group();

    // Base Enclosure Frame
    const frameGeo = new THREE.BoxGeometry(13.5, 8.5, 0.4);
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.2,
      metalness: 0.5
    });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    heroProductMesh.add(frame);

    // Wireframe Cyan Edge Glow
    const wireGeo = new THREE.WireframeGeometry(frameGeo);
    frame.add(new THREE.LineSegments(wireGeo, new THREE.LineBasicMaterial({ color: 0x00f2fe })));

    // Internal Connected Layers (3D Exploded View Physics)
    internalLayersGroup = new THREE.Group();
    const layerColors = [0x00f2fe, 0x0066cc, 0x00ffaa];
    for (let i = 0; i < 3; i++) {
      const layerGeo = new THREE.BoxGeometry(11.5, 6.8, 0.15);
      const layerMat = new THREE.MeshPhongMaterial({
        color: layerColors[i],
        transparent: true,
        opacity: 0.85,
        shininess: 120
      });
      const layer = new THREE.Mesh(layerGeo, layerMat);
      layer.position.set(0, 0, -i * 2.5);
      internalLayersGroup.add(layer);
    }
    heroProductMesh.add(internalLayersGroup);

    heroProductMesh.position.set(9, 0, 0);
    heroProductMesh.rotation.x = Math.PI / 6;
    heroProductMesh.rotation.y = Math.PI / 5;

    scene.add(heroProductMesh);
  }

  /* --------------------------------------------------------------------------
     2. Particle Matrix
     -------------------------------------------------------------------------- */
  function createParticleMatrix() {
    const count = 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const palette = [
      new THREE.Color(0x00f2fe),
      new THREE.Color(0x0066cc),
      new THREE.Color(0x00ffaa),
      new THREE.Color(0x38bdf8),
      new THREE.Color(0xffffff)
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
      size: 0.4,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    particleMatrix = new THREE.Points(geometry, material);
    scene.add(particleMatrix);
  }

  /* --------------------------------------------------------------------------
     3. Cyber Wireframe Wave Grid Floor
     -------------------------------------------------------------------------- */
  function createCyberWaveGrid() {
    const gridGeo = new THREE.PlaneGeometry(160, 160, 40, 40);
    const gridMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      wireframe: true,
      transparent: true,
      opacity: 0.16
    });
    waveGrid = new THREE.Mesh(gridGeo, gridMat);
    waveGrid.rotation.x = -Math.PI / 2;
    waveGrid.position.y = -18;
    scene.add(waveGrid);
  }

  /* --------------------------------------------------------------------------
     4. Interactive Exploded View API Hooks
     -------------------------------------------------------------------------- */
  window.setExplodeFactor = function (val) {
    manualExplodeFactor = parseFloat(val);
  };

  window.clearManualExplode = function () {
    manualExplodeFactor = null;
  };

  /* --------------------------------------------------------------------------
     5. Event Handlers & Animation Physics Loop
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

    /* --- 3D PRODUCT FLIP & EXPLODED LAYER PHYSICS --- */
    if (heroProductMesh) {
      heroProductMesh.rotation.x = (Math.PI / 6) + (p * Math.PI * 4);
      heroProductMesh.rotation.y = (Math.PI / 5) + (p * Math.PI * 6);
      heroProductMesh.rotation.z = Math.sin(p * Math.PI * 2) * 0.6;

      const targetX = THREE.MathUtils.lerp(9, -9, Math.sin(p * Math.PI));
      const targetY = THREE.MathUtils.lerp(0, -2, Math.cos(p * Math.PI));
      const targetZ = THREE.MathUtils.lerp(0, 12, morphFactor);

      heroProductMesh.position.x = targetX + (mouseX * 14);
      heroProductMesh.position.y = targetY - (mouseY * 14);
      heroProductMesh.position.z = targetZ;
    }

    // Exploded Layer Disassembly
    if (internalLayersGroup) {
      internalLayersGroup.children.forEach((layer, idx) => {
        layer.position.z = -idx * (2.5 + morphFactor * 5.5);
        layer.rotation.z = idx * morphFactor * 0.55;
      });
    }

    // Particle Matrix Disassembly & Re-assembly
    if (particleMatrix) {
      particleMatrix.rotation.y = p * Math.PI * 2.5 + (Date.now() * 0.0003);
      particleMatrix.scale.setScalar(1 + morphFactor * 0.7);
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
