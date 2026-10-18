import fs from 'fs/promises';
import path from 'path';
import Hero from '../sections/Hero';
import ExperienceTicker from '../sections/ExperienceTicker';
import AboutMe from '../sections/AboutMe';
import Experience from '../sections/Experience';
import Projects from '../sections/Projects';
import Services from '../sections/Services';
import Testimonials from '../sections/Testimonials';
import Blogs from '../sections/Blogs';
import WorkTicker from '../sections/WorkTicker';
import Contact from '../sections/Contact';
import Footer from '../sections/Footer';

export default async function Home() {
  let db = {};
  try {
    const dbPath = path.join(process.cwd(), 'src', 'db.json');
    const dbData = await fs.readFile(dbPath, 'utf-8');
    db = JSON.parse(dbData);
  } catch (error) {
    console.warn('Failed to load db.json, falling back to static defaults', error);
  }

  return (
    <main>
      <Hero settings={db.settings} />
      <ExperienceTicker clientLogos={db.clientLogos} />
      <AboutMe settings={db.settings} />
      <Experience experience={db.experiences} />
      <Projects caseStudies={db.caseStudies} />
      <Services services={db.services} />
      <Testimonials testimonials={db.testimonials} />
      {/* <Blogs blogs={db.blogs} /> */}
      <WorkTicker />
      <Contact settings={db.settings} />
      <Footer settings={db.settings} />
    </main>
  );
}

