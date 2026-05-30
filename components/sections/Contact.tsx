"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { staggerContainer, revealWord } from "@/lib/animations";
import { MagneticButton } from "@/components/ui/MagneticButton";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ContactItem {
  label: string;
  value: string;
  href: string;
  external?: boolean;
}

const CONTACT_ITEMS: ContactItem[] = [
  {
    label: "Email",
    value: "moushmi.dhinakaran@gmail.com",
    href: "mailto:moushmi.dhinakaran@gmail.com",
  },
  {
    label: "LinkedIn",
    value: "moushmidhinakaran",
    href: "https://linkedin.com/in/moushmidhinakaran",
    external: true,
  },
  {
    label: "Phone",
    value: "(437) 313-1417",
    href: "tel:+14373131417",
  },
];

/**
 * Fires a burst of 20 terra squares outward from a screen point, fading and
 * drifting out over ~0.8s. Elements are appended to <body> and removed when
 * their tween completes.
 */
function fireParticleBurst(x: number, y: number) {
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement("div");
    particle.style.position = "fixed";
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.width = "8px";
    particle.style.height = "8px";
    particle.style.backgroundColor = "#C4785A";
    particle.style.pointerEvents = "none";
    particle.style.zIndex = "9998";
    document.body.appendChild(particle);

    const angle = Math.random() * Math.PI * 2;
    const radius = 60 + Math.random() * 120;

    gsap.to(particle, {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      opacity: 0,
      rotation: Math.random() * 180,
      duration: 0.8,
      ease: "power2.out",
      onComplete: () => particle.remove(),
    });
  }
}

/**
 * Contact — the dark finale. Flips the page background back to ink on entry,
 * presents a giant clipped headline, three magnetic contact rows (with a
 * particle burst on the email), and a shimmering primary CTA.
 */
export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Flip the page background warm-stone → concrete as the section enters.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        ScrollTrigger.create({
          trigger: section,
          start: "top 60%",
          onEnter: () =>
            gsap.set(document.body, { backgroundColor: "#0D0D0D" }),
          onLeaveBack: () =>
            gsap.set(document.body, { backgroundColor: "#F0EDE8" }),
        });
        return;
      }

      gsap.fromTo(
        document.body,
        { backgroundColor: "#F0EDE8" },
        {
          backgroundColor: "#0D0D0D",
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 35%",
            scrub: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const handleEmailClick = (event: React.MouseEvent) => {
    if (!prefersReducedMotion) {
      fireParticleBurst(event.clientX, event.clientY);
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative min-h-screen bg-ink px-6 py-sectionMobile md:px-16 md:py-section"
    >
      <div className="mx-auto max-w-7xl">
        {/* Top label */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-mono text-[11px] uppercase tracking-[0.8em] text-mist"
        >
          Get in Touch
        </motion.p>

        {/* Giant clipped headline */}
        <motion.h2
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="mt-8 font-display text-6xl leading-[0.95] text-cream md:text-8xl lg:text-9xl"
        >
          <span className="block overflow-hidden">
            <motion.span variants={revealWord} className="inline-block">
              Let&apos;s build
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span
              variants={revealWord}
              className="inline-block italic text-terra"
            >
              something.
            </motion.span>
          </span>
        </motion.h2>

        {/* Magnetic contact rows */}
        <div className="mt-20 flex flex-col">
          {CONTACT_ITEMS.map((item) => (
            <MagneticButton
              key={item.label}
              href={item.href}
              external={item.external}
              ariaLabel={`${item.label}: ${item.value}`}
              onClick={item.label === "Email" ? handleEmailClick : undefined}
              className="group flex h-20 w-full items-center justify-between border-b border-white/15"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-mist">
                {item.label}
              </span>
              <span className="flex items-center gap-6">
                <span className="font-display text-[1.5rem] text-cream">
                  {item.value}
                </span>
                <span className="inline-block text-cream transition-transform duration-300 group-hover:translate-x-3">
                  →
                </span>
              </span>
            </MagneticButton>
          ))}
        </div>

        {/* Primary CTA with diagonal shine sweep */}
        <div className="mt-20 flex justify-center">
          <a
            href="#"
            aria-label="View full portfolio"
            className="group relative overflow-hidden bg-terra px-12 py-6"
          >
            <span className="relative z-10 font-mono text-sm uppercase tracking-[0.3em] text-ink">
              View Portfolio →
            </span>
            {/* White diagonal shine that sweeps across on hover */}
            <span
              aria-hidden="true"
              className="absolute inset-0 -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
