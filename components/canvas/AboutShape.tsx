"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { useIsMobile } from "@/lib/useMediaQuery";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Builds a single geometry that can morph from an icosahedron (base position)
 * into a torus knot (morph target), trimmed to a common vertex count so the
 * positions interpolate one-to-one via a morph target influence.
 */
function useMorphGeometry() {
  return useMemo(() => {
    const ico = new THREE.IcosahedronGeometry(1.2, 4).toNonIndexed();
    const knot = new THREE.TorusKnotGeometry(0.85, 0.32, 128, 16).toNonIndexed();

    const icoPos = ico.attributes.position.array as Float32Array;
    const knotPos = knot.attributes.position.array as Float32Array;

    const count = Math.min(icoPos.length, knotPos.length);
    const trimmed = count - (count % 9);

    const base = new Float32Array(icoPos.subarray(0, trimmed));
    const target = new Float32Array(knotPos.subarray(0, trimmed));

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(base, 3));
    geometry.morphAttributes.position = [new THREE.BufferAttribute(target, 3)];
    geometry.computeVertexNormals();

    ico.dispose();
    knot.dispose();
    return geometry;
  }, []);
}

/**
 * MorphForm — wireframe + metallic meshes sharing the morphing geometry. The
 * morph amount is read each rendered frame from `morphRef`; rotation only runs
 * when `animate` is true.
 */
function MorphForm({
  morphRef,
  animate,
}: {
  morphRef: MutableRefObject<number>;
  animate: boolean;
}) {
  const geometry = useMorphGeometry();
  const solidRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);

  // When a geometry is attached via the JSX prop (rather than the Mesh
  // constructor), three does NOT auto-initialise morphTargetInfluences. We must
  // call updateMorphTargets() ourselves so the renderer's morph path has a
  // valid influences array — otherwise it crashes reading `.length`.
  useLayoutEffect(() => {
    solidRef.current?.updateMorphTargets();
    wireRef.current?.updateMorphTargets();
  }, [geometry]);

  useFrame((_, delta) => {
    const p = morphRef.current;

    for (const ref of [solidRef, wireRef]) {
      const mesh = ref.current;
      if (!mesh) continue;
      if (animate) mesh.rotation.y += delta * 0.3;
      if (mesh.morphTargetInfluences) {
        mesh.morphTargetInfluences[0] = p;
      }
    }

    const solidMat = solidRef.current?.material as THREE.MeshStandardMaterial;
    const wireMat = wireRef.current?.material as THREE.MeshStandardMaterial;
    if (solidMat) solidMat.opacity = p;
    if (wireMat) wireMat.opacity = 0.6 * (1 - p);
  });

  return (
    <group>
      <mesh ref={solidRef} geometry={geometry}>
        <meshStandardMaterial
          color="#C4785A"
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0}
        />
      </mesh>
      <mesh ref={wireRef} geometry={geometry}>
        <meshStandardMaterial color="#C4785A" wireframe transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

/**
 * DemandTicker — in `frameloop="demand"` mode the canvas only renders when
 * invalidated. This drives invalidation at ~24fps while active (enough for the
 * slow rotation/morph) and renders a single frame when motion is disabled.
 */
function DemandTicker({ active }: { active: boolean }) {
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    if (!active) {
      invalidate();
      return;
    }
    const id = window.setInterval(() => invalidate(), 1000 / 24);
    return () => window.clearInterval(id);
  }, [active, invalidate]);

  return null;
}

/**
 * AboutShape — the left-column WebGL form. Scroll morphs the icosahedron into a
 * torus knot; drag to orbit on desktop. Uses a demand frameloop capped at 24fps
 * for efficiency, reduces to a static mid-morph under reduced motion, and
 * disables orbit controls on mobile.
 */
export function AboutShape() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const morphRef = useRef(0);
  const [showHint, setShowHint] = useState(true);
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  const animate = !prefersReducedMotion;

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      morphRef.current = 0.5;
      return;
    }
    const el = wrapperRef.current;
    if (!el) return;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      end: "bottom 15%",
      scrub: true,
      onUpdate: (self) => {
        morphRef.current = self.progress;
      },
    });

    return () => trigger.kill();
  }, [prefersReducedMotion]);

  return (
    <div ref={wrapperRef} className="relative h-[50vh] w-full md:h-[80vh]">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        dpr={isMobile ? 1 : [1, 2]}
        frameloop="demand"
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <MorphForm morphRef={morphRef} animate={animate} />
        <Environment preset="studio" />
        {/* Orbit only on desktop with motion enabled */}
        <OrbitControls
          enabled={!isMobile && animate}
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.05}
        />
        <DemandTicker active={animate} />
      </Canvas>

      {/* Drag hint — desktop only, fades after 3s */}
      {!isMobile && (
        <motion.span
          aria-hidden="true"
          animate={{ opacity: showHint ? 1 : 0 }}
          transition={{ duration: 0.6 }}
          className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-mist"
        >
          drag to rotate
        </motion.span>
      )}
    </div>
  );
}
