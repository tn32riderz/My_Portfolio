'use client';

import React from 'react';
import './Testimonials.css';

/* ─── Sparkle label icon ─── */
function SparkleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd" clipRule="evenodd"
        d="M6.82506 0.129592C6.83644 0.0921028 6.85958 0.0592669 6.89105 0.0359321C6.92253 0.0125972 6.96067 0 6.99985 0C7.03903 0 7.07718 0.0125972 7.10865 0.0359321C7.14013 0.0592669 7.16326 0.0921028 7.17465 0.129592L7.83729 2.35154C8.10616 3.25331 8.59537 4.07394 9.26077 4.73934C9.92617 5.40474 10.7468 5.89397 11.6486 6.16286L13.8706 6.82548C13.9081 6.8369 13.9409 6.86005 13.9641 6.8915C13.9874 6.92296 14 6.96106 14 7.0002C14 7.03933 13.9874 7.07743 13.9641 7.10889C13.9409 7.14034 13.9081 7.16349 13.8706 7.17491L11.6486 7.83753C10.7469 8.10643 9.92626 8.59564 9.26089 9.26101C8.59551 9.92639 8.10631 10.747 7.83744 11.6487L7.17465 13.8706C7.16322 13.9081 7.14008 13.9409 7.10862 13.9641C7.07717 13.9874 7.03906 14 6.99993 14C6.96079 14 6.92268 13.9874 6.89123 13.9641C6.85977 13.9409 6.83663 13.9081 6.8252 13.8706L6.16256 11.6487C5.89364 10.747 5.40438 9.92639 4.73896 9.26104C4.07353 8.59569 3.25288 8.10652 2.35109 7.83768L0.129355 7.17476C0.0919215 7.16334 0.0591464 7.1402 0.0358582 7.10874C0.01257 7.07729 0 7.03918 0 7.00005C0 6.96091 0.01257 6.92281 0.0358582 6.89135C0.0591464 6.8599 0.0919215 6.83676 0.129355 6.82533L2.35124 6.16271C3.25307 5.89384 4.07374 5.40463 4.73916 4.73922C5.40459 4.07382 5.89383 3.25318 6.1627 2.35139L6.82506 0.129592Z"
        fill="url(#testi-sparkle)"
      />
      <defs>
        <radialGradient id="testi-sparkle" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(7) rotate(90) scale(14 9.9964)">
          <stop stopColor="#F5F5FF" />
          <stop offset="0.710673" stopColor="#4B4EFC" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/* ─── 5 gold stars ─── */
function Stars() {
  return (
    <div className="testi-stars">
      {[0,1,2,3,4].map(i => (
        <svg key={i} width="17" height="16" viewBox="0 0 20 18" fill="none">
          <path d="M8.51995 0.365846C8.68191 -0.114137 9.36079 -0.114136 9.52275 0.365846L11.3399 5.75115C11.4117 5.96421 11.6104 6.10857 11.8353 6.1111L17.5185 6.17511C18.025 6.18083 18.2348 6.82648 17.8284 7.12882L13.2682 10.5211C13.0878 10.6554 13.0118 10.889 13.0789 11.1036L14.7743 16.5284C14.9254 17.012 14.3761 17.4109 13.9631 17.1179L9.32755 13.8291C9.14415 13.699 8.89855 13.699 8.71515 13.8291L4.07969 17.1179C3.66653 17.4109 3.11731 17.012 3.26842 16.5284L4.96375 11.1036C5.03082 10.889 4.95493 10.6554 4.77451 10.5211L0.214301 7.12882C-0.192143 6.82648 0.0176427 6.18083 0.524179 6.17511L6.20742 6.1111C6.43228 6.10857 6.63097 5.96421 6.70285 5.75115L8.51995 0.365846Z" fill="#FFB64D" />
        </svg>
      ))}
    </div>
  );
}

/* ─── Country flags ─── */
const FLAG = { US:'🇺🇸', GB:'🇬🇧', AU:'🇦🇺', CA:'🇨🇦', IN:'🇮🇳', DE:'🇩🇪', FR:'🇫🇷', SG:'🇸🇬' };

/* ─── Single testimonial card ─── */
function TestiCard({ name, country, rating, quote, initials, color }) {
  return (
    <div className="testi-card">
      {/* Purple glow blobs */}
      <div className="testi-card-glow" aria-hidden="true">
        <div className="testi-glow g1" />
        <div className="testi-glow g2" />
        <div className="testi-glow g3" />
        <div className="testi-glow g4" />
      </div>

      <div className="testi-card-body">
        {/* Name + flag  /  avatar */}
        <div className="testi-card-header">
          <div className="testi-card-identity">
            <span className="testi-card-name">{name}</span>
            <span className="testi-flag">{FLAG[country] ?? '🌍'}</span>
          </div>
          <div className="testi-avatar" style={{ background: color }}>{initials}</div>
        </div>

        {/* Big score + star row */}
        <div className="testi-rating-row">
          <span className="testi-score">{rating.toFixed(1)}</span>
          <Stars />
        </div>

        {/* Quote */}
        <p className="testi-quote">{quote}</p>
      </div>
    </div>
  );
}

/* ─── Testimonial data ─── */
const TESTIMONIALS = [
  { name:'Benny',  country:'US', rating:5.0, initials:'BM', color:'linear-gradient(135deg,#3a3a5c,#1a1a2e)', quote:"Robin and I have worked together on many projects. He truly understands his craft." },
  { name:'Sarah',  country:'GB', rating:5.0, initials:'SK', color:'linear-gradient(135deg,#2e4a3a,#163026)', quote:"Exceptional work delivered on time and perfectly executed. Would absolutely hire again without hesitation." },
  { name:'Marcus', country:'AU', rating:5.0, initials:'ML', color:'linear-gradient(135deg,#4a2e2e,#2c1a1a)', quote:"Transformed our brand's online presence completely. The attention to detail is extraordinary." },
  { name:'Priya',  country:'IN', rating:5.0, initials:'PS', color:'linear-gradient(135deg,#3a2e4a,#1e1628)', quote:"The best developer I've ever worked with. Fast, responsive and genuinely cares about results." },
  { name:'James',  country:'CA', rating:5.0, initials:'JR', color:'linear-gradient(135deg,#2e3a4a,#141e2c)', quote:"A system that genuinely scales. Our conversion rate jumped 40% in the first month after launch." },
];

/* ─── Section ─── */
export default function Testimonials({ testimonials: dbTestimonials }) {
  const displayTestimonials = dbTestimonials && dbTestimonials.length > 0
    ? dbTestimonials.map((t, idx) => {
        const initials = t.userName ? t.userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'CL';
        const colors = [
          'linear-gradient(135deg,#3a3a5c,#1a1a2e)',
          'linear-gradient(135deg,#2e4a3a,#163026)',
          'linear-gradient(135deg,#4a2e2e,#2c1a1a)',
          'linear-gradient(135deg,#3a2e4a,#1e1628)',
          'linear-gradient(135deg,#2e3a4a,#141e2c)'
        ];
        return {
          name: t.userName,
          country: t.companyName === 'Spotify' ? 'SG' : t.companyName === 'Stripe' ? 'US' : 'CA',
          rating: t.rating || 5.0,
          initials,
          color: colors[idx % colors.length],
          quote: t.content
        };
      })
    : TESTIMONIALS;
  return (
    <section className="testi-section" id="testimonials">
      <div className="testi-inner">

        {/* LEFT: label + heading */}
        <div className="testi-left">
          <div className="testi-label">
            <SparkleIcon />
            <span>Testimonials</span>
          </div>
          <h2 className="testi-heading">
            Trusted by<br />Clients Worldwide
          </h2>
        </div>

        {/* RIGHT: infinite auto-scrolling card marquee */}
        <div className="testi-marquee-outer">
          {/* Left + right edge fades */}
          <div className="testi-fade testi-fade-l" />
          <div className="testi-fade testi-fade-r" />

          {/*
            Two identical strips side-by-side.
            CSS animates from 0 → -50% (one full strip width).
            Hovering the track sets animation-play-state: paused.
          */}
          <div className="testi-marquee-track">
            {/* Strip A */}
            <div className="testi-marquee-strip" aria-hidden="false">
              {displayTestimonials.map((t, i) => <TestiCard key={`a-${i}`} {...t} />)}
            </div>
            {/* Strip B — seamless duplicate */}
            <div className="testi-marquee-strip" aria-hidden="true">
              {displayTestimonials.map((t, i) => <TestiCard key={`b-${i}`} {...t} />)}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
