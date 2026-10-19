'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Eye, Heart, Link2 } from 'lucide-react';
import { formatCount, safeHttpUrl } from '@/lib/projectUtils';
import { ProjectCanvas, ProjectHead } from './ProjectCanvas';
import { useAppreciation } from './useAppreciation';
import Button from '@/components/ui/Button';
import ProjectCard from './ProjectCard';
import './works.css';

export default function ProjectDetail({ project, related, prev, next, imageMeta }) {
  const { liked, toggle, count } = useAppreciation(project);
  const [copied, setCopied] = useState(false);

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { window.prompt('Copy this link', window.location.href); }
  };

  return (
    <div className="bh">
      <header className="bh-top">
        <Link href="/works" className="bh-brand"><ArrowLeft size={16} aria-hidden="true" /> All projects</Link>
      </header>

      <article className="bh-detail">
        <ProjectHead project={project} />
        <ProjectCanvas project={project} priority meta={imageMeta} />

        <aside className="bh-rail" aria-label="Project actions">
          <button type="button" className={`bh-rail__btn${liked ? ' is-liked' : ''}`} onClick={toggle} aria-pressed={liked}>
            <Heart size={20} aria-hidden="true" /><span>{liked ? 'Appreciated' : 'Appreciate'}</span>{count > 0 && <b>{formatCount(count)}</b>}
          </button>
          {project.views > 0 && (
            <div className="bh-rail__btn bh-rail__static"><Eye size={20} aria-hidden="true" /><span>Views</span><b>{formatCount(project.views)}</b></div>
          )}
          <button type="button" className="bh-rail__btn" onClick={share}>
            <Link2 size={20} aria-hidden="true" /><span>{copied ? 'Link copied' : 'Share'}</span>
          </button>
          {safeHttpUrl(project.liveViewUrl) && (
            <a className="bh-rail__btn bh-rail__live" href={safeHttpUrl(project.liveViewUrl)} target="_blank" rel="noopener noreferrer">
              <ArrowUpRight size={20} aria-hidden="true" /><span>Live view</span>
            </a>
          )}
        </aside>
      </article>

      {(prev || next) && (
        <nav className="bh-pager" aria-label="More projects">
          {prev ? <Link href={`/works/${prev.slug}`}>← {prev.title}</Link> : <span />}
          {next ? <Link href={`/works/${next.slug}`}>{next.title} →</Link> : <span />}
        </nav>
      )}

      {related.length > 0 && (
        <section className="bh-more" aria-labelledby="more-h">
          <h2 id="more-h">More projects</h2>
          <div className="bh-grid">{related.map((p) => <ProjectCard key={p.id} project={p} />)}</div>
        </section>
      )}

      <footer className="bh-cta">
        <h2>Have a project in mind?</h2>
        <Button text="Let's talk" href="/#contact" />
      </footer>
    </div>
  );
}
