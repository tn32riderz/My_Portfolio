'use client';

import React, { useEffect, useRef } from 'react';
import './Experience.css';

const defaultExperiences = [
  {
    id: 1,
    role: "Senior Product Designer & Design System Lead",
    company: "Levaal AI",
    period: "2023 — Present",
    location: "San Francisco, CA (Remote)",
    description: "Architected end-to-end design systems and enterprise SaaS product interfaces for generative AI platforms. Scaled user workflows and reduced component tech debt by 45%.",
    skills: ["Design Systems", "Product Strategy", "React", "User Research"]
  },
  {
    id: 2,
    role: "Lead UI/UX Designer",
    company: "Realla Technologies",
    period: "2021 — 2023",
    location: "New York, NY",
    description: "Spearheaded mobile and web platform redesigns for next-generation prop-tech solutions. Boosted user engagement metrics by 38% through streamlined navigation and micro-interactions.",
    skills: ["UI/UX Design", "Mobile First", "Wireframing", "Figma"]
  },
  {
    id: 3,
    role: "Product Designer & Frontend Engineer",
    company: "CollabKit Studio",
    period: "2019 — 2021",
    location: "Austin, TX",
    description: "Designed and built collaborative web tools and web application prototypes for client ventures across fintech, healthtech, and consumer software.",
    skills: ["Frontend Dev", "Prototyping", "Visual Identity", "Webflow"]
  }
];

export default function Experience({ experience }) {
  const experiences = (experience && experience.length > 0) ? experience : defaultExperiences;
  const headerRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const header = headerRef.current;
    if (header) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            header.classList.add('experience-header--visible');
            observer.unobserve(header);
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(header);
    }

    cardRefs.current.forEach((card) => {
      if (!card) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            card.classList.add('experience-card--visible');
            observer.unobserve(card);
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(card);
    });
  }, []);

  return (
    <section className="experience-section" id="experience">
      <div className="experience-container">
        <div className="experience-header" ref={headerRef}>
          <div className="experience-label">
            <span className="experience-sparkle">✦</span>
            <span className="experience-label-text">Work Experience</span>
          </div>
          <h2 className="experience-heading">Career Journey & Key Milestones</h2>
        </div>

        <div className="experience-list">
          {experiences.map((exp, index) => (
            <div
              key={exp.id || index}
              className="experience-card"
              ref={(el) => (cardRefs.current[index] = el)}
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <div className="experience-meta">
                <span className="experience-period">{exp.period}</span>
                <span className="experience-company">{exp.company}</span>
                {exp.location && <span className="experience-location">{exp.location}</span>}
              </div>
              <div className="experience-details">
                <h3 className="experience-role">{exp.role}</h3>
                <p className="experience-description">{exp.description}</p>
                {exp.skills && exp.skills.length > 0 && (
                  <div className="experience-skills">
                    {exp.skills.map((skill, idx) => (
                      <span key={idx} className="experience-skill-tag">{skill}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
