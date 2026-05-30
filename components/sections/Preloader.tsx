"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useReducedMotion,
} from "framer-motion";

interface PreloaderProps {
  // Called once the full intro (count + split) has finished, or immediately
  // when the user prefers reduced motion.
  onComplete: () => void;
}

/**
 * Preloader — the first-load intro. A massive counter eases from 0 → 100 while
 * a hairline progress bar crawls across the bottom. At 100 the screen splits
 * horizontally (top half up, bottom half down) to reveal the site, while the
 * number scales up and fades out.
 */
export function Preloader({ onComplete }: PreloaderProps) {
  const prefersReducedMotion = useReducedMotion();

  // Drives both the displayed number and the progress bar width.
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const barWidth = useTransform(count, [0, 100], ["0%", "100%"]);

  // Two phases: "counting" (0→100) then "split" (halves slide apart).
  const [phase, setPhase] = useState<"counting" | "split">("counting");

  useEffect(() => {
    // Reduced-motion users skip the whole sequence and go straight to content.
    if (prefersReducedMotion) {
      onComplete();
      return;
    }

    // Ease-out count to 100 over ~2.5s, then trigger the split.
    const controls = animate(count, 100, {
      duration: 2.5,
      ease: [0.22, 1, 0.36, 1],
      onComplete: () => setPhase("split"),
    });

    return () => controls.stop();
  }, [count, onComplete, prefersReducedMotion]);

  // Nothing renders for reduced-motion users (onComplete already fired).
  if (prefersReducedMotion) return null;

  const splitTransition = { duration: 0.9, ease: [0.76, 0, 0.24, 1] as const };

  return (
    <div className="fixed inset-0 z-[200] overflow-hidden">
      {/* Top half — slides up on split */}
      <motion.div
        aria-hidden="true"
        className="absolute left-0 top-0 h-1/2 w-full bg-ink"
        animate={phase === "split" ? { y: "-100%" } : { y: 0 }}
        transition={splitTransition}
      />

      {/* Bottom half — slides down on split; its completion ends the preloader */}
      <motion.div
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-1/2 w-full bg-ink"
        animate={phase === "split" ? { y: "100%" } : { y: 0 }}
        transition={splitTransition}
        onAnimationComplete={() => {
          if (phase === "split") onComplete();
        }}
      />

      {/* The counter number, scaling up + fading out as the halves part */}
      <motion.div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        animate={
          phase === "split"
            ? { scale: 1.4, opacity: 0 }
            : { scale: 1, opacity: 1 }
        }
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <motion.span className="font-display text-[20vw] leading-none text-cream">
          {rounded}
        </motion.span>
      </motion.div>

      {/* Hairline progress bar crawling across the bottom edge */}
      <div className="absolute bottom-0 left-0 h-px w-full bg-cream/10">
        <motion.div className="h-full bg-terra" style={{ width: barWidth }} />
      </div>
    </div>
  );
}
