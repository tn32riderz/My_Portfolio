'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Eye } from 'lucide-react';
import { formatCount } from '@/lib/projectUtils';
import { useAppreciation } from './useAppreciation';

export default function ProjectCard({ project, priority = false }) {
  const { liked, count } = useAppreciation(project);
  return (
    <article className="bh-card">
      <Link href={`/works/${project.slug}`} className="bh-card__cover" aria-label={project.title}>
        {project.coverImage ? (
          <Image src={project.coverImage} alt="" fill sizes="(max-width:559px) 100vw, 50vw"
            priority={priority} placeholder={project.coverBlur ? 'blur' : 'empty'} blurDataURL={project.coverBlur} />
        ) : <span className="bh-card__noimg">{project.title.slice(0, 1)}</span>}
        <span className="bh-card__overlay"><span>{project.title}</span></span>
      </Link>
      <div className="bh-card__meta">
        <div className="bh-card__text">
          <Link href={`/works/${project.slug}`} className="bh-card__title">{project.title}</Link>
          <span className="bh-card__owner">{project.company || project.category}</span>
        </div>
        <div className="bh-stats" aria-label="Project stats">
          {count > 0 && <span className={liked ? 'is-liked' : ''}><Heart size={14} aria-hidden="true" />{formatCount(count)}</span>}
          {project.views > 0 && <span><Eye size={14} aria-hidden="true" />{formatCount(project.views)}</span>}
        </div>
      </div>
    </article>
  );
}
