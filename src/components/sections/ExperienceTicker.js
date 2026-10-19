import React from 'react';
import { getStats } from '@/data/profile';
import './ExperienceTicker.css';

export default function ExperienceTicker({ careerStart }) {
  const tickerText = getStats(careerStart).map((s) => `${s.toUpperCase()} ✦ `).join('');
  
  // Create a long repeated string for seamless infinite marquee scroll
  const items = Array(8).fill(tickerText);

  return (
    <section className="ticker-section">
      {/* Downward Sloping Band (Left-to-Right Scroll) */}
      <div className="ticker-band band-down">
        <div className="ticker-track track-left">
          <div className="ticker-content">
            {items.map((text, index) => (
              <span key={`down-${index}`} className="ticker-item">{text}</span>
            ))}
          </div>
          <div className="ticker-content" aria-hidden="true">
            {items.map((text, index) => (
              <span key={`down-dup-${index}`} className="ticker-item">{text}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Upward Sloping Band (Right-to-Left Scroll) */}
      <div className="ticker-band band-up">
        <div className="ticker-track track-right">
          <div className="ticker-content">
            {items.map((text, index) => (
              <span key={`up-${index}`} className="ticker-item">{text}</span>
            ))}
          </div>
          <div className="ticker-content" aria-hidden="true">
            {items.map((text, index) => (
              <span key={`up-dup-${index}`} className="ticker-item">{text}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
