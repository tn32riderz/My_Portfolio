import { isAuthenticated } from '@/lib/adminAuth';
import { getDb, EDITABLE_COLLECTIONS } from '@/lib/db';
import { getHomeIds } from '@/lib/content';
import AdminApp from '@/components/admin/AdminApp';

export const metadata = { title: 'Portfolio editor', robots: { index: false, follow: false } };

export default async function AdminPage() {
  if (!(await isAuthenticated())) return null;
  const db = await getDb();
  // Only the editable collections go to the client; leads, API keys and settings stay on the server.
  const initial = Object.fromEntries(EDITABLE_COLLECTIONS.map((k) => [k, db[k] || []]));
  return <AdminApp initial={initial} homeIds={getHomeIds(db)} />;
}
