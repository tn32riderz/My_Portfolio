'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './Services.css';

const defaultServices = [
  {
    id: 1,
    image: '/services/ui-ux.png',
    title: 'UI/UX Design',
    description: "Psychology-driven layouts that capture attention and guide the user's journey",
    tags: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
    link: '#contact',
  },
  {
    id: 2,
    image: '/services/web-dev.png',
    title: 'Web Development',
    description: 'Robust, lightning-fast websites built with clean code and modern frameworks',
    tags: ['Next.js / React', 'Tailwind CSS', 'Node.js', 'API Integration'],
    link: '#contact',
  },
  {
    id: 3,
    image: '/services/brand-identity.png',
    title: 'Brand Identity',
    description: 'Futuristic brand visual systems, logos, and guidelines that stand out',
    tags: ['Logo Design', 'Guidelines', 'Typography', 'Brand Assets'],
    link: '#contact',
  },
  {
    id: 4,
    image: '/services/ai-integration.png',
    title: 'AI Product Design',
    description: 'Intelligent AI interfaces and user experiences that solve complex problems',
    tags: ['LLM Orchestration', 'Prompt Engineering', 'AI Agents', 'Chat UI'],
    link: '#contact',
  },
];

export default function Services({ services: dbServices }) {
  const displayServices = dbServices && dbServices.length > 0
    ? dbServices.map((s, idx) => ({
        id: s.id,
        image: s.icon === 'Globe' ? '/services/web-dev.png' : 
               s.icon === 'Figma' ? '/services/ui-ux.png' :
               s.icon === 'PenTool' ? '/services/brand-identity.png' :
               s.icon === 'Share2' ? '/services/ai-integration.png' :
               '/services/ai-integration.png',
        title: s.title,
        description: s.description,
        tags: s.points || [],
        link: '#contact'
      }))
    : defaultServices;

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null); // Used for mobile tap toggle
  const [headerVisible, setHeaderVisible] = useState(false);
  const [visibleRows, setVisibleRows] = useState({});
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });
  const headerRef = useRef(null);
  const rowsRef = useRef([]);

  useEffect(() => {
    // Header entrance animation
    const header = headerRef.current;
    if (header) {
      const headerObserver = new IntersectionObserver(
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
    const currentRows = rowsRef.current;
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

    currentRows.forEach((row) => {
      if (row) rowObserver.observe(row);
    });

    return () => {
      if (header) rowObserver.disconnect();
    };
  }, []);

  const handleMouseEnter = (e, index) => {
    setHoveredIndex(index);
    const rect = e.currentTarget.getBoundingClientRect();
    setMouseCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMouseCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const handleRowClick = (index) => {
    // Toggle active index on touch devices
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

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
          {displayServices.map((service, index) => {
            const isHovered = hoveredIndex === index;
            const isActive = activeIndex === index;
            // Show image if hovered (desktop) or active (mobile tap)
            const showImage = isHovered || isActive;
            const isRowVisible = !!visibleRows[index];
            const useMouseCoords = isHovered && hoveredIndex === index;

            return (
              <Link
                key={service.id}
                href={service.link}
                ref={(el) => (rowsRef.current[index] = el)}
                data-index={index}
                className={`services-row ${isRowVisible ? 'services-row--visible' : ''} ${showImage ? 'is-hovered' : ''}`}
                style={{ '--row-delay': `${index * 0.12}s` }}
                onMouseEnter={(e) => handleMouseEnter(e, index)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleRowClick(index)}
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
                  
                  {/* Image Container with 0 default opacity */}
                  <div className="services-image-container">
                    <Image
                      src={service.image}
                      alt={service.title}
                      width={380}
                      height={214}
                      className="services-image"
                      priority={index === 0}
                    />
                  </div>
                </div>

                {/* Text Content (Middle Column) */}
                <div className="services-text-content">
                  <h3 className="services-title">{service.title}</h3>
                  <p className="services-description">{service.description}</p>
                  
                  {/* Sub-services Tag Pills */}
                  <div className="services-tags-container">
                    {service.tags.map((tag) => (
                      <span key={tag} className="services-tag-pill">{tag}</span>
                    ))}
                  </div>
                </div>

                {/* Absolute-positioned Snap Arrow Button */}
                <div
                  className="services-arrow-btn"
                  aria-label={`Inquire about ${service.title}`}
                  style={
                    useMouseCoords
                      ? {
                          left: `${mouseCoords.x}px`,
                          top: `${mouseCoords.y}px`,
                          transform: 'translate(-50%, -50%)',
                        }
                      : {}
                  }
                >
                  <div className="services-btn-glow" />
                  <svg width="12" height="12" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.188888 8.3365C-0.0629625 8.58833 -0.0629625 8.99664 0.188888 9.24855C0.440738 9.50039 0.849068 9.50039 1.10092 9.24855L0.644903 8.79252L0.188888 8.3365ZM9.43743 0.644904C9.43743 0.288733 9.14867 -8.49624e-08 8.79253 1.69855e-07L2.98838 0C2.63221 2.71746e-07 2.34348 0.288733 2.34348 0.644904C2.34348 1.00107 2.63221 1.28981 2.98838 1.28981H8.14762V6.44903C8.14762 6.8052 8.43638 7.09394 8.79253 7.09394C9.14867 7.09394 9.43743 6.8052 9.43743 6.44903V0.644904ZM0.644903 8.79252L1.10092 9.24855L9.24855 1.10092L8.79253 0.644903L8.3365 0.188888L0.188888 8.3365L0.644903 8.79252Z" fill="currentColor" />
                  </svg>
                </div>

              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
