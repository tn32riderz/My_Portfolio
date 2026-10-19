import { notFound } from 'next/navigation';
import { getProjectBySlug, getPublishedProjects } from '@/lib/projects';
import { getImageMetaMap, projectImageSources } from '@/lib/imageMeta';
import ProjectDetail from '@/components/works/ProjectDetail';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: 'Project not found | Portfolio' };
  return {
    title: project.seoTitle || `${project.title} | Portfolio`,
    description: project.seoDescription || project.title,
  };
}

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const all = await getPublishedProjects();
  const index = all.findIndex((p) => p.id === project.id);
  const others = all.filter((p) => p.id !== project.id);
  const related = [
    ...others.filter((p) => p.category === project.category),
    ...others.filter((p) => p.category !== project.category),
  ].slice(0, 4);

  const imageMeta = await getImageMetaMap([...projectImageSources(project), ...related.map((p) => p.coverImage)]);

  return (
    <ProjectDetail
      project={project}
      imageMeta={imageMeta}
      related={related.map((p) => ({ ...p, coverBlur: imageMeta[p.coverImage]?.blur }))}
      prev={index > 0 ? all[index - 1] : null}
      next={index >= 0 && index < all.length - 1 ? all[index + 1] : null}
    />
  );
}
