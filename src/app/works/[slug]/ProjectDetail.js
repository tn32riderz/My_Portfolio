'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './project-detail.css';

/* ─── Fallback Projects Data for Demo Slugs ─── */
const DEMO_PROJECTS = {
  'levaal-ai': {
    title: 'Levaal AI Platform Redesign',
    company: 'Levaal AI Inc.',
    category: 'Enterprise AI SaaS',
    timelines: '12 Weeks (2024)',
    liveViewUrl: 'https://example.com',
    role: 'Lead Product Designer',
    overview: 'Levaal AI is an enterprise SaaS platform that enables teams to automate workflows through intelligent prompt pipelines. As Lead Product Designer, I redesigned the core workspace interface, simplified high-complexity prompt engineering, and established a scalable design system.',
    serviceProvided: ['UI/UX Design', 'Design System', 'AI Workflows'],
    coverImage: '/assets/images/case-studies/levaal/cover.webp',
    testimonial: {
      stars: 5,
      quote: "Vignesh's design system transformed our user experience and enabled our engineering team to ship new AI features in half the time.",
      name: "Marcus Vance",
      role: "CTO, Levaal AI",
      avatar: "/assets/images/profile.webp"
    },
    images: [
      '/assets/images/case-studies/levaal/01.webp',
      '/assets/images/case-studies/levaal/02.webp',
      '/assets/images/case-studies/levaal/03.webp',
      '/assets/images/case-studies/levaal/04.webp',
      '/assets/images/case-studies/levaal/05.webp'
    ]
  },
  'realla-ai': {
    title: 'Realla Real Estate Mobile App',
    company: 'Realla Tech',
    category: 'Mobile App Design',
    timelines: '6 Weeks (2024)',
    liveViewUrl: 'https://example.com',
    role: 'Product Designer',
    overview: 'Realla is a modern real estate platform connecting buyers, renters, and agents. We focused on building a friction-free mobile search experience with interactive map integration and instant virtual tours.',
    serviceProvided: ['Mobile App Design', 'Wireframing', 'User Testing'],
    coverImage: '/assets/images/case-studies/realla/cover.webp',
    testimonial: {
      stars: 5,
      quote: "Our app conversion rate doubled within 30 days of releasing Vignesh's updated mobile interface.",
      name: "David Sterling",
      role: "VP of Product, Realla",
      avatar: "/assets/images/profile.webp"
    },
    images: [
      '/assets/images/case-studies/realla/cover.webp'
    ]
  },
  'collabkit': {
    title: 'CollabKit Workspace Tools',
    company: 'CollabKit Studio',
    category: 'Workspace Analytics',
    timelines: '8 Weeks (2024)',
    liveViewUrl: 'https://example.com',
    role: 'Lead Product Designer',
    overview: 'CollabKit is an all-in-one team workspace platform designed for real-time multiplayer document collaboration, analytics, and task tracking across global engineering teams.',
    serviceProvided: ['SaaS Design', 'Web App', 'Analytics'],
    coverImage: '/assets/images/case-studies/collabkit/cover.webp',
    testimonial: {
      stars: 5,
      quote: "CollabKit's new design system reduced user fatigue and boosted team active daily usage by 45%.",
      name: "Alex Thorne",
      role: "Founder, CollabKit",
      avatar: "/assets/images/profile.webp"
    },
    images: [
      '/assets/images/case-studies/collabkit/01.webp',
      '/assets/images/case-studies/collabkit/02.webp',
      '/assets/images/case-studies/collabkit/03.webp',
      '/assets/images/case-studies/collabkit/04.webp',
      '/assets/images/case-studies/collabkit/05.webp'
    ]
  },
  'ai-saas-platform-redesign': {
    title: 'AI SaaS Platform Redesign',
    company: 'TechVenture Inc.',
    category: 'UI/UX Design',
    timelines: '8 Weeks (2024)',
    liveViewUrl: 'https://example.com',
    role: 'Senior Product Designer',
    overview: 'TechVenture came to us with a complex SaaS platform that lacked visual hierarchy. We conducted user research and delivered a pixel-perfect design system that reduced user churn by 38%.',
    serviceProvided: ['UI Design', 'UX Research', 'Prototyping'],
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&h=900&q=90',
    testimonial: {
      stars: 5,
      quote: "The interface redesign delivered instant ROI and increased platform retention dramatically.",
      name: "Sarah Jenkins",
      role: "Head of Product, TechVenture",
      avatar: "/assets/images/profile.webp"
    },
    images: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&h=800&q=85',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&h=700&q=85'
    ]
  }
};

/* ─── Related Projects Component ─── */
function RelatedCard({ project }) {
  return (
    <Link href={`/works/${project.slug}`} className="pd-related-card">
      <div className="pd-related-img-wrap">
        <Image
          src={project.coverImage || project.image || '/assets/images/case-studies/levaal/cover.webp'}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="pd-related-img"
        />
      </div>
      <div className="pd-related-info">
        <span className="pd-related-category">{project.category}</span>
        <h4 className="pd-related-card-title">{project.title}</h4>
        {project.company && <p className="pd-related-card-desc">{project.company}</p>}
      </div>
    </Link>
  );
}

export default function ProjectDetail({ project, slug, relatedProjects }) {
  // Extract project data or fallback
  const data = project || DEMO_PROJECTS[slug] || DEMO_PROJECTS['levaal-ai'];

  const images = data.images || (data.contentBlocks 
    ? data.contentBlocks.filter(b => b.type === 'Image').map(b => b.url || b.content)
    : [data.coverImage]);

  const testimonial = data.testimonial || {
    stars: 5,
    quote: "The web infrastructure and interface exceeded all our expectations. Conversion rates jumped immediately after launch.",
    name: "Sarah Jenkins",
    role: "Head of Product",
    avatar: "/assets/images/profile.webp"
  };

  return (
    <div className="pd-page">

      {/* Top Header Navigation */}
      <header className="pd-site-header">
        <Link href="/" className="pd-brand-logo">
          VIGNESH <span>✦</span>
        </Link>
        <Link href="/" className="pd-back-btn">
          ← Back to Portfolio
        </Link>
      </header>

      <main className="pd-case-wrapper">

        {/* Top Badge */}
        <div style={{ textAlign: 'center' }}>
          <span className="pd-case-badge">✦ Project Case Study</span>
        </div>

        {/* 1. MAIN HEADING */}
        <h1 className="pd-main-heading">{data.title}</h1>

        {/* 2. MAIN COVER IMAGE */}
        <div className="pd-cover-container">
          {data.coverImage && (
            <Image
              src={data.coverImage}
              alt={data.title}
              width={1600}
              height={900}
              priority
              className="pd-cover-img"
            />
          )}
        </div>

        {/* 3. 2-COLUMN SHOWCASE LAYOUT (LEFT STICKY DETAILS + RIGHT SCROLL SHOWCASE) */}
        <div className="pd-showcase-grid">

          {/* LEFT STICKY COLUMN */}
          <aside className="pd-left-sticky-col">
            
            {/* Project Details Card */}
            <div className="pd-sticky-card">
              <div className="pd-card-title">✦ Project Details</div>
              <div className="pd-detail-list">
                {data.company && (
                  <div className="pd-detail-row">
                    <span className="pd-detail-label">Client</span>
                    <span className="pd-detail-value">{data.company}</span>
                  </div>
                )}
                {data.role && (
                  <div className="pd-detail-row">
                    <span className="pd-detail-label">Role</span>
                    <span className="pd-detail-value">{data.role}</span>
                  </div>
                )}
                {data.category && (
                  <div className="pd-detail-row">
                    <span className="pd-detail-label">Category</span>
                    <span className="pd-detail-value">{data.category}</span>
                  </div>
                )}
                {data.timelines && (
                  <div className="pd-detail-row">
                    <span className="pd-detail-label">Timeline</span>
                    <span className="pd-detail-value">{data.timelines}</span>
                  </div>
                )}
                {data.serviceProvided && data.serviceProvided.length > 0 && (
                  <div className="pd-detail-row">
                    <span className="pd-detail-label">Services</span>
                    <span className="pd-detail-value">{Array.isArray(data.serviceProvided) ? data.serviceProvided.join(', ') : data.serviceProvided}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Project Overview Card */}
            <div className="pd-sticky-card">
              <div className="pd-card-title">✦ Overview</div>
              <p className="pd-overview-text">
                {data.overview || data.description || "Comprehensive end-to-end design and software development engineered for user delight and high-volume scalability."}
              </p>
            </div>

            {/* Client Testimonial Card */}
            <div className="pd-testimonial-card">
              <div className="pd-stars">{'★'.repeat(testimonial.stars || 5)}</div>
              <p className="pd-testimonial-quote">
                "{testimonial.quote}"
              </p>
              <div className="pd-client-meta">
                {testimonial.avatar && (
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={42}
                    height={42}
                    className="pd-client-avatar"
                  />
                )}
                <div>
                  <div className="pd-client-name">{testimonial.name}</div>
                  <div className="pd-client-role">{testimonial.role}</div>
                </div>
              </div>
              {data.liveViewUrl && (
                <a href={data.liveViewUrl} target="_blank" rel="noopener noreferrer" className="pd-live-preview-btn">
                  Live Preview →
                </a>
              )}
            </div>

          </aside>

          {/* RIGHT COLUMN (LONG SCROLL SHOWCASE IMAGES) */}
          <section className="pd-right-showcase-col">
            <div className="pd-image-container">
              {images.map((imgSrc, idx) => (
                <div key={idx} className="pd-showcase-img-wrap">
                  <Image
                    src={imgSrc}
                    alt={`${data.title} Showcase ${idx + 1}`}
                    width={1400}
                    height={900}
                    className="pd-showcase-img"
                  />
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* 4. YOU MAY ALSO LIKE (RELATED PROJECTS) */}
        <section className="pd-related-section">
          <div className="pd-section-title-wrap">
            <span style={{ color: '#4B4EFC' }}>✦</span>
            <h2 className="pd-section-title">You May Also Like</h2>
          </div>
          <div className="pd-related-grid">
            {(relatedProjects && relatedProjects.length > 0) ? (
              relatedProjects.map(rp => (
                <RelatedCard key={rp.id || rp.slug} project={rp} />
              ))
            ) : (
              <>
                <RelatedCard project={DEMO_PROJECTS['realla-ai']} />
                <RelatedCard project={DEMO_PROJECTS['collabkit']} />
              </>
            )}
          </div>
        </section>

        {/* 5. CONTACT CTA SECTION */}
        <section className="pd-contact-cta-section">
          <h2 className="pd-cta-heading">Let's build something extraordinary together.</h2>
          <p className="pd-cta-sub">Have a project in mind? Reach out today and let me help you build scalable digital experiences.</p>
          <Link href="/#contact" className="pd-cta-btn-gradient">
            Start a Project →
          </Link>
        </section>

        {/* 6. FOOTER SECTION */}
        <footer className="pd-case-footer">
          <div className="pd-footer-content">
            <div className="pd-footer-brand">
              <h3>VIGNESH</h3>
              <p>Senior Product Designer & Design System Specialist</p>
            </div>
            <nav className="pd-footer-nav">
              <Link href="/">Home</Link>
              <Link href="/#about-me">About</Link>
              <Link href="/#experience">Experience</Link>
              <Link href="/#projects">Projects</Link>
              <Link href="/#contact">Contact</Link>
            </nav>
          </div>
          <div className="pd-footer-bottom">
            <p>© 2026 Vignesh. All rights reserved.</p>
          </div>
        </footer>

      </main>

    </div>
  );
}
