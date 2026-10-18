'use client';
import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Button from '../components/Button';
import './Projects.css';

const defaultProjects = [
  {
    id: 1,
    image: '/assets/images/case-studies/levaal/cover.webp',
    title: "Levaal AI Platform",
    description: "Built a full-stack AI dashboard that increased user retention by 40%. Clean, fast, and scalable.",
    tags: ["UI/UX Design", "AI Platform"],
    slug: "levaal-ai",
  },
  {
    id: 2,
    image: '/assets/images/case-studies/realla/cover.webp',
    title: "Realla Real Estate App",
    description: "Designed and shipped a mobile-first travel booking experience from 0 to launch in 6 weeks.",
    tags: ["Product Design", "Mobile App"],
    slug: "realla-ai",
  },
  {
    id: 3,
    image: '/assets/images/case-studies/collabkit/cover.webp',
    title: "CollabKit Workspace",
    description: "Transformed complex data into intuitive dashboards. 99% client satisfaction on delivery.",
    tags: ["Web Design", "Frontend"],
    slug: "collabkit",
  },
  {
    id: 4,
    image: '/project4.png',
    title: "Brand Identity Design",
    description: "Futuristic brand identity and landing page design for an emerging AI startup company.",
    tags: ["Branding", "Creative Directing"],
    slug: "brand-identity-design",
  },
];

function ProjectCard({ project, index }) {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          card.classList.add('projects-card--visible');
          observer.unobserve(card);
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  const caseStudyHref = `/works/${project.slug}`;

  return (
    <Link
      href={caseStudyHref}
      ref={cardRef}
      className="projects-card"
      style={{ '--card-delay': `${index * 0.12}s` }}
      aria-label={`View project: ${project.title}`}
    >
      <div className="projects-card-image-wrapper">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="projects-card-image"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="projects-card-image-overlay" />
        {/* Hover View Badge */}
        <div className="projects-card-view-badge">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          View Case Study
        </div>
      </div>
      <div className="projects-card-content">
        <h3 className="projects-card-title">{project.title}</h3>
        <p className="projects-card-description">{project.description}</p>
        <div className="projects-card-tags">
          {project.tags.map((tag) => (
            <span key={tag} className="projects-card-tag">{tag}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}

export default function Projects({ caseStudies }) {
  const displayProjects = caseStudies && caseStudies.length > 0
    ? caseStudies.map((cs, idx) => ({
        id: cs.id,
        image: cs.coverImage || `/project${(idx % 4) + 1}.png`,
        title: cs.title,
        description: cs.seoDescription || cs.title,
        tags: cs.serviceProvided || [cs.category || 'Case Study'],
        slug: cs.slug,
      }))
    : defaultProjects;

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

  return (
    <section className="projects-section" id="projects">
      <div className="projects-container">
        {/* Asymmetrical grid containing 4 cards in alternating flow */}
        <div className="projects-layout">

          {/* Left Column (Cards 1 and 3) */}
          <div className="projects-col-left">
            {displayProjects[0] && <ProjectCard project={displayProjects[0]} index={0} />}
            {displayProjects[2] && <ProjectCard project={displayProjects[2]} index={2} />}
            
            {/* Footer Quote & Gradient Action Button */}
            <div className="projects-footer-quote">
              <p className="projects-quote-text">I strive for pay attention<br />to the smallest details</p>
              <div className="projects-btn-container">
                <Button text="See All Works" href="/works" />
              </div>
            </div>
          </div>

          {/* Right Column (Header + Cards 2 and 4) */}
          <div className="projects-col-right">
            <div className="projects-header" ref={headerRef}>
              <div className="projects-label">
                <span className="projects-sparkle">✦</span>
                <span className="projects-label-text">Some Recent Projects</span>
              </div>
              <h2 className="projects-heading">Selected Work That Delivers Results</h2>
            </div>
            {displayProjects[1] && <ProjectCard project={displayProjects[1]} index={1} />}
            {displayProjects[3] && <ProjectCard project={displayProjects[3]} index={3} />}
          </div>

        </div>
      </div>
    </section>
  );
}
