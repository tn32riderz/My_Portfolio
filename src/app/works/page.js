import fs from 'fs/promises';
import path from 'path';
import WorksGallery from './WorksGallery';

export const metadata = {
  title: 'All Works | Portfolio',
  description: 'Browse all creative projects — UI/UX, branding, web design, and more.',
};

export default async function WorksPage() {
  let db = {};
  try {
    const dbPath = path.join(process.cwd(), 'src', 'db.json');
    const raw = await fs.readFile(dbPath, 'utf-8');
    db = JSON.parse(raw);
  } catch {
    // fallback to empty
  }

  const caseStudies = (db.caseStudies || []).filter(cs => cs.status === 'Active' || cs.status === 'Published');

  return <WorksGallery caseStudies={caseStudies} />;
}
