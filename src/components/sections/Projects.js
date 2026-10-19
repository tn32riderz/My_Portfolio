'use client';
import React, { useEffect, useRef } from 'react';
import Button from '@/components/ui/Button';
import ProjectCardStack from './ProjectCardStack';
import './Projects.css';

export default function Projects({ caseStudies }) {
  const cards = (caseStudies || []).map((cs, idx) => ({
    id: cs.id,
    image: cs.coverImage || `/assets/images/projects/project${(idx % 4) + 1}.png`,
    title: cs.title,
    description: cs.seoDescription || cs.title,
    tags: cs.serviceProvided?.length ? cs.serviceProvided : [cs.category || 'Case Study'],
    slug: cs.slug,
  }));

  const headerRef = useRef(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          header.classList.add('projects-header--visible');
          observer.unobserve(header);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  if (!cards.length) return null;

  return (
    <section className="projects-section" id="projects">
      <div className="projects-container projects-split">
        {/* Stays pinned beside the cards for the whole section */}
        <aside className="projects-side">
          <div className="projects-header" ref={headerRef}>
            <div className="projects-label">
              <span className="projects-sparkle">✦</span>
              <span className="projects-label-text">Some Recent Projects</span>
            </div>
            <h2 className="projects-heading">Selected Work That Delivers Results</h2>
          </div>
          <div className="projects-btn-container">
            <Button text="See All Works" href="/works" />
          </div>
        </aside>

        <ProjectCardStack cards={cards} />
      </div>
    </section>
  );
}
