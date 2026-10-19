'use client';

import React, { memo, useCallback, useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './Services.css';

const defaultServices = [
  {
    id: 1,
    image: '/assets/images/services/ui-ux.png',
    title: 'UI/UX Design',
    description: "Psychology-driven layouts that capture attention and guide the user's journey",
    tags: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
    link: '#contact',
  },
  {
    id: 2,
    image: '/assets/images/services/web-dev.png',
    title: 'Web Development',
    description: 'Robust, lightning-fast websites built with clean code and modern frameworks',
    tags: ['Next.js / React', 'Tailwind CSS', 'Node.js', 'API Integration'],
    link: '#contact',
  },
  {
    id: 3,
    image: '/assets/images/services/brand-identity.png',
    title: 'Brand Identity',
    description: 'Futuristic brand visual systems, logos, and guidelines that stand out',
    tags: ['Logo Design', 'Guidelines', 'Typography', 'Brand Assets'],
    link: '#contact',
  },
  {
    id: 4,
    image: '/assets/images/services/ai-integration.png',
    title: 'AI Product Design',
    description: 'Intelligent AI interfaces and user experiences that solve complex problems',
    tags: ['LLM Orchestration', 'Prompt Engineering', 'AI Agents', 'Chat UI'],
    link: '#contact',
  },
];

const BTN = 25; // half the 50px arrow button

/**
 * One service row. The round arrow button follows the pointer, but that is done with refs and a small
 * requestAnimationFrame loop that writes a transform straight to the element: no React state changes
 * per mouse move (the old version re-rendered the whole section on every pixel, which was the lag).
 */
const ServiceRow = memo(function ServiceRow({ service, index, visible, active, onToggle, registerRef }) {
  const rowEl = useRef(null);
  const btnEl = useRef(null);
  const raf = useRef(0);
  const pos = useRef({ x: 0, y: 0 });
  const goal = useRef({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  /* where the button rests: vertically centred at the right edge of the row */
  const home = () => ({ x: (rowEl.current?.clientWidth ?? 0) - BTN, y: (rowEl.current?.clientHeight ?? 0) / 2 });
  const paint = () => {
    if (btnEl.current) btnEl.current.style.transform = `translate3d(${pos.current.x - BTN}px, ${pos.current.y - BTN}px, 0)`;
  };
  const step = () => {
    const dx = goal.current.x - pos.current.x;
    const dy = goal.current.y - pos.current.y;
    if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
      pos.current = { ...goal.current };
      paint();
      raf.current = 0;
      return;
    }
    // ease towards the pointer: quick enough to feel attached, soft enough to feel weighty
    pos.current = { x: pos.current.x + dx * 0.28, y: pos.current.y + dy * 0.28 };
    paint();
    raf.current = requestAnimationFrame(step);
  };
  const run = () => { if (!raf.current) raf.current = requestAnimationFrame(step); };

  useEffect(() => {
    const row = rowEl.current;
    const rest = () => { if (!raf.current) { goal.current = home(); pos.current = { ...goal.current }; paint(); } };
    btnEl.current?.classList.add('is-tracked');
    rest();
    const ro = new ResizeObserver(rest); // keep the resting position right after layout changes
    ro.observe(row);
    return () => { ro.disconnect(); cancelAnimationFrame(raf.current); };
  }, []);

  const local = (e) => {
    const r = rowEl.current.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  return (
    <Link
      href={service.link}
      ref={(el) => { rowEl.current = el; registerRef(index, el); }}
      data-index={index}
      className={`services-row ${visible ? 'services-row--visible' : ''} ${hovered || active ? 'is-hovered' : ''}`}
      style={{ '--row-delay': `${index * 0.12}s` }}
      onPointerEnter={(e) => {
        if (e.pointerType === 'touch') return;
        goal.current = local(e);
        pos.current = { ...home() };   // glide in from the resting spot
        paint();
        setHovered(true);
        run();
      }}
      onPointerMove={(e) => { if (e.pointerType === 'touch') return; goal.current = local(e); run(); }}
      onPointerLeave={(e) => { if (e.pointerType === 'touch') return; setHovered(false); goal.current = home(); run(); }}
      onClick={onToggle}
    >
      {/* Visual Area (Left Column: Index, Line, and Preview Image) */}
      <div className="services-visual-area">
        <div className="services-number-line">
          <span className="services-index">{String(index + 1).padStart(2, '0')}</span>
          <div className="services-arrow-line">
            <div className="arrow-line-shaft" />
            <svg className="arrow-line-head" width="6" height="10" viewBox="0 0 6 10" fill="none">
                        <path d="M1 1L5 5L1 9" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
          </div>
        </div>

        <div className="services-image-container">
          <Image src={service.image} alt={service.title} width={380} height={214} className="services-image" priority={index === 0} />
        </div>
      </div>

      {/* Text Content (Middle Column) */}
      <div className="services-text-content">
        <h3 className="services-title">{service.title}</h3>
        <p className="services-description">{service.description}</p>
        <div className="services-tags-container">
          {service.tags.map((tag) => <span key={tag} className="services-tag-pill">{tag}</span>)}
        </div>
      </div>

      {/* Round arrow button that follows the pointer (position is written by the rAF loop above) */}
      <div className="services-arrow-btn" ref={btnEl} aria-label={`Inquire about ${service.title}`}>
        <div className="services-btn-glow" />
        <svg width="12" height="12" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.188888 8.3365C-0.0629625 8.58833 -0.0629625 8.99664 0.188888 9.24855C0.440738 9.50039 0.849068 9.50039 1.10092 9.24855L0.644903 8.79252L0.188888 8.3365ZM9.43743 0.644904C9.43743 0.288733 9.14867 -8.49624e-08 8.79253 1.69855e-07L2.98838 0C2.63221 2.71746e-07 2.34348 0.288733 2.34348 0.644904C2.34348 1.00107 2.63221 1.28981 2.98838 1.28981H8.14762V6.44903C8.14762 6.8052 8.43638 7.09394 8.79253 7.09394C9.14867 7.09394 9.43743 6.8052 9.43743 6.44903V0.644904ZM0.644903 8.79252L1.10092 9.24855L9.24855 1.10092L8.79253 0.644903L8.3365 0.188888L0.188888 8.3365L0.644903 8.79252Z" fill="currentColor" />
                  </svg>
      </div>
    </Link>
  );
});

export default function Services({ services: dbServices }) {
  const displayServices = dbServices && dbServices.length > 0
    ? dbServices.map((s, idx) => ({
        id: s.id,
        image: s.image || (s.icon === 'Globe' ? '/assets/images/services/web-dev.png' : 
               s.icon === 'Figma' ? '/assets/images/services/ui-ux.png' :
               s.icon === 'PenTool' ? '/assets/images/services/brand-identity.png' :
               s.icon === 'Share2' ? '/assets/images/services/ai-integration.png' :
               '/assets/images/services/ai-integration.png'),
        title: s.title,
        description: s.description,
        tags: s.points || [],
        link: '#contact'
      }))
    : defaultServices;

  const [activeIndex, setActiveIndex] = useState(null); // mobile tap toggle
  const [headerVisible, setHeaderVisible] = useState(false);
  const [visibleRows, setVisibleRows] = useState({});
  const headerRef = useRef(null);
  const rowsRef = useRef([]);

  useEffect(() => {
    // Header entrance animation
    const header = headerRef.current;
    let headerObserver;
    if (header) {
      headerObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setHeaderVisible(true);
            headerObserver.unobserve(header);
          }
        },
        { threshold: 0.1 }
      );
      headerObserver.observe(header);
    }

    // Rows entrance animation
    const rowObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = entry.target.getAttribute('data-index');
            setVisibleRows((prev) => ({ ...prev, [index]: true }));
            rowObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    rowsRef.current.forEach((row) => { if (row) rowObserver.observe(row); });

    return () => { headerObserver?.disconnect(); rowObserver.disconnect(); };
  }, []);

  const registerRef = useCallback((index, el) => { rowsRef.current[index] = el; }, []);
  const toggleActive = useCallback((index) => setActiveIndex((cur) => (cur === index ? null : index)), []);

  return (
    <section className="services-section" id="services">
      <div className="services-container">

        {/* Section Header */}
        <div className={`services-header ${headerVisible ? 'services-header--visible' : ''}`} ref={headerRef}>
          <div className="services-label">
            <span className="services-sparkle">✦</span>
            <span className="services-label-text">Our Expertise</span>
          </div>
          <h2 className="services-heading">High-Impact Services that Drive Results</h2>
        </div>

        {/* Services List */}
        <div className="services-list">
          {displayServices.map((service, index) => (
            <ServiceRow key={service.id} service={service} index={index} visible={!!visibleRows[index]}
              active={activeIndex === index} onToggle={() => toggleActive(index)} registerRef={registerRef} />
          ))}
        </div>

      </div>
    </section>
  );
}
