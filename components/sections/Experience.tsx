"use client";

import { motion, type Variants } from "framer-motion";
import { revealWord, slideInLeft, staggerContainer } from "@/lib/animations";
import { TimelineLine } from "@/components/ui/TimelineLine";

interface TimelineEntry {
  date: string;
  title: string;
  org: string;
  bullets: string[];
}

// Reverse-chronological experience + education.
const ENTRIES: TimelineEntry[] = [
  {
    date: "Sep 2025 – Apr 2026",
    title: "Design Studio II: Urban Community Centre",
    org: "Toronto Metropolitan University",
    bullets: [
      "BIM models and architectural visualizations for design documentation",
      "Physical models and 3D-printed site elements for design reviews",
      "Multidisciplinary studio team: spatial, structural, urban strategies",
    ],
  },
  {
    date: "Jun 2025 – Aug 2025",
    title: "Assistant Designer",
    org: "Origin Homes, Chennai, India",
    bullets: [
      "Architectural drawings and construction documentation (Revit, AutoCAD)",
      "BIM models, 3D visualizations, drawing revisions for residential projects",
      "Site documentation, permit-related coordination",
    ],
  },
  {
    date: "Sep 2024 – Apr 2025",
    title: "Design Studio I: Mixed-Use Residential Complex",
    org: "Toronto Metropolitan University",
    bullets: [
      "Design development: site analysis, precedent research, iterative modeling",
      "Physical mock-ups and 3D-printed study models",
      "Team presentations using Rhino, Revit, Adobe Creative Suite",
    ],
  },
  {
    date: "2023 – 2027",
    title: "BArch Architectural Science (In Progress)",
    org: "Toronto Metropolitan University",
    bullets: [
      "Specialization: design development, BIM, sustainable environments",
      "Year End Show (YES) 2025 — Featured Work",
    ],
  },
  {
    date: "2002 – 2023",
    title: "Chettinad Harishree Vidyalayam",
    org: "Chennai, Tamil Nadu, India",
    bullets: ["Secondary education"],
  },
];

// Bullet list container: stagger each em-dash bullet by 0.05s.
const bulletContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

/**
 * Experience — the timeline section. A scroll-drawn vertical line threads
 * through the entries; as each entry enters view its node pulses, its title
 * clips upward, a terra rule draws from the left, and its em-dash bullets slide
 * in. On desktop the heading is sticky so it stays visible alongside the line.
 */
export function Experience() {
  return (
    <section
      id="experience"
      className="bg-cream px-6 py-sectionMobile md:px-16 md:py-section"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 lg:grid-cols-[35%_1fr] lg:gap-20">
        {/* Sticky heading */}
        <div className="lg:sticky lg:top-32 lg:h-fit">
          <motion.h2
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className="font-display text-5xl leading-[1.05] text-ink"
          >
            <span className="block overflow-hidden">
              <motion.span variants={revealWord} className="inline-block">
                Experience &amp;
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span variants={revealWord} className="inline-block">
                Education
              </motion.span>
            </span>
          </motion.h2>
        </div>

        {/* Timeline column (relative so the drawn line can fill its height) */}
        <div className="relative">
          <TimelineLine />

          <div className="flex flex-col gap-20">
            {ENTRIES.map((entry) => (
              <EntryItem key={entry.title} entry={entry} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** A single timeline entry with its construct-into-view choreography. */
function EntryItem({ entry }: { entry: TimelineEntry }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[150px_1fr]">
      {/* Left of the line — date range (desktop only) */}
      <div className="hidden pr-6 pt-1 text-right md:block">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-mist">
          {entry.date}
        </span>
      </div>

      {/* Right of the line — content (relative; its left edge sits on the line) */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        className="relative pl-8 md:pl-12"
      >
        {/* Square node on the line, pulses on entry */}
        <motion.div
          aria-hidden="true"
          variants={{
            hidden: { scale: 1 },
            visible: { scale: [1, 1.3, 1] },
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute left-0 top-2 h-2 w-2 -translate-x-1/2 bg-terra"
        />

        {/* Date folded into the heading on mobile */}
        <motion.span
          variants={slideInLeft}
          className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-mist md:hidden"
        >
          {entry.date}
        </motion.span>

        {/* Terra rule that draws from the left */}
        <motion.div
          variants={{ hidden: { width: 0 }, visible: { width: 40 } }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-4 h-px bg-terra"
        />

        {/* Title — clips upward */}
        <div className="overflow-hidden">
          <motion.h3
            variants={revealWord}
            className="font-display text-2xl leading-tight text-ink"
          >
            {entry.title}
          </motion.h3>
        </div>

        {/* Role / institution */}
        <motion.p
          variants={slideInLeft}
          className="mt-1 font-sans text-[0.9rem] text-mist"
        >
          {entry.org}
        </motion.p>

        {/* Em-dash bullet points, staggered in from the left */}
        <motion.ul variants={bulletContainer} className="mt-5 flex flex-col gap-2">
          {entry.bullets.map((bullet) => (
            <motion.li
              key={bullet}
              variants={slideInLeft}
              className="flex gap-3 font-mono text-[0.85rem] leading-relaxed text-ink"
            >
              <span aria-hidden="true" className="text-terra">
                —
              </span>
              <span>{bullet}</span>
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>
    </div>
  );
}
