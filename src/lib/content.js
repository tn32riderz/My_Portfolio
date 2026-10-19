import { getDb, publishedList } from '@/lib/db';
import { byRecency } from '@/lib/duration';

/** A legacy flat entry (one role with its own company) becomes a one-position company. */
const toCompany = (e) => (Array.isArray(e.positions) ? e : {
  id: e.id, company: e.company, location: e.location, status: e.status,
  positions: [{ id: e.id, role: e.role, start: e.start, end: e.end, description: e.description, points: e.points, skills: e.skills }],
});

/**
 * Experience grouped by company, LinkedIn style: each company lists its positions (current/newest first).
 * Companies are ordered by their most recent position. Also returns the earliest start date, which
 * drives "years of experience" across the site.
 */
export async function getExperienceContent() {
  const db = await getDb();
  const companies = publishedList(db.experiences).map(toCompany).map((c) => ({
    ...c, positions: [...(c.positions || [])].sort(byRecency),
  })).filter((c) => c.positions.length);
  companies.sort((a, b) => byRecency(a.positions[0], b.positions[0]));
  const careerStart = companies.flatMap((c) => c.positions).reduce((min, p) => (p.start && (!min || p.start < min) ? p.start : min), '') || undefined;
  return { experiences: companies, education: publishedList(db.education), careerStart };
}

const NEWEST_FALLBACK = 4;

/** Ids shown on the home page, in order. Set from the admin "Home page highlights" box (db.homeProjects). */
export function getHomeIds(db) {
  const published = publishedList(db.caseStudies).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  if (Array.isArray(db.homeProjects)) {
    return db.homeProjects.filter((id) => published.some((p) => p.id === id));
  }
  // Never configured: use projects flagged "featured" earlier, else the newest few.
  const flagged = published.filter((p) => p.featured);
  return (flagged.length ? flagged : published).slice(0, NEWEST_FALLBACK).map((p) => p.id);
}

/** Published projects for the home page section, in the highlight order. */
export async function getHomeProjects() {
  const db = await getDb();
  const byId = new Map(publishedList(db.caseStudies).map((p) => [p.id, p]));
  return getHomeIds(db).map((id) => byId.get(id)).filter(Boolean);
}
