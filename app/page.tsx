import { LandingExperience } from "@/components/sections/LandingExperience";
import { Projects } from "@/components/sections/Projects";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

// Home page. The full narrative: preloader + hero, the horizontal Selected Work
// gallery, the About color-flip, the Experience timeline, then the dark Contact
// finale and footer.
export default function Home() {
  return (
    <main className="min-h-screen">
      <LandingExperience />
      <Projects />
      <About />
      <Experience />
      <Contact />
      <Footer />
    </main>
  );
}
