/* ==========================================================================
   VS INFOSERVICE - Interactive 3D WebGL Scene & Scroll Engine
   Default: Vibrant Light Theme WebGL Canvas
   ========================================================================== */

(function () {
  'use strict';

  if (typeof THREE === 'undefined') return;

  let scene, camera, renderer;
  let particlesMesh, heroPolyhedron, ringMesh;
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;
  let scrollY = 0;

  const container = document.getElementById('webgl-container');
  if (!container) return;

  function init() {
    scene = new THREE.Scene();
    
    // Check initial theme preference (default: light)
    const isDark = document.body.classList.contains('dark-theme');
    scene.fog = new THREE.FogExp2(isDark ? 0x060911 : 0xe2e8f3, 0.0015);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x0096c7, 3, 100);
    pointLight1.position.set(20, 20, 20);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x6b21a8, 3, 100);
    pointLight2.position.set(-20, -20, -20);
    scene.add(pointLight2);

    createParticleUniverse();
    createHero3DPolyhedron();
    createFloatingRing();

    window.addEventListener('resize', onWindowResize);
    document.addEventListener('mousemove', onMouseMove);
    window.addEventListener('scroll', onWindowScroll);

    animate();
  }

  function createParticleUniverse() {
    const particleCount = 1400;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorChoices = [
      new THREE.Color(0x0096c7),
      new THREE.Color(0x023e8a),
      new THREE.Color(0x6b21a8),
      new THREE.Color(0xdb2777)
    ];

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 120;
      positions[i + 1] = (Math.random() - 0.5) * 120;
      positions[i + 2] = (Math.random() - 0.5) * 120;

      const randomColor = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      colors[i] = randomColor.r;
      colors[i + 1] = randomColor.g;
      colors[i + 2] = randomColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.3,
      vertexColors: true,
      transparent: true,
      opacity: 0.7
    });

    particlesMesh = new THREE.Points(geometry, material);
    scene.add(particlesMesh);
  }

  function createHero3DPolyhedron() {
    const geometry = new THREE.IcosahedronGeometry(6, 1);
    const material = new THREE.MeshPhongMaterial({
      color: 0x0096c7,
      emissive: 0x6b21a8,
      emissiveIntensity: 0.25,
      shininess: 100,
      transparent: true,
      opacity: 0.8
    });

    heroPolyhedron = new THREE.Mesh(geometry, material);
    heroPolyhedron.position.set(12, 2, -5);

    const wireframeGeo = new THREE.WireframeGeometry(geometry);
    const wireframeMat = new THREE.LineBasicMaterial({ color: 0x0096c7 });
    const wireframeMesh = new THREE.LineSegments(wireframeGeo, wireframeMat);
    heroPolyhedron.add(wireframeMesh);

    scene.add(heroPolyhedron);
  }

  function createFloatingRing() {
    const geometry = new THREE.TorusGeometry(8, 0.15, 16, 100);
    const material = new THREE.MeshBasicMaterial({ color: 0x6b21a8, wireframe: true });
    ringMesh = new THREE.Mesh(geometry, material);
    ringMesh.position.set(-14, -6, -10);
    ringMesh.rotation.x = Math.PI / 4;
    scene.add(ringMesh);
  }

  function onMouseMove(event) {
    mouseX = (event.clientX - window.innerWidth / 2) * 0.0008;
    mouseY = (event.clientY - window.innerHeight / 2) * 0.0008;
  }

  function onWindowScroll() {
    scrollY = window.scrollY;
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function animate() {
    requestAnimationFrame(animate);

    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    camera.position.x = targetX * 15;
    camera.position.y = -targetY * 15 - (scrollY * 0.008);

    if (particlesMesh) {
      particlesMesh.rotation.y += 0.0005;
    }

    if (heroPolyhedron) {
      heroPolyhedron.rotation.x += 0.004;
      heroPolyhedron.rotation.y += 0.006;
      heroPolyhedron.position.y = 2 + Math.sin(Date.now() * 0.0015) * 1.5 - (scrollY * 0.012);
    }

    if (ringMesh) {
      ringMesh.rotation.z += 0.008;
    }

    renderer.render(scene, camera);
  }

  window.update3DThemeColors = function (isDark) {
    if (scene) {
      scene.fog.color.setHex(isDark ? 0x060911 : 0xe2e8f3);
    }
  };

  window.addEventListener('load', init);
})();
