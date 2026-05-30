"use client";

import { useEffect, useState } from "react";

/**
 * useMediaQuery — SSR-safe media query hook. Returns false on the server and
 * during the first client render, then updates to the real match after mount
 * (avoiding hydration mismatches).
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);

  return matches;
}

/** Convenience: true below the md breakpoint (767px and under). */
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 767px)");
}
