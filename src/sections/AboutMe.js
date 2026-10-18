'use client';

import React, { useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useScroll } from 'framer-motion';
import Button from '../components/Button';
import './AboutMe.css';

/*
 * Word component — simple bidirectional opacity driven by `progress`.
 * The one-way ratchet is now applied at the source (progress MotionValue),
 * so this component doesn't need to do any max-tracking itself.
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

export default function AboutMe() {
  const sectionRef = useRef(null);

  const statement = "precision. I don't just build sites that look expensive; I build systems designed to scale your business and dominate your niche.";
  const words     = statement.split(' ');

  // Section height adapts automatically to word count
  const extraScrollPx = Math.ceil(words.length * SCROLL_PX_PER_WORD / REVEAL_RATIO);
  const sectionHeight  = `calc(100vh + ${extraScrollPx}px)`;

  /*
   * ─── ONE-WAY RATCHET AT THE SOURCE ─────────────────────────────────
   *
   * `progress` is a MotionValue that goes 0 → 1 as you scroll down through
   * the section.  We apply the ratchet HERE — `maxSeen` tracks the highest
   * progress value ever set.  If the user scrolls back UP, `p` would be
   * smaller than `maxSeen.current`, so we skip `progress.set()` entirely.
   * The MotionValue doesn't change → all word opacities stay frozen at
   * their current (white) values.
   *
   * This is more reliable than a per-word ratchet because it is a single
   * control point and is not affected by React re-renders.
   */
  const progress   = useMotionValue(0);
  const maxSeen    = useRef(0);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (y) => {
      const el = sectionRef.current;
      if (!el) return;

      const sectionTop     = el.offsetTop;
      const relativeScroll = y - sectionTop;
      const p = Math.min(1, Math.max(0, relativeScroll / extraScrollPx));

      // ← ONLY move forward, never backward
      if (p > maxSeen.current) {
        maxSeen.current = p;
        progress.set(p);
      }
    });
    return unsubscribe;
  }, [scrollY, extraScrollPx, progress]);

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
              <Button text="View Resume" href="#resume" arrowDirection="down" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
