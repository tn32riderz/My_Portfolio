import { notFound } from 'next/navigation';
import { isAuthenticated } from '@/lib/adminAuth';
import { getDb } from '@/lib/db';
import { normalizeProject } from '@/lib/projectUtils';
import ProjectEditorScreen from '@/components/admin/ProjectEditorScreen';

export const metadata = { title: 'Edit case study', robots: { index: false, follow: false } };

export default async function EditProjectPage({ params }) {
  if (!(await isAuthenticated())) return null;
  const { id } = await params;
  const { caseStudies = [] } = await getDb();
  const project = caseStudies.find((c) => c.id === id);
  if (!project) notFound();
  // key forces a fresh editor when navigating between projects
  return <ProjectEditorScreen key={project.id} initial={normalizeProject(project)} />;
}
