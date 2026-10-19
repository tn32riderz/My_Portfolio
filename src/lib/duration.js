// Date helpers for the experience timeline. Months are counted inclusively
// (Jul 2022 – Jan 2026 = 3 yrs 7 mos), matching how the resume states tenure.

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const parse = (ym) => {
  const [y, m] = ym.split('-').map(Number);
  return { y, m: m - 1 };
};

/** Whole months between "YYYY-MM" and end ("YYYY-MM", or today when omitted). */
export function monthsBetween(start, end, now = new Date()) {
  const s = parse(start);
  const e = end ? parse(end) : { y: now.getFullYear(), m: now.getMonth() };
  return Math.max(1, (e.y - s.y) * 12 + (e.m - s.m) + 1);
}

/** "3 yrs 7 mos", "1 yr", "8 mos" */
export function formatDuration(months) {
  const y = Math.floor(months / 12);
  const m = months % 12;
  const parts = [];
  if (y) parts.push(`${y} ${y === 1 ? 'yr' : 'yrs'}`);
  if (m) parts.push(`${m} ${m === 1 ? 'mo' : 'mos'}`);
  return parts.join(' ');
}

/** "Oct 2024 — Jan 2026" or "May 2022 — Present" */
export function formatPeriod(start, end) {
  const fmt = (ym) => `${MONTHS[parse(ym).m]} ${parse(ym).y}`;
  return `${fmt(start)} — ${end ? fmt(end) : 'Present'}`;
}

/** Years to one decimal, e.g. 54 months -> "4.5", 55 months -> "4.6", 60 months -> "5" */
export function yearsLabel(months) {
  return String(Number((months / 12).toFixed(1)));
}

/** Whole-company tenure for a list of positions: earliest start to latest end (open-ended = today). */
export function companySpan(positions, now = new Date()) {
  const starts = positions.map((p) => p.start).filter(Boolean).sort();
  if (!starts.length) return null;
  const current = positions.some((p) => p.start && !p.end);
  const ends = positions.map((p) => p.end).filter(Boolean).sort();
  return { start: starts[0], end: current ? '' : ends[ends.length - 1] || '', months: monthsBetween(starts[0], current ? '' : ends[ends.length - 1] || '', now) };
}

/** Newest first, current roles on top. */
export const byRecency = (a, b) => (Number(!a.end) !== Number(!b.end) ? Number(!b.end) - Number(!a.end) : String(b.start).localeCompare(String(a.start)));
