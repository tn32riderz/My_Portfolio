'use client';

import { useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { pointerGlow } from '@/lib/pointerGlow';
import { companySpan, formatDuration, formatPeriod, monthsBetween } from '@/lib/duration';
import './ExperienceTimeline.css';

const initials = (name = '') => {
  const words = name.split(/\s+/).filter(Boolean);
  return (words.length > 1 ? words[0][0] + words[1][0] : (words[0] || '?').slice(0, 2)).toUpperCase();
};

/** One position: title, dates and duration always visible; summary, highlights and skills expand. */
function Role({ position, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  const current = !position.end;
  const hasDetails = position.description || position.points?.length || position.skills?.length;
  return (
    <li className={`xp-role${open ? ' is-open' : ''}`}>
      <span className={`xp-role__dot${current ? ' is-current' : ''}`} aria-hidden="true" />
      <button type="button" className="xp-role__head" onClick={() => setOpen((o) => !o)} aria-expanded={open} disabled={!hasDetails}>
        <span className="xp-role__title">
          {position.role}
          {current && <span className="xp-pill xp-pill--live"><i aria-hidden="true" />Current</span>}
        </span>
        <span className="xp-role__dates" suppressHydrationWarning>
          {formatPeriod(position.start, position.end)}<b aria-hidden="true">·</b>{formatDuration(monthsBetween(position.start, position.end))}
        </span>
        {hasDetails && <ChevronDown className="xp-role__chev" size={18} aria-hidden="true" />}
      </button>
      <div className="xp-role__body" hidden={!open}>
        {position.description && <p className="xp-role__summary">{position.description}</p>}
        {position.points?.length > 0 && (
          <ul className="xp-role__points">{position.points.map((p) => <li key={p}>{p}</li>)}</ul>
        )}
        {position.skills?.length > 0 && (
          <div className="xp-skills">{position.skills.map((s) => <span key={s} className="xp-skill">{s}</span>)}</div>
        )}
      </div>
    </li>
  );
}

function CompanyCard({ company, index }) {
  const reduce = useReducedMotion();
  const span = companySpan(company.positions);
  const count = company.positions.length;
  const side = index % 2 === 0 ? -1 : 1;
  const startYear = span?.start?.slice(0, 4);
  const endLabel = span && !span.end ? 'Now' : span?.end?.slice(0, 4);

  return (
    <li className={`xp-item ${side < 0 ? 'is-left' : 'is-right'}`}>
      <span className="xp-node" aria-hidden="true"><b>{startYear}</b>{endLabel && endLabel !== startYear && <small>{endLabel}</small>}</span>
      <motion.article className="xp-card" onPointerMove={pointerGlow}
        initial={reduce ? false : { opacity: 0, x: side * 48, y: 24 }} whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
        <header className="xp-card__head">
          <span className="xp-logo" aria-hidden="true">{initials(company.company)}</span>
          <div className="xp-card__title">
            <h3 className="xp-company">{company.company}</h3>
            <p className="xp-meta">{company.location && <span>{company.location}</span>}</p>
          </div>
          <div className="xp-tenure" suppressHydrationWarning>
            <strong>{span ? formatDuration(span.months) : ''}</strong>
            <span>{count} {count === 1 ? 'role' : 'roles'}</span>
          </div>
        </header>
        <ol className="xp-roles">
          {company.positions.map((position, i) => <Role key={position.id} position={position} defaultOpen={i === 0} />)}
        </ol>
      </motion.article>
    </li>
  );
}

/** Zig-zag timeline: a spine that fills as you scroll, one glass card per company. */
export default function ExperienceTimeline({ companies }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 65%', 'end 65%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <div className="xp" ref={ref}>
      <div className="xp-spine" aria-hidden="true"><motion.span className="xp-spine__fill" style={{ scaleY: fill }} /></div>
      <ol className="xp-list">
        {companies.map((c, i) => <CompanyCard key={c.id} company={c} index={i} />)}
      </ol>
    </div>
  );
}
