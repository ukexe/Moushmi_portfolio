"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { gsap } from "gsap";
import * as THREE from "three";

// GLSL sources via the raw-loader + glslify-loader pipeline (next.config.js).
import vertexShader from "@/shaders/projectCard.vert";
import fragmentShader from "@/shaders/projectCard.frag";

/**
 * Builds a placeholder CanvasTexture: a dark grey field with the project title
 * faintly watermarked across the centre.
 */
function makeWatermarkTexture(title: string): THREE.CanvasTexture {
  const width = 1024;
  const height = 1365;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#1A1A1A";
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "rgba(240,237,232,0.06)";
  ctx.lineWidth = 2;
  ctx.strokeRect(48, 48, width - 96, height - 96);

  ctx.fillStyle = "rgba(240,237,232,0.06)";
  ctx.font = "600 64px 'JetBrains Mono', monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const words = title.toUpperCase().split(" ");
  const lineHeight = 80;
  const startY = height / 2 - ((words.length - 1) * lineHeight) / 2;
  words.forEach((word, i) => {
    ctx.fillText(word, width / 2, startY + i * lineHeight);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

/**
 * ShaderPlane — full-bleed plane rendering the project texture through the
 * ripple shaders. uHover animates via GSAP, uTime advances each frame, uMouse
 * tracks the pointer UV.
 */
function ShaderPlane({ title, hovered }: { title: string; hovered: boolean }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();

  const texture = useMemo(() => makeWatermarkTexture(title), [title]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uHover: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uTexture: { value: texture },
    }),
    [texture]
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  useEffect(() => {
    if (!materialRef.current) return;
    gsap.to(materialRef.current.uniforms.uHover, {
      value: hovered ? 1 : 0,
      duration: 0.6,
      ease: "power2.out",
    });
  }, [hovered]);

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (event.uv && materialRef.current) {
      materialRef.current.uniforms.uMouse.value.set(event.uv.x, event.uv.y);
    }
  };

  return (
    <mesh scale={[viewport.width, viewport.height, 1]} onPointerMove={handlePointerMove}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

/**
 * ProjectCardCanvas — the lazily-loaded WebGL layer for a project card.
 */
export default function ProjectCardCanvas({
  title,
  hovered,
}: {
  title: string;
  hovered: boolean;
}) {
  return (
    <Canvas camera={{ position: [0, 0, 1], fov: 50 }} dpr={[1, 2]}>
      <ShaderPlane title={title} hovered={hovered} />
    </Canvas>
  );
}
