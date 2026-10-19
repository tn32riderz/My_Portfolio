'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AdminContext } from './AdminContext';

async function parse(res, fallback) {
  const json = await res.json().catch(() => ({}));
  if (res.status === 401) throw new Error('Your session expired. Reload the page to sign in again.');
  if (!res.ok) throw new Error(json.error || fallback);
  return json;
}

/** Same-origin requests carry the HttpOnly session cookie automatically. */
export default function AdminProvider({ children }) {
  const router = useRouter();

  /** JSON request to /api/portfolio. Throws an Error carrying the server's message. */
  const request = useCallback(async (method, payload) => parse(
    await fetch('/api/portfolio', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
    'Request failed.'
  ), []);

  /** Saves the ordered list of case-study ids shown on the home page. */
  const saveHighlights = useCallback(async (ids) => parse(
    await fetch('/api/portfolio/highlights', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids }) }),
    'Could not save the home page highlights.'
  ), []);

  const upload = useCallback(async (file) => {
    const body = new FormData();
    body.append('file', file);
    return (await parse(await fetch('/api/upload', { method: 'POST', body }), 'Upload failed.')).url;
  }, []);

  const logout = useCallback(async () => {
    await fetch('/api/admin/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'logout' }) });
    router.refresh();
  }, [router]);

  return <AdminContext.Provider value={{ editingEnabled: true, request, upload, saveHighlights, logout }}>{children}</AdminContext.Provider>;
}
