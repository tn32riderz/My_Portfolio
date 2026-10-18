import fs from 'fs/promises';
import path from 'path';
import { notFound } from 'next/navigation';
import ProjectDetail from './ProjectDetail';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  let db = {};
  try {
    const dbPath = path.join(process.cwd(), 'src', 'db.json');
    const raw = await fs.readFile(dbPath, 'utf-8');
    db = JSON.parse(raw);
  } catch { /* noop */ }

  const cs = (db.caseStudies || []).find(c => c.slug === slug);
  if (!cs) {
    return { title: 'Project | Portfolio' };
  }
  return {
    title: cs.seoTitle || `${cs.title} | Portfolio`,
    description: cs.seoDescription || cs.title,
  };
}

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;
  let db = {};
  try {
    const dbPath = path.join(process.cwd(), 'src', 'db.json');
    const raw = await fs.readFile(dbPath, 'utf-8');
    db = JSON.parse(raw);
  } catch { /* noop */ }

  const caseStudies = db.caseStudies || [];
  const project = caseStudies.find(cs => cs.slug === slug);

  if (!project) {
    // For demo slugs (static defaults), pass null so client renders demo content
    return <ProjectDetail project={null} slug={slug} relatedProjects={[]} />;
  }

  const related = caseStudies
    .filter(cs => cs.id !== project.id && cs.category === project.category && (cs.status === 'Active' || cs.status === 'Published'))
    .slice(0, 3);

  return <ProjectDetail project={project} slug={slug} relatedProjects={related} />;
}
