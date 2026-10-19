'use client';
import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { profile } from '@/data/profile';
import './Footer.css';

const quickLinks = [
  { label: 'Home', href: '#' },
  { label: 'About', href: '#about-me' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
];

export default function Footer() {
  return (
    <footer className="footer-section">
      {/* Glow ellipses */}
      <div className="footer-glow" aria-hidden="true">
        <div className="footer-glow-ellipse footer-glow-1" />
        <div className="footer-glow-ellipse footer-glow-2" />
        <div className="footer-glow-ellipse footer-glow-3" />
        <div className="footer-glow-ellipse footer-glow-4" />
      </div>

      {/* Main Footer Content */}
      <div className="footer-inner">

        {/* Left: CTA */}
        <div className="footer-cta-col">
          <h2 className="footer-headline">Let&apos;s build something<br />people love to use</h2>
          <Button text="Get in touch" href="#contact" />
        </div>

        {/* Right: Navigation + Contact */}
        <div className="footer-nav-col">

          {/* Quick Links */}
          <div className="footer-links-group">
            <h3 className="footer-nav-heading">Quick Links</h3>
            <ul className="footer-nav-list">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="footer-nav-link">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-contact-group">
            <h3 className="footer-nav-heading">Contact</h3>
            <ul className="footer-contact-list">
              <li className="footer-contact-item">
                {/* WhatsApp icon */}
                <span className="footer-contact-icon">
                  <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12.5" cy="12.5" r="12.5" fill="url(#wp_bg)"/>
                    <path d="M16.4758 13.8028C16.2877 13.7089 15.3473 13.2629 15.1828 13.1925C15.0182 13.1221 14.8771 13.0986 14.7596 13.2864C14.642 13.4742 14.2659 13.8967 14.1718 14.0141C14.0543 14.1315 13.9602 14.1549 13.7721 14.061C13.5841 13.9671 12.9728 13.7793 12.244 13.1455C11.6797 12.6526 11.3036 12.0423 11.186 11.8545C11.0685 11.6667 11.186 11.5728 11.2801 11.4789C11.3741 11.385 11.4681 11.2676 11.5622 11.1502C11.6562 11.0329 11.6797 10.9624 11.7503 10.8451C11.8208 10.7277 11.7738 10.6103 11.7268 10.5164C11.6797 10.4225 11.3036 9.50704 11.139 9.13146C10.9744 8.77934 10.8334 8.82629 10.7158 8.80282H10.3632C10.2456 8.80282 10.034 8.84976 9.86949 9.03756C9.70492 9.22535 9.2112 9.67136 9.2112 10.5869C9.2112 11.5023 9.893 12.3709 9.98704 12.5117C10.081 12.6291 11.3271 14.507 13.2079 15.3052C13.6546 15.493 14.0072 15.6103 14.2894 15.7042C14.7361 15.8451 15.1592 15.8216 15.4884 15.7746C15.841 15.7277 16.6169 15.3286 16.7579 14.9061C16.9225 14.4836 16.9225 14.108 16.8755 14.0376C16.7814 13.9437 16.6639 13.8967 16.4758 13.8028ZM12.8788 18.6385C11.7503 18.6385 10.6688 18.3333 9.70492 17.77L9.46981 17.6291L7.1188 18.2394L7.75357 15.9624L7.61251 15.7277C7.00125 14.7418 6.6721 13.615 6.6721 12.4413C6.6721 9.03756 9.46981 6.26761 12.9023 6.26761C14.5245 6.26761 16.0996 6.90141 17.2752 8.07512C18.4507 9.24883 19.0854 10.7981 19.0854 12.4413C19.0854 15.8451 16.2877 18.6385 12.8788 18.6385ZM18.1685 7.1831C16.7579 5.77465 14.8771 5 12.8788 5C8.76451 5 5.40256 8.33333 5.40256 12.4413C5.40256 13.7559 5.75521 15.0235 6.38998 16.1502L5.33203 20L9.28173 18.9671C10.3632 19.554 11.6092 19.8826 12.8552 19.8826C16.9695 19.8826 20.3315 16.5493 20.3315 12.4413C20.355 10.4695 19.5792 8.59155 18.1685 7.1831Z" fill="white"/>
                    <defs><radialGradient id="wp_bg" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(12.5) rotate(90) scale(25 17.8507)"><stop stopColor="#F5F5FF"/><stop offset="0.710673" stopColor="#4B4EFC"/></radialGradient></defs>
                  </svg>
                </span>
                <a href={profile.whatsappHref} className="footer-contact-text">{profile.phone}</a>
              </li>
              <li className="footer-contact-item">
                {/* Email icon */}
                <span className="footer-contact-icon">
                  <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12.5" cy="12.5" r="12.5" fill="url(#em_bg)"/>
                    <path d="M12.832 6.875C9.72656 6.875 7.20703 9.39453 7.20703 12.5C7.20703 15.6055 9.72656 18.125 12.832 18.125C13.3506 18.125 13.7695 18.5439 13.7695 19.0625C13.7695 19.5811 13.3506 20 12.832 20C8.68945 20 5.33203 16.6426 5.33203 12.5C5.33203 8.35742 8.68945 5 12.832 5C16.9746 5 20.332 8.35742 20.332 12.5V13.4375C20.332 14.9902 19.0722 16.25 17.5195 16.25C16.6611 16.25 15.8906 15.8633 15.375 15.2568C14.707 15.8721 13.8134 16.25 12.832 16.25C10.7607 16.25 9.08203 14.5713 9.08203 12.5C9.08203 10.4287 10.7607 8.75 12.832 8.75C13.6494 8.75 14.4052 9.01074 15.0205 9.45605C15.1875 9.30957 15.4043 9.21875 15.6445 9.21875C16.1631 9.21875 16.582 9.6377 16.582 10.1562V13.4375C16.582 13.9561 17.0009 14.375 17.5195 14.375C18.0381 14.375 18.457 13.9561 18.457 13.4375V12.5C18.457 9.39453 15.9375 6.875 12.832 6.875ZM14.707 12.5C14.707 11.4658 13.8662 10.625 12.832 10.625C11.7978 10.625 10.957 11.4658 10.957 12.5C10.957 13.5342 11.7978 14.375 12.832 14.375C13.8662 14.375 14.707 13.5342 14.707 12.5Z" fill="white"/>
                    <defs><radialGradient id="em_bg" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(12.5) rotate(90) scale(25 17.8507)"><stop stopColor="#F5F5FF"/><stop offset="0.710673" stopColor="#4B4EFC"/></radialGradient></defs>
                  </svg>
                </span>
                <a href={`mailto:${profile.email}`} className="footer-contact-text">{profile.email}</a>
              </li>
              <li className="footer-contact-item">
                <a href={profile.behance} className="footer-contact-text" target="_blank" rel="noopener noreferrer">Behance</a>
              </li>
              <li className="footer-contact-item">
                <a href={profile.linkedin} className="footer-contact-text" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Large watermark "VIGNESH" name SVG */}
      <div className="footer-watermark" aria-hidden="true">
        <svg width="1283" height="223" viewBox="0 0 1283 223" fill="none" xmlns="http://www.w3.org/2000/svg" className="footer-name-svg">
          <path d="M1102.71 4.76318H1156.29V88.1143H1229.23V4.76318H1282.81V217.606H1229.23V131.874H1156.29V217.606H1102.71V4.76318Z" fill="url(#paint0_linear_223_1318)"/>
          <path d="M999.575 85.4349C1039.76 96.4491 1081.14 109.547 1081.14 155.093C1081.14 195.875 1050.18 222.369 996.896 222.369C941.527 222.369 899.852 194.982 899.852 147.65H953.434C953.434 170.274 973.081 178.609 996.896 178.609C1016.84 178.609 1027.56 170.87 1027.56 160.153C1027.56 143.185 1004.64 139.315 974.57 130.385C937.955 119.668 905.805 103.891 905.805 64.5971C905.805 18.1586 942.122 0 987.966 0C1037.68 0 1076.68 26.196 1078.16 69.36H1024.58C1022.2 53.2851 1008.51 43.7593 987.966 43.7593C971.891 43.7593 959.388 48.8199 959.388 60.7272C959.388 73.8252 972.784 77.9928 999.575 85.4349Z" fill="url(#paint1_linear_223_1318)"/>
          <path d="M778.083 86.3282H870.96V130.088H778.083V173.847H887.63V217.606H724.5V4.76318H885.844V48.5225H778.083V86.3282Z" fill="url(#paint2_linear_223_1318)"/>
          <path d="M513.16 217.606V4.76318H566.743L641.164 131.278H641.759V4.76318H695.342V217.606H641.759L567.338 91.0911H566.743V217.606H513.16Z" fill="url(#paint3_linear_223_1318)"/>
          <path d="M430.609 75.3137C426.739 60.7272 416.915 43.7593 387.445 43.7593C352.318 43.7593 338.923 71.1461 338.923 111.036C338.923 151.223 352.318 178.609 389.529 178.609C414.236 178.609 431.502 163.725 432.097 143.185H391.612V104.487H487.466V217.606H449.065L443.707 190.517H443.112C432.99 209.866 413.046 222.369 381.789 222.369C321.359 222.369 285.34 175.335 285.34 111.036C285.34 47.0338 321.359 0 388.338 0C446.684 0 479.131 34.5312 484.192 75.3137H430.609Z" fill="url(#paint4_linear_223_1318)"/>
          <path d="M209.379 4.76318H262.962V217.606H209.379V4.76318Z" fill="url(#paint5_linear_223_1318)"/>
          <path d="M0 4.76318H56.8574L97.0445 153.902H97.6399L138.125 4.76318H194.684L125.622 217.606H69.0623L0 4.76318Z" fill="url(#paint6_linear_223_1318)"/>
          <defs>
            <linearGradient id="paint0_linear_223_1318" x1="1193.04" y1="200.432" x2="1217.42" y2="-23.7531" gradientUnits="userSpaceOnUse">
              <stop stopColor="white" stopOpacity="0"/>
              <stop offset={1} stopColor="white" stopOpacity={0.29}/>
            </linearGradient>
            <linearGradient id="paint1_linear_223_1318" x1="990.779" y1="204.426" x2="1017.19" y2="-29.5814" gradientUnits="userSpaceOnUse">
              <stop stopColor="white" stopOpacity="0"/>
              <stop offset={1} stopColor="white" stopOpacity={0.29}/>
            </linearGradient>
            <linearGradient id="paint2_linear_223_1318" x1="806.32" y1="200.432" x2="833.167" y2="-23.1811" gradientUnits="userSpaceOnUse">
              <stop stopColor="white" stopOpacity="0"/>
              <stop offset={1} stopColor="white" stopOpacity={0.29}/>
            </linearGradient>
            <linearGradient id="paint3_linear_223_1318" x1="604.535" y1="200.432" x2="628.643" y2="-23.8128" gradientUnits="userSpaceOnUse">
              <stop stopColor="white" stopOpacity="0"/>
              <stop offset={1} stopColor="white" stopOpacity={0.29}/>
            </linearGradient>
            <linearGradient id="paint4_linear_223_1318" x1="386.718" y1="204.426" x2="410.467" y2="-30.1584" gradientUnits="userSpaceOnUse">
              <stop stopColor="white" stopOpacity="0"/>
              <stop offset={1} stopColor="white" stopOpacity={0.29}/>
            </linearGradient>
            <linearGradient id="paint5_linear_223_1318" x1="236.254" y1="200.432" x2="309.395" y2="0.330118" gradientUnits="userSpaceOnUse">
              <stop stopColor="white" stopOpacity="0"/>
              <stop offset={1} stopColor="white" stopOpacity={0.29}/>
            </linearGradient>
            <linearGradient id="paint6_linear_223_1318" x1="97.646" y1="200.432" x2="120.238" y2="-24.1317" gradientUnits="userSpaceOnUse">
              <stop stopColor="white" stopOpacity="0"/>
              <stop offset={1} stopColor="white" stopOpacity={0.29}/>
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <p className="footer-copyright">© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}
