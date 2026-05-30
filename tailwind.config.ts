import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./sections/**/*.{js,ts,jsx,tsx,mdx}",
    "./providers/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Font stacks are fed by the next/font CSS variables declared in layout.tsx.
      // The variable is listed first so the self-hosted webfont wins, with the
      // named family + generic fallback behind it.
      fontFamily: {
        display: ["var(--font-playfair)", "Playfair Display", "serif"],
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "JetBrains Mono", "monospace"],
      },
      // Editorial palette for the whole site.
      colors: {
        cream: "#F0EDE8",
        ink: "#0D0D0D",
        charcoal: "#2A2A2A",
        terra: "#C4785A",
        mist: "#8A8580",
      },
      // Shared vertical rhythm for section padding.
      spacing: {
        section: "120px",
        sectionMobile: "64px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
