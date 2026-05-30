"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "@/providers/LenisProvider";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface NavLink {
  label: string;
  id: string; // matches a section id / hash target
  light?: boolean; // section sits on the light (cream) background
}

const NAV_LINKS: NavLink[] = [
  { label: "Work", id: "work" },
  { label: "About", id: "about", light: true },
  { label: "Experience", id: "experience", light: true },
  { label: "Contact", id: "contact" },
];

// Minimum scroll delta (px) before we react to a direction change.
const VELOCITY_THRESHOLD = 5;
// Don't start hiding the nav until past this scroll depth.
const HIDE_AFTER = 200;

/**
 * Navigation — fixed top bar. It is transparent over the dark hero, flips to a
 * cream/ink theme while the light (About/Experience) sections are in view,
 * hides on scroll-down / reappears on scroll-up, highlights the active section
 * in terra, and collapses to a full-screen overlay menu on mobile.
 */
export function Navigation() {
  const lenisRef = useLenis();
  const prefersReducedMotion = useReducedMotion();

  const [hidden, setHidden] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [active, setActive] = useState<string>("work");
  const [menuOpen, setMenuOpen] = useState(false);

  // --- Hide-on-scroll-down / show-on-scroll-up (with velocity threshold) ----
  const lastScrollY = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastScrollY.current;

      if (Math.abs(delta) >= VELOCITY_THRESHOLD) {
        // Hide when scrolling down past the threshold, show when scrolling up.
        setHidden(delta > 0 && y > HIDE_AFTER);
        lastScrollY.current = y;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // --- Active section + theme, via ScrollTrigger -----------------------------
  useEffect(() => {
    const ctx = gsap.context(() => {
      for (const link of NAV_LINKS) {
        const el = document.getElementById(link.id);
        if (!el) continue;

        ScrollTrigger.create({
          trigger: el,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => {
            if (self.isActive) {
              setActive(link.id);
              setTheme(link.light ? "light" : "dark");
            }
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  // Smoothly scroll to a section (Lenis when available, native otherwise).
  const goTo = (id: string) => {
    setMenuOpen(false);
    const target = document.getElementById(id);
    if (!target) return;

    const lenis = lenisRef?.current;
    if (lenis) {
      lenis.scrollTo(target, { duration: 1.2 });
    } else {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  const isLight = theme === "light";

  return (
    <>
      <motion.nav
        data-theme={theme}
        initial={false}
        animate={{ y: hidden && !menuOpen ? "-110%" : "0%" }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed inset-x-0 top-0 z-[120] flex items-center justify-between px-6 py-5 transition-colors duration-500 md:px-16 ${
          isLight ? "bg-cream/90 backdrop-blur-sm" : "bg-transparent"
        }`}
      >
        {/* Brand monogram */}
        <button
          type="button"
          aria-label="Back to top"
          onClick={() => goTo("home")}
          className={`font-display text-xl transition-colors duration-500 ${
            isLight ? "text-ink" : "text-cream"
          }`}
        >
          M·D
        </button>

        {/* Desktop links */}
        <ul className="hidden items-center gap-10 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = active === link.id;
            const base = isLight ? "text-ink" : "text-cream";
            return (
              <li key={link.id}>
                <button
                  type="button"
                  aria-label={`Go to ${link.label}`}
                  aria-current={isActive ? "true" : undefined}
                  onClick={() => goTo(link.id)}
                  className={`group relative font-mono text-xs uppercase tracking-[0.2em] transition-colors duration-300 ${
                    isActive ? "text-terra" : base
                  }`}
                >
                  {link.label}
                  {/* Terra underline draws in from the left on hover */}
                  <span
                    className={`absolute -bottom-1 left-0 h-px w-full origin-left bg-terra transition-transform duration-300 ${
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </button>
              </li>
            );
          })}
        </ul>

        {/* Mobile hamburger / close toggle */}
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="relative z-[130] flex h-6 w-7 flex-col justify-between md:hidden"
        >
          <span
            className={`h-px w-full origin-center transition-all duration-300 ${
              menuOpen
                ? "translate-y-[11px] rotate-45 bg-cream"
                : isLight
                  ? "bg-ink"
                  : "bg-cream"
            }`}
          />
          <span
            className={`h-px w-full transition-all duration-300 ${
              menuOpen ? "opacity-0" : isLight ? "bg-ink" : "bg-cream"
            }`}
          />
          <span
            className={`h-px w-full origin-center transition-all duration-300 ${
              menuOpen
                ? "-translate-y-[11px] -rotate-45 bg-cream"
                : isLight
                  ? "bg-ink"
                  : "bg-cream"
            }`}
          />
        </button>
      </motion.nav>

      {/* Mobile full-screen overlay menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[125] flex flex-col justify-center overflow-hidden bg-ink px-6 md:hidden"
          >
            {/* Terra diagonal decorative line */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-[-20%] top-1/2 h-px w-[140%] -rotate-45 bg-terra/40"
            />

            <motion.ul
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: prefersReducedMotion ? 0 : 0.08,
                  },
                },
              }}
              className="relative flex flex-col gap-6"
            >
              {NAV_LINKS.map((link) => (
                <motion.li
                  key={link.id}
                  variants={{
                    hidden: { y: 30, opacity: 0 },
                    visible: { y: 0, opacity: 1 },
                  }}
                >
                  <button
                    type="button"
                    aria-label={`Go to ${link.label}`}
                    onClick={() => goTo(link.id)}
                    className={`font-display text-[3rem] leading-none ${
                      active === link.id ? "text-terra" : "text-cream"
                    }`}
                  >
                    {link.label}
                  </button>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
