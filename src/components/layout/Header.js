"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import Button from '@/components/ui/Button';
import ButtonGradient from '@/components/ui/ButtonGradient';
import './Header.css';

const navLinks = [
  { name: 'About', href: '#about-me' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Services', href: '#services' },
  // { name: 'Blogs', href: '#blogs' },
  { name: 'Contact', href: '#contact' }
];

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');


  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.35;

      // If scrolled to the bottom of the page, force 'Contact' active
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50) {
        setActiveLink('Contact');
        return;
      }

      // Check section offsets from bottom to top
      let found = false;
      for (let i = navLinks.length - 1; i >= 0; i--) {
        const link = navLinks[i];
        const el = document.getElementById(link.href.replace('#', ''));
        if (el) {
          if (scrollPos >= el.offsetTop) {
            setActiveLink(link.name);
            found = true;
            break;
          }
        }
      }

      // If scroll is in the Hero section (above #about-me), deselect all tabs
      if (!found) {
        setActiveLink('');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (name) => {
    setActiveLink(name);
    setIsOpen(false); // Close sidebar on selection
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Hidden in the admin and on a single case study (/works/<slug>), which has its own back button.
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/works/')) return null;

  return (
    <>
      {/* SVG Filter for Liquid Glass effect */}
      <svg style={{ display: 'none' }}>
        <filter id="container-glass" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.008 0.008" 
            numOctaves="2" 
            result="noise" />
          <feGaussianBlur in="noise" stdDeviation="0.02" result="blur" />
          <feDisplacementMap 
            in="SourceGraphic" 
            in2="blur" 
            scale="77" 
            xChannelSelector="R" 
            yChannelSelector="G" />
        </filter>
      </svg>

      <header className="portfolio-header-container">
      <div className="portfolio-header-inner">
        {/* Logo Section (scrolls to hero and clears active tab on click) */}
        <Link href="/" style={{ display: 'flex', textDecoration: 'none' }} onClick={() => handleLinkClick('')}>
          <Logo />
        </Link>

        {/* Desktop Navigation Link Toggle Menu */}
        <nav className="desktop-nav-menu">
          <ul className="nav-toggle-pill">
            {navLinks.map((link) => (
              <li key={link.name} style={{ display: 'inline-flex', alignItems: 'center' }}>
                {activeLink === link.name ? (
                  <ButtonGradient
                    href={`/${link.href}`}
                    className="nav-active-gradient"
                    onClick={() => handleLinkClick(link.name)}
                  >
                    {link.name}
                  </ButtonGradient>
                ) : (
                  <Link
                    href={`/${link.href}`}
                    className="nav-link-btn"
                    onClick={() => handleLinkClick(link.name)}
                  >
                    {link.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop CTA Button */}
        <div className="desktop-cta-btn">
          <Button text="Start a Project" href="/#contact" />
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className={`hamburger-toggle-btn ${isOpen ? 'open' : ''}`}
          onClick={toggleSidebar}
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Drawer Sidebar Menu overlay */}
      <div
        className={`mobile-sidebar-backdrop ${isOpen ? 'show' : ''}`}
        onClick={toggleSidebar}
      />
      <div className={`mobile-sidebar-menu ${isOpen ? 'show' : ''}`}>
        <div className="mobile-nav-links">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={`/${link.href}`}
              className={`mobile-nav-link ${activeLink === link.name ? 'active' : ''}`}
              onClick={() => handleLinkClick(link.name)}
            >
              {link.name}
            </Link>
          ))}
        </div>
        <div className="mobile-sidebar-footer">
          <Button text="Start a Project" href="/#contact" className="mobile-cta-btn" />
        </div>
      </div>
    </header>
  </>
  );
}
