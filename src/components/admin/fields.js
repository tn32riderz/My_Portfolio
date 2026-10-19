'use client';

import { useId, useState } from 'react';
import { ImagePlus, Loader2 } from 'lucide-react';
import { useAdmin } from './AdminContext';

export function Field({ label, hint, children }) {
  return (
    <div className="ad-field">
      <label className="ad-label">{label}</label>
      {children}
      {hint && <p className="ad-hint">{hint}</p>}
    </div>
  );
}

function wrap(label, hint, id, control) {
  return (
    <div className="ad-field">
      <label className="ad-label" htmlFor={id}>{label}</label>
      {control}
      {hint && <p className="ad-hint">{hint}</p>}
    </div>
  );
}

export function TextField({ label, hint, value, onChange, type = 'text', ...rest }) {
  const id = useId();
  return wrap(label, hint, id,
    <input id={id} className="ad-input" type={type} value={value ?? ''} {...rest}
      onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)} />);
}

export function TextArea({ label, hint, value, onChange, rows = 4 }) {
  const id = useId();
  return wrap(label, hint, id,
    <textarea id={id} className="ad-input" rows={rows} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />);
}

export function SelectField({ label, value, onChange, options }) {
  const id = useId();
  return wrap(label, null, id,
    <select id={id} className="ad-input" value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>);
}

/** One item per line, stored as string[]. */
export function LinesField({ label, hint, value, onChange }) {
  const id = useId();
  const [text, setText] = useState((value || []).join('\n'));
  return wrap(label, hint || 'One item per line.', id,
    <textarea id={id} className="ad-input" rows={4} value={text}
      onChange={(e) => { setText(e.target.value); onChange(e.target.value.split('\n').map((l) => l.trim()).filter(Boolean)); }} />);
}

/** Comma-separated tags, stored as string[]. */
export function TagsField({ label, hint, value, onChange }) {
  const id = useId();
  const [text, setText] = useState((value || []).join(', '));
  return wrap(label, hint || 'Separate with commas.', id,
    <input id={id} className="ad-input" value={text}
      onChange={(e) => { setText(e.target.value); onChange(e.target.value.split(',').map((t) => t.trim()).filter(Boolean)); }} />);
}

/**
 * Uploads one or many images sequentially with a simple progress line.
 * onUploaded receives [{ url }] for the files that succeeded.
 */
export function UploadButton({ onUploaded, label = 'Upload', multiple = false }) {
  const { upload } = useAdmin();
  const [items, setItems] = useState([]); // [{ state: 'uploading' | 'done' | 'error', error? }]
  const id = useId();
  const busy = items.some((i) => i.state === 'uploading');

  const pick = async (e) => {
    const files = [...(e.target.files || [])];
    e.target.value = '';
    if (!files.length) return;
    setItems(files.map(() => ({ state: 'uploading' })));
    const results = [];
    for (let i = 0; i < files.length; i++) {
      try {
        const url = await upload(files[i]);
        results.push({ url });
        setItems((list) => list.map((it, j) => (j === i ? { ...it, state: 'done' } : it)));
      } catch (err) {
        setItems((list) => list.map((it, j) => (j === i ? { ...it, state: 'error', error: err.message } : it)));
      }
    }
    if (results.length) onUploaded(results);
  };

  return (
    <span className="ad-upload">
      <label htmlFor={id} className="ad-btn ad-btn--ghost">
        {busy ? <Loader2 size={16} className="ad-spin" aria-hidden="true" /> : <ImagePlus size={16} aria-hidden="true" />}
        {busy ? 'Uploading…' : label}
      </label>
      <input id={id} type="file" multiple={multiple} accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
        className="ad-sr" onChange={pick} disabled={busy} />
      {items.length > 0 && (
        <p className="ad-uploads" aria-live="polite">
          {busy
            ? `Uploading ${items.filter((i) => i.state !== 'uploading').length + 1} of ${items.length}…`
            : items.filter((i) => i.state === 'error').map((i) => i.error).join(' ')}
        </p>
      )}
    </span>
  );
}

export function ImageField({ label, hint, value, onChange }) {
  const id = useId();
  return (
    <div className="ad-field">
      <label className="ad-label" htmlFor={id}>{label}</label>
      <div className="ad-row">
        <input id={id} className="ad-input" placeholder="https://… or upload" value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
        <UploadButton onUploaded={([first]) => onChange(first.url)} />
      </div>
      {hint && <p className="ad-hint">{hint}</p>}
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="ad-thumb" src={value} alt="" />
      )}
    </div>
  );
}
