'use client';

import React from 'react';
import Button from '../components/Button';
import './Blogs.css';

/* ── Sparkle Icon (matches design aesthetic) ── */
function SparkleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.82506 0.129592C6.83644 0.0921028 6.85958 0.0592669 6.89105 0.0359321C6.92253 0.0125972 6.96067 0 6.99985 0C7.03903 0 7.07718 0.0125972 7.10865 0.0359321C7.14013 0.0592669 7.16326 0.0921028 7.17465 0.129592L7.83729 2.35154C8.10616 3.25331 8.59537 4.07394 9.26077 4.73934C9.92617 5.40474 10.7468 5.89397 11.6486 6.16286L13.8706 6.82548C13.9081 6.8369 13.9409 6.86005 13.9641 6.8915C13.9874 6.92296 14 6.96106 14 7.0002C14 7.03933 13.9874 7.07743 13.9641 7.10889C13.9409 7.14034 13.9081 7.16349 13.8706 7.17491L11.6486 7.83753C10.7469 8.10643 9.92626 8.59564 9.26089 9.26101C8.59551 9.92639 8.10631 10.747 7.83744 11.6487L7.17465 13.8706C7.16322 13.9081 7.14008 13.9409 7.10862 13.9641C7.07717 13.9874 7.03906 14 6.99993 14C6.96079 14 6.92268 13.9874 6.89123 13.9641C6.85977 13.9409 6.83663 13.9081 6.8252 13.8706L6.16256 11.6487C5.89364 10.747 5.40438 9.92639 4.73896 9.26104C4.07353 8.59569 3.25288 8.10652 2.35109 7.83768L0.129355 7.17476C0.0919215 7.16334 0.0591464 7.1402 0.0358582 7.10874C0.01257 7.07729 0 7.03918 0 7.00005C0 6.96091 0.01257 6.92281 0.0358582 6.89135C0.0591464 6.8599 0.0919215 6.83676 0.129355 6.82533L2.35124 6.16271C3.25307 5.89384 4.07374 5.40463 4.73916 4.73922C5.40459 4.07382 5.89383 3.25318 6.1627 2.35139L6.82506 0.129592Z"
        fill="url(#paint0_radial_246_12724)"
      />
      <defs>
        <radialGradient id="paint0_radial_246_12724" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(7) rotate(90) scale(14 9.9964)">
          <stop stopColor="#F5F5FF" />
          <stop offset="0.710673" stopColor="#4B4EFC" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/* ── Custom Vector Graphics for AI and Scale of Justice ── */
function AIVectorGraphic() {
  return (
    <div className="blog-vector-container ai-main-vector">
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg" className="blog-svg-graphic">
        {/* Abstract background mesh */}
        <circle cx="200" cy="150" r="120" stroke="rgba(75, 78, 252, 0.15)" strokeWidth="1" strokeDasharray="5 5" />
        <circle cx="200" cy="150" r="80" stroke="rgba(75, 78, 252, 0.2)" strokeWidth="1.5" />
        <line x1="80" y1="150" x2="320" y2="150" stroke="rgba(75, 78, 252, 0.1)" strokeWidth="1" />
        <line x1="200" y1="30" x2="200" y2="270" stroke="rgba(75, 78, 252, 0.1)" strokeWidth="1" />
        
        {/* Code window representation */}
        <rect x="60" y="60" width="280" height="180" rx="12" fill="#0d0d1a" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
        <rect x="60" y="60" width="280" height="30" rx="12" fill="#14142b" />
        <circle cx="80" cy="75" r="4" fill="#ff5c5c" />
        <circle cx="95" cy="75" r="4" fill="#ffbe2e" />
        <circle cx="110" cy="75" r="4" fill="#27c93f" />

        {/* Brain node mesh inside screen */}
        <g transform="translate(200, 150)">
          {/* Connection lines */}
          <line x1="-40" y1="-20" x2="0" y2="-50" stroke="#4B4EFC" strokeWidth="1.5" opacity="0.6" />
          <line x1="40" y1="-20" x2="0" y2="-50" stroke="#4B4EFC" strokeWidth="1.5" opacity="0.6" />
          <line x1="-50" y1="30" x2="-40" y2="-20" stroke="#4B4EFC" strokeWidth="1.5" opacity="0.6" />
          <line x1="50" y1="30" x2="40" y2="-20" stroke="#4B4EFC" strokeWidth="1.5" opacity="0.6" />
          <line x1="-50" y1="30" x2="0" y2="60" stroke="#4B4EFC" strokeWidth="1.5" opacity="0.6" />
          <line x1="50" y1="30" x2="0" y2="60" stroke="#4B4EFC" strokeWidth="1.5" opacity="0.6" />
          <line x1="0" y1="-50" x2="0" y2="60" stroke="#4B4EFC" strokeWidth="1" opacity="0.3" />

          {/* Central AI core */}
          <circle cx="0" cy="0" r="30" fill="url(#ai-core-grad)" />
          <text x="0" y="8" fill="white" fontSize="18" fontWeight="bold" fontFamily="Inter, sans-serif" textAnchor="middle">AI</text>

          {/* Orbiting nodes */}
          <circle cx="0" cy="-50" r="7" fill="#F5F5FF" filter="drop-shadow(0px 0px 8px #4B4EFC)" />
          <circle cx="-40" cy="-20" r="6" fill="#7375FD" />
          <circle cx="40" cy="-20" r="6" fill="#7375FD" />
          <circle cx="-50" cy="30" r="7" fill="#4B4EFC" />
          <circle cx="50" cy="30" r="7" fill="#4B4EFC" />
          <circle cx="0" cy="60" r="8" fill="#F5F5FF" filter="drop-shadow(0px 0px 8px #4B4EFC)" />
        </g>
        
        {/* Code snippets overlay */}
        <rect x="75" y="110" width="50" height="6" rx="3" fill="rgba(255, 255, 255, 0.2)" />
        <rect x="75" y="125" width="70" height="6" rx="3" fill="#4B4EFC" opacity="0.8" />
        <rect x="75" y="140" width="40" height="6" rx="3" fill="rgba(255, 255, 255, 0.2)" />
        <rect x="290" y="180" width="35" height="6" rx="3" fill="#7375FD" />
        <rect x="280" y="195" width="45" height="6" rx="3" fill="rgba(255, 255, 255, 0.2)" />

        <defs>
          <radialGradient id="ai-core-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7375FD" />
            <stop offset="100%" stopColor="#4B4EFC" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}

function ScalesVectorGraphic() {
  return (
    <div className="blog-vector-container scales-side-vector">
      <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg" className="blog-svg-graphic">
        {/* Background glow circle */}
        <circle cx="100" cy="100" r="70" fill="url(#scales-glow-grad)" opacity="0.15" />
        <circle cx="100" cy="100" r="85" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />

        {/* Abstract futuristic background patterns */}
        <path d="M100 20 C140 20 180 60 180 100 C180 140 140 180 100 180" stroke="rgba(75, 78, 252, 0.2)" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="100" cy="100" r="45" stroke="rgba(75, 78, 252, 0.15)" strokeWidth="1" />

        {/* Scale construction */}
        {/* Pillar */}
        <rect x="97" y="55" width="6" height="90" rx="3" fill="#4B4EFC" />
        <rect x="85" y="140" width="30" height="8" rx="4" fill="#7375FD" />
        <circle cx="100" cy="50" r="7" fill="#F5F5FF" />
        
        {/* Balance Beam */}
        <path d="M60 65 L140 65" stroke="#F5F5FF" strokeWidth="3" strokeLinecap="round" />
        <circle cx="100" cy="65" r="4" fill="#4B4EFC" />

        {/* Left Pan */}
        <line x1="60" y1="65" x2="45" y2="105" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
        <line x1="60" y1="65" x2="75" y2="105" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
        <path d="M40 105 C40 115 80 115 80 105 Z" fill="url(#pan-grad)" stroke="#7375FD" strokeWidth="1" />

        {/* Right Pan */}
        <line x1="140" y1="65" x2="125" y2="105" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
        <line x1="140" y1="65" x2="155" y2="105" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
        <path d="M120 105 C120 115 160 115 160 105 Z" fill="url(#pan-grad)" stroke="#7375FD" strokeWidth="1" />
        
        {/* Nodes hanging off scales */}
        <circle cx="60" cy="115" r="3" fill="#4B4EFC" />
        <circle cx="140" cy="115" r="3" fill="#4B4EFC" />

        <defs>
          <radialGradient id="scales-glow-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7375FD" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <linearGradient id="pan-grad" x1="60" y1="105" x2="60" y2="115" gradientUnits="userSpaceOnUse">
            <stop stopColor="rgba(75, 78, 252, 0.4)" />
            <stop offset="100%" stopColor="rgba(13, 13, 26, 0.9)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

/* ── Blog Data ── */
const BLOG_POSTS = [
  {
    id: 1,
    category: 'Future AI',
    date: 'July 2, 2021',
    readTime: '5 Mins Read',
    title: 'Transforming Industries with Responsible and Generative AI',
    excerpt: 'The combination of Generative AI (Gen AI) and Responsible AI has revolutionized technology, leading to big steps forward while focusing on ethical issues. At Valopt, we work to build systems that respect human values and deliver top business performance.',
    isFeatured: true,
  },
  {
    id: 2,
    category: 'Future AI',
    date: 'July 2, 2021',
    readTime: '5 Mins Read',
    title: 'Transforming Industries with Responsible and Generative AI',
    isFeatured: false,
  },
  {
    id: 3,
    category: 'Future AI',
    date: 'July 2, 2021',
    readTime: '5 Mins Read',
    title: 'Transforming Industries with Responsible and Generative AI',
    isFeatured: false,
  },
  {
    id: 4,
    category: 'Future AI',
    date: 'July 2, 2021',
    readTime: '5 Mins Read',
    title: 'Transforming Industries with Responsible and Generative AI',
    isFeatured: false,
  },
];

export default function Blogs({ blogs: dbBlogs }) {
  const displayBlogs = dbBlogs && dbBlogs.length > 0
    ? dbBlogs.map((b, idx) => ({
        id: b.id,
        category: b.category || 'Future AI',
        date: new Date(b.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        readTime: b.readTime || '5 Mins Read',
        title: b.title,
        excerpt: b.content,
        isFeatured: idx === 0
      }))
    : BLOG_POSTS;

  const featuredPost = displayBlogs[0];
  const sidePosts     = displayBlogs.slice(1, 4);

  return (
    <section className="blogs-section" id="blogs">
      <div className="blogs-inner">
        
        {/* Heading & View All Button Row */}
        <div className="blogs-header-row">
          <div className="blogs-title-col">
            <div className="blogs-label">
              <SparkleIcon />
              <span>Features Blogs</span>
            </div>
            <h2 className="blogs-heading">
              Latest Insights: Shaping the <span className="blogs-highlight">Future of AI</span>
            </h2>
          </div>
          
          <div className="blogs-btn-wrapper">
            <Button text="View All" href="#blogs" />
          </div>
        </div>

        {/* Content Layout Grid */}
        <div className="blogs-grid">
          
          {/* Featured Post Card (Left) */}
          <div className="blog-featured-card">
            {/* Background Glow Blobs */}
            <div className="blog-card-glow-bg" aria-hidden="true">
              <div className="blog-glow bg1" />
              <div className="blog-glow bg2" />
              <div className="blog-glow bg3" />
              <div className="blog-glow bg4" />
            </div>
            
            {/* Visual Graphic Area */}
            <div className="blog-media-area">
              <AIVectorGraphic />
              <span className="blog-category-tag">{featuredPost.category}</span>
            </div>

            {/* Card Content Area */}
            <div className="blog-content-area">
              <div className="blog-meta-row">
                <span className="blog-date">{featuredPost.date}</span>
                <span className="blog-separator">•</span>
                <span className="blog-readtime">{featuredPost.readTime}</span>
              </div>
              <h3 className="blog-card-title">{featuredPost.title}</h3>
              <p className="blog-card-excerpt">{featuredPost.excerpt}</p>
            </div>
          </div>

          {/* Side Articles List (Right) */}
          <div className="blogs-side-list">
            {sidePosts.map((post) => (
              <div key={post.id} className="blog-side-card">
                {/* Small Scale Graphic */}
                <div className="blog-side-media">
                  <ScalesVectorGraphic />
                  <span className="blog-category-tag-small">{post.category}</span>
                </div>
                
                {/* Text details */}
                <div className="blog-side-content">
                  <div className="blog-meta-row">
                    <span className="blog-date">{post.date}</span>
                    <span className="blog-separator">•</span>
                    <span className="blog-readtime">{post.readTime}</span>
                  </div>
                  <h4 className="blog-side-title">{post.title}</h4>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
