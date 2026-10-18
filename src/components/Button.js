import React from 'react';
import ButtonGradient from './ButtonGradient';

export default function Button({ text = "Start a Project", href = "#contact", className = "", arrowDirection = "up-right" }) {
  return (
    <ButtonGradient href={href} className={`btn-pill-shape ${className}`}>
      <span className="btn-pill-text">{text}</span>
      <div className="btn-circle-icon-wrapper">
        {arrowDirection === "down" ? (
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.5 1.5V9.5M5.5 9.5L2 6M5.5 9.5L9 6" stroke="#4B4EFC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_192_4558)">
              <path d="M0.188888 8.3365C-0.0629625 8.58833 -0.0629625 8.99664 0.188888 9.24855C0.440738 9.50039 0.849068 9.50039 1.10092 9.24855L0.644903 8.79252L0.188888 8.3365ZM9.43743 0.644904C9.43743 0.288733 9.14867 -8.49624e-08 8.79253 1.69855e-07L2.98838 0C2.63221 2.71746e-07 2.34348 0.288733 2.34348 0.644904C2.34348 1.00107 2.63221 1.28981 2.98838 1.28981H8.14762V6.44903C8.14762 6.8052 8.43638 7.09394 8.79253 7.09394C9.14867 7.09394 9.43743 6.8052 9.43743 6.44903V0.644904ZM0.644903 8.79252L1.10092 9.24855L9.24855 1.10092L8.79253 0.644903L8.3365 0.188888L0.188888 8.3365L0.644903 8.79252Z" fill="url(#paint0_radial_192_4558)"/>
            </g>
            <defs>
              <radialGradient id="paint0_radial_192_4558" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(4.71871) rotate(90) scale(9.43743 6.7386)">
                <stop stopColor="#F5F5FF"/>
                <stop offset="0.710673" stopColor="#4B4EFC"/>
              </radialGradient>
              <clipPath id="clip0_192_4558">
                <rect width="9.67355" height="9.67355" fill="white"/>
              </clipPath>
            </defs>
          </svg>
        )}
      </div>
    </ButtonGradient>
  );
}



