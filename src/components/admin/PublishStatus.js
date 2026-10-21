'use client';

import { useCallback, useEffect, useState } from 'react';
import { CloudUpload } from 'lucide-react';

/** Shows whether content changes have reached GitHub (only when AUTO_PUSH is on), with a "Publish now" button. */
export default function PublishStatus() {
  const [info, setInfo] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/publish', { cache: 'no-store' });
      if (res.ok) setInfo(await res.json());
    } catch {}
  }, []);

  useEffect(() => {
    const first = setTimeout(load, 0);
    const id = setInterval(load, 4000);
    return () => { clearTimeout(first); clearInterval(id); };
  }, [load]);

  if (!info?.enabled) return null;

  const publish = async () => {
    setBusy(true);
    try {
      const res = await fetch('/api/publish', { method: 'POST' });
      if (res.ok) setInfo(await res.json());
    } catch {}
    setBusy(false);
  };

  const label = { idle: 'Auto-publish on', pending: 'Changes waiting to publish…', pushing: 'Publishing…', ok: info.message || 'Published', error: info.message }[info.state];
  return (
    <span className={`ad-publish is-${info.state}`} role="status" aria-live="polite" title={info.message}>
      <CloudUpload size={14} aria-hidden="true" /><span>{label}</span>
      {(info.state === 'pending' || info.state === 'error') && (
        <button type="button" className="ad-link" onClick={publish} disabled={busy}>Publish now</button>
      )}
    </span>
  );
}
