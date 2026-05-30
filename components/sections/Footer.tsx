import type { ReactNode } from "react";

interface SocialLink {
  label: string;
  href: string;
  external?: boolean;
  icon: ReactNode;
}

// Inline SVGs keep the footer dependency-free and crisp at 32px.
const SOCIALS: SocialLink[] = [
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/moushmidhinakaran",
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.75-2.05 4 0 4.75 2.6 4.75 6V21H19v-5.3c0-1.27-.02-2.9-1.77-2.9-1.77 0-2.04 1.38-2.04 2.8V21H10z" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:moushmi.dhinakaran@gmail.com",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="h-4 w-4"
      >
        <rect x="3" y="5" width="18" height="14" rx="1" />
        <path d="M3 7l9 6 9-6" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    external: true,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="h-4 w-4"
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

/**
 * Footer — minimal, full-width closing rule. Copyright on the left, social
 * icon squares in the centre (hover fills terra), and a signature note right.
 */
export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink px-6 py-8 md:px-16">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 md:flex-row md:justify-between md:gap-0">
        {/* Left — copyright */}
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist">
          © 2026 Moushmi Dhinakaran
        </p>

        {/* Centre — social icons */}
        <div className="flex items-center gap-3">
          {SOCIALS.map((social) => (
            <a
              key={social.label}
              href={social.href}
              aria-label={social.label}
              target={social.external ? "_blank" : undefined}
              rel={social.external ? "noopener noreferrer" : undefined}
              className="flex h-8 w-8 items-center justify-center border border-white/15 text-mist transition-colors duration-300 hover:border-terra hover:bg-terra hover:text-ink"
            >
              {social.icon}
            </a>
          ))}
        </div>

        {/* Right — signature */}
        <p className="font-mono text-[11px] italic tracking-[0.2em] text-mist">
          Designed with intention · Built in Cursor with Claude
        </p>
      </div>
    </footer>
  );
}
