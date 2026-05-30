"use client";

import { useEffect, useState } from "react";
import { Preloader } from "./Preloader";
import { Hero } from "./Hero";

/**
 * LandingExperience coordinates the first-load intro. It renders the Hero
 * underneath and plays the Preloader on top — but only once per browser
 * session. The "hasLoaded" flag is persisted to sessionStorage so returning to
 * the page within the same session skips straight to the content.
 */
export function LandingExperience() {
  // "loading" → preloader visible; "ready" → content revealed + headline plays.
  const [phase, setPhase] = useState<"loading" | "ready">("loading");
  // Gate so we don't flash the preloader before reading sessionStorage.
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("hasLoaded")) {
      setPhase("ready");
    }
    setChecked(true);
  }, []);

  // Persist the flag and reveal the site once the preloader finishes.
  const handleComplete = () => {
    sessionStorage.setItem("hasLoaded", "true");
    setPhase("ready");
  };

  return (
    <>
      {checked && phase === "loading" && (
        <Preloader onComplete={handleComplete} />
      )}
      <Hero start={checked && phase === "ready"} />
    </>
  );
}
