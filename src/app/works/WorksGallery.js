'use client';
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './works.css';

const defaultProjects = [
  {
    id: 'default-1',
    title: 'AI SaaS Platform Redesign',
    company: 'TechVenture Inc.',
    category: 'UI/UX Design',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&h=600&q=80',
    serviceProvided: ['UI Design', 'UX Research'],
    liveViewUrl: 'https://behance.net',
  },
  {
    id: 'default-2',
    title: 'Travel App — Mobile First',
    company: 'WanderLux',
    category: 'Mobile App',
    coverImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&h=600&q=80',
    serviceProvided: ['Product Design', 'Prototyping'],
    liveViewUrl: 'https://behance.net',
  },
  {
    id: 'default-3',
    title: 'SaaS Analytics Dashboard',
    company: 'DataFlow',
    category: 'Web Design',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&h=600&q=80',
    serviceProvided: ['Web Design', 'Frontend'],
    liveViewUrl: 'https://behance.net',
  },
  {
    id: 'default-4',
    title: 'Brand Identity Design',
    company: 'Nova AI',
    category: 'Branding',
    coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&h=600&q=80',
    serviceProvided: ['Branding', 'Creative Direction'],
    liveViewUrl: 'https://behance.net',
  },
  {
    id: 'default-5',
    title: 'E-Commerce Redesign',
    company: 'Luxe Store',
    category: 'Web Design',
    coverImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&h=600&q=80',
    serviceProvided: ['UI Design', 'Shopify'],
    liveViewUrl: 'https://behance.net',
  },
  {
    id: 'default-6',
    title: 'Mobile Banking App',
    company: 'FinEdge',
    category: 'Mobile App',
    coverImage: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=800&h=600&q=80',
    serviceProvided: ['UI/UX Design', 'Prototyping'],
    liveViewUrl: 'https://behance.net',
  },
  {
    id: 'default-7',
    title: 'Startup Brand System',
    company: 'Bloom Labs',
    category: 'Branding',
    coverImage: 'https://images.unsplash.com/photo-1634942537034-2531766767d1?auto=format&fit=crop&w=800&h=600&q=80',
    serviceProvided: ['Branding', 'Identity'],
    liveViewUrl: 'https://behance.net',
  },
  {
    id: 'default-8',
    title: 'SaaS Onboarding Flow',
    company: 'FlowStack',
    category: 'UI/UX Design',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&h=600&q=80',
    serviceProvided: ['UX Design', 'Wireframing'],
    liveViewUrl: 'https://behance.net',
  },
];

function WorkCard({ project, index }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); obs.unobserve(el); }
      },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const href = project.liveViewUrl || '#';
  const isExternal = href !== '#';

  return (
    <a
      ref={ref}
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className={`works-card ${visible ? 'works-card--visible' : ''}`}
      style={{ '--i': index }}
      aria-label={`View project: ${project.title}`}
    >
      <div className="works-card-img">
        <Image
          src={project.coverImage}
          alt={project.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="works-card-img-el"
        />
        <div className="works-card-overlay">
          <div className="works-card-hover-content">
            <span className="works-card-view-btn">
              {isExternal ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5.5 2.5H2.5a1 1 0 00-1 1v8a1 1 0 001 1h8a1 1 0 001-1V8.5M8.5 1.5h4m0 0v4m0-4L6 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 8s2.5-5 6-5 6 5 6 5-2.5 5-6 5-6-5-6-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              )}
              {isExternal ? 'View Live' : 'View Project'}
            </span>
          </div>
        </div>
      </div>
      <div className="works-card-info">
        <div className="works-card-meta">
          <span className="works-card-category">{project.category}</span>
          {project.company && <span className="works-card-company">{project.company}</span>}
        </div>
        <h3 className="works-card-title">{project.title}</h3>
        <div className="works-card-tags">
          {(project.serviceProvided || []).slice(0, 3).map(tag => (
            <span key={tag} className="works-card-tag">{tag}</span>
          ))}
          {isExternal && (
            <span className="works-card-tag works-card-tag--live">
              <svg width="6" height="6" viewBox="0 0 6 6" fill="currentColor" style={{ marginRight: 3 }}>
                <circle cx="3" cy="3" r="3"/>
              </svg>
              Live
            </span>
          )}
        </div>
      </div>
    </a>
  );
}

export default function WorksGallery({ caseStudies }) {
  const allProjects = (caseStudies && caseStudies.length > 0)
    ? caseStudies.map(cs => ({
        id: cs.id,
        title: cs.title,
        company: cs.company || '',
        category: cs.category || 'Design',
        coverImage: cs.coverImage || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&h=600&q=80',
        serviceProvided: cs.serviceProvided || [],
        liveViewUrl: cs.liveViewUrl || '',
      }))
    : defaultProjects;

  const categories = ['All', ...Array.from(new Set(allProjects.map(p => p.category)))];
  const [active, setActive] = useState('All');

  const filtered = active === 'All' ? allProjects : allProjects.filter(p => p.category === active);

  return (
    <div className="works-page">
      {/* ── Page Header ── */}
      <header className="works-page-header">
        <div className="works-page-header-inner">
          <Link href="/" className="works-back-link">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </Link>
          <div className="works-page-title-block">
            <span className="works-page-eyebrow">✦ Portfolio</span>
            <h1 className="works-page-title">All Works</h1>
            <p className="works-page-subtitle">
              Crafted with precision — {allProjects.length} projects across design, branding &amp; development.
            </p>
          </div>
        </div>
      </header>

      {/* ── Category Filter Bar ── */}
      <div className="works-filter-bar">
        <div className="works-filter-inner">
          {categories.map(cat => (
            <button
              key={cat}
              className={`works-filter-btn ${active === cat ? 'works-filter-btn--active' : ''}`}
              onClick={() => setActive(cat)}
              id={`filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {cat}
              {cat !== 'All' && (
                <span className="works-filter-count">
                  {allProjects.filter(p => p.category === cat).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid ── */}
      <main className="works-grid-section">
        <div className="works-grid">
          {filtered.map((project, i) => (
            <WorkCard key={project.id} project={project} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="works-empty">
            <p>No projects in this category yet.</p>
          </div>
        )}
      </main>

      {/* ── Footer CTA ── */}
      <div className="works-page-cta">
        <p className="works-cta-text">Have a project in mind?</p>
        <Link href="/#contact" className="works-cta-btn">
          Let&apos;s Talk
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
    </div>
  );
}
