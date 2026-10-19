import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'src', 'data', 'db.json');

/** Reads the JSON content store. Returns {} if it is missing or invalid so pages fall back to defaults. */
export async function getDb() {
  try {
    return JSON.parse(await fs.readFile(DB_PATH, 'utf-8'));
  } catch (error) {
    console.warn('Failed to load db.json, falling back to static defaults', error);
    return {};
  }
}

export const isPublished = (item) => item.status === 'Active' || item.status === 'Published';

/** Collections the admin editor may replace. Everything else in db.json is read-only. */
export const EDITABLE_COLLECTIONS = ['caseStudies', 'services', 'testimonials', 'experiences', 'education'];

/** Atomic write: a crash mid-write can never leave db.json half-written. */
export async function saveDb(db) {
  const tmp = `${DB_PATH}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(db, null, 2) + '\n', 'utf-8');
  await fs.rename(tmp, DB_PATH);
}

/** Public items only, ordered by displayOrder. */
export const publishedList = (items = []) =>
  items.filter(isPublished).sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));
