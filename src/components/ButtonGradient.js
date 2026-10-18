"use client";

import React from 'react';
import Link from 'next/link';
import './ButtonGradient.css';

export default function ButtonGradient({
  children,
  onClick,
  className = "",
  type = "button",
  disabled = false,
  href,
  ...props
}) {
  const handleClick = (e) => {
    if (disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onClick?.(e);
  };

  // Premium inline SVG fractal noise textures encoded safely
  const noiseSvg1 = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n1'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n1)' opacity='0.15'/%3E%3C/svg%3E`;
  const noiseSvg2 = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.70' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n2)' opacity='0.12'/%3E%3C/svg%3E`;
  const noiseSvg3 = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n3'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.55' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n3)' opacity='0.08'/%3E%3C/svg%3E`;

  const content = (
    <>
      {/* Noise layers */}
      <div
        className="noise-layer noise-1"
        style={{
          backgroundImage: `url("${noiseSvg1}")`,
          backgroundSize: "100px 100px",
        }}
      />
      <div
        className="noise-layer noise-2"
        style={{
          backgroundImage: `url("${noiseSvg2}")`,
          backgroundSize: "80px 80px",
          backgroundPosition: "20px 20px",
        }}
      />
      <div
        className="noise-layer noise-3"
        style={{
          backgroundImage: `url("${noiseSvg3}")`,
          backgroundSize: "60px 60px",
          backgroundPosition: "10px 10px",
        }}
      />
      
      {/* Group hover glow overlay */}
      <div className="hover-overlay" />

      {/* Button text */}
      <span className="btn-text-content">
        {children}
      </span>
    </>
  );

  const combinedClassName = `btn-gradient-wrapper ${className} ${disabled ? 'disabled' : ''}`;

  if (href) {
    return (
      <Link
        href={href}
        onClick={handleClick}
        className={combinedClassName}
        {...props}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={combinedClassName}
      {...props}
    >
      {content}
    </button>
  );
}
