"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "@/providers/LenisProvider";

// Show the button only after the user has scrolled past this many pixels.
const SHOW_AFTER = 600;

/**
 * ScrollToTop — a small fixed square (bottom-right) that appears after 600px of
 * scroll and smoothly returns to the top using Lenis (falling back to native
 * scrolling when Lenis isn't active, e.g. reduced motion).
 */
export function ScrollToTop() {
  const lenisRef = useLenis();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    const lenis = lenisRef?.current;
    if (lenis) {
      lenis.scrollTo(0, {
        duration: 1.5,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
      });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          aria-label="Scroll to top"
          onClick={handleClick}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-6 z-[150] flex h-10 w-10 items-center justify-center border border-terra bg-ink text-cream"
        >
          {/* Up arrow */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="h-4 w-4"
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
