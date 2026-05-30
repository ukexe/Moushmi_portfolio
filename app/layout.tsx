import type { Metadata } from "next";
import { Playfair_Display, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/providers/LenisProvider";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { Navigation } from "@/components/ui/Navigation";
import { PageTransition } from "@/components/ui/PageTransition";

// Display face for headings, hero copy, and project titles.
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

// Body face for everything else: nav, paragraphs, captions.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Monospace face for skill lists, dates, and spec-sheet style labels.
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

// Update to the production domain at deploy time.
const SITE_URL = "https://moushmidhinakaran.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Moushmi Dhinakaran · Architectural Designer · TMU",
  description:
    "Portfolio of Moushmi Dhinakaran — architectural science student, BIM specialist, and design thinker at Toronto Metropolitan University.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Moushmi Dhinakaran · Architectural Designer · TMU",
    description:
      "Portfolio of Moushmi Dhinakaran — architectural science student, BIM specialist, and design thinker at Toronto Metropolitan University.",
    type: "website",
    url: SITE_URL,
    siteName: "Moushmi Dhinakaran",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Moushmi Dhinakaran · Architectural Designer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Moushmi Dhinakaran · Architectural Designer · TMU",
    description:
      "Portfolio of Moushmi Dhinakaran — architectural science student, BIM specialist, and design thinker at Toronto Metropolitan University.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* Preconnect to Google Fonts hosts to speed up font delivery. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-ink font-sans text-cream antialiased">
        {/* Smooth scroll + GSAP ticker sync wraps the entire app. */}
        <LenisProvider>
          {/* Route-change overlay transition. */}
          <PageTransition />
          {/* Fixed top navigation with theme + active tracking. */}
          <Navigation />
          {/* Bespoke cursor sits above all content; renders only on fine pointers. */}
          <CustomCursor />
          {children}
          {/* Global scroll-to-top control (appears after scrolling down). */}
          <ScrollToTop />
        </LenisProvider>
      </body>
    </html>
  );
}
