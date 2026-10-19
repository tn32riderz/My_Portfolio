import { getDb, isPublished } from '@/lib/db';
import { normalizeProject } from '@/lib/projectUtils';

const isDev = process.env.NODE_ENV !== 'production';

/** Published projects, newest first. */
export async function getPublishedProjects() {
  const { caseStudies = [] } = await getDb();
  return caseStudies
    .filter(isPublished)
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
    .map(normalizeProject);
}

/** Drafts are viewable only in development so they can be previewed from the editor. */
export async function getProjectBySlug(slug) {
  const { caseStudies = [] } = await getDb();
  const found = caseStudies.find((c) => c.slug === slug);
  return found && (isPublished(found) || isDev) ? normalizeProject(found) : null;
}
