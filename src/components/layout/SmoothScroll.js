'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/**
 * Page-wide inertial scrolling (Lenis), driven by GSAP's ticker so ScrollTrigger and the framer-motion
 * scroll effects all read the same smoothed position. Mounted on the home page only and torn down on leave.
 * Skipped for people who prefer reduced motion.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true, anchors: true });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Late-loading fonts and images move the pinned sections; measure once everything has arrived.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);

    return () => {
      window.removeEventListener('load', refresh);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}
