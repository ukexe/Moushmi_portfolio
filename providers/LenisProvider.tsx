"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type MutableRefObject,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger once on the client so any scroll-driven GSAP
// animation elsewhere in the app can rely on it being available.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Context holds a ref to the live Lenis instance (null under reduced motion).
const LenisContext = createContext<MutableRefObject<Lenis | null> | null>(null);

/** Access the live Lenis instance ref (e.g. for programmatic scrollTo). */
export function useLenis() {
  return useContext(LenisContext);
}

interface LenisProviderProps {
  children: ReactNode;
}

/**
 * LenisProvider wires Lenis smooth scrolling into the page and drives it from
 * GSAP's ticker so that scroll-based GSAP/ScrollTrigger animations stay in
 * perfect sync with the smooth-scroll position. It also exposes the current
 * scroll progress (0–1) as the global CSS custom property `--scroll-progress`,
 * and shares the Lenis instance via context.
 */
export function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Respect users who prefer reduced motion: skip smooth scroll entirely and
    // fall back to the browser's native scrolling.
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      document.documentElement.style.setProperty("--scroll-progress", "0");
      return;
    }

    // Initialise Lenis with a cinematic, slightly weighted easing curve.
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    // Publish scroll progress to CSS and keep ScrollTrigger in step with Lenis.
    lenis.on("scroll", ({ progress }: { progress: number }) => {
      document.documentElement.style.setProperty(
        "--scroll-progress",
        progress.toString()
      );
      ScrollTrigger.update();
    });

    // Drive Lenis from the GSAP ticker rather than its own rAF loop so both
    // share a single animation clock. GSAP reports time in seconds; Lenis
    // expects milliseconds.
    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Pause smooth scroll while the tab is hidden to save CPU/GPU, resume on
    // return.
    const handleVisibility = () => {
      if (document.hidden) {
        lenis.stop();
      } else {
        lenis.start();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>
  );
}
