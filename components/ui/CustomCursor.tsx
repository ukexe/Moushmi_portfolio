"use client";

import { useEffect, useRef, useState } from "react";

// The three cursor states the ring can be in. `default` is the resting state;
// `view` triggers over clickable elements; `explore` triggers over imagery.
type CursorVariant = "default" | "view" | "explore";

/**
 * CustomCursor replaces the native pointer with a two-part cursor:
 *   1. a small filled dot that tracks the mouse exactly, and
 *   2. a larger ring that trails the dot with a smooth lerp.
 *
 * Hovering interactive elements expands the ring and reveals a contextual
 * label ("VIEW" for links/buttons, "EXPLORE" for images). Movement is driven
 * by a single requestAnimationFrame loop reading from refs — no animation
 * libraries involved.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // Live mouse position and the (lerped) ring position. Stored in refs so the
  // rAF loop can mutate them every frame without triggering React re-renders.
  const mouse = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);

  // `variant` and `mounted` are the only pieces of state, since they change
  // infrequently (on hover / on first paint) compared to position.
  const [variant, setVariant] = useState<CursorVariant>("default");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Only enable the custom cursor on devices with a fine pointer (mouse /
    // trackpad). Touch devices keep their native behaviour.
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer) return;
    setEnabled(true);

    // Track the raw mouse position; the dot follows this exactly.
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };

    // Decide which variant applies based on what's under the pointer. Images
    // (and anything opted in via data-cursor="explore") show EXPLORE; links,
    // buttons, and data-cursor="view" elements show VIEW.
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('img, [data-cursor="explore"]')) {
        setVariant("explore");
      } else if (
        target.closest('a, button, [role="button"], [data-cursor="view"]')
      ) {
        setVariant("view");
      } else {
        setVariant("default");
      }
    };

    // The ring eases toward the mouse each frame (lerp factor 0.1) for a soft
    // trailing feel.
    const animate = () => {
      ringPos.current.x += (mouse.current.x - ringPos.current.x) * 0.1;
      ringPos.current.y += (mouse.current.y - ringPos.current.y) * 0.1;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
      }
      rafId.current = requestAnimationFrame(animate);
    };
    rafId.current = requestAnimationFrame(animate);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  // Don't render anything on touch devices / before the pointer check resolves.
  if (!enabled) return null;

  // Ring sizing + colour per variant. On hover states the ring inverts to a
  // solid cream fill with ink text; at rest it's a thin mist-coloured outline.
  const ringSize =
    variant === "explore"
      ? "h-[120px] w-[120px]"
      : variant === "view"
        ? "h-20 w-20"
        : "h-10 w-10";

  const ringSkin =
    variant === "default"
      ? "border border-mist/60 bg-transparent text-transparent"
      : "border border-transparent bg-cream text-ink";

  return (
    <>
      {/* Trailing ring with contextual label */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className={`pointer-events-none fixed left-0 top-0 z-[9999] flex items-center justify-center rounded-full transition-[width,height,background-color,color] duration-300 ease-out ${ringSize} ${ringSkin}`}
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.2em]">
          {variant === "explore" ? "Explore" : variant === "view" ? "View" : ""}
        </span>
      </div>

      {/* Exact-tracking dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[10000] h-2 w-2 rounded-full bg-terra"
      />
    </>
  );
}
