import { getDb, publishedList } from '@/lib/db';
import { getExperienceContent, getHomeProjects } from '@/lib/content';
import SmoothScroll from '@/components/layout/SmoothScroll';
import Hero from '@/components/sections/Hero';
import ExperienceTicker from '@/components/sections/ExperienceTicker';
import AboutMe from '@/components/sections/AboutMe';
import Experience from '@/components/sections/Experience';
import Projects from '@/components/sections/Projects';
import Services from '@/components/sections/Services';
import Testimonials from '@/components/sections/Testimonials';
import Blogs from '@/components/sections/Blogs';
import WorkTicker from '@/components/sections/WorkTicker';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/sections/Footer';

// Re-generate daily so the years/durations on the page stay current.
export const revalidate = 86400;

export default async function Home() {
  const db = await getDb();

  const testimonials = publishedList(db.testimonials);
  const { experiences, education, careerStart } = await getExperienceContent();
  // Projects chosen (and ordered) in the admin "Home page highlights" box.
  const homeProjects = await getHomeProjects();

  return (
    <main>
      <SmoothScroll />
      <Hero />
      <ExperienceTicker careerStart={careerStart} />
      <AboutMe careerStart={careerStart} />
      <Experience experiences={experiences} education={education} careerStart={careerStart} />
      <Projects caseStudies={homeProjects} />
      <Services services={publishedList(db.services)} />
      {testimonials.length > 0 && <Testimonials testimonials={testimonials} />}
      {/* <Blogs blogs={db.blogs} /> */}
      <WorkTicker />
      <Contact />
      <Footer />
    </main>
  );
}

