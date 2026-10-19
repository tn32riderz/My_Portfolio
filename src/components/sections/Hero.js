import React from 'react';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import TiltCard from '@/components/ui/TiltCard';
import { profile } from '@/data/profile';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero-section" id="hero">
      <div className="hero-container">
        {/* Part 1: Name and Texts */}
        <div className="hero-part-text">
          <span className="hero-sub-headline">Hey, I&apos;m</span>
          
          <div className="hero-name-wrapper">
            <Image
              src="/assets/images/hero/main-hero-name.svg"
              width={515}
              height={155}
              alt={profile.firstName}
              priority
              className="hero-name-img"
            />
          </div>

          <p className="hero-subtitle">
            {profile.tagline}
          </p>

          <div className="hero-cta-wrapper">
            <Button text="Let's Talk" href="#contact" />
          </div>
        </div>

        {/* Part 2: Main Image (Auto-fill height, scale only, no wrap) */}
        <div className="hero-part-image">
          <Image 
            src="/assets/images/hero/main-hero-image.svg" 
            width={770} 
            height={768} 
            alt={`Portrait of ${profile.firstName}`} 
            priority 
            className="hero-portrait-img"
          />
        </div>

        {/* Part 3: Client Satisfaction Card */}
        <div className="hero-part-card">
          <TiltCard className="satisfaction-card" shadow="inset 0 0 12px rgba(255, 255, 255, 0.05)">
            <div className="avatar-group">
              <div className="avatar-img-container">
                <Image src="/assets/images/avatars/avatar1.png" width={40} height={40} alt="Client 1" className="avatar-img" />
              </div>
              <div className="avatar-img-container">
                <Image src="/assets/images/avatars/avatar2.png" width={40} height={40} alt="Client 2" className="avatar-img" />
              </div>
              <div className="avatar-img-container">
                <Image src="/assets/images/avatars/avatar3.png" width={40} height={40} alt="Client 3" className="avatar-img" />
              </div>
              <div className="avatar-img-container">
                <Image src="/assets/images/avatars/avatar4.png" width={40} height={40} alt="Client 4" className="avatar-img" />
              </div>
              <div className="avatar-img-container">
                <Image src="/assets/images/avatars/avatar5.png" width={40} height={40} alt="Client 5" className="avatar-img" />
              </div>
              <div className="arrow-circle-link" aria-label="Learn more about clients">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.188888 8.3365C-0.0629625 8.58833 -0.0629625 8.99664 0.188888 9.24855C0.440738 9.50039 0.849068 9.50039 1.10092 9.24855L0.644903 8.79252L0.188888 8.3365ZM9.43743 0.644904C9.43743 0.288733 9.14867 -8.49624e-08 8.79253 1.69855e-07L2.98838 0C2.63221 2.71746e-07 2.34348 0.288733 2.34348 0.644904C2.34348 1.00107 2.63221 1.28981 2.98838 1.28981H8.14762V6.44903C8.14762 6.8052 8.43638 7.09394 8.79253 7.09394C9.14867 7.09394 9.43743 6.8052 9.43743 6.44903V0.644904ZM0.644903 8.79252L1.10092 9.24855L9.24855 1.10092L8.79253 0.644903L8.3365 0.188888L0.188888 8.3365L0.644903 8.79252Z" fill="white" />
                </svg>
              </div>
            </div>
            <p className="satisfaction-text">
              99.6% Of My Clients Are Satisfied - Be One Of Them Today.
            </p>
            <div className="satisfaction-badges">
              <span className="satisfaction-badge">Free Consultation</span>
              <span className="satisfaction-badge">24h Response</span>
            </div>
          </TiltCard>
        </div>
      </div>
    </section>
  );
}
