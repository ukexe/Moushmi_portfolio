"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { revealWord } from "@/lib/animations";

// The WebGL scene is loaded client-side only — it touches the DOM/WebGL and
// has no meaningful server render.
const HeroScene = dynamic(
  () => import("@/components/canvas/HeroScene").then((m) => m.HeroScene),
  { ssr: false }
);

interface HeroProps {
  // Flips true once the preloader has exited, triggering the headline reveal.
  start: boolean;
}

// Headline split across two lines; each word reveals independently.
const LINE_ONE = ["Space", "is"];
const LINE_TWO = ["the", "story."];

// Marquee phrase (rendered twice for a seamless loop).
const MARQUEE_ITEMS = [
  "BIM",
  "REVIT",
  "RHINO",
  "GRASSHOPPER",
  "SUSTAINABLE DESIGN",
  "URBAN SPACE",
  "PHYSICAL MODELLING",
  "ARCHITECTURAL STORYTELLING",
];

/**
 * Hero — the crown-jewel landing section: a full-viewport WebGL background with
 * a layered HTML overlay (label, split-text headline, bio, CTAs), a scrolling
 * skills marquee, and a scroll cue.
 */
export function Hero({ start }: HeroProps) {
  const prefersReducedMotion = useReducedMotion();
  // Reveal immediately (no animation) for reduced-motion users.
  const isVisible = start || !!prefersReducedMotion;

  // Parent orchestrates the staggered word reveal across both headline lines.
  const headlineContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.06,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden bg-ink">
      {/* WebGL background scene (interactive — receives pointer for parallax) */}
      <div className="absolute inset-0">
        <HeroScene />
      </div>

      {/* HTML overlay — transparent to pointer events except the CTAs */}
      <div className="pointer-events-none absolute inset-0 flex items-center">
        <div className="w-full px-6 md:px-16">
          {/* Tracked spec-sheet label */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-6 font-mono text-xs uppercase tracking-[0.35em] text-mist"
          >
            Architectural Designer
          </motion.p>

          {/* Split-text headline */}
          <motion.h1
            variants={headlineContainer}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            className="font-display leading-[0.95] text-[clamp(3rem,8vw,7rem)]"
          >
            <span className="block text-cream">
              {LINE_ONE.map((word) => (
                <span
                  key={word}
                  className="mr-[0.25em] inline-block overflow-hidden align-bottom"
                >
                  <motion.span variants={revealWord} className="inline-block">
                    {word}
                  </motion.span>
                </span>
              ))}
            </span>
            <span className="block italic text-terra">
              {LINE_TWO.map((word) => (
                <span
                  key={word}
                  className="mr-[0.25em] inline-block overflow-hidden align-bottom"
                >
                  <motion.span variants={revealWord} className="inline-block">
                    {word}
                  </motion.span>
                </span>
              ))}
            </span>
          </motion.h1>

          {/* Bio line */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-8 max-w-xl font-sans text-sm font-light text-mist md:text-base"
          >
            Moushmi Dhinakaran · TMU Architectural Science · Class of 2027
          </motion.p>

          {/* CTAs — re-enable pointer events so they're clickable */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.65 }}
            className="pointer-events-auto mt-10 flex flex-col gap-4 sm:flex-row"
          >
            {/* Filled terra button — cream layer slides in from the left on hover */}
            <button
              type="button"
              aria-label="Explore work"
              className="group relative overflow-hidden bg-terra px-8 py-4"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 -translate-x-full bg-cream transition-transform duration-500 ease-out group-hover:translate-x-0"
              />
              <span className="relative font-mono text-xs uppercase tracking-[0.2em] text-ink">
                Explore Work
              </span>
            </button>

            {/* Outline button — cream fills from below, text flips to ink */}
            <button
              type="button"
              aria-label="Download CV"
              className="group relative overflow-hidden border border-cream px-8 py-4"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 -translate-y-full bg-cream transition-transform duration-500 ease-out group-hover:translate-y-0"
              />
              <span className="relative font-mono text-xs uppercase tracking-[0.2em] text-cream transition-colors duration-300 group-hover:text-ink">
                Download CV
              </span>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Bottom skills marquee — two identical copies for a seamless loop */}
      <div className="absolute bottom-0 left-0 z-10 w-full overflow-hidden bg-charcoal py-3">
        <div className="flex w-max animate-marquee">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              aria-hidden={copy === 1}
              className="flex shrink-0 items-center"
            >
              {MARQUEE_ITEMS.map((item) => (
                <span
                  key={`${copy}-${item}`}
                  className="px-6 font-mono text-[11px] uppercase tracking-[0.3em] text-cream"
                >
                  {item}
                  <span className="ml-12 text-terra">·</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue, bottom-right: rotated label + bouncing chevron */}
      <div className="pointer-events-none absolute bottom-16 right-6 z-10 hidden flex-col items-center gap-4 md:flex">
        <span className="-rotate-90 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.3em] text-mist">
          Scroll to Explore ↓
        </span>
        <motion.span
          aria-hidden="true"
          animate={prefersReducedMotion ? {} : { y: [0, 8, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          className="mt-8 font-mono text-sm text-terra"
        >
          ↓
        </motion.span>
      </div>
    </section>
  );
}
