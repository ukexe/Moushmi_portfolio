"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import type { Project } from "@/lib/projects";
import { ProjectCardSkeleton } from "@/components/ui/ProjectCardSkeleton";

// Lazily load the WebGL layer so the heavy three.js chunk isn't in the initial
// bundle; a skeleton shows while it streams in.
const ProjectCardCanvas = dynamic(
  () => import("@/components/canvas/ProjectCardCanvas"),
  { ssr: false, loading: () => <ProjectCardSkeleton /> }
);

/**
 * ProjectCard — one card in the gallery: a lazily-loaded WebGL image plane with
 * a layered HTML overlay (decorative number, frosted info panel, optional
 * featured ribbon). GSAP drives the hover choreography. `stacked` switches to
 * the mobile portrait footprint.
 */
export function ProjectCard({
  project,
  stacked = false,
}: {
  project: Project;
  stacked?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);

  // Resting (un-hovered) state on mount.
  useEffect(() => {
    gsap.set(panelRef.current, { yPercent: 100 });
    gsap.set(numberRef.current, { opacity: 0.15 });
    gsap.set(borderRef.current, { clipPath: "inset(0% 0% 100% 0%)" });
  }, []);

  const animateHover = (isEntering: boolean) => {
    setHovered(isEntering);

    gsap.to(panelRef.current, {
      yPercent: isEntering ? 0 : 100,
      duration: 0.4,
      ease: "power3.out",
    });
    gsap.to(numberRef.current, {
      opacity: isEntering ? 0 : 0.15,
      duration: 0.4,
      ease: "power2.out",
    });
    gsap.to(borderRef.current, {
      clipPath: isEntering ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
      duration: 0.6,
      ease: "power2.out",
    });
    gsap.to(arrowRef.current, {
      x: isEntering ? 8 : 0,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const sizeClasses = stacked
    ? "h-[60vw] w-[90vw] snap-center"
    : "h-[80vh] w-[60vw] shrink-0";

  return (
    <div
      onMouseEnter={() => animateHover(true)}
      onMouseLeave={() => animateHover(false)}
      className={`relative overflow-hidden bg-charcoal ${sizeClasses}`}
    >
      {/* Lazily-loaded WebGL image plane */}
      <div className="absolute inset-0">
        <ProjectCardCanvas title={project.title} hovered={hovered} />
      </div>

      {/* Thin terra border revealing on hover via clip-path */}
      <div
        ref={borderRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border border-terra"
      />

      {/* Decorative oversized number, bottom-left */}
      <span
        ref={numberRef}
        aria-hidden="true"
        className="pointer-events-none absolute bottom-2 left-4 font-mono text-[8vw] leading-none text-mist"
      >
        {project.number}
      </span>

      {/* Featured ribbon (card 5 only) */}
      {project.featured && (
        <div className="pointer-events-none absolute right-0 top-0 h-28 w-28 overflow-hidden">
          <span className="absolute right-[-44px] top-[28px] w-[180px] rotate-45 bg-terra py-1 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-white">
            {project.ribbon}
          </span>
        </div>
      )}

      {/* Frosted info panel, slides up on hover */}
      <div
        ref={panelRef}
        className="absolute bottom-0 left-0 w-full border-t border-white/10 bg-ink/60 px-6 py-6 backdrop-blur-[20px] md:px-8 md:py-8"
      >
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-terra">
          {project.category}
        </p>
        <h3 className="mt-2 font-display text-[2.5rem] leading-none text-cream">
          {project.title}
        </h3>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-mist">
          {project.meta}
        </p>

        <a
          href={`/projects/${project.slug}`}
          aria-label={`View project: ${project.title}`}
          className="pointer-events-auto mt-5 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-cream"
        >
          View Project
          <span ref={arrowRef} className="inline-block">
            →
          </span>
        </a>
      </div>
    </div>
  );
}
