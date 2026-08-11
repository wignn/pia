"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function ScrollCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 20;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // A restrained particle field keeps the page alive without competing with content.
    const particleCount = 420;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const index = i * 3;
      particlePositions[index] = (Math.random() - 0.5) * 42;
      particlePositions[index + 1] = (Math.random() - 0.5) * 100;
      particlePositions[index + 2] = (Math.random() - 0.5) * 18 - 3;
    }
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x7070ff,
      size: 0.08,
      transparent: true,
      opacity: 0.3,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Three quiet orbital rings: one focal element, no large pipe geometry.
    const orbit = new THREE.Group();
    const ringMeshes: THREE.Mesh[] = [];
    const rings = [
      { radius: 5.5, color: 0xffffff, opacity: 0.22, tilt: 0.34 },
      { radius: 7.8, color: 0x6969ff, opacity: 0.16, tilt: -0.48 },
      { radius: 10.5, color: 0x00d9ff, opacity: 0.1, tilt: 0.18 },
    ];

    for (const ring of rings) {
      const geometry = new THREE.TorusGeometry(ring.radius, 0.018, 12, 96);
      const material = new THREE.MeshBasicMaterial({
        color: ring.color,
        transparent: true,
        opacity: ring.opacity,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = ring.tilt;
      ringMeshes.push(mesh);
      orbit.add(mesh);
    }
    orbit.position.set(4, 0, -5);
    scene.add(orbit);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let scrollProgress = window.scrollY / Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    let targetScrollProgress = scrollProgress;
    let animationId = 0;
    const clock = new THREE.Clock();

    const onScroll = () => {
      targetScrollProgress = window.scrollY / Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    };
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      scrollProgress += (targetScrollProgress - scrollProgress) * 0.045;

      if (!prefersReducedMotion) {
        orbit.position.y = 2.5 - scrollProgress * 5;
        orbit.position.x = 4 + Math.sin(scrollProgress * Math.PI * 2) * 1.2;
        orbit.rotation.z = elapsed * 0.018 + scrollProgress * Math.PI * 0.4;
        orbit.rotation.y = Math.sin(elapsed * 0.12) * 0.08;
        particles.rotation.y = elapsed * 0.008;
        particles.position.y = -scrollProgress * 4;
      }

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);

      particleGeometry.dispose();
      particleMaterial.dispose();
      ringMeshes.forEach((mesh) => {
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
      });
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true" />;
}
