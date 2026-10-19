'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { newId } from '@/lib/projectUtils';
import { ImageField, LinesField, SelectField, TagsField, TextArea, TextField } from './fields';

const RENDER = {
  text: (f, v, set) => <TextField key={f.key} label={f.label} hint={f.hint} value={v} onChange={set} />,
  url: (f, v, set) => <TextField key={f.key} label={f.label} type="url" value={v} onChange={set} />,
  number: (f, v, set) => <TextField key={f.key} label={f.label} type="number" value={v} onChange={set} />,
  textarea: (f, v, set) => <TextArea key={f.key} label={f.label} value={v} onChange={set} />,
  select: (f, v, set) => <SelectField key={f.key} label={f.label} value={v} options={f.options} onChange={set} />,
  image: (f, v, set) => <ImageField key={f.key} label={f.label} hint={f.hint} value={v} onChange={set} />,
  month: (f, v, set) => <TextField key={f.key} label={f.label} hint={f.hint} type="month" value={v} onChange={set} />,
  tags: (f, v, set) => <TagsField key={f.key} label={f.label} value={v} onChange={set} />,
  lines: (f, v, set) => <LinesField key={f.key} label={f.label} value={v} onChange={set} />,
};

/** Schema-driven list editor used for services, testimonials and client logos. */
export default function ListEditor({ items, onChange, fields, titleKey, noun, defaults }) {
  const [selectedId, setSelectedId] = useState(items[0]?.id ?? null);
  const item = items.find((i) => i.id === selectedId);

  const update = (patch) => onChange(items.map((i) => (i.id === selectedId ? { ...i, ...patch } : i)));
  const add = () => {
    const created = { id: newId(noun.slice(0, 3).toLowerCase()), displayOrder: items.length + 1, createdAt: new Date().toISOString(), ...defaults };
    onChange([...items, created]);
    setSelectedId(created.id);
  };
  const remove = () => {
    if (!window.confirm(`Delete this ${noun}?`)) return;
    const rest = items.filter((i) => i.id !== selectedId);
    onChange(rest);
    setSelectedId(rest[0]?.id ?? null);
  };

  return (
    <div className="ad-split">
      <aside className="ad-list" aria-label={`${noun}s`}>
        <button type="button" className="ad-btn" onClick={add}><Plus size={16} /> New {noun}</button>
        <ul>
          {items.map((i) => (
            <li key={i.id}>
              <button type="button" className={`ad-list__item${i.id === selectedId ? ' is-active' : ''}`} onClick={() => setSelectedId(i.id)}>
                <span>{i[titleKey] || `Untitled ${noun}`}</span>
                <small className={`ad-badge ad-badge--${i.status === 'Published' || i.status === 'Active' ? 'live' : 'draft'}`}>{i.status}</small>
              </button>
            </li>
          ))}
        </ul>
      </aside>
      {item ? (
        // key resets uncontrolled "lines" fields when switching item
        <section key={item.id} className="ad-form" aria-label={`Edit ${noun}`}>
          <div className="ad-actions">
            <button type="button" className="ad-btn ad-btn--danger" onClick={remove}><Trash2 size={16} /> Delete</button>
          </div>
          <div className="ad-grid">
            {fields.map((f) => RENDER[f.type](f, item[f.key], (v) => update({ [f.key]: v })))}
          </div>
        </section>
      ) : <p className="ad-hint ad-empty">Nothing here yet.</p>}
    </div>
  );
}
