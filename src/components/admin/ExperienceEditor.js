'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { formatDuration, companySpan, monthsBetween } from '@/lib/duration';
import { newId } from '@/lib/projectUtils';
import { LinesField, SelectField, TagsField, TextArea, TextField } from './fields';

const emptyPosition = () => ({ id: newId('pos'), role: '', start: '', end: '', description: '', points: [], skills: [] });
const emptyCompany = (order) => ({
  id: newId('co'), company: '', location: '', status: 'Draft', displayOrder: order, createdAt: new Date().toISOString(), positions: [emptyPosition()],
});
const isLive = (c) => c.status === 'Published' || c.status === 'Active';

/** Experience grouped like LinkedIn: one company, several positions underneath. */
export default function ExperienceEditor({ items, onChange }) {
  const [selectedId, setSelectedId] = useState(items[0]?.id ?? null);
  const company = items.find((c) => c.id === selectedId);

  const update = (patch) => onChange(items.map((c) => (c.id === selectedId ? { ...c, ...patch } : c)));
  const updatePosition = (id, patch) => update({ positions: company.positions.map((p) => (p.id === id ? { ...p, ...patch } : p)) });

  const addCompany = () => {
    const created = emptyCompany(items.length + 1);
    onChange([...items, created]);
    setSelectedId(created.id);
  };
  const removeCompany = () => {
    if (!window.confirm(`Delete ${company.company || 'this company'} and all its positions?`)) return;
    const rest = items.filter((c) => c.id !== selectedId);
    onChange(rest);
    setSelectedId(rest[0]?.id ?? null);
  };
  const removePosition = (p) => {
    if (!window.confirm(`Delete the position "${p.role || 'Untitled'}"?`)) return;
    update({ positions: company.positions.filter((x) => x.id !== p.id) });
  };

  const span = company ? companySpan(company.positions.filter((p) => p.start)) : null;

  return (
    <div className="ad-split">
      <aside className="ad-list" aria-label="Companies">
        <button type="button" className="ad-btn" onClick={addCompany}><Plus size={16} /> New company</button>
        <ul>
          {items.map((c) => (
            <li key={c.id}>
              <button type="button" className={`ad-list__item${c.id === selectedId ? ' is-active' : ''}`} onClick={() => setSelectedId(c.id)}>
                <span>{c.company || 'Untitled company'}<small className="ad-sub">{c.positions.length} {c.positions.length === 1 ? 'position' : 'positions'}</small></span>
                <small className={`ad-badge ad-badge--${isLive(c) ? 'live' : 'draft'}`}>{c.status}</small>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {company ? (
        <section key={company.id} className="ad-form" aria-label={`Edit ${company.company || 'company'}`}>
          <div className="ad-actions">
            <button type="button" className="ad-btn ad-btn--danger" onClick={removeCompany}><Trash2 size={16} /> Delete company</button>
          </div>

          <h3>Company</h3>
          <div className="ad-grid">
            <TextField label="Company" value={company.company} onChange={(v) => update({ company: v })} />
            <TextField label="Location" value={company.location} onChange={(v) => update({ location: v })} />
            <SelectField label="Status" value={company.status} options={['Draft', 'Published']} onChange={(v) => update({ status: v })} />
            <TextField label="Display order" type="number" value={company.displayOrder ?? 0} onChange={(v) => update({ displayOrder: v })} />
          </div>
          {span && <p className="ad-hint">Total time at this company, worked out from the positions below: <strong>{formatDuration(span.months)}</strong>.</p>}

          <h3>Positions at {company.company || 'this company'}</h3>
          <p className="ad-hint">Newest first on the site, sorted by date. Leave End month empty for the current role.</p>
          <ol className="ad-blocks">
            {company.positions.map((p, i) => (
              <li key={p.id} className="ad-block">
                <div className="ad-block__bar">
                  <strong>{i + 1}. {p.role || 'New position'}
                    {p.start && <small className="ad-sub"> {formatDuration(monthsBetween(p.start, p.end))}</small>}
                  </strong>
                  <button type="button" className="ad-icon ad-icon--danger" onClick={() => removePosition(p)} aria-label={`Delete position ${p.role || i + 1}`}><Trash2 size={16} /></button>
                </div>
                <div className="ad-grid">
                  <TextField label="Job title" value={p.role} onChange={(v) => updatePosition(p.id, { role: v })} />
                  <TextField label="Start month" type="month" value={p.start} onChange={(v) => updatePosition(p.id, { start: v })} />
                  <TextField label="End month" type="month" value={p.end} onChange={(v) => updatePosition(p.id, { end: v })} hint="Empty = Present" />
                </div>
                <TextArea label="Summary" rows={3} value={p.description} onChange={(v) => updatePosition(p.id, { description: v })} />
                <LinesField label="Highlights" value={p.points} onChange={(v) => updatePosition(p.id, { points: v })} />
                <TagsField label="Skill tags" value={p.skills} onChange={(v) => updatePosition(p.id, { skills: v })} />
              </li>
            ))}
          </ol>
          <div className="ad-row">
            <button type="button" className="ad-btn ad-btn--ghost" onClick={() => update({ positions: [emptyPosition(), ...company.positions] })}>
              <Plus size={14} /> Add position
            </button>
          </div>
        </section>
      ) : <p className="ad-hint ad-empty">No companies yet. Add one.</p>}
    </div>
  );
}
