'use client';

import { useCallback, useEffect, useState } from 'react';

const KEY = 'appreciated-projects';

function read() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
}

/**
 * Per-visitor "appreciate" toggle. The visitor's own appreciation is kept in
 * localStorage and added on top of the stored count, so it is not a shared total.
 */
export function useAppreciation(project) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const sync = () => setLiked(read().includes(project.id));
    sync();
    window.addEventListener('appreciation-change', sync);
    return () => window.removeEventListener('appreciation-change', sync);
  }, [project.id]);

  const toggle = useCallback(() => {
    const list = read();
    const next = list.includes(project.id) ? list.filter((i) => i !== project.id) : [...list, project.id];
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
    window.dispatchEvent(new Event('appreciation-change'));
  }, [project.id]);

  return { liked, toggle, count: project.appreciations + (liked ? 1 : 0) };
}
