"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * PageTransition — a full-screen ink overlay that, on every route change,
 * slides up from the bottom to cover the old page (0.6s), briefly flashes the
 * "M·D" monogram, then slides up out the top to reveal the new page (0.4s).
 *
 * It intentionally does NOT play on the very first load (the Preloader owns
 * that moment) — only on subsequent client-side navigations.
 */
export function PageTransition() {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  // Tracks the previous path so we only animate on genuine route changes.
  const prevPath = useRef(pathname);
  // When set, an overlay keyed by this value mounts and plays once.
  const [transitionKey, setTransitionKey] = useState<string | null>(null);

  useEffect(() => {
    if (prevPath.current !== pathname) {
      prevPath.current = pathname;
      if (!prefersReducedMotion) setTransitionKey(pathname);
    }
  }, [pathname, prefersReducedMotion]);

  return (
    <AnimatePresence mode="wait">
      {transitionKey && (
        <motion.div
          key={transitionKey}
          className="pointer-events-none fixed inset-0 z-[300] flex items-center justify-center"
          // Cover (100% → 0%), hold, then reveal (0% → -100%).
          initial={{ y: "100%" }}
          animate={{ y: ["100%", "0%", "0%", "-100%"] }}
          transition={{
            duration: 1,
            times: [0, 0.6, 0.66, 1],
            ease: [0.76, 0, 0.24, 1],
          }}
          onAnimationComplete={() => setTransitionKey(null)}
        >
          <div className="absolute inset-0 bg-ink" />
          {/* Monogram flashes while the overlay covers the screen */}
          <motion.span
            className="relative font-display text-[4rem] text-cream"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1, times: [0, 0.45, 0.7, 0.95] }}
          >
            M·D
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
