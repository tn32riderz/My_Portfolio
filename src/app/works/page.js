import { getPublishedProjects } from '@/lib/projects';
import { getImageMetaMap } from '@/lib/imageMeta';
import WorksGallery from '@/components/works/WorksGallery';

export const metadata = {
  title: 'Projects | Portfolio',
  description: 'Browse all projects — case studies, product design and web builds.',
};

export default async function WorksPage() {
  const projects = await getPublishedProjects();
  const meta = await getImageMetaMap(projects.map((p) => p.coverImage));
  return <WorksGallery projects={projects.map((p) => ({ ...p, coverBlur: meta[p.coverImage]?.blur }))} />;
}
