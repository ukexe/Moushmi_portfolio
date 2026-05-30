// Project data for the Selected Work gallery. Slugs match the canonical set
// used for the /projects/[slug] detail routes.

export interface Project {
  // Zero-padded display number, e.g. "01".
  number: string;
  title: string;
  // Primary category shown as the terra tag on the card.
  category: string;
  // Secondary meta line (studio context, award, location).
  meta: string;
  slug: string;
  // Card 5 is the headline academic recognition.
  featured?: boolean;
  // Ribbon label shown for featured cards.
  ribbon?: string;
}

export const projects: Project[] = [
  {
    number: "01",
    title: "Laneway Duplex",
    category: "Residential Design",
    meta: "Studio Project",
    slug: "laneway-duplex",
  },
  {
    number: "02",
    title: "Mid-Rise Social Housing",
    category: "Urban Housing",
    meta: "Studio Project",
    slug: "mid-rise-social-housing",
  },
  {
    number: "03",
    title: "Transit Hub",
    category: "Infrastructure",
    meta: "Studio Project",
    slug: "transit-hub",
  },
  {
    number: "04",
    title: "Timber Fever",
    category: "Material Exploration",
    meta: "Studio Project",
    slug: "timber-fever",
  },
  {
    number: "05",
    title: "Urban Analytique Exercise",
    category: "Featured",
    meta: "YES 2025 · Toronto",
    slug: "urban-analytique-exercise",
    featured: true,
    ribbon: "YES 2025",
  },
];
