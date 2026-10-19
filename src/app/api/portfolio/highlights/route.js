import { revalidatePath } from 'next/cache';
import { checkAdmin } from '@/lib/adminAuth';
import { getDb, saveDb } from '@/lib/db';

/** PUT { ids } sets which case studies appear on the home page, and in what order. */
export async function PUT(request) {
  const denied = await checkAdmin(request);
  if (denied) return denied;

  let body;
  try { body = await request.json(); } catch { return Response.json({ error: 'Invalid JSON.' }, { status: 400 }); }
  const { ids } = body || {};
  if (!Array.isArray(ids) || ids.some((id) => typeof id !== 'string') || new Set(ids).size !== ids.length) {
    return Response.json({ error: 'ids must be a list of unique project ids.' }, { status: 400 });
  }

  const db = await getDb();
  const known = new Set((db.caseStudies || []).map((c) => c.id));
  db.homeProjects = ids.filter((id) => known.has(id));
  await saveDb(db);
  revalidatePath('/', 'layout');
  return Response.json({ ok: true, ids: db.homeProjects });
}
