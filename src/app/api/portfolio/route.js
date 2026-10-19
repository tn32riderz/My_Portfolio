import { revalidatePath } from 'next/cache';
import { checkAdmin } from '@/lib/adminAuth';
import { getDb, saveDb, EDITABLE_COLLECTIONS } from '@/lib/db';

const SLUG_RE = /^[a-z0-9-]+$/;

/** PATCH { collection, item } inserts or replaces a single item by id. */
export async function PATCH(request) {
  const denied = await checkAdmin(request);
  if (denied) return denied;

  let body;
  try { body = await request.json(); } catch { return Response.json({ error: 'Invalid JSON.' }, { status: 400 }); }
  const { collection, item } = body || {};
  if (!EDITABLE_COLLECTIONS.includes(collection)) {
    return Response.json({ error: `Unknown collection "${collection}".` }, { status: 400 });
  }
  if (!item || typeof item !== 'object' || typeof item.id !== 'string') {
    return Response.json({ error: 'item must be an object with a string id.' }, { status: 400 });
  }

  const db = await getDb();
  const list = db[collection] || [];
  if (collection === 'caseStudies') {
    if (!SLUG_RE.test(item.slug || '')) {
      return Response.json({ error: 'Slug must use a-z, 0-9 and hyphens.' }, { status: 400 });
    }
    if (list.some((i) => i.slug === item.slug && i.id !== item.id)) {
      return Response.json({ error: `Another project already uses the slug "${item.slug}".` }, { status: 409 });
    }
  }
  const index = list.findIndex((i) => i.id === item.id);
  db[collection] = index === -1 ? [item, ...list] : list.map((i) => (i.id === item.id ? item : i));
  await saveDb(db);
  revalidatePath('/', 'layout');
  return Response.json({ ok: true });
}

/** DELETE { collection, id } removes one item. */
export async function DELETE(request) {
  const denied = await checkAdmin(request);
  if (denied) return denied;

  let body;
  try { body = await request.json(); } catch { return Response.json({ error: 'Invalid JSON.' }, { status: 400 }); }
  const { collection, id } = body || {};
  if (!EDITABLE_COLLECTIONS.includes(collection) || typeof id !== 'string') {
    return Response.json({ error: 'collection and id are required.' }, { status: 400 });
  }
  const db = await getDb();
  db[collection] = (db[collection] || []).filter((i) => i.id !== id);
  if (collection === 'caseStudies' && Array.isArray(db.homeProjects)) db.homeProjects = db.homeProjects.filter((x) => x !== id);
  await saveDb(db);
  revalidatePath('/', 'layout');
  return Response.json({ ok: true });
}

/** PUT { collection, items } replaces one editable collection in db.json. */
export async function PUT(request) {
  const denied = await checkAdmin(request);
  if (denied) return denied;

  let body;
  try { body = await request.json(); } catch { return Response.json({ error: 'Invalid JSON.' }, { status: 400 }); }
  const { collection, items } = body || {};

  if (!EDITABLE_COLLECTIONS.includes(collection)) {
    return Response.json({ error: `Unknown collection "${collection}".` }, { status: 400 });
  }
  if (!Array.isArray(items) || items.some((i) => !i || typeof i !== 'object' || typeof i.id !== 'string')) {
    return Response.json({ error: 'items must be an array of objects with a string id.' }, { status: 400 });
  }
  if (collection === 'caseStudies') {
    const slugs = items.map((i) => i.slug);
    if (slugs.some((s) => !s || !SLUG_RE.test(s))) {
      return Response.json({ error: 'Every project needs a slug using a-z, 0-9 and hyphens.' }, { status: 400 });
    }
    if (new Set(slugs).size !== slugs.length) {
      return Response.json({ error: 'Project slugs must be unique.' }, { status: 400 });
    }
  }

  const db = await getDb();
  db[collection] = items;
  await saveDb(db);
  revalidatePath('/', 'layout');
  return Response.json({ ok: true, count: items.length });
}
