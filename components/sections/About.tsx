"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { fadeUp, staggerContainer } from "@/lib/animations";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// The WebGL morph form is client-only (WebGL + remote env map).
const AboutShape = dynamic(
  () => import("@/components/canvas/AboutShape").then((m) => m.AboutShape),
  { ssr: false }
);

// Material-schedule skill columns.
const SKILL_COLUMNS = [
  {
    header: "Digital Tools",
    items: ["Rhino", "Revit", "AutoCAD", "Grasshopper", "Enscape / V-Ray"],
  },
  {
    header: "Representation",
    items: [
      "Illustrator",
      "Photoshop",
      "InDesign",
      "Diagramming",
      "Arch. Storytelling",
    ],
  },
  {
    header: "Fabrication",
    items: [
      "Physical Models",
      "3D Printing",
      "Laser Cutting",
      "Hand Drafting",
      "Sketching",
    ],
  },
];

const BODY_PARAGRAPHS = [
  "I'm a third-year Architectural Science student at Toronto Metropolitan University, working at the intersection of design development, digital modelling, and built environment storytelling.",
  "My practice spans BIM workflows to hand-drawn analytique compositions — I believe rigorous technical execution and design intuition are partners, not opposites.",
  "Originally from Chennai, India, I bring a perspective shaped by both South Asian urbanism and Canadian architectural education.",
];

/**
 * About — the site's "material flip" moment. As the section scrolls in, the
 * page background animates from dark concrete (#0D0D0D) to warm stone
 * (#F0EDE8). A morphing 3D form sits in the left column; generously-spaced text,
 * a skills schedule, and an award callout fill the right.
 */
export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // The dark → light → dark page background flip, driven by scroll.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        // Instant flip with no scrubbing for reduced-motion users. The page
        // stays warm stone from here through Experience; the Contact section
        // handles flipping back to dark. Scrolling back up above About
        // restores the dark background.
        ScrollTrigger.create({
          trigger: section,
          start: "top 60%",
          onEnter: () =>
            gsap.set(document.body, { backgroundColor: "#F0EDE8" }),
          onLeaveBack: () =>
            gsap.set(document.body, { backgroundColor: "#0D0D0D" }),
        });
        return;
      }

      // Flip to warm stone as the section enters (~a few hundred px of scroll).
      // The background then stays cream through About + Experience; the Contact
      // section flips it back to dark. The scrub reverses automatically when
      // scrolling back up past About into the dark hero/projects.
      gsap.fromTo(
        document.body,
        { backgroundColor: "#0D0D0D" },
        {
          backgroundColor: "#F0EDE8",
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 35%",
            scrub: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative min-h-screen px-6 py-sectionMobile md:px-16 md:py-section"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-[45%_1fr] lg:gap-20">
        {/* LEFT — morphing 3D form, scales up as it enters view */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="lg:sticky lg:top-24 lg:self-start"
        >
          <AboutShape />
        </motion.div>

        {/* RIGHT — text content */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="flex flex-col"
        >
          <motion.span
            variants={fadeUp}
            className="font-mono text-xs uppercase tracking-[0.4em] text-terra"
          >
            About
          </motion.span>

          <motion.h2
            variants={fadeUp}
            className="mt-6 max-w-xl font-display text-[3rem] leading-[1.05] text-ink"
          >
            Where precision meets intuition.
          </motion.h2>

          <div className="mt-8 max-w-xl space-y-6">
            {BODY_PARAGRAPHS.map((paragraph) => (
              <motion.p
                key={paragraph.slice(0, 24)}
                variants={fadeUp}
                className="text-[1.1rem] leading-[1.8] text-charcoal"
              >
                {paragraph}
              </motion.p>
            ))}
          </div>

          {/* SKILLS — architectural material schedule */}
          <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {SKILL_COLUMNS.map((column) => (
              <motion.div
                key={column.header}
                variants={staggerContainer}
                className="border-t border-terra pt-4"
              >
                <motion.h3
                  variants={fadeUp}
                  className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-ink"
                >
                  {column.header}
                </motion.h3>
                <ul className="flex flex-col gap-3">
                  {column.items.map((item) => (
                    <motion.li key={item} variants={fadeUp}>
                      <span className="group relative inline-block font-sans text-sm text-charcoal">
                        {item}
                        {/* Terra underline draws in from the left on hover */}
                        <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-terra transition-transform duration-300 ease-out group-hover:scale-x-100" />
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* DISTINCTION CALLOUT */}
          <motion.div
            variants={fadeUp}
            className="relative mt-14 flex bg-terra text-ink"
          >
            {/* Vertical AWARD label */}
            <div className="flex items-center justify-center bg-terra px-3 py-6">
              <span className="rotate-180 font-mono text-[10px] uppercase tracking-[0.3em] text-white [writing-mode:vertical-rl]">
                Award
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 px-6 py-6 md:px-8">
              <p className="font-mono text-xs uppercase tracking-[0.2em]">
                Featured · Year End Show (YES) 2025
              </p>
              <p className="mt-2 font-display text-xl leading-snug">
                Urban Analytique Exercise · TMU Studio Project ASC 406
              </p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em]">
                Toronto, ON
              </p>
            </div>

            {/* Decorative asterisk */}
            <span
              aria-hidden="true"
              className="absolute right-4 top-3 font-display text-2xl leading-none text-ink"
            >
              *
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
