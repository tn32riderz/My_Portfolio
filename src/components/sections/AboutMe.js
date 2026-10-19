'use client';

import React, { useRef } from 'react';
import { motion, useTransform, useScroll } from 'framer-motion';
import Button from '@/components/ui/Button';
import { getAboutStatement, profile } from '@/data/profile';
import './AboutMe.css';

/*
 * Word component — opacity is driven directly by scroll `progress`, in both directions.
 */
function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0, 1]);
  return (
    <span className="about-word-wrapper">
      <span className="about-word-bg">{children}</span>
      <motion.span style={{ opacity }} className="about-word-fg">
        {children}
      </motion.span>
    </span>
  );
}

const SCROLL_PX_PER_WORD = 55;
const REVEAL_RATIO        = 0.82;

export default function AboutMe({ careerStart }) {
  const sectionRef = useRef(null);

  const statement = getAboutStatement(careerStart);
  const words     = statement.split(' ');

  // Section height adapts automatically to word count
  const extraScrollPx = Math.ceil(words.length * SCROLL_PX_PER_WORD / REVEAL_RATIO);
  const sectionHeight  = `calc(100vh + ${extraScrollPx}px)`;

  // Fully scroll-linked: progress runs 0 → 1 while the sticky panel is pinned, and back
  // down again when scrolling up, so the reveal replays on every pass.
  const { scrollYProgress: progress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section
      className="about-section"
      id="about-me"
      ref={sectionRef}
      style={{ height: sectionHeight }}
    >
      <div className="about-sticky-wrapper">
        <div className="about-container">

          {/* Left: label */}
          <div className="about-left">
            <div className="about-title-wrapper">
              <span className="about-sparkle">✦</span>
              <span className="about-title-text">About Me</span>
              <div className="about-line-arrow">
                <div className="about-line"></div>
                <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
                  <path d="M1 9L5 5L1 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Right: statement + CTA */}
          <div className="about-right">
            <div className="about-statement">
              {words.map((word, i) => {
                const start = (i / words.length) * REVEAL_RATIO;
                const end   = ((i + 1) / words.length) * REVEAL_RATIO;
                return (
                  <Word key={i} progress={progress} range={[start, end]}>
                    {word}
                  </Word>
                );
              })}
            </div>

            <div className="about-cta-wrapper">
              <Button text="View Resume" href={profile.resumeHref} arrowDirection="down" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
