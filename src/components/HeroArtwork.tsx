"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export function HeroArtwork() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 14;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group pushed into background behind logo (negative Z)
    const bgGroup = new THREE.Group();
    bgGroup.position.z = -3;
    scene.add(bgGroup);

    // Inner 3D wireframe ring (halo behind logo)
    const ringGeo = new THREE.TorusGeometry(4.2, 0.025, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.4 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    bgGroup.add(ring);

    // Second offset ring
    const ringGeo2 = new THREE.TorusGeometry(5.2, 0.015, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.25 });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = Math.PI / 4;
    bgGroup.add(ring2);

    // Outer 3D Icosahedron wireframe cage
    const icoGeo = new THREE.IcosahedronGeometry(6.0, 1);
    const icoMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.18 });
    const ico = new THREE.Mesh(icoGeo, icoMat);
    bgGroup.add(ico);

    // Radiating 3D rays starting outside logo center
    const raysGroup = new THREE.Group();
    const rayCount = 44;
    for (let i = 0; i < rayCount; i++) {
      const angle = (i / rayCount) * Math.PI * 2;
      const points = [];
      // Start outside central logo area (radius 2.5) to clear logo center
      points.push(new THREE.Vector3(Math.cos(angle) * 2.6, Math.sin(angle) * 2.6, -1));
      points.push(new THREE.Vector3(Math.cos(angle) * 8.5, Math.sin(angle) * 8.5, (Math.random() - 0.5) * 3 - 2));
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 });
      const line = new THREE.Line(lineGeo, lineMat);
      raysGroup.add(line);
    }
    bgGroup.add(raysGroup);

    // Floating background particles
    const particleCount = 80;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 16;
      positions[i + 1] = (Math.random() - 0.5) * 16;
      positions[i + 2] = -Math.random() * 6 - 2; // Strictly behind (z <= -2)
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({ size: 0.06, color: 0xffffff, transparent: true, opacity: 0.45 });
    const particles = new THREE.Points(particleGeo, particleMat);
    bgGroup.add(particles);

    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 0.4;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 0.4;
    };
    window.addEventListener("mousemove", onMouseMove);

    let animationId: number;
    const animate = () => {
      ring.rotation.z += 0.0025;
      ring.rotation.x += 0.001;

      ring2.rotation.z -= 0.002;
      ring2.rotation.y += 0.0015;

      ico.rotation.y += 0.0015;
      ico.rotation.x -= 0.0008;

      raysGroup.rotation.z -= 0.0012;
      particles.rotation.y += 0.0004;

      // Smooth parallax tilt in background
      bgGroup.rotation.y += (mouseX - bgGroup.rotation.y) * 0.04;
      bgGroup.rotation.x += (mouseY - bgGroup.rotation.x) * 0.04;

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animate();
    setReady(true);

    const onResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      ringGeo.dispose();
      ringMat.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      icoGeo.dispose();
      icoMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className={`artwork-container ${ready ? "is-ready" : ""}`} aria-label="Hermes artwork with background 3D animation" role="img">
      <div ref={containerRef} className="art-three-canvas-bg" />
      <div className="art-logo-front">
        <Image
          src="/logo.png"
          alt="Hermes Logo"
          width={650}
          height={650}
          className="hero-logo-img"
          priority
        />
      </div>
    </div>
  );
}
