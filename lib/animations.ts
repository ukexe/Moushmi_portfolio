import type { Variants } from "framer-motion";

// Shared cinematic easing curve (a custom cubic-bezier) reused across variants
// so motion feels consistent and intentional throughout the site.
const cinematicEase = [0.25, 0.46, 0.45, 0.94] as const;

/**
 * fadeUp — elements rise into place while fading in. The workhorse reveal used
 * for paragraphs, headings, and stacked content blocks.
 */
export const fadeUp: Variants = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.8, ease: cinematicEase },
  },
};

/**
 * staggerContainer — a parent variant that orchestrates its children's reveals,
 * triggering each one slightly after the last for a sequenced cascade.
 */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

/**
 * revealWord — a single word clipped inside an `overflow-hidden` container that
 * slides upward into view, like a cinema title card. Apply this to inner word
 * spans whose parent has `overflow: hidden`.
 */
export const revealWord: Variants = {
  hidden: { y: "110%" },
  visible: {
    y: "0%",
    transition: { duration: 0.9, ease: cinematicEase },
  },
};

/**
 * slideInLeft — content drifts in from the left. Good for side captions,
 * timeline entries, and asymmetric editorial layouts.
 */
export const slideInLeft: Variants = {
  hidden: { x: -60, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 1, ease: cinematicEase },
  },
};

/**
 * scaleIn — elements settle in from a slightly smaller scale while fading in.
 * Used for imagery and feature blocks that should feel like they "arrive".
 */
export const scaleIn: Variants = {
  hidden: { scale: 0.85, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.8, ease: cinematicEase },
  },
};
