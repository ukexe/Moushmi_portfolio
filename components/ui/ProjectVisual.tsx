"use client";

import { motion, useReducedMotion } from "framer-motion";

// Shared SVG canvas for every motif. Uses a portrait viewBox sliced to fill the
// card, with non-scaling strokes so lines stay crisp at any size.
function Svg({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 300 400"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
    >
      {children}
    </svg>
  );
}

interface MotifProps {
  animate: boolean;
}

/* -------------------------------------------------------------------------- */
/* 01 · Laneway Duplex — stacked residential volumes with lit windows + a      */
/* slow diagonal light sweep, evoking a small infill home at dusk.            */
/* -------------------------------------------------------------------------- */
function LanewayDuplex({ animate }: MotifProps) {
  // A small grid of windows that gently twinkle.
  const windows = (
    x0: number,
    y0: number,
    cols: number,
    rows: number
  ) => {
    const cells = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        cells.push(
          <motion.rect
            key={`${x0}-${i}`}
            x={x0 + c * 26}
            y={y0 + r * 28}
            width={14}
            height={16}
            className="fill-terra"
            initial={{ opacity: 0.25 }}
            animate={animate ? { opacity: [0.15, 0.55, 0.15] } : { opacity: 0.3 }}
            transition={{
              duration: 3,
              delay: i * 0.25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      }
    }
    return cells;
  };

  return (
    <Svg>
      <line x1="0" y1="332" x2="300" y2="332" className="stroke-mist" strokeWidth={1} vectorEffect="non-scaling-stroke" />
      {/* lower volume */}
      <rect x="48" y="196" width="150" height="136" className="fill-none stroke-cream" strokeWidth={1} vectorEffect="non-scaling-stroke" />
      {windows(64, 214, 3, 3)}
      {/* upper, offset volume */}
      <rect x="120" y="100" width="132" height="120" className="fill-none stroke-cream" strokeWidth={1} vectorEffect="non-scaling-stroke" />
      {windows(136, 118, 3, 2)}
      {/* diagonal light sweep (skew on the group so the motion translate composes) */}
      <g transform="skewX(-18)">
        <motion.rect
          x="-70"
          y="-40"
          width="50"
          height="480"
          className="fill-cream"
          opacity={0.06}
          initial={{ x: -70 }}
          animate={animate ? { x: [-70, 360] } : { x: 140 }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
      </g>
    </Svg>
  );
}

/* -------------------------------------------------------------------------- */
/* 02 · Mid-Rise Social Housing — a modular facade grid whose units light up   */
/* in a diagonal wave, like a building coming to life floor by floor.          */
/* -------------------------------------------------------------------------- */
function MidRiseHousing({ animate }: MotifProps) {
  const cols = 5;
  const rows = 9;
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push(
        <motion.rect
          key={`${r}-${c}`}
          x={70 + c * 33}
          y={48 + r * 33}
          width={22}
          height={22}
          className="fill-terra"
          initial={{ opacity: 0.12 }}
          animate={animate ? { opacity: [0.12, 0.55, 0.12] } : { opacity: 0.28 }}
          transition={{
            duration: 4,
            delay: (c + r) * 0.18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      );
    }
  }

  return (
    <Svg>
      <rect x="58" y="36" width="184" height="320" className="fill-none stroke-cream" strokeWidth={1} vectorEffect="non-scaling-stroke" />
      {cells}
      <line x1="58" y1="356" x2="242" y2="356" className="stroke-mist" strokeWidth={1} vectorEffect="non-scaling-stroke" />
    </Svg>
  );
}

/* -------------------------------------------------------------------------- */
/* 03 · Transit Hub — a network of routes converging on a pulsing interchange  */
/* node, with vehicles travelling the lines.                                   */
/* -------------------------------------------------------------------------- */
function TransitHub({ animate }: MotifProps) {
  const routes: Array<[number, number, number, number]> = [
    [20, 70, 280, 330],
    [280, 70, 20, 330],
    [10, 200, 290, 200],
    [150, 24, 150, 376],
  ];

  return (
    <Svg>
      {routes.map((rt, i) => (
        <line
          key={`r${i}`}
          x1={rt[0]}
          y1={rt[1]}
          x2={rt[2]}
          y2={rt[3]}
          className={i % 2 === 0 ? "stroke-cream" : "stroke-mist"}
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
      ))}

      {/* travelling vehicles */}
      {routes.map((rt, i) => (
        <motion.rect
          key={`v${i}`}
          width={7}
          height={7}
          className="fill-terra"
          initial={{ x: rt[0] - 3.5, y: rt[1] - 3.5 }}
          animate={
            animate
              ? { x: [rt[0] - 3.5, rt[2] - 3.5], y: [rt[1] - 3.5, rt[3] - 3.5] }
              : { x: (rt[0] + rt[2]) / 2 - 3.5, y: (rt[1] + rt[3]) / 2 - 3.5 }
          }
          transition={{
            duration: 5,
            delay: i * 0.8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* interchange node */}
      <motion.circle
        cx="150"
        cy="200"
        r="10"
        className="fill-none stroke-terra"
        strokeWidth={1.5}
        vectorEffect="non-scaling-stroke"
        initial={{ scale: 1, opacity: 0.8 }}
        animate={animate ? { scale: [1, 1.6, 1], opacity: [0.8, 0.2, 0.8] } : { scale: 1 }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "150px 200px" }}
      />
      <circle cx="150" cy="200" r="4" className="fill-cream" />
    </Svg>
  );
}

/* -------------------------------------------------------------------------- */
/* 04 · Timber Fever — a crossing diagonal lattice (diagrid) that breathes,    */
/* referencing engineered-timber structure.                                    */
/* -------------------------------------------------------------------------- */
function TimberFever({ animate }: MotifProps) {
  const lines = (dir: 1 | -1) =>
    Array.from({ length: 11 }).map((_, i) => {
      const offset = i * 60 - 240;
      return (
        <line
          key={i}
          x1={dir === 1 ? offset : 300 - offset}
          y1={0}
          x2={dir === 1 ? offset + 400 : 300 - offset - 400}
          y2={400}
          className={i % 2 === 0 ? "stroke-terra" : "stroke-cream"}
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
          opacity={0.5}
        />
      );
    });

  return (
    <Svg>
      <motion.g
        initial={{ x: 0 }}
        animate={animate ? { x: [-8, 8, -8] } : { x: 0 }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        {lines(1)}
      </motion.g>
      <motion.g
        initial={{ x: 0 }}
        animate={animate ? { x: [8, -8, 8] } : { x: 0 }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        {lines(-1)}
      </motion.g>
    </Svg>
  );
}

/* -------------------------------------------------------------------------- */
/* 05 · Urban Analytique — concentric contour rings, a crosshair grid, and a   */
/* rotating analysis sweep, in the language of an analytical site drawing.     */
/* -------------------------------------------------------------------------- */
function UrbanAnalytique({ animate }: MotifProps) {
  const rings = [30, 60, 90, 120, 150];

  return (
    <Svg>
      {/* crosshair */}
      <line x1="150" y1="20" x2="150" y2="380" className="stroke-mist" strokeWidth={1} vectorEffect="non-scaling-stroke" opacity={0.5} />
      <line x1="10" y1="200" x2="290" y2="200" className="stroke-mist" strokeWidth={1} vectorEffect="non-scaling-stroke" opacity={0.5} />

      {/* contour rings, pulsing in sequence */}
      {rings.map((r, i) => (
        <motion.circle
          key={r}
          cx="150"
          cy="200"
          r={r}
          className="fill-none stroke-cream"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
          initial={{ opacity: 0.3 }}
          animate={animate ? { opacity: [0.15, 0.6, 0.15] } : { opacity: 0.3 }}
          transition={{
            duration: 3,
            delay: i * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* rotating analysis sweep */}
      <motion.g
        style={{ transformOrigin: "150px 200px" }}
        initial={{ rotate: 0 }}
        animate={animate ? { rotate: 360 } : { rotate: 0 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      >
        <line x1="150" y1="200" x2="150" y2="50" className="stroke-terra" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
        <circle cx="150" cy="50" r="4" className="fill-terra" />
      </motion.g>

      <circle cx="150" cy="200" r="3" className="fill-cream" />
    </Svg>
  );
}

// Map project slugs to their motif.
const MOTIFS: Record<string, (p: MotifProps) => JSX.Element> = {
  "laneway-duplex": LanewayDuplex,
  "mid-rise-social-housing": MidRiseHousing,
  "transit-hub": TransitHub,
  "timber-fever": TimberFever,
  "urban-analytique-exercise": UrbanAnalytique,
};

/**
 * ProjectVisual — a bespoke, lightweight (SVG) animated motif per project. It
 * replaces the per-card WebGL canvas: it fills the previously-blank cards with
 * unique, theme-related motion while being far cheaper to render. The whole
 * motif scales subtly on hover, and a dark gradient keeps the frosted panel
 * legible.
 */
export function ProjectVisual({
  slug,
  hovered,
}: {
  slug: string;
  hovered: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();
  const animate = !prefersReducedMotion;
  const Motif = MOTIFS[slug] ?? LanewayDuplex;

  return (
    <motion.div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden bg-charcoal"
      animate={{ scale: hovered ? 1.05 : 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Motif animate={animate} />
      {/* depth gradient toward the bottom for panel legibility */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/20" />
    </motion.div>
  );
}
