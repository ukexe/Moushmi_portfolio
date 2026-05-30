"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * TimelineLine — a vertical SVG line that "draws" itself downward as the user
 * scrolls (via stroke-dashoffset), with a terra dot riding the leading edge.
 * It absolutely fills its parent's height, so it should sit inside a `relative`
 * timeline column. The line uses `pathLength={100}` to normalise the dash
 * maths and `vector-effect: non-scaling-stroke` to stay a crisp 1px regardless
 * of the non-uniform SVG scaling.
 */
export function TimelineLine() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGLineElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const line = lineRef.current;
    const dot = dotRef.current;
    if (!wrapper || !line || !dot) return;

    // Reduced motion: show the finished line, hide the travelling dot.
    if (prefersReducedMotion) {
      line.style.strokeDashoffset = "0";
      dot.style.opacity = "0";
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: "top center",
          end: "bottom center",
          scrub: true,
        },
      });

      // Draw the stroke and slide the dot down in lockstep.
      tl.fromTo(line, { strokeDashoffset: 100 }, { strokeDashoffset: 0, ease: "none" }, 0);
      tl.fromTo(dot, { top: "0%" }, { top: "100%", ease: "none" }, 0);
    }, wrapper);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 left-0 w-0 md:left-[150px]"
    >
      <svg
        className="h-full w-[2px] overflow-visible"
        preserveAspectRatio="none"
        viewBox="0 0 2 100"
      >
        <line
          ref={lineRef}
          x1="1"
          y1="0"
          x2="1"
          y2="100"
          stroke="#0D0D0D"
          strokeWidth="1"
          pathLength={100}
          strokeDasharray={100}
          strokeDashoffset={100}
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Terra dot riding the leading edge of the stroke */}
      <div
        ref={dotRef}
        className="absolute left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-terra"
      />
    </div>
  );
}
