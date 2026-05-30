"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/lib/projects";
import { ProjectCard } from "@/components/canvas/ProjectCard";
import { useIsMobile } from "@/lib/useMediaQuery";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TOTAL = projects.length;
const pad = (n: number) => n.toString().padStart(2, "0");

/**
 * Projects — the Selected Work gallery. A tall (500vh) section pins a
 * viewport-height stage and converts vertical scroll into horizontal movement
 * of the card row via GSAP ScrollTrigger. A sticky heading with a live counter
 * tracks progress. Reduced-motion users get a simple vertical stack instead.
 */
export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  // Mobile and reduced-motion both use the stacked vertical layout.
  const stacked = isMobile || !!prefersReducedMotion;

  // Live "current card" index for the counter (1-based).
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    // No horizontal hijack on mobile / reduced motion — the vertical stack
    // (with scroll snap) is used instead.
    if (stacked) return;

    const gallery = galleryRef.current;
    const stage = stageRef.current;
    const section = sectionRef.current;
    if (!gallery || !stage || !section) return;

    // Scope all GSAP work so it's cleanly reverted on unmount.
    const ctx = gsap.context(() => {
      // Distance the row must travel so its last edge reaches the viewport edge.
      const getScrollDistance = () =>
        gallery.scrollWidth - window.innerWidth;

      gsap.to(gallery, {
        x: () => -getScrollDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          pin: stage,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Map scroll progress → 1..TOTAL card index.
            const index = Math.min(
              TOTAL,
              Math.floor(self.progress * TOTAL) + 1
            );
            setCurrent(index);
          },
        },
      });
    }, section);

    return () => ctx.revert();
  }, [stacked]);

  // -------------------------------------------------------------------------
  // Mobile / reduced-motion: vertical stack with scroll-snap, no hijacking.
  // -------------------------------------------------------------------------
  if (stacked) {
    return (
      <>
        <section
          id="work"
          className="bg-ink px-6 py-sectionMobile md:px-16 md:py-section"
        >
          <ProjectsHeading current={1} />
          <div className="mt-12 flex snap-y snap-mandatory flex-col items-center gap-12">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} stacked />
            ))}
          </div>
        </section>
        <ViewAllCta />
      </>
    );
  }

  // -------------------------------------------------------------------------
  // Default: horizontal scroll gallery.
  // -------------------------------------------------------------------------
  return (
    <>
      <section ref={sectionRef} id="work" className="relative h-[500vh] bg-ink">
        {/* Pinned, viewport-height stage */}
        <div
          ref={stageRef}
          className="relative flex h-screen w-full items-center overflow-hidden"
        >
          {/* Sticky heading + live counter */}
          <div className="pointer-events-none absolute left-6 top-10 z-10 flex w-[calc(100%-3rem)] items-baseline justify-between md:left-16 md:top-12 md:w-[calc(100%-8rem)]">
            <span className="font-mono text-xs uppercase tracking-[0.5em] text-mist">
              Selected Work
            </span>
            <span className="font-mono text-xs tracking-[0.3em] text-cream">
              {pad(current)} <span className="text-mist">/ {pad(TOTAL)}</span>
            </span>
          </div>

          {/* Horizontal card row */}
          <div
            ref={galleryRef}
            className="flex items-center gap-[4vw] px-[8vw] will-change-transform"
          >
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </section>

      <ViewAllCta />
    </>
  );
}

/** Shared heading used by both layouts. */
function ProjectsHeading({ current }: { current: number }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="font-mono text-xs uppercase tracking-[0.5em] text-mist">
        Selected Work
      </span>
      <span className="font-mono text-xs tracking-[0.3em] text-cream">
        {pad(current)} <span className="text-mist">/ {pad(TOTAL)}</span>
      </span>
    </div>
  );
}

/**
 * ViewAllCta — full-width row with a terra underline that draws itself in when
 * scrolled into view.
 */
function ViewAllCta() {
  return (
    <section className="bg-ink px-6 py-sectionMobile md:px-16 md:py-section">
      <a
        href="/projects"
        aria-label="View all projects"
        className="group inline-block"
      >
        <span className="font-display text-4xl text-cream md:text-6xl">
          View All Projects
          <span className="ml-4 inline-block transition-transform duration-300 group-hover:translate-x-2">
            →
          </span>
        </span>
        {/* Underline draws from left to right on scroll-into-view */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mt-4 h-px w-full origin-left bg-terra"
        />
      </a>
    </section>
  );
}
