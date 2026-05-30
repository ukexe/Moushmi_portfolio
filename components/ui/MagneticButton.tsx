"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  href?: string;
  // Open in a new tab (for external links).
  external?: boolean;
  ariaLabel: string;
  onClick?: (event: React.MouseEvent) => void;
}

// Cursor must enter this radius (px) around the element's centre to pull it.
const MAGNETIC_RADIUS = 120;

/**
 * MagneticButton — a link/button that magnetically pulls toward the cursor when
 * the pointer comes within MAGNETIC_RADIUS of its centre, snapping back with an
 * elastic ease when the cursor leaves. Renders an <a> when `href` is provided,
 * otherwise a <button>. Disabled for reduced-motion / touch.
 */
export function MagneticButton({
  children,
  className,
  href,
  external,
  ariaLabel,
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Skip the effect on touch devices, coarse pointers, or reduced motion.
    const noMagnet =
      "ontouchstart" in window ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !window.matchMedia("(pointer: fine)").matches;
    if (noMagnet) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const distance = Math.sqrt(distX ** 2 + distY ** 2);

      if (distance < MAGNETIC_RADIUS) {
        // Pull toward the cursor.
        gsap.to(el, {
          x: distX * 0.4,
          y: distY * 0.4,
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        // Snap back home with an elastic settle.
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: "elastic.out(1, 0.5)",
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (href) {
    return (
      <a
        ref={ref}
        href={href}
        aria-label={ariaLabel}
        onClick={onClick}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      ref={ref}
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={className}
    >
      {children}
    </button>
  );
}
