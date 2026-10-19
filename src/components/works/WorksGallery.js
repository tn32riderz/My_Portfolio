'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import ProjectCard from './ProjectCard';
import './works.css';

const SORTS = {
  recent: { label: 'Most recent', fn: (a, b) => String(b.createdAt).localeCompare(String(a.createdAt)) },
  appreciated: { label: 'Most appreciated', fn: (a, b) => b.appreciations - a.appreciations },
  viewed: { label: 'Most viewed', fn: (a, b) => b.views - a.views },
};

export default function WorksGallery({ projects }) {
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('recent');
  const [query, setQuery] = useState('');

  const categories = useMemo(() => ['All', ...new Set(projects.map((p) => p.category).filter(Boolean))], [projects]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects
      .filter((p) => category === 'All' || p.category === category)
      .filter((p) => !q || [p.title, p.company, p.category, ...p.serviceProvided].join(' ').toLowerCase().includes(q))
      .sort(SORTS[sort].fn);
  }, [projects, category, sort, query]);

  return (
    <div className="bh">
      <section className="bh-head">
        <h1>Projects</h1>
        <p>{projects.length} {projects.length === 1 ? 'project' : 'projects'} — case studies, product design and web builds.</p>
      </section>

      <div className="bh-toolbar">
        <div className="bh-chips" role="group" aria-label="Filter by category">
          {categories.map((c) => (
            <button key={c} type="button" aria-pressed={category === c}
              className={category === c ? 'is-active' : ''} onClick={() => setCategory(c)}>{c}</button>
          ))}
        </div>
        <div className="bh-tools">
          <label className="bh-search">
            <Search size={16} aria-hidden="true" />
            <span className="bh-sr">Search projects</span>
            <input type="search" placeholder="Search projects" value={query} onChange={(e) => setQuery(e.target.value)} />
          </label>
          <label className="bh-sort">
            <span className="bh-sr">Sort by</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </label>
        </div>
      </div>

      {visible.length ? (
        <div className="bh-grid">{visible.map((p, i) => <ProjectCard key={p.id} project={p} priority={i < 4} />)}</div>
      ) : (
        <p className="bh-empty">
          {projects.length ? 'No projects match your filters.' : 'No published projects yet. Publish one from the editor.'}
        </p>
      )}
    </div>
  );
}
