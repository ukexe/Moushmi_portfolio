"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";

// Radius of the spherical volume the particles occupy.
const FIELD_RADIUS = 6;

/**
 * WireframeShell — a large, slowly tumbling wireframe icosahedron. An outer
 * group tilts toward the cursor (smooth lerp) while the inner mesh spins
 * continuously. Skips all motion when `animate` is false (reduced motion).
 */
function WireframeShell({ animate }: { animate: boolean }) {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!animate) return;

    // Continuous slow rotation.
    if (mesh.current) {
      mesh.current.rotation.x += delta * 0.05;
      mesh.current.rotation.y += delta * 0.075;
    }

    // Tilt the whole shell gently toward the pointer.
    if (group.current) {
      const targetX = state.pointer.y * 0.25;
      const targetY = state.pointer.x * 0.25;
      group.current.rotation.x += (targetX - group.current.rotation.x) * 0.05;
      group.current.rotation.y += (targetY - group.current.rotation.y) * 0.05;
    }
  });

  return (
    <group ref={group}>
      <mesh ref={mesh} scale={3.2}>
        <icosahedronGeometry args={[1, 4]} />
        <meshStandardMaterial
          color="#C4785A"
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>
    </group>
  );
}

/**
 * ParticleField — a configurable number of points drifting upward through a
 * sphere, with a cursor repel. Particle count is reduced on mobile.
 */
function ParticleField({ count, animate }: { count: number; animate: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const cursor = useRef(new THREE.Vector3());

  // Build initial positions + per-particle drift speeds once (per count).
  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const r = FIELD_RADIUS * Math.cbrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = Math.random() * (FIELD_RADIUS * 2) - FIELD_RADIUS;
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      speeds[i] = 0.1 + Math.random() * 0.3;
    }

    return { positions, speeds };
  }, [count]);

  useFrame((state, delta) => {
    if (!animate) return;
    const points = pointsRef.current;
    if (!points) return;

    const attr = points.geometry.attributes.position as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;

    cursor.current.set(
      state.pointer.x * FIELD_RADIUS,
      state.pointer.y * FIELD_RADIUS,
      0
    );

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      arr[iy] += speeds[i] * delta;

      if (arr[iy] > FIELD_RADIUS) {
        const r = FIELD_RADIUS * Math.cbrt(Math.random());
        const theta = Math.random() * Math.PI * 2;
        arr[iy] = -FIELD_RADIUS;
        arr[ix] = r * Math.cos(theta);
        arr[iz] = r * Math.sin(theta);
      }

      const dx = arr[ix] - cursor.current.x;
      const dy = arr[iy] - cursor.current.y;
      const distSq = dx * dx + dy * dy;
      if (distSq < 1.5) {
        const force = (1.5 - distSq) * 0.04;
        arr[ix] += dx * force;
        arr[iy] += dy * force;
      }
    }

    attr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} key={count}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color="#F0EDE8"
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/**
 * GlowingCore — a small emissive sphere wrapped in a warm point light, pulsing
 * to feed the bloom pass. Holds a steady glow when motion is disabled.
 */
function GlowingCore({ animate }: { animate: boolean }) {
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    if (!animate) return;
    if (materialRef.current) {
      materialRef.current.emissiveIntensity =
        2.25 + Math.sin(state.clock.elapsedTime * 2) * 0.75;
    }
  });

  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          ref={materialRef}
          color="#C4785A"
          emissive="#C4785A"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
      <pointLight color="#C4785A" intensity={3} distance={8} />
    </group>
  );
}

/**
 * HeroScene — the hero background. Adapts to device + motion preferences:
 * fewer particles and pixelRatio 1 on mobile, and a static (demand) frameloop
 * with all motion disabled under prefers-reduced-motion.
 */
export function HeroScene() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [animate, setAnimate] = useState(true);
  // Whether the hero is currently in the viewport — when it scrolls away we
  // pause rendering entirely to save the GPU.
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const mobileMq = window.matchMedia("(max-width: 767px)");
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      setIsMobile(mobileMq.matches);
      setAnimate(!motionMq.matches);
    };
    update();

    mobileMq.addEventListener("change", update);
    motionMq.addEventListener("change", update);
    return () => {
      mobileMq.removeEventListener("change", update);
      motionMq.removeEventListener("change", update);
    };
  }, []);

  // Pause the render loop when the hero leaves the viewport.
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Fewer particles on mobile; a leaner default on desktop for smoothness.
  const particleCount = isMobile ? 600 : 1800;
  // Render continuously only when visible and motion is allowed; otherwise the
  // demand loop keeps the canvas static (no wasted frames).
  const frameloop = animate && inView ? "always" : "demand";

  return (
    <div ref={wrapperRef} className="h-full w-full">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={isMobile ? 1 : [1, 1.5]}
        frameloop={frameloop}
        gl={{ antialias: !isMobile, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#0D0D0D"]} />
        <fogExp2 attach="fog" args={["#0D0D0D", 0.035]} />

        <ambientLight intensity={0.3} />

        <WireframeShell animate={animate && inView} />
        <ParticleField count={particleCount} animate={animate && inView} />
        <GlowingCore animate={animate && inView} />

        {/* Bloom + vignette are costly; desktop only. */}
        {!isMobile && (
          <EffectComposer>
            <Bloom luminanceThreshold={0.2} intensity={1.3} mipmapBlur />
            <Vignette darkness={0.6} offset={0.3} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
