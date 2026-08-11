"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function ScrollCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Continuous 3D particle stream across all sections
    const count = 750;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const color1 = new THREE.Color(0x3838ff);
    const color2 = new THREE.Color(0x00ff88);

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      positions[idx] = (Math.random() - 0.5) * 50;
      positions[idx + 1] = (Math.random() - 0.5) * 160;
      positions[idx + 2] = (Math.random() - 0.5) * 30;

      const mix = Math.random();
      const c = color1.clone().lerp(color2, mix > 0.88 ? 0.7 : 0);
      colors[idx] = c.r;
      colors[idx + 1] = c.g;
      colors[idx + 2] = c.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, particleMat);
    scene.add(particles);

    // Dynamic Concentric Rings Group (Lingkaran konsentris)
    const ringGroup = new THREE.Group();
    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(10, 0.02, 16, 100),
      new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.25 })
    );
    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(14, 0.015, 16, 100),
      new THREE.MeshBasicMaterial({ color: 0x00ff88, wireframe: true, transparent: true, opacity: 0.2 })
    );
    const ring3 = new THREE.Mesh(
      new THREE.TorusGeometry(18, 0.012, 16, 100),
      new THREE.MeshBasicMaterial({ color: 0x4f4fff, wireframe: true, transparent: true, opacity: 0.15 })
    );
    ring1.rotation.x = Math.PI / 3;
    ring2.rotation.y = Math.PI / 4;
    ring3.rotation.z = Math.PI / 6;

    ringGroup.add(ring1);
    ringGroup.add(ring2);
    ringGroup.add(ring3);
    scene.add(ringGroup);

    let scrollY = window.scrollY;
    let targetScrollY = scrollY;

    const onScroll = () => {
      targetScrollY = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Smooth scroll inertia tracking
      scrollY += (targetScrollY - scrollY) * 0.05;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight || 1;
      const scrollProgress = scrollY / totalHeight;

      // Seamless camera tracking along whole page scroll
      camera.position.y = -scrollProgress * 45;
      camera.position.z = 18 + Math.sin(scrollProgress * Math.PI * 3) * 4;
      camera.rotation.z = Math.sin(scrollProgress * Math.PI * 2) * 0.1;

      // Object animation continuum
      particles.rotation.y = scrollProgress * Math.PI * 4 + elapsedTime * 0.02;

      ringGroup.rotation.z = scrollProgress * Math.PI * 4 + elapsedTime * 0.05;
      ringGroup.rotation.x = scrollProgress * Math.PI * 2 + elapsedTime * 0.02;
      ringGroup.position.y = -scrollProgress * 45;

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      particleMat.dispose();
      ring1.geometry.dispose();
      (ring1.material as THREE.Material).dispose();
      ring2.geometry.dispose();
      (ring2.material as THREE.Material).dispose();
      ring3.geometry.dispose();
      (ring3.material as THREE.Material).dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true" />;
}
