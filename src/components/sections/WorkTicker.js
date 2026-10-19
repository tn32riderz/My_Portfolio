'use client';

import React from 'react';
import './WorkTicker.css';

function StarIcon() {
  return (
    <svg
      className="workticker-star"
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M39.0004 0.740528C39.0654 0.526302 39.1976 0.338668 39.3774 0.205326C39.5574 0.0719842 39.7752 0 39.9992 0C40.223 0 40.441 0.0719842 40.6208 0.205326C40.8008 0.338668 40.933 0.526302 40.998 0.740528L44.7846 13.4374C46.321 18.5904 49.1164 23.2796 52.9186 27.082C56.721 30.8842 61.4104 33.6798 66.5636 35.2164L79.2608 39.0028C79.4748 39.068 79.662 39.2002 79.795 39.38C79.9282 39.5598 80 39.7774 80 40.0012C80 40.2248 79.9282 40.4424 79.795 40.6222C79.662 40.802 79.4748 40.9342 79.2608 40.9994L66.5636 44.7858C61.4106 46.3224 56.7214 49.118 52.9194 52.92C49.1172 56.7222 46.3218 61.4112 44.7854 66.564L40.998 79.2608C40.9328 79.4748 40.8004 79.662 40.6208 79.7952C40.441 79.9282 40.2232 80 39.9996 80C39.776 80 39.5582 79.9282 39.3784 79.7952C39.1988 79.662 39.0664 79.4748 39.0012 79.2608L35.2146 66.564C33.678 61.4112 30.8822 56.7222 27.0798 52.9202C23.2774 49.1182 18.5879 46.323 13.4348 44.7868L0.739172 40.9986C0.525266 40.9334 0.33798 40.8012 0.204904 40.6214C0.0718284 40.4416 0 40.224 0 40.0002C0 39.7766 0.0718284 39.559 0.204904 39.3792C0.33798 39.1994 0.525266 39.0672 0.739172 39.002L13.4356 35.2154C18.5889 33.6792 23.2784 30.8836 27.081 27.0812C30.8834 23.279 33.679 18.5896 35.2154 13.4365L39.0004 0.740528Z"
        fill="url(#workticker-star-grad)"
      />
      <defs>
        <radialGradient
          id="workticker-star-grad"
          cx="0" cy="0" r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(40) rotate(90) scale(80 57.1223)"
        >
          <stop stopColor="#F5F5FF" />
          <stop offset="0.710673" stopColor="#4B4EFC" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/* One repeating unit: star  +  text */
function TickerUnit() {
  return (
    <span className="workticker-unit">
      <StarIcon />
      <span className="workticker-text">LET&apos;S WORK TOGETHER</span>
    </span>
  );
}

const REPEAT = 8; // enough copies to fill any screen

export default function WorkTicker() {
  return (
    <section className="workticker-section" aria-label="Let's Work Together">
      <div className="workticker-track">
        {/* Primary strip */}
        <div className="workticker-strip" aria-hidden="false">
          {Array.from({ length: REPEAT }).map((_, i) => (
            <TickerUnit key={`a-${i}`} />
          ))}
        </div>
        {/* Duplicate strip for seamless loop */}
        <div className="workticker-strip" aria-hidden="true">
          {Array.from({ length: REPEAT }).map((_, i) => (
            <TickerUnit key={`b-${i}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
