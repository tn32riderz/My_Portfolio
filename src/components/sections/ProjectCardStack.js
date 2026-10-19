'use client';

import { Fragment, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Sticky card stack: every card pins to the top of the screen, and as the next card slides over it,
 * the one underneath scales down, tilts and darkens, scrubbed by the (Lenis-smoothed) scroll position.
 * Each card is followed by a spacer (--stack-hold in Projects.css), so it rests fully visible for a
 * stretch of scrolling before the next card begins to slide over it.
 */
export default function ProjectCardStack({ cards }) {
  const rootRef = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    // Smooth scrolling itself is page-wide (components/layout/SmoothScroll). Users who prefer reduced motion
    // still get the sticky stack, just without scaling or tilting.
    // Gentler tilt and shrink on small screens so cards never poke out of the viewport.
    mm.add({ wide: '(min-width: 768px)', narrow: '(max-width: 767px)' }, (context) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const { wide } = context.conditions;
      const tilt = wide ? 4 : 2.5;
      const shrink = wide ? 0.9 : 0.93;

      const items = gsap.utils.toArray('.stack-card');
      const holds = gsap.utils.toArray('.stack-hold');
      items.forEach((card, i) => {
        if (i === items.length - 1) return; // the last card has nothing covering it
        // The hold spacer ends exactly where the next card begins. Unlike the sticky cards, it never moves,
        // so ScrollTrigger measures it reliably (even if the page is refreshed mid-scroll).
        const scrollTrigger = { trigger: holds[i], start: 'bottom bottom', end: 'bottom top', scrub: true };
        gsap.to(card.querySelector('.stack-card__inner'), {
          scale: shrink, rotate: i % 2 === 0 ? -tilt : tilt, ease: 'none', scrollTrigger,
        });
        gsap.to(card.querySelector('.stack-card__shade'), { opacity: 0.6, ease: 'none', scrollTrigger });
      });
    });

    return () => mm.revert();
  }, { scope: rootRef, dependencies: [cards.length] });

  return (
    <div className="stack" ref={rootRef}>
      {cards.map((card, i) => (
        <Fragment key={card.id}>
        <article className="stack-card" style={{ zIndex: i + 1 }}>
          <Link href={`/works/${card.slug}`} className="stack-card__inner" aria-label={`View project: ${card.title}`}>
            <Image src={card.image} alt="" fill className="stack-card__img" sizes="(max-width: 1200px) 100vw, 1180px" />
            <span className="stack-card__scrim" aria-hidden="true" />
            <span className="stack-card__shade" aria-hidden="true" />
            <span className="stack-card__count">{String(i + 1).padStart(2, '0')} / {String(cards.length).padStart(2, '0')}</span>
            <span className="stack-card__caption">
              <h3 className="stack-card__title">{card.title}</h3>
              <p className="stack-card__desc">{card.description}</p>
              <span className="stack-card__row">
                <span className="stack-card__tags">
                  {card.tags.slice(0, 3).map((tag) => <span key={tag} className="stack-card__tag">{tag}</span>)}
                </span>
                <span className="stack-card__cta">View case study
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </span>
            </span>
          </Link>
        </article>
        {/* Hold: extra scroll distance during which this card stays pinned and fully visible. */}
        <div className="stack-hold" aria-hidden="true" />
        </Fragment>
      ))}
    </div>
  );
}
