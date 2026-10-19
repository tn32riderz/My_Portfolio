'use client';

import React, { useEffect, useRef } from 'react';
import { yearsOfExperience } from '@/data/profile';
import { motion, useReducedMotion } from 'framer-motion';
import { Award, GraduationCap } from 'lucide-react';
import { pointerGlow } from '@/lib/pointerGlow';
import ExperienceTimeline from './ExperienceTimeline';
import './Experience.css';

/** Education / certification entry: same glass card, gradient edge and cursor spotlight as the experience cards. */
function Card({ item, index, Icon }) {
  const reduce = useReducedMotion();
  return (
    <motion.article className="xp-card xp-card--edu" onPointerMove={pointerGlow}
      initial={reduce ? false : { opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}>
      <header className="xp-card__head">
        <span className="xp-logo" aria-hidden="true"><Icon size={24} /></span>
        <div className="xp-card__title">
          <h3 className="xp-company">{item.role}</h3>
          <p className="xp-meta">{[item.company, item.location].filter(Boolean).join(' · ')}</p>
        </div>
      </header>
      {item.period && <span className="xp-pill xp-pill--period">{item.period}</span>}
      {item.description && <p className="xp-role__summary">{item.description}</p>}
    </motion.article>
  );
}

export default function Experience({ experiences = [], education = [], careerStart }) {
  const rootRef = useRef(null);
  // Degrees on the left, certificates on the right (entries without a type count as education).
  const degrees = education.filter((e) => e.kind !== 'Certification');
  const certifications = education.filter((e) => e.kind === 'Certification');

  // Fade each header/card in the first time it scrolls into view.
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add('experience-header--visible');
        observer.unobserve(el);
      });
    }, { threshold: 0.1 });
    rootRef.current?.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="experience-section" id="experience" ref={rootRef}>
      <div className="experience-container">
        <div className="experience-header" data-reveal>
          <div className="experience-label">
            <span className="experience-sparkle">✦</span>
            <span className="experience-label-text">Work Experience</span>
          </div>
          <h2 className="experience-heading" suppressHydrationWarning>
            {yearsOfExperience(careerStart)} years shipping AI, SaaS and enterprise products
          </h2>
        </div>
        <ExperienceTimeline companies={experiences} />

        {(degrees.length > 0 || certifications.length > 0) && (
          <div className="experience-duo experience-header--sub">
            {[['Education', degrees, GraduationCap], ['Certifications', certifications, Award]].map(([title, items, Icon]) => items.length > 0 && (
              <div key={title} className="experience-col">
                <div className="experience-header experience-header--col" data-reveal>
                  <div className="experience-label">
                    <span className="experience-sparkle">✦</span>
                    <span className="experience-label-text">{title}</span>
                  </div>
                </div>
                <div className="experience-list">
                  {items.map((item, i) => <Card key={item.id} item={item} index={i} Icon={Icon} />)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
